// @ts-nocheck
/**
 * Composant "Skip to content" pour l'accessibilité
 * Permet aux utilisateurs de clavier de sauter directement au contenu principal
 * Invisible par défaut, visible au focus
 * 
 * @example
 * // Dans App.tsx ou Layout
 * <SkipToContent />
 * <Header />
 * <main id="main-content">...</main>
 */
export function SkipToContent() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      className="
        sr-only focus:not-sr-only
        fixed top-4 left-4 z-[100]
        bg-primary text-primary-foreground
        px-4 py-2 rounded-md
        font-medium text-sm
        focus:ring-4 focus:ring-primary/30
        transition-all duration-200
      "
    >
      Aller au contenu principal
    </a>
  );
}

/**
 * Composant pour annoncer les changements dynamiques aux lecteurs d'écran
 * Utilise aria-live pour notifier les utilisateurs de lecteurs d'écran
 * 
 * @example
 * const [message, setMessage] = useState('');
 * // Quand une action se produit:
 * setMessage('5 résultats trouvés');
 * <LiveRegion message={message} />
 */
export function LiveRegion({ 
  message, 
  politeness = 'polite' 
}: { 
  message: string;
  politeness?: 'polite' | 'assertive';
}) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}
