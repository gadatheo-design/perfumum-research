import { useState, Suspense, lazy } from "react";
import { useSearch, useLocation } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Atom, Layers, FlaskConical, Network } from "lucide-react";

// Lazy load tab content components for performance
const MoleculesContent = lazy(() => import("@/components/content/MoleculesContent"));
const FamillesContent = lazy(() => import("@/components/content/FamillesContent"));
const ChemicalFamiliesContentComponent = lazy(() => import("@/components/content/ChemicalFamiliesContent"));
const ChemicalFamilyGraphContent = lazy(() => import("./ChemicalFamilyGraph"));

/**
 * MoleculesHub - Consolidated page for all molecule-related content
 * 
 * This page consolidates the following routes:
 * - /molecules → Liste des molécules
 * - /familles → Familles olfactives
 * - /chemical-families → Familles chimiques
 * - /chemical-family-graph → Graphe des familles chimiques
 * 
 * Legacy routes are automatically redirected here with the appropriate tab.
 */
export default function MoleculesHub() {
  const searchString = useSearch();
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(searchString);
  
  // Get tab from URL or default to "liste"
  const urlTab = searchParams.get("tab") || "liste";
  const [activeTab, setActiveTab] = useState(urlTab);

  // Handle tab change and update URL
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newParams = new URLSearchParams(searchString);
    newParams.set("tab", value);
    setLocation(`/molecules?${newParams.toString()}`, { replace: true });
  };

  const tabs = [
    {
      id: "liste",
      label: "Liste",
      icon: <Atom className="h-4 w-4" />,
      description: "Toutes les molécules de la base de données"
    },
    {
      id: "familles",
      label: "Familles Olfactives",
      icon: <Layers className="h-4 w-4" />,
      description: "Bio-Mineralis, Pétrichor, Volcanique..."
    },
    {
      id: "chimiques",
      label: "Familles Chimiques",
      icon: <FlaskConical className="h-4 w-4" />,
      description: "Terpènes, Aldéhydes, Esters..."
    },
    {
      id: "graphe",
      label: "Graphe",
      icon: <Network className="h-4 w-4" />,
      description: "Visualisation des relations"
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
            Molécules
          </h1>
          <p className="text-muted-foreground">
            Explorez la base de données moléculaire PERFUMUM : {tabs.find(t => t.id === activeTab)?.description}
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
          <TabsContent value="liste" className="mt-0">
            <Suspense fallback={<TabLoadingState />}>
              <MoleculesContent />
            </Suspense>
          </TabsContent>

          <TabsContent value="familles" className="mt-0">
            <Suspense fallback={<TabLoadingState />}>
              <FamillesContent />
            </Suspense>
          </TabsContent>

          <TabsContent value="chimiques" className="mt-0">
            <Suspense fallback={<TabLoadingState />}>
              <ChemicalFamiliesContentComponent />
            </Suspense>
          </TabsContent>

          <TabsContent value="graphe" className="mt-0">
            <Suspense fallback={<TabLoadingState />}>
              <ChemicalFamilyGraphContent />
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
