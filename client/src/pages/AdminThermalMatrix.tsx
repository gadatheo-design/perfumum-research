import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Flame, Thermometer, Wind, AlertTriangle, Search, Info } from "lucide-react";

// ─── Constellations ABSORBE ──────────────────────────────────────────────────
const CONSTELLATION_CONFIG: Record<string, { color: string; bg: string; description: string }> = {
  "Mineral Halo": {
    color: "text-slate-300",
    bg: "bg-slate-700/40 border-slate-600/40",
    description: "Réservoirs minéraux, diffusion lente et stable",
  },
  "Resin Cathedral": {
    color: "text-amber-300",
    bg: "bg-amber-900/30 border-amber-700/40",
    description: "Résines et baumes, haute tenue, transformation douce",
  },
  "Dry Tobacco Spine": {
    color: "text-orange-300",
    bg: "bg-orange-900/30 border-orange-700/40",
    description: "Bois secs, tabac, sesquiterpènes — colonne vertébrale",
  },
  "Roast Engine": {
    color: "text-red-300",
    bg: "bg-red-900/30 border-red-700/40",
    description: "Pyrazines, phénols — moteur de torréfaction",
  },
  "Danger Tops": {
    color: "text-rose-300",
    bg: "bg-rose-900/40 border-rose-700/40",
    description: "Aldéhydes volatils, risque de saturation rapide",
  },
};

// ─── Score bar ───────────────────────────────────────────────────────────────
function ScoreBar({ value, max = 10, color = "bg-amber-500" }: { value: number | null; max?: number; color?: string }) {
  if (value === null || value === undefined) return <span className="text-xs text-slate-600">—</span>;
  const pct = Math.max(0, Math.min(100, ((value + max) / (max * 2)) * 100));
  const isNeg = value < 0;
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${isNeg ? "bg-rose-500" : color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-mono ${isNeg ? "text-rose-400" : "text-amber-300"}`}>
        {value > 0 ? `+${value}` : value}
      </span>
    </div>
  );
}

// ─── Metric pill ─────────────────────────────────────────────────────────────
function MetricPill({ label, value, max = 5 }: { label: string; value: number | null; max?: number }) {
  if (value === null || value === undefined) return null;
  const pct = Math.round((value / max) * 100);
  const color =
    pct >= 80 ? "bg-red-500/20 text-red-300 border-red-700/40" :
    pct >= 60 ? "bg-orange-500/20 text-orange-300 border-orange-700/40" :
    pct >= 40 ? "bg-yellow-500/20 text-yellow-300 border-yellow-700/40" :
    "bg-slate-700/40 text-slate-400 border-slate-600/40";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${color}`}>
      {label}: {value}
    </span>
  );
}

export default function AdminThermalMatrix() {
  const [search, setSearch] = useState("");
  const [filterConst, setFilterConst] = useState("all");
  const [sortBy, setSortBy] = useState<"tri" | "sai" | "hpi">("tri");

  const { data: materials, isLoading } = trpc.rawMaterials.getThermalMatrix.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  const constellations = useMemo(() => {
    if (!materials) return [];
    const seen = new Set<string>();
    (materials as any[]).forEach((m) => {
      if (m.thermal_constellation) seen.add(m.thermal_constellation);
    });
    return Array.from(seen);
  }, [materials]);

  const filtered = useMemo(() => {
    if (!materials) return [];
    return (materials as any[])
      .filter((m) => {
        const matchSearch =
          !search ||
          m.name?.toLowerCase().includes(search.toLowerCase()) ||
          m.thermal_constellation?.toLowerCase().includes(search.toLowerCase()) ||
          m.thermal_fate?.toLowerCase().includes(search.toLowerCase());
        const matchConst = filterConst === "all" || m.thermal_constellation === filterConst;
        return matchSearch && matchConst;
      })
      .sort((a, b) => {
        const key = `thermal_${sortBy}`;
        return (b[key] ?? -999) - (a[key] ?? -999);
      });
  }, [materials, search, filterConst, sortBy]);

  // Stats
  const stats = useMemo(() => {
    if (!materials) return null;
    const arr = materials as any[];
    const byConst: Record<string, number> = {};
    arr.forEach((m) => {
      const c = m.thermal_constellation || "Inconnu";
      byConst[c] = (byConst[c] || 0) + 1;
    });
    const avgTri = arr.reduce((s, m) => s + (m.thermal_tri ?? 0), 0) / arr.length;
    const avgSai = arr.reduce((s, m) => s + (m.thermal_sai ?? 0), 0) / arr.length;
    return { total: arr.length, byConst, avgTri: safeToFixed(avgTri, 1), avgSai: safeToFixed(avgSai, 1) };
  }, [materials]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-slate-200">
      {/* Header */}
      <div className="border-b border-slate-800 bg-[#0f0f0f]/95 sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <button className="text-slate-500 hover:text-slate-300 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
            </Link>
            <Thermometer className="w-5 h-5 text-amber-500" />
            <div>
              <h1 className="text-sm font-semibold text-slate-200">Matrice Thermique ABSORBE</h1>
              <p className="text-xs text-slate-500">Propriétés thermiques des matières premières</p>
            </div>
          </div>
          {stats && (
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>{stats.total} matériaux</span>
              <span>TRI moy: <span className="text-amber-400">{stats.avgTri}</span></span>
              <span>SAI moy: <span className="text-amber-400">{stats.avgSai}</span></span>
            </div>
          )}
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Légende des indicateurs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              icon: <Flame className="w-4 h-4 text-amber-500" />,
              title: "TRI — Thermal Resilience Index",
              desc: "Résistance globale à la chaleur. Positif = stable, négatif = fragile.",
              range: "-5 à +5",
            },
            {
              icon: <Wind className="w-4 h-4 text-blue-400" />,
              title: "SAI — Smoke Affinity Index",
              desc: "Affinité avec la fumée et les supports de combustion lente.",
              range: "0 à 25",
            },
            {
              icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
              title: "HPI — Heat Peril Index",
              desc: "Risque de dégradation ou de toxicité à la chaleur.",
              range: "1 à 10",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-slate-900/60 border border-slate-700/40 rounded-lg p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                {item.icon}
                <span className="text-xs font-semibold text-slate-300">{item.title}</span>
              </div>
              <p className="text-xs text-slate-500">{item.desc}</p>
              <span className="text-xs text-slate-600 font-mono">{item.range}</span>
            </div>
          ))}
        </div>

        {/* Constellations */}
        {stats && (
          <div>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Constellations ABSORBE
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterConst("all")}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                  filterConst === "all"
                    ? "bg-amber-600 text-white border-amber-600"
                    : "bg-slate-800 text-slate-400 border-slate-700 hover:border-amber-600/50"
                }`}
              >
                Toutes ({stats.total})
              </button>
              {Object.entries(stats.byConst).map(([name, count]) => {
                const cfg = CONSTELLATION_CONFIG[name];
                return (
                  <button
                    key={name}
                    onClick={() => setFilterConst(filterConst === name ? "all" : name)}
                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                      filterConst === name
                        ? "bg-amber-600 text-white border-amber-600"
                        : `${cfg?.bg || "bg-slate-800 border-slate-700"} ${cfg?.color || "text-slate-400"} hover:border-amber-600/50`
                    }`}
                  >
                    {name} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un matériau..."
              className="pl-9 bg-slate-900/60 border-slate-700/40 text-slate-200 placeholder:text-slate-600"
            />
          </div>
          <div className="flex gap-2">
            {(["tri", "sai", "hpi"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`px-3 py-2 rounded text-xs font-mono border transition-colors ${
                  sortBy === key
                    ? "bg-amber-600/20 text-amber-300 border-amber-600/50"
                    : "bg-slate-800 text-slate-500 border-slate-700 hover:border-amber-600/30"
                }`}
              >
                {key.toUpperCase()} ↓
              </button>
            ))}
          </div>
        </div>

        {/* Matrice */}
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-16 bg-slate-900/40 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-600">
              {filtered.length} matériau{filtered.length !== 1 ? "x" : ""} affiché{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="space-y-2">
              {filtered.map((mat: any) => {
                const cfg = CONSTELLATION_CONFIG[mat.thermal_constellation] || {
                  color: "text-slate-400",
                  bg: "bg-slate-800/40 border-slate-700/40",
                  description: "",
                };
                return (
                  <div
                    key={mat.id}
                    className="bg-slate-900/60 border border-slate-700/30 rounded-lg p-4 hover:border-slate-600/50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                      {/* Nom + constellation */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-200 truncate">{mat.name}</span>
                          {mat.thermal_constellation && (
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}
                            >
                              {mat.thermal_constellation}
                            </span>
                          )}
                        </div>
                        {mat.thermal_fate && (
                          <p className="text-xs text-slate-500 italic">{mat.thermal_fate}</p>
                        )}
                        {mat.thermal_best_mode && (
                          <p className="text-xs text-slate-600 font-mono">{mat.thermal_best_mode.trim()}</p>
                        )}
                      </div>

                      {/* Scores TRI / SAI / HPI */}
                      <div className="flex flex-col gap-1 shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600 w-8 font-mono">TRI</span>
                          <ScoreBar value={mat.thermal_tri} max={5} color="bg-amber-500" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600 w-8 font-mono">SAI</span>
                          <ScoreBar value={mat.thermal_sai} max={25} color="bg-blue-500" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600 w-8 font-mono">HPI</span>
                          <ScoreBar value={mat.thermal_hpi} max={10} color="bg-rose-500" />
                        </div>
                      </div>

                      {/* Métriques secondaires */}
                      <div className="flex flex-wrap gap-1 shrink-0 md:max-w-[200px]">
                        <MetricPill label="Vol" value={mat.thermal_volatility} />
                        <MetricPill label="Sur" value={mat.thermal_survival} />
                        <MetricPill label="Tra" value={mat.thermal_transformation} />
                        <MetricPill label="Fum" value={mat.thermal_smoke_harmony} />
                        {mat.thermal_irritant_risk > 0 && (
                          <MetricPill label="Irr" value={mat.thermal_irritant_risk} />
                        )}
                      </div>
                    </div>

                    {/* Comportement eau/graisse */}
                    {(mat.absorbe_behavior_water || mat.absorbe_behavior_fat) && (
                      <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {mat.absorbe_behavior_water && (
                          <div className="text-xs">
                            <span className="text-blue-400 font-semibold">Eau : </span>
                            <span className="text-slate-500">{mat.absorbe_behavior_water}</span>
                          </div>
                        )}
                        {mat.absorbe_behavior_fat && (
                          <div className="text-xs">
                            <span className="text-yellow-400 font-semibold">Graisse : </span>
                            <span className="text-slate-500">{mat.absorbe_behavior_fat}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Info */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
          <div className="text-xs text-slate-500">
            <p className="mb-1">
              <strong className="text-slate-400">Matrice ABSORBE</strong> — Système de classification thermique
              des matières premières pour la parfumerie par combustion lente (encens, tabac, espaces).
            </p>
            <p>
              TRI : Thermal Resilience Index · SAI : Smoke Affinity Index · HPI : Heat Peril Index ·
              Vol : Volatilité · Sur : Survie · Tra : Transformation · Fum : Harmonie fumée · Irr : Risque irritant
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
