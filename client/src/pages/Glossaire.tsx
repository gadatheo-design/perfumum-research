import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { trpc } from "../lib/trpc";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "../components/filters/SearchBar";
import { FilterSelect } from "../components/filters/FilterSelect";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { BookOpen, Filter, Sparkles, BookMarked, Layers, FlaskConical } from "lucide-react";

export function Glossaire() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: allTerms = [], isLoading } = trpc.glossary.list.useQuery();

  // Categories for filter
  const categories = [
    { value: "all", label: "Toutes les catégories" },
    { value: "chimie", label: "Chimie" },
    { value: "interaction", label: "Interactions" },
    { value: "reaction", label: "Réactions" },
    { value: "extraction", label: "Extraction" },
    { value: "technique", label: "Techniques" },
    { value: "molecule", label: "Molécules" },
    { value: "concept", label: "Concepts" },
    { value: "propriete", label: "Propriétés" },
    { value: "methodologie", label: "Méthodologie" },
    { value: "formulation", label: "Formulation" },
  ];

  // Filter terms
  const filteredTerms = useMemo(() => {
    let terms = allTerms;

    // Filter by category
    if (selectedCategory !== "all") {
      terms = terms.filter((term) => term.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      terms = terms.filter(
        (term) =>
          term.term.toLowerCase().includes(query) ||
          term.definition.toLowerCase().includes(query) ||
          term.examples?.toLowerCase().includes(query)
      );
    }

    return terms;
  }, [allTerms, selectedCategory, searchQuery]);

  // Calculate stats by category
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    allTerms.forEach((term) => {
      stats[term.category] = (stats[term.category] || 0) + 1;
    });
    return stats;
  }, [allTerms]);

  // Category colors
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      chimie: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
      interaction: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
      reaction: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
      extraction: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
      technique: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
      molecule: "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800",
      concept: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
      propriete: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800",
      methodologie: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
      formulation: "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300";
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      chimie: "Chimie",
      interaction: "Interaction",
      reaction: "Réaction",
      extraction: "Extraction",
      technique: "Technique",
      molecule: "Molécule",
      concept: "Concept",
      propriete: "Propriété",
      methodologie: "Méthodologie",
      formulation: "Formulation",
    };
    return labels[category] || category;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      chimie: <FlaskConical className="w-4 h-4" />,
      molecule: <Sparkles className="w-4 h-4" />,
      concept: <BookMarked className="w-4 h-4" />,
      methodologie: <Layers className="w-4 h-4" />,
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-indigo-50/30 dark:to-indigo-950/10">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white py-16"
        >
          <div className="container">
            <div className="flex items-center gap-4 mb-4">
              <BookOpen className="w-12 h-12" />
              <h1 className="text-5xl font-bold">Glossaire</h1>
            </div>
            <p className="text-xl text-indigo-100 max-w-3xl mb-8">
              Terminologie technique et concepts olfactifs du projet PERFUMUM. 
              Une référence complète pour comprendre le vocabulaire de la recherche olfactive.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">{allTerms.length}</div>
                <div className="text-indigo-200 text-sm">Termes définis</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">{Object.keys(categoryStats).length}</div>
                <div className="text-indigo-200 text-sm">Catégories</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">{categoryStats.chimie || 0}</div>
                <div className="text-indigo-200 text-sm">Termes chimiques</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">{categoryStats.molecule || 0}</div>
                <div className="text-indigo-200 text-sm">Molécules</div>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="container py-8">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
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

          {/* Terms list */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTerms.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun terme trouvé</p>
                  <p className="text-sm mt-2">Essayez de modifier vos critères de recherche</p>
                </CardContent>
              </Card>
            ) : (
              filteredTerms.map((term, index) => (
                <motion.div
                  key={term.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-indigo-500/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2 flex items-center gap-2">
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

                      {term.examples && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide mb-2">
                            Exemples
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{term.examples}</p>
                        </div>
                      )}

                      {term.context && (
                        <div className="border-l-2 border-indigo-500/30 pl-3">
                          <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide mb-1">
                            Contexte
                          </h3>
                          <p className="text-sm text-muted-foreground italic">{term.context}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

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
