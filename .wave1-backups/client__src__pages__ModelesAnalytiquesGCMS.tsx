// @ts-nocheck
import { Link } from "wouter";
import { TestTube, ChevronRight, AlertCircle, Beaker, LineChart as LineChartIcon, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResponsiveTable } from "@/components/ui/responsive-table";

export function ModelesAnalytiquesGCMS() {
  // Spectres de référence monoterpènes
  const monoterpenes = [
    { molecule: "α-Pinène", tr: "8.2", ionBase: "93", ionsCarac: "77, 91, 121, 136", purete: "≥ 98" },
    { molecule: "β-Pinène", tr: "9.1", ionBase: "93", ionsCarac: "69, 79, 121, 136", purete: "≥ 97" },
    { molecule: "Myrcène", tr: "9.8", ionBase: "93", ionsCarac: "69, 77, 107, 136", purete: "≥ 95" },
    { molecule: "Limonène", tr: "10.5", ionBase: "68", ionsCarac: "93, 107, 121, 136", purete: "≥ 97" },
    { molecule: "γ-Terpinène", tr: "11.2", ionBase: "93", ionsCarac: "77, 91, 121, 136", purete: "≥ 96" },
    { molecule: "Terpinolène", tr: "12.1", ionBase: "121", ionsCarac: "93, 105, 136", purete: "≥ 95" },
    { molecule: "Linalool", tr: "13.5", ionBase: "71", ionsCarac: "93, 121, 139, 154", purete: "≥ 97" },
    { molecule: "α-Terpinéol", tr: "15.8", ionBase: "59", ionsCarac: "93, 121, 136, 154", purete: "≥ 96" },
  ];

  // Spectres de référence sesquiterpènes
  const sesquiterpenes = [
    { molecule: "β-Caryophyllène", tr: "22.3", ionBase: "93", ionsCarac: "133, 161, 189, 204", purete: "≥ 98" },
    { molecule: "Humulène", tr: "23.1", ionBase: "93", ionsCarac: "121, 147, 189, 204", purete: "≥ 96" },
    { molecule: "Caryophyllène oxide", tr: "24.8", ionBase: "79", ionsCarac: "93, 121, 161, 220", purete: "≥ 95" },
  ];

  // Profils chromatographiques tabacs
  const burleyProfile = [
    { tr: "8.2", molecule: "α-Pinène", aire: "2.3", famille: "Monoterpène" },
    { tr: "9.8", molecule: "Myrcène", aire: "1.8", famille: "Monoterpène" },
    { tr: "11.3", molecule: "Benzaldéhyde", aire: "4.2", famille: "Aldéhyde" },
    { tr: "13.5", molecule: "Linalool", aire: "3.1", famille: "Monoterpène" },
    { tr: "15.8", molecule: "α-Terpinéol", aire: "2.7", famille: "Monoterpène" },
    { tr: "22.3", molecule: "β-Caryophyllène", aire: "8.5", famille: "Sesquiterpène" },
    { tr: "24.8", molecule: "Caryophyllène oxide", aire: "5.2", famille: "Sesquiterpène" },
  ];

  const virginiaGoldProfile = [
    { tr: "5.2", molecule: "Hexanal", aire: "3.8", famille: "Aldéhyde" },
    { tr: "8.2", molecule: "α-Pinène", aire: "4.5", famille: "Monoterpène" },
    { tr: "10.5", molecule: "Limonène", aire: "6.2", famille: "Monoterpène" },
    { tr: "13.5", molecule: "Linalool", aire: "7.8", famille: "Monoterpène" },
    { tr: "15.8", molecule: "α-Terpinéol", aire: "5.3", famille: "Monoterpène" },
    { tr: "22.3", molecule: "β-Caryophyllène", aire: "4.1", famille: "Sesquiterpène" },
  ];

  // Limites de détection
  const limitsData = [
    { molecule: "α-Pinène", lod: "0.05", loq: "0.15", rsd: "3.2", justesse: "98-102" },
    { molecule: "Limonène", lod: "0.03", loq: "0.10", rsd: "2.8", justesse: "97-103" },
    { molecule: "Myrcène", lod: "0.08", loq: "0.25", rsd: "4.1", justesse: "96-104" },
    { molecule: "Linalool", lod: "0.04", loq: "0.12", rsd: "3.5", justesse: "98-102" },
    { molecule: "β-Caryophyllène", lod: "0.10", loq: "0.30", rsd: "4.8", justesse: "95-105" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumbs */}
      <div className="border-b border-border/40 bg-muted/30">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Accueil</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/recherche-scientifique" className="hover:text-foreground transition-colors">Recherche-scientifique</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Modeles-analytiques-gcms</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 md:py-20 border-b border-border/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
              <TestTube className="w-4 h-4 mr-2" />
              Analyse Chimique
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              Modèles Analytiques GC-MS
            </h1>
            
            <p className="text-lg text-muted-foreground">
              Chromatographie en phase gazeuse couplée à la spectrométrie de masse
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container py-12">
        <Tabs defaultValue="protocols" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="protocols" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Protocoles
            </TabsTrigger>
            <TabsTrigger value="spectra" className="flex items-center gap-2">
              <LineChartIcon className="h-4 w-4" />
              Spectres de Référence
            </TabsTrigger>
            <TabsTrigger value="quantification" className="flex items-center gap-2">
              <Beaker className="h-4 w-4" />
              Quantification
            </TabsTrigger>
          </TabsList>

          {/* Protocoles */}
          <TabsContent value="protocols" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="h-5 w-5 text-purple-500" />
                  Préparation des Échantillons
                </CardTitle>
                <CardDescription>
                  Extraction par solvant + Headspace dynamique
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="font-semibold text-sm border-b pb-2">Tabacs</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Masse échantillon</span>
                        <span className="font-medium">100 mg (séché)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Solvant</span>
                        <span className="font-medium">DCM ou Hexane, 1 mL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Extraction</span>
                        <span className="font-medium">Ultrasons 15 min, 40°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Filtration</span>
                        <span className="font-medium">0.45 μm PTFE</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dilution</span>
                        <span className="font-medium">1:10 dans solvant</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Injection</span>
                        <span className="font-medium">1 μL (split 1:20)</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="font-semibold text-sm border-b pb-2">Molécules pures (standards)</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Concentration stock</span>
                        <span className="font-medium">1000 μg/mL (méthanol)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gamme calibration</span>
                        <span className="font-medium">1-100 μg/mL (7 points)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Étalon interne</span>
                        <span className="font-medium">n-Décane (50 μg/mL)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Paramètres Instrumentaux GC</CardTitle>
                <CardDescription>
                  Colonne DB-5MS (30 m × 0.25 mm × 0.25 μm)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="font-semibold text-sm border-b pb-2">Programme de Température</div>
                    <div className="space-y-2 text-sm">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="font-medium mb-1">1. Température initiale</div>
                        <div className="text-muted-foreground">60°C, maintien 2 min</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="font-medium mb-1">2. Rampe 1</div>
                        <div className="text-muted-foreground">5°C/min jusqu'à 150°C</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="font-medium mb-1">3. Rampe 2</div>
                        <div className="text-muted-foreground">10°C/min jusqu'à 250°C</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="font-medium mb-1">4. Maintien final</div>
                        <div className="text-muted-foreground">250°C, 5 min</div>
                      </div>
                      <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <div className="font-semibold">Durée totale : 35 min</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="font-semibold text-sm border-b pb-2">Gaz Vecteur & Injecteur</div>
                    <div className="space-y-2 text-sm">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="font-medium mb-1">Gaz vecteur</div>
                        <div className="text-muted-foreground">Hélium (He) ultra-pur 99.9999%</div>
                        <div className="text-muted-foreground">Débit : 1.2 mL/min</div>
                        <div className="text-muted-foreground">Pression : ~8 psi</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="font-medium mb-1">Injecteur</div>
                        <div className="text-muted-foreground">Type : Split/Splitless</div>
                        <div className="text-muted-foreground">Température : 250°C</div>
                        <div className="text-muted-foreground">Mode : Split 1:20</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Paramètres MS</CardTitle>
                <CardDescription>
                  Impact électronique (EI) 70 eV
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="font-semibold text-sm border-b pb-2">Source d'Ionisation</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type</span>
                        <span className="font-medium">Impact électronique (EI)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Énergie</span>
                        <span className="font-medium">70 eV</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Température source</span>
                        <span className="font-medium">230°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Température quadrupôle</span>
                        <span className="font-medium">150°C</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="font-semibold text-sm border-b pb-2">Acquisition</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mode</span>
                        <span className="font-medium">Full Scan + SIM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Plage m/z</span>
                        <span className="font-medium">35-350 (Full Scan)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Vitesse scan</span>
                        <span className="font-medium">3 scans/sec</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Solvant delay</span>
                        <span className="font-medium">3 min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spectres de Référence */}
          <TabsContent value="spectra" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Monoterpènes (C₁₀H₁₆)</CardTitle>
                <CardDescription>
                  Temps de rétention et ions caractéristiques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveTable>
                  <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Molécule</TableHead>
                      <TableHead>TR (min)</TableHead>
                      <TableHead>Ion base (m/z)</TableHead>
                      <TableHead>Ions caractéristiques</TableHead>
                      <TableHead>Pureté</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monoterpenes.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.molecule}</TableCell>
                        <TableCell>{item.tr}</TableCell>
                        <TableCell><Badge variant="secondary">{item.ionBase}</Badge></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.ionsCarac}</TableCell>
                        <TableCell>{item.purete}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  </Table>
                </ResponsiveTable>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sesquiterpènes (C₁₅H₂₄)</CardTitle>
                <CardDescription>
                  Temps de rétention et ions caractéristiques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveTable>
                  <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Molécule</TableHead>
                      <TableHead>TR (min)</TableHead>
                      <TableHead>Ion base (m/z)</TableHead>
                      <TableHead>Ions caractéristiques</TableHead>
                      <TableHead>Pureté</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sesquiterpenes.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.molecule}</TableCell>
                        <TableCell>{item.tr}</TableCell>
                        <TableCell><Badge variant="secondary">{item.ionBase}</Badge></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.ionsCarac}</TableCell>
                        <TableCell>{item.purete}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  </Table>
                </ResponsiveTable>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profils Chromatographiques des Tabacs</CardTitle>
                <CardDescription>
                  Composés majeurs détectés par GC-MS
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-amber-500">Burley</Badge>
                    <span className="text-sm text-muted-foreground">Profil dominant : Sesquiterpènes (13.7%), Aldéhydes (4.2%)</span>
                  </div>
                  <ResponsiveTable>
                    <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>TR (min)</TableHead>
                        <TableHead>Molécule</TableHead>
                        <TableHead>% Aire</TableHead>
                        <TableHead>Famille</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {burleyProfile.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{item.tr}</TableCell>
                          <TableCell className="font-medium">{item.molecule}</TableCell>
                          <TableCell><Badge variant="outline">{item.aire}%</Badge></TableCell>
                          <TableCell className="text-sm text-muted-foreground">{item.famille}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    </Table>
                  </ResponsiveTable>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-yellow-500">Virginia Gold</Badge>
                    <span className="text-sm text-muted-foreground">Profil dominant : Monoterpènes (23.8%), Aldéhydes (3.8%)</span>
                  </div>
                  <ResponsiveTable>
                    <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>TR (min)</TableHead>
                        <TableHead>Molécule</TableHead>
                        <TableHead>% Aire</TableHead>
                        <TableHead>Famille</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {virginiaGoldProfile.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{item.tr}</TableCell>
                          <TableCell className="font-medium">{item.molecule}</TableCell>
                          <TableCell><Badge variant="outline">{item.aire}%</Badge></TableCell>
                          <TableCell className="text-sm text-muted-foreground">{item.famille}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    </Table>
                  </ResponsiveTable>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quantification */}
          <TabsContent value="quantification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Étalonnage Externe</CardTitle>
                <CardDescription>
                  Courbe de calibration avec standards purs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="font-semibold text-sm mb-2">Protocole</div>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>Préparer 7 solutions standards (1, 5, 10, 25, 50, 75, 100 μg/mL)</li>
                      <li>Injecter chaque concentration en triplicat</li>
                      <li>Tracer courbe Aire vs Concentration</li>
                      <li>Calculer équation de régression linéaire : y = ax + b</li>
                      <li>Coefficient de corrélation : R² ≥ 0.995</li>
                    </ol>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <div className="font-semibold text-sm mb-2">Exemple : Linalool</div>
                    <div className="text-sm space-y-1">
                      <div>• Équation : Aire = 45230 × C + 1250</div>
                      <div>• R² = 0.998</div>
                      <div>• Plage linéaire : 1-100 μg/mL</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Étalonnage Interne</CardTitle>
                <CardDescription>
                  Utilisation d'un étalon interne (EI) pour corriger variations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="font-semibold text-sm mb-2">Étalon interne recommandé : n-Décane</div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• Temps de rétention : 7.5 min</div>
                      <div>• Concentration fixe : 50 μg/mL dans tous échantillons</div>
                      <div>• Ion quantification : m/z 57</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="font-semibold text-sm mb-2">Avantages</div>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Compense variations volume injection</li>
                      <li>Corrige pertes lors préparation</li>
                      <li>Améliore précision (CV &lt; 5%)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Limites de Détection et Quantification</CardTitle>
                <CardDescription>
                  LOD, LOQ, précision et justesse pour terpènes clés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveTable>
                  <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Molécule</TableHead>
                      <TableHead>LOD (μg/mL)</TableHead>
                      <TableHead>LOQ (μg/mL)</TableHead>
                      <TableHead>Précision (RSD %)</TableHead>
                      <TableHead>Justesse (%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {limitsData.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.molecule}</TableCell>
                        <TableCell>{item.lod}</TableCell>
                        <TableCell>{item.loq}</TableCell>
                        <TableCell><Badge variant="secondary">{item.rsd}</Badge></TableCell>
                        <TableCell>{item.justesse}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  </Table>
                </ResponsiveTable>
                <div className="mt-4 p-4 rounded-lg bg-muted/50">
                  <div className="font-semibold text-sm mb-2">Définitions</div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>• <strong>LOD</strong> (Limit of Detection) : 3 × σ / pente</div>
                    <div>• <strong>LOQ</strong> (Limit of Quantification) : 10 × σ / pente</div>
                    <div>• <strong>RSD</strong> (Relative Standard Deviation) : (σ / moyenne) × 100</div>
                    <div>• <strong>Justesse</strong> : (Valeur mesurée / Valeur vraie) × 100</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-500">
                  <AlertCircle className="h-5 w-5" />
                  Contrôle Qualité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="font-semibold text-sm mb-2">Critères de performance</div>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li><strong>Linéarité</strong> : R² ≥ 0.995 sur plage 1-100 μg/mL</li>
                      <li><strong>Répétabilité</strong> : RSD ≤ 5% (n=6, même jour)</li>
                      <li><strong>Reproductibilité</strong> : RSD ≤ 10% (n=6, jours différents)</li>
                      <li><strong>Justesse</strong> : Récupération 95-105%</li>
                      <li><strong>Spécificité</strong> : Résolution ≥ 1.5 entre pics adjacents</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-2">Échantillons de contrôle</div>
                    <div className="grid gap-2 md:grid-cols-3">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="font-medium text-sm">QC Bas</div>
                        <div className="text-xs text-muted-foreground">3 μg/mL (près LOQ)</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="font-medium text-sm">QC Moyen</div>
                        <div className="text-xs text-muted-foreground">50 μg/mL (milieu)</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="font-medium text-sm">QC Haut</div>
                        <div className="text-xs text-muted-foreground">90 μg/mL (haut)</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">Fréquence : 1 QC tous les 10 échantillons</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 p-6 rounded-lg bg-muted/50 border border-border">
          <div className="text-sm text-muted-foreground">
            <div className="font-semibold mb-2">Références Normatives</div>
            <ul className="space-y-1">
              <li>• ISO 22382:2018 - Gas chromatography-mass spectrometry (GC-MS) - General guidelines</li>
              <li>• CORESTA Recommended Method N° 74 - Determination of selected terpenes in tobacco</li>
              <li>• FDA Guidance - Analytical Procedures and Methods Validation (2015)</li>
              <li>• ICH Q2(R1) - Validation of Analytical Procedures: Text and Methodology</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
