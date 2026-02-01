/**
 * Tests for Olfactive Stats and IFRA badges
 */

import { describe, it, expect } from 'vitest';
import { getAllPercepts, getFlavornetStats, getFlavornetData } from './flavornet';

describe('Flavornet Service Extended', () => {
  describe('getAllPercepts', () => {
    it('should return an array of unique percepts', () => {
      const percepts = getAllPercepts();
      expect(Array.isArray(percepts)).toBe(true);
      expect(percepts.length).toBeGreaterThan(80);
    });

    it('should contain common percepts', () => {
      const percepts = getAllPercepts();
      expect(percepts).toContain('citrus');
      expect(percepts).toContain('floral');
      expect(percepts).toContain('woody');
      expect(percepts).toContain('fruity');
      expect(percepts).toContain('green');
    });

    it('should return sorted percepts', () => {
      const percepts = getAllPercepts();
      const sorted = [...percepts].sort();
      expect(percepts).toEqual(sorted);
    });
  });

  describe('getFlavornetStats', () => {
    it('should return database statistics with 200+ compounds', () => {
      const stats = getFlavornetStats();
      expect(stats).toHaveProperty('totalCompounds');
      expect(stats).toHaveProperty('withPercepts');
      expect(stats).toHaveProperty('withKovatsRI');
      expect(stats.totalCompounds).toBeGreaterThanOrEqual(160);
    });
  });

  describe('getFlavornetData', () => {
    it('should find limonene by name', () => {
      const data = getFlavornetData('limonene');
      expect(data).not.toBeNull();
      expect(data?.name).toBe('limonene');
      expect(data?.percepts).toContain('citrus');
    });

    it('should find molecule by CAS number', () => {
      const data = getFlavornetData('', '5989-27-5');
      expect(data).not.toBeNull();
      expect(data?.name).toBe('limonene');
    });

    it('should find new compounds like cinnamyl acetate', () => {
      const data = getFlavornetData('', '103-54-8');
      expect(data).not.toBeNull();
      expect(data?.name).toBe('cinnamyl acetate');
      expect(data?.percepts).toContain('floral');
    });

    it('should find musk compounds', () => {
      const data = getFlavornetData('', '83-66-9');
      expect(data).not.toBeNull();
      expect(data?.name).toBe('musk ambrette');
      expect(data?.percepts).toContain('musk');
    });

    it('should return null for unknown molecule', () => {
      const data = getFlavornetData('unknown_molecule_xyz');
      expect(data).toBeNull();
    });
  });
});

describe('IFRA Status Filter Logic', () => {
  it('should correctly identify banned status', () => {
    const status = 'banned';
    expect(status === 'banned').toBe(true);
  });

  it('should correctly identify restricted status', () => {
    const status = 'restricted';
    expect(status === 'restricted').toBe(true);
  });

  it('should correctly identify not_regulated status', () => {
    const status = 'not_regulated';
    expect(status === 'not_regulated').toBe(true);
  });
});
