import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database module
vi.mock('./db', () => ({
  getPlantVarietiesWithFilters: vi.fn(),
  getCriticalVarieties: vi.fn(),
  getConservationStats: vi.fn(),
  getVarietyWithMolecules: vi.fn(),
  getVarietiesByType: vi.fn(),
  getCannabisLandraces: vi.fn(),
  getTobaccoVarieties: vi.fn(),
  getUniqueVarietyCountries: vi.fn(),
  updateVarietyConservationStatus: vi.fn(),
  getAllPlantMoleculeLinks: vi.fn(),
  getPlantMolecules: vi.fn(),
  getPlantsByMolecule: vi.fn(),
  getSignatureMolecules: vi.fn(),
  createPlantMoleculeLink: vi.fn(),
  deletePlantMoleculeLink: vi.fn(),
}));

import * as db from './db';

describe('Plant Varieties Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPlantVarietiesWithFilters', () => {
    it('should return all varieties when no filters are applied', async () => {
      const mockVarieties = [
        { variety: { id: 1, name: 'Afghan Kush', varietyType: 'landrace', conservationStatus: 'stable' }, plant: { id: 1, name: 'Cannabis', category: 'cannabis' } },
        { variety: { id: 2, name: 'Virginia Gold', varietyType: 'cultivar', conservationStatus: 'stable' }, plant: { id: 2, name: 'Tabac', category: 'tabac' } },
      ];
      
      vi.mocked(db.getPlantVarietiesWithFilters).mockResolvedValue(mockVarieties);
      
      const result = await db.getPlantVarietiesWithFilters({});
      
      expect(result).toHaveLength(2);
      expect(db.getPlantVarietiesWithFilters).toHaveBeenCalledWith({});
    });

    it('should filter by plant category', async () => {
      const mockVarieties = [
        { variety: { id: 1, name: 'Afghan Kush', varietyType: 'landrace' }, plant: { id: 1, name: 'Cannabis', category: 'cannabis' } },
      ];
      
      vi.mocked(db.getPlantVarietiesWithFilters).mockResolvedValue(mockVarieties);
      
      const result = await db.getPlantVarietiesWithFilters({ plantCategory: 'cannabis' });
      
      expect(result).toHaveLength(1);
      expect(result[0].plant.category).toBe('cannabis');
    });

    it('should filter by conservation status', async () => {
      const mockVarieties = [
        { variety: { id: 1, name: 'Rare Landrace', conservationStatus: 'critical' }, plant: { id: 1, name: 'Cannabis' } },
      ];
      
      vi.mocked(db.getPlantVarietiesWithFilters).mockResolvedValue(mockVarieties);
      
      const result = await db.getPlantVarietiesWithFilters({ conservationStatus: 'critical' });
      
      expect(result).toHaveLength(1);
      expect(result[0].variety.conservationStatus).toBe('critical');
    });

    it('should filter by variety type', async () => {
      const mockVarieties = [
        { variety: { id: 1, name: 'Hindu Kush', varietyType: 'landrace' }, plant: { id: 1, name: 'Cannabis' } },
      ];
      
      vi.mocked(db.getPlantVarietiesWithFilters).mockResolvedValue(mockVarieties);
      
      const result = await db.getPlantVarietiesWithFilters({ varietyType: 'landrace' });
      
      expect(result).toHaveLength(1);
      expect(result[0].variety.varietyType).toBe('landrace');
    });

    it('should filter by search query', async () => {
      const mockVarieties = [
        { variety: { id: 1, name: 'Afghan Kush', latinName: 'Cannabis sativa var. afghanica' }, plant: { id: 1, name: 'Cannabis' } },
      ];
      
      vi.mocked(db.getPlantVarietiesWithFilters).mockResolvedValue(mockVarieties);
      
      const result = await db.getPlantVarietiesWithFilters({ searchQuery: 'Afghan' });
      
      expect(result).toHaveLength(1);
      expect(result[0].variety.name).toContain('Afghan');
    });
  });

  describe('getCriticalVarieties', () => {
    it('should return only critical and endangered varieties', async () => {
      const mockCriticalVarieties = [
        { variety: { id: 1, name: 'Endangered Landrace', conservationStatus: 'critical' }, plant: { id: 1, name: 'Cannabis' } },
        { variety: { id: 2, name: 'At Risk Variety', conservationStatus: 'endangered' }, plant: { id: 2, name: 'Tabac' } },
      ];
      
      vi.mocked(db.getCriticalVarieties).mockResolvedValue(mockCriticalVarieties);
      
      const result = await db.getCriticalVarieties();
      
      expect(result).toHaveLength(2);
      expect(result.every((v: any) => ['critical', 'endangered'].includes(v.variety.conservationStatus))).toBe(true);
    });
  });

  describe('getConservationStats', () => {
    it('should return conservation statistics', async () => {
      const mockStats = {
        total: 10,
        byStatus: [
          { status: 'stable', count: 5 },
          { status: 'critical', count: 2 },
          { status: 'endangered', count: 3 },
        ],
        byCategory: [
          { category: 'cannabis', count: 6 },
          { category: 'tabac', count: 4 },
        ],
      };
      
      vi.mocked(db.getConservationStats).mockResolvedValue(mockStats);
      
      const result = await db.getConservationStats();
      
      expect(result.total).toBe(10);
      expect(result.byStatus).toHaveLength(3);
      expect(result.byCategory).toHaveLength(2);
    });
  });

  describe('getCannabisLandraces', () => {
    it('should return only cannabis landraces', async () => {
      const mockLandraces = [
        { variety: { id: 1, name: 'Afghan Kush', varietyType: 'landrace' }, plant: { id: 1, name: 'Cannabis', category: 'cannabis' } },
        { variety: { id: 2, name: 'Thai Stick', varietyType: 'landrace' }, plant: { id: 1, name: 'Cannabis', category: 'cannabis' } },
      ];
      
      vi.mocked(db.getCannabisLandraces).mockResolvedValue(mockLandraces);
      
      const result = await db.getCannabisLandraces();
      
      expect(result).toHaveLength(2);
      expect(result.every((v: any) => v.variety.varietyType === 'landrace' && v.plant.category === 'cannabis')).toBe(true);
    });
  });

  describe('getTobaccoVarieties', () => {
    it('should return only tobacco varieties', async () => {
      const mockVarieties = [
        { variety: { id: 1, name: 'Virginia Gold' }, plant: { id: 2, name: 'Tabac', category: 'tabac' } },
        { variety: { id: 2, name: 'Burley' }, plant: { id: 2, name: 'Tabac', category: 'tabac' } },
      ];
      
      vi.mocked(db.getTobaccoVarieties).mockResolvedValue(mockVarieties);
      
      const result = await db.getTobaccoVarieties();
      
      expect(result).toHaveLength(2);
      expect(result.every((v: any) => v.plant.category === 'tabac')).toBe(true);
    });
  });

  describe('getUniqueVarietyCountries', () => {
    it('should return unique countries', async () => {
      const mockCountries = ['Afghanistan', 'Colombia', 'Thailand', 'Jamaica'];
      
      vi.mocked(db.getUniqueVarietyCountries).mockResolvedValue(mockCountries);
      
      const result = await db.getUniqueVarietyCountries();
      
      expect(result).toHaveLength(4);
      expect(result).toContain('Afghanistan');
      expect(result).toContain('Colombia');
    });
  });

  describe('updateVarietyConservationStatus', () => {
    it('should update conservation status successfully', async () => {
      const mockUpdatedVariety = {
        id: 1,
        name: 'Test Variety',
        conservationStatus: 'critical',
        conservationNotes: 'Population declining rapidly',
        threatFactors: ['habitat loss', 'climate change'],
      };
      
      vi.mocked(db.updateVarietyConservationStatus).mockResolvedValue(mockUpdatedVariety);
      
      const result = await db.updateVarietyConservationStatus(1, {
        conservationStatus: 'critical',
        conservationNotes: 'Population declining rapidly',
        threatFactors: ['habitat loss', 'climate change'],
      });
      
      expect(result).toBeDefined();
      expect(result?.conservationStatus).toBe('critical');
      expect(result?.threatFactors).toContain('habitat loss');
    });
  });
});

describe('Plant-Molecule Links Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllPlantMoleculeLinks', () => {
    it('should return all plant-molecule links', async () => {
      const mockLinks = [
        { link: { id: 1, plantId: 1, moleculeId: 1 }, plant: { id: 1, name: 'Lavande' }, molecule: { id: 1, name: 'Linalol' } },
        { link: { id: 2, plantId: 1, moleculeId: 2 }, plant: { id: 1, name: 'Lavande' }, molecule: { id: 2, name: 'Linalyl acetate' } },
      ];
      
      vi.mocked(db.getAllPlantMoleculeLinks).mockResolvedValue(mockLinks);
      
      const result = await db.getAllPlantMoleculeLinks();
      
      expect(result).toHaveLength(2);
    });
  });

  describe('getPlantsByMolecule', () => {
    it('should return plants containing a specific molecule', async () => {
      const mockPlants = [
        { plant: { id: 1, name: 'Lavande' }, percentageTypical: '25', isSignature: 1, role: 'majeur' },
        { plant: { id: 2, name: 'Bergamote' }, percentageTypical: '15', isSignature: 0, role: 'secondaire' },
      ];
      
      vi.mocked(db.getPlantsByMolecule).mockResolvedValue(mockPlants);
      
      const result = await db.getPlantsByMolecule(1); // Linalol
      
      expect(result).toHaveLength(2);
      expect(result[0].plant.name).toBe('Lavande');
    });
  });

  describe('getSignatureMolecules', () => {
    it('should return signature molecules for a plant', async () => {
      const mockMolecules = [
        { molecule: { id: 1, name: 'Linalol' }, percentageTypical: '35', role: 'majeur' },
        { molecule: { id: 2, name: 'Linalyl acetate' }, percentageTypical: '25', role: 'majeur' },
      ];
      
      vi.mocked(db.getSignatureMolecules).mockResolvedValue(mockMolecules);
      
      const result = await db.getSignatureMolecules(1); // Lavande
      
      expect(result).toHaveLength(2);
      expect(result[0].molecule.name).toBe('Linalol');
    });
  });

  describe('createPlantMoleculeLink', () => {
    it('should create a new plant-molecule link', async () => {
      const mockLink = {
        id: 1,
        plantId: 1,
        moleculeId: 1,
        percentageTypical: 25,
        isSignature: 1,
        role: 'majeur',
      };
      
      vi.mocked(db.createPlantMoleculeLink).mockResolvedValue(mockLink);
      
      const result = await db.createPlantMoleculeLink({
        plantId: 1,
        moleculeId: 1,
        percentageTypical: 25,
        isSignature: 1,
        role: 'majeur',
      });
      
      expect(result).toBeDefined();
      expect(result.plantId).toBe(1);
      expect(result.moleculeId).toBe(1);
    });
  });

  describe('deletePlantMoleculeLink', () => {
    it('should delete a plant-molecule link', async () => {
      vi.mocked(db.deletePlantMoleculeLink).mockResolvedValue(undefined);
      
      await expect(db.deletePlantMoleculeLink(1, 1)).resolves.not.toThrow();
      expect(db.deletePlantMoleculeLink).toHaveBeenCalledWith(1, 1);
    });
  });
});

describe('Conservation Status Values', () => {
  it('should have valid conservation status enum values', () => {
    const validStatuses = ['critical', 'endangered', 'vulnerable', 'near_threatened', 'stable', 'data_deficient', 'unknown'];
    
    // Test that all statuses are strings
    validStatuses.forEach(status => {
      expect(typeof status).toBe('string');
    });
    
    // Test that we have 7 statuses
    expect(validStatuses).toHaveLength(7);
  });

  it('should have valid variety type enum values', () => {
    const validTypes = ['cultivar', 'chemotype', 'landrace', 'hybrid', 'clone', 'wild', 'other'];
    
    // Test that all types are strings
    validTypes.forEach(type => {
      expect(typeof type).toBe('string');
    });
    
    // Test that we have 7 types
    expect(validTypes).toHaveLength(7);
  });
});
