/**
 * EuropeanaWidget — Mini-galerie Europeana réutilisable
 * ======================================================
 * Affiche 4 vignettes d'œuvres des collections muséales européennes
 * liées à une plante ou une molécule PERFUMUM.
 *
 * Usage :
 *   <EuropeanaWidget type="plant" entityId={plant.id} entityName={plant.name} />
 *   <EuropeanaWidget type="molecule" entityId={mol.id} entityName={mol.name} />
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Globe, ExternalLink, Loader2, ImageOff, Palette,
  Building2, Calendar, ChevronRight, Info,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EuropeanaWidgetProps {
  /** type d'entité : plant, molecule, ou civilisation (recherche libre par nom) */
  type?: "plant" | "molecule" | "civilisation";
  entityId?: number;
  entityName: string;
  /** Pour le type civilisation : QID Wikidata optionnel */
  wikidataQid?: string;
  /** Titre personnalisé du widget */
  title?: string;
  /** Description personnalisée */
  description?: string;
  /** Nombre de vignettes à afficher (défaut : 4) */
  limit?: number;
  maxItems?: number;
  /** Classe CSS supplémentaire pour le conteneur */
  className?: string;
}

// ─── Vignette individuelle ────────────────────────────────────────────────────

function ArtworkThumb({
  item,
}: {
  item: {
    id: string;
    title: string;
    creator?: string;
    date?: string;
    institution?: string;
    thumbnailUrl?: string;
    europeanaUrl: string;
    type?: string;
  };
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href={item.europeanaUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-lg overflow-hidden border hover:border-primary/50 transition-all duration-200 hover:shadow-md"
      title={`${item.title}${item.creator ? ` — ${item.creator}` : ""}${item.date ? ` (${item.date})` : ""}`}
    >
      {/* Image */}
      <div className="aspect-square bg-muted relative overflow-hidden">
        {item.thumbnailUrl && !imgError ? (
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Palette className="h-6 w-6 text-muted-foreground/30" />
          </div>
        )}
        {/* Overlay au survol */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-end">
          <div className="p-1.5 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-200">
            <p className="text-white text-xs font-medium line-clamp-2 leading-tight">
              {item.title}
            </p>
          </div>
        </div>
        {/* Icône externe */}
        <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black/60 rounded p-0.5">
            <ExternalLink className="h-2.5 w-2.5 text-white" />
          </div>
        </div>
      </div>

      {/* Métadonnées sous l'image */}
      <div className="p-1.5 bg-card">
        <p className="text-xs font-medium line-clamp-1 leading-tight">{item.title}</p>
        {(item.creator || item.date) && (
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {item.creator && <span>{item.creator}</span>}
            {item.creator && item.date && <span> · </span>}
            {item.date && <span>{item.date}</span>}
          </p>
        )}
        {item.institution && (
          <p className="text-xs text-muted-foreground/70 line-clamp-1 flex items-center gap-0.5 mt-0.5">
            <Building2 className="h-2.5 w-2.5 shrink-0" />
            {item.institution}
          </p>
        )}
      </div>
    </a>
  );
}

// ─── Widget principal ─────────────────────────────────────────────────────────

export function EuropeanaWidget({
  type = "plant",
  entityId,
  entityName,
  wikidataQid,
  title,
  description,
  limit = 4,
  maxItems,
  className = "",
}: EuropeanaWidgetProps) {
  const [enabled, setEnabled] = useState(false);
  const effectiveLimit = maxItems ?? limit;

  // Requête selon le type
  const plantQuery = trpc.europeana.searchByPlant.useQuery(
    { plantId: entityId ?? 0, limit: effectiveLimit },
    { enabled: enabled && type === "plant" && !!entityId }
  );
  const moleculeQuery = trpc.europeana.searchByMolecule.useQuery(
    { moleculeId: entityId ?? 0, limit: effectiveLimit },
    { enabled: enabled && type === "molecule" && !!entityId }
  );
  // Recherche libre pour les traditions olfactives / civilisations
  const freeQuery = trpc.europeana.freeSearch.useQuery(
    { query: entityName, rows: effectiveLimit },
    { enabled: enabled && type === "civilisation" }
  );

  const queryResult = type === "plant" ? plantQuery : type === "molecule" ? moleculeQuery : freeQuery;
  const { data, isLoading, error } = queryResult;

  const isDemo = data?.error?.includes("non configurée") || data?.error?.includes("démonstration");
  const hasResults = data && data.items.length > 0;

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-cyan-600 shrink-0" />
            <span>{title ?? "Collections Europeana"}</span>
          </div>
          {data?.apiAvailable && (
            <Badge variant="outline" className="text-xs text-green-600 border-green-400 font-normal">
              API active
            </Badge>
          )}
          {isDemo && (
            <Badge variant="outline" className="text-xs text-amber-600 border-amber-400 font-normal">
              Démo
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 pb-4 space-y-3">
        {/* État initial — bouton de lancement */}
        {!enabled && (
          <div className="text-center py-3">
            <p className="text-xs text-muted-foreground mb-3">
              {description ?? `Rechercher "${entityName}" dans les collections muséales européennes`}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEnabled(true)}
              className="gap-2 text-xs"
            >
              <Globe className="h-3.5 w-3.5 text-cyan-600" />
              Voir dans Europeana
            </Button>
          </div>
        )}

        {/* Chargement */}
        {isLoading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-xs text-muted-foreground">
              Interrogation des collections européennes…
            </span>
          </div>
        )}

        {/* Erreur */}
        {error && !isLoading && (
          <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 dark:bg-red-950/20 rounded p-2">
            <Info className="h-3.5 w-3.5 shrink-0" />
            <span>{error.message}</span>
          </div>
        )}

        {/* Bannière démo */}
        {isDemo && data && !isLoading && (
          <div className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 rounded p-2">
            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>Mode démonstration — clé API Europeana non configurée. Données d'exemple.</span>
          </div>
        )}

        {/* Grille de vignettes */}
        {hasResults && !isLoading && (
          <>
            <div className={`grid gap-2 ${effectiveLimit <= 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"}`}>
              {data.items.slice(0, effectiveLimit).map((item, i) => (
                <ArtworkThumb key={`${item.id}-${i}`} item={item} />
              ))}
            </div>

            {/* Lien vers la page complète */}
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-muted-foreground">
                {data.total > 0 && data.apiAvailable
                  ? `${data.total.toLocaleString()} œuvre(s) dans les collections européennes`
                  : `${data.items.length} exemple(s) de démonstration`}
              </p>
              <Link href="/admin/europeana">
                <Button variant="ghost" size="sm" className="text-xs gap-1 h-7 px-2">
                  Explorer tout
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </>
        )}

        {/* Aucun résultat */}
        {data && !isLoading && !hasResults && (
          <div className="text-center py-4">
            <ImageOff className="h-6 w-6 mx-auto mb-2 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">
              Aucune œuvre trouvée pour "{entityName}"
            </p>
            <Link href="/admin/europeana">
              <Button variant="ghost" size="sm" className="text-xs mt-2 gap-1">
                Essayer une recherche libre
                <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default EuropeanaWidget;
