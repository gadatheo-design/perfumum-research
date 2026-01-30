import { describe, it, expect } from 'vitest';
import * as db from './db';

describe('Terroir-Plante-Molécule Network', () => {
  describe('getMoleculePlantTerroirNetwork', () => {
    it('should return network data with entities and relationships', async () => {
      const networkData = await db.getMoleculePlantTerroirNetwork();
      
      expect(networkData).toBeDefined();
      expect(networkData).toHaveProperty('entities');
      expect(networkData).toHaveProperty('relationships');
    });

    it('should include terroirs in entities', async () => {
      const networkData = await db.getMoleculePlantTerroirNetwork();
      
      expect(networkData.entities).toHaveProperty('terroirs');
      expect(Array.isArray(networkData.entities.terroirs)).toBe(true);
    });

    it('should include plants in entities', async () => {
      const networkData = await db.getMoleculePlantTerroirNetwork();
      
      expect(networkData.entities).toHaveProperty('plants');
      expect(Array.isArray(networkData.entities.plants)).toBe(true);
    });

    it('should include molecules in entities', async () => {
      const networkData = await db.getMoleculePlantTerroirNetwork();
      
      expect(networkData.entities).toHaveProperty('molecules');
      expect(Array.isArray(networkData.entities.molecules)).toBe(true);
    });

    it('should include terroir-plant relationships', async () => {
      const networkData = await db.getMoleculePlantTerroirNetwork();
      
      expect(networkData.relationships).toHaveProperty('terroirPlants');
      expect(Array.isArray(networkData.relationships.terroirPlants)).toBe(true);
    });

    it('should include plant-molecule relationships', async () => {
      const networkData = await db.getMoleculePlantTerroirNetwork();
      
      expect(networkData.relationships).toHaveProperty('plantMolecules');
      expect(Array.isArray(networkData.relationships.plantMolecules)).toBe(true);
    });

    it('terroirs should have required fields', async () => {
      const networkData = await db.getMoleculePlantTerroirNetwork();
      
      if (networkData.entities.terroirs.length > 0) {
        const terroir = networkData.entities.terroirs[0];
        expect(terroir).toHaveProperty('id');
        expect(terroir).toHaveProperty('name');
        expect(terroir).toHaveProperty('country');
      }
    });

    it('plants should have required fields', async () => {
      const networkData = await db.getMoleculePlantTerroirNetwork();
      
      if (networkData.entities.plants.length > 0) {
        const plant = networkData.entities.plants[0];
        expect(plant).toHaveProperty('id');
        expect(plant).toHaveProperty('name');
      }
    });

    it('molecules should have required fields', async () => {
      const networkData = await db.getMoleculePlantTerroirNetwork();
      
      if (networkData.entities.molecules.length > 0) {
        const molecule = networkData.entities.molecules[0];
        expect(molecule).toHaveProperty('id');
        expect(molecule).toHaveProperty('name');
      }
    });
  });

  describe('Terroir Statistics', () => {
    it('should get plant-terroir audit stats', async () => {
      const stats = await db.getPlantTerroirAuditStats();
      
      expect(stats).toBeDefined();
      expect(stats).toHaveProperty('totalPlants');
      expect(stats).toHaveProperty('totalTerroirs');
    });

    it('should have non-negative statistics', async () => {
      const stats = await db.getPlantTerroirAuditStats();
      
      expect(stats.totalPlants).toBeGreaterThanOrEqual(0);
      expect(stats.totalTerroirs).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Terroir CRUD', () => {
    it('should get all terroirs', async () => {
      const terroirs = await db.getAllTerroirs();
      
      expect(Array.isArray(terroirs)).toBe(true);
    });

    it('terroirs should have geographic data', async () => {
      const terroirs = await db.getAllTerroirs();
      
      if (terroirs.length > 0) {
        const terroir = terroirs[0];
        expect(terroir).toHaveProperty('country');
        // latitude and longitude may be null
        expect(terroir).toHaveProperty('latitude');
        expect(terroir).toHaveProperty('longitude');
      }
    });

    it('terroirs should have climate data', async () => {
      const terroirs = await db.getAllTerroirs();
      
      if (terroirs.length > 0) {
        const terroir = terroirs[0];
        // climateType may be null
        expect(terroir).toHaveProperty('climateType');
      }
    });
  });

  describe('Plant-Terroir Relations', () => {
    it('should get all plant-terroir relations with names', async () => {
      const relations = await db.getAllPlantTerroirRelationsWithNames();
      
      expect(Array.isArray(relations)).toBe(true);
    });

    it('relations should have required fields', async () => {
      const relations = await db.getAllPlantTerroirRelationsWithNames();
      
      if (relations.length > 0) {
        const relation = relations[0];
        expect(relation).toHaveProperty('plantId');
        expect(relation).toHaveProperty('terroirId');
      }
    });

    it('should get plants by terroir', async () => {
      const terroirs = await db.getAllTerroirs();
      
      if (terroirs.length > 0) {
        const plants = await db.getTerroirPlants(terroirs[0].id);
        expect(Array.isArray(plants)).toBe(true);
      }
    });

    it('should get terroirs by plant', async () => {
      const plants = await db.getAllPlants();
      
      if (plants.length > 0) {
        const terroirs = await db.getPlantTerroirs(plants[0].id);
        expect(Array.isArray(terroirs)).toBe(true);
      }
    });
  });
});
