/**
 * Tobacco Router for PERFUMUM
 * Provides tRPC procedures for tobacco varieties, terroirs, and related data
 */

import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { tabacs } from "../../drizzle/schema";
import { sql, eq, like, or, and } from "drizzle-orm";

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
        
        if (!db) {
          return {
            success: false,
            data: [],
            count: 0,
            error: "Database not available",
          };
        }
        
        // Build conditions array
        const conditions = [];
        
        if (input.type) {
          conditions.push(eq(tabacs.type, input.type));
        }
        
        if (input.search) {
          const searchTerm = `%${input.search}%`;
          conditions.push(
            or(
              like(tabacs.name, searchTerm),
              like(tabacs.internalNotes, searchTerm)
            )
          );
        }
        
        // Execute query with conditions
        let results;
        if (conditions.length > 0) {
          results = await db
            .select()
            .from(tabacs)
            .where(and(...conditions))
            .limit(input.limit)
            .offset(input.offset);
        } else {
          results = await db
            .select()
            .from(tabacs)
            .limit(input.limit)
            .offset(input.offset);
        }
        
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
        
        if (!db) {
          return {
            success: false,
            data: null,
            error: "Database not available",
          };
        }
        
        const result = await db
          .select()
          .from(tabacs)
          .where(eq(tabacs.id, input.id))
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
        
        if (!db) {
          return {
            success: false,
            data: [],
            count: 0,
            error: "Database not available",
          };
        }
        
        const results = await db
          .select()
          .from(tabacs)
          .where(eq(tabacs.type, input.type));
        
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
      
      if (!db) {
        return {
          success: false,
          data: null,
          error: "Database not available",
        };
      }
      
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

  // ============================================================================
  // TOBACCO LANDRACES (nouvelles tables)
  // ============================================================================

  /**
   * Get all tobacco landraces
   */
  getLandraces: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) return { success: false, data: [], error: "Database not available" };
      
      const result = await db.execute(sql`
        SELECT * FROM tobacco_landraces ORDER BY perfumery_potential_score DESC
      `);
      return { success: true, data: (result[0] as unknown) as any[] };
    } catch (error) {
      console.error("Error fetching landraces:", error);
      return { success: false, data: [], error: (error as Error).message };
    }
  }),

  /**
   * Get landraces by molecular profile type
   */
  getLandracesByProfile: publicProcedure
    .input(z.object({ profile: z.enum(["cuir-animal", "floral-mielle", "cremeux-gourmand", "mixte", "unknown"]) }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return { success: false, data: [], error: "Database not available" };
        
        const result = await db.execute(sql`
          SELECT * FROM tobacco_landraces 
          WHERE molecular_profile_type = ${input.profile}
          ORDER BY perfumery_potential_score DESC
        `);
        return { success: true, data: (result[0] as unknown) as any[] };
      } catch (error) {
        console.error("Error fetching landraces by profile:", error);
        return { success: false, data: [], error: (error as Error).message };
      }
    }),

  /**
   * Get landrace by ID
   */
  getLandraceById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return { success: false, data: null, error: "Database not available" };
        
        const result = await db.execute(sql`
          SELECT * FROM tobacco_landraces WHERE id = ${input.id}
        `);
        const rows = result[0] as unknown as any[];
        return { success: true, data: rows[0] || null };
      } catch (error) {
        console.error("Error fetching landrace:", error);
        return { success: false, data: null, error: (error as Error).message };
      }
    }),

  /**
   * Get landraces statistics
   */
  getLandracesStats: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) return { success: false, data: null, error: "Database not available" };
      
      const [total] = await db.execute(sql`SELECT COUNT(*) as count FROM tobacco_landraces`);
      const [byCountry] = await db.execute(sql`
        SELECT country, COUNT(*) as count FROM tobacco_landraces GROUP BY country ORDER BY count DESC
      `);
      const [byProfile] = await db.execute(sql`
        SELECT molecular_profile_type as profile, COUNT(*) as count FROM tobacco_landraces GROUP BY molecular_profile_type
      `);
      const [byStatus] = await db.execute(sql`
        SELECT status, COUNT(*) as count FROM tobacco_landraces GROUP BY status
      `);
      
      return {
        success: true,
        data: {
          total: ((total as unknown) as any[])[0]?.count || 0,
          byCountry: (byCountry as unknown) as any[],
          byProfile: (byProfile as unknown) as any[],
          byStatus: (byStatus as unknown) as any[]
        }
      };
    } catch (error) {
      console.error("Error fetching landraces stats:", error);
      return { success: false, data: null, error: (error as Error).message };
    }
  }),

  // ============================================================================
  // TOBACCO CIGARETTES
  // ============================================================================

  /**
   * Get all cigarettes
   */
  getCigarettes: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) return { success: false, data: [], error: "Database not available" };
      
      const result = await db.execute(sql`
        SELECT * FROM tobacco_cigarettes ORDER BY perfumery_potential_score DESC
      `);
      return { success: true, data: (result[0] as unknown) as any[] };
    } catch (error) {
      console.error("Error fetching cigarettes:", error);
      return { success: false, data: [], error: (error as Error).message };
    }
  }),

  /**
   * Get cigarettes by category
   */
  getCigarettesByCategory: publicProcedure
    .input(z.object({ category: z.enum(["soviet", "oriental", "chinese", "european", "american", "other"]) }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return { success: false, data: [], error: "Database not available" };
        
        const result = await db.execute(sql`
          SELECT * FROM tobacco_cigarettes 
          WHERE region_category = ${input.category}
          ORDER BY perfumery_potential_score DESC
        `);
        return { success: true, data: (result[0] as unknown) as any[] };
      } catch (error) {
        console.error("Error fetching cigarettes by category:", error);
        return { success: false, data: [], error: (error as Error).message };
      }
    }),

  /**
   * Get cigarette by ID
   */
  getCigaretteById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return { success: false, data: null, error: "Database not available" };
        
        const result = await db.execute(sql`
          SELECT * FROM tobacco_cigarettes WHERE id = ${input.id}
        `);
        const rows = result[0] as unknown as any[];
        return { success: true, data: rows[0] || null };
      } catch (error) {
        console.error("Error fetching cigarette:", error);
        return { success: false, data: null, error: (error as Error).message };
      }
    }),

  // ============================================================================
  // TOBACCO COMPOUNDS
  // ============================================================================

  /**
   * Get all tobacco compounds
   */
  getCompounds: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) return { success: false, data: [], error: "Database not available" };
      
      const result = await db.execute(sql`
        SELECT * FROM tobacco_compounds ORDER BY chemical_class, compound_name
      `);
      return { success: true, data: (result[0] as unknown) as any[] };
    } catch (error) {
      console.error("Error fetching compounds:", error);
      return { success: false, data: [], error: (error as Error).message };
    }
  }),

  /**
   * Get compounds by category
   */
  getCompoundsByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return { success: false, data: [], error: "Database not available" };
        
        const result = await db.execute(sql`
          SELECT * FROM tobacco_compounds 
          WHERE category = ${input.category}
          ORDER BY compound_name
        `);
        return { success: true, data: (result[0] as unknown) as any[] };
      } catch (error) {
        console.error("Error fetching compounds by category:", error);
        return { success: false, data: [], error: (error as Error).message };
      }
    }),

  /**
   * Get new tobacco isolates
   */
  getNewIsolates: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) return { success: false, data: [], error: "Database not available" };
      
      const result = await db.execute(sql`
        SELECT * FROM tobacco_compounds 
        WHERE is_new_tobacco_isolate = TRUE
        ORDER BY compound_name
      `);
      return { success: true, data: (result[0] as unknown) as any[] };
    } catch (error) {
      console.error("Error fetching new isolates:", error);
      return { success: false, data: [], error: (error as Error).message };
    }
  }),

  // ============================================================================
  // SOIL ANALYSES
  // ============================================================================

  /**
   * Get all soil analyses
   */
  getSoilAnalyses: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) return { success: false, data: [], error: "Database not available" };
      
      const result = await db.execute(sql`
        SELECT * FROM soil_analyses ORDER BY terroir_name
      `);
      return { success: true, data: (result[0] as unknown) as any[] };
    } catch (error) {
      console.error("Error fetching soil analyses:", error);
      return { success: false, data: [], error: (error as Error).message };
    }
  }),

  /**
   * Compare two terroirs
   */
  compareSoils: publicProcedure
    .input(z.object({ terroir1: z.string(), terroir2: z.string() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return { success: false, data: null, error: "Database not available" };
        
        const [result1] = await db.execute(sql`SELECT * FROM soil_analyses WHERE terroir_name = ${input.terroir1}`);
        const [result2] = await db.execute(sql`SELECT * FROM soil_analyses WHERE terroir_name = ${input.terroir2}`);
        
        return {
          success: true,
          data: {
            terroir1: ((result1 as unknown) as any[])[0] || null,
            terroir2: ((result2 as unknown) as any[])[0] || null
          }
        };
      } catch (error) {
        console.error("Error comparing soils:", error);
        return { success: false, data: null, error: (error as Error).message };
      }
    }),

  // ============================================================================
  // TERPENE PROFILES
  // ============================================================================

  /**
   * Get all terpene profiles for landraces
   */
  getTerpeneProfiles: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) return [];
      
      const result = await db.execute(sql`
        SELECT * FROM landrace_terpene_profiles ORDER BY landrace_name, relative_abundance DESC
      `);
      return (result[0] as unknown) as any[];
    } catch (error) {
      console.error("Error fetching terpene profiles:", error);
      return [];
    }
  }),

  /**
   * Get terpene profiles for a specific landrace
   */
  getTerpeneProfilesByLandrace: publicProcedure
    .input(z.object({ landraceName: z.string() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return [];
        
        const result = await db.execute(sql`
          SELECT * FROM landrace_terpene_profiles 
          WHERE landrace_name = ${input.landraceName}
          ORDER BY relative_abundance DESC
        `);
        return (result[0] as unknown) as any[];
      } catch (error) {
        console.error("Error fetching terpene profiles by landrace:", error);
        return [];
      }
    }),

  /**
   * Get Perique fermentation stages
   */
  getPeriqueFermentationStages: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) return [];
      
      const result = await db.execute(sql`
        SELECT * FROM perique_fermentation_stages ORDER BY stage_number
      `);
      return (result[0] as unknown) as any[];
    } catch (error) {
      console.error("Error fetching fermentation stages:", error);
      return [];
    }
  }),

  /**
   * Get all GC-MS chromatograms
   */
  getChromatograms: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) return [];
      
      const result = await db.execute(sql`
        SELECT * FROM gcms_chromatograms ORDER BY landrace_name
      `);
      return (result[0] as unknown) as any[];
    } catch (error) {
      console.error("Error fetching chromatograms:", error);
      return [];
    }
  }),

  /**
   * Get peaks for a specific chromatogram by landrace name
   */
  getChromatogramPeaks: publicProcedure
    .input(z.object({ landraceName: z.string() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return [];
        
        const result = await db.execute(sql`
          SELECT p.* FROM gcms_peaks p
          JOIN gcms_chromatograms c ON p.chromatogram_id = c.id
          WHERE c.landrace_name = ${input.landraceName}
          ORDER BY p.retention_time
        `);
        return (result[0] as unknown) as any[];
      } catch (error) {
        console.error("Error fetching chromatogram peaks:", error);
        return [];
      }
    }),

  /**
   * Get all chromatogram peaks with landrace names for compound search
   */
  getAllChromatogramPeaks: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) return [];
      
      const result = await db.execute(sql`
        SELECT 
          p.compound_name,
          p.cas_number,
          c.landrace_name,
          p.concentration_ppm,
          p.retention_time,
          p.match_quality
        FROM gcms_peaks p
        JOIN gcms_chromatograms c ON p.chromatogram_id = c.id
        ORDER BY p.concentration_ppm DESC
      `);
      return (result[0] as unknown) as any[];
    } catch (error) {
      console.error("Error fetching all chromatogram peaks:", error);
      return [];
    }
  }),

  // ============================================================================
  // MASS SPECTROMETRY DATA
  // ============================================================================

  /**
   * Get all MS spectra
   */
  getMsSpectra: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) return [];
      
      const result = await db.execute(sql`
        SELECT * FROM ms_spectra ORDER BY compound_name
      `);
      
      // Parse JSON spectrum_data
      return ((result[0] as unknown) as any[]).map(row => ({
        ...row,
        spectrum_data: typeof row.spectrum_data === 'string' 
          ? JSON.parse(row.spectrum_data) 
          : row.spectrum_data
      }));
    } catch (error) {
      console.error("Error fetching MS spectra:", error);
      return [];
    }
  }),

  /**
   * Get MS spectrum by compound name
   */
  getMsSpectrumByCompound: publicProcedure
    .input(z.object({ compoundName: z.string() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return null;
        
        const result = await db.execute(sql`
          SELECT * FROM ms_spectra 
          WHERE compound_name = ${input.compoundName}
        `);
        
        const rows = result[0] as unknown as any[];
        if (rows.length === 0) return null;
        
        const row = rows[0];
        return {
          ...row,
          spectrum_data: typeof row.spectrum_data === 'string' 
            ? JSON.parse(row.spectrum_data) 
            : row.spectrum_data
        };
      } catch (error) {
        console.error("Error fetching MS spectrum:", error);
        return null;
      }
    }),

  /**
   * Search MS spectra by CAS number
   */
  getMsSpectrumByCas: publicProcedure
    .input(z.object({ casNumber: z.string() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return null;
        
        const result = await db.execute(sql`
          SELECT * FROM ms_spectra 
          WHERE cas_number = ${input.casNumber}
        `);
        
        const rows = result[0] as unknown as any[];
        if (rows.length === 0) return null;
        
        const row = rows[0];
        return {
          ...row,
          spectrum_data: typeof row.spectrum_data === 'string' 
            ? JSON.parse(row.spectrum_data) 
            : row.spectrum_data
        };
      } catch (error) {
        console.error("Error fetching MS spectrum by CAS:", error);
        return null;
      }
    }),

  /**
   * Get molecules linked to a tobacco variety (tabac_molecule_links)
   */
  getVarietyMolecules: publicProcedure
    .input(z.object({ tabacId: z.number() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return { success: false, data: [], error: "Database not available" };
        const result = await db.execute(sql`
          SELECT m.id, m.name, m.family, m.olfactiveProfile as odor_description,
                 m.cas_number, tml.notes as link_notes
          FROM tabac_molecule_links tml
          JOIN molecules m ON m.id = tml.molecule_id
          WHERE tml.tabac_id = ${input.tabacId}
          ORDER BY m.name
        `);
        return { success: true, data: (result[0] as unknown) as any[] };
      } catch (error) {
        console.error("Error fetching variety molecules:", error);
        return { success: false, data: [], error: (error as Error).message };
      }
    }),

  /**
   * Get all tabacs with their molecule count
   */
  getVarietiesWithMoleculeCount: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) return { success: false, data: [], error: "Database not available" };
      const result = await db.execute(sql`
        SELECT t.id, t.name, t.type, t.origin, t.aromaticProfile, t.intensity, t.internalNotes,
               COUNT(tml.molecule_id) as molecule_count
        FROM tabacs t
        LEFT JOIN tabac_molecule_links tml ON t.id = tml.tabac_id
        GROUP BY t.id, t.name, t.type, t.origin, t.aromaticProfile, t.intensity, t.internalNotes
        ORDER BY t.type, t.name
      `);
      return { success: true, data: (result[0] as unknown) as any[] };
    } catch (error) {
      console.error("Error fetching varieties with molecule count:", error);
      return { success: false, data: [], error: (error as Error).message };
    }
  }),
});
