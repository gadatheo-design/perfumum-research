/**
 * Data Import Router for PERFUMUM
 * Provides tRPC procedures to import tobacco, cannabis, and related data
 */

import { router, adminProcedure } from "../_core/trpc";
import {
  importTobaccoVarietiesData,
  importTerroirsData,
  importAdditivesData,
  importPyrazinesData,
  importAromaticMoleculesData,
  importLandracesData,
  importResearchClaimsData,
  importResearchSourcesData,
  runAllImports,
} from "../import-data";

export const dataImportRouter = router({
  /**
   * Import tobacco varieties
   */
  importTobaccoVarieties: adminProcedure.mutation(async () => {
    try {
      const count = await importTobaccoVarietiesData();
      return {
        success: true,
        count,
        message: `✅ Imported ${count} tobacco varieties`,
      };
    } catch (error) {
      return {
        success: false,
        count: 0,
        message: `❌ Error importing tobacco varieties: ${(error as Error).message}`,
      };
    }
  }),

  /**
   * Import terroirs
   */
  importTerroirs: adminProcedure.mutation(async () => {
    try {
      const count = await importTerroirsData();
      return {
        success: true,
        count,
        message: `✅ Imported ${count} terroirs`,
      };
    } catch (error) {
      return {
        success: false,
        count: 0,
        message: `❌ Error importing terroirs: ${(error as Error).message}`,
      };
    }
  }),

  /**
   * Import additives
   */
  importAdditives: adminProcedure.mutation(async () => {
    try {
      const count = await importAdditivesData();
      return {
        success: true,
        count,
        message: `✅ Imported ${count} additives`,
      };
    } catch (error) {
      return {
        success: false,
        count: 0,
        message: `❌ Error importing additives: ${(error as Error).message}`,
      };
    }
  }),

  /**
   * Import pyrazines
   */
  importPyrazines: adminProcedure.mutation(async () => {
    try {
      const count = await importPyrazinesData();
      return {
        success: true,
        count,
        message: `✅ Imported ${count} pyrazines`,
      };
    } catch (error) {
      return {
        success: false,
        count: 0,
        message: `❌ Error importing pyrazines: ${(error as Error).message}`,
      };
    }
  }),

  /**
   * Import aromatic molecules
   */
  importAromaticMolecules: adminProcedure.mutation(async () => {
    try {
      const count = await importAromaticMoleculesData();
      return {
        success: true,
        count,
        message: `✅ Imported ${count} aromatic molecules`,
      };
    } catch (error) {
      return {
        success: false,
        count: 0,
        message: `❌ Error importing aromatic molecules: ${(error as Error).message}`,
      };
    }
  }),

  /**
   * Import landraces
   */
  importLandraces: adminProcedure.mutation(async () => {
    try {
      const count = await importLandracesData();
      return {
        success: true,
        count,
        message: `✅ Imported ${count} landraces`,
      };
    } catch (error) {
      return {
        success: false,
        count: 0,
        message: `❌ Error importing landraces: ${(error as Error).message}`,
      };
    }
  }),

  /**
   * Import research claims
   */
  importResearchClaims: adminProcedure.mutation(async () => {
    try {
      const count = await importResearchClaimsData();
      return {
        success: true,
        count,
        message: `✅ Imported ${count} research claims`,
      };
    } catch (error) {
      return {
        success: false,
        count: 0,
        message: `❌ Error importing research claims: ${(error as Error).message}`,
      };
    }
  }),

  /**
   * Import research sources
   */
  importResearchSources: adminProcedure.mutation(async () => {
    try {
      const count = await importResearchSourcesData();
      return {
        success: true,
        count,
        message: `✅ Imported ${count} research sources`,
      };
    } catch (error) {
      return {
        success: false,
        count: 0,
        message: `❌ Error importing research sources: ${(error as Error).message}`,
      };
    }
  }),

  /**
   * Run all imports
   */
  runAllImports: adminProcedure.mutation(async () => {
    try {
      const results = await runAllImports();
      const total = Object.values(results).reduce((a: number, b: number) => a + b, 0);
      return {
        success: true,
        results,
        total,
        message: `✅ Successfully imported ${total} total entities`,
      };
    } catch (error) {
      return {
        success: false,
        results: {},
        total: 0,
        message: `❌ Error running all imports: ${(error as Error).message}`,
      };
    }
  }),
});
