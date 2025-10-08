import { BrandProfile, Source, brandProfileSchema } from './schema';
import { blendConfidence, penalizeMissingFields, scoreFieldCompleteness } from './scoring';

export type ProviderResult = Partial<BrandProfile> & {
  provider: string;
  confidence: number; // 0-1
  sources: Source[];
};

type FieldKey = Exclude<keyof BrandProfile, 'brandName' | 'sources' | 'overallConfidence'>;

const FIELD_KEYS: FieldKey[] = [
  'overview',
  'categories',
  'priceBand',
  'audience',
  'conversion',
  'highlights',
  'timeWindows',
  'competitors',
];

export function mergeBrandProfiles(brandName: string, providerResults: ProviderResult[]): BrandProfile {
  const aggregate: Partial<BrandProfile> = {
    brandName,
    categories: [],
    sources: [],
  };

  const fieldScores: number[] = [];

  FIELD_KEYS.forEach((field) => {
    let bestScore = -1;
    let bestValue: BrandProfile[FieldKey] | undefined;

    providerResults.forEach((result) => {
      const value = result[field];
      if (value === undefined) return;
      const completeness = scoreFieldCompleteness(value as BrandProfile[FieldKey]);
      const score = blendConfidence(result.confidence, completeness);
      if (score > bestScore) {
        bestScore = score;
        bestValue = value as BrandProfile[FieldKey];
      }
    });

    if (bestValue !== undefined) {
      if (Array.isArray(bestValue) && field === 'categories') {
        const categories = new Set<string>(Array.isArray(aggregate.categories) ? aggregate.categories : []);
        (bestValue as string[]).forEach((item) => categories.add(item));
        aggregate.categories = Array.from(categories);
      } else if (Array.isArray(bestValue) && field === 'competitors') {
        const existing = new Map<string, { name: string; note?: string }>();
        if (Array.isArray(aggregate.competitors)) {
          aggregate.competitors.forEach((c) => existing.set(c.name, c));
        }
        (bestValue as BrandProfile['competitors'])?.forEach((comp) => {
          existing.set(comp.name, { ...existing.get(comp.name), ...comp });
        });
        aggregate.competitors = Array.from(existing.values());
      } else {
        (aggregate as Record<string, unknown>)[field] = bestValue;
      }
      if (bestScore >= 0) {
        fieldScores.push(bestScore);
      }
    }
  });

  const sources = dedupeSources(providerResults.flatMap((result) => result.sources));
  aggregate.sources = sources;

  const presentCount = FIELD_KEYS.filter((field) => aggregate[field] !== undefined).length;
  const missingRatio = (FIELD_KEYS.length - presentCount) / FIELD_KEYS.length;
  const averageScore = fieldScores.length > 0 ? fieldScores.reduce((sum, val) => sum + val, 0) / fieldScores.length : 0;
  const overallConfidence = penalizeMissingFields(averageScore, missingRatio);

  aggregate.overallConfidence = Number(Math.min(1, Math.max(0, overallConfidence)).toFixed(3));

  return brandProfileSchema.parse(aggregate);
}

function dedupeSources(sources: Source[]): Source[] {
  const seen = new Map<string, Source>();
  sources.forEach((source) => {
    const key = `${source.label}-${source.url ?? ''}`;
    if (!seen.has(key) || (seen.get(key)?.confidence ?? 0) < source.confidence) {
      seen.set(key, source);
    }
  });
  return Array.from(seen.values()).sort((a, b) => b.confidence - a.confidence);
}
