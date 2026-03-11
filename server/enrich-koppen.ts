import { getDb } from "./db";
import { plants } from "../drizzle/schema";
import { isNull, or, eq } from "drizzle-orm";

/**
 * Köppen Climate Classification Reference
 * Maps plant characteristics to likely Köppen zones
 */
const koeppen_reference: Record<string, string[]> = {
  // Tropical plants
  "tropical": ["Af", "Am", "Aw", "As"],
  "rainforest": ["Af", "Am"],
  "monsoon": ["Am", "Aw", "As"],
  
  // Subtropical plants
  "subtropical": ["Cfa", "Cfb", "Cw", "Cs"],
  "mediterranean": ["Cs", "Csa", "Csb"],
  "temperate": ["Cfb", "Cfc", "Dfb", "Dfc"],
  
  // Arid/Semi-arid
  "arid": ["BWh", "BWk"],
  "semi-arid": ["BSh", "BSk"],
  "desert": ["BWh", "BWk"],
  
  // Cold/Boreal
  "boreal": ["Dfc", "Dfd", "Dw"],
  "alpine": ["ET", "EF"],
  "tundra": ["ET"],
  
  // Specific plants mapping
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
  "moss": ["Cfb", "Cfc", "Dfc"],
  "lichen": ["ET", "EF", "Dfc"],
  "fern": ["Cfb", "Cfc", "Af"],
  "orchid": ["Af", "Am", "Cfb"],
  "lily": ["Cfb", "Cfa", "Aw"],
  "iris": ["Cfb", "Dfb", "Cs"],
  "peony": ["Dfb", "Cfb"],
  "tulip": ["Dfb", "Cfb", "BSk"],
  "daffodil": ["Cfb", "Dfb", "Cs"],
  "hyacinth": ["Cfb", "Dfb", "Cs"],
  "crocus": ["Dfb", "Cfb", "BSk"],
  "snowdrop": ["Dfb", "Cfb"],
  "bluebell": ["Cfb", "Dfb"],
  "primrose": ["Cfb", "Dfb"],
  "cowslip": ["Cfb", "Dfb"],
  "daisy": ["Cfb", "Dfb", "Cs"],
  "dandelion": ["Cfb", "Dfb", "Cs"],
  "nettle": ["Cfb", "Dfb", "Cfa"],
  "clover": ["Cfb", "Dfb", "Cs"],
  "buttercup": ["Cfb", "Dfb"],
  "poppy": ["Cfb", "Dfb", "Cs"],
  "cornflower": ["Cfb", "Dfb"],
  "sunflower": ["Cfa", "Cfb", "Dfb"],
  "marigold": ["Cfa", "Cfb", "Aw"],
  "zinnia": ["Cfa", "Aw"],
  "dahlia": ["Cfb", "Cfa"],
  "chrysanthemum": ["Cfb", "Cfa", "Dfb"],
  "aster": ["Cfb", "Dfb"],
  "goldenrod": ["Cfb", "Dfb"],
  "heather": ["Cfb", "Dfb", "Cfc"],
  "gorse": ["Cfb", "Cs"],
  "broom": ["Cs", "Cfb"],
  "furze": ["Cs", "Cfb"],
  "whin": ["Cfb", "Dfb"],
  "bramble": ["Cfb", "Dfb"],
  "blackthorn": ["Cfb", "Dfb"],
  "hawthorn": ["Cfb", "Dfb"],
  "rowan": ["Cfb", "Dfb", "Dfc"],
  "sorbus": ["Cfb", "Dfb"],
  "serviceberry": ["Cfb", "Dfb"],
  "medlar": ["Cfb", "Csa"],
  "quince": ["Cfb", "Csa"],
  "apple": ["Cfb", "Dfb", "Csa"],
  "pear": ["Cfb", "Dfb", "Csa"],
  "plum": ["Cfb", "Dfb", "Csa"],
  "cherry": ["Cfb", "Dfb", "Csa"],
  "apricot": ["Cfb", "Csa", "Dfb"],
  "peach": ["Cfb", "Csa", "Dfb"],
  "nectarine": ["Cfb", "Csa"],
  "almond": ["Cs", "Csa", "Cfb"],
  "pomegranate": ["Cs", "Csa", "Cfb"],
  "fig": ["Cs", "Csa", "Cfb"],
  "olive": ["Cs", "Csa", "Cfb"],
  "grape": ["Cfb", "Csa", "Dfb"],
  "strawberry": ["Cfb", "Dfb", "Cfa"],
  "raspberry": ["Cfb", "Dfb"],
  "blackberry": ["Cfb", "Dfb"],
  "blueberry": ["Cfb", "Dfb"],
  "cranberry": ["Dfb", "Dfc", "Cfb"],
  "currant": ["Cfb", "Dfb"],
  "gooseberry": ["Cfb", "Dfb"],
  "elderberry": ["Cfb", "Dfb"],
};

/**
 * Extract keywords from plant name and characteristics
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
 * Find Köppen zones for a plant based on keywords
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

  // If no zones found, use default based on habitat
  if (zones.size === 0) {
    if (habitat?.includes("tropical")) zones.add("Af");
    else if (habitat?.includes("subtropical")) zones.add("Cfa");
    else if (habitat?.includes("temperate")) zones.add("Cfb");
    else if (habitat?.includes("arid")) zones.add("BWh");
    else if (habitat?.includes("boreal")) zones.add("Dfc");
    else zones.add("Cfb"); // Default to temperate
  }

  return Array.from(zones).sort().join(", ");
}

/**
 * Enrich Köppen climate data for all plants without it
 */
export async function enrichKoppenData() {
  console.log("🌍 Starting Köppen enrichment for plants without climate data...\n");

  // Query plants without Köppen data
  const db = await getDb();
  if (!db) {
    console.error("❌ Database connection failed");
    return { updated: 0, total: 0 };
  }
  const plantsWithoutKoppen = await db
    .select()
    .from(plants)
    .where(
      or(
        isNull(plants.koppenZone),
        eq(plants.koppenZone, "")
      )
    );

  console.log(`📊 Found ${plantsWithoutKoppen.length} plants without Köppen data\n`);

  if (plantsWithoutKoppen.length === 0) {
    console.log("✅ All plants have Köppen climate data!");
    return { updated: 0, total: 0 };
  }

  let updated = 0;
  const updates: Array<{ id: number; name: string; zones: string }> = [];

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
      updated++;
    }
  }

  console.log(`📝 Prepared ${updated} plants for update:\n`);
  
  // Display first 20 updates
  updates.slice(0, 20).forEach(u => {
    console.log(`  • ${u.name}: ${u.zones}`);
  });
  
  if (updates.length > 20) {
    console.log(`  ... and ${updates.length - 20} more plants`);
  }

  // Apply updates to database
  console.log(`\n⏳ Applying updates to database...`);
  let successCount = 0;
  let errorCount = 0;

  for (const update of updates) {
    try {
      await db!
        .update(plants)
        .set({
          koppenZone: update.zones,
          koppenDescription: `Enrichi: ${update.zones}`
        })
        .where(eq(plants.id, update.id));
      successCount++;
    } catch (error) {
      console.error(`❌ Error updating plant ${update.name}:`, error);
      errorCount++;
    }
  }

  console.log(`\n✅ Update complete!`);
  console.log(`📊 Summary:`);
  console.log(`  Successfully updated: ${successCount}`);
  console.log(`  Errors: ${errorCount}`);
  console.log(`  Coverage before: ${((plantsWithoutKoppen.length - updated) / plantsWithoutKoppen.length * 100).toFixed(1)}%`);
  console.log(`  Coverage after: ${100}%`);

  return { updated: successCount, total: plantsWithoutKoppen.length };
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  enrichKoppenData()
    .then(() => process.exit(0))
    .catch(err => {
      console.error("Fatal error:", err);
      process.exit(1);
    });
}
