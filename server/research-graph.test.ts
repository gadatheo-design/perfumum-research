import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appRouter } from './routers';
import { createContext } from './_core/context';
import type { Request, Response } from 'express';

// Mock the database module
vi.mock('./db', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    getResearchGraphData: vi.fn().mockResolvedValue({
      nodes: [
        { id: 'plant-1', name: 'Rose', type: 'plant', group: 1, val: 5 },
        { id: 'mol-1', name: 'Géraniol', type: 'molecule', group: 2, val: 4 },
        { id: 'TR-001', name: 'Route de l\'Encens', type: 'route', group: 3, val: 8 },
        { id: 'MS-EGY-001', name: 'Papyrus Ebers', type: 'manuscript', group: 4, val: 6 },
      ],
      links: [
        { source: 'plant-1', target: 'mol-1', type: 'contains', weight: 0.8, confidence: 0.9 },
        { source: 'MS-EGY-001', target: 'plant-1', type: 'mentions', weight: 1.0, confidence: 0.95 },
      ],
    }),
    getResearchGraphStats: vi.fn().mockResolvedValue({
      nodes: {
        plants: 50,
        molecules: 199,
        routes: 10,
        manuscripts: 26,
        fragments: 29,
      },
      edges: {
        total: 12,
        byType: {
          contains: 5,
          mentions: 4,
          traded_on: 3,
        },
      },
    }),
    getAllTextFragments: vi.fn().mockResolvedValue([
      {
        id: 1,
        fragmentId: 'TF-EGY-001',
        manuscriptId: 'MS-EGY-001',
        language: 'Égyptien hiératique',
        originalText: 'Recette du Kyphi sacré',
        translationFr: 'Prendre de la myrrhe...',
        translationEn: 'Take myrrh...',
        entities: ['myrrhe', 'encens'],
        evidenceLevel: 'confirmed',
      },
    ]),
    getTextFragmentStats: vi.fn().mockResolvedValue({
      total: 29,
      byLanguage: [
        { language: 'Arabe classique', count: 10 },
        { language: 'Égyptien hiératique', count: 8 },
        { language: 'Chinois classique', count: 6 },
      ],
      byEvidenceLevel: [
        { evidence_level: 'confirmed', count: 20 },
        { evidence_level: 'probable', count: 7 },
        { evidence_level: 'hypothetical', count: 2 },
      ],
    }),
    getAllTradeRoutes: vi.fn().mockResolvedValue([
      {
        id: 1,
        routeId: 'TR-001',
        name: 'Route de l\'Encens',
        timeStart: -1000,
        timeEnd: 200,
        nodes: [
          { place: 'Dhofar', lat: 17.0, lon: 54.0, type: 'origin' },
          { place: 'Pétra', lat: 30.3, lon: 35.4, type: 'hub' },
        ],
        materials: ['encens', 'myrrhe'],
        sources: ['Pline l\'Ancien'],
      },
    ]),
    getTradeRouteStats: vi.fn().mockResolvedValue({
      total: 10,
      materials: ['encens', 'myrrhe', 'musc', 'camphre'],
      regions: ['Dhofar', 'Pétra', 'Bagdad', 'Venise'],
      periods: [
        { name: 'Route de l\'Encens', start: -1000, end: 200 },
        { name: 'Route de la Soie', start: -130, end: 1450 },
      ],
    }),
  };
});

describe('Research Graph API', () => {
  const mockReq = {} as Request;
  const mockRes = {
    clearCookie: vi.fn(),
    cookie: vi.fn(),
  } as unknown as Response;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('researchGraph.getData', () => {
    it('should return graph data with nodes and links', async () => {
      const ctx = await createContext({ req: mockReq, res: mockRes });
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.researchGraph.getData({});
      
      expect(result).toBeDefined();
      expect(result.nodes).toBeDefined();
      expect(result.links).toBeDefined();
      expect(result.nodes.length).toBeGreaterThan(0);
      expect(result.links.length).toBeGreaterThan(0);
    });

    it('should return nodes with correct structure', async () => {
      const ctx = await createContext({ req: mockReq, res: mockRes });
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.researchGraph.getData({});
      
      const node = result.nodes[0];
      expect(node).toHaveProperty('id');
      expect(node).toHaveProperty('name');
      expect(node).toHaveProperty('type');
      expect(node).toHaveProperty('group');
      expect(node).toHaveProperty('val');
    });

    it('should return links with correct structure', async () => {
      const ctx = await createContext({ req: mockReq, res: mockRes });
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.researchGraph.getData({});
      
      const link = result.links[0];
      expect(link).toHaveProperty('source');
      expect(link).toHaveProperty('target');
      expect(link).toHaveProperty('type');
      expect(link).toHaveProperty('weight');
      expect(link).toHaveProperty('confidence');
    });

    it('should include different node types', async () => {
      const ctx = await createContext({ req: mockReq, res: mockRes });
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.researchGraph.getData({});
      
      const types = new Set(result.nodes.map(n => n.type));
      expect(types.has('plant')).toBe(true);
      expect(types.has('molecule')).toBe(true);
      expect(types.has('route')).toBe(true);
      expect(types.has('manuscript')).toBe(true);
    });
  });

  describe('researchGraph.getStats', () => {
    it('should return graph statistics', async () => {
      const ctx = await createContext({ req: mockReq, res: mockRes });
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.researchGraph.getStats();
      
      expect(result).toBeDefined();
      expect(result?.nodes).toBeDefined();
      expect(result?.edges).toBeDefined();
    });

    it('should return node counts by type', async () => {
      const ctx = await createContext({ req: mockReq, res: mockRes });
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.researchGraph.getStats();
      
      expect(result?.nodes.plants).toBeGreaterThanOrEqual(0);
      expect(result?.nodes.molecules).toBeGreaterThanOrEqual(0);
      expect(result?.nodes.routes).toBeGreaterThanOrEqual(0);
      expect(result?.nodes.manuscripts).toBeGreaterThanOrEqual(0);
    });

    it('should return edge statistics', async () => {
      const ctx = await createContext({ req: mockReq, res: mockRes });
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.researchGraph.getStats();
      
      expect(result?.edges.total).toBeGreaterThanOrEqual(0);
      expect(result?.edges.byType).toBeDefined();
    });
  });
});

describe('Text Fragments API', () => {
  const mockReq = {} as Request;
  const mockRes = {
    clearCookie: vi.fn(),
    cookie: vi.fn(),
  } as unknown as Response;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('textFragments.list', () => {
    it('should return list of text fragments', async () => {
      const ctx = await createContext({ req: mockReq, res: mockRes });
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.textFragments.list({});
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return fragments with correct structure', async () => {
      const ctx = await createContext({ req: mockReq, res: mockRes });
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.textFragments.list({});
      
      if (result.length > 0) {
        const fragment = result[0];
        expect(fragment).toHaveProperty('fragmentId');
        expect(fragment).toHaveProperty('manuscriptId');
        expect(fragment).toHaveProperty('language');
        expect(fragment).toHaveProperty('originalText');
        expect(fragment).toHaveProperty('translationFr');
        expect(fragment).toHaveProperty('evidenceLevel');
      }
    });
  });

  describe('textFragments.getStats', () => {
    it('should return text fragment statistics', async () => {
      const ctx = await createContext({ req: mockReq, res: mockRes });
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.textFragments.getStats();
      
      expect(result).toBeDefined();
    });
  });
});

describe('Trade Routes API', () => {
  const mockReq = {} as Request;
  const mockRes = {
    clearCookie: vi.fn(),
    cookie: vi.fn(),
  } as unknown as Response;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('tradeRoutes.list', () => {
    it('should return list of trade routes', async () => {
      const ctx = await createContext({ req: mockReq, res: mockRes });
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.tradeRoutes.list({});
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return routes with correct structure', async () => {
      const ctx = await createContext({ req: mockReq, res: mockRes });
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.tradeRoutes.list({});
      
      if (result.length > 0) {
        const route = result[0];
        expect(route).toHaveProperty('routeId');
        expect(route).toHaveProperty('name');
        expect(route).toHaveProperty('nodes');
        expect(route).toHaveProperty('materials');
      }
    });
  });

  describe('tradeRoutes.getStats', () => {
    it('should return trade route statistics', async () => {
      const ctx = await createContext({ req: mockReq, res: mockRes });
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.tradeRoutes.getStats();
      
      expect(result).toBeDefined();
      expect(result?.total).toBeGreaterThanOrEqual(0);
      expect(result?.materials).toBeDefined();
      expect(result?.regions).toBeDefined();
    });
  });
});
