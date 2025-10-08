import { Badge } from './ui/badge';

export function ConfidenceTag({ confidence }: { confidence: number }) {
  const label = `${Math.round(confidence * 100)}% confidence`;
  const tone = confidence >= 0.7 ? 'bg-emerald-100 text-emerald-700' : confidence >= 0.4 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700';
  return <Badge className={tone}>{label}</Badge>;
}
