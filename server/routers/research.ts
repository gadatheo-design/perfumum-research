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
      
      // Flatten the result array (db.execute returns [rows, fields])
      const rows = Array.isArray(result) && result.length > 0 ? result[0] : result;
      return Array.isArray(rows) ? rows : [];
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
        const paths = (pathsResult[0] as unknown) as any[];

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
        const statsRows = (statsResult[0] as unknown) as any[];
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
          // Search in both source and product molecule names, case-insensitive
          const searchTerm = input.sourceMoleculeName.replace(/'/g, "''");
          query += ` AND (LOWER(mt.source_molecule_name) LIKE LOWER('%${searchTerm}%') OR LOWER(mt.product_molecule_name) LIKE LOWER('%${searchTerm}%'))`;
        }

        query += ` ORDER BY mt.source_molecule_name LIMIT ${input.limit} OFFSET ${input.offset}`;

        const result = await db.execute(sql.raw(query));
        let data = (result[0] as unknown) as any[];
        // Flatten if nested array (some DB drivers return [[...]])
        if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
          data = data.flat();
        }
        // Filter out metadata objects (they have _buf property)
        data = data.filter((item: any) => item && typeof item === 'object' && !item._buf && item.id !== undefined);

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

      const stats = ((result[0] as unknown) as any[])[0] || null;
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

      const data = (result[0] as unknown) as any[];
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

        const impacts = (result[0] as unknown) as any[];
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

        const recipes = (result[0] as unknown) as any[];
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

        const transformations = (result[0] as unknown) as any[];
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
          impactCounts: (impactCounts[0] as unknown) as any[],
          topTransformations: (topTransformations[0] as unknown) as any[],
          topRecipes: (topRecipes[0] as unknown) as any[],
        },
      };
    } catch (error: any) {
      console.error("Error getting transformation impact stats:", error);
      return { success: false, stats: null, error: error.message };
    }
  }),

  /**
   * Create a transformation-recipe impact link
   */
  createTransformationRecipeImpact: publicProcedure
    .input(
      z.object({
        transformationId: z.number(),
        recetteId: z.number(),
        impactType: z.enum(['major', 'moderate', 'minor', 'trace']),
        impactDescription: z.string().optional(),
        olfactoryContribution: z.string().optional(),
        percentageContribution: z.number().optional(),
        temperatureRange: z.string().optional(),
        notes: z.string().optional(),
        sourceReference: z.string().optional(),
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
          INSERT INTO transformation_recipe_impacts (
            transformation_id, recette_id, impact_type,
            impact_description, olfactory_contribution,
            percentage_contribution, temperature_range,
            notes, source_reference
          ) VALUES (
            ${input.transformationId},
            ${input.recetteId},
            '${input.impactType}',
            ${input.impactDescription ? `'${escapeSql(input.impactDescription)}'` : 'NULL'},
            ${input.olfactoryContribution ? `'${escapeSql(input.olfactoryContribution)}'` : 'NULL'},
            ${input.percentageContribution || 'NULL'},
            ${input.temperatureRange ? `'${escapeSql(input.temperatureRange)}'` : 'NULL'},
            ${input.notes ? `'${escapeSql(input.notes)}'` : 'NULL'},
            ${input.sourceReference ? `'${escapeSql(input.sourceReference)}'` : 'NULL'}
          )
        `));

        return { success: true, message: "Impact link created successfully" };
      } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
          return { success: false, error: "Cette liaison existe déjà" };
        }
        console.error("Error creating transformation recipe impact:", error);
        return { success: false, error: error.message };
      }
    }),

  /**
   * Delete a transformation-recipe impact link
   */
  deleteTransformationRecipeImpact: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return { success: false, error: "Database connection failed" };
        }

        await db.execute(sql.raw(`DELETE FROM transformation_recipe_impacts WHERE id = ${input.id}`));
        return { success: true };
      } catch (error: any) {
        console.error("Error deleting transformation recipe impact:", error);
        return { success: false, error: error.message };
      }
    }),

  /**
   * Get transformation chains for D3.js visualization
   * Returns connected transformation sequences (e.g., limonène → p-cymène → toluène)
   */
  getTransformationChains: publicProcedure
    .input(
      z.object({
        startMolecule: z.string().optional(),
        transformationType: z.string().optional(),
        maxDepth: z.number().default(5),
      }).optional()
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return { success: false, nodes: [], links: [], chains: [], error: "Database connection failed" };
        }

        // Get all transformations
        let query = `
          SELECT 
            mt.id,
            mt.source_molecule_name,
            mt.product_molecule_name,
            mt.transformation_type,
            mt.temperature_optimal,
            mt.olfactory_change_description,
            mt.source_molecule_id,
            mt.product_molecule_id
          FROM molecular_transformations mt
          WHERE 1=1
        `;

        if (input?.startMolecule) {
          query += ` AND (mt.source_molecule_name LIKE '%${input.startMolecule}%' OR mt.product_molecule_name LIKE '%${input.startMolecule}%')`;
        }
        if (input?.transformationType && input.transformationType !== 'all') {
          query += ` AND mt.transformation_type = '${input.transformationType}'`;
        }

        query += ` ORDER BY mt.source_molecule_name`;

        const result = await db.execute(sql.raw(query));
        const transformations = (result[0] as unknown) as any[];

        // Build nodes and links for D3.js force-directed graph
        const nodesMap = new Map<string, { id: string; name: string; type: 'source' | 'product' | 'both'; moleculeId?: number; transformationCount: number }>();
        const links: Array<{ source: string; target: string; transformationType: string; temperature?: number; description?: string; id: number }> = [];

        for (const t of transformations) {
          const sourceKey = t.source_molecule_name.toLowerCase();
          const productKey = t.product_molecule_name.toLowerCase();

          // Add or update source node
          if (!nodesMap.has(sourceKey)) {
            nodesMap.set(sourceKey, {
              id: sourceKey,
              name: t.source_molecule_name,
              type: 'source',
              moleculeId: t.source_molecule_id,
              transformationCount: 1,
            });
          } else {
            const node = nodesMap.get(sourceKey)!;
            node.transformationCount++;
            if (node.type === 'product') node.type = 'both';
          }

          // Add or update product node
          if (!nodesMap.has(productKey)) {
            nodesMap.set(productKey, {
              id: productKey,
              name: t.product_molecule_name,
              type: 'product',
              moleculeId: t.product_molecule_id,
              transformationCount: 1,
            });
          } else {
            const node = nodesMap.get(productKey)!;
            node.transformationCount++;
            if (node.type === 'source') node.type = 'both';
          }

          // Add link
          links.push({
            source: sourceKey,
            target: productKey,
            transformationType: t.transformation_type,
            temperature: t.temperature_optimal,
            description: t.olfactory_change_description,
            id: t.id,
          });
        }

        // Find chains (sequences of transformations)
        const chains: Array<{ path: string[]; transformations: string[] }> = [];
        const visited = new Set<string>();

        // Build adjacency list
        const adjacency = new Map<string, Array<{ target: string; type: string }>>();
        for (const link of links) {
          if (!adjacency.has(link.source)) {
            adjacency.set(link.source, []);
          }
          adjacency.get(link.source)!.push({ target: link.target, type: link.transformationType });
        }

        // Find starting nodes (nodes that are sources but not products of any transformation)
        const productNodes = new Set(links.map(l => l.target));
        const startNodes = Array.from(nodesMap.keys()).filter(n => !productNodes.has(n));

        // DFS to find chains
        const findChains = (node: string, path: string[], types: string[], depth: number) => {
          if (depth > (input?.maxDepth || 5)) return;
          
          const neighbors = adjacency.get(node) || [];
          if (neighbors.length === 0) {
            if (path.length > 1) {
              chains.push({ path: [...path], transformations: [...types] });
            }
            return;
          }

          for (const neighbor of neighbors) {
            if (!path.includes(neighbor.target)) {
              findChains(neighbor.target, [...path, neighbor.target], [...types, neighbor.type], depth + 1);
            }
          }

          // Also record current path if it's a valid chain
          if (path.length > 1) {
            chains.push({ path: [...path], transformations: [...types] });
          }
        }

        for (const startNode of startNodes) {
          findChains(startNode, [startNode], [], 0);
        }

        // Remove duplicate chains and keep longest ones
        const uniqueChains = chains.filter((chain, index) => {
          const pathStr = chain.path.join(' → ');
          return !chains.slice(index + 1).some(c => c.path.join(' → ').includes(pathStr));
        });

        // Sort chains by length (longest first)
        uniqueChains.sort((a, b) => b.path.length - a.path.length);

        return {
          success: true,
          nodes: Array.from(nodesMap.values()),
          links,
          chains: uniqueChains.slice(0, 50), // Limit to top 50 chains
          stats: {
            totalNodes: nodesMap.size,
            totalLinks: links.length,
            totalChains: uniqueChains.length,
            longestChain: uniqueChains[0]?.path.length || 0,
          },
        };
      } catch (error: any) {
        console.error("Error getting transformation chains:", error);
        return { success: false, nodes: [], links: [], chains: [], error: error.message };
      }
    }),

  /**
   * Get transformations for a specific molecule (as source or product)
   * Used for cross-linking in molecule detail pages
   */
  getTransformationsByMolecule: publicProcedure
    .input(
      z.object({
        moleculeId: z.number().optional(),
        moleculeName: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return { success: false, asSource: [], asProduct: [], error: "Database connection failed" };
        }

        // Build conditions based on input
        let sourceCondition = "1=0";
        let productCondition = "1=0";

        if (input.moleculeId) {
          sourceCondition = `mt.source_molecule_id = ${input.moleculeId}`;
          productCondition = `mt.product_molecule_id = ${input.moleculeId}`;
        } else if (input.moleculeName) {
          const name = input.moleculeName.replace(/'/g, "''");
          sourceCondition = `LOWER(mt.source_molecule_name) = LOWER('${name}')`;
          productCondition = `LOWER(mt.product_molecule_name) = LOWER('${name}')`;
        }

        // Get transformations where molecule is source
        const asSourceResult = await db.execute(sql.raw(`
          SELECT 
            mt.id,
            mt.source_molecule_name,
            mt.product_molecule_name,
            mt.transformation_type,
            mt.temperature_optimal,
            mt.olfactory_change_description,
            mt.source_molecule_id,
            mt.product_molecule_id,
            mt.relevance_context,
            pm.id as product_db_id,
            pm.name as product_db_name,
            pm.family as product_family,
            pm.chemical_class as product_chemical_class
          FROM molecular_transformations mt
          LEFT JOIN molecules pm ON mt.product_molecule_id = pm.id
          WHERE ${sourceCondition}
          ORDER BY mt.transformation_type, mt.product_molecule_name
        `));

        // Get transformations where molecule is product
        const asProductResult = await db.execute(sql.raw(`
          SELECT 
            mt.id,
            mt.source_molecule_name,
            mt.product_molecule_name,
            mt.transformation_type,
            mt.temperature_optimal,
            mt.olfactory_change_description,
            mt.source_molecule_id,
            mt.product_molecule_id,
            mt.relevance_context,
            sm.id as source_db_id,
            sm.name as source_db_name,
            sm.family as source_family,
            sm.chemical_class as source_chemical_class
          FROM molecular_transformations mt
          LEFT JOIN molecules sm ON mt.source_molecule_id = sm.id
          WHERE ${productCondition}
          ORDER BY mt.transformation_type, mt.source_molecule_name
        `));

        const asSource = (asSourceResult[0] as unknown) as any[];
        const asProduct = (asProductResult[0] as unknown) as any[];

        return {
          success: true,
          asSource,
          asProduct,
          stats: {
            totalAsSource: asSource.length,
            totalAsProduct: asProduct.length,
            total: asSource.length + asProduct.length,
          },
        };
      } catch (error: any) {
        console.error("Error getting transformations by molecule:", error);
        return { success: false, asSource: [], asProduct: [], error: error.message };
      }
    }),

  // ============================================================================
  // RESEARCH PUBLICATIONS, METHODS, RESEARCHERS, INSTITUTIONS
  // ============================================================================

  /**
   * Get all research publications with filtering
   */
  getPublications: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        focus: z.string().optional(),
        subject: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return { success: false, data: [], count: 0, error: "Database connection failed" };
        }

        let query = `SELECT * FROM research_publications WHERE 1=1`;
        
        if (input?.focus) {
          query += ` AND research_focus = '${input.focus}'`;
        }
        if (input?.subject) {
          query += ` AND subject_matter = '${input.subject}'`;
        }
        if (input?.search) {
          const searchTerm = input.search.replace(/'/g, "''");
          query += ` AND (title LIKE '%${searchTerm}%' OR authors LIKE '%${searchTerm}%' OR key_findings LIKE '%${searchTerm}%')`;
        }
        
        query += ` ORDER BY citations DESC LIMIT ${input?.limit || 50} OFFSET ${input?.offset || 0}`;
        
        const result = await db.execute(sql.raw(query));
        const rows = Array.isArray(result) && result.length > 0 ? result[0] : result;
        
        return {
          success: true,
          data: Array.isArray(rows) ? rows : [],
          count: Array.isArray(rows) ? rows.length : 0,
        };
      } catch (error: any) {
        console.error("Error fetching publications:", error);
        return { success: false, data: [], count: 0, error: error.message };
      }
    }),

  /**
   * Get a single publication by ID
   */
  getPublicationById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return { success: false, data: null, error: "Database connection failed" };
        }

        const result = await db.execute(
          sql.raw(`SELECT * FROM research_publications WHERE id = ${input.id}`)
        );
        const rows = Array.isArray(result) && result.length > 0 ? result[0] : result;
        const data = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
        
        return { success: true, data };
      } catch (error: any) {
        console.error("Error fetching publication:", error);
        return { success: false, data: null, error: error.message };
      }
    }),

  /**
   * Get all analytical methods with filtering
   */
  getAnalyticalMethods: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return { success: false, data: [], error: "Database connection failed" };
        }

        let query = `SELECT * FROM analytical_methods WHERE 1=1`;
        
        if (input?.category) {
          query += ` AND category = '${input.category}'`;
        }
        if (input?.search) {
          const searchTerm = input.search.replace(/'/g, "''");
          query += ` AND (name LIKE '%${searchTerm}%' OR code LIKE '%${searchTerm}%' OR description LIKE '%${searchTerm}%')`;
        }
        
        query += ` ORDER BY performance_score DESC`;
        
        const result = await db.execute(sql.raw(query));
        const rows = Array.isArray(result) && result.length > 0 ? result[0] : result;
        
        return {
          success: true,
          data: Array.isArray(rows) ? rows : [],
        };
      } catch (error: any) {
        console.error("Error fetching analytical methods:", error);
        return { success: false, data: [], error: error.message };
      }
    }),

  /**
   * Get all researchers with filtering
   */
  getResearchers: publicProcedure
    .input(
      z.object({
        status: z.string().optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return { success: false, data: [], error: "Database connection failed" };
        }

        let query = `SELECT * FROM researchers WHERE 1=1`;
        
        if (input?.status) {
          query += ` AND status = '${input.status}'`;
        }
        if (input?.search) {
          const searchTerm = input.search.replace(/'/g, "''");
          query += ` AND (name LIKE '%${searchTerm}%' OR bio LIKE '%${searchTerm}%')`;
        }
        
        query += ` ORDER BY total_citations DESC`;
        
        const result = await db.execute(sql.raw(query));
        const rows = Array.isArray(result) && result.length > 0 ? result[0] : result;
        
        return {
          success: true,
          data: Array.isArray(rows) ? rows : [],
        };
      } catch (error: any) {
        console.error("Error fetching researchers:", error);
        return { success: false, data: [], error: error.message };
      }
    }),

  /**
   * Get all research institutions with filtering
   */
  getInstitutions: publicProcedure
    .input(
      z.object({
        country: z.string().optional(),
        type: z.string().optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return { success: false, data: [], error: "Database connection failed" };
        }

        let query = `SELECT * FROM research_institutions WHERE 1=1`;
        
        if (input?.country) {
          query += ` AND country = '${input.country}'`;
        }
        if (input?.type) {
          query += ` AND institution_type = '${input.type}'`;
        }
        if (input?.search) {
          const searchTerm = input.search.replace(/'/g, "''");
          query += ` AND (name LIKE '%${searchTerm}%' OR description LIKE '%${searchTerm}%')`;
        }
        
        query += ` ORDER BY total_citations DESC`;
        
        const result = await db.execute(sql.raw(query));
        const rows = Array.isArray(result) && result.length > 0 ? result[0] : result;
        
        return {
          success: true,
          data: Array.isArray(rows) ? rows : [],
        };
      } catch (error: any) {
        console.error("Error fetching institutions:", error);
        return { success: false, data: [], error: error.message };
      }
    }),

  /**
   * Get research data statistics
   */
  getResearchDataStats: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        return { success: false, data: null, error: "Database connection failed" };
      }

      const pubCount = await db.execute(sql.raw(`SELECT COUNT(*) as count FROM research_publications`));
      const methodCount = await db.execute(sql.raw(`SELECT COUNT(*) as count FROM analytical_methods`));
      const researcherCount = await db.execute(sql.raw(`SELECT COUNT(*) as count FROM researchers`));
      const instCount = await db.execute(sql.raw(`SELECT COUNT(*) as count FROM research_institutions`));
      const totalCitations = await db.execute(sql.raw(`SELECT COALESCE(SUM(citations), 0) as total FROM research_publications`));

      const pubBySubject = await db.execute(sql.raw(`
        SELECT subject_matter, COUNT(*) as count 
        FROM research_publications 
        GROUP BY subject_matter
      `));
      
      const pubByYear = await db.execute(sql.raw(`
        SELECT year, COUNT(*) as count, COALESCE(SUM(citations), 0) as citations
        FROM research_publications 
        GROUP BY year 
        ORDER BY year
      `));

      const methodsByCategory = await db.execute(sql.raw(`
        SELECT category, COUNT(*) as count 
        FROM analytical_methods 
        GROUP BY category
      `));

      const extractRows = (result: any) => {
        const rows = Array.isArray(result) && result.length > 0 ? result[0] : result;
        return Array.isArray(rows) ? rows : [];
      };

      return {
        success: true,
        data: {
          publicationCount: extractRows(pubCount)[0]?.count || 0,
          methodCount: extractRows(methodCount)[0]?.count || 0,
          researcherCount: extractRows(researcherCount)[0]?.count || 0,
          institutionCount: extractRows(instCount)[0]?.count || 0,
          totalCitations: extractRows(totalCitations)[0]?.total || 0,
          publicationsBySubject: extractRows(pubBySubject),
          publicationsByYear: extractRows(pubByYear),
          methodsByCategory: extractRows(methodsByCategory),
        },
      };
    } catch (error: any) {
      console.error("Error fetching research stats:", error);
      return { success: false, data: null, error: error.message };
    }
  }),

  /**
   * Get top cited publications
   */
  getTopCitedPublications: publicProcedure
    .input(z.object({ limit: z.number().default(10) }).optional())
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return { success: false, data: [], error: "Database connection failed" };
        }

        const result = await db.execute(
          sql.raw(`SELECT * FROM research_publications ORDER BY citations DESC LIMIT ${input?.limit || 10}`)
        );
        const rows = Array.isArray(result) && result.length > 0 ? result[0] : result;
        
        return {
          success: true,
          data: Array.isArray(rows) ? rows : [],
        };
      } catch (error: any) {
        console.error("Error fetching top cited publications:", error);
        return { success: false, data: [], error: error.message };
      }
    }),

  /**
   * Get methods performance comparison
   */
  getMethodsPerformance: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        return { success: false, data: [], error: "Database connection failed" };
      }

      const result = await db.execute(
        sql.raw(`
          SELECT 
            id, method_id as code, name, category,
            performance_score, resolution_score, sensitivity_score,
            detection_limit, publication_count
          FROM analytical_methods
          ORDER BY performance_score DESC
        `)
      );
      const rows = Array.isArray(result) && result.length > 0 ? result[0] : result;
      
      return {
        success: true,
        data: Array.isArray(rows) ? rows : [],
      };
    } catch (error: any) {
      console.error("Error fetching methods performance:", error);
      return { success: false, data: [], error: error.message };
    }
  }),

  /**
   * Get all analytical methods with filtering
   */
  getMethods: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return { success: false, data: [], count: 0, error: "Database connection failed" };
        }
        
        let query = `SELECT * FROM analytical_methods WHERE 1=1`;
        
        if (input?.category) {
          query += ` AND category = '${input.category.replace(/'/g, "''")}'`;
        }
        
        if (input?.search) {
          const searchTerm = input.search.replace(/'/g, "''");
          query += ` AND (name LIKE '%${searchTerm}%' OR description LIKE '%${searchTerm}%' OR acronym LIKE '%${searchTerm}%')`;
        }
        
        query += ` ORDER BY name ASC`;
        query += ` LIMIT ${input?.limit || 50} OFFSET ${input?.offset || 0}`;
        
        const result = await db.execute(sql.raw(query));
        const rows = Array.isArray(result) && result.length > 0 ? result[0] : result;
        
        return {
          success: true,
          data: Array.isArray(rows) ? rows : [],
          count: Array.isArray(rows) ? rows.length : 0,
        };
      } catch (error: any) {
        console.error("Error fetching analytical methods:", error);
        return { success: false, data: [], count: 0, error: error.message };
      }
    }),

  /**
   * Get all molecular transformations (pyrolysis, combustion, etc.)
   */
  getTransformations: publicProcedure
    .input(
      z.object({
        type: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().default(100),
        offset: z.number().default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return { success: false, data: [], count: 0, error: "Database connection failed" };
        }
        
        let query = `SELECT * FROM molecular_transformations WHERE 1=1`;
        
        if (input?.type) {
          query += ` AND transformation_type = '${input.type.replace(/'/g, "''")}'`;
        }
        
        if (input?.search) {
          const searchTerm = input.search.replace(/'/g, "''");
          query += ` AND (source_molecule_name LIKE '%${searchTerm}%' OR product_molecule_name LIKE '%${searchTerm}%' OR notes LIKE '%${searchTerm}%')`;
        }
        
        query += ` ORDER BY id DESC`;
        query += ` LIMIT ${input?.limit || 100} OFFSET ${input?.offset || 0}`;
        
        const result = await db.execute(sql.raw(query));
        const rows = Array.isArray(result) && result.length > 0 ? result[0] : result;
        
        return {
          success: true,
          data: Array.isArray(rows) ? rows : [],
          count: Array.isArray(rows) ? rows.length : 0,
        };
      } catch (error: any) {
        console.error("Error fetching molecular transformations:", error);
        return { success: false, data: [], count: 0, error: error.message };
      }
    }),

  /**
   * Get all publication-molecule links for visualization
   */
  getPublicationMoleculeLinks: publicProcedure
    .input(
      z.object({
        publicationId: z.number().optional(),
        moleculeId: z.number().optional(),
        relationshipType: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return { success: false, links: [], publications: [], molecules: [], error: "Database connection failed" };
        }
        
        // Get all links with publication and molecule details
        let query = `
          SELECT 
            pml.id,
            pml.publication_id,
            pml.molecule_id,
            pml.relationship_type,
            pml.notes,
            rp.title as publication_title,
            rp.year as publication_year,
            rp.journal as publication_journal,
            m.name as molecule_name,
            m.formula as molecule_formula,
            m.chemical_class as molecule_class
          FROM publication_molecule_links pml
          JOIN research_publications rp ON pml.publication_id = rp.id
          JOIN molecules m ON pml.molecule_id = m.id
          WHERE 1=1
        `;
        
        if (input?.publicationId) {
          query += ` AND pml.publication_id = ${input.publicationId}`;
        }
        if (input?.moleculeId) {
          query += ` AND pml.molecule_id = ${input.moleculeId}`;
        }
        if (input?.relationshipType) {
          query += ` AND pml.relationship_type = '${input.relationshipType.replace(/'/g, "''")}'`;
        }
        
        query += ` ORDER BY rp.year DESC, m.name ASC`;
        
        const linksResult = await db.execute(sql.raw(query));
        const links = Array.isArray(linksResult) && linksResult.length > 0 ? linksResult[0] : linksResult;
        
        // Get unique publications
        const pubsResult = await db.execute(sql.raw(`
          SELECT DISTINCT rp.id, rp.title, rp.year, rp.journal, rp.doi
          FROM research_publications rp
          JOIN publication_molecule_links pml ON rp.id = pml.publication_id
          ORDER BY rp.year DESC
        `));
        const publications = Array.isArray(pubsResult) && pubsResult.length > 0 ? pubsResult[0] : pubsResult;
        
        // Get unique molecules
        const molsResult = await db.execute(sql.raw(`
          SELECT DISTINCT m.id, m.name, m.formula, m.chemical_class
          FROM molecules m
          JOIN publication_molecule_links pml ON m.id = pml.molecule_id
          ORDER BY m.name ASC
        `));
        const molecules = Array.isArray(molsResult) && molsResult.length > 0 ? molsResult[0] : molsResult;
        
        return {
          success: true,
          links: Array.isArray(links) ? links : [],
          publications: Array.isArray(publications) ? publications : [],
          molecules: Array.isArray(molecules) ? molecules : [],
          stats: {
            totalLinks: Array.isArray(links) ? links.length : 0,
            totalPublications: Array.isArray(publications) ? publications.length : 0,
            totalMolecules: Array.isArray(molecules) ? molecules.length : 0,
          }
        };
      } catch (error: any) {
        console.error("Error fetching publication-molecule links:", error);
        return { success: false, links: [], publications: [], molecules: [], error: error.message };
      }
    }),

  /**
   * Get all aromatic rarities with optional filtering
   */
  getAromaticRarities: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        category: z.string().optional(),
        rarityRegime: z.string().optional(),
        limit: z.number().default(100),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return { success: false, data: [], count: 0, error: "DB connection failed" };

        let whereClause = 'WHERE 1=1';
        const params: any[] = [];

        if (input.search) {
          whereClause += ' AND (name LIKE ? OR notes LIKE ? OR key_molecules LIKE ?)';
          const s = `%${input.search}%`;
          params.push(s, s, s);
        }
        if (input.category) {
          whereClause += ' AND category = ?';
          params.push(input.category);
        }
        if (input.rarityRegime) {
          whereClause += ' AND rarity_regime = ?';
          params.push(input.rarityRegime);
        }

        const [rows] = await (db as any).$client.execute(
          `SELECT * FROM aromatic_rarities ${whereClause} ORDER BY rarity_id LIMIT ? OFFSET ?`,
          [...params, input.limit, input.offset]
        );
        const [countRows] = await (db as any).$client.execute(
          `SELECT COUNT(*) as total FROM aromatic_rarities ${whereClause}`,
          params
        );

        return {
          success: true,
          data: Array.isArray(rows) ? rows : [],
          count: countRows[0]?.total || 0,
        };
      } catch (error: any) {
        console.error("Error fetching aromatic rarities:", error);
        return { success: false, data: [], count: 0, error: error.message };
      }
    }),

  /**
   * Get a single aromatic rarity by ID
   */
  getAromaticRarityById: publicProcedure
    .input(z.object({ rarityId: z.string() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return { success: false, data: null, error: "DB connection failed" };

        const [rows] = await (db as any).$client.execute(
          `SELECT * FROM aromatic_rarities WHERE rarity_id = ? LIMIT 1`,
          [input.rarityId]
        );

        return {
          success: true,
          data: Array.isArray(rows) && rows.length > 0 ? rows[0] : null,
        };
      } catch (error: any) {
        console.error("Error fetching aromatic rarity:", error);
        return { success: false, data: null, error: error.message };
      }
    }),
});
