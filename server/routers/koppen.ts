import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { plants } from "../../drizzle/schema";
import { isNull, or, eq } from "drizzle-orm";

/**
 * Köppen Climate Classification Reference
 */
const koeppen_reference: Record<string, string[]> = {
  "tropical": ["Af", "Am", "Aw", "As"],
  "rainforest": ["Af", "Am"],
  "monsoon": ["Am", "Aw", "As"],
  "subtropical": ["Cfa", "Cfb", "Cw", "Cs"],
  "mediterranean": ["Cs", "Csa", "Csb"],
  "temperate": ["Cfb", "Cfc", "Dfb", "Dfc"],
  "arid": ["BWh", "BWk"],
  "semi-arid": ["BSh", "BSk"],
  "desert": ["BWh", "BWk"],
  "boreal": ["Dfc", "Dfd", "Dw"],
  "alpine": ["ET", "EF"],
  "tundra": ["ET"],
  "lemongrass": ["Af", "Am", "Aw"],
  "lavender": ["Cs", "Csa", "Cfb"],
  "rose": ["Cfb", "Cfa", "Cs"],
  "mint": ["Cfb", "Cfa", "Dfb"],
  "basil": ["Cfa", "Aw", "Am"],
  "thyme": ["Cs", "Cfb", "Csa"],
  "sage": ["Cs", "Csa", "Cfb"],
  "rosemary": ["Cs", "Csa", "Cfb"],
  "jasmine": ["Cfa", "Aw", "Am"],
  "ylang": ["Af", "Am"],
  "sandalwood": ["Aw", "As", "Cw"],
  "vetiver": ["Aw", "Am", "Cw"],
  "patchouli": ["Af", "Am", "Aw"],
  "cedar": ["Dfb", "Dfc", "Cfb"],
  "pine": ["Dfb", "Dfc", "Cfb", "Cfc"],
  "fir": ["Dfc", "Dfb", "Cfc"],
  "spruce": ["Dfc", "Dfb"],
  "juniper": ["BSk", "Dfb", "Dfc"],
  "cypress": ["Cs", "Csa", "Cfb"],
  "eucalyptus": ["Csa", "Cfb", "Aw"],
  "tea": ["Cfa", "Cfb", "Aw"],
  "coffee": ["Aw", "Am", "Af"],
  "cocoa": ["Af", "Am"],
  "vanilla": ["Af", "Am"],
  "cinnamon": ["Af", "Am", "Aw"],
  "clove": ["Af", "Am"],
  "nutmeg": ["Af", "Am"],
  "pepper": ["Af", "Am", "Aw"],
  "ginger": ["Aw", "Am", "Cw"],
  "turmeric": ["Aw", "Am", "Cw"],
  "cardamom": ["Af", "Am", "Aw"],
  "saffron": ["Cs", "BSk", "Csa"],
  "oak": ["Cfb", "Dfb", "Cfa"],
  "birch": ["Dfb", "Dfc", "Cfb"],
  "maple": ["Dfb", "Dfc", "Cfb"],
  "ash": ["Cfb", "Dfb", "Cfa"],
  "elm": ["Cfb", "Dfb", "Cfa"],
  "willow": ["Cfb", "Dfb", "Cfa"],
  "poplar": ["Dfb", "Cfb", "Cfa"],
  "beech": ["Cfb", "Dfb"],
  "chestnut": ["Cfb", "Cfa"],
  "walnut": ["Cfb", "Cfa", "Dfb"],
  "hazel": ["Cfb", "Dfb"],
  "alder": ["Cfb", "Dfb", "Cfc"],
  "larch": ["Dfc", "Dfb"],
  "hemlock": ["Dfc", "Cfb"],
  "yew": ["Cfb", "Dfb"],
  "holly": ["Cfb", "Cfa"],
  "ivy": ["Cfb", "Cfa", "Cs"],
};

/**
 * Extract keywords from text
 */
function extractKeywords(text: string | null): string[] {
  if (!text) return [];
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
  return Array.from(new Set(normalized));
}

/**
 * Find Köppen zones for a plant
 */
function findKoppenZones(
  plantName: string | null,
  family: string | null,
  habitat: string | null,
  origin: string | null
): string {
  const keywords = [
    ...extractKeywords(plantName),
    ...extractKeywords(family),
    ...extractKeywords(habitat),
    ...extractKeywords(origin)
  ];

  const zones = new Set<string>();
  
  for (const keyword of keywords) {
    if (koeppen_reference[keyword]) {
      koeppen_reference[keyword].forEach(z => zones.add(z));
    }
  }

  if (zones.size === 0) {
    if (habitat?.includes("tropical")) zones.add("Af");
    else if (habitat?.includes("subtropical")) zones.add("Cfa");
    else if (habitat?.includes("temperate")) zones.add("Cfb");
    else if (habitat?.includes("arid")) zones.add("BWh");
    else if (habitat?.includes("boreal")) zones.add("Dfc");
    else zones.add("Cfb");
  }

  return Array.from(zones).sort().join(", ");
}

export const koppenRouter = {
  /**
   * Get plants without Köppen climate data
   */
  getPlantsWithoutKoppen: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const plantsWithoutKoppen = await db
      .select()
      .from(plants)
      .where(
        or(
          isNull(plants.koppenZone),
          eq(plants.koppenZone, "")
        )
      );

    return {
      count: plantsWithoutKoppen.length,
      plants: plantsWithoutKoppen.slice(0, 10) // Return first 10 for preview
    };
  }),

  /**
   * Enrich Köppen data for all plants
   */
  enrichKoppenData: protectedProcedure.mutation(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Get plants without Köppen data
    const plantsWithoutKoppen = await db
      .select()
      .from(plants)
      .where(
        or(
          isNull(plants.koppenZone),
          eq(plants.koppenZone, "")
        )
      );

    let successCount = 0;
    let errorCount = 0;
    const updates: Array<{ id: number; name: string; zones: string }> = [];

    // Prepare updates
    for (const plant of plantsWithoutKoppen) {
      const zones = findKoppenZones(
        plant.name,
        plant.family,
        plant.habitat,
        plant.origin
      );

      if (zones) {
        updates.push({
          id: plant.id,
          name: plant.name,
          zones: zones
        });
      }
    }

    // Apply updates
    for (const update of updates) {
      try {
        await db
          .update(plants)
          .set({
            koppenZone: update.zones,
            koppenDescription: `Enriched: ${update.zones}`
          })
          .where(eq(plants.id, update.id));
        successCount++;
      } catch (error) {
        errorCount++;
        console.error(`Error updating plant ${update.name}:`, error);
      }
    }

    return {
      success: true,
      message: `Enriched ${successCount} plants with Köppen climate data`,
      stats: {
        total: plantsWithoutKoppen.length,
        updated: successCount,
        errors: errorCount,
        coverage: `${((plantsWithoutKoppen.length - successCount) / plantsWithoutKoppen.length * 100).toFixed(1)}%`
      }
    };
  }),

  /**
   * Get Köppen coverage statistics
   */
  getKoppenCoverage: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const allPlants = await db.select().from(plants);
    const plantsWithKoppen = allPlants.filter(p => p.koppenZone && p.koppenZone.trim() !== "");
    const plantsWithoutKoppen = allPlants.filter(p => !p.koppenZone || p.koppenZone.trim() === "");

    const coverage = (plantsWithKoppen.length / allPlants.length) * 100;

    return {
      total: allPlants.length,
      withKoppen: plantsWithKoppen.length,
      withoutKoppen: plantsWithoutKoppen.length,
      coverage: coverage.toFixed(1),
      zones: Array.from(new Set(
        plantsWithKoppen
          .flatMap(p => p.koppenZone?.split(",").map(z => z.trim()) || [])
      )).sort()
    };
  })
};
