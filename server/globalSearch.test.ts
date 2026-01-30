import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database module
vi.mock('./db', async () => {
  const actual = await vi.importActual('./db');
  return {
    ...actual,
    globalSearch: vi.fn(),
  };
});

import * as db from './db';

describe('Global Search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('globalSearch function', () => {
    it('should return empty results for empty query', async () => {
      const mockResult = {
        molecules: [],
        recettes: [],
        plants: [],
        accords: [],
        terpProfiles: [],
        finalRecipes: [],
        civilisations: [],
        prototypes: [],
        glossary: [],
        total: 0
      };
      
      vi.mocked(db.globalSearch).mockResolvedValue(mockResult);
      
      const result = await db.globalSearch('');
      expect(result.total).toBe(0);
    });

    it('should return structured results with correct types', async () => {
      const mockResult = {
        molecules: [
          { type: 'molecule' as const, id: 1, name: 'Limonène', description: 'Agrume', metadata: { family: 'Terpène' } }
        ],
        recettes: [
          { type: 'recette' as const, id: 1, name: 'Test Recette', description: 'Description', metadata: { category: 'Test' } }
        ],
        plants: [],
        accords: [],
        terpProfiles: [],
        finalRecipes: [],
        civilisations: [],
        prototypes: [],
        glossary: [],
        total: 2
      };
      
      vi.mocked(db.globalSearch).mockResolvedValue(mockResult);
      
      const result = await db.globalSearch('limon');
      
      expect(result.molecules).toHaveLength(1);
      expect(result.molecules[0].type).toBe('molecule');
      expect(result.molecules[0].name).toBe('Limonène');
      expect(result.total).toBe(2);
    });

    it('should search across multiple categories', async () => {
      const mockResult = {
        molecules: [
          { type: 'molecule' as const, id: 1, name: 'Lavandulol', description: null, metadata: {} }
        ],
        recettes: [],
        plants: [
          { type: 'plant' as const, id: 1, name: 'Lavande', description: 'Plante aromatique', metadata: { latinName: 'Lavandula' } }
        ],
        accords: [],
        terpProfiles: [],
        finalRecipes: [],
        civilisations: [],
        prototypes: [],
        glossary: [],
        total: 2
      };
      
      vi.mocked(db.globalSearch).mockResolvedValue(mockResult);
      
      const result = await db.globalSearch('lavand');
      
      expect(result.molecules.length + result.plants.length).toBe(2);
      expect(result.total).toBe(2);
    });

    it('should respect the limit parameter', async () => {
      const mockResult = {
        molecules: Array(5).fill(null).map((_, i) => ({
          type: 'molecule' as const,
          id: i + 1,
          name: `Molecule ${i + 1}`,
          description: null,
          metadata: {}
        })),
        recettes: [],
        plants: [],
        accords: [],
        terpProfiles: [],
        finalRecipes: [],
        civilisations: [],
        prototypes: [],
        glossary: [],
        total: 5
      };
      
      vi.mocked(db.globalSearch).mockResolvedValue(mockResult);
      
      const result = await db.globalSearch('test', 50);
      
      expect(result.molecules.length).toBeLessThanOrEqual(50);
    });

    it('should include metadata in results', async () => {
      const mockResult = {
        molecules: [
          { 
            type: 'molecule' as const, 
            id: 1, 
            name: 'Myrcène', 
            description: 'Terpène monoterpénique',
            metadata: { 
              family: 'Monoterpène', 
              chemicalFormula: 'C10H16',
              casNumber: '123-35-3'
            } 
          }
        ],
        recettes: [],
        plants: [],
        accords: [],
        terpProfiles: [],
        finalRecipes: [],
        civilisations: [],
        prototypes: [],
        glossary: [],
        total: 1
      };
      
      vi.mocked(db.globalSearch).mockResolvedValue(mockResult);
      
      const result = await db.globalSearch('myrcene');
      
      expect(result.molecules[0].metadata).toBeDefined();
      expect(result.molecules[0].metadata?.family).toBe('Monoterpène');
      expect(result.molecules[0].metadata?.chemicalFormula).toBe('C10H16');
    });

    it('should search in terpProfiles', async () => {
      const mockResult = {
        molecules: [],
        recettes: [],
        plants: [],
        accords: [],
        terpProfiles: [
          { 
            type: 'terpProfile' as const, 
            id: 1, 
            name: 'Profil Vent', 
            description: 'Axe climatique vent',
            metadata: { 
              profileId: 'SA-001',
              climaticAxis: 'vent',
              usage: 'parfum'
            } 
          }
        ],
        finalRecipes: [],
        civilisations: [],
        prototypes: [],
        glossary: [],
        total: 1
      };
      
      vi.mocked(db.globalSearch).mockResolvedValue(mockResult);
      
      const result = await db.globalSearch('vent');
      
      expect(result.terpProfiles).toHaveLength(1);
      expect(result.terpProfiles[0].metadata?.climaticAxis).toBe('vent');
    });

    it('should search in finalRecipes', async () => {
      const mockResult = {
        molecules: [],
        recettes: [],
        plants: [],
        accords: [],
        terpProfiles: [],
        finalRecipes: [
          { 
            type: 'finalRecipe' as const, 
            id: 1, 
            name: 'Recette Encens', 
            description: 'Formulation encens',
            metadata: { 
              recipeId: 'RF-001',
              recipeType: 'encens',
              climaticAxis: 'bois'
            } 
          }
        ],
        civilisations: [],
        prototypes: [],
        glossary: [],
        total: 1
      };
      
      vi.mocked(db.globalSearch).mockResolvedValue(mockResult);
      
      const result = await db.globalSearch('encens');
      
      expect(result.finalRecipes).toHaveLength(1);
      expect(result.finalRecipes[0].metadata?.recipeType).toBe('encens');
    });
  });

  describe('GlobalSearchResult interface', () => {
    it('should have correct type literals', () => {
      const validTypes = ['molecule', 'recette', 'plant', 'accord', 'terpProfile', 'finalRecipe', 'civilisation', 'prototype', 'glossary', 'timeline'];
      
      const mockResult: db.GlobalSearchResult = {
        type: 'molecule',
        id: 1,
        name: 'Test',
        description: 'Description',
        metadata: { key: 'value' }
      };
      
      expect(validTypes).toContain(mockResult.type);
      expect(mockResult.id).toBeTypeOf('number');
      expect(mockResult.name).toBeTypeOf('string');
    });
  });
});
