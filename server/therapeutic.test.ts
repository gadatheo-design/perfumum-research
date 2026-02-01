import { describe, it, expect } from 'vitest';
import {
  getTherapeuticDataByCAS,
  getTherapeuticDataByName,
  getTherapeuticData,
  getTherapeuticStats,
  searchByProperty,
  getAllProperties,
  formatTherapeuticProperties
} from './therapeutic';

describe('Therapeutic Service', () => {
  describe('getTherapeuticStats', () => {
    it('should return statistics with enriched database', () => {
      const stats = getTherapeuticStats();
      expect(stats.totalCompounds).toBeGreaterThan(150); // Enriched from 53 to 176+
      expect(stats.withProperties).toBeGreaterThan(0);
    });

    it('should have most compounds with properties', () => {
      const stats = getTherapeuticStats();
      expect(stats.withProperties).toBe(stats.totalCompounds);
    });
  });

  describe('getTherapeuticDataByCAS', () => {
    it('should find Linalool by CAS (78-70-6)', () => {
      const data = getTherapeuticDataByCAS('78-70-6');
      expect(data).toBeDefined();
      expect(data?.name).toBe('linalool');
      expect(data?.properties).toContain('Anxiolytique');
    });

    it('should find Cannabidiol by CAS (13956-29-1)', () => {
      const data = getTherapeuticDataByCAS('13956-29-1');
      expect(data).toBeDefined();
      expect(data?.name).toBe('cannabidiol');
      expect(data?.properties).toContain('Anxiolytique');
    });

    it('should find Quercetin by CAS (117-39-5)', () => {
      const data = getTherapeuticDataByCAS('117-39-5');
      expect(data).toBeDefined();
      expect(data?.name).toBe('quercetin');
    });

    it('should return null for unknown CAS', () => {
      const data = getTherapeuticDataByCAS('999-99-9');
      expect(data).toBeNull();
    });
  });

  describe('getTherapeuticDataByName', () => {
    it('should find by English name', () => {
      const data = getTherapeuticDataByName('linalool');
      expect(data).toBeDefined();
      expect(data?.casNumber).toBe('78-70-6');
    });

    it('should find by French name (limonène)', () => {
      const data = getTherapeuticDataByName('limonène');
      expect(data).toBeDefined();
    });

    it('should find by French name (eugénol)', () => {
      const data = getTherapeuticDataByName('eugénol');
      expect(data).toBeDefined();
      expect(data?.name).toBe('eugenol');
    });

    it('should be case insensitive', () => {
      const data1 = getTherapeuticDataByName('LINALOOL');
      const data2 = getTherapeuticDataByName('linalool');
      expect(data1).toEqual(data2);
    });

    it('should return null for unknown name', () => {
      const data = getTherapeuticDataByName('unknownmolecule');
      expect(data).toBeNull();
    });
  });

  describe('getTherapeuticData', () => {
    it('should prefer CAS lookup when both provided', () => {
      const data = getTherapeuticData('wrongname', '78-70-6');
      expect(data).toBeDefined();
      expect(data?.name).toBe('linalool');
    });

    it('should fallback to name when CAS not found', () => {
      const data = getTherapeuticData('linalool', '999-99-9');
      expect(data).toBeDefined();
      expect(data?.name).toBe('linalool');
    });
  });

  describe('searchByProperty', () => {
    it('should find compounds with Anxiolytique property', () => {
      const results = searchByProperty('Anxiolytique');
      expect(results.length).toBeGreaterThan(0);
      results.forEach(r => {
        expect(r.properties.some(p => p.toLowerCase().includes('anxiolytique'))).toBe(true);
      });
    });

    it('should find compounds with Anti-inflammatoire property', () => {
      const results = searchByProperty('Anti-inflammatoire');
      expect(results.length).toBeGreaterThan(5);
    });

    it('should find compounds with Antimicrobien property', () => {
      const results = searchByProperty('Antimicrobien');
      expect(results.length).toBeGreaterThan(10);
    });

    it('should be case insensitive', () => {
      const results1 = searchByProperty('anxiolytique');
      const results2 = searchByProperty('ANXIOLYTIQUE');
      expect(results1.length).toBe(results2.length);
    });
  });

  describe('getAllProperties', () => {
    it('should return unique properties', () => {
      const properties = getAllProperties();
      expect(properties.length).toBeGreaterThan(20);
      // Check for duplicates
      const uniqueSet = new Set(properties);
      expect(uniqueSet.size).toBe(properties.length);
    });

    it('should include common therapeutic properties', () => {
      const properties = getAllProperties();
      expect(properties).toContain('Anxiolytique');
      expect(properties).toContain('Anti-inflammatoire');
      expect(properties).toContain('Antimicrobien');
    });
  });

  describe('formatTherapeuticProperties', () => {
    it('should format properties as comma-separated string', () => {
      const data = getTherapeuticDataByCAS('78-70-6');
      expect(data).toBeDefined();
      const formatted = formatTherapeuticProperties(data!);
      expect(typeof formatted).toBe('string');
      expect(formatted).toContain('Anxiolytique');
    });
  });

  describe('Enriched compounds coverage', () => {
    it('should have cannabinoids in database', () => {
      expect(getTherapeuticDataByCAS('13956-29-1')).toBeDefined(); // CBD
      expect(getTherapeuticDataByCAS('20675-51-8')).toBeDefined(); // CBG
      expect(getTherapeuticDataByCAS('30964-13-7')).toBeDefined(); // CBN
    });

    it('should have alkaloids in database', () => {
      expect(getTherapeuticDataByCAS('54-11-5')).toBeDefined(); // Nicotine
      expect(getTherapeuticDataByCAS('58-08-2')).toBeDefined(); // Caffeine
      expect(getTherapeuticDataByCAS('83-67-0')).toBeDefined(); // Theobromine
    });

    it('should have flavonoids in database', () => {
      expect(getTherapeuticDataByCAS('117-39-5')).toBeDefined(); // Quercetin
      expect(getTherapeuticDataByCAS('520-18-3')).toBeDefined(); // Kaempferol
      expect(getTherapeuticDataByCAS('520-36-5')).toBeDefined(); // Apigenin
    });

    it('should have sesquiterpenes in database', () => {
      expect(getTherapeuticDataByCAS('87-44-5')).toBeDefined(); // beta-Caryophyllene
      expect(getTherapeuticDataByCAS('6753-98-6')).toBeDefined(); // alpha-Humulene
      expect(getTherapeuticDataByCAS('515-69-5')).toBeDefined(); // Bisabolol
    });
  });
});
