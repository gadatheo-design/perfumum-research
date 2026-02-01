import { describe, it, expect } from 'vitest';
import {
  getAllSynergies,
  getSynergiesByType,
  getSynergiesForMolecule,
  getSynergiesByCAS,
  getSynergyStats,
  searchSynergies
} from './molecular-synergies-service';

describe('Molecular Synergies Service', () => {
  describe('getAllSynergies', () => {
    it('should return all synergies', () => {
      const synergies = getAllSynergies();
      expect(synergies).toBeDefined();
      expect(Array.isArray(synergies)).toBe(true);
      expect(synergies.length).toBeGreaterThan(0);
    });

    it('should have required fields for each synergy', () => {
      const synergies = getAllSynergies();
      synergies.forEach(synergy => {
        expect(synergy.molecule1Name).toBeDefined();
        expect(synergy.molecule2Name).toBeDefined();
        expect(synergy.type).toBeDefined();
        expect(synergy.description).toBeDefined();
        expect(synergy.source).toBeDefined();
        expect(synergy.strength).toBeDefined();
      });
    });
  });

  describe('getSynergiesByType', () => {
    it('should return masquage synergies', () => {
      const synergies = getSynergiesByType('masquage');
      expect(synergies.length).toBeGreaterThan(0);
      synergies.forEach(s => expect(s.type).toBe('masquage'));
    });

    it('should return neutralisation synergies', () => {
      const synergies = getSynergiesByType('neutralisation');
      expect(synergies.length).toBeGreaterThan(0);
      synergies.forEach(s => expect(s.type).toBe('neutralisation'));
    });

    it('should return potentialisation synergies', () => {
      const synergies = getSynergiesByType('potentialisation');
      expect(synergies.length).toBeGreaterThan(0);
      synergies.forEach(s => expect(s.type).toBe('potentialisation'));
    });

    it('should return stabilisation synergies', () => {
      const synergies = getSynergiesByType('stabilisation');
      expect(synergies.length).toBeGreaterThan(0);
      synergies.forEach(s => expect(s.type).toBe('stabilisation'));
    });

    it('should return transformation synergies', () => {
      const synergies = getSynergiesByType('transformation');
      expect(synergies.length).toBeGreaterThan(0);
      synergies.forEach(s => expect(s.type).toBe('transformation'));
    });
  });

  describe('getSynergiesForMolecule', () => {
    it('should find synergies for Linalool', () => {
      const synergies = getSynergiesForMolecule('Linalool');
      expect(synergies.length).toBeGreaterThan(0);
    });

    it('should find synergies for Cannabidiol', () => {
      const synergies = getSynergiesForMolecule('Cannabidiol');
      expect(synergies.length).toBeGreaterThan(0);
    });

    it('should be case insensitive', () => {
      const synergies1 = getSynergiesForMolecule('linalool');
      const synergies2 = getSynergiesForMolecule('LINALOOL');
      expect(synergies1.length).toBe(synergies2.length);
    });

    it('should return empty array for unknown molecule', () => {
      const synergies = getSynergiesForMolecule('NonExistentMolecule123');
      expect(synergies.length).toBe(0);
    });
  });

  describe('getSynergiesByCAS', () => {
    it('should find synergies by CAS number for Linalool (78-70-6)', () => {
      const synergies = getSynergiesByCAS('78-70-6');
      expect(synergies.length).toBeGreaterThan(0);
    });

    it('should find synergies by CAS number for Limonene (5989-27-5)', () => {
      const synergies = getSynergiesByCAS('5989-27-5');
      expect(synergies.length).toBeGreaterThan(0);
    });

    it('should return empty array for unknown CAS', () => {
      const synergies = getSynergiesByCAS('999-99-9');
      expect(synergies.length).toBe(0);
    });
  });

  describe('getSynergyStats', () => {
    it('should return statistics', () => {
      const stats = getSynergyStats();
      expect(stats.total).toBeGreaterThan(0);
      expect(stats.byType).toBeDefined();
      expect(stats.byStrength).toBeDefined();
      expect(stats.bySource).toBeDefined();
    });

    it('should have all synergy types in stats', () => {
      const stats = getSynergyStats();
      expect(stats.byType.masquage).toBeGreaterThanOrEqual(0);
      expect(stats.byType.neutralisation).toBeGreaterThanOrEqual(0);
      expect(stats.byType.potentialisation).toBeGreaterThanOrEqual(0);
      expect(stats.byType.stabilisation).toBeGreaterThanOrEqual(0);
      expect(stats.byType.transformation).toBeGreaterThanOrEqual(0);
    });

    it('should have sum of types equal to total', () => {
      const stats = getSynergyStats();
      const typeSum = Object.values(stats.byType).reduce((a, b) => a + b, 0);
      expect(typeSum).toBe(stats.total);
    });
  });

  describe('searchSynergies', () => {
    it('should find synergies by molecule name', () => {
      const results = searchSynergies('Linalool');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should find synergies by description keyword', () => {
      const results = searchSynergies('anti-inflammatoire');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should find synergies by application keyword', () => {
      const results = searchSynergies('parfumerie');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should be case insensitive', () => {
      const results1 = searchSynergies('parfumerie');
      const results2 = searchSynergies('PARFUMERIE');
      expect(results1.length).toBe(results2.length);
    });
  });
});
