import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const adminRouter = router({
  getStats: publicProcedure.query(async () => {
    return await db.getAdminStats();
  }),
  enrichMoleculeData: protectedProcedure.mutation(async () => {
    return await db.enrichMoleculeData();
  }),
  getBundleStats: publicProcedure.query(async () => {
    // Lit les fichiers JS du build de production et retourne leurs tailles
    const fs = await import('fs');
    const path = await import('path');
    const distDir = path.join(process.cwd(), 'dist', 'public', 'assets');
    try {
      const files = fs.readdirSync(distDir);
      const chunks = files
        .filter((f: string) => f.endsWith('.js'))
        .map((f: string) => {
          const fullPath = path.join(distDir, f);
          const stat = fs.statSync(fullPath);
          return { name: `assets/${f}`, size: stat.size };
        })
        .sort((a: { name: string; size: number }, b: { name: string; size: number }) => b.size - a.size);
      return { chunks, totalSize: chunks.reduce((acc: number, c: { size: number }) => acc + c.size, 0) };
    } catch {
      return { chunks: [], totalSize: 0 };
    }
  }),
})

