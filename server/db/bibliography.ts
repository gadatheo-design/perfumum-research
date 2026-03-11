/**
 * Module: bibliography
 * Généré automatiquement depuis server/db.ts
 * Sections: BIBLIOGRAPHY ENTRIES, BIBLIOGRAPHY-AXIS LINKS, BIBTEX PARSING UTILITIES (+9 autres)
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
// BIBLIOGRAPHY ENTRIES
// ====================================================================
// ============================================================================
// BIBLIOGRAPHY ENTRIES
// ============================================================================

export async function getAllBibliographyEntries(filters?: {
  entryType?: string;
  researchDomain?: string;
  year?: number;
  yearMin?: number;
  yearMax?: number;
  readStatus?: string;
  search?: string;
  axisId?: number;
  entityType?: string; // 'plant' | 'molecule' | 'variety' | 'any'
  hasLinks?: boolean; // true = avec liaisons, false = sans liaisons
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return { entries: [], total: 0 };
  
  const conditions: SQL[] = [];
  
  if (filters?.entryType) {
    conditions.push(eq(bibliographyEntries.entryType, filters.entryType as any));
  }
  if (filters?.researchDomain) {
    conditions.push(eq(bibliographyEntries.researchDomain, filters.researchDomain as any));
  }
  if (filters?.year) {
    conditions.push(eq(bibliographyEntries.year, filters.year));
  }
  if (filters?.yearMin) {
    conditions.push(gte(bibliographyEntries.year, filters.yearMin));
  }
  if (filters?.yearMax) {
    conditions.push(lte(bibliographyEntries.year, filters.yearMax));
  }
  if (filters?.readStatus) {
    conditions.push(eq(bibliographyEntries.readStatus, filters.readStatus as any));
  }
  if (filters?.search) {
    const searchCondition = or(
      like(bibliographyEntries.title, `%${filters.search}%`),
      like(bibliographyEntries.authors, `%${filters.search}%`),
      like(bibliographyEntries.entryKey, `%${filters.search}%`)
    );
    if (searchCondition) conditions.push(searchCondition);
  }
  
  // Filtre par type d'entité liée
  if (filters?.entityType && filters.entityType !== 'any') {
    const entityLinks = await db
      .select({ bibliographyId: sql<number>`bibliography_id` })
      .from(sql`bibliography_entity_links`)
      .where(sql`entity_type = ${filters.entityType}`);
    const bibIds = entityLinks.map((l) => l.bibliographyId);
    if (bibIds.length > 0) {
      conditions.push(inArray(bibliographyEntries.id, bibIds));
    } else {
      return { entries: [], total: 0 };
    }
  }

  // Filtre par présence de liaisons
  if (filters?.hasLinks === true) {
    conditions.push(
      sql`EXISTS (SELECT 1 FROM bibliography_entity_links bel WHERE bel.bibliography_id = ${bibliographyEntries.id})`
    );
  } else if (filters?.hasLinks === false) {
    conditions.push(
      sql`NOT EXISTS (SELECT 1 FROM bibliography_entity_links bel WHERE bel.bibliography_id = ${bibliographyEntries.id})`
    );
  }

  // Filtre par axe de recherche
  if (filters?.axisId) {
    const axisLinks = await db
      .select({ bibliographyId: bibliographyAxisLinks.bibliographyId })
      .from(bibliographyAxisLinks)
      .where(eq(bibliographyAxisLinks.axisId, filters.axisId));
    
    const bibIds = axisLinks.map(l => l.bibliographyId);
    if (bibIds.length > 0) {
      conditions.push(inArray(bibliographyEntries.id, bibIds));
    } else {
      // Aucune référence liée à cet axe
      return { entries: [], total: 0 };
    }
  }
  
  // Count total
  let countQuery = db.select({ count: sql<number>`count(*)` }).from(bibliographyEntries);
  if (conditions.length > 0) {
    // @ts-expect-error -- Drizzle query builder chain; runtime usage is correct

    countQuery = countQuery.where(and(...conditions));
  }
  const [countResult] = await countQuery;
  const total = countResult?.count || 0;
  
  // Get entries
  let query = db.select().from(bibliographyEntries);
  if (conditions.length > 0) {
    // @ts-expect-error -- Drizzle query builder chain; runtime usage is correct

    query = query.where(and(...conditions));
  }
  // @ts-expect-error -- Drizzle query builder chain; runtime usage is correct

  query = query.orderBy(desc(bibliographyEntries.year), desc(bibliographyEntries.createdAt));
  
  if (filters?.limit) {
    // @ts-expect-error -- Drizzle query builder chain; runtime usage is correct

    query = query.limit(filters.limit);
  }
  if (filters?.offset) {
    // @ts-expect-error -- Drizzle query builder chain; runtime usage is correct

    query = query.offset(filters.offset);
  }
  
  const entries = await query;
  return { entries, total };
}

export async function getBibliographyEntryById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [entry] = await db.select().from(bibliographyEntries).where(eq(bibliographyEntries.id, id));
  return entry || null;
}

export async function getBibliographyEntryByKey(entryKey: string) {
  const db = await getDb();
  if (!db) return null;
  
  const [entry] = await db.select().from(bibliographyEntries).where(eq(bibliographyEntries.entryKey, entryKey));
  return entry || null;
}

export async function createBibliographyEntry(data: InsertBibliographyEntry) {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.insert(bibliographyEntries).values(data);
  return getBibliographyEntryById(result.insertId);
}

export async function updateBibliographyEntry(id: number, data: Partial<InsertBibliographyEntry>) {
  const db = await getDb();
  if (!db) return null;
  
  await db.update(bibliographyEntries)
    .set(data as any)
    .where(eq(bibliographyEntries.id, id));
  
  return getBibliographyEntryById(id);
}

export async function deleteBibliographyEntry(id: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(bibliographyEntries).where(eq(bibliographyEntries.id, id));
  return true;
}

export async function getBibliographyStats() {
  const db = await getDb();
  if (!db) return null;
  
  const [totalCount] = await db.select({ count: count() }).from(bibliographyEntries);
  
  const byType = await db
    .select({
      type: bibliographyEntries.entryType,
      count: count(),
    })
    .from(bibliographyEntries)
    .groupBy(bibliographyEntries.entryType);
  
  const byDomain = await db
    .select({
      domain: bibliographyEntries.researchDomain,
      count: count(),
    })
    .from(bibliographyEntries)
    .groupBy(bibliographyEntries.researchDomain);
  
  const byReadStatus = await db
    .select({
      status: bibliographyEntries.readStatus,
      count: count(),
    })
    .from(bibliographyEntries)
    .groupBy(bibliographyEntries.readStatus);
  
  const byYear = await db
    .select({
      year: bibliographyEntries.year,
      count: count(),
    })
    .from(bibliographyEntries)
    .groupBy(bibliographyEntries.year)
    .orderBy(desc(bibliographyEntries.year))
    .limit(20);
  
  // Get year range for timeline filter
  const [yearRange] = await db
    .select({
      minYear: sql<number>`MIN(${bibliographyEntries.year})`,
      maxYear: sql<number>`MAX(${bibliographyEntries.year})`,
    })
    .from(bibliographyEntries);
  
  return {
    total: totalCount.count,
    byType,
    byDomain,
    byReadStatus,
    byYear,
    yearRange: {
      min: yearRange?.minYear || 1900,
      max: yearRange?.maxYear || new Date().getFullYear(),
    },
  };
}

// Bulk import for bibliography entries
export async function bulkCreateBibliographyEntries(entries: InsertBibliographyEntry[]) {
  const db = await getDb();
  if (!db) return { success: 0, failed: 0, errors: [] as string[] };
  
  let success = 0;
  let failed = 0;
  const errors: string[] = [];
  
  for (const entry of entries) {
    try {
      await db.insert(bibliographyEntries).values(entry);
      success++;
    } catch (error: unknown) {
      failed++;
      errors.push(`${entry.entryKey}: ${(error instanceof Error ? error.message : String(error))}`);
    }
  }
  
  return { success, failed, errors };
}


// ====================================================================
// BIBLIOGRAPHY-AXIS LINKS
// ====================================================================
// ============================================================================
// BIBLIOGRAPHY-AXIS LINKS
// ============================================================================

export async function linkBibliographyToAxis(bibliographyId: number, axisId: number, relevance?: string, notes?: string) {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const [result] = await db.insert(bibliographyAxisLinks).values({
      bibliographyId,
      axisId,
      relevance: relevance as any || 'secondaire',
      notes,
    });
    return { id: result.insertId, bibliographyId, axisId };
  } catch (error: unknown) {
    // Lien déjà existant
    return null;
  }
}

export async function unlinkBibliographyFromAxis(bibliographyId: number, axisId: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(bibliographyAxisLinks)
    .where(
      and(
        eq(bibliographyAxisLinks.bibliographyId, bibliographyId),
        eq(bibliographyAxisLinks.axisId, axisId)
      )
    );
  return true;
}

export async function getBibliographyByAxis(axisId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const links = await db
    .select()
    .from(bibliographyAxisLinks)
    .where(eq(bibliographyAxisLinks.axisId, axisId));
  
  if (links.length === 0) return [];
  
  const bibIds = links.map(l => l.bibliographyId);
  const entries = await db
    .select()
    .from(bibliographyEntries)
    .where(inArray(bibliographyEntries.id, bibIds));
  
  // Joindre les informations de relevance
  return entries.map(entry => {
    const link = links.find(l => l.bibliographyId === entry.id);
    return {
      ...entry,
      relevance: link?.relevance,
      linkNotes: link?.notes,
    };
  });
}

export async function getAxesByBibliography(bibliographyId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const links = await db
    .select()
    .from(bibliographyAxisLinks)
    .where(eq(bibliographyAxisLinks.bibliographyId, bibliographyId));
  
  if (links.length === 0) return [];
  
  const axisIds = links.map(l => l.axisId);
  const axes = await db
    .select()
    .from(researchAxes)
    .where(inArray(researchAxes.id, axisIds));
  
  return axes.map(axis => {
    const link = links.find(l => l.axisId === axis.id);
    return {
      ...axis,
      relevance: link?.relevance,
      linkNotes: link?.notes,
    };
  });
}


// ====================================================================
// BIBTEX PARSING UTILITIES
// ====================================================================
// ============================================================================
// BIBTEX PARSING UTILITIES
// ============================================================================

export function parseBibTeX(bibtexString: string): Partial<InsertBibliographyEntry>[] {
  const entries: Partial<InsertBibliographyEntry>[] = [];
  
  // Regex pour extraire les entrées BibTeX
  const entryRegex = /@(\w+)\s*\{\s*([^,]+)\s*,([^@]*)\}/g;
  let match;
  
  while ((match = entryRegex.exec(bibtexString)) !== null) {
    const entryType = match[1].toLowerCase();
    const entryKey = match[2].trim();
    const fieldsString = match[3];
    
    const entry: Partial<InsertBibliographyEntry> = {
      entryKey,
      entryType: mapBibTeXType(entryType),
    };
    
    // Parser les champs
    const fieldRegex = /(\w+)\s*=\s*\{([^}]*)\}/g;
    let fieldMatch;
    
    while ((fieldMatch = fieldRegex.exec(fieldsString)) !== null) {
      const fieldName = fieldMatch[1].toLowerCase();
      const fieldValue = fieldMatch[2].trim();
      
      switch (fieldName) {
        case 'title':
          entry.title = fieldValue;
          break;
        case 'author':
          entry.authors = fieldValue;
          break;
        case 'year':
          entry.year = parseInt(fieldValue, 10) || undefined;
          break;
        case 'journal':
          entry.journal = fieldValue;
          break;
        case 'booktitle':
          entry.booktitle = fieldValue;
          break;
        case 'publisher':
          entry.publisher = fieldValue;
          break;
        case 'volume':
          entry.volume = fieldValue;
          break;
        case 'number':
          entry.number = fieldValue;
          break;
        case 'pages':
          entry.pages = fieldValue;
          break;
        case 'doi':
          entry.doi = fieldValue;
          break;
        case 'isbn':
          entry.isbn = fieldValue;
          break;
        case 'issn':
          entry.issn = fieldValue;
          break;
        case 'url':
          entry.url = fieldValue;
          break;
        case 'abstract':
          entry.abstract = fieldValue;
          break;
        case 'keywords':
          entry.keywords = fieldValue.split(',').map(k => k.trim());
          break;
        case 'edition':
          entry.edition = fieldValue;
          break;
        case 'chapter':
          entry.chapter = fieldValue;
          break;
      }
    }
    
    if (entry.title) {
      entries.push(entry);
    }
  }
  
  return entries;
}

function mapBibTeXType(type: string): InsertBibliographyEntry['entryType'] {
  const typeMap: Record<string, InsertBibliographyEntry['entryType']> = {
    'article': 'article',
    'book': 'book',
    'inbook': 'inbook',
    'incollection': 'incollection',
    'inproceedings': 'inproceedings',
    'conference': 'conference',
    'phdthesis': 'phdthesis',
    'mastersthesis': 'mastersthesis',
    'thesis': 'thesis',
    'techreport': 'techreport',
    'manual': 'manual',
    'unpublished': 'unpublished',
    'misc': 'misc',
    'online': 'online',
    'patent': 'patent',
  };
  
  return typeMap[type] || 'misc';
}


// ====================================================================
// CSV PARSING UTILITIES FOR BIBLIOGRAPHY
// ====================================================================
// ============================================================================
// CSV PARSING UTILITIES FOR BIBLIOGRAPHY
// ============================================================================

export function parseCSVBibliography(csvString: string): Partial<InsertBibliographyEntry>[] {
  const lines = csvString.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const entries: Partial<InsertBibliographyEntry>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) continue;
    
    const entry: Partial<InsertBibliographyEntry> = {};
    
    headers.forEach((header, index) => {
      const value = values[index]?.trim();
      if (!value) return;
      
      switch (header) {
        case 'key':
        case 'entry_key':
        case 'entrykey':
          entry.entryKey = value;
          break;
        case 'type':
        case 'entry_type':
        case 'entrytype':
          entry.entryType = mapBibTeXType(value.toLowerCase());
          break;
        case 'title':
          entry.title = value;
          break;
        case 'author':
        case 'authors':
          entry.authors = value;
          break;
        case 'year':
          entry.year = parseInt(value, 10) || undefined;
          break;
        case 'journal':
          entry.journal = value;
          break;
        case 'publisher':
          entry.publisher = value;
          break;
        case 'volume':
          entry.volume = value;
          break;
        case 'number':
        case 'issue':
          entry.number = value;
          break;
        case 'pages':
          entry.pages = value;
          break;
        case 'doi':
          entry.doi = value;
          break;
        case 'isbn':
          entry.isbn = value;
          break;
        case 'url':
          entry.url = value;
          break;
        case 'abstract':
          entry.abstract = value;
          break;
        case 'keywords':
        case 'tags':
          entry.keywords = value.split(';').map(k => k.trim());
          break;
        case 'domain':
        case 'research_domain':
          entry.researchDomain = value as any;
          break;
        case 'notes':
          entry.notes = value;
          break;
      }
    });
    
    // Générer une clé si manquante
    if (!entry.entryKey && entry.authors && entry.year) {
      const firstAuthor = entry.authors.split(',')[0].split(' ').pop()?.toLowerCase() || 'unknown';
      entry.entryKey = `${firstAuthor}${entry.year}${Math.random().toString(36).substr(2, 4)}`;
    }
    
    if (entry.title && entry.entryKey) {
      entries.push(entry);
    }
  }
  
  return entries;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}


// ====================================================================
// EXPORT UTILITIES
// ====================================================================
// ============================================================================
// EXPORT UTILITIES
// ============================================================================

export function exportToBibTeX(entries: BibliographyEntry[]): string {
  return entries.map(entry => {
    const fields: string[] = [];
    
    if (entry.title) fields.push(`  title = {${entry.title}}`);
    if (entry.authors) fields.push(`  author = {${entry.authors}}`);
    if (entry.year) fields.push(`  year = {${entry.year}}`);
    if (entry.journal) fields.push(`  journal = {${entry.journal}}`);
    if (entry.booktitle) fields.push(`  booktitle = {${entry.booktitle}}`);
    if (entry.publisher) fields.push(`  publisher = {${entry.publisher}}`);
    if (entry.volume) fields.push(`  volume = {${entry.volume}}`);
    if (entry.number) fields.push(`  number = {${entry.number}}`);
    if (entry.pages) fields.push(`  pages = {${entry.pages}}`);
    if (entry.doi) fields.push(`  doi = {${entry.doi}}`);
    if (entry.isbn) fields.push(`  isbn = {${entry.isbn}}`);
    if (entry.url) fields.push(`  url = {${entry.url}}`);
    if (entry.abstract) fields.push(`  abstract = {${entry.abstract}}`);
    if (entry.keywords && entry.keywords.length > 0) {
      fields.push(`  keywords = {${entry.keywords.join(', ')}}`);
    }
    
    return `@${entry.entryType}{${entry.entryKey},\n${fields.join(',\n')}\n}`;
  }).join('\n\n');
}

export function exportToAPA(entry: BibliographyEntry): string {
  const authors = entry.authors || 'Unknown';
  const year = entry.year || 'n.d.';
  const title = entry.title || 'Untitled';
  
  let citation = `${authors} (${year}). ${title}`;
  
  if (entry.journal) {
    citation += `. *${entry.journal}*`;
    if (entry.volume) citation += `, ${entry.volume}`;
    if (entry.number) citation += `(${entry.number})`;
    if (entry.pages) citation += `, ${entry.pages}`;
  } else if (entry.publisher) {
    citation += `. ${entry.publisher}`;
  }
  
  citation += '.';
  
  if (entry.doi) {
    citation += ` https://doi.org/${entry.doi}`;
  } else if (entry.url) {
    citation += ` ${entry.url}`;
  }
  
  return citation;
}

export function exportToChicago(entry: BibliographyEntry): string {
  const authors = entry.authors || 'Unknown';
  const year = entry.year || 'n.d.';
  const title = entry.title || 'Untitled';
  
  let citation = `${authors}. "${title}."`;
  
  if (entry.journal) {
    citation += ` *${entry.journal}*`;
    if (entry.volume) citation += ` ${entry.volume}`;
    if (entry.number) citation += `, no. ${entry.number}`;
    citation += ` (${year})`;
    if (entry.pages) citation += `: ${entry.pages}`;
  } else {
    citation += ` ${year}`;
    if (entry.publisher) citation += `. ${entry.publisher}`;
  }
  
  citation += '.';
  
  if (entry.doi) {
    citation += ` https://doi.org/${entry.doi}`;
  }
  
  return citation;
}



// ====================================================================
// REFERENCE CITATIONS (Citations croisées entre références bibliographiques)
// ====================================================================
// ============================================================================
// REFERENCE CITATIONS (Citations croisées entre références bibliographiques)
// ============================================================================

/**
 * Récupère toutes les citations avec filtres optionnels
 */
export async function getAllReferenceCitations(filters?: {
  citingId?: number;
  citedId?: number;
  citationType?: string;
  verified?: boolean;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return { citations: [], total: 0 };
  
  const conditions: SQL[] = [];
  
  if (filters?.citingId) {
    conditions.push(eq(referenceCitations.citingId, filters.citingId));
  }
  if (filters?.citedId) {
    conditions.push(eq(referenceCitations.citedId, filters.citedId));
  }
  if (filters?.citationType) {
    conditions.push(eq(referenceCitations.citationType, filters.citationType as any));
  }
  if (filters?.verified !== undefined) {
    conditions.push(eq(referenceCitations.verified, filters.verified));
  }
  
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  
  const [totalResult] = await db
    .select({ count: count() })
    .from(referenceCitations)
    .where(whereClause);
  
  const citationsResult = await db
    .select()
    .from(referenceCitations)
    .where(whereClause)
    .orderBy(desc(referenceCitations.createdAt))
    .limit(filters?.limit || 100)
    .offset(filters?.offset || 0);
  
  return {
    citations: citationsResult,
    total: totalResult?.count || 0,
  };
}

/**
 * Récupère une citation par ID
 */
export async function getReferenceCitationById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [citation] = await db
    .select()
    .from(referenceCitations)
    .where(eq(referenceCitations.id, id));
  
  return citation || null;
}

/**
 * Récupère le graphe complet des citations pour visualisation
 * Retourne les nœuds (références) et les liens (citations)
 */
export async function getCitationGraph(filters?: {
  citationType?: string;
  researchDomain?: string;
  minWeight?: number;
  verified?: boolean;
}) {
  const db = await getDb();
  if (!db) return { nodes: [], links: [] };
  
  // Construire les conditions pour les citations
  const citationConditions: SQL[] = [];
  if (filters?.citationType) {
    citationConditions.push(eq(referenceCitations.citationType, filters.citationType as any));
  }
  if (filters?.minWeight) {
    citationConditions.push(gte(referenceCitations.weight, filters.minWeight));
  }
  if (filters?.verified !== undefined) {
    citationConditions.push(eq(referenceCitations.verified, filters.verified));
  }
  
  const citationWhere = citationConditions.length > 0 ? and(...citationConditions) : undefined;
  
  // Récupérer toutes les citations
  const allCitations = await db
    .select()
    .from(referenceCitations)
    .where(citationWhere);
  
  // Collecter tous les IDs de références impliquées
  const refIds = new Set<number>();
  allCitations.forEach(c => {
    refIds.add(c.citingId);
    refIds.add(c.citedId);
  });
  
  if (refIds.size === 0) {
    return { nodes: [], links: [] };
  }
  
  // Construire les conditions pour les références
  const refConditions: SQL[] = [inArray(bibliographyEntries.id, Array.from(refIds))];
  if (filters?.researchDomain) {
    refConditions.push(eq(bibliographyEntries.researchDomain, filters.researchDomain as any));
  }
  
  // Récupérer les références
  const refs = await db
    .select()
    .from(bibliographyEntries)
    .where(and(...refConditions));
  
  // Créer un map des références pour accès rapide
  const refMap = new Map(refs.map(r => [r.id, r]));
  
  // Construire les nœuds
  const nodes = refs.map(ref => ({
    id: ref.id,
    entryKey: ref.entryKey,
    title: ref.title,
    authors: ref.authors,
    year: ref.year,
    entryType: ref.entryType,
    researchDomain: ref.researchDomain,
    // Calculer le nombre de citations entrantes et sortantes
    inDegree: allCitations.filter(c => c.citedId === ref.id).length,
    outDegree: allCitations.filter(c => c.citingId === ref.id).length,
  }));
  
  // Construire les liens
  const links = allCitations
    .filter(c => refMap.has(c.citingId) && refMap.has(c.citedId))
    .map(c => ({
      id: c.id,
      source: c.citingId,
      target: c.citedId,
      citationType: c.citationType,
      weight: c.weight || 1,
      verified: c.verified,
    }));
  
  return { nodes, links };
}

/**
 * Récupère les références qui citent une référence donnée
 */
export async function getCitationsOf(citedId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const citations = await db
    .select({
      citation: referenceCitations,
      citing: bibliographyEntries,
    })
    .from(referenceCitations)
    .innerJoin(bibliographyEntries, eq(referenceCitations.citingId, bibliographyEntries.id))
    .where(eq(referenceCitations.citedId, citedId))
    .orderBy(desc(bibliographyEntries.year));
  
  return citations.map(c => ({
    ...c.citation,
    citingReference: c.citing,
  }));
}

/**
 * Récupère les références citées par une référence donnée
 */
export async function getCitedBy(citingId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const citations = await db
    .select({
      citation: referenceCitations,
      cited: bibliographyEntries,
    })
    .from(referenceCitations)
    .innerJoin(bibliographyEntries, eq(referenceCitations.citedId, bibliographyEntries.id))
    .where(eq(referenceCitations.citingId, citingId))
    .orderBy(desc(bibliographyEntries.year));
  
  return citations.map(c => ({
    ...c.citation,
    citedReference: c.cited,
  }));
}

/**
 * Crée une nouvelle citation entre deux références
 */
export async function createReferenceCitation(data: {
  citingId: number;
  citedId: number;
  citationType?: string;
  context?: string;
  pageNumber?: string;
  notes?: string;
  weight?: number;
  addedBy?: number;
}) {
  const db = await getDb();
  if (!db) return null;
  
  // Vérifier que les deux références existent
  const [citing] = await db.select().from(bibliographyEntries).where(eq(bibliographyEntries.id, data.citingId));
  const [cited] = await db.select().from(bibliographyEntries).where(eq(bibliographyEntries.id, data.citedId));
  
  if (!citing || !cited) {
    throw new Error("Une ou les deux références n'existent pas");
  }
  
  // Vérifier qu'on ne cite pas soi-même
  if (data.citingId === data.citedId) {
    throw new Error("Une référence ne peut pas se citer elle-même");
  }
  
  const [result] = await db.insert(referenceCitations).values({
    citingId: data.citingId,
    citedId: data.citedId,
    citationType: (data.citationType || 'direct') as any,
    context: data.context,
    pageNumber: data.pageNumber,
    notes: data.notes,
    weight: data.weight || 1,
    addedBy: data.addedBy,
  });
  
  return getReferenceCitationById(result.insertId);
}

/**
 * Met à jour une citation
 */
export async function updateReferenceCitation(id: number, data: {
  citationType?: string;
  context?: string;
  pageNumber?: string;
  notes?: string;
  weight?: number;
}) {
  const db = await getDb();
  if (!db) return null;
  
  await db.update(referenceCitations)
    .set(data as any)
    .where(eq(referenceCitations.id, id));
  
  return getReferenceCitationById(id);
}

/**
 * Supprime une citation
 */
export async function deleteReferenceCitation(id: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(referenceCitations).where(eq(referenceCitations.id, id));
  return true;
}

/**
 * Vérifie une citation
 */
export async function verifyReferenceCitation(id: number, userId?: number) {
  const db = await getDb();
  if (!db) return null;
  
  await db.update(referenceCitations)
    .set({
      verified: true,
      verifiedBy: userId,
      verifiedAt: new Date(),
    } as any)
    .where(eq(referenceCitations.id, id));
  
  return getReferenceCitationById(id);
}

/**
 * Statistiques du graphe de citations
 */
export async function getCitationGraphStats() {
  const db = await getDb();
  if (!db) return null;
  
  // Nombre total de citations
  const [totalCitations] = await db.select({ count: count() }).from(referenceCitations);
  
  // Citations par type
  const byType = await db
    .select({
      type: referenceCitations.citationType,
      count: count(),
    })
    .from(referenceCitations)
    .groupBy(referenceCitations.citationType);
  
  // Nombre de références avec au moins une citation
  const citingRefs = await db
    .selectDistinct({ id: referenceCitations.citingId })
    .from(referenceCitations);
  
  const citedRefs = await db
    .selectDistinct({ id: referenceCitations.citedId })
    .from(referenceCitations);
  
  // Références les plus citées (top 10)
  const mostCited = await db
    .select({
      citedId: referenceCitations.citedId,
      count: count(),
    })
    .from(referenceCitations)
    .groupBy(referenceCitations.citedId)
    .orderBy(desc(count()))
    .limit(10);
  
  // Enrichir avec les infos des références
  const mostCitedWithInfo = await Promise.all(
    mostCited.map(async (mc) => {
      const [ref] = await db
        .select()
        .from(bibliographyEntries)
        .where(eq(bibliographyEntries.id, mc.citedId));
      return {
        ...mc,
        reference: ref,
      };
    })
  );
  
  // Références qui citent le plus (top 10)
  const mostCiting = await db
    .select({
      citingId: referenceCitations.citingId,
      count: count(),
    })
    .from(referenceCitations)
    .groupBy(referenceCitations.citingId)
    .orderBy(desc(count()))
    .limit(10);
  
  const mostCitingWithInfo = await Promise.all(
    mostCiting.map(async (mc) => {
      const [ref] = await db
        .select()
        .from(bibliographyEntries)
        .where(eq(bibliographyEntries.id, mc.citingId));
      return {
        ...mc,
        reference: ref,
      };
    })
  );
  
  // Citations vérifiées vs non vérifiées
  const [verifiedCount] = await db
    .select({ count: count() })
    .from(referenceCitations)
    .where(eq(referenceCitations.verified, true));
  
  return {
    totalCitations: totalCitations?.count || 0,
    totalCitingReferences: citingRefs.length,
    totalCitedReferences: citedRefs.length,
    byType,
    mostCited: mostCitedWithInfo,
    mostCiting: mostCitingWithInfo,
    verifiedCount: verifiedCount?.count || 0,
    unverifiedCount: (totalCitations?.count || 0) - (verifiedCount?.count || 0),
  };
}



// ====================================================================
// V3 REFERENCES (Pack Niche Innovations)
// ====================================================================
// ============================================================================
// V3 REFERENCES (Pack Niche Innovations)
// ============================================================================

/**
 * Get all thematic axes
 */
export async function getAllThematicAxes() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(thematicAxes)
    .orderBy(thematicAxes.displayOrder);
}

/**
 * Get thematic axis by code
 */
export async function getThematicAxisByCode(code: string) {
  const db = await getDb();
  if (!db) return null;
  const [axis] = await db
    .select()
    .from(thematicAxes)
    .where(eq(thematicAxes.axisCode, code));
  return axis;
}

/**
 * Get all v3 references
 */
export async function getAllV3References() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(v3References)
    .orderBy(desc(v3References.year), v3References.title);
}

/**
 * Get v3 reference by ID
 */
export async function getV3ReferenceById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const [ref] = await db
    .select()
    .from(v3References)
    .where(eq(v3References.id, id));
  return ref;
}

/**
 * Get v3 reference by entry key
 */
export async function getV3ReferenceByKey(entryKey: string) {
  const db = await getDb();
  if (!db) return null;
  const [ref] = await db
    .select()
    .from(v3References)
    .where(eq(v3References.entryKey, entryKey));
  return ref;
}

/**
 * Get v3 references by axis code
 */
export async function getV3ReferencesByAxis(axisCode: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(v3References)
    .where(
      or(
        like(v3References.axisPrimaryCode, `${axisCode}%`),
        like(sql`JSON_EXTRACT(${v3References.axesSecondary}, '$')`, `%${axisCode}%`)
      )
    )
    .orderBy(desc(v3References.year));
}

/**
 * Get v3 references by meta-axis
 */
export async function getV3ReferencesByMetaAxis(metaAxis: 'meta_a' | 'meta_b' | 'meta_c' | 'other') {
  const db = await getDb();
  if (!db) return [];
  // Get all axis codes for this meta-axis
  const axes = await db
    .select({ code: thematicAxes.axisCode })
    .from(thematicAxes)
    .where(eq(thematicAxes.metaAxis, metaAxis));
  
  const axisCodes = axes.map(a => a.code);
  
  if (axisCodes.length === 0) return [];
  
  // Build OR conditions for each axis code
  const conditions = axisCodes.map(code => 
    or(
      like(v3References.axisPrimaryCode, `${code}%`),
      like(sql`JSON_EXTRACT(${v3References.axesSecondary}, '$')`, `%${code}%`)
    )
  );
  
  return db
    .select()
    .from(v3References)
    .where(or(...conditions))
    .orderBy(desc(v3References.year));
}

/**
 * Search v3 references
 */
export async function searchV3References(query: string) {
  const db = await getDb();
  if (!db) return [];
  const searchTerm = `%${query}%`;
  return db
    .select()
    .from(v3References)
    .where(
      or(
        like(v3References.title, searchTerm),
        like(v3References.authors, searchTerm),
        like(v3References.notes, searchTerm),
        like(sql`JSON_EXTRACT(${v3References.tags}, '$')`, searchTerm)
      )
    )
    .orderBy(desc(v3References.year));
}

/**
 * Update v3 reference user notes
 */
export async function updateV3ReferenceUserNotes(id: number, userNotes: string) {
  const db = await getDb();
  if (!db) return null;
  await db
    .update(v3References)
    .set({ userNotes })
    .where(eq(v3References.id, id));
  return getV3ReferenceById(id);
}

/**
 * Update v3 reference read status
 */
export async function updateV3ReferenceReadStatus(id: number, readStatus: 'unread' | 'reading' | 'read' | 'to_review') {
  const db = await getDb();
  if (!db) return null;
  await db
    .update(v3References)
    .set({ readStatus })
    .where(eq(v3References.id, id));
  return getV3ReferenceById(id);
}

/**
 * Update v3 reference relevance score
 */
export async function updateV3ReferenceRelevance(id: number, relevanceScore: number) {
  const db = await getDb();
  if (!db) return null;
  await db
    .update(v3References)
    .set({ relevanceScore })
    .where(eq(v3References.id, id));
  return getV3ReferenceById(id);
}

/**
 * Get v3 references statistics
 */
export async function getV3ReferencesStats() {
  const db = await getDb();
  if (!db) return { total: 0, byType: [], byReadStatus: [], byYear: [] };
  const [totalCount] = await db
    .select({ count: count() })
    .from(v3References);
  
  const byType = await db
    .select({
      type: v3References.entryType,
      count: count(),
    })
    .from(v3References)
    .groupBy(v3References.entryType);
  
  const byReadStatus = await db
    .select({
      status: v3References.readStatus,
      count: count(),
    })
    .from(v3References)
    .groupBy(v3References.readStatus);
  
  const byYear = await db
    .select({
      year: v3References.year,
      count: count(),
    })
    .from(v3References)
    .where(isNotNull(v3References.year))
    .groupBy(v3References.year)
    .orderBy(desc(v3References.year));
  
  return {
    total: totalCount?.count || 0,
    byType,
    byReadStatus,
    byYear,
  };
}


// ====================================================================
// REFERENCE TAGS
// ====================================================================
// ============================================================================
// REFERENCE TAGS
// ============================================================================

/**
 * Get all reference tags
 */
export async function getAllReferenceTags() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(referenceTags)
    .orderBy(desc(referenceTags.usageCount), referenceTags.name);
}

/**
 * Get reference tags by category
 */
export async function getReferenceTagsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(referenceTags)
    .where(eq(referenceTags.category, category as any))
    .orderBy(referenceTags.name);
}

/**
 * Get reference tag by slug
 */
export async function getReferenceTagBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const [tag] = await db
    .select()
    .from(referenceTags)
    .where(eq(referenceTags.slug, slug));
  return tag;
}

/**
 * Create a new reference tag
 */
export async function createReferenceTag(data: {
  name: string;
  slug: string;
  category?: string;
  description?: string;
  color?: string;
  parentId?: number;
}) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db
    .insert(referenceTags)
    .values(data as any);
  return getReferenceTagBySlug(data.slug);
}

/**
 * Update a reference tag
 */
export async function updateReferenceTag(id: number, data: Partial<{
  name: string;
  description: string;
  color: string;
  category: string;
}>) {
  const db = await getDb();
  if (!db) return null;
  await db
    .update(referenceTags)
    .set(data as any)
    .where(eq(referenceTags.id, id));
  const [tag] = await db
    .select()
    .from(referenceTags)
    .where(eq(referenceTags.id, id));
  return tag;
}

/**
 * Delete a reference tag
 */
export async function deleteReferenceTag(id: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db
    .delete(referenceTags)
    .where(eq(referenceTags.id, id));
  return { success: true };
}

/**
 * Add tag to v3 reference
 */
export async function addTagToV3Reference(referenceId: number, tagId: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db
    .insert(v3ReferenceTagLinks)
    .values({ referenceId, tagId })
    .onDuplicateKeyUpdate({ set: { referenceId } });
  
  // Increment usage count
  await db
    .update(referenceTags)
    .set({ usageCount: sql`${referenceTags.usageCount} + 1` })
    .where(eq(referenceTags.id, tagId));
  
  return { success: true };
}

/**
 * Remove tag from v3 reference
 */
export async function removeTagFromV3Reference(referenceId: number, tagId: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db
    .delete(v3ReferenceTagLinks)
    .where(
      and(
        eq(v3ReferenceTagLinks.referenceId, referenceId),
        eq(v3ReferenceTagLinks.tagId, tagId)
      )
    );
  
  // Decrement usage count
  await db
    .update(referenceTags)
    .set({ usageCount: sql`GREATEST(${referenceTags.usageCount} - 1, 0)` })
    .where(eq(referenceTags.id, tagId));
  
  return { success: true };
}

/**
 * Get tags for a v3 reference
 */
export async function getTagsForV3Reference(referenceId: number) {
  const db = await getDb();
  if (!db) return [];
  const links = await db
    .select({
      tag: referenceTags,
    })
    .from(v3ReferenceTagLinks)
    .innerJoin(referenceTags, eq(v3ReferenceTagLinks.tagId, referenceTags.id))
    .where(eq(v3ReferenceTagLinks.referenceId, referenceId));
  
  return links.map(l => l.tag);
}

/**
 * Get v3 references by tag
 */
export async function getV3ReferencesByTag(tagId: number) {
  const db = await getDb();
  if (!db) return [];
  const links = await db
    .select({
      reference: v3References,
    })
    .from(v3ReferenceTagLinks)
    .innerJoin(v3References, eq(v3ReferenceTagLinks.referenceId, v3References.id))
    .where(eq(v3ReferenceTagLinks.tagId, tagId));
  
  return links.map(l => l.reference);
}


// ====================================================================
// REFERENCE NOTES
// ====================================================================
// ============================================================================
// REFERENCE NOTES
// ============================================================================

/**
 * Get all notes for a v3 reference
 */
export async function getNotesForV3Reference(referenceId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(referenceNotes)
    .where(eq(referenceNotes.referenceId, referenceId))
    .orderBy(desc(referenceNotes.createdAt));
}

/**
 * Get reference note by ID
 */
export async function getReferenceNoteById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const [note] = await db
    .select()
    .from(referenceNotes)
    .where(eq(referenceNotes.id, id));
  return note;
}

/**
 * Create a reference note
 */
export async function createReferenceNote(data: {
  referenceId: number;
  noteType?: string;
  title?: string;
  content: string;
  pageNumber?: string;
  importance?: string;
  createdBy?: number;
}) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db
    .insert(referenceNotes)
    .values(data as any);
  
  // Get the inserted note
  const [note] = await db
    .select()
    .from(referenceNotes)
    .where(eq(referenceNotes.referenceId, data.referenceId))
    .orderBy(desc(referenceNotes.createdAt))
    .limit(1);
  
  return note;
}

/**
 * Update a reference note
 */
export async function updateReferenceNote(id: number, data: Partial<{
  noteType: string;
  title: string;
  content: string;
  pageNumber: string;
  importance: string;
  isResolved: boolean;
}>) {
  const db = await getDb();
  if (!db) return null;
  await db
    .update(referenceNotes)
    .set(data as any)
    .where(eq(referenceNotes.id, id));
  return getReferenceNoteById(id);
}

/**
 * Delete a reference note
 */
export async function deleteReferenceNote(id: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db
    .delete(referenceNotes)
    .where(eq(referenceNotes.id, id));
  return { success: true };
}

/**
 * Get notes by type
 */
export async function getReferenceNotesByType(noteType: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      note: referenceNotes,
      reference: v3References,
    })
    .from(referenceNotes)
    .innerJoin(v3References, eq(referenceNotes.referenceId, v3References.id))
    .where(eq(referenceNotes.noteType, noteType as any))
    .orderBy(desc(referenceNotes.createdAt));
}

/**
 * Get unresolved notes (todos and questions)
 */
export async function getUnresolvedReferenceNotes() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      note: referenceNotes,
      reference: v3References,
    })
    .from(referenceNotes)
    .innerJoin(v3References, eq(referenceNotes.referenceId, v3References.id))
    .where(
      and(
        or(
          eq(referenceNotes.noteType, 'todo'),
          eq(referenceNotes.noteType, 'question')
        ),
        eq(referenceNotes.isResolved, false)
      )
    )
    .orderBy(desc(referenceNotes.importance), desc(referenceNotes.createdAt));
}


// ====================================================================
// REFERENCE ENTITY LINKS (Liaisons références-entités)
// ====================================================================
// ============================================================================
// REFERENCE ENTITY LINKS (Liaisons références-entités)
// ============================================================================

/**
 * Create a link between a reference and an entity
 */
export async function createReferenceEntityLink(data: {
  referenceId: number;
  entityType: 'leaf_economy' | 'molecule' | 'recette' | 'plant' | 'prototype' | 'tradition' | 'terroir' | 'supplier';
  entityId: number;
  linkType?: 'documents' | 'mentions' | 'analyzes' | 'conserves' | 'reconstructs' | 'sources' | 'validates' | 'contextualizes';
  relevanceScore?: number;
  notes?: string;
  context?: string;
  createdBy?: number;
}) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db
    .insert(referenceEntityLinks)
    .values({
      referenceId: data.referenceId,
      entityType: data.entityType,
      entityId: data.entityId,
      linkType: data.linkType || 'documents',
      relevanceScore: data.relevanceScore || 50,
      notes: data.notes,
      context: data.context,
      createdBy: data.createdBy,
    })
    .$returningId();
  return result;
}

/**
 * Get all links for a reference with entity names
 */
export async function getLinksForReference(referenceId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const links = await db
    .select()
    .from(referenceEntityLinks)
    .where(eq(referenceEntityLinks.referenceId, referenceId))
    .orderBy(desc(referenceEntityLinks.relevanceScore));
  
  // Enrich with entity names
  const enrichedLinks = await Promise.all(
    links.map(async (link) => {
      let entityName = '';
      try {
        switch (link.entityType) {
          case 'molecule': {
            const [mol] = await db.select({ name: molecules.name }).from(molecules).where(eq(molecules.id, link.entityId));
            entityName = mol?.name || '';
            break;
          }
          case 'plant': {
            const [plant] = await db.select({ name: plants.name }).from(plants).where(eq(plants.id, link.entityId));
            entityName = plant?.name || '';
            break;
          }
          case 'recette': {
            const [rec] = await db.select({ name: recettes.name }).from(recettes).where(eq(recettes.id, link.entityId));
            entityName = rec?.name || '';
            break;
          }
          case 'terroir': {
            const [ter] = await db.select({ name: terroirs.name }).from(terroirs).where(eq(terroirs.id, link.entityId));
            entityName = ter?.name || '';
            break;
          }
          case 'prototype': {
            const [proto] = await db.select({ name: prototypes.name }).from(prototypes).where(eq(prototypes.id, link.entityId));
            entityName = proto?.name || '';
            break;
          }
          case 'tradition': {
            const [trad] = await db.select({ name: olfactoryTraditions.name }).from(olfactoryTraditions).where(eq(olfactoryTraditions.id, link.entityId));
            entityName = trad?.name || '';
            break;
          }
          case 'leaf_economy': {
            const [leaf] = await db.select({ sampleId: leafEconomies.sampleId, species: leafEconomies.species }).from(leafEconomies).where(eq(leafEconomies.id, link.entityId));
            entityName = leaf?.species || leaf?.sampleId || '';
            break;
          }
          case 'supplier': {
            const [sup] = await db.select({ name: extendedSuppliers.name }).from(extendedSuppliers).where(eq(extendedSuppliers.id, link.entityId));
            entityName = sup?.name || '';
            break;
          }
        }
      } catch (e) {
        // Entity not found
      }
      return { ...link, entityName };
    })
  );
  
  return enrichedLinks;
}

/**
 * Get all references linked to an entity
 */
export async function getReferencesForEntity(
  entityType: 'leaf_economy' | 'molecule' | 'recette' | 'plant' | 'prototype' | 'tradition' | 'terroir' | 'supplier',
  entityId: number
) {
  const db = await getDb();
  if (!db) return [];
  const links = await db
    .select({
      link: referenceEntityLinks,
      reference: v3References,
    })
    .from(referenceEntityLinks)
    .innerJoin(v3References, eq(referenceEntityLinks.referenceId, v3References.id))
    .where(
      and(
        eq(referenceEntityLinks.entityType, entityType),
        eq(referenceEntityLinks.entityId, entityId)
      )
    )
    .orderBy(desc(referenceEntityLinks.relevanceScore));
  return links;
}

/**
 * Get all links by entity type
 */
export async function getLinksByEntityType(
  entityType: 'leaf_economy' | 'molecule' | 'recette' | 'plant' | 'prototype' | 'tradition' | 'terroir' | 'supplier'
) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      link: referenceEntityLinks,
      reference: v3References,
    })
    .from(referenceEntityLinks)
    .innerJoin(v3References, eq(referenceEntityLinks.referenceId, v3References.id))
    .where(eq(referenceEntityLinks.entityType, entityType))
    .orderBy(desc(referenceEntityLinks.relevanceScore));
}

/**
 * Get links for Heritage & Conservation axes (H1, H2, H3)
 */
export async function getHeritageConservationLinks() {
  const db = await getDb();
  if (!db) return [];
  // Get references with H1, H2, or H3 axes
  const refs = await db
    .select()
    .from(v3References)
    .where(
      or(
        like(v3References.axisPrimaryCode, 'H%'),
        like(sql`JSON_EXTRACT(${v3References.axesSecondary}, '$')`, '%H1%'),
        like(sql`JSON_EXTRACT(${v3References.axesSecondary}, '$')`, '%H2%'),
        like(sql`JSON_EXTRACT(${v3References.axesSecondary}, '$')`, '%H3%')
      )
    );
  
  const refIds = refs.map(r => r.id);
  if (refIds.length === 0) return [];
  
  // Get all links for these references
  const links = await db
    .select()
    .from(referenceEntityLinks)
    .where(inArray(referenceEntityLinks.referenceId, refIds));
  
  return { references: refs, links };
}

/**
 * Update a reference entity link
 */
export async function updateReferenceEntityLink(
  id: number,
  data: {
    linkType?: 'documents' | 'mentions' | 'analyzes' | 'conserves' | 'reconstructs' | 'sources' | 'validates' | 'contextualizes';
    relevanceScore?: number;
    notes?: string;
    context?: string;
  }
) {
  const db = await getDb();
  if (!db) return null;
  await db
    .update(referenceEntityLinks)
    .set(data)
    .where(eq(referenceEntityLinks.id, id));
  const [updated] = await db
    .select()
    .from(referenceEntityLinks)
    .where(eq(referenceEntityLinks.id, id));
  return updated;
}

/**
 * Delete a reference entity link
 */
export async function deleteReferenceEntityLink(id: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db
    .delete(referenceEntityLinks)
    .where(eq(referenceEntityLinks.id, id));
  return { success: true };
}

/**
 * Get statistics for reference entity links
 */
export async function getReferenceEntityLinkStats() {
  const db = await getDb();
  if (!db) return { total: 0, byEntityType: [], byLinkType: [] };
  
  const [totalCount] = await db
    .select({ count: count() })
    .from(referenceEntityLinks);
  
  const byEntityType = await db
    .select({
      entityType: referenceEntityLinks.entityType,
      count: count(),
    })
    .from(referenceEntityLinks)
    .groupBy(referenceEntityLinks.entityType);
  
  const byLinkType = await db
    .select({
      linkType: referenceEntityLinks.linkType,
      count: count(),
    })
    .from(referenceEntityLinks)
    .groupBy(referenceEntityLinks.linkType);
  
  return {
    total: totalCount?.count || 0,
    byEntityType,
    byLinkType,
  };
}



// ====================================================================
// IMPORT BIBLIOGRAPHY FROM JSON
// ====================================================================
// ============================================================================
// IMPORT BIBLIOGRAPHY FROM JSON
// ============================================================================

interface BibliographyImportEntry {
  id: string;
  type: string;
  author?: string;
  year?: number;
  title: string;
  publication?: string;
  publisher?: string;
  url?: string;
  content?: string;
  quote?: string;
  source?: string;
  source_id?: string;
  era?: string;
  region?: string;
  location?: string;
}

/**
 * Import bibliography entries from JSON format (like the Pasted_content_36.txt structure)
 */
export async function importBibliographyFromJson(
  entries: BibliographyImportEntry[],
  category: string = 'autre'
) {
  const db = await getDb();
  if (!db) return { success: 0, failed: 0, errors: [] as string[] };

  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  // Map entry types
  const typeMap: Record<string, string> = {
    'Publication Académique': 'article',
    'Article Scientifique': 'article',
    'Livre': 'book',
    'Rapport': 'techreport',
    'Site Web / Article': 'online',
    'Site Web / Projet': 'online',
    'Peinture': 'misc',
    'Musée': 'misc',
    'Génétique': 'misc',
    'Chimie': 'article',
    'Cultivars': 'misc',
  };

  // Map research domains
  const domainMap: Record<string, string> = {
    'olfactory_heritage_and_ritual_plants': 'patrimoine_olfactif',
    'tobacco_and_cannabis': 'tabac_cannabis',
    'cannabis': 'tabac_cannabis',
    'tobacco': 'tabac_cannabis',
  };

  for (const entry of entries) {
    try {
      // Generate a unique entry key
      const authorPart = entry.author?.split(',')[0]?.split(' ').pop()?.toLowerCase() || 'unknown';
      const yearPart = entry.year || 'nd';
      const titlePart = entry.title.split(' ').slice(0, 2).join('').toLowerCase().replace(/[^a-z]/g, '');
      const entryKey = `${authorPart}${yearPart}${titlePart}`;

      // Check if entry already exists
      const existing = await getBibliographyEntryByKey(entryKey);
      if (existing) {
        errors.push(`${entry.id}: Entrée déjà existante (${entryKey})`);
        failed++;
        continue;
      }

      const entryType = typeMap[entry.type] || 'misc';
      const researchDomain = domainMap[category] || 'autre';

      await db.insert(bibliographyEntries).values({
        entryKey,
        entryType: entryType as any,
        title: entry.title,
        authors: entry.author || null,
        year: entry.year || null,
        journal: entry.publication || null,
        publisher: entry.publisher || null,
        url: entry.url || null,
        abstract: entry.content || entry.quote || null,
        researchDomain: researchDomain as any,
        readStatus: 'unread',
        notes: entry.source ? `Source: ${entry.source}` : null,
      });

      success++;
    } catch (error: unknown) {
      failed++;
      errors.push(`${entry.id}: ${(error instanceof Error ? error.message : String(error))}`);
    }
  }

  return { success, failed, errors };
}



// ====================================================================
// BULK IMPORT & SUGGESTIONS FOR REFERENCE ENTITY LINKS
// ====================================================================
// ============================================================================
// BULK IMPORT & SUGGESTIONS FOR REFERENCE ENTITY LINKS
// ============================================================================

/**
 * Bulk import reference entity links from CSV data
 * Expected CSV columns: referenceId, entityType, entityId, linkType, relevanceScore, notes, context
 */
export async function bulkImportReferenceEntityLinks(data: Array<{
  referenceId: number;
  entityType: 'leaf_economy' | 'molecule' | 'recette' | 'plant' | 'prototype' | 'tradition' | 'terroir' | 'supplier';
  entityId: number;
  linkType?: 'documents' | 'mentions' | 'analyzes' | 'conserves' | 'reconstructs' | 'sources' | 'validates' | 'contextualizes';
  relevanceScore?: number;
  notes?: string;
  context?: string;
}>, createdBy?: number) {
  const db = await getDb();
  if (!db) return { success: false, created: 0, errors: [] };
  
  const errors: Array<{ row: number; error: string }> = [];
  let createdCount = 0;
  
  for (let i = 0; i < data.length; i++) {
    try {
      const item = data[i];
      
      // Validate required fields
      if (!item.referenceId || !item.entityType || !item.entityId) {
        errors.push({ row: i + 1, error: 'Missing required fields: referenceId, entityType, entityId' });
        continue;
      }
      
      // Check if reference exists
      const refExists = await db.select({ id: v3References.id })
        .from(v3References)
        .where(eq(v3References.id, item.referenceId))
        .limit(1);
      
      if (!refExists.length) {
        errors.push({ row: i + 1, error: `Reference ID ${item.referenceId} not found` });
        continue;
      }
      
      // Check for duplicate link
      const existingLink = await db.select({ id: referenceEntityLinks.id })
        .from(referenceEntityLinks)
        .where(and(
          eq(referenceEntityLinks.referenceId, item.referenceId),
          eq(referenceEntityLinks.entityType, item.entityType),
          eq(referenceEntityLinks.entityId, item.entityId)
        ))
        .limit(1);
      
      if (existingLink.length) {
        errors.push({ row: i + 1, error: 'Link already exists' });
        continue;
      }
      
      // Create the link
      await db.insert(referenceEntityLinks).values({
        referenceId: item.referenceId,
        entityType: item.entityType,
        entityId: item.entityId,
        linkType: item.linkType || 'documents',
        relevanceScore: item.relevanceScore || 50,
        notes: item.notes,
        context: item.context,
        createdBy: createdBy,
      });
      
      createdCount++;
    } catch (error: unknown) {
      errors.push({ row: i + 1, error: (error as Error).message || 'Unknown error' });
    }
  }
  
  return { success: errors.length === 0, created: createdCount, errors };
}

/**
 * Suggest links based on keyword matching between references and entities
 */
export async function suggestReferenceEntityLinks(options: {
  referenceId?: number;
  entityType?: 'leaf_economy' | 'molecule' | 'recette' | 'plant' | 'prototype' | 'tradition' | 'terroir' | 'supplier';
  minScore?: number;
  limit?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  
  const minScore = options.minScore || 60;
  const limit = options.limit || 50;
  
  const suggestions: Array<{
    referenceId: number;
    entityType: string;
    entityId: number;
    entityName: string;
    score: number;
    matchedKeywords: string[];
  }> = [];
  
  try {
    // Get references to analyze
    let references;
    if (options.referenceId) {
      references = await db.select()
        .from(v3References)
        .where(eq(v3References.id, options.referenceId))
        .limit(1);
    } else {
      references = await db.select()
        .from(v3References)
        .limit(100);
    }
    
    for (const ref of references) {
      // Extract keywords from reference (title, tags, notes)
      const tagsStr = Array.isArray(ref.tags) ? ref.tags.join(' ') : '';
      const refKeywords = extractKeywords(
        [ref.title, tagsStr, ref.notes].filter(Boolean).join(' ')
      );
      
      if (refKeywords.length === 0) continue;
      
      // Check molecules
      if (!options.entityType || options.entityType === 'molecule') {
        const moleculesList = await db.select()
          .from(molecules)
          .limit(500);
        
        for (const mol of moleculesList) {
          // Check if link already exists
          const existingLink = await db.select({ id: referenceEntityLinks.id })
            .from(referenceEntityLinks)
            .where(and(
              eq(referenceEntityLinks.referenceId, ref.id),
              eq(referenceEntityLinks.entityType, 'molecule'),
              eq(referenceEntityLinks.entityId, mol.id)
            ))
            .limit(1);
          
          if (existingLink.length) continue;
          
          const molKeywords = extractKeywords(
            [mol.name, mol.iupacName, mol.olfactiveProfile, mol.chemicalClass].filter(Boolean).join(' ')
          );
          
          const score = calculateKeywordSimilarity(refKeywords, molKeywords);
          if (score >= minScore) {
            suggestions.push({
              referenceId: ref.id,
              entityType: 'molecule',
              entityId: mol.id,
              entityName: mol.name,
              score,
              matchedKeywords: findCommonKeywords(refKeywords, molKeywords),
            });
          }
        }
      }
      
      // Check plants
      if (!options.entityType || options.entityType === 'plant') {
        const plantsList = await db.select()
          .from(plants)
          .limit(500);
        
        for (const plant of plantsList) {
          // Check if link already exists
          const existingLink = await db.select({ id: referenceEntityLinks.id })
            .from(referenceEntityLinks)
            .where(and(
              eq(referenceEntityLinks.referenceId, ref.id),
              eq(referenceEntityLinks.entityType, 'plant'),
              eq(referenceEntityLinks.entityId, plant.id)
            ))
            .limit(1);
          
          if (existingLink.length) continue;
          
          const plantKeywords = extractKeywords(
            [plant.name, plant.latinName, plant.family, (plant as Record<string, unknown>).description].filter(Boolean).join(' ')
          );
          
          const score = calculateKeywordSimilarity(refKeywords, plantKeywords);
          if (score >= minScore) {
            suggestions.push({
              referenceId: ref.id,
              entityType: 'plant',
              entityId: plant.id,
              entityName: plant.name,
              score,
              matchedKeywords: findCommonKeywords(refKeywords, plantKeywords),
            });
          }
        }
      }
    }
  } catch (error: unknown) {
    console.error('Error suggesting links:', error);
  }
  
  // Sort by score and return top results
  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Apply suggested links in bulk
 */
export async function applySuggestedLinks(suggestions: Array<{
  referenceId: number;
  entityType: 'leaf_economy' | 'molecule' | 'recette' | 'plant' | 'prototype' | 'tradition' | 'terroir' | 'supplier';
  entityId: number;
  score: number;
}>, createdBy?: number) {
  const db = await getDb();
  if (!db) return { success: false, created: 0, errors: [] };
  
  let createdCount = 0;
  const errors: Array<{ suggestion: number; error: string }> = [];
  
  for (let i = 0; i < suggestions.length; i++) {
    try {
      const suggestion = suggestions[i];
      
      // Check if link already exists
      const existingLink = await db.select({ id: referenceEntityLinks.id })
        .from(referenceEntityLinks)
        .where(and(
          eq(referenceEntityLinks.referenceId, suggestion.referenceId),
          eq(referenceEntityLinks.entityType, suggestion.entityType),
          eq(referenceEntityLinks.entityId, suggestion.entityId)
        ))
        .limit(1);
      
      if (existingLink.length) {
        errors.push({ suggestion: i, error: 'Link already exists' });
        continue;
      }
      
      // Create the link with relevance score from suggestion
      await db.insert(referenceEntityLinks).values({
        referenceId: suggestion.referenceId,
        entityType: suggestion.entityType,
        entityId: suggestion.entityId,
        linkType: 'documents',
        relevanceScore: Math.min(suggestion.score, 100),
        notes: 'Auto-suggested link based on keyword matching',
        createdBy: createdBy,
      });
      
      createdCount++;
    } catch (error: unknown) {
      errors.push({ suggestion: i, error: (error as Error).message || 'Unknown error' });
    }
  }
  
  return { success: errors.length === 0, created: createdCount, errors };
}

/**
 * Get graph data for D3.js visualization of reference entity links
 */
export async function getReferenceEntityLinkGraphData() {
  const db = await getDb();
  if (!db) return { nodes: [], links: [] };
  
  try {
    const links = await db.select().from(referenceEntityLinks).limit(1000);
    
    const nodeMap = new Map<string, { id: string; label: string; type: string; group: string }>();
    const edgeList: Array<{
      source: string;
      target: string;
      linkType: string;
      relevanceScore: number;
    }> = [];
    
    for (const link of links) {
      // Add reference node
      const refNodeId = `ref_${link.referenceId}`;
      if (!nodeMap.has(refNodeId)) {
        nodeMap.set(refNodeId, {
          id: refNodeId,
          label: `Ref ${link.referenceId}`,
          type: 'reference',
          group: 'references',
        });
      }
      
      // Add entity node
      const entityNodeId = `${link.entityType}_${link.entityId}`;
      if (!nodeMap.has(entityNodeId)) {
        nodeMap.set(entityNodeId, {
          id: entityNodeId,
          label: `${link.entityType} ${link.entityId}`,
          type: link.entityType,
          group: link.entityType,
        });
      }
      
      // Add edge
      edgeList.push({
        source: refNodeId,
        target: entityNodeId,
        linkType: link.linkType || 'documents',
        relevanceScore: link.relevanceScore || 50,
      });
    }
    
    return {
      nodes: Array.from(nodeMap.values()),
      links: edgeList,
    };
  } catch (error: unknown) {
    console.error('Error getting graph data:', error);
    return { nodes: [], links: [] };
  }
}



// ============================================================================
// KEYWORD UTILITY HELPERS (used by suggestReferenceEntityLinks)
// ============================================================================

/** Stop words to exclude from keyword extraction */
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  'has', 'have', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
  'it', 'its', 'as', 'not', 'no', 'so', 'if', 'then', 'than', 'when',
  'le', 'la', 'les', 'de', 'du', 'des', 'un', 'une', 'et', 'ou', 'en',
  'dans', 'sur', 'par', 'pour', 'avec', 'sans', 'est', 'sont', 'se',
]);

/**
 * Extract meaningful keywords from a text string.
 * Returns an array of lowercase tokens, filtered of stop words and short tokens.
 */
function extractKeywords(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u00c0-\u024f\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 3 && !STOP_WORDS.has(w));
}

/**
 * Calculate a similarity score (0–100) between two keyword arrays.
 * Uses Jaccard index on the union of both sets.
 */
function calculateKeywordSimilarity(kw1: string[], kw2: string[]): number {
  if (kw1.length === 0 || kw2.length === 0) return 0;
  const set1 = new Set(kw1);
  const set2 = new Set(kw2);
  const intersection = new Set(Array.from(set1).filter(k => set2.has(k)));
  const union = new Set([...Array.from(set1), ...Array.from(set2)]);
  return union.size === 0 ? 0 : Math.round((intersection.size / union.size) * 100);
}

/**
 * Return the keywords that appear in both arrays.
 */
function findCommonKeywords(kw1: string[], kw2: string[]): string[] {
  const set2 = new Set(kw2);
  return kw1.filter(k => set2.has(k));
}
