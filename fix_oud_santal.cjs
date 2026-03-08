#!/usr/bin/env node
/**
 * Correction des plantes Oud et Santal — enrichissement botanique
 * Colonnes JSON: botanical_states, morphology, growth_conditions, certifications, threat_factors, therapeutic_properties, ethnobotanical_uses, synonyms
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_URL = process.env.DATABASE_URL;

async function main() {
  const url = new URL(DB_URL);
  const conn = await mysql.createConnection({
    host: url.hostname, port: parseInt(url.port)||3306,
    user: url.username, password: url.password,
    database: url.pathname.slice(1), ssl: {rejectUnauthorized: false}
  });

  // Oud
  const [oudRows] = await conn.execute("SELECT id, name FROM plants WHERE name LIKE '%Oud%' LIMIT 1");
  if (oudRows.length > 0) {
    await conn.execute(`UPDATE plants SET
      kingdom='Plantae', division='Magnoliophyta', class='Magnoliopsida',
      order_name='Malvales', family='Thymelaeaceae', genus='Aquilaria', species='malaccensis',
      life_cycle='perennial',
      origin='Asie du Sud-Est (Inde, Bangladesh, Malaisie, Indonésie, Vietnam)',
      habitat='Forêts tropicales humides, altitude 0-1000m',
      harvest_period='Bois infecté par champignon Phialophora parasitica',
      essential_oil_yield='0.1-0.5%',
      koppen_zone='Af', koppen_description='Tropical humide équatorial',
      precipitation_min=1500, precipitation_max=4000, temperature_min=20, temperature_max=35,
      conservation_status='CR', cites_appendix='II', historical_status='endangered',
      conservation_notes='Aquilaria malaccensis est classée EN DANGER CRITIQUE (CR). Listée CITES Annexe II depuis 2004. La surexploitation pour la production d oud a drastiquement réduit les populations sauvages.',
      threat_factors=?,
      sustainable_alternatives='Oud de culture (plantation), oud de synthèse, reconstitutions moléculaires.',
      traditional_use='Encens religieux (Islam, Bouddhisme, Hindouisme), parfumerie de luxe, médecine traditionnelle',
      ethnobotanical_uses=?,
      historical_significance='Une des substances parfumées les plus précieuses de l histoire humaine. Prix jusqu à 100 000 USD/kg pour les grades supérieurs.',
      therapeutic_properties=?,
      updated_at=NOW()
      WHERE id=?`,
      [
        JSON.stringify(['Surexploitation commerciale', 'déforestation', 'braconnage', 'demande mondiale en forte hausse']),
        JSON.stringify(['Mentionné dans les textes sacrés islamiques (hadith). Utilisé dans les rituels funéraires et les cérémonies religieuses depuis plus de 3000 ans.']),
        JSON.stringify(['antibactérien', 'anti-inflammatoire', 'anxiolytique', 'sédatif']),
        oudRows[0].id
      ]
    );
    console.log('✓ Oud enrichi:', oudRows[0].name);
  } else {
    console.log('✗ Oud non trouvé');
  }

  // Santal
  const [santalRows] = await conn.execute("SELECT id, name FROM plants WHERE name LIKE '%Santal%' LIMIT 1");
  if (santalRows.length > 0) {
    await conn.execute(`UPDATE plants SET
      kingdom='Plantae', division='Magnoliophyta', class='Magnoliopsida',
      order_name='Santalales', family='Santalaceae', genus='Santalum', species='album',
      life_cycle='perennial',
      origin='Inde (Karnataka, Tamil Nadu, Mysore) — Australie (plantations)',
      habitat='Forêts sèches tropicales, sols bien drainés, altitude 600-1000m',
      harvest_period='Bois de coeur (arbre de 30-60 ans)',
      essential_oil_yield='3-6%',
      koppen_zone='Aw', koppen_description='Tropical savane, saison sèche marquée',
      precipitation_min=500, precipitation_max=1200, temperature_min=12, temperature_max=38,
      conservation_status='VU', cites_appendix='II', historical_status='endangered',
      conservation_notes='Santalum album est classé VULNÉRABLE (VU) sur la Liste Rouge UICN. Listé CITES Annexe II.',
      threat_factors=?,
      sustainable_alternatives='Santal australien (Santalum spicatum), santal de Nouvelle-Calédonie, Amyris balsamifera.',
      traditional_use='Rituels hindous et bouddhistes, médecine ayurvédique, parfumerie, sculpture',
      ethnobotanical_uses=?,
      historical_significance='Une des matières premières les plus précieuses de la parfumerie. Présent dans Samsara (Guerlain), Santal 33 (Le Labo).',
      therapeutic_properties=?,
      updated_at=NOW()
      WHERE id=?`,
      [
        JSON.stringify(['Surexploitation pour la parfumerie et les rituels religieux', 'déforestation', 'braconnage']),
        JSON.stringify(['Utilisé depuis 4000 ans dans les rituels hindous et bouddhistes. Le bois est brûlé comme encens et utilisé pour sculpter des idoles religieuses.']),
        JSON.stringify(['antiseptique', 'anti-inflammatoire', 'sédatif', 'astringent']),
        santalRows[0].id
      ]
    );
    console.log('✓ Santal enrichi:', santalRows[0].name);
  } else {
    console.log('✗ Santal non trouvé');
  }

  await conn.end();
}

main().catch(console.error);
