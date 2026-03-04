/**
 * Router tRPC pour les corrélations moléculaires inter-domaines
 * Parfum × Tabac × Cannabis
 */
import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { sql } from "drizzle-orm";

export const correlationsRouter = router({
  /**
   * Molécules présentes dans plusieurs domaines (cannabis, tabac, parfum)
   * Exploite la table plant_molecules + plants.category
   */
  getCrossDomainMolecules: publicProcedure
    .input(z.object({
      minDomains: z.number().min(2).max(3).default(2),
      limit: z.number().min(1).max(200).default(50),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { molecules: [], total: 0 };

      const rows = await db.execute(sql`
        SELECT 
          m.id,
          m.name,
          m.family,
          m.cas_number as casNumber,
          m.formula,
          m.therapeuticProperties,
          m.olfactiveProfile,
          GROUP_CONCAT(DISTINCT p.category ORDER BY p.category SEPARATOR ',') AS domains,
          COUNT(DISTINCT 
            CASE 
              WHEN p.category = 'cannabis' THEN 'cannabis'
              WHEN p.category = 'tabac' THEN 'tabac'
              WHEN p.category IN ('aromatique','fleur','bois','resine','racine','autre') THEN 'parfum'
              ELSE NULL
            END
          ) AS domain_count,
          COUNT(DISTINCT p.id) AS plant_count,
          GROUP_CONCAT(DISTINCT p.name ORDER BY p.name SEPARATOR '|') AS plant_names
        FROM molecules m
        JOIN plant_molecules pm ON pm.molecule_id = m.id
        JOIN plants p ON p.id = pm.plant_id
        WHERE p.category IN ('cannabis','tabac','aromatique','fleur','bois','resine','racine','autre')
        GROUP BY m.id, m.name, m.family, m.cas_number, m.formula, m.therapeuticProperties, m.olfactiveProfile
        HAVING COUNT(DISTINCT 
          CASE 
            WHEN p.category = 'cannabis' THEN 'cannabis'
            WHEN p.category = 'tabac' THEN 'tabac'
            WHEN p.category IN ('aromatique','fleur','bois','resine','racine','autre') THEN 'parfum'
            ELSE NULL
          END
        ) >= ${input.minDomains}
        ORDER BY plant_count DESC
        LIMIT ${input.limit}
      `);

      const molecules = (rows as any[]).map((r) => ({
        id: r.id,
        name: r.name,
        family: r.family,
        casNumber: r.casNumber,
        formula: r.formula,
        therapeuticProperties: r.therapeuticProperties,
        olfactiveProfile: (() => {
          try { return JSON.parse(r.olfactiveProfile || '[]'); } catch { return []; }
        })(),
        domains: (r.domains || '').split(',').filter(Boolean).map((d: string) => {
          if (d === 'cannabis') return 'cannabis';
          if (d === 'tabac') return 'tabac';
          return 'parfum';
        }).filter((v: string, i: number, a: string[]) => a.indexOf(v) === i),
        domainCount: Number(r.domain_count),
        plantCount: Number(r.plant_count),
        plantNames: (r.plant_names || '').split('|').filter(Boolean).slice(0, 10),
      }));

      return { molecules, total: molecules.length };
    }),

  /**
   * Statistiques des corrélations par domaine
   */
  getCorrelationStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return null;

    const [stats] = await db.execute(sql`
      SELECT
        SUM(CASE WHEN domain_count = 3 THEN 1 ELSE 0 END) as triple_domain,
        SUM(CASE WHEN domain_count = 2 THEN 1 ELSE 0 END) as double_domain,
        SUM(CASE WHEN domains LIKE '%cannabis%' AND domains LIKE '%tabac%' THEN 1 ELSE 0 END) as cannabis_tabac,
        SUM(CASE WHEN domains LIKE '%cannabis%' AND domains LIKE '%parfum%' THEN 1 ELSE 0 END) as cannabis_parfum,
        SUM(CASE WHEN domains LIKE '%tabac%' AND domains LIKE '%parfum%' THEN 1 ELSE 0 END) as tabac_parfum
      FROM (
        SELECT 
          m.id,
          GROUP_CONCAT(DISTINCT 
            CASE 
              WHEN p.category = 'cannabis' THEN 'cannabis'
              WHEN p.category = 'tabac' THEN 'tabac'
              WHEN p.category IN ('aromatique','fleur','bois','resine','racine','autre') THEN 'parfum'
              ELSE NULL
            END
            ORDER BY 1 SEPARATOR ','
          ) AS domains,
          COUNT(DISTINCT 
            CASE 
              WHEN p.category = 'cannabis' THEN 'cannabis'
              WHEN p.category = 'tabac' THEN 'tabac'
              WHEN p.category IN ('aromatique','fleur','bois','resine','racine','autre') THEN 'parfum'
              ELSE NULL
            END
          ) AS domain_count
        FROM molecules m
        JOIN plant_molecules pm ON pm.molecule_id = m.id
        JOIN plants p ON p.id = pm.plant_id
        WHERE p.category IN ('cannabis','tabac','aromatique','fleur','bois','resine','racine','autre')
        GROUP BY m.id
        HAVING domain_count >= 2
      ) subq
    `) as any;

    return {
      tripleDomain: Number(stats?.triple_domain || 0),
      doubleDomain: Number(stats?.double_domain || 0),
      cannabisTabac: Number(stats?.cannabis_tabac || 0),
      cannabisParfum: Number(stats?.cannabis_parfum || 0),
      tabacParfum: Number(stats?.tabac_parfum || 0),
    };
  }),

  /**
   * Synergies documentées pour les molécules communes
   */
  getSynergiesForCrossDomain: publicProcedure
    .input(z.object({
      moleculeIds: z.array(z.number()).max(50),
    }))
    .query(async ({ input }) => {
      if (input.moleculeIds.length === 0) return [];
      const db = await getDb();
      if (!db) return [];

      const idList = input.moleculeIds.join(',');
      const rows = await db.execute(sql`
        SELECT 
          ms.id,
          ms.molecule1_id,
          ms.molecule2_id,
          ms.type,
          ms.description,
          ms.chemical_mechanism as chemicalMechanism,
          ms.applications,
          m1.name as molecule1Name,
          m1.family as molecule1Family,
          m2.name as molecule2Name,
          m2.family as molecule2Family
        FROM molecule_synergies ms
        JOIN molecules m1 ON m1.id = ms.molecule1_id
        JOIN molecules m2 ON m2.id = ms.molecule2_id
        WHERE ms.molecule1_id IN (${sql.raw(idList)})
           OR ms.molecule2_id IN (${sql.raw(idList)})
        ORDER BY ms.type, m1.name
        LIMIT 100
      `);

      return rows as any[];
    }),

  /**
   * Top molécules par famille dans les corrélations
   */
  getTopFamilies: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const rows = await db.execute(sql`
      SELECT 
        m.family,
        COUNT(DISTINCT m.id) as molecule_count,
        GROUP_CONCAT(DISTINCT m.name ORDER BY m.name SEPARATOR '|') as examples
      FROM molecules m
      JOIN plant_molecules pm ON pm.molecule_id = m.id
      JOIN plants p ON p.id = pm.plant_id
      WHERE p.category IN ('cannabis','tabac','aromatique','fleur','bois','resine','racine','autre')
      GROUP BY m.id
      HAVING COUNT(DISTINCT 
        CASE 
          WHEN p.category = 'cannabis' THEN 'cannabis'
          WHEN p.category = 'tabac' THEN 'tabac'
          WHEN p.category IN ('aromatique','fleur','bois','resine','racine','autre') THEN 'parfum'
          ELSE NULL
        END
      ) >= 2
    `) as any[];

    // Group by family
    const familyMap: Record<string, { count: number; examples: string[] }> = {};
    for (const r of rows) {
      const fam = r.family || 'Non classé';
      if (!familyMap[fam]) familyMap[fam] = { count: 0, examples: [] };
      familyMap[fam].count++;
      const examples = (r.examples || '').split('|').filter(Boolean);
      familyMap[fam].examples.push(...examples.slice(0, 2));
    }

    return Object.entries(familyMap)
      .map(([family, data]) => ({ family, count: data.count, examples: [...new Set(data.examples)].slice(0, 5) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }),
});
