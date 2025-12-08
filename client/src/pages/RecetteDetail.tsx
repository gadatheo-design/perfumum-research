import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FlaskConical, Beaker, Download } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { exportRecipePDF } from "@/lib/exportPDF";
import ReactFlow, { Background, Controls, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { useMemo } from "react";

export default function RecetteDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0");

  const { data, isLoading } = trpc.recette.getById.useQuery({ id });

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
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <FlaskConical className="mr-2 h-5 w-5" />
            Recette
          </Badge>
        </div>
      </div>

      {/* Main Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{recette.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recette.formula && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Formule</p>
              <p className="text-base">{recette.formula}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {family && (
              <div>
                <p className="text-sm text-gray-600">Famille Olfactive</p>
                <Badge variant="outline" className="mt-1">
                  {family.name}
                </Badge>
              </div>
            )}
            {accord && (
              <div>
                <p className="text-sm text-gray-600">Accord</p>
                <Badge variant="outline" className="mt-1">
                  {accord.name}
                </Badge>
              </div>
            )}
          </div>

          {recette.protocol && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Protocole</p>
              <p className="text-base text-gray-700">{recette.protocol}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            {recette.intensity && (
              <div>
                <p className="text-sm text-gray-600">Intensité</p>
                <Badge variant="outline" className="mt-1">
                  {recette.intensity}/10
                </Badge>
              </div>
            )}
            {recette.stability && (
              <div>
                <p className="text-sm text-gray-600">Stabilité</p>
                <Badge variant="outline" className="mt-1">
                  {recette.stability}
                </Badge>
              </div>
            )}
            {recette.maturationTime && (
              <div>
                <p className="text-sm text-gray-600">Maturation</p>
                <Badge variant="outline" className="mt-1">
                  {recette.maturationTime} jours
                </Badge>
              </div>
            )}
          </div>
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
