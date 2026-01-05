import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Leaf } from 'lucide-react';

interface ZoneSpeciesPanelProps {
  zoneId: number | null;
  zoneName: string;
  zoneColor: string;
  onClose: () => void;
}

export function ZoneSpeciesPanel({ zoneId, zoneName, zoneColor, onClose }: ZoneSpeciesPanelProps) {
  const { data: plantsInZone, isLoading } = trpc.plantsConservation.getPlantsByZone.useQuery(
    { zoneId: zoneId! },
    { enabled: zoneId !== null }
  );

  if (!zoneId) return null;

  const statusLabels: Record<string, { label: string; color: string }> = {
    abundant: { label: 'Abondant', color: 'bg-green-600 text-white' },
    common: { label: 'Commun', color: 'bg-blue-600 text-white' },
    rare: { label: 'Rare', color: 'bg-orange-600 text-white' },
    critically_rare: { label: 'Très rare', color: 'bg-red-600 text-white' },
    extinct: { label: 'Éteint', color: 'bg-black text-white' },
  };

  return (
    <div className="absolute top-4 right-4 w-96 max-h-[calc(100%-2rem)] overflow-y-auto bg-background border rounded-lg shadow-lg z-10">
      <Card className="border-0">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: zoneColor }}
                />
                {zoneName}
              </CardTitle>
              <CardDescription>
                {isLoading ? 'Chargement...' : `${plantsInZone?.length || 0} espèce(s) présente(s)`}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Chargement des espèces...
            </div>
          ) : plantsInZone && plantsInZone.length > 0 ? (
            <div className="space-y-3">
              {plantsInZone.map((plant) => {
                const statusInfo = plant.populationStatus 
                  ? statusLabels[plant.populationStatus] 
                  : null;
                
                return (
                  <div 
                    key={plant.plantId} 
                    className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-start gap-2">
                        <Leaf className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-sm">{plant.plantName}</div>
                          <div className="text-xs text-muted-foreground italic">
                            {plant.plantLatinName}
                          </div>
                        </div>
                      </div>
                      {statusInfo && (
                        <Badge className={`${statusInfo.color} text-xs`}>
                          {statusInfo.label}
                        </Badge>
                      )}
                    </div>
                    
                    {plant.plantFamily && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Famille: {plant.plantFamily}
                      </div>
                    )}
                    
                    {plant.isPrimaryZone && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        Zone principale
                      </Badge>
                    )}
                    
                    {plant.notes && (
                      <div className="text-xs text-muted-foreground mt-2 italic">
                        {plant.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Aucune espèce répertoriée dans cette zone.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
