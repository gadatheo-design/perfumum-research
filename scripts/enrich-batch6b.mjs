/**
 * Batch 6b : enrichir les molécules trouvées avec variantes orthographiques
 * + créer les molécules manquantes importantes (coumarines, diterpènes, flavonoïdes)
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ============================================================
// ÉTAPE 1 : Mettre à jour les molécules existantes trouvées
// ============================================================
const updates = [
  { id: 990036, name: 'Methyl chavicol', therapy: 'Antispasmodique puissant, anesthésique local, anti-inflammatoire. Utilisé pour les spasmes digestifs et musculaires. Propriétés antivirales documentées (HSV-1). Précaution : potentiellement génotoxique à haute dose.' },
  { id: 810053, name: 'chavicol', therapy: 'Antifongique, antibactérien. Propriétés analgésiques locales. Précurseur du méthylchavicol. Présent dans l\'huile de basilic tropical.' },
  { id: 810055, name: 'dillapiole', therapy: 'Insecticide naturel, synergiste des pyréthroïdes. Propriétés antiparasitaires (Leishmania, Plasmodium). Antifongique. Présent dans l\'huile de persil sauvage et d\'aneth.' },
  { id: 1260208, name: 'Isoeugenol', therapy: 'Anti-inflammatoire, analgésique, antioxydant. Propriétés antimicrobiennes contre S. aureus et E. coli. Utilisé en parfumerie comme fixateur. Allergène potentiel (liste IFRA).' },
  { id: 810050, name: 'acide cinnamique', therapy: 'Antifongique, antibactérien, antioxydant. Photoprotecteur UV (précurseur des filtres solaires). Neuroprotecteur (modèles Parkinson). Anti-inflammatoire. Précurseur de nombreux polyphénols.' },
  { id: 1260565, name: 'Cinnamic acid', therapy: 'Antifongique, antibactérien, antioxydant. Photoprotecteur UV. Neuroprotecteur. Anti-inflammatoire. Précurseur de nombreux polyphénols et esters aromatiques.' },
  { id: 1260311, name: 'Phenylacetic acid', therapy: 'Antibactérien, antifongique. Régulateur de croissance végétale (auxine). Propriétés anticonvulsivantes (métabolite du phénylalanine). Utilisé en fermentation pour arômes fromagers.' },
];

let updated = 0;
for (const u of updates) {
  const [rows] = await conn.execute('SELECT id, name, therapeuticProperties FROM molecules WHERE id = ?', [u.id]);
  if (rows[0] && (!rows[0].therapeuticProperties || rows[0].therapeuticProperties.length < 20)) {
    await conn.execute('UPDATE molecules SET therapeuticProperties = ? WHERE id = ?', [u.therapy, u.id]);
    console.log('✓ Updated:', rows[0].name);
    updated++;
  } else if (rows[0]) {
    console.log('Already enriched:', rows[0].name);
  }
}

// ============================================================
// ÉTAPE 2 : Chercher et enrichir les molécules importantes par nom partiel
// ============================================================
const partialSearches = [
  // Coumarines
  { search: 'xanthotox', therapy: 'Photosensibilisant médicinal (traitement psoriasis, vitiligo, mycosis fongoïde). Antifongique, antiparasitaire (Leishmania). Vasodilatateur coronarien. Phototoxique — usage médical supervisé uniquement.' },
  { search: 'osthole', therapy: 'Anti-inflammatoire (inhibition NF-κB), analgésique, antiostéoporotique. Neuroprotecteur (modèles Alzheimer). Antitumoral in vitro (apoptose). Anticoagulant léger. Présent dans Cnidium monnieri.' },
  { search: 'psoralene', therapy: 'Photosensibilisant thérapeutique (PUVA). Antifungique, antiparasitaire. Immunomodulateur. Phototoxique et potentiellement mutagène sous UV. Usage médical strict.' },
  { search: 'herniarine', therapy: 'Antispasmodique, anti-inflammatoire, analgésique. Propriétés antibactériennes. Moins phototoxique que les autres furocoumarines. Présent dans la camomille romaine.' },
  { search: 'umbelliferone', therapy: 'Antifongique, antibactérien, anti-inflammatoire. Photoprotecteur UV-A. Antitumoral in vitro. Présent dans de nombreuses Apiaceae (angélique, fenouil, carotte).' },
  { search: 'scopoletin', therapy: 'Antispasmodique, sédatif léger, anti-inflammatoire. Neuroprotecteur (inhibition acétylcholinestérase). Antioxydant. Présent dans la belladone, la jusquiame, l\'hysope.' },
  { search: 'bergamottin', therapy: 'Inhibiteur du cytochrome P450 (interactions médicamenteuses). Antioxydant, anti-inflammatoire. Présent dans le jus de pamplemousse — responsable des interactions avec certains médicaments.' },
  // Diterpènes
  { search: 'carnosol', therapy: 'Antioxydant puissant (DPPH), anti-inflammatoire (inhibition COX-2, LOX), antitumoral (apoptose dans cancers du sein, prostate, côlon). Neuroprotecteur. Antimicrobien. Présent dans romarin, sauge.' },
  { search: 'carnosic', therapy: 'Antioxydant majeur du romarin (10× plus puissant que la vitamine E). Anti-inflammatoire, neuroprotecteur (modèles Alzheimer, Parkinson). Antitumoral. Antimicrobien contre MRSA. Utilisé comme conservateur alimentaire naturel.' },
  { search: 'rosmanol', therapy: 'Antioxydant, anti-inflammatoire, antimicrobien. Propriétés hépatoprotectrices. Présent dans le romarin et la sauge. Synergique avec le carnosol.' },
  { search: 'abietol', therapy: 'Antimicrobien, antifongique. Propriétés anti-inflammatoires. Présent dans les résines de conifères (pin, sapin). Utilisé en médecine traditionnelle pour les affections respiratoires.' },
  { search: 'totarol', therapy: 'Antimicrobien puissant contre MRSA et bactéries Gram+. Antioxydant, anti-inflammatoire. Présent dans Podocarpus totara (if de Nouvelle-Zélande). Utilisé en cosmétique comme conservateur naturel.' },
  { search: 'paclitaxel', therapy: 'Anticancéreux majeur (inhibition de la dépolymérisation des microtubules). Approuvé FDA pour cancers du sein, ovaire, poumon. Extrait de l\'if (Taxus brevifolia). Révolution en oncologie.' },
  { search: 'taxol', therapy: 'Anticancéreux majeur (inhibition de la dépolymérisation des microtubules). Approuvé FDA pour cancers du sein, ovaire, poumon. Extrait de l\'if (Taxus brevifolia). Révolution en oncologie.' },
  { search: 'ginkgolide', therapy: 'Antagoniste du PAF (facteur d\'activation plaquettaire). Neuroprotecteur, améliore la circulation cérébrale. Utilisé dans les troubles cognitifs et démences. Présent exclusivement dans Ginkgo biloba.' },
  { search: 'geranylgeraniol', therapy: 'Anticancéreux (inhibition de la mévalonate kinase, apoptose). Antiparasitaire (Leishmania). Précurseur de nombreux diterpènes bioactifs. Présent dans l\'huile de palme, les conifères.' },
  // Triterpènes
  { search: 'sitosterol', therapy: 'Hypocholestérolémiant (compétition avec cholestérol alimentaire). Traitement de l\'hyperplasie bénigne de la prostate. Anti-inflammatoire, immunomodulateur. Présent dans huile d\'avocat, noix, graines.' },
  { search: 'lupeol', therapy: 'Anti-inflammatoire, antitumoral (mélanome, leucémie), antiparasitaire (Leishmania, Plasmodium). Hépatoprotecteur. Présent dans le bouleau, le pissenlit, la mangue.' },
  { search: 'betulin', therapy: 'Antitumoral (mélanome), anti-inflammatoire, antiviral (HSV, VIH). Hépatoprotecteur. Précurseur de l\'acide bétulinique. Présent dans l\'écorce de bouleau blanc.' },
  // Flavonoïdes
  { search: 'quercetin', therapy: 'Antioxydant majeur, anti-inflammatoire (inhibition histamine, COX-2), antiallergique, antiviral (influenza, rhinovirus). Cardioprotecteur, anticancéreux in vitro. Présent dans oignon, câpres, thé vert.' },
  { search: 'kaempferol', therapy: 'Antioxydant, anti-inflammatoire, antitumoral (apoptose), cardioprotecteur. Neuroprotecteur. Présent dans le brocoli, le thé, les câpres, la lavande.' },
  { search: 'apigenin', therapy: 'Anxiolytique (modulation GABA-A), anti-inflammatoire, antitumoral (apoptose), antioxydant. Sédatif léger. Présent dans la camomille, le persil, le céleri.' },
  { search: 'luteolin', therapy: 'Anti-inflammatoire puissant (inhibition TNF-α, IL-6), antioxydant, antitumoral, neuroprotecteur. Antiallergique. Présent dans le thym, la sauge, l\'artichaut.' },
  { search: 'resveratrol', therapy: 'Cardioprotecteur (activation sirtuines), antioxydant, anti-inflammatoire, antitumoral. Antifongique naturel (phytoalexine). Neuroprotecteur. Présent dans le raisin, les baies, les arachides.' },
  { search: 'rosmarinic', therapy: 'Antioxydant puissant, anti-inflammatoire (inhibition COX, LOX), antiallergique, antiviral (HSV, VIH). Neuroprotecteur. Présent dans le romarin, la sauge, la mélisse, le basilic.' },
  { search: 'chlorogenic', therapy: 'Antioxydant, hypoglycémiant (inhibition glucose-6-phosphatase), hypolipémiant, anti-inflammatoire. Neuroprotecteur. Présent dans le café, les pommes, les artichauts.' },
  // Alcaloïdes
  { search: 'colchicine', therapy: 'Antigoutteux (inhibition migration neutrophiles), anti-inflammatoire, antimitotique. Traitement de la fièvre méditerranéenne familiale. Présent dans le colchique d\'automne. Toxique à haute dose.' },
  { search: 'vincristine', therapy: 'Anticancéreux majeur (inhibition polymérisation tubuline). Traitement leucémies, lymphomes. Extrait de Catharanthus roseus (pervenche de Madagascar). Médicament essentiel OMS.' },
  { search: 'quinine', therapy: 'Antipaludéen historique (inhibition hème polymérase Plasmodium). Antipyrétique, analgésique, antispasmodique. Présent dans l\'écorce de quinquina (Cinchona spp.). Modèle pour la chloroquine.' },
  { search: 'caffeine', therapy: 'Stimulant SNC (antagoniste adénosine), bronchodilatateur, diurétique léger. Améliore performances cognitives et physiques. Analgésique adjuvant. Présent dans café, thé, cacao, guarana.' },
  { search: 'theophylline', therapy: 'Bronchodilatateur (traitement asthme, BPCO), stimulant respiratoire, diurétique. Médicament essentiel OMS. Présent dans le thé, le cacao. Marge thérapeutique étroite.' },
];

for (const s of partialSearches) {
  const [rows] = await conn.execute(
    'SELECT id, name, therapeuticProperties FROM molecules WHERE LOWER(name) LIKE ? LIMIT 1',
    ['%' + s.search.toLowerCase() + '%']
  );
  if (rows[0] && (!rows[0].therapeuticProperties || rows[0].therapeuticProperties.length < 20)) {
    await conn.execute('UPDATE molecules SET therapeuticProperties = ? WHERE id = ?', [s.therapy, rows[0].id]);
    console.log('✓ Partial match:', rows[0].name);
    updated++;
  } else if (rows[0]) {
    console.log('Already enriched:', rows[0].name);
  } else {
    console.log('Not found:', s.search);
  }
}

// ============================================================
// ÉTAPE 3 : Créer les molécules importantes manquantes
// ============================================================
const toCreate = [
  { name: 'Carnosol', formula: 'C20H26O4', mw: '330.4', family: 'Diterpène phénolique', therapy: 'Antioxydant puissant (DPPH), anti-inflammatoire (inhibition COX-2, LOX), antitumoral (apoptose dans cancers du sein, prostate, côlon). Neuroprotecteur. Antimicrobien. Présent dans romarin, sauge.', odor: 'Légèrement herbacé, camphré' },
  { name: 'Acide carnosolique', formula: 'C20H28O4', mw: '332.4', family: 'Diterpène phénolique', therapy: 'Antioxydant majeur du romarin (10× plus puissant que la vitamine E). Anti-inflammatoire, neuroprotecteur (modèles Alzheimer, Parkinson). Antitumoral. Antimicrobien contre MRSA. Conservateur alimentaire naturel.', odor: 'Herbacé, légèrement amer' },
  { name: 'Quercétine', formula: 'C15H10O7', mw: '302.2', family: 'Flavonoïde / Flavonol', therapy: 'Antioxydant majeur, anti-inflammatoire (inhibition histamine, COX-2), antiallergique, antiviral (influenza, rhinovirus). Cardioprotecteur, anticancéreux in vitro. Présent dans oignon, câpres, thé vert.', odor: 'Inodore' },
  { name: 'Kaempférol', formula: 'C15H10O6', mw: '286.2', family: 'Flavonoïde / Flavonol', therapy: 'Antioxydant, anti-inflammatoire, antitumoral (apoptose), cardioprotecteur. Neuroprotecteur. Présent dans le brocoli, le thé, les câpres, la lavande.', odor: 'Inodore' },
  { name: 'Apigénine', formula: 'C15H10O5', mw: '270.2', family: 'Flavonoïde / Flavone', therapy: 'Anxiolytique (modulation GABA-A), anti-inflammatoire, antitumoral (apoptose), antioxydant. Sédatif léger. Présent dans la camomille, le persil, le céleri.', odor: 'Inodore' },
  { name: 'Resvératrol', formula: 'C14H12O3', mw: '228.2', family: 'Stilbénoïde', therapy: 'Cardioprotecteur (activation sirtuines), antioxydant, anti-inflammatoire, antitumoral. Antifongique naturel (phytoalexine). Neuroprotecteur. Présent dans le raisin, les baies, les arachides.', odor: 'Inodore' },
  { name: 'Acide rosmarinique', formula: 'C18H16O8', mw: '360.3', family: 'Acide phénolique', therapy: 'Antioxydant puissant, anti-inflammatoire (inhibition COX, LOX), antiallergique, antiviral (HSV, VIH). Neuroprotecteur. Présent dans le romarin, la sauge, la mélisse, le basilic.', odor: 'Légèrement herbacé' },
  { name: 'Acide chlorogénique', formula: 'C16H18O9', mw: '354.3', family: 'Acide phénolique', therapy: 'Antioxydant, hypoglycémiant (inhibition glucose-6-phosphatase), hypolipémiant, anti-inflammatoire. Neuroprotecteur. Présent dans le café, les pommes, les artichauts.', odor: 'Inodore' },
  { name: 'Coumarine (7-hydroxy)', formula: 'C9H6O3', mw: '162.1', family: 'Coumarine', therapy: 'Antifongique, antibactérien, anti-inflammatoire. Photoprotecteur UV-A. Antitumoral in vitro. Présent dans de nombreuses Apiaceae (angélique, fenouil, carotte).', odor: 'Foin coupé, vanillé doux' },
  { name: 'Taxol (Paclitaxel)', formula: 'C47H51NO14', mw: '853.9', family: 'Diterpène / Taxane', therapy: 'Anticancéreux majeur (inhibition de la dépolymérisation des microtubules). Approuvé FDA pour cancers du sein, ovaire, poumon. Extrait de l\'if (Taxus brevifolia). Révolution en oncologie.', odor: 'Inodore' },
  { name: 'Quinine', formula: 'C20H24N2O2', mw: '324.4', family: 'Alcaloïde quinoléique', therapy: 'Antipaludéen historique (inhibition hème polymérase Plasmodium). Antipyrétique, analgésique, antispasmodique. Présent dans l\'écorce de quinquina (Cinchona spp.). Modèle pour la chloroquine.', odor: 'Amer, légèrement médicinal' },
  { name: 'Caféine', formula: 'C8H10N4O2', mw: '194.2', family: 'Alcaloïde purique / Méthylxanthine', therapy: 'Stimulant SNC (antagoniste adénosine), bronchodilatateur, diurétique léger. Améliore performances cognitives et physiques. Analgésique adjuvant. Présent dans café, thé, cacao, guarana.', odor: 'Légèrement amer' },
  { name: 'Théophylline', formula: 'C7H8N4O2', mw: '180.2', family: 'Alcaloïde purique / Méthylxanthine', therapy: 'Bronchodilatateur (traitement asthme, BPCO), stimulant respiratoire, diurétique. Médicament essentiel OMS. Présent dans le thé, le cacao. Marge thérapeutique étroite.', odor: 'Légèrement amer' },
  { name: 'Vincristine', formula: 'C46H56N4O10', mw: '824.9', family: 'Alcaloïde indolique', therapy: 'Anticancéreux majeur (inhibition polymérisation tubuline). Traitement leucémies, lymphomes. Extrait de Catharanthus roseus (pervenche de Madagascar). Médicament essentiel OMS.', odor: 'Inodore' },
  { name: 'Colchicine', formula: 'C22H25NO6', mw: '399.4', family: 'Alcaloïde', therapy: 'Antigoutteux (inhibition migration neutrophiles), anti-inflammatoire, antimitotique. Traitement de la fièvre méditerranéenne familiale. Présent dans le colchique d\'automne. Toxique à haute dose.', odor: 'Inodore' },
  { name: 'β-Sitostérol', formula: 'C29H50O', mw: '414.7', family: 'Phytostérol', therapy: 'Hypocholestérolémiant (compétition avec cholestérol alimentaire). Traitement de l\'hyperplasie bénigne de la prostate. Anti-inflammatoire, immunomodulateur. Présent dans huile d\'avocat, noix, graines.', odor: 'Inodore' },
  { name: 'Lupéol', formula: 'C30H50O', mw: '426.7', family: 'Triterpène pentacyclique', therapy: 'Anti-inflammatoire, antitumoral (mélanome, leucémie), antiparasitaire (Leishmania, Plasmodium). Hépatoprotecteur. Présent dans le bouleau, le pissenlit, la mangue.', odor: 'Inodore' },
  { name: 'Acide bétulinique', formula: 'C30H48O3', mw: '456.7', family: 'Triterpène pentacyclique', therapy: 'Anticancéreux sélectif (apoptose cellules mélanome sans toxicité systémique). Antiviral (VIH, HSV). Anti-inflammatoire, antiparasitaire. Présent dans le bouleau, le platane, la vigne.', odor: 'Inodore' },
];

let created = 0;
for (const mol of toCreate) {
  // Vérifier si la molécule existe déjà
  const [existing] = await conn.execute(
    'SELECT id FROM molecules WHERE name = ? LIMIT 1',
    [mol.name]
  );
  if (existing[0]) {
    // Enrichir si pas de propriétés
    const [current] = await conn.execute('SELECT therapeuticProperties FROM molecules WHERE id = ?', [existing[0].id]);
    if (!current[0].therapeuticProperties || current[0].therapeuticProperties.length < 20) {
      await conn.execute('UPDATE molecules SET therapeuticProperties = ? WHERE id = ?', [mol.therapy, existing[0].id]);
      console.log('✓ Enrichi existant:', mol.name);
      updated++;
    }
    continue;
  }
  
  // Créer la molécule
  const newId = 1300000 + created + 1;
  await conn.execute(
    `INSERT INTO molecules (id, name, formula, molecularWeight, chemicalFamily, therapeuticProperties, olfactiveProfile, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [newId, mol.name, mol.formula, mol.mw, mol.family, mol.therapy, mol.odor]
  );
  console.log('✓ Créé:', mol.name, '(id:', newId + ')');
  created++;
}

// Résultat final
const [total] = await conn.execute('SELECT COUNT(*) as n FROM molecules');
const [withTherapy] = await conn.execute('SELECT COUNT(*) as n FROM molecules WHERE therapeuticProperties IS NOT NULL AND therapeuticProperties != ""');
console.log('\n=== RÉSULTAT BATCH 6 COMPLET ===');
console.log('Mis à jour :', updated);
console.log('Créés :', created);
console.log('Couverture :', withTherapy[0].n + '/' + total[0].n, '(' + (withTherapy[0].n/total[0].n*100).toFixed(1) + '%)');

await conn.end();
