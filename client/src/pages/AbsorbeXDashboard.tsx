import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Brain, 
  Microscope, 
  Leaf, 
  Heart,
  ArrowRight,
  BookOpen,
  Beaker
} from "lucide-react";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";

interface ResearchAxis {
  id: string;
  name: string;
  domain: string;
  innovation: string;
  application: string;
  icon: React.ReactNode;
  color: string;
  href: string;
}

const researchAxes: ResearchAxis[] = [
  {
    id: "quantique",
    name: "Olfaction Quantique",
    domain: "Physique Quantique",
    innovation: "Ingénierie Isotopique (Isomères Vibratoires)",
    application: "Création d'Accords Quantiques, simulation de molécules rares",
    icon: <Zap className="h-6 w-6" />,
    color: "from-purple-500 to-indigo-600",
    href: "/absorbe-x/quantique"
  },
  {
    id: "neuro",
    name: "Neuro-Ingénierie Olfactive",
    domain: "Optogénétique / Neurobiologie",
    innovation: "Accords Synesthésiques (Lumière + Molécule)",
    application: "Modulation de la perception olfactive en temps réel",
    icon: <Brain className="h-6 w-6" />,
    color: "from-pink-500 to-rose-600",
    href: "/absorbe-x/neuro-olfaction"
  },
  {
    id: "nano",
    name: "Matériaux Intelligents",
    domain: "Nanotechnologie (MOF)",
    innovation: "Libération Séquentielle Programmée",
    application: "Résines à narration olfactive dynamique, non linéaire",
    icon: <Microscope className="h-6 w-6" />,
    color: "from-cyan-500 to-blue-600",
    href: "/absorbe-x/quantique"
  },
  {
    id: "biosyn",
    name: "Biosynthèse Extrême",
    domain: "Biologie Synthétique",
    innovation: "Hybrides Moléculaires (Terpène-Alcaloïde)",
    application: "Création de la gamme 'Absorbe Bio-Synth' aux profils inédits",
    icon: <Leaf className="h-6 w-6" />,
    color: "from-green-500 to-emerald-600",
    href: "/absorbe-x/patrimoine"
  },
  {
    id: "memoire",
    name: "Mémoire Olfactive",
    domain: "Neuropsychologie",
    innovation: "Curing Olfactif Nocturne (Dream Blends)",
    application: "Manipulation et consolidation de la mémoire pendant le sommeil",
    icon: <Heart className="h-6 w-6" />,
    color: "from-orange-500 to-red-600",
    href: "/absorbe-x/neuro-olfaction"
  }
];

export function AbsorbeXDashboard() {
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
                <Beaker className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">ABSORBE X</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-4">
              Recherche Avancée & Patrimoine Olfactif
            </p>
            <p className="text-lg text-foreground/80 mb-6">
              Explorez les frontières de l'olfaction à la croisée de la physique quantique, neurobiologie, nanotechnologie et biologie synthétique.
            </p>
            <div className="flex gap-3">
              <Link href="/absorbe-x/manifeste">
                <Button size="lg" className="gap-2">
                  <BookOpen className="h-5 w-5" />
                  Lire le Manifeste
                </Button>
              </Link>
              <Link href="/absorbe-x/notes-recherche">
                <Button variant="outline" size="lg" className="gap-2">
                  <Beaker className="h-5 w-5" />
                  Notes de Recherche
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Synthèse des Axes */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-2">Les 5 Axes de Rupture</h2>
          <p className="text-muted-foreground mb-8">
            Transformant le formulateur en architecte de la perception capable de manipuler la matière, la lumière et la conscience elle-même.
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {researchAxes.map((axis) => (
              <Link key={axis.id} href={axis.href}>
                <Card className="h-full p-6 hover:shadow-lg transition-all cursor-pointer group border-l-4 border-l-transparent hover:border-l-purple-500">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${axis.color} text-white flex-shrink-0`}>
                      {axis.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold mb-1 group-hover:text-purple-600 transition-colors">
                        {axis.name}
                      </h3>
                      <div className="space-y-2 mb-3">
                        <div>
                          <Badge variant="secondary" className="mb-2">
                            {axis.domain}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground/70">Innovation</p>
                          <p className="text-sm text-foreground">
                            {axis.innovation}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground/70">Application</p>
                          <p className="text-sm text-foreground">
                            {axis.application}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-sm font-medium group-hover:gap-3 transition-all">
                        Découvrir
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid gap-6 md:grid-cols-3 mb-16">
          <Link href="/absorbe-x/guide-laboratoire">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <Microscope className="h-6 w-6 text-cyan-600" />
                <h3 className="font-semibold">Guide de Laboratoire</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Protocoles pratiques, sourcing et fournisseurs stratégiques
              </p>
            </Card>
          </Link>

          <Link href="/absorbe-x/odeurs-perdues">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <Leaf className="h-6 w-6 text-green-600" />
                <h3 className="font-semibold">Odeurs Perdues</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Bibliothèque des accords patrimoniaux et reconstitutions
              </p>
            </Card>
          </Link>

          <Link href="/absorbe-x/notes-recherche">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <Beaker className="h-6 w-6 text-purple-600" />
                <h3 className="font-semibold">Suivi des Expériences</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Registre des expériences et workflows de recherche
              </p>
            </Card>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid gap-6 md:grid-cols-4 mb-16">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
            <p className="text-sm text-muted-foreground">Axes de Rupture</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-cyan-600 mb-2">7</div>
            <p className="text-sm text-muted-foreground">Concepts de Recherche</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">10</div>
            <p className="text-sm text-muted-foreground">Références Scientifiques</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">8</div>
            <p className="text-sm text-muted-foreground">Fournisseurs Stratégiques</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
