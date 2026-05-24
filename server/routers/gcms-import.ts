import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { molecules } from "../../drizzle/schema";
import { TRPCError } from "@trpc/server";

export const gcmsImportRouter = router({

  // Rechercher une plante par nom pour l'import GC-MS
  searchPlant: protectedProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      return db.searchPlantsForGcms(input.query);
    }),

  // Rechercher une molécule existante par nom
  searchMolecule: protectedProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      return db.searchMoleculesForGcms(input.query);
    }),

  // Prévisualiser un import (dry-run) sans écrire en base
  preview: protectedProcedure
    .input(z.object({
      plantId: z.number(),
      molecules: z.array(z.object({
        moleculeId: z.number().optional(),
        moleculeName: z.string(),
        percentageMin: z.number().min(0).max(100).optional(),
        percentageMax: z.number().min(0).max(100).optional(),
        percentageTypical: z.number().min(0).max(100).optional(),
        role: z.enum(['majeur', 'secondaire', 'trace', 'variable']).default('secondaire'),
        isSignature: z.boolean().default(false),
        source: z.string().optional(),
        notes: z.string().optional(),
      })),
      overwriteExisting: z.boolean().default(false),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      return db.previewGcmsImport(input.plantId, input.molecules, input.overwriteExisting);
    }),

  // Importer un lot de molécules GC-MS pour une plante
  importBatch: protectedProcedure
    .input(z.object({
      plantId: z.number(),
      molecules: z.array(z.object({
        moleculeId: z.number().optional(),
        moleculeName: z.string(),
        percentageMin: z.number().min(0).max(100).optional(),
        percentageMax: z.number().min(0).max(100).optional(),
        percentageTypical: z.number().min(0).max(100).optional(),
        role: z.enum(['majeur', 'secondaire', 'trace', 'variable']).default('secondaire'),
        isSignature: z.boolean().default(false),
        source: z.string().optional(),
        notes: z.string().optional(),
      })),
      overwriteExisting: z.boolean().default(false),
      bibliography: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      return db.importGcmsBatch(input.plantId, input.molecules, input.overwriteExisting, input.bibliography);
    }),

  // Importer depuis un CSV parsé côté client
  importFromCsv: protectedProcedure
    .input(z.object({
      rows: z.array(z.object({
        plantName: z.string(),
        moleculeName: z.string(),
        percentageMin: z.number().optional(),
        percentageMax: z.number().optional(),
        percentageTypical: z.number().optional(),
        role: z.string().optional(),
        isSignature: z.boolean().optional(),
        source: z.string().optional(),
        notes: z.string().optional(),
      })),
      overwriteExisting: z.boolean().default(false),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      return db.importGcmsFromCsv(input.rows, input.overwriteExisting);
    }),

  // Récupérer les profils GC-MS existants pour une plante
  getProfile: protectedProcedure
    .input(z.object({ plantId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      return db.getGcmsProfile(input.plantId);
    }),
})

