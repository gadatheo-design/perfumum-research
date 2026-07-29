import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { sql } from "drizzle-orm";

export const descriptorLinksRouter = router({
  /**
   * Récupérer les plantes associées à un descripteur
   */
  getPlantsByDescriptor: publicProcedure
    .input(z.object({ descriptorId: z.string() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return [];

        const query = sql`
          SELECT 
            dpl.id,
            dpl.plantId,
            dpl.descriptorId,
            dpl.strength,
            dpl.notes,
            dpl.source,
            dpl.createdAt,
            p.name as plantName,
            p.latinName,
            p.family
          FROM descriptor_plant_links dpl
          LEFT JOIN plants p ON dpl.plantId = p.id
          WHERE dpl.descriptorId = ${input.descriptorId}
          ORDER BY dpl.strength DESC, p.name ASC
        `;

        const [rows] = await db.execute(query) as any;
        return rows || [];
      } catch (err) {
        console.error("Error in getPlantsByDescriptor:", err);
        return [];
      }
    }),

  /**
   * Récupérer les molécules associées à un descripteur
   */
  getMoleculesByDescriptor: publicProcedure
    .input(z.object({ descriptorId: z.string() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return [];

        const query = sql`
          SELECT 
            dml.id,
            dml.moleculeId,
            dml.descriptorId,
            dml.strength,
            dml.notes,
            dml.source,
            dml.createdAt,
            m.name as moleculeName,
            m.iupacName,
            m.casNumber
          FROM descriptor_molecule_links dml
          LEFT JOIN molecules m ON dml.moleculeId = m.id
          WHERE dml.descriptorId = ${input.descriptorId}
          ORDER BY dml.strength DESC, m.name ASC
        `;

        const [rows] = await db.execute(query) as any;
        return rows || [];
      } catch (err) {
        console.error("Error in getMoleculesByDescriptor:", err);
        return [];
      }
    }),

  /**
   * Ajouter une association plante-descripteur
   */
  linkPlantToDescriptor: protectedProcedure
    .input(
      z.object({
        descriptorId: z.string(),
        plantId: z.number(),
        strength: z.number().min(1).max(5).default(3),
        notes: z.string().optional(),
        source: z.string().default("manual"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        // Vérifier que l'utilisateur est authentifié
        if (!ctx.user) throw new Error("Unauthorized");

        const query = sql`
          INSERT INTO descriptor_plant_links (descriptorId, plantId, strength, notes, source, createdAt, updatedAt)
          VALUES (${input.descriptorId}, ${input.plantId}, ${input.strength}, ${input.notes || null}, ${input.source}, NOW(), NOW())
          ON DUPLICATE KEY UPDATE
          strength = ${input.strength},
          notes = ${input.notes || null},
          updatedAt = NOW()
        `;

        await db.execute(query);

        // Mettre à jour le cache des occurrences
        await updateDescriptorOccurrences(db, input.descriptorId);

        return { success: true, message: "Plant linked successfully" };
      } catch (err) {
        console.error("Error in linkPlantToDescriptor:", err);
        throw new Error(`Failed to link plant: ${err instanceof Error ? err.message : String(err)}`);
      }
    }),

  /**
   * Ajouter une association molécule-descripteur
   */
  linkMoleculeToDescriptor: protectedProcedure
    .input(
      z.object({
        descriptorId: z.string(),
        moleculeId: z.number(),
        strength: z.number().min(1).max(5).default(3),
        notes: z.string().optional(),
        source: z.string().default("manual"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        // Vérifier que l'utilisateur est authentifié
        if (!ctx.user) throw new Error("Unauthorized");

        const query = sql`
          INSERT INTO descriptor_molecule_links (descriptorId, moleculeId, strength, notes, source, createdAt, updatedAt)
          VALUES (${input.descriptorId}, ${input.moleculeId}, ${input.strength}, ${input.notes || null}, ${input.source}, NOW(), NOW())
          ON DUPLICATE KEY UPDATE
          strength = ${input.strength},
          notes = ${input.notes || null},
          updatedAt = NOW()
        `;

        await db.execute(query);

        // Mettre à jour le cache des occurrences
        await updateDescriptorOccurrences(db, input.descriptorId);

        return { success: true, message: "Molecule linked successfully" };
      } catch (err) {
        console.error("Error in linkMoleculeToDescriptor:", err);
        throw new Error(`Failed to link molecule: ${err instanceof Error ? err.message : String(err)}`);
      }
    }),

  /**
   * Supprimer une association plante-descripteur
   */
  unlinkPlantFromDescriptor: protectedProcedure
    .input(z.object({ linkId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        // Vérifier que l'utilisateur est authentifié
        if (!ctx.user) throw new Error("Unauthorized");

        // Récupérer le descriptorId avant suppression
        const [rows] = await db.execute(
          sql`SELECT descriptorId FROM descriptor_plant_links WHERE id = ${input.linkId}`
        ) as any;

        const descriptorId = (rows as any[])?.[0]?.descriptorId;

        // Supprimer le lien
        await db.execute(sql`DELETE FROM descriptor_plant_links WHERE id = ${input.linkId}`);

        // Mettre à jour le cache
        if (descriptorId) {
          await updateDescriptorOccurrences(db, descriptorId);
        }

        return { success: true, message: "Plant unlinked successfully" };
      } catch (err) {
        console.error("Error in unlinkPlantFromDescriptor:", err);
        throw new Error(`Failed to unlink plant: ${err instanceof Error ? err.message : String(err)}`);
      }
    }),

  /**
   * Supprimer une association molécule-descripteur
   */
  unlinkMoleculeFromDescriptor: protectedProcedure
    .input(z.object({ linkId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        // Vérifier que l'utilisateur est authentifié
        if (!ctx.user) throw new Error("Unauthorized");

        // Récupérer le descriptorId avant suppression
        const [rows] = await db.execute(
          sql`SELECT descriptorId FROM descriptor_molecule_links WHERE id = ${input.linkId}`
        ) as any;

        const descriptorId = (rows as any[])?.[0]?.descriptorId;

        // Supprimer le lien
        await db.execute(sql`DELETE FROM descriptor_molecule_links WHERE id = ${input.linkId}`);

        // Mettre à jour le cache
        if (descriptorId) {
          await updateDescriptorOccurrences(db, descriptorId);
        }

        return { success: true, message: "Molecule unlinked successfully" };
      } catch (err) {
        console.error("Error in unlinkMoleculeFromDescriptor:", err);
        throw new Error(`Failed to unlink molecule: ${err instanceof Error ? err.message : String(err)}`);
      }
    }),

  /**
   * Récupérer les statistiques d'occurrences d'un descripteur
   */
  getDescriptorOccurrences: publicProcedure
    .input(z.object({ descriptorId: z.string() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return { totalPlants: 0, totalMolecules: 0 };

        const query = sql`
          SELECT 
            (SELECT COUNT(*) FROM descriptor_plant_links WHERE descriptorId = ${input.descriptorId}) as totalPlants,
            (SELECT COUNT(*) FROM descriptor_molecule_links WHERE descriptorId = ${input.descriptorId}) as totalMolecules
        `;

        const [rows] = await db.execute(query) as any;
        return (rows as any[])?.[0] || { totalPlants: 0, totalMolecules: 0 };
      } catch (err) {
        console.error("Error in getDescriptorOccurrences:", err);
        return { totalPlants: 0, totalMolecules: 0 };
      }
    }),
});

/**
 * Fonction utilitaire pour mettre à jour le cache des occurrences
 */
async function updateDescriptorOccurrences(db: any, descriptorId: string) {
  try {
    const query = sql`
      INSERT INTO descriptor_occurrences (descriptorId, totalPlants, totalMolecules, lastUpdated)
      SELECT 
        ${descriptorId},
        COALESCE((SELECT COUNT(*) FROM descriptor_plant_links WHERE descriptorId = ${descriptorId}), 0),
        COALESCE((SELECT COUNT(*) FROM descriptor_molecule_links WHERE descriptorId = ${descriptorId}), 0),
        NOW()
      ON DUPLICATE KEY UPDATE
      totalPlants = VALUES(totalPlants),
      totalMolecules = VALUES(totalMolecules),
      lastUpdated = NOW()
    `;

    await db.execute(query);
  } catch (err) {
    console.error("Error updating descriptor occurrences:", err);
  }
}
