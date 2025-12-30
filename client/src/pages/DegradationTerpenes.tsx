import { Link } from "wouter";
import { Flame, ChevronRight, AlertCircle, Beaker, Sun, Droplet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function DegradationTerpenes() {
  // Courbe cinétique Limonène (Pyrolyse)
  const limoneneData = [
    { temp: 150, limonene: 95, terpinolene: 3, pcymene: 2 },
    { temp: 180, limonene: 85, terpinolene: 8, pcymene: 7 },
    { temp: 200, limonene: 65, terpinolene: 15, pcymene: 20 },
    { temp: 220, limonene: 40, terpinolene: 15, pcymene: 45 },
    { temp: 250, limonene: 15, terpinolene: 15, pcymene: 70 },
  ];

  // Courbe cinétique α-Pinène (Isomérisation)
  const pineneData = [
    { temp: 120, alphaPinene: 92, camphene: 5, limonene: 3 },
    { temp: 140, alphaPinene: 75, camphene: 15, limonene: 10 },
    { temp: 160, alphaPinene: 55, camphene: 25, limonene: 20 },
    { temp: 180, alphaPinene: 35, camphene: 30, limonene: 35 },
    { temp: 200, alphaPinene: 20, camphene: 25, limonene: 55 },
  ];

  // Courbe cinétique Linalool (Auto-oxydation)
  const linaloolData = [
    { days: 0, linalool: 100, linaloolOxide: 0, others: 0 },
    { days: 7, linalool: 85, linaloolOxide: 10, others: 5 },
    { days: 14, linalool: 70, linaloolOxide: 20, others: 10 },
    { days: 30, linalool: 50, linaloolOxide: 30, others: 20 },
    { days: 60, linalool: 30, linaloolOxide: 40, others: 30 },
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
            <span className="text-foreground font-medium">Degradation-terpenes</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b border-border/40 bg-gradient-to-br from-orange-500/10 via-background to-background">
        <div className="container py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Dégradation des Terpènes</h1>
              <p className="text-lg text-muted-foreground mt-2">
                Voies de dégradation thermique et oxydative des terpènes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        <Tabs defaultValue="thermal" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="thermal" className="flex items-center gap-2">
              <Flame className="h-4 w-4" />
              Voies Thermiques
            </TabsTrigger>
            <TabsTrigger value="oxidative" className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Voies Oxydatives
            </TabsTrigger>
            <TabsTrigger value="curves" className="flex items-center gap-2">
              <Beaker className="h-4 w-4" />
              Courbes Cinétiques
            </TabsTrigger>
          </TabsList>

          {/* Voies Thermiques */}
          <TabsContent value="thermal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Pyrolyse (&gt; 200°C)
                </CardTitle>
                <CardDescription>
                  Rupture de liaisons C-C, déshydrogénation, cyclisation intramoléculaire
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                      <div className="font-semibold text-sm min-w-[100px]">Limonène →</div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">p-Cymène</Badge>
                        <Badge variant="secondary">Terpinolène</Badge>
                        <Badge variant="secondary">α-Terpinène</Badge>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                      <div className="font-semibold text-sm min-w-[100px]">α-Pinène →</div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Camphène</Badge>
                        <Badge variant="secondary">Limonène</Badge>
                        <Badge variant="secondary">Terpinolène</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                      <div className="font-semibold text-sm min-w-[120px]">β-Caryophyllène →</div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Caryophyllène oxide</Badge>
                        <Badge variant="secondary">Humulène</Badge>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                      <div className="font-semibold text-sm min-w-[100px]">Myrcène →</div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Linalool</Badge>
                        <Badge variant="secondary">Géraniol</Badge>
                        <Badge variant="secondary">Nérol</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-blue-500" />
                  Isomérisation (120-180°C)
                </CardTitle>
                <CardDescription>
                  Réarrangement squelettique, migration de double liaison, équilibre thermodynamique
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <Badge variant="outline">α-Pinène</Badge>
                    <span className="text-muted-foreground">⇌</span>
                    <Badge variant="outline">Camphène</Badge>
                    <span className="text-muted-foreground">⇌</span>
                    <Badge variant="outline">Limonène</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <Badge variant="outline">Limonène</Badge>
                    <span className="text-muted-foreground">⇌</span>
                    <Badge variant="outline">Terpinolène</Badge>
                    <span className="text-muted-foreground">⇌</span>
                    <Badge variant="outline">α-Terpinène</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <Badge variant="outline">Linalool</Badge>
                    <span className="text-muted-foreground">⇌</span>
                    <Badge variant="outline">Géraniol</Badge>
                    <span className="text-muted-foreground">⇌</span>
                    <Badge variant="outline">Nérol</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cyclisation (140-200°C)</CardTitle>
                <CardDescription>
                  Formation de cycles à 6 membres, attaque électrophile intramoléculaire
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                    <div className="font-semibold text-sm">Myrcène</div>
                    <div className="text-sm text-muted-foreground">→ α-Terpinène, γ-Terpinène</div>
                  </div>
                  <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                    <div className="font-semibold text-sm">Linalool</div>
                    <div className="text-sm text-muted-foreground">→ α-Terpinéol, Limonène</div>
                  </div>
                  <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                    <div className="font-semibold text-sm">Géraniol</div>
                    <div className="text-sm text-muted-foreground">→ Citronellol, α-Terpinéol</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Voies Oxydatives */}
          <TabsContent value="oxidative" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-yellow-500" />
                  Auto-oxydation (20-80°C, O₂)
                </CardTitle>
                <CardDescription>
                  Formation de radicaux libres, addition d'oxygène, propagation en chaîne
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="font-semibold text-sm mb-2">Limonène</div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Limonène-1,2-époxide</Badge>
                        <Badge variant="secondary">Carvone</Badge>
                        <Badge variant="secondary">Carveol</Badge>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="font-semibold text-sm mb-2">α-Pinène</div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Pinène oxide</Badge>
                        <Badge variant="secondary">Verbenone</Badge>
                        <Badge variant="secondary">Verbenol</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="font-semibold text-sm mb-2">Myrcène</div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Myrcène oxide</Badge>
                        <Badge variant="secondary">Linalool oxide</Badge>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="font-semibold text-sm mb-2">Linalool</div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Linalool oxide (furanoid)</Badge>
                        <Badge variant="secondary">Linalool oxide (pyranoid)</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Photo-oxydation (UV + O₂)</CardTitle>
                <CardDescription>
                  Oxygène singulet (¹O₂), addition [4+2] de Diels-Alder, endoperoxydes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="font-semibold text-sm mb-2">β-Caryophyllène</div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Caryophyllène endoperoxide</Badge>
                      <Badge variant="secondary">β-Caryophyllène oxide</Badge>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="font-semibold text-sm mb-2">Humulène</div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Humulène epoxide I</Badge>
                      <Badge variant="secondary">Humulène epoxide II</Badge>
                      <Badge variant="secondary">Humulène epoxide III</Badge>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="font-semibold text-sm mb-2">Limonène</div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Limonène hydroperoxide</Badge>
                      <Badge variant="secondary">Ascaridole</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-500/20 bg-yellow-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
                  <AlertCircle className="h-5 w-5" />
                  Facteurs Influents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="font-semibold text-sm">Température</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• &lt; 100°C : Dégradation lente, oxydative</li>
                      <li>• 100-180°C : Isomérisation dominante</li>
                      <li>• 180-250°C : Pyrolyse active</li>
                      <li>• &gt; 250°C : Décomposition totale</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <div className="font-semibold text-sm">Oxygène</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Absence O₂ : Pyrolyse pure</li>
                      <li>• O₂ atmosphérique : Auto-oxydation lente</li>
                      <li>• O₂ enrichi : Oxydation rapide</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courbes Cinétiques */}
          <TabsContent value="curves" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pyrolyse du Limonène</CardTitle>
                <CardDescription>Évolution des produits en fonction de la température (30 min)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={limoneneData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="temp" label={{ value: "Température (°C)", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Composition (%)", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="limonene" stroke="#10b981" name="Limonène" strokeWidth={2} />
                    <Line type="monotone" dataKey="terpinolene" stroke="#3b82f6" name="Terpinolène" strokeWidth={2} />
                    <Line type="monotone" dataKey="pcymene" stroke="#f59e0b" name="p-Cymène" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Isomérisation de l'α-Pinène</CardTitle>
                <CardDescription>Équilibre thermodynamique en fonction de la température (60 min)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={pineneData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="temp" label={{ value: "Température (°C)", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Composition (%)", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="alphaPinene" stroke="#8b5cf6" name="α-Pinène" strokeWidth={2} />
                    <Line type="monotone" dataKey="camphene" stroke="#ec4899" name="Camphène" strokeWidth={2} />
                    <Line type="monotone" dataKey="limonene" stroke="#10b981" name="Limonène" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Auto-oxydation du Linalool</CardTitle>
                <CardDescription>Dégradation oxydative à 25°C en présence d'O₂ atmosphérique</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={linaloolData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="days" label={{ value: "Temps (jours)", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Composition (%)", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="linalool" stroke="#10b981" name="Linalool" strokeWidth={2} />
                    <Line type="monotone" dataKey="linaloolOxide" stroke="#f59e0b" name="Linalool oxide" strokeWidth={2} />
                    <Line type="monotone" dataKey="others" stroke="#6b7280" name="Autres produits" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-500">
                  <Beaker className="h-5 w-5" />
                  Applications Pratiques PERFUMUM
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="font-semibold text-sm mb-2">Contrôle de la Dégradation</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Stockage : Température &lt; 20°C, absence de lumière, atmosphère inerte (N₂)</li>
                      <li>• Manipulation : Éviter chauffage prolongé &gt; 140°C</li>
                      <li>• Formulation : Ajout d'antioxydants (tocophérol, BHT)</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-2">Exploitation de la Transformation</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Vieillissement contrôlé : 60-80°C, 7-14 jours → Notes miel, cire</li>
                      <li>• Chauffage modéré : 140-160°C, 10-20 min → Complexité aromatique</li>
                      <li>• Pyrolyse ciblée : 200-220°C, 5-10 min → Notes épicées (p-cymène)</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-2">Stabilisation des Recettes</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Terpènes sensibles : Myrcène, Linalool → Utiliser formes oxydées</li>
                      <li>• Terpènes stables : α-Pinène, Limonène → Base de formulation</li>
                      <li>• Synergies : Mélanger oxydés + non-oxydés → Profil évolutif</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 p-6 rounded-lg bg-muted/50 border border-border">
          <div className="text-sm text-muted-foreground">
            <div className="font-semibold mb-2">Références Scientifiques</div>
            <ul className="space-y-1">
              <li>• ISO 4730:2017 - Oil of melaleuca, terpinen-4-ol type</li>
              <li>• CORESTA Recommended Method N° 74 - Determination of selected terpenes</li>
              <li>• Journal of Agricultural and Food Chemistry (2018) - Thermal degradation of terpenes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
