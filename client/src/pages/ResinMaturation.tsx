import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowRight, FlaskConical, Flame, Leaf, Clock, BookOpen, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TransformationProcess =
  | "isomerization"
  | "oxidation"
  | "pyrolysis"
  | "fermentation"
  | "hydrolysis"
  | "distillation"
  | "polymerization"
  | "decarboxylation"
  | "cyclization";

// ─── Constantes ───────────────────────────────────────────────────────────────

const PROCESS_CONFIG: Record<TransformationProcess, { label: string; color: string; bg: string; icon: string; description: string }> = {
  isomerization: {
    label: "Isomérisation",
    color: "text-violet-300",
    bg: "bg-violet-900/40 border-violet-700/50",
    icon: "⇌",
    description: "Réarrangement structural sans changement de formule moléculaire. Modifie profondément les propriétés olfactives sans altérer la composition élémentaire.",
  },
  oxidation: {
    label: "Oxydation",
    color: "text-amber-300",
    bg: "bg-amber-900/40 border-amber-700/50",
    icon: "O₂",
    description: "Ajout d'oxygène à la molécule. Transforme les hydrocarbures terpéniques en alcools, cétones, aldéhydes et époxydes — souvent responsable du vieillissement olfactif.",
  },
  pyrolysis: {
    label: "Pyrolyse",
    color: "text-red-300",
    bg: "bg-red-900/40 border-red-700/50",
    icon: "🔥",
    description: "Décomposition thermique en l'absence d'oxygène. Produit des composés phénoliques, guaïacol, créosol — responsables des notes fumées et médicinales de l'encens brûlé.",
  },
  fermentation: {
    label: "Fermentation",
    color: "text-green-300",
    bg: "bg-green-900/40 border-green-700/50",
    icon: "🦠",
    description: "Transformation par micro-organismes. Libère des alcools terpéniques et des acides organiques, enrichissant le profil olfactif en notes florales et herbacées.",
  },
  hydrolysis: {
    label: "Hydrolyse",
    color: "text-blue-300",
    bg: "bg-blue-900/40 border-blue-700/50",
    icon: "H₂O",
    description: "Rupture de liaisons ester ou glycoside par l'eau. Libère des aldéhydes aromatiques (vanilline), des acides et des alcools — transformation clé du benjoin.",
  },
  distillation: {
    label: "Distillation",
    color: "text-cyan-300",
    bg: "bg-cyan-900/40 border-cyan-700/50",
    icon: "⚗️",
    description: "Séparation par vaporisation sélective. Concentre les composés volatils et peut induire des isomérisation thermiques des terpènes sensibles.",
  },
  polymerization: {
    label: "Polymérisation",
    color: "text-stone-300",
    bg: "bg-stone-800/60 border-stone-600/50",
    icon: "⛓",
    description: "Liaison de monomères en chaînes longues. Responsable du durcissement progressif des résines et de la réduction des notes volatiles fraîches.",
  },
  decarboxylation: {
    label: "Décarboxylation",
    color: "text-orange-300",
    bg: "bg-orange-900/40 border-orange-700/50",
    icon: "CO₂",
    description: "Perte d'un groupe carboxyle (CO₂). Transforme les acides terpéniques en hydrocarbures neutres, modifie la solubilité et la volatilité.",
  },
  cyclization: {
    label: "Cyclisation",
    color: "text-pink-300",
    bg: "bg-pink-900/40 border-pink-700/50",
    icon: "○",
    description: "Formation d'un cycle dans la molécule. Crée des structures plus stables et complexes — responsable du développement des furanoïdes dans la myrrhe et des labdanoïdes dans le labdanum.",
  },
};

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  resine_brute: { label: "Résine brute", color: "bg-amber-900/50 text-amber-300 border-amber-700/50" },
  baume: { label: "Baume", color: "bg-yellow-900/50 text-yellow-300 border-yellow-700/50" },
  gomme_resine: { label: "Gomme-résine", color: "bg-lime-900/50 text-lime-300 border-lime-700/50" },
  oleoresine: { label: "Oléorésine", color: "bg-green-900/50 text-green-300 border-green-700/50" },
  absolue: { label: "Absolue", color: "bg-rose-900/50 text-rose-300 border-rose-700/50" },
  cannabis: { label: "Résine de Cannabis", color: "bg-emerald-900/50 text-emerald-300 border-emerald-700/50" },
};

// ─── Composants ───────────────────────────────────────────────────────────────

function TransformationArrow({ process }: { process: TransformationProcess }) {
  const cfg = PROCESS_CONFIG[process];
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-mono cursor-default ${cfg.bg}`}>
            <span className={`text-base ${cfg.color}`}>{cfg.icon}</span>
            <span className={`${cfg.color} text-[10px] leading-tight text-center`}>{cfg.label}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-zinc-900 border-zinc-700 text-zinc-200">
          <p className="font-semibold mb-1">{cfg.label}</p>
          <p className="text-xs text-zinc-400">{cfg.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function MoleculeChip({ name, casNumber, dbId }: { name: string; casNumber?: string; dbId?: number }) {
  const content = (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-300 hover:border-zinc-500 transition-colors">
      {name}
      {casNumber && <span className="text-zinc-500">({casNumber})</span>}
      {dbId && <ExternalLink className="w-2.5 h-2.5 text-zinc-500" />}
    </span>
  );
  if (dbId) {
    return <Link href={`/molecules/${dbId}`}>{content}</Link>;
  }
  return content;
}

function TransformationFlow({ transformation }: { transformation: any }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/50 hover:border-zinc-700 transition-colors">
      {/* Flux principal */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Précurseur */}
        <div className="flex-1 min-w-[120px]">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Précurseur</div>
          <MoleculeChip
            name={transformation.precursor.name}
            casNumber={transformation.precursor.casNumber}
            dbId={transformation.precursor.dbMoleculeId}
          />
          {transformation.precursor.formula && (
            <div className="text-[10px] text-zinc-600 mt-0.5 font-mono">{transformation.precursor.formula}</div>
          )}
          {transformation.precursor.class && (
            <div className="text-[10px] text-zinc-600 italic">{transformation.precursor.class}</div>
          )}
        </div>

        {/* Flèche + processus */}
        <div className="flex flex-col items-center gap-1">
          <TransformationArrow process={transformation.process} />
          <ArrowRight className="w-4 h-4 text-zinc-600" />
        </div>

        {/* Produit */}
        <div className="flex-1 min-w-[120px]">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Produit</div>
          <MoleculeChip
            name={transformation.product.name}
            casNumber={transformation.product.casNumber}
            dbId={transformation.product.dbMoleculeId}
          />
          {transformation.product.formula && (
            <div className="text-[10px] text-zinc-600 mt-0.5 font-mono">{transformation.product.formula}</div>
          )}
          {transformation.product.class && (
            <div className="text-[10px] text-zinc-600 italic">{transformation.product.class}</div>
          )}
        </div>
      </div>

      {/* Impact olfactif */}
      <div className="mt-3 flex items-start gap-2">
        <Leaf className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
        <p className="text-xs text-zinc-400 italic">{transformation.olfactoryImpact}</p>
      </div>

      {/* Conditions + notes (expandable) */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 flex items-center gap-1 text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors"
      >
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {expanded ? "Masquer" : "Conditions & références"}
      </button>

      {expanded && (
        <div className="mt-2 space-y-1.5 pl-3 border-l border-zinc-800">
          <div className="flex items-start gap-2">
            <Clock className="w-3 h-3 text-zinc-600 mt-0.5 shrink-0" />
            <p className="text-[11px] text-zinc-500">{transformation.conditions}</p>
          </div>
          {transformation.notes && (
            <p className="text-[11px] text-zinc-500 italic">{transformation.notes}</p>
          )}
          {transformation.references && transformation.references.length > 0 && (
            <div className="flex items-start gap-1">
              <BookOpen className="w-3 h-3 text-zinc-600 mt-0.5 shrink-0" />
              <p className="text-[10px] text-zinc-600">{transformation.references.join(" · ")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function OlfactoryEvolutionBar({ evolution }: { evolution: { fresh: string; aged: string; burned?: string } }) {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <div className="w-16 shrink-0">
          <Badge variant="outline" className="text-[10px] border-green-800 text-green-400 bg-green-950/30">Frais</Badge>
        </div>
        <p className="text-xs text-zinc-400">{evolution.fresh}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-16 shrink-0 flex items-center">
          <div className="h-px flex-1 bg-gradient-to-r from-green-800 to-amber-800 mx-1" />
        </div>
        <ArrowRight className="w-3 h-3 text-zinc-600" />
      </div>
      <div className="flex items-start gap-3">
        <div className="w-16 shrink-0">
          <Badge variant="outline" className="text-[10px] border-amber-800 text-amber-400 bg-amber-950/30">Vieilli</Badge>
        </div>
        <p className="text-xs text-zinc-400">{evolution.aged}</p>
      </div>
      {evolution.burned && (
        <>
          <div className="flex items-center gap-3">
            <div className="w-16 shrink-0 flex items-center">
              <div className="h-px flex-1 bg-gradient-to-r from-amber-800 to-red-800 mx-1" />
            </div>
            <Flame className="w-3 h-3 text-red-600" />
          </div>
          <div className="flex items-start gap-3">
            <div className="w-16 shrink-0">
              <Badge variant="outline" className="text-[10px] border-red-800 text-red-400 bg-red-950/30">Brûlé</Badge>
            </div>
            <p className="text-xs text-zinc-400">{evolution.burned}</p>
          </div>
        </>
      )}
    </div>
  );
}

function ResinCard({ profile }: { profile: any }) {
  const [activeProcess, setActiveProcess] = useState<string | null>(null);
  const { data: resolved } = trpc.resinMaturation.resolveMoleculeIds.useQuery({ resinId: profile.id });

  const catCfg = CATEGORY_CONFIG[profile.category] ?? { label: profile.category, color: "bg-zinc-800 text-zinc-300 border-zinc-700" };

  const filteredTransformations = activeProcess
    ? profile.transformations.filter((t: any) => t.process === activeProcess)
    : profile.transformations;

  const processesInProfile = [...new Set(profile.transformations.map((t: any) => t.process))] as TransformationProcess[];

  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="text-lg text-zinc-100">{profile.name}</CardTitle>
            <p className="text-sm text-zinc-500 italic mt-0.5">{profile.latinName}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Badge className={`text-[10px] border ${catCfg.color}`}>{catCfg.label}</Badge>
            {profile.timelineMonths && (
              <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                <Clock className="w-3 h-3" />
                <span>~{profile.timelineMonths} mois</span>
              </div>
            )}
          </div>
        </div>

        {/* Origines */}
        <div className="flex flex-wrap gap-1 mt-2">
          {profile.origin.map((o: string) => (
            <span key={o} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500">{o}</span>
          ))}
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{profile.description}</p>

        {/* Couleur */}
        {profile.color && (
          <div className="flex gap-4 mt-2 text-[10px] text-zinc-500">
            <span>Frais : <span className="text-zinc-400">{profile.color.fresh}</span></span>
            <span>Vieilli : <span className="text-zinc-400">{profile.color.aged}</span></span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Évolution olfactive */}
        <div>
          <h4 className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2">Évolution olfactive</h4>
          <OlfactoryEvolutionBar evolution={profile.olfactoryEvolution} />
        </div>

        {/* Molécules clés */}
        <div>
          <h4 className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2">Molécules clés</h4>
          <div className="flex flex-wrap gap-1.5">
            {profile.keyMolecules.map((mol: string) => {
              const dbMol = resolved?.molecules?.find((m: any) =>
                m.name.toLowerCase().includes(mol.toLowerCase().split(" ")[0]) ||
                mol.toLowerCase().includes(m.name.toLowerCase().split(" ")[0])
              );
              return (
                <MoleculeChip key={mol} name={mol} dbId={dbMol?.id} />
              );
            })}
          </div>
        </div>

        {/* Lien vers la plante dans la DB */}
        {resolved?.plants && resolved.plants.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-zinc-600">Fiche plante :</span>
            {resolved.plants.map((p: any) => (
              <Link key={p.id} href={`/plantes/${p.id}`}>
                <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-400 hover:border-zinc-500 cursor-pointer">
                  {p.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Filtres par processus */}
        <div>
          <h4 className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2">
            Transformations chimiques ({profile.transformations.length})
          </h4>
          <div className="flex flex-wrap gap-1.5 mb-3">
            <button
              onClick={() => setActiveProcess(null)}
              className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                activeProcess === null
                  ? "bg-zinc-700 border-zinc-600 text-zinc-200"
                  : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
              }`}
            >
              Tous
            </button>
            {processesInProfile.map((p) => {
              const cfg = PROCESS_CONFIG[p];
              return (
                <button
                  key={p}
                  onClick={() => setActiveProcess(activeProcess === p ? null : p)}
                  className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                    activeProcess === p
                      ? `${cfg.bg} ${cfg.color}`
                      : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                  }`}
                >
                  {cfg.icon} {cfg.label}
                </button>
              );
            })}
          </div>

          {/* Liste des transformations */}
          <div className="space-y-3">
            {filteredTransformations.map((t: any) => (
              <TransformationFlow key={t.id} transformation={t} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ComparisonMatrix({ profiles }: { profiles: any[] }) {
  const { data: matrix } = trpc.resinMaturation.getComparisonMatrix.useQuery();

  const processes: TransformationProcess[] = [
    "isomerization", "oxidation", "pyrolysis", "fermentation",
    "hydrolysis", "polymerization", "decarboxylation", "cyclization",
  ];

  if (!matrix) return <div className="text-zinc-500 text-sm">Chargement...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-zinc-800">
            <th className="text-left py-2 px-3 text-zinc-500 font-normal w-40">Résine</th>
            <th className="text-center py-2 px-2 text-zinc-500 font-normal">Cat.</th>
            <th className="text-center py-2 px-2 text-zinc-500 font-normal">Durée</th>
            {processes.map((p) => (
              <th key={p} className="text-center py-2 px-1 w-10">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className={`text-base cursor-default ${PROCESS_CONFIG[p].color}`}>
                        {PROCESS_CONFIG[p].icon}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-900 border-zinc-700 text-zinc-200">
                      <p className="text-xs">{PROCESS_CONFIG[p].label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row: any) => {
            const catCfg = CATEGORY_CONFIG[row.category] ?? { label: row.category, color: "text-zinc-400" };
            return (
              <tr key={row.resinId} className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors">
                <td className="py-2 px-3 text-zinc-300 font-medium">{row.resinName}</td>
                <td className="py-2 px-2 text-center">
                  <span className={`text-[9px] px-1 rounded border ${catCfg.color}`}>{catCfg.label}</span>
                </td>
                <td className="py-2 px-2 text-center text-zinc-500">
                  {row.timelineMonths ? `${row.timelineMonths}m` : "—"}
                </td>
                {processes.map((p) => (
                  <td key={p} className="py-2 px-1 text-center">
                    {row[p] ? (
                      <span className={`text-base ${PROCESS_CONFIG[p].color}`}>●</span>
                    ) : (
                      <span className="text-zinc-800">·</span>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Légende */}
      <div className="mt-4 flex flex-wrap gap-3">
        {processes.map((p) => (
          <div key={p} className="flex items-center gap-1.5">
            <span className={`text-sm ${PROCESS_CONFIG[p].color}`}>{PROCESS_CONFIG[p].icon}</span>
            <span className="text-[10px] text-zinc-500">{PROCESS_CONFIG[p].label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProcessEncyclopedia() {
  const processes = Object.entries(PROCESS_CONFIG) as [TransformationProcess, typeof PROCESS_CONFIG[TransformationProcess]][];

  const examples: Record<TransformationProcess, string> = {
    isomerization: "α-Pinène → Camphène (oliban, labdanum) · β-Myrcène → Hashishène (cannabis)",
    oxidation: "Incensole → Acétate d'incensole (oliban) · β-Caryophyllène → Oxyde de caryophyllène (myrrhe, cannabis)",
    pyrolysis: "Acides boswelliques → Guaïacol (oliban brûlé) · Résines phénoliques → p-Crésol (myrrhe brûlée)",
    fermentation: "Glucosides terpéniques → Alcools libres (opoponax) · Analogie : curing du tabac",
    hydrolysis: "Coniferyl benzoate → Vanilline (benjoin) · Benzyl cinnamate → Acide cinnamique (benjoin)",
    distillation: "Concentration des monoterpènes volatils · Isomérisation thermique partielle",
    polymerization: "Monoterpènes → Polymères résineux (copal) · Durcissement progressif des résines",
    decarboxylation: "Acide β-boswellique → β-Boswellène (oliban) · THCA → THC (cannabis)",
    cyclization: "Sesquiterpènes ouverts → Furanoïdes (myrrhe) · Sclareol → Labdanol (labdanum)",
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {processes.map(([key, cfg]) => (
        <Card key={key} className={`border ${cfg.bg} bg-zinc-950`}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-base flex items-center gap-2 ${cfg.color}`}>
              <span className="text-xl">{cfg.icon}</span>
              {cfg.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-zinc-400 leading-relaxed">{cfg.description}</p>
            <div className="pt-1 border-t border-zinc-800">
              <p className="text-[10px] text-zinc-600 italic">Exemples : {examples[key]}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function ResinMaturation() {
  const { data: profiles, isLoading } = trpc.resinMaturation.getResinProfiles.useQuery();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProfiles = useMemo(() => {
    if (!profiles) return [];
    return profiles.filter((p) => {
      const matchCat = !selectedCategory || p.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.latinName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.keyMolecules.some((m: string) => m.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [profiles, selectedCategory, searchQuery]);

  const categories = useMemo(() => {
    if (!profiles) return [];
    return [...new Set(profiles.map((p) => p.category))];
  }, [profiles]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* En-tête */}
      <div className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-10">
        <div className="container max-w-7xl py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-amber-500" />
                Maturation des Résines & Encens
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                Transformations chimiques · Isomérisation · Oxydation · Pyrolyse · Fermentation · Hydrolyse
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Rechercher une résine ou molécule..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 w-56"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl py-6">
        <Tabs defaultValue="fiches">
          <TabsList className="bg-zinc-900 border border-zinc-800 mb-6">
            <TabsTrigger value="fiches" className="text-xs data-[state=active]:bg-zinc-800">
              Fiches résines ({profiles?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger value="tableau" className="text-xs data-[state=active]:bg-zinc-800">
              Tableau comparatif
            </TabsTrigger>
            <TabsTrigger value="encyclopedie" className="text-xs data-[state=active]:bg-zinc-800">
              Encyclopédie des processus
            </TabsTrigger>
          </TabsList>

          {/* ── Onglet Fiches ─────────────────────────────────────────────── */}
          <TabsContent value="fiches">
            {/* Filtres par catégorie */}
            <div className="flex flex-wrap gap-2 mb-5">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  !selectedCategory
                    ? "bg-zinc-700 border-zinc-600 text-zinc-200"
                    : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                }`}
              >
                Toutes
              </button>
              {categories.map((cat) => {
                const cfg = CATEGORY_CONFIG[cat] ?? { label: cat, color: "text-zinc-400" };
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      selectedCategory === cat
                        ? `border-zinc-600 ${cfg.color}`
                        : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                    }`}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>

            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-64 rounded-xl bg-zinc-900 animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                <p className="text-xs text-zinc-600 mb-4">{filteredProfiles.length} résine(s) affichée(s)</p>
                <div className="grid gap-6 md:grid-cols-2">
                  {filteredProfiles.map((profile) => (
                    <ResinCard key={profile.id} profile={profile} />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* ── Onglet Tableau ────────────────────────────────────────────── */}
          <TabsContent value="tableau">
            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-base text-zinc-300">
                  Matrice résines × processus chimiques
                </CardTitle>
                <p className="text-xs text-zinc-500">
                  Vue d'ensemble des transformations documentées pour chaque résine. Un ● indique qu'au moins une transformation de ce type est documentée.
                </p>
              </CardHeader>
              <CardContent>
                {profiles && <ComparisonMatrix profiles={profiles} />}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Onglet Encyclopédie ───────────────────────────────────────── */}
          <TabsContent value="encyclopedie">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-zinc-200 mb-1">Les 9 processus de transformation chimique</h2>
              <p className="text-xs text-zinc-500">
                Chaque résine subit un ou plusieurs de ces processus au cours de son vieillissement, de sa combustion ou de son extraction. Ces transformations sont responsables de l'évolution du profil olfactif dans le temps.
              </p>
            </div>
            <ProcessEncyclopedia />

            {/* Note sur le hashish */}
            <Card className="mt-6 bg-emerald-950/30 border-emerald-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-emerald-300 flex items-center gap-2">
                  <span>🌿</span> Focus : Isomérisation photo-induite dans le hashish
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Le <strong className="text-zinc-300">hashishène</strong> est l'exemple le plus documenté d'isomérisation photo-induite dans les résines. Formé par réarrangement du β-myrcène sous l'effet de la lumière UV, ce composé cyclopropanique est le marqueur chimique du hashish vieilli. Sa découverte par Marchini (2014) a permis d'expliquer le développement aromatique caractéristique des hash marocains et afghans vieillis — notes terreuses, épicées, profondes — absentes dans les résines fraîches.
                </p>
                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                  Cette transformation est analogue à l'isomérisation de l'α-pinène en camphène dans l'oliban, ou à la formation de l'acétate d'incensole par oxydation de l'incensole. Dans tous les cas, le vieillissement n'est pas une dégradation mais une <em>maturation chimique</em> qui enrichit le profil olfactif.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link href="/plantes?category=cannabis">
                    <Button variant="outline" size="sm" className="text-xs border-emerald-800 text-emerald-400 hover:bg-emerald-950/50">
                      Voir les variétés Cannabis →
                    </Button>
                  </Link>
                  <Link href="/molecules?search=hashishene">
                    <Button variant="outline" size="sm" className="text-xs border-zinc-700 text-zinc-400 hover:bg-zinc-900">
                      Fiche Hashishène →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
