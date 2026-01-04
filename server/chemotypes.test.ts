import { describe, it, expect } from 'vitest';
import * as db from './db';

describe('Chemotypes API', () => {
  let testChemotypeId: number | null = null;

  describe('getAllChemotypes', () => {
    it('should return an array of chemotypes', async () => {
      const chemotypes = await db.getAllChemotypes();
      expect(Array.isArray(chemotypes)).toBe(true);
    });
  });

  describe('createChemotype', () => {
    it('should create a new chemotype', async () => {
      const newChemotype = {
        name: 'Thym à thymol (Test)',
        plantName: 'Thym',
        latinName: 'Thymus vulgaris ct. thymol',
        dominantMoleculeName: 'Thymol',
        dominantPercentageMin: 30,
        dominantPercentageMax: 50,
        origin: 'Provence, France',
        climate: 'Méditerranéen sec',
        olfactiveProfile: 'Puissant, phénolique, herbacé avec des notes médicinales',
        therapeuticProperties: 'Antiseptique puissant, antibactérien, antifongique',
        toxicity: 'modérée' as const,
        perfumeryUse: 'Notes aromatiques puissantes, accords fougères',
        recommendedDilution: '1-3%',
        climaticAxis: 'vent' as const,
        notes: 'Chémotype de test - à supprimer',
      };

      const result = await db.createChemotype(newChemotype);
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe('number');
      testChemotypeId = result.id;
    });
  });

  describe('getChemotypeById', () => {
    it('should return the created chemotype', async () => {
      if (!testChemotypeId) {
        throw new Error('Test chemotype was not created');
      }
      
      const chemotype = await db.getChemotypeById(testChemotypeId);
      expect(chemotype).toBeDefined();
      expect(chemotype?.name).toBe('Thym à thymol (Test)');
      expect(chemotype?.plantName).toBe('Thym');
      expect(chemotype?.dominantMoleculeName).toBe('Thymol');
    });

    it('should return null for non-existent id', async () => {
      const chemotype = await db.getChemotypeById(999999);
      expect(chemotype).toBeNull();
    });
  });

  describe('getChemotypesByPlantName', () => {
    it('should return chemotypes matching plant name', async () => {
      const chemotypes = await db.getChemotypesByPlantName('Thym');
      expect(Array.isArray(chemotypes)).toBe(true);
      const found = chemotypes.some(ct => ct.name === 'Thym à thymol (Test)');
      expect(found).toBe(true);
    });
  });

  describe('searchChemotypes', () => {
    it('should search chemotypes by name', async () => {
      const results = await db.searchChemotypes('thymol');
      expect(Array.isArray(results)).toBe(true);
      const found = results.some(ct => ct.name.includes('thymol') || ct.dominantMoleculeName.includes('Thymol'));
      expect(found).toBe(true);
    });

    it('should search chemotypes by origin', async () => {
      const results = await db.searchChemotypes('Provence');
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('getChemotypesStats', () => {
    it('should return statistics about chemotypes', async () => {
      const stats = await db.getChemotypesStats();
      expect(stats).toBeDefined();
      expect(typeof stats.total).toBe('number');
      expect(Array.isArray(stats.byPlant)).toBe(true);
      expect(Array.isArray(stats.byAxis)).toBe(true);
    });
  });

  describe('updateChemotype', () => {
    it('should update an existing chemotype', async () => {
      if (!testChemotypeId) {
        throw new Error('Test chemotype was not created');
      }

      const updated = await db.updateChemotype(testChemotypeId, {
        notes: 'Chémotype mis à jour - test réussi',
        intensity: 8,
      });

      expect(updated).toBeDefined();
      expect(updated?.notes).toBe('Chémotype mis à jour - test réussi');
      expect(updated?.intensity).toBe(8);
    });
  });

  describe('deleteChemotype', () => {
    it('should delete the test chemotype', async () => {
      if (!testChemotypeId) {
        throw new Error('Test chemotype was not created');
      }

      await db.deleteChemotype(testChemotypeId);
      
      const deleted = await db.getChemotypeById(testChemotypeId);
      expect(deleted).toBeNull();
    });
  });
});
