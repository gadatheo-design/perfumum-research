/**
 * Batch 7b : Créer les molécules importantes manquantes et enrichir
 * les molécules existantes avec des variantes de noms
 * Objectif : 31.6% → 35%
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Molécules à créer (importantes, absentes de la base)
const toCreate = [
  // Oxydes terpéniques
  { name: '1,8-Cineole', chemicalFamily: 'oxyde', formula: 'C10H18O', therapeuticProperties: JSON.stringify(['expectorant', 'mucolytique', 'antibactérien', 'anti-inflammatoire', 'stimulant cognitif']), olfactiveProfile: 'Eucalyptus, camphré, frais, mentholé', botanicalSources: 'Eucalyptus globulus, Rosmarinus officinalis, Lavandula latifolia' },
  { name: 'Caryophyllene oxide', chemicalFamily: 'oxyde', formula: 'C15H24O', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'antifongique', 'antibactérien', 'analgésique', 'antioxydant']), olfactiveProfile: 'Boisé, épicé, légèrement terreux', botanicalSources: 'Cannabis sativa, Syzygium aromaticum, Origanum vulgare' },
  { name: 'Ascaridole', chemicalFamily: 'oxyde', formula: 'C10H16O2', therapeuticProperties: JSON.stringify(['antiparasitaire', 'antihelminthique', 'antibactérien']), olfactiveProfile: 'Camphré, herbacé, âcre', botanicalSources: 'Dysphania ambrosioides (Épazote), Chenopodium ambrosioides' },
  
  // Phénols complexes
  { name: 'Thymol', chemicalFamily: 'phenol', formula: 'C10H14O', therapeuticProperties: JSON.stringify(['antibactérien puissant', 'antifongique', 'antiseptique', 'antioxydant', 'antiparasitaire']), olfactiveProfile: 'Thym, herbacé, épicé, chaud', botanicalSources: 'Thymus vulgaris, Origanum vulgare, Monarda fistulosa' },
  { name: 'Carvacrol', chemicalFamily: 'phenol', formula: 'C10H14O', therapeuticProperties: JSON.stringify(['antibactérien puissant', 'antifongique', 'anti-inflammatoire', 'antioxydant', 'antiparasitaire']), olfactiveProfile: 'Origan, thym, épicé, chaud, herbacé', botanicalSources: 'Origanum vulgare, Thymus vulgaris, Satureja montana' },
  { name: 'Isoeugenol', chemicalFamily: 'phenol', formula: 'C10H12O2', therapeuticProperties: JSON.stringify(['antibactérien', 'antifongique', 'anti-inflammatoire', 'antioxydant']), olfactiveProfile: 'Clou de girofle, épicé, floral, boisé', botanicalSources: 'Cananga odorata, Jasminum officinale, Syzygium aromaticum' },
  { name: 'Methyl eugenol', chemicalFamily: 'phenol', formula: 'C11H14O2', therapeuticProperties: JSON.stringify(['antibactérien', 'antifongique', 'sédatif', 'anesthésique']), olfactiveProfile: 'Clou de girofle, épicé, doux, floral', botanicalSources: 'Ocimum basilicum, Eugenia caryophyllata, Pimenta dioica' },
  { name: 'Anethole', chemicalFamily: 'phenylpropanoide', formula: 'C10H12O', therapeuticProperties: JSON.stringify(['antispasmodique', 'expectorant', 'antibactérien', 'oestrogénique', 'anti-inflammatoire']), olfactiveProfile: 'Anis, fenouil, doux, sucré, réglisse', botanicalSources: 'Pimpinella anisum, Foeniculum vulgare, Illicium verum' },
  { name: 'Estragole', chemicalFamily: 'phenylpropanoide', formula: 'C10H12O', therapeuticProperties: JSON.stringify(['antispasmodique', 'antibactérien', 'anti-inflammatoire']), olfactiveProfile: 'Basilic, anis, herbacé, doux', botanicalSources: 'Ocimum basilicum, Artemisia dracunculus, Foeniculum vulgare' },
  { name: 'Safrole', chemicalFamily: 'phenylpropanoide', formula: 'C10H10O2', therapeuticProperties: JSON.stringify(['anesthésique local', 'antibactérien', 'antifongique']), olfactiveProfile: 'Sassafras, camphré, épicé, boisé', botanicalSources: 'Sassafras albidum, Ocotea cymbarum, Piper betle' },
  { name: 'Myristicin', chemicalFamily: 'phenylpropanoide', formula: 'C11H12O3', therapeuticProperties: JSON.stringify(['antibactérien', 'antifongique', 'psychoactif (haute dose)', 'anti-inflammatoire']), olfactiveProfile: 'Muscade, épicé, boisé, légèrement phénolique', botanicalSources: 'Myristica fragrans, Petroselinum crispum, Apium graveolens' },
  { name: 'Elemicin', chemicalFamily: 'phenylpropanoide', formula: 'C12H16O3', therapeuticProperties: JSON.stringify(['antibactérien', 'antifongique', 'anti-inflammatoire']), olfactiveProfile: 'Épicé, boisé, légèrement phénolique', botanicalSources: 'Canarium luzonicum (Élémi), Myristica fragrans' },
  
  // Sesquiterpènes oxygénés
  { name: 'Spathulenol', chemicalFamily: 'sesquiterpene', formula: 'C15H24O', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'antibactérien', 'antifongique', 'antioxydant']), olfactiveProfile: 'Boisé, terreux, légèrement herbacé', botanicalSources: 'Eucalyptus globulus, Melaleuca alternifolia, Rosmarinus officinalis' },
  { name: 'Globulol', chemicalFamily: 'sesquiterpene', formula: 'C15H26O', therapeuticProperties: JSON.stringify(['antibactérien', 'antifongique', 'anti-inflammatoire']), olfactiveProfile: 'Boisé, terreux, eucalyptus', botanicalSources: 'Eucalyptus globulus, Melaleuca alternifolia' },
  { name: 'Viridiflorol', chemicalFamily: 'sesquiterpene', formula: 'C15H26O', therapeuticProperties: JSON.stringify(['antibactérien', 'antifongique', 'anti-inflammatoire']), olfactiveProfile: 'Boisé, terreux, légèrement vert', botanicalSources: 'Melaleuca viridiflora, Leptospermum scoparium' },
  { name: 'Elemol', chemicalFamily: 'sesquiterpene', formula: 'C15H26O', therapeuticProperties: JSON.stringify(['antibactérien', 'antifongique', 'anti-inflammatoire', 'sédatif']), olfactiveProfile: 'Boisé, terreux, légèrement floral', botanicalSources: 'Canarium luzonicum, Boswellia carterii' },
  { name: 'Eudesmol', chemicalFamily: 'sesquiterpene', formula: 'C15H26O', therapeuticProperties: JSON.stringify(['antibactérien', 'antifongique', 'anti-inflammatoire', 'neuroprotecteur']), olfactiveProfile: 'Boisé, terreux, camphré', botanicalSources: 'Eucalyptus globulus, Atractylodes macrocephala' },
  
  // Diterpènes
  { name: 'Phytol', chemicalFamily: 'diterpene', formula: 'C20H40O', therapeuticProperties: JSON.stringify(['antioxydant', 'anti-inflammatoire', 'immunomodulateur', 'sédatif']), olfactiveProfile: 'Boisé, légèrement floral, herbacé', botanicalSources: 'Chlorophylle (toutes plantes vertes), Camellia sinensis' },
  { name: 'Sclareol', chemicalFamily: 'diterpene', formula: 'C20H36O2', therapeuticProperties: JSON.stringify(['antibactérien', 'antifongique', 'anti-inflammatoire', 'oestrogénique']), olfactiveProfile: 'Ambré, boisé, légèrement musqué, terreux', botanicalSources: 'Salvia sclarea, Nicotiana tabacum' },
  { name: 'Ferruginol', chemicalFamily: 'diterpene', formula: 'C20H30O', therapeuticProperties: JSON.stringify(['antibactérien', 'antifongique', 'anti-inflammatoire', 'cytotoxique']), olfactiveProfile: 'Boisé, résineux, légèrement fumé', botanicalSources: 'Podocarpus ferrugineus, Salvia officinalis' },
  
  // Triterpènes
  { name: 'Betulinic acid', chemicalFamily: 'triterpene', formula: 'C30H48O3', therapeuticProperties: JSON.stringify(['anticancéreux', 'anti-inflammatoire', 'antiviral', 'antibactérien']), olfactiveProfile: 'Inodore (acide)', botanicalSources: 'Betula pendula (Bouleau), Diospyros melanoxylon' },
  { name: 'Lupeol', chemicalFamily: 'triterpene', formula: 'C30H50O', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'anticancéreux (études)', 'antiparasitaire', 'antioxydant']), olfactiveProfile: 'Inodore', botanicalSources: 'Betula pendula, Aloe vera, Ficus religiosa' },
  { name: 'Oleanolic acid', chemicalFamily: 'triterpene', formula: 'C30H48O3', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'hépatoprotecteur', 'antiviral', 'antioxydant']), olfactiveProfile: 'Inodore', botanicalSources: 'Olea europaea, Rosmarinus officinalis, Syzygium aromaticum' },
  { name: 'Ursolic acid', chemicalFamily: 'triterpene', formula: 'C30H48O3', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'anticancéreux (études)', 'antiviral', 'antioxydant']), olfactiveProfile: 'Inodore', botanicalSources: 'Rosmarinus officinalis, Malus domestica, Ocimum basilicum' },
  { name: 'Boswellic acid', chemicalFamily: 'triterpene', formula: 'C32H52O4', therapeuticProperties: JSON.stringify(['anti-inflammatoire puissant', 'antiarthritique', 'immunomodulateur', 'anticancéreux (études)']), olfactiveProfile: 'Inodore (acide)', botanicalSources: 'Boswellia carterii, Boswellia serrata, Boswellia sacra' },
  { name: 'Glycyrrhizin', chemicalFamily: 'saponine', formula: 'C42H62O16', therapeuticProperties: JSON.stringify(['anti-inflammatoire', 'antiviral', 'hépatoprotecteur', 'expectorant', 'immunomodulateur']), olfactiveProfile: 'Doux, réglisse, sucré', botanicalSources: 'Glycyrrhiza glabra (Réglisse)' },
  
  // Alcaloïdes spéciaux
  { name: 'Ibogaine', chemicalFamily: 'alcaloide', formula: 'C20H26N2O', therapeuticProperties: JSON.stringify(['psychoactif', 'anti-addictif (études)', 'analgésique']), olfactiveProfile: 'Inodore', botanicalSources: 'Tabernanthe iboga' },
  { name: 'Mescaline', chemicalFamily: 'alcaloide', formula: 'C11H17NO3', therapeuticProperties: JSON.stringify(['psychoactif', 'hallucinogène', 'anti-inflammatoire (études)']), olfactiveProfile: 'Inodore', botanicalSources: 'Lophophora williamsii (Peyotl), Trichocereus pachanoi' },
  { name: 'Psilocybin', chemicalFamily: 'alcaloide', formula: 'C12H17N2O4P', therapeuticProperties: JSON.stringify(['psychoactif', 'antidépresseur (études)', 'anxiolytique (études)', 'anti-addictif (études)']), olfactiveProfile: 'Inodore', botanicalSources: 'Psilocybe cubensis, Psilocybe semilanceata' },
  { name: 'Capsaicin', chemicalFamily: 'alcaloide', formula: 'C18H27NO3', therapeuticProperties: JSON.stringify(['analgésique', 'anti-inflammatoire', 'thermogénique', 'antimicrobien', 'anticancéreux (études)']), olfactiveProfile: 'Piquant, épicé, brûlant', botanicalSources: 'Capsicum annuum, Capsicum frutescens' },
  { name: 'Berberine', chemicalFamily: 'alcaloide', formula: 'C20H18NO4', therapeuticProperties: JSON.stringify(['antibactérien', 'antifongique', 'anti-inflammatoire', 'hypoglycémiant', 'anticancéreux (études)']), olfactiveProfile: 'Amer, légèrement terreux', botanicalSources: 'Berberis vulgaris, Hydrastis canadensis, Coptis chinensis' },
  
  // Acides phénoliques
  { name: 'Gallic acid', chemicalFamily: 'acide_phenolique', formula: 'C7H6O5', therapeuticProperties: JSON.stringify(['antioxydant puissant', 'antibactérien', 'antifongique', 'anticancéreux (études)', 'anti-inflammatoire']), olfactiveProfile: 'Légèrement amer, astringent', botanicalSources: 'Quercus robur, Punica granatum, Camellia sinensis' },
  { name: 'Ellagic acid', chemicalFamily: 'acide_phenolique', formula: 'C14H6O8', therapeuticProperties: JSON.stringify(['antioxydant', 'anticancéreux (études)', 'anti-inflammatoire', 'antibactérien']), olfactiveProfile: 'Inodore', botanicalSources: 'Punica granatum, Rubus idaeus, Fragaria vesca' },
  { name: 'Rosmarinic acid', chemicalFamily: 'acide_phenolique', formula: 'C18H16O8', therapeuticProperties: JSON.stringify(['antioxydant puissant', 'anti-inflammatoire', 'antibactérien', 'antiviral', 'neuroprotecteur']), olfactiveProfile: 'Légèrement herbacé, amer', botanicalSources: 'Rosmarinus officinalis, Salvia officinalis, Melissa officinalis' },
  { name: 'Chlorogenic acid', chemicalFamily: 'acide_phenolique', formula: 'C16H18O9', therapeuticProperties: JSON.stringify(['antioxydant', 'anti-inflammatoire', 'hypoglycémiant', 'antibactérien', 'neuroprotecteur']), olfactiveProfile: 'Légèrement amer', botanicalSources: 'Coffea arabica, Ilex paraguariensis, Nicotiana tabacum' },
  { name: 'Caffeic acid', chemicalFamily: 'acide_phenolique', formula: 'C9H8O4', therapeuticProperties: JSON.stringify(['antioxydant puissant', 'anti-inflammatoire', 'antibactérien', 'antiviral', 'anticancéreux (études)']), olfactiveProfile: 'Légèrement amer, herbacé', botanicalSources: 'Coffea arabica, Propolis, Echinacea purpurea' },
  { name: 'Ferulic acid', chemicalFamily: 'acide_phenolique', formula: 'C10H10O4', therapeuticProperties: JSON.stringify(['antioxydant', 'anti-inflammatoire', 'antibactérien', 'neuroprotecteur', 'photoprotecteur']), olfactiveProfile: 'Légèrement vanillé, épicé', botanicalSources: 'Oryza sativa, Triticum aestivum, Nicotiana tabacum' },
  { name: 'p-Coumaric acid', chemicalFamily: 'acide_phenolique', formula: 'C9H8O3', therapeuticProperties: JSON.stringify(['antioxydant', 'anti-inflammatoire', 'antibactérien', 'anticancéreux (études)']), olfactiveProfile: 'Légèrement herbacé', botanicalSources: 'Petroselinum crispum, Piper nigrum, Coffea arabica' },
];

let created = 0;
let skipped = 0;

for (const mol of toCreate) {
  // Vérifier si elle existe déjà
  const [existing] = await conn.execute(
    'SELECT id FROM molecules WHERE name = ? LIMIT 1',
    [mol.name]
  );
  
  if (existing.length > 0) {
    // Mettre à jour les propriétés thérapeutiques si manquantes
    const [current] = await conn.execute(
      'SELECT therapeuticProperties FROM molecules WHERE id = ?',
      [existing[0].id]
    );
    if (!current[0].therapeuticProperties || current[0].therapeuticProperties === '[]') {
      await conn.execute(
        'UPDATE molecules SET therapeuticProperties = ? WHERE id = ?',
        [mol.therapeuticProperties, existing[0].id]
      );
      console.log(`  ↑ Mis à jour: ${mol.name}`);
      created++;
    } else {
      skipped++;
    }
    continue;
  }
  
  // Créer la molécule
  await conn.execute(
    `INSERT INTO molecules (name, formula, chemicalFamily, therapeuticProperties, olfactiveProfile, botanicalSources, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [mol.name, mol.formula || null, mol.chemicalFamily, mol.therapeuticProperties, mol.olfactiveProfile || null, mol.botanicalSources || null]
  );
  console.log(`  + Créée: ${mol.name}`);
  created++;
}

// Résultat final
const [[{total, withTherapeutic}]] = await conn.execute(`
  SELECT COUNT(*) as total, 
         SUM(CASE WHEN therapeuticProperties IS NOT NULL AND therapeuticProperties != '[]' AND therapeuticProperties != '' THEN 1 ELSE 0 END) as withTherapeutic
  FROM molecules
`);

console.log(`\n✅ Batch 7b terminé:`);
console.log(`   Créées/mises à jour: ${created}`);
console.log(`   Ignorées (déjà enrichies): ${skipped}`);
console.log(`\n📊 Couverture finale: ${withTherapeutic}/${total} (${(withTherapeutic/total*100).toFixed(1)}%)`);

await conn.end();
