import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Calendar, BookOpen, Lightbulb, FlaskConical, Leaf } from "lucide-react";

interface JournalEntry {
  date: string;
  title: string;
  category: "observation" | "expérimentation" | "découverte" | "réflexion";
  content: string;
  tags?: string[];
}

const journalEntries: JournalEntry[] = [
  {
    date: "2025-12-24",
    title: "Intégration des matières premières Hermitage Oils",
    category: "expérimentation",
    content: "Réception et analyse de 17 nouvelles matières premières d'exception : Palo Santo, Italian Bergamot Oil, Artisan Peppermint Oil, Wild Juniper, Mitti Attar, Gris d'Ambre, Crème de Citronnelle, Oud Tea, Miyazaki Citrus, Tangerine Dream, Plumeria Light, Omani Black Frankincense, Neroli Bouquetier Reserve, Makrut Lime, Spikenard, Haitian Vetiver, Black Emerald. Chaque ingrédient a été documenté avec profil radar complet et intégré dans la base de données. 8 nouvelles recettes créées pour explorer ces matières.",
    tags: ["matières premières", "Hermitage Oils", "recettes", "C2", "C3", "C4"]
  },
  {
    date: "2025-12-23",
    title: "Développement du prototype C3 — LACTA SOLIS",
    category: "découverte",
    content: "Exploration approfondie de l'axe conceptuel 'Douceur solaire, peau, tendresse'. Création d'un profil olfactif basé sur la lactone, la vanille, le santal et les muscs blancs. Installation conceptuelle 'Peau de Lumière' documentée avec résonance émotionnelle. Profil radar olfactif complet : Douceur (90), Chaleur (85), Intensité (40), Fraîcheur (20), Épices (10), Terreux (15).",
    tags: ["C3", "LACTA SOLIS", "lactone", "vanille", "installation"]
  },
  {
    date: "2025-12-22",
    title: "Finalisation de l'Échelle ABSORBE",
    category: "découverte",
    content: "Définition complète des 7 catégories ABSORBE : Atmosphérique (pétrichor, ozone), Brut (tabac, cuir), Solaire (vanille, lactones), Organique (fermentation, champignon), Résineux (encens, myrrhe), Balsamique (benjoin, tolu), Épicé (clou de girofle, cardamome). Grille d'évaluation 0-10 créée avec radar charts. Manuel méthodologique documenté.",
    tags: ["ABSORBE", "méthodologie", "catégorisation", "radar"]
  },
  {
    date: "2025-12-21",
    title: "Prototype C2 — CLARUS VERDE : Verticalité et transparence",
    category: "expérimentation",
    content: "Développement du prototype C2 axé sur la 'Verticalité, transparence, lumière verte'. Composition basée sur le galbanum, la menthe, le petit-grain et l'encens. Installation conceptuelle 'Colonne de Lumière Verte' avec diffusion verticale. Profil radar : Fraîcheur (95), Intensité (70), Terreux (50), Épices (30), Chaleur (20), Douceur (15).",
    tags: ["C2", "CLARUS VERDE", "galbanum", "menthe", "verticalité"]
  },
  {
    date: "2025-12-20",
    title: "Prototype C1 — FERMENTUM : Organique et vivant",
    category: "découverte",
    content: "Création du prototype C1 explorant l'axe 'Organique, intime, vivant'. Composition centrée sur les notes de fermentation, champignon, terre humide et feuilles mortes. Installation conceptuelle 'Souffle Tellurique' avec diffusion par cônes d'encens. Profil radar : Terreux (95), Intensité (80), Épices (45), Chaleur (60), Fraîcheur (25), Douceur (20).",
    tags: ["C1", "FERMENTUM", "fermentation", "terre", "organique"]
  },
  {
    date: "2025-12-18",
    title: "Enrichissement des profils radar moléculaires",
    category: "observation",
    content: "Génération de profils radar uniques pour les 138 molécules de la base de données. Algorithme basé sur l'analyse des profils olfactifs (mots-clés : lavande, chaud, terre, boisé, épicé, vanille, citron, etc.) avec variation aléatoire contrôlée. Diversité de 93.5% atteinte (129 profils uniques). Suggestions de synergies automatiques implémentées avec scores de similarité (98.8% à 99.3%).",
    tags: ["molécules", "radar", "algorithme", "synergies", "IA"]
  },
  {
    date: "2025-12-15",
    title: "Création de 12 nouvelles synergies moléculaires",
    category: "découverte",
    content: "Identification et documentation de 12 synergies moléculaires : 4 potentialisations (Linalol + Limonène, Géraniol + Citronellol, Eugénol + Vanilline, Cèdrol + Vétivérol), 3 stabilisations (α-Pinène + β-Pinène, Benzyl Benzoate + Benzyl Salicylate, Coumarine + Vanilline), 3 transformations (Indole + Jasmine Lactone, Cis-3-Hexenol + Géraniol, Iso E Super + Ambroxan), 2 masquages (Menthol + Camphre, Vanilline + Pyrazine). Base de données enrichie à 17 synergies totales.",
    tags: ["synergies", "potentialisation", "stabilisation", "transformation", "masquage"]
  },
  {
    date: "2025-12-10",
    title: "Implémentation du graphe D3.js des synergies",
    category: "expérimentation",
    content: "Création d'un graphe interactif D3.js pour visualiser les synergies moléculaires. Nœuds = molécules/tabacs/familles, arêtes = synergies. Filtres par type d'effet (potentialisation, stabilisation, transformation, masquage). Drag & drop, zoom/pan interactif. Légende et liste détaillée des synergies. Page accessible via /suggestions-synergies (alternative fonctionnelle).",
    tags: ["D3.js", "visualisation", "synergies", "graphe", "interactivité"]
  },
  {
    date: "2025-12-05",
    title: "Recherche avancée multi-critères",
    category: "observation",
    content: "Ajout de 13 critères de filtrage combinés sur la page Molécules : profil olfactif + 6 axes radar (Intensité, Fraîcheur, Chaleur, Douceur, Épices, Terreux) + propriétés chimiques (point d'ébullition 0-500°C, masse moléculaire 0-500 g/mol). Sliders interactifs avec affichage résultats en temps réel et compteur. Bouton 'Réinitialiser filtres radar' global.",
    tags: ["filtres", "recherche avancée", "radar", "propriétés chimiques"]
  },
  {
    date: "2025-12-01",
    title: "Comparateur de molécules avancé",
    category: "expérimentation",
    content: "Création de la page /compare-molecules-advanced permettant de sélectionner 2-4 molécules et d'afficher leurs radars superposés avec Chart.js. Tableau comparatif détaillé (propriétés chimiques, synergies, recettes). Calcul de similarité olfactive par distance euclidienne. Export PDF du comparatif prévu (en développement).",
    tags: ["comparateur", "Chart.js", "similarité", "distance euclidienne"]
  },
  {
    date: "2025-11-28",
    title: "Interface d'administration des valeurs radar",
    category: "observation",
    content: "Création de la page /admin/molecules avec tableau et formulaire pour ajuster manuellement les 6 valeurs radar (Intensité, Fraîcheur, Chaleur, Douceur, Épices, Terreux) de chaque molécule. Sliders 0-100 avec prévisualisation radar en couleurs OKLCH. Procédures tRPC pour mise à jour radar implémentées.",
    tags: ["admin", "radar", "interface", "tRPC"]
  },
  {
    date: "2025-11-25",
    title: "Optimisations mobile et accessibilité",
    category: "observation",
    content: "Amélioration de l'espacement tactile des boutons (min 44px), optimisation de la taille de police mobile (15px base), padding containers mobile (1rem), cartes molécules/recettes optimisées. Inputs 16px pour éviter zoom iOS. Safe area insets pour notch/dynamic island. Support landscape mobile et très petits écrans (< 375px).",
    tags: ["mobile", "accessibilité", "UX", "responsive"]
  },
  {
    date: "2025-11-20",
    title: "Statistiques Chart.js intégrées au Dashboard",
    category: "découverte",
    content: "Intégration de 3 graphiques Chart.js dans le Dashboard : camembert des familles olfactives, barres des top 10 molécules, courbe d'évolution temporelle. Procédure tRPC analytics.getStatistics créée. Données actuelles : 138 molécules (7 avec profils radar complets), 142 recettes, 25 accords, 4 prototypes, 26 traditions olfactives, 15 synergies moléculaires.",
    tags: ["Dashboard", "Chart.js", "statistiques", "analytics"]
  },
  {
    date: "2025-11-15",
    title: "Thèmes visuels personnalisés par gamme",
    category: "observation",
    content: "Création de thèmes visuels distincts pour chaque gamme : Pétrichor (vert-gris atmosphérique), Volcanique (rouge-orange incandescent), Traditions (or-brun chaleureux), Glaciaire (bleu-blanc cristallin), Bio-Lab (vert-cyan scientifique). Animations subtiles : transitions fluides, hover effects, fade-in scroll. Mode sombre optimisé avec contraste amélioré.",
    tags: ["design", "thèmes", "gammes", "animations", "mode sombre"]
  },
  {
    date: "2025-11-10",
    title: "Mini radars hexagonaux pour 7 terpènes",
    category: "découverte",
    content: "Création de mini radars hexagonaux pour 7 molécules avec données complètes : α-Pinène, β-Pinène, Limonène, Linalol, Géraniol, Caryophyllène, Myrcène. Propriétés scientifiques compactes (formule, concentration, origine) intégrées dans les fiches molécules.",
    tags: ["radar", "terpènes", "visualisation", "propriétés scientifiques"]
  }
];

const getCategoryIcon = (category: JournalEntry["category"]) => {
  switch (category) {
    case "observation":
      return <BookOpen className="h-5 w-5" />;
    case "expérimentation":
      return <FlaskConical className="h-5 w-5" />;
    case "découverte":
      return <Lightbulb className="h-5 w-5" />;
    case "réflexion":
      return <Leaf className="h-5 w-5" />;
  }
};

const getCategoryColor = (category: JournalEntry["category"]) => {
  switch (category) {
    case "observation":
      return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    case "expérimentation":
      return "text-purple-500 bg-purple-500/10 border-purple-500/20";
    case "découverte":
      return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    case "réflexion":
      return "text-green-500 bg-green-500/10 border-green-500/20";
  }
};

const getCategoryLabel = (category: JournalEntry["category"]) => {
  switch (category) {
    case "observation":
      return "Observation";
    case "expérimentation":
      return "Expérimentation";
    case "découverte":
      return "Découverte";
    case "réflexion":
      return "Réflexion";
  }
};

export default function Journal() {
  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Calendar className="h-12 w-12 text-primary" />
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                  Journal de Recherche
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Carnet chronologique documentant les observations, expérimentations, découvertes et réflexions du projet PERFUMUM
              </p>
            </div>
          </div>
        </section>

        {/* Légende des catégories */}
        <section className="py-8 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-lg font-semibold mb-4 text-center">Catégories</h2>
              <div className="flex flex-wrap gap-3 justify-center">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-blue-500/10 border-blue-500/20">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Observation</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-purple-500/10 border-purple-500/20">
                  <FlaskConical className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Expérimentation</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-amber-500/10 border-amber-500/20">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">Découverte</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-green-500/10 border-green-500/20">
                  <Leaf className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Réflexion</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Entrées du journal */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto space-y-8">
              {journalEntries.map((entry, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  {/* En-tête */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full border ${getCategoryColor(entry.category)}`}>
                        {getCategoryIcon(entry.category)}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{entry.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{entry.date}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className={`text-sm font-medium ${getCategoryColor(entry.category).split(' ')[0]}`}>
                            {getCategoryLabel(entry.category)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contenu */}
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {entry.content}
                  </p>

                  {/* Tags */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 text-xs font-medium bg-muted rounded-full border border-border"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Note méthodologique */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Note méthodologique</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Ce journal de recherche documente de manière chronologique l'évolution du projet PERFUMUM. Chaque entrée est catégorisée selon sa nature (observation, expérimentation, découverte, réflexion) et enrichie de tags pour faciliter la navigation thématique.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                L'objectif est de maintenir une trace systématique des décisions, des découvertes et des itérations qui structurent la recherche olfactive. Ce carnet constitue à la fois un outil de travail personnel et une archive consultable pour comprendre la genèse et l'évolution des compositions.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
