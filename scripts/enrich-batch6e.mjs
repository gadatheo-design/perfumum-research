/**
 * Batch 6e : enrichir les molécules importantes existantes par recherche partielle
 * Objectif : atteindre 30% de couverture thérapeutique
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Paires (terme de recherche, propriétés thérapeutiques)
const enrichments = [
  ['pinene', 'Bronchodilatateur, anti-inflammatoire, antimicrobien. Améliore la mémoire (inhibition acétylcholinestérase). Insecticide naturel. Présent dans pin, romarin, eucalyptus.'],
  ['limonene', 'Antitumoral (induction apoptose), anxiolytique, anti-reflux gastro-œsophagien. Solvant naturel. Présent dans agrumes, menthe, aneth.'],
  ['myrcene', 'Analgésique (potentialisation des opioïdes), sédatif, anti-inflammatoire, antimicrobien. Présent dans houblon, cannabis, mangue.'],
  ['ocimene', 'Antifongique, antiviral, anti-inflammatoire. Insecticide naturel. Présent dans basilic, lavande, menthe.'],
  ['terpinene', 'Antimicrobien, antioxydant, antifongique. Présent dans thym, marjolaine, tea tree.'],
  ['sabinene', 'Antimicrobien, anti-inflammatoire, antioxydant. Présent dans noix de muscade, poivre noir, carotte.'],
  ['camphene', 'Antimicrobien, antifongique, antioxydant. Propriétés hypolipémiantes. Présent dans romarin, sapin, gingembre.'],
  ['delta-3-carene', 'Anti-inflammatoire, stimulant osseux (augmente densité minérale). Antimicrobien. Présent dans pin, romarin, basilic.'],
  ['cymene', 'Antimicrobien (potentialise antibiotiques), anti-inflammatoire, analgésique. Présent dans thym, cumin, origan.'],
  ['caryophyllene', 'Anti-inflammatoire (agoniste CB2), analgésique, anxiolytique, gastroprotecteur. Seul terpène alimentaire agoniste des récepteurs cannabinoïdes. Présent dans poivre noir, clou de girofle, cannabis.'],
  ['humulene', 'Anti-inflammatoire, anorexigène, antibactérien. Synergique avec le β-caryophyllène. Présent dans houblon, cannabis, sauge.'],
  ['germacrene', 'Antimicrobien, insecticide naturel, anti-inflammatoire. Présent dans gingembre, géranium, ylang-ylang.'],
  ['copaene', 'Antimicrobien, anti-inflammatoire, antitumoral in vitro. Présent dans copaïba, poivre noir, origan.'],
  ['elemene', 'Antitumoral (apoptose, anti-angiogénique), anti-inflammatoire. Utilisé en médecine chinoise pour les tumeurs solides.'],
  ['cadinene', 'Antimicrobien, antifongique, insecticide naturel. Présent dans genévrier, cyprès, cèdre.'],
  ['muurolene', 'Antimicrobien, anti-inflammatoire. Présent dans poivre noir, gingembre.'],
  ['nonanal', 'Antimicrobien, anti-inflammatoire. Présent dans agrumes, rose, coriandre. Marqueur olfactif de la maladie d\'Alzheimer (potentiel diagnostique).'],
  ['octanal', 'Antimicrobien, anti-inflammatoire. Présent dans agrumes, herbes fraîches. Arôme de citrus en parfumerie.'],
  ['decanal', 'Antimicrobien, anti-inflammatoire. Présent dans agrumes, coriandre, rose. Arôme de citrus frais.'],
  ['hexanal', 'Antimicrobien, antifongique. Présent dans herbes fraîches, feuilles vertes. Marqueur de fraîcheur végétale.'],
  ['heptanal', 'Antimicrobien, anti-inflammatoire. Présent dans agrumes, herbes fraîches.'],
  ['linalyl', 'Anxiolytique, sédatif, antispasmodique. Propriétés anti-inflammatoires. Présent dans lavande, bergamote, sauge sclarée.'],
  ['neryl acetate', 'Antimicrobien, anti-inflammatoire. Présent dans néroli, bergamote, camomille romaine.'],
  ['citronellyl acetate', 'Antimicrobien, antifongique, anti-inflammatoire. Présent dans géranium, rose, citronnelle.'],
  ['eugenyl acetate', 'Antimicrobien, analgésique, anti-inflammatoire. Présent dans clou de girofle, cannelle.'],
  ['cineole', 'Expectorant, bronchodilatateur, antimicrobien, anti-inflammatoire. Améliore la cognition. Présent dans eucalyptus, romarin, laurier.'],
  ['eucalyptol', 'Expectorant, bronchodilatateur, antimicrobien, anti-inflammatoire. Améliore la cognition. Présent dans eucalyptus, romarin, laurier.'],
  ['thujone', 'Neurotoxique à haute dose (convulsions). Antimicrobien, antiparasitaire. Présent dans absinthe, sauge officinale, thuya. Usage limité en aromathérapie.'],
  ['pulegone', 'Antispasmodique, insecticide naturel. Hépatotoxique à forte dose. Présent dans pennyroyal, menthe pouliot.'],
  ['carvone', 'Antispasmodique, carminatif, antimicrobien. Présent dans menthe verte, aneth, carvi.'],
  ['fenchone', 'Antispasmodique, expectorant, antimicrobien. Présent dans fenouil, absinthe.'],
  ['pinocamphone', 'Antimicrobien, neurotoxique à haute dose. Présent dans hysope.'],
  ['isopulegol', 'Analgésique, anti-inflammatoire, antimicrobien. Présent dans citronnelle, menthe.'],
  ['carvacrol', 'Antimicrobien puissant (bactéries, champignons, parasites), anti-inflammatoire, antioxydant, antitumoral. Présent dans origan, thym.'],
  ['thymol', 'Antimicrobien puissant, antifongique, antiseptique, anti-inflammatoire. Présent dans thym, origan. Utilisé en dentisterie.'],
  ['geraniol', 'Antimicrobien, antifongique, insecticide naturel, anti-inflammatoire. Neuroprotecteur. Présent dans rose, géranium, palmarosa.'],
  ['nerol', 'Antimicrobien, anti-inflammatoire, anxiolytique. Présent dans néroli, bergamote, citronnelle.'],
  ['citronellol', 'Antimicrobien, antifongique, anti-inflammatoire, insecticide naturel. Présent dans rose, géranium, citronnelle.'],
  ['bisabolol', 'Anti-inflammatoire, cicatrisant, antimicrobien, analgésique. Présent dans camomille allemande, candeia.'],
  ['farnesol', 'Antimicrobien (anti-biofilm Candida), anti-inflammatoire, antitumoral. Présent dans rose, jasmin, néroli.'],
  ['nerolidol', 'Antimicrobien, antiparasitaire (Leishmania, Plasmodium), sédatif, anti-inflammatoire. Présent dans néroli, gingembre, jasmin.'],
  ['guaiol', 'Anti-inflammatoire, antimicrobien, insecticide naturel. Présent dans guaïac, cyprès.'],
  ['patchoulol', 'Anti-inflammatoire, antimicrobien, antifongique. Présent dans patchouli.'],
  ['cedrol', 'Sédatif, anti-inflammatoire, antimicrobien. Présent dans cèdre, cyprès, genévrier.'],
  ['carotol', 'Hépatoprotecteur, anti-inflammatoire, antifongique. Présent dans carotte, angélique.'],
  ['khusimol', 'Antimicrobien, anti-inflammatoire, sédatif. Présent dans vétiver.'],
  ['benzoic acid', 'Antimicrobien, antifongique (conservateur alimentaire E210). Kératolytique. Présent dans benjoin, baume du Pérou, cannelle.'],
  ['acide benzoique', 'Antimicrobien, antifongique (conservateur alimentaire E210). Kératolytique. Présent dans benjoin, baume du Pérou, cannelle.'],
  ['valencene', 'Antioxydant, anti-inflammatoire, insecticide naturel. Présent dans orange, pamplemousse, tangerine.'],
  ['sesquiphellandrene', 'Antimicrobien, anti-inflammatoire. Présent dans gingembre, curcuma.'],
  ['guaiene', 'Anti-inflammatoire, antimicrobien. Présent dans patchouli, guaïac.'],
  ['vetiselenene', 'Antimicrobien, anti-inflammatoire. Présent dans vétiver.'],
  ['curcumene', 'Anti-inflammatoire, antifongique. Présent dans curcuma, gingembre.'],
  ['patchoulene', 'Anti-inflammatoire, antimicrobien. Présent dans patchouli.'],
  ['menthol', 'Analgésique (activation TRPM8), anesthésique local, antimicrobien, anti-prurigineux. Présent dans menthe poivrée, menthe des champs.'],
  ['menthone', 'Antimicrobien, antifongique, carminatif. Présent dans menthe poivrée, menthe des champs.'],
  ['isomenthone', 'Antimicrobien, antifongique. Présent dans menthe, géranium.'],
  ['pulegol', 'Analgésique, anti-inflammatoire, antimicrobien. Présent dans menthe pouliot, citronnelle.'],
  ['terpineol', 'Antimicrobien, antifongique, anti-inflammatoire, sédatif. Présent dans tea tree, pin, eucalyptus.'],
  ['borneol', 'Antimicrobien, anti-inflammatoire, analgésique, sédatif. Présent dans romarin, lavande, camphre.'],
  ['fenchol', 'Antimicrobien, anti-inflammatoire. Présent dans fenouil, basilic.'],
  ['terpinen-4-ol', 'Antimicrobien puissant (bactéries, champignons, virus), anti-inflammatoire, immunomodulateur. Composant actif principal du tea tree.'],
  ['ionone', 'Antitumoral in vitro, anti-inflammatoire, antioxydant. Présent dans rose, violette, iris. Arôme floral en parfumerie.'],
  ['damascenone', 'Antioxydant, anti-inflammatoire. Présent dans rose, raisin, thé. Arôme floral fruité en parfumerie.'],
  ['damascone', 'Antioxydant, anti-inflammatoire. Présent dans rose, raisin. Arôme floral en parfumerie.'],
  ['geranylacetone', 'Antimicrobien, anti-inflammatoire. Présent dans tomate, gingembre, rose.'],
  ['nootkatone', 'Insecticide naturel (tiques, moustiques), anti-inflammatoire, stimulant métabolique. Présent dans pamplemousse, cyprès chauve.'],
  ['vetivone', 'Anti-inflammatoire, antimicrobien, sédatif. Présent dans vétiver.'],
  ['cryptone', 'Antimicrobien, anti-inflammatoire. Présent dans eucalyptus, tea tree.'],
  ['pinocarvone', 'Antimicrobien, antifongique. Présent dans pin, eucalyptus.'],
  ['sabinone', 'Antimicrobien, anti-inflammatoire. Présent dans savin, genévrier.'],
  ['dihydrocarveol', 'Antispasmodique, antimicrobien. Présent dans menthe verte, aneth.'],
  ['piperitone', 'Antimicrobien, antifongique, insecticide naturel. Présent dans menthe, eucalyptus.'],
  ['perillaldehyde', 'Antimicrobien, antifongique, anti-inflammatoire. Présent dans périlla, menthe.'],
  ['perillyl alcohol', 'Antitumoral (induction apoptose), anti-inflammatoire. Présent dans lavande, menthe, cerise.'],
  ['myrtenal', 'Antimicrobien, anti-inflammatoire. Présent dans myrte, eucalyptus.'],
  ['myrtenol', 'Antimicrobien, anti-inflammatoire. Présent dans myrte, eucalyptus.'],
  ['verbenone', 'Antimicrobien, anti-inflammatoire, mucolytique. Présent dans romarin verbenone, verveine.'],
  ['verbenol', 'Antimicrobien, anti-inflammatoire. Présent dans romarin, verveine.'],
  ['chrysanthenone', 'Antimicrobien, anti-inflammatoire. Présent dans chrysanthème, tanaisie.'],
  ['artemisone', 'Antiparasitaire (Plasmodium), anti-inflammatoire. Présent dans armoise, absinthe.'],
  ['artemisia ketone', 'Antimicrobien, antiparasitaire. Présent dans armoise.'],
  ['thujopsene', 'Antimicrobien, anti-inflammatoire. Présent dans thuya, cèdre.'],
  ['cubebol', 'Antimicrobien, anti-inflammatoire. Présent dans cubèbe, poivre.'],
  ['spathulenol', 'Anti-inflammatoire, antimicrobien, antifongique. Présent dans eucalyptus, sauge.'],
  ['globulol', 'Antimicrobien, anti-inflammatoire. Présent dans eucalyptus, tea tree.'],
  ['viridiflorol', 'Antimicrobien, anti-inflammatoire. Présent dans niaouli, eucalyptus.'],
  ['ledol', 'Antimicrobien, anti-inflammatoire. Présent dans lédon du Groenland, romarin.'],
  ['palustrol', 'Antimicrobien, anti-inflammatoire. Présent dans lédon du Groenland.'],
  ['eudesmol', 'Antimicrobien, anti-inflammatoire, sédatif. Présent dans eucalyptus, bouleau.'],
  ['bulnesol', 'Anti-inflammatoire, antimicrobien. Présent dans vétiver, patchouli.'],
  ['zingiberol', 'Anti-inflammatoire, antimicrobien. Présent dans gingembre.'],
  ['zingiberene', 'Anti-inflammatoire, antimicrobien, antinauséeux. Présent dans gingembre.'],
  ['ar-curcumene', 'Anti-inflammatoire, antifongique. Présent dans curcuma, gingembre.'],
  ['bisabolene', 'Anti-inflammatoire, antimicrobien. Présent dans camomille, myrrhe.'],
  ['calamenene', 'Antimicrobien, anti-inflammatoire. Présent dans calament, menthe.'],
  ['ylangene', 'Antimicrobien, anti-inflammatoire. Présent dans ylang-ylang.'],
  ['seychellene', 'Antimicrobien, anti-inflammatoire. Présent dans patchouli.'],
  ['aromadendrene', 'Antimicrobien, anti-inflammatoire. Présent dans eucalyptus, tea tree.'],
  ['alloaromadendrene', 'Antimicrobien, anti-inflammatoire. Présent dans eucalyptus, tea tree.'],
  ['cis-jasmone', 'Antimicrobien, insecticide naturel, anti-inflammatoire. Présent dans jasmin.'],
  ['methyl jasmonate', 'Régulateur de croissance végétale, antimicrobien, anti-inflammatoire. Présent dans jasmin, gardénia.'],
  ['indole', 'Antimicrobien, anti-inflammatoire. Présent dans jasmin, orange fleur, tubéreuse. Arôme floral animal en parfumerie.'],
  ['skatole', 'Antimicrobien. Présent dans jasmin, fèces. Arôme fécal à forte concentration, floral à faible dose.'],
  ['benzaldehyde', 'Antimicrobien, analgésique, anti-inflammatoire. Présent dans amande amère, cerise, cannelle.'],
  ['vanillin', 'Antioxydant, antimicrobien, anti-inflammatoire, analgésique. Présent dans vanille, benjoin, baume du Pérou.'],
  ['piperonal', 'Antimicrobien, insecticide naturel. Présent dans poivre, vanille, héliotrope.'],
  ['cinnamyl alcohol', 'Antimicrobien, anti-inflammatoire. Présent dans cannelle, styrax, baume du Pérou.'],
  ['benzyl alcohol', 'Antimicrobien, anesthésique local, solvant. Présent dans jasmin, ylang-ylang, tubéreuse.'],
  ['phenylethyl alcohol', 'Antimicrobien, anti-inflammatoire, anxiolytique. Présent dans rose, géranium, néroli.'],
  ['phenyl ethyl alcohol', 'Antimicrobien, anti-inflammatoire, anxiolytique. Présent dans rose, géranium, néroli.'],
  ['2-phenylethanol', 'Antimicrobien, anti-inflammatoire, anxiolytique. Présent dans rose, géranium, néroli.'],
  ['methyl anthranilate', 'Antimicrobien, anti-inflammatoire. Présent dans mandarine, jasmin, néroli. Arôme floral fruité.'],
  ['indane', 'Antimicrobien. Présent dans certaines huiles essentielles de conifères.'],
  ['azulene', 'Anti-inflammatoire puissant, antimicrobien, cicatrisant. Présent dans camomille allemande (chamazulène), yarrow.'],
  ['chamazulene', 'Anti-inflammatoire puissant (inhibition LOX), antimicrobien, cicatrisant, antiallergique. Présent dans camomille allemande, yarrow.'],
  ['matricine', 'Précurseur du chamazulène. Anti-inflammatoire, antimicrobien. Présent dans camomille allemande.'],
];

let updated = 0;
let alreadyEnriched = 0;
let notFound = 0;

for (const [term, therapy] of enrichments) {
  const [rows] = await conn.execute(
    'SELECT id, name, therapeuticProperties FROM molecules WHERE LOWER(name) LIKE ? AND (therapeuticProperties IS NULL OR therapeuticProperties = "") LIMIT 5',
    ['%' + term.toLowerCase() + '%']
  );
  
  for (const mol of rows) {
    await conn.execute(
      'UPDATE molecules SET therapeuticProperties = ? WHERE id = ?',
      [therapy, mol.id]
    );
    console.log('✓', mol.name);
    updated++;
  }
  
  if (rows.length === 0) notFound++;
}

// Résultat final
const [total] = await conn.execute('SELECT COUNT(*) as n FROM molecules');
const [withTherapy] = await conn.execute('SELECT COUNT(*) as n FROM molecules WHERE therapeuticProperties IS NOT NULL AND therapeuticProperties != ""');
console.log('\n=== RÉSULTAT BATCH 6E ===');
console.log('Mis à jour :', updated);
console.log('Couverture :', withTherapy[0].n + '/' + total[0].n, '(' + (withTherapy[0].n/total[0].n*100).toFixed(1) + '%)');

await conn.end();
