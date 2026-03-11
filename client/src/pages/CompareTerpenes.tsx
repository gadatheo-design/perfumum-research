import { safeJsonParse } from "@/lib/utils";
import { useState } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { Leaf, Beaker, Droplet, FlaskConical, BookOpen, X } from "lucide-react";

// Mapping terpène -> image botanique
const TERPENE_IMAGES: Record<string, string> = {
  "Myrcène": "/images/terpenes/myrcene-botanical.png",
  "Limonène": "/images/terpenes/limonene-botanical.png",
  "α-Pinène": "/images/terpenes/pinene-botanical.png",
  "β-Pinène": "/images/terpenes/beta-pinene-botanical.png",
  "β-Caryophyllène": "/images/terpenes/caryophyllene-botanical.png",
  "Linalool": "/images/terpenes/linalool-botanical.png",
  "Humulène": "/images/terpenes/humulene-botanical.png",
};

const TERPENE_IDS = [1, 2, 3, 4, 5, 6, 7]; // IDs des 7 terpènes principaux

export default function CompareTerpenes() {
  const [selectedIds, setSelectedIds] = useState<number[]>(() => {
    // Charger la sélection depuis localStorage au montage
    const stored = localStorage.getItem("compare-terpenes");
    return stored ? safeJsonParse(stored, []) : [];
  });
  
  // Charger tous les terpènes
  const { data: allMolecules, isLoading } = trpc.molecules.list.useQuery();
  const terpenes = allMolecules?.filter(m => TERPENE_IDS.includes(m.id)) || [];
  
  const selectedTerpenes = terpenes.filter(t => selectedIds.includes(t.id));
  
  const toggleSelection = (id: number) => {
    let newSelection: number[];
    if (selectedIds.includes(id)) {
      newSelection = selectedIds.filter(sid => sid !== id);
    } else {
      if (selectedIds.length < 4) {
        newSelection = [...selectedIds, id];
      } else {
        return; // Max 4 atteint
      }
    }
    setSelectedIds(newSelection);
    localStorage.setItem("compare-terpenes", JSON.stringify(newSelection));
  };
  
  const clearSelection = () => {
    setSelectedIds([]);
    localStorage.removeItem("compare-terpenes");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1 container py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Comparaison Terpènes</h1>
            <p className="text-muted-foreground">
              Comparez les propriétés, sources botaniques et profils olfactifs de 2 à 4 terpènes
            </p>
          </div>
          
          <Link href="/resines-cbd">
            <Button variant="outline">Retour aux Résines CBD</Button>
          </Link>
        </div>
        
        {/* Sélection des terpènes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Sélectionnez 2 à 4 terpènes à comparer</span>
              {selectedIds.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearSelection}>
                  <X className="w-4 h-4 mr-2" />
                  Effacer ({selectedIds.length})
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground py-4">Chargement...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {terpenes.map((terpene) => (
                  <div
                    key={terpene.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedIds.includes(terpene.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    } ${selectedIds.length >= 4 && !selectedIds.includes(terpene.id) ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => toggleSelection(terpene.id)}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <Checkbox
                        checked={selectedIds.includes(terpene.id)}
                        disabled={selectedIds.length >= 4 && !selectedIds.includes(terpene.id)}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{terpene.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {terpene.olfactiveProfile}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Tableau comparatif */}
        {selectedTerpenes.length >= 2 ? (
          <Card>
            <CardHeader>
              <CardTitle>Tableau Comparatif</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold bg-muted/50">Propriété</th>
                    {selectedTerpenes.map((t) => (
                      <th key={t.id} className="text-left p-4 font-semibold bg-muted/50 min-w-[200px]">
                        <div className="flex items-center gap-2">
                          {TERPENE_IMAGES[t.name] && (
                            <img
                              src={TERPENE_IMAGES[t.name]}
                              alt={t.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          )}
                          <span>{t.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Formule chimique</td>
                    {selectedTerpenes.map((t) => (
                      <td key={t.id} className="p-4">
                        <code className="text-sm">{t.chemicalFormula || "—"}</code>
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="border-b bg-muted/20">
                    <td className="p-4 font-medium">Profil olfactif</td>
                    {selectedTerpenes.map((t) => (
                      <td key={t.id} className="p-4 text-sm">
                        {t.olfactiveProfile || "—"}
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="border-b">
                    <td className="p-4 font-medium">Sources botaniques</td>
                    {selectedTerpenes.map((t) => (
                      <td key={t.id} className="p-4 text-sm">
                        {t.botanicalSources || t.sourceOrigin || "—"}
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="border-b bg-muted/20">
                    <td className="p-4 font-medium">Méthodes d'extraction</td>
                    {selectedTerpenes.map((t) => (
                      <td key={t.id} className="p-4 text-sm">
                        {t.extractionMethod || "—"}
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="border-b">
                    <td className="p-4 font-medium">Propriétés thérapeutiques</td>
                    {selectedTerpenes.map((t) => (
                      <td key={t.id} className="p-4 text-sm">
                        {t.therapeuticProperties || "—"}
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="border-b bg-muted/20">
                    <td className="p-4 font-medium">Point d'ébullition</td>
                    {selectedTerpenes.map((t) => (
                      <td key={t.id} className="p-4 text-sm">
                        {t.boilingPoint ? `${t.boilingPoint}°C` : "—"}
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="border-b">
                    <td className="p-4 font-medium">Intensité olfactive</td>
                    {selectedTerpenes.map((t) => (
                      <td key={t.id} className="p-4 text-sm">
                        {t.intensity ? `${t.intensity}/100` : "—"}
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="border-b bg-muted/20">
                    <td className="p-4 font-medium">Famille chimique</td>
                    {selectedTerpenes.map((t) => (
                      <td key={t.id} className="p-4 text-sm">
                        <Badge variant="secondary">{t.family || "—"}</Badge>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Leaf className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Sélectionnez au moins 2 terpènes pour afficher le tableau comparatif</p>
            </CardContent>
          </Card>
        )}
        
        {/* Liens vers pages détail */}
        {selectedTerpenes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Fiches Détaillées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {selectedTerpenes.map((t) => (
                  <Link key={t.id} href={`/terpene/${t.id}`}>
                    <Button variant="outline">
                      Voir {t.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
