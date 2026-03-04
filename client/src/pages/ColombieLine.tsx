// @ts-nocheck
import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Leaf, Coffee, Droplet, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

const moleculeImages: Record<string, string> = {
  'Lippia Origanoides': '/colombian-botanicals/lippia-origanoides.svg',
  'Turnera Diffusa': '/colombian-botanicals/turnera-diffusa.svg',
  'Calycolpus Moritzianus': '/colombian-botanicals/calycolpus-moritzianus.svg',
  'Piper Aduncum': '/colombian-botanicals/piper-aduncum.svg',
  'Steiractinia Aspera': '/colombian-botanicals/steiractinia-aspera.svg',
  'Coffea arabica var. Geisha': '/colombian-botanicals/cafe-geisha.svg',
  'Coffea arabica flowers': '/colombian-botanicals/fleur-cafe.svg',
  'Theobroma cacao': '/colombian-botanicals/cacao-colombien.svg',
};

export default function ColombieLine() {
  const [, navigate] = useLocation();
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const toggleFavorite = (id: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const molecules = [
    {
      id: 1,
      name: 'Lippia Origanoides',
      commonName: 'Origan Sauvage',
      origin: 'Cali, Vallée du Cauca',
      profile: 'Épicé, terreux, herbacé, chaud, poivré',
      emotion: 'Énergisant, tonifiant, rituel',
      intensity: 85,
      color: 'from-amber-600 to-amber-700',
      icon: '🌿',
    },
    {
      id: 2,
      name: 'Turnera Diffusa',
      commonName: 'Damiana',
      origin: 'Cali, Vallée du Cauca',
      profile: 'Floral tropical, fruité, sucré, herbacé',
      emotion: 'Apaisante, relaxante, sensuelle',
      intensity: 75,
      color: 'from-pink-500 to-rose-600',
      icon: '🌺',
    },
    {
      id: 3,
      name: 'Calycolpus Moritzianus',
      commonName: 'Guayabita',
      origin: 'Armenia, Quindío',
      profile: 'Citrus frais, herbacé, boisé léger',
      emotion: 'Énergisant, clarifiant, stimulant',
      intensity: 80,
      color: 'from-yellow-400 to-orange-500',
      icon: '🍋',
    },
    {
      id: 4,
      name: 'Piper Aduncum',
      commonName: 'Poivre Sauvage',
      origin: 'Cali, Vallée du Cauca',
      profile: 'Poivré herbacé, fruité citrus, épicé chaud',
      emotion: 'Énergisant, stimulant, tonifiant',
      intensity: 85,
      color: 'from-red-600 to-red-700',
      icon: '🌶️',
    },
    {
      id: 5,
      name: 'Steiractinia Aspera',
      commonName: 'Endémique Rare',
      origin: 'Armenia, Quindío',
      profile: 'Boisé résineux, herbacé frais, citrus léger',
      emotion: 'Énergisant, clarifiant, tonifiant',
      intensity: 75,
      color: 'from-green-700 to-emerald-800',
      icon: '🌲',
    },
    {
      id: 6,
      name: 'Coffea arabica var. Geisha',
      commonName: 'Café Geisha',
      origin: 'Armenia, Quindío',
      profile: 'Citrus frais, fruité complexe, floral blanc',
      emotion: 'Énergisant, stimulant, clarifiant',
      intensity: 80,
      color: 'from-amber-900 to-amber-950',
      icon: '☕',
    },
    {
      id: 7,
      name: 'Coffea arabica flowers',
      commonName: 'Fleur de Café',
      origin: 'Armenia, Quindío',
      profile: 'Floral blanc pur, jasmin, rose sucré',
      emotion: 'Apaisante, relaxante, sensuelle',
      intensity: 70,
      color: 'from-white to-slate-100',
      icon: '🤍',
    },
    {
      id: 8,
      name: 'Theobroma cacao',
      commonName: 'Cacao Colombien',
      origin: 'Cali, Vallée du Cauca',
      profile: 'Chocolat complexe, floral rose, fruité',
      emotion: 'Réconfortante, apaisante, sensuelle',
      intensity: 80,
      color: 'from-amber-800 to-amber-950',
      icon: '🍫',
    },
  ];

  const recipes = [
    {
      id: 1,
      name: 'Colombie I',
      title: 'Origan Sacré',
      description: 'Hommage à Lippia Origanoides, l\'origan sauvage des Andes',
      profile: 'Épicé herbacé avec notes boisées et chocolatées',
      intensity: 8,
      texture: 'Sec',
      ingredients: ['Lippia 40%', 'Palo Santo 30%', 'Café Geisha 20%', 'Cacao 10%'],
      color: 'from-amber-600 to-amber-700',
    },
    {
      id: 2,
      name: 'Colombie II',
      title: 'Damiana Tropicale',
      description: 'Exploration de Turnera Diffusa, la damiana tropicale de Cali',
      profile: 'Floral tropical avec notes citrus et épicées',
      intensity: 7,
      texture: 'Humide',
      ingredients: ['Turnera 45%', 'Calycolpus 25%', 'Fleur de Café 20%', 'Piper 10%'],
      color: 'from-pink-500 to-rose-600',
    },
    {
      id: 3,
      name: 'Colombie III',
      title: 'Guayabita Citrus',
      description: 'Célébration de Calycolpus Moritzianus, la guayabita d\'Armenia',
      profile: 'Citrus frais et pétillant avec notes boisées',
      intensity: 7,
      texture: 'Sec',
      ingredients: ['Calycolpus 50%', 'Café Geisha 25%', 'Steiractinia 15%', 'Palo Santo 10%'],
      color: 'from-yellow-400 to-orange-500',
    },
    {
      id: 4,
      name: 'Colombie IV',
      title: 'Café Floral',
      description: 'Harmonie entre Café Geisha et Fleur de Café',
      profile: 'Floral blanc avec notes fruitées et chocolatées',
      intensity: 6,
      texture: 'Lactone',
      ingredients: ['Café Geisha 35%', 'Fleur de Café 35%', 'Turnera 20%', 'Cacao 10%'],
      color: 'from-amber-100 to-amber-200',
    },
    {
      id: 5,
      name: 'Colombie V',
      title: 'Poivre Sauvage',
      description: 'Intensité de Piper Aduncum, le poivre sauvage colombien',
      profile: 'Poivré intense avec notes épicées et boisées',
      intensity: 9,
      texture: 'Sec',
      ingredients: ['Piper 45%', 'Lippia 25%', 'Palo Santo 20%', 'Café Geisha 10%'],
      color: 'from-red-600 to-red-700',
    },
    {
      id: 6,
      name: 'Colombie VI',
      title: 'Cacao Sacré',
      description: 'Profondeur du Cacao Colombien fermenté',
      profile: 'Chocolat riche avec notes florales tropicales',
      intensity: 7,
      texture: 'Résine',
      ingredients: ['Cacao 40%', 'Turnera 30%', 'Palo Santo 20%', 'Steiractinia 10%'],
      color: 'from-amber-900 to-amber-950',
    },
    {
      id: 7,
      name: 'Colombie VII',
      title: 'Endémique Rare',
      description: 'Hommage à Steiractinia Aspera, l\'endémique rare d\'Armenia',
      profile: 'Boisé résineux avec notes citrus et florales',
      intensity: 7,
      texture: 'Pierre',
      ingredients: ['Steiractinia 40%', 'Calycolpus 30%', 'Piper 20%', 'Fleur Café 10%'],
      color: 'from-green-700 to-emerald-800',
    },
    {
      id: 8,
      name: 'Colombie VIII',
      title: 'Harmonie Complète',
      description: 'Fusion de toutes les molécules colombiennes en une harmonie parfaite',
      profile: 'Harmonie complexe de tous les profils colombiens',
      intensity: 8,
      texture: 'Air',
      ingredients: ['Lippia 15%', 'Turnera 15%', 'Calycolpus 15%', 'Piper 12%', 'Steiractinia 12%', 'Café 15%', 'Fleur 10%', 'Cacao 6%'],
      color: 'from-slate-700 to-slate-900',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-900 via-amber-800 to-amber-700 py-20 text-white">
        <div className="absolute inset-0 opacity-10"></div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="text-5xl">🇨🇴</span>
            <h1 className="text-5xl font-bold">COLOMBIE</h1>
          </div>
          <p className="mb-4 max-w-2xl text-xl text-amber-100">
            Gamme dédiée à la biodiversité olfactive colombienne : molécules endémiques, café Geisha, cacao fermenté et bois précieux.
          </p>
          <p className="text-amber-200">
            Une exploration de 10 ans de recherche olfactive en Colombie
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <Tabs defaultValue="molecules" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="molecules">Molécules (9)</TabsTrigger>
            <TabsTrigger value="recipes">Recettes (8)</TabsTrigger>
          </TabsList>

          {/* Molécules Tab */}
          <TabsContent value="molecules" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {molecules.map((mol) => (
                <Card key={mol.id} className="overflow-hidden transition-all hover:shadow-lg">
                  {moleculeImages[mol.name] && (
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      <img
                        src={moleculeImages[mol.name]}
                        alt={mol.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className={`bg-gradient-to-r ${mol.color} text-white pb-4`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="mb-2 text-3xl">{mol.icon}</div>
                        <CardTitle className="text-xl">{mol.name}</CardTitle>
                        <CardDescription className="text-amber-100">{mol.commonName}</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(mol.id)}
                        className="text-white hover:bg-white/20"
                      >
                        <Heart
                          className={`h-5 w-5 ${favorites.has(mol.id) ? 'fill-current' : ''}`}
                        />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <MapPin className="h-4 w-4" />
                          Origine
                        </div>
                        <p className="text-sm text-slate-600">{mol.origin}</p>
                      </div>
                      <div>
                        <div className="mb-2 text-sm font-semibold text-slate-700">Profil olfactif</div>
                        <p className="text-sm text-slate-600">{mol.profile}</p>
                      </div>
                      <div>
                        <div className="mb-2 text-sm font-semibold text-slate-700">Résonance émotionnelle</div>
                        <p className="text-sm text-slate-600">{mol.emotion}</p>
                      </div>
                      <div>
                        <div className="mb-2 text-sm font-semibold text-slate-700">Intensité</div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full bg-gradient-to-r from-amber-500 to-amber-700"
                              style={{ width: `${mol.intensity}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-slate-700">{mol.intensity}/100</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recettes Tab */}
          <TabsContent value="recipes" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              {recipes.map((recipe) => (
                <Card key={recipe.id} className="overflow-hidden transition-all hover:shadow-lg">
                  <CardHeader className={`bg-gradient-to-r ${recipe.color} text-white pb-4`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{recipe.name}</CardTitle>
                        <CardDescription className="text-lg font-semibold text-white/90">
                          {recipe.title}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(recipe.id + 100)}
                        className="text-white hover:bg-white/20"
                      >
                        <Heart
                          className={`h-5 w-5 ${favorites.has(recipe.id + 100) ? 'fill-current' : ''}`}
                        />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <p className="text-sm text-slate-600">{recipe.description}</p>
                      <div>
                        <div className="mb-2 text-sm font-semibold text-slate-700">Profil</div>
                        <p className="text-sm text-slate-600">{recipe.profile}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{recipe.texture}</Badge>
                        <Badge variant="outline">Intensité {recipe.intensity}/10</Badge>
                      </div>
                      <div>
                        <div className="mb-2 text-sm font-semibold text-slate-700">Ingrédients principaux</div>
                        <div className="flex flex-wrap gap-1">
                          {recipe.ingredients.map((ing, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {ing}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        onClick={() => navigate(`/recette/colombie-${recipe.id}`)}
                        className="mt-4 w-full bg-amber-600 hover:bg-amber-700"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Voir les détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Information Section */}
        <div className="mt-20 grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                Plantes endémiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                5 molécules provenant de plantes endémiques colombiennes : Lippia, Turnera, Calycolpus, Piper et Steiractinia.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="h-5 w-5 text-amber-700" />
                Café & Cacao
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Café Geisha rare d\'Armenia et Cacao fermenté de Cali : deux trésors colombiens intégrés à la gamme.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-blue-600" />
                Extraction premium
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Hydrodistillation, extraction CO2 supercritique et enfleurage pour préserver toute la complexité olfactive.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Fournisseurs Section */}
        <div className="mt-16 rounded-lg bg-white dark:bg-slate-800 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Fournisseurs partenaires</h2>
            <Link href="/sourcing/colombie">
              <Button variant="outline" className="btn-enhanced flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Découvrir le Sourcing
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                <MapPin className="h-5 w-5 text-amber-600" />
                Cali, Vallée du Cauca
              </h3>
              <p className="text-sm text-slate-600">
                Fournisseur local spécialisé dans les plantes aromatiques endémiques et le cacao fermenté.
              </p>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>• Lippia Origanoides</p>
                <p>• Turnera Diffusa</p>
                <p>• Piper Aduncum</p>
                <p>• Cacao Colombien</p>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 p-6">
              <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <MapPin className="h-5 w-5 text-amber-600" />
                Armenia, Quindío
              </h3>
              <p className="text-sm text-slate-600">
                Fournisseur spécialisé dans le café Geisha et les plantes endémiques rares.
              </p>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>• Café Geisha</p>
                <p>• Fleur de Café</p>
                <p>• Calycolpus Moritzianus</p>
                <p>• Steiractinia Aspera</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
