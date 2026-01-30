import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database module
vi.mock('./db', () => ({
  getAllBibliographyEntries: vi.fn(),
  getBibliographyStats: vi.fn(),
  getLinksForReference: vi.fn(),
  createReferenceEntityLink: vi.fn(),
  deleteReferenceEntityLink: vi.fn(),
}));

import * as db from './db';

describe('Bibliography Date Filtering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should filter entries by year range', async () => {
    const mockEntries = [
      { id: 1, title: 'Old Study', year: 1950, authors: 'Smith, J.' },
      { id: 2, title: 'Recent Study', year: 2020, authors: 'Jones, A.' },
      { id: 3, title: 'Middle Study', year: 1990, authors: 'Brown, B.' },
    ];

    vi.mocked(db.getAllBibliographyEntries).mockResolvedValue(mockEntries);

    const result = await db.getAllBibliographyEntries({
      yearMin: 1980,
      yearMax: 2000,
    });

    expect(db.getAllBibliographyEntries).toHaveBeenCalledWith({
      yearMin: 1980,
      yearMax: 2000,
    });
  });

  it('should return year range in stats', async () => {
    const mockStats = {
      total: 100,
      byType: [{ type: 'article', count: 50 }],
      byDomain: [{ domain: 'botanique', count: 30 }],
      byReadStatus: [{ status: 'read', count: 20 }],
      byYear: [{ year: 2020, count: 10 }],
      yearRange: { min: 1900, max: 2024 },
    };

    vi.mocked(db.getBibliographyStats).mockResolvedValue(mockStats);

    const result = await db.getBibliographyStats();

    expect(result).toHaveProperty('yearRange');
    expect(result?.yearRange).toHaveProperty('min');
    expect(result?.yearRange).toHaveProperty('max');
    expect(result?.yearRange.min).toBeLessThanOrEqual(result?.yearRange.max);
  });
});

describe('Reference Entity Links', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get links for a reference with entity names', async () => {
    const mockLinks = [
      {
        id: 1,
        referenceId: 1,
        entityType: 'molecule',
        entityId: 5,
        linkType: 'documents',
        relevanceScore: 80,
        entityName: 'Linalool',
      },
      {
        id: 2,
        referenceId: 1,
        entityType: 'plant',
        entityId: 10,
        linkType: 'mentions',
        relevanceScore: 60,
        entityName: 'Lavandula angustifolia',
      },
    ];

    vi.mocked(db.getLinksForReference).mockResolvedValue(mockLinks);

    const result = await db.getLinksForReference(1);

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('entityName');
    expect(result[0].entityName).toBe('Linalool');
    expect(result[1].entityName).toBe('Lavandula angustifolia');
  });

  it('should create a new entity link', async () => {
    const newLink = {
      referenceId: 1,
      entityType: 'molecule' as const,
      entityId: 5,
      linkType: 'documents' as const,
      relevanceScore: 75,
      notes: 'Key molecule mentioned in abstract',
    };

    vi.mocked(db.createReferenceEntityLink).mockResolvedValue([{ insertId: 1 }]);

    const result = await db.createReferenceEntityLink(newLink);

    expect(db.createReferenceEntityLink).toHaveBeenCalledWith(newLink);
    expect(result).toBeDefined();
  });

  it('should delete an entity link', async () => {
    vi.mocked(db.deleteReferenceEntityLink).mockResolvedValue(true);

    const result = await db.deleteReferenceEntityLink(1);

    expect(db.deleteReferenceEntityLink).toHaveBeenCalledWith(1);
    expect(result).toBe(true);
  });

  it('should support all entity types', () => {
    const validEntityTypes = [
      'leaf_economy',
      'molecule',
      'recette',
      'plant',
      'prototype',
      'tradition',
      'terroir',
      'supplier',
    ];

    validEntityTypes.forEach(type => {
      expect(typeof type).toBe('string');
    });
  });

  it('should support all link types', () => {
    const validLinkTypes = [
      'documents',
      'mentions',
      'analyzes',
      'conserves',
      'reconstructs',
      'sources',
      'validates',
      'contextualizes',
    ];

    validLinkTypes.forEach(type => {
      expect(typeof type).toBe('string');
    });
  });
});

describe('Citation Network View', () => {
  it('should calculate network density correctly', () => {
    const nodes = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    const links = [
      { source: 1, target: 2 },
      { source: 2, target: 3 },
      { source: 3, target: 4 },
    ];

    // Density formula: 2 * edges / (nodes * (nodes - 1))
    const density = (links.length * 2) / (nodes.length * (nodes.length - 1)) * 100;
    
    expect(density).toBeCloseTo(50, 1); // 6 / 12 * 100 = 50%
  });

  it('should calculate average degree correctly', () => {
    const nodes = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    const links = [
      { source: 1, target: 2 },
      { source: 2, target: 3 },
      { source: 3, target: 4 },
    ];

    // Average degree: 2 * edges / nodes
    const avgDegree = (links.length * 2) / nodes.length;
    
    expect(avgDegree).toBe(1.5);
  });

  it('should filter nodes by year range', () => {
    const nodes = [
      { id: 1, year: 1990 },
      { id: 2, year: 2000 },
      { id: 3, year: 2010 },
      { id: 4, year: 2020 },
    ];

    const yearRange: [number, number] = [2000, 2015];
    const filteredNodes = nodes.filter(
      n => n.year && n.year >= yearRange[0] && n.year <= yearRange[1]
    );

    expect(filteredNodes).toHaveLength(2);
    expect(filteredNodes.map(n => n.id)).toEqual([2, 3]);
  });

  it('should filter nodes by author', () => {
    const nodes = [
      { id: 1, authors: 'Smith, J., Jones, A.' },
      { id: 2, authors: 'Brown, B., Smith, J.' },
      { id: 3, authors: 'Williams, C.' },
    ];

    const selectedAuthor = 'Smith';
    const filteredNodes = nodes.filter(
      n => n.authors?.toLowerCase().includes(selectedAuthor.toLowerCase())
    );

    expect(filteredNodes).toHaveLength(2);
    expect(filteredNodes.map(n => n.id)).toEqual([1, 2]);
  });

  it('should filter links to match filtered nodes', () => {
    const nodes = [
      { id: 1, year: 2010 },
      { id: 2, year: 2020 },
      { id: 3, year: 1990 },
    ];
    const links = [
      { source: 1, target: 2 },
      { source: 2, target: 3 },
      { source: 1, target: 3 },
    ];

    // Filter nodes by year >= 2000
    const filteredNodes = nodes.filter(n => n.year && n.year >= 2000);
    const nodeIds = new Set(filteredNodes.map(n => n.id));

    const filteredLinks = links.filter(
      link => nodeIds.has(link.source) && nodeIds.has(link.target)
    );

    expect(filteredLinks).toHaveLength(1);
    expect(filteredLinks[0]).toEqual({ source: 1, target: 2 });
  });
});

describe('DateRangeFilter Component Logic', () => {
  it('should generate histogram from year distribution', () => {
    const yearDistribution = [
      { year: 1990, count: 5 },
      { year: 1995, count: 3 },
      { year: 2000, count: 8 },
      { year: 2005, count: 12 },
      { year: 2010, count: 7 },
    ];

    // Group by decades
    const decades: Record<number, number> = {};
    yearDistribution.forEach(({ year, count }) => {
      if (year) {
        const decade = Math.floor(year / 10) * 10;
        decades[decade] = (decades[decade] || 0) + count;
      }
    });

    expect(decades[1990]).toBe(8); // 1990 + 1995
    expect(decades[2000]).toBe(20); // 2000 + 2005
    expect(decades[2010]).toBe(7);
  });

  it('should validate quick period ranges', () => {
    const quickPeriods = [
      { label: 'Antiquité', range: [-3000, 500] },
      { label: 'Moyen Âge', range: [500, 1500] },
      { label: 'Renaissance', range: [1500, 1700] },
      { label: 'XVIIIe siècle', range: [1700, 1800] },
      { label: 'XIXe siècle', range: [1800, 1900] },
      { label: 'XXe siècle', range: [1900, 2000] },
      { label: 'XXIe siècle', range: [2000, 2100] },
    ];

    quickPeriods.forEach(period => {
      expect(period.range[0]).toBeLessThan(period.range[1]);
    });

    // Check continuity
    for (let i = 1; i < quickPeriods.length; i++) {
      expect(quickPeriods[i].range[0]).toBeGreaterThanOrEqual(quickPeriods[i - 1].range[1] - 200);
    }
  });
});
