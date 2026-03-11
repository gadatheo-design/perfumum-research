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
  TreePine,
  Heart,
  Sparkles
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

// Données des fournisseurs malgaches
const fournisseurs = [
  {
    id: 1,
    name: "Coopérative Vanille SAVA",
    region: "Antalaha",
    province: "SAVA",
    coordinates: { lat: -14.8833, lng: 50.2833 },
    description: "La région SAVA produit 80% de la vanille mondiale. Cette coopérative regroupe 2000 familles de producteurs qui perpétuent les méthodes traditionnelles de culture et de préparation de la vanille Bourbon.",
    history: "La vanille a été introduite à Madagascar en 1880. La technique de pollinisation manuelle, inventée par Edmond Albius à La Réunion, a permis le développement de cette culture qui fait aujourd'hui la renommée mondiale de l'île.",
    specialties: ["Vanille Bourbon", "Vanille Tahitensis", "Gousses Extra", "Extrait de Vanille"],
    certifications: ["Bio", "Commerce Équitable", "Rainforest Alliance", "UTZ"],
    rating: 4.9,
    contact: {
      email: "coop.vanille@sava.mg",
      phone: "+261 20 88 123 45",
      website: "www.vanillesava.mg"
    },
    stats: {
      familles: 2000,
      hectares: 5000,
      especes: 3,
      annees: 144
    }
  },
  {
    id: 2,
    name: "Ylang Nosy Be",
    region: "Nosy Be",
    province: "Diana",
    coordinates: { lat: -13.3167, lng: 48.2667 },
    description: "L'île aux parfums produit l'ylang-ylang le plus réputé au monde. Les distilleries artisanales perpétuent un savoir-faire centenaire pour extraire les différentes fractions de cette fleur mythique.",
    history: "L'ylang-ylang a été introduit à Nosy Be au XIXe siècle par les colons français. L'île est devenue le premier producteur mondial, ses fleurs bénéficiant d'un terroir unique entre mer et montagne.",
    specialties: ["Ylang-Ylang Extra", "Ylang-Ylang I", "Ylang-Ylang II", "Ylang-Ylang III", "Ylang Complète"],
    certifications: ["Bio", "UEBT", "Fair for Life"],
    rating: 4.8,
    contact: {
      email: "ylang@nosybe.mg",
      phone: "+261 20 86 234 56",
      website: "www.ylangnosybe.mg"
    },
    stats: {
      familles: 500,
      hectares: 800,
      especes: 1,
      annees: 130
    }
  },
  {
    id: 3,
    name: "Aromates du Sud",
    region: "Fort-Dauphin",
    province: "Anosy",
    coordinates: { lat: -25.0333, lng: 46.9833 },
    description: "Le sud de Madagascar abrite une flore endémique unique. Cette entreprise familiale cultive et distille des plantes aromatiques rares dans le respect des écosystèmes fragiles de la région.",
    specialties: ["Katrafay", "Saro", "Ravintsara", "Niaouli", "Iary"],
    certifications: ["Bio", "Wild Harvested", "Ecocert"],
    rating: 4.7,
    contact: {
      email: "contact@aromatesud.mg",
      phone: "+261 20 92 345 67",
      website: "www.aromatesud.mg"
    },
    stats: {
      familles: 150,
      hectares: 300,
      especes: 25,
      annees: 35
    },
    history: "Fondée en 1989 par un botaniste français et des agriculteurs locaux, Aromates du Sud a développé des filières durables pour les plantes endémiques malgaches, contribuant à la préservation de la biodiversité unique de l'île."
  },
  {
    id: 4,
    name: "Girofle Analanjirofo",
    region: "Fénérive-Est",
    province: "Analanjirofo",
    coordinates: { lat: -17.3833, lng: 49.4167 },
    description: "Madagascar est le premier producteur mondial de clous de girofle. Les girofliers centenaires de la côte est produisent une épice d'une qualité exceptionnelle, riche en eugénol.",
    history: "Le giroflier a été introduit à Madagascar au XIXe siècle. Les forêts de girofliers de la côte est, plantées il y a plus de 100 ans, produisent aujourd'hui 80% de la production mondiale.",
    specialties: ["Clou de Girofle", "Huile Essentielle de Girofle", "Feuilles de Girofle", "Griffes de Girofle"],
    certifications: ["Bio", "Commerce Équitable", "Origine Madagascar"],
    rating: 4.6,
    contact: {
      email: "girofle@analanjirofo.mg",
      phone: "+261 20 87 456 78",
      website: "www.giroflemadag.mg"
    },
    stats: {
      familles: 800,
      hectares: 2000,
      especes: 1,
      annees: 150
    }
  }
];

// Données des régions malgaches
const regions = [
  {
    name: "SAVA",
    capital: "Antalaha",
    climate: "Tropical humide",
    altitude: "0-500m",
    description: "La région SAVA (Sambava-Antalaha-Vohémar-Andapa) est le berceau mondial de la vanille. Le climat chaud et humide, combiné aux sols volcaniques, produit la meilleure vanille au monde.",
    molecules: ["Vanille Bourbon", "Vanilline", "Vanille Tahitensis"],
    color: "bg-amber-600"
  },
  {
    name: "Nosy Be",
    capital: "Hell-Ville",
    climate: "Tropical maritime",
    altitude: "0-450m",
    description: "L'île aux parfums est le premier producteur mondial d'ylang-ylang. Les fleurs sont cueillies à l'aube et distillées immédiatement pour capturer leur parfum enivrant.",
    molecules: ["Ylang-Ylang Extra", "Ylang I/II/III", "Ylang Complète"],
    color: "bg-yellow-500"
  },
  {
    name: "Anosy",
    capital: "Fort-Dauphin",
    climate: "Semi-aride",
    altitude: "0-1000m",
    description: "Le sud de Madagascar abrite une flore endémique unique au monde. Les plantes aromatiques de cette région possèdent des propriétés thérapeutiques exceptionnelles.",
    molecules: ["Katrafay", "Saro", "Ravintsara", "Niaouli", "Iary"],
    color: "bg-emerald-500"
  },
  {
    name: "Analanjirofo",
    capital: "Fénérive-Est",
    climate: "Tropical humide",
    altitude: "0-200m",
    description: "La côte est de Madagascar est couverte de forêts de girofliers centenaires. Cette région produit 80% du girofle mondial, une épice précieuse en parfumerie.",
    molecules: ["Clou de Girofle", "Eugénol", "Huile de Girofle"],
    color: "bg-rose-600"
  }
];

export default function SourcingMadagascar() {
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
            <span className="text-4xl">🇲🇬</span>
            <h1 className="text-4xl font-bold tracking-tight">Sourcing Madagascar</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            L'île aux trésors olfactifs — Vanille, Ylang-Ylang, Girofle et plantes endémiques
          </p>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardContent className="pt-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-3xl font-bold">3,450</div>
            <div className="text-sm text-muted-foreground">Familles partenaires</div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6 text-center">
            <Mountain className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
            <div className="text-3xl font-bold">8,100</div>
            <div className="text-sm text-muted-foreground">Hectares cultivés</div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6 text-center">
            <TreePine className="h-8 w-8 mx-auto mb-2 text-amber-600" />
            <div className="text-3xl font-bold">30</div>
            <div className="text-sm text-muted-foreground">Espèces endémiques</div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-3xl font-bold">80%</div>
            <div className="text-sm text-muted-foreground">Vanille mondiale</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="carte">Carte des Régions</TabsTrigger>
          <TabsTrigger value="partenaires">Nos Partenaires</TabsTrigger>
          <TabsTrigger value="engagement">Biodiversité & Éthique</TabsTrigger>
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
                Quatre terroirs d'exception sur la Grande Île
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Carte stylisée SVG de Madagascar */}
              <div className="relative w-full h-[550px] bg-gradient-to-b from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-950/20 rounded-lg overflow-hidden mb-6">
                <svg viewBox="0 0 300 600" className="w-full h-full">
                  {/* Silhouette Madagascar simplifiée */}
                  <path 
                    d="M150,30 Q200,50 220,100 Q240,160 230,240 Q220,320 200,400 Q180,480 150,550 Q120,480 100,400 Q80,320 70,240 Q60,160 80,100 Q100,50 150,30 Z" 
                    fill="currentColor" 
                    className="text-emerald-200 dark:text-emerald-800/50"
                  />
                  
                  {/* Nosy Be (île) */}
                  <ellipse cx="80" cy="100" rx="20" ry="15" className="fill-yellow-300 dark:fill-yellow-700/50" />
                  <circle cx="80" cy="100" r="12" className="fill-yellow-500 animate-pulse cursor-pointer" />
                  <text x="80" y="105" textAnchor="middle" className="text-[8px] font-bold fill-white">Nosy Be</text>
                  
                  {/* Région SAVA */}
                  <circle cx="180" cy="120" r="18" className="fill-amber-600 animate-pulse cursor-pointer" />
                  <text x="180" y="125" textAnchor="middle" className="text-[8px] font-bold fill-white">SAVA</text>
                  
                  {/* Région Analanjirofo */}
                  <circle cx="200" cy="220" r="16" className="fill-rose-600 animate-pulse cursor-pointer" />
                  <text x="200" y="225" textAnchor="middle" className="text-[7px] font-bold fill-white">Analanjirofo</text>
                  
                  {/* Région Anosy */}
                  <circle cx="150" cy="480" r="16" className="fill-emerald-500 animate-pulse cursor-pointer" />
                  <text x="150" y="485" textAnchor="middle" className="text-[8px] font-bold fill-white">Anosy</text>
                  
                  {/* Antananarivo (référence) */}
                  <circle cx="140" cy="280" r="5" className="fill-gray-400" />
                  <text x="100" y="285" className="text-xs fill-gray-500">Antananarivo</text>
                  
                  {/* Canal de Mozambique */}
                  <text x="20" y="300" className="text-xs fill-blue-400 opacity-50 -rotate-90" transform="rotate(-90, 20, 300)">Canal de Mozambique</text>
                  
                  {/* Océan Indien */}
                  <text x="250" y="350" className="text-xs fill-blue-400 opacity-50 rotate-90" transform="rotate(90, 250, 350)">Océan Indien</text>
                </svg>
                
                {/* Légende */}
                <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-600"></div>
                    <span className="text-sm">SAVA (Vanille)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Nosy Be (Ylang-Ylang)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-600"></div>
                    <span className="text-sm">Analanjirofo (Girofle)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-sm">Anosy (Plantes endémiques)</span>
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
                      <CardDescription>{region.capital} • {region.altitude}</CardDescription>
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
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
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
                      {fournisseur.region}, {fournisseur.province}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
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
                    <div className="text-2xl font-bold text-emerald-500">{fournisseur.stats.hectares}</div>
                    <div className="text-xs text-muted-foreground">Hectares</div>
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
                Biodiversité & Engagement Éthique
              </CardTitle>
              <CardDescription>
                Préserver le patrimoine naturel unique de Madagascar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                      <Sparkles className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Vanille Durable</h4>
                      <p className="text-sm text-muted-foreground">
                        Programmes de formation pour les producteurs, prix équitables garantis, et traçabilité complète de la gousse à l'extrait.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                      <Flower2 className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Ylang-Ylang Responsable</h4>
                      <p className="text-sm text-muted-foreground">
                        Distillation à basse pression pour préserver les composés fragiles, reforestation des parcelles et formation des distillateurs.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                      <Leaf className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Plantes Endémiques</h4>
                      <p className="text-sm text-muted-foreground">
                        Protection des espèces menacées, culture durable des plantes sauvages, et programmes de conservation avec les communautés locales.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                      <TreePine className="h-5 w-5 text-rose-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Forêts de Girofliers</h4>
                      <p className="text-sm text-muted-foreground">
                        Préservation des girofliers centenaires, agroforesterie durable et diversification des revenus pour les producteurs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* La Vanille Bourbon */}
              <div className="pt-6 border-t">
                <h4 className="font-semibold mb-4">La Vanille Bourbon de Madagascar</h4>
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg p-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    La vanille Bourbon de Madagascar est considérée comme la meilleure au monde. Chaque fleur doit être pollinisée à la main, 
                    puis les gousses sont récoltées, échaudées, séchées et affinées pendant 6 à 9 mois pour développer leur arôme caractéristique.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-600">600</div>
                      <div className="text-xs text-muted-foreground">Fleurs/kg de gousses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">9</div>
                      <div className="text-xs text-muted-foreground">Mois d'affinage</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-rose-600">250+</div>
                      <div className="text-xs text-muted-foreground">Composés aromatiques</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">2%</div>
                      <div className="text-xs text-muted-foreground">Vanilline naturelle</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chiffres clés */}
              <div className="pt-6 border-t">
                <h4 className="font-semibold mb-4">Madagascar en chiffres</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-3xl font-bold text-primary">4</div>
                    <div className="text-sm text-muted-foreground">Régions partenaires</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-3xl font-bold text-amber-600">80%</div>
                    <div className="text-sm text-muted-foreground">Vanille mondiale</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-3xl font-bold text-emerald-500">90%</div>
                    <div className="text-sm text-muted-foreground">Espèces endémiques</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-3xl font-bold text-rose-500">1er</div>
                    <div className="text-sm text-muted-foreground">Ylang mondial</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Fournisseurs vérifiés DB */}
      <VerifiedSuppliersPanel country="Madagascar" className="mt-2" />

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground pt-8 border-t">
        <p>© 2024-2035 PERFUMUM — Jean-Alphonse Bastos</p>
        <p className="mt-1">ABSORBE™ Godinje, Montenegro • UNLMTD™</p>
      </div>
    </div>
  );
}
