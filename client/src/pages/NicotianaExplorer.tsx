import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NicotianaPhylogeny } from '@/components/NicotianaPhylogeny';
import { NicotianaPhylogenyInteractive } from '@/components/NicotianaPhylogenyInteractive';
import { PhylogeneticTree } from '@/components/PhylogeneticTree';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Leaf, MapPin, Beaker } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Loader2 } from 'lucide-react';

export default function NicotianaExplorer() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 space-y-6">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            Phylogénétique • 60 Espèces • 9 Sections
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-foreground">Explorateur Nicotiana</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Découvrez l'arbre phylogénétique complet du genre Nicotiana basé sur l'analyse moléculaire de Santilli et al. (2022). Explorez les 60 espèces, leurs relations évolutives, distributions géographiques et profils moléculaires.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">60</div>
                <p className="text-sm text-muted-foreground mt-1">Espèces</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">9</div>
                <p className="text-sm text-muted-foreground mt-1">Sections</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">1</div>
                <p className="text-sm text-muted-foreground mt-1">Nouvelle Espèce</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">1</div>
                <p className="text-sm text-muted-foreground mt-1">En Danger Critique</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="phylogeny" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="phylogeny" className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              <span className="hidden sm:inline">Arbre Phylogénétique</span>
              <span className="sm:hidden">Arbre</span>
            </TabsTrigger>
            <TabsTrigger value="species" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Parcourir les Espèces</span>
              <span className="sm:hidden">Espèces</span>
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Beaker className="h-4 w-4" />
              <span className="hidden sm:inline">Informations</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="phylogeny" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Arbre Phylogénétique Interactif</CardTitle>
                <CardDescription>
                  Cliquez sur une espèce pour voir ses détails. Les couleurs représentent les différentes sections taxonomiques.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PhylogeneticTreeWrapper />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="species" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Parcourir par Section Taxonomique</CardTitle>
                <CardDescription>
                  Explorez les espèces organisées par section taxonomique avec leurs métadonnées complètes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NicotianaPhylogenyInteractive />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    Espèces Menacées
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm">
                    <p className="font-semibold text-red-600">N. rupicola - EN DANGER CRITIQUE (CR)</p>
                    <p className="text-muted-foreground text-xs mt-1">Espèce nouvellement décrite, endémique du Chili, avec une distribution extrêmement restreinte.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Méthodologie Phylogénétique</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><strong>Source:</strong> Santilli et al. (2022)</p>
                  <p><strong>Gènes:</strong> ITS, rbcL, matK</p>
                  <p><strong>Méthode:</strong> Analyse phylogénétique bayésienne</p>
                  <p><strong>Support:</strong> Valeurs de bootstrap et probabilités postérieures</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Les 9 Sections Taxonomiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p>• <strong>Suaveolentes</strong> - 11 espèces</p>
                  <p>• <strong>Noctiforae</strong> - 4 espèces</p>
                  <p>• <strong>Alatae</strong> - 3 espèces</p>
                  <p>• <strong>Nicotiana</strong> - 2 espèces</p>
                  <p>• <strong>Sylvestris</strong> - 1 espèce</p>
                  <p>• <strong>Repandae</strong> - 2 espèces</p>
                  <p>• <strong>Petunioldes</strong> - 1 espèce</p>
                  <p>• <strong>Trigonophyllae</strong> - 2 espèces</p>
                  <p>• <strong>Paniculatae & autres</strong> - 34 espèces</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Données Disponibles par Espèce</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p>✓ Morphologie (feuilles, fleurs, tiges)</p>
                  <p>✓ Distribution géographique</p>
                  <p>✓ Profil moléculaire (alcaloïdes)</p>
                  <p>✓ Statut de conservation</p>
                  <p>✓ Usages ethnobotaniques</p>
                  <p>✓ Références scientifiques</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


/**
 * PhylogeneticTreeWrapper - Component to fetch and display phylogenetic tree
 */
function PhylogeneticTreeWrapper() {
  const [layout, setLayout] = useState<"tree" | "radial">("tree");
  const [selectedVariety, setSelectedVariety] = useState<any>(null);

  const { data: treeData, isLoading, error } = trpc.phylogeny.getPhylogeneticTree.useQuery({
    genus: "Nicotiana",
    species: "tabacum",
    layout,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600">Loading phylogenetic tree...</p>
        </div>
      </div>
    );
  }

  if (error || !treeData) {
    return (
      <Card className="p-6 border-red-200 bg-red-50">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-red-900">Error Loading Data</h3>
            <p className="text-sm text-red-700 mt-1">
              {error?.message || "Failed to load phylogenetic tree"}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <PhylogeneticTree
        data={treeData}
        layout={layout}
        onNodeSelect={setSelectedVariety}
      />
    </div>
  );
}
