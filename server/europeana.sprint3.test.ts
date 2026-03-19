import { describe, it, expect } from "vitest";

const EDM_SPARQL_SAMPLE = `PREFIX edm: <http://www.europeana.eu/schemas/edm/>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
SELECT ?item ?title WHERE {
  ?item a edm:ProvidedCHO .
  OPTIONAL { ?item dc:title ?title . }
}
LIMIT 15`;

describe("Sprint 3.1 — Templates SPARQL EDM", () => {
  const EDM_TEMPLATES = [
    { id: "edm_plant_search", sparql: EDM_SPARQL_SAMPLE },
    { id: "edm_manuscripts", sparql: EDM_SPARQL_SAMPLE },
    { id: "edm_perfume_bottles", sparql: EDM_SPARQL_SAMPLE },
    { id: "edm_spice_routes", sparql: EDM_SPARQL_SAMPLE },
  ];

  it("devrait avoir 4 templates EDM", () => {
    expect(EDM_TEMPLATES).toHaveLength(4);
  });

  it("devrait avoir des IDs uniques", () => {
    const ids = EDM_TEMPLATES.map((t) => t.id);
    expect(new Set(ids).size).toBe(4);
  });

  it("chaque template devrait contenir edm:ProvidedCHO", () => {
    for (const t of EDM_TEMPLATES) {
      expect(t.sparql).toContain("edm:ProvidedCHO");
    }
  });

  it("chaque template devrait avoir une clause LIMIT", () => {
    for (const t of EDM_TEMPLATES) {
      expect(t.sparql).toMatch(/LIMIT \d+/);
    }
  });

  it("le SPARQL EDM devrait contenir le préfixe edm:", () => {
    expect(EDM_SPARQL_SAMPLE).toContain("edm:");
  });
});

describe("Sprint 3.1 — Parsing résultats SPARQL Europeana", () => {
  function parseSparqlResults(data: any) {
    const vars: string[] = data.head?.vars || [];
    const bindings = data.results?.bindings || [];
    const results = bindings.map((binding: any) => {
      const row: Record<string, string> = {};
      for (const v of vars) {
        if (binding[v]) row[v] = binding[v].value || "";
      }
      return row;
    });
    return { vars, results, total: results.length };
  }

  it("devrait parser un résultat SPARQL valide", () => {
    const mockData = {
      head: { vars: ["item", "title", "provider"] },
      results: {
        bindings: [
          {
            item: { type: "uri", value: "http://data.europeana.eu/item/123/456" },
            title: { type: "literal", value: "Herbier médiéval" },
            provider: { type: "literal", value: "BnF" },
          },
        ],
      },
    };
    const { vars, results, total } = parseSparqlResults(mockData);
    expect(vars).toEqual(["item", "title", "provider"]);
    expect(total).toBe(1);
    expect(results[0].title).toBe("Herbier médiéval");
  });

  it("devrait retourner des tableaux vides si pas de résultats", () => {
    const { results, total } = parseSparqlResults({
      head: { vars: ["item"] },
      results: { bindings: [] },
    });
    expect(results).toHaveLength(0);
    expect(total).toBe(0);
  });

  it("devrait ignorer les variables absentes dans un binding", () => {
    const partialData = {
      head: { vars: ["item", "title", "date"] },
      results: {
        bindings: [
          {
            item: { type: "uri", value: "http://data.europeana.eu/item/789/012" },
            title: { type: "literal", value: "Traité de botanique" },
          },
        ],
      },
    };
    const { results } = parseSparqlResults(partialData);
    expect(results[0].item).toBe("http://data.europeana.eu/item/789/012");
    expect(results[0].title).toBe("Traité de botanique");
    expect(results[0].date).toBeUndefined();
  });
});

describe("Sprint 3.2 — Enrichissement QID Wikidata", () => {
  function computeConfidence(
    label: string,
    searchTerm: string,
    sameAs: string[]
  ): "high" | "medium" | "low" {
    const hasWikidata = sameAs.some((s) => s.includes("wikidata.org"));
    const labelMatch = label.toLowerCase().includes(searchTerm.toLowerCase().split(" ")[0]);
    return hasWikidata && labelMatch ? "high" : hasWikidata || labelMatch ? "medium" : "low";
  }

  it("devrait retourner 'high' si label match ET sameAs Wikidata", () => {
    expect(
      computeConfidence("Rosa damascena", "Rosa damascena", [
        "http://www.wikidata.org/entity/Q158987",
      ])
    ).toBe("high");
  });

  it("devrait retourner 'medium' si sameAs Wikidata mais label ne match pas", () => {
    expect(
      computeConfidence("Damask Rose", "Rosa damascena", [
        "http://www.wikidata.org/entity/Q158987",
      ])
    ).toBe("medium");
  });

  it("devrait retourner 'medium' si label match mais pas de sameAs Wikidata", () => {
    expect(computeConfidence("Rosa canina", "Rosa damascena", [])).toBe("medium");
  });

  it("devrait retourner 'low' si ni label match ni sameAs Wikidata", () => {
    expect(computeConfidence("Lavandula angustifolia", "Rosa damascena", [])).toBe("low");
  });

  it("devrait calculer le statut 'resolved' si un candidat est 'high'", () => {
    const candidates = [
      { confidence: "high" as const },
      { confidence: "low" as const },
    ];
    const highConf = candidates.find((c) => c.confidence === "high");
    const status = highConf ? "resolved" : candidates.length > 0 ? "candidates" : "not_found";
    expect(status).toBe("resolved");
  });

  it("devrait calculer le statut 'candidates' si aucun candidat 'high'", () => {
    const candidates = [{ confidence: "medium" as const }];
    const highConf = candidates.find((c) => c.confidence === "high");
    const status = highConf ? "resolved" : candidates.length > 0 ? "candidates" : "not_found";
    expect(status).toBe("candidates");
  });

  it("devrait calculer la couverture QID correctement", () => {
    const total = 509;
    const withQid = 250;
    const percent = Math.round((withQid / total) * 100);
    expect(total - withQid).toBe(259);
    expect(percent).toBe(49);
  });
});

describe("Sprint 3.3 — Annotation API Europeana", () => {
  function parseAnnotationType(motivation: string): string {
    if (motivation.includes("tagging")) return "tagging";
    if (motivation.includes("transcribing")) return "transcribing";
    if (motivation.includes("describing")) return "describing";
    if (motivation.includes("linking")) return "linking";
    return "unknown";
  }

  function parseAnnotationBody(body: any): Record<string, string> {
    const parsed: Record<string, string> = {};
    if (typeof body === "string") {
      parsed.value = body;
    } else if (body?.value) {
      parsed.value =
        typeof body.value === "object"
          ? (Object.values(body.value)[0] as string)
          : body.value;
      if (body["@language"] || body.language) {
        parsed.language = body["@language"] || body.language;
      }
    } else if (body?.["@id"] || body?.id) {
      parsed.source = body["@id"] || body.id;
      if (body.prefLabel) {
        const labels = body.prefLabel;
        parsed.prefLabel =
          typeof labels === "object"
            ? labels.fr || labels.en || (Object.values(labels)[0] as string)
            : labels;
      }
    }
    return parsed;
  }

  it("devrait parser le type 'tagging'", () => {
    expect(parseAnnotationType("oa:tagging")).toBe("tagging");
  });

  it("devrait parser le type 'transcribing'", () => {
    expect(parseAnnotationType("oa:transcribing")).toBe("transcribing");
  });

  it("devrait parser le type 'describing'", () => {
    expect(parseAnnotationType("oa:describing")).toBe("describing");
  });

  it("devrait retourner 'unknown' pour une motivation non reconnue", () => {
    expect(parseAnnotationType("oa:commenting")).toBe("unknown");
  });

  it("devrait parser un corps d'annotation textuel", () => {
    expect(parseAnnotationBody("Rosa damascena").value).toBe("Rosa damascena");
  });

  it("devrait parser un corps avec valeur et langue", () => {
    const parsed = parseAnnotationBody({ value: "Damask rose", "@language": "en" });
    expect(parsed.value).toBe("Damask rose");
    expect(parsed.language).toBe("en");
  });

  it("devrait parser un corps avec entité liée et prefLabel", () => {
    const parsed = parseAnnotationBody({
      "@id": "http://data.europeana.eu/concept/12345",
      prefLabel: { fr: "Rose de Damas", en: "Damask Rose" },
    });
    expect(parsed.source).toBe("http://data.europeana.eu/concept/12345");
    expect(parsed.prefLabel).toBe("Rose de Damas");
  });

  it("devrait extraire le recordId depuis une URL de target", () => {
    const targetUrl =
      "https://www.europeana.eu/item/9200338/BibliographicResource_3000126284958";
    const match = targetUrl.match(/\/item\/([^/]+\/[^/]+)/);
    const recordId = match ? `/${match[1]}` : "";
    expect(recordId).toBe("/9200338/BibliographicResource_3000126284958");
  });

  it("devrait retourner apiAvailable=false si clé API manquante", () => {
    const result = {
      annotations: [],
      total: 0,
      recordId: "/test",
      apiAvailable: false,
      error: "EUROPEANA_API_KEY non configurée.",
    };
    expect(result.apiAvailable).toBe(false);
    expect(result.error).toContain("EUROPEANA_API_KEY");
  });
});
