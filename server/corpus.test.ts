import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";

describe("Corpus PERFUMUM - Database Functions", () => {
  
  describe("Research Content", () => {
    it("should list research content", async () => {
      const content = await db.listResearchContent();
      expect(Array.isArray(content)).toBe(true);
    });
    
    it("should filter research content by axis", async () => {
      const content = await db.listResearchContent({ axisId: "AX1_GENOMIC_CONSERVATION" });
      expect(Array.isArray(content)).toBe(true);
    });
  });
  
  describe("Perfumum Glossary", () => {
    it("should list glossary terms", async () => {
      const glossary = await db.listPerfumumGlossary();
      expect(Array.isArray(glossary)).toBe(true);
    });
    
    it("should return glossary terms with parsed JSON fields", async () => {
      const glossary = await db.listPerfumumGlossary();
      if (glossary.length > 0) {
        const term = glossary[0];
        expect(term).toHaveProperty("term");
        expect(term).toHaveProperty("definition_fr");
      }
    });
  });
  
  describe("Scent Blends", () => {
    it("should list scent blends", async () => {
      const blends = await db.listScentBlends();
      expect(Array.isArray(blends)).toBe(true);
    });
    
    it("should filter blends by climate axis", async () => {
      const blends = await db.listScentBlends({ climateAxis: "vent" });
      expect(Array.isArray(blends)).toBe(true);
      blends.forEach((blend: any) => {
        expect(blend.climate_axis).toBe("vent");
      });
    });
    
    it("should filter blends by intended medium", async () => {
      const blends = await db.listScentBlends({ intendedMedium: "parfum" });
      expect(Array.isArray(blends)).toBe(true);
      blends.forEach((blend: any) => {
        expect(blend.intended_medium).toBe("parfum");
      });
    });
  });
  
  describe("Climate Axis Matrix", () => {
    it("should list climate axis matrix entries", async () => {
      const matrix = await db.listClimateAxisMatrix();
      expect(Array.isArray(matrix)).toBe(true);
    });
    
    it("should get specific matrix entry", async () => {
      const entry = await db.getClimateAxisMatrixEntry("vent", "parfum");
      if (entry) {
        expect(entry.climate_axis).toBe("vent");
        expect(entry.medium).toBe("parfum");
      }
    });
  });
  
  describe("Impact Metrics", () => {
    it("should list impact metrics", async () => {
      const metrics = await db.listImpactMetrics();
      expect(Array.isArray(metrics)).toBe(true);
    });
    
    it("should get metrics by year", async () => {
      const metrics = await db.getImpactMetricsByYear(2025);
      if (metrics) {
        expect(metrics.year).toBe(2025);
      }
    });
  });
  
  describe("Perfumum Plants", () => {
    it("should list perfumum plants", async () => {
      const plants = await db.listPerfumumPlants();
      expect(Array.isArray(plants)).toBe(true);
    });
    
    it("should filter plants by family", async () => {
      const plants = await db.listPerfumumPlants({ family: "Lamiaceae" });
      expect(Array.isArray(plants)).toBe(true);
      plants.forEach((plant: any) => {
        expect(plant.family).toBe("Lamiaceae");
      });
    });
    
    it("should get plant statistics", async () => {
      const stats = await db.getPerfumumPlantsStats();
      expect(stats).toHaveProperty("total");
      expect(stats).toHaveProperty("byFamily");
      expect(stats).toHaveProperty("byAxis");
    });
  });
  
  describe("Perfumum Molecules", () => {
    it("should list perfumum molecules", async () => {
      const molecules = await db.listPerfumumMolecules();
      expect(Array.isArray(molecules)).toBe(true);
    });
    
    it("should filter molecules by role", async () => {
      const molecules = await db.listPerfumumMolecules({ role: "diffusion" });
      expect(Array.isArray(molecules)).toBe(true);
      molecules.forEach((mol: any) => {
        expect(mol.role).toBe("diffusion");
      });
    });
    
    it("should get molecule statistics", async () => {
      const stats = await db.getPerfumumMoleculesStats();
      expect(stats).toHaveProperty("total");
      expect(stats).toHaveProperty("byFamily");
      expect(stats).toHaveProperty("byRole");
    });
  });
  
  describe("Corpus Statistics", () => {
    it("should get corpus statistics", async () => {
      const stats = await db.getCorpusStats();
      expect(stats).toBeTruthy();
      expect(stats).toHaveProperty("axes");
      expect(stats).toHaveProperty("plants");
      expect(stats).toHaveProperty("molecules");
      expect(stats).toHaveProperty("glossary");
      expect(stats).toHaveProperty("blends");
    });
  });
});
