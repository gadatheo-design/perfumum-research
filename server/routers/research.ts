/**
 * Research Router for PERFUMUM
 * Provides tRPC procedures for research claims and sources
 */

import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { sql } from "drizzle-orm";

// Import the tables from schema
import type { InferSelectModel } from "drizzle-orm";

export const researchRouter = router({
  /**
   * Get all research claims with optional filtering
   */
  getClaims: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        type: z.string().optional(),
        status: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return {
            success: false,
            data: [],
            count: 0,
            error: "Database connection failed",
          };
        }
        
        // Build query with parameters
        let queryParts: string[] = [`SELECT * FROM research_claims WHERE 1=1`];
        
        if (input.type) {
          queryParts.push(` AND claimType = '${input.type}'`);
        }
        
        if (input.status) {
          queryParts.push(` AND status = '${input.status}'`);
        }
        
        if (input.search) {
          const searchTerm = input.search.replace(/'/g, "''");
          queryParts.push(` AND (claim LIKE '%${searchTerm}%' OR claimId LIKE '%${searchTerm}%')`);
        }
        
        queryParts.push(` LIMIT ${input.limit} OFFSET ${input.offset}`);
        
        const fullQuery = queryParts.join('');
        const results = await db.execute(sql.raw(fullQuery));
        
        return {
          success: true,
          data: results as any[],
          count: (results as any[]).length,
        };
      } catch (error) {
        console.error("Error fetching research claims:", error);
        return {
          success: false,
          data: [],
          count: 0,
          error: (error as Error).message,
        };
      }
    }),

  /**
   * Get all research sources with optional filtering
   */
  getSources: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        quality: z.string().optional(),
        status: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return {
            success: false,
            data: [],
            count: 0,
            error: "Database connection failed",
          };
        }
        
        // Build query with parameters
        let queryParts: string[] = [`SELECT * FROM research_sources WHERE 1=1`];
        
        if (input.quality) {
          queryParts.push(` AND quality = '${input.quality}'`);
        }
        
        if (input.status) {
          queryParts.push(` AND status = '${input.status}'`);
        }
        
        if (input.search) {
          const searchTerm = input.search.replace(/'/g, "''");
          queryParts.push(` AND (reference LIKE '%${searchTerm}%' OR sourceId LIKE '%${searchTerm}%')`);
        }
        
        queryParts.push(` LIMIT ${input.limit} OFFSET ${input.offset}`);
        
        const fullQuery = queryParts.join('');
        const results = await db.execute(sql.raw(fullQuery));
        
        return {
          success: true,
          data: results as any[],
          count: (results as any[]).length,
        };
      } catch (error) {
        console.error("Error fetching research sources:", error);
        return {
          success: false,
          data: [],
          count: 0,
          error: (error as Error).message,
        };
      }
    }),

  /**
   * Get a single claim by ID
   */
  getClaimById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return {
            success: false,
            data: null,
            error: "Database connection failed",
          };
        }
        
        const results = await db.execute(
          sql.raw(`SELECT * FROM research_claims WHERE id = ${input.id}`)
        );
        
        if ((results as any[]).length === 0) {
          return {
            success: false,
            data: null,
            error: "Claim not found",
          };
        }
        
        return {
          success: true,
          data: (results as any[])[0],
        };
      } catch (error) {
        console.error("Error fetching research claim:", error);
        return {
          success: false,
          data: null,
          error: (error as Error).message,
        };
      }
    }),

  /**
   * Get a single source by ID
   */
  getSourceById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return {
            success: false,
            data: null,
            error: "Database connection failed",
          };
        }
        
        const results = await db.execute(
          sql.raw(`SELECT * FROM research_sources WHERE id = ${input.id}`)
        );
        
        if ((results as any[]).length === 0) {
          return {
            success: false,
            data: null,
            error: "Source not found",
          };
        }
        
        return {
          success: true,
          data: (results as any[])[0],
        };
      } catch (error) {
        console.error("Error fetching research source:", error);
        return {
          success: false,
          data: null,
          error: (error as Error).message,
        };
      }
    }),

  /**
   * Get research statistics
   */
  /**
   * Get all Perique compounds
   */
  getPeriqueCompounds: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        return [];
      }
      
      const result = await db.execute(
        sql.raw(`SELECT * FROM perique_compounds ORDER BY category, name`)
      );
      
      return result as any[];
    } catch (error) {
      console.error("Error fetching Perique compounds:", error);
      return [];
    }
  }),

  getStatistics: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        return {
          success: false,
          error: "Database connection failed",
          data: {
            totalClaims: 0,
            totalSources: 0,
            claimsByType: [],
            sourcesByQuality: [],
          },
        };
      }
      
      const claimsResult = await db.execute(
        sql.raw(`SELECT COUNT(*) as total FROM research_claims`)
      );
      const sourcesResult = await db.execute(
        sql.raw(`SELECT COUNT(*) as total FROM research_sources`)
      );
      
      const claimsByType = await db.execute(
        sql.raw(`SELECT claimType, COUNT(*) as count FROM research_claims GROUP BY claimType`)
      );
      
      const sourcesByQuality = await db.execute(
        sql.raw(`SELECT quality, COUNT(*) as count FROM research_sources GROUP BY quality`)
      );
      
      return {
        success: true,
        data: {
          totalClaims: ((claimsResult as any[])[0]?.total || 0),
          totalSources: ((sourcesResult as any[])[0]?.total || 0),
          claimsByType: claimsByType as any[],
          sourcesByQuality: sourcesByQuality as any[],
        },
      };
    } catch (error) {
      console.error("Error fetching research statistics:", error);
      return {
        success: false,
        data: null,
        error: (error as Error).message,
      };
    }
  }),

  /**
   * Get all historic cigarettes (Soviet/Oriental/Chinese brands)
   */
  getHistoricCigarettes: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        return [];
      }
      
      const result = await db.execute(
        sql.raw(`SELECT * FROM historic_cigarettes ORDER BY country, name`)
      );
      
      // Flatten the result array (db.execute returns [rows, fields])
      const rows = Array.isArray(result) && result.length > 0 ? result[0] : result;
      return Array.isArray(rows) ? rows : [];
    } catch (error) {
      console.error("Error fetching historic cigarettes:", error);
      return [];
    }
  }),

  /**
   * Get Perique-molecule links with enriched data
   */
  getPeriqueMoleculeLinks: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        return [];
      }
      
      const result = await db.execute(
        sql.raw(`
          SELECT pml.*, pc.name as compound_name, m.name as molecule_name
          FROM perique_molecule_links pml
          LEFT JOIN perique_compounds pc ON pml.perique_compound_id = pc.id
          LEFT JOIN molecules m ON pml.molecule_id = m.id
          ORDER BY pml.match_type, pml.confidence DESC
        `)
      );
      
      // Flatten the result array (db.execute returns [rows, fields])
      const rows = Array.isArray(result) && result.length > 0 ? result[0] : result;
      return Array.isArray(rows) ? rows : [];
    } catch (error) {
      console.error("Error fetching Perique-molecule links:", error);
      return [];
    }
  }),
  /**
   * Get all TPS genes with their products and olfactory notes
   */
  getTpsGenes: publicProcedure
    .input(
      z.object({
        productClass: z.string().optional(),
        pathway: z.string().optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return [];
        }
        
        let query = `SELECT * FROM tps_genes WHERE 1=1`;
        
        if (input?.productClass) {
          query += ` AND product_class = '${input.productClass}'`;
        }
        if (input?.pathway) {
          query += ` AND pathway = '${input.pathway}'`;
        }
        if (input?.search) {
          query += ` AND (name LIKE '%${input.search}%' OR main_product LIKE '%${input.search}%' OR olfactory_notes LIKE '%${input.search}%')`;
        }
        
        query += ` ORDER BY product_class, name`;
        
        const result = await db.execute(sql.raw(query));
        const rows = Array.isArray(result) && result.length > 0 ? result[0] : result;
        return Array.isArray(rows) ? rows : [];
      } catch (error) {
        console.error("Error fetching TPS genes:", error);
        return [];
      }
    }),
  /**
   * Get all biosynthetic pathways
   */
  getBiosyntheticPathways: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        return [];
      }
      
      const result = await db.execute(
        sql.raw(`SELECT * FROM biosynthetic_pathways ORDER BY name`)
      );
      
      const rows = Array.isArray(result) && result.length > 0 ? result[0] : result;
      return Array.isArray(rows) ? rows : [];
    } catch (error) {
      console.error("Error fetching biosynthetic pathways:", error);
      return [];
    }
  }),
  /**
   * Get genomic statistics
   */
  getGenomicStats: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        return {
          totalTpsGenes: 0,
          monoterpenes: 0,
          sesquiterpenes: 0,
          diterpenes: 0,
          pathways: 0,
        };
      }
      
      const tpsResult = await db.execute(sql.raw(`SELECT COUNT(*) as count FROM tps_genes`));
      const monoResult = await db.execute(sql.raw(`SELECT COUNT(*) as count FROM tps_genes WHERE product_class = 'monoterpene'`));
      const sesquiResult = await db.execute(sql.raw(`SELECT COUNT(*) as count FROM tps_genes WHERE product_class = 'sesquiterpene'`));
      const diResult = await db.execute(sql.raw(`SELECT COUNT(*) as count FROM tps_genes WHERE product_class = 'diterpene'`));
      const pathwayResult = await db.execute(sql.raw(`SELECT COUNT(*) as count FROM biosynthetic_pathways`));
      
      const getCount = (result: any) => {
        const rows = Array.isArray(result) && result.length > 0 ? result[0] : result;
        return Array.isArray(rows) && rows.length > 0 ? Number(rows[0].count) : 0;
      };
      
      return {
        totalTpsGenes: getCount(tpsResult),
        monoterpenes: getCount(monoResult),
        sesquiterpenes: getCount(sesquiResult),
        diterpenes: getCount(diResult),
        pathways: getCount(pathwayResult),
      };
    } catch (error) {
      console.error("Error fetching genomic stats:", error);
      return {
        totalTpsGenes: 0,
        monoterpenes: 0,
        sesquiterpenes: 0,
        diterpenes: 0,
        pathways: 0,
      };
    }
  }),

  // ============================================================================
  // TPS GENE - MOLECULE LINKS
  // ============================================================================

  /**
   * Get all TPS gene-molecule links with optional filtering
   */
  getTpsGeneMoleculeLinks: publicProcedure
    .input(
      z.object({
        tpsGeneId: z.number().optional(),
        moleculeId: z.number().optional(),
        relationshipType: z.string().optional(),
        confidenceLevel: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return [];
        
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
        
        if (input?.tpsGeneId) {
          query += ` AND tgm.tps_gene_id = ${input.tpsGeneId}`;
        }
        if (input?.moleculeId) {
          query += ` AND tgm.molecule_id = ${input.moleculeId}`;
        }
        if (input?.relationshipType) {
          query += ` AND tgm.relationship_type = '${input.relationshipType}'`;
        }
        if (input?.confidenceLevel) {
          query += ` AND tgm.confidence_level = '${input.confidenceLevel}'`;
        }
        
        query += ` ORDER BY tg.name, m.name`;
        
        const result = await db.execute(sql.raw(query));
        return (result as any)[0] || [];
      } catch (error) {
        console.error("Error fetching TPS gene-molecule links:", error);
        return [];
      }
    }),

  /**
   * Create a TPS gene-molecule link
   */
  createTpsGeneMoleculeLink: publicProcedure
    .input(
      z.object({
        tpsGeneId: z.number(),
        moleculeId: z.number(),
        relationshipType: z.enum(["produces", "catalyzes", "regulates", "precursor"]).default("produces"),
        confidenceLevel: z.enum(["confirmed", "predicted", "inferred"]).default("inferred"),
        evidenceSource: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return { success: false, error: "Database connection failed" };
        
        const query = `
          INSERT INTO tps_gene_molecules 
            (tps_gene_id, molecule_id, relationship_type, confidence_level, evidence_source, notes)
          VALUES (${input.tpsGeneId}, ${input.moleculeId}, '${input.relationshipType}', '${input.confidenceLevel}', ${input.evidenceSource ? `'${input.evidenceSource}'` : 'NULL'}, ${input.notes ? `'${input.notes}'` : 'NULL'})
        `;
        
        const result = await db.execute(sql.raw(query));
        return { success: true, id: (result as any)[0]?.insertId };
      } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
          return { success: false, error: "Cette liaison existe déjà" };
        }
        console.error("Error creating TPS gene-molecule link:", error);
        return { success: false, error: error.message };
      }
    }),

  /**
   * Delete a TPS gene-molecule link
   */
  deleteTpsGeneMoleculeLink: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return { success: false, error: "Database connection failed" };
        
        await db.execute(sql.raw(`DELETE FROM tps_gene_molecules WHERE id = ${input.id}`));
        return { success: true };
      } catch (error: any) {
        console.error("Error deleting TPS gene-molecule link:", error);
        return { success: false, error: error.message };
      }
    }),

  /**
   * Get TPS gene-molecule link statistics
   */
  getTpsGeneMoleculeLinkStats: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) return {
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
      
      const [totalLinks] = await db.execute(sql.raw('SELECT COUNT(*) as count FROM tps_gene_molecules')) as any;
      const [byRelationship] = await db.execute(sql.raw(`
        SELECT relationship_type as type, COUNT(*) as count 
        FROM tps_gene_molecules 
        GROUP BY relationship_type
      `)) as any;
      const [byConfidence] = await db.execute(sql.raw(`
        SELECT confidence_level as level, COUNT(*) as count 
        FROM tps_gene_molecules 
        GROUP BY confidence_level
      `)) as any;
      const [linkedGenes] = await db.execute(sql.raw(`
        SELECT COUNT(DISTINCT tps_gene_id) as count FROM tps_gene_molecules
      `)) as any;
      const [linkedMolecules] = await db.execute(sql.raw(`
        SELECT COUNT(DISTINCT molecule_id) as count FROM tps_gene_molecules
      `)) as any;
      const [totalGenes] = await db.execute(sql.raw('SELECT COUNT(*) as count FROM tps_genes')) as any;
      const [totalMolecules] = await db.execute(sql.raw('SELECT COUNT(*) as count FROM molecules')) as any;
      
      const tGenes = totalGenes[0]?.count || 0;
      const tMols = totalMolecules[0]?.count || 0;
      const lGenes = linkedGenes[0]?.count || 0;
      const lMols = linkedMolecules[0]?.count || 0;
      
      return {
        totalLinks: totalLinks[0]?.count || 0,
        byRelationship: byRelationship || [],
        byConfidence: byConfidence || [],
        linkedGenes: lGenes,
        linkedMolecules: lMols,
        totalGenes: tGenes,
        totalMolecules: tMols,
        geneCoverage: tGenes > 0 ? (lGenes / tGenes) * 100 : 0,
        moleculeCoverage: tMols > 0 ? (lMols / tMols) * 100 : 0,
      };
    } catch (error) {
      console.error("Error fetching TPS gene-molecule link stats:", error);
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
  }),

  /**
   * Auto-link TPS genes to molecules based on product name matching
   */
  autoLinkTpsGenesToMolecules: publicProcedure.mutation(async () => {
    try {
      const db = await getDb();
      if (!db) return { success: false, error: "Database connection failed", linksCreated: 0 };
      
      // Get all TPS genes
      const [genes] = await db.execute(sql.raw(`SELECT id, name, main_product FROM tps_genes`)) as any;
      
      // Get all molecules
      const [moleculesList] = await db.execute(sql.raw(`SELECT id, name FROM molecules`)) as any;
      
      let linksCreated = 0;
      
      for (const gene of genes) {
        const mainProduct = gene.main_product.toLowerCase();
        
        for (const mol of moleculesList) {
          const molName = mol.name.toLowerCase();
          
          // Check for exact or partial match
          if (molName.includes(mainProduct) || mainProduct.includes(molName)) {
            try {
              await db.execute(sql.raw(`
                INSERT INTO tps_gene_molecules 
                  (tps_gene_id, molecule_id, relationship_type, confidence_level, evidence_source)
                VALUES (${gene.id}, ${mol.id}, 'produces', 'inferred', 'Auto-link based on product name matching')
              `));
              linksCreated++;
            } catch (e) {
              // Ignore duplicate entries
            }
          }
        }
      }
      
      return { success: true, linksCreated };
    } catch (error: any) {
      console.error("Error auto-linking TPS genes to molecules:", error);
      return { success: false, error: error.message, linksCreated: 0 };
    }
  }),

  /**
   * Search for potential molecule matches for a TPS gene
   */
  searchMoleculeMatchesForTpsGene: publicProcedure
    .input(z.object({ tpsGeneId: z.number() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return { success: false, error: "Database connection failed", gene: null, matches: [] };
        
        // Get the TPS gene details
        const [geneRows] = await db.execute(sql.raw(`SELECT * FROM tps_genes WHERE id = ${input.tpsGeneId}`)) as any;
        const gene = geneRows[0];
        
        if (!gene) {
          return { success: false, error: "Gène TPS non trouvé", gene: null, matches: [] };
        }
        
        const mainProduct = gene.main_product;
        
        // Search for molecules that might match
        const [matches] = await db.execute(sql.raw(`
          SELECT 
            m.id,
            m.name,
            m.formula,
            m.olfactiveProfile,
            m.chemicalClass,
            CASE 
              WHEN LOWER(m.name) = LOWER('${mainProduct}') THEN 100
              WHEN LOWER(m.name) LIKE CONCAT('%', LOWER('${mainProduct}'), '%') THEN 80
              WHEN LOWER('${mainProduct}') LIKE CONCAT('%', LOWER(m.name), '%') THEN 70
              ELSE 50
            END as matchScore
          FROM molecules m
          WHERE 
            LOWER(m.name) LIKE CONCAT('%', LOWER('${mainProduct}'), '%')
            OR LOWER('${mainProduct}') LIKE CONCAT('%', LOWER(m.name), '%')
          ORDER BY matchScore DESC
          LIMIT 20
        `)) as any;
        
        return {
          success: true,
          gene: {
            id: gene.id,
            name: gene.name,
            mainProduct: gene.main_product,
            olfactoryNotes: gene.olfactory_notes,
          },
          matches: matches || [],
        };
      } catch (error: any) {
        console.error("Error searching molecule matches:", error);
        return { success: false, error: error.message, gene: null, matches: [] };
      }
    }),

  /**
   * Get biosynthetic pathways flow: TPS gene → molecule → recipe
   * Returns complete paths from gene to final application
   */
  getBiosyntheticPathwayFlow: publicProcedure
    .input(
      z.object({
        geneId: z.number().optional(),
        moleculeId: z.number().optional(),
        pathway: z.enum(["MEP", "MVA", "all"]).default("all"),
        limit: z.number().default(100),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return { success: false, paths: [], stats: null, error: "Database connection failed" };
        }

        // Get TPS genes with their linked molecules and recipes
        let geneFilter = "";
        if (input.geneId) {
          geneFilter = ` AND tg.id = ${input.geneId}`;
        }
        if (input.pathway !== "all") {
          geneFilter += ` AND tg.pathway = '${input.pathway}'`;
        }

        const pathsQuery = `
          SELECT 
            tg.id as gene_id,
            tg.name as gene_name,
            tg.subfamily,
            tg.main_product,
            tg.olfactory_notes as gene_olfactory,
            tg.pathway,
            tg.product_class,
            m.id as molecule_id,
            m.name as molecule_name,
            tgm.relationship_type,
            tgm.confidence,
            r.id as recipe_id,
            r.name as recipe_name,
            r.category as recipe_category
          FROM tps_genes tg
          LEFT JOIN tps_gene_molecules tgm ON tg.id = tgm.tps_gene_id
          LEFT JOIN molecules m ON tgm.molecule_id = m.id
          LEFT JOIN recette_molecules rm ON m.id = rm.molecule_id
          LEFT JOIN recettes r ON rm.recette_id = r.id
          WHERE 1=1 ${geneFilter}
          ORDER BY tg.name, m.name, r.name
          LIMIT ${input.limit}
        `;

        const pathsResult = await db.execute(sql.raw(pathsQuery));
        const paths = (pathsResult as any).rows || (pathsResult as any[]) || [];

        // Get statistics
        const statsQuery = `
          SELECT 
            COUNT(DISTINCT tg.id) as total_genes,
            COUNT(DISTINCT CASE WHEN tgm.id IS NOT NULL THEN tg.id END) as linked_genes,
            COUNT(DISTINCT m.id) as linked_molecules,
            COUNT(DISTINCT r.id) as linked_recipes,
            COUNT(DISTINCT tg.pathway) as pathways_count
          FROM tps_genes tg
          LEFT JOIN tps_gene_molecules tgm ON tg.id = tgm.tps_gene_id
          LEFT JOIN molecules m ON tgm.molecule_id = m.id
          LEFT JOIN recette_molecules rm ON m.id = rm.molecule_id
          LEFT JOIN recettes r ON rm.recette_id = r.id
        `;
        const statsResult = await db.execute(sql.raw(statsQuery));
        const statsRows = (statsResult as any).rows || (statsResult as any[]) || [];
        const stats = statsRows[0] || null;

        // Group paths by gene for visualization
        const groupedPaths: Record<number, {
          gene: { id: number; name: string; subfamily: string; main_product: string; olfactory: string; pathway: string; product_class: string };
          molecules: Array<{
            id: number;
            name: string;
            relationship: string;
            confidence: string;
            recipes: Array<{ id: number; name: string; category: string }>;
          }>;
        }> = {};

        for (const row of paths as any[]) {
          if (!groupedPaths[row.gene_id]) {
            groupedPaths[row.gene_id] = {
              gene: {
                id: row.gene_id,
                name: row.gene_name,
                subfamily: row.subfamily,
                main_product: row.main_product,
                olfactory: row.gene_olfactory,
                pathway: row.pathway,
                product_class: row.product_class,
              },
              molecules: [],
            };
          }

          if (row.molecule_id) {
            let molecule = groupedPaths[row.gene_id].molecules.find(m => m.id === row.molecule_id);
            if (!molecule) {
              molecule = {
                id: row.molecule_id,
                name: row.molecule_name,
                relationship: row.relationship_type,
                confidence: row.confidence,
                recipes: [],
              };
              groupedPaths[row.gene_id].molecules.push(molecule);
            }

            if (row.recipe_id && !molecule.recipes.find(r => r.id === row.recipe_id)) {
              molecule.recipes.push({
                id: row.recipe_id,
                name: row.recipe_name,
                category: row.recipe_category,
              });
            }
          }
        }

        return {
          success: true,
          paths: Object.values(groupedPaths),
          stats,
          rawPaths: paths,
        };
      } catch (error: any) {
        console.error("Error getting biosynthetic pathways:", error);
        return { success: false, paths: [], stats: null, error: error.message };
      }
    }),

  // ============================================================================
  // MOLECULAR TRANSFORMATIONS (Pyrolysis)
  // ============================================================================

  /**
   * Get molecular transformations with optional filtering
   */
  getMolecularTransformations: publicProcedure
    .input(
      z.object({
        transformationType: z.string().optional(),
        relevanceContext: z.string().optional(),
        sourceMoleculeName: z.string().optional(),
        limit: z.number().default(100),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return { success: false, data: [], error: "Database connection failed" };
        }

        let query = `
          SELECT 
            mt.*,
            sm.name as source_molecule_db_name,
            pm.name as product_molecule_db_name
          FROM molecular_transformations mt
          LEFT JOIN molecules sm ON mt.source_molecule_id = sm.id
          LEFT JOIN molecules pm ON mt.product_molecule_id = pm.id
          WHERE 1=1
        `;

        if (input.transformationType && input.transformationType !== 'all') {
          query += ` AND mt.transformation_type = '${input.transformationType}'`;
        }
        if (input.relevanceContext && input.relevanceContext !== 'all') {
          query += ` AND mt.relevance_context = '${input.relevanceContext}'`;
        }
        if (input.sourceMoleculeName) {
          query += ` AND mt.source_molecule_name LIKE '%${input.sourceMoleculeName}%'`;
        }

        query += ` ORDER BY mt.source_molecule_name LIMIT ${input.limit} OFFSET ${input.offset}`;

        const result = await db.execute(sql.raw(query));
        const data = (result as any).rows || (result as any[]) || [];

        return { success: true, data };
      } catch (error: any) {
        console.error("Error getting molecular transformations:", error);
        return { success: false, data: [], error: error.message };
      }
    }),

  /**
   * Get transformation statistics
   */
  getMolecularTransformationStats: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        return { success: false, stats: null, error: "Database connection failed" };
      }

      const result = await db.execute(sql.raw(`
        SELECT 
          COUNT(*) as total_transformations,
          COUNT(DISTINCT source_molecule_name) as unique_sources,
          COUNT(DISTINCT product_molecule_name) as unique_products,
          COUNT(DISTINCT transformation_type) as transformation_types,
          COUNT(DISTINCT relevance_context) as relevance_contexts
        FROM molecular_transformations
      `));

      const stats = ((result as any).rows || (result as any[]) || [])[0] || null;
      return { success: true, stats };
    } catch (error: any) {
      console.error("Error getting transformation stats:", error);
      return { success: false, stats: null, error: error.message };
    }
  }),

  /**
   * Create a new molecular transformation
   */
  createMolecularTransformation: publicProcedure
    .input(
      z.object({
        sourceMoleculeName: z.string(),
        productMoleculeName: z.string(),
        transformationType: z.enum([
          "pyrolysis", "oxidation", "isomerization", "dehydration",
          "cyclization", "ring_opening", "polymerization", "degradation",
          "maillard", "caramelization", "other"
        ]),
        sourceMoleculeId: z.number().optional(),
        productMoleculeId: z.number().optional(),
        temperatureMin: z.number().optional(),
        temperatureMax: z.number().optional(),
        temperatureOptimal: z.number().optional(),
        yieldPercent: z.number().optional(),
        olfactoryChangeDescription: z.string().optional(),
        sourceOlfactoryNotes: z.string().optional(),
        productOlfactoryNotes: z.string().optional(),
        relevanceContext: z.enum([
          "tobacco_combustion", "tobacco_heating", "incense_burning",
          "essential_oil_distillation", "perfume_aging", "food_cooking",
          "industrial_process", "natural_degradation", "other"
        ]).default("tobacco_combustion"),
        sourceReference: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return { success: false, error: "Database connection failed" };
        }

        const escapeSql = (str: string) => str.replace(/'/g, "''");

        const result = await db.execute(sql.raw(`
          INSERT INTO molecular_transformations (
            source_molecule_name, product_molecule_name, transformation_type,
            source_molecule_id, product_molecule_id,
            temperature_min, temperature_max, temperature_optimal,
            yield_percent, olfactory_change_description,
            source_olfactory_notes, product_olfactory_notes,
            relevance_context, source_reference, notes
          ) VALUES (
            '${escapeSql(input.sourceMoleculeName)}',
            '${escapeSql(input.productMoleculeName)}',
            '${input.transformationType}',
            ${input.sourceMoleculeId || 'NULL'},
            ${input.productMoleculeId || 'NULL'},
            ${input.temperatureMin || 'NULL'},
            ${input.temperatureMax || 'NULL'},
            ${input.temperatureOptimal || 'NULL'},
            ${input.yieldPercent || 'NULL'},
            ${input.olfactoryChangeDescription ? `'${escapeSql(input.olfactoryChangeDescription)}'` : 'NULL'},
            ${input.sourceOlfactoryNotes ? `'${escapeSql(input.sourceOlfactoryNotes)}'` : 'NULL'},
            ${input.productOlfactoryNotes ? `'${escapeSql(input.productOlfactoryNotes)}'` : 'NULL'},
            '${input.relevanceContext}',
            ${input.sourceReference ? `'${escapeSql(input.sourceReference)}'` : 'NULL'},
            ${input.notes ? `'${escapeSql(input.notes)}'` : 'NULL'}
          )
        `));

        return { success: true, message: "Transformation created successfully" };
      } catch (error: any) {
        console.error("Error creating molecular transformation:", error);
        return { success: false, error: error.message };
      }
    }),

  /**
   * Get transformation types distribution
   */
  getTransformationTypesDistribution: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        return { success: false, data: [], error: "Database connection failed" };
      }

      const result = await db.execute(sql.raw(`
        SELECT 
          transformation_type,
          COUNT(*) as count
        FROM molecular_transformations
        GROUP BY transformation_type
        ORDER BY count DESC
      `));

      const data = (result as any).rows || (result as any[]) || [];
      return { success: true, data };
    } catch (error: any) {
      console.error("Error getting transformation types:", error);
      return { success: false, data: [], error: error.message };
    }
  }),

  // ============================================================================
  // TRANSFORMATION RECIPE IMPACTS
  // ============================================================================

  /**
   * Get transformation impacts on recipes
   */
  getTransformationRecipeImpacts: publicProcedure
    .input(
      z.object({
        transformationId: z.number().optional(),
        recetteId: z.number().optional(),
        impactType: z.enum(['major', 'moderate', 'minor', 'trace']).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return { success: false, impacts: [], error: "Database connection failed" };
        }

        let whereClause = '';
        const conditions: string[] = [];
        
        if (input?.transformationId) {
          conditions.push(`tri.transformation_id = ${input.transformationId}`);
        }
        if (input?.recetteId) {
          conditions.push(`tri.recette_id = ${input.recetteId}`);
        }
        if (input?.impactType) {
          conditions.push(`tri.impact_type = '${input.impactType}'`);
        }
        
        if (conditions.length > 0) {
          whereClause = `WHERE ${conditions.join(' AND ')}`;
        }

        const result = await db.execute(sql.raw(`
          SELECT 
            tri.id,
            tri.transformation_id,
            tri.recette_id,
            tri.impact_type,
            tri.impact_description,
            tri.olfactory_contribution,
            tri.percentage_contribution,
            tri.temperature_range,
            tri.notes,
            tri.source_reference,
            mt.source_molecule_name,
            mt.product_molecule_name,
            mt.transformation_type,
            mt.temperature_optimal,
            r.name as recette_name,
            r.category as recette_category
          FROM transformation_recipe_impacts tri
          JOIN molecular_transformations mt ON tri.transformation_id = mt.id
          JOIN recettes r ON tri.recette_id = r.id
          ${whereClause}
          ORDER BY 
            CASE tri.impact_type 
              WHEN 'major' THEN 1 
              WHEN 'moderate' THEN 2 
              WHEN 'minor' THEN 3 
              WHEN 'trace' THEN 4 
            END,
            mt.source_molecule_name
        `));

        const impacts = (result as any).rows || (result as any[]) || [];
        return { success: true, impacts };
      } catch (error: any) {
        console.error("Error getting transformation recipe impacts:", error);
        return { success: false, impacts: [], error: error.message };
      }
    }),

  /**
   * Get recipes affected by a specific transformation
   */
  getRecipesAffectedByTransformation: publicProcedure
    .input(z.number())
    .query(async ({ input: transformationId }) => {
      try {
        const db = await getDb();
        if (!db) {
          return { success: false, recipes: [], error: "Database connection failed" };
        }

        const result = await db.execute(sql.raw(`
          SELECT 
            r.id,
            r.name,
            r.category,
            r.description,
            tri.impact_type,
            tri.impact_description,
            tri.olfactory_contribution
          FROM recettes r
          JOIN transformation_recipe_impacts tri ON r.id = tri.recette_id
          WHERE tri.transformation_id = ${transformationId}
          ORDER BY 
            CASE tri.impact_type 
              WHEN 'major' THEN 1 
              WHEN 'moderate' THEN 2 
              WHEN 'minor' THEN 3 
              WHEN 'trace' THEN 4 
            END
        `));

        const recipes = (result as any).rows || (result as any[]) || [];
        return { success: true, recipes };
      } catch (error: any) {
        console.error("Error getting recipes affected by transformation:", error);
        return { success: false, recipes: [], error: error.message };
      }
    }),

  /**
   * Get transformations affecting a specific recipe
   */
  getTransformationsAffectingRecipe: publicProcedure
    .input(z.number())
    .query(async ({ input: recetteId }) => {
      try {
        const db = await getDb();
        if (!db) {
          return { success: false, transformations: [], error: "Database connection failed" };
        }

        const result = await db.execute(sql.raw(`
          SELECT 
            mt.id,
            mt.source_molecule_name,
            mt.product_molecule_name,
            mt.transformation_type,
            mt.temperature_optimal,
            mt.olfactory_change_description,
            tri.impact_type,
            tri.impact_description,
            tri.olfactory_contribution
          FROM molecular_transformations mt
          JOIN transformation_recipe_impacts tri ON mt.id = tri.transformation_id
          WHERE tri.recette_id = ${recetteId}
          ORDER BY 
            CASE tri.impact_type 
              WHEN 'major' THEN 1 
              WHEN 'moderate' THEN 2 
              WHEN 'minor' THEN 3 
              WHEN 'trace' THEN 4 
            END
        `));

        const transformations = (result as any).rows || (result as any[]) || [];
        return { success: true, transformations };
      } catch (error: any) {
        console.error("Error getting transformations affecting recipe:", error);
        return { success: false, transformations: [], error: error.message };
      }
    }),

  /**
   * Get impact statistics
   */
  getTransformationImpactStats: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        return { success: false, stats: null, error: "Database connection failed" };
      }

      const [impactCounts, topTransformations, topRecipes] = await Promise.all([
        db.execute(sql.raw(`
          SELECT impact_type, COUNT(*) as count
          FROM transformation_recipe_impacts
          GROUP BY impact_type
          ORDER BY count DESC
        `)),
        db.execute(sql.raw(`
          SELECT 
            mt.source_molecule_name,
            mt.product_molecule_name,
            COUNT(tri.id) as recipe_count
          FROM molecular_transformations mt
          JOIN transformation_recipe_impacts tri ON mt.id = tri.transformation_id
          GROUP BY mt.id, mt.source_molecule_name, mt.product_molecule_name
          ORDER BY recipe_count DESC
          LIMIT 10
        `)),
        db.execute(sql.raw(`
          SELECT 
            r.name,
            r.category,
            COUNT(tri.id) as transformation_count
          FROM recettes r
          JOIN transformation_recipe_impacts tri ON r.id = tri.recette_id
          GROUP BY r.id, r.name, r.category
          ORDER BY transformation_count DESC
          LIMIT 10
        `)),
      ]);

      return {
        success: true,
        stats: {
          impactCounts: (impactCounts as any).rows || (impactCounts as any[]) || [],
          topTransformations: (topTransformations as any).rows || (topTransformations as any[]) || [],
          topRecipes: (topRecipes as any).rows || (topRecipes as any[]) || [],
        },
      };
    } catch (error: any) {
      console.error("Error getting transformation impact stats:", error);
      return { success: false, stats: null, error: error.message };
    }
  }),
});
