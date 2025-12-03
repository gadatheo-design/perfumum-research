import { useState, useMemo } from "react";
import { trpc } from "../lib/trpc";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SearchBar } from "../components/filters/SearchBar";
import { FilterSelect } from "../components/filters/FilterSelect";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

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

  // Category colors
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      chimie: "bg-purple-100 text-purple-800 border-purple-200",
      interaction: "bg-blue-100 text-blue-800 border-blue-200",
      reaction: "bg-red-100 text-red-800 border-red-200",
      extraction: "bg-green-100 text-green-800 border-green-200",
      technique: "bg-yellow-100 text-yellow-800 border-yellow-200",
      molecule: "bg-pink-100 text-pink-800 border-pink-200",
      concept: "bg-indigo-100 text-indigo-800 border-indigo-200",
      propriete: "bg-teal-100 text-teal-800 border-teal-200",
      methodologie: "bg-orange-100 text-orange-800 border-orange-200",
      formulation: "bg-cyan-100 text-cyan-800 border-cyan-200",
    };
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
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

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Breadcrumbs />
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Glossaire</h1>
        <p className="text-lg text-gray-600">
          Terminologie technique et concepts olfactifs du projet PERFUMUM
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Rechercher un terme..."
          />
        </div>
        <div className="w-full md:w-64">
          <FilterSelect
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={categories.slice(1)}
            placeholder="Catégorie"
          />
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6 text-sm text-gray-600">
        {filteredTerms.length} {filteredTerms.length === 1 ? "terme" : "termes"}
      </div>

      {/* Terms list */}
      <div className="space-y-4">
        {filteredTerms.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              Aucun terme trouvé
            </CardContent>
          </Card>
        ) : (
          filteredTerms.map((term) => (
            <Card key={term.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{term.term}</CardTitle>
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
                  <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">
                    Définition
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{term.definition}</p>
                </div>

                {term.examples && (
                  <div>
                    <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">
                      Exemples
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{term.examples}</p>
                  </div>
                )}

                {term.context && (
                  <div>
                    <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">
                      Contexte
                    </h3>
                    <p className="text-gray-600 text-sm italic">{term.context}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
