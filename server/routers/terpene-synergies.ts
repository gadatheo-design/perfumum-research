import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const terpeneSynergiesRouter = router({
  listAll: publicProcedure.query(async () => {
    return await db.getAllTerpeneSynergies();
  }),
  getByPair: publicProcedure
    .input(z.object({
      terpene1Id: z.number(),
      terpene2Id: z.number(),
    }))
    .query(async ({ input }) => {
      return await db.getTerpeneSynergyByPair(input.terpene1Id, input.terpene2Id);
    }),
})

