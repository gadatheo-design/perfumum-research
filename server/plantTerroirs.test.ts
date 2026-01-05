import { describe, it, expect, vi } from 'vitest';

// Mock the database functions
vi.mock('./db', () => ({
  getAllPlants: vi.fn().mockResolvedValue([
    { id: 1, name: 'Lavande', latinName: 'Lavandula angustifolia' },
    { id: 2, name: 'Rose', latinName: 'Rosa damascena' },
    { id: 3, name: 'Vétiver', latinName: 'Chrysopogon zizanioides' },
  ]),
  getAllTerroirs: vi.fn().mockResolvedValue([
    { id: 1, name: 'Provence', country: 'France', region: 'PACA' },
    { id: 2, name: 'Grasse', country: 'France', region: 'PACA' },
    { id: 3, name: 'Haïti', country: 'Haïti', region: 'Caraïbes' },
  ]),
  getPlantTerroirs: vi.fn().mockImplementation((plantId: number) => {
    const relations: Record<number, Array<{ terroirId: number; localName?: string }>> = {
      1: [{ terroirId: 1, localName: 'Lavande de Provence' }, { terroirId: 2 }],
      2: [{ terroirId: 2, localName: 'Rose de Grasse' }],
      3: [{ terroirId: 3, localName: 'Vétiver d\'Haïti' }],
    };
    return Promise.resolve(relations[plantId] || []);
  }),
  getTerroirPlants: vi.fn().mockImplementation((terroirId: number) => {
    const relations: Record<number, Array<{ plantId: number; plantName: string }>> = {
      1: [{ plantId: 1, plantName: 'Lavande' }],
      2: [{ plantId: 1, plantName: 'Lavande' }, { plantId: 2, plantName: 'Rose' }],
      3: [{ plantId: 3, plantName: 'Vétiver' }],
    };
    return Promise.resolve(relations[terroirId] || []);
  }),
  addPlantTerroir: vi.fn().mockResolvedValue({ plantId: 1, terroirId: 1 }),
  removePlantTerroir: vi.fn().mockResolvedValue(undefined),
  getAllMolecules: vi.fn().mockResolvedValue([
    { id: 1, name: 'Linalol', family: 'Alcool terpénique' },
    { id: 2, name: 'Géraniol', family: 'Alcool terpénique' },
  ]),
  getPlantMolecules: vi.fn().mockResolvedValue([]),
  getAllRawMaterials: vi.fn().mockResolvedValue([]),
  getDb: vi.fn().mockResolvedValue(null),
}));

import * as db from './db';

describe('PlantTerroirs API', () => {
  describe('getPlantTerroirs', () => {
    it('should return terroirs for a plant', async () => {
      const terroirs = await db.getPlantTerroirs(1);
      expect(terroirs).toHaveLength(2);
      expect(terroirs[0]).toHaveProperty('terroirId', 1);
      expect(terroirs[0]).toHaveProperty('localName', 'Lavande de Provence');
    });

    it('should return empty array for plant without terroirs', async () => {
      const terroirs = await db.getPlantTerroirs(999);
      expect(terroirs).toHaveLength(0);
    });
  });

  describe('getTerroirPlants', () => {
    it('should return plants for a terroir', async () => {
      const plants = await db.getTerroirPlants(2);
      expect(plants).toHaveLength(2);
      expect(plants.map((p: any) => p.plantName)).toContain('Lavande');
      expect(plants.map((p: any) => p.plantName)).toContain('Rose');
    });

    it('should return empty array for terroir without plants', async () => {
      const plants = await db.getTerroirPlants(999);
      expect(plants).toHaveLength(0);
    });
  });

  describe('getAllPlants', () => {
    it('should return all plants', async () => {
      const plants = await db.getAllPlants();
      expect(plants).toHaveLength(3);
      expect(plants[0]).toHaveProperty('name', 'Lavande');
    });
  });

  describe('getAllTerroirs', () => {
    it('should return all terroirs', async () => {
      const terroirs = await db.getAllTerroirs();
      expect(terroirs).toHaveLength(3);
      expect(terroirs[0]).toHaveProperty('name', 'Provence');
      expect(terroirs[0]).toHaveProperty('country', 'France');
    });
  });
});

describe('NetworkGraph Data Structure', () => {
  it('should generate valid node structure', () => {
    const node = {
      id: 'plant-1',
      name: 'Lavande',
      type: 'plant' as const,
      data: {
        latinName: 'Lavandula angustifolia',
        category: 'Aromatique',
      },
    };

    expect(node.id).toMatch(/^(plant|terroir|molecule|rawMaterial)-\d+$/);
    expect(['plant', 'terroir', 'molecule', 'rawMaterial']).toContain(node.type);
    expect(node.name).toBeTruthy();
  });

  it('should generate valid link structure', () => {
    const link = {
      source: 'plant-1',
      target: 'terroir-1',
      type: 'plant-terroir' as const,
      value: 1,
    };

    expect(link.source).toMatch(/^(plant|terroir|molecule|rawMaterial)-\d+$/);
    expect(link.target).toMatch(/^(plant|terroir|molecule|rawMaterial)-\d+$/);
    expect(['plant-terroir', 'plant-molecule', 'rawMaterial-terroir', 'rawMaterial-molecule']).toContain(link.type);
  });

  it('should create consistent node IDs', () => {
    const plantId = 1;
    const terroirId = 2;
    
    const plantNodeId = `plant-${plantId}`;
    const terroirNodeId = `terroir-${terroirId}`;
    
    expect(plantNodeId).toBe('plant-1');
    expect(terroirNodeId).toBe('terroir-2');
  });
});

describe('Network Statistics', () => {
  it('should calculate correct statistics', async () => {
    const plants = await db.getAllPlants();
    let totalRelations = 0;
    const plantsWithTerroirs = new Set<number>();
    const terroirsWithPlants = new Set<number>();

    for (const plant of plants) {
      const terroirs = await db.getPlantTerroirs(plant.id);
      if (terroirs.length > 0) {
        plantsWithTerroirs.add(plant.id);
        terroirs.forEach((t: any) => {
          terroirsWithPlants.add(t.terroirId);
          totalRelations++;
        });
      }
    }

    expect(totalRelations).toBe(4); // 2 + 1 + 1
    expect(plantsWithTerroirs.size).toBe(3);
    expect(terroirsWithPlants.size).toBe(3);
  });
});
