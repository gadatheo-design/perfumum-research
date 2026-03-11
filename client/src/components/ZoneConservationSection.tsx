import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Shield, 
  Leaf, 
  Building2, 
  ChevronDown, 
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  Sprout,
  ExternalLink
} from 'lucide-react';

interface ZoneConservationSectionProps {
  zone: {
    id: number;
    name: string;
    threatLevel?: string | null;
    conservationPriority?: string | null;
    conservationEfforts?: string | null;
    sustainableAlternatives?: string | null;
    speciesCount?: number | null;
  };
}

// Parse le texte formaté avec des points-virgules et des tirets
function parseFormattedText(text: string | null | undefined): { title: string; items: string[] }[] {
  if (!text) return [];
  
  const sections: { title: string; items: string[] }[] = [];
  const lines = text.split(';').map(line => line.trim()).filter(Boolean);
  
  let currentSection: { title: string; items: string[] } | null = null;
  
  for (const line of lines) {
    if (line.startsWith('**') && line.endsWith('**')) {
      // C'est un titre de section
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: line.replace(/\*\*/g, '').replace(/:$/, ''),
        items: []
      };
    } else if (line.startsWith('- ') && currentSection) {
      // C'est un élément de liste
      currentSection.items.push(line.substring(2));
    } else if (currentSection) {
      // Texte libre dans la section courante
      currentSection.items.push(line);
    } else {
      // Texte sans section, créer une section par défaut
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
    <Badge className={`${info.color} flex items-center gap-1`}>
      {info.icon}
      {info.label}
    </Badge>
  );
}

function ConservationPriorityBadge({ priority }: { priority: string | null | undefined }) {
  if (!priority) return null;
  
  const config: Record<string, { label: string; color: string }> = {
    urgent: { label: 'Priorité urgente', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    high: { label: 'Priorité haute', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    medium: { label: 'Priorité moyenne', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    low: { label: 'Priorité basse', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  };
  
  const info = config[priority] || { label: priority, color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
  
  return (
    <Badge variant="outline" className={info.color}>
      {info.label}
    </Badge>
  );
}

export function ZoneConservationSection({ zone }: ZoneConservationSectionProps) {
  const [isEffortsOpen, setIsEffortsOpen] = useState(true);
  const [isAlternativesOpen, setIsAlternativesOpen] = useState(true);
  
  const conservationSections = parseFormattedText(zone.conservationEfforts);
  const alternativesSections = parseFormattedText(zone.sustainableAlternatives);
  
  const hasConservationData = zone.conservationEfforts || zone.sustainableAlternatives;
  
  if (!hasConservationData) {
    return null;
  }
  
  return (
    <Card className="mt-4 border-green-500/30 bg-green-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5 text-green-500" />
          Conservation & Durabilité
        </CardTitle>
        <CardDescription className="flex flex-wrap items-center gap-2 mt-2">
          <ThreatLevelBadge level={zone.threatLevel} />
          <ConservationPriorityBadge priority={zone.conservationPriority} />
          {zone.speciesCount && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Leaf className="h-3 w-3" />
              {zone.speciesCount} espèce(s)
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Efforts de conservation */}
        {conservationSections.length > 0 && (
          <Collapsible open={isEffortsOpen} onOpenChange={setIsEffortsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                <span className="flex items-center gap-2 font-medium">
                  <Building2 className="h-4 w-4 text-blue-500" />
                  Efforts de conservation
                </span>
                {isEffortsOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <div className="space-y-4 pl-6">
                {conservationSections.map((section, idx) => (
                  <div key={idx}>
                    {section.title && (
                      <h4 className="font-medium text-sm mb-2 text-foreground/90">
                        {section.title}
                      </h4>
                    )}
                    <ul className="space-y-1.5">
                      {section.items.map((item, itemIdx) => (
                        <li 
                          key={itemIdx} 
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
        
        {/* Alternatives durables */}
        {alternativesSections.length > 0 && (
          <Collapsible open={isAlternativesOpen} onOpenChange={setIsAlternativesOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                <span className="flex items-center gap-2 font-medium">
                  <Sprout className="h-4 w-4 text-emerald-500" />
                  Alternatives durables
                </span>
                {isAlternativesOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <div className="space-y-4 pl-6">
                {alternativesSections.map((section, idx) => (
                  <div key={idx}>
                    {section.title && (
                      <h4 className="font-medium text-sm mb-2 text-foreground/90">
                        {section.title}
                      </h4>
                    )}
                    <ul className="space-y-1.5">
                      {section.items.map((item, itemIdx) => (
                        <li 
                          key={itemIdx} 
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <Leaf className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}

export default ZoneConservationSection;
