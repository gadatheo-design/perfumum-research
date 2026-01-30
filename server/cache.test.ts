import { describe, it, expect, beforeEach } from "vitest";
import { 
  cache, 
  CACHE_KEYS, 
  CACHE_TTL, 
  withCache,
  invalidateMoleculeCache,
  invalidatePlantCache,
  invalidateRecetteCache,
  invalidateAllCache
} from "./cache";

describe("Memory Cache System", () => {
  beforeEach(() => {
    // Nettoyer le cache avant chaque test
    invalidateAllCache();
  });

  describe("Basic Operations", () => {
    it("should store and retrieve values", () => {
      cache.set("test:key", { name: "test", value: 42 });
      const result = cache.get<{ name: string; value: number }>("test:key");
      
      expect(result).not.toBeNull();
      expect(result?.name).toBe("test");
      expect(result?.value).toBe(42);
    });

    it("should return null for non-existent keys", () => {
      const result = cache.get("non:existent:key");
      expect(result).toBeNull();
    });

    it("should invalidate specific keys", () => {
      cache.set("test:key1", "value1");
      cache.set("test:key2", "value2");
      
      cache.invalidate("test:key1");
      
      expect(cache.get("test:key1")).toBeNull();
      expect(cache.get("test:key2")).toBe("value2");
    });

    it("should invalidate keys matching a pattern", () => {
      cache.set("molecules:list", []);
      cache.set("molecules:count", 100);
      cache.set("plants:list", []);
      
      const count = cache.invalidatePattern("^molecules:");
      
      expect(count).toBe(2);
      expect(cache.get("molecules:list")).toBeNull();
      expect(cache.get("molecules:count")).toBeNull();
      expect(cache.get("plants:list")).not.toBeNull();
    });

    it("should clear all entries", () => {
      cache.set("key1", "value1");
      cache.set("key2", "value2");
      cache.set("key3", "value3");
      
      cache.clear();
      
      expect(cache.get("key1")).toBeNull();
      expect(cache.get("key2")).toBeNull();
      expect(cache.get("key3")).toBeNull();
    });
  });

  describe("TTL (Time To Live)", () => {
    it("should expire entries after TTL", async () => {
      // Utiliser un TTL très court pour le test
      cache.set("short:ttl", "value", 50); // 50ms TTL
      
      expect(cache.get("short:ttl")).toBe("value");
      
      // Attendre que le TTL expire
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(cache.get("short:ttl")).toBeNull();
    });
  });

  describe("Cache Statistics", () => {
    it("should track hits and misses", () => {
      cache.set("stats:test", "value");
      
      // Hit
      cache.get("stats:test");
      cache.get("stats:test");
      
      // Miss
      cache.get("non:existent");
      
      const stats = cache.getStats();
      
      expect(stats.hits).toBeGreaterThanOrEqual(2);
      expect(stats.misses).toBeGreaterThanOrEqual(1);
      expect(stats.hitRate).toBeDefined();
    });
  });

  describe("Cache Keys", () => {
    it("should generate correct cache keys", () => {
      expect(CACHE_KEYS.MOLECULES_LIST).toBe("molecules:list");
      expect(CACHE_KEYS.MOLECULE_DETAIL(42)).toBe("molecule:42");
      expect(CACHE_KEYS.SEARCH_GLOBAL("limonene")).toBe("search:global:limonene");
    });
  });

  describe("Cache TTL Constants", () => {
    it("should have correct TTL values", () => {
      expect(CACHE_TTL.SHORT).toBe(60000);      // 1 minute
      expect(CACHE_TTL.MEDIUM).toBe(300000);    // 5 minutes
      expect(CACHE_TTL.LONG).toBe(900000);      // 15 minutes
      expect(CACHE_TTL.VERY_LONG).toBe(3600000); // 1 hour
    });
  });

  describe("withCache Helper", () => {
    it("should cache function results", async () => {
      let callCount = 0;
      const expensiveFunction = async () => {
        callCount++;
        return { result: "expensive computation" };
      };

      // Premier appel - devrait exécuter la fonction
      const result1 = await withCache("expensive:key", expensiveFunction);
      expect(result1.result).toBe("expensive computation");
      expect(callCount).toBe(1);

      // Deuxième appel - devrait utiliser le cache
      const result2 = await withCache("expensive:key", expensiveFunction);
      expect(result2.result).toBe("expensive computation");
      expect(callCount).toBe(1); // Pas d'appel supplémentaire
    });
  });

  describe("Invalidation Helpers", () => {
    it("should invalidate molecule cache", () => {
      cache.set(CACHE_KEYS.MOLECULES_LIST, []);
      cache.set(CACHE_KEYS.MOLECULES_COUNT, 100);
      cache.set(CACHE_KEYS.MOLECULE_DETAIL(1), {});
      cache.set(CACHE_KEYS.SEARCH_GLOBAL("test"), []);
      cache.set(CACHE_KEYS.STATS_GLOBAL, {});
      
      invalidateMoleculeCache(1);
      
      expect(cache.get(CACHE_KEYS.MOLECULES_LIST)).toBeNull();
      expect(cache.get(CACHE_KEYS.MOLECULES_COUNT)).toBeNull();
      expect(cache.get(CACHE_KEYS.MOLECULE_DETAIL(1))).toBeNull();
      expect(cache.get(CACHE_KEYS.SEARCH_GLOBAL("test"))).toBeNull();
      expect(cache.get(CACHE_KEYS.STATS_GLOBAL)).toBeNull();
    });

    it("should invalidate plant cache", () => {
      cache.set(CACHE_KEYS.PLANTS_LIST, []);
      cache.set(CACHE_KEYS.PLANTS_COUNT, 50);
      cache.set(CACHE_KEYS.PLANT_DETAIL(1), {});
      
      invalidatePlantCache(1);
      
      expect(cache.get(CACHE_KEYS.PLANTS_LIST)).toBeNull();
      expect(cache.get(CACHE_KEYS.PLANTS_COUNT)).toBeNull();
      expect(cache.get(CACHE_KEYS.PLANT_DETAIL(1))).toBeNull();
    });

    it("should invalidate recette cache", () => {
      cache.set(CACHE_KEYS.RECETTES_LIST, []);
      cache.set(CACHE_KEYS.RECETTES_COUNT, 25);
      cache.set(CACHE_KEYS.RECETTE_DETAIL(1), {});
      
      invalidateRecetteCache(1);
      
      expect(cache.get(CACHE_KEYS.RECETTES_LIST)).toBeNull();
      expect(cache.get(CACHE_KEYS.RECETTES_COUNT)).toBeNull();
      expect(cache.get(CACHE_KEYS.RECETTE_DETAIL(1))).toBeNull();
    });
  });
});
