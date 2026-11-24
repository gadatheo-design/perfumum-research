// @ts-nocheck
/**
 * TimelineBibliographie.tsx — Rapport 10 + Session 12
 * Frise chronologique D3.js multi-sources : PERFUMUM + OpenAlex + Wikidata
 * Couche 2 : Découvertes moléculaires aromatiques (points verts ♦) superposées
 * Axe horizontal par décennie, zoom/pan, filtres, export SVG
 */
import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  Clock, Download, Filter, Loader2, RefreshCw,
  BookOpen, Globe, Database, ExternalLink, ChevronRight, FlaskConical,
} from "lucide-react";

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

interface MoleculeDiscovery {
  id: string;
  year: number;
  label: string;
  formula?: string;
  discoverer?: string;
  wikidataUrl?: string;
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

const MOLECULE_COLOR = "#10b981"; // vert émeraude pour les découvertes moléculaires

// ─── Composant principal ──────────────────────────────────────────────────────

export default function TimelineBibliographie() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("parfum olfactif");
  const [yearFrom, setYearFrom] = useState<number | undefined>(1800);
  const [yearTo, setYearTo] = useState<number | undefined>(new Date().getFullYear());
  const [activeSources, setActiveSources] = useState<Source[]>(["perfumum", "openalex"]);
  const [colorBy, setColorBy] = useState<"source" | "type">("source");
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | MoleculeDiscovery | null>(null);
  const [selectedEventKind, setSelectedEventKind] = useState<"timeline" | "molecule">("timeline");

  // Couche moléculaire
  const [showMolecules, setShowMolecules] = useState(false);
  const [molEnabled, setMolEnabled] = useState(false);

  const { data, isLoading, refetch } = trpc.timeline.getTimelineData.useQuery(
    { query, yearFrom, yearTo, sources: activeSources, limit: 300 },
    { staleTime: 3 * 60 * 1000 }
  );

  const { data: statsData } = trpc.timeline.getTimelineStats.useQuery(undefined, {
    staleTime: 10 * 60 * 1000,
  });

  const { data: molData, isLoading: molLoading, refetch: molRefetch } = trpc.timeline.getMoleculeDiscoveries.useQuery(
    { yearFrom: yearFrom ?? 1800, yearTo: yearTo ?? new Date().getFullYear(), limit: 100 },
    { enabled: molEnabled, staleTime: 10 * 60 * 1000 }
  );

  // ─── Rendu D3 ──────────────────────────────────────────────────────────────

  const renderTimeline = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return;
    if (!data?.events) return;

    const events = data.events as TimelineEvent[];
    const molecules: MoleculeDiscovery[] = (showMolecules && molData?.events) ? molData.events : [];

    const container = containerRef.current;
    const W = container.clientWidth || 900;
    const H = 520;
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

    // Calcul du domaine temporel incluant les molécules
    const allYears = [
      ...events.map((e) => e.year),
      ...molecules.map((m) => m.year),
    ].filter(Boolean);
    const minY = yearFrom || (allYears.length ? Math.min(...allYears) : 1800);
    const maxY = yearTo || (allYears.length ? Math.max(...allYears) : new Date().getFullYear());

    const xScale = d3.scaleLinear().domain([minY, maxY]).range([0, iW]);

    // Jitter vertical déterministe pour les publications
    const jitter = (i: number) => ((Math.sin(i * 7.3 + 1.9) * 0.5 + 0.5) - 0.5) * iH * 0.65 + iH / 2;
    // Jitter pour les molécules (légèrement différent pour éviter les superpositions)
    const jitterMol = (i: number) => ((Math.sin(i * 5.1 + 3.7) * 0.5 + 0.5) - 0.5) * iH * 0.55 + iH / 2;

    const eventsY = events.map((e, i) => ({ ...e, jy: jitter(i) }));
    const moleculesY = molecules.map((m, i) => ({ ...m, jy: jitterMol(i) }));

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

    // ── Points publications ────────────────────────────────────────────────
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
      .on("click", (_, d: any) => {
        setSelectedEventKind("timeline");
        setSelectedEvent(d as TimelineEvent);
      });

    // ── Couche moléculaire (losanges verts ♦) ─────────────────────────────
    if (moleculesY.length > 0) {
      // Ligne de séparation visuelle (tirets verts)
      g.append("line")
        .attr("x1", 0).attr("x2", iW)
        .attr("y1", iH * 0.15).attr("y2", iH * 0.15)
        .attr("stroke", MOLECULE_COLOR).attr("stroke-width", 0.5)
        .attr("stroke-dasharray", "2,6").attr("stroke-opacity", 0.3);

      // Label de la couche
      g.append("text")
        .attr("x", 4).attr("y", iH * 0.12)
        .attr("font-size", "9px").attr("fill", MOLECULE_COLOR)
        .attr("fill-opacity", 0.7)
        .text("♦ Découvertes moléculaires (Wikidata)");

      // Losanges pour les molécules
      const molDots = g.selectAll(".md")
        .data(moleculesY)
        .join("path")
        .attr("class", "md")
        .attr("d", (d) => {
          const cx = xScale(d.year);
          const cy = d.jy;
          const r = 6;
          return `M ${cx} ${cy - r} L ${cx + r} ${cy} L ${cx} ${cy + r} L ${cx - r} ${cy} Z`;
        })
        .attr("fill", MOLECULE_COLOR)
        .attr("fill-opacity", 0.85)
        .attr("stroke", "#0b1120").attr("stroke-width", 1)
        .style("cursor", "pointer");

      // Étiquettes des molécules (nom court)
      g.selectAll(".mlbl")
        .data(moleculesY.filter((m) => m.label))
        .join("text")
        .attr("class", "mlbl")
        .attr("x", (d) => xScale(d.year) + 9)
        .attr("y", (d) => d.jy + 4)
        .attr("font-size", "8px")
        .attr("fill", MOLECULE_COLOR)
        .attr("fill-opacity", 0.8)
        .text((d) => d.label.length > 14 ? d.label.slice(0, 13) + "…" : d.label);

      molDots
        .on("mouseover", function () {
          d3.select(this)
            .attr("stroke", "#f8fafc").attr("stroke-width", 2)
            .attr("transform", function (d2: any) {
              const cx = xScale(d2.year);
              const cy = d2.jy;
              return `translate(${cx},${cy}) scale(1.4) translate(${-cx},${-cy})`;
            });
        })
        .on("mouseout", function () {
          d3.select(this)
            .attr("stroke", "#0b1120").attr("stroke-width", 1)
            .attr("transform", null);
        })
        .on("click", (_, d: any) => {
          setSelectedEventKind("molecule");
          setSelectedEvent(d as MoleculeDiscovery);
        });
    }

    // ── Légende couches ────────────────────────────────────────────────────
    if (moleculesY.length > 0) {
      const legendG = svg.append("g").attr("transform", `translate(${M.left + iW - 180}, ${M.top + 8})`);
      legendG.append("rect")
        .attr("width", 175).attr("height", 36)
        .attr("rx", 4).attr("fill", "#0f172a").attr("fill-opacity", 0.85)
        .attr("stroke", "#1e3a5f").attr("stroke-width", 1);
      legendG.append("circle")
        .attr("cx", 12).attr("cy", 12).attr("r", 5)
        .attr("fill", SOURCE_COLORS.perfumum).attr("fill-opacity", 0.82);
      legendG.append("text")
        .attr("x", 22).attr("y", 16)
        .attr("font-size", "9px").attr("fill", "#94a3b8")
        .text("Publications / Événements");
      // Losange
      legendG.append("path")
        .attr("d", "M 12 22 L 18 28 L 12 34 L 6 28 Z")
        .attr("fill", MOLECULE_COLOR).attr("fill-opacity", 0.85);
      legendG.append("text")
        .attr("x", 22).attr("y", 32)
        .attr("font-size", "9px").attr("fill", "#94a3b8")
        .text("Découvertes moléculaires");
    }

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
        // Mise à jour des losanges moléculaires
        if (moleculesY.length > 0) {
          g.selectAll(".md").attr("d", (d: any) => {
            const cx = nx(d.year);
            const cy = d.jy;
            const r = 6;
            return `M ${cx} ${cy - r} L ${cx + r} ${cy} L ${cx} ${cy + r} L ${cx - r} ${cy} Z`;
          });
          g.selectAll(".mlbl").attr("x", (d: any) => nx(d.year) + 9);
        }
      });

    svg.call(zoom);
  }, [data, molData, colorBy, yearFrom, yearTo, showMolecules]);

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

  const handleToggleMolecules = (checked: boolean) => {
    setShowMolecules(checked);
    if (checked && !molEnabled) {
      setMolEnabled(true);
    }
  };

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                      placeholder="1800" className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <Label className="text-xs">À</Label>
                    <Input type="number" value={yearTo ?? ""} min={1600} max={2100}
                      onChange={(e) => setYearTo(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder={String(new Date().getFullYear())} className="h-8 text-sm" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Sources bibliographiques</Label>
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
                {/* Toggle couche moléculaire */}
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5">
                    <FlaskConical className="h-3.5 w-3.5 text-emerald-500" />
                    Découvertes moléculaires
                  </Label>
                  <div className="flex items-center gap-2 pt-1">
                    <Switch
                      checked={showMolecules}
                      onCheckedChange={handleToggleMolecules}
                      className="data-[state=checked]:bg-emerald-600"
                    />
                    <span className="text-xs text-muted-foreground">
                      {showMolecules
                        ? molLoading
                          ? "Chargement Wikidata…"
                          : `${molData?.events?.length ?? 0} molécules`
                        : "Désactivé"}
                    </span>
                    {showMolecules && molEnabled && (
                      <Button variant="ghost" size="sm" className="h-6 px-1.5 text-xs" onClick={() => molRefetch()}>
                        <RefreshCw className={`h-3 w-3 ${molLoading ? "animate-spin" : ""}`} />
                      </Button>
                    )}
                  </div>
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
              {showMolecules && molData?.events && (
                <Card className="p-3 border-emerald-200 dark:border-emerald-800">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <FlaskConical className="h-3 w-3 text-emerald-500" /> Molécules
                  </p>
                  <p className="text-2xl font-bold" style={{ color: MOLECULE_COLOR }}>{molData.events.length}</p>
                </Card>
              )}
            </div>
          )}

          {/* Frise D3 */}
          <Card>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Chargement des données chronologiques…</span>
                </div>
              ) : (
                <div ref={containerRef} className="w-full overflow-hidden rounded-lg" style={{ minHeight: 520 }}>
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
                  {showMolecules && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="inline-block w-3 h-3 rotate-45 border-2" style={{ borderColor: MOLECULE_COLOR, backgroundColor: MOLECULE_COLOR + "55" }} />
                      <span>Découvertes moléculaires</span>
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground/40 ml-auto">
                    Taille ∝ citations · Molette pour zoomer · Cliquer pour détails
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Détail événement sélectionné */}
          {selectedEvent && selectedEventKind === "timeline" && (
            <Card className="border-indigo-500/30">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge className="text-xs" style={{ backgroundColor: SOURCE_COLORS[(selectedEvent as TimelineEvent).source] + "33", color: SOURCE_COLORS[(selectedEvent as TimelineEvent).source] }}>
                        {(selectedEvent as TimelineEvent).source}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{selectedEvent.year}</Badge>
                      {(selectedEvent as TimelineEvent).citedByCount && (
                        <Badge variant="outline" className="text-xs text-emerald-500">{(selectedEvent as TimelineEvent).citedByCount} citations</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm leading-snug">{(selectedEvent as TimelineEvent).title}</h3>
                    {(selectedEvent as TimelineEvent).authors && <p className="text-xs text-muted-foreground mt-0.5">{(selectedEvent as TimelineEvent).authors}</p>}
                    {(selectedEvent as TimelineEvent).journal && <p className="text-xs text-muted-foreground italic">{(selectedEvent as TimelineEvent).journal}</p>}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(null)} className="shrink-0">✕</Button>
                </div>
              </CardHeader>
              {((selectedEvent as TimelineEvent).description || (selectedEvent as TimelineEvent).doi || (selectedEvent as TimelineEvent).url) && (
                <CardContent className="pt-0">
                  {(selectedEvent as TimelineEvent).description && <p className="text-sm text-muted-foreground mb-3">{(selectedEvent as TimelineEvent).description}</p>}
                  <div className="flex gap-2 flex-wrap">
                    {(selectedEvent as TimelineEvent).doi && (
                      <a href={`https://doi.org/${(selectedEvent as TimelineEvent).doi}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                          <ExternalLink className="h-3 w-3" /> DOI
                        </Button>
                      </a>
                    )}
                    {(selectedEvent as TimelineEvent).url && !(selectedEvent as TimelineEvent).doi && (
                      <a href={(selectedEvent as TimelineEvent).url} target="_blank" rel="noopener noreferrer">
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

          {/* Détail molécule sélectionnée */}
          {selectedEvent && selectedEventKind === "molecule" && (
            <Card className="border-emerald-500/30">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge className="text-xs bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-300">
                        ♦ Découverte moléculaire
                      </Badge>
                      <Badge variant="outline" className="text-xs">{selectedEvent.year}</Badge>
                    </div>
                    <h3 className="font-semibold text-sm leading-snug italic">{(selectedEvent as MoleculeDiscovery).label}</h3>
                    {(selectedEvent as MoleculeDiscovery).formula && (
                      <p className="text-xs font-mono text-muted-foreground mt-0.5">
                        Formule : {(selectedEvent as MoleculeDiscovery).formula}
                      </p>
                    )}
                    {(selectedEvent as MoleculeDiscovery).discoverer && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Découvreur : {(selectedEvent as MoleculeDiscovery).discoverer}
                      </p>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(null)} className="shrink-0">✕</Button>
                </div>
              </CardHeader>
              {(selectedEvent as MoleculeDiscovery).wikidataUrl && (
                <CardContent className="pt-0">
                  <a href={(selectedEvent as MoleculeDiscovery).wikidataUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                      <ExternalLink className="h-3 w-3" /> Voir sur Wikidata
                    </Button>
                  </a>
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
                    <button key={event.id} onClick={() => { setSelectedEventKind("timeline"); setSelectedEvent(event as TimelineEvent); }}
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

          {/* Liste molécules (si activée) */}
          {showMolecules && molData?.events && molData.events.length > 0 && (
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-emerald-500" />
                  Découvertes moléculaires ({molData.events.length})
                  <span className="ml-auto text-xs font-normal text-muted-foreground">Wikidata SPARQL</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-3 font-medium text-xs">Année</th>
                        <th className="text-left py-2 px-3 font-medium text-xs">Molécule</th>
                        <th className="text-left py-2 px-3 font-medium text-xs hidden sm:table-cell">Formule</th>
                        <th className="text-left py-2 px-3 font-medium text-xs hidden md:table-cell">Découvreur</th>
                        <th className="text-left py-2 px-3 font-medium text-xs">Lien</th>
                      </tr>
                    </thead>
                    <tbody>
                      {molData.events.map((e: any) => (
                        <tr key={e.id}
                          className="border-b border-border/50 hover:bg-muted/30 cursor-pointer"
                          onClick={() => { setSelectedEventKind("molecule"); setSelectedEvent(e as MoleculeDiscovery); }}>
                          <td className="py-2 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold text-xs">{e.year}</td>
                          <td className="py-2 px-3 font-medium italic text-sm">{e.label}</td>
                          <td className="py-2 px-3 text-muted-foreground font-mono text-xs hidden sm:table-cell">{e.formula || '—'}</td>
                          <td className="py-2 px-3 text-muted-foreground text-xs hidden md:table-cell">{e.discoverer || '—'}</td>
                          <td className="py-2 px-3">
                            <a href={e.wikidataUrl} target="_blank" rel="noopener noreferrer"
                              onClick={(ev) => ev.stopPropagation()}
                              className="text-blue-600 hover:underline text-xs flex items-center gap-1">
                              <ExternalLink className="h-3 w-3" />WD
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
            <div className="flex items-center gap-1.5">
              <FlaskConical className="h-3.5 w-3.5" style={{ color: MOLECULE_COLOR }} />
              Découvertes moléculaires (Wikidata SPARQL)
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
