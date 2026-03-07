import { describe, it, expect } from "vitest";

const BASE_URL = "http://localhost:3000/api/trpc";

async function callTRPC(procedure: string, input: unknown) {
  const params = new URLSearchParams({
    input: JSON.stringify({ json: input }),
  });
  const res = await fetch(`${BASE_URL}/${procedure}?${params}`);
  const data = await res.json() as any;
  if (data.error) throw new Error(data.error.json.message);
  return data.result.data.json;
}

describe("rawMaterials.getDetail", () => {
  it("retourne la fiche complète d'une matière première existante (id=1)", async () => {
    const mat = await callTRPC("rawMaterials.getDetail", 1);
    expect(mat).not.toBeNull();
    expect(mat.id).toBe(1);
    expect(mat.name).toBeTruthy();
    expect(mat.category).toBeTruthy();
    expect(Array.isArray(mat.molecules)).toBe(true);
    expect(Array.isArray(mat.recipes)).toBe(true);
  });

  it("retourne null pour un id inexistant", async () => {
    const mat = await callTRPC("rawMaterials.getDetail", 999999);
    expect(mat).toBeNull();
  });

  it("les molécules ont les champs attendus", async () => {
    const mat = await callTRPC("rawMaterials.getDetail", 1);
    if (mat.molecules.length > 0) {
      const mol = mat.molecules[0];
      expect(mol).toHaveProperty("id");
      expect(mol).toHaveProperty("name");
      expect(mol).toHaveProperty("percentage");
    }
  });
});

describe("rawMaterials.getStats — distribution sans 'autre'", () => {
  it("0 entrée 'autre' dans la distribution", async () => {
    const stats = await callTRPC("rawMaterials.getStats", undefined);
    const autreEntry = stats.byCategory.find((c: any) => c.category === "autre");
    expect(autreEntry?.count ?? 0).toBe(0);
  });

  it("les nouvelles catégories sont présentes", async () => {
    const stats = await callTRPC("rawMaterials.getStats", undefined);
    const cats = stats.byCategory.map((c: any) => c.category);
    expect(cats).toContain("molecule_isolee");
    expect(cats).toContain("accord_olfactif");
    expect(cats).toContain("matiere_animale");
  });

  it("total de 372 matières premières", async () => {
    const stats = await callTRPC("rawMaterials.getStats", undefined);
    const total = stats.byCategory.reduce((sum: number, c: any) => sum + Number(c.count), 0);
    expect(total).toBe(372);
  });
});
