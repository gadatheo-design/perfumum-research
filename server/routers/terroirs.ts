import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { getAllTerroirs, getTerroirById, getTerroirsByCountry } from "../db/plants";

export const terroirsRouter = router({
  getAll: publicProcedure.query(async () => {
    return getAllTerroirs();
  }),
  getByCountry: publicProcedure
    .input(z.object({ country: z.string() }))
    .query(async ({ input }) => {
      return getTerroirsByCountry(input.country);
    }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getTerroirById(input.id);
    }),
})

