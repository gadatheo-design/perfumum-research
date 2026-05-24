import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import * as db from "../db";
import { molecules } from "../../drizzle/schema";

export const importRouter = router({
    // Validate and preview CSV data before import
    validateCSV: publicProcedure
      .input(z.object({
        entityType: z.enum(["molecules", "recettes", "accords", "familles", "matieres"]),
        csvData: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { csvToObjects, parseValue } = await import('./csv-utils');
        
        try {
          let parsedData: Record<string, unknown>[] = [];
          let errors: string[] = [];
          
          switch (input.entityType) {
            case "molecules":
              parsedData = csvToObjects(input.csvData, (row) => ({
                nom: row.nom || null,
                formule: row.formule || null,
                masseMoleculaire: parseValue(row.masseMoleculaire, "number"),
                pointEbullition: parseValue(row.pointEbullition, "number"),
                familleChimique: row.familleChimique || null,
                description: row.description || null,
                noteOlfactive: row.noteOlfactive || null,
                intensite: parseValue(row.intensite, "number"),
                tenacite: parseValue(row.tenacite, "number"),
                diffusion: parseValue(row.diffusion, "number"),
                gamme: row.gamme || null,
              }));
              
              // Validate required fields
              parsedData.forEach((item, index) => {
                if (!item.nom) errors.push(`Ligne ${index + 2}: nom requis`);
              });
              break;
              
            case "recettes":
              parsedData = csvToObjects(input.csvData, (row) => ({
                nom: row.nom || null,
                description: row.description || null,
                gamme: row.gamme || null,
                notes: row.notes || null,
                dateCreation: parseValue(row.dateCreation, "date"),
              }));
              
              parsedData.forEach((item, index) => {
                if (!item.nom) errors.push(`Ligne ${index + 2}: nom requis`);
              });
              break;
              
            case "accords":
              parsedData = csvToObjects(input.csvData, (row) => ({
                nom: row.nom || null,
                description: row.description || null,
                familleId: parseValue(row.familleId, "number"),
              }));
              
              parsedData.forEach((item, index) => {
                if (!item.nom) errors.push(`Ligne ${index + 2}: nom requis`);
              });
              break;
              
            case "familles":
              parsedData = csvToObjects(input.csvData, (row) => ({
                nom: row.nom || null,
                description: row.description || null,
              }));
              
              parsedData.forEach((item, index) => {
                if (!item.nom) errors.push(`Ligne ${index + 2}: nom requis`);
              });
              break;
              
            case "matieres":
              parsedData = csvToObjects(input.csvData, (row) => ({
                nom: row.nom || null,
                type: row.type || null,
                origine: row.origine || null,
                fournisseur: row.fournisseur || null,
                quantite: parseValue(row.quantite, "number"),
                unite: row.unite || null,
                prixUnitaire: parseValue(row.prixUnitaire, "number"),
                dateAchat: parseValue(row.dateAchat, "date"),
                notes: row.notes || null,
              }));
              
              parsedData.forEach((item, index) => {
                if (!item.nom) errors.push(`Ligne ${index + 2}: nom requis`);
              });
              break;
          }
          
          return {
            success: errors.length === 0,
            data: parsedData,
            errors,
            rowCount: parsedData.length,
          };
        } catch (error: unknown) {
          return {
            success: false,
            data: [],
            errors: [`Erreur de parsing CSV: ${error instanceof Error ? error.message : 'Erreur inconnue'}`],
            rowCount: 0,
          };
        }
      }),

    // Import molecules from CSV
    molecules: publicProcedure
      .input(z.object({
        csvData: z.string(),
        mode: z.enum(["create", "update", "upsert"]).default("create"),
      }))
      .mutation(async ({ input }) => {
        const { csvToObjects, parseValue } = await import('./csv-utils');
        
        const parsedData = csvToObjects(input.csvData, (row) => ({
          nom: row.nom || null,
          formule: row.formule || null,
          masseMoleculaire: parseValue(row.masseMoleculaire, "number"),
          pointEbullition: parseValue(row.pointEbullition, "number"),
          familleChimique: row.familleChimique || null,
          description: row.description || null,
          noteOlfactive: row.noteOlfactive || null,
          intensite: parseValue(row.intensite, "number"),
          tenacite: parseValue(row.tenacite, "number"),
          diffusion: parseValue(row.diffusion, "number"),
          gamme: row.gamme || null,
        }));
        
        let created = 0;
        let updated = 0;
        let errors: string[] = [];
        
        for (const item of parsedData) {
          try {
            if (!item.nom) {
              errors.push(`Molécule sans nom ignorée`);
              continue;
            }
            
            if (input.mode === "create") {
              await db.createMolecule(item);
              created++;
            } else if (input.mode === "update" || input.mode === "upsert") {
              // Check if molecule exists by name
              const existing = await db.getMoleculeByName(item.nom);
              
              if (existing) {
                await db.updateMolecule(existing.id, item);
                updated++;
              } else if (input.mode === "upsert") {
                await db.createMolecule(item);
                created++;
              } else {
                errors.push(`Molécule "${item.nom}" introuvable pour mise à jour`);
              }
            }
          } catch (error: unknown) {
            errors.push(`Erreur pour "${item.nom}": ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
          }
        }
        
        return {
          success: errors.length === 0,
          created,
          updated,
          errors,
        };
      }),

    // Import recettes from CSV
    recettes: publicProcedure
      .input(z.object({
        csvData: z.string(),
        mode: z.enum(["create", "update", "upsert"]).default("create"),
      }))
      .mutation(async ({ input }) => {
        const { csvToObjects, parseValue } = await import('./csv-utils');
        
        const parsedData = csvToObjects(input.csvData, (row) => ({
          nom: row.nom || null,
          description: row.description || null,
          gamme: row.gamme || null,
          notes: row.notes || null,
          dateCreation: parseValue(row.dateCreation, "date"),
        }));
        
        let created = 0;
        let updated = 0;
        let errors: string[] = [];
        
        for (const item of parsedData) {
          try {
            if (!item.nom) {
              errors.push(`Recette sans nom ignorée`);
              continue;
            }
            
            // Mapper les données CSV vers le format attendu par createRecette
            const recetteData = {
              name: item.nom,
              category: "tabac" as const,
              description: item.description || undefined,
              notes: item.notes || undefined,
            };
            
            if (input.mode === "create") {
              await db.createRecette(recetteData);
              created++;
            } else if (input.mode === "update" || input.mode === "upsert") {
              const existing = await db.getRecetteByName(item.nom);
              
              if (existing) {
                await db.updateRecette(existing.id, {
                  name: item.nom,
                  description: item.description,
                  notes: item.notes,
                });
                updated++;
              } else if (input.mode === "upsert") {
                await db.createRecette(recetteData);
                created++;
              } else {
                errors.push(`Recette "${item.nom}" introuvable pour mise à jour`);
              }
            }
          } catch (error: unknown) {
            errors.push(`Erreur pour "${item.nom}": ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
          }
        }
        
        return {
          success: errors.length === 0,
          created,
          updated,
          errors,
        };
      }),

    // Import accords from CSV
    accords: publicProcedure
      .input(z.object({
        csvData: z.string(),
        mode: z.enum(["create", "update", "upsert"]).default("create"),
      }))
      .mutation(async ({ input }) => {
        const { csvToObjects, parseValue } = await import('./csv-utils');
        
        const parsedData = csvToObjects(input.csvData, (row) => ({
          nom: row.nom || null,
          description: row.description || null,
          familleId: parseValue(row.familleId, "number"),
        }));
        
        let created = 0;
        let updated = 0;
        let errors: string[] = [];
        
        for (const item of parsedData) {
          try {
            if (!item.nom) {
              errors.push(`Accord sans nom ignoré`);
              continue;
            }
            
            if (input.mode === "create") {
              await db.createAccord(item);
              created++;
            } else if (input.mode === "update" || input.mode === "upsert") {
              const existing = await db.getAccordByName(item.nom);
              
              if (existing) {
                await db.updateAccord(existing.id, item);
                updated++;
              } else if (input.mode === "upsert") {
                await db.createAccord(item);
                created++;
              } else {
                errors.push(`Accord "${item.nom}" introuvable pour mise à jour`);
              }
            }
          } catch (error: unknown) {
            errors.push(`Erreur pour "${item.nom}": ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
          }
        }
        
        return {
          success: errors.length === 0,
          created,
          updated,
          errors,
        };
      }),

    // Import familles from CSV
    familles: publicProcedure
      .input(z.object({
        csvData: z.string(),
        mode: z.enum(["create", "update", "upsert"]).default("create"),
      }))
      .mutation(async ({ input }) => {
        const { csvToObjects } = await import('./csv-utils');
        
        const parsedData = csvToObjects(input.csvData, (row) => ({
          nom: row.nom || null,
          description: row.description || null,
        }));
        
        let created = 0;
        let updated = 0;
        let errors: string[] = [];
        
        for (const item of parsedData) {
          try {
            if (!item.nom) {
              errors.push(`Famille sans nom ignorée`);
              continue;
            }
            
            if (input.mode === "create") {
              await db.createFamily(item);
              created++;
            } else if (input.mode === "update" || input.mode === "upsert") {
              const existing = await db.getFamilyByName(item.nom);
              
              if (existing) {
                await db.updateFamily(existing.id, item);
                updated++;
              } else if (input.mode === "upsert") {
                await db.createFamily(item);
                created++;
              } else {
                errors.push(`Famille "${item.nom}" introuvable pour mise à jour`);
              }
            }
          } catch (error: unknown) {
            errors.push(`Erreur pour "${item.nom}": ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
          }
        }
        
        return {
          success: errors.length === 0,
          created,
          updated,
          errors,
        };
      }),

    // Import matieres from CSV
    matieres: publicProcedure
      .input(z.object({
        csvData: z.string(),
        mode: z.enum(["create", "update", "upsert"]).default("create"),
      }))
      .mutation(async ({ input }) => {
        const { csvToObjects, parseValue } = await import('./csv-utils');
        
        const parsedData = csvToObjects(input.csvData, (row) => ({
          nom: row.nom || null,
          type: row.type || null,
          origine: row.origine || null,
          fournisseur: row.fournisseur || null,
          quantite: parseValue(row.quantite, "number"),
          unite: row.unite || null,
          prixUnitaire: parseValue(row.prixUnitaire, "number"),
          dateAchat: parseValue(row.dateAchat, "date"),
          notes: row.notes || null,
        }));
        
        let created = 0;
        let updated = 0;
        let errors: string[] = [];
        
        for (const item of parsedData) {
          try {
            if (!item.nom) {
              errors.push(`Matière sans nom ignorée`);
              continue;
            }
            
            // Mapper les données CSV vers le format attendu par createMatiere
            const matiereData = {
              name: item.nom,
              type: (item.type as "huile_essentielle" | "absolu" | "resinoid" | "concrete" | "co2" | "teinture" | "poudre" | "alcoolat" | "autre") || "autre",
              origin: item.origine || undefined,
              supplier: item.fournisseur || undefined,
              stock: item.quantite || undefined,
              technicalNotes: item.notes || undefined,
            };
            
            if (input.mode === "create") {
              await db.createMatiere(matiereData);
              created++;
            } else if (input.mode === "update" || input.mode === "upsert") {
              const existing = await db.getMatiereByName(item.nom);
              
              if (existing) {
                await db.updateMatiere(existing.id, item);
                updated++;
              } else if (input.mode === "upsert") {
                await db.createMatiere(matiereData);
                created++;
              } else {
                errors.push(`Matière "${item.nom}" introuvable pour mise à jour`);
              }
            }
          } catch (error: unknown) {
            errors.push(`Erreur pour "${item.nom}": ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
          }
        }
        
        return {
          success: errors.length === 0,
          created,
          updated,
          errors,
        };
      }),
});
