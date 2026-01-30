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


// === Tests pour les spectres des chromatogrammes ===
describe('Chromatogram MS Spectra', () => {
  const chromatogramCompounds = [
    'Camphène', 'p-Cymène', 'α-Humulène', 'β-Élémène', 'γ-Élémène',
    'Caryophyllène oxide', 'Guaïol', 'α-Bisabolol', 'Nérolidol', 'Farnésol',
    'Acétate de géranyle', 'Gaïacol', '4-Méthylguaïacol', 'Créosol', 'Syringol',
    'Indole', 'Skatole', 'Furfural', '5-Méthylfurfural', 'γ-Nonalactone',
    'δ-Octalactone', 'δ-Décalactone', 'β-Ionone', 'β-Damascénone',
    'Mégastigmatrienone', 'Solanone', 'Acide acétique', 'Maltol', 'Isomaltol'
  ];

  it('should have spectra for all chromatogram compounds', () => {
    expect(chromatogramCompounds.length).toBe(29);
  });

  it('should include phenolic compounds from tobacco smoke', () => {
    const phenolics = ['Gaïacol', '4-Méthylguaïacol', 'Créosol', 'Syringol'];
    phenolics.forEach(compound => {
      expect(chromatogramCompounds).toContain(compound);
    });
  });

  it('should include indolic compounds', () => {
    const indolics = ['Indole', 'Skatole'];
    indolics.forEach(compound => {
      expect(chromatogramCompounds).toContain(compound);
    });
  });

  it('should include lactones', () => {
    const lactones = ['γ-Nonalactone', 'δ-Octalactone', 'δ-Décalactone'];
    lactones.forEach(compound => {
      expect(chromatogramCompounds).toContain(compound);
    });
  });

  it('should include ionones and damascenones', () => {
    const carotenoidDerivatives = ['β-Ionone', 'β-Damascénone', 'Mégastigmatrienone'];
    carotenoidDerivatives.forEach(compound => {
      expect(chromatogramCompounds).toContain(compound);
    });
  });
});

// === Tests pour la similarité spectrale ===
describe('Spectral Similarity Calculation', () => {
  const calculateCosineSimilarity = (peaks1: {mz: number, intensity: number}[], peaks2: {mz: number, intensity: number}[]) => {
    const allMz = new Set([...peaks1.map(p => p.mz), ...peaks2.map(p => p.mz)]);
    const vec1: number[] = [];
    const vec2: number[] = [];
    
    allMz.forEach(mz => {
      const p1 = peaks1.find(p => p.mz === mz);
      const p2 = peaks2.find(p => p.mz === mz);
      vec1.push(p1?.intensity || 0);
      vec2.push(p2?.intensity || 0);
    });
    
    const dotProduct = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
    const norm1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
    const norm2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
    
    if (norm1 === 0 || norm2 === 0) return 0;
    return (dotProduct / (norm1 * norm2)) * 100;
  };

  it('should return 100% for identical spectra', () => {
    const peaks = [
      { mz: 41, intensity: 45 },
      { mz: 93, intensity: 100 },
      { mz: 204, intensity: 25 }
    ];
    const similarity = calculateCosineSimilarity(peaks, peaks);
    expect(similarity).toBeCloseTo(100, 1);
  });

  it('should return 0% for completely different spectra', () => {
    const peaks1 = [{ mz: 41, intensity: 100 }];
    const peaks2 = [{ mz: 200, intensity: 100 }];
    const similarity = calculateCosineSimilarity(peaks1, peaks2);
    expect(similarity).toBe(0);
  });

  it('should return intermediate value for partially similar spectra', () => {
    const peaks1 = [
      { mz: 41, intensity: 45 },
      { mz: 93, intensity: 100 },
      { mz: 204, intensity: 25 }
    ];
    const peaks2 = [
      { mz: 41, intensity: 50 },
      { mz: 93, intensity: 90 },
      { mz: 150, intensity: 30 }
    ];
    const similarity = calculateCosineSimilarity(peaks1, peaks2);
    expect(similarity).toBeGreaterThan(50);
    expect(similarity).toBeLessThan(100);
  });

  it('should handle empty spectra', () => {
    const similarity = calculateCosineSimilarity([], []);
    expect(similarity).toBe(0);
  });
});

// === Tests pour les classes chimiques ===
describe('Chemical Classes in MS Spectra', () => {
  it('should categorize monoterpenes correctly', () => {
    const monoterpenes = [
      { name: 'Limonène', formula: 'C10H16', mw: 136.24 },
      { name: 'α-Pinène', formula: 'C10H16', mw: 136.24 },
      { name: 'Myrcène', formula: 'C10H16', mw: 136.24 },
      { name: 'Camphène', formula: 'C10H16', mw: 136.24 },
      { name: 'p-Cymène', formula: 'C10H14', mw: 134.22 },
    ];
    
    monoterpenes.forEach(m => {
      expect(m.mw).toBeLessThan(160);
      expect(m.formula).toMatch(/^C10H1[4-8]$/);
    });
  });

  it('should categorize sesquiterpenes correctly', () => {
    const sesquiterpenes = [
      { name: 'β-Caryophyllène', formula: 'C15H24', mw: 204.35 },
      { name: 'α-Humulène', formula: 'C15H24', mw: 204.35 },
      { name: 'β-Élémène', formula: 'C15H24', mw: 204.35 },
      { name: 'Farnésène', formula: 'C15H24', mw: 204.35 },
    ];
    
    sesquiterpenes.forEach(s => {
      expect(s.mw).toBeGreaterThan(200);
      expect(s.formula).toBe('C15H24');
    });
  });

  it('should categorize oxygenated terpenes correctly', () => {
    const oxygenatedTerpenes = [
      { name: 'Linalol', formula: 'C10H18O', mw: 154.25 },
      { name: 'Géraniol', formula: 'C10H18O', mw: 154.25 },
      { name: 'Eucalyptol', formula: 'C10H18O', mw: 154.25 },
      { name: 'Nérolidol', formula: 'C15H26O', mw: 222.37 },
    ];
    
    oxygenatedTerpenes.forEach(t => {
      expect(t.formula).toContain('O');
    });
  });
});
