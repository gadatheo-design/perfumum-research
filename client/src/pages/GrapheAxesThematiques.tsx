// @ts-nocheck
/**
 * Page Graphe des Axes Thématiques
 * Visualise les connexions entre entités PERFUMUM avec un graphe de force D3.js
 */

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ForceGraph } from "@/components/charts/ForceGraph";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Network, 
  Atom, 
  FlaskConical, 
  Layers, 
  ArrowLeft,
  Info,
  Sparkles,
  Globe,
  Leaf
} from "lucide-react";
import { toast } from "sonner";

type ViewMode = 'molecules-recettes' | 'prototypes-families' | 'plants-terroirs' | 'full';

export default function GrapheAxesThematiques() {
  const [viewMode, setViewMode] = useState<ViewMode>('molecules-recettes');

  // Charger les données
  const { data: molecules, isLoading: loadingMolecules } = trpc.molecules.list.useQuery();
  const { data: recettes, isLoading: loadingRecettes } = trpc.recettes.list.useQuery();
  const { data: prototypes, isLoading: loadingPrototypes } = trpc.prototypes.list.useQuery();
  const { data: families, isLoading: loadingFamilies } = trpc.families.list.useQuery();
  const { data: plantMoleculeLinks, isLoading: loadingLinks } = trpc.plantMoleculeLinks.getAll.useQuery();
  const { data: plants, isLoading: loadingPlants } = trpc.plants.list.useQuery();
  const { data: terroirs, isLoading: loadingTerroirs } = trpc.terroirs.getAll.useQuery();

  const isLoading = loadingMolecules || loadingRecettes || loadingPrototypes || 
                   loadingFamilies || loadingPlants || loadingTerroirs;

  // Construire les données du graphe selon le mode
  const graphData = useMemo(() => {
    if (isLoading) return { nodes: [], links: [] };

    const nodes: any[] = [];
    const links: any[] = [];

    switch (viewMode) {
      case 'molecules-recettes':
        // Nœuds molécules
        molecules?.forEach(mol => {
          nodes.push({
            id: `mol-${mol.id}`,
            name: mol.name,
            type: 'molecule',
            group: mol.chemicalClass || 'Non classé',
            value: 1,
            metadata: {
              chemicalClass: mol.chemicalClass,
              cas: mol.casNumber,
            }
          });
        });

        // Nœuds recettes
        recettes?.forEach(rec => {
          nodes.push({
            id: `rec-${rec.id}`,
            name: rec.name,
            type: 'recette',
            group: (rec as any).prototypeCode || 'Sans prototype',
            value: 2,
            metadata: {
              prototype: (rec as any).prototypeCode,
              status: rec.status,
            }
          });
        });

        // Note: Les liens molécule-recette sont chargés dynamiquement via les recettes
        // On crée des liens basés sur les familles olfactives des molécules
        molecules?.forEach(mol => {
          if ((mol as any).familyId) {
            const family = families?.find(f => f.id === (mol as any).familyId);
            if (family) {
              links.push({
                source: `mol-${mol.id}`,
                target: `fam-${family.id}`,
                value: 1,
                type: 'appartenance',
              });
            }
          }
        });
        break;

      case 'prototypes-families':
        // Nœuds prototypes
        prototypes?.forEach(proto => {
          nodes.push({
            id: `proto-${proto.id}`,
            name: proto.name,
            type: 'prototype',
            group: proto.code,
            value: 3,
            metadata: {
              code: proto.code,
              emoji: proto.emoji,
            }
          });
        });

        // Nœuds familles
        families?.forEach(fam => {
          nodes.push({
            id: `fam-${fam.id}`,
            name: fam.name,
            type: 'family',
            group: fam.type || 'Non classé',
            value: 2,
            metadata: {
              type: fam.type,
            }
          });
        });

        // Liens prototype-famille (via les recettes)
        recettes?.forEach(rec => {
          if ((rec as any).prototypeCode && rec.familyId) {
            const protoNode = prototypes?.find(p => p.code === (rec as any).prototypeCode);
            if (protoNode) {
              links.push({
                source: `proto-${protoNode.id}`,
                target: `fam-${rec.familyId}`,
                value: 1,
                type: 'association',
              });
            }
          }
        });
        break;

      case 'plants-terroirs':
        // Nœuds plantes
        plants?.forEach(plant => {
          nodes.push({
            id: `plant-${plant.id}`,
            name: plant.name,
            type: 'plant',
            group: plant.family || 'Non classé',
            value: 1,
            metadata: {
              family: plant.family,
              latinName: plant.latinName,
            }
          });
        });

        // Nœuds terroirs
        terroirs?.forEach((terroir: any) => {
          nodes.push({
            id: `terroir-${terroir.id}`,
            name: terroir.name,
            type: 'terroir',
            group: terroir.region || 'Non classé',
            value: 2,
            metadata: {
              region: terroir.region,
              country: terroir.country,
            }
          });
        });

        // Liens plante-terroir (si disponibles dans les données)
        // Note: Ces liens dépendent de la structure de données existante
        break;

      case 'full':
        // Vue complète avec toutes les entités
        molecules?.slice(0, 50).forEach(mol => {
          nodes.push({
            id: `mol-${mol.id}`,
            name: mol.name,
            type: 'molecule',
            value: 1,
          });
        });

        recettes?.slice(0, 30).forEach(rec => {
          nodes.push({
            id: `rec-${rec.id}`,
            name: rec.name,
            type: 'recette',
            value: 2,
          });
        });

        prototypes?.forEach(proto => {
          nodes.push({
            id: `proto-${proto.id}`,
            name: proto.name,
            type: 'prototype',
            value: 3,
          });
        });

        families?.slice(0, 20).forEach(fam => {
          nodes.push({
            id: `fam-${fam.id}`,
            name: fam.name,
            type: 'family',
            value: 2,
          });
        });

        // Liens molécule-famille
        molecules?.slice(0, 50).forEach(mol => {
          if ((mol as any).familyId) {
            const famNode = nodes.find(n => n.id === `fam-${(mol as any).familyId}`);
            if (famNode) {
              links.push({
                source: `mol-${mol.id}`,
                target: `fam-${(mol as any).familyId}`,
                value: 1,
              });
            }
          }
        });
        break;
    }

    return { nodes, links };
  }, [viewMode, molecules, recettes, prototypes, families, plantMoleculeLinks, plants, terroirs, isLoading]);

  const handleNodeClick = (node: any) => {
    const type = node.type;
    const id = node.id.split('-')[1];
    
    toast.info(`${node.name}`, {
      description: `Type: ${type} | ID: ${id}`,
      action: {
        label: "Voir détails",
        onClick: () => {
          // Navigation vers la page de détail selon le type
          switch (type) {
            case 'molecule':
              window.location.href = `/molecules/${id}`;
              break;
            case 'recette':
              window.location.href = `/recettes/${id}`;
              break;
            case 'prototype':
              window.location.href = `/gammes`;
              break;
          }
        }
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Link href="/graphe-relations">
                <Button variant="ghost" size="sm" className="mb-6 gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Retour aux visualisations
                </Button>
              </Link>
              
              <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
                <Network className="w-4 h-4 mr-2" />
                Graphe de Force D3.js
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                Axes Thématiques
              </h1>
              
              <p className="text-lg text-muted-foreground">
                Explorez les connexions entre les entités PERFUMUM à travers un graphe interactif.
                Visualisez les relations entre molécules, recettes, prototypes et familles olfactives.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container space-y-8">
            {/* View Mode Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                  <TabsTrigger value="molecules-recettes" className="gap-2">
                    <Atom className="w-4 h-4" />
                    <span className="hidden sm:inline">Molécules-Recettes</span>
                    <span className="sm:hidden">Mol-Rec</span>
                  </TabsTrigger>
                  <TabsTrigger value="prototypes-families" className="gap-2">
                    <Layers className="w-4 h-4" />
                    <span className="hidden sm:inline">Prototypes-Familles</span>
                    <span className="sm:hidden">Proto-Fam</span>
                  </TabsTrigger>
                  <TabsTrigger value="plants-terroirs" className="gap-2">
                    <Leaf className="w-4 h-4" />
                    <span className="hidden sm:inline">Plantes-Terroirs</span>
                    <span className="sm:hidden">Plant-Terr</span>
                  </TabsTrigger>
                  <TabsTrigger value="full" className="gap-2">
                    <Globe className="w-4 h-4" />
                    <span className="hidden sm:inline">Vue Complète</span>
                    <span className="sm:hidden">Complet</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </motion.div>

            {/* Graph Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="overflow-hidden border-border/50">
                <CardHeader className="border-b bg-muted/30">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Network className="w-5 h-5 text-primary" />
                        Graphe Interactif
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Glissez les nœuds pour explorer, utilisez la molette pour zoomer
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {graphData.nodes.length} nœuds
                      </Badge>
                      <Badge variant="secondary">
                        {graphData.links.length} liens
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="p-6 space-y-4">
                      <Skeleton className="h-[500px] w-full" />
                    </div>
                  ) : graphData.nodes.length > 0 ? (
                    <div className="p-4">
                      <ForceGraph
                        data={graphData}
                        width={900}
                        height={600}
                        showLegend={true}
                        showControls={true}
                        onNodeClick={handleNodeClick}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Network className="w-12 h-12 text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">
                        Aucune donnée disponible pour cette vue
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Interactions
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>• <strong>Glisser</strong> les nœuds pour réorganiser</p>
                  <p>• <strong>Molette</strong> pour zoomer</p>
                  <p>• <strong>Clic</strong> sur un nœud pour les détails</p>
                  <p>• <strong>Survol</strong> pour voir les connexions</p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    Paramètres
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>• <strong>Force des liens</strong> : rapproche les nœuds connectés</p>
                  <p>• <strong>Répulsion</strong> : éloigne les nœuds entre eux</p>
                  <p>• <strong>Filtres</strong> : masquez certains types</p>
                  <p>• <strong>Recherche</strong> : trouvez une entité</p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-primary" />
                    Vues Disponibles
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>• <strong>Molécules-Recettes</strong> : compositions</p>
                  <p>• <strong>Prototypes-Familles</strong> : taxonomie</p>
                  <p>• <strong>Plantes-Terroirs</strong> : origines</p>
                  <p>• <strong>Vue Complète</strong> : toutes les entités</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
