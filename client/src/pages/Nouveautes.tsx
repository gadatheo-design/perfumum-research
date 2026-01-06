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
  Leaf,
  Map,
  Globe,
  Microscope,
  Network,
  BookOpen
} from "lucide-react";
import { trpc } from "@/lib/trpc";

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
    date: "6 janvier 2026",
    version: "v3.5",
    title: "Amélioration navigation et UX globale",
    description: "Optimisation de la navigation inter-pages et mise à jour des hyperliens",
    type: "improvement",
    items: [
      { text: "Navigation améliorée entre toutes les sections", link: "/" },
      { text: "Hyperliens cohérents entre pages liées", link: "/systeme" },
      { text: "Mise à jour du header avec les dernières nouveautés", link: "/nouveautes" },
      { text: "Amélioration de l'UX mobile et desktop", link: "/dashboard" },
    ],
  },
  {
    date: "4 janvier 2026",
    version: "v3.4",
    title: "Audit navigation et liens inter-pages",
    description: "Vérification complète de la structure de navigation du site",
    type: "improvement",
    items: [
      { text: "Audit de toutes les routes existantes (150+ pages)", link: "/systeme" },
      { text: "Identification et correction des liens cassés", link: "/" },
      { text: "Amélioration de la cohérence de navigation", link: "/dashboard" },
    ],
  },
  {
    date: "3 janvier 2026",
    version: "v3.3",
    title: "Méthodes d'extraction et données scientifiques",
    description: "Enrichissement des fiches molécules avec données IUPAC, CAS et classes chimiques",
    type: "feature",
    items: [
      { text: "7 méthodes d'extraction documentées (distillation, CO2, etc.)", link: "/extraction-methods" },
      { text: "Champs IUPAC et CAS ajoutés aux molécules", link: "/molecules" },
      { text: "20 terroirs géographiques importés (rose Bulgarie, bergamote Calabre...)", link: "/terroirs" },
      { text: "Restrictions IFRA par catégorie de produit", link: "/ifra" },
    ],
  },
  {
    date: "3 janvier 2026",
    version: "v3.2",
    title: "TerpProfiles et tableau comparatif dynamique",
    description: "Fiches analytiques interactives et comparaison avancée des formules",
    type: "feature",
    items: [
      { text: "10 fiches TerpProfiles (SA-TP-01 à SA-TP-10)", link: "/terp-profiles" },
      { text: "Tableau comparatif avec filtres (axe climatique, plante, usage)", link: "/terp-profiles/compare" },
      { text: "Graphique radar climatique (Vent/Bois/Disparition/Structure/Diffusion)", link: "/terp-profiles" },
      { text: "Règles Absorbe affichées sur le site", link: "/methodologie/absorbe" },
    ],
  },
  {
    date: "3 janvier 2026",
    version: "v3.1",
    title: "Recettes finales San Andrés et plantes",
    description: "9 recettes finales (parfum, encens, espace) et base botanique étendue",
    type: "content",
    items: [
      { text: "3 recettes parfum (Salted Exposure, Vent Social, Architecture du Temps)", link: "/final-recipes" },
      { text: "3 recettes encens (Wind Purge, Bois Social, Disappearance)", link: "/final-recipes" },
      { text: "3 protocoles espace (Circulating Climate, Leaf Presence, Temporal Layer)", link: "/final-recipes" },
      { text: "Plantes San Andrés importées (Pimenta racemosa, Lippia alba, etc.)", link: "/plants" },
    ],
  },
  {
    date: "3 janvier 2026",
    version: "v3.0",
    title: "San Andrés / Seaflower - Leaf Economies",
    description: "Intégration complète du programme de recherche San Andrés",
    type: "feature",
    items: [
      { text: "6 échantillons botaniques initiaux (SA-LE-001 à SA-LE-006)", link: "/leaf-economies" },
      { text: "Timeline botanique (T0-T4) avec scroll horizontal", link: "/timeline-botanique" },
      { text: "Page Botanique critique avec texte théorique", link: "/botanique-critique" },
      { text: "Variétés fantômes (tabac et cannabis)", link: "/varietes-fantomes" },
      { text: "Recettes radicales (R-11 à R-18)", link: "/recettes-leaf-economies" },
    ],
  },
  {
    date: "3 janvier 2026",
    version: "v2.9",
    title: "Recherche avancée et responsive mobile",
    description: "Filtres multi-critères et optimisation mobile complète",
    type: "feature",
    items: [
      { text: "Page de recherche avancée avec filtres", link: "/recherche-avancee" },
      { text: "Filtres par famille olfactive, origine, période", link: "/recherche-avancee" },
      { text: "Responsive mobile validé (375px, 768px, 1024px)", link: "/" },
      { text: "Navigation mobile optimisée", link: "/" },
    ],
  },
  {
    date: "15 décembre 2025",
    version: "v2.8",
    title: "Audit complet et navigation améliorée",
    description: "Rapport d'audit du site, ajout des nouvelles pages aux menus principaux",
    type: "improvement",
    items: [
      { text: "Rapport d'audit complet du site (96 pages, 176 molécules, 195 recettes)", link: "/statistiques" },
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
      { text: "Document de synthèse du manuel de formulation (40+ pages)", link: "/methodologie/absorbe" },
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
  // Récupérer les statistiques dynamiques
  const { data: stats } = trpc.dashboard.getStats.useQuery();
  
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
                <div className="text-3xl font-bold text-primary">{stats?.molecules || '199'}</div>
                <div className="text-sm text-muted-foreground">Molécules</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats?.recettes || '213'}</div>
                <div className="text-sm text-muted-foreground">Recettes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">150+</div>
                <div className="text-sm text-muted-foreground">Pages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">v3.5</div>
                <div className="text-sm text-muted-foreground">Version actuelle</div>
              </div>
            </div>
          </div>
        </section>

        {/* Liens rapides vers les nouvelles fonctionnalités */}
        <section className="py-12 bg-muted/20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Fonctionnalités récentes
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/leaf-economies" className="block">
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-primary/20 hover:border-primary/40">
                    <CardHeader className="pb-2">
                      <Leaf className="h-8 w-8 text-emerald-500 mb-2" />
                      <CardTitle className="text-lg">San Andrés / Leaf Economies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Programme de recherche botanique avec échantillons, timeline et recettes radicales.</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/terp-profiles" className="block">
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-primary/20 hover:border-primary/40">
                    <CardHeader className="pb-2">
                      <BarChart3 className="h-8 w-8 text-blue-500 mb-2" />
                      <CardTitle className="text-lg">TerpProfiles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Fiches analytiques interactives avec graphiques radar et comparaison avancée.</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/terroirs" className="block">
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-primary/20 hover:border-primary/40">
                    <CardHeader className="pb-2">
                      <Map className="h-8 w-8 text-amber-500 mb-2" />
                      <CardTitle className="text-lg">Terroirs & Origines</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">20 terroirs géographiques avec données de production et caractéristiques.</p>
                    </CardContent>
                  </Card>
                </Link>
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

        {/* CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Restez informé</h2>
              <p className="text-muted-foreground mb-8">
                PERFUMUM évolue constamment. Consultez régulièrement cette page pour découvrir les dernières fonctionnalités et améliorations.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild>
                  <Link href="/contribuer">
                    Comment contribuer <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contact">
                    Nous contacter
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
