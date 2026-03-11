import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CertificationFilter, CertificationBadge, type CertificationType } from "@/components/CertificationFilter";
import { 
  Globe, 
  MapPin, 
  Leaf, 
  FlaskConical,
  Building2,
  ExternalLink,
  ChevronRight,
  Star,
  Package,
  Users,
  Heart,
  Filter,
  Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorldSourcingMap } from "@/components/WorldSourcingMap";

// Régions de sourcing avec leurs fournisseurs
const regions = [
  {
    id: "colombie",
    name: "Colombie",
    flag: "🇨🇴",
    description: "Biodiversité exceptionnelle des Andes et de la région caféière. Partenariats directs avec des coopératives locales.",
    suppliers: [
      {
        name: "Cooperativa Valle del Cauca",
        location: "Cali, Valle del Cauca",
        specialty: "Lippia, Turnera, Piper",
        certifications: ["Bio", "Commerce Équitable"] as CertificationType[],
        story: "Fondée en 2018 par des agriculteurs locaux, cette coopérative cultive des plantes aromatiques endémiques des Andes colombiennes."
      },
      {
        name: "Finca Aromática Armenia",
        location: "Armenia, Quindío",
        specialty: "Café Geisha, Fleur de Café, Cacao",
        certifications: ["Rainforest Alliance", "Bio"] as CertificationType[],
        story: "Exploitation familiale de 3ème génération, spécialisée dans les sous-produits aromatiques du café et du cacao."
      }
    ],
    molecules: ["Lippia Origanoides", "Turnera Diffusa", "Café Geisha", "Cacao Colombien", "Palo Santo"],
    color: "bg-emerald-500",
    link: "/sourcing/colombie"
  },
  {
    id: "france",
    name: "France",
    flag: "🇫🇷",
    description: "Berceau de la parfumerie mondiale. Grasse et la Provence offrent des matières premières d'exception.",
    suppliers: [
      {
        name: "Robertet",
        location: "Grasse, Provence-Alpes-Côte d'Azur",
        specialty: "Rose de Mai, Jasmin, Tubéreuse",
        certifications: ["ISO 9001", "UEBT"] as CertificationType[],
        story: "Fondée en 1850, la maison Robertet est une référence mondiale pour les absolues et concrètes de Grasse."
      },
      {
        name: "Albert Vieille",
        location: "Grasse, Provence-Alpes-Côte d'Azur",
        specialty: "Lavande Bio, Rose Centifolia",
        certifications: ["Bio", "Commerce Équitable"] as CertificationType[],
        story: "Maison grassoise engagée dans le développement durable et les filières équitables depuis plus de 100 ans."
      },
      {
        name: "Biolandes",
        location: "Le Sen, Landes",
        specialty: "Pin Maritime, Cyprès, Immortelle",
        certifications: ["Bio", "COSMOS"] as CertificationType[],
        story: "Producteur et distillateur français spécialisé dans les plantes aromatiques méditerranéennes."
      }
    ],
    molecules: ["Rose de Mai", "Jasmin Grasse", "Lavande", "Immortelle", "Pin Maritime"],
    color: "bg-blue-500",
    link: "/sourcing/france"
  },
  {
    id: "uk",
    name: "Royaume-Uni",
    flag: "🇬🇧",
    description: "Hub européen pour les matières premières rares et les captives de niche.",
    suppliers: [
      {
        name: "Hermitage Oils",
        location: "Londres",
        specialty: "Ouds, Attars, Résines précieuses",
        certifications: ["Artisanal"] as CertificationType[],
        story: "Spécialiste des matières premières naturelles d'exception, reconnu pour la qualité de ses ouds et attars."
      },
      {
        name: "Pell Wall Perfumes",
        location: "Staffordshire",
        specialty: "Captives, Synthétiques premium",
        certifications: ["IFRA"] as CertificationType[],
        story: "Référence britannique pour les parfumeurs indépendants, offrant une large gamme de molécules synthétiques."
      }
    ],
    molecules: ["Oud", "Mitti Attar", "Ambroxan", "Iso E Super", "Hedione"],
    color: "bg-red-500",
    link: "/sourcing/uk"
  },
  {
    id: "usa",
    name: "États-Unis",
    flag: "🇺🇸",
    description: "Innovation et accessibilité. Large réseau de distributeurs pour tous les budgets.",
    suppliers: [
      {
        name: "Ensar Oud",
        location: "Californie",
        specialty: "Ouds de collection",
        certifications: ["Artisanal"] as CertificationType[],
        story: "Artisan distillateur spécialisé dans les ouds de collection, chaque lot est unique et documenté."
      },
      {
        name: "Vigon International",
        location: "New Jersey",
        specialty: "Synthétiques, Naturels",
        certifications: ["ISO 9001"] as CertificationType[],
        story: "Distributeur majeur de matières premières pour la parfumerie et l'aromatique."
      },
      {
        name: "Perfumer's Apprentice",
        location: "Californie",
        specialty: "Molécules courantes",
        certifications: [] as CertificationType[],
        story: "Boutique en ligne populaire pour les parfumeurs amateurs et professionnels."
      }
    ],
    molecules: ["Galaxolide", "Calone", "Vanilline", "Coumarine"],
    color: "bg-indigo-500",
    link: "/sourcing/north-america"
  },
  {
    id: "suisse",
    name: "Suisse",
    flag: "🇨🇭",
    description: "Siège des plus grandes maisons de création. Innovation et captives exclusives.",
    suppliers: [
      {
        name: "Firmenich",
        location: "Genève",
        specialty: "Hedione, Clearwood, Ambroxan",
        certifications: ["B Corp", "ISO 9001"] as CertificationType[],
        story: "L'une des plus grandes maisons de création de parfums au monde, inventeur de nombreuses molécules signature."
      },
      {
        name: "Givaudan",
        location: "Vernier",
        specialty: "Javanol, Akigalawood, Cashmeran",
        certifications: ["B Corp", "UEBT"] as CertificationType[],
        story: "Leader mondial de la création de parfums et d'arômes, portefeuille impressionnant de captives."
      }
    ],
    molecules: ["Hedione", "Javanol", "Clearwood", "Ambroxan", "Cashmeran"],
    color: "bg-amber-500",
    link: "/sourcing/suisse"
  },
  {
    id: "egypte",
    name: "Égypte & Moyen-Orient",
    flag: "🇪🇬",
    description: "Berceau historique de l'encens et des résines sacrées. Route de l'Encens millénaire.",
    suppliers: [
      {
        name: "Dhofar Frankincense",
        location: "Salalah, Oman",
        specialty: "Encens Boswellia Sacra",
        certifications: ["Origine contrôlée"] as CertificationType[],
        story: "Récolte traditionnelle de l'encens dans les montagnes du Dhofar, pratiquée depuis des millénaires."
      },
      {
        name: "Abdul Samad Al Qurashi",
        location: "Arabie Saoudite",
        specialty: "Oud, Musc, Ambre",
        certifications: ["Artisanal"] as CertificationType[],
        story: "Maison de parfumerie orientale fondée en 1852, spécialisée dans les matières premières précieuses."
      }
    ],
    molecules: ["Encens Oliban", "Boswellia Sacra", "Myrrhe", "Oud", "Ambre Gris"],
    color: "bg-yellow-600",
    link: "/sourcing/egypte"
  },
  {
    id: "haiti",
    name: "Haïti",
    flag: "🇭🇹",
    description: "Premier producteur mondial de vétiver. Qualité exceptionnelle et filières équitables.",
    suppliers: [
      {
        name: "Coopérative Vétiver Haïti",
        location: "Les Cayes",
        specialty: "Vétiver Bio",
        certifications: ["Bio", "Commerce Équitable"] as CertificationType[],
        story: "Coopérative regroupant plus de 3000 agriculteurs, produisant le meilleur vétiver au monde."
      }
    ],
    molecules: ["Vétiver Haïti", "Vétivénol", "Vétivone"],
    color: "bg-teal-500",
    link: null
  },
  {
    id: "inde",
    name: "Inde",
    flag: "🇮🇳",
    description: "Tradition millénaire des attars et huiles essentielles. Santal de Mysore légendaire.",
    suppliers: [
      {
        name: "Kannauj Attar Distillers",
        location: "Kannauj, Uttar Pradesh",
        specialty: "Attars traditionnels",
        certifications: ["Artisanal"] as CertificationType[],
        story: "Capitale mondiale des attars, Kannauj perpétue une tradition de distillation vieille de 400 ans."
      },
      {
        name: "Mysore Sandalwood",
        location: "Mysore, Karnataka",
        specialty: "Santal de Mysore",
        certifications: ["Origine contrôlée"] as CertificationType[],
        story: "Le santal de Mysore est considéré comme le plus fin au monde, protégé par le gouvernement indien."
      }
    ],
    molecules: ["Santal Mysore", "Mitti Attar", "Spikenard", "Jasmin Sambac"],
    color: "bg-orange-500",
    link: "/sourcing/inde"
  },
  {
    id: "madagascar",
    name: "Madagascar",
    flag: "🇲🇬",
    description: "L'île aux trésors olfactifs. Vanille Bourbon, Ylang-Ylang et plantes endémiques uniques.",
    suppliers: [
      {
        name: "Coopérative Vanille SAVA",
        location: "Antalaha, SAVA",
        specialty: "Vanille Bourbon, Gousses Extra",
        certifications: ["Bio", "Commerce Équitable"] as CertificationType[],
        story: "2000 familles perpétuent les méthodes traditionnelles de culture de la vanille Bourbon."
      },
      {
        name: "Ylang Nosy Be",
        location: "Nosy Be, Diana",
        specialty: "Ylang-Ylang Extra, Fractions",
        certifications: ["Bio", "UEBT"] as CertificationType[],
        story: "L'île aux parfums produit l'ylang-ylang le plus réputé au monde."
      }
    ],
    molecules: ["Vanille Bourbon", "Ylang-Ylang", "Girofle", "Ravintsara"],
    color: "bg-pink-500",
    link: "/sourcing/madagascar"
  },
  {
    id: "japon",
    name: "Japon",
    flag: "🇯🇵",
    description: "Art du Kōdō et bois précieux. Hinoki, Yuzu et traditions millénaires.",
    suppliers: [
      {
        name: "Kiso Valley Forestry",
        location: "Nagano",
        specialty: "Hinoki, Cyprès japonais",
        certifications: ["Bio"] as CertificationType[],
        story: "Forêts ancestrales de la vallée de Kiso, source du meilleur hinoki au monde."
      }
    ],
    molecules: ["Hinoki", "Yuzu", "Shiso", "Matcha"],
    color: "bg-rose-500",
    link: "/sourcing/japon"
  },
  {
    id: "maroc",
    name: "Maroc",
    flag: "🇲🇦",
    description: "Carrefour des épices et des roses. Rose de Damas et argan précieux.",
    suppliers: [
      {
        name: "Coopérative Rose Kelaat M'Gouna",
        location: "Kelaat M'Gouna, Drâa-Tafilalet",
        specialty: "Rose de Damas, Eau de rose",
        certifications: ["Bio", "Commerce Équitable"] as CertificationType[],
        story: "La vallée des roses produit chaque année 3000 tonnes de pétales pour l'industrie cosmétique mondiale."
      }
    ],
    molecules: ["Rose de Damas", "Argan", "Cèdre de l'Atlas", "Néroli"],
    color: "bg-red-600",
    link: "/sourcing/maroc"
  }
];

// Extraire toutes les certifications uniques
const allCertifications = Array.from(new Set(
  regions.flatMap(r => r.suppliers.flatMap(s => s.certifications))
)) as CertificationType[];

// Statistiques globales
const stats = {
  regions: regions.length,
  suppliers: regions.reduce((acc, r) => acc + r.suppliers.length, 0),
  molecules: new Set(regions.flatMap(r => r.molecules)).size,
  certifications: allCertifications
};

export default function Sourcing() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCertifications, setSelectedCertifications] = useState<CertificationType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filtrer les régions en fonction des certifications sélectionnées et de la recherche
  const filteredRegions = useMemo(() => {
    return regions.filter(region => {
      // Filtre par recherche
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = region.name.toLowerCase().includes(query);
        const matchesMolecules = region.molecules.some(m => m.toLowerCase().includes(query));
        const matchesSuppliers = region.suppliers.some(s => 
          s.name.toLowerCase().includes(query) || 
          s.specialty.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesMolecules && !matchesSuppliers) {
          return false;
        }
      }

      // Filtre par certifications
      if (selectedCertifications.length > 0) {
        const regionCertifications = region.suppliers.flatMap(s => s.certifications);
        return selectedCertifications.some(cert => regionCertifications.includes(cert));
      }

      return true;
    });
  }, [selectedCertifications, searchQuery]);

  // Compter les fournisseurs filtrés
  const filteredSupplierCount = useMemo(() => {
    if (selectedCertifications.length === 0) {
      return stats.suppliers;
    }
    return filteredRegions.reduce((acc, region) => {
      const matchingSuppliers = region.suppliers.filter(s => 
        selectedCertifications.some(cert => s.certifications.includes(cert))
      );
      return acc + matchingSuppliers.length;
    }, 0);
  }, [filteredRegions, selectedCertifications]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Sourcing Global</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Notre réseau mondial de fournisseurs et partenaires, sélectionnés pour leur excellence, 
            leur engagement éthique et la qualité exceptionnelle de leurs matières premières.
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-3xl font-bold">{filteredRegions.length}</div>
              <div className="text-sm text-muted-foreground">Régions</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
              <div className="text-3xl font-bold">{filteredSupplierCount}</div>
              <div className="text-sm text-muted-foreground">Fournisseurs</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <FlaskConical className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-3xl font-bold">{stats.molecules}</div>
              <div className="text-sm text-muted-foreground">Molécules</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Heart className="h-8 w-8 mx-auto mb-2 text-rose-500" />
              <div className="text-3xl font-bold">{stats.certifications.length}</div>
              <div className="text-sm text-muted-foreground">Certifications</div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de recherche et filtres */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une région, un fournisseur ou une molécule..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtres par certification
                {selectedCertifications.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedCertifications.length}
                  </Badge>
                )}
              </Button>
            </div>

            {showFilters && (
              <div className="pt-4 border-t animate-in fade-in slide-in-from-top-2 duration-200">
                <CertificationFilter
                  selectedCertifications={selectedCertifications}
                  onCertificationChange={setSelectedCertifications}
                  availableCertifications={allCertifications}
                  showAllCertifications={true}
                />
              </div>
            )}

            {(selectedCertifications.length > 0 || searchQuery) && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {filteredRegions.length} région{filteredRegions.length > 1 ? 's' : ''} • {filteredSupplierCount} fournisseur{filteredSupplierCount > 1 ? 's' : ''}
                  {selectedCertifications.length > 0 && (
                    <span> avec certification{selectedCertifications.length > 1 ? 's' : ''} : {selectedCertifications.join(', ')}</span>
                  )}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Carte interactive du monde */}
        <div className="mb-12">
          <WorldSourcingMap 
            onRegionSelect={(id) => setSelectedRegion(selectedRegion === id ? null : id)}
            selectedRegion={selectedRegion}
          />
        </div>

        {/* Grille des régions */}
        <Card className="mb-12 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Nos Régions de Sourcing
            </CardTitle>
            <CardDescription>
              Cliquez sur une région pour découvrir nos partenaires locaux
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredRegions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegion(selectedRegion === region.id ? null : region.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                    selectedRegion === region.id 
                      ? 'border-primary bg-primary/5 shadow-lg scale-105' 
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="text-3xl mb-2">{region.flag}</div>
                  <div className="font-semibold">{region.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {region.suppliers.length} fournisseur{region.suppliers.length > 1 ? 's' : ''}
                  </div>
                  <div className={`h-1 w-full mt-2 rounded ${region.color}`} />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Détail de la région sélectionnée */}
        {selectedRegion && (
          <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
            {filteredRegions.filter(r => r.id === selectedRegion).map((region) => (
              <Card key={region.id} className="overflow-hidden">
                <CardHeader className={`${region.color} text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        <span className="text-4xl">{region.flag}</span>
                        {region.name}
                      </CardTitle>
                      <CardDescription className="text-white/80 mt-2">
                        {region.description}
                      </CardDescription>
                    </div>
                    {region.link && (
                      <Link href={region.link}>
                        <Button variant="secondary" className="gap-2">
                          Voir le détail
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Fournisseurs */}
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Nos Partenaires
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {region.suppliers.map((supplier, idx) => (
                      <Card key={idx} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{supplier.name}</h4>
                            <div className="flex flex-wrap gap-1 justify-end">
                              {supplier.certifications.map((cert, i) => (
                                <CertificationBadge key={i} certification={cert} />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                            <MapPin className="h-3 w-3" />
                            {supplier.location}
                          </div>
                          <div className="text-sm mb-2">
                            <span className="font-medium">Spécialité :</span> {supplier.specialty}
                          </div>
                          <p className="text-sm text-muted-foreground italic">
                            "{supplier.story}"
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Molécules */}
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FlaskConical className="h-5 w-5" />
                    Molécules Clés
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {region.molecules.map((mol, idx) => (
                      <Link key={idx} href={`/molecules?search=${encodeURIComponent(mol)}`}>
                        <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-primary/10 transition-colors">
                          {mol}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Liste complète des régions */}
        <h2 className="text-2xl font-bold mb-6">Toutes les Régions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredRegions.map((region) => (
            <Card 
              key={region.id} 
              className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedRegion(region.id)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{region.flag}</span>
                  <div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {region.name}
                    </CardTitle>
                    <CardDescription>
                      {region.suppliers.length} fournisseur{region.suppliers.length > 1 ? 's' : ''} • {region.molecules.length} molécules
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {region.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {region.suppliers.slice(0, 2).map((s, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {s.name}
                    </Badge>
                  ))}
                  {region.suppliers.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{region.suppliers.length - 2}
                    </Badge>
                  )}
                </div>
                {/* Certifications de la région */}
                <div className="flex flex-wrap gap-1">
                  {Array.from(new Set(region.suppliers.flatMap(s => s.certifications))).slice(0, 3).map((cert, i) => (
                    <CertificationBadge key={i} certification={cert} />
                  ))}
                </div>
                {region.link && (
                  <Link href={region.link}>
                    <Button variant="link" className="mt-4 p-0 h-auto gap-1">
                      Voir le détail
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Message si aucun résultat */}
        {filteredRegions.length === 0 && (
          <Card className="mb-12">
            <CardContent className="py-12 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Aucune région trouvée</h3>
              <p className="text-muted-foreground mb-4">
                Aucune région ne correspond à vos critères de recherche.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedCertifications([]);
                  setSearchQuery("");
                }}
              >
                Réinitialiser les filtres
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Engagement éthique */}
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <Leaf className="h-6 w-6" />
              Notre Engagement Éthique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Commerce Équitable</h4>
                <p className="text-sm text-muted-foreground">
                  Nous privilégions les partenariats directs avec les producteurs, 
                  garantissant une rémunération juste et des conditions de travail dignes.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Durabilité</h4>
                <p className="text-sm text-muted-foreground">
                  Nos fournisseurs s'engagent dans des pratiques agricoles durables, 
                  préservant la biodiversité et les écosystèmes locaux.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Traçabilité</h4>
                <p className="text-sm text-muted-foreground">
                  Chaque matière première est documentée de la récolte à la livraison, 
                  assurant une transparence totale sur son origine.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© PERFUMUM Research — Sourcing responsable depuis 2024</p>
        </div>
      </div>
    </div>
  );
}
