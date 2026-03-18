/**
 * Router tRPC pour le nettoyage et l'enrichissement des données
 */
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { 
  analyzeDuplicates, 
  mergeDuplicates, 
  enrichWithFormulas,
  DUPLICATES_TO_MERGE,
  MOLECULE_FORMULAS
} from "../data-cleanup";
import {
  analyzeLinkCoverage,
  getMoleculesWithoutRecettes,
  getMoleculesWithoutPlants,
  getPlantsWithoutMolecules
} from "../link-analysis";
import { getDb } from "../db";
import { molecules, rawMaterials } from "../../drizzle/schema";
import { sql, eq } from "drizzle-orm";

// Fonction utilitaire partagée : supprime toutes les FK d'une molécule avant DELETE
async function deleteAllMoleculeFKs(db: Awaited<ReturnType<typeof getDb>>, molId: number) {
  const fkDeleteSqls = [
    sql`DELETE FROM plant_molecules WHERE molecule_id = ${molId}`,
    sql`DELETE FROM molecule_plant_sources WHERE molecule_id = ${molId}`,
    sql`DELETE FROM molecule_synergies WHERE molecule1_id = ${molId} OR molecule2_id = ${molId}`,
    sql`DELETE FROM terpene_synergies WHERE terpene1_id = ${molId} OR terpene2_id = ${molId}`,
    sql`DELETE FROM molecular_transformations WHERE source_molecule_id = ${molId} OR product_molecule_id = ${molId}`,
    sql`DELETE FROM user_favorites WHERE molecule_id = ${molId}`,
    sql`DELETE FROM recette_molecules WHERE molecule_id = ${molId}`,
    sql`DELETE FROM prototype_molecules WHERE moleculeId = ${molId}`,
    sql`DELETE FROM tabac_molecules WHERE moleculeId = ${molId}`,
    sql`DELETE FROM molecule_accords WHERE moleculeId = ${molId}`,
    sql`DELETE FROM molecule_families WHERE moleculeId = ${molId}`,
    sql`DELETE FROM petrichor_molecules WHERE moleculeId = ${molId}`,
    sql`DELETE FROM volcanique_molecules WHERE moleculeId = ${molId}`,
    sql`DELETE FROM laboratoire_molecules WHERE moleculeId = ${molId}`,
    sql`DELETE FROM molecule_chemical_families WHERE moleculeId = ${molId}`,
    sql`DELETE FROM molecule_notes WHERE molecule_id = ${molId}`,
    sql`DELETE FROM leaf_economy_molecules WHERE molecule_id = ${molId}`,
    sql`DELETE FROM molecule_origins WHERE molecule_id = ${molId}`,
    sql`DELETE FROM ifra_restrictions WHERE molecule_id = ${molId}`,
    sql`DELETE FROM terp_profile_molecules WHERE molecule_id = ${molId}`,
    sql`DELETE FROM raw_material_molecules WHERE molecule_id = ${molId}`,
    sql`DELETE FROM tps_gene_molecules WHERE molecule_id = ${molId}`,
    sql`DELETE FROM molecule_recettes WHERE moleculeId = ${molId}`,
    sql`DELETE FROM publication_molecules WHERE molecule_id = ${molId}`,
    sql`DELETE FROM molecule_perfumes WHERE molecule_id = ${molId}`,
    sql`DELETE FROM synergies WHERE molecule_id = ${molId}`,
    sql`DELETE FROM olfactive_experiences WHERE molecule_id = ${molId}`,
  ];
  for (const q of fkDeleteSqls) {
    try { if (db) await db.execute(q); } catch (_) { /* ignore */ }
  }
}

export const dataCleanupRouter = router({
  // Analyser les doublons
  analyzeDuplicates: publicProcedure.query(async () => {
    return await analyzeDuplicates();
  }),
  
  // Obtenir la liste des doublons à fusionner
  getDuplicatesToMerge: publicProcedure.query(() => {
    return DUPLICATES_TO_MERGE;
  }),
  
  // Prévisualiser la fusion des doublons (dry run)
  previewMergeDuplicates: publicProcedure.query(async () => {
    return await mergeDuplicates(true);
  }),
  
  // Exécuter la fusion des doublons
  executeMergeDuplicates: publicProcedure.mutation(async () => {
    return await mergeDuplicates(false);
  }),
  
  // Prévisualiser l'enrichissement des formules
  previewEnrichFormulas: publicProcedure.query(async () => {
    return await enrichWithFormulas(true);
  }),
  
  // Exécuter l'enrichissement des formules
  executeEnrichFormulas: publicProcedure.mutation(async () => {
    return await enrichWithFormulas(false);
  }),
  
  // Obtenir les statistiques de qualité des données
  getDataQualityStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return null;
    
    const allMolecules = await db.select().from(molecules);
    const total = allMolecules.length;
    
    const stats = {
      total,
      casNumber: {
        filled: allMolecules.filter(m => m.casNumber).length,
        percentage: 0
      },
      iupacName: {
        filled: allMolecules.filter(m => m.iupacName).length,
        percentage: 0
      },
      formula: {
        filled: allMolecules.filter(m => m.chemicalFormula).length,
        percentage: 0
      },
      chemicalClass: {
        filled: allMolecules.filter(m => m.chemicalClass).length,
        percentage: 0
      },
      olfactiveProfile: {
        filled: allMolecules.filter(m => m.olfactiveProfile).length,
        percentage: 0
      },
      smiles: {
        filled: allMolecules.filter(m => m.smiles).length,
        percentage: 0
      },
      molecularWeight: {
        filled: allMolecules.filter(m => m.molecularWeight).length,
        percentage: 0
      },
      boilingPoint: {
        filled: allMolecules.filter(m => m.boilingPoint).length,
        percentage: 0
      },
      pubchemCid: {
        filled: allMolecules.filter(m => m.pubchemCid).length,
        percentage: 0
      }
    };
    
    // Calculer les pourcentages
    Object.keys(stats).forEach(key => {
      if (key !== 'total' && typeof stats[key as keyof typeof stats] === 'object') {
        const field = stats[key as keyof typeof stats] as { filled: number; percentage: number };
        field.percentage = Math.round((field.filled / total) * 1000) / 10;
      }
    });
    
    return stats;
  }),
  
  // Obtenir les molécules sans formule
  getMoleculesWithoutFormula: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    
    const result = await db
      .select({
        id: molecules.id,
        name: molecules.name,
        casNumber: molecules.casNumber,
        chemicalClass: molecules.chemicalClass
      })
      .from(molecules)
      .where(sql`${molecules.chemicalFormula} IS NULL OR ${molecules.chemicalFormula} = ''`)
      .limit(100);
    
    return result;
  }),
  
  // Obtenir les formules de référence disponibles
  getAvailableFormulas: publicProcedure.query(() => {
    return Object.entries(MOLECULE_FORMULAS).map(([name, data]) => ({
      name,
      ...data
    }));
  }),
  
  // Mettre à jour une molécule individuelle
  updateMolecule: protectedProcedure
    .input(z.object({
      id: z.number(),
      formula: z.string().optional(),
      smiles: z.string().optional(),
      molecularWeight: z.string().optional(),
      iupacName: z.string().optional()
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "Database not available" };
      
      const updateData: Record<string, string | null> = {};
      if (input.formula !== undefined) updateData.chemicalFormula = input.formula || null;
      if (input.smiles !== undefined) updateData.smiles = input.smiles || null;
      if (input.molecularWeight !== undefined) updateData.molecularWeight = input.molecularWeight || null;
      if (input.iupacName !== undefined) updateData.iupacName = input.iupacName || null;
      
      if (Object.keys(updateData).length === 0) {
        return { success: false, error: "No fields to update" };
      }
      
      await db.update(molecules).set(updateData).where(eq(molecules.id, input.id));
      
      return { success: true, id: input.id };
    }),
  
  // Supprimer un doublon spécifique
  deleteDuplicate: protectedProcedure
    .input(z.object({
      id: z.number()
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "Database not available" };
      
      await db.delete(molecules).where(eq(molecules.id, input.id));
      
      return { success: true, deletedId: input.id };
    }),
  
  // Analyse des liaisons entre entités
  analyzeLinkCoverage: publicProcedure.query(async () => {
    return await analyzeLinkCoverage();
  }),
  
  // Obtenir les molécules sans liaison avec des recettes
  getMoleculesWithoutRecettes: publicProcedure
    .input(z.object({ limit: z.number().optional().default(50) }).optional())
    .query(async ({ input }) => {
      return await getMoleculesWithoutRecettes(input?.limit || 50);
    }),
  
  // Obtenir les molécules sans liaison avec des plantes
  getMoleculesWithoutPlants: publicProcedure
    .input(z.object({ limit: z.number().optional().default(50) }).optional())
    .query(async ({ input }) => {
      return await getMoleculesWithoutPlants(input?.limit || 50);
    }),
  
  // Obtenir les plantes sans molécules associées
  getPlantsWithoutMolecules: publicProcedure
    .input(z.object({ limit: z.number().optional().default(50) }).optional())
    .query(async ({ input }) => {
      return await getPlantsWithoutMolecules(input?.limit || 50);
    }),

  // Identifier les molécules mal classées (matières premières dans la table molecules)
  getMisclassifiedMolecules: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const rawKeywords = [
      'huile', 'extrait', 'absolu', 'r\u00e9sine', 'baume', 'teinture',
      'mousse', 'kaolin', 'accord', 'm\u00e9lange', 'absolute', 'resin',
      'extract', 'oil ', 'concrete', 'attar', 'oleoresine', 'infusion',
      'hydrolat', 'co2', 'oleoresin', 'opoponax', 'styrax resin',
      'tonka bean', 'santal blanc he', 'n\u00e9roli bouquetier',
      'palo santo', 'spikenard', 'mitti', 'oud tea', 'wild juniper',
      'miyazaki', 'plumeria', 'omani', 'tangerine dream', 'makrut lime',
      'javanole', 'ambre gris', 'ambergris', 'galbanum', 'cembratrienol',
      'profil r\u00e9sineux', 'r\u00e9sines aromatiques', 'monoterpenes (resin', 'sesquiterpenes (resin',
    ];

    const allMolecules = await db.select({
      id: molecules.id,
      name: molecules.name,
      family: molecules.family,
      chemicalClass: molecules.chemicalClass,
      casNumber: molecules.casNumber,
      pubchemCid: molecules.pubchemCid,
      notes: molecules.notes,
      sourceOrigin: molecules.sourceOrigin,
    }).from(molecules).where(sql`pubchem_cid IS NULL`).orderBy(molecules.name);

    return allMolecules.filter(m => {
      const nameLower = (m.name || '').toLowerCase();
      const notesLower = (m.notes || '').toLowerCase();
      const sourceLower = (m.sourceOrigin || '').toLowerCase();
      return rawKeywords.some(kw =>
        nameLower.includes(kw) ||
        notesLower.includes(kw) ||
        sourceLower.includes(kw)
      );
    });
  }),

  // Reclassifier une molécule vers raw_materials
  reclassifyToRawMaterial: protectedProcedure
    .input(z.object({
      moleculeId: z.number(),
      category: z.enum([
        'huile_essentielle', 'absolue', 'concrete', 'resinoid', 'teinture',
        'co2_extract', 'hydrolat', 'beurre', 'cire', 'oleoresine',
        'infusion', 'maceration', 'distillat', 'accord_olfactif',
        'molecule_isolee', 'matiere_animale', 'autre'
      ]),
      dryRun: z.boolean().default(false),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false as const, error: "DB non disponible" };

      const [mol] = await db.select().from(molecules).where(eq(molecules.id, input.moleculeId)).limit(1);
      if (!mol) return { success: false as const, error: `Mol\u00e9cule #${input.moleculeId} non trouv\u00e9e` };

      if (input.dryRun) {
        return {
          success: true as const,
          dryRun: true,
          molecule: { id: mol.id, name: mol.name },
          wouldCreate: { name: mol.name, category: input.category },
        };
      }

      const suffix = Date.now().toString(36).toUpperCase().slice(-5); // 5 chars
      const prefix = (mol.name || '').replace(/[^a-zA-Z0-9]/g, '_').toUpperCase().slice(0, 20); // max 20 chars
      const materialId = `RM_${prefix}_${suffix}`.slice(0, 30); // total max 30 chars

      // Nettoyer les annotations de script dans les notes
      const cleanNotes = (mol.notes || '')
        .replace(/ ?\[PUBCHEM:[^\]]*\]/g, '')
        .replace(/ ?\[LOTUS:[^\]]*\]/g, '')
        .trim() || null;

      await db.insert(rawMaterials).values({
        materialId,
        name: mol.name || 'Sans nom',
        category: input.category as any,
        olfactiveProfile: (() => {
          const op = mol.olfactiveProfile;
          if (!op) return null;
          if (typeof op === 'string') {
            // Peut être un JSON stringifié d'un tableau
            try {
              const parsed = JSON.parse(op);
              return Array.isArray(parsed) ? parsed.join(', ') : op;
            } catch { return op; }
          }
          if (Array.isArray(op)) return (op as string[]).join(', ');
          return String(op);
        })(),
        notes: cleanNotes,
      });

      await db.delete(molecules).where(eq(molecules.id, input.moleculeId));

      return {
        success: true as const,
        dryRun: false,
        molecule: { id: mol.id, name: mol.name },
        created: { materialId, category: input.category },
      };
    }),

  // Reclassifier toutes les molécules mal classées en lot
  reclassifyAllBatch: protectedProcedure
    .mutation(async () => {
      const db = await getDb();
      if (!db) return { success: false as const, error: "DB non disponible", processed: 0, errors: [] };

      // Critères d'identification des matières premières
      const rawMaterialKeywords = [
        'mousse de chêne', 'oakmoss', 'kaolin', 'javanole', 'javanol', 'huile de bois de rose',
        'galbanum', 'cembratrienol', 'ambre gris', 'ambre gris naturel', 'orris butter', 'absolue d\'iris',
        'absolue', 'résinoide', 'oleoresine', 'huile essentielle', 'he de', 'he ', 'accord',
        'extrait de', 'teinture de', 'baume de', 'résine de', 'gomme de', 'concrète de',
        'absolu', 'infusion', 'macerat', 'macerat', 'beurre de', 'cire de',
      ];

      const categoryMap: Record<string, string> = {
        'absolue': 'absolue', 'absolu': 'absolue', 'concrète': 'concrete',
        'huile essentielle': 'huile_essentielle', 'he de': 'huile_essentielle', 'he ': 'huile_essentielle',
        'résinoide': 'resinoid', 'oleoresine': 'oleoresine',
        'résine': 'resinoid', 'gomme': 'resinoid', 'baume': 'resinoid',
        'accord': 'accord_olfactif',
        'kaolin': 'autre', 'argile': 'autre',
        'beurre': 'beurre', 'cire': 'cire',
        'extrait': 'co2_extract', 'teinture': 'teinture',
        'macerat': 'maceration', 'infusion': 'infusion',
      };

      const allMols = await db.select().from(molecules);
      const toReclassify = allMols.filter(mol => {
        if (mol.pubchemCid) return false; // A un CID = vraie molécule
        const nameLower = (mol.name || '').toLowerCase();
        return rawMaterialKeywords.some(kw => nameLower.includes(kw));
      });

      const processed: string[] = [];
      const errors: string[] = [];

      // Utilise la fonction partagée deleteAllMoleculeFKs (définie au niveau module)

      for (const mol of toReclassify) {
        try {
          const nameLower = (mol.name || '').toLowerCase();
          let category = 'autre';
          for (const [kw, cat] of Object.entries(categoryMap)) {
            if (nameLower.includes(kw)) { category = cat; break; }
          }
          const suffix = Date.now().toString(36).toUpperCase().slice(-5); // 5 chars
          const prefix = (mol.name || '').replace(/[^a-zA-Z0-9]/g, '_').toUpperCase().slice(0, 20); // max 20 chars
          const materialId = `RM_${prefix}_${suffix}`.slice(0, 30); // total max 30 chars
          const olfactiveProfileStr = (() => {
            const op = mol.olfactiveProfile;
            if (!op) return null;
            if (typeof op === 'string') {
              try { const p = JSON.parse(op); return Array.isArray(p) ? p.join(', ') : op; } catch { return op; }
            }
            if (Array.isArray(op)) return (op as string[]).join(', ');
            return String(op);
          })();
          // Vérifier si un équivalent existe déjà dans raw_materials (par nom)
          const existing = await db.select({ id: rawMaterials.id })
            .from(rawMaterials)
            .where(sql`LOWER(name) = LOWER(${mol.name || ''})`)
            .limit(1);
          if (existing.length === 0) {
            try {
              const cleanNotesB = (mol.notes || '')
                .replace(/ ?\[PUBCHEM:[^\]]*\]/g, '')
                .replace(/ ?\[LOTUS:[^\]]*\]/g, '')
                .trim() || null;
          await db.insert(rawMaterials).values({
                materialId, name: mol.name || 'Sans nom', category: category as any,
                olfactiveProfile: olfactiveProfileStr, notes: cleanNotesB,
              });
            } catch (insertErr: any) {
              // Log détaillé pour déboguer
              console.error(`INSERT FAIL for ${mol.name}:`, insertErr?.cause?.message || insertErr?.message || insertErr);
              throw insertErr;
            }
          }
          // Supprimer toutes les FK avant de supprimer la molécule
          await deleteAllMoleculeFKs(db, mol.id);
          await db.delete(molecules).where(eq(molecules.id, mol.id));
          processed.push(mol.name || `#${mol.id}`);
        } catch (e) {
          errors.push(`${mol.name}: ${(e as Error).message.slice(0, 300)}`);
        }
      }

      return { success: true as const, processed: processed.length, processedNames: processed, errors };
    }),

  // Supprimer une molécule mal classée (doublon ou entrée invalide)
  deleteMisclassified: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false as const };
      // Nettoyer toutes les FK avant suppression (via fonction partagée)
      await deleteAllMoleculeFKs(db, input.id);
      await db.delete(molecules).where(eq(molecules.id, input.id));
      return { success: true as const, deletedId: input.id };
    }),
});
