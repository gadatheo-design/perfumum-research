// @ts-nocheck
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Pause,
  Download,
  Maximize2,
  Minimize2,
  Settings,
  Eye,
  EyeOff,
  Atom,
  Layers,
  Palette,
  Info,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types pour la structure moléculaire
interface Atom3D {
  id: number;
  element: string;
  x: number;
  y: number;
  z: number;
  color: string;
  radius: number;
}

interface Bond3D {
  atom1: number;
  atom2: number;
  order: number; // 1 = simple, 2 = double, 3 = triple
}

interface MoleculeStructure {
  atoms: Atom3D[];
  bonds: Bond3D[];
  name: string;
  formula?: string;
  molecularWeight?: number;
}

interface Molecule3DViewerProps {
  moleculeId?: number;
  moleculeName?: string;
  smiles?: string;
  formula?: string;
  className?: string;
  showControls?: boolean;
  showInfo?: boolean;
  autoRotate?: boolean;
  height?: number;
}

// Couleurs des éléments chimiques (CPK)
const ELEMENT_COLORS: Record<string, string> = {
  C: "#909090", // Carbone - gris
  H: "#FFFFFF", // Hydrogène - blanc
  O: "#FF0D0D", // Oxygène - rouge
  N: "#3050F8", // Azote - bleu
  S: "#FFFF30", // Soufre - jaune
  P: "#FF8000", // Phosphore - orange
  Cl: "#1FF01F", // Chlore - vert clair
  Br: "#A62929", // Brome - marron
  F: "#90E050", // Fluor - vert
  I: "#940094", // Iode - violet
  default: "#FF1493", // Rose par défaut
};

// Rayons atomiques (en Angströms, normalisés)
const ELEMENT_RADII: Record<string, number> = {
  C: 0.77,
  H: 0.37,
  O: 0.73,
  N: 0.75,
  S: 1.02,
  P: 1.06,
  Cl: 0.99,
  Br: 1.14,
  F: 0.71,
  I: 1.33,
  default: 0.8,
};

// Générateur de structure moléculaire basique à partir d'une formule
function generateMoleculeFromFormula(formula: string): MoleculeStructure {
  const atoms: Atom3D[] = [];
  const bonds: Bond3D[] = [];
  
  // Parser la formule (ex: C10H16 -> 10 carbones, 16 hydrogènes)
  const elementRegex = /([A-Z][a-z]?)(\d*)/g;
  const elements: { element: string; count: number }[] = [];
  let match;
  
  while ((match = elementRegex.exec(formula)) !== null) {
    elements.push({
      element: match[1],
      count: match[2] ? parseInt(match[2]) : 1,
    });
  }
  
  // Générer les atomes avec positions pseudo-aléatoires mais cohérentes
  let atomId = 0;
  const seed = formula.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const seededRandom = (n: number) => {
    const x = Math.sin(seed + n) * 10000;
    return x - Math.floor(x);
  };
  
  elements.forEach(({ element, count }) => {
    for (let i = 0; i < count; i++) {
      const angle1 = seededRandom(atomId * 2) * Math.PI * 2;
      const angle2 = seededRandom(atomId * 2 + 1) * Math.PI;
      const radius = 2 + seededRandom(atomId * 3) * 3;
      
      atoms.push({
        id: atomId,
        element,
        x: radius * Math.sin(angle2) * Math.cos(angle1),
        y: radius * Math.sin(angle2) * Math.sin(angle1),
        z: radius * Math.cos(angle2),
        color: ELEMENT_COLORS[element] || ELEMENT_COLORS.default,
        radius: ELEMENT_RADII[element] || ELEMENT_RADII.default,
      });
      atomId++;
    }
  });
  
  // Générer des liaisons basiques (connecter les atomes proches)
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const dist = Math.sqrt(
        Math.pow(atoms[i].x - atoms[j].x, 2) +
        Math.pow(atoms[i].y - atoms[j].y, 2) +
        Math.pow(atoms[i].z - atoms[j].z, 2)
      );
      
      // Connecter si distance < 2 Angströms
      if (dist < 2.5) {
        bonds.push({
          atom1: i,
          atom2: j,
          order: 1,
        });
      }
    }
  }
  
  return {
    atoms,
    bonds,
    name: formula,
    formula,
  };
}

// Structures moléculaires prédéfinies pour les terpènes courants
const PREDEFINED_STRUCTURES: Record<string, MoleculeStructure> = {
  "Limonène": {
    name: "Limonène",
    formula: "C10H16",
    molecularWeight: 136.23,
    atoms: [
      { id: 0, element: "C", x: 0, y: 0, z: 0, color: ELEMENT_COLORS.C, radius: ELEMENT_RADII.C },
      { id: 1, element: "C", x: 1.5, y: 0, z: 0, color: ELEMENT_COLORS.C, radius: ELEMENT_RADII.C },
      { id: 2, element: "C", x: 2.25, y: 1.3, z: 0, color: ELEMENT_COLORS.C, radius: ELEMENT_RADII.C },
      { id: 3, element: "C", x: 1.5, y: 2.6, z: 0, color: ELEMENT_COLORS.C, radius: ELEMENT_RADII.C },
      { id: 4, element: "C", x: 0, y: 2.6, z: 0, color: ELEMENT_COLORS.C, radius: ELEMENT_RADII.C },
      { id: 5, element: "C", x: -0.75, y: 1.3, z: 0, color: ELEMENT_COLORS.C, radius: ELEMENT_RADII.C },
      { id: 6, element: "C", x: 3.75, y: 1.3, z: 0, color: ELEMENT_COLORS.C, radius: ELEMENT_RADII.C },
      { id: 7, element: "C", x: 4.5, y: 0, z: 0, color: ELEMENT_COLORS.C, radius: ELEMENT_RADII.C },
      { id: 8, element: "C", x: -0.75, y: -1.3, z: 0, color: ELEMENT_COLORS.C, radius: ELEMENT_RADII.C },
      { id: 9, element: "C", x: -2.25, y: -1.3, z: 0, color: ELEMENT_COLORS.C, radius: ELEMENT_RADII.C },
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 1 },
      { atom1: 1, atom2: 2, order: 2 },
      { atom1: 2, atom2: 3, order: 1 },
      { atom1: 3, atom2: 4, order: 1 },
      { atom1: 4, atom2: 5, order: 1 },
      { atom1: 5, atom2: 0, order: 1 },
      { atom1: 2, atom2: 6, order: 1 },
      { atom1: 6, atom2: 7, order: 2 },
      { atom1: 0, atom2: 8, order: 1 },
      { atom1: 8, atom2: 9, order: 1 },
    ],
  },
  "Linalol": {
    name: "Linalol",
    formula: "C10H18O",
    molecularWeight: 154.25,
    atoms: [
      { id: 0, element: "C", x: 0, y: 0, z: 0, color: ELEMENT_COLORS.C, radius: ELEMENT_RADII.C },
      { id: 1, element: "C", x: 1.5, y: 0, z: 0, color: ELEMENT_COLORS.C, radius: ELEMENT_RADII.C },
      { id: 2, element: "C", x: 2.25, y: 1.3, z: 0, color: ELEMENT_COLORS.C, radius: ELEMENT_RADII.C },
      { id: 3, element: "C", x: 3.75, y: 1.3, z: 0, color: ELEMENT_COLORS.C, radius: ELEMENT_RADII.C },
      { id: 4, element: "C", x: 4.5, y: 0, z: 0, color: ELEMENT_COLORS.C, radius: ELEMENT_RADII.C },
      { id: 5, element: "C", x: 6, y: 0, z: 0, color: ELEMENT_COLORS.C, radius: ELEMENT_RADII.C },
      { id: 6, element: "C", x: 6.75, y: 1.3, z: 0, color: ELEMENT_COLORS.C, radius: ELEMENT_RADII.C },
      { id: 7, element: "C", x: 6.75, y: -1.3, z: 0, color: ELEMENT_COLORS.C, radius: ELEMENT_RADII.C },
      { id: 8, element: "C", x: -0.75, y: 1.3, z: 0, color: ELEMENT_COLORS.C, radius: ELEMENT_RADII.C },
      { id: 9, element: "C", x: -0.75, y: -1.3, z: 0, color: ELEMENT_COLORS.C, radius: ELEMENT_RADII.C },
      { id: 10, element: "O", x: 4.5, y: -1.5, z: 0, color: ELEMENT_COLORS.O, radius: ELEMENT_RADII.O },
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 2 },
      { atom1: 1, atom2: 2, order: 1 },
      { atom1: 2, atom2: 3, order: 1 },
      { atom1: 3, atom2: 4, order: 2 },
      { atom1: 4, atom2: 5, order: 1 },
      { atom1: 5, atom2: 6, order: 1 },
      { atom1: 5, atom2: 7, order: 1 },
      { atom1: 0, atom2: 8, order: 1 },
      { atom1: 0, atom2: 9, order: 1 },
      { atom1: 4, atom2: 10, order: 1 },
    ],
  },
};

// Composant de rendu 3D avec Canvas
function Molecule3DCanvas({
  structure,
  rotation,
  zoom,
  showBonds,
  showLabels,
  colorScheme,
  isAnimating,
  onRotate,
}: {
  structure: MoleculeStructure;
  rotation: { x: number; y: number; z: number };
  zoom: number;
  showBonds: boolean;
  showLabels: boolean;
  colorScheme: "cpk" | "element" | "chain";
  isAnimating: boolean;
  onRotate: (delta: { x: number; y: number }) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Projection 3D vers 2D
  const project = useCallback((atom: Atom3D, rotX: number, rotY: number, rotZ: number, scale: number) => {
    // Rotation autour de X
    let y1 = atom.y * Math.cos(rotX) - atom.z * Math.sin(rotX);
    let z1 = atom.y * Math.sin(rotX) + atom.z * Math.cos(rotX);
    
    // Rotation autour de Y
    let x2 = atom.x * Math.cos(rotY) + z1 * Math.sin(rotY);
    let z2 = -atom.x * Math.sin(rotY) + z1 * Math.cos(rotY);
    
    // Rotation autour de Z
    let x3 = x2 * Math.cos(rotZ) - y1 * Math.sin(rotZ);
    let y3 = x2 * Math.sin(rotZ) + y1 * Math.cos(rotZ);
    
    // Perspective simple
    const perspective = 10;
    const factor = perspective / (perspective + z2);
    
    return {
      x: x3 * factor * scale,
      y: y3 * factor * scale,
      z: z2,
      scale: factor,
    };
  }, []);

  // Rendu du canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 30 * zoom;
    
    // Effacer le canvas
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.clearRect(0, 0, width, height);
    
    // Convertir la rotation en radians
    const rotX = rotation.x * Math.PI / 180;
    const rotY = rotation.y * Math.PI / 180;
    const rotZ = rotation.z * Math.PI / 180;
    
    // Projeter tous les atomes
    const projectedAtoms = structure.atoms.map(atom => ({
      ...atom,
      projected: project(atom, rotX, rotY, rotZ, scale),
    }));
    
    // Trier par profondeur (z) pour le rendu correct
    projectedAtoms.sort((a, b) => a.projected.z - b.projected.z);
    
    // Dessiner les liaisons d'abord
    if (showBonds) {
      structure.bonds.forEach(bond => {
        const atom1 = projectedAtoms.find(a => a.id === bond.atom1);
        const atom2 = projectedAtoms.find(a => a.id === bond.atom2);
        
        if (atom1 && atom2) {
          ctx.beginPath();
          ctx.strokeStyle = "#666";
          ctx.lineWidth = 2 * Math.min(atom1.projected.scale, atom2.projected.scale);
          ctx.moveTo(centerX + atom1.projected.x, centerY + atom1.projected.y);
          ctx.lineTo(centerX + atom2.projected.x, centerY + atom2.projected.y);
          ctx.stroke();
          
          // Liaisons doubles/triples
          if (bond.order >= 2) {
            const offset = 3;
            ctx.beginPath();
            ctx.moveTo(centerX + atom1.projected.x + offset, centerY + atom1.projected.y + offset);
            ctx.lineTo(centerX + atom2.projected.x + offset, centerY + atom2.projected.y + offset);
            ctx.stroke();
          }
        }
      });
    }
    
    // Dessiner les atomes
    projectedAtoms.forEach(atom => {
      const x = centerX + atom.projected.x;
      const y = centerY + atom.projected.y;
      const radius = atom.radius * 15 * atom.projected.scale * zoom;
      
      // Gradient pour effet 3D
      const gradient = ctx.createRadialGradient(
        x - radius * 0.3, y - radius * 0.3, 0,
        x, y, radius
      );
      gradient.addColorStop(0, lightenColor(atom.color, 50));
      gradient.addColorStop(0.7, atom.color);
      gradient.addColorStop(1, darkenColor(atom.color, 30));
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Bordure
      ctx.strokeStyle = darkenColor(atom.color, 50);
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Labels
      if (showLabels && radius > 10) {
        ctx.fillStyle = "#fff";
        ctx.font = `bold ${Math.max(10, radius * 0.8)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(atom.element, x, y);
      }
    });
  }, [structure, rotation, zoom, showBonds, showLabels, colorScheme, project]);

  // Gestion du drag pour la rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    
    const deltaX = e.clientX - lastPos.current.x;
    const deltaY = e.clientY - lastPos.current.y;
    
    onRotate({ x: deltaY * 0.5, y: deltaX * 0.5 });
    
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
}

// Fonctions utilitaires pour les couleurs
function lightenColor(color: string, percent: number): string {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
}

function darkenColor(color: string, percent: number): string {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
  const B = Math.max(0, (num & 0x0000FF) - amt);
  return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
}

// Composant principal
export function Molecule3DViewer({
  moleculeId,
  moleculeName,
  smiles,
  formula,
  className,
  showControls = true,
  showInfo = true,
  autoRotate = false,
  height = 400,
}: Molecule3DViewerProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [zoom, setZoom] = useState(1);
  const [isAnimating, setIsAnimating] = useState(autoRotate);
  const [showBonds, setShowBonds] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [colorScheme, setColorScheme] = useState<"cpk" | "element" | "chain">("cpk");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const animationRef = useRef<number>();

  // Obtenir la structure moléculaire
  const structure = useMemo(() => {
    if (moleculeName && PREDEFINED_STRUCTURES[moleculeName]) {
      return PREDEFINED_STRUCTURES[moleculeName];
    }
    if (formula) {
      return generateMoleculeFromFormula(formula);
    }
    // Structure par défaut (monoterpène générique)
    return generateMoleculeFromFormula("C10H16");
  }, [moleculeName, formula]);

  // Animation de rotation automatique
  useEffect(() => {
    if (isAnimating) {
      const animate = () => {
        setRotation(prev => ({
          ...prev,
          y: prev.y + 0.5,
        }));
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating]);

  // Gestion de la rotation manuelle
  const handleRotate = useCallback((delta: { x: number; y: number }) => {
    setRotation(prev => ({
      ...prev,
      x: prev.x + delta.x,
      y: prev.y + delta.y,
    }));
  }, []);

  // Reset de la vue
  const resetView = () => {
    setRotation({ x: 0, y: 0, z: 0 });
    setZoom(1);
  };

  return (
    <Card className={cn("overflow-hidden", className, isFullscreen && "fixed inset-4 z-50")}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Atom className="h-5 w-5 text-primary" />
              {structure.name || "Structure Moléculaire"}
            </CardTitle>
            {structure.formula && (
              <CardDescription className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{structure.formula}</Badge>
                {structure.molecularWeight && (
                  <Badge variant="secondary">{structure.molecularWeight} g/mol</Badge>
                )}
              </CardDescription>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="relative" style={{ height: isFullscreen ? "calc(100vh - 200px)" : height }}>
          {/* Canvas 3D */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 rounded-b-lg overflow-hidden">
            <Molecule3DCanvas
              structure={structure}
              rotation={rotation}
              zoom={zoom}
              showBonds={showBonds}
              showLabels={showLabels}
              colorScheme={colorScheme}
              isAnimating={isAnimating}
              onRotate={handleRotate}
            />
          </div>
          
          {/* Contrôles overlay */}
          {showControls && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              {/* Contrôles de gauche */}
              <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-lg p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAnimating(!isAnimating)}
                >
                  {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={resetView}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Contrôles de zoom */}
              <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-lg p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-mono w-12 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(z => Math.min(3, z + 0.2))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Panneau de paramètres */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute top-4 right-4 w-64 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg"
              >
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Paramètres d'affichage
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showBonds" className="flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      Liaisons
                    </Label>
                    <Switch
                      id="showBonds"
                      checked={showBonds}
                      onCheckedChange={setShowBonds}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showLabels" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Labels
                    </Label>
                    <Switch
                      id="showLabels"
                      checked={showLabels}
                      onCheckedChange={setShowLabels}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Zoom
                    </Label>
                    <Slider
                      value={[zoom]}
                      min={0.5}
                      max={3}
                      step={0.1}
                      onValueChange={([v]) => setZoom(v)}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Informations sur la molécule */}
        {showInfo && (
          <div className="p-4 border-t bg-muted/30">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#909090]" />
                <span>Carbone</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FFFFFF] border" />
                <span>Hydrogène</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF0D0D]" />
                <span>Oxygène</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#3050F8]" />
                <span>Azote</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Cliquez et faites glisser pour faire pivoter la molécule. Utilisez les contrôles pour zoomer.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default Molecule3DViewer;
