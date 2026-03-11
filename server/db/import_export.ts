// @ts-nocheck
/**
 * Module: import_export
 * Généré automatiquement depuis server/db.ts
 * Sections: VALIDATION & DRAFT SYSTEM, LIAISONS MOLÉCULE-FAMILLE CHIMIQUE (pour graphe et export), GC-MS IMPORT HELPERS
 */

import { eq, and, or, isNull, isNotNull, not, desc, asc, sql, like, gte, lte, inArray, notInArray, count, type SQL } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  userFavorites,
  milestones,
  prototypes,
  families,
  tabacs,
  molecules,
  accords,
  recettes,
  civilisations,
  petrichor,
  volcanique,
  installations,
  laboratoire,
  glossary,
  absorbeProfiles,
  prototypeChemicalFamilies,
  chemicalFamilies,
  moleculeChemicalFamilies,
  accordCivilisations,
  researchTimeline,
  experimentalAccords,
  moleculesRecettes,
  recettesFormulesReference,
  Prototype,
  Family,
  Tabac,
  Molecule,
  Accord,
  Recette,
  InsertRecette,
  Civilisation,
  Petrichor,
  Volcanique,
  Installation,
  Laboratoire,
  GlossaryTerm,
  ResearchMilestone,
  ExperimentalAccord,
  synergies,
  Synergie,
  terpeneSynergies,
  userNotes,
  TerpeneSynergy,
  sharedCollections,
  moleculeNotes,
  citations,
  analyticsEvents,
  suppliers,
  supplierMaterials,
  Supplier,
  InsertSupplier,
  SupplierMaterial,
  InsertSupplierMaterial,
  rechercheRadicale,
  modificationHistory,
  moleculeSynergies,
  MoleculeSynergie,
  savedFormulas,
  SavedFormula,
  InsertSavedFormula,
  climateStudies,
  ClimateStudy,
  InsertClimateStudy,
  molecularProtocols,
  MolecularProtocol,
  InsertMolecularProtocol,
  fieldArchives,
  FieldArchive,
  InsertFieldArchive,
  extractionTests,
  ExtractionTest,
  InsertExtractionTest,
  situatedSmells,
  SituatedSmell,
  InsertSituatedSmell,
  leafEconomies,
  LeafEconomy,
  InsertLeafEconomy,
  leafEconomyMolecules,
  geographicOrigins,
  GeographicOrigin,
  InsertGeographicOrigin,
  moleculeOrigins,
  MoleculeOrigin,
  InsertMoleculeOrigin,
  ifraRestrictions,
  IfraRestriction,
  InsertIfraRestriction,
  plants,
  Plant,
  InsertPlant,
  geographicZones,
  plantGeographicZones,
  terpProfiles,
  TerpProfile,
  InsertTerpProfile,
  finalRecipes,
  FinalRecipe,
  InsertFinalRecipe,
  terpProfilePlants,
  terpProfileMolecules,
  plantMolecules,
  finalRecipeTerpProfiles,
  // Point 3 étendu
  plantVarieties,
  PlantVariety,
  InsertPlantVariety,
  terroirs,
  Terroir,
  InsertTerroir,
  extractionMethods,
  ExtractionMethod,
  InsertExtractionMethod,
  plantAnalyses,
  PlantAnalysis,
  InsertPlantAnalysis,
  plantSamples,
  PlantSample,
  InsertPlantSample,
  extendedSuppliers,
  ExtendedSupplier,
  InsertExtendedSupplier,
  plantTerroirs,
  PlantTerroir,
  InsertPlantTerroir,
  plantExtractions,
  PlantExtraction,
  InsertPlantExtraction,
  extendedSupplierMaterials,
  ExtendedSupplierMaterial,
  InsertExtendedSupplierMaterial,
  // Nouvelles tables pour les relations molécule-plante-terroir
  rawMaterials,
  RawMaterial,
  InsertRawMaterial,
  rawMaterialMolecules,
  RawMaterialMolecule,
  InsertRawMaterialMolecule,
  moleculePlantSources,
  MoleculePlantSource,
  InsertMoleculePlantSource,
  terroirSpecialties,
  TerroirSpecialty,
  InsertTerroirSpecialty,
  // Chémotypes
  chemotypes,
  Chemotype,
  // Conservation & Archives (Jour 1-2)
  olfactiveArchives,
  OlfactiveArchive,
  InsertOlfactiveArchive,
  civilizationalMarkers,
  CivilizationalMarker,
  InsertCivilizationalMarker,
  varietyGenealogy,
  VarietyGenealogy,
  InsertVarietyGenealogy,
  InsertChemotype,
  // Catégories IFRA
  ifraCategories,
  IfraCategory,
  InsertIfraCategory,
  // Sample Images (Galerie)
  sampleImages,
  SampleImage,
  InsertSampleImage,
  // Sustainable Alternatives
  sustainableAlternatives,
  SustainableAlternative,
  InsertSustainableAlternative,
  // Bibliography & Research Axes
  bibliographyEntries,
  BibliographyEntry,
  InsertBibliographyEntry,
  researchAxes,
  ResearchAxis,
  InsertResearchAxis,
  researchEntries,
  ResearchEntry,
  InsertResearchEntry,
  bibliographyAxisLinks,
  BibliographyAxisLink,
  InsertBibliographyAxisLink,
  // Reference Citations
  referenceCitations,
  ReferenceCitation,
  InsertReferenceCitation,
  // V3 References (Pack Niche Innovations)
  thematicAxes,
  ThematicAxis,
  InsertThematicAxis,
  v3References,
  V3Reference,
  InsertV3Reference,
  referenceTags,
  ReferenceTag,
  InsertReferenceTag,
  v3ReferenceTagLinks,
  V3ReferenceTagLink,
  InsertV3ReferenceTagLink,
  referenceNotes,
  ReferenceNote,
  InsertReferenceNote,
  axisConnections,
  AxisConnection,
  InsertAxisConnection,
  // Reference Entity Links & Olfactory Traditions
  referenceEntityLinks,
  ReferenceEntityLink,
  InsertReferenceEntityLink,
  olfactoryTraditions,
  OlfactoryTradition,
  InsertOlfactoryTradition,
  // Curated Journeys
  curatedJourneys,
  CuratedJourney,
  InsertCuratedJourney,
  journeyItems,
  JourneyItem,
  InsertJourneyItem,
  // Axis Reference Links
  axisReferenceLinks,
  AxisReferenceLink,
  InsertAxisReferenceLink,
  // Recette <-> Molecule (table recette_molecules)
  recetteMolecules,
  RecetteMolecule,
  InsertRecetteMolecule,
  // Recette <-> Raw Materials (liaison directe)
  recetteRawMaterials,
  RecetteRawMaterial,
  InsertRecetteRawMaterial,
} from "../../drizzle/schema";
import { getDb } from './core';

import { ENV } from '../_core/env';
import { expandSearchQuery, getSynonyms, normalizeSearchTerm, categorizeOlfactiveTerm, getDictionaryStats } from '../../shared/olfactiveSynonyms';
import { expandWithScientificNames, getScientificDictionaryStats } from '../../shared/botanicalLatinNames';


// ====================================================================
// VALIDATION & DRAFT SYSTEM
// ====================================================================
// ============================================================================
// VALIDATION & DRAFT SYSTEM
// ============================================================================

/**
 * Récupérer les molécules en attente de validation
 */
export async function getPendingMolecules() {
  const db = await getDb();
  if (!db) return [];

  return db.select()
    .from(molecules)
    .where(
      or(
        eq(molecules.validationStatus, 'brouillon'),
        eq(molecules.validationStatus, 'en_revision')
      )
    )
    .orderBy(desc(molecules.updatedAt));
}

/**
 * Récupérer les plantes en attente de validation
 */
export async function getPendingPlants() {
  const db = await getDb();
  if (!db) return [];

  return db.select()
    .from(plants)
    .where(
      or(
        eq(plants.validationStatus, 'brouillon'),
        eq(plants.validationStatus, 'en_revision')
      )
    )
    .orderBy(desc(plants.updatedAt));
}

/**
 * Valider une molécule
 */
export async function validateMolecule(moleculeId: number, adminId: number) {
  const db = await getDb();
  if (!db) return { success: false, error: "Database not available" };

  try {
    await db.update(molecules)
      .set({
        validationStatus: 'valide',
        validatedBy: adminId,
        validatedAt: new Date(),
      })
      .where(eq(molecules.id, moleculeId));

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Rejeter une molécule
 */
export async function rejectMolecule(moleculeId: number, adminId: number, reason?: string) {
  const db = await getDb();
  if (!db) return { success: false, error: "Database not available" };

  try {
    const currentNotes = await db.select({ notes: molecules.notes })
      .from(molecules)
      .where(eq(molecules.id, moleculeId));

    const existingNotes = currentNotes[0]?.notes || '';
    const rejectionNote = reason ? `[REJET ${new Date().toISOString()}]: ${reason}\n${existingNotes}` : existingNotes;

    await db.update(molecules)
      .set({
        validationStatus: 'rejete',
        validatedBy: adminId,
        validatedAt: new Date(),
        notes: rejectionNote,
      })
      .where(eq(molecules.id, moleculeId));

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Valider une plante
 */
export async function validatePlant(plantId: number, adminId: number) {
  const db = await getDb();
  if (!db) return { success: false, error: "Database not available" };

  try {
    await db.update(plants)
      .set({
        validationStatus: 'valide',
        validatedBy: adminId,
        validatedAt: new Date(),
      })
      .where(eq(plants.id, plantId));

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Rejeter une plante
 */
export async function rejectPlant(plantId: number, adminId: number, reason?: string) {
  const db = await getDb();
  if (!db) return { success: false, error: "Database not available" };

  try {
    const currentNotes = await db.select({ notes: plants.notes })
      .from(plants)
      .where(eq(plants.id, plantId));

    const existingNotes = currentNotes[0]?.notes || '';
    const rejectionNote = reason ? `[REJET ${new Date().toISOString()}]: ${reason}\n${existingNotes}` : existingNotes;

    await db.update(plants)
      .set({
        validationStatus: 'rejete',
        validatedBy: adminId,
        validatedAt: new Date(),
        notes: rejectionNote,
      })
      .where(eq(plants.id, plantId));

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Soumettre une molécule pour révision
 */
export async function submitMoleculeForReview(moleculeId: number) {
  const db = await getDb();
  if (!db) return { success: false, error: "Database not available" };

  try {
    await db.update(molecules)
      .set({
        validationStatus: 'en_revision',
      })
      .where(eq(molecules.id, moleculeId));

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Soumettre une plante pour révision
 */
export async function submitPlantForReview(plantId: number) {
  const db = await getDb();
  if (!db) return { success: false, error: "Database not available" };

  try {
    await db.update(plants)
      .set({
        validationStatus: 'en_revision',
      })
      .where(eq(plants.id, plantId));

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Récupérer les statistiques de validation
 */
export async function getValidationStats() {
  const db = await getDb();
  if (!db) return null;

  const allMolecules = await db.select({
    validationStatus: molecules.validationStatus,
  }).from(molecules);

  const allPlants = await db.select({
    validationStatus: plants.validationStatus,
  }).from(plants);

  const moleculeStats = {
    total: allMolecules.length,
    brouillon: allMolecules.filter(m => m.validationStatus === 'brouillon').length,
    en_revision: allMolecules.filter(m => m.validationStatus === 'en_revision').length,
    valide: allMolecules.filter(m => m.validationStatus === 'valide' || !m.validationStatus).length,
    rejete: allMolecules.filter(m => m.validationStatus === 'rejete').length,
  };

  const plantStats = {
    total: allPlants.length,
    brouillon: allPlants.filter(p => p.validationStatus === 'brouillon').length,
    en_revision: allPlants.filter(p => p.validationStatus === 'en_revision').length,
    valide: allPlants.filter(p => p.validationStatus === 'valide' || !p.validationStatus).length,
    rejete: allPlants.filter(p => p.validationStatus === 'rejete').length,
  };

  return {
    molecules: moleculeStats,
    plants: plantStats,
    pendingTotal: moleculeStats.brouillon + moleculeStats.en_revision + plantStats.brouillon + plantStats.en_revision,
  };
}



// ====================================================================
// LIAISONS MOLÉCULE-FAMILLE CHIMIQUE (pour graphe et export)
// ====================================================================
// ============================================================================
// LIAISONS MOLÉCULE-FAMILLE CHIMIQUE (pour graphe et export)
// ============================================================================

/**
 * Récupère toutes les liaisons molécule-famille chimique avec détails complets
 */
export async function getAllMoleculeChemicalFamilyLinks() {
  const db = await getDb();
  if (!db) return [];
  
  const links = await db
    .select({
      moleculeId: molecules.id,
      moleculeName: molecules.name,
      moleculeFamily: molecules.family,
      chemicalFamilyId: chemicalFamilies.id,
      chemicalFamilyName: chemicalFamilies.name,
      chemicalFamilyType: chemicalFamilies.type,
      chemicalFamilyDescription: chemicalFamilies.description,
      chemicalFamilyOlfactiveRole: chemicalFamilies.olfactiveRole,
    })
    .from(moleculeChemicalFamilies)
    .innerJoin(molecules, eq(moleculeChemicalFamilies.moleculeId, molecules.id))
    .innerJoin(chemicalFamilies, eq(moleculeChemicalFamilies.chemicalFamilyId, chemicalFamilies.id))
    .orderBy(chemicalFamilies.name, molecules.name);
  
  return links;
}

/**
 * Exporte les liaisons molécule-famille chimique au format CSV
 */
export async function exportMoleculeChemicalFamilyLinksCSV() {
  const links = await getAllMoleculeChemicalFamilyLinks();
  
  // En-têtes CSV
  const headers = [
    'molecule_id',
    'molecule_name',
    'molecule_family',
    'chemical_family_id',
    'chemical_family_name',
    'chemical_family_type',
    'chemical_family_description',
    'chemical_family_olfactive_role',
  ];
  
  // Lignes CSV
  const rows = links.map((link: {
    moleculeId: number;
    moleculeName: string;
    moleculeFamily: string | null;
    chemicalFamilyId: number;
    chemicalFamilyName: string;
    chemicalFamilyType: string;
    chemicalFamilyDescription: string | null;
    chemicalFamilyOlfactiveRole: string | null;
  }) => [
    link.moleculeId,
    `"${(link.moleculeName || '').replace(/"/g, '""')}"`,
    `"${(link.moleculeFamily || '').replace(/"/g, '""')}"`,
    link.chemicalFamilyId,
    `"${(link.chemicalFamilyName || '').replace(/"/g, '""')}"`,
    `"${(link.chemicalFamilyType || '').replace(/"/g, '""')}"`,
    `"${(link.chemicalFamilyDescription || '').replace(/"/g, '""')}"`,
    `"${(link.chemicalFamilyOlfactiveRole || '').replace(/"/g, '""')}"`,
  ].join(','));
  
  return [headers.join(','), ...rows].join('\n');
}

/**
 * Exporte les liaisons molécule-famille chimique au format JSON
 */
export async function exportMoleculeChemicalFamilyLinksJSON() {
  const links = await getAllMoleculeChemicalFamilyLinks();
  
  return {
    exportDate: new Date().toISOString(),
    totalLinks: links.length,
    uniqueMolecules: new Set(links.map((l: { moleculeId: number }) => l.moleculeId)).size,
    uniqueFamilies: new Set(links.map((l: { chemicalFamilyId: number }) => l.chemicalFamilyId)).size,
    links: links.map((link: {
      moleculeId: number;
      moleculeName: string;
      moleculeFamily: string | null;
      chemicalFamilyId: number;
      chemicalFamilyName: string;
      chemicalFamilyType: string;
      chemicalFamilyDescription: string | null;
      chemicalFamilyOlfactiveRole: string | null;
    }) => ({
      molecule: {
        id: link.moleculeId,
        name: link.moleculeName,
        family: link.moleculeFamily,
      },
      chemicalFamily: {
        id: link.chemicalFamilyId,
        name: link.chemicalFamilyName,
        type: link.chemicalFamilyType,
        description: link.chemicalFamilyDescription,
        olfactiveRole: link.chemicalFamilyOlfactiveRole,
      },
    })),
  };
}



// ====================================================================
// GC-MS IMPORT HELPERS
// ====================================================================
// ============================================================
// GC-MS IMPORT HELPERS
// ============================================================

export async function searchPlantsForGcms(query: string) {
  try {
    const mysql = await import('mysql2/promise');
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);
    const [rows] = await conn.execute(
      `SELECT id, name, latin_name, category FROM plants
       WHERE name LIKE ? OR latin_name LIKE ?
       ORDER BY category, name LIMIT 20`,
      [`%${query}%`, `%${query}%`]
    );
    await conn.end();
    return rows as any[];
  } catch (e: any) { console.error(e); return []; }
}

export async function searchMoleculesForGcms(query: string) {
  try {
    const mysql = await import('mysql2/promise');
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);
    const [rows] = await conn.execute(
      `SELECT id, name, cas_number, olfactive_family FROM molecules
       WHERE name LIKE ? OR cas_number LIKE ?
       ORDER BY name LIMIT 20`,
      [`%${query}%`, `%${query}%`]
    );
    await conn.end();
    return rows as any[];
  } catch (e: any) { console.error(e); return []; }
}

export async function getGcmsProfile(plantId: number) {
  try {
    const mysql = await import('mysql2/promise');
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);
    const [rows] = await conn.execute(
      `SELECT pm.*, m.name as molecule_name, m.cas_number, m.olfactive_family
       FROM plant_molecules pm
       JOIN molecules m ON pm.molecule_id = m.id
       WHERE pm.plant_id = ?
       ORDER BY COALESCE(pm.percentage_typical, pm.percentage_max, pm.percentage_min, 0) DESC`,
      [plantId]
    );
    await conn.end();
    return rows as any[];
  } catch (e: any) { console.error(e); return []; }
}

type GcmsMoleculeInput = {
  moleculeId?: number;
  moleculeName: string;
  percentageMin?: number;
  percentageMax?: number;
  percentageTypical?: number;
  role?: string;
  isSignature?: boolean;
  source?: string;
  notes?: string;
};

export async function previewGcmsImport(
  plantId: number,
  molecules: GcmsMoleculeInput[],
  overwriteExisting: boolean
) {
  try {
    const mysql = await import('mysql2/promise');
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);

    const results: any[] = [];
    for (const mol of molecules) {
      let moleculeId = mol.moleculeId;
      let moleculeDbName = mol.moleculeName;
      let status = 'new_link';

      // Résoudre l'ID si non fourni
      if (!moleculeId) {
        const [found] = await conn.execute(
          `SELECT id, name FROM molecules WHERE LOWER(name) = LOWER(?) LIMIT 1`,
          [mol.moleculeName]
        ) as any[];
        if ((found as any[]).length > 0) {
          moleculeId = (found as any[])[0].id;
          moleculeDbName = (found as any[])[0].name;
        } else {
          status = 'molecule_not_found';
        }
      }

      if (moleculeId) {
        const [existing] = await conn.execute(
          `SELECT plant_id FROM plant_molecules WHERE plant_id = ? AND molecule_id = ?`,
          [plantId, moleculeId]
        ) as any[];
        if ((existing as any[]).length > 0) {
          status = overwriteExisting ? 'will_update' : 'already_exists_skip';
        }
      }

      results.push({
        moleculeName: mol.moleculeName,
        moleculeDbName,
        moleculeId,
        percentageTypical: mol.percentageTypical,
        percentageMin: mol.percentageMin,
        percentageMax: mol.percentageMax,
        role: mol.role || 'secondaire',
        isSignature: mol.isSignature || false,
        source: mol.source,
        status,
      });
    }

    await conn.end();
    return {
      plantId,
      totalMolecules: molecules.length,
      newLinks: results.filter(r => r.status === 'new_link').length,
      updates: results.filter(r => r.status === 'will_update').length,
      skipped: results.filter(r => r.status === 'already_exists_skip').length,
      notFound: results.filter(r => r.status === 'molecule_not_found').length,
      rows: results,
    };
  } catch (e: any) { console.error(e); throw e; }
}

export async function importGcmsBatch(
  plantId: number,
  molecules: GcmsMoleculeInput[],
  overwriteExisting: boolean,
  bibliography?: string[]
) {
  try {
    const mysql = await import('mysql2/promise');
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);

    let created = 0, updated = 0, skipped = 0, notFound = 0;
    const errors: string[] = [];

    for (const mol of molecules) {
      try {
        let moleculeId = mol.moleculeId;

        if (!moleculeId) {
          const [found] = await conn.execute(
            `SELECT id FROM molecules WHERE LOWER(name) = LOWER(?) LIMIT 1`,
            [mol.moleculeName]
          ) as any[];
          if ((found as any[]).length > 0) {
            moleculeId = (found as any[])[0].id;
          } else {
            notFound++;
            errors.push(`Molécule non trouvée : "${mol.moleculeName}"`);
            continue;
          }
        }

        const [existing] = await conn.execute(
          `SELECT plant_id FROM plant_molecules WHERE plant_id = ? AND molecule_id = ?`,
          [plantId, moleculeId]
        ) as any[];

        if ((existing as any[]).length > 0) {
          if (overwriteExisting) {
            await conn.execute(`
              UPDATE plant_molecules SET
                percentage_min = ?, percentage_max = ?, percentage_typical = ?,
                role = ?, is_signature = ?, source = ?, notes = ?, updated_at = NOW()
              WHERE plant_id = ? AND molecule_id = ?
            `, [
              mol.percentageMin ?? null, mol.percentageMax ?? null, mol.percentageTypical ?? null,
              mol.role || 'secondaire', mol.isSignature ? 1 : 0,
              mol.source || 'GC-MS', mol.notes || null,
              plantId, moleculeId
            ]);
            updated++;
          } else {
            skipped++;
          }
        } else {
          await conn.execute(`
            INSERT INTO plant_molecules
              (plant_id, molecule_id, percentage_min, percentage_max, percentage_typical,
               role, is_signature, source, notes, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
          `, [
            plantId, moleculeId,
            mol.percentageMin ?? null, mol.percentageMax ?? null, mol.percentageTypical ?? null,
            mol.role || 'secondaire', mol.isSignature ? 1 : 0,
            mol.source || 'GC-MS', mol.notes || null
          ]);
          created++;
        }
      } catch (rowErr: any) {
        errors.push(`Erreur pour "${mol.moleculeName}": ${rowErr.message}`);
      }
    }

    // Enregistrer la bibliographie dans les notes de la plante si fournie
    if (bibliography && bibliography.length > 0) {
      const bibText = '\n[Sources GC-MS] ' + bibliography.join(' | ');
      await conn.execute(
        `UPDATE plants SET notes = CONCAT(COALESCE(notes, ''), ?), updated_at = NOW() WHERE id = ?`,
        [bibText, plantId]
      );
    }

    await conn.end();
    return { success: true, created, updated, skipped, notFound, errors };
  } catch (e: any) { console.error(e); throw e; }
}

export async function importGcmsFromCsv(
  rows: Array<{
    plantName: string;
    moleculeName: string;
    percentageMin?: number;
    percentageMax?: number;
    percentageTypical?: number;
    role?: string;
    isSignature?: boolean;
    source?: string;
    notes?: string;
  }>,
  overwriteExisting: boolean
) {
  try {
    const mysql = await import('mysql2/promise');
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);

    let created = 0, updated = 0, skipped = 0, notFound = 0;
    const errors: string[] = [];
    const plantCache: Record<string, number | null> = {};

    for (const row of rows) {
      try {
        // Résoudre la plante
        if (!(row.plantName in plantCache)) {
          const [plants] = await conn.execute(
            `SELECT id FROM plants WHERE LOWER(name) = LOWER(?) OR LOWER(latin_name) = LOWER(?) LIMIT 1`,
            [row.plantName, row.plantName]
          ) as any[];
          plantCache[row.plantName] = (plants as any[]).length > 0 ? (plants as any[])[0].id : null;
        }
        const plantId = plantCache[row.plantName];
        if (!plantId) {
          notFound++;
          errors.push(`Plante non trouvée : "${row.plantName}"`);
          continue;
        }

        // Résoudre la molécule
        const [mols] = await conn.execute(
          `SELECT id FROM molecules WHERE LOWER(name) = LOWER(?) LIMIT 1`,
          [row.moleculeName]
        ) as any[];
        if ((mols as any[]).length === 0) {
          notFound++;
          errors.push(`Molécule non trouvée : "${row.moleculeName}"`);
          continue;
        }
        const moleculeId = (mols as any[])[0].id;

        const [existing] = await conn.execute(
          `SELECT plant_id FROM plant_molecules WHERE plant_id = ? AND molecule_id = ?`,
          [plantId, moleculeId]
        ) as any[];

        if ((existing as any[]).length > 0) {
          if (overwriteExisting) {
            await conn.execute(`
              UPDATE plant_molecules SET
                percentage_min = ?, percentage_max = ?, percentage_typical = ?,
                role = ?, is_signature = ?, source = ?, notes = ?, updated_at = NOW()
              WHERE plant_id = ? AND molecule_id = ?
            `, [
              row.percentageMin ?? null, row.percentageMax ?? null, row.percentageTypical ?? null,
              row.role || 'secondaire', row.isSignature ? 1 : 0,
              row.source || 'GC-MS', row.notes || null,
              plantId, moleculeId
            ]);
            updated++;
          } else {
            skipped++;
          }
        } else {
          await conn.execute(`
            INSERT INTO plant_molecules
              (plant_id, molecule_id, percentage_min, percentage_max, percentage_typical,
               role, is_signature, source, notes, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
          `, [
            plantId, moleculeId,
            row.percentageMin ?? null, row.percentageMax ?? null, row.percentageTypical ?? null,
            row.role || 'secondaire', row.isSignature ? 1 : 0,
            row.source || 'GC-MS', row.notes || null
          ]);
          created++;
        }
      } catch (rowErr: any) {
        errors.push(`Erreur ligne "${row.plantName}/${row.moleculeName}": ${rowErr.message}`);
      }
    }

    await conn.end();
    return { success: true, created, updated, skipped, notFound, errors };
  } catch (e: any) { console.error(e); throw e; }
}

/**
 * Récupère les recettes qui contiennent une molécule donnée (par nom).
 * Recherche d'abord la molécule par son nom exact, puis retourne les recettes associées.
 */
export async function getRecettesByMoleculeName(moleculeName: string, limit: number = 8) {
  const db = await getDb();
  if (!db) return [];

  // Trouver la molécule par son nom (insensible à la casse)
  const mol = await db
    .select({ id: molecules.id, name: molecules.name })
    .from(molecules)
    .where(sql`LOWER(${molecules.name}) = LOWER(${moleculeName})`)
    .limit(1);

  if (!mol[0]) return [];

  // Récupérer les recettes associées via la table de jonction
  const result = await db
    .select({
      id: recettes.id,
      name: recettes.name,
      category: recettes.category,
      description: recettes.description,
      status: recettes.status,
      proportion: moleculesRecettes.proportion,
      role: moleculesRecettes.role,
    })
    .from(moleculesRecettes)
    .innerJoin(recettes, eq(moleculesRecettes.recetteId, recettes.id))
    .where(eq(moleculesRecettes.moleculeId, mol[0].id))
    .orderBy(desc(moleculesRecettes.proportion))
    .limit(limit);

  return result;
}

