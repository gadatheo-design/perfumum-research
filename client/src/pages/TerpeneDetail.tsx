import { useParams, Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { Leaf, Beaker, Droplet, ThermometerSun, FlaskConical, BookOpen, GitCompare, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { RadarChart } from "@/components/RadarChart";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";
import { DetailSidebar, getTerpeneQuickLinks } from "@/components/DetailSidebar";
import { NotesEditor } from "@/components/NotesEditor";

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

export default function TerpeneDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0");
  const [, setLocation] = useLocation();
  
  const { data, isLoading } = trpc.molecule.getById.useQuery({ id });
  const molecule = data?.molecule;
  
  const handleCompare = () => {
    // Récupérer la sélection actuelle depuis localStorage
    const stored = localStorage.getItem("compare-terpenes");
    const currentSelection = stored ? JSON.parse(stored) : [];
    
    // Ajouter le terpène actuel s'il n'est pas déjà sélectionné
    if (!currentSelection.includes(id)) {
      const newSelection = [...currentSelection, id].slice(0, 4); // Max 4
      localStorage.setItem("compare-terpenes", JSON.stringify(newSelection));
    }
    
    // Rediriger vers la page de comparaison
    setLocation("/compare-terpenes");
  };
  
  // Récupérer les recettes contenant ce terpène
  const { data: recettesData } = trpc.recettes.list.useQuery({ category: "resine_cbd" as any });
  
  // Récupérer molécules similaires
  const { data: similarMolecules } = trpc.molecules.getSimilar.useQuery({ id, limit: 3 });
  
  // Liste des 7 terpènes pour navigation séquentielle
  const terpenes = [
    { id: 1, label: "Myrcène", path: "/terpene/1" },
    { id: 2, label: "Limonène", path: "/terpene/2" },
    { id: 3, label: "β-Pinène", path: "/terpene/3" },
    { id: 4, label: "β-Caryophyllène", path: "/terpene/4" },
    { id: 5, label: "Linalool", path: "/terpene/5" },
    { id: 6, label: "α-Pinène", path: "/terpene/6" },
    { id: 7, label: "Humulène", path: "/terpene/7" },
  ];
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <p className="text-center text-muted-foreground">Chargement...</p>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!molecule) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <p className="text-center text-destructive">Terpène introuvable</p>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="container py-4">
          <DynamicBreadcrumb />
        </div>
        
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 py-16">
          <div className="container">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/">Accueil</Link>
              <span>/</span>
              <Link href="/resines-cbd">Résines CBD</Link>
              <span>/</span>
              <span className="text-foreground">{molecule.name}</span>
            </div>
            
            <div className="flex items-start justify-between gap-8">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4">{molecule.name}</h1>
                <p className="text-xl text-muted-foreground mb-6">
                  {molecule.olfactiveProfile || "Terpène aromatique naturel"}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    <Leaf className="w-3 h-3 mr-1" />
                    {molecule.family || "Terpène"}
                  </Badge>
                  {molecule.chemicalFormula && (
                    <Badge variant="outline">
                      <Beaker className="w-3 h-3 mr-1" />
                      {molecule.chemicalFormula}
                    </Badge>
                  )}
                </div>
                
                {/* Bouton Comparer */}
                <div className="mt-6">
                  <Button onClick={handleCompare} variant="outline" size="lg">
                    <GitCompare className="w-4 h-4 mr-2" />
                    Comparer ce terpène
                  </Button>
                </div>
              </div>
              
              {/* Image botanique */}
              {TERPENE_IMAGES[molecule.name] && (
                <div className="hidden md:block">
                  <img
                    src={TERPENE_IMAGES[molecule.name]}
                    alt={`Illustration botanique - ${molecule.name}`}
                    className="w-64 h-64 object-cover rounded-2xl shadow-lg border-4 border-white dark:border-gray-800"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Détails Techniques */}
        <section className="py-12 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FlaskConical className="w-5 h-5" />
                    Propriétés Chimiques
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {molecule.chemicalFormula && (
                    <div>
                      <p className="text-sm text-muted-foreground">Formule moléculaire</p>
                      <p className="font-mono text-lg">{molecule.chemicalFormula}</p>
                    </div>
                  )}
                  {molecule.boilingPoint && (
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <ThermometerSun className="w-4 h-4" />
                        Point d'ébullition
                      </p>
                      <p className="font-semibold">{molecule.boilingPoint}°C</p>
                    </div>
                  )}
                  {molecule.family && (
                    <div>
                      <p className="text-sm text-muted-foreground">Famille chimique</p>
                      <p className="font-semibold">{molecule.family}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplet className="w-5 h-5" />
                    Profil Olfactif
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {molecule.olfactiveProfile && (
                    <div>
                      <p className="text-sm text-muted-foreground">Profil olfactif</p>
                      <p className="font-semibold">{molecule.olfactiveProfile}</p>
                    </div>
                  )}
                  {molecule.olfactiveProfile && (
                    <div>
                      <p className="text-sm text-muted-foreground">Intensité</p>
                      <p>{molecule.intensity ? `${molecule.intensity}/100` : "Non spécifiée"}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Informations Botaniques & Propriétés */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="w-5 h-5" />
                    Sources Botaniques
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {molecule.botanicalSources ? (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Plantes sources</p>
                      <p className="leading-relaxed">{molecule.botanicalSources}</p>
                    </div>
                  ) : molecule.sourceOrigin && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Origine</p>
                      <p className="leading-relaxed">{molecule.sourceOrigin}</p>
                    </div>
                  )}
                  {molecule.extractionMethod && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Méthodes d'extraction</p>
                      <p className="leading-relaxed">{molecule.extractionMethod}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Propriétés & Effets
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {molecule.therapeuticProperties && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Propriétés thérapeutiques</p>
                      <p className="leading-relaxed">{molecule.therapeuticProperties}</p>
                    </div>
                  )}
                  {molecule.emotionalResonance && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Résonance émotionnelle</p>
                      <p className="leading-relaxed">{molecule.emotionalResonance}</p>
                    </div>
                  )}
                  {molecule.functionalEffect && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Effet fonctionnel</p>
                      <p className="leading-relaxed">{molecule.functionalEffect}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Profil Radar Olfactif */}
            {(molecule.radarIntensity || molecule.radarFreshness || molecule.radarWarmth) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Profil Olfactif Radar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadarChart
                    profiles={[
                      {
                        label: molecule.name,
                        intensity: molecule.radarIntensity || 50,
                        freshness: molecule.radarFreshness || 50,
                        warmth: molecule.radarWarmth || 50,
                        sweetness: molecule.radarSweetness || 50,
                        spiciness: molecule.radarSpiciness || 50,
                        earthiness: molecule.radarEarthiness || 50,
                        color: "rgba(16, 185, 129, 0.6)"
                      }
                    ]}
                    height={400}
                  />
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Intensité</span>
                      <span className="font-semibold">{molecule.radarIntensity || 50}/100</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Fraîcheur</span>
                      <span className="font-semibold">{molecule.radarFreshness || 50}/100</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Chaleur</span>
                      <span className="font-semibold">{molecule.radarWarmth || 50}/100</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Douceur</span>
                      <span className="font-semibold">{molecule.radarSweetness || 50}/100</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Piquant</span>
                      <span className="font-semibold">{molecule.radarSpiciness || 50}/100</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Terreux</span>
                      <span className="font-semibold">{molecule.radarEarthiness || 50}/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {molecule.notes && (
              <Card className="mb-12">
                <CardHeader>
                  <CardTitle>Notes de recherche</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-sm text-muted-foreground">{molecule.notes}</p>
                </CardContent>
              </Card>
            )}
            
            {/* Notes personnelles */}
            <div className="mb-12">
              <NotesEditor
                entityType="molecule"
                entityId={id}
                title="Notes personnelles"
                placeholder="Ajoutez vos observations, résultats d'expériences, idées de combinaisons..."
              />
            </div>

            {/* Vous pourriez aimer */}
            {similarMolecules && similarMolecules.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-2">Vous pourriez aimer</h2>
                <p className="text-muted-foreground mb-6">
                  Terpènes avec profils olfactifs similaires (algorithme de distance euclidienne)
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {similarMolecules.map((mol) => (
                    <Link key={mol.id} href={`/terpene/${mol.id}`}>
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <CardTitle className="text-lg">{mol.name}</CardTitle>
                            <Badge variant="secondary">
                              {Math.round(mol.similarityScore)}% similaire
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {mol.olfactiveProfile}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {mol.family && (
                              <Badge variant="outline">{mol.family}</Badge>
                            )}
                            {mol.therapeuticProperties && (
                              <Badge variant="secondary" className="line-clamp-1">
                                {mol.therapeuticProperties.split(',')[0]}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recettes contenant ce terpène avec proportions */}
            {data?.recettes && data.recettes.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  Utilisé dans {data.recettes.length} recette{data.recettes.length > 1 ? 's' : ''}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.recettes.map((recette: any) => (
                    <Link key={recette.recetteId} href={`/resine-cbd/${recette.recetteId}`}>
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg flex-1">{recette.recetteName}</CardTitle>
                            <Badge variant="default" className="ml-2 shrink-0">
                              {recette.proportion}%
                            </Badge>
                          </div>
                        </CardHeader>
                        {recette.notes && (
                          <CardContent>
                            <p className="text-sm text-muted-foreground italic">
                              {recette.notes}
                            </p>
                          </CardContent>
                        )}
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      
      {/* Sidebar Contextuelle */}
      <DetailSidebar
        currentId={id}
        items={terpenes}
        basePath="/terpene"
        quickLinks={getTerpeneQuickLinks(id)}
        statistics={[
          {
            label: "Utilisé dans",
            value: `${recettesData?.length || 0} recettes`,
            path: "/resines-cbd",
          },
          {
            label: "Famille",
            value: molecule?.family || "N/A",
          },
          {
            label: "Poids moléculaire",
            value: molecule?.molecularWeight ? `${molecule.molecularWeight} g/mol` : "N/A",
          },
        ]}
        className="hidden lg:block"
      />
      
      <Footer />
    </div>
  );
}
