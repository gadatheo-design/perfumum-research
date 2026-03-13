/**
 * Parsers pour les formats de fichiers spectraux
 * 
 * Formats supportés:
 * - .msp : NIST MS Search format (texte)
 * - .jdx : JCAMP-DX format (standard IUPAC)
 * - .csv : Format CSV générique (m/z, intensity)
 */

export interface Peak {
  mz: number;
  intensity: number;
}

export interface ParsedSpectrum {
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
  rawContent?: string;
}

export interface ParseResult {
  success: boolean;
  spectrum?: ParsedSpectrum;
  error?: string;
}

/**
 * Parser pour le format MSP (NIST MS Search)
 * 
 * Format typique:
 * NAME: Compound Name
 * CAS#: 123-45-6
 * MW: 204
 * FORMULA: C15H24
 * Num Peaks: 10
 * 41 45; 55 30; 93 100; ...
 */
export function parseMSP(content: string): ParseResult {
  try {
    const lines = content.split(/\r?\n/);
    const metadata: ParsedSpectrum['metadata'] = { source: 'MSP file' };
    const peaks: Peak[] = [];
    let inPeakSection = false;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      // Parse metadata
      if (trimmedLine.includes(':') && !inPeakSection) {
        const [key, ...valueParts] = trimmedLine.split(':');
        const value = valueParts.join(':').trim();
        const keyLower = key.toLowerCase().trim();
        
        switch (keyLower) {
          case 'name':
            metadata.name = value;
            break;
          case 'cas#':
          case 'casno':
          case 'cas':
            metadata.casNumber = value;
            break;
          case 'mw':
          case 'molweight':
          case 'molecular weight':
            metadata.molecularWeight = parseFloat(value);
            break;
          case 'formula':
          case 'molform':
          case 'molecular formula':
            metadata.molecularFormula = value;
            break;
          case 'instrument':
          case 'instrument type':
            metadata.instrument = value;
            break;
          case 'ionization':
          case 'ion mode':
          case 'ionmode':
            metadata.ionizationMode = value;
            break;
          case 'rt':
          case 'retentiontime':
          case 'retention time':
            metadata.retentionTime = parseFloat(value);
            break;
          case 'comment':
          case 'comments':
            metadata.comment = value;
            break;
          case 'num peaks':
          case 'numpeaks':
          case 'numpeak':
            metadata.numPeaks = parseInt(value, 10);
            inPeakSection = true;
            break;
        }
      } else {
        // Parse peaks - formats: "mz intensity;" or "mz intensity" or "(mz intensity)"
        // Support multiple peaks per line
        const peakMatches = Array.from(trimmedLine.matchAll(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)/g));
        for (const match of peakMatches) {
          const mz = parseFloat(match[1]);
          const intensity = parseFloat(match[2]);
          if (!isNaN(mz) && !isNaN(intensity) && mz > 0) {
            peaks.push({ mz, intensity });
          }
        }
      }
    }
    
    if (peaks.length === 0) {
      return { success: false, error: 'Aucun pic trouvé dans le fichier MSP' };
    }
    
    // Normaliser les intensités si nécessaire
    const maxIntensity = Math.max(...peaks.map(p => p.intensity));
    if (maxIntensity > 100) {
      peaks.forEach(p => p.intensity = (p.intensity / maxIntensity) * 100);
    }
    
    return {
      success: true,
      spectrum: {
        peaks: peaks.sort((a, b) => a.mz - b.mz),
        metadata,
        format: 'msp'
      }
    };
  } catch (error) {
    return { success: false, error: `Erreur de parsing MSP: ${error}` };
  }
}

/**
 * Parser pour le format JCAMP-DX
 * 
 * Format typique:
 * ##TITLE= Compound Name
 * ##JCAMP-DX= 5.00
 * ##DATA TYPE= MASS SPECTRUM
 * ##CAS REGISTRY NO= 123-45-6
 * ##MOLFORM= C15H24
 * ##MW= 204
 * ##NPOINTS= 10
 * ##XYDATA= (XY..XY)
 * 41.0, 45.0
 * 93.0, 100.0
 * ##END=
 */
export function parseJDX(content: string): ParseResult {
  try {
    const lines = content.split(/\r?\n/);
    const metadata: ParsedSpectrum['metadata'] = { source: 'JCAMP-DX file' };
    const peaks: Peak[] = [];
    let inDataSection = false;
    let dataFormat = '';
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      // Parse labeled data records (##LABEL= value)
      if (trimmedLine.startsWith('##')) {
        const match = trimmedLine.match(/^##([^=]+)=\s*(.*)$/);
        if (match) {
          const [, label, value] = match;
          const labelUpper = label.toUpperCase().trim();
          
          switch (labelUpper) {
            case 'TITLE':
            case 'SAMPLE DESCRIPTION':
              metadata.name = value.trim();
              break;
            case 'CAS REGISTRY NO':
            case 'CAS NAME':
              metadata.casNumber = value.trim();
              break;
            case 'MW':
            case 'MOLECULAR WEIGHT':
              metadata.molecularWeight = parseFloat(value);
              break;
            case 'MOLFORM':
            case 'MOLECULAR FORMULA':
              metadata.molecularFormula = value.trim();
              break;
            case 'SPECTROMETER/DATA SYSTEM':
            case 'INSTRUMENT':
              metadata.instrument = value.trim();
              break;
            case 'NPOINTS':
            case 'NUMPEAKS':
              metadata.numPeaks = parseInt(value, 10);
              break;
            case 'XYDATA':
            case 'PEAK TABLE':
            case 'XYPOINTS':
              inDataSection = true;
              dataFormat = value.trim();
              break;
            case 'END':
              inDataSection = false;
              break;
          }
        }
      } else if (inDataSection) {
        // Parse data points
        // Support formats: "x, y" or "x y" or "(x, y)"
        const dataMatches = Array.from(trimmedLine.matchAll(/(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)/g));
        for (const match of dataMatches) {
          const mz = parseFloat(match[1]);
          const intensity = parseFloat(match[2]);
          if (!isNaN(mz) && !isNaN(intensity) && mz > 0) {
            peaks.push({ mz, intensity });
          }
        }
      }
    }
    
    if (peaks.length === 0) {
      return { success: false, error: 'Aucun pic trouvé dans le fichier JCAMP-DX' };
    }
    
    // Normaliser les intensités si nécessaire
    const maxIntensity = Math.max(...peaks.map(p => p.intensity));
    if (maxIntensity > 100) {
      peaks.forEach(p => p.intensity = (p.intensity / maxIntensity) * 100);
    }
    
    return {
      success: true,
      spectrum: {
        peaks: peaks.sort((a, b) => a.mz - b.mz),
        metadata,
        format: 'jdx'
      }
    };
  } catch (error) {
    return { success: false, error: `Erreur de parsing JCAMP-DX: ${error}` };
  }
}

/**
 * Parser pour le format CSV générique
 * 
 * Formats supportés:
 * - Avec en-tête: mz,intensity ou m/z,intensity ou mass,abundance
 * - Sans en-tête: première colonne = m/z, deuxième = intensité
 * - Séparateurs: virgule, point-virgule, tabulation
 */
export function parseCSV(content: string): ParseResult {
  try {
    const lines = content.split(/\r?\n/).filter(l => l.trim());
    const peaks: Peak[] = [];
    const metadata: ParsedSpectrum['metadata'] = { source: 'CSV file' };
    
    // Détecter le séparateur
    const firstLine = lines[0];
    let separator = ',';
    if (firstLine.includes('\t')) separator = '\t';
    else if (firstLine.includes(';')) separator = ';';
    
    // Vérifier si la première ligne est un en-tête
    const firstParts = firstLine.split(separator).map(p => p.trim().toLowerCase());
    let startLine = 0;
    
    const headerKeywords = ['mz', 'm/z', 'mass', 'intensity', 'abundance', 'rel', 'int'];
    const isHeader = firstParts.some(p => headerKeywords.some(k => p.includes(k)));
    
    if (isHeader) {
      startLine = 1;
      // Extraire les métadonnées de l'en-tête si disponibles
      if (firstParts.length > 2) {
        metadata.comment = `Colonnes: ${firstParts.join(', ')}`;
      }
    }
    
    // Parser les données
    for (let i = startLine; i < lines.length; i++) {
      const parts = lines[i].split(separator).map(p => p.trim());
      if (parts.length >= 2) {
        const mz = parseFloat(parts[0]);
        const intensity = parseFloat(parts[1]);
        
        if (!isNaN(mz) && !isNaN(intensity) && mz > 0) {
          peaks.push({ mz, intensity });
        }
      }
    }
    
    if (peaks.length === 0) {
      return { success: false, error: 'Aucun pic trouvé dans le fichier CSV' };
    }
    
    // Normaliser les intensités si nécessaire
    const maxIntensity = Math.max(...peaks.map(p => p.intensity));
    if (maxIntensity > 100) {
      peaks.forEach(p => p.intensity = (p.intensity / maxIntensity) * 100);
    }
    
    metadata.numPeaks = peaks.length;
    
    return {
      success: true,
      spectrum: {
        peaks: peaks.sort((a, b) => a.mz - b.mz),
        metadata,
        format: 'csv'
      }
    };
  } catch (error) {
    return { success: false, error: `Erreur de parsing CSV: ${error}` };
  }
}

/**
 * Parser automatique qui détecte le format du fichier
 */
export function parseSpectrumFile(content: string, filename: string): ParseResult {
  const extension = filename.toLowerCase().split('.').pop() || '';
  
  switch (extension) {
    case 'msp':
      return parseMSP(content);
    case 'jdx':
    case 'dx':
    case 'jcamp':
      return parseJDX(content);
    case 'csv':
    case 'txt':
      // Essayer de détecter le format automatiquement
      if (content.includes('##TITLE') || content.includes('##JCAMP')) {
        return parseJDX(content);
      } else if (content.toLowerCase().includes('name:') || content.toLowerCase().includes('num peaks')) {
        return parseMSP(content);
      }
      return parseCSV(content);
    default:
      // Essayer tous les parsers
      let result = parseMSP(content);
      if (result.success) return result;
      
      result = parseJDX(content);
      if (result.success) return result;
      
      return parseCSV(content);
  }
}

/**
 * Valider un spectre parsé
 */
export function validateSpectrum(spectrum: ParsedSpectrum): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  
  if (spectrum.peaks.length < 3) {
    warnings.push('Le spectre contient moins de 3 pics, ce qui peut affecter la qualité de l\'identification');
  }
  
  if (spectrum.peaks.length > 500) {
    warnings.push('Le spectre contient plus de 500 pics, seuls les pics les plus intenses seront utilisés');
  }
  
  const hasBasePeak = spectrum.peaks.some(p => p.intensity >= 99);
  if (!hasBasePeak) {
    warnings.push('Aucun pic de base (intensité 100%) détecté, les intensités ont été normalisées');
  }
  
  const maxMz = Math.max(...spectrum.peaks.map(p => p.mz));
  if (maxMz < 50) {
    warnings.push('Les valeurs m/z semblent très basses, vérifiez les unités');
  }
  
  if (!spectrum.metadata.name && !spectrum.metadata.casNumber) {
    warnings.push('Aucune information d\'identification (nom ou CAS) trouvée dans le fichier');
  }
  
  return { valid: warnings.length < 3, warnings };
}

/**
 * Formater les métadonnées pour l'affichage
 */
export function formatMetadata(metadata: ParsedSpectrum['metadata']): string[] {
  const lines: string[] = [];
  
  if (metadata.name) lines.push(`Nom: ${metadata.name}`);
  if (metadata.casNumber) lines.push(`CAS: ${metadata.casNumber}`);
  if (metadata.molecularFormula) lines.push(`Formule: ${metadata.molecularFormula}`);
  if (metadata.molecularWeight) lines.push(`Masse moléculaire: ${metadata.molecularWeight.toFixed(2)}`);
  if (metadata.instrument) lines.push(`Instrument: ${metadata.instrument}`);
  if (metadata.ionizationMode) lines.push(`Mode d'ionisation: ${metadata.ionizationMode}`);
  if (metadata.retentionTime) lines.push(`Temps de rétention: ${metadata.retentionTime.toFixed(2)} min`);
  if (metadata.numPeaks) lines.push(`Nombre de pics: ${metadata.numPeaks}`);
  if (metadata.comment) lines.push(`Commentaire: ${metadata.comment}`);
  
  return lines;
}
