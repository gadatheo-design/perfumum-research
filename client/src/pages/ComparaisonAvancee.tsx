// @ts-nocheck
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell
} from "recharts";
import {
  FlaskConical,
  Plus,
  X,
  Search,
  ArrowLeftRight,
  BarChart3,
  Radar as RadarIcon,
  Table,
  Download,
  Share2,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles,
  Check,
  AlertCircle,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface ComparedMolecule {
  id: number;
  name: string;
  family?: string;
  radarIntensity: number;
  radarFreshness: number;
  radarWarmth: number;
  radarSweetness: number;
  radarSpiciness: number;
  radarEarthiness: number;
  color: string;
}

// Couleurs pour les molécules comparées
const COMPARISON_COLORS = [
  "oklch(0.65 0.25 280)", // Violet
  "oklch(0.65 0.25 340)", // Rose
  "oklch(0.65 0.25 140)", // Vert
  "oklch(0.65 0.25 40)",  // Orange
  "oklch(0.65 0.25 220)", // Bleu
  "oklch(0.65 0.25 80)",  // Jaune
  "oklch(0.65 0.25 0)",   // Rouge
  "oklch(0.65 0.25 180)", // Cyan
];

// Axes du radar
const RADAR_AXES = [
  { key: "intensity", label: "Intensité", fullLabel: "Intensité olfactive" },
  { key: "freshness", label: "Fraîcheur", fullLabel: "Notes fraîches" },
  { key: "warmth", label: "Chaleur", fullLabel: "Notes chaudes" },
  { key: "sweetness", label: "Douceur", fullLabel: "Notes douces" },
  { key: "spiciness", label: "Épicé", fullLabel: "Notes épicées" },
  { key: "earthiness", label: "Terreux", fullLabel: "Notes terreuses" },
];

// Composant de sélection de molécule
function MoleculeSelector({
  onSelect,
  excludeIds = [],
}: {
  onSelect: (molecule: any) => void;
  excludeIds?: number[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { data: molecules, isLoading } = trpc.molecules?.list.useQuery();

  const filteredMolecules = useMemo(() => {
    if (!molecules) return [];
    return molecules
      .filter(m => !excludeIds.includes(m.id))
      .filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.family?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 10);
  }, [molecules, searchQuery, excludeIds]);

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une molécule..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="pl-10"
          />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && searchQuery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-background border rounded-lg shadow-lg max-h-64 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-4 space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : filteredMolecules.length > 0 ? (
              <div className="p-2">
                {filteredMolecules.map((mol) => (
                  <button
                    key={mol.id}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left"
                    onClick={() => {
                      onSelect(mol);
                      setSearchQuery("");
                      setIsOpen(false);
                    }}
                  >
                    <FlaskConical className="h-4 w-4 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{mol.name}</p>
                      {mol.family && (
                        <p className="text-xs text-muted-foreground">{mol.family}</p>
                      )}
                    </div>
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                <p>Aucune molécule trouvée</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Composant de carte de molécule sélectionnée
function SelectedMoleculeCard({
  molecule,
  onRemove,
  color,
}: {
  molecule: ComparedMolecule;
  onRemove: () => void;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative group"
    >
      <Card className="border-2" style={{ borderColor: color }}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <div>
                <h4 className="font-semibold">{molecule.name}</h4>
                {molecule.family && (
                  <p className="text-sm text-muted-foreground">{molecule.family}</p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Mini profil radar */}
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Int.</span>
              <Progress value={molecule.radarIntensity} className="h-1 mt-1" />
            </div>
            <div>
              <span className="text-muted-foreground">Fra.</span>
              <Progress value={molecule.radarFreshness} className="h-1 mt-1" />
            </div>
            <div>
              <span className="text-muted-foreground">Cha.</span>
              <Progress value={molecule.radarWarmth} className="h-1 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Composant de graphique radar comparatif
function ComparisonRadarChart({ molecules }: { molecules: ComparedMolecule[] }) {
  const radarData = RADAR_AXES.map(axis => {
    const dataPoint: any = { axis: axis.label, fullLabel: axis.fullLabel };
    molecules?.forEach((mol, index) => {
      const key = `radar${axis.key.charAt(0).toUpperCase() + axis.key.slice(1)}` as keyof ComparedMolecule;
      dataPoint[mol.name] = mol[key] || 50;
    });
    return dataPoint;
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
        <PolarGrid stroke="oklch(0.85 0.01 280)" />
        <PolarAngleAxis 
          dataKey="axis" 
          tick={{ fill: "oklch(0.5 0.02 280)", fontSize: 12 }}
        />
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, 100]}
          tick={{ fill: "oklch(0.5 0.02 280)", fontSize: 10 }}
        />
        {molecules?.map((mol, index) => (
          <Radar
            key={mol.id}
            name={mol.name}
            dataKey={mol.name}
            stroke={mol.color}
            fill={mol.color}
            fillOpacity={0.2}
            strokeWidth={2}
          />
        ))}
        <Legend />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "oklch(0.98 0 0)", 
            border: "1px solid oklch(0.85 0.01 280)",
            borderRadius: "8px"
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// Composant de graphique en barres comparatif
function ComparisonBarChart({ molecules }: { molecules: ComparedMolecule[] }) {
  const barData = RADAR_AXES.map(axis => {
    const dataPoint: any = { axis: axis.label };
    molecules?.forEach((mol) => {
      const key = `radar${axis.key.charAt(0).toUpperCase() + axis.key.slice(1)}` as keyof ComparedMolecule;
      dataPoint[mol.name] = mol[key] || 50;
    });
    return dataPoint;
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={barData} layout="vertical" margin={{ top: 20, right: 30, bottom: 20, left: 80 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.85 0.01 280)" />
        <XAxis type="number" domain={[0, 100]} tick={{ fill: "oklch(0.5 0.02 280)", fontSize: 12 }} />
        <YAxis type="category" dataKey="axis" tick={{ fill: "oklch(0.5 0.02 280)", fontSize: 12 }} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "oklch(0.98 0 0)", 
            border: "1px solid oklch(0.85 0.01 280)",
            borderRadius: "8px"
          }}
        />
        <Legend />
        {molecules?.map((mol, index) => (
          <Bar
            key={mol.id}
            dataKey={mol.name}
            fill={mol.color}
            radius={[0, 4, 4, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

// Composant de tableau comparatif
function ComparisonTable({ molecules }: { molecules: ComparedMolecule[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3 font-semibold">Caractéristique</th>
            {molecules?.map((mol) => (
              <th key={mol.id} className="text-center p-3 font-semibold">
                <div className="flex items-center justify-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: mol.color }}
                  />
                  {mol.name}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {RADAR_AXES.map((axis) => (
            <tr key={axis.key} className="border-b hover:bg-muted/50">
              <td className="p-3 font-medium">{axis.fullLabel}</td>
              {molecules?.map((mol) => {
                const key = `radar${axis.key.charAt(0).toUpperCase() + axis.key.slice(1)}` as keyof ComparedMolecule;
                const value = (mol[key] as number) || 50;
                return (
                  <td key={mol.id} className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Progress value={value} className="w-20 h-2" />
                      <span className="text-sm font-mono w-8">{value}</span>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
          <tr className="border-b hover:bg-muted/50">
            <td className="p-3 font-medium">Famille</td>
            {molecules?.map((mol) => (
              <td key={mol.id} className="p-3 text-center">
                <Badge variant="outline">{mol.family || "Non définie"}</Badge>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// Composant d'analyse des différences
function DifferenceAnalysis({ molecules }: { molecules: ComparedMolecule[] }) {
  const analysis = useMemo(() => {
    if (molecules?.length < 2) return null;

    const differences: Array<{
      axis: string;
      label: string;
      maxDiff: number;
      highest: string;
      lowest: string;
    }> = [];

    RADAR_AXES.forEach((axis) => {
      const key = `radar${axis.key.charAt(0).toUpperCase() + axis.key.slice(1)}` as keyof ComparedMolecule;
      const values = molecules?.map(m => ({ name: m.name, value: (m[key] as number) || 50 }));
      const max = Math.max(...values.map(v => v.value));
      const min = Math.min(...values.map(v => v.value));
      
      differences.push({
        axis: axis.key,
        label: axis.fullLabel,
        maxDiff: max - min,
        highest: values.find(v => v.value === max)?.name || "",
        lowest: values.find(v => v.value === min)?.name || "",
      });
    });

    // Trier par différence décroissante
    differences.sort((a, b) => b.maxDiff - a.maxDiff);

    // Calculer la similarité globale
    const avgDiff = differences.reduce((acc, d) => acc + d.maxDiff, 0) / differences.length;
    const similarity = Math.round(100 - avgDiff);

    return { differences, similarity };
  }, [molecules]);

  if (!analysis) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Analyse des Différences
        </CardTitle>
        <CardDescription>
          Comparaison détaillée des profils olfactifs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score de similarité */}
        <div className="flex items-center justify-center gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">{analysis.similarity}%</div>
            <div className="text-sm text-muted-foreground">Similarité globale</div>
          </div>
          <div className="h-16 w-px bg-border" />
          <div className="text-center">
            <div className="text-4xl font-bold">{molecules?.length}</div>
            <div className="text-sm text-muted-foreground">Molécules comparées</div>
          </div>
        </div>

        {/* Différences par axe */}
        <div className="space-y-3">
          <h4 className="font-semibold">Principales différences</h4>
          {analysis.differences.slice(0, 3).map((diff) => (
            <div key={diff.axis} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{diff.label}</span>
                <Badge variant={diff.maxDiff > 30 ? "destructive" : diff.maxDiff > 15 ? "secondary" : "outline"}>
                  Δ {diff.maxDiff}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  <span className="text-green-600">↑</span> {diff.highest}
                </span>
                <span>
                  <span className="text-red-600">↓</span> {diff.lowest}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Points communs */}
        <div className="space-y-3">
          <h4 className="font-semibold">Points communs</h4>
          {analysis.differences
            .filter(d => d.maxDiff <= 15)
            .slice(0, 3)
            .map((diff) => (
              <div key={diff.axis} className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">{diff.label} - Profils similaires (Δ {diff.maxDiff})</span>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Page principale
export default function ComparaisonAvancee() {
  const [selectedMolecules, setSelectedMolecules] = useState<ComparedMolecule[]>([]);
  const [viewMode, setViewMode] = useState<"radar" | "bar" | "table">("radar");
  const [showAnalysis, setShowAnalysis] = useState(true);

  // Ajouter une molécule à la comparaison
  const addMolecule = useCallback((molecule: any) => {
    if (selectedMolecules.length >= 8) return;
    if (selectedMolecules.find(m => m.id === molecule.id)) return;

    const newMolecule: ComparedMolecule = {
      id: molecule.id,
      name: molecule.name,
      family: molecule.family,
      radarIntensity: molecule.radarIntensity || 50,
      radarFreshness: molecule.radarFreshness || 50,
      radarWarmth: molecule.radarWarmth || 50,
      radarSweetness: molecule.radarSweetness || 50,
      radarSpiciness: molecule.radarSpiciness || 50,
      radarEarthiness: molecule.radarEarthiness || 50,
      color: COMPARISON_COLORS[selectedMolecules.length % COMPARISON_COLORS.length],
    };

    setSelectedMolecules(prev => [...prev, newMolecule]);
  }, [selectedMolecules]);

  // Retirer une molécule
  const removeMolecule = useCallback((id: number) => {
    setSelectedMolecules(prev => {
      const filtered = prev.filter(m => m.id !== id);
      // Réassigner les couleurs
      return filtered.map((mol, index) => ({
        ...mol,
        color: COMPARISON_COLORS[index % COMPARISON_COLORS.length],
      }));
    });
  }, []);

  // Effacer toutes les sélections
  const clearAll = useCallback(() => {
    setSelectedMolecules([]);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        <div className="container py-8">
          {/* En-tête */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                <ArrowLeftRight className="h-3 w-3 mr-1" />
                Comparaison
              </Badge>
              <Badge variant="outline">
                {selectedMolecules.length}/8 molécules
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Comparaison Avancée
            </h1>
            <p className="text-muted-foreground mt-1">
              Comparez jusqu'à 8 molécules simultanément avec des visualisations interactives
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Panneau de sélection */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Ajouter des molécules
                  </CardTitle>
                  <CardDescription>
                    Sélectionnez les molécules à comparer
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <MoleculeSelector
                    onSelect={addMolecule}
                    excludeIds={selectedMolecules.map(m => m.id)}
                  />

                  {selectedMolecules.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {selectedMolecules.length} molécule(s) sélectionnée(s)
                      </span>
                      <Button variant="ghost" size="sm" onClick={clearAll}>
                        Tout effacer
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Liste des molécules sélectionnées */}
              <AnimatePresence>
                {selectedMolecules.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    {selectedMolecules.map((mol) => (
                      <SelectedMoleculeCard
                        key={mol.id}
                        molecule={mol}
                        color={mol.color}
                        onRemove={() => removeMolecule(mol.id)}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Analyse des différences */}
              {selectedMolecules.length >= 2 && showAnalysis && (
                <DifferenceAnalysis molecules={selectedMolecules} />
              )}
            </div>

            {/* Zone de visualisation */}
            <div className="lg:col-span-2">
              {selectedMolecules.length === 0 ? (
                <Card className="h-[500px] flex items-center justify-center">
                  <div className="text-center p-8">
                    <FlaskConical className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                    <h3 className="text-lg font-semibold mb-2">Aucune molécule sélectionnée</h3>
                    <p className="text-muted-foreground mb-4">
                      Utilisez la recherche ci-contre pour ajouter des molécules à comparer
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Badge variant="outline">Limonène</Badge>
                      <Badge variant="outline">Linalol</Badge>
                      <Badge variant="outline">Pinène</Badge>
                      <Badge variant="outline">Myrcène</Badge>
                    </div>
                  </div>
                </Card>
              ) : selectedMolecules.length === 1 ? (
                <Card className="h-[500px] flex items-center justify-center">
                  <div className="text-center p-8">
                    <AlertCircle className="h-16 w-16 mx-auto mb-4 text-amber-500/50" />
                    <h3 className="text-lg font-semibold mb-2">Ajoutez une deuxième molécule</h3>
                    <p className="text-muted-foreground">
                      La comparaison nécessite au moins 2 molécules
                    </p>
                  </div>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Visualisation comparative</CardTitle>
                      <div className="flex items-center gap-2">
                        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
                          <TabsList>
                            <TabsTrigger value="radar">
                              <RadarIcon className="h-4 w-4" />
                            </TabsTrigger>
                            <TabsTrigger value="bar">
                              <BarChart3 className="h-4 w-4" />
                            </TabsTrigger>
                            <TabsTrigger value="table">
                              <Table className="h-4 w-4" />
                            </TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <AnimatePresence mode="wait">
                      {viewMode === "radar" && (
                        <motion.div
                          key="radar"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <ComparisonRadarChart molecules={selectedMolecules} />
                        </motion.div>
                      )}
                      {viewMode === "bar" && (
                        <motion.div
                          key="bar"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <ComparisonBarChart molecules={selectedMolecules} />
                        </motion.div>
                      )}
                      {viewMode === "table" && (
                        <motion.div
                          key="table"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <ComparisonTable molecules={selectedMolecules} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
