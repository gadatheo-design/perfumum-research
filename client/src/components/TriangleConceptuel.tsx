import { useState } from "react";

export function TriangleConceptuel() {
  const [activeVertex, setActiveVertex] = useState<string | null>(null);

  const vertices = {
    sol: {
      x: 200,
      y: 350,
      label: "SOL",
      description: "Terre, minéralité, géosmine",
      color: "#8B4513",
    },
    vegetal: {
      x: 50,
      y: 50,
      label: "VÉGÉTAL",
      description: "Feuilles, racines, sève",
      color: "#228B22",
    },
    pluie: {
      x: 350,
      y: 50,
      label: "PLUIE",
      description: "Eau, ozone, fraîcheur",
      color: "#4682B4",
    },
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-card rounded-lg border">
      <h3 className="text-xl font-bold mb-4 text-center">Triangle Conceptuel</h3>
      <p className="text-sm text-muted-foreground mb-6 text-center">
        Cliquez sur les sommets pour explorer les relations
      </p>

      <svg
        viewBox="0 0 400 400"
        className="w-full h-auto"
        style={{ maxHeight: "400px" }}
      >
        {/* Triangle principal */}
        <polygon
          points={`${vertices.sol.x},${vertices.sol.y} ${vertices.vegetal.x},${vertices.vegetal.y} ${vertices.pluie.x},${vertices.pluie.y}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground/30"
        />

        {/* Lignes de connexion */}
        <line
          x1={vertices.sol.x}
          y1={vertices.sol.y}
          x2={vertices.vegetal.x}
          y2={vertices.vegetal.y}
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 4"
          className="text-muted-foreground/50"
        />
        <line
          x1={vertices.sol.x}
          y1={vertices.sol.y}
          x2={vertices.pluie.x}
          y2={vertices.pluie.y}
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 4"
          className="text-muted-foreground/50"
        />
        <line
          x1={vertices.vegetal.x}
          y1={vertices.vegetal.y}
          x2={vertices.pluie.x}
          y2={vertices.pluie.y}
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 4"
          className="text-muted-foreground/50"
        />

        {/* Sommets interactifs */}
        {Object.entries(vertices).map(([key, vertex]) => (
          <g key={key}>
            <circle
              cx={vertex.x}
              cy={vertex.y}
              r={activeVertex === key ? 25 : 20}
              fill={vertex.color}
              stroke="white"
              strokeWidth="3"
              className="cursor-pointer transition-all duration-300"
              style={{
                filter: activeVertex === key ? "drop-shadow(0 0 10px rgba(255,255,255,0.5))" : "none",
              }}
              onMouseEnter={() => setActiveVertex(key)}
              onMouseLeave={() => setActiveVertex(null)}
              onClick={() => setActiveVertex(activeVertex === key ? null : key)}
            />
            <text
              x={vertex.x}
              y={vertex.y + 50}
              textAnchor="middle"
              className="text-sm font-bold fill-current"
              style={{ userSelect: "none" }}
            >
              {vertex.label}
            </text>
          </g>
        ))}

        {/* Centre du triangle - Pétrichor */}
        <circle
          cx={200}
          cy={150}
          r={15}
          fill="oklch(0.65 0.15 280)"
          stroke="white"
          strokeWidth="2"
          className="animate-pulse"
        />
        <text
          x={200}
          y={155}
          textAnchor="middle"
          className="text-xs font-bold fill-white"
          style={{ userSelect: "none" }}
        >
          P
        </text>
      </svg>

      {/* Description active */}
      {activeVertex && (
        <div className="mt-6 p-4 bg-muted rounded-lg animate-fadeIn">
          <h4 className="font-bold mb-2" style={{ color: vertices[activeVertex as keyof typeof vertices].color }}>
            {vertices[activeVertex as keyof typeof vertices].label}
          </h4>
          <p className="text-sm text-muted-foreground">
            {vertices[activeVertex as keyof typeof vertices].description}
          </p>
        </div>
      )}

      {/* Légende */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm">
        <p className="font-semibold mb-2">Légende :</p>
        <ul className="space-y-1 text-muted-foreground">
          <li>• <strong>P</strong> (centre) : Pétrichor, l'odeur de la pluie sur la terre sèche</li>
          <li>• Les sommets représentent les 3 dimensions fondamentales</li>
          <li>• Le triangle symbolise l'interdépendance des éléments</li>
        </ul>
      </div>
    </div>
  );
}
