import { describe, it, expect } from 'vitest';
import { getAllBibliographyEntries } from './db';

describe('Session 07 Jan 2026 - Import des sources bibliographiques', () => {
  describe('Nombre total de sources', () => {
    it('devrait avoir au moins 30 sources bibliographiques', async () => {
      const result = await getAllBibliographyEntries({});
      expect(result.entries.length).toBeGreaterThanOrEqual(30);
    });
  });

  describe('Sources avec DOI', () => {
    it('devrait avoir des sources avec DOI', async () => {
      const result = await getAllBibliographyEntries({});
      const withDoi = result.entries.filter((e: any) => e.doi && e.doi.trim() !== '');
      expect(withDoi.length).toBeGreaterThan(0);
    });
  });

  describe('Sources avec PMID', () => {
    it('devrait avoir des sources avec PMID', async () => {
      const result = await getAllBibliographyEntries({});
      const withPmid = result.entries.filter((e: any) => e.pmid && e.pmid.trim() !== '');
      expect(withPmid.length).toBeGreaterThan(0);
    });
  });

  describe('Sources par domaine de recherche', () => {
    it('devrait avoir des sources dans plusieurs domaines', async () => {
      const result = await getAllBibliographyEntries({});
      const domains = new Set(result.entries.map((e: any) => e.researchDomain).filter(Boolean));
      expect(domains.size).toBeGreaterThanOrEqual(5);
    });
  });

  describe('Sources spécifiques importées', () => {
    it('devrait trouver Russo 2011 (Entourage Effect)', async () => {
      const result = await getAllBibliographyEntries({ search: 'russo2011' });
      expect(result.entries.length).toBeGreaterThan(0);
    });

    it('devrait trouver Marchini 2014 (Hashishene)', async () => {
      const result = await getAllBibliographyEntries({ search: 'marchini2014' });
      expect(result.entries.length).toBeGreaterThan(0);
    });

    it('devrait trouver des sources AromaDb', async () => {
      const result = await getAllBibliographyEntries({ search: 'aromadb' });
      expect(result.entries.length).toBeGreaterThan(0);
    });

    it('devrait trouver des sources M2OR', async () => {
      const result = await getAllBibliographyEntries({ search: 'm2or' });
      expect(result.entries.length).toBeGreaterThan(0);
    });
  });

  describe('Types de sources', () => {
    it('devrait avoir des articles scientifiques', async () => {
      const result = await getAllBibliographyEntries({ entryType: 'article' });
      expect(result.entries.length).toBeGreaterThan(0);
    });

    it('devrait avoir des sources en ligne', async () => {
      const result = await getAllBibliographyEntries({ entryType: 'online' });
      expect(result.entries.length).toBeGreaterThan(0);
    });
  });

  describe('Domaines de recherche couverts', () => {
    it('devrait avoir des sources en botanique', async () => {
      const result = await getAllBibliographyEntries({ researchDomain: 'botanique' });
      expect(result.entries.length).toBeGreaterThan(0);
    });

    it('devrait avoir des sources en chimie olfactive', async () => {
      const result = await getAllBibliographyEntries({ researchDomain: 'chimie_olfactive' });
      expect(result.entries.length).toBeGreaterThan(0);
    });

    it('devrait avoir des sources en méthodologie', async () => {
      const result = await getAllBibliographyEntries({ researchDomain: 'methodologie' });
      expect(result.entries.length).toBeGreaterThan(0);
    });
  });
});


// Tests supplémentaires pour le pack Niche Innovations (Session 07 Jan 2026 - Phase 2)
describe('Session 07 Jan 2026 - Import Pack Niche Innovations', () => {
  describe('Nombre total après import', () => {
    it('devrait avoir au moins 365 sources bibliographiques après import', async () => {
      const result = await getAllBibliographyEntries({});
      expect(result.entries.length).toBeGreaterThanOrEqual(365);
    });
  });

  describe('Nouvelles sources OMX', () => {
    it('devrait avoir des sources OMX (Omics/Data)', async () => {
      const result = await getAllBibliographyEntries({ search: 'OMX-' });
      expect(result.entries.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Nouvelles sources DAT', () => {
    it('devrait avoir des sources DAT (Data Infrastructure)', async () => {
      const result = await getAllBibliographyEntries({ search: 'DAT-' });
      expect(result.entries.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Nouvelles sources CHEM', () => {
    it('devrait avoir des sources CHEM (Chemistry)', async () => {
      const result = await getAllBibliographyEntries({ search: 'CHEM-' });
      expect(result.entries.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Nouvelles sources TAX', () => {
    it('devrait avoir des sources TAX (Taxonomy)', async () => {
      const result = await getAllBibliographyEntries({ search: 'TAX-' });
      expect(result.entries.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Nouvelles sources OLF', () => {
    it('devrait avoir des sources OLF (Olfaction)', async () => {
      const result = await getAllBibliographyEntries({ search: 'OLF-' });
      expect(result.entries.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Nouvelles sources BIO', () => {
    it('devrait avoir des sources BIO (Biotech)', async () => {
      const result = await getAllBibliographyEntries({ search: 'BIO-' });
      expect(result.entries.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Nouvelles sources DIG', () => {
    it('devrait avoir des sources DIG (Digital Smell)', async () => {
      const result = await getAllBibliographyEntries({ search: 'DIG-' });
      expect(result.entries.length).toBeGreaterThanOrEqual(1);
    });
  });
});
