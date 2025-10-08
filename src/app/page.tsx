'use client';

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { BrandSearch } from '@/components/BrandSearch';
import { BrandSummary } from '@/components/BrandSummary';
import { brandProfileSchema, type BrandProfile } from '@/lib/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

async function fetchBrandProfile(brandName: string): Promise<{ profile: BrandProfile; mode: 'mock' | 'live' }> {
  const response = await fetch('/api/brand', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brandName }),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch brand data');
  }
  const json = await response.json();
  const profile = brandProfileSchema.parse(json);
  const mode = (response.headers.get('x-data-mode') as 'mock' | 'live') ?? 'mock';
  return { profile, mode };
}

export default function Page() {
  const [profile, setProfile] = useState<BrandProfile | null>(null);
  const [dataMode, setDataMode] = useState<'mock' | 'live'>('mock');

  const mutation = useMutation({
    mutationFn: fetchBrandProfile,
    onSuccess: ({ profile: result, mode }) => {
      setProfile(result);
      setDataMode(mode);
    },
  });

  useEffect(() => {
    mutation.mutate('Anker');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoading = mutation.isPending;
  const hasError = mutation.isError;

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-slate-900">Brand Intelligence Explorer</h1>
        <p className="max-w-3xl text-sm text-slate-600">
          Search for a brand to synthesize pricing, audience, conversion, highlights, timing, and competitor signals. When no
          live integrations are configured we fall back to curated demo data.
        </p>
      </header>

      <BrandSearch defaultValue="Anker" onSearch={(name) => mutation.mutate(name)} loading={isLoading} />

      {hasError ? (
        <Card className="border-rose-200 bg-rose-50">
          <CardHeader>
            <CardTitle className="text-rose-700">Unable to load brand insight</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-rose-700">
            <p>We could not retrieve the requested brand. Please try again or rely on the demo dataset.</p>
            <button
              type="button"
              onClick={() => mutation.reset()}
              className="text-sm font-semibold text-rose-700 underline"
            >
              Dismiss
            </button>
          </CardContent>
        </Card>
      ) : null}

      {isLoading && !profile ? <LoadingState /> : null}

      {profile ? <BrandSummary profile={profile} dataMode={dataMode} /> : null}

      <footer className="border-t border-slate-200 pt-6 text-xs text-slate-500">
        <p>
          Data mode: <Badge className="bg-slate-200 text-slate-700">{dataMode.toUpperCase()}</Badge>. Toggle live providers by
          configuring environment variables as documented in the README.
        </p>
      </footer>
    </main>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-48 w-full" />
        ))}
      </div>
    </div>
  );
}
