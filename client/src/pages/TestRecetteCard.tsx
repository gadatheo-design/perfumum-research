import { RecetteCard } from "@/components/RecetteCard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Données de test pour une recette
const mockRecette = {
  id: 999,
  name: "TEST CARD — NOUVEAU COMPOSANT",
  category: "Pétrichor",
  type: "parfum",
  formula: "C1 — Test",
  intensity: 7,
  stability: "high" as const,
  ingredients: "Géosmine, Ozone, Terre blanche",
  moleculeCount: 3,
  avgIntensity: 65,
  avgFreshness: 55,
  avgWarmth: 45,
  avgSweetness: 30,
  avgSpiciness: 20,
  avgEarthiness: 70,
};

export default function TestRecetteCard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">🧪 Test du Nouveau Composant RecetteCard</h1>
            <p className="text-muted-foreground">
              Cette page permet de vérifier si le nouveau composant avec boutons d'action et mini radar s'affiche correctement.
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-400 rounded-lg p-4 mb-8">
            <h2 className="font-bold text-yellow-900 dark:text-yellow-200 mb-2">✅ Éléments à vérifier :</h2>
            <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-1">
              <li>• Bouton "Comparer" (icône GitCompare) en haut à droite</li>
              <li>• Bouton "Export PDF" (icône FileDown) en haut à droite</li>
              <li>• Bouton "Favoris" (icône Heart) en haut à droite</li>
              <li>• Mini radar hexagonal avec 6 axes colorés</li>
              <li>• Badge de gamme coloré (Pétrichor = cyan)</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecetteCard
              recette={mockRecette}
              isSelected={false}
              onCompare={(id) => alert(`Comparer recette #${id}`)}
              onExport={(id) => alert(`Export PDF recette #${id}`)}
              onFavorite={(id) => alert(`Favoris recette #${id}`)}
            />

            <RecetteCard
              recette={{...mockRecette, id: 1000, name: "CARTE SÉLECTIONNÉE", category: "Volcanique"}}
              isSelected={true}
              onCompare={(id) => alert(`Comparer recette #${id}`)}
              onExport={(id) => alert(`Export PDF recette #${id}`)}
              onFavorite={(id) => alert(`Favoris recette #${id}`)}
            />
          </div>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">🔍 Instructions :</h3>
            <ol className="text-sm space-y-1 text-muted-foreground">
              <li>1. Si vous voyez les 3 boutons d'action et le mini radar → ✅ Le composant fonctionne</li>
              <li>2. Si vous voyez l'ancien rendu (barres de progression) → ❌ Problème de cache navigateur</li>
              <li>3. Solution : Faites Ctrl+Shift+R (Windows/Linux) ou Cmd+Shift+R (Mac) pour forcer le rechargement</li>
            </ol>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
