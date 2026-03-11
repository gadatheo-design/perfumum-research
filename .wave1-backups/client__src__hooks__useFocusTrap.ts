// @ts-nocheck
import { useEffect, useRef } from 'react';

/**
 * Hook pour gérer le focus trap (piège de focus) dans les modales/dialogs
 * Empêche le focus de sortir du conteneur et améliore l'accessibilité
 * 
 * @param enabled - Active/désactive le focus trap
 * @returns ref à attacher à l'élément conteneur (modale, dialog, etc.)
 * 
 * @example
 * const trapRef = useFocusTrap(isOpen);
 * return (
 *   <Dialog ref={trapRef} open={isOpen}>
 *     <DialogContent>...</DialogContent>
 *   </Dialog>
 * );
 */
export function useFocusTrap(enabled: boolean = true) {
  const containerRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    // Sauvegarder l'élément actuellement focusé
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Trouver tous les éléments focusables
    const getFocusableElements = () => {
      return container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (focusableElements.length === 0) return;

      if (event.shiftKey) {
        // Shift + Tab (navigation arrière)
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab (navigation avant)
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus le premier élément au montage
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0]?.focus();
    }

    container.addEventListener('keydown', handleKeyDown);

    // Restaurer le focus à la fermeture
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      previousActiveElement.current?.focus();
    };
  }, [enabled]);

  return containerRef;
}
