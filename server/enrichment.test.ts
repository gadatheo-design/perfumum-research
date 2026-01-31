/**
 * Tests for IFRA and Flavornet enrichment services
 */

import { describe, it, expect } from 'vitest';
import { getIFRAData, getIFRAStats } from './ifra';
import { 
  getFlavornetData, 
  getFlavornetDataByCAS, 
  getFlavornetDataByName,
  getFlavornetStats, 
  getAllPercepts,
  searchByPercept 
} from './flavornet';

describe('IFRA Service', () => {
  describe('getIFRAData', () => {
    it('should return banned status for known banned substances', () => {
      // Nitro musks are banned
      const result = getIFRAData('musk ambrette');
      expect(result.status).toBe('banned');
    });

    it('should return restricted status for known restricted substances', () => {
      // Geraniol is restricted (49th Amendment)
      const result = getIFRAData('geraniol', '106-24-1');
      expect(result.status).toBe('restricted');
      expect(result.maxPercent).toBeDefined();
    });

    it('should return not_regulated for unknown substances', () => {
      const result = getIFRAData('unknown_molecule_xyz');
      expect(result.status).toBe('not_regulated');
    });

    it('should match by CAS number when provided', () => {
      // Eugenol CAS: 97-53-0
      const result = getIFRAData('some_name', '97-53-0');
      expect(result.status).toBe('restricted');
    });
  });

  describe('getIFRAStats', () => {
    it('should return statistics about the IFRA database', () => {
      const stats = getIFRAStats();
      expect(stats.totalBanned).toBeGreaterThan(0);
      expect(stats.totalRestricted).toBeGreaterThan(0);
      expect(stats.totalSpecRequired).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getIFRAStats', () => {
    it('should have entries in the database', () => {
      const stats = getIFRAStats();
      const totalEntries = stats.totalBanned + stats.totalRestricted + stats.totalSpecRequired;
      expect(totalEntries).toBeGreaterThan(0);
    });
  });
});

describe('Flavornet Service', () => {
  describe('getFlavornetData', () => {
    it('should return data for known molecules by name', () => {
      const result = getFlavornetData('limonene');
      expect(result).not.toBeNull();
      expect(result?.name).toBe('limonene');
      expect(result?.percepts).toContain('citrus');
    });

    it('should return data for known molecules by CAS', () => {
      const result = getFlavornetData('any_name', '78-70-6'); // Linalool
      expect(result).not.toBeNull();
      expect(result?.name).toBe('linalool');
    });

    it('should return null for unknown molecules', () => {
      const result = getFlavornetData('unknown_molecule_xyz');
      expect(result).toBeNull();
    });

    it('should handle French molecule names', () => {
      const result = getFlavornetData('limonène');
      expect(result).not.toBeNull();
      expect(result?.percepts).toContain('citrus');
    });
  });

  describe('getFlavornetDataByCAS', () => {
    it('should return data for valid CAS numbers', () => {
      const result = getFlavornetDataByCAS('66-25-1'); // Hexanal
      expect(result).not.toBeNull();
      expect(result?.name).toBe('hexanal');
      expect(result?.percepts).toContain('grass');
    });

    it('should return null for invalid CAS numbers', () => {
      const result = getFlavornetDataByCAS('999-99-9');
      expect(result).toBeNull();
    });
  });

  describe('getFlavornetDataByName', () => {
    it('should find molecules by exact name', () => {
      const result = getFlavornetDataByName('vanillin');
      expect(result).not.toBeNull();
      expect(result?.percepts).toContain('vanilla');
    });

    it('should find molecules by partial name', () => {
      const result = getFlavornetDataByName('eugenol');
      expect(result).not.toBeNull();
      expect(result?.percepts).toContain('clove');
    });
  });

  describe('getFlavornetStats', () => {
    it('should return statistics about the Flavornet database', () => {
      const stats = getFlavornetStats();
      expect(stats.totalCompounds).toBeGreaterThan(0);
      expect(stats.withPercepts).toBeGreaterThan(0);
      expect(stats.withKovatsRI).toBeGreaterThan(0);
    });
  });

  describe('getAllPercepts', () => {
    it('should return a list of unique percepts', () => {
      const percepts = getAllPercepts();
      expect(percepts.length).toBeGreaterThan(0);
      expect(percepts).toContain('citrus');
      expect(percepts).toContain('floral');
      expect(percepts).toContain('woody');
    });

    it('should return sorted percepts', () => {
      const percepts = getAllPercepts();
      const sorted = [...percepts].sort();
      expect(percepts).toEqual(sorted);
    });
  });

  describe('searchByPercept', () => {
    it('should find molecules with matching percepts', () => {
      const results = searchByPercept('rose');
      expect(results.length).toBeGreaterThan(0);
      
      for (const result of results) {
        expect(result.percepts.some(p => p.toLowerCase().includes('rose'))).toBe(true);
      }
    });

    it('should return empty array for unknown percepts', () => {
      const results = searchByPercept('xyz_unknown_percept');
      expect(results).toEqual([]);
    });
  });

  describe('Kovats RI data', () => {
    it('should have Kovats RI data for common molecules', () => {
      const limonene = getFlavornetData('limonene');
      expect(limonene?.kovatsRI).toBeDefined();
      expect(limonene?.kovatsRI?.DB5).toBeGreaterThan(0);
    });
  });
});
