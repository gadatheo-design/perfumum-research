/**
 * Tests Vitest pour les fonctions pures de moleculeManager.ts
 * Couvre : normalizeDuplicateGroup, buildGenealogyGraph, buildRelationRow
 */

import { describe, it, expect } from "vitest";
import {
  normalizeDuplicateGroup,
  buildGenealogyGraph,
  buildRelationRow,
  type SqlRow,
} from "./routers/moleculeManager";

// ─────────────────────────────────────────────────────────────────────────────
// normalizeDuplicateGroup
// ─────────────────────────────────────────────────────────────────────────────

describe("normalizeDuplicateGroup", () => {
  it("parse correctement un groupe avec 2 doublons", () => {
    const row: SqlRow = {
      nameNormalized: "linalool",
      count: "2",
      ids: "1,2",
      names: "Linalool,linalool",
    };
    const result = normalizeDuplicateGroup(row);
    expect(result.nameNormalized).toBe("linalool");
    expect(result.count).toBe(2);
    expect(result.ids).toEqual([1, 2]);
    expect(result.molecules).toEqual([
      { id: 1, name: "Linalool" },
      { id: 2, name: "linalool" },
    ]);
  });

  it("parse correctement un groupe avec 3 doublons", () => {
    const row: SqlRow = {
      nameNormalized: "geraniol",
      count: "3",
      ids: "10,11,12",
      names: "Geraniol,GERANIOL,geraniol",
    };
    const result = normalizeDuplicateGroup(row);
    expect(result.count).toBe(3);
    expect(result.ids).toEqual([10, 11, 12]);
    expect(result.molecules).toHaveLength(3);
    expect(result.molecules[2]).toEqual({ id: 12, name: "geraniol" });
  });

  it("gère un nom manquant dans names (fallback '')", () => {
    const row: SqlRow = {
      nameNormalized: "eugenol",
      count: "2",
      ids: "5,6",
      names: "Eugenol",  // seulement 1 nom pour 2 ids
    };
    const result = normalizeDuplicateGroup(row);
    expect(result.molecules[0].name).toBe("Eugenol");
    expect(result.molecules[1].name).toBe("");  // fallback
  });

  it("convertit count en nombre même si c'est une string", () => {
    const row: SqlRow = { nameNormalized: "x", count: "5", ids: "1", names: "X" };
    expect(normalizeDuplicateGroup(row).count).toBe(5);
    expect(typeof normalizeDuplicateGroup(row).count).toBe("number");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildGenealogyGraph
// ─────────────────────────────────────────────────────────────────────────────

describe("buildGenealogyGraph", () => {
  const plantMap = new Map([
    [1, { name: "Rosa damascena", category: "floral" }],
    [2, { name: "Rosa gallica", category: "floral" }],
    [3, { name: "Rosa centifolia", category: "floral" }],
  ]);

  it("crée un nœud root pour varietyId", () => {
    const { nodes } = buildGenealogyGraph(1, [], [], plantMap);
    expect(nodes).toHaveLength(1);
    expect(nodes[0]).toEqual({ id: "1", label: "Rosa damascena", type: "root", category: "floral" });
  });

  it("crée des nœuds ancestor depuis asChild rows", () => {
    const ancestors: SqlRow[] = [
      { variety_id: 1, parent_variety_id: 2, relationship_type: "parent", breeder: null, notes: null },
    ];
    const { nodes } = buildGenealogyGraph(1, ancestors, [], plantMap);
    const rootNode = nodes.find(n => n.id === "1");
    const ancestorNode = nodes.find(n => n.id === "2");
    expect(rootNode?.type).toBe("root");
    expect(ancestorNode?.type).toBe("ancestor");
    expect(ancestorNode?.label).toBe("Rosa gallica");
  });

  it("crée des nœuds descendant depuis asParent rows", () => {
    const descendants: SqlRow[] = [
      { variety_id: 3, parent_variety_id: 1, relationship_type: "parent", breeder: null, notes: null },
    ];
    const { nodes } = buildGenealogyGraph(1, [], descendants, plantMap);
    const descendantNode = nodes.find(n => n.id === "3");
    expect(descendantNode?.type).toBe("descendant");
    expect(descendantNode?.label).toBe("Rosa centifolia");
  });

  it("déduplique les liens (même paire parent-enfant dans ancestors et descendants)", () => {
    const ancestors: SqlRow[] = [
      { variety_id: 1, parent_variety_id: 2, relationship_type: "parent", breeder: null, notes: null },
    ];
    const descendants: SqlRow[] = [
      { variety_id: 1, parent_variety_id: 2, relationship_type: "parent", breeder: null, notes: null },
    ];
    const { links } = buildGenealogyGraph(1, ancestors, descendants, plantMap);
    // Le même lien 2→1 ne doit apparaître qu'une fois
    expect(links).toHaveLength(1);
    expect(links[0]).toMatchObject({ source: "2", target: "1" });
  });

  it("utilise 'parent' comme type de lien par défaut si relationship_type est null", () => {
    const ancestors: SqlRow[] = [
      { variety_id: 1, parent_variety_id: 2, relationship_type: null, breeder: null, notes: null },
    ];
    const { links } = buildGenealogyGraph(1, ancestors, [], plantMap);
    expect(links[0].type).toBe("parent");
  });

  it("utilise le relationship_type fourni si présent", () => {
    const ancestors: SqlRow[] = [
      { variety_id: 1, parent_variety_id: 2, relationship_type: "hybrid", breeder: "Dupont", notes: "Croisement 1920" },
    ];
    const { links } = buildGenealogyGraph(1, ancestors, [], plantMap);
    expect(links[0].type).toBe("hybrid");
    expect(links[0].breeder).toBe("Dupont");
    expect(links[0].notes).toBe("Croisement 1920");
  });

  it("utilise un label fallback si la plante n'est pas dans plantMap", () => {
    const ancestors: SqlRow[] = [
      { variety_id: 1, parent_variety_id: 99, relationship_type: "parent", breeder: null, notes: null },
    ];
    const { nodes } = buildGenealogyGraph(1, ancestors, [], plantMap);
    const unknownNode = nodes.find(n => n.id === "99");
    expect(unknownNode?.label).toBe("Plante #99");
    expect(unknownNode?.category).toBe("");
  });

  it("gère le cas sans ancêtres ni descendants (nœud root seul)", () => {
    const { nodes, links } = buildGenealogyGraph(42, [], [], new Map());
    expect(nodes).toHaveLength(1);
    expect(nodes[0].type).toBe("root");
    expect(links).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildRelationRow
// ─────────────────────────────────────────────────────────────────────────────

describe("buildRelationRow", () => {
  it("mappe correctement une ligne complète", () => {
    const row: SqlRow = {
      plant_id: 1,
      molecule_id: 10,
      plant_name: "Rosa damascena",
      plant_scientific_name: "Rosa damascena Mill.",
      molecule_name: "Linalool",
      molecule_cas: "78-70-6",
      percentage: "12.5",
      percentage_min: "10.0",
      percentage_max: "15.0",
      percentage_typical: "12.5",
      source: "GC/MS 2023",
    };
    const result = buildRelationRow(row);
    expect(result.plant_id).toBe(1);
    expect(result.molecule_id).toBe(10);
    expect(result.plant_name).toBe("Rosa damascena");
    expect(result.plant_scientific_name).toBe("Rosa damascena Mill.");
    expect(result.molecule_name).toBe("Linalool");
    expect(result.molecule_cas).toBe("78-70-6");
    expect(result.percentage).toBe(12.5);
    expect(result.percentage_min).toBe(10.0);
    expect(result.percentage_max).toBe(15.0);
    expect(result.percentage_typical).toBe(12.5);
    expect(result.source).toBe("GC/MS 2023");
  });

  it("retourne null pour les champs optionnels absents", () => {
    const row: SqlRow = {
      plant_id: 2,
      molecule_id: 20,
      plant_name: "Lavandula angustifolia",
      plant_scientific_name: null,
      molecule_name: "Linalyl acetate",
      molecule_cas: null,
      percentage: null,
      percentage_min: null,
      percentage_max: null,
      percentage_typical: null,
      source: null,
    };
    const result = buildRelationRow(row);
    expect(result.plant_scientific_name).toBeNull();
    expect(result.molecule_cas).toBeNull();
    expect(result.percentage).toBeNull();
    expect(result.percentage_min).toBeNull();
    expect(result.percentage_max).toBeNull();
    expect(result.percentage_typical).toBeNull();
    expect(result.source).toBeNull();
  });

  it("convertit les IDs en nombres même si fournis comme strings", () => {
    const row: SqlRow = {
      plant_id: "5",
      molecule_id: "50",
      plant_name: "Jasmin",
      molecule_name: "Benzyl acetate",
    };
    const result = buildRelationRow(row);
    expect(result.plant_id).toBe(5);
    expect(result.molecule_id).toBe(50);
    expect(typeof result.plant_id).toBe("number");
    expect(typeof result.molecule_id).toBe("number");
  });

  it("retourne '' pour plant_name absent", () => {
    const row: SqlRow = { plant_id: 1, molecule_id: 1, molecule_name: "X" };
    const result = buildRelationRow(row);
    expect(result.plant_name).toBe("");
    expect(result.molecule_name).toBe("X");
  });

  it("convertit percentage en nombre si fourni comme string", () => {
    const row: SqlRow = {
      plant_id: 1, molecule_id: 1, plant_name: "P", molecule_name: "M",
      percentage: "0.5",
    };
    const result = buildRelationRow(row);
    expect(result.percentage).toBe(0.5);
    expect(typeof result.percentage).toBe("number");
  });
});
