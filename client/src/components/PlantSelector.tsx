import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import {
  Leaf,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PlantSelectorProps {
  bibliographyId: number;
  linkedPlantIds?: number[];
  onUpdate?: () => void;
}

export function PlantSelector({ bibliographyId, linkedPlantIds = [], onUpdate }: PlantSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Récupérer toutes les plantes
  const { data: allPlants, isLoading: plantsLoading } = trpc.plants.list.useQuery();
  
  // Mutations
  const linkMutation = trpc.bibliography.linkToPlant.useMutation({
    onSuccess: () => {
      toast.success("Plante liée avec succès");
      onUpdate?.();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
  
  const unlinkMutation = trpc.bibliography.unlinkFromPlant.useMutation({
    onSuccess: () => {
      toast.success("Liaison supprimée");
      onUpdate?.();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
  
  // Filtrer les plantes disponibles (non encore liées)
  const availablePlants = useMemo(() => {
    if (!allPlants) return [];
    return allPlants.filter(plant => !linkedPlantIds.includes(plant.id));
  }, [allPlants, linkedPlantIds]);
  
  // Plantes liées avec leurs détails
  const linkedPlants = useMemo(() => {
    if (!allPlants) return [];
    return allPlants.filter(plant => linkedPlantIds.includes(plant.id));
  }, [allPlants, linkedPlantIds]);
  
  // Filtrer par recherche
  const filteredPlants = useMemo(() => {
    if (!searchQuery) return availablePlants;
    const query = searchQuery.toLowerCase();
    return availablePlants.filter(plant => 
      plant.name.toLowerCase().includes(query) ||
      (plant.latinName && plant.latinName.toLowerCase().includes(query)) ||
      (plant.category && plant.category.toLowerCase().includes(query))
    );
  }, [availablePlants, searchQuery]);
  
  const handleLink = (plantId: number) => {
    linkMutation.mutate({ bibliographyId, plantId });
    setOpen(false);
  };
  
  const handleUnlink = (plantId: number) => {
    unlinkMutation.mutate({ bibliographyId, plantId });
  };
  
  // Couleur par catégorie
  const getCategoryColor = (category: string | null | undefined): string => {
    switch (category) {
      case "cannabis": return "bg-green-500/20 text-green-700 border-green-500/30";
      case "tabac": return "bg-amber-500/20 text-amber-700 border-amber-500/30";
      case "aromatique": return "bg-purple-500/20 text-purple-700 border-purple-500/30";
      case "fleur": return "bg-pink-500/20 text-pink-700 border-pink-500/30";
      case "bois": return "bg-orange-500/20 text-orange-700 border-orange-500/30";
      case "resine": return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
      default: return "bg-gray-500/20 text-gray-700 border-gray-500/30";
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-base font-medium">
          <Leaf className="h-4 w-4 text-green-600" />
          Plantes liées
        </label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter une plante
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[350px] p-0" align="end">
            <Command>
              <CommandInput 
                placeholder="Rechercher une plante..." 
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandList>
                <CommandEmpty>
                  {plantsLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    "Aucune plante trouvée"
                  )}
                </CommandEmpty>
                <CommandGroup heading="Plantes disponibles">
                  {filteredPlants.map((plant) => (
                    <CommandItem
                      key={plant.id}
                      value={`${plant.name} ${plant.latinName || ''}`}
                      onSelect={() => handleLink(plant.id)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{plant.name}</div>
                        {plant.latinName && (
                          <div className="text-xs text-muted-foreground italic">
                            {plant.latinName}
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className={cn("text-xs", getCategoryColor(plant.category))}>
                        {plant.category || "autre"}
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Liste des plantes liées */}
      <div className="space-y-2">
        {linkedPlants.length === 0 ? (
          <div className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg">
            <Leaf className="h-8 w-8 mx-auto mb-2 opacity-30" />
            Aucune plante liée à cette référence
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {linkedPlants.map((plant) => (
              <Badge
                key={plant.id}
                variant="outline"
                className={cn(
                  "pl-3 pr-1 py-1.5 flex items-center gap-2 text-sm",
                  getCategoryColor(plant.category)
                )}
              >
                <Leaf className="h-3 w-3" />
                <span>{plant.name}</span>
                {plant.latinName && (
                  <span className="text-xs opacity-70 italic">({plant.latinName})</span>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 ml-1 hover:bg-destructive/20 hover:text-destructive"
                  onClick={() => handleUnlink(plant.id)}
                  disabled={unlinkMutation.isPending}
                >
                  {unlinkMutation.isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <X className="h-3 w-3" />
                  )}
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      {/* Indicateur de chargement */}
      {(linkMutation.isPending || unlinkMutation.isPending) && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Mise à jour en cours...
        </div>
      )}
    </div>
  );
}
