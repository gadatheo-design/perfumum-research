// @ts-nocheck
import { useState, useMemo } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, Leaf, Thermometer, Droplets, Mountain, 
  ChevronRight, Globe, Sun, Wind, ArrowLeft,
  Beaker, FlaskConical
} from "lucide-react";
import { TruncatableTitle, TruncatableDescription } from "@/components/TruncatableText";
import { TerroirContributionModal } from "@/components/TerroirContributionModal";
import { PlusCircle } from "lucide-react";
import { EntityConnectionBar } from "@/components/EntityConnectionBar";
import { TabErrorBoundary } from "@/components/TabErrorBoundary";

export default function TerroirDetail() {
  const { id } = useParams<{ id: string }>();
  const terroirId = parseInt(id || "0");
  
  const { data: terroir, isLoading } = trpc.terroirs.getById.useQuery(
    { id: terroirId },
    { enabled: terroirId > 0 }
  );
  
  const { data: plants = [] } = trpc.crossLinks.getPlantsByTerroir.useQuery(
    terroirId,
    { enabled: terroirId > 0 }
  );

  // Matières premières liées via les plantes
  const { data: rawMaterialsByTerroir = [] } = trpc.crossLinks.getRawMaterialsByTerroir?.useQuery?.(
    terroirId,
    { enabled: terroirId > 0 }
  ) ?? { data: [] };
  
  // Terroirs similaires - désactivé pour l'instant
  const similarTerroirs: any[] = [];

  // Connexions inter-entités pour EntityConnectionBar
  const connections = [
    ...(plants as any[]).map((p: any) => ({
      id: p.id,
      name: p.name,
      type: "plant" as const,
      subtitle: p.latinName || p.family,
    })),
    ...(rawMaterialsByTerroir as any[]).map((rm: any) => ({
      id: rm.id,
      name: rm.name,
      type: "rawMaterial" as const,
      subtitle: rm.category,
    })),
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Breadcrumbs />
        <Header />
        <main className="flex-1 container py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-6 w-1/2" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!terroir) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Breadcrumbs />
        <Header />
        <main className="flex-1 container py-8">
          <Card className="border-border/50">
            <CardContent className="py-12 text-center">
              <MapPin className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Terroir non trouvé</h2>
              <p className="text-muted-foreground mb-4">Ce terroir n'existe pas ou a été supprimé.</p>
              <Link href="/plantes?tab=terroirs">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour aux terroirs
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 border-b border-border/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-background to-background" />
          
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <Link href="/plantes?tab=terroirs">
                <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Tous les terroirs
                </Button>
              </Link>
              
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                    {terroir?.name}
                  </h1>
                  {terroir?.region && (
                    <p className="text-lg text-muted-foreground flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      {terroir?.region}
                      {terroir?.country && `, ${terroir?.country}`}
                    </p>
                  )}
                </div>
              </div>
              
              {terroir?.reputation && (
                <p className="text-muted-foreground leading-relaxed max-w-3xl">
                  {terroir?.reputation}
                </p>
              )}
              
              {/* Bouton Contribuer */}
              <div className="mt-6 mb-2">
                <TerroirContributionModal
                  terroirId={terroirId}
                  terroirName={terroir?.name}
                  trigger={
                    <Button variant="outline" size="sm" className="gap-2 border-amber-500/50 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30">
                      <PlusCircle className="h-4 w-4" />
                      Contribuer à ce terroir
                    </Button>
                  }
                />
              </div>
              {/* Stats rapides */}
              <div className="flex flex-wrap gap-3 mt-3">
                <Badge variant="secondary" className="text-sm">
                  <Leaf className="w-3.5 h-3.5 mr-1.5" />
                  {plants?.length} plantes
                </Badge>
                {terroir?.climateType && (
                  <Badge variant="outline" className="text-sm">
                    <Sun className="w-3.5 h-3.5 mr-1.5" />
                    {terroir?.climateType}
                  </Badge>
                )}
                {terroir?.altitude && (
                  <Badge variant="outline" className="text-sm">
                    <Mountain className="w-3.5 h-3.5 mr-1.5" />
                    {terroir?.altitude}m
                  </Badge>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contenu principal */}
        <section className="container py-8">
          <Tabs defaultValue="plants" className="space-y-6">
            <TabsList>
              <TabsTrigger value="plants" className="gap-2">
                <Leaf className="w-4 h-4" />
                Plantes ({plants?.length})
              </TabsTrigger>
              <TabsTrigger value="characteristics" className="gap-2">
                <Thermometer className="w-4 h-4" />
                Caractéristiques
              </TabsTrigger>
              <TabsTrigger value="similar" className="gap-2">
                <Globe className="w-4 h-4" />
                Terroirs similaires
              </TabsTrigger>
            </TabsList>

            {/* Onglet Plantes */}
            <TabErrorBoundary>
            <TabsContent value="plants" className="space-y-4">
              {plants?.length === 0 ? (
                <Card className="border-border/50">
                  <CardContent className="py-12 text-center">
                    <Leaf className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucune plante associée</h3>
                    <p className="text-muted-foreground">
                      Ce terroir n'a pas encore de plantes documentées.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {plants?.map((plant: any) => (
                    <Link key={plant.id} href={`/plants/${plant.id}`}>
                      <Card className="group h-full border-border/50 hover:border-green-500/50 hover:shadow-lg transition-all cursor-pointer">
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                              <Leaf className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <TruncatableTitle
                                text={plant.name}
                                maxLines={2}
                                className="group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors"
                                expandable={false}
                              />
                              {plant.latinName && (
                                <TruncatableDescription
                                  text={plant.latinName}
                                  maxLines={1}
                                  expandable={false}
                                />
                              )}
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-green-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {plant.family && (
                            <Badge variant="outline" className="text-xs">
                              {plant.family}
                            </Badge>
                          )}
                          {plant.olfactiveProfile && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                              {plant.olfactiveProfile}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
            </TabErrorBoundary>

            {/* Onglet Caractéristiques */}
            <TabErrorBoundary>
            <TabsContent value="characteristics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {terroir?.climateType && (
                  <Card className="border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Sun className="w-4 h-4 text-amber-500" />
                        Climat
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">{terroir?.climateType}</p>
                    </CardContent>
                  </Card>
                )}
                
                {terroir?.altitude && (
                  <Card className="border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Mountain className="w-4 h-4 text-slate-500" />
                        Altitude
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">{terroir?.altitude} m</p>
                    </CardContent>
                  </Card>
                )}
                
                {terroir?.soilType && (
                  <Card className="border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-600" />
                        Type de sol
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">{terroir?.soilType}</p>
                    </CardContent>
                  </Card>
                )}
                
                {terroir?.annualRainfall && (
                  <Card className="border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        Précipitations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">{terroir?.annualRainfall}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {terroir?.reputation && (
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Wind className="w-4 h-4 text-purple-500" />
                      Profil olfactif du terroir
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {terroir?.reputation}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            </TabErrorBoundary>

            {/* Onglet Terroirs similaires */}
            <TabErrorBoundary>
            <TabsContent value="similar" className="space-y-4">
              {similarTerroirs.length === 0 ? (
                <Card className="border-border/50">
                  <CardContent className="py-12 text-center">
                    <Globe className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucun terroir similaire</h3>
                    <p className="text-muted-foreground">
                      Pas de terroirs avec un profil similaire trouvés.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {similarTerroirs.map((similar: any) => (
                    <Link key={similar.id} href={`/terroirs/${similar.id}`}>
                      <Card className="group h-full border-border/50 hover:border-amber-500/50 hover:shadow-lg transition-all cursor-pointer">
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                              <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-base group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate">
                                {similar.name}
                              </CardTitle>
                              {similar.region && (
                                <CardDescription className="text-xs truncate">
                                  {similar.region}
                                </CardDescription>
                              )}
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {similar.similarity && (
                            <Badge variant="secondary" className="text-xs">
                              {Math.round(similar.similarity * 100)}% similaire
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
            </TabErrorBoundary>
          </Tabs>
        </section>

        {/* Barre de connexions inter-entités */}
        {connections.length > 0 && (
          <div className="container pb-10">
            <EntityConnectionBar
              connections={connections}
              title="Entités liées à ce terroir"
              variant="chips"
            />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
