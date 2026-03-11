/**
 * Module: accords
 * Généré automatiquement depuis server/db.ts
 * Sections: ACCORDS, EXPERIMENTAL ACCORDS, SYNERGIES QUERIES (+5 autres)
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
// ACCORDS
// ====================================================================
// ============================================================================
// ACCORDS
// ============================================================================

export async function getAllAccords(): Promise<Accord[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(accords);
}

export async function getAccordById(id: number): Promise<Accord | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(accords).where(eq(accords.id, id)).limit(1);
  return result[0];
}


// ====================================================================
// EXPERIMENTAL ACCORDS
// ====================================================================
// ============================================================================
// EXPERIMENTAL ACCORDS
// ============================================================================

export async function getExperimentalAccordsByType(isExtreme: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(experimentalAccords)
    .where(eq(experimentalAccords.isExtreme, isExtreme))
    .orderBy(experimentalAccords.number);
}

export async function getAllExperimentalAccords() {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(experimentalAccords)
    .orderBy(experimentalAccords.isExtreme, experimentalAccords.number);
}


// ABSORBE profiles
export async function getAbsorbeProfiles() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(absorbeProfiles);
}

export async function getAbsorbeProfileByPrototypeId(prototypeId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const results = await db
    .select()
    .from(absorbeProfiles)
    .where(eq(absorbeProfiles.prototypeId, prototypeId));
  return results[0] || null;
}



// ====================================================================
// SYNERGIES QUERIES
// ====================================================================
// ============================================================================
// SYNERGIES QUERIES
// ============================================================================

export async function getAllSynergies() {
  const db = await getDb();
  if (!db) return [];
  
  const allSynergies = await db
    .select({
      id: synergies.id,
      name: synergies.name,
      type: synergies.type,
      effet: synergies.effet,
      notes: synergies.notes,
      tabacId: synergies.tabacId,
      tabacName: tabacs.name,
      moleculeId: synergies.moleculeId,
      moleculeName: molecules.name,
      familleId: synergies.familleId,
      familleName: families.name,
      createdAt: synergies.createdAt,
    })
    .from(synergies)
    .leftJoin(tabacs, eq(synergies.tabacId, tabacs.id))
    .leftJoin(molecules, eq(synergies.moleculeId, molecules.id))
    .leftJoin(families, eq(synergies.familleId, families.id))
    .orderBy(sql`${synergies.createdAt} DESC`);
  
  return allSynergies;
}

export async function getSynergiesByType(type: string) {
  const db = await getDb();
  if (!db) return [];
  
  const synergiesByType = await db
    .select({
      id: synergies.id,
      name: synergies.name,
      type: synergies.type,
      effet: synergies.effet,
      notes: synergies.notes,
      tabacId: synergies.tabacId,
      tabacName: tabacs.name,
      moleculeId: synergies.moleculeId,
      moleculeName: molecules.name,
      familleId: synergies.familleId,
      familleName: families.name,
    })
    .from(synergies)
    .leftJoin(tabacs, eq(synergies.tabacId, tabacs.id))
    .leftJoin(molecules, eq(synergies.moleculeId, molecules.id))
    .leftJoin(families, eq(synergies.familleId, families.id))
    // @ts-expect-error -- type is a string enum; runtime value validated by caller
    .where(eq(synergies.type, type));
  
  return synergiesByType;
}

export async function getSynergiesStats() {
  const db = await getDb();
  if (!db) return { total: 0, byType: [] };
  
  const total = await db
    .select({ count: sql<number>`count(*)` })
    .from(synergies);
  
  const byType = await db
    .select({
      type: synergies.type,
      count: sql<number>`count(*)`,
    })
    .from(synergies)
    .groupBy(synergies.type);
  
  return {
    total: total[0]?.count || 0,
    byType,
  };
}



// ====================================================================
// TERPENE SYNERGIES
// ====================================================================
// ============================================================================
// TERPENE SYNERGIES
// ============================================================================

export async function getAllTerpeneSynergies(): Promise<TerpeneSynergy[]> {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(terpeneSynergies)
    .orderBy(terpeneSynergies.terpene1Id, terpeneSynergies.terpene2Id);
}

export async function getTerpeneSynergyByPair(terpene1Id: number, terpene2Id: number): Promise<TerpeneSynergy | null> {
  const db = await getDb();
  if (!db) return null;
  
  // Essayer dans les deux sens (t1-t2 ou t2-t1)
  const result = await db
    .select()
    .from(terpeneSynergies)
    .where(
      or(
        and(
          eq(terpeneSynergies.terpene1Id, terpene1Id),
          eq(terpeneSynergies.terpene2Id, terpene2Id)
        ),
        and(
          eq(terpeneSynergies.terpene1Id, terpene2Id),
          eq(terpeneSynergies.terpene2Id, terpene1Id)
        )
      )
    )
    .limit(1);
  
  return result[0] || null;
}



// ====================================================================
// SYNERGIES GRAPH DATA
// ====================================================================
// ============================================================================
// SYNERGIES GRAPH DATA
// ============================================================================

export async function getSynergyById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select({
      id: synergies.id,
      name: synergies.name,
      type: synergies.type,
      effet: synergies.effet,
      notes: synergies.notes,
      tabacId: synergies.tabacId,
      tabacName: tabacs.name,
      moleculeId: synergies.moleculeId,
      moleculeName: molecules.name,
      familleId: synergies.familleId,
      familleName: families.name,
      createdAt: synergies.createdAt,
    })
    .from(synergies)
    .leftJoin(tabacs, eq(synergies.tabacId, tabacs.id))
    .leftJoin(molecules, eq(synergies.moleculeId, molecules.id))
    .leftJoin(families, eq(synergies.familleId, families.id))
    .where(eq(synergies.id, id))
    .limit(1);
  
  return result[0];
}

export async function getSynergiesGraphData() {
  const db = await getDb();
  if (!db) return { nodes: [], edges: [] };
  
  // Récupérer toutes les synergies avec leurs relations
  const allSynergies = await getAllSynergies();
  
  // Créer les nœuds et arêtes pour le graphe
  const nodesMap = new Map<string, { id: string; name: string; type: 'molecule' | 'tabac' | 'famille' }>();
  const edges: Array<{ source: string; target: string; synergyType: string; synergyName: string; effet: string | null }> = [];
  
  for (const synergy of allSynergies) {
    // Ajouter les nœuds (molécule, tabac, famille)
    if (synergy.moleculeId && synergy.moleculeName) {
      nodesMap.set(`mol-${synergy.moleculeId}`, { 
        id: `mol-${synergy.moleculeId}`, 
        name: synergy.moleculeName, 
        type: 'molecule' 
      });
    }
    
    if (synergy.tabacId && synergy.tabacName) {
      nodesMap.set(`tab-${synergy.tabacId}`, { 
        id: `tab-${synergy.tabacId}`, 
        name: synergy.tabacName, 
        type: 'tabac' 
      });
    }
    
    if (synergy.familleId && synergy.familleName) {
      nodesMap.set(`fam-${synergy.familleId}`, { 
        id: `fam-${synergy.familleId}`, 
        name: synergy.familleName, 
        type: 'famille' 
      });
    }
    
    // Créer les arêtes entre les nœuds
    if (synergy.moleculeId && synergy.tabacId) {
      edges.push({
        source: `mol-${synergy.moleculeId}`,
        target: `tab-${synergy.tabacId}`,
        synergyType: synergy.type,
        synergyName: synergy.name,
        effet: synergy.effet
      });
    }
    
    if (synergy.moleculeId && synergy.familleId) {
      edges.push({
        source: `mol-${synergy.moleculeId}`,
        target: `fam-${synergy.familleId}`,
        synergyType: synergy.type,
        synergyName: synergy.name,
        effet: synergy.effet
      });
    }
    
    if (synergy.tabacId && synergy.familleId) {
      edges.push({
        source: `tab-${synergy.tabacId}`,
        target: `fam-${synergy.familleId}`,
        synergyType: synergy.type,
        synergyName: synergy.name,
        effet: synergy.effet
      });
    }
  }
  
  return {
    nodes: Array.from(nodesMap.values()),
    edges
  };
}



// ====================================================================
// SUGGESTIONS AUTOMATIQUES DE SYNERGIES
// ====================================================================
// ============================================================================
// SUGGESTIONS AUTOMATIQUES DE SYNERGIES
// ============================================================================

/**
 * Calcule la distance euclidienne entre deux profils radar (6 dimensions)
 * Retourne une valeur entre 0 (identiques) et ~245 (opposés complets)
 */
function calculateRadarDistance(mol1: Record<string, any>, mol2: Record<string, any>): number {
  const sumSquares = 
    Math.pow((mol1.radarIntensity || 0) - (mol2.radarIntensity || 0), 2) +
    Math.pow((mol1.radarFreshness || 0) - (mol2.radarFreshness || 0), 2) +
    Math.pow((mol1.radarWarmth || 0) - (mol2.radarWarmth || 0), 2) +
    Math.pow((mol1.radarSweetness || 0) - (mol2.radarSweetness || 0), 2) +
    Math.pow((mol1.radarSpiciness || 0) - (mol2.radarSpiciness || 0), 2) +
    Math.pow((mol1.radarEarthiness || 0) - (mol2.radarEarthiness || 0), 2);
  
  return Math.sqrt(sumSquares);
}

/**
 * Convertit la distance euclidienne en score de similarité (0-100%)
 * Distance 0 = 100% similaire
 * Distance 245 (max théorique) = 0% similaire
 */
function distanceToSimilarity(distance: number): number {
  const maxDistance = Math.sqrt(6 * Math.pow(100, 2)); // ~245
  return Math.max(0, Math.min(100, 100 * (1 - distance / maxDistance)));
}

/**
 * Génère des suggestions de synergies potentielles basées sur la similarité des profils radar
 * @param minSimilarity Seuil minimum de similarité (0-100), défaut 70%
 * @param limit Nombre maximum de suggestions, défaut 10
 */
export async function getSynergySuggestions(minSimilarity: number = 70, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer toutes les molécules avec profils radar complets
  const allMolecules = await db
    .select()
    .from(molecules)
    .where(
      and(
        not(isNull(molecules.radarIntensity)),
        not(isNull(molecules.radarFreshness)),
        not(isNull(molecules.radarWarmth)),
        not(isNull(molecules.radarSweetness)),
        not(isNull(molecules.radarSpiciness)),
        not(isNull(molecules.radarEarthiness))
      )
    );
  
  if (allMolecules.length < 2) return [];
  
  // Calculer toutes les paires possibles avec leur similarité
  const suggestions: Array<{
    molecule1Id: number;
    molecule1Name: string;
    molecule2Id: number;
    molecule2Name: string;
    similarity: number;
    distance: number;
    radarProfile1: Record<string, number | null>;
    radarProfile2: Record<string, number | null>;
    explanation: string;
  }> = [];
  
  for (let i = 0; i < allMolecules.length; i++) {
    for (let j = i + 1; j < allMolecules.length; j++) {
      const mol1 = allMolecules[i];
      const mol2 = allMolecules[j];
      
      const distance = calculateRadarDistance(mol1, mol2);
      const similarity = distanceToSimilarity(distance);
      
      if (similarity >= minSimilarity) {
        // Identifier les axes similaires (différence < 20)
        const similarAxes: string[] = [];
        // Vérifier chaque axe individuellement
        if (Math.abs((mol1.radarIntensity || 0) - (mol2.radarIntensity || 0)) < 20) similarAxes.push('Intensité');
        if (Math.abs((mol1.radarFreshness || 0) - (mol2.radarFreshness || 0)) < 20) similarAxes.push('Fraîcheur');
        if (Math.abs((mol1.radarWarmth || 0) - (mol2.radarWarmth || 0)) < 20) similarAxes.push('Chaleur');
        if (Math.abs((mol1.radarSweetness || 0) - (mol2.radarSweetness || 0)) < 20) similarAxes.push('Douceur');
        if (Math.abs((mol1.radarSpiciness || 0) - (mol2.radarSpiciness || 0)) < 20) similarAxes.push('Épices');
        if (Math.abs((mol1.radarEarthiness || 0) - (mol2.radarEarthiness || 0)) < 20) similarAxes.push('Terreux');
        
        const explanation = similarAxes.length > 0
          ? `Profils similaires sur ${similarAxes.join(', ')}`
          : 'Profils complémentaires';
        
        suggestions.push({
          molecule1Id: mol1.id,
          molecule1Name: mol1.name,
          molecule2Id: mol2.id,
          molecule2Name: mol2.name,
          similarity: Math.round(similarity * 10) / 10,
          distance: Math.round(distance * 10) / 10,
          radarProfile1: {
            intensity: mol1.radarIntensity,
            freshness: mol1.radarFreshness,
            warmth: mol1.radarWarmth,
            sweetness: mol1.radarSweetness,
            spiciness: mol1.radarSpiciness,
            earthiness: mol1.radarEarthiness
          },
          radarProfile2: {
            intensity: mol2.radarIntensity,
            freshness: mol2.radarFreshness,
            warmth: mol2.radarWarmth,
            sweetness: mol2.radarSweetness,
            spiciness: mol2.radarSpiciness,
            earthiness: mol2.radarEarthiness
          },
          explanation
        });
      }
    }
  }
  
  // Trier par similarité décroissante et limiter
  return suggestions
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}



// ====================================================================
// CRUD COMPLET POUR ACCORDS, FAMILLES, LABORATOIRE
// ====================================================================
// ============================================================================
// CRUD COMPLET POUR ACCORDS, FAMILLES, LABORATOIRE
// ============================================================================

/**
 * Mise à jour complète d'un accord
 */
export async function updateAccordFull(id: number, data: {
  name?: string;
  familyId?: number | null;
  olfactiveProfile?: string;
  emotionalResonance?: string;
  texture?: string;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: Record<string, any> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.familyId !== undefined) updateData.familyId = data.familyId;
  if (data.olfactiveProfile !== undefined) updateData.olfactiveProfile = data.olfactiveProfile;
  if (data.emotionalResonance !== undefined) updateData.emotionalResonance = data.emotionalResonance;
  if (data.texture !== undefined) updateData.texture = data.texture;
  if (data.notes !== undefined) updateData.notes = data.notes;
  
  await db.update(accords).set(updateData).where(eq(accords.id, id));
  return getAccordById(id);
}

/**
 * Suppression d'un accord
 */
export async function deleteAccord(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(accords).where(eq(accords.id, id));
  return { success: true };
}

/**
 * Mise à jour complète d'une famille
 */
export async function updateFamilyFull(id: number, data: {
  name?: string;
  description?: string;
  type?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: Record<string, any> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.type !== undefined) updateData.type = data.type;
  
  await db.update(families).set(updateData).where(eq(families.id, id));
  return getFamilyById(id);
}

/**
 * Suppression d'une famille
 */
export async function deleteFamily(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(families).where(eq(families.id, id));
  return { success: true };
}

/**
 * Mise à jour complète d'une matière première
 */
export async function updateMatiereFull(id: number, data: {
  name?: string;
  botanicalName?: string;
  type?: "huile_essentielle" | "absolu" | "resinoid" | "concrete" | "co2" | "teinture" | "poudre" | "alcoolat" | "autre";
  olfactiveFamily?: string;
  note?: "tete" | "coeur" | "fond" | "tete_coeur" | "coeur_fond";
  origin?: string;
  extractionMethod?: "distillation" | "extraction_solvant" | "co2_supercritique" | "expression" | "teinture" | "autre";
  olfactiveProfile?: string;
  character?: string;
  supplier?: string;
  pricePerMl?: number;
  stock?: number;
  status?: "en_stock" | "a_commander" | "epuise";
  technicalNotes?: string;
  manipulationNotes?: string;
  maxTemperature?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.botanicalName !== undefined) updateData.botanicalName = data.botanicalName;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.olfactiveFamily !== undefined) updateData.olfactiveFamily = data.olfactiveFamily;
  if ('family' in data && (data as Record<string, unknown>).family !== undefined) updateData.family = (data as Record<string, unknown>).family;
  if (data.note !== undefined) updateData.note = data.note;
  if (data.origin !== undefined) updateData.origin = data.origin;
  if (data.extractionMethod !== undefined) updateData.extractionMethod = data.extractionMethod;
  if (data.olfactiveProfile !== undefined) updateData.olfactiveProfile = data.olfactiveProfile;
  if (data.character !== undefined) updateData.character = data.character;
  if (data.supplier !== undefined) updateData.supplier = data.supplier;
  if (data.pricePerMl !== undefined) updateData.pricePerMl = data.pricePerMl;
  if (data.stock !== undefined) updateData.stock = data.stock;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.technicalNotes !== undefined) updateData.technicalNotes = data.technicalNotes;
  if (data.manipulationNotes !== undefined) updateData.manipulationNotes = data.manipulationNotes;
  if (data.maxTemperature !== undefined) updateData.maxTemperature = data.maxTemperature;
  
  await db.update(laboratoire).set(updateData).where(eq(laboratoire.id, id));
  return getMatiereById(id);
}

/**
 * Suppression d'une matière première
 */
export async function deleteMatiere(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(laboratoire).where(eq(laboratoire.id, id));
  return { success: true };
}



// ====================================================================
// SYNERGIES GRAPH VISUALIZATION
// ====================================================================
// ============================================================================
// SYNERGIES GRAPH VISUALIZATION
// ============================================================================

/**
 * Get default chemical mechanism explanation based on synergy type
 */
function getDefaultChemicalMechanism(type: string): string {
  const mechanisms: Record<string, string> = {
    potentialisation: "Synergie de potentialisation : les molécules interagissent via des liaisons hydrogène et des forces de van der Waals pour amplifier mutuellement leur perception olfactive. L'une des molécules peut agir comme modulateur allostérique des récepteurs olfactifs, augmentant l'affinité de liaison de l'autre.",
    stabilisation: "Synergie de stabilisation : formation de complexes moléculaires stables par interactions π-π (empilement aromatique) et liaisons hydrogène. Ces interactions réduisent la volatilité et prolongent la tenue du parfum en créant des associations supramoléculaires.",
    transformation: "Synergie de transformation : réactions chimiques lentes (condensation, oxydation ménagée) entre les groupes fonctionnels des deux molécules, générant de nouveaux composés aux propriétés olfactives distinctes. Les doubles liaisons et groupes carbonyle sont les sites réactifs principaux.",
    masquage: "Synergie de masquage : compétition au niveau des récepteurs olfactifs. La molécule dominante sature les récepteurs spécifiques, réduisant la perception de l'autre composé. Ce phénomène est lié aux différences de seuil de détection et d'affinité réceptorielle.",
  };
  return mechanisms[type] || "Interaction moléculaire documentée impliquant des forces intermoléculaires (van der Waals, liaisons hydrogène, interactions π-π) qui modulent la volatilité et la perception olfactive des composés.";
}

/**
 * Get comprehensive synergy graph data for D3.js visualization
 * Returns nodes (molecules) and links (synergies) with enriched metadata
 * Enhanced version with molecule details and statistics
 */
export async function getMolecularSynergiesGraphVisualization() {
  const db = await getDb();
  if (!db) return { nodes: [], links: [], stats: { totalNodes: 0, totalLinks: 0, byType: {} } };
  
  // Get all terpene synergies
  const terpeneSyns = await db
    .select({
      id: terpeneSynergies.id,
      terpene1Id: terpeneSynergies.terpene1Id,
      terpene2Id: terpeneSynergies.terpene2Id,
      compatibilityScore: terpeneSynergies.compatibilityScore,
      synergyNotes: terpeneSynergies.synergyNotes,
    })
    .from(terpeneSynergies);
  
  // Get all molecule synergies
  const molSyns = await db
    .select({
      id: moleculeSynergies.id,
      molecule1Id: moleculeSynergies.molecule1Id,
      molecule2Id: moleculeSynergies.molecule2Id,
      type: moleculeSynergies.type,
      description: moleculeSynergies.description,
      chemicalMechanism: moleculeSynergies.chemicalMechanism,
      applications: moleculeSynergies.applications,
    })
    .from(moleculeSynergies);
  
  // Collect all molecule IDs
  const moleculeIds = new Set<number>();
  terpeneSyns.forEach(s => {
    moleculeIds.add(s.terpene1Id);
    moleculeIds.add(s.terpene2Id);
  });
  molSyns.forEach(s => {
    moleculeIds.add(s.molecule1Id);
    moleculeIds.add(s.molecule2Id);
  });
  
  if (moleculeIds.size === 0) {
    return { nodes: [], links: [], stats: { totalNodes: 0, totalLinks: 0, byType: {} } };
  }
  
  // Get molecule details
  const mols = await db
    .select({
      id: molecules.id,
      name: molecules.name,
      family: molecules.family,
      chemicalClass: molecules.chemicalClass,
      olfactiveProfile: molecules.olfactiveProfile,
      radarIntensity: molecules.radarIntensity,
      radarFreshness: molecules.radarFreshness,
      radarWarmth: molecules.radarWarmth,
      radarSweetness: molecules.radarSweetness,
      radarSpiciness: molecules.radarSpiciness,
      radarEarthiness: molecules.radarEarthiness,
    })
    .from(molecules)
    .where(inArray(molecules.id, Array.from(moleculeIds)));
  
  // Build nodes
  const nodes = mols.map(m => ({
    id: m.id,
    name: m.name,
    family: m.family,
    chemicalClass: m.chemicalClass,
    olfactiveProfile: m.olfactiveProfile,
    radar: {
      intensity: m.radarIntensity || 50,
      freshness: m.radarFreshness || 50,
      warmth: m.radarWarmth || 50,
      sweetness: m.radarSweetness || 50,
      spiciness: m.radarSpiciness || 50,
      earthiness: m.radarEarthiness || 50,
    },
    // Count connections
    connectionCount: 0,
  }));
  
  // Create node map for quick lookup
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  
  // Build links from terpene synergies
  const links: Array<{
    id: string;
    source: number;
    target: number;
    type: string;
    compatibilityScore: number;
    description: string | null;
    chemicalMechanism: string | null;
    applications: string | null;
  }> = [];
  
  terpeneSyns.forEach(s => {
    const sourceNode = nodeMap.get(s.terpene1Id);
    const targetNode = nodeMap.get(s.terpene2Id);
    if (sourceNode && targetNode) {
      sourceNode.connectionCount++;
      targetNode.connectionCount++;
      const synergyType = s.compatibilityScore >= 70 ? 'potentialisation' : s.compatibilityScore >= 40 ? 'stabilisation' : 'masquage';
      links.push({
        id: `terpene-${s.id}`,
        source: s.terpene1Id,
        target: s.terpene2Id,
        type: synergyType,
        compatibilityScore: s.compatibilityScore,
        description: s.synergyNotes,
        chemicalMechanism: getDefaultChemicalMechanism(synergyType),
        applications: null,
      });
    }
  });
  
  // Build links from molecule synergies
  molSyns.forEach(s => {
    const sourceNode = nodeMap.get(s.molecule1Id);
    const targetNode = nodeMap.get(s.molecule2Id);
    if (sourceNode && targetNode) {
      sourceNode.connectionCount++;
      targetNode.connectionCount++;
      links.push({
        id: `molecule-${s.id}`,
        source: s.molecule1Id,
        target: s.molecule2Id,
        type: s.type,
        compatibilityScore: 80, // Default for molecule synergies
        description: s.description,
        chemicalMechanism: s.chemicalMechanism || getDefaultChemicalMechanism(s.type),
        applications: s.applications,
      });
    }
  });
  
  // Calculate stats
  const byType: Record<string, number> = {};
  links.forEach(l => {
    byType[l.type] = (byType[l.type] || 0) + 1;
  });
  
  return {
    nodes,
    links,
    stats: {
      totalNodes: nodes.length,
      totalLinks: links.length,
      byType,
    },
  };
}

/**
 * Get synergy suggestions for multiple molecules at once
 * Used by the formulation tool to show relevant synergies
 */
export async function getSynergySuggestionsForMolecules(moleculeIds: number[]) {
  const db = await getDb();
  if (!db || moleculeIds.length === 0) return { selectedIds: moleculeIds, suggestions: [] };
  
  // Get terpene synergies involving any of the selected molecules
  const terpeneSyns = await db
    .select()
    .from(terpeneSynergies)
    .where(
      or(
        inArray(terpeneSynergies.terpene1Id, moleculeIds),
        inArray(terpeneSynergies.terpene2Id, moleculeIds)
      )
    );
  
  // Get molecule synergies involving any of the selected molecules
  const molSyns = await db
    .select()
    .from(moleculeSynergies)
    .where(
      or(
        inArray(moleculeSynergies.molecule1Id, moleculeIds),
        inArray(moleculeSynergies.molecule2Id, moleculeIds)
      )
    );
  
  // Collect partner molecule IDs (not in selected list)
  const selectedSet = new Set(moleculeIds);
  const partnerIds = new Set<number>();
  
  terpeneSyns.forEach(s => {
    if (selectedSet.has(s.terpene1Id) && !selectedSet.has(s.terpene2Id)) {
      partnerIds.add(s.terpene2Id);
    }
    if (selectedSet.has(s.terpene2Id) && !selectedSet.has(s.terpene1Id)) {
      partnerIds.add(s.terpene1Id);
    }
  });
  
  molSyns.forEach(s => {
    if (selectedSet.has(s.molecule1Id) && !selectedSet.has(s.molecule2Id)) {
      partnerIds.add(s.molecule2Id);
    }
    if (selectedSet.has(s.molecule2Id) && !selectedSet.has(s.molecule1Id)) {
      partnerIds.add(s.molecule1Id);
    }
  });
  
  if (partnerIds.size === 0) return { selectedIds: moleculeIds, suggestions: [] };
  
  // Get partner molecule details
  const partners = await db
    .select({
      id: molecules.id,
      name: molecules.name,
      family: molecules.family,
      chemicalClass: molecules.chemicalClass,
      olfactiveProfile: molecules.olfactiveProfile,
    })
    .from(molecules)
    .where(inArray(molecules.id, Array.from(partnerIds)));
  
  // Get selected molecule names for context
  const selectedMols = await db
    .select({ id: molecules.id, name: molecules.name })
    .from(molecules)
    .where(inArray(molecules.id, moleculeIds));
  const selectedNameMap = new Map(selectedMols.map(m => [m.id, m.name]));
  
  // Build suggestions with synergy details
  const suggestions = partners.map(partner => {
    // Find all synergies with this partner
    const relevantTerpeneSyns = terpeneSyns.filter(
      s => (s.terpene1Id === partner.id || s.terpene2Id === partner.id)
    );
    const relevantMolSyns = molSyns.filter(
      s => (s.molecule1Id === partner.id || s.molecule2Id === partner.id)
    );
    
    // Get the best synergy info
    const bestTerpeneSyn = relevantTerpeneSyns.reduce((best, curr) => 
      !best || (curr.compatibilityScore > best.compatibilityScore) ? curr : best, 
      null as typeof relevantTerpeneSyns[0] | null
    );
    const bestMolSyn = relevantMolSyns[0];
    
    // Find which selected molecules this partner synergizes with
    const synergyPartners: string[] = [];
    relevantTerpeneSyns.forEach(s => {
      const partnerId = s.terpene1Id === partner.id ? s.terpene2Id : s.terpene1Id;
      const partnerName = selectedNameMap.get(partnerId);
      if (partnerName && !synergyPartners.includes(partnerName)) {
        synergyPartners.push(partnerName);
      }
    });
    relevantMolSyns.forEach(s => {
      const partnerId = s.molecule1Id === partner.id ? s.molecule2Id : s.molecule1Id;
      const partnerName = selectedNameMap.get(partnerId);
      if (partnerName && !synergyPartners.includes(partnerName)) {
        synergyPartners.push(partnerName);
      }
    });
    
    return {
      molecule: {
        id: partner.id,
        name: partner.name,
        family: partner.family,
        chemicalClass: partner.chemicalClass,
        olfactiveProfile: partner.olfactiveProfile,
      },
      synergyType: bestMolSyn?.type || (bestTerpeneSyn?.compatibilityScore && bestTerpeneSyn.compatibilityScore >= 70 ? 'potentialisation' : 'stabilisation'),
      compatibilityScore: bestTerpeneSyn?.compatibilityScore || 75,
      description: bestMolSyn?.description || bestTerpeneSyn?.synergyNotes || 'Synergie documentée',
      applications: bestMolSyn?.applications,
      synergyPartners,
      synergyCount: relevantTerpeneSyns.length + relevantMolSyns.length,
    };
  });
  
  // Sort by synergy count and compatibility score
  const sortedSuggestions = suggestions.sort((a, b) => {
    if (b.synergyCount !== a.synergyCount) return b.synergyCount - a.synergyCount;
    return b.compatibilityScore - a.compatibilityScore;
  });
  
  return { selectedIds: moleculeIds, suggestions: sortedSuggestions };
}

