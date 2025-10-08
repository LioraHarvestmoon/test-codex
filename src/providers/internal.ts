import fs from 'node:fs/promises';
import path from 'node:path';
import { ProviderResult } from '@/lib/merge';
import { loadMockBrandProfile } from '@/lib/mock';

const DATA_FILE = path.join(process.cwd(), 'src', 'providers', 'internal-data.json');

async function loadInternalData() {
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(raw) as {
    brands: Record<string, { conversion: ProviderResult['conversion']; sources: ProviderResult['sources'] }>;
  };
}

export async function fetchInternal(brandName: string): Promise<ProviderResult> {
  const normalized = brandName.trim().toLowerCase();
  const data = await loadInternalData();
  const profile = await loadMockBrandProfile(brandName);
  const entry = data.brands[normalized] ?? data.brands.default;
  // TODO(api): Attach first-party CRM / marketing automation insights when available.
  return {
    provider: 'internal',
    confidence: 0.8,
    conversion: entry.conversion,
    sources: entry.sources.length > 0 ? entry.sources : profile.sources.filter((source) => source.label.includes('Internal')),
    highlights: profile.highlights,
  };
}
