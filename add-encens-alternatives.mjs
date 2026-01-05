import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Trouver l'ID de l'Encens d'Oman
const [plants] = await conn.query(`SELECT id, name FROM plants WHERE name LIKE '%Encens%' OR name LIKE '%encens%'`);
console.log('Plantes Encens trouvées:', plants);

const encensId = plants[0]?.id;
if (!encensId) {
  console.log('Encens d\'Oman non trouvé');
  await conn.end();
  process.exit(1);
}

const alternatives = [
  {
    threatened_plant_id: encensId,
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
    threatened_plant_id: encensId,
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
    threatened_plant_id: encensId,
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
  }
];

for (const alt of alternatives) {
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
      alt.threatened_plant_id,
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
    console.log(`✅ ${alt.alternative_name}`);
  } catch (err) {
    console.error(`❌ ${alt.alternative_name}:`, err.message);
  }
}

const [count] = await conn.query(`SELECT COUNT(*) as total FROM sustainable_alternatives`);
console.log(`\nTotal dans la table: ${count[0].total}`);

await conn.end();
