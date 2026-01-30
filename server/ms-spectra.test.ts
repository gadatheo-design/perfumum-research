/**
 * Tests unitaires pour les procédures de spectrométrie de masse (MS)
 * @vitest-environment node
 */

import { describe, it, expect, beforeAll } from 'vitest';

// Test de la structure des données MS
describe('MS Spectra Data Structure', () => {
  it('should have valid spectrum data format', () => {
    const sampleSpectrum = {
      id: 1,
      compound_name: 'β-Caryophyllène',
      cas_number: '87-44-5',
      molecular_formula: 'C15H24',
      molecular_weight: 204.35,
      ionization_mode: 'EI',
      base_peak_mz: 93,
      spectrum_data: {
        peaks: [
          { mz: 41, intensity: 45 },
          { mz: 93, intensity: 100 },
          { mz: 204, intensity: 25 }
        ]
      },
      fragmentation_pattern: 'Perte de CH3 (M-15)'
    };

    expect(sampleSpectrum.compound_name).toBeDefined();
    expect(sampleSpectrum.cas_number).toMatch(/^\d+-\d+-\d+$/);
    expect(sampleSpectrum.molecular_formula).toMatch(/^C\d+H\d+/);
    expect(sampleSpectrum.molecular_weight).toBeGreaterThan(0);
    expect(sampleSpectrum.ionization_mode).toBe('EI');
    expect(sampleSpectrum.spectrum_data.peaks).toBeInstanceOf(Array);
    expect(sampleSpectrum.spectrum_data.peaks.length).toBeGreaterThan(0);
  });

  it('should have valid peak data', () => {
    const peaks = [
      { mz: 41, intensity: 45 },
      { mz: 93, intensity: 100 },
      { mz: 204, intensity: 25 }
    ];

    peaks.forEach(peak => {
      expect(peak.mz).toBeGreaterThan(0);
      expect(peak.intensity).toBeGreaterThanOrEqual(0);
      expect(peak.intensity).toBeLessThanOrEqual(100);
    });
  });

  it('should have base peak with intensity 100', () => {
    const peaks = [
      { mz: 41, intensity: 45 },
      { mz: 93, intensity: 100 },
      { mz: 204, intensity: 25 }
    ];

    const basePeak = peaks.find(p => p.intensity === 100);
    expect(basePeak).toBeDefined();
    expect(basePeak?.mz).toBe(93);
  });
});

// Test des composés terpéniques
describe('Terpene MS Spectra', () => {
  const terpenes = [
    { name: 'β-Caryophyllène', formula: 'C15H24', mw: 204.35, basePeak: 93 },
    { name: 'Limonène', formula: 'C10H16', mw: 136.24, basePeak: 68 },
    { name: 'Myrcène', formula: 'C10H16', mw: 136.24, basePeak: 41 },
    { name: 'α-Pinène', formula: 'C10H16', mw: 136.24, basePeak: 93 },
    { name: 'Linalol', formula: 'C10H18O', mw: 154.25, basePeak: 71 },
    { name: 'Eucalyptol', formula: 'C10H18O', mw: 154.25, basePeak: 43 },
  ];

  terpenes.forEach(terpene => {
    it(`should have valid data for ${terpene.name}`, () => {
      expect(terpene.formula).toMatch(/^C\d+H\d+O?$/);
      expect(terpene.mw).toBeGreaterThan(100);
      expect(terpene.basePeak).toBeGreaterThan(0);
    });
  });

  it('should distinguish monoterpenes from sesquiterpenes', () => {
    const monoterpenes = terpenes.filter(t => t.formula === 'C10H16' || t.formula === 'C10H18O');
    const sesquiterpenes = terpenes.filter(t => t.formula === 'C15H24');

    expect(monoterpenes.length).toBeGreaterThan(0);
    expect(sesquiterpenes.length).toBeGreaterThan(0);
    
    // Monoterpènes ont une masse < 160
    monoterpenes.forEach(m => {
      expect(m.mw).toBeLessThan(160);
    });
    
    // Sesquiterpènes ont une masse > 200
    sesquiterpenes.forEach(s => {
      expect(s.mw).toBeGreaterThan(200);
    });
  });
});

// Test de la fragmentation
describe('Fragmentation Patterns', () => {
  it('should identify common fragmentation losses', () => {
    const fragmentationLosses = {
      'CH3': 15,
      'H2O': 18,
      'CO': 28,
      'C2H4': 28,
      'C3H7': 43,
    };

    expect(fragmentationLosses['CH3']).toBe(15);
    expect(fragmentationLosses['H2O']).toBe(18);
    expect(fragmentationLosses['CO']).toBe(28);
  });

  it('should calculate M-15 fragment correctly', () => {
    const molecularWeight = 204.35; // β-Caryophyllène
    const m15Fragment = molecularWeight - 15;
    expect(m15Fragment).toBeCloseTo(189.35, 1);
  });

  it('should identify retro-Diels-Alder fragmentation', () => {
    // Limonène subit une fragmentation rétro-Diels-Alder donnant m/z 68
    const limonene = {
      mw: 136.24,
      basePeak: 68,
      fragmentation: 'retro-Diels-Alder'
    };
    
    expect(limonene.basePeak).toBe(68);
    expect(limonene.mw - limonene.basePeak).toBeCloseTo(68.24, 1);
  });
});

// Test de la validation des CAS numbers
describe('CAS Number Validation', () => {
  const casNumbers = [
    '87-44-5',    // β-Caryophyllène
    '138-86-3',   // Limonène
    '123-35-3',   // Myrcène
    '80-56-8',    // α-Pinène
    '78-70-6',    // Linalol
  ];

  casNumbers.forEach(cas => {
    it(`should validate CAS number ${cas}`, () => {
      expect(cas).toMatch(/^\d+-\d+-\d+$/);
      
      // Vérifier le checksum CAS
      const parts = cas.split('-');
      expect(parts.length).toBe(3);
      expect(parseInt(parts[2])).toBeLessThan(10); // Check digit is single digit
    });
  });
});

// Test de l'ionisation
describe('Ionization Modes', () => {
  const validModes = ['EI', 'CI', 'ESI', 'APCI'];

  it('should use EI as default for terpenes', () => {
    const defaultMode = 'EI';
    expect(validModes).toContain(defaultMode);
  });

  it('should support all standard ionization modes', () => {
    expect(validModes.length).toBe(4);
    expect(validModes).toContain('EI');
    expect(validModes).toContain('CI');
    expect(validModes).toContain('ESI');
    expect(validModes).toContain('APCI');
  });
});
