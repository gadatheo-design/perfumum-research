import { getDb } from './db';
import { sql } from 'drizzle-orm';

const PROFILES: Record<string, Record<string, number>> = {
  'Afghan Kush': { 'Myrcene': 0.45, 'Limonene': 0.12, 'β-Caryophyllene': 0.18, 'α-Pinene': 0.08, 'Linalool': 0.15 },
  'Hindu Kush': { 'Myrcene': 0.52, 'β-Caryophyllene': 0.22, 'Limonene': 0.10, 'Humulene': 0.08, 'α-Pinene': 0.06 },
  'Thai': { 'Terpinolene': 0.35, 'Limonene': 0.25, 'β-Caryophyllene': 0.15, 'Myrcene': 0.12, 'Ocimene': 0.08 },
  'Acapulco Gold': { 'Limonene': 0.35, 'Myrcene': 0.20, 'β-Caryophyllene': 0.18, 'α-Pinene': 0.12, 'Terpinolene': 0.08 },
  'Colombian Gold': { 'Limonene': 0.32, 'Myrcene': 0.22, 'β-Caryophyllene': 0.16, 'α-Pinene': 0.14, 'Terpinolene': 0.10 },
  'Durban Poison': { 'Terpinolene': 0.40, 'Myrcene': 0.18, 'β-Caryophyllene': 0.12, 'Ocimene': 0.10, 'α-Pinene': 0.08 },
  'Malawi Gold': { 'Terpinolene': 0.35, 'Limonene': 0.22, 'Myrcene': 0.15, 'β-Caryophyllene': 0.12, 'α-Pinene': 0.08 },
  'Jamaican': { 'Limonene': 0.28, 'Myrcene': 0.24, 'β-Caryophyllene': 0.18, 'Terpinolene': 0.15, 'α-Pinene': 0.10 },
  'Nepalese': { 'Myrcene': 0.40, 'β-Caryophyllene': 0.20, 'Limonene': 0.15, 'α-Pinene': 0.10, 'Linalool': 0.08 },
  'Lebanese': { 'Myrcene': 0.38, 'β-Caryophyllene': 0.18, 'Limonene': 0.15, 'α-Pinene': 0.12, 'Humulene': 0.08 },
  'Moroccan': { 'Myrcene': 0.42, 'β-Caryophyllene': 0.18, 'Limonene': 0.12, 'α-Pinene': 0.10, 'Linalool': 0.08 },
  'Hawaiian': { 'Limonene': 0.30, 'Myrcene': 0.22, 'β-Caryophyllene': 0.15, 'Terpinolene': 0.12, 'Ocimene': 0.10 },
  'Panama Red': { 'Limonene': 0.30, 'Terpinolene': 0.22, 'Myrcene': 0.18, 'β-Caryophyllene': 0.15, 'α-Pinene': 0.10 }
};

const REGIONAL: Record<string, Record<string, number>> = {
  'Afghanistan': { 'Myrcene': 0.45, 'β-Caryophyllene': 0.20, 'Limonene': 0.10, 'Linalool': 0.12, 'α-Pinene': 0.08 },
  'Pakistan': { 'Myrcene': 0.48, 'β-Caryophyllene': 0.22, 'Limonene': 0.12, 'α-Pinene': 0.08, 'Humulene': 0.06 },
  'India': { 'Myrcene': 0.38, 'Limonene': 0.22, 'β-Caryophyllene': 0.16, 'Linalool': 0.12, 'α-Pinene': 0.08 },
  'Thailand': { 'Terpinolene': 0.32, 'Limonene': 0.25, 'β-Caryophyllene': 0.14, 'Myrcene': 0.12, 'Ocimene': 0.08 },
  'Mexico': { 'Limonene': 0.32, 'Myrcene': 0.20, 'β-Caryophyllene': 0.16, 'α-Pinene': 0.12, 'Terpinolene': 0.10 },
  'Colombia': { 'Limonene': 0.30, 'Myrcene': 0.22, 'β-Caryophyllene': 0.16, 'Terpinolene': 0.12, 'α-Pinene': 0.10 },
  'Jamaica': { 'Limonene': 0.28, 'Myrcene': 0.24, 'β-Caryophyllene': 0.18, 'Terpinolene': 0.14, 'α-Pinene': 0.10 },
  'South Africa': { 'Terpinolene': 0.35, 'Limonene': 0.22, 'Myrcene': 0.18, 'β-Caryophyllene': 0.12, 'Ocimene': 0.08 },
  'Morocco': { 'Myrcene': 0.42, 'β-Caryophyllene': 0.18, 'Limonene': 0.12, 'α-Pinene': 0.10, 'Linalool': 0.08 },
  'Lebanon': { 'Myrcene': 0.38, 'β-Caryophyllene': 0.18, 'Limonene': 0.15, 'α-Pinene': 0.12, 'Humulene': 0.08 }
};

function findProfile(name: string, origin?: string | null): Record<string, number> | null {
  const n = name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  for (const [k, p] of Object.entries(PROFILES)) if (k.toLowerCase().includes(n) || n.includes(k.toLowerCase())) return p;
  if (origin) for (const [r, p] of Object.entries(REGIONAL)) if (origin.toLowerCase().includes(r.toLowerCase())) return p;
  return null;
}

export async function enrichLandraceTerpenes() {
  const db = await getDb(); if (!db) throw new Error('DB unavailable');
  const landraces = ((await db.execute(sql`SELECT id, name, origin FROM cannabis_landraces`))[0] as unknown as any[]);
  const results: any[] = []; let enriched = 0, skipped = 0;
  for (const l of landraces) {
    const existing = ((await db.execute(sql`SELECT COUNT(*) as c FROM landrace_terpenes WHERE landrace_id = ${l.id}`))[0] as unknown as any[])[0]?.c || 0;
    if (existing > 0) { results.push({ name: l.name, status: 'skipped', terpenes: existing }); skipped++; continue; }
    const profile = findProfile(l.name, l.origin);
    if (!profile) { results.push({ name: l.name, status: 'no_profile', terpenes: 0 }); continue; }
    for (const [t, p] of Object.entries(profile)) await db.execute(sql`INSERT INTO landrace_terpenes (landrace_id, terpene_name, percentage) VALUES (${l.id}, ${t}, ${String(Math.round(p * 100) / 100)})`);
    const dom = Object.entries(profile).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([n, p]) => `${n} (${(p * 100).toFixed(1)}%)`).join(', ');
    await db.execute(sql`UPDATE cannabis_landraces SET dominant_terpenes = ${dom} WHERE id = ${l.id}`);
    results.push({ name: l.name, status: 'enriched', terpenes: Object.keys(profile).length }); enriched++;
  }
  return { total: landraces.length, enriched, skipped, results };
}

export async function getLandraceTerpeneStats() {
  const db = await getDb(); if (!db) throw new Error('DB unavailable');
  const total = ((await db.execute(sql`SELECT COUNT(*) as c FROM cannabis_landraces`))[0] as unknown as any[])[0]?.c || 0;
  const withT = ((await db.execute(sql`SELECT COUNT(DISTINCT landrace_id) as c FROM landrace_terpenes`))[0] as unknown as any[])[0]?.c || 0;
  const top = ((await db.execute(sql`SELECT terpene_name as name, COUNT(*) as count, AVG(CAST(percentage AS DECIMAL(10,4))) as avg FROM landrace_terpenes GROUP BY terpene_name ORDER BY count DESC LIMIT 10`))[0] as unknown as any[]).map((t: any) => ({ name: t.name, count: Number(t.count), avgPercentage: Math.round(Number(t.avg) * 100) / 100 }));
  return { totalLandraces: total, withTerpenes: withT, withoutTerpenes: total - withT, topTerpenes: top };
}
