/**
 * AdvancedSearchFilter.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Interface de filtrage avancée — Architecture SPARQL-ready
 *
 * Conçu pour préparer l'intégration des requêtes fédérées du Rapport 7 :
 *   • PERFUMUM ↔ Wikidata (propriétés chimiques, taxons)
 *   • PERFUMUM ↔ OpenAlex (publications scientifiques)
 *   • PERFUMUM ↔ Europeana (iconographie patrimoniale)
 *
 * Architecture :
 *   - FilterState : état unifié, extensible pour les sources fédérées
 *   - FederatedSourceSlot : composant de slot pour sources futures (désactivé mais visible)
 *   - AdvancedSearchFilter : composant principal exporté
 *
 * Usage dans Home.tsx :
 *   <AdvancedSearchFilter onResults={handleResults} />
 */

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search, Filter, X, ChevronDown, ChevronUp, Loader2,
  FlaskConical, Leaf, MapPin, Database, Network,
  Globe2, BookOpen, Image, Zap, Clock, AlertCircle,
  ExternalLink, ArrowRight, SlidersHorizontal, Tag,
  Microscope, Layers, Sparkles, Lock
} from "lucide-react";
import { Link } from "wouter";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FilterState {
  // Recherche textuelle
  searchQuery: string;
  // Filtres Terroirs
  terroirCountries: string[];
  terroirClimates: string[];
  // Filtres Plantes
  plantCategories: string[];
  plantFamilies: string[];
  // Filtres Molécules
  moleculeFamilies: string[];
  chemicalClasses: string[];
  // Sources fédérées (Rapport 7 — désactivées pour l'instant)
  federatedSources: {
    wikidata: boolean;
    openAlex: boolean;
    europeana: boolean;
  };
  // Filtres temporels (Rapport 7 — templates SPARQL temporels)
  temporalFilter: {
    enabled: boolean;
    startYear: number | null;
    endYear: number | null;
  };
}

const DEFAULT_FILTER_STATE: FilterState = {
  searchQuery: "",
  terroirCountries: [],
  terroirClimates: [],
  plantCategories: [],
  plantFamilies: [],
  moleculeFamilies: [],
  chemicalClasses: [],
  federatedSources: { wikidata: false, openAlex: false, europeana: false },
  temporalFilter: { enabled: false, startYear: null, endYear: null },
};

// ─── Sous-composant : Slot de source fédérée (Rapport 7) ──────────────────────

function FederatedSourceSlot({
  icon,
  label,
  description,
  color,
  rapportLabel,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
  rapportLabel: string;
}) {
  return (
    <div
      className={`relative flex items-start gap-3 p-3 rounded-lg border border-dashed border-border/50 bg-muted/20 opacity-60 cursor-not-allowed select-none`}
      title="Disponible dans le Rapport 7"
    >
      <div className={`mt-0.5 w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-semibold text-foreground/70">{label}</span>
          <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-amber-500/40 text-amber-600/70">
            <Lock className="w-2 h-2 mr-0.5" />
            {rapportLabel}
          </Badge>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// ─── Sous-composant : Chip de filtre actif ────────────────────────────────────

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 hover:text-primary/60 transition-colors"
        aria-label={`Supprimer le filtre ${label}`}
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

// ─── Sous-composant : Section de filtre pliable ───────────────────────────────

function FilterSection({
  title,
  icon,
  count,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ReactNode;
  count?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/30 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-2.5 px-1 hover:bg-muted/30 rounded-md transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{icon}</span>
          <span className="text-xs font-semibold text-foreground/80 uppercase tracking-wide">{title}</span>
          {count !== undefined && count > 0 && (
            <Badge className="text-[9px] h-4 px-1.5 bg-primary/15 text-primary border-0">
              {count}
            </Badge>
          )}
        </div>
        {open ? (
          <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </button>
      {open && <div className="pb-3 px-1">{children}</div>}
    </div>
  );
}

// ─── Sous-composant : Groupe de checkboxes ────────────────────────────────────

function CheckboxGroup({
  options,
  selected,
  onToggle,
  maxVisible = 8,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  maxVisible?: number;
}) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? options : options.slice(0, maxVisible);

  if (options.length === 0) {
    return <p className="text-xs text-muted-foreground italic py-1">Aucune option disponible</p>;
  }

  return (
    <div className="space-y-1">
      {visible.map((opt) => (
        <label
          key={opt}
          className="flex items-center gap-2 py-0.5 cursor-pointer group"
        >
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => onToggle(opt)}
            className="w-3.5 h-3.5 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
          />
          <span className="text-xs text-foreground/80 group-hover:text-foreground transition-colors truncate">
            {opt}
          </span>
        </label>
      ))}
      {options.length > maxVisible && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-[11px] text-primary/70 hover:text-primary transition-colors mt-1 flex items-center gap-1"
        >
          {showAll ? (
            <><ChevronUp className="w-3 h-3" /> Réduire</>
          ) : (
            <><ChevronDown className="w-3 h-3" /> {options.length - maxVisible} de plus</>
          )}
        </button>
      )}
    </div>
  );
}

// ─── Composant principal : AdvancedSearchFilter ───────────────────────────────

interface AdvancedSearchFilterProps {
  onResults?: (results: any, filters: FilterState) => void;
  compact?: boolean;
}

export function AdvancedSearchFilter({ onResults, compact = false }: AdvancedSearchFilterProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const [panelOpen, setPanelOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ── Données de filtres disponibles ──────────────────────────────────────────
  const { data: filterOptions, isLoading: optionsLoading } = trpc.advancedSearch.getCrossSearchFilterOptions.useQuery(
    undefined,
    { staleTime: 1000 * 60 * 10 } // Cache 10 minutes
  );

  // ── Requête de recherche croisée ────────────────────────────────────────────
  const {
    data: searchResults,
    isLoading: searching,
    error: searchError,
    refetch,
  } = trpc.advancedSearch.crossSearch.useQuery(
    {
      searchQuery: filters.searchQuery || undefined,
      terroirCountries: filters.terroirCountries.length > 0 ? filters.terroirCountries : undefined,
      terroirClimates: filters.terroirClimates.length > 0 ? filters.terroirClimates : undefined,
      plantCategories: filters.plantCategories.length > 0 ? filters.plantCategories : undefined,
      plantFamilies: filters.plantFamilies.length > 0 ? filters.plantFamilies : undefined,
      moleculeFamilies: filters.moleculeFamilies.length > 0 ? filters.moleculeFamilies : undefined,
      chemicalClasses: filters.chemicalClasses.length > 0 ? filters.chemicalClasses : undefined,
      includeRelations: true,
    },
    {
      enabled: hasSearched,
      staleTime: 1000 * 60 * 2,
    }
  );

  // ── Notifier le parent des résultats ────────────────────────────────────────
  useEffect(() => {
    if (searchResults && onResults) {
      onResults(searchResults, filters);
    }
  }, [searchResults]);

  // ── Nombre de filtres actifs ─────────────────────────────────────────────────
  const activeFilterCount = useMemo(() => {
    return (
      filters.terroirCountries.length +
      filters.terroirClimates.length +
      filters.plantCategories.length +
      filters.plantFamilies.length +
      filters.moleculeFamilies.length +
      filters.chemicalClasses.length
    );
  }, [filters]);

  // ── Helpers pour toggle ──────────────────────────────────────────────────────
  const toggle = useCallback(
    (field: keyof Omit<FilterState, "searchQuery" | "federatedSources" | "temporalFilter">) =>
      (value: string) => {
        setFilters((prev) => {
          const arr = prev[field] as string[];
          return {
            ...prev,
            [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
          };
        });
      },
    []
  );

  const handleSearch = useCallback(() => {
    setHasSearched(true);
    refetch();
  }, [refetch]);

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTER_STATE);
    setHasSearched(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSearch();
    },
    [handleSearch]
  );

  // ── Chips des filtres actifs ─────────────────────────────────────────────────
  const activeChips = useMemo(() => {
    const chips: { label: string; field: string; value: string }[] = [];
    const add = (field: string, values: string[]) =>
      values.forEach((v) => chips.push({ label: v, field, value: v }));
    add("terroirCountries", filters.terroirCountries);
    add("terroirClimates", filters.terroirClimates);
    add("plantCategories", filters.plantCategories);
    add("plantFamilies", filters.plantFamilies);
    add("moleculeFamilies", filters.moleculeFamilies);
    add("chemicalClasses", filters.chemicalClasses);
    return chips;
  }, [filters]);

  const removeChip = useCallback((field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: (prev[field as keyof FilterState] as string[]).filter((v) => v !== value),
    }));
  }, []);

  return (
    <div className="w-full">
      {/* ── Barre de recherche principale ─────────────────────────────────── */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            ref={searchInputRef}
            placeholder="Rechercher molécules, plantes, terroirs, recettes…"
            value={filters.searchQuery}
            onChange={(e) => setFilters((p) => ({ ...p, searchQuery: e.target.value }))}
            onKeyDown={handleKeyDown}
            className="pl-9 pr-4 h-11 text-sm bg-background border-border/60 focus:border-primary/50"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((p) => ({ ...p, searchQuery: "" }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Bouton filtres avancés */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPanelOpen(!panelOpen)}
          className={`h-11 gap-2 flex-shrink-0 ${panelOpen ? "border-primary text-primary bg-primary/5" : ""}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline text-xs font-medium">Filtres</span>
          {activeFilterCount > 0 && (
            <Badge className="text-[9px] h-4 px-1.5 bg-primary text-primary-foreground border-0 ml-0.5">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {/* Bouton rechercher */}
        <Button
          size="sm"
          onClick={handleSearch}
          disabled={searching}
          className="h-11 gap-2 flex-shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {searching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span className="hidden sm:inline text-xs font-medium">Rechercher</span>
        </Button>
      </div>

      {/* ── Chips des filtres actifs ───────────────────────────────────────── */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {activeChips.map((chip) => (
            <FilterChip
              key={`${chip.field}-${chip.value}`}
              label={chip.label}
              onRemove={() => removeChip(chip.field, chip.value)}
            />
          ))}
          <button
            onClick={handleReset}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2 ml-1"
          >
            Tout effacer
          </button>
        </div>
      )}

      {/* ── Panneau de filtres avancés ─────────────────────────────────────── */}
      {panelOpen && (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Colonne 1 : Terroirs & Géographie */}
          <div className="bg-card border border-border/40 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/30">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground/70">Terroirs</span>
            </div>

            <FilterSection
              title="Pays"
              icon={<Globe2 className="w-3.5 h-3.5" />}
              count={filters.terroirCountries.length}
              defaultOpen
            >
              {optionsLoading ? (
                <div className="flex items-center gap-2 py-2">
                  <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Chargement…</span>
                </div>
              ) : (
                <CheckboxGroup
                  options={filterOptions?.terroirCountries || []}
                  selected={filters.terroirCountries}
                  onToggle={toggle("terroirCountries")}
                />
              )}
            </FilterSection>

            <FilterSection
              title="Climat Köppen"
              icon={<Layers className="w-3.5 h-3.5" />}
              count={filters.terroirClimates.length}
            >
              <CheckboxGroup
                options={filterOptions?.terroirClimates || []}
                selected={filters.terroirClimates}
                onToggle={toggle("terroirClimates")}
              />
            </FilterSection>
          </div>

          {/* Colonne 2 : Plantes & Familles */}
          <div className="bg-card border border-border/40 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/30">
              <Leaf className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground/70">Plantes & Molécules</span>
            </div>

            <FilterSection
              title="Catégories de plantes"
              icon={<Tag className="w-3.5 h-3.5" />}
              count={filters.plantCategories.length}
              defaultOpen
            >
              <CheckboxGroup
                options={filterOptions?.plantCategories || []}
                selected={filters.plantCategories}
                onToggle={toggle("plantCategories")}
              />
            </FilterSection>

            <FilterSection
              title="Familles botaniques"
              icon={<Leaf className="w-3.5 h-3.5" />}
              count={filters.plantFamilies.length}
            >
              <CheckboxGroup
                options={filterOptions?.plantFamilies || []}
                selected={filters.plantFamilies}
                onToggle={toggle("plantFamilies")}
              />
            </FilterSection>

            <FilterSection
              title="Familles moléculaires"
              icon={<FlaskConical className="w-3.5 h-3.5" />}
              count={filters.moleculeFamilies.length}
            >
              <CheckboxGroup
                options={filterOptions?.moleculeFamilies || []}
                selected={filters.moleculeFamilies}
                onToggle={toggle("moleculeFamilies")}
              />
            </FilterSection>

            <FilterSection
              title="Classes chimiques"
              icon={<Microscope className="w-3.5 h-3.5" />}
              count={filters.chemicalClasses.length}
            >
              <CheckboxGroup
                options={filterOptions?.chemicalClasses || []}
                selected={filters.chemicalClasses}
                onToggle={toggle("chemicalClasses")}
              />
            </FilterSection>
          </div>

          {/* Colonne 3 : Sources fédérées (Rapport 7) */}
          <div className="bg-card border border-border/40 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/30">
              <Network className="w-4 h-4 text-violet-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground/70">Sources fédérées</span>
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-amber-400/50 text-amber-600/80 ml-auto">
                Rapport 7
              </Badge>
            </div>

            <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
              Les requêtes fédérées permettront d'interroger simultanément PERFUMUM et des bases de données externes via SPARQL SERVICE.
            </p>

            <div className="space-y-2">
              <FederatedSourceSlot
                icon={<Globe2 className="w-3.5 h-3.5 text-blue-500" />}
                label="Wikidata"
                description="Propriétés chimiques (CAS, InChI), taxons botaniques, données GBIF"
                color="bg-blue-500/10"
                rapportLabel="R7"
              />
              <FederatedSourceSlot
                icon={<BookOpen className="w-3.5 h-3.5 text-green-500" />}
                label="OpenAlex"
                description="Publications scientifiques, citations, auteurs ORCID"
                color="bg-green-500/10"
                rapportLabel="R7"
              />
              <FederatedSourceSlot
                icon={<Image className="w-3.5 h-3.5 text-rose-500" />}
                label="Europeana"
                description="Iconographie patrimoniale, manuscrits, herbiers numérisés"
                color="bg-rose-500/10"
                rapportLabel="R7"
              />
            </div>

            {/* Filtre temporel (Rapport 7) */}
            <div className="mt-4 pt-3 border-t border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Filtre temporel</span>
                <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-amber-400/50 text-amber-600/80 ml-auto">
                  <Lock className="w-2 h-2 mr-0.5" />R7
                </Badge>
              </div>
              <div className="flex gap-2 opacity-50 pointer-events-none">
                <Input
                  placeholder="Depuis…"
                  disabled
                  className="h-7 text-xs"
                />
                <Input
                  placeholder="Jusqu'à…"
                  disabled
                  className="h-7 text-xs"
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 italic">
                Templates SPARQL temporels et généalogiques — planifiés Rapport 7
              </p>
            </div>

            {/* Lien vers l'explorateur SPARQL */}
            <div className="mt-4 pt-3 border-t border-border/30">
              <Link
                href="/admin/sparql"
                className="flex items-center gap-2 text-xs text-primary/70 hover:text-primary transition-colors group"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Explorateur SPARQL avancé</span>
                <ArrowRight className="w-3 h-3 ml-auto group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/knowledge-graph"
                className="flex items-center gap-2 text-xs text-primary/70 hover:text-primary transition-colors group mt-2"
              >
                <Network className="w-3.5 h-3.5" />
                <span>Graphe de connaissances</span>
                <ArrowRight className="w-3 h-3 ml-auto group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Résultats de recherche ─────────────────────────────────────────── */}
      {hasSearched && (
        <div className="mt-4">
          {searchError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-lg text-red-700 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Erreur lors de la recherche. Veuillez réessayer.</span>
            </div>
          )}

          {searching && (
            <div className="flex items-center justify-center gap-3 py-8 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Recherche en cours…</span>
            </div>
          )}

          {searchResults && !searching && (
            <SearchResultsPanel results={searchResults} filters={filters} />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Panneau de résultats ─────────────────────────────────────────────────────

function SearchResultsPanel({ results, filters }: { results: any; filters: FilterState }) {
  const stats = results?.stats;
  const molecules = results?.molecules || [];
  const plants = results?.plants || [];
  const terroirs = results?.terroirs || [];

  const totalResults = (stats?.totalMolecules || 0) + (stats?.totalPlants || 0) + (stats?.totalTerroirs || 0);

  if (totalResults === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
        <p className="text-sm font-medium">Aucun résultat trouvé</p>
        <p className="text-xs mt-1">Essayez d'élargir vos critères de recherche</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barre de statistiques */}
      <div className="flex flex-wrap gap-3 items-center">
        <span className="text-xs text-muted-foreground font-medium">
          {totalResults} résultat{totalResults > 1 ? "s" : ""} trouvé{totalResults > 1 ? "s" : ""}
        </span>
        <div className="flex gap-2 flex-wrap">
          {stats?.totalMolecules > 0 && (
            <Badge variant="secondary" className="text-xs gap-1">
              <FlaskConical className="w-3 h-3" />
              {stats.totalMolecules} molécule{stats.totalMolecules > 1 ? "s" : ""}
            </Badge>
          )}
          {stats?.totalPlants > 0 && (
            <Badge variant="secondary" className="text-xs gap-1">
              <Leaf className="w-3 h-3" />
              {stats.totalPlants} plante{stats.totalPlants > 1 ? "s" : ""}
            </Badge>
          )}
          {stats?.totalTerroirs > 0 && (
            <Badge variant="secondary" className="text-xs gap-1">
              <MapPin className="w-3 h-3" />
              {stats.totalTerroirs} terroir{stats.totalTerroirs > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>

      {/* Grille de résultats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Molécules */}
        {molecules.length > 0 && (
          <ResultColumn
            title="Molécules"
            icon={<FlaskConical className="w-4 h-4 text-violet-500" />}
            items={molecules.slice(0, 6)}
            renderItem={(m: any) => (
              <Link
                href={`/molecules/${m.id}`}
                className="flex items-start gap-2 p-2 rounded-md hover:bg-accent transition-colors group"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground/90 group-hover:text-foreground truncate">
                    {m.name}
                  </p>
                  {m.family && (
                    <p className="text-[10px] text-muted-foreground truncate">{m.family}</p>
                  )}
                </div>
                {m.plantCount > 0 && (
                  <span className="text-[10px] text-muted-foreground ml-auto flex-shrink-0">
                    {m.plantCount} plante{m.plantCount > 1 ? "s" : ""}
                  </span>
                )}
              </Link>
            )}
            total={stats?.totalMolecules}
            viewAllHref="/molecules"
          />
        )}

        {/* Plantes */}
        {plants.length > 0 && (
          <ResultColumn
            title="Plantes"
            icon={<Leaf className="w-4 h-4 text-emerald-500" />}
            items={plants.slice(0, 6)}
            renderItem={(p: any) => (
              <Link
                href={`/plants/${p.id}`}
                className="flex items-start gap-2 p-2 rounded-md hover:bg-accent transition-colors group"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground/90 group-hover:text-foreground truncate">
                    {p.name}
                  </p>
                  {p.latinName && (
                    <p className="text-[10px] text-muted-foreground italic truncate">{p.latinName}</p>
                  )}
                </div>
                {p.moleculeCount > 0 && (
                  <span className="text-[10px] text-muted-foreground ml-auto flex-shrink-0">
                    {p.moleculeCount} mol.
                  </span>
                )}
              </Link>
            )}
            total={stats?.totalPlants}
            viewAllHref="/plants"
          />
        )}

        {/* Terroirs */}
        {terroirs.length > 0 && (
          <ResultColumn
            title="Terroirs"
            icon={<MapPin className="w-4 h-4 text-blue-500" />}
            items={terroirs.slice(0, 6)}
            renderItem={(t: any) => (
              <div className="flex items-start gap-2 p-2 rounded-md hover:bg-accent transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground/90 truncate">{t.name}</p>
                  {t.country && (
                    <p className="text-[10px] text-muted-foreground truncate">
                      {t.country}{t.region ? ` · ${t.region}` : ""}
                    </p>
                  )}
                </div>
                {t.plantCount > 0 && (
                  <span className="text-[10px] text-muted-foreground ml-auto flex-shrink-0">
                    {t.plantCount} plante{t.plantCount > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            )}
            total={stats?.totalTerroirs}
            viewAllHref="/atlas"
          />
        )}
      </div>
    </div>
  );
}

// ─── Colonne de résultats ─────────────────────────────────────────────────────

function ResultColumn({
  title,
  icon,
  items,
  renderItem,
  total,
  viewAllHref,
}: {
  title: string;
  icon: React.ReactNode;
  items: any[];
  renderItem: (item: any) => React.ReactNode;
  total?: number;
  viewAllHref: string;
}) {
  return (
    <div className="bg-card border border-border/40 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border/30 bg-muted/20">
        {icon}
        <span className="text-xs font-semibold text-foreground/80">{title}</span>
        {total !== undefined && (
          <Badge variant="secondary" className="text-[9px] h-4 px-1.5 ml-auto">
            {total}
          </Badge>
        )}
      </div>
      <div className="p-1">
        {items.map((item, i) => (
          <React.Fragment key={item.id || i}>{renderItem(item)}</React.Fragment>
        ))}
      </div>
      {total !== undefined && total > 6 && (
        <div className="px-3 py-2 border-t border-border/20">
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-[11px] text-primary/70 hover:text-primary transition-colors"
          >
            Voir les {total} résultats
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
