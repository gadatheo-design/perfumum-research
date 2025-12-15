import { useState } from "react";
import { Link } from "wouter";
import { 
  FlaskConical, 
  Flame, 
  Droplets, 
  Thermometer,
  Info,
  ChevronDown,
  ChevronUp,
  Beaker,
  Leaf
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

// Données des esters aromatiques du tabac
const estersTabac = [
  {
    name: "Éthyl butyrate",
    formula: "C6H12O2",
    family: "Esters fruités",
    arome: "Ananas, pomme, cassis",
    effetCombustion: "Sucré, stable",
    application: "Ouverture fruitée",
    dosage: "0.1-0.6%",
    color: "bg-yellow-100 dark:bg-yellow-900"
  },
  {
    name: "Isoamyl acetate",
    formula: "C7H14O2",
    family: "Esters fruités",
    arome: "Banane, poire",
    effetCombustion: "Résiste à la chaleur",
    application: "Fruit mûr",
    dosage: "0.1-0.5%",
    color: "bg-yellow-100 dark:bg-yellow-900"
  },
  {
    name: "Benzyl acetate",
    formula: "C9H10O2",
    family: "Esters aromatiques",
    arome: "Jasmin, ylang, miel",
    effetCombustion: "Stable",
    application: "Floral luxueux",
    dosage: "0.2-1%",
    color: "bg-pink-100 dark:bg-pink-900"
  },
  {
    name: "Ethyl lactate",
    formula: "C5H10O3",
    family: "Esters lactiques",
    arome: "Lait, crème, yaourt",
    effetCombustion: "Stable",
    application: "Rondeur lactée",
    dosage: "0.2-0.8%",
    color: "bg-blue-100 dark:bg-blue-900"
  },
  {
    name: "Methyl anthranilate",
    formula: "C8H9NO2",
    family: "Esters aromatiques",
    arome: "Raisin, fleur d'oranger",
    effetCombustion: "Modéré",
    application: "Complexité florale",
    dosage: "0.1-0.5%",
    color: "bg-purple-100 dark:bg-purple-900"
  },
  {
    name: "Ethyl cinnamate",
    formula: "C11H12O2",
    family: "Esters balsamiques",
    arome: "Cannelle, baume",
    effetCombustion: "Stable",
    application: "Base chaude",
    dosage: "0.2-0.8%",
    color: "bg-orange-100 dark:bg-orange-900"
  },
  {
    name: "Ethyl decanoate",
    formula: "C12H24O2",
    family: "Esters gras",
    arome: "Rhum, fruité-gras",
    effetCombustion: "Stable",
    application: "Note rhum",
    dosage: "0.1-0.5%",
    color: "bg-amber-100 dark:bg-amber-900"
  },
  {
    name: "Ethyl phenylacetate",
    formula: "C10H12O2",
    family: "Esters aromatiques",
    arome: "Miel, floral, rose",
    effetCombustion: "Stable",
    application: "Note miel-floral",
    dosage: "0.1-0.4%",
    color: "bg-rose-100 dark:bg-rose-900"
  },
  {
    name: "Methyl salicylate",
    formula: "C8H8O3",
    family: "Esters aromatiques",
    arome: "Wintergreen, balsamique",
    effetCombustion: "Stable",
    application: "Fraîcheur balsamique",
    dosage: "0.1-0.3%",
    color: "bg-green-100 dark:bg-green-900"
  },
  {
    name: "Butyl butyrate",
    formula: "C8H16O2",
    family: "Esters fruités",
    arome: "Beurré, fruité, ananas",
    effetCombustion: "Stable",
    application: "Note beurrée",
    dosage: "0.1-0.5%",
    color: "bg-yellow-100 dark:bg-yellow-900"
  },
  {
    name: "Ethyl 3-methylthiopropionate",
    formula: "C6H12O2S",
    family: "Esters soufrés",
    arome: "Cassis, soufré",
    effetCombustion: "Attention: puissant",
    application: "Note cassis",
    dosage: "0.01-0.1%",
    color: "bg-violet-100 dark:bg-violet-900"
  },
  {
    name: "Ethyl furan-2-carboxylate",
    formula: "C7H8O3",
    family: "Esters furaniques",
    arome: "Cuir, caramel, fumé",
    effetCombustion: "Stable",
    application: "Note cuir-caramel",
    dosage: "0.1-0.5%",
    color: "bg-amber-100 dark:bg-amber-900"
  },
  {
    name: "Gamma-decalactone",
    formula: "C10H18O2",
    family: "Lactones",
    arome: "Pêche, abricot, crémeux",
    effetCombustion: "Stable",
    application: "Note pêche",
    dosage: "0.1-0.5%",
    color: "bg-orange-100 dark:bg-orange-900"
  }
];

// Données des acides gras aromatiques
const acidesGras = [
  {
    name: "Acide hexanoïque (C6)",
    formula: "C6H12O2",
    type: "Court/volatil",
    pourcentage: "0.04% Burley / 0.03% Virginia / 0.07% Cigare",
    aromeCombustion: "Caramel, fumé",
    compatibilites: "Miel, tonka, résine",
    color: "bg-amber-100 dark:bg-amber-900"
  },
  {
    name: "Acide octanoïque (C8)",
    formula: "C8H16O2",
    type: "Moyen",
    pourcentage: "0.06% Burley / 0.05% Virginia / 0.1% Cigare",
    aromeCombustion: "Fumé lactonique",
    compatibilites: "Santal, patchouli",
    color: "bg-orange-100 dark:bg-orange-900"
  },
  {
    name: "Acide décanoïque (C10)",
    formula: "C10H20O2",
    type: "Moyen",
    pourcentage: "0.03% Burley / 0.02% Virginia / 0.07% Cigare",
    aromeCombustion: "Vanillé",
    compatibilites: "Vanille, vétiver",
    color: "bg-yellow-100 dark:bg-yellow-900"
  },
  {
    name: "Acide laurique (C12)",
    formula: "C12H24O2",
    type: "Long",
    pourcentage: "0.01% Burley / 0.01% Virginia / 0.03% Cigare",
    aromeCombustion: "Neutre",
    compatibilites: "CBD résineux, miel",
    color: "bg-gray-100 dark:bg-gray-800"
  },
  {
    name: "Acide palmitique (C16)",
    formula: "C16H32O2",
    type: "Saturé",
    pourcentage: "0.2% Burley / 0.3% Virginia / 0.4% Cigare",
    aromeCombustion: "Légèrement cireux",
    compatibilites: "Tous profils",
    color: "bg-slate-100 dark:bg-slate-800"
  },
  {
    name: "Acide oléique (C18:1)",
    formula: "C18H34O2",
    type: "Monoinsaturé",
    pourcentage: "0.3% Burley / 0.25% Virginia / 0.35% Cigare",
    aromeCombustion: "Formation lactones",
    compatibilites: "Agrumes, miel",
    color: "bg-lime-100 dark:bg-lime-900"
  },
  {
    name: "Acide linoléique (C18:2)",
    formula: "C18H34O2",
    type: "Polyinsaturé",
    pourcentage: "0.4% Burley / 0.35% Virginia / 0.5% Cigare",
    aromeCombustion: "Boisé fumé",
    compatibilites: "Tabac blond, résine",
    color: "bg-emerald-100 dark:bg-emerald-900"
  }
];

// Applications CBD
const applicationsCBD = [
  {
    nom: "Profil Cheese Cannabis",
    composition: "0.5% C6 + 0.3% C8 + 0.1% C10 + 0.2% 2-heptanone",
    dosageTotal: "1.1%",
    description: "Profil cheese authentique inspiré des variétés cannabis classiques"
  },
  {
    nom: "Profil Cheese Cigare",
    composition: "0.4% C8 + 0.2% C9 + 0.1% indole",
    dosageTotal: "0.7%",
    description: "Fusion entre profil cheese et notes tabac cigare"
  },
  {
    nom: "Profil Cheese Lacté",
    composition: "0.3% C7 + 0.3% C10 + 0.2% γ-decalactone",
    dosageTotal: "0.8%",
    description: "Profil cheese doux et crémeux avec notes lactées"
  }
];

export default function ChimieTabac() {
  const [openSection, setOpenSection] = useState<string | null>("esters");

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">Accueil</Link>
        <span>/</span>
        <Link href="/recherche-scientifique" className="hover:text-foreground">Recherche</Link>
        <span>/</span>
        <span className="text-foreground">Chimie du Tabac</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900">
            <Flame className="h-8 w-8 text-amber-600 dark:text-amber-300" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chimie du Tabac</h1>
            <p className="text-muted-foreground">
              Esters aromatiques et acides gras pour la formulation CBD
            </p>
          </div>
        </div>
        
        <p className="text-muted-foreground max-w-3xl">
          Cette page documente les composés chimiques clés du tabac utilisés dans la formulation 
          de résines CBD. Les esters apportent les notes fruitées et florales, tandis que les 
          acides gras contribuent au profil "cheese" caractéristique.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Beaker className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{estersTabac.length}</p>
                <p className="text-sm text-muted-foreground">Esters</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Droplets className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{acidesGras.length}</p>
                <p className="text-sm text-muted-foreground">Acides gras</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Leaf className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{applicationsCBD.length}</p>
                <p className="text-sm text-muted-foreground">Profils CBD</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Thermometer className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Types tabac</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="esters" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="esters">Esters Aromatiques</TabsTrigger>
          <TabsTrigger value="acides">Acides Gras</TabsTrigger>
          <TabsTrigger value="applications">Applications CBD</TabsTrigger>
        </TabsList>

        {/* Esters Tab */}
        <TabsContent value="esters" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                Esters Aromatiques du Tabac
              </CardTitle>
              <CardDescription>
                13 esters clés pour la formulation de profils tabac et CBD
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {estersTabac.map((ester) => (
                  <Card key={ester.name} className={`${ester.color} border-0`}>
                    <CardContent className="pt-4">
                      <h4 className="font-semibold mb-1">{ester.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{ester.formula}</p>
                      <Badge variant="outline" className="mb-2">{ester.family}</Badge>
                      <div className="space-y-1 text-sm">
                        <p><strong>Arôme :</strong> {ester.arome}</p>
                        <p><strong>Combustion :</strong> {ester.effetCombustion}</p>
                        <p><strong>Application :</strong> {ester.application}</p>
                        <p><strong>Dosage :</strong> {ester.dosage}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Acides Gras Tab */}
        <TabsContent value="acides" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Acides Gras Aromatiques
              </CardTitle>
              <CardDescription>
                7 acides gras contribuant au profil "cheese" et aux notes de combustion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Acide</th>
                      <th className="text-left py-3 px-2">Type</th>
                      <th className="text-left py-3 px-2">% par type de tabac</th>
                      <th className="text-left py-3 px-2">Arôme combustion</th>
                      <th className="text-left py-3 px-2">Compatibilités</th>
                    </tr>
                  </thead>
                  <tbody>
                    {acidesGras.map((acide) => (
                      <tr key={acide.name} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-medium">{acide.name}</p>
                            <p className="text-xs text-muted-foreground">{acide.formula}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <Badge variant="outline">{acide.type}</Badge>
                        </td>
                        <td className="py-3 px-2 text-xs">{acide.pourcentage}</td>
                        <td className="py-3 px-2">{acide.aromeCombustion}</td>
                        <td className="py-3 px-2">{acide.compatibilites}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Info box */}
          <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-2">Note sur les types de tabac</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Burley :</strong> Tabac séché à l'air, notes de noisette et cacao.<br />
                    <strong>Virginia :</strong> Tabac séché au feu, notes sucrées et légères.<br />
                    <strong>Cigare :</strong> Tabac fermenté, notes riches et complexes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Applications CBD Tab */}
        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                Applications CBD
              </CardTitle>
              <CardDescription>
                Profils de formulation utilisant les acides gras pour créer des notes "cheese"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {applicationsCBD.map((app) => (
                  <Card key={app.nom}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{app.nom}</CardTitle>
                      <Badge variant="secondary">{app.dosageTotal} total</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{app.description}</p>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs font-mono">{app.composition}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Méthode d'intégration */}
          <Card>
            <CardHeader>
              <CardTitle>Méthode d'Intégration</CardTitle>
              <CardDescription>
                Protocole standard pour intégrer les acides gras dans une résine CBD
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</span>
                  <span><strong>Base :</strong> Résine/crumble neutre (30-50% CBD)</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
                  <span><strong>Mélanger :</strong> Acides gras selon le profil choisi</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</span>
                  <span><strong>Diluer :</strong> Dans huile MCT (ratio 1-2% pour 100g résine)</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">4</span>
                  <span><strong>Chauffer :</strong> 40-45°C, agitation douce pendant 15 min</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">5</span>
                  <span><strong>Maturer :</strong> 48-72h sous vide léger</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">6</span>
                  <span><strong>Cure :</strong> 7 jours à 16-18°C</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Liens connexes */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Ressources connexes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/molecules">
              <Button variant="outline" className="btn-enhanced">
                <FlaskConical className="h-4 w-4 mr-2" />
                Toutes les molécules
              </Button>
            </Link>
            <Link href="/resines-cbd">
              <Button variant="outline" className="btn-enhanced">
                <Leaf className="h-4 w-4 mr-2" />
                Résines CBD
              </Button>
            </Link>
            <Link href="/fournisseurs">
              <Button variant="outline" className="btn-enhanced">
                <Beaker className="h-4 w-4 mr-2" />
                Fournisseurs
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
