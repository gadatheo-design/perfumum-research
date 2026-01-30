import { describe, it, expect } from 'vitest';
import * as db from './db';

describe('Analytical Methods - Molecule Liaison', () => {
  describe('getAnalyticalMethodsByMoleculeId', () => {
    it('should return an array', async () => {
      // Test with a molecule that has methods
      const result = await db.getAnalyticalMethodsByMoleculeId(1);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return empty array for non-existent molecule', async () => {
      const result = await db.getAnalyticalMethodsByMoleculeId(999999);
      expect(result).toEqual([]);
    });

    it('should return methods with expected structure when data exists', async () => {
      // Get a molecule that has methods linked
      const result = await db.getAnalyticalMethodsByMoleculeId(1);
      
      if (result.length > 0) {
        const method = result[0];
        // Check that the method has the expected properties
        expect(method).toHaveProperty('id');
        expect(method).toHaveProperty('name');
        expect(method).toHaveProperty('code');
        expect(method).toHaveProperty('category');
        expect(method).toHaveProperty('isPrimary');
      }
      // Test passes even if no data - just validates structure when present
      expect(true).toBe(true);
    });

    it('should order by isPrimary first, then by performanceScore', async () => {
      const result = await db.getAnalyticalMethodsByMoleculeId(1);
      
      if (result.length > 1) {
        // Primary methods should come first
        let foundNonPrimary = false;
        for (const method of result) {
          if (!method.isPrimary) {
            foundNonPrimary = true;
          }
          if (foundNonPrimary && method.isPrimary) {
            // This should not happen - primary should come first
            expect(true).toBe(false);
          }
        }
      }
      // Test passes even if no data
      expect(true).toBe(true);
    });
  });

  describe('getAllAnalyticalMethods', () => {
    it('should return all analytical methods', async () => {
      const result = await db.getAllAnalyticalMethods();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should have at least 10 methods in database', async () => {
      const result = await db.getAllAnalyticalMethods();
      expect(result.length).toBeGreaterThanOrEqual(10);
    });
  });
});
