'use client';

import { useState } from 'react';
import { BrandProfile } from '@/lib/schema';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { KPIStat } from './KPIStat';
import { CardSection } from './CardSection';
import { ConfidenceTag } from './ConfidenceTag';
import { SourceList } from './SourceList';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { formatDow, summarizeTimeWindow } from '@/lib/timeWindows';

export type BrandSummaryProps = {
  profile: BrandProfile;
  dataMode?: 'mock' | 'live';
};

export function BrandSummary({ profile, dataMode = 'mock' }: BrandSummaryProps) {
  const [showAllHighlights, setShowAllHighlights] = useState(false);
  const highlightBullets = profile.highlights?.bullets ?? [];
  const highlightSlice = showAllHighlights ? highlightBullets : highlightBullets.slice(0, 6);

  const getSources = (keyword: string) =>
    profile.sources.filter((source) => source.label.toLowerCase().includes(keyword.toLowerCase()));

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Badge className="bg-slate-900 text-white uppercase">{dataMode === 'mock' ? 'Demo data' : 'Live data'}</Badge>
            <CardTitle className="text-2xl">{profile.brandName}</CardTitle>
            <ConfidenceTag confidence={profile.overallConfidence} />
            <p className="max-w-2xl text-sm text-slate-600">{profile.overview}</p>
            <p className="text-xs uppercase text-slate-500">Categories: {profile.categories.join(', ')}</p>
          </div>
        </CardHeader>
        <CardContent>
          <CardSection title="Key performance insights">
            <KPIStat title="Price range" description={profile.priceBand ? `${profile.priceBand.currency}` : 'Awaiting data'} sources={getSources('commerce')}>
              {profile.priceBand ? (
                <Tabs defaultValue="range">
                  <TabsList>
                    <TabsTrigger value="range">Range</TabsTrigger>
                    <TabsTrigger value="skus">Sample SKUs</TabsTrigger>
                  </TabsList>
                  <TabsContent value="range">
                    <p>
                      {profile.priceBand.currency} {profile.priceBand.low} – {profile.priceBand.high}
                      {profile.priceBand.median ? ` (median ${profile.priceBand.currency} ${profile.priceBand.median})` : null}
                    </p>
                  </TabsContent>
                  <TabsContent value="skus">
                    {profile.priceBand.sampleSkus ? (
                      <ul className="list-inside list-disc text-xs text-slate-500">
                        {profile.priceBand.sampleSkus.map((sku) => (
                          <li key={sku}>{sku}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500">No sample SKUs provided.</p>
                    )}
                  </TabsContent>
                </Tabs>
              ) : (
                <p className="text-sm text-slate-500">No pricing details captured.</p>
              )}
            </KPIStat>

            <KPIStat title="Audience" description="Derived from social insights" sources={getSources('social')}>
              {profile.audience ? (
                <div className="space-y-3">
                  {profile.audience.ageBuckets ? (
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500">Age distribution</p>
                      <ul className="mt-1 space-y-1 text-sm">
                        {profile.audience.ageBuckets.map((bucket) => (
                          <li key={bucket.range} className="flex items-center justify-between gap-2">
                            <span>{bucket.range}</span>
                            <span className="inline-flex h-2 flex-1 items-center bg-slate-200">
                              <span className="h-2 bg-brand" style={{ width: `${Math.round(bucket.weight * 100)}%` }} />
                            </span>
                            <span className="w-12 text-right text-xs text-slate-500">{Math.round(bucket.weight * 100)}%</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {profile.audience.interests ? (
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500">Interests</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {profile.audience.interests.map((interest) => (
                          <Badge key={interest} className="bg-slate-100 text-slate-700">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {profile.audience.regions ? (
                    <p className="text-sm text-slate-600">Regions: {profile.audience.regions.join(', ')}</p>
                  ) : null}
                  {profile.audience.purchasingPower ? (
                    <p className="text-sm text-slate-600">Purchasing power: {profile.audience.purchasingPower}</p>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No audience signals found.</p>
              )}
            </KPIStat>

            <KPIStat title="Conversion signals" description="Operational levers" sources={getSources('internal')}>
              {profile.conversion ? (
                <div className="space-y-2 text-sm">
                  <p className="font-semibold">Est. strength: {profile.conversion.estStrength}</p>
                  {profile.conversion.shipping ? <p>Shipping: {profile.conversion.shipping}</p> : null}
                  {profile.conversion.returns ? <p>Returns: {profile.conversion.returns}</p> : null}
                  {profile.conversion.promos ? (
                    <p>Promos: {profile.conversion.promos.join(', ')}</p>
                  ) : null}
                  {profile.conversion.notes ? (
                    <ul className="list-inside list-disc text-xs text-slate-500">
                      {profile.conversion.notes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Conversion experience TBD.</p>
              )}
            </KPIStat>

            <KPIStat title="Highlights" description="Messaging cues" sources={getSources('social')}>
              {highlightSlice.length > 0 ? (
                <div className="space-y-2">
                  <ul className="list-inside list-disc space-y-1 text-sm">
                    {highlightSlice.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  {highlightBullets.length > 6 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllHighlights((value) => !value)}
                    >
                      {showAllHighlights ? 'Show less' : 'Show more'}
                    </Button>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No highlighted propositions yet.</p>
              )}
            </KPIStat>

            <KPIStat title="Time windows" description="Best performing slots" sources={getSources('social')}>
              {profile.timeWindows ? (
                <div className="space-y-2 text-sm">
                  {profile.timeWindows.weeklyHotHours ? (
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500">Weekly peaks</p>
                      <ul className="mt-1 space-y-1">
                        {profile.timeWindows.weeklyHotHours.map((slot) => (
                          <li key={`${slot.dow}-${slot.hours.join(',')}`}>
                            {formatDow(slot.dow)}: {slot.hours.join(', ')}h
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {profile.timeWindows.dailyHotHours ? (
                    <p>Daily spikes: {profile.timeWindows.dailyHotHours.join(', ')}h</p>
                  ) : null}
                  <p className="text-xs text-slate-500">{summarizeTimeWindow(profile.timeWindows)}</p>
                </div>
              ) : (
                <p className="text-sm text-slate-500">No time-window inferences.</p>
              )}
            </KPIStat>

            <KPIStat title="Competitors" description="Benchmark set" sources={getSources('wiki')}>
              {profile.competitors && profile.competitors.length > 0 ? (
                <ul className="list-inside list-disc space-y-1 text-sm">
                  {profile.competitors.map((competitor) => (
                    <li key={competitor.name}>
                      <span className="font-medium">{competitor.name}</span>
                      {competitor.note ? <span className="text-slate-500"> — {competitor.note}</span> : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">No competitor set captured.</p>
              )}
            </KPIStat>
          </CardSection>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-800">Source audit trail</h2>
        <SourceList sources={profile.sources} />
      </section>
    </div>
  );
}
