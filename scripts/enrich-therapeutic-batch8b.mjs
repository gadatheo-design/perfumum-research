import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Batch 8b : saponines, triterpènes, alcaloïdes indoliques, xanthones, stilbènes supplémentaires
const molecules = [
  // Saponines triterpéniques
  { name: 'Acide oleanolique', formula: 'C30H48O3', family: 'triterpene', tp: ['anti-inflammatoire','hepatoprotecteur','anticancereux','antiviral','antibacterien'], olf: 'Inodore', src: 'Olea europaea, Rosmarinus officinalis, Syzygium aromaticum' },
  { name: 'Acide ursolique', formula: 'C30H48O3', family: 'triterpene', tp: ['anti-inflammatoire','anticancereux','antioxydant','antibacterien','hepatoprotecteur'], olf: 'Inodore', src: 'Rosmarinus officinalis, Malus domestica, Vaccinium myrtillus' },
  { name: 'Acide betulinique', formula: 'C30H48O3', family: 'triterpene', tp: ['anticancereux','anti-inflammatoire','antiviral (HIV)','antibacterien'], olf: 'Inodore', src: 'Betula spp., Platanus spp., Paeonia spp.' },
  { name: 'Betulinine', formula: 'C30H50O2', family: 'triterpene', tp: ['anti-inflammatoire','antibacterien','antifongique'], olf: 'Inodore', src: 'Betula spp.' },
  { name: 'Lupeol', formula: 'C30H50O', family: 'triterpene', tp: ['anti-inflammatoire','anticancereux','antifongique','antiparasitaire'], olf: 'Inodore', src: 'Mangifera indica, Aloe vera, Cannabis sativa' },
  { name: 'Ginsenoside Rb1', formula: 'C54H92O23', family: 'saponine', tp: ['adaptogene','neuroprotecteur','anti-inflammatoire','immunomodulateur'], olf: 'Inodore', src: 'Panax ginseng, Panax quinquefolius' },
  { name: 'Ginsenoside Rg1', formula: 'C42H72O14', family: 'saponine', tp: ['adaptogene','neuroprotecteur','stimulant cognitif','anti-inflammatoire'], olf: 'Inodore', src: 'Panax ginseng' },
  { name: 'Aescine', formula: 'C55H86O24', family: 'saponine', tp: ['venotonique','anti-inflammatoire','antioedemateux'], olf: 'Inodore', src: 'Aesculus hippocastanum' },
  { name: 'Glycyrrhizine', formula: 'C42H62O16', family: 'saponine', tp: ['anti-inflammatoire','antiviral','immunomodulateur','hepatoprotecteur'], olf: 'Sucré, réglisse', src: 'Glycyrrhiza glabra' },
  { name: 'Quillaja saponin', formula: 'C57H90O26', family: 'saponine', tp: ['immunoadjuvant','antibacterien','antifongique'], olf: 'Inodore', src: 'Quillaja saponaria' },
  
  // Alcaloïdes indoliques
  { name: 'Vincamine', formula: 'C21H26N2O3', family: 'alcaloide indolique', tp: ['vasodilatateur cerebral','neuroprotecteur','antihypertenseur'], olf: 'Inodore', src: 'Vinca minor' },
  { name: 'Vinpocetine', formula: 'C22H26N2O2', family: 'alcaloide indolique', tp: ['vasodilatateur cerebral','neuroprotecteur','anti-inflammatoire'], olf: 'Inodore', src: 'Vinca minor (semi-synthèse)' },
  { name: 'Strychnine', formula: 'C21H22N2O2', family: 'alcaloide indolique', tp: ['stimulant SNC (toxique)','antagoniste glycine'], olf: 'Inodore', src: 'Strychnos nux-vomica' },
  { name: 'Brucine', formula: 'C23H26N2O4', family: 'alcaloide indolique', tp: ['stimulant SNC (toxique)','analgesique topique'], olf: 'Inodore', src: 'Strychnos nux-vomica' },
  { name: 'Yohimbine', formula: 'C21H26N2O3', family: 'alcaloide indolique', tp: ['aphrodisiaque','alpha-2 bloquant','anxiogene'], olf: 'Inodore', src: 'Pausinystalia yohimbe, Rauwolfia spp.' },
  { name: 'Mitragynine', formula: 'C23H30N2O4', family: 'alcaloide indolique', tp: ['analgesique','sedatif','antidiarrhéique'], olf: 'Inodore', src: 'Mitragyna speciosa (Kratom)' },
  
  // Xanthones
  { name: 'Mangiferin', formula: 'C19H18O11', family: 'xanthone', tp: ['antioxydant','anti-inflammatoire','antidiabetique','antiviral'], olf: 'Inodore', src: 'Mangifera indica, Swertia spp.' },
  { name: 'Alpha-mangostin', formula: 'C24H26O6', family: 'xanthone', tp: ['anticancereux','antibacterien','anti-inflammatoire','antioxydant'], olf: 'Inodore', src: 'Garcinia mangostana' },
  { name: 'Gamma-mangostin', formula: 'C23H24O6', family: 'xanthone', tp: ['anti-inflammatoire','anticancereux','antioxydant'], olf: 'Inodore', src: 'Garcinia mangostana' },
  
  // Phtalides et isocoumарines
  { name: 'Butylidenephthalide', formula: 'C12H12O2', family: 'phthalide', tp: ['antispasmodique','sedatif','anti-inflammatoire'], olf: 'Herbacé, céleri', src: 'Ligusticum chuanxiong, Angelica sinensis' },
  { name: 'Ligustilide', formula: 'C12H14O2', family: 'phthalide', tp: ['antispasmodique','vasodilateur','anti-inflammatoire'], olf: 'Herbacé, céleri', src: 'Ligusticum chuanxiong, Angelica sinensis' },
  
  // Stilbènes supplémentaires
  { name: 'Rhapontigenin', formula: 'C15H14O4', family: 'stilbene', tp: ['antioxydant','anti-inflammatoire','anticoagulant'], olf: 'Inodore', src: 'Rheum rhaponticum, Vitis vinifera' },
  { name: 'Pinosylvin', formula: 'C14H12O2', family: 'stilbene', tp: ['antibacterien','antifongique','antioxydant'], olf: 'Inodore', src: 'Pinus sylvestris, Pinus strobus' },
  
  // Alcaloïdes isoquinoléiques
  { name: 'Berberine', formula: 'C20H18NO4+', family: 'alcaloide isoquinolinique', tp: ['antibacterien','antifongique','antidiabetique','anti-inflammatoire','anticancereux'], olf: 'Inodore', src: 'Berberis vulgaris, Hydrastis canadensis, Coptis chinensis' },
  { name: 'Palmatine', formula: 'C21H22NO4+', family: 'alcaloide isoquinolinique', tp: ['antibacterien','anti-inflammatoire','sedatif'], olf: 'Inodore', src: 'Berberis spp., Coptis chinensis' },
  { name: 'Coptisine', formula: 'C19H14NO4+', family: 'alcaloide isoquinolinique', tp: ['antibacterien','anti-inflammatoire','anticancereux'], olf: 'Inodore', src: 'Coptis chinensis, Berberis spp.' },
  { name: 'Colchicine', formula: 'C22H25NO6', family: 'alcaloide', tp: ['antigouteux','anti-inflammatoire','antimitotique'], olf: 'Inodore', src: 'Colchicum autumnale' },
  
  // Quinones
  { name: 'Juglone', formula: 'C10H6O3', family: 'naphthoquinone', tp: ['antibacterien','antifongique','anticancereux','allelopathique'], olf: 'Légèrement phénolique', src: 'Juglans nigra, Juglans regia' },
  { name: 'Plumbagin', formula: 'C11H8O3', family: 'naphthoquinone', tp: ['antibacterien','antifongique','anticancereux','anti-inflammatoire'], olf: 'Inodore', src: 'Plumbago zeylanica, Drosera spp.' },
  { name: 'Hypericin', formula: 'C30H16O8', family: 'naphtodianthrone', tp: ['antidepresseur','antiviral','anticancereux (photodynamique)'], olf: 'Inodore', src: 'Hypericum perforatum' },
  { name: 'Hyperforin', formula: 'C35H52O4', family: 'phloroglucinol', tp: ['antidepresseur','antibacterien','anti-inflammatoire'], olf: 'Balsamique, boisé', src: 'Hypericum perforatum' },
  
  // Polysaccharides bioactifs (représentants)
  { name: 'Beta-glucane', formula: 'C6H10O5', family: 'polysaccharide', tp: ['immunomodulateur','hypocholesterolemiant','antidiabetique','prebiotique'], olf: 'Inodore', src: 'Avena sativa, Saccharomyces cerevisiae, Ganoderma lucidum' },
  
  // Acides aminés aromatiques bioactifs
  { name: 'L-DOPA', formula: 'C9H11NO4', family: 'acide amine', tp: ['precurseur dopamine','antiparkinsonien','antioxydant'], olf: 'Inodore', src: 'Mucuna pruriens, Vicia faba' },
  { name: 'Tyramine', formula: 'C8H11NO', family: 'amine biogene', tp: ['vasopresseur','neurotransmetteur','stimulant'], olf: 'Inodore', src: 'Fromages affinés, Tyramine spp., Citrus spp.' },
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

console.log('Créées: ' + created + ' | Mises à jour: ' + updated + ' | Ignorées: ' + skipped);

const [[row]] = await conn.execute(
  "SELECT COUNT(*) as total, SUM(CASE WHEN therapeuticProperties IS NOT NULL AND therapeuticProperties != '[]' AND therapeuticProperties != '' THEN 1 ELSE 0 END) as wt FROM molecules"
);
console.log('Couverture thérapeutique: ' + row.wt + '/' + row.total + ' (' + (row.wt/row.total*100).toFixed(1) + '%)');

await conn.end();
