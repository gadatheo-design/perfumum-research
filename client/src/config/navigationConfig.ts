/**
 * navigationConfig.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * SOURCE UNIQUE DE VÉRITÉ pour toute la navigation du site PERFUMUM.
 *
 * Ce fichier est la seule source à modifier pour ajouter, supprimer ou
 * réorganiser des entrées de navigation. Header.tsx (desktop) et
 * MobileMenu.tsx (mobile) consomment ces données — toute modification ici
 * se répercute automatiquement sur les deux interfaces.
 *
 * Structure :
 *   NAV_SECTIONS  → groupes de sections organisés par "trigger" de menu
 *   MOBILE_FLAT   → liste plate pour le menu mobile (accordéon)
 *
 * Pour ajouter une page :
 *   1. Trouver la section appropriée dans NAV_SECTIONS
 *   2. Ajouter l'entrée { href, label, badge? }
 *   3. La même entrée apparaîtra automatiquement sur desktop ET mobile
 *
 * Badges disponibles : "HUB" | "NEW" | "ADMIN" | string libre (ex: "11 axes")
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export interface NavItem {
  href: string;
  label: string;
  badge?: string;
}

export interface NavSection {
  /** Titre affiché dans le MegaMenu desktop (colonne) et le MobileMenu (accordéon) */
  title: string;
  /** Icône Lucide — nom de la clé (string) résolu côté composant */
  icon: string;
  /** Si défini, le titre lui-même est un lien direct (ex: Hub Outils) */
  href?: string;
  items?: NavItem[];
}

export interface NavGroup {
  /** Label du trigger desktop (ex: "Données", "Outils"…) */
  trigger: string;
  /** Sections affichées dans le panneau de ce trigger */
  sections: NavSection[];
}

// ── Groupes de navigation (desktop MegaMenu + mobile accordéon) ───────────────

export const NAV_GROUPS: NavGroup[] = [
  // ════════════════════════════════════════════════════════════════════════════
  // DONNÉES — Catalogues, Botanique, Tabac, Exploration
  // ════════════════════════════════════════════════════════════════════════════
  {
    trigger: "Données",
    sections: [
      {
        title: "Catalogues principaux",
        icon: "Database",
        items: [
          { href: "/molecules", label: "Molécules", badge: "HUB" },
          { href: "/recettes", label: "Recettes", badge: "HUB" },
          { href: "/matieres-premieres", label: "Matières Premières", badge: "NEW" },
          { href: "/plants", label: "Plantes & Variétés" },
          { href: "/terroirs", label: "Terroirs" },
          { href: "/gammes-hub", label: "Gammes", badge: "HUB" },
        ],
      },
      {
        title: "Botanique & Patrimoine",
        icon: "Leaf",
        items: [
          { href: "/phylogenetique", label: "Classification Phylogénétique", badge: "NEW" },
          { href: "/genealogy", label: "Arbre Généalogique", badge: "NEW" },
          { href: "/ghost-varieties-explorer", label: "Herbier des Disparus", badge: "NEW" },
          { href: "/osmotheque", label: "Osmothèque", badge: "NEW" },
          { href: "/smiles", label: "Structures SMILES", badge: "NEW" },
          { href: "/leaf-economies", label: "Leaf Economies", badge: "NEW" },
          { href: "/timeline-botanique", label: "Timeline botanique" },
        ],
      },
      {
        title: "Tabac & Cannabis",
        icon: "Layers",
        items: [
          { href: "/tabacs-niche", label: "Tabacs Niche" },
          { href: "/tabacs-naturels", label: "Tabacs Naturels", badge: "NEW" },
          { href: "/historic-cigarettes", label: "Cigarettes Historiques" },
          { href: "/recettes-cigarillos", label: "Recettes Cigarillos" },
          { href: "/chemotypes", label: "Chémotypes", badge: "NEW" },
        ],
      },
      {
        title: "Exploration",
        icon: "Compass",
        items: [
          { href: "/recherche-avancee", label: "Recherche avancée" },
          { href: "/recherche-molecule", label: "Recherche par Molécule", badge: "NEW" },
          { href: "/carte-plantes-gps", label: "Carte GPS Plantes" },
          { href: "/alternatives-durables", label: "Alternatives durables", badge: "NEW" },
          { href: "/plantes/par-molecule", label: "Plantes par molécule", badge: "NEW" },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // OUTILS — Création, Analyse, Sourcing
  // ════════════════════════════════════════════════════════════════════════════
  {
    trigger: "Outils",
    sections: [
      {
        title: "Hub Outils",
        icon: "Zap",
        href: "/outils-hub",
        items: [
          { href: "/outils-hub", label: "Hub Outils", badge: "HUB" },
        ],
      },
      {
        title: "Création",
        icon: "FlaskConical",
        items: [
          { href: "/outils/editeur-formulation", label: "Éditeur de Formulation", badge: "NEW" },
          { href: "/outils/generateur-formules", label: "Générateur IA" },
          { href: "/calculateur", label: "Calculateur" },
          { href: "/final-recipes", label: "Recettes finales" },
          { href: "/recettes-tl", label: "Recettes TL", badge: "NEW" },
        ],
      },
      {
        title: "Analyse",
        icon: "TestTube",
        items: [
          { href: "/synergies", label: "Synergies Moléculaires", badge: "NEW" },
          { href: "/terp-profiles", label: "Profils Terpéniques" },
          { href: "/ifra", label: "Conformité IFRA" },
          { href: "/terp-profiles/compare", label: "Comparaison Profils" },
          { href: "/stats-olfactives", label: "Statistiques Olfactives", badge: "NEW" },
          { href: "/percepts", label: "Recherche par Percept" },
          { href: "/enrichissement", label: "Enrichissement PubChem", badge: "NEW" },
        ],
      },
      {
        title: "Sourcing",
        icon: "Sparkles",
        items: [
          { href: "/sourcing-hub", label: "Hub Sourcing", badge: "NEW" },
          { href: "/sourcing/tabac", label: "Sourcing Tabac" },
          { href: "/sourcing/cannabis", label: "Sourcing Cannabis" },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // RECHERCHE — Méthode, Axes, Archives, Visualisations
  // ════════════════════════════════════════════════════════════════════════════
  {
    trigger: "Recherche",
    sections: [
      {
        title: "Méthode ABSORBE",
        icon: "BookOpen",
        items: [
          { href: "/methodologie/absorbe", label: "Présentation" },
          { href: "/methodologie/echelle-absorbe", label: "Échelle de classification" },
          { href: "/methodologie/gc-ms", label: "GC-MS & Pyrolyse" },
          { href: "/methodes-analytiques", label: "Méthodes Analytiques", badge: "NEW" },
        ],
      },
      {
        title: "Axes de Recherche",
        icon: "Globe",
        items: [
          { href: "/axes-recherche", label: "Vue d'ensemble", badge: "11 axes" },
          { href: "/bibliographie", label: "Bibliographie" },
          { href: "/outils/export-bibliographique", label: "Export bibliographique" },
          { href: "/explorer-par-odeur", label: "Explorer par Odeur", badge: "NEW" },
        ],
      },
      {
        title: "Archives & Traditions",
        icon: "Archive",
        items: [
          { href: "/archives-terrain", label: "Archives de Terrain" },
          { href: "/archives-olfactives", label: "Archives Olfactives" },
          { href: "/civilisations", label: "Traditions Olfactives" },
          { href: "/molecules-disparues", label: "Molécules Disparues & IFRA", badge: "NEW" },
          { href: "/timeline", label: "Timeline" },
        ],
      },
      {
        title: "Réseaux & Graphes",
        icon: "BarChart3",
        items: [
          { href: "/visualisations", label: "Hub Visualisations", badge: "HUB" },
          { href: "/reseau-liaisons", label: "Réseau de Liaisons", badge: "NEW" },
          { href: "/recipe-network", label: "Graphe Réseau" },
          { href: "/correlations", label: "Corrélations", badge: "NEW" },
          { href: "/sankey-flow", label: "Diagramme Sankey" },
        ],
      },
      {
        title: "Analyses Visuelles",
        icon: "BarChart2",
        items: [
          { href: "/synergies-heatmap", label: "Synergies Heatmap" },
          { href: "/parfums", label: "Parfums emblématiques" },
          { href: "/muscs", label: "Muscs — Guide comparatif", badge: "NEW" },
          { href: "/timeline-botanique", label: "Timeline botanique" },
        ],
      },
      {
        title: "ABSORBE X — Recherche Avancée",
        icon: "Brain",
        items: [
          { href: "/absorbe-x", label: "Dashboard", badge: "NEW" },
          { href: "/absorbe-x/manifeste", label: "Manifeste" },
          { href: "/absorbe-x/notes-recherche", label: "Notes de Recherche" },
          { href: "/absorbe-x/quantique", label: "Olfaction Quantique" },
          { href: "/absorbe-x/patrimoine", label: "Patrimoine Olfactif" },
          { href: "/absorbe-x/neuro-olfaction", label: "Neuro-Olfaction", badge: "NEW" },
          { href: "/absorbe-x/odeurs-perdues", label: "Odeurs Perdues", badge: "NEW" },
          { href: "/molecules-disparues", label: "Molécules Disparues & IFRA", badge: "NEW" },
          { href: "/absorbe-x/guide-laboratoire", label: "Guide de Laboratoire", badge: "NEW" },
          { href: "/aromatic-rarities", label: "Matières Premières Rares", badge: "NEW" },
          { href: "/claims-and-proofs", label: "Claims & Preuves", badge: "NEW" },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // TABACOTHÈQUE — Tabac avancé, Génomique, GC-MS
  // ════════════════════════════════════════════════════════════════════════════
  {
    trigger: "Tabacothèque",
    sections: [
      {
        title: "Tabacothèque",
        icon: "Leaf",
        items: [
          { href: "/tabacotheque", label: "Vue d'ensemble", badge: "HUB" },
          { href: "/historic-cigarettes", label: "Cigarettes Historiques", badge: "NEW" },
          { href: "/perique-compounds", label: "Composés du Perique" },
        ],
      },
      {
        title: "Génomique du Tabac",
        icon: "Database",
        items: [
          { href: "/tps-genes", label: "Gènes TPS", badge: "NEW" },
          { href: "/genomics-explorer", label: "Explorateur Génomique" },
        ],
      },
      {
        title: "Transformations",
        icon: "Flame",
        items: [
          { href: "/molecular-transformations", label: "Transformations Moléculaires", badge: "NEW" },
        ],
      },
      {
        title: "Analyse GC-MS",
        icon: "Microscope",
        items: [
          { href: "/gcms-chromatograms", label: "Chromatogrammes", badge: "NEW" },
          { href: "/ms-spectra", label: "Spectres de Masse", badge: "NEW" },
          { href: "/compare-spectra", label: "Comparaison Spectres", badge: "NEW" },
          { href: "/identify-spectrum", label: "Identification", badge: "NEW" },
          { href: "/search-compound", label: "Recherche Composé" },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // PROJET — Documentation, Administration
  // ════════════════════════════════════════════════════════════════════════════
  {
    trigger: "Projet",
    sections: [
      {
        title: "Documentation",
        icon: "FileText",
        items: [
          { href: "/glossaire", label: "Glossaire" },
          { href: "/manifeste", label: "Manifeste" },
        ],
      },
      {
        title: "Le Projet",
        icon: "Info",
        items: [
          { href: "/a-propos", label: "À propos" },
          { href: "/contribuer", label: "Contribuer" },
          { href: "/admin/completude", label: "Tableau de complétude", badge: "NEW" },
          { href: "/admin", label: "Administration", badge: "ADMIN" },
        ],
      },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Retourne toutes les sections d'un groupe par son trigger */
export function getGroupSections(trigger: string): NavSection[] {
  return NAV_GROUPS.find((g) => g.trigger === trigger)?.sections ?? [];
}

/** Retourne la liste plate de toutes les entrées (utile pour la recherche) */
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
