import { z } from 'zod';

export const priceBandSchema = z.object({
  currency: z.string(),
  low: z.number().nonnegative(),
  high: z.number().nonnegative(),
  median: z.number().nonnegative().optional(),
  sampleSkus: z.array(z.string()).optional(),
});

export const audienceSchema = z.object({
  regions: z.array(z.string()).optional(),
  ageBuckets: z
    .array(
      z.object({
        range: z.string(),
        weight: z.number().min(0).max(1),
      })
    )
    .optional(),
  genderSplit: z
    .object({
      male: z.number().min(0).max(1).optional(),
      female: z.number().min(0).max(1).optional(),
      other: z.number().min(0).max(1).optional(),
    })
    .optional(),
  interests: z.array(z.string()).optional(),
  purchasingPower: z.enum(['low', 'mid', 'high']).optional(),
});

export const conversionSignalsSchema = z.object({
  estStrength: z.enum(['weak', 'mid', 'strong']),
  shipping: z.string().optional(),
  returns: z.string().optional(),
  promos: z.array(z.string()).optional(),
  notes: z.array(z.string()).optional(),
});

export const timeWindowSchema = z.object({
  weeklyHotHours: z
    .array(
      z.object({
        dow: z.number().int().min(0).max(6),
        hours: z.array(z.number().int().min(0).max(23)),
      })
    )
    .optional(),
  dailyHotHours: z.array(z.number().int().min(0).max(23)).optional(),
  rationale: z.string().optional(),
});

export const productHighlightsSchema = z.object({
  bullets: z.array(z.string()),
});

export const sourceSchema = z.object({
  label: z.string(),
  url: z.string().url().optional(),
  fetchedAt: z.string(),
  confidence: z.number().min(0).max(1),
});

export const competitorSchema = z.object({
  name: z.string(),
  note: z.string().optional(),
});

export const brandProfileSchema = z.object({
  brandName: z.string(),
  overview: z.string(),
  categories: z.array(z.string()),
  priceBand: priceBandSchema.optional(),
  audience: audienceSchema.optional(),
  conversion: conversionSignalsSchema.optional(),
  highlights: productHighlightsSchema.optional(),
  timeWindows: timeWindowSchema.optional(),
  competitors: z.array(competitorSchema).optional(),
  sources: z.array(sourceSchema),
  overallConfidence: z.number().min(0).max(1),
});

export type PriceBand = z.infer<typeof priceBandSchema>;
export type Audience = z.infer<typeof audienceSchema>;
export type ConversionSignals = z.infer<typeof conversionSignalsSchema>;
export type TimeWindows = z.infer<typeof timeWindowSchema>;
export type ProductHighlights = z.infer<typeof productHighlightsSchema>;
export type Source = z.infer<typeof sourceSchema>;
export type Competitor = z.infer<typeof competitorSchema>;
export type BrandProfile = z.infer<typeof brandProfileSchema>;
