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
  Coffee, 
  Users, 
  Award, 
  Phone, 
  Mail, 
  Globe, 
  ArrowLeft,
  Star,
  Truck,
  Shield,
  Heart
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

// Données des fournisseurs colombiens
const fournisseurs = [
  {
    id: 1,
    name: "Cooperativa Aromática del Valle",
    region: "Cali",
    department: "Valle del Cauca",
    coordinates: { lat: 3.4516, lng: -76.5320 },
    description: "Coopérative fondée en 2008, regroupant 47 familles de producteurs dans la région de Cali. Spécialisée dans la culture biologique de plantes aromatiques endémiques des Andes colombiennes.",
    history: "Née de la volonté de préserver les savoirs ancestraux des communautés indigènes Nasa, la coopérative a développé des méthodes d'extraction durables qui respectent les cycles naturels de la forêt tropicale. Leur engagement envers le commerce équitable a permis d'améliorer les conditions de vie de plus de 200 personnes dans la région.",
    specialties: ["Lippia Origanoides", "Piper Aduncum", "Steiractinia Aspera", "Calycolpus Moritzianus"],
    certifications: ["Bio Colombia", "Fair Trade", "Rainforest Alliance"],
    rating: 4.8,
    contact: {
      email: "contacto@aromaticavalle.co",
      phone: "+57 2 555 1234",
      website: "www.aromaticavalle.co"
    },
    stats: {
      familles: 47,
      hectares: 320,
      especes: 12,
      annees: 16
    },
    image: "/images/sourcing/cali-region.svg"
  },
  {
    id: 2,
    name: "Finca Aromática Armenia",
    region: "Armenia",
    department: "Quindío",
    coordinates: { lat: 4.5339, lng: -75.6811 },
    description: "Exploitation familiale de troisième génération située au cœur de la région caféière colombienne. Pionnière dans l'intégration des cultures de café avec les plantes aromatiques endémiques.",
    history: "La famille Restrepo cultive ces terres depuis 1952. En 2015, la troisième génération a initié un programme de diversification en intégrant des plantes aromatiques endémiques aux cultures de café. Cette approche agroforestière unique produit des matières premières d'une qualité exceptionnelle, imprégnées des arômes du terroir caféier.",
    specialties: ["Café Geisha", "Fleur de Café", "Turnera Diffusa", "Cacao Colombien", "Palo Santo"],
    certifications: ["Café de Colombia", "Organic USDA", "B Corp"],
    rating: 4.9,
    contact: {
      email: "info@fincaarmenia.co",
      phone: "+57 6 555 5678",
      website: "www.fincaarmenia.co"
    },
    stats: {
      familles: 1,
      hectares: 85,
      especes: 8,
      annees: 72
    },
    image: "/images/sourcing/armenia-region.svg"
  }
];

// Données des régions
const regions = [
  {
    name: "Valle del Cauca",
    capital: "Cali",
    climate: "Tropical humide",
    altitude: "1000-2000m",
    description: "Région fertile entre les cordillères occidentale et centrale, connue pour sa biodiversité exceptionnelle et ses traditions agricoles ancestrales.",
    molecules: ["Lippia Origanoides", "Piper Aduncum", "Steiractinia Aspera", "Calycolpus Moritzianus"],
    color: "bg-green-500"
  },
  {
    name: "Quindío",
    capital: "Armenia",
    climate: "Tropical de montagne",
    altitude: "1200-2400m",
    description: "Au cœur du Triangle du Café, cette région offre des conditions idéales pour la culture de plantes aromatiques aux côtés des caféiers centenaires.",
    molecules: ["Café Geisha", "Fleur de Café", "Turnera Diffusa", "Cacao Colombien", "Palo Santo"],
    color: "bg-amber-500"
  }
];

export default function SourcingColombie() {
  const [activeTab, setActiveTab] = useState("carte");

  return (
    <div className="container py-8 space-y-8">
      <Breadcrumbs />
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/colombie">
          <Button variant="ghost" size="icon" className="btn-enhanced">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Sourcing Colombie</h1>
          <p className="text-muted-foreground mt-2">
            Découvrez nos partenaires locaux et les régions d'origine de nos matières premières colombiennes
          </p>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardContent className="pt-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-3xl font-bold">48</div>
            <div className="text-sm text-muted-foreground">Familles partenaires</div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6 text-center">
            <Mountain className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-3xl font-bold">405</div>
            <div className="text-sm text-muted-foreground">Hectares cultivés</div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6 text-center">
            <Leaf className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
            <div className="text-3xl font-bold">9</div>
            <div className="text-sm text-muted-foreground">Espèces endémiques</div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-amber-500" />
            <div className="text-3xl font-bold">6</div>
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
                Nos matières premières proviennent de deux régions distinctes des Andes colombiennes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Carte stylisée SVG */}
              <div className="relative w-full h-[400px] bg-gradient-to-b from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-950/20 rounded-lg overflow-hidden mb-6">
                {/* Silhouette Colombie simplifiée */}
                <svg viewBox="0 0 400 500" className="w-full h-full">
                  {/* Fond de carte */}
                  <path 
                    d="M100,50 Q150,30 200,40 Q280,50 320,100 Q350,150 340,220 Q330,280 300,340 Q270,400 220,450 Q170,480 120,460 Q80,430 70,380 Q60,320 80,260 Q90,200 80,150 Q70,100 100,50 Z" 
                    fill="currentColor" 
                    className="text-green-200 dark:text-green-800/50"
                  />
                  
                  {/* Région Cali - Valle del Cauca */}
                  <circle cx="140" cy="280" r="25" className="fill-green-500 animate-pulse" />
                  <text x="140" y="285" textAnchor="middle" className="text-xs font-bold fill-white">Cali</text>
                  
                  {/* Région Armenia - Quindío */}
                  <circle cx="180" cy="230" r="25" className="fill-amber-500 animate-pulse" />
                  <text x="180" y="235" textAnchor="middle" className="text-xs font-bold fill-white">Armenia</text>
                  
                  {/* Lignes de connexion */}
                  <line x1="140" y1="280" x2="180" y2="230" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" className="text-primary/50" />
                  
                  {/* Bogotá (référence) */}
                  <circle cx="220" cy="180" r="8" className="fill-gray-400" />
                  <text x="235" y="185" className="text-xs fill-gray-500">Bogotá</text>
                  
                  {/* Océan Pacifique */}
                  <text x="50" y="300" className="text-xs fill-blue-400 opacity-50">Océan Pacifique</text>
                  
                  {/* Mer des Caraïbes */}
                  <text x="200" y="60" className="text-xs fill-blue-400 opacity-50">Mer des Caraïbes</text>
                </svg>
                
                {/* Légende */}
                <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Valle del Cauca (Cali)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm">Quindío (Armenia)</span>
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
                        <div className="text-sm font-medium mb-2">Molécules endémiques :</div>
                        <div className="flex flex-wrap gap-1">
                          {region.molecules.map((mol) => (
                            <Link key={mol} href={`/molecules?search=${encodeURIComponent(mol)}`}>
                              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-primary/10 hover:border-primary transition-colors">
                                {mol}
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mountain className="h-4 w-4" />
                        <span>Climat : {region.climate}</span>
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
            <Card key={fournisseur.id} className="card-hover overflow-hidden">
              <div className="md:flex">
                {/* Image placeholder */}
                <div className="md:w-1/3 h-48 md:h-auto bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 flex items-center justify-center">
                  <div className="text-center p-6">
                    <Coffee className="h-16 w-16 mx-auto text-green-600 dark:text-green-400 mb-2" />
                    <div className="text-sm font-medium text-green-700 dark:text-green-300">{fournisseur.region}</div>
                    <div className="text-xs text-muted-foreground">{fournisseur.department}</div>
                  </div>
                </div>
                
                {/* Contenu */}
                <div className="md:w-2/3 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{fournisseur.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{fournisseur.region}, {fournisseur.department}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-amber-700 dark:text-amber-300">{fournisseur.rating}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">{fournisseur.description}</p>

                  {/* Histoire */}
                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      Notre Histoire
                    </h4>
                    <p className="text-sm text-muted-foreground">{fournisseur.history}</p>
                  </div>

                  {/* Statistiques */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{fournisseur.stats.familles}</div>
                      <div className="text-xs text-muted-foreground">Familles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{fournisseur.stats.hectares}</div>
                      <div className="text-xs text-muted-foreground">Hectares</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-600">{fournisseur.stats.especes}</div>
                      <div className="text-xs text-muted-foreground">Espèces</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{fournisseur.stats.annees}</div>
                      <div className="text-xs text-muted-foreground">Années</div>
                    </div>
                  </div>

                  {/* Spécialités */}
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Spécialités :</div>
                    <div className="flex flex-wrap gap-1">
                      {fournisseur.specialties.map((spec) => (
                        <Link key={spec} href={`/molecules?search=${encodeURIComponent(spec)}`}>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 cursor-pointer hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors">
                            {spec}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Certifications :</div>
                    <div className="flex flex-wrap gap-2">
                      {fournisseur.certifications.map((cert) => (
                        <Badge key={cert} variant="outline" className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <a href={`mailto:${fournisseur.contact.email}`} className="flex items-center gap-1 text-primary hover:underline">
                      <Mail className="h-4 w-4" />
                      {fournisseur.contact.email}
                    </a>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {fournisseur.contact.phone}
                    </span>
                    <a href={`https://${fournisseur.contact.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                      <Globe className="h-4 w-4" />
                      {fournisseur.contact.website}
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Tab Engagement */}
        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Notre Engagement Éthique
              </CardTitle>
              <CardDescription>
                PERFUMUM s'engage pour un sourcing responsable et durable
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Principes */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="card-hover border-green-200 dark:border-green-800">
                  <CardContent className="pt-6 text-center">
                    <Leaf className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <h3 className="font-bold mb-2">Durabilité Environnementale</h3>
                    <p className="text-sm text-muted-foreground">
                      Nous privilégions les méthodes de culture biologique et les pratiques agroforestières qui préservent la biodiversité locale.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="card-hover border-amber-200 dark:border-amber-800">
                  <CardContent className="pt-6 text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-amber-500" />
                    <h3 className="font-bold mb-2">Commerce Équitable</h3>
                    <p className="text-sm text-muted-foreground">
                      Nos partenaires reçoivent une rémunération juste, permettant d'améliorer les conditions de vie des communautés locales.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="card-hover border-blue-200 dark:border-blue-800">
                  <CardContent className="pt-6 text-center">
                    <Truck className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                    <h3 className="font-bold mb-2">Traçabilité Complète</h3>
                    <p className="text-sm text-muted-foreground">
                      Chaque matière première est tracée depuis le champ jusqu'à notre laboratoire, garantissant authenticité et qualité.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Chiffres clés */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4 text-center">Impact Social & Environnemental</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-green-600">100%</div>
                    <div className="text-sm text-muted-foreground">Matières certifiées bio</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-amber-600">200+</div>
                    <div className="text-sm text-muted-foreground">Personnes impactées</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-muted-foreground">Déforestation</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600">15%</div>
                    <div className="text-sm text-muted-foreground">Prime équitable</div>
                  </div>
                </div>
              </div>

              {/* Témoignage */}
              <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                "Travailler avec PERFUMUM nous a permis de valoriser nos savoirs ancestraux tout en développant des pratiques durables. Nos enfants peuvent maintenant envisager un avenir sur ces terres."
                <footer className="mt-2 text-sm font-medium text-foreground">
                  — Maria Elena Restrepo, Finca Aromática Armenia
                </footer>
              </blockquote>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lien retour */}
      <div className="flex justify-center pt-4">
        <Link href="/colombie">
          <Button variant="outline" className="btn-enhanced">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la Gamme Colombie
          </Button>
        </Link>
      </div>
    </div>
  );
}
