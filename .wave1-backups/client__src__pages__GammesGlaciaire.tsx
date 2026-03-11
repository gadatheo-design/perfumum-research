// @ts-nocheck
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Snowflake, Wind, Mountain, Droplets } from "lucide-react";
import { GammesConnexes } from "@/components/GammesConnexes";
import { Link } from "wouter";
import { GammeBadge } from "@/components/GammeBadge";
import { VoirAussi } from "@/components/VoirAussi";
import { AtmosphericTexture } from "@/components/AtmosphericTexture";

export default function GammesGlaciaire() {
  const accords = [
    {
      name: "Glaciaire Ozone Pur",
      subtitle: "Air froid + ozone + altitude + neige",
      formula: "Menthe Poivrée 0.15% • Eucalyptus 0.12% • Juniper 0.10% • Makrut 0.08% • Ambergris 0.03%",
      variations: ["Ozone-Intense (+Eucalyptus 0.05)", "Ozone-Doux (Menthe 0.10)"],
      usage: "Résines fraîches, hash menthol, CBD froid",
      effect: "Air glacé, ozone pur, altitude extrême",
    },
    {
      name: "Glaciaire Menthe Givrée",
      subtitle: "Menthe cristallisée + gel + fraîcheur vive",
      formula: "Menthe Poivrée 0.20% • Menthe Verte 0.10% • Eucalyptus 0.08% • Juniper 0.06% • Ambergris 0.02%",
      variations: ["Givrée-Fort (+Menthe Poivrée 0.05)", "Givrée-Léger (Menthe Verte 0.08)"],
      usage: "Hash menthol, résines CBD fraîches",
      effect: "Menthe cristallisée, gel sur feuille, fraîcheur intense",
    },
    {
      name: "Glaciaire Montagne Froide",
      subtitle: "Roche froide + vent + neige + pin",
      formula: "Juniper 0.15% • Pin Sylvestre 0.10% • Eucalyptus 0.08% • Menthe 0.06% • Ambergris 0.03%",
      variations: ["Montagne-Haute (+Juniper 0.05)", "Montagne-Basse (Pin 0.08)"],
      usage: "Résines alpines, hash de montagne",
      effect: "Roche froide, vent de montagne, neige sur pin",
    },
    {
      name: "Glaciaire Eau Glacée",
      subtitle: "Eau pure + glace + minéral froid",
      formula: "Makrut 0.12% • Menthe 0.10% • Eucalyptus 0.08% • Juniper 0.06% • Ambergris 0.02%",
      variations: ["Eau-Pure (+Makrut 0.05)", "Eau-Minérale (+Juniper 0.04)"],
      usage: "Ice-O-Lator, résines filtrées à froid",
      effect: "Eau glacée pure, minéral froid, glace fondante",
    },
  ];

  const radicaux = [
    {
      name: "Glaciaire Absolu Zéro",
      subtitle: "Froid extrême, cristaux de glace, air figé",
      formula: "Menthe Poivrée 0.25 • Eucalyptus 0.15 • Juniper 0.12 • Makrut 0.08 • Ambergris 0.03",
      effect: "Température sous zéro, air cristallisé, silence glacé",
      usage: "Installation immersive froid extrême, performance cryogénique",
    },
    {
      name: "Glaciaire Souffle Polaire",
      subtitle: "Vent polaire, neige soufflée, horizon blanc",
      formula: "Eucalyptus 0.18 • Menthe 0.12 • Juniper 0.10 • Pin Sylvestre 0.08 • Ambergris 0.02",
      effect: "Vent glacé du pôle, neige en suspension, blancheur totale",
      usage: "Installation espace polaire, recherche sur le vide blanc",
    },
    {
      name: "Glaciaire Crevasse Profonde",
      subtitle: "Glace bleue, profondeur, silence minéral",
      formula: "Juniper 0.15 • Makrut 0.12 • Eucalyptus 0.10 • Menthe 0.08 • Ambergris 0.03",
      effect: "Glace bleue millénaire, profondeur glaciaire, minéral froid",
      usage: "Installation immersive profondeur, sculpture olfactive glace",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col theme-glaciaire">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1 relative">
        <AtmosphericTexture type="glaciaire" />
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-cyan-50/50 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Link href="/gammes" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
                  ← Retour aux Gammes
                </Link>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-lg bg-cyan-50 flex items-center justify-center">
                  <Snowflake className="h-8 w-8 text-cyan-600" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                    Glaciaire
                  </h1>
                  <p className="text-xl text-muted-foreground mt-2">
                    Fraîcheur, ozone et altitude
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mb-6">
                <GammeBadge gamme="glaciaire" size="md" />
<Badge variant="secondary">7 variations</Badge>
                <Badge variant="outline" className="bg-cyan-50">12 molécules clés</Badge>
                <Badge variant="outline">Recherche 2023-2025</Badge>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                La gamme <strong>Glaciaire</strong> explore les territoires olfactifs du froid extrême, de l'altitude et de la pureté minérale. Inspirée des paysages polaires, des sommets enneigés et des crevasses glaciaires, cette gamme articule fraîcheur mentholée, ozone pur et minéralité froide. PERFUMUM développe <strong>7 variations</strong> qui interrogent les sensations de gel, de vent glacé et de silence blanc.
              </p>
            </div>
          </div>
        </section>

        {/* Accords Maîtres */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">
                4 Accords Maîtres
              </h2>
              <p className="text-muted-foreground mb-12 max-w-3xl">
                Les accords maîtres de la gamme Glaciaire explorent quatre axes : <strong>ozone pur</strong>, <strong>menthe givrée</strong>, <strong>montagne froide</strong> et <strong>eau glacée</strong>. Chaque accord possède des variations pour affiner l'intensité et la texture de la fraîcheur.
              </p>
              
              <div className="grid grid-cols-1 gap-6">
                {accords.map((accord, index) => (
                  <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-2">{accord.name}</CardTitle>
                          <CardDescription className="text-base italic">
                            {accord.subtitle}
                          </CardDescription>
                        </div>
                        <Snowflake className="h-6 w-6 text-cyan-600 shrink-0" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Formule</p>
                        <code className="text-sm bg-muted px-3 py-2 rounded block">
                          {accord.formula}
                        </code>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Variations</p>
                        <div className="flex flex-wrap gap-2">
                          {accord.variations.map((variation, i) => (
                            <Badge key={i} variant="outline">{variation}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Usage</p>
                        <p className="text-sm">{accord.usage}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Effet</p>
                        <p className="text-sm italic">{accord.effect}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Radicaux */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">
                3 Radicaux Expérimentaux
              </h2>
              <p className="text-muted-foreground mb-12 max-w-3xl">
                Les radicaux Glaciaire poussent la fraîcheur vers des <strong>territoires extrêmes</strong> : absolu zéro, souffle polaire, crevasse profonde. Ces compositions ne sont pas destinées à un usage quotidien mais à des installations immersives, performances artistiques ou recherches phénoménologiques sur le froid.
              </p>
              
              <div className="grid grid-cols-1 gap-6">
                {radicaux.map((radical, index) => (
                  <Card key={index} className="shadow-sm hover:shadow-md transition-shadow border-cyan-200">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-2">{radical.name}</CardTitle>
                          <CardDescription className="text-base italic">
                            {radical.subtitle}
                          </CardDescription>
                        </div>
                        <Mountain className="h-6 w-6 text-cyan-600 shrink-0" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Formule</p>
                        <code className="text-sm bg-muted px-3 py-2 rounded block">
                          {radical.formula}
                        </code>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Effet</p>
                        <p className="text-sm italic">{radical.effect}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Usage</p>
                        <p className="text-sm">{radical.usage}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <GammesConnexes 
          currentGamme="glaciaire" 
          relatedGammes={["petrichor", "biolab"]} 
        />

        {/* Molécules Clés */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">12 Molécules Clés</h2>
              <p className="text-muted-foreground mb-8">
                La gamme Glaciaire s'appuie sur des molécules à forte fraîcheur et des notes ozonées pour créer ses accords.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Menthe Poivrée", role: "Fraîcheur intense", color: "bg-cyan-100" },
                  { name: "Menthe Verte", role: "Fraîcheur douce", color: "bg-green-100" },
                  { name: "Eucalyptus", role: "Ozone camphre", color: "bg-teal-100" },
                  { name: "Juniper", role: "Minéral froid", color: "bg-slate-100" },
                  { name: "Pin Sylvestre", role: "Conifère alpin", color: "bg-emerald-100" },
                  { name: "Makrut", role: "Citrus froid", color: "bg-lime-100" },
                  { name: "Ambergris", role: "Fixateur minéral", color: "bg-gray-100" },
                  { name: "Calone", role: "Ozone marin", color: "bg-blue-100" },
                  { name: "Iso E Super", role: "Bois froid", color: "bg-amber-100" },
                  { name: "Hedione", role: "Floral transparent", color: "bg-pink-100" },
                  { name: "Dihydromyrcénol", role: "Fraîcheur métallique", color: "bg-zinc-100" },
                  { name: "Ambroxan", role: "Ambre froid", color: "bg-orange-100" },
                ].map((mol, i) => (
                  <div key={i} className={`p-4 rounded-lg ${mol.color}`}>
                    <p className="font-medium text-sm">{mol.name}</p>
                    <p className="text-xs text-muted-foreground">{mol.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Méthodologie */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Méthodologie</h2>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wind className="h-5 w-5" />
                      Fraîcheur Structurée
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      La gamme Glaciaire utilise des molécules mentholées (menthe poivrée, eucalyptus) combinées à des notes ozones (juniper, makrut) pour créer une sensation de froid structuré. La fraîcheur n'est pas simplement ajoutée mais <strong>construite en couches</strong> : base minérale froide, cœur menthol, tête ozone.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Droplets className="h-5 w-5" />
                      Minéralité Froide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      L'ambergris et le juniper apportent une <strong>minéralité froide</strong> qui ancre la fraîcheur dans une texture rocheuse. Cette approche évite la fraîcheur "cosmétique" pour privilégier une sensation de froid naturel, presque géologique.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mountain className="h-5 w-5" />
                      Altitude et Silence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Les radicaux Glaciaire explorent la notion d'<strong>altitude olfactive</strong> : comment traduire la raréfaction de l'air, le silence blanc, la suspension du temps dans le froid extrême ? Ces compositions utilisent des dosages minimaux pour créer une sensation de vide habité.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        {/* Voir aussi */}
        <VoirAussi 
          items={[
            { title: "Gamme Pétrichor", description: "Terre humide et minéral", href: "/gammes/petrichor", badge: "60 variations" },
            { title: "Gamme BioLab", description: "Biotechnologie olfactive", href: "/gammes/biolab", badge: "En développement" },
            { title: "Protocoles maturation", description: "Temps de cure pour résines fraîches", href: "/protocoles-maturation" },
            { title: "Toutes les molécules", description: "Base de données complète", href: "/molecules", badge: "176" },
          ]} 
        />
      </main>
      <Footer />
    </div>
  );
}
