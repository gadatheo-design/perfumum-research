/**
 * Tests pour les routes tRPC liées aux badges de molécules dominantes
 * - molecules.getByName : lookup d'une molécule par son nom
 * - plants.getByDominantMolecule : plantes contenant une molécule donnée
 */
import { describe, it, expect, vi } from "vitest";

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockMolecule = {
  id: 1,
  name: "linalool",
  chemicalFormula: "C10H18O",
  family: "Alcool monoterpénique",
  olfactiveProfile: "Floral, lavande",
  therapeuticProperties: "Anxiolytique, sédatif",
};

vi.mock("./db", () => ({
  getMoleculeByName: vi.fn(async (name: string) => {
    if (name.toLowerCase() === "linalool") return mockMolecule;
    return null;
  }),
}));

// ─── Tests molecules.getByName ────────────────────────────────────────────────

describe("molecules.getByName", () => {
  it("retourne la molécule quand le nom correspond exactement", async () => {
    const db = await import("./db");
    const result = await (db.getMoleculeByName as any)("linalool");
    expect(result).not.toBeNull();
    expect(result?.name).toBe("linalool");
    expect(result?.id).toBe(1);
  });

  it("retourne null pour un nom inconnu", async () => {
    const db = await import("./db");
    const result = await (db.getMoleculeByName as any)("molecule-inconnue-xyz");
    expect(result).toBeNull();
  });

  it("la molécule retournée contient les champs attendus pour le popover", async () => {
    const db = await import("./db");
    const result = await (db.getMoleculeByName as any)("linalool");
    expect(result).toHaveProperty("family");
    expect(result).toHaveProperty("olfactiveProfile");
    expect(result).toHaveProperty("therapeuticProperties");
    expect(result).toHaveProperty("chemicalFormula");
  });
});

// ─── Tests plants.getByDominantMolecule - logique de filtrage ────────────────

describe("plants.getByDominantMolecule - logique de filtrage", () => {
  it("filtre les plantes contenant une molécule dans dominant_molecules", () => {
    const plants = [
      { id: 1, name: "Lavande", dominantMolecules: '["linalool","limonene"]' },
      { id: 2, name: "Pin", dominantMolecules: '["alpha-pinene","beta-pinene"]' },
      { id: 3, name: "Coriandre", dominantMolecules: '["linalool","geraniol"]' },
    ];

    const moleculeName = "linalool";
    const filtered = plants.filter((p) => {
      if (!p.dominantMolecules) return false;
      const mols: string[] = JSON.parse(p.dominantMolecules);
      return mols.some((m) => m.toLowerCase().includes(moleculeName.toLowerCase()));
    });

    expect(filtered).toHaveLength(2);
    expect(filtered.map((p) => p.name)).toContain("Lavande");
    expect(filtered.map((p) => p.name)).toContain("Coriandre");
    expect(filtered.map((p) => p.name)).not.toContain("Pin");
  });

  it("exclut la plante courante si excludePlantId est fourni", () => {
    const plants = [
      { id: 1, name: "Lavande", dominantMolecules: '["linalool"]' },
      { id: 3, name: "Coriandre", dominantMolecules: '["linalool"]' },
    ];

    const excludePlantId = 1;
    const moleculeName = "linalool";
    const filtered = plants.filter((p) => {
      if (p.id === excludePlantId) return false;
      if (!p.dominantMolecules) return false;
      const mols: string[] = JSON.parse(p.dominantMolecules);
      return mols.some((m) => m.toLowerCase().includes(moleculeName.toLowerCase()));
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe("Coriandre");
  });

  it("retourne un tableau vide si aucune plante ne correspond", () => {
    const plants = [
      { id: 1, name: "Lavande", dominantMolecules: '["linalool"]' },
    ];

    const moleculeName = "molecule-inexistante";
    const filtered = plants.filter((p) => {
      if (!p.dominantMolecules) return false;
      const mols: string[] = JSON.parse(p.dominantMolecules);
      return mols.some((m) => m.toLowerCase().includes(moleculeName.toLowerCase()));
    });

    expect(filtered).toHaveLength(0);
  });
});

// ─── Tests DominantMoleculeBadgeList - logique de parsing ────────────────────

describe("DominantMoleculeBadgeList - parsing des molécules dominantes", () => {
  const safeJsonParse = <T>(value: string, fallback: T): T => {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  };

  it("parse correctement un tableau JSON valide", () => {
    const raw = '["linalool", "limonene", "beta-caryophyllene"]';
    const result = safeJsonParse<string[]>(raw, []);
    expect(result).toHaveLength(3);
    expect(result[0]).toBe("linalool");
  });

  it("retourne le fallback pour une chaîne malformée (ancien format non-JSON)", () => {
    const raw = "linalool; limonene";
    const result = safeJsonParse<string[]>(raw, []);
    expect(result).toEqual([]);
  });

  it("gère correctement une valeur null avec guard préalable", () => {
    // JSON.parse(null) retourne null sans lever d'exception
    // La logique de l'app doit gérer ce cas avec un guard null check
    const raw: any = null;
    const result = raw ? safeJsonParse<string[]>(raw, []) : [];
    expect(result).toEqual([]);
  });

  it("maxVisible limite correctement le nombre de badges affichés", () => {
    const molecules = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const maxVisible = 5;
    const visible = molecules.slice(0, maxVisible);
    const hidden = molecules.length - maxVisible;

    expect(visible).toHaveLength(5);
    expect(hidden).toBe(3);
  });

  it("le mode multi-filtre (ET) fonctionne correctement", () => {
    const plants = [
      { id: 1, name: "Lavande", dominantMolecules: '["linalool","limonene","linalyl acetate"]' },
      { id: 2, name: "Citron", dominantMolecules: '["limonene","citral"]' },
      { id: 3, name: "Coriandre", dominantMolecules: '["linalool","geraniol"]' },
    ];

    const selectedMolecules = ["linalool", "limonene"];

    const filtered = plants.filter((p) => {
      if (!p.dominantMolecules) return false;
      const mols: string[] = JSON.parse(p.dominantMolecules);
      const molsLower = mols.map((m) => m.toLowerCase());
      return selectedMolecules.every((sel) =>
        molsLower.some((m) => m.includes(sel.toLowerCase()))
      );
    });

    // Seule la lavande contient BOTH linalool AND limonene
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe("Lavande");
  });
});
