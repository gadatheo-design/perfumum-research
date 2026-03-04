/**
 * Batch 7 thérapeutique : terpènes oxygénés, phénols complexes, saponines
 * Objectif : 30.2% → 35% (527/1678 → ~588/1678)
 * Cible : 61 molécules supplémentaires
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Données thérapeutiques pour les molécules cibles
const therapeuticData = [
  // ── OXYDES TERPÉNIQUES ──────────────────────────────────────────────────────
  { name: '1,8-Cineole', props: ['expectorant', 'mucolytique', 'antibactérien', 'anti-inflammatoire', 'stimulant cognitif'] },
  { name: 'Eucalyptol', props: ['expectorant', 'mucolytique', 'antibactérien', 'anti-inflammatoire', 'bronchodilatateur'] },
  { name: 'Linalool oxide', props: ['sédatif', 'anxiolytique', 'antibactérien', 'antifongique'] },
  { name: 'Rose oxide', props: ['antibactérien', 'antifongique', 'anti-inflammatoire'] },
  { name: 'Caryophyllene oxide', props: ['anti-inflammatoire', 'antifongique', 'antibactérien', 'analgésique', 'antioxydant'] },
  { name: 'Bisabolol oxide', props: ['anti-inflammatoire', 'cicatrisant', 'antibactérien', 'antifongique'] },
  { name: 'Humulene epoxide', props: ['anti-inflammatoire', 'antibactérien', 'antifongique'] },
  { name: 'Ascaridole', props: ['antiparasitaire', 'antihelminthique', 'antibactérien'] },
  { name: 'Pinocarvone', props: ['antibactérien', 'antifongique', 'anti-inflammatoire'] },
  { name: 'Myrtenal', props: ['antibactérien', 'antifongique', 'anti-inflammatoire'] },
  
  // ── PHÉNOLS COMPLEXES ───────────────────────────────────────────────────────
  { name: 'Thymol', props: ['antibactérien puissant', 'antifongique', 'antiseptique', 'antioxydant', 'antiparasitaire'] },
  { name: 'Carvacrol', props: ['antibactérien puissant', 'antifongique', 'anti-inflammatoire', 'antioxydant', 'antiparasitaire'] },
  { name: 'Eugenol methyl ether', props: ['antibactérien', 'antifongique', 'anesthésique local', 'anti-inflammatoire'] },
  { name: 'Isoeugenol', props: ['antibactérien', 'antifongique', 'anti-inflammatoire', 'antioxydant'] },
  { name: 'Chavicol', props: ['antibactérien', 'antifongique', 'anti-inflammatoire'] },
  { name: 'Methyl eugenol', props: ['antibactérien', 'antifongique', 'sédatif', 'anesthésique'] },
  { name: 'Anethole', props: ['antispasmodique', 'expectorant', 'antibactérien', 'oestrogénique', 'anti-inflammatoire'] },
  { name: 'Estragole', props: ['antispasmodique', 'antibactérien', 'anti-inflammatoire'] },
  { name: 'Safrole', props: ['anesthésique local', 'antibactérien', 'antifongique'] },
  { name: 'Apiole', props: ['emménagogue', 'diurétique', 'antibactérien'] },
  { name: 'Dillapiole', props: ['insectifuge', 'antibactérien', 'antifongique'] },
  { name: 'Elemicin', props: ['antibactérien', 'antifongique', 'anti-inflammatoire'] },
  { name: 'Myristicin', props: ['antibactérien', 'antifongique', 'psychoactif (haute dose)', 'anti-inflammatoire'] },
  
  // ── SESQUITERPÈNES OXYGÉNÉS ─────────────────────────────────────────────────
  { name: 'Spathulenol', props: ['anti-inflammatoire', 'antibactérien', 'antifongique', 'antioxydant'] },
  { name: 'Globulol', props: ['antibactérien', 'antifongique', 'anti-inflammatoire'] },
  { name: 'Viridiflorol', props: ['antibactérien', 'antifongique', 'anti-inflammatoire'] },
  { name: 'Ledol', props: ['antibactérien', 'antifongique', 'anti-inflammatoire'] },
  { name: 'Aromadendrene', props: ['antibactérien', 'antifongique', 'anti-inflammatoire'] },
  { name: 'Alloaromadendrene', props: ['antibactérien', 'antifongique', 'anti-inflammatoire'] },
  { name: 'Cubebol', props: ['antibactérien', 'antifongique', 'anti-inflammatoire'] },
  { name: 'Elemol', props: ['antibactérien', 'antifongique', 'anti-inflammatoire', 'sédatif'] },
  { name: 'Eudesmol', props: ['antibactérien', 'antifongique', 'anti-inflammatoire', 'neuroprotecteur'] },
  { name: 'Bulnesol', props: ['antibactérien', 'antifongique', 'anti-inflammatoire'] },
  { name: 'Pogostol', props: ['antibactérien', 'antifongique', 'anti-inflammatoire'] },
  
  // ── DITERPÈNES ──────────────────────────────────────────────────────────────
  { name: 'Phytol', props: ['antioxydant', 'anti-inflammatoire', 'immunomodulateur', 'sédatif'] },
  { name: 'Geranylgeraniol', props: ['antioxydant', 'anti-inflammatoire', 'anticancéreux (études)'] },
  { name: 'Sclareol', props: ['antibactérien', 'antifongique', 'anti-inflammatoire', 'oestrogénique'] },
  { name: 'Labdanol', props: ['antibactérien', 'antifongique', 'anti-inflammatoire'] },
  { name: 'Manool', props: ['antibactérien', 'antifongique', 'anti-inflammatoire', 'cytotoxique'] },
  { name: 'Abietol', props: ['antibactérien', 'antifongique', 'anti-inflammatoire'] },
  { name: 'Ferruginol', props: ['antibactérien', 'antifongique', 'anti-inflammatoire', 'cytotoxique'] },
  { name: 'Totarol', props: ['antibactérien puissant', 'antifongique', 'anti-inflammatoire'] },
  
  // ── TRITERPÈNES / SAPONINES ─────────────────────────────────────────────────
  { name: 'Betulin', props: ['anti-inflammatoire', 'antiviral', 'anticancéreux (études)', 'hépatoprotecteur'] },
  { name: 'Betulinic acid', props: ['anticancéreux', 'anti-inflammatoire', 'antiviral', 'antibactérien'] },
  { name: 'Lupeol', props: ['anti-inflammatoire', 'anticancéreux (études)', 'antiparasitaire', 'antioxydant'] },
  { name: 'Oleanolic acid', props: ['anti-inflammatoire', 'hépatoprotecteur', 'antiviral', 'antioxydant'] },
  { name: 'Ursolic acid', props: ['anti-inflammatoire', 'anticancéreux (études)', 'antiviral', 'antioxydant'] },
  { name: 'Maslinic acid', props: ['anti-inflammatoire', 'antioxydant', 'hépatoprotecteur'] },
  { name: 'Boswellic acid', props: ['anti-inflammatoire puissant', 'antiarthritique', 'immunomodulateur', 'anticancéreux (études)'] },
  { name: 'Glycyrrhizin', props: ['anti-inflammatoire', 'antiviral', 'hépatoprotecteur', 'expectorant', 'immunomodulateur'] },
  { name: 'Ginsenoside', props: ['adaptogène', 'immunomodulateur', 'anticancéreux (études)', 'neuroprotecteur'] },
  
  // ── ALCALOÏDES SPÉCIAUX ─────────────────────────────────────────────────────
  { name: 'Harmine', props: ['psychoactif', 'antidépresseur (IMAO)', 'antiparasitaire', 'anticancéreux (études)'] },
  { name: 'Harmaline', props: ['psychoactif', 'antidépresseur (IMAO)', 'antiparasitaire', 'neuroprotecteur'] },
  { name: 'Tetrahydroharmine', props: ['psychoactif', 'sérotoninergique', 'neuroprotecteur'] },
  { name: 'Ibogaine', props: ['psychoactif', 'anti-addictif (études)', 'analgésique'] },
  { name: 'Mescaline', props: ['psychoactif', 'hallucinogène', 'anti-inflammatoire (études)'] },
  { name: 'Psilocybin', props: ['psychoactif', 'antidépresseur (études)', 'anxiolytique (études)', 'anti-addictif (études)'] },
  { name: 'Capsaicin', props: ['analgésique', 'anti-inflammatoire', 'thermogénique', 'antimicrobien', 'anticancéreux (études)'] },
  { name: 'Piperine', props: ['anti-inflammatoire', 'antioxydant', 'biodisponibilité augmentée', 'antibactérien', 'antifongique'] },
  { name: 'Berberine', props: ['antibactérien', 'antifongique', 'anti-inflammatoire', 'hypoglycémiant', 'anticancéreux (études)'] },
  { name: 'Colchicine', props: ['anti-inflammatoire', 'antigouteux', 'antimitotique'] },
  
  // ── ACIDES PHÉNOLIQUES ──────────────────────────────────────────────────────
  { name: 'Gallic acid', props: ['antioxydant puissant', 'antibactérien', 'antifongique', 'anticancéreux (études)', 'anti-inflammatoire'] },
  { name: 'Ellagic acid', props: ['antioxydant', 'anticancéreux (études)', 'anti-inflammatoire', 'antibactérien'] },
  { name: 'Protocatechuic acid', props: ['antioxydant', 'anti-inflammatoire', 'antibactérien', 'neuroprotecteur'] },
  { name: 'Syringic acid', props: ['antioxydant', 'anti-inflammatoire', 'antibactérien', 'hépatoprotecteur'] },
  { name: 'Vanillic acid', props: ['antioxydant', 'anti-inflammatoire', 'antibactérien', 'neuroprotecteur'] },
  { name: 'Homovanillic acid', props: ['antioxydant', 'anti-inflammatoire', 'neuroprotecteur'] },
  { name: 'Sinapic acid', props: ['antioxydant', 'anti-inflammatoire', 'neuroprotecteur', 'antibactérien'] },
  { name: 'Ferulic acid', props: ['antioxydant', 'anti-inflammatoire', 'antibactérien', 'neuroprotecteur', 'photoprotecteur'] },
  { name: 'p-Coumaric acid', props: ['antioxydant', 'anti-inflammatoire', 'antibactérien', 'anticancéreux (études)'] },
  { name: 'Caffeic acid', props: ['antioxydant puissant', 'anti-inflammatoire', 'antibactérien', 'antiviral', 'anticancéreux (études)'] },
  { name: 'Chlorogenic acid', props: ['antioxydant', 'anti-inflammatoire', 'hypoglycémiant', 'antibactérien', 'neuroprotecteur'] },
  { name: 'Rosmarinic acid', props: ['antioxydant puissant', 'anti-inflammatoire', 'antibactérien', 'antiviral', 'neuroprotecteur'] },
];

let updated = 0;
let notFound = 0;
let alreadyHas = 0;

for (const { name, props } of therapeuticData) {
  // Vérifier si la molécule existe et n'a pas encore de propriétés
  const [rows] = await conn.execute(
    'SELECT id, name, therapeuticProperties FROM molecules WHERE name = ? LIMIT 1',
    [name]
  );
  
  if (rows.length === 0) {
    // Essayer avec LIKE
    const [rows2] = await conn.execute(
      'SELECT id, name, therapeuticProperties FROM molecules WHERE name LIKE ? LIMIT 1',
      [`%${name}%`]
    );
    if (rows2.length === 0) {
      notFound++;
      continue;
    }
    const mol = rows2[0];
    if (mol.therapeuticProperties && mol.therapeuticProperties !== '[]' && mol.therapeuticProperties !== '') {
      alreadyHas++;
      continue;
    }
    await conn.execute(
      'UPDATE molecules SET therapeuticProperties = ? WHERE id = ?',
      [JSON.stringify(props), mol.id]
    );
    console.log(`  ✓ ${mol.name} (via LIKE)`);
    updated++;
    continue;
  }
  
  const mol = rows[0];
  if (mol.therapeuticProperties && mol.therapeuticProperties !== '[]' && mol.therapeuticProperties !== '') {
    alreadyHas++;
    continue;
  }
  
  await conn.execute(
    'UPDATE molecules SET therapeuticProperties = ? WHERE id = ?',
    [JSON.stringify(props), mol.id]
  );
  console.log(`  ✓ ${mol.name}`);
  updated++;
}

// Résultat final
const [[{total, withTherapeutic}]] = await conn.execute(`
  SELECT COUNT(*) as total, 
         SUM(CASE WHEN therapeuticProperties IS NOT NULL AND therapeuticProperties != '[]' AND therapeuticProperties != '' THEN 1 ELSE 0 END) as withTherapeutic
  FROM molecules
`);

console.log(`\n✅ Batch 7 terminé:`);
console.log(`   Enrichies: ${updated}`);
console.log(`   Déjà enrichies: ${alreadyHas}`);
console.log(`   Non trouvées: ${notFound}`);
console.log(`\n📊 Couverture finale: ${withTherapeutic}/${total} (${(withTherapeutic/total*100).toFixed(1)}%)`);

await conn.end();
