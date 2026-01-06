import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Beaker,
  FlaskConical,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Leaf,
  Factory,
  AlertTriangle,
  CheckCircle,
  Info,
  ArrowLeftRight,
  Dna,
  Microscope,
} from "lucide-react";

// Types
interface MolecularMarker {
  id: number;
  markerId: string;
  botanicalFamily: string;
  moleculeName: string;
  casNumber?: string;
  typicalPercentage?: string;
  isKeyMarker: boolean;
  biosynthesisPathway?: string;
  notes?: string;
  axisId?: string;
}

interface BiotechMolecule {
  id: number;
  moleculeId: string;
  moleculeName: string;
  naturalSource?: string;
  casNumber?: string;
  heterologousGenes?: string[];
  hostOrganism?: string;
  yieldMgL?: string;
  purityPercent?: string;
  productionStatus: string;
  advantages?: string[];
  limitations?: string[];
  axisId?: string;
}

// Données de comparaison historique (extraites des notes des marqueurs)
const historicalComparisons = [
  {
    family: "Lamiaceae",
    species: "Lavandula angustifolia",
    molecule: "Linalol",
    historicalPeriod: "1850-1900",
    modernPeriod: "2020-2025",
    historicalConc: 35.5,
    modernConc: 28.2,
    trend: "decrease",
    significance: "Marqueur principal de qualité - Diminution liée au changement climatique",
  },
  {
    family: "Lamiaceae",
    species: "Lavandula angustifolia",
    molecule: "Acétate de linalyle",
    historicalPeriod: "1850-1900",
    modernPeriod: "2020-2025",
    historicalConc: 42.3,
    modernConc: 38.7,
    trend: "decrease",
    significance: "Ester caractéristique - Légère diminution",
  },
  {
    family: "Lamiaceae",
    species: "Lavandula angustifolia",
    molecule: "Camphre",
    historicalPeriod: "1850-1900",
    modernPeriod: "2020-2025",
    historicalConc: 0.8,
    modernConc: 2.4,
    trend: "increase",
    significance: "Augmentation significative - Stress thermique",
  },
  {
    family: "Rosaceae",
    species: "Rosa damascena",
    molecule: "Citronellol",
    historicalPeriod: "1880-1920",
    modernPeriod: "2020-2025",
    historicalConc: 34.2,
    modernConc: 29.8,
    trend: "decrease",
    significance: "Alcool principal - Diminution notable due au changement climatique",
  },
  {
    family: "Rosaceae",
    species: "Rosa damascena",
    molecule: "Géraniol",
    historicalPeriod: "1880-1920",
    modernPeriod: "2020-2025",
    historicalConc: 18.5,
    modernConc: 21.3,
    trend: "increase",
    significance: "Compensation métabolique possible",
  },
  {
    family: "Rosaceae",
    species: "Rosa damascena",
    molecule: "Rose oxide",
    historicalPeriod: "1880-1920",
    modernPeriod: "2020-2025",
    historicalConc: 0.12,
    modernConc: 0.08,
    trend: "decrease",
    significance: "Composé clé de l'odeur rose - Impact majeur sur profil olfactif",
  },
  {
    family: "Santalaceae",
    species: "Santalum album",
    molecule: "α-Santalol",
    historicalPeriod: "1920-1960",
    modernPeriod: "2020-2025",
    historicalConc: 46.8,
    modernConc: 38.2,
    trend: "decrease",
    significance: "Forte diminution - Arbres plus jeunes, moins de maturation",
  },
  {
    family: "Santalaceae",
    species: "Santalum album",
    molecule: "β-Santalol",
    historicalPeriod: "1920-1960",
    modernPeriod: "2020-2025",
    historicalConc: 21.3,
    modernConc: 18.7,
    trend: "decrease",
    significance: "Corrélation avec âge de l'arbre",
  },
  {
    family: "Burseraceae",
    species: "Boswellia sacra",
    molecule: "Incensole",
    historicalPeriod: "1850-1900",
    modernPeriod: "2020-2025",
    historicalConc: 12.4,
    modernConc: 8.9,
    trend: "decrease",
    significance: "Diterpène caractéristique - Composé bioactif en déclin",
  },
];

// Couleurs par famille
const familyColors: Record<string, string> = {
  Lamiaceae: "bg-purple-100 text-purple-800 border-purple-200",
  Rosaceae: "bg-pink-100 text-pink-800 border-pink-200",
  Rutaceae: "bg-orange-100 text-orange-800 border-orange-200",
  Santalaceae: "bg-amber-100 text-amber-800 border-amber-200",
  Burseraceae: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

// Icône de tendance
function TrendIcon({ trend }: { trend: string }) {
  if (trend === "increase") {
    return <TrendingUp className="h-4 w-4 text-green-600" />;
  } else if (trend === "decrease") {
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  }
  return <Minus className="h-4 w-4 text-gray-400" />;
}

// Calcul du pourcentage de variation
function calculateChange(historical: number, modern: number): string {
  const change = ((modern - historical) / historical) * 100;
  const sign = change > 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}

export function MolecularComparisonPage() {
  const [selectedFamily, setSelectedFamily] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("historical");

  // Récupérer les marqueurs moléculaires
  const { data: markers, isLoading: markersLoading } = trpc.molecularMarkers.list.useQuery();
  
  // Récupérer les molécules biotechnologiques
  const { data: biotechMolecules, isLoading: biotechLoading } = trpc.biotechMolecules.list.useQuery();

  // Filtrer par famille
  const filteredComparisons = selectedFamily === "all"
    ? historicalComparisons
    : historicalComparisons.filter(c => c.family === selectedFamily);

  const filteredBiotech = selectedFamily === "all"
    ? biotechMolecules || []
    : (biotechMolecules || []).filter((m: BiotechMolecule) => {
        // Mapper les sources naturelles aux familles
        const sourceToFamily: Record<string, string> = {
          "Rosa damascena": "Rosaceae",
          "Lavandula angustifolia": "Lamiaceae",
          "Santalum album": "Santalaceae",
          "Boswellia sacra": "Burseraceae",
          "Citrus aurantium": "Rutaceae",
        };
        return sourceToFamily[m.naturalSource || ""] === selectedFamily;
      });

  // Statistiques
  const stats = {
    totalMolecules: historicalComparisons.length,
    decreasing: historicalComparisons.filter(c => c.trend === "decrease").length,
    increasing: historicalComparisons.filter(c => c.trend === "increase").length,
    stable: historicalComparisons.filter(c => c.trend === "stable").length,
    biotechAvailable: (biotechMolecules || []).length,
    biotechCommercial: (biotechMolecules || []).filter((m: BiotechMolecule) => m.productionStatus === "commercial").length,
  };

  const families = [...new Set(historicalComparisons.map(c => c.family))];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8">
        <Breadcrumbs
          items={[
            { label: "Accueil", href: "/" },
            { label: "Axes de recherche", href: "/axes-recherche-perfumum" },
            { label: "Comparaison moléculaire", href: "/comparaison-moleculaire" },
          ]}
        />

        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
              <ArrowLeftRight className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Comparaison moléculaire trans-époques</h1>
              <p className="text-muted-foreground">
                Analyse comparative des profils terpéniques : échantillons historiques vs cultures modernes
              </p>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">{stats.totalMolecules}</div>
                <div className="text-xs text-blue-600">Molécules analysées</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-700">{stats.decreasing}</div>
                <div className="text-xs text-red-600">En diminution</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-700">{stats.increasing}</div>
                <div className="text-xs text-green-600">En augmentation</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-700">{stats.stable}</div>
                <div className="text-xs text-gray-600">Stables</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-700">{stats.biotechAvailable}</div>
                <div className="text-xs text-purple-600">Alternatives biotech</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-emerald-700">{stats.biotechCommercial}</div>
                <div className="text-xs text-emerald-600">Commercialisées</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Select value={selectedFamily} onValueChange={setSelectedFamily}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Famille botanique" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les familles</SelectItem>
              {families.map(family => (
                <SelectItem key={family} value={family}>{family}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="historical" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Évolution historique
            </TabsTrigger>
            <TabsTrigger value="biotech" className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              Alternatives biotechnologiques
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4" />
              Comparaison directe
            </TabsTrigger>
          </TabsList>

          {/* Onglet Évolution historique */}
          <TabsContent value="historical">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="h-5 w-5 text-amber-600" />
                  Évolution des profils terpéniques (1850-2025)
                </CardTitle>
                <CardDescription>
                  Comparaison entre échantillons d'herbier historiques et cultures modernes analysés par GC-MS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Famille</TableHead>
                      <TableHead>Espèce</TableHead>
                      <TableHead>Molécule</TableHead>
                      <TableHead className="text-center">Historique (%)</TableHead>
                      <TableHead className="text-center">Moderne (%)</TableHead>
                      <TableHead className="text-center">Variation</TableHead>
                      <TableHead>Tendance</TableHead>
                      <TableHead>Signification</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComparisons.map((comp, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Badge variant="outline" className={familyColors[comp.family]}>
                            {comp.family}
                          </Badge>
                        </TableCell>
                        <TableCell className="italic text-sm">{comp.species}</TableCell>
                        <TableCell className="font-medium">{comp.molecule}</TableCell>
                        <TableCell className="text-center">
                          <span className="text-muted-foreground">{comp.historicalConc}</span>
                          <div className="text-xs text-muted-foreground">{comp.historicalPeriod}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-medium">{comp.modernConc}</span>
                          <div className="text-xs text-muted-foreground">{comp.modernPeriod}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={comp.trend === "decrease" ? "text-red-600" : comp.trend === "increase" ? "text-green-600" : "text-gray-600"}>
                            {calculateChange(comp.historicalConc, comp.modernConc)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <TrendIcon trend={comp.trend} />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs">
                          {comp.significance}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Alternatives biotechnologiques */}
          <TabsContent value="biotech">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-cyan-600" />
                  Molécules produites par biotechnologie
                </CardTitle>
                <CardDescription>
                  Alternatives durables aux extractions naturelles - Production par fermentation dirigée
                </CardDescription>
              </CardHeader>
              <CardContent>
                {biotechLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Chargement...</div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {(filteredBiotech as BiotechMolecule[]).map((mol) => (
                      <Card key={mol.id} className="border-l-4 border-l-cyan-500">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{mol.moleculeName}</CardTitle>
                              <CardDescription className="italic">{mol.naturalSource}</CardDescription>
                            </div>
                            <Badge 
                              variant={mol.productionStatus === "commercial" ? "default" : "secondary"}
                              className={mol.productionStatus === "commercial" ? "bg-green-600" : ""}
                            >
                              {mol.productionStatus === "commercial" ? "Commercial" : 
                               mol.productionStatus === "pilot" ? "Pilote" : "Recherche"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {/* Métriques */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs text-muted-foreground">Rendement</div>
                              <div className="font-semibold">{mol.yieldMgL} mg/L</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Pureté</div>
                              <div className="font-semibold">{mol.purityPercent}%</div>
                            </div>
                          </div>

                          {/* Organisme hôte */}
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Organisme hôte</div>
                            <Badge variant="outline" className="italic">
                              {mol.hostOrganism}
                            </Badge>
                          </div>

                          {/* Gènes */}
                          {mol.heterologousGenes && (mol.heterologousGenes as string[]).length > 0 && (
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Gènes hétérologues</div>
                              <div className="flex flex-wrap gap-1">
                                {(mol.heterologousGenes as string[]).map((gene, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs bg-purple-50">
                                    <Dna className="h-3 w-3 mr-1" />
                                    {gene}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Avantages / Limitations */}
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                            <div>
                              <div className="text-xs font-medium text-green-700 mb-1 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" /> Avantages
                              </div>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {(mol.advantages as string[] || []).slice(0, 2).map((adv, idx) => (
                                  <li key={idx}>• {adv}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-amber-700 mb-1 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" /> Limitations
                              </div>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {(mol.limitations as string[] || []).slice(0, 2).map((lim, idx) => (
                                  <li key={idx}>• {lim}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Comparaison directe */}
          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowLeftRight className="h-5 w-5 text-indigo-600" />
                  Comparaison : Naturel historique vs Naturel moderne vs Biotechnologie
                </CardTitle>
                <CardDescription>
                  Analyse comparative des trois approches de production pour les molécules clés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Exemple pour le Linalol */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-purple-600" />
                      Linalol (Lavandula angustifolia)
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {/* Historique */}
                      <Card className="bg-amber-50 border-amber-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Historique (1850-1900)
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-2xl font-bold text-amber-700">35.5%</div>
                          <div className="text-xs text-muted-foreground">
                            Échantillons d'herbier analysés par GC-MS moderne
                          </div>
                          <Badge variant="outline" className="bg-amber-100">Référence qualité</Badge>
                        </CardContent>
                      </Card>

                      {/* Moderne */}
                      <Card className="bg-green-50 border-green-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Leaf className="h-4 w-4" />
                            Moderne (2020-2025)
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-2xl font-bold text-green-700">28.2%</div>
                          <div className="text-xs text-muted-foreground">
                            Cultures actuelles, même terroir
                          </div>
                          <Badge variant="outline" className="bg-red-100 text-red-700">-20.6%</Badge>
                        </CardContent>
                      </Card>

                      {/* Biotech */}
                      <Card className="bg-cyan-50 border-cyan-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <FlaskConical className="h-4 w-4" />
                            Biotechnologie
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-2xl font-bold text-cyan-700">99.5%</div>
                          <div className="text-xs text-muted-foreground">
                            Pureté, rendement 3500 mg/L
                          </div>
                          <Badge variant="outline" className="bg-green-100 text-green-700">Commercial</Badge>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Analyse */}
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div className="text-sm text-muted-foreground">
                          <strong>Analyse :</strong> La diminution de 20.6% du linalol dans les cultures modernes 
                          est attribuée au stress thermique lié au changement climatique. La production biotechnologique 
                          offre une alternative durable avec une pureté supérieure, mais ne reproduit pas la complexité 
                          du profil olfactif naturel (absence des co-produits mineurs).
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Exemple pour le Citronellol (Rose) */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-pink-600" />
                      Citronellol (Rosa damascena)
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Card className="bg-amber-50 border-amber-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Historique (1880-1920)
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-2xl font-bold text-amber-700">34.2%</div>
                          <div className="text-xs text-muted-foreground">
                            Vallée des Roses, Bulgarie
                          </div>
                          <Badge variant="outline" className="bg-amber-100">Référence qualité</Badge>
                        </CardContent>
                      </Card>

                      <Card className="bg-green-50 border-green-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Leaf className="h-4 w-4" />
                            Moderne (2020-2025)
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-2xl font-bold text-green-700">29.8%</div>
                          <div className="text-xs text-muted-foreground">
                            Même région, conditions modifiées
                          </div>
                          <Badge variant="outline" className="bg-red-100 text-red-700">-12.9%</Badge>
                        </CardContent>
                      </Card>

                      <Card className="bg-cyan-50 border-cyan-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <FlaskConical className="h-4 w-4" />
                            Biotechnologie
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-2xl font-bold text-cyan-700">98.5%</div>
                          <div className="text-xs text-muted-foreground">
                            Pureté, rendement 1250 mg/L
                          </div>
                          <Badge variant="outline" className="bg-green-100 text-green-700">Commercial</Badge>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Exemple pour le Santalol */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-amber-600" />
                      α-Santalol (Santalum album) — Espèce menacée
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Card className="bg-amber-50 border-amber-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Historique (1920-1960)
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-2xl font-bold text-amber-700">46.8%</div>
                          <div className="text-xs text-muted-foreground">
                            Arbres matures (60+ ans)
                          </div>
                          <Badge variant="outline" className="bg-amber-100">Référence qualité</Badge>
                        </CardContent>
                      </Card>

                      <Card className="bg-green-50 border-green-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Leaf className="h-4 w-4" />
                            Moderne (2020-2025)
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-2xl font-bold text-green-700">38.2%</div>
                          <div className="text-xs text-muted-foreground">
                            Arbres jeunes (15-20 ans)
                          </div>
                          <Badge variant="outline" className="bg-red-100 text-red-700">-18.4%</Badge>
                        </CardContent>
                      </Card>

                      <Card className="bg-cyan-50 border-cyan-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <FlaskConical className="h-4 w-4" />
                            Biotechnologie
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-2xl font-bold text-cyan-700">97.8%</div>
                          <div className="text-xs text-muted-foreground">
                            Pureté, rendement 420 mg/L
                          </div>
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-700">Pilote</Badge>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                        <div className="text-sm text-red-700">
                          <strong>Alerte conservation :</strong> Santalum album est classé vulnérable (IUCN). 
                          La surexploitation et le temps de maturation long (60 ans) rendent la production 
                          biotechnologique essentielle pour la préservation de l'espèce et la continuité 
                          de l'approvisionnement en parfumerie.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
