import { describe, it, expect } from 'vitest';
import { 
  getFlavornetDataByCAS, 
  getFlavornetDataByName, 
  getFlavornetStats, 
  getAllPercepts,
  searchByPercept 
} from './flavornet';

describe('Session 6 - Améliorations UX et Enrichissement', () => {
  describe('Base Flavornet enrichie', () => {
    it('devrait contenir au moins 200 composés', () => {
      const stats = getFlavornetStats();
      expect(stats.totalCompounds).toBeGreaterThanOrEqual(200);
    });

    it('devrait contenir les composés de base', () => {
      // Monoterpènes de base
      expect(getFlavornetDataByCAS('78-70-6')).toBeDefined(); // linalool
      expect(getFlavornetDataByCAS('106-24-1')).toBeDefined(); // geraniol
      expect(getFlavornetDataByCAS('5989-27-5')).toBeDefined(); // limonene
      
      // Aldéhydes
      expect(getFlavornetDataByCAS('66-25-1')).toBeDefined(); // hexanal
      expect(getFlavornetDataByCAS('124-13-0')).toBeDefined(); // octanal
    });

    it('devrait avoir des percepts pour tous les composés', () => {
      const stats = getFlavornetStats();
      expect(stats.withPercepts).toBe(stats.totalCompounds);
    });
  });

  describe('Recherche Flavornet', () => {
    it('devrait trouver un composé par nom', () => {
      const result = getFlavornetDataByName('linalool');
      expect(result).toBeDefined();
      expect(result?.casNumber).toBe('78-70-6');
    });

    it('devrait trouver un composé par CAS', () => {
      const result = getFlavornetDataByCAS('106-24-1');
      expect(result).toBeDefined();
      expect(result?.name).toBe('geraniol');
    });

    it('devrait retourner null pour un composé inexistant', () => {
      const result = getFlavornetDataByName('composé_inexistant_xyz');
      expect(result).toBeNull();
    });
  });

  describe('Percepts disponibles', () => {
    it('devrait avoir une variété de percepts', () => {
      const allPercepts = getAllPercepts();
      
      // Vérifier que les percepts courants sont présents
      expect(allPercepts).toContain('floral');
      expect(allPercepts).toContain('woody');
      expect(allPercepts).toContain('citrus');
      expect(allPercepts).toContain('fruity');
      
      // Au moins 60 percepts uniques
      expect(allPercepts.length).toBeGreaterThanOrEqual(60);
    });

    it('devrait pouvoir rechercher par percept', () => {
      const floralCompounds = searchByPercept('floral');
      expect(floralCompounds.length).toBeGreaterThan(0);
      
      // Tous les résultats doivent contenir le percept 'floral'
      for (const compound of floralCompounds) {
        expect(compound.percepts.some(p => p.toLowerCase().includes('floral'))).toBe(true);
      }
    });
  });
});
