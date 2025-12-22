import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { VoirAussi } from "@/components/VoirAussi";
import { MapPin, Building2, Beaker, Star, ExternalLink, ArrowLeft, History, Flower2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const fournisseurs = [
  { id: 1, name: "Symrise Colombia", type: "Industrie", specialty: "Huiles essentielles tropicales", description: "Filiale colombienne du groupe allemand, spécialisée dans les matières premières tropicales.", products: ["Café Colombien", "Cacao", "Fruits tropicaux"], website: "https://symrise.com", location: "Bogotá", priceRange: "€€€", rating: 5 },
  { id: 2, name: "Ecoflora", type: "Bio & Durable", specialty: "Ingrédients naturels durables", description: "Entreprise colombienne spécialisée dans les colorants et extraits naturels durables.", products: ["Bija", "Achiote", "Extraits botaniques"], website: "https://ecoflora.com", location: "Medellín", priceRange: "€€", rating: 4 }
];

const moleculesEmblematiques = [
  { name: "Caféine", source: "Café Colombien", note: "Amère, stimulante" },
  { name: "Furfuryl mercaptan", source: "Café torréfié", note: "Café, grillée" },
  { name: "Théobromine", source: "Cacao", note: "Chocolatée, amère" },
  { name: "Pyrazines", source: "Cacao", note: "Grillée, noisettée" },
  { name: "Limonène", source: "Agrumes tropicaux", note: "Citronnée, fraîche" },
  { name: "Myrcène", source: "Fruits tropicaux", note: "Herbacée, terreuse" },
  { name: "Bixine", source: "Achiote", note: "Terreuse, épicée" },
  { name: "Norbixine", source: "Bija", note: "Terreuse, chaude" }
];

const regionsProduction = [
  { name: "Eje Cafetero", description: "Triangle du café", specialties: ["Café Arabica", "Café de spécialité"], icon: "☕" },
  { name: "Antioquia", description: "Production de cacao fin", specialties: ["Cacao Criollo", "Chocolat"], icon: "🍫" },
  { name: "Amazonie", description: "Biodiversité unique", specialties: ["Copaïba", "Bois tropicaux"], icon: "🌴" }
];

export default function SourcingColombie() {
  return (
    <div className="container py-8">
      <Breadcrumbs customItems={[{ label: "Sourcing", path: "/sourcing" }, { label: "Colombie" }]} />
      <Link href="/sourcing"><Button variant="ghost" size="sm" className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" />Retour</Button></Link>
      <div className="flex items-center gap-4 mb-8"><span className="text-6xl">🇨🇴</span><div><h1 className="text-3xl font-bold">Colombie</h1><p className="text-muted-foreground">Biodiversité et café d'exception</p></div></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center"><CardContent className="pt-6"><div className="text-2xl font-bold text-yellow-600">{fournisseurs.length}</div><p className="text-sm text-muted-foreground">Fournisseurs</p></CardContent></Card>
        <Card className="text-center"><CardContent className="pt-6"><div className="text-2xl font-bold text-yellow-600">{moleculesEmblematiques.length}</div><p className="text-sm text-muted-foreground">Molécules</p></CardContent></Card>
        <Card className="text-center"><CardContent className="pt-6"><div className="text-2xl font-bold text-yellow-600">{regionsProduction.length}</div><p className="text-sm text-muted-foreground">Régions</p></CardContent></Card>
        <Card className="text-center"><CardContent className="pt-6"><div className="text-2xl font-bold text-yellow-600">3ème</div><p className="text-sm text-muted-foreground">Producteur café</p></CardContent></Card>
      </div>
      <Card className="mb-8"><CardHeader><CardTitle className="flex items-center gap-2"><History className="h-5 w-5" />Terre de Biodiversité</CardTitle></CardHeader><CardContent className="prose dark:prose-invert max-w-none"><p>La Colombie est le <strong>3ème producteur mondial de café</strong> et possède l'une des plus grandes biodiversités au monde.</p></CardContent></Card>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><MapPin className="h-6 w-6" />Régions de Production</h2>
      <div className="grid gap-4 md:grid-cols-3 mb-8">{regionsProduction.map((region) => (<Card key={region.name} className="card-hover"><CardHeader><div className="flex items-center gap-3"><span className="text-3xl">{region.icon}</span><CardTitle className="text-lg">{region.name}</CardTitle></div><CardDescription>{region.description}</CardDescription></CardHeader><CardContent><div className="flex flex-wrap gap-1">{region.specialties.map((s) => (<Badge key={s} variant="secondary" className="text-xs">{s}</Badge>))}</div></CardContent></Card>))}</div>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Building2 className="h-6 w-6" />Fournisseurs</h2>
      <div className="grid gap-6 md:grid-cols-2 mb-8">{fournisseurs.map((f) => (<Card key={f.id} className="card-hover"><CardHeader className="pb-3"><div className="flex items-start justify-between"><div><CardTitle className="text-lg">{f.name}</CardTitle><CardDescription className="flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" />{f.location}</CardDescription></div><div className="flex items-center gap-1 text-amber-500">{Array.from({ length: f.rating }).map((_, i) => (<Star key={i} className="h-4 w-4 fill-current" />))}</div></div></CardHeader><CardContent><Badge variant="outline" className="w-fit mb-3">{f.type}</Badge><p className="text-sm font-medium text-primary mb-2">{f.specialty}</p><p className="text-sm text-muted-foreground mb-4">{f.description}</p><div className="mb-4"><div className="flex flex-wrap gap-1">{f.products.map((p) => (<Badge key={p} variant="secondary" className="text-xs">{p}</Badge>))}</div></div><div className="flex items-center justify-between pt-3 border-t"><span className="text-sm font-medium">{f.priceRange}</span><a href={f.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">Site web <ExternalLink className="h-3 w-3" /></a></div></CardContent></Card>))}</div>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Beaker className="h-6 w-6" />Molécules Emblématiques</h2>
      <Card className="mb-8"><CardContent className="pt-6"><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">{moleculesEmblematiques.map((mol) => (<div key={mol.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"><Flower2 className="h-5 w-5 text-yellow-500 flex-shrink-0" /><div><p className="font-medium">{mol.name}</p><p className="text-xs text-muted-foreground">{mol.source} • {mol.note}</p></div></div>))}</div></CardContent></Card>
      <VoirAussi items={[{ title: "Sourcing Global", description: "Toutes les régions", href: "/sourcing", icon: <MapPin className="h-5 w-5" /> }, { title: "Fournisseurs", description: "Annuaire complet", href: "/fournisseurs", icon: <Building2 className="h-5 w-5" /> }]} />
    </div>
  );
}
