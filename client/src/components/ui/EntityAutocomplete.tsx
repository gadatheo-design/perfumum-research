import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, X, ChevronDown } from "lucide-react";

export type EntityType = "recette" | "plante" | "molecule" | "terroir" | "axis" | "extractionMethod";

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
  label?: string;
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

  // Récupérer les résultats de recherche selon le type d'entité
  const { data: recettes, isLoading: loadingRecettes } = trpc.recettes.getFiltered.useQuery(
    { search, limit: 10 },
    { enabled: entityType === "recette" && search.length > 0 }
  );

  const { data: plantes, isLoading: loadingPlantes } = trpc.plants.getFiltered.useQuery(
    { search, limit: 10 },
    { enabled: entityType === "plante" && search.length > 0 }
  );

  const { data: molecules, isLoading: loadingMolecules } = trpc.molecules.getFiltered.useQuery(
    { search, limit: 10 },
    { enabled: entityType === "molecule" && search.length > 0 }
  );

  const { data: terroirs, isLoading: loadingTerroirs } = trpc.terroirs.getFiltered.useQuery(
    { search, limit: 10 },
    { enabled: entityType === "terroir" && search.length > 0 }
  );

  const { data: axes, isLoading: loadingAxes } = trpc.researchAxes.getFiltered.useQuery(
    { search, limit: 10 },
    { enabled: entityType === "axis" && search.length > 0 }
  );

  const { data: methods, isLoading: loadingMethods } = trpc.extractionMethods.getFiltered.useQuery(
    { search, limit: 10 },
    { enabled: entityType === "extractionMethod" && search.length > 0 }
  );

  // Déterminer les données et le statut de chargement selon le type
  const getDataAndLoading = () => {
    switch (entityType) {
      case "recette":
        return { data: recettes || [], loading: loadingRecettes };
      case "plante":
        return { data: plantes || [], loading: loadingPlantes };
      case "molecule":
        return { data: molecules || [], loading: loadingMolecules };
      case "terroir":
        return { data: terroirs || [], loading: loadingTerroirs };
      case "axis":
        return { data: axes || [], loading: loadingAxes };
      case "extractionMethod":
        return { data: methods || [], loading: loadingMethods };
      default:
        return { data: [], loading: false };
    }
  };

  const { data: items, loading } = getDataAndLoading();

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

  const getItemLabel = (item: Entity) => {
    switch (entityType) {
      case "molecule":
        return `${item.name}${item.family ? ` (${item.family})` : ""}`;
      case "plante":
        return `${item.name}${item.description ? ` - ${item.description}` : ""}`;
      default:
        return item.name;
    }
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
          ) : items.length === 0 && search.length === 0 ? (
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
                      {item.family && (
                        <p className="text-xs text-muted-foreground truncate">
                          {item.family}
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
