import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TruncatableTextProps {
  text: string;
  maxLines?: number;
  className?: string;
  expandable?: boolean;
  variant?: "title" | "description" | "body";
}

/**
 * Composant réutilisable pour afficher du texte long avec options de troncature
 * 
 * @param text - Le texte à afficher
 * @param maxLines - Nombre maximum de lignes avant troncature (défaut: 2)
 * @param className - Classes Tailwind additionnelles
 * @param expandable - Permet l'expansion du texte (défaut: true)
 * @param variant - Style du texte: 'title' (gras), 'description' (petit), 'body' (normal)
 */
export const TruncatableText: React.FC<TruncatableTextProps> = ({
  text,
  maxLines = 2,
  className = "",
  expandable = true,
  variant = "body",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Classes de base par variant
  const variantClasses = {
    title: "text-base font-semibold",
    description: "text-xs text-muted-foreground italic",
    body: "text-sm text-foreground",
  };

  const baseClass = variantClasses[variant];
  const lineClampClass = isExpanded ? "" : `line-clamp-${maxLines}`;

  // Détermine si le texte est assez long pour justifier une expansion
  const shouldShowExpandButton = expandable && text && text.length > 100;

  return (
    <div className="flex flex-col gap-2">
      <p className={`${baseClass} ${lineClampClass} break-words ${className}`}>
        {text}
      </p>
      
      {shouldShowExpandButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-fit h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
        >
          <span>{isExpanded ? "Afficher moins" : "Afficher plus"}</span>
          <ChevronDown
            className={`w-3 h-3 ml-1 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </Button>
      )}
    </div>
  );
};

/**
 * Variante pour les titres de cartes
 */
export const TruncatableTitle: React.FC<Omit<TruncatableTextProps, "variant">> = (
  props
) => <TruncatableText {...props} variant="title" maxLines={2} />;

/**
 * Variante pour les descriptions
 */
export const TruncatableDescription: React.FC<Omit<TruncatableTextProps, "variant">> = (
  props
) => <TruncatableText {...props} variant="description" maxLines={1} />;

/**
 * Variante pour le corps de texte
 */
export const TruncatableBody: React.FC<Omit<TruncatableTextProps, "variant">> = (
  props
) => <TruncatableText {...props} variant="body" maxLines={3} />;
