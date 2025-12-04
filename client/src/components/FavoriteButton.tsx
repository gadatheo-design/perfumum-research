import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface FavoriteButtonProps {
  moleculeId: number;
  moleculeName?: string;
  variant?: "default" | "icon";
  size?: "sm" | "md" | "lg";
}

export function FavoriteButton({ 
  moleculeId, 
  moleculeName,
  variant = "default",
  size = "md"
}: FavoriteButtonProps) {
  const utils = trpc.useUtils();
  
  // Check if molecule is favorited
  const { data: isFavorited, isLoading: checkingFavorite } = trpc.favorites.isFavorite.useQuery(
    { moleculeId },
    { refetchOnWindowFocus: false }
  );
  
  // Add favorite mutation
  const addFavorite = trpc.favorites.add.useMutation({
    onSuccess: () => {
      utils.favorites.isFavorite.invalidate({ moleculeId });
      utils.favorites.list.invalidate();
      toast.success(`${moleculeName || "Molécule"} ajoutée aux favoris`);
    },
    onError: (error) => {
      toast.error(`Erreur : ${error.message}`);
    },
  });
  
  // Remove favorite mutation
  const removeFavorite = trpc.favorites.remove.useMutation({
    onSuccess: () => {
      utils.favorites.isFavorite.invalidate({ moleculeId });
      utils.favorites.list.invalidate();
      toast.success(`${moleculeName || "Molécule"} retirée des favoris`);
    },
    onError: (error) => {
      toast.error(`Erreur : ${error.message}`);
    },
  });
  
  const handleToggleFavorite = () => {
    if (isFavorited) {
      removeFavorite.mutate({ moleculeId });
    } else {
      addFavorite.mutate({ moleculeId });
    }
  };
  
  const isLoading = checkingFavorite || addFavorite.isPending || removeFavorite.isPending;
  
  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className="group"
      >
        <Star 
          className={`h-4 w-4 transition-all ${
            isFavorited 
              ? "fill-yellow-500 text-yellow-500" 
              : "text-muted-foreground group-hover:text-yellow-500"
          }`}
        />
      </Button>
    );
  }
  
  return (
    <Button
      variant={isFavorited ? "default" : "outline"}
      size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className="group"
    >
      <Star 
        className={`h-4 w-4 mr-2 transition-all ${
          isFavorited 
            ? "fill-yellow-500 text-yellow-500" 
            : "text-muted-foreground group-hover:text-yellow-500"
        }`}
      />
      {isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
    </Button>
  );
}
