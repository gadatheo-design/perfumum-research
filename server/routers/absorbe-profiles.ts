import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const absorbeProfilesRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getAbsorbeProfiles();
  }),
  getByPrototypeId: publicProcedure
    .input(z.object({ prototypeId: z.number() }))
    .query(async ({ input }) => {
      return await db.getAbsorbeProfileByPrototypeId(input.prototypeId);
    }),
})

