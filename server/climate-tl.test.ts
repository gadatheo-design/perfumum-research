import { describe, it, expect } from "vitest";
import * as db from "./db";

describe("Enrichissement des données climatiques des plantes", () => {
  it("devrait avoir des données climatiques pour toutes les plantes", async () => {
    const plants = await db.getAllPlants();
    
    expect(plants.length).toBeGreaterThan(0);
    
    // Vérifier que toutes les plantes ont des données Köppen
    const plantsWithKoppen = plants.filter((p: any) => p.koppenZone !== null);
    expect(plantsWithKoppen.length).toBe(plants.length);
  });

  it("devrait avoir des zones Köppen valides", async () => {
    const validKoppenZones = ["Af", "Am", "Aw", "BWh", "BWk", "BSh", "BSk", "Csa", "Csb", "Cwa", "Cwb", "Cfa", "Cfb", "Cfc", "Dsa", "Dsb", "Dsc", "Dsd", "Dwa", "Dwb", "Dwc", "Dwd", "Dfa", "Dfb", "Dfc", "Dfd", "ET", "EF"];
    
    const plants = await db.getAllPlants();
    const plantsWithKoppen = plants.filter((p: any) => p.koppenZone !== null).slice(0, 20);

    for (const plant of plantsWithKoppen) {
      expect(validKoppenZones).toContain(plant.koppenZone);
    }
  });

  it("devrait avoir des plages de latitude valides", async () => {
    const plants = await db.getAllPlants();
    const plantsWithLatitude = plants.filter((p: any) => 
      p.latitudeMin !== null && p.latitudeMax !== null
    ).slice(0, 20);

    for (const plant of plantsWithLatitude) {
      const latMin = Number(plant.latitudeMin);
      const latMax = Number(plant.latitudeMax);
      expect(latMin).toBeLessThanOrEqual(latMax);
      expect(latMin).toBeGreaterThanOrEqual(-90);
      expect(latMax).toBeLessThanOrEqual(90);
    }
  });

  it("devrait avoir des données de précipitations valides", async () => {
    const plants = await db.getAllPlants();
    const plantsWithPrecip = plants.filter((p: any) => 
      p.precipitationMin !== null && p.precipitationMax !== null
    ).slice(0, 20);

    for (const plant of plantsWithPrecip) {
      const precipMin = Number(plant.precipitationMin);
      const precipMax = Number(plant.precipitationMax);
      expect(precipMin).toBeLessThanOrEqual(precipMax);
      expect(precipMin).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("Recettes TL (Tagetes lucida)", () => {
  it("devrait avoir 5 recettes TL dans la base de données", async () => {
    const allRecettes = await db.getAllRecettes();
    const tlRecettes = allRecettes.filter((r: any) => 
      r.id >= 450001 && r.id <= 450005
    );

    expect(tlRecettes.length).toBe(5);
  });

  it("devrait avoir des noms de recettes TL corrects", async () => {
    const allRecettes = await db.getAllRecettes();
    const tlRecettes = allRecettes.filter((r: any) => 
      r.id >= 450001 && r.id <= 450005
    ).sort((a: any, b: any) => a.id - b.id);

    for (const recette of tlRecettes) {
      expect(recette.name).toContain("TL-0");
    }
  });

  it("devrait avoir des formules JSON valides pour les recettes TL", async () => {
    const allRecettes = await db.getAllRecettes();
    const tlRecettes = allRecettes.filter((r: any) => 
      r.id >= 450001 && r.id <= 450005
    );

    for (const recette of tlRecettes) {
      if (recette.formula) {
        expect(() => JSON.parse(recette.formula as string)).not.toThrow();
        const parsed = JSON.parse(recette.formula as string);
        expect(typeof parsed).toBe("object");
      }
    }
  });

  it("devrait avoir des catégories valides pour les recettes TL", async () => {
    const validCategories = ["parfum", "encens", "extrait", "tabac", "resine", "resine_cbd", "cone"];
    
    const allRecettes = await db.getAllRecettes();
    const tlRecettes = allRecettes.filter((r: any) => 
      r.id >= 450001 && r.id <= 450005
    );

    for (const recette of tlRecettes) {
      if (recette.category) {
        expect(validCategories).toContain(recette.category);
      }
    }
  });
});
