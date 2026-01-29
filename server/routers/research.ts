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
});
