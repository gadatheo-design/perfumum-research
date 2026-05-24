import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { getRecommendedRecettesFromFavorites, getSimilarMolecules, getSimilarRecettes} from "../db-recommendations";

export const recommendationsRouter = router({
  similarRecettes: publicProcedure
    .input(z.object({
      recetteId: z.number(),
      limit: z.number().optional().default(5),
    }))
    .query(async ({ input }) => {
      return await getSimilarRecettes(input.recetteId, input.limit);
    }),
  similarMolecules: publicProcedure
    .input(z.object({
      moleculeId: z.number(),
      limit: z.number().optional().default(5),
    }))
    .query(async ({ input }) => {
      return await getSimilarMolecules(input.moleculeId, input.limit);
    }),
  fromFavorites: publicProcedure
    .input(z.object({
      favoriteMoleculeIds: z.array(z.number()),
      limit: z.number().optional().default(10),
    }))
    .query(async ({ input }) => {
      return await getRecommendedRecettesFromFavorites(input.favoriteMoleculeIds, input.limit);
    }),
})

