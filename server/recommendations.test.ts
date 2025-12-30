import { describe, it, expect } from 'vitest';
import { getSimilarRecettes, getSimilarMolecules, getRecommendedRecettesFromFavorites } from './db-recommendations';

describe('Système de Recommandations', () => {
  describe('getSimilarRecettes', () => {
    it('devrait retourner des recettes similaires basées sur le profil radar', async () => {
      // Test avec la première recette de la base
      const recommendations = await getSimilarRecettes(1, 5);
      
      // Vérifier que des recommandations sont retournées
      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
      
      // Vérifier la structure des recommandations
      if (recommendations.length > 0) {
        const first = recommendations[0];
        expect(first).toHaveProperty('recette');
        expect(first).toHaveProperty('similarityScore');
        expect(first).toHaveProperty('distance');
        
        expect(first.recette).toHaveProperty('id');
        expect(first.recette).toHaveProperty('name');
        expect(first.recette).toHaveProperty('avgIntensity');
        expect(first.recette).toHaveProperty('avgFreshness');
        
        // Vérifier que le score est entre 0 et 100
        expect(first.similarityScore).toBeGreaterThanOrEqual(0);
        expect(first.similarityScore).toBeLessThanOrEqual(100);
        
        // Vérifier que les résultats sont triés par score décroissant
        for (let i = 0; i < recommendations.length - 1; i++) {
          expect(recommendations[i].similarityScore).toBeGreaterThanOrEqual(
            recommendations[i + 1].similarityScore
          );
        }
      }
    });

    it('devrait limiter le nombre de résultats', async () => {
      const recommendations = await getSimilarRecettes(1, 3);
      expect(recommendations.length).toBeLessThanOrEqual(3);
    });

    it('devrait retourner un tableau vide pour une recette inexistante', async () => {
      const recommendations = await getSimilarRecettes(999999, 5);
      expect(recommendations).toEqual([]);
    });
  });

  describe('getSimilarMolecules', () => {
    it('devrait retourner des molécules similaires basées sur le profil radar', async () => {
      const recommendations = await getSimilarMolecules(1, 5);
      
      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
      
      if (recommendations.length > 0) {
        const first = recommendations[0];
        expect(first).toHaveProperty('molecule');
        expect(first).toHaveProperty('similarityScore');
        expect(first).toHaveProperty('distance');
        
        expect(first.molecule).toHaveProperty('id');
        expect(first.molecule).toHaveProperty('name');
        expect(first.molecule).toHaveProperty('radarIntensity');
        expect(first.molecule).toHaveProperty('radarFreshness');
        
        // Vérifier que le score est entre 0 et 100
        expect(first.similarityScore).toBeGreaterThanOrEqual(0);
        expect(first.similarityScore).toBeLessThanOrEqual(100);
        
        // Vérifier que les résultats sont triés par score décroissant
        for (let i = 0; i < recommendations.length - 1; i++) {
          expect(recommendations[i].similarityScore).toBeGreaterThanOrEqual(
            recommendations[i + 1].similarityScore
          );
        }
      }
    });

    it('devrait limiter le nombre de résultats', async () => {
      const recommendations = await getSimilarMolecules(1, 3);
      expect(recommendations.length).toBeLessThanOrEqual(3);
    });

    it('devrait retourner un tableau vide pour une molécule inexistante', async () => {
      const recommendations = await getSimilarMolecules(999999, 5);
      expect(recommendations).toEqual([]);
    });
  });

  describe('getRecommendedRecettesFromFavorites', () => {
    it('devrait retourner des recettes contenant les molécules favorites', async () => {
      // Test avec quelques IDs de molécules
      const favoriteMoleculeIds = [1, 2, 3];
      const recommendations = await getRecommendedRecettesFromFavorites(favoriteMoleculeIds, 10);
      
      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
      
      if (recommendations.length > 0) {
        const first = recommendations[0];
        expect(first).toHaveProperty('recette');
        expect(first).toHaveProperty('matchScore');
        expect(first).toHaveProperty('matchingMolecules');
        
        // Vérifier que le score est entre 0 et 100
        expect(first.matchScore).toBeGreaterThanOrEqual(0);
        expect(first.matchScore).toBeLessThanOrEqual(100);
        
        // Vérifier qu'au moins une molécule favorite est présente
        expect(first.matchingMolecules).toBeGreaterThan(0);
        
        // Vérifier que les résultats sont triés par score décroissant
        for (let i = 0; i < recommendations.length - 1; i++) {
          expect(recommendations[i].matchScore).toBeGreaterThanOrEqual(
            recommendations[i + 1].matchScore
          );
        }
      }
    });

    it('devrait retourner un tableau vide si aucune molécule favorite', async () => {
      const recommendations = await getRecommendedRecettesFromFavorites([], 10);
      expect(recommendations).toEqual([]);
    });

    it('devrait limiter le nombre de résultats', async () => {
      const recommendations = await getRecommendedRecettesFromFavorites([1, 2, 3], 5);
      expect(recommendations.length).toBeLessThanOrEqual(5);
    });

    it('devrait retourner un tableau vide pour des molécules inexistantes', async () => {
      const recommendations = await getRecommendedRecettesFromFavorites([999999, 999998], 10);
      expect(recommendations).toEqual([]);
    });
  });
});
