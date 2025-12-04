import { trpc } from "@/lib/trpc";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Leaf, Sparkles, FlaskConical, Timer, DollarSign } from "lucide-react";

export default function ResinesCBD() {
  const { data: recettes, isLoading } = trpc.recettes.list.useQuery({
    category: 'resine'
  });

  const cbdRecipes = recettes?.filter(r => 
    r.name.includes('VANILLE') || 
    r.name.includes('THÉ') || 
    r.name.includes('ROSE') ||
    r.name.includes('CUIR') ||
    r.name.includes('MENTHE') ||
    r.name.includes('SÉSAME') ||
    r.name.includes('FIGUIER')
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="container py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-gray-200 rounded-lg" />
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <Breadcrumbs />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
        <div className="container py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              <Leaf className="w-4 h-4" />
              <span>Parfumerie Botanique Premium</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Résines CBD & Terpènes d'Exception
            </h1>
            
            <p className="text-xl text-emerald-50 max-w-2xl mx-auto leading-relaxed">
              Une gamme de résines CBD à haute valeur ajoutée, formulées avec des terpènes 
              issus de matières premières nobles pour des éditions limitées avec une signature olfactive unique.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="text-3xl font-bold">{cbdRecipes.length}</div>
                <div className="text-sm text-emerald-100">Profils Premium</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="text-3xl font-bold">94%</div>
                <div className="text-sm text-emerald-100">Base CBD</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="text-3xl font-bold">3%</div>
                <div className="text-sm text-emerald-100">Terpènes Rares</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Protocole Standard */}
      <div className="container py-12">
        <Card className="border-emerald-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-emerald-600" />
              <CardTitle className="text-2xl">Protocole de Formulation Standard</CardTitle>
            </div>
            <CardDescription>
              Méthode d'intégration des terpènes pour préserver les molécules volatiles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  Composition
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Résine CBD brute (22-70% CBD)</span>
                    <span className="font-semibold">94%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Mélange de terpènes rares</span>
                    <span className="font-semibold">3%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Huile de support (MCT, jojoba)</span>
                    <span className="font-semibold">2%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Antioxydant naturel (Vit. E 0.5%)</span>
                    <span className="font-semibold">1%</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Timer className="w-5 h-5 text-emerald-600" />
                  Processus
                </h3>
                <ol className="space-y-2 text-sm list-decimal list-inside text-gray-700">
                  <li>Température de travail : <strong>35-45°C maximum</strong></li>
                  <li>Dilution préalable : Terpènes dans huile support (MCT, jojoba)</li>
                  <li>Mélange : Chauffer base résine (30-35°C), ajouter terpènes dilués</li>
                  <li>Homogénéisation : Spatule acier/verre, 10-15 minutes</li>
                  <li>Refroidissement & repos : 24h hermétique, abri lumière/air</li>
                  <li>Maturation : <strong>5-10 jours</strong> à température ambiante (15-20°C)</li>
                </ol>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-sm text-emerald-900">
                <strong>Option avancée :</strong> Pulvériser les terpènes sur résine friable pour un effet 
                "live resin" (profil plus volatil et expressif).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profils Premium */}
      <div className="container pb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">7 Profils d'Exception</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chaque profil est inspiré de la parfumerie botanique et utilise des matières premières 
            brutes pour des éditions limitées avec une signature olfactive unique.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {cbdRecipes.map((recipe) => {
            // Extract profile type from notes
            const profileMatch = recipe.notes?.match(/Profil:\s*([^.]+)/);
            const profile = profileMatch ? profileMatch[1].trim() : '';
            
            const rarityMatch = recipe.notes?.match(/Rareté:\s*([^)]+)/);
            const rarity = rarityMatch ? rarityMatch[1].trim() : '';

            // Determine card color based on profile
            const getCardStyle = (name: string) => {
              if (name.includes('VANILLE')) return 'from-amber-50 to-orange-50 border-amber-200';
              if (name.includes('THÉ')) return 'from-yellow-50 to-amber-50 border-yellow-200';
              if (name.includes('ROSE')) return 'from-pink-50 to-rose-50 border-pink-200';
              if (name.includes('CUIR')) return 'from-stone-50 to-neutral-50 border-stone-200';
              if (name.includes('MENTHE')) return 'from-green-50 to-emerald-50 border-green-200';
              if (name.includes('SÉSAME')) return 'from-slate-50 to-gray-50 border-slate-200';
              if (name.includes('FIGUIER')) return 'from-lime-50 to-green-50 border-lime-200';
              return 'from-gray-50 to-slate-50 border-gray-200';
            };

            return (
              <Card key={recipe.id} className={`bg-gradient-to-br ${getCardStyle(recipe.name)} border-2 hover:shadow-lg transition-shadow`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{recipe.name}</CardTitle>
                      {profile && (
                        <Badge variant="outline" className="mb-3">
                          {profile}
                        </Badge>
                      )}
                      <CardDescription className="text-base">
                        {recipe.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Ingredients */}
                  {recipe.ingredients && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Leaf className="w-4 h-4" />
                        Matières Clés
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {recipe.ingredients}
                      </p>
                    </div>
                  )}

                  <Separator />

                  {/* Protocol */}
                  {recipe.protocol && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <FlaskConical className="w-4 h-4" />
                        Protocole
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {recipe.protocol}
                      </p>
                    </div>
                  )}

                  {/* Rarity & Cost */}
                  {rarity && (
                    <div className="bg-white/60 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-amber-600" />
                        <span className="font-semibold">Rareté :</span>
                        <span className="text-gray-700">{rarity}</span>
                      </div>
                    </div>
                  )}

                  {/* Texture badge */}
                  {recipe.texture && (
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {recipe.texture}
                      </Badge>
                      {recipe.category && (
                        <Badge variant="secondary" className="text-xs">
                          {recipe.category}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-emerald-900 text-white">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto space-y-6">
            <h3 className="text-2xl font-bold">Positionnement</h3>
            <p className="text-emerald-100 leading-relaxed">
              Parfumerie naturelle, herboristerie sensorielle, produit haut de gamme et de collection. 
              Ce positionnement vise à casser le marché standardisé du CBD en créant des expériences 
              olfactives et sensorielles uniques.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 pt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h4 className="font-semibold mb-2">Sécurité & Conformité</h4>
                <p className="text-sm text-emerald-100">
                  Terpènes naturels conformes IFRA/UE/REACH. Test pureté GC (&gt;95%) et point de volatilisation.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h4 className="font-semibold mb-2">Étiquetage</h4>
                <p className="text-sm text-emerald-100">
                  Concentration, date, composition aromatique. Mention : "Produit aromatique technique, 
                  non destiné à la combustion directe".
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h4 className="font-semibold mb-2">Stabilité</h4>
                <p className="text-sm text-emerald-100">
                  Test de stabilité (viscosité, odeur, homogénéité) à 3 et 6 mois. Conservation 6-12 mois.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
