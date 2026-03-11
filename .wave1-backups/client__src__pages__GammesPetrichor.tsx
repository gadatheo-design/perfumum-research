// @ts-nocheck
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, Mountain, Building2, Ghost } from "lucide-react";
import { GammesConnexes } from "@/components/GammesConnexes";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { linkifyMoleculeNames } from "@/lib/linkifyMolecules";

export default function GammesPetrichor() {
  // Fetch all molecules to linkify names
  const { data: molecules } = trpc.molecules.list.useQuery();

  const axes = [
    {
      code: "P.1",
      name: "PÉTRICHOR SOUTERRAIN",
      icon: Mountain,
      atmosphere: "Humus. Racines. Terre noire gorgée d'eau. Profondeur tellurique.",
      notes: "géosmine, spikenard, vétiver humide, bois mouillé, angélique, mitti attar, patchouli terre, mousse chêne",
      imageUrl: "/petrichor-souterrain.webp",
      image: "sol fracturé, condensation basse, racines exposées",
      sensation: "profonde, lente, organique, enveloppante",
      color: "from-amber-900/20 to-stone-900/20",
      borderColor: "border-l-amber-700",
      molecules: "Géosmine (marqueur principal), Spikenard, Vétiver, Patchouli, Angélique racine",
      accords: "Terre humide + Bois mouillé + Racines",
    },
    {
      code: "P.2",
      name: "PÉTRICHOR URBAIN",
      icon: Building2,
      atmosphere: "Asphalte sous la pluie, pierre froide, tension électrique. Ozone métallique.",
      notes: "aldéhydes froids, ozone, bitume propre, pierre humide, encens froid, cèdre Atlas, calone",
      imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663081881090/H2pjHHJbH276XmnbNcJhCp/petrichor-urbain_76971875.webp",
      image: "bitume mouillé, halo bleu, reflets métalliques",
      sensation: "électrique, nette, rapide, minrale",
      color: "from-slate-500/20 to-blue-900/20",
      borderColor: "border-l-slate-600",
      molecules: "Calone (note ozone), Aldéhydes C10-C12, Encens, Cèdre Atlas, Galbanum",
      accords: "Ozone + Pierre humide + Métal froid",
    },
    {
      code: "P.3",
      name: "PÉTRICHOR FANTÔME",
      icon: Ghost,
      atmosphere: "Papier humide, poussière en suspension, silence après la pluie. Mémoire résiduelle.",
      notes: "violette poussière, encens éteint, pierre poreuse, iris poudre, héliotropine, muscs blancs",
      imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663081881090/H2pjHHJbH276XmnbNcJhCp/petrichor-fantome_33a572fd.webp",
      image: "mur poreux, lumière pâle, ombre diffuse",
      sensation: "spectrale, résiduelle, évanescente",
      color: "from-violet-300/20 to-gray-400/20",
      borderColor: "border-l-violet-400",
      molecules: "Ionones (violette), Iris, Héliotropine, Muscs blancs, Encens Oliban",
      accords: "Violette poudre + Papier ancien + Silence",
    },
    {
      code: "P.4",
      name: "PÉTRICHOR FORESTIER",
      icon: Droplets,
      atmosphere: "Forêt après l'orage. Feuilles mouillées, écorce gorgée, champignons.",
      notes: "cis-3-hexénol, feuille violette, mousse chêne, cèdre, pin humide, champignon, sous-bois",
      imageUrl: "/petrichor-forestier.webp",
      image: "sous-bois dense, vapeur montante, lumière filtrée",
      sensation: "vivante, fraîche, verte, humide",
      color: "from-green-800/20 to-emerald-900/20",
      borderColor: "border-l-green-700",
      molecules: "Cis-3-Hexénol (feuille coupée), Pin, Cèdre, Mousse chêne, Vétiver",
      accords: "Feuille mouillée + Écorce + Champignon",
    },
    {
      code: "P.5",
      name: "PÉTRICHOR MINÉRAL",
      icon: Mountain,
      atmosphere: "Pierre calcaire, craie mouillée, carrière après la pluie. Silence minéral.",
      notes: "pierre humide, craie, silex, encens froid, ambrox, cèdre Atlas, vétiver sec",
      imageUrl: "/petrichor-mineral.webp",
      image: "roche calcaire, gouttes suspendues, texture poreuse",
      sensation: "froide, dure, cristalline, austere",
      color: "from-gray-400/20 to-stone-600/20",
      borderColor: "border-l-gray-500",
      molecules: "Ambrox (note minérale), Encens, Cèdre Atlas, Vétiver, Galbanum",
      accords: "Pierre + Craie + Silex",
    },
    {
      code: "P.6",
      name: "PÉTRICHOR AQUATIQUE",
      icon: Droplets,
      atmosphere: "Rivière après l'orage. Galets mouillés, algues, eau trouble.",
      notes: "calone, algues, galets humides, cis-3-hexénol, vétiver eau, encens aquatique",
      imageUrl: "/petrichor-aquatique.webp",
      image: "rivière trouble, galets lisses, vapeur d'eau",
      sensation: "fluide, fraîche, mouvante, transparente",
      color: "from-cyan-400/20 to-blue-600/20",
      borderColor: "border-l-cyan-500",
      molecules: "Calone, Cis-3-Hexénol, Vétiver, Encens, Ambrox",
      accords: "Eau trouble + Galets + Algues",
    },
    {
      code: "P.7",
      name: "PÉTRICHOR NOCTURNE",
      icon: Ghost,
      atmosphere: "Nuit après la pluie. Silence humide, brume basse, lune voilée.",
      notes: "encens froid, vétiver nuit, muscs blancs, iris, violette, ambrox, mousse",
      imageUrl: "/petrichor-nocturne.webp",
      image: "brume nocturne, reflets lunaires, silence profond",
      sensation: "sombre, calme, enveloppante, mystérieuse",
      color: "from-indigo-900/20 to-slate-800/20",
      borderColor: "border-l-indigo-700",
      molecules: "Encens, Vétiver, Iris, Muscs blancs, Ambrox",
      accords: "Nuit + Brume + Silence",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col theme-petrichor">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-blue-50/30 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Link href="/gammes" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
                  ← Retour aux Gammes
                </Link>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Droplets className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                    PÉTRICHOR
                  </h1>
                  <p className="text-xl text-muted-foreground mt-2">
                    Étude atmosphérique — ABSORBE / Perfumeum
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mb-6">
                <Badge variant="secondary">7 sous-familles</Badge>
                <Badge variant="outline">Recherche 2020-2025</Badge>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-foreground leading-relaxed">
                  <strong>Pétrichor est l'odeur d'un monde qui change d'état.</strong>
                </p>
                <p className="text-base text-muted-foreground leading-relaxed mt-4">
                  C'est la rencontre entre la pluie, la matière et la mémoire : ce qui remonte du sol, ce qui s'échappe de la ville, ce qui demeure dans les murs.
                  Cette étude se compose de trois axes : <strong>Souterrain</strong>, <strong>Urbain</strong>, <strong>Fantôme</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trois Axes */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">
                Sept Sous-Familles Atmosphériques
              </h2>
              
              <div className="grid grid-cols-1 gap-8">
                {axes.map((axe, index) => {
                  const IconComponent = axe.icon;
                  return (
                    <Card key={index} className={`shadow-sm hover:shadow-md transition-shadow border-l-4 ${axe.borderColor} bg-gradient-to-br ${axe.color}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant="outline" className="font-mono text-xs">
                                {axe.code}
                              </Badge>
                              <CardTitle className="text-2xl uppercase tracking-wide">
                                {axe.name}
                              </CardTitle>
                            </div>
                          </div>
                          <IconComponent className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {axe.imageUrl && (
                          <div className="w-full h-64 rounded-lg overflow-hidden">
                            <img 
                              src={axe.imageUrl} 
                              alt={`${axe.name} - ${axe.atmosphere}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                            Atmosphère
                          </h4>
                          <p className="text-base text-foreground leading-relaxed">
                            {axe.atmosphere}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                            Notes
                          </h4>
                          <p className="text-sm font-mono text-muted-foreground leading-relaxed">
                            {linkifyMoleculeNames(axe.notes, molecules)}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                              Image
                            </h4>
                            <p className="text-sm text-muted-foreground italic">
                              {axe.image}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                              Sensation
                            </h4>
                            <p className="text-sm text-muted-foreground italic">
                              {axe.sensation}
                            </p>
                          </div>
                        </div>

                        {axe.molecules && (
                          <div>
                            <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                              Molécules Clés
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {axe.molecules}
                            </p>
                          </div>
                        )}

                        {axe.accords && (
                          <div>
                            <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                              Accords Principaux
                            </h4>
                            <p className="text-sm font-mono text-muted-foreground">
                              {axe.accords}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Structure Temporelle */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">
                Structure Temporelle
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="font-mono">1</Badge>
                  <p className="text-lg"><strong>Souterrain</strong> — profondeur</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="font-mono">2</Badge>
                  <p className="text-lg"><strong>Urbain</strong> — impact</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="font-mono">3</Badge>
                  <p className="text-lg"><strong>Fantôme</strong> — résidu</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Applications */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">
                Applications
              </h2>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="text-sm px-4 py-2">Accord olfactif</Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">Fumée</Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">Installation</Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">Objet atmosphérique</Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">Étude sensorielle</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Méthode ABSORBE */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">
                Méthodologie de Recherche
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Cette étude suit le protocole ABSORBE : captation d'air, documentation du lieu, évaluation sensorielle, pyrolyse, enregistrement sonore et visuel, rédaction de notes.
              </p>
              <Link href="/methode" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                  Découvrir la méthode ABSORBE →
                </Link>
            </div>
          </div>
        </section>

        {/* Gammes Connexes */}
        <section className="py-16 bg-muted/20">
          <div className="container">
            <GammesConnexes 
              currentGamme="petrichor"
              relatedGammes={["glaciaire", "volcanique", "biolab"]}
            />
          </div>
        </section>
      </main>
    <Footer />

    </div>
  );
}
