import { useState, useEffect, useCallback, useMemo } from 'react';
import { X, Info, Lightbulb, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGuidedNavigation, TourType } from '@/contexts/GuidedNavigationContext';

// Types pour les annotations
export interface Annotation {
  id: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  highlight?: string;
  delay?: number;
  autoHide?: number;
  icon?: 'info' | 'tip' | 'arrow' | 'time';
}

// ============================================================
// ANNOTATIONS POUR LE PARCOURS PRÉSENTATION OFFICIELLE
// Basées sur le script oral du Guide de Présentation
// ============================================================
const PRESENTATION_ANNOTATIONS: Record<string, Annotation[]> = {
  'intro-accueil': [
    {
      id: 'accueil-intro',
      title: 'Section 1 — Introduction',
      content: 'PERFUMUM, du latin "per fumum" (à travers la fumée), est une plateforme de recherche olfactive décennale (2025-2035) développée au sein du laboratoire ABSORBE à Berne.',
      position: 'center',
      delay: 500,
      icon: 'info',
    },
    {
      id: 'accueil-stats',
      title: 'Statistiques Dynamiques',
      content: 'Montrez les chiffres clés : 556 molécules, 266 recettes, 144 plantes, 29 terroirs. Ces données évoluent constamment.',
      position: 'bottom',
      delay: 2000,
      icon: 'tip',
    },
  ],
  'archi-molecules-hub': [
    {
      id: 'hub-intro',
      title: 'Section 2 — Architecture',
      content: 'PERFUMUM repose sur une architecture relationnelle où chaque entité (molécule, plante, recette, terroir) est connectée aux autres.',
      position: 'center',
      delay: 500,
      icon: 'info',
    },
    {
      id: 'hub-filtres',
      title: 'Filtres Disponibles',
      content: 'Utilisez les filtres par famille chimique, note olfactive ou intensité. Chaque molécule est identifiée par son nom, numéro CAS et nom IUPAC.',
      position: 'top',
      delay: 1500,
      icon: 'tip',
    },
  ],
  'archi-molecule-detail': [
    {
      id: 'detail-radar',
      title: 'Radar de Profil Olfactif',
      content: 'Huit axes caractérisent chaque molécule selon l\'échelle ABSORBE : intensité, persistance, diffusion... Ces valeurs permettent une comparaison objective.',
      position: 'center',
      delay: 500,
      icon: 'info',
    },
    {
      id: 'detail-relations',
      title: 'Relations',
      content: 'Faites défiler pour voir les plantes contenant cette molécule, les recettes qui l\'utilisent, et les synergies connues.',
      position: 'bottom',
      delay: 2000,
      icon: 'tip',
    },
  ],
  'methodo-absorbe': [
    {
      id: 'absorbe-acronyme',
      title: 'Section 3 — Méthodologie',
      content: 'ABSORBE : Analyse, Base de données, Synergies, Olfaction, Recettes, Botanique, Expérimentation. Un cadre méthodologique rigoureux.',
      position: 'center',
      delay: 500,
      icon: 'info',
    },
    {
      id: 'absorbe-echelle',
      title: 'Échelle 0-10',
      content: 'L\'échelle ABSORBE est calibrée de 0 à 10. Score de 5 = moyenne, les extrêmes sont réservés aux cas exceptionnels.',
      position: 'bottom',
      delay: 2000,
      icon: 'tip',
    },
  ],
  'outils-synergies': [
    {
      id: 'synergies-intro',
      title: 'Section 4 — Outils Analytiques',
      content: 'Le système de suggestion identifie des combinaisons prometteuses basées sur les compatibilités chimiques et les profils olfactifs.',
      position: 'center',
      delay: 500,
      icon: 'info',
    },
    {
      id: 'synergies-exemple',
      title: 'Exemple',
      content: 'Linalol + Acétate de linalyle : profils complémentaires (fraîcheur florale + tenue et rondeur), validés par des recettes existantes.',
      position: 'bottom',
      delay: 2000,
      icon: 'tip',
    },
  ],
  'outils-graphe': [
    {
      id: 'graphe-intro',
      title: 'Graphe de Relations',
      content: 'Chaque nœud représente une entité, les liens montrent les relations : contient, provient de, utilise, est associé à.',
      position: 'center',
      delay: 500,
      icon: 'info',
    },
    {
      id: 'graphe-navigation',
      title: 'Navigation',
      content: 'Filtrez par type d\'entité, zoomez, suivez un chemin : Provence → plantes → molécules → recettes.',
      position: 'bottom',
      delay: 2000,
      icon: 'tip',
    },
  ],
  'creation-gammes-hub': [
    {
      id: 'gammes-intro',
      title: 'Section 5 — Gammes',
      content: 'Les gammes thématiques explorent des territoires olfactifs distincts : Petrichor (pluie), Volcanique (fumé), Glaciaire (froid).',
      position: 'center',
      delay: 500,
      icon: 'info',
    },
  ],
  'creation-prototype-c1': [
    {
      id: 'prototype-intro',
      title: 'Prototype C1 — FERMENTUM',
      content: 'Documentation exhaustive : formule complète avec pourcentages, processus de création, résultats GC-MS, notes de dégustation.',
      position: 'center',
      delay: 500,
      icon: 'info',
    },
    {
      id: 'prototype-journal',
      title: 'Journal de Bord',
      content: 'Cette documentation permet de reproduire la composition et de tracer l\'évolution du travail sur la décennie.',
      position: 'bottom',
      delay: 2000,
      icon: 'tip',
    },
  ],
  'contrib-interface': [
    {
      id: 'contrib-intro',
      title: 'Section 6 — Contribution',
      content: 'Cinq collaborateurs enrichissent la base. L\'interface inclut détection de doublons et workflow de validation (brouillon → validé).',
      position: 'center',
      delay: 500,
      icon: 'info',
    },
    {
      id: 'contrib-import',
      title: 'Import CSV',
      content: 'Import en masse avec prévisualisation et correction des erreurs avant import final.',
      position: 'bottom',
      delay: 2000,
      icon: 'tip',
    },
  ],
  'conclusion-dashboard': [
    {
      id: 'dashboard-synthese',
      title: 'Section 7 — Conclusion',
      content: 'PERFUMUM est une infrastructure de recherche pensée pour le long terme. En 2035 : une archive unique de 10 années de recherche olfactive.',
      position: 'center',
      delay: 500,
      icon: 'info',
    },
    {
      id: 'dashboard-questions',
      title: 'Questions',
      content: 'Fin de la présentation. Ouvrez aux questions sur les aspects techniques, la méthodologie ou la vision à long terme.',
      position: 'bottom',
      delay: 2000,
      icon: 'tip',
    },
  ],
};

// ============================================================
// ANNOTATIONS POUR LE PARCOURS CHERCHEUR
// ============================================================
const RESEARCHER_ANNOTATIONS: Record<string, Annotation[]> = {
  'researcher-methodology': [
    {
      id: 'absorbe-science',
      title: 'Cadre Scientifique',
      content: 'La méthodologie ABSORBE garantit la reproductibilité et la cohérence des données sur 10 ans de recherche.',
      position: 'center',
      delay: 500,
      icon: 'info',
    },
  ],
  'researcher-ifra': [
    {
      id: 'ifra-reglements',
      title: 'Réglementations IFRA',
      content: 'L\'IFRA définit les limites d\'utilisation des matières premières. Consultez les restrictions par molécule.',
      position: 'center',
      delay: 500,
      icon: 'info',
    },
  ],
  'researcher-synergies': [
    {
      id: 'synergies-science',
      title: 'Synergies Moléculaires',
      content: 'Certaines molécules se renforcent mutuellement, créant des effets olfactifs amplifiés.',
      position: 'center',
      delay: 500,
      icon: 'tip',
    },
  ],
  'researcher-heatmap': [
    {
      id: 'heatmap-lecture',
      title: 'Lecture de la Heatmap',
      content: 'Couleurs chaudes = forte synergie, couleurs froides = faible compatibilité.',
      position: 'center',
      delay: 500,
      icon: 'tip',
    },
  ],
};

// ============================================================
// ANNOTATIONS POUR LE PARCOURS CRÉATEUR
// ============================================================
const CREATOR_ANNOTATIONS: Record<string, Annotation[]> = {
  'creator-accords': [
    {
      id: 'accords-definition',
      title: 'Les Accords',
      content: 'Un accord est une combinaison harmonieuse de notes créant une impression olfactive cohérente.',
      position: 'center',
      delay: 500,
      icon: 'info',
    },
  ],
  'creator-formulator': [
    {
      id: 'formulator-palette',
      title: 'Votre Palette',
      content: 'Glissez-déposez les molécules pour construire votre formule.',
      position: 'left',
      delay: 500,
      icon: 'tip',
    },
    {
      id: 'formulator-radar',
      title: 'Prévisualisation',
      content: 'Le radar affiche en temps réel le profil olfactif de votre création.',
      position: 'right',
      delay: 1500,
      icon: 'tip',
    },
  ],
  'creator-generator': [
    {
      id: 'generator-ia',
      title: 'Générateur IA',
      content: 'Décrivez l\'odeur souhaitée et l\'IA suggérera une formule adaptée.',
      position: 'center',
      delay: 500,
      icon: 'tip',
    },
  ],
};

// ============================================================
// ANNOTATIONS POUR LE PARCOURS EXPLORATEUR
// ============================================================
const EXPLORER_ANNOTATIONS: Record<string, Annotation[]> = {
  'explorer-welcome': [
    {
      id: 'welcome-bienvenue',
      title: 'Bienvenue !',
      content: 'PERFUMUM est un laboratoire de recherche olfactive. Explorez librement les contenus et visualisations.',
      position: 'center',
      delay: 500,
      icon: 'info',
    },
  ],
  'explorer-graphe': [
    {
      id: 'graphe-explorer',
      title: 'Exploration Visuelle',
      content: 'Naviguez dans le réseau de relations entre molécules, plantes, terroirs et recettes.',
      position: 'center',
      delay: 500,
      icon: 'tip',
    },
  ],
};

// Configuration des annotations par type de parcours
const ANNOTATIONS_CONFIG: Record<TourType, Record<string, Annotation[]>> = {
  presentation: PRESENTATION_ANNOTATIONS,
  researcher: RESEARCHER_ANNOTATIONS,
  creator: CREATOR_ANNOTATIONS,
  explorer: EXPLORER_ANNOTATIONS,
};

// Hook pour gérer les annotations de l'étape actuelle
export function useStepAnnotations() {
  const { isGuidedMode, currentStep, currentTourType } = useGuidedNavigation();
  const [visibleAnnotations, setVisibleAnnotations] = useState<Annotation[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isGuidedMode || !currentStep) {
      setVisibleAnnotations([]);
      return;
    }

    const stepAnnotations = ANNOTATIONS_CONFIG[currentTourType]?.[currentStep.id] || [];
    const newAnnotations = stepAnnotations.filter(a => !dismissedIds.has(a.id));
    
    // Réinitialiser les annotations visibles
    setVisibleAnnotations([]);
    
    // Afficher les annotations avec délai
    newAnnotations.forEach(annotation => {
      const delay = annotation.delay || 0;
      setTimeout(() => {
        setVisibleAnnotations(prev => {
          if (prev.find(a => a.id === annotation.id)) return prev;
          return [...prev, annotation];
        });
        
        // Auto-hide si configuré
        if (annotation.autoHide) {
          setTimeout(() => {
            setVisibleAnnotations(prev => prev.filter(a => a.id !== annotation.id));
          }, annotation.autoHide);
        }
      }, delay);
    });

    // Cleanup
    return () => {
      setVisibleAnnotations([]);
    };
  }, [isGuidedMode, currentStep, currentTourType, dismissedIds]);

  const dismissAnnotation = useCallback((id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
    setVisibleAnnotations(prev => prev.filter(a => a.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    const ids = visibleAnnotations.map(a => a.id);
    setDismissedIds(prev => new Set([...prev, ...ids]));
    setVisibleAnnotations([]);
  }, [visibleAnnotations]);

  // Réinitialiser les annotations dismissées quand on change d'étape
  useEffect(() => {
    setDismissedIds(new Set());
  }, [currentStep?.id]);

  return {
    annotations: visibleAnnotations,
    dismissAnnotation,
    dismissAll,
    hasAnnotations: visibleAnnotations.length > 0,
  };
}

// Composant d'annotation individuelle
interface AnnotationBubbleProps {
  annotation: Annotation;
  onDismiss: () => void;
  index: number;
}

function AnnotationBubble({ annotation, onDismiss, index }: AnnotationBubbleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Détecter si on est sur mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Animation d'entrée
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Sur mobile, toutes les annotations sont en bas de l'écran pour ne pas bloquer le contenu
  // Sur desktop, on utilise les positions spécifiées
  const positionClasses = useMemo(() => ({
    top: isMobile 
      ? 'bottom-24 left-4 right-4' 
      : 'top-20 left-1/2 -translate-x-1/2',
    bottom: isMobile 
      ? 'bottom-24 left-4 right-4' 
      : 'bottom-32 left-1/2 -translate-x-1/2',
    left: isMobile 
      ? 'bottom-24 left-4 right-4' 
      : 'top-1/2 left-4 -translate-y-1/2',
    right: isMobile 
      ? 'bottom-24 left-4 right-4' 
      : 'top-1/2 right-4 -translate-y-1/2',
    center: isMobile 
      ? 'bottom-24 left-4 right-4' 
      : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  }), [isMobile]);

  const iconComponents = {
    info: Info,
    tip: Lightbulb,
    arrow: ArrowRight,
    time: Clock,
  };

  const IconComponent = iconComponents[annotation.icon || 'info'];

  return (
    <div
      className={cn(
        'fixed z-[100] max-w-md transition-all duration-500 ease-out',
        positionClasses[annotation.position],
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      )}
      style={{
        // Sur mobile, empiler les annotations vers le haut depuis le bas
        // Sur desktop, utiliser le décalage vertical pour les annotations centrées
        marginBottom: isMobile ? `${index * 100}px` : undefined,
        marginTop: !isMobile && annotation.position === 'center' ? `${index * 80}px` : undefined,
      }}
    >
      <div className="bg-card/95 backdrop-blur-sm border border-primary/20 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-primary/10 border-b border-primary/10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/20">
              <IconComponent className="h-4 w-4 text-primary" />
            </div>
            <h4 className="font-semibold text-sm text-foreground">{annotation.title}</h4>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded-full hover:bg-muted/50 transition-colors"
            aria-label="Fermer"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        
        {/* Content */}
        <div className="px-4 py-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {annotation.content}
          </p>
        </div>
        
        {/* Indicateur de position */}
        {annotation.position !== 'center' && (
          <div
            className={cn(
              'absolute w-3 h-3 bg-card border rotate-45',
              annotation.position === 'top' && '-bottom-1.5 left-1/2 -translate-x-1/2 border-r border-b border-primary/20',
              annotation.position === 'bottom' && '-top-1.5 left-1/2 -translate-x-1/2 border-l border-t border-primary/20',
              annotation.position === 'left' && '-right-1.5 top-1/2 -translate-y-1/2 border-t border-r border-primary/20',
              annotation.position === 'right' && '-left-1.5 top-1/2 -translate-y-1/2 border-b border-l border-primary/20'
            )}
          />
        )}
      </div>
    </div>
  );
}

// Composant conteneur des annotations
export function GuidedAnnotations() {
  const { annotations, dismissAnnotation, dismissAll, hasAnnotations } = useStepAnnotations();
  const { isGuidedMode } = useGuidedNavigation();

  if (!isGuidedMode || !hasAnnotations) {
    return null;
  }

  return (
    <>
      {/* Overlay semi-transparent pour focus */}
      {annotations.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/20 z-[99] pointer-events-none"
          aria-hidden="true"
        />
      )}
      
      {/* Annotations */}
      {annotations.map((annotation, index) => (
        <AnnotationBubble
          key={annotation.id}
          annotation={annotation}
          onDismiss={() => dismissAnnotation(annotation.id)}
          index={index}
        />
      ))}
      
      {/* Bouton pour tout fermer si plusieurs annotations */}
      {annotations.length > 1 && (
        <button
          onClick={dismissAll}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 md:bottom-40 md:right-4 md:left-auto md:translate-x-0 z-[101] px-4 py-2 md:px-3 md:py-1.5 text-sm md:text-xs font-medium bg-primary text-primary-foreground md:bg-muted/90 md:hover:bg-muted md:text-muted-foreground rounded-full shadow-lg transition-colors min-h-[44px] md:min-h-0"
        >
          Tout fermer
        </button>
      )}
    </>
  );
}

export default GuidedAnnotations;
