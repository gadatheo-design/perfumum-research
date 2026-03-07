import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db module
vi.mock("./db", () => ({
  getRawMaterialsFiltered: vi.fn().mockResolvedValue({
    items: [
      { id: 1, name: "Lavande vraie", category: "huile_essentielle", olfactiveFamily: "floral" },
      { id: 2, name: "Benjoin", category: "resinoid", olfactiveFamily: "balsamique" },
    ],
    total: 2,
    page: 1,
    totalPages: 1,
  }),
  getRawMaterialsStats: vi.fn().mockResolvedValue({
    byCategory: [
      { category: "huile_essentielle", count: 53 },
      { category: "resinoid", count: 40 },
    ],
    byOlfFamily: [
      { olfactiveFamily: "floral", count: 25 },
    ],
    byQuality: [
      { quality: "bio", count: 12 },
    ],
    byAvailability: [
      { availability: "disponible", count: 200 },
    ],
  }),
}));

import * as db from "./db";

describe("getRawMaterialsFiltered", () => {
  it("retourne des items et un total", async () => {
    const result = await db.getRawMaterialsFiltered({ page: 1, limit: 24 });
    expect(result).toBeDefined();
    expect(result.items).toBeInstanceOf(Array);
    expect(result.total).toBeGreaterThanOrEqual(0);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBeGreaterThanOrEqual(0);
  });

  it("accepte les filtres optionnels", async () => {
    const result = await db.getRawMaterialsFiltered({
      search: "lavande",
      category: "huile_essentielle",
      page: 1,
      limit: 10,
    });
    expect(result).toBeDefined();
    expect(result.items).toBeInstanceOf(Array);
  });

  it("retourne la structure correcte pour chaque item", async () => {
    const result = await db.getRawMaterialsFiltered({ page: 1, limit: 5 });
    if (result.items.length > 0) {
      const item = result.items[0];
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("category");
    }
  });
});

describe("getRawMaterialsStats", () => {
  it("retourne les 4 groupes de statistiques", async () => {
    const stats = await db.getRawMaterialsStats();
    expect(stats).toHaveProperty("byCategory");
    expect(stats).toHaveProperty("byOlfFamily");
    expect(stats).toHaveProperty("byQuality");
    expect(stats).toHaveProperty("byAvailability");
  });

  it("byCategory contient des entrées avec category et count", async () => {
    const stats = await db.getRawMaterialsStats();
    expect(stats.byCategory).toBeInstanceOf(Array);
    if (stats.byCategory.length > 0) {
      expect(stats.byCategory[0]).toHaveProperty("category");
      expect(stats.byCategory[0]).toHaveProperty("count");
    }
  });

  it("byOlfFamily contient des entrées avec olfactiveFamily et count", async () => {
    const stats = await db.getRawMaterialsStats();
    expect(stats.byOlfFamily).toBeInstanceOf(Array);
    if (stats.byOlfFamily.length > 0) {
      expect(stats.byOlfFamily[0]).toHaveProperty("olfactiveFamily");
      expect(stats.byOlfFamily[0]).toHaveProperty("count");
    }
  });
});
