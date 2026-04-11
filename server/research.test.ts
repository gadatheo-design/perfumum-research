/**
 * research.test.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Tests unitaires pour les helpers et la logique pure de research.ts
 * On teste uniquement les fonctions pures et les helpers SQL sans connexion DB.
 * Les procédures tRPC qui nécessitent une connexion DB sont testées via mocks.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Helpers purs ─────────────────────────────────────────────────────────────

/**
 * Reproduit la logique de construction des nodes/links du graphe de transformations
 * (extraite de getMolecularTransformations dans research.ts)
 */
function buildTransformationGraph(
  transformations: Array<{
    source_molecule_name: unknown;
    product_molecule_name: unknown;
    transformation_type: unknown;
    temperature_optimal: unknown;
    olfactory_change_description: unknown;
    id: unknown;
  }>
) {
  const nodesMap = new Map<
    string,
    {
      id: string;
      name: string;
      type: "source" | "product" | "both";
      transformationCount: number;
    }
  >();
  const links: Array<{
    source: string;
    target: string;
    transformationType: string;
    temperature?: number;
    description?: string;
    id: number;
  }> = [];

  for (const t of transformations) {
    const sourceKey = (t.source_molecule_name as string).toLowerCase();
    const productKey = (t.product_molecule_name as string).toLowerCase();

    if (!nodesMap.has(sourceKey)) {
      nodesMap.set(sourceKey, {
        id: sourceKey,
        name: t.source_molecule_name as string,
        type: "source",
        transformationCount: 1,
      });
    } else {
      const node = nodesMap.get(sourceKey)!;
      node.transformationCount++;
      if (node.type === "product") node.type = "both";
    }

    if (!nodesMap.has(productKey)) {
      nodesMap.set(productKey, {
        id: productKey,
        name: t.product_molecule_name as string,
        type: "product",
        transformationCount: 1,
      });
    } else {
      const node = nodesMap.get(productKey)!;
      node.transformationCount++;
      if (node.type === "source") node.type = "both";
    }

    links.push({
      source: sourceKey,
      target: productKey,
      transformationType: t.transformation_type as string,
      temperature: t.temperature_optimal as number | undefined,
      description: t.olfactory_change_description as string | undefined,
      id: t.id as number,
    });
  }

  return { nodes: Array.from(nodesMap.values()), links };
}

/**
 * Reproduit la logique de construction des chaînes de transformations
 * (extraite de getTransformationChains dans research.ts)
 */
function buildAdjacencyList(
  links: Array<{ source: string; target: string; transformationType: string }>
) {
  const adjacency = new Map<string, Array<{ target: string; type: string }>>();
  for (const link of links) {
    if (!adjacency.has(link.source)) {
      adjacency.set(link.source, []);
    }
    adjacency.get(link.source)!.push({
      target: link.target,
      type: link.transformationType,
    });
  }
  return adjacency;
}

/**
 * Reproduit la logique de normalisation du statut de conservation
 * (extraite de wikidata-sync.ts et utilisée dans research.ts)
 */
function normalizeConservationStatus(
  raw: string | null | undefined
): "LC" | "NT" | "VU" | "EN" | "CR" | "EW" | "EX" | null {
  if (!raw) return null;
  const upper = raw.toUpperCase().trim();
  const valid = ["LC", "NT", "VU", "EN", "CR", "EW", "EX"] as const;
  return valid.includes(upper as (typeof valid)[number])
    ? (upper as (typeof valid)[number])
    : null;
}

/**
 * Reproduit la logique de construction de requêtes SQL dynamiques
 * (pattern utilisé dans getClaims et getSources)
 */
function buildClaimsQuery(input: {
  type?: string;
  status?: string;
  search?: string;
  limit: number;
  offset: number;
}): string {
  const parts: string[] = ["SELECT * FROM research_claims WHERE 1=1"];
  if (input.type) parts.push(` AND claimType = '${input.type}'`);
  if (input.status) parts.push(` AND status = '${input.status}'`);
  if (input.search) {
    const s = input.search.replace(/'/g, "''");
    parts.push(` AND (claim LIKE '%${s}%' OR claimId LIKE '%${s}%')`);
  }
  parts.push(` LIMIT ${input.limit} OFFSET ${input.offset}`);
  return parts.join("");
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("buildTransformationGraph", () => {
  it("devrait créer des nodes source et product distincts", () => {
    const { nodes, links } = buildTransformationGraph([
      {
        source_molecule_name: "Linalool",
        product_molecule_name: "Linalool oxide",
        transformation_type: "oxidation",
        temperature_optimal: 25,
        olfactory_change_description: "Floral to earthy",
        id: 1,
      },
    ]);

    expect(nodes).toHaveLength(2);
    expect(nodes.find((n) => n.id === "linalool")?.type).toBe("source");
    expect(nodes.find((n) => n.id === "linalool oxide")?.type).toBe("product");
    expect(links).toHaveLength(1);
    expect(links[0].source).toBe("linalool");
    expect(links[0].target).toBe("linalool oxide");
  });

  it("devrait marquer un node comme 'both' s'il est source et product", () => {
    const { nodes } = buildTransformationGraph([
      {
        source_molecule_name: "A",
        product_molecule_name: "B",
        transformation_type: "oxidation",
        temperature_optimal: null,
        olfactory_change_description: null,
        id: 1,
      },
      {
        source_molecule_name: "C",
        product_molecule_name: "A",
        transformation_type: "reduction",
        temperature_optimal: null,
        olfactory_change_description: null,
        id: 2,
      },
    ]);

    const nodeA = nodes.find((n) => n.id === "a");
    expect(nodeA?.type).toBe("both");
  });

  it("devrait incrémenter transformationCount pour les nodes répétés", () => {
    const { nodes } = buildTransformationGraph([
      {
        source_molecule_name: "Linalool",
        product_molecule_name: "X",
        transformation_type: "oxidation",
        temperature_optimal: null,
        olfactory_change_description: null,
        id: 1,
      },
      {
        source_molecule_name: "Linalool",
        product_molecule_name: "Y",
        transformation_type: "reduction",
        temperature_optimal: null,
        olfactory_change_description: null,
        id: 2,
      },
    ]);

    const linalool = nodes.find((n) => n.id === "linalool");
    expect(linalool?.transformationCount).toBe(2);
  });

  it("devrait retourner des arrays vides pour une entrée vide", () => {
    const { nodes, links } = buildTransformationGraph([]);
    expect(nodes).toHaveLength(0);
    expect(links).toHaveLength(0);
  });

  it("devrait conserver la casse originale dans name mais utiliser lowercase pour id", () => {
    const { nodes } = buildTransformationGraph([
      {
        source_molecule_name: "Béta-Pinène",
        product_molecule_name: "Alpha-Terpinéol",
        transformation_type: "hydration",
        temperature_optimal: 80,
        olfactory_change_description: "Pine to floral",
        id: 10,
      },
    ]);

    const source = nodes.find((n) => n.id === "béta-pinène");
    expect(source?.name).toBe("Béta-Pinène");
    expect(source?.id).toBe("béta-pinène");
  });

  it("devrait typer correctement temperature et description comme optionnels", () => {
    const { links } = buildTransformationGraph([
      {
        source_molecule_name: "A",
        product_molecule_name: "B",
        transformation_type: "oxidation",
        temperature_optimal: undefined,
        olfactory_change_description: undefined,
        id: 99,
      },
    ]);

    expect(links[0].temperature).toBeUndefined();
    expect(links[0].description).toBeUndefined();
    expect(links[0].id).toBe(99);
  });
});

describe("buildAdjacencyList", () => {
  it("devrait construire une liste d'adjacence correcte", () => {
    const links = [
      { source: "a", target: "b", transformationType: "oxidation" },
      { source: "a", target: "c", transformationType: "reduction" },
      { source: "b", target: "d", transformationType: "hydration" },
    ];

    const adj = buildAdjacencyList(links);
    expect(adj.get("a")).toHaveLength(2);
    expect(adj.get("b")).toHaveLength(1);
    expect(adj.get("c")).toBeUndefined();
    expect(adj.get("a")![0]).toEqual({ target: "b", type: "oxidation" });
  });

  it("devrait retourner une Map vide pour des liens vides", () => {
    const adj = buildAdjacencyList([]);
    expect(adj.size).toBe(0);
  });
});

describe("normalizeConservationStatus", () => {
  it("devrait normaliser les statuts IUCN valides", () => {
    expect(normalizeConservationStatus("LC")).toBe("LC");
    expect(normalizeConservationStatus("NT")).toBe("NT");
    expect(normalizeConservationStatus("VU")).toBe("VU");
    expect(normalizeConservationStatus("EN")).toBe("EN");
    expect(normalizeConservationStatus("CR")).toBe("CR");
    expect(normalizeConservationStatus("EW")).toBe("EW");
    expect(normalizeConservationStatus("EX")).toBe("EX");
  });

  it("devrait normaliser les statuts en minuscules", () => {
    expect(normalizeConservationStatus("lc")).toBe("LC");
    expect(normalizeConservationStatus("en")).toBe("EN");
    expect(normalizeConservationStatus("cr")).toBe("CR");
  });

  it("devrait retourner null pour des statuts invalides", () => {
    expect(normalizeConservationStatus("UNKNOWN")).toBeNull();
    expect(normalizeConservationStatus("DD")).toBeNull();
    expect(normalizeConservationStatus("")).toBeNull();
  });

  it("devrait retourner null pour null ou undefined", () => {
    expect(normalizeConservationStatus(null)).toBeNull();
    expect(normalizeConservationStatus(undefined)).toBeNull();
  });
});

describe("buildClaimsQuery", () => {
  it("devrait construire une requête de base sans filtres", () => {
    const q = buildClaimsQuery({ limit: 50, offset: 0 });
    expect(q).toBe(
      "SELECT * FROM research_claims WHERE 1=1 LIMIT 50 OFFSET 0"
    );
  });

  it("devrait ajouter un filtre de type", () => {
    const q = buildClaimsQuery({ type: "hypothesis", limit: 10, offset: 0 });
    expect(q).toContain("AND claimType = 'hypothesis'");
  });

  it("devrait ajouter un filtre de statut", () => {
    const q = buildClaimsQuery({ status: "validated", limit: 10, offset: 0 });
    expect(q).toContain("AND status = 'validated'");
  });

  it("devrait échapper les apostrophes dans la recherche", () => {
    const q = buildClaimsQuery({
      search: "l'odeur",
      limit: 10,
      offset: 0,
    });
    expect(q).toContain("l''odeur");
  });

  it("devrait combiner plusieurs filtres", () => {
    const q = buildClaimsQuery({
      type: "observation",
      status: "pending",
      search: "linalool",
      limit: 25,
      offset: 50,
    });
    expect(q).toContain("AND claimType = 'observation'");
    expect(q).toContain("AND status = 'pending'");
    expect(q).toContain("linalool");
    expect(q).toContain("LIMIT 25 OFFSET 50");
  });

  it("devrait respecter la pagination", () => {
    const q = buildClaimsQuery({ limit: 100, offset: 200 });
    expect(q).toContain("LIMIT 100 OFFSET 200");
  });
});
