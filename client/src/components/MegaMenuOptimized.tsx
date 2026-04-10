/**
 * MegaMenuOptimized.tsx — Refonte 11 avril 2026
 * Implémentation custom (sans Radix NavigationMenu) pour garantir
 * un fond opaque et un positionnement correct du panneau dropdown.
 */
import React, { useState, useCallback, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
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
      <div
        className={cn(
          "flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-sm cursor-pointer",
          "transition-all duration-100 hover:translate-x-0.5",
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
      </div>
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
    <div>
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
    </div>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────
export function MegaNav() {
  const [location] = useLocation();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = useCallback((trigger: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenGroup(trigger);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpenGroup(null), 120);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const closeNow = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenGroup(null);
  }, []);

  return (
    <nav className="hidden lg:flex items-center gap-0 relative">
      {NAV_GROUPS.map((group) => {
        const hasActive = group.sections.some((s) =>
          (s.items ?? []).some((item) => item.href === location)
        );
        const isOpen = openGroup === group.trigger;
        const panelWidth =
          group.sections.length <= 2 ? "min-w-[480px]" :
          group.sections.length === 3 ? "min-w-[680px]" :
          "min-w-[880px]";

        return (
          <div
            key={group.trigger}
            className="relative"
            onMouseEnter={() => openMenu(group.trigger)}
            onMouseLeave={scheduleClose}
          >
            {/* Trigger */}
            <button
              className={cn(
                "h-9 px-3 text-sm font-medium rounded-md transition-colors flex items-center gap-1",
                "bg-transparent hover:bg-muted/60",
                isOpen && "bg-muted/60",
                hasActive ? "text-primary font-semibold" : "text-foreground/80 hover:text-foreground",
              )}
              onClick={() => isOpen ? closeNow() : openMenu(group.trigger)}
            >
              <span>{group.trigger}</span>
              {hasActive && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
              <ChevronDown
                className={cn(
                  "h-3 w-3 ml-0.5 transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            </button>

            {/* Panneau dropdown */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className={cn(
                    "absolute top-full left-0 mt-1 z-[9999]",
                    "rounded-xl overflow-hidden mega-menu-panel",
                    panelWidth,
                  )}
                  onMouseEnter={cancelClose}
                  onMouseLeave={scheduleClose}
                >
                  <GroupPanel
                    group={group}
                    currentPath={location}
                    onNavigate={closeNow}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </nav>
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
  activeHref?: string;
}
/** @deprecated Utiliser MegaNav directement */
export function MegaMenuOptimizedNav(_props: MegaMenuOptimizedProps) {
  return null;
}
