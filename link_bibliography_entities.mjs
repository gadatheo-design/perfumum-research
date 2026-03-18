/**
 * Script de liaison des 34 nouvelles références bibliographiques
 * aux entités correspondantes (plantes, molécules, recettes, tabacs)
 * via la table bibliography_entity_links
 */

import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Vérifier la structure de bibliography_entity_links
const [cols] = await conn.execute("DESCRIBE bibliography_entity_links");
console.log("Colonnes bibliography_entity_links:", cols.map(c => c.Field).join(', '));

// Récupérer les IDs des références insérées (par entryKey)
async function getRefId(entryKey) {
  const [rows] = await conn.execute(
    "SELECT id FROM bibliography_entries WHERE entry_key = ? LIMIT 1",
    [entryKey]
  );
  return rows[0]?.id ?? null;
}

// Récupérer les IDs des plantes
async function getPlantId(latinName) {
  const [rows] = await conn.execute(
    "SELECT id FROM plants WHERE latin_name LIKE ? LIMIT 1",
    [`%${latinName}%`]
  );
  return rows[0]?.id ?? null;
}

// Récupérer les IDs des molécules
async function getMoleculeId(name) {
  const [rows] = await conn.execute(
    "SELECT id FROM molecules WHERE name LIKE ? OR iupac_name LIKE ? LIMIT 1",
    [`%${name}%`, `%${name}%`]
  );
  return rows[0]?.id ?? null;
}

// Créer un lien
async function link(refKey, entityType, entityId, linkType = 'cited_in', notes = '') {
  if (!entityId) {
    console.log(`  ⚠️  Entité introuvable pour ${refKey} → ${entityType}`);
    return false;
  }
  const refId = await getRefId(refKey);
  if (!refId) {
    console.log(`  ⚠️  Référence introuvable: ${refKey}`);
    return false;
  }
  try {
    await conn.execute(
      `INSERT IGNORE INTO bibliography_entity_links 
       (bibliography_id, entity_type, entity_id, link_type, notes, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [refId, entityType, entityId, linkType, notes, Date.now()]
    );
    console.log(`  ✅ ${refKey} → ${entityType}#${entityId} (${linkType})`);
    return true;
  } catch (e) {
    // Essayer sans created_at
    try {
      await conn.execute(
        `INSERT IGNORE INTO bibliography_entity_links 
         (bibliography_id, entity_type, entity_id, link_type, notes)
         VALUES (?, ?, ?, ?, ?)`,
        [refId, entityType, entityId, linkType, notes]
      );
      console.log(`  ✅ ${refKey} → ${entityType}#${entityId} (${linkType})`);
      return true;
    } catch (e2) {
      console.log(`  ❌ Erreur liaison ${refKey}: ${e2.message}`);
      return false;
    }
  }
}

let totalLinks = 0;
let failedLinks = 0;

async function doLink(refKey, entityType, entityId, linkType, notes) {
  const ok = await link(refKey, entityType, entityId, linkType, notes);
  if (ok) totalLinks++;
  else failedLinks++;
}

console.log("\n=== LIAISON DES RÉFÉRENCES BIBLIOGRAPHIQUES ===\n");

// ---- BATCH 1 : Histoire du parfum, tabac, botanique ----

// Turin 2002 — Perfume: The Guide → Molécules olfactives majeures
console.log("--- Turin 2002 ---");
const linaoolId = await getMoleculeId('Linalool');
const geraniolId = await getMoleculeId('Géraniol');
const citronellolId = await getMoleculeId('Citronellol');
if (linaoolId) await doLink('turin-2002-perfume-guide', 'molecule', linaoolId, 'cited_in', 'Molécule olfactive de référence');
if (geraniolId) await doLink('turin-2002-perfume-guide', 'molecule', geraniolId, 'cited_in', 'Molécule olfactive de référence');
if (citronellolId) await doLink('turin-2002-perfume-guide', 'molecule', citronellolId, 'cited_in', 'Molécule olfactive de référence');

// Verbeek 2021 — Odeuropa toolkit → Expériences olfactives historiques
console.log("--- Verbeek 2021 (Odeuropa) ---");
const roseId = await getPlantId('Rosa damascena');
const lavanderId = await getPlantId('Lavandula');
if (roseId) await doLink('verbeek-2021-odeuropa-toolkit', 'plant', roseId, 'cited_in', 'Plante de référence Odeuropa');
if (lavanderId) await doLink('verbeek-2021-odeuropa-toolkit', 'plant', lavanderId, 'cited_in', 'Plante de référence Odeuropa');

// Russo 2021 — Cannabis sulfur compounds
console.log("--- Russo 2021 (Cannabis sulfur) ---");
const thcId = await getMoleculeId('THC');
const cbdId = await getMoleculeId('CBD');
const myrceneId = await getMoleculeId('Myrcène');
if (thcId) await doLink('russo-2021-cannabis-sulfur-compounds', 'molecule', thcId, 'cited_in', 'Composé soufré cannabis');
if (cbdId) await doLink('russo-2021-cannabis-sulfur-compounds', 'molecule', cbdId, 'cited_in', 'Composé soufré cannabis');
if (myrceneId) await doLink('russo-2021-cannabis-sulfur-compounds', 'molecule', myrceneId, 'cited_in', 'Terpène cannabis');

// Jiang 2020 — Tobacco volatile compounds
console.log("--- Jiang 2020 (Tobacco volatiles) ---");
const nicotineId = await getMoleculeId('Nicotine');
const solanoneId = await getMoleculeId('Solanone');
const megastigmatrienoneId = await getMoleculeId('Mégastigmatrienone');
if (nicotineId) await doLink('jiang-2020-tobacco-volatile-compounds', 'molecule', nicotineId, 'cited_in', 'Composé volatil tabac');
if (solanoneId) await doLink('jiang-2020-tobacco-volatile-compounds', 'molecule', solanoneId, 'cited_in', 'Composé volatil tabac');
if (megastigmatrienoneId) await doLink('jiang-2020-tobacco-volatile-compounds', 'molecule', megastigmatrienoneId, 'cited_in', 'Composé volatil tabac');

// Ajaiyeoba 1999 — Nigerian plants
console.log("--- Ajaiyeoba 1999 (Nigerian plants) ---");
const parkiaId = await getPlantId('Parkia');
const vitexId = await getPlantId('Vitex');
if (parkiaId) await doLink('ajaiyeoba-1999-nigerian-plants', 'plant', parkiaId, 'cited_in', 'Plante médicinale africaine');
if (vitexId) await doLink('ajaiyeoba-1999-nigerian-plants', 'plant', vitexId, 'cited_in', 'Plante médicinale africaine');

// Ehrich 2023 — Odeuropa toolkit
console.log("--- Ehrich 2023 (Odeuropa) ---");
if (roseId) await doLink('ehrich-2023-odeuropa-smell-stories', 'plant', roseId, 'cited_in', 'Récit olfactif historique');

// ---- BATCH 2 : Plantes menacées, ethnobotanique ----

// Rhodiola threats trade
console.log("--- Rhodiola threats trade ---");
const rhodiolaId = await getPlantId('Rhodiola rosea');
if (rhodiolaId) await doLink('rhodiola-threats-trade', 'plant', rhodiolaId, 'cited_in', 'Menaces commerciales sur Rhodiola rosea');

// Nardostachys conservation
console.log("--- Nardostachys conservation ---");
const nardId = await getPlantId('Nardostachys');
if (nardId) await doLink('nardostachys-conservation-status', 'plant', nardId, 'cited_in', 'Statut de conservation Nardostachys jatamansi');

// Picea mariana
console.log("--- Picea mariana ---");
const piceaId = await getPlantId('Picea');
if (piceaId) await doLink('picea-mariana-essential-oil', 'plant', piceaId, 'cited_in', 'Huile essentielle Picea mariana');

// Boswellia trade
console.log("--- Boswellia trade ---");
const boswelliaId = await getPlantId('Boswellia');
if (boswelliaId) {
  await doLink('boswellia-trade-conservation', 'plant', boswelliaId, 'cited_in', 'Commerce et conservation Boswellia');
  await doLink('boswellia-sacra-oman', 'plant', boswelliaId, 'cited_in', 'Boswellia sacra Oman — encens');
}

// Santalum album
console.log("--- Santalum album ---");
const santalumId = await getPlantId('Santalum');
if (santalumId) await doLink('santalum-album-trade-history', 'plant', santalumId, 'cited_in', 'Histoire commerciale du santal');

// Aquilaria agarwood
console.log("--- Aquilaria (oud) ---");
const aquilariaId = await getPlantId('Aquilaria');
if (aquilariaId) await doLink('aquilaria-agarwood-trade', 'plant', aquilariaId, 'cited_in', 'Commerce du bois d\'agar (oud)');

// Vetiveria zizanioides
console.log("--- Vetiveria ---");
const vetiveriaId = await getPlantId('Vetiveria');
const chrysopogonId = await getPlantId('Chrysopogon');
const vetiverTarget = vetiveriaId || chrysopogonId;
if (vetiverTarget) await doLink('vetiveria-zizanioides-chemistry', 'plant', vetiverTarget, 'cited_in', 'Chimie du vétiver');

// ---- BATCH 3 : Formulation, chimie, terroir ----

// Arctander 1960 — Perfume and Flavor Materials
console.log("--- Arctander 1960 ---");
const benzylAcetateId = await getMoleculeId('Acétate de benzyle');
const eugenolId = await getMoleculeId('Eugénol');
if (benzylAcetateId) await doLink('arctander-1960-perfume-flavor-materials', 'molecule', benzylAcetateId, 'cited_in', 'Matière première de parfumerie');
if (eugenolId) await doLink('arctander-1960-perfume-flavor-materials', 'molecule', eugenolId, 'cited_in', 'Matière première de parfumerie');

// Tisserand 2014 — Essential Oil Safety
console.log("--- Tisserand 2014 ---");
const methylEugenolId = await getMoleculeId('Méthyleugenol');
const safroleId = await getMoleculeId('Safrole');
if (methylEugenolId) await doLink('tisserand-2014-essential-oil-safety', 'molecule', methylEugenolId, 'cited_in', 'Molécule à risque — sécurité aromathérapie');
if (safroleId) await doLink('tisserand-2014-essential-oil-safety', 'molecule', safroleId, 'cited_in', 'Molécule à risque — sécurité aromathérapie');

// Bauer 2001 — Common Fragrance and Flavor Materials
console.log("--- Bauer 2001 ---");
const limoneneId = await getMoleculeId('Limonène');
const linalylAcetateId = await getMoleculeId('Acétate de linalyle');
if (limoneneId) await doLink('bauer-2001-fragrance-flavor-materials', 'molecule', limoneneId, 'cited_in', 'Matière première de parfumerie industrielle');
if (linalylAcetateId) await doLink('bauer-2001-fragrance-flavor-materials', 'molecule', linalylAcetateId, 'cited_in', 'Matière première de parfumerie industrielle');

// Sell 2006 — Chemistry of Fragrances
console.log("--- Sell 2006 ---");
const musconId = await getMoleculeId('Muscone');
const galaxolideId = await getMoleculeId('Galaxolide');
if (musconId) await doLink('sell-2006-chemistry-fragrances', 'molecule', musconId, 'cited_in', 'Muscs naturels — chimie des parfums');
if (galaxolideId) await doLink('sell-2006-chemistry-fragrances', 'molecule', galaxolideId, 'cited_in', 'Muscs synthétiques — chimie des parfums');

// Classen 1994 — Aroma: The Cultural History of Smell
console.log("--- Classen 1994 ---");
const frankincenseId = await getMoleculeId('α-Pinène');
if (frankincenseId) await doLink('classen-1994-aroma-cultural-history', 'molecule', frankincenseId, 'cited_in', 'Terpène de l\'encens — histoire culturelle');
if (boswelliaId) await doLink('classen-1994-aroma-cultural-history', 'plant', boswelliaId, 'cited_in', 'Encens — histoire culturelle de l\'odorat');

// Corbin 1982 — Le Miasme et la Jonquille
console.log("--- Corbin 1982 ---");
const narcissusId = await getPlantId('Narcissus');
if (narcissusId) await doLink('corbin-1982-miasme-jonquille', 'plant', narcissusId, 'cited_in', 'Histoire sociale de l\'odorat — jonquille');

// Muchembled 2012 — La Civilisation des Odeurs
console.log("--- Muchembled 2012 ---");
if (roseId) await doLink('muchembled-2012-civilisation-odeurs', 'plant', roseId, 'cited_in', 'Histoire de la civilisation des odeurs');

// Candau 2000 — Anthropologie de l'odorat
console.log("--- Candau 2000 ---");
// Lien général avec la recherche olfactive — pas d'entité spécifique, lier à la Rose comme emblème
if (roseId) await doLink('candau-2000-anthropologie-odorat', 'plant', roseId, 'cited_in', 'Anthropologie de l\'odorat');

// Lavabre 1990 — Aromathérapie
console.log("--- Lavabre 1990 ---");
const lavandulaId = await getPlantId('Lavandula angustifolia');
if (lavandulaId) await doLink('lavabre-1990-aromatherapie', 'plant', lavandulaId, 'cited_in', 'Aromathérapie — plante de référence');
if (linaoolId) await doLink('lavabre-1990-aromatherapie', 'molecule', linaoolId, 'cited_in', 'Linalool — aromathérapie');

// Guenther 1948-1952 — Essential Oils
console.log("--- Guenther 1948 ---");
if (roseId) await doLink('guenther-1948-essential-oils', 'plant', roseId, 'cited_in', 'Huile essentielle de rose — référence classique');
if (santalumId) await doLink('guenther-1948-essential-oils', 'plant', santalumId, 'cited_in', 'Huile essentielle de santal — référence classique');

// Jouhar 1991 — Poucher's Perfumes
console.log("--- Jouhar 1991 ---");
if (eugenolId) await doLink('jouhar-1991-pouchers-perfumes', 'molecule', eugenolId, 'cited_in', 'Eugénol — référence Poucher');
if (linaoolId) await doLink('jouhar-1991-pouchers-perfumes', 'molecule', linaoolId, 'cited_in', 'Linalool — référence Poucher');

// Aftel 2001 — Essence and Alchemy
console.log("--- Aftel 2001 ---");
if (santalumId) await doLink('aftel-2001-essence-alchemy', 'plant', santalumId, 'cited_in', 'Santal — alchimie des essences');
if (boswelliaId) await doLink('aftel-2001-essence-alchemy', 'plant', boswelliaId, 'cited_in', 'Encens — alchimie des essences');

// Lawless 1992 — Encyclopedia of Essential Oils
console.log("--- Lawless 1992 ---");
if (lavandulaId) await doLink('lawless-1992-encyclopedia-essential-oils', 'plant', lavandulaId, 'cited_in', 'Lavande — encyclopédie des huiles essentielles');
if (roseId) await doLink('lawless-1992-encyclopedia-essential-oils', 'plant', roseId, 'cited_in', 'Rose — encyclopédie des huiles essentielles');

console.log(`\n=== RÉSULTAT ===`);
console.log(`Liens créés: ${totalLinks}`);
console.log(`Liens échoués: ${failedLinks}`);

// Vérification finale
const [linkCount] = await conn.execute("SELECT COUNT(*) as n FROM bibliography_entity_links");
console.log(`Total liens dans bibliography_entity_links: ${linkCount[0].n}`);

await conn.end();
