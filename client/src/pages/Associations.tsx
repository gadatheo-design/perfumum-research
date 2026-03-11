import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Link2, 
  Star,
  Leaf,
  Flame,
  Filter,
  Info,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { trpc } from "@/lib/trpc";

// Types
interface Association {
  id: number;
  recetteId: number;
  tabacId: number;
  compatibility: number;
  proportion: string | null;
  synergies: string | null;
  notes: string | null;
  recommended: number;
}

interface Recette {
  id: number;
  name: string;
  category: string | null;
  description: string | null;
}

interface Tabac {
  id: number;
  name: string;
  type: string;
  origin: string | null;
  flavor: string | null;
}

// Données statiques des recettes pétrichor
const recettesPetrichor = [
  { id: 150001, name: "Pétrichor Ancestral", profile: "Temple ancien, encens sacré", cbd: "12%" },
  { id: 150002, name: "Pétrichor Forestier", profile: "Forêt de conifères, mousse", cbd: "0%" },
  { id: 150003, name: "Pétrichor Minéral", profile: "Pierre mouillée, ozone", cbd: "15%" },
  { id: 150004, name: "Pétrichor Tropical", profile: "Mousson asiatique, terre rouge", cbd: "10%" },
  { id: 150005, name: "Pétrichor Nocturne", profile: "Nuit après l'orage, mystère", cbd: "12%" },
];

// Données statiques des tabacs
const tabacs = [
  { id: 1, name: "Virginia Gold", type: "virginia", profile: "Doux, sucré, léger" },
  { id: 2, name: "Burley Dark", type: "burley", profile: "Terreux, noisette, profond" },
  { id: 3, name: "Oriental Mystique", type: "oriental", profile: "Épicé, aromatique, exotique" },
  { id: 4, name: "Latakia Shadow", type: "latakia", profile: "Fumé, intense, mystérieux" },
  { id: 5, name: "Perique Noir", type: "perique", profile: "Fermenté, complexe, sombre" },
  { id: 6, name: "Cavendish Miel", type: "cavendish", profile: "Doux, miellé, accessible" },
  { id: 7, name: "Kentucky Fire", type: "kentucky", profile: "Fumé, boisé, chaleureux" },
  { id: 8, name: "Maryland Doux", type: "maryland", profile: "Léger, neutre, frais" },
];

// Associations statiques (correspondant aux données insérées)
const associations = [
  // Pétrichor Ancestral
  { recetteId: 150001, tabacId: 3, compatibility: 5, proportion: "60/40", synergies: ["Encens amplifié", "Terre sacrée renforcée", "Spiritualité profonde"], notes: "Association idéale: Oriental Mystique apporte des notes épicées qui complètent parfaitement le Mitti Attar et le Frankincense.", recommended: true },
  { recetteId: 150001, tabacId: 4, compatibility: 4, proportion: "70/30", synergies: ["Fumée sacrée", "Profondeur terreuse", "Mystère nocturne"], notes: "Latakia Shadow ajoute une dimension fumée qui évoque les temples enfumés.", recommended: true },
  { recetteId: 150001, tabacId: 5, compatibility: 4, proportion: "65/35", synergies: ["Fermentation terreuse", "Complexité aromatique", "Notes de cave"], notes: "Perique Noir apporte des notes fermentées qui rappellent les caves anciennes.", recommended: false },
  
  // Pétrichor Forestier
  { recetteId: 150002, tabacId: 1, compatibility: 4, proportion: "55/45", synergies: ["Fraîcheur boisée", "Légèreté naturelle", "Équilibre végétal"], notes: "Virginia Gold apporte une douceur qui équilibre les notes de conifères.", recommended: true },
  { recetteId: 150002, tabacId: 7, compatibility: 5, proportion: "50/50", synergies: ["Feu de camp forestier", "Bois fumé", "Chaleur naturelle"], notes: "Kentucky Fire: association parfaite pour évoquer un feu de camp en forêt.", recommended: true },
  { recetteId: 150002, tabacId: 2, compatibility: 3, proportion: "60/40", synergies: ["Terre forestière", "Profondeur boisée", "Humus"], notes: "Burley Dark ajoute des notes terreuses qui complètent la mousse.", recommended: false },
  
  // Pétrichor Minéral
  { recetteId: 150003, tabacId: 8, compatibility: 5, proportion: "65/35", synergies: ["Minéralité douce", "Fraîcheur cristalline", "Pureté"], notes: "Maryland Doux: association idéale pour la fraîcheur minérale.", recommended: true },
  { recetteId: 150003, tabacId: 1, compatibility: 4, proportion: "60/40", synergies: ["Légèreté minérale", "Clarté", "Équilibre"], notes: "Virginia Gold apporte une douceur qui équilibre les notes ozonnées.", recommended: true },
  { recetteId: 150003, tabacId: 6, compatibility: 3, proportion: "70/30", synergies: ["Douceur minérale", "Rondeur", "Accessibilité"], notes: "Cavendish Miel adoucit le profil minéral.", recommended: false },
  
  // Pétrichor Tropical
  { recetteId: 150004, tabacId: 3, compatibility: 5, proportion: "55/45", synergies: ["Épices tropicales", "Chaleur humide", "Exotisme"], notes: "Oriental Mystique: parfait pour évoquer les moussons asiatiques.", recommended: true },
  { recetteId: 150004, tabacId: 6, compatibility: 4, proportion: "60/40", synergies: ["Douceur tropicale", "Fruits mûrs", "Chaleur sucrée"], notes: "Cavendish Miel évoque les fruits tropicaux après la pluie.", recommended: true },
  { recetteId: 150004, tabacId: 2, compatibility: 4, proportion: "65/35", synergies: ["Terre rouge", "Profondeur", "Authenticité"], notes: "Burley Dark renforce les notes de terre rouge.", recommended: false },
  
  // Pétrichor Nocturne
  { recetteId: 150005, tabacId: 4, compatibility: 5, proportion: "50/50", synergies: ["Mystère nocturne", "Fumée d'orage", "Profondeur"], notes: "Latakia Shadow: association parfaite pour l'atmosphère nocturne.", recommended: true },
  { recetteId: 150005, tabacId: 5, compatibility: 5, proportion: "55/45", synergies: ["Nuit fermentée", "Complexité sombre", "Introspection"], notes: "Perique Noir apporte une complexité fermentée idéale.", recommended: true },
  { recetteId: 150005, tabacId: 7, compatibility: 4, proportion: "60/40", synergies: ["Feu nocturne", "Chaleur dans l'obscurité", "Réconfort"], notes: "Kentucky Fire évoque un feu après l'orage.", recommended: false },
];

export default function Associations() {
  const [selectedRecette, setSelectedRecette] = useState<string>("all");
  const [selectedTabac, setSelectedTabac] = useState<string>("all");
  const [showRecommendedOnly, setShowRecommendedOnly] = useState(false);

  // Filtrer les associations
  const filteredAssociations = useMemo(() => {
    return associations.filter(a => {
      const matchesRecette = selectedRecette === "all" || a.recetteId === parseInt(selectedRecette);
      const matchesTabac = selectedTabac === "all" || a.tabacId === parseInt(selectedTabac);
      const matchesRecommended = !showRecommendedOnly || a.recommended;
      return matchesRecette && matchesTabac && matchesRecommended;
    });
  }, [selectedRecette, selectedTabac, showRecommendedOnly]);

  // Obtenir les infos d'une recette
  const getRecette = (id: number) => recettesPetrichor.find(r => r.id === id);
  const getTabac = (id: number) => tabacs.find(t => t.id === id);

  // Générer les étoiles de compatibilité
  const renderStars = (count: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < count ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
      />
    ));
  };

  // Matrice de compatibilité
  const compatibilityMatrix = useMemo(() => {
    const matrix: Record<number, Record<number, number>> = {};
    associations.forEach(a => {
      if (!matrix[a.recetteId]) matrix[a.recetteId] = {};
      matrix[a.recetteId][a.tabacId] = a.compatibility;
    });
    return matrix;
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Link2 className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Associations
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Synergies optimales entre résines CBD pétrichor et variétés de tabacs
              </p>
            </div>
          </div>
        </section>

        {/* Matrice de compatibilité */}
        <section className="py-8 border-b">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Matrice de Compatibilité</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-3 text-left bg-muted/50 border">Recette / Tabac</th>
                      {tabacs.map(t => (
                        <th key={t.id} className="p-3 text-center bg-muted/50 border text-sm">
                          {t.name.split(' ')[0]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recettesPetrichor.map(r => (
                      <tr key={r.id}>
                        <td className="p-3 border font-medium bg-muted/30">
                          {r.name.replace('Pétrichor ', '')}
                        </td>
                        {tabacs.map(t => {
                          const compat = compatibilityMatrix[r.id]?.[t.id];
                          return (
                            <td key={t.id} className="p-3 border text-center">
                              {compat ? (
                                <div className="flex justify-center">
                                  {Array(compat).fill(0).map((_, i) => (
                                    <Star key={i} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                  ))}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Filtres */}
        <section className="py-6 border-b bg-muted/30">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between max-w-5xl mx-auto">
              <div className="flex flex-wrap gap-4 w-full md:w-auto">
                <Select value={selectedRecette} onValueChange={setSelectedRecette}>
                  <SelectTrigger className="w-[200px]">
                    <Leaf className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Recette" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les recettes</SelectItem>
                    {recettesPetrichor.map(r => (
                      <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedTabac} onValueChange={setSelectedTabac}>
                  <SelectTrigger className="w-[180px]">
                    <Flame className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Tabac" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les tabacs</SelectItem>
                    {tabacs.map(t => (
                      <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant={showRecommendedOnly ? "default" : "outline"}
                  onClick={() => setShowRecommendedOnly(!showRecommendedOnly)}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Recommandées
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredAssociations.length} association{filteredAssociations.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </section>

        {/* Liste des associations */}
        <section className="py-8">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="grid gap-6">
                {filteredAssociations.map((assoc, index) => {
                  const recette = getRecette(assoc.recetteId);
                  const tabac = getTabac(assoc.tabacId);
                  if (!recette || !tabac) return null;

                  return (
                    <Card key={index} className={`transition-all hover:shadow-lg ${assoc.recommended ? 'border-primary/50' : ''}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Link2 className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-xl flex items-center gap-2">
                                {recette.name}
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                {tabac.name}
                                {assoc.recommended && (
                                  <Badge className="bg-primary/20 text-primary ml-2">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    Recommandée
                                  </Badge>
                                )}
                              </CardTitle>
                              <CardDescription>
                                {recette.profile} × {tabac.profile}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {renderStars(assoc.compatibility)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-6">
                          {/* Proportion */}
                          <div>
                            <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Proportion</h4>
                            <div className="text-2xl font-bold">{assoc.proportion}</div>
                            <p className="text-xs text-muted-foreground mt-1">Résine / Tabac</p>
                          </div>

                          {/* Synergies */}
                          <div>
                            <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Synergies</h4>
                            <div className="flex flex-wrap gap-1">
                              {assoc.synergies.map((s, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {s}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Notes */}
                          <div>
                            <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Notes</h4>
                            <p className="text-sm text-muted-foreground">{assoc.notes}</p>
                          </div>
                        </div>

                        {/* CBD Info */}
                        <div className="mt-4 pt-4 border-t flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground">
                              CBD: <strong>{recette.cbd}</strong>
                            </span>
                            <span className="text-muted-foreground">
                              Type: <strong className="capitalize">{tabac.type}</strong>
                            </span>
                          </div>
                          <Link href={`/recette/${assoc.recetteId}`}>
                            <Button variant="ghost" size="sm">
                              Voir la recette
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredAssociations.length === 0 && (
                <div className="text-center py-12">
                  <Link2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucune association trouvée</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Protocole de mélange */}
        <section className="py-8 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Protocole de Mélange
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3 text-sm">
                    <li className="flex gap-3">
                      <span className="font-bold text-primary">1.</span>
                      <span><strong>Préparation</strong> — Émietter finement le tabac choisi</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-primary">2.</span>
                      <span><strong>Proportion</strong> — Respecter les ratios recommandés (résine/tabac)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-primary">3.</span>
                      <span><strong>Mélange</strong> — Incorporer la résine émiettée au tabac</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-primary">4.</span>
                      <span><strong>Repos</strong> — Laisser reposer 24h dans un contenant hermétique</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-primary">5.</span>
                      <span><strong>Maturation</strong> — Pour un résultat optimal, attendre 3-7 jours</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
