import { useEffect, useRef } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook pour activer les animations "reveal" au scroll
 * Ajoute automatiquement la classe "active" aux éléments avec la classe "reveal"
 * 
 * @param options - Options de l'IntersectionObserver
 * @returns ref à attacher à l'élément parent
 * 
 * @example
 * const containerRef = useScrollReveal({ threshold: 0.1, triggerOnce: true });
 * return <div ref={containerRef}><div className="reveal">Content</div></div>
 */
export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
  } = options;

  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const elements = containerRef.current?.querySelectorAll('.reveal');
    if (!elements || elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            entry.target.classList.remove('active');
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [threshold, rootMargin, triggerOnce]);

  return containerRef;
}
