import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Batch 8 : polyphénols, alcaloïdes xanthiques, glucosinolates, tanins, anthocyanines
// Sources : PMC, EFSA, PubChem, Phytochemistry Reviews
const molecules = [
  // Polyphénols - acides phénoliques
  { name: 'Acide gallique', formula: 'C7H6O5', family: 'acide phenolique', tp: ['antioxydant puissant','antibacterien','antifongique','anticancereux','anti-inflammatoire'], olf: 'Inodore', src: 'Quercus spp., Punica granatum, Camellia sinensis' },
  { name: 'Acide ellagique', formula: 'C14H6O8', family: 'acide phenolique', tp: ['antioxydant','anticancereux','anti-inflammatoire','antiviral'], olf: 'Inodore', src: 'Punica granatum, Rubus idaeus, Fragaria ananassa' },
  { name: 'Acide chlorogenique', formula: 'C16H18O9', family: 'acide phenolique', tp: ['antioxydant','anti-inflammatoire','antidiabetique','cardioprotecteur'], olf: 'Inodore', src: 'Coffea arabica, Ilex paraguariensis, Cynara scolymus' },
  { name: 'Acide rosmarinique', formula: 'C18H16O8', family: 'acide phenolique', tp: ['antioxydant','anti-inflammatoire','antibacterien','antiviral','neuroprotecteur'], olf: 'Inodore', src: 'Rosmarinus officinalis, Salvia officinalis, Melissa officinalis' },
  { name: 'Acide ferulique', formula: 'C10H10O4', family: 'acide phenolique', tp: ['antioxydant','anti-inflammatoire','neuroprotecteur','photoprotecteur'], olf: 'Inodore', src: 'Oryza sativa, Triticum aestivum, Ferula assa-foetida' },
  { name: 'Acide protocatechuique', formula: 'C7H6O4', family: 'acide phenolique', tp: ['antioxydant','antibacterien','anticancereux','cardioprotecteur'], olf: 'Inodore', src: 'Camellia sinensis, Olea europaea, Vaccinium myrtillus' },
  
  // Tanins
  { name: 'Acide tannique', formula: 'C76H52O46', family: 'tannin', tp: ['astringent','antibacterien','antiviral','antioxydant','antidiarrhéique'], olf: 'Inodore', src: 'Quercus spp., Camellia sinensis, Vitis vinifera' },
  { name: 'Epigallocatechin gallate', formula: 'C22H18O11', family: 'catechine', tp: ['antioxydant puissant','anticancereux','anti-inflammatoire','antiviral','cardioprotecteur'], olf: 'Inodore', src: 'Camellia sinensis (thé vert)' },
  { name: 'Epigallocatechin', formula: 'C15H14O7', family: 'catechine', tp: ['antioxydant','anti-inflammatoire','cardioprotecteur'], olf: 'Inodore', src: 'Camellia sinensis' },
  { name: 'Epicatechin gallate', formula: 'C22H18O10', family: 'catechine', tp: ['antioxydant','antibacterien','anti-inflammatoire'], olf: 'Inodore', src: 'Camellia sinensis, Theobroma cacao' },
  
  // Anthocyanines
  { name: 'Cyanidin', formula: 'C15H11O6+', family: 'anthocyanine', tp: ['antioxydant','anti-inflammatoire','anticancereux','cardioprotecteur'], olf: 'Inodore', src: 'Vaccinium myrtillus, Rubus idaeus, Rosa spp.' },
  { name: 'Delphinidin', formula: 'C15H11O7+', family: 'anthocyanine', tp: ['antioxydant','anticancereux','antibacterien'], olf: 'Inodore', src: 'Vaccinium myrtillus, Solanum melongena' },
  { name: 'Malvidin', formula: 'C17H15O7+', family: 'anthocyanine', tp: ['antioxydant','cardioprotecteur','anti-inflammatoire'], olf: 'Inodore', src: 'Vitis vinifera (vin rouge), Vaccinium myrtillus' },
  { name: 'Pelargonidin', formula: 'C15H11O5+', family: 'anthocyanine', tp: ['antioxydant','anti-inflammatoire'], olf: 'Inodore', src: 'Fragaria ananassa, Pelargonium spp.' },
  
  // Alcaloïdes xanthiques
  { name: 'Caféine', formula: 'C8H10N4O2', family: 'alcaloide xanthique', tp: ['stimulant SNC','bronchodilatateur','diuretique','analgesique adjuvant','ergogenique'], olf: 'Inodore', src: 'Coffea arabica, Camellia sinensis, Cola nitida, Ilex paraguariensis' },
  { name: 'Théobromine', formula: 'C7H8N4O2', family: 'alcaloide xanthique', tp: ['bronchodilatateur','diuretique','stimulant leger','cardioprotecteur'], olf: 'Inodore', src: 'Theobroma cacao, Cola nitida, Camellia sinensis' },
  { name: 'Théophylline', formula: 'C7H8N4O2', family: 'alcaloide xanthique', tp: ['bronchodilatateur','anti-asthmatique','diuretique','stimulant'], olf: 'Inodore', src: 'Camellia sinensis, Coffea arabica' },
  { name: 'Paraxanthine', formula: 'C7H8N4O2', family: 'alcaloide xanthique', tp: ['stimulant','diuretique','metabolite cafeine'], olf: 'Inodore', src: 'Metabolite principal de la caféine (humain)' },
  { name: 'Theobromine methyl', formula: 'C8H10N4O2', family: 'alcaloide xanthique', tp: ['stimulant leger','bronchodilatateur'], olf: 'Inodore', src: 'Theobroma cacao' },
  
  // Glucosinolates
  { name: 'Sinigrine', formula: 'C10H16KNO9S2', family: 'glucosinolate', tp: ['antibacterien','anticancereux','antifongique','anti-inflammatoire'], olf: 'Inodore (précurseur allyl isothiocyanate)', src: 'Brassica nigra, Armoracia rusticana, Sinapis alba' },
  { name: 'Glucoraphanine', formula: 'C12H23NO10S3', family: 'glucosinolate', tp: ['anticancereux','antioxydant','detoxifiant','antibacterien'], olf: 'Inodore (précurseur sulforaphane)', src: 'Brassica oleracea (brocoli), Raphanus sativus' },
  { name: 'Gluconapin', formula: 'C11H19NO9S2', family: 'glucosinolate', tp: ['anticancereux','antifongique'], olf: 'Inodore', src: 'Brassica napus, Brassica rapa' },
  { name: 'Glucobrassicine', formula: 'C16H20N2O9S2', family: 'glucosinolate', tp: ['anticancereux','antioxydant','immunomodulateur'], olf: 'Inodore', src: 'Brassica oleracea, Brassica napus' },
  { name: 'Glucoerucine', formula: 'C12H23NO10S3', family: 'glucosinolate', tp: ['anticancereux','antioxydant','cardioprotecteur'], olf: 'Inodore', src: 'Eruca vesicaria (roquette), Raphanus sativus' },
  
  // Procyanidines
  { name: 'Procyanidin B1', formula: 'C30H26O12', family: 'procyanidine', tp: ['antioxydant','cardioprotecteur','anti-inflammatoire','antibacterien'], olf: 'Inodore', src: 'Vitis vinifera, Theobroma cacao, Malus domestica' },
  { name: 'Procyanidin B2', formula: 'C30H26O12', family: 'procyanidine', tp: ['antioxydant','cardioprotecteur','anti-inflammatoire'], olf: 'Inodore', src: 'Theobroma cacao, Vitis vinifera, Camellia sinensis' },
  { name: 'Procyanidin C1', formula: 'C45H38O18', family: 'procyanidine', tp: ['antioxydant puissant','anticancereux','cardioprotecteur'], olf: 'Inodore', src: 'Theobroma cacao, Vitis vinifera' },
  
  // Flavonols supplémentaires
  { name: 'Myricetin', formula: 'C15H10O8', family: 'flavonol', tp: ['antioxydant','anti-inflammatoire','anticancereux','antiviral'], olf: 'Inodore', src: 'Vitis vinifera, Camellia sinensis, Myrica rubra' },
  { name: 'Fisetin', formula: 'C15H10O6', family: 'flavonol', tp: ['antioxydant','neuroprotecteur','anticancereux','anti-inflammatoire'], olf: 'Inodore', src: 'Rhus cotinus, Fragaria ananassa, Malus domestica' },
  { name: 'Isorhamnetin', formula: 'C16H12O7', family: 'flavonol', tp: ['antioxydant','anti-inflammatoire','cardioprotecteur'], olf: 'Inodore', src: 'Hippophae rhamnoides, Oenothera biennis' },
  
  // Isoflavones
  { name: 'Genistein', formula: 'C15H10O5', family: 'isoflavone', tp: ['phytooestrogene','anticancereux','antioxydant','cardioprotecteur'], olf: 'Inodore', src: 'Glycine max, Trifolium pratense, Lupinus albus' },
  { name: 'Daidzein', formula: 'C15H10O4', family: 'isoflavone', tp: ['phytooestrogene','antioxydant','anticancereux'], olf: 'Inodore', src: 'Glycine max, Pueraria lobata' },
  { name: 'Formononetin', formula: 'C16H12O4', family: 'isoflavone', tp: ['phytooestrogene','antioxydant','cardioprotecteur'], olf: 'Inodore', src: 'Trifolium pratense, Astragalus membranaceus' },
  
  // Chalcones et dihydrochalcones
  { name: 'Phloretin', formula: 'C15H14O5', family: 'dihydrochalcone', tp: ['antioxydant','antidiabetique','anti-inflammatoire'], olf: 'Inodore', src: 'Malus domestica (feuilles et racines)' },
  { name: 'Phloridzin', formula: 'C21H24O10', family: 'dihydrochalcone', tp: ['antidiabetique','antioxydant'], olf: 'Inodore', src: 'Malus domestica (écorce)' },
  
  // Lignanes
  { name: 'Secoisolariciresinol', formula: 'C20H26O6', family: 'lignane', tp: ['phytooestrogene','antioxydant','anticancereux'], olf: 'Inodore', src: 'Linum usitatissimum, Sesamum indicum' },
  { name: 'Matairesinol', formula: 'C20H22O6', family: 'lignane', tp: ['phytooestrogene','antioxydant','anticancereux'], olf: 'Inodore', src: 'Linum usitatissimum, Sesamum indicum' },
  { name: 'Sesamin', formula: 'C20H18O6', family: 'lignane', tp: ['antioxydant','anti-inflammatoire','antihypertenseur','hepatoprotecteur'], olf: 'Inodore', src: 'Sesamum indicum' },
  { name: 'Pinoresinol', formula: 'C20H22O6', family: 'lignane', tp: ['antioxydant','anti-inflammatoire','antibacterien'], olf: 'Inodore', src: 'Olea europaea, Sesamum indicum, Forsythia spp.' },
];

let created = 0;
let updated = 0;
let skipped = 0;

for (const mol of molecules) {
  const [ex] = await conn.execute('SELECT id, therapeuticProperties FROM molecules WHERE name = ? LIMIT 1', [mol.name]);
  
  if (ex.length > 0) {
    const existing = ex[0];
    const hasTherapeutic = existing.therapeuticProperties && existing.therapeuticProperties !== '[]' && existing.therapeuticProperties !== '';
    if (!hasTherapeutic) {
      await conn.execute(
        'UPDATE molecules SET therapeuticProperties = ?, olfactiveProfile = ?, botanicalSources = ?, updatedAt = NOW() WHERE id = ?',
        [JSON.stringify(mol.tp), mol.olf, mol.src, existing.id]
      );
      updated++;
    } else {
      skipped++;
    }
    continue;
  }
  
  await conn.execute(
    'INSERT INTO molecules (name, formula, chemicalFamily, therapeuticProperties, olfactiveProfile, botanicalSources, createdAt, updatedAt) VALUES (?,?,?,?,?,?,NOW(),NOW())',
    [mol.name, mol.formula, mol.family, JSON.stringify(mol.tp), mol.olf, mol.src]
  );
  created++;
}

console.log('Créées: ' + created + ' | Mises à jour: ' + updated + ' | Ignorées (déjà enrichies): ' + skipped);

const [[row]] = await conn.execute(
  "SELECT COUNT(*) as total, SUM(CASE WHEN therapeuticProperties IS NOT NULL AND therapeuticProperties != '[]' AND therapeuticProperties != '' THEN 1 ELSE 0 END) as wt FROM molecules"
);
console.log('Couverture thérapeutique: ' + row.wt + '/' + row.total + ' (' + (row.wt/row.total*100).toFixed(1) + '%)');

await conn.end();
