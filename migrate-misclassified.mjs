import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config({ path: '/home/ubuntu/perfumum-research/.env' });

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ============================================================
// CLASSIFICATION MANUELLE DES ENTRÉES DU LOT
// ============================================================
// PLANTES (espèces botaniques, végétaux, arbres, plantes à parfum)
const TO_PLANTS = [
  'Damiana',                                    // Turnera diffusa — plante médicinale
  'Cypriol (Nagarmotha HE)',                    // Cyperus scariosus — plante
  'Costus root — Saussurea costus (CITES)',     // Saussurea costus — plante CITES
  'Comino (Colombie) — Aniba perutilis (menacé)', // Aniba perutilis — arbre menacé
  'Coca Décocaïnisée (Erythroxylum coca)',      // Erythroxylum coca — plante
  'Coca Décocaïnisée',                          // doublon du précédent
  'Cedro Rosado (Cedrela odorata)',             // Cedrela odorata — arbre
  'Cedro Rosado',                               // doublon du précédent
  'Calycolpus Moritzianus (Guayabita)',         // Calycolpus moritzianus — arbre
  'Calycolpus Moritzianus',                     // doublon du précédent
  'Bois de santal rouge — Pterocarpus santalinus', // Pterocarpus santalinus — arbre
  'Bois de rose — Aniba rosaeodora (CITES)',    // Aniba rosaeodora — arbre CITES
  'Bois de rose (lutherie) — Dalbergia nigra (CITES)', // Dalbergia nigra — arbre CITES
  'Borrachero (Brugmansia)',                    // Brugmansia — plante
  'Borrachero',                                 // doublon du précédent
  'Ambrette — Abelmoschus moschatus (musc végétal)', // Abelmoschus moschatus — plante
  'Ambrette seed',                              // doublon du précédent
];

// MATIÈRES PREMIÈRES (HE, extraits, résines, accords, matériaux olfactifs)
const TO_RAW_MATERIALS = [
  'Douglas Fir Essential Oil',                  // HE de sapin Douglas
  'Dust-burn accord',                           // accord olfactif
  'Cèdre de l\'Atlas HE (extrait)',             // HE de cèdre de l'Atlas
  'Cèdre clair',                                // matière première olfactive
  'Cèdre beige',                                // matière première olfactive
  'Cyperone',                                   // cétone sesquiterpénique (constituant de Cypriol HE)
  'Cuivre Olfactif',                            // accord olfactif
  'Cuir fumé',                                  // accord olfactif
  'Crésol Fumé',                                // matière première olfactive (phénol fumé)
  'Créosote light',                             // matière première olfactive
  'Crème de Citronnelle',                       // préparation olfactive
  'Copal Negro',                                // résine de copal
  'Copal Colombien (Protium spp.)',             // résine de copal
  'Copal Colombien',                            // doublon du précédent
  'Copal Blanco',                               // résine de copal
  'Complexes terre minérale',                   // accord olfactif
  'Clearwood (Patchouli Synthétique)',          // matière première synthétique (Firmenich)
  'Clay smoke',                                 // accord olfactif
  'Citrus sec',                                 // accord olfactif
  'Citron sec',                                 // accord olfactif
  'Charcoal africain',                          // matière première olfactive
  'Castoreum Naturel',                          // matière animale naturelle
  'Castoreum',                                  // doublon du précédent
  'Cardamome (α-Terpinyl Acetate)',             // matière première (constituant HE cardamome)
  'Café Geisha - Grains Verts',                 // matière première olfactive
  'Café Geisha',                                // doublon du précédent
  'Cacao Colombien - Fèves Fermentées',         // matière première olfactive
  'Cacao Colombien',                            // doublon du précédent
  'Bronze Note',                                // accord olfactif
  'Bone-smoke accord',                          // accord olfactif
  'Bois tendre',                                // accord olfactif
  'Bois sec',                                   // accord olfactif
  'Bois de brousse',                            // accord olfactif
  'Black Spruce Essential Oil',                 // HE d'épinette noire
  'Black Emerald',                              // accord olfactif
  'Bitume light',                               // accord olfactif
  'Birch Tar North American',                   // goudron de bouleau
  'Bergamote italienne HE (extrait)',           // HE de bergamote
  'Benzoin Siam',                               // résine de benjoin du Siam
  'Baume de Tolú (Myroxylon balsamum)',         // baume naturel
  'Baume de Tolú',                              // doublon du précédent
  'Balsam Fir Essential Oil',                   // HE de sapin baumier
  'BENZOIN RESIN',                              // résine de benjoin
  'Artisan Peppermint Oil',                     // HE de menthe poivrée artisanale
  'Argile blanche',                             // matière première olfactive
  'Ammonium-Maillard',                          // accord olfactif (réaction de Maillard)
  'Ambrox Super',                               // matière première synthétique (ambrox)
  'Ambre profond',                              // accord olfactif
];

// VRAIES MOLÉCULES (rester dans molecules)
// E-2-dodecenal, Diacétyle, Damascone Beta, Cyperone (déjà dans raw_materials),
// C18 lactone, C14 lactone, Cembratrienol, Cedarol, Betulinine, Beta-glucane,
// Asarone alpha, Aristolen-9β-ol, Calcaire Olfactif (accord → raw_materials)
// Crésol (phénol pur → molécule)

const KEEP_AS_MOLECULES = [
  'E-2-dodecenal',
  'Diacétyle',
  'Damascone Beta',
  'C18 lactone (γ-Octadecalactone)',
  'C14 lactone (γ-Tetradecalactone)',
  'Cembratrienol',
  'Cedarol',
  'Betulinine',
  'Beta-glucane',
  'Asarone alpha',
  'Aristolen-9β-ol',
  'Crésol',
  'Calcaire Olfactif',  // accord → raw_materials en fait
];

// Calcaire Olfactif est un accord → raw_materials
TO_RAW_MATERIALS.push('Calcaire Olfactif');

console.log('\n=== ANALYSE DE LA BASE ===\n');

// Chercher toutes ces entrées dans molecules
const allNames = [...TO_PLANTS, ...TO_RAW_MATERIALS];
const placeholders = allNames.map(() => '?').join(',');
const [rows] = await conn.query(
  `SELECT id, name, family, cas_number FROM molecules WHERE name IN (${placeholders})`,
  allNames
);

console.log(`Entrées trouvées dans molecules: ${rows.length}`);
for (const r of rows) {
  const dest = TO_PLANTS.includes(r.name) ? 'PLANTE' : 'MATIÈRE PREMIÈRE';
  console.log(`  [${dest}] id=${r.id} | ${r.name}`);
}

// Chercher les doublons (même nom dans plants ou raw_materials)
const [existingPlants] = await conn.query(
  `SELECT name FROM plants WHERE name IN (${TO_PLANTS.map(() => '?').join(',')})`,
  TO_PLANTS
);
const [existingRM] = await conn.query(
  `SELECT name FROM raw_materials WHERE name IN (${TO_RAW_MATERIALS.map(() => '?').join(',')})`,
  TO_RAW_MATERIALS
);

console.log(`\nDéjà dans plants: ${existingPlants.map(r => r.name).join(', ') || 'aucun'}`);
console.log(`Déjà dans raw_materials: ${existingRM.map(r => r.name).join(', ') || 'aucun'}`);

await conn.end();
