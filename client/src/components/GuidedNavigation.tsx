import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useGuidedNavigation, GuidedStep, TourType, TOUR_CONFIGS } from '@/contexts/GuidedNavigationContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Menu, 
  Play, 
  CheckCircle2,
  Circle,
  MapPin,
  Clock,
  Compass,
  Beaker,
  Palette,
  Sparkles,
  Mic,
  List
} from 'lucide-react';

// Catégories avec couleurs
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  intro: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/30' },
  exploration: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/30' },
  creation: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/30' },
  recherche: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30' },
  conclusion: { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/30' },
};

const CATEGORY_LABELS: Record<string, string> = {
  intro: 'Introduction',
  exploration: 'Exploration',
  creation: 'Création',
  recherche: 'Recherche',
  conclusion: 'Conclusion',
};

// Icônes pour les types de parcours
const TOUR_ICONS: Record<TourType, React.ReactNode> = {
  presentation: <Mic className="h-5 w-5" />,
  researcher: <Beaker className="h-5 w-5" />,
  creator: <Palette className="h-5 w-5" />,
  explorer: <Compass className="h-5 w-5" />,
};

// Couleurs pour les types de parcours
const TOUR_COLORS: Record<TourType, string> = {
  presentation: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  researcher: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
  creator: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
  explorer: 'bg-green-500/10 text-green-600 border-green-500/30',
};

/**
 * Sélecteur de parcours thématique
 */
export function TourSelector() {
  const { 
    isTourSelectorOpen, 
    closeTourSelector, 
    switchTour, 
    currentTourType,
    availableTours,
    isGuidedMode 
  } = useGuidedNavigation();

  return (
    <Dialog open={isTourSelectorOpen} onOpenChange={(open) => !open && closeTourSelector()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Choisir un parcours
          </DialogTitle>
          <DialogDescription>
            Sélectionnez le parcours adapté à votre profil.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-2 sm:gap-3 mt-3 sm:mt-4">
          {availableTours.map((tour) => {
            const isActive = isGuidedMode && currentTourType === tour.id;
            
            return (
              <button
                key={tour.id}
                onClick={() => switchTour(tour.id)}
                className={cn(
                  "w-full p-3 sm:p-4 rounded-xl border-2 text-left transition-all",
                  isActive 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className={cn(
                    "p-1.5 sm:p-2 rounded-lg shrink-0",
                    TOUR_COLORS[tour.id]
                  )}>
                    {TOUR_ICONS[tour.id]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 sm:mb-1 flex-wrap">
                      <h3 className="font-semibold text-sm sm:text-base">{tour.name}</h3>
                      {isActive && (
                        <span className="text-[10px] sm:text-xs bg-primary/10 text-primary px-1.5 sm:px-2 py-0.5 rounded-full">
                          Actif
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2 line-clamp-2">
                      {tour.description}
                    </p>
                    <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {tour.duration}
                      </span>
                      <span>{tour.steps.length} étapes</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Barre de navigation guidée fixe en haut de l'écran
 */
export function GuidedNavigationBar() {
  const {
    isGuidedMode,
    currentStep,
    currentStepIndex,
    steps,
    progress,
    goToNextStep,
    goToPreviousStep,
    exitGuidedMode,
    canGoNext,
    canGoPrevious,
    isMenuOpen,
    toggleMenu,
    closeMenu,
    currentTourConfig,
    openTourSelector,
  } = useGuidedNavigation();

  // Gestion du swipe sur mobile
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold && canGoPrevious) {
      goToPreviousStep();
    } else if (info.offset.x < -threshold && canGoNext) {
      goToNextStep();
    }
  };

  // Raccourcis clavier
  useEffect(() => {
    if (!isGuidedMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && canGoNext) {
        goToNextStep();
      } else if (e.key === 'ArrowLeft' && canGoPrevious) {
        goToPreviousStep();
      } else if (e.key === 'Escape') {
        exitGuidedMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGuidedMode, canGoNext, canGoPrevious, goToNextStep, goToPreviousStep, exitGuidedMode]);

  if (!isGuidedMode || !currentStep) return null;

  const categoryStyle = CATEGORY_COLORS[currentStep.category] || CATEGORY_COLORS.intro;

  return (
    <>
      {/* Barre de navigation fixe */}
      <motion.div
        ref={containerRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-[60] bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x, opacity }}
      >
        {/* Barre de progression */}
        <div className="h-0.5 sm:h-1 bg-muted">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>

        {/* Contenu de la barre */}
        <div className="container py-1.5 sm:py-2 md:py-3">
          <div className="flex items-center justify-between gap-1 sm:gap-2 md:gap-4">
            {/* Bouton menu mobile + Précédent */}
            <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2">
              {/* Menu des étapes (mobile) */}
              <Sheet open={isMenuOpen} onOpenChange={(open) => open ? toggleMenu() : closeMenu()}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden h-7 w-7 sm:h-8 sm:w-8"
                    aria-label="Menu des étapes"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
                  <SheetHeader className="p-3 sm:p-4 border-b">
                    <SheetTitle className="text-left flex items-center gap-2 text-sm sm:text-base">
                      {TOUR_ICONS[currentTourConfig.id]}
                      {currentTourConfig.shortName}
                    </SheetTitle>
                  </SheetHeader>
                  <GuidedStepsList />
                </SheetContent>
              </Sheet>

              {/* Bouton Précédent */}
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPreviousStep}
                disabled={!canGoPrevious}
                className="gap-0.5 sm:gap-1 h-7 sm:h-8 px-1.5 sm:px-2 md:px-3 text-xs sm:text-sm"
              >
                <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline sm:inline">Préc.</span>
                <span className="hidden md:inline">édent</span>
              </Button>
            </div>

            {/* Info étape actuelle - Version mobile compacte */}
            <div className="flex-1 min-w-0 text-center px-1">
              {/* Desktop: affichage complet */}
              <div className="hidden sm:flex items-center justify-center gap-2">
                {/* Bouton pour changer de parcours */}
                <button
                  onClick={openTourSelector}
                  className={cn(
                    "hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors hover:opacity-80",
                    TOUR_COLORS[currentTourConfig.id]
                  )}
                >
                  {TOUR_ICONS[currentTourConfig.id]}
                  <span className="hidden lg:inline">{currentTourConfig.shortName}</span>
                </button>
                <span className={cn(
                  "hidden md:inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
                  categoryStyle.bg,
                  categoryStyle.text
                )}>
                  {currentStep.section ? `S${currentStep.section}` : CATEGORY_LABELS[currentStep.category]}
                </span>
                <span className="text-xs md:text-sm text-muted-foreground">
                  {currentStepIndex + 1}/{steps.length}
                </span>
                {currentStep.duration && (
                  <span className="hidden lg:flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {currentStep.duration}
                  </span>
                )}
              </div>
              
              {/* Mobile: affichage ultra-compact */}
              <div className="sm:hidden flex items-center justify-center gap-1.5">
                <span className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px] font-medium",
                  categoryStyle.bg,
                  categoryStyle.text
                )}>
                  {currentStepIndex + 1}/{steps.length}
                </span>
              </div>
              
              {/* Titre de l'étape */}
              <h2 className="text-xs sm:text-sm md:text-base font-medium truncate leading-tight">
                <span className="hidden sm:inline">{currentStep.icon} </span>
                {currentStep.shortTitle}
              </h2>
            </div>

            {/* Bouton Suivant + Quitter */}
            <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2">
              {/* Bouton Suivant */}
              <Button
                variant={canGoNext ? "default" : "secondary"}
                size="sm"
                onClick={goToNextStep}
                disabled={!canGoNext}
                className="gap-0.5 sm:gap-1 h-7 sm:h-8 px-1.5 sm:px-2 md:px-3 text-xs sm:text-sm"
              >
                <span className="hidden xs:inline sm:inline">
                  {canGoNext ? 'Suiv.' : 'Fin'}
                </span>
                <span className="hidden md:inline">
                  {canGoNext ? 'ant' : ''}
                </span>
                {canGoNext ? (
                  <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                )}
              </Button>

              {/* Bouton Quitter */}
              <Button
                variant="ghost"
                size="icon"
                onClick={exitGuidedMode}
                className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-foreground"
                aria-label="Quitter le mode guidé"
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Indicateur de swipe sur mobile - plus discret */}
        <div className="sm:hidden absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full pt-0.5">
          <div className="flex items-center gap-0.5 text-[9px] text-muted-foreground/40">
            <ChevronLeft className="h-2.5 w-2.5" />
            <span>swipe</span>
            <ChevronRight className="h-2.5 w-2.5" />
          </div>
        </div>
      </motion.div>

      {/* Spacer pour éviter que le contenu soit caché sous la barre */}
      <div className="h-[44px] sm:h-[52px] md:h-[60px]" />
      
      {/* Sélecteur de parcours */}
      <TourSelector />
    </>
  );
}

/**
 * Liste des étapes dans le drawer mobile
 */
function GuidedStepsList() {
  const { steps, currentStepIndex, goToStep, openTourSelector, currentTourConfig, closeMenu } = useGuidedNavigation();

  // Grouper les étapes par section (si disponible) ou par catégorie
  const groupedSteps = steps.reduce((acc, step, index) => {
    const key = step.section ? `section-${step.section}` : step.category;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push({ ...step, originalIndex: index });
    return acc;
  }, {} as Record<string, (GuidedStep & { originalIndex: number })[]>);

  const handleStepClick = (index: number) => {
    goToStep(index);
    closeMenu();
  };

  return (
    <div className="p-2 sm:p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-80px)]">
      {/* Bouton pour changer de parcours */}
      <button
        onClick={openTourSelector}
        className={cn(
          "w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border transition-colors",
          TOUR_COLORS[currentTourConfig.id]
        )}
      >
        <div className="shrink-0">{TOUR_ICONS[currentTourConfig.id]}</div>
        <div className="flex-1 text-left min-w-0">
          <div className="font-medium text-xs sm:text-sm truncate">{currentTourConfig.name}</div>
          <div className="text-[10px] sm:text-xs opacity-70">{currentTourConfig.duration} • {steps.length} étapes</div>
        </div>
        <ChevronRight className="h-4 w-4 opacity-50 shrink-0" />
      </button>

      {/* Barre de progression globale */}
      <div className="px-1">
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground mb-1">
          <span>Progression</span>
          <span>{currentStepIndex + 1}/{steps.length}</span>
        </div>
        <Progress value={(currentStepIndex / (steps.length - 1)) * 100} className="h-1.5" />
      </div>

      {Object.entries(groupedSteps).map(([key, categorySteps]) => {
        const isSection = key.startsWith('section-');
        const sectionNum = isSection ? key.replace('section-', '') : null;
        const category = isSection ? categorySteps[0].category : key;
        const categoryStyle = CATEGORY_COLORS[category] || CATEGORY_COLORS.intro;
        
        return (
          <div key={key}>
            <h3 className={cn(
              "text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1.5 px-1",
              categoryStyle.text
            )}>
              {isSection ? `Section ${sectionNum}` : CATEGORY_LABELS[category]}
            </h3>
            <div className="space-y-0.5 sm:space-y-1">
              {categorySteps.map((step) => {
                const isActive = step.originalIndex === currentStepIndex;
                const isCompleted = step.originalIndex < currentStepIndex;

                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(step.originalIndex)}
                    className={cn(
                      "w-full flex items-start gap-2 p-2 sm:p-2.5 rounded-lg text-left transition-colors touch-manipulation",
                      isActive 
                        ? cn(categoryStyle.bg, categoryStyle.border, "border") 
                        : "hover:bg-muted/50 active:bg-muted",
                    )}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", categoryStyle.text)} />
                      ) : isActive ? (
                        <MapPin className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", categoryStyle.text)} />
                      ) : (
                        <Circle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground/50" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm sm:text-base">{step.icon}</span>
                        <span className={cn(
                          "font-medium text-xs sm:text-sm leading-tight",
                          isActive ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {step.shortTitle}
                        </span>
                        {step.duration && (
                          <span className="text-[10px] sm:text-xs text-muted-foreground/60 flex items-center gap-0.5">
                            <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            {step.duration}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground/70 mt-0.5 line-clamp-1 sm:line-clamp-2">
                        {step.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Bouton pour démarrer le mode guidé
 */
export function StartGuidedTourButton({ className }: { className?: string }) {
  const { startGuidedMode, isGuidedMode } = useGuidedNavigation();
  const [showSelector, setShowSelector] = useState(false);

  if (isGuidedMode) return null;

  return (
    <>
      <Button
        onClick={() => setShowSelector(true)}
        variant="outline"
        className={cn("gap-1.5 sm:gap-2", className)}
        size="sm"
      >
        <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span className="hidden xs:inline">Visite guidée</span>
        <span className="xs:hidden">Guide</span>
      </Button>
      
      {/* Dialog de sélection du parcours */}
      <Dialog open={showSelector} onOpenChange={setShowSelector}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Choisir un parcours
            </DialogTitle>
            <DialogDescription>
              Sélectionnez le parcours adapté à votre profil.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-2 sm:gap-3 mt-3 sm:mt-4">
            {Object.values(TOUR_CONFIGS).map((tour) => (
              <button
                key={tour.id}
                onClick={() => {
                  setShowSelector(false);
                  startGuidedMode(tour.id);
                }}
                className={cn(
                  "w-full p-3 sm:p-4 rounded-xl border-2 text-left transition-all",
                  "border-border hover:border-primary/50 hover:bg-muted/50 active:bg-muted"
                )}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className={cn(
                    "p-1.5 sm:p-2 rounded-lg shrink-0",
                    TOUR_COLORS[tour.id]
                  )}>
                    {TOUR_ICONS[tour.id]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 sm:mb-1 flex-wrap">
                      <h3 className="font-semibold text-sm sm:text-base">{tour.name}</h3>
                      {tour.id === 'presentation' && (
                        <span className="text-[10px] sm:text-xs bg-amber-500/10 text-amber-600 px-1.5 sm:px-2 py-0.5 rounded-full">
                          Recommandé
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2 line-clamp-2">
                      {tour.description}
                    </p>
                    <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {tour.duration}
                      </span>
                      <span>{tour.steps.length} étapes</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Widget flottant pour le mode guidé (desktop + version mobile)
 */
export function GuidedNavigationWidget() {
  const {
    isGuidedMode,
    currentStep,
    currentStepIndex,
    steps,
    progress,
    goToStep,
    currentTourConfig,
    toggleMenu,
  } = useGuidedNavigation();

  const [isExpanded, setIsExpanded] = useState(false);

  if (!isGuidedMode || !currentStep) return null;

  return (
    <>
      {/* Widget desktop - côté droit */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        className="hidden lg:block fixed right-4 top-1/2 -translate-y-1/2 z-50"
      >
        <div
          className={cn(
            "bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-lg transition-all duration-300",
            isExpanded ? "w-72" : "w-12"
          )}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          {/* Version compacte */}
          {!isExpanded && (
            <div className="p-2 space-y-1">
              {steps.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                const categoryStyle = CATEGORY_COLORS[step.category];

                return (
                  <button
                    key={step.id}
                    onClick={() => goToStep(index)}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all",
                      isActive 
                        ? cn(categoryStyle.bg, categoryStyle.text, "ring-2 ring-offset-2", categoryStyle.border.replace('border-', 'ring-'))
                        : isCompleted
                          ? cn(categoryStyle.bg, categoryStyle.text, "opacity-60")
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                    title={step.title}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </button>
                );
              })}
            </div>
          )}

          {/* Version étendue */}
          {isExpanded && (
            <div className="p-3 space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <div className={cn("p-1.5 rounded-lg", TOUR_COLORS[currentTourConfig.id])}>
                  {TOUR_ICONS[currentTourConfig.id]}
                </div>
                <div className="flex-1">
                  <span className="text-xs font-medium">{currentTourConfig.shortName}</span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{Math.round(progress)}%</span>
                    <span>•</span>
                    <span>{currentTourConfig.duration}</span>
                  </div>
                </div>
              </div>
              <Progress value={progress} className="h-1.5 mb-3" />
              
              <div className="space-y-1 max-h-[300px] overflow-y-auto">
                {steps.map((step, index) => {
                  const isActive = index === currentStepIndex;
                  const isCompleted = index < currentStepIndex;
                  const categoryStyle = CATEGORY_COLORS[step.category];

                  return (
                    <button
                      key={step.id}
                      onClick={() => goToStep(index)}
                      className={cn(
                        "w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-colors",
                        isActive 
                          ? cn(categoryStyle.bg, "border", categoryStyle.border)
                          : "hover:bg-muted/50"
                      )}
                    >
                      <span className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium",
                        isActive || isCompleted
                          ? cn(categoryStyle.bg, categoryStyle.text)
                          : "bg-muted text-muted-foreground"
                      )}>
                        {isCompleted ? '✓' : index + 1}
                      </span>
                      <span className={cn(
                        "flex-1 truncate",
                        isActive ? "font-medium" : "text-muted-foreground"
                      )}>
                        {step.shortTitle}
                      </span>
                      {step.duration && (
                        <span className="text-muted-foreground/50">{step.duration}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Bouton flottant mobile - accès rapide au menu */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        onClick={toggleMenu}
        className={cn(
          "lg:hidden fixed right-3 bottom-20 z-50",
          "w-12 h-12 rounded-full shadow-lg",
          "flex items-center justify-center",
          "bg-primary text-primary-foreground",
          "active:scale-95 transition-transform touch-manipulation"
        )}
        aria-label="Voir toutes les étapes"
      >
        <div className="relative">
          <List className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-background text-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
            {currentStepIndex + 1}
          </span>
        </div>
      </motion.button>
    </>
  );
}

/**
 * Overlay de fin de parcours
 */
export function GuidedTourComplete() {
  const { isGuidedMode, currentStepIndex, steps, exitGuidedMode, startGuidedMode, currentTourConfig, openTourSelector } = useGuidedNavigation();
  const isComplete = isGuidedMode && currentStepIndex === steps.length - 1;
  const [showComplete, setShowComplete] = useState(false);

  // Afficher l'overlay après un délai quand on atteint la dernière étape
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => setShowComplete(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowComplete(false);
    }
  }, [isComplete]);

  if (!showComplete) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
        onClick={exitGuidedMode}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-8 max-w-md w-full text-center shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-1.5 sm:mb-2">
            {currentTourConfig.id === 'presentation' ? 'Présentation terminée !' : 'Visite terminée !'}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
            {currentTourConfig.id === 'presentation' 
              ? 'Vous avez parcouru les 7 sections de la présentation PERFUMUM.'
              : `Vous avez découvert PERFUMUM via le parcours ${currentTourConfig.name}.`
            }
          </p>
          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 justify-center">
              <Button variant="outline" onClick={exitGuidedMode} className="text-sm">
                Explorer librement
              </Button>
              <Button variant="outline" onClick={() => {
                setShowComplete(false);
                openTourSelector();
              }} className="text-sm">
                Autre parcours
              </Button>
            </div>
            <Button onClick={() => {
              setShowComplete(false);
              startGuidedMode(currentTourConfig.id);
            }} className="text-sm">
              <Play className="h-4 w-4 mr-2" />
              Recommencer
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
