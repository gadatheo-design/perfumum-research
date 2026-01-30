import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const analyticalMethods = [
  {
    code: 'GC-MS',
    name: 'Chromatographie en phase gazeuse couplée à la spectrométrie de masse',
    fullName: 'Gas Chromatography-Mass Spectrometry',
    category: 'chromatography',
    performanceScore: 9,
    resolutionScore: 9,
    sensitivityScore: 9,
    detectionLimit: 'ppb',
    detectionLimitUnit: 'parts per billion',
    capabilities: JSON.stringify([
      'Identification des composés volatils',
      'Quantification précise',
      'Analyse de mélanges complexes',
      'Détermination des structures moléculaires',
      'Analyse des huiles essentielles'
    ]),
    limitations: JSON.stringify([
      'Nécessite des composés volatils',
      'Temps d\'analyse relativement long',
      'Coût élevé de l\'équipement',
      'Expertise technique requise'
    ]),
    bestSuitedFor: JSON.stringify([
      'Profilage des terpènes',
      'Contrôle qualité des huiles essentielles',
      'Identification des adultérations',
      'Analyse des composés aromatiques'
    ]),
    description: 'La GC-MS est la technique de référence en parfumerie pour l\'identification et la quantification des composés volatils. Elle combine la séparation chromatographique avec la détection par spectrométrie de masse, permettant une identification précise des molécules.',
    technicalDetails: 'Colonne capillaire typique: DB-5ms ou similaire. Température du four: 40-280°C. Ionisation: impact électronique (EI) à 70 eV. Bibliothèques spectrales: NIST, Wiley, Adams.',
    publicationCount: 1250
  },
  {
    code: 'PTR-MS',
    name: 'Spectrométrie de masse à réaction de transfert de proton',
    fullName: 'Proton Transfer Reaction Mass Spectrometry',
    category: 'spectrometry',
    performanceScore: 8,
    resolutionScore: 7,
    sensitivityScore: 10,
    detectionLimit: 'ppt',
    detectionLimitUnit: 'parts per trillion',
    capabilities: JSON.stringify([
      'Analyse en temps réel',
      'Détection ultra-sensible',
      'Pas de préparation d\'échantillon',
      'Suivi dynamique des émissions',
      'Analyse de l\'air ambiant'
    ]),
    limitations: JSON.stringify([
      'Résolution limitée pour isomères',
      'Fragmentation possible',
      'Coût très élevé',
      'Interprétation complexe des spectres'
    ]),
    bestSuitedFor: JSON.stringify([
      'Analyse des COV en temps réel',
      'Suivi de la maturation des fruits',
      'Contrôle des processus de fermentation',
      'Analyse de l\'espace de tête'
    ]),
    description: 'Le PTR-MS permet une analyse en temps réel des composés organiques volatils avec une sensibilité exceptionnelle. Idéal pour le suivi dynamique des profils olfactifs.',
    technicalDetails: 'Source d\'ions: H3O+. Temps de réponse: < 100 ms. Gamme de masse: 20-500 m/z. Sensibilité: pptv.',
    publicationCount: 320
  },
  {
    code: 'HPLC',
    name: 'Chromatographie liquide haute performance',
    fullName: 'High Performance Liquid Chromatography',
    category: 'chromatography',
    performanceScore: 8,
    resolutionScore: 8,
    sensitivityScore: 8,
    detectionLimit: 'ppb',
    detectionLimitUnit: 'parts per billion',
    capabilities: JSON.stringify([
      'Analyse des composés non volatils',
      'Séparation des pigments',
      'Analyse des flavonoïdes',
      'Quantification des antioxydants',
      'Analyse des alcaloïdes'
    ]),
    limitations: JSON.stringify([
      'Non adapté aux composés très volatils',
      'Consommation de solvants',
      'Temps de préparation des échantillons',
      'Maintenance régulière requise'
    ]),
    bestSuitedFor: JSON.stringify([
      'Analyse des absolues',
      'Quantification des colorants',
      'Analyse des résinoïdes',
      'Contrôle des impuretés'
    ]),
    description: 'L\'HPLC est complémentaire à la GC-MS pour l\'analyse des composés non volatils ou thermolabiles. Essentielle pour l\'analyse des absolues et des extraits complexes.',
    technicalDetails: 'Colonne C18 typique. Détecteurs: UV-Vis, DAD, fluorescence, MS. Phase mobile: gradient eau/acétonitrile.',
    publicationCount: 890
  },
  {
    code: 'IR',
    name: 'Spectroscopie infrarouge',
    fullName: 'Infrared Spectroscopy',
    category: 'spectroscopy',
    performanceScore: 7,
    resolutionScore: 6,
    sensitivityScore: 6,
    detectionLimit: 'ppm',
    detectionLimitUnit: 'parts per million',
    capabilities: JSON.stringify([
      'Identification rapide des groupes fonctionnels',
      'Analyse non destructive',
      'Contrôle qualité rapide',
      'Détection des adultérations',
      'Analyse des polymères'
    ]),
    limitations: JSON.stringify([
      'Résolution limitée pour mélanges complexes',
      'Interférences de l\'eau',
      'Sensibilité modérée',
      'Difficulté avec les isomères'
    ]),
    bestSuitedFor: JSON.stringify([
      'Contrôle qualité de routine',
      'Vérification d\'identité',
      'Détection des falsifications',
      'Analyse des cires et résines'
    ]),
    description: 'La spectroscopie IR permet une identification rapide des groupes fonctionnels et un contrôle qualité non destructif. Technique de screening idéale.',
    technicalDetails: 'FTIR avec ATR (réflectance totale atténuée). Gamme: 4000-400 cm⁻¹. Résolution: 4 cm⁻¹.',
    publicationCount: 560
  },
  {
    code: 'NMR',
    name: 'Résonance magnétique nucléaire',
    fullName: 'Nuclear Magnetic Resonance Spectroscopy',
    category: 'spectroscopy',
    performanceScore: 9,
    resolutionScore: 10,
    sensitivityScore: 5,
    detectionLimit: 'ppm',
    detectionLimitUnit: 'parts per million',
    capabilities: JSON.stringify([
      'Élucidation structurale complète',
      'Analyse non destructive',
      'Distinction des isomères',
      'Analyse quantitative',
      'Profilage métabolomique'
    ]),
    limitations: JSON.stringify([
      'Sensibilité limitée',
      'Coût très élevé',
      'Temps d\'analyse long',
      'Expertise avancée requise'
    ]),
    bestSuitedFor: JSON.stringify([
      'Élucidation de structures nouvelles',
      'Authentification des huiles essentielles',
      'Analyse des stéréoisomères',
      'Recherche fondamentale'
    ]),
    description: 'La RMN offre une résolution structurale inégalée et permet de distinguer les isomères. Technique de référence pour l\'élucidation de structures complexes.',
    technicalDetails: '¹H-NMR et ¹³C-NMR. Fréquence: 400-800 MHz. Solvants: CDCl₃, DMSO-d₆. Techniques 2D: COSY, HSQC, HMBC.',
    publicationCount: 420
  },
  {
    code: 'GC-FID',
    name: 'Chromatographie en phase gazeuse avec détecteur à ionisation de flamme',
    fullName: 'Gas Chromatography-Flame Ionization Detector',
    category: 'chromatography',
    performanceScore: 7,
    resolutionScore: 8,
    sensitivityScore: 7,
    detectionLimit: 'ppm',
    detectionLimitUnit: 'parts per million',
    capabilities: JSON.stringify([
      'Quantification précise',
      'Excellente reproductibilité',
      'Coût modéré',
      'Robustesse',
      'Large gamme dynamique'
    ]),
    limitations: JSON.stringify([
      'Pas d\'identification directe',
      'Nécessite des standards',
      'Détruit l\'échantillon',
      'Limité aux composés organiques'
    ]),
    bestSuitedFor: JSON.stringify([
      'Contrôle qualité de routine',
      'Quantification des composés connus',
      'Analyse des huiles essentielles',
      'Suivi de production'
    ]),
    description: 'Le GC-FID est la technique de choix pour la quantification de routine des composés volatils. Excellente reproductibilité et coût modéré.',
    technicalDetails: 'Détecteur universel pour composés organiques. Gaz: H₂/air. Température du détecteur: 250-300°C.',
    publicationCount: 780
  },
  {
    code: 'GC-O',
    name: 'Chromatographie en phase gazeuse-olfactométrie',
    fullName: 'Gas Chromatography-Olfactometry',
    category: 'chromatography',
    performanceScore: 8,
    resolutionScore: 8,
    sensitivityScore: 10,
    detectionLimit: 'ppt',
    detectionLimitUnit: 'parts per trillion',
    capabilities: JSON.stringify([
      'Corrélation odeur-molécule',
      'Détection des composés impact',
      'Sensibilité olfactive humaine',
      'Analyse des notes de tête/cœur/fond',
      'Identification des off-notes'
    ]),
    limitations: JSON.stringify([
      'Subjectivité de l\'évaluateur',
      'Fatigue olfactive',
      'Formation requise',
      'Non quantitatif'
    ]),
    bestSuitedFor: JSON.stringify([
      'Identification des composés clés',
      'Développement de parfums',
      'Analyse des défauts olfactifs',
      'Caractérisation des notes'
    ]),
    description: 'La GC-O combine la séparation chromatographique avec l\'évaluation sensorielle humaine. Indispensable pour identifier les composés responsables de l\'odeur.',
    technicalDetails: 'Port de sniffing chauffé. Techniques: AEDA (Aroma Extract Dilution Analysis), CHARM. Panel d\'évaluateurs formés.',
    publicationCount: 340
  },
  {
    code: 'SPME',
    name: 'Microextraction en phase solide',
    fullName: 'Solid Phase Microextraction',
    category: 'other',
    performanceScore: 7,
    resolutionScore: 6,
    sensitivityScore: 8,
    detectionLimit: 'ppb',
    detectionLimitUnit: 'parts per billion',
    capabilities: JSON.stringify([
      'Préparation d\'échantillon simplifiée',
      'Sans solvant',
      'Analyse de l\'espace de tête',
      'Portable',
      'Couplage direct GC'
    ]),
    limitations: JSON.stringify([
      'Sélectivité de la fibre',
      'Compétition d\'adsorption',
      'Reproductibilité variable',
      'Durée de vie limitée des fibres'
    ]),
    bestSuitedFor: JSON.stringify([
      'Analyse des arômes alimentaires',
      'Échantillonnage sur site',
      'Analyse des émissions florales',
      'Profilage des volatils'
    ]),
    description: 'La SPME est une technique de préparation d\'échantillon sans solvant, idéale pour l\'analyse de l\'espace de tête et le couplage direct avec la GC.',
    technicalDetails: 'Fibres: PDMS, DVB/CAR/PDMS, PA. Temps d\'extraction: 15-60 min. Température: ambiante ou chauffée.',
    publicationCount: 520
  },
  {
    code: 'HS-GC',
    name: 'Chromatographie en phase gazeuse de l\'espace de tête',
    fullName: 'Headspace Gas Chromatography',
    category: 'chromatography',
    performanceScore: 7,
    resolutionScore: 7,
    sensitivityScore: 7,
    detectionLimit: 'ppb',
    detectionLimitUnit: 'parts per billion',
    capabilities: JSON.stringify([
      'Analyse des volatils libres',
      'Automatisation possible',
      'Représentatif de l\'odeur perçue',
      'Préparation minimale',
      'Analyse non destructive de l\'échantillon'
    ]),
    limitations: JSON.stringify([
      'Limité aux composés très volatils',
      'Équilibre thermodynamique requis',
      'Matrice dépendant',
      'Sensibilité modérée'
    ]),
    bestSuitedFor: JSON.stringify([
      'Analyse des parfums finis',
      'Contrôle des solvants résiduels',
      'Profilage des notes de tête',
      'Analyse des emballages'
    ]),
    description: 'L\'analyse de l\'espace de tête permet d\'étudier les composés volatils tels qu\'ils sont perçus par le nez, sans extraction préalable.',
    technicalDetails: 'Statique ou dynamique. Température d\'équilibration: 40-80°C. Temps d\'équilibration: 15-30 min.',
    publicationCount: 380
  },
  {
    code: 'TGA',
    name: 'Analyse thermogravimétrique',
    fullName: 'Thermogravimetric Analysis',
    category: 'thermal_analysis',
    performanceScore: 6,
    resolutionScore: 5,
    sensitivityScore: 6,
    detectionLimit: 'percent',
    detectionLimitUnit: '% massique',
    capabilities: JSON.stringify([
      'Analyse de la stabilité thermique',
      'Détermination de la composition',
      'Analyse des résidus',
      'Étude de la décomposition',
      'Contrôle de la pureté'
    ]),
    limitations: JSON.stringify([
      'Pas d\'identification directe',
      'Résolution limitée',
      'Interprétation complexe',
      'Temps d\'analyse long'
    ]),
    bestSuitedFor: JSON.stringify([
      'Analyse des résines',
      'Contrôle des cires',
      'Étude de la volatilité',
      'Caractérisation des supports'
    ]),
    description: 'La TGA mesure les variations de masse en fonction de la température, utile pour caractériser la stabilité thermique et la composition des matériaux.',
    technicalDetails: 'Rampe de température: 10°C/min. Atmosphère: N₂ ou air. Gamme: 25-800°C.',
    publicationCount: 180
  }
];

async function populateAnalyticalMethods() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log('🔬 Peuplement de la table analytical_methods...\n');
  
  let inserted = 0;
  let updated = 0;
  
  for (const method of analyticalMethods) {
    try {
      // Vérifier si la méthode existe déjà
      const [existing] = await connection.execute(
        'SELECT id FROM analytical_methods WHERE code = ?',
        [method.code]
      );
      
      if (existing.length > 0) {
        // Mettre à jour
        await connection.execute(
          `UPDATE analytical_methods SET 
            name = ?, full_name = ?, category = ?,
            performance_score = ?, resolution_score = ?, sensitivity_score = ?,
            detection_limit = ?, detection_limit_unit = ?,
            capabilities = ?, limitations = ?, best_suited_for = ?,
            description = ?, technical_details = ?, publication_count = ?,
            updated_at = NOW()
          WHERE code = ?`,
          [
            method.name, method.fullName, method.category,
            method.performanceScore, method.resolutionScore, method.sensitivityScore,
            method.detectionLimit, method.detectionLimitUnit,
            method.capabilities, method.limitations, method.bestSuitedFor,
            method.description, method.technicalDetails, method.publicationCount,
            method.code
          ]
        );
        console.log(`  ✓ Mise à jour: ${method.code} - ${method.name}`);
        updated++;
      } else {
        // Insérer avec method_id (requis par la table)
        await connection.execute(
          `INSERT INTO analytical_methods (
            code, method_id, name, full_name, category,
            performance_score, resolution_score, sensitivity_score,
            detection_limit, detection_limit_unit,
            capabilities, limitations, best_suited_for,
            description, technical_details, publication_count
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            method.code, method.code, method.name, method.fullName, method.category,
            method.performanceScore, method.resolutionScore, method.sensitivityScore,
            method.detectionLimit, method.detectionLimitUnit,
            method.capabilities, method.limitations, method.bestSuitedFor,
            method.description, method.technicalDetails, method.publicationCount
          ]
        );
        console.log(`  ✓ Ajouté: ${method.code} - ${method.name}`);
        inserted++;
      }
    } catch (error) {
      console.error(`  ✗ Erreur pour ${method.code}:`, error.message);
    }
  }
  
  await connection.end();
  
  console.log(`\n📊 Résumé:`);
  console.log(`  - Méthodes ajoutées: ${inserted}`);
  console.log(`  - Méthodes mises à jour: ${updated}`);
  console.log(`  - Total: ${inserted + updated}/${analyticalMethods.length}`);
}

populateAnalyticalMethods().catch(console.error);
