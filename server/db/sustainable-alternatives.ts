/**
 * Extracted from server/db/misc.ts
 * Module: Sustainable Alternatives
 */
import { getDb } from "./core";
import { eq, and, or, desc, asc, sql, like, inArray, isNull, isNotNull, count, SQL, between, ne, gt, lt, gte, lte, notInArray, exists } from "drizzle-orm";
import * as schema from "../../drizzle/schema";
import { type SustainableAlternative } from "../../drizzle/schema";

const { plants, sustainableAlternatives } = schema;



// ====================================================================
// SUSTAINABLE ALTERNATIVES HELPERS
// ====================================================================
// ============================================================================
// SUSTAINABLE ALTERNATIVES HELPERS
// ============================================================================

export async function getAllSustainableAlternatives() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(sustainableAlternatives).orderBy(sustainableAlternatives.threatenedPlantName);
}

export async function getSustainableAlternativeById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.select().from(sustainableAlternatives).where(eq(sustainableAlternatives.id, id));
  return result || null;
}

export async function getAlternativesByThreatenedPlant(threatenedPlantId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(sustainableAlternatives)
    .where(eq(sustainableAlternatives.threatenedPlantId, threatenedPlantId))
    .orderBy(sustainableAlternatives.olfactiveSimilarity);
}

export async function getAlternativesByType(alternativeType: string) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(sustainableAlternatives)
    .where(eq(sustainableAlternatives.alternativeType, alternativeType as SustainableAlternative['alternativeType']))
    .orderBy(sustainableAlternatives.threatenedPlantName);
}

export async function searchSustainableAlternatives(filters: {
  threatenedPlantId?: number;
  alternativeType?: string;
  availability?: string;
  olfactiveSimilarity?: string;
  searchQuery?: string;
}) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [];
  
  if (filters.threatenedPlantId) {
    conditions.push(eq(sustainableAlternatives.threatenedPlantId, filters.threatenedPlantId));
  }
  if (filters.alternativeType) {
    conditions.push(eq(sustainableAlternatives.alternativeType, filters.alternativeType as SustainableAlternative['alternativeType']));
  }
  if (filters.availability) {
    conditions.push(sql`${sustainableAlternatives.availability} = ${filters.availability}`);
  }
  if (filters.olfactiveSimilarity) {
    conditions.push(sql`${sustainableAlternatives.olfactiveSimilarity} = ${filters.olfactiveSimilarity}`);
  }
  if (filters.searchQuery) {
    conditions.push(
      or(
        like(sustainableAlternatives.threatenedPlantName, `%${filters.searchQuery}%`),
        like(sustainableAlternatives.alternativeName, `%${filters.searchQuery}%`),
        like(sustainableAlternatives.notes, `%${filters.searchQuery}%`)
      )
    );
  }
  
  let query = db.select().from(sustainableAlternatives);
  if (conditions.length > 0) {
    // @ts-expect-error -- Drizzle query builder chain; runtime usage is correct

    query = query.where(and(...conditions));
  }
  
  return await query.orderBy(sustainableAlternatives.threatenedPlantName);
}

export async function getThreatenedPlantsWithAlternatives() {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer toutes les plantes menacées (CR, EN, VU, NT)
  const threatenedPlants = await db
    .select()
    .from(plants)
    .where(
      or(
        eq(plants.conservationStatus, 'CR'),
        eq(plants.conservationStatus, 'EN'),
        eq(plants.conservationStatus, 'VU'),
        eq(plants.conservationStatus, 'NT'),
        eq(plants.citesAppendix, 'I'),
        eq(plants.citesAppendix, 'II')
      )
    )
    .orderBy(plants.name);
  
  // Pour chaque plante menacée, récupérer ses alternatives
  const result = await Promise.all(
    threatenedPlants.map(async (plant) => {
      const alternatives = await db
        .select()
        .from(sustainableAlternatives)
        .where(eq(sustainableAlternatives.threatenedPlantId, plant.id));
      
      return {
        ...plant,
        alternatives,
        alternativeCount: alternatives.length,
      };
    })
  );
  
  return result;
}

export async function getAlternativesGroupedBySpecies() {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer toutes les alternatives
  const allAlternatives = await db
    .select()
    .from(sustainableAlternatives)
    .orderBy(sustainableAlternatives.threatenedPlantName);
  
  // Grouper par espèce menacée
  const grouped: Record<string, {
    threatenedPlantId: number;
    threatenedPlantName: string;
    alternatives: typeof allAlternatives;
  }> = {};
  
  for (const alt of allAlternatives) {
    const key = `${alt.threatenedPlantId}`;
    if (!grouped[key]) {
      grouped[key] = {
        threatenedPlantId: alt.threatenedPlantId,
        threatenedPlantName: alt.threatenedPlantName,
        alternatives: [],
      };
    }
    grouped[key].alternatives.push(alt);
  }
  
  return Object.values(grouped);
}

export async function createSustainableAlternative(data: {
  threatenedPlantId: number;
  threatenedPlantName: string;
  alternativePlantId?: number;
  alternativeName: string;
  alternativeType: string;
  olfactiveSimilarity?: string;
  olfactiveNotes?: string;
  availability?: string;
  sustainabilityScore?: number;
  certifications?: string[];
  priceComparison?: string;
  suppliers?: string[];
  usageRecommendations?: string;
  keyMolecules?: { name: string; percentage?: number; note?: string }[];
  references?: { title: string; author?: string; year?: number; url?: string; type: 'academic' | 'supplier' | 'industry' | 'other' }[];
  notes?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.insert(sustainableAlternatives).values({
    ...data,
    alternativeType: data.alternativeType as SustainableAlternative['alternativeType'],
    olfactiveSimilarity: data.olfactiveSimilarity as SustainableAlternative['olfactiveSimilarity'] | undefined,
    availability: data.availability as SustainableAlternative['availability'] | undefined,
    priceComparison: data.priceComparison as SustainableAlternative['priceComparison'] | undefined,
  });
  return getSustainableAlternativeById(result.insertId);
}

export async function updateSustainableAlternative(id: number, data: {
  threatenedPlantId?: number;
  threatenedPlantName?: string;
  alternativePlantId?: number;
  alternativeName?: string;
  alternativeType?: string;
  olfactiveSimilarity?: string;
  olfactiveNotes?: string;
  availability?: string;
  sustainabilityScore?: number;
  certifications?: string[];
  priceComparison?: string;
  suppliers?: string[];
  usageRecommendations?: string;
  keyMolecules?: { name: string; percentage?: number; note?: string }[];
  references?: { title: string; author?: string; year?: number; url?: string; type: 'academic' | 'supplier' | 'industry' | 'other' }[];
  notes?: string;
  verified?: boolean;
  verifiedBy?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  
  await db
    .update(sustainableAlternatives)
    .set({
      ...data,
      alternativeType: data.alternativeType as SustainableAlternative['alternativeType'] | undefined,
      olfactiveSimilarity: data.olfactiveSimilarity as SustainableAlternative['olfactiveSimilarity'] | undefined,
      availability: data.availability as SustainableAlternative['availability'] | undefined,
      priceComparison: data.priceComparison as SustainableAlternative['priceComparison'] | undefined,
    })
    .where(eq(sustainableAlternatives.id, id));
  
  return getSustainableAlternativeById(id);
}

export async function deleteSustainableAlternative(id: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(sustainableAlternatives).where(eq(sustainableAlternatives.id, id));
  return true;
}

export async function getAlternativesStats() {
  const db = await getDb();
  if (!db) return null;
  
  const [totalCount] = await db.select({ count: count() }).from(sustainableAlternatives);
  
  // Compter par type
  const byType = await db
    .select({
      type: sustainableAlternatives.alternativeType,
      count: count(),
    })
    .from(sustainableAlternatives)
    .groupBy(sustainableAlternatives.alternativeType);
  
  // Compter par disponibilité
  const byAvailability = await db
    .select({
      availability: sustainableAlternatives.availability,
      count: count(),
    })
    .from(sustainableAlternatives)
    .groupBy(sustainableAlternatives.availability);
  
  // Compter par similarité olfactive
  const bySimilarity = await db
    .select({
      similarity: sustainableAlternatives.olfactiveSimilarity,
      count: count(),
    })
    .from(sustainableAlternatives)
    .groupBy(sustainableAlternatives.olfactiveSimilarity);
  
  // Nombre d'espèces menacées avec alternatives
  const speciesWithAlternatives = await db
    .selectDistinct({ id: sustainableAlternatives.threatenedPlantId })
    .from(sustainableAlternatives);
  
  return {
    totalAlternatives: totalCount.count,
    speciesWithAlternatives: speciesWithAlternatives.length,
    byType,
    byAvailability,
    bySimilarity,
  };
}



