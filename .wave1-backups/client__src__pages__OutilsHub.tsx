// @ts-nocheck
import { lazy, Suspense, useState } from "react";
import { useSearch, useLocation } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Calculator, FlaskConical, Network, Radar, Grid3X3, MapPin, Beaker, BarChart3 } from "lucide-react";

// Lazy load tab content components for performance
const OutilsOverviewContent = lazy(() => import("@/components/content/OutilsOverviewContent"));
const CalculateurContent = lazy(() => import("@/components/content/CalculateurContent"));
const FormulationContent = lazy(() => import("@/components/content/FormulationContent"));
const SynergiesContent = lazy(() => import("@/components/content/SynergiesContent"));
const VisualisationsContent = lazy(() => import("@/components/content/VisualisationsContent"));

/**
 * OutilsHub - Consolidated page for all tools and calculators
 * 
 * This page consolidates the following routes:
 * - /outils → Vue d'ensemble des outils
 * - /calculateur → Calculateurs (dilution, coût, IFRA)
 * - /outils/editeur-formulation → Éditeur de formulation
 * - /suggestions-synergies → Suggestions de synergies
 * - /compare-radar → Comparaison radar
 * 
 * Legacy routes are automatically redirected here with the appropriate tab.
 */
export default function OutilsHub() {
  const searchString = useSearch();
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(searchString);
  
  // Get tab from URL or default to "overview"
  const urlTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(urlTab);

  // Handle tab change and update URL
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newParams = new URLSearchParams(searchString);
    newParams.set("tab", value);
    setLocation(`/outils-hub?${newParams.toString()}`, { replace: true });
  };

  const tabs = [
    {
      id: "overview",
      label: "Vue d'ensemble",
      icon: <Grid3X3 className="h-4 w-4" />,
      description: "Tous les outils PERFUMUM"
    },
    {
      id: "calculateurs",
      label: "Calculateurs",
      icon: <Calculator className="h-4 w-4" />,
      description: "Dilution, coût, conformité IFRA"
    },
    {
      id: "formulation",
      label: "Formulation",
      icon: <FlaskConical className="h-4 w-4" />,
      description: "Éditeur et générateur de formules"
    },
    {
      id: "synergies",
      label: "Synergies",
      icon: <Network className="h-4 w-4" />,
      description: "Suggestions et matrice de synergies"
    },
    {
      id: "visualisations",
      label: "Visualisations",
      icon: <BarChart3 className="h-4 w-4" />,
      description: "Graphes, radars et cartes"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1 container py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Outils & Calculateurs
          </h1>
          <p className="text-muted-foreground">
            Outils de recherche PERFUMUM : {tabs.find(t => t.id === activeTab)?.description}
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
          <TabsContent value="overview" className="mt-0">
            <Suspense fallback={<TabLoadingState />}>
              <OutilsOverviewContent />
            </Suspense>
          </TabsContent>

          <TabsContent value="calculateurs" className="mt-0">
            <Suspense fallback={<TabLoadingState />}>
              <CalculateurContent />
            </Suspense>
          </TabsContent>

          <TabsContent value="formulation" className="mt-0">
            <Suspense fallback={<TabLoadingState />}>
              <FormulationContent />
            </Suspense>
          </TabsContent>

          <TabsContent value="synergies" className="mt-0">
            <Suspense fallback={<TabLoadingState />}>
              <SynergiesContent />
            </Suspense>
          </TabsContent>

          <TabsContent value="visualisations" className="mt-0">
            <Suspense fallback={<TabLoadingState />}>
              <VisualisationsContent />
            </Suspense>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
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
