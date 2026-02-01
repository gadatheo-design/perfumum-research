/**
 * Molecular Synergies Service
 * 
 * Base de données des synergies moléculaires en parfumerie et aromathérapie:
 * - Masquage: une molécule masque l'odeur d'une autre
 * - Neutralisation: deux molécules s'annulent mutuellement
 * - Potentialisation: deux molécules amplifient leurs effets
 * - Stabilisation: une molécule stabilise une autre
 * - Transformation: interaction créant une nouvelle note olfactive
 * 
 * Sources: littérature scientifique en parfumerie, études GC-MS, 
 * publications sur les interactions moléculaires olfactives
 */

export type SynergyType = 'masquage' | 'neutralisation' | 'potentialisation' | 'stabilisation' | 'transformation';

export interface MolecularSynergy {
  molecule1Name: string;
  molecule1CAS?: string;
  molecule2Name: string;
  molecule2CAS?: string;
  type: SynergyType;
  description: string;
  chemicalMechanism?: string;
  applications?: string;
  source: 'scientific' | 'empirical' | 'traditional';
  strength: 'forte' | 'moyenne' | 'faible';
}

// Base de données des synergies moléculaires documentées
export const MOLECULAR_SYNERGIES: MolecularSynergy[] = [
  // ============================================================================
  // SYNERGIES DE MASQUAGE
  // ============================================================================
  
  // Masquage des notes soufrées
  {
    molecule1Name: 'Linalool',
    molecule1CAS: '78-70-6',
    molecule2Name: 'Dimethyl sulfide',
    molecule2CAS: '75-18-3',
    type: 'masquage',
    description: 'Le linalool masque efficacement les notes soufrées désagréables',
    chemicalMechanism: 'Compétition pour les récepteurs olfactifs OR2W1',
    applications: 'Parfumerie fine, désodorisation',
    source: 'scientific',
    strength: 'forte'
  },
  {
    molecule1Name: 'Citral',
    molecule1CAS: '5392-40-5',
    molecule2Name: 'Hydrogen sulfide',
    type: 'masquage',
    description: 'Le citral masque les odeurs de soufre par dominance olfactive',
    applications: 'Produits ménagers, cosmétiques',
    source: 'empirical',
    strength: 'forte'
  },
  {
    molecule1Name: 'Eugenol',
    molecule1CAS: '97-53-0',
    molecule2Name: 'Skatole',
    molecule2CAS: '83-34-1',
    type: 'masquage',
    description: 'L\'eugénol masque les notes fécales du skatole',
    chemicalMechanism: 'Saturation des récepteurs olfactifs par l\'eugénol',
    applications: 'Parfumerie orientale, désodorisation',
    source: 'scientific',
    strength: 'forte'
  },
  
  // Masquage des notes animales
  {
    molecule1Name: 'Vanillin',
    molecule1CAS: '121-33-5',
    molecule2Name: 'Indole',
    molecule2CAS: '120-72-9',
    type: 'masquage',
    description: 'La vanilline adoucit et masque les notes animales de l\'indole',
    applications: 'Parfumerie florale, compositions jasmin',
    source: 'empirical',
    strength: 'moyenne'
  },
  {
    molecule1Name: 'Coumarin',
    molecule1CAS: '91-64-5',
    molecule2Name: 'Civetone',
    molecule2CAS: '542-46-1',
    type: 'masquage',
    description: 'La coumarine adoucit les notes animales musquées',
    applications: 'Parfumerie masculine, fougères',
    source: 'traditional',
    strength: 'moyenne'
  },
  
  // Masquage des notes vertes agressives
  {
    molecule1Name: 'Linalyl acetate',
    molecule1CAS: '115-95-7',
    molecule2Name: 'cis-3-Hexenol',
    molecule2CAS: '928-96-1',
    type: 'masquage',
    description: 'L\'acétate de linalyle adoucit les notes vertes coupantes',
    applications: 'Parfumerie florale, notes lavande',
    source: 'empirical',
    strength: 'moyenne'
  },
  {
    molecule1Name: 'Benzyl acetate',
    molecule1CAS: '140-11-4',
    molecule2Name: 'Hexanal',
    molecule2CAS: '66-25-1',
    type: 'masquage',
    description: 'L\'acétate de benzyle masque les notes vertes aldéhydiques',
    applications: 'Compositions florales, jasmin',
    source: 'empirical',
    strength: 'moyenne'
  },
  
  // Masquage des notes médicinales
  {
    molecule1Name: 'Geraniol',
    molecule1CAS: '106-24-1',
    molecule2Name: '1,8-Cineole',
    molecule2CAS: '470-82-6',
    type: 'masquage',
    description: 'Le géraniol masque les notes camphrées médicinales',
    applications: 'Parfumerie florale, rose',
    source: 'empirical',
    strength: 'moyenne'
  },
  {
    molecule1Name: 'Phenylethyl alcohol',
    molecule1CAS: '60-12-8',
    molecule2Name: 'Camphor',
    molecule2CAS: '76-22-2',
    type: 'masquage',
    description: 'L\'alcool phényléthylique masque les notes camphrées',
    applications: 'Parfumerie rose, compositions florales',
    source: 'traditional',
    strength: 'moyenne'
  },
  
  // ============================================================================
  // SYNERGIES DE NEUTRALISATION
  // ============================================================================
  
  // Neutralisation acide-base olfactive
  {
    molecule1Name: 'Citronellol',
    molecule1CAS: '106-22-9',
    molecule2Name: 'Isovaleric acid',
    molecule2CAS: '503-74-2',
    type: 'neutralisation',
    description: 'Le citronellol neutralise les notes acides désagréables',
    chemicalMechanism: 'Interaction électrostatique entre groupes fonctionnels',
    applications: 'Désodorisation, parfumerie',
    source: 'scientific',
    strength: 'forte'
  },
  {
    molecule1Name: 'Benzyl alcohol',
    molecule1CAS: '100-51-6',
    molecule2Name: 'Butyric acid',
    molecule2CAS: '107-92-6',
    type: 'neutralisation',
    description: 'L\'alcool benzylique neutralise les notes rances',
    applications: 'Parfumerie, cosmétiques',
    source: 'empirical',
    strength: 'moyenne'
  },
  
  // Neutralisation des notes piquantes
  {
    molecule1Name: 'Limonene',
    molecule1CAS: '5989-27-5',
    molecule2Name: 'Allyl isothiocyanate',
    molecule2CAS: '57-06-7',
    type: 'neutralisation',
    description: 'Le limonène neutralise les notes piquantes de moutarde',
    applications: 'Industrie alimentaire, parfumerie',
    source: 'scientific',
    strength: 'forte'
  },
  {
    molecule1Name: 'alpha-Pinene',
    molecule1CAS: '80-56-8',
    molecule2Name: 'Ammonia',
    type: 'neutralisation',
    description: 'L\'alpha-pinène neutralise les odeurs ammoniacales',
    chemicalMechanism: 'Réaction chimique avec formation de composés stables',
    applications: 'Désodorisation industrielle',
    source: 'scientific',
    strength: 'forte'
  },
  
  // Neutralisation des notes métalliques
  {
    molecule1Name: 'Menthol',
    molecule1CAS: '2216-51-5',
    molecule2Name: 'Iron oxide',
    type: 'neutralisation',
    description: 'Le menthol masque et neutralise les notes métalliques',
    applications: 'Cosmétiques, soins bucco-dentaires',
    source: 'empirical',
    strength: 'moyenne'
  },
  
  // ============================================================================
  // SYNERGIES DE POTENTIALISATION
  // ============================================================================
  
  // Effet entourage terpénique
  {
    molecule1Name: 'beta-Caryophyllene',
    molecule1CAS: '87-44-5',
    molecule2Name: 'Myrcene',
    molecule2CAS: '123-35-3',
    type: 'potentialisation',
    description: 'Le β-caryophyllène et le myrcène potentialisent leurs effets anti-inflammatoires',
    chemicalMechanism: 'Synergie sur les récepteurs CB2 et voies inflammatoires',
    applications: 'Aromathérapie, cannabis thérapeutique',
    source: 'scientific',
    strength: 'forte'
  },
  {
    molecule1Name: 'Linalool',
    molecule1CAS: '78-70-6',
    molecule2Name: 'Limonene',
    molecule2CAS: '5989-27-5',
    type: 'potentialisation',
    description: 'Le linalool et le limonène amplifient mutuellement leurs effets anxiolytiques',
    chemicalMechanism: 'Modulation synergique des récepteurs GABA et sérotonine',
    applications: 'Aromathérapie, parfumerie thérapeutique',
    source: 'scientific',
    strength: 'forte'
  },
  {
    molecule1Name: 'alpha-Pinene',
    molecule1CAS: '80-56-8',
    molecule2Name: 'beta-Pinene',
    molecule2CAS: '127-91-3',
    type: 'potentialisation',
    description: 'Les deux isomères du pinène amplifient leurs effets bronchodilatateurs',
    chemicalMechanism: 'Action synergique sur les muscles lisses bronchiques',
    applications: 'Aromathérapie respiratoire',
    source: 'scientific',
    strength: 'forte'
  },
  
  // Potentialisation florale
  {
    molecule1Name: 'Geraniol',
    molecule1CAS: '106-24-1',
    molecule2Name: 'Citronellol',
    molecule2CAS: '106-22-9',
    type: 'potentialisation',
    description: 'Le géraniol et le citronellol créent une note rose plus riche et complexe',
    applications: 'Parfumerie rose, compositions florales',
    source: 'traditional',
    strength: 'forte'
  },
  {
    molecule1Name: 'Linalool',
    molecule1CAS: '78-70-6',
    molecule2Name: 'Linalyl acetate',
    molecule2CAS: '115-95-7',
    type: 'potentialisation',
    description: 'Combinaison classique de la lavande, effet calmant amplifié',
    applications: 'Aromathérapie, parfumerie lavande',
    source: 'traditional',
    strength: 'forte'
  },
  
  // Potentialisation boisée
  {
    molecule1Name: 'Cedrol',
    molecule1CAS: '77-53-2',
    molecule2Name: 'Vetiverol',
    type: 'potentialisation',
    description: 'Le cédrol et le vétivérol créent une base boisée profonde et durable',
    applications: 'Parfumerie masculine, bases boisées',
    source: 'traditional',
    strength: 'moyenne'
  },
  {
    molecule1Name: 'alpha-Santalol',
    molecule1CAS: '115-71-9',
    molecule2Name: 'Ambroxan',
    molecule2CAS: '6790-58-5',
    type: 'potentialisation',
    description: 'Le santalol et l\'ambroxan créent une note boisée-ambrée sophistiquée',
    applications: 'Parfumerie de niche, compositions ambrées',
    source: 'empirical',
    strength: 'forte'
  },
  
  // ============================================================================
  // SYNERGIES DE STABILISATION
  // ============================================================================
  
  // Stabilisation des notes volatiles
  {
    molecule1Name: 'Benzyl benzoate',
    molecule1CAS: '120-51-4',
    molecule2Name: 'Citral',
    molecule2CAS: '5392-40-5',
    type: 'stabilisation',
    description: 'Le benzoate de benzyle stabilise et prolonge les notes citronnées',
    chemicalMechanism: 'Réduction de la volatilité par interactions moléculaires',
    applications: 'Parfumerie, fixation des notes de tête',
    source: 'scientific',
    strength: 'forte'
  },
  {
    molecule1Name: 'Iso E Super',
    molecule2Name: 'Limonene',
    molecule2CAS: '5989-27-5',
    type: 'stabilisation',
    description: 'L\'Iso E Super stabilise et prolonge les notes agrumes',
    applications: 'Parfumerie moderne',
    source: 'empirical',
    strength: 'forte'
  },
  
  // Stabilisation antioxydante
  {
    molecule1Name: 'Eugenol',
    molecule1CAS: '97-53-0',
    molecule2Name: 'Citral',
    molecule2CAS: '5392-40-5',
    type: 'stabilisation',
    description: 'L\'eugénol protège le citral de l\'oxydation',
    chemicalMechanism: 'Action antioxydante du groupe phénol',
    applications: 'Formulation cosmétique, parfumerie',
    source: 'scientific',
    strength: 'forte'
  },
  {
    molecule1Name: 'Thymol',
    molecule1CAS: '89-83-8',
    molecule2Name: 'Linalool',
    molecule2CAS: '78-70-6',
    type: 'stabilisation',
    description: 'Le thymol stabilise le linalool contre la dégradation',
    chemicalMechanism: 'Protection antioxydante',
    applications: 'Aromathérapie, formulations stables',
    source: 'scientific',
    strength: 'moyenne'
  },
  
  // ============================================================================
  // SYNERGIES DE TRANSFORMATION
  // ============================================================================
  
  // Transformation olfactive
  {
    molecule1Name: 'Indole',
    molecule1CAS: '120-72-9',
    molecule2Name: 'Methyl anthranilate',
    molecule2CAS: '134-20-3',
    type: 'transformation',
    description: 'L\'indole et l\'anthranilate créent une note jasmin-fleur d\'oranger unique',
    applications: 'Parfumerie florale, compositions orientales',
    source: 'traditional',
    strength: 'forte'
  },
  {
    molecule1Name: 'Coumarin',
    molecule1CAS: '91-64-5',
    molecule2Name: 'Vanillin',
    molecule2CAS: '121-33-5',
    type: 'transformation',
    description: 'La coumarine et la vanilline créent une note foin-gourmande distinctive',
    applications: 'Parfumerie fougère, compositions gourmandes',
    source: 'traditional',
    strength: 'forte'
  },
  {
    molecule1Name: 'Muscone',
    molecule1CAS: '541-91-3',
    molecule2Name: 'Civetone',
    molecule2CAS: '542-46-1',
    type: 'transformation',
    description: 'Les deux muscs créent une note animale complexe et sensuelle',
    applications: 'Parfumerie de luxe, compositions animales',
    source: 'traditional',
    strength: 'forte'
  },
  
  // Transformation par réaction chimique
  {
    molecule1Name: 'Citronellal',
    molecule1CAS: '106-23-0',
    molecule2Name: 'Hydroxycitronellal',
    molecule2CAS: '107-75-5',
    type: 'transformation',
    description: 'Transformation créant une note muguet plus douce',
    chemicalMechanism: 'Équilibre chimique entre les deux formes',
    applications: 'Parfumerie muguet',
    source: 'scientific',
    strength: 'moyenne'
  },
  {
    molecule1Name: 'Geraniol',
    molecule1CAS: '106-24-1',
    molecule2Name: 'Nerol',
    molecule2CAS: '106-25-2',
    type: 'transformation',
    description: 'Les deux isomères créent une note rose plus naturelle et complexe',
    chemicalMechanism: 'Équilibre entre isomères géométriques',
    applications: 'Parfumerie rose naturelle',
    source: 'scientific',
    strength: 'moyenne'
  },
  
  // Synergies cannabis-terpènes
  {
    molecule1Name: 'Cannabidiol',
    molecule1CAS: '13956-29-1',
    molecule2Name: 'Myrcene',
    molecule2CAS: '123-35-3',
    type: 'potentialisation',
    description: 'Le CBD et le myrcène amplifient les effets sédatifs et anti-inflammatoires',
    chemicalMechanism: 'Effet entourage: modulation synergique du système endocannabinoïde',
    applications: 'Cannabis thérapeutique, aromathérapie',
    source: 'scientific',
    strength: 'forte'
  },
  {
    molecule1Name: 'Cannabidiol',
    molecule1CAS: '13956-29-1',
    molecule2Name: 'Limonene',
    molecule2CAS: '5989-27-5',
    type: 'potentialisation',
    description: 'Le CBD et le limonène amplifient les effets anxiolytiques',
    chemicalMechanism: 'Modulation synergique des récepteurs 5-HT1A',
    applications: 'Cannabis thérapeutique, anxiété',
    source: 'scientific',
    strength: 'forte'
  },
  {
    molecule1Name: 'Cannabidiol',
    molecule1CAS: '13956-29-1',
    molecule2Name: 'Linalool',
    molecule2CAS: '78-70-6',
    type: 'potentialisation',
    description: 'Le CBD et le linalool potentialisent les effets anticonvulsivants',
    chemicalMechanism: 'Modulation synergique des canaux ioniques',
    applications: 'Épilepsie, cannabis thérapeutique',
    source: 'scientific',
    strength: 'forte'
  },
  {
    molecule1Name: 'Cannabidiol',
    molecule1CAS: '13956-29-1',
    molecule2Name: 'beta-Caryophyllene',
    molecule2CAS: '87-44-5',
    type: 'potentialisation',
    description: 'Le CBD et le β-caryophyllène amplifient les effets anti-inflammatoires',
    chemicalMechanism: 'Action synergique sur CB2 et voies inflammatoires',
    applications: 'Douleurs chroniques, inflammation',
    source: 'scientific',
    strength: 'forte'
  },
];

/**
 * Obtenir toutes les synergies
 */
export function getAllSynergies(): MolecularSynergy[] {
  return MOLECULAR_SYNERGIES;
}

/**
 * Obtenir les synergies par type
 */
export function getSynergiesByType(type: SynergyType): MolecularSynergy[] {
  return MOLECULAR_SYNERGIES.filter(s => s.type === type);
}

/**
 * Obtenir les synergies pour une molécule donnée
 */
export function getSynergiesForMolecule(moleculeName: string): MolecularSynergy[] {
  const nameLower = moleculeName.toLowerCase();
  return MOLECULAR_SYNERGIES.filter(s => 
    s.molecule1Name.toLowerCase().includes(nameLower) ||
    s.molecule2Name.toLowerCase().includes(nameLower)
  );
}

/**
 * Obtenir les synergies par CAS number
 */
export function getSynergiesByCAS(casNumber: string): MolecularSynergy[] {
  return MOLECULAR_SYNERGIES.filter(s => 
    s.molecule1CAS === casNumber || s.molecule2CAS === casNumber
  );
}

/**
 * Obtenir les statistiques des synergies
 */
export function getSynergyStats(): {
  total: number;
  byType: Record<SynergyType, number>;
  byStrength: Record<string, number>;
  bySource: Record<string, number>;
} {
  const byType: Record<SynergyType, number> = {
    masquage: 0,
    neutralisation: 0,
    potentialisation: 0,
    stabilisation: 0,
    transformation: 0
  };
  
  const byStrength: Record<string, number> = {
    forte: 0,
    moyenne: 0,
    faible: 0
  };
  
  const bySource: Record<string, number> = {
    scientific: 0,
    empirical: 0,
    traditional: 0
  };
  
  for (const synergy of MOLECULAR_SYNERGIES) {
    byType[synergy.type]++;
    byStrength[synergy.strength]++;
    bySource[synergy.source]++;
  }
  
  return {
    total: MOLECULAR_SYNERGIES.length,
    byType,
    byStrength,
    bySource
  };
}

/**
 * Rechercher des synergies par mot-clé
 */
export function searchSynergies(keyword: string): MolecularSynergy[] {
  const keywordLower = keyword.toLowerCase();
  return MOLECULAR_SYNERGIES.filter(s =>
    s.molecule1Name.toLowerCase().includes(keywordLower) ||
    s.molecule2Name.toLowerCase().includes(keywordLower) ||
    s.description.toLowerCase().includes(keywordLower) ||
    (s.applications && s.applications.toLowerCase().includes(keywordLower))
  );
}
