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
}

// Parcours de présentation par défaut
export const DEFAULT_PRESENTATION_STEPS: GuidedStep[] = [
  {
    id: 'welcome',
    title: 'Bienvenue sur PERFUMUM',
    shortTitle: 'Accueil',
    description: 'Découvrez le laboratoire de recherche olfactive expérimentale',
    path: '/',
    icon: '🏠',
    category: 'intro',
  },
  {
    id: 'about',
    title: 'Le Projet PERFUMUM',
    shortTitle: 'Le Projet',
    description: 'Comprendre la vision et les objectifs de 10 ans de recherche',
    path: '/le-projet',
    icon: '📖',
    category: 'intro',
  },
  {
    id: 'methodology',
    title: 'Méthodologie ABSORBE',
    shortTitle: 'Méthode',
    description: 'Notre approche scientifique et artistique unique',
    path: '/methodologie/absorbe',
    icon: '🔬',
    category: 'intro',
  },
  {
    id: 'molecules',
    title: 'Base de Molécules',
    shortTitle: 'Molécules',
    description: 'Explorer les 500+ molécules documentées',
    path: '/molecules',
    icon: '⚗️',
    category: 'exploration',
  },
  {
    id: 'recettes',
    title: 'Recettes Olfactives',
    shortTitle: 'Recettes',
    description: 'Découvrir les formulations créées',
    path: '/recettes',
    icon: '📝',
    category: 'exploration',
  },
  {
    id: 'gammes',
    title: 'Les Gammes',
    shortTitle: 'Gammes',
    description: 'Explorer les collections thématiques',
    path: '/gammes',
    icon: '🎨',
    category: 'creation',
  },
  {
    id: 'prototypes',
    title: 'Prototypes',
    shortTitle: 'Prototypes',
    description: 'Les créations expérimentales en cours',
    path: '/prototypes',
    icon: '🧪',
    category: 'creation',
  },
  {
    id: 'synergies',
    title: 'Synergies Moléculaires',
    shortTitle: 'Synergies',
    description: 'Comprendre les interactions entre molécules',
    path: '/suggestions-synergies',
    icon: '🔗',
    category: 'recherche',
  },
  {
    id: 'visualisations',
    title: 'Visualisations',
    shortTitle: 'Graphes',
    description: 'Explorer les données de manière interactive',
    path: '/graphe-relations',
    icon: '📊',
    category: 'recherche',
  },
  {
    id: 'contribute',
    title: 'Contribuer',
    shortTitle: 'Contribuer',
    description: 'Rejoindre le projet de recherche',
    path: '/a-propos',
    icon: '🤝',
    category: 'conclusion',
  },
];

interface GuidedNavigationContextType {
  // État
  isGuidedMode: boolean;
  currentStepIndex: number;
  steps: GuidedStep[];
  currentStep: GuidedStep | null;
  progress: number;
  
  // Actions
  startGuidedMode: (customSteps?: GuidedStep[]) => void;
  exitGuidedMode: () => void;
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
}

const GuidedNavigationContext = createContext<GuidedNavigationContextType | null>(null);

interface GuidedNavigationProviderProps {
  children: ReactNode;
}

export function GuidedNavigationProvider({ children }: GuidedNavigationProviderProps) {
  const [location, setLocation] = useLocation();
  const [isGuidedMode, setIsGuidedMode] = useState(false);
  const [steps, setSteps] = useState<GuidedStep[]>(DEFAULT_PRESENTATION_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      }));
    } else {
      localStorage.removeItem('perfumum_guided_mode');
    }
  }, [isGuidedMode, currentStepIndex]);

  // Restaurer l'état au chargement
  useEffect(() => {
    const saved = localStorage.getItem('perfumum_guided_mode');
    if (saved) {
      try {
        const { isActive, currentIndex } = JSON.parse(saved);
        if (isActive) {
          setIsGuidedMode(true);
          setCurrentStepIndex(currentIndex);
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

  const startGuidedMode = useCallback((customSteps?: GuidedStep[]) => {
    if (customSteps) {
      setSteps(customSteps);
    }
    setIsGuidedMode(true);
    setCurrentStepIndex(0);
    setLocation(customSteps?.[0]?.path || steps[0].path);
  }, [setLocation, steps]);

  const exitGuidedMode = useCallback(() => {
    setIsGuidedMode(false);
    setIsMenuOpen(false);
    localStorage.removeItem('perfumum_guided_mode');
  }, []);

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

  return (
    <GuidedNavigationContext.Provider
      value={{
        isGuidedMode,
        currentStepIndex,
        steps,
        currentStep,
        progress,
        startGuidedMode,
        exitGuidedMode,
        goToStep,
        goToNextStep,
        goToPreviousStep,
        canGoNext,
        canGoPrevious,
        isMenuOpen,
        openMenu,
        closeMenu,
        toggleMenu,
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
