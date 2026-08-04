import { z } from "zod";
import { adminProcedure, publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const accordsRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getAllAccords();
  }),
  getById: publicProcedure
    .input((val: unknown) => {
      if (typeof val !== "number") throw new Error("Expected number");
      return val;
    })
    .query(async ({ input }) => {
      return await db.getAccordById(input);
    }),
  create: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      familyId: z.number().nullable().optional(),
      olfactiveProfile: z.string().optional(),
      emotionalResonance: z.string().optional(),
      texture: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await db.createAccord(input);
    }),
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      familyId: z.number().nullable().optional(),
      olfactiveProfile: z.string().optional(),
      emotionalResonance: z.string().optional(),
      texture: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.updateAccordFull(id, data);
    }),
  delete: adminProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return await db.deleteAccord(input);
    }),
})

