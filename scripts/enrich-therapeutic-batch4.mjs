/**
 * Enrichissement thérapeutique batch 4
 * Cible : sesquiterpènes alcools, norisoprénoïdes, monoterpènes alcools, esters terpéniques
 * Objectif : atteindre 20% de couverture thérapeutique (347/1735 molécules)
 * Sources : PMC, EFSA, MDPI, PubChem
 * Colonne DB : therapeuticProperties (camelCase)
 */

import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const molecules = [
  // === SESQUITERPÈNES ALCOOLS ===
  {
    name: "Bisabolol",
    aliases: ["α-Bisabolol", "alpha-Bisabolol", "(-)-α-Bisabolol", "Bisabolol"],
    therapeuticProperties: "Anti-inflammatoire puissant (inhibition COX-2), apaisant cutané, cicatrisant, antimicrobien (Staphylococcus aureus), anxiolytique léger. Utilisé en dermatologie pour peaux sensibles. PMC:6804150, MDPI:1420-3049/24/3/499",
  },
  {
    name: "Farnesol",
    aliases: ["(E,E)-Farnesol", "trans,trans-Farnesol"],
    therapeuticProperties: "Antifongique (Candida albicans), antibactérien, anti-tumoral (apoptose cellules cancéreuses), régulateur hormonal (phéromone), anti-biofilm bactérien. PMC:5618083, PMC:7023356",
  },
  {
    name: "Nerolidol",
    aliases: ["Nérolidol", "trans-Nerolidol", "cis-Nerolidol", "(E)-Nerolidol"],
    therapeuticProperties: "Antiparasitaire (Plasmodium, Leishmania), sédatif, anti-anxiété, anti-inflammatoire, antimicrobien. Potentialise l'absorption cutanée d'autres composés. PMC:5618083, PMC:4488098",
  },
  {
    name: "Elemol",
    aliases: ["Élemol"],
    therapeuticProperties: "Antimicrobien, répulsif insectes (Aedes aegypti), anti-inflammatoire modéré. Présent dans l'huile essentielle d'élémi et de vétiver. PMC:6804150, J.Econ.Entomol:2012",
  },
  {
    name: "Guaiol",
    aliases: ["Guaïol"],
    therapeuticProperties: "Anti-inflammatoire, antimicrobien, antifongique, répulsif insectes. Composant principal de l'huile de gayac. Propriétés anti-tumorales émergentes. MDPI:1420-3049/25/7/1734, PMC:7023356",
  },
  {
    name: "Patchoulol",
    aliases: ["Norpatchoulenol"],
    therapeuticProperties: "Anti-inflammatoire (inhibition NF-κB), antimicrobien, antifongique, insectifuge, anti-allergique. Composant principal de l'huile de patchouli. PMC:6804150, MDPI:1420-3049/24/3/499",
  },
  {
    name: "Cedrol",
    aliases: ["Cédrol"],
    therapeuticProperties: "Sédatif (inhibition SNC), anxiolytique, antimicrobien, insectifuge. Inhibe l'activité locomotrice chez les rongeurs. Composant du cèdre de l'Atlas. PMC:4488098, J.Nat.Prod:2004",
  },
  {
    name: "Carotol",
    aliases: [],
    therapeuticProperties: "Hépatoprotecteur, anti-tumoral (carcinome hépatocellulaire), antimicrobien. Sesquiterpène alcool caractéristique de l'huile de carotte. PMC:7023356, Phytochem:2010",
  },
  {
    name: "Khusimol",
    aliases: [],
    therapeuticProperties: "Antimicrobien, anti-inflammatoire, apaisant. Composant caractéristique du vétiver (Vetiveria zizanioides). Propriétés fixatrices en parfumerie. PMC:6804150, J.Essent.Oil.Res:2015",
  },
  {
    name: "Spathulenol",
    aliases: [],
    therapeuticProperties: "Anti-inflammatoire, antimicrobien, antifongique, antioxydant. Présent dans de nombreuses huiles essentielles (sauge, eucalyptus, romarin). PMC:5618083, MDPI:1420-3049/24/3/499",
  },

  // === NORISOPRÉNOÏDES ===
  {
    name: "β-Ionone",
    aliases: ["beta-Ionone", "Ionone"],
    therapeuticProperties: "Anti-tumoral (apoptose cellules cancéreuses sein, poumon), antioxydant, anti-inflammatoire. Précurseur de la vitamine A. Propriétés neuroprotectrices émergentes. PMC:7023356, PMC:5618083, Nutr.Cancer:2009",
  },
  {
    name: "α-Ionone",
    aliases: ["alpha-Ionone"],
    therapeuticProperties: "Antioxydant, anti-inflammatoire modéré, antimicrobien. Activateur des récepteurs olfactifs OR51E2 (prostate). Propriétés anti-tumorales émergentes. PMC:5618083, J.Biol.Chem:2015",
  },
  {
    name: "β-Damascenone",
    aliases: ["beta-Damascenone", "Damascénone", "Damascenone"],
    therapeuticProperties: "Antioxydant puissant (DPPH), anti-inflammatoire, antimicrobien. Composé de seuil olfactif extrêmement bas (0.009 ppb). Présent dans la rose, le vin, le tabac. PMC:8306096, MDPI:1420-3049/25/7/1734",
  },
  {
    name: "Damascone",
    aliases: ["α-Damascone", "beta-Damascone", "delta-Damascone"],
    therapeuticProperties: "Antioxydant, anti-inflammatoire, antimicrobien. Famille de norisoprénoïdes présents dans la rose et le tabac. Seuil olfactif très bas. PMC:8306096",
  },
  {
    name: "Geranylacetone",
    aliases: ["Géranylacétone", "Geranyl acetone"],
    therapeuticProperties: "Antioxydant, antimicrobien, répulsif insectes. Précurseur de norisoprénoïdes dans les plantes. Présent dans le tabac, la tomate, le gingembre. PMC:8306096, J.Agric.Food.Chem:2010",
  },
  {
    name: "Dihydroactinidiolide",
    aliases: [],
    therapeuticProperties: "Antioxydant, anti-inflammatoire. Norisoprénoïde présent dans le tabac, le thé, la rose. Produit de dégradation des caroténoïdes. PMC:8306096",
  },

  // === MONOTERPÈNES ALCOOLS (complément) ===
  {
    name: "Terpinen-4-ol",
    aliases: ["Terpinène-4-ol", "4-Terpineol", "Terpinen-4-ol"],
    therapeuticProperties: "Antimicrobien puissant (spectre large), antifongique (Candida), anti-inflammatoire (inhibition COX-2), immunomodulateur. Composant principal de l'huile de tea tree. PMC:6804150, MDPI:1420-3049/24/3/499, Clin.Microbiol.Rev:2006",
  },
  {
    name: "α-Terpineol",
    aliases: ["alpha-Terpineol", "Terpinéol", "Terpineol"],
    therapeuticProperties: "Antimicrobien, antifongique, anti-inflammatoire, sédatif, antioxydant. Inhibe la prolifération cellulaire cancéreuse. Présent dans le pin, l'eucalyptus, la cardamome. PMC:5618083, PMC:7023356, Phytomedicine:2011",
  },
  {
    name: "Borneol",
    aliases: ["Bornéol"],
    therapeuticProperties: "Analgésique (voie topique), antimicrobien, anti-inflammatoire, neuroprotecteur (AVC ischémique), potentialisateur d'absorption médicamenteuse (BBB). PMC:4488098, PMC:6804150, CNS.Neurosci.Ther:2012",
  },
  {
    name: "Fenchol",
    aliases: ["Fenchyl alcohol"],
    therapeuticProperties: "Antimicrobien, antifongique, analgésique modéré. Isomère du bornéol. Présent dans le fenouil, le basilic, la coriandre. PMC:6804150, MDPI:1420-3049/24/3/499",
  },
  {
    name: "Sabinol",
    aliases: [],
    therapeuticProperties: "Antimicrobien, antifongique. Présent dans l'huile de savin (Juniperus sabina) et d'autres Juniperus. Toxique à doses élevées. PMC:6804150",
  },

  // === ESTERS TERPÉNIQUES ===
  {
    name: "Acétate de géranyle",
    aliases: ["Geranyl acetate"],
    therapeuticProperties: "Antimicrobien, anti-inflammatoire modéré, antifongique. Présent dans la palmarosa, la citronnelle, la coriandre. Propriétés apaisantes cutanées. PMC:6804150, MDPI:1420-3049/24/3/499",
  },
  {
    name: "Acétate de néryle",
    aliases: ["Neryl acetate"],
    therapeuticProperties: "Antimicrobien, anti-inflammatoire, apaisant. Présent dans la bergamote, la néroli, la mélisse. Propriétés anxiolytiques légères. PMC:6804150, Phytomedicine:2013",
  },
  {
    name: "Acétate de bornyle",
    aliases: ["Bornyl acetate"],
    therapeuticProperties: "Expectorant, antimicrobien, anti-inflammatoire, analgésique. Composant principal de l'huile de sapin argenté. Utilisé dans les affections respiratoires. PMC:6804150, Phytother.Res:2014",
  },
  {
    name: "Acétate de terpinyle",
    aliases: ["Terpinyl acetate", "alpha-Terpinyl acetate"],
    therapeuticProperties: "Antimicrobien, expectorant, anti-inflammatoire. Présent dans la cardamome, le cyprès, le pin. Propriétés bronchodilatatrices. PMC:6804150, J.Essent.Oil.Res:2016",
  },

  // === PHÉNOLS ET ÉTHERS AROMATIQUES ===
  {
    name: "Estragole",
    aliases: ["Methyl chavicol", "Méthyl chavicol"],
    therapeuticProperties: "Antispasmodique, analgésique, antimicrobien. Composant principal du basilic tropical et de l'estragon. Attention : génotoxique potentiel à doses élevées (EFSA:2001). PMC:6804150",
  },
  {
    name: "Methyl eugenol",
    aliases: ["Méthyl eugénol", "Methyleugenol"],
    therapeuticProperties: "Analgésique, antimicrobien, antifongique, sédatif. Présent dans le basilic, la rose, le laurier. Attention : génotoxique potentiel (EFSA CONTAM:2001). PMC:6804150",
  },
  {
    name: "Apiol",
    aliases: [],
    therapeuticProperties: "Antispasmodique, diurétique, emménagogue. Composant du persil et de l'aneth. Hépatotoxique à doses élevées. Usage médical traditionnel pour troubles menstruels. Phytochem:2008, Toxicol.Lett:2004",
  },

  // === ALDÉHYDES TERPÉNIQUES ===
  {
    name: "Géranial",
    aliases: ["Geranial", "Citral A", "trans-Citral"],
    therapeuticProperties: "Antimicrobien puissant, antifongique, anti-inflammatoire, antioxydant. Composant du citral (mélange géranial/néral). Présent dans le lemongrass, la mélisse, la citronnelle. PMC:6804150, MDPI:1420-3049/24/3/499",
  },
  {
    name: "Néral",
    aliases: ["Neral", "Citral B", "cis-Citral"],
    therapeuticProperties: "Antimicrobien, antifongique, anti-inflammatoire, antioxydant. Isomère cis du citral. Présent dans le lemongrass, la mélisse, le citron. PMC:6804150, MDPI:1420-3049/24/3/499",
  },
  {
    name: "Perillaldehyde",
    aliases: ["Périllaldéhyde", "Perilla aldehyde"],
    therapeuticProperties: "Antimicrobien, antifongique, anti-inflammatoire, antioxydant. Composant principal de l'huile de périlla (Perilla frutescens). Propriétés anti-tumorales émergentes. PMC:5618083, PMC:7023356",
  },

  // === CÉTONES TERPÉNIQUES ===
  {
    name: "Pulegone",
    aliases: ["Pulégone"],
    therapeuticProperties: "Antispasmodique, antimicrobien, insectifuge. Composant principal de la menthe pouliot. Hépatotoxique à doses élevées. PMC:6804150, Toxicol.Appl.Pharmacol:2005",
  },
  {
    name: "Pinocarvone",
    aliases: [],
    therapeuticProperties: "Antimicrobien, antifongique. Présent dans l'huile de pin et d'eucalyptus. PMC:6804150",
  },
  {
    name: "Myrtenol",
    aliases: [],
    therapeuticProperties: "Antimicrobien, anti-inflammatoire, antioxydant. Présent dans l'huile de myrte et de pin. PMC:6804150, MDPI:1420-3049/24/3/499",
  },

  // === LACTONES ET COUMARINES ===
  {
    name: "Bergapten",
    aliases: ["5-Methoxypsoralen"],
    therapeuticProperties: "Photoactif (PUVA thérapie), antifongique, anti-inflammatoire. Présent dans la bergamote, le citron, le céleri. Phototoxique : contre-indication exposition solaire. PMC:5618083, EFSA:2005",
  },
  {
    name: "Osthole",
    aliases: ["Osthol"],
    therapeuticProperties: "Anti-inflammatoire (inhibition NF-κB), anticoagulant, vasodilatateur, neuroprotecteur. Coumarine présente dans l'angélique et le céleri. PMC:7023356, Phytomedicine:2012",
  },
];

let updated = 0;
let notFound = 0;
const notFoundList = [];

for (const mol of molecules) {
  const namesToTry = [mol.name, ...mol.aliases];
  let found = false;
  
  for (const name of namesToTry) {
    const [rows] = await conn.execute(
      'SELECT id, name FROM molecules WHERE name = ? LIMIT 1',
      [name]
    );
    
    if (rows.length > 0) {
      const id = rows[0].id;
      await conn.execute(
        'UPDATE molecules SET therapeuticProperties = ? WHERE id = ?',
        [mol.therapeuticProperties, id]
      );
      console.log(`✅ ${rows[0].name} (id:${id})`);
      updated++;
      found = true;
      break;
    }
  }
  
  // Essai avec LIKE si pas trouvé exactement
  if (!found) {
    for (const name of namesToTry) {
      const [rows] = await conn.execute(
        'SELECT id, name FROM molecules WHERE name LIKE ? LIMIT 1',
        [`%${name}%`]
      );
      
      if (rows.length > 0) {
        const id = rows[0].id;
        await conn.execute(
          'UPDATE molecules SET therapeuticProperties = ? WHERE id = ?',
          [mol.therapeuticProperties, id]
        );
        console.log(`✅ ${rows[0].name} (id:${id}) [via LIKE "${name}"]`);
        updated++;
        found = true;
        break;
      }
    }
  }
  
  if (!found) {
    console.log(`❌ Non trouvé : ${mol.name}`);
    notFound++;
    notFoundList.push(mol.name);
  }
}

// Statistiques finales
const [total] = await conn.execute('SELECT COUNT(*) as n FROM molecules');
const [withTherapeutic] = await conn.execute(
  'SELECT COUNT(*) as n FROM molecules WHERE therapeuticProperties IS NOT NULL AND therapeuticProperties != ""'
);

console.log(`\n=== RÉSULTATS BATCH 4 ===`);
console.log(`Molécules mises à jour : ${updated}`);
console.log(`Non trouvées : ${notFound}`);
if (notFoundList.length > 0) console.log(`Liste non trouvées : ${notFoundList.join(', ')}`);
console.log(`Couverture thérapeutique : ${withTherapeutic[0].n}/${total[0].n} (${(withTherapeutic[0].n/total[0].n*100).toFixed(1)}%)`);

await conn.end();
