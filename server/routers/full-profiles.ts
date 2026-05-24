import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const fullProfilesRouter = router({
  getMolecule: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getFullMoleculeProfile(input);
    }),
  getPlant: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getFullPlantProfile(input);
    }),
  getTerroir: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getFullTerroirProfile(input);
    }),
})

