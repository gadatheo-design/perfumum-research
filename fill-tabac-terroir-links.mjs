/**
 * Crée les liens tabacs-terroirs manquants.
 * Correspondances basées sur l'origine géographique des tabacs.
 */

import mysql from 'mysql2/promise';

// tabac_id → terroir_id avec données agronomiques
const TABAC_TERROIR_LINKS = [
  // === Tabacs Orientaux Grecs ===
  { tabac_id: 1, terroir_id: 330028, soil_ph: '6.8', soil_type: 'Sableux calcaire', nitrogen_level: 'Faible', potassium_level: 'Modere', climate_notes: 'Climat méditerranéen continental - Été chaud et sec', cultivation_notes: 'Sun-curing traditionnel 4-6 semaines' }, // Krumovgrad → Grèce Xanthi
  { tabac_id: 6, terroir_id: 330008, soil_ph: '6.5', soil_type: 'Sableux côtier', nitrogen_level: 'Faible', potassium_level: 'Faible', climate_notes: 'Climat méditerranéen oriental - Influence maritime', cultivation_notes: 'Sun-curing classique oriental' }, // Samsoun → Méditerranée orientale
  { tabac_id: 30001, terroir_id: 330029, soil_ph: '6.8', soil_type: 'Sableux calcaire', nitrogen_level: 'Faible', potassium_level: 'Modere', climate_notes: 'Climat méditerranéen - Région de Yenidje (Giannitsa)', cultivation_notes: 'Sun-curing 4-5 semaines, feuilles petites et aromatiques' }, // Yenidje → Grèce Yenidje
  { tabac_id: 30002, terroir_id: 330008, soil_ph: '6.5', soil_type: 'Sableux côtier', nitrogen_level: 'Faible', potassium_level: 'Faible', climate_notes: 'Climat méditerranéen oriental - Mer Noire', cultivation_notes: 'Sun-curing traditionnel' }, // Samsun → Méditerranée orientale
  { tabac_id: 30003, terroir_id: 330028, soil_ph: '6.8', soil_type: 'Sableux calcaire', nitrogen_level: 'Faible', potassium_level: 'Modere', climate_notes: 'Basma de Drama - Climat continental méditerranéen', cultivation_notes: 'Sun-curing 4-6 semaines, feuilles petites et dorées' }, // Basma → Grèce Xanthi
  { tabac_id: 30004, terroir_id: 330028, soil_ph: '6.8', soil_type: 'Sableux calcaire', nitrogen_level: 'Faible', potassium_level: 'Modere', climate_notes: 'Katerini - Piérie, Macédoine centrale', cultivation_notes: 'Sun-curing, variété semi-orientale' }, // Katerini → Grèce Xanthi
  { tabac_id: 30005, terroir_id: 330028, soil_ph: '6.8', soil_type: 'Sableux calcaire', nitrogen_level: 'Faible', potassium_level: 'Modere', climate_notes: 'Drama - Macédoine orientale', cultivation_notes: 'Sun-curing, Basma Drama' }, // Drama → Grèce Xanthi
  { tabac_id: 30007, terroir_id: 330028, soil_ph: '6.8', soil_type: 'Sableux calcaire', nitrogen_level: 'Faible', potassium_level: 'Modere', climate_notes: 'Xanthi - Thrace, Grèce', cultivation_notes: 'Sun-curing, Basma Xanthi classique' }, // Xanthi → Grèce Xanthi
  
  // === Tabacs Turcs ===
  { tabac_id: 30006, terroir_id: 240004, soil_ph: '6.5', soil_type: 'Sableux côtier', nitrogen_level: 'Faible', potassium_level: 'Faible', climate_notes: 'Région d\'Izmir - Climat méditerranéen', cultivation_notes: 'Sun-curing, variété Smyrna classique' }, // Izmir/Smyrna → Izmir Region
  { tabac_id: 30008, terroir_id: 330008, soil_ph: '6.5', soil_type: 'Sableux côtier', nitrogen_level: 'Faible', potassium_level: 'Faible', climate_notes: 'Bashi Bagli - Turquie orientale', cultivation_notes: 'Sun-curing oriental' }, // Bashi Bagli → Méditerranée orientale
  { tabac_id: 30009, terroir_id: 330008, soil_ph: '6.5', soil_type: 'Sableux calcaire', nitrogen_level: 'Faible', potassium_level: 'Modere', climate_notes: 'Dubek - Macédoine du Nord', cultivation_notes: 'Sun-curing, variété orientale fine' }, // Dubek → Méditerranée orientale
  { tabac_id: 30010, terroir_id: 330010, soil_ph: '7.0', soil_type: 'Sableux côtier', nitrogen_level: 'Faible', potassium_level: 'Faible', climate_notes: 'Djebel - Syrie, région montagneuse', cultivation_notes: 'Sun-curing, variété syrienne' }, // Djebel → Moyen-Orient
  
  // === Tabacs Syrie/Chypre ===
  { tabac_id: 30013, terroir_id: 240005, soil_ph: '7.2', soil_type: 'Sableux côtier', nitrogen_level: 'Faible', potassium_level: 'Faible', climate_notes: 'Latakia - Côte syrienne, fumage aux bois aromatiques', cultivation_notes: 'Sun-curing puis fumage aux bois de chêne et pin' }, // Latakia → Latakia Coast
  
  // === Tabacs Américains ===
  { tabac_id: 5, terroir_id: 240003, soil_ph: '6.0', soil_type: 'Limoneux fertile', nitrogen_level: 'Eleve', potassium_level: 'Modere', climate_notes: 'Kentucky - Climat continental humide', cultivation_notes: 'Air-curing 4-8 semaines, feuilles larges' }, // Burley → Western Kentucky
  { tabac_id: 30015, terroir_id: 240002, soil_ph: '6.2', soil_type: 'Sableux limoneux', nitrogen_level: 'Faible', potassium_level: 'Modere', climate_notes: 'Maryland - Climat côtier tempéré', cultivation_notes: 'Air-curing, variété légère' }, // Maryland 609 → Piedmont Virginia
  { tabac_id: 30016, terroir_id: 240002, soil_ph: '6.2', soil_type: 'Sableux rouge', nitrogen_level: 'Faible', potassium_level: 'Modere', climate_notes: 'Connecticut - Climat tempéré côtier', cultivation_notes: 'Flue-curing, graine Havana en Connecticut' }, // Havana Seed → Piedmont Virginia
  { tabac_id: 30017, terroir_id: 330017, soil_ph: '6.0', soil_type: 'Limoneux tropical', nitrogen_level: 'Modere', potassium_level: 'Eleve', climate_notes: 'Venezuela/Virginie - Climat tropical/subtropical', cultivation_notes: 'Flue-curing, variété hybride' }, // Orinoco → Venezuela
  
  // === Tabacs Balkans ===
  { tabac_id: 60001, terroir_id: 330028, soil_ph: '6.8', soil_type: 'Sableux calcaire', nitrogen_level: 'Faible', potassium_level: 'Modere', climate_notes: 'Basma - Grèce orientale', cultivation_notes: 'Sun-curing, Basma classique' }, // Basma (60001) → Grèce Xanthi
  { tabac_id: 60002, terroir_id: 330028, soil_ph: '6.8', soil_type: 'Sableux calcaire', nitrogen_level: 'Faible', potassium_level: 'Modere', climate_notes: 'Katerini 53 - Piérie, Grèce', cultivation_notes: 'Sun-curing, sélection 1953' }, // Katerini 53 → Grèce Xanthi
  { tabac_id: 60003, terroir_id: 330028, soil_ph: '6.8', soil_type: 'Sableux calcaire', nitrogen_level: 'Faible', potassium_level: 'Modere', climate_notes: 'Xanthi 2A - Thrace, Grèce', cultivation_notes: 'Sun-curing, sélection 2A' }, // Xanthi 2A → Grèce Xanthi
  { tabac_id: 60004, terroir_id: 240004, soil_ph: '6.5', soil_type: 'Sableux côtier', nitrogen_level: 'Faible', potassium_level: 'Faible', climate_notes: 'Izmir (Ozbas) - Région égéenne', cultivation_notes: 'Sun-curing, sélection Ozbas' }, // Izmir (Ozbas) → Izmir Region
  { tabac_id: 60005, terroir_id: 330008, soil_ph: '6.5', soil_type: 'Sableux côtier', nitrogen_level: 'Faible', potassium_level: 'Faible', climate_notes: 'Samsun Black Sea - Mer Noire turque', cultivation_notes: 'Sun-curing, variété Mer Noire' }, // Samsun Black Sea → Méditerranée orientale
  { tabac_id: 60006, terroir_id: 330027, soil_ph: '7.0', soil_type: 'Calcaire aride', nitrogen_level: 'Faible', potassium_level: 'Faible', climate_notes: 'Shirazi - Iran, région de Chiraz', cultivation_notes: 'Sun-curing, variété iranienne rare' }, // Shirazi → Iran
  { tabac_id: 60007, terroir_id: 330001, soil_ph: '6.0', soil_type: 'Volcanique riche', nitrogen_level: 'Modere', potassium_level: 'Eleve', climate_notes: 'Nicotiana rustica - Mexique, variété ancestrale', cultivation_notes: 'Cultivation traditionnelle mésoaméricaine' }, // Nicotiana rustica → Mexique central
  { tabac_id: 60008, terroir_id: 330029, soil_ph: '6.8', soil_type: 'Sableux calcaire', nitrogen_level: 'Faible', potassium_level: 'Modere', climate_notes: 'Yenidje - Région de Giannitsa, Grèce', cultivation_notes: 'Sun-curing, variété Yenidje classique' }, // Yenidje (60008) → Grèce Yenidje
  { tabac_id: 60009, terroir_id: 240004, soil_ph: '6.5', soil_type: 'Sableux côtier', nitrogen_level: 'Faible', potassium_level: 'Faible', climate_notes: 'Smyrna - Izmir, côte égéenne', cultivation_notes: 'Sun-curing, Smyrna classique' }, // Smyrna → Izmir Region
  { tabac_id: 60010, terroir_id: 330008, soil_ph: '6.8', soil_type: 'Sableux calcaire', nitrogen_level: 'Faible', potassium_level: 'Modere', climate_notes: 'Djebel - Bulgarie, variété orientale', cultivation_notes: 'Sun-curing, variété bulgare' }, // Djebel (Bulgarie) → Méditerranée orientale
  { tabac_id: 60011, terroir_id: 330008, soil_ph: '6.5', soil_type: 'Sableux calcaire', nitrogen_level: 'Faible', potassium_level: 'Modere', climate_notes: 'Bashi Bagli - Frontière gréco-turque', cultivation_notes: 'Sun-curing, variété frontalière' }, // Bashi Bagli (Grèce/Turquie) → Méditerranée orientale
  { tabac_id: 60012, terroir_id: 330028, soil_ph: '6.8', soil_type: 'Sableux calcaire', nitrogen_level: 'Faible', potassium_level: 'Modere', climate_notes: 'Xanthi Yaka - Thrace, Grèce', cultivation_notes: 'Sun-curing, variété Yaka de Xanthi' }, // Xanthi Yaka → Grèce Xanthi
  { tabac_id: 60013, terroir_id: 330008, soil_ph: '6.8', soil_type: 'Sableux calcaire', nitrogen_level: 'Faible', potassium_level: 'Modere', climate_notes: 'Yaka - Macédoine du Nord', cultivation_notes: 'Sun-curing, variété Yaka macédonienne' }, // Yaka → Méditerranée orientale
  { tabac_id: 60014, terroir_id: 330008, soil_ph: '6.8', soil_type: 'Sableux calcaire', nitrogen_level: 'Faible', potassium_level: 'Modere', climate_notes: 'Otlia - Balkans, variété rare', cultivation_notes: 'Sun-curing, variété balkanique ancienne' }, // Otlia → Méditerranée orientale
  { tabac_id: 60015, terroir_id: 330028, soil_ph: '6.8', soil_type: 'Sableux calcaire', nitrogen_level: 'Faible', potassium_level: 'Modere', climate_notes: 'Agonya - Grèce, variété ancienne', cultivation_notes: 'Sun-curing, variété grecque rare' }, // Agonya → Grèce Xanthi
  { tabac_id: 60016, terroir_id: 240004, soil_ph: '6.5', soil_type: 'Sableux côtier', nitrogen_level: 'Faible', potassium_level: 'Faible', climate_notes: 'Tasoua - Turquie, variété orientale', cultivation_notes: 'Sun-curing, variété turque' }, // Tasoua → Izmir Region
  { tabac_id: 60017, terroir_id: 330028, soil_ph: '6.8', soil_type: 'Sableux calcaire', nitrogen_level: 'Faible', potassium_level: 'Modere', climate_notes: 'Dupnitsa - Bulgarie, variété orientale', cultivation_notes: 'Sun-curing, variété bulgare de Dupnitsa' }, // Dupnitsa → Grèce Xanthi (zone géographique proche)
];

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Récupérer les liens existants pour éviter les doublons
  const [existing] = await conn.execute('SELECT tabac_id FROM tabac_terroir_links');
  const existingIds = new Set(existing.map(r => r.tabac_id));
  
  let inserted = 0;
  let skipped = 0;
  
  for (const link of TABAC_TERROIR_LINKS) {
    if (existingIds.has(link.tabac_id)) {
      skipped++;
      continue;
    }
    
    await conn.execute(
      'INSERT INTO tabac_terroir_links (tabac_id, terroir_id, soil_ph, soil_type, nitrogen_level, potassium_level, climate_notes, cultivation_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [link.tabac_id, link.terroir_id, link.soil_ph, link.soil_type, link.nitrogen_level, link.potassium_level, link.climate_notes, link.cultivation_notes]
    );
    inserted++;
    console.log(`Lien créé: tabac ${link.tabac_id} → terroir ${link.terroir_id}`);
  }
  
  const [total] = await conn.execute('SELECT COUNT(*) as n FROM tabac_terroir_links');
  console.log(`\nTotal liens terroir: ${total[0].n}`);
  console.log(`Insérés: ${inserted} | Ignorés (existants): ${skipped}`);
  
  // Tabacs encore sans lien
  const [noLink] = await conn.execute(`
    SELECT t.id, t.name, t.origin FROM tabacs t
    LEFT JOIN tabac_terroir_links ttl ON t.id = ttl.tabac_id
    WHERE ttl.id IS NULL
  `);
  console.log(`\nTabacs encore sans lien terroir: ${noLink.length}`);
  noLink.forEach(t => console.log(`  ${t.id}: ${t.name} (${t.origin})`));
  
  await conn.end();
}

main().catch(console.error);
