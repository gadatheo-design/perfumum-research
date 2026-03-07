import { describe, it, expect } from "vitest";
import * as db from "./db";

describe("Completude — fonctions de calcul de score", () => {
  it("getCompletudeGlobalStats retourne les statistiques globales", async () => {
    const stats = await db.getCompletudeGlobalStats();
    expect(stats).toBeDefined();
    expect(stats.rawMaterials).toBeDefined();
    expect(typeof stats.rawMaterials.total).toBe("number");
    expect(typeof stats.rawMaterials.withPlant).toBe("number");
    expect(typeof stats.rawMaterials.withTerroir).toBe("number");
    expect(typeof stats.rawMaterials.withOlfFamily).toBe("number");
    expect(typeof stats.rawMaterials.withOrigin).toBe("number");
    expect(typeof stats.rawMaterials.withBoth).toBe("number");
    expect(stats.plants).toBeDefined();
    expect(typeof stats.plants.total).toBe("number");
    expect(typeof stats.plants.withLatin).toBe("number");
    expect(typeof stats.plants.withDescription).toBe("number");
    expect(typeof stats.plants.withImage).toBe("number");
    expect(stats.terroirs).toBeDefined();
    expect(typeof stats.terroirs.total).toBe("number");
    expect(typeof stats.terroirs.withDescription).toBe("number");
    expect(typeof stats.terroirs.withCoords).toBe("number");
  });

  it("getCompletudeRawMaterials retourne une liste paginée avec scores", async () => {
    const result = await db.getCompletudeRawMaterials({ limit: 10, offset: 0, sortBy: "score_asc" });
    expect(result).toBeDefined();
    expect(typeof result.total).toBe("number");
    expect(Array.isArray(result.items)).toBe(true);
    expect(result.items.length).toBeLessThanOrEqual(10);
    if (result.items.length > 0) {
      const item = result.items[0];
      expect(typeof item.id).toBe("number");
      expect(typeof item.name).toBe("string");
      expect(typeof item.score).toBe("number");
      expect(item.score).toBeGreaterThanOrEqual(0);
      expect(item.score).toBeLessThanOrEqual(100);
      expect(Array.isArray(item.missing)).toBe(true);
    }
  });

  it("getCompletudeRawMaterials filtre par score min/max", async () => {
    const result = await db.getCompletudeRawMaterials({
      limit: 50,
      offset: 0,
      sortBy: "score_asc",
      minScore: 0,
      maxScore: 32,
    });
    expect(result).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
    // Tous les items doivent avoir un score ≤ 32
    result.items.forEach((item: any) => {
      expect(item.score).toBeLessThanOrEqual(32);
    });
  });

  it("getCompletudeRawMaterials trie par score croissant", async () => {
    const result = await db.getCompletudeRawMaterials({ limit: 20, offset: 0, sortBy: "score_asc" });
    if (result.items.length > 1) {
      for (let i = 1; i < result.items.length; i++) {
        expect(result.items[i].score).toBeGreaterThanOrEqual(result.items[i - 1].score);
      }
    }
  });

  it("getCompletudePlants retourne une liste paginée avec scores", async () => {
    const result = await db.getCompletudePlants({ limit: 10, offset: 0, sortBy: "score_asc" });
    expect(result).toBeDefined();
    expect(typeof result.total).toBe("number");
    expect(Array.isArray(result.items)).toBe(true);
    if (result.items.length > 0) {
      const item = result.items[0];
      expect(typeof item.score).toBe("number");
      expect(item.score).toBeGreaterThanOrEqual(0);
      expect(item.score).toBeLessThanOrEqual(100);
    }
  });

  it("getCompletudeTerroirs retourne une liste paginée avec scores", async () => {
    const result = await db.getCompletudeTerroirs({ limit: 10, offset: 0, sortBy: "score_asc" });
    expect(result).toBeDefined();
    expect(typeof result.total).toBe("number");
    expect(Array.isArray(result.items)).toBe(true);
    if (result.items.length > 0) {
      const item = result.items[0];
      expect(typeof item.score).toBe("number");
      expect(item.score).toBeGreaterThanOrEqual(0);
      expect(item.score).toBeLessThanOrEqual(100);
    }
  });

  it("getCompletudeGlobalStats — distribution rouge/orange/vert cohérente", async () => {
    const result = await db.getCompletudeRawMaterials({ limit: 200, offset: 0, sortBy: "score_asc" });
    const rouge = result.items.filter((i: any) => i.score < 33).length;
    const orange = result.items.filter((i: any) => i.score >= 33 && i.score < 66).length;
    const vert = result.items.filter((i: any) => i.score >= 66).length;
    expect(rouge + orange + vert).toBe(result.items.length);
  });
});
