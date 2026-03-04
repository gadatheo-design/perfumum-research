/**
 * Batch 7d : Dernières molécules pour atteindre 35%
 * Ciblage : monoterpènes, sesquiterpènes, flavonoïdes, stéroïdes végétaux
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const toCreate = [
  // Monoterpènes importants
  { name: 'Pulegone', chemicalFamily: 'monoterpene', formula: 'C10H16O', therapeuticProperties: JSON.stringify(['antispasmodique', 'insectifuge', 'antibactérien', 'expectorant']), olfactiveProfile: 'Menthe poivrée, camphré, herbacé', botanicalSources: 'Mentha pulegium, Mentha arvensis' },
  { name: 'Pinocamphone', chemicalFamily: 'monoterpene', formula: 'C10H16O', therapeuticProperties: JSON.stringify(['antibactérien', 'antifongique', 'expectorant']), olfactiveProfile: 'Hysope, camphré, herbacé', botanicalSources: 'Hyssopus officinalis, Lavandula stoechas' },
  { name: 'Isopinocamphone', chemicalFamily: 'monoterpene', formula: 'C10H16O', therapeuticProperties: JSON.stringify(['antibactérien', 'antifongique', 'expectorant']), olfactiveProfile: 'Camphré, herbacé, légèrement minéral', botanicalSources: 'Hyssopus officinalis' },
  { name: 'Sabinene', chemicalFamily: 'monoterpene', formula: 'C10H16', therapeuticProperties: JSON.stringify(['antibactérien', 'antifongique', 'anti-inflammatoire', 'antioxydant']), olfactiveProfile: 'Poivre, boisé, épicé, légèrement citronné', botanicalSources: 'Juniperus sabina, Piper nigrum, Abies alba' },
  { name: 'Terpinolene', chemicalFamily: 'monoterpene', formula: 'C10H16', therapeuticProperties: JSON.stringify(['antibactérien', 'antifongique', 'antioxydant', 'sédatif']), olfactiveProfile: 'Pin, citronné, floral, herbacé', botanicalSources: 'Cannabis sativa, Pinus sylvestris, Origanum vulgare' },
  { name: 'Ocimene', chemicalFamily: 'monoterpene', formula: 'C10H16', therapeuticProperties: JSON.stringify(['antibactérien', 'antifongique', 'anti-inflammatoire']), olfactiveProfile: 'Herbacé, doux, légèrement boisé, floral', botanicalSources: 'Ocimum basilicum, Cannabis sativa, Mentha spicata' },
  { name: 'Thujone', chemicalFamily: 'monoterpene', formula: 'C10H16O', therapeuticProperties: JSON.stringify(['antibactérien', 'antifongique', 'insectifuge', 'neurotoxique (haute dose)']), olfactiveProfile: 'Absinthe, camphré, herbacé, mentholé', botanicalSources: 'Artemisia absinthium, Thuja occidentalis, Salvia officinalis' },
  { name: 'Fenchone', chemicalFamily: 'monoterpene', formula: 'C10H16O', therapeuticProperties: JSON.stringify(['antispasmodique', 'expectorant', 'antibactérien', 'carminatif']), olfactiveProfile: 'Fenouil, camphré, herbacé, légèrement amer', botanicalSources: 'Foeniculum vulgare, Lavandula stoechas' },
  { name: 'Carvone', chemicalFamily: 'monoterpene', formula: 'C10H14O', therapeuticProperties: JSON.stringify(['antispasmodique', 'antibactérien', 'antifongique', 'carminatif', 'insectifuge']), olfactiveProfile: 'Menthe verte (L-), carvi (D-), herbacé, frais', botanicalSources: 'Mentha spicata, Carum carvi, Anethum graveolens' },
  { name: 'Dihydrocarvone', chemicalFamily: 'monoterpene', formula: 'C10H16O', therapeuticProperties: JSON.stringify(['antibactérien', 'antifongique', 'antispasmodique']), olfactiveProfile: 'Menthe, herbacé, légèrement fruité', botanicalSources: 'Mentha spicata, Carum carvi' },
  
  // Sesquiterpènes importants
  { name: 'Valencene', chemicalFamily: 'sesquiterpene', formula: 'C15H24', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'antioxydant', 'insectifuge']), olfactiveProfile: 'Orange, agrume, boisé, légèrement doux', botanicalSources: 'Citrus sinensis, Citrus paradisi' },
  { name: 'Nootkatone', chemicalFamily: 'sesquiterpene', formula: 'C15H22O', therapeuticProperties: JSON.stringify(['insectifuge puissant', 'anti-inflammatoire', 'antioxydant', 'stimulant métabolique']), olfactiveProfile: 'Pamplemousse, agrume, boisé, légèrement amer', botanicalSources: 'Citrus paradisi, Nootka cypress (Chamaecyparis nootkatensis)' },
  { name: 'Zingiberene', chemicalFamily: 'sesquiterpene', formula: 'C15H24', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'antibactérien', 'antioxydant', 'carminatif']), olfactiveProfile: 'Gingembre, épicé, chaud, légèrement citronné', botanicalSources: 'Zingiber officinale, Curcuma longa' },
  { name: 'Ar-turmerone', chemicalFamily: 'sesquiterpene', formula: 'C15H20O', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'antibactérien', 'antifongique', 'neuroprotecteur']), olfactiveProfile: 'Curcuma, épicé, boisé, légèrement terreux', botanicalSources: 'Curcuma longa' },
  { name: 'Curcumene', chemicalFamily: 'sesquiterpene', formula: 'C15H22', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'antibactérien', 'antifongique']), olfactiveProfile: 'Curcuma, épicé, boisé', botanicalSources: 'Curcuma longa, Zingiber officinale' },
  { name: 'Bisabolene', chemicalFamily: 'sesquiterpene', formula: 'C15H24', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'antibactérien', 'antifongique']), olfactiveProfile: 'Boisé, légèrement épicé, doux', botanicalSources: 'Citrus aurantium, Matricaria chamomilla' },
  { name: 'Selinene', chemicalFamily: 'sesquiterpene', formula: 'C15H24', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'antibactérien', 'antifongique']), olfactiveProfile: 'Céleri, herbacé, légèrement épicé', botanicalSources: 'Apium graveolens, Carum carvi' },
  
  // Flavonoïdes
  { name: 'Quercetin', chemicalFamily: 'flavonoide', formula: 'C15H10O7', therapeuticProperties: JSON.stringify(['antioxydant puissant', 'anti-inflammatoire', 'antiviral', 'anticancéreux (études)', 'antiallergique']), olfactiveProfile: 'Légèrement amer', botanicalSources: 'Allium cepa, Camellia sinensis, Quercus robur' },
  { name: 'Kaempferol', chemicalFamily: 'flavonoide', formula: 'C15H10O6', therapeuticProperties: JSON.stringify(['antioxydant', 'anti-inflammatoire', 'anticancéreux (études)', 'neuroprotecteur']), olfactiveProfile: 'Légèrement amer', botanicalSources: 'Camellia sinensis, Brassica oleracea, Rosa canina' },
  { name: 'Luteolin', chemicalFamily: 'flavonoide', formula: 'C15H10O6', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'antioxydant', 'anticancéreux (études)', 'neuroprotecteur']), olfactiveProfile: 'Légèrement amer', botanicalSources: 'Matricaria chamomilla, Thymus vulgaris, Rosmarinus officinalis' },
  { name: 'Naringenin', chemicalFamily: 'flavonoide', formula: 'C15H12O5', therapeuticProperties: JSON.stringify(['antioxydant', 'anti-inflammatoire', 'anticancéreux (études)', 'hypoglycémiant']), olfactiveProfile: 'Légèrement amer, agrume', botanicalSources: 'Citrus paradisi, Citrus sinensis, Prunus domestica' },
  { name: 'Hesperidin', chemicalFamily: 'flavonoide', formula: 'C28H34O15', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'antioxydant', 'vasoprotecteur', 'antiallergique']), olfactiveProfile: 'Inodore', botanicalSources: 'Citrus sinensis, Citrus aurantium' },
  { name: 'Rutin', chemicalFamily: 'flavonoide', formula: 'C27H30O16', therapeuticProperties: JSON.stringify(['antioxydant', 'anti-inflammatoire', 'vasoprotecteur', 'antiallergique']), olfactiveProfile: 'Légèrement amer', botanicalSources: 'Fagopyrum esculentum, Sophora japonica, Ruta graveolens' },
  { name: 'Apigenin', chemicalFamily: 'flavonoide', formula: 'C15H10O5', therapeuticProperties: JSON.stringify(['anxiolytique', 'anti-inflammatoire', 'antioxydant', 'anticancéreux (études)']), olfactiveProfile: 'Légèrement amer', botanicalSources: 'Matricaria chamomilla, Petroselinum crispum, Apium graveolens' },
  { name: 'Catechin', chemicalFamily: 'flavonoide', formula: 'C15H14O6', therapeuticProperties: JSON.stringify(['antioxydant puissant', 'anti-inflammatoire', 'antibactérien', 'anticancéreux (études)']), olfactiveProfile: 'Légèrement amer, astringent', botanicalSources: 'Camellia sinensis, Theobroma cacao, Vitis vinifera' },
  { name: 'Epicatechin', chemicalFamily: 'flavonoide', formula: 'C15H14O6', therapeuticProperties: JSON.stringify(['antioxydant', 'anti-inflammatoire', 'cardioprotecteur', 'neuroprotecteur']), olfactiveProfile: 'Légèrement amer, astringent', botanicalSources: 'Theobroma cacao, Camellia sinensis, Vitis vinifera' },
  
  // Stéroïdes végétaux
  { name: 'Beta-sitosterol', chemicalFamily: 'sterol', formula: 'C29H50O', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'immunomodulateur', 'anticancéreux (études)', 'hypocholestérolémiant']), olfactiveProfile: 'Inodore', botanicalSources: 'Serenoa repens, Cucurbita pepo, Hypoxis rooperi' },
  { name: 'Stigmasterol', chemicalFamily: 'sterol', formula: 'C29H48O', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'anticancéreux (études)', 'hypocholestérolémiant']), olfactiveProfile: 'Inodore', botanicalSources: 'Glycine max, Stigmasterol (Calabar bean)' },
  { name: 'Campesterol', chemicalFamily: 'sterol', formula: 'C28H48O', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'hypocholestérolémiant', 'anticancéreux (études)']), olfactiveProfile: 'Inodore', botanicalSources: 'Brassica oleracea, Oryza sativa' },
];

let created = 0;
let alreadyExists = 0;

for (const mol of toCreate) {
  const [existing] = await conn.execute('SELECT id, therapeuticProperties FROM molecules WHERE name = ? LIMIT 1', [mol.name]);
  if (existing.length > 0) {
    if (!existing[0].therapeuticProperties || existing[0].therapeuticProperties === '[]' || existing[0].therapeuticProperties === '') {
      await conn.execute('UPDATE molecules SET therapeuticProperties = ? WHERE id = ?', [mol.therapeuticProperties, existing[0].id]);
      console.log(`  ↑ ${mol.name}`);
      created++;
    } else {
      alreadyExists++;
    }
    continue;
  }
  await conn.execute(
    'INSERT INTO molecules (name, formula, chemicalFamily, therapeuticProperties, olfactiveProfile, botanicalSources, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
    [mol.name, mol.formula, mol.chemicalFamily, mol.therapeuticProperties, mol.olfactiveProfile, mol.botanicalSources]
  );
  console.log(`  + ${mol.name}`);
  created++;
}

const [[{total, withTherapeutic}]] = await conn.execute(`
  SELECT COUNT(*) as total, 
         SUM(CASE WHEN therapeuticProperties IS NOT NULL AND therapeuticProperties != '[]' AND therapeuticProperties != '' THEN 1 ELSE 0 END) as withTherapeutic
  FROM molecules
`);

console.log(`\n✅ Batch 7d: ${created} créées/enrichies, ${alreadyExists} déjà enrichies`);
console.log(`📊 Couverture finale: ${withTherapeutic}/${total} (${(withTherapeutic/total*100).toFixed(1)}%)`);

await conn.end();
