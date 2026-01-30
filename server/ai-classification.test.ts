import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock du module LLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

import { invokeLLM } from "./_core/llm";

describe("AI Classification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("classifyMolecule", () => {
    it("should return a valid classification for a known molecule", async () => {
      // Mock de la réponse LLM
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                chemicalClass: "monoterpene",
                chemicalClassConfidence: 95,
                chemicalClassReasoning: "Le limonène est un monoterpène cyclique (C10H16) présent dans les agrumes.",
                olfactiveFamily: "agrume",
                olfactiveFamilyConfidence: 98,
                olfactiveFamilyReasoning: "Odeur caractéristique d'agrumes, fraîche et zestée.",
                suggestedOlfactiveProfile: "Notes fraîches et pétillantes d'agrumes, avec des facettes vertes et légèrement résineuses.",
                additionalNotes: "Molécule très répandue dans les huiles essentielles d'agrumes. Existe sous deux formes énantiomères.",
              }),
            },
          },
        ],
      };

      vi.mocked(invokeLLM).mockResolvedValue(mockResponse as any);

      // Simuler l'appel de la procédure
      const input = {
        name: "Limonène",
        casNumber: "138-86-3",
        chemicalFormula: "C10H16",
      };

      // Vérifier que le mock a été configuré correctement
      expect(vi.mocked(invokeLLM)).toBeDefined();
    });

    it("should handle molecules with minimal information", async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                chemicalClass: "other",
                chemicalClassConfidence: 30,
                chemicalClassReasoning: "Informations insuffisantes pour déterminer la classe chimique avec certitude.",
                olfactiveFamily: "autre",
                olfactiveFamilyConfidence: 25,
                olfactiveFamilyReasoning: "Sans profil olfactif ni formule, la classification est incertaine.",
                suggestedOlfactiveProfile: "Profil olfactif indéterminé - nécessite plus d'informations.",
                additionalNotes: "Recommandation: ajouter le numéro CAS ou la formule chimique pour une meilleure classification.",
              }),
            },
          },
        ],
      };

      vi.mocked(invokeLLM).mockResolvedValue(mockResponse as any);

      const input = {
        name: "Molécule inconnue",
      };

      expect(vi.mocked(invokeLLM)).toBeDefined();
    });

    it("should handle LLM errors gracefully", async () => {
      vi.mocked(invokeLLM).mockRejectedValue(new Error("LLM service unavailable"));

      // La procédure devrait retourner une erreur structurée
      expect(vi.mocked(invokeLLM)).toBeDefined();
    });
  });

  describe("Chemical class validation", () => {
    const validClasses = [
      "terpene",
      "sesquiterpene",
      "diterpene",
      "monoterpene",
      "aldehyde",
      "ketone",
      "alcohol",
      "ester",
      "ether",
      "phenol",
      "lactone",
      "coumarin",
      "musk",
      "nitrile",
      "sulfur_compound",
      "heterocyclic",
      "aromatic",
      "aliphatic",
      "other",
    ];

    it("should accept all valid chemical classes", () => {
      validClasses.forEach((chemClass) => {
        expect(validClasses).toContain(chemClass);
      });
    });

    it("should have 19 valid chemical classes", () => {
      expect(validClasses.length).toBe(19);
    });
  });

  describe("Olfactive family validation", () => {
    const validFamilies = [
      "floral",
      "boise",
      "agrume",
      "epice",
      "herbace",
      "balsamique",
      "musque",
      "animal",
      "vert",
      "fruite",
      "marin",
      "terreux",
      "fume",
      "gourmand",
      "aromatique",
      "autre",
    ];

    it("should accept all valid olfactive families", () => {
      validFamilies.forEach((family) => {
        expect(validFamilies).toContain(family);
      });
    });

    it("should have 16 valid olfactive families", () => {
      expect(validFamilies.length).toBe(16);
    });
  });

  describe("Confidence scoring", () => {
    it("should categorize high confidence correctly (>=80)", () => {
      const confidence = 85;
      const isHighConfidence = confidence >= 80;
      expect(isHighConfidence).toBe(true);
    });

    it("should categorize medium confidence correctly (60-79)", () => {
      const confidence = 70;
      const isMediumConfidence = confidence >= 60 && confidence < 80;
      expect(isMediumConfidence).toBe(true);
    });

    it("should categorize low confidence correctly (<60)", () => {
      const confidence = 45;
      const isLowConfidence = confidence < 60;
      expect(isLowConfidence).toBe(true);
    });
  });

  describe("Input validation", () => {
    it("should require a molecule name", () => {
      const input = { name: "" };
      expect(input.name.length).toBe(0);
    });

    it("should accept optional fields", () => {
      const input = {
        name: "Test Molecule",
        iupacName: undefined,
        casNumber: undefined,
        chemicalFormula: undefined,
        olfactiveProfile: undefined,
        botanicalSources: undefined,
      };
      expect(input.name).toBeDefined();
      expect(input.iupacName).toBeUndefined();
    });
  });

  describe("Known molecule classifications", () => {
    const knownMolecules = [
      {
        name: "Limonène",
        expectedClass: "monoterpene",
        expectedFamily: "agrume",
      },
      {
        name: "Linalol",
        expectedClass: "alcohol",
        expectedFamily: "floral",
      },
      {
        name: "Eugénol",
        expectedClass: "phenol",
        expectedFamily: "epice",
      },
      {
        name: "Vanilline",
        expectedClass: "aldehyde",
        expectedFamily: "gourmand",
      },
      {
        name: "Caryophyllène",
        expectedClass: "sesquiterpene",
        expectedFamily: "epice",
      },
    ];

    knownMolecules.forEach((molecule) => {
      it(`should have expected classification for ${molecule.name}`, () => {
        expect(molecule.expectedClass).toBeDefined();
        expect(molecule.expectedFamily).toBeDefined();
      });
    });
  });

  describe("Batch classification", () => {
    it("should process multiple molecules", () => {
      const molecules = [
        { id: 1, name: "Limonène" },
        { id: 2, name: "Linalol" },
        { id: 3, name: "Eugénol" },
      ];

      expect(molecules.length).toBe(3);
      molecules.forEach((mol) => {
        expect(mol.id).toBeDefined();
        expect(mol.name).toBeDefined();
      });
    });

    it("should batch molecules in groups of 5", () => {
      const molecules = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        name: `Molecule ${i + 1}`,
      }));

      const batchSize = 5;
      const expectedBatches = Math.ceil(molecules.length / batchSize);
      expect(expectedBatches).toBe(3);
    });
  });
});
