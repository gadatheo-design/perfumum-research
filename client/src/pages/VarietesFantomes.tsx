// @ts-nocheck
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight,
  Leaf,
  Ghost,
  Wind,
  Clock,
  Archive,
  Sparkles
} from "lucide-react";

export default function VarietesFantomes() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-slate-800 text-white py-12 px-4">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/leaf-economies" className="hover:text-white transition-colors">San Andrés</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Variétés fantômes</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Ghost className="h-10 w-10" />
            Variétés fantômes
          </h1>
          <p className="text-slate-300 text-lg">
            Tabac et cannabis hors taxonomie
          </p>
          <Badge className="mt-4 bg-slate-700">San Andrés · Leaf Economies</Badge>
        </div>
      </div>

      <article className="container max-w-4xl py-12 px-4">
        {/* Définition */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Définition</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed mb-4">
              Une variété fantôme n'est ni rare ni disparue. Elle est <strong>non stabilisée</strong>, 
              <strong>non enregistrée</strong>, et souvent <strong>non nommée</strong>.
            </p>
            <Card className="bg-slate-50 dark:bg-slate-900/50 my-6">
              <CardContent className="p-6">
                <p className="mb-4">Elle existe :</p>
                <ul className="grid md:grid-cols-2 gap-2">
                  <li>dans des jardins</li>
                  <li>dans des pratiques</li>
                  <li>dans des circulations informelles</li>
                  <li>dans des états botaniques transitoires</li>
                </ul>
              </CardContent>
            </Card>
            <blockquote className="border-l-4 border-slate-500 pl-6 py-2 my-6 bg-slate-50 dark:bg-slate-900/20 rounded-r-lg">
              <p className="text-lg italic">
                Elle disparaît dès qu'on tente de la fixer.
              </p>
            </blockquote>
          </div>
        </section>

        {/* Pourquoi fantôme */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Ghost className="h-6 w-6 text-slate-600" />
            Pourquoi "fantôme" ?
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed mb-4">Parce qu'elle :</p>
            <div className="grid md:grid-cols-2 gap-4 my-6">
              <Card>
                <CardContent className="p-4">
                  <p>ne survit pas à la standardisation</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p>ne correspond pas aux catégories variétales</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p>change d'une saison à l'autre</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p>dépend plus du climat que du génome</p>
                </CardContent>
              </Card>
            </div>
            <p className="text-lg leading-relaxed">
              Les variétés fantômes ne sont pas absentes : elles sont <strong>incompatibles avec l'archive classique</strong>.
            </p>
          </div>
        </section>

        {/* Tabac fantômes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Leaf className="h-6 w-6 text-amber-600" />
            Tabac : fantômes de circulation
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed mb-4">
              Dans la région caribéenne, le tabac a longtemps été cultivé à petite échelle, 
              séché au vent, consommé localement, rarement fermenté lourdement.
            </p>
            <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 my-6">
              <CardContent className="p-6">
                <p className="mb-4">Ces tabacs ne deviennent pas des "types", car leur valeur réside dans :</p>
                <ul className="space-y-2">
                  <li>la finesse de la feuille</li>
                  <li>la vitesse de séchage</li>
                  <li>l'exposition à l'air</li>
                  <li>la disparition rapide de l'arôme</li>
                </ul>
              </CardContent>
            </Card>
            <p className="text-lg leading-relaxed font-medium">
              Ils sont des tabacs de passage, non de conservation.
            </p>
          </div>
        </section>

        {/* États fantômes tabac */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">États fantômes du tabac</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-amber-700 dark:text-amber-400">Feuille verte</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Vivante, amère, instable. Imprenable en parfum. Lisible uniquement en présence.
                </p>
              </CardContent>
            </Card>
            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-amber-700 dark:text-amber-400">Feuille jaunissante</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Moment critique rarement documenté. Naissance de la temporalité tabac. Odeur fragile, impossible à stabiliser.
                </p>
              </CardContent>
            </Card>
            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-amber-700 dark:text-amber-400">Feuille sèche ventilée</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Structure claire, non sucrée. Moment le plus "traduisible", mais toujours dépendant du climat.
                </p>
              </CardContent>
            </Card>
            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-amber-700 dark:text-amber-400">Feuille réhydratée</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Retour partiel du vivant. Temps suspendu. État presque absent des études.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Cannabis fantômes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Leaf className="h-6 w-6 text-emerald-600" />
            Cannabis : fantômes de profil
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed mb-4">
              Dans le cannabis, la fantomisation est encore plus forte. Les noms circulent, mais les profils changent.
            </p>
            <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 my-6">
              <CardContent className="p-6">
                <p className="mb-4">Ce qui subsiste réellement :</p>
                <ul className="space-y-2">
                  <li>des architectures terpéniques</li>
                  <li>des rapports feuille/fleur</li>
                  <li>des vitesses de dissipation</li>
                </ul>
              </CardContent>
            </Card>
            <blockquote className="border-l-4 border-emerald-500 pl-6 py-2 my-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-r-lg">
              <p className="text-lg italic">
                Le fantôme n'est pas la plante, mais le <strong>profil qui ne se répète pas</strong>.
              </p>
            </blockquote>
          </div>
        </section>

        {/* États fantômes cannabis */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">États fantômes du cannabis</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-emerald-700 dark:text-emerald-400">Plante vivante exposée</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Odeur pinée, verte, ouverte. Pure interaction avec l'air. Impossible à conserver.
                </p>
              </CardContent>
            </Card>
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-emerald-700 dark:text-emerald-400">Fleur sèche aérée</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Moment d'équilibre. Modulation perceptive. Non narrative si bien traitée.
                </p>
              </CardContent>
            </Card>
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-emerald-700 dark:text-emerald-400">Feuille sèche</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Souvent ignorée. Climat léger, rapide, discret. Extrêmement pertinente pour encens et espace.
                </p>
              </CardContent>
            </Card>
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-emerald-700 dark:text-emerald-400">Profil appauvri</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Résidu. Plante "fantôme". Présence par absence.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Méthode d'archivage */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Archive className="h-6 w-6 text-slate-600" />
            Méthode d'archivage fantôme
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
              <CardHeader>
                <CardTitle className="text-emerald-700 dark:text-emerald-400">On archive</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>le moment</li>
                  <li>l'état</li>
                  <li>le climat</li>
                  <li>la disparition</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <CardHeader>
                <CardTitle className="text-red-700 dark:text-red-400">Jamais</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>la reproductibilité</li>
                  <li>la stabilité</li>
                  <li>la performance</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <blockquote className="border-l-4 border-slate-500 pl-6 py-2 my-6 bg-slate-50 dark:bg-slate-900/20 rounded-r-lg">
            <p className="text-lg italic">
              Une bonne archive est parfois celle qui <strong>s'efface correctement</strong>.
            </p>
          </blockquote>
        </section>

        {/* Traduction */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-purple-600" />
            Traduction dans Leaf Economies
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed mb-4">Les variétés fantômes deviennent :</p>
            <div className="grid md:grid-cols-3 gap-4 my-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="font-medium">des recettes temporaires</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="font-medium">des protocoles d'exposition</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="font-medium">des profils comparatifs</p>
                </CardContent>
              </Card>
            </div>
            <p className="text-lg leading-relaxed">
              Elles ne sont pas reproductibles, mais <strong>activables</strong>.
            </p>
          </div>
        </section>

        {/* Conclusion */}
        <section className="mb-12">
          <Card className="bg-slate-800 text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Conclusion</h2>
              <p className="text-lg leading-relaxed mb-4">
                À San Andrés, ce qui dure trop cesse d'être vivant.
              </p>
              <p className="text-lg leading-relaxed text-slate-300">
                Les variétés fantômes ne demandent pas à être conservées, mais à être <strong>traversées</strong>.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Navigation */}
        <div className="flex flex-wrap gap-4">
          <Link href="/botanique-critique">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Leaf className="h-5 w-5 text-emerald-600" />
                <span>Botanique critique</span>
                <ChevronRight className="h-4 w-4" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/timeline-botanique">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Clock className="h-5 w-5 text-emerald-600" />
                <span>Timeline botanique</span>
                <ChevronRight className="h-4 w-4" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/leaf-economies">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Wind className="h-5 w-5 text-emerald-600" />
                <span>Échantillons</span>
                <ChevronRight className="h-4 w-4" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </article>
    </div>
  );
}
