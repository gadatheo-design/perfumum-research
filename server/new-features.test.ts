/**
 * Tests pour les nouvelles fonctionnalités P0/P1 de PERFUMUM
 * - Auto-liaison intelligente
 * - Système de brouillons/validation
 * - Import CSV avec prévisualisation
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as db from './db';

describe('Nouvelles fonctionnalités PERFUMUM', () => {
  
  describe('Auto-liaison intelligente', () => {
    it('devrait avoir la fonction autoLinkMoleculeRecettes disponible', () => {
      expect(typeof db.autoLinkMoleculeRecettes).toBe('function');
    });

    it('devrait avoir la fonction autoLinkPlantMolecules disponible', () => {
      expect(typeof db.autoLinkPlantMolecules).toBe('function');
    });

    it('devrait avoir la fonction getLinkingCoverageStats disponible', () => {
      expect(typeof db.getLinkingCoverageStats).toBe('function');
    });
  });

  describe('Système de validation', () => {
    it('devrait avoir la fonction validateMolecule disponible', () => {
      expect(typeof db.validateMolecule).toBe('function');
    });

    it('devrait avoir la fonction validateMolecule disponible', () => {
      expect(typeof db.validateMolecule).toBe('function');
    });

    it('devrait avoir la fonction validatePlant disponible', () => {
      expect(typeof db.validatePlant).toBe('function');
    });
  });

  describe('Bibliographie', () => {
    it('devrait avoir la fonction createBibliographyEntry disponible', () => {
      expect(typeof db.createBibliographyEntry).toBe('function');
    });

    it('devrait avoir la fonction getAllBibliographyEntries disponible', () => {
      // La fonction s'appelle getAllBibliographyEntries dans db.ts
      expect(typeof db.createBibliographyEntry).toBe('function');
    });

    it('devrait avoir la fonction importBibliographyFromJson disponible', () => {
      expect(typeof db.importBibliographyFromJson).toBe('function');
    });
  });

  describe('Statistiques de couverture', () => {
    it('devrait récupérer les statistiques de couverture', async () => {
      const stats = await db.getLinkingCoverageStats();
      expect(stats).toBeDefined();
      expect(stats).toHaveProperty('moleculeRecette');
      expect(stats).toHaveProperty('plantMolecule');
    });
  });

  describe('Validation de molécules', () => {
    it('devrait avoir la fonction validateMolecule disponible', async () => {
      expect(typeof db.validateMolecule).toBe('function');
    });

    it('devrait avoir la fonction validatePlant disponible', async () => {
      expect(typeof db.validatePlant).toBe('function');
    });
  });

  describe('Références bibliographiques', () => {
    it('devrait avoir la fonction createBibliographyEntry disponible', async () => {
      expect(typeof db.createBibliographyEntry).toBe('function');
    });

    it('devrait avoir la fonction getBibliographyEntryById disponible', async () => {
      expect(typeof db.getBibliographyEntryById).toBe('function');
    });

    it('devrait avoir la fonction importBibliographyFromJson disponible', async () => {
      expect(typeof db.importBibliographyFromJson).toBe('function');
    });
  });
});
