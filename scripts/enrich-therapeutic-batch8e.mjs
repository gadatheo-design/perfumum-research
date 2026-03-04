import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

const molecules = [
  ['Geranyl acetate','C12H20O2','ester monoterpenique',['antibacterien','antifongique','anti-inflammatoire'],'Rose, géranium, fruité','Pelargonium graveolens, Rosa spp., Cymbopogon martinii'],
  ['Neryl acetate','C12H20O2','ester monoterpenique',['antibacterien','antifongique'],'Rose, citronné, doux','Rosa spp., Citrus aurantium'],
  ['Citronellyl acetate','C12H22O2','ester monoterpenique',['antibacterien','antifongique','insectifuge'],'Rose, citronné, fruité','Pelargonium graveolens, Cymbopogon nardus'],
  ['Citronellal','C10H18O','aldehyde monoterpenique',['antibacterien','antifongique','insectifuge','sedatif'],'Citronelle, citronné, frais','Cymbopogon nardus, Eucalyptus citriodora'],
  ['Neral','C10H16O','aldehyde monoterpenique',['antibacterien','antifongique','anti-inflammatoire'],'Citron, frais, herbacé','Cymbopogon citratus, Melissa officinalis'],
  ['Geranial','C10H16O','aldehyde monoterpenique',['antibacterien','antifongique','anti-inflammatoire'],'Citron intense, frais','Cymbopogon citratus, Litsea cubeba'],
  ['Perillaldehyde','C10H14O','aldehyde monoterpenique',['antibacterien','antifongique','antioxydant'],'Cumin, herbacé, épicé','Perilla frutescens, Cuminum cyminum'],
  ['Piperitone','C10H16O','cetone monoterpenique',['antibacterien','antifongique','expectorant'],'Menthe, herbacé, frais','Mentha piperita, Eucalyptus dives'],
  ['Pulegone','C10H16O','cetone monoterpenique',['antibacterien','antifongique','insectifuge'],'Menthe poivrée, herbacé','Mentha pulegium, Hedeoma pulegioides'],
  ['Isomenthone','C10H18O','cetone monoterpenique',['antibacterien','antifongique'],'Menthe, herbacé','Mentha piperita, Pelargonium graveolens'],
  ['Dihydrocarvone','C10H16O','cetone monoterpenique',['antibacterien','antifongique'],'Menthe, herbacé, fruité','Mentha spicata, Carum carvi'],
  ['Verbenone','C10H14O','cetone monoterpenique',['antibacterien','antifongique','mucolytique'],'Romarin, camphreux, herbacé','Verbena officinalis, Rosmarinus officinalis'],
  ['Myrtenal','C10H14O','aldehyde monoterpenique',['antibacterien','antifongique'],'Myrte, frais, herbacé','Myrtus communis'],
  ['Sabinene hydrate','C10H18O','alcool monoterpenique',['antibacterien','antifongique','anti-inflammatoire'],'Herbacé, épicé, poivré','Origanum vulgare, Terpinen-4-ol sources'],
  ['Dihydrolinalool','C10H22O','alcool monoterpenique',['antibacterien','antifongique','sedatif'],'Floral, doux, boisé','Coriandrum sativum, Lavandula spp.'],
  ['Lavandulol','C10H18O','alcool monoterpenique',['antibacterien','antifongique','sedatif'],'Lavande, herbacé, frais','Lavandula angustifolia, Lavandula latifolia'],
  ['Lavandulyl acetate','C12H20O2','ester monoterpenique',['antibacterien','antifongique','sedatif'],'Lavande, herbacé, fruité','Lavandula angustifolia'],
];

let created = 0;
let skipped = 0;

for (const [name, formula, family, tp, olf, src] of molecules) {
  const [ex] = await conn.execute('SELECT id FROM molecules WHERE name = ? LIMIT 1', [name]);
  if (ex.length > 0) { skipped++; continue; }
  await conn.execute(
    'INSERT INTO molecules (name, formula, chemicalFamily, therapeuticProperties, olfactiveProfile, botanicalSources, createdAt, updatedAt) VALUES (?,?,?,?,?,?,NOW(),NOW())',
    [name, formula, family, JSON.stringify(tp), olf, src]
  );
  created++;
}

console.log('Créées: ' + created + ' | Ignorées: ' + skipped);

const [[row]] = await conn.execute(
  "SELECT COUNT(*) as total, SUM(CASE WHEN therapeuticProperties IS NOT NULL AND therapeuticProperties != '[]' AND therapeuticProperties != '' THEN 1 ELSE 0 END) as wt FROM molecules"
);
console.log('Couverture thérapeutique: ' + row.wt + '/' + row.total + ' (' + (row.wt/row.total*100).toFixed(1) + '%)');

await conn.end();
