import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { trpc } from "../lib/trpc";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "../components/filters/SearchBar";
import { FilterSelect } from "../components/filters/FilterSelect";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { BookOpen, Filter, Sparkles, BookMarked, Layers, FlaskConical, X } from "lucide-react";

// Catégories réelles de la base de données
const REAL_CATEGORY_COLORS: Record<string, string> = {
  technique: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
  concept_perfumum: "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800",
  "matière_première": "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
  concept: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
  caractère_olfactif: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
  composition: "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800",
  classification: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800",
  "méthode": "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  outil: "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800",
};

const REAL_CATEGORY_LABELS: Record<string, string> = {
  technique: "Technique",
  concept_perfumum: "Concept PERFUMUM",
  "matière_première": "Matière première",
  concept: "Concept",
  caractère_olfactif: "Caractère olfactif",
  composition: "Composition",
  classification: "Classification",
  "méthode": "Méthode",
  outil: "Outil",
};

const ALPHABET_LETTERS = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

export function Glossaire() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { data: allTerms = [], isLoading } = trpc.glossary.list.useQuery();

  // Categories for filter — aligned with actual DB values
  const categories = [
    { value: "all", label: "Toutes les catégories" },
    { value: "technique", label: "Technique" },
    { value: "concept_perfumum", label: "Concept PERFUMUM" },
    { value: "matière_première", label: "Matière première" },
    { value: "concept", label: "Concept" },
    { value: "caractère_olfactif", label: "Caractère olfactif" },
    { value: "composition", label: "Composition" },
    { value: "classification", label: "Classification" },
    { value: "méthode", label: "Méthode" },
    { value: "outil", label: "Outil" },
  ];

  // Filter terms
  const filteredTerms = useMemo(() => {
    let terms = [...allTerms];

    // Filter by category
    if (selectedCategory !== "all") {
      terms = terms.filter((term) => term.category === selectedCategory);
    }

    // Filter by letter
    if (selectedLetter) {
      terms = terms.filter((term) => {
        const l = term.term.charAt(0).toUpperCase();
        return l === selectedLetter;
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      terms = terms.filter(
        (term) =>
          term.term.toLowerCase().includes(query) ||
          term.definition?.toLowerCase().includes(query)
      );
    }

    return terms.sort((a, b) => a.term.localeCompare(b.term, "fr"));
  }, [allTerms, selectedCategory, selectedLetter, searchQuery]);

  // Group by letter
  const groupedByLetter = useMemo(() => {
    const groups: Record<string, typeof filteredTerms> = {};
    filteredTerms.forEach((t) => {
      const letter = t.term.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(t);
    });
    return groups;
  }, [filteredTerms]);

  const lettersInResults = Object.keys(groupedByLetter).sort();

  // Letters present in ALL terms (for nav)
  const lettersInAll = useMemo(() => {
    const s = new Set<string>();
    allTerms?.forEach((t) => s.add(t.term.charAt(0).toUpperCase()));
    return s;
  }, [allTerms]);

  const scrollToLetter = (letter: string) => {
    if (selectedLetter === letter) {
      setSelectedLetter(null);
    } else {
      setSelectedLetter(letter);
    }
  };

  // Calculate stats by category
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    allTerms?.forEach((term) => {
      stats[term.category] = (stats[term.category] || 0) + 1;
    });
    return stats;
  }, [allTerms]);

  const getCategoryColor = (category: string) =>
    REAL_CATEGORY_COLORS[category] || "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300";

  const getCategoryLabel = (category: string) =>
    REAL_CATEGORY_LABELS[category] || category;

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      technique: <FlaskConical className="w-4 h-4" />,
      concept_perfumum: <Sparkles className="w-4 h-4" />,
      concept: <BookMarked className="w-4 h-4" />,
      "méthode": <Layers className="w-4 h-4" />,
    };
    return icons[category] || null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Breadcrumbs />
        <Header />
        <main className="flex-1 container py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 border-b border-border/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
                <BookOpen className="w-4 h-4 mr-2" />
                Terminologie
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                Glossaire
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                Terminologie technique et concepts olfactifs du projet PERFUMUM. 
                Une référence complète pour comprendre le vocabulaire de la recherche olfactive.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="text-2xl font-bold text-foreground">{allTerms?.length}</div>
                  <div className="text-xs text-muted-foreground">Termes définis</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="text-2xl font-bold text-foreground">{Object.keys(categoryStats).length}</div>
                  <div className="text-xs text-muted-foreground">Catégories</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="text-2xl font-bold text-foreground">{categoryStats.technique || 0}</div>
                  <div className="text-xs text-muted-foreground">Techniques</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="text-2xl font-bold text-foreground">{categoryStats.concept_perfumum || 0}</div>
                  <div className="text-xs text-muted-foreground">Concepts PERFUMUM</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container py-8">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row gap-4 mb-6"
          >
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Rechercher un terme..."
              />
            </div>
            <div className="w-full md:w-64 flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <FilterSelect
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={categories.slice(1)}
                placeholder="Catégorie"
              />
            </div>
            {(searchQuery || selectedCategory !== "all" || selectedLetter) && (
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setSelectedLetter(null); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" /> Effacer
              </button>
            )}
          </motion.div>

          {/* Navigation alphabétique */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mb-8 flex flex-wrap gap-1.5"
          >
            {ALPHABET_LETTERS.map((letter) => {
              const inAll = lettersInAll.has(letter);
              const inResults = lettersInResults.includes(letter);
              return (
                <button
                  key={letter}
                  onClick={() => inAll && scrollToLetter(letter)}
                  disabled={!inAll}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all
                    ${selectedLetter === letter
                      ? "bg-primary text-primary-foreground shadow-md"
                      : inAll
                        ? "bg-muted hover:bg-primary/10 hover:text-primary"
                        : "text-muted-foreground/30 cursor-not-allowed"
                    }`}
                >
                  {letter}
                </button>
              );
            })}
            {selectedLetter && (
              <button
                onClick={() => setSelectedLetter(null)}
                className="px-3 h-9 rounded-lg text-sm bg-muted hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-600 transition-all"
              >
                ✕ Tout
              </button>
            )}
          </motion.div>

          {/* Results count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 flex items-center justify-between"
          >
            <span className="text-sm text-muted-foreground">
              {filteredTerms.length} {filteredTerms.length === 1 ? "terme trouvé" : "termes trouvés"}
            </span>
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory("all")}>
                {getCategoryLabel(selectedCategory)} ✕
              </Badge>
            )}
          </motion.div>

          {/* Terms list — grouped by letter */}
          {filteredTerms.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucun terme trouvé</p>
                <p className="text-sm mt-2">Essayez de modifier vos critères de recherche</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-10">
              {lettersInResults.map((letter) => (
                <section
                  key={letter}
                  ref={(el) => { letterRefs.current[letter] = el as HTMLDivElement | null; }}
                >
                  {/* Séparateur alphabétique */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold shadow-sm">
                      {letter}
                    </div>
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs text-muted-foreground">
                      {groupedByLetter[letter].length} terme{groupedByLetter[letter].length > 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Grille */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {groupedByLetter[letter].map((term, index) => (
                      <motion.div
                        key={term.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Card className="h-full hover:shadow-lg transition-all duration-300 border hover:border-primary/30 group">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <CardTitle className="text-xl mb-2 flex items-center gap-2 group-hover:text-primary transition-colors">
                                  {getCategoryIcon(term.category)}
                                  {term.term}
                                </CardTitle>
                                <Badge
                                  variant="outline"
                                  className={getCategoryColor(term.category)}
                                >
                                  {getCategoryLabel(term.category)}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide mb-2">
                                Définition
                              </h3>
                              <p className="text-foreground leading-relaxed">{term.definition}</p>
                            </div>
                            {term.context && (
                              <p className="text-xs text-muted-foreground italic border-l-2 border-primary/20 pl-2">
                                {term.context}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {/* Navigation vers pages connexes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 p-6 bg-muted/30 rounded-lg"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Pages connexes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/molecules" className="block p-4 bg-background rounded-lg border hover:border-indigo-500/50 transition-colors">
                <div className="font-medium">Molécules</div>
                <div className="text-sm text-muted-foreground">Explorer les 448 molécules documentées</div>
              </a>
              <a href="/methodologie/absorbe" className="block p-4 bg-background rounded-lg border hover:border-indigo-500/50 transition-colors">
                <div className="font-medium">Méthode ABSORBE</div>
                <div className="text-sm text-muted-foreground">Comprendre la méthodologie de recherche</div>
              </a>
              <a href="/recherche-avancee" className="block p-4 bg-background rounded-lg border hover:border-indigo-500/50 transition-colors">
                <div className="font-medium">Recherche avancée</div>
                <div className="text-sm text-muted-foreground">Rechercher dans toute la base de données</div>
              </a>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
