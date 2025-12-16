import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Calendar, 
  ArrowRight, 
  Beaker, 
  FlaskConical, 
  FileText, 
  Truck, 
  Flame, 
  Zap,
  Clock,
  Sparkles,
  Database,
  BarChart3,
  Leaf
} from "lucide-react";

interface Update {
  date: string;
  version: string;
  title: string;
  description: string;
  type: "feature" | "content" | "fix" | "improvement";
  items: {
    text: string;
    link?: string;
  }[];
}

const updates: Update[] = [
  {
    date: "15 décembre 2025",
    version: "v2.8",
    title: "Audit complet et navigation améliorée",
    description: "Rapport d'audit du site, ajout des nouvelles pages aux menus principaux",
    type: "improvement",
    items: [
      { text: "Rapport d'audit complet du site (96 pages, 176 molécules, 195 recettes)", link: "/docs/audit-site-perfumum.md" },
      { text: "Fournisseurs ajouté au menu Études", link: "/fournisseurs" },
      { text: "Chimie du Tabac, Synergies Terpènes, Protocoles ajoutés au menu Résines CBD", link: "/chimie-tabac" },
      { text: "Page Nouveautés créée", link: "/nouveautes" },
    ],
  },
  {
    date: "14 décembre 2025",
    version: "v2.7",
    title: "Gamme Signatures et Synergies Terpènes × Niches",
    description: "Nouvelles pages de recherche avancée et gamme premium",
    type: "feature",
    items: [
      { text: "Gamme Signatures avec 3 profils d'exception (Cuir Marin, Forêt de Cacao, Fleur Fantôme)", link: "/gammes/signatures" },
      { text: "Page Synergies Terpènes × Molécules Niches", link: "/synergies-terpenes-niches" },
      { text: "Lien Chimie du Tabac dans Recherche Scientifique", link: "/recherche-scientifique" },
    ],
  },
  {
    date: "14 décembre 2025",
    version: "v2.6",
    title: "Protocoles de Maturation et Filtres Ingrédients",
    description: "Outils de formulation avancés et documentation des temps de cure",
    type: "feature",
    items: [
      { text: "Page Protocoles de Maturation (5 protocoles par type de résine)", link: "/protocoles-maturation" },
      { text: "Filtres par ingrédient sur la page Recettes", link: "/recettes" },
      { text: "Lien Synergies Terpènes dans Recherche Scientifique", link: "/recherche-scientifique" },
    ],
  },
  {
    date: "13 décembre 2025",
    version: "v2.5",
    title: "Profils d'exception et Chimie du Tabac",
    description: "3 recettes signatures et documentation complète des esters aromatiques",
    type: "content",
    items: [
      { text: "3 profils d'exception : Cuir Marin, Forêt de Cacao, Fleur Fantôme", link: "/gammes/signatures" },
      { text: "Page Chimie du Tabac avec 13 esters et 7 acides gras", link: "/chimie-tabac" },
    ],
  },
  {
    date: "13 décembre 2025",
    version: "v2.4",
    title: "Gamme Indole/Skatole et Esters du Tabac",
    description: "6 nouvelles recettes animales et 13 molécules aromatiques",
    type: "content",
    items: [
      { text: "6 recettes Indole/Skatole (Black Oud Skin, Noir Tabac, White Jasmine...)", link: "/recettes" },
      { text: "13 esters aromatiques du tabac importés", link: "/molecules" },
    ],
  },
  {
    date: "12 décembre 2025",
    version: "v2.3",
    title: "Gammes Cheese et Ester Lab + Page Fournisseurs",
    description: "11 nouvelles recettes et référencement des fournisseurs",
    type: "content",
    items: [
      { text: "5 recettes Cheese Terpenic Line (Classic, Tropical, Blue, Smoky, Sweet)", link: "/recettes" },
      { text: "6 recettes Ester Lab (Velvet Fruit, Cassis Blanc, Butter Flower...)", link: "/recettes" },
      { text: "8 molécules niches (Indole, Skatole, Acides gras C4-C10)", link: "/molecules" },
      { text: "Page Fournisseurs avec 12 fournisseurs référencés", link: "/fournisseurs" },
    ],
  },
  {
    date: "11 décembre 2025",
    version: "v2.2",
    title: "Synthèse Manuel de Formulation",
    description: "Documentation complète des protocoles et méthodologies",
    type: "content",
    items: [
      { text: "Document de synthèse du manuel de formulation (40+ pages)", link: "/docs/synthese-manuel-formulation.md" },
      { text: "Protocoles détaillés pour chaque gamme", link: "/laboratoire" },
    ],
  },
  {
    date: "10 décembre 2025",
    version: "v2.1",
    title: "Recherche Scientifique et Programmes",
    description: "Nouvelles pages de recherche avancée",
    type: "feature",
    items: [
      { text: "Page Recherche Scientifique avec 6 modules", link: "/recherche-scientifique" },
      { text: "Programmes de Recherche (Résines CBD, Tabacs Niche)", link: "/programmes-recherche" },
      { text: "Synergies Moléculaires", link: "/recherche-scientifique/synergies-moleculaires" },
      { text: "Pyrolyse et Combustion", link: "/recherche-scientifique/pyrolyse-combustion" },
    ],
  },
  {
    date: "8 décembre 2025",
    version: "v2.0",
    title: "Refonte Design Swiss Psychedelic",
    description: "Nouveau design system avec palette OKLCH et typographie Space Grotesk",
    type: "improvement",
    items: [
      { text: "Design system Swiss Psychedelic (violet électrique, coins brutaux)" },
      { text: "Mode sombre optimisé avec contraste amélioré" },
      { text: "Animations subtiles (fade-in, hover effects)" },
      { text: "Navigation mobile avec bottom bar" },
    ],
  },
  {
    date: "5 décembre 2025",
    version: "v1.5",
    title: "Visualisations D3.js et Chart.js",
    description: "Graphes interactifs et radars olfactifs",
    type: "feature",
    items: [
      { text: "Graphe D3.js molécules-recettes", link: "/graphe-molecules-recettes" },
      { text: "Radars olfactifs hexagonaux", link: "/molecules" },
      { text: "Matrice des synergies", link: "/matrice-synergies" },
      { text: "Comparateur radar", link: "/compare-radar" },
    ],
  },
  {
    date: "1 décembre 2025",
    version: "v1.0",
    title: "Lancement de la plateforme PERFUMUM",
    description: "Première version publique avec base de données initiale",
    type: "feature",
    items: [
      { text: "131 molécules documentées", link: "/molecules" },
      { text: "142 recettes initiales", link: "/recettes" },
      { text: "5 gammes olfactives", link: "/gammes" },
      { text: "4 prototypes CBD", link: "/prototypes" },
    ],
  },
];

const typeColors = {
  feature: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  content: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  fix: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  improvement: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
};

const typeLabels = {
  feature: "Fonctionnalité",
  content: "Contenu",
  fix: "Correction",
  improvement: "Amélioration",
};

export default function Nouveautes() {
  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Nouveautés
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Historique des mises à jour et évolutions de la plateforme PERFUMUM
              </p>
            </div>
          </div>
        </section>

        {/* Stats rapides */}
        <section className="py-8 border-b">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">176</div>
                <div className="text-sm text-muted-foreground">Molécules</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">195</div>
                <div className="text-sm text-muted-foreground">Recettes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">96</div>
                <div className="text-sm text-muted-foreground">Pages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">v2.8</div>
                <div className="text-sm text-muted-foreground">Version actuelle</div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline des mises à jour */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Historique des versions</h2>
              
              <div className="space-y-8">
                {updates.map((update, index) => (
                  <Card key={index} className="relative overflow-hidden">
                    {index === 0 && (
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                        DERNIÈRE
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <Badge variant="outline" className="gap-1">
                          <Calendar className="h-3 w-3" />
                          {update.date}
                        </Badge>
                        <Badge variant="secondary">{update.version}</Badge>
                        <Badge className={typeColors[update.type]}>
                          {typeLabels[update.type]}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{update.title}</CardTitle>
                      <CardDescription>{update.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {update.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2">
                            <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            {item.link ? (
                              <Link href={item.link} className="text-muted-foreground hover:text-foreground hover:underline transition-colors">
                                {item.text}
                              </Link>
                            ) : (
                              <span className="text-muted-foreground">{item.text}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Prochaines étapes</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-blue-500" />
                      Enrichissement des données
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    <ul className="space-y-2">
                      <li>• Compléter les gammes Glaciaire et BioLab</li>
                      <li>• Ajouter les sources botaniques manquantes</li>
                      <li>• Documenter les 26 traditions olfactives</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-emerald-500" />
                      Nouvelles visualisations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    <ul className="space-y-2">
                      <li>• Carte mondiale des traditions olfactives</li>
                      <li>• Timeline interactive des découvertes</li>
                      <li>• Graphe 3D des synergies moléculaires</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FlaskConical className="h-5 w-5 text-purple-500" />
                      Outils de formulation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    <ul className="space-y-2">
                      <li>• Journal de formulation personnel</li>
                      <li>• Export PDF des recettes</li>
                      <li>• Calculateur de coûts matières</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-green-500" />
                      Nouvelles gammes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    <ul className="space-y-2">
                      <li>• Gamme Aquatique (notes marines)</li>
                      <li>• Gamme Gourmande (accords sucrés)</li>
                      <li>• Gamme Cuir (notes animales)</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Contribuer au projet</h2>
              <p className="text-muted-foreground mb-8">
                PERFUMUM est un projet de recherche sur 10 ans (2025-2035). Vos retours et suggestions sont précieux pour améliorer la plateforme.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild>
                  <Link href="/contact">
                    Nous contacter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/a-propos">
                    En savoir plus
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
