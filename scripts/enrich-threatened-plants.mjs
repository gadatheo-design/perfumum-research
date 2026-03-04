/**
 * Enrichissement des données des plantes menacées/disparues
 * Ajoute : notes de conservation, facteurs de menace, alternatives durables,
 * coordonnées GPS précises, profils olfactifs, propriétés thérapeutiques
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const enrichments = [
  {
    name: 'Silphium',
    conservation_notes: 'Éteint depuis le 1er siècle ap. J.-C. Surexploitation intensive pour ses usages médicinaux, culinaires et comme contraceptif. Impossible à cultiver. Seul spécimen connu : Ferula drudeana découvert en Turquie en 2021.',
    threat_factors: JSON.stringify({ overharvesting: true, extinction: true, historical: true }),
    sustainable_alternatives: 'Asa-foetida (Ferula assa-foetida) comme substitut partiel. Galbanum (Ferula gummosa) pour les notes résineuses.',
    therapeutic_properties: JSON.stringify(['antispasmodique', 'contraceptif (historique)', 'expectorant', 'antiparasitaire']),
    historical_significance: 'Plante la plus précieuse de l\'Antiquité. Valait son poids en argent. Symbole de Cyrène (Libye actuelle). Disparition = première extinction documentée due à l\'humain.',
    latitude: 37.8667, longitude: 32.4833, // Konya, Turquie (Ferula drudeana)
  },
  {
    name: 'Aquilaria',
    conservation_notes: 'En danger critique. Surexploitation massive pour la production d\'oud (bois d\'agar). 90% des populations sauvages décimées en 30 ans. Plantations en cours en Asie du Sud-Est.',
    threat_factors: JSON.stringify({ overharvesting: true, deforestation: true, illegal_trade: true }),
    sustainable_alternatives: 'Oud de synthèse (Iso E Super, Ambrox). Plantations certifiées CITES en Malaisie et Cambodge. Oud de culture par inoculation fongique.',
    therapeutic_properties: JSON.stringify(['anti-inflammatoire', 'anxiolytique', 'antimicrobien', 'aphrodisiaque (traditionnel)']),
    latitude: 3.1390, longitude: 101.6869, // Malaisie
  },
  {
    name: 'Bois d\'agar',
    conservation_notes: 'En danger critique (Aquilaria crassna). Espèce cambodgienne quasi disparue à l\'état sauvage. Listée CITES Annexe II depuis 1994. Quelques plantations certifiées subsistent.',
    threat_factors: JSON.stringify({ overharvesting: true, deforestation: true, illegal_trade: true }),
    sustainable_alternatives: 'Plantations certifiées au Cambodge et Vietnam. Oud de synthèse. Autres espèces Aquilaria moins menacées.',
    latitude: 12.5657, longitude: 104.9910, // Cambodge
  },
  {
    name: 'Commiphora',
    conservation_notes: 'En danger critique (Commiphora wightii, Guggul). Surexploitation pour la résine (guggulstérone). Populations indiennes et pakistanaises en déclin sévère. Récolte réglementée mais peu appliquée.',
    threat_factors: JSON.stringify({ overharvesting: true, habitat_loss: true, overgrazing: true }),
    sustainable_alternatives: 'Myrrhe (Commiphora myrrha) pour les notes résineuses. Synthèse chimique des guggulstérones pour usage médical.',
    therapeutic_properties: JSON.stringify(['anti-inflammatoire', 'hypolipémiant', 'antioxydant', 'antimicrobien']),
    latitude: 25.0961, longitude: 70.9734, // Rajasthan, Inde
  },
  {
    name: 'Costus',
    conservation_notes: 'En danger critique (Saussurea costus). CITES Annexe I = commerce international interdit. Racines récoltées illégalement dans l\'Himalaya pour la parfumerie et la médecine ayurvédique.',
    threat_factors: JSON.stringify({ overharvesting: true, illegal_trade: true, habitat_loss: true, climate_change: true }),
    sustainable_alternatives: 'Costus de synthèse (Cyclopentadecanolide). Huile d\'iris pour les notes terreuses. Vétiver pour les notes racinaires.',
    therapeutic_properties: JSON.stringify(['anti-inflammatoire', 'bronchodilatateur', 'antiparasitaire', 'tonique digestif']),
    latitude: 34.0837, longitude: 74.7973, // Cachemire
  },
  {
    name: 'Nard (Spikenard)',
    conservation_notes: 'En danger critique (Nardostachys jatamansi). CITES Annexe II. Rhizomes récoltés massivement dans l\'Himalaya (Népal, Inde, Chine). Utilisé depuis l\'Antiquité (onguent de nard de la Bible).',
    threat_factors: JSON.stringify({ overharvesting: true, illegal_trade: true, habitat_loss: true }),
    sustainable_alternatives: 'Vétiver pour les notes terreuses/racinaires. Nard de synthèse. Valériane pour les notes musquées.',
    therapeutic_properties: JSON.stringify(['sédatif', 'anxiolytique', 'anti-inflammatoire', 'antifongique', 'cardiotonique']),
    latitude: 28.3949, longitude: 84.1240, // Népal
  },
  {
    name: 'Aniba',
    conservation_notes: 'En danger (Aniba rosaeodora, Bois de rose). Déforestation amazonienne massive pour l\'extraction du linalol. Espèce protégée au Brésil depuis 1992 mais braconnage persistant.',
    threat_factors: JSON.stringify({ deforestation: true, overharvesting: true, illegal_logging: true }),
    sustainable_alternatives: 'Linalol de synthèse (>90% du marché). Ho wood (Cinnamomum camphora var. linaloolifera) certifié FSC. Coriandre pour les notes florales-boisées.',
    therapeutic_properties: JSON.stringify(['antibactérien', 'antifongique', 'anxiolytique', 'anti-infectieux']),
    latitude: -3.1190, longitude: -60.0217, // Manaus, Amazonie
  },
  {
    name: 'Cèdre de l\'Atlas',
    conservation_notes: 'En danger (Cedrus atlantica). Forêts du Maroc et d\'Algérie en déclin sévère. Changement climatique, surpâturage et coupe illégale. Classé EN sur la liste rouge IUCN 2011.',
    threat_factors: JSON.stringify({ climate_change: true, deforestation: true, overgrazing: true }),
    sustainable_alternatives: 'Cèdre de Virginie (Juniperus virginiana) comme substitut. Cèdre de l\'Himalaya (Cedrus deodara). Cèdre de synthèse (Cedryl acetate).',
    therapeutic_properties: JSON.stringify(['antiseptique', 'expectorant', 'astringent', 'insectifuge', 'lymphotonique']),
    latitude: 33.9716, longitude: -5.0003, // Moyen Atlas, Maroc
  },
  {
    name: 'Styrax liquide',
    conservation_notes: 'En danger (Liquidambar orientalis). Endémique de Turquie (région de Muğla). Forêts réduites à quelques milliers d\'hectares. Récolte de styrax par incision de l\'écorce.',
    threat_factors: JSON.stringify({ deforestation: true, habitat_loss: true, agricultural_expansion: true }),
    sustainable_alternatives: 'Styrax de synthèse (Cinnamyl cinnamate). Benjoin (Styrax benzoin) comme substitut. Baume du Pérou.',
    therapeutic_properties: JSON.stringify(['antiseptique', 'expectorant', 'cicatrisant', 'anti-inflammatoire']),
    latitude: 37.2153, longitude: 28.3636, // Muğla, Turquie
  },
  {
    name: 'Benjoin',
    conservation_notes: 'Vulnérable (Styrax benzoin). Arbres saignés jusqu\'à épuisement en Indonésie et Laos. Demande croissante pour la parfumerie et l\'encens. Pas de plantations durables établies.',
    threat_factors: JSON.stringify({ overharvesting: true, deforestation: true }),
    sustainable_alternatives: 'Benjoin de Siam (Styrax tonkinensis) moins menacé. Vanilline de synthèse pour les notes vanillées. Baume de Tolu.',
    therapeutic_properties: JSON.stringify(['antiseptique', 'expectorant', 'cicatrisant', 'anti-inflammatoire', 'sédatif']),
    latitude: 2.5000, longitude: 112.5000, // Bornéo, Indonésie
  },
  {
    name: 'Bois de Santal',
    conservation_notes: 'Vulnérable (Santalum album). Espèce protégée en Inde (Karnataka, Tamil Nadu). Arbres sauvages quasi épuisés. Plantations en Australie et Inde en cours de développement.',
    threat_factors: JSON.stringify({ overharvesting: true, illegal_logging: true, slow_growth: true }),
    sustainable_alternatives: 'Santal australien (Santalum spicatum). Santal de synthèse (Santalol, Javanol, Ebanol). Amyris (Amyris balsamifera) pour les notes crémeuses.',
    therapeutic_properties: JSON.stringify(['antiseptique', 'anti-inflammatoire', 'anxiolytique', 'aphrodisiaque', 'cicatrisant']),
    latitude: 12.9716, longitude: 77.5946, // Karnataka, Inde
  },
  {
    name: 'Copal',
    conservation_notes: 'Vulnérable (Bursera spp.). Multiples espèces mexicaines et centraméricaines menacées par la déforestation et la surexploitation pour l\'encens. Usage rituel intensif.',
    threat_factors: JSON.stringify({ deforestation: true, overharvesting: true, ritual_use: true }),
    sustainable_alternatives: 'Copal de synthèse. Encens (Boswellia) pour les notes résineuses. Résine de pin pour les notes fumées.',
    therapeutic_properties: JSON.stringify(['antiseptique', 'anti-inflammatoire', 'cicatrisant', 'expectorant']),
    latitude: 19.4326, longitude: -99.1332, // Mexique
  },
  {
    name: 'Encens d\'Éthiopie',
    conservation_notes: 'Vulnérable (Boswellia papyrifera). Populations en déclin de 7% par an. Surexploitation de la résine, feux de brousse, pâturage intensif. Régénération naturelle quasi nulle.',
    threat_factors: JSON.stringify({ overharvesting: true, fire: true, overgrazing: true, climate_change: true }),
    sustainable_alternatives: 'Encens d\'Oman (Boswellia sacra) moins menacé. Encens de synthèse (Olibanum reconstitué). Réduction de la fréquence de saignée.',
    therapeutic_properties: JSON.stringify(['anti-inflammatoire', 'anxiolytique', 'immunostimulant', 'anticancéreux (études préliminaires)', 'expectorant']),
    latitude: 12.3640, longitude: 37.3521, // Éthiopie
  },
  {
    name: 'Galbanum',
    conservation_notes: 'Vulnérable (Ferula gummosa). Endémique d\'Iran et d\'Asie centrale. Surexploitation pour la résine. Habitat aride fragile. Peu de données sur les populations actuelles.',
    threat_factors: JSON.stringify({ overharvesting: true, habitat_loss: true, drought: true }),
    sustainable_alternatives: 'Galbanum de synthèse (Galbanum base). Angélique pour les notes vertes-résineuses. Sauge sclarée pour les notes herbacées.',
    therapeutic_properties: JSON.stringify(['anti-inflammatoire', 'antispasmodique', 'cicatrisant', 'expectorant', 'antimicrobien']),
    latitude: 35.6892, longitude: 51.3890, // Iran
  },
  {
    name: 'Sandalwood australien',
    conservation_notes: 'Vulnérable (Santalum spicatum). Populations d\'Australie occidentale surexploitées au 19e-20e siècle. Récupération lente. Plantations certifiées FSC en cours.',
    threat_factors: JSON.stringify({ overharvesting: true, slow_growth: true, historical_logging: true }),
    sustainable_alternatives: 'Plantations certifiées FSC en Australie. Santal de synthèse. Amyris pour les notes crémeuses.',
    therapeutic_properties: JSON.stringify(['antiseptique', 'anti-inflammatoire', 'anxiolytique', 'cicatrisant']),
    latitude: -25.0000, longitude: 115.0000, // Australie occidentale
  },
  {
    name: 'Élémi',
    conservation_notes: 'Vulnérable (Canarium luzonicum). Endémique des Philippines. Déforestation massive des forêts tropicales philippines. Récolte de résine par incision.',
    threat_factors: JSON.stringify({ deforestation: true, habitat_loss: true }),
    sustainable_alternatives: 'Élémi de synthèse. Encens pour les notes résineuses. Citron pour les notes fraîches-citronnées.',
    therapeutic_properties: JSON.stringify(['antiseptique', 'cicatrisant', 'expectorant', 'stimulant']),
    latitude: 11.8031, longitude: 122.5621, // Philippines
  },
  {
    name: 'Encens / Oliban',
    conservation_notes: 'Quasi menacé (Boswellia carterii). Populations en déclin en Somalie et Éthiopie. Surexploitation de la résine, sécheresse, insectes ravageurs. Régénération insuffisante.',
    threat_factors: JSON.stringify({ overharvesting: true, drought: true, pests: true }),
    sustainable_alternatives: 'Oliban de synthèse. Boswellia serrata (moins menacé). Réduction de la fréquence de saignée à 3-4 ans.',
    therapeutic_properties: JSON.stringify(['anti-inflammatoire', 'anxiolytique', 'immunostimulant', 'expectorant', 'cicatrisant']),
    latitude: 10.0000, longitude: 49.0000, // Somalie
  },
  {
    name: 'Encens d\'Oman',
    conservation_notes: 'Quasi menacé (Boswellia sacra). Populations omanaises et yéménites sous pression. Surexploitation pour l\'encens de haute qualité (Hojari). Changement climatique aggravant.',
    threat_factors: JSON.stringify({ overharvesting: true, climate_change: true, drought: true }),
    sustainable_alternatives: 'Boswellia serrata (Inde) certifié. Oliban de synthèse. Réduction de la pression de récolte.',
    therapeutic_properties: JSON.stringify(['anti-inflammatoire', 'anxiolytique', 'immunostimulant', 'anticancéreux (études)', 'expectorant']),
    latitude: 17.0000, longitude: 54.0000, // Dhofar, Oman
  },
  {
    name: 'Encens indien (Shallaki)',
    conservation_notes: 'Quasi menacé (Boswellia serrata). Forêts indiennes (Rajasthan, Madhya Pradesh) sous pression. Demande croissante pour les compléments alimentaires (acide boswellique).',
    threat_factors: JSON.stringify({ overharvesting: true, deforestation: true, agricultural_expansion: true }),
    sustainable_alternatives: 'Plantations gérées en Inde. Synthèse des acides boswelliques pour usage médical.',
    therapeutic_properties: JSON.stringify(['anti-inflammatoire puissant', 'antiarthritique', 'immunomodulateur', 'anticancéreux (études)']),
    latitude: 23.2599, longitude: 77.4126, // Madhya Pradesh, Inde
  },
  {
    name: 'Iris de Florence',
    conservation_notes: 'Quasi menacé (Iris pallida). Populations sauvages de Toscane réduites. Culture intensive pour l\'orris butter (3-5 ans de séchage). Très haute valeur économique.',
    threat_factors: JSON.stringify({ agricultural_intensification: true, habitat_loss: true }),
    sustainable_alternatives: 'Irone de synthèse (α-Irone). Violette pour les notes florales. Orris de synthèse (Irisone).',
    therapeutic_properties: JSON.stringify(['anti-inflammatoire', 'expectorant', 'diurétique', 'émétique (haute dose)']),
    latitude: 43.7696, longitude: 11.2558, // Florence, Toscane
  },
  {
    name: 'Myrrhe',
    conservation_notes: 'Quasi menacé (Commiphora myrrha). Populations de Somalie, Éthiopie et Yémen sous pression. Surexploitation de la résine, conflits armés perturbant la gestion.',
    threat_factors: JSON.stringify({ overharvesting: true, conflict: true, drought: true }),
    sustainable_alternatives: 'Myrrhe de synthèse. Opoponax (Commiphora guidottii) pour les notes douces. Réduction de la fréquence de saignée.',
    therapeutic_properties: JSON.stringify(['antiseptique', 'anti-inflammatoire', 'cicatrisant', 'expectorant', 'antifongique']),
    latitude: 5.1521, longitude: 46.1996, // Somalie
  },
  {
    name: 'Oliban (Encens)',
    conservation_notes: 'Quasi menacé (Boswellia sacra, doublon). Voir Encens d\'Oman pour les détails de conservation.',
    threat_factors: JSON.stringify({ overharvesting: true, climate_change: true }),
    sustainable_alternatives: 'Boswellia serrata certifié. Oliban de synthèse.',
    latitude: 17.0000, longitude: 54.0000,
  },
  {
    name: 'Opoponax (Myrrhe douce)',
    conservation_notes: 'Données insuffisantes (Commiphora guidottii). Endémique de Somalie et Éthiopie. Peu d\'études sur les populations. Usage croissant en parfumerie niche.',
    threat_factors: JSON.stringify({ overharvesting: true, data_deficient: true }),
    sustainable_alternatives: 'Myrrhe (Commiphora myrrha). Labdanum pour les notes balsamiques-animales.',
    therapeutic_properties: JSON.stringify(['antiseptique', 'anti-inflammatoire', 'cicatrisant', 'expectorant']),
    latitude: 4.0000, longitude: 42.0000, // Somalie/Éthiopie
  },
];

let updated = 0;
let skipped = 0;

for (const plant of enrichments) {
  const { name, ...data } = plant;
  
  // Construire la requête de mise à jour
  const updates = [];
  const values = [];
  
  if (data.conservation_notes) {
    updates.push('conservation_notes = ?');
    values.push(data.conservation_notes);
  }
  if (data.threat_factors) {
    updates.push('threat_factors = ?');
    values.push(data.threat_factors);
  }
  if (data.sustainable_alternatives) {
    updates.push('sustainable_alternatives = ?');
    values.push(data.sustainable_alternatives);
  }
  if (data.therapeutic_properties) {
    updates.push('therapeutic_properties = ?');
    values.push(data.therapeutic_properties);
  }
  if (data.historical_significance) {
    updates.push('historical_significance = ?');
    values.push(data.historical_significance);
  }
  if (data.latitude) {
    updates.push('latitude = ?');
    values.push(data.latitude);
  }
  if (data.longitude) {
    updates.push('longitude = ?');
    values.push(data.longitude);
  }
  
  if (updates.length === 0) { skipped++; continue; }
  
  values.push(name);
  const [result] = await conn.execute(
    `UPDATE plants SET ${updates.join(', ')} WHERE name LIKE ?`,
    values
  );
  
  if (result.affectedRows > 0) {
    console.log(`  ✓ ${name} (${result.affectedRows} ligne(s))`);
    updated++;
  } else {
    console.log(`  ⚠ Non trouvé: ${name}`);
    skipped++;
  }
}

console.log(`\n✅ ${updated} plantes enrichies, ${skipped} ignorées`);
await conn.end();
