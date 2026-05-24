import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const batchImportRouter = router({
  getCsvTemplate: publicProcedure.query(() => {
    return {
      headers: ['filename', 'title', 'description', 'category', 'leaf_economy_id', 'plant_id', 'tags', 'location', 'captured_at'],
      categories: ['echantillon', 'extraction', 'analyse', 'terrain', 'equipement', 'autre'],
      example: 'photo1.jpg,Ma photo,Description de la photo,echantillon,1,,botanique;terrain,San Andrés,2024-01-15',
      instructions: [
        'filename (requis): Nom du fichier image dans le ZIP',
        'title: Titre de l\'image',
        'description: Description détaillée',
        'category: echantillon, extraction, analyse, terrain, equipement, autre',
        'leaf_economy_id: ID de l\'échantillon LeafEconomy associé',
        'plant_id: ID de la plante associée',
        'tags: Tags séparés par des points-virgules',
        'location: Lieu de la prise de vue',
        'captured_at: Date de capture (YYYY-MM-DD)',
      ],
    };
  }),

  validateCsv: protectedProcedure
    .input(z.object({ csvContent: z.string() }))
    .mutation(async ({ input }) => {
      const lines = input.csvContent.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        return { valid: false, error: 'Le CSV doit contenir au moins un en-tête et une ligne de données', totalRows: 0, validRows: 0, rows: [] };
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      if (!headers.includes('filename')) {
        return { valid: false, error: 'La colonne "filename" est requise', totalRows: 0, validRows: 0, rows: [] };
      }

      const filenameIndex = headers.indexOf('filename');
      const titleIndex = headers.indexOf('title');
      const descriptionIndex = headers.indexOf('description');
      const categoryIndex = headers.indexOf('category');
      const leafEconomyIdIndex = headers.indexOf('leaf_economy_id');
      const plantIdIndex = headers.indexOf('plant_id');
      const tagsIndex = headers.indexOf('tags');
      const locationIndex = headers.indexOf('location');

      const validCategories = ['echantillon', 'extraction', 'analyse', 'terrain', 'equipement', 'autre'];
      const rows: Record<string,unknown>[] = [];
      let validCount = 0;

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const filename = values[filenameIndex] || '';
        const category = values[categoryIndex] || 'echantillon';
        const tags = tagsIndex >= 0 && values[tagsIndex] ? values[tagsIndex].split(';').map(t => t.trim()).filter(Boolean) : [];

        const row = {
          filename,
          title: titleIndex >= 0 ? values[titleIndex] : '',
          description: descriptionIndex >= 0 ? values[descriptionIndex] : '',
          category,
          leafEconomyId: leafEconomyIdIndex >= 0 && values[leafEconomyIdIndex] ? parseInt(values[leafEconomyIdIndex]) : null,
          plantId: plantIdIndex >= 0 && values[plantIdIndex] ? parseInt(values[plantIdIndex]) : null,
          tags,
          location: locationIndex >= 0 ? values[locationIndex] : '',
          valid: true,
          error: '',
        };

        if (!filename) {
          row.valid = false;
          row.error = 'Nom de fichier manquant';
        } else if (!validCategories.includes(category.toLowerCase())) {
          row.valid = false;
          row.error = `Catégorie invalide: ${category}`;
        }

        if (row.valid) validCount++;
        rows.push(row);
      }

      return {
        valid: validCount === rows.length,
        totalRows: rows.length,
        validRows: validCount,
        rows,
        error: validCount < rows.length ? `${rows.length - validCount} ligne(s) avec erreurs` : null,
      };
    }),

  importZip: protectedProcedure
    .input(z.object({
      zipData: z.string(), // Base64 encoded ZIP
      csvContent: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const JSZip = (await import('jszip')).default;
      const { storagePut } = await import('./storage');

      // Décoder le ZIP
      const zipBuffer = Buffer.from(input.zipData, 'base64');
      const zip = await JSZip.loadAsync(zipBuffer);

      // Parser le CSV
      const lines = input.csvContent.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const filenameIndex = headers.indexOf('filename');
      const titleIndex = headers.indexOf('title');
      const descriptionIndex = headers.indexOf('description');
      const categoryIndex = headers.indexOf('category');
      const leafEconomyIdIndex = headers.indexOf('leaf_economy_id');
      const plantIdIndex = headers.indexOf('plant_id');
      const tagsIndex = headers.indexOf('tags');
      const locationIndex = headers.indexOf('location');

      const results: Array<{ filename: string; success: boolean; imageId?: number; error?: string }> = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const filename = values[filenameIndex];

        try {
          // Trouver le fichier dans le ZIP
          let zipFile = zip.file(filename);
          if (!zipFile) {
            // Essayer avec une recherche par regex
            const matches = zip.file(new RegExp(filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'));
            if (Array.isArray(matches) && matches.length > 0) {
              zipFile = matches[0];
            }
          }
          if (!zipFile) {
            results.push({ filename, success: false, error: 'Fichier non trouvé dans le ZIP' });
            continue;
          }

          // Extraire le fichier
          const fileData = await zipFile.async('nodebuffer');
          const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
          const mimeType = ext === 'png' ? 'image/png' : ext === 'gif' ? 'image/gif' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

          // Générer un nom unique
          const uniqueFilename = `gallery/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

          // Upload vers S3
          const { url } = await storagePut(uniqueFilename, fileData, mimeType);

          // Créer l'entrée en base
          const imageData = {
            url,
            fileKey: uniqueFilename,
            fileName: filename,
            mimeType,
            fileSize: fileData.length,
            title: titleIndex >= 0 && values[titleIndex] ? values[titleIndex] : filename,
            description: descriptionIndex >= 0 && values[descriptionIndex] ? values[descriptionIndex] : null,
            category: (categoryIndex >= 0 && values[categoryIndex] ? values[categoryIndex].toLowerCase() : 'echantillon') as 'echantillon' | 'extraction' | 'analyse' | 'terrain' | 'equipement' | 'autre',
            leafEconomyId: leafEconomyIdIndex >= 0 && values[leafEconomyIdIndex] ? parseInt(values[leafEconomyIdIndex]) : null,
            plantId: plantIdIndex >= 0 && values[plantIdIndex] ? parseInt(values[plantIdIndex]) : null,
            tags: tagsIndex >= 0 && values[tagsIndex] ? values[tagsIndex].split(';').map(t => t.trim()).filter(Boolean) : null,
            location: locationIndex >= 0 && values[locationIndex] ? values[locationIndex] : null,
            uploadedBy: ctx.user.id,
          };

          const newImage = await db.createSampleImage(imageData);
          results.push({ filename, success: true, imageId: newImage?.id });
        } catch (error: unknown) {
          results.push({ filename, success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' });
        }
      }

      return {
        totalProcessed: results.length,
        successCount: results.filter(r => r.success).length,
        errorCount: results.filter(r => !r.success).length,
        results,
      };
    }),
});
