// @ts-nocheck
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const researchEntriesRouter = router({
  // Lister toutes les entrées avec filtres
  list: publicProcedure
    .input(z.object({
      axisId: z.number().optional(),
      entryType: z.string().optional(),
      status: z.string().optional(),
      importance: z.string().optional(),
      search: z.string().optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    }).optional())
    .query(async ({ input }) => {
      return db.getAllResearchEntries(input || {});
    }),
  
  // Obtenir une entrée par ID
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getResearchEntryById(input);
    }),
  
  // Obtenir une entrée par code
  getByCode: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return db.getResearchEntryByCode(input);
    }),
  
  // Obtenir les entrées d'un axe
  getByAxis: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getResearchEntriesByAxis(input);
    }),
  
  // Obtenir le prochain code d'entrée
  getNextCode: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return db.getNextEntryCode(input);
    }),
  
  // Créer une nouvelle entrée
  create: protectedProcedure
    .input(z.object({
      entryCode: z.string(),
      axisId: z.number(),
      title: z.string(),
      content: z.string().optional(),
      summary: z.string().optional(),
      entryType: z.enum(['note', 'observation', 'hypothese', 'resultat', 'conclusion', 'question', 'idee', 'protocole', 'donnees', 'analyse', 'reference', 'citation', 'media', 'lien', 'autre']).optional(),
      status: z.enum(['brouillon', 'en_revision', 'valide', 'archive']).optional(),
      importance: z.enum(['critique', 'haute', 'moyenne', 'basse', 'reference']).optional(),
      entryDate: z.date().optional(),
      attachments: z.array(z.object({
        name: z.string(),
        url: z.string(),
        type: z.string(),
        size: z.number().optional(),
      })).optional(),
      bibliographyIds: z.array(z.number()).optional(),
      linkedMoleculeIds: z.array(z.number()).optional(),
      linkedPlantIds: z.array(z.number()).optional(),
      linkedRecetteIds: z.array(z.number()).optional(),
      linkedPrototypeIds: z.array(z.number()).optional(),
      tags: z.array(z.string()).optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return db.createResearchEntry({
        ...input,
        createdBy: ctx.user?.id,
      });
    }),
  
  // Mettre à jour une entrée
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      entryCode: z.string().optional(),
      axisId: z.number().optional(),
      title: z.string().optional(),
      content: z.string().optional(),
      summary: z.string().optional(),
      entryType: z.enum(['note', 'observation', 'hypothese', 'resultat', 'conclusion', 'question', 'idee', 'protocole', 'donnees', 'analyse', 'reference', 'citation', 'media', 'lien', 'autre']).optional(),
      status: z.enum(['brouillon', 'en_revision', 'valide', 'archive']).optional(),
      importance: z.enum(['critique', 'haute', 'moyenne', 'basse', 'reference']).optional(),
      entryDate: z.date().optional(),
      attachments: z.array(z.object({
        name: z.string(),
        url: z.string(),
        type: z.string(),
        size: z.number().optional(),
      })).optional(),
      bibliographyIds: z.array(z.number()).optional(),
      linkedMoleculeIds: z.array(z.number()).optional(),
      linkedPlantIds: z.array(z.number()).optional(),
      linkedRecetteIds: z.array(z.number()).optional(),
      linkedPrototypeIds: z.array(z.number()).optional(),
      tags: z.array(z.string()).optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return db.updateResearchEntry(id, data);
    }),
  
  // Supprimer une entrée
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return db.deleteResearchEntry(input);
    }),
})

