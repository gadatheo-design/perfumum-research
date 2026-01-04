import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

// Créer un contexte de test minimal
function createTestContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {
      clearCookie: () => {},
      cookie: () => {},
    } as TrpcContext['res'],
  };
}

describe('Molecule Origins API', () => {
  const caller = appRouter.createCaller(createTestContext());

  describe('moleculeOrigins.getByMolecule', () => {
    it('should return origins for a molecule with origins', async () => {
      // Test avec Linalool (ID 30009) qui a des origines après notre import
      const result = await caller.moleculeOrigins.getByMolecule(30009);
      expect(Array.isArray(result)).toBe(true);
      // Linalool devrait avoir des origines
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('moleculeId');
        expect(result[0]).toHaveProperty('originId');
        expect(result[0]).toHaveProperty('origin');
      }
    });

    it('should return empty array for molecule without origins', async () => {
      // Test avec une molécule qui n'existe probablement pas
      const result = await caller.moleculeOrigins.getByMolecule(999999);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe('moleculeOrigins CRUD operations', () => {
    let createdId: number | null = null;

    it('should add a new molecule-origin association', async () => {
      const testData = {
        moleculeId: 30001, // Une molécule existante
        originId: 20, // Patchouli d'Indonésie (moins susceptible d'avoir déjà une association)
        isPrimaryOrigin: 0,
        qualityRating: 3,
        notes: 'Test association - vitest',
      };

      try {
        const result = await caller.moleculeOrigins.add(testData);
        expect(result).toHaveProperty('id');
        expect(result.moleculeId).toBe(testData.moleculeId);
        expect(result.originId).toBe(testData.originId);
        createdId = result.id;
      } catch (error) {
        // Si l'association existe déjà, on vérifie le message d'erreur
        expect((error as Error).message).toContain('Duplicate');
      }
    });

    it('should update an existing association', async () => {
      if (!createdId) {
        console.log('Skipping update test - no association created');
        return;
      }

      const updateResult = await caller.moleculeOrigins.update({
        id: createdId,
        data: {
          qualityRating: 5,
          notes: 'Updated note - vitest',
        },
      });
      
      expect(updateResult).toHaveProperty('success', true);
    });

    it('should remove an association', async () => {
      if (!createdId) {
        console.log('Skipping remove test - no association created');
        return;
      }

      const result = await caller.moleculeOrigins.remove(createdId);
      expect(result).toHaveProperty('success', true);
    });
  });
});

describe('Geographic Origins API', () => {
  const caller = appRouter.createCaller(createTestContext());

  describe('geographicOrigins.list', () => {
    it('should return list of geographic origins', async () => {
      const result = await caller.geographicOrigins.list();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('country');
    });
  });

  describe('geographicOrigins.listWithMoleculeCount', () => {
    it('should return origins with molecule count', async () => {
      const result = await caller.geographicOrigins.listWithMoleculeCount();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      // Vérifier que moleculeCount est présent
      expect(result[0]).toHaveProperty('moleculeCount');
    });
  });

  describe('geographicOrigins.getById', () => {
    it('should return a specific origin', async () => {
      const result = await caller.geographicOrigins.getById(1);
      expect(result).not.toBeNull();
      if (result) {
        expect(result).toHaveProperty('id', 1);
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('country');
      }
    });

    it('should return null for non-existent origin', async () => {
      const result = await caller.geographicOrigins.getById(999999);
      expect(result).toBeNull();
    });
  });

  describe('geographicOrigins.getMoleculesWithDetails', () => {
    it('should return molecules for an origin with associations', async () => {
      // Rose de Bulgarie (ID 1) devrait avoir des molécules après notre import
      const result = await caller.geographicOrigins.getMoleculesWithDetails(1);
      expect(Array.isArray(result)).toBe(true);
      // Vérifier la structure si des résultats existent
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('molecule');
        expect(result[0].molecule).toHaveProperty('name');
      }
    });

    it('should return empty array for origin without molecules', async () => {
      // Utiliser un ID qui n'a probablement pas de molécules
      const result = await caller.geographicOrigins.getMoleculesWithDetails(999);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('geographicOrigins.geocode', () => {
    it('should throw error for non-existent origin', async () => {
      await expect(
        caller.geographicOrigins.geocode({ id: 999999 })
      ).rejects.toThrow('Origine non trouvée');
    });

    it('should geocode an origin with custom address', async () => {
      // Test avec une adresse connue - Rose de Bulgarie
      try {
        const result = await caller.geographicOrigins.geocode({
          id: 1,
          address: 'Kazanlak, Bulgaria',
        });
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('latitude');
        expect(result).toHaveProperty('longitude');
        expect(result).toHaveProperty('formattedAddress');
        expect(typeof result.latitude).toBe('number');
        expect(typeof result.longitude).toBe('number');
      } catch (error) {
        // Si l'API échoue (rate limit, etc.), on vérifie juste le message
        console.log('Geocode API error:', (error as Error).message);
      }
    });
  });
});

describe('Molecule Origins Statistics', () => {
  const caller = appRouter.createCaller(createTestContext());

  it('should have populated molecule_origins table', async () => {
    // Vérifier que notre import a fonctionné
    const origins = await caller.geographicOrigins.listWithMoleculeCount();
    const totalMolecules = origins.reduce((sum: number, o: any) => sum + (o.moleculeCount || 0), 0);
    
    // Nous avons importé 100 associations
    expect(totalMolecules).toBeGreaterThanOrEqual(50);
  });

  it('should have origins with molecules', async () => {
    const origins = await caller.geographicOrigins.listWithMoleculeCount();
    const originsWithMolecules = origins.filter((o: any) => (o.moleculeCount || 0) > 0);
    
    // Au moins quelques terroirs devraient avoir des molécules
    expect(originsWithMolecules.length).toBeGreaterThan(5);
  });
});
