import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as db from './db';

describe('Contributor Interface - Duplicate Detection', () => {
  describe('findMoleculeDuplicates', () => {
    it('should return empty arrays when no search criteria provided', async () => {
      const result = await db.findMoleculeDuplicates({});
      expect(result).toHaveProperty('exact');
      expect(result).toHaveProperty('similar');
      expect(Array.isArray(result.exact)).toBe(true);
      expect(Array.isArray(result.similar)).toBe(true);
    });

    it('should find molecules by name', async () => {
      const result = await db.findMoleculeDuplicates({ name: 'Limonène' });
      expect(result).toHaveProperty('exact');
      expect(result).toHaveProperty('similar');
    });

    it('should find molecules by CAS number', async () => {
      const result = await db.findMoleculeDuplicates({ casNumber: '138-86-3' });
      expect(result).toHaveProperty('exact');
      expect(result).toHaveProperty('similar');
    });

    it('should handle partial name matches', async () => {
      const result = await db.findMoleculeDuplicates({ name: 'limon' });
      expect(result).toHaveProperty('similar');
      // Should find similar molecules with partial match
    });
  });

  describe('findPlantDuplicates', () => {
    it('should return empty arrays when no search criteria provided', async () => {
      const result = await db.findPlantDuplicates({});
      expect(result).toHaveProperty('exact');
      expect(result).toHaveProperty('similar');
      expect(Array.isArray(result.exact)).toBe(true);
      expect(Array.isArray(result.similar)).toBe(true);
    });

    it('should find plants by name', async () => {
      const result = await db.findPlantDuplicates({ name: 'Lavande' });
      expect(result).toHaveProperty('exact');
      expect(result).toHaveProperty('similar');
    });

    it('should find plants by latin name', async () => {
      const result = await db.findPlantDuplicates({ latinName: 'Lavandula' });
      expect(result).toHaveProperty('exact');
      expect(result).toHaveProperty('similar');
    });
  });
});

describe('Contributor Interface - Autocomplete', () => {
  describe('searchMoleculesForAutocomplete', () => {
    it('should return an array of molecules', async () => {
      const result = await db.searchMoleculesForAutocomplete('a', 10);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should respect the limit parameter', async () => {
      const result = await db.searchMoleculesForAutocomplete('a', 5);
      expect(result.length).toBeLessThanOrEqual(5);
    });

    it('should return molecules with required fields', async () => {
      const result = await db.searchMoleculesForAutocomplete('a', 10);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('id');
        expect(result[0]).toHaveProperty('name');
      }
    });
  });

  describe('searchPlantsForAutocomplete', () => {
    it('should return an array of plants', async () => {
      const result = await db.searchPlantsForAutocomplete('a', 10);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should respect the limit parameter', async () => {
      const result = await db.searchPlantsForAutocomplete('a', 5);
      expect(result.length).toBeLessThanOrEqual(5);
    });

    it('should return plants with required fields', async () => {
      const result = await db.searchPlantsForAutocomplete('a', 10);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('id');
        expect(result[0]).toHaveProperty('name');
      }
    });
  });
});

describe('Contributor Interface - Plant-Molecule Links', () => {
  describe('getPlantMoleculeLinksStats', () => {
    it('should return statistics object', async () => {
      const stats = await db.getPlantMoleculeLinksStats();
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('totalPlants');
      expect(stats).toHaveProperty('totalMolecules');
      expect(stats).toHaveProperty('plantsWithLinks');
      expect(stats).toHaveProperty('moleculesWithLinks');
      expect(stats).toHaveProperty('orphanPlants');
      expect(stats).toHaveProperty('orphanMolecules');
    });

    it('should return numeric values', async () => {
      const stats = await db.getPlantMoleculeLinksStats();
      expect(typeof stats.total).toBe('number');
      expect(typeof stats.totalPlants).toBe('number');
      expect(typeof stats.totalMolecules).toBe('number');
    });
  });

  describe('checkPlantMoleculeLinkExists', () => {
    it('should return boolean for non-existent link', async () => {
      const exists = await db.checkPlantMoleculeLinkExists(999999, 999999);
      expect(typeof exists).toBe('boolean');
      expect(exists).toBe(false);
    });
  });

  describe('getOrphanPlants', () => {
    it('should return an array', async () => {
      const orphans = await db.getOrphanPlants(10);
      expect(Array.isArray(orphans)).toBe(true);
    });

    it('should respect the limit parameter', async () => {
      const orphans = await db.getOrphanPlants(5);
      expect(orphans.length).toBeLessThanOrEqual(5);
    });
  });

  describe('getOrphanMolecules', () => {
    it('should return an array', async () => {
      const orphans = await db.getOrphanMolecules(10);
      expect(Array.isArray(orphans)).toBe(true);
    });

    it('should respect the limit parameter', async () => {
      const orphans = await db.getOrphanMolecules(5);
      expect(orphans.length).toBeLessThanOrEqual(5);
    });
  });

  describe('getAllPlantMoleculeLinks', () => {
    it('should return an array of links', async () => {
      const links = await db.getAllPlantMoleculeLinks();
      expect(Array.isArray(links)).toBe(true);
    });

    it('should return links with required fields', async () => {
      const links = await db.getAllPlantMoleculeLinks();
      if (links.length > 0) {
        expect(links[0]).toHaveProperty('plantId');
        expect(links[0]).toHaveProperty('moleculeId');
        expect(links[0]).toHaveProperty('plantName');
        expect(links[0]).toHaveProperty('moleculeName');
      }
    });
  });
});

describe('Contributor Interface - PubChem Enrichment', () => {
  describe('getMoleculeEnrichmentStats', () => {
    it('should return enrichment statistics', async () => {
      const stats = await db.getMoleculeEnrichmentStats();
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('withCas');
      expect(stats).toHaveProperty('withIupac');
      expect(stats).toHaveProperty('withBoth');
      expect(stats).toHaveProperty('withNeither');
    });

    it('should return numeric values', async () => {
      const stats = await db.getMoleculeEnrichmentStats();
      expect(typeof stats.total).toBe('number');
      expect(typeof stats.withCas).toBe('number');
      expect(typeof stats.withNeither).toBe('number');
    });

    it('should have consistent totals', async () => {
      const stats = await db.getMoleculeEnrichmentStats();
      // withNeither should be <= total
      expect(stats.withNeither).toBeLessThanOrEqual(stats.total);
    });
  });

  describe('getMoleculesForPubChemEnrichment', () => {
    it('should return an array of molecules', async () => {
      const molecules = await db.getMoleculesForPubChemEnrichment(10);
      expect(Array.isArray(molecules)).toBe(true);
    });

    it('should respect the limit parameter', async () => {
      const molecules = await db.getMoleculesForPubChemEnrichment(5);
      expect(molecules.length).toBeLessThanOrEqual(5);
    });

    it('should return molecules with required fields', async () => {
      const molecules = await db.getMoleculesForPubChemEnrichment(10);
      if (molecules.length > 0) {
        expect(molecules[0]).toHaveProperty('id');
        expect(molecules[0]).toHaveProperty('name');
      }
    });
  });
});
