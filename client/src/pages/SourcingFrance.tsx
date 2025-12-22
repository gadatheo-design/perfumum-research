import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { VoirAussi } from "@/components/VoirAussi";
import { 
  MapPin, 
  Building2, 
  Beaker,
  Star,
  ExternalLink,
  ArrowLeft,
  History,
  Award,
  Flower2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const fournisseurs = [
  {
    id: 1,
    name: "Aromazone",
    type: "Accessible",
    specialty: "Huiles essentielles accessibles",
    description: "Boutique française proposant un large choix de matières premières à prix accessibles.",
    products: ["Lavande fine AOC", "Absolue de Rose", "Néroli", "Mimosa"],
    website: "https://www.aroma-zone.com",
    location: "Paris",
    priceRange: "€",
    rating: 3,
    certifications: ["Bio", "Ecocert"]
  },
  {
    id: 2,
    name: "Robertet",
    type: "Industrie",
    specialty: "Leader mondial des matières premières naturelles",
    description: "Maison grassoise fondée en 1850, spécialiste des absolues de Grasse.",
    products: ["Rose de Mai", "Jasmin de Grasse", "Tubéreuse", "Fleur d'Oranger"],
    website: "https://www.robertet.com",
    location: "Grasse",
    priceRange: "€€€€",
    rating: 5,
    certifications: ["ISO 9001", "UEBT"]
  },
  {
    id: 3,
    name: "Albert Vieille",
    type: "Naturels premium",
    specialty: "Huiles essentielles de Provence",
    description: "Producteur et distillateur provençal depuis 1920.",
    products: ["Lavande fine Haute-Provence", "Lavandin", "Sauge sclarée", "Thym"],
    website: "https://www.albertvieille.com",
    location: "Apt, Provence",
    priceRange: "€€€",
    rating: 5,
    certifications: ["AOC Lavande", "Bio"]
  }
];

const moleculesEmblematiques = [
  { name: "Linalol", source: "Lavande fine", note: "Florale, fraîche" },
  { name: "Acétate de linalyle", source: "Lavande", note: "Florale, herbacée" },
  { name: "Géraniol", source: "Rose de Mai", note: "Rosée, douce" },
  { name: "Citronellol", source: "Rose", note: "Rosée, citronnée" },
  { name: "Indole", source: "Jasmin de Grasse", note: "Animale, florale" },
  { name: "Jasmone", source: "Jasmin", note: "Florale, verte" },
  { name: "Nérol", source: "Néroli", note: "Florale, fraîche" },
  { name: "Limonène", source: "Agrumes", note: "Citronnée, fraîche" },
  { name: "Coumarine", source: "Foin", note: "Foin coupé, amandée" },
  { name: "Alpha-isomethyl ionone", source: "Iris", note: "Poudrée, violette" },
  { name: "Anisaldéhyde", source: "Mimosa", note: "Amandée, florale" },
  { name: "Méthyl anthranilate", source: "Fleur d'oranger", note: "Florale, fruitée" }
];

const regionsProduction = [
  { name: "Grasse", description: "Capitale mondiale de la parfumerie", specialties: ["Rose de Mai", "Jasmin", "Tubéreuse"], icon: "🌹" },
  { name: "Provence", description: "Terroir de la lavande", specialties: ["Lavande fine AOC", "Lavandin", "Thym"], icon: "💜" },
  { name: "Vallée de la Drôme", description: "Plantes médicinales", specialties: ["Lavande", "Sauge sclarée"], icon: "🌿" }
];

export default function SourcingFrance() {
  return (
    <div className="container py-8">
      <Breadcrumbs customItems={[{ label: "Sourcing", path: "/sourcing" }, { label: "France" }]} />
      <Link href="/sourcing"><Button variant="ghost" size="sm" className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" />Retour</Button></Link>
      <div className="flex items-center gap-4 mb-8">
        <span className="text-6xl">🇫🇷</span>
        <div>
          <h1 className="text-3xl font-bold">France</h1>
          <p className="text-muted-foreground">Grasse, capitale mondiale de la parfumerie</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center"><CardContent className="pt-6"><div className="text-2xl font-bold text-blue-600">{fournisseurs.length}</div><p className="text-sm text-muted-foreground">Fournisseurs</p></CardContent></Card>
        <Card className="text-center"><CardContent className="pt-6"><div className="text-2xl font-bold text-blue-600">{moleculesEmblematiques.length}</div><p className="text-sm text-muted-foreground">Molécules</p></CardContent></Card>
        <Card className="text-center"><CardContent className="pt-6"><div className="text-2xl font-bold text-blue-600">{regionsProduction.length}</div><p className="text-sm text-muted-foreground">Régions</p></CardContent></Card>
        <Card className="text-center"><CardContent className="pt-6"><div className="text-2xl font-bold text-blue-600">1850</div><p className="text-sm text-muted-foreground">Depuis</p></CardContent></Card>
      </div>

      <Card className="mb-8">
        <CardHeader><CardTitle className="flex items-center gap-2"><History className="h-5 w-5" />Histoire</CardTitle></CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>La France est le berceau de la parfumerie moderne. Depuis le XVIe siècle, <strong>Grasse</strong> s'est imposée comme la capitale mondiale de la parfumerie.</p>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><MapPin className="h-6 w-6" />Régions de Production</h2>
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {regionsProduction.map((region) => (
          <Card key={region.name} className="card-hover">
            <CardHeader><div className="flex items-center gap-3"><span className="text-3xl">{region.icon}</span><CardTitle className="text-lg">{region.name}</CardTitle></div><CardDescription>{region.description}</CardDescription></CardHeader>
            <CardContent><div className="flex flex-wrap gap-1">{region.specialties.map((s) => (<Badge key={s} variant="secondary" className="text-xs">{s}</Badge>))}</div></CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Building2 className="h-6 w-6" />Fournisseurs</h2>
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {fournisseurs.map((f) => (
          <Card key={f.id} className="card-hover">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between"><div><CardTitle className="text-lg">{f.name}</CardTitle><CardDescription className="flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" />{f.location}</CardDescription></div>
              <div className="flex items-center gap-1 text-amber-500">{Array.from({ length: f.rating }).map((_, i) => (<Star key={i} className="h-4 w-4 fill-current" />))}</div></div>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="w-fit mb-3">{f.type}</Badge>
              <p className="text-sm font-medium text-primary mb-2">{f.specialty}</p>
              <p className="text-sm text-muted-foreground mb-4">{f.description}</p>
              <div className="mb-4"><p className="text-xs font-medium text-muted-foreground mb-2">Produits :</p><div className="flex flex-wrap gap-1">{f.products.map((p) => (<Badge key={p} variant="secondary" className="text-xs">{p}</Badge>))}</div></div>
              <div className="mb-4"><p className="text-xs font-medium text-muted-foreground mb-2">Certifications :</p><div className="flex flex-wrap gap-1">{f.certifications.map((c) => (<Badge key={c} variant="outline" className="text-xs bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"><Award className="h-3 w-3 mr-1" />{c}</Badge>))}</div></div>
              <div className="flex items-center justify-between pt-3 border-t"><span className="text-sm font-medium">{f.priceRange}</span><a href={f.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">Site web <ExternalLink className="h-3 w-3" /></a></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Beaker className="h-6 w-6" />Molécules Emblématiques</h2>
      <Card className="mb-8"><CardContent className="pt-6"><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{moleculesEmblematiques.map((mol) => (<div key={mol.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"><Flower2 className="h-5 w-5 text-blue-500 flex-shrink-0" /><div><p className="font-medium">{mol.name}</p><p className="text-xs text-muted-foreground">{mol.source} • {mol.note}</p></div></div>))}</div></CardContent></Card>

      <VoirAussi items={[{ title: "Sourcing Global", description: "Toutes les régions", href: "/sourcing", icon: <MapPin className="h-5 w-5" /> }, { title: "Fournisseurs", description: "Annuaire complet", href: "/fournisseurs", icon: <Building2 className="h-5 w-5" /> }, { title: "Molécules", description: "Base de données", href: "/molecules", icon: <Beaker className="h-5 w-5" /> }]} />
    </div>
  );
}
