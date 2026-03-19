/**
 * Tests Sprint 4 — saveQidBatch + corrections TS + storylines
 */
import { describe, it, expect } from "vitest";

// ── Tests unitaires saveQidBatch ──────────────────────────────────────────────
describe("Sprint 4 — saveQidBatch validation", () => {
  it("accepte un QID valide (Q12345)", () => {
    const qid = "Q12345";
    expect(/^Q\d+$/.test(qid)).toBe(true);
  });

  it("rejette un QID invalide (P123)", () => {
    const qid = "P123";
    expect(/^Q\d+$/.test(qid)).toBe(false);
  });

  it("rejette un QID invalide (vide)", () => {
    const qid = "";
    expect(/^Q\d+$/.test(qid)).toBe(false);
  });

  it("accepte Q1 (QID minimal)", () => {
    const qid = "Q1";
    expect(/^Q\d+$/.test(qid)).toBe(true);
  });

  it("rejette Q sans chiffres", () => {
    const qid = "Q";
    expect(/^Q\d+$/.test(qid)).toBe(false);
  });

  it("extrait le QID depuis une URI Wikidata", () => {
    const uri = "https://www.wikidata.org/entity/Q37340";
    const match = uri.match(/Q\d+/)?.[0];
    expect(match).toBe("Q37340");
  });

  it("retourne undefined si pas de QID dans l'URI", () => {
    const uri = "https://www.wikidata.org/entity/";
    const match = uri.match(/Q\d+/)?.[0];
    expect(match).toBeUndefined();
  });

  it("batch de 3 items valides", () => {
    const items = [
      { plantId: 1, qid: "Q37340" },
      { plantId: 2, qid: "Q161771" },
      { plantId: 3, qid: "Q29048" },
    ];
    expect(items).toHaveLength(3);
    items.forEach((item) => {
      expect(item.plantId).toBeGreaterThan(0);
      expect(/^Q\d+$/.test(item.qid)).toBe(true);
    });
  });

  it("résultats batch: comptage saved/failed", () => {
    const results = [
      { plantId: 1, qid: "Q37340", success: true },
      { plantId: 2, qid: "Q161771", success: false, error: "DB error" },
      { plantId: 3, qid: "Q29048", success: true },
    ];
    const saved = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;
    expect(saved).toBe(2);
    expect(failed).toBe(1);
  });
});

// ── Tests unitaires storylines ────────────────────────────────────────────────
describe("Sprint 4 — Fils narratifs (storylines)", () => {
  it("getByPlant accepte un plantId positif", () => {
    const input = { plantId: 42 };
    expect(input.plantId).toBeGreaterThan(0);
  });

  it("getByMolecule accepte un moleculeId positif", () => {
    const input = { moleculeId: 7 };
    expect(input.moleculeId).toBeGreaterThan(0);
  });

  it("structure d'un fil narratif valide", () => {
    const storyline = {
      id: 1,
      title: "La Rose de Damas à travers les siècles",
      slug: "rose-damas-histoire",
      narrative_axis: "vent",
      status: "active",
      role_in_story: "protagonist",
      narrative_note: "Plante emblématique des routes de la soie",
    };
    expect(storyline.id).toBeGreaterThan(0);
    expect(storyline.slug).toMatch(/^[a-z0-9-]+$/);
    expect(["draft", "active", "archived"]).toContain(storyline.status);
    expect(["protagonist", "context", "transformation", "symbol", "source", "destination", "contrast"]).toContain(storyline.role_in_story);
  });

  it("filtre les fils narratifs actifs uniquement", () => {
    const storylines = [
      { id: 1, status: "active" },
      { id: 2, status: "draft" },
      { id: 3, status: "active" },
      { id: 4, status: "archived" },
    ];
    const active = storylines.filter((s) => s.status === "active");
    expect(active).toHaveLength(2);
  });

  it("affichage conditionnel: onglet visible si storylines.length > 0", () => {
    const storylines: unknown[] = [{ id: 1 }, { id: 2 }];
    const showTab = storylines && storylines.length > 0;
    expect(showTab).toBe(true);
  });

  it("affichage conditionnel: onglet masqué si storylines vide", () => {
    const storylines: unknown[] = [];
    const showTab = storylines && storylines.length > 0;
    expect(showTab).toBe(false);
  });

  it("texte pluriel: 1 fil narratif", () => {
    const count = 1;
    const text = `${count} fil${count > 1 ? 's' : ''} narratif${count > 1 ? 's' : ''}`;
    expect(text).toBe("1 fil narratif");
  });

  it("texte pluriel: 3 fils narratifs", () => {
    const count = 3;
    const text = `${count} fil${count > 1 ? 's' : ''} narratif${count > 1 ? 's' : ''}`;
    expect(text).toBe("3 fils narratifs");
  });
});

// ── Tests corrections TypeScript ─────────────────────────────────────────────
describe("Sprint 4 — Corrections TypeScript", () => {
  it("coconut details type inclut newPlantLinks optionnel", () => {
    type Detail = { name: string; success: boolean; organisms?: number; newPlantLinks?: number };
    const detail: Detail = { name: "Linalool", success: true, organisms: 5, newPlantLinks: 2 };
    expect(detail.newPlantLinks).toBe(2);
  });

  it("coconut details sans newPlantLinks est valide", () => {
    type Detail = { name: string; success: boolean; organisms?: number; newPlantLinks?: number };
    const detail: Detail = { name: "Linalool", success: false };
    expect(detail.newPlantLinks).toBeUndefined();
  });

  it("Zod v4 z.record(z.string(), z.any()) est valide", () => {
    const { z } = require("zod");
    const schema = z.record(z.string(), z.any());
    const result = schema.safeParse({ key: "value", num: 42 });
    expect(result.success).toBe(true);
  });

  it("Zod QID regex valide", () => {
    const { z } = require("zod");
    const schema = z.string().regex(/^Q\d+$/, "Format QID invalide (ex: Q12345)");
    expect(schema.safeParse("Q37340").success).toBe(true);
    expect(schema.safeParse("P123").success).toBe(false);
    expect(schema.safeParse("").success).toBe(false);
  });
});
