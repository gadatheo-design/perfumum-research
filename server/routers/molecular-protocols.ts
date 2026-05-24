import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const molecularProtocolsRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getAllMolecularProtocols();
  }),
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getMolecularProtocolById(input);
    }),
  getByStudyId: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getMolecularProtocolsByStudyId(input);
    }),
})

