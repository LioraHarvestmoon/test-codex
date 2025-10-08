import { BrandProfile } from './schema';

type Value = BrandProfile[keyof BrandProfile];

export function scoreFieldCompleteness(value: Value | undefined): number {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'string') {
    return value.trim().length > 0 ? Math.min(1, value.trim().length / 280) : 0;
  }
  if (Array.isArray(value)) {
    return value.length === 0 ? 0 : Math.min(1, value.length / 5);
  }
  if (typeof value === 'number') {
    return isFinite(value) ? 1 : 0;
  }
  if (typeof value === 'object') {
    const keys = Object.values(value).filter(Boolean).length;
    const total = Object.keys(value).length || 1;
    return Math.min(1, keys / total);
  }
  return 0;
}

export function blendConfidence(base: number, completeness: number): number {
  const weighted = base * 0.7 + completeness * 0.3;
  return Number(weighted.toFixed(3));
}

export function penalizeMissingFields(confidence: number, missingRatio: number): number {
  const penalty = missingRatio * 0.2;
  return Number(Math.max(0, confidence - penalty).toFixed(3));
}
