import { useEffect, useState, useRef, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { trackPageView } from '@/lib/analytics';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

// Variants pour les transitions de page avec Framer Motion
const pageVariants = {
  initial: {
    opacity: 0,
    y: 12,
    scale: 0.995,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.995,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
};

// Variants subtils (fade uniquement)
const subtleVariants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: "easeOut" as const,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: "easeIn" as const,
    },
  },
};

/**
 * Composant de transition de page avec animation Framer Motion
 * Enveloppe le contenu de la page pour des transitions fluides
 * 
 * @example
 * <PageTransition>
 *   <YourPageContent />
 * </PageTransition>
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  const [location] = useLocation();

  // Track page view on route change
  useEffect(() => {
    trackPageView(location);
  }, [location]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
        className={cn("min-h-screen", className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Version subtile de la transition (fade uniquement)
 */
export function SubtlePageTransition({ children, className }: PageTransitionProps) {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={subtleVariants}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
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
  duration = 0.3, 
  className 
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
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
  duration = 0.35,
  className 
}: SlideInProps) {
  const directionOffset = {
    left: { x: -20, y: 0 },
    right: { x: 20, y: 0 },
    top: { x: 0, y: -20 },
    bottom: { x: 0, y: 20 },
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directionOffset[direction] 
      }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      transition={{ 
        delay, 
        duration, 
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
      }}
      className={className}
    >
      {children}
    </motion.div>
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
  staggerDelay = 0.05, 
  initialDelay = 0,
  className,
  itemClassName
}: StaggeredListProps) {
  return (
    <motion.div 
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: initialDelay,
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children.map((child, index) => (
        <motion.div 
          key={index}
          className={itemClassName}
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
              },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
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
  duration = 0.35,
  className 
}: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay, 
        duration, 
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
      }}
      className={className}
    >
      {children}
    </motion.div>
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: threshold }}
      transition={{ 
        duration: 0.5, 
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * FadeInSection - Animation de fondu pour les sections avec viewport detection
 */
export function FadeInSection({ 
  children, 
  className = "", 
  delay = 0 
}: { 
  children: ReactNode; 
  className?: string; 
  delay?: number 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * HoverScale - Animation de zoom au survol
 */
export function HoverScale({ 
  children, 
  className = "", 
  scale = 1.02 
}: { 
  children: ReactNode; 
  className?: string; 
  scale?: number 
}) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggeredContent - Conteneur pour animer les éléments enfants avec un délai progressif
 */
export function StaggeredContent({ 
  children, 
  className = "" 
}: { 
  children: ReactNode; 
  className?: string 
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggeredItem - Élément enfant animé pour StaggeredContent
 */
export function StaggeredItem({ 
  children, 
  className = "" 
}: { 
  children: ReactNode; 
  className?: string 
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
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

/**
 * AnimatedCard - Carte avec animation au survol
 */
export function AnimatedCard({ 
  children, 
  className = "",
  hoverScale = 1.02,
  hoverY = -4,
}: { 
  children: ReactNode; 
  className?: string;
  hoverScale?: number;
  hoverY?: number;
}) {
  return (
    <motion.div
      whileHover={{ 
        scale: hoverScale, 
        y: hoverY,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * PulseOnHover - Animation de pulsation au survol
 */
export function PulseOnHover({ 
  children, 
  className = "" 
}: { 
  children: ReactNode; 
  className?: string 
}) {
  return (
    <motion.div
      whileHover={{ 
        scale: [1, 1.02, 1],
        transition: { 
          duration: 0.3,
          times: [0, 0.5, 1],
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;
