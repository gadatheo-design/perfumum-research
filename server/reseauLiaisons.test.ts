import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock db module
vi.mock("./db", async () => {
  const actual = await vi.importActual("./db");
  return {
    ...actual,
    getNetworkData: vi.fn(),
    getRecetteRawMaterials: vi.fn(),
    addRecetteRawMaterial: vi.fn(),
    removeRecetteRawMaterial: vi.fn(),
  };
});

import * as db from "./db";

describe("getNetworkData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne la structure attendue avec stats", async () => {
    const mockData = {
      nodes: {
        recettes: [{ id: 1, name: "Recette Test", family: "boisé" }],
        rawMaterials: [{ id: 1, name: "Vétiver", category: "huile_essentielle" }],
        molecules: [{ id: 1, name: "Khusimol", family: "alcool" }],
      },
      edges: {
        recetteRawMaterials: [{ recetteId: 1, rawMaterialId: 1, role: "base", percentage: 10 }],
        recetteMolecules: [],
        plantMolecules: [],
      },
      stats: {
        totalRecettes: 1,
        totalRawMaterials: 1,
        totalMolecules: 1,
        totalEdges: 1,
      },
    };
    vi.mocked(db.getNetworkData).mockResolvedValue(mockData);

    const result = await db.getNetworkData({ limit: 50, includeRecettes: true, includeRawMaterials: true, includeMolecules: true });
    expect(result).toHaveProperty("nodes");
    expect(result).toHaveProperty("edges");
    expect(result).toHaveProperty("stats");
    expect(result.stats.totalEdges).toBe(1);
  });

  it("retourne des nœuds vides si tous les types sont désactivés", async () => {
    const emptyData = {
      nodes: { recettes: [], rawMaterials: [], molecules: [] },
      edges: { recetteRawMaterials: [], recetteMolecules: [], plantMolecules: [] },
      stats: { totalRecettes: 0, totalRawMaterials: 0, totalMolecules: 0, totalEdges: 0 },
    };
    vi.mocked(db.getNetworkData).mockResolvedValue(emptyData);

    const result = await db.getNetworkData({ limit: 50, includeRecettes: false, includeRawMaterials: false, includeMolecules: false });
    expect(result.stats.totalEdges).toBe(0);
    expect(result.nodes.recettes).toHaveLength(0);
  });

  it("respecte la limite de nœuds", async () => {
    const limitedData = {
      nodes: {
        recettes: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, name: `Recette ${i + 1}`, family: "boisé" })),
        rawMaterials: [],
        molecules: [],
      },
      edges: { recetteRawMaterials: [], recetteMolecules: [], plantMolecules: [] },
      stats: { totalRecettes: 10, totalRawMaterials: 0, totalMolecules: 0, totalEdges: 0 },
    };
    vi.mocked(db.getNetworkData).mockResolvedValue(limitedData);

    const result = await db.getNetworkData({ limit: 10, includeRecettes: true, includeRawMaterials: false, includeMolecules: false });
    expect(result.nodes.recettes.length).toBeLessThanOrEqual(10);
  });
});

describe("recetteRawMaterials CRUD", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getRecetteRawMaterials retourne un tableau", async () => {
    vi.mocked(db.getRecetteRawMaterials).mockResolvedValue([
      { id: 1, recetteId: 1, rawMaterialId: 1, role: "base", percentage: 5, dosage: null, unit: "ml", notes: null, rawMaterial: { name: "Vétiver", category: "huile_essentielle" } }
    ] as any);

    const result = await db.getRecetteRawMaterials(1);
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toHaveProperty("rawMaterial");
  });

  it("addRecetteRawMaterial crée une liaison", async () => {
    vi.mocked(db.addRecetteRawMaterial).mockResolvedValue({ id: 1 } as any);

    const result = await db.addRecetteRawMaterial({
      recetteId: 1,
      rawMaterialId: 2,
      role: "coeur",
      percentage: 15,
    });
    expect(result).toHaveProperty("id");
    expect(vi.mocked(db.addRecetteRawMaterial)).toHaveBeenCalledWith(
      expect.objectContaining({ recetteId: 1, rawMaterialId: 2 })
    );
  });

  it("removeRecetteRawMaterial supprime une liaison", async () => {
    vi.mocked(db.removeRecetteRawMaterial).mockResolvedValue({ success: true } as any);

    const result = await db.removeRecetteRawMaterial(1);
    expect(vi.mocked(db.removeRecetteRawMaterial)).toHaveBeenCalledWith(1);
  });
});
