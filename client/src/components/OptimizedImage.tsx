import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  aspectRatio?: "square" | "video" | "portrait" | "landscape";
  lazy?: boolean;
  blur?: boolean;
  className?: string;
}

/**
 * Composant OptimizedImage avec lazy loading et placeholder
 * Améliore les performances en chargeant les images uniquement quand elles sont visibles
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallback = "/placeholder-image.svg",
  aspectRatio,
  lazy = true,
  blur = true,
  className,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!lazy) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "50px", // Commence à charger 50px avant que l'image soit visible
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [lazy]);

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
  };

  const containerClasses = cn(
    "relative overflow-hidden bg-gray-100 dark:bg-gray-800",
    aspectRatio && aspectRatioClasses[aspectRatio],
    className
  );

  const imageClasses = cn(
    "w-full h-full object-cover transition-all duration-300",
    isLoaded ? "opacity-100" : "opacity-0",
    blur && !isLoaded && "blur-sm scale-105"
  );

  return (
    <div ref={imgRef} className={containerClasses}>
      {/* Placeholder pendant le chargement */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 w-full h-full" />
        </div>
      )}

      {/* Image principale */}
      {isInView && (
        <img
          src={hasError ? fallback : src}
          alt={alt}
          className={imageClasses}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          loading={lazy ? "lazy" : "eager"}
          {...props}
        />
      )}
    </div>
  );
};

/**
 * Composant pour les images de fond optimisées
 */
export const OptimizedBackgroundImage: React.FC<{
  src: string;
  children: React.ReactNode;
  overlay?: boolean;
  className?: string;
}> = ({ src, children, overlay = true, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Background image */}
      <div
        className={cn(
          "absolute inset-0 bg-cover bg-center transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        style={{ backgroundImage: `url(${src})` }}
      >
        <img
          src={src}
          alt=""
          className="hidden"
          onLoad={() => setIsLoaded(true)}
        />
      </div>

      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default OptimizedImage;
