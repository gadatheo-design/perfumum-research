import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";

describe("Session 06 Jan 2026 - Enrichissement avancé", () => {
  
  describe("Phase 1: ISBN des références bibliographiques", () => {
    it("should have ISBN for Fragrances of the World (Edwards)", async () => {
      const result = await db.getAllBibliographyEntries();
      const edwards = result.entries.find(e => e.entryKey === "perfumum_edwards2019");
      expect(edwards).toBeDefined();
      expect(edwards?.isbn).toBe("978-0980860061");
    });

    it("should have ISBN for West African Herbal Pharmacopoeia (WAHO)", async () => {
      const result = await db.getAllBibliographyEntries();
      const waho = result.entries.find(e => e.entryKey === "perfumum_waho2013");
      expect(waho).toBeDefined();
      expect(waho?.isbn).toBe("978-9988-1-8015-7");
    });

    it("should have ISBN for The Essential Oils (Guenther)", async () => {
      const result = await db.getAllBibliographyEntries();
      const guenther = result.entries.find(e => e.entryKey === "perfumum_guenther1948");
      expect(guenther).toBeDefined();
      expect(guenther?.isbn).toBe("978-0894647734");
    });

    it("should have ISBN for Useful Plants of West Tropical Africa (Burkill)", async () => {
      const result = await db.getAllBibliographyEntries();
      const burkill = result.entries.find(e => e.entryKey === "perfumum_burkill1985");
      expect(burkill).toBeDefined();
      expect(burkill?.isbn).toBe("978-0947643010");
    });

    it("should have ISBN and DOI for Aroma Chemicals IV: Musks (Kraft)", async () => {
      const result = await db.getAllBibliographyEntries();
      const kraft = result.entries.find(e => e.entryKey === "perfumum_kraft2000");
      expect(kraft).toBeDefined();
      expect(kraft?.isbn).toBe("978-1405114509");
      expect(kraft?.doi).toBe("10.1002/9781444305517.ch7");
    });

    it("should have ISBN and DOI for Essential Oils Colombia (Stashenko)", async () => {
      const result = await db.getAllBibliographyEntries();
      const stashenko = result.entries.find(e => e.entryKey === "perfumum_stashenko2019");
      expect(stashenko).toBeDefined();
      expect(stashenko?.isbn).toBe("978-1-78984-641-6");
      expect(stashenko?.doi).toBe("10.5772/intechopen.87199");
    });
  });

  describe("Phase 2: Plantes avec coordonnées GPS", () => {
    it("should return plants with GPS coordinates", async () => {
      const plantsWithGPS = await db.getPlantsWithGPS();
      expect(plantsWithGPS).toBeDefined();
      expect(Array.isArray(plantsWithGPS)).toBe(true);
      
      // Toutes les plantes retournées doivent avoir des coordonnées
      for (const plant of plantsWithGPS) {
        expect(plant.latitude).not.toBeNull();
        expect(plant.longitude).not.toBeNull();
      }
    });

    it("should filter plants by category with GPS", async () => {
      const aromaticPlants = await db.getPlantsWithGPSByCategory("aromatique");
      expect(aromaticPlants).toBeDefined();
      expect(Array.isArray(aromaticPlants)).toBe(true);
      
      // Toutes les plantes doivent être de catégorie aromatique
      for (const plant of aromaticPlants) {
        expect(plant.category).toBe("aromatique");
        expect(plant.latitude).not.toBeNull();
        expect(plant.longitude).not.toBeNull();
      }
    });

    it("should have plants in multiple categories", async () => {
      const categories = ["aromatique", "tabac", "cannabis", "resine"];
      
      for (const category of categories) {
        const plants = await db.getPlantsByCategory(category);
        expect(plants.length).toBeGreaterThan(0);
      }
    });
  });

  describe("Phase 3: Liaisons Tagetes lucida - Molécules", () => {
    // NOTE: ID mis à jour après nettoyage de la base (18/03/2026)
    // Tagetes lucida est maintenant à l'ID 630012 (nom: "Pericón (Tagetes lucida)")
    const TAGETES_LUCIDA_ID = 630012;

    it("should have Tagetes lucida (Pericón) in database", async () => {
      const plant = await db.getPlantById(TAGETES_LUCIDA_ID);
      expect(plant).toBeDefined();
      expect(plant?.latinName).toBe("Tagetes lucida");
    });

    it("should have molecules linked to Tagetes lucida", async () => {
      const moleculeLinks = await db.getPlantMolecules(TAGETES_LUCIDA_ID);
      expect(moleculeLinks).toBeDefined();
      expect(Array.isArray(moleculeLinks)).toBe(true);
      // 37 liaisons confirmées en base (18/03/2026)
      expect(moleculeLinks.length).toBeGreaterThanOrEqual(4);
      
      // Vérifier les molécules clés (Estragole ID 630002, Anéthole ID 870001)
      const moleculeNames = moleculeLinks.map(m => m.molecule?.name);
      expect(moleculeNames).toContain("Estragole");
      expect(moleculeNames).toContain("Anéthole");
    });

    it("should have Anéthole molecule in database", async () => {
      // ID 870001 — inchangé
      const molecule = await db.getMoleculeById(870001);
      expect(molecule).toBeDefined();
      expect(molecule?.name).toBe("Anéthole");
      expect(molecule?.casNumber).toBe("4180-23-8");
    });

    it("should have Estragole molecule in database", async () => {
      // ID 630002 — remplace Méthyl-eugénol (ID 660003 supprimé lors du nettoyage)
      const molecule = await db.getMoleculeById(630002);
      expect(molecule).toBeDefined();
      expect(molecule?.name).toBe("Estragole");
      expect(molecule?.casNumber).toBe("140-67-0");
    });
  });
});
