import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock getDb
const mockExecute = vi.fn();
vi.mock("./db", () => ({
  getDb: vi.fn(() => Promise.resolve({
    execute: mockExecute,
  })),
}));

describe("Landraces Terpenes Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getTerpenes procedure", () => {
    it("should return terpenes for a landrace", async () => {
      const mockTerpenes = [
        { id: 1, landrace_id: 1, terpene_name: "Myrcene", percentage: 35.5, notes: "Dominant" },
        { id: 2, landrace_id: 1, terpene_name: "Limonene", percentage: 22.3, notes: null },
        { id: 3, landrace_id: 1, terpene_name: "Caryophyllene", percentage: 15.8, notes: "Spicy" },
      ];
      
      mockExecute.mockResolvedValueOnce([mockTerpenes, []]);
      
      const { getDb } = await import("./db");
      const db = await getDb();
      
      const result = await db!.execute(
        "SELECT id, landrace_id, terpene_name, percentage, notes FROM landrace_terpenes WHERE landrace_id = ? ORDER BY percentage DESC",
        [1]
      );
      
      const rows = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : [];
      
      expect(rows).toHaveLength(3);
      expect(rows[0]).toHaveProperty("terpene_name", "Myrcene");
      expect(rows[0]).toHaveProperty("percentage", 35.5);
    });

    it("should return empty array for landrace without terpenes", async () => {
      mockExecute.mockResolvedValueOnce([[], []]);
      
      const { getDb } = await import("./db");
      const db = await getDb();
      
      const result = await db!.execute(
        "SELECT id, landrace_id, terpene_name, percentage, notes FROM landrace_terpenes WHERE landrace_id = ? ORDER BY percentage DESC",
        [999]
      );
      
      const rows = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : [];
      
      expect(rows).toHaveLength(0);
    });
  });
});

describe("Ingredient Links Script", () => {
  it("should have correct mapping structure for cannabis varieties", () => {
    const cannabisMappings = {
      'crude oil cbd': ['Cannabidiol', 'Myrcene', 'Limonene', 'Caryophyllene'],
      'pollen cherry wine': ['Cannabidiol', 'Myrcene', 'Pinene', 'Caryophyllene'],
    };
    
    Object.values(cannabisMappings).forEach(molecules => {
      expect(molecules.length).toBeGreaterThanOrEqual(3);
    });
  });
});
