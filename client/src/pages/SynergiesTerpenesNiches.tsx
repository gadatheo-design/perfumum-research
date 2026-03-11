import { useState } from "react";
import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { 
  Zap, 
  FlaskConical, 
  Clock, 
  Layers,
  ArrowRight,
  Info,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Principes de synergie
const principesSynergie = [
  {
    titre: "Fixation",
    description: "Les molécules niches agissent comme pont entre les notes de tête volatiles et les notes de fond persistantes.",
    icone: <Clock className="h-6 w-6" />,
    exemple: "L'indole fixe les notes florales légères (linalol, géraniol) et prolonge leur durée de vie.",
    color: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
  },
  {
    titre: "Harmonisation",
    description: "Les molécules niches homogénéisent des ingrédients incompatibles en créant des transitions olfactives.",
    icone: <Layers className="h-6 w-6" />,
    exemple: "Le styrax lie les notes boisées (cèdre, vétiver) aux notes florales (jasmin, rose).",
    color: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
  },
  {
    titre: "Longévité",
    description: "Les molécules niches ralentissent l'évaporation des terpènes légers et prolongent le sillage.",
    icone: <Sparkles className="h-6 w-6" />,
    exemple: "L'ambroxan amplifie et prolonge les notes fraîches (limonène, pinène) de plusieurs heures.",
    color: "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300"
  }
];

// Synergies Indole/Skatole × Terpènes
const synergiesIndole = [
  {
    moleculeNiche: "Indole",
    dosage: "0.01-0.05%",
    terpenes: [
      { nom: "Linalol", effet: "Renforce la naturalité florale du jasmin", synergie: "★★★★★" },
      { nom: "Benzyl acetate", effet: "Crée un accord jasmin absolu réaliste", synergie: "★★★★★" },
      { nom: "Géraniol", effet: "Apporte profondeur à la rose", synergie: "★★★★☆" },
      { nom: "α-Ionone", effet: "Complexifie les notes violette", synergie: "★★★★☆" },
      { nom: "Methyl anthranilate", effet: "Renforce le caractère fleur d'oranger", synergie: "★★★★☆" }
    ],
    notes: "L'indole à faible dose (<0.05%) apporte naturalité et profondeur aux floraux blancs. À dose plus élevée, il devient animal et naphtalinique."
  },
  {
    moleculeNiche: "Skatole",
    dosage: "0.001-0.01%",
    terpenes: [
      { nom: "Benzyl acetate", effet: "Crée un jasmin charnel et sensuel", synergie: "★★★★★" },
      { nom: "Linalol", effet: "Ajoute une facette animale subtile", synergie: "★★★★☆" },
      { nom: "Eugenol", effet: "Renforce le caractère œillet", synergie: "★★★★☆" },
      { nom: "Ciste labdanum", effet: "Crée un accord cuir-animal", synergie: "★★★★★" },
      { nom: "Patchouli", effet: "Apporte une animalité terreuse", synergie: "★★★★☆" }
    ],
    notes: "Le skatole est extrêmement puissant. À dose infinitésimale (<0.01%), il apporte une animalité florale. Au-delà, il devient fécal."
  }
];

// Synergies Ambroxan × Terpènes
const synergiesAmbroxan = [
  {
    moleculeNiche: "Ambroxan",
    dosage: "5-15%",
    terpenes: [
      { nom: "Limonène", effet: "Amplifie la fraîcheur et la projection", synergie: "★★★★★" },
      { nom: "α-Pinène", effet: "Crée un accord forêt-océan", synergie: "★★★★★" },
      { nom: "Linalol", effet: "Apporte un sillage floral moderne", synergie: "★★★★☆" },
      { nom: "β-Caryophyllène", effet: "Renforce le caractère boisé-ambré", synergie: "★★★★☆" },
      { nom: "Cèdre Atlas", effet: "Crée un accord bois précieux", synergie: "★★★★★" }
    ],
    notes: "L'ambroxan est un amplificateur universel. Il projette les notes de tête et prolonge les notes de fond. Idéal pour les compositions modernes."
  },
  {
    moleculeNiche: "Iso E Super",
    dosage: "10-25%",
    terpenes: [
      { nom: "Vétiver", effet: "Crée un accord boisé-minéral unique", synergie: "★★★★★" },
      { nom: "Cèdre", effet: "Amplifie le caractère boisé sec", synergie: "★★★★★" },
      { nom: "Patchouli", effet: "Apporte une aura mystérieuse", synergie: "★★★★☆" },
      { nom: "Santal", effet: "Crée un accord crémeux-boisé", synergie: "★★★★☆" },
      { nom: "Encens", effet: "Renforce la spiritualité", synergie: "★★★★☆" }
    ],
    notes: "L'Iso E Super crée un effet 'peau' et une aura diffuse. Il est souvent imperceptible consciemment mais amplifie toute la composition."
  }
];

// Synergies Styrax/Labdanum × Terpènes
const synergiesBalsamiques = [
  {
    moleculeNiche: "Styrax",
    dosage: "3-10%",
    terpenes: [
      { nom: "Vanilline", effet: "Crée un accord balsamique-gourmand", synergie: "★★★★★" },
      { nom: "Benjoin", effet: "Renforce la rondeur balsamique", synergie: "★★★★★" },
      { nom: "Coumarine", effet: "Apporte une facette foin-tabac", synergie: "★★★★☆" },
      { nom: "Eugenol", effet: "Crée un accord épicé-balsamique", synergie: "★★★★☆" },
      { nom: "Ciste labdanum", effet: "Renforce le caractère ambré", synergie: "★★★★★" }
    ],
    notes: "Le styrax apporte une note cuirée-balsamique caractéristique. Il épaissit les compositions et leur donne du corps."
  },
  {
    moleculeNiche: "Labdanum",
    dosage: "2-8%",
    terpenes: [
      { nom: "Ciste", effet: "Crée un accord méditerranéen authentique", synergie: "★★★★★" },
      { nom: "Encens", effet: "Renforce le caractère sacré", synergie: "★★★★★" },
      { nom: "Myrrhe", effet: "Apporte une profondeur résineuse", synergie: "★★★★☆" },
      { nom: "Patchouli", effet: "Crée un accord terreux-ambré", synergie: "★★★★☆" },
      { nom: "Castoréum", effet: "Renforce l'animalité cuirée", synergie: "★★★★★" }
    ],
    notes: "Le labdanum est la base de nombreux accords ambrés. Il apporte chaleur, profondeur et une facette animale subtile."
  }
];

// Composant pour afficher une carte de synergie
function SynergieCard({ synergie }: { synergie: typeof synergiesIndole[0] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{synergie.moleculeNiche}</CardTitle>
          <Badge variant="secondary">{synergie.dosage}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {synergie.terpenes.map((t) => (
            <div key={t.nom} className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{t.nom}</span>
                  <span className="text-amber-500 text-sm">{t.synergie}</span>
                </div>
                <p className="text-sm text-muted-foreground">{t.effet}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex gap-2">
            <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-200">{synergie.notes}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SynergiesTerpenesNiches() {
  return (
    <div className="container py-8">
      <Breadcrumbs />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-violet-100 dark:bg-violet-900">
            <Zap className="h-8 w-8 text-violet-600 dark:text-violet-300" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Synergies Terpènes × Molécules Niches</h1>
            <p className="text-muted-foreground">
              Interactions et effets synergiques entre terpènes et molécules de niche
            </p>
          </div>
        </div>
      </div>

      {/* Principes de synergie */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Principes Fondamentaux</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {principesSynergie.map((principe) => (
            <Card key={principe.titre} className={principe.color}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  {principe.icone}
                  <h3 className="font-bold text-lg">{principe.titre}</h3>
                </div>
                <p className="text-sm mb-3">{principe.description}</p>
                <div className="p-2 bg-white/50 dark:bg-black/20 rounded text-xs">
                  <strong>Exemple :</strong> {principe.exemple}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tabs pour les différentes catégories */}
      <Tabs defaultValue="indole" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="indole">Indole / Skatole</TabsTrigger>
          <TabsTrigger value="ambroxan">Ambroxan / Iso E</TabsTrigger>
          <TabsTrigger value="balsamiques">Styrax / Labdanum</TabsTrigger>
        </TabsList>

        {/* Indole / Skatole */}
        <TabsContent value="indole" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                Synergies Indole & Skatole × Terpènes
              </CardTitle>
              <CardDescription>
                Molécules animales/florales pour renforcer la naturalité des compositions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {synergiesIndole.map((s) => (
                  <SynergieCard key={s.moleculeNiche} synergie={s} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ambroxan / Iso E Super */}
        <TabsContent value="ambroxan" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                Synergies Ambroxan & Iso E Super × Terpènes
              </CardTitle>
              <CardDescription>
                Molécules amplificatrices pour projection et sillage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {synergiesAmbroxan.map((s) => (
                  <SynergieCard key={s.moleculeNiche} synergie={s} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Styrax / Labdanum */}
        <TabsContent value="balsamiques" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                Synergies Styrax & Labdanum × Terpènes
              </CardTitle>
              <CardDescription>
                Molécules balsamiques pour épaissir et réchauffer les compositions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {synergiesBalsamiques.map((s) => (
                  <SynergieCard key={s.moleculeNiche} synergie={s} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Axe technique */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Axe Technique</CardTitle>
          <CardDescription>
            Recommandations pour l'utilisation des molécules niches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                Fixation
              </h4>
              <p className="text-sm text-muted-foreground">
                Les molécules niches créent un pont entre les notes de tête volatiles et les notes de fond persistantes, 
                prolongeant la durée de vie des accords.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Layers className="h-4 w-4 text-purple-500" />
                Harmonisation
              </h4>
              <p className="text-sm text-muted-foreground">
                Elles homogénéisent des ingrédients incompatibles en créant des transitions olfactives fluides 
                entre différentes familles.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Longévité
              </h4>
              <p className="text-sm text-muted-foreground">
                Elles ralentissent l'évaporation des terpènes légers et amplifient le sillage, 
                donnant plus de présence à la composition.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liens connexes */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/molecules" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <FlaskConical className="h-4 w-4" />
            Voir toutes les molécules
            <ArrowRight className="h-4 w-4" />
          </Link>
        <Link href="/chimie-tabac" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors">
            Chimie du Tabac
            <ArrowRight className="h-4 w-4" />
          </Link>
        <Link href="/suggestions-synergies" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors">
            Suggestions IA
            <ArrowRight className="h-4 w-4" />
          </Link>
      </div>
    </div>
  );
}
