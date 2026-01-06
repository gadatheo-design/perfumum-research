/**
 * Tests unitaires pour les fonctionnalités d'enrichissement du corpus
 * - Fragments textuels avec vrais textes historiques
 * - Routes commerciales avec filtres
 * - Filtres avancés du corpus
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as db from './db';

describe('Text Fragments (Fragments textuels historiques)', () => {
  describe('getAllTextFragments', () => {
    it('should return all text fragments', async () => {
      const fragments = await db.getAllTextFragments();
      expect(fragments).toBeDefined();
      expect(Array.isArray(fragments)).toBe(true);
    });

    it('should return fragments with required fields', async () => {
      const fragments = await db.getAllTextFragments();
      if (fragments.length > 0) {
        const fragment = fragments[0];
        expect(fragment).toHaveProperty('fragment_id');
        expect(fragment).toHaveProperty('manuscript_id');
        expect(fragment).toHaveProperty('language');
      }
    });

    it('should filter by language', async () => {
      const latinFragments = await db.getAllTextFragments({ language: 'latin' });
      expect(latinFragments).toBeDefined();
      expect(Array.isArray(latinFragments)).toBe(true);
      latinFragments.forEach(f => {
        expect(f.language).toBe('latin');
      });
    });

    it('should filter by evidence level', async () => {
      const confirmedFragments = await db.getAllTextFragments({ evidenceLevel: 'confirmed' });
      expect(confirmedFragments).toBeDefined();
      expect(Array.isArray(confirmedFragments)).toBe(true);
      confirmedFragments.forEach(f => {
        expect(f.evidence_level).toBe('confirmed');
      });
    });
  });

  describe('getTextFragmentById', () => {
    it('should return null for non-existent id', async () => {
      const fragment = await db.getTextFragmentById(999999);
      expect(fragment).toBeNull();
    });

    it('should return fragment with parsed entities', async () => {
      const fragments = await db.getAllTextFragments();
      if (fragments.length > 0) {
        const fragment = await db.getTextFragmentById(fragments[0].id);
        expect(fragment).toBeDefined();
        if (fragment?.entities) {
          expect(Array.isArray(fragment.entities)).toBe(true);
        }
      }
    });
  });

  describe('getTextFragmentStats', () => {
    it('should return statistics about text fragments', async () => {
      const stats = await db.getTextFragmentStats();
      expect(stats).toBeDefined();
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('byLanguage');
      expect(stats).toHaveProperty('byEvidenceLevel');
      expect(stats).toHaveProperty('byManuscript');
    });

    it('should have valid total count', async () => {
      const stats = await db.getTextFragmentStats();
      expect(typeof stats?.total).toBe('number');
      expect(stats?.total).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('Trade Routes (Routes commerciales)', () => {
  describe('getAllTradeRoutes', () => {
    it('should return all trade routes', async () => {
      const routes = await db.getAllTradeRoutes();
      expect(routes).toBeDefined();
      expect(Array.isArray(routes)).toBe(true);
    });

    it('should return routes with required fields', async () => {
      const routes = await db.getAllTradeRoutes();
      if (routes.length > 0) {
        const route = routes[0];
        expect(route).toHaveProperty('route_id');
        expect(route).toHaveProperty('name');
        expect(route).toHaveProperty('nodes');
      }
    });

    it('should return routes with parsed nodes array', async () => {
      const routes = await db.getAllTradeRoutes();
      if (routes.length > 0) {
        const route = routes[0];
        expect(Array.isArray(route.nodes)).toBe(true);
      }
    });

    it('should filter by period', async () => {
      const routes = await db.getAllTradeRoutes({ periodStart: -500, periodEnd: 500 });
      expect(routes).toBeDefined();
      expect(Array.isArray(routes)).toBe(true);
    });

    it('should filter by material', async () => {
      const routes = await db.getAllTradeRoutes({ material: 'frankincense' });
      expect(routes).toBeDefined();
      expect(Array.isArray(routes)).toBe(true);
    });
  });

  describe('getTradeRouteById', () => {
    it('should return null for non-existent id', async () => {
      const route = await db.getTradeRouteById(999999);
      expect(route).toBeNull();
    });

    it('should return route with all parsed JSON fields', async () => {
      const routes = await db.getAllTradeRoutes();
      if (routes.length > 0) {
        const route = await db.getTradeRouteById(routes[0].id);
        expect(route).toBeDefined();
        expect(Array.isArray(route?.nodes)).toBe(true);
        expect(Array.isArray(route?.materials)).toBe(true);
        expect(Array.isArray(route?.sources)).toBe(true);
      }
    });
  });

  describe('getTradeRouteStats', () => {
    it('should return statistics about trade routes', async () => {
      const stats = await db.getTradeRouteStats();
      expect(stats).toBeDefined();
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('materials');
      expect(stats).toHaveProperty('regions');
      expect(stats).toHaveProperty('periods');
    });

    it('should have valid materials array', async () => {
      const stats = await db.getTradeRouteStats();
      expect(Array.isArray(stats?.materials)).toBe(true);
    });

    it('should have valid regions array', async () => {
      const stats = await db.getTradeRouteStats();
      expect(Array.isArray(stats?.regions)).toBe(true);
    });
  });
});

describe('Corpus Advanced Filters (Filtres avancés)', () => {
  describe('getCorpusWithAdvancedFilters', () => {
    it('should return all entity types', async () => {
      const results = await db.getCorpusWithAdvancedFilters({});
      expect(results).toBeDefined();
      expect(results).toHaveProperty('plants');
      expect(results).toHaveProperty('molecules');
      expect(results).toHaveProperty('fragments');
      expect(results).toHaveProperty('routes');
      expect(results).toHaveProperty('manuscripts');
    });

    it('should return arrays for all entity types', async () => {
      const results = await db.getCorpusWithAdvancedFilters({});
      expect(Array.isArray(results.plants)).toBe(true);
      expect(Array.isArray(results.molecules)).toBe(true);
      expect(Array.isArray(results.fragments)).toBe(true);
      expect(Array.isArray(results.routes)).toBe(true);
      expect(Array.isArray(results.manuscripts)).toBe(true);
    });

    it('should filter by axis', async () => {
      const results = await db.getCorpusWithAdvancedFilters({ 
        axisId: 'AX2_ETHNOBOTANY_COMP' 
      });
      expect(results).toBeDefined();
      expect(Array.isArray(results.fragments)).toBe(true);
    });

    it('should filter by period', async () => {
      const results = await db.getCorpusWithAdvancedFilters({ 
        period: { start: -1000, end: 1000 } 
      });
      expect(results).toBeDefined();
      expect(Array.isArray(results.routes)).toBe(true);
    });

    it('should filter by region', async () => {
      const results = await db.getCorpusWithAdvancedFilters({ 
        region: 'Arabia' 
      });
      expect(results).toBeDefined();
      // Routes should be filtered by region in nodes
      expect(Array.isArray(results.routes)).toBe(true);
    });

    it('should combine multiple filters', async () => {
      const results = await db.getCorpusWithAdvancedFilters({ 
        period: { start: -500, end: 500 },
        region: 'Arabia'
      });
      expect(results).toBeDefined();
      expect(Array.isArray(results.plants)).toBe(true);
      expect(Array.isArray(results.molecules)).toBe(true);
      expect(Array.isArray(results.fragments)).toBe(true);
      expect(Array.isArray(results.routes)).toBe(true);
      expect(Array.isArray(results.manuscripts)).toBe(true);
    });
  });
});
