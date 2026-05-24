/**
 * Extracted from server/db/plants.ts
 * Module: Genomics
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

export async function getAllGenomicPlantLinks(): Promise<GenomicPlantLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(genomicPlantLinks).orderBy(desc(genomicPlantLinks.createdAt));
}

/**
 * Get genomic links for a plant
 */

export async function getGenomicLinksForPlant(plantId: number): Promise<GenomicPlantLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(genomicPlantLinks)
    .where(eq(genomicPlantLinks.plantId, plantId));
}

/**
 * Get genomic plant links by axis
 */

export async function getGenomicPlantLinksByAxis(axis: 'G1' | 'G2' | 'G3'): Promise<GenomicPlantLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(genomicPlantLinks)
    .where(eq(genomicPlantLinks.genomicAxis, axis))
    .orderBy(desc(genomicPlantLinks.relevanceScore));
}

/**
 * Get genomic links for a reference
 */

export async function getGenomicPlantLinksForReference(referenceId: number): Promise<GenomicPlantLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(genomicPlantLinks)
    .where(eq(genomicPlantLinks.referenceId, referenceId));
}

/**
 * Create a genomic plant link
 */

export async function createGenomicPlantLink(data: Omit<InsertGenomicPlantLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<GenomicPlantLink> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const [result] = await db.insert(genomicPlantLinks).values(data);
  const [created] = await db.select().from(genomicPlantLinks).where(eq(genomicPlantLinks.id, result.insertId));
  return created;
}

/**
 * Delete a genomic plant link
 */

export async function deleteGenomicPlantLink(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  await db.delete(genomicPlantLinks).where(eq(genomicPlantLinks.id, id));
  return true;
}

/**
 * Get genomic links statistics
 */

export async function getGenomicLinksStats(): Promise<{
  totalMoleculeLinks: number;
  totalPlantLinks: number;
  byAxis: { axis: string; moleculeCount: number; plantCount: number }[];
  byLinkType: { type: string; moleculeCount: number; plantCount: number }[];
  byConfidence: { confidence: string; moleculeCount: number; plantCount: number }[];
}> {
  const db = await getDb();
  if (!db) return { totalMoleculeLinks: 0, totalPlantLinks: 0, byAxis: [], byLinkType: [], byConfidence: [] };
  
  const [molCount] = await db.select({ count: count() }).from(genomicMoleculeLinks);
  const [plantCount] = await db.select({ count: count() }).from(genomicPlantLinks);
  
  // By axis
  const molByAxis = await db.select({
    axis: genomicMoleculeLinks.genomicAxis,
    count: count(),
  }).from(genomicMoleculeLinks).groupBy(genomicMoleculeLinks.genomicAxis);
  
  const plantByAxis = await db.select({
    axis: genomicPlantLinks.genomicAxis,
    count: count(),
  }).from(genomicPlantLinks).groupBy(genomicPlantLinks.genomicAxis);
  
  const axisMap = new Map<string, { moleculeCount: number; plantCount: number }>();
  for (const m of molByAxis) {
    axisMap.set(m.axis, { moleculeCount: m.count, plantCount: 0 });
  }
  for (const p of plantByAxis) {
    const existing = axisMap.get(p.axis) || { moleculeCount: 0, plantCount: 0 };
    axisMap.set(p.axis, { ...existing, plantCount: p.count });
  }
  
  // By type
  const molByType = await db.select({
    type: genomicMoleculeLinks.linkType,
    count: count(),
  }).from(genomicMoleculeLinks).groupBy(genomicMoleculeLinks.linkType);
  
  const plantByType = await db.select({
    type: genomicPlantLinks.linkType,
    count: count(),
  }).from(genomicPlantLinks).groupBy(genomicPlantLinks.linkType);
  
  const typeMap = new Map<string, { moleculeCount: number; plantCount: number }>();
  for (const m of molByType) {
    typeMap.set(m.type || 'other', { moleculeCount: m.count, plantCount: 0 });
  }
  for (const p of plantByType) {
    const existing = typeMap.get(p.type || 'other') || { moleculeCount: 0, plantCount: 0 };
    typeMap.set(p.type || 'other', { ...existing, plantCount: p.count });
  }
  
  // By confidence
  const molByConf = await db.select({
    confidence: genomicMoleculeLinks.confidence,
    count: count(),
  }).from(genomicMoleculeLinks).groupBy(genomicMoleculeLinks.confidence);
  
  const plantByConf = await db.select({
    confidence: genomicPlantLinks.confidence,
    count: count(),
  }).from(genomicPlantLinks).groupBy(genomicPlantLinks.confidence);
  
  const confMap = new Map<string, { moleculeCount: number; plantCount: number }>();
  for (const m of molByConf) {
    confMap.set(m.confidence || 'medium', { moleculeCount: m.count, plantCount: 0 });
  }
  for (const p of plantByConf) {
    const existing = confMap.get(p.confidence || 'medium') || { moleculeCount: 0, plantCount: 0 };
    confMap.set(p.confidence || 'medium', { ...existing, plantCount: p.count });
  }
  
  return {
    totalMoleculeLinks: molCount.count,
    totalPlantLinks: plantCount.count,
    byAxis: Array.from(axisMap.entries()).map(([axis, counts]) => ({ axis, ...counts })),
    byLinkType: Array.from(typeMap.entries()).map(([type, counts]) => ({ type, ...counts })),
    byConfidence: Array.from(confMap.entries()).map(([confidence, counts]) => ({ confidence, ...counts })),
  };
}



// ====================================================================
// GHOST VARIETY GENOMIC LINKS (Liaisons variétés fantômes ↔ molécules/plantes)
// ====================================================================
// ============================================================================
// GHOST VARIETY GENOMIC LINKS (Liaisons variétés fantômes ↔ molécules/plantes)
// ============================================================================

/**
 * Get genomic molecule links for a ghost variety (via reference)
 */

export async function bulkCreateGenomicMoleculeLinks(
  links: Array<{
    referenceId: number;
    moleculeId: number;
    genomicAxis: 'G1' | 'G2' | 'G3';
    linkType?: string;
    relevanceScore?: number;
    confidence?: 'high' | 'medium' | 'low';
    notes?: string;
  }>,
  createdBy?: number
): Promise<{ success: number; failed: number; errors: string[] }> {
  const db = await getDb();
  if (!db) return { success: 0, failed: links.length, errors: ['Database not available'] };
  
  let success = 0;
  let failed = 0;
  const errors: string[] = [];
  
  for (const link of links) {
    try {
      await db.insert(genomicMoleculeLinks).values({
        referenceId: link.referenceId,
        moleculeId: link.moleculeId,
        genomicAxis: link.genomicAxis,
        linkType: (link.linkType as 'biosynthesis'|'characterization'|'quantification'|'pathway'|'gene_association'|'regulation'|'evolution'|'application'|'other') || 'characterization',
        relevanceScore: link.relevanceScore || 50,
        confidence: link.confidence || 'medium',
        notes: link.notes,
        createdBy,
      });
      success++;
    } catch (error: unknown) {
      failed++;
      errors.push(`Failed to link molecule ${link.moleculeId}: ${(error as Error).message}`);
    }
  }
  
  return { success, failed, errors };
}

/**
 * Bulk create genomic plant links for a ghost variety
 */

export async function bulkCreateGenomicPlantLinks(
  links: Array<{
    referenceId: number;
    plantId: number;
    genomicAxis: 'G1' | 'G2' | 'G3';
    linkType?: string;
    relevanceScore?: number;
    confidence?: 'high' | 'medium' | 'low';
    notes?: string;
  }>,
  createdBy?: number
): Promise<{ success: number; failed: number; errors: string[] }> {
  const db = await getDb();
  if (!db) return { success: 0, failed: links.length, errors: ['Database not available'] };
  
  let success = 0;
  let failed = 0;
  const errors: string[] = [];
  
  for (const link of links) {
    try {
      await db.insert(genomicPlantLinks).values({
        referenceId: link.referenceId,
        plantId: link.plantId,
        genomicAxis: link.genomicAxis,
        linkType: ((link.linkType || 'genome_sequencing') as any),
        relevanceScore: link.relevanceScore || 50,
        confidence: (link.confidence || 'medium') as any,
        notes: link.notes,
        createdBy,
      } as any);
      success++;
    } catch (error: unknown) {
      failed++;
      errors.push(`Failed to link plant ${link.plantId}: ${(error as Error).message}`);
    }
  }
  
  return { success, failed, errors };
}

/**
 * Search molecules by name for autocomplete in ghost variety form
 */
