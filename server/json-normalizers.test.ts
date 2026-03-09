/**
 * Tests Vitest pour les helpers de normalisation JSON
 * Reproduit fidèlement la logique de asString, asArray, safeReferences
 * définie dans client/src/pages/MoleculeDetail.tsx
 */
import { describe, it, expect } from "vitest";

// ─── Helpers (copie exacte de MoleculeDetail.tsx) ────────────────────────────

/** Convertit un champ DB (null | string | string[] | JSON string) en string propre */
function asString(val: unknown): string {
  if (!val) return "";
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.join(", ");
        if (typeof parsed === "object") return JSON.stringify(parsed);
      } catch { /* ignore */ }
    }
    return val;
  }
  if (Array.isArray(val)) return (val as string[]).filter(Boolean).join(", ");
  return String(val);
}

/** Convertit un champ DB (null | string | string[] | JSON string) en string[] */
function asArray(val: unknown): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return (val as unknown[]).map(String).filter(Boolean);
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
      } catch { /* ignore */ }
    }
    return trimmed ? [trimmed] : [];
  }
  return [String(val)];
}

/** Normalise references — toujours un tableau d'objets valides */
function safeReferences(refs: unknown): unknown[] {
  if (!refs) return [];
  if (Array.isArray(refs)) return refs;
  if (typeof refs === "string") {
    try {
      const p = JSON.parse(refs);
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }
  return [];
}

// ─── Tests asString ───────────────────────────────────────────────────────────

describe("asString", () => {
  it("retourne '' pour null", () => {
    expect(asString(null)).toBe("");
  });

  it("retourne '' pour undefined", () => {
    expect(asString(undefined)).toBe("");
  });

  it("retourne '' pour string vide", () => {
    expect(asString("")).toBe("");
  });

  it("retourne la string telle quelle si pas JSON", () => {
    expect(asString("floral, boisé")).toBe("floral, boisé");
  });

  it("joint un tableau natif avec ', '", () => {
    expect(asString(["floral", "boisé", "épicé"])).toBe("floral, boisé, épicé");
  });

  it("filtre les éléments vides dans un tableau", () => {
    expect(asString(["floral", "", "boisé"])).toBe("floral, boisé");
  });

  it("parse une JSON string de tableau et joint avec ', '", () => {
    expect(asString('["floral", "boisé"]')).toBe("floral, boisé");
  });

  it("parse une JSON string d'objet et retourne JSON.stringify", () => {
    const obj = { top: "floral", base: "boisé" };
    expect(asString(JSON.stringify(obj))).toBe(JSON.stringify(obj));
  });

  it("retourne la string telle quelle si JSON malformé", () => {
    expect(asString("[floral, boisé")).toBe("[floral, boisé");
  });

  it("convertit un nombre en string", () => {
    expect(asString(42)).toBe("42");
  });

  it("retourne '' pour 0 (falsy)", () => {
    expect(asString(0)).toBe("");
  });

  it("retourne '' pour false (falsy)", () => {
    expect(asString(false)).toBe("");
  });
});

// ─── Tests asArray ────────────────────────────────────────────────────────────

describe("asArray", () => {
  it("retourne [] pour null", () => {
    expect(asArray(null)).toEqual([]);
  });

  it("retourne [] pour undefined", () => {
    expect(asArray(undefined)).toEqual([]);
  });

  it("retourne [] pour string vide", () => {
    expect(asArray("")).toEqual([]);
  });

  it("retourne [] pour tableau vide", () => {
    expect(asArray([])).toEqual([]);
  });

  it("retourne le tableau natif de strings", () => {
    expect(asArray(["floral", "boisé"])).toEqual(["floral", "boisé"]);
  });

  it("filtre les éléments vides dans un tableau natif", () => {
    expect(asArray(["floral", "", "boisé", null])).toEqual(["floral", "boisé", "null"]);
  });

  it("parse une JSON string de tableau", () => {
    expect(asArray('["floral", "boisé", "épicé"]')).toEqual(["floral", "boisé", "épicé"]);
  });

  it("retourne [string] pour une string non-JSON", () => {
    expect(asArray("floral, boisé")).toEqual(["floral, boisé"]);
  });

  it("retourne [string] pour une JSON string malformée", () => {
    expect(asArray("[floral, boisé")).toEqual(["[floral, boisé"]);
  });

  it("convertit les éléments non-string d'un tableau en string", () => {
    expect(asArray([1, 2, 3])).toEqual(["1", "2", "3"]);
  });

  it("retourne [string] pour un nombre", () => {
    expect(asArray(42)).toEqual(["42"]);
  });

  it("retourne [] pour 0 (falsy)", () => {
    expect(asArray(0)).toEqual([]);
  });
});

// ─── Tests safeReferences ─────────────────────────────────────────────────────

describe("safeReferences", () => {
  it("retourne [] pour null", () => {
    expect(safeReferences(null)).toEqual([]);
  });

  it("retourne [] pour undefined", () => {
    expect(safeReferences(undefined)).toEqual([]);
  });

  it("retourne le tableau tel quel", () => {
    const refs = [{ title: "Ref 1", url: "http://example.com" }];
    expect(safeReferences(refs)).toEqual(refs);
  });

  it("parse une JSON string de tableau d'objets", () => {
    const refs = [{ title: "Ref 1" }, { title: "Ref 2" }];
    expect(safeReferences(JSON.stringify(refs))).toEqual(refs);
  });

  it("retourne [] pour une JSON string d'objet non-tableau", () => {
    expect(safeReferences('{"title": "Ref 1"}')).toEqual([]);
  });

  it("retourne [] pour une JSON string malformée", () => {
    expect(safeReferences("[{title: Ref 1}]")).toEqual([]);
  });

  it("retourne [] pour une string vide", () => {
    expect(safeReferences("")).toEqual([]);
  });

  it("retourne [] pour un tableau vide JSON string", () => {
    expect(safeReferences("[]")).toEqual([]);
  });
});

// ─── Tests de normalisation des colonnes JSON prioritaires ───────────────────

describe("Normalisation olfactiveProfileJson prioritaire", () => {
  it("utilise olfactiveProfileJson si disponible et non vide", () => {
    const molecule = {
      olfactiveProfile: "floral",
      olfactiveProfileJson: ["floral", "boisé"],
    };
    const result = asArray(molecule.olfactiveProfileJson ?? molecule.olfactiveProfile);
    expect(result).toEqual(["floral", "boisé"]);
  });

  it("fallback sur olfactiveProfile si olfactiveProfileJson est null", () => {
    const molecule = {
      olfactiveProfile: "floral, boisé",
      olfactiveProfileJson: null,
    };
    const result = asArray(molecule.olfactiveProfileJson ?? molecule.olfactiveProfile);
    expect(result).toEqual(["floral, boisé"]);
  });

  it("fallback sur olfactiveProfile si olfactiveProfileJson est undefined", () => {
    const molecule = {
      olfactiveProfile: '["floral", "boisé"]',
    } as any;
    const result = asArray(molecule.olfactiveProfileJson ?? molecule.olfactiveProfile);
    expect(result).toEqual(["floral", "boisé"]);
  });
});
