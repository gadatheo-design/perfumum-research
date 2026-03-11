import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";

export function AbsorbeXManifeste() {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <DynamicBreadcrumb />
        </div>
      </div>

      {/* Hero */}
      <div className="border-b bg-gradient-to-r from-background via-purple-50/50 to-background dark:via-purple-950/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Manifeste de Recherche</h1>
            <p className="text-xl text-muted-foreground">
              Frontières de l'Olfaction — Vision Stratégique
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="prose prose-sm dark:prose-invert max-w-none mb-12">
            <p className="text-lg leading-relaxed text-foreground/90">
              Le Livret Technique Absorbe Studio établit une maîtrise des interactions chimiques et sensorielles classiques. 
              Le présent manifeste propose d'explorer des axes de recherche de rupture, à la croisée de la chimie quantique, 
              de la neurobiologie et de la nanotechnologie, pour redéfinir l'art de la formulation olfactive.
            </p>
          </div>

          {/* Axes */}
          <div className="space-y-12">
            {/* Axe 1 */}
            <Card className="p-8 border-l-4 border-l-purple-500">
              <div className="flex items-start gap-4 mb-4">
                <Badge className="bg-purple-500">I</Badge>
                <h2 className="text-2xl font-bold">Olfaction Quantique : L'Accord Vibratoire</h2>
              </div>
              <div className="space-y-4 text-foreground/80">
                <p>
                  La théorie dominante de l'olfaction repose sur la reconnaissance de la <strong>forme moléculaire</strong> (le modèle "clé-serrure"). 
                  Cependant, des travaux controversés suggèrent que l'odorat pourrait également détecter les <strong>fréquences de vibration</strong> des 
                  liaisons moléculaires dans l'infrarouge, via un mécanisme d'effet tunnel électronique quantique.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-l-purple-300">
                  <p className="font-semibold mb-2">Axe de Rupture : L'Ingénierie Isotopique</p>
                  <p>
                    L'innovation consiste à dépasser la simple composition chimique pour manipuler la <strong>signature vibratoire</strong> des molécules. 
                    En substituant des atomes d'hydrogène par leur isotope lourd, le deutérium, on crée des <strong>isomères vibratoires</strong> qui 
                    possèdent la même forme chimique mais une fréquence de vibration différente.
                  </p>
                  <p className="mt-3 text-sm">
                    <strong>Piste de Recherche :</strong> Créer des "Accords Quantiques" en utilisant des terpènes deutérés (ex: limonène-d8) pour 
                    moduler la perception olfactive sans altérer la structure. Cela permettrait de simuler des notes rares ou de créer des profils 
                    olfactifs inédits, impossibles à obtenir par la seule chimie organique classique.
                  </p>
                </div>
              </div>
            </Card>

            {/* Axe 2 */}
            <Card className="p-8 border-l-4 border-l-pink-500">
              <div className="flex items-start gap-4 mb-4">
                <Badge className="bg-pink-500">II</Badge>
                <h2 className="text-2xl font-bold">Neuro-Ingénierie Olfactive : La Perception Augmentée</h2>
              </div>
              <div className="space-y-4 text-foreground/80">
                <p>
                  Le livret technique mentionne l'importance de l'équilibre sensoriel et de la documentation. L'étape suivante est de contrôler 
                  la perception elle-même.
                </p>
                
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-l-pink-300">
                    <p className="font-semibold mb-2">A. Optogénétique et "Odeurs Fantômes"</p>
                    <p>
                      L'<strong>optogénétique</strong> permet de rendre les neurones olfactifs sensibles à la lumière par modification génétique. 
                      Bien que complexe à appliquer in vivo chez l'humain, le concept ouvre une voie de recherche fondamentale.
                    </p>
                    <p className="mt-3 text-sm">
                      <strong>Piste de Recherche :</strong> Développer des dispositifs de consommation (vaporisateurs ou diffuseurs) intégrant des LED 
                      à fréquences spécifiques. Ces fréquences lumineuses, synchronisées avec la libération des molécules, pourraient stimuler des voies 
                      neuronales spécifiques, modulant la perception des terpènes en temps réel.
                    </p>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-l-pink-300">
                    <p className="font-semibold mb-2">B. Olfaction et États Modifiés de Conscience (ASC)</p>
                    <p>
                      Des études suggèrent que la stimulation de l'épithélium olfactif, notamment via des cycles de respiration guidée (Pranayama), 
                      peut induire des <strong>états modifiés de conscience</strong>.
                    </p>
                    <p className="mt-3 text-sm">
                      <strong>Piste de Recherche :</strong> Concevoir des "Accords de Synchronisation" dont la cinétique de libération moléculaire 
                      est précisément calquée sur les cycles respiratoires lents, transformant la résine en un outil de "Curing Mental".
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Axe 3 */}
            <Card className="p-8 border-l-4 border-l-cyan-500">
              <div className="flex items-start gap-4 mb-4">
                <Badge className="bg-cyan-500">III</Badge>
                <h2 className="text-2xl font-bold">Nanotechnologie et Biosynthèse Extrême</h2>
              </div>
              <div className="space-y-4 text-foreground/80">
                <p>
                  Le livret explore la biosynthèse et l'extraction verte. L'innovation réside dans la miniaturisation et la complexification 
                  des systèmes de production et de libération.
                </p>
                
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-l-cyan-300">
                    <p className="font-semibold mb-2">A. Matériaux Olfactifs Intelligents (MOF)</p>
                    <p>
                      L'utilisation de <strong>nanomatériaux</strong> comme les Metal-Organic Frameworks (MOF) permet d'encapsuler des molécules 
                      aromatiques et de contrôler leur libération avec une précision inédite.
                    </p>
                    <p className="mt-3 text-sm">
                      <strong>Piste de Recherche :</strong> Créer des "Résines à Libération Séquentielle". Les terpènes ne seraient plus libérés 
                      par la seule chaleur, mais par des stimuli externes programmés, permettant une narration olfactive dynamique.
                    </p>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-l-cyan-300">
                    <p className="font-semibold mb-2">B. Biosynthèse de Molécules "Extraterrestres"</p>
                    <p>
                      L'étape de rupture est la production de molécules qui n'existent pas dans la nature terrestre ou qui sont des 
                      <strong>hybrides moléculaires</strong> ultra-stables.
                    </p>
                    <p className="mt-3 text-sm">
                      <strong>Piste de Recherche :</strong> Utiliser la biologie synthétique pour créer des voies métaboliques produisant des 
                      terpènes chiraux ou des hybrides terpène-alcaloïde, donnant naissance à la gamme "Absorbe Bio-Synth".
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Synthèse */}
            <Card className="p-8 bg-muted/50">
              <h3 className="text-2xl font-bold mb-6">Synthèse des Axes de Recherche de Rupture</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-3 font-semibold">Axe de Recherche</th>
                      <th className="text-left py-3 px-3 font-semibold">Domaine de Rupture</th>
                      <th className="text-left py-3 px-3 font-semibold">Innovation Clé</th>
                      <th className="text-left py-3 px-3 font-semibold">Application Potentielle</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-background/50">
                      <td className="py-3 px-3 font-medium">Olfaction Quantique</td>
                      <td className="py-3 px-3">Physique Quantique</td>
                      <td className="py-3 px-3">Ingénierie Isotopique</td>
                      <td className="py-3 px-3">Accords Quantiques</td>
                    </tr>
                    <tr className="border-b hover:bg-background/50">
                      <td className="py-3 px-3 font-medium">Neuro-Ingénierie</td>
                      <td className="py-3 px-3">Optogénétique</td>
                      <td className="py-3 px-3">Accords Synesthésiques</td>
                      <td className="py-3 px-3">Modulation de la perception</td>
                    </tr>
                    <tr className="border-b hover:bg-background/50">
                      <td className="py-3 px-3 font-medium">Matériaux Intelligents</td>
                      <td className="py-3 px-3">Nanotechnologie (MOF)</td>
                      <td className="py-3 px-3">Libération Séquentielle</td>
                      <td className="py-3 px-3">Narration olfactive dynamique</td>
                    </tr>
                    <tr className="border-b hover:bg-background/50">
                      <td className="py-3 px-3 font-medium">Biosynthèse Extrême</td>
                      <td className="py-3 px-3">Biologie Synthétique</td>
                      <td className="py-3 px-3">Hybrides Moléculaires</td>
                      <td className="py-3 px-3">Gamme Bio-Synth</td>
                    </tr>
                    <tr className="hover:bg-background/50">
                      <td className="py-3 px-3 font-medium">Mémoire Olfactive</td>
                      <td className="py-3 px-3">Neuropsychologie</td>
                      <td className="py-3 px-3">Dream Blends</td>
                      <td className="py-3 px-3">Consolidation de mémoire</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Conclusion */}
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-foreground/90 italic">
                Ces pistes de recherche représentent le futur de l'olfaction, transformant le formulateur en un 
                <strong> architecte de la perception</strong> capable de manipuler la matière, la lumière et la conscience elle-même.
              </p>
            </div>
          </div>

          {/* References */}
          <Card className="mt-12 p-8 bg-muted/30">
            <h3 className="text-xl font-bold mb-4">Références Scientifiques</h3>
            <div className="space-y-3 text-sm">
              <p>[1] Status of the Vibrational Theory of Olfaction. <em>Frontiers in Physics</em>, 2018.</p>
              <p>[2] Vibration theory of olfaction. <em>Wikipedia</em>.</p>
              <p>[3] Manipulating synthetic optogenetic odors reveals the coding logic of olfactory perception. <em>Science</em>, 2020.</p>
              <p>[4] Altered state of consciousness induced by active stimulation of the olfactory epithelium during slow breathing (pranayama). <em>ResearchGate</em>.</p>
              <p>[5] Nanotechnology in Scenting: Advantages and Applications. <em>ScentSwirl</em>, 2025.</p>
              <p>[6] Fermentation Strategies for Production of Pharmaceutical Terpenoids in Engineered Yeast. <em>PMC</em>, 2021.</p>
              <p>[7] Odor cueing during sleep improves consolidation of a motor skill. <em>Nature</em>, 2022.</p>
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex gap-4 mt-12">
            <Link href="/absorbe-x">
              <Button variant="outline" className="gap-2">
                Retour au Dashboard
              </Button>
            </Link>
            <Link href="/absorbe-x/notes-recherche">
              <Button className="gap-2">
                Notes de Recherche
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
