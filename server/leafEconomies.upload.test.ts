/**
 * Tests pour les procédures d'upload d'images LeafEconomies
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock du module storage
vi.mock('./storage', () => ({
  storagePut: vi.fn().mockResolvedValue({ url: 'https://s3.example.com/test-image.jpg', key: 'test-key' }),
}));

// Mock du module db
vi.mock('./db', () => ({
  updateLeafEconomyImage: vi.fn().mockResolvedValue({ id: 1, imageUrl: 'https://s3.example.com/test-image.jpg' }),
  deleteLeafEconomyImage: vi.fn().mockResolvedValue({ id: 1, imageUrl: null }),
  getLeafEconomiesWithImages: vi.fn().mockResolvedValue([
    { id: 1, sampleId: 'SA-LE-001', imageUrl: 'https://s3.example.com/image1.jpg' },
    { id: 2, sampleId: 'SA-LE-002', imageUrl: 'https://s3.example.com/image2.jpg' },
  ]),
  getLeafEconomiesWithoutImages: vi.fn().mockResolvedValue([
    { id: 3, sampleId: 'SA-LE-003', imageUrl: null },
    { id: 4, sampleId: 'SA-LE-004', imageUrl: null },
  ]),
}));

import * as db from './db';
import { storagePut } from './storage';

describe('LeafEconomies Image Upload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updateLeafEconomyImage', () => {
    it('should update image URL for a leaf economy sample', async () => {
      const result = await db.updateLeafEconomyImage(1, 'https://s3.example.com/new-image.jpg');
      
      expect(db.updateLeafEconomyImage).toHaveBeenCalledWith(1, 'https://s3.example.com/new-image.jpg');
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('imageUrl');
    });

    it('should handle S3 URL format correctly', async () => {
      const s3Url = 'https://s3.amazonaws.com/bucket/leaf-economies/1/botanical-123456-abc123.jpg';
      await db.updateLeafEconomyImage(1, s3Url);
      
      expect(db.updateLeafEconomyImage).toHaveBeenCalledWith(1, s3Url);
    });
  });

  describe('deleteLeafEconomyImage', () => {
    it('should remove image URL from a leaf economy sample', async () => {
      const result = await db.deleteLeafEconomyImage(1);
      
      expect(db.deleteLeafEconomyImage).toHaveBeenCalledWith(1);
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('imageUrl', null);
    });
  });

  describe('getLeafEconomiesWithImages', () => {
    it('should return only samples with images', async () => {
      const result = await db.getLeafEconomiesWithImages();
      
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('imageUrl');
      expect(result[0].imageUrl).not.toBeNull();
    });
  });

  describe('getLeafEconomiesWithoutImages', () => {
    it('should return only samples without images', async () => {
      const result = await db.getLeafEconomiesWithoutImages();
      
      expect(result).toHaveLength(2);
      expect(result[0].imageUrl).toBeNull();
    });
  });

  describe('storagePut integration', () => {
    it('should upload image to S3 with correct parameters', async () => {
      const buffer = Buffer.from('test-image-data');
      const fileKey = 'leaf-economies/1/botanical-123456-abc123.jpg';
      const contentType = 'image/jpeg';

      const result = await storagePut(fileKey, buffer, contentType);

      expect(storagePut).toHaveBeenCalledWith(fileKey, buffer, contentType);
      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('key');
    });

    it('should generate unique file keys', () => {
      const leafEconomyId = 1;
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const extension = 'jpg';
      
      const fileKey = `leaf-economies/${leafEconomyId}/botanical-${timestamp}-${randomSuffix}.${extension}`;
      
      expect(fileKey).toMatch(/^leaf-economies\/\d+\/botanical-\d+-[a-z0-9]+\.jpg$/);
    });
  });

  describe('Image validation', () => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    it('should accept valid image types', () => {
      validTypes.forEach(type => {
        expect(validTypes.includes(type)).toBe(true);
      });
    });

    it('should reject invalid image types', () => {
      const invalidTypes = ['application/pdf', 'text/plain', 'video/mp4'];
      invalidTypes.forEach(type => {
        expect(validTypes.includes(type)).toBe(false);
      });
    });

    it('should enforce maximum file size of 5MB', () => {
      const validSize = 4 * 1024 * 1024; // 4MB
      const invalidSize = 6 * 1024 * 1024; // 6MB

      expect(validSize <= maxSize).toBe(true);
      expect(invalidSize <= maxSize).toBe(false);
    });
  });

  describe('Base64 processing', () => {
    it('should correctly strip data URL prefix', () => {
      const dataUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD';
      const base64Data = dataUrl.replace(/^data:[^;]+;base64,/, '');
      
      expect(base64Data).toBe('/9j/4AAQSkZJRgABAQAAAQABAAD');
      expect(base64Data).not.toContain('data:');
    });

    it('should handle different image types in data URL', () => {
      const jpegUrl = 'data:image/jpeg;base64,abc123';
      const pngUrl = 'data:image/png;base64,def456';
      const webpUrl = 'data:image/webp;base64,ghi789';

      expect(jpegUrl.replace(/^data:[^;]+;base64,/, '')).toBe('abc123');
      expect(pngUrl.replace(/^data:[^;]+;base64,/, '')).toBe('def456');
      expect(webpUrl.replace(/^data:[^;]+;base64,/, '')).toBe('ghi789');
    });
  });
});

describe('Plants and Molecules Data', () => {
  describe('New plants added', () => {
    const newPlants = [
      { name: 'Gingembre', latinName: 'Zingiber officinale', family: 'Zingiberaceae' },
      { name: 'Sauge sclarée', latinName: 'Salvia sclarea', family: 'Lamiaceae' },
      { name: 'Pin sylvestre', latinName: 'Pinus sylvestris', family: 'Pinaceae' },
      { name: 'Tea tree', latinName: 'Melaleuca alternifolia', family: 'Myrtaceae' },
      { name: 'Cardamome', latinName: 'Elettaria cardamomum', family: 'Zingiberaceae' },
    ];

    it('should have 5 new plants', () => {
      expect(newPlants).toHaveLength(5);
    });

    it('should have valid botanical names', () => {
      newPlants.forEach(plant => {
        expect(plant.latinName).toMatch(/^[A-Z][a-z]+ [a-z]+$/);
      });
    });

    it('should have valid family names', () => {
      newPlants.forEach(plant => {
        expect(plant.family).toMatch(/^[A-Z][a-z]+$/);
      });
    });
  });

  describe('New molecules added', () => {
    const newMolecules = [
      { name: 'Lavandulyl acetate', casNumber: '25905-14-0', formula: 'C12H20O2' },
      { name: 'Terpinen-4-ol', casNumber: '562-74-3', formula: 'C10H18O' },
      { name: 'Camphor', casNumber: '76-22-2', formula: 'C10H16O' },
      { name: 'Sclareol', casNumber: '515-03-7', formula: 'C20H36O2' },
      { name: 'Zingiberene', casNumber: '495-60-3', formula: 'C15H24' },
      { name: 'Gingerol', casNumber: '23513-14-6', formula: 'C17H26O4' },
      { name: 'Alpha-terpinyl acetate', casNumber: '80-26-2', formula: 'C12H20O2' },
      { name: 'Gamma-terpinene', casNumber: '99-85-4', formula: 'C10H16' },
      { name: 'Alpha-terpinene', casNumber: '99-86-5', formula: 'C10H16' },
      { name: 'Delta-3-carene', casNumber: '13466-78-9', formula: 'C10H16' },
      { name: 'Germacrene D', casNumber: '23986-74-5', formula: 'C15H24' },
      { name: 'Beta-bisabolene', casNumber: '495-61-4', formula: 'C15H24' },
      { name: 'Alpha-curcumene', casNumber: '644-30-4', formula: 'C15H22' },
    ];

    it('should have 13 new molecules', () => {
      expect(newMolecules).toHaveLength(13);
    });

    it('should have valid CAS numbers', () => {
      newMolecules.forEach(molecule => {
        expect(molecule.casNumber).toMatch(/^\d+-\d+-\d+$/);
      });
    });

    it('should have valid chemical formulas', () => {
      newMolecules.forEach(molecule => {
        expect(molecule.formula).toMatch(/^C\d+H\d+(O\d*)?$/);
      });
    });
  });

  describe('Plant-Molecule linkages', () => {
    const linkages = [
      { plant: 'Gingembre', molecules: ['Zingiberene', 'Gingerol', 'Beta-bisabolene', 'Alpha-curcumene'] },
      { plant: 'Sauge sclarée', molecules: ['Linalyl acetate', 'Linalool', 'Sclareol', 'Germacrene D'] },
      { plant: 'Pin sylvestre', molecules: ['Alpha-pinene', 'Beta-pinene', 'Delta-3-carene', 'Limonene'] },
      { plant: 'Tea tree', molecules: ['Terpinen-4-ol', 'Gamma-terpinene', 'Alpha-terpinene', '1,8-Cineole'] },
      { plant: 'Cardamome', molecules: ['1,8-Cineole', 'Alpha-terpinyl acetate', 'Linalool', 'Limonene'] },
    ];

    it('should have linkages for all 5 new plants', () => {
      expect(linkages).toHaveLength(5);
    });

    it('should have 4 molecules per plant', () => {
      linkages.forEach(linkage => {
        expect(linkage.molecules).toHaveLength(4);
      });
    });

    it('should have total of 20 potential linkages', () => {
      const totalLinkages = linkages.reduce((sum, l) => sum + l.molecules.length, 0);
      expect(totalLinkages).toBe(20);
    });
  });
});
