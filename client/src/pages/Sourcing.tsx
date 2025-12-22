import { useState } from "react";
import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { VoirAussi } from "@/components/VoirAussi";
import { 
  Globe, 
  MapPin, 
  Building2, 
  Leaf, 
  Package,
  ChevronRight,
  Users,
  Beaker
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Données des régions de sourcing
const regions = [
  {
    id: "france",
    name: "France",
    flag: "🇫🇷",
    description: "Grasse, capitale mondiale de la parfumerie. Lavande de Provence, absolues florales.",
    suppliers: 3,
    molecules: 12,
    specialties: ["Lavande", "Rose de Mai", "Jasmin de Grasse", "Mimosa"],
    color: "from-blue-500 to-blue-700",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    textColor: "text-blue-700 dark:text-blue-300"
  },
  {
    id: "inde",
    name: "Inde",
    flag: "🇮🇳",
    description: "Berceau des attars traditionnels. Santal de Mysore, jasmin sambac, vétiver.",
    suppliers: 4,
    molecules: 18,
    specialties: ["Santal", "Jasmin Sambac", "Vétiver", "Attars"],
    color: "from-orange-500 to-orange-700",
    bgColor: "bg-orange-50 dark:bg-orange-950",
    textColor: "text-orange-700 dark:text-orange-300"
  },
  {
    id: "madagascar",
    name: "Madagascar",
    flag: "🇲🇬",
    description: "Île aux trésors olfactifs. Vanille Bourbon, ylang-ylang, poivre rose.",
    suppliers: 2,
    molecules: 8,
    specialties: ["Vanille Bourbon", "Ylang-Ylang", "Poivre Rose", "Clou de Girofle"],
    color: "from-green-500 to-green-700",
    bgColor: "bg-green-50 dark:bg-green-950",
    textColor: "text-green-700 dark:text-green-300"
  },
  {
    id: "japon",
    name: "Japon",
    flag: "🇯🇵",
    description: "Raffinement et tradition. Hinoki, yuzu, shiso, encens japonais.",
    suppliers: 2,
    molecules: 10,
    specialties: ["Hinoki", "Yuzu", "Shiso", "Encens Japonais"],
    color: "from-red-500 to-red-700",
    bgColor: "bg-red-50 dark:bg-red-950",
    textColor: "text-red-700 dark:text-red-300"
  },
  {
    id: "maroc",
    name: "Maroc",
    flag: "🇲🇦",
    description: "Carrefour des épices et des roses. Rose de Damas, argan, cèdre de l'Atlas.",
    suppliers: 2,
    molecules: 9,
    specialties: ["Rose de Damas", "Argan", "Cèdre de l'Atlas", "Néroli"],
    color: "from-emerald-500 to-emerald-700",
    bgColor: "bg-emerald-50 dark:bg-emerald-950",
    textColor: "text-emerald-700 dark:text-emerald-300"
  },
  {
    id: "suisse",
    name: "Suisse",
    flag: "🇨🇭",
    description: "Excellence et innovation. Firmenich, Givaudan, molécules de synthèse.",
    suppliers: 2,
    molecules: 15,
    specialties: ["Molécules captives", "Ambroxan", "Hedione", "Bases"],
    color: "from-gray-500 to-gray-700",
    bgColor: "bg-gray-50 dark:bg-gray-900",
    textColor: "text-gray-700 dark:text-gray-300"
  },
  {
    id: "uk",
    name: "Royaume-Uni",
    flag: "🇬🇧",
    description: "Tradition et expertise. Pell Wall, molécules rares, muscs captifs.",
    suppliers: 1,
    molecules: 8,
    specialties: ["Molécules rares", "Muscs captifs", "Absolues", "Résinoïdes"],
    color: "from-indigo-500 to-indigo-700",
    bgColor: "bg-indigo-50 dark:bg-indigo-950",
    textColor: "text-indigo-700 dark:text-indigo-300"
  },
  {
    id: "colombie",
    name: "Colombie",
    flag: "🇨🇴",
    description: "Biodiversité exceptionnelle. Café, cacao, fleurs tropicales, palo santo.",
    suppliers: 2,
    molecules: 9,
    specialties: ["Café Geisha", "Cacao", "Fleurs Tropicales", "Palo Santo"],
    color: "from-yellow-500 to-yellow-700",
    bgColor: "bg-yellow-50 dark:bg-yellow-950",
    textColor: "text-yellow-700 dark:text-yellow-300"
  }
];

// Statistiques globales
const stats = {
  totalSuppliers: regions.reduce((acc, r) => acc + r.suppliers, 0),
  totalMolecules: regions.reduce((acc, r) => acc + r.molecules, 0),
  totalRegions: regions.length
};

export default function Sourcing() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  return (
    <div className="container py-8">
      <Breadcrumbs />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
            <Globe className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sourcing Global</h1>
            <p className="text-muted-foreground">
              Origines géographiques des matières premières PERFUMUM
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary">{stats.totalRegions}</div>
            <p className="text-sm text-muted-foreground">Régions</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary">{stats.totalSuppliers}</div>
            <p className="text-sm text-muted-foreground">Fournisseurs</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary">{stats.totalMolecules}</div>
            <p className="text-sm text-muted-foreground">Molécules</p>
          </CardContent>
        </Card>
      </div>

      {/* Carte du monde simplifiée */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Carte des Origines
          </CardTitle>
          <CardDescription>
            Cliquez sur une région pour voir les détails
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full aspect-[2/1] bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg overflow-hidden">
            {/* Fond de carte simplifié */}
            <svg viewBox="0 0 100 50" className="w-full h-full">
              {/* Continents simplifiés */}
              <path 
                d="M10,20 Q15,15 25,18 Q35,12 45,15 Q50,18 55,15 Q60,12 65,15 L65,35 Q55,38 45,35 Q35,38 25,35 Q15,32 10,35 Z" 
                fill="currentColor" 
                className="text-slate-300 dark:text-slate-700"
              />
              <path 
                d="M55,20 Q60,15 70,18 Q80,15 85,20 Q90,25 85,35 Q75,40 65,35 Q55,30 55,25 Z" 
                fill="currentColor" 
                className="text-slate-300 dark:text-slate-700"
              />
              <path 
                d="M60,35 Q65,32 70,38 Q68,45 62,42 Z" 
                fill="currentColor" 
                className="text-slate-300 dark:text-slate-700"
              />
              
              {/* Points des régions */}
              {regions.map((region) => {
                const positions: Record<string, { x: number; y: number }> = {
                  france: { x: 48, y: 22 },
                  inde: { x: 72, y: 30 },
                  madagascar: { x: 65, y: 40 },
                  japon: { x: 88, y: 25 },
                  maroc: { x: 42, y: 28 },
                  suisse: { x: 50, y: 22 },
                  uk: { x: 46, y: 18 },
                  colombie: { x: 25, y: 35 }
                };
                const pos = positions[region.id] || { x: 50, y: 25 };
                const isSelected = selectedRegion === region.id;
                
                return (
                  <g key={region.id}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected ? 3 : 2}
                      className={`cursor-pointer transition-all duration-300 ${
                        isSelected 
                          ? "fill-primary stroke-primary stroke-2" 
                          : "fill-primary/70 hover:fill-primary"
                      }`}
                      onClick={() => setSelectedRegion(region.id)}
                    />
                    {isSelected && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={5}
                        className="fill-none stroke-primary stroke-1 animate-ping"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
            
            {/* Légende */}
            <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
              {regions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegion(region.id)}
                  className={`text-xs px-2 py-1 rounded-full transition-all ${
                    selectedRegion === region.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-background/80 hover:bg-background"
                  }`}
                >
                  {region.flag}
                </button>
              ))}
            </div>
          </div>
          
          {/* Détails de la région sélectionnée */}
          {selectedRegion && (
            <div className="mt-4 p-4 rounded-lg bg-muted/50">
              {(() => {
                const region = regions.find(r => r.id === selectedRegion);
                if (!region) return null;
                return (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <span className="text-2xl">{region.flag}</span>
                        {region.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{region.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {region.specialties.map((s) => (
                          <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                    </div>
                    <Link href={`/sourcing/${region.id}`}>
                      <Button className="whitespace-nowrap">
                        Voir le détail
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                );
              })()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grille des régions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {regions.map((region) => (
          <Link key={region.id} href={`/sourcing/${region.id}`}>
            <Card className={`card-hover h-full cursor-pointer transition-all ${
              selectedRegion === region.id ? "ring-2 ring-primary" : ""
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{region.flag}</span>
                  <Badge variant="outline" className={region.textColor}>
                    {region.suppliers} fournisseurs
                  </Badge>
                </div>
                <CardTitle className="text-lg">{region.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {region.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 mb-3">
                  {region.specialties.slice(0, 3).map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                  ))}
                  {region.specialties.length > 3 && (
                    <Badge variant="secondary" className="text-xs">+{region.specialties.length - 3}</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Beaker className="h-3 w-3" />
                    {region.molecules} molécules
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Voir aussi */}
      <div className="mt-12">
        <VoirAussi
          items={[
            {
              title: "Fournisseurs",
              description: "Annuaire complet des fournisseurs",
              href: "/fournisseurs",
              icon: <Building2 className="h-5 w-5" />
            },
            {
              title: "Molécules",
              description: "Base de données des molécules",
              href: "/molecules",
              icon: <Beaker className="h-5 w-5" />
            },
            {
              title: "Gamme Colombie",
              description: "Molécules colombiennes",
              href: "/gammes/colombie",
              icon: <Leaf className="h-5 w-5" />
            }
          ]}
        />
      </div>
    </div>
  );
}
