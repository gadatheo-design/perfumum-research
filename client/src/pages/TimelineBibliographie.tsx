/**
 * TimelineBibliographie.tsx — Rapport 10
 * Frise chronologique D3.js multi-sources : PERFUMUM + OpenAlex + Wikidata
 * Axe horizontal par décennie, zoom/pan, filtres, export SVG
 */
// @ts-nocheck
import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  Clock, Download, Filter, Loader2, RefreshCw,
  BookOpen, Globe, Database, ExternalLink, ChevronRight, FlaskConical,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ─── Types ────────────────────────────────────────────────────────────────────

type Source = "perfumum" | "openalex" | "wikidata";
type EventType = "publication" | "discovery" | "patent" | "event" | "artwork";

interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  source: Source;
  type: EventType;
  doi?: string;
  authors?: string;
  journal?: string;
  url?: string;
  description?: string;
  citedByCount?: number;
}

// ─── Couleurs ─────────────────────────────────────────────────────────────────

const SOURCE_COLORS: Record<Source, string> = {
  perfumum: "#6366f1",
  openalex: "#0ea5e9",
  wikidata: "#f59e0b",
};

const TYPE_COLORS: Record<EventType, string> = {
  publication: "#6366f1",
  discovery:   "#10b981",
  patent:      "#f59e0b",
  event:       "#ec4899",
  artwork:     "#8b5cf6",
};

// ─── Composant principal ──────────────────────────────────────────────────────

export default function TimelineBibliographie() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("parfum olfactif");
  const [yearFrom, setYearFrom] = useState<number | undefined>(1900);
  const [yearTo, setYearTo] = useState<number | undefined>(new Date().getFullYear());
  const [activeSources, setActiveSources] = useState<Source[]>(["perfumum", "openalex"]);
  const [colorBy, setColorBy] = useState<"source" | "type">("source");
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  const { data, isLoading, refetch } = trpc.timeline.getTimelineData.useQuery(
    { query, yearFrom, yearTo, sources: activeSources, limit: 300 },
    { staleTime: 3 * 60 * 1000 }
  );

  const { data: statsData } = trpc.timeline.getTimelineStats.useQuery(undefined, {
    staleTime: 10 * 60 * 1000,
  });

  // ─── Rendu D3 ──────────────────────────────────────────────────────────────

  const renderTimeline = useCallback(() => {
    if (!data?.events || !svgRef.current || !containerRef.current) return;

    const events = data.events as TimelineEvent[];
    const container = containerRef.current;
    const W = container.clientWidth || 900;
    const H = 500;
    const M = { top: 44, right: 32, bottom: 56, left: 48 };
    const iW = W - M.left - M.right;
    const iH = H - M.top - M.bottom;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", W)
      .attr("height", H)
      .attr("id", "timeline-biblio-svg")
      .style("background", "#0b1120");

    const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);

    const minY = yearFrom || (events.length ? Math.min(...events.map((e) => e.year)) : 1900);
    const maxY = yearTo || (events.length ? Math.max(...events.map((e) => e.year)) : new Date().getFullYear());

    const xScale = d3.scaleLinear().domain([minY, maxY]).range([0, iW]);

    // Jitter vertical déterministe
    const jitter = (i: number) => ((Math.sin(i * 7.3 + 1.9) * 0.5 + 0.5) - 0.5) * iH * 0.72 + iH / 2;
    const eventsY = events.map((e, i) => ({ ...e, jy: jitter(i) }));

    // ── Décennies ──────────────────────────────────────────────────────────
    const decades: number[] = [];
    for (let y = Math.ceil(minY / 10) * 10; y <= maxY; y += 10) decades.push(y);

    const decLines = g.selectAll(".dl").data(decades).join("line")
      .attr("class", "dl")
      .attr("x1", (d) => xScale(d)).attr("x2", (d) => xScale(d))
      .attr("y1", 0).attr("y2", iH)
      .attr("stroke", "#1e3a5f").attr("stroke-width", 1).attr("stroke-dasharray", "3,4");

    const decLabels = g.selectAll(".dlbl").data(decades).join("text")
      .attr("class", "dlbl")
      .attr("x", (d) => xScale(d)).attr("y", -10)
      .attr("text-anchor", "middle").attr("font-size", "10px").attr("fill", "#475569")
      .text((d) => `${d}s`);

    // ── Ligne centrale ─────────────────────────────────────────────────────
    g.append("line")
      .attr("x1", 0).attr("x2", iW)
      .attr("y1", iH / 2).attr("y2", iH / 2)
      .attr("stroke", "#1e3a5f").attr("stroke-width", 2);

    // ── Axe X ──────────────────────────────────────────────────────────────
    const xAxisG = g.append("g")
      .attr("transform", `translate(0,${iH})`)
      .call(d3.axisBottom(xScale).tickFormat((d) => String(d)).ticks(Math.max(5, Math.floor(iW / 80))));
    xAxisG.select(".domain").attr("stroke", "#334155");
    xAxisG.selectAll("text").attr("fill", "#94a3b8").attr("font-size", "11px");
    xAxisG.selectAll(".tick line").attr("stroke", "#334155");

    // ── Points ─────────────────────────────────────────────────────────────
    const dots = g.selectAll(".ed")
      .data(eventsY)
      .join("circle")
      .attr("class", "ed")
      .attr("cx", (d) => xScale(d.year))
      .attr("cy", (d) => d.jy)
      .attr("r", (d) => d.citedByCount ? Math.min(3 + Math.log10(d.citedByCount + 1) * 2, 10) : 5)
      .attr("fill", (d) => colorBy === "source" ? SOURCE_COLORS[d.source as Source] : TYPE_COLORS[d.type as EventType])
      .attr("fill-opacity", 0.82)
      .attr("stroke", "#0b1120").attr("stroke-width", 1)
      .style("cursor", "pointer");

    dots
      .on("mouseover", function () {
        d3.select(this).attr("stroke", "#f8fafc").attr("stroke-width", 2)
          .attr("r", (d2: any) => (d2.citedByCount ? Math.min(3 + Math.log10(d2.citedByCount + 1) * 2, 10) : 5) + 3);
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke", "#0b1120").attr("stroke-width", 1)
          .attr("r", (d2: any) => d2.citedByCount ? Math.min(3 + Math.log10(d2.citedByCount + 1) * 2, 10) : 5);
      })
      .on("click", (_, d: any) => setSelectedEvent(d as TimelineEvent));

    // ── Zoom ───────────────────────────────────────────────────────────────
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 25])
      .translateExtent([[0, 0], [W, H]])
      .on("zoom", (event) => {
        const nx = event.transform.rescaleX(xScale);
        xAxisG.call(d3.axisBottom(nx).tickFormat((d) => String(d)).ticks(Math.max(5, Math.floor(iW / 80))));
        dots.attr("cx", (d: any) => nx(d.year));
        decLines.attr("x1", (d: any) => nx(d)).attr("x2", (d: any) => nx(d));
        decLabels.attr("x", (d: any) => nx(d));
      });

    svg.call(zoom);
  }, [data, colorBy, yearFrom, yearTo]);

  useEffect(() => { renderTimeline(); }, [renderTimeline]);

  // ─── Export SVG ────────────────────────────────────────────────────────────
  const exportSVG = () => {
    const el = svgRef.current;
    if (!el) return;
    const blob = new Blob([new XMLSerializer().serializeToString(el)], { type: "image/svg+xml" });
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `perfumum-timeline-${new Date().getFullYear()}.svg` });
    a.click();
  };

  const toggleSource = (src: Source) =>
    setActiveSources((p) => p.includes(src) ? (p.length > 1 ? p.filter((s) => s !== src) : p) : [...p, src]);

  // ─── Rendu ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />

      <main className="flex-1">
        {/* En-tête */}
        <section className="border-b bg-card/40 py-8">
          <div className="container">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Clock className="h-7 w-7 text-indigo-500" />
                <div>
                  <h1 className="text-2xl font-bold">Frise Bibliographique</h1>
                  <p className="text-sm text-muted-foreground">
                    {statsData?.totalBiblio ?? "—"} références PERFUMUM ·{" "}
                    {statsData?.yearRange?.min ?? "—"}–{statsData?.yearRange?.max ?? "—"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
                  Actualiser
                </Button>
                <Button variant="outline" size="sm" onClick={exportSVG}>
                  <Download className="h-4 w-4 mr-1.5" />
                  Export SVG
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container py-6 space-y-6">

          {/* Filtres */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filtres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Recherche</Label>
                  <Input value={query} onChange={(e) => setQuery(e.target.value)}
                    placeholder="parfum olfactif…" className="h-8 text-sm"
                    onKeyDown={(e) => e.key === "Enter" && refetch()} />
                </div>
                <div className="flex gap-2">
                  <div className="space-y-1.5 flex-1">
                    <Label className="text-xs">De</Label>
                    <Input type="number" value={yearFrom ?? ""} min={1600} max={2100}
                      onChange={(e) => setYearFrom(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="1900" className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <Label className="text-xs">À</Label>
                    <Input type="number" value={yearTo ?? ""} min={1600} max={2100}
                      onChange={(e) => setYearTo(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder={String(new Date().getFullYear())} className="h-8 text-sm" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Sources</Label>
                  <div className="flex gap-1.5 flex-wrap">
                    {(["perfumum", "openalex", "wikidata"] as Source[]).map((src) => (
                      <button key={src} onClick={() => toggleSource(src)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold border transition-colors ${activeSources.includes(src) ? "text-white border-transparent" : "text-muted-foreground border-border"}`}
                        style={activeSources.includes(src) ? { backgroundColor: SOURCE_COLORS[src] } : {}}>
                        {src === "perfumum" ? "P" : src === "openalex" ? "OA" : "WD"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Colorier par</Label>
                  <Select value={colorBy} onValueChange={(v) => setColorBy(v as "source" | "type")}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="source">Source</SelectItem>
                      <SelectItem value="type">Type</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats rapides */}
          {data?.stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card className="p-3">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{data.stats.totalEvents}</p>
              </Card>
              {Object.entries(data.stats.bySource).map(([src, count]) => (
                <Card key={src} className="p-3">
                  <p className="text-xs text-muted-foreground capitalize">{src}</p>
                  <p className="text-2xl font-bold" style={{ color: SOURCE_COLORS[src as Source] }}>{count as number}</p>
                </Card>
              ))}
            </div>
          )}

          {/* Frise D3 */}
          <Card>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Chargement des données chronologiques…</span>
                </div>
              ) : (
                <div ref={containerRef} className="w-full overflow-hidden rounded-lg" style={{ minHeight: 500 }}>
                  <svg ref={svgRef} className="w-full" />
                </div>
              )}
              {!isLoading && (
                <div className="mt-3 flex flex-wrap gap-3 items-center">
                  {colorBy === "source"
                    ? (["perfumum", "openalex", "wikidata"] as Source[]).map((src) => (
                        <div key={src} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: SOURCE_COLORS[src] }} />
                          <span className="capitalize">{src}</span>
                          <span className="opacity-50">({data?.stats.bySource[src] ?? 0})</span>
                        </div>
                      ))
                    : (Object.entries(TYPE_COLORS) as [EventType, string][]).map(([type, color]) => (
                        <div key={type} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: color }} />
                          <span className="capitalize">{type}</span>
                        </div>
                      ))
                  }
                  <span className="text-xs text-muted-foreground/40 ml-auto">
                    Taille ∝ citations · Molette pour zoomer · Cliquer pour détails
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Détail événement sélectionné */}
          {selectedEvent && (
            <Card className="border-indigo-500/30">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge className="text-xs" style={{ backgroundColor: SOURCE_COLORS[selectedEvent.source] + "33", color: SOURCE_COLORS[selectedEvent.source] }}>
                        {selectedEvent.source}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{selectedEvent.year}</Badge>
                      {selectedEvent.citedByCount && (
                        <Badge variant="outline" className="text-xs text-emerald-500">{selectedEvent.citedByCount} citations</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm leading-snug">{selectedEvent.title}</h3>
                    {selectedEvent.authors && <p className="text-xs text-muted-foreground mt-0.5">{selectedEvent.authors}</p>}
                    {selectedEvent.journal && <p className="text-xs text-muted-foreground italic">{selectedEvent.journal}</p>}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(null)} className="shrink-0">✕</Button>
                </div>
              </CardHeader>
              {(selectedEvent.description || selectedEvent.doi || selectedEvent.url) && (
                <CardContent className="pt-0">
                  {selectedEvent.description && <p className="text-sm text-muted-foreground mb-3">{selectedEvent.description}</p>}
                  <div className="flex gap-2 flex-wrap">
                    {selectedEvent.doi && (
                      <a href={`https://doi.org/${selectedEvent.doi}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                          <ExternalLink className="h-3 w-3" /> DOI
                        </Button>
                      </a>
                    )}
                    {selectedEvent.url && !selectedEvent.doi && (
                      <a href={selectedEvent.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                          <ExternalLink className="h-3 w-3" /> Ouvrir
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Liste des événements */}
          {data?.events && data.events.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  Événements récents ({Math.min(data.events.length, 25)} / {data.events.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5 max-h-80 overflow-y-auto">
                  {data.events.slice(0, 25).map((event: any) => (
                    <button key={event.id} onClick={() => setSelectedEvent(event as TimelineEvent)}
                      className="w-full text-left flex items-start gap-2.5 p-2 rounded hover:bg-accent transition-colors group">
                      <span className="mt-1.5 shrink-0 w-2 h-2 rounded-full"
                        style={{ backgroundColor: SOURCE_COLORS[event.source as Source] }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.year}{event.journal ? ` · ${event.journal}` : ""}{event.authors ? ` · ${event.authors.split(",")[0]}` : ""}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground shrink-0 mt-1" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Décennies actives */}
          {statsData?.topDecades && statsData.topDecades.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="h-4 w-4 text-indigo-500" />
                  Décennies les plus actives (base PERFUMUM)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {statsData.topDecades.map((d: any) => (
                    <button key={d.decade}
                      onClick={() => { setYearFrom(d.decade); setYearTo(d.decade + 9); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs hover:bg-accent transition-colors">
                      <span className="font-semibold">{d.decade}s</span>
                      <Badge variant="secondary" className="text-xs">{d.count}</Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sources */}
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5" style={{ color: SOURCE_COLORS.perfumum }} />
              Base PERFUMUM (bibliographie interne)
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" style={{ color: SOURCE_COLORS.openalex }} />
              OpenAlex (250M+ articles scientifiques)
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" style={{ color: SOURCE_COLORS.wikidata }} />
              Wikidata (base de connaissances libre)
            </div>
          </div>

          {/* Onglet Découvertes moléculaires */}
          <MoleculeDiscoveriesPanel />

        </div>
      </main>
      <Footer />
    </div>
  );
}

// ── Panneau Découvertes moléculaires (Wikidata SPARQL) ──────────────────────────────────
function MoleculeDiscoveriesPanel() {
  const [yearFrom, setYearFrom] = useState(1800);
  const [yearTo, setYearTo] = useState(new Date().getFullYear());
  const [enabled, setEnabled] = useState(false);

  const { data, isLoading, refetch } = trpc.timeline.getMoleculeDiscoveries.useQuery(
    { yearFrom, yearTo, limit: 60 },
    { enabled, staleTime: 10 * 60 * 1000 }
  );

  return (
    <Card className="border-emerald-200 dark:border-emerald-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-emerald-600" />
          Découvertes moléculaires aromatiques
          <span className="ml-auto text-xs font-normal text-muted-foreground bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded-full">Wikidata SPARQL</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <Label className="text-xs">De</Label>
            <Input type="number" value={yearFrom} min={1700} max={2100}
              onChange={(e) => setYearFrom(Number(e.target.value))} className="h-8 text-sm w-24" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">À</Label>
            <Input type="number" value={yearTo} min={1700} max={2100}
              onChange={(e) => setYearTo(Number(e.target.value))} className="h-8 text-sm w-24" />
          </div>
          <Button size="sm" onClick={() => { setEnabled(true); setTimeout(() => refetch(), 50); }}
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <FlaskConical className="h-4 w-4 mr-1.5" />}
            {enabled ? "Relancer" : "Interroger Wikidata"}
          </Button>
        </div>

        {data?.error && (
          <p className="text-sm text-red-600 dark:text-red-400">{data.error}</p>
        )}

        {enabled && !isLoading && data?.events && data.events.length > 0 && (
          <>
            <p className="text-xs text-muted-foreground">{data.events.length} molécule(s) trouvée(s) sur Wikidata</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 font-medium">Année</th>
                    <th className="text-left py-2 px-3 font-medium">Molécule</th>
                    <th className="text-left py-2 px-3 font-medium">Formule</th>
                    <th className="text-left py-2 px-3 font-medium">Découvreur</th>
                    <th className="text-left py-2 px-3 font-medium">Lien</th>
                  </tr>
                </thead>
                <tbody>
                  {data.events.map((e: any) => (
                    <tr key={e.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-2 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{e.year}</td>
                      <td className="py-2 px-3 font-medium italic">{e.label}</td>
                      <td className="py-2 px-3 text-muted-foreground font-mono text-xs">{e.formula || '—'}</td>
                      <td className="py-2 px-3 text-muted-foreground">{e.discoverer || '—'}</td>
                      <td className="py-2 px-3">
                        <a href={e.wikidataUrl} target="_blank" rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-xs flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />Wikidata
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {enabled && !isLoading && data?.events?.length === 0 && !data?.error && (
          <p className="text-sm text-muted-foreground text-center py-4">Aucune molécule trouvée pour cette période.</p>
        )}
      </CardContent>
    </Card>
  );
}


