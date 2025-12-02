import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Beaker, FlaskConical } from "lucide-react";
import ReactFlow, { Background, Controls, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { useMemo } from "react";

export default function MoleculeDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0");

  const { data, isLoading } = trpc.molecule.getById.useQuery({ id });

  // Create nodes and edges for the relation graph
  const { nodes, edges } = useMemo(() => {
    if (!data) return { nodes: [], edges: [] };

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Central molecule node
    nodes.push({
      id: `molecule-${data.molecule.id}`,
      type: "default",
      position: { x: 400, y: 200 },
      data: {
        label: (
          <div className="text-center p-4 bg-purple-100 rounded-lg border-2 border-purple-500">
            <div className="font-bold text-lg">{data.molecule.name}</div>
            <div className="text-sm text-gray-600">{data.molecule.chemicalFormula}</div>
          </div>
        ),
      },
      style: { background: "transparent", border: "none" },
    });

    // Family node
    if (data.molecule.family) {
      nodes.push({
        id: `family-${data.molecule.family}`,
        type: "default",
        position: { x: 100, y: 200 },
        data: {
          label: (
            <div className="text-center p-3 bg-blue-100 rounded-lg border border-blue-400">
              <div className="font-semibold text-sm">{data.molecule.family}</div>
              <div className="text-xs text-gray-500">Famille</div>
            </div>
          ),
        },
        style: { background: "transparent", border: "none" },
      });

      edges.push({
        id: `e-family-molecule`,
        source: `family-${data.molecule.family}`,
        target: `molecule-${data.molecule.id}`,
        animated: true,
        style: { stroke: "#60a5fa" },
      });
    }

    // Recette nodes
    data.recettes.forEach((recette, index) => {
      const yOffset = (index - data.recettes.length / 2) * 120;
      nodes.push({
        id: `recette-${recette.id}`,
        type: "default",
        position: { x: 700, y: 200 + yOffset },
        data: {
          label: (
            <Link href={`/recette/${recette.id}`}>
              <div className="text-center p-3 bg-green-100 rounded-lg border border-green-400 cursor-pointer hover:bg-green-200 transition">
                <div className="font-semibold text-sm">{recette.name}</div>
                <div className="text-xs text-gray-500">Recette</div>
              </div>
            </Link>
          ),
        },
        style: { background: "transparent", border: "none" },
      });

      edges.push({
        id: `e-molecule-recette-${recette.id}`,
        source: `molecule-${data.molecule.id}`,
        target: `recette-${recette.id}`,
        animated: true,
        style: { stroke: "#34d399" },
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
            <p className="text-gray-600">Molécule non trouvée</p>
            <Link href="/chimie">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux Molécules
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { molecule, recettes } = data;

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/chimie">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </Link>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <Beaker className="mr-2 h-5 w-5" />
          Molécule
        </Badge>
      </div>

      {/* Main Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{molecule.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Formule Chimique</p>
              <p className="font-mono text-lg">{molecule.chemicalFormula}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Famille</p>
              <Badge variant="outline" className="mt-1">
                {molecule.family}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Profil Olfactif</p>
            <p className="text-base">{molecule.olfactiveProfile}</p>
          </div>

          {molecule.functionalEffect && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Effet Fonctionnel</p>
              <p className="text-base">{molecule.functionalEffect}</p>
            </div>
          )}

          {molecule.emotionalResonance && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Résonance Émotionnelle</p>
              <p className="text-base">{molecule.emotionalResonance}</p>
            </div>
          )}

          <div className="flex gap-2">
            {molecule.sourceOrigin && (
              <Badge variant="secondary">Source: {molecule.sourceOrigin}</Badge>
            )}
            {molecule.concentration && (
              <Badge variant="outline">Concentration: {molecule.concentration}</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Relation Graph */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
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
              <span>Famille Chimique</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-100 border-2 border-purple-500 rounded"></div>
              <span>Molécule</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-400 rounded"></div>
              <span>Recettes ({recettes.length})</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Recettes */}
      {recettes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recettes Utilisant Cette Molécule ({recettes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recettes.map((recette) => (
                <Link key={recette.id} href={`/recette/${recette.id}`}>
                  <Card className="cursor-pointer hover:shadow-lg transition">
                    <CardHeader>
                      <CardTitle className="text-lg">{recette.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {recette.formula}
                      </p>
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
