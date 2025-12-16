import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, LineChart, Thermometer, Target, Download } from "lucide-react";
import { Link } from "wouter";
import { exportMethodologyPDF } from "@/lib/pdfExport";

export default function GCMS() {
  const handleExportPDF = () => {
    exportMethodologyPDF("gcms");
  };

  const programmeTemperature = [
    { etape: "Initial", temperature: "40°C", duree: "2 min", rampe: "-" },
    { etape: "Rampe 1", temperature: "40°C → 150°C", duree: "-", rampe: "5°C/min" },
    { etape: "Rampe 2", temperature: "150°C → 280°C", duree: "-", rampe: "10°C/min" },
    { etape: "Isotherme", temperature: "280°C", duree: "5 min", rampe: "-" },
  ];

  const standardsInternes = [
    { nom: "n-Dodécane", concentration: "100 ppm", temps: "12.3 min", usage: "Terpènes légers" },
    { nom: "n-Hexadécane", concentration: "100 ppm", temps: "18.7 min", usage: "Sesquiterpènes" },
    { nom: "n-Eicosane", concentration: "100 ppm", temps: "24.1 min", usage: "Composés lourds" },
  ];

  const interpretationPics = [
    {
      zone: "0-10 min",
      famille: "Terpènes légers",
      exemples: "α-Pinène, Limonène, Linalool",
      caracteristiques: "Pics fins et intenses. Notes fraîches, vertes, citronnées."
    },
    {
      zone: "10-20 min",
      famille: "Sesquiterpènes & Phénols",
      exemples: "Vétiver, Guaiacol, Cade",
      caracteristiques: "Pics larges et complexes. Notes boisées, fumées, résineuses."
    },
    {
      zone: "20-30 min",
      famille: "Composés lourds",
      exemples: "Birch Tar, Styrax, Résines",
      caracteristiques: "Pics diffus. Notes de goudron, bitume, cendres."
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-blue-50/30 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Link href="/methode">
                <a className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
                  ← Retour à la Méthode ABSORBE
                </a>
              </Link>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-lg bg-blue-50 flex items-center justify-center">
                  <LineChart className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                    Chromatographie GC-MS
                  </h1>
                  <p className="text-xl text-muted-foreground mt-2">
                    Analyse & Quantification
                  </p>
                </div>
              </div>
              <div className="flex gap-4 mb-6 items-center">
                <div className="flex gap-2">
                  <Badge variant="secondary">Agilent 7890B / 5977B</Badge>
                  <Badge variant="outline">DB-5MS</Badge>
                </div>
                <button
                  onClick={handleExportPDF}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm"
                >
                  <Download className="w-4 h-4" />
                  Exporter PDF
                </button>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-foreground leading-relaxed">
                  La <strong>chromatographie en phase gazeuse couplée à la spectrométrie de masse (GC-MS)</strong> est la méthode analytique centrale d'ABSORBE. 
                  Elle permet d'identifier et de quantifier les molécules volatiles présentes dans l'air, les matériaux pyrolysés, et les échantillons terrain.
                </p>
                <p className="text-base text-muted-foreground leading-relaxed mt-4">
                  Le protocole ABSORBE utilise une colonne DB-5MS (30m × 0.25mm × 0.25μm) avec un programme de température optimisé pour séparer 
                  les terpènes légers, les sesquiterpènes, et les composés phénoliques lourds.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Protocole */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <FlaskConical className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold">
                  Protocole d'Analyse
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Équipement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold text-foreground">Chromatographe</p>
                      <p className="text-muted-foreground">Agilent 7890B GC System</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Spectromètre de masse</p>
                      <p className="text-muted-foreground">Agilent 5977B MSD (EI, 70 eV)</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Colonne</p>
                      <p className="text-muted-foreground">DB-5MS (30m × 0.25mm × 0.25μm)</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Gaz vecteur</p>
                      <p className="text-muted-foreground">Hélium (1.2 mL/min, flux constant)</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Injection</p>
                      <p className="text-muted-foreground">Split 1:10, 250°C, 1 μL</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres MS</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold text-foreground">Mode d'ionisation</p>
                      <p className="text-muted-foreground">Impact électronique (EI, 70 eV)</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Température source</p>
                      <p className="text-muted-foreground">230°C</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Température quadripôle</p>
                      <p className="text-muted-foreground">150°C</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Plage de masse</p>
                      <p className="text-muted-foreground">m/z 35-550</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Mode acquisition</p>
                      <p className="text-muted-foreground">Scan complet (3.2 scans/sec)</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Programme température */}
        <section className="py-16 bg-muted/20">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <Thermometer className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold">
                  Programme de Température
                </h2>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Profil Thermique du Four</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Optimisé pour la séparation des terpènes, sesquiterpènes, et composés phénoliques
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold">Étape</th>
                          <th className="text-left py-3 px-4 font-semibold">Température</th>
                          <th className="text-center py-3 px-4 font-semibold">Durée</th>
                          <th className="text-center py-3 px-4 font-semibold">Rampe</th>
                        </tr>
                      </thead>
                      <tbody>
                        {programmeTemperature.map((row, index) => (
                          <tr key={index} className="border-b hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4 font-medium">{row.etape}</td>
                            <td className="py-3 px-4 font-mono text-xs">{row.temperature}</td>
                            <td className="py-3 px-4 text-center">{row.duree}</td>
                            <td className="py-3 px-4 text-center">{row.rampe}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2">Durée totale d'analyse</h4>
                    <p className="text-sm text-muted-foreground">
                      <strong>~35 minutes</strong> par échantillon (incluant temps de refroidissement)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Standards internes */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <Target className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold">
                  Standards Internes & Quantification
                </h2>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Étalons de Quantification</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Alcanes linéaires utilisés pour la quantification absolue des molécules-cibles
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold">Standard Interne</th>
                          <th className="text-center py-3 px-4 font-semibold">Concentration</th>
                          <th className="text-center py-3 px-4 font-semibold">Temps de rétention</th>
                          <th className="text-left py-3 px-4 font-semibold">Usage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {standardsInternes.map((std, index) => (
                          <tr key={index} className="border-b hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4 font-mono text-xs">{std.nom}</td>
                            <td className="py-3 px-4 text-center font-mono">{std.concentration}</td>
                            <td className="py-3 px-4 text-center font-mono">{std.temps}</td>
                            <td className="py-3 px-4 text-muted-foreground">{std.usage}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-6 p-4 bg-muted/30 rounded-lg space-y-2">
                    <h4 className="text-sm font-semibold">Méthode de quantification</h4>
                    <p className="text-sm text-muted-foreground">
                      1. <strong>Ajout du standard interne</strong> : 100 ppm dans chaque échantillon avant analyse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      2. <strong>Calcul du facteur de réponse</strong> : Aire du pic analyte / Aire du pic standard
                    </p>
                    <p className="text-sm text-muted-foreground">
                      3. <strong>Quantification absolue</strong> : Concentration = (Facteur de réponse) × (Concentration standard)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Interprétation chromatogrammes */}
        <section className="py-16 bg-muted/20">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <LineChart className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold">
                  Interprétation des Chromatogrammes
                </h2>
              </div>
              
              <div className="space-y-6">
                {interpretationPics.map((zone, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{zone.famille}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            Zone temporelle : {zone.zone}
                          </p>
                        </div>
                        <Badge variant="outline" className="font-mono">
                          {zone.zone}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                          Exemples de molécules
                        </h4>
                        <p className="text-sm font-mono text-foreground">
                          {zone.exemples}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                          Caractéristiques des pics
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {zone.caracteristiques}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Identification des Molécules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-foreground mb-1">1. Temps de rétention</p>
                    <p className="text-muted-foreground">
                      Comparaison avec standards authentiques et indices de rétention (Kovats)
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">2. Spectre de masse</p>
                    <p className="text-muted-foreground">
                      Matching avec bibliothèques NIST, Wiley, Adams (Essential Oils 2007)
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">3. Critères de validation</p>
                    <p className="text-muted-foreground">
                      Similarité spectrale &gt;85%, écart temps de rétention &lt;0.5%, confirmation par co-injection
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">
                Méthode ABSORBE Complète
              </h2>
              <p className="text-muted-foreground mb-6">
                La GC-MS est l'outil analytique central d'ABSORBE. Découvrez comment elle s'intègre dans le protocole complet de recherche olfactive.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/methode">
                  <a className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                    Méthode ABSORBE →
                  </a>
                </Link>
                <Link href="/methodologie/pyrolyse">
                  <a className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    Pyrolyse contrôlée →
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    <Footer />

    </div>
  );
}
