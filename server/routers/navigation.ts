import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { CACHE_TTL, withCache } from "../cache";

export const navigationRouter = router({
  getFeaturedItems: publicProcedure.query(async () => {
    return await withCache(
      'navigation:featured_items',
      () => db.getMegaMenuFeaturedItems(),
      CACHE_TTL.MEDIUM
    );
  }),
})

