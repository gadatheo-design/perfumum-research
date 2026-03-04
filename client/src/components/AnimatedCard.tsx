// @ts-nocheck
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { forwardRef } from 'react';

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  hover?: 'lift' | 'glow' | 'brutal' | 'none';
  reveal?: boolean;
  delay?: number;
}

/**
 * Carte avec animations et micro-interactions enrichies
 * 
 * @param hover - Type d'effet au survol ('lift', 'glow', 'brutal', 'none')
 * @param reveal - Active l'animation reveal on scroll
 * @param delay - Délai d'animation en secondes (pour les animations séquentielles)
 * 
 * @example
 * <AnimatedCard 
 *   title="Molécule" 
 *   description="Description"
 *   hover="lift"
 *   reveal
 *   delay={0.1}
 * >
 *   <p>Contenu</p>
 * </AnimatedCard>
 */
export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ 
    title, 
    description, 
    children, 
    className,
    hover = 'lift',
    reveal = false,
    delay = 0,
    ...props 
  }, ref) => {
    const hoverClasses = {
      lift: 'hover-lift',
      glow: 'hover:shadow-2xl hover:shadow-primary/20',
      brutal: 'brutal-border',
      none: '',
    };

    return (
      <Card
        ref={ref}
        className={cn(
          'transition-all duration-300',
          hover !== 'none' && hoverClasses[hover],
          reveal && 'reveal',
          className
        )}
        style={delay > 0 ? { animationDelay: `${delay}s` } : undefined}
        {...props}
      >
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        {children && <CardContent>{children}</CardContent>}
      </Card>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';
