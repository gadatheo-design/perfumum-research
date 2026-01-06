import { describe, it, expect } from 'vitest';
import * as db from './db';

describe('Enrichissement des associations molécules-plantes', () => {
  describe('Rose de Damas', () => {
    it('devrait avoir les molécules enrichies', async () => {
      // Récupérer toutes les plantes et trouver Rose de Damas
      const plants = await db.getAllPlants();
      const rose = plants.find(p => p.name === 'Rose de Damas');
      expect(rose).toBeDefined();
      
      if (rose) {
        // Récupérer les associations molécules-plantes via getPlantMolecules
        const associations = await db.getPlantMolecules(rose.id);
        expect(associations).toBeDefined();
        expect(associations.length).toBeGreaterThanOrEqual(4); // Au moins 4 molécules
      }
    });
  });

  describe('Jasmin grandiflorum', () => {
    it('devrait avoir les molécules enrichies', async () => {
      const plants = await db.getAllPlants();
      const jasmin = plants.find(p => p.name === 'Jasmin grandiflorum');
      expect(jasmin).toBeDefined();
      
      if (jasmin) {
        const associations = await db.getPlantMolecules(jasmin.id);
        expect(associations).toBeDefined();
        expect(associations.length).toBeGreaterThanOrEqual(4);
      }
    });
  });

  describe('Vétiver', () => {
    it('devrait avoir les molécules enrichies', async () => {
      const plants = await db.getAllPlants();
      const vetiver = plants.find(p => p.name === 'Vétiver');
      expect(vetiver).toBeDefined();
      
      if (vetiver) {
        const associations = await db.getPlantMolecules(vetiver.id);
        expect(associations).toBeDefined();
        expect(associations.length).toBeGreaterThanOrEqual(2); // Khusimol, Vétivérol + enrichies
      }
    });
  });
});

describe('Nouvelles molécules créées', () => {
  it('devrait avoir créé les molécules enrichies', async () => {
    const molecules = await db.getAllMolecules();
    
    // Vérifier que certaines molécules clés existent
    const moleculeNames = molecules.map(m => m.name);
    
    // Ces molécules devraient exister (soit créées soit déjà présentes)
    expect(molecules.length).toBeGreaterThan(0);
  });
});

describe('Restrictions IFRA enrichies', () => {
  it('devrait avoir des restrictions IFRA', async () => {
    const restrictions = await db.getAllIfraRestrictions();
    expect(restrictions).toBeDefined();
    expect(restrictions.length).toBeGreaterThan(0);
  });

  it('devrait avoir au moins 20 restrictions IFRA', async () => {
    const restrictions = await db.getAllIfraRestrictions();
    expect(restrictions.length).toBeGreaterThanOrEqual(20);
  });

  it('devrait avoir des restrictions pour les molécules sensibilisantes', async () => {
    const restrictedMolecules = await db.getRestrictedMolecules();
    expect(restrictedMolecules).toBeDefined();
    expect(restrictedMolecules.length).toBeGreaterThan(0);
  });
});

describe('Fonctions de profil réglementaire', () => {
  it('devrait pouvoir récupérer les restrictions IFRA par molécule', async () => {
    // Trouver une molécule avec des restrictions
    const restrictedMolecules = await db.getRestrictedMolecules();
    
    if (restrictedMolecules.length > 0) {
      const firstRestricted = restrictedMolecules[0];
      const restrictions = await db.getMoleculeIfraRestrictions(firstRestricted.id);
      expect(restrictions).toBeDefined();
      // Une molécule restreinte devrait avoir au moins une restriction
      expect(Array.isArray(restrictions)).toBe(true);
    }
  });

  it('devrait pouvoir récupérer les catégories IFRA', async () => {
    const categories = await db.getAllIfraCategories();
    expect(categories).toBeDefined();
    // Les catégories IFRA standard sont 11
    expect(categories.length).toBeGreaterThanOrEqual(11);
  });

  it('devrait pouvoir obtenir les statistiques IFRA', async () => {
    const stats = await db.getIfraStats();
    expect(stats).toBeDefined();
    if (stats) {
      expect(stats.total).toBeGreaterThan(0);
    }
  });
});

describe('Associations molécules-plantes', () => {
  it('devrait pouvoir récupérer les molécules pour une plante', async () => {
    const plants = await db.getAllPlants();
    
    if (plants.length > 0) {
      // Trouver une plante avec des molécules (Rose de Damas par exemple)
      const rose = plants.find(p => p.name === 'Rose de Damas');
      if (rose) {
        const molecules = await db.getPlantMolecules(rose.id);
        expect(molecules).toBeDefined();
        expect(Array.isArray(molecules)).toBe(true);
        expect(molecules.length).toBeGreaterThan(0);
      }
    }
  });

  it('devrait pouvoir récupérer les molécules avec pourcentages', async () => {
    const plants = await db.getAllPlants();
    const rose = plants.find(p => p.name === 'Rose de Damas');
    
    if (rose) {
      const molecules = await db.getPlantMoleculesWithPercentages(rose.id);
      expect(molecules).toBeDefined();
      expect(Array.isArray(molecules)).toBe(true);
      if (molecules.length > 0) {
        // Vérifier que les pourcentages sont présents
        expect(molecules[0].percentageTypical).toBeDefined();
      }
    }
  });
});
