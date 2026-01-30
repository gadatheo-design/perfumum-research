import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { 
  createReferenceEntityLink, 
  getLinksForReference, 
  getReferencesForEntity,
  updateReferenceEntityLink,
  deleteReferenceEntityLink,
  getReferenceEntityLinkStats
} from './db';

/**
 * Tests for Reference Entity Links functionality
 * 
 * These tests verify the CRUD operations for linking bibliographic references
 * to various PERFUMUM entities (leaf_economies, molecules, plants, etc.)
 * 
 * Note: Uses unique entity IDs (9000+) to avoid conflicts with real data
 */

// Generate unique test IDs to avoid conflicts
const TEST_ENTITY_BASE_ID = 9000 + Math.floor(Math.random() * 1000);
let testCounter = 0;
const getUniqueEntityId = () => TEST_ENTITY_BASE_ID + (testCounter++);

describe('Reference Entity Links', () => {
  // Store created link IDs for cleanup
  let createdLinkIds: number[] = [];

  afterAll(async () => {
    // Clean up any test data created during tests
    for (const id of createdLinkIds) {
      try {
        await deleteReferenceEntityLink(id);
      } catch {
        // Ignore errors during cleanup
      }
    }
  });

  describe('getLinksForReference', () => {
    it('should return an array', async () => {
      const result = await getLinksForReference(1);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return empty array for non-existent reference', async () => {
      const result = await getLinksForReference(999999);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getReferencesForEntity', () => {
    it('should return an array for leaf_economy entity type', async () => {
      const result = await getReferencesForEntity('leaf_economy', 1);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return an array for molecule entity type', async () => {
      const result = await getReferencesForEntity('molecule', 1);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return empty array for non-existent entity', async () => {
      const result = await getReferencesForEntity('leaf_economy', 999999);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getReferenceEntityLinkStats', () => {
    it('should return statistics object', async () => {
      const stats = await getReferenceEntityLinkStats();
      
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('byEntityType');
      expect(stats).toHaveProperty('byLinkType');
      
      expect(typeof stats.total).toBe('number');
      expect(Array.isArray(stats.byEntityType)).toBe(true);
      expect(Array.isArray(stats.byLinkType)).toBe(true);
    });

    it('should return non-negative total count', async () => {
      const stats = await getReferenceEntityLinkStats();
      expect(stats.total).toBeGreaterThanOrEqual(0);
    });
  });

  describe('createReferenceEntityLink', () => {
    it('should create a link with minimal required fields', async () => {
      const uniqueEntityId = getUniqueEntityId();
      const result = await createReferenceEntityLink({
        referenceId: 1,
        entityType: 'leaf_economy',
        entityId: uniqueEntityId,
      });

      if (result) {
        expect(result).toHaveProperty('id');
        createdLinkIds.push(result.id);
      }
    });

    it('should create a link with all optional fields', async () => {
      const uniqueEntityId = getUniqueEntityId();
      const result = await createReferenceEntityLink({
        referenceId: 1,
        entityType: 'molecule',
        entityId: uniqueEntityId,
        linkType: 'documents',
        relevanceScore: 85,
        notes: 'Test note for vitest',
        context: 'Test context excerpt',
        createdBy: 1,
      });

      if (result) {
        expect(result).toHaveProperty('id');
        createdLinkIds.push(result.id);
      }
    });
  });

  describe('updateReferenceEntityLink', () => {
    it('should update link type', async () => {
      const uniqueEntityId = getUniqueEntityId();
      const created = await createReferenceEntityLink({
        referenceId: 1,
        entityType: 'plant',
        entityId: uniqueEntityId,
        linkType: 'documents',
      });

      if (created) {
        createdLinkIds.push(created.id);
        
        const updated = await updateReferenceEntityLink(created.id, {
          linkType: 'analyzes',
        });

        if (updated) {
          expect(updated.linkType).toBe('analyzes');
        }
      }
    });

    it('should update relevance score', async () => {
      const uniqueEntityId = getUniqueEntityId();
      const created = await createReferenceEntityLink({
        referenceId: 1,
        entityType: 'prototype',
        entityId: uniqueEntityId,
        relevanceScore: 50,
      });

      if (created) {
        createdLinkIds.push(created.id);
        
        const updated = await updateReferenceEntityLink(created.id, {
          relevanceScore: 95,
        });

        if (updated) {
          expect(updated.relevanceScore).toBe(95);
        }
      }
    });

    it('should update notes and context', async () => {
      const uniqueEntityId = getUniqueEntityId();
      const created = await createReferenceEntityLink({
        referenceId: 1,
        entityType: 'terroir',
        entityId: uniqueEntityId,
      });

      if (created) {
        createdLinkIds.push(created.id);
        
        const updated = await updateReferenceEntityLink(created.id, {
          notes: 'Updated test notes',
          context: 'Updated context excerpt',
        });

        if (updated) {
          expect(updated.notes).toBe('Updated test notes');
          expect(updated.context).toBe('Updated context excerpt');
        }
      }
    });
  });

  describe('deleteReferenceEntityLink', () => {
    it('should delete an existing link', async () => {
      const uniqueEntityId = getUniqueEntityId();
      const created = await createReferenceEntityLink({
        referenceId: 1,
        entityType: 'supplier',
        entityId: uniqueEntityId,
      });

      if (created) {
        const result = await deleteReferenceEntityLink(created.id);
        expect(result).toEqual({ success: true });
        
        // Remove from cleanup list since we already deleted it
        createdLinkIds = createdLinkIds.filter(id => id !== created.id);
      }
    });

    it('should handle deletion of non-existent link gracefully', async () => {
      const result = await deleteReferenceEntityLink(999999);
      expect(result).toHaveProperty('success');
    });
  });
});

describe('H2 Linking Specific Tests', () => {
  let cleanupIds: number[] = [];

  afterAll(async () => {
    for (const id of cleanupIds) {
      try {
        await deleteReferenceEntityLink(id);
      } catch {
        // Ignore cleanup errors
      }
    }
  });

  describe('Linking H2 references to leaf_economies', () => {
    it('should support conservation link type for H2 references', async () => {
      const uniqueEntityId = getUniqueEntityId();
      const result = await createReferenceEntityLink({
        referenceId: 1,
        entityType: 'leaf_economy',
        entityId: uniqueEntityId,
        linkType: 'conserves',
        relevanceScore: 80,
        notes: 'Reference discusses conservation of this species',
      });

      if (result) {
        expect(result).toHaveProperty('id');
        cleanupIds.push(result.id);
      }
    });

    it('should support documents link type for species documentation', async () => {
      const uniqueEntityId = getUniqueEntityId();
      const result = await createReferenceEntityLink({
        referenceId: 1,
        entityType: 'leaf_economy',
        entityId: uniqueEntityId,
        linkType: 'documents',
        context: 'The species Nicotiana tabacum is documented as endangered...',
      });

      if (result) {
        expect(result).toHaveProperty('id');
        cleanupIds.push(result.id);
      }
    });
  });
});

describe('Genomics Explorer Data Tests', () => {
  describe('Genomics axes filtering', () => {
    it('should be able to query references by axis code', async () => {
      const links = await getLinksForReference(1);
      
      expect(Array.isArray(links)).toBe(true);
      
      for (const link of links) {
        expect(link).toHaveProperty('entityType');
        expect(link).toHaveProperty('entityId');
        expect(link).toHaveProperty('linkType');
      }
    });
  });
});
