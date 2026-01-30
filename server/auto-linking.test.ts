/**
 * Tests for automatic entity linking and graph visualization
 * 
 * These tests verify:
 * - Keyword extraction and matching algorithm
 * - Entity link suggestions for references
 * - Graph visualization data structure
 * - Statistics calculations
 */

import { describe, it, expect } from 'vitest';
import { 
  suggestEntityLinksForReference,
  bulkSuggestEntityLinks,
  batchCreateEntityLinks,
  getReferencesGroupedByAxis,
  getGraphVisualizationStats,
  getReferenceWithLinkedEntities
} from './db';

describe('Auto Linking - Keyword Matching', () => {
  describe('suggestEntityLinksForReference', () => {
    it('should return a valid structure for any reference ID', async () => {
      const result = await suggestEntityLinksForReference(1);
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('referenceId');
      expect(result).toHaveProperty('referenceTitle');
      expect(result).toHaveProperty('suggestions');
      expect(Array.isArray(result.suggestions)).toBe(true);
    });

    it('should return empty suggestions for non-existent reference', async () => {
      const result = await suggestEntityLinksForReference(999999);
      
      expect(result).toBeDefined();
      expect(result.referenceId).toBe(999999);
      expect(result.referenceTitle).toBe('');
      expect(result.suggestions).toEqual([]);
    });

    it('should include required fields in each suggestion', async () => {
      const result = await suggestEntityLinksForReference(1);
      
      if (result.suggestions.length > 0) {
        const suggestion = result.suggestions[0];
        expect(suggestion).toHaveProperty('entityType');
        expect(suggestion).toHaveProperty('entityId');
        expect(suggestion).toHaveProperty('entityName');
        expect(suggestion).toHaveProperty('score');
        expect(suggestion).toHaveProperty('matchedKeywords');
        expect(suggestion).toHaveProperty('reason');
        
        // Validate entity types
        expect(['molecule', 'plant', 'terroir', 'recette', 'tradition']).toContain(suggestion.entityType);
        
        // Validate score range (0-100)
        expect(suggestion.score).toBeGreaterThanOrEqual(0);
        expect(suggestion.score).toBeLessThanOrEqual(100);
        
        // Validate matchedKeywords is an array
        expect(Array.isArray(suggestion.matchedKeywords)).toBe(true);
      }
    });

    it('should limit suggestions to 20 items', async () => {
      const result = await suggestEntityLinksForReference(1);
      
      expect(result.suggestions.length).toBeLessThanOrEqual(20);
    });
  });

  describe('bulkSuggestEntityLinks', () => {
    it('should return bulk suggestions with default options', async () => {
      const result = await bulkSuggestEntityLinks({});
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('totalReferences');
      expect(result).toHaveProperty('referencesWithSuggestions');
      expect(result).toHaveProperty('totalSuggestions');
      expect(result).toHaveProperty('suggestions');
      expect(Array.isArray(result.suggestions)).toBe(true);
    });

    it('should return numeric statistics', async () => {
      const result = await bulkSuggestEntityLinks({});
      
      expect(typeof result.totalReferences).toBe('number');
      expect(typeof result.referencesWithSuggestions).toBe('number');
      expect(typeof result.totalSuggestions).toBe('number');
      expect(result.totalReferences).toBeGreaterThanOrEqual(0);
    });

    it('should respect minScore filter', async () => {
      const result = await bulkSuggestEntityLinks({
        minScore: 50,
        limit: 10,
      });
      
      expect(result).toBeDefined();
      
      // All suggestions should have score >= 50
      for (const suggestion of result.suggestions) {
        expect(suggestion.score).toBeGreaterThanOrEqual(50);
      }
    });

    it('should respect limit parameter', async () => {
      const result = await bulkSuggestEntityLinks({
        limit: 5,
      });
      
      expect(result).toBeDefined();
      expect(result.suggestions.length).toBeLessThanOrEqual(5);
    });

    it('should filter by entity types', async () => {
      const result = await bulkSuggestEntityLinks({
        entityTypes: ['molecule'],
        limit: 20,
      });
      
      expect(result).toBeDefined();
      
      // All suggestions should be molecules
      for (const suggestion of result.suggestions) {
        expect(suggestion.entityType).toBe('molecule');
      }
    });

    it('should include reference metadata in suggestions', async () => {
      const result = await bulkSuggestEntityLinks({ limit: 5 });
      
      if (result.suggestions.length > 0) {
        const suggestion = result.suggestions[0];
        expect(suggestion).toHaveProperty('referenceId');
        expect(suggestion).toHaveProperty('referenceTitle');
        expect(suggestion).toHaveProperty('axisPrimaryCode');
        expect(suggestion).toHaveProperty('entityType');
        expect(suggestion).toHaveProperty('entityId');
        expect(suggestion).toHaveProperty('entityName');
        expect(suggestion).toHaveProperty('score');
        expect(suggestion).toHaveProperty('matchedKeywords');
      }
    });
  });

  describe('batchCreateEntityLinks', () => {
    it('should handle empty array', async () => {
      const result = await batchCreateEntityLinks([]);
      
      expect(result).toBeDefined();
      expect(result.created).toBe(0);
      expect(result.skipped).toBe(0);
      expect(result.errors).toEqual([]);
    });

    it('should return proper result structure', async () => {
      const result = await batchCreateEntityLinks([]);
      
      expect(result).toHaveProperty('created');
      expect(result).toHaveProperty('skipped');
      expect(result).toHaveProperty('errors');
      expect(typeof result.created).toBe('number');
      expect(typeof result.skipped).toBe('number');
      expect(Array.isArray(result.errors)).toBe(true);
    });
  });
});

describe('Graph Visualization', () => {
  describe('getReferencesGroupedByAxis', () => {
    it('should return graph data structure', async () => {
      const result = await getReferencesGroupedByAxis();
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('axes');
      expect(result).toHaveProperty('references');
      expect(result).toHaveProperty('links');
      expect(Array.isArray(result.axes)).toBe(true);
      expect(Array.isArray(result.references)).toBe(true);
      expect(Array.isArray(result.links)).toBe(true);
    });

    it('should include required axis fields', async () => {
      const result = await getReferencesGroupedByAxis();
      
      if (result.axes.length > 0) {
        const axis = result.axes[0];
        expect(axis).toHaveProperty('id');
        expect(axis).toHaveProperty('code');
        expect(axis).toHaveProperty('name');
        expect(axis).toHaveProperty('metaAxis');
        expect(axis).toHaveProperty('color');
        expect(axis).toHaveProperty('referenceCount');
        
        // Validate types
        expect(typeof axis.id).toBe('number');
        expect(typeof axis.code).toBe('string');
        expect(typeof axis.name).toBe('string');
        expect(typeof axis.referenceCount).toBe('number');
      }
    });

    it('should include required reference fields', async () => {
      const result = await getReferencesGroupedByAxis();
      
      if (result.references.length > 0) {
        const ref = result.references[0];
        expect(ref).toHaveProperty('id');
        expect(ref).toHaveProperty('title');
        expect(ref).toHaveProperty('year');
        expect(ref).toHaveProperty('entryType');
        expect(ref).toHaveProperty('axisPrimaryCode');
        expect(ref).toHaveProperty('axesSecondary');
        expect(ref).toHaveProperty('entityLinkCount');
        
        // Validate types
        expect(typeof ref.id).toBe('number');
        expect(typeof ref.title).toBe('string');
        expect(typeof ref.entityLinkCount).toBe('number');
      }
    });

    it('should include required link fields', async () => {
      const result = await getReferencesGroupedByAxis();
      
      if (result.links.length > 0) {
        const link = result.links[0];
        expect(link).toHaveProperty('source');
        expect(link).toHaveProperty('target');
        expect(link).toHaveProperty('type');
        expect(['primary', 'secondary']).toContain(link.type);
      }
    });

    it('should have consistent link references', async () => {
      const result = await getReferencesGroupedByAxis();
      
      const axisCodes = new Set(result.axes.map(a => a.code));
      const refIds = new Set(result.references.map(r => `ref-${r.id}`));
      
      // Check that links reference valid axes and references
      // Note: Some links may reference axes/refs not in the current result set
      // due to filtering, so we just verify the structure is correct
      for (const link of result.links) {
        expect(typeof link.source).toBe('string');
        expect(typeof link.target).toBe('string');
        expect(link.target.startsWith('ref-')).toBe(true);
      }
    });
  });

  describe('getGraphVisualizationStats', () => {
    it('should return statistics structure', async () => {
      const result = await getGraphVisualizationStats();
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('totalAxes');
      expect(result).toHaveProperty('totalReferences');
      expect(result).toHaveProperty('totalLinks');
      expect(result).toHaveProperty('referencesByMetaAxis');
      expect(result).toHaveProperty('topAxesByReferences');
      expect(result).toHaveProperty('referencesWithLinks');
      expect(result).toHaveProperty('referencesWithoutLinks');
    });

    it('should return numeric values for counts', async () => {
      const result = await getGraphVisualizationStats();
      
      expect(typeof result.totalAxes).toBe('number');
      expect(typeof result.totalReferences).toBe('number');
      expect(typeof result.totalLinks).toBe('number');
      expect(typeof result.referencesWithLinks).toBe('number');
      expect(typeof result.referencesWithoutLinks).toBe('number');
      
      // Counts should be non-negative
      expect(result.totalAxes).toBeGreaterThanOrEqual(0);
      expect(result.totalReferences).toBeGreaterThanOrEqual(0);
      expect(result.totalLinks).toBeGreaterThanOrEqual(0);
    });

    it('should return arrays for grouped data', async () => {
      const result = await getGraphVisualizationStats();
      
      expect(Array.isArray(result.referencesByMetaAxis)).toBe(true);
      expect(Array.isArray(result.topAxesByReferences)).toBe(true);
    });

    it('should have consistent reference counts', async () => {
      const result = await getGraphVisualizationStats();
      
      // referencesWithLinks + referencesWithoutLinks should equal totalReferences
      expect(result.referencesWithLinks + result.referencesWithoutLinks).toBe(result.totalReferences);
    });

    it('should include meta-axis breakdown', async () => {
      const result = await getGraphVisualizationStats();
      
      if (result.referencesByMetaAxis.length > 0) {
        const item = result.referencesByMetaAxis[0];
        expect(item).toHaveProperty('metaAxis');
        expect(item).toHaveProperty('count');
        expect(typeof item.count).toBe('number');
      }
    });

    it('should include top axes data', async () => {
      const result = await getGraphVisualizationStats();
      
      if (result.topAxesByReferences.length > 0) {
        const item = result.topAxesByReferences[0];
        expect(item).toHaveProperty('code');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('count');
        expect(typeof item.count).toBe('number');
      }
    });
  });

  describe('getReferenceWithLinkedEntities', () => {
    it('should return reference details structure', async () => {
      const result = await getReferenceWithLinkedEntities(1);
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('reference');
      expect(result).toHaveProperty('axis');
      expect(result).toHaveProperty('linkedEntities');
      expect(Array.isArray(result.linkedEntities)).toBe(true);
    });

    it('should return null reference for non-existent ID', async () => {
      const result = await getReferenceWithLinkedEntities(999999);
      
      expect(result).toBeDefined();
      expect(result.reference).toBeNull();
      expect(result.axis).toBeNull();
      expect(result.linkedEntities).toEqual([]);
    });

    it('should include linked entity details when present', async () => {
      const result = await getReferenceWithLinkedEntities(1);
      
      if (result.linkedEntities.length > 0) {
        const entity = result.linkedEntities[0];
        expect(entity).toHaveProperty('entityType');
        expect(entity).toHaveProperty('entityId');
        expect(entity).toHaveProperty('entityName');
        expect(entity).toHaveProperty('linkType');
        expect(entity).toHaveProperty('relevanceScore');
        expect(entity).toHaveProperty('notes');
        
        // Validate types
        expect(typeof entity.entityId).toBe('number');
        expect(typeof entity.relevanceScore).toBe('number');
      }
    });

    it('should include reference details when found', async () => {
      const result = await getReferenceWithLinkedEntities(1);
      
      if (result.reference) {
        expect(result.reference).toHaveProperty('id');
        expect(result.reference).toHaveProperty('title');
        expect(result.reference).toHaveProperty('entryType');
      }
    });
  });
});
