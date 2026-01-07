import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Leaf, ExternalLink, Loader2, MapPin } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface PlantLinkProps {
  /** ID de la plante (si connu) */
  id?: number;
  /** Nom de la plante à afficher et rechercher */
  name: string;
  /** Afficher un badge au lieu d'un lien simple */
  variant?: "link" | "badge" | "card";
  /** Classe CSS additionnelle */
  className?: string;
  /** Afficher le hover card avec les détails */
  showHoverCard?: boolean;
}

/**
 * Composant pour afficher un lien cliquable vers une fiche plante.
 * Recherche automatiquement la plante par son nom et crée un lien vers sa fiche.
 * Affiche un hover card avec les informations de base si activé.
 */
export function PlantLink({ 
  id,
  name, 
  variant = "link",
  className = "",
  showHoverCard = true
}: PlantLinkProps) {
  // Si on a l'ID, récupérer directement la plante
  const { data: plantById, isLoading: isLoadingById } = trpc.plants.getById.useQuery(id!, {
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  // Sinon, rechercher par nom dans la liste
  const { data: allPlants, isLoading: isLoadingList } = trpc.plants.list.useQuery(undefined, {
    enabled: !id && !!name,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  const isLoading = isLoadingById || isLoadingList;
  
  // Trouver la plante correspondante
  const plant = id ? plantById : allPlants?.find(p => 
    p.name.toLowerCase() === name.toLowerCase() ||
    p.latinName?.toLowerCase() === name.toLowerCase()
  );

  const hasMatch = !!plant;

  // Extraire le nom court
  const displayName = name;

  // Contenu du lien
  const linkContent = (
    <>
      {variant === "badge" ? (
        <Badge 
          variant="outline" 
          className={`cursor-pointer hover:bg-green-500/10 transition-colors ${hasMatch ? "border-green-500/50 text-green-600" : "border-muted"} ${className}`}
        >
          <Leaf className="w-3 h-3 mr-1" />
          {displayName}
          {hasMatch && <ExternalLink className="w-3 h-3 ml-1 opacity-50" />}
        </Badge>
      ) : variant === "card" ? (
        <div className={`p-3 rounded-lg border bg-card hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors cursor-pointer ${className}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-green-600" />
              <span className="font-medium">{displayName}</span>
            </div>
            {plant?.category && (
              <Badge variant="secondary" className="capitalize">{plant.category}</Badge>
            )}
          </div>
          {plant?.latinName && (
            <p className="text-xs text-muted-foreground italic mt-1">{plant.latinName}</p>
          )}
        </div>
      ) : (
        <span className={`inline-flex items-center gap-1 text-green-600 hover:underline cursor-pointer ${className}`}>
          <Leaf className="w-3 h-3" />
          {displayName}
          {hasMatch && <ExternalLink className="w-3 h-3 opacity-50" />}
        </span>
      )}
    </>
  );

  // Si pas de correspondance trouvée, afficher juste le texte
  if (!hasMatch) {
    return (
      <span className={`inline-flex items-center gap-1 ${className}`}>
        <Leaf className="w-3 h-3 text-muted-foreground" />
        {displayName}
        {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
      </span>
    );
  }

  // Avec hover card
  if (showHoverCard && plant) {
    return (
      <HoverCard openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>
          <Link href={`/plants/${plant.id}`}>
            {linkContent}
          </Link>
        </HoverCardTrigger>
        <HoverCardContent className="w-80" side="top">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">{plant.name}</h4>
                {plant.latinName && (
                  <p className="text-sm italic text-muted-foreground">{plant.latinName}</p>
                )}
              </div>
              {plant.category && (
                <Badge variant="outline" className="text-xs capitalize">{plant.category}</Badge>
              )}
            </div>
            {plant.family && (
              <p className="text-sm text-muted-foreground">Famille: {plant.family}</p>
            )}
            {plant.origin && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {plant.origin}
              </div>
            )}
            {plant.olfactiveSignature && (
              <p className="text-sm text-muted-foreground line-clamp-2">{plant.olfactiveSignature}</p>
            )}
            <p className="text-xs text-green-600">Cliquer pour voir la fiche complète →</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }

  // Sans hover card
  return (
    <Link href={`/plants/${plant.id}`}>
      {linkContent}
    </Link>
  );
}

/**
 * Composant pour parser et afficher une liste de plantes avec liens.
 */
interface PlantListLinksProps {
  /** Liste de plantes (objets avec id et name) */
  plants: Array<{ id: number; name: string; latinName?: string }>;
  /** Variante d'affichage */
  variant?: "inline" | "badges" | "cards";
  /** Classe CSS additionnelle */
  className?: string;
}

export function PlantListLinks({ plants, variant = "inline", className = "" }: PlantListLinksProps) {
  if (variant === "badges") {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {plants.map((plant) => (
          <PlantLink 
            key={plant.id} 
            id={plant.id}
            name={plant.name}
            variant="badge"
            showHoverCard={true}
          />
        ))}
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ${className}`}>
        {plants.map((plant) => (
          <PlantLink 
            key={plant.id} 
            id={plant.id}
            name={plant.name}
            variant="card"
            showHoverCard={false}
          />
        ))}
      </div>
    );
  }

  // Inline: afficher comme texte avec liens
  return (
    <span className={className}>
      {plants.map((plant, i) => (
        <span key={plant.id}>
          <PlantLink 
            id={plant.id}
            name={plant.name}
            variant="link"
            showHoverCard={true}
          />
          {i < plants.length - 1 && ", "}
        </span>
      ))}
    </span>
  );
}

export default PlantLink;
