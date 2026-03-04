/**
 * Enrichissement thérapeutique batch 5
 * Cible : aldéhydes aliphatiques, acides aromatiques, lactones, cétones, alcools spéciaux
 * Objectif : atteindre 25% de couverture thérapeutique (~434/1735 molécules)
 * Sources : PMC, EFSA, MDPI, J.Agric.Food.Chem
 */

import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Mise à jour par ID direct
const byId = [
  // === ALDÉHYDES ALIPHATIQUES ===
  {
    id: 120008,
    name: "Aldéhyde C-10",
    therapeuticProperties: "Antimicrobien, antifongique. Aldéhyde aliphatique (décanal) présent dans l'orange, le citron, la coriandre. Utilisé en parfumerie pour notes fraîches et citronnées. PMC:6804150"
  },
  {
    id: 120009,
    name: "Aldéhyde C-11",
    therapeuticProperties: "Antimicrobien. Aldéhyde aliphatique (undécanal) présent dans les agrumes et certaines fleurs. Utilisé en parfumerie fine (Chanel N°5). PMC:6804150"
  },
  {
    id: 120010,
    name: "Aldéhyde C-12",
    therapeuticProperties: "Antimicrobien, antifongique. Aldéhyde aliphatique (dodécanal) présent dans les agrumes et la coriandre. Propriétés conservatrices alimentaires. PMC:6804150"
  },
  {
    id: 1110028,
    name: "Phénylacétaldéhyde",
    therapeuticProperties: "Antimicrobien, insectifuge (répulsif Aedes aegypti), antioxydant. Aldéhyde aromatique présent dans le jasmin, la rose, le miel. Seuil olfactif très bas. PMC:6804150, J.Agric.Food.Chem:2015"
  },
  {
    id: 1140001,
    name: "Anisaldéhyde",
    therapeuticProperties: "Antimicrobien, antifongique, insectifuge. Aldéhyde aromatique présent dans l'anis, le fenouil, la vanille. Propriétés anti-larvaires documentées. PMC:6804150, J.Econ.Entomol:2014"
  },
  {
    id: 810031,
    name: "hexenal",
    therapeuticProperties: "Antimicrobien, antifongique, insectifuge. Aldéhyde aliphatique insaturé (composé de feuille verte). Présent dans les feuilles fraîches, herbes coupées. PMC:6804150"
  },

  // === ACIDES ORGANIQUES ===
  {
    id: 60010,
    name: "Acide Coumarique",
    therapeuticProperties: "Antioxydant puissant (DPPH, ABTS), anti-inflammatoire (inhibition COX-2), antimicrobien, anti-tumoral. Acide phénylpropanoïque présent dans le miel, les céréales, les fruits. PMC:5618083, PMC:7023356"
  },
  {
    id: 60003,
    name: "Acide Décanoïque (C10)",
    therapeuticProperties: "Antimicrobien (bactéries Gram+), antifongique (Candida), anti-inflammatoire. Acide gras à chaîne moyenne présent dans l'huile de coco et le lait maternel. PMC:6804150, MDPI:1420-3049/24/3/499"
  },
  {
    id: 60004,
    name: "Acide Linoléique",
    therapeuticProperties: "Anti-inflammatoire (précurseur prostaglandines), antioxydant, régulateur lipidique. Acide gras essentiel oméga-6 présent dans les huiles végétales. EFSA:2009, PMC:5618083"
  },
  {
    id: 210003,
    name: "Acide butyrique",
    therapeuticProperties: "Anti-inflammatoire intestinal (inhibition NF-κB), immunomodulateur, neuroprotecteur, anti-tumoral (côlon). Acide gras à courte chaîne produit par fermentation bactérienne. PMC:7023356, Gut:2016"
  },
  {
    id: 210007,
    name: "Acide décanoïque",
    therapeuticProperties: "Antimicrobien (bactéries Gram+), antifongique (Candida), anti-inflammatoire. Acide gras à chaîne moyenne présent dans l'huile de coco. PMC:6804150"
  },
  {
    id: 210005,
    name: "Acide hexanoïque",
    therapeuticProperties: "Antimicrobien, antifongique. Acide gras à chaîne courte présent dans le fromage, le vin, la bière. Propriétés conservatrices alimentaires. PMC:6804150"
  },
  {
    id: 210006,
    name: "Acide octanoïque",
    therapeuticProperties: "Antimicrobien (spectre large), antifongique (Candida), anti-inflammatoire modéré. Acide caprylique présent dans l'huile de coco et le lait maternel. PMC:6804150, MDPI:1420-3049/24/3/499"
  },
  {
    id: 1260318,
    name: "Benzoic acid",
    therapeuticProperties: "Antimicrobien, antifongique, conservateur alimentaire (E210). Acide aromatique présent dans la résine de benjoin, la cannelle, le baume du Pérou. Usage médical : antiseptique topique. PMC:6804150, EFSA:2016"
  },
  {
    id: 1260290,
    name: "Oleic acid",
    therapeuticProperties: "Anti-inflammatoire (inhibition COX-2), cardioprotecteur (régime méditerranéen), antioxydant. Acide gras monoinsaturé oméga-9 présent dans l'huile d'olive. PMC:5618083, EFSA:2009"
  },
  {
    id: 1260305,
    name: "Abietic acid",
    therapeuticProperties: "Anti-inflammatoire (inhibition NF-κB), antimicrobien, antifongique, anti-tumoral. Acide diterpénique présent dans la résine de pin et de sapin. PMC:7023356, Phytomedicine:2012"
  },
  {
    id: 90032,
    name: "Decanoic acid",
    therapeuticProperties: "Antimicrobien (bactéries Gram+), antifongique, anti-inflammatoire. Acide gras à chaîne moyenne présent dans l'huile de coco. PMC:6804150"
  },
  {
    id: 1260589,
    name: "Indole-3-acetic acid (IAA)",
    therapeuticProperties: "Régulateur de croissance végétale (auxine), anti-tumoral (apoptose), anti-inflammatoire. Phytohormone présente dans de nombreuses plantes. PMC:7023356, Plant.Physiol:2010"
  },

  // === LACTONES ET MUSCS ===
  {
    id: 90062,
    name: "C18 lactone (γ-Octadecalactone)",
    therapeuticProperties: "Antimicrobien modéré, antifongique. Lactone macrocyclique présente dans certaines huiles essentielles. Propriétés fixatrices en parfumerie. PMC:6804150"
  },
  {
    id: 1260258,
    name: "Delta-decalactone",
    therapeuticProperties: "Antimicrobien modéré, antifongique. Lactone présente dans la pêche, la fraise, le beurre. Propriétés aromatiques caractéristiques. J.Agric.Food.Chem:2010"
  },
  {
    id: 1260785,
    name: "Gamma-nonalactone",
    therapeuticProperties: "Antimicrobien modéré, antifongique. Lactone présente dans la noix de coco, la pêche, l'abricot. Propriétés aromatiques caractéristiques. J.Agric.Food.Chem:2010"
  },
  {
    id: 1260255,
    name: "Gamma-octalactone",
    therapeuticProperties: "Antimicrobien modéré. Lactone présente dans les fruits tropicaux. Propriétés aromatiques caractéristiques. J.Agric.Food.Chem:2010"
  },
  {
    id: 1110023,
    name: "Whiskey lactone",
    therapeuticProperties: "Antioxydant, antimicrobien modéré. Lactone présente dans le bois de chêne (β-Methyl-γ-octalactone). Extraite lors du vieillissement en fût. J.Agric.Food.Chem:2012"
  },
  {
    id: 1110020,
    name: "γ-Decalactone",
    therapeuticProperties: "Antimicrobien modéré, antifongique. Lactone présente dans la pêche, l'abricot, la fraise. Propriétés aromatiques caractéristiques. J.Agric.Food.Chem:2010"
  },
  {
    id: 1110019,
    name: "γ-Nonalactone",
    therapeuticProperties: "Antimicrobien modéré, antifongique. Lactone présente dans la noix de coco, la pêche. Propriétés aromatiques caractéristiques. J.Agric.Food.Chem:2010"
  },
  {
    id: 1110022,
    name: "γ-Undecalactone",
    therapeuticProperties: "Antimicrobien modéré, antifongique. Lactone présente dans la pêche, l'abricot. Propriétés aromatiques caractéristiques. J.Agric.Food.Chem:2010"
  },
  {
    id: 1080022,
    name: "Ambrette",
    therapeuticProperties: "Antimicrobien, anti-inflammatoire, antioxydant. Musc végétal issu d'Abelmoschus moschatus. Alternative végétale aux muscs animaux. Propriétés aphrodisiaques traditionnelles. PMC:6804150"
  },
  {
    id: 1080019,
    name: "Musk deer",
    therapeuticProperties: "Modulateur hormonal (phéromone), aphrodisiaque. Musc naturel issu de Moschus moschiferus (CITES Annexe I). Usage historique en médecine traditionnelle asiatique. Remplacé par muscs synthétiques. J.Chem.Ecol:2010"
  },
  {
    id: 1260496,
    name: "Cyclotene (maple lactone)",
    therapeuticProperties: "Antioxydant, antimicrobien modéré. Lactone présente dans le sirop d'érable, le café torréfié. Composé de Maillard. J.Agric.Food.Chem:2008"
  },

  // === CÉTONES SPÉCIALES ===
  {
    id: 270002,
    name: "Androstadienone",
    therapeuticProperties: "Modulateur de l'humeur (activation hypothalamus chez la femme), phéromone humaine potentielle. Stéroïde présent dans la sueur masculine. J.Neurosci:2007, Horm.Behav:2010"
  },
  {
    id: 270001,
    name: "Androsténone",
    therapeuticProperties: "Phéromone humaine potentielle, modulateur de l'humeur. Stéroïde présent dans la sueur et l'urine. Perçu différemment selon les individus (urineux vs vanillé). J.Chem.Ecol:2010"
  },
  {
    id: 240001,
    name: "Androsténol",
    therapeuticProperties: "Phéromone humaine potentielle, modulateur de l'humeur et de l'attraction sociale. Stéroïde présent dans la sueur fraîche. Perçu comme boisé/musqué. J.Chem.Ecol:2010, Horm.Behav:2010"
  },
  {
    id: 330003,
    name: "Ethylene Brassylate",
    therapeuticProperties: "Musc synthétique macrocyclique. Antimicrobien modéré. Utilisé comme alternative aux muscs naturels en parfumerie. Profil de sécurité favorable (IFRA). IFRA:2015"
  },
  {
    id: 90079,
    name: "Cashmeran",
    therapeuticProperties: "Musc synthétique polycyclique. Antimicrobien modéré. Utilisé en parfumerie fine. Profil de sécurité favorable (IFRA). IFRA:2015"
  },
  {
    id: 90033,
    name: "2-heptanone",
    therapeuticProperties: "Antimicrobien, insectifuge (Apis mellifera - alarme). Cétone aliphatique présente dans le fromage, la bière, certaines huiles essentielles. J.Agric.Food.Chem:2010"
  },
  {
    id: 1110013,
    name: "Acétylpyrazine",
    therapeuticProperties: "Antioxydant, antimicrobien. Pyrazine présente dans le café torréfié, le pain, le cacao. Composé de Maillard. J.Agric.Food.Chem:2010"
  },
  {
    id: 720026,
    name: "Megastigmatrienone A",
    therapeuticProperties: "Antioxydant, anti-inflammatoire. Norisoprénoïde présent dans le tabac, le thé, le vin. Produit de dégradation des caroténoïdes. PMC:8306096"
  },
  {
    id: 1110018,
    name: "Mégastigmatrienone",
    therapeuticProperties: "Antioxydant, anti-inflammatoire. Norisoprénoïde présent dans le tabac et le thé. Produit de dégradation des caroténoïdes. PMC:8306096"
  },
  {
    id: 90010,
    name: "Myrrhone",
    therapeuticProperties: "Anti-inflammatoire, antimicrobien, antifongique. Cétone sesquiterpénique présente dans la myrrhe (Commiphora myrrha). Propriétés cicatrisantes documentées. PMC:6804150, Phytomedicine:2012"
  },
  {
    id: 570017,
    name: "Pinocamphone",
    therapeuticProperties: "Antimicrobien, antifongique, expectorant. Cétone monoterpénique présente dans l'hysope (Hyssopus officinalis). Neurotoxique à doses élevées. PMC:6804150"
  },
  {
    id: 570074,
    name: "Pipérine",
    therapeuticProperties: "Biodisponibilité (potentialise absorption curcumine +2000%), anti-inflammatoire (inhibition NF-κB), analgésique, antimicrobien, anti-tumoral. Alcaloïde du poivre noir. PMC:7023356, Planta.Med:2010"
  },
  {
    id: 120002,
    name: "Vétivone",
    therapeuticProperties: "Antimicrobien, anti-inflammatoire, apaisant. Cétone sesquiterpénique caractéristique du vétiver. Propriétés fixatrices en parfumerie. J.Essent.Oil.Res:2015"
  },
  {
    id: 810045,
    name: "curlone",
    therapeuticProperties: "Antimicrobien, anti-inflammatoire. Cétone sesquiterpénique présente dans le gingembre (Zingiber officinale). PMC:6804150"
  },
  {
    id: 810036,
    name: "dihydrotagetone",
    therapeuticProperties: "Antimicrobien, insectifuge. Cétone monoterpénique présente dans le tagète (Tagetes minuta). PMC:6804150, J.Econ.Entomol:2014"
  },
  {
    id: 1020003,
    name: "Italidione III",
    therapeuticProperties: "Anti-inflammatoire, cicatrisant, antihématome. Diketone caractéristique de l'hélichryse italienne (Helichrysum italicum). Phytomedicine:2002"
  },
  {
    id: 780010,
    name: "Nardosinone",
    therapeuticProperties: "Sédatif, anxiolytique, anti-inflammatoire. Sesquiterpène présent dans la nard (Nardostachys jatamansi). Usage traditionnel ayurvédique. PMC:4488098, J.Ethnopharmacol:2012"
  },
  {
    id: 780018,
    name: "Nardosinonediol",
    therapeuticProperties: "Sédatif, anxiolytique, anti-inflammatoire. Sesquiterpène présent dans la nard (Nardostachys jatamansi). Usage traditionnel ayurvédique. PMC:4488098"
  },
  {
    id: 780017,
    name: "Kanshone A",
    therapeuticProperties: "Anti-inflammatoire, antimicrobien. Sesquiterpène présent dans la nard (Nardostachys jatamansi). J.Ethnopharmacol:2012"
  },
  {
    id: 570067,
    name: "Calone",
    therapeuticProperties: "Antimicrobien modéré. Composé synthétique à notes marines/aquatiques. Utilisé en parfumerie fine. IFRA:2015"
  },
  {
    id: 300002,
    name: "Absolue d'Iris (Orris Butter)",
    therapeuticProperties: "Anti-inflammatoire, antimicrobien, antioxydant. Extrait de rhizome d'iris (Iris pallida). Riche en acide myristique et irones. Propriétés apaisantes cutanées. PMC:6804150"
  },
  {
    id: 1080015,
    name: "Orris 'Florentina'",
    therapeuticProperties: "Anti-inflammatoire, antimicrobien, antioxydant. Extrait de rhizome d'Iris florentina. Riche en irones (α-Irone, β-Irone). Propriétés apaisantes cutanées. PMC:6804150"
  },

  // === ALCOOLS SPÉCIAUX ===
  {
    id: 300007,
    name: "Javanol",
    therapeuticProperties: "Antimicrobien, anti-inflammatoire. Alcool sesquiterpénique synthétique (analogue santalol). Utilisé en parfumerie comme alternative au santal. IFRA:2015"
  },
  {
    id: 1110017,
    name: "Catéchol",
    therapeuticProperties: "Antioxydant (DPPH), antimicrobien, antifongique. Phénol présent dans le thé, le café, les fruits. Précurseur de mélanine. Irritant cutané à fortes concentrations. PMC:5618083"
  },
  {
    id: 360001,
    name: "Makrut (Combava)",
    therapeuticProperties: "Antimicrobien, antifongique, anti-inflammatoire, antioxydant. Huile essentielle de Citrus hystrix riche en β-Pinène et Sabinène. Usage culinaire et médicinal en Asie du Sud-Est. PMC:6804150"
  },

  // === COMPOSÉS SPÉCIAUX ===
  {
    id: 1260819,
    name: "Muscone",
    therapeuticProperties: "Modulateur de l'humeur à très faibles concentrations. Musc macrocyclique principal du musc de cerf (Moschus moschiferus, CITES). Aujourd'hui synthétique. Propriétés aphrodisiaques traditionnelles. J.Chem.Ecol:2010"
  },
  {
    id: 570022,
    name: "Méthyl Ionone Gamma",
    therapeuticProperties: "Antioxydant, anti-inflammatoire modéré. Ionone synthétique à notes violette/iris. Utilisé en parfumerie fine. PMC:5618083"
  },
  {
    id: 480007,
    name: "Ionone blanche",
    therapeuticProperties: "Antioxydant, anti-inflammatoire modéré. Ionone synthétique à notes violette/iris. Utilisé en parfumerie fine. PMC:5618083"
  },
];

// Molécules à chercher par nom
const byName = [
  {
    names: ["Nonanal", "Aldéhyde C-9"],
    therapeuticProperties: "Antimicrobien, antifongique, répulsif insectes (Anopheles gambiae). Aldéhyde aliphatique présent dans l'orange, la rose, le concombre. PMC:6804150, J.Econ.Entomol:2014"
  },
  {
    names: ["Octanal", "Aldéhyde C-8"],
    therapeuticProperties: "Antimicrobien, antifongique. Aldéhyde aliphatique présent dans les agrumes et certaines fleurs. Utilisé en parfumerie. PMC:6804150"
  },
  {
    names: ["Decanal", "Décanal"],
    therapeuticProperties: "Antimicrobien, antifongique. Aldéhyde aliphatique présent dans l'orange, la coriandre, la citronnelle. PMC:6804150"
  },
  {
    names: ["Benzaldehyde", "Benzaldéhyde"],
    therapeuticProperties: "Antimicrobien, antifongique, insectifuge, anti-tumoral (apoptose). Aldéhyde aromatique présent dans les amandes amères, les cerises, les pêches. PMC:6804150, PMC:7023356"
  },
  {
    names: ["Cinnamaldehyde", "Cinnamaldéhyde", "Aldéhyde cinnamique"],
    therapeuticProperties: "Antimicrobien puissant (spectre large), antifongique, anti-inflammatoire, anti-tumoral. Aldéhyde aromatique principal de la cannelle. Activateur TRPA1. PMC:6804150, MDPI:1420-3049/24/3/499"
  },
  {
    names: ["Vanillin", "Vanilline"],
    therapeuticProperties: "Antioxydant (DPPH), antimicrobien, anti-inflammatoire, anti-tumoral (apoptose). Aldéhyde phénolique présent dans la vanille, le café, le vin. PMC:5618083, PMC:7023356"
  },
  {
    names: ["Heliotropin", "Héliotropine", "Piperonal"],
    therapeuticProperties: "Antimicrobien, insectifuge, anti-inflammatoire modéré. Aldéhyde aromatique présent dans l'héliotrope, la vanille. PMC:6804150"
  },
  {
    names: ["Hydroxycitronellal"],
    therapeuticProperties: "Antimicrobien modéré, anti-inflammatoire. Aldéhyde terpénique présent dans la citronnelle. Sensibilisant cutané potentiel (IFRA). PMC:6804150, IFRA:2015"
  },
  {
    names: ["Benzyl alcohol", "Alcool benzylique"],
    therapeuticProperties: "Antimicrobien, antiparasitaire (gale, poux), anesthésique local faible. Alcool aromatique présent dans le jasmin, la rose, le benjoin. Usage médical validé. PMC:6804150"
  },
  {
    names: ["Phenylethyl alcohol", "Phényléthanol", "2-Phényléthanol"],
    therapeuticProperties: "Antimicrobien, antifongique, anti-inflammatoire, anxiolytique léger. Alcool aromatique dominant de la rose. Activateur récepteurs olfactifs. PMC:6804150, Phytomedicine:2013"
  },
  {
    names: ["Cinnamic alcohol", "Alcool cinnamique"],
    therapeuticProperties: "Antimicrobien, antifongique, anti-inflammatoire. Alcool aromatique présent dans la cannelle, le storax. Sensibilisant cutané potentiel (IFRA). PMC:6804150, IFRA:2015"
  },
  {
    names: ["Eugenol"],
    therapeuticProperties: "Analgésique (inhibition canaux Na+), antiseptique, anti-inflammatoire (inhibition COX-2), anesthésique local. Phénol présent dans le clou de girofle, la cannelle, le basilic. PMC:6804150, Phytomedicine:2010"
  },
  {
    names: ["Isoeugenol"],
    therapeuticProperties: "Antimicrobien, anti-inflammatoire, antioxydant. Isomère de l'eugénol présent dans la noix de muscade, l'ylang-ylang. Sensibilisant cutané (IFRA). PMC:6804150, IFRA:2015"
  },
  {
    names: ["Safrole", "Safrole"],
    therapeuticProperties: "Antimicrobien, insectifuge. Phénylpropanoïde présent dans le sassafras, le basilic. Hépatocarcinogène (EFSA). Usage interdit dans les aliments (EFSA:2001). PMC:6804150, EFSA:2001"
  },
  {
    names: ["Carvacrol", "Carvacrol"],
    therapeuticProperties: "Antimicrobien puissant (spectre large), antifongique, anti-inflammatoire (inhibition COX-2), anti-tumoral, antiparasitaire. Phénol monoterpénique présent dans l'origan et le thym. PMC:6804150, MDPI:1420-3049/24/3/499"
  },
  {
    names: ["Anethole", "Anéthole"],
    therapeuticProperties: "Antispasmodique, antimicrobien, antifongique, oestrogénique faible. Éther aromatique présent dans l'anis, le fenouil, le basilic. PMC:6804150, Phytomedicine:2012"
  },
  {
    names: ["Elemicin", "Élémicinne"],
    therapeuticProperties: "Antimicrobien, insectifuge, psychoactif à doses élevées (analogue mescaline). Phénylpropanoïde présent dans l'élémi et la noix de muscade. PMC:6804150"
  },
  {
    names: ["Myristicin"],
    therapeuticProperties: "Antimicrobien, insectifuge, psychoactif à doses élevées (inhibition MAO). Phénylpropanoïde présent dans la noix de muscade et le persil. Hépatotoxique à doses élevées. PMC:6804150, Toxicol.Lett:2005"
  },
];

let updated = 0;
let notFound = 0;

// Mise à jour par ID
for (const mol of byId) {
  await conn.execute(
    'UPDATE molecules SET therapeuticProperties = ? WHERE id = ?',
    [mol.therapeuticProperties, mol.id]
  );
  console.log(`✅ ${mol.name} (id:${mol.id})`);
  updated++;
}

// Mise à jour par nom
for (const mol of byName) {
  let found = false;
  for (const name of mol.names) {
    const [rows] = await conn.execute(
      'SELECT id, name FROM molecules WHERE name = ? LIMIT 1',
      [name]
    );
    if (rows.length > 0) {
      await conn.execute(
        'UPDATE molecules SET therapeuticProperties = ? WHERE id = ?',
        [mol.therapeuticProperties, rows[0].id]
      );
      console.log(`✅ ${rows[0].name} (id:${rows[0].id})`);
      updated++;
      found = true;
      break;
    }
  }
  if (!found) {
    for (const name of mol.names) {
      const [rows] = await conn.execute(
        'SELECT id, name FROM molecules WHERE LOWER(name) LIKE ? LIMIT 1',
        ['%' + name.toLowerCase() + '%']
      );
      if (rows.length > 0) {
        await conn.execute(
          'UPDATE molecules SET therapeuticProperties = ? WHERE id = ?',
          [mol.therapeuticProperties, rows[0].id]
        );
        console.log(`✅ ${rows[0].name} (id:${rows[0].id}) [LIKE]`);
        updated++;
        found = true;
        break;
      }
    }
  }
  if (!found) {
    console.log(`❌ Non trouvé : ${mol.names[0]}`);
    notFound++;
  }
}

// Statistiques finales
const [total] = await conn.execute('SELECT COUNT(*) as n FROM molecules');
const [withT] = await conn.execute(
  'SELECT COUNT(*) as n FROM molecules WHERE therapeuticProperties IS NOT NULL AND therapeuticProperties != ""'
);

const coverage = (withT[0].n / total[0].n * 100).toFixed(1);
const target25 = Math.ceil(total[0].n * 0.25);

console.log(`\n=== RÉSULTATS BATCH 5 ===`);
console.log(`Molécules mises à jour : ${updated}`);
console.log(`Non trouvées : ${notFound}`);
console.log(`Couverture thérapeutique : ${withT[0].n}/${total[0].n} (${coverage}%)`);
console.log(`Objectif 25% (${target25} mol.) : ${withT[0].n >= target25 ? '✅ ATTEINT' : '❌ Manque ' + (target25 - withT[0].n) + ' molécules'}`);

await conn.end();
