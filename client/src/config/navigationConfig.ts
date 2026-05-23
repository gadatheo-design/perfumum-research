/**
 * navigationConfig.ts — SOURCE UNIQUE DE VÉRITÉ pour la navigation PERFUMUM.
 * Refonte audit 10 avril 2026 : badges nettoyés, entrées manquantes ajoutées,
 * descriptions et featured items par groupe, viewAllHref par section.
 */

export interface NavItem {
  href: string;
  label: string;
  badge?: string;
  description?: string;
}
export interface NavSection {
  title: string;
  icon: string;
  href?: string;
  viewAllHref?: string;
  items?: NavItem[];
}
export interface NavGroup {
  trigger: string;
  description: string;
  featured?: NavItem;
  sections: NavSection[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    trigger: "Atelier",
    description: "Sources matérielles & formulation",
    featured: { href: "/outils/editeur-formulation", label: "Éditeur de Formulation", description: "Composer une recette en temps réel" },
    sections: [
      {
        title: "Matières premières",
        icon: "Leaf",
        viewAllHref: "/plantes",
        items: [
          { href: "/plantes", label: "Plantes & Variétés", badge: "HUB" },
          { href: "/molecules", label: "Molécules", badge: "HUB" },
          { href: "/matieres-premieres", label: "Matières Premières" },
          { href: "/terroirs", label: "Terroirs" },
          { href: "/osmotheque", label: "Osmothèque" },
          { href: "/aromatic-rarities", label: "Matières Premières Rares" },
          { href: "/resines-encens", label: "Résines & Encens — Maturation" },
          { href: "/extraction-procedes", label: "Procédés d'Extraction & Distillation" },
          { href: "/conservation", label: "Conservation & Durabilité" },
        ],
      },
      {
        title: "Formulation",
        icon: "FlaskConical",
        viewAllHref: "/recettes",
        items: [
          { href: "/recettes", label: "Recettes", badge: "HUB" },
          { href: "/gammes-hub", label: "Gammes", badge: "HUB" },
          { href: "/outils/editeur-formulation", label: "Éditeur de Formulation" },
          { href: "/outils/generateur-formules", label: "Générateur IA" },
          { href: "/calculateur", label: "Calculateur" },
          { href: "/final-recipes", label: "Recettes finales" },
          { href: "/recettes-tl", label: "Recettes TL" },
          { href: "/protocoles", label: "Protocoles Techniques" },
        ],
      },
      {
        title: "Analyse & Sourcing",
        icon: "TestTube",
        viewAllHref: "/analysis-hub",
        items: [
          { href: "/analysis-hub", label: "Hub Analyse", badge: "HUB" },
          { href: "/comparateur", label: "Hub Comparateur", badge: "HUB" },
          { href: "/imports", label: "Hub Imports", badge: "HUB" },
          { href: "/synergies", label: "Synergies Moléculaires" },
          { href: "/terp-profiles", label: "Profils Terpéniques" },
          { href: "/ifra", label: "Conformité IFRA" },
          { href: "/smiles", label: "Structures SMILES" },
          { href: "/sourcing-hub", label: "Hub Sourcing" },
          { href: "/alternatives-durables", label: "Alternatives durables" },
          { href: "/inventory-dashboard", label: "Tableau de Bord Inventaire" },
        ],
      },
      {
        title: "Tabacothèque",
        icon: "Layers",
        viewAllHref: "/tabacotheque",
        items: [
          { href: "/tabacotheque", label: "Vue d'ensemble", badge: "HUB" },
          { href: "/tabacs-niche", label: "Tabacs Niche" },
          { href: "/tabacs-naturels", label: "Tabacs Naturels" },
          { href: "/historic-cigarettes", label: "Cigarettes Historiques" },
          { href: "/recettes-cigarillos", label: "Recettes Cigarillos" },
          { href: "/landraces", label: "Landraces Cannabis" },
          { href: "/chemotypes", label: "Chémotypes" },
          { href: "/perique-compounds", label: "Composés du Perique" },
          { href: "/molecular-transformations", label: "Transformations Moléculaires" },
          { href: "/tps-genes", label: "Gènes TPS" },
        ],
      },
    ],
  },

  {
    trigger: "Atlas",
    description: "Narration, espace & iconographie",
    featured: { href: "/storylines", label: "Fils narratifs", description: "Entrer dans le récit olfactif" },
    sections: [
      {
        title: "Les 5 portes d'entrée",
        icon: "BookOpen",
        items: [
          { href: "/plantes", label: "Plantes — La source matérielle", badge: "od:L12" },
          { href: "/molecules", label: "Molécules — Le stimulus chimique", badge: "od:L1" },
          { href: "/storylines", label: "Fils narratifs — L'expérience culturelle", badge: "od:L13" },
          { href: "/galerie-olfactive", label: "Galerie Olfactive — L'iconographie" },
          { href: "/atlas", label: "Atlas Olfactif — Le smellscape" },
        ],
      },
      {
        title: "Fils narratifs",
        icon: "Layers",
        viewAllHref: "/storylines",
        items: [
          { href: "/storylines", label: "Index des fils narratifs", badge: "HUB" },
          { href: "/storyline/route-encens", label: "La Route de l'Encens" },
          { href: "/storyline/tabac-rituel-amerindien", label: "Tabac & Rituel Amérindien" },
          { href: "/storyline/nardostachys-nard-perdu", label: "Nardostachys — Le Nard Perdu" },
          { href: "/storyline/burkina-faso-combustion-lente", label: "Burkina Faso — Combustion Lente" },
          { href: "/storyline/atlas-mnemosyne", label: "Atlas Mnémosyne" },
        ],
      },
      {
        title: "Géographie & Patrimoine",
        icon: "MapPin",
        viewAllHref: "/atlas",
        items: [
          { href: "/atlas", label: "Atlas Géo-Temporel" },
          { href: "/carte-plantes-gps", label: "Carte GPS Plantes" },
          { href: "/traditions-olfactives", label: "Traditions Olfactives", badge: "HUB" },
          { href: "/archives-olfactives", label: "Archives Olfactives" },
          { href: "/timeline-civilisations", label: "Timeline des Traditions" },
          { href: "/europeana-map", label: "Carte Europeana" },
          { href: "/comparaison-genres", label: "Comparaison Genres" },
        ],
      },
      {
        title: "Botanique & Phylogénie",
        icon: "TreePine",
        viewAllHref: "/phylogenetique",
        items: [
          { href: "/phylogenetique", label: "Classification Phylogénétique", badge: "HUB" },
          { href: "/nicotiana-explorer", label: "Explorateur Nicotiana" },
          { href: "/genealogy", label: "Arbre Généalogique" },
          { href: "/ghost-varieties-explorer", label: "Herbier des Disparus" },
          { href: "/leaf-economies", label: "Leaf Economies" },
          { href: "/timeline-botanique", label: "Timeline botanique" },
          { href: "/molecules-disparues", label: "Molécules Disparues & IFRA" },
          { href: "/classification-phylogenetique", label: "Classification Détaillée" },
        ],
      },
    ],
  },

  {
    trigger: "Bibliothèque",
    description: "Méthode, recherche & visualisations",
    featured: { href: "/axes-recherche", label: "11 Axes de Recherche", description: "Vue d'ensemble de la méthodologie" },
    sections: [
      {
        title: "Méthode ABSORBE",
        icon: "BookOpen",
        viewAllHref: "/methodologie/absorbe",
        items: [
          { href: "/methodologie/absorbe", label: "Présentation" },
          { href: "/methodologie/echelle-absorbe", label: "Échelle de classification" },
          { href: "/methodologie/gc-ms", label: "GC-MS & Pyrolyse" },
          { href: "/methodes-analytiques", label: "Méthodes Analytiques" },
          { href: "/gcms-chromatograms", label: "Chromatogrammes" },
          { href: "/ms-spectra", label: "Spectres de Masse" },
          { href: "/compound-search", label: "Recherche de Composés" },
        ],
      },
      {
        title: "Axes de Recherche",
        icon: "Globe",
        viewAllHref: "/axes-recherche",
        items: [
          { href: "/axes-recherche", label: "Vue d'ensemble", badge: "11 axes" },
          { href: "/bibliographie", label: "Bibliographie" },
          { href: "/outils/export-bibliographique", label: "Export bibliographique" },
          { href: "/explorer-par-odeur", label: "Explorer par Odeur" },
          { href: "/percepts", label: "Recherche par Percept" },
          { href: "/absorbe-x", label: "ABSORBE X — Dashboard" },
        ],
      },
      {
        title: "Réseaux & Visualisations",
        icon: "BarChart3",
        viewAllHref: "/visualisations",
        items: [
          { href: "/visualisations", label: "Hub Visualisations", badge: "HUB" },
          { href: "/reseau-liaisons", label: "Réseau de Liaisons" },
          { href: "/recipe-network", label: "Graphe Réseau" },
          { href: "/correlations", label: "Corrélations" },
          { href: "/sankey-flow", label: "Diagramme Sankey" },
          { href: "/synergies-heatmap", label: "Synergies Heatmap" },
          { href: "/stats-olfactives", label: "Statistiques Olfactives" },
        ],
      },
      {
        title: "Exploration",
        icon: "Compass",
        viewAllHref: "/recherche-avancee",
        items: [
          { href: "/recherche-avancee", label: "Recherche avancée" },
          { href: "/recherche-molecule", label: "Recherche par Molécule" },
          { href: "/plantes/par-molecule", label: "Plantes par molécule" },
          { href: "/parfums", label: "Parfums emblématiques" },
          { href: "/muscs", label: "Muscs — Guide comparatif" },
          { href: "/enrichissement", label: "Enrichissement PubChem" },
          { href: "/claims-and-proofs", label: "Claims & Preuves" },
        ],
      },
    ],
  },

  {
    trigger: "Projet",
    description: "Documentation & administration",
    featured: { href: "/manifeste", label: "Manifeste PERFUMUM", description: "La vision et la méthode" },
    sections: [
      {
        title: "Documentation",
        icon: "FileText",
        items: [
          { href: "/glossaire", label: "Glossaire" },
          { href: "/manifeste", label: "Manifeste" },
          { href: "/absorbe-x/manifeste", label: "Manifeste ABSORBE X" },
          { href: "/absorbe-x/notes-recherche", label: "Notes de Recherche" },
          { href: "/absorbe-x/guide-laboratoire", label: "Guide de Laboratoire" },
          { href: "/prototypes", label: "Prototypes C1–C4" },
        ],
      },
      {
        title: "Le Projet",
        icon: "Info",
        items: [
          { href: "/a-propos", label: "À propos" },
          { href: "/contribuer", label: "Contribuer" },
          { href: "/projet/timeline", label: "Timeline du Projet" },
          { href: "/admin/completude", label: "Tableau de complétude", badge: "ADMIN" },
          { href: "/admin/phylo-enrichment", label: "Enrichissement Phylo", badge: "ADMIN" },
          { href: "/admin/bibliographic-enrichment", label: "Enrichissement Bibliographique", badge: "ADMIN" },
          { href: "/admin/extraction-methods", label: "Procédés d'Extraction", badge: "ADMIN" },
          { href: "/admin/api-coverage", label: "Couverture APIs", badge: "ADMIN" },
          { href: "/admin", label: "Administration", badge: "ADMIN" },
          { href: "/outils-hub", label: "Hub Outils", badge: "HUB" },
        ],
      },
    ],
  },
];

export function getGroupSections(trigger: string): NavSection[] {
  return NAV_GROUPS.find((g) => g.trigger === trigger)?.sections ?? [];
}

export function getAllNavItems(): (NavItem & { section: string; group: string })[] {
  return NAV_GROUPS.flatMap((group) =>
    group.sections.flatMap((section) =>
      (section.items ?? []).map((item) => ({
        ...item,
        section: section.title,
        group: group.trigger,
      }))
    )
  );
}
