import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const familiesRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getAllFamilies();
  }),
  getById: publicProcedure
    .input((val: unknown) => {
      if (typeof val !== "number") throw new Error("Expected number");
      return val;
    })
    .query(async ({ input }) => {
      return await db.getFamilyById(input);
    }),
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      type: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await db.createFamily(input);
    }),
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      type: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.updateFamilyFull(id, data);
    }),
  delete: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return await db.deleteFamily(input);
    }),
})

