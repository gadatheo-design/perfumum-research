import { z } from "zod";
import { adminProcedure, publicProcedure, protectedProcedure, router } from "../_core/trpc";
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
          sql`SELECT descriptor_id AS descriptorId FROM descriptor_plant_links WHERE id = ${input.linkId}`
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
          sql`SELECT descriptor_id AS descriptorId FROM descriptor_molecule_links WHERE id = ${input.linkId}`
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

  /** Propose des cibles existantes sans jamais appliquer de correction automatique. */
  getReassociationSuggestions: adminProcedure
    .input(z.object({ kind: z.enum(["plant", "molecule"]), linkId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      if (input.kind === "plant") {
        const [orphanRows] = await db.execute(sql`
          SELECT dpl.id, dpl.plant_id AS archivedTargetId, dpl.latin_name AS latinName, dpl.common_name AS commonName
          FROM descriptor_plant_links dpl
          LEFT JOIN plants previous_plant ON previous_plant.id = dpl.plant_id
          WHERE dpl.id = ${input.linkId} AND previous_plant.id IS NULL
          LIMIT 1
        `) as any;
        const orphan = orphanRows?.[0];
        if (!orphan) throw new Error("Orphan plant link not found");

        const searchTerm = String(orphan.latinName || orphan.commonName || "").trim();
        if (searchTerm.length < 2) return { archived: orphan, suggestions: [] };
        const [candidateRows] = await db.execute(sql`
          SELECT id, name, latin_name AS latinName, family, wikidata_qid AS wikidataQid
          FROM plants
          WHERE name LIKE ${`%${searchTerm}%`} OR latin_name LIKE ${`%${searchTerm}%`}
          ORDER BY name ASC
          LIMIT 20
        `) as any;
        return {
          archived: orphan,
          suggestions: rankPlantSuggestions(candidateRows ?? [], orphan),
        };
      }

      const [orphanRows] = await db.execute(sql`
        SELECT dml.id, dml.molecule_id AS archivedTargetId, dml.molecule_name AS moleculeName,
               dml.iupac_name AS iupacName, dml.cas_number AS casNumber
        FROM descriptor_molecule_links dml
        LEFT JOIN molecules previous_molecule ON previous_molecule.id = dml.molecule_id
        WHERE dml.id = ${input.linkId} AND previous_molecule.id IS NULL
        LIMIT 1
      `) as any;
      const orphan = orphanRows?.[0];
      if (!orphan) throw new Error("Orphan molecule link not found");

      const searchTerm = String(orphan.moleculeName || orphan.iupacName || orphan.casNumber || "").trim();
      if (searchTerm.length < 2) return { archived: orphan, suggestions: [] };
      const [candidateRows] = await db.execute(sql`
        SELECT id, name, iupac_name AS iupacName, cas_number AS casNumber, formula
        FROM molecules
        WHERE cas_number = ${orphan.casNumber || "__no_cas_match__"}
           OR name LIKE ${`%${searchTerm}%`}
           OR iupac_name LIKE ${`%${searchTerm}%`}
        ORDER BY name ASC
        LIMIT 20
      `) as any;
      return {
        archived: orphan,
        suggestions: rankMoleculeSuggestions(candidateRows ?? [], orphan),
      };
    }),

  /** Historique des décisions administratives, en lecture seule. */
  getReassignmentAudit: adminProcedure
    .input(z.object({ limit: z.number().int().min(1).max(100).default(30) }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      const limit = input?.limit ?? 30;
      const [rows] = await db.execute(sql`
        SELECT id, link_type AS linkType, link_id AS linkId, descriptor_id AS descriptorId,
               archived_target_id AS archivedTargetId, archived_target_name AS archivedTargetName,
               target_entity_id AS targetEntityId, target_entity_name AS targetEntityName,
               suggestion_reason AS suggestionReason, confidence, actor_user_id AS actorUserId,
               actor_name AS actorName, created_at AS createdAt
        FROM descriptor_link_audit_log
        ORDER BY created_at DESC, id DESC
        LIMIT ${limit}
      `) as any;
      return rows ?? [];
    }),

  /**
   * Réassocie une association plante-descripteur devenue orpheline à une plante existante.
   * Les données éditoriales (descripteur, force, notes et source) restent inchangées.
   */
  reassignOrphanPlantLink: adminProcedure
    .input(z.object({
      linkId: z.number().int().positive(),
      targetPlantId: z.number().int().positive(),
      suggestionReason: z.string().max(255).optional(),
      confidence: z.enum(["high", "medium", "low"]).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const [orphanRows] = await db.execute(sql`
        SELECT dpl.id,
               dpl.descriptor_id AS descriptorId,
               dpl.plant_id AS archivedTargetId,
               COALESCE(dpl.common_name, dpl.latin_name) AS archivedTargetName
        FROM descriptor_plant_links dpl
        LEFT JOIN plants previous_plant ON previous_plant.id = dpl.plant_id
        WHERE dpl.id = ${input.linkId} AND previous_plant.id IS NULL
        LIMIT 1
      `) as any;
      const orphanLink = orphanRows?.[0];
      if (!orphanLink) throw new Error("Orphan plant link not found");

      const [plantRows] = await db.execute(sql`
        SELECT id, latin_name AS latinName, name
        FROM plants
        WHERE id = ${input.targetPlantId}
        LIMIT 1
      `) as any;
      const targetPlant = plantRows?.[0];
      if (!targetPlant) throw new Error("Target plant not found");

      await db.execute(sql`
        UPDATE descriptor_plant_links
        SET plant_id = ${targetPlant.id},
            latin_name = ${targetPlant.latinName},
            common_name = ${targetPlant.name},
            updated_at = NOW()
        WHERE id = ${input.linkId}
      `);
      await db.execute(sql`
        INSERT INTO descriptor_link_audit_log
          (link_type, link_id, descriptor_id, archived_target_id, archived_target_name,
           target_entity_id, target_entity_name, suggestion_reason, confidence, actor_user_id, actor_name)
        VALUES
          ("plant", ${input.linkId}, ${orphanLink.descriptorId}, ${orphanLink.archivedTargetId}, ${orphanLink.archivedTargetName},
           ${targetPlant.id}, ${targetPlant.name}, ${input.suggestionReason || null}, ${input.confidence || null}, ${ctx.user.id}, ${ctx.user.name || null})
      `);
      await updateDescriptorOccurrences(db, orphanLink.descriptorId);

      return {
        success: true,
        descriptorId: orphanLink.descriptorId,
        target: { id: targetPlant.id, name: targetPlant.name, latinName: targetPlant.latinName },
      };
    }),

  /**
   * Réassocie une association molécule-descripteur devenue orpheline à une molécule existante.
   * Les données éditoriales (descripteur, force, notes et source) restent inchangées.
   */
  reassignOrphanMoleculeLink: adminProcedure
    .input(z.object({
      linkId: z.number().int().positive(),
      targetMoleculeId: z.number().int().positive(),
      suggestionReason: z.string().max(255).optional(),
      confidence: z.enum(["high", "medium", "low"]).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const [orphanRows] = await db.execute(sql`
        SELECT dml.id,
               dml.descriptor_id AS descriptorId,
               dml.molecule_id AS archivedTargetId,
               COALESCE(dml.molecule_name, dml.cas_number) AS archivedTargetName
        FROM descriptor_molecule_links dml
        LEFT JOIN molecules previous_molecule ON previous_molecule.id = dml.molecule_id
        WHERE dml.id = ${input.linkId} AND previous_molecule.id IS NULL
        LIMIT 1
      `) as any;
      const orphanLink = orphanRows?.[0];
      if (!orphanLink) throw new Error("Orphan molecule link not found");

      const [moleculeRows] = await db.execute(sql`
        SELECT id, name, iupac_name AS iupacName, cas_number AS casNumber
        FROM molecules
        WHERE id = ${input.targetMoleculeId}
        LIMIT 1
      `) as any;
      const targetMolecule = moleculeRows?.[0];
      if (!targetMolecule) throw new Error("Target molecule not found");

      await db.execute(sql`
        UPDATE descriptor_molecule_links
        SET molecule_id = ${targetMolecule.id},
            molecule_name = ${targetMolecule.name},
            iupac_name = ${targetMolecule.iupacName},
            cas_number = ${targetMolecule.casNumber},
            updated_at = NOW()
        WHERE id = ${input.linkId}
      `);
      await db.execute(sql`
        INSERT INTO descriptor_link_audit_log
          (link_type, link_id, descriptor_id, archived_target_id, archived_target_name,
           target_entity_id, target_entity_name, suggestion_reason, confidence, actor_user_id, actor_name)
        VALUES
          ("molecule", ${input.linkId}, ${orphanLink.descriptorId}, ${orphanLink.archivedTargetId}, ${orphanLink.archivedTargetName},
           ${targetMolecule.id}, ${targetMolecule.name}, ${input.suggestionReason || null}, ${input.confidence || null}, ${ctx.user.id}, ${ctx.user.name || null})
      `);
      await updateDescriptorOccurrences(db, orphanLink.descriptorId);

      return {
        success: true,
        descriptorId: orphanLink.descriptorId,
        target: { id: targetMolecule.id, name: targetMolecule.name, casNumber: targetMolecule.casNumber },
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

function normalizeSuggestionText(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function confidenceForScore(score: number): "high" | "medium" | "low" {
  if (score >= 90) return "high";
  if (score >= 65) return "medium";
  return "low";
}

function rankPlantSuggestions(candidates: any[], archived: any) {
  const archivedLatin = normalizeSuggestionText(archived.latinName);
  const archivedCommon = normalizeSuggestionText(archived.commonName);

  return candidates
    .map((candidate) => {
      const latinName = normalizeSuggestionText(candidate.latinName);
      const name = normalizeSuggestionText(candidate.name);
      let score = 45;
      let reason = "Correspondance textuelle partielle";
      if (archivedLatin && latinName === archivedLatin) {
        score = 100;
        reason = "Nom latin strictement identique";
      } else if (archivedCommon && name === archivedCommon) {
        score = 95;
        reason = "Nom commun strictement identique";
      } else if (archivedLatin && (latinName.includes(archivedLatin) || archivedLatin.includes(latinName))) {
        score = 75;
        reason = "Nom latin très proche";
      } else if (archivedCommon && (name.includes(archivedCommon) || archivedCommon.includes(name))) {
        score = 65;
        reason = "Nom commun proche";
      }
      return { ...candidate, score, confidence: confidenceForScore(score), reason };
    })
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

function rankMoleculeSuggestions(candidates: any[], archived: any) {
  const archivedCas = String(archived.casNumber ?? "").trim();
  const archivedName = normalizeSuggestionText(archived.moleculeName);
  const archivedIupac = normalizeSuggestionText(archived.iupacName);

  return candidates
    .map((candidate) => {
      const candidateCas = String(candidate.casNumber ?? "").trim();
      const name = normalizeSuggestionText(candidate.name);
      const iupacName = normalizeSuggestionText(candidate.iupacName);
      let score = 45;
      let reason = "Correspondance textuelle partielle";
      if (archivedCas && candidateCas === archivedCas) {
        score = 100;
        reason = "Numéro CAS strictement identique";
      } else if (archivedName && name === archivedName) {
        score = 95;
        reason = "Nom de molécule strictement identique";
      } else if (archivedIupac && iupacName === archivedIupac) {
        score = 90;
        reason = "Nom IUPAC strictement identique";
      } else if (archivedName && (name.includes(archivedName) || archivedName.includes(name))) {
        score = 70;
        reason = "Nom de molécule proche";
      } else if (archivedIupac && (iupacName.includes(archivedIupac) || archivedIupac.includes(iupacName))) {
        score = 65;
        reason = "Nom IUPAC proche";
      }
      return { ...candidate, score, confidence: confidenceForScore(score), reason };
    })
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}
