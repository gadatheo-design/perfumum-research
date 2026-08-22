/**
 * Module: tabacs
 * Généré automatiquement depuis server/db.ts
 * Sections: TABACS, TABACS & SYNERGIES, TOBACCO-CANNABIS-PERFUME INTERACTIONS (+2 autres)
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
  terpeneComparisonProfiles,
  TerpeneComparisonProfile,
  InsertTerpeneComparisonProfile,
  entourageRules,
  EntourageRule,
  InsertEntourageRule,
  formulationSuggestions,
  FormulationSuggestion,
  InsertFormulationSuggestion,
  aromaticAccords,
  AromaticAccord,
  InsertAromaticAccord,
  molecularInteractions,
  MolecularInteraction,
  InsertMolecularInteraction,
} from "../../drizzle/schema";
import { getDb } from './core';
import { getMoleculeById } from './molecules';
import { enrichMoleculeWithTranslation } from '../pubchem';
import { enrichMoleculeWithTranslationChEBI } from '../chebi';
import { ENV } from '../_core/env';
import { expandSearchQuery, getSynonyms, normalizeSearchTerm, categorizeOlfactiveTerm, getDictionaryStats } from '../../shared/olfactiveSynonyms';
import { expandWithScientificNames, getScientificDictionaryStats } from '../../shared/botanicalLatinNames';


// ====================================================================
// TABACS
// ====================================================================
// ============================================================================
// TABACS
// ============================================================================

export async function getAllTabacs(): Promise<Tabac[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(tabacs);
}

export async function getTabacById(id: number): Promise<Tabac | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(tabacs).where(eq(tabacs.id, id)).limit(1);
  return result[0];
}

export async function getTabacsByProfile(olfactiveProfile: string): Promise<Tabac[]> {
  const db = await getDb();
  if (!db) return [];
  const allTabacs = await db.select().from(tabacs);
  
  // Filter tabacs that match the olfactive profile in their internalNotes
  return allTabacs.filter(tabac => 
    tabac.internalNotes?.toLowerCase().includes(olfactiveProfile.toLowerCase())
  );
}


export async function getTabacsWithTerroir(): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];
  const { sql } = await import("drizzle-orm");
  const [result] = await db.execute(sql`
    SELECT t.id, t.name, t.type, t.origin, t.intensity, t.aromaticProfile, t.internalNotes,
           te.name as terroir_name, te.country as terroir_country, te.region as terroir_region,
           te.climate_type as terroir_climate, te.soil_type as terroir_soil, te.quality_rating as terroir_quality
    FROM tabacs t
    LEFT JOIN tabac_terroir_links ttl ON ttl.tabac_id = t.id
    LEFT JOIN terroirs te ON te.id = ttl.terroir_id
    ORDER BY t.type, t.name
  `) as unknown as [any[]];
  return Array.isArray(result) ? result as unknown[] : [];
}

export async function getTabacsByType(type: string): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];
  const { sql } = await import("drizzle-orm");
  const [result] = await db.execute(sql`
    SELECT t.id, t.name, t.type, t.origin, t.intensity, t.aromaticProfile, t.internalNotes,
           te.name as terroir_name, te.country as terroir_country, te.region as terroir_region,
           te.climate_type as terroir_climate, te.quality_rating as terroir_quality
    FROM tabacs t
    LEFT JOIN tabac_terroir_links ttl ON ttl.tabac_id = t.id
    LEFT JOIN terroirs te ON te.id = ttl.terroir_id
    WHERE t.type = ${type}
    ORDER BY t.name
  `) as unknown as [any[]];
  return Array.isArray(result) ? result as unknown[] : [];
}

export async function getTabacWithMolecules(tabacId: number): Promise<any> {
  const db = await getDb();
  if (!db) return null;
  const { sql } = await import("drizzle-orm");
  // Get tabac info
  const [tabacResult] = await db.execute(sql`
    SELECT t.*, te.name as terroir_name, te.country as terroir_country, te.region as terroir_region
    FROM tabacs t
    LEFT JOIN tabac_terroir_links ttl ON ttl.tabac_id = t.id
    LEFT JOIN terroirs te ON te.id = ttl.terroir_id
    WHERE t.id = ${tabacId}
    LIMIT 1
  `) as unknown as [any[]];
  const tabacRows = (tabacResult as any)[0] as unknown[];
  if (!tabacRows.length) return null;
  const tabac = tabacRows[0] as Record<string, unknown>;
  // Get molecules via tabac_molecule_links (direct links, preferred)
  const [molResult] = await db.execute(sql`
    SELECT m.id, m.name, m.family, m.olfactiveProfile as odor_description,
           m.cas_number, tml.notes as link_notes
    FROM tabac_molecule_links tml
    JOIN molecules m ON m.id = tml.molecule_id
    WHERE tml.tabac_id = ${tabacId}
    ORDER BY m.name
  `) as unknown as [any[]];
  let molecules = (molResult as any)[0] as unknown[];

  // Fallback: search via plants if no direct links
  if (molecules.length === 0) {
    const [plantMolResult] = await db.execute(sql`
      SELECT m.id, m.name, m.family, m.olfactiveProfile as odor_description,
             pm.percentage_typical, pm.role, pm.source
      FROM plant_molecules pm
      JOIN plants p ON p.id = pm.plant_id
      JOIN molecules m ON m.id = pm.molecule_id
      WHERE p.name LIKE ${tabac.name + '%'} AND p.category = 'tabac'
      ORDER BY pm.percentage_typical DESC
      LIMIT 20
    `) as unknown as [any[]];
    molecules = (plantMolResult as any)[0] as unknown[];
  }

  return { ...tabac, molecules };
}


// ====================================================================
// TABACS & SYNERGIES
// ====================================================================
// ============================================================
// TABACS & SYNERGIES
// ============================================================




// ====================================================================
// TOBACCO-CANNABIS-PERFUME INTERACTIONS
// ====================================================================
// ============================================================================
// TOBACCO-CANNABIS-PERFUME INTERACTIONS
// ============================================================================


// Molecular Interactions
export async function getAllMolecularInteractions(): Promise<MolecularInteraction[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(molecularInteractions).orderBy(molecularInteractions.name);
}

export async function getMolecularInteractionById(id: number): Promise<MolecularInteraction | null> {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(molecularInteractions).where(eq(molecularInteractions.id, id));
  return results[0] || null;
}

export async function getMolecularInteractionsByCategory(category: string): Promise<MolecularInteraction[]> {
  const db = await getDb();
  if (!db) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return db.select().from(molecularInteractions)
    .where(eq(molecularInteractions.sourceCategory, category as any))
    .orderBy(molecularInteractions.name);
}

export async function getMolecularInteractionsBySynergyType(synergyType: string): Promise<MolecularInteraction[]> {
  const db = await getDb();
  if (!db) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return db.select().from(molecularInteractions)
    .where(eq(molecularInteractions.synergyType, synergyType as any))
    .orderBy(molecularInteractions.name);
}

export async function createMolecularInteraction(data: InsertMolecularInteraction): Promise<MolecularInteraction | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(molecularInteractions).values(data);
  const inserted = await db.select().from(molecularInteractions).where(eq(molecularInteractions.id, Number(result[0].insertId)));
  return inserted[0] || null;
}

export async function updateMolecularInteraction(id: number, data: Partial<InsertMolecularInteraction>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(molecularInteractions).set(data).where(eq(molecularInteractions.id, id));
}

export async function deleteMolecularInteraction(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(molecularInteractions).where(eq(molecularInteractions.id, id));
}

// Aromatic Accords
export async function getAllAromaticAccords(): Promise<AromaticAccord[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(aromaticAccords).orderBy(aromaticAccords.name);
}

export async function getAromaticAccordById(id: number): Promise<AromaticAccord | null> {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(aromaticAccords).where(eq(aromaticAccords.id, id));
  return results[0] || null;
}

export async function getAromaticAccordsByCategory(category: string): Promise<AromaticAccord[]> {
  const db = await getDb();
  if (!db) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return db.select().from(aromaticAccords)
    .where(eq(aromaticAccords.category, category as any))
    .orderBy(aromaticAccords.name);
}

export async function createAromaticAccord(data: InsertAromaticAccord): Promise<AromaticAccord | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(aromaticAccords).values(data);
  const inserted = await db.select().from(aromaticAccords).where(eq(aromaticAccords.id, Number(result[0].insertId)));
  return inserted[0] || null;
}

export async function updateAromaticAccord(id: number, data: Partial<InsertAromaticAccord>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(aromaticAccords).set(data).where(eq(aromaticAccords.id, id));
}

export async function deleteAromaticAccord(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(aromaticAccords).where(eq(aromaticAccords.id, id));
}

// Terpene Comparison Profiles
export async function getAllTerpeneComparisonProfiles(): Promise<TerpeneComparisonProfile[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(terpeneComparisonProfiles).orderBy(terpeneComparisonProfiles.name);
}

export async function getTerpeneComparisonProfileById(id: number): Promise<TerpeneComparisonProfile | null> {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(terpeneComparisonProfiles).where(eq(terpeneComparisonProfiles.id, id));
  return results[0] || null;
}

export async function getTerpeneComparisonProfilesBySource(sourceType: string): Promise<TerpeneComparisonProfile[]> {
  const db = await getDb();
  if (!db) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return db.select().from(terpeneComparisonProfiles)
    .where(eq(terpeneComparisonProfiles.sourceType, sourceType as any))
    .orderBy(terpeneComparisonProfiles.name);
}

export async function createTerpeneComparisonProfile(data: InsertTerpeneComparisonProfile): Promise<TerpeneComparisonProfile | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(terpeneComparisonProfiles).values(data);
  const inserted = await db.select().from(terpeneComparisonProfiles).where(eq(terpeneComparisonProfiles.id, Number(result[0].insertId)));
  return inserted[0] || null;
}

export async function updateTerpeneComparisonProfile(id: number, data: Partial<InsertTerpeneComparisonProfile>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(terpeneComparisonProfiles).set(data).where(eq(terpeneComparisonProfiles.id, id));
}

export async function deleteTerpeneComparisonProfile(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(terpeneComparisonProfiles).where(eq(terpeneComparisonProfiles.id, id));
}

// Formulation Suggestions
export async function getAllFormulationSuggestions(): Promise<FormulationSuggestion[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(formulationSuggestions).orderBy(formulationSuggestions.name);
}

export async function getFormulationSuggestionById(id: number): Promise<FormulationSuggestion | null> {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(formulationSuggestions).where(eq(formulationSuggestions.id, id));
  return results[0] || null;
}

export async function getFormulationSuggestionsByType(formulationType: string): Promise<FormulationSuggestion[]> {
  const db = await getDb();
  if (!db) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return db.select().from(formulationSuggestions)
    .where(eq(formulationSuggestions.formulationType, formulationType as any))
    .orderBy(formulationSuggestions.name);
}

export async function getFormulationSuggestionsByBaseMolecule(moleculeId: number): Promise<FormulationSuggestion[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(formulationSuggestions)
    .where(eq(formulationSuggestions.baseMoleculeId, moleculeId))
    .orderBy(formulationSuggestions.name);
}

export async function createFormulationSuggestion(data: InsertFormulationSuggestion): Promise<FormulationSuggestion | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(formulationSuggestions).values(data);
  const inserted = await db.select().from(formulationSuggestions).where(eq(formulationSuggestions.id, Number(result[0].insertId)));
  return inserted[0] || null;
}

export async function updateFormulationSuggestion(id: number, data: Partial<InsertFormulationSuggestion>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(formulationSuggestions).set(data).where(eq(formulationSuggestions.id, id));
}

export async function deleteFormulationSuggestion(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(formulationSuggestions).where(eq(formulationSuggestions.id, id));
}

// Entourage Rules
export async function getAllEntourageRules(): Promise<EntourageRule[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(entourageRules).orderBy(entourageRules.name);
}

export async function getEntourageRuleById(id: number): Promise<EntourageRule | null> {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(entourageRules).where(eq(entourageRules.id, id));
  return results[0] || null;
}

export async function getEntourageRulesByType(ruleType: string): Promise<EntourageRule[]> {
  const db = await getDb();
  if (!db) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return db.select().from(entourageRules)
    .where(eq(entourageRules.ruleType, ruleType as any))
    .orderBy(entourageRules.name);
}

export async function createEntourageRule(data: InsertEntourageRule): Promise<EntourageRule | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(entourageRules).values(data);
  const inserted = await db.select().from(entourageRules).where(eq(entourageRules.id, Number(result[0].insertId)));
  return inserted[0] || null;
}

export async function updateEntourageRule(id: number, data: Partial<InsertEntourageRule>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(entourageRules).set(data).where(eq(entourageRules.id, id));
}

export async function deleteEntourageRule(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(entourageRules).where(eq(entourageRules.id, id));
}

// Generate formulation suggestions based on synergies
export async function generateFormulationSuggestions(baseMoleculeId: number): Promise<{
  baseMolecule: Molecule | null;
  suggestions: Array<{
    molecule: Molecule;
    synergyType: string;
    compatibilityScore: number;
    reason: string;
  }>;
}> {
  const db = await getDb();
  if (!db) return { baseMolecule: null, suggestions: [] };
  
  // Get base molecule
  const baseMolecule = await getMoleculeById(baseMoleculeId);
  if (!baseMolecule) return { baseMolecule: null, suggestions: [] };
  
  // Get all terpene synergies involving this molecule
  const synergies1 = await db.select().from(terpeneSynergies)
    .where(eq(terpeneSynergies.terpene1Id, baseMoleculeId));
  const synergies2 = await db.select().from(terpeneSynergies)
    .where(eq(terpeneSynergies.terpene2Id, baseMoleculeId));
  
  // Get all molecule synergies involving this molecule
  const molSynergies1 = await db.select().from(moleculeSynergies)
    .where(eq(moleculeSynergies.molecule1Id, baseMoleculeId));
  const molSynergies2 = await db.select().from(moleculeSynergies)
    .where(eq(moleculeSynergies.molecule2Id, baseMoleculeId));
  
  const suggestions: Array<{
    molecule: Molecule;
    synergyType: string;
    compatibilityScore: number;
    reason: string;
  }> = [];
  
  // Process terpene synergies
  for (const syn of synergies1) {
    const mol = await getMoleculeById(syn.terpene2Id);
    if (mol) {
      suggestions.push({
        molecule: mol,
        synergyType: 'terpene',
        compatibilityScore: syn.compatibilityScore,
        reason: syn.synergyNotes || 'Synergie terpénique documentée'
      });
    }
  }
  for (const syn of synergies2) {
    const mol = await getMoleculeById(syn.terpene1Id);
    if (mol) {
      suggestions.push({
        molecule: mol,
        synergyType: 'terpene',
        compatibilityScore: syn.compatibilityScore,
        reason: syn.synergyNotes || 'Synergie terpénique documentée'
      });
    }
  }
  
  // Process molecule synergies
  for (const syn of molSynergies1) {
    const mol = await getMoleculeById(syn.molecule2Id);
    if (mol) {
      suggestions.push({
        molecule: mol,
        synergyType: syn.type,
        compatibilityScore: 75, // Default score for molecule synergies
        reason: syn.description
      });
    }
  }
  for (const syn of molSynergies2) {
    const mol = await getMoleculeById(syn.molecule1Id);
    if (mol) {
      suggestions.push({
        molecule: mol,
        synergyType: syn.type,
        compatibilityScore: 75,
        reason: syn.description
      });
    }
  }
  
  // Sort by compatibility score
  suggestions.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  
  return { baseMolecule, suggestions };
}

// Get terpene comparison data for radar chart
export async function getTerpeneComparisonData(profileIds: number[]): Promise<{
  profiles: TerpeneComparisonProfile[];
  terpenes: string[];
  data: Array<{
    profileId: number;
    profileName: string;
    sourceType: string;
    values: Record<string, number>;
  }>;
}> {
  const db = await getDb();
  if (!db) return { profiles: [], terpenes: [], data: [] };
  
  const profiles: TerpeneComparisonProfile[] = [];
  for (const id of profileIds) {
    const profile = await getTerpeneComparisonProfileById(id);
    if (profile) profiles.push(profile);
  }
  
  const terpenes = ['myrcene', 'limonene', 'pinene', 'linalool', 'caryophyllene', 'humulene', 'terpinolene', 'ocimene', 'bisabolol', 'geraniol'];
  
  const data = profiles.map(p => ({
    profileId: p.id,
    profileName: p.name,
    sourceType: p.sourceType,
    values: {
      myrcene: p.myrcene || 0,
      limonene: p.limonene || 0,
      pinene: p.pinene || 0,
      linalool: p.linalool || 0,
      caryophyllene: p.caryophyllene || 0,
      humulene: p.humulene || 0,
      terpinolene: p.terpinolene || 0,
      ocimene: p.ocimene || 0,
      bisabolol: p.bisabolol || 0,
      geraniol: p.geraniol || 0,
    }
  }));
  
  return { profiles, terpenes, data };
}

// Get interactions graph data for visualization
export async function getInteractionsGraphData(): Promise<{
  nodes: Array<{ id: string; name: string; type: 'tabac' | 'cannabis' | 'parfum' | 'interaction' }>;
  edges: Array<{ source: string; target: string; synergyType: string; score: number }>;
}> {
  const db = await getDb();
  if (!db) return { nodes: [], edges: [] };
  
  const interactions = await getAllMolecularInteractions();
  const nodesMap = new Map<string, { id: string; name: string; type: 'tabac' | 'cannabis' | 'parfum' | 'interaction' }>();
  const edges: Array<{ source: string; target: string; synergyType: string; score: number }> = [];
  
  for (const interaction of interactions) {
    // Add interaction as a node
    const interactionNodeId = `int-${interaction.id}`;
    nodesMap.set(interactionNodeId, {
      id: interactionNodeId,
      name: interaction.name,
      type: 'interaction'
    });
    
    // Add molecule nodes and edges
    if (interaction.molecule1Id) {
      const mol = await getMoleculeById(interaction.molecule1Id);
      if (mol) {
        const molNodeId = `mol-${mol.id}`;
        nodesMap.set(molNodeId, {
          id: molNodeId,
          name: mol.name,
          type: 'parfum'
        });
        edges.push({
          source: molNodeId,
          target: interactionNodeId,
          synergyType: interaction.synergyType,
          score: interaction.compatibilityScore
        });
      }
    }
    
    if (interaction.molecule2Id) {
      const mol = await getMoleculeById(interaction.molecule2Id);
      if (mol) {
        const molNodeId = `mol-${mol.id}`;
        nodesMap.set(molNodeId, {
          id: molNodeId,
          name: mol.name,
          type: 'parfum'
        });
        edges.push({
          source: molNodeId,
          target: interactionNodeId,
          synergyType: interaction.synergyType,
          score: interaction.compatibilityScore
        });
      }
    }
    
    if (interaction.molecule3Id) {
      const mol = await getMoleculeById(interaction.molecule3Id);
      if (mol) {
        const molNodeId = `mol-${mol.id}`;
        nodesMap.set(molNodeId, {
          id: molNodeId,
          name: mol.name,
          type: 'parfum'
        });
        edges.push({
          source: molNodeId,
          target: interactionNodeId,
          synergyType: interaction.synergyType,
          score: interaction.compatibilityScore
        });
      }
    }
  }
  
  return {
    nodes: Array.from(nodesMap.values()),
    edges
  };
}


// ====================================================================
// TOBACCO DATA - LANDRACES, CIGARETTES, COMPOUNDS, SOIL ANALYSES
// ====================================================================
// ============================================================================
// TOBACCO DATA - LANDRACES, CIGARETTES, COMPOUNDS, SOIL ANALYSES

// ====================================================================
// --- Tobacco Landraces ---
// ====================================================================
// ============================================================================

// --- Tobacco Landraces ---

export async function getAllTobaccoLandraces() {
  const db = await getDb();
  if (!db) return [];
  
  const [result] = await db.execute(sql`
    SELECT * FROM tobacco_landraces ORDER BY perfumery_potential_score DESC
  `) as unknown as [any[]];
  return result as unknown[];
}

export async function getTobaccoLandracesByRegion(region: string) {
  const db = await getDb();
  if (!db) return [];
  
  const [result] = await db.execute(sql`
    SELECT * FROM tobacco_landraces 
    WHERE country LIKE ${`%${region}%`} OR region LIKE ${`%${region}%`}
    ORDER BY perfumery_potential_score DESC
  `) as unknown as [any[]];
  return result as unknown[];
}

export async function getTobaccoLandracesByMolecularProfile(profileType: string) {
  const db = await getDb();
  if (!db) return [];
  
  const [result] = await db.execute(sql`
    SELECT * FROM tobacco_landraces 
    WHERE molecular_profile_type = ${profileType}
    ORDER BY perfumery_potential_score DESC
  `) as unknown as [any[]];
  return result as unknown[];
}

export async function getTobaccoLandraceById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.execute(sql`
    SELECT * FROM tobacco_landraces WHERE id = ${id}
  `) as unknown as [any[]];
  const rows = result as unknown[];
  return rows[0] || null;
}

export async function getTobaccoLandracesStats() {
  const db = await getDb();
  if (!db) return { total: 0, byCountry: [], byProfile: [], byStatus: [] };
  
  const [_total] = await db.execute(sql`SELECT COUNT(*) as count FROM tobacco_landraces`) as unknown as [any[]];
  const total = ((_total[0] as unknown) as Record<string,unknown>[]);
  const [_byCountry] = await db.execute(sql`
    SELECT country, COUNT(*) as count FROM tobacco_landraces GROUP BY country ORDER BY count DESC
  `) as unknown as [any[]];
  const byCountry = ((_byCountry[0] as unknown) as unknown[]);
  const [_byProfile] = await db.execute(sql`
    SELECT molecular_profile_type as profile, COUNT(*) as count FROM tobacco_landraces GROUP BY molecular_profile_type
  `) as unknown as [any[]];
  const byProfile = ((_byProfile[0] as unknown) as unknown[]);
  const [_byStatus] = await db.execute(sql`
    SELECT status, COUNT(*) as count FROM tobacco_landraces GROUP BY status
  `) as unknown as [any[]];
  const byStatus = ((_byStatus[0] as unknown) as unknown[]);
  
  return {
    total: Number(total[0]?.count || 0),
    byCountry: byCountry,
    byProfile: byProfile,
    byStatus: byStatus as unknown[]
  };
}

// --- Tobacco Cigarettes ---

export async function getAllTobaccoCigarettes() {
  const db = await getDb();
  if (!db) return [];
  
  const [result] = await db.execute(sql`
    SELECT * FROM tobacco_cigarettes ORDER BY perfumery_potential_score DESC
  `) as unknown as [any[]];
  return result as unknown[];
}

export async function getTobaccoCigarettesByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  
  const [result] = await db.execute(sql`
    SELECT * FROM tobacco_cigarettes 
    WHERE region_category = ${category}
    ORDER BY perfumery_potential_score DESC
  `) as unknown as [any[]];
  return result as unknown[];
}

export async function getTobaccoCigaretteById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.execute(sql`
    SELECT * FROM tobacco_cigarettes WHERE id = ${id}
  `) as unknown as [any[]];
  const rows = result as unknown[];
  return rows[0] || null;
}

export async function getTobaccoCigarettesStats() {
  const db = await getDb();
  if (!db) return { total: 0, byCategory: [], byStatus: [] };
  
  const [_total] = await db.execute(sql`SELECT COUNT(*) as count FROM tobacco_cigarettes`) as unknown as [any[]];
  const total = ((_total[0] as unknown) as Record<string,unknown>[]);
  const [_byCategory] = await db.execute(sql`
    SELECT region_category as category, COUNT(*) as count FROM tobacco_cigarettes GROUP BY region_category
  `) as unknown as [any[]];
  const byCategory = ((_byCategory[0] as unknown) as unknown[]);
  const [_byStatus] = await db.execute(sql`
    SELECT status, COUNT(*) as count FROM tobacco_cigarettes GROUP BY status
  `) as unknown as [any[]];
  const byStatus = ((_byStatus[0] as unknown) as unknown[]);
  
  return {
    total: Number(total[0]?.count || 0),
    byCategory: byCategory,
    byStatus: byStatus
  };
}

// --- Tobacco Compounds ---

export async function getAllTobaccoCompounds() {
  const db = await getDb();
  if (!db) return [];
  
  const [result] = await db.execute(sql`
    SELECT * FROM tobacco_compounds ORDER BY chemical_class, compound_name
  `) as unknown as [any[]];
  return result as unknown[];
}

export async function getTobaccoCompoundsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  
  const [result] = await db.execute(sql`
    SELECT * FROM tobacco_compounds 
    WHERE category = ${category}
    ORDER BY compound_name
  `) as unknown as [any[]];
  return result as unknown[];
}

export async function getTobaccoCompoundsByLandrace(landrace: string) {
  const db = await getDb();
  if (!db) return [];
  
  const [result] = await db.execute(sql`
    SELECT * FROM tobacco_compounds 
    WHERE landrace_source = ${landrace}
    ORDER BY compound_name
  `) as unknown as [any[]];
  return result as unknown[];
}

export async function getNewTobaccoIsolates() {
  const db = await getDb();
  if (!db) return [];
  
  const [result] = await db.execute(sql`
    SELECT * FROM tobacco_compounds 
    WHERE is_new_tobacco_isolate = TRUE
    ORDER BY compound_name
  `) as unknown as [any[]];
  return result as unknown[];
}

export async function getTobaccoCompoundsStats() {
  const db = await getDb();
  if (!db) return { total: 0, byCategory: [], byClass: [], newIsolates: 0 };
  
  const [_total] = await db.execute(sql`SELECT COUNT(*) as count FROM tobacco_compounds`) as unknown as [any[]];
  const total = ((_total[0] as unknown) as unknown[]);
  const [_byCategory] = await db.execute(sql`
    SELECT category, COUNT(*) as count FROM tobacco_compounds GROUP BY category ORDER BY count DESC
  `) as unknown as [any[]];
  const byCategory = ((_byCategory[0] as unknown) as unknown[]);
  const [_byClass] = await db.execute(sql`
    SELECT chemical_class as class, COUNT(*) as count FROM tobacco_compounds GROUP BY chemical_class ORDER BY count DESC
  `) as unknown as [any[]];
  const byClass = ((_byClass[0] as unknown) as unknown[]);
  const [_newIsolates] = await db.execute(sql`
    SELECT COUNT(*) as count FROM tobacco_compounds WHERE is_new_tobacco_isolate = TRUE
  `) as unknown as [any[]];
  const newIsolates = ((_newIsolates[0] as unknown) as unknown[]);
  
  return {
    total: (total[0] as Record<string, unknown>)?.count || 0,
    byCategory: byCategory,
    byClass: byClass,
    newIsolates: (newIsolates[0] as Record<string, unknown>)?.count || 0
  };
}

// --- Soil Analyses ---

export async function getAllSoilAnalyses() {
  const db = await getDb();
  if (!db) return [];
  
  const [result] = await db.execute(sql`
    SELECT * FROM soil_analyses ORDER BY terroir_name
  `) as unknown as [any[]];
  return result as unknown[];
}

export async function getSoilAnalysisByTerroir(terroir: string) {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.execute(sql`
    SELECT * FROM soil_analyses WHERE terroir_name = ${terroir}
  `) as unknown as [any[]];
  const rows = result as unknown[];
  return rows[0] || null;
}

export async function compareSoilAnalyses(terroir1: string, terroir2: string) {
  const db = await getDb();
  if (!db) return { terroir1: null, terroir2: null };
  
  const [_result1] = await db.execute(sql`SELECT * FROM soil_analyses WHERE terroir_name = ${terroir1}`) as unknown as [any[]];
  const result1 = ((_result1[0] as unknown) as unknown[])[0] as Record<string, unknown> | undefined;
  const [_result2] = await db.execute(sql`SELECT * FROM soil_analyses WHERE terroir_name = ${terroir2}`) as unknown as [any[]];
  const result2 = ((_result2[0] as unknown) as unknown[])[0] as Record<string, unknown> | undefined;
  
  return {
    terroir1: ((result1 as unknown) as unknown[])[0] || null,
    terroir2: ((result2 as unknown) as unknown[])[0] || null
  };
}


// --- Pyrolysis Transformations ---

/**
 * Ligne de `pyrolysis_transformations` telle que la lit l'interface.
 *
 * ⚠ ÉCART DE SCHÉMA NON RÉSOLU. La table versionnée (migration
 * `0000_ambitious_wolfpack.sql`, jamais modifiée par un ALTER) déclare
 * `original_molecule_id`, `product_molecule_id`, `temperature`, `duration`,
 * `oxygen`, `yield_percentage`, `conditions` — AUCUNE des colonnes ci-dessous.
 * Or les trois requêtes de ce fichier filtrent sur `source_molecule` et
 * trient sur `temperature_range`, et la fiche molécule lit `zone_name`,
 * `toxicity_level`, `temperature_min` / `temperature_max`.
 *
 * De deux choses l'une : soit la table a été remaniée en production sans
 * migration (comme les 114 autres tables identifiées par l'audit), soit ces
 * requêtes échouent en « Unknown column » et le panneau Pyrolyse est mort.
 * Impossible de trancher sans interroger la base — à vérifier avec Ted par un
 * `SHOW CREATE TABLE pyrolysis_transformations`.
 *
 * Le type décrit ce que le code attend ; il ne prouve pas que la base
 * l'expose.
 */
export interface PyrolysisTransformationRow {
  id: number;
  source_molecule: string | null;
  product_molecule: string | null;
  temperature_min: number | null;
  temperature_max: number | null;
  temperature_range: string | null;
  zone_name: string | null;
  toxicity_level: string | null;
  olfactory_before: string | null;
  olfactory_after: string | null;
  mechanism: string | null;
  notes: string | null;
  yield_percentage: string | number | null;
}

export async function getPyrolysisTransformationsByMolecule(moleculeName: string) {
  const db = await getDb();
  if (!db) return [];
  
  const [result] = await db.execute(sql`
    SELECT * FROM pyrolysis_transformations 
    WHERE source_molecule = ${moleculeName}
    ORDER BY temperature_range ASC
  `) as unknown as [any[]];
   return result as unknown as PyrolysisTransformationRow[];
}
export async function getPyrolysisTransformationsByProduct(productName: string) {
  const db = await getDb();
  if (!db) return [];
  
  const [result] = await db.execute(sql`
    SELECT * FROM pyrolysis_transformations 
    WHERE product_molecule = ${productName}
    ORDER BY temperature_range ASC
  `) as unknown as [any[]];
   return result as unknown as PyrolysisTransformationRow[];
}
export async function getAllPyrolysisTransformations() {
  const db = await getDb();
  if (!db) return [];
  
  const [result] = await db.execute(sql`
    SELECT * FROM pyrolysis_transformations ORDER BY source_molecule, temperature_range
  `) as unknown as [any[]];
  // mysql2 retourne [rows, fields] — on prend result[0] pour les lignes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = Array.isArray(result) && Array.isArray((result as Record<string, unknown>[])[0])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? (result as Record<string, unknown>[])[0]
    : result as unknown[];
  return rows;
}

export async function getTemperatureZones() {
  const db = await getDb();
  if (!db) return [];
  
  const [result] = await db.execute(sql`
    SELECT * FROM temperature_zones ORDER BY temp_min ASC
  `) as unknown as [any[]];
  return result as unknown[];
}
export async function getLandracePyrolysisProfiles() {
  const db = await getDb();
  if (!db) return [];
  
  const [result] = await db.execute(sql`
    SELECT * FROM landrace_pyrolysis_profiles ORDER BY landrace_name
  `) as unknown as [any[]];
   return result as unknown[];
}
export async function getLandracePyrolysisProfile(landraceName: string) {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.execute(sql`
    SELECT * FROM landrace_pyrolysis_profiles WHERE landrace_name = ${landraceName}
  `) as unknown as [any[]];
  const rows = result as unknown[];
  return rows[0] || null;
}


export async function getPlantFamiliesWithCategories(): Promise<{family: string; count: number; categories: { category: string; count: number }[]}[]> {
  const db = await getDb();
  if (!db) return [];
  const [familyRows] = await db.execute(sql`SELECT family, COUNT(*) as count FROM plants WHERE family IS NOT NULL AND family != '' GROUP BY family ORDER BY count DESC`) as unknown as [Record<string,unknown>[]];
  const families = familyRows.map((r) => ({family: r.family as string, count: Number(r.count)}));
  const results: {family: string; count: number; categories: { category: string; count: number }[]}[] = [];
  for (const { family, count } of families) {
    const familyVal = family;
    const [catRows] = await db.execute(sql`SELECT category, COUNT(*) as count FROM plants WHERE family = ${familyVal} GROUP BY category ORDER BY count DESC`) as unknown as [Record<string,unknown>[]];
    const categories = catRows.map((r) => ({category: r.category as string, count: Number(r.count)}));
    results.push({ family, count, categories });
  }
  return results;
}


// === SMILES et PubChem ===

interface MoleculeWithSmiles {
  id: number;
  name: string;
  smiles: string | null;
  pubchem_cid: number | null;
  chemicalFormula: string | null;
  molecularWeight: number | null;
  cas_number: string | null;
  chemical_class: string | null;
  iupac_name: string | null;
  inchi: string | null;
  inchi_key: string | null;
}

export async function getMoleculesWithSmiles(params: {
  search?: string;
  chemicalClass?: string;
  limit?: number;
  offset?: number;
}): Promise<{ molecules: MoleculeWithSmiles[]; total: number }> {
  const db = await getDb();
  if (!db) return { molecules: [], total: 0 };
  
  const { search, chemicalClass, limit = 20, offset = 0 } = params;
  
  let whereClause = "WHERE (smiles IS NOT NULL AND smiles != '') OR pubchem_cid IS NOT NULL";
  const queryParams: (string | number)[] = [];
  
  if (search) {
    whereClause += " AND (name LIKE ? OR cas_number LIKE ? OR chemicalFormula LIKE ?)";
    const searchPattern = `%${search}%`;
    queryParams.push(searchPattern, searchPattern, searchPattern);
  }
  
  if (chemicalClass) {
    whereClause += " AND chemical_class = ?";
    queryParams.push(chemicalClass);
  }
  
  // Count total
  const countQuery = `SELECT COUNT(*) as total FROM molecules ${whereClause}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _countResult = await (db as any).query(countQuery, queryParams);
  const countResult = _countResult[0];
  const total = Number(((countResult as unknown[])[0] as Record<string,unknown>)?.total || 0);
  
  // Get molecules
  const selectQuery = `
    SELECT id, name, smiles, pubchem_cid, chemicalFormula, molecularWeight, 
           cas_number, chemical_class, iupac_name, inchi, inchi_key
    FROM molecules 
    ${whereClause}
    ORDER BY name ASC
    LIMIT ? OFFSET ?
  `;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [molecules] = await (db as any).execute(selectQuery, [...queryParams, limit, offset]);
  
  return { molecules: molecules as MoleculeWithSmiles[], total };
}

export async function getChemicalClasses(): Promise<{ name: string; count: number }[]> {
  const db = await getDb();
  if (!db) return [];
  
  const [result] = await db.execute(sql`
    SELECT chemical_class as name, COUNT(*) as count 
    FROM molecules 
    WHERE chemical_class IS NOT NULL AND chemical_class != ''
    GROUP BY chemical_class 
    ORDER BY count DESC
  `) as unknown as [any[]];
  
  return (result as unknown[]).map(r => ({
    name: (r as Record<string, unknown>).name as string,
    count: Number((r as Record<string, unknown>).count)
  }));
}

export async function getSmilesStats(): Promise<{
  total: number;
  withSmiles: number;
  withPubChem: number;
  withCas: number;
  withInchi: number;
}> {
  const db = await getDb();
  if (!db) return { total: 0, withSmiles: 0, withPubChem: 0, withCas: 0, withInchi: 0 };
  
  const [result] = await db.execute(sql`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN smiles IS NOT NULL AND smiles != '' THEN 1 ELSE 0 END) as withSmiles,
      SUM(CASE WHEN pubchem_cid IS NOT NULL THEN 1 ELSE 0 END) as withPubChem,
      SUM(CASE WHEN cas_number IS NOT NULL AND cas_number != '' THEN 1 ELSE 0 END) as withCas,
      SUM(CASE WHEN inchi IS NOT NULL AND inchi != '' THEN 1 ELSE 0 END) as withInchi
    FROM molecules
  `) as unknown as [any[]];
  
  const row = (result as unknown[])[0] as Record<string, unknown>;
  return {
    total: Number(row?.total || 0),
    withSmiles: Number(row?.withSmiles || 0),
    withPubChem: Number(row?.withPubChem || 0),
    withCas: Number(row?.withCas || 0),
    withInchi: Number(row?.withInchi || 0)
  };
}


// === ENRICHISSEMENT PUBCHEM INDIVIDUEL (avec traduction FR→EN) ===


export async function enrichMoleculeFromPubChemWithTranslation(moleculeId: number): Promise<{
  success: boolean;
  message: string;
  data?: {
    pubchemCid: number;
    smiles?: string;
    casNumber?: string;
    iupacName?: string;
    molecularWeight?: number;
    molecularFormula?: string;
  };
}> {
  const db = await getDb();
  if (!db) return { success: false, message: 'Database connection failed' };
  
  // Récupérer la molécule via Drizzle ORM
  const molRows = await db.select({
    id: molecules.id,
    name: molecules.name,
    pubchemCid: molecules.pubchemCid,
  }).from(molecules).where(eq(molecules.id, moleculeId)).limit(1);
  
  if (molRows.length === 0) {
    return { success: false, message: 'Molécule non trouvée' };
  }
  
  const molecule = molRows[0];
  
  if (molecule.pubchemCid) {
    return { success: false, message: 'Cette molécule est déjà enrichie via PubChem' };
  }
  
  // Enrichir via PubChem avec traduction
  const result = await enrichMoleculeWithTranslation(molecule.name);
  
  if (!result.success || !result.pubchemCID) {
    // Fallback vers ChEBI si PubChem échoue
    console.log(`[PubChem] Échec pour "${molecule.name}", tentative via ChEBI...`);
    const chebiResult = await enrichMoleculeWithTranslationChEBI(molecule.name);
    
    if (chebiResult.success && chebiResult.chebiId) {
      // Mettre à jour avec les données ChEBI via Drizzle
      await db.update(molecules).set({
        chebiId: chebiResult.chebiId,
        smiles: chebiResult.smiles || undefined,
        inchi: chebiResult.inchi || undefined,
        inchiKey: chebiResult.inchiKey || undefined,
        chemicalFormula: chebiResult.formula || undefined,
        molecularWeight: chebiResult.mass ? Math.round(chebiResult.mass) : undefined,
        chebiEnrichedAt: new Date(),
      }).where(eq(molecules.id, moleculeId));
      
      return {
        success: true,
        message: `Molécule enrichie via ChEBI (fallback) - ID: ${chebiResult.chebiId}`,
        data: {
          pubchemCid: 0,
          smiles: chebiResult.smiles,
          casNumber: undefined,
          iupacName: undefined,
          molecularWeight: chebiResult.mass,
          molecularFormula: chebiResult.formula
        }
      };
    }
    
    return { 
      success: false, 
      message: result.error || 'Molécule non trouvée dans PubChem ni ChEBI'
    };
  }
  
  // Mettre à jour la base de données via Drizzle
  await db.update(molecules).set({
    pubchemCid: result.pubchemCID,
    smiles: result.smiles || undefined,
    inchi: result.inchi || undefined,
    inchiKey: result.inchiKey || undefined,
    casNumber: result.casNumber || undefined,
    iupacName: result.iupacName || undefined,
    chemicalFormula: result.molecularFormula || undefined,
    molecularWeight: result.molecularWeight ? Math.round(result.molecularWeight) : undefined,
    pubchemEnrichedAt: new Date(),
  }).where(eq(molecules.id, moleculeId));
  
  return {
    success: true,
    message: `Molécule enrichie avec succès (CID: ${result.pubchemCID})`,
    data: {
      pubchemCid: result.pubchemCID,
      smiles: result.smiles,
      casNumber: result.casNumber,
      iupacName: result.iupacName,
      molecularWeight: result.molecularWeight,
      molecularFormula: result.molecularFormula
    }
  };
}


// === STATISTIQUES ET LISTE DES MOLÉCULES POUR ENRICHISSEMENT ===

export async function getPubChemEnrichmentStats(): Promise<{
  total: number;
  enriched: number;
  unenriched: number;
}> {
  const db = await getDb();
  if (!db) return { total: 0, enriched: 0, unenriched: 0 };
  
  const totalResult = await db.select({ count: count() }).from(molecules);
  const enrichedResult = await db.select({ count: count() }).from(molecules).where(isNotNull(molecules.pubchemCid));
  
  const total = totalResult[0]?.count || 0;
  const enriched = enrichedResult[0]?.count || 0;
  
  return {
    total,
    enriched,
    unenriched: total - enriched
  };
}

export async function getUnenrichedMolecules(limit: number = 50): Promise<Array<{ id: number; name: string }>> {
  const db = await getDb();
  if (!db) return [];
  
  const rows = await db
    .select({ id: molecules.id, name: molecules.name })
    .from(molecules)
    .where(isNull(molecules.pubchemCid))
    .orderBy(asc(molecules.name))
    .limit(limit);
  
  return rows;
}


// === ENRICHISSEMENT ChEBI (Alternative à PubChem) ===

export async function enrichMoleculeFromChEBIWithTranslation(moleculeId: number): Promise<{
  success: boolean;
  message: string;
  chebiId?: string;
  data?: {
    chebiId: string;
    smiles?: string;
    inchi?: string;
    formula?: string;
    mass?: number;
  };
}> {
  const db = await getDb();
  if (!db) return { success: false, message: 'Database connection failed' };
  
  // Récupérer la molécule via Drizzle ORM
  const molRows = await db.select({
    id: molecules.id,
    name: molecules.name,
    pubchemCid: molecules.pubchemCid,
    chebiId: molecules.chebiId,
  }).from(molecules).where(eq(molecules.id, moleculeId)).limit(1);
  
  if (molRows.length === 0) {
    return { success: false, message: 'Molécule non trouvée' };
  }
  
  const molecule = molRows[0];
  
  // Vérifier si déjà enrichie via PubChem ou ChEBI
  if (molecule.pubchemCid) {
    return { success: false, message: 'Cette molécule est déjà enrichie via PubChem' };
  }
  
  if (molecule.chebiId) {
    return { success: false, message: 'Cette molécule est déjà enrichie via ChEBI' };
  }
  
  // Enrichir via ChEBI
  const result = await enrichMoleculeWithTranslationChEBI(molecule.name);
  
  if (!result.success || !result.chebiId) {
    return { 
      success: false, 
      message: result.error || 'Molécule non trouvée dans ChEBI'
    };
  }
  
  // Mettre à jour la base de données via Drizzle
  await db.update(molecules).set({
    chebiId: result.chebiId,
    smiles: result.smiles || undefined,
    inchi: result.inchi || undefined,
    inchiKey: result.inchiKey || undefined,
    chemicalFormula: result.formula || undefined,
    molecularWeight: result.mass ? Math.round(result.mass) : undefined,
    chebiEnrichedAt: new Date(),
  }).where(eq(molecules.id, moleculeId));
  
  return {
    success: true,
    message: `Molécule enrichie via ChEBI (ID: ${result.chebiId})`,
    chebiId: result.chebiId,
    data: {
      chebiId: result.chebiId,
      smiles: result.smiles,
      inchi: result.inchi,
      formula: result.formula,
      mass: result.mass,
    }
  };
}

export async function getUnenrichedMoleculesForChEBI(limit: number = 50): Promise<Array<{ id: number; name: string }>> {
  const db = await getDb();
  if (!db) return [];
  
  // Molécules sans PubChem ET sans ChEBI
  const rows = await db
    .select({ id: molecules.id, name: molecules.name })
    .from(molecules)
    .where(
      and(
        isNull(molecules.pubchemCid),
        or(
          isNull(molecules.chebiId),
          sql`${molecules.chebiId} = ''`
        )
      )
    )
    .orderBy(asc(molecules.name))
    .limit(limit);
  
  return rows;
}


