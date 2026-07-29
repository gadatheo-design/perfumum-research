import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Leaf, AlertCircle, CheckCircle } from "lucide-react";

interface GBIFPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestion: {
    id: string;
    name: string;
    country: string;
    region?: string;
    coordinates?: { lat: number; lon: number };
    description: string;
    gbifOccurrences: number;
    uniquePlants: number;
    confidence: number;
    reason: string;
  } | null;
  plants?: Array<{
    id: string;
    latinName: string;
    commonName?: string;
    occurrences: number;
  }>;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function GBIFPreviewModal({
  open,
  onOpenChange,
  suggestion,
  plants = [],
  onConfirm,
  isLoading = false,
}: GBIFPreviewModalProps) {
  if (!suggestion) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Prévisualisation GBIF</DialogTitle>
          <DialogDescription>
            Vérifiez les détails avant de créer le terroir et d'associer les plantes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations du terroir */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{suggestion.name}</CardTitle>
              <CardDescription>
                {suggestion.country}
                {suggestion.region && ` • ${suggestion.region}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Description */}
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-1">Description</div>
                <p className="text-sm text-gray-600">{suggestion.description}</p>
              </div>

              {/* Coordonnées */}
              {suggestion.coordinates && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-semibold text-blue-900">Localisation</div>
                    <div className="text-sm text-blue-700">
                      {suggestion.coordinates.lat.toFixed(4)}, {suggestion.coordinates.lon.toFixed(4)}
                    </div>
                  </div>
                </div>
              )}

              {/* Statistiques GBIF */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Occurrences GBIF</div>
                  <div className="text-lg font-bold text-gray-900">{suggestion.gbifOccurrences}</div>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <div className="text-xs text-green-600 mb-1">Plantes uniques</div>
                  <div className="text-lg font-bold text-green-900">{suggestion.uniquePlants}</div>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <div className="text-xs text-blue-600 mb-1">Confiance</div>
                  <div className="text-lg font-bold text-blue-900">
                    {(suggestion.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* Raison de la suggestion */}
              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-amber-900">Raison de la suggestion</div>
                  <div className="text-sm text-amber-700">{suggestion.reason}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plantes à associer */}
          {plants.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Leaf className="h-5 w-5" />
                  Plantes à associer ({plants.length})
                </CardTitle>
                <CardDescription>
                  Ces plantes seront automatiquement associées au terroir
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {plants.map((plant) => (
                    <div
                      key={plant.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">{plant.latinName}</div>
                        {plant.commonName && (
                          <div className="text-xs text-gray-600">{plant.commonName}</div>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {plant.occurrences} occ.
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Résumé de l'action */}
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-green-900">Prêt à créer</div>
              <div className="text-sm text-green-700 mt-1">
                Un nouveau terroir sera créé avec {plants.length} plante(s) associée(s)
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Création en cours..." : "Créer le terroir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
