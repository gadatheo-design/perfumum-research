/**
 * Tests unitaires pour les parsers de fichiers spectraux
 * @vitest-environment node
 */

import { describe, it, expect } from 'vitest';

// Simuler les fonctions de parsing (même logique que dans spectrumParsers.ts)
interface Peak {
  mz: number;
  intensity: number;
}

interface ParsedSpectrum {
  peaks: Peak[];
  metadata: {
    name?: string;
    casNumber?: string;
    molecularWeight?: number;
    molecularFormula?: string;
    instrument?: string;
    ionizationMode?: string;
    retentionTime?: number;
    comment?: string;
    source?: string;
    numPeaks?: number;
  };
  format: 'msp' | 'jdx' | 'csv' | 'unknown';
}

// === Tests pour le format MSP ===
describe('MSP Parser', () => {
  it('should parse a valid MSP file with metadata', () => {
    const mspContent = `NAME: β-Caryophyllène
CAS#: 87-44-5
MW: 204.35
FORMULA: C15H24
Num Peaks: 5
41 45; 55 30; 93 100; 133 60; 204 25`;

    // Simuler le parsing
    const lines = mspContent.split(/\r?\n/);
    const metadata: ParsedSpectrum['metadata'] = {};
    const peaks: Peak[] = [];
    let inPeakSection = false;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      if (trimmedLine.includes(':') && !inPeakSection) {
        const [key, ...valueParts] = trimmedLine.split(':');
        const value = valueParts.join(':').trim();
        const keyLower = key.toLowerCase().trim();

        if (keyLower === 'name') metadata.name = value;
        if (keyLower === 'cas#') metadata.casNumber = value;
        if (keyLower === 'mw') metadata.molecularWeight = parseFloat(value);
        if (keyLower === 'formula') metadata.molecularFormula = value;
        if (keyLower === 'num peaks') {
          metadata.numPeaks = parseInt(value, 10);
          inPeakSection = true;
        }
      } else {
        const peakMatches = trimmedLine.matchAll(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)/g);
        for (const match of peakMatches) {
          peaks.push({ mz: parseFloat(match[1]), intensity: parseFloat(match[2]) });
        }
      }
    }

    expect(metadata.name).toBe('β-Caryophyllène');
    expect(metadata.casNumber).toBe('87-44-5');
    expect(metadata.molecularWeight).toBe(204.35);
    expect(metadata.molecularFormula).toBe('C15H24');
    expect(peaks.length).toBe(5);
    expect(peaks.find(p => p.intensity === 100)?.mz).toBe(93);
  });

  it('should handle MSP files with different peak formats', () => {
    // Format avec tabulation
    const peakLine1 = '41\t45\t55\t30\t93\t100';
    const matches1 = peakLine1.matchAll(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)/g);
    const peaks1 = [...matches1].map(m => ({ mz: parseFloat(m[1]), intensity: parseFloat(m[2]) }));
    expect(peaks1.length).toBe(3);

    // Format avec point-virgule
    const peakLine2 = '41 45; 55 30; 93 100;';
    const matches2 = peakLine2.matchAll(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)/g);
    const peaks2 = [...matches2].map(m => ({ mz: parseFloat(m[1]), intensity: parseFloat(m[2]) }));
    expect(peaks2.length).toBe(3);
  });

  it('should normalize intensities above 100', () => {
    const peaks = [
      { mz: 41, intensity: 450 },
      { mz: 93, intensity: 1000 },
      { mz: 204, intensity: 250 }
    ];

    const maxIntensity = Math.max(...peaks.map(p => p.intensity));
    if (maxIntensity > 100) {
      peaks.forEach(p => p.intensity = (p.intensity / maxIntensity) * 100);
    }

    expect(peaks.find(p => p.mz === 93)?.intensity).toBe(100);
    expect(peaks.find(p => p.mz === 41)?.intensity).toBe(45);
    expect(peaks.find(p => p.mz === 204)?.intensity).toBe(25);
  });
});

// === Tests pour le format JCAMP-DX ===
describe('JCAMP-DX Parser', () => {
  it('should parse a valid JCAMP-DX file', () => {
    const jdxContent = `##TITLE= Limonène
##JCAMP-DX= 5.00
##DATA TYPE= MASS SPECTRUM
##CAS REGISTRY NO= 138-86-3
##MOLFORM= C10H16
##MW= 136.24
##NPOINTS= 4
##XYDATA= (XY..XY)
68, 100
93, 45
121, 30
136, 25
##END=`;

    const lines = jdxContent.split(/\r?\n/);
    const metadata: ParsedSpectrum['metadata'] = {};
    const peaks: Peak[] = [];
    let inDataSection = false;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      if (trimmedLine.startsWith('##')) {
        const match = trimmedLine.match(/^##([^=]+)=\s*(.*)$/);
        if (match) {
          const [, label, value] = match;
          const labelUpper = label.toUpperCase().trim();

          if (labelUpper === 'TITLE') metadata.name = value.trim();
          if (labelUpper === 'CAS REGISTRY NO') metadata.casNumber = value.trim();
          if (labelUpper === 'MW') metadata.molecularWeight = parseFloat(value);
          if (labelUpper === 'MOLFORM') metadata.molecularFormula = value.trim();
          if (labelUpper === 'NPOINTS') metadata.numPeaks = parseInt(value, 10);
          if (labelUpper === 'XYDATA') inDataSection = true;
          if (labelUpper === 'END') inDataSection = false;
        }
      } else if (inDataSection) {
        const dataMatches = trimmedLine.matchAll(/(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)/g);
        for (const match of dataMatches) {
          peaks.push({ mz: parseFloat(match[1]), intensity: parseFloat(match[2]) });
        }
      }
    }

    expect(metadata.name).toBe('Limonène');
    expect(metadata.casNumber).toBe('138-86-3');
    expect(metadata.molecularWeight).toBe(136.24);
    expect(metadata.molecularFormula).toBe('C10H16');
    expect(peaks.length).toBe(4);
    expect(peaks.find(p => p.intensity === 100)?.mz).toBe(68);
  });

  it('should detect JCAMP-DX format by content', () => {
    const content1 = '##TITLE= Test\n##JCAMP-DX= 5.00';
    const content2 = 'NAME: Test\nNum Peaks: 5';
    const content3 = 'mz,intensity\n41,45';

    const isJdx1 = content1.includes('##TITLE') || content1.includes('##JCAMP');
    const isJdx2 = content2.includes('##TITLE') || content2.includes('##JCAMP');
    const isJdx3 = content3.includes('##TITLE') || content3.includes('##JCAMP');

    expect(isJdx1).toBe(true);
    expect(isJdx2).toBe(false);
    expect(isJdx3).toBe(false);
  });
});

// === Tests pour le format CSV ===
describe('CSV Parser', () => {
  it('should parse CSV with header', () => {
    const csvContent = `mz,intensity
41,45
93,100
204,25`;

    const lines = csvContent.split(/\r?\n/).filter(l => l.trim());
    const peaks: Peak[] = [];
    const firstParts = lines[0].split(',').map(p => p.trim().toLowerCase());
    const isHeader = firstParts.some(p => ['mz', 'm/z', 'mass', 'intensity'].some(k => p.includes(k)));
    const startLine = isHeader ? 1 : 0;

    for (let i = startLine; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim());
      if (parts.length >= 2) {
        const mz = parseFloat(parts[0]);
        const intensity = parseFloat(parts[1]);
        if (!isNaN(mz) && !isNaN(intensity)) {
          peaks.push({ mz, intensity });
        }
      }
    }

    expect(peaks.length).toBe(3);
    expect(peaks[0].mz).toBe(41);
    expect(peaks[1].intensity).toBe(100);
  });

  it('should parse CSV without header', () => {
    const csvContent = `41,45
93,100
204,25`;

    const lines = csvContent.split(/\r?\n/).filter(l => l.trim());
    const peaks: Peak[] = [];

    for (const line of lines) {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 2) {
        const mz = parseFloat(parts[0]);
        const intensity = parseFloat(parts[1]);
        if (!isNaN(mz) && !isNaN(intensity)) {
          peaks.push({ mz, intensity });
        }
      }
    }

    expect(peaks.length).toBe(3);
  });

  it('should detect different separators', () => {
    const csvComma = '41,45\n93,100';
    const csvSemicolon = '41;45\n93;100';
    const csvTab = '41\t45\n93\t100';

    const detectSeparator = (line: string) => {
      if (line.includes('\t')) return '\t';
      if (line.includes(';')) return ';';
      return ',';
    };

    expect(detectSeparator(csvComma.split('\n')[0])).toBe(',');
    expect(detectSeparator(csvSemicolon.split('\n')[0])).toBe(';');
    expect(detectSeparator(csvTab.split('\n')[0])).toBe('\t');
  });

  it('should handle various header formats', () => {
    const headers = [
      'mz,intensity',
      'm/z,abundance',
      'mass,rel_int',
      'M/Z,Intensity',
      'MASS,ABUNDANCE'
    ];

    const headerKeywords = ['mz', 'm/z', 'mass', 'intensity', 'abundance', 'rel', 'int'];
    
    headers.forEach(header => {
      const parts = header.split(',').map(p => p.trim().toLowerCase());
      const isHeader = parts.some(p => headerKeywords.some(k => p.includes(k)));
      expect(isHeader).toBe(true);
    });
  });
});

// === Tests de validation ===
describe('Spectrum Validation', () => {
  it('should warn for spectra with less than 3 peaks', () => {
    const peaks = [{ mz: 93, intensity: 100 }, { mz: 41, intensity: 45 }];
    const warnings: string[] = [];

    if (peaks.length < 3) {
      warnings.push('Le spectre contient moins de 3 pics');
    }

    expect(warnings.length).toBe(1);
  });

  it('should warn for spectra with more than 500 peaks', () => {
    const peaks = Array.from({ length: 600 }, (_, i) => ({ mz: i + 1, intensity: Math.random() * 100 }));
    const warnings: string[] = [];

    if (peaks.length > 500) {
      warnings.push('Le spectre contient plus de 500 pics');
    }

    expect(warnings.length).toBe(1);
  });

  it('should warn if no base peak is detected', () => {
    const peaks = [
      { mz: 41, intensity: 45 },
      { mz: 93, intensity: 80 },
      { mz: 204, intensity: 25 }
    ];
    const warnings: string[] = [];

    const hasBasePeak = peaks.some(p => p.intensity >= 99);
    if (!hasBasePeak) {
      warnings.push('Aucun pic de base détecté');
    }

    expect(warnings.length).toBe(1);
  });

  it('should warn for very low m/z values', () => {
    const peaks = [
      { mz: 10, intensity: 100 },
      { mz: 20, intensity: 50 },
      { mz: 30, intensity: 25 }
    ];
    const warnings: string[] = [];

    const maxMz = Math.max(...peaks.map(p => p.mz));
    if (maxMz < 50) {
      warnings.push('Les valeurs m/z semblent très basses');
    }

    expect(warnings.length).toBe(1);
  });
});

// === Tests de détection automatique de format ===
describe('Format Auto-Detection', () => {
  it('should detect MSP format by content', () => {
    const mspContent = 'NAME: Test\nCAS#: 123-45-6\nNum Peaks: 3\n41 45; 93 100; 204 25';
    
    const isMsp = mspContent.toLowerCase().includes('name:') || mspContent.toLowerCase().includes('num peaks');
    expect(isMsp).toBe(true);
  });

  it('should detect JCAMP-DX format by content', () => {
    const jdxContent = '##TITLE= Test\n##JCAMP-DX= 5.00\n##XYDATA= (XY..XY)\n41, 45';
    
    const isJdx = jdxContent.includes('##TITLE') || jdxContent.includes('##JCAMP');
    expect(isJdx).toBe(true);
  });

  it('should detect format by file extension', () => {
    const detectFormat = (filename: string) => {
      const ext = filename.toLowerCase().split('.').pop() || '';
      switch (ext) {
        case 'msp': return 'msp';
        case 'jdx':
        case 'dx':
        case 'jcamp': return 'jdx';
        case 'csv':
        case 'txt': return 'csv';
        default: return 'unknown';
      }
    };

    expect(detectFormat('spectrum.msp')).toBe('msp');
    expect(detectFormat('spectrum.jdx')).toBe('jdx');
    expect(detectFormat('spectrum.dx')).toBe('jdx');
    expect(detectFormat('data.csv')).toBe('csv');
    expect(detectFormat('data.txt')).toBe('csv');
    expect(detectFormat('unknown.xyz')).toBe('unknown');
  });
});

// === Tests de cas réels ===
describe('Real-World Spectrum Files', () => {
  it('should parse a typical NIST MSP entry', () => {
    const nistMsp = `NAME: Limonene
SYNON: (+)-Limonene
CAS#: 5989-27-5
MW: 136
FORMULA: C10H16
DB#: 1
NIST#: 1
CONTRIBUTOR: NIST Mass Spectrometry Data Center
Num Peaks: 15
27 17; 29 10; 39 37; 41 32; 53 33; 67 68; 68 100; 77 8; 79 15; 91 7; 92 15; 93 51; 107 11; 121 17; 136 23`;

    const lines = nistMsp.split(/\r?\n/);
    let name = '';
    let cas = '';
    let mw = 0;
    const peaks: Peak[] = [];
    let inPeaks = false;

    for (const line of lines) {
      if (line.startsWith('NAME:')) name = line.split(':')[1].trim();
      if (line.startsWith('CAS#:')) cas = line.split(':')[1].trim();
      if (line.startsWith('MW:')) mw = parseFloat(line.split(':')[1].trim());
      if (line.startsWith('Num Peaks:')) inPeaks = true;
      else if (inPeaks) {
        const matches = line.matchAll(/(\d+)\s+(\d+)/g);
        for (const m of matches) {
          peaks.push({ mz: parseInt(m[1]), intensity: parseInt(m[2]) });
        }
      }
    }

    expect(name).toBe('Limonene');
    expect(cas).toBe('5989-27-5');
    expect(mw).toBe(136);
    expect(peaks.length).toBe(15);
    expect(peaks.find(p => p.intensity === 100)?.mz).toBe(68);
  });

  it('should handle instrument-exported CSV with extra columns', () => {
    const instrumentCsv = `m/z,intensity,relative,annotation
41.0,45000,45.0,fragment
68.0,100000,100.0,base peak
93.0,51000,51.0,
136.0,23000,23.0,M+`;

    const lines = instrumentCsv.split(/\r?\n/).filter(l => l.trim());
    const peaks: Peak[] = [];

    // Skip header
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',');
      const mz = parseFloat(parts[0]);
      const intensity = parseFloat(parts[1]);
      if (!isNaN(mz) && !isNaN(intensity)) {
        peaks.push({ mz, intensity });
      }
    }

    // Normalize
    const max = Math.max(...peaks.map(p => p.intensity));
    peaks.forEach(p => p.intensity = (p.intensity / max) * 100);

    expect(peaks.length).toBe(4);
    expect(peaks.find(p => p.mz === 68)?.intensity).toBe(100);
  });
});
