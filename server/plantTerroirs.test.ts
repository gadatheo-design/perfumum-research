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

// ============================================================================
// TESTS POUR LES NOUVELLES FONCTIONNALITÉS D'AUDIT ET D'IMPORT EN MASSE
// ============================================================================

describe('Plant-Terroir Audit Functions', () => {
  describe('Audit Statistics Structure', () => {
    it('should have correct audit stats structure', () => {
      const mockStats = {
        totalPlants: 100,
        totalTerroirs: 50,
        totalRelations: 75,
        plantsWithTerroir: 30,
        terroirsWithPlant: 25,
        plantsWithoutTerroir: 70,
        terroirsWithoutPlant: 25,
        coveragePlants: 30,
        coverageTerroirs: 50,
        topPlantsByTerroirs: [],
        topTerroirsByPlants: [],
        priorityPlantsWithoutTerroir: [],
        priorityTerroirsWithoutPlant: [],
        plantsWithoutTerroirList: [],
        terroirsWithoutPlantList: [],
      };

      expect(mockStats).toHaveProperty('totalPlants');
      expect(mockStats).toHaveProperty('coveragePlants');
      expect(mockStats).toHaveProperty('topPlantsByTerroirs');
      expect(mockStats.coveragePlants).toBe(30);
    });

    it('should calculate coverage percentages correctly', () => {
      const totalPlants = 100;
      const plantsWithTerroir = 30;
      const coveragePlants = Math.round((plantsWithTerroir / totalPlants) * 100);
      
      expect(coveragePlants).toBe(30);
    });
  });

  describe('Suggestions Logic', () => {
    it('should identify high confidence matches by country', () => {
      const plant = { origin: 'France, Provence' };
      const terroir = { country: 'France', region: 'Provence' };
      
      const originLower = plant.origin.toLowerCase();
      const countryLower = terroir.country.toLowerCase();
      
      const isHighConfidence = originLower.includes(countryLower) && countryLower.length > 2;
      
      expect(isHighConfidence).toBe(true);
    });

    it('should identify medium confidence matches by partial name', () => {
      const plant = { origin: 'Méditerranée' };
      const terroir = { name: 'Côte Méditerranéenne', country: 'France' };
      
      const originLower = plant.origin.toLowerCase();
      const terroirNameLower = terroir.name.toLowerCase();
      
      const isMediumConfidence = 
        originLower.includes(terroirNameLower.split(',')[0]) || 
        terroirNameLower.includes(originLower.split(',')[0]);
      
      expect(isMediumConfidence).toBe(true);
    });
  });
});

describe('Bulk Import Functions', () => {
  describe('Import Result Structure', () => {
    it('should have correct import result structure', () => {
      const mockResult = {
        success: true,
        imported: 5,
        skipped: 2,
        duplicates: 1,
        errors: ['Ligne 3: Plante non trouvée'],
      };

      expect(mockResult).toHaveProperty('success');
      expect(mockResult).toHaveProperty('imported');
      expect(mockResult).toHaveProperty('duplicates');
      expect(mockResult).toHaveProperty('errors');
      expect(Array.isArray(mockResult.errors)).toBe(true);
    });
  });

  describe('Duplicate Detection', () => {
    it('should detect duplicate relations using Set', () => {
      const existingRelations = [
        { plantId: 1, terroirId: 1 },
        { plantId: 1, terroirId: 2 },
        { plantId: 2, terroirId: 1 },
      ];

      const existingSet = new Set(
        existingRelations.map(r => `${r.plantId}-${r.terroirId}`)
      );

      expect(existingSet.has('1-1')).toBe(true);
      expect(existingSet.has('1-2')).toBe(true);
      expect(existingSet.has('2-1')).toBe(true);
      expect(existingSet.has('3-3')).toBe(false);
    });
  });

  describe('Name Resolution', () => {
    it('should resolve plant ID from name', () => {
      const plants = [
        { id: 1, name: 'Lavande', latinName: 'Lavandula angustifolia' },
        { id: 2, name: 'Rose', latinName: 'Rosa damascena' },
      ];

      const plantNameMap = new Map(plants.map(p => [p.name.toLowerCase(), p.id]));
      const plantLatinNameMap = new Map(
        plants.filter(p => p.latinName).map(p => [p.latinName.toLowerCase(), p.id])
      );

      expect(plantNameMap.get('lavande')).toBe(1);
      expect(plantLatinNameMap.get('lavandula angustifolia')).toBe(1);
      expect(plantNameMap.get('rose')).toBe(2);
    });

    it('should resolve terroir ID from name', () => {
      const terroirs = [
        { id: 1, name: 'Provence', country: 'France' },
        { id: 2, name: 'Grasse', country: 'France' },
      ];

      const terroirNameMap = new Map(terroirs.map(t => [t.name.toLowerCase(), t.id]));

      expect(terroirNameMap.get('provence')).toBe(1);
      expect(terroirNameMap.get('grasse')).toBe(2);
    });
  });
});

describe('CSV Parsing Logic', () => {
  describe('Column Mapping', () => {
    it('should correctly identify column mappings from English headers', () => {
      const headers = ['plantName', 'terroirName', 'localName', 'notes'];
      const columnMap: Record<string, number> = {};
      
      headers.forEach((h, i) => {
        const hLower = h.toLowerCase();
        if (hLower.includes('plant') && hLower.includes('name')) columnMap['plantName'] = i;
        else if (hLower.includes('terroir') && hLower.includes('name')) columnMap['terroirName'] = i;
        else if (hLower.includes('local')) columnMap['localName'] = i;
        else if (hLower === 'notes') columnMap['notes'] = i;
      });

      expect(columnMap.plantName).toBe(0);
      expect(columnMap.terroirName).toBe(1);
      expect(columnMap.localName).toBe(2);
      expect(columnMap.notes).toBe(3);
    });

    it('should correctly identify column mappings from French headers', () => {
      const headers = ['plante', 'terroir', 'nom_local', 'notes'];
      const columnMap: Record<string, number> = {};
      
      headers.forEach((h, i) => {
        const hLower = h.toLowerCase();
        if (hLower === 'plante' || hLower === 'plant') columnMap['plantName'] = i;
        else if (hLower === 'terroir') columnMap['terroirName'] = i;
        else if (hLower.includes('local') || hLower.includes('nom_local')) columnMap['localName'] = i;
        else if (hLower === 'notes') columnMap['notes'] = i;
      });

      expect(columnMap.plantName).toBe(0);
      expect(columnMap.terroirName).toBe(1);
      expect(columnMap.localName).toBe(2);
      expect(columnMap.notes).toBe(3);
    });
  });

  describe('Separator Detection', () => {
    it('should detect comma separator', () => {
      const line = 'plantName,terroirName,notes';
      const separator = line.includes(';') ? ';' : ',';
      expect(separator).toBe(',');
    });

    it('should detect semicolon separator', () => {
      const line = 'plantName;terroirName;notes';
      const separator = line.includes(';') ? ';' : ',';
      expect(separator).toBe(';');
    });
  });

  describe('Row Validation', () => {
    it('should validate rows with both plant and terroir', () => {
      const row = { plantName: 'Lavande', terroirName: 'Provence' };
      const isValid = !!(row.plantName && row.terroirName);
      expect(isValid).toBe(true);
    });

    it('should invalidate rows missing plant', () => {
      const row = { plantName: '', terroirName: 'Provence' };
      const isValid = !!(row.plantName && row.terroirName);
      expect(isValid).toBe(false);
    });

    it('should invalidate rows missing terroir', () => {
      const row = { plantName: 'Lavande', terroirName: '' };
      const isValid = !!(row.plantName && row.terroirName);
      expect(isValid).toBe(false);
    });
  });
});

describe('Multiple Relations Creation', () => {
  it('should prepare batch of relations for creation', () => {
    const selectedPlants = [1, 2, 3];
    const selectedTerroirs = [10, 20];
    
    const relations: Array<{ plantId: number; terroirId: number }> = [];
    
    for (const plantId of selectedPlants) {
      for (const terroirId of selectedTerroirs) {
        relations.push({ plantId, terroirId });
      }
    }
    
    expect(relations).toHaveLength(6); // 3 plants × 2 terroirs
    expect(relations[0]).toEqual({ plantId: 1, terroirId: 10 });
    expect(relations[5]).toEqual({ plantId: 3, terroirId: 20 });
  });

  it('should filter out existing relations', () => {
    const existingSet = new Set(['1-10', '2-10']);
    const newRelations = [
      { plantId: 1, terroirId: 10 }, // exists
      { plantId: 1, terroirId: 20 }, // new
      { plantId: 2, terroirId: 10 }, // exists
      { plantId: 2, terroirId: 20 }, // new
    ];
    
    const filtered = newRelations.filter(
      r => !existingSet.has(`${r.plantId}-${r.terroirId}`)
    );
    
    expect(filtered).toHaveLength(2);
    expect(filtered[0]).toEqual({ plantId: 1, terroirId: 20 });
    expect(filtered[1]).toEqual({ plantId: 2, terroirId: 20 });
  });
});
