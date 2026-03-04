/**
 * Enrichissement des propriétés thérapeutiques des molécules
 * Sources : PubMed, PMC, EFSA, ECHA, littérature scientifique
 */
import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

console.log('=== ENRICHISSEMENT PROPRIÉTÉS THÉRAPEUTIQUES ===\n');

// Données thérapeutiques validées par la littérature scientifique
// Format : { name, therapeuticProperties, olfactiveProfile, source }
const therapeuticData = [
  {
    ids: [30007], // Limonène
    name: 'Limonène',
    therapeuticProperties: 'Anti-inflammatoire (inhibition COX-2), anxiolytique (modulation GABA-A), antifongique (Candida spp.), antioxydant (piégeage radicaux libres), potentiel antitumoral (apoptose cellules cancéreuses), solvant cutané (améliore pénétration transdermique). Utilisé en aromathérapie pour réduire l\'anxiété et le stress. GRAS (FDA). DL50 orale rat : 4400 mg/kg.',
    olfactiveProfile: 'Citrus frais, orange, citron, légèrement terpénique. Note de tête dominante dans les agrumes.',
    source: 'PMC6273920, PMC7763918, EFSA 2012'
  },
  {
    ids: [30006], // Myrcène
    name: 'Myrcène',
    therapeuticProperties: 'Sédatif et myorelaxant (potentialisation barbituriques), analgésique (activation récepteurs opioïdes), anti-inflammatoire (inhibition prostaglandines), antioxydant. Synergiste des cannabinoïdes (effet entourage). Potentialise l\'effet sédatif du THC. Utilisé en médecine traditionnelle brésilienne (Lippia alba). GRAS (FDA). DL50 orale rat : 5000 mg/kg.',
    olfactiveProfile: 'Terreux, boisé, légèrement fruité (mangue), herbacé. Note de fond caractéristique du houblon et du cannabis.',
    source: 'PMC7763918, Russo 2011 (British Journal of Pharmacology)'
  },
  {
    ids: [30002], // Linalol
    name: 'Linalol',
    therapeuticProperties: 'Anxiolytique (modulation récepteurs GABA-A, similaire benzodiazépines), sédatif léger, analgésique (inhibition canaux voltage-dépendants), anti-inflammatoire (inhibition NF-κB), antimicrobien (large spectre), anticonvulsivant. Utilisé en aromathérapie pour l\'insomnie et l\'anxiété. Composant principal de la lavande (Lavandula angustifolia). GRAS (FDA). DL50 orale rat : 2790 mg/kg.',
    olfactiveProfile: 'Floral doux, lavande, légèrement boisé et citronné. Note de cœur polyvalente en parfumerie.',
    source: 'PMC6273920, Linck et al. 2009 (Phytomedicine), PMC7763918'
  },
  {
    ids: [30005, 810013], // β-Caryophyllène
    name: 'β-Caryophyllène',
    therapeuticProperties: 'Agoniste sélectif CB2 (seul terpène alimentaire connu activant les récepteurs cannabinoïdes), anti-inflammatoire puissant (inhibition NF-κB, TNF-α), analgésique, anxiolytique, antidépresseur, gastroprotecteur, neuroprotecteur. Potentiel thérapeutique dans maladies inflammatoires chroniques, douleurs neuropathiques, anxiété. Approuvé comme additif alimentaire (FEMA). DL50 orale rat : 5000 mg/kg.',
    olfactiveProfile: 'Épicé, poivré, boisé, légèrement terreux. Note de fond caractéristique du poivre noir et du clou de girofle.',
    source: 'Gertsch et al. 2008 (PNAS), PMC7763918, PMC6273920'
  },
  {
    ids: [30008, 810001], // α-Pinène
    name: 'α-Pinène',
    therapeuticProperties: 'Bronchodilatateur (inhibition acétylcholinestérase, améliore fonction pulmonaire), anti-inflammatoire (inhibition NF-κB), antimicrobien, anxiolytique, améliore la mémoire (inhibition acétylcholinestérase → contrebalance amnésie THC), antifongique. Utilisé en médecine traditionnelle pour les infections respiratoires. GRAS (FDA). DL50 orale rat : 3700 mg/kg.',
    olfactiveProfile: 'Résineux, pin, frais, légèrement terreux. Note de tête/cœur caractéristique des conifères.',
    source: 'PMC7763918, Russo 2011, Perry et al. 2000 (Planta Medica)'
  },
  {
    ids: [930007], // β-Pinène
    name: 'β-Pinène',
    therapeuticProperties: 'Antimicrobien (large spectre), antifongique, anti-inflammatoire, bronchodilatateur (synergie avec α-pinène), analgésique. Potentiel antidépresseur (modulation dopamine). Utilisé en médecine traditionnelle pour les infections respiratoires. GRAS (FDA). DL50 orale rat : 4700 mg/kg.',
    olfactiveProfile: 'Résineux, boisé, légèrement herbacé et épicé. Note de tête/cœur dans les parfums boisés.',
    source: 'PMC7763918, Salehi et al. 2019 (Molecules)'
  },
  {
    ids: [90048, 570066], // Humulène / α-Humulène
    name: 'Humulène / α-Humulène',
    therapeuticProperties: 'Anti-inflammatoire (inhibition PGE2, comparable à dexaméthasone in vitro), anorexigène (réduit l\'appétit), antitumoral (apoptose cellules cancéreuses), antimicrobien. Composant majeur du houblon (Humulus lupulus). Utilisé en médecine traditionnelle asiatique. GRAS (FDA). DL50 orale rat : >5000 mg/kg.',
    olfactiveProfile: 'Boisé, terreux, légèrement épicé et herbacé. Note de fond dans les parfums boisés et orientaux.',
    source: 'Fernandes et al. 2007 (European Journal of Pharmacology), PMC7763918'
  },
  {
    ids: [810007], // 1,8-cinéole (Eucalyptol)
    name: '1,8-Cinéole (Eucalyptol)',
    therapeuticProperties: 'Expectorant et mucolytique (fluidifie les sécrétions bronchiques), bronchodilatateur, anti-inflammatoire (inhibition cytokines pro-inflammatoires), antimicrobien, analgésique, améliore la cognition (inhibition acétylcholinestérase). Utilisé cliniquement dans les maladies respiratoires (BPCO, asthme). Composant principal de l\'eucalyptus. Approuvé comme médicament OTC dans plusieurs pays. DL50 orale rat : 2480 mg/kg.',
    olfactiveProfile: 'Frais, camphré, eucalyptus, légèrement mentholé. Note de tête caractéristique des plantes médicinales.',
    source: 'Juergens et al. 2003 (Respiratory Medicine), PMC6273920'
  },
  {
    ids: [660001, 810043], // Géraniol
    name: 'Géraniol',
    therapeuticProperties: 'Antimicrobien (large spectre bactéries et champignons), insectifuge (comparable DEET à faible concentration), antioxydant, anti-inflammatoire, potentiel antitumoral (inhibition mévalonate → apoptose). Utilisé en cosmétique et aromathérapie. Allergène potentiel (IFRA catégorie 1 à fortes concentrations). GRAS (FDA). DL50 orale rat : 3600 mg/kg.',
    olfactiveProfile: 'Floral rose, géranium, légèrement citronné. Note de cœur polyvalente en parfumerie florale.',
    source: 'PMC6273920, Salehi et al. 2019 (Molecules)'
  },
  {
    ids: [720007], // γ-Terpinène
    name: 'γ-Terpinène',
    therapeuticProperties: 'Antioxydant (piégeage radicaux libres), antimicrobien, anti-inflammatoire léger, antifongique. Présent dans les huiles essentielles d\'agrumes et d\'herbes aromatiques. GRAS (FDA). DL50 orale rat : 5000 mg/kg.',
    olfactiveProfile: 'Citrus, herbacé, légèrement terpénique. Note de tête dans les agrumes et herbes aromatiques.',
    source: 'Salehi et al. 2018 (Molecules)'
  },
  {
    ids: [720001], // Terpinolène
    name: 'Terpinolène',
    therapeuticProperties: 'Sédatif léger (potentialisation barbituriques), antioxydant, antimicrobien, antifongique, potentiel antiprolifératif (cellules cancéreuses). Présent dans le cannabis, la sauge, le romarin. GRAS (FDA). DL50 orale rat : 4500 mg/kg.',
    olfactiveProfile: 'Floral, herbacé, légèrement citronné et boisé. Note de tête complexe dans le cannabis sativa.',
    source: 'PMC7763918, Ito & Ito 2013 (Journal of Natural Medicines)'
  },
  {
    ids: [570042], // Thymol
    name: 'Thymol',
    therapeuticProperties: 'Antiseptique puissant (composant Listerine), antifongique (Candida spp.), antibactérien (large spectre), anti-inflammatoire (inhibition COX), analgésique topique, insectifuge. Utilisé cliniquement en dentisterie et dermatologie. Approuvé comme biocide (EPA). DL50 orale rat : 980 mg/kg (modérément toxique à fortes doses).',
    olfactiveProfile: 'Épicé, herbacé, thym, légèrement médicinal. Note de cœur caractéristique des Lamiaceae.',
    source: 'Salehi et al. 2018 (Molecules), EFSA 2011'
  },
  {
    ids: [720018], // Caryophyllène oxide
    name: 'Caryophyllène Oxide',
    therapeuticProperties: 'Antifongique (composant actif détecté par les chiens renifleurs de drogues), anti-inflammatoire, antimicrobien, insectifuge. Produit d\'oxydation du β-caryophyllène. Présent dans l\'eucalyptus et le cannabis séché. GRAS (FDA). DL50 orale rat : >5000 mg/kg.',
    olfactiveProfile: 'Boisé, épicé, légèrement terreux et camphré. Note de fond dans les plantes séchées.',
    source: 'Fidyt et al. 2016 (Cancer Medicine), PMC7763918'
  },
  {
    ids: [570012], // Linalol Synthétique
    name: 'Linalol Synthétique',
    therapeuticProperties: 'Mêmes propriétés que le linalol naturel : anxiolytique, sédatif, anti-inflammatoire, antimicrobien. La forme synthétique (racémique) peut avoir une activité légèrement différente de la forme naturelle (R-linalol dominant dans lavande). Utilisé massivement en parfumerie et cosmétique. GRAS (FDA).',
    olfactiveProfile: 'Floral doux, lavande, légèrement boisé. Identique au linalol naturel en termes olfactifs.',
    source: 'Linck et al. 2009 (Phytomedicine), IFRA 2020'
  },
  {
    ids: [720006], // α-Terpinène
    name: 'α-Terpinène',
    therapeuticProperties: 'Antioxydant, antimicrobien, antifongique. Composant des huiles essentielles de thym, marjolaine, cardamome. GRAS (FDA). DL50 orale rat : 4300 mg/kg.',
    olfactiveProfile: 'Citrus, herbacé, légèrement terpénique. Note de tête fraîche.',
    source: 'Salehi et al. 2018 (Molecules)'
  },
];

let updated = 0;
let notFound = 0;

for (const data of therapeuticData) {
  for (const molId of data.ids) {
    try {
      const [existing] = await conn.execute(
        `SELECT id, name, therapeuticProperties FROM molecules WHERE id = ?`,
        [molId]
      );
      
      if (existing.length === 0) {
        console.log(`  ⚠️  Molécule ID ${molId} non trouvée`);
        notFound++;
        continue;
      }
      
      const mol = existing[0];
      
      await conn.execute(
        `UPDATE molecules SET therapeuticProperties = ?, olfactiveProfile = ? WHERE id = ?`,
        [data.therapeuticProperties, data.olfactiveProfile, molId]
      );
      
      console.log(`  ✅ ${mol.name} [${molId}] : propriétés thérapeutiques ajoutées`);
      updated++;
    } catch (err) {
      console.log(`  ❌ Erreur ID ${molId}: ${err.message}`);
    }
  }
}

// Enrichir les molécules supplémentaires importantes
const additionalMolecules = [
  {
    name: 'Eugénol',
    therapeuticProperties: 'Analgésique dentaire (utilisé cliniquement en dentisterie), anti-inflammatoire (inhibition COX-2), antimicrobien, antifongique, anticonvulsivant. Composant principal du clou de girofle (Syzygium aromaticum). Approuvé comme anesthésique local. Allergène potentiel (IFRA). DL50 orale rat : 1930 mg/kg.',
    olfactiveProfile: 'Épicé, clou de girofle, légèrement boisé et médicinal. Note de cœur/fond caractéristique.',
    source: 'Kaur et al. 2010 (Phytotherapy Research)'
  },
  {
    name: 'Citral',
    therapeuticProperties: 'Antimicrobien, antifongique, anti-inflammatoire, insectifuge. Mélange de géranial (citral A) et néral (citral B). Composant principal de la citronnelle et du lemongrass. Allergène potentiel (IFRA). GRAS (FDA). DL50 orale rat : 4960 mg/kg.',
    olfactiveProfile: 'Citron intense, frais, légèrement floral. Note de tête dominante dans les agrumes et herbes citronnées.',
    source: 'Salehi et al. 2019 (Molecules)'
  },
  {
    name: 'Camphre',
    therapeuticProperties: 'Rubéfiant topique, analgésique local, expectorant, insectifuge. Utilisé cliniquement dans les baumes et pommades (Vicks VapoRub). Toxique à fortes doses (convulsions). Approuvé comme médicament OTC (FDA). DL50 orale rat : 1310 mg/kg.',
    olfactiveProfile: 'Camphré, frais, médicinal, légèrement boisé. Note de tête caractéristique.',
    source: 'Zuccarini 2009 (Journal of Basic and Clinical Physiology and Pharmacology)'
  },
  {
    name: 'Menthol',
    therapeuticProperties: 'Analgésique topique (activation récepteurs TRPM8 → sensation de froid), décongestionnant nasal, antispasmodique (syndrome côlon irritable), antimicrobien. Utilisé cliniquement dans de nombreux médicaments OTC. GRAS (FDA). DL50 orale rat : 3300 mg/kg.',
    olfactiveProfile: 'Menthe fraîche, froid, légèrement boisé. Note de tête caractéristique de la menthe poivrée.',
    source: 'Eccles 1994 (Journal of Pharmacy and Pharmacology), PMC6273920'
  },
  {
    name: 'Borneol',
    therapeuticProperties: 'Analgésique (inhibition canaux sodiques voltage-dépendants), anti-inflammatoire, antimicrobien, neuroprotecteur. Utilisé en médecine traditionnelle chinoise (Bingpian). Améliore la pénétration transdermique et la barrière hémato-encéphalique. GRAS (FDA). DL50 orale rat : 2000 mg/kg.',
    olfactiveProfile: 'Camphré, boisé, légèrement herbacé. Note de cœur/fond dans les parfums orientaux.',
    source: 'Zhang et al. 2012 (Molecules)'
  },
];

for (const data of additionalMolecules) {
  try {
    const [mols] = await conn.execute(
      `SELECT id, name FROM molecules WHERE name = ? OR LOWER(name) = LOWER(?)`,
      [data.name, data.name]
    );
    
    if (mols.length === 0) {
      console.log(`  ⚠️  ${data.name} non trouvé`);
      notFound++;
      continue;
    }
    
    for (const mol of mols) {
      await conn.execute(
        `UPDATE molecules SET therapeuticProperties = ?, olfactiveProfile = ? WHERE id = ?`,
        [data.therapeuticProperties, data.olfactiveProfile, mol.id]
      );
      console.log(`  ✅ ${mol.name} [${mol.id}] : propriétés thérapeutiques ajoutées`);
      updated++;
    }
  } catch (err) {
    console.log(`  ❌ Erreur ${data.name}: ${err.message}`);
  }
}

// Statistiques finales
const [stats] = await conn.execute(`
  SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN therapeuticProperties IS NOT NULL AND therapeuticProperties != '' THEN 1 ELSE 0 END) as with_therapeutic,
    SUM(CASE WHEN olfactiveProfile IS NOT NULL AND olfactiveProfile != '' THEN 1 ELSE 0 END) as with_olfactive
  FROM molecules
`);
const s = stats[0];

console.log(`\n📊 Résumé :`);
console.log(`  Molécules enrichies : ${updated}`);
console.log(`  Non trouvées : ${notFound}`);
console.log(`  Total molécules avec propriétés thérapeutiques : ${s.with_therapeutic}/${s.total} (${Math.round(s.with_therapeutic/s.total*100)}%)`);
console.log(`  Total molécules avec profil olfactif : ${s.with_olfactive}/${s.total} (${Math.round(s.with_olfactive/s.total*100)}%)`);

await conn.end();
console.log('\n✅ Enrichissement thérapeutique terminé');
