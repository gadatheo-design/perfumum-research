// @ts-nocheck
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight,
  Leaf,
  Wind,
  TreeDeciduous,
  Sparkles,
  Beaker,
  Flame,
  FlaskConical,
  AlertTriangle
} from "lucide-react";

// Les 8 recettes radicales (R-11 à R-18)
const recettesRadicales = [
  {
    code: 'R-11',
    name: 'Green Tobacco Headspace',
    axe: ['vent', 'disparition'],
    support: 'espace',
    source: 'Feuille de tabac verte fraîche',
    protocole: 'Cloche verre, capture headspace 15 min, diffusion passive (sans alcool)',
    effet: 'Vert amer, vivant, instable',
    interpretation: 'Archive du moment avant la transformation.',
    categorie: 'tabac',
    reproductible: false,
    timeline: 'T0'
  },
  {
    code: 'R-12',
    name: 'Yellowing Leaf / Moment Critique',
    axe: ['vent', 'bois'],
    support: 'étude comparative',
    source: 'Feuille de tabac en jaunissement',
    protocole: 'Macération alcool 12h, filtration fine',
    effet: 'Fruit sec fragile, impossible à stabiliser',
    interpretation: 'Moment critique rarement capturé.',
    categorie: 'tabac',
    reproductible: false,
    timeline: 'T1'
  },
  {
    code: 'R-13',
    name: 'Salted Air-Cured Tobacco',
    axe: ['bois'],
    support: 'parfum / encens',
    source: 'Tabac air-cured insulaire',
    formula: 'megastigmatrienones 22%, β-damascenone 3%, Iso E Super 35%, β-caryophyllène 15%, support 25%',
    protocole: 'Concentré structuré',
    effet: 'Tabac clair, salin, non fumé',
    interpretation: 'Structure sèche du tabac caribéen.',
    categorie: 'tabac',
    reproductible: true,
    timeline: 'T2'
  },
  {
    code: 'R-14',
    name: 'Rehydrated Tobacco Leaf',
    axe: ['bois', 'disparition'],
    support: 'recherche',
    source: 'Feuille sèche réhydratée',
    protocole: 'Feuille sèche réhydratée à 65% HR, macération courte 6h',
    effet: 'Feuille vivante ralentie, temps suspendu',
    interpretation: 'État très peu documenté → zone de recherche Absorbe.',
    categorie: 'tabac',
    reproductible: false,
    timeline: 'T3'
  },
  {
    code: 'R-15',
    name: 'Living Cannabis Vent',
    axe: ['vent'],
    support: 'espace',
    source: 'Plante vivante (feuille + tige)',
    protocole: 'Pas d\'extraction, circulation d\'air uniquement',
    effet: 'Pinène dominant, sensation d\'extérieur',
    interpretation: 'Pure interaction avec l\'air.',
    categorie: 'cannabis',
    reproductible: false,
    timeline: 'T0'
  },
  {
    code: 'R-16',
    name: 'Dry Cannabis Leaf Incense',
    axe: ['vent', 'disparition'],
    support: 'encens',
    source: 'Feuilles de cannabis sèches',
    formula: 'Feuilles broyées 12%, fibres végétales 38%, bois sec 25%, terre minérale 15%, makko 10%',
    protocole: 'Encens de feuille',
    effet: 'Aucun effet narcotique. Climat sec, vert, rapide.',
    interpretation: 'Encens de feuille, non de fleur.',
    categorie: 'cannabis',
    reproductible: true,
    timeline: 'T2'
  },
  {
    code: 'R-17',
    name: 'Terpene-Depleted Cannabis',
    axe: ['disparition'],
    support: 'conceptuel',
    source: 'Cannabis distillé partiellement',
    protocole: 'Distillation partielle, réintroduction à 10%',
    effet: 'Absence perceptible, plante "fantôme"',
    interpretation: 'Présence par absence.',
    categorie: 'cannabis',
    reproductible: false,
    timeline: 'T4'
  },
  {
    code: 'R-18',
    name: 'Leaf Economies / Extreme',
    axe: ['bois', 'disparition'],
    support: 'parfum',
    source: 'Synthèse Leaf Economies',
    formula: 'megastigmatrienone 14%, myrcène 12%, β-caryophyllène 18%, humulène 10%, Iso E Super 26%, support 20%',
    protocole: 'Concentré final',
    effet: 'Relation sans signature. Socialité silencieuse.',
    interpretation: 'Synthèse finale du projet Leaf Economies.',
    categorie: 'mixte',
    reproductible: true,
    timeline: 'Synthèse'
  }
];

const axeColors: Record<string, string> = {
  vent: 'bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300',
  bois: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  disparition: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
};

const axeIcons: Record<string, React.ReactNode> = {
  vent: <Wind className="h-3 w-3" />,
  bois: <TreeDeciduous className="h-3 w-3" />,
  disparition: <Sparkles className="h-3 w-3" />
};

const categorieColors: Record<string, string> = {
  tabac: 'bg-amber-500 text-white',
  cannabis: 'bg-emerald-500 text-white',
  mixte: 'bg-purple-500 text-white'
};

export default function RecettesLeafEconomies() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-emerald-900 text-white py-12 px-4">
        <div className="container max-w-6xl">
          <div className="flex items-center gap-2 text-emerald-300 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/leaf-economies" className="hover:text-white transition-colors">San Andrés</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Recettes radicales</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <FlaskConical className="h-10 w-10" />
            Recettes radicales
          </h1>
          <p className="text-emerald-200 text-lg max-w-2xl">
            8 recettes non commerciales, pensées comme outils d'étude, protocoles limites, formes d'archive vivante.
          </p>
          <Badge className="mt-4 bg-emerald-700">R-11 → R-18 · Leaf Economies</Badge>
        </div>
      </div>

      <div className="container max-w-6xl py-8 px-4">
        {/* Warning */}
        <Card className="mb-8 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-6 flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                Règle Absorbe — Niveau avancé
              </p>
              <p className="text-amber-700 dark:text-amber-300">
                À ce stade, une bonne recette est une recette qu'on ne peut pas expliquer rapidement.
                Ces recettes sont radicales, non reproductibles industriellement, faites pour la recherche / exposition / site.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recettes grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {recettesRadicales.map((recette) => (
            <Card key={recette.code} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="font-mono">{recette.code}</Badge>
                  <Badge className={categorieColors[recette.categorie]}>
                    {recette.categorie}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{recette.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 flex-wrap">
                  {recette.axe.map((a) => (
                    <Badge key={a} variant="secondary" className={axeColors[a]}>
                      {axeIcons[a]} {a}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="text-xs">
                    {recette.timeline}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Leaf className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-muted-foreground">Source:</span>{' '}
                      <span>{recette.source}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Beaker className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-muted-foreground">Protocole:</span>{' '}
                      <span>{recette.protocole}</span>
                    </div>
                  </div>
                  {recette.formula && (
                    <div className="flex items-start gap-2">
                      <FlaskConical className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-muted-foreground">Formule:</span>{' '}
                        <span className="font-mono text-xs">{recette.formula}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <Flame className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-muted-foreground">Effet:</span>{' '}
                      <span>{recette.effet}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-sm italic text-muted-foreground">
                    {recette.interpretation}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Badge variant="outline" className="text-xs">
                    Support: {recette.support}
                  </Badge>
                  <Badge 
                    variant={recette.reproductible ? "default" : "secondary"}
                    className={recette.reproductible ? "bg-emerald-600" : "bg-slate-500"}
                  >
                    {recette.reproductible ? "Reproductible" : "Non reproductible"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/timeline-botanique">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Wind className="h-5 w-5 text-emerald-600" />
                <span>Timeline botanique</span>
                <ChevronRight className="h-4 w-4" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/varietes-fantomes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <span>Variétés fantômes</span>
                <ChevronRight className="h-4 w-4" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/leaf-economies">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Leaf className="h-5 w-5 text-emerald-600" />
                <span>Échantillons</span>
                <ChevronRight className="h-4 w-4" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
