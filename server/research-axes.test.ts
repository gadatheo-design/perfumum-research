import { describe, it, expect, beforeAll } from 'vitest';
import * as db from './db';

describe('Research Axes Database Functions', () => {
  describe('getAllResearchAxes', () => {
    it('should return all research axes', async () => {
      const axes = await db.getAllResearchAxes();
      expect(axes).toBeDefined();
      expect(Array.isArray(axes)).toBe(true);
      // We inserted 5 axes during setup
      expect(axes.length).toBeGreaterThanOrEqual(5);
    });

    it('should return axes with required fields', async () => {
      const axes = await db.getAllResearchAxes();
      if (axes.length > 0) {
        const axis = axes[0];
        expect(axis).toHaveProperty('id');
        expect(axis).toHaveProperty('code');
        expect(axis).toHaveProperty('name');
        expect(axis).toHaveProperty('shortName');
        expect(axis).toHaveProperty('description');
        expect(axis).toHaveProperty('color');
      }
    });
  });

  describe('getResearchAxisByCode', () => {
    it('should return axis by code AX1', async () => {
      const axis = await db.getResearchAxisByCode('AX1');
      expect(axis).toBeDefined();
      expect(axis?.code).toBe('AX1');
      expect(axis?.shortName).toBe('Neurosciences');
    });

    it('should return axis by code AX2', async () => {
      const axis = await db.getResearchAxisByCode('AX2');
      expect(axis).toBeDefined();
      expect(axis?.code).toBe('AX2');
      expect(axis?.shortName).toBe('Biotechnologie');
    });

    it('should return null for non-existent code', async () => {
      const axis = await db.getResearchAxisByCode('NONEXISTENT');
      expect(axis).toBeNull();
    });
  });

  describe('getResearchAxisById', () => {
    it('should return axis by valid ID', async () => {
      const axes = await db.getAllResearchAxes();
      if (axes.length > 0) {
        const firstAxis = axes[0];
        const axis = await db.getResearchAxisById(firstAxis.id);
        expect(axis).toBeDefined();
        expect(axis?.id).toBe(firstAxis.id);
      }
    });

    it('should return null for non-existent ID', async () => {
      const axis = await db.getResearchAxisById(999999);
      expect(axis).toBeNull();
    });
  });
});

describe('Research Entries Database Functions', () => {
  describe('getAllResearchEntries', () => {
    it('should return entries array (may be empty initially)', async () => {
      const entries = await db.getAllResearchEntries();
      expect(entries).toBeDefined();
      expect(Array.isArray(entries)).toBe(true);
    });

    it('should filter by axisId when provided', async () => {
      const axes = await db.getAllResearchAxes();
      if (axes.length > 0) {
        const entries = await db.getAllResearchEntries({ axisId: axes[0].id });
        expect(entries).toBeDefined();
        expect(Array.isArray(entries)).toBe(true);
      }
    });
  });
});

describe('Research Tags Database Functions', () => {
  describe('getAllResearchTags', () => {
    it('should return tags array (may be empty initially)', async () => {
      const tags = await db.getAllResearchTags();
      expect(tags).toBeDefined();
      expect(Array.isArray(tags)).toBe(true);
    });
  });
});

describe('Bibliography Database Functions', () => {
  describe('getAllBibliographySources', () => {
    it('should return sources array (may be empty initially)', async () => {
      const sources = await db.getAllBibliographySources();
      expect(sources).toBeDefined();
      expect(Array.isArray(sources)).toBe(true);
    });

    it('should filter by sourceType when provided', async () => {
      const sources = await db.getAllBibliographySources({ sourceType: 'scientific_paper' });
      expect(sources).toBeDefined();
      expect(Array.isArray(sources)).toBe(true);
    });
  });

  describe('getBibliographyStats', () => {
    it('should return statistics object', async () => {
      const stats = await db.getBibliographyStats();
      expect(stats).toBeDefined();
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('byType');
      expect(stats).toHaveProperty('byYear');
      expect(typeof stats.total).toBe('number');
      expect(Array.isArray(stats.byType)).toBe(true);
      expect(Array.isArray(stats.byYear)).toBe(true);
    });
  });

  describe('searchBibliographySources', () => {
    it('should return array for search query', async () => {
      const results = await db.searchBibliographySources('test');
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });
  });
});
