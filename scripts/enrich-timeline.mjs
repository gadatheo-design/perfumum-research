import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

const newEntries = [
  {
    title: "Intégration gamme Colombie",
    description: "Import de 9 molécules colombiennes rares (Lippia Origanoides, Turnera Diffusa, Calycolpus Moritzianus) et création de 8 recettes authentiques. Partenariat avec fournisseurs locaux à Cali et Armenia.",
    quarter: "2025-Q4",
    year: 2025,
    quarterNumber: 4,
    phase: "expansion",
    category: "research",
    status: "completed",
    priority: "high",
    deliverables: JSON.stringify(["9 molécules", "8 recettes", "2 fournisseurs"]),
    progress: 100,
    startDate: "2024-10-01",
    endDate: "2024-12-20"
  },
  {
    title: "Système de profils radar olfactifs",
    description: "Développement d'un algorithme d'analyse sémantique pour générer automatiquement des profils radar à 6 axes (Intensité, Fraîcheur, Chaleur, Douceur, Épicé, Terreux) pour 209 molécules. 93.5% de diversité atteinte.",
    quarter: "2025-Q4",
    year: 2025,
    quarterNumber: 4,
    phase: "development",
    category: "infrastructure",
    status: "completed",
    priority: "critical",
    deliverables: JSON.stringify(["Algorithme radar", "209 profils", "Interface admin"]),
    progress: 100,
    startDate: "2024-11-15",
    endDate: "2024-12-15"
  },
  {
    title: "Gamme Phéromones - Recherche biosynthétique",
    description: "Étude des phéromones stéroïdiennes (Androsténol, Androsténone, Androstadienone) et création de 6 variations de recettes Pheromona avec cascade biosynthétique documentée.",
    quarter: "2025-Q4",
    year: 2025,
    quarterNumber: 4,
    phase: "development",
    category: "formulation",
    status: "completed",
    priority: "high",
    deliverables: JSON.stringify(["3 phéromones", "6 recettes", "Graphique cascade"]),
    progress: 100,
    startDate: "2024-12-10",
    endDate: "2024-12-18"
  },
  {
    title: "Gamme Raretés - Molécules précieuses Phase 1",
    description: "Intégration de 10 molécules essentielles rares (Oud, Iris, Ambre Gris, Ambrox Super, Coumarine, Calone 1951, Javanol) avec 5 accords maîtres et tableau des prix fournisseurs.",
    quarter: "2025-Q4",
    year: 2025,
    quarterNumber: 4,
    phase: "expansion",
    category: "research",
    status: "completed",
    priority: "high",
    deliverables: JSON.stringify(["10 molécules", "5 accords", "Tableau prix"]),
    progress: 100,
    startDate: "2024-12-16",
    endDate: "2024-12-17"
  },
  {
    title: "Enrichissement Raretés Phase 2 - 20 molécules premium",
    description: "Ajout de 20 molécules Phase 2 (muscs précieux, bois précieux, floraux, épices & résines, agrumes rares, molécules signature). Tableau des prix enrichi avec 30 molécules et 18 fournisseurs.",
    quarter: "2025-Q4",
    year: 2025,
    quarterNumber: 4,
    phase: "expansion",
    category: "research",
    status: "completed",
    priority: "medium",
    deliverables: JSON.stringify(["20 molécules", "5 recettes", "18 fournisseurs"]),
    progress: 100,
    startDate: "2024-12-17",
    endDate: "2024-12-18"
  },
  {
    title: "Calculateur de coût et sourcing global",
    description: "Création d'un calculateur de coût pour 40+ molécules avec prix min/max, support des concentrations (EdC, EdT, EdP, Extrait). Page Sourcing Global avec 10 régions et 19 fournisseurs.",
    quarter: "2025-Q4",
    year: 2025,
    quarterNumber: 4,
    phase: "development",
    category: "infrastructure",
    status: "completed",
    priority: "medium",
    deliverables: JSON.stringify(["Calculateur coût", "10 régions", "19 fournisseurs"]),
    progress: 100,
    startDate: "2024-12-18",
    endDate: "2024-12-20"
  },
  {
    title: "Système PERFUMUM - Cartographie visuelle",
    description: "Création d'une page /systeme avec graphe React Flow interactif montrant les relations ABSORBE → PERFUMUM → Études/Données/Outils/Sourcing. Clarification de l'identité ABSORBE comme cadre structurel.",
    quarter: "2025-Q4",
    year: 2025,
    quarterNumber: 4,
    phase: "foundation",
    category: "documentation",
    status: "completed",
    priority: "high",
    deliverables: JSON.stringify(["Page Système", "Graphe interactif", "Documentation"]),
    progress: 100,
    startDate: "2024-12-21",
    endDate: "2024-12-22"
  },
  {
    title: "Archives enrichies - 6 notes de terrain",
    description: "Documentation de 6 captations terrain avec photographies (forêt alpine, musée, friche industrielle, serre tropicale, cave d'affinage, sommet glaciaire). Structure chronologique 2024-2025 avec GPS et observations sensorielles.",
    quarter: "2025-Q4",
    year: 2025,
    quarterNumber: 4,
    phase: "expansion",
    category: "documentation",
    status: "completed",
    priority: "medium",
    deliverables: JSON.stringify(["6 notes terrain", "6 photographies", "Données GPS"]),
    progress: 100,
    startDate: "2024-12-22",
    endDate: "2024-12-23"
  },
  {
    title: "Glossaire Visuel Radar",
    description: "Page pédagogique /glossaire-visuel-radar avec explication détaillée des 6 axes, 3 molécules représentatives par axe, barres de progression visuelles, comparaisons et insights pour comprendre écarts et synergies.",
    quarter: "2025-Q4",
    year: 2025,
    quarterNumber: 4,
    phase: "development",
    category: "documentation",
    status: "completed",
    priority: "medium",
    deliverables: JSON.stringify(["Page glossaire", "18 exemples", "Guide utilisation"]),
    progress: 100,
    startDate: "2024-12-23",
    endDate: "2024-12-23"
  },
  {
    title: "Page Contribuer - Ouverture collaborations",
    description: "Nouvelle page /contribuer pour collaborations externes avec 4 types de contributions acceptées (données moléculaires, documentation terrain, recettes, collaboration recherche). Contact: research@perfumum.ch",
    quarter: "2025-Q4",
    year: 2025,
    quarterNumber: 4,
    phase: "expansion",
    category: "collaboration",
    status: "completed",
    priority: "medium",
    deliverables: JSON.stringify(["Page contribuer", "4 types contributions", "Processus 4 étapes"]),
    progress: 100,
    startDate: "2024-12-23",
    endDate: "2024-12-23"
  },
  {
    title: "Analyse pyrolyse tabacs - 3 températures",
    description: "Protocoles de pyrolyse documentés (120°C, 160°C, 200°C) avec tableau GC-MS de 8 molécules-clés. Équipement: Nabertherm, Tenax TA, Agilent GC-MS. Page /methodologie/pyrolyse créée.",
    quarter: "2026-Q1",
    year: 2026,
    quarterNumber: 1,
    phase: "development",
    category: "research",
    status: "in_progress",
    priority: "high",
    deliverables: JSON.stringify(["3 protocoles", "8 molécules", "Page méthodologie"]),
    progress: 75,
    startDate: "2024-12-15",
    endDate: "2025-01-30"
  },
  {
    title: "Synergies terpènes × molécules niches",
    description: "Documentation des synergies entre terpènes et molécules niches (Indole/Skatole, Ambroxan/Iso E Super, Styrax/Labdanum). Page /synergies-terpenes-niches avec 3 onglets et exemples d'applications.",
    quarter: "2026-Q1",
    year: 2026,
    quarterNumber: 1,
    phase: "development",
    category: "research",
    status: "in_progress",
    priority: "medium",
    deliverables: JSON.stringify(["3 familles synergies", "15 exemples", "Applications"]),
    progress: 60,
    startDate: "2024-12-18",
    endDate: "2025-02-15"
  },
  {
    title: "Protocoles de maturation résines CBD",
    description: "Développement de protocoles de maturation par type de résine (classique, expérimentale, signature) avec conditions optimales (température, humidité, durée) et erreurs à éviter. Page /protocoles-maturation.",
    quarter: "2026-Q1",
    year: 2026,
    quarterNumber: 1,
    phase: "development",
    category: "formulation",
    status: "in_progress",
    priority: "high",
    deliverables: JSON.stringify(["3 protocoles", "Conditions optimales", "Guide erreurs"]),
    progress: 70,
    startDate: "2024-12-19",
    endDate: "2025-02-28"
  },
  {
    title: "Expansion sourcing international - 10 régions",
    description: "Cartographie complète des fournisseurs par région (France, Inde, Madagascar, Japon, Maroc, Suisse, UK, Colombie, Égypte/Moyen-Orient, Amérique du Nord). 19 fournisseurs documentés avec certifications.",
    quarter: "2026-Q1",
    year: 2026,
    quarterNumber: 1,
    phase: "expansion",
    category: "collaboration",
    status: "in_progress",
    priority: "medium",
    deliverables: JSON.stringify(["10 régions", "19 fournisseurs", "Certifications"]),
    progress: 80,
    startDate: "2024-12-20",
    endDate: "2025-03-15"
  },
  {
    title: "Système de comparaison recettes",
    description: "Développement d'un comparateur de recettes avec graphique radar SVG superposé (jusqu'à 4 recettes). Filtres par gamme, recherche, sélection multiple avec badges colorés. Page /compare-recettes.",
    quarter: "2026-Q1",
    year: 2026,
    quarterNumber: 1,
    phase: "development",
    category: "infrastructure",
    status: "in_progress",
    priority: "medium",
    deliverables: JSON.stringify(["Comparateur", "Graphique radar", "Filtres avancés"]),
    progress: 85,
    startDate: "2024-12-21",
    endDate: "2025-01-31"
  }
];

async function enrichTimeline() {
  let connection;
  try {
    connection = await mysql.createConnection(DATABASE_URL);
    console.log('✅ Connexion à la base de données réussie\n');

    for (const entry of newEntries) {
      const query = `
        INSERT INTO research_timeline 
        (title, description, quarter, year, quarterNumber, phase, category, status, priority, deliverables, progress, startDate, endDate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const values = [
        entry.title,
        entry.description,
        entry.quarter,
        entry.year,
        entry.quarterNumber,
        entry.phase,
        entry.category,
        entry.status,
        entry.priority,
        entry.deliverables,
        entry.progress,
        entry.startDate,
        entry.endDate
      ];

      await connection.execute(query, values);
      console.log(`✅ Ajouté: ${entry.title}`);
    }

    console.log(`\n✅ ${newEntries.length} nouvelles entrées ajoutées avec succès !`);

    // Vérifier le total
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM research_timeline');
    console.log(`\n📊 Total d'entrées dans la timeline: ${rows[0].count}`);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit(0);
  }
}

enrichTimeline();
