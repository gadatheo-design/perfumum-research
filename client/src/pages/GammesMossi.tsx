import { useState } from 'react';
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Flame, Droplets, Sun, Trees, Moon, Sparkles, MapPin, BookOpen } from 'lucide-react';

export default function GammesMossi() {
  const [selectedAccord, setSelectedAccord] = useState<string | null>(null);

  const accords = [
    {
      id: 'mossi_clair',
      nom: 'Mossi Clair',
      concept: "Accord lumineux, minéral, aérien, évoquant la première lumière du Sahel",
      profil: "poussière claire, encens blanc, lumière",
      famille: "Minéral / Encens",
      intensite: 3,
      chaleur: "froid",
      humidite: "sec",
      icon: Sun,
      color: "from-yellow-50 to-amber-100",
      borderColor: "border-yellow-300",
      ingredients: [
        { phase: "Tête", items: ["Citrus sec 5%", "Aldéhydes chauds 3%", "Feuille d'oranger sèche 2%", "Ozone minéral clair 1%"] },
        { phase: "Cœur", items: ["Oliban clair 14%", "Argile blanche 10%", "Ionone blanche 8%", "Bois tendre 8%"] },
        { phase: "Fond", items: ["Karité clair 10%", "Ambrettolide 4%", "Cèdre beige 12%", "Poussière blanche du Sahel 14%"] }
      ],
      effet: "Clarté mentale, ancrage, respiration",
      interpretation: "Représentation de l'aube, du vent sec du Plateau Central, et de la pureté rituelle. Très fidèle aux rites de purification Mossi (encens clair, matin)."
    },
    {
      id: 'mossi_sombre',
      nom: 'Mossi Sombre',
      concept: "Accord nocturne, rituel, profond. Terre noire + myrrhe + bois",
      profil: "ombre chaude, résine sacrée, terre humide",
      famille: "Terre / Résine",
      intensite: 5,
      chaleur: "chaud",
      humidite: "humide",
      icon: Moon,
      color: "from-stone-800 to-amber-900",
      borderColor: "border-stone-700",
      textColor: "text-stone-100",
      ingredients: [
        { phase: "Tête", items: ["Fumée douce 4%", "Aldéhydes sombres 3%", "Cuir fumé trace"] },
        { phase: "Cœur", items: ["Myrrhe noire 10%", "Oliban brûlé 8%", "Terre noire 12%", "Bois de brousse 10%"] },
        { phase: "Fond", items: ["Karité fumé sombre 20%", "Vetiver Assam 8%", "Styrax 7%", "Ambre profond 15%"] }
      ],
      effet: "Gravité, introspection, profondeur",
      interpretation: "Représente la nuit des ancêtres. Fort lien avec les rites funéraires Mossi où la terre est centrale. L'accord est parfaitement enraciné culturellement."
    },
    {
      id: 'mossi_du_feu',
      nom: 'Mossi du Feu',
      concept: "Accord métallique, incandescent. Fer chaud + acacia brûlé",
      profil: "incandescent, métallique, boisé-brûlé",
      famille: "Métal / Résine",
      intensite: 5,
      chaleur: "brûlant",
      humidite: "sec",
      icon: Flame,
      color: "from-orange-600 to-red-700",
      borderColor: "border-orange-500",
      textColor: "text-orange-50",
      ingredients: [
        { phase: "Tête", items: ["Fer chaud 4%", "Aldéhydes métalliques 3%", "Fumée légère 3%"] },
        { phase: "Cœur", items: ["Acacia brûlé 15%", "Charcoal africain 10%", "Bois sec 10%"] },
        { phase: "Fond", items: ["Terre ferrique 20%", "Myrrhe chaude 10%", "Labdanum 10%", "Ambergris trace 3%", "Vetiver fumé 12%"] }
      ],
      effet: "Énergie, courage, transformation",
      interpretation: "Correspond à la Forge Royale : symbolique de la transformation. Le feu est lié à la puissance des Ouedraogo, symboles de chevaliers-guerriers."
    },
    {
      id: 'mossi_verger_sacre',
      nom: 'Mossi Verger Sacré',
      concept: "Accord végétal sacré. Neem + karité vert + herbes sèches",
      profil: "ombre fraîche, bois sacré, herbes sèches",
      famille: "Vert / Herbacé",
      intensite: 4,
      chaleur: "tiède",
      humidite: "humide",
      icon: Trees,
      color: "from-green-100 to-emerald-200",
      borderColor: "border-green-400",
      ingredients: [
        { phase: "Tête", items: ["Feuille verte 6%", "Aldéhyde feuille 3%", "Citrus sec 2%", "Ozone clair 2%"] },
        { phase: "Cœur", items: ["Neem 12%", "Karité vert 8%", "Herbes sèches 10%", "Foin chaud 10%"] },
        { phase: "Fond", items: ["Bois tendre 15%", "Ambrettolide 5%", "Cèdre clair 12%", "Résine douce 13%"] }
      ],
      effet: "Protection, calme, familiarité",
      interpretation: "Espace domestique + sacré. Le neem est centrale dans la culture Mossi (protection, purification). Accord équilibré, très ancré dans le réel Mossi quotidien."
    },
    {
      id: 'mossi_solaire',
      nom: 'Mossi Solaire',
      concept: "Accord lumineux, chaud, glorieux. Encens doré + millet chaud",
      profil: "solaire, noble, céréale sacrée",
      famille: "Epicé / Céréales",
      intensite: 4,
      chaleur: "chaud",
      humidite: "sec",
      icon: Sparkles,
      color: "from-amber-300 to-yellow-500",
      borderColor: "border-amber-400",
      ingredients: [
        { phase: "Tête", items: ["Aldéhydes chauds 10%", "Citron sec 10%"] },
        { phase: "Cœur", items: ["Encens doré 20%", "Millet chaud 20%"] },
        { phase: "Fond", items: ["Labdanum 20%", "Terre claire 20%"] }
      ],
      effet: "Optimisme, chaleur, vitalité",
      interpretation: "Représentation des cultures, du soleil, de la noblesse. Très lié à la symbolique Ouedraogo (cheval blanc, soleil, lumière)."
    }
  ];

  const cosmologie = [
    {
      nom: "Nyinsi",
      titre: "Terre-mère",
      description: "Principe nourricier (profondeur, humilité, continuité)",
      icon: Droplets,
      color: "text-stone-600"
    },
    {
      nom: "Wende",
      titre: "Principe solaire",
      description: "Chaleur, verticalité, respect",
      icon: Sun,
      color: "text-amber-500"
    },
    {
      nom: "Roaga",
      titre: "Lignée royale",
      description: "Autorité calme, stabilité, mémoire",
      icon: Flame,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      <div className="flex-1 bg-gradient-to-b from-amber-50 via-stone-50 to-orange-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-900 via-orange-800 to-red-900 text-white">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20"></div>
          <div className="container relative py-16 md:py-24">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-6 w-6" />
              <span className="text-amber-200 font-medium">Burkina Faso - Plateau Central</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Accords Mossi
            </h1>
            <p className="text-xl md:text-2xl text-amber-100 max-w-3xl mb-6">
              Une cosmologie olfactive du Plateau Central
            </p>
            <p className="text-lg text-amber-200 max-w-2xl">
              Parcours immersif en cinq espaces : Clair, Sombre, Feu, Verger, Solaire. 
              Basé sur les accords olfactifs Mossi et la cosmologie de la lignée Ouedraogo.
            </p>
          </div>
        </div>

        {/* Cosmologie Section */}
        <div className="container py-12">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="h-6 w-6 text-amber-700" />
            <h2 className="text-3xl font-bold text-stone-900">Cosmologie Mossi</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {cosmologie.map((pilier) => {
              const Icon = pilier.icon;
              return (
                <Card key={pilier.nom} className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`h-8 w-8 ${pilier.color}`} />
                      <div>
                        <CardTitle className="text-xl">{pilier.nom}</CardTitle>
                        <CardDescription className="font-medium">{pilier.titre}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-stone-600">{pilier.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Les 5 Accords */}
          <h2 className="text-3xl font-bold text-stone-900 mb-8">Les Cinq Accords</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {accords.map((accord) => {
              const Icon = accord.icon;
              return (
                <Card 
                  key={accord.id}
                  className={`cursor-pointer transition-all hover:scale-105 border-2 ${accord.borderColor} ${selectedAccord === accord.id ? 'ring-4 ring-amber-400' : ''}`}
                  onClick={() => setSelectedAccord(accord.id)}
                >
                  <CardHeader className={`bg-gradient-to-br ${accord.color} ${accord.textColor || 'text-stone-900'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="h-8 w-8" />
                      <CardTitle className="text-xl">{accord.nom}</CardTitle>
                    </div>
                    <CardDescription className={accord.textColor || 'text-stone-700'}>
                      {accord.famille}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-stone-500 mb-1">Profil olfactif</p>
                        <p className="text-stone-900 italic">"{accord.profil}"</p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline">Intensité: {'★'.repeat(accord.intensite)}</Badge>
                        <Badge variant="outline">{accord.chaleur}</Badge>
                        <Badge variant="outline">{accord.humidite}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Détails de l'accord sélectionné */}
          {selectedAccord && (
            <Card className="border-2 border-amber-400 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                <CardTitle className="text-2xl">
                  {accords.find(a => a.id === selectedAccord)?.nom}
                </CardTitle>
                <CardDescription className="text-lg">
                  {accords.find(a => a.id === selectedAccord)?.concept}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="formule" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="formule">Formule</TabsTrigger>
                    <TabsTrigger value="interpretation">Interprétation</TabsTrigger>
                    <TabsTrigger value="effet">Effet sensoriel</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="formule" className="space-y-4 mt-6">
                    {accords.find(a => a.id === selectedAccord)?.ingredients.map((phase, idx) => (
                      <div key={idx}>
                        <h4 className="font-semibold text-lg text-amber-900 mb-2">{phase.phase}</h4>
                        <ul className="space-y-1 ml-4">
                          {phase.items.map((item, i) => (
                            <li key={i} className="text-stone-700">• {item}</li>
                          ))}
                        </ul>
                        {idx < 2 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="interpretation" className="mt-6">
                    <p className="text-stone-700 leading-relaxed">
                      {accords.find(a => a.id === selectedAccord)?.interpretation}
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="effet" className="mt-6">
                    <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                      <p className="text-lg font-medium text-amber-900">
                        {accords.find(a => a.id === selectedAccord)?.effet}
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Installation Artistique */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-stone-900 mb-4">Installation Artistique</h2>
            <h3 className="text-xl text-stone-600 mb-8">"Les Cinq Mondes Mossi"</h3>
            
            <Card className="border-2 border-amber-300">
              <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
                <CardTitle>Parcours immersif en cinq espaces</CardTitle>
                <CardDescription>
                  Une cosmologie olfactive vivante, non documentaire, mais sensitive
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-200 flex items-center justify-center font-bold">1</div>
                    <div>
                      <p className="font-semibold">La naissance (Clair)</p>
                      <p className="text-sm text-stone-600">Pureté, calme, ouverture du monde</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-stone-700 text-white flex items-center justify-center font-bold">2</div>
                    <div>
                      <p className="font-semibold">La mémoire (Sombre)</p>
                      <p className="text-sm text-stone-600">Immersion dans la mémoire collective</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">3</div>
                    <div>
                      <p className="font-semibold">La transformation (Feu)</p>
                      <p className="text-sm text-stone-600">Air chaud, métal, puissance</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-400 flex items-center justify-center font-bold">4</div>
                    <div>
                      <p className="font-semibold">La protection (Verger)</p>
                      <p className="text-sm text-stone-600">Fraîcheur sacrée, repos, ombre protectrice</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center font-bold">5</div>
                    <div>
                      <p className="font-semibold">La noblesse (Solaire)</p>
                      <p className="text-sm text-stone-600">Expansion, chaleur, vitalité</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
