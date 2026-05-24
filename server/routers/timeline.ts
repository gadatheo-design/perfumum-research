import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const timelineRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getAllMilestones();
  }),
  getByPhase: publicProcedure
    .input((val: unknown) => {
      if (typeof val !== "string") throw new Error("Expected string");
      return val;
    })
    .query(async ({ input }) => {
      return await db.getMilestonesByPhase(input);
    }),
  getByYear: publicProcedure
    .input((val: unknown) => {
      if (typeof val !== "number") throw new Error("Expected number");
      return val;
    })
    .query(async ({ input }) => {
      return await db.getMilestonesByYear(input);
    }),
  stats: publicProcedure.query(async () => {
    return await db.getTimelineStats();
  }),
})

