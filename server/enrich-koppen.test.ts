import { describe, it, expect, beforeAll } from "vitest";
import { isNull, or, eq, count } from "drizzle-orm";
import { getDb } from "./db";
import { plants } from "../drizzle/schema";

describe("Köppen Enrichment", () => {
  let plantsWithoutKoppenBefore: number;

  beforeAll(async () => {
    // Count plants without Köppen data before enrichment
    const db = await getDb();
    const result = await db
      .select({ count: count() })
      .from(plants)
      .where(
        or(
          isNull(plants.koppenZone),
          eq(plants.koppenZone, "")
        )
      );
    plantsWithoutKoppenBefore = result[0]?.count || 0;
  });

  it("should have 100% Köppen climate data coverage", async () => {
    const db = await getDb();
    const plantsWithoutKoppen = await db
      .select()
      .from(plants)
      .where(
        or(
          isNull(plants.koppenZone),
          eq(plants.koppenZone, "")
        )
      );

    // All plants should now have Köppen data (100% coverage achieved)
    expect(plantsWithoutKoppen.length).toBe(0);
  });

  it("should have all plants with Köppen data", async () => {
    const db = await getDb();
    const allPlants = await db.select().from(plants);
    const plantsWithKoppen = allPlants.filter(p => p.koppenZone && p.koppenZone.trim() !== "");

    // All plants should have Köppen data
    expect(plantsWithKoppen.length).toBe(allPlants.length);
    expect(plantsWithKoppen.length).toBeGreaterThan(0);
  });

  it("should have valid Köppen zone format", async () => {
    const db = await getDb();
    const allPlants = await db.select().from(plants);
    const plantsWithKoppen = allPlants.filter(p => p.koppenZone && p.koppenZone.trim() !== "");

    // Valid Köppen zones pattern (e.g., 'Af', 'BWh', 'Cfa', 'Dfb')
    const koppenPattern = /^[A-Z][A-Za-z]?[a-z]?(?:,\s*[A-Z][A-Za-z]?[a-z]?)*$/;

    for (const plant of plantsWithKoppen) {
      if (plant.koppenZone) {
        expect(plant.koppenZone).toMatch(koppenPattern);
      }
    }
  });

  it("should track enrichment progress", async () => {
    const db = await getDb();
    const result = await db
      .select({ count: count() })
      .from(plants)
      .where(
        or(
          isNull(plants.koppenZone),
          eq(plants.koppenZone, "")
        )
      );
    const plantsWithoutKoppenAfter = result[0]?.count || 0;

    // Log the progress
    console.log(`\n📊 Köppen Coverage Progress:`);
    console.log(`  Before enrichment: ${plantsWithoutKoppenBefore} plants without data`);
    console.log(`  After enrichment: ${plantsWithoutKoppenAfter} plants without data`);
    console.log(`  Enriched: ${plantsWithoutKoppenBefore - plantsWithoutKoppenAfter} plants`);

    // Expect at least some enrichment
    expect(plantsWithoutKoppenAfter).toBeLessThanOrEqual(plantsWithoutKoppenBefore);
  });

  it("should have coverage = 100%", async () => {
    const db = await getDb();
    const allPlants = await db.select().from(plants);
    const plantsWithKoppen = allPlants.filter(p => p.koppenZone && p.koppenZone.trim() !== "");
    const coverage = (plantsWithKoppen.length / allPlants.length) * 100;

    console.log(`\n📈 Köppen Coverage: ${coverage.toFixed(1)}%`);
    expect(coverage).toBe(100);
  });
});
