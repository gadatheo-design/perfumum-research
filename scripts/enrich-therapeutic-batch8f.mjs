import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Besoin de ~12 molécules pour atteindre 40% (748/1869)
const molecules = [
  ['Linalool oxide','C10H18O2','oxyde monoterpenique',['antibacterien','antifongique','sedatif'],'Floral, herbacé, légèrement terreux','Lavandula spp., Coriandrum sativum, Hops'],
  ['Rose oxide','C10H18O','oxyde monoterpenique',['antibacterien','antifongique'],'Rose, géranium, litchi, frais','Rosa damascena, Pelargonium graveolens'],
  ['Caryophyllene oxide','C15H24O','oxyde sesquiterpenique',['antibacterien','antifongique','anti-inflammatoire','insectifuge'],'Boisé, épicé, terreux','Cannabis sativa, Syzygium aromaticum, Piper nigrum'],
  ['Humulene epoxide','C15H24O','oxyde sesquiterpenique',['antibacterien','antifongique','anti-inflammatoire'],'Boisé, herbacé','Humulus lupulus, Cannabis sativa'],
  ['Bisabolol oxide A','C15H26O2','oxyde sesquiterpenique',['anti-inflammatoire','antibacterien','cicatrisant'],'Floral, doux, légèrement camphré','Matricaria chamomilla, Candeia spp.'],
  ['Ascaridole','C10H16O2','peroxyde monoterpenique',['antiparasitaire','antibacterien','antifongique'],'Camphré, herbacé, épicé','Chenopodium ambrosioides, Boldo'],
  ['Thymoquinone','C10H12O2','quinone monoterpenique',['antibacterien','antifongique','anti-inflammatoire','anticancereux','immunostimulant'],'Herbacé, épicé, légèrement amer','Nigella sativa'],
  ['Carvone oxide','C10H14O2','oxyde monoterpenique',['antibacterien','antifongique'],'Menthe, herbacé','Mentha spicata, Carum carvi'],
  ['Pinocarvone','C10H14O','cetone monoterpenique',['antibacterien','antifongique'],'Pin, herbacé, frais','Pinus spp., Eucalyptus spp.'],
  ['Myrtenol','C10H16O','alcool monoterpenique',['antibacterien','antifongique','anti-inflammatoire'],'Myrte, frais, herbacé','Myrtus communis, Pinus spp.'],
  ['Pinocarveol','C10H16O','alcool monoterpenique',['antibacterien','antifongique'],'Pin, herbacé, frais','Pinus spp., Eucalyptus spp.'],
  ['Isopinocarveol','C10H16O','alcool monoterpenique',['antibacterien','antifongique'],'Pin, herbacé','Pinus spp.'],
  ['Thujopsene','C15H24','sesquiterpene',['antibacterien','antifongique','insectifuge'],'Boisé, cèdre, terreux','Thujopsis dolabrata, Chamaecyparis obtusa'],
  ['Khusimol','C15H26O','sesquiterpene alcool',['antibacterien','antifongique','fixateur'],'Vétiver, terreux, fumé','Vetiveria zizanioides'],
  ['Zizaene','C15H24','sesquiterpene',['antibacterien','antifongique'],'Vétiver, terreux','Vetiveria zizanioides'],
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
