import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { db } from "../_core/db";
import { apiEnrichments, plants } from "../../drizzle/schema";
import { eq, and, like } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const apiEnrichmentsRouter = router({
  searchPlants: protectedProcedure
    .input(z.object({ query: z.string().min(2) }))
    .query(async ({ input }) => {
      const results = await db
        .select({
          id: plants.id,
          name: plants.name,
          latinName: plants.latinName,
          family: plants.family,
        })
        .from(plants)
        .where(
          like(plants.name, `%${input.query}%`)
        )
        .limit(20);
      return results;
    }),

  saveEnrichment: protectedProcedure
    .input(
      z.object({
        plant_id: z.number(),
        api_type: z.enum(["gbif", "powo", "ncbi", "wikidata", "itis"]),
        identifier: z.string().min(1),
        source_url: z.string().url().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Vérifier que la plante existe
      const plant = await db
        .select({ id: plants.id })
        .from(plants)
        .where(eq(plants.id, input.plant_id))
        .limit(1);

      if (!plant || plant.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Plante non trouvée",
        });
      }

      // Supprimer l'enrichissement existant pour cette API
      await db
        .delete(apiEnrichments)
        .where(
          and(
            eq(apiEnrichments.plant_id, input.plant_id),
            eq(apiEnrichments.api_type, input.api_type)
          )
        );

      // Insérer le nouvel enrichissement
      const result = await db
        .insert(apiEnrichments)
        .values({
          plant_id: input.plant_id,
          api_type: input.api_type,
          identifier: input.identifier,
          source_url: input.source_url || null,
          notes: input.notes || null,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      return result[0];
    }),

  removeEnrichment: protectedProcedure
    .input(
      z.object({
        plant_id: z.number(),
        api_type: z.enum(["gbif", "powo", "ncbi", "wikidata", "itis"]),
      })
    )
    .mutation(async ({ input }) => {
      await db
        .delete(apiEnrichments)
        .where(
          and(
            eq(apiEnrichments.plant_id, input.plant_id),
            eq(apiEnrichments.api_type, input.api_type)
          )
        );
      return { success: true };
    }),

  getEnrichments: protectedProcedure
    .input(z.object({ plant_id: z.number() }))
    .query(async ({ input }) => {
      const results = await db
        .select()
        .from(apiEnrichments)
        .where(eq(apiEnrichments.plant_id, input.plant_id));
      return results;
    }),

  autoEnrich: protectedProcedure
    .input(z.object({ plant_id: z.number() }))
    .mutation(async ({ input }) => {
      // Récupérer la plante avec son nom latin
      const plant = await db
        .select({
          id: plants.id,
          name: plants.name,
          latinName: plants.latinName,
          gbifId: plants.gbifId,
          wikidataQid: plants.wikidataQid,
        })
        .from(plants)
        .where(eq(plants.id, input.plant_id))
        .limit(1);

      if (!plant || plant.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Plante non trouvée",
        });
      }

      const plantData = plant[0];
      const results: Array<{ api_type: string; identifier: string; source: string }> = [];
      const searchName = plantData.latinName || plantData.name;

      try {
        // Recherche Wikidata
        if (!plantData.wikidataQid) {
          try {
            const wikidataResponse = await fetch(
              `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(searchName)}&language=en&format=json`
            );
            const wikidataData = (await wikidataResponse.json()) as any;
            if (wikidataData.search && wikidataData.search.length > 0) {
              const qid = wikidataData.search[0].id;
              await db
                .delete(apiEnrichments)
                .where(
                  and(
                    eq(apiEnrichments.plant_id, input.plant_id),
                    eq(apiEnrichments.api_type, "wikidata")
                  )
                );
              await db.insert(apiEnrichments).values({
                plant_id: input.plant_id,
                api_type: "wikidata",
                identifier: qid,
                source_url: `https://www.wikidata.org/entity/${qid}`,
                notes: "Auto-enrichi depuis Wikidata",
                created_at: new Date(),
                updated_at: new Date(),
              });
              results.push({ api_type: "wikidata", identifier: qid, source: "Wikidata" });
            }
          } catch (error) {
            console.error("Erreur Wikidata:", error);
          }
        }

        // Recherche GBIF
        if (!plantData.gbifId) {
          try {
            const gbifResponse = await fetch(
              `https://api.gbif.org/v1/species/search?q=${encodeURIComponent(searchName)}&limit=1`
            );
            const gbifData = (await gbifResponse.json()) as any;
            if (gbifData.results && gbifData.results.length > 0) {
              const gbifId = gbifData.results[0].key.toString();
              await db
                .delete(apiEnrichments)
                .where(
                  and(
                    eq(apiEnrichments.plant_id, input.plant_id),
                    eq(apiEnrichments.api_type, "gbif")
                  )
                );
              await db.insert(apiEnrichments).values({
                plant_id: input.plant_id,
                api_type: "gbif",
                identifier: gbifId,
                source_url: `https://www.gbif.org/species/${gbifId}`,
                notes: "Auto-enrichi depuis GBIF",
                created_at: new Date(),
                updated_at: new Date(),
              });
              results.push({ api_type: "gbif", identifier: gbifId, source: "GBIF" });
            }
          } catch (error) {
            console.error("Erreur GBIF:", error);
          }
        }
      } catch (error) {
        console.error("Erreur enrichissement automatique:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de l'enrichissement automatique",
        });
      }

      return { success: true, results };
    }),
});
