import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const ghostVarietyLinksRouter = router({
  // Molecule links
  moleculeLinks: router({
    getForVariety: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getGhostVarietyMoleculeLinks(input);
      }),
    create: protectedProcedure
      .input(z.object({
        ghostVarietyId: z.number(),
        moleculeId: z.number(),
        linkType: z.enum(['dominant', 'characteristic', 'trace', 'reconstructed', 'historical', 'hypothetical', 'other']).optional(),
        percentage: z.number().optional(),
        minPercentage: z.number().optional(),
        maxPercentage: z.number().optional(),
        confidence: z.enum(['high', 'medium', 'low']).optional(),
        sourceType: z.enum(['gc_ms_analysis', 'historical_text', 'reconstruction', 'comparative', 'expert_opinion', 'other']).optional(),
        notes: z.string().optional(),
        sourceReference: z.string().optional(),
        analysisYear: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.createGhostVarietyMoleculeLink({
          ...input,
          percentage: input.percentage?.toString(),
          minPercentage: input.minPercentage?.toString(),
          maxPercentage: input.maxPercentage?.toString(),
          createdBy: ctx.user?.id,
        });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          linkType: z.enum(['dominant', 'characteristic', 'trace', 'reconstructed', 'historical', 'hypothetical', 'other']).optional(),
          percentage: z.number().optional(),
          minPercentage: z.number().optional(),
          maxPercentage: z.number().optional(),
          confidence: z.enum(['high', 'medium', 'low']).optional(),
          sourceType: z.enum(['gc_ms_analysis', 'historical_text', 'reconstruction', 'comparative', 'expert_opinion', 'other']).optional(),
          notes: z.string().optional(),
          sourceReference: z.string().optional(),
          analysisYear: z.number().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return db.updateGhostVarietyMoleculeLink(input.id, {
          ...input.data,
          percentage: input.data.percentage?.toString(),
          minPercentage: input.data.minPercentage?.toString(),
          maxPercentage: input.data.maxPercentage?.toString(),
        });
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.deleteGhostVarietyMoleculeLink(input);
      }),
  }),
  // Plant links
  plantLinks: router({
    getForVariety: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getGhostVarietyPlantLinks(input);
      }),
    create: protectedProcedure
      .input(z.object({
        ghostVarietyId: z.number(),
        plantId: z.number(),
        relationshipType: z.enum(['parent_species', 'related_variety', 'hybrid_parent', 'descendant', 'comparison', 'reconstruction_base', 'other']).optional(),
        confidence: z.enum(['high', 'medium', 'low']).optional(),
        geneticSimilarity: z.number().min(0).max(100).optional(),
        notes: z.string().optional(),
        sourceReference: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.createGhostVarietyPlantLink({
          ...input,
          createdBy: ctx.user?.id,
        });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          relationshipType: z.enum(['parent_species', 'related_variety', 'hybrid_parent', 'descendant', 'comparison', 'reconstruction_base', 'other']).optional(),
          confidence: z.enum(['high', 'medium', 'low']).optional(),
          geneticSimilarity: z.number().min(0).max(100).optional(),
          notes: z.string().optional(),
          sourceReference: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return db.updateGhostVarietyPlantLink(input.id, input.data);
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.deleteGhostVarietyPlantLink(input);
      }),
  }),
  // Images
  images: router({
    getForVariety: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getGhostVarietyImages(input);
      }),
    create: protectedProcedure
      .input(z.object({
        ghostVarietyId: z.number(),
        url: z.string(),
        fileKey: z.string(),
        filename: z.string().optional(),
        mimeType: z.string().optional(),
        fileSize: z.number().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        imageType: z.enum(['botanical_illustration', 'photograph', 'herbarium', 'reconstruction', 'artistic', 'microscopy', 'other']).optional(),
        source: z.string().optional(),
        attribution: z.string().optional(),
        year: z.number().optional(),
        license: z.string().optional(),
        sortOrder: z.number().optional(),
        isPrimary: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.createGhostVarietyImage({
          ...input,
          uploadedBy: ctx.user?.id,
        });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          imageType: z.enum(['botanical_illustration', 'photograph', 'herbarium', 'reconstruction', 'artistic', 'microscopy', 'other']).optional(),
          source: z.string().optional(),
          attribution: z.string().optional(),
          year: z.number().optional(),
          license: z.string().optional(),
          sortOrder: z.number().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return db.updateGhostVarietyImage(input.id, input.data);
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.deleteGhostVarietyImage(input);
      }),
    setPrimary: protectedProcedure
      .input(z.object({
        ghostVarietyId: z.number(),
        imageId: z.number(),
      }))
      .mutation(async ({ input }) => {
        return db.setGhostVarietyPrimaryImage(input.ghostVarietyId, input.imageId);
      }),
    // Upload image to S3 and create record
    upload: protectedProcedure
      .input(z.object({
        ghostVarietyId: z.number(),
        imageData: z.string(), // Base64 encoded image data
        contentType: z.string(),
        filename: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        imageType: z.enum(['botanical_illustration', 'photograph', 'herbarium', 'reconstruction', 'artistic', 'microscopy', 'other']).optional(),
        source: z.string().optional(),
        attribution: z.string().optional(),
        year: z.number().optional(),
        license: z.string().optional(),
        isPrimary: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { storagePut } = await import('../storage');
        
        // Décoder le base64
        const base64Data = input.imageData.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Générer un nom de fichier unique
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const ext = input.contentType.split('/')[1] || 'jpg';
        const fileKey = `ghost-varieties/${input.ghostVarietyId}/${timestamp}-${randomSuffix}.${ext}`;
        
        // Upload vers S3
        const { url } = await storagePut(fileKey, buffer, input.contentType);
        
        // Créer l'entrée en base de données
        return db.createGhostVarietyImage({
          ghostVarietyId: input.ghostVarietyId,
          url,
          fileKey,
          filename: input.filename,
          mimeType: input.contentType,
          fileSize: buffer.length,
          title: input.title,
          description: input.description,
          imageType: input.imageType,
          source: input.source,
          attribution: input.attribution,
          year: input.year,
          license: input.license,
          isPrimary: input.isPrimary,
          uploadedBy: ctx.user?.id,
        });
      }),
  }),
  // Complete variety data
  getComplete: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getGhostVarietyComplete(input);
    }),
  // Linking stats
  getStats: publicProcedure.query(async () => {
    return db.getGhostVarietyLinkingStats();
  }),
});
