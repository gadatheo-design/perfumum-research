import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const contentStatsRouter = router({
  getAll: publicProcedure.query(async () => {
    return db.getContentStatistics();
  }),
})

