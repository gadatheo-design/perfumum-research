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
            dpl.plant_id AS plantId,
            dpl.descriptor_id AS descriptorId,
            dpl.force_level AS strength,
            dpl.notes,
            dpl.source,
            dpl.created_at AS createdAt,
            COALESCE(p.name, dpl.common_name, dpl.latin_name) AS plantName,
            COALESCE(p.latin_name, dpl.latin_name) AS latinName,
            p.family
          FROM descriptor_plant_links dpl
          LEFT JOIN plants p ON dpl.plant_id = p.id
          WHERE dpl.descriptor_id = ${input.descriptorId}
          ORDER BY dpl.force_level DESC, plantName ASC
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
            dml.molecule_id AS moleculeId,
            dml.descriptor_id AS descriptorId,
            dml.force_level AS strength,
            dml.notes,
            dml.source,
            dml.created_at AS createdAt,
            COALESCE(m.name, dml.molecule_name) AS moleculeName,
            COALESCE(m.iupac_name, dml.iupac_name) AS iupacName,
            COALESCE(m.cas_number, dml.cas_number) AS casNumber
          FROM descriptor_molecule_links dml
          LEFT JOIN molecules m ON dml.molecule_id = m.id
          WHERE dml.descriptor_id = ${input.descriptorId}
          ORDER BY dml.force_level DESC, moleculeName ASC
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

        const [descriptorRows] = await db.execute(sql`
          SELECT name FROM odor_descriptors WHERE descriptor_id = ${input.descriptorId} LIMIT 1
        `) as any;
        const [plantRows] = await db.execute(sql`
          SELECT id, latin_name, name FROM plants WHERE id = ${input.plantId} LIMIT 1
        `) as any;
        const descriptor = descriptorRows?.[0];
        const plant = plantRows?.[0];

        if (!descriptor) throw new Error("Descriptor not found");
        if (!plant) throw new Error("Plant not found");

        const query = sql`
          INSERT INTO descriptor_plant_links
            (descriptor_id, descriptor_name, plant_id, latin_name, common_name, force_level, notes, source, created_at, updated_at)
          VALUES
            (${input.descriptorId}, ${descriptor.name}, ${plant.id}, ${plant.latin_name}, ${plant.name}, ${input.strength}, ${input.notes || null}, ${input.source}, NOW(), NOW())
          ON DUPLICATE KEY UPDATE
            descriptor_name = VALUES(descriptor_name),
            latin_name = VALUES(latin_name),
            common_name = VALUES(common_name),
            force_level = VALUES(force_level),
            notes = VALUES(notes),
            source = VALUES(source),
            updated_at = NOW()
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

        const [descriptorRows] = await db.execute(sql`
          SELECT name FROM odor_descriptors WHERE descriptor_id = ${input.descriptorId} LIMIT 1
        `) as any;
        const [moleculeRows] = await db.execute(sql`
          SELECT id, name, iupac_name, cas_number FROM molecules WHERE id = ${input.moleculeId} LIMIT 1
        `) as any;
        const descriptor = descriptorRows?.[0];
        const molecule = moleculeRows?.[0];

        if (!descriptor) throw new Error("Descriptor not found");
        if (!molecule) throw new Error("Molecule not found");

        const query = sql`
          INSERT INTO descriptor_molecule_links
            (descriptor_id, descriptor_name, molecule_id, molecule_name, iupac_name, cas_number, force_level, notes, source, created_at, updated_at)
          VALUES
            (${input.descriptorId}, ${descriptor.name}, ${molecule.id}, ${molecule.name}, ${molecule.iupac_name}, ${molecule.cas_number}, ${input.strength}, ${input.notes || null}, ${input.source}, NOW(), NOW())
          ON DUPLICATE KEY UPDATE
            descriptor_name = VALUES(descriptor_name),
            molecule_name = VALUES(molecule_name),
            iupac_name = VALUES(iupac_name),
            cas_number = VALUES(cas_number),
            force_level = VALUES(force_level),
            notes = VALUES(notes),
            source = VALUES(source),
            updated_at = NOW()
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
            (SELECT COUNT(*) FROM descriptor_plant_links WHERE descriptor_id = ${input.descriptorId}) as totalPlants,
            (SELECT COUNT(*) FROM descriptor_molecule_links WHERE descriptor_id = ${input.descriptorId}) as totalMolecules
        `;

        const [rows] = await db.execute(query) as any;
        return (rows as any[])?.[0] || { totalPlants: 0, totalMolecules: 0 };
      } catch (err) {
        console.error("Error in getDescriptorOccurrences:", err);
        return { totalPlants: 0, totalMolecules: 0 };
      }
    }),

  /**
   * Signale les anciennes associations dont la cible a été supprimée.
   * La procédure est volontairement en lecture seule : la résolution ou la
   * suppression d’un lien reste une décision éditoriale en administration.
   */
  getIntegrityReport: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const [orphanPlantLinks] = await db.execute(sql`
      SELECT
        dpl.id,
        dpl.descriptor_id AS descriptorId,
        dpl.descriptor_name AS descriptorName,
        dpl.plant_id AS plantId,
        dpl.latin_name AS latinName,
        dpl.common_name AS commonName,
        dpl.source,
        dpl.created_at AS createdAt
      FROM descriptor_plant_links dpl
      LEFT JOIN plants p ON p.id = dpl.plant_id
      WHERE dpl.plant_id IS NOT NULL AND p.id IS NULL
      ORDER BY dpl.created_at DESC, dpl.id DESC
    `) as any;

    const [orphanMoleculeLinks] = await db.execute(sql`
      SELECT
        dml.id,
        dml.descriptor_id AS descriptorId,
        dml.descriptor_name AS descriptorName,
        dml.molecule_id AS moleculeId,
        dml.molecule_name AS moleculeName,
        dml.cas_number AS casNumber,
        dml.source,
        dml.created_at AS createdAt
      FROM descriptor_molecule_links dml
      LEFT JOIN molecules m ON m.id = dml.molecule_id
      WHERE dml.molecule_id IS NOT NULL AND m.id IS NULL
      ORDER BY dml.created_at DESC, dml.id DESC
    `) as any;

    return {
      orphanPlantLinks: orphanPlantLinks ?? [],
      orphanMoleculeLinks: orphanMoleculeLinks ?? [],
    };
  }),
});

/**
 * Fonction utilitaire pour mettre à jour le cache des occurrences
 */
async function updateDescriptorOccurrences(db: any, descriptorId: string) {
  try {
    const query = sql`
      INSERT INTO descriptor_occurrences (descriptor_id, total_plants, total_molecules, last_updated)
      SELECT 
        ${descriptorId},
        COALESCE((SELECT COUNT(*) FROM descriptor_plant_links WHERE descriptor_id = ${descriptorId}), 0),
        COALESCE((SELECT COUNT(*) FROM descriptor_molecule_links WHERE descriptor_id = ${descriptorId}), 0),
        NOW()
      ON DUPLICATE KEY UPDATE
      total_plants = VALUES(total_plants),
      total_molecules = VALUES(total_molecules),
      last_updated = NOW()
    `;

    await db.execute(query);
  } catch (err) {
    console.error("Error updating descriptor occurrences:", err);
  }
}
