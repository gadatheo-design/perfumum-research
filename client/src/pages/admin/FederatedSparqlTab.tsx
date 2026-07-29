/**
 * FederatedSparqlTab — Onglet Requêtes Fédérées SPARQL
 * PERFUMUM ↔ Wikidata ↔ OpenAlex
 * Rapport 7 — Axe 2.2 & 2.4
 */
import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { EntityAutocomplete } from "@/components/ui/EntityAutocomplete";
import {
  Network, Loader2, AlertCircle, ExternalLink, BookOpen,
  Clock, GitBranch, FlaskConical, Leaf, Users, Lightbulb,
  BarChart3, RefreshCw, Database, Globe, Atom, TreePine
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type EntityType = "molecule" | "plant" | "family";
type AutocompleteEntityType = "molecule" | "plante" | "recette" | "terroir" | "axis" | "extractionMethod" | "extraction" | "bibliography";
type WikidataQueryType = "taxonomy" | "publications" | "images" | "related" | "timeline";
type OpenAlexQueryType = "publications" | "timeline" | "authors" | "concepts";
type FederatedSource = "wikidata" | "openalex" | "enrich";

interface FederatedResult {
  source: FederatedSource;
  entityName: string;
  qid?: string;
  vars?: string[];
  bindings?: Record<string, { type: string; value: string }>[];
  count?: number;
  executionMs?: number;
  error?: string;
  sparqlQuery?: string;
}

// ─── Sous-composant : Tableau de résultats SPARQL ────────────────────────────
function SparqlResultTable({ vars, bindings }: {
  vars: string[];
  bindings: Record<string, { type: string; value: string }>[];
}) {
  if (!bindings.length) {
    return <p className="text-sm text-muted-foreground text-center py-6">Aucun résultat pour cette requête.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-border/60">
      <table className="w-full text-xs">
        <thead className="bg-muted/50">
          <tr>
            {vars.map((v) => (
              <th key={v} className="px-3 py-2 text-left font-medium text-muted-foreground font-mono">?{v}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bindings.slice(0, 50).map((row, i) => (
            <tr key={i} className="border-t hover:bg-muted/30 transition-colors">
              {vars.map((v) => {
                const cell = row[v];
                if (!cell) return <td key={v} className="px-3 py-2 text-muted-foreground/40">—</td>;
                const val = cell.value;
                const isUri = cell.type === "uri";
                const isWikidata = isUri && val.includes("wikidata.org/entity/");
                const isImage = isUri && /\.(jpg|jpeg|png|svg|webp)$/i.test(val);
                const isDoi = isUri && val.includes("doi.org");
                return (
                  <td key={v} className="px-3 py-2 max-w-[220px]">
                    {isImage ? (
                      <a href={val} target="_blank" rel="noopener noreferrer">
                        <img src={val} alt="" className="h-12 w-12 object-contain rounded border" />
                      </a>
                    ) : isWikidata ? (
                      <a href={val} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-violet-600 hover:underline truncate">
                        <span className="font-mono text-[10px] bg-violet-100 dark:bg-violet-900/30 px-1 rounded">
                          {val.split("/").pop()}
                        </span>
                        <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                      </a>
                    ) : isDoi ? (
                      <a href={val} target="_blank" rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate block" title={val}>
                        {val.replace("https://doi.org/", "doi:")}
                      </a>
                    ) : isUri ? (
                      <a href={val} target="_blank" rel="noopener noreferrer"
                        className="text-primary/70 hover:underline truncate block text-[11px]" title={val}>
                        {val.length > 50 ? `${val.slice(0, 50)}…` : val}
                      </a>
                    ) : (
                      <span className="truncate block" title={val}>{val}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {bindings.length > 50 && (
        <p className="text-xs text-muted-foreground text-center py-2 border-t">
          Affichage limité à 50 résultats sur {bindings.length}
        </p>
      )}
    </div>
  );
}

// ─── Sous-composant : Résultats enrichis (federatedEnrich) ───────────────────
function EnrichResultPanel({ data }: { data: Record<string, unknown> }) {
  const perfumum = data.perfumumData as Record<string, unknown> | undefined;
  const wikidata = data.wikidataData as Record<string, unknown> | undefined;
  const openalex = data.openalexData as Record<string, unknown> | undefined;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* PERFUMUM */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs flex items-center gap-2">
            <Database className="h-3.5 w-3.5 text-primary" />
            PERFUMUM
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-xs">
          {perfumum ? Object.entries(perfumum).slice(0, 8).map(([k, v]) => (
            <div key={k} className="flex justify-between gap-2">
              <span className="text-muted-foreground font-mono shrink-0">{k}</span>
              <span className="truncate text-right">{String(v ?? "—")}</span>
            </div>
          )) : <p className="text-muted-foreground">Aucune donnée</p>}
        </CardContent>
      </Card>
      {/* Wikidata */}
      <Card className="border-violet-200 dark:border-violet-800/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-violet-600" />
            Wikidata
            {data.qid != null && (
              <a href={`https://www.wikidata.org/wiki/${String(data.qid)}`} target="_blank" rel="noopener noreferrer">
                <Badge variant="outline" className="text-[10px] font-mono text-violet-600 border-violet-300">
                  {String(data.qid)}
                </Badge>
              </a>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-xs">
          {wikidata ? Object.entries(wikidata).slice(0, 8).map(([k, v]) => (
            <div key={k} className="flex justify-between gap-2">
              <span className="text-muted-foreground font-mono shrink-0">{k}</span>
              <span className="truncate text-right">{String(v ?? "—")}</span>
            </div>
          )) : <p className="text-muted-foreground">Aucune donnée Wikidata</p>}
        </CardContent>
      </Card>
      {/* OpenAlex */}
      <Card className="border-blue-200 dark:border-blue-800/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 text-blue-600" />
            OpenAlex
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-xs">
          {openalex ? Object.entries(openalex).slice(0, 8).map(([k, v]) => (
            <div key={k} className="flex justify-between gap-2">
              <span className="text-muted-foreground font-mono shrink-0">{k}</span>
              <span className="truncate text-right">{String(v ?? "—")}</span>
            </div>
          )) : <p className="text-muted-foreground">Aucune donnée OpenAlex</p>}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
export function FederatedSparqlTab() {
  const [entityType, setEntityType] = useState<EntityType>("molecule");
  const [entityId, setEntityId] = useState<number | null>(null);
  const [entityLabel, setEntityLabel] = useState<string>("");
  const [source, setSource] = useState<FederatedSource>("wikidata");
  const [wikidataQueryType, setWikidataQueryType] = useState<WikidataQueryType>("publications");
  const [openalexQueryType, setOpenalexQueryType] = useState<OpenAlexQueryType>("publications");
  const [limit, setLimit] = useState<number>(20);
  const [submitted, setSubmitted] = useState(false);
  const [currentParams, setCurrentParams] = useState<{
    entityType: EntityType;
    entityId: number;
    source: FederatedSource;
    wikidataQueryType: WikidataQueryType;
    openalexQueryType: OpenAlexQueryType;
    limit: number;
  } | null>(null);

  // ── Requêtes tRPC ──────────────────────────────────────────────────────────
  const wikidataQuery = trpc.sparql.federatedWikidata.useQuery(
    {
      entityType: currentParams?.entityType ?? "molecule",
      entityId: currentParams?.entityId ?? 0,
      queryType: currentParams?.wikidataQueryType ?? "publications",
      limit: currentParams?.limit ?? 20,
      useCache: true,
    },
    { enabled: submitted && source === "wikidata" && !!currentParams }
  );

  const openalexQuery = trpc.sparql.federatedOpenAlex.useQuery(
    {
      entityType: currentParams?.entityType ?? "molecule",
      entityId: currentParams?.entityId ?? 0,
      queryType: currentParams?.openalexQueryType ?? "publications",
      limit: currentParams?.limit ?? 20,
      useCache: true,
    },
    { enabled: submitted && source === "openalex" && !!currentParams }
  );

  const enrichQuery = trpc.sparql.federatedEnrich.useQuery(
    {
      entityType: (currentParams?.entityType ?? "molecule") as "molecule" | "plant",
      entityId: currentParams?.entityId ?? 0,
    },
    { enabled: submitted && source === "enrich" && !!currentParams && currentParams.entityType !== "family" }
  );

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleRun = useCallback(() => {
    if (!entityId) return;
    setCurrentParams({
      entityType,
      entityId,
      source,
      wikidataQueryType,
      openalexQueryType,
      limit,
    });
    setSubmitted(true);
  }, [entityId, entityType, source, wikidataQueryType, openalexQueryType, limit]);

  const handleReset = () => {
    setSubmitted(false);
    setCurrentParams(null);
    setEntityId(null);
    setEntityLabel("");
  };

  // ── Données actives ────────────────────────────────────────────────────────
  const activeQuery = source === "wikidata" ? wikidataQuery
    : source === "openalex" ? openalexQuery
    : enrichQuery;
  const isLoading = activeQuery.isLoading;
  const data = activeQuery.data as FederatedResult | Record<string, unknown> | undefined;
  const error = (data as FederatedResult)?.error;

  // ── Descriptions des types de requêtes ────────────────────────────────────
  const wikidataQueryDescriptions: Record<WikidataQueryType, { label: string; icon: React.ReactNode; desc: string }> = {
    publications: { label: "Publications", icon: <BookOpen className="h-3.5 w-3.5" />, desc: "Articles scientifiques ayant cette entité comme sujet principal" },
    taxonomy: { label: "Taxonomie", icon: <TreePine className="h-3.5 w-3.5" />, desc: "Arbre taxonomique complet (famille → genre → espèce)" },
    images: { label: "Images", icon: <Atom className="h-3.5 w-3.5" />, desc: "Images et représentations visuelles sur Wikidata" },
    related: { label: "Entités liées", icon: <Network className="h-3.5 w-3.5" />, desc: "Entités chimiques ou botaniques reliées" },
    timeline: { label: "Frise temporelle", icon: <Clock className="h-3.5 w-3.5" />, desc: "Évolution des publications par année" },
  };

  const openalexQueryDescriptions: Record<OpenAlexQueryType, { label: string; icon: React.ReactNode; desc: string }> = {
    publications: { label: "Publications", icon: <BookOpen className="h-3.5 w-3.5" />, desc: "Articles OpenAlex liés à cette entité" },
    timeline: { label: "Frise temporelle", icon: <BarChart3 className="h-3.5 w-3.5" />, desc: "Évolution des publications par année" },
    authors: { label: "Auteurs", icon: <Users className="h-3.5 w-3.5" />, desc: "Chercheurs les plus actifs sur ce sujet" },
    concepts: { label: "Concepts", icon: <Lightbulb className="h-3.5 w-3.5" />, desc: "Concepts OpenAlex associés à cette entité" },
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
          <Network className="h-5 w-5 text-violet-600" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Requêtes Fédérées</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Interrogation simultanée de PERFUMUM, Wikidata et OpenAlex — Rapport 7, Axe 2.2 & 2.4
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <Badge variant="outline" className="text-[10px] border-violet-300 text-violet-600">Wikidata SPARQL</Badge>
          <Badge variant="outline" className="text-[10px] border-blue-300 text-blue-600">OpenAlex API</Badge>
        </div>
      </div>

      <Separator />

      {/* Panneau de configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Type d'entité */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Type d'entité</Label>
          <Select value={entityType} onValueChange={(v) => { setEntityType(v as EntityType); setEntityId(null); setEntityLabel(""); setSubmitted(false); }}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="molecule">
                <div className="flex items-center gap-2">
                  <FlaskConical className="h-3.5 w-3.5 text-violet-500" />
                  Molécule
                </div>
              </SelectItem>
              <SelectItem value="plant">
                <div className="flex items-center gap-2">
                  <Leaf className="h-3.5 w-3.5 text-emerald-500" />
                  Plante
                </div>
              </SelectItem>
              <SelectItem value="family">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-3.5 w-3.5 text-amber-500" />
                  Famille olfactive
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sélecteur d'entité */}
        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-xs font-medium">
            {entityType === "molecule" ? "Molécule" : entityType === "plant" ? "Plante" : "Famille olfactive"}
          </Label>
          <EntityAutocomplete
            entityType={(entityType === "family" ? "molecule" : entityType === "plant" ? "plante" : entityType) as AutocompleteEntityType}
            value={entityId}
            onChange={(id, label) => { setEntityId(id); setEntityLabel(label); setSubmitted(false); }}
            placeholder={`Rechercher une ${entityType === "molecule" ? "molécule" : entityType === "plant" ? "plante" : "famille"}…`}
          />
        </div>

        {/* Source fédérée */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Source fédérée</Label>
          <Select value={source} onValueChange={(v) => { setSource(v as FederatedSource); setSubmitted(false); }}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wikidata">
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-violet-500" />
                  Wikidata SPARQL
                </div>
              </SelectItem>
              <SelectItem value="openalex">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                  OpenAlex API
                </div>
              </SelectItem>
              <SelectItem value="enrich" disabled={entityType === "family"}>
                <div className="flex items-center gap-2">
                  <Database className="h-3.5 w-3.5 text-emerald-500" />
                  Enrichissement croisé
                  {entityType === "family" && <Badge variant="outline" className="text-[9px]">Mol/Plante</Badge>}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Options de requête selon la source */}
      {source === "wikidata" && (
        <div className="space-y-2">
          <Label className="text-xs font-medium">Type de requête Wikidata</Label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {(Object.keys(wikidataQueryDescriptions) as WikidataQueryType[]).map((qt) => {
              const info = wikidataQueryDescriptions[qt];
              const isActive = wikidataQueryType === qt;
              return (
                <button
                  key={qt}
                  onClick={() => { setWikidataQueryType(qt); setSubmitted(false); }}
                  className={`flex flex-col items-start gap-1 p-2.5 rounded-lg border text-left transition-all text-xs ${
                    isActive
                      ? "border-violet-400 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300"
                      : "border-border/60 hover:border-violet-300 hover:bg-violet-50/50 dark:hover:bg-violet-950/10"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-medium">
                    {info.icon}
                    {info.label}
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-tight">{info.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {source === "openalex" && (
        <div className="space-y-2">
          <Label className="text-xs font-medium">Type de requête OpenAlex</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {(Object.keys(openalexQueryDescriptions) as OpenAlexQueryType[]).map((qt) => {
              const info = openalexQueryDescriptions[qt];
              const isActive = openalexQueryType === qt;
              return (
                <button
                  key={qt}
                  onClick={() => { setOpenalexQueryType(qt); setSubmitted(false); }}
                  className={`flex flex-col items-start gap-1 p-2.5 rounded-lg border text-left transition-all text-xs ${
                    isActive
                      ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                      : "border-border/60 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/10"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-medium">
                    {info.icon}
                    {info.label}
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-tight">{info.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {source === "enrich" && (
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
          <p className="text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Database className="h-3.5 w-3.5 shrink-0" />
            L'enrichissement croisé combine les données PERFUMUM, Wikidata et OpenAlex en une seule vue consolidée.
            Idéal pour vérifier la couverture d'une entité sur les trois sources.
          </p>
        </div>
      )}

      {/* Bouton d'exécution */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleRun}
          disabled={!entityId || isLoading}
          className="gap-2 bg-violet-600 hover:bg-violet-700 text-white"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Network className="h-4 w-4" />
          )}
          {isLoading ? "Requête en cours…" : "Exécuter la requête fédérée"}
        </Button>
        {submitted && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2 text-muted-foreground">
            <RefreshCw className="h-3.5 w-3.5" />
            Réinitialiser
          </Button>
        )}
        {entityLabel && (
          <Badge variant="secondary" className="text-xs">
            {entityType === "molecule" ? <FlaskConical className="h-3 w-3 mr-1 text-violet-500" />
              : <Leaf className="h-3 w-3 mr-1 text-emerald-500" />}
            {entityLabel}
          </Badge>
        )}
      </div>

      {/* Résultats */}
      {submitted && (
        <div className="space-y-4">
          <Separator />

          {/* En-tête des résultats */}
          {!isLoading && data && !error && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-xs ${
                  source === "wikidata" ? "border-violet-300 text-violet-600"
                  : source === "openalex" ? "border-blue-300 text-blue-600"
                  : "border-emerald-300 text-emerald-600"
                }`}>
                  {source === "wikidata" ? "Wikidata SPARQL"
                    : source === "openalex" ? "OpenAlex API"
                    : "Enrichissement croisé"}
                </Badge>
                {(data as FederatedResult).entityName && (
                  <span className="text-sm font-medium">{(data as FederatedResult).entityName}</span>
                )}
                {(data as FederatedResult).qid && (
                  <a
                    href={`https://www.wikidata.org/wiki/${(data as FederatedResult).qid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-violet-600 hover:underline flex items-center gap-1"
                  >
                    {(data as FederatedResult).qid}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {(data as FederatedResult).count !== undefined && (
                  <span>{(data as FederatedResult).count} résultat(s)</span>
                )}
                {(data as FederatedResult).executionMs !== undefined && (
                  <span className="font-mono">{(data as FederatedResult).executionMs}ms</span>
                )}
              </div>
            </div>
          )}

          {/* Chargement */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
              <p className="text-sm text-muted-foreground">
                Interrogation de {source === "wikidata" ? "Wikidata SPARQL" : source === "openalex" ? "OpenAlex" : "toutes les sources"}…
              </p>
              <p className="text-xs text-muted-foreground/60">Peut prendre jusqu'à 20 secondes pour les requêtes fédérées</p>
            </div>
          )}

          {/* Erreur */}
          {!isLoading && error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-red-800 dark:text-red-200">Erreur de requête fédérée</p>
                <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Résultats Wikidata / OpenAlex */}
          {!isLoading && !error && data && source !== "enrich" && (
            <div className="space-y-3">
              {(data as FederatedResult).vars && (data as FederatedResult).bindings && (
                <SparqlResultTable
                  vars={(data as FederatedResult).vars!}
                  bindings={(data as FederatedResult).bindings!}
                />
              )}
              {/* Requête SPARQL générée */}
              {(data as FederatedResult).sparqlQuery && (
                <details className="group">
                  <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground flex items-center gap-1">
                    <span className="font-mono">▶</span> Voir la requête SPARQL générée
                  </summary>
                  <pre className="mt-2 p-3 rounded-lg bg-muted/50 text-xs font-mono overflow-x-auto border border-border/50 whitespace-pre-wrap">
                    {(data as FederatedResult).sparqlQuery}
                  </pre>
                </details>
              )}
            </div>
          )}

          {/* Résultats enrichissement croisé */}
          {!isLoading && !error && data && source === "enrich" && (
            <EnrichResultPanel data={data as Record<string, unknown>} />
          )}
        </div>
      )}

      {/* État initial — guide d'utilisation */}
      {!submitted && (
        <div className="rounded-xl border border-dashed border-border/60 p-8 text-center space-y-3">
          <Network className="h-10 w-10 text-muted-foreground/30 mx-auto" />
          <p className="text-sm font-medium text-muted-foreground">Requêtes fédérées SPARQL</p>
          <p className="text-xs text-muted-foreground/70 max-w-md mx-auto">
            Sélectionnez une entité PERFUMUM (molécule, plante ou famille olfactive), choisissez une source fédérée
            et un type de requête, puis exécutez pour croiser les données avec Wikidata ou OpenAlex.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <Badge variant="outline" className="text-[10px]">Taxonomie botanique</Badge>
            <Badge variant="outline" className="text-[10px]">Publications scientifiques</Badge>
            <Badge variant="outline" className="text-[10px]">Frise temporelle</Badge>
            <Badge variant="outline" className="text-[10px]">Dérivés moléculaires</Badge>
            <Badge variant="outline" className="text-[10px]">Auteurs & concepts</Badge>
          </div>
        </div>
      )}
    </div>
  );
}
