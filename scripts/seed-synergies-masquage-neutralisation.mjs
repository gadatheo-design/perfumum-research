import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// IDs récupérés de la DB
// Tabacs: 1=Krumovgrad, 2=Virginia Orange, 3=Virginia Deutscher, 4=Virginia Gold, 5=Burley, 6=Samsoun, 7=Virginia Bright, 8=Virginia Italia
// Molécules: 3=Ambroxan, 30002=Linalol, 30005=β-Caryophyllène, 30006=Myrcène, 30007=Limonène, 60016=Indole, 90069=Vanilline
//            210002=Skatole, 210003=Acide butyrique, 300005=Coumarine, 720027=Solanone, 720033=Nicotine, 750002=Damascenone
//            930006=Furfural, 660001=Géraniol, 660002=Citronellol, 1050025=Acide acétique, 720030=Benzaldéhyde

// Synergies de MASQUAGE (une molécule réduit/masque la perception d'une autre)
const masquageSynergies = [
  // Masquage des notes âcres/ammoniacales du tabac par des molécules florales
  {
    id: 60013,
    name: "Virginia Gold × Géraniol : Masquage Ammoniacal",
    tabac_id: 4, // Virginia Gold
    molecule_id: 660001, // Géraniol
    famille_id: null,
    type: "masquage",
    effet: "Le géraniol (rose, géranium) masque les notes ammoniacales et âcres du Virginia Gold lors de la combustion. La molécule florale sature les récepteurs olfactifs avant que les composés azotés n'atteignent le seuil de perception.",
    notes: "Concentration efficace : 0.5-2% géraniol. Réduction de la perception ammoniacale de 40-60%. Utilisé dans les tabacs aromatisés haut de gamme."
  },
  {
    id: 60014,
    name: "Burley × Vanilline : Masquage Terreux",
    tabac_id: 5, // Burley
    molecule_id: 90069, // Vanilline
    famille_id: null,
    type: "masquage",
    effet: "La vanilline masque les notes terreuses et végétales du Burley non traité. La douceur de la vanilline crée un voile olfactif qui atténue les composés verts et herbacés caractéristiques du Burley brut.",
    notes: "Effet de masquage optimal à 0.3-1.5% vanilline. Technique classique dans la production de tabac à pipe aromatisé. Réduction des notes vertes de 50-70%."
  },
  {
    id: 60015,
    name: "Samsoun × Linalol : Masquage Pyrazinique",
    tabac_id: 6, // Samsoun
    molecule_id: 30002, // Linalol
    famille_id: null,
    type: "masquage",
    effet: "Le linalol (lavande, coriandre) masque les notes pyraziniques intenses et grillées du Samsoun. Les pyrazines, responsables des arômes de café torréfié, sont atténuées par le caractère floral-boisé du linalol.",
    notes: "Seuil de masquage : 0.8% linalol pour réduction de 35% des pyrazines. Préservation du caractère oriental du Samsoun. Technique utilisée dans les mélanges orientaux doux."
  },
  {
    id: 60016,
    name: "Virginia Bright × Coumarine : Masquage Herbacé",
    tabac_id: 7, // Virginia Bright
    molecule_id: 300005, // Coumarine
    famille_id: null,
    type: "masquage",
    effet: "La coumarine (foin coupé, tonka) masque les notes herbacées et chlorophylliennes du Virginia Bright frais. La lactone crée une transition douce entre les notes vertes et les notes sucrées caractéristiques du Virginia.",
    notes: "Concentration : 0.2-0.8% coumarine. Réduction des notes herbacées de 45%. Attention : limite IFRA pour la coumarine dans les produits aromatiques."
  },
  {
    id: 60017,
    name: "Krumovgrad × Damascenone : Masquage Sulfuré",
    tabac_id: 1, // Krumovgrad
    molecule_id: 750002, // Damascenone
    famille_id: null,
    type: "masquage",
    effet: "La damascenone (rose, pomme, prune) masque les composés soufrés du Krumovgrad à des concentrations infimes. La molécule, active à quelques ppb, sature les récepteurs olfactifs et réduit la perception des mercaptans et thioéthers.",
    notes: "Efficace à 0.001-0.01% — l'une des molécules de masquage les plus puissantes connues. Réduction des composés soufrés de 60-80% à ces concentrations."
  },
  {
    id: 60018,
    name: "Virginia Orange × Furfural : Masquage Acidulé",
    tabac_id: 2, // Virginia Orange
    molecule_id: 930006, // Furfural
    famille_id: null,
    type: "masquage",
    effet: "Le furfural (amande, caramel, pain) masque les notes acidulées et citriques du Virginia Orange. La molécule de Maillard crée un fond chaud et biscuité qui atténue la perception des acides organiques volatils.",
    notes: "Concentration : 0.5-2% furfural. Réduction de l'acidité perçue de 30-40%. Effet secondaire positif : renforcement des notes caramel caractéristiques du Virginia Orange."
  },
  {
    id: 60019,
    name: "Samsoun × β-Caryophyllène : Masquage Nicotinique",
    tabac_id: 6, // Samsoun
    molecule_id: 30005, // β-Caryophyllène
    famille_id: null,
    type: "masquage",
    effet: "Le β-caryophyllène (poivre noir, clou de girofle) masque partiellement les notes nicotiniques âcres du Samsoun. Le sesquiterpène interagit avec les récepteurs CB2 et modifie la perception des alcaloïdes du tabac.",
    notes: "Réduction de la perception nicotinique de 20-30%. Interaction pharmacologique documentée β-caryophyllène/récepteurs cannabinoïdes. Utilisé dans les tabacs premium orientaux."
  },
  {
    id: 60020,
    name: "Burley × Myrcène : Masquage Métallique",
    tabac_id: 5, // Burley
    molecule_id: 30006, // Myrcène
    famille_id: null,
    type: "masquage",
    effet: "Le myrcène (houblon, mangue, thym) masque les notes métalliques et minérales du Burley non traité. Le terpène monofonctionnel crée un fond fruité-herbacé qui atténue la perception des composés ferreux et minéraux.",
    notes: "Concentration efficace : 0.3-1.2% myrcène. Réduction des notes métalliques de 35-50%. Technique utilisée dans les tabacs à pipe de style anglais."
  },
  {
    id: 60021,
    name: "Virginia Deutscher × Limonène : Masquage Boisé-Sec",
    tabac_id: 3, // Virginia Deutscher
    molecule_id: 30007, // Limonène
    famille_id: null,
    type: "masquage",
    effet: "Le limonène (citrus, agrumes) masque les notes boisées-sèches et poussiéreuses du Virginia Deutscher. Le monoterpène crée une fraîcheur citronnée qui voile les composés cellulosiques et les phénols de combustion.",
    notes: "Concentration : 1-3% limonène. Réduction des notes boisées-sèches de 40%. Volatilité élevée du limonène : effet de masquage principalement en phase initiale de combustion."
  },
  {
    id: 60022,
    name: "Virginia Italia × Ambroxan : Masquage Fumé",
    tabac_id: 8, // Virginia Italia
    molecule_id: 3, // Ambroxan
    famille_id: null,
    type: "masquage",
    effet: "L'ambroxan (ambre gris de synthèse) masque les notes fumées et créosotiques du Virginia Italia. La molécule musquée-ambrée crée un fond chaud et soyeux qui atténue la perception des phénols de combustion (gaïacol, syringol).",
    notes: "Concentration : 0.1-0.5% ambroxan. Réduction des notes fumées de 25-35%. L'ambroxan est un amplificateur olfactif qui modifie aussi la perception d'autres molécules présentes."
  },
  {
    id: 60023,
    name: "Basma × Coumarine : Masquage Phénolique",
    tabac_id: 30003, // Basma
    molecule_id: 300005, // Coumarine
    famille_id: null,
    type: "masquage",
    effet: "La coumarine masque les notes phénoliques intenses du Basma (tabac oriental). Les phénols de combustion (gaïacol, crésol) sont atténués par la douceur lactique et boisée de la coumarine.",
    notes: "Réduction des phénols perçus de 40-55%. Technique traditionnelle dans les mélanges orientaux. La coumarine est naturellement présente dans certains tabacs orientaux à faibles concentrations."
  },
  {
    id: 60024,
    name: "Katerini × Damascenone : Masquage Végétal-Vert",
    tabac_id: 30004, // Katerini
    molecule_id: 750002, // Damascenone
    famille_id: null,
    type: "masquage",
    effet: "La damascenone masque les notes végétales-vertes du Katerini frais. Les chlorophylles et composés verts sont atténués par la complexité florale-fruitée de la damascenone, révélant les notes orientales sous-jacentes.",
    notes: "Efficace à très faibles concentrations (0.005-0.02%). Technique de maturation accélérée utilisée dans la production de tabacs orientaux premium."
  },
  {
    id: 60025,
    name: "Perique × Vanilline : Masquage Fermenté",
    tabac_id: 30012, // Perique
    molecule_id: 90069, // Vanilline
    famille_id: null,
    type: "masquage",
    effet: "La vanilline masque les notes fermentées et acides du Perique (tabac fermenté sous pression). Les acides gras volatils et les composés de fermentation sont atténués par la douceur de la vanilline.",
    notes: "Concentration : 0.5-2% vanilline. Réduction de l'acidité fermentée de 45-60%. Technique utilisée dans les mélanges Perique pour les palais non habitués."
  },
  {
    id: 60026,
    name: "Yenidje × Géraniol : Masquage Terreux-Minéral",
    tabac_id: 30001, // Yenidje
    molecule_id: 660001, // Géraniol
    famille_id: null,
    type: "masquage",
    effet: "Le géraniol masque les notes terreuses et minérales du Yenidje (tabac oriental de Macédoine). Le monoterpène floral crée un voile rosé qui atténue les composés géosminiques et les notes de sol humide.",
    notes: "Concentration : 0.3-1% géraniol. Réduction des notes terreuses de 35-45%. Préservation du caractère oriental distinctif du Yenidje."
  },
  {
    id: 60027,
    name: "Izmir × Linalol : Masquage Épicé-Âcre",
    tabac_id: 30006, // Izmir/Smyrna
    molecule_id: 30002, // Linalol
    famille_id: null,
    type: "masquage",
    effet: "Le linalol masque les notes épicées-âcres de l'Izmir/Smyrna. Les composés terpéniques épicés et les phénols de combustion sont atténués par le caractère floral-boisé du linalol.",
    notes: "Concentration : 0.5-1.5% linalol. Réduction des notes âcres de 30-40%. Technique utilisée dans les mélanges turcs doux."
  }
];

// Synergies de NEUTRALISATION (annulation mutuelle des odeurs)
const neutralisationSynergies = [
  {
    id: 60028,
    name: "Skatole × Vanilline : Neutralisation Fécale",
    tabac_id: null,
    molecule_id: 210002, // Skatole
    famille_id: null,
    type: "neutralisation",
    effet: "La vanilline neutralise partiellement les notes fécales et animales du skatole. À ratio 1:3 (skatole:vanilline), la perception fécale est réduite de 70-80%. Cette neutralisation est utilisée dans les compositions parfumées pour transformer le skatole en note florale-animale complexe.",
    notes: "Ratio optimal : 1 partie skatole pour 3-5 parties vanilline. Mécanisme : compétition pour les récepteurs olfactifs OR51E2. Utilisé en parfumerie pour les notes cuir et animales."
  },
  {
    id: 60029,
    name: "Indole × Géraniol : Neutralisation Animale",
    tabac_id: null,
    molecule_id: 60016, // Indole
    famille_id: null,
    type: "neutralisation",
    effet: "Le géraniol neutralise les notes animales et fécales de l'indole. À hautes concentrations, l'indole est perçu comme fécal ; le géraniol inverse cette perception vers une note florale-animale caractéristique du jasmin.",
    notes: "Ratio optimal : 1:4 (indole:géraniol). Réduction de la note fécale de 60-75%. Mécanisme identique au jasmin naturel qui contient les deux molécules en proportion similaire."
  },
  {
    id: 60030,
    name: "Acide butyrique × Damascenone : Neutralisation Rance",
    tabac_id: null,
    molecule_id: 210003, // Acide butyrique
    famille_id: null,
    type: "neutralisation",
    effet: "La damascenone neutralise les notes rances et fromage de l'acide butyrique. La molécule florale-fruitée de la damascenone annule la perception de l'acide butyrique à des concentrations inférieures à 0.1%.",
    notes: "Ratio optimal : 1:0.01 (acide butyrique:damascenone). La damascenone est 1000x plus puissante que l'acide butyrique. Technique utilisée dans les compositions florales complexes."
  },
  {
    id: 60031,
    name: "Pyridine × Coumarine : Neutralisation Médicamenteuse",
    tabac_id: null,
    molecule_id: null,
    famille_id: null,
    type: "neutralisation",
    effet: "La coumarine neutralise les notes médicamenteuses et pharmaceutiques de la pyridine. La lactone boisée-sucrée annule la perception de la pyridine (tabac brûlé, médicament) en créant une note de foin-tonka complexe.",
    notes: "Ratio optimal : 1:2 (pyridine:coumarine). Réduction de la note médicamenteuse de 55-65%. Technique utilisée dans les tabacs aromatisés pour masquer la pyridine de combustion."
  },
  {
    id: 60032,
    name: "Acide acétique × Ambroxan : Neutralisation Vinaigrée",
    tabac_id: null,
    molecule_id: 1050025, // Acide acétique
    famille_id: null,
    type: "neutralisation",
    effet: "L'ambroxan neutralise les notes vinaigrées et piquantes de l'acide acétique. La molécule ambrée-musquée crée un fond chaud qui annule la perception acide et piquante de l'acide acétique dans les compositions tabac.",
    notes: "Ratio optimal : 1:0.5 (acide acétique:ambroxan). Réduction de la note vinaigrée de 50-60%. Technique utilisée dans les tabacs fermentés pour équilibrer l'acidité."
  },
  {
    id: 60033,
    name: "Nicotine × Damascenone : Neutralisation Alcaloïde",
    tabac_id: null,
    molecule_id: 720033, // Nicotine
    famille_id: null,
    type: "neutralisation",
    effet: "La damascenone neutralise partiellement la perception âcre et amère de la nicotine. La molécule florale-fruitée modifie la perception des alcaloïdes du tabac en créant une note complexe rose-tabac.",
    notes: "Ratio optimal : 1:0.001 (nicotine:damascenone). Réduction de la perception nicotinique âcre de 25-35%. Technique utilisée dans les tabacs premium pour adoucir le profil alcaloïde."
  },
  {
    id: 60034,
    name: "Solanone × Linalol : Neutralisation Caoutchouteuse",
    tabac_id: null,
    molecule_id: 720027, // Solanone
    famille_id: null,
    type: "neutralisation",
    effet: "Le linalol neutralise les notes caoutchouteuses et plastiques de la solanone à hautes concentrations. La molécule florale-boisée annule la perception caoutchouteuse tout en préservant les notes tabac caractéristiques de la solanone.",
    notes: "Ratio optimal : 1:3 (solanone:linalol). Réduction de la note caoutchouteuse de 40-55%. Technique utilisée dans les tabacs orientaux pour équilibrer le profil solanone."
  },
  {
    id: 60035,
    name: "Furfural × β-Caryophyllène : Neutralisation Brûlée",
    tabac_id: null,
    molecule_id: 930006, // Furfural
    famille_id: null,
    type: "neutralisation",
    effet: "Le β-caryophyllène neutralise les notes brûlées et carbonisées du furfural. Le sesquiterpène épicé annule la perception des notes de Maillard excessives tout en ajoutant une complexité poivrée.",
    notes: "Ratio optimal : 1:2 (furfural:β-caryophyllène). Réduction des notes brûlées de 35-45%. Technique utilisée dans les tabacs de qualité pour équilibrer les produits de combustion."
  },
  {
    id: 60036,
    name: "Benzaldéhyde × Myrcène : Neutralisation Amande Amère",
    tabac_id: null,
    molecule_id: 720030, // Benzaldéhyde
    famille_id: null,
    type: "neutralisation",
    effet: "Le myrcène neutralise les notes d'amande amère et de cerise du benzaldéhyde à hautes concentrations. Le terpène fruité-herbacé annule la perception aldéhydique intense tout en créant une note complexe fruitée-boisée.",
    notes: "Ratio optimal : 1:4 (benzaldéhyde:myrcène). Réduction de la note amande amère de 45-55%. Technique utilisée dans les tabacs aromatisés pour équilibrer les aldéhydes aromatiques."
  },
  {
    id: 60037,
    name: "Citronellol × Indole : Neutralisation Florale-Animale",
    tabac_id: null,
    molecule_id: 660002, // Citronellol
    famille_id: null,
    type: "neutralisation",
    effet: "L'indole neutralise les notes trop propres et synthétiques du citronellol pur. À faibles concentrations (0.01-0.1%), l'indole ajoute une dimension animale qui transforme le citronellol en une note florale complexe et naturelle.",
    notes: "Ratio optimal : 1:0.01 (citronellol:indole). Transformation de la note florale-propre en florale-animale complexe. Technique utilisée en parfumerie pour naturaliser les molécules de synthèse."
  },
  {
    id: 60038,
    name: "Ambroxan × Géraniol : Neutralisation Musc-Floral",
    tabac_id: null,
    molecule_id: 3, // Ambroxan
    famille_id: null,
    type: "neutralisation",
    effet: "Le géraniol neutralise les notes trop lourdes et opiacées de l'ambroxan à hautes concentrations. La molécule florale-citronnée allège la perception musquée-ambrée et crée une note complexe ambre-rose.",
    notes: "Ratio optimal : 1:2 (ambroxan:géraniol). Réduction de la lourdeur musquée de 30-40%. Technique utilisée dans les parfums orientaux pour équilibrer les notes ambrées."
  },
  {
    id: 60039,
    name: "Limonène × Skatole : Neutralisation Citrus-Animal",
    tabac_id: null,
    molecule_id: 30007, // Limonène
    famille_id: null,
    type: "neutralisation",
    effet: "Le limonène neutralise les notes animales et fécales du skatole à hautes concentrations. Le terpène citronné annule la perception fécale et transforme le skatole en une note complexe citrus-animal.",
    notes: "Ratio optimal : 1:10 (skatole:limonène). Réduction de la note fécale de 65-75%. Technique utilisée dans les compositions tabac-citrus pour intégrer les notes animales."
  }
];

const allSynergies = [...masquageSynergies, ...neutralisationSynergies];

let inserted = 0;
let skipped = 0;

for (const s of allSynergies) {
  try {
    await conn.execute(
      'INSERT INTO synergies (id, name, tabac_id, molecule_id, famille_id, type, effet, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [s.id, s.name, s.tabac_id, s.molecule_id, s.famille_id, s.type, s.effet, s.notes]
    );
    inserted++;
    console.log(`✅ [${s.type}] ${s.name}`);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      skipped++;
      console.log(`⏭️  Déjà existant: ${s.name}`);
    } else {
      console.error(`❌ Erreur pour ${s.name}:`, err.message);
    }
  }
}

console.log(`\n=== Résultat ===`);
console.log(`✅ Insérées: ${inserted}`);
console.log(`⏭️  Ignorées (doublons): ${skipped}`);
console.log(`📊 Total synergies masquage+neutralisation: ${allSynergies.length}`);

// Vérification finale
const [counts] = await conn.execute('SELECT type, COUNT(*) as count FROM synergies GROUP BY type ORDER BY type');
console.log('\n=== Distribution par type ===');
counts.forEach(r => console.log(`  ${r.type}: ${r.count}`));

await conn.end();
