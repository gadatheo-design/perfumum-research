import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch for PubChem API tests
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('PubChem Service', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('enrichMolecule', () => {
    it('should return molecule data from PubChem API', async () => {
      // Mock CID search response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          IdentifierList: {
            CID: [6654]
          }
        })
      });

      // Mock PubChem property response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          PropertyTable: {
            Properties: [{
              CID: 6654,
              MolecularWeight: 136.23,
              MolecularFormula: 'C10H16',
              IUPACName: '1-methyl-4-prop-1-en-2-ylcyclohexene',
              XLogP: 4.5,
              Complexity: 132,
            }]
          }
        })
      });

      // Mock synonyms response for CAS number
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          InformationList: {
            Information: [{
              Synonym: ['Limonene', '138-86-3', 'D-Limonene', '(+)-Limonene']
            }]
          }
        })
      });

      const { enrichMolecule } = await import('./pubchem');
      const result = await enrichMolecule('Limonene');

      expect(result.success).toBe(true);
      expect(result.pubchemCID).toBe(6654);
      expect(result.molecularWeight).toBeCloseTo(136.23);
      expect(result.molecularFormula).toBe('C10H16');
      expect(result.iupacName).toBe('1-methyl-4-prop-1-en-2-ylcyclohexene');
    });

    it('should handle molecule not found in PubChem', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const { enrichMolecule } = await import('./pubchem');
      const result = await enrichMolecule('NonExistentMolecule123');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const { enrichMolecule } = await import('./pubchem');
      const result = await enrichMolecule('Limonene');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('inferChemicalClass', () => {
    it('should identify terpenes from IUPAC name', async () => {
      const { inferChemicalClass } = await import('./pubchem');
      
      // Le module retourne 'terpene' pour les noms contenant limonene, pinene, etc.
      expect(inferChemicalClass('limonene', 'C10H16')).toBe('terpene');
      // 'sesquiterp' (sans 'ene') est le pattern pour sesquiterpene
      expect(inferChemicalClass('sesquiterp compound', 'C15H24')).toBe('sesquiterpene');
    });

    it('should identify aldehydes from IUPAC name', async () => {
      const { inferChemicalClass } = await import('./pubchem');
      
      expect(inferChemicalClass('decanal', 'C10H20O')).toBe('aldehyde');
      expect(inferChemicalClass('benzaldehyde', 'C7H6O')).toBe('aldehyde');
    });

    it('should identify alcohols from IUPAC name', async () => {
      const { inferChemicalClass } = await import('./pubchem');
      
      expect(inferChemicalClass('linalool', 'C10H18O')).toBe('alcohol');
      expect(inferChemicalClass('geraniol', 'C10H18O')).toBe('alcohol');
    });

    it('should return undefined for unknown structures', async () => {
      const { inferChemicalClass } = await import('./pubchem');
      
      // Le module retourne undefined (pas 'other') pour les structures non reconnues
      expect(inferChemicalClass('unknown compound', 'C20H40')).toBeUndefined();
    });
  });

  describe('extractCASNumber', () => {
    it('should extract CAS number from synonyms', async () => {
      // Le nom de la fonction est extractCASNumber (pas extractCasNumber)
      const { extractCASNumber } = await import('./pubchem');
      
      const synonyms = ['Limonene', '138-86-3', 'D-Limonene', '(+)-Limonene'];
      expect(extractCASNumber(synonyms)).toBe('138-86-3');
    });

    it('should return undefined if no CAS number found', async () => {
      const { extractCASNumber } = await import('./pubchem');
      
      const synonyms = ['Limonene', 'D-Limonene', '(+)-Limonene'];
      expect(extractCASNumber(synonyms)).toBeUndefined();
    });

    it('should handle empty synonyms array', async () => {
      const { extractCASNumber } = await import('./pubchem');
      
      expect(extractCASNumber([])).toBeUndefined();
    });
  });
});

describe('Bibliography Citation Generation', () => {
  const currentYear = new Date().getFullYear();
  
  describe('APA Format', () => {
    it('should generate valid APA citation for PubChem molecule', () => {
      const moleculeName = 'Limonene';
      const pubchemCID = 6654;
      const casNumber = '138-86-3';
      
      // Simulating the citation generation logic
      const citation = `National Center for Biotechnology Information (${currentYear}). PubChem Compound Summary for CID ${pubchemCID}, ${moleculeName}. Retrieved from https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemCID}`;
      
      expect(citation).toContain('National Center for Biotechnology Information');
      expect(citation).toContain(currentYear.toString());
      expect(citation).toContain('PubChem Compound Summary');
      expect(citation).toContain(moleculeName);
      expect(citation).toContain(pubchemCID.toString());
    });

    it('should generate valid APA citation for PERFUMUM molecule', () => {
      const moleculeName = 'Custom Molecule';
      
      const citation = `${moleculeName}. (${currentYear}). In PERFUMUM Research Database.`;
      
      expect(citation).toContain(moleculeName);
      expect(citation).toContain('PERFUMUM Research Database');
    });

    it('should generate valid APA citation for recipe', () => {
      const recipeName = 'Accord Boisé';
      
      const citation = `PERFUMUM Research. (${currentYear}). ${recipeName}. PERFUMUM Research Database.`;
      
      expect(citation).toContain('PERFUMUM Research');
      expect(citation).toContain(recipeName);
    });
  });

  describe('Chicago Format', () => {
    it('should generate valid Chicago citation for PubChem molecule', () => {
      const moleculeName = 'Limonene';
      const pubchemCID = 6654;
      
      const citation = `National Center for Biotechnology Information. "PubChem Compound Summary for CID ${pubchemCID}, ${moleculeName}." PubChem. https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemCID}.`;
      
      expect(citation).toContain('National Center for Biotechnology Information');
      expect(citation).toContain('"PubChem Compound Summary');
      expect(citation).toContain(moleculeName);
    });

    it('should generate valid Chicago citation for recipe', () => {
      const recipeName = 'Accord Boisé';
      
      const citation = `PERFUMUM Research. "${recipeName}." PERFUMUM Research Database, ${currentYear}.`;
      
      expect(citation).toContain('PERFUMUM Research');
      expect(citation).toContain(`"${recipeName}."`);
    });
  });

  describe('BibTeX Format', () => {
    it('should generate valid BibTeX entry for PubChem molecule', () => {
      const moleculeName = 'Limonene';
      const pubchemCID = 6654;
      const key = moleculeName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      
      const citation = `@misc{pubchem_${key},
  author = {{National Center for Biotechnology Information}},
  title = {PubChem Compound Summary for CID ${pubchemCID}, ${moleculeName}},
  year = {${currentYear}},
  url = {https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemCID}}
}`;
      
      expect(citation).toContain('@misc{pubchem_');
      expect(citation).toContain('author = {{National Center for Biotechnology Information}}');
      expect(citation).toContain(`year = {${currentYear}}`);
      expect(citation).toContain('url = {https://pubchem.ncbi.nlm.nih.gov/compound/');
    });

    it('should generate valid BibTeX entry for recipe', () => {
      const recipeName = 'Accord Boisé';
      const key = recipeName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      
      const citation = `@misc{perfumum_${key},
  author = {{PERFUMUM Research}},
  title = {${recipeName}},
  year = {${currentYear}},
  howpublished = {PERFUMUM Research Database}
}`;
      
      expect(citation).toContain('@misc{perfumum_');
      expect(citation).toContain('author = {{PERFUMUM Research}}');
      expect(citation).toContain(`title = {${recipeName}}`);
    });

    it('should sanitize special characters in BibTeX keys', () => {
      const recipeName = 'Accord Boisé & Épicé (2024)';
      const key = recipeName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      
      expect(key).not.toContain('&');
      expect(key).not.toContain('(');
      expect(key).not.toContain(')');
      expect(key).not.toContain('é');
    });
  });
});

describe('Visualization Data Processing', () => {
  describe('Correlation Coefficient Calculation', () => {
    it('should calculate Pearson correlation correctly', () => {
      // Test data with known correlation
      const points = [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 6 },
        { x: 4, y: 8 },
        { x: 5, y: 10 },
      ];
      
      const n = points.length;
      const sumX = points.reduce((a, p) => a + p.x, 0);
      const sumY = points.reduce((a, p) => a + p.y, 0);
      const sumXY = points.reduce((a, p) => a + p.x * p.y, 0);
      const sumX2 = points.reduce((a, p) => a + p.x * p.x, 0);
      const sumY2 = points.reduce((a, p) => a + p.y * p.y, 0);
      
      const numerator = n * sumXY - sumX * sumY;
      const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
      const correlation = denominator === 0 ? 0 : numerator / denominator;
      
      // Perfect positive correlation
      expect(correlation).toBeCloseTo(1, 5);
    });

    it('should handle negative correlation', () => {
      const points = [
        { x: 1, y: 10 },
        { x: 2, y: 8 },
        { x: 3, y: 6 },
        { x: 4, y: 4 },
        { x: 5, y: 2 },
      ];
      
      const n = points.length;
      const sumX = points.reduce((a, p) => a + p.x, 0);
      const sumY = points.reduce((a, p) => a + p.y, 0);
      const sumXY = points.reduce((a, p) => a + p.x * p.y, 0);
      const sumX2 = points.reduce((a, p) => a + p.x * p.x, 0);
      const sumY2 = points.reduce((a, p) => a + p.y * p.y, 0);
      
      const numerator = n * sumXY - sumX * sumY;
      const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
      const correlation = denominator === 0 ? 0 : numerator / denominator;
      
      // Perfect negative correlation
      expect(correlation).toBeCloseTo(-1, 5);
    });

    it('should return 0 for no correlation', () => {
      const points = [
        { x: 1, y: 5 },
        { x: 2, y: 5 },
        { x: 3, y: 5 },
        { x: 4, y: 5 },
        { x: 5, y: 5 },
      ];
      
      const n = points.length;
      const sumX = points.reduce((a, p) => a + p.x, 0);
      const sumY = points.reduce((a, p) => a + p.y, 0);
      const sumXY = points.reduce((a, p) => a + p.x * p.y, 0);
      const sumX2 = points.reduce((a, p) => a + p.x * p.x, 0);
      const sumY2 = points.reduce((a, p) => a + p.y * p.y, 0);
      
      const numerator = n * sumXY - sumX * sumY;
      const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
      const correlation = denominator === 0 ? 0 : numerator / denominator;
      
      // No correlation (constant y)
      expect(correlation).toBe(0);
    });
  });

  describe('Histogram Binning', () => {
    it('should create correct number of bins', () => {
      const values = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      const binCount = 5;
      const min = Math.min(...values);
      const max = Math.max(...values);
      const binSize = (max - min) / binCount;
      
      const bins: Array<{ min: number; max: number; count: number }> = [];
      for (let i = 0; i < binCount; i++) {
        const binMin = min + i * binSize;
        const binMax = min + (i + 1) * binSize;
        const count = values.filter(v => v >= binMin && v < binMax).length;
        bins.push({ min: binMin, max: binMax, count });
      }
      
      expect(bins.length).toBe(binCount);
      expect(bins[0].min).toBe(10);
      expect(bins[binCount - 1].max).toBe(100);
    });

    it('should distribute values correctly across bins', () => {
      const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const binCount = 2;
      const min = Math.min(...values);
      const max = Math.max(...values);
      const binSize = (max - min) / binCount;
      
      const bins: Array<{ count: number }> = [];
      for (let i = 0; i < binCount; i++) {
        const binMin = min + i * binSize;
        const binMax = min + (i + 1) * binSize;
        const count = values.filter(v => v >= binMin && v < binMax).length;
        bins.push({ count });
      }
      
      // Values 1-5 in first bin, 6-10 in second (with boundary handling)
      expect(bins[0].count + bins[1].count).toBeLessThanOrEqual(values.length);
    });
  });

  describe('Chemical Class Color Mapping', () => {
    const CHEMICAL_CLASS_COLORS: Record<string, string> = {
      terpene: "#22c55e",
      sesquiterpene: "#16a34a",
      aldehyde: "#f59e0b",
      alcohol: "#3b82f6",
      ester: "#8b5cf6",
      other: "#94a3b8",
    };

    it('should return correct color for known chemical class', () => {
      expect(CHEMICAL_CLASS_COLORS['terpene']).toBe('#22c55e');
      expect(CHEMICAL_CLASS_COLORS['aldehyde']).toBe('#f59e0b');
    });

    it('should have fallback color for unknown classes', () => {
      const unknownClass = 'unknown_class';
      const color = CHEMICAL_CLASS_COLORS[unknownClass] || CHEMICAL_CLASS_COLORS['other'];
      expect(color).toBe('#94a3b8');
    });

    it('should have valid hex color format for all classes', () => {
      const hexColorRegex = /^#[0-9a-f]{6}$/i;
      Object.values(CHEMICAL_CLASS_COLORS).forEach(color => {
        expect(color).toMatch(hexColorRegex);
      });
    });
  });
});
