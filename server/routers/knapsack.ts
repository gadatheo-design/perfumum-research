/**
 * Router KNApSAcK — Liaisons plante-molécule
 * Source: https://www.knapsackfamily.com/knapsack_core/
 * Format retourné: C_ID | CAS | Nom | Formule | Masse | Espèce
 */
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { plants, molecules, plantMolecules } from "../../drizzle/schema";
import { eq, and, isNull, or, sql } from "drizzle-orm";

// ─── Scraper KNApSAcK ─────────────────────────────────────────────────────────

interface KnapsackMolecule {
  knapsackId: string;
  cas: string;
  name: string;
  formula: string;
  mass: string;
  organism: string;
}

async function fetchKnapsackMolecules(latinName: string): Promise<KnapsackMolecule[]> {
  const url = `https://www.knapsackfamily.com/knapsack_core/result.php?sname=all&word=${encodeURIComponent(latinName)}&display=1000&start=1`;
  
  const res = await fetch(url, {
    headers: {
      "User-Agent": "PERFUMUM-Research/1.0 (academic research project)",
      "Accept": "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(15000),
  });
  
  if (!res.ok) throw new Error(`KNApSAcK HTTP ${res.status}`);
  
  const html = await res.text();
  return parseKnapsackHtml(html);
}

function parseKnapsackHtml(html: string): KnapsackMolecule[] {
  const results: KnapsackMolecule[] = [];
  
  // Extraire les lignes <tr> contenant des données
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let trMatch;
  
  while ((trMatch = trRegex.exec(html)) !== null) {
    const rowHtml = trMatch[1];
    // Extraire les cellules <td>
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    const cells: string[] = [];
    let tdMatch;
    
    while ((tdMatch = tdRegex.exec(rowHtml)) !== null) {
      // Nettoyer le HTML (liens, balises)
      const text = tdMatch[1]
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&nbsp;/g, " ")
        .replace(/&#\d+;/g, "")
        .trim();
      cells.push(text);
    }
    
    // Format attendu: [C_ID, CAS, Nom, Formule, Masse, Espèce]
    if (cells.length >= 5 && cells[0].match(/^C\d{8}$/)) {
      results.push({
        knapsackId: cells[0],
        cas: cells[1] || "",
        name: cells[2] || "",
        formula: cells[3] || "",
        mass: cells[4] || "",
        organism: cells[5] || "",
      });
    }
  }
  
  return results;
}

// ─── Matching molécule en DB ──────────────────────────────────────────────────

async function findMoleculeInDb(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  km: KnapsackMolecule
): Promise<{ id: number; name: string } | null> {
  // 1. Match par CAS (prioritaire)
  if (km.cas && km.cas.match(/^\d+-\d+-\d+$/)) {
    const byCas = await db
      .select({ id: molecules.id, name: molecules.name })
      .from(molecules)
      .where(eq(molecules.casNumber, km.cas))
      .limit(1);
    if (byCas.length > 0) return byCas[0];
  }
  
  // 2. Match par nom exact (insensible à la casse)
  if (km.name) {
    const byName = await db
      .select({ id: molecules.id, name: molecules.name })
      .from(molecules)
      .where(sql`LOWER(${molecules.name}) = LOWER(${km.name})`)
      .limit(1);
    if (byName.length > 0) return byName[0];
  }
  
  // 3. Match par formule brute + masse (dernier recours)
  if (km.formula && km.mass) {
    const massNum = parseFloat(km.mass);
    if (!isNaN(massNum)) {
      const byFormula = await db
        .select({ id: molecules.id, name: molecules.name })
        .from(molecules)
        .where(
          and(
            sql`molecular_formula = ${km.formula}`,
            sql`ABS(CAST(${molecules.molecularWeight} AS DECIMAL) - ${massNum}) < 0.01`
          )
        )
        .limit(1);
      if (byFormula.length > 0) return byFormula[0];
    }
  }
  
  return null;
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const knapsackRouter = router({
  
  // Statistiques globales
  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    
    if (!db) throw new Error("Base de données indisponible");
    
    const [totalPlantsResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(plants);
    
    const [knapsackLinksResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(plantMolecules)
      .where(eq(plantMolecules.source, "KNApSAcK"));
    
    const [plantsWithKnapsackResult] = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${plantMolecules.plantId})` })
      .from(plantMolecules)
      .where(eq(plantMolecules.source, "KNApSAcK"));
    
    return {
      totalPlants: Number(totalPlantsResult.count),
      knapsackLinks: Number(knapsackLinksResult.count),
      plantsWithKnapsack: Number(plantsWithKnapsackResult.count),
    };
  }),
  
  // Preview pour une plante (dry-run)
  previewPlant: protectedProcedure
    .input(z.object({ plantId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      
      if (!db) throw new Error("Base de données indisponible");
      
      const [plant] = await db
        .select({ id: plants.id, name: plants.name, latinName: plants.latinName })
        .from(plants)
        .where(eq(plants.id, input.plantId))
        .limit(1);
      
      if (!plant) throw new Error("Plante introuvable");
      if (!plant.latinName) throw new Error("Nom latin manquant");
      
      const knapsackMolecules = await fetchKnapsackMolecules(plant.latinName);
      
      // Vérifier les liaisons existantes
      const existingLinks = await db
        .select({ moleculeId: plantMolecules.moleculeId })
        .from(plantMolecules)
        .where(eq(plantMolecules.plantId, plant.id));
      
      const existingMoleculeIds = new Set(existingLinks.map(l => l.moleculeId));
      
      // Matcher chaque molécule KNApSAcK
      const matches = await Promise.all(
        knapsackMolecules.map(async (km) => {
          const match = await findMoleculeInDb(db, km);
          return {
            knapsackId: km.knapsackId,
            cas: km.cas,
            name: km.name,
            formula: km.formula,
            matchedMoleculeId: match?.id || null,
            matchedMoleculeName: match?.name || null,
            alreadyLinked: match ? existingMoleculeIds.has(match.id) : false,
          };
        })
      );
      
      const newLinks = matches.filter(m => m.matchedMoleculeId && !m.alreadyLinked);
      const unmatched = matches.filter(m => !m.matchedMoleculeId);
      
      return {
        plant: { id: plant.id, name: plant.name, latinName: plant.latinName },
        totalKnapsack: knapsackMolecules.length,
        matched: matches.filter(m => m.matchedMoleculeId).length,
        newLinks: newLinks.length,
        alreadyLinked: matches.filter(m => m.alreadyLinked).length,
        unmatched: unmatched.length,
        newLinkDetails: newLinks.slice(0, 20),
        unmatchedDetails: unmatched.slice(0, 10),
      };
    }),
  
  // Enrichissement d'une plante
  enrichPlant: protectedProcedure
    .input(z.object({
      plantId: z.number(),
      dryRun: z.boolean().default(false),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      
      if (!db) throw new Error("Base de données indisponible");
      
      const [plant] = await db
        .select({ id: plants.id, name: plants.name, latinName: plants.latinName })
        .from(plants)
        .where(eq(plants.id, input.plantId))
        .limit(1);
      
      if (!plant) throw new Error("Plante introuvable");
      if (!plant.latinName) throw new Error("Nom latin manquant pour cette plante");
      
      const knapsackMolecules = await fetchKnapsackMolecules(plant.latinName);
      
      if (knapsackMolecules.length === 0) {
        return {
          plant: plant.name,
          knapsackTotal: 0,
          created: 0,
          skipped: 0,
          message: "Aucune molécule trouvée dans KNApSAcK pour cette espèce",
        };
      }
      
      // Liaisons existantes
      const existingLinks = await db
        .select({ moleculeId: plantMolecules.moleculeId })
        .from(plantMolecules)
        .where(eq(plantMolecules.plantId, plant.id));
      
      const existingMoleculeIds = new Set(existingLinks.map(l => l.moleculeId));
      
      let created = 0;
      let skipped = 0;
      
      for (const km of knapsackMolecules) {
        const match = await findMoleculeInDb(db, km);
        
        if (!match) {
          skipped++;
          continue;
        }
        
        if (existingMoleculeIds.has(match.id)) {
          skipped++;
          continue;
        }
        
        if (!input.dryRun) {
          try {
            await db.insert(plantMolecules).values({
              plantId: plant.id,
              moleculeId: match.id,
              source: "KNApSAcK",
              notes: `KNApSAcK ID: ${km.knapsackId}${km.cas ? ` | CAS: ${km.cas}` : ""}`,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            existingMoleculeIds.add(match.id);
          } catch (e) {
            // Doublon — ignorer
          }
        }
        
        created++;
      }
      
      return {
        plant: plant.name,
        latinName: plant.latinName,
        knapsackTotal: knapsackMolecules.length,
        created: input.dryRun ? 0 : created,
        wouldCreate: input.dryRun ? created : undefined,
        skipped,
        dryRun: input.dryRun,
      };
    }),
  
  // Enrichissement batch de toutes les plantes
  enrichBatch: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().default(0),
      onlyWithLatinName: z.boolean().default(true),
      dryRun: z.boolean().default(false),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      
      if (!db) throw new Error("Base de données indisponible");
      
      // Récupérer les plantes à traiter
      let query = db
        .select({ id: plants.id, name: plants.name, latinName: plants.latinName })
        .from(plants);
      
      const allPlants = await query;
      
      const filtered = allPlants.filter(p => 
        !input.onlyWithLatinName || (p.latinName && p.latinName.trim().length > 0)
      );
      
      const batch = filtered.slice(input.offset, input.offset + input.limit);
      
      const results = [];
      let totalCreated = 0;
      let totalSkipped = 0;
      let totalErrors = 0;
      
      for (const plant of batch) {
        try {
          if (!plant.latinName) {
            results.push({ plant: plant.name, status: "skipped", reason: "Pas de nom latin" });
            totalSkipped++;
            continue;
          }
          
          const knapsackMolecules = await fetchKnapsackMolecules(plant.latinName);
          
          if (knapsackMolecules.length === 0) {
            results.push({ plant: plant.name, latinName: plant.latinName, status: "not_found", knapsackTotal: 0, created: 0 });
            continue;
          }
          
          const existingLinks = await db
            .select({ moleculeId: plantMolecules.moleculeId })
            .from(plantMolecules)
            .where(eq(plantMolecules.plantId, plant.id));
          
          const existingMoleculeIds = new Set(existingLinks.map(l => l.moleculeId));
          
          let created = 0;
          let skipped = 0;
          
          for (const km of knapsackMolecules) {
            const match = await findMoleculeInDb(db, km);
            
            if (!match) { skipped++; continue; }
            if (existingMoleculeIds.has(match.id)) { skipped++; continue; }
            
            if (!input.dryRun) {
              try {
                await db.insert(plantMolecules).values({
                  plantId: plant.id,
                  moleculeId: match.id,
                  source: "KNApSAcK",
                  notes: `KNApSAcK ID: ${km.knapsackId}${km.cas ? ` | CAS: ${km.cas}` : ""}`,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                });
                existingMoleculeIds.add(match.id);
              } catch (e) {
                // Doublon
              }
            }
            
            created++;
          }
          
          totalCreated += created;
          totalSkipped += skipped;
          
          results.push({
            plant: plant.name,
            latinName: plant.latinName,
            status: "ok",
            knapsackTotal: knapsackMolecules.length,
            created: input.dryRun ? 0 : created,
            wouldCreate: input.dryRun ? created : undefined,
            skipped,
          });
          
          // Délai pour respecter le rate-limit KNApSAcK
          await new Promise(r => setTimeout(r, 500));
          
        } catch (err: any) {
          totalErrors++;
          results.push({
            plant: plant.name,
            status: "error",
            error: err.message,
          });
        }
      }
      
      return {
        processed: batch.length,
        totalPlants: filtered.length,
        totalCreated: input.dryRun ? 0 : totalCreated,
        totalWouldCreate: input.dryRun ? totalCreated : undefined,
        totalSkipped,
        totalErrors,
        dryRun: input.dryRun,
        results,
      };
    }),
  
  // Liste des plantes avec leur statut KNApSAcK
  getPlantsList: publicProcedure
    .input(z.object({
      limit: z.number().default(50),
      offset: z.number().default(0),
      filter: z.enum(["all", "with_knapsack", "without_knapsack"]).default("all"),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      
      if (!db) throw new Error("Base de données indisponible");
      
      const allPlants = await db
        .select({ id: plants.id, name: plants.name, latinName: plants.latinName })
        .from(plants)
        .limit(input.limit)
        .offset(input.offset);
      
      // Compter les liaisons KNApSAcK par plante
      const knapsackCounts = await db
        .select({
          plantId: plantMolecules.plantId,
          count: sql<number>`COUNT(*)`,
        })
        .from(plantMolecules)
        .where(eq(plantMolecules.source, "KNApSAcK"))
        .groupBy(plantMolecules.plantId);
      
      const countMap = new Map(knapsackCounts.map(r => [r.plantId, Number(r.count)]));
      
      const result = allPlants.map(p => ({
        ...p,
        knapsackLinks: countMap.get(p.id) || 0,
      }));
      
      const filtered = input.filter === "with_knapsack"
        ? result.filter(p => p.knapsackLinks > 0)
        : input.filter === "without_knapsack"
        ? result.filter(p => p.knapsackLinks === 0)
        : result;
      
      return filtered;
    }),
});
