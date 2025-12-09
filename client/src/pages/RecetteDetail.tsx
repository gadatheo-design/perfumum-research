import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FlaskConical, Beaker, Download, Clock, DollarSign, Flame, Droplets, CheckCircle2, AlertCircle, TestTube } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { exportRecipePDF } from "@/lib/exportPDF";
import ReactFlow, { Background, Controls, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { useMemo, useEffect } from "react";

export default function RecetteDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0");

  const { data, isLoading } = trpc.recette.getById.useQuery({ id });
  const trackEvent = trpc.analytics.trackEvent.useMutation();

  // Track page view
  useEffect(() => {
    if (data?.recette) {
      trackEvent.mutate({
        eventType: "recipe_view",
        entityId: data.recette.id,
        entityType: "recipe",
        metadata: JSON.stringify({
          recipeName: data.recette.name,
          category: data.family?.name,
          source: "recipe_detail",
        }),
      });
    }
  }, [data?.recette.id]);

  // Create nodes and edges for the relation graph
  const { nodes, edges } = useMemo(() => {
    if (!data) return { nodes: [], edges: [] };

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Central recette node
    nodes.push({
      id: `recette-${data.recette.id}`,
      type: "default",
      position: { x: 400, y: 250 },
      data: {
        label: (
          <div className="text-center p-6 bg-green-100 rounded-lg border-2 border-green-600 shadow-lg">
            <div className="font-bold text-xl">{data.recette.name}</div>
            <div className="text-sm text-gray-600">Recette</div>
          </div>
        ),
      },
      style: { background: "transparent", border: "none" },
    });

    // Family node (left)
    if (data.family) {
      nodes.push({
        id: `family-${data.family.id}`,
        type: "default",
        position: { x: 100, y: 100 },
        data: {
          label: (
            <div className="text-center p-5 bg-blue-100 rounded-lg border-2 border-blue-400 shadow-md">
              <div className="font-semibold text-base">{data.family.name}</div>
              <div className="text-sm text-gray-500">Famille</div>
            </div>
          ),
        },
        style: { background: "transparent", border: "none" },
      });

      edges.push({
        id: `e-family-recette`,
        source: `family-${data.family.id}`,
        target: `recette-${data.recette.id}`,
        animated: true,
        style: { stroke: "#60a5fa" },
      });
    }

    // Accord node (left-bottom)
    if (data.accord) {
      nodes.push({
        id: `accord-${data.accord.id}`,
        type: "default",
        position: { x: 100, y: 400 },
        data: {
          label: (
            <div className="text-center p-5 bg-orange-100 rounded-lg border-2 border-orange-400 shadow-md">
              <div className="font-semibold text-base">{data.accord.name}</div>
              <div className="text-sm text-gray-500">Accord</div>
            </div>
          ),
        },
        style: { background: "transparent", border: "none" },
      });

      edges.push({
        id: `e-accord-recette`,
        source: `accord-${data.accord.id}`,
        target: `recette-${data.recette.id}`,
        animated: true,
        style: { stroke: "#fb923c" },
      });
    }

    // Molecule nodes (right)
    data.molecules.forEach((molecule, index) => {
      const yOffset = (index - data.molecules.length / 2) * 100;
      nodes.push({
        id: `molecule-${molecule.id}`,
        type: "default",
        position: { x: 700, y: 250 + yOffset },
        data: {
          label: (
            <Link href={`/molecule/${molecule.id}`}>
              <div className="text-center p-5 bg-purple-100 rounded-lg border-2 border-purple-400 cursor-pointer hover:bg-purple-200 transition shadow-md hover:shadow-lg">
                <div className="font-semibold text-base">{molecule.name}</div>
                <div className="text-sm text-gray-500 font-mono">{molecule.chemicalFormula}</div>
              </div>
            </Link>
          ),
        },
        style: { background: "transparent", border: "none" },
      });

      edges.push({
        id: `e-recette-molecule-${molecule.id}`,
        source: `recette-${data.recette.id}`,
        target: `molecule-${molecule.id}`,
        animated: true,
        style: { stroke: "#a78bfa" },
      });
    });

    return { nodes, edges };
  }, [data]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Recette non trouvée</p>
            <Link href="/familles">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux Recettes
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { recette, molecules, family, accord } = data;

  // Status badge color
  const statusColors = {
    experimental: "bg-yellow-100 text-yellow-800 border-yellow-300",
    testing: "bg-blue-100 text-blue-800 border-blue-300",
    validated: "bg-green-100 text-green-800 border-green-300",
    production: "bg-purple-100 text-purple-800 border-purple-300",
  };

  const statusIcons = {
    experimental: <TestTube className="h-4 w-4" />,
    testing: <AlertCircle className="h-4 w-4" />,
    validated: <CheckCircle2 className="h-4 w-4" />,
    production: <FlaskConical className="h-4 w-4" />,
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Familles", href: "/familles" },
          { label: family?.name || "Famille", href: "/familles" },
          { label: recette.name },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/familles">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="default"
            onClick={() => exportRecipePDF({
              name: data.recette.name,
              category: data.family?.name || undefined,
              notes: data.recette.notes || undefined,
              id: data.recette.id,
            })}
          >
            <Download className="mr-2 h-4 w-4" />
            Exporter PDF
          </Button>
          {recette.status && (
            <Badge className={`${statusColors[recette.status]} border px-3 py-1.5 flex items-center gap-2`}>
              {statusIcons[recette.status]}
              {recette.status.charAt(0).toUpperCase() + recette.status.slice(1)}
            </Badge>
          )}
        </div>
      </div>

      {/* Main Info */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardTitle className="text-3xl flex items-center gap-3">
            <FlaskConical className="h-8 w-8 text-primary" />
            {recette.name}
          </CardTitle>
          {recette.category && (
            <Badge variant="outline" className="w-fit mt-2">
              {recette.category}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Description */}
          {recette.description && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-base leading-relaxed">{recette.description}</p>
            </div>
          )}

          {/* Formule */}
          {recette.formula && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Formule</h3>
              <p className="text-base whitespace-pre-wrap">{recette.formula}</p>
            </div>
          )}

          {/* Ingrédients */}
          {recette.ingredients && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Ingrédients Clés</h3>
              <p className="text-base whitespace-pre-wrap">{recette.ingredients}</p>
            </div>
          )}

          {/* Propriétés Principales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {family && (
              <div className="bg-card p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">Famille Olfactive</p>
                <Badge variant="outline" className="mt-1">
                  {family.name}
                </Badge>
              </div>
            )}
            {accord && (
              <div className="bg-card p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">Accord</p>
                <Badge variant="outline" className="mt-1">
                  {accord.name}
                </Badge>
              </div>
            )}
            {recette.intensity && (
              <div className="bg-card p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">Intensité</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-background rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${recette.intensity * 10}%` }}></div>
                  </div>
                  <span className="text-sm font-semibold">{recette.intensity}/10</span>
                </div>
              </div>
            )}
            {recette.stability && (
              <div className="bg-card p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">Stabilité</p>
                <Badge variant="outline" className="mt-1 capitalize">
                  {recette.stability}
                </Badge>
              </div>
            )}
          </div>

          {/* Propriétés Techniques */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {recette.texture && (
              <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-3">
                <Droplets className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Texture</p>
                  <p className="font-semibold capitalize">{recette.texture}</p>
                </div>
              </div>
            )}
            {recette.combustionTemperature && (
              <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-3">
                <Flame className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Combustion</p>
                  <p className="font-semibold">{recette.combustionTemperature}°C</p>
                </div>
              </div>
            )}
            {recette.maturationTime && (
              <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Maturation</p>
                  <p className="font-semibold">{recette.maturationTime} jours</p>
                </div>
              </div>
            )}
            {recette.productionTime && (
              <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Temps Production</p>
                  <p className="font-semibold">{recette.productionTime} min</p>
                </div>
              </div>
            )}
            {recette.costEstimate && (
              <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Coût Estimé</p>
                  <p className="font-semibold">{(recette.costEstimate / 100).toFixed(2)} CHF</p>
                </div>
              </div>
            )}
          </div>

          {/* Évolution Aromatique */}
          {(recette.notesTete || recette.notesCoeur || recette.notesFond) && (
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Évolution Aromatique</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {recette.notesTete && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-sm font-semibold text-yellow-800 mb-2">Notes de Tête</p>
                    <p className="text-sm text-gray-700">{recette.notesTete}</p>
                  </div>
                )}
                {recette.notesCoeur && (
                  <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                    <p className="text-sm font-semibold text-pink-800 mb-2">Notes de Cœur</p>
                    <p className="text-sm text-gray-700">{recette.notesCoeur}</p>
                  </div>
                )}
                {recette.notesFond && (
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <p className="text-sm font-semibold text-amber-800 mb-2">Notes de Fond</p>
                    <p className="text-sm text-gray-700">{recette.notesFond}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Protocole */}
          {recette.protocol && (
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Protocole de Fabrication</h3>
              <p className="text-base whitespace-pre-wrap leading-relaxed text-muted-foreground">{recette.protocol}</p>
            </div>
          )}

          {/* Notes */}
          {recette.notes && (
            <div className="bg-muted/30 p-6 rounded-lg border-l-4 border-primary">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Notes de Recherche</h3>
              <p className="text-base whitespace-pre-wrap leading-relaxed">{recette.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Relation Graph */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Beaker className="h-5 w-5" />
            Graphe de Relations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: "500px" }} className="border rounded-lg">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              attributionPosition="bottom-left"
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>
          <div className="mt-4 flex gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-400 rounded"></div>
              <span>Famille Olfactive</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-100 border border-orange-400 rounded"></div>
              <span>Accord</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-600 rounded"></div>
              <span>Recette</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-100 border border-purple-400 rounded"></div>
              <span>Molécules ({molecules.length})</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Molecules */}
      {molecules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Molécules Utilisées ({molecules.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {molecules.map((molecule) => (
                <Link key={molecule.id} href={`/molecule/${molecule.id}`}>
                  <Card className="shadow-sm hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg">{molecule.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 font-mono">
                        {molecule.chemicalFormula}
                      </p>
                      {molecule.family && (
                        <Badge variant="outline" className="mt-2">
                          {molecule.family}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
