import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
let total = 0;

async function getPlantId(name) {
  const [r] = await conn.execute('SELECT id FROM plants WHERE latin_name LIKE ? LIMIT 1', [`%${name}%`]);
  return r[0]?.id ?? null;
}
async function getMolId(name) {
  const [r] = await conn.execute('SELECT id FROM molecules WHERE name LIKE ? LIMIT 1', [`%${name}%`]);
  return r[0]?.id ?? null;
}
async function link(refId, entityType, entityId, linkType, notes) {
  if (entityId === null || entityId === undefined) return;
  try {
    await conn.execute(
      'INSERT IGNORE INTO bibliography_entity_links (bibliography_id, entity_type, entity_id, link_type, notes) VALUES (?, ?, ?, ?, ?)',
      [refId, entityType, entityId, linkType, notes]
    );
    total++;
    console.log(`  ✅ ref#${refId} → ${entityType}#${entityId} (${linkType})`);
  } catch(e) { console.log('ERR', refId, e.message); }
}

const roseId = await getPlantId('Rosa damascena');
const lavId = await getPlantId('Lavandula');
const linaloolId = await getMolId('Linalool');
const geraniolId = await getMolId('Géraniol');
const citronellolId = await getMolId('Citronellol');
const nicotineId = await getMolId('Nicotine');
const solanoneId = await getMolId('Solanone');
const piceaId = await getPlantId('Picea');
const alphaPineneId = await getMolId('α-Pinène');
const betaPineneId = await getMolId('β-Pinène');
const rhodiolaId = await getPlantId('Rhodiola rosea');
const nardId = await getPlantId('Nardostachys');
const boswelliaId = await getPlantId('Boswellia');
const commiphoraId = await getPlantId('Commiphora');
const thcId = await getMolId('THC');
const cbdId = await getMolId('CBD');
const myrceneId = await getMolId('Myrcène');
const eugenolId = await getMolId('Eugénol');
const limoneneId = await getMolId('Limonène');
const betaIononeId = await getMolId('β-Ionone');
const caryophylleneId = await getMolId('β-Caryophyllène');
const musconId = await getMolId('Muscone');
const aframomumId = await getPlantId('Aframomum');
const erythroxylumId = await getPlantId('Erythroxylum');
const lippiaBurkinaId = await getPlantId('Lippia');
const cymbopogonId = await getPlantId('Cymbopogon');
const capsicumId = await getPlantId('Capsicum');
const paeoniaTpsId = await getPlantId('Paeonia');

console.log('IDs résolus:', { roseId, lavId, linaloolId, geraniolId, rhodiolaId, nardId, piceaId });

await link(600001, 'molecule', linaloolId, 'chemical', 'Structure-Odor Relations');
await link(600001, 'molecule', geraniolId, 'chemical', 'Structure-Odor Relations');
await link(600001, 'molecule', citronellolId, 'chemical', 'Structure-Odor Relations');
await link(600002, 'plant', roseId, 'historical', 'Patrimoine olfactif Istanbul');
await link(600003, 'plant', roseId, 'historical', 'Olfaction en musée');
await link(600003, 'plant', lavId, 'historical', 'Olfaction en musée');
await link(600004, 'plant', rhodiolaId, 'conservation', 'Patrimoine culturel immatériel');
await link(600005, 'molecule', nicotineId, 'chemical', 'Tabac oriental arôme');
await link(600005, 'molecule', solanoneId, 'chemical', 'Tabac oriental arôme');
await link(600006, 'plant', piceaId, 'chemical', 'Terpénoïdes Picea brachytyla');
await link(600006, 'molecule', alphaPineneId, 'chemical', 'α-Pinène Picea brachytyla');
await link(600006, 'molecule', betaPineneId, 'chemical', 'β-Pinène Picea brachytyla');
await link(600007, 'molecule', linaloolId, 'chemical', 'Complexité sens olfactif');
await link(600008, 'plant', aframomumId, 'ethnobotanical', 'HE Aframomum melegueta');
await link(600009, 'plant', roseId, 'historical', 'Odeurs dans les musées GLAM');
await link(600010, 'plant', boswelliaId, 'historical', 'Collection odeurs historiques');
await link(600010, 'plant', roseId, 'historical', 'Collection odeurs historiques');
await link(600011, 'plant', roseId, 'historical', 'Toolkit narration olfactive Odeuropa');
await link(600011, 'plant', lavId, 'historical', 'Toolkit narration olfactive Odeuropa');
await link(600012, 'molecule', thcId, 'chemical', 'Composés soufrés cannabis');
await link(600012, 'molecule', cbdId, 'chemical', 'Composés soufrés cannabis');
await link(600012, 'molecule', myrceneId, 'chemical', 'Terpène cannabis');
await link(600013, 'plant', paeoniaTpsId, 'genomic', 'Gènes terpène synthase Paeonia');
await link(600014, 'plant', capsicumId, 'genomic', 'Métabolisme terpénoïde Capsicum');
await link(600015, 'plant', boswelliaId, 'chemical', 'Synergie encens-myrrhe');
await link(600015, 'plant', commiphoraId, 'chemical', 'Synergie encens-myrrhe');
await link(600016, 'molecule', limoneneId, 'chemical', 'Encapsulation limonène');
await link(600016, 'molecule', linaloolId, 'chemical', 'Encapsulation linalool');
await link(600017, 'molecule', linaloolId, 'chemical', 'Profragrances entrelacées');
await link(600018, 'molecule', caryophylleneId, 'chemical', 'GC-HRMS cigares chinois');
await link(600018, 'molecule', solanoneId, 'chemical', 'Solanone cigares chinois');
await link(600019, 'molecule', betaIononeId, 'chemical', 'Caroténoïde tabac');
await link(600020, 'molecule', eugenolId, 'chemical', 'Phénolique tabac');
await link(600022, 'plant', rhodiolaId, 'conservation', 'Menaces Rhodiola rosea');
await link(600023, 'plant', nardId, 'chemical', 'GC-MS Nardostachys jatamansi');
await link(600024, 'plant', lippiaBurkinaId, 'ethnobotanical', 'Plantes aromatiques Burkina Faso');
await link(600024, 'plant', cymbopogonId, 'ethnobotanical', 'Plantes aromatiques Burkina Faso');
await link(600025, 'plant', erythroxylumId, 'ethnobotanical', 'Coca amazonien');
await link(600026, 'plant', roseId, 'historical', 'Industrie parfum Kannauj');
await link(600027, 'molecule', musconId, 'historical', 'Histoire chimie parfums industriels');
await link(600028, 'plant', roseId, 'historical', 'Futurisme olfactif');
await link(600029, 'molecule', linaloolId, 'chemical', 'Perception olfactive');
await link(600030, 'molecule', geraniolId, 'chemical', 'Précurseurs glycosidiques profragrances');
await link(600031, 'molecule', linaloolId, 'chemical', 'Mémoire olfactive artificielle');
await link(600032, 'molecule', linaloolId, 'chemical', 'Affichage olfactif VR');
await link(600033, 'molecule', linaloolId, 'chemical', 'Fermentation linalool');
await link(600033, 'molecule', geraniolId, 'chemical', 'Fermentation géraniol');
await link(600034, 'plant', lavId, 'methodology', 'Extraction HE');
await link(600034, 'plant', roseId, 'methodology', 'Extraction HE');

console.log('\n=== RÉSULTAT FINAL ===');
console.log('Total liens insérés:', total);
const [cnt] = await conn.execute('SELECT COUNT(*) as n FROM bibliography_entity_links WHERE bibliography_id >= 600000');
console.log('Liens ref >= 600000 en base:', cnt[0].n);

await conn.end();
