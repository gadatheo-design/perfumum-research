import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, ChevronRight, Leaf } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { nicotianaPhylogeny } from '@/lib/nicotianaPhylogeny';

interface SpeciesNode {
  id: string;
  latinName: string;
  section?: string;
  isNew?: boolean;
  isCriticallyEndangered?: boolean;
}

export function NicotianaPhylogenyInteractive() {
  const [, navigate] = useLocation();
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Grouper les espèces par section
  const speciesBySection: Record<string, SpeciesNode[]> = {};
  
  nicotianaPhylogeny.species.forEach(species => {
    const section = species.section || 'Unknown';
    if (!speciesBySection[section]) {
      speciesBySection[section] = [];
    }
    speciesBySection[section].push({
      id: species.id,
      latinName: species.latinName,
      section: species.section,
      isNew: species.isNew,
      isCriticallyEndangered: species.conservationStatus === 'CR'
    });
  });

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleSpeciesClick = (speciesId: string) => {
    setSelectedSpecies(speciesId);
    navigate(`/nicotiana-species/${speciesId}`);
  };

  const sections = Object.keys(speciesBySection).sort();

  return (
    <div className="space-y-6">
      <Alert>
        <Leaf className="h-4 w-4" />
        <AlertDescription>
          Cliquez sur une espèce pour voir ses détails complets (morphologie, distribution, profil moléculaire, conservation)
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        {sections.map((section) => {
          const species = speciesBySection[section];
          const isExpanded = expandedSections.has(section);

          return (
            <Card key={section} className="overflow-hidden">
              <CardHeader className="pb-3">
                <button
                  onClick={() => toggleSection(section)}
                  className="flex items-center justify-between w-full hover:opacity-70 transition-opacity"
                >
                  <div className="flex items-center gap-3">
                    <ChevronRight
                      className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    />
                    <CardTitle className="text-lg">{section}</CardTitle>
                    <Badge variant="secondary">{species.length} espèces</Badge>
                  </div>
                </button>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {species.map((sp) => (
                      <button
                        key={sp.id}
                        onClick={() => handleSpeciesClick(sp.id)}
                        className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium italic">{sp.latinName}</span>
                              {sp.isNew && (
                                <Badge variant="default" className="bg-green-600">
                                  Nouvelle
                                </Badge>
                              )}
                              {sp.isCriticallyEndangered && (
                                <Badge variant="destructive">
                                  En Danger Critique
                                </Badge>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total d'espèces</p>
              <p className="text-2xl font-bold">{nicotianaPhylogeny.species.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sections taxonomiques</p>
              <p className="text-2xl font-bold">{sections.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Espèces nouvelles</p>
              <p className="text-2xl font-bold">
                {nicotianaPhylogeny.species.filter(s => s.isNew).length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En danger critique</p>
              <p className="text-2xl font-bold">
                {nicotianaPhylogeny.species.filter(s => s.conservationStatus === 'CR').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Info */}
      <Card>
        <CardHeader>
          <CardTitle>À propos des sections taxonomiques</CardTitle>
          <CardDescription>
            Les sections Nicotiana selon la classification phylogénétique
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: 'Suaveolentes', desc: 'Espèces à fleurs suaves, principalement sud-américaines' },
            { name: 'Noctiflorae', desc: 'Espèces à fleurs nocturnes, incluant N. glauca' },
            { name: 'Alatae', desc: 'Espèces aux tiges ailées, incluant N. alata et N. tabacum' },
            { name: 'Nicotiana', desc: 'Section type contenant N. tabacum et espèces connexes' },
            { name: 'Sylvestris', desc: 'Espèces sauvages, principalement sud-américaines' },
            { name: 'Repandae', desc: 'Espèces aux feuilles ondulées' },
            { name: 'Petunoides', desc: 'Espèces ressemblant à Petunia' },
            { name: 'Paniculatae', desc: 'Espèces à inflorescences en panicules, incluant N. rupicola' },
            { name: 'Tomentosae', desc: 'Espèces pubescentes, section basale' }
          ].map((section) => (
            <div key={section.name} className="p-3 border rounded-lg">
              <p className="font-semibold">{section.name}</p>
              <p className="text-sm text-muted-foreground">{section.desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
