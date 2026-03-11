// @ts-nocheck
/**
 * Module: research_axes
 * Généré automatiquement depuis server/db.ts
 * Sections: RESEARCH AXES, RESEARCH ENTRIES, AXIS CONNECTIONS (for D3.js graph) (+3 autres)
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
// RESEARCH AXES
// ====================================================================
// ============================================================================
// RESEARCH AXES
// ============================================================================

export async function getAllResearchAxes(filters?: {
  status?: string;
  category?: string;
  priority?: string;
  parentAxisId?: number | null;
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(researchAxes);
  
  const conditions: any[] = [];
  
  if (filters?.status) {
    conditions.push(eq(researchAxes.status, filters.status as any));
  }
  if (filters?.category) {
    conditions.push(eq(researchAxes.category, filters.category as any));
  }
  if (filters?.priority) {
    conditions.push(eq(researchAxes.priority, filters.priority as any));
  }
  if (filters?.parentAxisId !== undefined) {
    if (filters.parentAxisId === null) {
      conditions.push(isNull(researchAxes.parentAxisId));
    } else {
      conditions.push(eq(researchAxes.parentAxisId, filters.parentAxisId));
    }
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  return query.orderBy(researchAxes.axisCode);
}

export async function getResearchAxisById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [axis] = await db.select().from(researchAxes).where(eq(researchAxes.id, id));
  return axis || null;
}

export async function getResearchAxisByCode(code: string) {
  const db = await getDb();
  if (!db) return null;
  
  const [axis] = await db.select().from(researchAxes).where(eq(researchAxes.axisCode, code));
  return axis || null;
}

export async function createResearchAxis(data: InsertResearchAxis) {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.insert(researchAxes).values(data);
  return getResearchAxisById(result.insertId);
}

export async function updateResearchAxis(id: number, data: Partial<InsertResearchAxis>) {
  const db = await getDb();
  if (!db) return null;
  
  await db.update(researchAxes)
    .set(data as any)
    .where(eq(researchAxes.id, id));
  
  return getResearchAxisById(id);
}

export async function deleteResearchAxis(id: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(researchAxes).where(eq(researchAxes.id, id));
  return true;
}

export async function getResearchAxesStats() {
  const db = await getDb();
  if (!db) return null;
  
  const [totalCount] = await db.select({ count: count() }).from(researchAxes);
  
  const byStatus = await db
    .select({
      status: researchAxes.status,
      count: count(),
    })
    .from(researchAxes)
    .groupBy(researchAxes.status);
  
  const byCategory = await db
    .select({
      category: researchAxes.category,
      count: count(),
    })
    .from(researchAxes)
    .groupBy(researchAxes.category);
  
  // Calcul de la progression moyenne
  const allAxes = await db.select({ progress: researchAxes.progressPercent }).from(researchAxes);
  const avgProgress = allAxes.length > 0 
    ? Math.round(allAxes.reduce((sum, a) => sum + (a.progress || 0), 0) / allAxes.length)
    : 0;
  
  return {
    total: totalCount.count,
    byStatus,
    byCategory,
    averageProgress: avgProgress,
  };
}


// ====================================================================
// RESEARCH ENTRIES
// ====================================================================
// ============================================================================
// RESEARCH ENTRIES
// ============================================================================

export async function getAllResearchEntries(filters?: {
  axisId?: number;
  entryType?: string;
  status?: string;
  importance?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(researchEntries);
  
  const conditions: any[] = [];
  
  if (filters?.axisId) {
    conditions.push(eq(researchEntries.axisId, filters.axisId));
  }
  if (filters?.entryType) {
    conditions.push(eq(researchEntries.entryType, filters.entryType as any));
  }
  if (filters?.status) {
    conditions.push(eq(researchEntries.status, filters.status as any));
  }
  if (filters?.importance) {
    conditions.push(eq(researchEntries.importance, filters.importance as any));
  }
  if (filters?.search) {
    conditions.push(
      or(
        like(researchEntries.title, `%${filters.search}%`),
        like(researchEntries.content, `%${filters.search}%`),
        like(researchEntries.entryCode, `%${filters.search}%`)
      )
    );
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  query = query.orderBy(researchEntries.sortOrder, desc(researchEntries.createdAt)) as any;
  
  if (filters?.limit) {
    query = query.limit(filters.limit) as any;
  }
  if (filters?.offset) {
    query = query.offset(filters.offset) as any;
  }
  
  return query;
}

export async function getResearchEntryById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [entry] = await db.select().from(researchEntries).where(eq(researchEntries.id, id));
  return entry || null;
}

export async function getResearchEntryByCode(code: string) {
  const db = await getDb();
  if (!db) return null;
  
  const [entry] = await db.select().from(researchEntries).where(eq(researchEntries.entryCode, code));
  return entry || null;
}

export async function createResearchEntry(data: InsertResearchEntry) {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.insert(researchEntries).values(data);
  return getResearchEntryById(result.insertId);
}

export async function updateResearchEntry(id: number, data: Partial<InsertResearchEntry>) {
  const db = await getDb();
  if (!db) return null;
  
  await db.update(researchEntries)
    .set(data as any)
    .where(eq(researchEntries.id, id));
  
  return getResearchEntryById(id);
}

export async function deleteResearchEntry(id: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(researchEntries).where(eq(researchEntries.id, id));
  return true;
}

export async function getResearchEntriesByAxis(axisId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(researchEntries)
    .where(eq(researchEntries.axisId, axisId))
    .orderBy(researchEntries.sortOrder, desc(researchEntries.createdAt));
}

export async function getNextEntryCode(axisCode: string) {
  const db = await getDb();
  if (!db) return `${axisCode}-001`;
  
  // Trouver le dernier code pour cet axe
  const entries = await db
    .select({ code: researchEntries.entryCode })
    .from(researchEntries)
    .where(like(researchEntries.entryCode, `${axisCode}-%`))
    .orderBy(desc(researchEntries.entryCode))
    .limit(1);
  
  if (entries.length === 0) {
    return `${axisCode}-001`;
  }
  
  const lastCode = entries[0].code;
  const lastNumber = parseInt(lastCode.split('-').pop() || '0', 10);
  const nextNumber = (lastNumber + 1).toString().padStart(3, '0');
  
  return `${axisCode}-${nextNumber}`;
}


// ====================================================================
// AXIS CONNECTIONS (for D3.js graph)
// ====================================================================
// ============================================================================
// AXIS CONNECTIONS (for D3.js graph)
// ============================================================================

/**
 * Get all axis connections
 */
export async function getAllAxisConnections() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(axisConnections)
    .orderBy(desc(axisConnections.strength));
}

/**
 * Get axis connections for a specific axis
 */
export async function getAxisConnectionsForAxis(axisId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(axisConnections)
    .where(
      or(
        eq(axisConnections.sourceAxisId, axisId),
        eq(axisConnections.targetAxisId, axisId)
      )
    );
}

/**
 * Get graph data for D3.js visualization
 */
export async function getAxisGraphData() {
  const db = await getDb();
  if (!db) return { nodes: [], links: [] };
  // Get all axes as nodes
  const axes = await getAllThematicAxes();
  
  // Get all connections as links
  const connections = await getAllAxisConnections();
  
  // Get reference counts per axis
  const refCounts = await db
    .select({
      axisCode: v3References.axisPrimaryCode,
      count: count(),
    })
    .from(v3References)
    .where(isNotNull(v3References.axisPrimaryCode))
    .groupBy(v3References.axisPrimaryCode);
  
  const countMap = new Map(refCounts.map(r => [r.axisCode?.split(' ')[0], r.count]));
  
  // Build nodes with reference counts
  const nodes = axes.map(axis => ({
    id: axis.id,
    code: axis.axisCode,
    name: axis.name,
    metaAxis: axis.metaAxis,
    color: axis.color,
    referenceCount: countMap.get(axis.axisCode) || 0,
  }));
  
  // Build links
  const links = connections.map((conn: any) => ({
    source: conn.sourceAxisId,
    target: conn.targetAxisId,
    strength: conn.strength,
    type: conn.connectionType,
  }));
  
  return { nodes, links };
}

/**
 * Create an axis connection
 */
export async function createAxisConnection(data: {
  sourceAxisId: number;
  targetAxisId: number;
  strength?: number;
  connectionType?: string;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) return { success: false };
  await db
    .insert(axisConnections)
    .values(data as any)
    .onDuplicateKeyUpdate({ set: { strength: data.strength } });
  return { success: true };
}

/**
 * Update axis connection strength
 */
export async function updateAxisConnectionStrength(sourceId: number, targetId: number, strength: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db
    .update(axisConnections)
    .set({ strength })
    .where(
      and(
        eq(axisConnections.sourceAxisId, sourceId),
        eq(axisConnections.targetAxisId, targetId)
      )
    );
  return { success: true };
}

/**
 * Delete an axis connection
 */
export async function deleteAxisConnection(sourceId: number, targetId: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db
    .delete(axisConnections)
    .where(
      and(
        eq(axisConnections.sourceAxisId, sourceId),
        eq(axisConnections.targetAxisId, targetId)
      )
    );
  return { success: true };
}




// ====================================================================
// SUB-AXES (Sous-axes de recherche)
// ====================================================================
// ============================================================================
// SUB-AXES (Sous-axes de recherche)
// ============================================================================

export async function getSubAxes(parentAxisId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(researchAxes)
    .where(eq(researchAxes.parentAxisId, parentAxisId))
    .orderBy(researchAxes.axisCode);
}

export async function getAxisWithSubAxes(axisId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [axis] = await db.select().from(researchAxes).where(eq(researchAxes.id, axisId));
  if (!axis) return null;
  
  const subAxes = await getSubAxes(axisId);
  
  return {
    ...axis,
    subAxes,
  };
}

export async function getAxisHierarchy() {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer tous les axes principaux (sans parent)
  const mainAxes = await db
    .select()
    .from(researchAxes)
    .where(isNull(researchAxes.parentAxisId))
    .orderBy(researchAxes.axisCode);
  
  // Pour chaque axe principal, récupérer ses sous-axes
  const hierarchy = await Promise.all(
    mainAxes.map(async (axis) => {
      const subAxes = await getSubAxes(axis.id);
      return {
        ...axis,
        subAxes,
      };
    })
  );
  
  return hierarchy;
}



// ====================================================================
// AXIS REFERENCE LINKS (Liaisons axes-références pour le graphe)
// ====================================================================
// ============================================================================
// AXIS REFERENCE LINKS (Liaisons axes-références pour le graphe)
// ============================================================================

/**
 * Récupère toutes les liaisons axes-références
 */
export async function getAllAxisReferenceLinks(filters?: {
  axisId?: number;
  referenceId?: number;
  linkType?: string;
  confidence?: string;
}) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions: any[] = [];
  
  if (filters?.axisId) {
    conditions.push(eq(axisReferenceLinks.axisId, filters.axisId));
  }
  if (filters?.referenceId) {
    conditions.push(eq(axisReferenceLinks.referenceId, filters.referenceId));
  }
  if (filters?.linkType) {
    conditions.push(eq(axisReferenceLinks.linkType, filters.linkType as any));
  }
  if (filters?.confidence) {
    conditions.push(eq(axisReferenceLinks.confidence, filters.confidence as any));
  }
  
  let query = db.select().from(axisReferenceLinks);
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  return query.orderBy(desc(axisReferenceLinks.relevanceScore));
}

/**
 * Récupère une liaison par ID
 */
export async function getAxisReferenceLinkById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [link] = await db.select().from(axisReferenceLinks).where(eq(axisReferenceLinks.id, id));
  return link || null;
}

/**
 * Récupère les liaisons pour un axe avec les détails des références
 */
export async function getAxisReferenceLinksWithDetails(axisId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const links = await db
    .select()
    .from(axisReferenceLinks)
    .where(eq(axisReferenceLinks.axisId, axisId))
    .orderBy(desc(axisReferenceLinks.relevanceScore));
  
  // Enrichir avec les détails des références
  const enrichedLinks = await Promise.all(
    links.map(async (link) => {
      const [reference] = await db
        .select()
        .from(v3References)
        .where(eq(v3References.id, link.referenceId));
      return { ...link, reference };
    })
  );
  
  return enrichedLinks;
}

/**
 * Récupère les liaisons pour une référence avec les détails des axes
 */
export async function getReferenceAxisLinksWithDetails(referenceId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const links = await db
    .select()
    .from(axisReferenceLinks)
    .where(eq(axisReferenceLinks.referenceId, referenceId))
    .orderBy(desc(axisReferenceLinks.relevanceScore));
  
  // Enrichir avec les détails des axes
  const enrichedLinks = await Promise.all(
    links.map(async (link) => {
      const [axis] = await db
        .select()
        .from(researchAxes)
        .where(eq(researchAxes.id, link.axisId));
      return { ...link, axis };
    })
  );
  
  return enrichedLinks;
}

/**
 * Crée une nouvelle liaison axe-référence
 */
export async function createAxisReferenceLink(data: {
  axisId: number;
  referenceId: number;
  linkType?: string;
  relevanceScore?: number;
  confidence?: string;
  notes?: string;
  excerpt?: string;
  pageNumbers?: string;
  displayWeight?: number;
  isHighlighted?: boolean;
  createdBy?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  const [result] = await db.insert(axisReferenceLinks).values(data as any);
  return { id: result.insertId, ...data };
}

/**
 * Met à jour une liaison axe-référence
 */
export async function updateAxisReferenceLink(id: number, data: {
  linkType?: string;
  relevanceScore?: number;
  confidence?: string;
  notes?: string;
  excerpt?: string;
  pageNumbers?: string;
  displayWeight?: number;
  isHighlighted?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  await db.update(axisReferenceLinks).set(data as any).where(eq(axisReferenceLinks.id, id));
  return getAxisReferenceLinkById(id);
}

/**
 * Supprime une liaison axe-référence
 */
export async function deleteAxisReferenceLink(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  await db.delete(axisReferenceLinks).where(eq(axisReferenceLinks.id, id));
  return { success: true };
}

/**
 * Récupère les données du graphe axes-références pour D3.js
 */
export async function getAxisReferenceGraphData() {
  const db = await getDb();
  if (!db) return { nodes: [], links: [] };
  
  // Récupérer tous les axes
  const axes = await db.select().from(researchAxes);
  
  // Récupérer toutes les références liées
  const allLinks = await db.select().from(axisReferenceLinks);
  const linkedRefIds = Array.from(new Set(allLinks.map(l => l.referenceId)));
  
  // Récupérer les références liées
  let references: any[] = [];
  if (linkedRefIds.length > 0) {
    references = await db
      .select()
      .from(v3References)
      .where(inArray(v3References.id, linkedRefIds));
  }
  
  // Construire les nœuds
  const nodes: Array<{
    id: string;
    type: 'axis' | 'reference';
    label: string;
    code?: string;
    year?: number;
    color?: string;
    size?: number;
  }> = [];
  
  // Ajouter les axes comme nœuds
  axes.forEach(axis => {
    nodes.push({
      id: `axis-${axis.id}`,
      type: 'axis',
      label: axis.name,
      code: axis.axisCode,
      color: '#8b5cf6', // Violet pour les axes
      size: 30,
    });
  });
  
  // Ajouter les références comme nœuds
  references.forEach(ref => {
    nodes.push({
      id: `ref-${ref.id}`,
      type: 'reference',
      label: ref.title.substring(0, 50) + (ref.title.length > 50 ? '...' : ''),
      year: ref.year,
      color: '#3b82f6', // Bleu pour les références
      size: 15,
    });
  });
  
  // Construire les liens
  const links = allLinks.map(link => ({
    source: `axis-${link.axisId}`,
    target: `ref-${link.referenceId}`,
    type: link.linkType,
    weight: link.displayWeight || 1,
    highlighted: link.isHighlighted,
    relevance: link.relevanceScore,
  }));
  
  return { nodes, links };
}

/**
 * Statistiques des liaisons axes-références
 */
export async function getAxisReferenceLinkStats() {
  const db = await getDb();
  if (!db) return null;
  
  // Total des liaisons
  const [totalResult] = await db.select({ count: count() }).from(axisReferenceLinks);
  const total = totalResult?.count || 0;
  
  // Par type de liaison
  const byType = await db
    .select({
      linkType: axisReferenceLinks.linkType,
      count: count(),
    })
    .from(axisReferenceLinks)
    .groupBy(axisReferenceLinks.linkType);
  
  // Par niveau de confiance
  const byConfidence = await db
    .select({
      confidence: axisReferenceLinks.confidence,
      count: count(),
    })
    .from(axisReferenceLinks)
    .groupBy(axisReferenceLinks.confidence);
  
  // Axes avec le plus de références
  const topAxes = await db
    .select({
      axisId: axisReferenceLinks.axisId,
      count: count(),
    })
    .from(axisReferenceLinks)
    .groupBy(axisReferenceLinks.axisId)
    .orderBy(desc(count()))
    .limit(10);
  
  // Enrichir avec les noms des axes
  const topAxesWithNames = await Promise.all(
    topAxes.map(async (item) => {
      const [axis] = await db.select().from(researchAxes).where(eq(researchAxes.id, item.axisId));
      return {
        axisId: item.axisId,
        axisCode: axis?.axisCode,
        axisName: axis?.name,
        count: item.count,
      };
    })
  );
  
  // Références les plus liées
  const topReferences = await db
    .select({
      referenceId: axisReferenceLinks.referenceId,
      count: count(),
    })
    .from(axisReferenceLinks)
    .groupBy(axisReferenceLinks.referenceId)
    .orderBy(desc(count()))
    .limit(10);
  
  return {
    total,
    byType,
    byConfidence,
    topAxes: topAxesWithNames,
    topReferences,
  };
}

/**
 * Créer plusieurs liaisons en masse
 */
export async function bulkCreateAxisReferenceLinks(links: Array<{
  axisId: number;
  referenceId: number;
  linkType?: string;
  relevanceScore?: number;
  confidence?: string;
  notes?: string;
  createdBy?: number;
}>) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  let created = 0;
  const errors: string[] = [];
  
  for (const link of links) {
    try {
      await db.insert(axisReferenceLinks).values(link as any);
      created++;
    } catch (error: any) {
      if (!error.message.includes('Duplicate')) {
        errors.push(`Erreur pour axe ${link.axisId} - ref ${link.referenceId}: ${error.message}`);
      }
    }
  }
  
  return { created, errors, total: links.length };
}



// ====================================================================
// FORCE GRAPH DATA FOR REFERENCES-AXES VISUALIZATION
// ====================================================================
// ============================================================================
// FORCE GRAPH DATA FOR REFERENCES-AXES VISUALIZATION
// ============================================================================

/**
 * Get comprehensive force graph data for D3.js visualization
 * Includes both axes and references as nodes with their connections
 */
export async function getForceGraphDataReferencesAxes(options?: {
  includeReferences?: boolean;
  metaAxisFilter?: string;
  minRelevanceScore?: number;
}) {
  const db = await getDb();
  if (!db) return { nodes: [], links: [], stats: {} };
  
  const includeReferences = options?.includeReferences ?? true;
  const metaAxisFilter = options?.metaAxisFilter;
  const minRelevanceScore = options?.minRelevanceScore ?? 0;
  
  // Get all thematic axes
  const axes = metaAxisFilter && metaAxisFilter !== 'all'
    ? await db.select().from(thematicAxes).where(eq(thematicAxes.metaAxis, metaAxisFilter as any)).orderBy(thematicAxes.displayOrder)
    : await db.select().from(thematicAxes).orderBy(thematicAxes.displayOrder);
  
  // Get all v3 references with their primary axis
  let references: typeof v3References.$inferSelect[] = [];
  if (metaAxisFilter && metaAxisFilter !== 'all') {
    // Filter references by meta-axis through their primary axis
    const axisIds = axes.map(a => a.id);
    if (axisIds.length > 0) {
      references = await db.select().from(v3References).where(inArray(v3References.axisPrimaryId, axisIds)).orderBy(desc(v3References.year));
    }
  } else {
    references = await db.select().from(v3References).orderBy(desc(v3References.year));
  }
  
  // Build axis nodes
  const axisNodes = axes.map(axis => ({
    id: `axis-${axis.id}`,
    numericId: axis.id,
    type: 'axis' as const,
    code: axis.axisCode,
    name: axis.name,
    metaAxis: axis.metaAxis,
    color: axis.color || getMetaAxisColor(axis.metaAxis),
    description: axis.description,
    outputTypes: axis.outputTypes,
    size: 30, // Base size for axes
  }));
  
  // Build reference nodes (if enabled)
  const referenceNodes = includeReferences ? references.map(ref => ({
    id: `ref-${ref.id}`,
    numericId: ref.id,
    type: 'reference' as const,
    code: ref.entryKey,
    name: ref.title || ref.entryKey,
    author: ref.authors,
    year: ref.year,
    axisPrimaryCode: ref.axisPrimaryCode,
    axisPrimaryId: ref.axisPrimaryId,
    axesSecondary: ref.axesSecondary,
    relevanceScore: ref.relevanceScore || 50,
    readStatus: ref.readStatus,
    color: getReadStatusColor(ref.readStatus),
    size: Math.max(8, Math.min(20, (ref.relevanceScore || 50) / 5)), // Size based on relevance
  })) : [];
  
  // Build links between references and axes
  const links: Array<{
    source: string;
    target: string;
    strength: number;
    type: 'primary' | 'secondary';
  }> = [];
  
  if (includeReferences) {
    for (const ref of references) {
      // Primary axis link
      if (ref.axisPrimaryId) {
        const axisNode = axisNodes.find(a => a.numericId === ref.axisPrimaryId);
        if (axisNode) {
          links.push({
            source: `ref-${ref.id}`,
            target: axisNode.id,
            strength: 1,
            type: 'primary',
          });
        }
      }
      
      // Secondary axes links
      if (ref.axesSecondary && Array.isArray(ref.axesSecondary)) {
        for (const secondaryCode of ref.axesSecondary) {
          const axisNode = axisNodes.find(a => a.code === secondaryCode);
          if (axisNode) {
            links.push({
              source: `ref-${ref.id}`,
              target: axisNode.id,
              strength: 0.5,
              type: 'secondary',
            });
          }
        }
      }
    }
  }
  
  // Get axis connections for inter-axis links
  const axisConnections_ = await db.select().from(axisConnections);
  for (const conn of axisConnections_) {
    const sourceNode = axisNodes.find(a => a.numericId === conn.sourceAxisId);
    const targetNode = axisNodes.find(a => a.numericId === conn.targetAxisId);
    if (sourceNode && targetNode) {
      links.push({
        source: sourceNode.id,
        target: targetNode.id,
        strength: (conn.strength || 5) / 10,
        type: 'primary',
      });
    }
  }
  
  // Calculate statistics
  const stats = {
    totalAxes: axisNodes.length,
    totalReferences: referenceNodes.length,
    totalLinks: links.length,
    referencesByMetaAxis: {
      meta_a: references.filter(r => {
        const axis = axes.find(a => a.id === r.axisPrimaryId);
        return axis?.metaAxis === 'meta_a';
      }).length,
      meta_b: references.filter(r => {
        const axis = axes.find(a => a.id === r.axisPrimaryId);
        return axis?.metaAxis === 'meta_b';
      }).length,
      meta_c: references.filter(r => {
        const axis = axes.find(a => a.id === r.axisPrimaryId);
        return axis?.metaAxis === 'meta_c';
      }).length,
    },
    axesByMetaAxis: {
      meta_a: axes.filter(a => a.metaAxis === 'meta_a').length,
      meta_b: axes.filter(a => a.metaAxis === 'meta_b').length,
      meta_c: axes.filter(a => a.metaAxis === 'meta_c').length,
    },
  };
  
  return {
    nodes: [...axisNodes, ...referenceNodes],
    links,
    stats,
  };
}

// Helper function to get color based on meta-axis
function getMetaAxisColor(metaAxis: string | null): string {
  switch (metaAxis) {
    case 'meta_a': return '#f59e0b'; // Amber - Heritage & Archives
    case 'meta_b': return '#8b5cf6'; // Purple - Arts & Chemistry
    case 'meta_c': return '#06b6d4'; // Cyan - Digital & Datasets
    default: return '#6b7280'; // Gray
  }
}

// Helper function to get color based on read status
function getReadStatusColor(status: string | null): string {
  switch (status) {
    case 'read': return '#22c55e'; // Green
    case 'reading': return '#f59e0b'; // Amber
    case 'to_review': return '#ef4444'; // Red
    default: return '#94a3b8'; // Slate
  }
}

/**
 * Get synergies data for the AI formula generator
 * Returns all documented molecular synergies with their details
 */
export async function getMolecularSynergiesForGenerator() {
  const db = await getDb();
  if (!db) return { synergies: [], rules: [], interactions: [] };
  
  // Get terpene synergies
  const terpeneSynergiesData = await db
    .select({
      id: terpeneSynergies.id,
      terpene1Id: terpeneSynergies.terpene1Id,
      terpene2Id: terpeneSynergies.terpene2Id,
      compatibilityScore: terpeneSynergies.compatibilityScore,
      synergyNotes: terpeneSynergies.synergyNotes,
    })
    .from(terpeneSynergies);
  
  // Get molecule synergies
  const moleculeSynergiesData = await db
    .select({
      id: moleculeSynergies.id,
      molecule1Id: moleculeSynergies.molecule1Id,
      molecule2Id: moleculeSynergies.molecule2Id,
      type: moleculeSynergies.type,
      description: moleculeSynergies.description,
      applications: moleculeSynergies.applications,
    })
    .from(moleculeSynergies);
  
  // Get entourage rules
  const entourageRulesData = await db
    .select()
    .from(entourageRules);
  
  // Get molecular interactions
  const molecularInteractionsData = await db
    .select()
    .from(molecularInteractions);
  
  // Get formulation suggestions
  const formulationSuggestionsData = await db
    .select()
    .from(formulationSuggestions);
  
  // Enrich synergies with molecule names
  const moleculeIds = new Set<number>();
  terpeneSynergiesData.forEach(s => {
    moleculeIds.add(s.terpene1Id);
    moleculeIds.add(s.terpene2Id);
  });
  moleculeSynergiesData.forEach(s => {
    moleculeIds.add(s.molecule1Id);
    moleculeIds.add(s.molecule2Id);
  });
  
  const moleculeNames = new Map<number, string>();
  if (moleculeIds.size > 0) {
    const mols = await db
      .select({ id: molecules.id, name: molecules.name })
      .from(molecules)
      .where(inArray(molecules.id, Array.from(moleculeIds)));
    mols.forEach(m => moleculeNames.set(m.id, m.name));
  }
  
  // Build enriched synergies
  const enrichedTerpeneSynergies = terpeneSynergiesData.map(s => ({
    ...s,
    terpene1Name: moleculeNames.get(s.terpene1Id) || `Molecule #${s.terpene1Id}`,
    terpene2Name: moleculeNames.get(s.terpene2Id) || `Molecule #${s.terpene2Id}`,
  }));
  
  const enrichedMoleculeSynergies = moleculeSynergiesData.map(s => ({
    ...s,
    molecule1Name: moleculeNames.get(s.molecule1Id) || `Molecule #${s.molecule1Id}`,
    molecule2Name: moleculeNames.get(s.molecule2Id) || `Molecule #${s.molecule2Id}`,
  }));
  
  return {
    terpeneSynergies: enrichedTerpeneSynergies,
    moleculeSynergies: enrichedMoleculeSynergies,
    entourageRules: entourageRulesData,
    molecularInteractions: molecularInteractionsData,
    formulationSuggestions: formulationSuggestionsData,
  };
}

/**
 * Get synergy suggestions for a specific molecule
 * Returns molecules that have documented synergies with the given molecule
 */
export async function getSynergySuggestionsForMolecule(moleculeId: number) {
  const db = await getDb();
  if (!db) return { moleculeId, suggestions: [] };
  
  // Get terpene synergies where this molecule is involved
  const terpeneSyns = await db
    .select()
    .from(terpeneSynergies)
    .where(
      or(
        eq(terpeneSynergies.terpene1Id, moleculeId),
        eq(terpeneSynergies.terpene2Id, moleculeId)
      )
    );
  
  // Get molecule synergies where this molecule is involved
  const molSyns = await db
    .select()
    .from(moleculeSynergies)
    .where(
      or(
        eq(moleculeSynergies.molecule1Id, moleculeId),
        eq(moleculeSynergies.molecule2Id, moleculeId)
      )
    );
  
  // Collect partner molecule IDs
  const partnerIds = new Set<number>();
  terpeneSyns.forEach(s => {
    if (s.terpene1Id === moleculeId) partnerIds.add(s.terpene2Id);
    else partnerIds.add(s.terpene1Id);
  });
  molSyns.forEach(s => {
    if (s.molecule1Id === moleculeId) partnerIds.add(s.molecule2Id);
    else partnerIds.add(s.molecule1Id);
  });
  
  if (partnerIds.size === 0) return { moleculeId, suggestions: [] };
  
  // Get partner molecule details
  const partners = await db
    .select()
    .from(molecules)
    .where(inArray(molecules.id, Array.from(partnerIds)));
  
  // Build suggestions with synergy details
  const suggestions = partners.map(partner => {
    const terpeneSyn = terpeneSyns.find(
      s => (s.terpene1Id === moleculeId && s.terpene2Id === partner.id) ||
           (s.terpene2Id === moleculeId && s.terpene1Id === partner.id)
    );
    const molSyn = molSyns.find(
      s => (s.molecule1Id === moleculeId && s.molecule2Id === partner.id) ||
           (s.molecule2Id === moleculeId && s.molecule1Id === partner.id)
    );
    
    return {
      molecule: partner,
      synergyType: molSyn?.type || 'potentialisation',
      compatibilityScore: terpeneSyn?.compatibilityScore || 70,
      description: molSyn?.description || terpeneSyn?.synergyNotes || 'Synergie documentée',
      applications: molSyn?.applications,
    };
  });
  
  // Sort by compatibility score
  const sortedSuggestions = suggestions.sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0));
  
  return { moleculeId, suggestions: sortedSuggestions };
}


