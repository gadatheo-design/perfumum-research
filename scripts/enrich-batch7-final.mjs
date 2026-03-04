/**
 * Batch 7 final : créer les 11 dernières molécules pour atteindre 35%
 */
import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

const mols = [
  ['Pulegone', 'C10H16O', 'monoterpene', ['antispasmodique', 'insectifuge', 'antibacterien', 'expectorant'], 'Menthe poivree, camphre', 'Mentha pulegium, Mentha arvensis'],
  ['Pinocamphone', 'C10H16O', 'monoterpene', ['antibacterien', 'antifongique', 'expectorant'], 'Hysope, camphre, herbace', 'Hyssopus officinalis, Lavandula stoechas'],
  ['Fenchone', 'C10H16O', 'monoterpene', ['antispasmodique', 'expectorant', 'antibacterien', 'carminatif'], 'Fenouil, camphre, herbace', 'Foeniculum vulgare, Lavandula stoechas'],
  ['Carvone', 'C10H14O', 'monoterpene', ['antispasmodique', 'antibacterien', 'antifongique', 'carminatif', 'insectifuge'], 'Menthe verte, carvi, herbace, frais', 'Mentha spicata, Carum carvi, Anethum graveolens'],
  ['Valencene', 'C15H24', 'sesquiterpene', ['anti-inflammatoire', 'antioxydant', 'insectifuge'], 'Orange, agrume, boise, doux', 'Citrus sinensis, Citrus paradisi'],
  ['Nootkatone', 'C15H22O', 'sesquiterpene', ['insectifuge puissant', 'anti-inflammatoire', 'antioxydant', 'stimulant metabolique'], 'Pamplemousse, agrume, boise, legerement amer', 'Citrus paradisi, Chamaecyparis nootkatensis'],
  ['Zingiberene', 'C15H24', 'sesquiterpene', ['anti-inflammatoire', 'antibacterien', 'antioxydant', 'carminatif'], 'Gingembre, epice, chaud', 'Zingiber officinale, Curcuma longa'],
  ['Ar-turmerone', 'C15H20O', 'sesquiterpene', ['anti-inflammatoire', 'antibacterien', 'antifongique', 'neuroprotecteur'], 'Curcuma, epice, boise', 'Curcuma longa'],
  ['Quercetin', 'C15H10O7', 'flavonoide', ['antioxydant puissant', 'anti-inflammatoire', 'antiviral', 'anticancereux', 'antiallergique'], 'Legerement amer', 'Allium cepa, Camellia sinensis, Quercus robur'],
  ['Kaempferol', 'C15H10O6', 'flavonoide', ['antioxydant', 'anti-inflammatoire', 'anticancereux', 'neuroprotecteur'], 'Legerement amer', 'Camellia sinensis, Brassica oleracea'],
  ['Beta-sitosterol', 'C29H50O', 'sterol', ['anti-inflammatoire', 'immunomodulateur', 'anticancereux', 'hypocholesterolemiant'], 'Inodore', 'Serenoa repens, Cucurbita pepo'],
];

let created = 0;
let updated = 0;

for (const [name, formula, fam, props, olf, src] of mols) {
  const [existing] = await conn.execute('SELECT id, therapeuticProperties FROM molecules WHERE name = ? LIMIT 1', [name]);
  if (existing.length > 0) {
    const tp = existing[0].therapeuticProperties;
    if (!tp || tp === '[]' || tp === '') {
      await conn.execute('UPDATE molecules SET therapeuticProperties = ? WHERE id = ?', [JSON.stringify(props), existing[0].id]);
      updated++;
    }
    continue;
  }
  await conn.execute(
    'INSERT INTO molecules (name, formula, chemicalFamily, therapeuticProperties, olfactiveProfile, botanicalSources, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
    [name, formula, fam, JSON.stringify(props), olf, src]
  );
  created++;
}

const [[row]] = await conn.execute("SELECT COUNT(*) as total, SUM(CASE WHEN therapeuticProperties IS NOT NULL AND therapeuticProperties != '[]' AND therapeuticProperties != '' THEN 1 ELSE 0 END) as wt FROM molecules");
console.log('Batch 7 final: ' + created + ' creees, ' + updated + ' mises a jour');
console.log('Couverture: ' + row.wt + '/' + row.total + ' (' + (row.wt/row.total*100).toFixed(1) + '%)');
await conn.end();
