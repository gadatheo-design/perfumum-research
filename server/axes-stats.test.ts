import { describe, it, expect } from 'vitest';
import { 
  getAllAxesStats,
  getAxisDetail,
  listGenomeSamples,
  getGenomeSampleById,
  getGenomeSamplesStats,
  listManuscripts,
  getManuscriptById,
  getManuscriptsStats,
  listGcmsRuns,
  getGcmsRunById,
  getGcmsRunsStats,
} from "./db";

describe("Axes Stats - Statistiques globales", () => {
  describe("getAllAxesStats", () => {
    it("should return statistics for all 6 research axes", async () => {
      const stats = await getAllAxesStats();
      
      expect(stats).toBeDefined();
      expect(Array.isArray(stats)).toBe(true);
      expect(stats.length).toBe(6);
    });

    it("should return stats with required fields", async () => {
      const stats = await getAllAxesStats();
      
      if (stats.length > 0) {
        const firstStat = stats[0];
        expect(firstStat).toHaveProperty("axisId");
        expect(firstStat).toHaveProperty("titleFr");
        expect(firstStat).toHaveProperty("color");
        expect(firstStat).toHaveProperty("totalCount");
        expect(firstStat).toHaveProperty("entityCounts");
      }
    });

    it("should include all 6 axis IDs", async () => {
      const stats = await getAllAxesStats();
      const axisIds = stats.map(s => s.axisId);
      
      expect(axisIds).toContain("AX1_GENOMIC_CONSERVATION");
      expect(axisIds).toContain("AX2_ETHNOBOTANY_COMP");
      expect(axisIds).toContain("AX3_ANALYTICAL_TRANS_EPOCH");
      expect(axisIds).toContain("AX4_CONSERVATION_BIOTECH");
      expect(axisIds).toContain("AX5_IMMERSIVE_DEMOCRAT");
      expect(axisIds).toContain("AX6_OLFACTIVE_DIPLOMACY");
    });

    it("should have numeric totalCount values", async () => {
      const stats = await getAllAxesStats();
      
      for (const stat of stats) {
        expect(typeof stat.totalCount).toBe("number");
        expect(stat.totalCount).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe("getAxisDetail", () => {
    it("should return detailed information for AX1", async () => {
      const detail = await getAxisDetail("AX1_GENOMIC_CONSERVATION");
      
      expect(detail).toBeDefined();
      expect(detail?.axis_id).toBe("AX1_GENOMIC_CONSERVATION");
      expect(detail?.entities).toBeDefined();
    });

    it("should return detailed information for AX2", async () => {
      const detail = await getAxisDetail("AX2_ETHNOBOTANY_COMP");
      
      expect(detail).toBeDefined();
      expect(detail?.axis_id).toBe("AX2_ETHNOBOTANY_COMP");
      expect(detail?.entities).toBeDefined();
    });

    it("should return detailed information for AX3", async () => {
      const detail = await getAxisDetail("AX3_ANALYTICAL_TRANS_EPOCH");
      
      expect(detail).toBeDefined();
      expect(detail?.axis_id).toBe("AX3_ANALYTICAL_TRANS_EPOCH");
      expect(detail?.entities).toBeDefined();
    });

    it("should return null for non-existent axis", async () => {
      const detail = await getAxisDetail("INVALID_AXIS_ID");
      
      expect(detail).toBeNull();
    });

    it("should include parsed JSON fields", async () => {
      const detail = await getAxisDetail("AX1_GENOMIC_CONSERVATION");
      
      if (detail) {
        // These fields should be parsed from JSON
        expect(Array.isArray(detail.kpis) || detail.kpis === null || detail.kpis === undefined).toBe(true);
        expect(Array.isArray(detail.ui_modules) || detail.ui_modules === null || detail.ui_modules === undefined).toBe(true);
      }
    });
  });
});

describe("Genome Samples - Échantillons génomiques (AX1)", () => {
  describe("listGenomeSamples", () => {
    it("should return an array of genome samples", async () => {
      const samples = await listGenomeSamples();
      
      expect(samples).toBeDefined();
      expect(Array.isArray(samples)).toBe(true);
    });

    it("should return samples with required fields", async () => {
      const samples = await listGenomeSamples();
      
      if (samples.length > 0) {
        const firstSample = samples[0];
        expect(firstSample).toHaveProperty("sample_id");
        expect(firstSample).toHaveProperty("plant_latin_name");
        expect(firstSample).toHaveProperty("region");
      }
    });

    it("should filter by region", async () => {
      const samples = await listGenomeSamples({ region: "Grasse" });
      
      expect(Array.isArray(samples)).toBe(true);
      // All returned samples should have the specified region
      for (const sample of samples) {
        expect(sample.region).toBe("Grasse");
      }
    });
  });

  describe("getGenomeSampleById", () => {
    it("should return a specific sample by ID", async () => {
      const samples = await listGenomeSamples();
      
      if (samples.length > 0) {
        const sampleId = samples[0].sample_id;
        const sample = await getGenomeSampleById(sampleId);
        
        expect(sample).toBeDefined();
        expect(sample?.sample_id).toBe(sampleId);
      }
    });

    it("should return null for non-existent sample", async () => {
      const sample = await getGenomeSampleById("NON_EXISTENT_ID");
      
      expect(sample).toBeNull();
    });
  });

  describe("getGenomeSamplesStats", () => {
    it("should return statistics object", async () => {
      const stats = await getGenomeSamplesStats();
      
      expect(stats).toBeDefined();
      expect(stats).toHaveProperty("total");
      expect(stats).toHaveProperty("byRegion");
      expect(stats).toHaveProperty("byMethod");
    });

    it("should have numeric total", async () => {
      const stats = await getGenomeSamplesStats();
      
      expect(typeof stats?.total).toBe("number");
      expect(stats?.total).toBeGreaterThanOrEqual(0);
    });
  });
});

describe("Manuscripts - Manuscrits historiques (AX2)", () => {
  describe("listManuscripts", () => {
    it("should return an array of manuscripts", async () => {
      const manuscripts = await listManuscripts();
      
      expect(manuscripts).toBeDefined();
      expect(Array.isArray(manuscripts)).toBe(true);
    });

    it("should return manuscripts with required fields", async () => {
      const manuscripts = await listManuscripts();
      
      if (manuscripts.length > 0) {
        const firstMs = manuscripts[0];
        expect(firstMs).toHaveProperty("manuscript_id");
        expect(firstMs).toHaveProperty("title");
        expect(firstMs).toHaveProperty("language");
      }
    });
  });

  describe("getManuscriptById", () => {
    it("should return a specific manuscript by ID", async () => {
      const manuscripts = await listManuscripts();
      
      if (manuscripts.length > 0) {
        const msId = manuscripts[0].manuscript_id;
        const manuscript = await getManuscriptById(msId);
        
        expect(manuscript).toBeDefined();
        expect(manuscript?.manuscript_id).toBe(msId);
      }
    });

    it("should return null for non-existent manuscript", async () => {
      const manuscript = await getManuscriptById("NON_EXISTENT_ID");
      
      expect(manuscript).toBeNull();
    });
  });

  describe("getManuscriptsStats", () => {
    it("should return statistics object", async () => {
      const stats = await getManuscriptsStats();
      
      expect(stats).toBeDefined();
      expect(stats).toHaveProperty("total");
      expect(stats).toHaveProperty("byLanguage");
      expect(stats).toHaveProperty("byRegion");
    });
  });
});

describe("GCMS Runs - Analyses GC-MS (AX3)", () => {
  describe("listGcmsRuns", () => {
    it("should return an array of GCMS runs", async () => {
      const runs = await listGcmsRuns();
      
      expect(runs).toBeDefined();
      expect(Array.isArray(runs)).toBe(true);
    });

    it("should return runs with required fields", async () => {
      const runs = await listGcmsRuns();
      
      if (runs.length > 0) {
        const firstRun = runs[0];
        expect(firstRun).toHaveProperty("run_id");
        expect(firstRun).toHaveProperty("method");
        expect(firstRun).toHaveProperty("instrument");
      }
    });
  });

  describe("getGcmsRunById", () => {
    it("should return a specific run by ID", async () => {
      const runs = await listGcmsRuns();
      
      if (runs.length > 0) {
        const runId = runs[0].run_id;
        const run = await getGcmsRunById(runId);
        
        expect(run).toBeDefined();
        expect(run?.run_id).toBe(runId);
      }
    });

    it("should return null for non-existent run", async () => {
      const run = await getGcmsRunById("NON_EXISTENT_ID");
      
      expect(run).toBeNull();
    });
  });

  describe("getGcmsRunsStats", () => {
    it("should return statistics object", async () => {
      const stats = await getGcmsRunsStats();
      
      expect(stats).toBeDefined();
      expect(stats).toHaveProperty("total");
      expect(stats).toHaveProperty("byMethod");
      expect(stats).toHaveProperty("topCompounds");
    });

    it("should have numeric total", async () => {
      const stats = await getGcmsRunsStats();
      
      expect(typeof stats?.total).toBe("number");
      expect(stats?.total).toBeGreaterThanOrEqual(0);
    });
  });
});
