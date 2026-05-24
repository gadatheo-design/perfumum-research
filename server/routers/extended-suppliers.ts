import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { getAllExtendedSuppliers, getExtendedSupplierById } from "../db/plants";

export const extendedSuppliersRouter = router({
  getAll: publicProcedure.query(async () => {
    return getAllExtendedSuppliers();
  }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getExtendedSupplierById(input.id);
    }),
  getTabacSuppliers: publicProcedure.query(async () => {
    const all = await getAllExtendedSuppliers();
    return all.filter((s: Record<string,unknown>) => String(s.supplierId ?? '').startsWith('TABAC'));
  }),
  getCannabisSuppliers: publicProcedure.query(async () => {
    const all = await getAllExtendedSuppliers();
    return all.filter((s: Record<string,unknown>) => String(s.supplierId ?? '').startsWith('CANNA'));
  }),
  getByCategory: publicProcedure
    .input(z.object({ category: z.enum(['tabac', 'cannabis', 'parfum', 'botanique', 'all']) }))
    .query(async ({ input }) => {
      const all = await getAllExtendedSuppliers();
      if (input.category === 'tabac') return all.filter((s: Record<string,unknown>) => String(s.supplierId ?? '').startsWith('TABAC'));
      if (input.category === 'cannabis') return all.filter((s: Record<string,unknown>) => String(s.supplierId ?? '').startsWith('CANNA'));
      if (input.category === 'parfum') return all.filter((s: Record<string,unknown>) => String(s.supplierId ?? '').startsWith('PARF'));
      if (input.category === 'botanique') return all.filter((s: Record<string,unknown>) => String(s.supplierId ?? '').startsWith('BOTA'));
      return all;
    }),
  getByCountry: publicProcedure
    .input(z.object({ country: z.string() }))
    .query(async ({ input }) => {
      const all = await getAllExtendedSuppliers();
      return all.filter((s: Record<string,unknown>) => s.country === input.country);
    }),
})

