/**
 * Tests Vitest pour server/db/plants.ts
 * Couvre les fonctions pures de transformation de données (sans connexion DB)
 */
import { describe, it, expect } from 'vitest';
import {
  groupVarietiesByStatus,
  groupVarietiesByCategory,
  buildVarietyFilterConditions,
} from './db/plants';

// ─── Types helpers ────────────────────────────────────────────────────────────
type VarietyItem = {
  variety: { conservationStatus?: string | null };
  plant: { category?: string | null } | null;
};

// ─── groupVarietiesByStatus ───────────────────────────────────────────────────
describe('groupVarietiesByStatus', () => {
  it('retourne un tableau vide pour un input vide', () => {
    expect(groupVarietiesByStatus([])).toEqual([]);
  });

  it('groupe correctement par statut de conservation', () => {
    const items: VarietyItem[] = [
      { variety: { conservationStatus: 'CR' }, plant: null },
      { variety: { conservationStatus: 'EN' }, plant: null },
      { variety: { conservationStatus: 'CR' }, plant: null },
      { variety: { conservationStatus: 'VU' }, plant: null },
      { variety: { conservationStatus: 'CR' }, plant: null },
    ];
    const result = groupVarietiesByStatus(items);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ status: 'CR', count: 3 });
    expect(result[1]).toEqual({ status: 'EN', count: 1 });
    expect(result[2]).toEqual({ status: 'VU', count: 1 });
  });

  it('utilise "unknown" pour les statuts null ou undefined', () => {
    const items: VarietyItem[] = [
      { variety: { conservationStatus: null }, plant: null },
      { variety: { conservationStatus: undefined }, plant: null },
      { variety: { conservationStatus: 'LC' }, plant: null },
    ];
    const result = groupVarietiesByStatus(items);
    const unknownEntry = result.find(r => r.status === 'unknown');
    expect(unknownEntry).toBeDefined();
    expect(unknownEntry?.count).toBe(2);
  });

  it('trie par count décroissant', () => {
    const items: VarietyItem[] = [
      { variety: { conservationStatus: 'LC' }, plant: null },
      { variety: { conservationStatus: 'CR' }, plant: null },
      { variety: { conservationStatus: 'CR' }, plant: null },
      { variety: { conservationStatus: 'CR' }, plant: null },
      { variety: { conservationStatus: 'EN' }, plant: null },
      { variety: { conservationStatus: 'EN' }, plant: null },
    ];
    const result = groupVarietiesByStatus(items);
    expect(result[0].status).toBe('CR');
    expect(result[0].count).toBe(3);
    expect(result[1].status).toBe('EN');
    expect(result[1].count).toBe(2);
    expect(result[2].status).toBe('LC');
    expect(result[2].count).toBe(1);
  });

  it('gère un seul élément', () => {
    const items: VarietyItem[] = [
      { variety: { conservationStatus: 'EX' }, plant: null },
    ];
    const result = groupVarietiesByStatus(items);
    expect(result).toEqual([{ status: 'EX', count: 1 }]);
  });

  it('gère tous les statuts IUCN standard', () => {
    const statuses = ['EX', 'EW', 'CR', 'EN', 'VU', 'NT', 'LC', 'DD', 'NE'];
    const items: VarietyItem[] = statuses.map(s => ({
      variety: { conservationStatus: s },
      plant: null,
    }));
    const result = groupVarietiesByStatus(items);
    expect(result).toHaveLength(9);
    result.forEach(r => expect(r.count).toBe(1));
  });
});

// ─── groupVarietiesByCategory ─────────────────────────────────────────────────
describe('groupVarietiesByCategory', () => {
  it('retourne un tableau vide pour un input vide', () => {
    expect(groupVarietiesByCategory([])).toEqual([]);
  });

  it('groupe correctement par catégorie de plante', () => {
    const items: VarietyItem[] = [
      { variety: { conservationStatus: 'LC' }, plant: { category: 'herb' } },
      { variety: { conservationStatus: 'CR' }, plant: { category: 'tree' } },
      { variety: { conservationStatus: 'EN' }, plant: { category: 'herb' } },
      { variety: { conservationStatus: 'VU' }, plant: { category: 'shrub' } },
      { variety: { conservationStatus: 'LC' }, plant: { category: 'herb' } },
    ];
    const result = groupVarietiesByCategory(items);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ category: 'herb', count: 3 });
    expect(result[1]).toEqual({ category: 'tree', count: 1 });
    expect(result[2]).toEqual({ category: 'shrub', count: 1 });
  });

  it('utilise "unknown" pour les plantes null ou catégorie null', () => {
    const items: VarietyItem[] = [
      { variety: { conservationStatus: 'LC' }, plant: null },
      { variety: { conservationStatus: 'CR' }, plant: { category: null } },
      { variety: { conservationStatus: 'EN' }, plant: { category: 'tree' } },
    ];
    const result = groupVarietiesByCategory(items);
    const unknownEntry = result.find(r => r.category === 'unknown');
    expect(unknownEntry).toBeDefined();
    expect(unknownEntry?.count).toBe(2);
  });

  it('trie par count décroissant', () => {
    const items: VarietyItem[] = [
      { variety: { conservationStatus: 'LC' }, plant: { category: 'grass' } },
      { variety: { conservationStatus: 'LC' }, plant: { category: 'tree' } },
      { variety: { conservationStatus: 'LC' }, plant: { category: 'tree' } },
      { variety: { conservationStatus: 'LC' }, plant: { category: 'tree' } },
    ];
    const result = groupVarietiesByCategory(items);
    expect(result[0].category).toBe('tree');
    expect(result[0].count).toBe(3);
    expect(result[1].category).toBe('grass');
    expect(result[1].count).toBe(1);
  });
});

// ─── buildVarietyFilterConditions ────────────────────────────────────────────
describe('buildVarietyFilterConditions', () => {
  it('retourne un tableau vide pour des filtres vides', () => {
    expect(buildVarietyFilterConditions({})).toEqual([]);
  });

  it('ajoute une condition pour plantCategory', () => {
    const conditions = buildVarietyFilterConditions({ plantCategory: 'herb' });
    expect(conditions).toContain('category=herb');
    expect(conditions).toHaveLength(1);
  });

  it('ajoute une condition pour varietyType', () => {
    const conditions = buildVarietyFilterConditions({ varietyType: 'cannabis' });
    expect(conditions).toContain('varietyType=cannabis');
    expect(conditions).toHaveLength(1);
  });

  it('ajoute une condition pour conservationStatus', () => {
    const conditions = buildVarietyFilterConditions({ conservationStatus: 'CR' });
    expect(conditions).toContain('conservationStatus=CR');
    expect(conditions).toHaveLength(1);
  });

  it('ajoute une condition pour countryOfOrigin', () => {
    const conditions = buildVarietyFilterConditions({ countryOfOrigin: 'France' });
    expect(conditions).toContain('countryOfOrigin=France');
    expect(conditions).toHaveLength(1);
  });

  it('ajoute une condition pour searchQuery', () => {
    const conditions = buildVarietyFilterConditions({ searchQuery: 'lavande' });
    expect(conditions).toContain('search=lavande');
    expect(conditions).toHaveLength(1);
  });

  it('combine plusieurs filtres', () => {
    const conditions = buildVarietyFilterConditions({
      plantCategory: 'herb',
      conservationStatus: 'EN',
      searchQuery: 'rosa',
    });
    expect(conditions).toHaveLength(3);
    expect(conditions).toContain('category=herb');
    expect(conditions).toContain('conservationStatus=EN');
    expect(conditions).toContain('search=rosa');
  });

  it('ignore les filtres undefined', () => {
    const conditions = buildVarietyFilterConditions({
      plantCategory: undefined,
      varietyType: 'tobacco',
    });
    expect(conditions).toHaveLength(1);
    expect(conditions).toContain('varietyType=tobacco');
  });

  it('ignore les filtres chaîne vide', () => {
    const conditions = buildVarietyFilterConditions({
      plantCategory: '',
      varietyType: 'hemp',
    });
    expect(conditions).toHaveLength(1);
    expect(conditions).toContain('varietyType=hemp');
  });
});
