import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock getDb
vi.mock('./db', () => ({
  getDb: vi.fn(),
}));

import { getDb } from './db';

describe('Recipes Router', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty array when db is not available', async () => {
    (getDb as any).mockResolvedValue(null);
    
    // Import after mock
    const { recipesRouter } = await import('./routers/recipes');
    const caller = recipesRouter.createCaller({} as any);
    
    const result = await caller.getAll();
    expect(result.recipes).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('should return recipes when db is available', async () => {
    const mockRecipes = [
      { id: 1, name: 'Test Recipe', slug: 'test-recipe', collection: 'Archives Vivantes' },
    ];
    
    const mockDb = {
      execute: vi.fn()
        .mockResolvedValueOnce([mockRecipes, []]) // First call for recipes
        .mockResolvedValueOnce([[{ total: 1 }], []]), // Second call for count
    };
    
    (getDb as any).mockResolvedValue(mockDb);
    
    const { recipesRouter } = await import('./routers/recipes');
    const caller = recipesRouter.createCaller({} as any);
    
    const result = await caller.getAll();
    expect(result.recipes).toHaveLength(1);
    expect(result.recipes[0].name).toBe('Test Recipe');
  });

  it('should filter recipes by collection', async () => {
    const mockDb = {
      execute: vi.fn()
        .mockResolvedValueOnce([[], []])
        .mockResolvedValueOnce([[{ total: 0 }], []]),
    };
    
    (getDb as any).mockResolvedValue(mockDb);
    
    const { recipesRouter } = await import('./routers/recipes');
    const caller = recipesRouter.createCaller({} as any);
    
    await caller.getAll({ collection: 'Archives Vivantes' });
    
    expect(mockDb.execute).toHaveBeenCalledWith(
      expect.stringContaining('collection = ?'),
      expect.arrayContaining(['Archives Vivantes'])
    );
  });
});

describe('Protocols Router', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty array when db is not available', async () => {
    (getDb as any).mockResolvedValue(null);
    
    const { protocolsRouter } = await import('./routers/protocols');
    const caller = protocolsRouter.createCaller({} as any);
    
    const result = await caller.getAll();
    expect(result.protocols).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('should return protocols when db is available', async () => {
    const mockProtocols = [
      { id: 1, name: 'Cryo-micronisation', slug: 'cryo-micronisation', category: 'extraction' },
    ];
    
    const mockDb = {
      execute: vi.fn()
        .mockResolvedValueOnce([mockProtocols, []])
        .mockResolvedValueOnce([[{ total: 1 }], []]),
    };
    
    (getDb as any).mockResolvedValue(mockDb);
    
    const { protocolsRouter } = await import('./routers/protocols');
    const caller = protocolsRouter.createCaller({} as any);
    
    const result = await caller.getAll();
    expect(result.protocols).toHaveLength(1);
    expect(result.protocols[0].name).toBe('Cryo-micronisation');
  });
});

describe('Landraces Router', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty array when db is not available', async () => {
    (getDb as any).mockResolvedValue(null);
    
    const { landracesRouter } = await import('./routers/landraces');
    const caller = landracesRouter.createCaller({} as any);
    
    const result = await caller.getAll();
    expect(result.landraces).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('should return landraces when db is available', async () => {
    const mockLandraces = [
      { id: 1, name: 'Hindu Kush', slug: 'hindu-kush', type: 'indica', origin: 'Afghanistan' },
    ];
    
    const mockDb = {
      execute: vi.fn()
        .mockResolvedValueOnce([mockLandraces, []])
        .mockResolvedValueOnce([[{ total: 1 }], []]),
    };
    
    (getDb as any).mockResolvedValue(mockDb);
    
    const { landracesRouter } = await import('./routers/landraces');
    const caller = landracesRouter.createCaller({} as any);
    
    const result = await caller.getAll();
    expect(result.landraces).toHaveLength(1);
    expect(result.landraces[0].name).toBe('Hindu Kush');
  });

  it('should filter landraces by type', async () => {
    const mockDb = {
      execute: vi.fn()
        .mockResolvedValueOnce([[], []])
        .mockResolvedValueOnce([[{ total: 0 }], []]),
    };
    
    (getDb as any).mockResolvedValue(mockDb);
    
    const { landracesRouter } = await import('./routers/landraces');
    const caller = landracesRouter.createCaller({} as any);
    
    await caller.getAll({ type: 'indica' });
    
    expect(mockDb.execute).toHaveBeenCalledWith(
      expect.stringContaining('type = ?'),
      expect.arrayContaining(['indica'])
    );
  });

  it('should return stats when db is available', async () => {
    const mockDb = {
      execute: vi.fn()
        .mockResolvedValueOnce([[{ total: 14 }], []])
        .mockResolvedValueOnce([[{ type: 'indica', count: 8 }], []])
        .mockResolvedValueOnce([[{ conservation_status: 'rare', count: 5 }], []])
        .mockResolvedValueOnce([[{ effect_type: 'relaxant', count: 10 }], []])
        .mockResolvedValueOnce([[{ country: 'Afghanistan', count: 3 }], []]),
    };
    
    (getDb as any).mockResolvedValue(mockDb);
    
    const { landracesRouter } = await import('./routers/landraces');
    const caller = landracesRouter.createCaller({} as any);
    
    const result = await caller.getStats();
    expect(result.total).toBe(14);
    expect(result.byType).toHaveLength(1);
  });
});
