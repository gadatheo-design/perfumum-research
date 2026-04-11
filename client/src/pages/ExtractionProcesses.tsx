import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Thermometer,
  Droplets,
  Wind,
  Leaf,
  FlaskConical,
  Zap,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CheckCircle,
  XCircle,
  Info,
  BookOpen,
  BarChart3,
  Layers,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode; bg: string }> = {
  thermal: { label: "Thermique", color: "text-orange-400", icon: <Thermometer className="w-4 h-4" />, bg: "bg-orange-500/10 border-orange-500/30" },
  mechanical: { label: "Mécanique", color: "text-blue-400", icon: <Wind className="w-4 h-4" />, bg: "bg-blue-500/10 border-blue-500/30" },
  solvent: { label: "Solvant", color: "text-purple-400", icon: <Droplets className="w-4 h-4" />, bg: "bg-purple-500/10 border-purple-500/30" },
  biological: { label: "Biologique", color: "text-green-400", icon: <Leaf className="w-4 h-4" />, bg: "bg-green-500/10 border-green-500/30" },
  supercritical: { label: "Supercritique", color: "text-cyan-400", icon: <Zap className="w-4 h-4" />, bg: "bg-cyan-500/10 border-cyan-500/30" },
};

const PROCESS_ICONS: Record<string, string> = {
  hydrolysis: "H₂O",
  oxidation: "O₂",
  cyclization: "○",
  isomerization: "⇌",
  fermentation: "🦠",
  decarboxylation: "CO₂",
  polymerization: "⛓",
  enzymatic: "🧬",
};

// ─── Composant Fiche Procédé ──────────────────────────────────────────────────

function ExtractionCard({ method, resolvedMolecules }: { method: any; resolvedMolecules?: any[] }) {
  const [expanded, setExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<"overview" | "transformations" | "molecules">("overview");
  const cat = CATEGORY_CONFIG[method.category] ?? CATEGORY_CONFIG.thermal;

  return (
    <Card className={`border ${cat.bg} transition-all duration-200`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${cat.bg} ${cat.color}`}>{cat.icon}</div>
            <div>
              <CardTitle className="text-base font-semibold">{method.name}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{method.nameEn}</p>
            </div>
          </div>
          <Badge variant="outline" className={`text-xs ${cat.color} border-current`}>
            {cat.label}
          </Badge>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="text-center p-2 rounded-md bg-background/50">
            <div className="text-xs text-muted-foreground">Température</div>
            <div className="text-sm font-mono font-medium">
              {method.temperature.min}–{method.temperature.max}{method.temperature.unit}
            </div>
          </div>
          <div className="text-center p-2 rounded-md bg-background/50">
            <div className="text-xs text-muted-foreground">Rendement</div>
            <div className="text-sm font-mono font-medium">{method.yieldRange}</div>
          </div>
          <div className="text-center p-2 rounded-md bg-background/50">
            <div className="text-xs text-muted-foreground">Durée</div>
            <div className="text-sm font-mono font-medium truncate">{method.duration.split(" ")[0]}</div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{method.description}</p>

        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 text-xs"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <><ChevronUp className="w-3 h-3 mr-1" /> Réduire</> : <><ChevronDown className="w-3 h-3 mr-1" /> Détails scientifiques</>}
        </Button>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0">
          {/* Sous-onglets */}
          <div className="flex gap-1 mb-4 border-b border-border pb-2">
            {(["overview", "transformations", "molecules"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setActiveSection(s)}
                className={`text-xs px-3 py-1 rounded-md transition-colors ${activeSection === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {s === "overview" ? "Vue d'ensemble" : s === "transformations" ? "Transformations" : "Molécules"}
              </button>
            ))}
          </div>

          {activeSection === "overview" && (
            <div className="space-y-4">
              {/* Principe */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Principe</h4>
                <p className="text-sm leading-relaxed">{method.principle}</p>
              </div>

              {/* Avantages / Inconvénients */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <h4 className="text-xs font-semibold text-green-400 mb-2 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Avantages
                  </h4>
                  <ul className="space-y-1">
                    {method.advantages.map((a: string, i: number) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="text-green-500 mt-0.5">+</span> {a}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-red-400 mb-2 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> Inconvénients
                  </h4>
                  <ul className="space-y-1">
                    {method.disadvantages.map((d: string, i: number) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="text-red-500 mt-0.5">−</span> {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Idéal pour */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Idéal pour</h4>
                <div className="flex flex-wrap gap-1.5">
                  {method.idealFor.map((p: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs">{p}</Badge>
                  ))}
                </div>
              </div>

              {/* Usage moderne */}
              <div className="p-3 rounded-md bg-primary/5 border border-primary/20">
                <h4 className="text-xs font-semibold text-primary mb-1">Usage moderne</h4>
                <p className="text-xs text-muted-foreground">{method.modernUse}</p>
              </div>

              {/* Note historique */}
              {method.historicalNote && (
                <div className="p-3 rounded-md bg-amber-500/5 border border-amber-500/20">
                  <h4 className="text-xs font-semibold text-amber-400 mb-1 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> Note historique
                  </h4>
                  <p className="text-xs text-muted-foreground">{method.historicalNote}</p>
                </div>
              )}
            </div>
          )}

          {activeSection === "transformations" && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                {method.transformations.length} transformation{method.transformations.length > 1 ? "s" : ""} moléculaire{method.transformations.length > 1 ? "s" : ""} documentée{method.transformations.length > 1 ? "s" : ""}
              </p>
              {method.transformations.map((t: any, i: number) => (
                <div key={i} className="p-3 rounded-md bg-background border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      {PROCESS_ICONS[t.mechanism?.toLowerCase().includes("hydrolyse") ? "hydrolysis" :
                        t.mechanism?.toLowerCase().includes("oxydation") ? "oxidation" :
                        t.mechanism?.toLowerCase().includes("cyclis") ? "cyclization" :
                        t.mechanism?.toLowerCase().includes("isom") ? "isomerization" :
                        t.mechanism?.toLowerCase().includes("enzym") ? "enzymatic" :
                        "oxidation"] ?? "→"}
                    </span>
                    <span className="text-xs font-semibold">{t.mechanism}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <span className="font-mono text-amber-300">{t.precursor}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span className="font-mono text-green-300">{t.product}</span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div><span className="text-foreground/60">Conditions :</span> {t.conditions}</div>
                    <div className="text-primary/80 italic">→ {t.olfactoryImpact}</div>
                    {t.references && (
                      <div className="text-muted-foreground/60 text-[10px]">Réf. : {t.references}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === "molecules" && (
            <div className="space-y-4">
              {/* Molécules préservées */}
              <div>
                <h4 className="text-xs font-semibold text-green-400 mb-2">Préservées</h4>
                <div className="flex flex-wrap gap-1.5">
                  {method.keyMolecules.preserved.map((mol: string, i: number) => {
                    const resolved = resolvedMolecules?.find((r: any) => r.name.toLowerCase() === mol.toLowerCase());
                    return resolved?.dbId ? (
                      <Link key={i} href={`/molecules/${resolved.dbId}`}>
                        <Badge variant="outline" className="text-xs text-green-400 border-green-500/40 hover:bg-green-500/10 cursor-pointer transition-colors">
                          {mol} ↗
                        </Badge>
                      </Link>
                    ) : (
                      <Badge key={i} variant="outline" className="text-xs text-green-400 border-green-500/40">{mol}</Badge>
                    );
                  })}
                </div>
              </div>

              {/* Molécules créées */}
              {method.keyMolecules.created.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-blue-400 mb-2">Créées par le procédé</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {method.keyMolecules.created.map((mol: string, i: number) => {
                      const resolved = resolvedMolecules?.find((r: any) => r.name.toLowerCase() === mol.toLowerCase());
                      return resolved?.dbId ? (
                        <Link key={i} href={`/molecules/${resolved.dbId}`}>
                          <Badge key={i} variant="outline" className="text-xs text-blue-400 border-blue-500/40 hover:bg-blue-500/10 cursor-pointer transition-colors">
                            {mol} ↗
                          </Badge>
                        </Link>
                      ) : (
                        <Badge key={i} variant="outline" className="text-xs text-blue-400 border-blue-500/40">{mol}</Badge>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Molécules détruites */}
              {method.keyMolecules.destroyed.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-red-400 mb-2">Dégradées / Perdues</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {method.keyMolecules.destroyed.map((mol: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs text-red-400 border-red-500/40">{mol}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Plantes exemples */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2">Plantes exemples</h4>
                <div className="flex flex-wrap gap-1.5">
                  {method.examplePlants.map((p: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs italic">{p}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

// ─── Tableau comparatif ───────────────────────────────────────────────────────

function ComparisonTable({ methods }: { methods: any[] }) {
  const rows = [
    { key: "temperature", label: "Température", render: (m: any) => `${m.temperature.min}–${m.temperature.max}${m.temperature.unit}` },
    { key: "pressure", label: "Pression", render: (m: any) => m.pressure },
    { key: "yieldRange", label: "Rendement", render: (m: any) => m.yieldRange },
    { key: "duration", label: "Durée", render: (m: any) => m.duration },
    { key: "transformations", label: "Transformations", render: (m: any) => `${m.transformations.length} documentées` },
    { key: "preserved", label: "Molécules préservées", render: (m: any) => `${m.keyMolecules.preserved.length}` },
    { key: "created", label: "Molécules créées", render: (m: any) => `${m.keyMolecules.created.length}` },
    { key: "destroyed", label: "Molécules dégradées", render: (m: any) => `${m.keyMolecules.destroyed.length}` },
  ];

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="text-left p-3 text-xs font-semibold text-muted-foreground w-36">Paramètre</th>
            {methods.map((m) => {
              const cat = CATEGORY_CONFIG[m.category];
              return (
                <th key={m.id} className="text-center p-3 text-xs font-semibold min-w-32">
                  <div className={`flex flex-col items-center gap-1 ${cat?.color}`}>
                    {cat?.icon}
                    <span className="text-foreground">{m.name}</span>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={row.key} className={`border-b border-border/50 ${ri % 2 === 0 ? "bg-background" : "bg-muted/10"}`}>
              <td className="p-3 text-xs font-medium text-muted-foreground">{row.label}</td>
              {methods.map((m) => (
                <td key={m.id} className="p-3 text-xs text-center font-mono">
                  {row.render(m)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Visualisation des transformations ───────────────────────────────────────

function TransformationMatrix({ methods }: { methods: any[] }) {
  const allTransformTypes = ["Hydrolyse", "Oxydation", "Cyclisation", "Isomérisation", "Fermentation", "Décarboxylation", "Polymérisation", "Enzymatique"];

  const getCount = (method: any, type: string) => {
    return method.transformations.filter((t: any) =>
      t.mechanism.toLowerCase().includes(type.toLowerCase().slice(0, 5))
    ).length;
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="text-left p-3 text-xs font-semibold text-muted-foreground w-36">Procédé</th>
            {allTransformTypes.map((t) => (
              <th key={t} className="text-center p-2 text-xs font-semibold text-muted-foreground min-w-24">
                {t}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {methods.map((m, mi) => {
            const cat = CATEGORY_CONFIG[m.category];
            return (
              <tr key={m.id} className={`border-b border-border/50 ${mi % 2 === 0 ? "bg-background" : "bg-muted/10"}`}>
                <td className="p-3 text-xs font-medium">
                  <div className={`flex items-center gap-1.5 ${cat?.color}`}>
                    {cat?.icon}
                    <span className="text-foreground">{m.name}</span>
                  </div>
                </td>
                {allTransformTypes.map((type) => {
                  const count = getCount(m, type);
                  return (
                    <td key={type} className="p-2 text-center">
                      {count > 0 ? (
                        <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          count >= 2 ? "bg-primary text-primary-foreground" : "bg-primary/30 text-primary"
                        }`}>
                          {count}
                        </div>
                      ) : (
                        <span className="text-muted-foreground/30">·</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function ExtractionProcesses() {
  const { data: methods, isLoading } = trpc.extractionProcesses.getWithMolecules.useQuery();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = useMemo(() => {
    if (!methods) return [];
    const cats = [...new Set(methods.map((m: any) => m.category))];
    return cats;
  }, [methods]);

  const filteredMethods = useMemo(() => {
    if (!methods) return [];
    return methods.filter((m: any) => {
      const matchCat = activeCategory === "all" || m.category === activeCategory;
      const matchSearch = !searchTerm || 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.idealFor.some((p: string) => p.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [methods, activeCategory, searchTerm]);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-muted rounded-lg" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Link href="/" className="hover:text-foreground transition-colors">PERFUMUM</Link>
          <span>/</span>
          <Link href="/resines-encens" className="hover:text-foreground transition-colors">Atelier</Link>
          <span>/</span>
          <span>Procédés d'Extraction</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Procédés d'Extraction & Distillation</h1>
        <p className="text-muted-foreground max-w-3xl leading-relaxed">
          Chaque méthode d'extraction transforme la matière végétale d'une façon unique — certaines molécules sont préservées, 
          d'autres créées par le procédé, d'autres encore dégradées. Cette page documente les transformations chimiques 
          induites par chaque technique et leurs effets sur le profil olfactif final.
        </p>
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><FlaskConical className="w-4 h-4" /> {methods?.length ?? 0} procédés documentés</span>
          <span className="flex items-center gap-1.5"><Layers className="w-4 h-4" /> {methods?.reduce((acc: number, m: any) => acc + m.transformations.length, 0) ?? 0} transformations moléculaires</span>
          <span className="flex items-center gap-1.5"><BarChart3 className="w-4 h-4" /> {Object.keys(CATEGORY_CONFIG).length} catégories</span>
        </div>
      </div>

      <Tabs defaultValue="fiches">
        <TabsList className="mb-6">
          <TabsTrigger value="fiches">Fiches procédés</TabsTrigger>
          <TabsTrigger value="comparatif">Tableau comparatif</TabsTrigger>
          <TabsTrigger value="matrice">Matrice transformations</TabsTrigger>
          <TabsTrigger value="guide">Guide de choix</TabsTrigger>
        </TabsList>

        {/* ─── Onglet Fiches ─── */}
        <TabsContent value="fiches">
          {/* Filtres */}
          <div className="flex flex-wrap gap-3 mb-6">
            <input
              type="text"
              placeholder="Rechercher un procédé, une plante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-48 max-w-xs px-3 py-1.5 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={activeCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory("all")}
              >
                Tous ({methods?.length ?? 0})
              </Button>
              {categories.map((cat: string) => {
                const config = CATEGORY_CONFIG[cat];
                const count = methods?.filter((m: any) => m.category === cat).length ?? 0;
                return (
                  <Button
                    key={cat}
                    variant={activeCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(cat)}
                    className={activeCategory === cat ? "" : config?.color}
                  >
                    {config?.icon}
                    <span className="ml-1">{config?.label} ({count})</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Grille de fiches */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredMethods.map((method: any) => (
              <ExtractionCard
                key={method.id}
                method={method}
                resolvedMolecules={method.resolvedMolecules}
              />
            ))}
          </div>

          {filteredMethods.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <FlaskConical className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Aucun procédé ne correspond à votre recherche.</p>
            </div>
          )}
        </TabsContent>

        {/* ─── Onglet Comparatif ─── */}
        <TabsContent value="comparatif">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-1">Comparaison des paramètres</h2>
            <p className="text-sm text-muted-foreground">Tableau comparatif des 8 procédés selon leurs paramètres clés.</p>
          </div>
          {methods && <ComparisonTable methods={methods} />}
        </TabsContent>

        {/* ─── Onglet Matrice ─── */}
        <TabsContent value="matrice">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-1">Matrice des transformations chimiques</h2>
            <p className="text-sm text-muted-foreground">
              Pour chaque procédé, le nombre de transformations documentées par type de mécanisme chimique.
              Les cases colorées indiquent une transformation active.
            </p>
          </div>
          {methods && <TransformationMatrix methods={methods} />}
        </TabsContent>

        {/* ─── Onglet Guide ─── */}
        <TabsContent value="guide">
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">Guide de choix du procédé</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Le choix du procédé d'extraction détermine fondamentalement le profil olfactif final. 
                Voici les critères de sélection selon la matière première et l'objectif.
              </p>
            </div>

            {[
              {
                title: "Fleurs délicates (jasmin, tubéreuse, violette)",
                icon: "🌸",
                recommendation: "Enfleurage ou extraction par solvant (hexane → absolue)",
                reason: "Ces fleurs continuent à produire des arômes après la cueillette. La chaleur de la distillation détruirait les composés les plus délicats (indole, méthyl jasmonate). L'enfleurage capture la production continue ; le solvant préserve les composés non-volatils.",
                avoid: "Hydrodistillation, entraînement à la vapeur",
                molecules: ["Acétate de benzyle", "Indole", "Méthyl jasmonate"],
              },
              {
                title: "Agrumes (bergamote, citron, orange)",
                icon: "🍋",
                recommendation: "Expression à froid (scarification mécanique)",
                reason: "Les essences d'agrumes sont contenues dans les glandes du zeste, non dans les tissus internes. La chaleur isomériserait le limonène et détruirait les composés les plus frais. L'expression à froid donne le profil le plus proche du fruit vivant.",
                avoid: "Distillation (profil complètement différent)",
                molecules: ["Limonène", "Linalol", "Acétate de linalyle"],
              },
              {
                title: "Racines, bois, graines",
                icon: "🌿",
                recommendation: "Hydrodistillation ou entraînement à la vapeur",
                reason: "Les matières dures nécessitent une chaleur prolongée pour libérer leurs composés. La distillation est idéale car ces matières contiennent peu d'esters sensibles à l'hydrolyse.",
                avoid: "Expression à froid (inefficace)",
                molecules: ["Vétivérol", "Santalol", "Cédrol"],
              },
              {
                title: "Composés thermosensibles (vanille, poivre, camomille)",
                icon: "🌡️",
                recommendation: "CO₂ supercritique",
                reason: "Le CO₂ supercritique opère à 31–60°C, préservant les composés qui se dégradent à 100°C. La vanilline, la pipérine et le bisabolol sont extraits intacts, avec un profil très proche du naturel.",
                avoid: "Hydrodistillation (dégradation thermique)",
                molecules: ["Vanilline", "Pipérine", "Bisabolol"],
              },
              {
                title: "Iris, fève tonka, vanille (macération longue)",
                icon: "⏳",
                recommendation: "Macération alcoolique longue durée",
                reason: "Ces matières nécessitent une transformation enzymatique lente pour développer leurs arômes caractéristiques. La glucovanilline devient vanilline, les irones se développent progressivement. Aucun autre procédé ne peut reproduire cette évolution.",
                avoid: "Distillation rapide (profil incomplet)",
                molecules: ["Vanilline", "Irones", "Coumarine"],
              },
            ].map((item, i) => (
              <Card key={i} className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-2">{item.title}</h3>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-xs font-medium text-green-400">Recommandé : </span>
                            <span className="text-xs">{item.recommendation}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed pl-5">{item.reason}</p>
                        <div className="flex items-start gap-2">
                          <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-xs font-medium text-red-400">À éviter : </span>
                            <span className="text-xs text-muted-foreground">{item.avoid}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pl-5">
                          <Info className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <div className="flex flex-wrap gap-1">
                            {item.molecules.map((mol, j) => (
                              <Badge key={j} variant="outline" className="text-[10px]">{mol}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Lien vers Résines & Encens */}
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <h3 className="font-semibold text-sm text-amber-400 mb-1">Pyrolyse & Combustion</h3>
                    <p className="text-xs text-muted-foreground">
                      La pyrolyse (combustion des résines et encens) est un procédé de transformation à part entière, 
                      documenté dans la page dédiée aux résines.
                    </p>
                    <Link href="/resines-encens">
                      <Button variant="outline" size="sm" className="mt-2 text-xs border-amber-500/40 text-amber-400 hover:bg-amber-500/10">
                        Voir Résines & Encens →
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
