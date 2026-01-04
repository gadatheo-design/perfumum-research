/**
 * Script d'import des chémotypes classiques
 * 
 * Ce script importe les chémotypes les plus connus et documentés :
 * - Thym (6 chémotypes)
 * - Romarin (3 chémotypes)
 * - Lavande (2 chémotypes)
 * - Eucalyptus (3 chémotypes)
 * - Basilic (3 chémotypes)
 */

import mysql from 'mysql2/promise';

// Données des chémotypes classiques
const chemotypesData = [
  // ============================================================================
  // THYM (Thymus vulgaris) - 6 chémotypes
  // ============================================================================
  {
    name: "Thym à thymol",
    code: "CT-THYM-THYMOL",
    plantName: "Thym",
    latinName: "Thymus vulgaris ct. thymol",
    dominantMoleculeName: "Thymol",
    dominantPercentageMin: 30,
    dominantPercentageMax: 50,
    secondaryMolecules: [
      { name: "p-Cymène", percentageMin: 15, percentageMax: 30 },
      { name: "γ-Terpinène", percentageMin: 5, percentageMax: 15 },
      { name: "Carvacrol", percentageMin: 1, percentageMax: 5 }
    ],
    origin: "Provence, France",
    terroir: "Garrigue méditerranéenne, sols calcaires secs et ensoleillés",
    altitude: "0-600m",
    climate: "Méditerranéen sec, été chaud",
    olfactiveProfile: "Puissant, phénolique, herbacé-épicé avec une note médicinale prononcée. Caractère antiseptique marqué.",
    olfactiveNotes: { top: ["Herbacé frais", "Épicé"], heart: ["Phénolique", "Médicinal"], base: ["Terreux", "Boisé léger"] },
    intensity: 8,
    therapeuticProperties: "Antibactérien puissant, antifongique, immunostimulant. Dermocaustique - dilution obligatoire.",
    contraindications: "Dermocaustique, éviter pur sur la peau. Contre-indiqué chez les enfants < 6 ans et femmes enceintes.",
    toxicity: "élevée",
    perfumeryUse: "Note de cœur puissante dans les compositions aromatiques et fougères masculines.",
    blendingNotes: "S'accorde avec lavande, romarin, agrumes, bois de cèdre.",
    recommendedDilution: "0.5-2%",
    notes: "Chémotype le plus répandu commercialement. À éviter pur sur la peau."
  },
  {
    name: "Thym à linalol",
    code: "CT-THYM-LINALOL",
    plantName: "Thym",
    latinName: "Thymus vulgaris ct. linalool",
    dominantMoleculeName: "Linalol",
    dominantPercentageMin: 60,
    dominantPercentageMax: 80,
    secondaryMolecules: [
      { name: "Acétate de linalyle", percentageMin: 5, percentageMax: 15 },
      { name: "Terpinène-4-ol", percentageMin: 2, percentageMax: 8 },
      { name: "β-Caryophyllène", percentageMin: 1, percentageMax: 5 }
    ],
    origin: "Haute-Provence, France",
    terroir: "Altitude moyenne, sols calcaires drainants, exposition sud",
    altitude: "600-1200m",
    climate: "Méditerranéen d'altitude, nuits fraîches",
    olfactiveProfile: "Doux, floral, légèrement citronné. Beaucoup plus délicat que le thymol, avec des notes de lavande.",
    olfactiveNotes: { top: ["Floral frais", "Citronné léger"], heart: ["Lavandé", "Herbacé doux"], base: ["Musqué léger", "Boisé fin"] },
    intensity: 5,
    therapeuticProperties: "Antibactérien doux, antifongique, calmant nerveux. Bien toléré par la peau.",
    contraindications: "Aucune contre-indication majeure aux doses recommandées.",
    toxicity: "faible",
    perfumeryUse: "Note de cœur douce dans les compositions florales et aromatiques féminines.",
    blendingNotes: "S'accorde avec lavande, rose, géranium, bergamote, bois de rose.",
    recommendedDilution: "5-20%",
    notes: "Chémotype le plus doux, adapté aux enfants et peaux sensibles. Parfum proche de la lavande."
  },
  {
    name: "Thym à géraniol",
    code: "CT-THYM-GERANIOL",
    plantName: "Thym",
    latinName: "Thymus vulgaris ct. geraniol",
    dominantMoleculeName: "Géraniol",
    dominantPercentageMin: 40,
    dominantPercentageMax: 60,
    secondaryMolecules: [
      { name: "Acétate de géranyle", percentageMin: 10, percentageMax: 25 },
      { name: "Citronellol", percentageMin: 5, percentageMax: 15 },
      { name: "Linalol", percentageMin: 2, percentageMax: 8 }
    ],
    origin: "Drôme Provençale, France",
    terroir: "Coteaux ensoleillés, sols argilo-calcaires",
    altitude: "300-800m",
    climate: "Méditerranéen de transition",
    olfactiveProfile: "Rosé, floral-fruité, légèrement citronné. Rappelle le géranium rosat avec une touche herbacée.",
    olfactiveNotes: { top: ["Rose", "Citronné"], heart: ["Géranium", "Floral doux"], base: ["Fruité", "Légèrement boisé"] },
    intensity: 6,
    therapeuticProperties: "Antibactérien, antifongique puissant (Candida), cardiotonique. Répulsif insectes.",
    contraindications: "Peut être sensibilisant chez certaines personnes. Test cutané recommandé.",
    toxicity: "modérée",
    perfumeryUse: "Note de cœur rosée dans les compositions florales et chyprées.",
    blendingNotes: "S'accorde avec rose, géranium, palmarosa, bergamote, patchouli.",
    recommendedDilution: "3-10%",
    notes: "Chémotype rare et recherché en parfumerie naturelle. Excellent répulsif naturel."
  },
  {
    name: "Thym à carvacrol",
    code: "CT-THYM-CARVACROL",
    plantName: "Thym",
    latinName: "Thymus vulgaris ct. carvacrol",
    dominantMoleculeName: "Carvacrol",
    dominantPercentageMin: 30,
    dominantPercentageMax: 45,
    secondaryMolecules: [
      { name: "p-Cymène", percentageMin: 20, percentageMax: 35 },
      { name: "γ-Terpinène", percentageMin: 10, percentageMax: 20 },
      { name: "Thymol", percentageMin: 2, percentageMax: 8 }
    ],
    origin: "Espagne, Maroc",
    terroir: "Zones arides, sols pauvres et rocailleux",
    altitude: "0-500m",
    climate: "Méditerranéen semi-aride",
    olfactiveProfile: "Très puissant, phénolique-épicé, proche de l'origan. Plus âcre que le thymol.",
    olfactiveNotes: { top: ["Épicé vif", "Phénolique"], heart: ["Origan", "Herbacé puissant"], base: ["Terreux", "Fumé léger"] },
    intensity: 9,
    therapeuticProperties: "Antibactérien très puissant, antiparasitaire, antioxydant. Dermocaustique majeur.",
    contraindications: "Très dermocaustique, usage professionnel uniquement. Contre-indiqué chez les enfants et femmes enceintes.",
    toxicity: "élevée",
    perfumeryUse: "Rarement utilisé en parfumerie fine, plutôt en compositions aromatiques industrielles.",
    blendingNotes: "S'accorde avec origan, sarriette, romarin, agrumes.",
    recommendedDilution: "0.5-1%",
    notes: "Chémotype très agressif, usage professionnel uniquement. Ne jamais appliquer pur."
  },
  {
    name: "Thym à thujanol",
    code: "CT-THYM-THUJANOL",
    plantName: "Thym",
    latinName: "Thymus vulgaris ct. thujanol",
    dominantMoleculeName: "Thujanol-4",
    dominantPercentageMin: 25,
    dominantPercentageMax: 50,
    secondaryMolecules: [
      { name: "Terpinène-4-ol", percentageMin: 10, percentageMax: 25 },
      { name: "Myrcène", percentageMin: 5, percentageMax: 15 },
      { name: "Linalol", percentageMin: 3, percentageMax: 10 }
    ],
    origin: "Pyrénées-Orientales, France",
    terroir: "Piémont pyrénéen, sols schisteux",
    altitude: "400-900m",
    climate: "Méditerranéen montagnard",
    olfactiveProfile: "Doux, herbacé-floral, légèrement mentholé. Le plus délicat des thyms.",
    olfactiveNotes: { top: ["Herbacé frais", "Mentholé léger"], heart: ["Floral doux", "Marjolaine"], base: ["Boisé fin", "Musqué"] },
    intensity: 4,
    therapeuticProperties: "Immunostimulant, régénérant hépatique, antibactérien doux. Excellente tolérance cutanée.",
    contraindications: "Aucune contre-indication majeure aux doses recommandées.",
    toxicity: "faible",
    perfumeryUse: "Note de cœur délicate dans les compositions aromatiques raffinées.",
    blendingNotes: "S'accorde avec marjolaine, lavande, agrumes, bois de rose.",
    recommendedDilution: "5-15%",
    notes: "Chémotype rare et précieux. Rendement faible mais propriétés exceptionnelles."
  },
  {
    name: "Thym à paracymène",
    code: "CT-THYM-PARACYMENE",
    plantName: "Thym",
    latinName: "Thymus vulgaris ct. paracymene",
    dominantMoleculeName: "p-Cymène",
    dominantPercentageMin: 35,
    dominantPercentageMax: 55,
    secondaryMolecules: [
      { name: "γ-Terpinène", percentageMin: 15, percentageMax: 30 },
      { name: "Thymol", percentageMin: 5, percentageMax: 15 },
      { name: "Carvacrol", percentageMin: 2, percentageMax: 8 }
    ],
    origin: "Sud de la France, Espagne",
    terroir: "Garrigue basse, sols très secs",
    altitude: "0-400m",
    climate: "Méditerranéen très sec",
    olfactiveProfile: "Terpénique, légèrement citronné, moins phénolique. Note de cumin.",
    olfactiveNotes: { top: ["Terpénique", "Citronné"], heart: ["Cumin", "Herbacé"], base: ["Boisé", "Terreux"] },
    intensity: 6,
    therapeuticProperties: "Antalgique, anti-inflammatoire, antirhumatismal. Moins antibactérien.",
    contraindications: "Peut être irritant à forte concentration. Dilution recommandée.",
    toxicity: "modérée",
    perfumeryUse: "Note de tête/cœur dans les compositions épicées et orientales.",
    blendingNotes: "S'accorde avec cumin, coriandre, agrumes, bois.",
    recommendedDilution: "2-8%",
    notes: "Chémotype intermédiaire, souvent précurseur des phénols. Récolte précoce recommandée."
  },

  // ============================================================================
  // ROMARIN (Rosmarinus officinalis) - 3 chémotypes
  // ============================================================================
  {
    name: "Romarin à camphre",
    code: "CT-ROS-CAMPHRE",
    plantName: "Romarin",
    latinName: "Rosmarinus officinalis ct. camphora",
    dominantMoleculeName: "Camphre",
    dominantPercentageMin: 20,
    dominantPercentageMax: 35,
    secondaryMolecules: [
      { name: "1,8-Cinéole", percentageMin: 15, percentageMax: 25 },
      { name: "α-Pinène", percentageMin: 10, percentageMax: 20 },
      { name: "Bornéol", percentageMin: 5, percentageMax: 12 }
    ],
    origin: "Espagne, Provence",
    terroir: "Garrigue méditerranéenne, sols calcaires secs",
    altitude: "0-600m",
    climate: "Méditerranéen sec et chaud",
    olfactiveProfile: "Camphrée, fraîche, pénétrante. Note médicinale prononcée avec fond herbacé.",
    olfactiveNotes: { top: ["Camphré vif", "Frais"], heart: ["Herbacé", "Eucalyptus léger"], base: ["Boisé", "Balsamique"] },
    intensity: 7,
    therapeuticProperties: "Décontractant musculaire, stimulant circulatoire, mucolytique. Neurotoxique à forte dose.",
    contraindications: "Contre-indiqué chez les épileptiques, femmes enceintes et enfants < 6 ans.",
    toxicity: "modérée",
    perfumeryUse: "Note de tête/cœur dans les compositions aromatiques et fougères.",
    blendingNotes: "S'accorde avec lavande, eucalyptus, pin, agrumes.",
    recommendedDilution: "2-5%",
    notes: "Chémotype le plus répandu en Espagne. Contre-indiqué chez les épileptiques et femmes enceintes."
  },
  {
    name: "Romarin à cinéole",
    code: "CT-ROS-CINEOLE",
    plantName: "Romarin",
    latinName: "Rosmarinus officinalis ct. cineole",
    dominantMoleculeName: "1,8-Cinéole",
    dominantPercentageMin: 40,
    dominantPercentageMax: 55,
    secondaryMolecules: [
      { name: "α-Pinène", percentageMin: 10, percentageMax: 20 },
      { name: "Camphre", percentageMin: 5, percentageMax: 15 },
      { name: "β-Pinène", percentageMin: 3, percentageMax: 8 }
    ],
    origin: "Maroc, Tunisie",
    terroir: "Plaines et collines nord-africaines, sols argilo-calcaires",
    altitude: "0-800m",
    climate: "Méditerranéen semi-aride",
    olfactiveProfile: "Frais, eucalyptol, herbacé-balsamique. Plus doux que le camphré.",
    olfactiveNotes: { top: ["Eucalyptus", "Frais mentholé"], heart: ["Herbacé", "Aromatique"], base: ["Balsamique", "Boisé doux"] },
    intensity: 6,
    therapeuticProperties: "Expectorant, mucolytique, antibactérien respiratoire. Bien toléré.",
    contraindications: "Éviter chez les asthmatiques. Prudence chez les enfants < 3 ans.",
    toxicity: "faible",
    perfumeryUse: "Note de tête fraîche dans les compositions aromatiques et eaux de cologne.",
    blendingNotes: "S'accorde avec eucalyptus, menthe, lavande, agrumes, bois de cèdre.",
    recommendedDilution: "5-15%",
    notes: "Chémotype le plus utilisé en aromathérapie respiratoire. Origine Maroc privilégiée."
  },
  {
    name: "Romarin à verbénone",
    code: "CT-ROS-VERBENONE",
    plantName: "Romarin",
    latinName: "Rosmarinus officinalis ct. verbenone",
    dominantMoleculeName: "Verbénone",
    dominantPercentageMin: 15,
    dominantPercentageMax: 30,
    secondaryMolecules: [
      { name: "α-Pinène", percentageMin: 15, percentageMax: 30 },
      { name: "Acétate de bornyle", percentageMin: 5, percentageMax: 15 },
      { name: "Camphre", percentageMin: 2, percentageMax: 8 }
    ],
    origin: "Corse, Sardaigne",
    terroir: "Maquis corse, sols granitiques et schisteux",
    altitude: "200-800m",
    climate: "Méditerranéen insulaire, influence maritime",
    olfactiveProfile: "Frais, herbacé-floral, légèrement fruité. Le plus délicat des romarins.",
    olfactiveNotes: { top: ["Frais herbacé", "Citronné léger"], heart: ["Floral", "Romarin doux"], base: ["Boisé fin", "Musqué"] },
    intensity: 5,
    therapeuticProperties: "Régénérant hépatique, mucolytique doux, cicatrisant cutané. Neurotoxique potentiel.",
    contraindications: "Neurotoxique potentiel, éviter chez les épileptiques et enfants < 6 ans.",
    toxicity: "modérée",
    perfumeryUse: "Note de cœur raffinée dans les compositions aromatiques de niche.",
    blendingNotes: "S'accorde avec immortelle, lavande, agrumes, bois précieux.",
    recommendedDilution: "2-8%",
    notes: "Chémotype rare et précieux, principalement corse. Rendement faible, prix élevé."
  },

  // ============================================================================
  // LAVANDE (Lavandula angustifolia) - 2 chémotypes principaux
  // ============================================================================
  {
    name: "Lavande à linalol",
    code: "CT-LAV-LINALOL",
    plantName: "Lavande vraie",
    latinName: "Lavandula angustifolia ct. linalool",
    dominantMoleculeName: "Linalol",
    dominantPercentageMin: 25,
    dominantPercentageMax: 45,
    secondaryMolecules: [
      { name: "Acétate de linalyle", percentageMin: 25, percentageMax: 45 },
      { name: "Lavandulol", percentageMin: 1, percentageMax: 5 },
      { name: "Terpinène-4-ol", percentageMin: 2, percentageMax: 6 }
    ],
    origin: "Haute-Provence, France",
    terroir: "Plateaux calcaires de Haute-Provence, sols drainants",
    altitude: "800-1400m",
    climate: "Méditerranéen d'altitude, hivers froids",
    olfactiveProfile: "Floral-herbacé classique, doux et apaisant. La lavande de référence.",
    olfactiveNotes: { top: ["Floral frais", "Herbacé"], heart: ["Lavande classique", "Doux"], base: ["Boisé léger", "Poudré"] },
    intensity: 5,
    therapeuticProperties: "Calmant nerveux, cicatrisant, antispasmodique, anti-inflammatoire. Très bien toléré.",
    contraindications: "Aucune contre-indication majeure aux doses recommandées.",
    toxicity: "faible",
    perfumeryUse: "Note de cœur universelle, base de nombreuses compositions florales et fougères.",
    blendingNotes: "S'accorde avec presque tout : agrumes, bois, épices, autres floraux.",
    recommendedDilution: "10-30%",
    notes: "Chémotype standard de la lavande fine. AOP Lavande de Haute-Provence."
  },
  {
    name: "Lavande à lavandulol",
    code: "CT-LAV-LAVANDULOL",
    plantName: "Lavande vraie",
    latinName: "Lavandula angustifolia ct. lavandulol",
    dominantMoleculeName: "Lavandulol",
    dominantPercentageMin: 8,
    dominantPercentageMax: 15,
    secondaryMolecules: [
      { name: "Linalol", percentageMin: 20, percentageMax: 35 },
      { name: "Acétate de linalyle", percentageMin: 20, percentageMax: 35 },
      { name: "Acétate de lavandulyle", percentageMin: 3, percentageMax: 8 }
    ],
    origin: "Alpes de Haute-Provence, France",
    terroir: "Haute altitude, sols calcaires pauvres",
    altitude: "1200-1800m",
    climate: "Montagnard méditerranéen",
    olfactiveProfile: "Plus herbacé et frais que le linalol, note verte prononcée. Caractère sauvage.",
    olfactiveNotes: { top: ["Herbacé vif", "Vert frais"], heart: ["Lavande sauvage", "Aromatique"], base: ["Terreux", "Boisé sec"] },
    intensity: 6,
    therapeuticProperties: "Propriétés similaires au linalol, légèrement plus tonique.",
    contraindications: "Aucune contre-indication majeure aux doses recommandées.",
    toxicity: "faible",
    perfumeryUse: "Note de cœur herbacée dans les compositions naturelles et de niche.",
    blendingNotes: "S'accorde avec herbes aromatiques, agrumes, bois, mousse de chêne.",
    recommendedDilution: "10-25%",
    notes: "Chémotype d'altitude, plus rare. Recherché en parfumerie de niche."
  },

  // ============================================================================
  // EUCALYPTUS - 3 chémotypes
  // ============================================================================
  {
    name: "Eucalyptus à cinéole (globulus)",
    code: "CT-EUC-CINEOLE",
    plantName: "Eucalyptus globulus",
    latinName: "Eucalyptus globulus",
    dominantMoleculeName: "1,8-Cinéole",
    dominantPercentageMin: 60,
    dominantPercentageMax: 85,
    secondaryMolecules: [
      { name: "α-Pinène", percentageMin: 5, percentageMax: 15 },
      { name: "Limonène", percentageMin: 2, percentageMax: 8 },
      { name: "Globulol", percentageMin: 1, percentageMax: 5 }
    ],
    origin: "Portugal, Espagne, Australie",
    terroir: "Plantations, sols profonds et humides",
    altitude: "0-500m",
    climate: "Méditerranéen à océanique",
    olfactiveProfile: "Frais, camphrée-eucalyptol, pénétrant. L'eucalyptus classique.",
    olfactiveNotes: { top: ["Eucalyptol vif", "Frais mentholé"], heart: ["Camphrée", "Balsamique"], base: ["Boisé", "Terreux"] },
    intensity: 8,
    therapeuticProperties: "Expectorant puissant, décongestionnant, antibactérien respiratoire.",
    contraindications: "Éviter chez les asthmatiques et enfants < 6 ans. Ne pas appliquer près du visage des nourrissons.",
    toxicity: "modérée",
    perfumeryUse: "Note de tête fraîche dans les compositions aromatiques et médicinales.",
    blendingNotes: "S'accorde avec pin, romarin, menthe, agrumes, lavande.",
    recommendedDilution: "3-10%",
    notes: "Espèce la plus utilisée en pharmacie. Éviter chez les asthmatiques."
  },
  {
    name: "Eucalyptus citronné",
    code: "CT-EUC-CITRIODORA",
    plantName: "Eucalyptus citriodora",
    latinName: "Corymbia citriodora",
    dominantMoleculeName: "Citronellal",
    dominantPercentageMin: 65,
    dominantPercentageMax: 85,
    secondaryMolecules: [
      { name: "Citronellol", percentageMin: 5, percentageMax: 15 },
      { name: "Isopulégol", percentageMin: 2, percentageMax: 8 },
      { name: "Néo-isopulégol", percentageMin: 1, percentageMax: 5 }
    ],
    origin: "Brésil, Madagascar, Chine",
    terroir: "Zones tropicales et subtropicales, sols variés",
    altitude: "0-800m",
    climate: "Tropical à subtropical",
    olfactiveProfile: "Citronné vif, frais, légèrement herbacé. Très différent du globulus.",
    olfactiveNotes: { top: ["Citron vif", "Frais"], heart: ["Citronnelle", "Herbacé"], base: ["Boisé léger", "Terreux"] },
    intensity: 7,
    therapeuticProperties: "Anti-inflammatoire puissant, antalgique, répulsif insectes.",
    contraindications: "Peut être irritant pour les peaux sensibles. Test cutané recommandé.",
    toxicity: "faible",
    perfumeryUse: "Note de tête citronnée dans les compositions fraîches et estivales.",
    blendingNotes: "S'accorde avec citronnelle, géranium, agrumes, menthe, basilic.",
    recommendedDilution: "5-15%",
    notes: "Pas d'eucalyptol, profil complètement différent. Excellent répulsif naturel."
  },
  {
    name: "Eucalyptus radié",
    code: "CT-EUC-RADIATA",
    plantName: "Eucalyptus radiata",
    latinName: "Eucalyptus radiata",
    dominantMoleculeName: "1,8-Cinéole",
    dominantPercentageMin: 60,
    dominantPercentageMax: 75,
    secondaryMolecules: [
      { name: "α-Terpinéol", percentageMin: 8, percentageMax: 15 },
      { name: "Limonène", percentageMin: 5, percentageMax: 12 },
      { name: "α-Pinène", percentageMin: 2, percentageMax: 6 }
    ],
    origin: "Australie",
    terroir: "Forêts australiennes, sols variés",
    altitude: "0-1000m",
    climate: "Tempéré à subtropical",
    olfactiveProfile: "Plus doux que globulus, frais-mentholé avec note florale.",
    olfactiveNotes: { top: ["Eucalyptol doux", "Frais"], heart: ["Floral léger", "Mentholé"], base: ["Boisé fin", "Balsamique"] },
    intensity: 6,
    therapeuticProperties: "Expectorant doux, immunostimulant, antibactérien. Mieux toléré que globulus.",
    contraindications: "Prudence chez les asthmatiques. Généralement bien toléré.",
    toxicity: "faible",
    perfumeryUse: "Note de tête douce dans les compositions aromatiques familiales.",
    blendingNotes: "S'accorde avec lavande, tea tree, agrumes, romarin, ravensara.",
    recommendedDilution: "5-20%",
    notes: "Préféré pour les enfants et personnes sensibles. Plus doux que globulus."
  },

  // ============================================================================
  // BASILIC (Ocimum basilicum) - 3 chémotypes
  // ============================================================================
  {
    name: "Basilic à linalol",
    code: "CT-BAS-LINALOL",
    plantName: "Basilic",
    latinName: "Ocimum basilicum ct. linalool",
    dominantMoleculeName: "Linalol",
    dominantPercentageMin: 40,
    dominantPercentageMax: 60,
    secondaryMolecules: [
      { name: "Eugénol", percentageMin: 5, percentageMax: 15 },
      { name: "1,8-Cinéole", percentageMin: 3, percentageMax: 10 },
      { name: "β-Caryophyllène", percentageMin: 2, percentageMax: 6 }
    ],
    origin: "Égypte, Europe du Sud",
    terroir: "Cultures irriguées, sols riches et drainants",
    altitude: "0-500m",
    climate: "Méditerranéen à subtropical",
    olfactiveProfile: "Doux, floral-herbacé, légèrement anisé. Le basilic européen classique.",
    olfactiveNotes: { top: ["Herbacé frais", "Floral"], heart: ["Basilic doux", "Légèrement anisé"], base: ["Boisé léger", "Épicé doux"] },
    intensity: 5,
    therapeuticProperties: "Antispasmodique, calmant nerveux, digestif. Bien toléré.",
    contraindications: "Aucune contre-indication majeure aux doses recommandées.",
    toxicity: "faible",
    perfumeryUse: "Note de cœur herbacée dans les compositions aromatiques et chyprées.",
    blendingNotes: "S'accorde avec agrumes, lavande, géranium, bois de rose, bergamote.",
    recommendedDilution: "5-15%",
    notes: "Chémotype européen, le plus doux. Utilisé en cuisine et aromathérapie."
  },
  {
    name: "Basilic à méthyl-chavicol (estragole)",
    code: "CT-BAS-ESTRAGOLE",
    plantName: "Basilic tropical",
    latinName: "Ocimum basilicum ct. methyl chavicol",
    dominantMoleculeName: "Estragole",
    dominantPercentageMin: 70,
    dominantPercentageMax: 85,
    secondaryMolecules: [
      { name: "Linalol", percentageMin: 5, percentageMax: 15 },
      { name: "1,8-Cinéole", percentageMin: 2, percentageMax: 8 },
      { name: "β-Caryophyllène", percentageMin: 1, percentageMax: 4 }
    ],
    origin: "Vietnam, Inde, Comores",
    terroir: "Zones tropicales, sols riches et humides",
    altitude: "0-300m",
    climate: "Tropical humide",
    olfactiveProfile: "Anisé puissant, herbacé-épicé, caractère exotique marqué.",
    olfactiveNotes: { top: ["Anisé vif", "Herbacé"], heart: ["Estragon", "Épicé"], base: ["Boisé", "Réglisse"] },
    intensity: 8,
    therapeuticProperties: "Antispasmodique puissant, antalgique, anti-inflammatoire. Potentiellement cancérigène à haute dose.",
    contraindications: "Potentiellement cancérigène à haute dose. Usage limité recommandé. Restrictions IFRA.",
    toxicity: "élevée",
    perfumeryUse: "Note de cœur anisée dans les compositions orientales et épicées (usage limité).",
    blendingNotes: "S'accorde avec anis, fenouil, agrumes, épices chaudes.",
    recommendedDilution: "0.5-2%",
    notes: "Chémotype tropical, usage professionnel. Restrictions IFRA sur l'estragole."
  },
  {
    name: "Basilic à eugénol (basilic sacré)",
    code: "CT-BAS-EUGENOL",
    plantName: "Basilic sacré (Tulsi)",
    latinName: "Ocimum tenuiflorum (sanctum)",
    dominantMoleculeName: "Eugénol",
    dominantPercentageMin: 40,
    dominantPercentageMax: 70,
    secondaryMolecules: [
      { name: "β-Caryophyllène", percentageMin: 10, percentageMax: 25 },
      { name: "Méthyl-eugénol", percentageMin: 5, percentageMax: 15 },
      { name: "Germacrène D", percentageMin: 2, percentageMax: 8 }
    ],
    origin: "Inde",
    terroir: "Plaines indiennes, sols variés, culture traditionnelle",
    altitude: "0-1500m",
    climate: "Tropical à subtropical",
    olfactiveProfile: "Épicé-clou de girofle, chaud, légèrement camphrée. Caractère sacré.",
    olfactiveNotes: { top: ["Clou de girofle", "Épicé vif"], heart: ["Herbacé chaud", "Camphrée léger"], base: ["Boisé", "Balsamique"] },
    intensity: 7,
    therapeuticProperties: "Adaptogène, immunostimulant, antibactérien, antioxydant puissant.",
    contraindications: "Peut être irritant pour les peaux sensibles. Éviter pendant la grossesse.",
    toxicity: "modérée",
    perfumeryUse: "Note de cœur épicée dans les compositions orientales et spirituelles.",
    blendingNotes: "S'accorde avec clou de girofle, cannelle, encens, santal, patchouli.",
    recommendedDilution: "2-8%",
    notes: "Plante sacrée en Inde (Tulsi). Propriétés adaptogènes reconnues."
  }
];

async function importChemotypes() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log("🧬 Import des chémotypes classiques...\n");
  
  let imported = 0;
  let skipped = 0;
  
  for (const chemotype of chemotypesData) {
    try {
      // Vérifier si le chémotype existe déjà
      const [existing] = await connection.execute(
        'SELECT id FROM chemotypes WHERE code = ? OR (plant_name = ? AND dominant_molecule_name = ?)',
        [chemotype.code, chemotype.plantName, chemotype.dominantMoleculeName]
      );
      
      if (existing.length > 0) {
        console.log(`⏭️  Chémotype existant: ${chemotype.name}`);
        skipped++;
        continue;
      }
      
      // Rechercher l'ID de la plante parente
      const [plants] = await connection.execute(
        'SELECT id FROM plants WHERE name LIKE ? OR latin_name LIKE ? LIMIT 1',
        [`%${chemotype.plantName}%`, `%${chemotype.plantName}%`]
      );
      const plantId = plants.length > 0 ? plants[0].id : null;
      
      // Rechercher l'ID de la molécule dominante
      const [molecules] = await connection.execute(
        'SELECT id FROM molecules WHERE name LIKE ? LIMIT 1',
        [`%${chemotype.dominantMoleculeName}%`]
      );
      const moleculeId = molecules.length > 0 ? molecules[0].id : null;
      
      // Insérer le chémotype avec les bonnes colonnes
      await connection.execute(
        `INSERT INTO chemotypes (
          name, code, plant_id, plant_name, latin_name,
          dominant_molecule_id, dominant_molecule_name,
          dominant_percentage_min, dominant_percentage_max,
          secondary_molecules, origin, terroir, altitude, climate,
          olfactive_profile, olfactive_notes, intensity,
          therapeutic_properties, contraindications, toxicity,
          perfumery_use, blending_notes, recommended_dilution, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          chemotype.name,
          chemotype.code,
          plantId,
          chemotype.plantName,
          chemotype.latinName,
          moleculeId,
          chemotype.dominantMoleculeName,
          chemotype.dominantPercentageMin,
          chemotype.dominantPercentageMax,
          JSON.stringify(chemotype.secondaryMolecules),
          chemotype.origin,
          chemotype.terroir,
          chemotype.altitude,
          chemotype.climate,
          chemotype.olfactiveProfile,
          JSON.stringify(chemotype.olfactiveNotes),
          chemotype.intensity,
          chemotype.therapeuticProperties,
          chemotype.contraindications,
          chemotype.toxicity,
          chemotype.perfumeryUse,
          chemotype.blendingNotes,
          chemotype.recommendedDilution,
          chemotype.notes
        ]
      );
      
      console.log(`✅ Importé: ${chemotype.name} (${chemotype.code})`);
      imported++;
      
    } catch (error) {
      console.error(`❌ Erreur pour ${chemotype.name}:`, error.message);
    }
  }
  
  await connection.end();
  
  console.log("\n" + "=".repeat(60));
  console.log(`📊 Résumé de l'import:`);
  console.log(`   - Importés: ${imported}`);
  console.log(`   - Ignorés (existants): ${skipped}`);
  console.log(`   - Total traités: ${imported + skipped}`);
  console.log("=".repeat(60));
}

importChemotypes().catch(console.error);
