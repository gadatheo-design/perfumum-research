// @ts-nocheck
import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface ProfileAutocompleteProps {
  profiles: string[];
  selectedProfiles: string[];
  onToggleProfile: (profile: string) => void;
  onClearAll: () => void;
}

export function ProfileAutocomplete({
  profiles,
  selectedProfiles,
  onToggleProfile,
  onClearAll,
}: ProfileAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Group profiles by category (first letter or semantic grouping)
  const groupedProfiles = useMemo(() => {
    const groups: Record<string, string[]> = {
      "Fruité": [],
      "Floral": [],
      "Terreux": [],
      "Animal": [],
      "Épicé": [],
      "Boisé": [],
      "Chimique": [],
      "Autre": [],
    };

    profiles.forEach(profile => {
      const lower = profile.toLowerCase();
      
      // Fruity
      if (lower.includes("agrume") || lower.includes("ananas") || lower.includes("banane") || 
          lower.includes("abricot") || lower.includes("raisin") || lower.includes("pomme")) {
        groups["Fruité"].push(profile);
      }
      // Floral
      else if (lower.includes("floral") || lower.includes("jasmin") || lower.includes("violette")) {
        groups["Floral"].push(profile);
      }
      // Earthy
      else if (lower.includes("terre") || lower.includes("terreux") || lower.includes("argile") || 
               lower.includes("humus") || lower.includes("minéral")) {
        groups["Terreux"].push(profile);
      }
      // Animal
      else if (lower.includes("animal") || lower.includes("cuir") || lower.includes("fromage") || 
               lower.includes("fécal") || lower.includes("sueur")) {
        groups["Animal"].push(profile);
      }
      // Spicy
      else if (lower.includes("épice") || lower.includes("cannelle") || lower.includes("poivre") || 
               lower.includes("piquant")) {
        groups["Épicé"].push(profile);
      }
      // Woody
      else if (lower.includes("bois") || lower.includes("pin") || lower.includes("cèdre") || 
               lower.includes("santal")) {
        groups["Boisé"].push(profile);
      }
      // Chemical
      else if (lower.includes("aldéhyde") || lower.includes("chimique") || lower.includes("synthétique") || 
               lower.includes("ozone") || lower.includes("aluminium")) {
        groups["Chimique"].push(profile);
      }
      // Other
      else {
        groups["Autre"].push(profile);
      }
    });

    // Remove empty groups and sort profiles within each group
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) {
        delete groups[key];
      } else {
        groups[key].sort();
      }
    });

    return groups;
  }, [profiles]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold">
          Profils Olfactifs ({selectedProfiles.length} sélectionné{selectedProfiles.length > 1 ? "s" : ""})
        </label>
        {selectedProfiles.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-7 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Tout effacer
          </Button>
        )}
      </div>

      {/* Selected profiles chips */}
      {selectedProfiles.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 border border-border/40 rounded-md bg-muted/30">
          {selectedProfiles.map(profile => (
            <Badge
              key={profile}
              variant="default"
              className="cursor-pointer hover:bg-primary/80 transition-colors"
              onClick={() => onToggleProfile(profile)}
            >
              {profile}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}

      {/* Autocomplete dropdown */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="text-muted-foreground">
              Rechercher un profil olfactif...
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Tapez pour rechercher..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandEmpty>Aucun profil trouvé.</CommandEmpty>
            
            {Object.entries(groupedProfiles).map(([category, categoryProfiles]) => {
              // Filter profiles by search query
              const filteredProfiles = categoryProfiles.filter(p => 
                p.toLowerCase().includes(searchQuery.toLowerCase())
              );

              if (filteredProfiles.length === 0) return null;

              return (
                <CommandGroup key={category} heading={category}>
                  {filteredProfiles.map(profile => (
                    <CommandItem
                      key={profile}
                      value={profile}
                      onSelect={() => {
                        onToggleProfile(profile);
                      }}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedProfiles.includes(profile) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {profile}
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </Command>
        </PopoverContent>
      </Popover>

      <p className="text-xs text-muted-foreground">
        {profiles.length} profils disponibles, organisés par catégorie
      </p>
    </div>
  );
}
