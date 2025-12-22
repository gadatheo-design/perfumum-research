import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { RadarChart } from "@/components/RadarChart";
import { Activity, X, Download } from "lucide-react";

export default function CompareRadar() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  // Charger tous les terpènes avec profils radar
  const { data: allMolecules, isLoading } = trpc.molecules.list.useQuery();
  
  const terpenes = allMolecules?.filter(m => 
    m.family?.toLowerCase().includes('terpène') && 
    (m.radarIntensity || m.radarFreshness || m.radarWarmth)
  ) || [];
  
  const selectedTerpenes = terpenes.filter(t => selectedIds.includes(t.id));
  
  const toggleSelection = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else if (selectedIds.length < 4) {
      setSelectedIds([...selectedIds, id]);
    }
  };
  
  const clearSelection = () => setSelectedIds([]);
  
  const radarProfiles = selectedTerpenes.map((t, idx) => {
    const colors = [
      "rgba(139, 92, 246, 0.6)",  // violet
      "rgba(16, 185, 129, 0.6)",  // vert
      "rgba(251, 146, 60, 0.6)",  // orange
      "rgba(59, 130, 246, 0.6)",  // bleu
    ];
    
    return {
      label: t.name,
      intensity: t.radarIntensity || 50,
      freshness: t.radarFreshness || 50,
      warmth: t.radarWarmth || 50,
      sweetness: t.radarSweetness || 50,
      spiciness: t.radarSpiciness || 50,
      earthiness: t.radarEarthiness || 50,
      color: colors[idx % colors.length]
    };
  });
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1 container mx-auto py-8 space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Comparaison Radar Olfactif</h1>
          <p className="text-muted-foreground">
            Superposez jusqu'à 4 profils olfactifs pour comparer les terpènes
          </p>
        </div>
        
        {/* Sélection des terpènes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Sélectionner les terpènes à comparer</CardTitle>
              {selectedIds.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  <X className="w-4 h-4 mr-2" />
                  Effacer ({selectedIds.length})
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Chargement...</p>
            ) : terpenes.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Aucun terpène avec profil radar disponible
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {terpenes.map((t) => {
                  const isSelected = selectedIds.includes(t.id);
                  const isDisabled = !isSelected && selectedIds.length >= 4;
                  
                  return (
                    <button
                      key={t.id}
                      onClick={() => toggleSelection(t.id)}
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
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t.family}</p>
                      {isSelected && (
                        <Badge variant="secondary" className="mt-2">
                          Sélectionné
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Graphe radar comparatif */}
        {selectedTerpenes.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Comparaison des Profils Olfactifs
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter PNG
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <RadarChart profiles={radarProfiles} height={500} />
              
              {/* Tableau comparatif */}
              <div className="mt-8 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Propriété</th>
                      {selectedTerpenes.map((t) => (
                        <th key={t.id} className="text-center py-3 px-4 font-semibold">
                          {t.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: 'radarIntensity', label: 'Intensité' },
                      { key: 'radarFreshness', label: 'Fraîcheur' },
                      { key: 'radarWarmth', label: 'Chaleur' },
                      { key: 'radarSweetness', label: 'Douceur' },
                      { key: 'radarSpiciness', label: 'Piquant' },
                      { key: 'radarEarthiness', label: 'Terreux' }
                    ].map((prop) => (
                      <tr key={prop.key} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{prop.label}</td>
                        {selectedTerpenes.map((t) => {
                          const value = (t as any)[prop.key] || 50;
                          const maxValue = Math.max(...selectedTerpenes.map(st => (st as any)[prop.key] || 50));
                          const isMax = value === maxValue && maxValue > 50;
                          
                          return (
                            <td key={t.id} className="text-center py-3 px-4">
                              <span className={isMax ? 'font-bold text-primary' : ''}>
                                {value}/100
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Analyse comparative */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Analyse comparative</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Les valeurs en <span className="text-primary font-semibold">gras</span> indiquent les scores maximaux pour chaque propriété</li>
                  <li>• Le graphe radar permet de visualiser rapidement les différences de profils</li>
                  <li>• Les terpènes avec des profils similaires peuvent créer des synergies harmonieuses</li>
                  <li>• Les contrastes marqués (ex: frais vs chaud) peuvent créer des accords complexes</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
        
        {selectedTerpenes.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Activity className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Sélectionnez au moins un terpène pour commencer la comparaison</p>
            </CardContent>
          </Card>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
