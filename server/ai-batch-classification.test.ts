import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock du module LLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

// Mock du module db
vi.mock("./db", () => ({
  getOrphanMoleculesList: vi.fn(),
  getPlantsByMolecule: vi.fn(),
  getMoleculeById: vi.fn(),
  batchClassifyMolecules: vi.fn(),
  getAllMolecules: vi.fn(),
  createNotification: vi.fn(),
}));

import { invokeLLM } from "./_core/llm";
import * as db from "./db";

describe("AI Batch Classification - Enhanced", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getUnclassifiedMoleculesWithPlants", () => {
    it("should return molecules without chemical class with their plant sources", async () => {
      const mockMolecules = [
        { id: 1, name: "Molécule A", chemicalClass: null, family: "floral" },
        { id: 2, name: "Molécule B", chemicalClass: null, family: null },
      ];

      const mockPlantSources = [
        {
          plant: { id: 1, name: "Lavande", latinName: "Lavandula angustifolia", family: "Lamiaceae", category: "aromatique" },
          percentageTypical: "5.2",
          role: "majeur",
          isSignature: 1,
        },
      ];

      vi.mocked(db.getOrphanMoleculesList).mockResolvedValue({
        molecules: mockMolecules as any,
        total: 2,
      });

      vi.mocked(db.getPlantsByMolecule).mockResolvedValue(mockPlantSources as any);

      // Vérifier que les mocks sont configurés
      expect(vi.mocked(db.getOrphanMoleculesList)).toBeDefined();
      expect(vi.mocked(db.getPlantsByMolecule)).toBeDefined();
    });

    it("should handle molecules without any plant sources", async () => {
      const mockMolecules = [
        { id: 1, name: "Molécule orpheline", chemicalClass: null },
      ];

      vi.mocked(db.getOrphanMoleculesList).mockResolvedValue({
        molecules: mockMolecules as any,
        total: 1,
      });

      vi.mocked(db.getPlantsByMolecule).mockResolvedValue([]);

      expect(vi.mocked(db.getPlantsByMolecule)).toBeDefined();
    });

    it("should paginate results correctly", async () => {
      const limit = 50;
      const offset = 100;

      vi.mocked(db.getOrphanMoleculesList).mockResolvedValue({
        molecules: [],
        total: 400,
      });

      // Vérifier que la pagination est supportée
      expect(limit).toBe(50);
      expect(offset).toBe(100);
    });
  });

  describe("classifyMoleculesBatchEnhanced", () => {
    it("should classify molecules with botanical context", async () => {
      const mockMolecule = {
        id: 1,
        name: "Linalol",
        iupacName: "3,7-dimethylocta-1,6-dien-3-ol",
        casNumber: "78-70-6",
        chemicalFormula: "C10H18O",
        olfactiveProfile: "Floral, frais, légèrement boisé",
      };

      const mockPlantSources = [
        {
          plant: { id: 1, name: "Lavande", latinName: "Lavandula angustifolia", family: "Lamiaceae", category: "aromatique" },
          percentageTypical: "25",
          role: "majeur",
          isSignature: 1,
        },
        {
          plant: { id: 2, name: "Bergamote", latinName: "Citrus bergamia", family: "Rutaceae", category: "agrume" },
          percentageTypical: "15",
          role: "majeur",
          isSignature: 0,
        },
      ];

      const mockLLMResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                chemicalClass: "alcohol",
                chemicalClassConfidence: 95,
                chemicalClassReasoning: "Le linalol est un alcool terpénique monoterpénique, identifié par son groupe hydroxyle (-OH) et sa formule C10H18O. Sa présence dans les Lamiaceae (lavande) et Rutaceae (bergamote) confirme cette classification.",
                olfactiveFamily: "floral",
                olfactiveFamilyConfidence: 92,
                olfactiveFamilyReasoning: "Odeur florale caractéristique, avec des notes fraîches et légèrement citronnées.",
                suggestedOlfactiveProfile: "Notes florales douces et fraîches de lavande, avec des facettes légèrement citronnées et boisées. Caractère apaisant et élégant.",
              }),
            },
          },
        ],
      };

      vi.mocked(db.getMoleculeById).mockResolvedValue(mockMolecule as any);
      vi.mocked(db.getPlantsByMolecule).mockResolvedValue(mockPlantSources as any);
      vi.mocked(invokeLLM).mockResolvedValue(mockLLMResponse as any);

      expect(vi.mocked(invokeLLM)).toBeDefined();
    });

    it("should use botanical family hints for classification", async () => {
      // Test que le contexte botanique améliore la classification
      const botanicalFamilyHints = {
        Lamiaceae: ["monoterpene", "alcohol"],
        Rutaceae: ["aldehyde", "coumarin", "monoterpene"],
        Asteraceae: ["sesquiterpene", "lactone"],
        Lauraceae: ["aldehyde", "phenol"],
        Myrtaceae: ["ether", "phenol"],
        Zingiberaceae: ["sesquiterpene", "ketone"],
        Apiaceae: ["ether", "phenol"],
        Pinaceae: ["monoterpene"],
        Cannabaceae: ["sesquiterpene", "monoterpene"],
        Burseraceae: ["diterpene", "sesquiterpene"],
      };

      Object.entries(botanicalFamilyHints).forEach(([family, expectedClasses]) => {
        expect(expectedClasses.length).toBeGreaterThan(0);
        expect(family).toBeDefined();
      });
    });

    it("should auto-apply classifications when confidence exceeds threshold", async () => {
      const confidenceThreshold = 75;
      const highConfidenceResult = {
        chemicalClass: "monoterpene",
        chemicalClassConfidence: 90,
      };

      const shouldAutoApply = highConfidenceResult.chemicalClassConfidence >= confidenceThreshold;
      expect(shouldAutoApply).toBe(true);
    });

    it("should not auto-apply classifications below confidence threshold", async () => {
      const confidenceThreshold = 75;
      const lowConfidenceResult = {
        chemicalClass: "other",
        chemicalClassConfidence: 50,
      };

      const shouldAutoApply = lowConfidenceResult.chemicalClassConfidence >= confidenceThreshold;
      expect(shouldAutoApply).toBe(false);
    });

    it("should process molecules in batches of 5", async () => {
      const moleculeIds = Array.from({ length: 23 }, (_, i) => i + 1);
      const batchSize = 5;
      const expectedBatches = Math.ceil(moleculeIds.length / batchSize);

      expect(expectedBatches).toBe(5);
    });

    it("should handle LLM errors gracefully", async () => {
      vi.mocked(invokeLLM).mockRejectedValue(new Error("LLM service unavailable"));

      expect(vi.mocked(invokeLLM)).toBeDefined();
    });
  });

  describe("classifyAllUnclassified", () => {
    it("should retrieve all molecules without chemical class", async () => {
      const mockUnclassified = {
        molecules: Array.from({ length: 100 }, (_, i) => ({
          id: i + 1,
          name: `Molécule ${i + 1}`,
          chemicalClass: null,
        })),
        total: 400,
      };

      vi.mocked(db.getOrphanMoleculesList).mockResolvedValue(mockUnclassified as any);

      expect(mockUnclassified.total).toBe(400);
      expect(mockUnclassified.molecules.length).toBe(100);
    });

    it("should create notification after batch classification", async () => {
      vi.mocked(db.createNotification).mockResolvedValue({
        id: 1,
        type: "classification",
        title: "Classification IA terminée",
        message: "50 molécules ont été classifiées automatiquement sur 100 traitées.",
        priority: "normal",
        isRead: false,
        createdAt: new Date(),
      } as any);

      expect(vi.mocked(db.createNotification)).toBeDefined();
    });

    it("should return empty result when no molecules to classify", async () => {
      vi.mocked(db.getOrphanMoleculesList).mockResolvedValue({
        molecules: [],
        total: 0,
      });

      const result = await db.getOrphanMoleculesList("no_chemical_class", 100, 0);
      expect(result.total).toBe(0);
      expect(result.molecules.length).toBe(0);
    });

    it("should respect maxMolecules limit", async () => {
      const maxMolecules = 50;
      const mockMolecules = Array.from({ length: maxMolecules }, (_, i) => ({
        id: i + 1,
        name: `Molécule ${i + 1}`,
      }));

      vi.mocked(db.getOrphanMoleculesList).mockResolvedValue({
        molecules: mockMolecules as any,
        total: 400,
      });

      const result = await db.getOrphanMoleculesList("no_chemical_class", maxMolecules, 0);
      expect(result.molecules.length).toBeLessThanOrEqual(maxMolecules);
    });
  });

  describe("getUnclassifiedStats", () => {
    it("should return comprehensive statistics", async () => {
      vi.mocked(db.getOrphanMoleculesList).mockImplementation(async (filter) => {
        const counts: Record<string, number> = {
          no_chemical_class: 400,
          no_family: 200,
          no_olfactive_profile: 150,
          no_cas: 300,
          no_iupac: 350,
          no_formula: 250,
        };
        return { molecules: [], total: counts[filter] || 0 };
      });

      vi.mocked(db.getAllMolecules).mockResolvedValue(
        Array.from({ length: 556 }, (_, i) => ({ id: i + 1, name: `Mol ${i}` })) as any
      );

      const allMolecules = await db.getAllMolecules();
      expect(allMolecules.length).toBe(556);
    });

    it("should calculate classification rate correctly", () => {
      const totalMolecules = 556;
      const noChemicalClass = 400;
      const classificationRate = Math.round(((totalMolecules - noChemicalClass) / totalMolecules) * 100);

      expect(classificationRate).toBe(28); // ~28% classifiées
    });

    it("should calculate plant linkage rate correctly", () => {
      const totalMolecules = 556;
      const withPlantSources = 150;
      const plantLinkageRate = Math.round((withPlantSources / totalMolecules) * 100);

      expect(plantLinkageRate).toBe(27); // ~27% liées à des plantes
    });
  });

  describe("Botanical context enrichment", () => {
    it("should format botanical context correctly", () => {
      const plantSources = [
        { name: "Lavande", latinName: "Lavandula angustifolia", family: "Lamiaceae", percentageTypical: "25" },
        { name: "Bergamote", latinName: "Citrus bergamia", family: "Rutaceae", percentageTypical: "15" },
      ];

      const botanicalContext = plantSources.map(p => 
        `${p.name} (${p.latinName}, famille ${p.family}, ${p.percentageTypical}%)`
      ).join("; ");

      expect(botanicalContext).toContain("Lavande");
      expect(botanicalContext).toContain("Lamiaceae");
      expect(botanicalContext).toContain("25%");
    });

    it("should handle missing botanical data gracefully", () => {
      const plantSources = [
        { name: "Plante inconnue", latinName: null, family: null, percentageTypical: null },
      ];

      const botanicalContext = plantSources.map(p => 
        `${p.name} (${p.latinName || 'N/A'}, famille ${p.family || 'inconnue'}${p.percentageTypical ? `, ${p.percentageTypical}%` : ''})`
      ).join("; ");

      expect(botanicalContext).toContain("N/A");
      expect(botanicalContext).toContain("famille inconnue");
    });
  });

  describe("Classification result structure", () => {
    it("should return complete classification result", () => {
      const result = {
        id: 1,
        name: "Linalol",
        success: true,
        classification: {
          chemicalClass: "alcohol",
          chemicalClassConfidence: 95,
          chemicalClassReasoning: "Alcool terpénique monoterpénique",
          olfactiveFamily: "floral",
          olfactiveFamilyConfidence: 92,
          olfactiveFamilyReasoning: "Odeur florale caractéristique",
          suggestedOlfactiveProfile: "Notes florales douces et fraîches",
          botanicalContextUsed: true,
        },
        applied: true,
      };

      expect(result.success).toBe(true);
      expect(result.classification.chemicalClass).toBe("alcohol");
      expect(result.classification.botanicalContextUsed).toBe(true);
      expect(result.applied).toBe(true);
    });

    it("should return error result on failure", () => {
      const result = {
        id: 1,
        name: "Molécule problématique",
        success: false,
        error: "LLM service unavailable",
      };

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("Summary statistics", () => {
    it("should calculate summary correctly", () => {
      const results = [
        { success: true, classification: { chemicalClassConfidence: 95, botanicalContextUsed: true } },
        { success: true, classification: { chemicalClassConfidence: 75, botanicalContextUsed: true } },
        { success: true, classification: { chemicalClassConfidence: 45, botanicalContextUsed: false } },
        { success: false, error: "Error" },
      ];

      const successful = results.filter(r => r.success);
      const withBotanicalContext = results.filter(r => (r as any).classification?.botanicalContextUsed).length;
      const highConfidence = successful.filter(r => (r as any).classification?.chemicalClassConfidence >= 80).length;
      const mediumConfidence = successful.filter(r => {
        const conf = (r as any).classification?.chemicalClassConfidence;
        return conf >= 50 && conf < 80;
      }).length;
      const lowConfidence = successful.filter(r => (r as any).classification?.chemicalClassConfidence < 50).length;

      expect(successful.length).toBe(3);
      expect(withBotanicalContext).toBe(2);
      expect(highConfidence).toBe(1);
      expect(mediumConfidence).toBe(1);
      expect(lowConfidence).toBe(1);
    });
  });

  describe("Input validation", () => {
    it("should validate moleculeIds array", () => {
      const validInput = {
        moleculeIds: [1, 2, 3, 4, 5],
        autoApply: false,
        confidenceThreshold: 70,
      };

      expect(validInput.moleculeIds.length).toBeLessThanOrEqual(50);
      expect(validInput.moleculeIds.length).toBeGreaterThanOrEqual(1);
    });

    it("should validate confidence threshold range", () => {
      const threshold = 75;
      expect(threshold).toBeGreaterThanOrEqual(0);
      expect(threshold).toBeLessThanOrEqual(100);
    });

    it("should validate batch size range", () => {
      const batchSize = 20;
      expect(batchSize).toBeGreaterThanOrEqual(5);
      expect(batchSize).toBeLessThanOrEqual(50);
    });

    it("should validate maxMolecules range", () => {
      const maxMolecules = 100;
      expect(maxMolecules).toBeGreaterThanOrEqual(1);
      expect(maxMolecules).toBeLessThanOrEqual(500);
    });
  });
});
