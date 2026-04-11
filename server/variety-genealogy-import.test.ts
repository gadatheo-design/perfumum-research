/**
 * variety-genealogy-import.test.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Tests Vitest pour les fonctions utilitaires du router variety-genealogy-import.
 * Couvre : parseCSV, convertRowsToObjects (cas nominaux, cas limites, erreurs).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { describe, it, expect } from "vitest";
import {
  parseCSV,
  convertRowsToObjects,
} from "./routers/variety-genealogy-import";

// ─────────────────────────────────────────────────────────────────────────────
// parseCSV
// ─────────────────────────────────────────────────────────────────────────────

describe("parseCSV", () => {
  it("parse une ligne simple en tableau de cellules", () => {
    const csv = "name,species,genus\nRose,Rosa,Rosa";
    const rows = parseCSV(csv);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual(["name", "species", "genus"]);
    expect(rows[1]).toEqual(["Rose", "Rosa", "Rosa"]);
  });

  it("gère les champs entre guillemets avec virgule interne", () => {
    const csv = 'name,description\nRose,"Belle fleur, très parfumée"';
    const rows = parseCSV(csv);
    expect(rows[1]).toEqual(["Rose", "Belle fleur, très parfumée"]);
  });

  it("gère les guillemets doublés dans un champ quoté", () => {
    const csv = 'name,notes\nRose,"Il dit ""bonjour"""';
    const rows = parseCSV(csv);
    expect(rows[1]?.[1]).toBe('Il dit "bonjour"');
  });

  it("ignore les lignes entièrement vides", () => {
    const csv = "name,species,genus\n\nRose,Rosa,Rosa\n";
    const rows = parseCSV(csv);
    expect(rows).toHaveLength(2);
  });

  it("retourne un tableau vide pour un CSV vide", () => {
    const rows = parseCSV("");
    expect(rows).toHaveLength(0);
  });

  it("gère un CSV avec une seule ligne (en-tête uniquement)", () => {
    const csv = "name,species,genus";
    const rows = parseCSV(csv);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual(["name", "species", "genus"]);
  });

  it("conserve les espaces internes mais supprime les espaces de bordure", () => {
    const csv = "name , species , genus\n Rose , Rosa , Rosa ";
    const rows = parseCSV(csv);
    expect(rows[0]).toEqual(["name", "species", "genus"]);
    expect(rows[1]).toEqual(["Rose", "Rosa", "Rosa"]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// convertRowsToObjects
// ─────────────────────────────────────────────────────────────────────────────

describe("convertRowsToObjects", () => {
  const HEADERS = ["name", "species", "genus", "parentName", "relationType", "year", "origin", "description", "conservationStatus", "notes"];

  it("convertit une ligne valide sans erreurs", () => {
    const rows = [
      HEADERS,
      ["Damask Rose", "Rosa damascena", "Rosa", "", "", "", "Moyen-Orient", "Rose classique", "LC", ""],
    ];
    const results = convertRowsToObjects(rows, HEADERS);
    expect(results).toHaveLength(1);
    const r = results[0]!;
    expect(r.errors).toHaveLength(0);
    expect(r.data.name).toBe("Damask Rose");
    expect(r.data.species).toBe("Rosa damascena");
    expect(r.data.genus).toBe("Rosa");
    expect(r.rowNumber).toBe(2);
  });

  it("retourne une erreur si name est vide", () => {
    const rows = [
      HEADERS,
      ["", "Rosa damascena", "Rosa"],
    ];
    const results = convertRowsToObjects(rows, HEADERS);
    expect(results[0]!.errors).toContain("Name is required");
  });

  it("retourne une erreur si species est vide", () => {
    const rows = [
      HEADERS,
      ["Damask Rose", "", "Rosa"],
    ];
    const results = convertRowsToObjects(rows, HEADERS);
    expect(results[0]!.errors).toContain("Species is required");
  });

  it("retourne une erreur si genus est vide", () => {
    const rows = [
      HEADERS,
      ["Damask Rose", "Rosa damascena", ""],
    ];
    const results = convertRowsToObjects(rows, HEADERS);
    expect(results[0]!.errors).toContain("Genus is required");
  });

  it("accepte tous les types de relation valides", () => {
    const validTypes = ["parent", "sibling", "hybrid", "cross", "mutation"];
    for (const type of validTypes) {
      const rows = [
        HEADERS,
        ["Rose", "Rosa", "Rosa", "ParentRose", type],
      ];
      const results = convertRowsToObjects(rows, HEADERS);
      expect(results[0]!.errors).toHaveLength(0);
      expect(results[0]!.data.relationType).toBe(type);
    }
  });

  it("retourne une erreur pour un type de relation invalide", () => {
    const rows = [
      HEADERS,
      ["Rose", "Rosa", "Rosa", "", "invalid_type"],
    ];
    const results = convertRowsToObjects(rows, HEADERS);
    expect(results[0]!.errors).toContain("Invalid relation type: invalid_type");
  });

  it("parse correctement une année valide", () => {
    const rows = [
      HEADERS,
      ["Rose", "Rosa", "Rosa", "", "", "1850"],
    ];
    const results = convertRowsToObjects(rows, HEADERS);
    expect(results[0]!.errors).toHaveLength(0);
    expect(results[0]!.data.year).toBe(1850);
  });

  it("retourne une erreur pour une année non numérique", () => {
    const rows = [
      HEADERS,
      ["Rose", "Rosa", "Rosa", "", "", "dix-neuf-cents"],
    ];
    const results = convertRowsToObjects(rows, HEADERS);
    expect(results[0]!.errors).toContain("Invalid year: dix-neuf-cents");
  });

  it("accepte tous les statuts de conservation valides", () => {
    const validStatuses = ["LC", "NT", "VU", "EN", "CR", "EW", "EX"];
    for (const status of validStatuses) {
      const rows = [
        HEADERS,
        ["Rose", "Rosa", "Rosa", "", "", "", "", "", status],
      ];
      const results = convertRowsToObjects(rows, HEADERS);
      expect(results[0]!.errors).toHaveLength(0);
      expect(results[0]!.data.conservationStatus).toBe(status);
    }
  });

  it("retourne une erreur pour un statut de conservation invalide", () => {
    const rows = [
      HEADERS,
      ["Rose", "Rosa", "Rosa", "", "", "", "", "", "UNKNOWN"],
    ];
    const results = convertRowsToObjects(rows, HEADERS);
    expect(results[0]!.errors).toContain("Invalid conservation status: UNKNOWN");
  });

  it("assigne les numéros de ligne corrects (commence à 2)", () => {
    const rows = [
      HEADERS,
      ["Rose A", "Rosa", "Rosa"],
      ["Rose B", "Rosa", "Rosa"],
      ["Rose C", "Rosa", "Rosa"],
    ];
    const results = convertRowsToObjects(rows, HEADERS);
    expect(results).toHaveLength(3);
    expect(results[0]!.rowNumber).toBe(2);
    expect(results[1]!.rowNumber).toBe(3);
    expect(results[2]!.rowNumber).toBe(4);
  });

  it("retourne un tableau vide si rows ne contient que l'en-tête", () => {
    const rows = [HEADERS];
    const results = convertRowsToObjects(rows, HEADERS);
    expect(results).toHaveLength(0);
  });

  it("traite les en-têtes en minuscules et sans espaces", () => {
    const mixedHeaders = ["Name", " Species ", "Genus"];
    const rows = [
      mixedHeaders,
      ["Rose", "Rosa", "Rosa"],
    ];
    const results = convertRowsToObjects(rows, mixedHeaders);
    expect(results[0]!.errors).toHaveLength(0);
    expect(results[0]!.data.name).toBe("Rose");
  });

  it("accumule plusieurs erreurs sur une même ligne", () => {
    const rows = [
      HEADERS,
      ["", "", "", "", "invalid_type", "not_a_year", "", "", "INVALID"],
    ];
    const results = convertRowsToObjects(rows, HEADERS);
    const errors = results[0]!.errors;
    expect(errors).toContain("Name is required");
    expect(errors).toContain("Species is required");
    expect(errors).toContain("Genus is required");
    expect(errors).toContain("Invalid relation type: invalid_type");
    expect(errors).toContain("Invalid year: not_a_year");
    expect(errors).toContain("Invalid conservation status: INVALID");
  });

  it("ignore les colonnes inconnues sans erreur", () => {
    const headersWithExtra = [...HEADERS, "unknownColumn"];
    const rows = [
      headersWithExtra,
      ["Rose", "Rosa", "Rosa", "", "", "", "", "", "", "", "valeur_ignoree"],
    ];
    const results = convertRowsToObjects(rows, headersWithExtra);
    expect(results[0]!.errors).toHaveLength(0);
    expect(results[0]!.data.name).toBe("Rose");
  });

  it("stocke undefined pour les champs optionnels vides", () => {
    const rows = [
      HEADERS,
      ["Rose", "Rosa", "Rosa", "", "", "", "", "", "", ""],
    ];
    const results = convertRowsToObjects(rows, HEADERS);
    const data = results[0]!.data;
    expect(data.parentName).toBeUndefined();
    expect(data.relationType).toBeUndefined();
    expect(data.origin).toBeUndefined();
    expect(data.description).toBeUndefined();
    expect(data.conservationStatus).toBeUndefined();
    expect(data.notes).toBeUndefined();
  });
});
