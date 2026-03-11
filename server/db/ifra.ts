// @ts-nocheck
/**
 * Module: ifra
 * Généré automatiquement depuis server/db.ts
 * Sections: IFRA RESTRICTIONS FUNCTIONS, IFRA CATEGORIES FUNCTIONS, IFRA ENRICHMENT FUNCTIONS
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
// IFRA RESTRICTIONS FUNCTIONS
// ====================================================================
// ============================================================================
// IFRA RESTRICTIONS FUNCTIONS
// ============================================================================

export async function getMoleculeIfraRestrictions(moleculeId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const results = await db.select().from(ifraRestrictions).where(eq(ifraRestrictions.moleculeId, moleculeId));
  return results;
}

export async function getAllIfraRestrictions() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select({
    restriction: ifraRestrictions,
    molecule: molecules,
  })
    .from(ifraRestrictions)
    .innerJoin(molecules, eq(ifraRestrictions.moleculeId, molecules.id))
    .orderBy(molecules.name);
}

export async function getRestrictedMolecules() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select({
    restriction: ifraRestrictions,
    molecule: molecules,
  })
    .from(ifraRestrictions)
    .innerJoin(molecules, eq(ifraRestrictions.moleculeId, molecules.id))
    .where(
      or(
        eq(ifraRestrictions.restrictionType, 'prohibited'),
        eq(ifraRestrictions.restrictionType, 'restricted')
      )
    )
    .orderBy(molecules.name);
}

export async function createIfraRestriction(data: InsertIfraRestriction) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const result = await db.insert(ifraRestrictions).values(data);
  return { id: Number(result[0].insertId), ...data };
}

export async function updateIfraRestriction(id: number, data: Partial<InsertIfraRestriction>) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.update(ifraRestrictions).set(data).where(eq(ifraRestrictions.id, id));
}

export async function deleteIfraRestriction(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.delete(ifraRestrictions).where(eq(ifraRestrictions.id, id));
}


// ====================================================================
// IFRA CATEGORIES FUNCTIONS
// ====================================================================
// ============================================================================
// IFRA CATEGORIES FUNCTIONS
// ============================================================================

export async function getAllIfraCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ifraCategories).orderBy(ifraCategories.code);
}

export async function getIfraCategoryByCode(code: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(ifraCategories).where(eq(ifraCategories.code, code));
  return result[0] || null;
}

/**
 * Calcule la limite IFRA pour une molécule dans un type de produit donné
 * @param moleculeId - ID de la molécule
 * @param categoryCode - Code de la catégorie IFRA (ex: "4" pour parfum fin)
 * @returns La limite en pourcentage ou null si pas de restriction
 */
export async function calculateIfraLimit(moleculeId: number, categoryCode: string) {
  const db = await getDb();
  if (!db) return null;
  
  const [restriction] = await db.select()
    .from(ifraRestrictions)
    .where(eq(ifraRestrictions.moleculeId, moleculeId));
  
  if (!restriction) return { limit: null, type: 'no_restriction' as const };
  
  // Mapper le code de catégorie vers la colonne correspondante
  const categoryMap: Record<string, keyof typeof restriction> = {
    '1': 'category1',
    '2': 'category2',
    '3': 'category3',
    '4': 'category4',
    '5A': 'category5a',
    '5B': 'category5b',
    '5C': 'category5c',
    '5D': 'category5d',
    '6': 'category6',
    '7A': 'category7a',
    '7B': 'category7b',
    '8': 'category8',
    '9': 'category9',
    '10A': 'category10a',
    '10B': 'category10b',
    '11A': 'category11a',
    '11B': 'category11b',
  };
  
  const column = categoryMap[categoryCode.toUpperCase()];
  if (!column) return { limit: null, type: 'unknown_category' as const };
  
  const limit = restriction[column];
  
  return {
    limit: limit ? parseFloat(String(limit)) : null,
    type: restriction.restrictionType || 'no_restriction',
    reason: restriction.reasonForRestriction,
    alternatives: restriction.alternativeSuggestions,
    amendment: restriction.ifraAmendment,
  };
}

/**
 * Vérifie si une concentration donnée respecte les limites IFRA
 * @param moleculeId - ID de la molécule
 * @param categoryCode - Code de la catégorie IFRA
 * @param concentration - Concentration en pourcentage
 * @returns Objet avec le statut de conformité et les détails
 */
export async function checkIfraCompliance(
  moleculeId: number,
  categoryCode: string,
  concentration: number
) {
  const limitInfo = await calculateIfraLimit(moleculeId, categoryCode);
  
  if (!limitInfo || limitInfo.type === 'no_restriction') {
    return {
      compliant: true,
      message: 'Pas de restriction IFRA pour cette molécule',
      limit: null,
      concentration,
    };
  }
  
  if (limitInfo.type === 'prohibited') {
    return {
      compliant: false,
      message: 'Cette molécule est INTERDITE par l\'IFRA',
      limit: 0,
      concentration,
      reason: limitInfo.reason,
      alternatives: limitInfo.alternatives,
    };
  }
  
  if (limitInfo.limit === null) {
    return {
      compliant: true,
      message: 'Pas de limite spécifique pour cette catégorie',
      limit: null,
      concentration,
    };
  }
  
  const compliant = concentration <= limitInfo.limit;
  
  return {
    compliant,
    message: compliant
      ? `Concentration conforme (${concentration}% ≤ ${limitInfo.limit}%)`
      : `DÉPASSEMENT de la limite IFRA (${concentration}% > ${limitInfo.limit}%)`,
    limit: limitInfo.limit,
    concentration,
    margin: limitInfo.limit - concentration,
    marginPercent: ((limitInfo.limit - concentration) / limitInfo.limit) * 100,
    reason: limitInfo.reason,
    alternatives: limitInfo.alternatives,
    amendment: limitInfo.amendment,
  };
}

/**
 * Recherche les restrictions IFRA par nom de molécule
 */
export async function searchIfraRestrictionsByName(searchTerm: string) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    restriction: ifraRestrictions,
    molecule: molecules,
  })
    .from(ifraRestrictions)
    .innerJoin(molecules, eq(ifraRestrictions.moleculeId, molecules.id))
    .where(like(molecules.name, `%${searchTerm}%`))
    .orderBy(molecules.name);
}

/**
 * Obtient les statistiques IFRA
 */
export async function getIfraStats() {
  const db = await getDb();
  if (!db) return null;
  
  const all = await db.select().from(ifraRestrictions);
  
  const prohibited = all.filter(r => r.restrictionType === 'prohibited').length;
  const restricted = all.filter(r => r.restrictionType === 'restricted').length;
  const specification = all.filter(r => r.restrictionType === 'specification').length;
  const noRestriction = all.filter(r => r.restrictionType === 'no_restriction').length;
  
  return {
    total: all.length,
    prohibited,
    restricted,
    specification,
    noRestriction,
  };
}



// ====================================================================
// IFRA ENRICHMENT FUNCTIONS
// ====================================================================
// ============================================================================
// IFRA ENRICHMENT FUNCTIONS
// ============================================================================


/**
 * Update molecule with IFRA regulatory data
 */
export async function updateMoleculeIFRAData(moleculeId: number, ifraData: IFRAData): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  const query = "UPDATE molecules SET ifra_status = '" + ifraData.status + "', ifra_data = '" + JSON.stringify(ifraData).replace(/'/g, "''") + "', ifra_enriched_at = NOW() WHERE id = " + moleculeId;
  await (db as any).execute(query);
}

/**
 * Get molecules by IFRA status
 */
export async function getMoleculesByIFRAStatus(
  status: 'not_regulated' | 'banned' | 'restricted' | 'specification_required',
  limit: number = 50,
  offset: number = 0
): Promise<{
  id: number;
  name: string;
  casNumber: string | null;
  ifraStatus: string;
  ifraData: any;
}[]> {
  const db = await getDb();
  if (!db) return [];
  
  const [rows] = await (db as any).execute(
    "SELECT id, name, cas_number as casNumber, ifra_status as ifraStatus, ifra_data as ifraData FROM molecules WHERE ifra_status = '" + status + "' ORDER BY name ASC LIMIT " + limit + " OFFSET " + offset
  );
  
  return (rows as any[]).map(r => ({
    id: r.id,
    name: r.name,
    casNumber: r.casNumber,
    ifraStatus: r.ifraStatus,
    ifraData: r.ifraData ? (typeof r.ifraData === 'string' ? JSON.parse(r.ifraData) : r.ifraData) : null,
  }));
}

/**
 * Get molecules that need IFRA enrichment
 */
export async function getUnenrichedMoleculesForIFRA(limit: number = 50): Promise<{
  id: number;
  name: string;
  casNumber: string | null;
}[]> {
  const db = await getDb();
  if (!db) return [];
  
  const [rows] = await (db as any).execute(
    'SELECT id, name, cas_number as casNumber FROM molecules WHERE ifra_enriched_at IS NULL ORDER BY name ASC LIMIT ' + limit
  );
  
  return (rows as any[]).map(r => ({
    id: r.id,
    name: r.name,
    casNumber: r.casNumber,
  }));
}

/**
 * Get IFRA enrichment statistics
 */
export async function getIFRAEnrichmentStats(): Promise<{
  total: number;
  enriched: number;
  percentage: number;
  banned: number;
  restricted: number;
  specRequired: number;
  notRegulated: number;
}> {
  const db = await getDb();
  if (!db) return { total: 0, enriched: 0, percentage: 0, banned: 0, restricted: 0, specRequired: 0, notRegulated: 0 };
  
  const [rows] = await (db as any).execute(
    `SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN ifra_enriched_at IS NOT NULL THEN 1 ELSE 0 END) as enriched,
      SUM(CASE WHEN ifra_status = 'banned' THEN 1 ELSE 0 END) as banned,
      SUM(CASE WHEN ifra_status = 'restricted' THEN 1 ELSE 0 END) as restricted,
      SUM(CASE WHEN ifra_status = 'specification_required' THEN 1 ELSE 0 END) as specRequired,
      SUM(CASE WHEN ifra_status = 'not_regulated' AND ifra_enriched_at IS NOT NULL THEN 1 ELSE 0 END) as notRegulated
    FROM molecules`
  );
  
  const stats = (rows as any[])[0];
  return {
    total: stats.total || 0,
    enriched: stats.enriched || 0,
    percentage: stats.total > 0 ? Math.round((stats.enriched / stats.total) * 100) : 0,
    banned: stats.banned || 0,
    restricted: stats.restricted || 0,
    specRequired: stats.specRequired || 0,
    notRegulated: stats.notRegulated || 0,
  };
}


