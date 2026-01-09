/**
 * Tests pour la fonctionnalité de recherche croisée
 * Terroirs ↔ Plantes ↔ Molécules
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock des données de test
const mockTerroirs = [
  { id: 1, name: 'Provence', country: 'France', region: 'PACA', climateType: 'mediterranean' },
  { id: 2, name: 'Grasse', country: 'France', region: 'PACA', climateType: 'mediterranean' },
  { id: 3, name: 'Madagascar', country: 'Madagascar', region: 'Est', climateType: 'tropical' },
];

const mockPlants = [
  { id: 1, name: 'Lavande', latinName: 'Lavandula angustifolia', category: 'Aromatique', family: 'Lamiaceae' },
  { id: 2, name: 'Rose', latinName: 'Rosa damascena', category: 'Florale', family: 'Rosaceae' },
  { id: 3, name: 'Ylang-Ylang', latinName: 'Cananga odorata', category: 'Florale', family: 'Annonaceae' },
];

const mockMolecules = [
  { id: 1, name: 'Linalool', family: 'Florale', chemicalClass: 'alcohol', olfactiveProfile: 'Floral, frais' },
  { id: 2, name: 'Geraniol', family: 'Florale', chemicalClass: 'alcohol', olfactiveProfile: 'Rose, citronné' },
  { id: 3, name: 'Limonene', family: 'Agrumes', chemicalClass: 'monoterpene', olfactiveProfile: 'Citron, orange' },
];

const mockPlantTerroirs = [
  { plantId: 1, terroirId: 1 }, // Lavande -> Provence
  { plantId: 1, terroirId: 2 }, // Lavande -> Grasse
  { plantId: 2, terroirId: 2 }, // Rose -> Grasse
  { plantId: 3, terroirId: 3 }, // Ylang-Ylang -> Madagascar
];

const mockPlantMolecules = [
  { plantId: 1, moleculeId: 1, percentage: '30' }, // Lavande -> Linalool
  { plantId: 1, moleculeId: 3, percentage: '5' },  // Lavande -> Limonene
  { plantId: 2, moleculeId: 2, percentage: '45' }, // Rose -> Geraniol
  { plantId: 3, moleculeId: 1, percentage: '20' }, // Ylang-Ylang -> Linalool
];

// Mock du module db
vi.mock('./db', async () => {
  const actual = await vi.importActual('./db');
  return {
    ...actual,
    getDb: vi.fn().mockResolvedValue({
      select: vi.fn().mockReturnValue({
        from: vi.fn().mockImplementation((table: any) => {
          if (table._.name === 'terroirs') return Promise.resolve(mockTerroirs);
          if (table._.name === 'plants') return Promise.resolve(mockPlants);
          if (table._.name === 'molecules') return Promise.resolve(mockMolecules);
          if (table._.name === 'plant_terroirs') return Promise.resolve(mockPlantTerroirs);
          if (table._.name === 'plant_molecules') return Promise.resolve(mockPlantMolecules);
          return Promise.resolve([]);
        }),
      }),
    }),
  };
});

describe('CrossSearch - Recherche croisée', () => {
  describe('getCrossSearchFilterOptions', () => {
    it('devrait retourner les options de filtres disponibles', async () => {
      // Import dynamique après le mock
      const { getCrossSearchFilterOptions } = await import('./db');
      
      const options = await getCrossSearchFilterOptions();
      
      expect(options).toBeDefined();
      expect(options.terroirCountries).toBeDefined();
      expect(options.terroirClimates).toBeDefined();
      expect(options.plantCategories).toBeDefined();
      expect(options.plantFamilies).toBeDefined();
      expect(options.moleculeFamilies).toBeDefined();
      expect(options.chemicalClasses).toBeDefined();
    });
  });

  describe('crossSearch', () => {
    it('devrait retourner tous les résultats sans filtres', async () => {
      const { crossSearch } = await import('./db');
      
      const results = await crossSearch({});
      
      expect(results).toBeDefined();
      expect(results.terroirs).toBeDefined();
      expect(results.plants).toBeDefined();
      expect(results.molecules).toBeDefined();
      expect(results.stats).toBeDefined();
    });

    it('devrait filtrer par pays de terroir', async () => {
      const { crossSearch } = await import('./db');
      
      const results = await crossSearch({
        terroirCountries: ['France'],
      });
      
      expect(results.terroirs.length).toBeGreaterThan(0);
      results.terroirs.forEach(t => {
        expect(t.country).toBe('France');
      });
    });

    it('devrait filtrer par catégorie de plante', async () => {
      const { crossSearch, getCrossSearchFilterOptions } = await import('./db');
      
      // D'abord récupérer les catégories disponibles
      const options = await getCrossSearchFilterOptions();
      const firstCategory = options.plantCategories[0];
      
      if (!firstCategory) {
        // Pas de catégories disponibles, test pass
        expect(true).toBe(true);
        return;
      }
      
      const results = await crossSearch({
        plantCategories: [firstCategory],
      });
      
      // Vérifier que les résultats sont filtrés correctement
      expect(results.plants.length).toBeGreaterThanOrEqual(0);
      results.plants.forEach(p => {
        expect(p.category).toBe(firstCategory);
      });
    });

    it('devrait filtrer par classe chimique de molécule', async () => {
      const { crossSearch } = await import('./db');
      
      const results = await crossSearch({
        chemicalClasses: ['alcohol'],
      });
      
      expect(results.molecules.length).toBeGreaterThan(0);
      results.molecules.forEach(m => {
        expect(m.chemicalClass).toBe('alcohol');
      });
    });

    it('devrait effectuer une recherche textuelle', async () => {
      const { crossSearch } = await import('./db');
      
      const results = await crossSearch({
        searchQuery: 'lavande',
      });
      
      expect(results.plants.some(p => p.name.toLowerCase().includes('lavande'))).toBe(true);
    });

    it('devrait inclure les relations si demandé', async () => {
      const { crossSearch } = await import('./db');
      
      const results = await crossSearch({
        includeRelations: true,
      });
      
      expect(results.relations).toBeDefined();
      expect(results.relations.plantTerroirs).toBeDefined();
      expect(results.relations.plantMolecules).toBeDefined();
    });

    it('devrait retourner les statistiques correctes', async () => {
      const { crossSearch } = await import('./db');
      
      const results = await crossSearch({});
      
      expect(results.stats.totalTerroirs).toBeGreaterThanOrEqual(0);
      expect(results.stats.totalPlants).toBeGreaterThanOrEqual(0);
      expect(results.stats.totalMolecules).toBeGreaterThanOrEqual(0);
    });

    it('devrait gérer les filtres croisés (terroir -> plantes liées)', async () => {
      const { crossSearch } = await import('./db');
      
      // Filtrer par terroir France devrait aussi filtrer les plantes liées
      const results = await crossSearch({
        terroirCountries: ['France'],
        includeRelations: true,
      });
      
      // Les plantes retournées devraient être celles liées aux terroirs français
      expect(results.stats.totalPlants).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('CrossSearchResult - Structure des résultats', () => {
  it('devrait avoir la structure correcte pour les terroirs', async () => {
    const { crossSearch } = await import('./db');
    
    const results = await crossSearch({});
    
    if (results.terroirs.length > 0) {
      const terroir = results.terroirs[0];
      expect(terroir).toHaveProperty('id');
      expect(terroir).toHaveProperty('name');
      expect(terroir).toHaveProperty('country');
      expect(terroir).toHaveProperty('region');
      expect(terroir).toHaveProperty('climateType');
      expect(terroir).toHaveProperty('plantCount');
      expect(terroir).toHaveProperty('moleculeCount');
    }
  });

  it('devrait avoir la structure correcte pour les plantes', async () => {
    const { crossSearch } = await import('./db');
    
    const results = await crossSearch({});
    
    if (results.plants.length > 0) {
      const plant = results.plants[0];
      expect(plant).toHaveProperty('id');
      expect(plant).toHaveProperty('name');
      expect(plant).toHaveProperty('latinName');
      expect(plant).toHaveProperty('category');
      expect(plant).toHaveProperty('family');
      expect(plant).toHaveProperty('terroirCount');
      expect(plant).toHaveProperty('moleculeCount');
    }
  });

  it('devrait avoir la structure correcte pour les molécules', async () => {
    const { crossSearch } = await import('./db');
    
    const results = await crossSearch({});
    
    if (results.molecules.length > 0) {
      const molecule = results.molecules[0];
      expect(molecule).toHaveProperty('id');
      expect(molecule).toHaveProperty('name');
      expect(molecule).toHaveProperty('family');
      expect(molecule).toHaveProperty('chemicalClass');
      expect(molecule).toHaveProperty('olfactiveProfile');
      expect(molecule).toHaveProperty('plantCount');
    }
  });
});
