// @ts-nocheck
/**
 * Module: graphs
 * Généré automatiquement depuis server/db.ts
 * Sections: NETWORK VISUALIZATION - ALL RELATIONSHIPS, RÉSEAU DE LIAISONS — Données pour le graphe interactif
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
import { ENV } from '../_core/env';
import { expandSearchQuery, getSynonyms, normalizeSearchTerm, categorizeOlfactiveTerm, getDictionaryStats } from '../../shared/olfactiveSynonyms';
import { expandWithScientificNames, getScientificDictionaryStats } from '../../shared/botanicalLatinNames';


// ====================================================================
// NETWORK VISUALIZATION - ALL RELATIONSHIPS
// ====================================================================
// ============================================================================
// NETWORK VISUALIZATION - ALL RELATIONSHIPS
// ============================================================================

export async function getNetworkRelationships() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Get all entities
  const allPrototypes = await db.select().from(prototypes);
  const allMolecules = await db.select().from(molecules);
  const allRecettes = await db.select().from(recettes);
  const allCivilisations = await db.select().from(civilisations);
  const allAccords = await db.select().from(accords);
  
  // Get all relationships
  // 1. Molecules → Chemical Families (via molecule_chemical_families junction table)
  const moleculeFamilyRelations = await db
    .select({
      moleculeId: molecules.id,
      moleculeName: molecules.name,
      familyId: chemicalFamilies.id,
      familyName: chemicalFamilies.name,
    })
    .from(moleculeChemicalFamilies)
    .innerJoin(molecules, eq(moleculeChemicalFamilies.moleculeId, molecules.id))
    .innerJoin(chemicalFamilies, eq(moleculeChemicalFamilies.chemicalFamilyId, chemicalFamilies.id));
  
  // 2. Prototypes → Chemical Families
  const prototypeChemicalFamilyRelations = await db
    .select({
      prototypeId: prototypes.id,
      prototypeName: prototypes.name,
      prototypeCode: prototypes.code,
      familyId: chemicalFamilies.id,
      familyName: chemicalFamilies.name,
    })
    .from(prototypeChemicalFamilies)
    .innerJoin(prototypes, eq(prototypeChemicalFamilies.prototypeId, prototypes.id))
    .innerJoin(chemicalFamilies, eq(prototypeChemicalFamilies.chemicalFamilyId, chemicalFamilies.id));
  
  // 3. Recettes → Families (via familyId)
  const recetteFamilyRelations = await db
    .select({
      recetteId: recettes.id,
      recetteName: recettes.name,
      familyId: families.id,
      familyName: families.name,
    })
    .from(recettes)
    .innerJoin(families, eq(recettes.familyId, families.id))
    .where(sql`${recettes.familyId} IS NOT NULL`);
  
  // 4. Recettes → Accords (via accordId)
  const recetteAccordRelations = await db
    .select({
      recetteId: recettes.id,
      recetteName: recettes.name,
      accordId: accords.id,
      accordName: accords.name,
    })
    .from(recettes)
    .innerJoin(accords, eq(recettes.accordId, accords.id))
    .where(sql`${recettes.accordId} IS NOT NULL`);
  
  // 5. Civilisations → Accords (via accord_civilisations)
  const civilisationAccordRelations = await db
    .select({
      civilisationId: civilisations.id,
      civilisationName: civilisations.name,
      accordId: accords.id,
      accordName: accords.name,
    })
    .from(accordCivilisations)
    .innerJoin(civilisations, eq(accordCivilisations.civilisationId, civilisations.id))
    .innerJoin(accords, eq(accordCivilisations.accordId, accords.id));
  
  // 6. Recettes → Civilisations (via civilisationId)
  const recetteCivilisationRelations = await db
    .select({
      recetteId: recettes.id,
      recetteName: recettes.name,
      civilisationId: civilisations.id,
      civilisationName: civilisations.name,
    })
    .from(recettes)
    .innerJoin(civilisations, eq(recettes.civilisationId, civilisations.id))
    .where(sql`${recettes.civilisationId} IS NOT NULL`);
  
  return {
    entities: {
      prototypes: allPrototypes,
      molecules: allMolecules,
      recettes: allRecettes,
      civilisations: allCivilisations,
      accords: allAccords,
    },
    relationships: {
      moleculeFamilies: moleculeFamilyRelations,
      prototypeChemicalFamilies: prototypeChemicalFamilyRelations,
      recetteFamilies: recetteFamilyRelations,
      recetteAccords: recetteAccordRelations,
      civilisationAccords: civilisationAccordRelations,
      recetteCivilisations: recetteCivilisationRelations,
    },
  };
}



// ====================================================================
// RÉSEAU DE LIAISONS — Données pour le graphe interactif
// ====================================================================
// ============================================================
// RÉSEAU DE LIAISONS — Données pour le graphe interactif
// ============================================================

export async function getNetworkData(params: {
  limit?: number;
  includeRecettes?: boolean;
  includeRawMaterials?: boolean;
  includeMolecules?: boolean;
}) {
  const dbRaw = await getDb();
  if (!dbRaw) return { nodes: { recettes: [], rawMaterials: [], molecules: [] }, edges: { recetteRawMaterials: [], recetteMolecules: [], plantMolecules: [] }, stats: { totalRecettes: 0, totalRawMaterials: 0, totalMolecules: 0, totalEdges: 0 } };
  const db = dbRaw;
  const limit = params.limit ?? 50;

  // Nœuds recettes (les plus récentes / importantes)
  const recettesData = params.includeRecettes !== false
    ? await db.select({
        id: recettes.id,
        name: recettes.name,
        category: recettes.category,
      }).from(recettes).limit(limit)
    : [];

  // Nœuds matières premières
  const rawMaterialsData = params.includeRawMaterials !== false
    ? await db.select({
        id: rawMaterials.id,
        name: rawMaterials.name,
        category: rawMaterials.category,
      }).from(rawMaterials).limit(limit)
    : [];

  // Nœuds molécules (top 50 les plus utilisées)
  const moleculesData = params.includeMolecules !== false
    ? await db.select({
        id: molecules.id,
        name: molecules.name,
        family: molecules.family,
      }).from(molecules).limit(50)
    : [];

  // Liaisons recette ↔ matière première (via recette_raw_materials)
  const rmLinks = params.includeRawMaterials !== false && params.includeRecettes !== false
    ? await db.select({
        recetteId: recetteRawMaterials.recetteId,
        rawMaterialId: recetteRawMaterials.rawMaterialId,
        role: recetteRawMaterials.role,
        percentage: recetteRawMaterials.percentage,
      }).from(recetteRawMaterials).limit(500)
    : [];

  // Liaisons recette ↔ molécule (via molecules_recettes)
  const molLinks = params.includeMolecules !== false && params.includeRecettes !== false
    ? await db.select({
        recetteId: moleculesRecettes.recetteId,
        moleculeId: moleculesRecettes.moleculeId,
        proportion: moleculesRecettes.proportion,
        role: moleculesRecettes.role,
      }).from(moleculesRecettes).limit(500)
    : [];

  // Liaisons matière première ↔ molécule (via raw_material_molecules si elle existe)
  // Pour l'instant, on utilise les liaisons plante-molécule comme proxy
  const plantMolLinks = params.includeRawMaterials !== false && params.includeMolecules !== false
    ? await db.select({
        plantId: plantMolecules.plantId,
        moleculeId: plantMolecules.moleculeId,
        percentage: plantMolecules.percentage,
      }).from(plantMolecules).limit(200)
    : [];

  return {
    nodes: {
      recettes: recettesData,
      rawMaterials: rawMaterialsData,
      molecules: moleculesData,
    },
    edges: {
      recetteRawMaterials: rmLinks,
      recetteMolecules: molLinks,
      plantMolecules: plantMolLinks,
    },
    stats: {
      totalRecettes: recettesData.length,
      totalRawMaterials: rawMaterialsData.length,
      totalMolecules: moleculesData.length,
      totalEdges: rmLinks.length + molLinks.length + plantMolLinks.length,
    },
  };
}


