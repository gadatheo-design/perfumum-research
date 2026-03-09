// @ts-nocheck
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  FlaskConical, 
  Search,
  Droplets,
  Wind,
  Sparkles,
  BarChart3,
  ArrowLeftRight,
  Info,
  Leaf,
  Thermometer,
  DollarSign,
  Percent,
  Beaker
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { TabErrorBoundary } from "@/components/TabErrorBoundary";

// Types d'extraction
const extractionTypes = {
  he: { 
    name: "Huile Essentielle", 
    shortName: "HE",
    icon: Droplets, 
    color: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    description: "Obtenue par distillation à la vapeur d'eau",
    method: "Distillation vapeur",
    temperature: "100°C",
    yield: "0.5-3%",
    cost: "Moyen",
    purity: "Très haute",
    volatiles: "Élevés",
    thermosensibles: "Partiellement dégradés"
  },
  absolue: { 
    name: "Absolue", 
    shortName: "ABS",
    icon: Sparkles, 
    color: "bg-purple-500/10 text-purple-600 border-purple-500/30",
    description: "Obtenue par extraction au solvant puis concentration",
    method: "Extraction solvant",
    temperature: "40-60°C",
    yield: "0.1-0.5%",
    cost: "Élevé",
    purity: "Haute",
    volatiles: "Moyens",
    thermosensibles: "Préservés"
  },
  co2: { 
    name: "Extrait CO2", 
    shortName: "CO2",
    icon: Wind, 
    color: "bg-green-500/10 text-green-600 border-green-500/30",
    description: "Obtenue par extraction au CO2 supercritique",
    method: "CO2 supercritique",
    temperature: "31-40°C",
    yield: "2-10%",
    cost: "Très élevé",
    purity: "Exceptionnelle",
    volatiles: "Très élevés",
    thermosensibles: "Parfaitement préservés"
  }
};

// Données de comparaison pour le radar
const comparisonData = [
  { attribute: "Pureté", he: 85, absolue: 75, co2: 95 },
  { attribute: "Rendement", he: 60, absolue: 30, co2: 80 },
  { attribute: "Coût", he: 50, absolue: 70, co2: 90 },
  { attribute: "Volatils préservés", he: 70, absolue: 60, co2: 95 },
  { attribute: "Thermosensibles", he: 40, absolue: 75, co2: 95 },
  { attribute: "Complexité aromatique", he: 75, absolue: 90, co2: 85 },
  { attribute: "Durabilité", he: 60, absolue: 85, co2: 70 },
  { attribute: "Naturalité", he: 90, absolue: 80, co2: 95 }
];

// Exemples de plantes avec comparaison
const plantExamples = [
  {
    name: "Rose",
    latinName: "Rosa damascena",
    he: { mainMolecules: ["Citronellol (35%)", "Géraniol (18%)", "Nérol (8%)"], notes: "Note fraîche, légèrement verte" },
    absolue: { mainMolecules: ["Citronellol (38%)", "Géraniol (20%)", "Phényléthanol (3%)"], notes: "Note plus riche, miellée, complexe" },
    co2: { mainMolecules: ["Citronellol (45%)", "Géraniol (25%)", "Nérol (5%)"], notes: "Note très fidèle à la fleur fraîche" }
  },
  {
    name: "Gingembre",
    latinName: "Zingiber officinale",
    he: { mainMolecules: ["Zingibérène (20%)", "β-Sesquiphellandrène (12%)", "Camphène (8%)"], notes: "Note épicée, chaude, légèrement citronnée" },
    absolue: { mainMolecules: ["Zingibérène (15%)", "Gingérol (5%)", "Shogaol (3%)"], notes: "Note plus complexe, résineuse" },
    co2: { mainMolecules: ["Zingibérène (25%)", "6-Gingérol (8%)", "α-Curcumène (6%)"], notes: "Note très piquante, fraîche, fidèle au rhizome" }
  },
  {
    name: "Camomille",
    latinName: "Matricaria chamomilla",
    he: { mainMolecules: ["Chamazulène (8%)", "α-Bisabolol (25%)", "Oxyde de bisabolol (15%)"], notes: "Note herbacée, légèrement fruitée, bleu caractéristique" },
    absolue: { mainMolecules: ["α-Bisabolol (30%)", "Farnésène (10%)", "Spathulénol (5%)"], notes: "Note plus douce, miellée" },
    co2: { mainMolecules: ["Chamazulène (12%)", "α-Bisabolol (28%)", "Matricine (8%)"], notes: "Note très complexe, fidèle à la fleur, bleu intense" }
  },
  {
    name: "Vanille",
    latinName: "Vanilla planifolia",
    he: { mainMolecules: ["Non applicable - pas de distillation"], notes: "La vanille ne peut pas être distillée" },
    absolue: { mainMolecules: ["Vanilline (2%)", "Acide vanillique (0.5%)", "p-Hydroxybenzaldéhyde (0.3%)"], notes: "Note sucrée, balsamique, chaude" },
    co2: { mainMolecules: ["Vanilline (85%)", "Acide vanillique (3%)", "Gaïacol (1%)"], notes: "Note très concentrée, pure, fidèle à la gousse" }
  },
  {
    name: "Jasmin",
    latinName: "Jasminum grandiflorum",
    he: { mainMolecules: ["Non applicable - trop fragile"], notes: "Le jasmin ne supporte pas la distillation" },
    absolue: { mainMolecules: ["Benzyl acétate (25%)", "Linalol (8%)", "Indole (2.5%)"], notes: "Note florale intense, animale, narcotique" },
    co2: { mainMolecules: ["Benzyl acétate (30%)", "Jasmone (5%)", "Indole (3%)"], notes: "Note très fidèle à la fleur, moins animale" }
  }
];

export default function ComparaisonExtractions() {
  const [selectedPlant, setSelectedPlant] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("overview");
  
  // Récupérer les matières premières pour la comparaison
  const { data: rawMaterials, isLoading } = trpc.rawMaterials.getAll.useQuery({
    limit: 100
  });
  
  // Grouper les matières premières par plante source
  const groupedMaterials = useMemo(() => {
    if (!rawMaterials) return {};
    
    const groups: Record<string, any[]> = {};
    rawMaterials.forEach((rm: any) => {
      // Extraire le nom de la plante du nom de la matière première
      const plantName = rm.name?.replace(/^(HE|Absolue|Extrait CO2) (de |d')?/i, "").trim();
      if (plantName) {
        if (!groups[plantName]) groups[plantName] = [];
        groups[plantName].push(rm);
      }
    });
    
    // Ne garder que les groupes avec au moins 2 types d'extraction
    return Object.fromEntries(
      Object.entries(groups).filter(([_, items]) => items.length >= 2)
    );
  }, [rawMaterials]);
  
  return (
    <div className="container py-8 max-w-7xl">
      {/* En-tête */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <ArrowLeftRight className="h-8 w-8 text-primary" />
            Comparaison des méthodes d'extraction
          </h1>
          <p className="text-muted-foreground">
            Analyse comparative des huiles essentielles, absolues et extraits CO2
          </p>
        </div>
      </div>
      
      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Comparaison radar
          </TabsTrigger>
          <TabsTrigger value="molecules" className="flex items-center gap-2">
            <Beaker className="h-4 w-4" />
            Compositions moléculaires
          </TabsTrigger>
          <TabsTrigger value="examples" className="flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            Exemples par plante
          </TabsTrigger>
        </TabsList>
        
        {/* Vue d'ensemble */}
        <TabErrorBoundary>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(extractionTypes).map(([key, type]) => {
              const Icon = type.icon;
              return (
                <Card key={key} className="relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-full h-1 ${type.color.split(" ")[0]}`} />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${type.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      {type.name}
                    </CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Méthode</p>
                        <p className="font-medium">{type.method}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Température</p>
                        <p className="font-medium">{type.temperature}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rendement</p>
                        <p className="font-medium">{type.yield}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Coût</p>
                        <p className="font-medium">{type.cost}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pureté</span>
                        <span className="font-medium">{type.purity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Volatils</span>
                        <span className="font-medium">{type.volatiles}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Thermosensibles</span>
                        <span className="font-medium">{type.thermosensibles}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {/* Tableau comparatif */}
          <Card>
            <CardHeader>
              <CardTitle>Tableau comparatif détaillé</CardTitle>
              <CardDescription>Comparaison des caractéristiques principales</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Caractéristique</TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        Huile Essentielle
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-500" />
                        Absolue
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Wind className="h-4 w-4 text-green-500" />
                        Extrait CO2
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Procédé</TableCell>
                    <TableCell className="text-center">Distillation vapeur</TableCell>
                    <TableCell className="text-center">Extraction solvant + évaporation</TableCell>
                    <TableCell className="text-center">CO2 supercritique</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Température</TableCell>
                    <TableCell className="text-center">~100°C</TableCell>
                    <TableCell className="text-center">40-60°C</TableCell>
                    <TableCell className="text-center">31-40°C</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Pression</TableCell>
                    <TableCell className="text-center">Atmosphérique</TableCell>
                    <TableCell className="text-center">Atmosphérique</TableCell>
                    <TableCell className="text-center">73-300 bar</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Rendement typique</TableCell>
                    <TableCell className="text-center">0.5-3%</TableCell>
                    <TableCell className="text-center">0.1-0.5%</TableCell>
                    <TableCell className="text-center">2-10%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Coût relatif</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">Moyen</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-orange-500/10 text-orange-600">Élevé</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-red-500/10 text-red-600">Très élevé</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Molécules volatiles</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-green-500/10 text-green-600">Bien préservées</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">Partiellement</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-green-500/10 text-green-600">Excellemment préservées</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Molécules thermosensibles</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-red-500/10 text-red-600">Dégradées</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-green-500/10 text-green-600">Préservées</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-green-500/10 text-green-600">Parfaitement préservées</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Résidus de solvant</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-green-500/10 text-green-600">Aucun</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">Traces possibles</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-green-500/10 text-green-600">Aucun</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Fidélité olfactive</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">Bonne</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-green-500/10 text-green-600">Très bonne</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-green-500/10 text-green-600">Excellente</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        </TabErrorBoundary>
        
        {/* Comparaison radar */}
        <TabErrorBoundary>
        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comparaison radar des méthodes d'extraction</CardTitle>
              <CardDescription>Visualisation multi-critères des trois méthodes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={comparisonData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="attribute" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Huile Essentielle"
                      dataKey="he"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Absolue"
                      dataKey="absolue"
                      stroke="#a855f7"
                      fill="#a855f7"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Extrait CO2"
                      dataKey="co2"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.3}
                    />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Graphique en barres */}
          <Card>
            <CardHeader>
              <CardTitle>Comparaison par attribut</CardTitle>
              <CardDescription>Scores comparatifs sur 100</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="attribute" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="he" name="Huile Essentielle" fill="#3b82f6" />
                    <Bar dataKey="absolue" name="Absolue" fill="#a855f7" />
                    <Bar dataKey="co2" name="Extrait CO2" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </TabErrorBoundary>
        
        {/* Compositions moléculaires */}
        <TabErrorBoundary>
        <TabsContent value="molecules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Différences de composition moléculaire</CardTitle>
              <CardDescription>
                Comment les méthodes d'extraction influencent le profil moléculaire
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold">Huile Essentielle</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><strong>Molécules favorisées :</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Monoterpènes (limonène, pinène)</li>
                      <li>Monoterpénols (linalol, géraniol)</li>
                      <li>Oxydes (1,8-cinéole)</li>
                      <li>Aldéhydes légers</li>
                    </ul>
                    <p className="mt-4"><strong>Molécules perdues :</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Composés thermosensibles</li>
                      <li>Molécules lourdes non volatiles</li>
                      <li>Cires et résines</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    <h3 className="font-semibold">Absolue</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><strong>Molécules favorisées :</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Composés lourds (cires, résines)</li>
                      <li>Indoles et composés azotés</li>
                      <li>Esters complexes</li>
                      <li>Lactones et coumarines</li>
                    </ul>
                    <p className="mt-4"><strong>Molécules perdues :</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Monoterpènes très volatils</li>
                      <li>Certains aldéhydes légers</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Wind className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold">Extrait CO2</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><strong>Molécules favorisées :</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Tous les terpènes (mono, sesqui, di)</li>
                      <li>Composés thermosensibles intacts</li>
                      <li>Principes actifs (gingérol, curcumine)</li>
                      <li>Profil le plus complet</li>
                    </ul>
                    <p className="mt-4"><strong>Molécules perdues :</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Très peu de pertes</li>
                      <li>Certaines molécules très polaires</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Tableau des molécules signature */}
          <Card>
            <CardHeader>
              <CardTitle>Molécules signature par méthode</CardTitle>
              <CardDescription>
                Molécules caractéristiques de chaque type d'extraction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Famille moléculaire</TableHead>
                    <TableHead>HE</TableHead>
                    <TableHead>Absolue</TableHead>
                    <TableHead>CO2</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Monoterpènes</TableCell>
                    <TableCell><Badge className="bg-green-500/10 text-green-600">+++</Badge></TableCell>
                    <TableCell><Badge className="bg-yellow-500/10 text-yellow-600">+</Badge></TableCell>
                    <TableCell><Badge className="bg-green-500/10 text-green-600">+++</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">Limonène, pinène, myrcène</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sesquiterpènes</TableCell>
                    <TableCell><Badge className="bg-yellow-500/10 text-yellow-600">++</Badge></TableCell>
                    <TableCell><Badge className="bg-yellow-500/10 text-yellow-600">++</Badge></TableCell>
                    <TableCell><Badge className="bg-green-500/10 text-green-600">+++</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">Caryophyllène, humulène</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Phénols</TableCell>
                    <TableCell><Badge className="bg-yellow-500/10 text-yellow-600">++</Badge></TableCell>
                    <TableCell><Badge className="bg-green-500/10 text-green-600">+++</Badge></TableCell>
                    <TableCell><Badge className="bg-green-500/10 text-green-600">+++</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">Eugénol, thymol, gingérol</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Indoles</TableCell>
                    <TableCell><Badge className="bg-red-500/10 text-red-600">-</Badge></TableCell>
                    <TableCell><Badge className="bg-green-500/10 text-green-600">+++</Badge></TableCell>
                    <TableCell><Badge className="bg-yellow-500/10 text-yellow-600">++</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">Note animale du jasmin</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Cires & résines</TableCell>
                    <TableCell><Badge className="bg-red-500/10 text-red-600">-</Badge></TableCell>
                    <TableCell><Badge className="bg-green-500/10 text-green-600">+++</Badge></TableCell>
                    <TableCell><Badge className="bg-yellow-500/10 text-yellow-600">+</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">Fixateurs naturels</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Coumarines</TableCell>
                    <TableCell><Badge className="bg-yellow-500/10 text-yellow-600">+</Badge></TableCell>
                    <TableCell><Badge className="bg-green-500/10 text-green-600">+++</Badge></TableCell>
                    <TableCell><Badge className="bg-yellow-500/10 text-yellow-600">++</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">Note foin, tonka</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        </TabErrorBoundary>
        
        {/* Exemples par plante */}
        <TabErrorBoundary>
        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exemples comparatifs par plante</CardTitle>
              <CardDescription>
                Différences de composition selon la méthode d'extraction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {plantExamples.map((plant, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Leaf className="h-6 w-6 text-green-600" />
                      <div>
                        <h3 className="text-lg font-semibold">{plant.name}</h3>
                        <p className="text-sm text-muted-foreground italic">{plant.latinName}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* HE */}
                      <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
                        <div className="flex items-center gap-2 mb-3">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span className="font-medium text-blue-600">Huile Essentielle</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="font-medium">Molécules principales :</p>
                          <ul className="list-disc list-inside text-muted-foreground">
                            {plant.he.mainMolecules.map((mol, i) => (
                              <li key={i}>{mol}</li>
                            ))}
                          </ul>
                          <p className="mt-2 text-muted-foreground italic">{plant.he.notes}</p>
                        </div>
                      </div>
                      
                      {/* Absolue */}
                      <div className="bg-purple-500/5 rounded-lg p-4 border border-purple-500/20">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="h-4 w-4 text-purple-500" />
                          <span className="font-medium text-purple-600">Absolue</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="font-medium">Molécules principales :</p>
                          <ul className="list-disc list-inside text-muted-foreground">
                            {plant.absolue.mainMolecules.map((mol, i) => (
                              <li key={i}>{mol}</li>
                            ))}
                          </ul>
                          <p className="mt-2 text-muted-foreground italic">{plant.absolue.notes}</p>
                        </div>
                      </div>
                      
                      {/* CO2 */}
                      <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
                        <div className="flex items-center gap-2 mb-3">
                          <Wind className="h-4 w-4 text-green-500" />
                          <span className="font-medium text-green-600">Extrait CO2</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="font-medium">Molécules principales :</p>
                          <ul className="list-disc list-inside text-muted-foreground">
                            {plant.co2.mainMolecules.map((mol, i) => (
                              <li key={i}>{mol}</li>
                            ))}
                          </ul>
                          <p className="mt-2 text-muted-foreground italic">{plant.co2.notes}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </TabErrorBoundary>
      </Tabs>
    </div>
  );
}
