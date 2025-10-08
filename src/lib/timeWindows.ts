import { TimeWindows } from './schema';

export type InteractionLog = {
  timestamp: string;
  weight?: number;
};

const DOW_MAP = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function deriveWeeklyHotHours(logs: InteractionLog[]): TimeWindows['weeklyHotHours'] {
  if (logs.length === 0) return undefined;
  const buckets = new Map<number, Set<number>>();
  logs.forEach((log) => {
    const date = new Date(log.timestamp);
    const dow = date.getDay();
    const hour = date.getHours();
    if (!buckets.has(dow)) buckets.set(dow, new Set());
    if (log.weight !== 0) {
      buckets.get(dow)?.add(hour);
    }
  });
  return Array.from(buckets.entries()).map(([dow, hours]) => ({ dow, hours: Array.from(hours).sort((a, b) => a - b) }));
}

export function formatDow(dow: number): string {
  return DOW_MAP[dow] ?? `Day ${dow}`;
}

export function summarizeTimeWindow(windows: TimeWindows | undefined): string | undefined {
  if (!windows) return undefined;
  if (windows.rationale) return windows.rationale;
  if (windows.weeklyHotHours && windows.weeklyHotHours.length > 0) {
    const top = windows.weeklyHotHours
      .map((item) => `${formatDow(item.dow)}: ${item.hours.join(', ')}`)
      .slice(0, 2)
      .join(' | ');
    return `Derived from historical session logs (${top})`;
  }
  if (windows.dailyHotHours && windows.dailyHotHours.length > 0) {
    return `Daily peaks around ${windows.dailyHotHours.join(', ')}h`;
  }
  return undefined;
}
