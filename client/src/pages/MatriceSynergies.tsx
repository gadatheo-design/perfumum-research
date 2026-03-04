// @ts-nocheck
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Network, Info, Filter } from "lucide-react";

type CompatibilityLevel = "excellent" | "neutral" | "weak" | "none";

export default function MatriceSynergies() {
  const [selectedPair, setSelectedPair] = useState<{
    terpene1: string;
    terpene2: string;
    score: number;
    notes: string;
  } | null>(null);
  const [filterLevel, setFilterLevel] = useState<CompatibilityLevel | "all">("all");
  
  // Charger tous les terpènes avec profils radar
  const { data: allMolecules } = trpc.molecules.list.useQuery();
  const { data: allSynergies } = trpc.terpeneSynergies.listAll.useQuery();
  
  const terpenes = allMolecules?.filter(m => 
    m.family?.toLowerCase().includes('terpène') && 
    (m.radarIntensity || m.radarFreshness)
  ).slice(0, 7) || [];
  
  const getCompatibilityLevel = (score: number): CompatibilityLevel => {
    if (score >= 71) return "excellent";
    if (score >= 31) return "neutral";
    if (score > 0) return "weak";
    return "none";
  };
  
  const getColorClass = (level: CompatibilityLevel) => {
    switch (level) {
      case "excellent": return "bg-green-500/20 hover:bg-green-500/30 border-green-500/40";
      case "neutral": return "bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/40";
      case "weak": return "bg-red-500/20 hover:bg-red-500/30 border-red-500/40";
      default: return "bg-muted/50 hover:bg-muted border-border";
    }
  };
  
  const getSynergyScore = (t1Id: number, t2Id: number): number => {
    if (t1Id === t2Id) return 0;
    const synergy = allSynergies?.find(s => 
      (s.terpene1Id === t1Id && s.terpene2Id === t2Id) ||
      (s.terpene1Id === t2Id && s.terpene2Id === t1Id)
    );
    return synergy?.compatibilityScore || 0;
  };
  
  const getSynergyNotes = (t1Id: number, t2Id: number): string => {
    if (t1Id === t2Id) return "";
    const synergy = allSynergies?.find(s => 
      (s.terpene1Id === t1Id && s.terpene2Id === t2Id) ||
      (s.terpene1Id === t2Id && s.terpene2Id === t1Id)
    );
    return synergy?.synergyNotes || "Aucune note disponible";
  };
  
  const handleCellClick = (t1: typeof terpenes[0], t2: typeof terpenes[0]) => {
    if (t1.id === t2.id) return;
    const score = getSynergyScore(t1.id, t2.id);
    const notes = getSynergyNotes(t1.id, t2.id);
    setSelectedPair({
      terpene1: t1.name,
      terpene2: t2.name,
      score,
      notes
    });
  };
  
  const shouldShowCell = (score: number): boolean => {
    if (filterLevel === "all") return true;
    const level = getCompatibilityLevel(score);
    return level === filterLevel;
  };
  
  const stats = {
    excellent: allSynergies?.filter(s => s.compatibilityScore >= 71).length || 0,
    neutral: allSynergies?.filter(s => s.compatibilityScore >= 31 && s.compatibilityScore < 71).length || 0,
    weak: allSynergies?.filter(s => s.compatibilityScore > 0 && s.compatibilityScore < 31).length || 0,
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1 container mx-auto py-8 space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Matrice de Synergies Terpéniques</h1>
          <p className="text-muted-foreground">
            Tableau interactif des compatibilités entre 7 terpènes principaux
          </p>
        </div>
        
        {/* Statistiques et filtres */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Network className="w-5 h-5" />
                Statistiques Synergies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500"></div>
                  <span className="text-sm">Excellente synergie (71-100)</span>
                </div>
                <Badge variant="secondary">{stats.excellent}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-500"></div>
                  <span className="text-sm">Synergie neutre (31-70)</span>
                </div>
                <Badge variant="secondary">{stats.neutral}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500"></div>
                  <span className="text-sm">Synergie faible (0-30)</span>
                </div>
                <Badge variant="secondary">{stats.weak}</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="w-5 h-5" />
                Filtrer par Niveau
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={filterLevel === "all" ? "default" : "outline"}
                  onClick={() => setFilterLevel("all")}
                  className="w-full"
                >
                  Toutes
                </Button>
                <Button
                  variant={filterLevel === "excellent" ? "default" : "outline"}
                  onClick={() => setFilterLevel("excellent")}
                  className="w-full"
                >
                  Excellentes
                </Button>
                <Button
                  variant={filterLevel === "neutral" ? "default" : "outline"}
                  onClick={() => setFilterLevel("neutral")}
                  className="w-full"
                >
                  Neutres
                </Button>
                <Button
                  variant={filterLevel === "weak" ? "default" : "outline"}
                  onClick={() => setFilterLevel("weak")}
                  className="w-full"
                >
                  Faibles
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Matrice 7x7 */}
        <Card>
          <CardHeader>
            <CardTitle>Matrice Interactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 border border-border bg-muted/50"></th>
                    {terpenes.map(t => (
                      <th key={t.id} className="p-2 border border-border bg-muted/50 text-xs font-semibold text-center min-w-[80px]">
                        <div className="rotate-0 whitespace-nowrap">{t.name}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {terpenes.map(t1 => (
                    <tr key={t1.id}>
                      <td className="p-2 border border-border bg-muted/50 text-xs font-semibold whitespace-nowrap">
                        {t1.name}
                      </td>
                      {terpenes.map(t2 => {
                        const score = getSynergyScore(t1.id, t2.id);
                        const level = getCompatibilityLevel(score);
                        const isVisible = shouldShowCell(score);
                        const isDiagonal = t1.id === t2.id;
                        
                        return (
                          <td
                            key={t2.id}
                            className={`p-2 border border-border text-center cursor-pointer transition-all ${
                              isDiagonal 
                                ? 'bg-muted/30' 
                                : isVisible
                                ? getColorClass(level)
                                : 'bg-muted/10 opacity-30'
                            }`}
                            onClick={() => !isDiagonal && handleCellClick(t1, t2)}
                          >
                            {isDiagonal ? (
                              <span className="text-muted-foreground text-xs">—</span>
                            ) : (
                              <div className="flex flex-col items-center gap-1">
                                <span className="font-bold text-sm">{score}</span>
                                {level === "excellent" && <span className="text-xs text-green-700">🟢</span>}
                                {level === "neutral" && <span className="text-xs text-yellow-700">🟡</span>}
                                {level === "weak" && <span className="text-xs text-red-700">🔴</span>}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• <strong>Cliquez sur une cellule</strong> pour voir les détails de la synergie</p>
                  <p>• Les scores vont de 0 à 100 : plus le score est élevé, meilleure est la synergie</p>
                  <p>• La diagonale (—) représente un terpène avec lui-même (non applicable)</p>
                  <p>• Utilisez les filtres pour isoler les niveaux de compatibilité</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
      
      {/* Modal détails synergie */}
      <Dialog open={!!selectedPair} onOpenChange={() => setSelectedPair(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedPair?.terpene1} + {selectedPair?.terpene2}
            </DialogTitle>
            <DialogDescription>
              Détails de la synergie terpénique
            </DialogDescription>
          </DialogHeader>
          
          {selectedPair && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">{selectedPair.score}</div>
                  <div className="text-xs text-muted-foreground">Score /100</div>
                </div>
                <div className="flex-1">
                  <Badge 
                    variant="secondary" 
                    className={`text-base px-4 py-2 ${
                      selectedPair.score >= 71 
                        ? 'bg-green-500/20 text-green-700' 
                        : selectedPair.score >= 31
                        ? 'bg-yellow-500/20 text-yellow-700'
                        : 'bg-red-500/20 text-red-700'
                    }`}
                  >
                    {selectedPair.score >= 71 ? '🟢 Excellente synergie' : 
                     selectedPair.score >= 31 ? '🟡 Synergie neutre' : 
                     '🔴 Synergie faible'}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Notes de recherche</h4>
                <p className="text-sm leading-relaxed">{selectedPair.notes}</p>
              </div>
              
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold mb-2 text-sm">Recommandations</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  {selectedPair.score >= 71 ? (
                    <>
                      <li>✓ Combinaison recommandée pour créer des accords harmonieux</li>
                      <li>✓ Les profils olfactifs se complètent mutuellement</li>
                      <li>✓ Idéal pour des formulations équilibrées</li>
                    </>
                  ) : selectedPair.score >= 31 ? (
                    <>
                      <li>→ Combinaison utilisable avec précaution</li>
                      <li>→ Peut créer des contrastes intéressants</li>
                      <li>→ Tester les proportions pour optimiser l'accord</li>
                    </>
                  ) : (
                    <>
                      <li>⚠ Combinaison déconseillée pour usage principal</li>
                      <li>⚠ Contraste olfactif trop marqué</li>
                      <li>⚠ Privilégier d'autres associations</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
