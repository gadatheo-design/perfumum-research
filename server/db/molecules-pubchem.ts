/**
 * Extracted from server/db/molecules.ts
 * Module: Pubchem
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
import { getMoleculeById } from './molecules';


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

export async function enrichMoleculeFromPubChem(
  moleculeId: number,
  pubchemData: {
    casNumber?: string;
    iupacName?: string;
    chemicalFormula?: string;
    molecularWeight?: number;
    pubchemCid?: number;
  }
) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  const updateData: Partial<Record<string, unknown>> = {};
  
  if (pubchemData.casNumber) updateData.casNumber = pubchemData.casNumber;
  if (pubchemData.iupacName) updateData.iupacName = pubchemData.iupacName;
  if (pubchemData.chemicalFormula) updateData.chemicalFormula = pubchemData.chemicalFormula;
  if (pubchemData.molecularWeight) updateData.molecularWeight = pubchemData.molecularWeight;
  
  // Ajouter une référence PubChem si CID fourni
  if (pubchemData.pubchemCid) {
    const molecule = await getMoleculeById(moleculeId);
    const existingRefs = molecule?.references || [];
    const pubchemRef = {
      type: 'pubchem' as const,
      title: `PubChem CID: ${pubchemData.pubchemCid}`,
      url: `https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemData.pubchemCid}`,
    };
    
    // Éviter les doublons
    if (!existingRefs.find(r => r.url === pubchemRef.url)) {
      updateData.references = [...existingRefs, pubchemRef];
    }
  }
  
  if (Object.keys(updateData).length > 0) {
    await db.update(molecules).set(updateData).where(eq(molecules.id, moleculeId));
  }
  
  return getMoleculeById(moleculeId);
}

/**
 * Récupère les molécules candidates pour enrichissement PubChem
 * (sans CAS number ou sans IUPAC name)
 */
export async function getMoleculesForPubChemEnrichment(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(molecules)
    .where(
      or(
        isNull(molecules.casNumber),
        isNull(molecules.iupacName)
      )
    )
    .orderBy(molecules.name)
    .limit(limit);
}

/**
 * Statistiques d'enrichissement des molécules
 */
export async function enrichMoleculeFromCOCONUTWithTranslation(moleculeId: number): Promise<{
  success: boolean;
  message: string;
  data?: {
    coconutId: string;
    npLikenessScore?: number;
    organisms?: { name: string; rank?: string }[];
  };
}> {
  const db = await getDb();
  if (!db) return { success: false, message: 'Database connection failed' };
  
  // Récupérer la molécule
  const [rows] = await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(
    `SELECT id, name, coconut_id FROM molecules WHERE id = ${moleculeId}`
  );
  
  const molecules = rows as unknown[];
  if (molecules.length === 0) {
    return { success: false, message: 'Molécule non trouvée' };
  }
  const molecule = molecules[0] as Record<string,unknown>;
  
  // Vérifier si déjà enrichie via COCONUT
  if (molecule.coconut_id) {
    return { success: false, message: 'Cette molécule est déjà enrichie via COCONUT' };
  }
  
  // Enrichir via COCONUT
  const result = await enrichMoleculeWithTranslationCOCONUT(molecule.name as string);
  
  if (!result.success || !result.coconut_id) {
    return { 
      success: false, 
      message: result.error || 'Molécule non trouvée dans COCONUT'
    };
  }
  
  // Mettre à jour la base de données
  const coconutId = result.coconut_id;
  const npScore = result.np_likeness_score || null;
  const organisms = result.organisms ? JSON.stringify(result.organisms).replace(/'/g, "''") : null;
  const citations = result.citations ? JSON.stringify(result.citations).replace(/'/g, "''") : null;
  await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(
    `UPDATE molecules SET 
      coconut_id = '${coconutId}',
      np_likeness_score = ${npScore !== null ? npScore : 'NULL'},
      coconut_organisms = ${organisms !== null ? `'${organisms}'` : 'NULL'},
      coconut_citations = ${citations !== null ? `'${citations}'` : 'NULL'},
      coconut_enriched_at = NOW()
    WHERE id = ${moleculeId}`
  );
  
  return {
    success: true,
    message: 'Molécule enrichie via COCONUT: ' + result.name,
    data: {
      coconutId: result.coconut_id,
      npLikenessScore: result.np_likeness_score,
      organisms: result.organisms,
    }
  };
}

/**
 * Récupère les molécules non enrichies pour COCONUT
 */
