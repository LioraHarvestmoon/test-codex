import { loadMockBrandProfile } from '@/lib/mock';
import { ProviderResult } from '@/lib/merge';

const SOURCE_LABEL = 'Mock Social Listening';

export async function fetchSocial(brandName: string): Promise<ProviderResult> {
  const profile = await loadMockBrandProfile(brandName);
  // TODO(api): Connect to social listening data sources (e.g., Sprout Social) when tokens are available.
  return {
    provider: 'social',
    confidence: 0.6,
    audience: profile.audience,
    highlights: profile.highlights,
    timeWindows: profile.timeWindows,
    sources:
      profile.sources.filter((source) => source.label.includes('Social')) ||
      (profile.audience
        ? [
            {
              label: SOURCE_LABEL,
              fetchedAt: new Date().toISOString(),
              confidence: 0.6,
            },
          ]
        : []),
  };
}
