import fs from 'node:fs/promises';
import path from 'node:path';
import { brandProfileSchema, type BrandProfile } from './schema';

const MOCK_MAP: Record<string, string> = {
  nike: 'nike.json',
  anker: 'anker.json',
};

export async function loadMockBrandProfile(brandName: string): Promise<BrandProfile> {
  const normalized = brandName.trim().toLowerCase();
  const fileName = MOCK_MAP[normalized] ?? 'default.json';
  const filePath = path.join(process.cwd(), 'src', 'mock', fileName);
  const raw = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(raw);
  return brandProfileSchema.parse(data);
}
