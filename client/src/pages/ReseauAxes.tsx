// @ts-nocheck
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BookOpen,
  Search,
  Filter,
  Network,
  Layers,
  ChevronRight,
  ArrowUpRight,
  ExternalLink,
  Calendar,
  User,
  FileText,
  Globe,
  Atom,
  Leaf,
  FlaskConical,
  Sparkles,
  Microscope,
  Home as HomeIcon,
  Beaker,
  Cpu,
  Wind,
  BookMarked,
  GraduationCap,
  BarChart3,
  TrendingUp,
  Library,
  Zap,
  Link2,
  Share2,
} from "lucide-react";

// Configuration des axes de recherche
const axisConfig: Record<string, { 
  name: string; 
  shortName: string;
  color: string; 
  bgColor: string;
  icon: React.ReactNode;
  description: string;
}> = {
  'AX1': {
    name: 'Génomique olfactive & conservation ex-situ',
    shortName: 'Génomique',
    color: '#4CAF50',
    bgColor: 'bg-green-500',
    icon: <Atom className="h-5 w-5" />,
    description: 'Récepteurs olfactifs, cryobanques et archives génétiques'
  },
  'AX2': {
    name: 'Ethnobotanique computationnelle',
    shortName: 'Ethnobotanique',
    color: '#2196F3',
    bgColor: 'bg-blue-500',
    icon: <Leaf className="h-5 w-5" />,
    description: 'Knowledge graphs et NLP pour les savoirs traditionnels'
  },
  'AX3': {
    name: 'Chimie analytique comparative trans-époques',
    shortName: 'Chimie analytique',
    color: '#FF9800',
    bgColor: 'bg-orange-500',
    icon: <FlaskConical className="h-5 w-5" />,
    description: 'Bases de données moléculaires et prédiction olfactive'
  },
  'AX4': {
    name: 'Biotechnologies de conservation & fermentation',
    shortName: 'Biotechnologies',
    color: '#9C27B0',
    bgColor: 'bg-purple-500',
    icon: <Beaker className="h-5 w-5" />,
    description: 'Biosynthèse et production durable de molécules aromatiques'
  },
  'AX5': {
    name: 'Technologies immersives & démocratisation',
    shortName: 'Technologies VR',
    color: '#00BCD4',
    bgColor: 'bg-cyan-500',
    icon: <Cpu className="h-5 w-5" />,
    description: 'VR olfactive et dispositifs de diffusion'
  },
  'AX6': {
    name: 'Chimie de l\'espace (indoor) & pratiques domestiques',
    shortName: 'Chimie indoor',
    color: '#795548',
    bgColor: 'bg-amber-700',
    icon: <HomeIcon className="h-5 w-5" />,
    description: 'Émissions, réactions et oxydation dans les espaces intérieurs'
  },
};

// Composant pour le graphe de réseau
function NetworkGraph({ 
  axes, 
  connections, 
  onAxisClick,
  selectedAxis 
}: { 
  axes: any[]; 
  connections: { from: string; to: string; count: number; references: string[] }[];
  onAxisClick: (axisCode: string) => void;
  selectedAxis: string | null;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [hoveredAxis, setHoveredAxis] = useState<string | null>(null);
  const [hoveredConnection, setHoveredConnection] = useState<{ from: string; to: string } | null>(null);
  
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const { width } = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width: Math.max(400, width), height: Math.min(500, width * 0.6) });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Calculer les positions des nœuds en cercle
  const nodePositions = useMemo(() => {
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const radius = Math.min(dimensions.width, dimensions.height) * 0.35;
    
    return axes.map((axis, i) => {
      const angle = (i / axes.length) * 2 * Math.PI - Math.PI / 2;
      return {
        ...axis,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
  }, [axes, dimensions]);
  
  // Calculer l'épaisseur maximale des connexions
  const maxConnectionCount = Math.max(...connections.map(c => c.count), 1);
  
  return (
    <div className="relative w-full bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl overflow-hidden">
      <svg 
        ref={svgRef} 
        width={dimensions.width} 
        height={dimensions.height}
        className="mx-auto"
      >
        <defs>
          {/* Gradients pour les connexions */}
          {connections.map((conn, idx) => {
            const fromNode = nodePositions.find(n => n.axisCode === conn.from);
            const toNode = nodePositions.find(n => n.axisCode === conn.to);
            if (!fromNode || !toNode) return null;
            
            return (
              <linearGradient 
                key={`gradient-${idx}`} 
                id={`gradient-${conn.from}-${conn.to}`}
                x1={fromNode.x} y1={fromNode.y}
                x2={toNode.x} y2={toNode.y}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor={axisConfig[conn.from]?.color || '#888'} />
                <stop offset="100%" stopColor={axisConfig[conn.to]?.color || '#888'} />
              </linearGradient>
            );
          })}
        </defs>
        
        {/* Connexions */}
        {connections.map((conn, idx) => {
          const fromNode = nodePositions.find(n => n.axisCode === conn.from);
          const toNode = nodePositions.find(n => n.axisCode === conn.to);
          if (!fromNode || !toNode) return null;
          
          const strokeWidth = 2 + (conn.count / maxConnectionCount) * 6;
          const isHighlighted = 
            hoveredAxis === conn.from || 
            hoveredAxis === conn.to ||
            selectedAxis === conn.from ||
            selectedAxis === conn.to ||
            (hoveredConnection?.from === conn.from && hoveredConnection?.to === conn.to);
          const isHovered = hoveredConnection?.from === conn.from && hoveredConnection?.to === conn.to;
          
          return (
            <g key={`conn-${idx}`}>
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={`url(#gradient-${conn.from}-${conn.to})`}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                opacity={isHighlighted ? 1 : 0.3}
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredConnection({ from: conn.from, to: conn.to })}
                onMouseLeave={() => setHoveredConnection(null)}
              />
              {/* Nombre de références partagées */}
              {isHovered && (
                <g>
                  <rect
                    x={(fromNode.x + toNode.x) / 2 - 20}
                    y={(fromNode.y + toNode.y) / 2 - 12}
                    width={40}
                    height={24}
                    rx={12}
                    fill="white"
                    stroke="#e5e7eb"
                    strokeWidth={1}
                  />
                  <text
                    x={(fromNode.x + toNode.x) / 2}
                    y={(fromNode.y + toNode.y) / 2 + 4}
                    textAnchor="middle"
                    className="text-xs font-semibold fill-foreground"
                  >
                    {conn.count}
                  </text>
                </g>
              )}
            </g>
          );
        })}
        
        {/* Nœuds (axes) */}
        {nodePositions.map((node) => {
          const config = axisConfig[node.axisCode] || { color: '#888', shortName: node.name };
          const isSelected = selectedAxis === node.axisCode;
          const isHovered = hoveredAxis === node.axisCode;
          const nodeRadius = isSelected || isHovered ? 45 : 40;
          
          return (
            <g 
              key={node.axisCode}
              className="cursor-pointer transition-all duration-300"
              onClick={() => onAxisClick(node.axisCode)}
              onMouseEnter={() => setHoveredAxis(node.axisCode)}
              onMouseLeave={() => setHoveredAxis(null)}
            >
              {/* Cercle de fond */}
              <circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius + 4}
                fill="white"
                className="drop-shadow-lg"
              />
              {/* Cercle coloré */}
              <circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius}
                fill={config.color}
                opacity={isSelected || isHovered ? 1 : 0.85}
                className="transition-all duration-300"
              />
              {/* Code de l'axe */}
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                className="text-sm font-bold fill-white pointer-events-none"
              >
                {node.axisCode}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Légende */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg max-w-xs">
        <p className="text-xs font-medium text-muted-foreground mb-2">Légende</p>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-8 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded" />
          <span>Connexion (références partagées)</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">
          Épaisseur = nombre de références communes
        </p>
      </div>
      
      {/* Info axe survolé */}
      {hoveredAxis && axisConfig[hoveredAxis] && (
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur rounded-lg p-3 shadow-lg max-w-xs">
          <div className="flex items-center gap-2 mb-1">
            <div className={`p-1.5 rounded ${axisConfig[hoveredAxis].bgColor} text-white`}>
              {axisConfig[hoveredAxis].icon}
            </div>
            <span className="font-semibold text-sm">{hoveredAxis}</span>
          </div>
          <p className="text-xs font-medium">{axisConfig[hoveredAxis].name}</p>
          <p className="text-[10px] text-muted-foreground mt-1">
            {axisConfig[hoveredAxis].description}
          </p>
        </div>
      )}
    </div>
  );
}

// Composant carte d'axe
function AxisCard({ 
  axis, 
  referenceCount,
  isSelected,
  onClick 
}: { 
  axis: any; 
  referenceCount: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const config = axisConfig[axis.axisCode] || { 
    color: '#888', 
    bgColor: 'bg-gray-500',
    icon: <Layers className="h-5 w-5" />,
    name: axis.name,
    shortName: axis.name,
    description: ''
  };
  
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary shadow-lg' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-lg ${config.bgColor} text-white shrink-0`}>
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-mono">
                {axis.axisCode}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {referenceCount} réf.
              </Badge>
            </div>
            <h3 className="font-semibold mt-1 line-clamp-2 text-sm">
              {config.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {config.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Composant principal
export default function ReseauAxes() {
  const [selectedAxis, setSelectedAxis] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("network");
  
  // Requêtes tRPC
  const { data: axes = [] } = trpc.researchAxes.list.useQuery({});
  const { data: entriesData } = trpc.bibliography.list.useQuery({
    search: searchQuery || undefined,
  });
  
  // Extraire les entrées
  const entries = useMemo(() => {
    if (!entriesData) return [];
    if (Array.isArray(entriesData)) return entriesData;
    if (entriesData.entries) return entriesData.entries;
    return [];
  }, [entriesData]);
  
  // Récupérer les liens axe-bibliographie pour chaque axe
  const axisReferenceQueries = axes.map((axis: any) => 
    trpc.researchAxes.getBibliography.useQuery(axis.id, {
      enabled: !!axis.id,
    })
  );
  
  // Construire la map des références par axe
  const referencesByAxis = useMemo(() => {
    const map: Record<string, any[]> = {};
    axes.forEach((axis: any, idx: number) => {
      const refs = axisReferenceQueries[idx]?.data || [];
      map[axis.axisCode] = refs;
    });
    return map;
  }, [axes, axisReferenceQueries]);
  
  // Calculer les connexions entre axes (références partagées)
  const connections = useMemo(() => {
    const conns: { from: string; to: string; count: number; references: string[] }[] = [];
    const axisCodes = Object.keys(referencesByAxis);
    
    for (let i = 0; i < axisCodes.length; i++) {
      for (let j = i + 1; j < axisCodes.length; j++) {
        const axis1 = axisCodes[i];
        const axis2 = axisCodes[j];
        const refs1 = referencesByAxis[axis1] || [];
        const refs2 = referencesByAxis[axis2] || [];
        
        // Trouver les références communes
        const refs1Ids = new Set(refs1.map((r: any) => r.id));
        const sharedRefs = refs2.filter((r: any) => refs1Ids.has(r.id));
        
        if (sharedRefs.length > 0) {
          conns.push({
            from: axis1,
            to: axis2,
            count: sharedRefs.length,
            references: sharedRefs.map((r: any) => r.title),
          });
        }
      }
    }
    
    return conns;
  }, [referencesByAxis]);
  
  // Filtrer les références par axe sélectionné
  const filteredReferences = useMemo(() => {
    if (!selectedAxis) return entries;
    return referencesByAxis[selectedAxis] || [];
  }, [selectedAxis, entries, referencesByAxis]);
  
  // Gérer le clic sur un axe
  const handleAxisClick = useCallback((axisCode: string) => {
    setSelectedAxis(prev => prev === axisCode ? null : axisCode);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1 py-8 md:py-12">
        <div className="container">
          {/* En-tête */}
          <div className="max-w-4xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm mb-4">
              <Network className="h-4 w-4" />
              Cartographie de la recherche
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Réseau d'axes
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Visualisez les connexions entre les 6 axes de recherche PERFUMUM 
              à travers leurs références bibliographiques partagées.
            </p>
          </div>
          
          {/* Onglets */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="network" className="gap-2">
                  <Network className="h-4 w-4" />
                  <span className="hidden sm:inline">Vue réseau</span>
                </TabsTrigger>
                <TabsTrigger value="axes" className="gap-2">
                  <Layers className="h-4 w-4" />
                  <span className="hidden sm:inline">Par axe</span>
                </TabsTrigger>
                <TabsTrigger value="matrix" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Matrice</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <Link href="/bibliographie">
                  <Button variant="outline" size="sm">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Bibliographie
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Vue réseau */}
            <TabsContent value="network" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-primary" />
                    Graphe des connexions
                  </CardTitle>
                  <CardDescription>
                    Cliquez sur un axe pour filtrer les références associées. 
                    Les connexions représentent les références partagées entre axes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NetworkGraph 
                    axes={axes}
                    connections={connections}
                    onAxisClick={handleAxisClick}
                    selectedAxis={selectedAxis}
                  />
                </CardContent>
              </Card>
              
              {/* Références filtrées */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Library className="h-5 w-5 text-primary" />
                        {selectedAxis 
                          ? `Références de l'axe ${selectedAxis}` 
                          : 'Toutes les références'}
                      </CardTitle>
                      <CardDescription>
                        {filteredReferences.length} référence{filteredReferences.length > 1 ? 's' : ''}
                        {selectedAxis && axisConfig[selectedAxis] && (
                          <span className="ml-2">
                            — {axisConfig[selectedAxis].name}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    {selectedAxis && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedAxis(null)}
                      >
                        Voir tout
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredReferences.length > 0 ? (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                      {filteredReferences.slice(0, 20).map((ref: any) => (
                        <div 
                          key={ref.id} 
                          className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm line-clamp-2">{ref.title}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              {ref.authors && (
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {ref.authors.split(' and ')[0]}
                                </span>
                              )}
                              {ref.year && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {ref.year}
                                </span>
                              )}
                            </div>
                          </div>
                          {ref.url && (
                            <a 
                              href={ref.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="shrink-0 text-muted-foreground hover:text-primary"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      ))}
                      {filteredReferences.length > 20 && (
                        <p className="text-sm text-muted-foreground text-center py-2">
                          + {filteredReferences.length - 20} autres références
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Library className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucune référence trouvée</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Vue par axe */}
            <TabsContent value="axes" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {axes.map((axis: any) => (
                  <AxisCard
                    key={axis.id}
                    axis={axis}
                    referenceCount={(referencesByAxis[axis.axisCode] || []).length}
                    isSelected={selectedAxis === axis.axisCode}
                    onClick={() => handleAxisClick(axis.axisCode)}
                  />
                ))}
              </div>
              
              {/* Détail de l'axe sélectionné */}
              {selectedAxis && axisConfig[selectedAxis] && (
                <Card className="border-2" style={{ borderColor: axisConfig[selectedAxis].color }}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${axisConfig[selectedAxis].bgColor} text-white`}>
                        {axisConfig[selectedAxis].icon}
                      </div>
                      <div>
                        <CardTitle>{axisConfig[selectedAxis].name}</CardTitle>
                        <CardDescription>{axisConfig[selectedAxis].description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Références ({(referencesByAxis[selectedAxis] || []).length})
                    </h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {(referencesByAxis[selectedAxis] || []).map((ref: any) => (
                        <div 
                          key={ref.id} 
                          className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                        >
                          <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm line-clamp-1">{ref.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {ref.authors?.split(' and ')[0]} {ref.year && `(${ref.year})`}
                            </p>
                          </div>
                          {ref.url && (
                            <a 
                              href={ref.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="shrink-0 text-muted-foreground hover:text-primary"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Connexions avec d'autres axes */}
                    <h4 className="font-semibold mt-6 mb-3 flex items-center gap-2">
                      <Link2 className="h-4 w-4" />
                      Connexions avec d'autres axes
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {connections
                        .filter(c => c.from === selectedAxis || c.to === selectedAxis)
                        .map((conn, idx) => {
                          const otherAxis = conn.from === selectedAxis ? conn.to : conn.from;
                          const otherConfig = axisConfig[otherAxis];
                          return (
                            <Badge 
                              key={idx}
                              variant="outline"
                              className="cursor-pointer hover:bg-muted"
                              onClick={() => setSelectedAxis(otherAxis)}
                            >
                              <div 
                                className="w-2 h-2 rounded-full mr-1.5"
                                style={{ backgroundColor: otherConfig?.color }}
                              />
                              {otherAxis}: {conn.count} réf. partagées
                            </Badge>
                          );
                        })}
                      {connections.filter(c => c.from === selectedAxis || c.to === selectedAxis).length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          Aucune référence partagée avec d'autres axes
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {/* Matrice de connexions */}
            <TabsContent value="matrix" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Matrice des connexions
                  </CardTitle>
                  <CardDescription>
                    Nombre de références partagées entre chaque paire d'axes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th className="p-2"></th>
                          {Object.keys(axisConfig).map(code => (
                            <th key={code} className="p-2 text-center">
                              <div 
                                className="w-8 h-8 rounded-full mx-auto flex items-center justify-center text-white text-xs font-bold"
                                style={{ backgroundColor: axisConfig[code].color }}
                              >
                                {code.replace('AX', '')}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(axisConfig).map(rowCode => (
                          <tr key={rowCode}>
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                  style={{ backgroundColor: axisConfig[rowCode].color }}
                                >
                                  {rowCode.replace('AX', '')}
                                </div>
                                <span className="text-xs text-muted-foreground hidden md:inline">
                                  {axisConfig[rowCode].shortName}
                                </span>
                              </div>
                            </td>
                            {Object.keys(axisConfig).map(colCode => {
                              if (rowCode === colCode) {
                                const count = (referencesByAxis[rowCode] || []).length;
                                return (
                                  <td key={colCode} className="p-2 text-center">
                                    <div className="w-10 h-10 mx-auto rounded-lg bg-muted flex items-center justify-center font-semibold">
                                      {count}
                                    </div>
                                  </td>
                                );
                              }
                              
                              const conn = connections.find(
                                c => (c.from === rowCode && c.to === colCode) || 
                                     (c.from === colCode && c.to === rowCode)
                              );
                              const count = conn?.count || 0;
                              const intensity = count > 0 ? Math.min(count / 5, 1) : 0;
                              
                              return (
                                <td key={colCode} className="p-2 text-center">
                                  <div 
                                    className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center font-semibold transition-colors ${
                                      count > 0 ? 'cursor-pointer hover:ring-2 ring-primary' : ''
                                    }`}
                                    style={{ 
                                      backgroundColor: count > 0 
                                        ? `rgba(var(--primary-rgb), ${0.1 + intensity * 0.4})`
                                        : 'transparent'
                                    }}
                                    onClick={() => {
                                      if (count > 0) {
                                        setSelectedAxis(rowCode);
                                        setActiveTab('axes');
                                      }
                                    }}
                                  >
                                    {count > 0 ? count : '-'}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Statistiques</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total références</p>
                        <p className="text-2xl font-bold">{entries.length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Axes de recherche</p>
                        <p className="text-2xl font-bold">{axes.length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Connexions</p>
                        <p className="text-2xl font-bold">{connections.length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Réf. partagées</p>
                        <p className="text-2xl font-bold">
                          {connections.reduce((sum, c) => sum + c.count, 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
