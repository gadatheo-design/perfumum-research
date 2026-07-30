import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import mysql from "mysql2/promise";

/**
 * Routeur pour l'import en lot des associations Pred-O3
 * Écrit dans les tables descriptor_plant_links et descriptor_molecule_links
 */
export const predO3BulkImportRouter = router({
  /**
   * Importer plusieurs associations plante-descripteur
   */
  importPlantAssociations: adminProcedure
    .input(
      z.object({
        associations: z.array(
          z.object({
            descriptorId: z.string(),
            descriptorName: z.string(),
            latinName: z.string(),
            commonName: z.string(),
            force: z.number().min(1).max(5).default(3),
            notes: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      const results = { success: 0, failed: 0, errors: [] as string[] };
      try {
        for (const assoc of input.associations) {
          try {
            const [plantRows] = await conn.execute(
              "SELECT id FROM plants WHERE latin_name = ? LIMIT 1",
              [assoc.latinName]
            ) as [mysql.RowDataPacket[], mysql.FieldPacket[]];
            const plantId = plantRows.length > 0 ? plantRows[0].id : null;
            await conn.execute(
              `INSERT INTO descriptor_plant_links
               (descriptor_id, descriptor_name, plant_id, latin_name, common_name, force_level, notes, source)
               VALUES (?, ?, ?, ?, ?, ?, ?, 'pred-o3')
               ON DUPLICATE KEY UPDATE force_level = VALUES(force_level), notes = VALUES(notes)`,
              [assoc.descriptorId, assoc.descriptorName, plantId, assoc.latinName, assoc.commonName, assoc.force, assoc.notes ?? null]
            );
            results.success++;
          } catch (err) {
            results.failed++;
            results.errors.push(`Erreur pour ${assoc.latinName}: ${err instanceof Error ? err.message : "Erreur inconnue"}`);
          }
        }
        return { ...results, message: `Import terminé: ${results.success} succès, ${results.failed} erreurs` };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Importer plusieurs associations molécule-descripteur
   */
  importMoleculeAssociations: adminProcedure
    .input(
      z.object({
        associations: z.array(
          z.object({
            descriptorId: z.string(),
            descriptorName: z.string(),
            name: z.string(),
            iupacName: z.string(),
            casNumber: z.string().optional(),
            force: z.number().min(1).max(5).default(3),
            notes: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      const results = { success: 0, failed: 0, errors: [] as string[] };
      try {
        for (const assoc of input.associations) {
          try {
            let moleculeId: number | null = null;
            if (assoc.casNumber) {
              const [casRows] = await conn.execute(
                "SELECT id FROM molecules WHERE cas_number = ? LIMIT 1",
                [assoc.casNumber]
              ) as [mysql.RowDataPacket[], mysql.FieldPacket[]];
              if (casRows.length > 0) moleculeId = casRows[0].id;
            }
            if (!moleculeId) {
              const [nameRows] = await conn.execute(
                "SELECT id FROM molecules WHERE name = ? LIMIT 1",
                [assoc.name]
              ) as [mysql.RowDataPacket[], mysql.FieldPacket[]];
              if (nameRows.length > 0) moleculeId = nameRows[0].id;
            }
            await conn.execute(
              `INSERT INTO descriptor_molecule_links
               (descriptor_id, descriptor_name, molecule_id, molecule_name, iupac_name, cas_number, force_level, notes, source)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pred-o3')
               ON DUPLICATE KEY UPDATE force_level = VALUES(force_level), notes = VALUES(notes)`,
              [assoc.descriptorId, assoc.descriptorName, moleculeId, assoc.name, assoc.iupacName, assoc.casNumber ?? null, assoc.force, assoc.notes ?? null]
            );
            results.success++;
          } catch (err) {
            results.failed++;
            results.errors.push(`Erreur pour ${assoc.name}: ${err instanceof Error ? err.message : "Erreur inconnue"}`);
          }
        }
        return { ...results, message: `Import terminé: ${results.success} succès, ${results.failed} erreurs` };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Importer un lot mixte (plantes et molécules)
   */
  importMixedAssociations: adminProcedure
    .input(
      z.object({
        associations: z.array(
          z.object({
            type: z.enum(["plant", "molecule"]),
            descriptorId: z.string(),
            descriptorName: z.string(),
            latinName: z.string().optional(),
            commonName: z.string().optional(),
            name: z.string().optional(),
            iupacName: z.string().optional(),
            casNumber: z.string().optional(),
            force: z.number().min(1).max(5).default(3),
            notes: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      const results = {
        success: 0,
        failed: 0,
        plants: { success: 0, failed: 0 },
        molecules: { success: 0, failed: 0 },
        errors: [] as string[],
      };
      try {
        for (const assoc of input.associations) {
          try {
            if (assoc.type === "plant") {
              let plantId: number | null = null;
              if (assoc.latinName) {
                const [plantRows] = await conn.execute(
                  "SELECT id FROM plants WHERE latin_name = ? LIMIT 1",
                  [assoc.latinName]
                ) as [mysql.RowDataPacket[], mysql.FieldPacket[]];
                if (plantRows.length > 0) plantId = plantRows[0].id;
              }
              await conn.execute(
                `INSERT INTO descriptor_plant_links
                 (descriptor_id, descriptor_name, plant_id, latin_name, common_name, force_level, notes, source)
                 VALUES (?, ?, ?, ?, ?, ?, ?, 'pred-o3')
                 ON DUPLICATE KEY UPDATE force_level = VALUES(force_level), notes = VALUES(notes)`,
                [assoc.descriptorId, assoc.descriptorName, plantId, assoc.latinName ?? null, assoc.commonName ?? null, assoc.force, assoc.notes ?? null]
              );
              results.plants.success++;
              results.success++;
            } else {
              let moleculeId: number | null = null;
              if (assoc.casNumber) {
                const [casRows] = await conn.execute(
                  "SELECT id FROM molecules WHERE cas_number = ? LIMIT 1",
                  [assoc.casNumber]
                ) as [mysql.RowDataPacket[], mysql.FieldPacket[]];
                if (casRows.length > 0) moleculeId = casRows[0].id;
              }
              if (!moleculeId && assoc.name) {
                const [nameRows] = await conn.execute(
                  "SELECT id FROM molecules WHERE name = ? LIMIT 1",
                  [assoc.name]
                ) as [mysql.RowDataPacket[], mysql.FieldPacket[]];
                if (nameRows.length > 0) moleculeId = nameRows[0].id;
              }
              await conn.execute(
                `INSERT INTO descriptor_molecule_links
                 (descriptor_id, descriptor_name, molecule_id, molecule_name, iupac_name, cas_number, force_level, notes, source)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pred-o3')
                 ON DUPLICATE KEY UPDATE force_level = VALUES(force_level), notes = VALUES(notes)`,
                [assoc.descriptorId, assoc.descriptorName, moleculeId, assoc.name ?? null, assoc.iupacName ?? null, assoc.casNumber ?? null, assoc.force, assoc.notes ?? null]
              );
              results.molecules.success++;
              results.success++;
            }
          } catch (err) {
            results.failed++;
            if (assoc.type === "plant") results.plants.failed++;
            else results.molecules.failed++;
            results.errors.push(
              `Erreur pour ${assoc.type} ${assoc.latinName || assoc.name}: ${err instanceof Error ? err.message : "Erreur inconnue"}`
            );
          }
        }
        return {
          ...results,
          message: `Import terminé: ${results.success} succès, ${results.failed} erreurs (Plantes: ${results.plants.success}/${results.plants.success + results.plants.failed}, Molécules: ${results.molecules.success}/${results.molecules.success + results.molecules.failed})`,
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err instanceof Error ? err.message : "Erreur lors de l'import",
        });
      } finally {
        await conn.end();
      }
    }),

  /**
   * Valider les associations avant import (dry-run avec vérification DB réelle)
   */
  validateAssociations: adminProcedure
    .input(
      z.object({
        associations: z.array(
          z.object({
            type: z.enum(["plant", "molecule"]),
            descriptorId: z.string(),
            latinName: z.string().optional(),
            commonName: z.string().optional(),
            name: z.string().optional(),
            iupacName: z.string().optional(),
            casNumber: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      const validation = {
        total: input.associations.length,
        valid: 0,
        invalid: 0,
        plantFound: 0,
        moleculeFound: 0,
        plantNotFound: 0,
        moleculeNotFound: 0,
        issues: [] as string[],
      };
      try {
        for (const assoc of input.associations) {
          let isValid = true;
          if (assoc.type === "plant") {
            if (!assoc.latinName) {
              validation.issues.push(`Plante sans nom latin: ${assoc.commonName || "?"}`);
              isValid = false;
            } else {
              const [rows] = await conn.execute(
                "SELECT id FROM plants WHERE latin_name = ? LIMIT 1",
                [assoc.latinName]
              ) as [mysql.RowDataPacket[], mysql.FieldPacket[]];
              if (rows.length > 0) {
                validation.plantFound++;
              } else {
                validation.plantNotFound++;
                validation.issues.push(`Plante non trouvée en DB: ${assoc.latinName} (sera liée sans ID)`);
              }
            }
          } else {
            if (!assoc.name) {
              validation.issues.push(`Molécule sans nom: ${assoc.casNumber || "?"}`);
              isValid = false;
            } else {
              let found = false;
              if (assoc.casNumber) {
                const [casRows] = await conn.execute(
                  "SELECT id FROM molecules WHERE cas_number = ? LIMIT 1",
                  [assoc.casNumber]
                ) as [mysql.RowDataPacket[], mysql.FieldPacket[]];
                if (casRows.length > 0) found = true;
              }
              if (!found) {
                const [nameRows] = await conn.execute(
                  "SELECT id FROM molecules WHERE name = ? LIMIT 1",
                  [assoc.name]
                ) as [mysql.RowDataPacket[], mysql.FieldPacket[]];
                if (nameRows.length > 0) found = true;
              }
              if (found) {
                validation.moleculeFound++;
              } else {
                validation.moleculeNotFound++;
                validation.issues.push(`Molécule non trouvée en DB: ${assoc.name} (sera liée sans ID)`);
              }
            }
          }
          if (isValid) validation.valid++;
          else validation.invalid++;
        }
        return validation;
      } finally {
        await conn.end();
      }
    }),

  /**
   * Récupérer les statistiques des associations importées
   */
  getImportStats: adminProcedure.query(async () => {
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);
    try {
      const [plantLinks] = await conn.execute(
        "SELECT COUNT(*) as cnt, COUNT(plant_id) as linked FROM descriptor_plant_links WHERE source = 'pred-o3'"
      ) as [mysql.RowDataPacket[], mysql.FieldPacket[]];
      const [moleculeLinks] = await conn.execute(
        "SELECT COUNT(*) as cnt, COUNT(molecule_id) as linked FROM descriptor_molecule_links WHERE source = 'pred-o3'"
      ) as [mysql.RowDataPacket[], mysql.FieldPacket[]];
      const [descriptors] = await conn.execute(
        "SELECT COUNT(DISTINCT descriptor_id) as cnt FROM descriptor_plant_links WHERE source = 'pred-o3'"
      ) as [mysql.RowDataPacket[], mysql.FieldPacket[]];
      return {
        plantLinks: Number(plantLinks[0].cnt),
        plantLinksWithId: Number(plantLinks[0].linked),
        moleculeLinks: Number(moleculeLinks[0].cnt),
        moleculeLinksWithId: Number(moleculeLinks[0].linked),
        descriptorsCovered: Number(descriptors[0].cnt),
      };
    } finally {
      await conn.end();
    }
  }),
});
