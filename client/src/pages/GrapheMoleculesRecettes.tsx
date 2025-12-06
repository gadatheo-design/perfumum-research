import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import * as d3 from "d3";

export default function GrapheMoleculesRecettes() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [filter, setFilter] = useState<"all" | "classique" | "experimentale">("all");
  
  const { data: recettes, isLoading: recettesLoading } = trpc.recettes.list.useQuery({ category: "resine_cbd" as any });
  const recettesCBD = recettes || [];
  
  useEffect(() => {
    if (!svgRef.current || recettesCBD.length === 0) return;
    
    // Récupérer toutes les molécules liées
    const moleculesMap = new Map();
    const links: any[] = [];
    
    recettesCBD.forEach((recette: any) => {
      // Note: Dans une vraie implémentation, il faudrait charger les molécules via tRPC
      // Pour l'instant, on crée un graphe simplifié
    });
    
    const width = 1200;
    const height = 800;
    
    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();
    
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);
    
    // Créer données de démonstration
    const nodes = [
      ...recettesCBD.map((r: any, i: number) => ({
        id: `recette-${r.id}`,
        name: r.name,
        type: "recette",
        collection: r.name.includes("Mastiha") || r.name.includes("Vétiver") || r.name.includes("Figue") || r.name.includes("Noir") || r.name.includes("Cuir") ? "classique" : "experimentale",
        x: Math.random() * width,
        y: Math.random() * height,
      })),
      { id: "mol-myrcene", name: "Myrcène", type: "molecule", x: width / 2, y: height / 2 },
      { id: "mol-limonene", name: "Limonène", type: "molecule", x: width / 2 + 100, y: height / 2 },
      { id: "mol-pinene", name: "α-Pinène", type: "molecule", x: width / 2 - 100, y: height / 2 },
      { id: "mol-caryo", name: "β-Caryophyllène", type: "molecule", x: width / 2, y: height / 2 + 100 },
      { id: "mol-linalool", name: "Linalool", type: "molecule", x: width / 2, y: height / 2 - 100 },
    ];
    
    const demoLinks = recettesCBD.flatMap((r: any, i: number) => [
      { source: `recette-${r.id}`, target: "mol-myrcene", value: 30 },
      { source: `recette-${r.id}`, target: "mol-limonene", value: 25 },
      { source: `recette-${r.id}`, target: "mol-pinene", value: 20 },
    ]);
    
    // Simulation de force
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(demoLinks).id((d: any) => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50));
    
    // Liens
    const link = svg.append("g")
      .selectAll("line")
      .data(demoLinks)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d: any) => Math.sqrt(d.value) / 2);
    
    // Nœuds
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);
    
    node.append("circle")
      .attr("r", (d: any) => d.type === "recette" ? 20 : 15)
      .attr("fill", (d: any) => d.type === "recette" ? "#8b5cf6" : "#10b981")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);
    
    node.append("text")
      .text((d: any) => d.name)
      .attr("x", 25)
      .attr("y", 5)
      .attr("font-size", 12)
      .attr("fill", "#333");
    
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
  }, [recettesCBD, filter]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Graphe Molécules-Recettes</h1>
            <p className="text-muted-foreground">
              Visualisation interactive des relations entre recettes CBD et terpènes
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              Toutes
            </Button>
            <Button
              variant={filter === "classique" ? "default" : "outline"}
              onClick={() => setFilter("classique")}
            >
              Classique
            </Button>
            <Button
              variant={filter === "experimentale" ? "default" : "outline"}
              onClick={() => setFilter("experimentale")}
            >
              Expérimentale
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Graphe Interactif</CardTitle>
          </CardHeader>
          <CardContent>
            {recettesLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Chargement du graphe...
              </div>
            ) : (
              <div className="bg-muted/20 rounded-lg p-4">
                <svg ref={svgRef} className="w-full" style={{ minHeight: "600px" }} />
              </div>
            )}
            
            <div className="mt-4 flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-500" />
                <span>Recettes CBD</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500" />
                <span>Molécules (Terpènes)</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Légende</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Cliquez et glissez les nœuds pour explorer le graphe</p>
            <p>• L'épaisseur des liens représente la proportion de terpène dans la recette</p>
            <p>• Les nœuds violets représentent les recettes CBD</p>
            <p>• Les nœuds verts représentent les molécules terpéniques</p>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
