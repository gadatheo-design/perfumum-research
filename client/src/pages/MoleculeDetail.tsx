import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Beaker, FlaskConical, FileText, Copy, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SEOHead } from "@/components/SEOHead";
import ReactFlow, { Background, Controls, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { useMemo } from "react";

export default function MoleculeDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0");
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const { data, isLoading } = trpc.molecule.getById.useQuery({ id });
  const molecule = data?.molecule;

  // SEO metadata
  const seoTitle = molecule ? `${molecule.name} (${molecule.chemicalFormula || ""})` : "Molécule";
  const seoDescription = molecule 
    ? `${molecule.name} - Formule: ${molecule.chemicalFormula || "N/A"}. Famille: ${molecule.family || "N/A"}. ${molecule.olfactiveProfile || ""}`
    : "Détails de la molécule PERFUMUM";
  const generateCitation = trpc.citations.generate.useMutation();

  const handleCopyCitation = async (format: "apa" | "mla" | "chicago" | "bibtex") => {
    try {
      const result = await generateCitation.mutateAsync({
        entityType: "molecule",
        entityId: id,
        format,
      });
      
      await navigator.clipboard.writeText(result.citationText);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
      
      alert(`Citation ${format.toUpperCase()} copiée dans le presse-papier !`);
    } catch (error) {
      alert("Erreur : Impossible de générer la citation");
    }
  };

  // Create nodes and edges for the relation graph
  const { nodes, edges } = useMemo(() => {
    if (!data || !data.molecule) return { nodes: [], edges: [] };
    
    const mol = data.molecule;

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Central molecule node
    nodes.push({
      id: `molecule-${mol.id}`,
      type: "default",
      position: { x: 400, y: 200 },
      data: {
        label: (
          <div className="text-center p-6 bg-purple-100 rounded-lg border-2 border-purple-500 shadow-lg">
            <div className="font-bold text-xl">{mol.name}</div>
            <div className="text-base text-gray-600 font-mono">{mol.chemicalFormula}</div>
          </div>
        ),
      },
      style: { background: "transparent", border: "none" },
    });

    // Family node
    if (mol.family) {
      nodes.push({
        id: `family-${mol.family}`,
        type: "default",
        position: { x: 100, y: 200 },
        data: {
          label: (
            <div className="text-center p-5 bg-blue-100 rounded-lg border-2 border-blue-400 shadow-md">
              <div className="font-semibold text-base">{mol.family}</div>
              <div className="text-sm text-gray-500">Famille</div>
            </div>
          ),
        },
        style: { background: "transparent", border: "none" },
      });

      edges.push({
        id: `e-family-molecule`,
        source: `family-${mol.family}`,
        target: `molecule-${mol.id}`,
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
              <div className="text-center p-5 bg-green-100 rounded-lg border-2 border-green-400 cursor-pointer hover:bg-green-200 transition shadow-md hover:shadow-lg">
                <div className="font-semibold text-base">{recette.name}</div>
                <div className="text-sm text-gray-500">Recette</div>
              </div>
            </Link>
          ),
        },
        style: { background: "transparent", border: "none" },
      });

      edges.push({
        id: `e-molecule-recette-${recette.id}`,
        source: `molecule-${mol.id}`,
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

  // data contient { molecule: {...}, recettes: [...] }
  if (!molecule) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
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
  
  const recettes = data?.recettes || [];

  return (
    <>
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        type="article"
      />
      <div className="container mx-auto py-8 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb
        items={[
          { label: "Chimie", href: "/chemical-families" },
          { label: molecule.family || "Famille", href: "/chemical-families" },
          { label: molecule.name },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/chimie">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <FavoriteButton moleculeId={molecule.id} moleculeName={molecule.name} />
          
          {/* Citation Export */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="default">
                <FileText className="mr-2 h-4 w-4" />
                Citer
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleCopyCitation("apa")}>
                {copiedFormat === "apa" ? (
                  <Check className="mr-2 h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                Format APA
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCopyCitation("mla")}>
                {copiedFormat === "mla" ? (
                  <Check className="mr-2 h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                Format MLA
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCopyCitation("chicago")}>
                {copiedFormat === "chicago" ? (
                  <Check className="mr-2 h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                Format Chicago
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCopyCitation("bibtex")}>
                {copiedFormat === "bibtex" ? (
                  <Check className="mr-2 h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                BibTeX
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Beaker className="mr-2 h-5 w-5" />
            Molécule
          </Badge>
        </div>
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
                  <Card className="shadow-sm hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer">
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
    </>
  );
}
