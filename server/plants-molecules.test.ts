/**
 * Tests unitaires pour les plantes aromatiques et leurs molécules
 * PERFUMUM Research Project - 06 janvier 2026
 */

import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";
import { plants, molecules, plantMolecules, bibliographyEntries } from "../drizzle/schema";
import { eq, and, isNotNull, ne } from "drizzle-orm";
import { getDb } from "./db";

describe("Plantes aromatiques colombiennes et burkinabè", () => {
  let dbInstance: Awaited<ReturnType<typeof getDb>>;

  beforeAll(async () => {
    dbInstance = await getDb();
  });

  describe("Existence des plantes dans la base de données", () => {
    it("devrait trouver Lippia origanoides (Colombie)", async () => {
      const result = await dbInstance
        .select()
        .from(plants)
        .where(eq(plants.latinName, "Lippia origanoides"));
      
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].latinName).toBe("Lippia origanoides");
    });

    it("devrait trouver Tagetes lucida (Colombie)", async () => {
      const result = await dbInstance
        .select()
        .from(plants)
        .where(eq(plants.latinName, "Tagetes lucida"));
      
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].latinName).toBe("Tagetes lucida");
    });

    it("devrait trouver Lippia multiflora (Burkina Faso)", async () => {
      const result = await dbInstance
        .select()
        .from(plants)
        .where(eq(plants.latinName, "Lippia multiflora"));
      
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].latinName).toBe("Lippia multiflora");
    });

    it("devrait trouver Ocimum canum (Burkina Faso)", async () => {
      const result = await dbInstance
        .select()
        .from(plants)
        .where(eq(plants.latinName, "Ocimum canum"));
      
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].latinName).toBe("Ocimum canum");
    });
  });

  describe("Liaisons molécules-plantes", () => {
    it("devrait avoir des molécules liées à Lippia origanoides", async () => {
      const plant = await dbInstance
        .select()
        .from(plants)
        .where(eq(plants.latinName, "Lippia origanoides"))
        .limit(1);
      
      expect(plant.length).toBeGreaterThan(0);

      const linkedMolecules = await dbInstance
        .select()
        .from(plantMolecules)
        .where(eq(plantMolecules.plantId, plant[0].id));
      
      expect(linkedMolecules.length).toBeGreaterThan(0);
    });

    it("devrait avoir des molécules liées à Lippia multiflora", async () => {
      const plant = await dbInstance
        .select()
        .from(plants)
        .where(eq(plants.latinName, "Lippia multiflora"))
        .limit(1);
      
      expect(plant.length).toBeGreaterThan(0);

      const linkedMolecules = await dbInstance
        .select()
        .from(plantMolecules)
        .where(eq(plantMolecules.plantId, plant[0].id));
      
      expect(linkedMolecules.length).toBeGreaterThan(0);
    });

    it("devrait avoir le Thymol comme molécule signature de Lippia origanoides", async () => {
      const plant = await dbInstance
        .select()
        .from(plants)
        .where(eq(plants.latinName, "Lippia origanoides"))
        .limit(1);
      
      expect(plant.length).toBeGreaterThan(0);

      const thymol = await dbInstance
        .select()
        .from(molecules)
        .where(eq(molecules.name, "Thymol"))
        .limit(1);
      
      expect(thymol.length).toBeGreaterThan(0);

      const link = await dbInstance
        .select()
        .from(plantMolecules)
        .where(
          and(
            eq(plantMolecules.plantId, plant[0].id),
            eq(plantMolecules.moleculeId, thymol[0].id)
          )
        );
      
      expect(link.length).toBeGreaterThan(0);
      expect(link[0].isSignature).toBe(1);
    });
  });

  describe("Profils moléculaires", () => {
    it("devrait avoir des pourcentages valides pour les liaisons", async () => {
      const plant = await dbInstance
        .select()
        .from(plants)
        .where(eq(plants.latinName, "Lippia origanoides"))
        .limit(1);
      
      expect(plant.length).toBeGreaterThan(0);

      const linkedMolecules = await dbInstance
        .select()
        .from(plantMolecules)
        .where(eq(plantMolecules.plantId, plant[0].id));
      
      for (const link of linkedMolecules) {
        // Vérifier que les pourcentages sont cohérents
        if (link.percentageMin && link.percentageMax) {
          expect(parseFloat(link.percentageMin)).toBeLessThanOrEqual(parseFloat(link.percentageMax));
        }
        if (link.percentageTypical && link.percentageMin && link.percentageMax) {
          expect(parseFloat(link.percentageTypical)).toBeGreaterThanOrEqual(parseFloat(link.percentageMin));
          expect(parseFloat(link.percentageTypical)).toBeLessThanOrEqual(parseFloat(link.percentageMax));
        }
      }
    });
  });
});

describe("Références bibliographiques avec DOI", () => {
  let dbInstance: Awaited<ReturnType<typeof getDb>>;

  beforeAll(async () => {
    dbInstance = await getDb();
  });

  it("devrait avoir au moins 30 références avec DOI", async () => {
    const refsWithDOI = await dbInstance
      .select()
      .from(bibliographyEntries)
      .where(and(isNotNull(bibliographyEntries.doi), ne(bibliographyEntries.doi, "")));
    
    expect(refsWithDOI.length).toBeGreaterThanOrEqual(30);
  });

  it("devrait avoir le DOI correct pour Handbook of Essential Oils", async () => {
    const ref = await dbInstance
      .select()
      .from(bibliographyEntries)
      .where(eq(bibliographyEntries.entryKey, "perfumum_baser2010"))
      .limit(1);
    
    expect(ref.length).toBe(1);
    expect(ref[0].doi).toBe("10.1201/9781420063165");
  });

  it("devrait avoir le DOI correct pour Terpenes: Flavors, Fragrances", async () => {
    const ref = await dbInstance
      .select()
      .from(bibliographyEntries)
      .where(eq(bibliographyEntries.entryKey, "perfumum_breitmaier2006"))
      .limit(1);
    
    expect(ref.length).toBe(1);
    expect(ref[0].doi).toBe("10.1002/9783527609949");
  });
});
