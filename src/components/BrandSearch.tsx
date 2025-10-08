'use client';

import { FormEvent, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const PRESETS = ['Anker', 'Nike', 'DJI'];

export type BrandSearchProps = {
  defaultValue?: string;
  onSearch: (brand: string) => void;
  loading?: boolean;
};

export function BrandSearch({ defaultValue = 'Anker', onSearch, loading }: BrandSearchProps) {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3" aria-label="Brand search form">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          aria-label="Brand name"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search for a brand"
        />
        <Button type="submit" disabled={loading} aria-label="Search brand">
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
        Quick picks:
        {PRESETS.map((preset) => (
          <Button
            key={preset}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setValue(preset);
              onSearch(preset);
            }}
            aria-label={`Use preset ${preset}`}
          >
            {preset}
          </Button>
        ))}
      </div>
    </form>
  );
}
