/**
 * Batch 7c : Enrichir les molécules existantes identifiables + créer les manquantes
 * Objectif : 32.7% → 35%
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Enrichir les molécules identifiables existantes par ID
const idUpdates = [
  { id: 1260675, props: ['arôme torréfié', 'antibactérien', 'antioxydant'] },
  { id: 1110008, props: ['arôme torréfié', 'antibactérien', 'antioxydant'] },
  { id: 1260661, props: ['arôme torréfié', 'antibactérien'] },
  { id: 1110009, props: ['arôme torréfié', 'antibactérien'] },
  { id: 1260672, props: ['arôme torréfié', 'antibactérien'] },
  { id: 1260653, props: ['arôme riz cuit', 'antibactérien', 'antioxydant'] },
  { id: 1260273, props: ['arôme torréfié', 'antibactérien'] },
  { id: 1260020, props: ['arôme poivron vert', 'antibactérien', 'insectifuge'] },
  { id: 1260049, props: ['antibactérien', 'antifongique', 'antioxydant', 'anti-inflammatoire'] },
  { id: 1110014, props: ['antibactérien', 'antifongique', 'antioxydant'] },
  { id: 1260658, props: ['antibactérien', 'antioxydant', 'arôme beurre'] },
  { id: 570058, props: ['antibactérien', 'antifongique', 'anti-inflammatoire'] },
  { id: 990031, props: ['antibactérien', 'antifongique', 'anti-inflammatoire'] },
];

let updated = 0;
for (const { id, props } of idUpdates) {
  const [r] = await conn.execute(
    "UPDATE molecules SET therapeuticProperties = ? WHERE id = ? AND (therapeuticProperties IS NULL OR therapeuticProperties = '[]' OR therapeuticProperties = '')",
    [JSON.stringify(props), id]
  );
  if (r.affectedRows > 0) { updated++; }
}
console.log(`Mises à jour par ID: ${updated}`);

// Nouvelles molécules importantes à créer si absentes
const toCreate = [
  { name: 'Thymol', chemicalFamily: 'phenol', formula: 'C10H14O', therapeuticProperties: JSON.stringify(['antibactérien puissant', 'antifongique', 'antiseptique', 'antioxydant', 'antiparasitaire']), olfactiveProfile: 'Thym, herbacé, épicé, chaud', botanicalSources: 'Thymus vulgaris, Origanum vulgare' },
  { name: 'Carvacrol', chemicalFamily: 'phenol', formula: 'C10H14O', therapeuticProperties: JSON.stringify(['antibactérien puissant', 'antifongique', 'anti-inflammatoire', 'antioxydant', 'antiparasitaire']), olfactiveProfile: 'Origan, thym, épicé, chaud', botanicalSources: 'Origanum vulgare, Thymus vulgaris' },
  { name: 'Isoeugenol', chemicalFamily: 'phenol', formula: 'C10H12O2', therapeuticProperties: JSON.stringify(['antibactérien', 'antifongique', 'anti-inflammatoire', 'antioxydant']), olfactiveProfile: 'Clou de girofle, épicé, floral', botanicalSources: 'Cananga odorata, Jasminum officinale' },
  { name: 'Anethole', chemicalFamily: 'phenylpropanoide', formula: 'C10H12O', therapeuticProperties: JSON.stringify(['antispasmodique', 'expectorant', 'antibactérien', 'oestrogénique', 'anti-inflammatoire']), olfactiveProfile: 'Anis, fenouil, doux, sucré, réglisse', botanicalSources: 'Pimpinella anisum, Foeniculum vulgare, Illicium verum' },
  { name: 'Estragole', chemicalFamily: 'phenylpropanoide', formula: 'C10H12O', therapeuticProperties: JSON.stringify(['antispasmodique', 'antibactérien', 'anti-inflammatoire']), olfactiveProfile: 'Basilic, anis, herbacé', botanicalSources: 'Ocimum basilicum, Artemisia dracunculus' },
  { name: 'Safrole', chemicalFamily: 'phenylpropanoide', formula: 'C10H10O2', therapeuticProperties: JSON.stringify(['anesthésique local', 'antibactérien', 'antifongique']), olfactiveProfile: 'Sassafras, camphré, épicé', botanicalSources: 'Sassafras albidum, Piper betle' },
  { name: 'Myristicin', chemicalFamily: 'phenylpropanoide', formula: 'C11H12O3', therapeuticProperties: JSON.stringify(['antibactérien', 'antifongique', 'psychoactif (haute dose)', 'anti-inflammatoire']), olfactiveProfile: 'Muscade, épicé, boisé', botanicalSources: 'Myristica fragrans, Petroselinum crispum' },
  { name: 'Phytol', chemicalFamily: 'diterpene', formula: 'C20H40O', therapeuticProperties: JSON.stringify(['antioxydant', 'anti-inflammatoire', 'immunomodulateur', 'sédatif']), olfactiveProfile: 'Boisé, légèrement floral, herbacé', botanicalSources: 'Chlorophylle (toutes plantes vertes), Camellia sinensis' },
  { name: 'Sclareol', chemicalFamily: 'diterpene', formula: 'C20H36O2', therapeuticProperties: JSON.stringify(['antibactérien', 'antifongique', 'anti-inflammatoire', 'oestrogénique']), olfactiveProfile: 'Ambré, boisé, légèrement musqué', botanicalSources: 'Salvia sclarea, Nicotiana tabacum' },
  { name: 'Capsaicin', chemicalFamily: 'alcaloide', formula: 'C18H27NO3', therapeuticProperties: JSON.stringify(['analgésique', 'anti-inflammatoire', 'thermogénique', 'antimicrobien', 'anticancéreux (études)']), olfactiveProfile: 'Piquant, épicé, brûlant', botanicalSources: 'Capsicum annuum, Capsicum frutescens' },
  { name: 'Berberine', chemicalFamily: 'alcaloide', formula: 'C20H18NO4', therapeuticProperties: JSON.stringify(['antibactérien', 'antifongique', 'anti-inflammatoire', 'hypoglycémiant', 'anticancéreux (études)']), olfactiveProfile: 'Amer, légèrement terreux', botanicalSources: 'Berberis vulgaris, Hydrastis canadensis' },
  { name: 'Gallic acid', chemicalFamily: 'acide_phenolique', formula: 'C7H6O5', therapeuticProperties: JSON.stringify(['antioxydant puissant', 'antibactérien', 'antifongique', 'anticancéreux (études)', 'anti-inflammatoire']), olfactiveProfile: 'Légèrement amer, astringent', botanicalSources: 'Quercus robur, Punica granatum, Camellia sinensis' },
  { name: 'Rosmarinic acid', chemicalFamily: 'acide_phenolique', formula: 'C18H16O8', therapeuticProperties: JSON.stringify(['antioxydant puissant', 'anti-inflammatoire', 'antibactérien', 'antiviral', 'neuroprotecteur']), olfactiveProfile: 'Légèrement herbacé, amer', botanicalSources: 'Rosmarinus officinalis, Salvia officinalis, Melissa officinalis' },
  { name: 'Chlorogenic acid', chemicalFamily: 'acide_phenolique', formula: 'C16H18O9', therapeuticProperties: JSON.stringify(['antioxydant', 'anti-inflammatoire', 'hypoglycémiant', 'antibactérien', 'neuroprotecteur']), olfactiveProfile: 'Légèrement amer', botanicalSources: 'Coffea arabica, Ilex paraguariensis, Nicotiana tabacum' },
  { name: 'Caffeic acid', chemicalFamily: 'acide_phenolique', formula: 'C9H8O4', therapeuticProperties: JSON.stringify(['antioxydant puissant', 'anti-inflammatoire', 'antibactérien', 'antiviral', 'anticancéreux (études)']), olfactiveProfile: 'Légèrement amer, herbacé', botanicalSources: 'Coffea arabica, Propolis, Echinacea purpurea' },
  { name: 'Ferulic acid', chemicalFamily: 'acide_phenolique', formula: 'C10H10O4', therapeuticProperties: JSON.stringify(['antioxydant', 'anti-inflammatoire', 'antibactérien', 'neuroprotecteur', 'photoprotecteur']), olfactiveProfile: 'Légèrement vanillé, épicé', botanicalSources: 'Oryza sativa, Triticum aestivum, Nicotiana tabacum' },
  { name: 'Oleanolic acid', chemicalFamily: 'triterpene', formula: 'C30H48O3', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'hépatoprotecteur', 'antiviral', 'antioxydant']), olfactiveProfile: 'Inodore', botanicalSources: 'Olea europaea, Rosmarinus officinalis' },
  { name: 'Ursolic acid', chemicalFamily: 'triterpene', formula: 'C30H48O3', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'anticancéreux (études)', 'antiviral', 'antioxydant']), olfactiveProfile: 'Inodore', botanicalSources: 'Rosmarinus officinalis, Malus domestica' },
  { name: 'Lupeol', chemicalFamily: 'triterpene', formula: 'C30H50O', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'anticancéreux (études)', 'antiparasitaire', 'antioxydant']), olfactiveProfile: 'Inodore', botanicalSources: 'Betula pendula, Aloe vera' },
  { name: 'Boswellic acid', chemicalFamily: 'triterpene', formula: 'C32H52O4', therapeuticProperties: JSON.stringify(['anti-inflammatoire puissant', 'antiarthritique', 'immunomodulateur', 'anticancéreux (études)']), olfactiveProfile: 'Inodore', botanicalSources: 'Boswellia carterii, Boswellia serrata' },
  { name: 'Spathulenol', chemicalFamily: 'sesquiterpene', formula: 'C15H24O', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'antibactérien', 'antifongique', 'antioxydant']), olfactiveProfile: 'Boisé, terreux, légèrement herbacé', botanicalSources: 'Eucalyptus globulus, Melaleuca alternifolia' },
  { name: 'Eudesmol', chemicalFamily: 'sesquiterpene', formula: 'C15H26O', therapeuticProperties: JSON.stringify(['antibactérien', 'antifongique', 'anti-inflammatoire', 'neuroprotecteur']), olfactiveProfile: 'Boisé, terreux, camphré', botanicalSources: 'Eucalyptus globulus, Atractylodes macrocephala' },
  { name: 'Ascaridole', chemicalFamily: 'oxyde', formula: 'C10H16O2', therapeuticProperties: JSON.stringify(['antiparasitaire', 'antihelminthique', 'antibactérien']), olfactiveProfile: 'Camphré, herbacé, âcre', botanicalSources: 'Dysphania ambrosioides (Epazote)' },
  { name: 'Caryophyllene oxide', chemicalFamily: 'oxyde', formula: 'C15H24O', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'antifongique', 'antibactérien', 'analgésique', 'antioxydant']), olfactiveProfile: 'Boisé, épicé, légèrement terreux', botanicalSources: 'Cannabis sativa, Syzygium aromaticum' },
  { name: '1,8-Cineole', chemicalFamily: 'oxyde', formula: 'C10H18O', therapeuticProperties: JSON.stringify(['expectorant', 'mucolytique', 'antibactérien', 'anti-inflammatoire', 'stimulant cognitif']), olfactiveProfile: 'Eucalyptus, camphrée, frais, mentholé', botanicalSources: 'Eucalyptus globulus, Rosmarinus officinalis' },
  { name: 'Mescaline', chemicalFamily: 'alcaloide', formula: 'C11H17NO3', therapeuticProperties: JSON.stringify(['psychoactif', 'hallucinogène', 'anti-inflammatoire (etudes)']), olfactiveProfile: 'Inodore', botanicalSources: 'Lophophora williamsii (Peyotl), Trichocereus pachanoi' },
  { name: 'Psilocybin', chemicalFamily: 'alcaloide', formula: 'C12H17N2O4P', therapeuticProperties: JSON.stringify(['psychoactif', 'antidepresseur (etudes)', 'anxiolytique (etudes)', 'anti-addictif (etudes)']), olfactiveProfile: 'Inodore', botanicalSources: 'Psilocybe cubensis, Psilocybe semilanceata' },
  { name: 'Ibogaine', chemicalFamily: 'alcaloide', formula: 'C20H26N2O', therapeuticProperties: JSON.stringify(['psychoactif', 'anti-addictif (etudes)', 'analgesique']), olfactiveProfile: 'Inodore', botanicalSources: 'Tabernanthe iboga' },
  { name: 'Glycyrrhizin', chemicalFamily: 'saponine', formula: 'C42H62O16', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'antiviral', 'hepatoprotecteur', 'expectorant', 'immunomodulateur']), olfactiveProfile: 'Doux, reglisse, sucre', botanicalSources: 'Glycyrrhiza glabra (Reglisse)' },
  { name: 'Ellagic acid', chemicalFamily: 'acide_phenolique', formula: 'C14H6O8', therapeuticProperties: JSON.stringify(['antioxydant', 'anticancereux (etudes)', 'anti-inflammatoire', 'antibacterien']), olfactiveProfile: 'Inodore', botanicalSources: 'Punica granatum, Rubus idaeus' },
  { name: 'p-Coumaric acid', chemicalFamily: 'acide_phenolique', formula: 'C9H8O3', therapeuticProperties: JSON.stringify(['antioxydant', 'anti-inflammatoire', 'antibacterien', 'anticancereux (etudes)']), olfactiveProfile: 'Legerement herbace', botanicalSources: 'Petroselinum crispum, Piper nigrum' },
  { name: 'Betulinic acid', chemicalFamily: 'triterpene', formula: 'C30H48O3', therapeuticProperties: JSON.stringify(['anticancereux', 'anti-inflammatoire', 'antiviral', 'antibacterien']), olfactiveProfile: 'Inodore', botanicalSources: 'Betula pendula, Diospyros melanoxylon' },
];

let newCreated = 0;
for (const mol of toCreate) {
  const [existing] = await conn.execute('SELECT id, therapeuticProperties FROM molecules WHERE name = ? LIMIT 1', [mol.name]);
  if (existing.length > 0) {
    if (!existing[0].therapeuticProperties || existing[0].therapeuticProperties === '[]' || existing[0].therapeuticProperties === '') {
      await conn.execute('UPDATE molecules SET therapeuticProperties = ? WHERE id = ?', [mol.therapeuticProperties, existing[0].id]);
      newCreated++;
    }
    continue;
  }
  await conn.execute(
    'INSERT INTO molecules (name, formula, chemicalFamily, therapeuticProperties, olfactiveProfile, botanicalSources, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
    [mol.name, mol.formula, mol.chemicalFamily, mol.therapeuticProperties, mol.olfactiveProfile, mol.botanicalSources]
  );
  console.log(`  + ${mol.name}`);
  newCreated++;
}

const [[{total, withTherapeutic}]] = await conn.execute(`
  SELECT COUNT(*) as total, 
         SUM(CASE WHEN therapeuticProperties IS NOT NULL AND therapeuticProperties != '[]' AND therapeuticProperties != '' THEN 1 ELSE 0 END) as withTherapeutic
  FROM molecules
`);
console.log(`\n✅ Batch 7c: ${updated} mises à jour ID + ${newCreated} créées/enrichies`);
console.log(`📊 Couverture finale: ${withTherapeutic}/${total} (${(withTherapeutic/total*100).toFixed(1)}%)`);
await conn.end();
