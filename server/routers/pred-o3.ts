import { z } from "zod";
import { sql } from "drizzle-orm";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";

export const predO3Router = router({
  /**
   * Importer les descripteurs olfactifs Pred-O3
   */
  importDescriptors: protectedProcedure
    .input(
      z.object({
        descriptors: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            description: z.string().optional(),
            category: z.string().optional(),
            frequency: z.number().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Vérifier que l'utilisateur est admin
      if (ctx.user?.role !== "admin") {
        throw new Error("Accès refusé : seuls les administrateurs peuvent importer des données");
      }

      const db = await getDb();
      if (!db) {
        throw new Error("Impossible de se connecter à la base de données");
      }

      let imported = 0;
      let skipped = 0;
      let errors = 0;
      const results = [];

      // Importer les descripteurs par lot
      for (const descriptor of input.descriptors) {
        try {
          // Utiliser SQL brut pour insérer avec ON DUPLICATE KEY UPDATE
          const query = sql`
            INSERT INTO odor_descriptors (id, name, description, category, frequency, source, created_at, updated_at)
            VALUES (${descriptor.id}, ${descriptor.name}, ${descriptor.description || null}, ${descriptor.category || null}, ${descriptor.frequency || 0}, 'pred-o3', NOW(), NOW())
            ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            description = VALUES(description),
            category = VALUES(category),
            frequency = VALUES(frequency)
          `;
          
          await db.execute(query);
          imported++;
          results.push({ id: descriptor.id, status: "inserted" });
        } catch (err) {
          if (err instanceof Error && err.message.includes("Duplicate")) {
            skipped++;
            results.push({ id: descriptor.id, status: "skipped" });
          } else {
            errors++;
            results.push({ 
              id: descriptor.id, 
              status: "error", 
              error: err instanceof Error ? err.message : String(err) 
            });
          }
        }
      }

      return {
        success: true,
        imported,
        skipped,
        errors,
        total: input.descriptors.length,
        results,
      };
    }),

  /**
   * Récupérer les descripteurs olfactifs importés
   */
  getDescriptors: publicProcedure
    .input(
      z.object({
        limit: z.number().default(100),
        offset: z.number().default(0),
        category: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          console.error("DB connection failed");
          return [];
        }

        // Construire la requête avec paramètres
        let query = "SELECT id, name, description, category, frequency, source, created_at, updated_at FROM odor_descriptors WHERE 1=1";
        const params: any[] = [];

        if (input.category) {
          query += " AND category = ?";
          params.push(input.category);
        }

        query += " ORDER BY frequency DESC LIMIT ? OFFSET ?";
        params.push(input.limit, input.offset);

        // Exécuter la requête
        const [rows] = await db.execute(sql.raw(query)) as any;
        return rows || [];
      } catch (err) {
        console.error("Error in getDescriptors:", err);
        throw new Error(`Erreur lors de la récupération des descripteurs: ${err instanceof Error ? err.message : String(err)}`);
      }
    }),

  /**
   * Récupérer les statistiques d'import
   */
  getStats: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        console.error("DB connection failed");
        return {
          total: 0,
          categories: 0,
          totalFrequency: 0,
          maxFrequency: 0,
          minFrequency: 0,
        };
      }

      const [rows] = await db.execute(sql.raw(`
        SELECT 
          COUNT(*) as total,
          COUNT(DISTINCT category) as categories,
          SUM(frequency) as totalFrequency,
          MAX(frequency) as maxFrequency,
          MIN(frequency) as minFrequency
        FROM odor_descriptors
      `)) as any;

      const stats = (rows as any[])?.[0] || {
        total: 0,
        categories: 0,
        totalFrequency: 0,
        maxFrequency: 0,
        minFrequency: 0,
      };

      return stats;
    } catch (err) {
      console.error("Error in getStats:", err);
      return {
        total: 0,
        categories: 0,
        totalFrequency: 0,
        maxFrequency: 0,
        minFrequency: 0,
      };
    }
  }),
});
