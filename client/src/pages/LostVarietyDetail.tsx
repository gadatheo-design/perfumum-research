/**
 * PERFUMUM - Page Détail Variété Disparue
 * Affichage complet des informations sur une variété disparue
 */

import { useRoute, useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Skull,
  Clock,
  MapPin,
  AlertTriangle,
  RefreshCw,
  FlaskConical,
  BookOpen,
  Leaf,
  Heart,
  Globe,
  FileText,
  ExternalLink
} from 'lucide-react';

// Couleurs par statut d'extinction
const extinctionStatusColors: Record<string, { bg: string; text: string; label: string; description: string }> = {
  extinct: { 
    bg: 'bg-red-500/20', 
    text: 'text-red-400', 
    label: 'Éteint (EX)', 
    description: 'Aucun individu connu vivant'
  },
  extinct_in_wild: { 
    bg: 'bg-orange-500/20', 
    text: 'text-orange-400', 
    label: 'Éteint à l\'état sauvage (EW)',
    description: 'Survit uniquement en culture ou en captivité'
  },
  presumed_extinct: { 
    bg: 'bg-yellow-500/20', 
    text: 'text-yellow-400', 
    label: 'Présumé éteint',
    description: 'Probablement éteint mais non confirmé'
  },
  possibly_extinct: { 
    bg: 'bg-amber-500/20', 
    text: 'text-amber-400', 
    label: 'Possiblement éteint',
    description: 'Pourrait encore exister dans des zones non explorées'
  },
  rediscovered: { 
    bg: 'bg-emerald-500/20', 
    text: 'text-emerald-400', 
    label: 'Redécouvert',
    description: 'Considéré éteint puis retrouvé'
  },
};

// Labels des causes d'extinction
const extinctionCauseInfo: Record<string, { label: string; icon: string; description: string }> = {
  overexploitation: { 
    label: 'Surexploitation', 
    icon: '🪓',
    description: 'Récolte excessive pour le commerce ou l\'usage'
  },
  habitat_loss: { 
    label: 'Perte d\'habitat', 
    icon: '🏗️',
    description: 'Destruction de l\'environnement naturel'
  },
  climate_change: { 
    label: 'Changement climatique', 
    icon: '🌡️',
    description: 'Modifications des conditions environnementales'
  },
  disease: { 
    label: 'Maladie', 
    icon: '🦠',
    description: 'Pathogènes ou parasites'
  },
  hybridization: { 
    label: 'Hybridation', 
    icon: '🧬',
    description: 'Dilution génétique par croisement'
  },
  war_conflict: { 
    label: 'Guerre/Conflit', 
    icon: '⚔️',
    description: 'Destruction liée aux conflits armés'
  },
  unknown: { 
    label: 'Cause inconnue', 
    icon: '❓',
    description: 'Raison de la disparition non déterminée'
  },
};

// Couleurs par possibilité de reconstruction
const reconstructionInfo: Record<string, { bg: string; text: string; label: string; description: string }> = {
  possible: { 
    bg: 'bg-emerald-500/20', 
    text: 'text-emerald-400', 
    label: 'Reconstruction possible',
    description: 'Des techniques modernes pourraient permettre de recréer cette variété'
  },
  partial: { 
    bg: 'bg-yellow-500/20', 
    text: 'text-yellow-400', 
    label: 'Reconstruction partielle',
    description: 'Certains aspects pourraient être reconstitués mais pas la totalité'
  },
  unlikely: { 
    bg: 'bg-orange-500/20', 
    text: 'text-orange-400', 
    label: 'Reconstruction peu probable',
    description: 'Les informations disponibles sont insuffisantes'
  },
  impossible: { 
    bg: 'bg-red-500/20', 
    text: 'text-red-400', 
    label: 'Reconstruction impossible',
    description: 'Aucune donnée génétique ou moléculaire disponible'
  },
};

export default function LostVarietyDetail() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute('/varietes-disparues/:id');
  const id = params?.id ? parseInt(params.id) : 0;

  const { data: variety, isLoading } = trpc.lostVarieties.getById.useQuery(
    { id },
    { enabled: !!id }
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-64 bg-zinc-800" />
          <Skeleton className="h-96 bg-zinc-800" />
        </div>
      </DashboardLayout>
    );
  }

  if (!variety) {
    return (
      <DashboardLayout>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Skull className="h-12 w-12 text-zinc-600 mb-4" />
            <p className="text-zinc-500">Variété disparue non trouvée</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate('/genealogie-avancee')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la liste
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const status = extinctionStatusColors[variety.extinction_status] || extinctionStatusColors.presumed_extinct;
  const cause = extinctionCauseInfo[variety.extinction_cause] || extinctionCauseInfo.unknown;
  const reconstruction = reconstructionInfo[variety.reconstruction_possibility] || reconstructionInfo.partial;

  // Parser les données JSON
  const historicalNames = variety.historical_names ? JSON.parse(variety.historical_names) : [];
  const historicalRange = variety.historical_range ? JSON.parse(variety.historical_range) : {};
  const hypotheticalProfile = variety.hypothetical_molecular_profile ? JSON.parse(variety.hypothetical_molecular_profile) : {};
  const closestRelatives = variety.closest_living_relatives ? JSON.parse(variety.closest_living_relatives) : [];
  const primarySources = variety.primary_sources ? JSON.parse(variety.primary_sources) : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Navigation */}
        <Button
          variant="ghost"
          className="text-zinc-400 hover:text-zinc-200"
          onClick={() => navigate('/genealogie-avancee')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux variétés disparues
        </Button>

        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <Skull className="h-8 w-8 text-red-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-zinc-100">{variety.name}</h1>
                {variety.latin_name && (
                  <p className="text-lg text-zinc-400 italic">{variety.latin_name}</p>
                )}
              </div>
            </div>
          </div>
          <Badge className={`${status.bg} ${status.text} border-0 text-sm px-4 py-2`}>
            {status.label}
          </Badge>
        </div>

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statut d'extinction */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Statut d'extinction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`p-4 rounded-lg ${status.bg}`}>
                  <p className={`font-semibold ${status.text}`}>{status.label}</p>
                  <p className="text-sm text-zinc-400 mt-1">{status.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {variety.last_known_date && (
                    <div className="p-3 bg-zinc-800/50 rounded-lg">
                      <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
                        <Clock className="h-3 w-3" />
                        Dernière observation
                      </div>
                      <p className="text-zinc-200 font-medium">
                        {variety.last_known_date > 0 
                          ? `${variety.last_known_date} apr. J.-C.`
                          : `${Math.abs(variety.last_known_date)} av. J.-C.`
                        }
                      </p>
                    </div>
                  )}
                  
                  {variety.extinction_date && (
                    <div className="p-3 bg-zinc-800/50 rounded-lg">
                      <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
                        <Skull className="h-3 w-3" />
                        Date d'extinction
                      </div>
                      <p className="text-zinc-200 font-medium">
                        {variety.extinction_date > 0 
                          ? `${variety.extinction_date} apr. J.-C.`
                          : `${Math.abs(variety.extinction_date)} av. J.-C.`
                        }
                      </p>
                    </div>
                  )}
                </div>

                {variety.extinction_cause && (
                  <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{cause.icon}</span>
                      <span className="font-semibold text-amber-400">{cause.label}</span>
                    </div>
                    <p className="text-sm text-zinc-400">{cause.description}</p>
                    {variety.extinction_details && (
                      <p className="text-sm text-zinc-300 mt-2">{variety.extinction_details}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profil olfactif */}
            {variety.olfactive_description && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-400">
                    <FlaskConical className="h-5 w-5" />
                    Profil Olfactif
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-300 leading-relaxed">{variety.olfactive_description}</p>
                </CardContent>
              </Card>
            )}

            {/* Description morphologique */}
            {variety.morphological_description && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-indigo-400">
                    <Leaf className="h-5 w-5" />
                    Description Morphologique
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-300 leading-relaxed">{variety.morphological_description}</p>
                </CardContent>
              </Card>
            )}

            {/* Usages thérapeutiques */}
            {variety.therapeutic_uses && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-pink-400">
                    <Heart className="h-5 w-5" />
                    Usages Thérapeutiques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-300 leading-relaxed">{variety.therapeutic_uses}</p>
                </CardContent>
              </Card>
            )}

            {/* Signification culturelle */}
            {variety.cultural_significance && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-400">
                    <Globe className="h-5 w-5" />
                    Signification Culturelle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-300 leading-relaxed">{variety.cultural_significance}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Reconstruction */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-400">
                  <RefreshCw className="h-5 w-5" />
                  Reconstruction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`p-3 rounded-lg ${reconstruction.bg}`}>
                  <p className={`font-semibold ${reconstruction.text}`}>{reconstruction.label}</p>
                  <p className="text-xs text-zinc-400 mt-1">{reconstruction.description}</p>
                </div>
                
                {variety.reconstruction_notes && (
                  <p className="text-sm text-zinc-400">{variety.reconstruction_notes}</p>
                )}
              </CardContent>
            </Card>

            {/* Noms historiques */}
            {historicalNames.length > 0 && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-violet-400">
                    <BookOpen className="h-5 w-5" />
                    Noms Historiques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {historicalNames.map((name: string, i: number) => (
                      <Badge key={i} variant="outline" className="bg-violet-500/10 text-violet-400 border-violet-500/30">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Aire de répartition historique */}
            {Object.keys(historicalRange).length > 0 && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-400">
                    <MapPin className="h-5 w-5" />
                    Aire Historique
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {historicalRange.regions && (
                    <div>
                      <span className="text-xs text-zinc-500">Régions:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {historicalRange.regions.map((region: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {region}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {historicalRange.extent && (
                    <p className="text-sm text-zinc-400">
                      <span className="text-zinc-500">Étendue:</span> {historicalRange.extent}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Profil moléculaire hypothétique */}
            {Object.keys(hypotheticalProfile).length > 0 && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-teal-400">
                    <FlaskConical className="h-5 w-5" />
                    Profil Moléculaire
                  </CardTitle>
                  <CardDescription>Hypothétique / Reconstruit</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {hypotheticalProfile.family && (
                    <p><span className="text-zinc-500">Famille:</span> <span className="text-zinc-300">{hypotheticalProfile.family}</span></p>
                  )}
                  {hypotheticalProfile.relatedTo && (
                    <p><span className="text-zinc-500">Apparenté à:</span> <span className="text-zinc-300">{hypotheticalProfile.relatedTo}</span></p>
                  )}
                  {hypotheticalProfile.mainMolecules && (
                    <div>
                      <span className="text-zinc-500">Molécules principales:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {hypotheticalProfile.mainMolecules.map((mol: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs bg-teal-500/10 text-teal-400 border-teal-500/30">
                            {mol}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {hypotheticalProfile.reconstructedBy && (
                    <p className="text-xs text-zinc-500 mt-2">
                      Reconstruit par: {hypotheticalProfile.reconstructedBy}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Proches parents vivants */}
            {closestRelatives.length > 0 && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-400">
                    <Leaf className="h-5 w-5" />
                    Proches Parents Vivants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {closestRelatives.map((relative: string, i: number) => (
                      <div key={i} className="p-2 bg-green-500/10 rounded text-sm text-green-400 italic">
                        {relative}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sources primaires */}
            {primarySources.length > 0 && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-zinc-400">
                    <FileText className="h-5 w-5" />
                    Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {primarySources.map((source: string, i: number) => (
                      <li key={i} className="text-zinc-400 flex items-start gap-2">
                        <span className="text-zinc-600">•</span>
                        {source}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
