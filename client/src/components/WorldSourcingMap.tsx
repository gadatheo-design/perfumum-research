import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  ExternalLink,
  Leaf,
  FlaskConical,
  Users
} from "lucide-react";

// Données des régions de sourcing avec coordonnées pour la carte
const sourcingRegions = [
  {
    id: "france",
    name: "France",
    flag: "🇫🇷",
    position: { x: 48, y: 32 },
    color: "#3B82F6",
    suppliers: 4,
    molecules: ["Rose de Mai", "Jasmin", "Lavande", "Immortelle"],
    link: "/sourcing/france",
    description: "Grasse, Provence, Landes"
  },
  {
    id: "colombie",
    name: "Colombie",
    flag: "🇨🇴",
    position: { x: 26, y: 52 },
    color: "#10B981",
    suppliers: 2,
    molecules: ["Lippia", "Café Geisha", "Palo Santo"],
    link: "/sourcing/colombie",
    description: "Valle del Cauca, Quindío"
  },
  {
    id: "inde",
    name: "Inde",
    flag: "🇮🇳",
    position: { x: 70, y: 45 },
    color: "#F97316",
    suppliers: 4,
    molecules: ["Santal Mysore", "Mitti Attar", "Jasmin Sambac"],
    link: "/sourcing/inde",
    description: "Kannauj, Mysore, Himalaya"
  },
  {
    id: "madagascar",
    name: "Madagascar",
    flag: "🇲🇬",
    position: { x: 62, y: 68 },
    color: "#059669",
    suppliers: 4,
    molecules: ["Vanille Bourbon", "Ylang-Ylang", "Girofle"],
    link: "/sourcing/madagascar",
    description: "SAVA, Nosy Be, Anosy"
  },
  {
    id: "uk",
    name: "Royaume-Uni",
    flag: "🇬🇧",
    position: { x: 47, y: 28 },
    color: "#EF4444",
    suppliers: 2,
    molecules: ["Oud", "Attars", "Captives"],
    link: null,
    description: "Londres, Staffordshire"
  },
  {
    id: "suisse",
    name: "Suisse",
    flag: "🇨🇭",
    position: { x: 50, y: 31 },
    color: "#F59E0B",
    suppliers: 2,
    molecules: ["Hedione", "Javanol", "Ambroxan"],
    link: null,
    description: "Genève, Vernier"
  },
  {
    id: "usa",
    name: "États-Unis",
    flag: "🇺🇸",
    position: { x: 18, y: 38 },
    color: "#6366F1",
    suppliers: 3,
    molecules: ["Galaxolide", "Calone", "Vanilline"],
    link: null,
    description: "Californie, New Jersey"
  },
  {
    id: "oman",
    name: "Oman",
    flag: "🇴🇲",
    position: { x: 63, y: 44 },
    color: "#CA8A04",
    suppliers: 1,
    molecules: ["Encens Oliban", "Boswellia Sacra"],
    link: null,
    description: "Dhofar"
  },
  {
    id: "haiti",
    name: "Haïti",
    flag: "🇭🇹",
    position: { x: 27, y: 46 },
    color: "#14B8A6",
    suppliers: 1,
    molecules: ["Vétiver Haïti", "Vétivénol"],
    link: null,
    description: "Les Cayes"
  },
  {
    id: "japon",
    name: "Japon",
    flag: "🇯🇵",
    position: { x: 85, y: 38 },
    color: "#EC4899",
    suppliers: 2,
    molecules: ["Hinoki", "Yuzu", "Shiso"],
    link: null,
    description: "Kyoto, Miyazaki"
  },
  {
    id: "maroc",
    name: "Maroc",
    flag: "🇲🇦",
    position: { x: 44, y: 40 },
    color: "#DC2626",
    suppliers: 2,
    molecules: ["Rose de Damas", "Néroli", "Cèdre Atlas"],
    link: null,
    description: "Kelaat M'Gouna, Fès"
  }
];

interface WorldSourcingMapProps {
  onRegionSelect?: (regionId: string) => void;
  selectedRegion?: string | null;
  showLinks?: boolean;
}

export function WorldSourcingMap({ 
  onRegionSelect, 
  selectedRegion,
  showLinks = true 
}: WorldSourcingMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [internalSelected, setInternalSelected] = useState<string | null>(null);
  
  const activeRegion = selectedRegion !== undefined ? selectedRegion : internalSelected;
  
  const handleRegionClick = (regionId: string) => {
    if (onRegionSelect) {
      onRegionSelect(regionId);
    } else {
      setInternalSelected(activeRegion === regionId ? null : regionId);
    }
  };

  const activeRegionData = sourcingRegions.find(r => r.id === activeRegion);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Carte Interactive du Sourcing
        </CardTitle>
        <CardDescription>
          Cliquez sur un marqueur pour découvrir nos partenaires dans chaque région
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {/* Carte du monde SVG */}
        <div className="relative w-full aspect-[2/1] bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 overflow-hidden">
          {/* Fond de carte simplifié */}
          <svg 
            viewBox="0 0 100 50" 
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Continents simplifiés */}
            {/* Amérique du Nord */}
            <path 
              d="M5,10 Q15,8 25,12 Q30,18 28,25 Q25,30 20,32 Q15,30 10,28 Q5,25 5,20 Q4,15 5,10 Z" 
              fill="currentColor" 
              className="text-emerald-200/60 dark:text-emerald-800/40"
            />
            {/* Amérique du Sud */}
            <path 
              d="M22,35 Q28,33 30,38 Q32,45 28,50 Q24,52 20,48 Q18,42 20,38 Q21,36 22,35 Z" 
              fill="currentColor" 
              className="text-emerald-200/60 dark:text-emerald-800/40"
            />
            {/* Europe */}
            <path 
              d="M42,12 Q50,10 55,14 Q58,18 55,22 Q50,25 45,24 Q42,22 42,18 Q41,15 42,12 Z" 
              fill="currentColor" 
              className="text-emerald-200/60 dark:text-emerald-800/40"
            />
            {/* Afrique */}
            <path 
              d="M45,28 Q55,26 60,32 Q62,40 58,48 Q52,52 46,48 Q42,42 44,35 Q44,30 45,28 Z" 
              fill="currentColor" 
              className="text-emerald-200/60 dark:text-emerald-800/40"
            />
            {/* Asie */}
            <path 
              d="M58,10 Q75,8 88,15 Q92,22 88,30 Q80,35 70,32 Q62,28 60,22 Q58,16 58,10 Z" 
              fill="currentColor" 
              className="text-emerald-200/60 dark:text-emerald-800/40"
            />
            {/* Océanie */}
            <path 
              d="M78,38 Q85,36 90,40 Q92,45 88,48 Q82,50 78,46 Q76,42 78,38 Z" 
              fill="currentColor" 
              className="text-emerald-200/60 dark:text-emerald-800/40"
            />
            
            {/* Lignes de connexion entre les régions */}
            {sourcingRegions.map((region, idx) => {
              const nextRegion = sourcingRegions[(idx + 1) % sourcingRegions.length];
              return (
                <line
                  key={`line-${region.id}`}
                  x1={region.position.x}
                  y1={region.position.y}
                  x2={nextRegion.position.x}
                  y2={nextRegion.position.y}
                  stroke="currentColor"
                  strokeWidth="0.1"
                  strokeDasharray="0.5,0.5"
                  className="text-primary/20"
                />
              );
            })}
            
            {/* Marqueurs des régions */}
            {sourcingRegions.map((region) => (
              <g 
                key={region.id}
                className="cursor-pointer"
                onClick={() => handleRegionClick(region.id)}
                onMouseEnter={() => setHoveredRegion(region.id)}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                {/* Cercle de fond avec animation */}
                <circle
                  cx={region.position.x}
                  cy={region.position.y}
                  r={activeRegion === region.id ? 3 : hoveredRegion === region.id ? 2.5 : 2}
                  fill={region.color}
                  className={`transition-all duration-300 ${
                    activeRegion === region.id || hoveredRegion === region.id 
                      ? 'opacity-100' 
                      : 'opacity-70'
                  }`}
                />
                {/* Cercle d'animation pulse */}
                {(activeRegion === region.id || hoveredRegion === region.id) && (
                  <circle
                    cx={region.position.x}
                    cy={region.position.y}
                    r={4}
                    fill="none"
                    stroke={region.color}
                    strokeWidth="0.3"
                    className="animate-ping opacity-50"
                  />
                )}
                {/* Drapeau emoji */}
                <text
                  x={region.position.x}
                  y={region.position.y - 3.5}
                  textAnchor="middle"
                  className="text-[3px]"
                >
                  {region.flag}
                </text>
              </g>
            ))}
          </svg>
          
          {/* Tooltip au survol */}
          {hoveredRegion && !activeRegion && (
            <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border max-w-xs animate-in fade-in duration-200">
              {(() => {
                const region = sourcingRegions.find(r => r.id === hoveredRegion);
                if (!region) return null;
                return (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{region.flag}</span>
                      <span className="font-semibold">{region.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{region.description}</p>
                  </>
                );
              })()}
            </div>
          )}
        </div>

        {/* Panneau de détails de la région sélectionnée */}
        {activeRegionData && (
          <div className="p-6 border-t animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{activeRegionData.flag}</span>
                <div>
                  <h3 className="text-xl font-bold">{activeRegionData.name}</h3>
                  <p className="text-sm text-muted-foreground">{activeRegionData.description}</p>
                </div>
              </div>
              {showLinks && activeRegionData.link && (
                <Link href={activeRegionData.link}>
                  <Button variant="outline" size="sm" className="gap-2">
                    Voir le détail
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-semibold">{activeRegionData.suppliers}</span> fournisseur{activeRegionData.suppliers > 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-semibold">{activeRegionData.molecules.length}</span> molécules
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {activeRegionData.link ? (
                    <Badge variant="default" className="text-xs">Page détaillée</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">Bientôt</Badge>
                  )}
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Molécules clés :</p>
              <div className="flex flex-wrap gap-2">
                {activeRegionData.molecules.map((mol) => (
                  <Badge key={mol} variant="outline" className="text-xs">
                    {mol}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Légende */}
        <div className="p-4 border-t bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">Régions de sourcing :</p>
          <div className="flex flex-wrap gap-2">
            {sourcingRegions.map((region) => (
              <button
                key={region.id}
                onClick={() => handleRegionClick(region.id)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all ${
                  activeRegion === region.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <span>{region.flag}</span>
                <span>{region.name}</span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default WorldSourcingMap;
