import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as db from './db';

// Mock the database functions
vi.mock('./db', () => ({
  getAllSustainableAlternatives: vi.fn(),
  getSustainableAlternativeById: vi.fn(),
  getAlternativesByThreatenedPlant: vi.fn(),
  getAlternativesByType: vi.fn(),
  searchSustainableAlternatives: vi.fn(),
  getThreatenedPlantsWithAlternatives: vi.fn(),
  getAlternativesGroupedBySpecies: vi.fn(),
  getAlternativesStats: vi.fn(),
  createSustainableAlternative: vi.fn(),
  updateSustainableAlternative: vi.fn(),
  deleteSustainableAlternative: vi.fn(),
}));

describe('Sustainable Alternatives Database Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllSustainableAlternatives', () => {
    it('should return all alternatives', async () => {
      const mockAlternatives = [
        {
          id: 1,
          threatenedPlantId: 1,
          threatenedPlantName: 'Bois de Rose',
          alternativeName: 'Linalol synthétique',
          alternativeType: 'synthetic',
          olfactiveSimilarity: 'very_similar',
          availability: 'widely_available',
        },
        {
          id: 2,
          threatenedPlantId: 2,
          threatenedPlantName: 'Santal',
          alternativeName: 'Santal australien',
          alternativeType: 'cultivated',
          olfactiveSimilarity: 'similar',
          availability: 'available',
        },
      ];

      vi.mocked(db.getAllSustainableAlternatives).mockResolvedValue(mockAlternatives as any);

      const result = await db.getAllSustainableAlternatives();

      expect(result).toHaveLength(2);
      expect(result[0].threatenedPlantName).toBe('Bois de Rose');
      expect(result[1].alternativeType).toBe('cultivated');
    });

    it('should return empty array when no alternatives exist', async () => {
      vi.mocked(db.getAllSustainableAlternatives).mockResolvedValue([]);

      const result = await db.getAllSustainableAlternatives();

      expect(result).toHaveLength(0);
    });
  });

  describe('getSustainableAlternativeById', () => {
    it('should return alternative by id', async () => {
      const mockAlternative = {
        id: 1,
        threatenedPlantId: 1,
        threatenedPlantName: 'Bois de Rose',
        alternativeName: 'Linalol synthétique',
        alternativeType: 'synthetic',
        olfactiveSimilarity: 'very_similar',
        availability: 'widely_available',
        sustainabilityScore: 8,
      };

      vi.mocked(db.getSustainableAlternativeById).mockResolvedValue(mockAlternative as any);

      const result = await db.getSustainableAlternativeById(1);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(1);
      expect(result?.sustainabilityScore).toBe(8);
    });

    it('should return null for non-existent id', async () => {
      vi.mocked(db.getSustainableAlternativeById).mockResolvedValue(null);

      const result = await db.getSustainableAlternativeById(999);

      expect(result).toBeNull();
    });
  });

  describe('getAlternativesByThreatenedPlant', () => {
    it('should return alternatives for a specific threatened plant', async () => {
      const mockAlternatives = [
        {
          id: 1,
          threatenedPlantId: 1,
          threatenedPlantName: 'Bois de Rose',
          alternativeName: 'Linalol synthétique',
          alternativeType: 'synthetic',
        },
        {
          id: 2,
          threatenedPlantId: 1,
          threatenedPlantName: 'Bois de Rose',
          alternativeName: 'Ho Wood',
          alternativeType: 'natural_plant',
        },
      ];

      vi.mocked(db.getAlternativesByThreatenedPlant).mockResolvedValue(mockAlternatives as any);

      const result = await db.getAlternativesByThreatenedPlant(1);

      expect(result).toHaveLength(2);
      expect(result.every(a => a.threatenedPlantId === 1)).toBe(true);
    });
  });

  describe('getAlternativesByType', () => {
    it('should return alternatives filtered by type', async () => {
      const mockAlternatives = [
        {
          id: 1,
          alternativeType: 'synthetic',
          alternativeName: 'Linalol synthétique',
        },
        {
          id: 3,
          alternativeType: 'synthetic',
          alternativeName: 'Coumarine synthétique',
        },
      ];

      vi.mocked(db.getAlternativesByType).mockResolvedValue(mockAlternatives as any);

      const result = await db.getAlternativesByType('synthetic');

      expect(result).toHaveLength(2);
      expect(result.every(a => a.alternativeType === 'synthetic')).toBe(true);
    });
  });

  describe('searchSustainableAlternatives', () => {
    it('should search with multiple filters', async () => {
      const mockAlternatives = [
        {
          id: 1,
          alternativeType: 'natural_plant',
          availability: 'widely_available',
          olfactiveSimilarity: 'very_similar',
        },
      ];

      vi.mocked(db.searchSustainableAlternatives).mockResolvedValue(mockAlternatives as any);

      const result = await db.searchSustainableAlternatives({
        alternativeType: 'natural_plant',
        availability: 'widely_available',
        olfactiveSimilarity: 'very_similar',
      });

      expect(result).toHaveLength(1);
      expect(db.searchSustainableAlternatives).toHaveBeenCalledWith({
        alternativeType: 'natural_plant',
        availability: 'widely_available',
        olfactiveSimilarity: 'very_similar',
      });
    });

    it('should search by query string', async () => {
      const mockAlternatives = [
        {
          id: 1,
          threatenedPlantName: 'Bois de Rose',
          alternativeName: 'Ho Wood',
        },
      ];

      vi.mocked(db.searchSustainableAlternatives).mockResolvedValue(mockAlternatives as any);

      const result = await db.searchSustainableAlternatives({
        searchQuery: 'Rose',
      });

      expect(result).toHaveLength(1);
    });
  });

  describe('getThreatenedPlantsWithAlternatives', () => {
    it('should return threatened plants with their alternatives', async () => {
      const mockData = [
        {
          id: 1,
          name: 'Bois de Rose',
          latinName: 'Aniba rosaeodora',
          conservationStatus: 'EN',
          alternatives: [
            { id: 1, alternativeName: 'Ho Wood' },
            { id: 2, alternativeName: 'Linalol synthétique' },
          ],
          alternativeCount: 2,
        },
      ];

      vi.mocked(db.getThreatenedPlantsWithAlternatives).mockResolvedValue(mockData as any);

      const result = await db.getThreatenedPlantsWithAlternatives();

      expect(result).toHaveLength(1);
      expect(result[0].alternativeCount).toBe(2);
      expect(result[0].alternatives).toHaveLength(2);
    });
  });

  describe('getAlternativesStats', () => {
    it('should return statistics about alternatives', async () => {
      const mockStats = {
        totalAlternatives: 10,
        speciesWithAlternatives: 5,
        byType: [
          { type: 'natural_plant', count: 4 },
          { type: 'synthetic', count: 3 },
          { type: 'cultivated', count: 3 },
        ],
        byAvailability: [
          { availability: 'widely_available', count: 5 },
          { availability: 'available', count: 3 },
          { availability: 'limited', count: 2 },
        ],
        bySimilarity: [
          { similarity: 'very_similar', count: 4 },
          { similarity: 'similar', count: 4 },
          { similarity: 'partial', count: 2 },
        ],
      };

      vi.mocked(db.getAlternativesStats).mockResolvedValue(mockStats as any);

      const result = await db.getAlternativesStats();

      expect(result).not.toBeNull();
      expect(result?.totalAlternatives).toBe(10);
      expect(result?.speciesWithAlternatives).toBe(5);
      expect(result?.byType).toHaveLength(3);
    });
  });

  describe('createSustainableAlternative', () => {
    it('should create a new alternative', async () => {
      const newAlternative = {
        threatenedPlantId: 1,
        threatenedPlantName: 'Bois de Rose',
        alternativeName: 'Ho Wood',
        alternativeType: 'natural_plant',
        olfactiveSimilarity: 'very_similar',
        availability: 'available',
        sustainabilityScore: 9,
      };

      const createdAlternative = {
        id: 1,
        ...newAlternative,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.createSustainableAlternative).mockResolvedValue(createdAlternative as any);

      const result = await db.createSustainableAlternative(newAlternative as any);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(1);
      expect(result?.alternativeName).toBe('Ho Wood');
    });
  });

  describe('updateSustainableAlternative', () => {
    it('should update an existing alternative', async () => {
      const updatedAlternative = {
        id: 1,
        threatenedPlantId: 1,
        threatenedPlantName: 'Bois de Rose',
        alternativeName: 'Ho Wood (Updated)',
        alternativeType: 'natural_plant',
        sustainabilityScore: 10,
      };

      vi.mocked(db.updateSustainableAlternative).mockResolvedValue(updatedAlternative as any);

      const result = await db.updateSustainableAlternative(1, {
        alternativeName: 'Ho Wood (Updated)',
        sustainabilityScore: 10,
      });

      expect(result).not.toBeNull();
      expect(result?.alternativeName).toBe('Ho Wood (Updated)');
      expect(result?.sustainabilityScore).toBe(10);
    });
  });

  describe('deleteSustainableAlternative', () => {
    it('should delete an alternative', async () => {
      vi.mocked(db.deleteSustainableAlternative).mockResolvedValue(true);

      const result = await db.deleteSustainableAlternative(1);

      expect(result).toBe(true);
      expect(db.deleteSustainableAlternative).toHaveBeenCalledWith(1);
    });

    it('should return false for non-existent alternative', async () => {
      vi.mocked(db.deleteSustainableAlternative).mockResolvedValue(false);

      const result = await db.deleteSustainableAlternative(999);

      expect(result).toBe(false);
    });
  });
});

describe('Alternative Types Validation', () => {
  it('should validate alternative type enum values', () => {
    const validTypes = ['natural_plant', 'cultivated', 'synthetic', 'biotechnology', 'blend', 'other'];
    
    validTypes.forEach(type => {
      expect(validTypes).toContain(type);
    });
  });

  it('should validate olfactive similarity enum values', () => {
    const validSimilarities = ['identical', 'very_similar', 'similar', 'partial', 'inspired', 'different'];
    
    validSimilarities.forEach(similarity => {
      expect(validSimilarities).toContain(similarity);
    });
  });

  it('should validate availability enum values', () => {
    const validAvailabilities = ['widely_available', 'available', 'limited', 'rare', 'research_only'];
    
    validAvailabilities.forEach(availability => {
      expect(validAvailabilities).toContain(availability);
    });
  });
});
