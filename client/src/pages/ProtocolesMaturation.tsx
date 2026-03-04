// @ts-nocheck
import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { VoirAussi } from "@/components/VoirAussi";
import { 
  Clock, 
  Thermometer, 
  Droplets,
  Sun,
  Wind,
  AlertTriangle,
  CheckCircle2,
  Info,
  Beaker
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Protocoles par type de résine
const protocolesParType = [
  {
    type: "Résine CBD Standard",
    dureeMin: 7,
    dureeMax: 14,
    temperature: "16-20°C",
    humidite: "45-55%",
    lumiere: "Obscurité totale",
    etapes: [
      { jour: "J0", action: "Mélange initial des composants", details: "Homogénéiser à 40-45°C pendant 15 min" },
      { jour: "J1-J3", action: "Phase de fusion", details: "Repos à température ambiante, agitation douce quotidienne" },
      { jour: "J4-J7", action: "Phase de stabilisation", details: "Stockage à 18°C, vérification de la texture" },
      { jour: "J8-J14", action: "Maturation finale", details: "Cure à 16-18°C, développement des arômes" }
    ],
    indicateurs: ["Texture homogène", "Absence de séparation", "Arôme développé"],
    color: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
  },
  {
    type: "Résine CBD Terpénique",
    dureeMin: 10,
    dureeMax: 21,
    temperature: "14-18°C",
    humidite: "40-50%",
    lumiere: "Obscurité totale",
    etapes: [
      { jour: "J0", action: "Incorporation des terpènes", details: "Ajouter les terpènes à 35-40°C max pour préserver les volatils" },
      { jour: "J1-J5", action: "Phase d'intégration", details: "Les terpènes se lient à la matrice CBD" },
      { jour: "J6-J10", action: "Phase de développement", details: "Les notes de tête s'équilibrent avec le fond" },
      { jour: "J11-J21", action: "Maturation longue", details: "Développement complet du profil olfactif" }
    ],
    indicateurs: ["Profil olfactif équilibré", "Notes de tête présentes", "Sillage cohérent"],
    color: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
  },
  {
    type: "Résine CBD Cheese/Animal",
    dureeMin: 14,
    dureeMax: 28,
    temperature: "12-16°C",
    humidite: "50-60%",
    lumiere: "Obscurité totale",
    etapes: [
      { jour: "J0", action: "Incorporation des acides gras", details: "Mélanger les acides C6-C10 à 40°C" },
      { jour: "J1-J7", action: "Phase de fermentation contrôlée", details: "Développement des notes cheese" },
      { jour: "J8-J14", action: "Phase d'animalisation", details: "Les notes animales se développent" },
      { jour: "J15-J28", action: "Maturation profonde", details: "Équilibrage final, atténuation des pics" }
    ],
    indicateurs: ["Notes cheese développées", "Animalité contrôlée", "Absence de notes fécales"],
    color: "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800"
  },
  {
    type: "Résine CBD Indole/Skatole",
    dureeMin: 10,
    dureeMax: 21,
    temperature: "16-20°C",
    humidite: "45-55%",
    lumiere: "Obscurité totale",
    etapes: [
      { jour: "J0", action: "Dilution préalable", details: "Diluer indole/skatole dans éthanol (1:1000) avant incorporation" },
      { jour: "J1-J5", action: "Phase d'intégration", details: "Les molécules se dispersent uniformément" },
      { jour: "J6-J10", action: "Phase d'équilibrage", details: "L'animalité s'adoucit et s'intègre" },
      { jour: "J11-J21", action: "Maturation finale", details: "Développement de la naturalité florale" }
    ],
    indicateurs: ["Animalité subtile", "Naturalité florale", "Absence de notes naphtaliniques"],
    color: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800"
  },
  {
    type: "Profils d'Exception (Signatures)",
    dureeMin: 14,
    dureeMax: 28,
    temperature: "14-18°C",
    humidite: "45-55%",
    lumiere: "Obscurité totale",
    etapes: [
      { jour: "J0", action: "Assemblage complexe", details: "Incorporer les composants par ordre de volatilité décroissante" },
      { jour: "J1-J7", action: "Phase de fusion", details: "Les accords se forment et s'harmonisent" },
      { jour: "J8-J14", action: "Phase de développement", details: "Les transitions olfactives se créent" },
      { jour: "J15-J28", action: "Maturation d'excellence", details: "Affinage final, équilibrage des proportions" }
    ],
    indicateurs: ["Transitions fluides", "Sillage remarquable", "Signature unique"],
    color: "bg-violet-50 dark:bg-violet-950 border-violet-200 dark:border-violet-800"
  }
];

// Conditions optimales
const conditionsOptimales = {
  temperature: {
    titre: "Température",
    icone: <Thermometer className="h-6 w-6" />,
    optimal: "14-20°C",
    details: [
      { condition: "< 12°C", effet: "Cristallisation possible, ralentissement excessif", status: "warning" },
      { condition: "14-18°C", effet: "Maturation optimale, développement aromatique idéal", status: "success" },
      { condition: "18-22°C", effet: "Maturation accélérée, acceptable pour résines standard", status: "info" },
      { condition: "> 25°C", effet: "Dégradation des terpènes, perte de volatils", status: "danger" }
    ]
  },
  humidite: {
    titre: "Humidité",
    icone: <Droplets className="h-6 w-6" />,
    optimal: "45-55%",
    details: [
      { condition: "< 40%", effet: "Dessèchement de la surface, texture cassante", status: "warning" },
      { condition: "45-55%", effet: "Équilibre parfait, texture souple", status: "success" },
      { condition: "55-65%", effet: "Acceptable pour profils cheese", status: "info" },
      { condition: "> 70%", effet: "Risque de moisissure, dégradation", status: "danger" }
    ]
  },
  lumiere: {
    titre: "Lumière",
    icone: <Sun className="h-6 w-6" />,
    optimal: "Obscurité totale",
    details: [
      { condition: "Obscurité totale", effet: "Conservation optimale des terpènes", status: "success" },
      { condition: "Lumière indirecte faible", effet: "Acceptable pour courte durée", status: "info" },
      { condition: "Lumière directe", effet: "Dégradation rapide, oxydation", status: "danger" },
      { condition: "UV", effet: "Destruction des cannabinoïdes et terpènes", status: "danger" }
    ]
  },
  ventilation: {
    titre: "Ventilation",
    icone: <Wind className="h-6 w-6" />,
    optimal: "Conteneur hermétique",
    details: [
      { condition: "Hermétique", effet: "Conservation des volatils, maturation contrôlée", status: "success" },
      { condition: "Semi-hermétique", effet: "Perte légère de terpènes, acceptable", status: "info" },
      { condition: "Ouvert", effet: "Perte rapide des notes de tête", status: "warning" },
      { condition: "Ventilé", effet: "Évaporation massive, profil altéré", status: "danger" }
    ]
  }
};

// Erreurs courantes
const erreursCourantes = [
  {
    erreur: "Température trop élevée lors du mélange",
    consequence: "Perte des terpènes volatils (notes de tête)",
    solution: "Ne jamais dépasser 45°C, idéalement 35-40°C pour les terpènes"
  },
  {
    erreur: "Maturation trop courte",
    consequence: "Profil olfactif déséquilibré, notes agressives",
    solution: "Respecter les durées minimales, tester avant de finaliser"
  },
  {
    erreur: "Exposition à la lumière",
    consequence: "Oxydation, dégradation des cannabinoïdes",
    solution: "Stocker dans des contenants opaques ou à l'abri de la lumière"
  },
  {
    erreur: "Surdosage d'indole/skatole",
    consequence: "Notes fécales ou naphtaliniques dominantes",
    solution: "Toujours diluer (1:1000) et doser en dessous de 0.05%"
  },
  {
    erreur: "Mélange incomplet",
    consequence: "Séparation des phases, texture hétérogène",
    solution: "Agiter doucement mais régulièrement pendant la phase de fusion"
  }
];

export default function ProtocolesMaturation() {
  return (
    <div className="container py-8">
      <Breadcrumbs />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900">
            <Clock className="h-8 w-8 text-emerald-600 dark:text-emerald-300" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Protocoles de Maturation</h1>
            <p className="text-muted-foreground">
              Temps de cure, conditions optimales et étapes de maturation
            </p>
          </div>
        </div>
        <p className="text-muted-foreground max-w-3xl">
          La maturation est une étape cruciale dans la formulation de résines CBD. Elle permet aux 
          composants de s'intégrer, aux arômes de se développer et à la texture de se stabiliser. 
          Chaque type de résine nécessite un protocole adapté.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="protocoles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="protocoles">Protocoles par Type</TabsTrigger>
          <TabsTrigger value="conditions">Conditions Optimales</TabsTrigger>
          <TabsTrigger value="erreurs">Erreurs à Éviter</TabsTrigger>
        </TabsList>

        {/* Protocoles par type */}
        <TabsContent value="protocoles" className="space-y-6">
          {protocolesParType.map((protocole) => (
            <Card key={protocole.type} className={`border-2 ${protocole.color}`}>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">{protocole.type}</CardTitle>
                    <CardDescription className="mt-1">
                      Durée : {protocole.dureeMin}-{protocole.dureeMax} jours
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Thermometer className="h-3 w-3" />
                      {protocole.temperature}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Droplets className="h-3 w-3" />
                      {protocole.humidite}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Sun className="h-3 w-3" />
                      {protocole.lumiere}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Étapes */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Étapes de maturation
                  </h4>
                  <div className="space-y-2">
                    {protocole.etapes.map((etape, index) => (
                      <div key={index} className="flex gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20">
                        <Badge variant="secondary" className="h-fit">{etape.jour}</Badge>
                        <div>
                          <p className="font-medium">{etape.action}</p>
                          <p className="text-sm text-muted-foreground">{etape.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Indicateurs de réussite */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Indicateurs de réussite
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {protocole.indicateurs.map((indicateur) => (
                      <Badge key={indicateur} variant="default" className="bg-green-600">
                        {indicateur}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Conditions optimales */}
        <TabsContent value="conditions" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {Object.values(conditionsOptimales).map((condition) => (
              <Card key={condition.titre}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {condition.icone}
                    {condition.titre}
                  </CardTitle>
                  <CardDescription>
                    Optimal : <strong>{condition.optimal}</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {condition.details.map((detail, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg border ${
                          detail.status === 'success' ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' :
                          detail.status === 'info' ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800' :
                          detail.status === 'warning' ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800' :
                          'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">{detail.condition}</Badge>
                          {detail.status === 'success' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                          {detail.status === 'danger' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                        </div>
                        <p className="text-sm">{detail.effet}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Erreurs à éviter */}
        <TabsContent value="erreurs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Erreurs Courantes à Éviter
              </CardTitle>
              <CardDescription>
                Les pièges les plus fréquents lors de la maturation des résines CBD
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {erreursCourantes.map((erreur, index) => (
                  <div key={index} className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
                    <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">
                      ❌ {erreur.erreur}
                    </h4>
                    <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                      <strong>Conséquence :</strong> {erreur.consequence}
                    </p>
                    <div className="p-2 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        <strong>✓ Solution :</strong> {erreur.solution}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Conseil général */}
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-2">Conseil général</h4>
                  <p className="text-sm text-muted-foreground">
                    La patience est la clé d'une maturation réussie. Il vaut mieux attendre quelques jours 
                    de plus que de précipiter le processus. Testez régulièrement le profil olfactif et 
                    notez vos observations pour affiner vos protocoles au fil du temps.
                  </p>
                </div>
              </div>
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
            <Link href="/resines-cbd" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <Beaker className="h-4 w-4" />
                Résines CBD
              </Link>
            <Link href="/recettes" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors">
                Toutes les recettes
              </Link>
            <Link href="/gammes/signatures" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors">
                Gamme Signatures
              </Link>
          </div>
        </CardContent>
      </Card>

      {/* Voir aussi */}
      <VoirAussi 
        title="Ressources connexes"
        variant="compact"
        items={[
          {
            title: "Chimie du tabac",
            description: "Esters aromatiques et acides gras",
            href: "/chimie-tabac",
          },
          {
            title: "Synergies terpènes-niches",
            description: "Combinaisons terpéniques avancées",
            href: "/synergies-terpenes-niches",
          },
          {
            title: "Fournisseurs",
            description: "12 fournisseurs référencés",
            href: "/fournisseurs",
            badge: "12",
          },
          {
            title: "Gammes olfactives",
            description: "Les 5 gammes du projet",
            href: "/gammes",
            badge: "5",
          },
        ]}
      />
    </div>
  );
}
