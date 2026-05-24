/**
 * Extracted from server/db/misc.ts
 * Module: Entity Linking
 */
import { getDb } from "./core";
import { getLinksForReference } from "./bibliography";
import { eq, and, or, desc, asc, sql, like, inArray, isNull, isNotNull, count, SQL, between, ne, gt, lt, gte, lte, notInArray, exists } from "drizzle-orm";
import * as schema from "../../drizzle/schema";

const { molecules, plants, referenceEntityLinks, terroirs, thematicAxes, v3References } = schema;



// ====================================================================
// AUTOMATIC ENTITY LINKING (Liaisons automatiques par mots-clés)
// ====================================================================
// ============================================================================
// AUTOMATIC ENTITY LINKING (Liaisons automatiques par mots-clés)
// ============================================================================

/**
 * Keywords database for automatic linking
 * Maps common terms to entity types and specific entities
 */
const ENTITY_KEYWORDS: Record<string, { entityType: string; keywords: string[] }[]> = {
  // Molécules communes
  'linalool': [{ entityType: 'molecule', keywords: ['linalool', 'linalol', 'linalyl'] }],
  'limonene': [{ entityType: 'molecule', keywords: ['limonene', 'limonène', 'd-limonene'] }],
  'pinene': [{ entityType: 'molecule', keywords: ['pinene', 'pinène', 'alpha-pinene', 'beta-pinene'] }],
  'geraniol': [{ entityType: 'molecule', keywords: ['geraniol', 'géraniol'] }],
  'citronellol': [{ entityType: 'molecule', keywords: ['citronellol', 'citronellal'] }],
  'eugenol': [{ entityType: 'molecule', keywords: ['eugenol', 'eugénol', 'methyl eugenol'] }],
  'carvone': [{ entityType: 'molecule', keywords: ['carvone', 'carvon'] }],
  'menthol': [{ entityType: 'molecule', keywords: ['menthol', 'menthone'] }],
  'camphor': [{ entityType: 'molecule', keywords: ['camphor', 'camphre', 'camphène'] }],
  'thymol': [{ entityType: 'molecule', keywords: ['thymol', 'thym'] }],
  'caryophyllene': [{ entityType: 'molecule', keywords: ['caryophyllene', 'caryophyllène', 'beta-caryophyllene'] }],
  'myrcene': [{ entityType: 'molecule', keywords: ['myrcene', 'myrcène'] }],
  'terpinene': [{ entityType: 'molecule', keywords: ['terpinene', 'terpinène', 'gamma-terpinene'] }],
  'ocimene': [{ entityType: 'molecule', keywords: ['ocimene', 'ocimène'] }],
  'farnesene': [{ entityType: 'molecule', keywords: ['farnesene', 'farnésène'] }],
  'humulene': [{ entityType: 'molecule', keywords: ['humulene', 'humulène', 'alpha-humulene'] }],
  'bisabolol': [{ entityType: 'molecule', keywords: ['bisabolol', 'bisabolène'] }],
  'nerolidol': [{ entityType: 'molecule', keywords: ['nerolidol', 'nérolidol'] }],
  'valencene': [{ entityType: 'molecule', keywords: ['valencene', 'valencène'] }],
  'guaiol': [{ entityType: 'molecule', keywords: ['guaiol', 'guaïol'] }],
  // Plantes communes
  'lavande': [{ entityType: 'plant', keywords: ['lavande', 'lavender', 'lavandula'] }],
  'rose': [{ entityType: 'plant', keywords: ['rose', 'rosa', 'rosier'] }],
  'jasmin': [{ entityType: 'plant', keywords: ['jasmin', 'jasmine', 'jasminum'] }],
  'menthe': [{ entityType: 'plant', keywords: ['menthe', 'mint', 'mentha'] }],
  'eucalyptus': [{ entityType: 'plant', keywords: ['eucalyptus'] }],
  'citron': [{ entityType: 'plant', keywords: ['citron', 'lemon', 'citrus limon'] }],
  'orange': [{ entityType: 'plant', keywords: ['orange', 'citrus sinensis', 'oranger'] }],
  'bergamote': [{ entityType: 'plant', keywords: ['bergamote', 'bergamot', 'citrus bergamia'] }],
  'patchouli': [{ entityType: 'plant', keywords: ['patchouli', 'pogostemon'] }],
  'vetiver': [{ entityType: 'plant', keywords: ['vetiver', 'vétiver', 'chrysopogon'] }],
  'santal': [{ entityType: 'plant', keywords: ['santal', 'sandalwood', 'santalum'] }],
  'cedre': [{ entityType: 'plant', keywords: ['cèdre', 'cedar', 'cedrus'] }],
  'ylang': [{ entityType: 'plant', keywords: ['ylang', 'cananga'] }],
  'geranium': [{ entityType: 'plant', keywords: ['géranium', 'geranium', 'pelargonium'] }],
  'romarin': [{ entityType: 'plant', keywords: ['romarin', 'rosemary', 'rosmarinus'] }],
  'thym': [{ entityType: 'plant', keywords: ['thym', 'thyme', 'thymus'] }],
  'sauge': [{ entityType: 'plant', keywords: ['sauge', 'sage', 'salvia'] }],
  'basilic': [{ entityType: 'plant', keywords: ['basilic', 'basil', 'ocimum'] }],
  'cannabis': [{ entityType: 'plant', keywords: ['cannabis', 'hemp', 'chanvre', 'marijuana'] }],
  'tabac': [{ entityType: 'plant', keywords: ['tabac', 'tobacco', 'nicotiana'] }],
  // Terroirs
  'grasse': [{ entityType: 'terroir', keywords: ['grasse', 'provence'] }],
  'madagascar': [{ entityType: 'terroir', keywords: ['madagascar'] }],
  'egypte': [{ entityType: 'terroir', keywords: ['egypte', 'egypt', 'égypte'] }],
  'inde': [{ entityType: 'terroir', keywords: ['inde', 'india', 'indien'] }],
  'maroc': [{ entityType: 'terroir', keywords: ['maroc', 'morocco', 'marocain'] }],
  'bulgarie': [{ entityType: 'terroir', keywords: ['bulgarie', 'bulgaria', 'bulgare'] }],
  'turquie': [{ entityType: 'terroir', keywords: ['turquie', 'turkey', 'turc'] }],
  'iran': [{ entityType: 'terroir', keywords: ['iran', 'perse', 'persia'] }],
};

/**
 * Extract keywords from text for matching
 */
function extractKeywords(text: string): string[] {
  if (!text) return [];
  
  // Normalize text: lowercase, remove accents, split on non-alphanumeric
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
  
  return Array.from(new Set(normalized));
}

/**
 * Find common keywords between two sets
 */
function findCommonKeywords(keywords1: string[], keywords2: string[]): string[] {
  const set1 = new Set(keywords1);
  const set2 = new Set(keywords2);
  return Array.from(set1).filter(k => set2.has(k));
}

/**
 * Calculate similarity score between two sets of keywords
 */
function calculateKeywordSimilarity(keywords1: string[], keywords2: string[]): number {
  if (keywords1.length === 0 || keywords2.length === 0) return 0;
  
  const set1 = new Set(keywords1);
  const set2 = new Set(keywords2);
  
  let matches = 0;
  const arr1 = Array.from(set1);
  const arr2 = Array.from(set2);
  for (const word of arr1) {
    if (set2.has(word)) {
      matches++;
    } else {
      // Check for partial matches (substring)
      for (const word2 of arr2) {
        if (word.includes(word2) || word2.includes(word)) {
          matches += 0.5;
          break;
        }
      }
    }
  }
  
  // Jaccard-like similarity
  const union = new Set(Array.from(set1).concat(Array.from(set2))).size;
  return Math.round((matches / union) * 100);
}

/**
 * Suggest entity links for a reference based on keywords
 */
export async function suggestEntityLinksForReference(referenceId: number): Promise<{
  referenceId: number;
  referenceTitle: string;
  suggestions: {
    entityType: 'molecule' | 'plant' | 'terroir' | 'recette' | 'tradition';
    entityId: number;
    entityName: string;
    score: number;
    matchedKeywords: string[];
    reason: string;
  }[];
}> {
  const db = await getDb();
  if (!db) return { referenceId, referenceTitle: '', suggestions: [] };
  
  // Get the reference
  const [ref] = await db
    .select()
    .from(v3References)
    .where(eq(v3References.id, referenceId));
  
  if (!ref) return { referenceId, referenceTitle: '', suggestions: [] };
  
  // Extract keywords from reference
  const refText = [
    ref.title || '',
    ref.notes || '',
    ref.userNotes || '',
    ...(ref.tags || []),
  ].join(' ');
  
  const refKeywords = extractKeywords(refText);
  const suggestions: {
    entityType: 'molecule' | 'plant' | 'terroir' | 'recette' | 'tradition';
    entityId: number;
    entityName: string;
    score: number;
    matchedKeywords: string[];
    reason: string;
  }[] = [];
  
  // Get existing links to exclude
  const existingLinks = await db
    .select({ entityType: referenceEntityLinks.entityType, entityId: referenceEntityLinks.entityId })
    .from(referenceEntityLinks)
    .where(eq(referenceEntityLinks.referenceId, referenceId));
  
  const existingSet = new Set(existingLinks.map(l => `${l.entityType}:${l.entityId}`));
  
  // Search molecules
  const allMolecules = await db
    .select({ id: molecules.id, name: molecules.name, olfactiveProfile: molecules.olfactiveProfile })
    .from(molecules)
    .limit(1000);
  
  for (const mol of allMolecules) {
    if (existingSet.has(`molecule:${mol.id}`)) continue;
    
    const molKeywords = extractKeywords([mol.name, mol.olfactiveProfile || ''].join(' '));
    const score = calculateKeywordSimilarity(refKeywords, molKeywords);
    
    if (score >= 20) {
      const matchedKeywords = refKeywords.filter(k => 
        molKeywords.some(mk => mk.includes(k) || k.includes(mk))
      );
      suggestions.push({
        entityType: 'molecule',
        entityId: mol.id,
        entityName: mol.name,
        score,
        matchedKeywords,
        reason: `Mots-clés communs: ${matchedKeywords.slice(0, 3).join(', ')}`,
      });
    }
  }
  
  // Search plants
  const allPlants = await db
    .select({ id: plants.id, name: plants.name, latinName: sql<string>`COALESCE(${plants.latinName}, '')`, olfactiveSignature: plants.olfactiveSignature })
    .from(plants)
    .limit(500);
  
  for (const plant of allPlants) {
    if (existingSet.has(`plant:${plant.id}`)) continue;
    
    const plantKeywords = extractKeywords([plant.name, plant.latinName || '', plant.olfactiveSignature || ''].join(' '));
    const score = calculateKeywordSimilarity(refKeywords, plantKeywords);
    
    if (score >= 20) {
      const matchedKeywords = refKeywords.filter(k => 
        plantKeywords.some(pk => pk.includes(k) || k.includes(pk))
      );
      suggestions.push({
        entityType: 'plant',
        entityId: plant.id,
        entityName: plant.name,
        score,
        matchedKeywords,
        reason: `Mots-clés communs: ${matchedKeywords.slice(0, 3).join(', ')}`,
      });
    }
  }
  
  // Search terroirs
  const allTerroirs = await db
    .select({ id: terroirs.id, name: terroirs.name, country: terroirs.country, region: terroirs.region })
    .from(terroirs)
    .limit(100);
  
  for (const terroir of allTerroirs) {
    if (existingSet.has(`terroir:${terroir.id}`)) continue;
    
    const terroirKeywords = extractKeywords([terroir.name, terroir.country || '', terroir.region || ''].join(' '));
    const score = calculateKeywordSimilarity(refKeywords, terroirKeywords);
    
    if (score >= 15) {
      const matchedKeywords = refKeywords.filter(k => 
        terroirKeywords.some(tk => tk.includes(k) || k.includes(tk))
      );
      suggestions.push({
        entityType: 'terroir',
        entityId: terroir.id,
        entityName: terroir.name,
        score,
        matchedKeywords,
        reason: `Mots-clés communs: ${matchedKeywords.slice(0, 3).join(', ')}`,
      });
    }
  }
  
  // Sort by score and limit
  suggestions.sort((a, b) => b.score - a.score);
  
  return {
    referenceId,
    referenceTitle: ref.title || '',
    suggestions: suggestions.slice(0, 20),
  };
}

/**
 * Bulk suggest entity links for all references
 */
export async function bulkSuggestEntityLinks(options?: {
  minScore?: number;
  limit?: number;
  entityTypes?: ('molecule' | 'plant' | 'terroir')[];
}): Promise<{
  totalReferences: number;
  referencesWithSuggestions: number;
  totalSuggestions: number;
  suggestions: {
    referenceId: number;
    referenceTitle: string;
    axisPrimaryCode: string | null;
    entityType: string;
    entityId: number;
    entityName: string;
    score: number;
    matchedKeywords: string[];
  }[];
}> {
  const db = await getDb();
  if (!db) return { totalReferences: 0, referencesWithSuggestions: 0, totalSuggestions: 0, suggestions: [] };
  
  const minScore = options?.minScore || 25;
  const limit = options?.limit || 100;
  const entityTypes = options?.entityTypes || ['molecule', 'plant', 'terroir'];
  
  // Get all references
  const allRefs = await db
    .select()
    .from(v3References)
    .orderBy(desc(v3References.year));
  
  // Get all existing links
  const existingLinks = await db
    .select({ referenceId: referenceEntityLinks.referenceId, entityType: referenceEntityLinks.entityType, entityId: referenceEntityLinks.entityId })
    .from(referenceEntityLinks);
  
  const existingSet = new Set(existingLinks.map(l => `${l.referenceId}:${l.entityType}:${l.entityId}`));
  
  // Get all entities
  const allMolecules = entityTypes.includes('molecule') ? await db
    .select({ id: molecules.id, name: molecules.name, olfactiveProfile: molecules.olfactiveProfile })
    .from(molecules)
    .limit(1000) : [];
  
  const allPlants = entityTypes.includes('plant') ? await db
    .select({ id: plants.id, name: plants.name, latinName: sql<string>`COALESCE(${plants.latinName}, '')`, olfactiveSignature: plants.olfactiveSignature })
    .from(plants)
    .limit(500) : [];
  
  const allTerroirs = entityTypes.includes('terroir') ? await db
    .select({ id: terroirs.id, name: terroirs.name, country: terroirs.country, region: terroirs.region })
    .from(terroirs)
    .limit(100) : [];
  
  const allSuggestions: {
    referenceId: number;
    referenceTitle: string;
    axisPrimaryCode: string | null;
    entityType: string;
    entityId: number;
    entityName: string;
    score: number;
    matchedKeywords: string[];
  }[] = [];
  
  let referencesWithSuggestions = 0;
  
  for (const ref of allRefs) {
    const refText = [
      ref.title || '',
      ref.notes || '',
      ref.userNotes || '',
      ...(ref.tags || []),
    ].join(' ');
    
    const refKeywords = extractKeywords(refText);
    let hasSuggestions = false;
    
    // Check molecules
    for (const mol of allMolecules) {
      if (existingSet.has(`${ref.id}:molecule:${mol.id}`)) continue;
      
      const molKeywords = extractKeywords([mol.name, mol.olfactiveProfile || ''].join(' '));
      const score = calculateKeywordSimilarity(refKeywords, molKeywords);
      
      if (score >= minScore) {
        const matchedKeywords = refKeywords.filter(k => 
          molKeywords.some(mk => mk.includes(k) || k.includes(mk))
        );
        allSuggestions.push({
          referenceId: ref.id,
          referenceTitle: ref.title || '',
          axisPrimaryCode: ref.axisPrimaryCode,
          entityType: 'molecule',
          entityId: mol.id,
          entityName: mol.name,
          score,
          matchedKeywords,
        });
        hasSuggestions = true;
      }
    }
    
    // Check plants
    for (const plant of allPlants) {
      if (existingSet.has(`${ref.id}:plant:${plant.id}`)) continue;
      
      const plantKeywords = extractKeywords([plant.name, plant.latinName || '', plant.olfactiveSignature || ''].join(' '));
      const score = calculateKeywordSimilarity(refKeywords, plantKeywords);
      
      if (score >= minScore) {
        const matchedKeywords = refKeywords.filter(k => 
          plantKeywords.some(pk => pk.includes(k) || k.includes(pk))
        );
        allSuggestions.push({
          referenceId: ref.id,
          referenceTitle: ref.title || '',
          axisPrimaryCode: ref.axisPrimaryCode,
          entityType: 'plant',
          entityId: plant.id,
          entityName: plant.name,
          score,
          matchedKeywords,
        });
        hasSuggestions = true;
      }
    }
    
    // Check terroirs
    for (const terroir of allTerroirs) {
      if (existingSet.has(`${ref.id}:terroir:${terroir.id}`)) continue;
      
      const terroirKeywords = extractKeywords([terroir.name, terroir.country || '', terroir.region || ''].join(' '));
      const score = calculateKeywordSimilarity(refKeywords, terroirKeywords);
      
      if (score >= minScore - 10) {
        const matchedKeywords = refKeywords.filter(k => 
          terroirKeywords.some(tk => tk.includes(k) || k.includes(tk))
        );
        allSuggestions.push({
          referenceId: ref.id,
          referenceTitle: ref.title || '',
          axisPrimaryCode: ref.axisPrimaryCode,
          entityType: 'terroir',
          entityId: terroir.id,
          entityName: terroir.name,
          score,
          matchedKeywords,
        });
        hasSuggestions = true;
      }
    }
    
    if (hasSuggestions) referencesWithSuggestions++;
  }
  
  // Sort by score and limit
  allSuggestions.sort((a, b) => b.score - a.score);
  
  return {
    totalReferences: allRefs.length,
    referencesWithSuggestions,
    totalSuggestions: allSuggestions.length,
    suggestions: allSuggestions.slice(0, limit),
  };
}

/**
 * Create multiple entity links at once (batch)
 */
export async function batchCreateEntityLinks(links: {
  referenceId: number;
  entityType: 'leaf_economy' | 'molecule' | 'recette' | 'plant' | 'prototype' | 'tradition' | 'terroir' | 'supplier';
  entityId: number;
  linkType?: 'documents' | 'mentions' | 'analyzes' | 'conserves' | 'reconstructs' | 'sources' | 'validates' | 'contextualizes';
  relevanceScore?: number;
  notes?: string;
  createdBy?: number;
}[]): Promise<{ created: number; skipped: number; errors: string[] }> {
  const db = await getDb();
  if (!db) return { created: 0, skipped: 0, errors: ['Database not available'] };
  
  let created = 0;
  let skipped = 0;
  const errors: string[] = [];
  
  for (const link of links) {
    try {
      // Check if link already exists
      const [existing] = await db
        .select({ id: referenceEntityLinks.id })
        .from(referenceEntityLinks)
        .where(
          and(
            eq(referenceEntityLinks.referenceId, link.referenceId),
            eq(referenceEntityLinks.entityType, link.entityType),
            eq(referenceEntityLinks.entityId, link.entityId)
          )
        );
      
      if (existing) {
        skipped++;
        continue;
      }
      
      await db.insert(referenceEntityLinks).values({
        referenceId: link.referenceId,
        entityType: link.entityType,
        entityId: link.entityId,
        linkType: link.linkType || 'documents',
        relevanceScore: link.relevanceScore || 50,
        notes: link.notes,
        createdBy: link.createdBy,
      });
      
      created++;
    } catch (error) {
      errors.push(`Failed to create link ${link.referenceId}->${link.entityType}:${link.entityId}: ${error}`);
    }
  }
  
  return { created, skipped, errors };
}

/**
 * Get references grouped by thematic axis for graph visualization
 */
export async function getReferencesGroupedByAxis(): Promise<{
  axes: {
    id: number;
    code: string;
    name: string;
    metaAxis: string;
    color: string;
    referenceCount: number;
  }[];
  references: {
    id: number;
    title: string;
    year: number | null;
    entryType: string;
    axisPrimaryCode: string | null;
    axesSecondary: string[] | null;
    entityLinkCount: number;
  }[];
  links: {
    source: string; // axis code or reference id
    target: string;
    type: 'primary' | 'secondary';
  }[];
}> {
  const db = await getDb();
  if (!db) return { axes: [], references: [], links: [] };
  
  // Get all axes
  const axes = await db
    .select()
    .from(thematicAxes)
    .orderBy(thematicAxes.displayOrder, thematicAxes.axisCode);
  
  // Get all references
  const refs = await db
    .select()
    .from(v3References)
    .orderBy(desc(v3References.year));
  
  // Get entity link counts per reference
  const linkCounts = await db
    .select({
      referenceId: referenceEntityLinks.referenceId,
      count: count(),
    })
    .from(referenceEntityLinks)
    .groupBy(referenceEntityLinks.referenceId);
  
  const linkCountMap = new Map(linkCounts.map(l => [l.referenceId, l.count]));
  
  // Count references per axis
  const axisRefCounts = new Map<string, number>();
  for (const ref of refs) {
    if (ref.axisPrimaryCode) {
      axisRefCounts.set(ref.axisPrimaryCode, (axisRefCounts.get(ref.axisPrimaryCode) || 0) + 1);
    }
    for (const code of (ref.axesSecondary || [])) {
      axisRefCounts.set(code, (axisRefCounts.get(code) || 0) + 1);
    }
  }
  
  // Build links
  const links: { source: string; target: string; type: 'primary' | 'secondary' }[] = [];
  for (const ref of refs) {
    if (ref.axisPrimaryCode) {
      links.push({
        source: ref.axisPrimaryCode,
        target: `ref-${ref.id}`,
        type: 'primary',
      });
    }
    for (const code of (ref.axesSecondary || [])) {
      links.push({
        source: code,
        target: `ref-${ref.id}`,
        type: 'secondary',
      });
    }
  }
  
  return {
    axes: axes.map(a => ({
      id: a.id,
      code: a.axisCode,
      name: a.name,
      metaAxis: a.metaAxis,
      color: a.color || '#6366f1',
      referenceCount: axisRefCounts.get(a.axisCode) || 0,
    })),
    references: refs.map(r => ({
      id: r.id,
      title: r.title || '',
      year: r.year,
      entryType: r.entryType,
      axisPrimaryCode: r.axisPrimaryCode,
      axesSecondary: r.axesSecondary,
      entityLinkCount: linkCountMap.get(r.id) || 0,
    })),
    links,
  };
}

/**
 * Get reference details with all linked entities
 */
export async function getReferenceWithLinkedEntities(referenceId: number): Promise<{
  reference: typeof v3References.$inferSelect | null;
  axis: typeof thematicAxes.$inferSelect | null;
  linkedEntities: {
    entityType: string;
    entityId: number;
    entityName: string;
    linkType: string;
    relevanceScore: number;
    notes: string | null;
  }[];
}> {
  const db = await getDb();
  if (!db) return { reference: null, axis: null, linkedEntities: [] };
  
  // Get reference
  const [ref] = await db
    .select()
    .from(v3References)
    .where(eq(v3References.id, referenceId));
  
  if (!ref) return { reference: null, axis: null, linkedEntities: [] };
  
  // Get primary axis
  let axis = null;
  if (ref.axisPrimaryId) {
    const [a] = await db
      .select()
      .from(thematicAxes)
      .where(eq(thematicAxes.id, ref.axisPrimaryId));
    axis = a;
  }
  
  // Get linked entities
  const links = await getLinksForReference(referenceId);
  
  return {
    reference: ref,
    axis,
    linkedEntities: links.map(l => ({
      entityType: l.entityType,
      entityId: l.entityId,
      entityName: l.entityName || '',
      linkType: l.linkType || 'documents',
      relevanceScore: l.relevanceScore || 50,
      notes: l.notes,
    })),
  };
}

/**
 * Get statistics for graph visualization
 */
export async function getGraphVisualizationStats(): Promise<{
  totalAxes: number;
  totalReferences: number;
  totalLinks: number;
  referencesByMetaAxis: { metaAxis: string; count: number }[];
  topAxesByReferences: { code: string; name: string; count: number }[];
  referencesWithLinks: number;
  referencesWithoutLinks: number;
}> {
  const db = await getDb();
  if (!db) return {
    totalAxes: 0,
    totalReferences: 0,
    totalLinks: 0,
    referencesByMetaAxis: [],
    topAxesByReferences: [],
    referencesWithLinks: 0,
    referencesWithoutLinks: 0,
  };
  
  // Count axes
  const [axesCount] = await db.select({ count: count() }).from(thematicAxes);
  
  // Count references
  const [refsCount] = await db.select({ count: count() }).from(v3References);
  
  // Count entity links
  const [linksCount] = await db.select({ count: count() }).from(referenceEntityLinks);
  
  // Get all axes
  const axes = await db.select().from(thematicAxes);
  
  // Get all references
  const refs = await db.select().from(v3References);
  
  // Count by meta-axis
  const metaAxisCounts = new Map<string, number>();
  for (const ref of refs) {
    if (ref.axisPrimaryCode) {
      const axis = axes.find(a => a.axisCode === ref.axisPrimaryCode);
      if (axis) {
        metaAxisCounts.set(axis.metaAxis, (metaAxisCounts.get(axis.metaAxis) || 0) + 1);
      }
    }
  }
  
  // Count references per axis
  const axisRefCounts = new Map<string, number>();
  for (const ref of refs) {
    if (ref.axisPrimaryCode) {
      axisRefCounts.set(ref.axisPrimaryCode, (axisRefCounts.get(ref.axisPrimaryCode) || 0) + 1);
    }
  }
  
  // Get references with entity links
  const refsWithLinks = await db
    .selectDistinct({ referenceId: referenceEntityLinks.referenceId })
    .from(referenceEntityLinks);
  
  return {
    totalAxes: axesCount.count,
    totalReferences: refsCount.count,
    totalLinks: linksCount.count,
    referencesByMetaAxis: Array.from(metaAxisCounts.entries()).map(([metaAxis, count]) => ({
      metaAxis,
      count,
    })),
    topAxesByReferences: Array.from(axisRefCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([code, count]) => {
        const axis = axes.find(a => a.axisCode === code);
        return {
          code,
          name: axis?.name || code,
          count,
        };
      }),
    referencesWithLinks: refsWithLinks.length,
    referencesWithoutLinks: refsCount.count - refsWithLinks.length,
  };
}



