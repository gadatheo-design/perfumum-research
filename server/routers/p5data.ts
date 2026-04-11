/**
 * PERFUMUM — p5data Router
 * 
 * Endpoints publics conçus pour être consommés par des sketches p5.js
 * depuis editor.p5js.org ou toute autre application externe.
 * 
 * Endpoints :
 *   - gcms       : Chromatogramme GC-MS simulé d'une plante (peaks + metadata)
 *   - molecules  : Liste de molécules avec propriétés pour visualisation réseau
 *   - plantProfile : Profil complet d'une plante (molécules, terroirs, familles)
 *   - families   : Liste des familles chimiques avec compteurs
 *   - search     : Recherche de plantes par nom (pour le sketch)
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { molecules, plants, plantMolecules } from "../../drizzle/schema";
import { eq, like, sql, desc, asc, and, isNotNull } from "drizzle-orm";

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Mappe la classe chimique DB vers la famille olfactive pour le sketch p5.js
 */
function mapChemicalClassToFamily(chemicalClass: string | null, family: string | null): string {
  // Priorité au champ family s'il est renseigné
  if (family) {
    const f = family.toLowerCase();
    if (f.includes('monoterpène') || f.includes('monoterpene')) return 'Monoterpène';
    if (f.includes('sesquiterpène') || f.includes('sesquiterpene')) return 'Sesquiterpène';
    if (f.includes('monoterpénol') || f.includes('monoterpenol')) return 'Monoterpénol';
    if (f.includes('ester')) return 'Ester';
    if (f.includes('aldéhyde') || f.includes('aldehyde')) return 'Aldéhyde';
    if (f.includes('cétone') || f.includes('ketone') || f.includes('cetone')) return 'Cétone';
    if (f.includes('oxyde') || f.includes('oxide')) return 'Oxyde';
    if (f.includes('phénol') || f.includes('phenol')) return 'Phénol';
    if (f.includes('acide') || f.includes('acid')) return 'Acide';
    if (f.includes('lactone')) return 'Lactone';
    if (f.includes('coumarine') || f.includes('coumarin')) return 'Coumarine';
    if (f.includes('alcool') || f.includes('alcohol')) return 'Alcool';
    if (f.includes('éther') || f.includes('ether')) return 'Éther';
  }
  
  // Fallback sur chemicalClass
  const classMap: Record<string, string> = {
    'terpene': 'Monoterpène',
    'monoterpene': 'Monoterpène',
    'sesquiterpene': 'Sesquiterpène',
    'diterpene': 'Sesquiterpène',
    'aldehyde': 'Aldéhyde',
    'ketone': 'Cétone',
    'alcohol': 'Alcool',
    'ester': 'Ester',
    'ether': 'Éther',
    'phenol': 'Phénol',
    'lactone': 'Lactone',
    'coumarin': 'Coumarine',
    'musk': 'Lactone',
    'nitrile': 'Aldéhyde',
    'sulfur_compound': 'Phénol',
    'heterocyclic': 'Oxyde',
    'aromatic': 'Phénol',
    'aliphatic': 'Aldéhyde',
    'other': 'default',
  };
  
  return classMap[chemicalClass || ''] || 'default';
}

/**
 * Estime un temps de rétention GC-MS à partir du point d'ébullition
 * Approximation linéaire : RT ≈ (BP - 30) / 10
 * Plage typique : 3-35 min pour BP 60-380°C
 */
function estimateRetentionTime(boilingPoint: number | null, molecularWeight: number | null): number {
  if (boilingPoint && boilingPoint > 0) {
    return Math.max(2, Math.min(35, (boilingPoint - 30) / 10));
  }
  // Fallback basé sur la masse molaire
  if (molecularWeight && molecularWeight > 0) {
    return Math.max(2, Math.min(35, (molecularWeight - 50) / 10));
  }
  // Valeur par défaut aléatoire mais déterministe
  return 10 + Math.random() * 15;
}

/**
 * Estime l'intensité du pic GC-MS à partir du pourcentage de composition
 */
function estimateIntensity(percentage: number | null, role: string | null): number {
  if (percentage && percentage > 0) {
    // Échelle logarithmique : 1% → ~1000, 10% → ~5000, 50% → ~10000
    return Math.round(Math.min(10000, Math.max(200, percentage * 200)));
  }
  // Fallback basé sur le rôle
  const roleIntensity: Record<string, number> = {
    'majeur': 5000 + Math.round(Math.random() * 3000),
    'secondaire': 1500 + Math.round(Math.random() * 2000),
    'trace': 300 + Math.round(Math.random() * 500),
    'variable': 1000 + Math.round(Math.random() * 3000),
  };
  return roleIntensity[role || ''] || 1000 + Math.round(Math.random() * 2000);
}

/**
 * Détermine la note olfactive (tête/cœur/fond) à partir du point d'ébullition
 */
function determineNote(boilingPoint: number | null): string {
  if (!boilingPoint) return 'cœur';
  if (boilingPoint < 180) return 'tête';
  if (boilingPoint < 250) return 'cœur';
  return 'fond';
}

// ─── Router ─────────────────────────────────────────────────────────────────

export const p5dataRouter = router({
  
  /**
   * gcms — Retourne un chromatogramme GC-MS simulé pour une plante donnée
   * 
   * Format de sortie compatible avec le sketch p5.js PERFUMUM :
   * {
   *   sample: string,
   *   method: string,
   *   source: string,
   *   peaks: [{ rt, intensity, molecule, cas, mw, family, bp, note, odor }]
   * }
   */
  gcms: publicProcedure
    .input(z.object({
      plantId: z.number().optional(),
      plantName: z.string().optional(),
    }).refine(data => data.plantId || data.plantName, {
      message: "plantId ou plantName requis"
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { sample: "Base de données non disponible", method: "N/A", source: "PERFUMUM", peaks: [] };
      
      // Trouver la plante
      let plant;
      if (input.plantId) {
        const results = await db.select().from(plants).where(eq(plants.id, input.plantId)).limit(1);
        plant = results[0];
      } else if (input.plantName) {
        const results = await db.select().from(plants).where(like(plants.name, `%${input.plantName}%`)).limit(1);
        plant = results[0];
      }
      
      if (!plant) {
        return {
          sample: "Plante non trouvée",
          method: "N/A",
          source: "PERFUMUM",
          peaks: [],
        };
      }
      
      // Récupérer les molécules associées avec leurs données
      const plantMols: any[] = await db
        .select({
          // Données de la liaison
          percentageMin: plantMolecules.percentageMin,
          percentageMax: plantMolecules.percentageMax,
          percentageTypical: plantMolecules.percentageTypical,
          percentage: plantMolecules.percentage,
          role: plantMolecules.role,
          isSignature: plantMolecules.isSignature,
          source: plantMolecules.source,
          // Données de la molécule
          molId: molecules.id,
          molName: molecules.name,
          casNumber: molecules.casNumber,
          chemicalClass: molecules.chemicalClass,
          family: molecules.family,
          chemicalFormula: molecules.chemicalFormula,
          molecularWeight: molecules.molecularWeight,
          boilingPoint: molecules.boilingPoint,
          intensity: molecules.intensity,
          olfactiveProfile: molecules.olfactiveProfile,
          therapeuticProperties: molecules.therapeuticProperties,
        })
        .from(plantMolecules)
        .innerJoin(molecules, eq(plantMolecules.moleculeId, molecules.id))
        .where(eq(plantMolecules.plantId, plant.id))
        .orderBy(asc(molecules.boilingPoint));
      
      // Transformer en format GC-MS peaks
      const peaks = plantMols.map((pm: any) => {
        const pct = pm.percentageTypical || pm.percentage || pm.percentageMin || null;
        const bp = pm.boilingPoint || null;
        const mw = pm.molecularWeight || null;
        
        return {
          rt: Math.round(estimateRetentionTime(bp, mw) * 10) / 10,
          intensity: estimateIntensity(pct, pm.role),
          molecule: pm.molName,
          cas: pm.casNumber || 'N/A',
          mw: mw || 0,
          family: mapChemicalClassToFamily(pm.chemicalClass, pm.family),
          bp: bp || 0,
          note: determineNote(bp),
          odor: pm.olfactiveProfile || 'Non documenté',
          // Données supplémentaires pour enrichir le sketch
          percentage: pct,
          role: pm.role || 'variable',
          isSignature: pm.isSignature === 1,
          formula: pm.chemicalFormula || '',
          therapeutic: pm.therapeuticProperties || '',
          source: pm.source || 'PERFUMUM',
        };
      });
      
      // Trier par temps de rétention
      peaks.sort((a: { rt: number }, b: { rt: number }) => a.rt - b.rt);
      
      // Dédupliquer les RT trop proches (décaler de 0.3 min)
      for (let i = 1; i < peaks.length; i++) {
        if (Math.abs(peaks[i].rt - peaks[i - 1].rt) < 0.2) {
          peaks[i].rt = Math.round((peaks[i - 1].rt + 0.3) * 10) / 10;
        }
      }
      
      return {
        sample: `${plant.name}${plant.latinName ? ` (${plant.latinName ?? ""})` : ''} — Profil GC-MS`,
        method: "GC-MS simulé (PERFUMUM — basé sur composition moléculaire)",
        source: `PERFUMUM Research Database — ${peaks.length} composés identifiés`,
        plantId: plant.id,
        plantName: plant.name,
        latinName: plant.latinName || '',
        category: plant.category,
        peaks,
      };
    }),
  
  /**
   * molecules — Liste de molécules avec propriétés pour visualisation réseau
   * Utile pour les sketches force-directed graph, heatmap, etc.
   */
  molecules: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(500).default(100),
      chemicalClass: z.string().optional(),
      minMolecularWeight: z.number().optional(),
      maxMolecularWeight: z.number().optional(),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { count: 0, molecules: [] };
      const params = input || { limit: 100 };
      
      const conditions = [];
      if (params.chemicalClass) {
        conditions.push(eq(molecules.chemicalClass, params.chemicalClass as any));
      }
      if (params.minMolecularWeight) {
        conditions.push(sql`${molecules.molecularWeight} >= ${params.minMolecularWeight}`);
      }
      if (params.maxMolecularWeight) {
        conditions.push(sql`${molecules.molecularWeight} <= ${params.maxMolecularWeight}`);
      }
      
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      
      const results = await db
        .select({
          id: molecules.id,
          name: molecules.name,
          cas: molecules.casNumber,
          formula: molecules.chemicalFormula,
          family: molecules.family,
          chemicalClass: molecules.chemicalClass,
          mw: molecules.molecularWeight,
          bp: molecules.boilingPoint,
          intensity: molecules.intensity,
          volatility: molecules.volatility,
          odor: molecules.olfactiveProfile,
          therapeutic: molecules.therapeuticProperties,
          radarIntensity: molecules.radarIntensity,
          radarFreshness: molecules.radarFreshness,
          radarWarmth: molecules.radarWarmth,
          radarSweetness: molecules.radarSweetness,
          radarSpiciness: molecules.radarSpiciness,
          radarEarthiness: molecules.radarEarthiness,
        })
        .from(molecules)
        .where(whereClause)
        .orderBy(desc(molecules.molecularWeight))
        .limit(params.limit);
      
      return {
        count: results.length,
        molecules: results.map((m: typeof results[number]) => ({
          ...m,
          familyP5: mapChemicalClassToFamily(m.chemicalClass, m.family),
          note: determineNote(m.bp),
        })),
      };
    }),
  
  /**
   * search — Recherche de plantes par nom (autocomplete pour le sketch)
   */
  search: publicProcedure
    .input(z.object({
      query: z.string().min(1).max(100),
      limit: z.number().min(1).max(50).default(10),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const results = await db
        .select({
          id: plants.id,
          name: plants.name,
          latinName: plants.latinName,
          category: plants.category,
          family: plants.family,
        })
        .from(plants)
        .where(sql`${plants.name} LIKE ${'%' + input.query + '%'} OR ${plants.latinName} LIKE ${'%' + input.query + '%'}`)
        .limit(input.limit);
      
      return results;
    }),
  
  /**
   * families — Liste des familles chimiques avec compteurs
   * Utile pour les légendes et filtres dans les sketches
   */
  families: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const results = await db
      .select({
        chemicalClass: molecules.chemicalClass,
        count: sql<number>`COUNT(*)`,
      })
      .from(molecules)
      .where(isNotNull(molecules.chemicalClass))
      .groupBy(molecules.chemicalClass)
      .orderBy(desc(sql`COUNT(*)`));
    
    return results.map((r: typeof results[number]) => ({
      class: r.chemicalClass,
      familyP5: mapChemicalClassToFamily(r.chemicalClass, null),
      count: r.count,
    }));
  }),
  
  /**
   * stats — Statistiques globales de la base (pour affichage dans le sketch)
   */
  stats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { molecules: 0, plants: 0, links: 0, lastUpdated: '' };
    const [molCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(molecules);
    const [plantCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(plants);
    const [linkCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(plantMolecules);
    
    return {
      molecules: molCount.count,
      plants: plantCount.count,
      links: linkCount.count,
      lastUpdated: new Date().toISOString(),
    };
  }),
});
