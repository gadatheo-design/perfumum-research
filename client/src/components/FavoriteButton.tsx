import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites, FavoritePage } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface FavoriteButtonProps {
  page: Omit<FavoritePage, "addedAt">;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
  className?: string;
}

export function FavoriteButton({
  page,
  variant = "ghost",
  size = "icon",
  showLabel = false,
  className,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(isFavorite(page.href));
  }, [page.href, isFavorite]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(page);
    const newState = !isFav;
    setIsFav(newState);
    
    if (newState) {
      toast.success(`${page.title} ajoutée aux favoris`);
    } else {
      toast.info(`${page.title} retirée des favoris`);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(
        "transition-colors",
        isFav && "text-red-500 hover:text-red-600",
        className
      )}
      aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
      title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart
        className={cn(
          "h-5 w-5",
          isFav && "fill-current"
        )}
      />
      {showLabel && (
        <span className="ml-2">
          {isFav ? "Favori" : "Ajouter"}
        </span>
      )}
    </Button>
  );
}
