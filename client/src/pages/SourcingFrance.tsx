// @ts-nocheck
import { useState } from "react";
import { Link } from "wouter";
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
  Truck,
  Shield,
  Heart,
  Sun,
  Wind
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

// Données des fournisseurs français
const fournisseurs = [
  {
    id: 1,
    name: "Robertet",
    region: "Grasse",
    department: "Alpes-Maritimes",
    coordinates: { lat: 43.6586, lng: 6.9230 },
    description: "Fondée en 1850, Robertet est l'une des plus anciennes et prestigieuses maisons de Grasse. Spécialisée dans les absolues et concrètes de fleurs, elle perpétue un savoir-faire artisanal d'exception.",
    history: "Depuis plus de 170 ans, la maison Robertet cultive l'art de l'extraction des matières premières naturelles. Pionnière dans le développement durable, elle a été la première maison de Grasse à obtenir la certification UEBT pour ses filières d'approvisionnement éthique.",
    specialties: ["Rose de Mai", "Jasmin Grandiflorum", "Tubéreuse", "Mimosa", "Néroli"],
    certifications: ["ISO 9001", "UEBT", "EcoVadis Gold", "B Corp"],
    rating: 4.9,
    contact: {
      email: "contact@robertet.com",
      phone: "+33 4 93 40 33 66",
      website: "www.robertet.com"
    },
    stats: {
      employes: 2100,
      hectares: 500,
      especes: 45,
      annees: 174
    },
    image: "/images/sourcing/grasse-robertet.svg"
  },
  {
    id: 2,
    name: "Albert Vieille",
    region: "Grasse",
    department: "Alpes-Maritimes",
    coordinates: { lat: 43.6586, lng: 6.9230 },
    description: "Maison grassoise engagée dans le développement durable et les filières équitables depuis plus de 100 ans. Spécialiste de la lavande bio et des fleurs méditerranéennes.",
    history: "Fondée en 1920, Albert Vieille a toujours privilégié la qualité et l'authenticité. La maison a développé des partenariats durables avec des producteurs locaux de lavande en Provence et de rose en Bulgarie, garantissant traçabilité et équité.",
    specialties: ["Lavande Fine Bio", "Rose Centifolia", "Iris Pallida", "Violette de Grasse"],
    certifications: ["Bio", "Commerce Équitable", "COSMOS", "Origine France Garantie"],
    rating: 4.8,
    contact: {
      email: "info@albertvieille.com",
      phone: "+33 4 93 09 33 44",
      website: "www.albertvieille.com"
    },
    stats: {
      employes: 85,
      hectares: 200,
      especes: 30,
      annees: 104
    },
    image: "/images/sourcing/grasse-vieille.svg"
  },
  {
    id: 3,
    name: "Biolandes",
    region: "Le Sen",
    department: "Landes",
    coordinates: { lat: 43.8833, lng: -0.9167 },
    description: "Producteur et distillateur français spécialisé dans les plantes aromatiques méditerranéennes et les résines de pin maritime. Leader européen de l'huile essentielle de pin.",
    history: "Née dans les années 1980 de la volonté de valoriser les ressources naturelles des Landes, Biolandes est devenue une référence mondiale pour les huiles essentielles de conifères. L'entreprise a développé des techniques d'extraction innovantes respectueuses de l'environnement.",
    specialties: ["Pin Maritime", "Cyprès", "Immortelle Corse", "Ciste Ladanifère", "Genévrier"],
    certifications: ["Bio", "COSMOS", "ISO 14001", "Origine France Garantie"],
    rating: 4.7,
    contact: {
      email: "contact@biolandes.com",
      phone: "+33 5 58 45 64 64",
      website: "www.biolandes.com"
    },
    stats: {
      employes: 150,
      hectares: 3000,
      especes: 25,
      annees: 44
    },
    image: "/images/sourcing/landes-biolandes.svg"
  },
  {
    id: 4,
    name: "Distillerie de Provence",
    region: "Apt",
    department: "Vaucluse",
    coordinates: { lat: 43.8769, lng: 5.3958 },
    description: "Distillerie artisanale au cœur du Luberon, spécialisée dans les plantes aromatiques provençales cultivées en agriculture biologique.",
    history: "Installée dans une ancienne bastide du XVIIIe siècle, la Distillerie de Provence perpétue les méthodes traditionnelles d'hydrodistillation. Chaque lot est distillé à la demande, garantissant une fraîcheur et une qualité optimales.",
    specialties: ["Lavandin Grosso", "Thym", "Romarin", "Sauge Sclarée", "Hélichryse"],
    certifications: ["Bio", "Nature & Progrès", "Demeter"],
    rating: 4.9,
    contact: {
      email: "distillerie@provence.fr",
      phone: "+33 4 90 74 56 78",
      website: "www.distillerie-provence.fr"
    },
    stats: {
      employes: 12,
      hectares: 80,
      especes: 18,
      annees: 35
    },
    image: "/images/sourcing/provence-distillerie.svg"
  }
];

// Données des régions françaises
const regions = [
  {
    name: "Grasse",
    department: "Alpes-Maritimes",
    climate: "Méditerranéen",
    altitude: "300-800m",
    description: "Capitale mondiale de la parfumerie depuis le XVIIIe siècle. Le microclimat unique et les sols calcaires produisent des fleurs d'une qualité inégalée.",
    molecules: ["Rose de Mai", "Jasmin Grandiflorum", "Tubéreuse", "Mimosa", "Néroli", "Violette"],
    color: "bg-rose-500"
  },
  {
    name: "Provence",
    department: "Vaucluse / Alpes-de-Haute-Provence",
    climate: "Méditerranéen continental",
    altitude: "400-1200m",
    description: "Les plateaux de lavande et les garrigues provençales offrent une palette aromatique unique, symbole de la France dans le monde entier.",
    molecules: ["Lavande Fine", "Lavandin", "Thym", "Romarin", "Sauge Sclarée", "Hélichryse"],
    color: "bg-purple-500"
  },
  {
    name: "Landes",
    department: "Landes / Gironde",
    climate: "Océanique",
    altitude: "0-100m",
    description: "La plus grande forêt artificielle d'Europe occidentale. Les pins maritimes produisent des résines et huiles essentielles aux propriétés uniques.",
    molecules: ["Pin Maritime", "Cyprès", "Genévrier", "Résine de Pin", "Térébenthine"],
    color: "bg-emerald-500"
  },
  {
    name: "Corse",
    department: "Corse-du-Sud / Haute-Corse",
    climate: "Méditerranéen montagnard",
    altitude: "0-2700m",
    description: "L'Île de Beauté abrite une flore endémique exceptionnelle. Le maquis corse produit des huiles essentielles aux profils aromatiques intenses.",
    molecules: ["Immortelle Corse", "Myrte", "Ciste", "Lentisque", "Arbousier"],
    color: "bg-amber-500"
  }
];

export default function SourcingFrance() {
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
            <span className="text-4xl">🇫🇷</span>
            <h1 className="text-4xl font-bold tracking-tight">Sourcing France</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            Berceau de la parfumerie mondiale — Grasse, Provence, Landes et Corse
          </p>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardContent className="pt-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-3xl font-bold">2,347</div>
            <div className="text-sm text-muted-foreground">Employés partenaires</div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6 text-center">
            <Mountain className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
            <div className="text-3xl font-bold">3,780</div>
            <div className="text-sm text-muted-foreground">Hectares cultivés</div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6 text-center">
            <Flower2 className="h-8 w-8 mx-auto mb-2 text-rose-500" />
            <div className="text-3xl font-bold">118</div>
            <div className="text-sm text-muted-foreground">Espèces cultivées</div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-amber-500" />
            <div className="text-3xl font-bold">12</div>
            <div className="text-sm text-muted-foreground">Certifications</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="carte">Carte des Régions</TabsTrigger>
          <TabsTrigger value="partenaires">Nos Partenaires</TabsTrigger>
          <TabsTrigger value="engagement">Notre Engagement</TabsTrigger>
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
                Nos matières premières proviennent de quatre terroirs d'exception
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Carte stylisée SVG de la France */}
              <div className="relative w-full h-[450px] bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-950/20 rounded-lg overflow-hidden mb-6">
                <svg viewBox="0 0 400 450" className="w-full h-full">
                  {/* Silhouette France simplifiée */}
                  <path 
                    d="M180,30 Q220,25 260,40 Q300,60 320,100 Q340,140 350,180 Q355,220 340,260 Q320,300 280,340 Q240,380 200,400 Q160,410 120,390 Q80,360 60,320 Q40,280 50,240 Q60,200 80,160 Q100,120 130,80 Q160,50 180,30 Z" 
                    fill="currentColor" 
                    className="text-blue-200 dark:text-blue-800/50"
                  />
                  
                  {/* Corse */}
                  <ellipse cx="340" cy="380" rx="20" ry="35" className="fill-amber-200 dark:fill-amber-800/50" />
                  
                  {/* Région Grasse */}
                  <circle cx="300" cy="300" r="20" className="fill-rose-500 animate-pulse cursor-pointer" />
                  <text x="300" y="305" textAnchor="middle" className="text-[10px] font-bold fill-white">Grasse</text>
                  
                  {/* Région Provence */}
                  <circle cx="250" cy="320" r="20" className="fill-purple-500 animate-pulse cursor-pointer" />
                  <text x="250" y="325" textAnchor="middle" className="text-[10px] font-bold fill-white">Provence</text>
                  
                  {/* Région Landes */}
                  <circle cx="120" cy="300" r="20" className="fill-emerald-500 animate-pulse cursor-pointer" />
                  <text x="120" y="305" textAnchor="middle" className="text-[10px] font-bold fill-white">Landes</text>
                  
                  {/* Région Corse */}
                  <circle cx="340" cy="380" r="15" className="fill-amber-500 animate-pulse cursor-pointer" />
                  <text x="340" y="385" textAnchor="middle" className="text-[8px] font-bold fill-white">Corse</text>
                  
                  {/* Paris (référence) */}
                  <circle cx="200" cy="140" r="6" className="fill-gray-400" />
                  <text x="215" y="145" className="text-xs fill-gray-500">Paris</text>
                  
                  {/* Lignes de connexion */}
                  <line x1="200" y1="140" x2="300" y2="300" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" className="text-primary/30" />
                  <line x1="200" y1="140" x2="250" y2="320" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" className="text-primary/30" />
                  <line x1="200" y1="140" x2="120" y2="300" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" className="text-primary/30" />
                  
                  {/* Océan Atlantique */}
                  <text x="30" y="250" className="text-xs fill-blue-400 opacity-50 -rotate-90" transform="rotate(-90, 30, 250)">Atlantique</text>
                  
                  {/* Méditerranée */}
                  <text x="280" y="420" className="text-xs fill-blue-400 opacity-50">Méditerranée</text>
                </svg>
                
                {/* Légende */}
                <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <span className="text-sm">Grasse (Alpes-Maritimes)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm">Provence (Vaucluse)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-sm">Landes (Aquitaine)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm">Corse</span>
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
                      <CardDescription>{region.department} • {region.altitude}</CardDescription>
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
              <CardHeader className="bg-gradient-to-r from-blue-50 to-rose-50 dark:from-blue-900/20 dark:to-rose-900/20">
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
                      {fournisseur.region}, {fournisseur.department}
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
                    <div className="text-2xl font-bold text-primary">{fournisseur.stats.employes}</div>
                    <div className="text-xs text-muted-foreground">Employés</div>
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
                        <Flower2 className="h-3 w-3 mr-1" />
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
                Notre Engagement pour la France
              </CardTitle>
              <CardDescription>
                Préserver et valoriser le patrimoine olfactif français
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                      <Flower2 className="h-5 w-5 text-rose-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Patrimoine Grassois</h4>
                      <p className="text-sm text-muted-foreground">
                        Soutien aux producteurs traditionnels de Grasse pour préserver les savoir-faire ancestraux de la parfumerie française.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Sun className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Lavande de Provence</h4>
                      <p className="text-sm text-muted-foreground">
                        Partenariats avec les lavandiculteurs provençaux pour garantir la pérennité de cette culture emblématique menacée.
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
                      <h4 className="font-semibold">Forêt des Landes</h4>
                      <p className="text-sm text-muted-foreground">
                        Exploitation durable des ressources forestières landaises, en harmonie avec les écosystèmes locaux.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                      <Wind className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Maquis Corse</h4>
                      <p className="text-sm text-muted-foreground">
                        Protection de la flore endémique corse et valorisation des plantes aromatiques du maquis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div className="pt-6 border-t">
                <h4 className="font-semibold mb-4">Certifications de nos partenaires français</h4>
                <div className="flex flex-wrap gap-3">
                  {["Bio", "COSMOS", "UEBT", "B Corp", "Origine France Garantie", "Commerce Équitable", "ISO 9001", "ISO 14001", "EcoVadis Gold", "Nature & Progrès", "Demeter"].map((cert) => (
                    <Badge key={cert} variant="outline" className="px-3 py-1">
                      <Shield className="h-3 w-3 mr-1" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Chiffres clés */}
              <div className="pt-6 border-t">
                <h4 className="font-semibold mb-4">La France en chiffres</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-3xl font-bold text-primary">4</div>
                    <div className="text-sm text-muted-foreground">Régions partenaires</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-3xl font-bold text-rose-500">170+</div>
                    <div className="text-sm text-muted-foreground">Années d'expertise</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-3xl font-bold text-emerald-500">100%</div>
                    <div className="text-sm text-muted-foreground">Traçabilité</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-3xl font-bold text-amber-500">UNESCO</div>
                    <div className="text-sm text-muted-foreground">Patrimoine Grasse</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground pt-8 border-t">
        <p>© 2024-2035 PERFUMUM — Jean-Alphonse Bastos</p>
        <p className="mt-1">ABSORBE™ Godinje, Montenegro • UNLMTD™</p>
      </div>
    </div>
  );
}
