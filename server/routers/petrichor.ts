import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const petrichorRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getAllPetrichor();
  }),
})

