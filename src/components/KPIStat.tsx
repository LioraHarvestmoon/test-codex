import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tooltip } from './ui/tooltip';
import { Badge } from './ui/badge';
import { Source } from '@/lib/schema';

export type KPIStatProps = {
  title: string;
  description?: string;
  children: ReactNode;
  sources?: Source[];
};

export function KPIStat({ title, description, children, sources = [] }: KPIStatProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? <p className="mt-1 text-xs text-slate-500">{description}</p> : null}
        </div>
        {sources.length > 0 ? (
          <Tooltip
            label={
              <div className="space-y-1">
                <p className="font-medium text-slate-700">Sources</p>
                <ul className="space-y-1">
                  {sources.map((source) => (
                    <li key={`${source.label}-${source.fetchedAt}`} className="text-xs text-slate-600">
                      <span className="font-semibold">{source.label}</span>
                      <span className="ml-1">· {new Date(source.fetchedAt).toLocaleDateString()}</span>
                      <Badge className="ml-2 bg-slate-100 text-slate-600">{Math.round(source.confidence * 100)}%</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            }
          >
            <Badge className="cursor-help bg-slate-900 text-white">Sources</Badge>
          </Tooltip>
        ) : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
