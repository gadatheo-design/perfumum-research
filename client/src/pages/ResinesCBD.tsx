import { Link } from "wouter";
import { ChevronRight, Leaf, AlertTriangle, Beaker, Palette, Cigarette, Info, Sparkles, FlaskConical, Timer, DollarSign, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";

export default function ResinesCBD() {
  // Fetch CBD collections from database
  const { data: collectionsCBD, isLoading: loadingCollections } = trpc.recettes.list.useQuery({
    category: 'resine_cbd' as any
  });

  // Fetch existing premium profiles from database
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

  // 4 axes génétiques
  const axes = [
    {
      title: "Pétrichor / Terre Noire",
      icon: "🌧️",
      color: "border-l-4 border-l-slate-500",
      terpenes: ["Myrcène (terre, humus)", "Facettes racinaires / vetiver-like"],
      notes: ["Terre humide", "Cave", "Rhizomes / racines"],
      gammes: ["Terre Humide", "Terre Noire", "Bacillus", "Sundarban Soil", "Shuruppak"],
      associations: ["Mitti attar (petrichor)", "Vétiver Assam et Haïti", "Accords soil wet, humus deep"],
      relatedFamilyLink: "/chimie",
      relatedFamilyName: "Familles Chimiques (Terpènes & Aldéhydes)"
    },
    {
      title: "Résine Sacrée / Encens Antique",
      icon: "🔥",
      color: "border-l-4 border-l-orange-500",
      terpenes: ["α- et β-pinène", "β-caryophyllène, α-humulène"],
      notes: ["Bois résineux", "Fumée d'encens", "Poivre, épices sèches"],
      gammes: ["Kyfi Akhet", "Kyphi", "Tell Halaf Smoke", "Akrotiri Ash", "Thebaïd Noire"],
      associations: ["Myrrhe somalienne", "Encens noir d'Oman", "Labdanum antique", "Pine tar, benjoin"],
      relatedFamilyLink: "/chimie",
      relatedFamilyName: "Familles Chimiques (Terpènes & Phénols)"
    },
    {
      title: "Glaciaire / Minéral / Ozone",
      icon: "❄️",
      color: "border-l-4 border-l-cyan-500",
      terpenes: ["Terpinolène", "Ocimène", "Pinènes"],
      notes: ["Profils clairs, ozonés", "Atmosphère arctique", "Peu de myrcène"],
      gammes: ["Longyear Ice", "Europa Ocean", "Aurora Ionique", "Hash Glacier", "Silence Profond"],
      associations: ["Aldéhydes glacés", "Mineral water/dust", "Juniper ice, eucalyptus", "Ambergris blanc"],
      relatedFamilyLink: "/chimie",
      relatedFamilyName: "Familles Chimiques (Monoterpènes)"
    },
    {
      title: "Lactone / Floral / Étrange",
      icon: "🌸",
      color: "border-l-4 border-l-pink-500",
      terpenes: ["Notes mangue, pêche, fruits lactoniques", "Floraux doux (linalol, géraniol, nérol)"],
      notes: ["Peau, monoï, lait solaire", "Fermentations douces", "Champignon blanc"],
      gammes: ["Post-Humain", "Sang Lactonique", "Lactone Vert", "Mycélium-Parlement"],
      associations: ["Frangipani, néroli", "Monoï artisanal", "Ambrettolide, muscs propres"],
      relatedFamilyLink: "/chimie",
      relatedFamilyName: "Familles Chimiques (Lactones)"
    }
  ];

  // 4 gammes Perfumeum
  const gammes = [
    {
      title: "Pétrichor & Nécro-Géo",
      examples: ["Hash Terre Humide", "CBD Terre Noire", "CBN Crypte", "Sundarban Soil", "Shuruppak"],
      combinations: "Résine cannabis terreuse + mitti + vetiver + myrrhe + accords limon/argile"
    },
    {
      title: "Résines Sacrées & Civilisations Perdues",
      examples: ["Kyfi Akhet", "Tell Halaf Smoke", "Akrotiri Ash", "Nag Hammadi", "Thebaïd Noire"],
      combinations: "Résine cannabis résineuse + encens noir / frankincense brut + myrrhe antique, labdanum noir"
    },
    {
      title: "Glaciaire & Minéral",
      examples: ["Longyear Ice", "Europa Ocean", "Neige Métal", "Hash Glacier", "Aurora Ionique"],
      combinations: "Résine claire, ozonée + aldéhydes glacés + accords eau minérale, sel, poussière minérale"
    },
    {
      title: "Bio-Lab, Post-Humain & Lactones",
      examples: ["Hash Post-Humain", "CBD Fleur Lactone", "CBG Fermentation", "Sang Lactonique"],
      combinations: "Résine aux facettes lactées / fruitées + frangipani, monoï, ambrettolide + champignon blanc"
    }
  ];

  // Tabacs
  const tabacs = [
    { name: "Virginia Bright", profil: "Sucres, notes claires" },
    { name: "Virginia Orange", profil: "Agrumes, miel" },
    { name: "Virginia Deutscher", profil: "Caramel, boisé" },
    { name: "Virginia Gold", profil: "Miel, floral" },
    { name: "Virginia Italia", profil: "Fruité, lactonique" },
    { name: "Burley", profil: "Terre, chocolat" },
    { name: "Samsoun", profil: "Épices, résine" }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <div className="container py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-muted rounded-lg" />
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Breadcrumbs */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Accueil</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/programmes-recherche" className="hover:text-foreground transition-colors">Programmes-recherche</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Resines-cbd</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/5" />
        
        <div className="container relative py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-lg bg-green-500/10">
              <Leaf className="h-10 w-10 text-green-500" />
            </div>
            <div>
              <Badge className="bg-green-500 mb-2">CBD/CBG/CBN</Badge>
              <h1 className="text-4xl font-bold tracking-tight">
                Programme Résines CBD & Terpenic Design
              </h1>
            </div>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Recherche artisanale sur les résines de cannabis, profils terpéniques extrêmes et dialogues 
            avec tabac, encens et civilisations olfactives. Méthodes inspirées de Frenchy Cannoli.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <div className="bg-card px-6 py-3 rounded-lg border shadow-sm">
              <div className="text-3xl font-bold text-primary">{cbdRecipes.length}</div>
              <div className="text-sm text-muted-foreground">Profils Premium</div>
            </div>
            <div className="bg-card px-6 py-3 rounded-lg border shadow-sm">
              <div className="text-3xl font-bold text-primary">4</div>
              <div className="text-sm text-muted-foreground">Axes Génétiques</div>
            </div>
            <div className="bg-card px-6 py-3 rounded-lg border shadow-sm">
              <div className="text-3xl font-bold text-primary">94%</div>
              <div className="text-sm text-muted-foreground">Base CBD</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container py-8">
        <Tabs defaultValue="collections" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-8">
            <TabsTrigger value="collections">Collections ({collectionsCBD?.length || 0})</TabsTrigger>
            <TabsTrigger value="intention">Intention</TabsTrigger>
            <TabsTrigger value="axes">Axes Génétiques</TabsTrigger>
            <TabsTrigger value="methodes">Méthodes</TabsTrigger>
            <TabsTrigger value="profils">Profils Premium</TabsTrigger>
            <TabsTrigger value="integration">Intégration</TabsTrigger>
            <TabsTrigger value="tabacs">Tabacs</TabsTrigger>
            <TabsTrigger value="positionnement">Positionnement</TabsTrigger>
          </TabsList>

          {/* Section Collections ABSORBE */}
          <TabsContent value="collections" className="space-y-6">
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Collections Résines CBD ABSORBE</h3>
                  <p className="text-muted-foreground">
                    Dix formules artisanales combinant résines naturelles, terpènes et matières botaniques rares. 
                    Procédé hybride d'extraction (Éthanol → MCT).
                  </p>
                </div>
                <Link href="/graphe-molecules-recettes">
                  <Button variant="outline" className="shrink-0">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visualiser le graphe
                  </Button>
                </Link>
              </div>
            </div>

            {loadingCollections ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Chargement des recettes...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collectionsCBD?.map((recette) => (
                  <Link key={recette.id} href={`/resine-cbd/${recette.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <CardTitle className="text-lg">{recette.name}</CardTitle>
                        <Badge variant="secondary" className="shrink-0">
                          {(recette.intensity || 0) / 10}%
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {recette.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {recette.formula && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Composition</h4>
                          <p className="text-xs text-muted-foreground line-clamp-3">
                            {recette.formula}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 text-xs">
                        {recette.texture && (
                          <Badge variant="outline">{recette.texture}</Badge>
                        )}
                        {recette.maturationTime && (
                          <Badge variant="outline">{recette.maturationTime}j cure</Badge>
                        )}
                        {recette.stability && (
                          <Badge variant="outline">Stabilité {recette.stability}</Badge>
                        )}
                      </div>

                      {recette.protocol && (
                        <details className="text-sm">
                          <summary className="cursor-pointer font-medium text-primary hover:underline">
                            Procédé de fabrication
                          </summary>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {recette.protocol}
                          </p>
                        </details>
                      )}
                    </CardContent>
                  </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Section 1: Intention */}
          <TabsContent value="intention" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-green-500" />
                  Intention du Projet
                </CardTitle>
                <CardDescription>
                  Travail sur plantes fraîches de cannabis pour produire des résines CBD/CBG/CBN selon méthodes traditionnelles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Nous travaillons des <strong>plantes fraîches</strong> de cannabis pour produire des <strong>résines CBD / CBG / CBN</strong> selon 
                  les méthodes traditionnelles de hashish à la française (inspirées des techniques de <strong>Frenchy Cannoli</strong> : 
                  tamisage, full-melt, cure lente).
                </p>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <CardTitle className="text-base">Matériaux Olfactifs Bruts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Résines pensées comme matières premières olfactives, pas simples produits CBD
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-l-4 border-l-amber-500">
                    <CardHeader>
                      <CardTitle className="text-base">Vecteurs de Terroir</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Expression du sol, climat et culture dans chaque résine produite
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-l-4 border-l-purple-500">
                    <CardHeader>
                      <CardTitle className="text-base">Interfaces Culturelles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Dialogues entre cannabis, tabac, encens et matières premières rares
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Section 2: Axes Génétiques */}
          <TabsContent value="axes" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {axes.map((axe, idx) => (
                <Card key={idx} className={axe.color}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <span className="text-2xl">{axe.icon}</span>
                      {axe.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm font-semibold mb-2">Terpènes dominants</div>
                      <div className="flex flex-wrap gap-2">
                        {axe.terpenes.map((t, i) => (
                          <Badge key={i} variant="secondary">{t}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-semibold mb-2">Notes olfactives</div>
                      <div className="flex flex-wrap gap-2">
                        {axe.notes.map((n, i) => (
                          <Badge key={i} variant="outline">{n}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-semibold mb-2">Gammes Perfumeum</div>
                      <div className="text-sm text-muted-foreground">
                        {axe.gammes.join(", ")}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-semibold mb-2">Associations possibles</div>
                      <div className="text-sm text-muted-foreground">
                        {axe.associations.join(" · ")}
                      </div>
                    </div>

                    {axe.relatedFamilyLink && (
                      <div className="pt-2 border-t">
                        <Link href={axe.relatedFamilyLink}>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors cursor-pointer">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            {axe.relatedFamilyName}
                          </Badge>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Section 3: Méthodes */}
          <TabsContent value="methodes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="h-5 w-5 text-purple-500" />
                  Méthodes d'Extraction (inspiration Frenchy Cannoli)
                </CardTitle>
                <CardDescription>
                  Techniques traditionnelles de hashish à la française
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
                    <div>
                      <div className="font-semibold">Travail sur plante entière</div>
                      <div className="text-sm text-muted-foreground">Fleurs fraîches ou fraîchement séchées</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
                    <div>
                      <div className="font-semibold">Tamisage et séparation des trichomes</div>
                      <div className="text-sm text-muted-foreground">Ice water hash, dry sift selon les lots</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">3</div>
                    <div>
                      <div className="font-semibold">Pressage / full-melt</div>
                      <div className="text-sm text-muted-foreground">Résine stable, malléable et aromatiquement dense</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">4</div>
                    <div>
                      <div className="font-semibold">Cure lente</div>
                      <div className="text-sm text-muted-foreground">Conditions contrôlées (température, hygrométrie, obscurité)</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 rounded-lg bg-muted/50">
                  <div className="font-semibold mb-2">Chaque lot est ensuite :</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Décrit olfactivement (famille, sous-famille, références Perfumeum)</li>
                    <li>• Analysé (si possible) par chromatographie pour comprendre le profil terpénique</li>
                    <li>• Intégré ou non dans une gamme existante (Petrichor, Volcanique, Civilisations, Bio-Lab)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Protocole Standard */}
            <Card className="border-green-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-6 h-6 text-green-600" />
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
                      <Sparkles className="w-5 h-5 text-green-600" />
                      Composition
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Résine CBD brute (22-70% CBD)</span>
                        <span className="font-semibold">94%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Mélange de terpènes rares</span>
                        <span className="font-semibold">3%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Huile de support (MCT, jojoba)</span>
                        <span className="font-semibold">2%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Antioxydant naturel (Vit. E 0.5%)</span>
                        <span className="font-semibold">1%</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Timer className="w-5 h-5 text-green-600" />
                      Processus
                    </h3>
                    <ol className="space-y-2 text-sm list-decimal list-inside text-muted-foreground">
                      <li>Température de travail : <strong>35-45°C maximum</strong></li>
                      <li>Dilution préalable : Terpènes dans huile support (MCT, jojoba)</li>
                      <li>Mélange : Chauffer base résine (30-35°C), ajouter terpènes dilués</li>
                      <li>Homogénéisation : Spatule acier/verre, 10-15 minutes</li>
                      <li>Refroidissement & repos : 24h hermétique, abri lumière/air</li>
                      <li>Maturation : <strong>5-10 jours</strong> à température ambiante (15-20°C)</li>
                    </ol>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm text-foreground">
                    <strong>Option avancée :</strong> Pulvériser les terpènes sur résine friable pour un effet 
                    "live resin" (profil plus volatil et expressif).
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Section 4: Profils Premium */}
          <TabsContent value="profils" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3">{cbdRecipes.length} Profils d'Exception</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Chaque profil est inspiré de la parfumerie botanique et utilise des matières premières 
                brutes pour des éditions limitées avec une signature olfactive unique.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {cbdRecipes.map((recipe) => {
                const profileMatch = recipe.notes?.match(/Profil:\s*([^.]+)/);
                const profile = profileMatch ? profileMatch[1].trim() : '';
                
                const rarityMatch = recipe.notes?.match(/Rareté:\s*([^)]+)/);
                const rarity = rarityMatch ? rarityMatch[1].trim() : '';

                const getCardStyle = (name: string) => {
                  if (name.includes('VANILLE')) return 'border-l-4 border-l-amber-500';
                  if (name.includes('THÉ')) return 'border-l-4 border-l-yellow-500';
                  if (name.includes('ROSE')) return 'border-l-4 border-l-pink-500';
                  if (name.includes('CUIR')) return 'border-l-4 border-l-stone-500';
                  if (name.includes('MENTHE')) return 'border-l-4 border-l-green-500';
                  if (name.includes('SÉSAME')) return 'border-l-4 border-l-slate-500';
                  if (name.includes('FIGUIER')) return 'border-l-4 border-l-lime-500';
                  return 'border-l-4 border-l-gray-500';
                };

                return (
                  <Card key={recipe.id} className={`${getCardStyle(recipe.name)} hover:shadow-lg transition-shadow`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{recipe.name}</CardTitle>
                          {profile && (
                            <Badge variant="outline" className="mb-3">
                              {profile}
                            </Badge>
                          )}
                          <CardDescription className="text-sm">
                            {recipe.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {recipe.ingredients && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <Leaf className="w-4 h-4" />
                            Matières Clés
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {recipe.ingredients}
                          </p>
                        </div>
                      )}

                      <Separator />

                      {recipe.protocol && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <FlaskConical className="w-4 h-4" />
                            Protocole
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {recipe.protocol}
                          </p>
                        </div>
                      )}

                      {rarity && (
                        <div className="bg-muted/50 rounded-lg p-3 border">
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-amber-600" />
                            <span className="font-semibold">Rareté :</span>
                            <span className="text-muted-foreground">{rarity}</span>
                          </div>
                        </div>
                      )}

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
          </TabsContent>

          {/* Section 5: Intégration */}
          <TabsContent value="integration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-indigo-500" />
                  Intégration dans les Gammes Perfumeum
                </CardTitle>
                <CardDescription>
                  Les résines CBD/CBG/CBN servent de matériau vivant dans plusieurs familles olfactives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {gammes.map((gamme, idx) => (
                    <Card key={idx} className="border-l-4 border-l-primary">
                      <CardHeader>
                        <CardTitle className="text-base">{gamme.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <div className="text-sm font-semibold mb-2">Exemples</div>
                          <div className="flex flex-wrap gap-2">
                            {gamme.examples.map((ex, i) => (
                              <Badge key={i} variant="secondary">{ex}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold mb-2">Combinaisons</div>
                          <div className="text-sm text-muted-foreground">{gamme.combinations}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Section 6: Tabacs */}
          <TabsContent value="tabacs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cigarette className="h-5 w-5 text-amber-500" />
                  Rôle des Tabacs & Matrices Combustibles
                </CardTitle>
                <CardDescription>
                  Les résines sont testées et composées avec différents tabacs bruts en feuille
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-3 md:grid-cols-2">
                  {tabacs.map((tabac, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="font-medium">{tabac.name}</div>
                      <div className="text-sm text-muted-foreground">{tabac.profil}</div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="font-semibold mb-2">Objectif des accords combustibles</div>
                  <blockquote className="text-sm text-muted-foreground italic border-l-4 border-amber-500 pl-4">
                    Tabac (structure) + Résine cannabis (terroir) + Matières premières niche (perfumery-grade) 
                    = un système cohérent, olfactif, culturel et narratif.
                  </blockquote>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <strong>+ Expérimentations</strong> sur tabacs "alchimiques" internes : 
                  Philosophale, Mastiha Verde, Liquide Noir, Floréal, Tabernacle
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Section 7: Positionnement */}
          <TabsContent value="positionnement" className="space-y-6">
            <Card className="border-orange-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-500">
                  <AlertTriangle className="h-5 w-5" />
                  Positionnement & Avertissement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <p className="text-muted-foreground">Ce travail :</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>ne remplace <strong>aucun usage médical</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>ne promet <strong>aucun bénéfice santé</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>s'inscrit dans une démarche de <strong>recherche olfactive</strong>, <strong>culture du terroir</strong> et <strong>hybridation</strong> entre cannabis, parfumerie, tabac et encens</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <div className="font-semibold mb-2">Toute expérimentation de combustion ou d'inhalation doit respecter :</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• la <strong>législation en vigueur</strong></li>
                    <li>• les consignes de <strong>réduction des risques</strong></li>
                    <li>• les sensibilités culturelles des territoires d'origine (résines sacrées, encens traditionnels, tabacs de cérémonie)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Conformité */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Sécurité & Conformité</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Terpènes naturels conformes IFRA/UE/REACH. Test pureté GC (&gt;95%) et point de volatilisation.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Étiquetage</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Concentration, date, composition aromatique. Mention : "Produit aromatique technique, 
                    non destiné à la combustion directe".
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Stabilité</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Test de stabilité (viscosité, odeur, homogénéité) à 3 et 6 mois. Conservation 6-12 mois.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
