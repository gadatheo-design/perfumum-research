import { describe, it, expect } from "vitest";
import * as db from "./db";

describe("Tagetes lucida Recipes - Session 06 Jan 2026", () => {
  
  describe("Import des recettes Tagetes lucida", () => {
    it("should have imported at least 5 Tagetes lucida recipes (TL-01 to TL-05)", async () => {
      const result = await db.getAllRecettes();
      const tagetesRecipes = result.filter((r: any) => r.name && r.name.includes("TL-"));
      
      expect(tagetesRecipes.length).toBeGreaterThanOrEqual(5);
    });

    it("should have TL-01 Pericón Anisé recipe", async () => {
      const result = await db.getAllRecettes();
      const tl01 = result.find((r: any) => r.name && r.name.includes("TL-01"));
      
      expect(tl01).toBeDefined();
      expect(tl01?.name).toContain("Pericón Anisé");
      expect(tl01?.category).toBe("parfum");
    });

    it("should have TL-04 Encens Pericón recipe with encens category", async () => {
      const result = await db.getAllRecettes();
      const tl04 = result.find((r: any) => r.name && r.name.includes("TL-04"));
      
      expect(tl04).toBeDefined();
      expect(tl04?.name).toContain("Encens Pericón");
      expect(tl04?.category).toBe("encens");
    });

    it("should have TL-05 Synergie Vent-Herbacé recipe with extrait category", async () => {
      const result = await db.getAllRecettes();
      const tl05 = result.find((r: any) => r.name && r.name.includes("TL-05"));
      
      expect(tl05).toBeDefined();
      expect(tl05?.name).toContain("Synergie Vent-Herbacé");
      expect(tl05?.category).toBe("extrait");
    });
  });

  describe("Propriétés des recettes Tagetes", () => {
    it("should have gamme set to Colombie - San Andrés for all Tagetes recipes", async () => {
      const result = await db.getAllRecettes();
      const tagetesRecipes = result.filter((r: any) => r.name && r.name.includes("TL-"));
      
      for (const recipe of tagetesRecipes) {
        expect(recipe.gamme).toBe("Colombie - San Andrés");
      }
    });

    it("should have experimental status for all Tagetes recipes", async () => {
      const result = await db.getAllRecettes();
      const tagetesRecipes = result.filter((r: any) => r.name && r.name.includes("TL-"));
      
      for (const recipe of tagetesRecipes) {
        expect(recipe.status).toBe("experimental");
      }
    });

    it("should have formula JSON for TL-01", async () => {
      const result = await db.getAllRecettes();
      const tl01 = result.find((r: any) => r.name && r.name.includes("TL-01"));
      
      expect(tl01).toBeDefined();
      expect(tl01?.formula).toBeDefined();
      
      // Parse formula JSON
      const formula = JSON.parse(tl01?.formula || "{}");
      expect(formula["Tagetes lucida HE (D2)"]).toBeDefined();
      expect(formula["Estragole"]).toBeDefined();
    });
  });

  describe("Contenu des recettes", () => {
    it("should have description for all Tagetes recipes", async () => {
      const result = await db.getAllRecettes();
      const tagetesRecipes = result.filter((r: any) => r.name && r.name.includes("TL-"));
      
      for (const recipe of tagetesRecipes) {
        expect(recipe.description).toBeDefined();
        expect(recipe.description?.length).toBeGreaterThan(50);
      }
    });
  });
});
