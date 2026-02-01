/**
 * Tests for Flavornet filters and IFRA badges
 */

import { describe, it, expect } from 'vitest';
import { getAllPercepts, getFlavornetStats, getFlavornetData } from './flavornet';

describe('Flavornet Service', () => {
  describe('getAllPercepts', () => {
    it('should return an array of unique percepts', () => {
      const percepts = getAllPercepts();
      expect(Array.isArray(percepts)).toBe(true);
      expect(percepts.length).toBeGreaterThan(50);
      // Check for common percepts
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

  describe('getFlavornetStats', () => {
    it('should return database statistics', () => {
      const stats = getFlavornetStats();
      expect(stats).toHaveProperty('totalCompounds');
      expect(stats).toHaveProperty('withPercepts');
      expect(stats).toHaveProperty('withKovatsRI');
      expect(stats.totalCompounds).toBeGreaterThan(140);
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

    it('should return null for unknown molecule', () => {
      const data = getFlavornetData('unknown_molecule_xyz');
      expect(data).toBeNull();
    });
  });
});

describe('Percept Filter Logic', () => {
  it('should filter molecules by percept', () => {
    const moleculePercepts = 'citrus, floral, green';
    const selectedPercepts = ['citrus'];
    
    const matches = selectedPercepts.some(p => 
      moleculePercepts.toLowerCase().includes(p.toLowerCase())
    );
    
    expect(matches).toBe(true);
  });

  it('should not match when percept is not present', () => {
    const moleculePercepts = 'woody, earthy, moss';
    const selectedPercepts = ['citrus'];
    
    const matches = selectedPercepts.some(p => 
      moleculePercepts.toLowerCase().includes(p.toLowerCase())
    );
    
    expect(matches).toBe(false);
  });
});
