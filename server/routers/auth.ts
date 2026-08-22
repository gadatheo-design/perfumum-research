import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "../_core/cookies";

export const authRouter = router({
  me: publicProcedure.query(opts => opts.ctx.user),
  // public-write: justifié — doit rester appelable même si la session est déjà invalide, ne fait que nettoyer un cookie côté client
  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return {
      success: true,
    } as const;
  }),
})

