import { describe, it, expect } from 'vitest';
import * as db from './db';

describe('Heritage Timeline Functions', () => {
  describe('getAllHeritageTimelineEntries', () => {
    it('should return an array of timeline entries', async () => {
      const result = await db.getAllHeritageTimelineEntries();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getHeritageTimelineByPeriod', () => {
    it('should return an array when querying by period', async () => {
      const result = await db.getHeritageTimelineByPeriod('ancient');
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getHeritageTimelineByRegion', () => {
    it('should return an array when querying by region', async () => {
      const result = await db.getHeritageTimelineByRegion('mediterranean');
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getHeritageTimelineByChemotypeClass', () => {
    it('should return an array when querying by chemotype class', async () => {
      const result = await db.getHeritageTimelineByChemotypeClass('terpene');
      expect(Array.isArray(result)).toBe(true);
    });
  });
});

describe('Evidence-Bibliography Links Functions', () => {
  describe('getAllEvidenceBibliographyLinks', () => {
    it('should return an array of links', async () => {
      const result = await db.getAllEvidenceBibliographyLinks();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getEvidenceBibliographyLinksByEvidence', () => {
    it('should return an array when querying by evidence ID', async () => {
      const result = await db.getEvidenceBibliographyLinksByEvidence(1);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getEvidenceBibliographyLinksByBibliography', () => {
    it('should return an array when querying by bibliography ID', async () => {
      const result = await db.getEvidenceBibliographyLinksByBibliography(1);
      expect(Array.isArray(result)).toBe(true);
    });
  });
});

describe('Molecule Linking Functions', () => {
  describe('getUnlinkedLostMolecules', () => {
    it('should return an array of unlinked molecules', async () => {
      const result = await db.getUnlinkedLostMolecules();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getLinkedLostMolecules', () => {
    it('should return an array of linked molecules', async () => {
      const result = await db.getLinkedLostMolecules();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('findPotentialMoleculeMatches', () => {
    it('should return an array of potential matches', async () => {
      // Get first unlinked molecule to test with
      const unlinked = await db.getUnlinkedLostMolecules();
      if (unlinked.length > 0) {
        const result = await db.findPotentialMoleculeMatches(unlinked[0].id);
        expect(Array.isArray(result)).toBe(true);
        // Each match should have molecule, matchType, and matchScore
        if (result.length > 0) {
          expect(result[0]).toHaveProperty('molecule');
          expect(result[0]).toHaveProperty('matchType');
          expect(result[0]).toHaveProperty('matchScore');
        }
      }
    });
  });

  describe('getMoleculeWithLostMolecules', () => {
    it('should return molecule with linked lost molecules when they exist', async () => {
      // Get a molecule that might have linked lost molecules
      const linked = await db.getLinkedLostMolecules();
      if (linked.length > 0 && linked[0].linkedMoleculeId) {
        const result = await db.getMoleculeWithLostMolecules(linked[0].linkedMoleculeId);
        if (result) {
          expect(result).toHaveProperty('molecule');
          expect(result).toHaveProperty('lostMolecules');
          expect(Array.isArray(result.lostMolecules)).toBe(true);
        }
      }
    });
  });
});

describe('Bibliography Matching Functions', () => {
  describe('findBibliographyMatchesForEvidence', () => {
    it('should return an array of potential bibliography matches', async () => {
      // Get first evidence to test with
      const evidence = await db.getAllMoleculeEvidence();
      if (evidence.length > 0) {
        const result = await db.findBibliographyMatchesForEvidence(evidence[0].id);
        expect(Array.isArray(result)).toBe(true);
        if (result.length > 0) {
          expect(result[0]).toHaveProperty('entry');
          expect(result[0]).toHaveProperty('matchType');
          expect(result[0]).toHaveProperty('matchScore');
        }
      }
    });
  });

  describe('getHeritageBibliographyStats', () => {
    it('should return bibliography statistics', async () => {
      const result = await db.getHeritageBibliographyStats();
      expect(result).toHaveProperty('totalReferences');
      expect(result).toHaveProperty('linkedToEvidence');
      expect(typeof result.totalReferences).toBe('number');
      expect(typeof result.linkedToEvidence).toBe('number');
    });
  });
});


// Additional tests for populated data verification
describe('Heritage Timeline Data Population Verification', () => {
  it('should have at least 15 timeline entries after population', async () => {
    const entries = await db.getAllHeritageTimelineEntries();
    expect(entries.length).toBeGreaterThanOrEqual(15);
  });

  it('should have entries covering ancient period (before 500 CE)', async () => {
    const entries = await db.getAllHeritageTimelineEntries();
    const ancientEntries = entries.filter((e: any) => e.startYear < 500);
    expect(ancientEntries.length).toBeGreaterThanOrEqual(5);
  });

  it('should have entries covering medieval period (500-1500 CE)', async () => {
    const entries = await db.getAllHeritageTimelineEntries();
    const medievalEntries = entries.filter((e: any) => e.startYear >= 500 && e.startYear < 1500);
    expect(medievalEntries.length).toBeGreaterThanOrEqual(2);
  });

  it('should have entries covering modern period (1500+ CE)', async () => {
    const entries = await db.getAllHeritageTimelineEntries();
    const modernEntries = entries.filter((e: any) => e.startYear >= 1500);
    expect(modernEntries.length).toBeGreaterThanOrEqual(5);
  });

  it('should have entries with geographic coordinates for map display', async () => {
    const entries = await db.getAllHeritageTimelineEntries();
    const entriesWithCoords = entries.filter((e: any) => 
      e.latitude !== null && e.longitude !== null
    );
    // At least 80% should have coordinates
    expect(entriesWithCoords.length / entries.length).toBeGreaterThanOrEqual(0.8);
  });
});

describe('Auto-linking Bibliography Verification', () => {
  it('should have at least 50 evidence-bibliography links after auto-linking', async () => {
    const links = await db.getAllEvidenceBibliographyLinks();
    expect(links.length).toBeGreaterThanOrEqual(50);
  });

  it('should have multiple link types (primary, secondary, methodology)', async () => {
    const links = await db.getAllEvidenceBibliographyLinks();
    const linkTypes = new Set(links.map((l: any) => l.linkType));
    expect(linkTypes.size).toBeGreaterThanOrEqual(2);
  });
});
