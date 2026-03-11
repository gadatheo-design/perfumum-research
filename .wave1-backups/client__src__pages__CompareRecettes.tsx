// @ts-nocheck
import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { SVGCompareRadarChart, type CompareRadarProfile } from "@/components/SVGRadarChart";
import { Activity, X, Search, FlaskConical } from "lucide-react";

// Couleurs pour les différentes recettes
const COLORS = [
  "#8b5cf6", // violet
  "#10b981", // vert
  "#f97316", // orange
  "#3b82f6", // bleu
];

export default function CompareRecettes() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGamme, setSelectedGamme] = useState<string | null>(null);
  
  // Charger toutes les recettes
  const { data: allRecettes, isLoading } = trpc.recettes.list.useQuery();
  
  // Charger les molécules avec leurs profils radar
  const { data: allMolecules } = trpc.molecules.list.useQuery();
  
  // Charger les associations recettes-molécules pour les recettes sélectionnées
  const { data: recettesWithMolecules } = trpc.recettes.getWithMoleculesForCompare.useQuery(
    { recetteIds: selectedIds },
    { enabled: selectedIds.length > 0 }
  );
  
  // Filtrer les recettes
  const filteredRecettes = useMemo(() => {
    if (!allRecettes) return [];
    
    return allRecettes.filter(r => {
      const matchesSearch = !searchTerm || 
        r.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGamme = true; // Champ gamme supprimé du schéma
      return matchesSearch && matchesGamme;
    });
  }, [allRecettes, searchTerm, selectedGamme]);
  
  // Obtenir les gammes uniques
  const gammes = useMemo(() => {
    return []; // Champ gamme supprimé du schéma
  }, []);
  
  const selectedRecettes = allRecettes?.filter(r => selectedIds.includes(r.id)) || [];
  
  const toggleSelection = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else if (selectedIds.length < 4) {
      setSelectedIds([...selectedIds, id]);
    }
  };
  
  const clearSelection = () => setSelectedIds([]);
  
  // Calculer les profils radar pour chaque recette sélectionnée
  const radarProfiles: CompareRadarProfile[] = useMemo(() => {
    if (!recettesWithMolecules || !allMolecules || selectedRecettes.length === 0) return [];
    
    return selectedRecettes.map((recette, idx) => {
      // Trouver les molécules associées à cette recette
      const recetteWithMolecules = recettesWithMolecules.find(r => r.recette.id === recette.id);
      const associations = recetteWithMolecules?.molecules || [];
      
      // Calculer le profil moyen pondéré
      let totalWeight = 0;
      let intensity = 0, freshness = 0, warmth = 0, sweetness = 0, spiciness = 0, earthiness = 0;
      
      associations.forEach(assoc => {
        const molecule = assoc.molecule;
        if (molecule) {
          const weight = Number(assoc.proportion) || 1;
          totalWeight += weight;
          intensity += (Number(molecule.radarIntensity) || 50) * weight;
          freshness += (Number(molecule.radarFreshness) || 50) * weight;
          warmth += (Number(molecule.radarWarmth) || 50) * weight;
          sweetness += (Number(molecule.radarSweetness) || 50) * weight;
          spiciness += (Number(molecule.radarSpiciness) || 50) * weight;
          earthiness += (Number(molecule.radarEarthiness) || 50) * weight;
        }
      });
      
      // Normaliser
      if (totalWeight > 0) {
        intensity /= totalWeight;
        freshness /= totalWeight;
        warmth /= totalWeight;
        sweetness /= totalWeight;
        spiciness /= totalWeight;
        earthiness /= totalWeight;
      } else {
        // Valeurs par défaut si pas de molécules
        intensity = freshness = warmth = sweetness = spiciness = earthiness = 50;
      }
      
      return {
        name: recette.name,
        color: COLORS[idx % COLORS.length],
        data: [
          { label: "Intensité", value: Math.round(intensity) },
          { label: "Fraîcheur", value: Math.round(freshness) },
          { label: "Chaleur", value: Math.round(warmth) },
          { label: "Douceur", value: Math.round(sweetness) },
          { label: "Épicé", value: Math.round(spiciness) },
          { label: "Terreux", value: Math.round(earthiness) },
        ],
      };
    });
  }, [selectedRecettes, recettesWithMolecules, allMolecules]);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1 container mx-auto py-8 space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Comparaison des Recettes</h1>
          <p className="text-muted-foreground">
            Superposez jusqu'à 4 profils olfactifs pour comparer les recettes
          </p>
        </div>
        
        {/* Sélection des recettes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5" />
                Sélectionner les recettes à comparer
              </CardTitle>
              {selectedIds.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  <X className="w-4 h-4 mr-2" />
                  Effacer ({selectedIds.length})
                </Button>
              )}
            </div>
            
            {/* Filtres */}
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une recette..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedGamme === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGamme(null)}
                >
                  Toutes
                </Button>
                {gammes.map((gamme) => (
                  <Button
                    key={gamme}
                    variant={selectedGamme === gamme ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedGamme(gamme)}
                  >
                    {gamme}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Chargement...</p>
            ) : filteredRecettes.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Aucune recette trouvée
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-1">
                {filteredRecettes.slice(0, 50).map((r) => {
                  const isSelected = selectedIds.includes(r.id);
                  const isDisabled = !isSelected && selectedIds.length >= 4;
                  
                  return (
                    <button
                      key={r.id}
                      onClick={() => toggleSelection(r.id)}
                      disabled={isDisabled}
                      className={`
                        p-4 rounded-lg border-2 transition-all text-left
                        ${isSelected 
                          ? 'border-primary bg-primary/10 shadow-md' 
                          : isDisabled
                          ? 'border-border bg-muted/30 opacity-50 cursor-not-allowed'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }
                      `}
                    >
                      <p className="font-semibold line-clamp-1">{r.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {r.category && (
                          <Badge variant="outline" className="text-xs">
                            {r.category}
                          </Badge>
                        )}
                        {r.status && (
                          <Badge variant="secondary" className="text-xs">
                            {r.status}
                          </Badge>
                        )}
                      </div>
                      {isSelected && (
                        <Badge 
                          className="mt-2"
                          style={{ backgroundColor: COLORS[selectedIds.indexOf(r.id) % COLORS.length] }}
                        >
                          Sélectionné
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            {filteredRecettes.length > 50 && (
              <p className="text-center text-muted-foreground text-sm mt-4">
                Affichage limité à 50 recettes. Utilisez la recherche pour affiner.
              </p>
            )}
          </CardContent>
        </Card>
        
        {/* Graphe radar comparatif */}
        {selectedRecettes.length > 0 && radarProfiles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Comparaison des Profils Olfactifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                {/* Graphique radar */}
                <div className="flex-shrink-0">
                  <SVGCompareRadarChart
                    profiles={radarProfiles}
                    size={400}
                    showLabels={true}
                    maxValue={100}
                  />
                </div>
                
                {/* Légende */}
                <div className="flex-1 space-y-4">
                  <h3 className="font-semibold text-lg">Légende</h3>
                  <div className="space-y-3">
                    {radarProfiles.map((profile, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: profile.color }}
                        />
                        <span className="font-medium">{profile.name}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Tableau comparatif */}
                  <div className="mt-6 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                    <table className="w-full text-sm min-w-[600px]">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 font-semibold">Propriété</th>
                          {radarProfiles.map((p, idx) => (
                            <th key={idx} className="text-center py-2 px-3 font-semibold">
                              <span 
                                className="inline-block w-3 h-3 rounded-full mr-1"
                                style={{ backgroundColor: p.color }}
                              />
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {radarProfiles[0]?.data.map((_, propIdx) => {
                          const propLabel = radarProfiles[0].data[propIdx].label;
                          const values = radarProfiles.map(p => p.data[propIdx].value);
                          const maxValue = Math.max(...values);
                          
                          return (
                            <tr key={propIdx} className="border-b hover:bg-muted/50">
                              <td className="py-2 px-3 font-medium">{propLabel}</td>
                              {values.map((value, idx) => (
                                <td key={idx} className="text-center py-2 px-3">
                                  <span className={value === maxValue && maxValue > 50 ? 'font-bold text-primary' : ''}>
                                    {value}
                                  </span>
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              {/* Analyse comparative */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Analyse comparative</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Les valeurs en <span className="text-primary font-semibold">gras</span> indiquent les scores maximaux pour chaque propriété</li>
                  <li>• Le profil radar est calculé à partir des molécules associées à chaque recette</li>
                  <li>• Les recettes avec des profils similaires partagent des caractéristiques olfactives communes</li>
                  <li>• Les contrastes marqués peuvent révéler des approches créatives différentes</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
        
        {selectedRecettes.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Activity className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Sélectionnez au moins une recette pour commencer la comparaison</p>
            </CardContent>
          </Card>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
