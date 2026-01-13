import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useGuidedNavigation, GuidedStep } from '@/contexts/GuidedNavigationContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Menu, 
  Play, 
  CheckCircle2,
  Circle,
  MapPin
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
        <div className="h-1 bg-muted">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>

        {/* Contenu de la barre */}
        <div className="container py-2 md:py-3">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            {/* Bouton menu mobile + Précédent */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Menu des étapes (mobile) */}
              <Sheet open={isMenuOpen} onOpenChange={(open) => open ? toggleMenu() : closeMenu()}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden h-8 w-8"
                    aria-label="Menu des étapes"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                  <SheetHeader>
                    <SheetTitle className="text-left">Parcours guidé</SheetTitle>
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
                className="gap-1 h-8 px-2 md:px-3"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Précédent</span>
              </Button>
            </div>

            {/* Info étape actuelle */}
            <div className="flex-1 min-w-0 text-center">
              <div className="flex items-center justify-center gap-2">
                <span className={cn(
                  "hidden md:inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
                  categoryStyle.bg,
                  categoryStyle.text
                )}>
                  {CATEGORY_LABELS[currentStep.category]}
                </span>
                <span className="text-xs md:text-sm text-muted-foreground">
                  {currentStepIndex + 1}/{steps.length}
                </span>
              </div>
              <h2 className="text-sm md:text-base font-medium truncate">
                {currentStep.icon} {currentStep.shortTitle}
              </h2>
            </div>

            {/* Bouton Suivant + Quitter */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Bouton Suivant */}
              <Button
                variant={canGoNext ? "default" : "secondary"}
                size="sm"
                onClick={goToNextStep}
                disabled={!canGoNext}
                className="gap-1 h-8 px-2 md:px-3"
              >
                <span className="hidden sm:inline">
                  {canGoNext ? 'Suivant' : 'Fin'}
                </span>
                {canGoNext ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
              </Button>

              {/* Bouton Quitter */}
              <Button
                variant="ghost"
                size="icon"
                onClick={exitGuidedMode}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                aria-label="Quitter le mode guidé"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Indicateur de swipe sur mobile */}
        <div className="md:hidden absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full pt-1">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
            <ChevronLeft className="h-3 w-3" />
            <span>Glissez pour naviguer</span>
            <ChevronRight className="h-3 w-3" />
          </div>
        </div>
      </motion.div>

      {/* Spacer pour éviter que le contenu soit caché sous la barre */}
      <div className="h-[60px] md:h-[68px]" />
    </>
  );
}

/**
 * Liste des étapes dans le drawer mobile
 */
function GuidedStepsList() {
  const { steps, currentStepIndex, goToStep } = useGuidedNavigation();

  // Grouper les étapes par catégorie
  const groupedSteps = steps.reduce((acc, step, index) => {
    if (!acc[step.category]) {
      acc[step.category] = [];
    }
    acc[step.category].push({ ...step, originalIndex: index });
    return acc;
  }, {} as Record<string, (GuidedStep & { originalIndex: number })[]>);

  return (
    <div className="mt-4 space-y-4 overflow-y-auto max-h-[calc(100vh-120px)]">
      {Object.entries(groupedSteps).map(([category, categorySteps]) => {
        const categoryStyle = CATEGORY_COLORS[category] || CATEGORY_COLORS.intro;
        
        return (
          <div key={category}>
            <h3 className={cn(
              "text-xs font-semibold uppercase tracking-wider mb-2 px-2",
              categoryStyle.text
            )}>
              {CATEGORY_LABELS[category]}
            </h3>
            <div className="space-y-1">
              {categorySteps.map((step) => {
                const isActive = step.originalIndex === currentStepIndex;
                const isCompleted = step.originalIndex < currentStepIndex;

                return (
                  <button
                    key={step.id}
                    onClick={() => goToStep(step.originalIndex)}
                    className={cn(
                      "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors",
                      isActive 
                        ? cn(categoryStyle.bg, categoryStyle.border, "border") 
                        : "hover:bg-muted/50",
                    )}
                  >
                    <div className="mt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className={cn("h-4 w-4", categoryStyle.text)} />
                      ) : isActive ? (
                        <MapPin className={cn("h-4 w-4", categoryStyle.text)} />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground/50" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{step.icon}</span>
                        <span className={cn(
                          "font-medium text-sm",
                          isActive ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {step.shortTitle}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground/70 mt-0.5 line-clamp-2">
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

  if (isGuidedMode) return null;

  return (
    <Button
      onClick={() => startGuidedMode()}
      variant="outline"
      className={cn("gap-2", className)}
    >
      <Play className="h-4 w-4" />
      Visite guidée
    </Button>
  );
}

/**
 * Widget flottant pour le mode guidé (desktop)
 */
export function GuidedNavigationWidget() {
  const {
    isGuidedMode,
    currentStep,
    currentStepIndex,
    steps,
    progress,
    goToStep,
  } = useGuidedNavigation();

  const [isExpanded, setIsExpanded] = useState(false);

  if (!isGuidedMode || !currentStep) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="hidden lg:block fixed right-4 top-1/2 -translate-y-1/2 z-50"
    >
      <div
        className={cn(
          "bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-lg transition-all duration-300",
          isExpanded ? "w-64" : "w-12"
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
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">
                Progression
              </span>
              <span className="text-xs font-bold">
                {Math.round(progress)}%
              </span>
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
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Overlay de fin de parcours
 */
export function GuidedTourComplete() {
  const { isGuidedMode, currentStepIndex, steps, exitGuidedMode, startGuidedMode } = useGuidedNavigation();
  const isComplete = isGuidedMode && currentStepIndex === steps.length - 1;

  if (!isComplete) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={exitGuidedMode}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card border border-border rounded-2xl p-6 md:p-8 max-w-md w-full text-center shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Visite terminée !</h2>
          <p className="text-muted-foreground mb-6">
            Vous avez découvert les principales fonctionnalités de PERFUMUM. 
            N'hésitez pas à explorer librement ou à recommencer la visite.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={exitGuidedMode}>
              Explorer librement
            </Button>
            <Button onClick={() => startGuidedMode()}>
              <Play className="h-4 w-4 mr-2" />
              Recommencer
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
