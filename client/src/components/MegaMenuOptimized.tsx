import React, { useMemo, useCallback, useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

/**
 * Virtual List Component for rendering large lists efficiently
 * Only renders visible items to improve performance
 */
interface VirtualListProps {
  items: Array<{ id: string; label: string; href: string; badge?: string }>;
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: { id: string; label: string; href: string; badge?: string }) => React.ReactNode;
}

const VirtualList: React.FC<VirtualListProps> = ({
  items,
  itemHeight,
  containerHeight,
  renderItem,
}) => {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.ceil((scrollTop + containerHeight) / itemHeight);
  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setScrollTop(target.scrollTop);
  }, []);

  return (
    <div
      style={{ height: containerHeight, overflow: "auto" }}
      onScroll={handleScroll}
      className="bg-background border border-border rounded-md"
    >
      <div style={{ height: items.length * itemHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item) => (
            <div key={item.id} style={{ height: itemHeight }}>
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Menu Item Component
 */
interface MenuItemProps {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, href, icon, badge }) => {
  const [location] = useLocation();
  const isActive = location === href || (href !== '/' && location.startsWith(href));
  return (
    <a
      href={href}
      className={cn(
        "group block px-4 py-2 text-sm rounded-sm transition-all duration-150 ease-in-out",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "whitespace-nowrap min-w-[180px] relative",
        isActive
          ? "bg-primary/10 text-primary font-semibold"
          : "text-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-primary rounded-r-full" />
      )}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {icon && <span className="text-xs">{icon}</span>}
          <span>{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {badge && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-primary text-primary-foreground">
              {badge}
            </span>
          )}
          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity -translate-x-1 group-hover:translate-x-0 transition-transform duration-150" />
        </div>
      </div>
    </a>
  );
};

/**
 * Optimized MegaMenu Component with Virtualization
 * Supports large menus with 100+ items without performance degradation
 */
interface MegaMenuSection {
  id: string;
  title: string;
  items: Array<{ id: string; label: string; href: string; badge?: string }>;
  icon?: React.ReactNode;
}

interface MegaMenuOptimizedProps {
  sections: MegaMenuSection[];
  trigger: string;
  useVirtualization?: boolean;
  maxVisibleItems?: number;
}

export const MegaMenuOptimized: React.FC<MegaMenuOptimizedProps> = ({
  sections,
  trigger,
  useVirtualization = true,
  maxVisibleItems = 8,
}) => {
  // Calculate total items
  const totalItems = useMemo(
    () => sections.reduce((sum, section) => sum + section.items.length, 0),
    [sections]
  );

  // Determine if virtualization should be used
  const shouldVirtualize = useVirtualization && totalItems > 50;

  // Render section with virtualization if needed
  const renderSection = useCallback(
    (section: MegaMenuSection) => {
      const itemsToShow = section.items.slice(0, maxVisibleItems);
      const hasMore = section.items.length > maxVisibleItems;

      if (shouldVirtualize && section.items.length > maxVisibleItems) {
        return (
          <div key={section.id} className="space-y-2">
            <h3 className="px-4 py-2 text-sm font-semibold text-foreground flex items-center gap-2">
              {section.icon && <span>{section.icon}</span>}
              {section.title}
            </h3>
            <VirtualList
              items={section.items}
              itemHeight={40}
              containerHeight={Math.min(section.items.length * 40, 320)}
              renderItem={(item) => (
                <MenuItem
                  key={item.id}
                  label={item.label}
                  href={item.href}
                  badge={item.badge}
                />
              )}
            />
            {hasMore && (
              <a
                href={`/${section.id}`}
                className="block px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Voir tous ({section.items.length})
              </a>
            )}
          </div>
        );
      }

      return (
        <div key={section.id} className="space-y-2">
          <h3 className="px-4 py-2 text-sm font-semibold text-foreground flex items-center gap-2">
            {section.icon && <span>{section.icon}</span>}
            {section.title}
          </h3>
          <div className="space-y-1">
            {itemsToShow.map((item) => (
              <MenuItem
                key={item.id}
                label={item.label}
                href={item.href}
                badge={item.badge}
              />
            ))}
          </div>
          {hasMore && (
            <a
              href={`/${section.id}`}
              className="block px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Voir tous ({section.items.length})
            </a>
          )}
        </div>
      );
    },
    [shouldVirtualize, maxVisibleItems]
  );

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center gap-1">
            {trigger}
            <ChevronDown className="h-4 w-4 transition-transform duration-200" />
          </NavigationMenuTrigger>
          <NavigationMenuContent className="w-full md:w-auto min-w-[600px]">
            <div
              className={cn(
                "grid gap-4 p-4",
                "md:grid-cols-2 lg:grid-cols-4",
                "max-h-[80vh] overflow-y-auto"
              )}
            >
              {sections.map(renderSection)}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

/**
 * Hook for managing MegaMenu sections
 */
export const useMegaMenuSections = (
  data: Array<{ category: string; icon?: React.ReactNode; items: Array<{ id: string; label: string; href: string; badge?: string }> }>
): MegaMenuSection[] => {
  return useMemo(
    () =>
      data.map((section, index) => ({
        id: `section-${index}`,
        title: section.category,
        icon: section.icon,
        items: section.items,
      })),
    [data]
  );
};

/**
 * Performance monitoring hook
 */
export const useMegaMenuPerformance = () => {
  const [renderTime, setRenderTime] = useState<number>(0);

  const measureRender = useCallback((startTime: number) => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    setRenderTime(duration);

    // Log performance metrics
    if (duration > 100) {
      console.warn(`MegaMenu render took ${safeToFixed(duration, 2)}ms`);
    }
  }, []);

  return { renderTime, measureRender };
};

/**
 * Example usage:
 *
 * const sections = [
 *   {
 *     category: "Gammes",
 *     items: [
 *       { id: "1", label: "Pétrichor", href: "/gammes-hub?tab=petrichor" },
 *       { id: "2", label: "Volcanique", href: "/gammes-hub?tab=volcanique" },
 *       // ... more items
 *     ]
 *   },
 *   // ... more sections
 * ];
 *
 * const menuSections = useMegaMenuSections(sections);
 *
 * <MegaMenuOptimized
 *   sections={menuSections}
 *   trigger="Menu"
 *   useVirtualization={true}
 *   maxVisibleItems={8}
 * />
 */
