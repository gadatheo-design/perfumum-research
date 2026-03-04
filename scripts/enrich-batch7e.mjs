/**
 * Batch 7e : 12 dernières molécules pour atteindre 35%
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const toCreate = [
  { name: 'Pulegone', chemicalFamily: 'monoterpene', formula: 'C10H16O', therapeuticProperties: JSON.stringify(['antispasmodique', 'insectifuge', 'antibacterien', 'expectorant']), olfactiveProfile: 'Menthe poivree, camphre, herbace', botanicalSources: 'Mentha pulegium, Mentha arvensis' },
  { name: 'Pinocamphone', chemicalFamily: 'monoterpene', formula: 'C10H16O', therapeuticProperties: JSON.stringify(['antibacterien', 'antifongique', 'expectorant']), olfactiveProfile: 'Hysope, camphre, herbace', botanicalSources: 'Hyssopus officinalis, Lavandula stoechas' },
  { name: 'Fenchone', chemicalFamily: 'monoterpene', formula: 'C10H16O', therapeuticProperties: JSON.stringify(['antispasmodique', 'expectorant', 'antibacterien', 'carminatif']), olfactiveProfile: 'Fenouil, camphre, herbace', botanicalSources: 'Foeniculum vulgare, Lavandula stoechas' },
  { name: 'Carvone', chemicalFamily: 'monoterpene', formula: 'C10H14O', therapeuticProperties: JSON.stringify(['antispasmodique', 'antibacterien', 'antifongique', 'carminatif', 'insectifuge']), olfactiveProfile: 'Menthe verte, carvi, herbace, frais', botanicalSources: 'Mentha spicata, Carum carvi, Anethum graveolens' },
  { name: 'Valencene', chemicalFamily: 'sesquiterpene', formula: 'C15H24', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'antioxydant', 'insectifuge']), olfactiveProfile: 'Orange, agrume, boise, doux', botanicalSources: 'Citrus sinensis, Citrus paradisi' },
  { name: 'Nootkatone', chemicalFamily: 'sesquiterpene', formula: 'C15H22O', therapeuticProperties: JSON.stringify(['insectifuge puissant', 'anti-inflammatoire', 'antioxydant', 'stimulant metabolique']), olfactiveProfile: 'Pamplemousse, agrume, boise, legerement amer', botanicalSources: 'Citrus paradisi, Chamaecyparis nootkatensis' },
  { name: 'Zingiberene', chemicalFamily: 'sesquiterpene', formula: 'C15H24', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'antibacterien', 'antioxydant', 'carminatif']), olfactiveProfile: 'Gingembre, epice, chaud', botanicalSources: 'Zingiber officinale, Curcuma longa' },
  { name: 'Ar-turmerone', chemicalFamily: 'sesquiterpene', formula: 'C15H20O', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'antibacterien', 'antifongique', 'neuroprotecteur']), olfactiveProfile: 'Curcuma, epice, boise', botanicalSources: 'Curcuma longa' },
  { name: 'Quercetin', chemicalFamily: 'flavonoide', formula: 'C15H10O7', therapeuticProperties: JSON.stringify(['antioxydant puissant', 'anti-inflammatoire', 'antiviral', 'anticancereux etudes', 'antiallergique']), olfactiveProfile: 'Legerement amer', botanicalSources: 'Allium cepa, Camellia sinensis, Quercus robur' },
  { name: 'Kaempferol', chemicalFamily: 'flavonoide', formula: 'C15H10O6', therapeuticProperties: JSON.stringify(['antioxydant', 'anti-inflammatoire', 'anticancereux etudes', 'neuroprotecteur']), olfactiveProfile: 'Legerement amer', botanicalSources: 'Camellia sinensis, Brassica oleracea' },
  { name: 'Apigenin', chemicalFamily: 'flavonoide', formula: 'C15H10O5', therapeuticProperties: JSON.stringify(['anxiolytique', 'anti-inflammatoire', 'antioxydant', 'anticancereux etudes']), olfactiveProfile: 'Legerement amer', botanicalSources: 'Matricaria chamomilla, Petroselinum crispum' },
  { name: 'Catechin', chemicalFamily: 'flavonoide', formula: 'C15H14O6', therapeuticProperties: JSON.stringify(['antioxydant puissant', 'anti-inflammatoire', 'antibacterien', 'anticancereux etudes']), olfactiveProfile: 'Legerement amer, astringent', botanicalSources: 'Camellia sinensis, Theobroma cacao, Vitis vinifera' },
  { name: 'Beta-sitosterol', chemicalFamily: 'sterol', formula: 'C29H50O', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'immunomodulateur', 'anticancereux etudes', 'hypocholesterolemiant']), olfactiveProfile: 'Inodore', botanicalSources: 'Serenoa repens, Cucurbita pepo' },
];

let created = 0;
let skipped = 0;

for (const mol of toCreate) {
  const [existing] = await conn.execute('SELECT id, therapeuticProperties FROM molecules WHERE name = ? LIMIT 1', [mol.name]);
  if (existing.length > 0) {
    const tp = existing[0].therapeuticProperties;
    if (!tp || tp === '[]' || tp === '') {
      await conn.execute('UPDATE molecules SET therapeuticProperties = ? WHERE id = ?', [mol.therapeuticProperties, existing[0].id]);
      console.log('  up: ' + mol.name);
      created++;
    } else {
      skipped++;
    }
    continue;
  }
  await conn.execute(
    'INSERT INTO molecules (name, formula, chemicalFamily, therapeuticProperties, olfactiveProfile, botanicalSources, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
    [mol.name, mol.formula, mol.chemicalFamily, mol.therapeuticProperties, mol.olfactiveProfile, mol.botanicalSources]
  );
  console.log('  new: ' + mol.name);
  created++;
}

const [[{total, withTherapeutic}]] = await conn.execute("SELECT COUNT(*) as total, SUM(CASE WHEN therapeuticProperties IS NOT NULL AND therapeuticProperties != '[]' AND therapeuticProperties != '' THEN 1 ELSE 0 END) as withTherapeutic FROM molecules");
console.log('Batch 7e: ' + created + ' creees, ' + skipped + ' deja enrichies');
console.log('Couverture: ' + withTherapeutic + '/' + total + ' (' + (withTherapeutic/total*100).toFixed(1) + '%)');
await conn.end();
