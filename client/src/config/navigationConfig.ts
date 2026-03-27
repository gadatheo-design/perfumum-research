/**
 * navigationConfig.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * SOURCE UNIQUE DE VÉRITÉ pour toute la navigation du site PERFUMUM.
 *
 * Structure à 4 groupes (refonte audit 27 mars 2026) :
 *   ATELIER      → Sources matérielles, formulation, analyse
 *   ATLAS        → Navigation spatiale, narrative, iconographique
 *   BIBLIOTHÈQUE → Recherche, archives, visualisations, méthode
 *   PROJET       → Documentation, administration
 *
 * Header.tsx (desktop MegaMenu) et MobileMenu.tsx (mobile accordéon)
 * consomment NAV_GROUPS — toute modification ici se répercute automatiquement.
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
  /** Label du trigger desktop */
  trigger: string;
  /** Description courte affichée sous le trigger dans le MegaMenu */
  description?: string;
  /** Sections affichées dans le panneau de ce trigger */
  sections: NavSection[];
}

// ── Groupes de navigation (desktop MegaMenu + mobile accordéon) ───────────────

export const NAV_GROUPS: NavGroup[] = [

  // ════════════════════════════════════════════════════════════════════════════
  // ATELIER — Sources matérielles, formulation, analyse, tabac
  // La porte d'entrée par la matière : plantes, molécules, recettes, outils
  // ════════════════════════════════════════════════════════════════════════════
  {
    trigger: "Atelier",
    description: "Sources matérielles & formulation",
    sections: [
      {
        title: "Matières premières",
        icon: "Leaf",
        items: [
          { href: "/plantes", label: "Plantes & Variétés", badge: "HUB" },
          { href: "/molecules", label: "Molécules", badge: "HUB" },
          { href: "/matieres-premieres", label: "Matières Premières", badge: "NEW" },
          { href: "/terroirs", label: "Terroirs" },
          { href: "/osmotheque", label: "Osmothèque", badge: "NEW" },
          { href: "/aromatic-rarities", label: "Matières Premières Rares", badge: "NEW" },
        ],
      },
      {
        title: "Formulation",
        icon: "FlaskConical",
        items: [
          { href: "/recettes", label: "Recettes", badge: "HUB" },
          { href: "/gammes-hub", label: "Gammes", badge: "HUB" },
          { href: "/outils/editeur-formulation", label: "Éditeur de Formulation", badge: "NEW" },
          { href: "/outils/generateur-formules", label: "Générateur IA" },
          { href: "/calculateur", label: "Calculateur" },
          { href: "/final-recipes", label: "Recettes finales" },
          { href: "/recettes-tl", label: "Recettes TL", badge: "NEW" },
        ],
      },
      {
        title: "Analyse & Sourcing",
        icon: "TestTube",
        items: [
          { href: "/synergies", label: "Synergies Moléculaires", badge: "NEW" },
          { href: "/terp-profiles", label: "Profils Terpéniques" },
          { href: "/ifra", label: "Conformité IFRA" },
          { href: "/terp-profiles/compare", label: "Comparaison Profils" },
          { href: "/smiles", label: "Structures SMILES", badge: "NEW" },
          { href: "/sourcing-hub", label: "Hub Sourcing", badge: "NEW" },
          { href: "/alternatives-durables", label: "Alternatives durables", badge: "NEW" },
        ],
      },
      {
        title: "Tabacothèque",
        icon: "Layers",
        items: [
          { href: "/tabacotheque", label: "Vue d'ensemble", badge: "HUB" },
          { href: "/tabacs-niche", label: "Tabacs Niche" },
          { href: "/tabacs-naturels", label: "Tabacs Naturels", badge: "NEW" },
          { href: "/historic-cigarettes", label: "Cigarettes Historiques" },
          { href: "/recettes-cigarillos", label: "Recettes Cigarillos" },
          { href: "/chemotypes", label: "Chémotypes", badge: "NEW" },
          { href: "/perique-compounds", label: "Composés du Perique" },
          { href: "/molecular-transformations", label: "Transformations Moléculaires", badge: "NEW" },
          { href: "/tps-genes", label: "Gènes TPS", badge: "NEW" },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // ATLAS — Navigation spatiale, narrative, iconographique
  // La porte d'entrée par l'espace, le temps, l'image et le récit
  // ════════════════════════════════════════════════════════════════════════════
  {
    trigger: "Atlas",
    description: "Narration, espace & iconographie",
    sections: [
      {
        title: "Les 5 portes d'entrée",
        icon: "BookOpen",
        items: [
          { href: "/plantes", label: "Plantes — La source matérielle", badge: "od:L12" },
          { href: "/molecules", label: "Molécules — Le stimulus chimique", badge: "od:L1" },
          { href: "/storylines", label: "Fils narratifs — L'expérience culturelle", badge: "od:L13" },
          { href: "/galerie-olfactive", label: "Galerie Olfactive — L'iconographie", badge: "NEW" },
          { href: "/atlas", label: "Atlas Olfactif — Le smellscape", badge: "NEW" },
        ],
      },
      {
        title: "Fils narratifs",
        icon: "Layers",
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
        items: [
          { href: "/atlas", label: "Atlas Géo-Temporel", badge: "NEW" },
          { href: "/carte-plantes-gps", label: "Carte GPS Plantes" },
          { href: "/galerie-olfactive", label: "Galerie Europeana", badge: "NEW" },
          { href: "/civilisations", label: "Traditions Olfactives" },
          { href: "/archives-olfactives", label: "Archives Olfactives" },
          { href: "/timeline", label: "Timeline" },
        ],
      },
      {
        title: "Botanique & Généalogie",
        icon: "TreePine",
        items: [
          { href: "/phylogenetique", label: "Classification Phylogénétique", badge: "NEW" },
          { href: "/genealogy", label: "Arbre Généalogique", badge: "NEW" },
          { href: "/ghost-varieties-explorer", label: "Herbier des Disparus", badge: "NEW" },
          { href: "/leaf-economies", label: "Leaf Economies", badge: "NEW" },
          { href: "/timeline-botanique", label: "Timeline botanique" },
          { href: "/molecules-disparues", label: "Molécules Disparues & IFRA", badge: "NEW" },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // BIBLIOTHÈQUE — Recherche, méthode, archives, visualisations
  // La porte d'entrée par la connaissance et l'analyse
  // ════════════════════════════════════════════════════════════════════════════
  {
    trigger: "Bibliothèque",
    description: "Méthode, recherche & visualisations",
    sections: [
      {
        title: "Méthode ABSORBE",
        icon: "BookOpen",
        items: [
          { href: "/methodologie/absorbe", label: "Présentation" },
          { href: "/methodologie/echelle-absorbe", label: "Échelle de classification" },
          { href: "/methodologie/gc-ms", label: "GC-MS & Pyrolyse" },
          { href: "/methodes-analytiques", label: "Méthodes Analytiques", badge: "NEW" },
          { href: "/gcms-chromatograms", label: "Chromatogrammes", badge: "NEW" },
          { href: "/ms-spectra", label: "Spectres de Masse", badge: "NEW" },
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
          { href: "/percepts", label: "Recherche par Percept" },
          { href: "/absorbe-x", label: "ABSORBE X — Dashboard", badge: "NEW" },
        ],
      },
      {
        title: "Réseaux & Visualisations",
        icon: "BarChart3",
        items: [
          { href: "/visualisations", label: "Hub Visualisations", badge: "HUB" },
          { href: "/reseau-liaisons", label: "Réseau de Liaisons", badge: "NEW" },
          { href: "/recipe-network", label: "Graphe Réseau" },
          { href: "/correlations", label: "Corrélations", badge: "NEW" },
          { href: "/sankey-flow", label: "Diagramme Sankey" },
          { href: "/synergies-heatmap", label: "Synergies Heatmap" },
          { href: "/stats-olfactives", label: "Statistiques Olfactives", badge: "NEW" },
        ],
      },
      {
        title: "Exploration",
        icon: "Compass",
        items: [
          { href: "/recherche-avancee", label: "Recherche avancée" },
          { href: "/recherche-molecule", label: "Recherche par Molécule", badge: "NEW" },
          { href: "/plantes/par-molecule", label: "Plantes par molécule", badge: "NEW" },
          { href: "/parfums", label: "Parfums emblématiques" },
          { href: "/muscs", label: "Muscs — Guide comparatif", badge: "NEW" },
          { href: "/enrichissement", label: "Enrichissement PubChem", badge: "NEW" },
          { href: "/claims-and-proofs", label: "Claims & Preuves", badge: "NEW" },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // PROJET — Documentation, manifeste, administration
  // ════════════════════════════════════════════════════════════════════════════
  {
    trigger: "Projet",
    description: "Documentation & administration",
    sections: [
      {
        title: "Documentation",
        icon: "FileText",
        items: [
          { href: "/glossaire", label: "Glossaire" },
          { href: "/manifeste", label: "Manifeste" },
          { href: "/absorbe-x/manifeste", label: "Manifeste ABSORBE X" },
          { href: "/absorbe-x/notes-recherche", label: "Notes de Recherche" },
          { href: "/absorbe-x/guide-laboratoire", label: "Guide de Laboratoire", badge: "NEW" },
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
          { href: "/outils-hub", label: "Hub Outils", badge: "HUB" },
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
