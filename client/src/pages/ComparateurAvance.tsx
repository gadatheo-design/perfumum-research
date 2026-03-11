import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { 
  GitCompare, 
  X, 
  Search, 
  FlaskConical, 
  Beaker,
  Plus,
  Check
} from "lucide-react";

type EntityType = "molecule" | "recette";

interface SelectedEntity {
  id: number;
  name: string;
  type: EntityType;
  data: Record<string, unknown>;
}

const ENTITY_COLORS = [
  "rgb(139, 92, 246)",
  "rgb(34, 197, 94)",
  "rgb(249, 115, 22)",
  "rgb(59, 130, 246)",
];

export default function ComparateurAvance() {
  const [activeTab, setActiveTab] = useState<EntityType>("molecule");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntities, setSelectedEntities] = useState<SelectedEntity[]>([]);
  
  const { data: molecules, isLoading: loadingMolecules } = trpc.molecules.list.useQuery();
  const { data: recettes, isLoading: loadingRecettes } = trpc.recettes.list.useQuery();
  
  const filteredMolecules = useMemo(() => {
    if (!molecules) return [];
    if (!searchQuery) return molecules.slice(0, 20);
    return molecules
      .filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.family && m.family.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .slice(0, 20);
  }, [molecules, searchQuery]);
  
  const filteredRecettes = useMemo(() => {
    if (!recettes) return [];
    if (!searchQuery) return recettes.slice(0, 20);
    return recettes
      .filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.category && r.category.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .slice(0, 20);
  }, [recettes, searchQuery]);
  
  const isSelected = (id: number, type: EntityType) => {
    return selectedEntities.some(e => e.id === id && e.type === type);
  };
  
  const addEntity = (entity: Record<string, unknown>, type: EntityType) => {
    if (selectedEntities.length >= 4) return;
    if (isSelected(entity.id as number, type)) return;
    
    setSelectedEntities([...selectedEntities, {
      id: entity.id as number,
      name: entity.name as string,
      type,
      data: entity
    }]);
  };
  
  const removeEntity = (id: number, type: EntityType) => {
    setSelectedEntities(selectedEntities.filter(e => !(e.id === id && e.type === type)));
  };
  
  const clearSelection = () => {
    setSelectedEntities([]);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        {/* Header Section */}
        <section className="py-12 bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <GitCompare className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Comparateur Avancé
                  </h1>
                  <p className="text-lg text-muted-foreground mt-2">
                    Comparez jusqu'à 4 molécules ou recettes côte à côte
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Selection Section */}
        <section className="py-8 border-b border-border">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              {/* Selected Entities */}
              {selectedEntities.length > 0 && (
                <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">
                      {selectedEntities.length}/4 éléments sélectionnés
                    </span>
                    <Button variant="ghost" size="sm" onClick={clearSelection}>
                      <X className="h-4 w-4 mr-1" />
                      Tout effacer
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedEntities.map((entity, index) => (
                      <Badge 
                        key={`${entity.type}-${entity.id}`}
                        variant="secondary"
                        className="px-3 py-1.5 flex items-center gap-2"
                        style={{ 
                          borderColor: ENTITY_COLORS[index % ENTITY_COLORS.length],
                          borderWidth: 2
                        }}
                      >
                        {entity.type === "molecule" ? (
                          <FlaskConical className="h-3 w-3" />
                        ) : (
                          <Beaker className="h-3 w-3" />
                        )}
                        {entity.name}
                        <button 
                          onClick={() => removeEntity(entity.id, entity.type)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Search and Tabs */}
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une molécule ou une recette..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as EntityType)}>
                  <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="molecule" className="flex items-center gap-2">
                      <FlaskConical className="h-4 w-4" />
                      Molécules ({molecules?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="recette" className="flex items-center gap-2">
                      <Beaker className="h-4 w-4" />
                      Recettes ({recettes?.length || 0})
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="molecule" className="mt-4">
                    {loadingMolecules ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Chargement des molécules...
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {filteredMolecules.map(molecule => {
                          const selected = isSelected(molecule.id, "molecule");
                          return (
                            <Card 
                              key={molecule.id}
                              className={`cursor-pointer transition-all hover:shadow-md ${
                                selected ? "ring-2 ring-primary bg-primary/5" : ""
                              } ${selectedEntities.length >= 4 && !selected ? "opacity-50" : ""}`}
                              onClick={() => selected ? removeEntity(molecule.id, "molecule") : addEntity(molecule as unknown as Record<string, unknown>, "molecule")}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium truncate">{molecule.name}</h4>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {molecule.family || "Non classée"}
                                    </p>
                                  </div>
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                    selected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground"
                                  }`}>
                                    {selected && <Check className="h-4 w-4" />}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="recette" className="mt-4">
                    {loadingRecettes ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Chargement des recettes...
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {filteredRecettes.map(recette => {
                          const selected = isSelected(recette.id, "recette");
                          return (
                            <Card 
                              key={recette.id}
                              className={`cursor-pointer transition-all hover:shadow-md ${
                                selected ? "ring-2 ring-primary bg-primary/5" : ""
                              } ${selectedEntities.length >= 4 && !selected ? "opacity-50" : ""}`}
                              onClick={() => selected ? removeEntity(recette.id, "recette") : addEntity(recette as unknown as Record<string, unknown>, "recette")}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium truncate">{recette.name}</h4>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {recette.category || "Non catégorisée"}
                                    </p>
                                  </div>
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                    selected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground"
                                  }`}>
                                    {selected && <Check className="h-4 w-4" />}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </section>
        
        {/* Comparison Section */}
        {selectedEntities.length >= 2 ? (
          <section className="py-12">
            <div className="container">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold mb-8">Comparaison</h2>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Tableau Comparatif</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium">Propriété</th>
                            {selectedEntities.map((entity, index) => (
                              <th 
                                key={`${entity.type}-${entity.id}`}
                                className="text-left py-3 px-4 font-medium"
                                style={{ color: ENTITY_COLORS[index % ENTITY_COLORS.length] }}
                              >
                                {entity.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-3 px-4 font-medium">Type</td>
                            {selectedEntities.map((entity) => (
                              <td key={`type-${entity.type}-${entity.id}`} className="py-3 px-4">
                                <Badge variant={entity.type === "molecule" ? "default" : "secondary"}>
                                  {entity.type === "molecule" ? "Molécule" : "Recette"}
                                </Badge>
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4 font-medium">Famille/Catégorie</td>
                            {selectedEntities.map((entity) => (
                              <td key={`family-${entity.type}-${entity.id}`} className="py-3 px-4">
                                {entity.type === "molecule" 
                                  ? (entity.data.family as string) || "Non classée"
                                  : (entity.data.category as string) || "Non catégorisée"
                                }
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4 font-medium">Description</td>
                            {selectedEntities.map((entity) => (
                              <td key={`desc-${entity.type}-${entity.id}`} className="py-3 px-4 text-sm text-muted-foreground">
                                {entity.type === "molecule" 
                                  ? (entity.data.olfactiveProfile as string) || (entity.data.description as string) || "-"
                                  : (entity.data.description as string) || "-"
                                }
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        ) : (
          <section className="py-16">
            <div className="container">
              <div className="max-w-md mx-auto text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                  <Plus className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Sélectionnez au moins 2 éléments
                </h3>
                <p className="text-muted-foreground">
                  Choisissez des molécules ou des recettes dans les onglets ci-dessus pour les comparer côte à côte.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
