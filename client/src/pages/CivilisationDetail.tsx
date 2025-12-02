import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe, FlaskConical } from "lucide-react";
import ReactFlow, { Background, Controls, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { useMemo } from "react";

export default function CivilisationDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0");

  const { data, isLoading } = trpc.civilisation.getById.useQuery({ id });

  // Create nodes and edges for the relation graph
  const { nodes, edges } = useMemo(() => {
    if (!data) return { nodes: [], edges: [] };

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Central civilisation node
    nodes.push({
      id: `civilisation-${data.civilisation.id}`,
      type: "default",
      position: { x: 400, y: 250 },
      data: {
        label: (
          <div className="text-center p-4 bg-amber-100 rounded-lg border-2 border-amber-600">
            <div className="font-bold text-lg">{data.civilisation.name}</div>
            <div className="text-xs text-gray-600">Civilisation</div>
          </div>
        ),
      },
      style: { background: "transparent", border: "none" },
    });

    // Recette nodes (around the civilisation)
    data.recettes.forEach((recette, index) => {
      const angle = (index / data.recettes.length) * 2 * Math.PI;
      const radius = 200;
      const x = 400 + radius * Math.cos(angle);
      const y = 250 + radius * Math.sin(angle);

      nodes.push({
        id: `recette-${recette.id}`,
        type: "default",
        position: { x, y },
        data: {
          label: (
            <Link href={`/recette/${recette.id}`}>
              <div className="text-center p-3 bg-green-100 rounded-lg border border-green-400 cursor-pointer hover:bg-green-200 transition">
                <div className="font-semibold text-sm">{recette.name}</div>
                <div className="text-xs text-gray-500">{recette.category}</div>
              </div>
            </Link>
          ),
        },
        style: { background: "transparent", border: "none" },
      });

      edges.push({
        id: `e-civilisation-recette-${recette.id}`,
        source: `civilisation-${data.civilisation.id}`,
        target: `recette-${recette.id}`,
        animated: true,
        style: { stroke: "#fbbf24" },
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
            <p className="text-gray-600">Civilisation non trouvée</p>
            <Link href="/civilisations">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux Civilisations
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { civilisation, recettes } = data;

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/civilisations">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </Link>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <Globe className="mr-2 h-5 w-5" />
          Civilisation
        </Badge>
      </div>

      {/* Main Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{civilisation.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {civilisation.region && (
              <div>
                <p className="text-sm text-gray-600">Région</p>
                <p className="text-base">{civilisation.region}</p>
              </div>
            )}
            {civilisation.temporality && (
              <div>
                <p className="text-sm text-gray-600">Temporalité</p>
                <Badge variant="outline" className="mt-1">
                  {civilisation.temporality}
                </Badge>
              </div>
            )}
          </div>

          {civilisation.longDescription && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Description</p>
              <p className="text-base text-gray-700">{civilisation.longDescription}</p>
            </div>
          )}

          {civilisation.bibliographicReferences && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Références Bibliographiques</p>
              <p className="text-base text-gray-700">{civilisation.bibliographicReferences}</p>
            </div>
          )}

          {civilisation.symbolicMaterials && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Matériaux Symboliques</p>
              <div className="flex flex-wrap gap-2">
                {civilisation.symbolicMaterials.split(',').map((material, index) => (
                  <Badge key={index} variant="secondary">
                    {material.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}
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
              <div className="w-4 h-4 bg-amber-100 border-2 border-amber-600 rounded"></div>
              <span>Civilisation</span>
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
            <CardTitle>Recettes Associées ({recettes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recettes.map((recette) => (
                <Link key={recette.id} href={`/recette/${recette.id}`}>
                  <Card className="cursor-pointer hover:shadow-lg transition">
                    <CardHeader>
                      <CardTitle className="text-lg">{recette.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline">{recette.category}</Badge>
                      {recette.formula && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {recette.formula}
                        </p>
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
