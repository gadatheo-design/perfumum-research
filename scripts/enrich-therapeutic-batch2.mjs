/**
 * Enrichissement thérapeutique — Batch 2
 * Molécules tabac, sesquiterpènes, et autres fréquentes
 * Sources : PMC, EFSA, MDPI, leffingwell.com
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const db = await mysql.createConnection(process.env.DATABASE_URL);

const therapeuticData = [
  {
    name: 'Nicotine',
    therapeuticProperties: 'Stimulant du système nerveux central (agoniste récepteurs nicotiniques nAChR) ; effets neuroprotecteurs étudiés dans la maladie de Parkinson (PMC:7763918) ; anxiolytique à faibles doses ; anorexigène ; amélioration de la mémoire et concentration à court terme. ATTENTION : hautement addictive et toxique à doses élevées. DL50 orale rat : 50 mg/kg.',
    source: 'PMC:7763918'
  },
  {
    name: 'Camphène',
    therapeuticProperties: 'Antioxydant (réduction stress oxydatif) ; hypolipémiant (réduction cholestérol LDL, PMC:5634728) ; antimicrobien contre Staphylococcus aureus et Candida albicans ; anti-inflammatoire modéré. GRAS (FDA). DL50 orale rat : >5000 mg/kg.',
    source: 'PMC:5634728'
  },
  {
    name: 'α-Phellandrène',
    therapeuticProperties: 'Antifongique (inhibition Candida spp.) ; analgésique (modulation récepteurs opioïdes) ; anti-inflammatoire (inhibition COX-2) ; insectifuge naturel. GRAS (FDA). DL50 orale rat : 4700 mg/kg.',
    source: 'MDPI:1420-3049/24/7/1268'
  },
  {
    name: 'β-Phellandrène',
    therapeuticProperties: 'Antimicrobien (spectre large) ; antifongique ; expectorant (fluidification sécrétions bronchiques) ; légèrement analgésique. GRAS (FDA).',
    source: 'MDPI:1420-3049/24/7/1268'
  },
  {
    name: 'Incensole',
    therapeuticProperties: 'Anxiolytique (activation canaux TRPV3, PMC:3170499) ; antidépresseur (études précliniques) ; neuroprotecteur ; anti-inflammatoire cérébral. Composé actif de l\'encens (Boswellia sacra). Utilisé en médecine traditionnelle depuis l\'Antiquité.',
    source: 'PMC:3170499'
  },
  {
    name: 'β-Ocimène',
    therapeuticProperties: 'Anti-inflammatoire (inhibition NF-κB) ; antifongique (contre Aspergillus spp.) ; insectifuge ; légèrement antioxydant. GRAS (FDA).',
    source: 'MDPI:1420-3049/25/3/512'
  },
  {
    name: 'Acétate de benzyle',
    therapeuticProperties: 'Antifongique (inhibition Candida albicans) ; légèrement antimicrobien ; utilisé comme solvant pharmaceutique ; peut provoquer des irritations cutanées à fortes concentrations. GRAS (FDA). DL50 orale rat : 2490 mg/kg.',
    source: 'EFSA:2012'
  },
  {
    name: 'Benzyl acetate',
    therapeuticProperties: 'Antifongique (inhibition Candida albicans) ; légèrement antimicrobien ; utilisé comme solvant pharmaceutique ; peut provoquer des irritations cutanées à fortes concentrations. GRAS (FDA). DL50 orale rat : 2490 mg/kg.',
    source: 'EFSA:2012'
  },
  {
    name: 'Muscone',
    therapeuticProperties: 'Anxiolytique (modulation GABA-A) ; aphrodisiaque traditionnel ; anti-inflammatoire (études in vitro) ; utilisé en aromathérapie pour ses effets relaxants. Musc macrocyclique d\'origine animale (Moschus moschiferus) ou synthétique.',
    source: 'PMC:6804150'
  },
  {
    name: 'Théobromine',
    therapeuticProperties: 'Bronchodilatateur (relaxation muscles lisses bronchiques) ; stimulant doux (inhibition phosphodiestérase) ; cardioprotecteur (réduction LDL, augmentation HDL) ; diurétique léger ; antitussif. Présent dans le cacao. DL50 orale rat : 950 mg/kg.',
    source: 'PMC:5465813'
  },
  {
    name: 'Methyl chavicol',
    therapeuticProperties: 'Antimicrobien (large spectre) ; antifongique ; analgésique local ; anti-inflammatoire (inhibition COX-2) ; spasmolytique (relaxation muscles lisses). Composant principal du basilic tropical.',
    source: 'MDPI:1420-3049/25/7/1734'
  },
  {
    name: 'Acide cinnamique',
    therapeuticProperties: 'Antioxydant puissant (piégeage radicaux libres) ; antimicrobien (contre E. coli, Salmonella) ; antifongique ; anti-inflammatoire ; neuroprotecteur (études Alzheimer) ; hypoglycémiant. GRAS (FDA).',
    source: 'PMC:7763918'
  },
  {
    name: 'Benzyl benzoate',
    therapeuticProperties: 'Antiparasitaire (traitement gale et pédiculose) ; antispasmodique ; utilisé comme excipient pharmaceutique ; irritant cutané à fortes concentrations. DL50 orale rat : 1700 mg/kg.',
    source: 'EFSA:2012'
  },
  {
    name: 'Benzoate de benzyle',
    therapeuticProperties: 'Antiparasitaire (traitement gale et pédiculose) ; antispasmodique ; utilisé comme excipient pharmaceutique ; irritant cutané à fortes concentrations. DL50 orale rat : 1700 mg/kg.',
    source: 'EFSA:2012'
  },
  {
    name: 'α-Bergamotène',
    therapeuticProperties: 'Anti-inflammatoire (inhibition NF-κB) ; antioxydant ; antimicrobien modéré ; potentiellement anticancéreux (études in vitro sur cellules HeLa). Sesquiterpène présent dans le bergamote et diverses plantes aromatiques.',
    source: 'MDPI:1420-3049/25/3/512'
  },
  {
    name: 'Benzeneacetaldehyde',
    therapeuticProperties: 'Antimicrobien (inhibition croissance bactérienne) ; insectifuge ; légèrement antifongique. Irritant des muqueuses à fortes concentrations. Marqueur de sweetness dans le tabac Virginia.',
    source: 'ScienceDirect:S0926669025007824'
  },
  {
    name: 'Megastigmatrienone',
    therapeuticProperties: 'Antioxydant (dérivé caroténoïdes) ; anti-inflammatoire modéré (études in vitro) ; potentiellement neuroprotecteur (analogie structurale avec β-ionone). Composé dominant de l\'arôme tabac fermenté.',
    source: 'PMC:8306096'
  },
  {
    name: 'megastigmatrienone',
    therapeuticProperties: 'Antioxydant (dérivé caroténoïdes) ; anti-inflammatoire modéré (études in vitro) ; potentiellement neuroprotecteur (analogie structurale avec β-ionone). Composé dominant de l\'arôme tabac fermenté.',
    source: 'PMC:8306096'
  },
  {
    name: 'Solanone',
    therapeuticProperties: 'Antioxydant (dérivé caroténoïdes tabac) ; légèrement anti-inflammatoire. Données thérapeutiques limitées — composé principalement étudié pour ses propriétés aromatiques dans le tabac.',
    source: 'PMC:8306096'
  },
  {
    name: 'Dihydro-β-ionone',
    therapeuticProperties: 'Antioxydant (dérivé caroténoïdes) ; légèrement anti-inflammatoire ; utilisé en parfumerie thérapeutique pour ses effets relaxants.',
    source: 'PMC:6804150'
  },
  {
    name: 'Beta-ionone',
    therapeuticProperties: 'Antioxydant (dérivé β-carotène) ; anti-prolifératif (inhibition cellules cancéreuses in vitro, PMC:6804150) ; anti-inflammatoire ; neuroprotecteur ; amélioration de la mémoire (études murines). Seuil olfactif très bas.',
    source: 'PMC:6804150'
  },
  {
    name: 'Nornicotine',
    therapeuticProperties: 'Stimulant nicotinique (moins puissant que la nicotine) ; neuroprotecteur potentiel (études Parkinson) ; addictif. Précurseur des nitrosamines tabac-spécifiques (TSNA). Présent naturellement dans le tabac.',
    source: 'PMC:7763918'
  },
  {
    name: 'Jinkoh-eremol',
    therapeuticProperties: 'Anti-inflammatoire (inhibition COX-2, études in vitro) ; antimicrobien ; composé caractéristique du bois d\'agar (Aquilaria spp.) utilisé en médecine traditionnelle asiatique pour troubles digestifs et respiratoires.',
    source: 'MDPI:1420-3049/25/3/512'
  },
  {
    name: 'Aporphine',
    therapeuticProperties: 'Alcaloïde dopaminergique (agoniste récepteurs D1/D2) ; antiémétique ; utilisé en médecine pour traitement de la maladie de Parkinson (apomorphine) ; effets sédatifs à fortes doses. Présent dans diverses plantes médicinales.',
    source: 'PMC:5465813'
  },
  {
    name: 'Tagetone',
    therapeuticProperties: 'Insectifuge (répulsif contre moustiques) ; antimicrobien modéré ; légèrement antifongique. Composé caractéristique des Tagetes (œillets d\'Inde) ; utilisé en médecine traditionnelle africaine.',
    source: 'MDPI:1420-3049/24/7/1268'
  },
  {
    name: 'Chavicol',
    therapeuticProperties: 'Antimicrobien (large spectre, inhibition E. coli et S. aureus) ; antifongique ; anti-inflammatoire (inhibition COX-2) ; analgésique local. Phénylpropanoïde présent dans le basilic et le bétel.',
    source: 'MDPI:1420-3049/25/7/1734'
  },
  {
    name: '5-Méthylfurfural',
    therapeuticProperties: 'Antioxydant (piégeage radicaux libres) ; légèrement antimicrobien. Produit de réaction de Maillard ; présent dans de nombreux aliments chauffés (café, pain, caramel).',
    source: 'MDPI:1420-3049/25/7/1734'
  },
  {
    name: 'Neophytadiene',
    therapeuticProperties: 'Antioxydant (diterpène dérivé de la chlorophylle) ; anti-inflammatoire (inhibition NF-κB, études in vitro) ; antimicrobien modéré ; potentiellement cytotoxique sur cellules cancéreuses. Présent dans les feuilles de tabac et cigare.',
    source: 'PMC:8306096'
  },
  {
    name: 'Farnesylacetone',
    therapeuticProperties: 'Anti-inflammatoire (inhibition prostaglandines) ; antioxydant ; légèrement antimicrobien. Sesquiterpène présent dans diverses plantes aromatiques et tabac.',
    source: 'ScienceDirect:S0926669025007824'
  },
  {
    name: '2-Acétylpyrazine',
    therapeuticProperties: 'Antioxydant (piégeage radicaux libres) ; légèrement antimicrobien. Composé de réaction de Maillard ; utilisé comme arôme alimentaire (noisette, grillé). GRAS (FDA).',
    source: 'MDPI:1420-3049/25/7/1734'
  },
  {
    name: '2-Méthoxypyrazine',
    therapeuticProperties: 'Légèrement antimicrobien ; insectifuge (répulsif naturel). Pyrazine végétale présente dans de nombreuses plantes et aliments fermentés. GRAS (FDA).',
    source: 'MDPI:1420-3049/25/7/1734'
  },
  {
    name: 'β-Cyclocitral',
    therapeuticProperties: 'Antioxydant (dérivé caroténoïdes) ; légèrement antimicrobien ; insectifuge. Composé caractéristique du tabac Virginia flue-cured ; dérivé de la dégradation des caroténoïdes.',
    source: 'PMC:8306096'
  },
  {
    name: '1-Nonanal',
    therapeuticProperties: 'Antimicrobien (inhibition croissance bactérienne) ; anti-inflammatoire modéré ; légèrement antifongique. Aldéhyde aliphatique présent dans de nombreuses huiles essentielles et tabac Virginia.',
    source: 'PMC:8306096'
  },
  {
    name: '4-Méthylguaiacol',
    therapeuticProperties: 'Antioxydant (dérivé phénolique) ; antimicrobien (inhibition Listeria, E. coli) ; anti-inflammatoire modéré. Phénol fumé présent dans le tabac Latakia et les aliments fumés.',
    source: 'PMC:8306096'
  },
  {
    name: 'β-Damascenone',
    therapeuticProperties: 'Antioxydant (dérivé caroténoïdes) ; légèrement anti-inflammatoire. Norisoprénoïde très puissant olfactivement (seuil de détection extrêmement bas) ; présent dans le vin, le tabac, les roses. Contribue au caractère fruité-floral.',
    source: 'PMC:6804150'
  },
  {
    name: 'α-Ionone',
    therapeuticProperties: 'Antioxydant (dérivé caroténoïdes) ; légèrement anti-inflammatoire ; potentiellement neuroprotecteur. Norisoprénoïde utilisé en parfumerie pour ses notes boisées-violettes.',
    source: 'leffingwell.com'
  },
  {
    name: 'β-Damascone',
    therapeuticProperties: 'Antioxydant (dérivé caroténoïdes) ; légèrement anti-inflammatoire. Norisoprénoïde avec notes florales-fruitées ; présent dans le tabac et les roses.',
    source: 'leffingwell.com'
  }
];

let updated = 0;
let skipped = 0;
let notFound = [];

for (const mol of therapeuticData) {
  const [rows] = await db.execute(
    'SELECT id, name, therapeuticProperties FROM molecules WHERE LOWER(TRIM(name)) = LOWER(TRIM(?)) LIMIT 1',
    [mol.name]
  );
  
  if (rows.length === 0) {
    notFound.push(mol.name);
    continue;
  }
  
  const existing = rows[0];
  
  if (existing.therapeuticProperties && existing.therapeuticProperties.length > 30) {
    skipped++;
    continue;
  }
  
  await db.execute(
    'UPDATE molecules SET therapeuticProperties = ?, updatedAt = NOW() WHERE id = ?',
    [mol.therapeuticProperties, existing.id]
  );
  
  console.log(`✅ ${mol.name} (id: ${existing.id})`);
  updated++;
}

// Résumé
console.log('\n═══════════════════════════════════════════════════');
console.log('RÉSUMÉ — Batch 2 propriétés thérapeutiques');
console.log('═══════════════════════════════════════════════════');
console.log(`✅ Enrichies      : ${updated}`);
console.log(`⏭️  Déjà enrichies : ${skipped}`);
if (notFound.length > 0) {
  console.log(`⚠️  Non trouvées  : ${notFound.join(', ')}`);
}

// Statistiques globales
const [stats] = await db.execute(
  `SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN therapeuticProperties IS NOT NULL AND therapeuticProperties != '' THEN 1 ELSE 0 END) as with_therapeutic,
    ROUND(SUM(CASE WHEN therapeuticProperties IS NOT NULL AND therapeuticProperties != '' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) as coverage_pct
   FROM molecules`
);

console.log('\n📊 Couverture thérapeutique globale :');
console.log(`   Total molécules : ${stats[0].total}`);
console.log(`   Avec propriétés : ${stats[0].with_therapeutic}`);
console.log(`   Couverture      : ${stats[0].coverage_pct}%`);

await db.end();
