// @ts-nocheck
import { lazy, Suspense, useState } from "react";
import { useSearch, useLocation } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Droplets, Flame, Snowflake, Beaker, Sun, Grid3X3 } from "lucide-react";

// Lazy load tab content components for performance
const GammesOverview = lazy(() => import("@/pages/Gammes"));
const PetrichorContent = lazy(() => import("@/components/content/PetrichorContent"));
const VolcaniqueContent = lazy(() => import("@/components/content/VolcaniqueContent"));
const GlaciaireContent = lazy(() => import("@/components/content/GlaciaireContent"));
const BioLabContent = lazy(() => import("@/components/content/BioLabContent"));
const MossiContent = lazy(() => import("@/components/content/MossiContent"));

/**
 * GammesHub - Consolidated page for all olfactive ranges (gammes)
 * 
 * This page consolidates the following routes:
 * - /gammes → Vue d'ensemble des gammes
 * - /gammes/petrichor → Gamme Pétrichor
 * - /gammes/volcanique → Gamme Volcanique
 * - /gammes/glaciaire → Gamme Glaciaire
 * - /gammes/bio-lab → Gamme Bio-Lab
 * - /gammes/mossi → Gamme Mossi
 * 
 * Legacy routes are automatically redirected here with the appropriate tab.
 */
export default function GammesHub() {
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
    setLocation(`/gammes-hub?${newParams.toString()}`, { replace: true });
  };

  const tabs = [
    {
      id: "overview",
      label: "Vue d'ensemble",
      icon: <Grid3X3 className="h-4 w-4" />,
      description: "Toutes les gammes olfactives PERFUMUM"
    },
    {
      id: "petrichor",
      label: "Pétrichor",
      icon: <Droplets className="h-4 w-4" />,
      description: "L'odeur de la terre après la pluie"
    },
    {
      id: "volcanique",
      label: "Volcanique",
      icon: <Flame className="h-4 w-4" />,
      description: "Les odeurs du feu terrestre"
    },
    {
      id: "glaciaire",
      label: "Glaciaire",
      icon: <Snowflake className="h-4 w-4" />,
      description: "Les fragrances du froid extrême"
    },
    {
      id: "bio-lab",
      label: "Bio-Lab",
      icon: <Beaker className="h-4 w-4" />,
      description: "La vie microscopique"
    },
    {
      id: "mossi",
      label: "Mossi",
      icon: <Sun className="h-4 w-4" />,
      description: "Traditions olfactives du Burkina Faso"
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
            Gammes Olfactives
          </h1>
          <p className="text-muted-foreground">
            Explorez les gammes olfactives PERFUMUM : {tabs.find(t => t.id === activeTab)?.description}
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
              <GammesOverviewContent />
            </Suspense>
          </TabsContent>

          <TabsContent value="petrichor" className="mt-0">
            <Suspense fallback={<TabLoadingState />}>
              <PetrichorContent />
            </Suspense>
          </TabsContent>

          <TabsContent value="volcanique" className="mt-0">
            <Suspense fallback={<TabLoadingState />}>
              <VolcaniqueContent />
            </Suspense>
          </TabsContent>

          <TabsContent value="glaciaire" className="mt-0">
            <Suspense fallback={<TabLoadingState />}>
              <GlaciaireContent />
            </Suspense>
          </TabsContent>

          <TabsContent value="bio-lab" className="mt-0">
            <Suspense fallback={<TabLoadingState />}>
              <BioLabContent />
            </Suspense>
          </TabsContent>

          <TabsContent value="mossi" className="mt-0">
            <Suspense fallback={<TabLoadingState />}>
              <MossiContent />
            </Suspense>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}

// Simplified overview content that doesn't include Header/Footer
function GammesOverviewContent() {
  // Import the main content from Gammes page but without layout
  const GammesContent = lazy(() => import("@/components/content/GammesOverviewContent"));
  return (
    <Suspense fallback={<TabLoadingState />}>
      <GammesContent />
    </Suspense>
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
