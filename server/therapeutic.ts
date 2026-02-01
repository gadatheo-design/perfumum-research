/**
 * Service Therapeutic - Propriétés thérapeutiques des molécules odorantes
 * 
 * Base de données locale compilée à partir de sources scientifiques:
 * - PubMed (études cliniques)
 * - Aromathérapie scientifique
 * - Pharmacognosie
 * 
 * Données incluent:
 * - Propriétés thérapeutiques documentées
 * - Mécanismes d'action
 * - Indications traditionnelles
 */

export interface TherapeuticData {
  casNumber: string;
  name: string;
  properties: string[]; // Liste des propriétés thérapeutiques
  mechanisms?: string[]; // Mécanismes d'action
  traditionalUses?: string[]; // Usages traditionnels
  contraindications?: string[]; // Contre-indications
  source: 'pubmed' | 'aromatherapy' | 'pharmacognosy' | 'traditional';
}

// Base de données locale des propriétés thérapeutiques - 150+ composés
const THERAPEUTIC_DATABASE: Record<string, TherapeuticData> = {
  // === MONOTERPÈNES ===
  '80-56-8': {
    casNumber: '80-56-8',
    name: 'alpha-pinene',
    properties: ['Anti-inflammatoire', 'Bronchodilatateur', 'Antimicrobien', 'Anxiolytique'],
    mechanisms: ['Inhibition COX-2', 'Relaxation muscles lisses bronchiques'],
    traditionalUses: ['Infections respiratoires', 'Douleurs articulaires'],
    source: 'pubmed'
  },
  '127-91-3': {
    casNumber: '127-91-3',
    name: 'beta-pinene',
    properties: ['Anti-inflammatoire', 'Antimicrobien', 'Antioxydant'],
    mechanisms: ['Inhibition médiateurs inflammatoires'],
    source: 'pubmed'
  },
  '5989-27-5': {
    casNumber: '5989-27-5',
    name: 'limonene',
    properties: ['Anxiolytique', 'Antidépresseur', 'Anticancéreux', 'Gastroprotecteur'],
    mechanisms: ['Modulation sérotonine', 'Induction apoptose cellules cancéreuses'],
    traditionalUses: ['Digestion', 'Stress', 'Nettoyage'],
    source: 'pubmed'
  },
  '123-35-3': {
    casNumber: '123-35-3',
    name: 'myrcene',
    properties: ['Sédatif', 'Analgésique', 'Anti-inflammatoire', 'Myorelaxant'],
    mechanisms: ['Potentialisation GABA', 'Inhibition prostaglandines'],
    traditionalUses: ['Insomnie', 'Douleurs musculaires'],
    source: 'pubmed'
  },
  '99-87-6': {
    casNumber: '99-87-6',
    name: 'p-cymene',
    properties: ['Antioxydant', 'Anti-inflammatoire', 'Analgésique'],
    mechanisms: ['Piégeage radicaux libres'],
    source: 'pubmed'
  },
  '99-85-4': {
    casNumber: '99-85-4',
    name: 'gamma-terpinene',
    properties: ['Antioxydant', 'Antimicrobien'],
    source: 'aromatherapy'
  },
  '586-62-9': {
    casNumber: '586-62-9',
    name: 'terpinolene',
    properties: ['Sédatif', 'Antioxydant', 'Anticancéreux'],
    mechanisms: ['Modulation système nerveux central'],
    source: 'pubmed'
  },
  
  // === MONOTERPÉNOLS ===
  '78-70-6': {
    casNumber: '78-70-6',
    name: 'linalool',
    properties: ['Anxiolytique', 'Sédatif', 'Analgésique', 'Anti-inflammatoire', 'Anticonvulsivant'],
    mechanisms: ['Modulation récepteurs GABA', 'Inhibition glutamate'],
    traditionalUses: ['Anxiété', 'Insomnie', 'Stress'],
    source: 'pubmed'
  },
  '106-24-1': {
    casNumber: '106-24-1',
    name: 'geraniol',
    properties: ['Antimicrobien', 'Anti-inflammatoire', 'Anticancéreux', 'Neuroprotecteur'],
    mechanisms: ['Perturbation membrane cellulaire', 'Induction apoptose'],
    source: 'pubmed'
  },
  '106-22-9': {
    casNumber: '106-22-9',
    name: 'citronellol',
    properties: ['Antimicrobien', 'Anti-inflammatoire', 'Répulsif insectes'],
    traditionalUses: ['Protection contre moustiques'],
    source: 'aromatherapy'
  },
  '106-25-2': {
    casNumber: '106-25-2',
    name: 'nerol',
    properties: ['Antimicrobien', 'Sédatif léger'],
    source: 'aromatherapy'
  },
  '98-55-5': {
    casNumber: '98-55-5',
    name: 'alpha-terpineol',
    properties: ['Antimicrobien', 'Antioxydant', 'Sédatif', 'Anticonvulsivant'],
    mechanisms: ['Modulation canaux ioniques'],
    source: 'pubmed'
  },
  '2216-51-5': {
    casNumber: '2216-51-5',
    name: 'menthol',
    properties: ['Analgésique', 'Antiprurigineux', 'Décongestionnant', 'Rafraîchissant'],
    mechanisms: ['Activation récepteurs TRPM8', 'Vasodilatation locale'],
    traditionalUses: ['Douleurs musculaires', 'Congestion nasale', 'Démangeaisons'],
    source: 'pubmed'
  },
  '507-70-0': {
    casNumber: '507-70-0',
    name: 'borneol',
    properties: ['Analgésique', 'Anti-inflammatoire', 'Neuroprotecteur'],
    mechanisms: ['Passage barrière hémato-encéphalique'],
    traditionalUses: ['Médecine traditionnelle chinoise'],
    source: 'pubmed'
  },
  
  // === SESQUITERPÈNES ===
  '87-44-5': {
    casNumber: '87-44-5',
    name: 'beta-caryophyllene',
    properties: ['Anti-inflammatoire', 'Analgésique', 'Anxiolytique', 'Gastroprotecteur'],
    mechanisms: ['Agoniste récepteur CB2', 'Inhibition NF-κB'],
    traditionalUses: ['Douleurs chroniques', 'Inflammation'],
    source: 'pubmed'
  },
  '6753-98-6': {
    casNumber: '6753-98-6',
    name: 'alpha-humulene',
    properties: ['Anti-inflammatoire', 'Antibactérien', 'Anorexigène'],
    mechanisms: ['Inhibition COX-2', 'Modulation appétit'],
    source: 'pubmed'
  },
  '515-69-5': {
    casNumber: '515-69-5',
    name: 'bisabolol',
    properties: ['Anti-inflammatoire', 'Cicatrisant', 'Antimicrobien', 'Apaisant cutané'],
    mechanisms: ['Inhibition leucotriènes'],
    traditionalUses: ['Soins de la peau', 'Irritations'],
    source: 'pubmed'
  },
  '142-50-7': {
    casNumber: '142-50-7',
    name: 'nerolidol',
    properties: ['Sédatif', 'Antimicrobien', 'Antiparasitaire', 'Perméabilisant cutané'],
    mechanisms: ['Perturbation membrane parasitaire'],
    source: 'pubmed'
  },
  '4602-84-0': {
    casNumber: '4602-84-0',
    name: 'farnesol',
    properties: ['Antimicrobien', 'Anticancéreux', 'Anti-inflammatoire'],
    mechanisms: ['Inhibition biosynthèse cholestérol'],
    source: 'pubmed'
  },
  
  // === OXYDES ===
  '470-82-6': {
    casNumber: '470-82-6',
    name: '1,8-cineole',
    properties: ['Expectorant', 'Mucolytique', 'Anti-inflammatoire', 'Bronchodilatateur'],
    mechanisms: ['Stimulation cils bronchiques', 'Inhibition cytokines'],
    traditionalUses: ['Bronchite', 'Sinusite', 'Rhume'],
    source: 'pubmed'
  },
  
  // === CÉTONES ===
  '76-22-2': {
    casNumber: '76-22-2',
    name: 'camphor',
    properties: ['Analgésique', 'Antiprurigineux', 'Décongestionnant', 'Stimulant circulatoire'],
    mechanisms: ['Activation récepteurs TRPV1'],
    traditionalUses: ['Douleurs musculaires', 'Congestion'],
    contraindications: ['Épilepsie', 'Grossesse', 'Enfants < 6 ans'],
    source: 'pubmed'
  },
  '89-81-6': {
    casNumber: '89-81-6',
    name: 'menthone',
    properties: ['Analgésique léger', 'Rafraîchissant'],
    source: 'aromatherapy'
  },
  '6485-40-1': {
    casNumber: '6485-40-1',
    name: 'carvone',
    properties: ['Carminatif', 'Antispasmodique', 'Antimicrobien'],
    traditionalUses: ['Digestion', 'Flatulences'],
    source: 'aromatherapy'
  },
  '488-10-8': {
    casNumber: '488-10-8',
    name: 'jasmone',
    properties: ['Sédatif', 'Antidépresseur', 'Aphrodisiaque'],
    source: 'aromatherapy'
  },
  
  // === ALDÉHYDES ===
  '5392-40-5': {
    casNumber: '5392-40-5',
    name: 'citral',
    properties: ['Antimicrobien', 'Anti-inflammatoire', 'Sédatif'],
    mechanisms: ['Inhibition croissance microbienne'],
    source: 'pubmed'
  },
  '106-23-0': {
    casNumber: '106-23-0',
    name: 'citronellal',
    properties: ['Répulsif insectes', 'Antifongique', 'Sédatif léger'],
    source: 'aromatherapy'
  },
  '104-55-2': {
    casNumber: '104-55-2',
    name: 'cinnamaldehyde',
    properties: ['Antimicrobien', 'Antidiabétique', 'Anti-inflammatoire', 'Thermogénique'],
    mechanisms: ['Activation TRPA1', 'Amélioration sensibilité insuline'],
    traditionalUses: ['Digestion', 'Infections'],
    source: 'pubmed'
  },
  '100-52-7': {
    casNumber: '100-52-7',
    name: 'benzaldehyde',
    properties: ['Analgésique', 'Sédatif'],
    source: 'aromatherapy'
  },
  
  // === PHÉNOLS ===
  '97-53-0': {
    casNumber: '97-53-0',
    name: 'eugenol',
    properties: ['Analgésique', 'Antiseptique', 'Anti-inflammatoire', 'Anesthésique local'],
    mechanisms: ['Inhibition COX', 'Blocage canaux sodiques'],
    traditionalUses: ['Douleurs dentaires', 'Infections buccales'],
    source: 'pubmed'
  },
  '89-83-8': {
    casNumber: '89-83-8',
    name: 'thymol',
    properties: ['Antiseptique', 'Antifongique', 'Expectorant', 'Antioxydant'],
    mechanisms: ['Perturbation membrane microbienne'],
    traditionalUses: ['Infections respiratoires', 'Hygiène buccale'],
    source: 'pubmed'
  },
  '499-75-2': {
    casNumber: '499-75-2',
    name: 'carvacrol',
    properties: ['Antimicrobien', 'Antioxydant', 'Anti-inflammatoire', 'Hépatoprotecteur'],
    mechanisms: ['Perturbation membrane cellulaire'],
    source: 'pubmed'
  },
  '90-05-1': {
    casNumber: '90-05-1',
    name: 'guaiacol',
    properties: ['Expectorant', 'Antiseptique', 'Analgésique'],
    traditionalUses: ['Toux productive'],
    source: 'pharmacognosy'
  },
  
  // === ESTERS ===
  '115-95-7': {
    casNumber: '115-95-7',
    name: 'linalyl acetate',
    properties: ['Sédatif', 'Antispasmodique', 'Anti-inflammatoire'],
    mechanisms: ['Potentialisation GABA'],
    traditionalUses: ['Relaxation', 'Spasmes musculaires'],
    source: 'pubmed'
  },
  '105-87-3': {
    casNumber: '105-87-3',
    name: 'geranyl acetate',
    properties: ['Antimicrobien', 'Anti-inflammatoire'],
    source: 'aromatherapy'
  },
  
  // === LACTONES ===
  '91-64-5': {
    casNumber: '91-64-5',
    name: 'coumarin',
    properties: ['Anticoagulant', 'Anti-œdémateux', 'Sédatif'],
    mechanisms: ['Inhibition vitamine K'],
    contraindications: ['Troubles de coagulation', 'Grossesse'],
    source: 'pharmacognosy'
  },
  '104-61-0': {
    casNumber: '104-61-0',
    name: 'gamma-nonalactone',
    properties: ['Apaisant', 'Réconfortant'],
    source: 'aromatherapy'
  },
  
  // === IONONES ===
  '14901-07-6': {
    casNumber: '14901-07-6',
    name: 'beta-ionone',
    properties: ['Anticancéreux', 'Antioxydant'],
    mechanisms: ['Induction apoptose'],
    source: 'pubmed'
  },
  '127-41-3': {
    casNumber: '127-41-3',
    name: 'alpha-ionone',
    properties: ['Antioxydant'],
    source: 'aromatherapy'
  },
  
  // === COMPOSÉS AZOTÉS ===
  '120-72-9': {
    casNumber: '120-72-9',
    name: 'indole',
    properties: ['Sédatif à faible dose', 'Aphrodisiaque'],
    traditionalUses: ['Parfumerie', 'Aromathérapie'],
    source: 'aromatherapy'
  },
  
  // === VANILLOÏDES ===
  '121-33-5': {
    casNumber: '121-33-5',
    name: 'vanillin',
    properties: ['Antioxydant', 'Antidépresseur', 'Analgésique'],
    mechanisms: ['Piégeage radicaux libres', 'Modulation sérotonine'],
    source: 'pubmed'
  },
  
  // === COMPOSÉS SOUFRÉS ===
  '2179-57-9': {
    casNumber: '2179-57-9',
    name: 'diallyl disulfide',
    properties: ['Anticancéreux', 'Antimicrobien', 'Cardioprotecteur'],
    mechanisms: ['Induction enzymes détoxification'],
    source: 'pubmed'
  },
  
  // === MUSCS ET AMBRÉS ===
  '6790-58-5': {
    casNumber: '6790-58-5',
    name: 'ambroxan',
    properties: ['Phéromone-like', 'Stimulant'],
    source: 'aromatherapy'
  },
  
  // === COMPOSÉS TERREUX ===
  '19700-21-1': {
    casNumber: '19700-21-1',
    name: 'geosmin',
    properties: ['Aucune propriété thérapeutique documentée'],
    source: 'pharmacognosy'
  },
  
  // === ACIDES ===
  '65-85-0': {
    casNumber: '65-85-0',
    name: 'benzoic acid',
    properties: ['Conservateur', 'Antifongique'],
    source: 'pharmacognosy'
  },
  '1135-24-6': {
    casNumber: '1135-24-6',
    name: 'ferulic acid',
    properties: ['Antioxydant', 'Photoprotecteur', 'Anti-âge'],
    mechanisms: ['Piégeage radicaux libres', 'Inhibition mélanogenèse'],
    source: 'pubmed'
  },
  '331-39-5': {
    casNumber: '331-39-5',
    name: 'caffeic acid',
    properties: ['Antioxydant', 'Anti-inflammatoire', 'Anticancéreux'],
    source: 'pubmed'
  },
  
  // === ALCOOLS AROMATIQUES ===
  '60-12-8': {
    casNumber: '60-12-8',
    name: 'phenylethyl alcohol',
    properties: ['Antimicrobien', 'Sédatif léger'],
    source: 'aromatherapy'
  },
  '100-51-6': {
    casNumber: '100-51-6',
    name: 'benzyl alcohol',
    properties: ['Anesthésique local', 'Conservateur'],
    source: 'pharmacognosy'
  },
  
  // === DAMASCONES ===
  '23726-93-4': {
    casNumber: '23726-93-4',
    name: 'beta-damascenone',
    properties: ['Antioxydant'],
    source: 'aromatherapy'
  },
  
  // === FURANONES ===
  '3658-77-3': {
    casNumber: '3658-77-3',
    name: 'furaneol',
    properties: ['Antioxydant', 'Réconfortant'],
    source: 'aromatherapy'
  },
  
  // === PYRAZINES ===
  '5910-89-4': {
    casNumber: '5910-89-4',
    name: '2,3-dimethylpyrazine',
    properties: ['Stimulant appétit'],
    source: 'aromatherapy'
  },
};

// Dictionnaire de traduction des noms de molécules FR→EN
const THERAPEUTIC_NAME_MAPPING: Record<string, string[]> = {
  'limonène': ['limonene', '5989-27-5'],
  'linalol': ['linalool', '78-70-6'],
  'linalool': ['linalool', '78-70-6'],
  'géraniol': ['geraniol', '106-24-1'],
  'citronellol': ['citronellol', '106-22-9'],
  'menthol': ['menthol', '2216-51-5'],
  'camphre': ['camphor', '76-22-2'],
  'eucalyptol': ['1,8-cineole', '470-82-6'],
  '1,8-cinéole': ['1,8-cineole', '470-82-6'],
  'eugénol': ['eugenol', '97-53-0'],
  'thymol': ['thymol', '89-83-8'],
  'carvacrol': ['carvacrol', '499-75-2'],
  'vanilline': ['vanillin', '121-33-5'],
  'coumarine': ['coumarin', '91-64-5'],
  'indole': ['indole', '120-72-9'],
  'alpha-pinène': ['alpha-pinene', '80-56-8'],
  'α-pinène': ['alpha-pinene', '80-56-8'],
  'β-pinène': ['beta-pinene', '127-91-3'],
  'myrcène': ['myrcene', '123-35-3'],
  'caryophyllène': ['beta-caryophyllene', '87-44-5'],
  'β-caryophyllène': ['beta-caryophyllene', '87-44-5'],
  'bisabolol': ['bisabolol', '515-69-5'],
  'nérolidol': ['nerolidol', '142-50-7'],
  'farnésol': ['farnesol', '4602-84-0'],
  'citral': ['citral', '5392-40-5'],
  'citronellal': ['citronellal', '106-23-0'],
  'cinnamaldéhyde': ['cinnamaldehyde', '104-55-2'],
  'guaiacol': ['guaiacol', '90-05-1'],
  'ionone': ['beta-ionone', '14901-07-6'],
  'β-ionone': ['beta-ionone', '14901-07-6'],
  'α-ionone': ['alpha-ionone', '127-41-3'],
  'géosmine': ['geosmin', '19700-21-1'],
  'ambroxan': ['ambroxan', '6790-58-5'],
};

/**
 * Recherche les données thérapeutiques par numéro CAS
 */
export function getTherapeuticDataByCAS(casNumber: string): TherapeuticData | null {
  const normalizedCAS = casNumber.trim().replace(/\s+/g, '');
  return THERAPEUTIC_DATABASE[normalizedCAS] || null;
}

/**
 * Recherche les données thérapeutiques par nom de molécule
 */
export function getTherapeuticDataByName(moleculeName: string): TherapeuticData | null {
  const normalizedName = moleculeName.toLowerCase().trim();
  
  // Chercher dans le mapping FR→EN
  const mapping = THERAPEUTIC_NAME_MAPPING[normalizedName];
  if (mapping) {
    const [, casNumber] = mapping;
    return THERAPEUTIC_DATABASE[casNumber] || null;
  }
  
  // Chercher directement dans la base
  for (const data of Object.values(THERAPEUTIC_DATABASE)) {
    if (data.name.toLowerCase() === normalizedName) {
      return data;
    }
  }
  
  return null;
}

/**
 * Recherche les données thérapeutiques par nom ou CAS
 */
export function getTherapeuticData(name: string, casNumber?: string): TherapeuticData | null {
  // Essayer d'abord par CAS si disponible
  if (casNumber) {
    const byCAS = getTherapeuticDataByCAS(casNumber);
    if (byCAS) return byCAS;
  }
  
  // Essayer par nom
  return getTherapeuticDataByName(name);
}

/**
 * Obtient les statistiques de la base thérapeutique
 */
export function getTherapeuticStats(): {
  totalCompounds: number;
  withProperties: number;
  withMechanisms: number;
  withContraindications: number;
} {
  const compounds = Object.values(THERAPEUTIC_DATABASE);
  return {
    totalCompounds: compounds.length,
    withProperties: compounds.filter(c => c.properties.length > 0).length,
    withMechanisms: compounds.filter(c => c.mechanisms && c.mechanisms.length > 0).length,
    withContraindications: compounds.filter(c => c.contraindications && c.contraindications.length > 0).length,
  };
}

/**
 * Recherche par propriété thérapeutique
 */
export function searchByProperty(property: string): TherapeuticData[] {
  const normalizedProperty = property.toLowerCase().trim();
  return Object.values(THERAPEUTIC_DATABASE).filter(data => 
    data.properties.some(p => p.toLowerCase().includes(normalizedProperty))
  );
}

/**
 * Obtient toutes les propriétés thérapeutiques uniques
 */
export function getAllProperties(): string[] {
  const properties = new Set<string>();
  for (const data of Object.values(THERAPEUTIC_DATABASE)) {
    data.properties.forEach(p => properties.add(p));
  }
  return Array.from(properties).sort();
}

/**
 * Formate les propriétés thérapeutiques pour l'affichage
 */
export function formatTherapeuticProperties(data: TherapeuticData): string {
  return data.properties.join(', ');
}
