// @ts-nocheck
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, ExternalLink, Loader2 } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface MoleculeLinkProps {
  /** Nom de la molécule à afficher et rechercher */
  name: string;
  /** Proportion optionnelle à afficher */
  proportion?: number;
  /** Afficher un badge au lieu d'un lien simple */
  variant?: "link" | "badge" | "card";
  /** Classe CSS additionnelle */
  className?: string;
  /** Afficher le hover card avec les détails */
  showHoverCard?: boolean;
}

/**
 * Composant pour afficher un lien cliquable vers une fiche molécule.
 * Recherche automatiquement la molécule par son nom et crée un lien vers sa fiche.
 * Affiche un hover card avec les informations de base si activé.
 */
export function MoleculeLink({ 
  name, 
  proportion, 
  variant = "link",
  className = "",
  showHoverCard = true
}: MoleculeLinkProps) {
  // Rechercher la molécule par son nom
  const { data: searchResult, isLoading } = trpc.molecules.search.useQuery(
    { query: name, limit: 1 },
    { 
      enabled: !!name,
      staleTime: 5 * 60 * 1000, // Cache 5 minutes
      refetchOnWindowFocus: false
    }
  );

  const molecule = searchResult?.molecules?.[0];
  const hasMatch = molecule && molecule.name.toLowerCase().includes(name.toLowerCase().split(" ")[0]);

  // Extraire le nom court (sans la formule chimique entre parenthèses)
  const displayName = name.split(" (")[0];

  // Contenu du lien
  const linkContent = (
    <>
      {variant === "badge" ? (
        <Badge 
          variant="outline" 
          className={`cursor-pointer hover:bg-primary/10 transition-colors ${hasMatch ? "border-primary/50" : "border-muted"} ${className}`}
        >
          <FlaskConical className="w-3 h-3 mr-1" />
          {displayName}
          {proportion !== undefined && (
            <span className="ml-1 text-muted-foreground">({proportion}%)</span>
          )}
          {hasMatch && <ExternalLink className="w-3 h-3 ml-1 opacity-50" />}
        </Badge>
      ) : variant === "card" ? (
        <div className={`p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer ${className}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-primary" />
              <span className="font-medium">{displayName}</span>
            </div>
            {proportion !== undefined && (
              <Badge variant="secondary">{proportion}%</Badge>
            )}
          </div>
          {molecule?.chemicalFormula && (
            <p className="text-xs text-muted-foreground font-mono mt-1">{molecule.chemicalFormula}</p>
          )}
        </div>
      ) : (
        <span className={`inline-flex items-center gap-1 text-primary hover:underline cursor-pointer ${className}`}>
          {displayName}
          {proportion !== undefined && (
            <span className="text-muted-foreground">({proportion}%)</span>
          )}
          {hasMatch && <ExternalLink className="w-3 h-3 opacity-50" />}
        </span>
      )}
    </>
  );

  // Si pas de correspondance trouvée, afficher juste le texte
  if (!hasMatch) {
    return (
      <span className={`inline-flex items-center gap-1 ${className}`}>
        {displayName}
        {proportion !== undefined && (
          <span className="text-muted-foreground">({proportion}%)</span>
        )}
        {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
      </span>
    );
  }

  // Avec hover card
  if (showHoverCard && molecule) {
    return (
      <HoverCard openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>
          <Link href={`/molecule/${molecule.id}`}>
            {linkContent}
          </Link>
        </HoverCardTrigger>
        <HoverCardContent className="w-80" side="top">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">{molecule.name}</h4>
                {molecule.chemicalFormula && (
                  <p className="text-sm font-mono text-muted-foreground">{molecule.chemicalFormula}</p>
                )}
              </div>
              {molecule.family && (
                <Badge variant="outline" className="text-xs">{molecule.family}</Badge>
              )}
            </div>
            {molecule.olfactiveProfile && (
              <p className="text-sm text-muted-foreground line-clamp-2">{molecule.olfactiveProfile}</p>
            )}
            <div className="flex gap-2 text-xs text-muted-foreground">
              {molecule.volatility && (
                <span>Volatilité: {molecule.volatility}</span>
              )}
              {molecule.intensity && (
                <span>Intensité: {molecule.intensity}/10</span>
              )}
            </div>
            <p className="text-xs text-primary">Cliquer pour voir la fiche complète →</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }

  // Sans hover card
  return (
    <Link href={`/molecule/${molecule.id}`}>
      {linkContent}
    </Link>
  );
}

/**
 * Composant pour parser et afficher une liste de molécules avec liens.
 * Prend une chaîne de caractères et transforme chaque molécule en lien cliquable.
 */
interface MoleculeListLinksProps {
  /** Texte contenant les noms de molécules (séparés par virgules) */
  text: string;
  /** Variante d'affichage */
  variant?: "inline" | "badges" | "cards";
  /** Classe CSS additionnelle */
  className?: string;
}

export function MoleculeListLinks({ text, variant = "inline", className = "" }: MoleculeListLinksProps) {
  // Parser le texte pour extraire les molécules
  // Format attendu: "Molécule1 (X%), Molécule2, Molécule3 (Y%)"
  const molecules = text.split(/,\s*/).map(item => {
    const match = item.match(/^(.+?)\s*(?:\((\d+(?:\.\d+)?%?)\))?$/);
    if (match) {
      const name = match[1].trim();
      const proportionStr = match[2]?.replace("%", "");
      const proportion = proportionStr ? parseFloat(proportionStr) : undefined;
      return { name, proportion };
    }
    return { name: item.trim(), proportion: undefined };
  }).filter(m => m.name);

  if (variant === "badges") {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {molecules.map((mol, i) => (
          <MoleculeLink 
            key={i} 
            name={mol.name} 
            proportion={mol.proportion}
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
        {molecules.map((mol, i) => (
          <MoleculeLink 
            key={i} 
            name={mol.name} 
            proportion={mol.proportion}
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
      {molecules.map((mol, i) => (
        <span key={i}>
          <MoleculeLink 
            name={mol.name} 
            proportion={mol.proportion}
            variant="link"
            showHoverCard={true}
          />
          {i < molecules.length - 1 && ", "}
        </span>
      ))}
    </span>
  );
}

export default MoleculeLink;
