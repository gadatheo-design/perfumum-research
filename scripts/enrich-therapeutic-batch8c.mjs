import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Batch 8c : alcaloïdes pyrrolizidiniques, terpènes supplémentaires, phénylpropanoïdes, pigments
const molecules = [
  // Alcaloïdes pyrrolizidiniques
  { name: 'Senecionine', formula: 'C18H25NO5', family: 'alcaloide pyrrolizidinique', tp: ['hepatotoxique (usage medical limité)','antitumoral etudes'], olf: 'Inodore', src: 'Senecio jacobaea, Senecio vulgaris' },
  { name: 'Symphytine', formula: 'C20H29NO7', family: 'alcaloide pyrrolizidinique', tp: ['hepatotoxique','cicatrisant topique (usage externe)'], olf: 'Inodore', src: 'Symphytum officinale' },
  
  // Alcaloïdes tropaniques supplémentaires
  { name: 'Scopolamine', formula: 'C17H21NO4', family: 'alcaloide tropanique', tp: ['antiemetique','antispasmodique','sedatif','antivertigineux'], olf: 'Inodore', src: 'Datura stramonium, Hyoscyamus niger, Scopolia carniolica' },
  { name: 'Homatropine', formula: 'C16H21NO3', family: 'alcaloide tropanique', tp: ['mydriateur','antispasmodique'], olf: 'Inodore', src: 'Semi-synthèse d\'atropine' },
  
  // Alcaloïdes quinolizidiniques
  { name: 'Sparteine', formula: 'C15H26N2', family: 'alcaloide quinolizidinique', tp: ['antiarythmique','ocytocique','antihypertenseur'], olf: 'Inodore', src: 'Cytisus scoparius, Lupinus spp.' },
  { name: 'Lupinine', formula: 'C10H19NO', family: 'alcaloide quinolizidinique', tp: ['antidiabetique etudes','antibacterien'], olf: 'Inodore', src: 'Lupinus spp.' },
  
  // Phénylpropanoïdes supplémentaires
  { name: 'Chlorogenic acid methyl ester', formula: 'C17H20O9', family: 'acide phenolique', tp: ['antioxydant','anti-inflammatoire'], olf: 'Inodore', src: 'Coffea arabica, Ilex paraguariensis' },
  { name: 'Sinapic acid', formula: 'C11H12O5', family: 'acide phenolique', tp: ['antioxydant','anti-inflammatoire','neuroprotecteur'], olf: 'Inodore', src: 'Brassica napus, Sinapis alba, Oryza sativa' },
  { name: 'Caffeic acid', formula: 'C9H8O4', family: 'acide phenolique', tp: ['antioxydant','anti-inflammatoire','antibacterien','anticancereux'], olf: 'Inodore', src: 'Coffea arabica, Echinacea purpurea, Propolis' },
  { name: 'p-Coumaric acid', formula: 'C9H8O3', family: 'acide phenolique', tp: ['antioxydant','anti-inflammatoire','antibacterien'], olf: 'Inodore', src: 'Oryza sativa, Vitis vinifera, Piper nigrum' },
  { name: 'Vanillic acid', formula: 'C8H8O4', family: 'acide phenolique', tp: ['antioxydant','antibacterien','anti-inflammatoire'], olf: 'Vanille légère', src: 'Vanilla planifolia, Olea europaea' },
  { name: 'Syringic acid', formula: 'C9H10O5', family: 'acide phenolique', tp: ['antioxydant','antibacterien','hepatoprotecteur'], olf: 'Inodore', src: 'Syringa vulgaris, Olea europaea, Vitis vinifera' },
  
  // Terpènes diterpéniques supplémentaires
  { name: 'Taxol (Paclitaxel)', formula: 'C47H51NO14', family: 'diterpene', tp: ['anticancereux majeur','antimitotique'], olf: 'Inodore', src: 'Taxus brevifolia, Taxus baccata' },
  { name: 'Andrographolide', formula: 'C20H30O5', family: 'diterpene', tp: ['anti-inflammatoire','antibacterien','antiviral','immunostimulant'], olf: 'Amer', src: 'Andrographis paniculata' },
  { name: 'Triptolide', formula: 'C20H24O6', family: 'diterpene', tp: ['anti-inflammatoire','immunosuppresseur','anticancereux'], olf: 'Inodore', src: 'Tripterygium wilfordii' },
  { name: 'Oridonin', formula: 'C20H28O6', family: 'diterpene', tp: ['anticancereux','anti-inflammatoire','antibacterien'], olf: 'Inodore', src: 'Isodon rubescens' },
  { name: 'Ginkgolide B', formula: 'C20H24O10', family: 'diterpene', tp: ['antagoniste PAF','neuroprotecteur','vasodilatateur'], olf: 'Inodore', src: 'Ginkgo biloba' },
  { name: 'Bilobalide', formula: 'C15H18O8', family: 'sesquiterpene lactone', tp: ['neuroprotecteur','anti-inflammatoire'], olf: 'Inodore', src: 'Ginkgo biloba' },
  
  // Terpènes sesquiterpéniques supplémentaires
  { name: 'Parthenolide', formula: 'C15H20O3', family: 'sesquiterpene lactone', tp: ['anti-inflammatoire','anticancereux','antimigraineux'], olf: 'Inodore', src: 'Tanacetum parthenium' },
  { name: 'Artemisinin', formula: 'C15H22O5', family: 'sesquiterpene lactone', tp: ['antipaludeen','anticancereux','antiviral'], olf: 'Inodore', src: 'Artemisia annua' },
  { name: 'Absinthin', formula: 'C30H40O4', family: 'sesquiterpene lactone', tp: ['amer digestif','antiparasitaire','antibacterien'], olf: 'Amer', src: 'Artemisia absinthium' },
  { name: 'Helenalin', formula: 'C15H18O4', family: 'sesquiterpene lactone', tp: ['anti-inflammatoire','anticancereux'], olf: 'Inodore', src: 'Arnica montana' },
  
  // Pigments et caroténoïdes
  { name: 'Beta-carotene', formula: 'C40H56', family: 'carotenoid', tp: ['antioxydant','precurseur vitamine A','immunostimulant','photoprotecteur'], olf: 'Inodore', src: 'Daucus carota, Lycopersicon esculentum, Spinacia oleracea' },
  { name: 'Lycopene', formula: 'C40H56', family: 'carotenoid', tp: ['antioxydant puissant','anticancereux (prostate)','cardioprotecteur'], olf: 'Inodore', src: 'Lycopersicon esculentum, Citrullus lanatus' },
  { name: 'Lutein', formula: 'C40H56O2', family: 'carotenoid', tp: ['protecteur oculaire','antioxydant','anti-inflammatoire'], olf: 'Inodore', src: 'Tagetes erecta, Spinacia oleracea, Zea mays' },
  { name: 'Zeaxanthin', formula: 'C40H56O2', family: 'carotenoid', tp: ['protecteur oculaire','antioxydant'], olf: 'Inodore', src: 'Zea mays, Capsicum annuum, Lycium chinense' },
  { name: 'Astaxanthin', formula: 'C40H52O4', family: 'carotenoid', tp: ['antioxydant puissant','anti-inflammatoire','neuroprotecteur','cardioprotecteur'], olf: 'Inodore', src: 'Haematococcus pluvialis, Phaffia rhodozyma' },
  { name: 'Fucoxanthin', formula: 'C42H58O6', family: 'carotenoid', tp: ['antioxydant','anti-inflammatoire','antiobesité','anticancereux'], olf: 'Inodore', src: 'Algues brunes (Undaria pinnatifida, Fucus vesiculosus)' },
  
  // Vitamines et cofacteurs
  { name: 'Acide ascorbique', formula: 'C6H8O6', family: 'vitamine', tp: ['antioxydant majeur','immunostimulant','collagene synthese','antiscorbutique'], olf: 'Acide, légèrement citronné', src: 'Ubiquitaire (Citrus spp., Rosa canina, Capsicum annuum)' },
  { name: 'Tocopherol alpha', formula: 'C29H50O2', family: 'vitamine', tp: ['antioxydant liposoluble','immunostimulant','cardioprotecteur','neuroprotecteur'], olf: 'Inodore', src: 'Triticum germ, Helianthus annuus, Olea europaea' },
  { name: 'Riboflavine', formula: 'C17H20N4O6', family: 'vitamine', tp: ['antioxydant','cofacteur enzymatique','antimigraineux'], olf: 'Inodore', src: 'Ubiquitaire (levures, céréales, légumineuses)' },
  
  // Phytostérols
  { name: 'Beta-sitosterol', formula: 'C29H50O', family: 'phytosterol', tp: ['hypocholesterolemiant','anti-inflammatoire','immunomodulateur','antiprostatique'], olf: 'Inodore', src: 'Serenoa repens, Pygeum africanum, Cucurbita pepo' },
  { name: 'Stigmasterol', formula: 'C29H48O', family: 'phytosterol', tp: ['hypocholesterolemiant','anti-inflammatoire','antidiabetique'], olf: 'Inodore', src: 'Glycine max, Stigmasterol spp.' },
  { name: 'Campesterol', formula: 'C28H48O', family: 'phytosterol', tp: ['hypocholesterolemiant','anti-inflammatoire'], olf: 'Inodore', src: 'Brassica spp., Oryza sativa' },
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
