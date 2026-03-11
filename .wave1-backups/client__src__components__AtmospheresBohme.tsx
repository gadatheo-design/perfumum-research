// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface Atmosphere {
  id: string;
  label: string;
  intensity: number;
  description: string;
  color: string;
}

const atmospheres: Atmosphere[] = [
  {
    id: "terrestre",
    label: "Terrestre",
    intensity: 85,
    description: "Sol humide, minéralité, ancrage physique",
    color: "#8B4513",
  },
  {
    id: "vegetal",
    label: "Végétal",
    intensity: 70,
    description: "Feuilles, sève, vie organique",
    color: "#228B22",
  },
  {
    id: "aquatique",
    label: "Aquatique",
    intensity: 65,
    description: "Pluie, fraîcheur, fluidité",
    color: "#4682B4",
  },
  {
    id: "aerien",
    label: "Aérien",
    intensity: 50,
    description: "Ozone, légèreté, volatilité",
    color: "#87CEEB",
  },
  {
    id: "memoriel",
    label: "Mémoriel",
    intensity: 90,
    description: "Trace du passé, nostalgie, archive",
    color: "#9370DB",
  },
];

export function AtmospheresBohme() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeAtmosphere, setActiveAtmosphere] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Nettoyer le SVG
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Échelles
    const xScale = d3
      .scaleBand()
      .domain(atmospheres.map((d) => d.label))
      .range([0, innerWidth])
      .padding(0.3);

    const yScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([innerHeight, 0]);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("class", "text-xs fill-current")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    g.append("g")
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll("text")
      .attr("class", "text-xs fill-current");

    // Titre de l'axe Y
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 15)
      .attr("x", 0 - innerHeight / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("class", "text-sm fill-current font-semibold")
      .text("Intensité atmosphérique");

    // Barres
    const bars = g
      .selectAll(".bar")
      .data(atmospheres)
      .enter()
      .append("rect")
      .attr("class", "bar cursor-pointer transition-all duration-300")
      .attr("x", (d) => xScale(d.label) || 0)
      .attr("y", (d) => yScale(d.intensity))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => innerHeight - yScale(d.intensity))
      .attr("fill", (d) => d.color)
      .attr("opacity", 0.8)
      .on("mouseenter", function (event, d) {
        d3.select(this).attr("opacity", 1).attr("stroke", "white").attr("stroke-width", 2);
        setActiveAtmosphere(d.id);
      })
      .on("mouseleave", function () {
        d3.select(this).attr("opacity", 0.8).attr("stroke", "none");
        setActiveAtmosphere(null);
      });

    // Valeurs au-dessus des barres
    g.selectAll(".label")
      .data(atmospheres)
      .enter()
      .append("text")
      .attr("class", "label text-xs fill-current font-bold")
      .attr("x", (d) => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.intensity) - 5)
      .attr("text-anchor", "middle")
      .text((d) => d.intensity);
  }, []);

  const activeData = atmospheres.find((a) => a.id === activeAtmosphere);

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-card rounded-lg border">
      <h3 className="text-xl font-bold mb-4 text-center">
        Atmosphères Olfactives selon Gernot Böhme
      </h3>
      <p className="text-sm text-muted-foreground mb-6 text-center">
        Les atmosphères comme espaces affectifs créés par l'odeur
      </p>

      <svg ref={svgRef} className="w-full h-auto" style={{ maxHeight: "400px" }} />

      {/* Description active */}
      {activeData && (
        <div
          className="mt-6 p-4 rounded-lg animate-fadeIn"
          style={{
            backgroundColor: `color-mix(in oklch, ${activeData.color} 15%, transparent)`,
            border: `2px solid ${activeData.color}`,
          }}
        >
          <h4 className="font-bold mb-2" style={{ color: activeData.color }}>
            {activeData.label} ({activeData.intensity}%)
          </h4>
          <p className="text-sm text-foreground/90">{activeData.description}</p>
        </div>
      )}

      {/* Légende */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm">
        <p className="font-semibold mb-2">Concept de Böhme :</p>
        <p className="text-muted-foreground leading-relaxed">
          Les atmosphères ne sont ni purement objectives (dans l'objet) ni purement subjectives
          (dans le sujet), mais des <strong>espaces affectifs</strong> qui enveloppent et
          transforment notre expérience. L'odeur du pétrichor crée une atmosphère unique qui
          mêle ces cinq dimensions.
        </p>
      </div>
    </div>
  );
}
