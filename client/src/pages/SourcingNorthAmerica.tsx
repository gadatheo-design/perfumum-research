import { useState } from "react";
import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { VerifiedSuppliersPanel } from "@/components/VerifiedSuppliersPanel";
import { CertificationFilter, CertificationBadge, type CertificationType } from "@/components/CertificationFilter";
import { 
  TreePine, 
  MapPin, 
  Leaf, 
  FlaskConical,
  Building2,
  ExternalLink,
  ChevronRight,
  Mountain,
  Snowflake,
  Sun,
  Wind,
  Droplets,
  Star,
  ArrowLeft,
  Package,
  Thermometer
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Régions forestières d'Amérique du Nord
const forestRegions = [
  {
    id: "pacific-northwest",
    name: "Pacific Northwest",
    country: "USA",
    flag: "🇺🇸",
    states: ["Oregon", "Washington", "Idaho"],
    climate: "Océanique tempéré",
    icon: <Droplets className="h-5 w-5" />,
    description: "Forêts pluviales tempérées de la côte Pacifique. Les précipitations abondantes créent des conditions idéales pour les conifères géants et les mousses aromatiques.",
    keySpecies: [
      {
        name: "Douglas Fir",
        latinName: "Pseudotsuga menziesii",
        profile: "Notes balsamiques profondes, résineuses et légèrement citronnées",
        uses: ["Base boisée", "Accord forêt", "Notes vertes"],
        harvesting: "Distillation des aiguilles et branches, récolte durable certifiée"
      },
      {
        name: "Western Red Cedar",
        latinName: "Thuja plicata",
        profile: "Boisé chaud, épicé avec des nuances de crayon et de camphre",
        uses: ["Cœur boisé", "Notes épicées", "Fixateur naturel"],
        harvesting: "Bois de cœur et écorce, rotation forestière de 80 ans"
      },
      {
        name: "Sitka Spruce",
        latinName: "Picea sitchensis",
        profile: "Frais, vert, légèrement sucré avec des notes de citron",
        uses: ["Notes de tête", "Fraîcheur alpine", "Accord conifère"],
        harvesting: "Aiguilles et résine, récolte en altitude"
      }
    ],
    suppliers: [
      {
        name: "Pacific Botanicals",
        location: "Grants Pass, Oregon",
        specialty: "Huiles essentielles de conifères du Pacifique",
        certifications: ["Bio", "USDA Organic"] as CertificationType[],
        website: "pacificbotanicals.com",
        story: "Pionniers de la distillation durable dans les forêts de l'Oregon depuis 1979."
      },
      {
        name: "Floracopeia",
        location: "Ashland, Oregon",
        specialty: "Huiles essentielles artisanales, Douglas et Cèdre",
        certifications: ["Bio", "Commerce Équitable"] as CertificationType[],
        website: "floracopeia.com",
        story: "Engagement pour la préservation des forêts anciennes et le commerce éthique."
      }
    ],
    color: "bg-emerald-600"
  },
  {
    id: "new-england",
    name: "New England",
    country: "USA",
    flag: "🇺🇸",
    states: ["Vermont", "Maine", "New Hampshire", "Massachusetts"],
    climate: "Continental humide",
    icon: <Snowflake className="h-5 w-5" />,
    description: "Forêts mixtes de la Nouvelle-Angleterre, célèbres pour leurs érables et sapins baumiers. Tradition de distillation remontant aux premiers colons.",
    keySpecies: [
      {
        name: "Balsam Fir",
        latinName: "Abies balsamea",
        profile: "Balsamique doux, résineux avec des notes de miel et de forêt",
        uses: ["Accord sapin", "Notes festives", "Base naturelle"],
        harvesting: "Aiguilles et résine (baume du Canada), récolte hivernale"
      },
      {
        name: "Eastern White Pine",
        latinName: "Pinus strobus",
        profile: "Pin doux, légèrement vanillé avec des notes de térébenthine",
        uses: ["Notes de tête", "Fraîcheur boisée", "Accord pin"],
        harvesting: "Aiguilles et jeunes pousses, distillation à la vapeur"
      },
      {
        name: "Sugar Maple",
        latinName: "Acer saccharum",
        profile: "Notes boisées chaudes, légèrement sucrées et fumées",
        uses: ["Accord boisé", "Notes gourmandes", "Fumé naturel"],
        harvesting: "Bois et sève (sirop), sous-produits de l'acériculture"
      }
    ],
    suppliers: [
      {
        name: "Vermont Soap Organics",
        location: "Middlebury, Vermont",
        specialty: "Sapin baumier et pin blanc de Nouvelle-Angleterre",
        certifications: ["Bio", "USDA Organic"] as CertificationType[],
        website: "vermontsoap.com",
        story: "Ferme familiale pratiquant la distillation traditionnelle depuis 3 générations."
      },
      {
        name: "Maine Woods Company",
        location: "Portland, Maine",
        specialty: "Baume du Canada, résines et absolus forestiers",
        certifications: ["Artisanal"] as CertificationType[],
        website: "mainewoodscompany.com",
        story: "Petite distillerie artisanale spécialisée dans les trésors des forêts du Maine."
      }
    ],
    color: "bg-blue-600"
  },
  {
    id: "british-columbia",
    name: "British Columbia",
    country: "Canada",
    flag: "🇨🇦",
    states: ["Colombie-Britannique"],
    climate: "Océanique à subalpin",
    icon: <Mountain className="h-5 w-5" />,
    description: "Des forêts côtières pluviales aux montagnes Rocheuses, la C.-B. offre une diversité exceptionnelle de conifères. Industrie forestière durable et certifiée.",
    keySpecies: [
      {
        name: "Western Hemlock",
        latinName: "Tsuga heterophylla",
        profile: "Vert frais, légèrement sucré avec des notes de mousse",
        uses: ["Fraîcheur verte", "Accord forêt humide", "Notes de mousse"],
        harvesting: "Aiguilles et écorce, sous-produits forestiers certifiés FSC"
      },
      {
        name: "Yellow Cedar",
        latinName: "Cupressus nootkatensis",
        profile: "Boisé complexe, notes de citron et de poivre avec fond crémeux",
        uses: ["Cœur boisé précieux", "Notes citronnées", "Fixateur"],
        harvesting: "Bois de cœur, récolte contrôlée (espèce protégée)"
      },
      {
        name: "Grand Fir",
        latinName: "Abies grandis",
        profile: "Agrumes frais, balsamique lumineux, notes d'orange",
        uses: ["Notes de tête", "Accord agrumes-bois", "Fraîcheur"],
        harvesting: "Aiguilles fraîches, distillation immédiate post-récolte"
      }
    ],
    suppliers: [
      {
        name: "Aliksir",
        location: "Whitehorse, Yukon / Vancouver",
        specialty: "Huiles essentielles boréales, épinette noire, sapin subalpin",
        certifications: ["Bio", "Commerce Équitable"] as CertificationType[],
        website: "aliksir.com",
        story: "Distillerie canadienne pionnière dans les huiles essentielles boréales depuis 1994."
      },
      {
        name: "Saje Natural Wellness",
        location: "Vancouver, BC",
        specialty: "Mélanges thérapeutiques à base de conifères canadiens",
        certifications: ["Bio"] as CertificationType[],
        website: "saje.com",
        story: "Marque canadienne intégrant les essences forestières dans l'aromathérapie."
      },
      {
        name: "Escents Aromatherapy",
        location: "Vancouver, BC",
        specialty: "Cèdre rouge, pruche et sapin de C.-B.",
        certifications: ["Artisanal", "Bio"] as CertificationType[],
        website: "escentsaromatherapy.com",
        story: "Petite entreprise familiale spécialisée dans les conifères de la côte Ouest."
      }
    ],
    color: "bg-red-600"
  },
  {
    id: "quebec",
    name: "Québec & Forêt Boréale",
    country: "Canada",
    flag: "🇨🇦",
    states: ["Québec", "Ontario Nord", "Labrador"],
    climate: "Continental à subarctique",
    icon: <Thermometer className="h-5 w-5" />,
    description: "La forêt boréale canadienne, l'un des plus grands écosystèmes forestiers au monde. Épinettes, sapins et bouleaux adaptés aux conditions extrêmes.",
    keySpecies: [
      {
        name: "Black Spruce",
        latinName: "Picea mariana",
        profile: "Balsamique intense, notes de résine et de terre froide",
        uses: ["Base boréale", "Accord taïga", "Notes terreuses"],
        harvesting: "Aiguilles et branches, récolte en forêt boréale certifiée"
      },
      {
        name: "White Spruce",
        latinName: "Picea glauca",
        profile: "Frais et propre, légèrement mentholé avec des notes de pin",
        uses: ["Fraîcheur nordique", "Notes de tête", "Accord hiver"],
        harvesting: "Aiguilles, distillation traditionnelle québécoise"
      },
      {
        name: "Paper Birch",
        latinName: "Betula papyrifera",
        profile: "Notes de goudron de bouleau, cuiré, fumé et légèrement sucré",
        uses: ["Accord cuir", "Notes fumées", "Profondeur"],
        harvesting: "Écorce et goudron de bouleau, méthode traditionnelle scandinave"
      },
      {
        name: "Labrador Tea",
        latinName: "Rhododendron groenlandicum",
        profile: "Herbacé complexe, notes de miel sauvage et de résine",
        uses: ["Notes herbacées", "Accord boréal", "Originalité"],
        harvesting: "Feuilles, récolte sauvage en tourbières"
      }
    ],
    suppliers: [
      {
        name: "Aliksir Québec",
        location: "Grondines, Québec",
        specialty: "Épinette noire, sapin baumier, thé du Labrador",
        certifications: ["Bio", "Commerce Équitable"] as CertificationType[],
        website: "aliksir.com",
        story: "Ferme-distillerie québécoise au cœur de la forêt boréale depuis 1994."
      },
      {
        name: "Druide",
        location: "Pointe-Claire, Québec",
        specialty: "Extraits forestiers pour cosmétiques naturels",
        certifications: ["Bio", "COSMOS"] as CertificationType[],
        website: "druide.ca",
        story: "Entreprise québécoise intégrant les richesses de la forêt boréale."
      },
      {
        name: "Zayat Aroma",
        location: "Bromont, Québec",
        specialty: "Huiles essentielles québécoises, sapin et épinette",
        certifications: ["Bio"] as CertificationType[],
        website: "zayataroma.com",
        story: "Distillerie artisanale offrant les essences authentiques du Québec."
      }
    ],
    color: "bg-sky-600"
  },
  {
    id: "rocky-mountains",
    name: "Rocky Mountains",
    country: "USA/Canada",
    flag: "🏔️",
    states: ["Colorado", "Montana", "Wyoming", "Alberta"],
    climate: "Alpin et semi-aride",
    icon: <Sun className="h-5 w-5" />,
    description: "Les Rocheuses offrent des conditions uniques pour les conifères d'altitude. Genévriers, pins ponderosa et sapins subalpins aux profils aromatiques intenses.",
    keySpecies: [
      {
        name: "Rocky Mountain Juniper",
        latinName: "Juniperus scopulorum",
        profile: "Genévrier épicé, notes de gin, boisé sec et légèrement sucré",
        uses: ["Notes épicées", "Accord genévrier", "Fraîcheur sèche"],
        harvesting: "Baies et rameaux, récolte sauvage en altitude"
      },
      {
        name: "Ponderosa Pine",
        latinName: "Pinus ponderosa",
        profile: "Vanille distinctive, résine chaude, notes de butterscotch",
        uses: ["Notes vanillées", "Chaleur boisée", "Accord unique"],
        harvesting: "Écorce et résine, caractéristique odeur de vanille"
      },
      {
        name: "Subalpine Fir",
        latinName: "Abies lasiocarpa",
        profile: "Balsamique pur, notes d'altitude, fraîcheur cristalline",
        uses: ["Pureté alpine", "Notes de tête", "Accord montagne"],
        harvesting: "Aiguilles d'altitude, distillation en petits lots"
      },
      {
        name: "Lodgepole Pine",
        latinName: "Pinus contorta",
        profile: "Pin résineux, notes de térébenthine et de forêt sèche",
        uses: ["Base résineuse", "Accord forêt", "Authenticité"],
        harvesting: "Résine et aiguilles, forêts de régénération"
      }
    ],
    suppliers: [
      {
        name: "High Altitude Organics",
        location: "Boulder, Colorado",
        specialty: "Conifères d'altitude, genévrier des Rocheuses",
        certifications: ["Bio", "USDA Organic"] as CertificationType[],
        website: "highaltitudeorganics.com",
        story: "Distillerie artisanale spécialisée dans les plantes alpines du Colorado."
      },
      {
        name: "Montana Aromatics",
        location: "Missoula, Montana",
        specialty: "Pin ponderosa, sapin subalpin, genévrier",
        certifications: ["Artisanal"] as CertificationType[],
        website: "montanaaromatics.com",
        story: "Petite distillerie familiale au cœur des Rocheuses du Montana."
      }
    ],
    color: "bg-amber-600"
  }
];

// Molécules clés des bois nord-américains
const keyMolecules = [
  {
    name: "α-Pinène",
    source: "Pin, Sapin, Épinette",
    profile: "Note de tête fraîche, résineuse, rappelant la forêt de pins",
    concentration: "20-40% dans les huiles de pin"
  },
  {
    name: "β-Pinène",
    source: "Pin, Sapin baumier",
    profile: "Plus boisé et terreux que l'α-pinène, notes de bois sec",
    concentration: "5-15% dans les huiles de conifères"
  },
  {
    name: "Limonène",
    source: "Sapin grandis, Épinette",
    profile: "Notes d'agrumes fraîches, légèreté citronnée",
    concentration: "5-25% selon l'espèce"
  },
  {
    name: "Bornyl acétate",
    source: "Sapin baumier, Épinette noire",
    profile: "Balsamique doux, notes de forêt et de résine",
    concentration: "15-35% dans le sapin baumier"
  },
  {
    name: "Camphène",
    source: "Cèdre, Genévrier",
    profile: "Frais, camphoré, légèrement mentholé",
    concentration: "5-20% dans les huiles de cèdre"
  },
  {
    name: "Thujone",
    source: "Cèdre rouge de l'Ouest",
    profile: "Notes herbacées, mentholées, caractère distinctif",
    concentration: "Variable, réglementé IFRA"
  },
  {
    name: "Cédrol",
    source: "Cèdre rouge, Cèdre jaune",
    profile: "Boisé doux, crémeux, excellent fixateur",
    concentration: "20-40% dans l'huile de cèdre"
  },
  {
    name: "Bétuline",
    source: "Bouleau blanc",
    profile: "Notes cuirées, fumées, goudron de bouleau",
    concentration: "Extrait d'écorce"
  }
];

// Statistiques
const stats = {
  regions: forestRegions.length,
  species: forestRegions.reduce((acc, r) => acc + r.keySpecies.length, 0),
  suppliers: forestRegions.reduce((acc, r) => acc + r.suppliers.length, 0),
  molecules: keyMolecules.length
};

export default function SourcingNorthAmerica() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCertifications, setSelectedCertifications] = useState<CertificationType[]>([]);

  // Extraire toutes les certifications
  const allCertifications = Array.from(new Set(
    forestRegions.flatMap(r => r.suppliers.flatMap(s => s.certifications))
  )) as CertificationType[];

  // Filtrer les régions par certification
  const filteredRegions = selectedCertifications.length === 0 
    ? forestRegions 
    : forestRegions.filter(region => 
        region.suppliers.some(s => 
          selectedCertifications.some(cert => s.certifications.includes(cert))
        )
      );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        
        {/* Navigation retour */}
        <Link href="/sourcing">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour au Sourcing Global
          </Button>
        </Link>

        {/* Hero Section */}
        <div className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 p-8 md:p-12">
          <div className="absolute inset-0 opacity-20">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="trees" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M10 20 L10 12 L5 12 L10 5 L15 12 L10 12" fill="currentColor" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#trees)"/>
            </svg>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 text-4xl">
                <span>🇺🇸</span>
                <span>🇨🇦</span>
              </div>
              <TreePine className="h-12 w-12 text-emerald-300" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Amérique du Nord
            </h1>
            <p className="text-xl text-emerald-100 max-w-3xl">
              Les grandes forêts nord-américaines : des séquoias du Pacifique aux épinettes boréales, 
              un patrimoine forestier exceptionnel pour la parfumerie naturelle.
            </p>
            
            {/* Stats rapides */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-white">{stats.regions}</div>
                <div className="text-emerald-200 text-sm">Régions forestières</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-white">{stats.species}</div>
                <div className="text-emerald-200 text-sm">Espèces documentées</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-white">{stats.suppliers}</div>
                <div className="text-emerald-200 text-sm">Fournisseurs</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-white">{stats.molecules}</div>
                <div className="text-emerald-200 text-sm">Molécules clés</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtre par certification */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <CertificationFilter
              selectedCertifications={selectedCertifications}
              onCertificationChange={setSelectedCertifications}
              availableCertifications={allCertifications}
            />
          </CardContent>
        </Card>

        {/* Tabs principales */}
        <Tabs defaultValue="regions" className="mb-12">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="regions" className="gap-2">
              <Mountain className="h-4 w-4" />
              Régions
            </TabsTrigger>
            <TabsTrigger value="species" className="gap-2">
              <TreePine className="h-4 w-4" />
              Espèces
            </TabsTrigger>
            <TabsTrigger value="molecules" className="gap-2">
              <FlaskConical className="h-4 w-4" />
              Molécules
            </TabsTrigger>
          </TabsList>

          {/* Onglet Régions */}
          <TabsContent value="regions">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRegions.map((region) => (
                <Card 
                  key={region.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedRegion === region.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedRegion(selectedRegion === region.id ? null : region.id)}
                >
                  <CardHeader className={`${region.color} text-white rounded-t-lg`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{region.flag}</span>
                        {region.icon}
                      </div>
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {region.keySpecies.length} espèces
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{region.name}</CardTitle>
                    <CardDescription className="text-white/80">
                      {region.states.join(", ")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {region.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Wind className="h-4 w-4" />
                      <span>{region.climate}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {region.keySpecies.slice(0, 3).map((species, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {species.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Détail de la région sélectionnée */}
            {selectedRegion && (
              <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-300">
                {filteredRegions.filter(r => r.id === selectedRegion).map((region) => (
                  <Card key={region.id} className="overflow-hidden">
                    <CardHeader className={`${region.color} text-white`}>
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{region.flag}</span>
                        <div>
                          <CardTitle className="text-2xl">{region.name}</CardTitle>
                          <CardDescription className="text-white/80">
                            {region.states.join(" • ")} — {region.climate}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-muted-foreground mb-6">{region.description}</p>

                      {/* Espèces clés */}
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <TreePine className="h-5 w-5 text-emerald-600" />
                        Espèces Clés
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4 mb-8">
                        {region.keySpecies.map((species, idx) => (
                          <Card key={idx} className="bg-muted/30">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold">{species.name}</h4>
                                  <p className="text-xs text-muted-foreground italic">{species.latinName}</p>
                                </div>
                                <TreePine className="h-5 w-5 text-emerald-600" />
                              </div>
                              <p className="text-sm mb-3">{species.profile}</p>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {species.uses.map((use, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {use}
                                  </Badge>
                                ))}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                <Leaf className="h-3 w-3 inline mr-1" />
                                {species.harvesting}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* Fournisseurs */}
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Fournisseurs Partenaires
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {region.suppliers.map((supplier, idx) => (
                          <Card key={idx} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold">{supplier.name}</h4>
                                <div className="flex gap-1">
                                  {supplier.certifications.map((cert, i) => (
                                    <CertificationBadge key={i} certification={cert} />
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                                <MapPin className="h-3 w-3" />
                                {supplier.location}
                              </div>
                              <p className="text-sm mb-2">
                                <span className="font-medium">Spécialité :</span> {supplier.specialty}
                              </p>
                              <p className="text-sm text-muted-foreground italic mb-3">
                                "{supplier.story}"
                              </p>
                              <a 
                                href={`https://${supplier.website}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline flex items-center gap-1"
                              >
                                <ExternalLink className="h-3 w-3" />
                                {supplier.website}
                              </a>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Onglet Espèces */}
          <TabsContent value="species">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRegions.flatMap(region => 
                region.keySpecies.map((species, idx) => (
                  <Card key={`${region.id}-${idx}`} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <TreePine className="h-8 w-8 text-emerald-600" />
                        <Badge className={region.color}>
                          {region.name}
                        </Badge>
                      </div>
                      <CardTitle>{species.name}</CardTitle>
                      <CardDescription className="italic">{species.latinName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{species.profile}</p>
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-xs font-semibold text-muted-foreground mb-1">UTILISATIONS</h5>
                          <div className="flex flex-wrap gap-1">
                            {species.uses.map((use, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {use}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="text-xs font-semibold text-muted-foreground mb-1">RÉCOLTE</h5>
                          <p className="text-xs text-muted-foreground">{species.harvesting}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Onglet Molécules */}
          <TabsContent value="molecules">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5" />
                  Molécules Clés des Bois Nord-Américains
                </CardTitle>
                <CardDescription>
                  Les composés aromatiques caractéristiques des conifères et feuillus d'Amérique du Nord
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              {keyMolecules.map((molecule, idx) => (
                <Card key={idx} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-lg">{molecule.name}</h4>
                      <FlaskConical className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground">SOURCE</span>
                        <p className="text-sm">{molecule.source}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground">PROFIL OLFACTIF</span>
                        <p className="text-sm">{molecule.profile}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground">CONCENTRATION</span>
                        <p className="text-sm text-muted-foreground">{molecule.concentration}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Section Durabilité */}
        <Card className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border-emerald-200 dark:border-emerald-800 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <Leaf className="h-6 w-6" />
              Foresterie Durable en Amérique du Nord
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Certification FSC</h4>
                <p className="text-sm text-muted-foreground">
                  Le Forest Stewardship Council certifie les pratiques forestières responsables, 
                  garantissant la préservation des écosystèmes et des communautés locales.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Récolte Sélective</h4>
                <p className="text-sm text-muted-foreground">
                  Nos partenaires pratiquent la récolte sélective, prélevant uniquement les branches 
                  et aiguilles sans abattre les arbres, assurant la régénération naturelle.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Traçabilité Complète</h4>
                <p className="text-sm text-muted-foreground">
                  Chaque lot est documenté de la forêt à la distillerie, avec géolocalisation 
                  et date de récolte pour une transparence totale.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liens vers autres régions */}
        <Card>
          <CardHeader>
            <CardTitle>Explorer d'autres régions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Link href="/sourcing/france">
                <Button variant="outline" className="gap-2">
                  🇫🇷 France
                </Button>
              </Link>
              <Link href="/sourcing/colombie">
                <Button variant="outline" className="gap-2">
                  🇨🇴 Colombie
                </Button>
              </Link>
              <Link href="/sourcing/madagascar">
                <Button variant="outline" className="gap-2">
                  🇲🇬 Madagascar
                </Button>
              </Link>
              <Link href="/sourcing/inde">
                <Button variant="outline" className="gap-2">
                  🇮🇳 Inde
                </Button>
              </Link>
              <Link href="/sourcing">
                <Button variant="default" className="gap-2">
                  <ChevronRight className="h-4 w-4" />
                  Toutes les régions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Fournisseurs vérifiés DB */}
        <VerifiedSuppliersPanel country="USA" className="mt-4" />
        <VerifiedSuppliersPanel country="Canada" className="mt-2" />

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© PERFUMUM Research — Sourcing responsable depuis 2024</p>
        </div>
      </div>
    </div>
  );
}
