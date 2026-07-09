import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db } from "../_core/db";
import { plants, apiEnrichments } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

describe("API Enrichments Router", () => {
  let testPlantId: number;

  beforeAll(async () => {
    // Créer une plante de test
    const result = await db
      .insert(plants)
      .values({
        name: "Test Plant",
        latin_name: "Rosa damascena",
        family: "Rosaceae",
        genus: "Rosa",
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();
    testPlantId = result[0].id;
  });

  afterAll(async () => {
    // Nettoyer les données de test
    await db.delete(apiEnrichments).where(eq(apiEnrichments.plant_id, testPlantId));
    await db.delete(plants).where(eq(plants.id, testPlantId));
  });

  it("should save enrichment successfully", async () => {
    const result = await db
      .insert(apiEnrichments)
      .values({
        plant_id: testPlantId,
        api_type: "wikidata",
        identifier: "Q18469235",
        source_url: "https://www.wikidata.org/entity/Q18469235",
        notes: "Test enrichment",
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    expect(result).toHaveLength(1);
    expect(result[0].identifier).toBe("Q18469235");
    expect(result[0].api_type).toBe("wikidata");
  });

  it("should retrieve enrichments for a plant", async () => {
    const results = await db
      .select()
      .from(apiEnrichments)
      .where(eq(apiEnrichments.plant_id, testPlantId));

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].plant_id).toBe(testPlantId);
  });
});
