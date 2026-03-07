/**
 * Tests pour les nouvelles fonctionnalités rawMaterials :
 * - getFiltered avec categories[] (filtrage multi-catégories)
 * - update (mise à jour plantId, terroirId, etc.)
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock du module db ────────────────────────────────────────────────────────
vi.mock("./db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    getRawMaterialsFiltered: vi.fn(),
    getRawMaterialsStats: vi.fn(),
    updateRawMaterial: vi.fn(),
  };
});

import * as db from "./db";

// ─── Tests getRawMaterialsFiltered avec categories[] ─────────────────────────
describe("getRawMaterialsFiltered — filtrage multi-catégories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("accepte un tableau de catégories et retourne les items filtrés", async () => {
    const mockResult = {
      items: [
        { id: 1, name: "Benzoin Siam", category: "resinoid" },
        { id: 2, name: "Labdanum", category: "oleoresine" },
        { id: 3, name: "Tolu Balsam", category: "resinoid" },
      ],
      total: 3,
      page: 1,
      totalPages: 1,
    };
    (db.getRawMaterialsFiltered as any).mockResolvedValue(mockResult);

    const result = await db.getRawMaterialsFiltered({
      categories: ["resinoid", "oleoresine", "infusion", "maceration", "teinture"],
      page: 1,
      limit: 24,
    });

    expect(result.items).toHaveLength(3);
    expect(result.total).toBe(3);
    expect(db.getRawMaterialsFiltered).toHaveBeenCalledWith({
      categories: ["resinoid", "oleoresine", "infusion", "maceration", "teinture"],
      page: 1,
      limit: 24,
    });
  });

  it("retourne tous les items quand aucun filtre n'est appliqué", async () => {
    const mockResult = { items: [], total: 372, page: 1, totalPages: 16 };
    (db.getRawMaterialsFiltered as any).mockResolvedValue(mockResult);

    const result = await db.getRawMaterialsFiltered({ page: 1, limit: 24 });
    expect(result.total).toBe(372);
  });

  it("supporte le filtrage par catégorie unique (rétrocompatibilité)", async () => {
    const mockResult = {
      items: [{ id: 5, name: "Lavender HE", category: "huile_essentielle" }],
      total: 1,
      page: 1,
      totalPages: 1,
    };
    (db.getRawMaterialsFiltered as any).mockResolvedValue(mockResult);

    const result = await db.getRawMaterialsFiltered({
      category: "huile_essentielle",
      page: 1,
      limit: 24,
    });

    expect(result.items[0].category).toBe("huile_essentielle");
  });

  it("supporte la recherche textuelle combinée avec categories[]", async () => {
    const mockResult = {
      items: [{ id: 10, name: "Benzoin Siam", category: "resinoid" }],
      total: 1,
      page: 1,
      totalPages: 1,
    };
    (db.getRawMaterialsFiltered as any).mockResolvedValue(mockResult);

    const result = await db.getRawMaterialsFiltered({
      search: "benzoin",
      categories: ["resinoid", "oleoresine"],
      page: 1,
      limit: 24,
    });

    expect(result.items[0].name).toBe("Benzoin Siam");
  });
});

// ─── Tests updateRawMaterial ──────────────────────────────────────────────────
describe("updateRawMaterial — mise à jour des liaisons", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("met à jour le plantId d'une matière première", async () => {
    const updated = { id: 1, name: "Benzoin Siam", plantId: 42, terroirId: null };
    (db.updateRawMaterial as any).mockResolvedValue(updated);

    const result = await db.updateRawMaterial(1, { plantId: 42 });
    expect(result.plantId).toBe(42);
    expect(db.updateRawMaterial).toHaveBeenCalledWith(1, { plantId: 42 });
  });

  it("met à jour le terroirId d'une matière première", async () => {
    const updated = { id: 1, name: "Benzoin Siam", plantId: 42, terroirId: 7 };
    (db.updateRawMaterial as any).mockResolvedValue(updated);

    const result = await db.updateRawMaterial(1, { terroirId: 7 });
    expect(result.terroirId).toBe(7);
  });

  it("permet de délier une plante (plantId: null)", async () => {
    const updated = { id: 1, name: "Benzoin Siam", plantId: null, terroirId: null };
    (db.updateRawMaterial as any).mockResolvedValue(updated);

    const result = await db.updateRawMaterial(1, { plantId: null });
    expect(result.plantId).toBeNull();
  });

  it("met à jour plusieurs champs en une seule mutation", async () => {
    const updated = {
      id: 1,
      name: "Benzoin Siam",
      category: "resinoid",
      olfactiveFamily: "balsamique",
      originCountry: "Laos",
      plantId: 42,
      terroirId: 7,
    };
    (db.updateRawMaterial as any).mockResolvedValue(updated);

    const result = await db.updateRawMaterial(1, {
      category: "resinoid" as any,
      olfactiveFamily: "balsamique" as any,
      originCountry: "Laos",
      plantId: 42,
      terroirId: 7,
    });

    expect(result.category).toBe("resinoid");
    expect(result.olfactiveFamily).toBe("balsamique");
    expect(result.originCountry).toBe("Laos");
    expect(result.plantId).toBe(42);
    expect(result.terroirId).toBe(7);
  });
});
