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
          latin_name: plants.latin_name,
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
});
