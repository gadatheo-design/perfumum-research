/**
 * EntityQidPicker — Sélecteur d'entités PERFUMUM avec QID Wikidata
 * Rapport 12 : Amélioration de l'accessibilité des QIDs dans l'Explorateur SPARQL
 *
 * Fonctionnalités :
 * - Autocomplete avec recherche en temps réel (molécules, plantes, familles)
 * - Badge QID cliquable (copie dans le presse-papier + lien Wikidata)
 * - Panneau catalogue des QIDs disponibles dans PERFUMUM
 * - Injection directe du QID dans une requête SPARQL
 */
import { useState, useCallback, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FlaskConical, Leaf, Layers, Search, Copy, ExternalLink,
  CheckCircle2, AlertCircle, ChevronDown, ChevronUp, X
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

// ─── Types ────────────────────────────────────────────────────────────────────
interface EntityResult {
  id: number;
  name: string;
  qid: string | null;
  type: string;
  extra: string | null;
}

interface EntityQidPickerProps {
  /** Appelé quand l'utilisateur sélectionne un QID */
  onQidSelect: (qid: string, entityName: string, entityType: string) => void;
  /** Texte du bouton d'injection */
  injectLabel?: string;
  /** Filtre par type d'entité */
  entityType?: "all" | "molecule" | "plant" | "family";
  /** Afficher uniquement les entités avec QID */
  onlyWithQid?: boolean;
  /** Classe CSS additionnelle */
  className?: string;
}

// ─── Icônes par type ──────────────────────────────────────────────────────────
const TYPE_ICONS: Record<string, React.ReactNode> = {
  molecule: <FlaskConical className="h-3.5 w-3.5 text-violet-500" />,
  plant: <Leaf className="h-3.5 w-3.5 text-emerald-500" />,
  family: <Layers className="h-3.5 w-3.5 text-amber-500" />,
};

const TYPE_LABELS: Record<string, string> = {
  molecule: "Molécule",
  plant: "Plante",
  family: "Famille",
};

const TYPE_COLORS: Record<string, string> = {
  molecule: "bg-violet-50 border-violet-200 text-violet-700 dark:bg-violet-950/30 dark:border-violet-800 dark:text-violet-300",
  plant: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300",
  family: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300",
};

// ─── Badge QID cliquable ──────────────────────────────────────────────────────
export function QidBadge({ qid, size = "sm" }: { qid: string; size?: "xs" | "sm" | "md" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(qid).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const sizeClass = size === "xs" ? "text-[10px] px-1 py-0" : size === "md" ? "text-sm px-2 py-1" : "text-xs px-1.5 py-0.5";

  return (
    <span className={`inline-flex items-center gap-1 font-mono rounded border ${sizeClass} bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-300 cursor-pointer select-none`}>
      <span>{qid}</span>
      <button
        onClick={handleCopy}
        className="opacity-60 hover:opacity-100 transition-opacity"
        title="Copier le QID"
      >
        {copied ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
      </button>
      <a
        href={`https://www.wikidata.org/wiki/${qid}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="opacity-60 hover:opacity-100 transition-opacity"
        title="Voir sur Wikidata"
      >
        <ExternalLink className="h-3 w-3" />
      </a>
    </span>
  );
}

// ─── Ligne de résultat ────────────────────────────────────────────────────────
function EntityRow({
  entity,
  onSelect,
  selected,
}: {
  entity: EntityResult;
  onSelect: (entity: EntityResult) => void;
  selected: boolean;
}) {
  return (
    <button
      onClick={() => onSelect(entity)}
      className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-3 group
        ${selected ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/60"}`}
    >
      <span className="flex-shrink-0">{TYPE_ICONS[entity.type] ?? <Layers className="h-3.5 w-3.5" />}</span>
      <span className="flex-1 min-w-0">
        <span className="font-medium text-sm truncate block">{entity.name}</span>
        {entity.extra && (
          <span className="text-xs text-muted-foreground truncate block">{entity.extra}</span>
        )}
      </span>
      <span className="flex-shrink-0 flex items-center gap-1.5">
        <Badge variant="outline" className={`text-[10px] px-1 py-0 ${TYPE_COLORS[entity.type] ?? ""}`}>
          {TYPE_LABELS[entity.type] ?? entity.type}
        </Badge>
        {entity.qid ? (
          <QidBadge qid={entity.qid} size="xs" />
        ) : (
          <span className="text-[10px] text-muted-foreground italic">sans QID</span>
        )}
      </span>
    </button>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
export function EntityQidPicker({
  onQidSelect,
  injectLabel = "Injecter dans la requête",
  entityType = "all",
  onlyWithQid = false,
  className = "",
}: EntityQidPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntity, setSelectedEntity] = useState<EntityResult | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogType, setCatalogType] = useState<"all" | "molecule" | "plant" | "family">("all");
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Recherche autocomplete
  const { data: searchResults, isFetching } = trpc.sparqlQid.searchEntitiesWithQid.useQuery(
    { query: debouncedQuery, entityType, onlyWithQid, limit: 20 },
    { enabled: debouncedQuery.length >= 2 }
  );

  // Catalogue des QIDs disponibles
  const { data: catalog } = trpc.sparqlQid.getQidCatalog.useQuery(
    { entityType: catalogType, limit: 100 },
    { enabled: catalogOpen }
  );

  // Fermer le dropdown si clic en dehors
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = useCallback((entity: EntityResult) => {
    setSelectedEntity(entity);
    setSearchQuery(entity.name);
    setShowDropdown(false);
  }, []);

  const handleInject = useCallback(() => {
    if (!selectedEntity?.qid) return;
    onQidSelect(selectedEntity.qid, selectedEntity.name, selectedEntity.type);
  }, [selectedEntity, onQidSelect]);

  const handleCatalogSelect = useCallback((entity: { id: number; name: string; qid: string; type: string; extra: string | null }) => {
    setSelectedEntity({ ...entity, qid: entity.qid });
    setSearchQuery(entity.name);
    setCatalogOpen(false);
  }, []);

  const handleClear = () => {
    setSearchQuery("");
    setSelectedEntity(null);
    setShowDropdown(false);
  };

  return (
    <div className={`space-y-3 ${className}`} ref={containerRef}>
      {/* Champ de recherche avec autocomplete */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Rechercher une entité PERFUMUM
        </Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
              if (!e.target.value) setSelectedEntity(null);
            }}
            onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
            placeholder="Nom de molécule, plante ou famille chimique…"
            className="pl-8 pr-8 font-mono text-sm"
          />
          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Dropdown des résultats */}
          {showDropdown && debouncedQuery.length >= 2 && (
            <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {isFetching ? (
                <div className="px-3 py-4 text-sm text-muted-foreground text-center">Recherche…</div>
              ) : !searchResults?.results.length ? (
                <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                  Aucun résultat pour « {debouncedQuery} »
                </div>
              ) : (
                <div className="p-1 space-y-0.5">
                  {searchResults.results.map((entity) => (
                    <EntityRow
                      key={`${entity.type}-${entity.id}`}
                      entity={entity}
                      onSelect={handleSelect}
                      selected={selectedEntity?.id === entity.id && selectedEntity?.type === entity.type}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Entité sélectionnée + bouton d'injection */}
      {selectedEntity && (
        <div className={`flex items-center gap-3 p-3 rounded-lg border ${TYPE_COLORS[selectedEntity.type] ?? "bg-muted"}`}>
          <span>{TYPE_ICONS[selectedEntity.type]}</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{selectedEntity.name}</p>
            {selectedEntity.extra && (
              <p className="text-xs opacity-70 truncate">{selectedEntity.extra}</p>
            )}
          </div>
          {selectedEntity.qid ? (
            <div className="flex items-center gap-2 flex-shrink-0">
              <QidBadge qid={selectedEntity.qid} size="sm" />
              <Button size="sm" onClick={handleInject} className="text-xs h-7">
                {injectLabel}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs opacity-70 flex-shrink-0">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Pas de QID</span>
            </div>
          )}
        </div>
      )}

      {/* Bouton catalogue */}
      <button
        onClick={() => setCatalogOpen(!catalogOpen)}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {catalogOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        <span>Parcourir le catalogue des QIDs disponibles dans PERFUMUM</span>
        {catalog?.stats && (
          <span className="font-mono text-primary">
            ({(catalog.stats.molecules_with_qid ?? 0) + (catalog.stats.plants_with_qid ?? 0) + (catalog.stats.families_with_qid ?? 0)} QIDs)
          </span>
        )}
      </button>

      {/* Panneau catalogue */}
      {catalogOpen && (
        <Card className="border-dashed">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-sm flex items-center justify-between">
              <span>Catalogue des QIDs PERFUMUM</span>
              {catalog?.stats && (
                <div className="flex gap-3 text-xs font-normal text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FlaskConical className="h-3 w-3 text-violet-500" />
                    {catalog.stats.molecules_with_qid}/{catalog.stats.molecules_total} molécules
                  </span>
                  <span className="flex items-center gap-1">
                    <Leaf className="h-3 w-3 text-emerald-500" />
                    {catalog.stats.plants_with_qid}/{catalog.stats.plants_total} plantes
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="h-3 w-3 text-amber-500" />
                    {catalog.stats.families_with_qid}/{catalog.stats.families_total} familles
                  </span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <Tabs value={catalogType} onValueChange={(v) => setCatalogType(v as typeof catalogType)}>
              <TabsList className="h-7 mb-3">
                <TabsTrigger value="all" className="text-xs h-6">Tous</TabsTrigger>
                <TabsTrigger value="molecule" className="text-xs h-6">
                  <FlaskConical className="h-3 w-3 mr-1 text-violet-500" />Molécules
                </TabsTrigger>
                <TabsTrigger value="plant" className="text-xs h-6">
                  <Leaf className="h-3 w-3 mr-1 text-emerald-500" />Plantes
                </TabsTrigger>
                <TabsTrigger value="family" className="text-xs h-6">
                  <Layers className="h-3 w-3 mr-1 text-amber-500" />Familles
                </TabsTrigger>
              </TabsList>

              <TabsContent value={catalogType}>
                <ScrollArea className="h-48">
                  <div className="space-y-0.5 pr-2">
                    {catalog?.catalog.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        Aucun QID disponible pour ce type d'entité
                      </p>
                    ) : (
                      catalog?.catalog.map((entity) => (
                        <button
                          key={`${entity.type}-${entity.id}`}
                          onClick={() => handleCatalogSelect(entity)}
                          className="w-full text-left px-2 py-1.5 rounded hover:bg-muted/60 transition-colors flex items-center gap-2 group"
                        >
                          <span className="flex-shrink-0">{TYPE_ICONS[entity.type]}</span>
                          <span className="flex-1 min-w-0">
                            <span className="text-xs font-medium truncate block">{entity.name}</span>
                            {entity.extra && (
                              <span className="text-[10px] text-muted-foreground truncate block">{entity.extra}</span>
                            )}
                          </span>
                          <QidBadge qid={entity.qid} size="xs" />
                        </button>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
