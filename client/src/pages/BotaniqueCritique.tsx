import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight,
  Leaf,
  Clock,
  Wind,
  Beaker,
  BookOpen,
  Quote
} from "lucide-react";

export default function BotaniqueCritique() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-emerald-900 text-white py-12 px-4">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-2 text-emerald-300 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/leaf-economies" className="hover:text-white transition-colors">San Andrés</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Botanique critique</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Botanique critique</h1>
          <p className="text-emerald-200 text-lg">
            Refuser la variété, lire le vivant
          </p>
          <Badge className="mt-4 bg-emerald-700">San Andrés · Leaf Economies</Badge>
        </div>
      </div>

      <article className="container max-w-4xl py-12 px-4">
        {/* Section 1 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-emerald-600" />
            Pourquoi une botanique critique ?
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed mb-4">
              La botanique classique classe : <strong>espèces</strong>, <strong>variétés</strong>, <strong>origines</strong>.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              La recherche menée ici classe : <strong>états</strong>, <strong>durées</strong>, <strong>circulations</strong>.
            </p>
            <Card className="bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 my-6">
              <CardContent className="p-6">
                <p className="text-lg">
                  Ce déplacement est essentiel : il permet de lire les plantes comme <strong>processus climatiques</strong>, 
                  non comme objets fixes.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 2 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Leaf className="h-6 w-6 text-emerald-600" />
            Contre la variété comme fétiche
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed mb-4">
              Dans le tabac et le cannabis, les noms de variétés sont instables, chargés de récits, 
              et rarement corrélés à des données moléculaires ouvertes.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              Cette recherche adopte donc un principe simple :
            </p>
            <blockquote className="border-l-4 border-emerald-500 pl-6 py-2 my-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-r-lg">
              <p className="text-xl font-medium italic">
                « Le profil prime sur le nom. »
              </p>
            </blockquote>
            <p className="text-lg leading-relaxed">
              Une feuille verte n'est pas la même plante qu'une feuille sèche, même si l'espèce est identique.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Wind className="h-6 w-6 text-emerald-600" />
            Plantes de seuil
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed mb-4">
              Le tabac et le cannabis sont abordés ici comme <strong>plantes de seuil</strong> :
            </p>
            <div className="grid md:grid-cols-3 gap-4 my-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="font-medium">entre socialité et solitude</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="font-medium">entre présence et disparition</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="font-medium">entre rituel et usage quotidien</p>
                </CardContent>
              </Card>
            </div>
            <p className="text-lg leading-relaxed">
              Ils règlent le temps, plus qu'ils ne produisent un effet.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Beaker className="h-6 w-6 text-emerald-600" />
            Le rôle des molécules
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed mb-4">
              Les molécules ne sont pas utilisées comme "ingrédients de parfum", 
              mais comme <strong>indicateurs de climat</strong> :
            </p>
            <div className="grid md:grid-cols-2 gap-4 my-6">
              <Card className="bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800">
                <CardContent className="p-4">
                  <p><strong>pinènes</strong> → ouverture / extérieur</p>
                </CardContent>
              </Card>
              <Card className="bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800">
                <CardContent className="p-4">
                  <p><strong>citral</strong> → coupe / vent</p>
                </CardContent>
              </Card>
              <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <CardContent className="p-4">
                  <p><strong>β-caryophyllène</strong> → structure sèche</p>
                </CardContent>
              </Card>
              <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <CardContent className="p-4">
                  <p><strong>norisoprénoïdes</strong> → temporalité du tabac</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 md:col-span-2">
                <CardContent className="p-4">
                  <p><strong>myrcène</strong> → modulation / disparition</p>
                </CardContent>
              </Card>
            </div>
            <p className="text-lg leading-relaxed">
              La molécule devient un <strong>outil de lecture</strong>.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Clock className="h-6 w-6 text-emerald-600" />
            Éthique de la disparition
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <div className="grid md:grid-cols-2 gap-6 my-6">
              <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                <CardHeader>
                  <CardTitle className="text-red-700 dark:text-red-400">Refuser</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>la sur-extraction</li>
                    <li>la fixation artificielle</li>
                    <li>la signature durable</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
                <CardHeader>
                  <CardTitle className="text-emerald-700 dark:text-emerald-400">Accepter</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>la perte</li>
                    <li>l'instabilité</li>
                    <li>la non-reproductibilité</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <blockquote className="border-l-4 border-emerald-500 pl-6 py-2 my-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-r-lg">
              <p className="text-lg italic">
                Une bonne archive botanique est parfois celle qui <strong>s'efface correctement</strong>.
              </p>
            </blockquote>
          </div>
        </section>

        {/* Conclusion */}
        <section className="mb-12">
          <Card className="bg-emerald-900 text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Conclusion</h2>
              <p className="text-lg leading-relaxed mb-4">
                Cette botanique critique ne vise pas à conserver les plantes, 
                mais à comprendre <strong>comment elles organisent le temps et l'air</strong>.
              </p>
              <p className="text-lg leading-relaxed text-emerald-200">
                À San Andrés, ce qui dure trop cesse d'être vivant.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Navigation */}
        <div className="flex flex-wrap gap-4">
          <Link href="/timeline-botanique">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Clock className="h-5 w-5 text-emerald-600" />
                <span>Voir la timeline botanique</span>
                <ChevronRight className="h-4 w-4" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/leaf-economies">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Leaf className="h-5 w-5 text-emerald-600" />
                <span>Explorer les échantillons</span>
                <ChevronRight className="h-4 w-4" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </article>
    </div>
  );
}
