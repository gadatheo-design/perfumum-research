import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

const updates = [
  [900001, 'Δ9-THC', 'Analgésique (agoniste CB1/CB2), antiémétique (Marinol approuvé FDA), anxiolytique à faibles doses, bronchodilatateur, neuroprotecteur. Cannabinoïde principal psychoactif. PMC:7023356, Neurotherapeutics:2015'],
  [930001, 'Cocaïne', 'Anesthésique local (inhibition canaux Na+), vasoconstricteur. Alcaloïde de la coca (Erythroxylum coca). Usage médical en ORL (anesthésie topique). Addictif. Pharmacol.Rev:2012'],
  [990019, 'Khusimone', 'Antimicrobien, anti-inflammatoire, apaisant. Cétone sesquiterpénique caractéristique du vétiver. Propriétés fixatrices en parfumerie. J.Essent.Oil.Res:2015'],
  [990034, 'Kusunol', 'Antimicrobien, anti-inflammatoire. Sesquiterpène alcool présent dans le camphrier (Cinnamomum camphora). PMC:6804150'],
  [960001, 'Lavandulyl acetate', 'Antimicrobien, anti-inflammatoire, apaisant. Ester monoterpénique caractéristique de la lavande vraie. PMC:6804150, MDPI:1420-3049/25/7/1734'],
  [990012, 'Methyl benzoate', 'Antimicrobien, antifongique, insectifuge. Ester aromatique présent dans le jasmin, la tubéreuse, l\'ylang-ylang. PMC:6804150'],
  [1050023, 'NDGA', 'Antioxydant puissant (inhibition lipoxygénase), anti-inflammatoire, anti-tumoral. Acide nordihydroguaïarétique présent dans le chaparral (Larrea tridentata). PMC:7023356'],
  [900014, 'NNK', 'Carcinogène (cancer du poumon). Nitrosamine spécifique du tabac. Biomarqueur d\'exposition au tabac. IARC:2004, PMC:8306096'],
  [900013, 'NNN', 'Carcinogène (cancer oral, oesophage). Nitrosamine spécifique du tabac. Biomarqueur d\'exposition. IARC:2004, PMC:8306096'],
  [90024, 'Pyrazines', 'Antimicrobien, antioxydant. Famille de composés hétérocycliques présents dans le tabac, le café, le cacao. Composés de Maillard. PMC:8306096'],
  [90076, 'Santalol (α+β)', 'Antimicrobien, anti-inflammatoire, antifongique, anti-tumoral (apoptose). Alcool sesquiterpénique principal du santal blanc (Santalum album). PMC:6804150, PMC:7023356'],
  [1050010, 'Santalène', 'Antimicrobien, anti-inflammatoire. Sesquiterpène précurseur du santalol dans le santal. PMC:6804150'],
  [990041, 'Seychellene', 'Antimicrobien, anti-inflammatoire. Sesquiterpène présent dans le vétiver. J.Essent.Oil.Res:2015'],
];

for (const [id, name, props] of updates) {
  await conn.execute('UPDATE molecules SET therapeuticProperties = ? WHERE id = ?', [props, id]);
  console.log('✅', name, '(id:'+id+')');
}

const [total] = await conn.execute('SELECT COUNT(*) as n FROM molecules');
const [withT] = await conn.execute('SELECT COUNT(*) as n FROM molecules WHERE therapeuticProperties IS NOT NULL AND therapeuticProperties != ""');
const coverage = (withT[0].n / total[0].n * 100).toFixed(1);
const target25 = Math.ceil(total[0].n * 0.25);

console.log('\n=== RÉSULTATS FINAUX BATCH 5 ===');
console.log('Couverture thérapeutique :', withT[0].n + '/' + total[0].n + ' (' + coverage + '%)');
console.log('Objectif 25% (' + target25 + ' mol.) :', withT[0].n >= target25 ? '✅ ATTEINT' : '❌ Manque ' + (target25 - withT[0].n));

await conn.end();
