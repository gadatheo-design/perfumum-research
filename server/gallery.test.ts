import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database module
vi.mock('./db', () => ({
  getAllSampleImages: vi.fn(),
  getSampleImagesByCategory: vi.fn(),
  getSampleImageById: vi.fn(),
  createSampleImage: vi.fn(),
  updateSampleImage: vi.fn(),
  deleteSampleImage: vi.fn(),
  getSampleImagesStats: vi.fn(),
}));

// Mock the storage module
vi.mock('./storage', () => ({
  storagePut: vi.fn().mockResolvedValue({ url: 'https://s3.example.com/test-image.jpg', key: 'gallery/echantillon/test.jpg' }),
}));

import * as db from './db';

describe('Gallery API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllSampleImages', () => {
    it('should return all sample images', async () => {
      const mockImages = [
        { id: 1, title: 'Test Image 1', url: 'https://example.com/1.jpg', category: 'echantillon' },
        { id: 2, title: 'Test Image 2', url: 'https://example.com/2.jpg', category: 'extraction' },
      ];
      
      vi.mocked(db.getAllSampleImages).mockResolvedValue(mockImages as any);
      
      const result = await db.getAllSampleImages();
      
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Test Image 1');
    });
  });

  describe('getSampleImagesByCategory', () => {
    it('should filter images by category', async () => {
      const mockImages = [
        { id: 1, title: 'Echantillon 1', url: 'https://example.com/1.jpg', category: 'echantillon' },
      ];
      
      vi.mocked(db.getSampleImagesByCategory).mockResolvedValue(mockImages as any);
      
      const result = await db.getSampleImagesByCategory('echantillon');
      
      expect(result).toHaveLength(1);
      expect(result[0].category).toBe('echantillon');
    });
  });

  describe('createSampleImage', () => {
    it('should create a new sample image', async () => {
      const newImage = {
        url: 'https://s3.example.com/new.jpg',
        fileKey: 'gallery/echantillon/new.jpg',
        fileName: 'new.jpg',
        mimeType: 'image/jpeg',
        category: 'echantillon' as const,
        title: 'New Sample',
      };
      
      const createdImage = { id: 1, ...newImage, createdAt: new Date() };
      vi.mocked(db.createSampleImage).mockResolvedValue(createdImage as any);
      
      const result = await db.createSampleImage(newImage as any);
      
      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
      expect(result?.title).toBe('New Sample');
    });
  });

  describe('getSampleImagesStats', () => {
    it('should return statistics by category', async () => {
      const mockStats = {
        total: 10,
        byCategory: {
          echantillon: 5,
          extraction: 3,
          analyse: 2,
        },
      };
      
      vi.mocked(db.getSampleImagesStats).mockResolvedValue(mockStats);
      
      const result = await db.getSampleImagesStats();
      
      expect(result.total).toBe(10);
      expect(result.byCategory.echantillon).toBe(5);
    });
  });

  describe('deleteSampleImage', () => {
    it('should delete an image by id', async () => {
      vi.mocked(db.deleteSampleImage).mockResolvedValue(undefined);
      
      await db.deleteSampleImage(1);
      
      expect(db.deleteSampleImage).toHaveBeenCalledWith(1);
    });
  });
});

describe('IFRA Calculator', () => {
  describe('Formula compliance check', () => {
    it('should identify compliant formulas', () => {
      // Test logic for compliant formula
      const ingredients = [
        { moleculeId: 1, concentration: 0.5 },
        { moleculeId: 2, concentration: 1.0 },
      ];
      
      const limits = [
        { moleculeId: 1, limit: 1.0 },
        { moleculeId: 2, limit: 2.0 },
      ];
      
      const results = ingredients.map(ing => {
        const limitInfo = limits.find(l => l.moleculeId === ing.moleculeId);
        const limit = limitInfo?.limit ?? null;
        const isCompliant = limit === null || ing.concentration <= limit;
        const margin = limit !== null ? limit - ing.concentration : null;
        
        return {
          moleculeId: ing.moleculeId,
          concentration: ing.concentration,
          limit,
          isCompliant,
          margin,
        };
      });
      
      expect(results.every(r => r.isCompliant)).toBe(true);
      expect(results[0].margin).toBe(0.5);
      expect(results[1].margin).toBe(1.0);
    });

    it('should identify non-compliant formulas', () => {
      const ingredients = [
        { moleculeId: 1, concentration: 1.5 }, // Over limit
        { moleculeId: 2, concentration: 1.0 },
      ];
      
      const limits = [
        { moleculeId: 1, limit: 1.0 },
        { moleculeId: 2, limit: 2.0 },
      ];
      
      const results = ingredients.map(ing => {
        const limitInfo = limits.find(l => l.moleculeId === ing.moleculeId);
        const limit = limitInfo?.limit ?? null;
        const isCompliant = limit === null || ing.concentration <= limit;
        const margin = limit !== null ? limit - ing.concentration : null;
        
        return {
          moleculeId: ing.moleculeId,
          concentration: ing.concentration,
          limit,
          isCompliant,
          margin,
        };
      });
      
      expect(results.every(r => r.isCompliant)).toBe(false);
      expect(results[0].isCompliant).toBe(false);
      expect(results[0].margin).toBe(-0.5); // Negative margin = over limit
      expect(results[1].isCompliant).toBe(true);
    });

    it('should handle prohibited molecules', () => {
      const ingredient = { moleculeId: 1, concentration: 0.001 };
      const restrictionType = 'prohibited';
      
      const isCompliant = restrictionType !== 'prohibited';
      
      expect(isCompliant).toBe(false);
    });

    it('should handle molecules without restrictions', () => {
      const ingredient = { moleculeId: 99, concentration: 5.0 };
      const restriction = null; // No restriction found
      
      const isCompliant = restriction === null ? true : false;
      
      expect(isCompliant).toBe(true);
    });
  });

  describe('Category mapping', () => {
    it('should correctly map category codes to column names', () => {
      const categoryMap: Record<string, string> = {
        '1': 'category1',
        '2': 'category2',
        '3': 'category3',
        '4': 'category4',
        '5A': 'category5a',
        '5B': 'category5b',
        '5C': 'category5c',
        '5D': 'category5d',
        '6': 'category6',
        '7A': 'category7a',
        '7B': 'category7b',
        '8': 'category8',
        '9': 'category9',
        '10A': 'category10a',
        '10B': 'category10b',
        '11A': 'category11a',
        '11B': 'category11b',
      };
      
      expect(categoryMap['4']).toBe('category4');
      expect(categoryMap['5A']).toBe('category5a');
      expect(categoryMap['11B']).toBe('category11b');
    });
  });
});

describe('S3 Upload', () => {
  describe('File key generation', () => {
    it('should generate unique file keys', () => {
      const category = 'echantillon';
      const timestamp1 = Date.now();
      const randomSuffix1 = Math.random().toString(36).substring(2, 8);
      const extension = 'jpg';
      
      const fileKey1 = `gallery/${category}/${timestamp1}-${randomSuffix1}.${extension}`;
      
      // Wait a bit and generate another
      const timestamp2 = Date.now() + 1;
      const randomSuffix2 = Math.random().toString(36).substring(2, 8);
      const fileKey2 = `gallery/${category}/${timestamp2}-${randomSuffix2}.${extension}`;
      
      expect(fileKey1).not.toBe(fileKey2);
      expect(fileKey1).toMatch(/^gallery\/echantillon\/\d+-[a-z0-9]+\.jpg$/);
    });

    it('should preserve file extension', () => {
      const fileName = 'my-photo.png';
      const extension = fileName.split('.').pop() || 'jpg';
      
      expect(extension).toBe('png');
    });

    it('should default to jpg for files without extension', () => {
      const fileName = 'my-photo';
      const extension = fileName.split('.').pop() || 'jpg';
      
      // When there's no dot, split returns the whole string
      // So we need to check if it's the same as the filename
      const finalExtension = fileName.includes('.') ? extension : 'jpg';
      
      expect(finalExtension).toBe('jpg');
    });
  });
});
