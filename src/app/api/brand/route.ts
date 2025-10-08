import { NextResponse } from 'next/server';
import { z } from 'zod';
import { mergeBrandProfiles } from '@/lib/merge';
import type { ProviderResult } from '@/lib/merge';
import { brandProfileSchema } from '@/lib/schema';
import { fetchWiki } from '@/providers/wiki';
import { fetchEcommerce } from '@/providers/ecommerce';
import { fetchSocial } from '@/providers/social';
import { fetchInternal } from '@/providers/internal';

const requestSchema = z.object({
  brandName: z.string().min(1),
});

const cache = new Map<string, { expiresAt: number; payload: unknown }>();
const CACHE_TTL_MS = 1000 * 60 * 5;

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const standardized = standardizeBrandName(parsed.data.brandName);
  const cacheKey = standardized.toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.payload, {
      headers: { 'x-data-mode': 'mock' },
    });
  }

  try {
    const providers = await Promise.all([
      safeProvider(() => fetchWiki(standardized)),
      safeProvider(() => fetchEcommerce(standardized)),
      safeProvider(() => fetchSocial(standardized)),
      safeProvider(() => fetchInternal(standardized)),
    ]);

    const merged = mergeBrandProfiles(standardized, providers);
    const payload = brandProfileSchema.parse(merged);

    cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, payload });

    return NextResponse.json(payload, {
      headers: { 'x-data-mode': mockModeHeader() },
    });
  } catch (error) {
    console.error('Failed to build brand profile', error);
    return NextResponse.json({ error: 'Unable to build brand profile' }, { status: 500 });
  }
}

function standardizeBrandName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

async function safeProvider(executor: () => Promise<ProviderResult>): Promise<ProviderResult> {
  try {
    return await executor();
  } catch (error) {
    console.warn('Provider failed, falling back to minimal source', error);
    return { provider: 'fallback', confidence: 0.3, sources: [] } as ProviderResult;
  }
}

function mockModeHeader(): string {
  const enabled = process.env.ENABLE_REAL_PROVIDERS === 'true';
  return enabled ? 'live' : 'mock';
}
