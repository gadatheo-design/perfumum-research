import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Composant de transition de page avec animation fade + slide
 * Enveloppe le contenu de chaque page pour des transitions fluides
 * 
 * @example
 * <PageTransition>
 *   <YourPageContent />
 * </PageTransition>
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  const [location] = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState<'fadeIn' | 'fadeOut'>('fadeIn');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fadeOut');
    }
  }, [location, displayLocation]);

  const handleAnimationEnd = () => {
    if (transitionStage === 'fadeOut') {
      setDisplayLocation(location);
      setTransitionStage('fadeIn');
    }
  };

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-in-out',
        transitionStage === 'fadeIn' && 'animate-fadeInUp opacity-100',
        transitionStage === 'fadeOut' && 'opacity-0 translate-y-4',
        className
      )}
      onAnimationEnd={handleAnimationEnd}
      onTransitionEnd={handleAnimationEnd}
    >
      {children}
    </div>
  );
}
