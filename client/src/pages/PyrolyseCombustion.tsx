// @ts-nocheck
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Flame, Thermometer, AlertTriangle, TrendingUp, Beaker } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Données de pyrolyse par tabac
const PYROLYSIS_DATA = [
  {
    tabac: "Burley",
    temperatureRange: "120-180°C",
    mainProducts: ["Pyrazines", "Furfural", "Acétaldéhyde", "Diacétyle"],
    profile: "Chocolat, fumé, grillé, caramel brûlé",
    notes: "Formation intensive de pyrazines à partir de 130°C. Profil gourmand dominant.",
    color: "bg-amber-100 border-amber-300",
    textColor: "text-amber-900",
  },
  {
    tabac: "Virginia Gold",
    temperatureRange: "90-150°C",
    mainProducts: ["Lactones", "Vanilline", "Maltol", "Furaneol"],
    profile: "Miel, caramel, vanille, coco",
    notes: "Pyrolyse douce favorisant les lactones. Profil lacté stable jusqu'à 140°C.",
    color: "bg-yellow-100 border-yellow-300",
    textColor: "text-yellow-900",
  },
  {
    tabac: "Samsoun",
    temperatureRange: "110-160°C",
    mainProducts: ["Caryophyllène", "Cédrol", "Guaiacol", "Phénols"],
    profile: "Résine, encens, baume, fumée balsamique",
    notes: "Transformation des sesquiterpènes en composés balsamiques. Notes métalliques à haute température.",
    color: "bg-purple-100 border-purple-300",
    textColor: "text-purple-900",
  },
  {
    tabac: "Krumovgrad",
    temperatureRange: "95-145°C",
    mainProducts: ["Ionones", "Damascénone", "Lactones", "Esters"],
    profile: "Floral (violet, iris), miel, fruité",
    notes: "Profil floral-lacté complexe. Ionones stables jusqu'à 130°C.",
    color: "bg-pink-100 border-pink-300",
    textColor: "text-pink-900",
  },
  {
    tabac: "Virginia Bright",
    temperatureRange: "80-140°C",
    mainProducts: ["Aldéhydes", "Lactones", "Esters légers"],
    profile: "Foin coupé, miel doux, herbacé lumineux",
    notes: "Pyrolyse à basse température. Profil délicat et lumineux.",
    color: "bg-green-100 border-green-300",
    textColor: "text-green-900",
  },
  {
    tabac: "Virginia Deutscher",
    temperatureRange: "85-135°C",
    mainProducts: ["Terpènes", "Pinène", "Cédrol", "Aldéhydes verts"],
    profile: "Vert, pin, boisé sec, résine légère",
    notes: "Conservation des terpènes verts. Profil sec et aéré.",
    color: "bg-emerald-100 border-emerald-300",
    textColor: "text-emerald-900",
  },
  {
    tabac: "Virginia Italia",
    temperatureRange: "85-145°C",
    mainProducts: ["Aldéhydes", "Lactones", "Esters floraux"],
    profile: "Herbacé méditerranéen, floral, foin chaud",
    notes: "Caractère solaire persistant. Notes herbacées aromatiques.",
    color: "bg-lime-100 border-lime-300",
    textColor: "text-lime-900",
  },
  {
    tabac: "Virginia Orange",
    temperatureRange: "80-130°C",
    mainProducts: ["Esters", "Limonène", "Lactones", "Aldéhydes fruités"],
    profile: "Agrumes (orange, citron), miel, pêche",
    notes: "Profil hespéridé vibrant. Esters sensibles à la chaleur.",
    color: "bg-orange-100 border-orange-300",
    textColor: "text-orange-900",
  },
];

// Protocoles d'analyse
const ANALYSIS_PROTOCOLS = [
  {
    title: "Protocole 1 : Analyse GC-MS Pyrolyse",
    steps: [
      "Préparation échantillon : 50mg de tabac séché",
      "Pyrolyse flash : 120-180°C, 30 secondes",
      "Injection GC : Split 1:50, colonne HP-5MS",
      "Détection MS : Scan 40-400 m/z",
      "Identification : Comparaison bibliothèque NIST",
    ],
    duration: "45 minutes",
    equipment: "GC-MS Agilent 7890B/5977A",
  },
  {
    title: "Protocole 2 : Courbes de Volatilité",
    steps: [
      "Rampe de température : 80-200°C, 5°C/min",
      "Mesure continue des composés volatils",
      "Enregistrement profil olfactif par palier de 10°C",
      "Analyse des seuils de transformation",
      "Cartographie des zones optimales",
    ],
    duration: "2 heures",
    equipment: "TGA-FTIR couplé",
  },
  {
    title: "Protocole 3 : Analyse Sensorielle Pyrolyse",
    steps: [
      "Panel de 5 évaluateurs formés",
      "Pyrolyse contrôlée à 3 températures (100°C, 130°C, 160°C)",
      "Évaluation notes olfactives (intensité, qualité, persistance)",
      "Identification familles moléculaires dominantes",
      "Corrélation données sensorielles / analytiques",
    ],
    duration: "3 heures",
    equipment: "Dispositif pyrolyse contrôlée + flacons olfactifs",
  },
];

export function PyrolyseCombustion() {
  return (
    <div className="min-h-screen bg-background">
      <Breadcrumbs />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 border-b border-border/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
              <Flame className="w-4 h-4 mr-2" />
              Analyse Thermique
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              Pyrolyse & Combustion
            </h1>
            
            <p className="text-lg text-muted-foreground">
              Analyse des produits de pyrolyse et de combustion des tabacs
            </p>
          </div>
        </div>
      </section>
      
      <div className="container py-8 space-y-8">

        {/* Introduction Card */}
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="font-bold text-red-900">Contexte Scientifique</h3>
                <p className="text-sm text-red-800 leading-relaxed">
                  La pyrolyse est la décomposition thermique de matière organique en absence d'oxygène, 
                  produisant des composés volatils aromatiques. Ce processus transforme les terpènes et cannabinoïdes 
                  en nouvelles molécules olfactives, créant les profils caractéristiques de chaque tabac. 
                  La compréhension de ces transformations est essentielle pour maîtriser les compositions olfactives 
                  et optimiser les températures de travail.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Navigation */}
        <Tabs defaultValue="profiles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profiles" className="flex items-center gap-2">
              <Flame className="h-4 w-4" />
              Profils de Pyrolyse
            </TabsTrigger>
            <TabsTrigger value="curves" className="flex items-center gap-2">
              <Thermometer className="h-4 w-4" />
              Courbes de Température
            </TabsTrigger>
            <TabsTrigger value="protocols" className="flex items-center gap-2">
              <Beaker className="h-4 w-4" />
              Protocoles d'Analyse
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Profils de Pyrolyse */}
          <TabsContent value="profiles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="h-5 w-5 text-red-600" />
                  Profils de Pyrolyse par Tabac
                </CardTitle>
                <CardDescription>
                  Produits de pyrolyse caractéristiques et plages de température optimales pour les 8 variétés
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              {PYROLYSIS_DATA.map((data, index) => (
                <Card key={index} className={`border-2 ${data.color}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <CardTitle className={`text-xl ${data.textColor}`}>
                            {data.tabac}
                          </CardTitle>
                          <Badge variant="outline" className="bg-white">
                            <Thermometer className="h-3 w-3 mr-1" />
                            {data.temperatureRange}
                          </Badge>
                        </div>
                        <CardDescription className={`${data.textColor} font-medium`}>
                          {data.profile}
                        </CardDescription>
                      </div>
                      <Flame className={`h-6 w-6 ${data.textColor} flex-shrink-0`} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">
                        Produits principaux :
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {data.mainProducts.map((product, i) => (
                          <Badge key={i} variant="secondary" className="bg-white/80">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        Notes techniques :
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {data.notes}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab 2: Courbes de Température */}
          <TabsContent value="curves" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-red-600" />
                  Courbes de Volatilité en Fonction de la Température
                </CardTitle>
                <CardDescription>
                  Profils de transformation thermique et zones optimales de travail
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Zones de Température Critiques</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-blue-50 border-2 border-blue-200">
                      <CardHeader>
                        <CardTitle className="text-lg text-blue-900">
                          Zone Basse (80-110°C)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm text-blue-800">
                          <strong>Composés :</strong> Aldéhydes, esters légers, terpènes volatils
                        </p>
                        <p className="text-sm text-blue-800">
                          <strong>Profil :</strong> Frais, herbacé, fruité, lumineux
                        </p>
                        <p className="text-sm text-blue-800">
                          <strong>Tabacs :</strong> Virginia Bright, Orange, Deutscher
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-amber-50 border-2 border-amber-200">
                      <CardHeader>
                        <CardTitle className="text-lg text-amber-900">
                          Zone Moyenne (110-140°C)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm text-amber-800">
                          <strong>Composés :</strong> Lactones, pyrazines, ionones
                        </p>
                        <p className="text-sm text-amber-800">
                          <strong>Profil :</strong> Gourmand, floral, lacté, caramel
                        </p>
                        <p className="text-sm text-amber-800">
                          <strong>Tabacs :</strong> Virginia Gold, Krumovgrad, Italia
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-red-50 border-2 border-red-200">
                      <CardHeader>
                        <CardTitle className="text-lg text-red-900">
                          Zone Haute (140-180°C)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm text-red-800">
                          <strong>Composés :</strong> Pyrazines, guaiacol, phénols
                        </p>
                        <p className="text-sm text-red-800">
                          <strong>Profil :</strong> Fumé, grillé, résineux, intense
                        </p>
                        <p className="text-sm text-red-800">
                          <strong>Tabacs :</strong> Burley, Samsoun
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-slate-50 border-2 border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Recommandations Pratiques</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">✓ Compositions florales et lactées</p>
                        <p className="text-sm text-muted-foreground ml-4">
                          Travailler entre 90-130°C pour préserver ionones et lactones. Éviter dépassement 140°C.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">✓ Compositions gourmandes et fumées</p>
                        <p className="text-sm text-muted-foreground ml-4">
                          Plage 120-150°C optimale pour développer pyrazines et notes grillées sans brûler.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">✓ Compositions fraîches et hespéridées</p>
                        <p className="text-sm text-muted-foreground ml-4">
                          Ne pas dépasser 110°C pour conserver esters et aldéhydes légers.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Protocoles d'Analyse */}
          <TabsContent value="protocols" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="h-5 w-5 text-red-600" />
                  Protocoles d'Analyse Standardisés
                </CardTitle>
                <CardDescription>
                  Méthodes analytiques pour l'étude de la pyrolyse et la caractérisation des produits
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              {ANALYSIS_PROTOCOLS.map((protocol, index) => (
                <Card key={index} className="border-2">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <CardTitle className="text-lg">{protocol.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Thermometer className="h-4 w-4" />
                            {protocol.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Beaker className="h-4 w-4" />
                            {protocol.equipment}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        SOP {index + 1}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Étapes du protocole :</p>
                      <ol className="space-y-2 ml-4">
                        {protocol.steps.map((step, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">{i + 1}.</span> {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-amber-50 border-2 border-amber-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div className="space-y-2">
                    <h3 className="font-bold text-amber-900">Précautions de Sécurité</h3>
                    <ul className="text-sm text-amber-800 leading-relaxed space-y-1 ml-4">
                      <li>• Travailler sous hotte aspirante pour analyses pyrolyse</li>
                      <li>• Port obligatoire d'EPI (gants, lunettes, blouse)</li>
                      <li>• Contrôle strict des températures pour éviter combustion</li>
                      <li>• Ventilation adéquate des espaces d'analyse sensorielle</li>
                      <li>• Calibration régulière des équipements (GC-MS, TGA)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Info */}
        <Card className="bg-slate-50 border-2 border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Flame className="h-6 w-6 text-slate-600 flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900">Références Scientifiques</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Les données de pyrolyse sont basées sur des analyses GC-MS réalisées sur les 8 variétés de tabacs 
                  du projet PERFUMUM. Les protocoles suivent les standards ISO 3308 (atmosphère de fumage) et 
                  CORESTA (analyse des composés volatils). Les profils olfactifs ont été validés par panel sensoriel 
                  formé selon la norme ISO 5496.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
