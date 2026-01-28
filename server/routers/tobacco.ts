/**
 * Tobacco Router for PERFUMUM
 * Provides tRPC procedures for tobacco varieties, terroirs, and related data
 */

import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { tabacs } from "../../drizzle/schema";
import { sql } from "drizzle-orm";

export const tobaccoRouter = router({
  /**
   * Get all tobacco varieties with optional filtering
   */
  getVarieties: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        type: z.enum(["blond", "brun", "oriental", "experimental"]).optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        
        let query = db.select().from(tabacs);
        
        // Apply filters
        if (input.type) {
          query = query.where(sql`${tabacs.type} = ${input.type}`);
        }
        
        if (input.search) {
          const searchTerm = `%${input.search}%`;
          query = query.where(
            sql`${tabacs.name} LIKE ${searchTerm} OR ${tabacs.internalNotes} LIKE ${searchTerm}`
          );
        }
        
        const results = await query.limit(input.limit).offset(input.offset);
        
        return {
          success: true,
          data: results,
          count: results.length,
        };
      } catch (error) {
        console.error("Error fetching tobacco varieties:", error);
        return {
          success: false,
          data: [],
          count: 0,
          error: (error as Error).message,
        };
      }
    }),

  /**
   * Get a single tobacco variety by ID
   */
  getVarietyById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        
        const result = await db
          .select()
          .from(tabacs)
          .where(sql`${tabacs.id} = ${input.id}`)
          .limit(1);
        
        if (result.length === 0) {
          return {
            success: false,
            data: null,
            error: "Variety not found",
          };
        }
        
        return {
          success: true,
          data: result[0],
        };
      } catch (error) {
        console.error("Error fetching tobacco variety:", error);
        return {
          success: false,
          data: null,
          error: (error as Error).message,
        };
      }
    }),

  /**
   * Get tobacco varieties by type
   */
  getVarietiesByType: publicProcedure
    .input(z.object({ type: z.enum(["blond", "brun", "oriental", "experimental"]) }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        
        const results = await db
          .select()
          .from(tabacs)
          .where(sql`${tabacs.type} = ${input.type}`);
        
        return {
          success: true,
          data: results,
          count: results.length,
        };
      } catch (error) {
        console.error("Error fetching tobacco varieties by type:", error);
        return {
          success: false,
          data: [],
          count: 0,
          error: (error as Error).message,
        };
      }
    }),

  /**
   * Get statistics about tobacco varieties
   */
  getStatistics: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      
      const allVarieties = await db.select().from(tabacs);
      
      const typeStats = {
        blond: allVarieties.filter(v => v.type === "blond").length,
        brun: allVarieties.filter(v => v.type === "brun").length,
        oriental: allVarieties.filter(v => v.type === "oriental").length,
        experimental: allVarieties.filter(v => v.type === "experimental").length,
      };
      
      return {
        success: true,
        data: {
          total: allVarieties.length,
          byType: typeStats,
          averageIntensity: allVarieties.length > 0
            ? Math.round(
                allVarieties.reduce((sum, v) => sum + (v.intensity || 0), 0) /
                  allVarieties.length
              )
            : 0,
        },
      };
    } catch (error) {
      console.error("Error fetching tobacco statistics:", error);
      return {
        success: false,
        data: null,
        error: (error as Error).message,
      };
    }
  }),
});
