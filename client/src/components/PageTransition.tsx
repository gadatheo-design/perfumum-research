import { useEffect, useState, useRef } from 'react';
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

/**
 * FadeIn - Composant simple pour faire apparaître un élément en fondu
 */
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({ 
  children, 
  delay = 0, 
  duration = 300, 
  className 
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <div
      className={cn(
        "transition-opacity ease-out",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

/**
 * SlideIn - Composant pour faire glisser un élément depuis une direction
 */
interface SlideInProps {
  children: React.ReactNode;
  direction?: "left" | "right" | "top" | "bottom";
  delay?: number;
  duration?: number;
  className?: string;
}

export function SlideIn({ 
  children, 
  direction = "bottom", 
  delay = 0, 
  duration = 300,
  className 
}: SlideInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  const directionClasses = {
    left: isVisible ? "translate-x-0" : "-translate-x-4",
    right: isVisible ? "translate-x-0" : "translate-x-4",
    top: isVisible ? "translate-y-0" : "-translate-y-4",
    bottom: isVisible ? "translate-y-0" : "translate-y-4",
  };

  return (
    <div
      className={cn(
        "transition-all ease-out",
        isVisible ? "opacity-100" : "opacity-0",
        directionClasses[direction],
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

/**
 * StaggeredList - Composant pour animer une liste d'éléments avec un délai progressif
 */
interface StaggeredListProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  initialDelay?: number;
  className?: string;
  itemClassName?: string;
}

export function StaggeredList({ 
  children, 
  staggerDelay = 50, 
  initialDelay = 0,
  className,
  itemClassName
}: StaggeredListProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <SlideIn 
          key={index} 
          delay={initialDelay + index * staggerDelay}
          className={itemClassName}
        >
          {child}
        </SlideIn>
      ))}
    </div>
  );
}

/**
 * ScaleIn - Composant pour faire apparaître un élément avec un effet de zoom
 */
interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function ScaleIn({ 
  children, 
  delay = 0, 
  duration = 300,
  className 
}: ScaleInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <div
      className={cn(
        "transition-all ease-out",
        isVisible 
          ? "opacity-100 scale-100" 
          : "opacity-0 scale-95",
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

/**
 * RevealOnScroll - Composant qui révèle son contenu lorsqu'il entre dans le viewport
 */
interface RevealOnScrollProps {
  children: React.ReactNode;
  threshold?: number;
  className?: string;
}

export function RevealOnScroll({ 
  children, 
  threshold = 0.1,
  className 
}: RevealOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-500 ease-out",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-8",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * ShimmerSkeleton - Skeleton avec animation shimmer
 */
interface ShimmerSkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function ShimmerSkeleton({ 
  className, 
  width, 
  height 
}: ShimmerSkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted",
        className
      )}
      style={{ width, height }}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
