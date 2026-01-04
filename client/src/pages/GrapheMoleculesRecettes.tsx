import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import * as d3 from "d3";
import { useLocation } from "wouter";

export default function GrapheMoleculesRecettes() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<"all" | "classique" | "experimentale">("all");
  const [focusedNode, setFocusedNode] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  
  // Observer les changements de taille du conteneur
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        // Adapter la hauteur selon la largeur (ratio 3:2 pour mobile, 3:2 pour desktop)
        const isMobile = width < 768;
        const height = isMobile ? Math.min(width * 1.2, 600) : Math.min(width * 0.67, 800);
        setDimensions({ width: Math.max(width, 300), height: Math.max(height, 400) });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Charger les données réelles via tRPC
  const { data: recettesData, isLoading: recettesLoading } = trpc.recettes.getAllWithMolecules.useQuery();
  const { data: allMolecules } = trpc.molecules.list.useQuery();
  const terpenes = allMolecules?.filter((m: any) => [1, 2, 3, 4, 5, 6, 7].includes(m.id)) || [];
  
  useEffect(() => {
    if (!svgRef.current || !recettesData || recettesData.length === 0) return;
    
    const { width, height } = dimensions;
    const isMobile = width < 768;
    
    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();
    
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);
    
    // Construire les nœuds et liens à partir des données réelles
    const moleculesMap = new Map();
    const links: any[] = [];
    
    // Filtrer les recettes selon le filtre actif
    const filteredRecettes = recettesData.filter((r: any) => {
      if (filter === "all") return true;
      if (!r.name) return false;
      const isClassique = r.name.includes("Mastiha") || r.name.includes("Vétiver") || r.name.includes("Figue") || r.name.includes("Noir") || r.name.includes("Cuir");
      return filter === "classique" ? isClassique : !isClassique;
    });
    
    // Extraire toutes les molécules uniques et créer les liens
    filteredRecettes.forEach((recette: any) => {
      recette.molecules?.forEach((rm: any) => {
        const mol = rm.molecule;
        if (!moleculesMap.has(mol.id)) {
          moleculesMap.set(mol.id, {
            id: `mol-${mol.id}`,
            name: mol.name,
            type: "molecule",
          });
        }
        links.push({
          source: `recette-${recette.id}`,
          target: `mol-${mol.id}`,
          value: parseFloat(rm.proportion) || 30,
        });
      });
    });
    
    // Créer les nœuds
    const nodes = [
      ...filteredRecettes.map((r: any) => ({
        id: `recette-${r.id}`,
        name: r.name,
        type: "recette",
        collection: r.name.includes("Mastiha") || r.name.includes("Vétiver") || r.name.includes("Figue") || r.name.includes("Noir") || r.name.includes("Cuir") ? "classique" : "experimentale",
      })),
      ...Array.from(moleculesMap.values()),
    ];
    
    // Simulation de force - adaptée pour mobile
    const linkDistance = isMobile ? 80 : 150;
    const chargeStrength = isMobile ? -150 : -300;
    const collisionRadius = isMobile ? 30 : 50;
    
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(linkDistance))
      .force("charge", d3.forceManyBody().strength(chargeStrength))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(collisionRadius));
    
    // Liens
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("class", "link")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d: any) => Math.sqrt(d.value) * 2);
    
    // Nœuds
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);
    
    // Taille des nœuds adaptée pour mobile
    const nodeRadiusRecette = isMobile ? 14 : 20;
    const nodeRadiusMolecule = isMobile ? 10 : 15;
    
    node.append("circle")
      .attr("r", (d: any) => d.type === "recette" ? nodeRadiusRecette : nodeRadiusMolecule)
      .attr("fill", (d: any) => d.type === "recette" ? "#8b5cf6" : "#10b981")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("cursor", "pointer")
      .on("mouseover", function(event: any, d: any) {
        // Afficher tooltip
        if (tooltipRef.current) {
          const tooltip = d3.select(tooltipRef.current);
          
          if (d.type === "recette") {
            const recette = filteredRecettes.find((r: any) => `recette-${r.id}` === d.id);
            tooltip.html(`
              <div class="font-semibold mb-1">${d.name}</div>
              <div class="text-xs text-muted-foreground">
                ${recette?.recette?.description || "Recette CBD"}
              </div>
              <div class="text-xs mt-1">
                <strong>Collection:</strong> ${d.collection}
              </div>
            `);
          } else {
            const molId = parseInt(d.id.replace("mol-", ""));
            const mol = terpenes.find((t: any) => t.id === molId);
            tooltip.html(`
              <div class="font-semibold mb-1">${d.name}</div>
              <div class="text-xs text-muted-foreground">
                ${mol?.olfactiveProfile || "Terpène"}
              </div>
              ${mol?.chemicalFormula ? `<div class="text-xs mt-1"><strong>Formule:</strong> ${mol.chemicalFormula}</div>` : ""}
              ${mol?.therapeuticProperties ? `<div class="text-xs mt-1"><strong>Propriétés:</strong> ${mol.therapeuticProperties.split(",").slice(0, 3).join(", ")}...</div>` : ""}
            `);
          }
          
          tooltip
            .style("opacity", 1)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px");
        }
        
        // Highlight
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", (d: any) => d.type === "recette" ? 25 : 20)
          .attr("stroke-width", 3);
      })
      .on("mouseout", function() {
        // Cacher tooltip
        if (tooltipRef.current) {
          d3.select(tooltipRef.current).style("opacity", 0);
        }
        
        // Remove highlight
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", (d: any) => d.type === "recette" ? 20 : 15)
          .attr("stroke-width", 2);
      })
      .on("click", function(event: any, d: any) {
        event.stopPropagation();
        
        // Simple clic : activer mode Focus
        if (focusedNode === d.id) {
          // Déjà focusé, naviguer vers la page
          if (d.type === "recette") {
            const recetteId = d.id.replace("recette-", "");
            setLocation(`/resine-cbd/${recetteId}`);
          } else {
            const molId = d.id.replace("mol-", "");
            setLocation(`/terpene/${molId}`);
          }
        } else {
          // Activer mode Focus
          setFocusedNode(d.id);
        }
      })
      .on("dblclick", function(event: any) {
        event.stopPropagation();
        // Double-clic : réinitialiser Focus
        setFocusedNode(null);
      });
    
    // Texte adapté pour mobile (masqué sur très petits écrans)
    node.append("text")
      .text((d: any) => isMobile && d.name.length > 12 ? d.name.substring(0, 10) + "..." : d.name)
      .attr("x", isMobile ? 15 : 25)
      .attr("y", 5)
      .attr("font-size", isMobile ? 10 : 12)
      .attr("fill", "currentColor")
      .attr("pointer-events", "none")
      .style("display", width < 400 ? "none" : "block");
    
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
  }, [recettesData, filter, focusedNode, dimensions]);
  
  // Effet pour appliquer le mode Focus
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    
    if (focusedNode) {
      // Trouver les nœuds connectés
      const connectedNodes = new Set<string>([focusedNode]);
      
      svg.selectAll(".link").each(function(this: any, d: any) {
        if (d.source.id === focusedNode) connectedNodes.add(d.target.id);
        if (d.target.id === focusedNode) connectedNodes.add(d.source.id);
      });
      
      // Fade out les nœuds non connectés
      svg.selectAll(".node")
        .transition()
        .duration(300)
        .style("opacity", function(this: any, d: any) {
          return connectedNodes.has(d.id) ? 1 : 0.15;
        });
      
      // Fade out les liens non connectés
      svg.selectAll(".link")
        .transition()
        .duration(300)
        .style("opacity", function(this: any, d: any) {
          return d.source.id === focusedNode || d.target.id === focusedNode ? 0.6 : 0.05;
        });
    } else {
      // Réinitialiser l'opacité
      svg.selectAll(".node")
        .transition()
        .duration(300)
        .style("opacity", 1);
      
      svg.selectAll(".link")
        .transition()
        .duration(300)
        .style("opacity", 0.6);
    }
  }, [focusedNode]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed pointer-events-none z-50 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg p-3 max-w-xs"
        style={{ opacity: 0 }}
      />
      
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
            <div className="flex items-center justify-between">
              <CardTitle>Graphe Interactif</CardTitle>
              {focusedNode && (
                <Badge variant="secondary" className="animate-pulse">
                  Mode Focus actif - Double-clic pour réinitialiser
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {recettesLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Chargement du graphe...
              </div>
            ) : (
              <div ref={containerRef} className="bg-muted/20 rounded-lg p-2 sm:p-4 overflow-hidden touch-pan-x touch-pan-y">
                <svg 
                  ref={svgRef} 
                  className="w-full transition-all duration-300" 
                  style={{ 
                    height: `${dimensions.height}px`,
                    minHeight: "400px",
                    maxHeight: "800px"
                  }} 
                />
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
            <p>• <strong>Glissez</strong> les nœuds pour réorganiser le graphe</p>
            <p>• <strong>Survolez</strong> un nœud pour voir ses détails</p>
            <p>• <strong>Cliquez</strong> sur un nœud pour activer le <strong>mode Focus</strong> (isole ses connexions)</p>
            <p>• <strong>Cliquez à nouveau</strong> sur le nœud focusé pour naviguer vers sa fiche détaillée</p>
            <p>• <strong>Double-cliquez</strong> n'importe où pour réinitialiser le mode Focus</p>
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
