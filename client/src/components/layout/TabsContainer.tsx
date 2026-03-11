import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useSearch } from "wouter";
import { useEffect, useState, ReactNode, Suspense, lazy, ComponentType } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { cn } from "@/lib/utils";

export interface TabConfig {
  id: string;
  label: string;
  icon?: ReactNode;
  component: ComponentType<any>;
  props?: Record<string, any>;
  /** Legacy routes that should redirect to this tab */
  legacyRoutes?: string[];
}

interface TabsContainerProps {
  tabs: TabConfig[];
  defaultTab?: string;
  basePath: string;
  title?: string;
  description?: string;
  className?: string;
  /** Preserve tab state in URL query param */
  persistTab?: boolean;
  /** Custom header content */
  headerContent?: ReactNode;
  /** Orientation of tabs */
  orientation?: "horizontal" | "vertical";
}

/**
 * TabsContainer - A reusable container for consolidated pages with tabs
 * 
 * This component enables the consolidation of multiple pages into a single
 * page with tabs, while preserving all functionality and data.
 * 
 * Features:
 * - URL-based tab persistence (?tab=xxx)
 * - Lazy loading of tab content
 * - Legacy route redirection support
 * - Responsive design (horizontal on desktop, vertical on mobile)
 * - Keyboard navigation
 */
export function TabsContainer({
  tabs,
  defaultTab,
  basePath,
  title,
  description,
  className,
  persistTab = true,
  headerContent,
  orientation = "horizontal",
}: TabsContainerProps) {
  const [location, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  
  // Get initial tab from URL or default
  const urlTab = searchParams.get("tab");
  const initialTab = urlTab || defaultTab || tabs[0]?.id;
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync tab with URL
  useEffect(() => {
    if (persistTab && urlTab !== activeTab) {
      const newParams = new URLSearchParams(searchString);
      newParams.set("tab", activeTab);
      setLocation(`${basePath}?${newParams.toString()}`, { replace: true });
    }
  }, [activeTab, persistTab, basePath, searchString, urlTab, setLocation]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Find current tab config
  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];

  return (
    <div className={cn("flex flex-col min-h-0", className)}>
      {/* Header */}
      {(title || description || headerContent) && (
        <div className="mb-6">
          {title && (
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
          {headerContent}
        </div>
      )}

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        orientation={orientation}
        className="flex-1 flex flex-col min-h-0"
      >
        {/* Tab List */}
        <TabsList
          className={cn(
            "mb-4 flex-wrap justify-start",
            orientation === "vertical" && "flex-col items-start h-auto"
          )}
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                "flex items-center gap-2",
                orientation === "vertical" && "w-full justify-start"
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Content */}
        {tabs.map((tab) => (
          <TabsContent
            key={tab.id}
            value={tab.id}
            className="flex-1 min-h-0 data-[state=inactive]:hidden"
          >
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-64">
                  <LoadingSpinner />
                </div>
              }
            >
              <tab.component {...(tab.props || {})} />
            </Suspense>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

/**
 * Hook to handle legacy route redirections
 * Use this in App.tsx to redirect old routes to new consolidated pages
 */
export function useLegacyRouteRedirect(
  legacyRoutes: Record<string, { path: string; tab: string }>
) {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const redirect = legacyRoutes[location];
    if (redirect) {
      setLocation(`${redirect.path}?tab=${redirect.tab}`, { replace: true });
    }
  }, [location, legacyRoutes, setLocation]);
}

/**
 * Create a redirect component for legacy routes
 */
export function createLegacyRedirect(newPath: string, tab: string) {
  return function LegacyRedirect() {
    const [, setLocation] = useLocation();
    
    useEffect(() => {
      setLocation(`${newPath}?tab=${tab}`, { replace: true });
    }, [setLocation]);
    
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
        <span className="ml-2 text-muted-foreground">Redirection...</span>
      </div>
    );
  };
}

export default TabsContainer;
