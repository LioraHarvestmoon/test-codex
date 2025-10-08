import { loadMockBrandProfile } from '@/lib/mock';
import { ProviderResult } from '@/lib/merge';

const SOURCE_LABEL = 'Mock Commerce Feed';

export async function fetchEcommerce(brandName: string): Promise<ProviderResult> {
  const profile = await loadMockBrandProfile(brandName);
  // TODO(api): Plug into commerce marketplace APIs for real-time pricing.
  return {
    provider: 'ecommerce',
    confidence: 0.7,
    priceBand: profile.priceBand,
    sources:
      profile.sources.filter((source) => source.label.includes('Commerce')) ||
      (profile.priceBand
        ? [
            {
              label: SOURCE_LABEL,
              fetchedAt: new Date().toISOString(),
              confidence: 0.7,
            },
          ]
        : []),
  };
}
