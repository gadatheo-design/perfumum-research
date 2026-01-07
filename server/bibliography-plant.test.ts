import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as db from './db';

// Mock the database connection
vi.mock('drizzle-orm/mysql2', () => ({
  drizzle: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    offset: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue([]),
  })),
}));

describe('Bibliography Plant Functions', () => {
  describe('exportToBibTeX', () => {
    it('should generate valid BibTeX format for a single entry', () => {
      const entry = {
        id: 1,
        entryKey: 'smith2024cannabis',
        entryType: 'article',
        title: 'Terpene profiles in Cannabis sativa L.',
        authors: 'Smith, J. and Doe, A.',
        year: 2024,
        journal: 'Journal of Natural Products',
        volume: '87',
        pages: '1234-1245',
        doi: '10.1021/acs.jnatprod.2024',
        keywords: ['cannabis', 'terpenes'],
      };

      const bibtex = db.exportToBibTeX([entry as any]);
      
      expect(bibtex).toContain('@article{smith2024cannabis,');
      expect(bibtex).toContain('title = {Terpene profiles in Cannabis sativa L.}');
      expect(bibtex).toContain('author = {Smith, J. and Doe, A.}');
      expect(bibtex).toContain('year = {2024}');
      expect(bibtex).toContain('journal = {Journal of Natural Products}');
      expect(bibtex).toContain('volume = {87}');
      expect(bibtex).toContain('pages = {1234-1245}');
      expect(bibtex).toContain('doi = {10.1021/acs.jnatprod.2024}');
      expect(bibtex).toContain('keywords = {cannabis, terpenes}');
    });

    it('should generate valid BibTeX for multiple entries', () => {
      const entries = [
        {
          id: 1,
          entryKey: 'smith2024',
          entryType: 'article',
          title: 'First Article',
          authors: 'Smith, J.',
          year: 2024,
        },
        {
          id: 2,
          entryKey: 'doe2023',
          entryType: 'book',
          title: 'Second Book',
          authors: 'Doe, A.',
          year: 2023,
          publisher: 'Academic Press',
        },
      ];

      const bibtex = db.exportToBibTeX(entries as any);
      
      expect(bibtex).toContain('@article{smith2024,');
      expect(bibtex).toContain('@book{doe2023,');
      expect(bibtex).toContain('publisher = {Academic Press}');
      // Check entries are separated by double newline
      expect(bibtex.split('\n\n').length).toBe(2);
    });

    it('should handle empty entries array', () => {
      const bibtex = db.exportToBibTeX([]);
      expect(bibtex).toBe('');
    });

    it('should handle entries with missing optional fields', () => {
      const entry = {
        id: 1,
        entryKey: 'minimal2024',
        entryType: 'misc',
        title: 'Minimal Entry',
      };

      const bibtex = db.exportToBibTeX([entry as any]);
      
      expect(bibtex).toContain('@misc{minimal2024,');
      expect(bibtex).toContain('title = {Minimal Entry}');
      expect(bibtex).not.toContain('author =');
      expect(bibtex).not.toContain('year =');
    });
  });

  describe('exportToAPA', () => {
    it('should generate valid APA format for an article', () => {
      const entry = {
        id: 1,
        entryKey: 'smith2024',
        entryType: 'article',
        title: 'Terpene profiles',
        authors: 'Smith, J.',
        year: 2024,
        journal: 'Journal of Natural Products',
        volume: '87',
        number: '3',
        pages: '1234-1245',
        doi: '10.1021/acs.jnatprod.2024',
      };

      const apa = db.exportToAPA(entry as any);
      
      expect(apa).toContain('Smith, J. (2024)');
      expect(apa).toContain('Terpene profiles');
      expect(apa).toContain('*Journal of Natural Products*');
      expect(apa).toContain('87');
      expect(apa).toContain('(3)');
      expect(apa).toContain('1234-1245');
      expect(apa).toContain('https://doi.org/10.1021/acs.jnatprod.2024');
    });

    it('should handle book entries', () => {
      const entry = {
        id: 1,
        entryKey: 'doe2023',
        entryType: 'book',
        title: 'Cannabis Chemistry',
        authors: 'Doe, A.',
        year: 2023,
        publisher: 'Academic Press',
      };

      const apa = db.exportToAPA(entry as any);
      
      expect(apa).toContain('Doe, A. (2023)');
      expect(apa).toContain('Cannabis Chemistry');
      expect(apa).toContain('Academic Press');
    });

    it('should handle entries with URL instead of DOI', () => {
      const entry = {
        id: 1,
        entryKey: 'web2024',
        entryType: 'online',
        title: 'Online Resource',
        authors: 'Web Author',
        year: 2024,
        url: 'https://example.com/resource',
      };

      const apa = db.exportToAPA(entry as any);
      
      expect(apa).toContain('https://example.com/resource');
      expect(apa).not.toContain('https://doi.org/');
    });

    it('should handle missing author and year', () => {
      const entry = {
        id: 1,
        entryKey: 'unknown',
        entryType: 'misc',
        title: 'Unknown Source',
      };

      const apa = db.exportToAPA(entry as any);
      
      expect(apa).toContain('Unknown (n.d.)');
      expect(apa).toContain('Unknown Source');
    });
  });

  describe('exportToChicago', () => {
    it('should generate valid Chicago format for an article', () => {
      const entry = {
        id: 1,
        entryKey: 'smith2024',
        entryType: 'article',
        title: 'Terpene profiles',
        authors: 'Smith, J.',
        year: 2024,
        journal: 'Journal of Natural Products',
        volume: '87',
        number: '3',
        pages: '1234-1245',
        doi: '10.1021/acs.jnatprod.2024',
      };

      const chicago = db.exportToChicago(entry as any);
      
      expect(chicago).toContain('Smith, J.');
      expect(chicago).toContain('"Terpene profiles."');
      expect(chicago).toContain('*Journal of Natural Products*');
      expect(chicago).toContain('(2024)');
      expect(chicago).toContain('https://doi.org/10.1021/acs.jnatprod.2024');
    });
  });

  describe('parseBibTeX', () => {
    it('should parse a valid BibTeX entry', () => {
      const bibtexString = `@article{smith2024,
  title = {Test Article},
  author = {Smith, John},
  year = {2024},
  journal = {Test Journal}
}`;

      const entries = db.parseBibTeX(bibtexString);
      
      expect(entries).toHaveLength(1);
      expect(entries[0].entryKey).toBe('smith2024');
      expect(entries[0].title).toBe('Test Article');
      expect(entries[0].authors).toBe('Smith, John');
      expect(entries[0].year).toBe(2024);
      expect(entries[0].journal).toBe('Test Journal');
    });

    it('should parse multiple BibTeX entries', () => {
      const bibtexString = `@article{first2024,
  title = {First Article},
  author = {First Author}
}

@book{second2023,
  title = {Second Book},
  author = {Second Author}
}`;

      const entries = db.parseBibTeX(bibtexString);
      
      expect(entries).toHaveLength(2);
      expect(entries[0].entryKey).toBe('first2024');
      expect(entries[1].entryKey).toBe('second2023');
    });

    it('should handle empty BibTeX string', () => {
      const entries = db.parseBibTeX('');
      expect(entries).toHaveLength(0);
    });
  });
});
