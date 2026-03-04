/**
 * Batch 6 thérapeutique : phénylpropanoïdes, coumarines, diterpènes
 * Objectif : passer de 25.0% à 30% (434 → ~521/1735 molécules)
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const molecules = [
  // ============================================================
  // PHÉNYLPROPANOÏDES
  // ============================================================
  {
    name: 'Méthylchavicol',
    therapy: 'Antispasmodique puissant, anesthésique local, anti-inflammatoire. Utilisé pour les spasmes digestifs et musculaires. Propriétés antivirales documentées (HSV-1). Précaution : potentiellement génotoxique à haute dose.',
    family: 'Phénylpropanoïde'
  },
  {
    name: 'Anéthol',
    therapy: 'Antispasmodique digestif, expectorant, galactagogue (stimule la lactation). Propriétés œstrogéniques légères. Antimicrobien contre Candida albicans. Utilisé en phytothérapie pour les coliques et ballonnements.',
    family: 'Phénylpropanoïde'
  },
  {
    name: 'Estragole',
    therapy: 'Antispasmodique, carminatif, analgésique. Propriétés antiparasitaires (Leishmania). Précaution : potentiellement hépatotoxique et génotoxique à doses élevées. Usage limité en aromathérapie.',
    family: 'Phénylpropanoïde'
  },
  {
    name: 'Safrole',
    therapy: 'Analgésique local historique (précurseur du MDMA). Propriétés insecticides (synergiste des pyréthroïdes). Antibactérien contre S. aureus. Usage interdit en alimentation (IARC groupe 2B). Intérêt historique et forensique.',
    family: 'Phénylpropanoïde'
  },
  {
    name: 'Apiole',
    therapy: 'Emménagogue traditionnel (stimule menstruations). Diurétique. Propriétés antiparasitaires (Plasmodium). Hépatotoxique à forte dose — usage médical abandonné au XXe siècle. Intérêt historique.',
    family: 'Phénylpropanoïde'
  },
  {
    name: 'Méthyl-eugénol',
    therapy: 'Anesthésique local, sédatif léger, analgésique. Propriétés antimicrobiennes et antifongiques. Insecticide naturel (attractif pour certains pollinisateurs). Précaution : génotoxique potentiel (EFSA).',
    family: 'Phénylpropanoïde'
  },
  {
    name: 'Isoeugénol',
    therapy: 'Anti-inflammatoire, analgésique, antioxydant. Propriétés antimicrobiennes contre S. aureus et E. coli. Utilisé en parfumerie comme fixateur. Allergène potentiel (liste IFRA).',
    family: 'Phénylpropanoïde'
  },
  {
    name: 'Cinnamaldéhyde',
    therapy: 'Antimicrobien à large spectre (bactéries, champignons, biofilms). Anti-inflammatoire (inhibition COX-2). Hypoglycémiant (améliore sensibilité à l\'insuline). Antifongique contre Candida. Antitumoral in vitro.',
    family: 'Phénylpropanoïde'
  },
  {
    name: 'Acide cinnamique',
    therapy: 'Antifongique, antibactérien, antioxydant. Photoprotecteur UV (précurseur des filtres solaires). Neuroprotecteur (modèles Parkinson). Anti-inflammatoire. Précurseur de nombreux polyphénols.',
    family: 'Acide phénylpropanoïque'
  },
  {
    name: 'Acide phénylacétique',
    therapy: 'Antibactérien, antifongique. Régulateur de croissance végétale (auxine). Propriétés anticonvulsivantes (métabolite du phénylalanine). Utilisé en fermentation pour arômes fromagers.',
    family: 'Acide phénylpropanoïque'
  },
  {
    name: 'Phénylacétaldéhyde',
    therapy: 'Antimicrobien, insecticide naturel (répulsif moustiques). Propriétés sédatives légères. Précurseur de l\'acide phénylacétique. Arôme de rose et miel en parfumerie.',
    family: 'Phénylpropanoïde'
  },
  {
    name: 'Chavicol',
    therapy: 'Antifongique, antibactérien. Propriétés analgésiques locales. Précurseur du méthylchavicol. Présent dans l\'huile de basilic tropical.',
    family: 'Phénylpropanoïde'
  },
  {
    name: 'Dilapiol',
    therapy: 'Insecticide naturel, synergiste des pyréthroïdes. Propriétés antiparasitaires (Leishmania, Plasmodium). Antifongique. Présent dans l\'huile de persil sauvage.',
    family: 'Phénylpropanoïde'
  },

  // ============================================================
  // COUMARINES
  // ============================================================
  {
    name: 'Bergaptène',
    therapy: 'Photosensibilisant (PUVA thérapie pour psoriasis, vitiligo). Antifongique. Vasodilatateur. Précaution : phototoxique — contre-indiqué avant exposition solaire. Présent dans bergamote, citron, pamplemousse.',
    family: 'Coumarine / Furocoumarine'
  },
  {
    name: 'Xanthotoxine',
    therapy: 'Photosensibilisant médicinal (traitement psoriasis, vitiligo, mycosis fongoïde). Antifongique, antiparasitaire (Leishmania). Vasodilatateur coronarien. Phototoxique — usage médical supervisé uniquement.',
    family: 'Coumarine / Furocoumarine'
  },
  {
    name: 'Osthole',
    therapy: 'Anti-inflammatoire (inhibition NF-κB), analgésique, antiostéoporotique. Neuroprotecteur (modèles Alzheimer). Antitumoral in vitro (apoptose). Anticoagulant léger. Présent dans Cnidium monnieri.',
    family: 'Coumarine'
  },
  {
    name: 'Psoralène',
    therapy: 'Photosensibilisant thérapeutique (PUVA). Antifungique, antiparasitaire. Immunomodulateur. Phototoxique et potentiellement mutagène sous UV. Usage médical strict.',
    family: 'Coumarine / Furocoumarine'
  },
  {
    name: 'Herniarine',
    therapy: 'Antispasmodique, anti-inflammatoire, analgésique. Propriétés antibactériennes. Moins phototoxique que les autres furocoumarines. Présent dans la camomille romaine.',
    family: 'Coumarine'
  },
  {
    name: 'Coumarine',
    therapy: 'Anticoagulant (précurseur de la warfarine), lymphokinétique (traitement lymphœdème). Anti-inflammatoire, antifongique. Propriétés antiœdémateuses. Hépatotoxique à haute dose. Présent dans la fève tonka, la cannelle de Ceylan.',
    family: 'Coumarine'
  },
  {
    name: 'Ombelliférone',
    therapy: 'Antifongique, antibactérien, anti-inflammatoire. Photoprotecteur UV-A. Antitumoral in vitro. Présent dans de nombreuses Apiaceae (angélique, fenouil, carotte).',
    family: 'Coumarine'
  },
  {
    name: 'Scopoléine',
    therapy: 'Antispasmodique, sédatif léger, anti-inflammatoire. Neuroprotecteur (inhibition acétylcholinestérase). Antioxydant. Présent dans la belladone, la jusquiame, l\'hysope.',
    family: 'Coumarine'
  },
  {
    name: 'Angélicine',
    therapy: 'Photosensibilisant (PUVA), antifongique, antiparasitaire. Moins phototoxique que le psoralène. Immunomodulateur. Présent dans l\'angélique, le khella.',
    family: 'Coumarine / Furocoumarine'
  },
  {
    name: 'Bergamottine',
    therapy: 'Inhibiteur du cytochrome P450 (interactions médicamenteuses). Antioxydant, anti-inflammatoire. Présent dans le jus de pamplemousse — responsable des interactions avec certains médicaments.',
    family: 'Coumarine / Furocoumarine'
  },

  // ============================================================
  // DITERPÈNES
  // ============================================================
  {
    name: 'Carnosol',
    therapy: 'Antioxydant puissant (DPPH), anti-inflammatoire (inhibition COX-2, LOX), antitumoral (apoptose dans cancers du sein, prostate, côlon). Neuroprotecteur. Antimicrobien. Présent dans romarin, sauge.',
    family: 'Diterpène phénolique'
  },
  {
    name: 'Acide carnosolique',
    therapy: 'Antioxydant majeur du romarin (10× plus puissant que la vitamine E). Anti-inflammatoire, neuroprotecteur (modèles Alzheimer, Parkinson). Antitumoral. Antimicrobien contre MRSA. Utilisé comme conservateur alimentaire naturel.',
    family: 'Diterpène phénolique'
  },
  {
    name: 'Rosmanol',
    therapy: 'Antioxydant, anti-inflammatoire, antimicrobien. Propriétés hépatoprotectrices. Présent dans le romarin et la sauge. Synergique avec le carnosol.',
    family: 'Diterpène phénolique'
  },
  {
    name: 'Abietol',
    therapy: 'Antimicrobien, antifongique. Propriétés anti-inflammatoires. Présent dans les résines de conifères (pin, sapin). Utilisé en médecine traditionnelle pour les affections respiratoires.',
    family: 'Diterpène'
  },
  {
    name: 'Manool',
    therapy: 'Antifongique, antibactérien, anti-inflammatoire. Propriétés cytotoxiques in vitro. Présent dans les huiles de cyprès et de genévrier. Utilisé en médecine traditionnelle méditerranéenne.',
    family: 'Diterpène'
  },
  {
    name: 'Totarol',
    therapy: 'Antimicrobien puissant contre MRSA et bactéries Gram+. Antioxydant, anti-inflammatoire. Présent dans Podocarpus totara (if de Nouvelle-Zélande). Utilisé en cosmétique comme conservateur naturel.',
    family: 'Diterpène phénolique'
  },
  {
    name: 'Taxol',
    therapy: 'Anticancéreux majeur (inhibition de la dépolymérisation des microtubules). Approuvé FDA pour cancers du sein, ovaire, poumon. Extrait de l\'if (Taxus brevifolia). Révolution en oncologie.',
    family: 'Diterpène / Taxane'
  },
  {
    name: 'Ginkgolide A',
    therapy: 'Antagoniste du PAF (facteur d\'activation plaquettaire). Neuroprotecteur, améliore la circulation cérébrale. Utilisé dans les troubles cognitifs et démences. Présent exclusivement dans Ginkgo biloba.',
    family: 'Diterpène / Ginkgolide'
  },
  {
    name: 'Ginkgolide B',
    therapy: 'Antagoniste PAF le plus puissant des ginkgolides. Neuroprotecteur, anticoagulant, anti-inflammatoire. Utilisé en médecine pour les troubles vasculaires cérébraux. Ginkgo biloba exclusivement.',
    family: 'Diterpène / Ginkgolide'
  },
  {
    name: 'Phytol',
    therapy: 'Précurseur de la vitamine E et K (métabolisme). Anti-inflammatoire, immunomodulateur. Propriétés sédatives légères. Antioxydant. Présent dans la chlorophylle de toutes les plantes vertes.',
    family: 'Diterpène acyclique'
  },
  {
    name: 'Géranylgéraniol',
    therapy: 'Anticancéreux (inhibition de la mévalonate kinase, apoptose). Antiparasitaire (Leishmania). Précurseur de nombreux diterpènes bioactifs. Présent dans l\'huile de palme, les conifères.',
    family: 'Diterpène acyclique'
  },
  {
    name: 'Cembratrienol',
    therapy: 'Antitumoral (inhibition prolifération cellulaire), anti-inflammatoire. Présent dans le tabac (Nicotiana tabacum). Potentiel chimioprotecteur paradoxal dans la fumée de tabac.',
    family: 'Diterpène / Cembrane'
  },

  // ============================================================
  // TRITERPÈNES & STÉROÏDES
  // ============================================================
  {
    name: 'Acide ursolique',
    therapy: 'Anti-inflammatoire (inhibition NF-κB), antitumoral (apoptose multiple cancers), anabolisant musculaire, hypoglycémiant. Antimicrobien. Présent dans le romarin, la sauge, le thym, les pommes.',
    family: 'Triterpène pentacyclique'
  },
  {
    name: 'Acide oléanolique',
    therapy: 'Hépatoprotecteur, anti-inflammatoire, antitumoral, antiviral (VIH). Hypoglycémiant, hypolipémiant. Présent dans l\'olivier, la lavande, le romarin. Médicament approuvé en Chine (hépatite).',
    family: 'Triterpène pentacyclique'
  },
  {
    name: 'Bêta-sitostérol',
    therapy: 'Hypocholestérolémiant (compétition avec cholestérol alimentaire). Traitement de l\'hyperplasie bénigne de la prostate. Anti-inflammatoire, immunomodulateur. Présent dans huile d\'avocat, noix, graines.',
    family: 'Phytostérol'
  },
  {
    name: 'Lupéol',
    therapy: 'Anti-inflammatoire, antitumoral (mélanome, leucémie), antiparasitaire (Leishmania, Plasmodium). Hépatoprotecteur. Présent dans le bouleau, le pissenlit, la mangue.',
    family: 'Triterpène pentacyclique'
  },
  {
    name: 'Bétuline',
    therapy: 'Antitumoral (mélanome), anti-inflammatoire, antiviral (HSV, VIH). Hépatoprotecteur. Précurseur de l\'acide bétulinique. Présent dans l\'écorce de bouleau blanc.',
    family: 'Triterpène pentacyclique'
  },
  {
    name: 'Acide bétulinique',
    therapy: 'Anticancéreux sélectif (apoptose cellules mélanome sans toxicité systémique). Antiviral (VIH, HSV). Anti-inflammatoire, antiparasitaire. Présent dans le bouleau, le platane, la vigne.',
    family: 'Triterpène pentacyclique'
  },

  // ============================================================
  // FLAVONOÏDES & POLYPHÉNOLS
  // ============================================================
  {
    name: 'Quercétine',
    therapy: 'Antioxydant majeur, anti-inflammatoire (inhibition histamine, COX-2), antiallergique, antiviral (influenza, rhinovirus). Cardioprotecteur, anticancéreux in vitro. Présent dans oignon, câpres, thé vert.',
    family: 'Flavonoïde / Flavonol'
  },
  {
    name: 'Kaempférol',
    therapy: 'Antioxydant, anti-inflammatoire, antitumoral (apoptose), cardioprotecteur. Neuroprotecteur. Présent dans le brocoli, le thé, les câpres, la lavande.',
    family: 'Flavonoïde / Flavonol'
  },
  {
    name: 'Apigénine',
    therapy: 'Anxiolytique (modulation GABA-A), anti-inflammatoire, antitumoral (apoptose), antioxydant. Sédatif léger. Présent dans la camomille, le persil, le céleri.',
    family: 'Flavonoïde / Flavone'
  },
  {
    name: 'Lutéoline',
    therapy: 'Anti-inflammatoire puissant (inhibition TNF-α, IL-6), antioxydant, antitumoral, neuroprotecteur. Antiallergique. Présent dans le thym, la sauge, l\'artichaut.',
    family: 'Flavonoïde / Flavone'
  },
  {
    name: 'Resvératrol',
    therapy: 'Cardioprotecteur (activation sirtuines), antioxydant, anti-inflammatoire, antitumoral. Antifongique naturel (phytoalexine). Neuroprotecteur. Présent dans le raisin, les baies, les arachides.',
    family: 'Stilbénoïde'
  },
  {
    name: 'Acide rosmarinique',
    therapy: 'Antioxydant puissant, anti-inflammatoire (inhibition COX, LOX), antiallergique, antiviral (HSV, VIH). Neuroprotecteur. Présent dans le romarin, la sauge, la mélisse, le basilic.',
    family: 'Acide phénolique'
  },
  {
    name: 'Acide chlorogénique',
    therapy: 'Antioxydant, hypoglycémiant (inhibition glucose-6-phosphatase), hypolipémiant, anti-inflammatoire. Neuroprotecteur. Présent dans le café, les pommes, les artichauts.',
    family: 'Acide phénolique'
  },

  // ============================================================
  // ALCALOÏDES SUPPLÉMENTAIRES
  // ============================================================
  {
    name: 'Berberine',
    therapy: 'Antimicrobien à large spectre (bactéries, parasites, champignons), hypoglycémiant (aussi efficace que la metformine), hypolipémiant, anti-inflammatoire, antitumoral. Présent dans le berbéris, le curcuma.',
    family: 'Alcaloïde isoquinoléique'
  },
  {
    name: 'Colchicine',
    therapy: 'Antigoutteux (inhibition migration neutrophiles), anti-inflammatoire, antimitotique. Traitement de la fièvre méditerranéenne familiale. Présent dans le colchique d\'automne. Toxique à haute dose.',
    family: 'Alcaloïde'
  },
  {
    name: 'Vincristine',
    therapy: 'Anticancéreux majeur (inhibition polymérisation tubuline). Traitement leucémies, lymphomes. Extrait de Catharanthus roseus (pervenche de Madagascar). Médicament essentiel OMS.',
    family: 'Alcaloïde indolique'
  },
  {
    name: 'Quinine',
    therapy: 'Antipaludéen historique (inhibition hème polymérase Plasmodium). Antipyrétique, analgésique, antispasmodique. Présent dans l\'écorce de quinquina (Cinchona spp.). Modèle pour la chloroquine.',
    family: 'Alcaloïde quinoléique'
  },
  {
    name: 'Caféine',
    therapy: 'Stimulant SNC (antagoniste adénosine), bronchodilatateur, diurétique léger. Améliore performances cognitives et physiques. Analgésique adjuvant. Présent dans café, thé, cacao, guarana.',
    family: 'Alcaloïde purique / Méthylxanthine'
  },
  {
    name: 'Théobromine',
    therapy: 'Bronchodilatateur, diurétique léger, vasodilatateur. Stimulant cardiaque modéré. Propriétés antitussives. Présent dans le cacao, le thé, le maté. Moins stimulant que la caféine.',
    family: 'Alcaloïde purique / Méthylxanthine'
  },
  {
    name: 'Théophylline',
    therapy: 'Bronchodilatateur (traitement asthme, BPCO), stimulant respiratoire, diurétique. Médicament essentiel OMS. Présent dans le thé, le cacao. Marge thérapeutique étroite.',
    family: 'Alcaloïde purique / Méthylxanthine'
  },
];

let updated = 0;
let notFound = 0;

for (const mol of molecules) {
  // Chercher par nom exact
  const [rows] = await conn.execute(
    'SELECT id, name, therapeuticProperties FROM molecules WHERE name = ? LIMIT 1',
    [mol.name]
  );
  
  let target = rows[0];
  
  // Si pas trouvé, chercher avec LIKE
  if (!target) {
    const [rows2] = await conn.execute(
      'SELECT id, name, therapeuticProperties FROM molecules WHERE name LIKE ? LIMIT 1',
      [`%${mol.name}%`]
    );
    target = rows2[0];
  }
  
  if (!target) {
    console.log('NON TROUVÉ:', mol.name);
    notFound++;
    continue;
  }
  
  // Ne pas écraser si déjà renseigné
  if (target.therapeuticProperties && target.therapeuticProperties.length > 20) {
    console.log('DÉJÀ ENRICHI:', target.name);
    continue;
  }
  
  await conn.execute(
    'UPDATE molecules SET therapeuticProperties = ? WHERE id = ?',
    [mol.therapy, target.id]
  );
  console.log('✓', target.name, '(id:', target.id + ')');
  updated++;
}

// Vérification finale
const [total] = await conn.execute('SELECT COUNT(*) as n FROM molecules');
const [withTherapy] = await conn.execute('SELECT COUNT(*) as n FROM molecules WHERE therapeuticProperties IS NOT NULL AND therapeuticProperties != ""');
console.log(`\n=== RÉSULTAT BATCH 6 ===`);
console.log(`Mis à jour : ${updated}`);
console.log(`Non trouvés : ${notFound}`);
console.log(`Couverture : ${withTherapy[0].n}/${total[0].n} (${(withTherapy[0].n/total[0].n*100).toFixed(1)}%)`);

await conn.end();
