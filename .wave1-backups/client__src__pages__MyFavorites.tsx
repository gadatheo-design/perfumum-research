// @ts-nocheck
import { Link } from "wouter";
import { Heart, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFavorites } from "@/hooks/useFavorites";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function MyFavorites() {
  const { favorites, removeFavorite, clearAllFavorites } = useFavorites();
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleClearAll = () => {
    clearAllFavorites();
    setShowClearDialog(false);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <DynamicBreadcrumb />
        </div>
      </div>

      {/* Header */}
      <div className="border-b bg-gradient-to-r from-background to-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-red-500/10">
              <Heart className="h-6 w-6 text-red-500 fill-current" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Mes Favoris</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {favorites.length === 0
              ? "Vous n'avez pas encore de favoris"
              : `${favorites.length} page${favorites.length > 1 ? "s" : ""} sauvegardée${favorites.length > 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex p-4 rounded-full bg-muted mb-4">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Aucun favori</h2>
            <p className="text-muted-foreground mb-6">
              Commencez à ajouter des pages à vos favoris pour les retrouver facilement
            </p>
            <Link href="/">
              <Button>
                Retour à l'accueil
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Actions */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Triés par date d'ajout (plus récent d'abord)
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClearDialog(true)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Effacer tous les favoris
              </Button>
            </div>

            {/* Favorites Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...favorites]
                .sort((a, b) => b.addedAt - a.addedAt)
                .map((favorite) => (
                  <Link key={favorite.href} href={favorite.href}>
                    <Card className="h-full p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                      <div className="flex flex-col h-full">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                              {favorite.title}
                            </h3>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeFavorite(favorite.href);
                            }}
                            className="ml-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {favorite.description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                            {favorite.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(favorite.addedAt)}
                          </span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Clear All Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Effacer tous les favoris ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Tous vos favoris seront supprimés.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAll}
              className="bg-red-500 hover:bg-red-600"
            >
              Effacer
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
