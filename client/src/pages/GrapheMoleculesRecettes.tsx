import { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
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
import { Network, Beaker, FlaskConical, Share2, MousePointer, Move, Sparkles } from "lucide-react";

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
    if (!svgRef.current || !recettesData || recettesData?.length === 0) return;
    
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
    const filteredRecettes = recettesData?.filter((r: any) => {
      if (filter === "all") return true;
      if (!r.name) return false;
      const isClassique = r.name?.includes("Mastiha") || r.name?.includes("Vétiver") || r.name?.includes("Figue") || r.name?.includes("Noir") || r.name?.includes("Cuir");
      return filter === "classique" ? isClassique : !isClassique;
    });
    
    // Extraire toutes les molécules uniques et créer les liens
    filteredRecettes.forEach((recette: any) => {
      recette.molecules?.forEach((rm: any) => {
        const mol = rm.molecule;
        if (!mol) return; // Skip if molecule is undefined
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
        collection: r.name?.includes("Mastiha") || r.name?.includes("Vétiver") || r.name?.includes("Figue") || r.name?.includes("Noir") || r.name?.includes("Cuir") ? "classique" : "experimentale",
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
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed pointer-events-none z-50 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg p-3 max-w-xs"
        style={{ opacity: 0 }}
      />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 border-b border-border/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
                <Network className="w-4 h-4 mr-2" />
                Visualisation Réseau
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                Graphe Molécules-Recettes
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                Visualisation interactive des relations entre recettes CBD et terpènes.
                Explorez les connexions moléculaires de manière intuitive.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-6">
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="text-2xl font-bold text-foreground">{recettesData?.length || 0}</div>
                  <div className="text-xs text-muted-foreground">Recettes</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="text-2xl font-bold text-foreground">{allMolecules?.length || 0}</div>
                  <div className="text-xs text-muted-foreground">Molécules</div>
                </div>
              </div>
              
              {/* Filtres */}
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                >
                  Toutes les recettes
                </Button>
                <Button
                  variant={filter === "classique" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("classique")}
                >
                  Classiques
                </Button>
                <Button
                  variant={filter === "experimentale" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("experimentale")}
                >
                  Expérimentales
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container py-8 space-y-6">
        
        <Card className="border-border/50">
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
        
        {/* Légende et instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-purple-600" />
                Légende du graphe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-purple-500 flex-shrink-0" />
                <span className="text-sm">Recettes CBD (nœuds violets)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500 flex-shrink-0" />
                <span className="text-sm">Molécules terpéniques (nœuds verts)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-1 bg-gray-400 rounded flex-shrink-0" />
                <span className="text-sm">Liens (épaisseur = proportion)</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-violet-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointer className="w-5 h-5 text-violet-600" />
                Interactions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Move className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span><strong>Glissez</strong> les nœuds pour réorganiser</span>
              </div>
              <div className="flex items-start gap-2">
                <MousePointer className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span><strong>Survolez</strong> pour voir les détails</span>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span><strong>Cliquez</strong> pour le mode Focus</span>
              </div>
              <div className="flex items-start gap-2">
                <Network className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span><strong>Double-cliquez</strong> pour réinitialiser</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation vers pages connexes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-muted/30 rounded-lg"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-purple-600" />
            Visualisations connexes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/sankey-flow">
              <div className="block p-4 bg-background rounded-lg border hover:border-purple-500/50 transition-colors cursor-pointer">
                <div className="font-medium">Sankey Flow</div>
                <div className="text-sm text-muted-foreground">Flux des familles vers les recettes</div>
              </div>
            </Link>
            <Link href="/synergies-heatmap">
              <div className="block p-4 bg-background rounded-lg border hover:border-purple-500/50 transition-colors cursor-pointer">
                <div className="font-medium">Heatmap Synergies</div>
                <div className="text-sm text-muted-foreground">Matrice des synergies moléculaires</div>
              </div>
            </Link>
            <Link href="/compare-radar">
              <div className="block p-4 bg-background rounded-lg border hover:border-purple-500/50 transition-colors cursor-pointer">
                <div className="font-medium">Comparateur Radar</div>
                <div className="text-sm text-muted-foreground">Comparer les profils olfactifs</div>
              </div>
            </Link>
          </div>
        </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
