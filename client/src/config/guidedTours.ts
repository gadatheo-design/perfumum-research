/**
 * Configuration des parcours thématiques pour PERFUMUM
 * 
 * Trois parcours distincts adaptés à différents profils d'utilisateurs :
 * - Chercheur : Focus sur les données scientifiques et la méthodologie
 * - Créateur : Focus sur la formulation et les outils créatifs
 * - Découverte : Vue d'ensemble pour les nouveaux visiteurs
 */

import { GuidedStep } from '@/contexts/GuidedNavigationContext';

// Types pour les parcours thématiques
export type TourType = 'discovery' | 'researcher' | 'creator';

export interface TourConfig {
  id: TourType;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  duration: string; // Durée estimée
  steps: GuidedStep[];
}

// Annotations contextuelles pour chaque étape
export interface StepAnnotation {
  stepId: string;
  tourType: TourType;
  annotations: {
    id: string;
    title: string;
    content: string;
    position: 'top' | 'bottom' | 'left' | 'right' | 'center';
    highlight?: string; // Sélecteur CSS de l'élément à mettre en évidence
    delay?: number; // Délai avant affichage (ms)
    autoHide?: number; // Temps avant masquage automatique (ms)
  }[];
}

// ============================================================
// PARCOURS DÉCOUVERTE (Nouveaux visiteurs)
// ============================================================
export const DISCOVERY_TOUR: TourConfig = {
  id: 'discovery',
  name: 'Parcours Découverte',
  shortName: 'Découverte',
  description: 'Une introduction complète au projet PERFUMUM pour les nouveaux visiteurs',
  icon: '🌟',
  color: 'amber',
  duration: '10-15 min',
  steps: [
    {
      id: 'discovery-welcome',
      title: 'Bienvenue sur PERFUMUM',
      shortTitle: 'Accueil',
      description: 'Découvrez le laboratoire de recherche olfactive expérimentale',
      path: '/',
      icon: '🏠',
      category: 'intro',
    },
    {
      id: 'discovery-project',
      title: 'Le Projet PERFUMUM',
      shortTitle: 'Le Projet',
      description: 'Comprendre la vision et les objectifs de 10 ans de recherche',
      path: '/le-projet',
      icon: '📖',
      category: 'intro',
    },
    {
      id: 'discovery-molecules',
      title: 'Explorer les Molécules',
      shortTitle: 'Molécules',
      description: 'Découvrez notre base de 500+ molécules odorantes',
      path: '/molecules',
      icon: '⚗️',
      category: 'exploration',
    },
    {
      id: 'discovery-recettes',
      title: 'Les Recettes Olfactives',
      shortTitle: 'Recettes',
      description: 'Parcourez les formulations créées par le laboratoire',
      path: '/recettes',
      icon: '📝',
      category: 'exploration',
    },
    {
      id: 'discovery-gammes',
      title: 'Les Collections',
      shortTitle: 'Gammes',
      description: 'Explorez les collections thématiques de parfums',
      path: '/gammes',
      icon: '🎨',
      category: 'creation',
    },
    {
      id: 'discovery-visualisations',
      title: 'Visualisations Interactives',
      shortTitle: 'Graphes',
      description: 'Explorez les données de manière visuelle',
      path: '/graphe-relations',
      icon: '📊',
      category: 'recherche',
    },
    {
      id: 'discovery-contribute',
      title: 'Rejoindre le Projet',
      shortTitle: 'Contribuer',
      description: 'Comment participer à cette aventure olfactive',
      path: '/a-propos',
      icon: '🤝',
      category: 'conclusion',
    },
  ],
};

// ============================================================
// PARCOURS CHERCHEUR (Focus scientifique)
// ============================================================
export const RESEARCHER_TOUR: TourConfig = {
  id: 'researcher',
  name: 'Parcours Chercheur',
  shortName: 'Chercheur',
  description: 'Un parcours approfondi pour les scientifiques et chercheurs',
  icon: '🔬',
  color: 'blue',
  duration: '20-25 min',
  steps: [
    {
      id: 'researcher-welcome',
      title: 'PERFUMUM — Recherche',
      shortTitle: 'Intro',
      description: 'Présentation du cadre scientifique du projet',
      path: '/',
      icon: '🏠',
      category: 'intro',
    },
    {
      id: 'researcher-methodology',
      title: 'Méthodologie ABSORBE',
      shortTitle: 'Méthode',
      description: 'Notre approche scientifique et artistique unique',
      path: '/methodologie/absorbe',
      icon: '🔬',
      category: 'intro',
    },
    {
      id: 'researcher-molecules',
      title: 'Base de Données Moléculaires',
      shortTitle: 'Molécules',
      description: 'Explorer les 500+ molécules avec leurs propriétés chimiques',
      path: '/molecules',
      icon: '⚗️',
      category: 'exploration',
    },
    {
      id: 'researcher-ifra',
      title: 'Réglementations IFRA',
      shortTitle: 'IFRA',
      description: 'Consulter les restrictions et normes de sécurité',
      path: '/ifra',
      icon: '⚠️',
      category: 'exploration',
    },
    {
      id: 'researcher-synergies',
      title: 'Synergies Moléculaires',
      shortTitle: 'Synergies',
      description: 'Comprendre les interactions entre molécules',
      path: '/suggestions-synergies',
      icon: '🔗',
      category: 'recherche',
    },
    {
      id: 'researcher-heatmap',
      title: 'Heatmap des Synergies',
      shortTitle: 'Heatmap',
      description: 'Visualisation matricielle des compatibilités',
      path: '/heatmap-synergies',
      icon: '🗺️',
      category: 'recherche',
    },
    {
      id: 'researcher-sankey',
      title: 'Flux Sankey',
      shortTitle: 'Sankey',
      description: 'Visualiser les flux entre familles olfactives',
      path: '/sankey-flow',
      icon: '📊',
      category: 'recherche',
    },
    {
      id: 'researcher-graphe',
      title: 'Graphe de Relations',
      shortTitle: 'Graphe',
      description: 'Explorer le réseau de connexions moléculaires',
      path: '/graphe-relations',
      icon: '🕸️',
      category: 'recherche',
    },
    {
      id: 'researcher-references',
      title: 'Références Scientifiques',
      shortTitle: 'Références',
      description: 'Bibliographie et sources de recherche',
      path: '/references-v3',
      icon: '📚',
      category: 'recherche',
    },
    {
      id: 'researcher-heritage',
      title: 'Patrimoine & Conservation',
      shortTitle: 'Patrimoine',
      description: 'Recherche sur la préservation olfactive',
      path: '/heritage-conservation',
      icon: '🏛️',
      category: 'conclusion',
    },
  ],
};

// ============================================================
// PARCOURS CRÉATEUR (Focus formulation)
// ============================================================
export const CREATOR_TOUR: TourConfig = {
  id: 'creator',
  name: 'Parcours Créateur',
  shortName: 'Créateur',
  description: 'Un parcours orienté création et formulation de parfums',
  icon: '🎨',
  color: 'purple',
  duration: '15-20 min',
  steps: [
    {
      id: 'creator-welcome',
      title: 'Atelier de Création',
      shortTitle: 'Intro',
      description: 'Bienvenue dans l\'espace de création olfactive',
      path: '/',
      icon: '🏠',
      category: 'intro',
    },
    {
      id: 'creator-accords',
      title: 'Les Accords Olfactifs',
      shortTitle: 'Accords',
      description: 'Comprendre les combinaisons harmonieuses',
      path: '/accords',
      icon: '🎵',
      category: 'intro',
    },
    {
      id: 'creator-familles',
      title: 'Familles Olfactives',
      shortTitle: 'Familles',
      description: 'Explorer les grandes familles de parfums',
      path: '/familles',
      icon: '🌸',
      category: 'exploration',
    },
    {
      id: 'creator-molecules',
      title: 'Palette de Molécules',
      shortTitle: 'Molécules',
      description: 'Votre palette de création olfactive',
      path: '/molecules',
      icon: '⚗️',
      category: 'exploration',
    },
    {
      id: 'creator-matieres',
      title: 'Matières Premières',
      shortTitle: 'Matières',
      description: 'Les ingrédients naturels et synthétiques',
      path: '/matieres-premieres',
      icon: '🌿',
      category: 'exploration',
    },
    {
      id: 'creator-formulator',
      title: 'Éditeur de Formulation',
      shortTitle: 'Éditeur',
      description: 'Créez vos propres formules olfactives',
      path: '/editeur-formulation',
      icon: '✏️',
      category: 'creation',
    },
    {
      id: 'creator-generator',
      title: 'Générateur IA',
      shortTitle: 'IA',
      description: 'Générez des formules avec l\'intelligence artificielle',
      path: '/generateur-formule',
      icon: '🤖',
      category: 'creation',
    },
    {
      id: 'creator-recettes',
      title: 'Recettes de Référence',
      shortTitle: 'Recettes',
      description: 'Inspirez-vous des formulations existantes',
      path: '/recettes',
      icon: '📝',
      category: 'creation',
    },
    {
      id: 'creator-gammes',
      title: 'Collections & Gammes',
      shortTitle: 'Gammes',
      description: 'Découvrez les collections thématiques',
      path: '/gammes',
      icon: '🎨',
      category: 'creation',
    },
    {
      id: 'creator-prototypes',
      title: 'Prototypes',
      shortTitle: 'Prototypes',
      description: 'Les créations expérimentales en cours',
      path: '/prototypes',
      icon: '🧪',
      category: 'conclusion',
    },
  ],
};

// ============================================================
// CONFIGURATION GLOBALE
// ============================================================
export const ALL_TOURS: TourConfig[] = [
  DISCOVERY_TOUR,
  RESEARCHER_TOUR,
  CREATOR_TOUR,
];

export const getTourById = (id: TourType): TourConfig | undefined => {
  return ALL_TOURS.find(tour => tour.id === id);
};

export const getDefaultTour = (): TourConfig => {
  return DISCOVERY_TOUR;
};

// ============================================================
// ANNOTATIONS CONTEXTUELLES
// ============================================================
export const STEP_ANNOTATIONS: StepAnnotation[] = [
  // Annotations pour le parcours Découverte
  {
    stepId: 'discovery-welcome',
    tourType: 'discovery',
    annotations: [
      {
        id: 'welcome-hero',
        title: 'Bienvenue !',
        content: 'PERFUMUM est un laboratoire de recherche olfactive. Explorez 10 ans de travail sur les parfums et les molécules odorantes.',
        position: 'center',
        delay: 500,
      },
      {
        id: 'welcome-nav',
        title: 'Navigation',
        content: 'Utilisez le menu pour explorer librement ou suivez ce parcours guidé.',
        position: 'top',
        delay: 2000,
      },
    ],
  },
  {
    stepId: 'discovery-molecules',
    tourType: 'discovery',
    annotations: [
      {
        id: 'molecules-search',
        title: 'Recherche',
        content: 'Utilisez la barre de recherche pour trouver une molécule par son nom ou ses propriétés olfactives.',
        position: 'top',
        delay: 500,
      },
      {
        id: 'molecules-filters',
        title: 'Filtres',
        content: 'Filtrez par famille olfactive, classe chimique ou profil sensoriel.',
        position: 'left',
        delay: 1500,
      },
    ],
  },
  {
    stepId: 'discovery-recettes',
    tourType: 'discovery',
    annotations: [
      {
        id: 'recettes-intro',
        title: 'Formulations',
        content: 'Chaque recette est une composition unique de molécules créant un accord olfactif.',
        position: 'center',
        delay: 500,
      },
    ],
  },
  
  // Annotations pour le parcours Chercheur
  {
    stepId: 'researcher-methodology',
    tourType: 'researcher',
    annotations: [
      {
        id: 'absorbe-intro',
        title: 'Méthode ABSORBE',
        content: 'ABSORBE est notre méthodologie propriétaire combinant analyse scientifique et sensibilité artistique.',
        position: 'center',
        delay: 500,
      },
      {
        id: 'absorbe-steps',
        title: 'Les 7 étapes',
        content: 'Analyse, Base, Synthèse, Organisation, Recherche, Bilan, Évolution — un processus itératif.',
        position: 'bottom',
        delay: 2000,
      },
    ],
  },
  {
    stepId: 'researcher-ifra',
    tourType: 'researcher',
    annotations: [
      {
        id: 'ifra-intro',
        title: 'Réglementations',
        content: 'L\'IFRA (International Fragrance Association) définit les limites d\'utilisation des matières premières.',
        position: 'center',
        delay: 500,
      },
      {
        id: 'ifra-search',
        title: 'Recherche par molécule',
        content: 'Trouvez rapidement les restrictions applicables à chaque ingrédient.',
        position: 'top',
        delay: 1500,
      },
    ],
  },
  {
    stepId: 'researcher-synergies',
    tourType: 'researcher',
    annotations: [
      {
        id: 'synergies-concept',
        title: 'Synergies',
        content: 'Certaines molécules se renforcent mutuellement, créant des effets olfactifs amplifiés.',
        position: 'center',
        delay: 500,
      },
    ],
  },
  {
    stepId: 'researcher-heatmap',
    tourType: 'researcher',
    annotations: [
      {
        id: 'heatmap-read',
        title: 'Lecture de la Heatmap',
        content: 'Les couleurs chaudes indiquent une forte synergie, les couleurs froides une faible compatibilité.',
        position: 'center',
        delay: 500,
      },
    ],
  },
  
  // Annotations pour le parcours Créateur
  {
    stepId: 'creator-accords',
    tourType: 'creator',
    annotations: [
      {
        id: 'accords-intro',
        title: 'Les Accords',
        content: 'Un accord est une combinaison harmonieuse de notes qui crée une impression olfactive cohérente.',
        position: 'center',
        delay: 500,
      },
    ],
  },
  {
    stepId: 'creator-formulator',
    tourType: 'creator',
    annotations: [
      {
        id: 'formulator-palette',
        title: 'Votre Palette',
        content: 'Glissez-déposez les molécules pour construire votre formule.',
        position: 'left',
        delay: 500,
      },
      {
        id: 'formulator-preview',
        title: 'Prévisualisation',
        content: 'Le radar affiche en temps réel le profil olfactif de votre création.',
        position: 'right',
        delay: 1500,
      },
      {
        id: 'formulator-save',
        title: 'Sauvegarde',
        content: 'Enregistrez vos formules pour les retrouver plus tard.',
        position: 'bottom',
        delay: 2500,
      },
    ],
  },
  {
    stepId: 'creator-generator',
    tourType: 'creator',
    annotations: [
      {
        id: 'generator-prompt',
        title: 'Décrivez votre idée',
        content: 'Entrez une description de l\'odeur souhaitée et l\'IA suggérera une formule.',
        position: 'center',
        delay: 500,
      },
    ],
  },
];

// Fonction pour récupérer les annotations d'une étape
export const getAnnotationsForStep = (stepId: string, tourType: TourType): StepAnnotation['annotations'] => {
  const annotation = STEP_ANNOTATIONS.find(
    a => a.stepId === stepId && a.tourType === tourType
  );
  return annotation?.annotations || [];
};

// Fonction pour vérifier si une étape a des annotations
export const hasAnnotations = (stepId: string, tourType: TourType): boolean => {
  return STEP_ANNOTATIONS.some(
    a => a.stepId === stepId && a.tourType === tourType && a.annotations.length > 0
  );
};
