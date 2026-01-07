import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { SmartLink, EntityType } from "./SmartLink";

interface SmartTextProps {
  /** Texte à analyser et enrichir */
  text: string;
  /** Classes CSS additionnelles */
  className?: string;
  /** Désactiver les tooltips sur les liens */
  disableTooltips?: boolean;
  /** Types d'entités à détecter (par défaut: toutes) */
  detectTypes?: EntityType[];
}

interface DetectedEntity {
  type: EntityType;
  id: number;
  name: string;
  start: number;
  end: number;
}

/**
 * Composant qui analyse un texte et transforme automatiquement
 * les noms de molécules, plantes, etc. en liens cliquables avec tooltips.
 */
export function SmartText({ 
  text, 
  className,
  disableTooltips = false,
  detectTypes = ["molecule", "plant"]
}: SmartTextProps) {
  // Récupérer les listes d'entités pour la détection
  const { data: molecules } = trpc.molecules.list.useQuery(undefined, {
    enabled: detectTypes.includes("molecule"),
  });
  const { data: plants } = trpc.plants.list.useQuery(undefined, {
    enabled: detectTypes.includes("plant"),
  });
  
  // Construire un dictionnaire de termes à détecter
  const entityDictionary = useMemo(() => {
    const dict: Map<string, { type: EntityType; id: number; name: string }> = new Map();
    
    // Ajouter les molécules
    if (molecules && detectTypes.includes("molecule")) {
      molecules.forEach(mol => {
        // Nom principal
        if (mol.name && mol.name.length > 2) {
          dict.set(mol.name.toLowerCase(), { type: "molecule", id: mol.id, name: mol.name });
        }
      });
    }
    
    // Ajouter les plantes
    if (plants && detectTypes.includes("plant")) {
      plants.forEach(plant => {
        // Nom commun
        if (plant.name && plant.name.length > 2) {
          dict.set(plant.name.toLowerCase(), { type: "plant", id: plant.id, name: plant.name });
        }
        // Nom latin
        if (plant.latinName && plant.latinName.length > 2) {
          dict.set(plant.latinName.toLowerCase(), { type: "plant", id: plant.id, name: plant.latinName });
        }
      });
    }
    
    return dict;
  }, [molecules, plants, detectTypes]);
  
  // Détecter les entités dans le texte
  const detectedEntities = useMemo(() => {
    if (entityDictionary.size === 0) return [];
    
    const entities: DetectedEntity[] = [];
    const textLower = text.toLowerCase();
    
    // Trier les termes par longueur décroissante pour matcher les plus longs d'abord
    const sortedTerms = Array.from(entityDictionary.entries())
      .sort((a, b) => b[0].length - a[0].length);
    
    // Ensemble pour suivre les positions déjà matchées
    const matchedPositions = new Set<number>();
    
    for (const [term, entity] of sortedTerms) {
      let searchStart = 0;
      let index: number;
      
      while ((index = textLower.indexOf(term, searchStart)) !== -1) {
        // Vérifier que c'est un mot complet (pas au milieu d'un autre mot)
        const charBefore = index > 0 ? textLower[index - 1] : " ";
        const charAfter = index + term.length < textLower.length ? textLower[index + term.length] : " ";
        
        const isWordBoundaryBefore = /[\s,.:;!?()[\]{}'"<>-]/.test(charBefore);
        const isWordBoundaryAfter = /[\s,.:;!?()[\]{}'"<>-]/.test(charAfter);
        
        // Vérifier que cette position n'est pas déjà matchée
        let isOverlapping = false;
        for (let i = index; i < index + term.length; i++) {
          if (matchedPositions.has(i)) {
            isOverlapping = true;
            break;
          }
        }
        
        if (isWordBoundaryBefore && isWordBoundaryAfter && !isOverlapping) {
          entities.push({
            type: entity.type,
            id: entity.id,
            name: entity.name,
            start: index,
            end: index + term.length,
          });
          
          // Marquer les positions comme matchées
          for (let i = index; i < index + term.length; i++) {
            matchedPositions.add(i);
          }
        }
        
        searchStart = index + 1;
      }
    }
    
    // Trier par position de début
    return entities.sort((a, b) => a.start - b.start);
  }, [text, entityDictionary]);
  
  // Construire le rendu avec les liens
  const renderedContent = useMemo(() => {
    if (detectedEntities.length === 0) {
      return <span className={className}>{text}</span>;
    }
    
    const parts: React.ReactNode[] = [];
    let lastEnd = 0;
    
    detectedEntities.forEach((entity, index) => {
      // Ajouter le texte avant l'entité
      if (entity.start > lastEnd) {
        parts.push(
          <span key={`text-${index}`}>
            {text.slice(lastEnd, entity.start)}
          </span>
        );
      }
      
      // Ajouter le lien vers l'entité
      const originalText = text.slice(entity.start, entity.end);
      parts.push(
        <SmartLink
          key={`entity-${index}`}
          type={entity.type}
          id={entity.id}
          disableTooltip={disableTooltips}
        >
          {originalText}
        </SmartLink>
      );
      
      lastEnd = entity.end;
    });
    
    // Ajouter le texte restant
    if (lastEnd < text.length) {
      parts.push(
        <span key="text-final">
          {text.slice(lastEnd)}
        </span>
      );
    }
    
    return <span className={className}>{parts}</span>;
  }, [text, detectedEntities, className, disableTooltips]);
  
  return renderedContent;
}

/**
 * Hook pour utiliser la détection d'entités de manière programmatique
 */
export function useEntityDetection(text: string, detectTypes: EntityType[] = ["molecule", "plant"]) {
  const { data: molecules } = trpc.molecules.list.useQuery(undefined, {
    enabled: detectTypes.includes("molecule"),
  });
  const { data: plants } = trpc.plants.list.useQuery(undefined, {
    enabled: detectTypes.includes("plant"),
  });
  
  return useMemo(() => {
    const entities: { type: EntityType; id: number; name: string; count: number }[] = [];
    const textLower = text.toLowerCase();
    
    // Détecter les molécules
    if (molecules && detectTypes.includes("molecule")) {
      molecules.forEach(mol => {
        if (mol.name && textLower.includes(mol.name.toLowerCase())) {
          entities.push({ type: "molecule", id: mol.id, name: mol.name, count: 1 });
        }
      });
    }
    
    // Détecter les plantes
    if (plants && detectTypes.includes("plant")) {
      plants.forEach(plant => {
        if (plant.name && textLower.includes(plant.name.toLowerCase())) {
          entities.push({ type: "plant", id: plant.id, name: plant.name, count: 1 });
        }
        if (plant.latinName && textLower.includes(plant.latinName.toLowerCase())) {
          const existing = entities.find(e => e.type === "plant" && e.id === plant.id);
          if (!existing) {
            entities.push({ type: "plant", id: plant.id, name: plant.latinName, count: 1 });
          }
        }
      });
    }
    
    return entities;
  }, [text, molecules, plants, detectTypes]);
}
