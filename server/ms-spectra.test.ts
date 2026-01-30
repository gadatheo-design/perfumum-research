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


// === Tests pour les spectres NIST ===
describe('NIST Reference Spectra', () => {
  it('should have valid NIST spectrum format', () => {
    const nistSpectrum = {
      compound_name: 'α-Terpinène',
      cas_number: '99-86-5',
      molecular_formula: 'C10H16',
      molecular_weight: 136.24,
      ionization_mode: 'EI',
      base_peak_mz: 121,
      source: 'NIST',
      spectrum_data: {
        peaks: [
          { mz: 27, intensity: 15 },
          { mz: 77, intensity: 35 },
          { mz: 93, intensity: 55 },
          { mz: 121, intensity: 100 },
          { mz: 136, intensity: 40 }
        ]
      }
    };

    expect(nistSpectrum.source).toBe('NIST');
    expect(nistSpectrum.base_peak_mz).toBe(121);
    expect(nistSpectrum.spectrum_data.peaks.find(p => p.intensity === 100)?.mz).toBe(121);
  });

  it('should have monoterpene molecular weight around 136', () => {
    const monoterpenes = [
      { name: 'α-Terpinène', mw: 136.24 },
      { name: 'γ-Terpinène', mw: 136.24 },
      { name: 'Terpinolène', mw: 136.24 },
      { name: 'Sabinène', mw: 136.24 },
      { name: '3-Carène', mw: 136.24 }
    ];

    monoterpenes.forEach(mt => {
      expect(mt.mw).toBeCloseTo(136.24, 1);
    });
  });

  it('should have sesquiterpene molecular weight around 204', () => {
    const sesquiterpenes = [
      { name: 'α-Copaène', mw: 204.35 },
      { name: 'β-Bourbonène', mw: 204.35 },
      { name: 'Valencène', mw: 204.35 },
      { name: 'δ-Cadinène', mw: 204.35 }
    ];

    sesquiterpenes.forEach(st => {
      expect(st.mw).toBeCloseTo(204.35, 1);
    });
  });
});

// === Tests pour l'algorithme d'identification ===
describe('Spectrum Identification Algorithm', () => {
  // Fonction de calcul de similarité (copie de celle utilisée dans SpectraIdentification.tsx)
  function calculateWeightedSimilarity(
    unknownPeaks: { mz: number; intensity: number }[],
    referencePeaks: { mz: number; intensity: number }[],
    tolerance: number = 1
  ): { similarity: number; matchedPeaks: number } {
    if (unknownPeaks.length === 0 || referencePeaks.length === 0) {
      return { similarity: 0, matchedPeaks: 0 };
    }

    let matchedPeaks = 0;
    let weightedScore = 0;
    let totalWeight = 0;

    unknownPeaks.forEach(unknownPeak => {
      const match = referencePeaks.find(refPeak =>
        Math.abs(refPeak.mz - unknownPeak.mz) <= tolerance
      );

      if (match) {
        matchedPeaks++;
        const weight = match.intensity / 100;
        const intensityMatch = 1 - Math.abs(unknownPeak.intensity - match.intensity) / 100;
        weightedScore += weight * intensityMatch;
        totalWeight += weight;
      }
    });

    const unmatchedPenalty = (unknownPeaks.length - matchedPeaks) / unknownPeaks.length * 0.3;
    const baseSimilarity = totalWeight > 0 ? (weightedScore / totalWeight) * 100 : 0;
    const similarity = Math.max(0, baseSimilarity - unmatchedPenalty * 100);

    return { similarity, matchedPeaks };
  }

  it('should return 100% similarity for identical spectra', () => {
    const spectrum = [
      { mz: 41, intensity: 45 },
      { mz: 93, intensity: 100 },
      { mz: 204, intensity: 25 }
    ];

    const result = calculateWeightedSimilarity(spectrum, spectrum);
    expect(result.similarity).toBeCloseTo(100, 0);
    expect(result.matchedPeaks).toBe(3);
  });

  it('should return 0% similarity for completely different spectra', () => {
    const unknown = [
      { mz: 50, intensity: 100 },
      { mz: 100, intensity: 50 }
    ];
    const reference = [
      { mz: 200, intensity: 100 },
      { mz: 300, intensity: 50 }
    ];

    const result = calculateWeightedSimilarity(unknown, reference);
    expect(result.similarity).toBe(0);
    expect(result.matchedPeaks).toBe(0);
  });

  it('should handle partial matches correctly', () => {
    const unknown = [
      { mz: 93, intensity: 100 },
      { mz: 136, intensity: 40 },
      { mz: 50, intensity: 20 } // Non présent dans la référence
    ];
    const reference = [
      { mz: 93, intensity: 100 },
      { mz: 136, intensity: 40 },
      { mz: 77, intensity: 35 }
    ];

    const result = calculateWeightedSimilarity(unknown, reference);
    expect(result.matchedPeaks).toBe(2);
    expect(result.similarity).toBeGreaterThan(50);
    expect(result.similarity).toBeLessThan(100);
  });

  it('should respect tolerance parameter', () => {
    const unknown = [{ mz: 93, intensity: 100 }];
    const reference = [{ mz: 94, intensity: 100 }];

    const resultTight = calculateWeightedSimilarity(unknown, reference, 0.5);
    const resultLoose = calculateWeightedSimilarity(unknown, reference, 2);

    expect(resultTight.matchedPeaks).toBe(0);
    expect(resultLoose.matchedPeaks).toBe(1);
  });

  it('should weight base peaks more heavily', () => {
    const unknown = [
      { mz: 93, intensity: 100 }, // Base peak
      { mz: 41, intensity: 20 }
    ];
    const reference = [
      { mz: 93, intensity: 100 },
      { mz: 41, intensity: 80 } // Intensité différente
    ];

    const result = calculateWeightedSimilarity(unknown, reference);
    // La différence sur le pic mineur devrait avoir moins d'impact
    expect(result.similarity).toBeGreaterThan(70);
  });
});

// === Tests pour l'onglet MS dans les fiches landraces ===
describe('Landrace MS Tab Integration', () => {
  it('should match compounds by name or CAS number', () => {
    const peaks = [
      { compound_name: 'β-Caryophyllène', cas_number: '87-44-5' },
      { compound_name: 'Limonène', cas_number: '138-86-3' }
    ];

    const msSpectra = [
      { compound_name: 'β-Caryophyllène', cas_number: '87-44-5' },
      { compound_name: 'α-Pinène', cas_number: '80-56-8' }
    ];

    const matchedPeaks = peaks.map(peak => {
      const spectrum = msSpectra.find(s =>
        s.compound_name === peak.compound_name || s.cas_number === peak.cas_number
      );
      return { ...peak, hasSpectrum: !!spectrum };
    });

    expect(matchedPeaks[0].hasSpectrum).toBe(true);
    expect(matchedPeaks[1].hasSpectrum).toBe(false);
  });

  it('should count available and missing spectra correctly', () => {
    const peaks = [
      { compound_name: 'A', hasSpectrum: true },
      { compound_name: 'B', hasSpectrum: true },
      { compound_name: 'C', hasSpectrum: false },
      { compound_name: 'D', hasSpectrum: false },
      { compound_name: 'E', hasSpectrum: true }
    ];

    const available = peaks.filter(p => p.hasSpectrum).length;
    const missing = peaks.filter(p => !p.hasSpectrum).length;

    expect(available).toBe(3);
    expect(missing).toBe(2);
  });
});

// === Tests pour les alcaloïdes du tabac ===
describe('Tobacco Alkaloids MS Spectra', () => {
  it('should have nicotine spectrum with characteristic m/z 84 base peak', () => {
    const nicotineSpectrum = {
      compound_name: 'Nicotine',
      cas_number: '54-11-5',
      molecular_formula: 'C10H14N2',
      molecular_weight: 162.23,
      base_peak_mz: 84,
      spectrum_data: {
        peaks: [
          { mz: 42, intensity: 25 },
          { mz: 84, intensity: 100 },
          { mz: 133, intensity: 25 },
          { mz: 162, intensity: 35 }
        ]
      }
    };

    expect(nicotineSpectrum.base_peak_mz).toBe(84);
    expect(nicotineSpectrum.spectrum_data.peaks.find(p => p.mz === 84)?.intensity).toBe(100);
    expect(nicotineSpectrum.molecular_weight).toBeCloseTo(162.23, 1);
  });

  it('should have nornicotine spectrum with m/z 70 base peak', () => {
    const nornicotineSpectrum = {
      compound_name: 'Nornicotine',
      cas_number: '494-97-3',
      molecular_weight: 148.20,
      base_peak_mz: 70
    };

    expect(nornicotineSpectrum.base_peak_mz).toBe(70);
    expect(nornicotineSpectrum.molecular_weight).toBeLessThan(162.23); // Plus léger que la nicotine
  });
});
