import React, { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { DescriptorOccurrences } from "@/components/DescriptorOccurrences";

export function OlfactoryDescriptors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [limit] = useState(100);
  const [offset, setOffset] = useState(0);
  const [expandedDescriptor, setExpandedDescriptor] = useState<string | null>(null);

  // Récupérer les descripteurs
  const { data: descriptors, isLoading, error } = trpc.predO3.getDescriptors.useQuery(
    { limit, offset, category: selectedCategory || undefined },
    { staleTime: 1000 * 60 * 5 } // Cache 5 minutes
  );

  // Récupérer les statistiques
  const { data: stats } = trpc.predO3.getStats.useQuery(
    {},
    { staleTime: 1000 * 60 * 5 }
  );

  // Filtrer par terme de recherche
  const filteredDescriptors = useMemo(() => {
    if (!descriptors) return [];
    if (!searchTerm) return descriptors;

    const term = searchTerm.toLowerCase();
    return descriptors.filter(
      (desc: any) =>
        desc.name?.toLowerCase().includes(term) ||
        desc.description?.toLowerCase().includes(term) ||
        desc.id?.toLowerCase().includes(term)
    );
  }, [descriptors, searchTerm]);

  // Extraire les catégories uniques
  const categories = useMemo(() => {
    if (!descriptors) return [];
    const cats = new Set(descriptors.map((d: any) => d.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [descriptors]);

  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
    setOffset(0);
  };

  const toggleExpanded = (descriptorId: string) => {
    setExpandedDescriptor(expandedDescriptor === descriptorId ? null : descriptorId);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold">Descripteurs Olfactifs Pred-O3</h1>
        <p className="text-gray-600 mt-2">
          Explorez les {stats?.total || 0} descripteurs olfactifs importés de Pred-O3
        </p>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Descripteurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Catégories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.categories}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Fréquence Max</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.maxFrequency}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Fréquence Totale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(stats.totalFrequency / 1000).toFixed(1)}k</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtres</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par nom, description ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtres par catégorie */}
          <div>
            <label className="text-sm font-medium mb-2 block">Catégories</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter(null)}
              >
                Tous
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryFilter(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des descripteurs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Descripteurs ({filteredDescriptors.length})
          </CardTitle>
          <CardDescription>
            {selectedCategory && `Filtrés par: ${selectedCategory}`}
            {searchTerm && ` • Recherche: "${searchTerm}"`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span>Erreur lors du chargement des descripteurs</span>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Chargement...</span>
            </div>
          ) : filteredDescriptors.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p>Aucun descripteur trouvé</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDescriptors.map((descriptor: any) => (
                <div key={descriptor.id} className="border rounded-lg overflow-hidden">
                  {/* En-tête du descripteur */}
                  <button
                    onClick={() => toggleExpanded(descriptor.id)}
                    className="w-full flex items-start justify-between p-4 hover:bg-gray-50 transition text-left"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{descriptor.name}</h3>
                        {descriptor.category && (
                          <Badge variant="secondary" className="text-xs">
                            {descriptor.category}
                          </Badge>
                        )}
                      </div>
                      {descriptor.description && (
                        <p className="text-sm text-gray-600 mb-2">{descriptor.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>ID: {descriptor.id}</span>
                        {descriptor.frequency && (
                          <span>Fréquence: {descriptor.frequency}</span>
                        )}
                        {descriptor.source && (
                          <span>Source: {descriptor.source}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      {descriptor.frequency && (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {descriptor.frequency}
                          </div>
                          <div className="text-xs text-gray-500">occurrences</div>
                        </div>
                      )}
                      {expandedDescriptor === descriptor.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Contenu expansible */}
                  {expandedDescriptor === descriptor.id && (
                    <div className="border-t bg-gray-50 p-4">
                      <DescriptorOccurrences
                        descriptorId={descriptor.id}
                        descriptorName={descriptor.name}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {filteredDescriptors.length > 0 && (
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
          >
            Précédent
          </Button>
          <span className="text-sm text-gray-600">
            Affichage {offset + 1} à {Math.min(offset + limit, stats?.total || 0)} sur{" "}
            {stats?.total || 0}
          </span>
          <Button
            variant="outline"
            onClick={() => setOffset(offset + limit)}
            disabled={offset + limit >= (stats?.total || 0)}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
}
