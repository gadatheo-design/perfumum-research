/**
 * wikidata-sync.test.ts
 * Tests unitaires pour les fonctions pures de wikidata-sync.ts
 * Couvre : buildRecommendations (toutes les branches)
 */

import { describe, it, expect } from 'vitest';
import { buildRecommendations, type WikidataEntity } from './routers/wikidata-sync';

// ─────────────────────────────────────────────────────────────────────────────
// Fixtures
// ─────────────────────────────────────────────────────────────────────────────

const baseEntity: WikidataEntity = {
  id: 'Q12345',
  label: 'Rosa damascena',
  description: 'Species of rose',
  aliases: ['Damask rose', 'Rose de Damas'],
  scientificName: 'Rosa damascena',
  taxonRank: 'species',
  parentTaxon: 'Rosa',
  conservationStatus: 'LC',
  imageUrl: 'https://commons.wikimedia.org/wiki/File:Rosa_damascena.jpg',
};

const emptyEntity: WikidataEntity = {
  id: 'Q99999',
  label: 'Unknown taxon',
  description: '',
  aliases: [],
};

// ─────────────────────────────────────────────────────────────────────────────
// buildRecommendations — structure de retour
// ─────────────────────────────────────────────────────────────────────────────

describe('buildRecommendations — structure de retour', () => {
  it('retourne toujours found: true', () => {
    const result = buildRecommendations(baseEntity, [], [], false);
    expect(result.found).toBe(true);
  });

  it('retourne wikidataEntity avec les champs de base', () => {
    const result = buildRecommendations(baseEntity, [], [], false);
    expect(result.wikidataEntity).toMatchObject({
      qid: 'Q12345',
      label: 'Rosa damascena',
      scientificName: 'Rosa damascena',
    });
  });

  it('retourne un tableau de recommandations non vide', () => {
    const result = buildRecommendations(baseEntity, [], [], false);
    expect(result.recommendations).toBeInstanceOf(Array);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it('chaque recommandation a les champs requis', () => {
    const result = buildRecommendations(baseEntity, ['Q11111'], ['France'], false);
    for (const rec of result.recommendations) {
      expect(rec).toHaveProperty('type');
      expect(rec).toHaveProperty('title');
      expect(rec).toHaveProperty('description');
      expect(rec).toHaveProperty('priority');
      expect(['high', 'medium', 'low']).toContain(rec.priority);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildRecommendations — branche synonyms (speciesLevelOnly)
// ─────────────────────────────────────────────────────────────────────────────

describe('buildRecommendations — synonyms (speciesLevelOnly)', () => {
  it('ajoute une recommandation synonyms quand speciesLevelOnly = true', () => {
    const result = buildRecommendations(baseEntity, [], [], true);
    const synonymsRec = result.recommendations.find(r => r.type === 'synonyms');
    expect(synonymsRec).toBeDefined();
    expect(synonymsRec?.priority).toBe('medium');
  });

  it('n\'ajoute pas de recommandation synonyms quand speciesLevelOnly = false', () => {
    const result = buildRecommendations(baseEntity, [], [], false);
    const synonymsRec = result.recommendations.find(r => r.type === 'synonyms');
    expect(synonymsRec).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildRecommendations — branche conservation
// ─────────────────────────────────────────────────────────────────────────────

describe('buildRecommendations — conservation', () => {
  it('recommandation conservation priority low quand statut IUCN présent', () => {
    const result = buildRecommendations(baseEntity, [], [], false);
    const rec = result.recommendations.find(r => r.type === 'conservation');
    expect(rec?.priority).toBe('low');
    expect(rec?.title).toContain('LC');
  });

  it('recommandation conservation priority medium quand statut IUCN absent', () => {
    const result = buildRecommendations(emptyEntity, [], [], false);
    const rec = result.recommendations.find(r => r.type === 'conservation');
    expect(rec?.priority).toBe('medium');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildRecommendations — branche images
// ─────────────────────────────────────────────────────────────────────────────

describe('buildRecommendations — images', () => {
  it('recommandation images priority low quand imageUrl présente', () => {
    const result = buildRecommendations(baseEntity, [], [], false);
    const rec = result.recommendations.find(r => r.type === 'images');
    expect(rec?.priority).toBe('low');
  });

  it('recommandation images priority medium quand imageUrl absente', () => {
    const result = buildRecommendations(emptyEntity, [], [], false);
    const rec = result.recommendations.find(r => r.type === 'images');
    expect(rec?.priority).toBe('medium');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildRecommendations — branche parents
// ─────────────────────────────────────────────────────────────────────────────

describe('buildRecommendations — parents', () => {
  it('recommandation parents priority high quand parentTaxon absent', () => {
    const result = buildRecommendations(emptyEntity, [], [], false);
    const rec = result.recommendations.find(r => r.type === 'parents');
    expect(rec?.priority).toBe('high');
  });

  it('recommandation parents priority low quand parentTaxon présent', () => {
    const result = buildRecommendations(baseEntity, [], [], false);
    const rec = result.recommendations.find(r => r.type === 'parents');
    expect(rec?.priority).toBe('low');
    expect(rec?.title).toContain('Rosa');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildRecommendations — branche hybrids
// ─────────────────────────────────────────────────────────────────────────────

describe('buildRecommendations — hybrids', () => {
  it('recommandation hybrids priority low quand aucun hybride', () => {
    const result = buildRecommendations(baseEntity, [], [], false);
    const rec = result.recommendations.find(r => r.type === 'hybrids');
    expect(rec?.priority).toBe('low');
  });

  it('recommandation hybrids priority medium quand hybrides présents', () => {
    const hybrids = ['Q11111', 'Q22222', 'Q33333'];
    const result = buildRecommendations(baseEntity, hybrids, [], false);
    const rec = result.recommendations.find(r => r.type === 'hybrids');
    expect(rec?.priority).toBe('medium');
    expect(rec?.title).toContain('3');
  });

  it('tronque l\'affichage à 5 hybrides dans la description', () => {
    const hybrids = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7'];
    const result = buildRecommendations(baseEntity, hybrids, [], false);
    const rec = result.recommendations.find(r => r.type === 'hybrids');
    expect(rec?.description).toContain('2 autres');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildRecommendations — branche distribution
// ─────────────────────────────────────────────────────────────────────────────

describe('buildRecommendations — distribution', () => {
  it('recommandation distribution priority medium quand aucune distribution', () => {
    const result = buildRecommendations(baseEntity, [], [], false);
    const rec = result.recommendations.find(r => r.type === 'distribution');
    expect(rec?.priority).toBe('medium');
  });

  it('recommandation distribution priority low quand distribution présente', () => {
    const distribution = ['France', 'Maroc', 'Turquie'];
    const result = buildRecommendations(baseEntity, [], distribution, false);
    const rec = result.recommendations.find(r => r.type === 'distribution');
    expect(rec?.priority).toBe('low');
    expect(rec?.title).toContain('3');
  });

  it('tronque l\'affichage à 5 zones dans la description', () => {
    const distribution = ['France', 'Maroc', 'Turquie', 'Iran', 'Bulgarie', 'Syrie'];
    const result = buildRecommendations(baseEntity, [], distribution, false);
    const rec = result.recommendations.find(r => r.type === 'distribution');
    expect(rec?.description).toContain('1 autres');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildRecommendations — wikidataEntity passthrough
// ─────────────────────────────────────────────────────────────────────────────

describe('buildRecommendations — wikidataEntity passthrough', () => {
  it('transmet les hybrids dans wikidataEntity', () => {
    const hybrids = ['Q11111', 'Q22222'];
    const result = buildRecommendations(baseEntity, hybrids, [], false);
    expect(result.wikidataEntity.hybrids).toEqual(hybrids);
  });

  it('transmet la distribution dans wikidataEntity', () => {
    const distribution = ['France', 'Maroc'];
    const result = buildRecommendations(baseEntity, [], distribution, false);
    expect(result.wikidataEntity.distribution).toEqual(distribution);
  });

  it('retourne null pour imageUrl quand absent dans entity', () => {
    const result = buildRecommendations(emptyEntity, [], [], false);
    expect(result.wikidataEntity.imageUrl).toBeUndefined();
  });
});
