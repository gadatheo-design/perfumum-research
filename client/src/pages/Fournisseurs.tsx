import { useState } from "react";
import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { VoirAussi, VoirAussiItem } from "@/components/VoirAussi";
import { 
  Building2, 
  Globe, 
  Package, 
  FlaskConical, 
  Leaf, 
  Beaker,
  ExternalLink,
  Star,
  MapPin,
  Search,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Données des fournisseurs
const fournisseurs = [
  {
    id: 1,
    name: "Sigma-Aldrich / Merck",
    type: "Laboratoire",
    specialty: "Molécules pures haute pureté (>98%)",
    description: "Référence mondiale pour les molécules de synthèse et standards analytiques. Idéal pour dosages précis et recherche.",
    products: ["Indole", "Skatole", "Acides gras", "Esters", "Terpènes purs"],
    website: "https://www.sigmaaldrich.com",
    country: "Allemagne / USA",
    priceRange: "€€€",
    rating: 5,
    tags: ["Synthétique", "Haute pureté", "Recherche"]
  },
  {
    id: 2,
    name: "Hermitage Oils",
    type: "Naturels rares",
    specialty: "Huiles essentielles artisanales et matières premières rares",
    description: "Distillateur artisanal proposant des huiles essentielles de qualité exceptionnelle. Spécialiste des matières rares et vintage.",
    products: ["Mitti Attar", "Black Emerald Vetiver", "Oud Tea", "Palo Santo", "Frankincense Oman"],
    website: "https://hermitageoils.com",
    country: "USA",
    priceRange: "€€€",
    rating: 5,
    tags: ["Naturel", "Artisanal", "Rare"]
  },
  {
    id: 3,
    name: "Vigon International",
    type: "Arômes naturels",
    specialty: "Indole naturel et molécules aromatiques",
    description: "Fournisseur américain spécialisé dans les arômes naturels et synthétiques pour l'industrie alimentaire et parfumerie.",
    products: ["Indole naturel", "Skatole synthétique", "Esters fruités", "Lactones"],
    website: "https://www.vigon.com",
    country: "USA",
    priceRange: "€€",
    rating: 4,
    tags: ["Naturel", "Synthétique", "Arômes"]
  },
  {
    id: 4,
    name: "CreatingPerfume.com",
    type: "Parfumerie artisanale",
    specialty: "Petites quantités pour parfumeurs indépendants",
    description: "Boutique en ligne proposant un large catalogue de matières premières en petits conditionnements (5-50ml). Qualité constante.",
    products: ["Ambroxan", "Iso E Super", "Hedione", "Muscs", "Bois précieux"],
    website: "https://www.creatingperfume.com",
    country: "USA",
    priceRange: "€€",
    rating: 4,
    tags: ["Synthétique", "Petites quantités", "Artisanal"]
  },
  {
    id: 5,
    name: "Perfumers Apprentice",
    type: "Large catalogue",
    specialty: "Catalogue étendu pour débutants et professionnels",
    description: "Vaste sélection de matières premières à prix accessibles. Idéal pour l'expérimentation et les petits budgets.",
    products: ["Bases parfumées", "Muscs", "Bois", "Floraux", "Épices"],
    website: "https://shop.perfumersapprentice.com",
    country: "USA",
    priceRange: "€",
    rating: 4,
    tags: ["Accessible", "Large choix", "Débutant"]
  },
  {
    id: 6,
    name: "Pell Wall Perfumes",
    type: "UK professionnel",
    specialty: "Molécules rares et matières premières professionnelles",
    description: "Fournisseur britannique de référence pour les parfumeurs professionnels. Spécialiste des molécules rares et difficiles à trouver.",
    products: ["Molécules rares", "Absolues", "Résinoïdes", "Muscs captifs"],
    website: "https://pellwall.com",
    country: "Royaume-Uni",
    priceRange: "€€€",
    rating: 5,
    tags: ["Professionnel", "Rare", "UK"]
  },
  {
    id: 7,
    name: "Eden Botanicals",
    type: "Absolus & Bio",
    specialty: "Absolues, concrètes et huiles essentielles biologiques",
    description: "Spécialiste américain des matières premières naturelles de haute qualité. Large gamme d'absolues et concrètes.",
    products: ["Absolue Jasmin", "Absolue Tabac", "Mousse de Chêne", "Foin", "Vanille"],
    website: "https://www.edenbotanicals.com",
    country: "USA",
    priceRange: "€€€",
    rating: 5,
    tags: ["Naturel", "Bio", "Absolues"]
  },
  {
    id: 8,
    name: "Aromatics International",
    type: "Huiles essentielles",
    specialty: "Huiles essentielles thérapeutiques et aromathérapie",
    description: "Fournisseur d'huiles essentielles de qualité thérapeutique. Documentation complète et traçabilité.",
    products: ["Vétiver", "Encens", "Myrrhe", "Santal", "Patchouli"],
    website: "https://www.aromatics.com",
    country: "USA",
    priceRange: "€€",
    rating: 4,
    tags: ["Naturel", "Thérapeutique", "Traçabilité"]
  },
  {
    id: 9,
    name: "Firmenich",
    type: "Industrie",
    specialty: "Molécules captives et compositions professionnelles",
    description: "L'un des plus grands groupes de parfumerie au monde. Accès limité aux professionnels établis.",
    products: ["Ambroxan", "Hedione", "Molécules captives", "Bases"],
    website: "https://www.firmenich.com",
    country: "Suisse",
    priceRange: "€€€€",
    rating: 5,
    tags: ["Industrie", "Captif", "Professionnel"]
  },
  {
    id: 10,
    name: "Givaudan",
    type: "Industrie",
    specialty: "Leader mondial de la parfumerie fine",
    description: "Premier groupe mondial de création de parfums et arômes. Accès réservé aux professionnels.",
    products: ["Molécules exclusives", "Bases", "Accords", "Captifs"],
    website: "https://www.givaudan.com",
    country: "Suisse",
    priceRange: "€€€€",
    rating: 5,
    tags: ["Industrie", "Leader", "Exclusif"]
  },
  {
    id: 11,
    name: "Berjé",
    type: "Naturels premium",
    specialty: "Huiles essentielles et absolues premium",
    description: "Fournisseur américain de matières premières naturelles de haute qualité pour l'industrie de la parfumerie.",
    products: ["Absolues florales", "Huiles essentielles", "Résinoïdes", "Concrètes"],
    website: "https://www.bfrj.com",
    country: "USA",
    priceRange: "€€€",
    rating: 4,
    tags: ["Naturel", "Premium", "Industrie"]
  },
  {
    id: 12,
    name: "Aromazone",
    type: "Accessible",
    specialty: "Huiles essentielles et matières premières accessibles",
    description: "Boutique française proposant un large choix de matières premières à prix accessibles. Idéal pour débutants.",
    products: ["Huiles essentielles", "Absolues", "Cires", "Bases"],
    website: "https://www.aroma-zone.com",
    country: "France",
    priceRange: "€",
    rating: 3,
    tags: ["Accessible", "Débutant", "France"]
  }
];

// Types de fournisseurs pour le filtre
const typesFournisseurs = [
  "Tous",
  "Laboratoire",
  "Naturels rares",
  "Arômes naturels",
  "Parfumerie artisanale",
  "Large catalogue",
  "UK professionnel",
  "Absolus & Bio",
  "Huiles essentielles",
  "Industrie",
  "Naturels premium",
  "Accessible"
];

// Icône selon le type
function getTypeIcon(type: string) {
  switch (type) {
    case "Laboratoire":
      return <Beaker className="h-5 w-5" />;
    case "Naturels rares":
    case "Naturels premium":
    case "Absolus & Bio":
      return <Leaf className="h-5 w-5" />;
    case "Industrie":
      return <Building2 className="h-5 w-5" />;
    case "Huiles essentielles":
      return <FlaskConical className="h-5 w-5" />;
    default:
      return <Package className="h-5 w-5" />;
  }
}

// Couleur selon le type
function getTypeColor(type: string) {
  switch (type) {
    case "Laboratoire":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "Naturels rares":
    case "Naturels premium":
    case "Absolus & Bio":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "Industrie":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "Accessible":
    case "Large catalogue":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
}

export default function Fournisseurs() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Tous");

  // Filtrage
  const filteredFournisseurs = fournisseurs.filter((f) => {
    const matchSearch = 
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.specialty.toLowerCase().includes(search.toLowerCase()) ||
      f.products.some(p => p.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === "Tous" || f.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="container py-8">
      <Breadcrumbs />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Fournisseurs</h1>
        <p className="text-muted-foreground">
          Annuaire des fournisseurs de matières premières pour la parfumerie et les résines CBD.
          {" "}{fournisseurs.length} fournisseurs référencés.
        </p>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, spécialité ou produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {typesFournisseurs.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(search || typeFilter !== "Tous") && (
          <Button 
            variant="outline" 
            onClick={() => { setSearch(""); setTypeFilter("Tous"); }}
            className="btn-enhanced"
          >
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Résultats */}
      <p className="text-sm text-muted-foreground mb-4">
        {filteredFournisseurs.length} fournisseur{filteredFournisseurs.length > 1 ? "s" : ""} trouvé{filteredFournisseurs.length > 1 ? "s" : ""}
      </p>

      {/* Grille des fournisseurs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredFournisseurs.map((fournisseur) => (
          <Card key={fournisseur.id} className="card-hover flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(fournisseur.type)}`}>
                    {getTypeIcon(fournisseur.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{fournisseur.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {fournisseur.country}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: fournisseur.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <Badge variant="outline" className="w-fit mb-3">
                {fournisseur.type}
              </Badge>
              
              <p className="text-sm font-medium text-primary mb-2">
                {fournisseur.specialty}
              </p>
              
              <p className="text-sm text-muted-foreground mb-4 flex-1">
                {fournisseur.description}
              </p>

              {/* Produits */}
              <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">Produits phares :</p>
                <div className="flex flex-wrap gap-1">
                  {fournisseur.products.slice(0, 4).map((product) => (
                    <Badge key={product} variant="secondary" className="text-xs">
                      {product}
                    </Badge>
                  ))}
                  {fournisseur.products.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{fournisseur.products.length - 4}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {fournisseur.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-sm font-medium">{fournisseur.priceRange}</span>
                <a
                  href={fournisseur.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <Globe className="h-4 w-4" />
                  Site web
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Message si aucun résultat */}
      {filteredFournisseurs.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucun fournisseur trouvé</h3>
          <p className="text-muted-foreground">
            Essayez de modifier vos critères de recherche.
          </p>
        </div>
      )}

      {/* Section informative */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Guide de sélection</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <span className="text-green-600">€</span> Budget limité
              </h4>
              <p className="text-sm text-muted-foreground">
                Aromazone et Perfumers Apprentice offrent un excellent rapport qualité-prix pour débuter.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <span className="text-amber-600">€€</span> Qualité intermédiaire
              </h4>
              <p className="text-sm text-muted-foreground">
                CreatingPerfume et Vigon proposent des matières de qualité professionnelle en petits conditionnements.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <span className="text-purple-600">€€€</span> Premium
              </h4>
              <p className="text-sm text-muted-foreground">
                Hermitage Oils, Eden Botanicals et Pell Wall pour les matières rares et de haute qualité.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voir aussi */}
      <VoirAussi 
        title="Ressources connexes"
        variant="compact"
        items={[
          {
            title: "Résines CBD",
            description: "Programme de recherche principal",
            href: "/resines-cbd",
          },
          {
            title: "Protocoles maturation",
            description: "Temps de cure et conditions optimales",
            href: "/protocoles-maturation",
          },
          {
            title: "Molécules",
            description: "Base de données des 155 molécules",
            href: "/molecules",
            badge: "155",
          },
          {
            title: "Recettes",
            description: "150 recettes expérimentales",
            href: "/recettes",
            badge: "150",
          },
        ]}
      />
    </div>
  );
}
