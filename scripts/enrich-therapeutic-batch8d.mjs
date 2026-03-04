import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

const molecules = [
  ['Acide abscissique','C15H20O4','hormone vegetale',['regulateur croissance','antistress','anti-inflammatoire'],'Inodore','Ubiquitaire (plantes supérieures)'],
  ['Acide gibberellique','C19H22O6','diterpene acide',['hormone croissance','germination','floraison'],'Inodore','Gibberella fujikuroi, plantes supérieures'],
  ['Jasmonic acid','C12H18O3','jasmonate',['inducteur defense','anti-inflammatoire','antifongique'],'Jasmin, floral','Jasminum spp., plantes supérieures'],
  ['Salicylic acid','C7H6O3','acide phenolique',['anti-inflammatoire','analgesique','antipyretique','antibacterien'],'Légèrement phénolique','Salix alba, Filipendula ulmaria'],
  ['Methyl salicylate','C8H8O3','ester aromatique',['analgesique topique','anti-inflammatoire','rubefiant'],'Wintergreen, menthol','Gaultheria procumbens, Betula lenta'],
  ['Anethole','C10H12O','phenylpropanoide',['antispasmodique','expectorant','oestrogenique faible','antibacterien'],'Anis, fenouil, doux','Pimpinella anisum, Foeniculum vulgare, Illicium verum'],
  ['Methyl chavicol','C10H12O','phenylpropanoide',['antibacterien','antifongique','antispasmodique'],'Basilic, estragone','Ocimum basilicum, Artemisia dracunculus'],
  ['Safrole','C10H10O2','phenylpropanoide',['antibacterien','precurseur MDA (toxique)'],'Sassafras, épicé','Sassafras albidum, Cinnamomum parthenoxylon'],
  ['Apiole','C12H14O4','phenylpropanoide',['emmenagogue','diuretique','antibacterien'],'Persil, herbacé','Petroselinum crispum, Apium graveolens'],
  ['Elemicin','C12H16O3','phenylpropanoide',['hallucinogene leger','antibacterien'],'Muscade, épicé','Myristica fragrans, Canarium luzonicum'],
  ['Myristicin','C11H12O3','phenylpropanoide',['hallucinogene leger','antibacterien','insectifuge'],'Muscade, épicé','Myristica fragrans, Petroselinum crispum'],
  ['Asarone alpha','C12H16O3','phenylpropanoide',['sedatif','antibacterien','insectifuge'],'Calamus, épicé','Acorus calamus'],
  ['Cinnamaldehyde','C9H8O','aldehyde aromatique',['antibacterien','antifongique','anti-inflammatoire','antidiabetique'],'Cannelle, épicé, chaud','Cinnamomum verum, Cinnamomum cassia'],
  ['Cinnamyl alcohol','C9H10O','alcool aromatique',['antibacterien','antifongique','anti-inflammatoire'],'Cannelle, balsam','Cinnamomum verum, Styrax benzoin'],
  ['Benzaldehyde','C7H6O','aldehyde aromatique',['antibacterien','antifongique','anticancereux etudes','analgesique'],'Amande amère, cerise','Prunus amygdalus, Prunus cerasus'],
  ['Anisaldehyde','C8H8O2','aldehyde aromatique',['antibacterien','antifongique'],'Anis, floral, doux','Pimpinella anisum, Foeniculum vulgare'],
  ['Piperonal','C8H6O3','aldehyde aromatique',['antibacterien','antifongique'],'Héliotrope, vanille, floral','Heliotropium arborescens, Piper nigrum'],
  ['Vanillin','C8H8O3','aldehyde phenolique',['antioxydant','antibacterien','antifongique','analgesique'],'Vanille, doux, crémeux','Vanilla planifolia, Leptotes bicolor'],
  ['Coumarin','C9H6O2','coumarine',['anticoagulant','anti-inflammatoire','antibacterien','antifongique'],'Foin coupé, amande, doux','Dipteryx odorata, Melilotus officinalis, Anthoxanthum odoratum'],
  ['Osthole','C15H16O3','coumarine',['anti-inflammatoire','antibacterien','antifongique','osteoprotecteur'],'Herbacé, légèrement musqué','Cnidium monnieri, Angelica pubescens'],
  ['Imperatorin','C16H14O4','furanocoumarine',['photosensibilisant','antispasmodique','antibacterien'],'Inodore','Angelica dahurica, Peucedanum ostruthium'],
  ['Psoralen','C11H6O3','furanocoumarine',['photosensibilisant','antipsoriatique','antifongique'],'Inodore','Psoralea corylifolia, Citrus bergamia'],
  ['Xanthotoxin','C12H8O4','furanocoumarine',['photosensibilisant','antipsoriatique','antifongique'],'Inodore','Ammi majus, Angelica archangelica'],
  ['Herniarin','C10H8O3','coumarine',['antispasmodique','anti-inflammatoire','antibacterien'],'Foin, herbacé','Herniaria glabra, Matricaria chamomilla'],
  ['Umbelliferone','C9H6O3','coumarine',['antifongique','anti-inflammatoire','photoprotecteur'],'Inodore','Umbelliferae (nombreuses espèces)'],
  ['Daphnetin','C9H6O4','coumarine',['anti-inflammatoire','antibacterien','anticoagulant'],'Inodore','Daphne odora, Cichorium intybus'],
  ['Scopoletin','C10H8O4','coumarine',['anti-inflammatoire','antispasmodique','antibacterien'],'Inodore','Scopolia carniolica, Convolvulus scammonia'],
  ['Esculin','C15H16O9','coumarine',['venotonique','anti-inflammatoire','antioedemateux'],'Inodore','Aesculus hippocastanum'],
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

console.log('Créées: ' + created + ' | Ignorées (déjà en base): ' + skipped);

const [[row]] = await conn.execute(
  "SELECT COUNT(*) as total, SUM(CASE WHEN therapeuticProperties IS NOT NULL AND therapeuticProperties != '[]' AND therapeuticProperties != '' THEN 1 ELSE 0 END) as wt FROM molecules"
);
console.log('Couverture thérapeutique: ' + row.wt + '/' + row.total + ' (' + (row.wt/row.total*100).toFixed(1) + '%)');

await conn.end();
