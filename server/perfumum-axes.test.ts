import { describe, it, expect } from "vitest";
import { 
  listPerfumumResearchAxes, 
  getPerfumumAxisBySlug,
  getPerfumumAxisByAxisId,
  getPerfumumAxisStats 
} from "./db";

describe("PERFUMUM Research Axes", () => {
  describe("listPerfumumResearchAxes", () => {
    it("should return all 6 research axes", async () => {
      const axes = await listPerfumumResearchAxes();
      expect(axes).toBeDefined();
      expect(Array.isArray(axes)).toBe(true);
      expect(axes.length).toBe(6);
    });

    it("should return axes with required fields", async () => {
      const axes = await listPerfumumResearchAxes();
      const firstAxis = axes[0];
      
      expect(firstAxis).toHaveProperty("id");
      expect(firstAxis).toHaveProperty("axis_id");
      expect(firstAxis).toHaveProperty("slug");
      expect(firstAxis).toHaveProperty("title_fr");
      expect(firstAxis).toHaveProperty("color");
      expect(firstAxis).toHaveProperty("icon");
      expect(firstAxis).toHaveProperty("status");
      expect(firstAxis).toHaveProperty("sort_order");
    });

    it("should return axes in correct order", async () => {
      const axes = await listPerfumumResearchAxes();
      
      // Verify sort order
      for (let i = 0; i < axes.length - 1; i++) {
        expect(axes[i].sort_order).toBeLessThanOrEqual(axes[i + 1].sort_order);
      }
    });

    it("should include all 6 axis IDs", async () => {
      const axes = await listPerfumumResearchAxes();
      const axisIds = axes.map(a => a.axis_id);
      
      expect(axisIds).toContain("AX1_GENOMIC_CONSERVATION");
      expect(axisIds).toContain("AX2_ETHNOBOTANY_COMP");
      expect(axisIds).toContain("AX3_ANALYTICAL_TRANS_EPOCH");
      expect(axisIds).toContain("AX4_CONSERVATION_BIOTECH");
      expect(axisIds).toContain("AX5_IMMERSIVE_DEMOCRAT");
      expect(axisIds).toContain("AX6_OLFACTIVE_DIPLOMACY");
    });
  });

  describe("getPerfumumAxisByAxisId", () => {
    it("should return axis by axis_id", async () => {
      const axis = await getPerfumumAxisByAxisId("AX1_GENOMIC_CONSERVATION");
      
      expect(axis).toBeDefined();
      expect(axis?.axis_id).toBe("AX1_GENOMIC_CONSERVATION");
      expect(axis?.title_fr).toBe("Génomique olfactive et conservation ex-situ");
    });

    it("should return null for non-existent axis_id", async () => {
      const axis = await getPerfumumAxisByAxisId("NON_EXISTENT_AXIS");
      expect(axis).toBeNull();
    });
  });

  describe("getPerfumumAxisBySlug", () => {
    it("should return axis by slug", async () => {
      const axis = await getPerfumumAxisBySlug("genomique-olfactive-conservation");
      
      expect(axis).toBeDefined();
      expect(axis?.slug).toBe("genomique-olfactive-conservation");
      expect(axis?.axis_id).toBe("AX1_GENOMIC_CONSERVATION");
    });

    it("should return null for non-existent slug", async () => {
      const axis = await getPerfumumAxisBySlug("non-existent-slug");
      expect(axis).toBeNull();
    });
  });

  describe("Axis data integrity", () => {
    it("should have valid colors for all axes", async () => {
      const axes = await listPerfumumResearchAxes();
      
      for (const axis of axes) {
        expect(axis.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    });

    it("should have valid status for all axes", async () => {
      const axes = await listPerfumumResearchAxes();
      const validStatuses = ["draft", "mvp", "beta", "stable", "deprecated"];
      
      for (const axis of axes) {
        expect(validStatuses).toContain(axis.status);
      }
    });

    it("should have core_entities array for all axes", async () => {
      const axes = await listPerfumumResearchAxes();
      
      for (const axis of axes) {
        expect(Array.isArray(axis.core_entities)).toBe(true);
        expect(axis.core_entities.length).toBeGreaterThan(0);
      }
    });
  });
});
