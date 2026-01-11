import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { ForceGraph, GraphNode, GraphLink } from "@/components/ForceGraph";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Network, 
  Loader2, 
  BookOpen,
  Leaf,
  Beaker,
  MapPin,
  FlaskConical,
  Target,
  Info
} from "lucide-react";

export default function RelationsGraph() {
  const [selectedAxis, setSelectedAxis] = useState<string>("all");
  const [graphMode, setGraphMode] = useState<"full" | "axes" | "references">("full");

  // Récupérer les données
  const { data: axes, isLoading: axesLoading } = trpc.researchAxes.list.useQuery({});
  const { data: references, isLoading: refsLoading } = trpc.bibliography.list.useQuery({});
  const { data: plants, isLoading: plantsLoading } = trpc.plants.list.useQuery();
  const { data: molecules, isLoading: moleculesLoading } = trpc.molecules.list.useQuery();
  const { data: terroirs, isLoading: terroirsLoading } = trpc.terroirs.getAll.useQuery();
  const { data: recettes, isLoading: recettesLoading } = trpc.recettes.list.useQuery({});
  // Note: Les liens axes-références seront ajoutés quand la procédure sera disponible
  const axisLinks: any[] = [];

  const isLoading = axesLoading || refsLoading || plantsLoading || moleculesLoading || terroirsLoading || recettesLoading;

  // Construire les nœuds et liens du graphe
  const { nodes, links } = useMemo(() => {
    const graphNodes: GraphNode[] = [];
    const graphLinks: GraphLink[] = [];

    // Ajouter les axes comme nœuds centraux
    if (axes) {
      ((axes as any)?.items || axes || []).forEach((axis: any) => {
        if (selectedAxis === "all" || selectedAxis === axis.axisCode) {
          graphNodes.push({
            id: `axis-${axis.id}`,
            label: axis.axisCode || axis.name,
            type: "axis",
            category: axis.category,
            url: `/axes-recherche/${axis.axisCode}`,
            metadata: {
              "Nom complet": axis.name,
              "Catégorie": axis.category,
              "Progression": `${axis.progressPercent || 0}%`,
            },
          });
        }
      });
    }

    // Ajouter les références
    if (references && graphMode !== "axes") {
      ((references as any)?.items || references || []).slice(0, 50).forEach((ref: any) => {
        // Vérifier si la référence est liée à un axe visible
        const linkedAxes = axisLinks?.filter((link: any) => link.referenceId === ref.id) || [];
        const isLinkedToVisibleAxis = selectedAxis === "all" || 
          linkedAxes.some((link: any) => {
            const axis = axes?.find((a: any) => a.id === link.axisId);
            return axis?.axisCode === selectedAxis;
          });

        if (isLinkedToVisibleAxis || selectedAxis === "all") {
          graphNodes.push({
            id: `ref-${ref.id}`,
            label: ref.bibtexKey || ref.title?.substring(0, 20) || `Ref ${ref.id}`,
            type: "reference",
            category: ref.type,
            url: `/references/${ref.id}`,
            metadata: {
              "Titre": ref.title?.substring(0, 50) + (ref.title?.length > 50 ? "..." : ""),
              "Auteurs": ref.authors?.substring(0, 30),
              "Année": ref.year,
            },
          });

          // Créer les liens avec les axes
          linkedAxes.forEach((link: any) => {
            const axis = axes?.find((a: any) => a.id === link.axisId);
            if (axis && (selectedAxis === "all" || axis.axisCode === selectedAxis)) {
              graphLinks.push({
                source: `axis-${link.axisId}`,
                target: `ref-${ref.id}`,
                type: "axis-reference",
                strength: 1,
              });
            }
          });
        }
      });
    }

    // Ajouter les plantes (limitées pour la performance)
    if (plants && graphMode === "full") {
      (plants || []).slice(0, 30).forEach((plant: any) => {
        graphNodes.push({
          id: `plant-${plant.id}`,
          label: plant.commonNameFr || plant.scientificName || `Plante ${plant.id}`,
          type: "plant",
          category: plant.family,
          url: `/plants/${plant.id}`,
          metadata: {
            "Nom scientifique": plant.scientificName,
            "Famille": plant.family,
            "Origine": plant.origin,
          },
        });

        // Lier aux axes de recherche basé sur la catégorie
        if (axes) {
          // Lier les plantes aux axes botaniques (A1, A2, A3)
          const botanicalAxes = ((axes as any)?.items || axes || []).filter((a: any) => 
            a.category === "botanique" && 
            (selectedAxis === "all" || a.axisCode === selectedAxis)
          );
          botanicalAxes.slice(0, 1).forEach((axis: any) => {
            graphLinks.push({
              source: `axis-${axis.id}`,
              target: `plant-${plant.id}`,
              type: "axis-plant",
              strength: 0.5,
            });
          });
        }
      });
    }

    // Ajouter les molécules (limitées pour la performance)
    if (molecules && graphMode === "full") {
      (molecules || []).slice(0, 30).forEach((mol: any) => {
        graphNodes.push({
          id: `mol-${mol.id}`,
          label: mol.name || mol.iupacName || `Molécule ${mol.id}`,
          type: "molecule",
          category: mol.olfactiveFamily,
          url: `/molecules/${mol.id}`,
          metadata: {
            "Nom IUPAC": mol.iupacName,
            "CAS": mol.casNumber,
            "Famille olfactive": mol.olfactiveFamily,
          },
        });

        // Lier aux axes chimiques (B1, B2, B3)
        if (axes) {
          const chemicalAxes = ((axes as any)?.items || axes || []).filter((a: any) => 
            a.category === "chimie" && 
            (selectedAxis === "all" || a.axisCode === selectedAxis)
          );
          chemicalAxes.slice(0, 1).forEach((axis: any) => {
            graphLinks.push({
              source: `axis-${axis.id}`,
              target: `mol-${mol.id}`,
              type: "axis-molecule",
              strength: 0.5,
            });
          });
        }
      });
    }

    // Ajouter les terroirs (limitées pour la performance)
    if (terroirs && graphMode === "full") {
      (terroirs || []).slice(0, 20).forEach((terroir: any) => {
        graphNodes.push({
          id: `terroir-${terroir.id}`,
          label: terroir.name,
          type: "terroir",
          category: terroir.country,
          url: `/terroirs/${terroir.id}`,
          metadata: {
            "Pays": terroir.country,
            "Région": terroir.region,
            "Climat": terroir.climateType,
          },
        });

        // Lier aux axes terroir (D1, D2, D3)
        if (axes) {
          const terroirAxes = ((axes as any)?.items || axes || []).filter((a: any) => 
            a.category === "terroir" && 
            (selectedAxis === "all" || a.axisCode === selectedAxis)
          );
          terroirAxes.slice(0, 1).forEach((axis: any) => {
            graphLinks.push({
              source: `axis-${axis.id}`,
              target: `terroir-${terroir.id}`,
              type: "axis-terroir",
              strength: 0.5,
            });
          });
        }
      });
    }

    // Ajouter les recettes (limitées pour la performance)
    if (recettes && graphMode === "full") {
      ((recettes as any)?.items || recettes || []).slice(0, 20).forEach((recette: any) => {
        graphNodes.push({
          id: `recette-${recette.id}`,
          label: recette.name,
          type: "recette",
          category: recette.category,
          url: `/recettes/${recette.id}`,
          metadata: {
            "Catégorie": recette.category,
            "Famille olfactive": recette.olfactiveFamily,
            "Statut": recette.status,
          },
        });

        // Lier aux axes formulation (C1, C2, C3)
        if (axes) {
          const formulationAxes = ((axes as any)?.items || axes || []).filter((a: any) => 
            a.category === "formulation" && 
            (selectedAxis === "all" || a.axisCode === selectedAxis)
          );
          formulationAxes.slice(0, 1).forEach((axis: any) => {
            graphLinks.push({
              source: `axis-${axis.id}`,
              target: `recette-${recette.id}`,
              type: "axis-recette",
              strength: 0.5,
            });
          });
        }
      });
    }

    return { nodes: graphNodes, links: graphLinks };
  }, [axes, references, plants, molecules, terroirs, recettes, axisLinks, selectedAxis, graphMode]);

  // Statistiques
  const stats = useMemo(() => {
    const byType: Record<string, number> = {};
    nodes.forEach(n => {
      byType[n.type] = (byType[n.type] || 0) + 1;
    });
    return byType;
  }, [nodes]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Breadcrumbs />

      <main className="flex-1">
        <div className="container py-8 max-w-7xl">
          {/* En-tête */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
                <Network className="h-8 w-8 text-primary" />
                Graphe des Relations
              </h1>
              <p className="text-muted-foreground">
                Visualisez les connexions entre axes thématiques, références et entités du projet PERFUMUM
              </p>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-amber-500" />
                  <div>
                    <p className="text-xl font-bold">{stats.axis || 0}</p>
                    <p className="text-xs text-muted-foreground">Axes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xl font-bold">{stats.reference || 0}</p>
                    <p className="text-xs text-muted-foreground">Références</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-xl font-bold">{stats.plant || 0}</p>
                    <p className="text-xs text-muted-foreground">Plantes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2">
                  <Beaker className="h-4 w-4 text-purple-500" />
                  <div>
                    <p className="text-xl font-bold">{stats.molecule || 0}</p>
                    <p className="text-xs text-muted-foreground">Molécules</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-xl font-bold">{stats.terroir || 0}</p>
                    <p className="text-xs text-muted-foreground">Terroirs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-pink-500" />
                  <div>
                    <p className="text-xl font-bold">{stats.recette || 0}</p>
                    <p className="text-xs text-muted-foreground">Recettes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contrôles */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Mode:</span>
              <Tabs value={graphMode} onValueChange={(v) => setGraphMode(v as any)}>
                <TabsList>
                  <TabsTrigger value="full">Complet</TabsTrigger>
                  <TabsTrigger value="axes">Axes seuls</TabsTrigger>
                  <TabsTrigger value="references">Axes + Refs</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Axe:</span>
              <Select value={selectedAxis} onValueChange={setSelectedAxis}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tous les axes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les axes</SelectItem>
                  {((axes as any)?.items || axes || []).map((axis: any) => (
                    <SelectItem key={axis.id} value={axis.axisCode}>
                      {axis.axisCode} - {axis.name.substring(0, 25)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Info */}
          <Card className="mb-6 bg-muted/50">
            <CardContent className="py-3">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p>
                    <strong>Navigation:</strong> Faites glisser les nœuds pour les repositionner. 
                    Utilisez la molette pour zoomer. Cliquez sur un nœud pour voir ses détails.
                  </p>
                  <p className="mt-1">
                    <strong>Filtres:</strong> Utilisez les contrôles à gauche pour afficher/masquer 
                    certains types d'entités. Ajustez les paramètres de simulation en bas à gauche.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Graphe */}
          {isLoading ? (
            <Card>
              <CardContent className="py-24 flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Chargement des données...</p>
              </CardContent>
            </Card>
          ) : nodes.length === 0 ? (
            <Card>
              <CardContent className="py-24 text-center">
                <Network className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucune donnée à afficher</h3>
                <p className="text-muted-foreground">
                  Ajoutez des axes de recherche et des références pour visualiser les relations.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-primary" />
                  Graphe de force
                </CardTitle>
                <CardDescription>
                  {nodes.length} nœuds et {links.length} connexions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ForceGraph
                  nodes={nodes}
                  links={links}
                  width={1100}
                  height={700}
                  className="w-full"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
