#!/usr/bin/env node
/**
 * Import ABSORBE Civilisations (28 traditions olfactives) — valeurs enum corrigées
 * + ABSORBE Familles (3 familles)
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_URL = process.env.DATABASE_URL;

async function getConn() {
  const url = new URL(DB_URL);
  return mysql.createConnection({
    host: url.hostname, port: parseInt(url.port)||3306,
    user: url.username, password: url.password,
    database: url.pathname.slice(1), ssl: {rejectUnauthorized: false}
  });
}

async function main() {
  const conn = await getConn();
  let created = 0, skipped = 0, errors = 0;

  // ===== ABSORBE Civilisations — 28 traditions olfactives =====
  console.log('=== ABSORBE Civilisations (28 traditions olfactives) ===');
  
  // Mapping temporalité Notion → enum DB (archaic/antique/medieval/abyssal/futuristic)
  const traditions = [
    { name: 'Égypte / Nil', region: 'Afrique du Nord', description: 'Kyphi, résines claires. Tradition solaire sèche, pierre claire, axe kyphi/encens, minéralité lumineuse.', temporality: 'antique', materiaux: ['Résine', 'Pierre', 'Vent'] },
    { name: 'Nubie / Sahel', region: 'Afrique subsaharienne', description: 'Terre rouge, ambre sec. Tradition des caravanes sahéliennes et du commerce des aromates.', temporality: 'antique', materiaux: ['Pierre', 'Vent'] },
    { name: 'Mésopotamie / Tigre-Euphrate', region: 'Moyen-Orient', description: 'Argile, bitume. La plus ancienne tradition parfumée documentée. Tablettes cunéiformes sumériennes.', temporality: 'archaic', materiaux: ['Argile', 'Bitume', 'Eau'] },
    { name: 'Levant / Canaanéen', region: 'Moyen-Orient', description: 'Encens, bois secs. Commerce des épices et résines entre Égypte et Mésopotamie.', temporality: 'antique', materiaux: ['Résine', 'Feuille'] },
    { name: 'Anatolie / Tell', region: 'Turquie', description: 'Terre sombre, fumées. Tradition hittite et anatolienne, rituels de purification.', temporality: 'antique', materiaux: ['Pierre', 'Résine'] },
    { name: 'Perse / Achéménide', region: 'Iran', description: 'Résines dorées, épices sèches. Empire perse et routes de la soie, attars persans.', temporality: 'antique', materiaux: ['Résine', 'Métal'] },
    { name: 'Grèce mycénienne / Égéen', region: 'Grèce', description: 'Pierre chaude, figue, cendre claire. Civilisation minoenne et mycénienne, fresques de Théra.', temporality: 'antique', materiaux: ['Pierre', 'Résine'] },
    { name: 'Méditerranée résineuse', region: 'Méditerranée', description: 'Mastic, pin, chaleur sèche. Tradition méditerranéenne des résines végétales.', temporality: 'antique', materiaux: ['Résine', 'Pierre'] },
    { name: 'Rome / Thermes', region: 'Europe méridionale', description: 'Poudres, huiles, fumées douces. Tradition thermale et cosmétique romaine.', temporality: 'antique', materiaux: ['Eau', 'Résine'] },
    { name: 'Byzance / Encens liturgique', region: 'Europe orientale', description: 'Oliban, myrrhe, cire. Tradition liturgique byzantine, encens de l\'Église orthodoxe.', temporality: 'medieval', materiaux: ['Résine', 'Feuille'] },
    { name: 'Arabique / Attars', region: 'Péninsule arabique', description: 'Roses, bois, huiles. Tradition des attars et de la parfumerie arabe classique.', temporality: 'medieval', materiaux: ['Résine', 'Feuille'] },
    { name: 'Inde / Temple', region: 'Asie du Sud', description: 'Santal, résines, fumées. Tradition des temples hindous et bouddhistes, agarbatti.', temporality: 'antique', materiaux: ['Résine', 'Feuille'] },
    { name: 'Himalaya / Monastique', region: 'Himalaya', description: 'Genévrier, fumées froides. Tradition monastique tibétaine, encens de haute altitude.', temporality: 'medieval', materiaux: ['Résine', 'Vent'] },
    { name: 'Chine / Encens lettré', region: 'Asie orientale', description: 'Bois, papiers, fumées fines. Tradition lettrée chinoise du xiāng, calligraphie et encens.', temporality: 'medieval', materiaux: ['Résine', 'Feuille'] },
    { name: 'Japon / Kōdō', region: 'Asie orientale', description: 'Bois précieux, discipline sèche. L\'art du kōdō et la classification des 6 parfums japonais.', temporality: 'medieval', materiaux: ['Résine', 'Feuille'] },
    { name: 'Asie du Sud-Est / Tropical sacré', region: 'Asie du Sud-Est', description: 'Bois humides, fleurs solaires. Tradition des temples d\'Angkor et de Java, ylang-ylang.', temporality: 'medieval', materiaux: ['Résine', 'Eau', 'Feuille'] },
    { name: 'Océanique / Monoï-Tiaré', region: 'Pacifique', description: 'Lactones, solaire, peau. Tradition polynésienne du monoï, tiaré et fleurs tropicales.', temporality: 'antique', materiaux: ['Eau', 'Feuille'] },
    { name: 'Celtique / Brumes', region: 'Europe occidentale', description: 'Mousses, pierre humide, aldéhydes. Tradition druidique et celtique, forêts brumeuses.', temporality: 'antique', materiaux: ['Pierre', 'Eau', 'Feuille'] },
    { name: 'Nordique / Boréal', region: 'Europe du Nord', description: 'Résines froides, fumées sèches. Tradition scandinave et finnoise, sauna et résines boréales.', temporality: 'medieval', materiaux: ['Résine', 'Vent'] },
    { name: 'Steppe / Routes', region: 'Eurasie centrale', description: 'Poussière, cuir, herbes sèches. Tradition nomade des steppes eurasiatiques, routes de la soie.', temporality: 'medieval', materiaux: ['Pierre', 'Vent', 'Feuille'] },
    { name: 'Désert / Ocre', region: 'Afrique / Arabie', description: 'Poussière chaude, ambre sec. Tradition des déserts d\'Arabie et d\'Afrique, caravanes.', temporality: 'antique', materiaux: ['Pierre', 'Vent'] },
    { name: 'Atlantique / Submergé', region: 'Atlantique', description: 'Sel minéral, algues, ambrox. Tradition maritime atlantique, ambre gris et épaves.', temporality: 'abyssal', materiaux: ['Eau', 'Pierre'] },
    { name: 'Abyssal / Hadal', region: 'Océans profonds', description: 'Eau noire, minéral sombre. Profondeurs abyssales, zones hadales, chimiosynthèse.', temporality: 'abyssal', materiaux: ['Eau', 'Pierre'] },
    { name: 'Volcanique / Basalte', region: 'Zones volcaniques', description: 'Soufre, cendre, pierre poreuse. Tradition des zones volcaniques, fumée minérale.', temporality: 'archaic', materiaux: ['Pierre', 'Vent'] },
    { name: 'Glaciaire / Cryo', region: 'Zones polaires', description: 'Ozone, aldéhydes froids, calcite. Tradition des zones glaciaires, glace et silence.', temporality: 'archaic', materiaux: ['Eau', 'Pierre', 'Vent'] },
    { name: 'Urbain / Industriel', region: 'Global', description: 'Béton, métal, ozone. Tradition olfactive urbaine contemporaine, parfumerie de la ville.', temporality: 'futuristic', materiaux: ['Métal', 'Pierre'] },
    { name: 'Archive / Bibliothèque', region: 'Global', description: 'Papier, poussière, ionones. Tradition des archives et bibliothèques, mémoire olfactive.', temporality: 'medieval', materiaux: ['Feuille', 'Pierre'] },
    { name: 'Sépulcral / Ossuaire', region: 'Global', description: 'Os, kaolin, fumées profondes. Tradition funéraire et ossuaire, rites de passage.', temporality: 'archaic', materiaux: ['Pierre', 'Résine'] },
  ];

  for (const trad of traditions) {
    try {
      const [existing] = await conn.execute('SELECT id FROM traditions_olfactives WHERE name = ? LIMIT 1', [trad.name]);
      if (existing.length > 0) { skipped++; continue; }
      
      await conn.execute(
        `INSERT INTO traditions_olfactives (name, region, longDescription, temporality, symbolicMaterials, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [trad.name, trad.region, trad.description, trad.temporality, JSON.stringify(trad.materiaux)]
      );
      created++;
      console.log(`  + Tradition: ${trad.name}`);
    } catch(e) {
      errors++;
      console.error(`  ✗ ${trad.name}: ${e.message.substring(0, 80)}`);
    }
  }

  // ===== ABSORBE Familles (3 familles) =====
  console.log('\n=== ABSORBE Familles ===');
  
  // Vérifier les valeurs enum de type dans families
  const [famRows] = await conn.execute('DESCRIBE families');
  const typeCol = famRows.find(r => r.Field === 'type');
  console.log('families.type enum:', typeCol.Type);

  const familles = [
    { name: 'Volcanique — Basalte froid', type: 'petrichor', description: 'Minéral noir, vapeur froide, ozone, calcite/roche froide. Axe basalte froid.' },
    { name: 'SOLAR-MINERALIS', type: 'perfumeum12', description: 'Soleil / peau / pierre chaude / vent sec. Famille expérimentale pilotée par salicylates + lactones + minéral.' },
    { name: 'Pétrichor sombre', type: 'petrichor', description: 'Terre noire saturée, humidité, profondeur. Base géosmine/2-MIB + sols humiques.' },
  ];

  for (const fam of familles) {
    try {
      const [existing] = await conn.execute('SELECT id FROM families WHERE name = ? LIMIT 1', [fam.name]);
      if (existing.length > 0) { skipped++; continue; }
      
      await conn.execute(
        `INSERT INTO families (name, type, description, variationCount, createdAt, updatedAt)
         VALUES (?, ?, ?, 0, NOW(), NOW())`,
        [fam.name, fam.type, fam.description]
      );
      created++;
      console.log(`  + Famille: ${fam.name}`);
    } catch(e) {
      errors++; 
      console.error(`  ✗ ${fam.name}: ${e.message.substring(0, 80)}`);
    }
  }

  // ===== Résumé =====
  const [[totalTrad]] = await conn.execute('SELECT COUNT(*) as n FROM traditions_olfactives');
  const [[totalFam]] = await conn.execute('SELECT COUNT(*) as n FROM families');
  console.log('\n=== Résumé Final ===');
  console.log(`Créées: ${created} | Existantes: ${skipped} | Erreurs: ${errors}`);
  console.log(`Total traditions_olfactives: ${totalTrad.n} | Total families: ${totalFam.n}`);
  
  await conn.end();
}

main().catch(console.error);
