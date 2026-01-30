/**
 * Script d'import des alternatives durables pour les espèces menacées
 * PERFUMUM Research Project
 * 
 * Ce script peuple la table sustainable_alternatives avec les alternatives
 * connues pour les espèces menacées utilisées en parfumerie.
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Récupérer les plantes menacées existantes
const [threatenedPlants] = await conn.query(`
  SELECT id, name, conservation_status 
  FROM plants 
  WHERE conservation_status IN ('CR', 'EN', 'VU', 'NT')
`);

console.log('Plantes menacées trouvées:', threatenedPlants.length);
threatenedPlants.forEach(p => console.log(`  - ${p.id}: ${p.name} (${p.conservation_status})`));

// Définir les alternatives durables
// Colonnes disponibles: threatened_plant_id, threatened_plant_name, alternative_plant_id, alternative_name,
// alternative_type, olfactive_similarity, olfactive_notes, availability, sustainability_score,
// certifications (json), price_comparison, suppliers (json), usage_recommendations, key_molecules (json),
// references (json), notes, verified, verified_by, verified_at

const alternatives = [
  // ============================================================================
  // BOIS DE ROSE (Aniba rosaeodora) - EN (En danger)
  // ============================================================================
  {
    threatened_plant_name: 'Aniba',
    alternative_name: 'Ho Wood (Cinnamomum camphora ct. linalol)',
    alternative_type: 'natural_plant',
    olfactive_similarity: 'very_similar',
    olfactive_notes: 'Le Ho Wood offre un profil très similaire au Bois de Rose, avec une dominance de linalol (90-98%). Notes florales-boisées légèrement plus camphrées mais excellente substitution.',
    availability: 'widely_available',
    sustainability_score: 95,
    price_comparison: 'cheaper',
    usage_recommendations: 'Parfumerie fine, cosmétiques, aromathérapie. Substitut direct dans la plupart des formulations.',
    key_molecules: JSON.stringify(['Linalol (90-98%)', 'Acétate de linalyle', 'Oxyde de linalol']),
    certifications: JSON.stringify(['FSC', 'Bio disponible']),
    notes: 'Alternative la plus recommandée. Culture durable établie depuis des décennies. Profil olfactif quasi-identique. Source: Chine, Taiwan.'
  },
  {
    threatened_plant_name: 'Aniba',
    alternative_name: 'Linalol de synthèse',
    alternative_type: 'synthetic',
    olfactive_similarity: 'identical',
    olfactive_notes: 'Linalol pur de synthèse, molécule identique à celle du Bois de Rose naturel.',
    availability: 'widely_available',
    sustainability_score: 85,
    price_comparison: 'much_cheaper',
    usage_recommendations: 'Parfumerie fonctionnelle, cosmétiques grand public, produits ménagers.',
    key_molecules: JSON.stringify(['Linalol (99%+)']),
    certifications: JSON.stringify(['REACH', 'IFRA compliant']),
    notes: 'Solution économique et écologique pour les grandes productions. Production mondiale.'
  },
  {
    threatened_plant_name: 'Aniba',
    alternative_name: 'Bois de Rose cultivé (Guyane française)',
    alternative_type: 'cultivated',
    olfactive_similarity: 'identical',
    olfactive_notes: 'Profil identique au Bois de Rose sauvage, issu de plantations durables.',
    availability: 'limited',
    sustainability_score: 90,
    price_comparison: 'similar',
    usage_recommendations: 'Parfumerie de luxe, formulations haut de gamme nécessitant l\'appellation naturelle.',
    key_molecules: JSON.stringify(['Linalol (82-90%)', 'α-terpinéol', 'Géraniol']),
    certifications: JSON.stringify(['Bio', 'Fair Trade disponible']),
    notes: 'Plantations certifiées ONF. Production limitée mais en croissance. Source: Guyane française.'
  },

  // ============================================================================
  // BOIS DE SANTAL INDIEN (Santalum album) - EN (En danger)
  // ============================================================================
  {
    threatened_plant_name: 'Bois de Santal',
    alternative_name: 'Santal australien (Santalum spicatum)',
    alternative_type: 'natural_plant',
    olfactive_similarity: 'similar',
    olfactive_notes: 'Notes boisées-crémeuses similaires mais plus sèches et moins lactées que le Santal indien. Teneur en santalol plus faible (20-25% vs 90%).',
    availability: 'available',
    sustainability_score: 85,
    price_comparison: 'cheaper',
    usage_recommendations: 'Parfumerie fine, cosmétiques. Bon substitut pour les notes de fond boisées.',
    key_molecules: JSON.stringify(['α-santalol (15-25%)', 'β-santalol', 'Farnesol', 'Nuciférol']),
    certifications: JSON.stringify(['Certification durable australienne']),
    notes: 'Récolte régulée par le gouvernement australien. Profil différent mais apprécié. Source: Australie occidentale.'
  },
  {
    threatened_plant_name: 'Bois de Santal',
    alternative_name: 'Santal de Nouvelle-Calédonie (Santalum austrocaledonicum)',
    alternative_type: 'natural_plant',
    olfactive_similarity: 'very_similar',
    olfactive_notes: 'Profil très proche du Santal indien avec des notes crémeuses-lactées. Teneur en santalol élevée (jusqu\'à 70%).',
    availability: 'limited',
    sustainability_score: 80,
    price_comparison: 'similar',
    usage_recommendations: 'Parfumerie de luxe, substitut premium pour le Santal indien.',
    key_molecules: JSON.stringify(['α-santalol (40-50%)', 'β-santalol (20-25%)', 'Z-lanceol']),
    certifications: JSON.stringify(['Gestion communautaire']),
    notes: 'Qualité exceptionnelle mais production très limitée. Source: Nouvelle-Calédonie, Vanuatu.'
  },
  {
    threatened_plant_name: 'Bois de Santal',
    alternative_name: 'Santal cultivé (Inde, Australie)',
    alternative_type: 'cultivated',
    olfactive_similarity: 'identical',
    olfactive_notes: 'Profil identique au Santal indien sauvage, issu de plantations durables.',
    availability: 'available',
    sustainability_score: 90,
    price_comparison: 'more_expensive',
    usage_recommendations: 'Parfumerie haut de gamme, formulations nécessitant le profil authentique.',
    key_molecules: JSON.stringify(['α-santalol (45-55%)', 'β-santalol (20-25%)']),
    certifications: JSON.stringify(['Bio', 'FSC disponible']),
    notes: 'Plantations de 15-20 ans nécessaires. Prix élevé mais qualité garantie. Source: Inde (Karnataka, Tamil Nadu), Australie (Queensland).'
  },
  {
    threatened_plant_name: 'Bois de Santal',
    alternative_name: 'Santalol de synthèse / Javanol',
    alternative_type: 'synthetic',
    olfactive_similarity: 'similar',
    olfactive_notes: 'Molécules synthétiques reproduisant l\'aspect crémeux-boisé du santal. Javanol® (Givaudan) et Polysantol® (Firmenich) sont les plus utilisés.',
    availability: 'widely_available',
    sustainability_score: 85,
    price_comparison: 'much_cheaper',
    usage_recommendations: 'Parfumerie fonctionnelle, cosmétiques, produits grand public.',
    key_molecules: JSON.stringify(['Javanol', 'Polysantol', 'Sandalore', 'Bacdanol']),
    certifications: JSON.stringify(['IFRA compliant']),
    notes: 'Excellentes alternatives synthétiques. Très utilisées dans l\'industrie. Production mondiale.'
  },

  // ============================================================================
  // BOIS D'AGAR / OUD (Aquilaria spp.) - CR (En danger critique)
  // ============================================================================
  {
    threatened_plant_name: 'Aquilaria',
    alternative_name: 'Oud de plantation (Aquilaria cultivé)',
    alternative_type: 'cultivated',
    olfactive_similarity: 'similar',
    olfactive_notes: 'Profil variable selon la méthode d\'inoculation. Notes boisées-animales moins complexes que l\'oud sauvage mais de bonne qualité.',
    availability: 'available',
    sustainability_score: 85,
    price_comparison: 'cheaper',
    usage_recommendations: 'Parfumerie orientale, encens, formulations boisées-animales.',
    key_molecules: JSON.stringify(['Agarospirol', 'Jinkohol', 'Guaiol', 'δ-guaiène']),
    certifications: JSON.stringify(['CITES Appendix II', 'Certification durable disponible']),
    notes: 'Inoculation artificielle des arbres. Qualité en amélioration constante. Source: Thaïlande, Vietnam, Laos, Bangladesh.'
  },
  {
    threatened_plant_name: 'Aquilaria',
    alternative_name: 'Oud de biotechnologie',
    alternative_type: 'biotechnology',
    olfactive_similarity: 'partial',
    olfactive_notes: 'Profil simplifié mais caractéristique. Notes boisées-fumées sans la complexité animale de l\'oud naturel.',
    availability: 'limited',
    sustainability_score: 95,
    price_comparison: 'cheaper',
    usage_recommendations: 'Parfumerie moderne, formulations vegan, cosmétiques.',
    key_molecules: JSON.stringify(['Agarospirol', 'Guaiol', 'Composés sesquiterpéniques']),
    certifications: JSON.stringify(['Vegan', 'Cruelty-free']),
    notes: 'Technologie émergente. Givaudan et autres développent des alternatives biotechnologiques. Source: Laboratoires (USA, Europe).'
  },
  {
    threatened_plant_name: 'Aquilaria',
    alternative_name: 'Oud synthétique / Cashmeran blend',
    alternative_type: 'synthetic',
    olfactive_similarity: 'inspired',
    olfactive_notes: 'Accords synthétiques évoquant l\'oud. Cashmeran, Iso E Super, et muscs boisés créent une impression similaire.',
    availability: 'widely_available',
    sustainability_score: 85,
    price_comparison: 'much_cheaper',
    usage_recommendations: 'Parfumerie grand public, cosmétiques, produits orientaux accessibles.',
    key_molecules: JSON.stringify(['Cashmeran', 'Iso E Super', 'Georgywood', 'Muscs synthétiques']),
    certifications: JSON.stringify(['IFRA compliant']),
    notes: 'Très utilisé dans l\'industrie. Permet de créer des accords "oud-like" économiques. Production mondiale.'
  },
  {
    threatened_plant_name: "Bois d'agar",
    alternative_name: 'Oud de plantation (Aquilaria cultivé)',
    alternative_type: 'cultivated',
    olfactive_similarity: 'similar',
    olfactive_notes: 'Profil variable selon la méthode d\'inoculation. Notes boisées-animales moins complexes que l\'oud sauvage mais de bonne qualité.',
    availability: 'available',
    sustainability_score: 85,
    price_comparison: 'cheaper',
    usage_recommendations: 'Parfumerie orientale, encens, formulations boisées-animales.',
    key_molecules: JSON.stringify(['Agarospirol', 'Jinkohol', 'Guaiol', 'δ-guaiène']),
    certifications: JSON.stringify(['CITES Appendix II', 'Certification durable disponible']),
    notes: 'Inoculation artificielle des arbres. Qualité en amélioration constante. Source: Thaïlande, Vietnam, Laos, Bangladesh.'
  },

  // ============================================================================
  // NARD (Nardostachys jatamansi) - CR (En danger critique)
  // ============================================================================
  {
    threatened_plant_name: 'Nard (Spikenard)',
    alternative_name: 'Valériane (Valeriana officinalis)',
    alternative_type: 'natural_plant',
    olfactive_similarity: 'similar',
    olfactive_notes: 'Notes terreuses-animales similaires au nard. Profil plus herbacé et moins boisé.',
    availability: 'widely_available',
    sustainability_score: 90,
    price_comparison: 'much_cheaper',
    usage_recommendations: 'Parfumerie naturelle, aromathérapie, accords terreux-animaux.',
    key_molecules: JSON.stringify(['Acide valérénique', 'Bornéol', 'Camphène', 'Isovalérate de bornyle']),
    certifications: JSON.stringify(['Bio disponible']),
    notes: 'Bonne alternative pour les notes terreuses. Largement cultivée. Source: Europe, Asie.'
  },
  {
    threatened_plant_name: 'Nard (Spikenard)',
    alternative_name: 'Nard cultivé (Népal)',
    alternative_type: 'cultivated',
    olfactive_similarity: 'identical',
    olfactive_notes: 'Profil identique au nard sauvage, issu de programmes de culture durable.',
    availability: 'limited',
    sustainability_score: 80,
    price_comparison: 'more_expensive',
    usage_recommendations: 'Parfumerie de luxe, formulations traditionnelles, encens.',
    key_molecules: JSON.stringify(['Jatamansone', 'Nardol', 'Calarène', 'Aristolène']),
    certifications: JSON.stringify(['Fair Trade', 'Programmes communautaires']),
    notes: 'Programmes de culture en développement. Soutient les communautés locales. Source: Népal, Inde (Himalaya).'
  },

  // ============================================================================
  // ENCENS D'OMAN (Boswellia sacra) - VU (Vulnérable)
  // ============================================================================
  {
    threatened_plant_name: "Encens d'Oman",
    alternative_name: 'Encens d\'Éthiopie (Boswellia papyrifera)',
    alternative_type: 'natural_plant',
    olfactive_similarity: 'similar',
    olfactive_notes: 'Notes résineuses-citronnées similaires. Profil légèrement plus frais et moins balsamique.',
    availability: 'available',
    sustainability_score: 70,
    price_comparison: 'cheaper',
    usage_recommendations: 'Encens, parfumerie orientale, cosmétiques.',
    key_molecules: JSON.stringify(['Acide boswellique', 'Incensole', 'Limonène', 'α-pinène']),
    certifications: JSON.stringify(['Programmes de gestion durable en développement']),
    notes: 'Attention: également sous pression. Préférer les sources certifiées. Source: Éthiopie, Érythrée, Soudan.'
  },
  {
    threatened_plant_name: "Encens d'Oman",
    alternative_name: 'Encens de Somalie (Boswellia carterii)',
    alternative_type: 'natural_plant',
    olfactive_similarity: 'very_similar',
    olfactive_notes: 'Profil très proche de l\'encens d\'Oman. Notes résineuses-balsamiques avec une touche citronnée.',
    availability: 'available',
    sustainability_score: 65,
    price_comparison: 'similar',
    usage_recommendations: 'Parfumerie fine, encens liturgique, cosmétiques premium.',
    key_molecules: JSON.stringify(['Acide boswellique', 'Incensole', 'α-thujène', 'p-cymène']),
    certifications: JSON.stringify(['Variable selon fournisseur']),
    notes: 'Qualité variable. Privilégier les fournisseurs avec traçabilité. Source: Somalie, Yémen.'
  },
  {
    threatened_plant_name: "Encens d'Oman",
    alternative_name: 'Encens cultivé (Oman, Inde)',
    alternative_type: 'cultivated',
    olfactive_similarity: 'identical',
    olfactive_notes: 'Profil identique, issu de plantations durables.',
    availability: 'limited',
    sustainability_score: 90,
    price_comparison: 'more_expensive',
    usage_recommendations: 'Parfumerie de luxe, encens premium, formulations haut de gamme.',
    key_molecules: JSON.stringify(['Acide boswellique', 'Incensole', 'Acétate d\'incensyle']),
    certifications: JSON.stringify(['Programmes gouvernementaux de culture']),
    notes: 'Programmes de replantation en cours. Production croissante. Source: Oman (Dhofar), Inde.'
  },

  // ============================================================================
  // MYRRHE (Commiphora myrrha) - NT (Quasi menacé)
  // ============================================================================
  {
    threatened_plant_name: 'Myrrhe',
    alternative_name: 'Opoponax (Commiphora guidottii)',
    alternative_type: 'natural_plant',
    olfactive_similarity: 'similar',
    olfactive_notes: 'Notes résineuses-balsamiques similaires à la myrrhe mais plus douces et sucrées.',
    availability: 'available',
    sustainability_score: 75,
    price_comparison: 'similar',
    usage_recommendations: 'Parfumerie orientale, encens, cosmétiques.',
    key_molecules: JSON.stringify(['Bisabolène', 'cis-α-bergamotène', 'Furanoeudesma-1,3-diène']),
    certifications: JSON.stringify(['Variable']),
    notes: 'Bonne alternative naturelle. Profil plus doux que la myrrhe. Source: Somalie, Éthiopie.'
  },
  {
    threatened_plant_name: 'Myrrhe',
    alternative_name: 'Myrrhe cultivée (Somalie, Yémen)',
    alternative_type: 'cultivated',
    olfactive_similarity: 'identical',
    olfactive_notes: 'Profil identique à la myrrhe sauvage.',
    availability: 'limited',
    sustainability_score: 85,
    price_comparison: 'more_expensive',
    usage_recommendations: 'Parfumerie de luxe, encens traditionnel, cosmétiques premium.',
    key_molecules: JSON.stringify(['Furanoeudesma-1,3-diène', 'Curzerène', 'Lindestrène']),
    certifications: JSON.stringify(['Programmes communautaires']),
    notes: 'Programmes de culture en développement. Soutient les communautés locales. Source: Somalie, Yémen, Éthiopie.'
  },

  // ============================================================================
  // COMMIPHORA (diverses espèces) - CR (En danger critique)
  // ============================================================================
  {
    threatened_plant_name: 'Commiphora',
    alternative_name: 'Élémi (Canarium luzonicum)',
    alternative_type: 'natural_plant',
    olfactive_similarity: 'partial',
    olfactive_notes: 'Notes résineuses-citronnées. Profil plus frais et moins balsamique que les Commiphora.',
    availability: 'available',
    sustainability_score: 80,
    price_comparison: 'cheaper',
    usage_recommendations: 'Parfumerie, cosmétiques, notes de tête résineuses.',
    key_molecules: JSON.stringify(['Limonène', 'α-phellandrène', 'Élémol', 'Élémicine']),
    certifications: JSON.stringify(['Gestion forestière durable']),
    notes: 'Bonne alternative pour les notes résineuses fraîches. Source: Philippines.'
  },

  // ============================================================================
  // STYRAX LIQUIDE (Liquidambar orientalis) - VU (Vulnérable)
  // ============================================================================
  {
    threatened_plant_name: 'Styrax liquide',
    alternative_name: 'Styrax américain (Liquidambar styraciflua)',
    alternative_type: 'natural_plant',
    olfactive_similarity: 'very_similar',
    olfactive_notes: 'Profil très similaire au styrax oriental. Notes balsamiques-vanillées avec une touche de cannelle.',
    availability: 'available',
    sustainability_score: 85,
    price_comparison: 'cheaper',
    usage_recommendations: 'Parfumerie orientale, fixateur, cosmétiques.',
    key_molecules: JSON.stringify(['Styrène', 'Cinnamate de benzyle', 'Acide cinnamique', 'Vanilline']),
    certifications: JSON.stringify(['FSC disponible']),
    notes: 'Excellente alternative. Production durable établie. Source: États-Unis, Honduras, Guatemala.'
  },
  {
    threatened_plant_name: 'Styrax liquide',
    alternative_name: 'Benjoin de Sumatra (Styrax benzoin)',
    alternative_type: 'natural_plant',
    olfactive_similarity: 'similar',
    olfactive_notes: 'Notes balsamiques-vanillées similaires. Profil plus doux et moins épicé.',
    availability: 'available',
    sustainability_score: 75,
    price_comparison: 'similar',
    usage_recommendations: 'Parfumerie, encens, fixateur naturel.',
    key_molecules: JSON.stringify(['Acide benzoïque', 'Vanilline', 'Acide cinnamique', 'Styrène']),
    certifications: JSON.stringify(['Variable']),
    notes: 'Alternative traditionnelle. Attention à la durabilité de la source. Source: Indonésie (Sumatra).'
  },

  // ============================================================================
  // BENJOIN (Styrax spp.) - VU (Vulnérable)
  // ============================================================================
  {
    threatened_plant_name: 'Benjoin',
    alternative_name: 'Benjoin de Siam cultivé',
    alternative_type: 'cultivated',
    olfactive_similarity: 'identical',
    olfactive_notes: 'Profil identique au benjoin sauvage. Notes vanillées-balsamiques caractéristiques.',
    availability: 'available',
    sustainability_score: 85,
    price_comparison: 'similar',
    usage_recommendations: 'Parfumerie orientale, encens, cosmétiques, fixateur.',
    key_molecules: JSON.stringify(['Acide benzoïque', 'Coniféryl benzoate', 'Vanilline']),
    certifications: JSON.stringify(['Programmes de culture durable']),
    notes: 'Plantations établies. Bonne alternative durable. Source: Thaïlande, Laos, Vietnam.'
  },
  {
    threatened_plant_name: 'Benjoin',
    alternative_name: 'Tolu baume (Myroxylon balsamum)',
    alternative_type: 'natural_plant',
    olfactive_similarity: 'similar',
    olfactive_notes: 'Notes balsamiques-vanillées similaires avec une touche de cannelle.',
    availability: 'available',
    sustainability_score: 80,
    price_comparison: 'similar',
    usage_recommendations: 'Parfumerie, cosmétiques, fixateur naturel.',
    key_molecules: JSON.stringify(['Cinnamate de benzyle', 'Acide benzoïque', 'Vanilline', 'Eugénol']),
    certifications: JSON.stringify(['Variable']),
    notes: 'Bonne alternative naturelle. Profil légèrement différent mais compatible. Source: Colombie, Venezuela, Pérou.'
  },
  {
    threatened_plant_name: 'Benjoin',
    alternative_name: 'Vanilline et acide benzoïque (synthèse)',
    alternative_type: 'synthetic',
    olfactive_similarity: 'partial',
    olfactive_notes: 'Reconstitution partielle du profil du benjoin. Notes vanillées-balsamiques.',
    availability: 'widely_available',
    sustainability_score: 85,
    price_comparison: 'much_cheaper',
    usage_recommendations: 'Parfumerie fonctionnelle, cosmétiques grand public.',
    key_molecules: JSON.stringify(['Vanilline', 'Acide benzoïque', 'Benzoate de benzyle']),
    certifications: JSON.stringify(['IFRA compliant']),
    notes: 'Solution économique pour les grandes productions. Production mondiale.'
  },

  // ============================================================================
  // SANDALWOOD AUSTRALIEN (déjà VU mais avec alternatives)
  // ============================================================================
  {
    threatened_plant_name: 'Sandalwood australien',
    alternative_name: 'Santal cultivé (Australie - Queensland)',
    alternative_type: 'cultivated',
    olfactive_similarity: 'identical',
    olfactive_notes: 'Profil identique au santal australien sauvage, issu de plantations durables.',
    availability: 'available',
    sustainability_score: 90,
    price_comparison: 'similar',
    usage_recommendations: 'Parfumerie fine, cosmétiques, substitut durable.',
    key_molecules: JSON.stringify(['α-santalol', 'β-santalol', 'Farnesol']),
    certifications: JSON.stringify(['Certification durable australienne', 'FSC']),
    notes: 'Plantations établies en Australie occidentale et Queensland. Production croissante.'
  }
];

// Fonction pour trouver l'ID de la plante menacée
function findThreatenedPlantId(name) {
  const plant = threatenedPlants.find(p => 
    p.name.toLowerCase().includes(name.toLowerCase()) ||
    name.toLowerCase().includes(p.name.toLowerCase())
  );
  return plant ? plant.id : null;
}

// Insérer les alternatives
console.log('\nInsertion des alternatives durables...');
let inserted = 0;
let skipped = 0;

for (const alt of alternatives) {
  const plantId = findThreatenedPlantId(alt.threatened_plant_name);
  
  if (!plantId) {
    console.log(`⚠️ Plante non trouvée: ${alt.threatened_plant_name}`);
    skipped++;
    continue;
  }

  try {
    await conn.query(`
      INSERT INTO sustainable_alternatives (
        threatened_plant_id,
        threatened_plant_name,
        alternative_name,
        alternative_type,
        olfactive_similarity,
        olfactive_notes,
        availability,
        sustainability_score,
        price_comparison,
        usage_recommendations,
        key_molecules,
        certifications,
        notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      plantId,
      alt.threatened_plant_name,
      alt.alternative_name,
      alt.alternative_type,
      alt.olfactive_similarity,
      alt.olfactive_notes,
      alt.availability,
      alt.sustainability_score,
      alt.price_comparison,
      alt.usage_recommendations,
      alt.key_molecules,
      alt.certifications,
      alt.notes
    ]);
    
    console.log(`✅ ${alt.threatened_plant_name} → ${alt.alternative_name}`);
    inserted++;
  } catch (err) {
    console.error(`❌ Erreur pour ${alt.alternative_name}:`, err.message);
    skipped++;
  }
}

console.log(`\n=== Résumé ===`);
console.log(`Alternatives insérées: ${inserted}`);
console.log(`Alternatives ignorées: ${skipped}`);

// Vérifier le résultat
const [count] = await conn.query(`SELECT COUNT(*) as total FROM sustainable_alternatives`);
console.log(`Total dans la table: ${count[0].total}`);

// Afficher un aperçu
const [preview] = await conn.query(`
  SELECT threatened_plant_name, alternative_name, alternative_type, olfactive_similarity 
  FROM sustainable_alternatives 
  LIMIT 10
`);
console.log('\nAperçu des données:');
preview.forEach(p => console.log(`  - ${p.threatened_plant_name} → ${p.alternative_name} (${p.olfactive_similarity})`));

await conn.end();
console.log('\n✅ Import terminé!');
