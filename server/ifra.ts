/**
 * IFRA (International Fragrance Association) Regulatory Service
 * 
 * Provides regulatory compliance data for fragrance molecules based on
 * the IFRA Standards Library (51st Amendment, 2023)
 * 
 * Source: https://ifrafragrance.org/standards/IFRA_STD_LIB.aspx
 */

export interface IFRAData {
  status: 'not_regulated' | 'banned' | 'restricted' | 'specification_required';
  reason?: string;
  maxPercent?: number;
  category?: string;
  specification?: string;
  name?: string;
  casNumber?: string;
}

// Base de données locale des restrictions IFRA (données officielles 51st Amendment)
const IFRA_BANNED: Array<{ name: string; casNumber: string; reason: string; aliases?: string[] }> = [
  { name: 'Musk ambrette', casNumber: '83-66-9', reason: 'Phototoxicity', aliases: ['musc ambrette', 'ambrette musquée'] },
  { name: 'Musk moskene', casNumber: '116-66-5', reason: 'Phototoxicity', aliases: ['musc moskène'] },
  { name: 'Musk tibetene', casNumber: '145-39-1', reason: 'Phototoxicity', aliases: ['musc tibétène'] },
  { name: '6-Methylcoumarin', casNumber: '92-48-8', reason: 'Sensitization', aliases: ['6-méthylcoumarine'] },
  { name: 'Dihydrocoumarin', casNumber: '119-84-6', reason: 'Sensitization', aliases: ['dihydrocoumarine'] },
  { name: 'Fig leaf absolute', casNumber: '68916-52-9', reason: 'Phototoxicity', aliases: ['absolu feuille de figuier'] },
  { name: 'Costus root oil', casNumber: '8023-88-9', reason: 'Sensitization', aliases: ['huile de costus', 'costus'] },
  { name: 'Verbena oil', casNumber: '8024-12-2', reason: 'Sensitization', aliases: ['huile de verveine', 'verveine'] },
  { name: 'Safrole', casNumber: '94-59-7', reason: 'Carcinogenicity', aliases: ['safrole'] },
  { name: 'Isosafrole', casNumber: '120-58-1', reason: 'Carcinogenicity', aliases: ['isosafrole'] },
  { name: 'Dihydrosafrole', casNumber: '94-58-6', reason: 'Carcinogenicity', aliases: ['dihydrosafrole'] },
  { name: 'Atranol', casNumber: '526-37-4', reason: 'Sensitization', aliases: ['atranol'] },
  { name: 'Chloroatranol', casNumber: '57074-21-2', reason: 'Sensitization', aliases: ['chloroatranol'] },
  { name: 'Acetyl ethyl tetramethyl tetralin (AETT)', casNumber: '88-29-9', reason: 'Neurotoxicity', aliases: ['aett'] },
  { name: 'Nitromusks', casNumber: 'various', reason: 'Phototoxicity/Environmental', aliases: ['nitromuscs'] },
];

const IFRA_RESTRICTED: Array<{ 
  name: string; 
  casNumber: string; 
  maxPercent: number; 
  category: string; 
  reason: string;
  aliases?: string[];
}> = [
  // Phototoxic substances (citrus oils)
  { name: 'Bergamot oil', casNumber: '8007-75-8', maxPercent: 0.4, category: 'Leave-on', reason: 'Phototoxicity (bergapten)', aliases: ['bergamote', 'huile de bergamote'] },
  { name: 'Lemon oil expressed', casNumber: '8008-56-8', maxPercent: 2.0, category: 'Leave-on', reason: 'Phototoxicity', aliases: ['citron', 'huile de citron'] },
  { name: 'Lime oil expressed', casNumber: '8008-26-2', maxPercent: 0.7, category: 'Leave-on', reason: 'Phototoxicity', aliases: ['lime', 'citron vert'] },
  { name: 'Grapefruit oil', casNumber: '8016-20-4', maxPercent: 4.0, category: 'Leave-on', reason: 'Phototoxicity', aliases: ['pamplemousse', 'huile de pamplemousse'] },
  { name: 'Orange oil bitter', casNumber: '68916-04-1', maxPercent: 1.25, category: 'Leave-on', reason: 'Phototoxicity', aliases: ['orange amère', 'bigarade'] },
  { name: 'Angelica root oil', casNumber: '8015-64-3', maxPercent: 0.8, category: 'Leave-on', reason: 'Phototoxicity', aliases: ['angélique', 'racine d\'angélique'] },
  { name: 'Cumin oil', casNumber: '8014-13-9', maxPercent: 0.4, category: 'Leave-on', reason: 'Phototoxicity', aliases: ['cumin', 'huile de cumin'] },
  
  // Sensitizers (mosses and woods)
  { name: 'Oakmoss absolute', casNumber: '9000-50-4', maxPercent: 0.1, category: 'Leave-on', reason: 'Sensitization (atranol)', aliases: ['mousse de chêne', 'oakmoss'] },
  { name: 'Treemoss absolute', casNumber: '90028-67-4', maxPercent: 0.1, category: 'Leave-on', reason: 'Sensitization', aliases: ['mousse d\'arbre', 'treemoss'] },
  
  // Spice-derived sensitizers
  { name: 'Cinnamon bark oil', casNumber: '8015-91-6', maxPercent: 0.07, category: 'Leave-on', reason: 'Sensitization (cinnamaldehyde)', aliases: ['cannelle', 'écorce de cannelle'] },
  { name: 'Cinnamaldehyde', casNumber: '104-55-2', maxPercent: 0.05, category: 'Leave-on', reason: 'Sensitization', aliases: ['cinnamaldéhyde', 'aldéhyde cinnamique'] },
  { name: 'Cinnamic alcohol', casNumber: '104-54-1', maxPercent: 0.8, category: 'Leave-on', reason: 'Sensitization', aliases: ['alcool cinnamique'] },
  { name: 'Eugenol', casNumber: '97-53-0', maxPercent: 0.5, category: 'Leave-on', reason: 'Sensitization', aliases: ['eugénol'] },
  { name: 'Isoeugenol', casNumber: '97-54-1', maxPercent: 0.02, category: 'Leave-on', reason: 'Sensitization', aliases: ['isoeugénol'] },
  
  // Common fragrance allergens
  { name: 'Hydroxycitronellal', casNumber: '107-75-5', maxPercent: 1.0, category: 'Leave-on', reason: 'Sensitization', aliases: ['hydroxycitronellal'] },
  { name: 'Citral', casNumber: '5392-40-5', maxPercent: 0.6, category: 'Leave-on', reason: 'Sensitization', aliases: ['citral', 'géranial', 'néral'] },
  { name: 'Coumarin', casNumber: '91-64-5', maxPercent: 0.7, category: 'Leave-on', reason: 'Sensitization', aliases: ['coumarine'] },
  { name: 'Farnesol', casNumber: '4602-84-0', maxPercent: 1.2, category: 'Leave-on', reason: 'Sensitization', aliases: ['farnésol'] },
  { name: 'Geraniol', casNumber: '106-24-1', maxPercent: 5.3, category: 'Leave-on', reason: 'Sensitization', aliases: ['géraniol'] },
  { name: 'Linalool', casNumber: '78-70-6', maxPercent: 10.0, category: 'Leave-on', reason: 'Sensitization (oxidized)', aliases: ['linalol'] },
  { name: 'Limonene', casNumber: '5989-27-5', maxPercent: 15.0, category: 'Leave-on', reason: 'Sensitization (oxidized)', aliases: ['limonène', 'd-limonène'] },
  { name: 'Citronellol', casNumber: '106-22-9', maxPercent: 8.5, category: 'Leave-on', reason: 'Sensitization', aliases: ['citronellol'] },
  
  // Carcinogenic concerns (very low limits)
  { name: 'Methyl eugenol', casNumber: '93-15-2', maxPercent: 0.0004, category: 'Leave-on', reason: 'Carcinogenicity', aliases: ['méthyl eugénol', 'méthyleugénol'] },
  { name: 'Estragole', casNumber: '140-67-0', maxPercent: 0.01, category: 'Leave-on', reason: 'Carcinogenicity', aliases: ['estragole', 'méthyl chavicol'] },
  
  // Benzyl derivatives
  { name: 'Benzyl alcohol', casNumber: '100-51-6', maxPercent: 1.0, category: 'Leave-on', reason: 'Sensitization', aliases: ['alcool benzylique'] },
  { name: 'Benzyl benzoate', casNumber: '120-51-4', maxPercent: 10.0, category: 'Leave-on', reason: 'Sensitization', aliases: ['benzoate de benzyle'] },
  { name: 'Benzyl cinnamate', casNumber: '103-41-3', maxPercent: 2.0, category: 'Leave-on', reason: 'Sensitization', aliases: ['cinnamate de benzyle'] },
  { name: 'Benzyl salicylate', casNumber: '118-58-1', maxPercent: 0.2, category: 'Leave-on', reason: 'Sensitization', aliases: ['salicylate de benzyle'] },
  
  // Aldehydes
  { name: 'Amyl cinnamal', casNumber: '122-40-7', maxPercent: 0.05, category: 'Leave-on', reason: 'Sensitization', aliases: ['amyl cinnamal', 'alpha-amylcinnamaldéhyde'] },
  { name: 'Hexyl cinnamal', casNumber: '101-86-0', maxPercent: 0.5, category: 'Leave-on', reason: 'Sensitization', aliases: ['hexyl cinnamal'] },
  
  // Recently restricted/banned
  { name: 'Lyral (HICC)', casNumber: '31906-04-4', maxPercent: 0.02, category: 'Leave-on', reason: 'Sensitization', aliases: ['lyral', 'hicc'] },
  { name: 'Lilial (butylphenyl methylpropional)', casNumber: '80-54-6', maxPercent: 0.0, category: 'Leave-on', reason: 'Reproductive toxicity (banned EU 2022)', aliases: ['lilial', 'butylphényl méthylpropional'] },
  
  // Musks
  { name: 'Musk ketone', casNumber: '81-14-1', maxPercent: 1.4, category: 'Leave-on', reason: 'Environmental concerns', aliases: ['musc cétone', 'musk ketone'] },
  { name: 'Musk xylene', casNumber: '81-15-2', maxPercent: 1.0, category: 'Leave-on', reason: 'Environmental concerns', aliases: ['musc xylène', 'musk xylene'] },
  
  // Alpha-isomethyl ionone
  { name: 'Alpha-isomethyl ionone', casNumber: '127-51-5', maxPercent: 1.8, category: 'Leave-on', reason: 'Sensitization', aliases: ['alpha-isométhyl ionone', 'isométhyl ionone'] },
  
  // Anise alcohol
  { name: 'Anise alcohol', casNumber: '105-13-5', maxPercent: 1.0, category: 'Leave-on', reason: 'Sensitization', aliases: ['alcool anisique', 'anisyl alcohol'] },
  
  // Evernia
  { name: 'Evernia prunastri extract', casNumber: '90028-68-5', maxPercent: 0.1, category: 'Leave-on', reason: 'Sensitization', aliases: ['extrait d\'evernia prunastri', 'mousse de chêne'] },
  { name: 'Evernia furfuracea extract', casNumber: '90028-67-4', maxPercent: 0.1, category: 'Leave-on', reason: 'Sensitization', aliases: ['extrait d\'evernia furfuracea', 'mousse d\'arbre'] },
];

const IFRA_SPECIFICATION_REQUIRED: Array<{ 
  name: string; 
  casNumber: string; 
  specification: string;
  aliases?: string[];
}> = [
  { name: 'Peru balsam', casNumber: '8007-00-9', specification: 'Max 0.4% in leave-on', aliases: ['baume du pérou'] },
  { name: 'Styrax', casNumber: '8024-01-9', specification: 'Max 0.6% in leave-on', aliases: ['styrax', 'benjoin'] },
  { name: 'Tolu balsam', casNumber: '9000-64-0', specification: 'Max 0.4% in leave-on', aliases: ['baume de tolu'] },
  { name: 'Ylang ylang oil', casNumber: '8006-81-3', specification: 'Isoeugenol content must be specified', aliases: ['ylang ylang', 'ylang-ylang'] },
  { name: 'Clove oil', casNumber: '8000-34-8', specification: 'Eugenol content must be specified', aliases: ['girofle', 'huile de girofle', 'clou de girofle'] },
  { name: 'Cinnamon leaf oil', casNumber: '8015-91-6', specification: 'Eugenol content must be specified', aliases: ['feuille de cannelle'] },
  { name: 'Basil oil', casNumber: '8015-73-4', specification: 'Methyl eugenol content must be specified', aliases: ['basilic', 'huile de basilic'] },
  { name: 'Tarragon oil', casNumber: '8016-88-4', specification: 'Estragole content must be specified', aliases: ['estragon', 'huile d\'estragon'] },
  { name: 'Jasmine absolute', casNumber: '8022-96-6', specification: 'Benzyl benzoate content must be specified', aliases: ['jasmin absolu', 'absolu de jasmin'] },
  { name: 'Rose absolute', casNumber: '8007-01-0', specification: 'Citronellol and geraniol content must be specified', aliases: ['rose absolue', 'absolu de rose'] },
  { name: 'Lavender oil', casNumber: '8000-28-0', specification: 'Linalool content must be specified', aliases: ['lavande', 'huile de lavande'] },
];

/**
 * Normalize molecule name for matching
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check if a molecule matches an IFRA entry
 */
function matchesEntry(
  moleculeName: string, 
  casNumber: string | null | undefined, 
  entry: { name: string; casNumber: string; aliases?: string[] }
): boolean {
  // Match by CAS number (most reliable)
  if (casNumber && entry.casNumber && entry.casNumber !== 'various') {
    if (casNumber.trim() === entry.casNumber.trim()) {
      return true;
    }
  }
  
  // Match by name
  const normalizedMolecule = normalizeName(moleculeName);
  const normalizedEntry = normalizeName(entry.name);
  
  if (normalizedMolecule === normalizedEntry) {
    return true;
  }
  
  // Check if molecule name contains entry name or vice versa
  if (normalizedMolecule.includes(normalizedEntry) || normalizedEntry.includes(normalizedMolecule)) {
    return true;
  }
  
  // Match by aliases
  if (entry.aliases) {
    for (const alias of entry.aliases) {
      const normalizedAlias = normalizeName(alias);
      if (normalizedMolecule === normalizedAlias || 
          normalizedMolecule.includes(normalizedAlias) || 
          normalizedAlias.includes(normalizedMolecule)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Get IFRA regulatory data for a molecule
 */
export function getIFRAData(moleculeName: string, casNumber?: string | null): IFRAData {
  // Check if banned
  const banned = IFRA_BANNED.find(entry => matchesEntry(moleculeName, casNumber, entry));
  if (banned) {
    return {
      status: 'banned',
      reason: banned.reason,
      name: banned.name,
      casNumber: banned.casNumber,
    };
  }
  
  // Check if restricted
  const restricted = IFRA_RESTRICTED.find(entry => matchesEntry(moleculeName, casNumber, entry));
  if (restricted) {
    return {
      status: 'restricted',
      maxPercent: restricted.maxPercent,
      category: restricted.category,
      reason: restricted.reason,
      name: restricted.name,
      casNumber: restricted.casNumber,
    };
  }
  
  // Check if specification required
  const specRequired = IFRA_SPECIFICATION_REQUIRED.find(entry => matchesEntry(moleculeName, casNumber, entry));
  if (specRequired) {
    return {
      status: 'specification_required',
      specification: specRequired.specification,
      name: specRequired.name,
      casNumber: specRequired.casNumber,
    };
  }
  
  // Not regulated
  return {
    status: 'not_regulated',
  };
}

/**
 * Get all IFRA restrictions (for reference/display)
 */
export function getAllIFRARestrictions(): {
  banned: typeof IFRA_BANNED;
  restricted: typeof IFRA_RESTRICTED;
  specificationRequired: typeof IFRA_SPECIFICATION_REQUIRED;
} {
  return {
    banned: IFRA_BANNED,
    restricted: IFRA_RESTRICTED,
    specificationRequired: IFRA_SPECIFICATION_REQUIRED,
  };
}

/**
 * Get statistics about IFRA database
 */
export function getIFRAStats(): {
  totalBanned: number;
  totalRestricted: number;
  totalSpecRequired: number;
  total: number;
} {
  return {
    totalBanned: IFRA_BANNED.length,
    totalRestricted: IFRA_RESTRICTED.length,
    totalSpecRequired: IFRA_SPECIFICATION_REQUIRED.length,
    total: IFRA_BANNED.length + IFRA_RESTRICTED.length + IFRA_SPECIFICATION_REQUIRED.length,
  };
}
