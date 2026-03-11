import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  threshold?: number;
  className?: string;
}

/**
 * Composant d'image avec lazy loading et placeholder
 * Utilise IntersectionObserver pour charger l'image uniquement quand elle est visible
 * 
 * @param src - URL de l'image
 * @param alt - Texte alternatif (obligatoire pour l'accessibilité)
 * @param placeholder - URL d'une image placeholder (optionnel)
 * @param threshold - Seuil de visibilité pour déclencher le chargement (0-1)
 * 
 * @example
 * <LazyImage 
 *   src="/images/molecule.jpg" 
 *   alt="Molécule de géosmine"
 *   placeholder="/images/placeholder.jpg"
 *   className="w-full h-64 object-cover"
 * />
 */
export function LazyImage({
  src,
  alt,
  placeholder,
  threshold = 0.1,
  className,
  ...props
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState<string | undefined>(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        });
      },
      {
        threshold,
        rootMargin: '50px', // Commence à charger 50px avant d'être visible
      }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [src, threshold]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setIsError(true);
    setIsLoaded(true);
  };

  return (
    <div className={cn('relative overflow-hidden bg-muted', className)}>
      {!isLoaded && (
        <div className="absolute inset-0 shimmer" aria-hidden="true" />
      )}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          isError && 'hidden',
          className
        )}
        loading="lazy"
        {...props}
      />
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
          Image non disponible
        </div>
      )}
    </div>
  );
}

/**
 * Composant d'image de fond avec lazy loading
 * Utilise background-image au lieu de <img>
 * 
 * @example
 * <LazyBackgroundImage 
 *   src="/images/hero.jpg"
 *   className="h-96"
 * >
 *   <div className="p-8">Contenu par-dessus</div>
 * </LazyBackgroundImage>
 */
export function LazyBackgroundImage({
  src,
  children,
  className,
  threshold = 0.1,
}: {
  src: string;
  children?: React.ReactNode;
  className?: string;
  threshold?: number;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string>('none');
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!divRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Précharger l'image
            const img = new Image();
            img.src = src;
            img.onload = () => {
              setBackgroundImage(`url(${src})`);
              setIsLoaded(true);
            };
            observer.disconnect();
          }
        });
      },
      {
        threshold,
        rootMargin: '50px',
      }
    );

    observer.observe(divRef.current);

    return () => {
      observer.disconnect();
    };
  }, [src, threshold]);

  return (
    <div
      ref={divRef}
      className={cn(
        'relative bg-muted transition-all duration-500',
        isLoaded ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 shimmer" aria-hidden="true" />
      )}
      {children}
    </div>
  );
}
