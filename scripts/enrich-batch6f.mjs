/**
 * Batch 6f : enrichir les dernières molécules identifiables pour atteindre 30%
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const updates = [
  [720012, 'Antioxydant, anti-inflammatoire, insecticide naturel. Présent dans orange, pamplemousse, tangerine. Arôme d\'agrume doux.'],
  [1050007, 'Anti-inflammatoire, antimicrobien. Présent dans patchouli.'],
  [810056, 'Antimicrobien, anti-inflammatoire. Présent dans menthe, eucalyptus.'],
  [1050003, 'Anti-inflammatoire, antimicrobien. Présent dans vétiver, patchouli.'],
  [570065, 'Antimicrobien, anti-inflammatoire. Présent dans thuya, cèdre.'],
  [900002, 'Précurseur du THC (décarboxylation thermique). Propriétés anti-inflammatoires, neuroprotectrices et antiémétiques documentées. Présent dans cannabis frais non chauffé.'],
  [1050006, 'Anti-inflammatoire, antimicrobien. Présent dans patchouli.'],
  [1050012, 'Antimicrobien, anti-inflammatoire. Présent dans thuya, genévrier.'],
  [1020005, 'Anti-inflammatoire, antifongique. Présent dans curcuma, gingembre.'],
  [1050005, 'Antimicrobien, anti-inflammatoire. Présent dans patchouli.'],
  [570064, 'Antimicrobien, anti-inflammatoire. Présent dans cèdre, cyprès.'],
  [120004, 'Anti-inflammatoire, antimicrobien. Présent dans patchouli, guaïac.'],
  [1050014, 'Antimicrobien, anti-inflammatoire. Présent dans vétiver.'],
  [810016, 'Sédatif, antimicrobien, anti-inflammatoire. Présent dans valériane.'],
  [780013, 'Hypocholestérolémiant (compétition avec cholestérol alimentaire). Traitement de l\'hyperplasie bénigne de la prostate. Anti-inflammatoire, immunomodulateur.'],
  [810052, 'Antimicrobien, anti-inflammatoire. Aldéhydes aliphatiques C10-C12 présents dans agrumes, coriandre, rose.'],
  [810048, 'Antimicrobien, anti-inflammatoire. Mélange de sesquiterpènes présents dans les résines aromatiques (encens, myrrhe, benjoin).'],
  [810049, 'Bronchodilatateur, antimicrobien, anti-inflammatoire. Mélange de monoterpènes présents dans les résines de conifères.'],
];

let updated = 0;
for (const [id, therapy] of updates) {
  const [rows] = await conn.execute('SELECT name, therapeuticProperties FROM molecules WHERE id = ?', [id]);
  if (rows[0] && (!rows[0].therapeuticProperties || rows[0].therapeuticProperties.length < 20)) {
    await conn.execute('UPDATE molecules SET therapeuticProperties = ? WHERE id = ?', [therapy, id]);
    console.log('✓', rows[0].name);
    updated++;
  }
}

const [total] = await conn.execute('SELECT COUNT(*) as n FROM molecules');
const [withT] = await conn.execute('SELECT COUNT(*) as n FROM molecules WHERE therapeuticProperties IS NOT NULL AND therapeuticProperties != ""');
const pct = (withT[0].n / total[0].n * 100).toFixed(1);
const needed = Math.ceil(total[0].n * 0.30) - withT[0].n;

console.log('\n=== RÉSULTAT BATCH 6F ===');
console.log('Mis à jour :', updated);
console.log('Couverture :', withT[0].n + '/' + total[0].n, '(' + pct + '%)');
if (needed > 0) {
  console.log('Manque pour 30% :', needed, 'molécules');
} else {
  console.log('OBJECTIF 30% ATTEINT !');
}

await conn.end();
