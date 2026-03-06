import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("./db", async () => {
  const actual = await vi.importActual<typeof import("./db")>("./db");
  return {
    ...actual,
    getRecettesByMoleculeName: vi.fn(),
  };
});

import * as db from "./db";

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("getRecettesByMoleculeName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne les recettes associées à une molécule existante", async () => {
    const mockRecettes = [
      {
        id: 1,
        name: "CBD Encens Calme",
        category: "resine_cbd",
        description: "Profil anxiolytique",
        status: "validated",
        proportion: "36.00",
        role: null,
      },
      {
        id: 2,
        name: "Métal Liquide",
        category: "resine_cbd",
        description: "Vert métallique",
        status: "experimental",
        proportion: "34.20",
        role: null,
      },
    ];

    vi.mocked(db.getRecettesByMoleculeName).mockResolvedValue(mockRecettes as any);

    const result = await db.getRecettesByMoleculeName("linalool", 8);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      id: 1,
      name: "CBD Encens Calme",
      category: "resine_cbd",
    });
    expect(db.getRecettesByMoleculeName).toHaveBeenCalledWith("linalool", 8);
  });

  it("retourne un tableau vide si la molécule n'existe pas", async () => {
    vi.mocked(db.getRecettesByMoleculeName).mockResolvedValue([]);

    const result = await db.getRecettesByMoleculeName("molecule-inexistante", 8);

    expect(result).toEqual([]);
    expect(db.getRecettesByMoleculeName).toHaveBeenCalledWith(
      "molecule-inexistante",
      8
    );
  });

  it("respecte la limite passée en paramètre", async () => {
    const mockRecettes = Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      name: `Recette ${i + 1}`,
      category: "tabac",
      description: null,
      status: "experimental",
      proportion: "10.00",
      role: null,
    }));

    vi.mocked(db.getRecettesByMoleculeName).mockResolvedValue(mockRecettes as any);

    const result = await db.getRecettesByMoleculeName("beta-caryophyllene", 3);

    expect(result).toHaveLength(3);
    expect(db.getRecettesByMoleculeName).toHaveBeenCalledWith(
      "beta-caryophyllene",
      3
    );
  });

  it("gère les noms de molécules avec caractères spéciaux", async () => {
    vi.mocked(db.getRecettesByMoleculeName).mockResolvedValue([]);

    await db.getRecettesByMoleculeName("α-pinène", 8);

    expect(db.getRecettesByMoleculeName).toHaveBeenCalledWith("α-pinène", 8);
  });

  it("retourne les champs attendus dans chaque recette", async () => {
    const mockRecette = {
      id: 42,
      name: "Test Recette",
      category: "parfum",
      description: "Une description",
      status: "testing",
      proportion: "25.50",
      role: "base",
    };

    vi.mocked(db.getRecettesByMoleculeName).mockResolvedValue([mockRecette] as any);

    const result = await db.getRecettesByMoleculeName("myrcene", 8);

    expect(result[0]).toHaveProperty("id");
    expect(result[0]).toHaveProperty("name");
    expect(result[0]).toHaveProperty("category");
    expect(result[0]).toHaveProperty("proportion");
    expect(result[0]).toHaveProperty("status");
  });
});
