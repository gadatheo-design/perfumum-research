import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { VoirAussi } from "@/components/VoirAussi";
import { MapPin, Building2, Beaker, Star, ExternalLink, ArrowLeft, History, Flower2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const fournisseurs = [
  { id: 1, name: "Hermitage Oils", type: "Naturels rares", specialty: "Attars traditionnels", description: "Distillateur artisanal proposant des attars authentiques.", products: ["Mitti Attar", "Shamama", "Hina", "Santal Mysore"], website: "https://hermitageoils.com", location: "Kannauj", priceRange: "€€€", rating: 5 },
  { id: 2, name: "Enfleurage", type: "Naturels premium", specialty: "Santal de Mysore", description: "Spécialiste des matières premières indiennes authentiques.", products: ["Santal Mysore", "Jasmin Sambac", "Champaca"], website: "https://enfleurage.com", location: "New York / Inde", priceRange: "€€€€", rating: 5 },
  { id: 3, name: "Kannauj Attar Co.", type: "Traditionnel", specialty: "Attars deg-bhapka", description: "Maison traditionnelle utilisant la méthode ancestrale.", products: ["Rose Attar", "Kewra", "Motia"], website: "#", location: "Kannauj", priceRange: "€€", rating: 4 },
  { id: 4, name: "Ultra International", type: "Industrie", specialty: "Huiles essentielles en gros", description: "Grand producteur indien pour l'industrie.", products: ["Vétiver", "Palmarosa", "Lemongrass"], website: "https://ultrainternational.com", location: "Delhi", priceRange: "€€", rating: 4 }
];

const moleculesEmblematiques = [
  { name: "Alpha-santalol", source: "Santal Mysore", note: "Boisée, crémeuse" },
  { name: "Beta-santalol", source: "Santal", note: "Boisée, lactée" },
  { name: "Benzyl acétate", source: "Jasmin Sambac", note: "Florale, fruitée" },
  { name: "Indole", source: "Jasmin", note: "Animale, narcotique" },
  { name: "Khusimol", source: "Vétiver", note: "Terreuse, fumée" },
  { name: "Vetiverol", source: "Vétiver", note: "Boisée, terreuse" },
  { name: "Linalol", source: "Champaca", note: "Florale, épicée" },
  { name: "Géraniol", source: "Palmarosa", note: "Rosée, herbacée" }
];

const regionsProduction = [
  { name: "Kannauj", description: "Capitale des attars depuis 400 ans", specialties: ["Attars", "Mitti", "Rose"], icon: "🏺" },
  { name: "Mysore", description: "Terroir du santal le plus précieux", specialties: ["Santal", "Jasmin"], icon: "🪵" },
  { name: "Tamil Nadu", description: "Production de jasmin sambac", specialties: ["Jasmin Sambac", "Tubéreuse"], icon: "🌸" }
];

export default function SourcingInde() {
  return (
    <div className="container py-8">
      <Breadcrumbs customItems={[{ label: "Sourcing", path: "/sourcing" }, { label: "Inde" }]} />
      <Link href="/sourcing"><Button variant="ghost" size="sm" className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" />Retour</Button></Link>
      <div className="flex items-center gap-4 mb-8"><span className="text-6xl">🇮🇳</span><div><h1 className="text-3xl font-bold">Inde</h1><p className="text-muted-foreground">Berceau des attars traditionnels</p></div></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center"><CardContent className="pt-6"><div className="text-2xl font-bold text-orange-600">{fournisseurs.length}</div><p className="text-sm text-muted-foreground">Fournisseurs</p></CardContent></Card>
        <Card className="text-center"><CardContent className="pt-6"><div className="text-2xl font-bold text-orange-600">{moleculesEmblematiques.length}</div><p className="text-sm text-muted-foreground">Molécules</p></CardContent></Card>
        <Card className="text-center"><CardContent className="pt-6"><div className="text-2xl font-bold text-orange-600">{regionsProduction.length}</div><p className="text-sm text-muted-foreground">Régions</p></CardContent></Card>
        <Card className="text-center"><CardContent className="pt-6"><div className="text-2xl font-bold text-orange-600">400+</div><p className="text-sm text-muted-foreground">Ans tradition</p></CardContent></Card>
      </div>
      <Card className="mb-8"><CardHeader><CardTitle className="flex items-center gap-2"><History className="h-5 w-5" />Histoire des Attars</CardTitle></CardHeader><CardContent className="prose dark:prose-invert max-w-none"><p>L'Inde est le berceau de la parfumerie traditionnelle avec les <strong>attars</strong>, parfums naturels distillés dans l'huile de santal selon la méthode ancestrale <em>deg-bhapka</em>.</p></CardContent></Card>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><MapPin className="h-6 w-6" />Régions de Production</h2>
      <div className="grid gap-4 md:grid-cols-3 mb-8">{regionsProduction.map((region) => (<Card key={region.name} className="card-hover"><CardHeader><div className="flex items-center gap-3"><span className="text-3xl">{region.icon}</span><CardTitle className="text-lg">{region.name}</CardTitle></div><CardDescription>{region.description}</CardDescription></CardHeader><CardContent><div className="flex flex-wrap gap-1">{region.specialties.map((s) => (<Badge key={s} variant="secondary" className="text-xs">{s}</Badge>))}</div></CardContent></Card>))}</div>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Building2 className="h-6 w-6" />Fournisseurs</h2>
      <div className="grid gap-6 md:grid-cols-2 mb-8">{fournisseurs.map((f) => (<Card key={f.id} className="card-hover"><CardHeader className="pb-3"><div className="flex items-start justify-between"><div><CardTitle className="text-lg">{f.name}</CardTitle><CardDescription className="flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" />{f.location}</CardDescription></div><div className="flex items-center gap-1 text-amber-500">{Array.from({ length: f.rating }).map((_, i) => (<Star key={i} className="h-4 w-4 fill-current" />))}</div></div></CardHeader><CardContent><Badge variant="outline" className="w-fit mb-3">{f.type}</Badge><p className="text-sm font-medium text-primary mb-2">{f.specialty}</p><p className="text-sm text-muted-foreground mb-4">{f.description}</p><div className="mb-4"><div className="flex flex-wrap gap-1">{f.products.map((p) => (<Badge key={p} variant="secondary" className="text-xs">{p}</Badge>))}</div></div><div className="flex items-center justify-between pt-3 border-t"><span className="text-sm font-medium">{f.priceRange}</span>{f.website !== "#" && <a href={f.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">Site web <ExternalLink className="h-3 w-3" /></a>}</div></CardContent></Card>))}</div>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Beaker className="h-6 w-6" />Molécules Emblématiques</h2>
      <Card className="mb-8"><CardContent className="pt-6"><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">{moleculesEmblematiques.map((mol) => (<div key={mol.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"><Flower2 className="h-5 w-5 text-orange-500 flex-shrink-0" /><div><p className="font-medium">{mol.name}</p><p className="text-xs text-muted-foreground">{mol.source} • {mol.note}</p></div></div>))}</div></CardContent></Card>
      <VoirAussi items={[{ title: "Sourcing Global", description: "Toutes les régions", href: "/sourcing", icon: <MapPin className="h-5 w-5" /> }, { title: "Fournisseurs", description: "Annuaire complet", href: "/fournisseurs", icon: <Building2 className="h-5 w-5" /> }]} />
    </div>
  );
}
