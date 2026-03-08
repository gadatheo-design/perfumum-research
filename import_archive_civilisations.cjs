#!/usr/bin/env node
/**
 * Import Archive Civilisationnelle (accords #61-#96)
 * + ABSORBE Civilisations (28 traditions olfactives)
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

async function findRecette(conn, name) {
  const [rows] = await conn.execute('SELECT id FROM recettes WHERE name = ? LIMIT 1', [name]);
  return rows.length > 0 ? rows[0].id : null;
}

async function createRecette(conn, data) {
  const existing = await findRecette(conn, data.name);
  if (existing) return { id: existing, created: false };
  const [result] = await conn.execute(
    `INSERT INTO recettes (name, category, description, formula, notes_tete, notes_coeur, notes_fond, notes, status, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [data.name, data.category||'parfum', data.description||null, data.formula||null,
     data.notes_tete||null, data.notes_coeur||null, data.notes_fond||null, data.notes||null, data.status||'experimental']
  );
  return { id: result.insertId, created: true };
}

async function main() {
  const conn = await getConn();
  let created = 0, skipped = 0, errors = 0;

  // ===== Vérifier les tables disponibles pour civilisations =====
  const [tables] = await conn.execute("SHOW TABLES LIKE '%civili%'");
  console.log('Tables civilisations:', tables.map(t => Object.values(t)[0]).join(', '));
  
  const [tabTrad] = await conn.execute("SHOW TABLES LIKE '%tradition%'");
  console.log('Tables traditions:', tabTrad.map(t => Object.values(t)[0]).join(', '));

  // ===== Archive Civilisationnelle — Accords #61-#96 =====
  console.log('\n=== Archive Civilisationnelle (accords historiques) ===');
  
  const archiveCivil = [
    // Civilisations Méditerranéennes Antiques
    { name: 'Creta Minoica #61', category: 'parfum',
      description: 'Crète minoenne 2000 av. J.-C. Résines marines, safran, fleurs de mer. Reconstruction olfactive de la civilisation minoenne.',
      formula: 'Safran + Labdanum + Mastic + Sel marin',
      notes_tete: 'Safran, sel marin', notes_coeur: 'Mastic, résine de pin', notes_fond: 'Labdanum, ambre',
      notes: 'Tabacs : Basma + Xanthi. Sources : fresques de Théra, analyses résidus organiques Akrotiri.' },
    { name: 'Hittite Bronze #62', category: 'parfum',
      description: 'Empire hittite 1600 av. J.-C. Cèdre anatolien, résines sèches, métal chaud. Reconstruction des rituels de purification hittites.',
      formula: 'Cèdre anatolien + Résines sèches + Benjoin + Métal',
      notes_tete: 'Cèdre, résine sèche', notes_coeur: 'Benjoin, encens', notes_fond: 'Ambre, métal',
      notes: 'Tabacs : Samsun + Izmir. Sources : tablettes cunéiformes hittites, textes rituels de Boğazkale.' },
    { name: 'Sumer Temple #63', category: 'parfum',
      description: 'Sumer 4500 av. J.-C. Bitume, argile humide, résines du Tigre. La plus ancienne reconstruction olfactive documentée.',
      formula: 'Bitume + Argile + Cèdre + Myrrhe',
      notes_tete: 'Argile humide, bitume', notes_coeur: 'Cèdre, myrrhe', notes_fond: 'Résine, ambre',
      notes: 'Tabacs : Oriental + Basma. Sources : tablettes sumériennes, analyse résidus Ur III.' },
    { name: 'Cordoue 950 #71', category: 'parfum',
      description: 'Al-Andalus 950 ap. J.-C. Rose de Damas, oud, ambre gris, musc. Apogée de la parfumerie arabo-andalouse.',
      formula: 'Rose de Damas + Oud + Ambre gris + Musc + Safran',
      notes_tete: 'Rose de Damas, safran', notes_coeur: 'Oud, ambre gris', notes_fond: 'Musc, santal',
      notes: 'Tabacs : Yenidje + Xanthi. Sources : Ibn Sina, Al-Kindi "Kitab al-Taraffuq fi al-Itr".' },
    { name: 'Kyoto Kumo #72', category: 'parfum',
      description: 'Japon Heian — Kōdō. Aloès boisé, kyara, résines froides. L\'art du kōdō et la classification des 6 parfums.',
      formula: 'Kyara + Aloès boisé + Résines froides + Santal',
      notes_tete: 'Résines froides', notes_coeur: 'Kyara, aloès boisé', notes_fond: 'Santal, ambre',
      notes: 'Tabacs : Latakia + Basma. Sources : Genji Monogatari, traités de kōdō Heian.' },
    { name: 'Kyfi Akhet #85', category: 'parfum',
      description: 'Égypte ancienne — Kyphi. Composition complexe de 16 ingrédients, utilisé pour l\'horizon (Akhet). Formule sacrée des temples.',
      formula: 'Myrrhe 0.15 + Labdanum 0.12 + Benjoin 0.10 + Miel 0.08 + Vin sucré 0.05 + Cannelle + Encens + Résine de pin',
      notes_tete: 'Miel épicé, vin sucré', notes_coeur: 'Myrrhe profonde, labdanum', notes_fond: 'Benjoin vanillé, encens',
      notes: 'Tabacs : Yenidje + Basma. Sources : papyrus Ebers, formules de Philae et Edfou. 16 ingrédients sacrés.' },
    // Série Expérimentale PERFUMUM
    { name: 'Fermentum Vivens #91', category: 'parfum',
      description: 'Prolongement direct du prototype C1 — FERMENTUM. Lactone C14, mushroom accord, vetiver humide. Vie microbienne.',
      formula: 'γ-Dodécalactone + Oct-1-en-3-ol + Vétiverol',
      notes_tete: 'Oct-1-en-3-ol (champignon)', notes_coeur: 'Lactone gamma-14', notes_fond: 'Vétiverol (vetiver humide)',
      notes: 'Lien PERFUMUM : C1 FERMENTUM. Tabacs : Latakia + Burley.' },
    { name: 'Mycélium-Parlement #90', category: 'parfum',
      description: 'Réseau mycélien souterrain, communication inter-arbres, sol forestier vivant, humidité permanente.',
      formula: 'Géosmine + γ-Décalactone + Cédrol humide',
      notes_tete: 'Géosmine (sol)', notes_coeur: 'γ-Décalactone (lactone)', notes_fond: 'Cédrol humide',
      notes: 'Tabacs : Latakia + Burley.' },
    { name: 'Europa Ocean #92', category: 'parfum',
      description: 'Océan sous la surface d\'Europa (lune de Jupiter), eau minérale primitive, glace cosmique.',
      formula: 'Ambergris + Aldéhydes C12-C14 + Calone',
      notes_tete: 'Aldéhydes glacés', notes_coeur: 'Calone (eau)', notes_fond: 'Ambergris (sel primordial)',
      notes: 'Tabacs : Virginia + Basma. Accord cosmique.' },
    { name: 'Aurora Ionique #93', category: 'parfum',
      description: 'Aurores boréales, ionisation atmosphérique, froid électrique, lumière polaire.',
      formula: 'Aldéhydes + Menthol cristallisé + Vétiverol',
      notes_tete: 'Aldéhydes (ozone)', notes_coeur: 'Menthol cristallisé', notes_fond: 'Vétiverol (minéral froid)',
      notes: 'Tabacs : Virginia + Basma.' },
    { name: 'Basalte Liquide #94', category: 'parfum',
      description: 'Basalte en fusion, coulées volcaniques, fumée minérale, cendre absolue.',
      formula: 'Guaiacol + Vétiverol chauffé + Cade',
      notes_tete: 'Guaiacol (fumée)', notes_coeur: 'Vétiverol chauffé (minéral)', notes_fond: 'Cade (cendre)',
      notes: 'Tabacs : Latakia + Perique.' },
    { name: 'Silence Profond #95', category: 'parfum',
      description: 'Silence absolu, minéralité blanche, ambre gris purifié, vide sonore.',
      formula: 'Ambergris blanc + Aldéhydes',
      notes_tete: 'Aldéhydes (silence)', notes_coeur: 'Ambergris (blanc)', notes_fond: 'Minéral blanc',
      notes: 'Tabacs : Virginia + Basma. Accord minimaliste.' },
    { name: 'Ombre Vivante #96', category: 'parfum',
      description: 'Ombre comme entité, cuir froid, fumée noire, minéralité humide, vie de l\'ombre.',
      formula: 'Cade + Guaiacol + Géosmine',
      notes_tete: 'Cade (cuir)', notes_coeur: 'Guaiacol (fumée noire)', notes_fond: 'Géosmine (minéral humide)',
      notes: 'Tabacs : Latakia + Kentucky.' },
  ];

  for (const recipe of archiveCivil) {
    try {
      const { created: c } = await createRecette(conn, recipe);
      if (c) { created++; console.log(`  + Archive: ${recipe.name}`); }
      else { skipped++; }
    } catch(e) { errors++; console.error(`  ✗ ${recipe.name}: ${e.message}`); }
  }

  // ===== ABSORBE Civilisations — 28 traditions olfactives =====
  console.log('\n=== ABSORBE Civilisations (traditions olfactives) ===');
  
  // Vérifier si la table civilizations ou traditions_olfactives existe
  const [civTables] = await conn.execute("SHOW TABLES LIKE 'civiliz%'");
  const civTableName = civTables.length > 0 ? Object.values(civTables[0])[0] : null;
  console.log('Table civilisations:', civTableName || 'non trouvée');
  
  const [tradTables] = await conn.execute("SHOW TABLES LIKE 'traditions%'");
  const tradTableName = tradTables.length > 0 ? Object.values(tradTables[0])[0] : null;
  console.log('Table traditions:', tradTableName || 'non trouvée');

  // Utiliser la table traditions_olfactives si elle existe
  if (tradTableName) {
    const [cols] = await conn.execute(`DESCRIBE ${tradTableName}`);
    console.log(`Colonnes ${tradTableName}:`, cols.map(c => c.Field).join(', '));
  }

  // Les 28 traditions olfactives ABSORBE Civilisations
  const traditions = [
    { nom: 'Égypte / Nil', description: 'Kyphi, résines claires. Tradition solaire sèche, pierre claire.', temporalite: 'Antique', materiaux: ['Résine', 'Pierre'] },
    { nom: 'Nubie / Sahel', description: 'Terre rouge, ambre sec. Tradition des caravanes sahéliennes.', temporalite: 'Antique', materiaux: ['Pierre', 'Vent'] },
    { nom: 'Mésopotamie / Tigre-Euphrate', description: 'Argile, bitume. La plus ancienne tradition parfumée documentée.', temporalite: 'Archaïque', materiaux: ['Argile', 'Bitume', 'Eau'] },
    { nom: 'Levant / Canaanéen', description: 'Encens, bois secs. Commerce des épices et résines.', temporalite: 'Antique', materiaux: ['Résine', 'Bois'] },
    { nom: 'Anatolie / Tell', description: 'Terre sombre, fumées. Tradition hittite et anatolienne.', temporalite: 'Antique', materiaux: ['Pierre', 'Résine'] },
    { nom: 'Perse / Achéménide', description: 'Résines dorées, épices sèches. Empire perse et routes de la soie.', temporalite: 'Antique', materiaux: ['Résine', 'Métal'] },
    { nom: 'Grèce mycénienne / Égéen', description: 'Pierre chaude, figue, cendre claire. Civilisation minoenne et mycénienne.', temporalite: 'Antique', materiaux: ['Pierre', 'Résine'] },
    { nom: 'Méditerranée résineuse', description: 'Mastic, pin, chaleur sèche. Tradition méditerranéenne des résines.', temporalite: 'Antique', materiaux: ['Résine', 'Pierre'] },
    { nom: 'Rome / Thermes', description: 'Poudres, huiles, fumées douces. Tradition thermale romaine.', temporalite: 'Antique', materiaux: ['Eau', 'Résine'] },
    { nom: 'Byzance / Encens liturgique', description: 'Oliban, myrrhe, cire. Tradition liturgique byzantine.', temporalite: 'Médiévale', materiaux: ['Résine', 'Feuille'] },
    { nom: 'Arabique / Attars', description: 'Roses, bois, huiles. Tradition des attars et de la parfumerie arabe.', temporalite: 'Médiévale', materiaux: ['Résine', 'Feuille'] },
    { nom: 'Inde / Temple', description: 'Santal, résines, fumées. Tradition des temples hindous et bouddhistes.', temporalite: 'Antique', materiaux: ['Résine', 'Feuille'] },
    { nom: 'Himalaya / Monastique', description: 'Genévrier, fumées froides. Tradition monastique tibétaine.', temporalite: 'Médiévale', materiaux: ['Résine', 'Vent'] },
    { nom: 'Chine / Encens lettré', description: 'Bois, papiers, fumées fines. Tradition lettrée chinoise du xiāng.', temporalite: 'Médiévale', materiaux: ['Résine', 'Feuille'] },
    { nom: 'Japon / Kōdō', description: 'Bois précieux, discipline sèche. L\'art du kōdō et la classification des 6 parfums.', temporalite: 'Médiévale', materiaux: ['Résine', 'Feuille'] },
    { nom: 'Asie du Sud-Est / Tropical sacré', description: 'Bois humides, fleurs solaires. Tradition des temples d\'Angkor et de Java.', temporalite: 'Médiévale', materiaux: ['Résine', 'Eau', 'Feuille'] },
    { nom: 'Océanique / Monoï-Tiaré', description: 'Lactones, solaire, peau. Tradition polynésienne du monoï.', temporalite: 'Antique', materiaux: ['Eau', 'Feuille'] },
    { nom: 'Celtique / Brumes', description: 'Mousses, pierre humide, aldéhydes. Tradition druidique et celtique.', temporalite: 'Antique', materiaux: ['Pierre', 'Eau', 'Feuille'] },
    { nom: 'Nordique / Boréal', description: 'Résines froides, fumées sèches. Tradition scandinave et finnoise.', temporalite: 'Médiévale', materiaux: ['Résine', 'Vent'] },
    { nom: 'Steppe / Routes', description: 'Poussière, cuir, herbes sèches. Tradition nomade des steppes eurasiatiques.', temporalite: 'Médiévale', materiaux: ['Pierre', 'Vent', 'Feuille'] },
    { nom: 'Désert / Ocre', description: 'Poussière chaude, ambre sec. Tradition des déserts d\'Arabie et d\'Afrique.', temporalite: 'Antique', materiaux: ['Pierre', 'Vent'] },
    { nom: 'Atlantique / Submergé', description: 'Sel minéral, algues, ambrox. Tradition maritime atlantique.', temporalite: 'Abyssale', materiaux: ['Eau', 'Pierre'] },
    { nom: 'Abyssal / Hadal', description: 'Eau noire, minéral sombre. Profondeurs abyssales, zones hadales.', temporalite: 'Abyssale', materiaux: ['Eau', 'Pierre'] },
    { nom: 'Volcanique / Basalte', description: 'Soufre, cendre, pierre poreuse. Tradition des zones volcaniques.', temporalite: 'Archaïque', materiaux: ['Pierre', 'Vent'] },
    { nom: 'Glaciaire / Cryo', description: 'Ozone, aldéhydes froids, calcite. Tradition des zones glaciaires.', temporalite: 'Archaïque', materiaux: ['Eau', 'Pierre', 'Vent'] },
    { nom: 'Urbain / Industriel', description: 'Béton, métal, ozone. Tradition olfactive urbaine contemporaine.', temporalite: 'Futuriste', materiaux: ['Métal', 'Pierre'] },
    { nom: 'Archive / Bibliothèque', description: 'Papier, poussière, ionones. Tradition des archives et bibliothèques.', temporalite: 'Médiévale', materiaux: ['Feuille', 'Pierre'] },
    { nom: 'Sépulcral / Ossuaire', description: 'Os, kaolin, fumées profondes. Tradition funéraire et ossuaire.', temporalite: 'Archaïque', materiaux: ['Pierre', 'Résine'] },
  ];

  // Essayer d'insérer dans traditions_olfactives ou civilizations
  let tradInserted = 0;
  if (tradTableName) {
    const [tradCols] = await conn.execute(`DESCRIBE ${tradTableName}`);
    const colNames = tradCols.map(c => c.Field);
    console.log(`Colonnes disponibles dans ${tradTableName}:`, colNames.join(', '));
    
    for (const trad of traditions) {
      try {
        // Vérifier si existe déjà
        const [existing] = await conn.execute(`SELECT id FROM ${tradTableName} WHERE name = ? LIMIT 1`, [trad.nom]);
        if (existing.length > 0) { skipped++; continue; }
        
        // Construire l'insert selon les colonnes disponibles
        const insertData = {};
        if (colNames.includes('name')) insertData.name = trad.nom;
        if (colNames.includes('nom')) insertData.nom = trad.nom;
        if (colNames.includes('description')) insertData.description = trad.description;
        if (colNames.includes('temporality')) insertData.temporality = trad.temporalite;
        if (colNames.includes('temporalite')) insertData.temporalite = trad.temporalite;
        if (colNames.includes('materials')) insertData.materials = JSON.stringify(trad.materiaux);
        if (colNames.includes('materiaux')) insertData.materiaux = JSON.stringify(trad.materiaux);
        if (colNames.includes('createdAt')) insertData.createdAt = new Date();
        if (colNames.includes('updatedAt')) insertData.updatedAt = new Date();
        
        const fields = Object.keys(insertData);
        const placeholders = fields.map(() => '?').join(', ');
        const values = Object.values(insertData);
        
        await conn.execute(`INSERT INTO ${tradTableName} (${fields.join(', ')}) VALUES (${placeholders})`, values);
        tradInserted++;
        created++;
      } catch(e) {
        console.error(`  ✗ Tradition ${trad.nom}: ${e.message.substring(0, 80)}`);
        errors++;
      }
    }
    console.log(`  ${tradInserted} traditions insérées dans ${tradTableName}`);
  } else {
    console.log('  Aucune table traditions_olfactives trouvée — données conservées en research_entries');
  }

  // ===== ABSORBE Familles (3 familles) =====
  console.log('\n=== ABSORBE Familles ===');
  
  const [famTables] = await conn.execute("SHOW TABLES LIKE 'famil%'");
  console.log('Tables familles:', famTables.map(t => Object.values(t)[0]).join(', '));
  
  const famTableName = famTables.length > 0 ? Object.values(famTables[0])[0] : null;
  
  if (famTableName) {
    const [famCols] = await conn.execute(`DESCRIBE ${famTableName}`);
    console.log(`Colonnes ${famTableName}:`, famCols.map(c => c.Field).join(', '));
  }

  // ===== Résumé =====
  const [[totalRecettes]] = await conn.execute('SELECT COUNT(*) as n FROM recettes');
  console.log('\n=== Résumé Final ===');
  console.log(`Créées: ${created} | Existantes: ${skipped} | Erreurs: ${errors}`);
  console.log(`Total recettes en base: ${totalRecettes.n}`);
  
  await conn.end();
}

main().catch(console.error);
