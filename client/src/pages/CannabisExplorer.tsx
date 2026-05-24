import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PhylogeneticTreeCollapsible } from '@/components/PhylogeneticTreeCollapsible';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Leaf, MapPin, Beaker } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Loader2 } from 'lucide-react';

export default function CannabisExplorer() {
  const [layout, setLayout] = useState<'tree' | 'radial'>('tree');
  const [selectedVariety, setSelectedVariety] = useState<string | null>(null);

  // Récupérer l'arbre phylogénétique pour Cannabis
  const { data: treeData, isLoading: isLoadingTree, error: treeError } = trpc.phylogeny.getPhylogeneticTree.useQuery({
    genus: 'Cannabis',
  });

  // Récupérer les statistiques de conservation
  const { data: stats, isLoading: isLoadingStats } = trpc.phylogeny.getConservationStats.useQuery({
    genus: 'Cannabis',
  });

  if (isLoadingTree || isLoadingStats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-600">Chargement de l'explorateur Cannabis...</p>
        </div>
      </div>
    );
  }

  if (treeError) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertCircle className="h-5 w-5" />
              Erreur de chargement
            </CardTitle>
          </CardHeader>
          <CardContent className="text-red-800">
            Impossible de charger l'arbre phylogénétique du Cannabis. Veuillez réessayer plus tard.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!treeData) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900">
              <AlertCircle className="h-5 w-5" />
              Données non disponibles
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-800">
            Les données généalogiques pour le Cannabis ne sont pas encore disponibles. 
            Veuillez importer les données via la page d'administration.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight">Explorateur Cannabis</h1>
        <p className="text-lg text-slate-600">
          Arbre phylogénétique interactif du genre Cannabis avec landraces, hybrides et lignées de sélection modernes.
        </p>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Variétés Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.totalVarieties || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Cultivars</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.cultivars || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Hybrides</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.hybrids || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Landraces</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.landraces || 0}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Onglets */}
      <Tabs defaultValue="tree" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tree">Arbre Phylogénétique</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="about">À Propos</TabsTrigger>
        </TabsList>

        {/* Onglet Arbre */}
        <TabsContent value="tree" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Arbre Généalogique Interactif</CardTitle>
                  <CardDescription>
                    Cliquez sur les nœuds pour replier/dépiler les branches. Utilisez la molette pour zoomer.
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLayout('tree')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      layout === 'tree'
                        ? 'bg-primary text-white'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    Vertical
                  </button>
                  <button
                    onClick={() => setLayout('radial')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      layout === 'radial'
                        ? 'bg-primary text-white'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    Circulaire
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {treeData && (
                <PhylogeneticTreeCollapsible
                  data={treeData}
                  layout={layout}
                  onNodeSelect={(node) => setSelectedVariety(node.varietyId)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Statistiques */}
        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques de Couverture</CardTitle>
              <CardDescription>
                État de complétude des données généalogiques et moléculaires
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-2">Variétés avec parents documentés</p>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${stats?.parentDocumentation || 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{stats?.parentDocumentation || 0}%</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-2">Variétés avec profils moléculaires</p>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${stats?.molecularCoverage || 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{stats?.molecularCoverage || 0}%</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-2">Variétés avec distribution géographique</p>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${stats?.geographicCoverage || 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{stats?.geographicCoverage || 0}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statuts de Conservation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Statuts de Conservation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats?.conservationStatus && Object.entries(stats?.conservationStatus).map(([status, count]) => (
                  <div key={status} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{status}</span>
                    <span className="text-sm text-slate-600">{count} variétés</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet À Propos */}
        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>À Propos de l'Explorateur Cannabis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Couverture Généalogique</h4>
                <p className="text-slate-700">
                  Cet explorateur couvre les principales landraces du Cannabis (Afghan, Thai, Columbian, etc.), 
                  les hybrides modernes de sélection, et les lignées commerciales actuelles. 
                  Les données incluent les relations parentales, les années de création, et les obtenteurs.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Profils Moléculaires</h4>
                <p className="text-slate-700">
                  Chaque variété est associée à un profil terpénique et cannabinoïde basé sur :
                </p>
                <ul className="list-disc list-inside text-slate-700 mt-2 space-y-1">
                  <li>Analyses GC-MS de littérature scientifique</li>
                  <li>Données de banques génétiques commerciales</li>
                  <li>Profils de sélection documentés</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Interactions Disponibles</h4>
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  <li>Collapse/Expand des branches pour naviguer les grands arbres</li>
                  <li>Zoom & Pan interactif (molette souris, double-clic pour reset)</li>
                  <li>Recherche par nom scientifique ou nom commun</li>
                  <li>Affichage des détails au survol et clic</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
