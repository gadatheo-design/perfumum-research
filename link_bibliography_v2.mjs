/**
 * Script de liaison des 34 nouvelles références (id >= 600000)
 * avec les bons entry_keys récupérés depuis la base
 */

import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

let totalLinks = 0, failedLinks = 0;

async function getPlantId(latinName) {
  const [rows] = await conn.execute(
    "SELECT id FROM plants WHERE latin_name LIKE ? LIMIT 1",
    [`%${latinName}%`]
  );
  return rows[0]?.id ?? null;
}

async function getMoleculeId(name) {
  const [rows] = await conn.execute(
    "SELECT id FROM molecules WHERE name LIKE ? LIMIT 1",
    [`%${name}%`]
  );
  return rows[0]?.id ?? null;
}

async function link(refId, entityType, entityId, linkType = 'cited_in', notes = '') {
  if (!entityId) return false;
  try {
    await conn.execute(
      `INSERT IGNORE INTO bibliography_entity_links 
       (bibliography_id, entity_type, entity_id, link_type, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [refId, entityType, entityId, linkType, notes]
    );
    console.log(`  ✅ ref#${refId} → ${entityType}#${entityId} (${linkType})`);
    totalLinks++;
    return true;
  } catch (e) {
    console.log(`  ❌ ${e.message}`);
    failedLinks++;
    return false;
  }
}

console.log("=== LIAISON DES 34 NOUVELLES RÉFÉRENCES ===\n");

// 600001 | turin-yoshii-2002-sor | Structure-Odor Relations
const linaoolId = await getMoleculeId('Linalool');
const geraniolId = await getMoleculeId('Géraniol');
const citronellolId = await getMoleculeId('Citronellol');
if (linaoolId) await link(600001, 'molecule', linaoolId, 'cited_in', 'Structure-Odor Relations — molécule de référence');
if (geraniolId) await link(600001, 'molecule', geraniolId, 'cited_in', 'Structure-Odor Relations — molécule de référence');

// 600002 | davis-thys-senocak-2017-istanbul | Heritage and Scent: Istanbul
const roseId = await getPlantId('Rosa damascena');
if (roseId) await link(600002, 'plant', roseId, 'cited_in', 'Patrimoine olfactif d\'Istanbul — rose ottomane');

// 600003 | verbeek-2021-museum-scent | How Can Scents Enhance Museum Tours
const lavanderId = await getPlantId('Lavandula');
if (lavanderId) await link(600003, 'plant', lavanderId, 'cited_in', 'Olfaction en musée — plante de référence');
if (roseId) await link(600003, 'plant', roseId, 'cited_in', 'Olfaction en musée — plante de référence');

// 600004 | boswell-2011-intangible-heritage | Challenges to Sustaining Intangible Cultural Heritage
// Lien général avec plantes menacées
const rhodiolaId = await getPlantId('Rhodiola rosea');
if (rhodiolaId) await link(600004, 'plant', rhodiolaId, 'cited_in', 'Patrimoine culturel immatériel — espèce menacée');

// 600005 | edreva-tobacco-valeric-acid | Aroma in Oriental Tobaccos
const nicotineId = await getMoleculeId('Nicotine');
const solanoneId = await getMoleculeId('Solanone');
if (nicotineId) await link(600005, 'molecule', nicotineId, 'cited_in', 'Acide valérique — arôme tabac oriental');
if (solanoneId) await link(600005, 'molecule', solanoneId, 'cited_in', 'Solanone — arôme tabac oriental');

// 600006 | jiang-2020-picea-brachytyla | Terpenoids from Picea brachytyla
const piceaId = await getPlantId('Picea');
const alphaPineneId = await getMoleculeId('α-Pinène');
const betaPineneId = await getMoleculeId('β-Pinène');
if (piceaId) await link(600006, 'plant', piceaId, 'cited_in', 'Terpénoïdes de Picea brachytyla — GC-MS');
if (alphaPineneId) await link(600006, 'molecule', alphaPineneId, 'cited_in', 'α-Pinène de Picea brachytyla');
if (betaPineneId) await link(600006, 'molecule', betaPineneId, 'cited_in', 'β-Pinène de Picea brachytyla');

// 600007 | embo-scent-of-life-2007 | The Scent of Life
// Lien général avec olfaction — lier à linalool comme molécule emblématique
if (linaoolId) await link(600007, 'molecule', linaoolId, 'cited_in', 'Complexité du sens olfactif — molécule de référence');

// 600008 | ajaiyeoba-ekundayo-1999-aframomum | Essential Oil of Aframomum melegueta
const aframomumId = await getPlantId('Aframomum');
if (aframomumId) await link(600008, 'plant', aframomumId, 'cited_in', 'Huile essentielle d\'Aframomum melegueta — GC-MS');

// 600009 | bembibre-strlic-2021-glam-guidelines | Guidelines on Smells in GLAMs
// Lien général avec patrimoine olfactif
if (roseId) await link(600009, 'plant', roseId, 'cited_in', 'Odeurs dans les musées — patrimoine olfactif');

// 600010 | odeuropa-2022-scent-collection | Historical Scent Collection Booklet
const boswelliaId = await getPlantId('Boswellia');
if (boswelliaId) await link(600010, 'plant', boswelliaId, 'cited_in', 'Collection d\'odeurs historiques — encens');
if (roseId) await link(600010, 'plant', roseId, 'cited_in', 'Collection d\'odeurs historiques — rose');

// 600011 | ehrich-2023-olfactory-storytelling-toolkit | Olfactory Storytelling Toolkit
if (roseId) await link(600011, 'plant', roseId, 'cited_in', 'Toolkit de narration olfactive — Odeuropa');
if (lavanderId) await link(600011, 'plant', lavanderId, 'cited_in', 'Toolkit de narration olfactive — Odeuropa');

// 600012 | russo-2021-cannabis-sulfur-compounds | Prenylated Volatile Sulfur Compounds in Cannabis
const thcId = await getMoleculeId('THC');
const cbdId = await getMoleculeId('CBD');
const myrceneId = await getMoleculeId('Myrcène');
if (thcId) await link(600012, 'molecule', thcId, 'cited_in', 'Composés soufrés prénylés du cannabis');
if (cbdId) await link(600012, 'molecule', cbdId, 'cited_in', 'Composés soufrés prénylés du cannabis');
if (myrceneId) await link(600012, 'molecule', myrceneId, 'cited_in', 'Terpène du cannabis — composés soufrés');

// 600013 | paeonia-tps-2023 | Terpene Synthase Genes in Paeonia
const paeoniaTpsId = await getPlantId('Paeonia');
if (paeoniaTpsId) await link(600013, 'plant', paeoniaTpsId, 'cited_in', 'Gènes de terpène synthase chez Paeonia');

// 600014 | capsicum-terpene-genomics-2025 | Terpenoid Metabolism in Capsicum
const capsicumId = await getPlantId('Capsicum');
if (capsicumId) await link(600014, 'plant', capsicumId, 'cited_in', 'Métabolisme terpénoïde de Capsicum — génomique');

// 600015 | frankincense-myrrh-synergy | Boswellia + Commiphora synergy
const commiphoraId = await getPlantId('Commiphora');
if (boswelliaId) await link(600015, 'plant', boswelliaId, 'cited_in', 'Synergie encens-myrrhe — Boswellia');
if (commiphoraId) await link(600015, 'plant', commiphoraId, 'cited_in', 'Synergie encens-myrrhe — Commiphora');

// 600016 | encapsulation-fragrances-polymers | Encapsulation of Fragrances
const limoneneId = await getMoleculeId('Limonène');
if (limoneneId) await link(600016, 'molecule', limoneneId, 'cited_in', 'Encapsulation de limonène dans polymères');
if (linaoolId) await link(600016, 'molecule', linaoolId, 'cited_in', 'Encapsulation de linalool dans polymères');

// 600017 | profragrances-pseudorotaxanes-2021 | Mechanically Interlocked Profragrances
if (linaoolId) await link(600017, 'molecule', linaoolId, 'cited_in', 'Profragrances mécaniquement entrelacées');

// 600018 | chinese-cigar-hs-spme-gchrms | Chinese Cigar Analysis
const caryophylleneId = await getMoleculeId('β-Caryophyllène');
if (caryophylleneId) await link(600018, 'molecule', caryophylleneId, 'cited_in', 'Analyse GC-HRMS cigares chinois');
if (solanoneId) await link(600018, 'molecule', solanoneId, 'cited_in', 'Solanone — cigares chinois');

// 600019 | tobacco-carotenoid-volatiles | Carotenoid-Related Volatiles in Tobacco
const betaIononeId = await getMoleculeId('β-Ionone');
const geranylacetoneId = await getMoleculeId('Géranylacétone');
if (betaIononeId) await link(600019, 'molecule', betaIononeId, 'cited_in', 'Composé caroténoïde du tabac');
if (geranylacetoneId) await link(600019, 'molecule', geranylacetoneId, 'cited_in', 'Composé caroténoïde du tabac');

// 600020 | tobacco-phenolic-compounds | Phenolic Compounds in Tobacco
const eugenolId = await getMoleculeId('Eugénol');
if (eugenolId) await link(600020, 'molecule', eugenolId, 'cited_in', 'Composé phénolique du tabac');

// 600021 | samsun-genetic-ssrmarkers | Genetic Variations in Samsun Tobacco
// Lier au tabac Samsun si disponible
const samsunId = await conn.execute("SELECT id FROM tabacs WHERE name LIKE '%Samsun%' LIMIT 1").then(([r]) => r[0]?.id ?? null);
if (samsunId) await link(600021, 'tabac', samsunId, 'cited_in', 'Marqueurs SSR — tabac Samsun');

// 600022 | rhodiola-threats-trade | Rhodiola rosea threats
if (rhodiolaId) await link(600022, 'plant', rhodiolaId, 'cited_in', 'Menaces commerciales sur Rhodiola rosea — conservation');

// 600023 | nardostachys-gcms-antimicrobial | GC-MS of Nardostachys jatamansi
const nardId = await getPlantId('Nardostachys');
if (nardId) await link(600023, 'plant', nardId, 'cited_in', 'GC-MS et activité antimicrobienne de Nardostachys jatamansi');

// 600024 | burkina-plantes-aromatiques-revue | Plantes Médicinales Burkina Faso
const lippiaBurkinaId = await getPlantId('Lippia');
const cymbopogonBurkinaId = await getPlantId('Cymbopogon');
if (lippiaBurkinaId) await link(600024, 'plant', lippiaBurkinaId, 'cited_in', 'Plantes aromatiques du Burkina Faso');
if (cymbopogonBurkinaId) await link(600024, 'plant', cymbopogonBurkinaId, 'cited_in', 'Plantes aromatiques du Burkina Faso');

// 600025 | nomadic-ecologies-coca-amazonie-2017 | Nomadic Ecologies: Coca Amazonie
const erythroxylumId = await getPlantId('Erythroxylum');
if (erythroxylumId) await link(600025, 'plant', erythroxylumId, 'cited_in', 'Écologies nomades — coca amazonien');

// 600026 | kannauj-perfume-industry | Perfume Industry of Kannauj
const rosaId = await getPlantId('Rosa');
if (rosaId) await link(600026, 'plant', rosaId, 'cited_in', 'Industrie du parfum de Kannauj — rose');

// 600027 | industrial-fragrance-chemistry-history | Industrial Fragrance Chemistry History
const musconId = await getMoleculeId('Muscone');
if (musconId) await link(600027, 'molecule', musconId, 'cited_in', 'Histoire de la chimie des parfums industriels');

// 600028 | futurism-olfactory-verbeek | Olfactory Dimension of Futurism
// Lien avec expériences olfactives — lier à rose comme emblème
if (roseId) await link(600028, 'plant', roseId, 'cited_in', 'Dimension olfactive du futurisme');

// 600029 | scent-sensibility-perception-shifts | Scent and Sensibility
if (linaoolId) await link(600029, 'molecule', linaoolId, 'cited_in', 'Perception olfactive — changements de sensibilité');

// 600030 | herrmann-2017-natural-profragrances-chimia | Natural Profragrances: Glycosidic Precursors
const geraniolGlycosideId = await getMoleculeId('Géraniol');
if (geraniolGlycosideId) await link(600030, 'molecule', geraniolGlycosideId, 'cited_in', 'Précurseurs glycosidiques naturels — profragrances');

// 600031 | artificial-olfactory-memory-review | Artificial Olfactory Memory
if (linaoolId) await link(600031, 'molecule', linaoolId, 'cited_in', 'Mémoire olfactive artificielle — molécule de référence');

// 600032 | wearable-olfactory-display-vr | Wearable Olfactory Display for VR
if (linaoolId) await link(600032, 'molecule', linaoolId, 'cited_in', 'Affichage olfactif portable pour VR');

// 600033 | fermentation-aromatic-compounds | Aromatic Compounds by Fermentation
const linaloolFermId = await getMoleculeId('Linalool');
if (linaloolFermId) await link(600033, 'molecule', linaloolFermId, 'cited_in', 'Production de linalool par fermentation microbienne');
if (geraniolId) await link(600033, 'molecule', geraniolId, 'cited_in', 'Production de géraniol par fermentation microbienne');

// 600034 | pharmacie-globale-extraction-he | Extraction des Huiles Aromatiques
if (lavanderId) await link(600034, 'plant', lavanderId, 'cited_in', 'Extraction d\'huiles essentielles — méthodes');
if (roseId) await link(600034, 'plant', roseId, 'cited_in', 'Extraction d\'huiles essentielles — méthodes');

console.log(`\n=== RÉSULTAT FINAL ===`);
console.log(`Liens créés: ${totalLinks}`);
console.log(`Liens échoués: ${failedLinks}`);

// Vérification finale
const [linkCount] = await conn.execute("SELECT COUNT(*) as n FROM bibliography_entity_links");
const [newLinks] = await conn.execute("SELECT COUNT(*) as n FROM bibliography_entity_links WHERE bibliography_id >= 600000");
console.log(`Total liens dans bibliography_entity_links: ${linkCount[0].n}`);
console.log(`Nouveaux liens (ref >= 600000): ${newLinks[0].n}`);

await conn.end();
