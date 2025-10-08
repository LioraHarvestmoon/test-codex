import { describe, expect, it } from 'vitest';
import { POST } from '@/app/api/brand/route';
import { brandProfileSchema } from '@/lib/schema';

describe('Brand API', () => {
  it('returns a brand profile for Anker', async () => {
    const request = new Request('http://localhost/api/brand', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brandName: 'Anker' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(response.headers.get('x-data-mode')).toBe('mock');

    const json = await response.json();
    const parsed = brandProfileSchema.parse(json);
    expect(parsed.brandName).toBe('Anker');
    expect(parsed.overview.length).toBeGreaterThan(10);
    expect(parsed.sources.length).toBeGreaterThan(0);
  });
});
