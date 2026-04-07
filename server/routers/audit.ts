import { router, publicProcedure } from "../_core/trpc";
import { molecules, plants, plantMolecules } from "../../drizzle/schema";
import { getDb } from "../db";
import { eq, isNull, count, sql } from "drizzle-orm";

export const auditRouter = router({
  /**
   * Statistiques générales sur les données
   */
  getDataStats: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      
      const moleculeCount = await db.select({ count: count() }).from(molecules);
      const plantCount = await db.select({ count: count() }).from(plants);
      const linkCount = await db.select({ count: count() }).from(plantMolecules);
      
      return {
        molecules: moleculeCount[0]?.count || 0,
        plants: plantCount[0]?.count || 0,
        plantMoleculeLinks: linkCount[0]?.count || 0,
        success: true,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      };
    }
  }),

  /**
   * Identifier les molécules sans formule chimique
   */
  getMoleculesWithoutFormula: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      
      const result = await db
        .select({
          id: molecules.id,
          name: molecules.name,
          chemicalFormula: molecules.chemicalFormula,
        })
        .from(molecules)
        .where(isNull(molecules.chemicalFormula))
        .limit(100);
      
      return {
        count: result.length,
        molecules: result,
        success: true,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      };
    }
  }),

  /**
   * Identifier les plantes orphelines (sans liaisons molécule)
   */
  getOrphanPlants: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      
      // Plantes sans liaisons
      const orphanPlants = await db
        .select({
          id: plants.id,
          name: plants.name,
        })
        .from(plants)
        .where(
          sql`${plants.id} NOT IN (SELECT DISTINCT plant_id FROM plant_molecules)`
        )
        .limit(100);
      
      return {
        count: orphanPlants.length,
        plants: orphanPlants,
        success: true,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      };
    }
  }),

  /**
   * Identifier les molécules orphelines (sans liaisons plante)
   */
  getOrphanMolecules: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      
      // Molécules sans liaisons
      const orphanMolecules = await db
        .select({
          id: molecules.id,
          name: molecules.name,
        })
        .from(molecules)
        .where(
          sql`${molecules.id} NOT IN (SELECT DISTINCT molecule_id FROM plant_molecules)`
        )
        .limit(100);
      
      return {
        count: orphanMolecules.length,
        molecules: orphanMolecules,
        success: true,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      };
    }
  }),

  /**
   * Statistiques sur la couverture des données
   */
  getCoverageStats: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      
      const totalMolecules = await db.select({ count: count() }).from(molecules);
      const moleculesWithFormula = await db
        .select({ count: count() })
        .from(molecules)
        .where(sql`${molecules.chemicalFormula} IS NOT NULL`);
      
      const totalPlants = await db.select({ count: count() }).from(plants);
      const plantsWithLinks = await db
        .select({ count: count(sql`DISTINCT plant_id`) })
        .from(plantMolecules);
      
      return {
        molecules: {
          total: totalMolecules[0]?.count || 0,
          withFormula: moleculesWithFormula[0]?.count || 0,
          coverage: totalMolecules[0]?.count 
            ? Math.round(((moleculesWithFormula[0]?.count || 0) / (totalMolecules[0]?.count || 1)) * 100)
            : 0,
        },
        plants: {
          total: totalPlants[0]?.count || 0,
          withLinks: plantsWithLinks[0]?.count || 0,
          coverage: totalPlants[0]?.count
            ? Math.round(((plantsWithLinks[0]?.count || 0) / (totalPlants[0]?.count || 1)) * 100)
            : 0,
        },
        success: true,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      };
    }
  }),
});
