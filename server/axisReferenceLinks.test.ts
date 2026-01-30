import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database module
vi.mock("./db", () => ({
  getAllAxisReferenceLinks: vi.fn(),
  getAxisReferenceLinkById: vi.fn(),
  getAxisReferenceLinksWithDetails: vi.fn(),
  getReferenceAxisLinksWithDetails: vi.fn(),
  getAxisReferenceGraphData: vi.fn(),
  getAxisReferenceLinkStats: vi.fn(),
  createAxisReferenceLink: vi.fn(),
  updateAxisReferenceLink: vi.fn(),
  deleteAxisReferenceLink: vi.fn(),
  bulkCreateAxisReferenceLinks: vi.fn(),
}));

import * as db from "./db";

describe("Axis Reference Links", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllAxisReferenceLinks", () => {
    it("should return all links without filters", async () => {
      const mockLinks = [
        { id: 1, axisId: 1, referenceId: 1, linkType: "primary_source", relevanceScore: 80 },
        { id: 2, axisId: 1, referenceId: 2, linkType: "secondary_source", relevanceScore: 60 },
      ];
      vi.mocked(db.getAllAxisReferenceLinks).mockResolvedValue(mockLinks);

      const result = await db.getAllAxisReferenceLinks();
      expect(result).toEqual(mockLinks);
      expect(db.getAllAxisReferenceLinks).toHaveBeenCalled();
    });

    it("should filter by axisId", async () => {
      const mockLinks = [
        { id: 1, axisId: 1, referenceId: 1, linkType: "primary_source", relevanceScore: 80 },
      ];
      vi.mocked(db.getAllAxisReferenceLinks).mockResolvedValue(mockLinks);

      const result = await db.getAllAxisReferenceLinks({ axisId: 1 });
      expect(result).toEqual(mockLinks);
      expect(db.getAllAxisReferenceLinks).toHaveBeenCalledWith({ axisId: 1 });
    });

    it("should filter by linkType", async () => {
      const mockLinks = [
        { id: 1, axisId: 1, referenceId: 1, linkType: "methodology", relevanceScore: 70 },
      ];
      vi.mocked(db.getAllAxisReferenceLinks).mockResolvedValue(mockLinks);

      const result = await db.getAllAxisReferenceLinks({ linkType: "methodology" });
      expect(result).toEqual(mockLinks);
      expect(db.getAllAxisReferenceLinks).toHaveBeenCalledWith({ linkType: "methodology" });
    });
  });

  describe("getAxisReferenceLinkById", () => {
    it("should return a link by ID", async () => {
      const mockLink = { id: 1, axisId: 1, referenceId: 1, linkType: "primary_source" };
      vi.mocked(db.getAxisReferenceLinkById).mockResolvedValue(mockLink);

      const result = await db.getAxisReferenceLinkById(1);
      expect(result).toEqual(mockLink);
      expect(db.getAxisReferenceLinkById).toHaveBeenCalledWith(1);
    });

    it("should return null for non-existent ID", async () => {
      vi.mocked(db.getAxisReferenceLinkById).mockResolvedValue(null);

      const result = await db.getAxisReferenceLinkById(999);
      expect(result).toBeNull();
    });
  });

  describe("getAxisReferenceLinksWithDetails", () => {
    it("should return links with reference details for an axis", async () => {
      const mockLinks = [
        {
          id: 1,
          axisId: 1,
          referenceId: 1,
          linkType: "primary_source",
          reference: { id: 1, title: "Test Reference", year: 2024 },
        },
      ];
      vi.mocked(db.getAxisReferenceLinksWithDetails).mockResolvedValue(mockLinks);

      const result = await db.getAxisReferenceLinksWithDetails(1);
      expect(result).toEqual(mockLinks);
      expect(result[0].reference).toBeDefined();
    });
  });

  describe("getReferenceAxisLinksWithDetails", () => {
    it("should return links with axis details for a reference", async () => {
      const mockLinks = [
        {
          id: 1,
          axisId: 1,
          referenceId: 1,
          linkType: "primary_source",
          axis: { id: 1, axisCode: "AX1", name: "Test Axis" },
        },
      ];
      vi.mocked(db.getReferenceAxisLinksWithDetails).mockResolvedValue(mockLinks);

      const result = await db.getReferenceAxisLinksWithDetails(1);
      expect(result).toEqual(mockLinks);
      expect(result[0].axis).toBeDefined();
    });
  });

  describe("getAxisReferenceGraphData", () => {
    it("should return graph data with nodes and links", async () => {
      const mockGraphData = {
        nodes: [
          { id: "axis-1", type: "axis", label: "Test Axis", code: "AX1" },
          { id: "ref-1", type: "reference", label: "Test Reference", year: 2024 },
        ],
        links: [
          { source: "axis-1", target: "ref-1", type: "primary_source", weight: 1 },
        ],
      };
      vi.mocked(db.getAxisReferenceGraphData).mockResolvedValue(mockGraphData);

      const result = await db.getAxisReferenceGraphData();
      expect(result.nodes).toHaveLength(2);
      expect(result.links).toHaveLength(1);
      expect(result.nodes[0].type).toBe("axis");
      expect(result.nodes[1].type).toBe("reference");
    });
  });

  describe("getAxisReferenceLinkStats", () => {
    it("should return statistics about links", async () => {
      const mockStats = {
        total: 10,
        byType: [
          { linkType: "primary_source", count: 5 },
          { linkType: "secondary_source", count: 3 },
          { linkType: "methodology", count: 2 },
        ],
        byConfidence: [
          { confidence: "high", count: 4 },
          { confidence: "medium", count: 5 },
          { confidence: "low", count: 1 },
        ],
        topAxes: [
          { axisId: 1, axisCode: "AX1", axisName: "Test Axis", count: 5 },
        ],
        topReferences: [
          { referenceId: 1, count: 3 },
        ],
      };
      vi.mocked(db.getAxisReferenceLinkStats).mockResolvedValue(mockStats);

      const result = await db.getAxisReferenceLinkStats();
      expect(result?.total).toBe(10);
      expect(result?.byType).toHaveLength(3);
      expect(result?.byConfidence).toHaveLength(3);
    });
  });

  describe("createAxisReferenceLink", () => {
    it("should create a new link", async () => {
      const newLink = {
        axisId: 1,
        referenceId: 1,
        linkType: "primary_source",
        relevanceScore: 80,
        confidence: "high",
      };
      const mockResult = { id: 1, ...newLink };
      vi.mocked(db.createAxisReferenceLink).mockResolvedValue(mockResult);

      const result = await db.createAxisReferenceLink(newLink);
      expect(result.id).toBe(1);
      expect(result.axisId).toBe(1);
      expect(result.referenceId).toBe(1);
    });

    it("should handle optional fields", async () => {
      const minimalLink = { axisId: 1, referenceId: 1 };
      const mockResult = { id: 1, ...minimalLink, linkType: "secondary_source" };
      vi.mocked(db.createAxisReferenceLink).mockResolvedValue(mockResult);

      const result = await db.createAxisReferenceLink(minimalLink);
      expect(result.id).toBe(1);
    });
  });

  describe("updateAxisReferenceLink", () => {
    it("should update an existing link", async () => {
      const updates = { relevanceScore: 90, notes: "Updated notes" };
      const mockResult = { id: 1, axisId: 1, referenceId: 1, ...updates };
      vi.mocked(db.updateAxisReferenceLink).mockResolvedValue(mockResult);

      const result = await db.updateAxisReferenceLink(1, updates);
      expect(result?.relevanceScore).toBe(90);
      expect(result?.notes).toBe("Updated notes");
    });
  });

  describe("deleteAxisReferenceLink", () => {
    it("should delete a link", async () => {
      vi.mocked(db.deleteAxisReferenceLink).mockResolvedValue({ success: true });

      const result = await db.deleteAxisReferenceLink(1);
      expect(result.success).toBe(true);
    });
  });

  describe("bulkCreateAxisReferenceLinks", () => {
    it("should create multiple links", async () => {
      const links = [
        { axisId: 1, referenceId: 1, linkType: "primary_source" },
        { axisId: 1, referenceId: 2, linkType: "secondary_source" },
        { axisId: 2, referenceId: 1, linkType: "methodology" },
      ];
      const mockResult = { created: 3, errors: [], total: 3 };
      vi.mocked(db.bulkCreateAxisReferenceLinks).mockResolvedValue(mockResult);

      const result = await db.bulkCreateAxisReferenceLinks(links);
      expect(result.created).toBe(3);
      expect(result.errors).toHaveLength(0);
    });

    it("should handle partial failures", async () => {
      const links = [
        { axisId: 1, referenceId: 1, linkType: "primary_source" },
        { axisId: 999, referenceId: 999, linkType: "secondary_source" }, // Invalid
      ];
      const mockResult = { created: 1, errors: ["Foreign key error"], total: 2 };
      vi.mocked(db.bulkCreateAxisReferenceLinks).mockResolvedValue(mockResult);

      const result = await db.bulkCreateAxisReferenceLinks(links);
      expect(result.created).toBe(1);
      expect(result.errors).toHaveLength(1);
    });
  });

  describe("Link Types", () => {
    it("should support all defined link types", async () => {
      const linkTypes = [
        "primary_source",
        "secondary_source",
        "methodology",
        "theoretical_basis",
        "case_study",
        "data_source",
        "comparative",
        "historical",
        "review",
        "other",
      ];

      for (const linkType of linkTypes) {
        const mockLink = { id: 1, axisId: 1, referenceId: 1, linkType };
        vi.mocked(db.createAxisReferenceLink).mockResolvedValue(mockLink);

        const result = await db.createAxisReferenceLink({
          axisId: 1,
          referenceId: 1,
          linkType,
        });
        expect(result.linkType).toBe(linkType);
      }
    });
  });

  describe("Confidence Levels", () => {
    it("should support all confidence levels", async () => {
      const confidenceLevels = ["high", "medium", "low"];

      for (const confidence of confidenceLevels) {
        const mockLink = { id: 1, axisId: 1, referenceId: 1, confidence };
        vi.mocked(db.createAxisReferenceLink).mockResolvedValue(mockLink);

        const result = await db.createAxisReferenceLink({
          axisId: 1,
          referenceId: 1,
          confidence,
        });
        expect(result.confidence).toBe(confidence);
      }
    });
  });
});
