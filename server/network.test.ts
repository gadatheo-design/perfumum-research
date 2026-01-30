import { describe, it, expect, beforeAll } from 'vitest';
import * as db from './db';

describe('Network Molecule-Plant-Terroir', () => {
  describe('getMoleculePlantTerroirNetwork', () => {
    it('should return network data with entities and relationships', async () => {
      const result = await db.getMoleculePlantTerroirNetwork();
      
      expect(result).toBeDefined();
      expect(result.entities).toBeDefined();
      expect(result.relationships).toBeDefined();
      
      // Vérifier la structure des entités
      expect(result.entities.plants).toBeDefined();
      expect(result.entities.molecules).toBeDefined();
      expect(result.entities.terroirs).toBeDefined();
      expect(result.entities.rawMaterials).toBeDefined();
      
      // Vérifier que les tableaux sont bien des arrays
      expect(Array.isArray(result.entities.plants)).toBe(true);
      expect(Array.isArray(result.entities.molecules)).toBe(true);
      expect(Array.isArray(result.entities.terroirs)).toBe(true);
      
      // Vérifier la structure des relations
      expect(result.relationships.plantMolecules).toBeDefined();
      expect(result.relationships.terroirPlants).toBeDefined();
      expect(Array.isArray(result.relationships.plantMolecules)).toBe(true);
    });

    it('should have plants with required fields', async () => {
      const result = await db.getMoleculePlantTerroirNetwork();
      
      if (result.entities.plants.length > 0) {
        const plant = result.entities.plants[0];
        expect(plant.id).toBeDefined();
        expect(plant.name).toBeDefined();
      }
    });

    it('should have molecules with required fields', async () => {
      const result = await db.getMoleculePlantTerroirNetwork();
      
      if (result.entities.molecules.length > 0) {
        const molecule = result.entities.molecules[0];
        expect(molecule.id).toBeDefined();
        expect(molecule.name).toBeDefined();
      }
    });

    it('should have plant-molecule relationships with percentage data', async () => {
      const result = await db.getMoleculePlantTerroirNetwork();
      
      if (result.relationships.plantMolecules.length > 0) {
        const relation = result.relationships.plantMolecules[0];
        expect(relation.plantId).toBeDefined();
        expect(relation.moleculeId).toBeDefined();
        // Les pourcentages peuvent être null mais les champs doivent exister
        expect('percentageMin' in relation || 'percentageTypical' in relation).toBe(true);
      }
    });
  });

  describe('getPlantMoleculesWithPercentages', () => {
    it('should return molecules for a valid plant ID', async () => {
      // D'abord, obtenir un ID de plante valide
      const network = await db.getMoleculePlantTerroirNetwork();
      
      if (network.entities.plants.length > 0) {
        const plantId = network.entities.plants[0].id;
        const result = await db.getPlantMoleculesWithPercentages(plantId);
        
        expect(Array.isArray(result)).toBe(true);
        
        if (result.length > 0) {
          const item = result[0];
          expect(item.molecule).toBeDefined();
          expect(item.molecule.id).toBeDefined();
          expect(item.molecule.name).toBeDefined();
        }
      }
    });

    it('should return empty array for non-existent plant ID', async () => {
      const result = await db.getPlantMoleculesWithPercentages(999999);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe('getMoleculePlantsWithPercentages', () => {
    it('should return plants for a valid molecule ID', async () => {
      // D'abord, obtenir un ID de molécule valide qui a des relations
      const network = await db.getMoleculePlantTerroirNetwork();
      
      if (network.relationships.plantMolecules.length > 0) {
        const moleculeId = network.relationships.plantMolecules[0].moleculeId;
        const result = await db.getMoleculePlantsWithPercentages(moleculeId);
        
        expect(Array.isArray(result)).toBe(true);
        
        if (result.length > 0) {
          const item = result[0];
          expect(item.plant).toBeDefined();
          expect(item.plant.id).toBeDefined();
          expect(item.plant.name).toBeDefined();
        }
      }
    });

    it('should return empty array for non-existent molecule ID', async () => {
      const result = await db.getMoleculePlantsWithPercentages(999999);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe('Data integrity', () => {
    it('should have at least some plant-molecule relationships', async () => {
      const result = await db.getMoleculePlantTerroirNetwork();
      expect(result.relationships.plantMolecules.length).toBeGreaterThan(0);
    });

    it('should have plants in the database', async () => {
      const result = await db.getMoleculePlantTerroirNetwork();
      expect(result.entities.plants.length).toBeGreaterThan(0);
    });

    it('should have molecules in the database', async () => {
      const result = await db.getMoleculePlantTerroirNetwork();
      expect(result.entities.molecules.length).toBeGreaterThan(0);
    });
  });
});
