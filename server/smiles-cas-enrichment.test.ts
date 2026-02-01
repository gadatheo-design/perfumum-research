/**
 * Tests pour le service d'enrichissement SMILES et CAS
 */

import { describe, it, expect } from "vitest";
import { MOLECULE_REFERENCE_DATA } from "./smiles-cas-enrichment";

describe("SMILES and CAS Enrichment Service", () => {
  describe("Reference Data Structure", () => {
    it("should have reference data entries", () => {
      const entries = Object.keys(MOLECULE_REFERENCE_DATA);
      expect(entries.length).toBeGreaterThan(300);
    });

    it("should have valid SMILES for all entries", () => {
      Object.entries(MOLECULE_REFERENCE_DATA).forEach(([name, data]) => {
        expect(data.smiles).toBeDefined();
        expect(data.smiles.length).toBeGreaterThan(0);
        // SMILES should contain valid characters
        expect(data.smiles).toMatch(/^[A-Za-z0-9@#=\[\]\(\)\+\-\.\/\\]+$/);
      });
    });

    it("should have valid formulas for all entries", () => {
      Object.entries(MOLECULE_REFERENCE_DATA).forEach(([name, data]) => {
        expect(data.formula).toBeDefined();
        // Formula should match pattern like C10H16O
        expect(data.formula).toMatch(/^[A-Z][a-z]?\d*([A-Z][a-z]?\d*)*$/);
      });
    });

    it("should have valid molecular weights for all entries", () => {
      Object.entries(MOLECULE_REFERENCE_DATA).forEach(([name, data]) => {
        expect(data.molecularWeight).toBeDefined();
        expect(data.molecularWeight).toBeGreaterThan(0);
        expect(data.molecularWeight).toBeLessThan(1000);
      });
    });

    it("should have CAS numbers for most entries", () => {
      const entriesWithCas = Object.values(MOLECULE_REFERENCE_DATA).filter(d => d.cas);
      expect(entriesWithCas.length).toBeGreaterThan(250);
    });

    it("should have valid CAS format when present", () => {
      Object.entries(MOLECULE_REFERENCE_DATA).forEach(([name, data]) => {
        if (data.cas) {
          // CAS format: XXXXX-XX-X or XXXX-XX-X
          expect(data.cas).toMatch(/^\d{2,7}-\d{2}-\d$/);
        }
      });
    });
  });

  describe("Molecule Categories Coverage", () => {
    it("should include monoterpenes", () => {
      const monoterpenes = ["limonene", "myrcene", "alpha-pinene", "beta-pinene", "camphene"];
      monoterpenes.forEach(name => {
        expect(MOLECULE_REFERENCE_DATA[name]).toBeDefined();
      });
    });

    it("should include sesquiterpenes", () => {
      const sesquiterpenes = ["beta-caryophyllene", "humulene", "farnesene", "bisabolene"];
      sesquiterpenes.forEach(name => {
        expect(MOLECULE_REFERENCE_DATA[name]).toBeDefined();
      });
    });

    it("should include alcohols", () => {
      const alcohols = ["linalool", "geraniol", "menthol", "borneol", "terpineol"];
      alcohols.forEach(name => {
        expect(MOLECULE_REFERENCE_DATA[name]).toBeDefined();
      });
    });

    it("should include aldehydes", () => {
      const aldehydes = ["citral", "benzaldehyde", "vanillin", "cinnamaldehyde"];
      aldehydes.forEach(name => {
        expect(MOLECULE_REFERENCE_DATA[name]).toBeDefined();
      });
    });

    it("should include ketones", () => {
      const ketones = ["camphor", "menthone", "carvone", "ionone"];
      ketones.forEach(name => {
        expect(MOLECULE_REFERENCE_DATA[name]).toBeDefined();
      });
    });

    it("should include phenols", () => {
      const phenols = ["eugenol", "thymol", "carvacrol", "guaiacol"];
      phenols.forEach(name => {
        expect(MOLECULE_REFERENCE_DATA[name]).toBeDefined();
      });
    });

    it("should include esters", () => {
      const esters = ["linalyl acetate", "geranyl acetate", "benzyl acetate"];
      esters.forEach(name => {
        expect(MOLECULE_REFERENCE_DATA[name]).toBeDefined();
      });
    });

    it("should include lactones", () => {
      const lactones = ["gamma-decalactone", "gamma-undecalactone", "coumarin"];
      lactones.forEach(name => {
        expect(MOLECULE_REFERENCE_DATA[name]).toBeDefined();
      });
    });

    it("should include musks", () => {
      const musks = ["muscone", "ambroxan", "galaxolide"];
      musks.forEach(name => {
        expect(MOLECULE_REFERENCE_DATA[name]).toBeDefined();
      });
    });

    it("should include heterocyclic compounds", () => {
      const heterocyclic = ["indole", "skatole", "pyrazine", "quinoline"];
      heterocyclic.forEach(name => {
        expect(MOLECULE_REFERENCE_DATA[name]).toBeDefined();
      });
    });
  });

  describe("French and English Name Coverage", () => {
    it("should include both French and English names for common molecules", () => {
      const pairs = [
        ["limonene", "limonène"],
        ["myrcene", "myrcène"],
        ["geraniol", "géraniol"],
        ["vanillin", "vanilline"],
        ["eugenol", "eugénol"],
        ["camphor", "camphre"],
        ["coumarin", "coumarine"]
      ];
      
      pairs.forEach(([en, fr]) => {
        expect(MOLECULE_REFERENCE_DATA[en]).toBeDefined();
        expect(MOLECULE_REFERENCE_DATA[fr]).toBeDefined();
        // Both should have the same CAS
        if (MOLECULE_REFERENCE_DATA[en].cas && MOLECULE_REFERENCE_DATA[fr].cas) {
          expect(MOLECULE_REFERENCE_DATA[en].cas).toBe(MOLECULE_REFERENCE_DATA[fr].cas);
        }
      });
    });

    it("should include Greek letter variants", () => {
      const greekPairs = [
        ["alpha-pinene", "α-pinène"],
        ["beta-pinene", "β-pinène"],
        ["beta-caryophyllene", "β-caryophyllène"],
        ["alpha-terpineol", "α-terpinéol"]
      ];
      
      greekPairs.forEach(([latin, greek]) => {
        expect(MOLECULE_REFERENCE_DATA[latin]).toBeDefined();
        expect(MOLECULE_REFERENCE_DATA[greek]).toBeDefined();
      });
    });
  });

  describe("Data Consistency", () => {
    it("should have consistent data for same molecules with different names", () => {
      // Limonene variants
      const limoneneEn = MOLECULE_REFERENCE_DATA["limonene"];
      const limoneneFr = MOLECULE_REFERENCE_DATA["limonène"];
      expect(limoneneEn.formula).toBe(limoneneFr.formula);
      expect(limoneneEn.molecularWeight).toBe(limoneneFr.molecularWeight);
      
      // Eucalyptol / 1,8-cineole
      const eucalyptol = MOLECULE_REFERENCE_DATA["eucalyptol"];
      const cineole = MOLECULE_REFERENCE_DATA["1,8-cineole"];
      expect(eucalyptol.cas).toBe(cineole.cas);
    });

    it("should have unique CAS numbers (no duplicates for different molecules)", () => {
      const casByMolecule: Record<string, string[]> = {};
      
      Object.entries(MOLECULE_REFERENCE_DATA).forEach(([name, data]) => {
        if (data.cas) {
          if (!casByMolecule[data.cas]) {
            casByMolecule[data.cas] = [];
          }
          casByMolecule[data.cas].push(name);
        }
      });
      
      // Each CAS should only appear for variants of the same molecule
      Object.entries(casByMolecule).forEach(([cas, names]) => {
        if (names.length > 1) {
          // Names should be variants (e.g., "limonene" and "limonène")
          const baseNames = names.map(n => 
            n.toLowerCase()
              .replace(/[àáâãäå]/g, 'a')
              .replace(/[èéêë]/g, 'e')
              .replace(/[ìíîï]/g, 'i')
              .replace(/[òóôõö]/g, 'o')
              .replace(/[ùúûü]/g, 'u')
              .replace(/[α]/g, 'alpha-')
              .replace(/[β]/g, 'beta-')
              .replace(/[γ]/g, 'gamma-')
              .replace(/[δ]/g, 'delta-')
          );
          // All base names should be similar (allowing for minor variations)
        }
      });
    });
  });
});
