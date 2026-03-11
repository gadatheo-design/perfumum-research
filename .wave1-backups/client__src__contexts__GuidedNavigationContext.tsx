// @ts-nocheck
import { safeJsonParse } from "@/lib/utils";
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';

// Définition des étapes du parcours de présentation
export interface GuidedStep {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  path: string;
  icon?: string;
  category: 'intro' | 'exploration' | 'creation' | 'recherche' | 'conclusion';
  duration?: string; // Durée estimée pour cette étape
  section?: number; // Numéro de section du guide
}

// Types pour les parcours thématiques
export type TourType = 'presentation' | 'researcher' | 'creator' | 'explorer';

export interface TourConfig {
  id: TourType;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  duration: string;
  steps: GuidedStep[];
}

// ============================================================
// PARCOURS PRÉSENTATION OFFICIEL (15 minutes)
// Basé sur le Guide de Présentation Orale PERFUMUM
// ============================================================
export const PRESENTATION_STEPS: GuidedStep[] = [
  // Section 1 — Introduction et Contexte (2 minutes)
  {
    id: 'intro-accueil',
    title: 'Introduction et Contexte',
    shortTitle: 'Accueil',
    description: 'Vision et contexte du projet PERFUMUM — plateforme de recherche olfactive décennale',
    path: '/',
    icon: '🏠',
    category: 'intro',
    duration: '2 min',
    section: 1,
  },
  // Section 2 — Architecture des Données (3 minutes)
  {
    id: 'archi-molecules-hub',
    title: 'Hub des Molécules',
    shortTitle: 'Hub Molécules',
    description: 'Structure relationnelle et catalogue des 556 molécules documentées',
    path: '/molecules-hub',
    icon: '⚗️',
    category: 'exploration',
    duration: '1.5 min',
    section: 2,
  },
  {
    id: 'archi-molecule-detail',
    title: 'Fiche Molécule Détaillée',
    shortTitle: 'Détail Molécule',
    description: 'Radar de profil olfactif, relations avec plantes et recettes',
    path: '/molecules',
    icon: '🔬',
    category: 'exploration',
    duration: '1.5 min',
    section: 2,
  },
  // Section 3 — Méthodologie ABSORBE (2 minutes)
  {
    id: 'methodo-absorbe',
    title: 'Méthodologie ABSORBE',
    shortTitle: 'Méthode',
    description: 'Cadre scientifique, échelle de notation 0-10, protocoles analytiques',
    path: '/methodologie/absorbe',
    icon: '📐',
    category: 'recherche',
    duration: '2 min',
    section: 3,
  },
  // Section 4 — Outils de Recherche et Visualisations (3 minutes)
  {
    id: 'outils-synergies',
    title: 'Suggestions de Synergies',
    shortTitle: 'Synergies',
    description: 'Système de suggestion basé sur les compatibilités chimiques et olfactives',
    path: '/suggestions-synergies',
    icon: '🔗',
    category: 'recherche',
    duration: '1.5 min',
    section: 4,
  },
  {
    id: 'outils-graphe',
    title: 'Graphe de Relations',
    shortTitle: 'Graphe',
    description: 'Visualisation interactive du réseau molécules-plantes-terroirs-recettes',
    path: '/graphe-relations',
    icon: '🕸️',
    category: 'recherche',
    duration: '1.5 min',
    section: 4,
  },
  // Section 5 — Gammes et Prototypes (2 minutes)
  {
    id: 'creation-gammes-hub',
    title: 'Hub des Gammes',
    shortTitle: 'Gammes',
    description: 'Collections thématiques : Petrichor, Volcanique, Glaciaire...',
    path: '/gammes-hub',
    icon: '🎨',
    category: 'creation',
    duration: '1 min',
    section: 5,
  },
  {
    id: 'creation-prototype-c1',
    title: 'Prototype C1 — FERMENTUM',
    shortTitle: 'Prototype C1',
    description: 'Documentation exhaustive : formule, processus, analyses GC-MS',
    path: '/prototypes/c1',
    icon: '🧪',
    category: 'creation',
    duration: '1 min',
    section: 5,
  },
  // Section 6 — Contribution et Évolution (2 minutes)
  {
    id: 'contrib-interface',
    title: 'Interface Contributeur',
    shortTitle: 'Contribuer',
    description: 'Système collaboratif, détection de doublons, workflow de validation',
    path: '/contributor',
    icon: '👥',
    category: 'conclusion',
    duration: '2 min',
    section: 6,
  },
  // Section 7 — Conclusion (1 minute)
  {
    id: 'conclusion-dashboard',
    title: 'Conclusion — Dashboard',
    shortTitle: 'Dashboard',
    description: 'Synthèse du projet et vision décennale 2025-2035',
    path: '/dashboard',
    icon: '📊',
    category: 'conclusion',
    duration: '1 min',
    section: 7,
  },
];

// ============================================================
// PARCOURS CHERCHEUR (Focus scientifique)
// ============================================================
export const RESEARCHER_STEPS: GuidedStep[] = [
  {
    id: 'researcher-intro',
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
    path: '/molecules-hub',
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
];

// ============================================================
// PARCOURS CRÉATEUR (Focus formulation)
// ============================================================
export const CREATOR_STEPS: GuidedStep[] = [
  {
    id: 'creator-intro',
    title: 'Atelier de Création',
    shortTitle: 'Intro',
    description: "Bienvenue dans l'espace de création olfactive",
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
    path: '/molecules-hub',
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
    description: "Générez des formules avec l'intelligence artificielle",
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
    path: '/gammes-hub',
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
];

// ============================================================
// PARCOURS EXPLORATEUR (Découverte libre)
// ============================================================
export const EXPLORER_STEPS: GuidedStep[] = [
  {
    id: 'explorer-welcome',
    title: 'Bienvenue sur PERFUMUM',
    shortTitle: 'Accueil',
    description: 'Découvrez le laboratoire de recherche olfactive expérimentale',
    path: '/',
    icon: '🏠',
    category: 'intro',
  },
  {
    id: 'explorer-project',
    title: 'Le Projet PERFUMUM',
    shortTitle: 'Le Projet',
    description: 'Comprendre la vision et les objectifs de 10 ans de recherche',
    path: '/le-projet',
    icon: '📖',
    category: 'intro',
  },
  {
    id: 'explorer-molecules',
    title: 'Explorer les Molécules',
    shortTitle: 'Molécules',
    description: 'Découvrez notre base de 500+ molécules odorantes',
    path: '/molecules-hub',
    icon: '⚗️',
    category: 'exploration',
  },
  {
    id: 'explorer-plantes',
    title: 'Les Plantes Sources',
    shortTitle: 'Plantes',
    description: 'Explorez les 144 plantes documentées',
    path: '/plantes',
    icon: '🌿',
    category: 'exploration',
  },
  {
    id: 'explorer-terroirs',
    title: 'Les Terroirs',
    shortTitle: 'Terroirs',
    description: 'Découvrez les 29 terroirs géographiques',
    path: '/carte-terroirs',
    icon: '🗺️',
    category: 'exploration',
  },
  {
    id: 'explorer-graphe',
    title: 'Visualisations Interactives',
    shortTitle: 'Graphes',
    description: 'Explorez les données de manière visuelle',
    path: '/graphe-relations',
    icon: '📊',
    category: 'recherche',
  },
  {
    id: 'explorer-about',
    title: 'À Propos',
    shortTitle: 'À Propos',
    description: 'En savoir plus sur le laboratoire ABSORBE',
    path: '/a-propos',
    icon: '🤝',
    category: 'conclusion',
  },
];

// Configuration des parcours thématiques
export const TOUR_CONFIGS: Record<TourType, TourConfig> = {
  presentation: {
    id: 'presentation',
    name: 'Présentation Officielle',
    shortName: 'Présentation',
    description: 'Parcours de présentation orale de 15 minutes — 7 sections structurées',
    icon: '🎤',
    color: 'amber',
    duration: '15 min',
    steps: PRESENTATION_STEPS,
  },
  researcher: {
    id: 'researcher',
    name: 'Parcours Chercheur',
    shortName: 'Chercheur',
    description: 'Focus sur les données scientifiques, méthodologie et analyses',
    icon: '🔬',
    color: 'blue',
    duration: '20-25 min',
    steps: RESEARCHER_STEPS,
  },
  creator: {
    id: 'creator',
    name: 'Parcours Créateur',
    shortName: 'Créateur',
    description: 'Focus sur la formulation, les outils créatifs et les recettes',
    icon: '🎨',
    color: 'purple',
    duration: '15-20 min',
    steps: CREATOR_STEPS,
  },
  explorer: {
    id: 'explorer',
    name: 'Parcours Explorateur',
    shortName: 'Explorateur',
    description: 'Découverte libre des contenus et visualisations',
    icon: '🌟',
    color: 'green',
    duration: '10-15 min',
    steps: EXPLORER_STEPS,
  },
};

// Parcours par défaut = Présentation Officielle
export const DEFAULT_PRESENTATION_STEPS = PRESENTATION_STEPS;

interface GuidedNavigationContextType {
  // État
  isGuidedMode: boolean;
  currentStepIndex: number;
  steps: GuidedStep[];
  currentStep: GuidedStep | null;
  progress: number;
  
  // Parcours thématique
  currentTourType: TourType;
  currentTourConfig: TourConfig;
  availableTours: TourConfig[];
  
  // Actions
  startGuidedMode: (tourType?: TourType) => void;
  exitGuidedMode: () => void;
  switchTour: (tourType: TourType) => void;
  goToStep: (index: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  
  // Menu mobile
  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  
  // Sélecteur de parcours
  isTourSelectorOpen: boolean;
  openTourSelector: () => void;
  closeTourSelector: () => void;
}

const GuidedNavigationContext = createContext<GuidedNavigationContextType | null>(null);

interface GuidedNavigationProviderProps {
  children: ReactNode;
}

export function GuidedNavigationProvider({ children }: GuidedNavigationProviderProps) {
  const [location, setLocation] = useLocation();
  const [isGuidedMode, setIsGuidedMode] = useState(false);
  const [currentTourType, setCurrentTourType] = useState<TourType>('presentation');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTourSelectorOpen, setIsTourSelectorOpen] = useState(false);

  const currentTourConfig = TOUR_CONFIGS[currentTourType];
  const steps = currentTourConfig.steps;
  const availableTours = Object.values(TOUR_CONFIGS);

  // Calculer l'étape actuelle basée sur l'URL
  useEffect(() => {
    if (isGuidedMode) {
      const stepIndex = steps.findIndex(step => step.path === location);
      if (stepIndex !== -1) {
        setCurrentStepIndex(stepIndex);
      }
    }
  }, [location, isGuidedMode, steps]);

  // Sauvegarder l'état dans localStorage
  useEffect(() => {
    if (isGuidedMode) {
      localStorage.setItem('perfumum_guided_mode', JSON.stringify({
        isActive: true,
        currentIndex: currentStepIndex,
        tourType: currentTourType,
      }));
    } else {
      localStorage.removeItem('perfumum_guided_mode');
    }
  }, [isGuidedMode, currentStepIndex, currentTourType]);

  // Restaurer l'état au chargement
  useEffect(() => {
    const saved = localStorage.getItem('perfumum_guided_mode');
    if (saved) {
      try {
        const parsed = safeJsonParse(saved, null); if (!parsed) return; const { isActive, currentIndex, tourType } = parsed;
        if (isActive) {
          setIsGuidedMode(true);
          setCurrentStepIndex(currentIndex || 0);
          if (tourType && TOUR_CONFIGS[tourType as TourType]) {
            setCurrentTourType(tourType as TourType);
          }
        }
      } catch {
        // Ignorer les erreurs de parsing
      }
    }
  }, []);

  const currentStep = isGuidedMode ? steps[currentStepIndex] : null;
  const progress = isGuidedMode ? ((currentStepIndex + 1) / steps.length) * 100 : 0;
  const canGoNext = currentStepIndex < steps.length - 1;
  const canGoPrevious = currentStepIndex > 0;

  const startGuidedMode = useCallback((tourType: TourType = 'presentation') => {
    setCurrentTourType(tourType);
    setIsGuidedMode(true);
    setCurrentStepIndex(0);
    const tourSteps = TOUR_CONFIGS[tourType].steps;
    setLocation(tourSteps[0].path);
  }, [setLocation]);

  const exitGuidedMode = useCallback(() => {
    setIsGuidedMode(false);
    setIsMenuOpen(false);
    setIsTourSelectorOpen(false);
    localStorage.removeItem('perfumum_guided_mode');
  }, []);

  const switchTour = useCallback((tourType: TourType) => {
    setCurrentTourType(tourType);
    setCurrentStepIndex(0);
    const tourSteps = TOUR_CONFIGS[tourType].steps;
    setLocation(tourSteps[0].path);
    setIsTourSelectorOpen(false);
  }, [setLocation]);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
      setLocation(steps[index].path);
      setIsMenuOpen(false);
    }
  }, [steps, setLocation]);

  const goToNextStep = useCallback(() => {
    if (canGoNext) {
      goToStep(currentStepIndex + 1);
    }
  }, [canGoNext, currentStepIndex, goToStep]);

  const goToPreviousStep = useCallback(() => {
    if (canGoPrevious) {
      goToStep(currentStepIndex - 1);
    }
  }, [canGoPrevious, currentStepIndex, goToStep]);

  const openMenu = useCallback(() => setIsMenuOpen(true), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
  
  const openTourSelector = useCallback(() => setIsTourSelectorOpen(true), []);
  const closeTourSelector = useCallback(() => setIsTourSelectorOpen(false), []);

  return (
    <GuidedNavigationContext.Provider
      value={{
        isGuidedMode,
        currentStepIndex,
        steps,
        currentStep,
        progress,
        currentTourType,
        currentTourConfig,
        availableTours,
        startGuidedMode,
        exitGuidedMode,
        switchTour,
        goToStep,
        goToNextStep,
        goToPreviousStep,
        canGoNext,
        canGoPrevious,
        isMenuOpen,
        openMenu,
        closeMenu,
        toggleMenu,
        isTourSelectorOpen,
        openTourSelector,
        closeTourSelector,
      }}
    >
      {children}
    </GuidedNavigationContext.Provider>
  );
}

export function useGuidedNavigation() {
  const context = useContext(GuidedNavigationContext);
  if (!context) {
    throw new Error('useGuidedNavigation must be used within a GuidedNavigationProvider');
  }
  return context;
}
