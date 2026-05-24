/**
 * Extracted from server/db/molecules.ts
 * Module: Tps Genes
 */
/**
 * Module: molecules
 * Généré automatiquement depuis server/db.ts
 * Sections: MOLECULES, MOLECULE DETAILS WITH RELATIONS, GET ALL MOLECULE-RECETTE RELATIONSHIPS FOR CORRELATION ANALYSIS (+25 autres)
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
  ghostVarietyMoleculeLinks,
  GhostVarietyMoleculeLink,
  InsertGhostVarietyMoleculeLink,
  genomicMoleculeLinks,
  GenomicMoleculeLink,
  InsertGenomicMoleculeLink,
} from "../../drizzle/schema";
import { getDb } from './core';
import type { FlavornetData } from '../flavornet';
import { enrichMoleculeWithTranslationCOCONUT } from '../coconut';
import { getPlantVarietyById } from './plants';

import { ENV } from '../_core/env';
import { expandSearchQuery, getSynonyms, normalizeSearchTerm, categorizeOlfactiveTerm, getDictionaryStats } from '../../shared/olfactiveSynonyms';
import { expandWithScientificNames, getScientificDictionaryStats } from '../../shared/botanicalLatinNames';


// ====================================================================
// MOLECULES
// ====================================================================
// ============================================================================
// MOLECULES
// ============================================================================

/**
 * Parse tous les champs JSON d'une molécule qui peuvent être stockés comme strings
 * par MySQL/TiDB (comportement natif : les colonnes json() reviennent parfois en string).
 *
 * SOURCE UNIQUE DE VÉRITÉ pour le parsing JSON des molécules.
 * AJOUTER ICI tout nouveau champ JSON ajouté au schema molecules.
 *
 * Champs couverts :
 *   - json() dans Drizzle : references, pubchemSynonyms, coconutOrganisms, coconutCitations, ifraData
 *   - text() contenant parfois du JSON : therapeuticProperties, olfactiveProfile
 */

export async function getTpsGeneMoleculeLinks(filters?: {
  tpsGeneId?: number;
  moleculeId?: number;
  relationshipType?: string;
  confidenceLevel?: string;
}) {
  try {
    let query = `
      SELECT 
        tgm.id,
        tgm.tps_gene_id as tpsGeneId,
        tgm.molecule_id as moleculeId,
        tgm.relationship_type as relationshipType,
        tgm.confidence_level as confidenceLevel,
        tgm.evidence_source as evidenceSource,
        tgm.notes,
        tgm.created_at as createdAt,
        tg.name as geneName,
        tg.subfamily as geneSubfamily,
        tg.product_class as geneProductClass,
        tg.main_product as geneMainProduct,
        tg.olfactory_notes as geneOlfactoryNotes,
        m.name as moleculeName,
        m.formula as moleculeFormula,
        m.olfactiveProfile as moleculeOlfactiveProfile
      FROM tps_gene_molecules tgm
      JOIN tps_genes tg ON tgm.tps_gene_id = tg.id
      JOIN molecules m ON tgm.molecule_id = m.id
      WHERE 1=1
    `;
    
    const params: (string | number | null)[] = [];
    
    if (filters?.tpsGeneId) {
      query += ` AND tgm.tps_gene_id = ?`;
      params.push(filters.tpsGeneId);
    }
    
    if (filters?.moleculeId) {
      query += ` AND tgm.molecule_id = ?`;
      params.push(filters.moleculeId);
    }
    
    if (filters?.relationshipType) {
      query += ` AND tgm.relationship_type = ?`;
      params.push(filters.relationshipType);
    }
    
    if (filters?.confidenceLevel) {
      query += ` AND tgm.confidence_level = ?`;
      params.push(filters.confidenceLevel);
    }
    
    query += ` ORDER BY tg.name, m.name`;
    
    const db = await getDb();
    if (!db) return [];
    const result = await (db as unknown as { execute: (q: unknown) => Promise<unknown[]> }).execute(sql.raw(query.replace(/\?/g, (_, i) => `'${String(params[i] || '').replace(/'/g, "''")}'`)));
    return (result[0] as Record<string, unknown>[]);
  } catch (error: unknown) {
    console.error('Error getting TPS gene-molecule links:', error);
    return [];
  }
}

// Create a TPS gene-molecule link
export async function createTpsGeneMoleculeLink(data: {
  tpsGeneId: number;
  moleculeId: number;
  relationshipType?: string;
  confidenceLevel?: string;
  evidenceSource?: string;
  notes?: string;
}) {
  try {
    const db = await getDb();
    if (!db) return { success: false, error: 'Database connection failed' };
    const evidenceSource = data.evidenceSource ? `'${data.evidenceSource.replace(/'/g, "''")}'` : 'NULL';
    const notes = data.notes ? `'${data.notes.replace(/'/g, "''")}'` : 'NULL';
    await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(sql.raw(`
      INSERT INTO tps_gene_molecules 
        (tps_gene_id, molecule_id, relationship_type, confidence_level, evidence_source, notes)
       VALUES (${data.tpsGeneId}, ${data.moleculeId}, '${data.relationshipType || 'produces'}', '${data.confidenceLevel || 'inferred'}', ${evidenceSource}, ${notes})
    `));
    return { success: true, id: 0 };
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'ER_DUP_ENTRY') {
      return { success: false, error: 'Cette liaison existe déjà' };
    }
    console.error('Error creating TPS gene-molecule link:', error);
    return { success: false, error: (error as Error).message };
  }
}

// Update a TPS gene-molecule link
export async function updateTpsGeneMoleculeLink(
  id: number,
  data: {
    relationshipType?: string;
    confidenceLevel?: string;
    evidenceSource?: string;
    notes?: string;
  }
) {
  try {
    const updates: string[] = [];
    const params: (string | number | null)[] = [];
    
    if (data.relationshipType) {
      updates.push('relationship_type = ?');
      params.push(data.relationshipType);
    }
    if (data.confidenceLevel) {
      updates.push('confidence_level = ?');
      params.push(data.confidenceLevel);
    }
    if (data.evidenceSource !== undefined) {
      updates.push('evidence_source = ?');
      params.push(data.evidenceSource);
    }
    if (data.notes !== undefined) {
      updates.push('notes = ?');
      params.push(data.notes);
    }
    
    if (updates.length === 0) {
      return { success: false, error: 'Aucune mise à jour fournie' };
    }
    
    params.push(id);
    
    const db = await getDb();
    if (!db) return { success: false, error: 'Database connection failed' };
    const setClause = updates.map((u, i) => u.replace('?', `'${String(params[i]).replace(/'/g, "''")}'`)).join(', ');
    await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(sql.raw(`UPDATE tps_gene_molecules SET ${setClause} WHERE id = ${id}`));
    
    return { success: true };
  } catch (error: unknown) {
    console.error('Error updating TPS gene-molecule link:', error);
    return { success: false, error: (error as Error).message };
  }
}

// Delete a TPS gene-molecule link
export async function deleteTpsGeneMoleculeLink(id: number) {
  try {
    const db = await getDb();
    if (!db) return { success: false, error: 'Database connection failed' };
    await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(sql.raw(`DELETE FROM tps_gene_molecules WHERE id = ${id}`));
    return { success: true };
  } catch (error: unknown) {
    console.error('Error deleting TPS gene-molecule link:', error);
    return { success: false, error: (error as Error).message };
  }
}

// Get TPS gene-molecule link statistics
export async function getTpsGeneMoleculeLinkStats() {
  try {
    const db = await getDb();
    if (!db) {
      return {
        totalLinks: 0,
        byRelationship: [],
        byConfidence: [],
        linkedGenes: 0,
        linkedMolecules: 0,
        totalGenes: 0,
        totalMolecules: 0,
        geneCoverage: 0,
        moleculeCoverage: 0,
      };
    }
    const totalLinksResult = await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(sql.raw(
      'SELECT COUNT(*) as count FROM tps_gene_molecules'
    ));
    const totalLinks = ((totalLinksResult[0] as unknown) as Record<string,unknown>[])[0]?.count || 0;
    const byRelationshipResult = await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(sql.raw(`
      SELECT relationship_type as type, COUNT(*) as count 
      FROM tps_gene_molecules 
      GROUP BY relationship_type
    `));
    const byRelationship = (byRelationshipResult[0] as unknown) as Record<string,unknown>[];
    const byConfidenceResult = await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(sql.raw(`
      SELECT confidence_level as level, COUNT(*) as count 
      FROM tps_gene_molecules 
      GROUP BY confidence_level
    `));
    const byConfidence = (byConfidenceResult[0] as unknown) as Record<string,unknown>[];
    const linkedGenesResult = await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(sql.raw(`
      SELECT COUNT(DISTINCT tps_gene_id) as count FROM tps_gene_molecules
    `));
    const linkedGenes = ((linkedGenesResult[0] as unknown) as Record<string,unknown>[])[0]?.count || 0;
    const linkedMoleculesResult = await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(sql.raw(`
      SELECT COUNT(DISTINCT molecule_id) as count FROM tps_gene_molecules
    `));
    const linkedMolecules = ((linkedMoleculesResult[0] as unknown) as Record<string,unknown>[])[0]?.count || 0;
    const totalGenesResult = await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(sql.raw(
      'SELECT COUNT(*) as count FROM tps_genes'
    ));
    const totalGenesCount = ((totalGenesResult[0] as unknown) as Record<string,unknown>[])[0]?.count || 0;
    const totalMoleculesResult = await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(sql.raw(
      'SELECT COUNT(*) as count FROM molecules'
    ));
    const totalMoleculesCount = ((totalMoleculesResult[0] as unknown) as Record<string,unknown>[])[0]?.count || 0;
    
    return {
      totalLinks,
      byRelationship,
      byConfidence,
      linkedGenes,
      linkedMolecules,
      totalGenes: totalGenesCount,
      totalMolecules: totalMoleculesCount,
      geneCoverage: Number(linkedGenes) / (Number(totalGenesCount) || 1) * 100,
      moleculeCoverage: Number(linkedMolecules) / (Number(totalMoleculesCount) || 1) * 100,
    };
  } catch (error: unknown) {
    console.error('Error getting TPS gene-molecule link stats:', error);
    return {
      totalLinks: 0,
      byRelationship: [],
      byConfidence: [],
      linkedGenes: 0,
      linkedMolecules: 0,
      totalGenes: 0,
      totalMolecules: 0,
      geneCoverage: 0,
      moleculeCoverage: 0,
    };
  }
}

// Auto-link TPS genes to molecules based on product name matching
export async function autoLinkTpsGenesToMolecules() {
  try {
    const db = await getDb();
    if (!db) {
      return { success: false, error: 'Database connection failed', linksCreated: 0 };
    }
    
    // Get all TPS genes with their main products
    const genesResult = await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(sql.raw(`
      SELECT id, name, main_product FROM tps_genes
    `));
    const genes = (genesResult[0] as unknown) as Record<string,unknown>[];
    
    // Get all molecules
    const moleculesResult = await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(sql.raw(`
      SELECT id, name FROM molecules
    `));
    const moleculesList = (moleculesResult[0] as unknown) as Record<string,unknown>[];
    
    let linksCreated = 0;
    
    for (const gene of genes) {
      if (!gene.main_product) continue;
      const mainProduct = String(gene.main_product).toLowerCase();
      
      // Find matching molecules
      for (const mol of moleculesList) {
        const molName = String(mol.name ?? '').toLowerCase();
        
        // Check for exact or partial match
        if (molName.includes(mainProduct) || mainProduct.includes(molName)) {
          // Try to create link (will fail silently if already exists)
          const result = await createTpsGeneMoleculeLink({
            tpsGeneId: gene.id as number,
            moleculeId: mol.id as number,
            relationshipType: 'produces',
            confidenceLevel: 'inferred',
            evidenceSource: 'Auto-link based on product name matching',
          });
          
          if (result.success) {
            linksCreated++;
          }
        }
      }
    }
    
    return { success: true, linksCreated };
  } catch (error: unknown) {
    console.error('Error auto-linking TPS genes to molecules:', error);
    return { success: false, error: (error as Error).message, linksCreated: 0 };
  }
}

// Search for potential molecule matches for a TPS gene
export async function searchMoleculeMatchesForTpsGene(tpsGeneId: number) {
  try {
    const db = await getDb();
    if (!db) {
      return { success: false, error: 'Database connection failed', matches: [] };
    }
    
    // Get the TPS gene details
    const geneResult = await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(sql.raw(
      `SELECT * FROM tps_genes WHERE id = ${tpsGeneId}`
    ));
    const geneRows = (geneResult[0] as unknown) as Record<string,unknown>[];
    
    const gene = geneRows[0];
    if (!gene) {
      return { success: false, error: 'Gène TPS non trouvé', matches: [] };
    }
    
    // Search for molecules that might match
    const mainProduct = gene.main_product || '';
    const olfactoryNotes = gene.olfactory_notes || '';
    const searchTerm = String(mainProduct ?? '').toLowerCase().replace(/'/g, "''");
    const olfactoryTerm = (String(olfactoryNotes ?? '').split(',')[0] || '').replace(/'/g, "''");
    const matchesResult = await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(sql.raw(`
      SELECT 
        m.id,
        m.name,
        m.formula,
        m.olfactiveProfile,
        m.chemicalClass
      FROM molecules m
      WHERE 
        LOWER(m.name) LIKE '%${searchTerm}%'
        OR '${searchTerm}' LIKE CONCAT('%', LOWER(m.name), '%')
        OR (m.olfactiveProfile IS NOT NULL AND m.olfactiveProfile LIKE '%${olfactoryTerm}%')
      LIMIT 20
    `));
    const matches = (matchesResult[0] as unknown) as Record<string,unknown>[];
    
    return {
      success: true,
      gene: {
        id: gene.id,
        name: gene.name,
        mainProduct: gene.main_product,
        olfactoryNotes: gene.olfactory_notes,
      },
      matches,
    };
  } catch (error: unknown) {
    console.error('Error searching molecule matches:', error);
    return { success: false, error: (error as Error).message, matches: [] };
  }
}



// ====================================================================
// TPS GENES BY MOLECULE (Biosynthesis pathway information)
// ====================================================================
// ============================================================================
// TPS GENES BY MOLECULE (Biosynthesis pathway information)
// ============================================================================

/**
 * Get TPS genes that produce a specific molecule (terpene)
 * Returns gene information with biosynthesis pathway details
 */
export async function getTpsGenesByMolecule(moleculeId: number) {
  const db = await getDb();
  if (!db) return [];
  
  try {
    // First get the molecule name to match with gene products
    const moleculeResult = await db.select({
      id: molecules.id,
      name: molecules.name,
      casNumber: molecules.casNumber,
    }).from(molecules).where(eq(molecules.id, moleculeId)).limit(1);
    
    if (!moleculeResult[0]) return [];
    
    const moleculeName = moleculeResult[0].name.toLowerCase();
    
    // Search for TPS genes that produce this molecule
    // Using gene_terpene_links table and matching by terpene_product field
    const result = await (db as unknown as { execute: (q: unknown) => Promise<unknown[]> }).execute(sql.raw(`
      SELECT 
        gtl.id,
        gtl.gene_name,
        gtl.gene_id,
        gtl.terpene_product,
        gtl.terpene_class as product_type,
        gtl.subfamily as enzyme_class,
        NULL as species,
        NULL as chromosome,
        NULL as pathway,
        gtl.olfactive_notes as expression_tissue,
        NULL as regulation_notes,
        NULL as reference_source,
        NULL as ncbi_gene_id,
        NULL as uniprot_id,
        gtl.created_at
      FROM gene_terpene_links gtl
      WHERE LOWER(gtl.terpene_product) LIKE '%${moleculeName.replace(/'/g, "''")}%'
         OR LOWER(gtl.terpene_product) LIKE '%${moleculeName.replace(/'/g, "''").replace(/[\u03b1\u03b2\u03b3\u03b4-]/g, '%')}%'
      ORDER BY gtl.gene_name
    `));
    const rows = (result[0] as unknown) as Record<string,unknown>[];
    return rows.map((row: Record<string,unknown>) => ({
      id: row.id,
      geneName: row.gene_name,
      geneId: row.gene_id,
      terpeneProduct: row.terpene_product,
      productType: row.product_type,
      enzymeClass: row.enzyme_class,
      species: row.species,
      chromosome: row.chromosome,
      pathway: row.pathway,
      expressionTissue: row.expression_tissue,
      regulationNotes: row.regulation_notes,
      referenceSource: row.reference_source,
      ncbiGeneId: row.ncbi_gene_id,
      uniprotId: row.uniprot_id,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error("Error getting TPS genes for molecule:", error);
    return [];
  }
}

/**
 * Get all TPS genes with their terpene products
 */
export async function getAllTpsGenes() {
  const db = await getDb();
  if (!db) return [];
  
  try {
    const result = await (db as unknown as { execute: (q: unknown) => Promise<unknown[]> }).execute(sql.raw(`
      SELECT 
        gtl.id,
        gtl.gene_name,
        gtl.gene_id,
        gtl.terpene_product,
        gtl.terpene_class as product_type,
        gtl.subfamily as enzyme_class,
        NULL as species,
        NULL as chromosome,
        NULL as pathway,
        gtl.olfactive_notes as expression_tissue,
        NULL as regulation_notes,
        NULL as reference_source,
        NULL as ncbi_gene_id,
        NULL as uniprot_id,
        gtl.created_at,
        m.id as molecule_id,
        m.name as molecule_name
      FROM gene_terpene_links gtl
      LEFT JOIN molecules m ON LOWER(m.name) LIKE CONCAT('%', LOWER(gtl.terpene_product), '%')
      ORDER BY gtl.gene_name
    `));
    const rows = (result[0] as unknown) as Record<string,unknown>[];
    return rows.map((row: Record<string,unknown>) => ({
      id: row.id,
      geneName: row.gene_name,
      geneId: row.gene_id,
      terpeneProduct: row.terpene_product,
      productType: row.product_type,
      enzymeClass: row.enzyme_class,
      species: row.species,
      chromosome: row.chromosome,
      pathway: row.pathway,
      expressionTissue: row.expression_tissue,
      regulationNotes: row.regulation_notes,
      referenceSource: row.reference_source,
      ncbiGeneId: row.ncbi_gene_id,
      uniprotId: row.uniprot_id,
      linkedMoleculeId: row.molecule_id,
      linkedMoleculeName: row.molecule_name,
    }));
  } catch (error) {
    console.error("Error getting all TPS genes:", error);
    return [];
  }
}

/**
 * Get TPS gene statistics
 */
export async function getTpsGeneStats() {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const result = await (db as unknown as { execute: (q: unknown) => Promise<unknown[]> }).execute(sql.raw(`
      SELECT 
        COUNT(*) as total_genes,
        COUNT(DISTINCT plant_id) as unique_species,
        COUNT(DISTINCT subfamily) as enzyme_classes,
        COUNT(DISTINCT terpene_class) as product_types,
        COUNT(DISTINCT terpene_class) as pathways
      FROM gene_terpene_links
    `));
    const stats = (result[0] as unknown as Record<string,unknown>[])[0];
    
    // Get genes by species
    const speciesResult = await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(sql.raw(`
      SELECT plant_id as species, COUNT(*) as count
      FROM gene_terpene_links
      WHERE plant_id IS NOT NULL
      GROUP BY plant_id
      ORDER BY count DESC
    `));
    
    // Get genes by product type (terpene_class)
    const productTypeResult = await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(sql.raw(`
      SELECT terpene_class as product_type, COUNT(*) as count
      FROM gene_terpene_links
      WHERE terpene_class IS NOT NULL
      GROUP BY terpene_class
      ORDER BY count DESC
    `));
    
    return {
      totalGenes: stats?.total_genes || 0,
      uniqueSpecies: stats?.unique_species || 0,
      enzymeClasses: stats?.enzyme_classes || 0,
      productTypes: stats?.product_types || 0,
      pathways: stats?.pathways || 0,
      bySpecies: (speciesResult[0] as unknown as Record<string,unknown>[]).map((r: Record<string,unknown>) => ({
        species: r.species,
        count: r.count,
      })),
      byProductType: (productTypeResult[0] as unknown as Record<string,unknown>[]).map((r: Record<string,unknown>) => ({
        productType: r.product_type,
        count: r.count,
      })),
    };
  } catch (error) {
    console.error("Error getting TPS gene stats:", error);
    return null;
  }
}



// ====================================================================
// COCONUT Enrichment Functions
// ====================================================================
// ============================================
// COCONUT Enrichment Functions
// ============================================


/**
 * Enrichit une molécule via COCONUT avec traduction FR→EN
 */
