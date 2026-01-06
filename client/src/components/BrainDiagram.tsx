import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Info, Zap, Heart, BookOpen, ArrowRight } from "lucide-react";

// Définition des structures cérébrales avec leurs positions et informations
const BRAIN_STRUCTURES = [
  {
    id: "olfactory-bulb",
    name: "Bulbe olfactif",
    shortName: "Bulbe",
    position: { x: 25, y: 65 },
    color: "#8b5cf6", // violet
    description: "Premier relais du traitement olfactif. Reçoit directement les signaux des neurones récepteurs olfactifs.",
    functions: ["Réception des signaux olfactifs", "Premier traitement de l'information", "Filtrage et amplification"],
    connections: ["piriform-cortex", "amygdala"],
    memoryRole: "Point d'entrée de l'information olfactive vers les circuits de la mémoire",
    keyFact: "Contient environ 50 000 glomérules traitant 350-400 types de récepteurs"
  },
  {
    id: "piriform-cortex",
    name: "Cortex piriforme",
    shortName: "Piriforme",
    position: { x: 40, y: 55 },
    color: "#06b6d4", // cyan
    description: "Cortex olfactif primaire. Responsable de l'identification et de la catégorisation des odeurs.",
    functions: ["Identification des odeurs", "Catégorisation olfactive", "Apprentissage associatif"],
    connections: ["olfactory-bulb", "hippocampus", "amygdala", "orbitofrontal"],
    memoryRole: "Compare les odeurs aux traces mnésiques existantes pour l'identification",
    keyFact: "Structure à trois couches (paléocortex) phylogénétiquement ancienne"
  },
  {
    id: "hippocampus",
    name: "Hippocampe",
    shortName: "Hippocampe",
    position: { x: 60, y: 50 },
    color: "#10b981", // emerald
    description: "Structure essentielle pour la formation et la consolidation des souvenirs épisodiques.",
    functions: ["Formation des souvenirs", "Consolidation mnésique", "Navigation spatiale", "Mémoire contextuelle"],
    connections: ["piriform-cortex", "amygdala", "orbitofrontal"],
    memoryRole: "Encode le contexte spatio-temporel des souvenirs olfactifs (où, quand, avec qui)",
    keyFact: "Les souvenirs olfactifs activent préférentiellement l'hippocampe antérieur"
  },
  {
    id: "amygdala",
    name: "Amygdale",
    shortName: "Amygdale",
    position: { x: 55, y: 65 },
    color: "#ef4444", // red
    description: "Centre du traitement des émotions, particulièrement la peur et le plaisir.",
    functions: ["Traitement émotionnel", "Conditionnement de la peur", "Évaluation de la valence", "Mémoire émotionnelle"],
    connections: ["olfactory-bulb", "piriform-cortex", "hippocampus", "orbitofrontal"],
    memoryRole: "Associe les odeurs aux émotions et renforce les souvenirs émotionnellement chargés",
    keyFact: "Connexion directe avec le bulbe olfactif - unique parmi les sens"
  },
  {
    id: "orbitofrontal",
    name: "Cortex orbitofrontal",
    shortName: "OFC",
    position: { x: 35, y: 35 },
    color: "#f59e0b", // amber
    description: "Région du cortex préfrontal impliquée dans l'évaluation hédonique et la prise de décision.",
    functions: ["Évaluation hédonique", "Prise de décision", "Intégration multimodale", "Conscience olfactive"],
    connections: ["piriform-cortex", "hippocampus", "amygdala"],
    memoryRole: "Intègre les informations olfactives avec le contexte et les attentes",
    keyFact: "Corrèle avec les jugements de plaisir olfactif et les préférences"
  },
  {
    id: "thalamus",
    name: "Thalamus",
    shortName: "Thalamus",
    position: { x: 50, y: 40 },
    color: "#6366f1", // indigo
    description: "Relais sensoriel principal du cerveau - MAIS l'olfaction le contourne largement.",
    functions: ["Relais sensoriel (autres sens)", "Régulation de l'éveil", "Attention sélective"],
    connections: ["orbitofrontal"],
    memoryRole: "Contrairement aux autres sens, l'olfaction n'utilise pas le thalamus comme relais principal",
    keyFact: "L'olfaction est le seul sens à contourner le thalamus pour accéder au cortex"
  }
];

// Connexions entre structures
const CONNECTIONS = [
  { from: "olfactory-bulb", to: "piriform-cortex", type: "primary", label: "Voie principale" },
  { from: "olfactory-bulb", to: "amygdala", type: "direct", label: "Connexion directe" },
  { from: "piriform-cortex", to: "hippocampus", type: "primary", label: "Via cortex entorhinal" },
  { from: "piriform-cortex", to: "amygdala", type: "primary", label: "Traitement émotionnel" },
  { from: "piriform-cortex", to: "orbitofrontal", type: "primary", label: "Évaluation consciente" },
  { from: "amygdala", to: "hippocampus", type: "modulatory", label: "Modulation émotionnelle" },
  { from: "hippocampus", to: "orbitofrontal", type: "feedback", label: "Contexte mnésique" },
];

interface BrainDiagramProps {
  onStructureClick?: (structureId: string) => void;
  highlightedStructure?: string;
  showConnections?: boolean;
}

export default function BrainDiagram({ 
  onStructureClick, 
  highlightedStructure,
  showConnections = true 
}: BrainDiagramProps) {
  const [selectedStructure, setSelectedStructure] = useState<string | null>(null);
  const [hoveredStructure, setHoveredStructure] = useState<string | null>(null);

  const activeStructure = selectedStructure || hoveredStructure;
  const structureData = activeStructure 
    ? BRAIN_STRUCTURES.find(s => s.id === activeStructure) 
    : null;

  const handleStructureClick = (structureId: string) => {
    setSelectedStructure(selectedStructure === structureId ? null : structureId);
    onStructureClick?.(structureId);
  };

  // Calculer les connexions à afficher
  const activeConnections = activeStructure
    ? CONNECTIONS.filter(c => c.from === activeStructure || c.to === activeStructure)
    : [];

  return (
    <div className="space-y-6">
      {/* Titre et légende */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Schéma cérébral olfactif
          </h3>
          <p className="text-sm text-muted-foreground">
            Cliquez sur une structure pour voir ses détails et connexions
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            <div className="w-2 h-2 rounded-full bg-purple-500 mr-1" />
            Entrée olfactive
          </Badge>
          <Badge variant="outline" className="text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1" />
            Mémoire
          </Badge>
          <Badge variant="outline" className="text-xs">
            <div className="w-2 h-2 rounded-full bg-red-500 mr-1" />
            Émotion
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Diagramme SVG */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 aspect-[4/3]">
                {/* SVG du cerveau stylisé */}
                <svg 
                  viewBox="0 0 100 80" 
                  className="w-full h-full"
                  style={{ filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))" }}
                >
                  {/* Fond du cerveau */}
                  <defs>
                    <radialGradient id="brainGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#374151" />
                      <stop offset="100%" stopColor="#1f2937" />
                    </radialGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Silhouette du cerveau */}
                  <ellipse 
                    cx="50" cy="45" rx="35" ry="28" 
                    fill="url(#brainGradient)" 
                    stroke="#4b5563" 
                    strokeWidth="0.5"
                    opacity="0.8"
                  />

                  {/* Connexions */}
                  {showConnections && CONNECTIONS.map((conn, idx) => {
                    const fromStruct = BRAIN_STRUCTURES.find(s => s.id === conn.from);
                    const toStruct = BRAIN_STRUCTURES.find(s => s.id === conn.to);
                    if (!fromStruct || !toStruct) return null;

                    const isActive = activeConnections.some(
                      c => (c.from === conn.from && c.to === conn.to) ||
                           (c.from === conn.to && c.to === conn.from)
                    );

                    return (
                      <line
                        key={idx}
                        x1={fromStruct.position.x}
                        y1={fromStruct.position.y}
                        x2={toStruct.position.x}
                        y2={toStruct.position.y}
                        stroke={isActive ? "#a855f7" : "#4b5563"}
                        strokeWidth={isActive ? "1" : "0.3"}
                        strokeDasharray={conn.type === "modulatory" ? "2,2" : conn.type === "feedback" ? "1,1" : "none"}
                        opacity={isActive ? 1 : 0.3}
                        className="transition-all duration-300"
                      />
                    );
                  })}

                  {/* Structures cérébrales */}
                  {BRAIN_STRUCTURES.map((structure) => {
                    const isActive = activeStructure === structure.id;
                    const isConnected = activeConnections.some(
                      c => c.from === structure.id || c.to === structure.id
                    );
                    const isHighlighted = highlightedStructure === structure.id;

                    return (
                      <g key={structure.id}>
                        {/* Cercle de la structure */}
                        <circle
                          cx={structure.position.x}
                          cy={structure.position.y}
                          r={isActive ? 5 : 4}
                          fill={structure.color}
                          stroke={isActive || isHighlighted ? "#fff" : "transparent"}
                          strokeWidth={isActive || isHighlighted ? "1" : "0"}
                          filter={isActive ? "url(#glow)" : "none"}
                          opacity={activeStructure && !isActive && !isConnected ? 0.3 : 1}
                          className="cursor-pointer transition-all duration-300"
                          onClick={() => handleStructureClick(structure.id)}
                          onMouseEnter={() => setHoveredStructure(structure.id)}
                          onMouseLeave={() => setHoveredStructure(null)}
                        />
                        {/* Label */}
                        <text
                          x={structure.position.x}
                          y={structure.position.y - 7}
                          textAnchor="middle"
                          fill={isActive ? "#fff" : "#9ca3af"}
                          fontSize="3"
                          fontWeight={isActive ? "bold" : "normal"}
                          className="pointer-events-none select-none"
                        >
                          {structure.shortName}
                        </text>
                      </g>
                    );
                  })}

                  {/* Légende du flux olfactif */}
                  <g transform="translate(5, 5)">
                    <text x="0" y="0" fill="#9ca3af" fontSize="2.5" fontWeight="bold">
                      Flux olfactif
                    </text>
                    <text x="0" y="4" fill="#6b7280" fontSize="2">
                      Nez → Bulbe → Cortex → Mémoire
                    </text>
                  </g>

                  {/* Indicateur "Voie directe" */}
                  <g transform="translate(70, 5)">
                    <text x="0" y="0" fill="#ef4444" fontSize="2.5" fontWeight="bold">
                      ⚡ Voie directe
                    </text>
                    <text x="0" y="4" fill="#6b7280" fontSize="2">
                      Sans relais thalamique
                    </text>
                  </g>
                </svg>

                {/* Instructions */}
                {!activeStructure && (
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <p className="text-xs text-slate-400 bg-slate-900/80 rounded-lg px-3 py-2 inline-block">
                      Survolez ou cliquez sur une structure pour explorer
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panneau d'information */}
        <div className="lg:col-span-1">
          {structureData ? (
            <Card className="h-full" style={{ borderColor: structureData.color + "40" }}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: structureData.color + "20" }}
                  >
                    <Brain className="h-5 w-5" style={{ color: structureData.color }} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{structureData.name}</CardTitle>
                    <CardDescription className="text-xs">
                      Structure cérébrale
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {structureData.description}
                </p>

                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    Fonctions principales
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {structureData.functions.map((func, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        {func}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    Rôle dans la mémoire olfactive
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {structureData.memoryRole}
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-3">
                  <h4 className="text-xs font-semibold mb-1 flex items-center gap-2">
                    <Info className="h-3 w-3" />
                    Le saviez-vous ?
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {structureData.keyFact}
                  </p>
                </div>

                {structureData.connections.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-cyan-500" />
                      Connexions
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {structureData.connections.map((connId) => {
                        const connStruct = BRAIN_STRUCTURES.find(s => s.id === connId);
                        return connStruct ? (
                          <Badge 
                            key={connId}
                            variant="outline"
                            className="text-xs cursor-pointer hover:bg-muted"
                            onClick={() => handleStructureClick(connId)}
                          >
                            {connStruct.shortName}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full">
              <CardContent className="h-full flex flex-col items-center justify-center text-center p-6">
                <Brain className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h4 className="font-semibold text-muted-foreground mb-2">
                  Explorez le cerveau olfactif
                </h4>
                <p className="text-sm text-muted-foreground">
                  Cliquez sur une structure dans le diagramme pour découvrir son rôle dans le lien entre olfaction et mémoire.
                </p>
                <div className="mt-4 space-y-2 text-left w-full">
                  <p className="text-xs text-muted-foreground">
                    <strong>Points clés :</strong>
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• L'olfaction contourne le thalamus</li>
                    <li>• Connexion directe au système limbique</li>
                    <li>• Accès privilégié à la mémoire émotionnelle</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Explication du flux olfactif */}
      <Card className="bg-gradient-to-r from-purple-500/5 to-cyan-500/5 border-purple-500/20">
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-500" />
            Pourquoi les odeurs déclenchent-elles des souvenirs si puissants ?
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Badge className="bg-purple-500/20 text-purple-600 hover:bg-purple-500/30">
                1. Voie directe
              </Badge>
              <p className="text-sm text-muted-foreground">
                L'olfaction est le seul sens à contourner le thalamus pour accéder directement au système limbique.
              </p>
            </div>
            <div className="space-y-2">
              <Badge className="bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30">
                2. Connexion hippocampique
              </Badge>
              <p className="text-sm text-muted-foreground">
                Le cortex piriforme projette directement vers l'hippocampe, centre de la mémoire épisodique.
              </p>
            </div>
            <div className="space-y-2">
              <Badge className="bg-red-500/20 text-red-600 hover:bg-red-500/30">
                3. Charge émotionnelle
              </Badge>
              <p className="text-sm text-muted-foreground">
                L'amygdale colore les souvenirs olfactifs d'une forte composante émotionnelle.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
