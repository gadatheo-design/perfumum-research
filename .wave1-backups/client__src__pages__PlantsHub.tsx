// @ts-nocheck
import { useState, Suspense, lazy } from "react";
import { useSearch, useLocation } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Leaf, Dna, MapPin, Network, Map } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";

// Lazy load tab content components for performance
const PlantsContent = lazy(() => import("@/components/content/PlantsContent"));
const VarietiesContent = lazy(() => import("@/components/content/VarietiesContent"));
const TerroirsContent = lazy(() => import("@/components/content/TerroirsContent"));
const PlantTerroirNetworkContent = lazy(() => import("./PlantTerroirNetwork"));
const CarteContent = lazy(() => import("@/components/content/CarteContent"));

/**
 * PlantsHub - Consolidated page for all plant-related content
 * 
 * This page consolidates the following routes:
 * - /plants → Liste des plantes
 * - /varieties → Variétés de plantes
 * - /terroirs → Terroirs et régions
 * - /plant-terroir-network → Réseau plantes-terroirs
 * 
 * Legacy routes are automatically redirected here with the appropriate tab.
 */
export default function PlantsHub() {
  const searchString = useSearch();
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(searchString);
  
  // Get tab from URL or default to "plantes"
  const urlTab = searchParams.get("tab") || "plantes";
  const [activeTab, setActiveTab] = useState(urlTab);

  // Handle tab change and update URL
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newParams = new URLSearchParams(searchString);
    newParams.set("tab", value);
    setLocation(`/plantes?${newParams.toString()}`, { replace: true });
  };

  const tabs = [
    {
      id: "plantes",
      label: "Plantes",
      icon: <Leaf className="h-4 w-4" />,
      description: "Toutes les plantes aromatiques de la base de données"
    },
    {
      id: "varietes",
      label: "Variétés",
      icon: <Dna className="h-4 w-4" />,
      description: "Cultivars, chémotypes et landraces"
    },
    {
      id: "terroirs",
      label: "Terroirs",
      icon: <MapPin className="h-4 w-4" />,
      description: "Régions et zones de culture"
    },
    {
      id: "carte",
      label: "Carte",
      icon: <Map className="h-4 w-4" />,
      description: "Carte interactive des terroirs et régions de culture"
    },
    {
      id: "reseau",
      label: "Réseau",
      icon: <Network className="h-4 w-4" />,
      description: "Visualisation des relations plantes-terroirs"
    },
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <Breadcrumbs />
        
        <main className="flex-1 container py-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Plantes & Terroirs
            </h1>
            <p className="text-muted-foreground">
              Explorez le monde végétal PERFUMUM : {tabs.find(t => t.id === activeTab)?.description}
            </p>
          </div>

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1">
            <TabsList className="mb-6 flex-wrap h-auto gap-1">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab Content */}
            <TabsContent value="plantes" className="mt-0">
              <Suspense fallback={<TabLoadingState />}>
                <PlantsContent />
              </Suspense>
            </TabsContent>

            <TabsContent value="varietes" className="mt-0">
              <Suspense fallback={<TabLoadingState />}>
                <VarietiesContent />
              </Suspense>
            </TabsContent>

            <TabsContent value="terroirs" className="mt-0">
              <Suspense fallback={<TabLoadingState />}>
                <TerroirsContent />
              </Suspense>
            </TabsContent>

            <TabsContent value="carte" className="mt-0">
              <Suspense fallback={<TabLoadingState />}>
                <CarteContent />
              </Suspense>
            </TabsContent>

            <TabsContent value="reseau" className="mt-0">
              <Suspense fallback={<TabLoadingState />}>
                <PlantTerroirNetworkContent />
              </Suspense>
            </TabsContent>
          </Tabs>
        </main>

        <Footer />
      </div>
    </TooltipProvider>
  );
}

function TabLoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <LoadingSpinner />
      <span className="ml-2 text-muted-foreground">Chargement...</span>
    </div>
  );
}
