/**
 * AtlasOlfactif.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Porte d'entrée n°5 — Navigation par le lieu (smellscape géo-temporel)
 *
 * Paradigme Odeuropa : chaque lieu à chaque époque possède un smellscape unique.
 * La carte permet d'entrer dans les fils narratifs PERFUMUM par la géographie
 * et par le temps, révélant les connexions entre lieux, plantes et molécules.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  BookOpen,
  Leaf,
  FlaskConical,
  ArrowRight,
  Image as ImageIcon,
  Clock,
  Globe,
  ChevronRight,
  Flame,
  Wind,
} from "lucide-react";

// ── Coordonnées géographiques des storylines (extensible) ─────────────────────
// Les storylines ont des geographic_scope textuels ; on mappe les centres
// géographiques principaux pour la visualisation cartographique.

interface StorylineGeoData {
  slug: string;
  lat: number;
  lng: number;
  region: string;
  color: string;
}

const STORYLINE_GEO: Record<string, StorylineGeoData> = {
  "route-encens": { slug: "route-encens", lat: 17.5, lng: 44.0, region: "Arabie du Sud / Méditerranée", color: "#d97706" },
  "tabac-rituel-amerindien": { slug: "tabac-rituel-amerindien", lat: 10.0, lng: -75.0, region: "Amériques", color: "#7c3aed" },
  "nardostachys-nard-perdu": { slug: "nardostachys-nard-perdu", lat: 28.0, lng: 84.0, region: "Himalaya", color: "#059669" },
  "burkina-faso-combustion-lente": { slug: "burkina-faso-combustion-lente", lat: 12.4, lng: -1.5, region: "Sahel ouest-africain", color: "#dc2626" },
  "atlas-mnemosyne": { slug: "atlas-mnemosyne", lat: 46.5, lng: 2.5, region: "France / Europe", color: "#2563eb" },
  "tabac-oriental": { slug: "tabac-oriental", lat: 39.0, lng: 35.0, region: "Méditerranée orientale", color: "#9333ea" },
  "vetiver-haiti": { slug: "vetiver-haiti", lat: 19.0, lng: -72.5, region: "Haïti / Tropiques", color: "#16a34a" },
  "cannabis-landrace": { slug: "cannabis-landrace", lat: 34.5, lng: 69.0, region: "Asie centrale", color: "#ca8a04" },
};

// ── Couleurs par axe narratif ─────────────────────────────────────────────────

const AXIS_COLORS: Record<string, string> = {
  route_encens: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  tabac_rituel: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  plantes_menacees: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  pyrolyse_rituelle: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  atlas_mnemosyne: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  combustion: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  terroir: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  default: "bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300",
};

// ── Icônes par axe narratif ───────────────────────────────────────────────────

function AxisIcon({ axis }: { axis: string }) {
  switch (axis) {
    case "route_encens": return <Wind className="w-4 h-4" />;
    case "tabac_rituel": return <Flame className="w-4 h-4" />;
    case "plantes_menacees": return <Leaf className="w-4 h-4" />;
    case "pyrolyse_rituelle": return <Flame className="w-4 h-4" />;
    case "atlas_mnemosyne": return <BookOpen className="w-4 h-4" />;
    case "combustion": return <Flame className="w-4 h-4" />;
    case "terroir": return <Globe className="w-4 h-4" />;
    default: return <MapPin className="w-4 h-4" />;
  }
}

// ── Carte SVG simplifiée du monde ─────────────────────────────────────────────
// Projection équirectangulaire simplifiée : lat/lng → x/y sur viewBox 800×400

function latLngToSvg(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng + 180) / 360) * 800;
  const y = ((90 - lat) / 180) * 400;
  return { x, y };
}

interface StorylineMapPoint {
  id: number;
  title: string;
  slug: string;
  geographic_scope: string;
  period_label: string;
  period_start_year: number | null;
  period_end_year: number | null;
  narrative_axis: string;
  status: string;
  smellscape_description?: string;
  lat?: number | null;
  lng?: number | null;
}

interface WorldMapProps {
  storylines: StorylineMapPoint[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  yearRange: [number, number];
}

function WorldMap({ storylines, selectedId, onSelect, yearRange }: WorldMapProps) {
  const filteredStorylines = useMemo(() => {
    return storylines.filter((s) => {
      const start = s.period_start_year ?? -9999;
      const end = s.period_end_year ?? 9999;
      return start <= yearRange[1] && end >= yearRange[0];
    });
  }, [storylines, yearRange]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-border bg-stone-900/50">
      <svg
        viewBox="0 0 800 400"
        className="w-full"
        style={{ background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)" }}
      >
        {/* Grille de latitude/longitude */}
        {[-60, -30, 0, 30, 60].map((lat) => {
          const y = ((90 - lat) / 180) * 400;
          return (
            <line key={`lat-${lat}`} x1="0" y1={y} x2="800" y2={y}
              stroke="#334155" strokeWidth="0.5" strokeDasharray="4,4" />
          );
        })}
        {[-120, -60, 0, 60, 120].map((lng) => {
          const x = ((lng + 180) / 360) * 800;
          return (
            <line key={`lng-${lng}`} x1={x} y1="0" x2={x} y2="400"
              stroke="#334155" strokeWidth="0.5" strokeDasharray="4,4" />
          );
        })}

        {/* Continents simplifiés (formes approximatives) */}
        {/* Europe */}
        <ellipse cx="420" cy="140" rx="35" ry="25" fill="#1e3a5f" opacity="0.6" />
        {/* Afrique */}
        <ellipse cx="420" cy="230" rx="40" ry="55" fill="#1e3a5f" opacity="0.6" />
        {/* Amérique du Nord */}
        <ellipse cx="185" cy="155" rx="55" ry="45" fill="#1e3a5f" opacity="0.6" />
        {/* Amérique du Sud */}
        <ellipse cx="215" cy="265" rx="35" ry="50" fill="#1e3a5f" opacity="0.6" />
        {/* Asie */}
        <ellipse cx="580" cy="160" rx="90" ry="50" fill="#1e3a5f" opacity="0.6" />
        {/* Océanie */}
        <ellipse cx="660" cy="290" rx="35" ry="25" fill="#1e3a5f" opacity="0.6" />

        {/* Équateur */}
        <line x1="0" y1="200" x2="800" y2="200" stroke="#475569" strokeWidth="1" />
        <text x="5" y="198" fill="#475569" fontSize="8">Équateur</text>

        {/* Points des storylines */}
        {filteredStorylines.map((storyline) => {
          // Priorité aux coordonnées réelles de la base, fallback sur STORYLINE_GEO
          const geoFallback = STORYLINE_GEO[storyline.slug];
          const lat = storyline.lat != null ? Number(storyline.lat) : geoFallback?.lat;
          const lng = storyline.lng != null ? Number(storyline.lng) : geoFallback?.lng;
          if (lat == null || lng == null) return null;
          const { x, y } = latLngToSvg(lat, lng);
          const isSelected = storyline.id === selectedId;
          // Couleur : axe narratif en priorité, puis fallback STORYLINE_GEO
          const SVG_AXIS_COLORS: Record<string, string> = {
            route_encens: "#d97706", tabac_rituel: "#7c3aed", plantes_menacees: "#059669",
            pyrolyse_rituelle: "#dc2626", atlas_mnemosyne: "#2563eb", combustion: "#ea580c",
            terroir: "#16a34a", botanique: "#22c55e", chimie: "#8b5cf6", rituel: "#ef4444",
            formulation: "#14b8a6", comparaison: "#f97316", patrimoine: "#3b82f6", autre: "#64748b",
          };
          const color = SVG_AXIS_COLORS[storyline.narrative_axis] ?? geoFallback?.color ?? "#64748b";

          return (
            <g key={storyline.id} onClick={() => onSelect(storyline.id)} style={{ cursor: "pointer" }}>
              {/* Halo animé pour le point sélectionné */}
              {isSelected && (
                <circle cx={x} cy={y} r="20" fill={color} opacity="0.2">
                  <animate attributeName="r" values="14;22;14" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              {/* Cercle principal */}
              <circle
                cx={x} cy={y}
                r={isSelected ? 9 : 7}
                fill={color}
                stroke={isSelected ? "white" : "rgba(255,255,255,0.4)"}
                strokeWidth={isSelected ? 2 : 1}
                opacity={0.9}
              />
              {/* Étiquette */}
              <text
                x={x + 12} y={y + 4}
                fill="white"
                fontSize="8"
                fontWeight={isSelected ? "bold" : "normal"}
                opacity={isSelected ? 1 : 0.7}
                style={{ pointerEvents: "none" }}
              >
                {storyline.title.split("—")[0].trim().substring(0, 20)}
              </text>
            </g>
          );
        })}

        {/* Légende */}
        <text x="10" y="390" fill="#64748b" fontSize="8">
          PERFUMUM — Atlas Olfactif — {filteredStorylines.length} fil{filteredStorylines.length > 1 ? "s" : ""} narratif{filteredStorylines.length > 1 ? "s" : ""}
        </text>
      </svg>

      {/* Overlay si aucun storyline dans la période */}
      {filteredStorylines.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
          <p className="text-white/70 text-sm">Aucun fil narratif dans cette période</p>
        </div>
      )}
    </div>
  );
}

// ── Carte d'un storyline ──────────────────────────────────────────────────────

function StorylineCard({ storyline, isSelected, onClick }: {
  storyline: StorylineMapPoint;
  isSelected: boolean;
  onClick: () => void;
}) {
  const axisColor = AXIS_COLORS[storyline.narrative_axis] ?? AXIS_COLORS.default;
  const geo = STORYLINE_GEO[storyline.slug];
  const hasCoords = (storyline.lat != null && storyline.lng != null) || geo != null;

  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? "ring-2 ring-primary shadow-md" : "hover:border-border"
      }`}
    >
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-tight line-clamp-2">{storyline.title}</h3>
          <Link href={`/storyline/${storyline.slug}`} onClick={(e) => e.stopPropagation()}>
            <ChevronRight className="w-4 h-4 text-muted-foreground hover:text-foreground shrink-0 mt-0.5" />
          </Link>
        </div>

        {/* Axe narratif */}
        <Badge className={`text-xs ${axisColor} inline-flex items-center gap-1`}>
          <AxisIcon axis={storyline.narrative_axis} />
          {storyline.narrative_axis?.replace(/_/g, " ")}
        </Badge>

        {/* Période */}
        {storyline.period_label && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3 h-3 shrink-0" />
            <span>{storyline.period_label}</span>
          </div>
        )}

        {/* Géographie */}
        {storyline.geographic_scope && (
          <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{storyline.geographic_scope}</span>
          </div>
        )}

        {/* Smellscape */}
        {storyline.smellscape_description && (
          <p className="text-xs text-muted-foreground italic line-clamp-2 pt-1 border-t border-border/50">
            {storyline.smellscape_description}
          </p>
        )}

        {/* Indicateur géo disponible */}
        {hasCoords && safeToFixed(
          <div className="flex items-center gap-1.5 text-xs text-blue-500/80">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            {storyline.lat != null && storyline.lng != null ? (
              <span className="font-mono">{Number(storyline.lat, 2)}°, {NumbersafeToFixed(storyline.lng, 2)}°</span>
            ) : geo ? (
              <span>{geo.region}</span>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────

export default function AtlasOlfactif() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [yearRange, setYearRange] = useState<[number, number]>([-3000, 2035]);

  const { data, isLoading } = trpc.storylines.list.useQuery(
    { status: "active", limit: 50 },
    { staleTime: 5 * 60 * 1000 }
  );

  const storylines: StorylineMapPoint[] = useMemo(() => {
    return ((data as any)?.storylines ?? []) as StorylineMapPoint[];
  }, [data]);

  const selectedStoryline = useMemo(() => {
    return storylines.find((s) => s.id === selectedId) ?? null;
  }, [storylines, selectedId]);

  // Filtrer par période
  const filteredStorylines = useMemo(() => {
    return storylines.filter((s) => {
      const start = s.period_start_year ?? -9999;
      const end = s.period_end_year ?? 9999;
      return start <= yearRange[1] && end >= yearRange[0];
    });
  }, [storylines, yearRange]);

  const formatYear = (y: number) => {
    if (y < 0) return `${Math.abs(y)} av. J.-C.`;
    if (y > 2000) return y.toString();
    return `${y} ap. J.-C.`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative border-b border-border bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-blue-400 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-indigo-400 blur-3xl" />
        </div>
        <div className="relative container py-12 md:py-16">
          <div className="flex items-center gap-2 text-blue-300/70 text-sm mb-4">
            <Link href="/">
              <span className="hover:text-blue-300 transition-colors cursor-pointer">PERFUMUM</span>
            </Link>
            <ArrowRight className="w-3 h-3" />
            <span>Atlas Olfactif</span>
          </div>
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🗺️</span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Atlas Olfactif
              </h1>
            </div>
            <p className="text-blue-200 text-lg leading-relaxed mb-2">
              Entrer par le lieu pour découvrir le smellscape.
            </p>
            <p className="text-blue-300/70 text-sm leading-relaxed">
              Chaque point sur la carte est un fil narratif PERFUMUM ancré dans un territoire
              et une époque. Le curseur temporel révèle les connexions entre lieux, plantes
              et molécules à travers l'histoire olfactive du monde.
            </p>
            <blockquote className="mt-4 pl-4 border-l-2 border-blue-500/50 text-blue-300/60 text-sm italic">
              "Exploring these links that jump across genre, time or space is what makes smell
              such a fascinating tool for storytelling."
              <span className="block mt-1 text-blue-400/50 not-italic">— Odeuropa, The Olfactory Storytelling Toolkit, 2023</span>
            </blockquote>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        {/* Curseur temporel */}
        <div className="space-y-4 p-5 rounded-xl border border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Curseur temporel</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="font-mono text-xs">
                {formatYear(yearRange[0])}
              </Badge>
              <span className="text-muted-foreground">→</span>
              <Badge variant="outline" className="font-mono text-xs">
                {formatYear(yearRange[1])}
              </Badge>
            </div>
          </div>
          <Slider
            min={-3000}
            max={2035}
            step={100}
            value={yearRange}
            onValueChange={(v) => setYearRange(v as [number, number])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>3000 av. J.-C.</span>
            <span>Antiquité</span>
            <span>Moyen Âge</span>
            <span>Moderne</span>
            <span>2035</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {filteredStorylines.length} fil{filteredStorylines.length > 1 ? "s" : ""} narratif{filteredStorylines.length > 1 ? "s" : ""} dans cette période
          </p>
        </div>

        {/* Carte + liste */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carte */}
          <div className="lg:col-span-2 space-y-4">
            {isLoading ? (
              <Skeleton className="w-full aspect-[2/1] rounded-xl" />
            ) : (
              <WorldMap
                storylines={storylines}
                selectedId={selectedId}
                onSelect={(id) => setSelectedId(selectedId === id ? null : id)}
                yearRange={yearRange}
              />
            )}

            {/* Détail du storyline sélectionné */}
            {selectedStoryline && (
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{selectedStoryline.title}</CardTitle>
                    <Link href={`/storyline/${selectedStoryline.slug}`}>
                      <button className="flex items-center gap-1 text-xs text-primary hover:underline shrink-0">
                        Lire le fil narratif
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {selectedStoryline.smellscape_description && (
                    <p className="text-muted-foreground italic leading-relaxed">
                      {selectedStoryline.smellscape_description}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground block mb-1">Période</span>
                      <span>{selectedStoryline.period_label}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Territoire</span>
                      <span className="line-clamp-2">{selectedStoryline.geographic_scope}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Liste des storylines */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Fils narratifs ({filteredStorylines.length})
            </h2>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))
            ) : filteredStorylines.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <Globe className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>Aucun fil narratif dans cette période</p>
              </div>
            ) : (
              filteredStorylines.map((storyline) => (
                <StorylineCard
                  key={storyline.id}
                  storyline={storyline}
                  isSelected={storyline.id === selectedId}
                  onClick={() => setSelectedId(selectedId === storyline.id ? null : storyline.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Section navigation narrative — 5 portes d'entrée */}
        <div className="border-t border-border pt-8">
          <h3 className="text-base font-semibold mb-4 text-muted-foreground uppercase tracking-wider text-xs">
            Les 5 portes d'entrée PERFUMUM
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { href: "/plantes", icon: <Leaf className="w-5 h-5" />, label: "Plantes", desc: "La source matérielle", color: "text-green-600 dark:text-green-400" },
              { href: "/molecules", icon: <FlaskConical className="w-5 h-5" />, label: "Molécules", desc: "Le stimulus chimique", color: "text-blue-600 dark:text-blue-400" },
              { href: "/storylines", icon: <BookOpen className="w-5 h-5" />, label: "Fils narratifs", desc: "L'expérience culturelle", color: "text-purple-600 dark:text-purple-400" },
              { href: "/galerie-olfactive", icon: <ImageIcon className="w-5 h-5" />, label: "Galerie", desc: "L'iconographie", color: "text-amber-600 dark:text-amber-400" },
              { href: "/atlas", icon: <MapPin className="w-5 h-5" />, label: "Atlas", desc: "Le smellscape", color: "text-rose-600 dark:text-rose-400" },
            ].map((door) => (
              <Link key={door.href} href={door.href}>
                <Card className={`p-4 hover:shadow-sm transition-all cursor-pointer border-border/50 hover:border-border group ${door.href === "/atlas" ? "ring-1 ring-blue-500/30 bg-blue-50/5" : ""}`}>
                  <div className={`${door.color} mb-2 group-hover:scale-110 transition-transform`}>
                    {door.icon}
                  </div>
                  <p className="text-sm font-semibold">{door.label}</p>
                  <p className="text-xs text-muted-foreground">{door.desc}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
