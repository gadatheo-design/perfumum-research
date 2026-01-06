import { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Calendar, MapPin, ScrollText, FlaskConical, Pickaxe, Leaf } from 'lucide-react';

export interface TimelineItem {
  id: number;
  title: string;
  date: string; // Format flexible: "3000 av. J.-C.", "IIe siècle", "1370", etc.
  dateNumeric?: number; // Année numérique pour le tri (négatif pour av. J.-C.)
  type: string;
  civilization?: string;
  description?: string;
  authenticityLevel?: string;
  imageUrl?: string;
  plantIds?: number[];
  moleculeIds?: number[];
}

interface TimelineProps {
  items: TimelineItem[];
  onItemClick?: (item: TimelineItem) => void;
  title?: string;
  description?: string;
}

// Fonction pour parser les dates historiques en années numériques
function parseDateToNumeric(dateStr: string): number {
  if (!dateStr) return 0;
  
  const lowerDate = dateStr.toLowerCase();
  
  // Détection "av. J.-C." ou "BCE"
  const isBC = lowerDate.includes('av.') || lowerDate.includes('bce') || lowerDate.includes('avant');
  
  // Extraction des nombres
  const numbers = dateStr.match(/\d+/g);
  if (!numbers || numbers.length === 0) {
    // Siècles romains
    const romanMatch = dateStr.match(/([IVXLCDM]+)e?\s*siècle/i);
    if (romanMatch) {
      const romanNumerals: Record<string, number> = {
        'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5,
        'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10,
        'XI': 11, 'XII': 12, 'XIII': 13, 'XIV': 14, 'XV': 15,
        'XVI': 16, 'XVII': 17, 'XVIII': 18, 'XIX': 19, 'XX': 20, 'XXI': 21
      };
      const century = romanNumerals[romanMatch[1].toUpperCase()] || 1;
      const year = (century - 1) * 100 + 50; // Milieu du siècle
      return isBC ? -year : year;
    }
    return 0;
  }
  
  const year = parseInt(numbers[0], 10);
  return isBC ? -year : year;
}

// Icônes par type de document
const typeIcons: Record<string, { icon: typeof ScrollText; color: string; label: string }> = {
  manuscript: { icon: ScrollText, color: 'text-amber-600', label: 'Manuscrit' },
  formula: { icon: FlaskConical, color: 'text-purple-600', label: 'Formule' },
  archaeological: { icon: Pickaxe, color: 'text-orange-600', label: 'Archéologie' },
  botanical_illustration: { icon: Leaf, color: 'text-green-600', label: 'Botanique' },
};

// Couleurs par civilisation
const civilizationColors: Record<string, string> = {
  'Égypte': 'bg-amber-100 text-amber-800 border-amber-300',
  'Mésopotamie': 'bg-orange-100 text-orange-800 border-orange-300',
  'Grèce': 'bg-blue-100 text-blue-800 border-blue-300',
  'Rome': 'bg-red-100 text-red-800 border-red-300',
  'Inde': 'bg-purple-100 text-purple-800 border-purple-300',
  'Chine': 'bg-rose-100 text-rose-800 border-rose-300',
  'Arabie': 'bg-emerald-100 text-emerald-800 border-emerald-300',
  'Perse': 'bg-cyan-100 text-cyan-800 border-cyan-300',
  'Europe médiévale': 'bg-slate-100 text-slate-800 border-slate-300',
};

export function Timeline({ items, onItemClick, title, description }: TimelineProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
  const [selectedCivilization, setSelectedCivilization] = useState<string | undefined>(undefined);
  const [hoveredItem, setHoveredItem] = useState<TimelineItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Trier et filtrer les items
  const processedItems = useMemo(() => {
    let filtered = items.map(item => ({
      ...item,
      dateNumeric: item.dateNumeric ?? parseDateToNumeric(item.date),
    }));

    if (selectedType) {
      filtered = filtered.filter(item => item.type === selectedType);
    }
    if (selectedCivilization) {
      filtered = filtered.filter(item => item.civilization === selectedCivilization);
    }

    return filtered.sort((a, b) => a.dateNumeric - b.dateNumeric);
  }, [items, selectedType, selectedCivilization]);

  // Calculer les périodes pour l'axe
  const periods = useMemo(() => {
    if (processedItems.length === 0) return [];
    
    const minYear = Math.min(...processedItems.map(i => i.dateNumeric));
    const maxYear = Math.max(...processedItems.map(i => i.dateNumeric));
    const range = maxYear - minYear || 1000;
    
    const periodSize = range > 3000 ? 1000 : range > 1000 ? 500 : range > 500 ? 100 : 50;
    const startPeriod = Math.floor(minYear / periodSize) * periodSize;
    const endPeriod = Math.ceil(maxYear / periodSize) * periodSize;
    
    const periods: { year: number; label: string }[] = [];
    for (let year = startPeriod; year <= endPeriod; year += periodSize) {
      const label = year < 0 ? `${Math.abs(year)} av. J.-C.` : `${year}`;
      periods.push({ year, label });
    }
    return periods;
  }, [processedItems]);

  // Obtenir les civilisations uniques
  const civilizations = useMemo(() => {
    const civs = new Set(items.map(i => i.civilization).filter(Boolean));
    return Array.from(civs).sort() as string[];
  }, [items]);

  // Obtenir les types uniques
  const types = useMemo(() => {
    const t = new Set(items.map(i => i.type).filter(Boolean));
    return Array.from(t) as string[];
  }, [items]);

  // Calculer la position horizontale d'un item
  const getItemPosition = (item: TimelineItem & { dateNumeric: number }) => {
    if (periods.length < 2) return 50;
    const minYear = periods[0].year;
    const maxYear = periods[periods.length - 1].year;
    const range = maxYear - minYear || 1;
    return ((item.dateNumeric - minYear) / range) * 100;
  };

  // Navigation
  const handleScroll = (direction: 'left' | 'right') => {
    const step = 20 / zoomLevel;
    setScrollPosition(prev => {
      const newPos = direction === 'left' ? prev - step : prev + step;
      return Math.max(0, Math.min(100 - 100 / zoomLevel, newPos));
    });
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel(prev => {
      const newZoom = direction === 'in' ? prev * 1.5 : prev / 1.5;
      return Math.max(1, Math.min(5, newZoom));
    });
  };

  // Grouper les items par position pour éviter les chevauchements
  const groupedItems = useMemo(() => {
    const groups: { position: number; items: (TimelineItem & { dateNumeric: number })[] }[] = [];
    const threshold = 3 / zoomLevel; // Seuil de proximité en %

    processedItems.forEach(item => {
      const pos = getItemPosition(item);
      const existingGroup = groups.find(g => Math.abs(g.position - pos) < threshold);
      
      if (existingGroup) {
        existingGroup.items.push(item);
      } else {
        groups.push({ position: pos, items: [item] });
      }
    });

    return groups;
  }, [processedItems, zoomLevel, periods]);

  return (
    <div className="space-y-4">
      {/* En-tête avec titre et filtres */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {title && <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-amber-600" />
            {title}
          </h2>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Filtre par type */}
          <Select value={selectedType || 'all'} onValueChange={(v) => setSelectedType(v === 'all' ? undefined : v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              {types.map(type => (
                <SelectItem key={type} value={type}>
                  {typeIcons[type]?.label || type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filtre par civilisation */}
          <Select value={selectedCivilization || 'all'} onValueChange={(v) => setSelectedCivilization(v === 'all' ? undefined : v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Civilisation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              {civilizations.map(civ => (
                <SelectItem key={civ} value={civ}>{civ}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Contrôles de zoom */}
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={() => handleZoom('out')} disabled={zoomLevel <= 1}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleZoom('in')} disabled={zoomLevel >= 5}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline principale */}
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          {/* Navigation */}
          <div className="flex items-center gap-2 mb-4">
            <Button variant="outline" size="icon" onClick={() => handleScroll('left')} disabled={scrollPosition <= 0}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 text-center text-sm text-muted-foreground">
              {processedItems.length} document{processedItems.length > 1 ? 's' : ''} • Zoom: {Math.round(zoomLevel * 100)}%
            </div>
            <Button variant="outline" size="icon" onClick={() => handleScroll('right')} disabled={scrollPosition >= 100 - 100 / zoomLevel}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Container de la timeline */}
          <div 
            ref={containerRef}
            className="relative h-[300px] overflow-hidden bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-950/20 rounded-lg"
          >
            {/* Axe des périodes */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-12 border-t border-amber-200 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/50"
              style={{
                width: `${zoomLevel * 100}%`,
                transform: `translateX(-${scrollPosition * zoomLevel}%)`,
              }}
            >
              {periods.map((period, idx) => (
                <div
                  key={idx}
                  className="absolute bottom-0 h-full flex flex-col items-center justify-end pb-2"
                  style={{ left: `${(idx / (periods.length - 1 || 1)) * 100}%` }}
                >
                  <div className="h-4 w-px bg-amber-300 dark:bg-amber-700" />
                  <span className="text-xs text-amber-700 dark:text-amber-400 whitespace-nowrap">
                    {period.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Items de la timeline */}
            <div 
              className="absolute top-4 left-0 right-0 bottom-16"
              style={{
                width: `${zoomLevel * 100}%`,
                transform: `translateX(-${scrollPosition * zoomLevel}%)`,
              }}
            >
              {groupedItems.map((group, groupIdx) => (
                <div
                  key={groupIdx}
                  className="absolute flex flex-col gap-1"
                  style={{ 
                    left: `${group.position}%`,
                    transform: 'translateX(-50%)',
                    top: '0',
                    maxWidth: '200px',
                  }}
                >
                  {/* Ligne verticale vers l'axe */}
                  <div className="absolute left-1/2 top-full h-8 w-px bg-amber-300 dark:bg-amber-700 -translate-x-1/2" />
                  
                  {group.items.map((item, itemIdx) => {
                    const TypeIcon = typeIcons[item.type]?.icon || ScrollText;
                    const typeColor = typeIcons[item.type]?.color || 'text-gray-600';
                    const civColor = civilizationColors[item.civilization || ''] || 'bg-gray-100 text-gray-800 border-gray-300';
                    
                    return (
                      <div
                        key={item.id}
                        className={`
                          relative p-2 rounded-lg border shadow-sm cursor-pointer
                          transition-all duration-200 hover:shadow-md hover:scale-105
                          ${civColor}
                          ${hoveredItem?.id === item.id ? 'ring-2 ring-amber-500 z-10' : ''}
                        `}
                        style={{ marginTop: itemIdx > 0 ? '4px' : '0' }}
                        onMouseEnter={() => setHoveredItem(item)}
                        onMouseLeave={() => setHoveredItem(null)}
                        onClick={() => onItemClick?.(item)}
                      >
                        <div className="flex items-start gap-2">
                          <TypeIcon className={`h-4 w-4 ${typeColor} flex-shrink-0 mt-0.5`} />
                          <div className="min-w-0">
                            <p className="text-xs font-medium line-clamp-2">{item.title}</p>
                            <p className="text-[10px] opacity-75">{item.date}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Panneau de détails au survol */}
      {hoveredItem && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30">
          <CardContent className="p-4">
            <div className="flex gap-4">
              {hoveredItem.imageUrl && (
                <img 
                  src={hoveredItem.imageUrl} 
                  alt={hoveredItem.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-lg">{hoveredItem.title}</h3>
                  <div className="flex gap-1">
                    <Badge variant="outline">{typeIcons[hoveredItem.type]?.label || hoveredItem.type}</Badge>
                    {hoveredItem.civilization && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {hoveredItem.civilization}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{hoveredItem.date}</p>
                {hoveredItem.description && (
                  <p className="text-sm mt-2 line-clamp-3">{hoveredItem.description}</p>
                )}
                {(hoveredItem.plantIds?.length || hoveredItem.moleculeIds?.length) && (
                  <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                    {hoveredItem.plantIds && hoveredItem.plantIds.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Leaf className="h-3 w-3" />
                        {hoveredItem.plantIds.length} plante{hoveredItem.plantIds.length > 1 ? 's' : ''}
                      </span>
                    )}
                    {hoveredItem.moleculeIds && hoveredItem.moleculeIds.length > 0 && (
                      <span className="flex items-center gap-1">
                        <FlaskConical className="h-3 w-3" />
                        {hoveredItem.moleculeIds.length} molécule{hoveredItem.moleculeIds.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Légende */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium">Types:</span>
          {Object.entries(typeIcons).map(([key, { icon: Icon, color, label }]) => (
            <span key={key} className="flex items-center gap-1">
              <Icon className={`h-4 w-4 ${color}`} />
              <span className="text-muted-foreground">{label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Timeline;
