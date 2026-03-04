// @ts-nocheck
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Beaker, Plus, Search, Filter, Calculator, FileText, Clock, DollarSign } from "lucide-react";
import { DosageCalculator } from "@/components/DosageCalculator";

export default function LaboratoireRecettes() {
  const [activeTab, setActiveTab] = useState<"recettes" | "calculator">("recettes");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const { data: recettes, isLoading } = trpc.recettes.list.useQuery({});

  const filteredRecettes = useMemo(() => {
    if (!recettes) return [];
    
    return recettes.filter((recette) => {
      const matchesSearch = recette.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || recette.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || recette.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [recettes, searchQuery, statusFilter, categoryFilter]);

  const stats = useMemo(() => {
    if (!recettes) return { total: 0, experimental: 0, testing: 0, validated: 0, production: 0 };
    
    return {
      total: recettes.length,
      experimental: recettes.filter(r => r.status === "experimental").length,
      testing: recettes.filter(r => r.status === "testing").length,
      validated: recettes.filter(r => r.status === "validated").length,
      production: recettes.filter(r => r.status === "production").length,
    };
  }, [recettes]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "experimental": return "bg-purple-100 text-purple-800 border-purple-200";
      case "testing": return "bg-blue-100 text-blue-800 border-blue-200";
      case "validated": return "bg-green-100 text-green-800 border-green-200";
      case "production": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "experimental": return "Expérimental";
      case "testing": return "En test";
      case "validated": return "Validé";
      case "production": return "Production";
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Beaker className="w-12 h-12 mx-auto mb-4 text-purple-600 animate-pulse" />
          <p className="text-stone-600">Chargement du laboratoire R&D...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <Breadcrumbs />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Beaker className="w-12 h-12" />
            <h1 className="text-5xl font-bold">R&D RECETTES</h1>
          </div>
          <p className="text-xl text-purple-100 max-w-3xl">
            Espace de recherche et développement pour la création, le test et la validation de recettes olfactives.
            Versioning, notes de dégustation, calculs automatiques et export professionnel.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container max-w-7xl mx-auto px-4 -mt-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-6 bg-white shadow-lg border-t-4 border-purple-500">
            <div className="text-3xl font-bold text-purple-900">{stats.total}</div>
            <div className="text-sm text-stone-600 mt-1">Total recettes</div>
          </Card>
          <Card className="p-6 bg-white shadow-lg border-t-4 border-purple-400">
            <div className="text-3xl font-bold text-purple-700">{stats.experimental}</div>
            <div className="text-sm text-stone-600 mt-1">Expérimental</div>
          </Card>
          <Card className="p-6 bg-white shadow-lg border-t-4 border-blue-400">
            <div className="text-3xl font-bold text-blue-700">{stats.testing}</div>
            <div className="text-sm text-stone-600 mt-1">En test</div>
          </Card>
          <Card className="p-6 bg-white shadow-lg border-t-4 border-green-400">
            <div className="text-3xl font-bold text-green-700">{stats.validated}</div>
            <div className="text-sm text-stone-600 mt-1">Validé</div>
          </Card>
          <Card className="p-6 bg-white shadow-lg border-t-4 border-amber-400">
            <div className="text-3xl font-bold text-amber-700">{stats.production}</div>
            <div className="text-sm text-stone-600 mt-1">Production</div>
          </Card>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="container max-w-7xl mx-auto px-4 mb-8">
        <div className="flex gap-2 border-b border-stone-200">
          <button
            onClick={() => setActiveTab("recettes")}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === "recettes"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-stone-600 hover:text-purple-600"
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Liste des recettes
          </button>
          <button
            onClick={() => setActiveTab("calculator")}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === "calculator"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-stone-600 hover:text-purple-600"
            }`}
          >
            <Calculator className="w-4 h-4 inline mr-2" />
            Calculateur de dosages
          </button>
        </div>
      </div>

      {/* Filters and Actions */}
      {activeTab === "recettes" && (
      <div className="container max-w-7xl mx-auto px-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 items-center w-full md:w-auto flex-wrap">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <Input
                type="text"
                placeholder="Rechercher une recette..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="experimental">Expérimental</SelectItem>
                <SelectItem value="testing">En test</SelectItem>
                <SelectItem value="validated">Validé</SelectItem>
                <SelectItem value="production">Production</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                <SelectItem value="tabac">Tabac</SelectItem>
                <SelectItem value="resine">Résine</SelectItem>
                <SelectItem value="cone">Cône</SelectItem>
                <SelectItem value="parfum">Parfum</SelectItem>
                <SelectItem value="encens">Encens</SelectItem>
                <SelectItem value="extrait">Extrait</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle recette
            </Button>
            <Button variant="outline">
              <Calculator className="w-4 h-4 mr-2" />
              Calculateur
            </Button>
          </div>
        </div>

        <div className="mt-4 text-sm text-stone-600">
          {filteredRecettes.length} recette{filteredRecettes.length > 1 ? "s" : ""} trouvée{filteredRecettes.length > 1 ? "s" : ""}
        </div>
      </div>

      )}

      {/* Calculator Tab */}
      {activeTab === "calculator" && (
        <div className="container max-w-7xl mx-auto px-4 pb-16">
          <DosageCalculator />
        </div>
      )}

      {/* Recettes Grid */}
      {activeTab === "recettes" && (
      <div className="container max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecettes.map((recette) => (
            <Card key={recette.id} className="p-6 hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-stone-900 group-hover:text-purple-700 transition-colors">
                    {recette.name}
                  </h3>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {recette.category}
                    </Badge>
                    {recette.status && (
                      <Badge className={`text-xs ${getStatusColor(recette.status)}`}>
                        {getStatusLabel(recette.status)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {recette.description && (
                <p className="text-sm text-stone-600 mb-4 line-clamp-2">
                  {recette.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs text-stone-500 border-t pt-4">
                {recette.intensity && (
                  <div className="flex items-center gap-2">
                    <Beaker className="w-3 h-3" />
                    <span><span className="font-medium">Intensité:</span> {recette.intensity}/10</span>
                  </div>
                )}
                {recette.maturationTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span><span className="font-medium">Maturation:</span> {recette.maturationTime}j</span>
                  </div>
                )}
                {recette.productionTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span><span className="font-medium">Production:</span> {recette.productionTime}min</span>
                  </div>
                )}
                {recette.costEstimate && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3 h-3" />
                    <span><span className="font-medium">Coût:</span> {(recette.costEstimate / 100).toFixed(2)} CHF</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <FileText className="w-3 h-3 mr-1" />
                  Détails
                </Button>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Éditer
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredRecettes.length === 0 && (
          <div className="text-center py-16">
            <Beaker className="w-16 h-16 mx-auto mb-4 text-stone-300" />
            <p className="text-stone-500 text-lg">Aucune recette trouvée</p>
            <p className="text-stone-400 text-sm mt-2">
              Essayez de modifier vos filtres ou créez une nouvelle recette
            </p>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
