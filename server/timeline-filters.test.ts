import { describe, it, expect } from 'vitest';
import * as db from './db';

// Définition des continents et leurs régions associées (doit correspondre au frontend)
const continentMapping: Record<string, { name: string; regions: string[] }> = {
  EUROPE: {
    name: "Europe",
    regions: ["GREECE", "ROME", "EUROPE_MEDIEVAL", "ITALY_RENAISSANCE", "GRASSE", "EUROPE_INDUSTRIAL", "FRANCE_MODERN", "GLOBAL"],
  },
  ASIA: {
    name: "Asie",
    regions: ["MESOPOTAMIA", "INDIA", "CHINA", "ARAB_WORLD", "CENTRAL_ASIA", "INDIA_PACIFIC", "SOUTH_ARABIA"],
  },
  AFRICA: {
    name: "Afrique",
    regions: ["EGYPT"],
  },
  AMERICAS: {
    name: "Amériques",
    regions: ["AMERICAS", "HAITI_REUNION"],
  },
};

// Définition des périodes historiques
const periodRanges: Record<string, { name: string; startYear: number; endYear: number }> = {
  ANTIQUITY: {
    name: "Antiquité",
    startYear: -5000,
    endYear: 500,
  },
  MEDIEVAL: {
    name: "Moyen Âge",
    startYear: 500,
    endYear: 1500,
  },
  MODERN: {
    name: "Époque moderne",
    startYear: 1500,
    endYear: 1900,
  },
  CONTEMPORARY: {
    name: "Époque contemporaine",
    startYear: 1900,
    endYear: 2100,
  },
};

describe('Timeline Filters - Geographic Filtering', () => {
  describe('Data Availability', () => {
    it('should have heritage timeline entries', async () => {
      const entries = await db.getAllHeritageTimelineEntries();
      expect(entries.length).toBeGreaterThan(0);
    });

    it('should have at least 20 heritage timeline entries', async () => {
      const entries = await db.getAllHeritageTimelineEntries();
      expect(entries.length).toBeGreaterThanOrEqual(20);
    });
  });

  describe('Continent Filtering', () => {
    it('should filter entries by European regions', async () => {
      const entries = await db.getAllHeritageTimelineEntries();
      const europeanRegions = continentMapping.EUROPE.regions;
      const filtered = entries.filter(e => e.regionCode && europeanRegions.includes(e.regionCode));
      
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach(entry => {
        expect(europeanRegions).toContain(entry.regionCode);
      });
    });

    it('should filter entries by Asian regions', async () => {
      const entries = await db.getAllHeritageTimelineEntries();
      const asianRegions = continentMapping.ASIA.regions;
      const filtered = entries.filter(e => e.regionCode && asianRegions.includes(e.regionCode));
      
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach(entry => {
        expect(asianRegions).toContain(entry.regionCode);
      });
    });

    it('should filter entries by African regions', async () => {
      const entries = await db.getAllHeritageTimelineEntries();
      const africanRegions = continentMapping.AFRICA.regions;
      const filtered = entries.filter(e => e.regionCode && africanRegions.includes(e.regionCode));
      
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach(entry => {
        expect(africanRegions).toContain(entry.regionCode);
      });
    });

    it('should filter entries by American regions', async () => {
      const entries = await db.getAllHeritageTimelineEntries();
      const americanRegions = continentMapping.AMERICAS.regions;
      const filtered = entries.filter(e => e.regionCode && americanRegions.includes(e.regionCode));
      
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach(entry => {
        expect(americanRegions).toContain(entry.regionCode);
      });
    });
  });

  describe('Period Filtering', () => {
    it('should filter entries from Antiquity (-5000 to 500)', async () => {
      const entries = await db.getAllHeritageTimelineEntries();
      const range = periodRanges.ANTIQUITY;
      const filtered = entries.filter(e => 
        e.startYear !== null && 
        e.startYear >= range.startYear && 
        e.startYear < range.endYear
      );
      
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach(entry => {
        expect(entry.startYear).toBeGreaterThanOrEqual(range.startYear);
        expect(entry.startYear).toBeLessThan(range.endYear);
      });
    });

    it('should filter entries from Medieval period (500 to 1500)', async () => {
      const entries = await db.getAllHeritageTimelineEntries();
      const range = periodRanges.MEDIEVAL;
      const filtered = entries.filter(e => 
        e.startYear !== null && 
        e.startYear >= range.startYear && 
        e.startYear < range.endYear
      );
      
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach(entry => {
        expect(entry.startYear).toBeGreaterThanOrEqual(range.startYear);
        expect(entry.startYear).toBeLessThan(range.endYear);
      });
    });

    it('should filter entries from Modern period (1500 to 1900)', async () => {
      const entries = await db.getAllHeritageTimelineEntries();
      const range = periodRanges.MODERN;
      const filtered = entries.filter(e => 
        e.startYear !== null && 
        e.startYear >= range.startYear && 
        e.startYear < range.endYear
      );
      
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach(entry => {
        expect(entry.startYear).toBeGreaterThanOrEqual(range.startYear);
        expect(entry.startYear).toBeLessThan(range.endYear);
      });
    });

    it('should filter entries from Contemporary period (1900 to 2100)', async () => {
      const entries = await db.getAllHeritageTimelineEntries();
      const range = periodRanges.CONTEMPORARY;
      const filtered = entries.filter(e => 
        e.startYear !== null && 
        e.startYear >= range.startYear && 
        e.startYear < range.endYear
      );
      
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach(entry => {
        expect(entry.startYear).toBeGreaterThanOrEqual(range.startYear);
        expect(entry.startYear).toBeLessThan(range.endYear);
      });
    });
  });

  describe('Chemotype Class Filtering', () => {
    it('should have entries with terpene class', async () => {
      const entries = await db.getHeritageTimelineByChemotypeClass('terpene');
      expect(entries.length).toBeGreaterThan(0);
    });

    it('should have entries with alkaloid class', async () => {
      const entries = await db.getHeritageTimelineByChemotypeClass('alkaloid');
      expect(entries.length).toBeGreaterThan(0);
    });

    it('should have entries with phenolic class', async () => {
      const entries = await db.getHeritageTimelineByChemotypeClass('phenolic');
      expect(entries.length).toBeGreaterThan(0);
    });

    it('should have multiple chemotype classes', async () => {
      const entries = await db.getAllHeritageTimelineEntries();
      const classes = new Set(entries.map(e => e.chemotypeClass).filter(Boolean));
      expect(classes.size).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Combined Filtering', () => {
    it('should filter by continent AND period', async () => {
      const entries = await db.getAllHeritageTimelineEntries();
      const europeanRegions = continentMapping.EUROPE.regions;
      const antiquityRange = periodRanges.ANTIQUITY;
      
      const filtered = entries.filter(e => 
        e.regionCode && 
        europeanRegions.includes(e.regionCode) &&
        e.startYear !== null &&
        e.startYear >= antiquityRange.startYear &&
        e.startYear < antiquityRange.endYear
      );
      
      filtered.forEach(entry => {
        expect(europeanRegions).toContain(entry.regionCode);
        expect(entry.startYear).toBeGreaterThanOrEqual(antiquityRange.startYear);
        expect(entry.startYear).toBeLessThan(antiquityRange.endYear);
      });
    });

    it('should filter by chemotype AND period', async () => {
      const entries = await db.getAllHeritageTimelineEntries();
      const modernRange = periodRanges.MODERN;
      
      const filtered = entries.filter(e => 
        e.chemotypeClass === 'terpene' &&
        e.startYear !== null &&
        e.startYear >= modernRange.startYear &&
        e.startYear < modernRange.endYear
      );
      
      filtered.forEach(entry => {
        expect(entry.chemotypeClass).toBe('terpene');
        expect(entry.startYear).toBeGreaterThanOrEqual(modernRange.startYear);
        expect(entry.startYear).toBeLessThan(modernRange.endYear);
      });
    });
  });

  describe('Geographic Coordinates', () => {
    it('should have latitude and longitude for map display', async () => {
      const entries = await db.getAllHeritageTimelineEntries();
      const withCoords = entries.filter(e => e.latitude !== null && e.longitude !== null);
      
      // Au moins 80% des entrées doivent avoir des coordonnées
      expect(withCoords.length / entries.length).toBeGreaterThanOrEqual(0.8);
    });

    it('should have valid latitude values (-90 to 90)', async () => {
      const entries = await db.getAllHeritageTimelineEntries();
      
      entries.forEach(entry => {
        if (entry.latitude !== null) {
          const lat = typeof entry.latitude === 'string' ? parseFloat(entry.latitude) : entry.latitude;
          expect(lat).toBeGreaterThanOrEqual(-90);
          expect(lat).toBeLessThanOrEqual(90);
        }
      });
    });

    it('should have valid longitude values (-180 to 180)', async () => {
      const entries = await db.getAllHeritageTimelineEntries();
      
      entries.forEach(entry => {
        if (entry.longitude !== null) {
          const lng = typeof entry.longitude === 'string' ? parseFloat(entry.longitude) : entry.longitude;
          expect(lng).toBeGreaterThanOrEqual(-180);
          expect(lng).toBeLessThanOrEqual(180);
        }
      });
    });
  });
});
