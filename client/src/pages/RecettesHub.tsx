import { useState, Suspense, lazy } from "react";
import { useSearch, useLocation } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { FlaskConical, Sparkles, BookOpen, Layers } from "lucide-react";

// Lazy load tab content components for performance
const RecettesContent = lazy(() => import("@/components/content/RecettesContent"));
const AccordsContent = lazy(() => import("@/components/content/AccordsContent"));
const FormulesReferenceContent = lazy(() => import("@/components/content/FormulesReferenceContent"));

/**
 * RecettesHub - Consolidated page for all recipe-related content
 * 
 * This page consolidates the following routes:
 * - /recettes → Liste des recettes
 * - /accords → Accords olfactifs
 * - /formules-reference → Formules de référence classiques
 * 
 * Legacy routes are automatically redirected here with the appropriate tab.
 */
export default function RecettesHub() {
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
    setLocation(`/recettes?${newParams.toString()}`, { replace: true });
  };

  const tabs = [
    {
      id: "liste",
      label: "Recettes",
      icon: <FlaskConical className="h-4 w-4" />,
      description: "Toutes les formules olfactives PERFUMUM"
    },
    {
      id: "accords",
      label: "Accords",
      icon: <Sparkles className="h-4 w-4" />,
      description: "Unités compositionnelles et harmonies olfactives"
    },
    {
      id: "formules",
      label: "Formules de Référence",
      icon: <BookOpen className="h-4 w-4" />,
      description: "Formules classiques de la parfumerie"
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
            Recettes & Formules
          </h1>
          <p className="text-muted-foreground">
            Explorez les formulations PERFUMUM : {tabs.find(t => t.id === activeTab)?.description}
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
              <RecettesContent />
            </Suspense>
          </TabsContent>

          <TabsContent value="accords" className="mt-0">
            <Suspense fallback={<TabLoadingState />}>
              <AccordsContent />
            </Suspense>
          </TabsContent>

          <TabsContent value="formules" className="mt-0">
            <Suspense fallback={<TabLoadingState />}>
              <FormulesReferenceContent />
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
