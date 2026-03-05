// @ts-nocheck
/**
 * Page /correlations — Corrélations Moléculaires Parfum × Tabac × Cannabis
 * Exploite la table molecule_synergies et les données plant_molecules
 */
import { useState, useMemo, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  Search,
  FlaskConical,
  Leaf,
  Cigarette,
  Flower2,
  TrendingUp,
  Network,
  Info,
  ChevronDown,
  ChevronUp,
  Download,
  Zap,
  ArrowRight,
} from "lucide-react";

// ─── Couleurs domaines ───────────────────────────────────────────────────────
const DOMAIN_COLORS = {
  cannabis: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/40", hex: "#10b981" },
  tabac: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/40", hex: "#f59e0b" },
  parfum: { bg: "bg-violet-500/20", text: "text-violet-400", border: "border-violet-500/40", hex: "#8b5cf6" },
};

const DOMAIN_ICONS = {
  cannabis: Leaf,
  tabac: Cigarette,
  parfum: Flower2,
};

const SYNERGY_COLORS = {
  potentialisation: "bg-green-500/20 text-green-400 border-green-500/40",
  stabilisation: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  transformation: "bg-orange-500/20 text-orange-400 border-orange-500/40",
  masquage: "bg-red-500/20 text-red-400 border-red-500/40",
  neutralisation: "bg-gray-500/20 text-gray-400 border-gray-500/40",
};

// ─── Composant : Badge domaine ───────────────────────────────────────────────
function DomainBadge({ domain }: { domain: string }) {
  const colors = DOMAIN_COLORS[domain] || { bg: "bg-gray-500/20", text: "text-gray-400", border: "border-gray-500/40" };
  const Icon = DOMAIN_ICONS[domain] || FlaskConical;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>
      <Icon className="w-3 h-3" />
      {domain}
    </span>
  );
}

// ─── Composant : Carte molécule ──────────────────────────────────────────────
function MoleculeCard({ mol, synergies, onSelect, isSelected }) {
  const [expanded, setExpanded] = useState(false);
  const domainSet = [...new Set(mol.domains)];
  const isTriple = domainSet.length === 3;

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 border ${
        isSelected
          ? "border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/20"
          : isTriple
          ? "border-amber-500/50 bg-amber-500/5 hover:border-amber-500/80"
          : "border-white/10 bg-white/5 hover:border-white/20"
      }`}
      onClick={() => onSelect(mol)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-white text-sm leading-tight">{mol.name}</h3>
            {mol.family && (
              <p className="text-xs text-white/40 mt-0.5">{mol.family}</p>
            )}
          </div>
          {isTriple && (
            <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs shrink-0">
              ✦ Triple
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          {domainSet.map((d) => (
            <DomainBadge key={d} domain={d} />
          ))}
        </div>

        {mol.formula && (
          <p className="text-xs text-white/30 font-mono mb-2">{mol.formula}</p>
        )}

        {mol.olfactiveProfile?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {mol.olfactiveProfile.slice(0, 3).map((o) => (
              <span key={o} className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-white/50">
                {o}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-white/40">
          <span>{mol.plantCount} plantes</span>
          {mol.therapeuticProperties && (
            <button
              className="flex items-center gap-1 hover:text-white/70 transition-colors"
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            >
              <Info className="w-3 h-3" />
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>

        {expanded && mol.therapeuticProperties && (
          <div className="mt-2 pt-2 border-t border-white/10">
            <p className="text-xs text-white/60 leading-relaxed line-clamp-4">
              {mol.therapeuticProperties}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Composant : Visualisation Venn D3-like ──────────────────────────────────
function VennDiagram({ stats }) {
  if (!stats) return null;
  const { tripleDomain, cannabisTabac, cannabisParfum, tabacParfum } = stats;
  const total = tripleDomain + cannabisTabac + cannabisParfum + tabacParfum;

  return (
    <div className="relative w-full aspect-square max-w-xs mx-auto select-none">
      <svg viewBox="0 0 300 300" className="w-full h-full">
        {/* Cannabis circle */}
        <circle cx="150" cy="100" r="80" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeOpacity="0.5" strokeWidth="1.5" />
        {/* Tabac circle */}
        <circle cx="100" cy="200" r="80" fill="#f59e0b" fillOpacity="0.15" stroke="#f59e0b" strokeOpacity="0.5" strokeWidth="1.5" />
        {/* Parfum circle */}
        <circle cx="200" cy="200" r="80" fill="#8b5cf6" fillOpacity="0.15" stroke="#8b5cf6" strokeOpacity="0.5" strokeWidth="1.5" />

        {/* Labels */}
        <text x="150" y="45" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="600">Cannabis</text>
        <text x="50" y="235" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="600">Tabac</text>
        <text x="250" y="235" textAnchor="middle" fill="#8b5cf6" fontSize="11" fontWeight="600">Parfum</text>

        {/* Intersection counts */}
        <text x="150" y="115" textAnchor="middle" fill="#d1fae5" fontSize="10" fontWeight="700">{cannabisParfum}</text>
        <text x="108" y="165" textAnchor="middle" fill="#fef3c7" fontSize="10" fontWeight="700">{cannabisTabac}</text>
        <text x="192" y="165" textAnchor="middle" fill="#ede9fe" fontSize="10" fontWeight="700">{tabacParfum}</text>

        {/* Triple intersection */}
        <text x="150" y="175" textAnchor="middle" fill="white" fontSize="13" fontWeight="800">{tripleDomain}</text>
        <text x="150" y="188" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7">triple</text>
      </svg>
    </div>
  );
}

// ─── Composant : Graphe réseau SVG simplifié ─────────────────────────────────
function NetworkGraph({ molecules, selectedMol, onSelect }) {
  const top = molecules.slice(0, 20);
  const cx = 400, cy = 300;
  const r = 220;

  return (
    <svg viewBox="0 0 800 600" className="w-full h-full">
      {/* Liens */}
      {top.map((mol, i) => {
        const angle = (i / top.length) * 2 * Math.PI - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        return (
          <line key={mol.id} x1={cx} y1={cy} x2={x} y2={y}
            stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        );
      })}

      {/* Nœuds */}
      {top.map((mol, i) => {
        const angle = (i / top.length) * 2 * Math.PI - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        const isTriple = mol.domainCount === 3;
        const isSelected = selectedMol?.id === mol.id;
        const nodeR = isTriple ? 14 : 10;
        const color = isTriple ? "#f59e0b" : mol.domains.includes("cannabis") ? "#10b981" : "#8b5cf6";

        return (
          <g key={mol.id} onClick={() => onSelect(mol)} className="cursor-pointer">
            <circle cx={x} cy={y} r={nodeR + (isSelected ? 4 : 0)}
              fill={color} fillOpacity={isSelected ? 0.9 : 0.5}
              stroke={color} strokeWidth={isSelected ? 2 : 1} />
            <text x={x} y={y + nodeR + 12} textAnchor="middle"
              fill="rgba(255,255,255,0.7)" fontSize="8" fontWeight={isTriple ? "600" : "400"}>
              {mol.name.length > 12 ? mol.name.slice(0, 12) + "…" : mol.name}
            </text>
          </g>
        );
      })}

      {/* Centre */}
      <circle cx={cx} cy={cy} r={40} fill="rgba(139,92,246,0.2)" stroke="rgba(139,92,246,0.5)" strokeWidth="1.5" />
      <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="9" fontWeight="600">Molécules</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">communes</text>
    </svg>
  );
}

// ─── Page principale ─────────────────────────────────────────────────────────
export default function CorrelationsParfumTabacCannabis() {
  const [search, setSearch] = useState("");
  const [filterDomain, setFilterDomain] = useState<string>("all");
  const [selectedMol, setSelectedMol] = useState<any>(null);
  const [minDomains, setMinDomains] = useState<2 | 3>(2);

  const { data: crossData, isLoading } = trpc.correlations.getCrossDomainMolecules.useQuery({
    minDomains,
    limit: 100,
  });

  const { data: stats } = trpc.correlations.getCorrelationStats.useQuery();
  const { data: topFamilies } = trpc.correlations.getTopFamilies.useQuery();

  const selectedIds = useMemo(() => {
    if (!crossData?.molecules) return [];
    return crossData.molecules.slice(0, 30).map((m) => m.id);
  }, [crossData]);

  const { data: synergiesData } = trpc.correlations.getSynergiesForCrossDomain.useQuery(
    { moleculeIds: selectedIds },
    { enabled: selectedIds.length > 0 }
  );

  const molecules = useMemo(() => {
    if (!crossData?.molecules) return [];
    return crossData.molecules.filter((m) => {
      const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) ||
        (m.family || "").toLowerCase().includes(search.toLowerCase());
      const matchDomain = filterDomain === "all" || m.domains.includes(filterDomain);
      return matchSearch && matchDomain;
    });
  }, [crossData, search, filterDomain]);

  const selectedSynergies = useMemo(() => {
    if (!synergiesData || !selectedMol) return [];
    return synergiesData.filter(
      (s) => s.molecule1_id === selectedMol.id || s.molecule2_id === selectedMol.id
    );
  }, [synergiesData, selectedMol]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumbs currentLabel="Corrélations Parfum × Tabac × Cannabis" />

        {/* En-tête */}
        <div className="mb-8 mt-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-violet-500/20 border border-violet-500/30">
              <Network className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Corrélations Moléculaires
              </h1>
              <p className="text-white/50 text-sm">
                Molécules communes entre Parfumerie, Tabac et Cannabis
              </p>
            </div>
          </div>

          {/* Légende domaines */}
          <div className="flex flex-wrap gap-3 mt-4">
            {Object.entries(DOMAIN_COLORS).map(([domain, colors]) => {
              const Icon = DOMAIN_ICONS[domain];
              return (
                <div key={domain} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${colors.bg} ${colors.border}`}>
                  <Icon className={`w-4 h-4 ${colors.text}`} />
                  <span className={`text-sm font-medium ${colors.text} capitalize`}>{domain}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            {[
              { label: "Triple domaine", value: stats.tripleDomain, color: "text-amber-400", icon: "✦" },
              { label: "Double domaine", value: stats.doubleDomain, color: "text-violet-400", icon: "◈" },
              { label: "Cannabis × Tabac", value: stats.cannabisTabac, color: "text-emerald-400", icon: "⊗" },
              { label: "Cannabis × Parfum", value: stats.cannabisParfum, color: "text-green-400", icon: "⊕" },
              { label: "Tabac × Parfum", value: stats.tabacParfum, color: "text-amber-300", icon: "⊙" },
            ].map((s) => (
              <Card key={s.label} className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-white/50 mt-1">{s.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Tabs defaultValue="liste" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="liste" className="data-[state=active]:bg-violet-500/30">
              Liste
            </TabsTrigger>
            <TabsTrigger value="graphe" className="data-[state=active]:bg-violet-500/30">
              Graphe réseau
            </TabsTrigger>
            <TabsTrigger value="venn" className="data-[state=active]:bg-violet-500/30">
              Diagramme Venn
            </TabsTrigger>
            <TabsTrigger value="familles" className="data-[state=active]:bg-violet-500/30">
              Familles chimiques
            </TabsTrigger>
            <TabsTrigger value="synergies-tabac" className="data-[state=active]:bg-amber-500/30 text-xs">
              <Zap className="w-3 h-3 mr-1" />Synergies Tabac×Parfum
            </TabsTrigger>
          </TabsList>

          {/* ─── Onglet Liste ─── */}
          <TabsContent value="liste">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher une molécule…"
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
              <div className="flex gap-2">
                {["all", "cannabis", "tabac", "parfum"].map((d) => (
                  <Button
                    key={d}
                    size="sm"
                    variant={filterDomain === d ? "default" : "outline"}
                    onClick={() => setFilterDomain(d)}
                    className={filterDomain === d ? "bg-violet-600 hover:bg-violet-700" : "border-white/10 text-white/60 hover:text-white"}
                  >
                    {d === "all" ? "Tous" : d}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={minDomains === 2 ? "default" : "outline"}
                  onClick={() => setMinDomains(2)}
                  className={minDomains === 2 ? "bg-violet-600 hover:bg-violet-700" : "border-white/10 text-white/60 hover:text-white"}
                >
                  ≥ 2 domaines
                </Button>
                <Button
                  size="sm"
                  variant={minDomains === 3 ? "default" : "outline"}
                  onClick={() => setMinDomains(3)}
                  className={minDomains === 3 ? "bg-amber-600 hover:bg-amber-700" : "border-white/10 text-white/60 hover:text-white"}
                >
                  3 domaines
                </Button>
              </div>
            </div>

            <div className="flex gap-6">
              {/* Grille molécules */}
              <div className="flex-1">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="h-32 rounded-lg bg-white/5 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-white/40 mb-3">
                      {molecules.length} molécule{molecules.length !== 1 ? "s" : ""} trouvée{molecules.length !== 1 ? "s" : ""}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {molecules.map((mol) => (
                        <MoleculeCard
                          key={mol.id}
                          mol={mol}
                          synergies={synergiesData}
                          onSelect={setSelectedMol}
                          isSelected={selectedMol?.id === mol.id}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Panneau détail molécule sélectionnée */}
              {selectedMol && (
                <div className="w-80 shrink-0">
                  <Card className="bg-white/5 border-white/10 sticky top-4">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base text-white">{selectedMol.name}</CardTitle>
                        <button onClick={() => setSelectedMol(null)} className="text-white/30 hover:text-white/70 text-lg leading-none">×</button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {[...new Set(selectedMol.domains)].map((d) => (
                          <DomainBadge key={d} domain={d} />
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedMol.formula && (
                        <div>
                          <p className="text-xs text-white/40 mb-1">Formule</p>
                          <p className="font-mono text-sm text-white/80">{selectedMol.formula}</p>
                        </div>
                      )}
                      {selectedMol.casNumber && (
                        <div>
                          <p className="text-xs text-white/40 mb-1">CAS</p>
                          <p className="text-sm text-white/80">{selectedMol.casNumber}</p>
                        </div>
                      )}
                      {selectedMol.olfactiveProfile?.length > 0 && (
                        <div>
                          <p className="text-xs text-white/40 mb-1">Profil olfactif</p>
                          <div className="flex flex-wrap gap-1">
                            {selectedMol.olfactiveProfile.map((o) => (
                              <span key={o} className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/60">{o}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedMol.plantNames?.length > 0 && (
                        <div>
                          <p className="text-xs text-white/40 mb-1">Plantes sources ({selectedMol.plantCount})</p>
                          <div className="space-y-0.5">
                            {selectedMol.plantNames.slice(0, 6).map((p) => (
                              <p key={p} className="text-xs text-white/60">• {p}</p>
                            ))}
                            {selectedMol.plantCount > 6 && (
                              <p className="text-xs text-white/30">+{selectedMol.plantCount - 6} autres…</p>
                            )}
                          </div>
                        </div>
                      )}
                      {selectedMol.therapeuticProperties && (
                        <div>
                          <p className="text-xs text-white/40 mb-1">Propriétés thérapeutiques</p>
                          <p className="text-xs text-white/60 leading-relaxed line-clamp-6">
                            {selectedMol.therapeuticProperties}
                          </p>
                        </div>
                      )}

                      {/* Synergies documentées */}
                      {selectedSynergies.length > 0 && (
                        <div>
                          <p className="text-xs text-white/40 mb-2">Synergies documentées ({selectedSynergies.length})</p>
                          <div className="space-y-2">
                            {selectedSynergies.slice(0, 4).map((s) => {
                              const partner = s.molecule1_id === selectedMol.id ? s.molecule2Name : s.molecule1Name;
                              return (
                                <div key={s.id} className="p-2 rounded bg-white/5 border border-white/10">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-medium text-white/80">{partner}</span>
                                    <span className={`text-xs px-1.5 py-0.5 rounded border ${SYNERGY_COLORS[s.type] || "bg-gray-500/20 text-gray-400 border-gray-500/40"}`}>
                                      {s.type}
                                    </span>
                                  </div>
                                  {s.description && (
                                    <p className="text-xs text-white/50 line-clamp-2">{s.description}</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ─── Onglet Graphe ─── */}
          <TabsContent value="graphe">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Network className="w-4 h-4 text-violet-400" />
                  Graphe réseau — Top 20 molécules communes
                </CardTitle>
                <p className="text-xs text-white/40">
                  Cliquez sur un nœud pour voir les détails.
                  <span className="ml-2 text-amber-400">● Triple domaine</span>
                  <span className="ml-2 text-emerald-400">● Cannabis + autre</span>
                  <span className="ml-2 text-violet-400">● Parfum + autre</span>
                </p>
              </CardHeader>
              <CardContent>
                <div className="w-full aspect-video bg-black/20 rounded-lg overflow-hidden">
                  {molecules.length > 0 && (
                    <NetworkGraph
                      molecules={molecules}
                      selectedMol={selectedMol}
                      onSelect={setSelectedMol}
                    />
                  )}
                </div>
                {selectedMol && (
                  <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">{selectedMol.name}</h3>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {[...new Set(selectedMol.domains)].map((d) => (
                        <DomainBadge key={d} domain={d} />
                      ))}
                    </div>
                    {selectedMol.therapeuticProperties && (
                      <p className="text-xs text-white/60 line-clamp-3">{selectedMol.therapeuticProperties}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Onglet Venn ─── */}
          <TabsContent value="venn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-base text-white">Diagramme de Venn</CardTitle>
                  <p className="text-xs text-white/40">Intersections entre les trois domaines</p>
                </CardHeader>
                <CardContent>
                  <VennDiagram stats={stats} />
                  {stats && (
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between text-white/60">
                        <span>Cannabis ∩ Tabac ∩ Parfum</span>
                        <span className="text-amber-400 font-bold">{stats.tripleDomain}</span>
                      </div>
                      <div className="flex justify-between text-white/60">
                        <span>Cannabis ∩ Tabac</span>
                        <span className="text-emerald-400">{stats.cannabisTabac}</span>
                      </div>
                      <div className="flex justify-between text-white/60">
                        <span>Cannabis ∩ Parfum</span>
                        <span className="text-green-400">{stats.cannabisParfum}</span>
                      </div>
                      <div className="flex justify-between text-white/60">
                        <span>Tabac ∩ Parfum</span>
                        <span className="text-amber-300">{stats.tabacParfum}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-base text-white">Molécules triple domaine</CardTitle>
                  <p className="text-xs text-white/40">Présentes dans cannabis, tabac ET parfumerie</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {molecules
                      .filter((m) => m.domainCount === 3)
                      .slice(0, 10)
                      .map((mol) => (
                        <div
                          key={mol.id}
                          className="flex items-center justify-between p-2 rounded bg-amber-500/10 border border-amber-500/20 cursor-pointer hover:bg-amber-500/20 transition-colors"
                          onClick={() => setSelectedMol(mol)}
                        >
                          <div>
                            <p className="text-sm font-medium text-white">{mol.name}</p>
                            <p className="text-xs text-white/40">{mol.family}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-amber-400">{mol.plantCount} plantes</p>
                            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40 text-xs">✦</Badge>
                          </div>
                        </div>
                      ))}
                    {molecules.filter((m) => m.domainCount === 3).length === 0 && (
                      <p className="text-sm text-white/40 text-center py-4">
                        Aucune molécule triple domaine trouvée avec les filtres actuels.
                        <br />
                        <button className="text-violet-400 hover:underline mt-1" onClick={() => setMinDomains(2)}>
                          Afficher les doubles domaines
                        </button>
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ─── Onglet Familles ─── */}
          <TabsContent value="familles">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-violet-400" />
                  Familles chimiques les plus représentées
                </CardTitle>
                <p className="text-xs text-white/40">
                  Familles avec le plus de molécules présentes dans plusieurs domaines
                </p>
              </CardHeader>
              <CardContent>
                {topFamilies ? (
                  <div className="space-y-3">
                    {topFamilies.map((fam, i) => (
                      <div key={fam.family} className="flex items-center gap-4">
                        <div className="w-6 text-center text-sm text-white/30 font-mono">{i + 1}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-white">{fam.family}</span>
                            <span className="text-sm text-violet-400 font-bold">{fam.count}</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full"
                              style={{ width: `${Math.min(100, (fam.count / (topFamilies[0]?.count || 1)) * 100)}%` }}
                            />
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {fam.examples.slice(0, 4).map((ex) => (
                              <span key={ex} className="text-xs text-white/40">{ex}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-12 rounded bg-white/5 animate-pulse" />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          {/* ─── Onglet Synergies Tabac×Parfum ─── */}
          <TabsContent value="synergies-tabac">
            <SynergiesTabacParfumTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ─── Composant : Onglet Synergies Tabac×Parfum ──────────────────────────────
function SynergiesTabacParfumTab() {
  const { data: allSynergies, isLoading } = trpc.synergies.getAllMoleculeSynergies.useQuery();
  const [filterType, setFilterType] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Molécules tabac connues (IDs)
  const TABAC_MOLECULE_IDS = new Set([720027, 1350115, 570044, 930006, 720023, 720024, 720025, 750002, 570032]);
  // Molécules parfum connues (IDs)
  const PARFUM_MOLECULE_IDS = new Set([90078, 3, 30002, 90069, 330017, 300004]);

  const tabacParfumSynergies = useMemo(() => {
    if (!allSynergies) return [];
    return allSynergies.filter(s => {
      const m1 = s.molecule1Id;
      const m2 = s.molecule2Id;
      if (!m1 || !m2) return false;
      // Synergie tabac × parfum (dans les deux sens)
      return (TABAC_MOLECULE_IDS.has(m1) && PARFUM_MOLECULE_IDS.has(m2)) ||
             (PARFUM_MOLECULE_IDS.has(m1) && TABAC_MOLECULE_IDS.has(m2));
    });
  }, [allSynergies]);

  const filtered = useMemo(() => {
    if (filterType === 'all') return tabacParfumSynergies;
    return tabacParfumSynergies.filter(s => s.type === filterType);
  }, [tabacParfumSynergies, filterType]);

  const TABAC_NAMES: Record<number, string> = {
    720027: 'Solanone', 1350115: 'Cembranolide', 570044: 'β-Damascénone',
    930006: 'Furfural', 720023: 'β-Damascenone', 720024: 'β-Damascone',
    720025: 'α-Damascone', 750002: 'Damascenone', 570032: 'Damascone Beta'
  };
  const PARFUM_NAMES: Record<number, string> = {
    90078: 'Iso E Super', 3: 'Ambroxan', 30002: 'Linalol',
    90069: 'Vanilline', 330017: 'Ambroxan (Cetalox)', 300004: 'Ambrox Super'
  };

  const getMolName = (id: number) => TABAC_NAMES[id] || PARFUM_NAMES[id] || `Mol. ${id}`;
  const isMolTabac = (id: number) => TABAC_MOLECULE_IDS.has(id);

  const TYPES = ['all', 'potentialisation', 'transformation', 'masquage', 'stabilisation'];
  const TYPE_LABELS: Record<string, string> = {
    all: 'Toutes', potentialisation: 'Potentialisation', transformation: 'Transformation',
    masquage: 'Masquage', stabilisation: 'Stabilisation'
  };

  if (isLoading) return <div className="space-y-3">{Array.from({length: 6}).map((_,i) => <div key={i} className="h-20 rounded bg-white/5 animate-pulse" />)}</div>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-amber-500/5 border-amber-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-amber-300 mb-1">Interactions Tabac × Parfum</h3>
              <p className="text-xs text-white/50">
                {tabacParfumSynergies.length} synergies documentées entre les molécules caractéristiques du tabac
                (Solanone, Cembranolide, β-Damascénone, Furfural) et les molécules de parfumerie
                (Iso E Super, Ambroxan, Linalol, Vanilline). Sources : GC-MS, Rodgman & Perfetti 2013.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        {TYPES.map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              filterType === t
                ? SYNERGY_COLORS[t] || 'bg-white/20 text-white border-white/40'
                : 'bg-white/5 text-white/50 border-white/10 hover:border-white/30'
            }`}
          >
            {TYPE_LABELS[t]} {t === 'all' ? `(${tabacParfumSynergies.length})` : `(${tabacParfumSynergies.filter(s => s.type === t).length})`}
          </button>
        ))}
      </div>

      {/* Liste des synergies */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-white/30 text-sm">Aucune synergie pour ce filtre</div>
        ) : (
          filtered.map(s => {
            const m1 = s.molecule1Id;
            const m2 = s.molecule2Id;
            const isExpanded = expandedId === s.id;
            return (
              <Card key={s.id} className="bg-white/5 border-white/10 hover:border-white/20 transition-all">
                <CardContent className="p-4">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : s.id)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Molécule 1 */}
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        isMolTabac(m1) ? 'bg-amber-500/20 text-amber-300' : 'bg-violet-500/20 text-violet-300'
                      }`}>
                        {isMolTabac(m1) ? '🚬' : '🌸'} {getMolName(m1)}
                      </span>
                      <ArrowRight className="w-3 h-3 text-white/30 flex-shrink-0" />
                      {/* Molécule 2 */}
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        isMolTabac(m2) ? 'bg-amber-500/20 text-amber-300' : 'bg-violet-500/20 text-violet-300'
                      }`}>
                        {isMolTabac(m2) ? '🚬' : '🌸'} {getMolName(m2)}
                      </span>
                      {/* Type */}
                      <span className={`px-2 py-0.5 rounded-full text-xs border ml-auto flex-shrink-0 ${
                        SYNERGY_COLORS[s.type] || 'bg-gray-500/20 text-gray-400 border-gray-500/40'
                      }`}>
                        {s.type}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-white/30 ml-2 flex-shrink-0 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`} />
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
                      {s.description && (
                        <div>
                          <div className="text-xs font-medium text-white/60 mb-1">Description</div>
                          <p className="text-xs text-white/70 leading-relaxed">{s.description}</p>
                        </div>
                      )}
                      {(s as any).chemicalMechanism && (
                        <div>
                          <div className="text-xs font-medium text-amber-400/80 mb-1">Mécanisme chimique</div>
                          <p className="text-xs text-white/60 leading-relaxed font-mono">{(s as any).chemicalMechanism}</p>
                        </div>
                      )}
                      {s.applications && (
                        <div>
                          <div className="text-xs font-medium text-violet-400/80 mb-1">Applications</div>
                          <p className="text-xs text-white/60 leading-relaxed">{s.applications}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
