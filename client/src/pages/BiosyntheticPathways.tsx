// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dna, 
  FlaskConical, 
  Leaf,
  ArrowRight,
  Search,
  Filter,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { Link } from "wouter";
import * as d3 from "d3";
import { TabErrorBoundary } from "@/components/TabErrorBoundary";

// Données des voies biosynthétiques
const pathwayData = {
  MEP: {
    name: "Voie MEP (Plastidiale)",
    fullName: "Méthylérythritol Phosphate",
    location: "Plastes (chloroplastes)",
    color: "#10B981",
    description: "Voie principale pour la biosynthèse des monoterpènes et diterpènes dans les plastes",
    precursor: "Pyruvate + G3P",
    intermediates: ["DXP", "MEP", "CDP-ME", "CDP-MEP", "MEC", "HMBPP"],
    products: ["IPP", "DMAPP"],
    terpeneClasses: ["Monoterpènes (C10)", "Diterpènes (C20)", "Tétraterpènes (C40)"],
    examples: ["Limonène", "Myrcène", "Pinène", "Géraniol", "Linalol"]
  },
  MVA: {
    name: "Voie MVA (Cytosolique)",
    fullName: "Mévalonate",
    location: "Cytosol",
    color: "#8B5CF6",
    description: "Voie pour la biosynthèse des sesquiterpènes et triterpènes dans le cytosol",
    precursor: "Acétyl-CoA",
    intermediates: ["Acétoacétyl-CoA", "HMG-CoA", "Mévalonate", "MVP", "MVPP"],
    products: ["IPP", "DMAPP"],
    terpeneClasses: ["Sesquiterpènes (C15)", "Triterpènes (C30)", "Stérols"],
    examples: ["β-Caryophyllène", "Humulène", "Farnésol", "Nérolidol"]
  }
};

// Composant pour le diagramme de voie biosynthétique
function PathwayDiagram({ pathway }: { pathway: typeof pathwayData.MEP }) {
  return (
    <div className="relative p-6 bg-gradient-to-b from-background to-muted/30 rounded-xl border">
      {/* Précurseur */}
      <div className="flex justify-center mb-6">
        <div className="px-4 py-2 bg-amber-500/20 border border-amber-500/50 rounded-lg">
          <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
            {pathway.precursor}
          </span>
        </div>
      </div>
      
      {/* Flèche */}
      <div className="flex justify-center mb-4">
        <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
      </div>
      
      {/* Intermédiaires */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {pathway.intermediates.map((intermediate, index) => (
          <div key={index} className="flex items-center">
            <Badge variant="outline" className="text-xs">
              {intermediate}
            </Badge>
            {index < pathway.intermediates.length - 1 && (
              <ArrowRight className="h-3 w-3 mx-1 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>
      
      {/* Flèche */}
      <div className="flex justify-center mb-4">
        <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
      </div>
      
      {/* Produits */}
      <div className="flex justify-center gap-4 mb-6">
        {pathway.products.map((product, index) => (
          <div 
            key={index}
            className="px-4 py-2 rounded-lg border-2"
            style={{ 
              backgroundColor: `${pathway.color}20`,
              borderColor: pathway.color 
            }}
          >
            <span className="font-semibold" style={{ color: pathway.color }}>
              {product}
            </span>
          </div>
        ))}
      </div>
      
      {/* Flèche */}
      <div className="flex justify-center mb-4">
        <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
      </div>
      
      {/* Classes de terpènes */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {pathway.terpeneClasses.map((terpeneClass, index) => (
          <Badge 
            key={index}
            style={{ backgroundColor: `${pathway.color}30`, color: pathway.color }}
          >
            {terpeneClass}
          </Badge>
        ))}
      </div>
      
      {/* Exemples de molécules */}
      <div className="mt-4 p-4 bg-background/50 rounded-lg">
        <h4 className="text-sm font-semibold text-muted-foreground mb-2">
          Exemples de molécules produites
        </h4>
        <div className="flex flex-wrap gap-2">
          {pathway.examples.map((example, index) => (
            <Link key={index} href={`/molecules?search=${encodeURIComponent(example)}`}>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                {example}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Composant pour le graphe D3 des gènes TPS
function TpsNetworkGraph({ 
  tpsGenes, 
  molecules,
  links,
  width = 800,
  height = 600
}: { 
  tpsGenes: any[];
  molecules: any[];
  links: any[];
  width?: number;
  height?: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!svgRef.current || tpsGenes.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
    
    // Create nodes from TPS genes and molecules
    const nodes: any[] = [
      ...tpsGenes.slice(0, 30).map(gene => ({
        id: `tps-${gene.id}`,
        name: gene.gene_name,
        type: 'tps',
        subfamily: gene.subfamily,
        color: getSubfamilyColor(gene.subfamily)
      })),
      ...molecules.slice(0, 30).map(mol => ({
        id: `mol-${mol.id}`,
        name: mol.name,
        type: 'molecule',
        color: '#F59E0B'
      }))
    ];

    // Create links
    const graphLinks = links.slice(0, 50).map(link => ({
      source: `tps-${link.tps_gene_id}`,
      target: `mol-${link.molecule_id}`
    })).filter(link => 
      nodes.find(n => n.id === link.source) && 
      nodes.find(n => n.id === link.target)
    );

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(graphLinks).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    // Create container group with zoom
    const g = svg.append("g");

    // Add zoom behavior
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoom(event.transform.k);
      });

    svg.call(zoomBehavior);

    // Draw links
    const link = g.append("g")
      .selectAll("line")
      .data(graphLinks)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5);

    // Draw nodes
    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("cursor", "pointer")
      .call(d3.drag<SVGGElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add circles for nodes
    node.append("circle")
      .attr("r", d => d.type === 'tps' ? 12 : 8)
      .attr("fill", d => d.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Add labels
    node.append("text")
      .attr("dx", 15)
      .attr("dy", 4)
      .style("font-size", "10px")
      .style("fill", "currentColor")
      .text(d => d.name.length > 15 ? d.name.substring(0, 15) + "..." : d.name);

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [tpsGenes, molecules, links, width, height]);

  return (
    <div className="relative">
      <svg 
        ref={svgRef} 
        width={width} 
        height={height}
        className="bg-muted/20 rounded-lg border"
      />
      <div className="absolute top-4 right-4 flex gap-2">
        <Badge variant="outline">Zoom: {Math.round(zoom * 100)}%</Badge>
      </div>
    </div>
  );
}

// Fonction pour obtenir la couleur par sous-famille TPS
function getSubfamilyColor(subfamily: string): string {
  const colors: Record<string, string> = {
    'TPS-a': '#EF4444', // Rouge - Sesquiterpènes
    'TPS-b': '#10B981', // Vert - Monoterpènes
    'TPS-c': '#3B82F6', // Bleu - Diterpènes
    'TPS-d': '#8B5CF6', // Violet - Diterpènes
    'TPS-e': '#F59E0B', // Orange - Monoterpènes
    'TPS-f': '#EC4899', // Rose - Diterpènes
    'TPS-g': '#6366F1', // Indigo - Monoterpènes
  };
  return colors[subfamily] || '#6B7280';
}

export default function BiosyntheticPathways() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubfamily, setSelectedSubfamily] = useState<string>("all");
  
  // Récupérer les données TPS
  const { data: tpsData, isLoading: tpsLoading } = trpc.research.getTpsGenes.useQuery();
  const { data: linksData, isLoading: linksLoading } = trpc.research.getTpsMoleculeLinks.useQuery();
  const { data: moleculesData } = trpc.molecules.list.useQuery({ limit: 100 });

  // Filtrer les gènes TPS
  const filteredTpsGenes = tpsData?.success ? tpsData?.data.filter((gene: any) => {
    const matchesSearch = gene.gene_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          gene.product?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubfamily = selectedSubfamily === "all" || gene.subfamily === selectedSubfamily;
    return matchesSearch && matchesSubfamily;
  }) : [];

  // Obtenir les sous-familles uniques
  const subfamilies = tpsData?.success 
    ? [...new Set(tpsData?.data.map((g: any) => g.subfamily).filter(Boolean))]
    : [];

  return (
    <div className="container py-8 space-y-8">
      {/* En-tête */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/recherche-scientifique" className="hover:text-foreground">Recherche</Link>
          <ChevronRight className="h-4 w-4" />
          <span>Voies Biosynthétiques</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl">
            <Dna className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Voies Biosynthétiques TPS</h1>
            <p className="text-muted-foreground">
              Des gènes aux molécules aromatiques — Cartographie des terpène synthases
            </p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <Card className="bg-gradient-to-r from-emerald-50 to-violet-50 dark:from-emerald-950/20 dark:to-violet-950/20 border-emerald-200 dark:border-emerald-800">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Leaf className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <p className="text-lg">
                Les <strong>Terpène Synthases (TPS)</strong> sont les enzymes clés qui catalysent la formation 
                des terpènes, les composés aromatiques les plus diversifiés du règne végétal. Chaque gène TPS 
                code pour une enzyme spécifique qui transforme les précurseurs universels (IPP/DMAPP) en 
                molécules aromatiques uniques.
              </p>
              <p className="text-muted-foreground">
                Cette page présente les deux voies biosynthétiques principales et leur connexion aux 
                gènes TPS identifiés dans le génome du cannabis et du tabac.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pathways" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pathways" className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4" />
            Voies Métaboliques
          </TabsTrigger>
          <TabsTrigger value="network" className="flex items-center gap-2">
            <Dna className="h-4 w-4" />
            Réseau TPS
          </TabsTrigger>
          <TabsTrigger value="genes" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Explorateur
          </TabsTrigger>
        </TabsList>

        {/* Onglet Voies Métaboliques */}
        <TabErrorBoundary>
        <TabsContent value="pathways" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Voie MEP */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: pathwayData.MEP.color }}
                  />
                  {pathwayData.MEP.name}
                </CardTitle>
                <CardDescription>
                  {pathwayData.MEP.fullName} — {pathwayData.MEP.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {pathwayData.MEP.description}
                </p>
                <PathwayDiagram pathway={pathwayData.MEP} />
              </CardContent>
            </Card>

            {/* Voie MVA */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: pathwayData.MVA.color }}
                  />
                  {pathwayData.MVA.name}
                </CardTitle>
                <CardDescription>
                  {pathwayData.MVA.fullName} — {pathwayData.MVA.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {pathwayData.MVA.description}
                </p>
                <PathwayDiagram pathway={pathwayData.MVA} />
              </CardContent>
            </Card>
          </div>

          {/* Schéma de convergence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Convergence des Voies
              </CardTitle>
              <CardDescription>
                Les deux voies convergent vers les mêmes précurseurs universels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-6">
                <div className="text-center">
                  <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-lg mb-2">
                    <span className="font-medium text-emerald-600">Voie MEP</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Plastes</p>
                </div>
                
                <ArrowRight className="h-6 w-6 text-muted-foreground md:rotate-0 rotate-90" />
                
                <div className="text-center p-4 bg-amber-500/20 border-2 border-amber-500 rounded-xl">
                  <p className="font-bold text-amber-600">IPP + DMAPP</p>
                  <p className="text-xs text-muted-foreground mt-1">Précurseurs universels</p>
                </div>
                
                <ArrowRight className="h-6 w-6 text-muted-foreground md:rotate-0 rotate-90" />
                
                <div className="text-center">
                  <div className="px-4 py-2 bg-violet-500/20 border border-violet-500/50 rounded-lg mb-2">
                    <span className="font-medium text-violet-600">Voie MVA</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Cytosol</p>
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
              </div>
              
              <div className="flex justify-center mt-4">
                <div className="px-6 py-3 bg-primary/10 border border-primary/30 rounded-xl">
                  <p className="font-bold text-primary text-center">Gènes TPS</p>
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    Terpène Synthases → Molécules aromatiques
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </TabErrorBoundary>

        {/* Onglet Réseau TPS */}
        <TabErrorBoundary>
        <TabsContent value="network" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Réseau Gènes TPS → Molécules</CardTitle>
              <CardDescription>
                Visualisation interactive des connexions entre gènes TPS et leurs produits moléculaires.
                Glissez les nœuds pour explorer le réseau. Zoomez avec la molette.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tpsLoading || linksLoading ? (
                <div className="flex items-center justify-center h-[600px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : tpsData?.success && linksData?.success && moleculesData?.success ? (
                <>
                  <TpsNetworkGraph
                    tpsGenes={tpsData?.data}
                    molecules={moleculesData?.data}
                    links={linksData?.data}
                    width={800}
                    height={600}
                  />
                  <div className="flex flex-wrap gap-4 mt-4 justify-center">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500" />
                      <span className="text-sm">TPS-a (Sesquiterpènes)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-500" />
                      <span className="text-sm">TPS-b (Monoterpènes)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500" />
                      <span className="text-sm">TPS-c/d (Diterpènes)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-amber-500" />
                      <span className="text-sm">Molécules</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Dna className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune donnée TPS disponible</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        </TabErrorBoundary>

        {/* Onglet Explorateur */}
        <TabErrorBoundary>
        <TabsContent value="genes" className="space-y-6">
          {/* Filtres */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un gène ou produit..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedSubfamily} onValueChange={setSelectedSubfamily}>
                  <SelectTrigger className="w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sous-famille" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les sous-familles</SelectItem>
                    {subfamilies.map((sf: string) => (
                      <SelectItem key={sf} value={sf}>{sf}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Liste des gènes */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tpsLoading ? (
              <div className="col-span-full flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredTpsGenes.length > 0 ? (
              filteredTpsGenes.slice(0, 30).map((gene: any) => (
                <Card key={gene.id} className="hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getSubfamilyColor(gene.subfamily) }}
                        />
                        {gene.gene_name}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {gene.subfamily}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {gene.product && (
                        <div>
                          <span className="text-muted-foreground">Produit: </span>
                          <span className="font-medium">{gene.product}</span>
                        </div>
                      )}
                      {gene.species && (
                        <div>
                          <span className="text-muted-foreground">Espèce: </span>
                          <span className="italic">{gene.species}</span>
                        </div>
                      )}
                      {gene.chromosome && (
                        <div>
                          <span className="text-muted-foreground">Chr: </span>
                          <span>{gene.chromosome}</span>
                        </div>
                      )}
                    </div>
                    {gene.product && (
                      <Link href={`/molecules?search=${encodeURIComponent(gene.product)}`}>
                        <Button variant="ghost" size="sm" className="mt-2 w-full">
                          <ExternalLink className="h-3 w-3 mr-2" />
                          Voir la molécule
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                <Dna className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun gène TPS trouvé</p>
                <p className="text-sm mt-2">Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </div>

          {/* Statistiques */}
          {tpsData?.success && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{tpsData?.data.length}</p>
                    <p className="text-sm text-muted-foreground">Gènes TPS</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-emerald-600">{subfamilies.length}</p>
                    <p className="text-sm text-muted-foreground">Sous-familles</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-amber-600">
                      {linksData?.success ? linksData?.data.length : 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Liaisons</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-violet-600">
                      {filteredTpsGenes.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Résultats filtrés</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        </TabErrorBoundary>
      </Tabs>
    </div>
  );
}
