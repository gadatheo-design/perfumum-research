import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const rechercheRadicaleRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getAllRechercheRadicale();
  }),
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getRechercheRadicaleById(input);
    }),
  getBySerie: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await db.getRechercheRadicaleBySerie(input);
    }),
})

