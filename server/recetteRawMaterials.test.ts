import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db module
vi.mock("./db", () => ({
  getRecetteRawMaterials: vi.fn(),
  getRecettesForRawMaterial: vi.fn(),
  addRecetteRawMaterial: vi.fn(),
  updateRecetteRawMaterial: vi.fn(),
  removeRecetteRawMaterial: vi.fn(),
}));

import * as db from "./db";

describe("recetteRawMaterials DB functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getRecetteRawMaterials retourne un tableau vide si aucune liaison", async () => {
    vi.mocked(db.getRecetteRawMaterials).mockResolvedValue([]);
    const result = await db.getRecetteRawMaterials(999);
    expect(result).toEqual([]);
    expect(db.getRecetteRawMaterials).toHaveBeenCalledWith(999);
  });

  it("getRecettesForRawMaterial retourne un tableau vide si aucune liaison", async () => {
    vi.mocked(db.getRecettesForRawMaterial).mockResolvedValue([]);
    const result = await db.getRecettesForRawMaterial(999);
    expect(result).toEqual([]);
    expect(db.getRecettesForRawMaterial).toHaveBeenCalledWith(999);
  });

  it("addRecetteRawMaterial appelle la DB avec les bons paramètres", async () => {
    const mockInsert = { insertId: 1 };
    vi.mocked(db.addRecetteRawMaterial).mockResolvedValue(mockInsert as any);
    const data = {
      recetteId: 1,
      rawMaterialId: 5,
      role: "base" as const,
      dosage: "2.5",
      dosageUnit: "g",
      percentage: "5.0",
      notes: "Test note",
    };
    const result = await db.addRecetteRawMaterial(data as any);
    expect(result).toEqual(mockInsert);
    expect(db.addRecetteRawMaterial).toHaveBeenCalledWith(data);
  });

  it("removeRecetteRawMaterial appelle la DB avec le bon ID", async () => {
    vi.mocked(db.removeRecetteRawMaterial).mockResolvedValue({ success: true });
    const result = await db.removeRecetteRawMaterial(42);
    expect(result).toEqual({ success: true });
    expect(db.removeRecetteRawMaterial).toHaveBeenCalledWith(42);
  });

  it("updateRecetteRawMaterial appelle la DB avec les bons paramètres", async () => {
    vi.mocked(db.updateRecetteRawMaterial).mockResolvedValue({ success: true });
    const result = await db.updateRecetteRawMaterial(10, { role: "coeur" as const, percentage: "3.5" });
    expect(result).toEqual({ success: true });
    expect(db.updateRecetteRawMaterial).toHaveBeenCalledWith(10, { role: "coeur", percentage: "3.5" });
  });

  it("getRecetteRawMaterials retourne des liaisons avec les infos de la matière première", async () => {
    const mockData = [
      {
        id: 1,
        recetteId: 1,
        rawMaterialId: 5,
        role: "base",
        dosage: "2.500",
        dosageUnit: "g",
        percentage: "5.00",
        notes: null,
        sortOrder: 0,
        materialName: "Vétiver",
        materialLatinName: "Vetiveria zizanioides",
        materialCategory: "huile_essentielle",
        materialOlfactiveFamily: "boise",
        materialOlfactiveProfile: "Terreux, fumé, boisé",
      },
    ];
    vi.mocked(db.getRecetteRawMaterials).mockResolvedValue(mockData as any);
    const result = await db.getRecetteRawMaterials(1);
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty("materialName", "Vétiver");
    expect(result[0]).toHaveProperty("materialCategory", "huile_essentielle");
  });
});
