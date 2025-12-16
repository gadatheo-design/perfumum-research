import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Thermometer, FlaskConical, LineChart, Download } from "lucide-react";
import { Link } from "wouter";
import { exportMethodologyPDF } from "@/lib/pdfExport";

export default function Pyrolyse() {
  const handleExportPDF = () => {
    exportMethodologyPDF("pyrolyse");
  };

  const protocoles = [
    {
      temperature: "120°C",
      duree: "30 min",
      description: "Pyrolyse douce. Libération des composés volatils légers (terpènes, aldéhydes). Préserve les notes fraîches et vertes.",
      molecules: ["α-Pinène", "Limonène", "Linalool", "Hexanal"],
      applications: "Résines fraîches, bois vert, herbes aromatiques",
      color: "from-green-500/20 to-yellow-500/20",
      borderColor: "border-l-green-600"
    },
    {
      temperature: "160°C",
      duree: "45 min",
      description: "Pyrolyse modérée. Dégradation partielle des structures organiques. Apparition de notes boisées, résineuses, légèrement fumées.",
      molecules: ["Guaiacol", "Vétiver", "Cade", "Eugénol"],
      applications: "Bois sec, résines chauffées, épices",
      color: "from-amber-500/20 to-orange-500/20",
      borderColor: "border-l-amber-600"
    },
    {
      temperature: "200°C",
      duree: "60 min",
      description: "Pyrolyse intense. Carbonisation partielle. Libération de composés phénoliques et fumés. Notes de cendres, bitume, goudron.",
      molecules: ["Birch Tar", "Cade", "Styrax", "Phénol"],
      applications: "Fumées volcaniques, bitume brûlé, cendres",
      color: "from-gray-700/20 to-stone-900/20",
      borderColor: "border-l-gray-800"
    }
  ];

  const gcmsResults = [
    { molecule: "α-Pinène", "120C": "18.2%", "160C": "8.5%", "200C": "2.1%", famille: "Terpène" },
    { molecule: "Limonène", "120C": "12.4%", "160C": "5.3%", "200C": "1.2%", famille: "Terpène" },
    { molecule: "Linalool", "120C": "9.1%", "160C": "4.7%", "200C": "0.8%", famille: "Alcool" },
    { molecule: "Guaiacol", "120C": "2.3%", "160C": "14.6%", "200C": "22.1%", famille: "Phénol" },
    { molecule: "Vétiver", "120C": "1.8%", "160C": "11.2%", "200C": "15.4%", famille: "Sesquiterpène" },
    { molecule: "Cade", "120C": "0.4%", "160C": "8.9%", "200C": "18.7%", famille: "Phénol" },
    { molecule: "Birch Tar", "120C": "0.1%", "160C": "3.2%", "200C": "12.3%", famille: "Goudron" },
    { molecule: "Phénol", "120C": "0.2%", "160C": "2.1%", "200C": "9.8%", famille: "Phénol" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-orange-50/30 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Link href="/methode">
                <a className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
                  ← Retour à la Méthode ABSORBE
                </a>
              </Link>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Flame className="h-8 w-8 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                    Pyrolyse Contrôlée
                  </h1>
                  <p className="text-xl text-muted-foreground mt-2">
                    Protocoles & Analyse GC-MS
                  </p>
                </div>
              </div>
              <div className="flex gap-4 mb-6 items-center">
                <div className="flex gap-2">
                  <Badge variant="secondary">3 températures</Badge>
                  <Badge variant="outline">Protocole ABSORBE</Badge>
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
                  La <strong>pyrolyse contrôlée</strong> est une méthode de dégradation thermique des matières organiques en absence d'oxygène. 
                  Elle permet d'extraire et d'analyser les composés volatils libérés à différentes températures.
                </p>
                <p className="text-base text-muted-foreground leading-relaxed mt-4">
                  ABSORBE utilise 3 protocoles de pyrolyse (120°C, 160°C, 200°C) pour explorer les profils olfactifs des matériaux naturels 
                  (bois, résines, plantes) et synthétiser des atmosphères fumées, volcaniques, et terrestres.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Protocoles */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <Thermometer className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold">
                  Trois Protocoles de Température
                </h2>
              </div>
              
              <div className="grid grid-cols-1 gap-8">
                {protocoles.map((protocole, index) => (
                  <Card key={index} className={`shadow-sm hover:shadow-md transition-shadow border-l-4 ${protocole.borderColor} bg-gradient-to-br ${protocole.color}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="font-mono text-sm px-3 py-1">
                              {protocole.temperature}
                            </Badge>
                            <CardTitle className="text-2xl">
                              Pyrolyse {protocole.temperature === "120°C" ? "Douce" : protocole.temperature === "160°C" ? "Modérée" : "Intense"}
                            </CardTitle>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Durée : {protocole.duree}
                          </p>
                        </div>
                        <Flame className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                          Description
                        </h4>
                        <p className="text-base text-foreground leading-relaxed">
                          {protocole.description}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                          Molécules Libérées
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {protocole.molecules.map((mol, i) => (
                            <Badge key={i} variant="secondary" className="text-xs font-mono">
                              {mol}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                          Applications
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {protocole.applications}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Résultats GC-MS */}
        <section className="py-16 bg-muted/20">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <LineChart className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold">
                  Résultats GC-MS
                </h2>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Profils de Dégradation Thermique</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Pourcentages d'abondance relative des molécules-clés selon la température de pyrolyse
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold">Molécule</th>
                          <th className="text-left py-3 px-4 font-semibold">Famille</th>
                          <th className="text-center py-3 px-4 font-semibold">120°C</th>
                          <th className="text-center py-3 px-4 font-semibold">160°C</th>
                          <th className="text-center py-3 px-4 font-semibold">200°C</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gcmsResults.map((row, index) => (
                          <tr key={index} className="border-b hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4 font-mono text-xs">{row.molecule}</td>
                            <td className="py-3 px-4 text-muted-foreground">{row.famille}</td>
                            <td className="py-3 px-4 text-center font-mono">{row["120C"]}</td>
                            <td className="py-3 px-4 text-center font-mono">{row["160C"]}</td>
                            <td className="py-3 px-4 text-center font-mono">{row["200C"]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2">Observations</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Les <strong>terpènes</strong> (α-Pinène, Limonène) dominent à 120°C puis diminuent drastiquement</li>
                      <li>Les <strong>phénols</strong> (Guaiacol, Cade) apparaissent à 160°C et culminent à 200°C</li>
                      <li>Le <strong>Birch Tar</strong> n'est significatif qu'à partir de 200°C (pyrolyse intense)</li>
                      <li>La transition 120°C → 200°C transforme un profil <em>frais/vert</em> en profil <em>fumé/carbonisé</em></li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Équipement */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <FlaskConical className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold">
                  Équipement & Protocole
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Matériel</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>• Four à pyrolyse contrôlée (Nabertherm)</p>
                    <p>• Tubes en verre borosilicaté (Ø 10mm)</p>
                    <p>• Système de captation sur Tenax TA</p>
                    <p>• GC-MS Agilent 7890B / 5977B</p>
                    <p>• Colonne DB-5MS (30m × 0.25mm)</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Procédure</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>1. Prélèvement échantillon (50-100mg)</p>
                    <p>2. Placement en tube sous flux N₂</p>
                    <p>3. Montée en température (5°C/min)</p>
                    <p>4. Maintien isotherme (30-60min)</p>
                    <p>5. Captation volatils sur Tenax TA</p>
                    <p>6. Désorption thermique + analyse GC-MS</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/20">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">
                Méthode ABSORBE Complète
              </h2>
              <p className="text-muted-foreground mb-6">
                La pyrolyse est l'un des 7 axes de la méthode ABSORBE. Découvrez le protocole complet de recherche olfactive.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/methode">
                  <a className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                    Méthode ABSORBE →
                  </a>
                </Link>
                <Link href="/methodologie/gc-ms">
                  <a className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    Analyse GC-MS →
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
