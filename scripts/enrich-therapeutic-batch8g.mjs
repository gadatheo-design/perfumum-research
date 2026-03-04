import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

const molecules = [
  ['Eudesmol alpha','C15H26O','sesquiterpene alcool',['antibacterien','antifongique','anti-inflammatoire'],'Boisé, terreux, doux','Eucalyptus spp., Atractylodes macrocephala'],
  ['Eudesmol beta','C15H26O','sesquiterpene alcool',['antibacterien','antifongique'],'Boisé, terreux','Eucalyptus spp.'],
  ['Spathulenol','C15H24O','sesquiterpene alcool',['antibacterien','antifongique','anti-inflammatoire'],'Boisé, terreux, légèrement floral','Salvia spp., Eucalyptus spp.'],
  ['Globulol','C15H26O','sesquiterpene alcool',['antibacterien','antifongique'],'Boisé, terreux','Eucalyptus globulus'],
  ['Viridiflorol','C15H26O','sesquiterpene alcool',['antibacterien','antifongique','anti-inflammatoire'],'Boisé, herbacé','Melaleuca viridiflora, Eucalyptus spp.'],
  ['Ledol','C15H26O','sesquiterpene alcool',['antibacterien','antifongique','expectorant'],'Herbacé, terreux, légèrement camphré','Ledum palustre, Rhododendron spp.'],
  ['Elemol','C15H26O','sesquiterpene alcool',['antibacterien','antifongique','anti-inflammatoire'],'Boisé, floral, terreux','Canarium luzonicum, Boswellia spp.'],
  ['Saussurea lactone','C15H20O2','sesquiterpene lactone',['anti-inflammatoire','antibacterien','antiparasitaire'],'Terreux, amer','Saussurea costus'],
  ['Costunolide','C15H20O2','sesquiterpene lactone',['anti-inflammatoire','anticancereux','antibacterien'],'Terreux, amer, épicé','Saussurea costus, Inula helenium'],
  ['Alantolactone','C15H20O2','sesquiterpene lactone',['antiparasitaire','antibacterien','anti-inflammatoire'],'Terreux, amer','Inula helenium'],
  ['Isoalantolactone','C15H20O2','sesquiterpene lactone',['antiparasitaire','antibacterien'],'Terreux','Inula helenium'],
  ['Dehydrocostus lactone','C15H18O2','sesquiterpene lactone',['anti-inflammatoire','anticancereux','antibacterien'],'Terreux, amer','Saussurea costus, Laurus nobilis'],
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
