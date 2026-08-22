import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import { appRouter } from "../routers";
import { getDb } from "../db";
import type { TrpcContext } from "../_core/context";

function createAuthenticatedContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "api-enrichments-test-user",
      name: "Utilisateur de test",
      role: "user",
    } as TrpcContext["user"],
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {}, cookie: () => {} } as TrpcContext["res"],
  };
}

describe("API Enrichments Router", () => {
  const caller = appRouter.createCaller(createAuthenticatedContext());
  const testPlantName = `PERFUMUM Vitest API Enrichment ${Date.now()}`;
  let testPlantId: number;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("Connexion base de données indisponible");

    await db.execute(sql`
      INSERT INTO plants (name, latin_name, family, created_at, updated_at)
      VALUES (${testPlantName}, 'Rosa damascena', 'Rosaceae', NOW(), NOW())
    `);

    const [rows] = await db.execute(
      sql`SELECT id FROM plants WHERE name = ${testPlantName} LIMIT 1`
    ) as [{ id: number }[]];
    testPlantId = rows[0]?.id;
    if (!testPlantId) throw new Error("Création de plante de test échouée");
  });

  afterAll(async () => {
    const db = await getDb();
    if (!db || !testPlantId) return;
    await db.execute(sql`DELETE FROM api_enrichments WHERE plant_id = ${testPlantId}`);
    await db.execute(sql`DELETE FROM plants WHERE id = ${testPlantId}`);
  });

  it("enregistre un identifiant Wikidata pour une plante", async () => {
    const result = await caller.apiEnrichments.saveEnrichment({
      plant_id: testPlantId,
      api_type: "wikidata",
      identifier: "Q18469235",
      source_url: "https://www.wikidata.org/entity/Q18469235",
      notes: "Test d'intégration Vitest",
    });

    expect(result).toEqual({ success: true });
  });

  it("retrouve les enrichissements enregistrés pour la plante", async () => {
    const results = await caller.apiEnrichments.getEnrichments({ plant_id: testPlantId });

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      plant_id: testPlantId,
      api_type: "wikidata",
      identifier: "Q18469235",
    });
  });
});
