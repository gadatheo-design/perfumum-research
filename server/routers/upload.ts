import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { storagePut } from "../storage";

export const uploadRouter = router({
  leafEconomyImage: protectedProcedure
    .input(z.object({
      leafEconomyId: z.number(),
      imageData: z.string(), // Base64 encoded image
      fileName: z.string(),
      contentType: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { storagePut } = await import('../storage');
      
      // Décoder le base64
      const base64Data = input.imageData.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Générer un nom de fichier unique
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const extension = input.fileName.split('.').pop() || 'jpg';
      const fileKey = `leaf-economies/${input.leafEconomyId}/${timestamp}-${randomSuffix}.${extension}`;
      
      // Upload vers S3
      const { url } = await storagePut(fileKey, buffer, input.contentType);
      
      // Mettre à jour la base de données
      await db.updateLeafEconomy(input.leafEconomyId, { imageUrl: url });
      
      return { url };
    }),
  
  // Upload générique vers S3 pour la galerie
  galleryImage: protectedProcedure
    .input(z.object({
      imageData: z.string(), // Base64 encoded image
      fileName: z.string(),
      contentType: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
      leafEconomyId: z.number().optional(),
      plantId: z.number().optional(),
      category: z.enum(['echantillon', 'extraction', 'analyse', 'terrain', 'equipement', 'autre']).default('echantillon'),
      tags: z.array(z.string()).optional(),
      location: z.string().optional(),
      capturedAt: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { storagePut } = await import('../storage');
      
      // Décoder le base64
      const base64Data = input.imageData.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Générer un nom de fichier unique
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const extension = input.fileName.split('.').pop() || 'jpg';
      const fileKey = `gallery/${input.category}/${timestamp}-${randomSuffix}.${extension}`;
      
      // Upload vers S3
      const { url } = await storagePut(fileKey, buffer, input.contentType);
      
      // Créer l'entrée dans la base de données
      const imageData = await db.createSampleImage({
        url,
        fileKey,
        fileName: input.fileName,
        mimeType: input.contentType,
        fileSize: buffer.length,
        title: input.title,
        description: input.description,
        leafEconomyId: input.leafEconomyId,
        plantId: input.plantId,
        category: input.category,
        tags: input.tags,
        location: input.location,
        capturedAt: input.capturedAt ? new Date(input.capturedAt) : undefined,
        uploadedBy: ctx.user?.id,
      });
      
      return imageData;
    }),
})

