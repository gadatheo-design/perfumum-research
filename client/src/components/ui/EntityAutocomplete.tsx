import { useState, useEffect, useRef, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, X, ChevronDown } from "lucide-react";

export type EntityType = "recette" | "plante" | "molecule" | "terroir" | "axis" | "extractionMethod" | "extraction";

interface EntityAutocompleteProps {
  entityType: EntityType;
  value: number | null;
  onChange: (id: number | null, label: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

interface Entity {
  id: number;
  name: string;
  description?: string;
  family?: string;
}

export function EntityAutocomplete({
  entityType,
  value,
  onChange,
  placeholder = "Rechercher...",
  className = "",
  disabled = false,
}: EntityAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Molécules : procédure search dédiée (molecules.search) ───────────────
  const { data: moleculesData, isLoading: loadingMolecules } = trpc.molecules.search.useQuery(
    { query: search, limit: 10 },
    { enabled: entityType === "molecule" && search.length >= 1 }
  );

  // ── Plantes : procédure search dans plantStatistics ───────────────────────
  const { data: plantesData, isLoading: loadingPlantes } = trpc.plantStatistics.search.useQuery(
    { query: search },
    { enabled: entityType === "plante" && search.length >= 1 }
  );

  // ── Recettes : liste complète + filtre côté client ───────────────────────
  const { data: recettesAll, isLoading: loadingRecettes } = trpc.recettes.list.useQuery(
    undefined,
    { enabled: entityType === "recette" }
  );

  // ── Terroirs : liste complète + filtre côté client ───────────────────────
  const { data: terroirsAll, isLoading: loadingTerroirs } = trpc.terroirs.getAll.useQuery(
    undefined,
    { enabled: entityType === "terroir" }
  );

  // ── Axes thématiques : liste complète + filtre côté client ───────────────
  const { data: axesAll, isLoading: loadingAxes } = trpc.thematicAxes.list.useQuery(
    undefined,
    { enabled: entityType === "axis" }
  );

  // ── Méthodes d'extraction : liste complète + filtre côté client ──────────
  const { data: methodsAll, isLoading: loadingMethods } = trpc.extractionMethods.getAll.useQuery(
    undefined,
    { enabled: entityType === "extractionMethod" || entityType === "extraction" }
  );

  // ── Normalisation et filtrage côté client ────────────────────────────────
  const items: Entity[] = useMemo(() => {
    const q = search.toLowerCase();

    switch (entityType) {
      case "molecule": {
        const mols = moleculesData?.molecules ?? [];
        return (mols as Record<string, unknown>[]).map((m) => ({
          id: m.id as number,
          name: m.name as string,
          family: m.family as string | undefined,
        }));
      }

      case "plante": {
        const plants = Array.isArray(plantesData) ? (plantesData as Record<string, unknown>[]) : [];
        return plants.slice(0, 10).map((p) => ({
          id: p.id as number,
          name: (p.name ?? p.latin_name ?? p.latinName) as string,
          description: (p.latinName ?? p.latin_name) as string | undefined,
        }));
      }

      case "recette": {
        const all = Array.isArray(recettesAll) ? (recettesAll as Record<string, unknown>[]) : [];
        const filtered = q
          ? all.filter((r) => String(r.name ?? "").toLowerCase().includes(q))
          : all;
        return filtered.slice(0, 10).map((r) => ({
          id: r.id as number,
          name: r.name as string,
          description: r.category as string | undefined,
        }));
      }

      case "terroir": {
        const all = Array.isArray(terroirsAll) ? (terroirsAll as Record<string, unknown>[]) : [];
        const filtered = q
          ? all.filter((t) =>
              String(t.name ?? "").toLowerCase().includes(q) ||
              String(t.country ?? "").toLowerCase().includes(q) ||
              String(t.region ?? "").toLowerCase().includes(q)
            )
          : all;
        return filtered.slice(0, 10).map((t) => ({
          id: t.id as number,
          name: t.name as string,
          description: [t.region, t.country].filter(Boolean).join(", ") || undefined,
        }));
      }

      case "axis": {
        const all = Array.isArray(axesAll) ? (axesAll as Record<string, unknown>[]) : [];
        const filtered = q
          ? all.filter((a) =>
              String(a.name ?? "").toLowerCase().includes(q) ||
              String(a.axisCode ?? "").toLowerCase().includes(q) ||
              String(a.description ?? "").toLowerCase().includes(q)
            )
          : all;
        return filtered.slice(0, 10).map((a) => ({
          id: a.id as number,
          name: `${a.axisCode} — ${a.name}`,
          description: a.description as string | undefined,
        }));
      }

      case "extractionMethod":
      case "extraction": {
        const all = Array.isArray(methodsAll) ? (methodsAll as Record<string, unknown>[]) : [];
        const filtered = q
          ? all.filter((m) =>
              String(m.name ?? "").toLowerCase().includes(q) ||
              String(m.shortName ?? "").toLowerCase().includes(q) ||
              String(m.category ?? "").toLowerCase().includes(q)
            )
          : all;
        return filtered.slice(0, 10).map((m) => ({
          id: m.id as number,
          name: m.name as string,
          description: m.category as string | undefined,
        }));
      }

      default:
        return [];
    }
  }, [
    entityType, search,
    moleculesData, plantesData,
    recettesAll, terroirsAll, axesAll, methodsAll,
  ]);

  const loading =
    (entityType === "molecule" && loadingMolecules) ||
    (entityType === "plante" && loadingPlantes) ||
    (entityType === "recette" && loadingRecettes) ||
    (entityType === "terroir" && loadingTerroirs) ||
    (entityType === "axis" && loadingAxes) ||
    ((entityType === "extractionMethod" || entityType === "extraction") && loadingMethods);

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: Entity) => {
    onChange(item.id, item.name);
    setSelectedLabel(item.name);
    setSearch("");
    setOpen(false);
  };

  const handleClear = () => {
    onChange(null, "");
    setSelectedLabel("");
    setSearch("");
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <Input
          ref={inputRef}
          type="text"
          placeholder={selectedLabel || placeholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          disabled={disabled}
          className="pr-10 h-9 text-sm"
        />
        {value && !search && (
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-1 h-6 w-6 p-0"
            onClick={handleClear}
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </Button>
        )}
        {!value && !search && (
          <ChevronDown className="absolute right-3 w-4 h-4 text-muted-foreground pointer-events-none" />
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {loading ? (
            <div className="p-3 text-center">
              <Loader2 className="w-4 h-4 animate-spin mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Recherche en cours...</p>
            </div>
          ) : items.length === 0 && search.length > 0 ? (
            <div className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Aucun résultat trouvé</p>
            </div>
          ) : items.length === 0 ? (
            <div className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Tapez pour rechercher...</p>
            </div>
          ) : (
            <div className="space-y-1 p-1">
              {items.map((item: Entity) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                        {item.name}
                      </p>
                      {(item.description || item.family) && (
                        <p className="text-xs text-muted-foreground truncate">
                          {item.description ?? item.family}
                        </p>
                      )}
                    </div>
                    {item.id === value && (
                      <Badge variant="outline" className="text-xs shrink-0">
                        ✓
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Badge de sélection */}
      {value && selectedLabel && !search && (
        <div className="mt-2">
          <Badge variant="secondary" className="text-xs">
            {selectedLabel}
            <button
              onClick={handleClear}
              className="ml-1 hover:text-destructive"
            >
              ×
            </button>
          </Badge>
        </div>
      )}
    </div>
  );
}
