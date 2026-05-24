import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const leafEconomiesRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getAllLeafEconomies();
  }),
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getLeafEconomyById(input);
    }),
  getBySampleId: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await db.getLeafEconomyBySampleId(input);
    }),
  getByCategory: publicProcedure
    .input(z.enum(['aromatique', 'tabac', 'cannabis']))
    .query(async ({ input }) => {
      return await db.getLeafEconomiesByCategory(input);
    }),
  getByIsland: publicProcedure
    .input(z.enum(['san_andres', 'providencia', 'autre']))
    .query(async ({ input }) => {
      return await db.getLeafEconomiesByIsland(input);
    }),
  getByStatus: publicProcedure
    .input(z.enum(['brut', 'a_analyser', 'analyse', 'traduction', 'archive']))
    .query(async ({ input }) => {
      return await db.getLeafEconomiesByStatus(input);
    }),
  search: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await db.searchLeafEconomies(input);
    }),
  withAnalysis: publicProcedure.query(async () => {
    return await db.getLeafEconomiesWithAnalysis();
  }),
  withoutAnalysis: publicProcedure.query(async () => {
    return await db.getLeafEconomiesWithoutAnalysis();
  }),
  create: publicProcedure
    .input(z.object({
      sampleId: z.string().min(1),
      date: z.date().optional(),
      island: z.enum(['san_andres', 'providencia', 'autre']).optional(),
      preciseLocation: z.string().optional(),
      sourceContact: z.string().optional(),
      category: z.enum(['aromatique', 'tabac', 'cannabis']),
      species: z.string().optional(),
      claimedVariety: z.string().optional(),
      usedPart: z.enum(['feuille', 'fleur', 'resine', 'tige', 'autre']).optional(),
      state: z.enum(['frais', 'sec', 'rehydrate']).optional(),
      curingTreatment: z.enum(['aucun', 'air_cured', 'flue_cured', 'sun_cured', 'autre']).optional(),
      extraction: z.enum(['aucune', 'maceration_alcool', 'maceration_mct', 'distillation', 'headspace']).optional(),
      ratioParameters: z.string().optional(),
      duration: z.string().optional(),
      odorNotes: z.string().optional(),
      climaticAxis: z.string().optional(),
      usage: z.string().optional(),
      analysisAvailable: z.number().optional(),
      analysisMethod: z.enum(['gc_ms', 'hplc', 'autre']).optional(),
      topMoleculesList: z.string().optional(),
      topMolecule1: z.string().optional(),
      topMolecule2: z.string().optional(),
      topMolecule3: z.string().optional(),
      relativePercentages: z.string().optional(),
      absorbeInterpretation: z.string().optional(),
      status: z.enum(['brut', 'a_analyser', 'analyse', 'traduction', 'archive']).optional(),
      mediaLinks: z.string().optional(),
      imageUrl: z.string().optional(),
      ethicalNotes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await db.createLeafEconomy(input);
    }),
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      data: z.object({
        sampleId: z.string().optional(),
        date: z.date().optional(),
        island: z.enum(['san_andres', 'providencia', 'autre']).optional(),
        preciseLocation: z.string().optional(),
        sourceContact: z.string().optional(),
        category: z.enum(['aromatique', 'tabac', 'cannabis']).optional(),
        species: z.string().optional(),
        claimedVariety: z.string().optional(),
        usedPart: z.enum(['feuille', 'fleur', 'resine', 'tige', 'autre']).optional(),
        state: z.enum(['frais', 'sec', 'rehydrate']).optional(),
        curingTreatment: z.enum(['aucun', 'air_cured', 'flue_cured', 'sun_cured', 'autre']).optional(),
        extraction: z.enum(['aucune', 'maceration_alcool', 'maceration_mct', 'distillation', 'headspace']).optional(),
        ratioParameters: z.string().optional(),
        duration: z.string().optional(),
        odorNotes: z.string().optional(),
        climaticAxis: z.string().optional(),
        usage: z.string().optional(),
        analysisAvailable: z.number().optional(),
        analysisMethod: z.enum(['gc_ms', 'hplc', 'autre']).optional(),
        topMoleculesList: z.string().optional(),
        topMolecule1: z.string().optional(),
        topMolecule2: z.string().optional(),
        topMolecule3: z.string().optional(),
        relativePercentages: z.string().optional(),
        absorbeInterpretation: z.string().optional(),
        status: z.enum(['brut', 'a_analyser', 'analyse', 'traduction', 'archive']).optional(),
        mediaLinks: z.string().optional(),
        imageUrl: z.string().optional(),
        ethicalNotes: z.string().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      return await db.updateLeafEconomy(input.id, input.data);
    }),
  delete: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      await db.deleteLeafEconomy(input);
      return { success: true };
    }),
  // Upload d'image botanique pour LeafEconomy
  uploadImage: protectedProcedure
    .input(z.object({
      leafEconomyId: z.number(),
      imageData: z.string(), // Base64 encoded image data
      fileName: z.string(),
      contentType: z.string(),
    }))
    .mutation(async ({ input }) => {
      // Extraire les données base64 (enlever le préfixe data:...)
      const base64Data = input.imageData.replace(/^data:[^;]+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Générer un nom de fichier unique
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const extension = input.fileName.split('.').pop() || 'jpg';
      const fileKey = `leaf-economies/${input.leafEconomyId}/botanical-${timestamp}-${randomSuffix}.${extension}`;
      
      // Upload vers S3
      const { storagePut } = await import('../storage');
      const { url } = await storagePut(fileKey, buffer, input.contentType);
      
      // Mettre à jour l'URL dans la base de données
      await db.updateLeafEconomyImage(input.leafEconomyId, url);
      
      return { url, key: fileKey };
    }),
  // Mettre à jour l'URL de l'image
  updateImage: protectedProcedure
    .input(z.object({
      leafEconomyId: z.number(),
      imageUrl: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await db.updateLeafEconomyImage(input.leafEconomyId, input.imageUrl);
    }),
  // Supprimer l'image
  deleteImage: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return await db.deleteLeafEconomyImage(input);
    }),
});
