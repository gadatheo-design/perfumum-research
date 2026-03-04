// @ts-nocheck
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { ChevronLeft, Heart, Share2, Beaker } from 'lucide-react';
import perfumumData from '@/data/PERFUMUM_FINAL_DATA.json';
import { useState } from 'react';

interface Accord {
  id: string;
  nom: string;
  description: string;
  molécules: string[];
  intensité: number;
  notes: string;
}

export default function AccordDetail() {
  const [, navigate] = useLocation();
  const [isFavorite, setIsFavorite] = useState(false);

  // Récupérer l'ID de l'accord depuis l'URL
  const accordId = new URLSearchParams(window.location.search).get('id') || 'ACC-001';
  
  const accords = (perfumumData.accords || []) as Accord[];
  const accord = accords.find(a => a.id === accordId);

  if (!accord) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Accord non trouvé</h1>
            <Button onClick={() => navigate('/recherche')}>
              Retour à la recherche
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculer la couleur d'intensité
  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return 'bg-blue-100 text-blue-800';
    if (intensity <= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getIntensityLabel = (intensity: number) => {
    if (intensity <= 3) return 'Léger';
    if (intensity <= 6) return 'Moyen';
    return 'Intense';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: 'Accueil', href: '/' },
          { label: 'Recherche', href: '/recherche' },
          { label: 'Claims & Preuves', href: '/claims-and-proofs' },
          { label: accord.nom, href: '#' }
        ]} />

        {/* En-tête avec actions */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="mb-4"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <h1 className="text-4xl font-bold mb-2">{accord.nom}</h1>
              <p className="text-lg text-muted-foreground">{accord.description}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Caractéristiques */}
            <Card>
              <CardHeader>
                <CardTitle>Caractéristiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2">Intensité olfactive</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="w-full bg-secondary rounded-full h-3">
                        <div
                          className="bg-primary h-3 rounded-full"
                          style={{ width: `${(accord.intensité / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                    <Badge className={getIntensityColor(accord.intensité)}>
                      {accord.intensité}/10 - {getIntensityLabel(accord.intensité)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">Notes descriptives</h3>
                  <p className="text-muted-foreground">{accord.notes}</p>
                </div>
              </CardContent>
            </Card>

            {/* Molécules composantes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="w-5 h-5" />
                  Molécules composantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {accord.molécules.map((molecule, index) => (
                    <div
                      key={index}
                      className="p-3 bg-secondary rounded-lg border border-border hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <p className="text-sm font-medium capitalize">{molecule}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Profil sensoriel */}
            <Card>
              <CardHeader>
                <CardTitle>Profil sensoriel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Famille olfactive</p>
                    <p className="font-semibold">Accord complexe</p>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Durée de vie</p>
                    <p className="font-semibold">Longue tenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Barre latérale */}
          <div className="space-y-6">
            {/* Informations générales */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">ID Accord</p>
                  <p className="font-mono">{accord.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Nombre de molécules</p>
                  <p className="font-semibold">{accord.molécules.length}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Statut</p>
                  <Badge>Validé</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-2">
              <Button className="w-full" variant="default">
                Ajouter à ma collection
              </Button>
              <Button className="w-full" variant="outline">
                Voir les recettes
              </Button>
            </div>
          </div>
        </div>

        {/* Accords similaires */}
        <Card>
          <CardHeader>
            <CardTitle>Accords similaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {accords.slice(0, 3).map((similar) => (
                <div
                  key={similar.id}
                  className="p-4 border border-border rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/accord-detail?id=${similar.id}`)}
                >
                  <h3 className="font-semibold mb-2">{similar.nom}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{similar.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{similar.molécules.length} molécules</Badge>
                    <Badge className={getIntensityColor(similar.intensité)}>
                      {similar.intensité}/10
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
