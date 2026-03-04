// @ts-nocheck
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowRight, 
  Zap, 
  Beaker, 
  BookOpen, 
  Microscope,
  Atom,
  Lightbulb
} from "lucide-react";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";

interface ExperimentCard {
  id: string;
  name: string;
  status: "Théorique" | "En cours" | "Validé";
  molecule: string;
  incorporation: number;
  cost: string;
  description: string;
}

const experiments: ExperimentCard[] = [
  {
    id: "exp-001",
    name: "Deutération Allylique du Myrcène",
    status: "En cours",
    molecule: "Myrcène-d8",
    incorporation: 78,
    cost: "€450",
    description: "Échange H/D sur les positions allyliques du myrcène pour tester la modification de la signature vibratoire."
  },
  {
    id: "exp-002",
    name: "Limonène Deutéré - Accord Quantique",
    status: "Théorique",
    molecule: "Limonène-d8",
    incorporation: 0,
    cost: "€380",
    description: "Création d'un accord quantique utilisant le limonène deutéré pour simuler des notes rares."
  },
  {
    id: "exp-003",
    name: "Isomères Vibratoires du Pinène",
    status: "Validé",
    molecule: "α-Pinène deutéré",
    incorporation: 85,
    cost: "€520",
    description: "Validation de la théorie vibratoire via deutération du pinène avec analyse GC-MS."
  }
];

interface ProtocolStep {
  step: number;
  title: string;
  description: string;
  details: string[];
}

const protocolSteps: ProtocolStep[] = [
  {
    step: 1,
    title: "Activation du Catalyseur",
    description: "Préparation du catalyseur Pt/C pour l'échange H/D",
    details: [
      "Charger le catalyseur Pt/C (5-10%) dans le réacteur en verre borosilicaté",
      "Purger à l'azote pour éliminer l'oxygène",
      "Introduire une légère pression d'hydrogène (H₂) pour activer les sites de surface",
      "Maintenir la température ambiante pendant 30 minutes"
    ]
  },
  {
    step: 2,
    title: "Chargement des Réactifs",
    description: "Préparation du mélange réactionnel",
    details: [
      "Ajouter le terpène cible (ex: α-pinène, pureté >98%)",
      "Ajouter l'eau deutérée (D₂O, 99.9% atome D)",
      "Ratio molaire recommandé : 1 terpène : 10 D₂O minimum",
      "Bien mélanger pour homogénéiser la solution"
    ]
  },
  {
    step: 3,
    title: "Réaction d'Échange H/D",
    description: "Conditions optimales pour l'échange isotopique",
    details: [
      "Chauffer à 80-100 °C sous agitation vigoureuse",
      "Durée : 24 à 48 heures selon le terpène",
      "L'échange se produit préférentiellement sur les positions allyliques et vinyliques",
      "Monitorer la pression interne (max 5 bar)"
    ]
  },
  {
    step: 4,
    title: "Extraction et Séparation",
    description: "Récupération du produit deutéré",
    details: [
      "Laisser refroidir à température ambiante",
      "Séparer la phase organique par décantation",
      "Sécher sur sulfate de magnésium (MgSO₄) anhydre",
      "Filtrer et concentrer sous vide si nécessaire"
    ]
  },
  {
    step: 5,
    title: "Analyse GC-MS",
    description: "Vérification du taux d'incorporation",
    details: [
      "Analyser par chromatographie gazeuse couplée à la spectrométrie de masse",
      "Rechercher les décalages de masse (M+1, M+2, etc.)",
      "Calculer le taux d'incorporation en deutérium",
      "Comparer avec le standard non-deutéré"
    ]
  }
];

interface ResearchAxis {
  title: string;
  concept: string;
  implications: string[];
}

const researchAxes: ResearchAxis[] = [
  {
    title: "Théorie Vibratoire de Luca Turin",
    concept: "L'odorat détecterait les fréquences de vibration infrarouge des liaisons moléculaires via effet tunnel électronique quantique, en plus de la reconnaissance de forme.",
    implications: [
      "Deux molécules de même forme mais d'isotopes différents auraient des odeurs distinctes",
      "La signature vibratoire peut être manipulée indépendamment de la structure chimique",
      "Les isomères vibratoires ouvrent des possibilités infinies de création olfactive"
    ]
  },
  {
    title: "Ingénierie Isotopique",
    concept: "Substitution stratégique d'atomes d'hydrogène par du deutérium pour modifier la fréquence vibratoire sans changer la forme moléculaire.",
    implications: [
      "Création d'isomères vibratoires avec propriétés olfactives inédites",
      "Simulation de molécules rares ou inexistantes dans la nature",
      "Accords quantiques impossibles à obtenir par chimie classique"
    ]
  },
  {
    title: "Accords Quantiques",
    concept: "Formulations utilisant des terpènes deutérés pour créer des profils olfactifs impossibles à reproduire avec des molécules non-modifiées.",
    implications: [
      "Nouvelles dimensions sensorielles jamais explorées",
      "Possibilité de 'fixer' des notes volatiles en modifiant leur signature vibratoire",
      "Création d'une nouvelle catégorie de parfums : les 'Quantiques'"
    ]
  }
];

interface Supplier {
  name: string;
  specialty: string;
  products: string[];
  url: string;
}

const suppliers: Supplier[] = [
  {
    name: "C/D/N Isotopes",
    specialty: "Isotopes & Standards",
    products: ["Terpènes deutérés", "D₂O (99.9% atome D)", "Standards de référence"],
    url: "https://www.cdnisotopes.com/"
  },
  {
    name: "Sigma-Aldrich",
    specialty: "Réactifs & Catalyseurs",
    products: ["D₂O", "Catalyseurs Pt/C", "Terpènes purs (>98%)"],
    url: "https://www.sigmaaldrich.com/"
  },
  {
    name: "Isotope.com",
    specialty: "Isotopes Spécialisés",
    products: ["Terpènes isotopiquement marqués", "Deutérium liquide", "Eau deutérée"],
    url: "https://isotope.com/"
  }
];

export function AbsorbeXQuantique() {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <DynamicBreadcrumb />
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b bg-gradient-to-r from-background via-purple-50/50 to-background dark:via-purple-950/20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h1 className="text-4xl font-bold">Olfaction Quantique</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-4">
              Ingénierie Isotopique & Accords Vibratoires
            </p>
            <p className="text-lg text-foreground/80">
              Explorez la théorie vibratoire de l'olfaction et créez des isomères vibratoires 
              impossibles à obtenir par chimie classique.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <Tabs defaultValue="concepts" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="concepts">Concepts</TabsTrigger>
            <TabsTrigger value="protocole">Protocole</TabsTrigger>
            <TabsTrigger value="experiences">Expériences</TabsTrigger>
            <TabsTrigger value="fournisseurs">Fournisseurs</TabsTrigger>
          </TabsList>

          {/* CONCEPTS TAB */}
          <TabsContent value="concepts" className="space-y-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Fondements Théoriques</h2>

              {/* Théorie Vibratoire */}
              <Card className="p-8 mb-8 border-l-4 border-l-purple-500">
                <div className="flex items-start gap-4 mb-4">
                  <Atom className="h-8 w-8 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Théorie Vibratoire de Luca Turin</h3>
                    <p className="text-muted-foreground">Paradigme alternatif à la reconnaissance de forme</p>
                  </div>
                </div>
                <div className="space-y-4 text-foreground/80">
                  <p className="leading-relaxed">
                    La théorie dominante de l'olfaction repose sur la reconnaissance de la <strong>forme moléculaire</strong> 
                    (le modèle "clé-serrure"). Cependant, des travaux controversés suggèrent que l'odorat pourrait également 
                    détecter les <strong>fréquences de vibration</strong> des liaisons moléculaires dans l'infrarouge, via un 
                    mécanisme d'<strong>effet tunnel électronique quantique</strong>.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-semibold mb-2">Implications</p>
                    <ul className="space-y-2">
                      {researchAxes[0].implications.map((impl, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-purple-600 font-bold">•</span>
                          <span>{impl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Ingénierie Isotopique */}
              <Card className="p-8 mb-8 border-l-4 border-l-indigo-500">
                <div className="flex items-start gap-4 mb-4">
                  <Lightbulb className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Ingénierie Isotopique</h3>
                    <p className="text-muted-foreground">Manipulation de la signature vibratoire</p>
                  </div>
                </div>
                <div className="space-y-4 text-foreground/80">
                  <p className="leading-relaxed">
                    L'innovation consiste à dépasser la simple composition chimique pour manipuler la 
                    <strong> signature vibratoire</strong> des molécules. En substituant des atomes d'hydrogène 
                    par leur isotope lourd, le <strong>deutérium</strong>, on crée des <strong>isomères vibratoires</strong> 
                    qui possèdent la même forme chimique mais une fréquence de vibration différente.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="font-semibold mb-2">Avantages</p>
                      <ul className="space-y-1 text-sm">
                        <li>✓ Même structure chimique</li>
                        <li>✓ Fréquence vibratoire modifiée</li>
                        <li>✓ Odeur potentiellement différente</li>
                      </ul>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="font-semibold mb-2">Défis</p>
                      <ul className="space-y-1 text-sm">
                        <li>⚠ Coût du deutérium élevé</li>
                        <li>⚠ Synthèse complexe</li>
                        <li>⚠ Validation sensorielle requise</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Accords Quantiques */}
              <Card className="p-8 border-l-4 border-l-violet-500">
                <div className="flex items-start gap-4 mb-4">
                  <Beaker className="h-8 w-8 text-violet-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Accords Quantiques</h3>
                    <p className="text-muted-foreground">Formulations impossibles par chimie classique</p>
                  </div>
                </div>
                <div className="space-y-4 text-foreground/80">
                  <p className="leading-relaxed">
                    Les accords quantiques sont des formulations utilisant des terpènes deutérés pour créer des 
                    profils olfactifs impossibles à reproduire avec des molécules non-modifiées. Cela ouvre des 
                    dimensions sensorielles jamais explorées.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                    <div>
                      <p className="font-semibold mb-1">Exemple : Accord Quantique du Limonène</p>
                      <p className="text-sm">
                        Utiliser le limonène-d8 pour créer une note qui simule une molécule rare ou inexistante, 
                        tout en conservant la structure chimique du limonène.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* PROTOCOLE TAB */}
          <TabsContent value="protocole" className="space-y-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Protocole H/D Exchange</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Échange Hydrogène-Deutérium sur Terpènes Insaturés
              </p>

              {/* Protocol Steps */}
              <div className="space-y-6">
                {protocolSteps.map((step) => (
                  <Card key={step.step} className="p-6 border-l-4 border-l-purple-500">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <span className="font-bold text-purple-600">{step.step}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    <div className="ml-14 space-y-2">
                      {step.details.map((detail, idx) => (
                        <div key={idx} className="flex gap-3 text-foreground/80">
                          <span className="text-purple-600 font-bold">→</span>
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Key Parameters */}
              <Card className="p-8 mt-8 bg-muted/50">
                <h3 className="text-xl font-bold mb-4">Paramètres Clés</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="font-semibold mb-2">Conditions Réactionnelles</p>
                    <ul className="space-y-1 text-sm text-foreground/80">
                      <li><strong>Température :</strong> 80-100 °C</li>
                      <li><strong>Durée :</strong> 24-48 heures</li>
                      <li><strong>Ratio molaire :</strong> 1:10 (terpène:D₂O)</li>
                      <li><strong>Catalyseur :</strong> Pt/C 5-10%</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Matériaux Requis</p>
                    <ul className="space-y-1 text-sm text-foreground/80">
                      <li>Autoclave ou réacteur sous pression</li>
                      <li>Catalyseur Pt/C ou PtO₂</li>
                      <li>Eau deutérée (D₂O, 99.9%)</li>
                      <li>Terpène cible (pureté &gt;98%)</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* EXPERIENCES TAB */}
          <TabsContent value="experiences" className="space-y-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Registre des Expériences</h2>

              <div className="space-y-4">
                {experiments.map((exp) => (
                  <Card key={exp.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold">{exp.name}</h3>
                          <Badge 
                            variant={
                              exp.status === "Validé" ? "default" :
                              exp.status === "En cours" ? "secondary" :
                              "outline"
                            }
                          >
                            {exp.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{exp.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-purple-600">{exp.cost}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Molécule</p>
                        <p className="font-semibold">{exp.molecule}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Incorporation</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full transition-all"
                              style={{ width: `${exp.incorporation}%` }}
                            />
                          </div>
                          <span className="font-semibold text-sm">{exp.incorporation}%</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Button variant="ghost" size="sm" className="gap-2">
                          Détails
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Add New Experiment */}
              <Card className="p-6 border-2 border-dashed border-muted-foreground/50 mt-6">
                <div className="flex items-center gap-3">
                  <Microscope className="h-6 w-6 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-semibold">Proposer une nouvelle expérience</p>
                    <p className="text-sm text-muted-foreground">Contribuez à l'avancement de la recherche quantique</p>
                  </div>
                  <Button>Proposer</Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* FOURNISSEURS TAB */}
          <TabsContent value="fournisseurs" className="space-y-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Annuaire des Fournisseurs Stratégiques</h2>

              <div className="space-y-6">
                {suppliers.map((supplier, idx) => (
                  <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1">{supplier.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{supplier.specialty}</p>
                      </div>
                      <a href={supplier.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-2">
                          Visiter
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-sm font-semibold mb-2">Produits Clés</p>
                      <div className="flex flex-wrap gap-2">
                        {supplier.products.map((product, pidx) => (
                          <Badge key={pidx} variant="secondary">{product}</Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Contact Information */}
              <Card className="p-6 mt-8 bg-muted/50">
                <h3 className="text-lg font-bold mb-4">Besoin d'aide pour sourcer ?</h3>
                <p className="text-foreground/80 mb-4">
                  Consultez notre guide complet de sourcing ou contactez notre équipe pour des recommandations personnalisées.
                </p>
                <div className="flex gap-3">
                  <Link href="/absorbe-x/guide-laboratoire">
                    <Button variant="outline" className="gap-2">
                      <BookOpen className="h-4 w-4" />
                      Guide Complet
                    </Button>
                  </Link>
                  <Button className="gap-2">
                    <Beaker className="h-4 w-4" />
                    Contacter l'Équipe
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Navigation */}
        <div className="flex gap-4 mt-16 justify-center flex-wrap">
          <Link href="/absorbe-x">
            <Button variant="outline">Retour au Dashboard</Button>
          </Link>
          <Link href="/absorbe-x/manifeste">
            <Button variant="outline">Manifeste</Button>
          </Link>
          <Link href="/absorbe-x/notes-recherche">
            <Button variant="outline">Notes de Recherche</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
