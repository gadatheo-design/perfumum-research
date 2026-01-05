import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'wouter';
import { 
  X, 
  Leaf, 
  Shield, 
  Building2, 
  Sprout, 
  AlertTriangle, 
  CheckCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface ZoneSpeciesPanelProps {
  zoneId: number | null;
  zoneName: string;
  zoneColor: string;
  zoneData?: {
    threatLevel?: string | null;
    conservationPriority?: string | null;
    conservationEfforts?: string | null;
    sustainableAlternatives?: string | null;
    speciesCount?: number | null;
    description?: string | null;
  };
  onClose: () => void;
}

// Parse le texte formaté avec des points-virgules et des tirets
function parseFormattedText(text: string | null | undefined): { title: string; items: string[] }[] {
  if (!text) return [];
  
  const sections: { title: string; items: string[] }[] = [];
  const lines = text.split(';').map(line => line.trim()).filter(Boolean);
  
  let currentSection: { title: string; items: string[] } | null = null;
  
  for (const line of lines) {
    if (line.startsWith('**') && line.endsWith('**')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: line.replace(/\*\*/g, '').replace(/:$/, ''),
        items: []
      };
    } else if (line.startsWith('- ') && currentSection) {
      currentSection.items.push(line.substring(2));
    } else if (currentSection) {
      currentSection.items.push(line);
    } else {
      if (!currentSection) {
        currentSection = { title: '', items: [] };
      }
      currentSection.items.push(line);
    }
  }
  
  if (currentSection) {
    sections.push(currentSection);
  }
  
  return sections;
}

function ThreatLevelBadge({ level }: { level: string | null | undefined }) {
  if (!level) return null;
  
  const config: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    critical: { 
      label: 'Critique', 
      color: 'bg-red-600 text-white', 
      icon: <AlertTriangle className="h-3 w-3" /> 
    },
    high: { 
      label: 'Élevé', 
      color: 'bg-orange-600 text-white', 
      icon: <AlertTriangle className="h-3 w-3" /> 
    },
    medium: { 
      label: 'Modéré', 
      color: 'bg-yellow-600 text-white', 
      icon: <Shield className="h-3 w-3" /> 
    },
    low: { 
      label: 'Faible', 
      color: 'bg-green-600 text-white', 
      icon: <CheckCircle className="h-3 w-3" /> 
    },
  };
  
  const info = config[level] || { label: level, color: 'bg-gray-600 text-white', icon: null };
  
  return (
    <Badge className={`${info.color} flex items-center gap-1 text-xs`}>
      {info.icon}
      {info.label}
    </Badge>
  );
}

function ConservationPriorityBadge({ priority }: { priority: string | null | undefined }) {
  if (!priority) return null;
  
  const config: Record<string, { label: string; color: string }> = {
    urgent: { label: 'Urgent', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    high: { label: 'Haute', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    medium: { label: 'Moyenne', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    low: { label: 'Basse', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  };
  
  const info = config[priority] || { label: priority, color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
  
  return (
    <Badge variant="outline" className={`${info.color} text-xs`}>
      Priorité: {info.label}
    </Badge>
  );
}

export function ZoneSpeciesPanel({ zoneId, zoneName, zoneColor, zoneData, onClose }: ZoneSpeciesPanelProps) {
  const [activeTab, setActiveTab] = useState('species');
  
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

  const conservationSections = parseFormattedText(zoneData?.conservationEfforts);
  const alternativesSections = parseFormattedText(zoneData?.sustainableAlternatives);
  const hasConservationData = zoneData?.conservationEfforts || zoneData?.sustainableAlternatives;

  return (
    <div className="absolute top-4 right-4 w-[420px] max-h-[calc(100%-2rem)] bg-background border rounded-lg shadow-lg z-10 flex flex-col">
      <Card className="border-0 flex-1 flex flex-col min-h-0">
        <CardHeader className="pb-2 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-base">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: zoneColor }}
                />
                <span className="truncate">{zoneName}</span>
              </CardTitle>
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <ThreatLevelBadge level={zoneData?.threatLevel} />
                <ConservationPriorityBadge priority={zoneData?.conservationPriority} />
              </div>
              {zoneData?.description && (
                <CardDescription className="mt-2 text-xs line-clamp-2">
                  {zoneData.description}
                </CardDescription>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0 -mr-2 -mt-1">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 min-h-0 pt-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mb-3 flex-shrink-0">
              <TabsTrigger value="species" className="text-xs">
                <Leaf className="h-3 w-3 mr-1" />
                Espèces
              </TabsTrigger>
              <TabsTrigger value="conservation" className="text-xs" disabled={!hasConservationData}>
                <Shield className="h-3 w-3 mr-1" />
                Conservation
              </TabsTrigger>
              <TabsTrigger value="alternatives" className="text-xs" disabled={!alternativesSections.length}>
                <Sprout className="h-3 w-3 mr-1" />
                Alternatives
              </TabsTrigger>
            </TabsList>
            
            {/* Onglet Espèces */}
            <TabsContent value="species" className="flex-1 min-h-0 mt-0">
              <ScrollArea className="h-[350px]">
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Chargement des espèces...
                  </div>
                ) : plantsInZone && plantsInZone.length > 0 ? (
                  <div className="space-y-2 pr-4">
                    <div className="text-xs text-muted-foreground mb-3">
                      {plantsInZone.length} espèce(s) répertoriée(s)
                    </div>
                    {plantsInZone.map((plant) => {
                      const statusInfo = plant.populationStatus 
                        ? statusLabels[plant.populationStatus] 
                        : null;
                      
                      return (
                        <Link 
                          key={plant.plantId} 
                          href={`/plants/${plant.plantId}`}
                          className="block"
                        >
                          <div className="p-2.5 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2 flex-1 min-w-0">
                                <Leaf className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                  <div className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                                    {plant.plantName}
                                  </div>
                                  <div className="text-xs text-muted-foreground italic truncate">
                                    {plant.plantLatinName}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {statusInfo && (
                                  <Badge className={`${statusInfo.color} text-[10px] px-1.5 py-0`}>
                                    {statusInfo.label}
                                  </Badge>
                                )}
                                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                            
                            {plant.plantFamily && (
                              <div className="text-xs text-muted-foreground mt-1 ml-6">
                                {plant.plantFamily}
                              </div>
                            )}
                            
                            <div className="flex gap-1 mt-1.5 ml-6">
                              {plant.isPrimaryZone && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                  Zone principale
                                </Badge>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune espèce répertoriée dans cette zone.
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            {/* Onglet Conservation */}
            <TabsContent value="conservation" className="flex-1 min-h-0 mt-0">
              <ScrollArea className="h-[350px]">
                {conservationSections.length > 0 ? (
                  <div className="space-y-4 pr-4">
                    {conservationSections.map((section, idx) => (
                      <div key={idx} className="space-y-2">
                        {section.title && (
                          <h4 className="font-medium text-sm flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-blue-500" />
                            {section.title}
                          </h4>
                        )}
                        <ul className="space-y-1.5 ml-6">
                          {section.items.map((item, itemIdx) => (
                            <li 
                              key={itemIdx} 
                              className="text-xs text-muted-foreground flex items-start gap-2"
                            >
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune information de conservation disponible.
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            {/* Onglet Alternatives */}
            <TabsContent value="alternatives" className="flex-1 min-h-0 mt-0">
              <ScrollArea className="h-[350px]">
                {alternativesSections.length > 0 ? (
                  <div className="space-y-4 pr-4">
                    <div className="text-xs text-muted-foreground mb-3 p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                      <Sprout className="h-4 w-4 text-emerald-500 inline mr-1" />
                      Alternatives durables pour réduire la pression sur les espèces menacées
                    </div>
                    {alternativesSections.map((section, idx) => (
                      <div key={idx} className="space-y-2">
                        {section.title && (
                          <h4 className="font-medium text-sm flex items-center gap-2">
                            <Sprout className="h-4 w-4 text-emerald-500" />
                            {section.title}
                          </h4>
                        )}
                        <ul className="space-y-1.5 ml-6">
                          {section.items.map((item, itemIdx) => (
                            <li 
                              key={itemIdx} 
                              className="text-xs text-muted-foreground flex items-start gap-2"
                            >
                              <Leaf className="h-3 w-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune alternative durable documentée.
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
