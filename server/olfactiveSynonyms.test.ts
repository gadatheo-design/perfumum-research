import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Synonymes Olfactifs - Module shared/olfactiveSynonyms', () => {
  let synonymsModule: typeof import('../shared/olfactiveSynonyms');

  beforeEach(async () => {
    vi.clearAllMocks();
    synonymsModule = await import('../shared/olfactiveSynonyms');
  });

  describe('normalizeSearchTerm', () => {
    it('devrait convertir en minuscules', () => {
      expect(synonymsModule.normalizeSearchTerm('ROSE')).toBe('rose');
      expect(synonymsModule.normalizeSearchTerm('Lavande')).toBe('lavande');
    });

    it('devrait supprimer les accents', () => {
      expect(synonymsModule.normalizeSearchTerm('épicé')).toBe('epice');
      expect(synonymsModule.normalizeSearchTerm('hespéridé')).toBe('hesperide');
      expect(synonymsModule.normalizeSearchTerm('cèdre')).toBe('cedre');
    });

    it('devrait supprimer les espaces en début et fin', () => {
      expect(synonymsModule.normalizeSearchTerm('  rose  ')).toBe('rose');
    });
  });

  describe('getSynonyms', () => {
    it('devrait retourner les synonymes pour "rose"', () => {
      const synonyms = synonymsModule.getSynonyms('rose');
      expect(synonyms).toContain('rosa');
      expect(synonyms).toContain('rosé');
    });

    it('devrait retourner les synonymes pour "floral"', () => {
      const synonyms = synonymsModule.getSynonyms('floral');
      expect(synonyms).toContain('fleuri');
      expect(synonyms).toContain('florale');
      expect(synonyms).toContain('fleur');
    });

    it('devrait retourner les synonymes pour "boisé"', () => {
      const synonyms = synonymsModule.getSynonyms('boisé');
      expect(synonyms).toContain('woody');
      expect(synonyms).toContain('bois');
    });

    it('devrait retourner les synonymes pour "agrume"', () => {
      const synonyms = synonymsModule.getSynonyms('agrume');
      expect(synonyms).toContain('citrus');
    });

    it('devrait retourner un tableau vide pour un terme inconnu', () => {
      const synonyms = synonymsModule.getSynonyms('xyzabc123');
      expect(synonyms).toEqual([]);
    });
  });

  describe('expandSearchQuery', () => {
    it('devrait inclure le terme original', () => {
      const expanded = synonymsModule.expandSearchQuery('rose');
      expect(expanded).toContain('rose');
    });

    it('devrait inclure les synonymes', () => {
      const expanded = synonymsModule.expandSearchQuery('rose');
      expect(expanded).toContain('rosa');
    });

    it('devrait gérer les requêtes multi-mots', () => {
      const expanded = synonymsModule.expandSearchQuery('rose boisé');
      expect(expanded).toContain('rose');
      expect(expanded).toContain('boisé');
    });

    it('devrait ignorer les mots courts (< 3 caractères)', () => {
      const expanded = synonymsModule.expandSearchQuery('le la rose');
      expect(expanded).not.toContain('le');
      expect(expanded).not.toContain('la');
      expect(expanded).toContain('rose');
    });
  });

  describe('categorizeOlfactiveTerm', () => {
    it('devrait catégoriser "rose" comme famille', () => {
      const result = synonymsModule.categorizeOlfactiveTerm('rose');
      expect(result.category).toBe('family');
      expect(result.confidence).toBe(1.0);
    });

    it('devrait catégoriser "note de tête" comme note', () => {
      const result = synonymsModule.categorizeOlfactiveTerm('note de tête');
      expect(result.category).toBe('note');
      expect(result.confidence).toBe(1.0);
    });

    it('devrait catégoriser "distillation" comme technique', () => {
      const result = synonymsModule.categorizeOlfactiveTerm('distillation');
      expect(result.category).toBe('technical');
      expect(result.confidence).toBe(1.0);
    });

    it('devrait catégoriser "romantique" comme émotionnel', () => {
      const result = synonymsModule.categorizeOlfactiveTerm('romantique');
      expect(result.category).toBe('emotional');
      expect(result.confidence).toBe(1.0);
    });

    it('devrait retourner "unknown" pour un terme non reconnu', () => {
      const result = synonymsModule.categorizeOlfactiveTerm('xyzabc123');
      expect(result.category).toBe('unknown');
      expect(result.confidence).toBe(0);
    });
  });

  describe('getDictionaryStats', () => {
    it('devrait retourner des statistiques valides', () => {
      const stats = synonymsModule.getDictionaryStats();
      expect(stats.totalTerms).toBeGreaterThan(0);
      expect(stats.totalSynonyms).toBeGreaterThan(0);
      expect(stats.byCategory).toBeDefined();
      expect(stats.byCategory.family).toBeGreaterThan(0);
    });

    it('devrait avoir plus de synonymes que de termes', () => {
      const stats = synonymsModule.getDictionaryStats();
      expect(stats.totalSynonyms).toBeGreaterThan(stats.totalTerms);
    });
  });

  describe('generateEnrichedSearchPatterns', () => {
    it('devrait générer des patterns SQL LIKE', () => {
      const patterns = synonymsModule.generateEnrichedSearchPatterns('rose');
      expect(patterns.every(p => p.startsWith('%') && p.endsWith('%'))).toBe(true);
    });

    it('devrait inclure le pattern original', () => {
      const patterns = synonymsModule.generateEnrichedSearchPatterns('rose');
      expect(patterns).toContain('%rose%');
    });
  });
});

describe('Synonymes Olfactifs - Familles complètes', () => {
  let synonymsModule: typeof import('../shared/olfactiveSynonyms');

  beforeEach(async () => {
    synonymsModule = await import('../shared/olfactiveSynonyms');
  });

  describe('Famille Florale', () => {
    it('devrait avoir des synonymes pour jasmin', () => {
      const synonyms = synonymsModule.getSynonyms('jasmin');
      expect(synonyms).toContain('jasmine');
    });

    it('devrait avoir des synonymes pour ylang', () => {
      const synonyms = synonymsModule.getSynonyms('ylang');
      expect(synonyms).toContain('ylang-ylang');
    });
  });

  describe('Famille Boisée', () => {
    it('devrait avoir des synonymes pour santal', () => {
      const synonyms = synonymsModule.getSynonyms('santal');
      expect(synonyms).toContain('sandalwood');
    });

    it('devrait avoir des synonymes pour oud', () => {
      const synonyms = synonymsModule.getSynonyms('oud');
      expect(synonyms).toContain('agarwood');
    });
  });

  describe('Famille Orientale', () => {
    it('devrait avoir des synonymes pour vanille', () => {
      const synonyms = synonymsModule.getSynonyms('vanille');
      expect(synonyms).toContain('vanilla');
    });

    it('devrait avoir des synonymes pour encens', () => {
      const synonyms = synonymsModule.getSynonyms('encens');
      expect(synonyms).toContain('frankincense');
    });
  });

  describe('Famille Épicée', () => {
    it('devrait avoir des synonymes pour cannelle', () => {
      const synonyms = synonymsModule.getSynonyms('cannelle');
      expect(synonyms).toContain('cinnamon');
    });

    it('devrait avoir des synonymes pour girofle', () => {
      const synonyms = synonymsModule.getSynonyms('girofle');
      expect(synonyms).toContain('clove');
    });
  });

  describe('Termes techniques', () => {
    it('devrait avoir des synonymes pour huile essentielle', () => {
      const synonyms = synonymsModule.getSynonyms('huile essentielle');
      expect(synonyms).toContain('essential oil');
    });
  });
});
