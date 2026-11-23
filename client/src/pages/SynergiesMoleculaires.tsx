import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Network, Filter, Zap, Shield, Shuffle, EyeOff } from "lucide-react";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import * as d3 from "d3";

type EffectType = "potentialisation" | "stabilisation" | "transformation" | "masquage";

const effectConfig = {
  potentialisation: {
    label: "Potentialisation",
    icon: Zap,
    color: "#f59e0b",
    description: "Amplifie l'intensité olfactive"
  },
  stabilisation: {
    label: "Stabilisation",
    icon: Shield,
    color: "#10b981",
    description: "Prolonge la tenue et fixe les notes volatiles"
  },
  transformation: {
    label: "Transformation",
    icon: Shuffle,
    color: "#8b5cf6",
    description: "Crée de nouvelles facettes aromatiques"
  },
  masquage: {
    label: "Masquage",
    icon: EyeOff,
    color: "#6b7280",
    description: "Atténue les notes indésirables"
  }
};

export default function SynergiesMoleculaires() {
  const [selectedEffect, setSelectedEffect] = useState<EffectType | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  const { data: synergies = [], isLoading } = trpc.synergies?.getGraphData.useQuery();

  // Filtrer les synergies par effet
  const filteredSynergies = selectedEffect
    ? synergies?.filter((s) => s.effectType === selectedEffect)
    : synergies;

  // Construire les nœuds et liens pour D3.js
  const graphData = {
    nodes: Array.from(
      new Set([
        ...filteredSynergies.map((s) => s.molecule1Name),
        ...filteredSynergies.map((s) => s.molecule2Name),
      ])
    ).map((name) => ({ id: name, name })),
    links: filteredSynergies.map((s) => ({
      source: s.molecule1Name,
      target: s.molecule2Name,
      effectType: s.effectType,
      description: s.description,
      intensity: s.intensity || 50,
    })),
  };

  // Dessiner le graphe D3.js
  useEffect(() => {
    if (!svgRef.current || graphData.nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const width = dimensions.width;
    const height = dimensions.height;

    // Créer le groupe principal avec zoom/pan
    const g = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Simulation de force
    const simulation = d3
      .forceSimulation(graphData.nodes as any)
      .force(
        "link",
        d3.forceLink(graphData.links).id((d: any) => d.id).distance(150)
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(60));

    // Dessiner les liens (arêtes)
    const link = g
      .append("g")
      .selectAll("line")
      .data(graphData.links)
      .join("line")
      .attr("stroke", (d: any) => effectConfig[d.effectType as EffectType].color)
      .attr("stroke-width", (d: any) => Math.max(2, d.intensity / 20))
      .attr("stroke-opacity", 0.6);

    // Dessiner les nœuds (molécules)
    const node = g
      .append("g")
      .selectAll("circle")
      .data(graphData.nodes)
      .join("circle")
      .attr("r", 20)
      .attr("fill", "oklch(0.7 0.15 240)")
      .attr("stroke", "oklch(0.9 0.05 240)")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .call(
        d3.drag<any, any>()
          .on("start", (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d: any) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Labels des nœuds
    const label = g
      .append("g")
      .selectAll("text")
      .data(graphData.nodes)
      .join("text")
      .text((d: any) => d.name)
      .attr("font-size", 12)
      .attr("dx", 25)
      .attr("dy", 4)
      .attr("fill", "currentColor")
      .style("pointer-events", "none");

    // Mettre à jour les positions à chaque tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);

      label.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y);
    });

    return () => {
      simulation.stop();
    };
  }, [graphData, dimensions]);

  // Responsive dimensions
  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById("graph-container");
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: Math.max(600, window.innerHeight - 400),
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs />
        <main className="flex-1 container py-8">
          <h1 className="text-3xl font-bold mb-8">Synergies Moléculaires</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Breadcrumbs />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-background via-muted/20 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Network className="h-10 w-10 text-primary" />
                <h1 className="text-4xl md:text-5xl font-bold">Synergies Moléculaires</h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Visualisation interactive des {synergies?.length} synergies identifiées entre molécules. Explorez les interactions qui créent des effets olfactifs uniques.
              </p>
            </div>
          </div>
        </section>

        {/* Filtres par effet */}
        <section className="py-8 border-b bg-muted/30">
          <div className="container">
            <div className="max-w-6xl mx-auto space-y-4">
              <div className="flex flex-wrap gap-2 items-center">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Filtrer par effet :</span>
                {(Object.keys(effectConfig) as EffectType[]).map((effect) => {
                  const config = effectConfig[effect];
                  const Icon = config.icon;
                  const count = synergies?.filter((s) => s.effectType === effect).length;
                  return (
                    <Button
                      key={effect}
                      variant={selectedEffect === effect ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedEffect(selectedEffect === effect ? null : effect)}
                      className="gap-2"
                    >
                      <Icon className="h-3 w-3" />
                      {config.label}
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                        {count}
                      </Badge>
                    </Button>
                  );
                })}
                {selectedEffect && (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedEffect(null)}>
                    Réinitialiser
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Graphe D3.js */}
        <section className="py-8">
          <div className="container">
            <Card>
              <CardHeader>
                <CardTitle>Graphe des Interactions</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {filteredSynergies.length} synergies affichées • Glissez les nœuds • Zoom avec la molette
                </p>
              </CardHeader>
              <CardContent>
                <div id="graph-container" className="w-full overflow-hidden rounded-lg border bg-background">
                  <svg
                    ref={svgRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Légende */}
        <section className="py-8 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Légende des Effets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Object.keys(effectConfig) as EffectType[]).map((effect) => {
                  const config = effectConfig[effect];
                  const Icon = config.icon;
                  return (
                    <Card key={effect}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Icon className="h-5 w-5" style={{ color: config.color }} />
                          {config.label}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{config.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Liste des synergies */}
        <section className="py-8">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Liste Détaillée</h2>
              <div className="space-y-4">
                {filteredSynergies.map((synergie) => {
                  const config = effectConfig[synergie.effectType as EffectType];
                  const Icon = config.icon;
                  return (
                    <Card key={synergie.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Icon className="h-5 w-5" style={{ color: config.color }} />
                          <span className="text-primary">{synergie.molecule1Name}</span>
                          <span className="text-muted-foreground">×</span>
                          <span className="text-primary">{synergie.molecule2Name}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" style={{ borderColor: config.color, color: config.color }}>
                              {config.label}
                            </Badge>
                            {synergie.intensity && (
                              <Badge variant="secondary">
                                Intensité : {synergie.intensity}%
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{synergie.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
