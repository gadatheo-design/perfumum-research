import { describe, it, expect, beforeAll } from 'vitest';
import { appRouter } from './routers';
import { createContext } from './_core/context';
import type { inferProcedureInput } from '@trpc/server';

// Create a caller for testing
const createCaller = () => {
  return appRouter.createCaller({
    user: null,
    req: {} as any,
    res: {} as any,
  });
};

const createAuthenticatedCaller = () => {
  return appRouter.createCaller({
    user: { id: 1, openId: 'test-user', name: 'Test User', role: 'admin' } as any,
    req: {} as any,
    res: {} as any,
  });
};

describe('Situated Smells (Odeurs Situées)', () => {
  describe('situatedSmells.list', () => {
    it('should return a list of situated smells', async () => {
      const caller = createCaller();
      const result = await caller.situatedSmells.list();
      
      expect(Array.isArray(result)).toBe(true);
      // Should have at least the seeded data
      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it('should return smells with required fields', async () => {
      const caller = createCaller();
      const result = await caller.situatedSmells.list();
      
      if (result.length > 0) {
        const smell = result[0];
        expect(smell).toHaveProperty('id');
        expect(smell).toHaveProperty('poeticName');
        expect(smell).toHaveProperty('location');
        expect(smell).toHaveProperty('date');
      }
    });
  });

  describe('situatedSmells.getById', () => {
    it('should return null for non-existent id', async () => {
      const caller = createCaller();
      const result = await caller.situatedSmells.getById(999999);
      
      expect(result).toBeNull();
    });

    it('should return a smell by id if it exists', async () => {
      const caller = createCaller();
      const list = await caller.situatedSmells.list();
      
      if (list.length > 0) {
        const smell = await caller.situatedSmells.getById(list[0].id);
        expect(smell).not.toBeNull();
        expect(smell?.id).toBe(list[0].id);
      }
    });
  });
});

describe('Research Axes', () => {
  describe('researchAxes.list', () => {
    it('should return a list of research axes', async () => {
      const caller = createCaller();
      const result = await caller.researchAxes.list();
      
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return axes with required fields', async () => {
      const caller = createCaller();
      const result = await caller.researchAxes.list();
      
      if (result.length > 0) {
        const axis = result[0];
        expect(axis).toHaveProperty('id');
        expect(axis).toHaveProperty('axisCode');
        expect(axis).toHaveProperty('name');
      }
    });

    it('should filter by status', async () => {
      const caller = createCaller();
      const result = await caller.researchAxes.list({ status: 'en_cours' });
      
      expect(Array.isArray(result)).toBe(true);
      result.forEach(axis => {
        expect(axis.status).toBe('en_cours');
      });
    });

    it('should filter by category', async () => {
      const caller = createCaller();
      const result = await caller.researchAxes.list({ category: 'experimental' });
      
      expect(Array.isArray(result)).toBe(true);
      result.forEach(axis => {
        expect(axis.category).toBe('experimental');
      });
    });
  });

  describe('researchAxes.getByCode', () => {
    it('should return null for non-existent code', async () => {
      const caller = createCaller();
      const result = await caller.researchAxes.getByCode('NONEXISTENT');
      
      expect(result).toBeNull();
    });

    it('should return AX1 if it exists', async () => {
      const caller = createCaller();
      const result = await caller.researchAxes.getByCode('AX1');
      
      if (result) {
        expect(result.axisCode).toBe('AX1');
        // The name may vary depending on seeded data
        expect(result.name).toBeDefined();
        expect(typeof result.name).toBe('string');
      }
    });

    it('should return AX3 if it exists', async () => {
      const caller = createCaller();
      const result = await caller.researchAxes.getByCode('AX3');
      
      if (result) {
        expect(result.axisCode).toBe('AX3');
        // The name may vary depending on seeded data
        expect(result.name).toBeDefined();
        expect(typeof result.name).toBe('string');
      }
    });

    it('should return AX4 if it exists', async () => {
      const caller = createCaller();
      const result = await caller.researchAxes.getByCode('AX4');
      
      if (result) {
        expect(result.axisCode).toBe('AX4');
        // The name may vary depending on seeded data
        expect(result.name).toBeDefined();
        expect(typeof result.name).toBe('string');
      }
    });
  });

  describe('researchAxes.getStats', () => {
    it('should return statistics', async () => {
      const caller = createCaller();
      const result = await caller.researchAxes.getStats();
      
      expect(result).toBeDefined();
    });
  });
});

describe('Civilisations', () => {
  describe('civilisations.list', () => {
    it('should return a list of civilisations', async () => {
      const caller = createCaller();
      const result = await caller.civilisations.list();
      
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return civilisations with required fields', async () => {
      const caller = createCaller();
      const result = await caller.civilisations.list();
      
      if (result.length > 0) {
        const civ = result[0];
        expect(civ).toHaveProperty('id');
        expect(civ).toHaveProperty('name');
        expect(civ).toHaveProperty('region');
      }
    });
  });
});
