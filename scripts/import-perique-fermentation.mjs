import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Données de fermentation du Perique - 12 mois de fermentation anaérobie
const fermentationStages = [
  {
    stage_number: 1,
    stage_name: "Récolte et préparation initiale",
    duration_months: 1,
    start_month: 0,
    end_month: 1,
    temperature_min: 25,
    temperature_max: 32,
    humidity_percent: 85,
    ph_level: 6.2,
    oxygen_level: "Aérobie (initial)",
    description: "Les feuilles de tabac Perique sont récoltées à maturité optimale, puis les nervures centrales sont retirées. Les feuilles sont ensuite tordues en 'torquettes' (rouleaux serrés) pour initier la fermentation.",
    biochemical_processes: "Début de l'autolyse cellulaire, activation des enzymes endogènes, libération des sucres et acides aminés",
    key_enzymes: "Polyphénol oxydase, peroxydase, lipase, protéase",
    compounds_formed: "Acides organiques initiaux, premiers aldéhydes",
    compounds_degraded: "Chlorophylle, amidon, protéines de structure",
    olfactory_changes: "Odeur herbacée fraîche → début de notes fermentées",
    color_changes: "Vert → vert-brun"
  },
  {
    stage_number: 2,
    stage_name: "Mise en pression - Phase anaérobie initiale",
    duration_months: 1,
    start_month: 1,
    end_month: 2,
    temperature_min: 28,
    temperature_max: 35,
    humidity_percent: 90,
    ph_level: 5.8,
    oxygen_level: "Anaérobie strict",
    description: "Les torquettes sont placées dans des fûts de chêne sous forte pression (jusqu'à 500 kg). L'environnement devient rapidement anaérobie, initiant la fermentation lactique.",
    biochemical_processes: "Fermentation lactique, glycolyse anaérobie, début de la production d'acide lactique",
    key_enzymes: "Lactate déshydrogénase, pyruvate décarboxylase",
    compounds_formed: "Acide lactique, acide acétique, premiers esters",
    compounds_degraded: "Glucose, fructose, saccharose",
    olfactory_changes: "Notes acides, début de notes fruitées fermentées",
    color_changes: "Vert-brun → brun foncé"
  },
  {
    stage_number: 3,
    stage_name: "Fermentation primaire active",
    duration_months: 2,
    start_month: 2,
    end_month: 4,
    temperature_min: 30,
    temperature_max: 38,
    humidity_percent: 92,
    ph_level: 5.2,
    oxygen_level: "Anaérobie strict",
    description: "Phase la plus active de la fermentation. Les bactéries lactiques dominent, produisant des quantités importantes d'acides organiques et d'esters.",
    biochemical_processes: "Fermentation lactique intense, estérification, dégradation des protéines en acides aminés",
    key_enzymes: "Estérases, aminotransférases, décarboxylases",
    compounds_formed: "Esters fruités (acétate d'éthyle, butyrate d'éthyle), lactones, indoles",
    compounds_degraded: "Protéines, lipides, polysaccharides",
    olfactory_changes: "Notes de fruits fermentés (prune, figue), début de notes animales",
    color_changes: "Brun foncé → brun-noir"
  },
  {
    stage_number: 4,
    stage_name: "Développement des notes fruitées",
    duration_months: 2,
    start_month: 4,
    end_month: 6,
    temperature_min: 28,
    temperature_max: 35,
    humidity_percent: 88,
    ph_level: 4.8,
    oxygen_level: "Anaérobie strict",
    description: "Formation intensive des composés aromatiques fruités caractéristiques du Perique. Les lactones et damascénones se développent.",
    biochemical_processes: "Biosynthèse des lactones, dégradation des caroténoïdes en norisoprénoïdes",
    key_enzymes: "Caroténoïde clivage dioxygénase (CCD), lactonase",
    compounds_formed: "β-damascénone, γ-nonalactone, δ-décalactone, whiskey lactone",
    compounds_degraded: "β-carotène, lutéine, zéaxanthine",
    olfactory_changes: "Notes intenses de prune confite, figue sèche, miel",
    color_changes: "Brun-noir stable"
  },
  {
    stage_number: 5,
    stage_name: "Maturation intermédiaire",
    duration_months: 2,
    start_month: 6,
    end_month: 8,
    temperature_min: 25,
    temperature_max: 32,
    humidity_percent: 85,
    ph_level: 4.5,
    oxygen_level: "Anaérobie strict",
    description: "Phase de maturation où les composés formés se stabilisent et s'harmonisent. Développement des notes épicées et poivrées.",
    biochemical_processes: "Réactions de Maillard lentes, formation de pyrazines, condensation des aldéhydes",
    key_enzymes: "Transaminases, aldéhyde réductases",
    compounds_formed: "Pyrazines, furanes, composés soufrés aromatiques",
    compounds_degraded: "Acides aminés libres, sucres résiduels",
    olfactory_changes: "Notes épicées (poivre, clou de girofle), nuances de cuir",
    color_changes: "Brun-noir → noir profond"
  },
  {
    stage_number: 6,
    stage_name: "Développement des notes animales",
    duration_months: 2,
    start_month: 8,
    end_month: 10,
    temperature_min: 22,
    temperature_max: 28,
    humidity_percent: 80,
    ph_level: 4.3,
    oxygen_level: "Anaérobie strict",
    description: "Formation des composés indoliques et skatole responsables des notes animales caractéristiques. Équilibre entre notes fruitées et animales.",
    biochemical_processes: "Dégradation du tryptophane, formation d'indoles, production de skatole",
    key_enzymes: "Tryptophanase, indole-3-acétaldéhyde déshydrogénase",
    compounds_formed: "Indole, skatole, 2-acétyl-1-pyrroline, p-crésol",
    compounds_degraded: "Tryptophane, tyrosine, phénylalanine",
    olfactory_changes: "Notes animales (cuir, musc), nuances fécales subtiles",
    color_changes: "Noir profond stable"
  },
  {
    stage_number: 7,
    stage_name: "Affinage final",
    duration_months: 2,
    start_month: 10,
    end_month: 12,
    temperature_min: 20,
    temperature_max: 25,
    humidity_percent: 75,
    ph_level: 4.2,
    oxygen_level: "Anaérobie strict",
    description: "Phase finale d'affinage où tous les composés aromatiques s'harmonisent. Le profil olfactif unique du Perique atteint sa plénitude.",
    biochemical_processes: "Équilibration des composés, polymérisation des polyphénols, stabilisation finale",
    key_enzymes: "Polyphénol oxydase résiduelle, estérases",
    compounds_formed: "Complexes tanin-protéine, esters à longue chaîne",
    compounds_degraded: "Composés volatils instables",
    olfactory_changes: "Profil complet: prune confite, figue, cuir, épices, notes animales subtiles",
    color_changes: "Noir profond avec reflets pourpres"
  }
];

async function importFermentationData() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    console.log('🍇 Import des données de fermentation du Perique...\n');
    
    // Vérifier si la table existe
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'perique_fermentation_stages'"
    );
    
    if (tables.length === 0) {
      console.log('❌ Table perique_fermentation_stages non trouvée');
      return;
    }
    
    // Vider la table existante
    await connection.execute('DELETE FROM perique_fermentation_stages');
    console.log('🗑️ Table vidée');
    
    // Insérer les données
    let inserted = 0;
    for (const stage of fermentationStages) {
      await connection.execute(
        `INSERT INTO perique_fermentation_stages 
         (stage_number, stage_name, duration_months, start_month, end_month,
          temperature_min, temperature_max, humidity_percent, ph_level, oxygen_level,
          description, biochemical_processes, key_enzymes, compounds_formed,
          compounds_degraded, olfactory_changes, color_changes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          stage.stage_number,
          stage.stage_name,
          stage.duration_months,
          stage.start_month,
          stage.end_month,
          stage.temperature_min,
          stage.temperature_max,
          stage.humidity_percent,
          stage.ph_level,
          stage.oxygen_level,
          stage.description,
          stage.biochemical_processes,
          stage.key_enzymes,
          stage.compounds_formed,
          stage.compounds_degraded,
          stage.olfactory_changes,
          stage.color_changes
        ]
      );
      inserted++;
      console.log(`✅ Stage ${stage.stage_number}: ${stage.stage_name}`);
    }
    
    console.log(`\n🎉 Import terminé: ${inserted} stages de fermentation importés`);
    
    // Résumé des composés formés
    console.log('\n📊 Composés clés formés pendant la fermentation:');
    console.log('- Lactones: γ-nonalactone, δ-décalactone, whiskey lactone');
    console.log('- Norisoprénoïdes: β-damascénone');
    console.log('- Indoles: indole, skatole');
    console.log('- Esters: acétate d\'éthyle, butyrate d\'éthyle');
    console.log('- Pyrazines: composés épicés');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await connection.end();
  }
}

importFermentationData();
