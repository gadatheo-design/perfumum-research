/**
 * Tests for synergies tRPC procedures
 * Tests the new synergy-related endpoints for graph visualization and suggestions
 */

import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

// Create a minimal context for public procedures
function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {
      clearCookie: () => {},
    } as TrpcContext['res'],
  };
}

describe('Synergies tRPC Procedures', () => {
  describe('synergies.getAllForGenerator', () => {
    it('should return synergy data structure for the generator', async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.synergies.getAllForGenerator();
      
      // Verify the structure of the response
      expect(result).toBeDefined();
      expect(result).toHaveProperty('terpeneSynergies');
      expect(result).toHaveProperty('moleculeSynergies');
      expect(result).toHaveProperty('entourageRules');
      expect(result).toHaveProperty('molecularInteractions');
      expect(result).toHaveProperty('formulationSuggestions');
      
      // Arrays should be defined (may be empty if no data)
      expect(Array.isArray(result.terpeneSynergies)).toBe(true);
      expect(Array.isArray(result.moleculeSynergies)).toBe(true);
    });
  });

  describe('synergies.getGraphVisualizationData', () => {
    it('should return graph data with nodes, links, and stats', async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.synergies.getGraphVisualizationData();
      
      // Verify the structure of the response
      expect(result).toBeDefined();
      expect(result).toHaveProperty('nodes');
      expect(result).toHaveProperty('links');
      expect(result).toHaveProperty('stats');
      
      // Verify stats structure
      expect(result.stats).toHaveProperty('totalNodes');
      expect(result.stats).toHaveProperty('totalLinks');
      expect(result.stats).toHaveProperty('byType');
      
      // Arrays should be defined
      expect(Array.isArray(result.nodes)).toBe(true);
      expect(Array.isArray(result.links)).toBe(true);
      
      // Stats should be numbers
      expect(typeof result.stats.totalNodes).toBe('number');
      expect(typeof result.stats.totalLinks).toBe('number');
    });

    it('should return nodes with required properties when data exists', async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.synergies.getGraphVisualizationData();
      
      if (result.nodes.length > 0) {
        const node = result.nodes[0];
        expect(node).toHaveProperty('id');
        expect(node).toHaveProperty('name');
        expect(node).toHaveProperty('connectionCount');
        expect(typeof node.id).toBe('number');
        expect(typeof node.name).toBe('string');
      }
    });

    it('should return links with required properties when data exists', async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.synergies.getGraphVisualizationData();
      
      if (result.links.length > 0) {
        const link = result.links[0];
        expect(link).toHaveProperty('id');
        expect(link).toHaveProperty('source');
        expect(link).toHaveProperty('target');
        expect(link).toHaveProperty('type');
        expect(link).toHaveProperty('compatibilityScore');
      }
    });
  });

  describe('synergies.getSuggestionsForMolecules', () => {
    it('should return suggestions for an empty array', async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.synergies.getSuggestionsForMolecules([]);
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('selectedIds');
      expect(result).toHaveProperty('suggestions');
      expect(result.selectedIds).toEqual([]);
      expect(result.suggestions).toEqual([]);
    });

    it('should return suggestions structure for valid molecule IDs', async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      
      // Use molecule IDs that might exist in the database
      const result = await caller.synergies.getSuggestionsForMolecules([1, 2, 3]);
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('selectedIds');
      expect(result).toHaveProperty('suggestions');
      expect(result.selectedIds).toEqual([1, 2, 3]);
      expect(Array.isArray(result.suggestions)).toBe(true);
    });

    it('should return suggestions with required properties when data exists', async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.synergies.getSuggestionsForMolecules([1, 2, 3]);
      
      if (result.suggestions.length > 0) {
        const suggestion = result.suggestions[0];
        expect(suggestion).toHaveProperty('molecule');
        expect(suggestion).toHaveProperty('synergyType');
        expect(suggestion).toHaveProperty('compatibilityScore');
        expect(suggestion).toHaveProperty('description');
        expect(suggestion).toHaveProperty('synergyPartners');
        expect(suggestion).toHaveProperty('synergyCount');
        
        // Verify molecule structure
        expect(suggestion.molecule).toHaveProperty('id');
        expect(suggestion.molecule).toHaveProperty('name');
      }
    });
  });

  describe('synergies.getSuggestionsForMolecule', () => {
    it('should return suggestions for a single molecule', async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.synergies.getSuggestionsForMolecule(1);
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('moleculeId');
      expect(result).toHaveProperty('suggestions');
      expect(result.moleculeId).toBe(1);
      expect(Array.isArray(result.suggestions)).toBe(true);
    });
  });

  describe('synergies.getBetweenMolecules', () => {
    it('should check synergy between two molecules', async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.synergies.getBetweenMolecules({
        molecule1Id: 1,
        molecule2Id: 2,
      });
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('terpeneSynergy');
      expect(result).toHaveProperty('moleculeSynergy');
      expect(result).toHaveProperty('hasDocumentedSynergy');
      expect(typeof result.hasDocumentedSynergy).toBe('boolean');
    });
  });

  describe('synergies.list', () => {
    it('should return a list of synergies', async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.synergies.list();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('synergies.getAllMoleculeSynergies', () => {
    it('should return all molecule synergies', async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.synergies.getAllMoleculeSynergies();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('synergies.getGraphData', () => {
    it('should return graph data for visualization', async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.synergies.getGraphData();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
