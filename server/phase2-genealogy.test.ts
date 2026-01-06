/**
 * PERFUMUM - Tests unitaires Phase 2 : Généalogie avancée et axes de recherche
 * 
 * Ce fichier teste les nouvelles fonctionnalités ajoutées dans la Phase 2 :
 * - Axes de recherche NEZ
 * - Articles sources NEZ
 * - Mappings axe-source
 * - Axes de recherche innovants
 */

import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-123",
    email: "test@perfumum.com",
    name: "Test User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe('Phase 2 - Axes de recherche NEZ', () => {
  it('devrait lister les axes de recherche NEZ', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const axes = await caller.researchAxesNez.list();
    
    expect(axes).toBeDefined();
    expect(Array.isArray(axes)).toBe(true);
    expect(axes.length).toBeGreaterThanOrEqual(10);
  });

  it('devrait récupérer un axe par slug', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const axis = await caller.researchAxesNez.getBySlug({ 
      slug: 'olfaction-metabolism-glp1' 
    });
    
    expect(axis).toBeDefined();
    if (axis) {
      expect(axis.axis_id).toBe('AX_OLFACTION_METABOLISM');
      expect(axis.title_fr).toContain('Olfaction');
    }
  });

  it('devrait récupérer un axe avec ses sources', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const axisWithSources = await caller.researchAxesNez.getWithSources({ 
      slug: 'olfaction-metabolism-glp1' 
    });
    
    expect(axisWithSources).toBeDefined();
    if (axisWithSources) {
      expect(axisWithSources.sources).toBeDefined();
      expect(Array.isArray(axisWithSources.sources)).toBe(true);
    }
  });

  it('devrait retourner les statistiques des axes NEZ', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const stats = await caller.researchAxesNez.getStats();
    
    expect(stats).toBeDefined();
    if (stats) {
      expect(stats.totalAxes).toBeGreaterThanOrEqual(10);
      expect(stats.totalArticles).toBeGreaterThanOrEqual(13);
      expect(stats.totalMappings).toBeGreaterThanOrEqual(13);
    }
  });
});

describe('Phase 2 - Articles sources NEZ', () => {
  it('devrait lister les articles sources NEZ', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const articles = await caller.sourceArticlesNez.list();
    
    expect(articles).toBeDefined();
    expect(Array.isArray(articles)).toBe(true);
    expect(articles.length).toBeGreaterThanOrEqual(13);
  });

  it('devrait récupérer un article par source_id', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const article = await caller.sourceArticlesNez.getById({ 
      sourceId: 'NEZ_2024_04_07_INSULIN' 
    });
    
    expect(article).toBeDefined();
    if (article) {
      expect(article.title).toContain('insuline');
      expect(article.lang).toBe('fr');
      expect(article.url).toContain('mag.bynez.com');
    }
  });
});

describe('Phase 2 - Mappings axe-source NEZ', () => {
  it('devrait lister tous les mappings axe-source', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const mappings = await caller.axisSourcesNez.list({});
    
    expect(mappings).toBeDefined();
    expect(Array.isArray(mappings)).toBe(true);
    expect(mappings.length).toBeGreaterThanOrEqual(13);
  });

  it('devrait filtrer les mappings par axe', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const mappings = await caller.axisSourcesNez.list({ 
      axisId: 'AX_RECEPTOR_STRUCTURES' 
    });
    
    expect(mappings).toBeDefined();
    expect(Array.isArray(mappings)).toBe(true);
    expect(mappings.length).toBeGreaterThanOrEqual(2);
  });
});

describe('Phase 2 - Axes de recherche innovants', () => {
  it('devrait lister les axes de recherche innovants', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const axes = await caller.researchAxesInnovants.list();
    
    expect(axes).toBeDefined();
    expect(Array.isArray(axes)).toBe(true);
    expect(axes.length).toBeGreaterThanOrEqual(6);
  });

  it('devrait récupérer un axe par code', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const axis = await caller.researchAxesInnovants.getByCode({ 
      axisCode: 'AX_GENOMIQUE_OLFACTIVE' 
    });
    
    expect(axis).toBeDefined();
    if (axis) {
      expect(axis.title_fr).toContain('Génomique');
      expect(axis.priority_level).toBe('critical');
      expect(axis.status).toBe('active');
    }
  });

  it('devrait filtrer les axes par priorité', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const criticalAxes = await caller.researchAxesInnovants.getByPriority({ 
      priority: 'critical' 
    });
    
    expect(criticalAxes).toBeDefined();
    expect(Array.isArray(criticalAxes)).toBe(true);
    expect(criticalAxes.length).toBeGreaterThanOrEqual(2);
  });

  it('devrait filtrer les axes par statut', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const activeAxes = await caller.researchAxesInnovants.getByStatus({ 
      status: 'active' 
    });
    
    expect(activeAxes).toBeDefined();
    expect(Array.isArray(activeAxes)).toBe(true);
    expect(activeAxes.length).toBeGreaterThanOrEqual(2);
  });

  it('devrait retourner les statistiques des axes innovants', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const stats = await caller.researchAxesInnovants.getStats();
    
    expect(stats).toBeDefined();
    if (stats) {
      expect(stats.total).toBeGreaterThanOrEqual(6);
      expect(stats.byPriority).toBeDefined();
      expect(stats.byStatus).toBeDefined();
    }
  });
});

describe('Phase 2 - Variétés disparues', () => {
  it('devrait lister les variétés disparues', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const varieties = await caller.lostVarieties.list();
    
    expect(varieties).toBeDefined();
    expect(Array.isArray(varieties)).toBe(true);
  });

  it('devrait retourner les statistiques des variétés disparues', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const stats = await caller.lostVarieties.getStats();
    
    expect(stats).toBeDefined();
    if (stats) {
      expect(stats.total).toBeDefined();
    }
  });
});

describe('Phase 2 - Profils moléculaires', () => {
  it('devrait lister les profils moléculaires', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const profiles = await caller.molecularProfiles.list();
    
    expect(profiles).toBeDefined();
    expect(Array.isArray(profiles)).toBe(true);
  });
});

describe('Phase 2 - Comparaisons moléculaires', () => {
  it('devrait lister les comparaisons moléculaires', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const comparisons = await caller.molecularComparisons.list();
    
    expect(comparisons).toBeDefined();
    expect(Array.isArray(comparisons)).toBe(true);
  });
});

describe('Phase 2 - Archives historiques', () => {
  it('devrait lister les archives historiques', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const records = await caller.historicalRecords.list();
    
    expect(records).toBeDefined();
    expect(Array.isArray(records)).toBe(true);
  });
});
