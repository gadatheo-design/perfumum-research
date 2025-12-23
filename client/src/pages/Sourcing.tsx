import { useState } from "react";
import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
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
  Heart
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
        certifications: ["Bio", "Commerce Équitable"],
        story: "Fondée en 2018 par des agriculteurs locaux, cette coopérative cultive des plantes aromatiques endémiques des Andes colombiennes."
      },
      {
        name: "Finca Aromática Armenia",
        location: "Armenia, Quindío",
        specialty: "Café Geisha, Fleur de Café, Cacao",
        certifications: ["Rainforest Alliance", "Bio"],
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
        certifications: ["ISO 9001", "UEBT"],
        story: "Fondée en 1850, la maison Robertet est une référence mondiale pour les absolues et concrètes de Grasse."
      },
      {
        name: "Albert Vieille",
        location: "Grasse, Provence-Alpes-Côte d'Azur",
        specialty: "Lavande Bio, Rose Centifolia",
        certifications: ["Bio", "Équitable"],
        story: "Maison grassoise engagée dans le développement durable et les filières équitables depuis plus de 100 ans."
      },
      {
        name: "Biolandes",
        location: "Le Sen, Landes",
        specialty: "Pin Maritime, Cyprès, Immortelle",
        certifications: ["Bio", "COSMOS"],
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
        certifications: ["Artisanal"],
        story: "Spécialiste des matières premières naturelles d'exception, reconnu pour la qualité de ses ouds et attars."
      },
      {
        name: "Pell Wall Perfumes",
        location: "Staffordshire",
        specialty: "Captives, Synthétiques premium",
        certifications: ["IFRA"],
        story: "Référence britannique pour les parfumeurs indépendants, offrant une large gamme de molécules synthétiques."
      }
    ],
    molecules: ["Oud", "Mitti Attar", "Ambroxan", "Iso E Super", "Hedione"],
    color: "bg-red-500",
    link: null
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
        certifications: ["Artisanal"],
        story: "Artisan distillateur spécialisé dans les ouds de collection, chaque lot est unique et documenté."
      },
      {
        name: "Vigon International",
        location: "New Jersey",
        specialty: "Synthétiques, Naturels",
        certifications: ["ISO 9001"],
        story: "Distributeur majeur de matières premières pour la parfumerie et l'aromatique."
      },
      {
        name: "Perfumer's Apprentice",
        location: "Californie",
        specialty: "Molécules courantes",
        certifications: [],
        story: "Boutique en ligne populaire pour les parfumeurs amateurs et professionnels."
      }
    ],
    molecules: ["Galaxolide", "Calone", "Vanilline", "Coumarine"],
    color: "bg-indigo-500",
    link: null
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
        certifications: ["B Corp", "ISO 14001"],
        story: "L'une des plus grandes maisons de création de parfums au monde, inventeur de nombreuses molécules signature."
      },
      {
        name: "Givaudan",
        location: "Vernier",
        specialty: "Javanol, Akigalawood, Cashmeran",
        certifications: ["B Corp", "UEBT"],
        story: "Leader mondial de la création de parfums et d'arômes, portefeuille impressionnant de captives."
      }
    ],
    molecules: ["Hedione", "Javanol", "Clearwood", "Ambroxan", "Cashmeran"],
    color: "bg-amber-500",
    link: null
  },
  {
    id: "oman",
    name: "Oman",
    flag: "🇴🇲",
    description: "Terre sacrée de l'encens. Le Dhofar produit le meilleur Boswellia Sacra au monde.",
    suppliers: [
      {
        name: "Dhofar Frankincense",
        location: "Salalah, Dhofar",
        specialty: "Encens Boswellia Sacra",
        certifications: ["Origine contrôlée"],
        story: "Récolte traditionnelle de l'encens dans les montagnes du Dhofar, pratiquée depuis des millénaires."
      }
    ],
    molecules: ["Encens Oliban", "Boswellia Sacra"],
    color: "bg-yellow-600",
    link: null
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
        certifications: ["Bio", "Commerce Équitable"],
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
        certifications: ["Artisanal"],
        story: "Capitale mondiale des attars, Kannauj perpétue une tradition de distillation vieille de 400 ans."
      }
    ],
    molecules: ["Santal Mysore", "Mitti Attar", "Spikenard"],
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
        certifications: ["Bio", "Commerce Équitable"],
        story: "2000 familles perpétuent les méthodes traditionnelles de culture de la vanille Bourbon."
      },
      {
        name: "Ylang Nosy Be",
        location: "Nosy Be, Diana",
        specialty: "Ylang-Ylang Extra, Fractions",
        certifications: ["Bio", "UEBT"],
        story: "L'île aux parfums produit l'ylang-ylang le plus réputé au monde."
      }
    ],
    molecules: ["Vanille Bourbon", "Ylang-Ylang", "Girofle", "Ravintsara"],
    color: "bg-teal-500",
    link: "/sourcing/madagascar"
  }
];

// Statistiques globales
const stats = {
  regions: regions.length,
  suppliers: regions.reduce((acc, r) => acc + r.suppliers.length, 0),
  molecules: new Set(regions.flatMap(r => r.molecules)).size,
  certifications: ["Bio", "Commerce Équitable", "Rainforest Alliance", "B Corp", "UEBT", "ISO 9001", "COSMOS"]
};

export default function Sourcing() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-3xl font-bold">{stats.regions}</div>
              <div className="text-sm text-muted-foreground">Régions</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
              <div className="text-3xl font-bold">{stats.suppliers}</div>
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
              {regions.map((region) => (
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
            {regions.filter(r => r.id === selectedRegion).map((region) => (
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
                            <div className="flex gap-1">
                              {supplier.certifications.map((cert, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {cert}
                                </Badge>
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
                      <Badge key={idx} variant="outline" className="px-3 py-1">
                        {mol}
                      </Badge>
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
          {regions.map((region) => (
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
                <div className="flex flex-wrap gap-1">
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
