import { describe, expect, it } from 'vitest';
import { mergeBrandProfiles, type ProviderResult } from '@/lib/merge';

const baseSources = [{ label: 'Source A', fetchedAt: '2024-02-01T00:00:00Z', confidence: 0.6 }];

describe('mergeBrandProfiles', () => {
  it('prefers higher confidence provider values', () => {
    const wiki: ProviderResult = {
      provider: 'wiki',
      confidence: 0.6,
      overview: 'Wiki overview',
      categories: ['Cat1'],
      sources: baseSources,
    };
    const social: ProviderResult = {
      provider: 'social',
      confidence: 0.8,
      overview: 'Social overview',
      categories: ['Cat2'],
      sources: baseSources,
    };

    const merged = mergeBrandProfiles('Test Brand', [wiki, social]);
    expect(merged.overview).toBe('Social overview');
    expect(merged.categories).toContain('Cat1');
    expect(merged.categories).toContain('Cat2');
    expect(merged.overallConfidence).toBeGreaterThan(0.3);
  });

  it('deduplicates sources and competitors', () => {
    const result: ProviderResult = {
      provider: 'wiki',
      confidence: 0.6,
      competitors: [
        { name: 'CompA', note: 'From wiki' },
        { name: 'CompB' },
      ],
      sources: [
        { label: 'Source A', fetchedAt: '2024-02-01T00:00:00Z', confidence: 0.6 },
        { label: 'Source A', fetchedAt: '2024-02-02T00:00:00Z', confidence: 0.7 },
      ],
    };

    const merged = mergeBrandProfiles('Test Brand', [result]);
    expect(merged.competitors?.length).toBe(2);
    expect(merged.sources.length).toBe(1);
    expect(merged.sources[0].confidence).toBe(0.7);
  });
});
