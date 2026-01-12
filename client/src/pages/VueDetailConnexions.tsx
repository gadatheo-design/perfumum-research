import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Network, 
  Search, 
  MapPin, 
  Leaf, 
  FlaskConical, 
  ArrowRight,
  Link2,
  ChevronRight,
  Filter,
  Layers,
  TrendingUp,
  BarChart3,
  Globe,
  Atom,
  FileText
} from "lucide-react";
import { Link } from "wouter";
import { AnimatedCard, HoverScale, FadeInSection } from "@/components/PageTransition";

// Types pour les connexions
interface ConnectionNode {
  id: number;
  name: string;
  type: 'terroir' | 'plant' | 'molecule' | 'recette';
  metadata?: Record<string, any>;
}

interface Connection {
  source: ConnectionNode;
  target: ConnectionNode;
  type: string;
  strength?: number;
  metadata?: Record<string, any>;
}

export default function VueDetailConnexions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedEntity, setSelectedEntity] = useState<ConnectionNode | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Récupérer toutes les données de connexions
  const { data: networkData, isLoading: isLoadingNetwork } = trpc.network.getMoleculePlantTerroirNetwork.useQuery();
  // Note: Les liaisons molécule-recette sont récupérées via les recettes individuelles
  // Pour simplifier, on utilise les stats d'audit qui contiennent le nombre de liaisons
  const { data: moleculeRecetteAuditStats } = trpc.molecules.getRecetteAuditStats.useQuery();
  const { data: plantTerroirStats } = trpc.plantTerroirs.getNetworkStats.useQuery();
  const { data: plantMoleculeStats } = trpc.linkingCoverage.getPlantMoleculeAuditStats.useQuery();

  // Construire les connexions à partir des données
  const allConnections = useMemo(() => {
    const connections: Connection[] = [];
    
    if (!networkData) return connections;

    // Connexions terroir-plante
    if (networkData.relationships?.terroirPlants && networkData.entities?.terroirs && networkData.entities?.plants) {
      const terroirMap = new Map(networkData.entities.terroirs.map((t: any) => [t.id, t]));
      const plantMap = new Map(networkData.entities.plants.map((p: any) => [p.id, p]));
      
      networkData.relationships.terroirPlants.forEach((rel: any) => {
        const terroir = terroirMap.get(rel.terroirId);
        const plant = plantMap.get(rel.plantId);
        if (terroir && plant) {
          connections.push({
            source: { id: terroir.id, name: terroir.name, type: 'terroir', metadata: { country: terroir.country, region: terroir.region } },
            target: { id: plant.id, name: plant.name, type: 'plant', metadata: { latinName: plant.latinName, family: plant.family } },
            type: 'terroir-plant',
            strength: rel.importance === 'majeure' ? 3 : rel.importance === 'significative' ? 2 : 1,
            metadata: { isSignature: rel.isSignature, importance: rel.importance }
          });
        }
      });
    }

    // Connexions plante-molécule
    if (networkData.relationships?.plantMolecules && networkData.entities?.plants && networkData.entities?.molecules) {
      const plantMap = new Map(networkData.entities.plants.map((p: any) => [p.id, p]));
      const moleculeMap = new Map(networkData.entities.molecules.map((m: any) => [m.id, m]));
      
      networkData.relationships.plantMolecules.forEach((rel: any) => {
        const plant = plantMap.get(rel.plantId);
        const molecule = moleculeMap.get(rel.moleculeId);
        if (plant && molecule) {
          connections.push({
            source: { id: plant.id, name: plant.name, type: 'plant', metadata: { latinName: plant.latinName } },
            target: { id: molecule.id, name: molecule.name, type: 'molecule', metadata: { casNumber: molecule.casNumber, chemicalClass: molecule.chemicalClass } },
            type: 'plant-molecule',
            strength: rel.percentageTypical ? parseFloat(rel.percentageTypical) : 1,
            metadata: { role: rel.role, percentage: rel.percentageTypical, isSignature: rel.isSignature }
          });
        }
      });
    }

    // Note: Les connexions molécule-recette sont trop nombreuses pour être chargées individuellement
    // On utilise les statistiques d'audit pour afficher le nombre total

    return connections;
  }, [networkData]);

  // Filtrer les connexions
  const filteredConnections = useMemo(() => {
    let filtered = allConnections;
    
    if (selectedType !== "all") {
      filtered = filtered.filter(c => c.type === selectedType);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.source.name.toLowerCase().includes(query) ||
        c.target.name.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [allConnections, selectedType, searchQuery]);

  // Statistiques globales
  const stats = useMemo(() => {
    const terroirPlantCount = allConnections.filter(c => c.type === 'terroir-plant').length;
    const plantMoleculeCount = allConnections.filter(c => c.type === 'plant-molecule').length;
    const moleculeRecetteCount = moleculeRecetteAuditStats?.totalRelations || 0;
    
    const uniqueTerroirs = new Set(allConnections.filter(c => c.source.type === 'terroir').map(c => c.source.id));
    const uniquePlants = new Set([
      ...allConnections.filter(c => c.source.type === 'plant').map(c => c.source.id),
      ...allConnections.filter(c => c.target.type === 'plant').map(c => c.target.id)
    ]);
    const uniqueMolecules = new Set([
      ...allConnections.filter(c => c.source.type === 'molecule').map(c => c.source.id),
      ...allConnections.filter(c => c.target.type === 'molecule').map(c => c.target.id)
    ]);
    const uniqueRecettes = moleculeRecetteAuditStats?.recettesWithMolecule || 0;

    return {
      totalConnections: allConnections.length + moleculeRecetteCount,
      terroirPlantCount,
      plantMoleculeCount,
      moleculeRecetteCount,
      uniqueTerroirs: uniqueTerroirs.size,
      uniquePlants: uniquePlants.size,
      uniqueMolecules: uniqueMolecules.size,
      uniqueRecettes,
    };
  }, [allConnections, moleculeRecetteAuditStats]);

  // Obtenir les connexions d'une entité spécifique
  const getEntityConnections = (entity: ConnectionNode) => {
    return allConnections.filter(c => 
      (c.source.type === entity.type && c.source.id === entity.id) ||
      (c.target.type === entity.type && c.target.id === entity.id)
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'terroir': return <MapPin className="w-4 h-4" />;
      case 'plant': return <Leaf className="w-4 h-4" />;
      case 'molecule': return <Atom className="w-4 h-4" />;
      case 'recette': return <FileText className="w-4 h-4" />;
      default: return <Link2 className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'terroir': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';
      case 'plant': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'molecule': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'recette': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getConnectionTypeLabel = (type: string) => {
    switch (type) {
      case 'terroir-plant': return 'Terroir → Plante';
      case 'plant-molecule': return 'Plante → Molécule';
      case 'molecule-recette': return 'Molécule → Recette';
      default: return type;
    }
  };

  if (isLoadingNetwork) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Breadcrumbs />
        <Header />
        <main className="flex-1 container py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-96" />
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-28" />
              ))}
            </div>
            <Skeleton className="h-[600px]" />
          </div>
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
        <section className="relative py-16 md:py-20 overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
          </div>
          
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
                <Network className="w-4 h-4 mr-2" />
                Vue Détaillée
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                Toutes les Connexions
              </h1>
              <p className="text-lg text-muted-foreground">
                Explorez l'ensemble des relations entre terroirs, plantes, molécules et recettes. 
                {stats.totalConnections} connexions documentées dans la base de données.
              </p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto"
            >
              <HoverScale scale={1.02}>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-amber-500" />
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <Leaf className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold">{stats.terroirPlantCount}</div>
                    <div className="text-xs text-muted-foreground">Terroir → Plante</div>
                  </CardContent>
                </Card>
              </HoverScale>
              
              <HoverScale scale={1.02}>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Leaf className="w-5 h-5 text-green-500" />
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <Atom className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold">{stats.plantMoleculeCount}</div>
                    <div className="text-xs text-muted-foreground">Plante → Molécule</div>
                  </CardContent>
                </Card>
              </HoverScale>
              
              <HoverScale scale={1.02}>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Atom className="w-5 h-5 text-blue-500" />
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <FileText className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="text-2xl font-bold">{stats.moleculeRecetteCount}</div>
                    <div className="text-xs text-muted-foreground">Molécule → Recette</div>
                  </CardContent>
                </Card>
              </HoverScale>
              
              <HoverScale scale={1.02}>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Layers className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-2xl font-bold">{stats.totalConnections}</div>
                    <div className="text-xs text-muted-foreground">Total connexions</div>
                  </CardContent>
                </Card>
              </HoverScale>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <TabsList className="grid w-full md:w-auto grid-cols-3">
                  <TabsTrigger value="overview" className="gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Vue d'ensemble
                  </TabsTrigger>
                  <TabsTrigger value="browse" className="gap-2">
                    <Search className="w-4 h-4" />
                    Explorer
                  </TabsTrigger>
                  <TabsTrigger value="graph" className="gap-2">
                    <Network className="w-4 h-4" />
                    Graphe
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex gap-2">
                  <Link href="/graphe-terroir-plante-molecule">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Globe className="w-4 h-4" />
                      Graphe 3D
                    </Button>
                  </Link>
                  <Link href="/reseau-molecules-plantes">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Network className="w-4 h-4" />
                      Réseau
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <AnimatedCard hoverScale={1.02} hoverY={-4}>
                    <Card className="border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-amber-500" />
                          Terroirs
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-amber-600">{stats.uniqueTerroirs}</div>
                        <p className="text-sm text-muted-foreground">régions documentées</p>
                        <Link href="/terroirs">
                          <Button variant="ghost" size="sm" className="mt-2 gap-1 text-amber-600 hover:text-amber-700">
                            Explorer <ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </AnimatedCard>

                  <AnimatedCard hoverScale={1.02} hoverY={-4}>
                    <Card className="border-green-500/20 bg-green-50/50 dark:bg-green-950/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Leaf className="w-5 h-5 text-green-500" />
                          Plantes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-green-600">{stats.uniquePlants}</div>
                        <p className="text-sm text-muted-foreground">espèces connectées</p>
                        <Link href="/plantes">
                          <Button variant="ghost" size="sm" className="mt-2 gap-1 text-green-600 hover:text-green-700">
                            Explorer <ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </AnimatedCard>

                  <AnimatedCard hoverScale={1.02} hoverY={-4}>
                    <Card className="border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Atom className="w-5 h-5 text-blue-500" />
                          Molécules
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{stats.uniqueMolecules}</div>
                        <p className="text-sm text-muted-foreground">composés liés</p>
                        <Link href="/molecules">
                          <Button variant="ghost" size="sm" className="mt-2 gap-1 text-blue-600 hover:text-blue-700">
                            Explorer <ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </AnimatedCard>

                  <AnimatedCard hoverScale={1.02} hoverY={-4}>
                    <Card className="border-purple-500/20 bg-purple-50/50 dark:bg-purple-950/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="w-5 h-5 text-purple-500" />
                          Recettes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-purple-600">{stats.uniqueRecettes}</div>
                        <p className="text-sm text-muted-foreground">formulations liées</p>
                        <Link href="/recettes">
                          <Button variant="ghost" size="sm" className="mt-2 gap-1 text-purple-600 hover:text-purple-700">
                            Explorer <ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </AnimatedCard>
                </div>

                {/* Connection Flow Diagram */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Flux de Connexions
                    </CardTitle>
                    <CardDescription>
                      Visualisation du flux de données entre les différentes entités
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center gap-4 py-8">
                      <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-2">
                          <MapPin className="w-10 h-10 text-amber-600" />
                        </div>
                        <div className="font-semibold">{stats.uniqueTerroirs}</div>
                        <div className="text-xs text-muted-foreground">Terroirs</div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <ArrowRight className="w-8 h-8 text-muted-foreground" />
                        <Badge variant="secondary" className="mt-1">{stats.terroirPlantCount}</Badge>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
                          <Leaf className="w-10 h-10 text-green-600" />
                        </div>
                        <div className="font-semibold">{stats.uniquePlants}</div>
                        <div className="text-xs text-muted-foreground">Plantes</div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <ArrowRight className="w-8 h-8 text-muted-foreground" />
                        <Badge variant="secondary" className="mt-1">{stats.plantMoleculeCount}</Badge>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                          <Atom className="w-10 h-10 text-blue-600" />
                        </div>
                        <div className="font-semibold">{stats.uniqueMolecules}</div>
                        <div className="text-xs text-muted-foreground">Molécules</div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <ArrowRight className="w-8 h-8 text-muted-foreground" />
                        <Badge variant="secondary" className="mt-1">{stats.moleculeRecetteCount}</Badge>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2">
                          <FileText className="w-10 h-10 text-purple-600" />
                        </div>
                        <div className="font-semibold">{stats.uniqueRecettes}</div>
                        <div className="text-xs text-muted-foreground">Recettes</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Browse Tab */}
              <TabsContent value="browse" className="space-y-6">
                {/* Filters */}
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Rechercher une entité..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={selectedType === "all" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedType("all")}
                        >
                          Tous
                        </Button>
                        <Button
                          variant={selectedType === "terroir-plant" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedType("terroir-plant")}
                          className="gap-1"
                        >
                          <MapPin className="w-3 h-3" />→<Leaf className="w-3 h-3" />
                        </Button>
                        <Button
                          variant={selectedType === "plant-molecule" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedType("plant-molecule")}
                          className="gap-1"
                        >
                          <Leaf className="w-3 h-3" />→<Atom className="w-3 h-3" />
                        </Button>
                        <Button
                          variant={selectedType === "molecule-recette" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedType("molecule-recette")}
                          className="gap-1"
                        >
                          <Atom className="w-3 h-3" />→<FileText className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Connections List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card className="border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Connexions ({filteredConnections.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className="h-[500px]">
                        <div className="p-4 space-y-2">
                          <AnimatePresence mode="popLayout">
                            {filteredConnections.slice(0, 100).map((connection, index) => (
                              <motion.div
                                key={`${connection.type}-${connection.source.id}-${connection.target.id}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ delay: index * 0.01 }}
                              >
                                <HoverScale scale={1.01}>
                                  <div 
                                    className="p-3 rounded-lg border border-border/50 hover:border-primary/40 hover:bg-muted/50 transition-all cursor-pointer"
                                    onClick={() => setSelectedEntity(connection.source)}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Badge className={`${getTypeColor(connection.source.type)} border-0`}>
                                        {getTypeIcon(connection.source.type)}
                                        <span className="ml-1">{connection.source.name}</span>
                                      </Badge>
                                      <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                      <Badge className={`${getTypeColor(connection.target.type)} border-0`}>
                                        {getTypeIcon(connection.target.type)}
                                        <span className="ml-1">{connection.target.name}</span>
                                      </Badge>
                                    </div>
                                    {connection.metadata && (
                                      <div className="mt-2 text-xs text-muted-foreground">
                                        {connection.metadata.isSignature && (
                                          <Badge variant="outline" className="mr-1 text-xs">Signature</Badge>
                                        )}
                                        {connection.metadata.importance && (
                                          <span className="mr-2">Importance: {connection.metadata.importance}</span>
                                        )}
                                        {connection.metadata.percentage && (
                                          <span>Concentration: {connection.metadata.percentage}%</span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </HoverScale>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                          {filteredConnections.length > 100 && (
                            <p className="text-center text-sm text-muted-foreground py-4">
                              ... et {filteredConnections.length - 100} autres connexions
                            </p>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Entity Detail */}
                  <Card className="border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        {selectedEntity ? `Détails: ${selectedEntity.name}` : "Sélectionnez une entité"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedEntity ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Badge className={`${getTypeColor(selectedEntity.type)} border-0 text-base px-3 py-1`}>
                              {getTypeIcon(selectedEntity.type)}
                              <span className="ml-2">{selectedEntity.type}</span>
                            </Badge>
                          </div>
                          
                          {selectedEntity.metadata && (
                            <div className="space-y-2">
                              {Object.entries(selectedEntity.metadata).map(([key, value]) => (
                                value && (
                                  <div key={key} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground capitalize">{key}:</span>
                                    <span>{String(value)}</span>
                                  </div>
                                )
                              ))}
                            </div>
                          )}
                          
                          <div className="border-t pt-4">
                            <h4 className="font-medium mb-2">Connexions ({getEntityConnections(selectedEntity).length})</h4>
                            <ScrollArea className="h-[300px]">
                              <div className="space-y-2">
                                {getEntityConnections(selectedEntity).map((conn, i) => (
                                  <div key={i} className="text-sm p-2 rounded bg-muted/50">
                                    {conn.source.id === selectedEntity.id ? (
                                      <span>→ {conn.target.name} ({conn.target.type})</span>
                                    ) : (
                                      <span>← {conn.source.name} ({conn.source.type})</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </div>
                        </div>
                      ) : (
                        <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                          <div className="text-center">
                            <Network className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Cliquez sur une connexion pour voir les détails</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Graph Tab */}
              <TabsContent value="graph" className="space-y-6">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Network className="w-5 h-5 text-primary" />
                      Visualisations Graphiques
                    </CardTitle>
                    <CardDescription>
                      Accédez aux différentes visualisations interactives du réseau de données
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Link href="/graphe-terroir-plante-molecule">
                        <HoverScale scale={1.02}>
                          <Card className="h-full border-border/50 hover:border-primary/40 cursor-pointer transition-all">
                            <CardContent className="p-6 text-center">
                              <Globe className="w-12 h-12 mx-auto mb-4 text-primary" />
                              <h3 className="font-semibold mb-2">Graphe Terroir-Plante-Molécule</h3>
                              <p className="text-sm text-muted-foreground">
                                Visualisation 3D des relations entre terroirs, plantes et molécules
                              </p>
                            </CardContent>
                          </Card>
                        </HoverScale>
                      </Link>
                      
                      <Link href="/graphe-plante-molecule">
                        <HoverScale scale={1.02}>
                          <Card className="h-full border-border/50 hover:border-primary/40 cursor-pointer transition-all">
                            <CardContent className="p-6 text-center">
                              <Leaf className="w-12 h-12 mx-auto mb-4 text-green-500" />
                              <h3 className="font-semibold mb-2">Graphe Plante-Molécule</h3>
                              <p className="text-sm text-muted-foreground">
                                Réseau des compositions moléculaires des plantes
                              </p>
                            </CardContent>
                          </Card>
                        </HoverScale>
                      </Link>
                      
                      <Link href="/sankey-flow">
                        <HoverScale scale={1.02}>
                          <Card className="h-full border-border/50 hover:border-primary/40 cursor-pointer transition-all">
                            <CardContent className="p-6 text-center">
                              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                              <h3 className="font-semibold mb-2">Diagramme Sankey</h3>
                              <p className="text-sm text-muted-foreground">
                                Flux des recettes par catégorie et famille
                              </p>
                            </CardContent>
                          </Card>
                        </HoverScale>
                      </Link>
                      
                      <Link href="/synergies-heatmap">
                        <HoverScale scale={1.02}>
                          <Card className="h-full border-border/50 hover:border-primary/40 cursor-pointer transition-all">
                            <CardContent className="p-6 text-center">
                              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                              <h3 className="font-semibold mb-2">Heatmap Synergies</h3>
                              <p className="text-sm text-muted-foreground">
                                Matrice des synergies moléculaires
                              </p>
                            </CardContent>
                          </Card>
                        </HoverScale>
                      </Link>
                      
                      <Link href="/matrice-synergies">
                        <HoverScale scale={1.02}>
                          <Card className="h-full border-border/50 hover:border-primary/40 cursor-pointer transition-all">
                            <CardContent className="p-6 text-center">
                              <Layers className="w-12 h-12 mx-auto mb-4 text-amber-500" />
                              <h3 className="font-semibold mb-2">Matrice Interactive</h3>
                              <p className="text-sm text-muted-foreground">
                                Explorer les combinaisons moléculaires
                              </p>
                            </CardContent>
                          </Card>
                        </HoverScale>
                      </Link>
                      
                      <Link href="/reseau">
                        <HoverScale scale={1.02}>
                          <Card className="h-full border-border/50 hover:border-primary/40 cursor-pointer transition-all">
                            <CardContent className="p-6 text-center">
                              <Network className="w-12 h-12 mx-auto mb-4 text-rose-500" />
                              <h3 className="font-semibold mb-2">Réseau Global</h3>
                              <p className="text-sm text-muted-foreground">
                                Vue d'ensemble du réseau de données
                              </p>
                            </CardContent>
                          </Card>
                        </HoverScale>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
