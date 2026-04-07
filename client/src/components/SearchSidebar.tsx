/**
 * SearchSidebar.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Barre de recherche persistante sur le côté pour la version desktop
 * - Affichée uniquement sur desktop (lg+)
 * - Toujours visible et accessible
 * - Intègre SmartSearch pour la recherche globale
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { motion } from "framer-motion";
import { SmartSearch } from "@/components/SmartSearch";
import { Link } from "wouter";

export function SearchSidebar() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="hidden lg:flex fixed right-0 top-0 h-screen w-72 flex-col border-l border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/90 z-40 pt-[72px] px-5 py-8 overflow-y-auto"
      role="complementary"
      aria-label="Barre de recherche"
    >
      {/* Titre */}
      <div className="mb-6 pb-4 border-b border-border/30">
        <h2 className="text-xs font-bold text-foreground/60 tracking-widest uppercase">
          Recherche
        </h2>
      </div>

      {/* Composant de recherche */}
      <div className="mb-8">
        <SmartSearch
          variant="compact"
          placeholder="Chercher..."
          autoFocus={false}
        />
      </div>

      {/* Suggestions rapides */}
      <div className="flex-1">
        <p className="text-xs font-bold text-foreground/50 tracking-widest uppercase mb-4">
          Accès rapide
        </p>
        <nav className="space-y-1">
          {[
            { label: "Molécules", href: "/molecules" },
            { label: "Recettes", href: "/recettes" },
            { label: "Plantes", href: "/plantes" },
            { label: "Accords", href: "/accords" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block text-sm text-foreground/70 hover:text-foreground transition-all py-2.5 px-3 rounded-lg hover:bg-muted/40 active:bg-muted/60"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </motion.aside>
  );
}
