import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Droplets, Mountain, Crown, ArrowRight, Sparkles, Heart, Gem } from "lucide-react";
import { VoirAussi, suggestionsGammes } from "@/components/VoirAussi";

export default function Gammes() {
  const gammes = [
    {
      name: "Pétrichor",
      subtitle: "L'odeur de la pluie sur la terre",
      description: "60 variations explorant le phénomène du pétrichor : terre humide, minéral, végétal, cendre, métal. De l'accord Prima (terre vive + pluie chaude) aux variations radicales (radioactif, béton humain, cendres humaines).",
      icon: Droplets,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      variations: 60,
      families: ["Hash Prima", "Tabac Fermenté", "Minéral Hash", "Floral Salé", "Animal Fumé", "Métallique Humide"],
      href: "/gammes/petrichor",
    },
    {
      name: "Volcanique",
      subtitle: "Géologie incandescente",
      description: "36 variations autour de la matière volcanique : soufre, cendre, pierre chaude, fumée noire, minéral brûlé. Exploration des transformations thermiques et des odeurs géologiques extrêmes.",
      icon: Mountain,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      variations: 36,
      families: ["Soufre Pur", "Cendre Chaude", "Pierre Calcinée", "Fumée Noire", "Minéral Brûlé", "Lave Refroidie"],
      href: "/gammes/volcanique",
    },
    {
      name: "Royal Mossi",
      subtitle: "Identité olfactive du Sahel",
      description: "Architecture moléculaire inspirée des traditions Mossi : cuir tanné, fumigations rituelles, peaux tannées, identité Sahel. Recherche anthropologique sur les pratiques olfactives d'Afrique de l'Ouest.",
      icon: Crown,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      variations: 12,
      families: ["Cuir Mossi", "Fumigations", "Peaux Tannées", "Bois Sahel"],
      href: "/gammes/mossi",
    },
    {
      name: "Signatures",
      subtitle: "Profils d'exception",
      description: "Collection premium de 3 profils d'exception qui repoussent les limites de la formulation olfactive : Cuir Marin (océan × cuir × minéral), Forêt de Cacao (jungle tropicale), Fleur Fantôme (floral éthéré).",
      icon: Sparkles,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
      variations: 3,
      families: ["Cuir Marin", "Forêt de Cacao", "Fleur Fantôme"],
      href: "/gammes/signatures",
    },
    {
      name: "Phéromones",
      subtitle: "Communication chimique humaine",
      description: "Exploration des molécules de communication chimique : Androsténol (truffe, musc), Androsténone (boisé/urineux selon génotype), Androstadiénone (musqué subtil). Doses infinitésimales pour effets subliminaux.",
      icon: Heart,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      variations: 4,
      families: ["Pheromona Truffle", "Pheromona Skin", "Pheromona Alpha", "Pheromona Cascade"],
      href: "/gammes/pheromones",
    },
    {
      name: "Raretés",
      subtitle: "Molécules précieuses de la parfumerie",
      description: "Les 10 molécules essentielles qui définissent l'excellence : Oud, Iris, Ambre Gris, Iso E Super, Ambrox, Coumarine, Calone, Galaxolide, Cashmeran, Javanol. 5 accords maîtres pour la haute parfumerie.",
      icon: Gem,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      variations: 10,
      families: ["Trésor d'Orient", "Iris Royal", "Santal Sacré", "Musc Précieux", "Océan Profond"],
      href: "/gammes/raretes",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4">Recherche Olfactive</Badge>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Gammes de Recherche
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Trois familles olfactives développées sur plusieurs années, explorant des territoires sensoriels inédits : le pétrichor (pluie sur terre), le volcanique (géologie incandescente) et le Royal Mossi (identité Sahel).
              </p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Les gammes constituent le <strong>cœur de la recherche PERFUMUM</strong>. Chaque gamme explore un phénomène olfactif spécifique à travers des dizaines de variations, formant un <strong>corpus systématique</strong> qui documente les transformations de la matière, les effets thermiques, et les pratiques culturelles. Ces accords ne sont pas des parfums commerciaux mais des <strong>outils de recherche</strong> et des <strong>œuvres olfactives</strong>.
              </p>
            </div>

            {/* Gammes Grid */}
            <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
              {gammes.map((gamme, index) => {
                const Icon = gamme.icon;
                return (
                  <Link key={index} href={gamme.href}>
                    <Card className="shadow-sm hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-6">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`w-16 h-16 rounded-lg ${gamme.bgColor} flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`h-8 w-8 ${gamme.color}`} />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-3xl mb-2">{gamme.name}</CardTitle>
                              <CardDescription className="text-base mb-4">{gamme.subtitle}</CardDescription>
                              <Badge variant="secondary" className="mb-4">
                                {gamme.variations} variations
                              </Badge>
                              <p className="text-muted-foreground leading-relaxed">
                                {gamme.description}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-2" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div>
                          <h4 className="text-sm font-semibold text-muted-foreground mb-3">Familles principales</h4>
                          <div className="flex flex-wrap gap-2">
                            {gamme.families.map((family, idx) => (
                              <Badge key={idx} variant="outline">{family}</Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Méthodologie des Gammes
              </h2>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Variations Systématiques</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Chaque gamme est développée selon un <strong>protocole de variations systématiques</strong> : une formule mère est déclinée en ajoutant, retirant ou modifiant des molécules clés. Cette approche permet d'explorer l'espace olfactif de manière méthodique et de documenter les effets de chaque transformation.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Documentation Rigoureuse</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Chaque variation est documentée avec sa <strong>formule précise</strong>, son <strong>profil olfactif</strong>, ses <strong>caractéristiques techniques</strong> (intensité, stabilité, température de combustion) et ses <strong>usages recommandés</strong>. Cette documentation permet la reproductibilité et l'analyse comparative.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Approche Artistique & Scientifique</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Les gammes ne sont pas de simples collections de formules mais des <strong>dispositifs de recherche-création</strong>. Elles interrogent des phénomènes sensoriels (pétrichor), des transformations matérielles (volcanique) ou des pratiques culturelles (Mossi) à travers l'olfaction. Chaque accord est à la fois <strong>outil d'analyse</strong> et <strong>œuvre autonome</strong>.
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Voir aussi */}
      <VoirAussi items={suggestionsGammes} />
      
      <Footer />
    </div>
  );
}
