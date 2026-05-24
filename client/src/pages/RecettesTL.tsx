// @ts-nocheck
import { safeJsonParse } from "@/lib/utils";
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Leaf, 
  FlaskConical, 
  ArrowLeft,
  Radar,
  Wind,
  TreeDeciduous,
  Sparkles,
  Eye,
  Flame,
  Droplets,
  ChevronDown,
  ChevronUp,
  Info,
  BookOpen
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Radar Chart Component for TL formulations
function TLRadarChart({ formulation, size = 180 }: { formulation: any; size?: number }) {
  // Extract radar values from formulation data
  const radarData = [
    { axis: "Anisé", value: formulation.anise || 50, color: "#10b981" },
    { axis: "Herbacé", value: formulation.herbace || 50, color: "#22c55e" },
    { axis: "Épicé", value: formulation.epice || 50, color: "#f59e0b" },
    { axis: "Frais", value: formulation.frais || 50, color: "#06b6d4" },
    { axis: "Résineux", value: formulation.resineux || 50, color: "#8b5cf6" },
  ];

  const center = size / 2;
  const maxRadius = size / 2 - 25;
  const angleSlice = (Math.PI * 2) / radarData.length;

  const getPoint = (value: number, index: number) => {
    const radius = (value / 100) * maxRadius;
    const angle = angleSlice * index - Math.PI / 2;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const pathData = radarData
    .map((d, i) => {
      const point = getPoint(d.value, i);
      return `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`;
    })
    .join(" ") + " Z";

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Grid circles */}
      {[25, 50, 75, 100].map((level) => (
        <circle
          key={level}
          cx={center}
          cy={center}
          r={(level / 100) * maxRadius}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.15}
        />
      ))}
      {/* Axis lines and labels */}
      {radarData.map((d, i) => {
        const point = getPoint(100, i);
        const labelPoint = getPoint(115, i);
        return (
          <g key={i}>
            <line
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="currentColor"
              strokeOpacity={0.2}
            />
            <text
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px] fill-muted-foreground"
            >
              {d.axis}
            </text>
          </g>
        );
      })}
      {/* Data polygon */}
      <path
        d={pathData}
        fill="hsl(142, 76%, 36%)"
        fillOpacity={0.25}
        stroke="hsl(142, 76%, 36%)"
        strokeWidth={2}
      />
      {/* Data points */}
      {radarData.map((d, i) => {
        const point = getPoint(d.value, i);
        return (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={4}
            fill="hsl(142, 76%, 36%)"
            stroke="white"
            strokeWidth={2}
          />
        );
      })}
    </svg>
  );
}

// Climatic Axis Badge Component
function ClimaticAxisBadge({ axis }: { axis: string }) {
  const axisConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    vent: { icon: <Wind className="h-3 w-3" />, color: "bg-cyan-500/20 text-cyan-700 border-cyan-500/30", label: "Vent" },
    bois: { icon: <TreeDeciduous className="h-3 w-3" />, color: "bg-amber-500/20 text-amber-700 border-amber-500/30", label: "Bois" },
    disparition: { icon: <Sparkles className="h-3 w-3" />, color: "bg-purple-500/20 text-purple-700 border-purple-500/30", label: "Disparition" },
    vent_bois: { icon: <Wind className="h-3 w-3" />, color: "bg-teal-500/20 text-teal-700 border-teal-500/30", label: "Vent + Bois" },
    bois_disparition: { icon: <TreeDeciduous className="h-3 w-3" />, color: "bg-orange-500/20 text-orange-700 border-orange-500/30", label: "Bois + Disparition" },
    vent_disparition: { icon: <Sparkles className="h-3 w-3" />, color: "bg-indigo-500/20 text-indigo-700 border-indigo-500/30", label: "Vent + Disparition" },
  };

  const config = axisConfig[axis] || axisConfig.vent;

  return (
    <Badge variant="outline" className={`${config.color} flex items-center gap-1`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}

// Category Badge Component
function CategoryBadge({ category }: { category: string }) {
  const categoryConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    parfum: { icon: <Droplets className="h-3 w-3" />, color: "bg-pink-500/20 text-pink-700 border-pink-500/30", label: "Parfum" },
    encens: { icon: <Flame className="h-3 w-3" />, color: "bg-red-500/20 text-red-700 border-red-500/30", label: "Encens" },
    extrait: { icon: <FlaskConical className="h-3 w-3" />, color: "bg-emerald-500/20 text-emerald-700 border-emerald-500/30", label: "Extrait" },
  };

  const config = categoryConfig[category] || categoryConfig.parfum;

  return (
    <Badge variant="outline" className={`${config.color} flex items-center gap-1`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}

// Formula Display Component
function FormulaDisplay({ formula }: { formula: string }) {
  try {
    const parsed = safeJsonParse(formula, null);
    const entries = Object.entries(parsed);
    
    return (
      <div className="space-y-2">
        {entries.map(([ingredient, details]: [string, any], index) => (
          <div key={index} className="flex justify-between items-center py-1 border-b border-border/50 last:border-0">
            <span className="text-sm">{ingredient}</span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {details.percent}%
              </Badge>
              <span className="text-xs text-muted-foreground capitalize">
                {details.note}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  } catch {
    return <p className="text-sm text-muted-foreground">{formula}</p>;
  }
}

// TL Recipe Card Component
function TLRecipeCard({ recipe, expanded, onToggle }: { recipe: any; expanded: boolean; onToggle: () => void }) {
  // Calculate radar values based on recipe characteristics
  const radarValues = useMemo(() => {
    const name = recipe.name?.toLowerCase() || "";
    const desc = recipe.description?.toLowerCase() || "";
    
    return {
      anise: name.includes("anisé") || desc.includes("estragole") ? 85 : 
             name.includes("épice") ? 60 : 40,
      herbace: name.includes("verde") || desc.includes("herbacé") ? 80 : 
               name.includes("vent") ? 70 : 45,
      epice: name.includes("épice") || desc.includes("méthyl-eugénol") ? 85 : 
             name.includes("encens") ? 65 : 35,
      frais: name.includes("verde") || desc.includes("carvone") ? 75 : 
             name.includes("vent") ? 80 : 40,
      resineux: name.includes("encens") || desc.includes("copal") ? 85 : 
                name.includes("synergie") ? 50 : 30,
    };
  }, [recipe]);

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-emerald-700">
              {recipe.name}
            </CardTitle>
            <div className="flex gap-2 flex-wrap">
              <CategoryBadge category={recipe.category} />
              {recipe.gamme && (
                <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/30">
                  <Leaf className="h-3 w-3 mr-1" />
                  Tagetes lucida
                </Badge>
              )}
            </div>
          </div>
          <TLRadarChart formulation={radarValues} size={120} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {recipe.description}
        </p>
        
        {/* Pyramid olfactive */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="p-2 rounded bg-cyan-50 dark:bg-cyan-950/30">
            <p className="font-medium text-cyan-700 mb-1">Tête</p>
            <p className="text-muted-foreground">{recipe.notes_tete || "—"}</p>
          </div>
          <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/30">
            <p className="font-medium text-emerald-700 mb-1">Cœur</p>
            <p className="text-muted-foreground">{recipe.notes_coeur || "—"}</p>
          </div>
          <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/30">
            <p className="font-medium text-amber-700 mb-1">Fond</p>
            <p className="text-muted-foreground">{recipe.notes_fond || "—"}</p>
          </div>
        </div>

        {/* Expandable formula section */}
        <Accordion type="single" collapsible>
          <AccordionItem value="formula" className="border-none">
            <AccordionTrigger className="py-2 text-sm hover:no-underline">
              <span className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4" />
                Voir la formule complète
              </span>
            </AccordionTrigger>
            <AccordionContent>
              {recipe.formula && <FormulaDisplay formula={recipe.formula} />}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

// Comparison Table Component
function ComparisonTable({ recipes }: { recipes: any[] }) {
  const parseFormula = (formula: string) => {
    try {
      return safeJsonParse(formula, null);
    } catch {
      return {};
    }
  };

  // Get all unique ingredients across all recipes
  const allIngredients = useMemo(() => {
    const ingredients = new Set<string>();
    recipes.forEach(r => {
      const formula = parseFormula(r.formula);
      Object.keys(formula).forEach(key => ingredients.add(key));
    });
    return Array.from(ingredients).sort();
  }, [recipes]);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px] sticky left-0 bg-background">Ingrédient</TableHead>
            {recipes.map((r, i) => (
              <TableHead key={i} className="text-center min-w-[120px]">
                <span className="text-xs">{r.name?.replace("TL-0", "").split("—")[0]}</span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {allIngredients.map((ingredient, idx) => (
            <TableRow key={idx}>
              <TableCell className="font-medium sticky left-0 bg-background text-sm">
                {ingredient}
              </TableCell>
              {recipes.map((r, i) => {
                const formula = parseFormula(r.formula);
                const details = formula[ingredient];
                return (
                  <TableCell key={i} className="text-center">
                    {details ? (
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-emerald-600">{details.percent}%</span>
                        <span className="text-xs text-muted-foreground capitalize">{details.note}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function RecettesTL() {
  const [activeTab, setActiveTab] = useState("grid");
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  // Fetch TL recipes (IDs 450001-450005)
  const { data: allRecettes, isLoading } = trpc.recettes.list.useQuery({});
  
  // Fetch TerpProfiles for linking
  const { data: terpProfiles } = trpc.terpProfiles?.list.useQuery();

  // Filter TL recipes
  const tlRecipes = useMemo(() => {
    if (!allRecettes) return [];
    return allRecettes?.filter((r: any) => 
      r.id >= 450001 && r.id <= 450005
    ).sort((a: any, b: any) => a.id - b.id);
  }, [allRecettes]);

  // Find related TerpProfiles (those mentioning Tagetes or anise-related)
  const relatedProfiles = useMemo(() => {
    if (!terpProfiles) return [];
    return terpProfiles?.filter((tp: any) => 
      tp.name?.toLowerCase().includes("vent") ||
      tp.name?.toLowerCase().includes("citral") ||
      tp.climaticAxis === "vent" ||
      tp.climaticAxis === "vent_bois"
    ).slice(0, 5);
  }, [terpProfiles]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/20 dark:to-background">
      <Breadcrumbs />
        <Header />
        <main className="container py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/20 dark:to-background">
      <Header />
      
      <main className="container py-8 space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <Link href="/recettes">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour aux recettes
            </Button>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <Leaf className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-200">
                Recettes Tagetes lucida (TL)
              </h1>
              <p className="text-muted-foreground">
                5 formulations exploitant le profil phénylpropanoïde du Pericón mexicain
              </p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Tagetes lucida</strong> (Pericón) est une plante sacrée aztèque riche en 
                  <strong> estragole</strong> (70-96%) et <strong>anéthole</strong>. Ces formulations 
                  explorent ses différentes facettes olfactives : anisée, herbacée, épicée et rituelle.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-white/50">Estragole 70-96%</Badge>
                  <Badge variant="outline" className="bg-white/50">Anéthole 5-42%</Badge>
                  <Badge variant="outline" className="bg-white/50">Méthyl-eugénol</Badge>
                  <Badge variant="outline" className="bg-white/50">β-Ocimène</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="grid" className="gap-2">
              <Eye className="h-4 w-4" />
              Fiches
            </TabsTrigger>
            <TabsTrigger value="compare" className="gap-2">
              <Radar className="h-4 w-4" />
              Comparaison
            </TabsTrigger>
            <TabsTrigger value="profiles" className="gap-2">
              <BookOpen className="h-4 w-4" />
              TerpProfiles
            </TabsTrigger>
          </TabsList>

          {/* Grid View */}
          <TabsContent value="grid" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tlRecipes.map((recipe: any) => (
                <TLRecipeCard 
                  key={recipe.id} 
                  recipe={recipe}
                  expanded={expandedCard === recipe.id}
                  onToggle={() => setExpandedCard(expandedCard === recipe.id ? null : recipe.id)}
                />
              ))}
            </div>
          </TabsContent>

          {/* Comparison View */}
          <TabsContent value="compare" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radar className="h-5 w-5 text-emerald-600" />
                  Tableau comparatif des 5 formulations TL
                </CardTitle>
                <CardDescription>
                  Comparaison des ingrédients et proportions entre les formulations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComparisonTable recipes={tlRecipes} />
              </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card className="bg-pink-50/50 dark:bg-pink-950/20 border-pink-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-pink-600" />
                    Parfums (3)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    TL-01 Anisé, TL-02 Verde, TL-03 Épice — Explorent les facettes liquides du Pericón
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-red-50/50 dark:bg-red-950/20 border-red-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Flame className="h-4 w-4 text-red-600" />
                    Encens (1)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    TL-04 Encens Pericón — Usage rituel mésoaméricain avec copal
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-emerald-600" />
                    Extrait (1)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    TL-05 Synergie Vent — Axe climatique VENT du système Absorbe
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TerpProfiles View */}
          <TabsContent value="profiles" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-emerald-600" />
                    TerpProfiles associés
                  </CardTitle>
                  <CardDescription>
                    Profils analytiques liés aux axes climatiques des formulations TL
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {relatedProfiles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {relatedProfiles.map((profile: any) => (
                        <Link key={profile.id} href={`/terp-profiles/${profile.profileId}`}>
                          <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-sm">{profile.profileId}</p>
                                  <p className="text-sm text-muted-foreground">{profile.name}</p>
                                </div>
                                <ClimaticAxisBadge axis={profile.climaticAxis || "vent"} />
                              </div>
                              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                {profile.interpretation || profile.collection}
                              </p>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Aucun TerpProfile directement lié. Les formulations TL utilisent principalement 
                      l'axe VENT du système Absorbe.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Link to full TerpProfiles page */}
              <div className="flex justify-center">
                <Link href="/terp-profiles">
                  <Button variant="outline" className="gap-2">
                    <Radar className="h-4 w-4" />
                    Voir tous les TerpProfiles
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Methodology Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Méthodologie de formulation</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              Les 5 formulations TL explorent les différentes facettes olfactives de <em>Tagetes lucida</em> 
              selon la méthodologie ABSORBE. Chaque formulation cible un axe sensoriel spécifique :
            </p>
            <ul>
              <li><strong>TL-01 Anisé</strong> : Exploitation du profil phénylpropanoïde dominant (estragole 86%)</li>
              <li><strong>TL-02 Verde</strong> : Facettes vertes-fruitées via les cétones (tagetone, carvone)</li>
              <li><strong>TL-03 Épice</strong> : Synergies méthyl-eugénol / phénylpropanoïdes</li>
              <li><strong>TL-04 Encens</strong> : Usage rituel traditionnel avec copal</li>
              <li><strong>TL-05 Synergie</strong> : Intégration dans l'axe climatique VENT</li>
            </ul>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
