import { useState } from "react";
import { Link } from "wouter";
import { VerifiedSuppliersPanel } from "@/components/VerifiedSuppliersPanel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Mountain, 
  Leaf, 
  Flower2, 
  Users, 
  Award, 
  Phone, 
  Mail, 
  Globe, 
  ArrowLeft,
  Star,
  Flame,
  Heart,
  Sparkles
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

// Données des fournisseurs indiens
const fournisseurs = [
  {
    id: 1,
    name: "Kannauj Attar Distillers",
    region: "Kannauj",
    state: "Uttar Pradesh",
    coordinates: { lat: 27.0551, lng: 79.9137 },
    description: "Capitale mondiale des attars depuis 400 ans. Les distillateurs de Kannauj perpétuent l'art ancestral de l'hydrodistillation dans l'huile de santal, créant des parfums d'une profondeur inégalée.",
    history: "Kannauj était le centre de la parfumerie moghole dès le XVIe siècle. Les techniques de distillation « deg-bhapka » transmises de génération en génération produisent des attars uniques au monde, véritables trésors olfactifs.",
    specialties: ["Mitti Attar", "Shamama", "Hina", "Gulab Attar", "Kewra"],
    certifications: ["Artisanal", "Patrimoine Culturel", "GI Kannauj"],
    rating: 4.9,
    contact: {
      email: "info@kannauattars.in",
      phone: "+91 5694 234 567",
      website: "www.kannaujattars.in"
    },
    stats: {
      familles: 200,
      alambics: 500,
      especes: 35,
      annees: 400
    }
  },
  {
    id: 2,
    name: "Mysore Sandalwood Cooperative",
    region: "Mysore",
    state: "Karnataka",
    coordinates: { lat: 12.2958, lng: 76.6394 },
    description: "Le santal de Mysore (Santalum album) est considéré comme le plus fin au monde. Cette coopérative gère les dernières forêts de santal protégées du Karnataka.",
    history: "Le santal de Mysore est protégé par le gouvernement indien depuis 1792. Chaque arbre doit avoir au moins 30 ans avant d'être récolté. La coopérative assure une gestion durable de cette ressource précieuse et menacée.",
    specialties: ["Santal Mysore", "Huile de Santal", "Poudre de Santal", "Copeaux de Santal"],
    certifications: ["CITES", "FSC", "Gouvernement Karnataka"],
    rating: 5.0,
    contact: {
      email: "mysore.sandalwood@karnataka.gov.in",
      phone: "+91 821 242 1234",
      website: "www.mysoresandalwood.gov.in"
    },
    stats: {
      familles: 50,
      hectares: 2000,
      especes: 1,
      annees: 230
    }
  },
  {
    id: 3,
    name: "Himalayan Aromatics",
    region: "Dehradun",
    state: "Uttarakhand",
    coordinates: { lat: 30.3165, lng: 78.0322 },
    description: "Spécialiste des plantes aromatiques de l'Himalaya. Distillation d'altitude pour des huiles essentielles aux profils uniques, enrichies par l'air pur des montagnes.",
    history: "Fondée par des botanistes passionnés, Himalayan Aromatics explore les vallées reculées de l'Uttarakhand pour découvrir et préserver les plantes médicinales et aromatiques traditionnelles de l'Ayurveda.",
    specialties: ["Spikenard (Jatamansi)", "Rhododendron", "Cèdre de l'Himalaya", "Cyprès Bhutan", "Genévrier Himalaya"],
    certifications: ["Bio India", "Fair Wild", "Organic USDA"],
    rating: 4.8,
    contact: {
      email: "contact@himalayanaromatics.com",
      phone: "+91 135 265 4321",
      website: "www.himalayanaromatics.com"
    },
    stats: {
      familles: 120,
      hectares: 500,
      especes: 45,
      annees: 25
    }
  },
  {
    id: 4,
    name: "Tamil Nadu Jasmine Growers",
    region: "Madurai",
    state: "Tamil Nadu",
    coordinates: { lat: 9.9252, lng: 78.1198 },
    description: "Le jasmin Sambac de Madurai est récolté à l'aube pour capturer son parfum enivrant. Les fleurs sont cueillies à la main par des générations de cultivatrices expertes.",
    history: "Le jasmin est indissociable de la culture tamoule. Porté dans les cheveux des femmes, offert aux temples, il parfume la vie quotidienne du Tamil Nadu depuis des millénaires.",
    specialties: ["Jasmin Sambac", "Jasmin Grandiflorum", "Tubéreuse", "Champaca"],
    certifications: ["Bio India", "Women Cooperative", "Fair Trade"],
    rating: 4.7,
    contact: {
      email: "jasmine@tamilnadufarmers.in",
      phone: "+91 452 234 5678",
      website: "www.maduraijasmine.in"
    },
    stats: {
      familles: 3000,
      hectares: 1200,
      especes: 8,
      annees: 100
    }
  }
];

// Données des régions indiennes
const regions = [
  {
    name: "Kannauj",
    state: "Uttar Pradesh",
    climate: "Subtropical",
    altitude: "130m",
    description: "La « Grasse de l'Orient » perpétue depuis 400 ans l'art des attars. Les distillateurs utilisent encore les techniques mogholes traditionnelles.",
    molecules: ["Mitti Attar", "Shamama", "Hina", "Gulab Attar", "Kewra", "Motia"],
    color: "bg-amber-500"
  },
  {
    name: "Mysore",
    state: "Karnataka",
    climate: "Tropical de plateau",
    altitude: "770m",
    description: "Berceau du santal le plus précieux au monde. Les forêts protégées du Karnataka produisent un bois d'une qualité légendaire.",
    molecules: ["Santal Mysore", "Huile de Santal", "Santalol"],
    color: "bg-yellow-600"
  },
  {
    name: "Himalaya",
    state: "Uttarakhand",
    climate: "Alpin",
    altitude: "1000-4000m",
    description: "Les vallées himalayennes abritent une flore unique. Plantes médicinales ayurvédiques et aromates d'altitude aux propriétés exceptionnelles.",
    molecules: ["Spikenard", "Cèdre Himalaya", "Rhododendron", "Genévrier", "Cyprès Bhutan"],
    color: "bg-emerald-500"
  },
  {
    name: "Tamil Nadu",
    state: "Tamil Nadu",
    climate: "Tropical",
    altitude: "0-500m",
    description: "Le sud de l'Inde est le royaume des fleurs blanches. Jasmin, tubéreuse et champaca embaument les temples et les jardins.",
    molecules: ["Jasmin Sambac", "Jasmin Grandiflorum", "Tubéreuse", "Champaca", "Lotus"],
    color: "bg-rose-500"
  }
];

export default function SourcingInde() {
  const [activeTab, setActiveTab] = useState("carte");

  return (
    <div className="container py-8 space-y-8">
      <Breadcrumbs />
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/sourcing">
          <Button variant="ghost" size="icon" className="btn-enhanced">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <span className="text-4xl">🇮🇳</span>
            <h1 className="text-4xl font-bold tracking-tight">Sourcing Inde</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            Tradition millénaire des attars et huiles essentielles — Kannauj, Mysore, Himalaya
          </p>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardContent className="pt-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-3xl font-bold">3,370</div>
            <div className="text-sm text-muted-foreground">Familles partenaires</div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6 text-center">
            <Mountain className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
            <div className="text-3xl font-bold">3,700</div>
            <div className="text-sm text-muted-foreground">Hectares cultivés</div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6 text-center">
            <Flame className="h-8 w-8 mx-auto mb-2 text-amber-500" />
            <div className="text-3xl font-bold">500</div>
            <div className="text-sm text-muted-foreground">Alambics traditionnels</div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-3xl font-bold">400</div>
            <div className="text-sm text-muted-foreground">Années de tradition</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="carte">Carte des Régions</TabsTrigger>
          <TabsTrigger value="partenaires">Nos Partenaires</TabsTrigger>
          <TabsTrigger value="engagement">Tradition & Savoir-faire</TabsTrigger>
        </TabsList>

        {/* Tab Carte */}
        <TabsContent value="carte" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Régions de Sourcing
              </CardTitle>
              <CardDescription>
                Quatre terroirs d'exception pour des matières premières légendaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Carte stylisée SVG de l'Inde */}
              <div className="relative w-full h-[500px] bg-gradient-to-b from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-950/20 rounded-lg overflow-hidden mb-6">
                <svg viewBox="0 0 400 550" className="w-full h-full">
                  {/* Silhouette Inde simplifiée */}
                  <path 
                    d="M200,30 Q280,40 320,80 Q350,120 340,180 Q330,240 300,300 Q270,360 240,420 Q220,480 200,520 Q180,480 160,420 Q130,360 100,300 Q70,240 60,180 Q50,120 80,80 Q120,40 200,30 Z" 
                    fill="currentColor" 
                    className="text-orange-200 dark:text-orange-800/50"
                  />
                  
                  {/* Himalaya (nord) */}
                  <path 
                    d="M100,50 Q150,30 200,35 Q250,30 300,50 Q280,80 200,70 Q120,80 100,50 Z" 
                    fill="currentColor" 
                    className="text-emerald-300 dark:text-emerald-700/50"
                  />
                  
                  {/* Région Kannauj */}
                  <circle cx="220" cy="150" r="20" className="fill-amber-500 animate-pulse cursor-pointer" />
                  <text x="220" y="155" textAnchor="middle" className="text-[9px] font-bold fill-white">Kannauj</text>
                  
                  {/* Région Himalaya */}
                  <circle cx="200" cy="70" r="18" className="fill-emerald-500 animate-pulse cursor-pointer" />
                  <text x="200" y="75" textAnchor="middle" className="text-[8px] font-bold fill-white">Himalaya</text>
                  
                  {/* Région Mysore */}
                  <circle cx="180" cy="380" r="20" className="fill-yellow-600 animate-pulse cursor-pointer" />
                  <text x="180" y="385" textAnchor="middle" className="text-[9px] font-bold fill-white">Mysore</text>
                  
                  {/* Région Tamil Nadu */}
                  <circle cx="220" cy="440" r="18" className="fill-rose-500 animate-pulse cursor-pointer" />
                  <text x="220" y="445" textAnchor="middle" className="text-[8px] font-bold fill-white">Madurai</text>
                  
                  {/* Delhi (référence) */}
                  <circle cx="200" cy="120" r="5" className="fill-gray-400" />
                  <text x="215" y="125" className="text-xs fill-gray-500">Delhi</text>
                  
                  {/* Mumbai (référence) */}
                  <circle cx="120" cy="280" r="5" className="fill-gray-400" />
                  <text x="80" y="285" className="text-xs fill-gray-500">Mumbai</text>
                  
                  {/* Lignes de connexion */}
                  <line x1="200" y1="120" x2="220" y2="150" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" className="text-primary/30" />
                  <line x1="200" y1="120" x2="200" y2="70" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" className="text-primary/30" />
                  <line x1="200" y1="120" x2="180" y2="380" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" className="text-primary/30" />
                  
                  {/* Océan Indien */}
                  <text x="100" y="520" className="text-xs fill-blue-400 opacity-50">Océan Indien</text>
                </svg>
                
                {/* Légende */}
                <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm">Kannauj (Uttar Pradesh)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-sm">Himalaya (Uttarakhand)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                    <span className="text-sm">Mysore (Karnataka)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <span className="text-sm">Madurai (Tamil Nadu)</span>
                  </div>
                </div>
              </div>

              {/* Détails des régions */}
              <div className="grid md:grid-cols-2 gap-6">
                {regions.map((region) => (
                  <Card key={region.name} className="card-hover">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${region.color}`}></div>
                        <CardTitle className="text-lg">{region.name}</CardTitle>
                      </div>
                      <CardDescription>{region.state} • {region.altitude}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{region.description}</p>
                      <div>
                        <div className="text-sm font-medium mb-2">Molécules emblématiques :</div>
                        <div className="flex flex-wrap gap-1">
                          {region.molecules.map((mol) => (
                            <Badge key={mol} variant="secondary" className="text-xs">
                              {mol}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Partenaires */}
        <TabsContent value="partenaires" className="space-y-6">
          {fournisseurs.map((fournisseur) => (
            <Card key={fournisseur.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      {fournisseur.name}
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm">{fournisseur.rating}</span>
                      </div>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4" />
                      {fournisseur.region}, {fournisseur.state}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {fournisseur.certifications.slice(0, 3).map((cert) => (
                      <Badge key={cert} variant="secondary">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Description et histoire */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">À propos</h4>
                    <p className="text-sm text-muted-foreground">{fournisseur.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Histoire</h4>
                    <p className="text-sm text-muted-foreground">{fournisseur.history}</p>
                  </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{fournisseur.stats.familles}</div>
                    <div className="text-xs text-muted-foreground">Familles</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-500">{fournisseur.stats.hectares || fournisseur.stats.alambics}</div>
                    <div className="text-xs text-muted-foreground">{fournisseur.stats.hectares ? 'Hectares' : 'Alambics'}</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-amber-500">{fournisseur.stats.especes}</div>
                    <div className="text-xs text-muted-foreground">Espèces</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-rose-500">{fournisseur.stats.annees}</div>
                    <div className="text-xs text-muted-foreground">Années</div>
                  </div>
                </div>

                {/* Spécialités */}
                <div>
                  <h4 className="font-semibold mb-2">Spécialités</h4>
                  <div className="flex flex-wrap gap-2">
                    {fournisseur.specialties.map((spec) => (
                      <Badge key={spec} variant="outline" className="px-3 py-1">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="flex flex-wrap gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{fournisseur.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{fournisseur.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>{fournisseur.contact.website}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Tab Engagement */}
        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-500" />
                Tradition & Savoir-faire Indien
              </CardTitle>
              <CardDescription>
                Préserver un patrimoine olfactif millénaire
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                      <Flame className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Distillation Deg-Bhapka</h4>
                      <p className="text-sm text-muted-foreground">
                        Technique ancestrale de Kannauj : les fleurs sont distillées dans des alambics de cuivre (deg) et les vapeurs condensées dans des récipients en cuivre (bhapka) contenant de l'huile de santal.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                      <Leaf className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Santal de Mysore</h4>
                      <p className="text-sm text-muted-foreground">
                        Le Santalum album de Mysore nécessite 30 ans de croissance avant récolte. Chaque arbre est protégé par la loi indienne depuis 1792.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                      <Mountain className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Plantes Himalayennes</h4>
                      <p className="text-sm text-muted-foreground">
                        Les vallées de l'Uttarakhand abritent des plantes médicinales utilisées en Ayurveda depuis 5000 ans. Le Spikenard (Jatamansi) est mentionné dans les textes védiques.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                      <Flower2 className="h-5 w-5 text-rose-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Jasmin Sambac</h4>
                      <p className="text-sm text-muted-foreground">
                        Le « Mogra » est cueilli à l'aube par des femmes expertes. 8000 fleurs sont nécessaires pour produire 1 gramme d'absolu.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* L'art des Attars */}
              <div className="pt-6 border-t">
                <h4 className="font-semibold mb-4">L'Art des Attars</h4>
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Les attars sont des parfums naturels obtenus par hydrodistillation de fleurs, herbes ou épices dans de l'huile de santal. 
                    Cette technique unique, née à Kannauj il y a 400 ans, produit des parfums d'une profondeur et d'une longévité incomparables.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-600">Mitti</div>
                      <div className="text-xs text-muted-foreground">Terre après la pluie</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-rose-600">Gulab</div>
                      <div className="text-xs text-muted-foreground">Rose de Damas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">Hina</div>
                      <div className="text-xs text-muted-foreground">Henné fleuri</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">Shamama</div>
                      <div className="text-xs text-muted-foreground">40+ ingrédients</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chiffres clés */}
              <div className="pt-6 border-t">
                <h4 className="font-semibold mb-4">L'Inde en chiffres</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-3xl font-bold text-primary">4</div>
                    <div className="text-sm text-muted-foreground">Régions partenaires</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-3xl font-bold text-amber-500">5000</div>
                    <div className="text-sm text-muted-foreground">Ans d'Ayurveda</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-3xl font-bold text-emerald-500">GI</div>
                    <div className="text-sm text-muted-foreground">Kannauj Attar</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-3xl font-bold text-rose-500">CITES</div>
                    <div className="text-sm text-muted-foreground">Santal protégé</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Fournisseurs vérifiés DB */}
      <VerifiedSuppliersPanel country="Inde" className="mt-2" />

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground pt-8 border-t">
        <p>© 2024-2035 PERFUMUM — Jean-Alphonse Bastos</p>
        <p className="mt-1">ABSORBE™ Godinje, Montenegro • UNLMTD™</p>
      </div>
    </div>
  );
}
