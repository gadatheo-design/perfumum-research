/**
 * Tests pour l'enrichissement Flavornet
 */
import { describe, it, expect } from 'vitest';
import { 
  getFlavornetDataByCAS, 
  getFlavornetDataByName, 
  getFlavornetStats, 
  getAllPercepts,
  searchByPercept 
} from './flavornet';

describe('Flavornet Service', () => {
  describe('getFlavornetStats', () => {
    it('should return correct statistics for the database', () => {
      const stats = getFlavornetStats();
      expect(stats.totalCompounds).toBeGreaterThanOrEqual(190);
      expect(stats.withPercepts).toBeGreaterThanOrEqual(190);
      expect(stats.withKovatsRI).toBeGreaterThanOrEqual(150);
    });
  });

  describe('getFlavornetDataByCAS', () => {
    it('should find limonene by CAS number', () => {
      const data = getFlavornetDataByCAS('5989-27-5');
      expect(data).not.toBeNull();
      expect(data?.name).toBe('limonene');
      expect(data?.percepts).toContain('citrus');
    });

    it('should find linalool by CAS number', () => {
      const data = getFlavornetDataByCAS('78-70-6');
      expect(data).not.toBeNull();
      expect(data?.name).toBe('linalool');
      expect(data?.percepts.some(p => p.includes('flower') || p.includes('floral'))).toBe(true);
    });

    it('should return null for unknown CAS', () => {
      const data = getFlavornetDataByCAS('999-99-9');
      expect(data).toBeNull();
    });
  });

  describe('getFlavornetDataByName', () => {
    it('should find molecule by English name', () => {
      const data = getFlavornetDataByName('limonene');
      expect(data).not.toBeNull();
      expect(data?.casNumber).toBe('5989-27-5');
    });

    it('should find molecule by French name', () => {
      const data = getFlavornetDataByName('limonène');
      expect(data).not.toBeNull();
      expect(data?.casNumber).toBe('5989-27-5');
    });

    it('should find molecule by partial name', () => {
      const data = getFlavornetDataByName('linalool');
      expect(data).not.toBeNull();
    });
  });

  describe('getAllPercepts', () => {
    it('should return a list of unique percepts', () => {
      const percepts = getAllPercepts();
      expect(percepts.length).toBeGreaterThan(50);
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
    it('should find molecules with citrus percept', () => {
      const results = searchByPercept('citrus');
      expect(results.length).toBeGreaterThan(10);
      results.forEach(r => {
        expect(r.percepts.some(p => p.toLowerCase().includes('citrus'))).toBe(true);
      });
    });

    it('should find molecules with floral percept', () => {
      const results = searchByPercept('floral');
      expect(results.length).toBeGreaterThan(10);
    });

    it('should return empty array for unknown percept', () => {
      const results = searchByPercept('xyznonexistent');
      expect(results.length).toBe(0);
    });
  });
});
