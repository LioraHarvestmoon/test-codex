import { loadMockBrandProfile } from '@/lib/mock';
import { ProviderResult } from '@/lib/merge';

const WIKI_SOURCE_LABEL = 'Mock Encyclopedia';

export async function fetchWiki(brandName: string): Promise<ProviderResult> {
  const profile = await loadMockBrandProfile(brandName);
  // TODO(api): Replace with live encyclopedia API when credentials are available.
  return {
    provider: 'wiki',
    confidence: 0.65,
    brandName: profile.brandName,
    overview: profile.overview,
    categories: profile.categories,
    competitors: profile.competitors,
    sources: profile.sources.filter((source) => source.label.includes('Wiki')) || [
      {
        label: WIKI_SOURCE_LABEL,
        fetchedAt: new Date().toISOString(),
        confidence: 0.6,
      },
    ],
  };
}
