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
  
  // ============================================================================
  // ENRICHISSEMENT AROMATHÉRAPIE - 100+ NOUVEAUX COMPOSÉS
  // ============================================================================
  
  // === MONOTERPÈNES ADDITIONNELS ===
  '13466-78-9': {
    casNumber: '13466-78-9',
    name: 'delta-3-carene',
    properties: ['Anti-inflammatoire', 'Antiseptique', 'Cicatrisant'],
    mechanisms: ['Inhibition médiateurs inflammatoires'],
    traditionalUses: ['Problèmes respiratoires', 'Cicatrisation'],
    source: 'aromatherapy'
  },
  '3387-41-5': {
    casNumber: '3387-41-5',
    name: 'sabinene',
    properties: ['Antioxydant', 'Antimicrobien', 'Anti-inflammatoire'],
    source: 'pubmed'
  },
  '555-10-2': {
    casNumber: '555-10-2',
    name: 'beta-phellandrene',
    properties: ['Expectorant', 'Antifongique'],
    traditionalUses: ['Congestion respiratoire'],
    source: 'aromatherapy'
  },
  '99-83-2': {
    casNumber: '99-83-2',
    name: 'alpha-phellandrene',
    properties: ['Antifongique', 'Antibactérien'],
    source: 'aromatherapy'
  },
  '3779-61-1': {
    casNumber: '3779-61-1',
    name: 'trans-ocimene',
    properties: ['Antiviral', 'Antifongique', 'Décongestionnant'],
    source: 'pubmed'
  },
  '13877-91-3': {
    casNumber: '13877-91-3',
    name: 'beta-ocimene',
    properties: ['Antiviral', 'Antibactérien', 'Anti-inflammatoire'],
    source: 'pubmed'
  },
  '79-92-5': {
    casNumber: '79-92-5',
    name: 'camphene',
    properties: ['Antioxydant', 'Hypolipidémiant', 'Cardioprotecteur'],
    mechanisms: ['Réduction cholestérol LDL'],
    source: 'pubmed'
  },
  '2867-05-2': {
    casNumber: '2867-05-2',
    name: 'alpha-thujene',
    properties: ['Antimicrobien', 'Antioxydant'],
    source: 'aromatherapy'
  },
  '508-32-7': {
    casNumber: '508-32-7',
    name: 'tricyclene',
    properties: ['Antioxydant'],
    source: 'aromatherapy'
  },
  
  // === MONOTERPÉNOLS ADDITIONNELS ===
  '1490-04-6': {
    casNumber: '1490-04-6',
    name: 'isomenthol',
    properties: ['Rafraîchissant', 'Analgésique léger'],
    source: 'aromatherapy'
  },
  '7785-53-7': {
    casNumber: '7785-53-7',
    name: 'isopulegol',
    properties: ['Anxiolytique', 'Gastroprotecteur'],
    mechanisms: ['Modulation GABA'],
    source: 'pubmed'
  },
  '7212-44-4': {
    casNumber: '7212-44-4',
    name: 'nerolidol',
    properties: ['Sédatif', 'Antiparasitaire', 'Perméabilisant cutané'],
    mechanisms: ['Perturbation membrane parasitaire'],
    source: 'pubmed'
  },
  '536-60-7': {
    casNumber: '536-60-7',
    name: 'cuminyl alcohol',
    properties: ['Antimicrobien'],
    source: 'aromatherapy'
  },
  '98-85-1': {
    casNumber: '98-85-1',
    name: 'alpha-methylbenzyl alcohol',
    properties: ['Antimicrobien', 'Conservateur'],
    source: 'pharmacognosy'
  },
  '89-78-1': {
    casNumber: '89-78-1',
    name: 'dl-menthol',
    properties: ['Analgésique', 'Antiprurigineux', 'Décongestionnant'],
    mechanisms: ['Activation récepteurs TRPM8'],
    source: 'pubmed'
  },
  '470-67-7': {
    casNumber: '470-67-7',
    name: '1,4-cineole',
    properties: ['Expectorant', 'Antimicrobien'],
    source: 'aromatherapy'
  },
  
  // === SESQUITERPÈNES ADDITIONNELS ===
  '17699-14-8': {
    casNumber: '17699-14-8',
    name: 'alpha-copaene',
    properties: ['Antioxydant', 'Antimicrobien'],
    source: 'aromatherapy'
  },
  '3856-25-5': {
    casNumber: '3856-25-5',
    name: 'beta-elemene',
    properties: ['Anticancéreux', 'Anti-inflammatoire'],
    mechanisms: ['Induction apoptose', 'Inhibition angiogenèse'],
    source: 'pubmed'
  },
  '20307-84-0': {
    casNumber: '20307-84-0',
    name: 'delta-elemene',
    properties: ['Anticancéreux'],
    source: 'pubmed'
  },
  '495-61-4': {
    casNumber: '495-61-4',
    name: 'beta-selinene',
    properties: ['Anti-inflammatoire', 'Antimicrobien'],
    source: 'aromatherapy'
  },
  '473-13-2': {
    casNumber: '473-13-2',
    name: 'alpha-selinene',
    properties: ['Antimicrobien'],
    source: 'aromatherapy'
  },
  '489-40-7': {
    casNumber: '489-40-7',
    name: 'alpha-guaiene',
    properties: ['Anti-inflammatoire', 'Antimicrobien'],
    source: 'aromatherapy'
  },
  '88-84-6': {
    casNumber: '88-84-6',
    name: 'guaiol',
    properties: ['Anti-inflammatoire', 'Antimicrobien', 'Antiparasitaire'],
    source: 'pubmed'
  },
  '5937-11-1': {
    casNumber: '5937-11-1',
    name: 'gamma-eudesmol',
    properties: ['Relaxant musculaire', 'Hypotenseur'],
    source: 'pubmed'
  },
  '473-15-4': {
    casNumber: '473-15-4',
    name: 'beta-eudesmol',
    properties: ['Relaxant musculaire', 'Anti-inflammatoire'],
    source: 'pubmed'
  },
  '473-16-5': {
    casNumber: '473-16-5',
    name: 'alpha-eudesmol',
    properties: ['Relaxant musculaire', 'Sédatif'],
    source: 'pubmed'
  },
  '5989-08-2': {
    casNumber: '5989-08-2',
    name: 'valencene',
    properties: ['Anti-inflammatoire', 'Antiallergique'],
    mechanisms: ['Inhibition histamine'],
    source: 'pubmed'
  },
  '495-60-3': {
    casNumber: '495-60-3',
    name: 'zingiberene',
    properties: ['Anti-inflammatoire', 'Antiémétique', 'Gastroprotecteur'],
    traditionalUses: ['Nausées', 'Digestion'],
    source: 'pubmed'
  },
  '469-61-4': {
    casNumber: '469-61-4',
    name: 'alpha-cedrene',
    properties: ['Sédatif', 'Anti-inflammatoire'],
    source: 'aromatherapy'
  },
  '469-62-5': {
    casNumber: '469-62-5',
    name: 'cedrol',
    properties: ['Sédatif', 'Hypotenseur', 'Anxiolytique'],
    mechanisms: ['Activation système parasympathique'],
    source: 'pubmed'
  },
  '4630-07-3': {
    casNumber: '4630-07-3',
    name: 'nootkatone',
    properties: ['Répulsif insectes', 'Anticancéreux', 'Antiobesité'],
    mechanisms: ['Activation AMPK'],
    source: 'pubmed'
  },
  '22451-73-6': {
    casNumber: '22451-73-6',
    name: 'viridiflorol',
    properties: ['Œstrogénique', 'Antimicrobien'],
    source: 'pubmed'
  },
  '639-99-6': {
    casNumber: '639-99-6',
    name: 'elemol',
    properties: ['Antimicrobien', 'Antifongique'],
    source: 'aromatherapy'
  },
  '115-71-9': {
    casNumber: '115-71-9',
    name: 'alpha-santalol',
    properties: ['Antimicrobien', 'Anti-inflammatoire', 'Anticancéreux', 'Sédatif'],
    mechanisms: ['Induction apoptose', 'Modulation GABA'],
    source: 'pubmed'
  },
  '90-14-2': {
    casNumber: '90-14-2',
    name: 'beta-santalol',
    properties: ['Antimicrobien', 'Anti-inflammatoire'],
    source: 'pubmed'
  },
  '5986-38-9': {
    casNumber: '5986-38-9',
    name: 'patchoulol',
    properties: ['Anti-inflammatoire', 'Antiviral', 'Antimicrobien'],
    source: 'pubmed'
  },
  '5113-87-1': {
    casNumber: '5113-87-1',
    name: 'vetiverol',
    properties: ['Sédatif', 'Anxiolytique', 'Immunostimulant'],
    source: 'aromatherapy'
  },
  '89-82-7': {
    casNumber: '89-82-7',
    name: 'pulegone',
    properties: ['Insecticide', 'Antimicrobien'],
    contraindications: ['Hépatotoxique à haute dose', 'Grossesse'],
    source: 'pharmacognosy'
  },
  
  // === CÉTONES ADDITIONNELLES ===
  '546-80-5': {
    casNumber: '546-80-5',
    name: 'thujone',
    properties: ['Vermifuge', 'Emménagogue'],
    contraindications: ['Neurotoxique à haute dose', 'Épilepsie', 'Grossesse'],
    source: 'pharmacognosy'
  },
  '1196-01-6': {
    casNumber: '1196-01-6',
    name: 'verbenone',
    properties: ['Mucolytique', 'Anti-inflammatoire', 'Régénérant hépatique'],
    source: 'aromatherapy'
  },
  '1195-79-5': {
    casNumber: '1195-79-5',
    name: 'fenchone',
    properties: ['Expectorant', 'Antispasmodique'],
    source: 'aromatherapy'
  },
  '500-02-7': {
    casNumber: '500-02-7',
    name: 'pinocamphone',
    properties: ['Mucolytique', 'Expectorant'],
    contraindications: ['Neurotoxique à haute dose'],
    source: 'aromatherapy'
  },
  '491-09-8': {
    casNumber: '491-09-8',
    name: 'pinocarvone',
    properties: ['Antimicrobien'],
    source: 'aromatherapy'
  },
  '79-78-7': {
    casNumber: '79-78-7',
    name: 'isomenthone',
    properties: ['Analgésique léger'],
    source: 'aromatherapy'
  },
  '499-70-7': {
    casNumber: '499-70-7',
    name: 'piperitone',
    properties: ['Antimicrobien', 'Insecticide'],
    source: 'aromatherapy'
  },
  
  // === ALDÉHYDES ADDITIONNELS ===
  '112-31-2': {
    casNumber: '112-31-2',
    name: 'decanal',
    properties: ['Antimicrobien', 'Antifongique'],
    source: 'aromatherapy'
  },
  '112-44-7': {
    casNumber: '112-44-7',
    name: 'undecanal',
    properties: ['Antimicrobien'],
    source: 'aromatherapy'
  },
  '112-54-9': {
    casNumber: '112-54-9',
    name: 'dodecanal',
    properties: ['Antimicrobien', 'Antifongique'],
    source: 'aromatherapy'
  },
  '124-19-6': {
    casNumber: '124-19-6',
    name: 'nonanal',
    properties: ['Antimicrobien'],
    source: 'aromatherapy'
  },
  '124-13-0': {
    casNumber: '124-13-0',
    name: 'octanal',
    properties: ['Antimicrobien', 'Antifongique'],
    source: 'aromatherapy'
  },
  '111-71-7': {
    casNumber: '111-71-7',
    name: 'heptanal',
    properties: ['Antimicrobien'],
    source: 'aromatherapy'
  },
  '66-25-1': {
    casNumber: '66-25-1',
    name: 'hexanal',
    properties: ['Antimicrobien', 'Antifongique'],
    source: 'aromatherapy'
  },
  '122-78-1': {
    casNumber: '122-78-1',
    name: 'phenylacetaldehyde',
    properties: ['Antimicrobien', 'Sédatif léger'],
    source: 'aromatherapy'
  },
  '104-87-0': {
    casNumber: '104-87-0',
    name: 'p-tolualdehyde',
    properties: ['Antimicrobien'],
    source: 'aromatherapy'
  },
  '122-03-2': {
    casNumber: '122-03-2',
    name: 'cuminaldehyde',
    properties: ['Antimicrobien', 'Antidiabétique'],
    source: 'pubmed'
  },
  '2111-75-3': {
    casNumber: '2111-75-3',
    name: 'perillaldehyde',
    properties: ['Antimicrobien', 'Anticancéreux'],
    source: 'pubmed'
  },
  '107-75-5': {
    casNumber: '107-75-5',
    name: 'hydroxycitronellal',
    properties: ['Sédatif léger', 'Apaisant'],
    source: 'aromatherapy'
  },
  
  // === PHÉNOLS ET DÉRIVÉS ADDITIONNELS ===
  '97-54-1': {
    casNumber: '97-54-1',
    name: 'isoeugenol',
    properties: ['Antiseptique', 'Analgésique', 'Anti-inflammatoire'],
    source: 'pubmed'
  },
  '140-67-0': {
    casNumber: '140-67-0',
    name: 'estragole',
    properties: ['Antispasmodique', 'Carminatif'],
    contraindications: ['Potentiellement cancérigène à haute dose'],
    source: 'pharmacognosy'
  },
  '4180-23-8': {
    casNumber: '4180-23-8',
    name: 'trans-anethole',
    properties: ['Œstrogénique', 'Antispasmodique', 'Carminatif', 'Galactogène'],
    traditionalUses: ['Digestion', 'Allaitement'],
    source: 'pubmed'
  },
  '93-15-2': {
    casNumber: '93-15-2',
    name: 'methyleugenol',
    properties: ['Anesthésique local', 'Antispasmodique'],
    contraindications: ['Potentiellement cancérigène'],
    source: 'pharmacognosy'
  },
  '94-59-7': {
    casNumber: '94-59-7',
    name: 'safrole',
    properties: ['Antiseptique', 'Insecticide'],
    contraindications: ['Cancérigène', 'Interdit en aromathérapie'],
    source: 'pharmacognosy'
  },
  '607-91-0': {
    casNumber: '607-91-0',
    name: 'myristicin',
    properties: ['Insecticide', 'Antimicrobien'],
    contraindications: ['Hallucinogène à haute dose'],
    source: 'pharmacognosy'
  },
  '487-11-6': {
    casNumber: '487-11-6',
    name: 'elemicin',
    properties: ['Antimicrobien'],
    contraindications: ['Potentiellement hallucinogène'],
    source: 'pharmacognosy'
  },
  '2883-98-9': {
    casNumber: '2883-98-9',
    name: 'asarone',
    properties: ['Sédatif', 'Anticonvulsivant'],
    contraindications: ['Potentiellement cancérigène'],
    source: 'pharmacognosy'
  },
  
  // === ESTERS ADDITIONNELS ===
  '141-12-8': {
    casNumber: '141-12-8',
    name: 'neryl acetate',
    properties: ['Sédatif', 'Antispasmodique'],
    source: 'aromatherapy'
  },
  '76-49-3': {
    casNumber: '76-49-3',
    name: 'bornyl acetate',
    properties: ['Anti-inflammatoire', 'Analgésique', 'Sédatif'],
    source: 'pubmed'
  },
  '125-12-2': {
    casNumber: '125-12-2',
    name: 'isobornyl acetate',
    properties: ['Expectorant', 'Antiseptique'],
    source: 'aromatherapy'
  },
  '80-26-2': {
    casNumber: '80-26-2',
    name: 'terpinyl acetate',
    properties: ['Antispasmodique', 'Sédatif'],
    source: 'aromatherapy'
  },
  '150-84-5': {
    casNumber: '150-84-5',
    name: 'citronellyl acetate',
    properties: ['Antimicrobien', 'Répulsif insectes'],
    source: 'aromatherapy'
  },
  '140-11-4': {
    casNumber: '140-11-4',
    name: 'benzyl acetate',
    properties: ['Antispasmodique', 'Sédatif léger'],
    source: 'aromatherapy'
  },
  '103-45-7': {
    casNumber: '103-45-7',
    name: 'phenylethyl acetate',
    properties: ['Antimicrobien', 'Sédatif léger'],
    source: 'aromatherapy'
  },
  '119-36-8': {
    casNumber: '119-36-8',
    name: 'methyl salicylate',
    properties: ['Analgésique', 'Anti-inflammatoire', 'Rubéfiant'],
    mechanisms: ['Inhibition COX'],
    traditionalUses: ['Douleurs musculaires', 'Arthrite'],
    contraindications: ['Allergie aspirine', 'Enfants'],
    source: 'pubmed'
  },
  '93-89-0': {
    casNumber: '93-89-0',
    name: 'ethyl benzoate',
    properties: ['Antimicrobien'],
    source: 'aromatherapy'
  },
  '120-51-4': {
    casNumber: '120-51-4',
    name: 'benzyl benzoate',
    properties: ['Antiparasitaire', 'Acaricide'],
    traditionalUses: ['Gale', 'Poux'],
    source: 'pharmacognosy'
  },
  '134-20-3': {
    casNumber: '134-20-3',
    name: 'methyl anthranilate',
    properties: ['Sédatif', 'Antispasmodique'],
    source: 'aromatherapy'
  },
  '103-26-4': {
    casNumber: '103-26-4',
    name: 'methyl cinnamate',
    properties: ['Antifongique', 'Larvicide'],
    source: 'pubmed'
  },
  '103-36-6': {
    casNumber: '103-36-6',
    name: 'ethyl cinnamate',
    properties: ['Antifongique'],
    source: 'aromatherapy'
  },
  
  // === LACTONES ADDITIONNELLES ===
  '706-14-9': {
    casNumber: '706-14-9',
    name: 'gamma-decalactone',
    properties: ['Apaisant', 'Réconfortant'],
    source: 'aromatherapy'
  },
  '104-67-6': {
    casNumber: '104-67-6',
    name: 'gamma-undecalactone',
    properties: ['Apaisant'],
    source: 'aromatherapy'
  },
  '2305-05-7': {
    casNumber: '2305-05-7',
    name: 'delta-decalactone',
    properties: ['Apaisant', 'Réconfortant'],
    source: 'aromatherapy'
  },
  '713-95-1': {
    casNumber: '713-95-1',
    name: 'delta-dodecalactone',
    properties: ['Apaisant'],
    source: 'aromatherapy'
  },
  '28664-35-9': {
    casNumber: '28664-35-9',
    name: 'sotolon',
    properties: ['Antioxydant'],
    source: 'aromatherapy'
  },
  
  // === COUMARINES ADDITIONNELLES ===
  '486-35-1': {
    casNumber: '486-35-1',
    name: 'dihydrocoumarin',
    properties: ['Sédatif', 'Antispasmodique'],
    source: 'aromatherapy'
  },
  '531-59-9': {
    casNumber: '531-59-9',
    name: 'herniarin',
    properties: ['Antispasmodique', 'Sédatif'],
    source: 'pharmacognosy'
  },
  '93-35-6': {
    casNumber: '93-35-6',
    name: 'umbelliferone',
    properties: ['Antioxydant', 'Anti-inflammatoire', 'Photoprotecteur'],
    source: 'pubmed'
  },
  '92-61-5': {
    casNumber: '92-61-5',
    name: 'scopoletin',
    properties: ['Anti-inflammatoire', 'Antispasmodique', 'Hypotenseur'],
    source: 'pubmed'
  },
  
  // === COMPOSÉS AZOTÉS ADDITIONNELS ===
  '83-34-1': {
    casNumber: '83-34-1',
    name: 'skatole',
    properties: ['Aucune propriété thérapeutique documentée'],
    source: 'pharmacognosy'
  },
  '73-22-3': {
    casNumber: '73-22-3',
    name: 'tryptophan',
    properties: ['Précurseur sérotonine', 'Sédatif', 'Antidépresseur'],
    mechanisms: ['Biosynthèse sérotonine et mélatonine'],
    source: 'pubmed'
  },
  
  // === ACIDES ADDITIONNELS ===
  '501-30-4': {
    casNumber: '501-30-4',
    name: 'kojic acid',
    properties: ['Dépigmentant', 'Antioxydant', 'Antimicrobien'],
    mechanisms: ['Inhibition tyrosinase'],
    source: 'pubmed'
  },
  '149-91-7': {
    casNumber: '149-91-7',
    name: 'gallic acid',
    properties: ['Antioxydant', 'Anti-inflammatoire', 'Anticancéreux'],
    source: 'pubmed'
  },
  '327-97-9': {
    casNumber: '327-97-9',
    name: 'chlorogenic acid',
    properties: ['Antioxydant', 'Antidiabétique', 'Hépatoprotecteur'],
    mechanisms: ['Inhibition alpha-glucosidase'],
    source: 'pubmed'
  },
  '20283-92-5': {
    casNumber: '20283-92-5',
    name: 'rosmarinic acid',
    properties: ['Antioxydant', 'Anti-inflammatoire', 'Antiviral', 'Neuroprotecteur'],
    source: 'pubmed'
  },
  '138-59-0': {
    casNumber: '138-59-0',
    name: 'shikimic acid',
    properties: ['Précurseur oseltamivir', 'Antiviral'],
    source: 'pubmed'
  },
  
  // === FLAVONOÏDES ===
  '520-18-3': {
    casNumber: '520-18-3',
    name: 'kaempferol',
    properties: ['Antioxydant', 'Anti-inflammatoire', 'Anticancéreux', 'Cardioprotecteur'],
    source: 'pubmed'
  },
  '117-39-5': {
    casNumber: '117-39-5',
    name: 'quercetin',
    properties: ['Antioxydant', 'Anti-inflammatoire', 'Antihistaminique', 'Antiviral'],
    mechanisms: ['Inhibition histamine', 'Piégeage radicaux libres'],
    source: 'pubmed'
  },
  '480-44-4': {
    casNumber: '480-44-4',
    name: 'acacetin',
    properties: ['Antioxydant', 'Anti-inflammatoire', 'Anticancéreux'],
    source: 'pubmed'
  },
  '520-36-5': {
    casNumber: '520-36-5',
    name: 'apigenin',
    properties: ['Anxiolytique', 'Anti-inflammatoire', 'Anticancéreux'],
    mechanisms: ['Modulation récepteurs GABA'],
    source: 'pubmed'
  },
  '491-70-3': {
    casNumber: '491-70-3',
    name: 'luteolin',
    properties: ['Antioxydant', 'Anti-inflammatoire', 'Neuroprotecteur'],
    source: 'pubmed'
  },
  
  // === CANNABINOÏDES (non psychoactifs) ===
  '13956-29-1': {
    casNumber: '13956-29-1',
    name: 'cannabidiol',
    properties: ['Anxiolytique', 'Anticonvulsivant', 'Anti-inflammatoire', 'Analgésique', 'Neuroprotecteur'],
    mechanisms: ['Modulation système endocannabinoïde', 'Agoniste 5-HT1A'],
    source: 'pubmed'
  },
  '20675-51-8': {
    casNumber: '20675-51-8',
    name: 'cannabigerol',
    properties: ['Antibactérien', 'Anti-inflammatoire', 'Neuroprotecteur'],
    source: 'pubmed'
  },
  '25654-31-3': {
    casNumber: '25654-31-3',
    name: 'cannabichromene',
    properties: ['Anti-inflammatoire', 'Antidépresseur', 'Antifongique'],
    source: 'pubmed'
  },
  '30964-13-7': {
    casNumber: '30964-13-7',
    name: 'cannabinol',
    properties: ['Sédatif', 'Antibactérien', 'Anti-inflammatoire'],
    source: 'pubmed'
  },
  
  // === ALCALOÏDES ===
  '54-11-5': {
    casNumber: '54-11-5',
    name: 'nicotine',
    properties: ['Stimulant cognitif', 'Anxiolytique paradoxal'],
    mechanisms: ['Agoniste récepteurs nicotiniques'],
    contraindications: ['Addictif', 'Cardiotoxique'],
    source: 'pharmacognosy'
  },
  '58-08-2': {
    casNumber: '58-08-2',
    name: 'caffeine',
    properties: ['Stimulant', 'Bronchodilatateur', 'Diurétique', 'Analgésique adjuvant'],
    mechanisms: ['Antagoniste adénosine'],
    source: 'pubmed'
  },
  '83-67-0': {
    casNumber: '83-67-0',
    name: 'theobromine',
    properties: ['Stimulant léger', 'Bronchodilatateur', 'Diurétique'],
    mechanisms: ['Inhibition phosphodiestérase'],
    source: 'pubmed'
  },
  
  // === COMPOSÉS SOUFRÉS ADDITIONNELS ===
  '2179-60-4': {
    casNumber: '2179-60-4',
    name: 'methyl propyl disulfide',
    properties: ['Antimicrobien'],
    source: 'aromatherapy'
  },
  '592-88-1': {
    casNumber: '592-88-1',
    name: 'diallyl sulfide',
    properties: ['Anticancéreux', 'Antimicrobien', 'Hépatoprotecteur'],
    source: 'pubmed'
  },
  '2444-49-7': {
    casNumber: '2444-49-7',
    name: 'allyl methyl sulfide',
    properties: ['Antimicrobien'],
    source: 'aromatherapy'
  },
  '3581-91-7': {
    casNumber: '3581-91-7',
    name: 'methional',
    properties: ['Antioxydant'],
    source: 'aromatherapy'
  },
  '98-02-2': {
    casNumber: '98-02-2',
    name: 'furfuryl mercaptan',
    properties: ['Antioxydant'],
    source: 'aromatherapy'
  },
  
  // === MUSCS ADDITIONNELS ===
  '541-91-3': {
    casNumber: '541-91-3',
    name: 'muscone',
    properties: ['Phéromone-like', 'Cardioprotecteur'],
    source: 'pubmed'
  },
  '542-46-1': {
    casNumber: '542-46-1',
    name: 'civetone',
    properties: ['Phéromone-like'],
    source: 'aromatherapy'
  },
  '1222-05-5': {
    casNumber: '1222-05-5',
    name: 'galaxolide',
    properties: ['Phéromone-like'],
    contraindications: ['Perturbateur endocrinien potentiel'],
    source: 'pharmacognosy'
  },
  
  // === AUTRES COMPOSÉS IMPORTANTS ===
  '98-86-2': {
    casNumber: '98-86-2',
    name: 'acetophenone',
    properties: ['Sédatif léger', 'Hypnotique'],
    source: 'pharmacognosy'
  },
  '119-61-9': {
    casNumber: '119-61-9',
    name: 'benzophenone',
    properties: ['Photoprotecteur'],
    source: 'pharmacognosy'
  },
  '98-01-1': {
    casNumber: '98-01-1',
    name: 'furfural',
    properties: ['Antimicrobien', 'Antifongique'],
    source: 'aromatherapy'
  },
  '67-47-0': {
    casNumber: '67-47-0',
    name: '5-hydroxymethylfurfural',
    properties: ['Antioxydant', 'Anti-inflammatoire'],
    source: 'pubmed'
  },
  '100-42-5': {
    casNumber: '100-42-5',
    name: 'styrene',
    properties: ['Aucune propriété thérapeutique'],
    contraindications: ['Neurotoxique', 'Cancérigène potentiel'],
    source: 'pharmacognosy'
  },
  '470-40-6': {
    casNumber: '470-40-6',
    name: 'thujopsene',
    properties: ['Anti-inflammatoire', 'Antimicrobien'],
    source: 'aromatherapy'
  },
  '3691-12-1': {
    casNumber: '3691-12-1',
    name: 'aromadendrene',
    properties: ['Anti-inflammatoire', 'Antimicrobien'],
    source: 'aromatherapy'
  },
  '5989-54-8': {
    casNumber: '5989-54-8',
    name: 'd-limonene',
    properties: ['Anxiolytique', 'Antidépresseur', 'Anticancéreux', 'Gastroprotecteur'],
    mechanisms: ['Modulation sérotonine', 'Induction apoptose'],
    source: 'pubmed'
  },
  '138-86-3': {
    casNumber: '138-86-3',
    name: 'dl-limonene',
    properties: ['Anxiolytique', 'Antidépresseur', 'Anticancéreux'],
    source: 'pubmed'
  },
};

// Dictionnaire de traduction des noms de molécules FR→EN
const THERAPEUTIC_NAME_MAPPING: Record<string, string[]> = {
  // Monoterpènes
  'limonène': ['limonene', '5989-27-5'],
  'd-limonène': ['d-limonene', '5989-54-8'],
  'alpha-pinène': ['alpha-pinene', '80-56-8'],
  'α-pinène': ['alpha-pinene', '80-56-8'],
  'β-pinène': ['beta-pinene', '127-91-3'],
  'beta-pinène': ['beta-pinene', '127-91-3'],
  'myrcène': ['myrcene', '123-35-3'],
  'p-cymène': ['p-cymene', '99-87-6'],
  'gamma-terpinène': ['gamma-terpinene', '99-85-4'],
  'terpinolène': ['terpinolene', '586-62-9'],
  'sabinène': ['sabinene', '3387-41-5'],
  'camphène': ['camphene', '79-92-5'],
  'delta-3-carène': ['delta-3-carene', '13466-78-9'],
  'alpha-phellandrène': ['alpha-phellandrene', '99-83-2'],
  'beta-phellandrène': ['beta-phellandrene', '555-10-2'],
  'ocimène': ['beta-ocimene', '13877-91-3'],
  'alpha-thujène': ['alpha-thujene', '2867-05-2'],
  
  // Alcools monoterpéniques
  'linalol': ['linalool', '78-70-6'],
  'linalool': ['linalool', '78-70-6'],
  'géraniol': ['geraniol', '106-24-1'],
  'citronellol': ['citronellol', '106-22-9'],
  'nérol': ['nerol', '106-25-2'],
  'menthol': ['menthol', '2216-51-5'],
  'bornéol': ['borneol', '507-70-0'],
  'alpha-terpinéol': ['alpha-terpineol', '98-55-5'],
  'isopulégol': ['isopulegol', '7785-53-7'],
  
  // Sesquiterpènes
  'caryophyllène': ['beta-caryophyllene', '87-44-5'],
  'β-caryophyllène': ['beta-caryophyllene', '87-44-5'],
  'humulène': ['alpha-humulene', '6753-98-6'],
  'bisabolol': ['bisabolol', '515-69-5'],
  'nérolidol': ['nerolidol', '142-50-7'],
  'farnésol': ['farnesol', '4602-84-0'],
  'valencène': ['valencene', '5989-08-2'],
  'zingiberène': ['zingiberene', '495-60-3'],
  'cédrol': ['cedrol', '77-53-2'],
  'santalol': ['alpha-santalol', '115-71-9'],
  'patchoulol': ['patchoulol', '5986-38-9'],
  'guaiol': ['guaiol', '88-84-6'],
  'nootkatone': ['nootkatone', '4630-07-3'],
  
  // Oxydes
  'eucalyptol': ['1,8-cineole', '470-82-6'],
  '1,8-cinéole': ['1,8-cineole', '470-82-6'],
  
  // Cétones
  'camphre': ['camphor', '76-22-2'],
  'menthone': ['menthone', '89-81-6'],
  'carvone': ['carvone', '6485-40-1'],
  'jasmone': ['jasmone', '488-10-8'],
  'thujone': ['thujone', '546-80-5'],
  'verbénone': ['verbenone', '1196-01-6'],
  'fenchone': ['fenchone', '1195-79-5'],
  'pulégone': ['pulegone', '89-82-7'],
  
  // Aldéhydes
  'citral': ['citral', '5392-40-5'],
  'citronellal': ['citronellal', '106-23-0'],
  'cinnamaldéhyde': ['cinnamaldehyde', '104-55-2'],
  'benzaldéhyde': ['benzaldehyde', '100-52-7'],
  'cuminaldéhyde': ['cuminaldehyde', '122-03-2'],
  'périllaldéhyde': ['perillaldehyde', '2111-75-3'],
  
  // Phénols
  'eugénol': ['eugenol', '97-53-0'],
  'isoeugénol': ['isoeugenol', '97-54-1'],
  'thymol': ['thymol', '89-83-8'],
  'carvacrol': ['carvacrol', '499-75-2'],
  'guaiacol': ['guaiacol', '90-05-1'],
  'estragole': ['estragole', '140-67-0'],
  'anéthole': ['trans-anethole', '4180-23-8'],
  
  // Esters
  'acétate de linalyle': ['linalyl acetate', '115-95-7'],
  'acétate de géranyle': ['geranyl acetate', '105-87-3'],
  'acétate de bornyle': ['bornyl acetate', '76-49-3'],
  'salicylate de méthyle': ['methyl salicylate', '119-36-8'],
  'benzoate de benzyle': ['benzyl benzoate', '120-51-4'],
  
  // Lactones et coumarines
  'coumarine': ['coumarin', '91-64-5'],
  'gamma-décalactone': ['gamma-decalactone', '706-14-9'],
  
  // Autres
  'vanilline': ['vanillin', '121-33-5'],
  'indole': ['indole', '120-72-9'],
  'ionone': ['beta-ionone', '14901-07-6'],
  'β-ionone': ['beta-ionone', '14901-07-6'],
  'α-ionone': ['alpha-ionone', '127-41-3'],
  'géosmine': ['geosmin', '19700-21-1'],
  'ambroxan': ['ambroxan', '6790-58-5'],
  
  // Cannabinoïdes
  'cannabidiol': ['cannabidiol', '13956-29-1'],
  'cbd': ['cannabidiol', '13956-29-1'],
  'cannabigérol': ['cannabigerol', '20675-51-8'],
  'cbg': ['cannabigerol', '20675-51-8'],
  'cannabinol': ['cannabinol', '30964-13-7'],
  'cbn': ['cannabinol', '30964-13-7'],
  
  // Alcaloïdes
  'nicotine': ['nicotine', '54-11-5'],
  'caféine': ['caffeine', '58-08-2'],
  'théobromine': ['theobromine', '83-67-0'],
  
  // Flavonoïdes
  'quercétine': ['quercetin', '117-39-5'],
  'kaempférol': ['kaempferol', '520-18-3'],
  'apigénine': ['apigenin', '520-36-5'],
  'lutéoline': ['luteolin', '491-70-3'],
  
  // Acides
  'acide rosmarinique': ['rosmarinic acid', '20283-92-5'],
  'acide chlorogénique': ['chlorogenic acid', '327-97-9'],
  'acide gallique': ['gallic acid', '149-91-7'],
  'acide férulique': ['ferulic acid', '1135-24-6'],
  'acide caféique': ['caffeic acid', '331-39-5'],
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
