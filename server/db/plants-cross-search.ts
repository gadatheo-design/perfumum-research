import { type CrossSearchFilters, type CrossSearchResult } from "./plants-terroirs";
/**
 * Extracted from server/db/plants.ts
 * Module: Cross Search
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
  // Ghost Variety Plant Links
  ghostVarietyPlantLinks,
  GhostVarietyPlantLink,
  InsertGhostVarietyPlantLink,
  // Genomic Plant Links
  genomicPlantLinks,
  GenomicPlantLink,
  InsertGenomicPlantLink,
  // Genomic Molecule Links
  genomicMoleculeLinks,
  GenomicMoleculeLink,
  InsertGenomicMoleculeLink,
  // Ghost Varieties
  ghostVarieties,
  GhostVariety,
  InsertGhostVariety,
} from "../../drizzle/schema";
import { getDb } from './core';
import { getRawMaterialsByPlant, getRawMaterialsByTerroir } from './materials';
import { getTerroirSpecialties, getPlantTerroirSpecialties } from './terroirs';
import { getMoleculeById, getMoleculeRawMaterials, getMoleculeOrigins, getMoleculePlantSources, getPlantMoleculeSources } from './molecules';
import { getMoleculeIfraRestrictions } from './ifra';

import { ENV } from '../_core/env';
import { expandSearchQuery, getSynonyms, normalizeSearchTerm, categorizeOlfactiveTerm, getDictionaryStats } from '../../shared/olfactiveSynonyms';

export async function crossSearch(filters: CrossSearchFilters): Promise<CrossSearchResult> {
  const db = await getDb();
  if (!db) {
    return {
      terroirs: [],
      plants: [],
      molecules: [],
      relations: { plantTerroirs: [], plantMolecules: [] },
      stats: { totalTerroirs: 0, totalPlants: 0, totalMolecules: 0, totalPlantTerroirLinks: 0, totalPlantMoleculeLinks: 0 }
    };
  }

  // Récupérer toutes les données de base
  const allTerroirs = await db.select().from(terroirs);
  const allPlants = await db.select().from(plants);
  const allMolecules = await db.select().from(molecules);
  const allPlantTerroirs = await db.select().from(plantTerroirs);
  const allPlantMolecules = await db.select().from(plantMolecules);

  // Créer des maps pour les lookups rapides
  const terroirMap = new Map(allTerroirs.map(t => [t.id, t]));
  const plantMap = new Map(allPlants.map(p => [p.id, p]));
  const moleculeMap = new Map(allMolecules.map(m => [m.id, m]));

  // Filtrer les terroirs
  let filteredTerroirs = allTerroirs;
  if (filters.terroirIds?.length) {
    filteredTerroirs = filteredTerroirs.filter(t => filters.terroirIds!.includes(t.id));
  }
  if (filters.terroirCountries?.length) {
    filteredTerroirs = filteredTerroirs.filter(t => t.country && filters.terroirCountries!.includes(t.country));
  }
  if (filters.terroirClimates?.length) {
    filteredTerroirs = filteredTerroirs.filter(t => t.climateType && filters.terroirClimates!.includes(t.climateType));
  }

  // Filtrer les plantes
  let filteredPlants = allPlants;
  if (filters.plantIds?.length) {
    filteredPlants = filteredPlants.filter(p => filters.plantIds!.includes(p.id));
  }
  if (filters.plantCategories?.length) {
    filteredPlants = filteredPlants.filter(p => p.category && filters.plantCategories!.includes(p.category));
  }
  if (filters.plantFamilies?.length) {
    filteredPlants = filteredPlants.filter(p => p.family && filters.plantFamilies!.includes(p.family));
  }

  // Filtrer les molécules
  let filteredMolecules = allMolecules;
  if (filters.moleculeIds?.length) {
    filteredMolecules = filteredMolecules.filter(m => filters.moleculeIds!.includes(m.id));
  }
  if (filters.moleculeFamilies?.length) {
    filteredMolecules = filteredMolecules.filter(m => m.family && filters.moleculeFamilies!.includes(m.family));
  }
  if (filters.chemicalClasses?.length) {
    filteredMolecules = filteredMolecules.filter(m => m.chemicalClass && filters.chemicalClasses!.includes(m.chemicalClass));
  }

  // Recherche textuelle enrichie avec synonymes olfactifs
  if (filters.searchQuery) {
    const originalQuery = filters.searchQuery.toLowerCase();
    // Expansion de la requête avec synonymes olfactifs
    const expandedTerms = expandSearchQuery(filters.searchQuery).map(t => t.toLowerCase());
    
    // Fonction helper pour vérifier si un texte contient l'un des termes enrichis
    const matchesEnrichedQuery = (text: string | null | undefined): boolean => {
      if (!text) return false;
      const lowerText = text.toLowerCase();
      return expandedTerms.some(term => lowerText.includes(term));
    };
    
    filteredTerroirs = filteredTerroirs.filter(t => 
      matchesEnrichedQuery(t.name) ||
      matchesEnrichedQuery(t.country) ||
      matchesEnrichedQuery(t.region) ||
      matchesEnrichedQuery(t.subRegion) ||
      matchesEnrichedQuery(t.climateType)
    );
    filteredPlants = filteredPlants.filter(p => 
      matchesEnrichedQuery(p.name) ||
      matchesEnrichedQuery(p.latinName) ||
      matchesEnrichedQuery(p.olfactiveSignature) ||
      matchesEnrichedQuery(p.family) ||
      matchesEnrichedQuery(p.category)
    );
    filteredMolecules = filteredMolecules.filter(m => 
      matchesEnrichedQuery(m.name) ||
      matchesEnrichedQuery(m.olfactiveProfile) ||
      matchesEnrichedQuery(m.casNumber) ||
      matchesEnrichedQuery(m.family) ||
      matchesEnrichedQuery(m.chemicalClass)
    );
  }

  // Appliquer les filtres croisés si des filtres sont actifs
  const terroirIdsSet = new Set(filteredTerroirs.map(t => t.id));
  const plantIdsSet = new Set(filteredPlants.map(p => p.id));
  const moleculeIdsSet = new Set(filteredMolecules.map(m => m.id));

  // Si des filtres terroirs sont actifs, filtrer les plantes liées
  if (filters.terroirIds?.length || filters.terroirCountries?.length || filters.terroirClimates?.length) {
    const linkedPlantIds = new Set(
      allPlantTerroirs
        .filter(pt => terroirIdsSet.has(pt.terroirId))
        .map(pt => pt.plantId)
    );
    filteredPlants = filteredPlants.filter(p => linkedPlantIds.has(p.id));
    plantIdsSet.clear();
    filteredPlants.forEach(p => plantIdsSet.add(p.id));
  }

  // Si des filtres plantes sont actifs, filtrer les terroirs et molécules liés
  if (filters.plantIds?.length || filters.plantCategories?.length || filters.plantFamilies?.length) {
    const linkedTerroirIds = new Set(
      allPlantTerroirs
        .filter(pt => plantIdsSet.has(pt.plantId))
        .map(pt => pt.terroirId)
    );
    const linkedMoleculeIds = new Set(
      allPlantMolecules
        .filter(pm => plantIdsSet.has(pm.plantId))
        .map(pm => pm.moleculeId)
    );
    filteredTerroirs = filteredTerroirs.filter(t => linkedTerroirIds.has(t.id));
    filteredMolecules = filteredMolecules.filter(m => linkedMoleculeIds.has(m.id));
    terroirIdsSet.clear();
    moleculeIdsSet.clear();
    filteredTerroirs.forEach(t => terroirIdsSet.add(t.id));
    filteredMolecules.forEach(m => moleculeIdsSet.add(m.id));
  }

  // Si des filtres molécules sont actifs, filtrer les plantes liées
  if (filters.moleculeIds?.length || filters.moleculeFamilies?.length || filters.chemicalClasses?.length) {
    const linkedPlantIds = new Set(
      allPlantMolecules
        .filter(pm => moleculeIdsSet.has(pm.moleculeId))
        .map(pm => pm.plantId)
    );
    filteredPlants = filteredPlants.filter(p => linkedPlantIds.has(p.id));
    plantIdsSet.clear();
    filteredPlants.forEach(p => plantIdsSet.add(p.id));
  }

  // Calculer les compteurs pour chaque entité
  const terroirPlantCounts = new Map<number, number>();
  const terroirMoleculeCounts = new Map<number, Set<number>>();
  const plantTerroirCounts = new Map<number, number>();
  const plantMoleculeCounts = new Map<number, number>();
  const moleculePlantCounts = new Map<number, number>();

  // Compter les relations plante-terroir
  allPlantTerroirs.forEach(pt => {
    if (terroirIdsSet.has(pt.terroirId) && plantIdsSet.has(pt.plantId)) {
      terroirPlantCounts.set(pt.terroirId, (terroirPlantCounts.get(pt.terroirId) || 0) + 1);
      plantTerroirCounts.set(pt.plantId, (plantTerroirCounts.get(pt.plantId) || 0) + 1);
    }
  });

  // Compter les relations plante-molécule
  allPlantMolecules.forEach(pm => {
    if (plantIdsSet.has(pm.plantId) && moleculeIdsSet.has(pm.moleculeId)) {
      plantMoleculeCounts.set(pm.plantId, (plantMoleculeCounts.get(pm.plantId) || 0) + 1);
      moleculePlantCounts.set(pm.moleculeId, (moleculePlantCounts.get(pm.moleculeId) || 0) + 1);
      
      // Compter les molécules par terroir (via les plantes)
      allPlantTerroirs.filter(pt => pt.plantId === pm.plantId).forEach(pt => {
        if (terroirIdsSet.has(pt.terroirId)) {
          if (!terroirMoleculeCounts.has(pt.terroirId)) {
            terroirMoleculeCounts.set(pt.terroirId, new Set());
          }
          terroirMoleculeCounts.get(pt.terroirId)!.add(pm.moleculeId);
        }
      });
    }
  });

  // Construire les résultats
  const resultTerroirs = filteredTerroirs.map(t => ({
    id: t.id,
    name: t.name,
    country: t.country,
    region: t.region,
    climateType: t.climateType,
    plantCount: terroirPlantCounts.get(t.id) || 0,
    moleculeCount: terroirMoleculeCounts.get(t.id)?.size || 0,
  }));

  const resultPlants = filteredPlants.map(p => ({
    id: p.id,
    name: p.name,
    latinName: p.latinName,
    category: p.category,
    family: p.family,
    terroirCount: plantTerroirCounts.get(p.id) || 0,
    moleculeCount: plantMoleculeCounts.get(p.id) || 0,
  }));

  const resultMolecules = filteredMolecules.map(m => ({
    id: m.id,
    name: m.name,
    family: m.family,
    chemicalClass: m.chemicalClass,
    olfactiveProfile: m.olfactiveProfile,
    plantCount: moleculePlantCounts.get(m.id) || 0,
  }));

  // Construire les relations si demandé
  const relations = {
    plantTerroirs: filters.includeRelations 
      ? allPlantTerroirs
          .filter(pt => plantIdsSet.has(pt.plantId) && terroirIdsSet.has(pt.terroirId))
          .map(pt => ({
            plantId: pt.plantId,
            terroirId: pt.terroirId,
            plantName: plantMap.get(pt.plantId)?.name || '',
            terroirName: terroirMap.get(pt.terroirId)?.name || '',
          }))
      : [],
    plantMolecules: filters.includeRelations
      ? allPlantMolecules
          .filter(pm => plantIdsSet.has(pm.plantId) && moleculeIdsSet.has(pm.moleculeId))
          .map(pm => ({
            plantId: pm.plantId,
            moleculeId: pm.moleculeId,
            plantName: plantMap.get(pm.plantId)?.name || '',
            moleculeName: moleculeMap.get(pm.moleculeId)?.name || '',
            percentage: pm.percentage ? Number(pm.percentage) : undefined,
          }))
      : [],
  };

  return {
    terroirs: resultTerroirs,
    plants: resultPlants,
    molecules: resultMolecules,
    relations,
    stats: {
      totalTerroirs: resultTerroirs.length,
      totalPlants: resultPlants.length,
      totalMolecules: resultMolecules.length,
      totalPlantTerroirLinks: relations.plantTerroirs.length,
      totalPlantMoleculeLinks: relations.plantMolecules.length,
    },
  };
}

/**
 * Récupère les options de filtres disponibles pour la recherche croisée
 */

export async function getCrossSearchFilterOptions() {
  const db = await getDb();
  if (!db) {
    return {
      terroirCountries: [],
      terroirClimates: [],
      plantCategories: [],
      plantFamilies: [],
      moleculeFamilies: [],
      chemicalClasses: [],
    };
  }

  const allTerroirs = await db.select().from(terroirs);
  const allPlants = await db.select().from(plants);
  const allMolecules = await db.select().from(molecules);

  return {
    terroirCountries: Array.from(new Set(allTerroirs.map(t => t.country).filter(Boolean))).sort() as string[],
    terroirClimates: Array.from(new Set(allTerroirs.map(t => t.climateType).filter(Boolean))).sort() as string[],
    plantCategories: Array.from(new Set(allPlants.map(p => p.category).filter(Boolean))).sort() as string[],
    plantFamilies: Array.from(new Set(allPlants.map(p => p.family).filter(Boolean))).sort() as string[],
    moleculeFamilies: Array.from(new Set(allMolecules.map(m => m.family).filter(Boolean))).sort() as string[],
    chemicalClasses: Array.from(new Set(allMolecules.map(m => m.chemicalClass).filter(Boolean))).sort() as string[],
  };
}



// ====================================================================
// GENOMIC PLANT LINKS (Liaisons génomiques plantes - G1-G3)
// ====================================================================
// ============================================================================
// GENOMIC PLANT LINKS (Liaisons génomiques plantes - G1-G3)
// ============================================================================

/**
 * Get all genomic plant links
 */
