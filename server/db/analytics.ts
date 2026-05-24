/**
 * Module: analytics
 * Généré automatiquement depuis server/db.ts
 * Sections: ADMIN FUNCTIONS, GLOBAL SEARCH, DASHBOARD STATISTICS (+3 autres)
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
import { parseMoleculeJsonFields } from './molecules';
import { ENV } from '../_core/env';
import { expandSearchQuery, getSynonyms, normalizeSearchTerm, categorizeOlfactiveTerm, getDictionaryStats } from '../../shared/olfactiveSynonyms';
import { expandWithScientificNames, getScientificDictionaryStats } from '../../shared/botanicalLatinNames';


// ====================================================================
// ADMIN FUNCTIONS
// ====================================================================
// ============================================================================
// ADMIN FUNCTIONS
// ============================================================================

export async function getAdminStats() {
  const db = await getDb();
  if (!db) return null;
  
  const { sql } = await import("drizzle-orm");
  
  const [prototypesCount] = await db.select({ count: sql<number>`cast(count(*) as unsigned)` }).from(prototypes);
  const [moleculesCount] = await db.select({ count: sql<number>`cast(count(*) as unsigned)` }).from(molecules);
  const [accordsCount] = await db.select({ count: sql<number>`cast(count(*) as unsigned)` }).from(accords);
  const [familiesCount] = await db.select({ count: sql<number>`cast(count(*) as unsigned)` }).from(families);
  const [recettesCount] = await db.select({ count: sql<number>`cast(count(*) as unsigned)` }).from(recettes);
  const [matieresCount] = await db.select({ count: sql<number>`cast(count(*) as unsigned)` }).from(laboratoire);
  
  return {
    prototypes: Number(prototypesCount?.count || 0),
    molecules: Number(moleculesCount?.count || 0),
    accords: Number(accordsCount?.count || 0),
    families: Number(familiesCount?.count || 0),
    recettes: Number(recettesCount?.count || 0),
    matieres: Number(matieresCount?.count || 0),
  };
}


export async function createMolecule(data: Record<string, unknown>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(molecules).values({
    name: String(data.name ?? ''),
    chemicalFormula: data.chemicalFormula ? String(data.chemicalFormula) : null,
    family: data.chemicalFamily ? String(data.chemicalFamily) : null,
    functionalEffect: data.functionalEffect ? String(data.functionalEffect) : null,
    olfactiveProfile: data.olfactiveProfile ? String(data.olfactiveProfile) : null,
    emotionalResonance: data.emotionalResonance ? String(data.emotionalResonance) : null,
    sourceOrigin: data.source ? String(data.source) : null,
    concentration: data.concentration ? String(data.concentration) : null,
    notes: data.notes ? String(data.notes) : null,
  });
  
  return result;
}



// ====================================================================
// GLOBAL SEARCH
// ====================================================================
// ============================================================================
// GLOBAL SEARCH
// ============================================================================

export interface GlobalSearchResult {
  type: 'molecule' | 'recette' | 'plant' | 'accord' | 'terpProfile' | 'finalRecipe' | 'civilisation' | 'prototype' | 'glossary' | 'timeline' | 'rawMaterial' | 'terroir';
  id: number;
  name: string;
  description?: string | null;
  metadata?: Record<string, any>;
  /** Score de pertinence (100 = correspondance exacte, 80 = synonyme, 60 = partiel) */
  relevanceScore?: number;
  /** Type de correspondance qui a déclenché le résultat */
  matchType?: 'exact' | 'synonym' | 'latin' | 'cas' | 'partial';
  /** Terme qui a matché (pour l'affichage) */
  matchedTerm?: string;
}

export async function globalSearch(query: string, limit: number = 50): Promise<{
  molecules: GlobalSearchResult[];
  recettes: GlobalSearchResult[];
  plants: GlobalSearchResult[];
  accords: GlobalSearchResult[];
  terpProfiles: GlobalSearchResult[];
  finalRecipes: GlobalSearchResult[];
  civilisations: GlobalSearchResult[];
  prototypes: GlobalSearchResult[];
  glossary: GlobalSearchResult[];
  rawMaterials: GlobalSearchResult[];
  terroirs: GlobalSearchResult[];
  total: number;
  searchEnrichment?: {
    originalQuery: string;
    expandedTerms: string[];
    synonymsUsed: number;
    queryCategory: { category: string; confidence: number };
    /** Synonymes olfactifs utilisés pour enrichir la recherche */
    olfactiveSynonyms: string[];
    /** Noms scientifiques (latins, CAS) utilisés */
    scientificNames: string[];
    /** Nombre total d'expansions de la requête */
    totalExpansions: number;
  };
}> {
  const db = await getDb();
  if (!db || !query.trim()) {
    return {
      molecules: [],
      recettes: [],
      plants: [],
      accords: [],
      terpProfiles: [],
      finalRecipes: [],
      civilisations: [],
      prototypes: [],
      glossary: [],
      rawMaterials: [],
      terroirs: [],
      total: 0
    };
  }

  // Enrichissement de la requête avec synonymes olfactifs ET scientifiques (noms latins, CAS)
  const olfactiveTerms = expandSearchQuery(query);
  const scientificTerms = expandWithScientificNames(query);
  
  // Combiner tous les termes enrichis (sans doublons)
  const allExpandedTerms = new Set([...olfactiveTerms, ...scientificTerms]);
  const expandedTerms = Array.from(allExpandedTerms);
  
  // Catégoriser les termes pour la pondération
  const originalTermLower = query.toLowerCase().trim();
  const synonymTerms = olfactiveTerms.filter(t => t.toLowerCase() !== originalTermLower);
  const latinTerms = scientificTerms.filter(t => 
    t.toLowerCase() !== originalTermLower && 
    !synonymTerms.map(s => s.toLowerCase()).includes(t.toLowerCase())
  );
  
  const searchPatterns = expandedTerms.map(term => `%${term}%`);
  const primarySearchTerm = `%${query}%`;
  const perCategoryLimit = Math.ceil(limit / 9);

  // Fonction helper pour construire les conditions de recherche enrichies
  const buildEnrichedSearchCondition = (columns: SQL[]) => {
    const conditions: ReturnType<typeof sql>[] = [];
    
    // Recherche principale (terme original) - priorité haute
    for (const col of columns) {
      conditions.push(sql`${col} LIKE ${primarySearchTerm}`);
    }
    
    // Recherche avec synonymes (termes enrichis) - priorité normale
    for (const pattern of searchPatterns) {
      if (pattern !== primarySearchTerm) {
        for (const col of columns) {
          conditions.push(sql`${col} LIKE ${pattern}`);
        }
      }
    }
    
    return sql.join(conditions, sql` OR `);
  };

  // Search in prototypes
  const prototypeResults = await db
    .select()
    .from(prototypes)
    .where(buildEnrichedSearchCondition([prototypes.name, prototypes.code, prototypes.conceptualAxis]))
    .limit(perCategoryLimit);

  // Search in molecules (enrichi avec famille et profil olfactif)
  const moleculeResults = await db
    .select()
    .from(molecules)
    .where(buildEnrichedSearchCondition([molecules.name, molecules.family, molecules.olfactiveProfile, molecules.casNumber]))
    .limit(perCategoryLimit);

  // Search in recipes
  const recipeResults = await db
    .select()
    .from(recettes)
    .where(buildEnrichedSearchCondition([recettes.name, recettes.category, recettes.formula]))
    .limit(perCategoryLimit);

  // Search in plants
  const plantResults = await db
    .select()
    .from(plants)
    .where(buildEnrichedSearchCondition([plants.name, plants.latinName, plants.family]))
    .limit(perCategoryLimit);

  // Search in accords (enrichi avec profil olfactif et notes)
  const accordResults = await db
    .select()
    .from(accords)
    .where(buildEnrichedSearchCondition([accords.name, accords.olfactiveProfile, accords.notes]))
    .limit(perCategoryLimit);

  // Search in terp profiles
  const terpProfileResults = await db
    .select()
    .from(terpProfiles)
    .where(buildEnrichedSearchCondition([terpProfiles.name, terpProfiles.profileId, terpProfiles.function]))
    .limit(perCategoryLimit);

  // Search in final recipes
  const finalRecipeResults = await db
    .select()
    .from(finalRecipes)
    .where(buildEnrichedSearchCondition([finalRecipes.name, finalRecipes.recipeId, finalRecipes.function]))
    .limit(perCategoryLimit);

  // Search in civilisations
  const civilisationResults = await db
    .select()
    .from(civilisations)
    .where(buildEnrichedSearchCondition([civilisations.name, civilisations.region, civilisations.longDescription]))
    .limit(perCategoryLimit);

  // Search in glossary
  const glossaryResults = await db
    .select()
    .from(glossary)
    .where(buildEnrichedSearchCondition([glossary.term, glossary.definition]))
    .limit(perCategoryLimit);
  // Search in raw materials
  const rawMaterialResults = await db
    .select()
    .from(rawMaterials)
    .where(buildEnrichedSearchCondition([rawMaterials.name, rawMaterials.olfactiveFamily, rawMaterials.originCountry]))
    .limit(perCategoryLimit);
  // Search in terroirs
  const terroirResults = await db
    .select()
    .from(terroirs)
    .where(buildEnrichedSearchCondition([terroirs.name, terroirs.country, terroirs.region]))
    .limit(perCategoryLimit);
  // Fonction pour calculer le score de pertinencee et le type de correspondance
  const calculateRelevance = (itemName: string, itemDescription?: string | null, additionalFields?: string[]): {
    score: number;
    matchType: 'exact' | 'synonym' | 'latin' | 'cas' | 'partial';
    matchedTerm: string;
  } => {
    const nameLower = itemName.toLowerCase();
    const descLower = (itemDescription || '').toLowerCase();
    const allFieldsLower = [nameLower, descLower, ...(additionalFields || []).map(f => (f || '').toLowerCase())];
    
    // Correspondance exacte avec le terme original (score 100)
    if (nameLower.includes(originalTermLower) || originalTermLower.includes(nameLower)) {
      return { score: 100, matchType: 'exact', matchedTerm: query };
    }
    
    // Correspondance dans la description avec terme original (score 95)
    if (descLower.includes(originalTermLower)) {
      return { score: 95, matchType: 'exact', matchedTerm: query };
    }
    
    // Correspondance avec synonyme olfactif (score 80)
    for (const syn of synonymTerms) {
      const synLower = syn.toLowerCase();
      if (allFieldsLower.some(f => f.includes(synLower))) {
        return { score: 80, matchType: 'synonym', matchedTerm: syn };
      }
    }
    
    // Correspondance avec nom latin (score 75)
    for (const latin of latinTerms) {
      const latinLower = latin.toLowerCase();
      if (allFieldsLower.some(f => f.includes(latinLower))) {
        // Vérifier si c'est un numéro CAS
        if (/^\d+-\d+-\d+$/.test(latin)) {
          return { score: 70, matchType: 'cas', matchedTerm: latin };
        }
        return { score: 75, matchType: 'latin', matchedTerm: latin };
      }
    }
    
    // Correspondance partielle (score 60)
    return { score: 60, matchType: 'partial', matchedTerm: query };
  };

  // Transform results avec scores de pertinence
  const transformedPrototypes: GlobalSearchResult[] = prototypeResults.map(p => {
    const relevance = calculateRelevance(p.name, p.conceptualAxis, [p.code || '']);
    return {
      type: 'prototype' as const,
      id: p.id,
      name: p.name,
      description: p.conceptualAxis,
      metadata: { code: p.code, emoji: p.emoji },
      relevanceScore: relevance.score,
      matchType: relevance.matchType,
      matchedTerm: relevance.matchedTerm,
    };
  });

  const transformedMolecules: GlobalSearchResult[] = moleculeResults.map(m => {
    const relevance = calculateRelevance(m.name, m.olfactiveProfile, [m.family || '', m.casNumber || '']);
    return {
      type: 'molecule' as const,
      id: m.id,
      name: m.name,
      description: m.olfactiveProfile,
      metadata: { family: m.family, chemicalFormula: m.chemicalFormula, casNumber: m.casNumber },
      relevanceScore: relevance.score,
      matchType: relevance.matchType,
      matchedTerm: relevance.matchedTerm,
    };
  });

  const transformedRecettes: GlobalSearchResult[] = recipeResults.map(r => {
    const relevance = calculateRelevance(r.name, r.description, [r.category || '']);
    return {
      type: 'recette' as const,
      id: r.id,
      name: r.name,
      description: r.description,
      metadata: { category: r.category, status: r.status },
      relevanceScore: relevance.score,
      matchType: relevance.matchType,
      matchedTerm: relevance.matchedTerm,
    };
  });

  const transformedPlants: GlobalSearchResult[] = plantResults.map(p => {
    const relevance = calculateRelevance(p.name, p.olfactiveSignature, [p.latinName || '', p.family || '']);
    return {
      type: 'plant' as const,
      id: p.id,
      name: p.name,
      description: p.olfactiveSignature,
      metadata: { latinName: p.latinName, family: p.family, origin: p.origin },
      relevanceScore: relevance.score,
      matchType: relevance.matchType,
      matchedTerm: relevance.matchedTerm,
    };
  });

  const transformedAccords: GlobalSearchResult[] = accordResults.map(a => {
    const relevance = calculateRelevance(a.name, a.olfactiveProfile, [a.texture || '']);
    return {
      type: 'accord' as const,
      id: a.id,
      name: a.name,
      description: a.olfactiveProfile,
      metadata: { texture: a.texture, emotionalResonance: a.emotionalResonance },
      relevanceScore: relevance.score,
      matchType: relevance.matchType,
      matchedTerm: relevance.matchedTerm,
    };
  });

  const transformedTerpProfiles: GlobalSearchResult[] = terpProfileResults.map(t => {
    const relevance = calculateRelevance(t.name, t.function, [t.profileId || '']);
    return {
      type: 'terpProfile' as const,
      id: t.id,
      name: t.name,
      description: t.function,
      metadata: { profileId: t.profileId, climaticAxis: t.climaticAxis, usage: t.usage },
      relevanceScore: relevance.score,
      matchType: relevance.matchType,
      matchedTerm: relevance.matchedTerm,
    };
  });

  const transformedFinalRecipes: GlobalSearchResult[] = finalRecipeResults.map(f => {
    const relevance = calculateRelevance(f.name, f.function, [f.recipeId || '']);
    return {
      type: 'finalRecipe' as const,
      id: f.id,
      name: f.name,
      description: f.function,
      metadata: { recipeId: f.recipeId, recipeType: f.recipeType, climaticAxis: f.climaticAxis },
      relevanceScore: relevance.score,
      matchType: relevance.matchType,
      matchedTerm: relevance.matchedTerm,
    };
  });

  const transformedCivilisations: GlobalSearchResult[] = civilisationResults.map(c => {
    const relevance = calculateRelevance(c.name, c.longDescription, [c.region || '']);
    return {
      type: 'civilisation' as const,
      id: c.id,
      name: c.name,
      description: c.longDescription,
      metadata: { region: c.region, temporality: c.temporality },
      relevanceScore: relevance.score,
      matchType: relevance.matchType,
      matchedTerm: relevance.matchedTerm,
    };
  });

  const transformedGlossary: GlobalSearchResult[] = glossaryResults.map(g => {
    const relevance = calculateRelevance(g.term, g.definition);
    return {
      type: 'glossary' as const,
      id: g.id,
      name: g.term,
      description: g.definition,
      metadata: { category: g.category },
      relevanceScore: relevance.score,
      matchType: relevance.matchType,
      matchedTerm: relevance.matchedTerm,
    };
  });

  const transformedRawMaterials: GlobalSearchResult[] = rawMaterialResults.map(r => {
    const relevance = calculateRelevance(r.name, r.olfactiveFamily, [r.originCountry || '', r.category || '']);
    return {
      type: 'rawMaterial' as const,
      id: r.id,
      name: r.name,
      description: r.olfactiveFamily || r.category || undefined,
      metadata: { category: r.category, origin: r.originCountry, materialId: r.materialId },
      relevanceScore: relevance.score,
      matchType: relevance.matchType,
      matchedTerm: relevance.matchedTerm,
    };
  });
  const transformedTerroirs: GlobalSearchResult[] = terroirResults.map(t => {
    const relevance = calculateRelevance(t.name, t.country, [t.region || '', t.reputation || '']);
    return {
      type: 'terroir' as const,
      id: t.id,
      name: t.name,
      description: [t.country, t.region].filter(Boolean).join(', ') || undefined,
      metadata: { country: t.country, region: t.region },
      relevanceScore: relevance.score,
      matchType: relevance.matchType,
      matchedTerm: relevance.matchedTerm,
    };
  });
  const total = 
    transformedPrototypes.length +
    transformedMolecules.length +
    transformedRecettes.length +
    transformedPlants.length +
    transformedAccords.length +
    transformedTerpProfiles.length +
    transformedFinalRecipes.length +
    transformedCivilisations.length +
    transformedGlossary.length +
    transformedRawMaterials.length +
    transformedTerroirs.length;

  // Trier chaque catégorie par score de pertinence (décroissant)
  const sortByRelevance = (a: GlobalSearchResult, b: GlobalSearchResult) => 
    (b.relevanceScore || 0) - (a.relevanceScore || 0);

  return {
    prototypes: transformedPrototypes.sort(sortByRelevance),
    molecules: transformedMolecules.sort(sortByRelevance),
    recettes: transformedRecettes.sort(sortByRelevance),
    plants: transformedPlants.sort(sortByRelevance),
    accords: transformedAccords.sort(sortByRelevance),
    terpProfiles: transformedTerpProfiles.sort(sortByRelevance),
    finalRecipes: transformedFinalRecipes.sort(sortByRelevance),
    civilisations: transformedCivilisations.sort(sortByRelevance),
    glossary: transformedGlossary.sort(sortByRelevance),
    rawMaterials: transformedRawMaterials.sort(sortByRelevance),
    terroirs: transformedTerroirs.sort(sortByRelevance),
    total,
    // Métadonnées d'enrichissement de la recherche
    searchEnrichment: {
      originalQuery: query,
      expandedTerms: expandedTerms,
      synonymsUsed: expandedTerms.length - 1, // -1 pour exclure le terme original
      queryCategory: categorizeOlfactiveTerm(query),
      // Nouvelles métadonnées pour l'affichage des synonymes
      olfactiveSynonyms: synonymTerms,
      scientificNames: latinTerms,
      totalExpansions: expandedTerms.length,
    }
  };
}





// ====================================================================
// DASHBOARD STATISTICS
// ====================================================================
// ============================================
// DASHBOARD STATISTICS
// ============================================

export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return { molecules: 0, recettes: 0, accords: 0, prototypes: 0, civilisations: 0, plants: 0, terroirs: 0, rawMaterials: 0 };
  
  const [moleculesCount] = await db.select({ count: sql<number>`count(*)` }).from(molecules);
  const [recettesCount] = await db.select({ count: sql<number>`count(*)` }).from(recettes);
  const [accordsCount] = await db.select({ count: sql<number>`count(*)` }).from(accords);
  const [prototypesCount] = await db.select({ count: sql<number>`count(*)` }).from(prototypes);
  const [civilisationsCount] = await db.select({ count: sql<number>`count(*)` }).from(civilisations);
  const [plantsCount] = await db.select({ count: sql<number>`count(*)` }).from(plants);
  const [terroirsCount] = await db.select({ count: sql<number>`count(*)` }).from(terroirs);
  const [rawMaterialsCount] = await db.select({ count: sql<number>`count(*)` }).from(rawMaterials);
  
  return {
    molecules: moleculesCount?.count || 0,
    recettes: recettesCount?.count || 0,
    accords: accordsCount?.count || 0,
    prototypes: prototypesCount?.count || 0,
    civilisations: civilisationsCount?.count || 0,
    plants: plantsCount?.count || 0,
    terroirs: terroirsCount?.count || 0,
    rawMaterials: rawMaterialsCount?.count || 0,
  };
}

export async function getRecipesByStatus() {
  const db = await getDb();
  if (!db) return [];
  
  const statusCounts = await db
    .select({
      status: recettes.status,
      count: sql<number>`count(*)`,
    })
    .from(recettes)
    .groupBy(recettes.status);
  
  return statusCounts;
}

export async function getRecipesByCategory() {
  const db = await getDb();
  if (!db) return [];
  
  const categoryCounts = await db
    .select({
      category: recettes.category,
      count: sql<number>`count(*)`,
    })
    .from(recettes)
    .where(sql`${recettes.category} IS NOT NULL`)
    .groupBy(recettes.category);
  
  return categoryCounts;
}

export async function getMoleculesFamilyStats() {
  const db = await getDb();
  if (!db) return [];
  
  const familyCounts = await db
    .select({
      family: molecules.family,
      count: sql<number>`count(*)`,
    })
    .from(molecules)
    .where(sql`${molecules.family} IS NOT NULL`)
    .groupBy(molecules.family);
  
  return familyCounts;
}

export async function getGlobalMoleculeStats() {
  const db = await getDb();
  if (!db) return {
    totalMolecules: 0,
    totalRecettes: 0,
    totalFamilies: 0,
    totalPrototypes: 0,
    familyDistribution: [],
    gammeDistribution: [],
  };
  
  // Get total counts
  const [moleculesCount] = await db.select({ count: sql<number>`count(*)` }).from(molecules);
  const [recettesCount] = await db.select({ count: sql<number>`count(*)` }).from(recettes);
  const [prototypesCount] = await db.select({ count: sql<number>`count(*)` }).from(prototypes);
  
  // Get unique families count
  const uniqueFamilies = await db
    .select({ family: molecules.family })
    .from(molecules)
    .where(sql`${molecules.family} IS NOT NULL`)
    .groupBy(molecules.family);
  
  // Get family distribution
  const familyDistribution = await db
    .select({
      family: molecules.family,
      count: sql<number>`count(*)`,
    })
    .from(molecules)
    .where(sql`${molecules.family} IS NOT NULL`)
    .groupBy(molecules.family);
  
  // Get gamme distribution (based on olfactive profile keywords)
  const allMolecules = await db.select().from(molecules);
  const gammeDistribution: { gamme: string; count: number }[] = [];
  const gammeCounts: Record<string, number> = {};
  
  allMolecules.forEach(m => {
    if (m.olfactiveProfile) {
      const profile = m.olfactiveProfile.toLowerCase();
      if (profile.includes('pétrichor') || profile.includes('terreux') || profile.includes('géosmine')) {
        gammeCounts['pétrichor'] = (gammeCounts['pétrichor'] || 0) + 1;
      } else if (profile.includes('volcanique') || profile.includes('soufré') || profile.includes('fumé')) {
        gammeCounts['volcanique'] = (gammeCounts['volcanique'] || 0) + 1;
      } else if (profile.includes('glaciaire') || profile.includes('glacé') || profile.includes('frais')) {
        gammeCounts['glaciaire'] = (gammeCounts['glaciaire'] || 0) + 1;
      } else if (profile.includes('bio') || profile.includes('laboratoire')) {
        gammeCounts['bio-lab'] = (gammeCounts['bio-lab'] || 0) + 1;
      } else if (profile.includes('mossi')) {
        gammeCounts['mossi'] = (gammeCounts['mossi'] || 0) + 1;
      }
    }
  });
  
  Object.entries(gammeCounts).forEach(([gamme, count]) => {
    gammeDistribution.push({ gamme, count });
  });
  
  return {
    totalMolecules: moleculesCount.count,
    totalRecettes: recettesCount.count,
    totalFamilies: uniqueFamilies.length,
    totalPrototypes: prototypesCount.count,
    familyDistribution,
    gammeDistribution,
  };
}

export async function getMoleculeTimelineData() {
  const db = await getDb();
  if (!db) return [];
  
  // Get all molecules with creation dates
  const allMolecules = await db
    .select({
      id: molecules.id,
      name: molecules.name,
      createdAt: molecules.createdAt,
      olfactiveProfile: molecules.olfactiveProfile,
      family: molecules.family,
    })
    .from(molecules)
    .orderBy(molecules.createdAt);
  
  // Group by month
  const monthlyData: Record<string, { count: number; cumulative: number; molecules: { id: number; name: string; family: string | null }[] }> = {};
  let cumulative = 0;
  
  allMolecules.forEach(molecule => {
    if (!molecule.createdAt) return;
    
    const date = new Date(molecule.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { count: 0, cumulative: 0, molecules: [] };
    }
    
    monthlyData[monthKey].count++;
    cumulative++;
    monthlyData[monthKey].cumulative = cumulative;
    monthlyData[monthKey].molecules.push({
      id: molecule.id ?? 0,
      name: molecule.name ?? '',
      family: molecule.family,
    });
  });
  
  // Convert to array and sort by date
  const timelineData = Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      count: data.count,
      cumulative: data.cumulative,
      molecules: data.molecules,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
  
  return timelineData;
}

export async function getRecentActivity(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  
  const recentRecettes = await db
    .select()
    .from(recettes)
    .orderBy(sql`${recettes.createdAt} DESC`)
    .limit(limit);
  
  return recentRecettes;
}


// ====================================================================
// SIMILARITY & RECOMMENDATIONS
// ====================================================================
// ============================================================================
// SIMILARITY & RECOMMENDATIONS
// ============================================================================

/**
 * Calcule la distance euclidienne entre deux profils radar
 * Plus la distance est petite, plus les profils sont similaires
 */
function calculateRadarSimilarity(mol1: Molecule, mol2: Molecule): number {
  const axes = [
    'radarIntensity',
    'radarFreshness',
    'radarWarmth',
    'radarSweetness',
    'radarSpiciness',
    'radarEarthiness',
  ] as const;

  let sumSquares = 0;
  for (const axis of axes) {
    const val1 = (mol1[axis] as number) || 50;
    const val2 = (mol2[axis] as number) || 50;
    sumSquares += Math.pow(val1 - val2, 2);
  }

  const distance = Math.sqrt(sumSquares);
  // Normaliser sur 100 (distance max = sqrt(6 * 100^2) ≈ 245)
  // Score de similarité : 100 = identique, 0 = très différent
  return Math.max(0, 100 - (distance / 245) * 100);
}

export async function getSimilarMolecules(moleculeId: number, limit: number = 3) {
  const db = await getDb();
  if (!db) return [];

  // Récupérer la molécule de référence
  const reference = await db
    .select()
    .from(molecules)
    .where(eq(molecules.id, moleculeId))
    .limit(1);

  if (!reference[0]) return [];

  // Récupérer toutes les autres molécules avec profils radar
  const allMolecules = await db
    .select()
    .from(molecules)
    .where(sql`${molecules.radarIntensity} IS NOT NULL`);

  // Calculer similarité pour chaque molécule
  const withSimilarity = allMolecules
    .filter((mol) => mol.id !== moleculeId)
    .map((mol) => ({
      ...parseMoleculeJsonFields(mol as Record<string, unknown>),
      similarityScore: calculateRadarSimilarity(reference[0], mol),
    }))
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);

  return withSimilarity;
}

export async function getMoleculeUsageStats(moleculeId: number) {
  const db = await getDb();
  if (!db) return { recettesCount: 0, accordsCount: 0 };

  // TODO: implémenter quand table de liaison molecules_recettes sera créée
  // Pour l'instant retourner 0
  return {
    recettesCount: 0,
    accordsCount: 0,
  };
}



// ====================================================================
// ANALYTICS & STATISTICS
// ====================================================================
// ============================================================================
// ANALYTICS & STATISTICS
// ============================================================================

/**
 * Track an analytics event
 */
export async function trackEvent(
  eventType: 'molecule_view' | 'recipe_view' | 'terpene_view' | 'pdf_export' | 'favorite_add' | 'favorite_remove' | 'search_query',
  entityType?: string,
  entityId?: number,
  userId?: number,
  metadata?: Record<string, any>
) {
  const db = await getDb();
  if (!db) return;

  await db.insert(analyticsEvents).values({
    eventType,
    entityType: entityType || null,
    entityId: entityId || null,
    userId: userId || null,
    metadata: metadata ? JSON.stringify(metadata) : null,
  });
}

/**
 * Get most viewed molecules in the last N days
 */
export async function getMostViewedMolecules(days: number = 30, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const views = await db
    .select({
      entityId: analyticsEvents.entityId,
      viewCount: sql<number>`COUNT(*)`.as('view_count'),
    })
    .from(analyticsEvents)
    .where(
      and(
        eq(analyticsEvents.eventType, 'molecule_view'),
        gte(analyticsEvents.createdAt, cutoffDate)
      )
    )
    .groupBy(analyticsEvents.entityId)
    .orderBy(desc(sql`view_count`))
    .limit(limit);

  // Fetch molecule details
  const moleculeIds = views.map(v => v.entityId).filter((id): id is number => id !== null);
  if (moleculeIds.length === 0) return [];

  const moleculeDetails = await db
    .select()
    .from(molecules)
    .where(inArray(molecules.id, moleculeIds));

  return views.map(v => ({
    ...moleculeDetails.find(m => m.id === v.entityId),
    viewCount: v.viewCount,
  })).filter(m => m.id !== undefined);
}

/**
 * Get most viewed recipes in the last N days
 */
export async function getMostViewedRecipes(days: number = 30, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const views = await db
    .select({
      entityId: analyticsEvents.entityId,
      viewCount: sql<number>`COUNT(*)`.as('view_count'),
    })
    .from(analyticsEvents)
    .where(
      and(
        eq(analyticsEvents.eventType, 'recipe_view'),
        gte(analyticsEvents.createdAt, cutoffDate)
      )
    )
    .groupBy(analyticsEvents.entityId)
    .orderBy(desc(sql`view_count`))
    .limit(limit);

  const recipeIds = views.map(v => v.entityId).filter((id): id is number => id !== null);
  if (recipeIds.length === 0) return [];

  const recipeDetails = await db
    .select()
    .from(recettes)
    .where(inArray(recettes.id, recipeIds));

  return views.map(v => ({
    ...recipeDetails.find(r => r.id === v.entityId),
    viewCount: v.viewCount,
  })).filter(r => r.id !== undefined);
}

/**
 * Get activity timeline (events per day for the last N days)
 */
export async function getActivityTimeline(days: number = 30) {
  const db = await getDb();
  if (!db) return [];

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const timeline = await db
    .select({
      date: sql<string>`DATE(created_at)`.as('date'),
      eventCount: sql<number>`COUNT(*)`.as('event_count'),
    })
    .from(analyticsEvents)
    .where(gte(analyticsEvents.createdAt, cutoffDate))
    .groupBy(sql`DATE(created_at)`)
    .orderBy(sql`DATE(created_at)`);

  return timeline;
}

/**
 * Get popular search queries
 */
export async function getPopularSearches(days: number = 30, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const searches = await db
    .select({
      query: analyticsEvents.metadata,
      searchCount: sql<number>`COUNT(*)`.as('search_count'),
    })
    .from(analyticsEvents)
    .where(
      and(
        eq(analyticsEvents.eventType, 'search_query'),
        gte(analyticsEvents.createdAt, cutoffDate)
      )
    )
    .groupBy(analyticsEvents.metadata)
    .orderBy(desc(sql`search_count`))
    .limit(limit);

  return searches.map(s => ({
    query: s.query ? JSON.parse(s.query).query : 'Unknown',
    count: s.searchCount,
  }));
}

/**
 * Get analytics dashboard statistics
 */
export async function getAnalyticsDashboardStats(days: number = 30) {
  const db = await getDb();
  if (!db) return {
    totalViews: 0,
    totalExports: 0,
    totalSearches: 0,
    totalFavorites: 0,
  };

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const [views, exports, searches, favorites] = await Promise.all([
    db
      .select({ count: sql<number>`COUNT(*)` })
      .from(analyticsEvents)
      .where(
        and(
          inArray(analyticsEvents.eventType, ['molecule_view', 'recipe_view', 'terpene_view']),
          gte(analyticsEvents.createdAt, cutoffDate)
        )
      ),
    db
      .select({ count: sql<number>`COUNT(*)` })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.eventType, 'pdf_export'),
          gte(analyticsEvents.createdAt, cutoffDate)
        )
      ),
    db
      .select({ count: sql<number>`COUNT(*)` })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.eventType, 'search_query'),
          gte(analyticsEvents.createdAt, cutoffDate)
        )
      ),
    db
      .select({ count: sql<number>`COUNT(*)` })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.eventType, 'favorite_add'),
          gte(analyticsEvents.createdAt, cutoffDate)
        )
      ),
  ]);

  return {
    totalViews: views[0]?.count || 0,
    totalExports: exports[0]?.count || 0,
    totalSearches: searches[0]?.count || 0,
    totalFavorites: favorites[0]?.count || 0,
  };
}


// ====================================================================
// NAVIGATION FEATURED ITEMS — Données dynamiques pour le MegaMenu
// ====================================================================
// ============================================================================
// NAVIGATION FEATURED ITEMS — Données dynamiques pour le MegaMenu
// ============================================================================

/**
 * Retourne les données dynamiques pour les featured items du MegaMenu :
 * - Dernière recette modifiée (section Données)
 * - Molécule la plus liée (section Données)
 * - Matière première la plus récente (section Données)
 * - Dernière plante ajoutée (section Données)
 * - Terroir le plus récent (section Données)
 * - Statistiques globales (pour les compteurs)
 */
export async function getMegaMenuFeaturedItems() {
  const db = await getDb();
  if (!db) {
    return {
      latestRecette: null,
      mostLinkedMolecule: null,
      latestRawMaterial: null,
      latestPlant: null,
      latestTerroir: null,
      stats: { molecules: 0, recettes: 0, plants: 0, rawMaterials: 0, terroirs: 0 },
    };
  }

  // Dernière recette modifiée
  const [latestRecette] = await db
    .select({ id: recettes.id, name: recettes.name, category: recettes.category, updatedAt: recettes.updatedAt })
    .from(recettes)
    .orderBy(desc(recettes.updatedAt))
    .limit(1);

  // Molécule la plus liée (dans molecules_recettes)
  const topMoleculeLinks = await db
    .select({
      moleculeId: moleculesRecettes.moleculeId,
      linkCount: sql<number>`COUNT(*) AS link_count`,
    })
    .from(moleculesRecettes)
    .groupBy(moleculesRecettes.moleculeId)
    .orderBy(desc(sql`link_count`))
    .limit(1);

  let mostLinkedMolecule: { id: number; name: string; family: string | null; linkCount: number } | null = null;
  if (topMoleculeLinks.length > 0) {
    const [mol] = await db
      .select({ id: molecules.id, name: molecules.name, family: molecules.family })
      .from(molecules)
      .where(eq(molecules.id, topMoleculeLinks[0].moleculeId))
      .limit(1);
    if (mol) {
      mostLinkedMolecule = { ...mol, linkCount: topMoleculeLinks[0].linkCount };
    }
  }

  // Matière première la plus récente
  const [latestRawMaterial] = await db
    .select({ id: rawMaterials.id, name: rawMaterials.name, category: rawMaterials.category, updatedAt: rawMaterials.updatedAt })
    .from(rawMaterials)
    .orderBy(desc(rawMaterials.updatedAt))
    .limit(1);

  // Dernière plante ajoutée
  const [latestPlant] = await db
    .select({ id: plants.id, name: plants.name, latinName: sql<string>`COALESCE(${plants.latinName}, '')`, createdAt: plants.createdAt })
    .from(plants)
    .orderBy(desc(plants.createdAt))
    .limit(1);

  // Terroir le plus récent
  const [latestTerroir] = await db
    .select({ id: terroirs.id, name: terroirs.name, country: terroirs.country, createdAt: terroirs.createdAt })
    .from(terroirs)
    .orderBy(desc(terroirs.createdAt))
    .limit(1);

  // Statistiques globales (compteurs)
  const [molCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(molecules);
  const [recCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(recettes);
  const [plantCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(plants);
  const [rmCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(rawMaterials);
  const [terCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(terroirs);

  return {
    latestRecette: latestRecette || null,
    mostLinkedMolecule,
    latestRawMaterial: latestRawMaterial || null,
    latestPlant: latestPlant || null,
    latestTerroir: latestTerroir || null,
    stats: {
      molecules: molCount?.count || 0,
      recettes: recCount?.count || 0,
      plants: plantCount?.count || 0,
      rawMaterials: rmCount?.count || 0,
      terroirs: terCount?.count || 0,
    },
  };
}


// ============================================================================
// KÖPPEN CLIMATE STATISTICS
// ============================================================================

export async function getKoppenZoneStats() {
  const db = await getDb();
  if (!db) return [];

  const rows = await db
    .select({
      zone: plants.koppenZone,
      count: sql<number>`COUNT(*)`,
    })
    .from(plants)
    .where(
      and(
        isNotNull(plants.koppenZone),
        sql`${plants.koppenZone} != ''`
      )
    )
    .groupBy(plants.koppenZone)
    .orderBy(desc(sql`COUNT(*)`));

  const zoneMap = new Map<string, number>();
  for (const row of rows) {
    if (!row.zone) continue;
    const zones = row.zone.split(/[,;]\s*/);
    for (const z of zones) {
      const trimmed = z.trim();
      if (trimmed) {
        zoneMap.set(trimmed, (zoneMap.get(trimmed) || 0) + Number(row.count));
      }
    }
  }

  return Array.from(zoneMap.entries())
    .map(([zone, count]) => ({ zone, count }))
    .sort((a, b) => b.count - a.count);
}
