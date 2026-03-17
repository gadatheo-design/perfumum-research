import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Leaf, AlertTriangle, ShieldAlert, Skull, Info, FlaskConical, ChevronDown, ChevronUp } from "lucide-react";

// ─── UICN config ────────────────────────────────────────────────────────────
const UICN_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode; description: string }> = {
  EX: {
    label: "Éteinte",
    color: "text-gray-900",
    bg: "bg-gray-900",
    border: "border-gray-900",
    icon: <Skull className="w-3.5 h-3.5" />,
    description: "Aucun individu connu encore en vie",
  },
  EW: {
    label: "Éteinte à l'état sauvage",
    color: "text-gray-700",
    bg: "bg-gray-700",
    border: "border-gray-700",
    icon: <Skull className="w-3.5 h-3.5" />,
    description: "Ne survit qu'en culture ou captivité",
  },
  CR: {
    label: "En danger critique",
    color: "text-red-700",
    bg: "bg-red-600",
    border: "border-red-600",
    icon: <ShieldAlert className="w-3.5 h-3.5" />,
    description: "Risque extrêmement élevé d'extinction",
  },
  EN: {
    label: "En danger",
    color: "text-orange-700",
    bg: "bg-orange-500",
    border: "border-orange-500",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    description: "Risque élevé d'extinction à l'état sauvage",
  },
  VU: {
    label: "Vulnérable",
    color: "text-yellow-700",
    bg: "bg-yellow-500",
    border: "border-yellow-500",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    description: "Risque élevé d'extinction à moyen terme",
  },
  NT: {
    label: "Quasi menacée",
    color: "text-lime-700",
    bg: "bg-lime-500",
    border: "border-lime-500",
    icon: <Info className="w-3.5 h-3.5" />,
    description: "Proche du seuil de vulnérabilité",
  },
  DD: {
    label: "Données insuffisantes",
    color: "text-blue-700",
    bg: "bg-blue-500",
    border: "border-blue-500",
    icon: <Info className="w-3.5 h-3.5" />,
    description: "Évaluation impossible faute de données",
  },
  LC: {
    label: "Préoccupation mineure",
    color: "text-green-700",
    bg: "bg-green-500",
    border: "border-green-500",
    icon: <Leaf className="w-3.5 h-3.5" />,
    description: "Population stable, non menacée",
  },
};

const CITES_CONFIG: Record<string, { label: string; color: string }> = {
  I: { label: "CITES I", color: "bg-red-100 text-red-800 border-red-200" },
  II: { label: "CITES II", color: "bg-orange-100 text-orange-800 border-orange-200" },
  III: { label: "CITES III", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
};

// Couleur par statut le plus critique
const WORST_STATUS_COLOR: Record<string, string> = {
  EX: "bg-gray-900 text-white",
  EW: "bg-gray-700 text-white",
  CR: "bg-red-600 text-white",
  EN: "bg-orange-500 text-white",
};

function UICNBadge({ status }: { status: string }) {
  const cfg = UICN_CONFIG[status];
  if (!cfg) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold text-white ${cfg.bg}`}
      title={cfg.description}
    >
      {cfg.icon}
      {status}
    </span>
  );
}

function CITESBadge({ appendix }: { appendix: string | null }) {
  if (!appendix || appendix === "NONE" || appendix === "NULL") return null;
  const cfg = CITES_CONFIG[appendix];
  if (!cfg) return null;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

const STATUS_ORDER = ["EX", "EW", "CR", "EN", "VU", "NT", "DD", "LC"];

// ─── Section molécules exclusives ───────────────────────────────────────────
function ExclusiveMoleculesSection() {
  const [expanded, setExpanded] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: molecules, isLoading } = trpc.plants.getExclusiveMolecules.useQuery({
    statuses: ["EX", "EW", "CR", "EN"],
  });

  const filtered = useMemo(() => {
    if (!molecules) return [];
    if (filterStatus === "all") return molecules;
    return molecules.filter((m) => m.statuses.includes(filterStatus));
  }, [molecules, filterStatus]);

  const displayed = expanded ? filtered : filtered.slice(0, 12);

  const countByStatus = useMemo(() => {
    if (!molecules) return {};
    const counts: Record<string, number> = {};
    for (const m of molecules) {
      const worst = STATUS_ORDER.find((s) => m.statuses.includes(s)) || "EN";
      counts[worst] = (counts[worst] || 0) + 1;
    }
    return counts;
  }, [molecules]);

  return (
    <div className="border-t bg-red-50/30">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header section */}
        <div className="flex items-start gap-4 mb-6">
          <div className="p-2.5 rounded-xl bg-red-100 border border-red-200 shrink-0">
            <FlaskConical className="w-6 h-6 text-red-700" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold tracking-tight">Molécules en péril</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Ces molécules odorantes sont documentées <strong>exclusivement</strong> dans des espèces EX, EW, CR ou EN.
              Si ces plantes disparaissent, ces composés chimiques disparaissent avec elles — patrimoine olfactif irremplaçable.
            </p>
          </div>
        </div>

        {/* Stats par statut */}
        {!isLoading && molecules && (
          <div className="flex flex-wrap gap-2 mb-5">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                filterStatus === "all"
                  ? "bg-foreground text-background border-transparent"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              Toutes ({molecules.length})
            </button>
            {["EX", "EW", "CR", "EN"].filter((s) => countByStatus[s]).map((s) => {
              const cfg = UICN_CONFIG[s];
              return (
                <button
                  key={s}
                  onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    filterStatus === s
                      ? `${cfg.bg} text-white border-transparent`
                      : `border-current ${cfg.color} bg-transparent hover:bg-red-50`
                  }`}
                >
                  {cfg.icon}
                  {s} ({countByStatus[s]})
                </button>
              );
            })}
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">Aucune molécule trouvée</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {displayed.map((mol) => {
                const worstStatus = STATUS_ORDER.find((s) => mol.statuses.includes(s)) || "EN";
                const worstCfg = UICN_CONFIG[worstStatus];
                return (
                  <Link key={mol.id} href={`/molecules/${mol.id}`}>
                    <div className={`group relative rounded-lg border-l-4 bg-card hover:shadow-md transition-all cursor-pointer p-3 h-full ${worstCfg.border}`}>
                      {/* Status badge */}
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${worstCfg.bg}`}>
                          {worstStatus}
                        </span>
                        {mol.family && (
                          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded truncate max-w-[80px]">
                            {mol.family}
                          </span>
                        )}
                      </div>
                      {/* Molecule name */}
                      <p className="text-sm font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {mol.name}
                      </p>
                      {/* Plant sources */}
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 italic">
                        {mol.plantNames.slice(0, 2).join(", ")}
                        {mol.plantNames.length > 2 && ` +${mol.plantNames.length - 2}`}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {filtered.length > 12 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
              >
                {expanded ? (
                  <><ChevronUp className="w-4 h-4" /> Réduire</>
                ) : (
                  <><ChevronDown className="w-4 h-4" /> Voir les {filtered.length - 12} autres molécules</>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Page principale ─────────────────────────────────────────────────────────
export default function Conservation() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCites, setFilterCites] = useState<string>("all");

  const { data: plants, isLoading } = trpc.plants.getAll.useQuery({ limit: 1000, offset: 0 });

  const threatened = useMemo(() => {
    if (!plants?.plants) return [];
    return plants.plants.filter(
      (p) =>
        p.conservation_status &&
        p.conservation_status !== "NE" &&
        p.conservation_status !== "LC"
    );
  }, [plants]);

  const filtered = useMemo(() => {
    return threatened
      .filter((p) => {
        const matchSearch =
          !search ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.latin_name || "").toLowerCase().includes(search.toLowerCase());
        const matchStatus =
          filterStatus === "all" || p.conservation_status === filterStatus;
        const matchCites =
          filterCites === "all" ||
          (filterCites === "yes"
            ? p.cites_appendix && p.cites_appendix !== "NONE" && p.cites_appendix !== "NULL"
            : !p.cites_appendix || p.cites_appendix === "NONE" || p.cites_appendix === "NULL");
        return matchSearch && matchStatus && matchCites;
      })
      .sort((a, b) => {
        const ia = STATUS_ORDER.indexOf(a.conservation_status || "");
        const ib = STATUS_ORDER.indexOf(b.conservation_status || "");
        if (ia !== ib) return ia - ib;
        return a.name.localeCompare(b.name);
      });
  }, [threatened, search, filterStatus, filterCites]);

  // Stats
  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of threatened) {
      const s = p.conservation_status || "DD";
      counts[s] = (counts[s] || 0) + 1;
    }
    return counts;
  }, [threatened]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-xl bg-red-50 border border-red-100">
              <ShieldAlert className="w-7 h-7 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Conservation</h1>
              <p className="text-muted-foreground mt-1 max-w-2xl">
                Patrimoine olfactif menacé — espèces documentées dans PERFUMUM selon les critères UICN et les annexes CITES. Chaque plante perdue est une molécule odorante disparue à jamais.
              </p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-3">
            {STATUS_ORDER.filter((s) => stats[s]).map((s) => {
              const cfg = UICN_CONFIG[s];
              return (
                <button
                  key={s}
                  onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all text-sm font-semibold ${
                    filterStatus === s
                      ? `${cfg.bg} text-white border-transparent`
                      : `border-${cfg.border} ${cfg.color} bg-transparent hover:bg-gray-50`
                  }`}
                >
                  {cfg.icon}
                  <span>{s}</span>
                  <span className="opacity-70">({stats[s]})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 py-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Rechercher une espèce..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Statut UICN" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {STATUS_ORDER.filter((s) => stats[s]).map((s) => (
                <SelectItem key={s} value={s}>
                  {s} — {UICN_CONFIG[s]?.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterCites} onValueChange={setFilterCites}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="CITES" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="yes">Listées CITES</SelectItem>
              <SelectItem value="no">Non listées</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          {filtered.length} espèce{filtered.length > 1 ? "s" : ""} affichée{filtered.length > 1 ? "s" : ""}
          {filterStatus !== "all" || filterCites !== "all" || search ? " (filtrées)" : ""}
        </p>
      </div>

      {/* Grid plantes */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <ShieldAlert className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Aucune espèce trouvée</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((plant) => {
              const cfg = UICN_CONFIG[plant.conservation_status || ""] || UICN_CONFIG["DD"];
              return (
                <Link key={plant.id} href={`/matieres-premieres/${plant.id}`}>
                  <Card className={`group cursor-pointer hover:shadow-md transition-all border-l-4 h-full ${cfg.border}`}>
                    <CardContent className="p-4 flex flex-col gap-3 h-full">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-1">
                            {plant.name}
                          </h3>
                          <p className="text-xs text-muted-foreground italic mt-0.5 line-clamp-1">
                            {plant.latin_name || "—"}
                          </p>
                        </div>
                        <UICNBadge status={plant.conservation_status || ""} />
                      </div>

                      {/* CITES + category */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <CITESBadge appendix={plant.cites_appendix || null} />
                        {plant.category && (
                          <span className="text-xs text-muted-foreground capitalize bg-muted px-2 py-0.5 rounded">
                            {plant.category}
                          </span>
                        )}
                      </div>

                      {/* Signature olfactive */}
                      {plant.olfactive_signature && (
                        <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
                          {plant.olfactive_signature}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">
                          {(plant as any).molecule_count ?? 0} molécule{((plant as any).molecule_count ?? 0) > 1 ? "s" : ""}
                        </span>
                        <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Voir la fiche →
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Section molécules exclusives */}
      <ExclusiveMoleculesSection />

      {/* UICN Legend */}
      <div className="border-t bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Échelle UICN
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATUS_ORDER.map((s) => {
              const cfg = UICN_CONFIG[s];
              return (
                <div key={s} className="flex items-start gap-2">
                  <span className={`mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded text-white text-xs font-bold shrink-0 ${cfg.bg}`}>
                    {s}
                  </span>
                  <div>
                    <p className="text-xs font-medium">{cfg.label}</p>
                    <p className="text-xs text-muted-foreground">{cfg.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            Sources : UICN Red List (iucnredlist.org) · CITES Appendices (cites.org) · données internes PERFUMUM.
            Les statuts sont indicatifs et doivent être vérifiés contre les listes officielles les plus récentes.
          </p>
        </div>
      </div>
    </div>
  );
}
