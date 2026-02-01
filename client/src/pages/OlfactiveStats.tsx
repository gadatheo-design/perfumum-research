import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { 
  BarChart3, 
  PieChart, 
  AlertTriangle, 
  Ban, 
  CheckCircle, 
  AlertCircle,
  Droplets,
  Atom,
  ArrowRight,
  TrendingUp
} from "lucide-react";

export default function OlfactiveStats() {
  const { data: molecules } = trpc.molecules.list.useQuery();
  const { data: flavornetStats } = trpc.flavornet.getEnrichmentStats.useQuery();
  const { data: ifraStats } = trpc.ifra.getEnrichmentStats.useQuery();
  const { data: availablePercepts } = trpc.flavornet.getUniquePercepts.useQuery();

  // Calculate IFRA status distribution
  const ifraDistribution = useMemo(() => {
    if (!molecules) return { banned: 0, restricted: 0, specification_required: 0, not_regulated: 0, unknown: 0 };
    
    const dist = { banned: 0, restricted: 0, specification_required: 0, not_regulated: 0, unknown: 0 };
    molecules.forEach(m => {
      const status = (m as any).ifraStatus;
      if (status === 'banned') dist.banned++;
      else if (status === 'restricted') dist.restricted++;
      else if (status === 'specification_required') dist.specification_required++;
      else if (status === 'not_regulated') dist.not_regulated++;
      else dist.unknown++;
    });
    return dist;
  }, [molecules]);

  // Calculate percept distribution (top 20)
  const perceptDistribution = useMemo(() => {
    if (!molecules) return [];
    
    const perceptCount: Record<string, number> = {};
    molecules.forEach(m => {
      const percepts = (m as any).flavornetPercepts;
      if (percepts) {
        percepts.split(',').forEach((p: string) => {
          const trimmed = p.trim().toLowerCase();
          if (trimmed) {
            perceptCount[trimmed] = (perceptCount[trimmed] || 0) + 1;
          }
        });
      }
    });
    
    return Object.entries(perceptCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([percept, count]) => ({ percept, count }));
  }, [molecules]);

  // Calculate coverage stats
  const coverageStats = useMemo(() => {
    if (!molecules) return { total: 0, withPercepts: 0, withIfra: 0 };
    
    let withPercepts = 0;
    let withIfra = 0;
    
    molecules.forEach(m => {
      if ((m as any).flavornetPercepts) withPercepts++;
      if ((m as any).ifraStatus && (m as any).ifraStatus !== 'unknown') withIfra++;
    });
    
    return {
      total: molecules.length,
      withPercepts,
      withIfra
    };
  }, [molecules]);

  const getIfraStatusColor = (status: string) => {
    switch (status) {
      case 'banned': return 'bg-red-500';
      case 'restricted': return 'bg-orange-500';
      case 'specification_required': return 'bg-yellow-500';
      case 'not_regulated': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getIfraStatusLabel = (status: string) => {
    switch (status) {
      case 'banned': return 'Interdit';
      case 'restricted': return 'Restreint';
      case 'specification_required': return 'Spéc. requise';
      case 'not_regulated': return 'Non réglementé';
      default: return 'Non analysé';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Statistiques Olfactives
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Vue d'ensemble des données d'enrichissement : descripteurs olfactifs Flavornet et conformité réglementaire IFRA.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="py-12">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Molécules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{coverageStats.total}</div>
                  <p className="text-xs text-muted-foreground mt-1">dans la base de données</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Enrichies Flavornet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{flavornetStats?.enriched || coverageStats.withPercepts}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {flavornetStats?.percentage || Math.round((coverageStats.withPercepts / coverageStats.total) * 100)}% de couverture
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Analysées IFRA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">{ifraStats?.total || coverageStats.withIfra}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((coverageStats.withIfra / coverageStats.total) * 100)}% de couverture
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Percepts Uniques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{availablePercepts?.length || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">descripteurs olfactifs</p>
                </CardContent>
              </Card>
            </div>

            {/* IFRA Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Répartition IFRA
                  </CardTitle>
                  <CardDescription>
                    Distribution des molécules par statut réglementaire IFRA
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Banned */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 w-32">
                        <Ban className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium">Interdit</span>
                      </div>
                      <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500 transition-all duration-500"
                          style={{ width: `${(ifraDistribution.banned / coverageStats.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold w-12 text-right">{ifraDistribution.banned}</span>
                    </div>
                    
                    {/* Restricted */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 w-32">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium">Restreint</span>
                      </div>
                      <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-500 transition-all duration-500"
                          style={{ width: `${(ifraDistribution.restricted / coverageStats.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold w-12 text-right">{ifraDistribution.restricted}</span>
                    </div>
                    
                    {/* Specification Required */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 w-32">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium">Spéc. req.</span>
                      </div>
                      <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-500 transition-all duration-500"
                          style={{ width: `${(ifraDistribution.specification_required / coverageStats.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold w-12 text-right">{ifraDistribution.specification_required}</span>
                    </div>
                    
                    {/* Not Regulated */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 w-32">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Non régl.</span>
                      </div>
                      <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 transition-all duration-500"
                          style={{ width: `${(ifraDistribution.not_regulated / coverageStats.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold w-12 text-right">{ifraDistribution.not_regulated}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t">
                    <Link href="/ifra">
                      <Button variant="outline" className="w-full">
                        Voir les détails IFRA
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Top Percepts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-5 w-5" />
                    Top 20 Percepts
                  </CardTitle>
                  <CardDescription>
                    Descripteurs olfactifs les plus fréquents dans la base
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {perceptDistribution.map((item, index) => (
                      <div key={item.percept} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-6">{index + 1}.</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium capitalize">{item.percept}</span>
                            <span className="text-xs text-muted-foreground">{item.count} mol.</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 transition-all duration-500"
                              style={{ width: `${(item.count / (perceptDistribution[0]?.count || 1)) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t">
                    <Link href="/percepts">
                      <Button variant="outline" className="w-full">
                        Rechercher par percept
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/molecules?ifraStatusFilter=banned">
                <Card className="card-hover cursor-pointer border-red-200 dark:border-red-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                        <Ban className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Molécules interdites</h3>
                        <p className="text-sm text-muted-foreground">{ifraDistribution.banned} molécules à éviter</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/molecules?ifraStatusFilter=restricted">
                <Card className="card-hover cursor-pointer border-orange-200 dark:border-orange-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
                        <AlertTriangle className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Molécules restreintes</h3>
                        <p className="text-sm text-muted-foreground">{ifraDistribution.restricted} avec limites de concentration</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/molecules?selectedPercept=citrus">
                <Card className="card-hover cursor-pointer border-blue-200 dark:border-blue-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <Droplets className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Explorer par percept</h3>
                        <p className="text-sm text-muted-foreground">{availablePercepts?.length || 0} descripteurs disponibles</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
