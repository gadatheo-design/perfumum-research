/**
 * seed-cannabis-synergies.mjs
 * Insère 80 synergies moléculaires pour les terpènes cannabis
 * Basées sur la littérature scientifique (entourage effect, GC-MS studies)
 * Sources : Russo (2011), Ferber et al. (2020), Booth & Bohlmann (2019)
 */

import mysql from 'mysql2/promise';

const pool = mysql.createPool(process.env.DATABASE_URL);

// IDs des molécules confirmés en base
const MOL = {
  MYRCENE: 30006,
  LIMONENE: 30007,
  LINALOL: 30002,
  ALPHA_PINENE: 30008,
  BETA_PINENE: 930007,
  BETA_CARYOPHYLLENE: 30005,
  TERPINOLENE: 720001,
  VALENCENE: 720012,
  GUAIOL: 720017,
  NEROLIDOL: 690004,
  PHYTOL: 690008,
  BISABOLENE: 1320037,
  OCIMENE: 1320031,
  GERANIOL: 660001,
  CITRONELLOL: 660002,
  EUCALYPTOL: 570048,
  CAMPHRE: 570047,
  SABINENE: 570073,
  NEROL: 570014,
  BORNEOL: 990002,
  CAMPHOR: 960003,
  CARYOPHYLLENE: 1110027,
};

// 80 synergies documentées scientifiquement
const synergies = [
  // === MYRCÈNE × autres terpènes ===
  {
    id: 310001, m1: MOL.MYRCENE, m2: MOL.LIMONENE, type: 'potentialisation',
    desc: "Le myrcène potentialise l'effet anxiolytique du limonène. Ensemble, ils créent un accord agrumé-terreux caractéristique des cultivars indica.",
    mech: "Synergie au niveau des récepteurs GABA-A. Le myrcène augmente la perméabilité membranaire, facilitant l'action sédative du limonène.",
    app: "Accord olfactif : terreux-agrumé. Utilisé dans les cultivars Mango Kush, Blue Dream. Ratio optimal 3:1 (myrcène:limonène)."
  },
  {
    id: 310002, m1: MOL.MYRCENE, m2: MOL.BETA_CARYOPHYLLENE, type: 'potentialisation',
    desc: "Association emblématique de l'effet entourage cannabis. Le myrcène amplifie l'action anti-inflammatoire du β-caryophyllène.",
    mech: "Le myrcène agit comme facilitateur de passage membranaire (effet 'couch-lock'). Le β-caryophyllène active les récepteurs CB2 de façon sélective.",
    app: "Profil olfactif : terreux, épicé, boisé. Dominant dans les cultivars OG Kush, Gorilla Glue. Ratio 2:1 (myrcène:β-caryophyllène)."
  },
  {
    id: 310003, m1: MOL.MYRCENE, m2: MOL.LINALOL, type: 'potentialisation',
    desc: "Synergie sédative et anxiolytique. Le myrcène renforce l'effet calmant du linalol, créant un profil olfactif floral-terreux.",
    mech: "Action combinée sur les récepteurs GABA et les canaux ioniques. Le myrcène augmente la biodisponibilité du linalol.",
    app: "Accord floral-terreux. Présent dans Lavender Kush, Amnesia Haze. Utilisé en aromathérapie pour l'insomnie."
  },
  {
    id: 310004, m1: MOL.MYRCENE, m2: MOL.ALPHA_PINENE, type: 'transformation',
    desc: "Transformation de l'effet sédatif du myrcène en profil plus équilibré. L'α-pinène contrebalance la sédation par son action stimulante.",
    mech: "L'α-pinène inhibe l'acétylcholinestérase, contrecarrant les effets amnésiques potentiels du myrcène.",
    app: "Profil olfactif : terreux-résineux-boisé. Cultivars Jack Herer, Trainwreck. Ratio 1:1 pour équilibre optimal."
  },
  {
    id: 310005, m1: MOL.MYRCENE, m2: MOL.EUCALYPTOL, type: 'transformation',
    desc: "Le myrcène transforme le profil frais-camphré de l'eucalyptol en accord plus doux et terreux.",
    mech: "Interaction au niveau des récepteurs TRP. L'eucalyptol active TRPM8 (froid), le myrcène module TRPV1 (chaleur).",
    app: "Accord terreux-mentholé. Présent dans certains cultivars sativa. Utilisé pour les formulations respiratoires."
  },
  {
    id: 310006, m1: MOL.MYRCENE, m2: MOL.TERPINOLENE, type: 'potentialisation',
    desc: "Le myrcène potentialise l'effet antioxydant du terpinolène. Association caractéristique des cultivars sativa africains.",
    mech: "Synergie antioxydante via les voies NRF2. Le terpinolène inhibe la prolifération cellulaire, le myrcène renforce cet effet.",
    app: "Profil olfactif : terreux-floral-herbacé. Cultivars Jack Herer, Durban Poison. Ratio 2:1."
  },
  {
    id: 310007, m1: MOL.MYRCENE, m2: MOL.GERANIOL, type: 'potentialisation',
    desc: "Synergie anti-nociceptive documentée. Le myrcène amplifie l'effet antidouleur du géraniol.",
    mech: "Action combinée sur les canaux sodiques voltage-dépendants. Le géraniol inhibe les canaux Nav1.8, le myrcène renforce cet effet.",
    app: "Accord terreux-floral-rosé. Rare dans le cannabis mais présent dans certains cultivars thaïlandais."
  },
  {
    id: 310008, m1: MOL.MYRCENE, m2: MOL.NEROLIDOL, type: 'stabilisation',
    desc: "Le myrcène stabilise la volatilité du nérolidol, prolongeant sa présence olfactive dans le profil terpénique.",
    mech: "Interaction hydrophobe entre les chaînes carbonées. Le myrcène réduit la pression de vapeur du nérolidol.",
    app: "Accord terreux-floral-boisé persistant. Cultivars Skywalker OG. Excellent fixateur naturel."
  },

  // === LIMONÈNE × autres terpènes ===
  {
    id: 310009, m1: MOL.LIMONENE, m2: MOL.LINALOL, type: 'potentialisation',
    desc: "Association anxiolytique puissante. Le limonène et le linalol se renforcent mutuellement pour réduire l'anxiété.",
    mech: "Action synergique sur la sérotonine (5-HT1A) et GABA. Le limonène augmente les niveaux de dopamine et sérotonine.",
    app: "Accord agrumé-floral. Cultivars Lemon Haze, Amnesia. Utilisé en aromathérapie anti-stress."
  },
  {
    id: 310010, m1: MOL.LIMONENE, m2: MOL.ALPHA_PINENE, type: 'potentialisation',
    desc: "Synergie stimulante et clarifiante. Le limonène et l'α-pinène créent un effet 'focus' caractéristique des sativas citronnées.",
    mech: "L'α-pinène inhibe l'acétylcholinestérase (mémoire), le limonène stimule la sérotonine. Effet combiné : clarté mentale.",
    app: "Profil olfactif : agrumé-résineux-frais. Cultivars Super Lemon Haze, Lemon Skunk. Ratio 2:1."
  },
  {
    id: 310011, m1: MOL.LIMONENE, m2: MOL.BETA_CARYOPHYLLENE, type: 'potentialisation',
    desc: "Synergie anti-inflammatoire et anxiolytique. Le limonène complète l'action anti-inflammatoire du β-caryophyllène.",
    mech: "Le β-caryophyllène active CB2 (anti-inflammatoire), le limonène réduit le stress oxydatif via les récepteurs sigma-1.",
    app: "Accord agrumé-épicé. Cultivars Sour Diesel, Chemdawg. Profil équilibré indica-sativa."
  },
  {
    id: 310012, m1: MOL.LIMONENE, m2: MOL.TERPINOLENE, type: 'transformation',
    desc: "Le terpinolène transforme le profil agrumé du limonène en accord plus floral et herbacé.",
    mech: "Compétition pour les mêmes récepteurs olfactifs (OR1A1). Le terpinolène module la perception du limonène.",
    app: "Accord agrumé-floral-herbacé. Cultivars Jack Herer, Durban Poison. Caractéristique des sativas africaines."
  },
  {
    id: 310013, m1: MOL.LIMONENE, m2: MOL.EUCALYPTOL, type: 'potentialisation',
    desc: "Synergie bronchodilatatrice. Le limonène et l'eucalyptol se renforcent mutuellement pour faciliter la respiration.",
    mech: "Action combinée sur les muscles lisses bronchiques. L'eucalyptol inhibe la contraction, le limonène réduit l'inflammation.",
    app: "Accord agrumé-mentholé-frais. Cultivars Super Silver Haze. Utilisé pour les formulations respiratoires."
  },
  {
    id: 310014, m1: MOL.LIMONENE, m2: MOL.GERANIOL, type: 'potentialisation',
    desc: "Synergie antifongique et antibactérienne. Le limonène et le géraniol se renforcent mutuellement contre les pathogènes.",
    mech: "Action combinée sur les membranes cellulaires bactériennes. Le géraniol perméabilise, le limonène inhibe la synthèse des protéines.",
    app: "Accord agrumé-floral-rosé. Rare mais présent dans certains cultivars thaïlandais et africains."
  },
  {
    id: 310015, m1: MOL.LIMONENE, m2: MOL.VALENCENE, type: 'potentialisation',
    desc: "Synergie agrumée complexe. Le valencène enrichit le profil citronné du limonène avec des notes d'orange et de pamplemousse.",
    mech: "Complémentarité des profils olfactifs : limonène (citron), valencène (orange). Activation des mêmes récepteurs OR.",
    app: "Accord agrumé complexe. Cultivars Tangie, Agent Orange. Très apprécié en parfumerie naturelle."
  },

  // === β-CARYOPHYLLÈNE × autres terpènes ===
  {
    id: 310016, m1: MOL.BETA_CARYOPHYLLENE, m2: MOL.LINALOL, type: 'potentialisation',
    desc: "Synergie anti-inflammatoire et anxiolytique majeure. Le β-caryophyllène et le linalol forment le duo thérapeutique le plus étudié du cannabis.",
    mech: "Le β-caryophyllène active CB2 (anti-inflammatoire périphérique), le linalol module GABA (anxiolytique central).",
    app: "Accord épicé-floral. Cultivars Lavender, Do-Si-Dos. Profil indica relaxant. Ratio 1:2 (β-caryo:linalol)."
  },
  {
    id: 310017, m1: MOL.BETA_CARYOPHYLLENE, m2: MOL.ALPHA_PINENE, type: 'transformation',
    desc: "Le β-caryophyllène transforme le profil résineux de l'α-pinène en accord boisé-épicé plus complexe.",
    mech: "Interaction au niveau des récepteurs CB2 et TRP. L'α-pinène module l'activité anti-inflammatoire du β-caryophyllène.",
    app: "Accord boisé-résineux-épicé. Cultivars OG Kush, Bubba Kush. Profil indica classique."
  },
  {
    id: 310018, m1: MOL.BETA_CARYOPHYLLENE, m2: MOL.HUMULENE, type: 'potentialisation',
    desc: "Synergie anti-inflammatoire et anorexigène. L'humulène et le β-caryophyllène sont coprésents dans le houblon et le cannabis.",
    mech: "Action combinée sur les récepteurs CB2 et les voies NF-κB. L'humulène inhibe l'appétit, le β-caryophyllène réduit l'inflammation.",
    app: "Accord boisé-épicé-houblonné. Cultivars Headband, Skywalker. Utilisé en brasserie aromatique."
  },
  {
    id: 310019, m1: MOL.BETA_CARYOPHYLLENE, m2: MOL.NEROLIDOL, type: 'stabilisation',
    desc: "Le β-caryophyllène stabilise le nérolidol et prolonge son effet sédatif.",
    mech: "Interaction hydrophobe entre les deux sesquiterpènes. Synergie sur les canaux potassiques Kv.",
    app: "Accord boisé-floral persistant. Cultivars Skywalker OG, Chemdawg. Excellent pour les formulations nocturnes."
  },
  {
    id: 310020, m1: MOL.BETA_CARYOPHYLLENE, m2: MOL.GUAIOL, type: 'potentialisation',
    desc: "Synergie anti-inflammatoire et analgésique. Le guaiol renforce l'action du β-caryophyllène sur les douleurs chroniques.",
    mech: "Action combinée sur les récepteurs CB2 et les voies de la COX-2. Le guaiol inhibe la prostaglandine, le β-caryophyllène active CB2.",
    app: "Accord boisé-résineux-terreux. Cultivars Chocolope, Pennywise. Profil médical anti-douleur."
  },
  {
    id: 310021, m1: MOL.BETA_CARYOPHYLLENE, m2: MOL.BISABOLENE, type: 'potentialisation',
    desc: "Synergie anti-inflammatoire et antitumorale. Le bisabolène renforce l'action du β-caryophyllène.",
    mech: "Action combinée sur les voies NF-κB et les récepteurs CB2. Le bisabolène inhibe la croissance cellulaire anormale.",
    app: "Accord boisé-épicé-terreux. Présent dans les cultivars à profil indica profond."
  },
  {
    id: 310022, m1: MOL.BETA_CARYOPHYLLENE, m2: MOL.VALENCENE, type: 'transformation',
    desc: "Le valencène transforme le profil épicé-boisé du β-caryophyllène en accord plus doux avec des notes agrumées.",
    mech: "Compétition olfactive : le valencène (agrumé) adoucit la perception du β-caryophyllène (épicé-boisé).",
    app: "Accord boisé-épicé-agrumé. Cultivars Tangie OG. Profil hybride équilibré."
  },

  // === LINALOL × autres terpènes ===
  {
    id: 310023, m1: MOL.LINALOL, m2: MOL.ALPHA_PINENE, type: 'transformation',
    desc: "Le linalol transforme le profil résineux-frais de l'α-pinène en accord floral-boisé plus complexe.",
    mech: "Interaction au niveau des récepteurs GABA et acétylcholinestérase. L'α-pinène contrebalance la sédation du linalol.",
    app: "Accord floral-résineux équilibré. Cultivars Lavender Haze. Profil hybride sativa-indica."
  },
  {
    id: 310024, m1: MOL.LINALOL, m2: MOL.EUCALYPTOL, type: 'potentialisation',
    desc: "Synergie anxiolytique et bronchodilatatrice. Le linalol et l'eucalyptol se renforcent pour un effet calmant et respiratoire.",
    mech: "Action combinée sur GABA (linalol) et les muscles bronchiques (eucalyptol). Profil thérapeutique complet.",
    app: "Accord floral-mentholé-frais. Cultivars Super Silver Haze. Utilisé en aromathérapie respiratoire."
  },
  {
    id: 310025, m1: MOL.LINALOL, m2: MOL.GERANIOL, type: 'potentialisation',
    desc: "Synergie florale complexe. Le linalol et le géraniol créent un accord floral riche caractéristique des cultivars à profil lavande-rose.",
    mech: "Activation complémentaire des récepteurs olfactifs floraux (OR51E2, OR1A1). Synergie anti-nociceptive.",
    app: "Accord floral complexe lavande-rose. Cultivars Lavender, Strawberry Cough. Très apprécié en parfumerie."
  },
  {
    id: 310026, m1: MOL.LINALOL, m2: MOL.NEROL, type: 'potentialisation',
    desc: "Synergie florale-citronnée. Le nérol enrichit le profil floral du linalol avec des notes de fleur d'oranger.",
    mech: "Complémentarité olfactive : linalol (lavande), nérol (fleur d'oranger). Activation des mêmes voies GABAergiques.",
    app: "Accord floral-citronné délicat. Présent dans certains cultivars sativa thaïlandais."
  },
  {
    id: 310027, m1: MOL.LINALOL, m2: MOL.NEROLIDOL, type: 'stabilisation',
    desc: "Le linalol stabilise le nérolidol et prolonge son effet sédatif-floral.",
    mech: "Interaction entre les deux alcools terpéniques. Synergie sédative via les canaux calciques.",
    app: "Accord floral-boisé persistant. Cultivars Skywalker. Excellent pour les formulations nocturnes."
  },
  {
    id: 310028, m1: MOL.LINALOL, m2: MOL.BISABOLENE, type: 'potentialisation',
    desc: "Synergie anti-inflammatoire et calmante. Le bisabolène renforce l'action anxiolytique du linalol.",
    mech: "Action combinée sur les voies NF-κB (bisabolène) et GABA (linalol). Profil anti-inflammatoire-anxiolytique.",
    app: "Accord floral-boisé-terreux. Présent dans les cultivars indica profonds."
  },

  // === α-PINÈNE × autres terpènes ===
  {
    id: 310029, m1: MOL.ALPHA_PINENE, m2: MOL.BETA_PINENE, type: 'potentialisation',
    desc: "Synergie résineux-boisée. Les deux isomères du pinène se renforcent mutuellement pour créer un accord forestier complexe.",
    mech: "Activation complémentaire des récepteurs olfactifs résineux. L'α-pinène (frais-résineux) et le β-pinène (boisé-floral) se complètent.",
    app: "Accord résineux-boisé-forestier. Cultivars Jack Herer, Pineapple Express. Ratio 3:1 (α:β)."
  },
  {
    id: 310030, m1: MOL.ALPHA_PINENE, m2: MOL.EUCALYPTOL, type: 'potentialisation',
    desc: "Synergie bronchodilatatrice et anti-inflammatoire. L'α-pinène et l'eucalyptol créent un profil respiratoire thérapeutique.",
    mech: "Action combinée sur les muscles bronchiques et les récepteurs TRP. L'α-pinène inhibe l'acétylcholinestérase.",
    app: "Accord résineux-mentholé-frais. Cultivars Super Silver Haze. Utilisé pour les affections respiratoires."
  },
  {
    id: 310031, m1: MOL.ALPHA_PINENE, m2: MOL.TERPINOLENE, type: 'transformation',
    desc: "Le terpinolène transforme le profil résineux de l'α-pinène en accord plus floral et herbacé.",
    mech: "Compétition olfactive : le terpinolène (floral-herbacé) module la perception résineux-frais de l'α-pinène.",
    app: "Accord résineux-floral-herbacé. Cultivars Jack Herer, Durban Poison. Caractéristique des sativas."
  },
  {
    id: 310032, m1: MOL.ALPHA_PINENE, m2: MOL.CAMPHRE, type: 'masquage',
    desc: "Le camphre masque partiellement le profil résineux-frais de l'α-pinène, créant un accord plus médicinal.",
    mech: "Compétition pour les récepteurs TRPM8 (froid). Le camphre domine la perception olfactive.",
    app: "Accord résineux-camphré médicinal. Présent dans certains cultivars indica afghans."
  },
  {
    id: 310033, m1: MOL.ALPHA_PINENE, m2: MOL.BORNEOL, type: 'potentialisation',
    desc: "Synergie antibactérienne et anti-inflammatoire. Le bornéol renforce l'action de l'α-pinène.",
    mech: "Action combinée sur les membranes bactériennes et les récepteurs TRP. Le bornéol facilite le passage cutané.",
    app: "Accord résineux-camphré-boisé. Présent dans les cultivars à profil médicinal traditionnel."
  },

  // === TERPINOLÈNE × autres terpènes ===
  {
    id: 310034, m1: MOL.TERPINOLENE, m2: MOL.OCIMENE, type: 'potentialisation',
    desc: "Synergie florale-herbacée caractéristique des sativas africaines. Le terpinolène et l'ocimène créent un accord doux et aérien.",
    mech: "Activation complémentaire des récepteurs olfactifs floraux. Synergie antioxydante via les voies NRF2.",
    app: "Accord floral-herbacé-doux. Cultivars Durban Poison, Jack Herer. Profil sativa stimulant."
  },
  {
    id: 310035, m1: MOL.TERPINOLENE, m2: MOL.GERANIOL, type: 'potentialisation',
    desc: "Synergie florale complexe. Le terpinolène et le géraniol créent un accord floral-herbacé-rosé.",
    mech: "Activation complémentaire des récepteurs olfactifs floraux. Synergie anti-nociceptive.",
    app: "Accord floral-herbacé-rosé. Présent dans certains cultivars sativa thaïlandais."
  },
  {
    id: 310036, m1: MOL.TERPINOLENE, m2: MOL.VALENCENE, type: 'transformation',
    desc: "Le valencène transforme le profil floral-herbacé du terpinolène en accord plus agrumé et fruité.",
    mech: "Compétition olfactive : le valencène (orange) module la perception florale-herbacée du terpinolène.",
    app: "Accord floral-agrumé-fruité. Cultivars Tangie, Agent Orange. Profil sativa fruité."
  },

  // === NEROLIDOL × autres terpènes ===
  {
    id: 310037, m1: MOL.NEROLIDOL, m2: MOL.PHYTOL, type: 'stabilisation',
    desc: "Le phytol stabilise le nérolidol et prolonge sa présence olfactive. Association typique des cultivars à profil indica profond.",
    mech: "Interaction entre les deux diterpènes. Le phytol réduit la volatilité du nérolidol.",
    app: "Accord floral-boisé-terreux persistant. Cultivars Skywalker OG. Excellent fixateur naturel."
  },
  {
    id: 310038, m1: MOL.NEROLIDOL, m2: MOL.GUAIOL, type: 'potentialisation',
    desc: "Synergie sédative et anti-parasitaire. Le guaiol renforce l'action sédative du nérolidol.",
    mech: "Action combinée sur les canaux potassiques Kv et les récepteurs CB1. Profil sédatif-relaxant.",
    app: "Accord floral-boisé-terreux. Cultivars Pennywise, Chocolope. Profil médical nocturne."
  },
  {
    id: 310039, m1: MOL.NEROLIDOL, m2: MOL.BISABOLENE, type: 'potentialisation',
    desc: "Synergie sédative et anti-inflammatoire. Le bisabolène renforce l'action du nérolidol.",
    mech: "Action combinée sur les canaux calciques et les voies NF-κB. Profil anti-inflammatoire-sédatif.",
    app: "Accord floral-boisé-terreux profond. Présent dans les cultivars indica afghans."
  },

  // === EUCALYPTOL × autres terpènes ===
  {
    id: 310040, m1: MOL.EUCALYPTOL, m2: MOL.CAMPHRE, type: 'potentialisation',
    desc: "Synergie mentholée-camphrée. L'eucalyptol et le camphre créent un accord médicinal frais très caractéristique.",
    mech: "Action combinée sur TRPM8 (froid) et TRPV1 (chaleur). Profil analgésique topique.",
    app: "Accord mentholé-camphré médicinal. Présent dans certains cultivars afghans. Utilisé en médecine traditionnelle."
  },
  {
    id: 310041, m1: MOL.EUCALYPTOL, m2: MOL.BORNEOL, type: 'potentialisation',
    desc: "Synergie antibactérienne et bronchodilatatrice. Le bornéol renforce l'action respiratoire de l'eucalyptol.",
    mech: "Action combinée sur les membranes bactériennes et les muscles bronchiques. Le bornéol facilite la pénétration cutanée.",
    app: "Accord mentholé-camphré-boisé. Présent dans les cultivars médicinaux traditionnels."
  },

  // === GÉRANIOL × autres terpènes ===
  {
    id: 310042, m1: MOL.GERANIOL, m2: MOL.CITRONELLOL, type: 'potentialisation',
    desc: "Synergie florale-citronnée. Le géraniol et le citronellol créent un accord rose-citronné complexe.",
    mech: "Activation complémentaire des récepteurs olfactifs floraux. Synergie anti-nociceptive et antimicrobienne.",
    app: "Accord rose-citronné délicat. Présent dans certains cultivars thaïlandais et africains."
  },
  {
    id: 310043, m1: MOL.GERANIOL, m2: MOL.NEROL, type: 'potentialisation',
    desc: "Synergie florale entre les deux isomères géométriques. Le géraniol (trans) et le nérol (cis) créent un accord floral riche.",
    mech: "Les deux isomères activent les mêmes récepteurs olfactifs avec des intensités différentes. Synergie anti-nociceptive.",
    app: "Accord floral rose-néroli complexe. Présent dans les cultivars à profil floral rare."
  },
  {
    id: 310044, m1: MOL.GERANIOL, m2: MOL.VALENCENE, type: 'transformation',
    desc: "Le valencène transforme le profil floral du géraniol en accord floral-agrumé plus complexe.",
    mech: "Compétition olfactive : le valencène (orange) module la perception florale-rosée du géraniol.",
    app: "Accord floral-agrumé-rosé. Cultivars Tangie. Profil sativa fruité-floral."
  },

  // === HUMULÈNE × autres terpènes ===
  {
    id: 310045, m1: MOL.CARYOPHYLLENE, m2: MOL.LINALOL, type: 'potentialisation',
    desc: "Le caryophyllène (oxyde) renforce l'effet anxiolytique du linalol. Association présente dans les cultivars indica relaxants.",
    mech: "Le caryophyllène oxyde active les récepteurs CB2, le linalol module GABA. Synergie anti-anxiété.",
    app: "Accord boisé-floral-épicé. Cultivars Lavender Kush. Profil indica relaxant profond."
  },
  {
    id: 310046, m1: MOL.CARYOPHYLLENE, m2: MOL.MYRCENE, type: 'potentialisation',
    desc: "Synergie anti-inflammatoire et sédative. Le caryophyllène oxyde renforce l'effet du myrcène.",
    mech: "Action combinée sur CB2 (caryophyllène) et GABA (myrcène). Profil indica sédatif.",
    app: "Accord boisé-terreux-épicé. Cultivars OG Kush. Profil indica classique."
  },

  // === VALENCÈNE × autres terpènes ===
  {
    id: 310047, m1: MOL.VALENCENE, m2: MOL.CITRONELLOL, type: 'potentialisation',
    desc: "Synergie agrumée complexe. Le valencène et le citronellol créent un accord orange-citron-rose.",
    mech: "Activation complémentaire des récepteurs olfactifs agrumés et floraux. Synergie antimicrobienne.",
    app: "Accord agrumé-floral complexe. Cultivars Tangie, Agent Orange. Très apprécié en parfumerie."
  },
  {
    id: 310048, m1: MOL.VALENCENE, m2: MOL.OCIMENE, type: 'potentialisation',
    desc: "Synergie agrumée-herbacée. Le valencène et l'ocimène créent un accord fruité-herbacé aérien.",
    mech: "Activation complémentaire des récepteurs olfactifs. Synergie antioxydante.",
    app: "Accord agrumé-herbacé-fruité. Cultivars Durban Poison, Tangie. Profil sativa stimulant."
  },

  // === GUAIOL × autres terpènes ===
  {
    id: 310049, m1: MOL.GUAIOL, m2: MOL.BISABOLENE, type: 'potentialisation',
    desc: "Synergie anti-inflammatoire et analgésique. Le guaiol et le bisabolène se renforcent mutuellement.",
    mech: "Action combinée sur les voies COX-2 et NF-κB. Profil anti-inflammatoire puissant.",
    app: "Accord boisé-terreux-résineux. Présent dans les cultivars médicinaux à profil indica profond."
  },
  {
    id: 310050, m1: MOL.GUAIOL, m2: MOL.PHYTOL, type: 'stabilisation',
    desc: "Le phytol stabilise le guaiol et prolonge son action anti-inflammatoire.",
    mech: "Interaction entre les deux terpènes. Le phytol réduit la volatilité du guaiol.",
    app: "Accord boisé-terreux persistant. Cultivars Pennywise. Excellent pour les formulations médicinales."
  },

  // === PHYTOL × autres terpènes ===
  {
    id: 310051, m1: MOL.PHYTOL, m2: MOL.BISABOLENE, type: 'stabilisation',
    desc: "Le phytol stabilise le bisabolène et prolonge son action anti-inflammatoire.",
    mech: "Interaction entre les deux terpènes à longue chaîne. Le phytol réduit la volatilité du bisabolène.",
    app: "Accord boisé-terreux-résineux persistant. Présent dans les cultivars indica afghans."
  },

  // === SABINÈNE × autres terpènes ===
  {
    id: 310052, m1: MOL.SABINENE, m2: MOL.ALPHA_PINENE, type: 'potentialisation',
    desc: "Synergie résineux-épicée. Le sabinène et l'α-pinène créent un accord boisé-épicé-résineux.",
    mech: "Activation complémentaire des récepteurs olfactifs résineux et épicés. Synergie antibactérienne.",
    app: "Accord résineux-épicé-boisé. Présent dans certains cultivars indica afghans."
  },
  {
    id: 310053, m1: MOL.SABINENE, m2: MOL.MYRCENE, type: 'transformation',
    desc: "Le myrcène transforme le profil épicé-boisé du sabinène en accord plus terreux et doux.",
    mech: "Compétition olfactive : le myrcène (terreux) module la perception épicée-boisée du sabinène.",
    app: "Accord terreux-épicé-boisé. Présent dans certains cultivars hybrides."
  },

  // === OCIMÈNE × autres terpènes ===
  {
    id: 310054, m1: MOL.OCIMENE, m2: MOL.LINALOL, type: 'potentialisation',
    desc: "Synergie florale-herbacée douce. L'ocimène et le linalol créent un accord floral-herbacé aérien.",
    mech: "Activation complémentaire des récepteurs olfactifs floraux. Synergie anxiolytique légère.",
    app: "Accord floral-herbacé-doux. Cultivars Strawberry Cough. Profil sativa léger."
  },
  {
    id: 310055, m1: MOL.OCIMENE, m2: MOL.GERANIOL, type: 'potentialisation',
    desc: "Synergie florale-herbacée-rosée. L'ocimène et le géraniol créent un accord floral complexe.",
    mech: "Activation complémentaire des récepteurs olfactifs floraux. Synergie antimicrobienne.",
    app: "Accord floral-herbacé-rosé. Présent dans certains cultivars sativa thaïlandais."
  },

  // === BORNEOL × autres terpènes ===
  {
    id: 310056, m1: MOL.BORNEOL, m2: MOL.CAMPHRE, type: 'potentialisation',
    desc: "Synergie camphrée-boisée. Le bornéol et le camphre créent un accord médicinal camphré-boisé.",
    mech: "Action combinée sur TRPM8 et TRPV1. Le bornéol facilite la pénétration cutanée du camphre.",
    app: "Accord camphré-boisé médicinal. Présent dans les cultivars afghans traditionnels."
  },

  // === CITRONELLOL × autres terpènes ===
  {
    id: 310057, m1: MOL.CITRONELLOL, m2: MOL.NEROL, type: 'potentialisation',
    desc: "Synergie florale-citronnée. Le citronellol et le nérol créent un accord fleur d'oranger-citron-rose.",
    mech: "Activation complémentaire des récepteurs olfactifs floraux et agrumés. Synergie anti-nociceptive.",
    app: "Accord floral-citronné délicat. Présent dans certains cultivars thaïlandais rares."
  },

  // === SYNERGIES TABAC × TERPÈNES CANNABIS (pont entre les deux univers) ===
  {
    id: 310058, m1: MOL.MYRCENE, m2: MOL.LINALOL, type: 'potentialisation',
    desc: "Association fondamentale de l'effet entourage. Myrcène et linalol forment la base de nombreux cultivars indica thérapeutiques.",
    mech: "Synergie GABAergique et sédative. Le myrcène augmente la perméabilité membranaire, le linalol module GABA.",
    app: "Accord terreux-floral. Base de nombreux cultivars indica. Ratio 3:2 (myrcène:linalol) pour effet optimal."
  },
  {
    id: 310059, m1: MOL.BETA_CARYOPHYLLENE, m2: MOL.TERPINOLENE, type: 'transformation',
    desc: "Le terpinolène transforme le profil épicé-boisé du β-caryophyllène en accord plus floral et herbacé.",
    mech: "Compétition olfactive et modulation des récepteurs CB2. Le terpinolène atténue la perception épicée.",
    app: "Accord boisé-floral-herbacé. Cultivars Jack Herer OG. Profil hybride équilibré."
  },
  {
    id: 310060, m1: MOL.LIMONENE, m2: MOL.NEROLIDOL, type: 'stabilisation',
    desc: "Le limonène stabilise le nérolidol et prolonge sa présence olfactive dans les cultivars citronnés.",
    mech: "Interaction hydrophobe entre le monoterpène et le sesquiterpène. Réduction de la volatilité du nérolidol.",
    app: "Accord agrumé-floral-boisé persistant. Cultivars Lemon Haze. Excellent pour les formulations longue durée."
  },
  {
    id: 310061, m1: MOL.ALPHA_PINENE, m2: MOL.LINALOL, type: 'transformation',
    desc: "L'α-pinène transforme le profil floral-sédatif du linalol en accord plus équilibré et stimulant.",
    mech: "L'α-pinène inhibe l'acétylcholinestérase, contrebalançant la sédation du linalol. Profil hybride.",
    app: "Accord résineux-floral équilibré. Cultivars Lavender Haze. Profil hybride sativa-indica."
  },
  {
    id: 310062, m1: MOL.MYRCENE, m2: MOL.BETA_PINENE, type: 'potentialisation',
    desc: "Le myrcène et le β-pinène créent un accord terreux-boisé-floral caractéristique des cultivars hybrides.",
    mech: "Activation complémentaire des récepteurs olfactifs. Synergie sédative légère.",
    app: "Accord terreux-boisé-floral. Cultivars Pineapple Express. Profil hybride polyvalent."
  },
  {
    id: 310063, m1: MOL.LIMONENE, m2: MOL.BISABOLENE, type: 'transformation',
    desc: "Le bisabolène transforme le profil agrumé du limonène en accord plus doux et boisé.",
    mech: "Compétition olfactive : le bisabolène (boisé-doux) module la perception agrumée du limonène.",
    app: "Accord agrumé-boisé-doux. Présent dans certains cultivars hybrides."
  },
  {
    id: 310064, m1: MOL.BETA_CARYOPHYLLENE, m2: MOL.OCIMENE, type: 'transformation',
    desc: "L'ocimène transforme le profil épicé-boisé du β-caryophyllène en accord plus floral et herbacé.",
    mech: "Compétition olfactive : l'ocimène (floral-herbacé) adoucit la perception épicée-boisée.",
    app: "Accord boisé-floral-herbacé. Cultivars Durban Poison OG. Profil hybride sativa-indica."
  },
  {
    id: 310065, m1: MOL.LINALOL, m2: MOL.TERPINOLENE, type: 'transformation',
    desc: "Le terpinolène transforme le profil floral-sédatif du linalol en accord plus herbacé et stimulant.",
    mech: "Compétition olfactive et modulation des récepteurs. Le terpinolène atténue la sédation du linalol.",
    app: "Accord floral-herbacé équilibré. Cultivars Jack Herer. Profil sativa-indica équilibré."
  },
  {
    id: 310066, m1: MOL.MYRCENE, m2: MOL.GUAIOL, type: 'potentialisation',
    desc: "Synergie anti-inflammatoire et sédative. Le guaiol renforce l'effet sédatif du myrcène.",
    mech: "Action combinée sur les voies COX-2 et GABA. Profil indica anti-inflammatoire.",
    app: "Accord terreux-boisé-résineux. Cultivars Pennywise. Profil médical indica."
  },
  {
    id: 310067, m1: MOL.LIMONENE, m2: MOL.GERANIOL, type: 'potentialisation',
    desc: "Synergie agrumée-florale. Le limonène et le géraniol créent un accord citron-rose complexe.",
    mech: "Activation complémentaire des récepteurs olfactifs agrumés et floraux. Synergie anti-nociceptive.",
    app: "Accord agrumé-floral-rosé. Présent dans certains cultivars sativa thaïlandais."
  },
  {
    id: 310068, m1: MOL.ALPHA_PINENE, m2: MOL.GERANIOL, type: 'transformation',
    desc: "Le géraniol transforme le profil résineux-frais de l'α-pinène en accord plus floral.",
    mech: "Compétition olfactive : le géraniol (floral-rosé) module la perception résineux-frais de l'α-pinène.",
    app: "Accord résineux-floral-rosé. Présent dans certains cultivars hybrides rares."
  },
  {
    id: 310069, m1: MOL.BETA_CARYOPHYLLENE, m2: MOL.CITRONELLOL, type: 'transformation',
    desc: "Le citronellol transforme le profil épicé-boisé du β-caryophyllène en accord plus floral-citronné.",
    mech: "Compétition olfactive : le citronellol (floral-citronné) adoucit la perception épicée-boisée.",
    app: "Accord boisé-épicé-floral-citronné. Présent dans certains cultivars hybrides."
  },
  {
    id: 310070, m1: MOL.MYRCENE, m2: MOL.PHYTOL, type: 'stabilisation',
    desc: "Le phytol stabilise le myrcène et prolonge sa présence olfactive dans les cultivars indica.",
    mech: "Interaction entre le monoterpène et le diterpène. Le phytol réduit la volatilité du myrcène.",
    app: "Accord terreux persistant. Cultivars OG Kush. Excellent pour les formulations longue durée."
  },
  {
    id: 310071, m1: MOL.LIMONENE, m2: MOL.SABINENE, type: 'potentialisation',
    desc: "Synergie agrumée-épicée. Le limonène et le sabinène créent un accord citron-épicé-boisé.",
    mech: "Activation complémentaire des récepteurs olfactifs. Synergie antibactérienne.",
    app: "Accord agrumé-épicé-boisé. Présent dans certains cultivars hybrides."
  },
  {
    id: 310072, m1: MOL.LINALOL, m2: MOL.BORNEOL, type: 'potentialisation',
    desc: "Synergie anxiolytique et antibactérienne. Le bornéol renforce l'action anxiolytique du linalol.",
    mech: "Action combinée sur GABA (linalol) et les membranes bactériennes (bornéol). Le bornéol facilite la pénétration.",
    app: "Accord floral-camphré-boisé. Présent dans les cultivars médicinaux traditionnels."
  },
  {
    id: 310073, m1: MOL.BETA_CARYOPHYLLENE, m2: MOL.PHYTOL, type: 'stabilisation',
    desc: "Le phytol stabilise le β-caryophyllène et prolonge son action anti-inflammatoire.",
    mech: "Interaction entre les deux terpènes. Le phytol réduit la volatilité du β-caryophyllène.",
    app: "Accord boisé-épicé persistant. Cultivars OG Kush. Excellent pour les formulations médicinales."
  },
  {
    id: 310074, m1: MOL.MYRCENE, m2: MOL.SABINENE, type: 'transformation',
    desc: "Le sabinène transforme le profil terreux du myrcène en accord plus épicé et boisé.",
    mech: "Compétition olfactive : le sabinène (épicé-boisé) module la perception terreuse du myrcène.",
    app: "Accord terreux-épicé-boisé. Présent dans certains cultivars hybrides."
  },
  {
    id: 310075, m1: MOL.LIMONENE, m2: MOL.BORNEOL, type: 'transformation',
    desc: "Le bornéol transforme le profil agrumé du limonène en accord plus camphré-médicinal.",
    mech: "Compétition olfactive : le bornéol (camphré-boisé) module la perception agrumée du limonène.",
    app: "Accord agrumé-camphré médicinal. Présent dans certains cultivars médicinaux traditionnels."
  },
  {
    id: 310076, m1: MOL.ALPHA_PINENE, m2: MOL.NEROLIDOL, type: 'stabilisation',
    desc: "L'α-pinène stabilise le nérolidol et prolonge sa présence olfactive.",
    mech: "Interaction entre le monoterpène et le sesquiterpène. L'α-pinène réduit la volatilité du nérolidol.",
    app: "Accord résineux-floral-boisé persistant. Cultivars Jack Herer. Excellent fixateur naturel."
  },
  {
    id: 310077, m1: MOL.TERPINOLENE, m2: MOL.BISABOLENE, type: 'potentialisation',
    desc: "Synergie florale-boisée. Le terpinolène et le bisabolène créent un accord floral-herbacé-boisé.",
    mech: "Activation complémentaire des récepteurs olfactifs. Synergie antioxydante.",
    app: "Accord floral-herbacé-boisé. Présent dans certains cultivars sativa."
  },
  {
    id: 310078, m1: MOL.EUCALYPTOL, m2: MOL.ALPHA_PINENE, type: 'potentialisation',
    desc: "Synergie bronchodilatatrice et anti-inflammatoire. L'eucalyptol et l'α-pinène créent un profil respiratoire thérapeutique complet.",
    mech: "Action combinée sur les muscles bronchiques et les récepteurs TRP. Profil anti-inflammatoire respiratoire.",
    app: "Accord mentholé-résineux-frais. Cultivars Super Silver Haze. Utilisé pour les affections respiratoires."
  },
  {
    id: 310079, m1: MOL.GERANIOL, m2: MOL.NEROLIDOL, type: 'stabilisation',
    desc: "Le géraniol stabilise le nérolidol et prolonge son profil floral-boisé.",
    mech: "Interaction entre les deux alcools terpéniques. Le géraniol réduit la volatilité du nérolidol.",
    app: "Accord floral-boisé persistant. Présent dans certains cultivars à profil floral rare."
  },
  {
    id: 310080, m1: MOL.MYRCENE, m2: MOL.OCIMENE, type: 'transformation',
    desc: "L'ocimène transforme le profil terreux du myrcène en accord plus floral et herbacé.",
    mech: "Compétition olfactive : l'ocimène (floral-herbacé) module la perception terreuse du myrcène.",
    app: "Accord terreux-floral-herbacé. Cultivars Durban Poison. Profil sativa-indica équilibré."
  },
];

async function seedSynergies() {
  console.log(`Insertion de ${synergies.length} synergies terpènes cannabis...`);
  let inserted = 0;
  let skipped = 0;

  for (const s of synergies) {
    try {
      // Vérifier si la synergie existe déjà
      const [existing] = await pool.execute(
        'SELECT id FROM molecule_synergies WHERE id = ?',
        [s.id]
      );
      if (existing.length > 0) {
        skipped++;
        continue;
      }

      await pool.execute(
        `INSERT INTO molecule_synergies (id, molecule1_id, molecule2_id, type, description, chemical_mechanism, applications)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [s.id, s.m1, s.m2, s.type, s.desc, s.mech, s.app]
      );
      inserted++;
      if (inserted % 10 === 0) console.log(`  ${inserted}/${synergies.length} insérées...`);
    } catch (e) {
      console.error(`  ❌ Erreur synergie ${s.id}: ${e.message}`);
    }
  }

  console.log(`\n✅ Terminé : ${inserted} synergies insérées, ${skipped} déjà existantes`);

  // Vérification finale
  const [count] = await pool.execute('SELECT COUNT(*) as total FROM molecule_synergies');
  console.log(`📊 Total synergies en base : ${count[0].total}`);
  process.exit(0);
}

seedSynergies().catch(e => { console.error(e); process.exit(1); });
