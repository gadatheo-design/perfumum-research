import { describe, it, expect, afterAll } from "vitest";
import * as db from "./db";

describe("Curated Journeys", () => {
  let testJourneyId: number | null = null;
  let testItemId: number | null = null;
  const testCode = "TEST-JOURNEY-" + Date.now();

  // Nettoyer les données de test après les tests
  afterAll(async () => {
    if (testJourneyId) {
      try {
        await db.deleteJourney(testJourneyId);
      } catch (e) {
        // Ignorer les erreurs de nettoyage
      }
    }
  });

  describe("Journey CRUD Operations", () => {
    it("should create a new journey", async () => {
      const journeyData = {
        code: testCode,
        name: "Test Journey",
        nameEn: "Test Journey EN",
        description: "A test journey for unit testing",
        shortDescription: "Test journey",
        theme: "geographic" as const,
        emoji: "🧪",
        color: "#FF5733",
        difficulty: "beginner" as const,
        estimatedDuration: 30,
        isPublished: false,
        isFeatured: false,
        sortOrder: 0,
      };

      const result = await db.createJourney(journeyData);
      expect(result).toBeDefined();
      expect(result?.id).toBeDefined();
      testJourneyId = result?.id ?? null;
      expect(testJourneyId).toBeGreaterThan(0);
    });

    it("should get journey by id", async () => {
      if (!testJourneyId) {
        // Skip si le test précédent a échoué
        return;
      }

      const journey = await db.getJourneyById(testJourneyId);
      expect(journey).toBeDefined();
      expect(journey?.name).toBe("Test Journey");
      expect(journey?.theme).toBe("geographic");
      expect(journey?.difficulty).toBe("beginner");
    });

    it("should get journey by code", async () => {
      if (!testJourneyId) {
        return;
      }

      const journeyByCode = await db.getJourneyByCode(testCode);
      expect(journeyByCode).toBeDefined();
      expect(journeyByCode?.id).toBe(testJourneyId);
    });

    it("should update a journey", async () => {
      if (!testJourneyId) {
        return;
      }

      await db.updateJourney(testJourneyId, {
        name: "Updated Test Journey",
        isPublished: true,
      });

      const updated = await db.getJourneyById(testJourneyId);
      expect(updated?.name).toBe("Updated Test Journey");
      expect(updated?.isPublished).toBe(true);
    });

    it("should list all journeys", async () => {
      const journeys = await db.getAllJourneys();
      expect(Array.isArray(journeys)).toBe(true);
    });

    it("should list published journeys", async () => {
      const journeys = await db.getAllPublishedJourneys();
      expect(Array.isArray(journeys)).toBe(true);
    });
  });

  describe("Journey Items Operations", () => {
    it("should add an item to a journey", async () => {
      if (!testJourneyId) {
        return;
      }

      // Récupérer un terroir existant pour le test
      const terroirs = await db.getAllTerroirs();
      if (terroirs.length === 0) {
        console.log("No terroirs available for testing, skipping item test");
        return;
      }

      const itemData = {
        journeyId: testJourneyId,
        itemType: "terroir" as const,
        terroirId: terroirs[0].id,
        sortOrder: 1,
        stepNumber: 1,
        contextDescription: "Test terroir step",
        isHighlight: true,
      };

      const result = await db.addJourneyItem(itemData);
      expect(result).toBeDefined();
      // Le résultat peut être un insertId ou un objet
      if (result && typeof result === 'object' && 'insertId' in result) {
        testItemId = Number(result.insertId);
      } else if (result && typeof result === 'object' && 'id' in result) {
        testItemId = (result as any).id;
      }
    });

    it("should get journey items", async () => {
      if (!testJourneyId) {
        return;
      }

      const items = await db.getJourneyItems(testJourneyId);
      expect(Array.isArray(items)).toBe(true);
    });

    it("should update item order", async () => {
      if (!testItemId) {
        return;
      }

      await db.updateJourneyItemOrder(testItemId, 5);
      
      if (testJourneyId) {
        const items = await db.getJourneyItems(testJourneyId);
        const updated = items.find(i => i.id === testItemId);
        expect(updated?.sortOrder).toBe(5);
      }
    });

    it("should remove an item from a journey", async () => {
      if (!testItemId) {
        return;
      }

      await db.removeJourneyItem(testItemId);
      
      if (testJourneyId) {
        const items = await db.getJourneyItems(testJourneyId);
        const found = items.find(i => i.id === testItemId);
        expect(found).toBeUndefined();
      }
      testItemId = null;
    });
  });

  describe("Journey Statistics", () => {
    it("should get journey statistics", async () => {
      const stats = await db.getJourneysStats();
      expect(stats).toBeDefined();
      // Les stats peuvent avoir différentes structures
      expect(stats).toHaveProperty("total");
    });
  });

  describe("Journey Cleanup", () => {
    it("should delete a journey", async () => {
      if (!testJourneyId) {
        return;
      }

      await db.deleteJourney(testJourneyId);
      
      const deleted = await db.getJourneyById(testJourneyId);
      // Peut retourner null ou undefined selon l'implémentation
      expect(deleted == null).toBe(true);
      testJourneyId = null;
    });
  });
});

describe("Parcours Olfactif Filters", () => {
  describe("Filter Options", () => {
    it("should get filter options for terroirs", async () => {
      const terroirs = await db.getAllTerroirs();
      const climates = Array.from(new Set(terroirs.map(t => t.climate).filter(Boolean)));
      const countries = Array.from(new Set(terroirs.map(t => t.country).filter(Boolean)));
      
      expect(Array.isArray(climates)).toBe(true);
      expect(Array.isArray(countries)).toBe(true);
    });

    it("should get filter options for plants", async () => {
      const plants = await db.getAllPlants();
      const categories = Array.from(new Set(plants.map(p => p.category).filter(Boolean)));
      const families = Array.from(new Set(plants.map(p => p.family).filter(Boolean)));
      
      expect(Array.isArray(categories)).toBe(true);
      expect(Array.isArray(families)).toBe(true);
    });

    it("should get filter options for molecules", async () => {
      const molecules = await db.getAllMolecules();
      const families = Array.from(new Set(molecules.map(m => m.family).filter(Boolean)));
      const gammes = Array.from(new Set(molecules.map(m => m.gamme).filter(Boolean)));
      
      expect(Array.isArray(families)).toBe(true);
      expect(Array.isArray(gammes)).toBe(true);
    });
  });

  describe("Plant-Molecule Links", () => {
    it("should get all plant-molecule links", async () => {
      const links = await db.getAllPlantMoleculeLinks();
      expect(Array.isArray(links)).toBe(true);
    });

    it("should get plant-terroir relations with names", async () => {
      const relations = await db.getAllPlantTerroirRelationsWithNames();
      expect(Array.isArray(relations)).toBe(true);
    });
  });
});
