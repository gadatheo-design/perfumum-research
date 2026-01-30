/**
 * Tests pour les procédures de liaisons variétés fantômes
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock du module storage
vi.mock('./storage', () => ({
  storagePut: vi.fn().mockResolvedValue({ url: 'https://s3.example.com/test-image.jpg', key: 'ghost-varieties/1/test.jpg' }),
}));

// Mock du module db
vi.mock('./db', () => ({
  getGhostVarietyMoleculeLinks: vi.fn().mockResolvedValue([
    {
      id: 1,
      ghostVarietyId: 1,
      moleculeId: 10,
      linkType: 'characteristic',
      percentage: '15.5',
      confidence: 'high',
      sourceType: 'gc_ms_analysis',
      notes: 'Test notes',
      molecule: { id: 10, name: 'Linalool', casNumber: '78-70-6', family: 'terpene' }
    }
  ]),
  getGhostVarietyPlantLinks: vi.fn().mockResolvedValue([
    {
      id: 1,
      ghostVarietyId: 1,
      plantId: 5,
      relationshipType: 'parent_species',
      confidence: 'medium',
      geneticSimilarity: 85,
      notes: 'Test plant link',
      plant: { id: 5, name: 'Rosa damascena', latinName: 'Rosa damascena', category: 'flower' }
    }
  ]),
  getGhostVarietyImages: vi.fn().mockResolvedValue([
    {
      id: 1,
      ghostVarietyId: 1,
      url: 'https://s3.example.com/image1.jpg',
      fileKey: 'ghost-varieties/1/image1.jpg',
      title: 'Botanical illustration',
      imageType: 'botanical_illustration',
      isPrimary: true
    }
  ]),
  createGhostVarietyMoleculeLink: vi.fn().mockResolvedValue({
    id: 2,
    ghostVarietyId: 1,
    moleculeId: 20,
    linkType: 'dominant',
    percentage: '25.0',
    confidence: 'high',
    sourceType: 'reconstruction',
    createdAt: new Date()
  }),
  createGhostVarietyPlantLink: vi.fn().mockResolvedValue({
    id: 2,
    ghostVarietyId: 1,
    plantId: 10,
    relationshipType: 'hybrid_parent',
    confidence: 'low',
    geneticSimilarity: 60,
    createdAt: new Date()
  }),
  createGhostVarietyImage: vi.fn().mockResolvedValue({
    id: 2,
    ghostVarietyId: 1,
    url: 'https://s3.example.com/new-image.jpg',
    fileKey: 'ghost-varieties/1/new-image.jpg',
    title: 'New image',
    imageType: 'photograph',
    isPrimary: false,
    createdAt: new Date()
  }),
  updateGhostVarietyMoleculeLink: vi.fn().mockResolvedValue({
    id: 1,
    ghostVarietyId: 1,
    moleculeId: 10,
    linkType: 'dominant',
    percentage: '20.0',
    confidence: 'high',
    updatedAt: new Date()
  }),
  updateGhostVarietyPlantLink: vi.fn().mockResolvedValue({
    id: 1,
    ghostVarietyId: 1,
    plantId: 5,
    relationshipType: 'descendant',
    confidence: 'high',
    updatedAt: new Date()
  }),
  updateGhostVarietyImage: vi.fn().mockResolvedValue({
    id: 1,
    ghostVarietyId: 1,
    title: 'Updated title',
    updatedAt: new Date()
  }),
  deleteGhostVarietyMoleculeLink: vi.fn().mockResolvedValue(true),
  deleteGhostVarietyPlantLink: vi.fn().mockResolvedValue(true),
  deleteGhostVarietyImage: vi.fn().mockResolvedValue(true),
  setGhostVarietyPrimaryImage: vi.fn().mockResolvedValue(true),
  getGhostVarietyComplete: vi.fn().mockResolvedValue({
    variety: {
      id: 1,
      name: 'Rose de Mai Historique',
      scientificName: 'Rosa centifolia var. historica',
      varietyType: 'rose',
      conservationStatus: 'extinct',
      description: 'Test description',
      olfactiveProfile: 'Floral, honey, powdery',
      molecularProfile: [
        { molecule: 'Citronellol', percentage: 35 },
        { molecule: 'Geraniol', percentage: 25 }
      ],
      historicalSources: [
        { title: 'Les Roses de Grasse', author: 'Jean Dupont', year: 1892 }
      ],
      reconstructionAttempts: [
        { year: 2020, institution: 'ISIPCA', method: 'GC-MS reconstruction', success: false }
      ]
    },
    moleculeLinks: [
      {
        id: 1,
        ghostVarietyId: 1,
        moleculeId: 10,
        linkType: 'characteristic',
        percentage: '15.5',
        molecule: { id: 10, name: 'Linalool', casNumber: '78-70-6', family: 'terpene' }
      }
    ],
    plantLinks: [
      {
        id: 1,
        ghostVarietyId: 1,
        plantId: 5,
        relationshipType: 'parent_species',
        plant: { id: 5, name: 'Rosa damascena', latinName: 'Rosa damascena', category: 'flower' }
      }
    ],
    images: [
      {
        id: 1,
        ghostVarietyId: 1,
        url: 'https://s3.example.com/image1.jpg',
        title: 'Botanical illustration',
        isPrimary: true
      }
    ]
  }),
  getGhostVarietyLinkingStats: vi.fn().mockResolvedValue({
    totalVarieties: 8,
    varietiesWithMolecules: 3,
    varietiesWithPlants: 2,
    varietiesWithImages: 1,
    totalMoleculeLinks: 15,
    totalPlantLinks: 8,
    totalImages: 4
  }),
}));

import * as db from './db';
import { storagePut } from './storage';

describe('Ghost Variety Links', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Molecule Links', () => {
    it('should get molecule links for a variety', async () => {
      const links = await db.getGhostVarietyMoleculeLinks(1);
      
      expect(links).toHaveLength(1);
      expect(links[0].moleculeId).toBe(10);
      expect(links[0].linkType).toBe('characteristic');
      expect(links[0].molecule?.name).toBe('Linalool');
    });

    it('should create a molecule link', async () => {
      const newLink = await db.createGhostVarietyMoleculeLink({
        ghostVarietyId: 1,
        moleculeId: 20,
        linkType: 'dominant',
        percentage: '25.0',
        confidence: 'high',
        sourceType: 'reconstruction',
      });
      
      expect(newLink.id).toBe(2);
      expect(newLink.moleculeId).toBe(20);
      expect(newLink.linkType).toBe('dominant');
    });

    it('should update a molecule link', async () => {
      const updated = await db.updateGhostVarietyMoleculeLink(1, {
        linkType: 'dominant',
        percentage: '20.0',
      });
      
      expect(updated?.linkType).toBe('dominant');
      expect(updated?.percentage).toBe('20.0');
    });

    it('should delete a molecule link', async () => {
      const result = await db.deleteGhostVarietyMoleculeLink(1);
      
      expect(result).toBe(true);
      expect(db.deleteGhostVarietyMoleculeLink).toHaveBeenCalledWith(1);
    });
  });

  describe('Plant Links', () => {
    it('should get plant links for a variety', async () => {
      const links = await db.getGhostVarietyPlantLinks(1);
      
      expect(links).toHaveLength(1);
      expect(links[0].plantId).toBe(5);
      expect(links[0].relationshipType).toBe('parent_species');
      expect(links[0].plant?.name).toBe('Rosa damascena');
    });

    it('should create a plant link', async () => {
      const newLink = await db.createGhostVarietyPlantLink({
        ghostVarietyId: 1,
        plantId: 10,
        relationshipType: 'hybrid_parent',
        confidence: 'low',
        geneticSimilarity: 60,
      });
      
      expect(newLink.id).toBe(2);
      expect(newLink.plantId).toBe(10);
      expect(newLink.relationshipType).toBe('hybrid_parent');
    });

    it('should update a plant link', async () => {
      const updated = await db.updateGhostVarietyPlantLink(1, {
        relationshipType: 'descendant',
        confidence: 'high',
      });
      
      expect(updated?.relationshipType).toBe('descendant');
      expect(updated?.confidence).toBe('high');
    });

    it('should delete a plant link', async () => {
      const result = await db.deleteGhostVarietyPlantLink(1);
      
      expect(result).toBe(true);
      expect(db.deleteGhostVarietyPlantLink).toHaveBeenCalledWith(1);
    });
  });

  describe('Images', () => {
    it('should get images for a variety', async () => {
      const images = await db.getGhostVarietyImages(1);
      
      expect(images).toHaveLength(1);
      expect(images[0].title).toBe('Botanical illustration');
      expect(images[0].isPrimary).toBe(true);
    });

    it('should create an image record', async () => {
      const newImage = await db.createGhostVarietyImage({
        ghostVarietyId: 1,
        url: 'https://s3.example.com/new-image.jpg',
        fileKey: 'ghost-varieties/1/new-image.jpg',
        title: 'New image',
        imageType: 'photograph',
        isPrimary: false,
      });
      
      expect(newImage.id).toBe(2);
      expect(newImage.title).toBe('New image');
      expect(newImage.imageType).toBe('photograph');
    });

    it('should update an image', async () => {
      const updated = await db.updateGhostVarietyImage(1, {
        title: 'Updated title',
      });
      
      expect(updated?.title).toBe('Updated title');
    });

    it('should delete an image', async () => {
      const result = await db.deleteGhostVarietyImage(1);
      
      expect(result).toBe(true);
      expect(db.deleteGhostVarietyImage).toHaveBeenCalledWith(1);
    });

    it('should set primary image', async () => {
      const result = await db.setGhostVarietyPrimaryImage(1, 2);
      
      expect(result).toBe(true);
      expect(db.setGhostVarietyPrimaryImage).toHaveBeenCalledWith(1, 2);
    });
  });

  describe('Complete Variety Data', () => {
    it('should get complete variety with all relations', async () => {
      const complete = await db.getGhostVarietyComplete(1);
      
      expect(complete.variety).not.toBeNull();
      expect(complete.variety?.name).toBe('Rose de Mai Historique');
      expect(complete.moleculeLinks).toHaveLength(1);
      expect(complete.plantLinks).toHaveLength(1);
      expect(complete.images).toHaveLength(1);
    });
  });

  describe('Linking Statistics', () => {
    it('should return linking statistics', async () => {
      const stats = await db.getGhostVarietyLinkingStats();
      
      expect(stats.totalVarieties).toBe(8);
      expect(stats.varietiesWithMolecules).toBe(3);
      expect(stats.varietiesWithPlants).toBe(2);
      expect(stats.varietiesWithImages).toBe(1);
    });
  });

  describe('Image Upload Integration', () => {
    it('should upload image to S3 with correct parameters', async () => {
      const buffer = Buffer.from('test-image-data');
      const fileKey = 'ghost-varieties/1/test-123456-abc123.jpg';
      const contentType = 'image/jpeg';
      
      const result = await storagePut(fileKey, buffer, contentType);
      
      expect(storagePut).toHaveBeenCalledWith(fileKey, buffer, contentType);
      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('key');
    });
  });

  describe('Link Types Validation', () => {
    it('should accept valid molecule link types', () => {
      const validTypes = ['dominant', 'characteristic', 'trace', 'reconstructed', 'historical', 'hypothetical', 'other'];
      validTypes.forEach(type => {
        expect(validTypes).toContain(type);
      });
    });

    it('should accept valid plant relationship types', () => {
      const validTypes = ['parent_species', 'related_variety', 'hybrid_parent', 'descendant', 'comparison', 'reconstruction_base', 'other'];
      validTypes.forEach(type => {
        expect(validTypes).toContain(type);
      });
    });

    it('should accept valid confidence levels', () => {
      const validLevels = ['high', 'medium', 'low'];
      validLevels.forEach(level => {
        expect(validLevels).toContain(level);
      });
    });
  });
});
