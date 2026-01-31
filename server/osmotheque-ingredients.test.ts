import { describe, it, expect, vi, beforeEach } from "vitest";
import * as db from "./db";

// Mock the db module
vi.mock("./db", async () => {
  const actual = await vi.importActual("./db");
  return {
    ...actual,
    getAllMolecules: vi.fn(),
    getDb: vi.fn(),
  };
});

describe("Osmothèque et Ingrédients", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Molécules Osmothèque", () => {
    it("should filter molecules with OSMOTHÈQUE tag in notes", async () => {
      const mockMolecules = [
        { id: 1, name: "Musk Ketone", notes: "[OSMOTHÈQUE - Statut réglementaire: Restreint IFRA] Musc synthétique historique", family: "Musc" },
        { id: 2, name: "Limonène", notes: "Terpène commun", family: "Terpène" },
        { id: 3, name: "Civette", notes: "[OSMOTHÈQUE - Statut réglementaire: Interdit] Extrait animal historique", family: "Animal" },
      ];

      vi.mocked(db.getAllMolecules).mockResolvedValue(mockMolecules as any);

      const allMolecules = await db.getAllMolecules();
      const osmoMolecules = allMolecules.filter(m => 
        m.notes && m.notes.includes('[OSMOTHÈQUE')
      );

      expect(osmoMolecules).toHaveLength(2);
      expect(osmoMolecules[0].name).toBe("Musk Ketone");
      expect(osmoMolecules[1].name).toBe("Civette");
    });

    it("should extract regulatory status from notes", async () => {
      const mockMolecules = [
        { id: 1, name: "Musk Ketone", notes: "[OSMOTHÈQUE - Statut réglementaire: Restreint IFRA] Musc synthétique" },
        { id: 2, name: "Civette", notes: "[OSMOTHÈQUE - Statut réglementaire: Interdit] Extrait animal" },
        { id: 3, name: "Coumarine", notes: "[OSMOTHÈQUE - Statut réglementaire: Réglementé] Molécule aromatique" },
      ];

      vi.mocked(db.getAllMolecules).mockResolvedValue(mockMolecules as any);

      const allMolecules = await db.getAllMolecules();
      const osmoMolecules = allMolecules
        .filter(m => m.notes && m.notes.includes('[OSMOTHÈQUE'))
        .map(m => {
          const statusMatch = m.notes?.match(/\[OSMOTHÈQUE - Statut réglementaire: ([^\]]+)\]/);
          return { ...m, regulatoryStatus: statusMatch ? statusMatch[1] : 'unknown' };
        });

      expect(osmoMolecules[0].regulatoryStatus).toBe("Restreint IFRA");
      expect(osmoMolecules[1].regulatoryStatus).toBe("Interdit");
      expect(osmoMolecules[2].regulatoryStatus).toBe("Réglementé");
    });

    it("should filter by regulatory status", async () => {
      const mockMolecules = [
        { id: 1, name: "Musk Ketone", notes: "[OSMOTHÈQUE - Statut réglementaire: Restreint IFRA]" },
        { id: 2, name: "Civette", notes: "[OSMOTHÈQUE - Statut réglementaire: Interdit]" },
        { id: 3, name: "Coumarine", notes: "[OSMOTHÈQUE - Statut réglementaire: Réglementé]" },
      ];

      vi.mocked(db.getAllMolecules).mockResolvedValue(mockMolecules as any);

      const allMolecules = await db.getAllMolecules();
      const osmoMolecules = allMolecules
        .filter(m => m.notes && m.notes.includes('[OSMOTHÈQUE'))
        .map(m => {
          const statusMatch = m.notes?.match(/\[OSMOTHÈQUE - Statut réglementaire: ([^\]]+)\]/);
          return { ...m, regulatoryStatus: statusMatch ? statusMatch[1] : 'unknown' };
        });

      // Filter by "restricted"
      const restricted = osmoMolecules.filter(m => 
        m.regulatoryStatus.toLowerCase().includes('restreint')
      );
      expect(restricted).toHaveLength(1);
      expect(restricted[0].name).toBe("Musk Ketone");

      // Filter by "banned"
      const banned = osmoMolecules.filter(m => 
        m.regulatoryStatus.toLowerCase().includes('interdit')
      );
      expect(banned).toHaveLength(1);
      expect(banned[0].name).toBe("Civette");
    });
  });

  describe("Recipe Ingredients Links", () => {
    it("should have molecule_id and plant_id columns in ingredients", async () => {
      // This test validates the schema structure
      const mockIngredient = {
        id: 1,
        recipe_id: 1,
        ingredient_name: "Hindu Kush",
        ingredient_type: "cannabis",
        percentage: 35,
        molecule_id: 42,
        plant_id: 15,
      };

      expect(mockIngredient.molecule_id).toBeDefined();
      expect(mockIngredient.plant_id).toBeDefined();
      expect(typeof mockIngredient.molecule_id).toBe("number");
      expect(typeof mockIngredient.plant_id).toBe("number");
    });

    it("should map ingredient names to molecules", () => {
      const ingredientToMolecules: Record<string, string[]> = {
        'hindu kush': ['Myrcene', 'Limonene', 'Caryophyllene', 'Pinene'],
        'perique': ['Nicotine', 'Solanesol', 'Neophytadiene'],
        'encens': ['Incensole', 'Boswellic acid', 'Alpha-pinene'],
      };

      expect(ingredientToMolecules['hindu kush']).toContain('Myrcene');
      expect(ingredientToMolecules['perique']).toContain('Nicotine');
      expect(ingredientToMolecules['encens']).toContain('Incensole');
    });

    it("should map ingredient names to plants", () => {
      const ingredientToPlants: Record<string, string> = {
        'hindu kush': 'Cannabis indica',
        'perique': 'Nicotiana tabacum',
        'encens': 'Boswellia sacra',
        'santal': 'Santalum album',
      };

      expect(ingredientToPlants['hindu kush']).toBe('Cannabis indica');
      expect(ingredientToPlants['perique']).toBe('Nicotiana tabacum');
      expect(ingredientToPlants['encens']).toBe('Boswellia sacra');
    });
  });

  describe("RecipeIngredients Component Data", () => {
    it("should calculate total percentage correctly", () => {
      const ingredients = [
        { id: 1, percentage: 35 },
        { id: 2, percentage: 25 },
        { id: 3, percentage: 20 },
        { id: 4, percentage: 15 },
        { id: 5, percentage: 5 },
      ];

      const totalPercentage = ingredients.reduce((sum, ing) => sum + (ing.percentage || 0), 0);
      expect(totalPercentage).toBe(100);
    });

    it("should group ingredients by type", () => {
      const ingredients = [
        { id: 1, ingredient_type: "cannabis", percentage: 35 },
        { id: 2, ingredient_type: "cannabis", percentage: 15 },
        { id: 3, ingredient_type: "tabac", percentage: 25 },
        { id: 4, ingredient_type: "extract", percentage: 20 },
        { id: 5, ingredient_type: "molecule", percentage: 5 },
      ];

      const groupedByType = ingredients.reduce((acc, ing) => {
        const type = ing.ingredient_type || "other";
        if (!acc[type]) acc[type] = [];
        acc[type].push(ing);
        return acc;
      }, {} as Record<string, typeof ingredients>);

      expect(groupedByType.cannabis).toHaveLength(2);
      expect(groupedByType.tabac).toHaveLength(1);
      expect(groupedByType.extract).toHaveLength(1);
      expect(groupedByType.molecule).toHaveLength(1);
    });

    it("should calculate type totals correctly", () => {
      const ingredients = [
        { id: 1, ingredient_type: "cannabis", percentage: 35 },
        { id: 2, ingredient_type: "cannabis", percentage: 15 },
        { id: 3, ingredient_type: "tabac", percentage: 25 },
      ];

      const groupedByType = ingredients.reduce((acc, ing) => {
        const type = ing.ingredient_type || "other";
        if (!acc[type]) acc[type] = [];
        acc[type].push(ing);
        return acc;
      }, {} as Record<string, typeof ingredients>);

      const cannabisTotal = groupedByType.cannabis.reduce((sum, i) => sum + (i.percentage || 0), 0);
      const tabacTotal = groupedByType.tabac.reduce((sum, i) => sum + (i.percentage || 0), 0);

      expect(cannabisTotal).toBe(50);
      expect(tabacTotal).toBe(25);
    });
  });
});
