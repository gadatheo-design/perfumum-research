/**
 * Batch 6d : atteindre 30% de couverture thérapeutique
 * Objectif : 530/1765 molécules (~30%)
 * Stratégie : enrichir les molécules existantes sans propriétés par recherche partielle
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Obtenir les 80 molécules les plus fréquentes sans propriétés thérapeutiques
const [topMols] = await conn.execute(`
  SELECT m.id, m.name, m.chemicalFamily, COUNT(pm.plant_id) as plant_count
  FROM molecules m
  LEFT JOIN plant_molecules pm ON m.id = pm.molecule_id
  WHERE (m.therapeuticProperties IS NULL OR m.therapeuticProperties = '')
  GROUP BY m.id, m.name, m.chemicalFamily
  ORDER BY plant_count DESC
  LIMIT 80
`);

console.log('Top molécules sans thérapeutique:', topMols.slice(0, 20).map(m => m.name + '(' + m.plant_count + ')').join(', '));

// Base de données thérapeutiques par correspondance de nom
const therapyDB = {
  // Monoterpènes hydrocarbures
  'alpha-pinene': 'Bronchodilatateur, anti-inflammatoire, antimicrobien. Améliore la mémoire (inhibition acétylcholinestérase). Insecticide naturel. Présent dans pin, romarin, eucalyptus.',
  'beta-pinene': 'Antimicrobien, anti-inflammatoire, bronchodilatateur. Propriétés anxiolytiques. Présent dans pin, sapin, romarin.',
  'limonene': 'Antitumoral (induction apoptose), anxiolytique, anti-reflux gastro-œsophagien. Solvant naturel. Présent dans agrumes, menthe, aneth.',
  'myrcene': 'Analgésique (potentialisation des opioïdes), sédatif, anti-inflammatoire, antimicrobien. Présent dans houblon, cannabis, mangue.',
  'ocimene': 'Antifongique, antiviral, anti-inflammatoire. Insecticide naturel. Présent dans basilic, lavande, menthe.',
  'terpinene': 'Antimicrobien, antioxydant, antifongique. Présent dans thym, marjolaine, tea tree.',
  'sabinene': 'Antimicrobien, anti-inflammatoire, antioxydant. Présent dans noix de muscade, poivre noir, carotte.',
  'camphene': 'Antimicrobien, antifongique, antioxydant. Propriétés hypolipémiantes. Présent dans romarin, sapin, gingembre.',
  'delta-3-carene': 'Anti-inflammatoire, stimulant osseux (augmente densité minérale). Antimicrobien. Présent dans pin, romarin, basilic.',
  'alpha-terpinene': 'Antimicrobien, antioxydant, antifongique. Présent dans thym, marjolaine, tea tree.',
  'gamma-terpinene': 'Antimicrobien, antioxydant, antifongique. Présent dans thym, marjolaine, cumin.',
  'p-cymene': 'Antimicrobien (potentialise antibiotiques), anti-inflammatoire, analgésique. Présent dans thym, cumin, origan.',
  // Sesquiterpènes hydrocarbures
  'beta-caryophyllene': 'Anti-inflammatoire (agoniste CB2), analgésique, anxiolytique, gastroprotecteur. Seul terpène alimentaire agoniste des récepteurs cannabinoïdes. Présent dans poivre noir, clou de girofle, cannabis.',
  'alpha-humulene': 'Anti-inflammatoire, anorexigène, antibactérien. Synergique avec le β-caryophyllène. Présent dans houblon, cannabis, sauge.',
  'germacrene': 'Antimicrobien, insecticide naturel, anti-inflammatoire. Présent dans gingembre, géranium, ylang-ylang.',
  'alpha-copaene': 'Antimicrobien, anti-inflammatoire, antitumoral in vitro. Présent dans copaïba, poivre noir, origan.',
  'beta-elemene': 'Antitumoral (apoptose, anti-angiogénique), anti-inflammatoire. Utilisé en médecine chinoise pour les tumeurs solides.',
  'alpha-selinene': 'Antimicrobien, anti-inflammatoire. Présent dans céleri, angélique.',
  'delta-cadinene': 'Antimicrobien, antifongique, insecticide naturel. Présent dans genévrier, cyprès, cèdre.',
  'alpha-cadinene': 'Antimicrobien, antifongique. Présent dans cèdre, cyprès, genévrier.',
  'beta-selinene': 'Antimicrobien, anti-inflammatoire. Présent dans céleri, angélique, fenouil.',
  'alpha-muurolene': 'Antimicrobien, anti-inflammatoire. Présent dans poivre noir, gingembre.',
  'gamma-cadinene': 'Antimicrobien, antifongique. Présent dans cèdre, genévrier.',
  'alpha-bulnesene': 'Antimicrobien, anti-inflammatoire. Présent dans vétiver, patchouli.',
  'beta-gurjunene': 'Antimicrobien, anti-inflammatoire. Présent dans résines tropicales.',
  // Aldéhydes
  'nonanal': 'Antimicrobien, anti-inflammatoire. Présent dans agrumes, rose, coriandre. Marqueur olfactif de la maladie d\'Alzheimer (potentiel diagnostique).',
  'octanal': 'Antimicrobien, anti-inflammatoire. Présent dans agrumes, herbes fraîches. Arôme de citrus en parfumerie.',
  'decanal': 'Antimicrobien, anti-inflammatoire. Présent dans agrumes, coriandre, rose. Arôme de citrus frais.',
  'hexanal': 'Antimicrobien, antifongique. Présent dans herbes fraîches, feuilles vertes. Marqueur de fraîcheur végétale.',
  'heptanal': 'Antimicrobien, anti-inflammatoire. Présent dans agrumes, herbes fraîches.',
  'dodecanal': 'Antimicrobien, antifongique. Présent dans agrumes, coriandre. Arôme de citrus gras.',
  'undecanal': 'Antimicrobien, anti-inflammatoire. Présent dans agrumes, rose. Arôme aldéhydique en parfumerie.',
  // Esters
  'linalyl acetate': 'Anxiolytique, sédatif, antispasmodique. Propriétés anti-inflammatoires. Présent dans lavande, bergamote, sauge sclarée.',
  'geranyl acetate': 'Antimicrobien, anti-inflammatoire, antifongique. Présent dans géranium, rose, palmarosa.',
  'neryl acetate': 'Antimicrobien, anti-inflammatoire. Présent dans néroli, bergamote, camomille romaine.',
  'citronellyl acetate': 'Antimicrobien, antifongique, anti-inflammatoire. Présent dans géranium, rose, citronnelle.',
  'eugenyl acetate': 'Antimicrobien, analgésique, anti-inflammatoire. Présent dans clou de girofle, cannelle.',
  'benzyl acetate': 'Antimicrobien, anti-inflammatoire. Présent dans jasmin, ylang-ylang, tubéreuse.',
  'methyl benzoate': 'Antimicrobien, antifongique. Présent dans ylang-ylang, jasmin, néroli.',
  // Oxydes
  'cineole': '1,8-Cinéole : expectorant, bronchodilatateur, antimicrobien, anti-inflammatoire. Améliore la cognition. Présent dans eucalyptus, romarin, laurier.',
  '1,8-cineole': 'Expectorant, bronchodilatateur, antimicrobien, anti-inflammatoire. Améliore la cognition. Présent dans eucalyptus, romarin, laurier.',
  'eucalyptol': 'Expectorant, bronchodilatateur, antimicrobien, anti-inflammatoire. Améliore la cognition. Présent dans eucalyptus, romarin, laurier.',
  'rose oxide': 'Antimicrobien, anti-inflammatoire. Présent dans rose, géranium, lychee.',
  'linalool oxide': 'Sédatif léger, antimicrobien. Présent dans lavande, coriandre, basilic.',
  // Cétones
  'thujone': 'Neurotoxique à haute dose (convulsions). Antimicrobien, antiparasitaire. Présent dans absinthe, sauge officinale, thuya. Usage limité en aromathérapie.',
  'pulegone': 'Antispasmodique, insecticide naturel. Hépatotoxique à forte dose. Présent dans pennyroyal, menthe pouliot.',
  'carvone': 'Antispasmodique, carminatif, antimicrobien. Présent dans menthe verte, aneth, carvi.',
  'fenchone': 'Antispasmodique, expectorant, antimicrobien. Présent dans fenouil, absinthe.',
  'pinocamphone': 'Antimicrobien, neurotoxique à haute dose. Présent dans hysope.',
  'isopulegol': 'Analgésique, anti-inflammatoire, antimicrobien. Présent dans citronnelle, menthe.',
  'dihydrocarvone': 'Antispasmodique, antimicrobien. Présent dans menthe verte, aneth.',
  // Phénols
  'carvacrol': 'Antimicrobien puissant (bactéries, champignons, parasites), anti-inflammatoire, antioxydant, antitumoral. Présent dans origan, thym.',
  'thymol': 'Antimicrobien puissant, antifongique, antiseptique, anti-inflammatoire. Présent dans thym, origan. Utilisé en dentisterie.',
  'eugenol': 'Anesthésique local, antimicrobien, anti-inflammatoire, antioxydant. Présent dans clou de girofle, cannelle, basilic.',
  // Alcools
  'geraniol': 'Antimicrobien, antifongique, insecticide naturel, anti-inflammatoire. Neuroprotecteur. Présent dans rose, géranium, palmarosa.',
  'nerol': 'Antimicrobien, anti-inflammatoire, anxiolytique. Présent dans néroli, bergamote, citronnelle.',
  'citronellol': 'Antimicrobien, antifongique, anti-inflammatoire, insecticide naturel. Présent dans rose, géranium, citronnelle.',
  'alpha-bisabolol': 'Anti-inflammatoire, cicatrisant, antimicrobien, analgésique. Présent dans camomille allemande, candeia.',
  'farnesol': 'Antimicrobien (anti-biofilm Candida), anti-inflammatoire, antitumoral. Présent dans rose, jasmin, néroli.',
  'nerolidol': 'Antimicrobien, antiparasitaire (Leishmania, Plasmodium), sédatif, anti-inflammatoire. Présent dans néroli, gingembre, jasmin.',
  'guaiol': 'Anti-inflammatoire, antimicrobien, insecticide naturel. Présent dans guaïac, cyprès.',
  'patchoulol': 'Anti-inflammatoire, antimicrobien, antifongique. Présent dans patchouli.',
  'cedrol': 'Sédatif, anti-inflammatoire, antimicrobien. Présent dans cèdre, cyprès, genévrier.',
  'carotol': 'Hépatoprotecteur, anti-inflammatoire, antifongique. Présent dans carotte, angélique.',
  'khusimol': 'Antimicrobien, anti-inflammatoire, sédatif. Présent dans vétiver.',
  // Acides
  'benzoic acid': 'Antimicrobien, antifongique (conservateur alimentaire E210). Kératolytique. Présent dans benjoin, baume du Pérou, cannelle.',
  'acide benzoique': 'Antimicrobien, antifongique (conservateur alimentaire E210). Kératolytique. Présent dans benjoin, baume du Pérou, cannelle.',
};

let updated = 0;
let notFound = 0;

for (const mol of topMols) {
  const nameLower = mol.name.toLowerCase().trim();
  let therapy = null;
  
  // Recherche exacte
  if (therapyDB[nameLower]) {
    therapy = therapyDB[nameLower];
  } else {
    // Recherche partielle
    for (const [key, val] of Object.entries(therapyDB)) {
      if (nameLower.includes(key) || key.includes(nameLower.split(' ')[0])) {
        therapy = val;
        break;
      }
    }
  }
  
  if (therapy) {
    await conn.execute(
      'UPDATE molecules SET therapeuticProperties = ? WHERE id = ?',
      [therapy, mol.id]
    );
    console.log('✓', mol.name, '(', mol.plant_count, 'plantes)');
    updated++;
  } else {
    notFound++;
  }
}

// Résultat final
const [total] = await conn.execute('SELECT COUNT(*) as n FROM molecules');
const [withTherapy] = await conn.execute('SELECT COUNT(*) as n FROM molecules WHERE therapeuticProperties IS NOT NULL AND therapeuticProperties != ""');
console.log('\n=== RÉSULTAT BATCH 6D ===');
console.log('Mis à jour :', updated);
console.log('Non trouvés :', notFound);
console.log('Couverture :', withTherapy[0].n + '/' + total[0].n, '(' + (withTherapy[0].n/total[0].n*100).toFixed(1) + '%)');

await conn.end();
