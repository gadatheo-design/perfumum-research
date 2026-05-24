import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const thematicAxesRouter = router({
  // Liste tous les axes thématiques
  list: publicProcedure.query(async () => {
    return db.getAllThematicAxes();
  }),
  
  // Alias getAll pour compatibilité
  getAll: publicProcedure.query(async () => {
    return db.getAllThematicAxes();
  }),
  
  // Obtenir un axe par son code
  getByCode: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return db.getThematicAxisByCode(input);
    }),
})

