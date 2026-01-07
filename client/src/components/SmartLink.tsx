import { Link } from "wouter";
import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Loader2, Beaker, Leaf, FlaskConical, BookOpen, MapPin, ExternalLink, ArrowRight } from "lucide-react";

// Types d'entités supportées
export type EntityType = "molecule" | "plant" | "recette" | "reference" | "terroir" | "famille";

interface SmartLinkProps {
  /** Type d'entité */
  type: EntityType;
  /** ID de l'entité */
  id: number;
  /** Texte à afficher (optionnel, sinon utilise le nom de l'entité) */
  children?: React.ReactNode;
  /** Classes CSS additionnelles */
  className?: string;
  /** Désactiver le tooltip */
  disableTooltip?: boolean;
}

// Configuration des icônes et couleurs par type
const entityConfig: Record<EntityType, { 
  icon: React.ReactNode; 
  color: string; 
  bgColor: string;
  path: (id: number) => string;
  label: string;
}> = {
  molecule: {
    icon: <Beaker className="h-4 w-4" />,
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-950/30",
    path: (id) => `/molecule/${id}`,
    label: "Molécule",
  },
  plant: {
    icon: <Leaf className="h-4 w-4" />,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    path: (id) => `/plants/${id}`,
    label: "Plante",
  },
  recette: {
    icon: <FlaskConical className="h-4 w-4" />,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    path: (id) => `/recette/${id}`,
    label: "Recette",
  },
  reference: {
    icon: <BookOpen className="h-4 w-4" />,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    path: (id) => `/bibliographie/${id}`,
    label: "Référence",
  },
  terroir: {
    icon: <MapPin className="h-4 w-4" />,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    path: (id) => `/terroirs/${id}`,
    label: "Terroir",
  },
  famille: {
    icon: <Beaker className="h-4 w-4" />,
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-50 dark:bg-pink-950/30",
    path: (id) => `/familles?id=${id}`,
    label: "Famille",
  },
};

// Composant de tooltip pour les molécules
function MoleculeTooltip({ id }: { id: number }) {
  const { data: molecule, isLoading } = trpc.molecules.getById.useQuery(id);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Chargement...</span>
      </div>
    );
  }

  if (!molecule) {
    return <div className="p-2 text-sm text-muted-foreground">Molécule non trouvée</div>;
  }

  return (
    <div className="space-y-3">
      <div>
        <h4 className="font-semibold text-base">{molecule.name}</h4>
        {molecule.chemicalFormula && (
          <p className="text-xs font-mono text-muted-foreground">{molecule.chemicalFormula}</p>
        )}
      </div>
      
      <div className="flex flex-wrap gap-1">
        {molecule.family && (
          <Badge variant="secondary" className="text-xs">{molecule.family}</Badge>
        )}
        {molecule.chemicalClass && (
          <Badge variant="outline" className="text-xs">{molecule.chemicalClass}</Badge>
        )}
      </div>
      
      {molecule.olfactiveProfile && (
        <p className="text-xs text-muted-foreground line-clamp-2">{molecule.olfactiveProfile}</p>
      )}
      
      <div className="flex items-center gap-1 text-xs text-primary">
        <span>Voir la fiche complète</span>
        <ArrowRight className="h-3 w-3" />
      </div>
    </div>
  );
}

// Composant de tooltip pour les plantes
function PlantTooltip({ id }: { id: number }) {
  const { data: plant, isLoading } = trpc.plants.getById.useQuery(id);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Chargement...</span>
      </div>
    );
  }

  if (!plant) {
    return <div className="p-2 text-sm text-muted-foreground">Plante non trouvée</div>;
  }

  return (
    <div className="space-y-3">
      <div>
        <h4 className="font-semibold text-base">{plant.name}</h4>
        {plant.latinName && (
          <p className="text-xs italic text-muted-foreground">{plant.latinName}</p>
        )}
      </div>
      
      <div className="flex flex-wrap gap-1">
        {plant.family && (
          <Badge variant="secondary" className="text-xs">{plant.family}</Badge>
        )}
        {plant.category && (
          <Badge variant="outline" className="text-xs capitalize">{plant.category}</Badge>
        )}
        {plant.origin && (
          <Badge variant="outline" className="text-xs">
            <MapPin className="h-3 w-3 mr-1" />
            {plant.origin}
          </Badge>
        )}
      </div>
      
      {plant.olfactiveSignature && (
        <p className="text-xs text-muted-foreground line-clamp-2">{plant.olfactiveSignature}</p>
      )}
      
      <div className="flex items-center gap-1 text-xs text-primary">
        <span>Voir la fiche complète</span>
        <ArrowRight className="h-3 w-3" />
      </div>
    </div>
  );
}

// Composant de tooltip pour les recettes
function RecetteTooltip({ id }: { id: number }) {
  const { data, isLoading } = trpc.recette.getById.useQuery({ id });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Chargement...</span>
      </div>
    );
  }

  if (!data?.recette) {
    return <div className="p-2 text-sm text-muted-foreground">Recette non trouvée</div>;
  }

  const recette = data.recette;

  return (
    <div className="space-y-3">
      <div>
        <h4 className="font-semibold text-base">{recette.name}</h4>
        {recette.category && (
          <p className="text-xs text-muted-foreground capitalize">{recette.category}</p>
        )}
      </div>
      
      <div className="flex flex-wrap gap-1">
        {data.family && (
          <Badge variant="secondary" className="text-xs">{data.family.name}</Badge>
        )}
        {data.molecules && data.molecules.length > 0 && (
          <Badge variant="outline" className="text-xs">
            <Beaker className="h-3 w-3 mr-1" />
            {data.molecules.length} molécules
          </Badge>
        )}
      </div>
      
      {recette.formula && (
        <p className="text-xs text-muted-foreground line-clamp-2">{recette.formula}</p>
      )}
      
      <div className="flex items-center gap-1 text-xs text-primary">
        <span>Voir la fiche complète</span>
        <ArrowRight className="h-3 w-3" />
      </div>
    </div>
  );
}

// Composant principal SmartLink
export function SmartLink({ 
  type, 
  id, 
  children, 
  className,
  disableTooltip = false 
}: SmartLinkProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const config = entityConfig[type];
  
  // Calculer la position du tooltip
  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const tooltipWidth = 280;
      const tooltipHeight = 200;
      
      let left = rect.left + rect.width / 2 - tooltipWidth / 2;
      let top = rect.bottom + 8;
      
      // Ajuster si déborde à droite
      if (left + tooltipWidth > window.innerWidth - 16) {
        left = window.innerWidth - tooltipWidth - 16;
      }
      // Ajuster si déborde à gauche
      if (left < 16) {
        left = 16;
      }
      // Si déborde en bas, afficher au-dessus
      if (top + tooltipHeight > window.innerHeight - 16) {
        top = rect.top - tooltipHeight - 8;
      }
      
      setPosition({ top, left });
    }
  };
  
  const handleMouseEnter = () => {
    if (disableTooltip) return;
    timeoutRef.current = setTimeout(() => {
      updatePosition();
      setIsOpen(true);
    }, 300);
  };
  
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(false);
  };
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  // Rendu du contenu du tooltip selon le type
  const renderTooltipContent = () => {
    switch (type) {
      case "molecule":
        return <MoleculeTooltip id={id} />;
      case "plant":
        return <PlantTooltip id={id} />;
      case "recette":
        return <RecetteTooltip id={id} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Link href={config.path(id)}>
        <a
          ref={triggerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md transition-all",
            "hover:underline underline-offset-2",
            config.color,
            config.bgColor,
            "border border-transparent hover:border-current/20",
            className
          )}
        >
          {config.icon}
          <span>{children}</span>
        </a>
      </Link>
      
      {/* Tooltip Portal */}
      {isOpen && position && !disableTooltip && (
        <div
          ref={tooltipRef}
          className="fixed z-[100] w-[280px] p-4 bg-popover text-popover-foreground rounded-lg border shadow-xl animate-in fade-in-0 zoom-in-95"
          style={{ top: position.top, left: position.left }}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center gap-2 mb-3 pb-2 border-b">
            <div className={cn("p-1.5 rounded", config.bgColor, config.color)}>
              {config.icon}
            </div>
            <span className="text-xs font-medium text-muted-foreground">{config.label}</span>
          </div>
          {renderTooltipContent()}
        </div>
      )}
    </>
  );
}

// Export des types pour utilisation externe
export { entityConfig };
