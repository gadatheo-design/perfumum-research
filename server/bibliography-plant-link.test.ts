import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from './db';

describe('Bibliography-Plant Linking', () => {
  let testPlantId: number | null = null;
  let testBibliographyId: number | null = null;

  beforeAll(async () => {
    // Récupérer une plante existante pour les tests
    const plants = await db.getAllPlants();
    if (plants.length > 0) {
      testPlantId = plants[0].id;
    }

    // Récupérer une référence bibliographique existante
    const refs = await db.getAllBibliographyEntries({});
    if (refs.entries && refs.entries.length > 0) {
      testBibliographyId = refs.entries[0].id;
    }
  });

  it('should retrieve plants list', async () => {
    const plants = await db.getAllPlants();
    expect(Array.isArray(plants)).toBe(true);
    expect(plants.length).toBeGreaterThan(0);
    
    // Vérifier la structure d'une plante
    const plant = plants[0];
    expect(plant).toHaveProperty('id');
    expect(plant).toHaveProperty('name');
  });

  it('should retrieve bibliography entries', async () => {
    const result = await db.getAllBibliographyEntries({});
    expect(result).toHaveProperty('entries');
    expect(Array.isArray(result.entries)).toBe(true);
    
    if (result.entries.length > 0) {
      const entry = result.entries[0];
      expect(entry).toHaveProperty('id');
      expect(entry).toHaveProperty('title');
    }
  });

  it('should link bibliography to plant', async () => {
    if (!testPlantId || !testBibliographyId) {
      console.log('Skipping link test - no test data available');
      return;
    }

    // Lier la référence à la plante
    const result = await db.linkBibliographyToPlant(testBibliographyId, testPlantId);
    expect(result).toBeDefined();
    expect(result.success).toBe(true);

    // Vérifier que la liaison existe
    const refs = await db.getBibliographyByPlant(testPlantId);
    const linked = refs.some((r: any) => r.id === testBibliographyId);
    expect(linked).toBe(true);
  });

  it('should retrieve bibliography by plant', async () => {
    if (!testPlantId) {
      console.log('Skipping retrieval test - no test plant available');
      return;
    }

    const refs = await db.getBibliographyByPlant(testPlantId);
    expect(Array.isArray(refs)).toBe(true);
  });

  it('should unlink bibliography from plant', async () => {
    if (!testPlantId || !testBibliographyId) {
      console.log('Skipping unlink test - no test data available');
      return;
    }

    // Délier la référence de la plante
    const result = await db.unlinkBibliographyFromPlant(testBibliographyId, testPlantId);
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });

  it('should retrieve plant-molecule links', async () => {
    const links = await db.getAllPlantMoleculeLinks();
    expect(Array.isArray(links)).toBe(true);
    
    if (links.length > 0) {
      const link = links[0];
      expect(link).toHaveProperty('plantId');
      expect(link).toHaveProperty('moleculeId');
    }
  });

  it('should retrieve chemotypes', async () => {
    const chemotypes = await db.getAllChemotypes();
    expect(Array.isArray(chemotypes)).toBe(true);
    
    if (chemotypes.length > 0) {
      const chem = chemotypes[0];
      expect(chem).toHaveProperty('id');
      expect(chem).toHaveProperty('name');
    }
  });
});
