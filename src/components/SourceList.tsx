import { Source } from '@/lib/schema';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export function SourceList({ sources }: { sources: Source[] }) {
  if (sources.length === 0) {
    return <p className="text-sm text-slate-500">No sources available.</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Label</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Confidence</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {sources.map((source) => (
            <TableRow key={`${source.label}-${source.fetchedAt}`}>
              <TableCell>
                {source.url ? (
                  <a href={source.url} className="text-brand underline" target="_blank" rel="noreferrer">
                    {source.label}
                  </a>
                ) : (
                  source.label
                )}
              </TableCell>
              <TableCell>{new Date(source.fetchedAt).toLocaleString()}</TableCell>
              <TableCell>{Math.round(source.confidence * 100)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
