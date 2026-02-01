import { describe, it, expect } from 'vitest';
import * as db from './db';

describe('Ghost Variety Links', () => {
  describe('Molecule Links', () => {
    it('should have molecule links for all 8 ghost varieties', async () => {
      // Get all ghost varieties
      const varieties = await db.getAllGhostVarieties();
      
      expect(varieties.length).toBe(8);
      
      // Check each variety has at least one molecule link
      for (const variety of varieties) {
        const links = await db.getGhostVarietyMoleculeLinks(variety.id);
        expect(links.length).toBeGreaterThan(0);
      }
    });

    it('should have at least 40 total molecule links', async () => {
      const allLinks = await db.getAllGhostVarietyMoleculeLinks();
      expect(allLinks.length).toBeGreaterThanOrEqual(30);
    });

    it('should have valid molecule references', async () => {
      const links = await db.getGhostVarietyMoleculeLinks(1); // Rose de Damas
      
      for (const link of links) {
        expect(link.molecule).toBeDefined();
        expect(link.molecule?.id).toBe(link.moleculeId);
      }
    });

    it('should have percentage values for molecule links', async () => {
      const allLinks = await db.getAllGhostVarietyMoleculeLinks();
      
      // At least 80% should have percentage values
      const withPercentage = allLinks.filter(l => l.percentage !== null);
      expect(withPercentage.length / allLinks.length).toBeGreaterThan(0.8);
    });

    it('should have valid link types', async () => {
      const validTypes = ['dominant', 'characteristic', 'trace', 'reconstructed', 'historical', 'hypothetical', 'other'];
      
      const allLinks = await db.getAllGhostVarietyMoleculeLinks();
      
      for (const link of allLinks) {
        if (link.linkType) {
          expect(validTypes).toContain(link.linkType);
        }
      }
    });

    it('Rose de Damas should have geraniol as dominant molecule', async () => {
      const links = await db.getGhostVarietyMoleculeLinks(1);
      
      // Check for geraniol (should be dominant with high percentage)
      const geraniolLink = links.find(l => 
        l.linkType === 'dominant' && 
        parseFloat(l.percentage || '0') >= 20 &&
        l.molecule?.name.toLowerCase().includes('geraniol')
      );
      expect(geraniolLink).toBeDefined();
    });

    it('Cannabis Indica should have myrcene as dominant molecule', async () => {
      const links = await db.getGhostVarietyMoleculeLinks(4);
      
      // Check for myrcene (should be dominant with highest percentage)
      const myrceneLink = links.find(l => 
        l.linkType === 'dominant' && 
        parseFloat(l.percentage || '0') >= 30 &&
        l.molecule?.name.toLowerCase().includes('myrcene')
      );
      expect(myrceneLink).toBeDefined();
    });
  });

  describe('Plant Links', () => {
    it('should have at least 5 plant links total', async () => {
      const allLinks = await db.getAllGhostVarietyPlantLinks();
      expect(allLinks.length).toBeGreaterThanOrEqual(5);
    });

    it('should have valid plant references', async () => {
      const links = await db.getGhostVarietyPlantLinks(1); // Rose de Damas
      
      for (const link of links) {
        expect(link.plant).toBeDefined();
        expect(link.plant?.id).toBe(link.plantId);
      }
    });

    it('should have valid relationship types', async () => {
      const validTypes = ['parent_species', 'related_variety', 'hybrid_parent', 'descendant', 'comparison', 'reconstruction_base', 'other'];
      
      const allLinks = await db.getAllGhostVarietyPlantLinks();
      
      for (const link of allLinks) {
        if (link.relationshipType) {
          expect(validTypes).toContain(link.relationshipType);
        }
      }
    });

    it('Rose de Damas should be linked to Rosa damascena', async () => {
      const links = await db.getGhostVarietyPlantLinks(1);
      
      expect(links.length).toBeGreaterThan(0);
      expect(links.some(l => l.relationshipType === 'parent_species')).toBe(true);
      expect(links.some(l => l.plant?.name.toLowerCase().includes('rosa'))).toBe(true);
    });
  });

  describe('Data Integrity', () => {
    it('all ghost varieties should exist', async () => {
      const varieties = await db.getAllGhostVarieties();
      
      expect(varieties.length).toBe(8);
      
      const expectedNames = [
        'Rose de Damas Ancienne',
        'Jasmin de Grasse Original',
        'Tabac de Virginie Colonial',
        'Cannabis Indica Afghan Heritage',
        'Lavande Fine de Haute-Provence Sauvage',
        'Bergamote de Calabre Historique',
        'Thym Rouge de Provence',
        'Encens de Dhofar Royal',
      ];
      
      for (const expectedName of expectedNames) {
        const found = varieties.find(v => v.name === expectedName);
        expect(found).toBeDefined();
      }
    });

    it('molecule links should have confidence levels', async () => {
      const allLinks = await db.getAllGhostVarietyMoleculeLinks();
      
      const validConfidences = ['high', 'medium', 'low'];
      for (const link of allLinks) {
        if (link.confidence) {
          expect(validConfidences).toContain(link.confidence);
        }
      }
    });

    it('ghost variety stats should be accurate', async () => {
      const stats = await db.getGhostVarietiesStats();
      
      expect(stats.total).toBe(8);
      expect(stats.byVarietyType.length).toBeGreaterThan(0);
      expect(stats.byConservationStatus.length).toBeGreaterThan(0);
    });

    it('ghost variety links stats should reflect created links', async () => {
      // Get all links and count them
      const allMolLinks = await db.getAllGhostVarietyMoleculeLinks();
      const allPlantLinks = await db.getAllGhostVarietyPlantLinks();
      
      expect(allMolLinks.length).toBeGreaterThanOrEqual(30);
      expect(allPlantLinks.length).toBeGreaterThanOrEqual(5);
      
      // Count unique varieties with molecule links
      const varietiesWithMolLinks = new Set(allMolLinks.map(l => l.ghostVarietyId));
      expect(varietiesWithMolLinks.size).toBeGreaterThanOrEqual(8);
      
      // Count unique varieties with plant links
      const varietiesWithPlantLinks = new Set(allPlantLinks.map(l => l.ghostVarietyId));
      expect(varietiesWithPlantLinks.size).toBeGreaterThanOrEqual(4);
    });
  });
});
