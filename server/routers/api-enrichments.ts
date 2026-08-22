/**
 * api-enrichments.ts — Routeur tRPC pour la gestion des identifiants API des plantes
 * Utilise getDb() + SQL brut (table api_enrichments existe en DB mais pas dans le schema Drizzle)
 */
import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const apiEnrichmentsRouter = router({

  searchPlants: protectedProcedure
    .input(z.object({ query: z.string().min(2) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const q = `%${input.query}%`;
      const [rows] = await db.execute(
        sql`SELECT id, name, latin_name AS latinName, family FROM plants WHERE name LIKE ${q} OR latin_name LIKE ${q} ORDER BY name LIMIT 20`
      ) as any;
      return (rows || []) as { id: number; name: string; latinName: string; family: string }[];
    }),

  getEnrichments: protectedProcedure
    .input(z.object({ plant_id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const [rows] = await db.execute(
        sql`SELECT id, plant_id, api_type, identifier, source_url, notes, verified_at, created_at, updated_at FROM api_enrichments WHERE plant_id = ${input.plant_id} ORDER BY api_type`
      ) as any;
      return (rows || []) as {
        id: number; plant_id: number; api_type: string; identifier: string;
        source_url: string | null; notes: string | null; verified_at: Date | null;
        created_at: Date; updated_at: Date;
      }[];
    }),

  saveEnrichment: protectedProcedure
    .input(z.object({
      plant_id: z.number(),
      api_type: z.enum(["gbif", "powo", "ncbi", "wikidata", "itis"]),
      identifier: z.string().min(1),
      source_url: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB non disponible" });
      // Upsert : supprimer l'existant puis insérer
      await db.execute(
        sql`DELETE FROM api_enrichments WHERE plant_id = ${input.plant_id} AND api_type = ${input.api_type}`
      );
      await db.execute(
        sql`INSERT INTO api_enrichments (plant_id, api_type, identifier, source_url, notes, created_at, updated_at)
            VALUES (${input.plant_id}, ${input.api_type}, ${input.identifier}, ${input.source_url ?? null}, ${input.notes ?? null}, NOW(), NOW())`
      );
      return { success: true };
    }),

  removeEnrichment: protectedProcedure
    .input(z.object({
      plant_id: z.number(),
      api_type: z.enum(["gbif", "powo", "ncbi", "wikidata", "itis"]),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB non disponible" });
      await db.execute(
        sql`DELETE FROM api_enrichments WHERE plant_id = ${input.plant_id} AND api_type = ${input.api_type}`
      );
      return { success: true };
    }),

  autoEnrich: protectedProcedure
    .input(z.object({ plant_id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB non disponible" });

      // Récupérer la plante
      const [plantRows] = await db.execute(
        sql`SELECT id, name, latin_name AS latinName, gbif_id AS gbifId, wikidata_qid AS wikidataQid FROM plants WHERE id = ${input.plant_id} LIMIT 1`
      ) as any;
      const plantArr = plantRows as { id: number; name: string; latinName: string; gbifId: string | null; wikidataQid: string | null }[];
      if (!plantArr || plantArr.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Plante non trouvée" });
      }
      const plant = plantArr[0];
      const searchName = plant.latinName || plant.name;
      const results: Array<{ api_type: string; identifier: string; source: string }> = [];

      try {
        // ── Wikidata ──────────────────────────────────────────────────────────
        if (!plant.wikidataQid) {
          try {
            const wikidataResponse = await fetch(
              `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(searchName)}&language=en&format=json`
            );
            const wikidataData = await wikidataResponse.json() as { search?: { id: string }[] };
            if (wikidataData.search && wikidataData.search.length > 0) {
              const qid = wikidataData.search[0].id;
              await db.execute(
                sql`DELETE FROM api_enrichments WHERE plant_id = ${input.plant_id} AND api_type = 'wikidata'`
              );
              await db.execute(
                sql`INSERT INTO api_enrichments (plant_id, api_type, identifier, source_url, notes, created_at, updated_at)
                    VALUES (${input.plant_id}, 'wikidata', ${qid}, ${'https://www.wikidata.org/entity/' + qid}, 'Auto-enrichi depuis Wikidata', NOW(), NOW())`
              );
              results.push({ api_type: "wikidata", identifier: qid, source: "Wikidata" });
            }
          } catch (err) {
            console.error("Erreur Wikidata:", err);
          }
        }

        // ── GBIF ──────────────────────────────────────────────────────────────
        if (!plant.gbifId) {
          try {
            const gbifResponse = await fetch(
              `https://api.gbif.org/v1/species/search?q=${encodeURIComponent(searchName)}&limit=1`
            );
            const gbifData = await gbifResponse.json() as { results?: { key: number }[] };
            if (gbifData.results && gbifData.results.length > 0) {
              const gbifId = gbifData.results[0].key.toString();
              await db.execute(
                sql`DELETE FROM api_enrichments WHERE plant_id = ${input.plant_id} AND api_type = 'gbif'`
              );
              await db.execute(
                sql`INSERT INTO api_enrichments (plant_id, api_type, identifier, source_url, notes, created_at, updated_at)
                    VALUES (${input.plant_id}, 'gbif', ${gbifId}, ${'https://www.gbif.org/species/' + gbifId}, 'Auto-enrichi depuis GBIF', NOW(), NOW())`
              );
              results.push({ api_type: "gbif", identifier: gbifId, source: "GBIF" });
            }
          } catch (err) {
            console.error("Erreur GBIF:", err);
          }
        }
      } catch (err) {
        console.error("Erreur enrichissement automatique:", err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erreur lors de l'enrichissement automatique" });
      }

      return { success: true, results };
    }),
});
