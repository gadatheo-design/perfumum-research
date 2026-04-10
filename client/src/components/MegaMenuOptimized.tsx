// @ts-nocheck
/**
 * MegaMenuOptimized.tsx — Refonte 10 avril 2026
 * Consomme directement NAV_GROUPS depuis navigationConfig.ts.
 * Nouvelles fonctionnalités :
 *   - Featured item mis en avant par groupe
 *   - Description de groupe sous le trigger
 *   - Liens "Voir tout" par section
 *   - Indicateur de page active
 *   - Badges colorés (HUB, ADMIN, NEW, custom)
 *   - Panel multi-colonnes adaptatif
 */
import React, { useState, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import {
  NAV_GROUPS,
  NavGroup,
  NavSection,
  NavItem,
} from "@/config/navigationConfig";
import {
  Database, Leaf, Compass, BarChart3, Zap, FlaskConical,
  Microscope, BookOpen, Archive, Globe, Info, FileText,
  Brain, Flame, Layers, TestTube, BarChart2, Atom,
  MapPin, TreePine,
} from "lucide-react";

// ── Résolution des icônes ─────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Database, Leaf, Compass, BarChart3, Zap, FlaskConical,
  Microscope, BookOpen, Archive, Globe, Info, FileText,
  Brain, Flame, Layers, TestTube, BarChart2, Atom,
  MapPin, TreePine,
};
function resolveIcon(name: string): React.ReactNode {
  const Icon = ICON_MAP[name];
  return Icon ? <Icon className="h-3.5 w-3.5" /> : null;
}

// ── Badge coloré ──────────────────────────────────────────────────────────────
function NavBadge({ badge }: { badge: string }) {
  if (!badge) return null;
  const isHub = badge === "HUB";
  const isAdmin = badge === "ADMIN";
  const isNew = badge === "NEW";
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide leading-none shrink-0",
        isHub && "bg-primary/15 text-primary border border-primary/20",
        isAdmin && "bg-destructive/15 text-destructive border border-destructive/20",
        isNew && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
        !isHub && !isAdmin && !isNew && "bg-muted text-muted-foreground border border-border/40",
      )}
    >
      {badge}
    </span>
  );
}

// ── Item de menu ──────────────────────────────────────────────────────────────
function MenuItem({ item, isActive, onClick }: { item: NavItem; isActive: boolean; onClick?: () => void }) {
  return (
    <Link href={item.href} onClick={onClick}>
      <motion.div
        whileHover={{ x: 3 }}
        transition={{ duration: 0.12, type: "spring", stiffness: 500 }}
        className={cn(
          "flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-sm cursor-pointer",
          "transition-colors duration-150",
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
        )}
      >
        <span className="truncate leading-snug">{item.label}</span>
        <div className="flex items-center gap-1 shrink-0">
          {item.badge && <NavBadge badge={item.badge} />}
          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
        </div>
      </motion.div>
    </Link>
  );
}

// ── Section du panneau ────────────────────────────────────────────────────────
function MenuSection({ section, currentPath, onNavigate }: { section: NavSection; currentPath: string; onNavigate: () => void }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground/70">{resolveIcon(section.icon)}</span>
          <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">{section.title}</span>
        </div>
        {section.viewAllHref && (
          <Link href={section.viewAllHref} onClick={onNavigate}>
            <span className="text-[10px] text-primary/70 hover:text-primary flex items-center gap-0.5 transition-colors cursor-pointer">
              Tout voir <ArrowRight className="h-2.5 w-2.5" />
            </span>
          </Link>
        )}
      </div>
      <div className="space-y-0.5">
        {(section.items ?? []).map((item) => (
          <MenuItem key={item.href} item={item} isActive={currentPath === item.href} onClick={onNavigate} />
        ))}
      </div>
    </div>
  );
}

// ── Panneau d'un groupe ───────────────────────────────────────────────────────
function GroupPanel({ group, currentPath, onNavigate }: { group: NavGroup; currentPath: string; onNavigate: () => void }) {
  const sectionCount = group.sections.length;
  const gridCols =
    sectionCount <= 2 ? "grid-cols-2" :
    sectionCount === 3 ? "grid-cols-3" :
    "grid-cols-4";

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
    >
      {/* Header du panneau */}
      {(group.description || group.featured) && (
        <div className="px-5 pt-4 pb-3 border-b border-border/40 flex items-center gap-4">
          <p className="flex-1 text-xs text-muted-foreground/70 font-medium uppercase tracking-wider">
            {group.description}
          </p>
          {group.featured && (
            <Link href={group.featured.href} onClick={onNavigate}>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/8 hover:bg-primary/15 border border-primary/15 transition-colors cursor-pointer group/feat">
                <Sparkles className="h-3 w-3 text-primary shrink-0" />
                <span className="text-xs font-medium text-primary whitespace-nowrap">{group.featured.label}</span>
                <ArrowRight className="h-3 w-3 text-primary opacity-0 group-hover/feat:opacity-100 transition-opacity" />
              </div>
            </Link>
          )}
        </div>
      )}
      {/* Grille des sections */}
      <div className={cn("grid gap-x-6 gap-y-4 p-5", gridCols)}>
        {group.sections.map((section, idx) => (
          <MenuSection key={idx} section={section} currentPath={currentPath} onNavigate={onNavigate} />
        ))}
      </div>
    </motion.div>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────
export function MegaNav() {
  const [location] = useLocation();
  const handleNavigate = useCallback(() => {}, []);

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList className="gap-0">
        {NAV_GROUPS.map((group) => {
          const hasActive = group.sections.some((s) =>
            (s.items ?? []).some((item) => item.href === location)
          );
          const panelWidth =
            group.sections.length <= 2 ? "min-w-[480px]" :
            group.sections.length === 3 ? "min-w-[680px]" :
            "min-w-[880px]";

          return (
            <NavigationMenuItem key={group.trigger}>
              <NavigationMenuTrigger
                className={cn(
                  "h-9 px-3 text-sm font-medium rounded-md transition-colors",
                  "bg-transparent hover:bg-muted/60 data-[state=open]:bg-muted/60",
                  hasActive ? "text-primary font-semibold" : "text-foreground/80 hover:text-foreground",
                )}
              >
                <span>{group.trigger}</span>
                {hasActive && <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-primary inline-block" />}
              </NavigationMenuTrigger>
              <NavigationMenuContent
                className={cn(
                  "absolute top-full left-0 mt-1",
                  "bg-background/98 backdrop-blur-xl",
                  "border border-border/60 rounded-xl shadow-2xl shadow-black/10",
                  "overflow-hidden",
                  panelWidth,
                )}
              >
                <GroupPanel group={group} currentPath={location} onNavigate={handleNavigate} />
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

// ── Exports de compatibilité (Header.tsx importe encore ces symboles) ─────────
export interface MegaMenuSection {
  id: string;
  title: string;
  icon?: React.ReactNode;
  items: Array<{ id: string; label: string; href: string; badge?: string }>;
}
export interface MegaMenuOptimizedProps {
  sections: MegaMenuSection[];
  trigger: string;
  useVirtualization?: boolean;
  maxVisibleItems?: number;
}
export const MegaMenuOptimized: React.FC<MegaMenuOptimizedProps> = () => null;
export const useMegaMenuSections = (data: any[]): MegaMenuSection[] =>
  data.map((section, index) => ({
    id: `section-${index}`,
    title: section.category,
    icon: section.icon,
    items: section.items,
  }));
export const useMegaMenuPerformance = () => ({ renderTime: 0, measureRender: () => {} });
