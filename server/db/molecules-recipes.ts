/**
 * Extracted from server/db/molecules.ts
 * Module: Recipes
 */
/**
 * Module: molecules
 * Généré automatiquement depuis server/db.ts
 * Sections: MOLECULES, MOLECULE DETAILS WITH RELATIONS, GET ALL MOLECULE-RECETTE RELATIONSHIPS FOR CORRELATION ANALYSIS (+25 autres)
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
  ghostVarietyMoleculeLinks,
  GhostVarietyMoleculeLink,
  InsertGhostVarietyMoleculeLink,
  genomicMoleculeLinks,
  GenomicMoleculeLink,
  InsertGenomicMoleculeLink,
} from "../../drizzle/schema";
import { getDb } from './core';
import type { FlavornetData } from '../flavornet';
import { enrichMoleculeWithTranslationCOCONUT } from '../coconut';
import { getPlantVarietyById } from './plants';

import { ENV } from '../_core/env';
import { expandSearchQuery, getSynonyms, normalizeSearchTerm, categorizeOlfactiveTerm, getDictionaryStats } from '../../shared/olfactiveSynonyms';
import { expandWithScientificNames, getScientificDictionaryStats } from '../../shared/botanicalLatinNames';


// ====================================================================
// MOLECULES
// ====================================================================
// ============================================================================
// MOLECULES
// ============================================================================

/**
 * Parse tous les champs JSON d'une molécule qui peuvent être stockés comme strings
 * par MySQL/TiDB (comportement natif : les colonnes json() reviennent parfois en string).
 *
 * SOURCE UNIQUE DE VÉRITÉ pour le parsing JSON des molécules.
 * AJOUTER ICI tout nouveau champ JSON ajouté au schema molecules.
 *
 * Champs couverts :
 *   - json() dans Drizzle : references, pubchemSynonyms, coconutOrganisms, coconutCitations, ifraData
 *   - text() contenant parfois du JSON : therapeuticProperties, olfactiveProfile
 */

export async function getAllMoleculeRecetteRelationships() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const relationships = await db
    .select({
      moleculeId: moleculesRecettes.moleculeId,
      recetteId: moleculesRecettes.recetteId,
      proportion: moleculesRecettes.proportion,
    })
    .from(moleculesRecettes);
  
  return relationships;
}




// ====================================================================
// MOLECULES RADAR UPDATE
// ====================================================================
// ============================================================================
// MOLECULES RADAR UPDATE
// ============================================================================
export async function insertMoleculeRecetteAssociation(
  recetteId: number,
  moleculeId: number,
  proportion: number,
  notes?: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  try {
    await db.insert(moleculesRecettes).values({
      recetteId,
      moleculeId,
      proportion: proportion.toString(),
      notes: notes || 'Auto-généré',
    }).onDuplicateKeyUpdate({
      set: {
        proportion: proportion.toString(),
        notes: notes || 'Auto-généré',
      }
    });
    return true;
  } catch (error) {
    console.error(`Error inserting association ${recetteId}-${moleculeId}:`, error);
    return false;
  }
}
export async function batchInsertMoleculeRecetteAssociations(
  associations: Array<{ recetteId: number; moleculeId: number; proportion: number; notes?: string }>
): Promise<{ success: number; failed: number }> {
  const db = await getDb();
  if (!db) return { success: 0, failed: associations.length };
  
  let success = 0;
  let failed = 0;
  
  for (const assoc of associations) {
    const result = await insertMoleculeRecetteAssociation(
      assoc.recetteId,
      assoc.moleculeId,
      assoc.proportion,
      assoc.notes
    );
    if (result) success++;
    else failed++;
  }
  
  return { success, failed };
}

// Récupérer les recettes sans associations pour une gamme
export async function getRecettesWithoutMoleculesByGamme(gamme: 'volcanique' | 'glaciaire' | 'biolab' | 'petrichor'): Promise<Recette[]> {
  const db = await getDb();
  if (!db) return [];
  
  // Conditions par gamme
  const conditions: Record<string, ReturnType<typeof or>> = {
    volcanique: or(
      like(recettes.name, '%Volcanique%'),
      like(recettes.name, '%Fumé%'),
      like(recettes.name, '%Pyrolyse%'),
      eq(recettes.category, 'tabac')
    ),
    glaciaire: or(
      like(recettes.name, '%Glaciaire%'),
      like(recettes.name, '%Frais%'),
      like(recettes.name, '%Ozone%'),
      like(recettes.name, '%Menthe%')
    ),
    biolab: or(
      like(recettes.name, '%Bio%'),
      like(recettes.name, '%CBD%'),
      like(recettes.name, '%Résine%'),
      eq(recettes.category, 'resine_cbd')
    ),
    petrichor: or(
      like(recettes.name, '%Pétrichor%'),
      like(recettes.name, '%Terre%'),
      like(recettes.name, '%Minéral%')
    ),
  };
  
  const condition = conditions[gamme];
  if (!condition) return [];
  
  // Récupérer les recettes qui n'ont pas d'associations
  const allRecettes = await db.select().from(recettes).where(condition);
  
  const recettesWithoutMolecules: Recette[] = [];
  
  for (const recette of allRecettes) {
    const associations = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(moleculesRecettes)
      .where(eq(moleculesRecettes.recetteId, recette.id));
    
    if (associations[0]?.count === 0) {
      recettesWithoutMolecules.push(recette);
    }
  }
  
  return recettesWithoutMolecules;
}

// Récupérer les molécules par profil olfactif pour une gamme
export async function getMoleculesForGamme(gamme: 'volcanique' | 'glaciaire' | 'biolab' | 'petrichor'): Promise<Molecule[]> {
  const db = await getDb();
  if (!db) return [];
  
  // Mots-clés par gamme
  const keywords: Record<string, string[]> = {
    volcanique: ['fumé', 'boisé', 'torréfié', 'grillé', 'cuir', 'goudron', 'brûlé', 'caramel'],
    glaciaire: ['frais', 'marin', 'ozone', 'menthe', 'agrume', 'citron', 'pin', 'conifère'],
    biolab: ['herbacé', 'terreux', 'houblon', 'épicé', 'poivre', 'boisé', 'lavande', 'floral'],
    petrichor: ['terre', 'pluie', 'minéral', 'racine', 'ambre', 'cèdre', 'mousse', 'humide'],
  };
  
  const gammeKeywords = keywords[gamme] || [];
  if (gammeKeywords.length === 0) return [];
  
  // Construire les conditions LIKE pour chaque mot-clé
  const allMolecules = await db.select().from(molecules);
  
  return allMolecules.filter(mol => {
    const profile = (mol.olfactiveProfile || '').toLowerCase();
    const name = mol.name.toLowerCase();
    return gammeKeywords.some(kw => profile.includes(kw) || name.includes(kw));
  });
}

// Enrichir automatiquement les associations pour une gamme
export async function enrichGammeAssociations(gamme: 'volcanique' | 'glaciaire' | 'biolab' | 'petrichor'): Promise<{
  recettesProcessed: number;
  associationsCreated: number;
  moleculesUsed: string[];
}> {
  const db = await getDb();
  if (!db) return { recettesProcessed: 0, associationsCreated: 0, moleculesUsed: [] };
  
  // Récupérer les recettes sans associations
  const recettesToEnrich = await getRecettesWithoutMoleculesByGamme(gamme);
  
  // Récupérer les molécules appropriées pour cette gamme
  const gammeMolecules = await getMoleculesForGamme(gamme);
  
  if (gammeMolecules.length === 0) {
    console.log(`Aucune molécule trouvée pour la gamme ${gamme}`);
    return { recettesProcessed: 0, associationsCreated: 0, moleculesUsed: [] };
  }
  
  let associationsCreated = 0;
  const moleculesUsed = new Set<string>();
  
  for (const recette of recettesToEnrich) {
    // Sélectionner 3-5 molécules aléatoires pour cette recette
    const shuffled = [...gammeMolecules].sort(() => Math.random() - 0.5);
    const numMolecules = Math.min(shuffled.length, 3 + Math.floor(Math.random() * 3));
    
    for (let i = 0; i < numMolecules; i++) {
      const mol = shuffled[i];
      const proportion = 15 + Math.floor(Math.random() * 30); // 15-45%
      
      const success = await insertMoleculeRecetteAssociation(
        recette.id,
        mol.id,
        proportion,
        `Association ${gamme} auto-générée`
      );
      
      if (success) {
        associationsCreated++;
        moleculesUsed.add(mol.name);
      }
    }
  }
  
  return {
    recettesProcessed: recettesToEnrich.length,
    associationsCreated,
    moleculesUsed: Array.from(moleculesUsed),
  };
}



// ====================================================================
// SYNERGIES MOLÉCULAIRES (molecule_synergies)
// ====================================================================
// ============================================================================
// SYNERGIES MOLÉCULAIRES (molecule_synergies)
// ============================================================================

/**
 * Récupère toutes les synergies moléculaires avec les noms et familles chimiques des molécules
 */
