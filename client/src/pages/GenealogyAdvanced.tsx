/**
 * PERFUMUM - Page Généalogie Avancée
 * Visualisation des arbres généalogiques et variétés disparues
 */

import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import DashboardLayout from '@/components/DashboardLayout';
import GenealogyTree from '@/components/GenealogyTree';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  GitBranch,
  Skull,
  Search,
  Filter,
  Leaf,
  AlertTriangle,
  Clock,
  MapPin,
  FlaskConical,
  BookOpen,
  RefreshCw
} from 'lucide-react';

// Couleurs par statut d'extinction
const extinctionStatusColors: Record<string, { bg: string; text: string; label: string }> = {
  extinct: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Éteint' },
  extinct_in_wild: { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'Éteint à l\'état sauvage' },
  presumed_extinct: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Présumé éteint' },
  possibly_extinct: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Possiblement éteint' },
  rediscovered: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Redécouvert' },
};

// Couleurs par cause d'extinction
const extinctionCauseLabels: Record<string, string> = {
  overexploitation: 'Surexploitation',
  habitat_loss: 'Perte d\'habitat',
  climate_change: 'Changement climatique',
  disease: 'Maladie',
  hybridization: 'Hybridation',
  war_conflict: 'Guerre/Conflit',
  unknown: 'Cause inconnue',
};

// Couleurs par possibilité de reconstruction
const reconstructionColors: Record<string, { bg: string; text: string; label: string }> = {
  possible: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Possible' },
  partial: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Partielle' },
  unlikely: { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'Peu probable' },
  impossible: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Impossible' },
};

export default function GenealogyAdvanced() {
  const [, navigate] = useLocation();
  const [selectedVarietyId, setSelectedVarietyId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('lost-varieties');

  // Récupérer les variétés pour le sélecteur
  const { data: varieties, isLoading: varietiesLoading } = trpc.plantVarieties.list.useQuery();
  
  // Récupérer les variétés disparues
  const { data: lostVarieties, isLoading: lostLoading } = trpc.lostVarieties.list.useQuery();
  
  // Récupérer les statistiques des variétés disparues
  const { data: lostStats } = trpc.lostVarieties.getStats.useQuery();
  
  // Récupérer l'arbre généalogique pour la variété sélectionnée
  const { data: genealogyData, isLoading: genealogyLoading } = trpc.genealogyAdvanced.getFullTree.useQuery(
    { varietyId: selectedVarietyId!, maxDepth: 10 },
    { enabled: !!selectedVarietyId }
  );

  // Filtrer les variétés disparues
  const filteredLostVarieties = lostVarieties?.filter(v => {
    const matchesSearch = !searchQuery || 
      v.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.latin_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.olfactive_description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || v.extinction_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-emerald-400 flex items-center gap-3">
              <GitBranch className="h-8 w-8" />
              Généalogie Avancée
            </h1>
            <p className="text-zinc-400 mt-1">
              Explorez les arbres généalogiques et les variétés disparues
            </p>
          </div>
        </div>

        {/* Statistiques globales */}
        {lostStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <Skull className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400">{lostStats.total}</div>
                    <div className="text-xs text-zinc-500">Variétés disparues</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <RefreshCw className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">
                      {lostStats.byReconstruction?.find((r: any) => r.reconstruction_possibility === 'possible')?.count || 0}
                    </div>
                    <div className="text-xs text-zinc-500">Reconstruction possible</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-400">
                      {lostStats.byCause?.find((c: any) => c.extinction_cause === 'overexploitation')?.count || 0}
                    </div>
                    <div className="text-xs text-zinc-500">Par surexploitation</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <Leaf className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-400">
                      {varieties?.length || 0}
                    </div>
                    <div className="text-xs text-zinc-500">Variétés documentées</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Onglets principaux */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-zinc-800">
            <TabsTrigger value="lost-varieties" className="flex items-center gap-2">
              <Skull className="h-4 w-4" />
              Variétés Disparues
            </TabsTrigger>
            <TabsTrigger value="genealogy-tree" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Arbre Généalogique
            </TabsTrigger>
          </TabsList>

          {/* Onglet Variétés Disparues */}
          <TabsContent value="lost-varieties" className="space-y-6">
            {/* Filtres */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                      placeholder="Rechercher une variété disparue..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[200px] bg-zinc-800 border-zinc-700">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="extinct">Éteint</SelectItem>
                      <SelectItem value="extinct_in_wild">Éteint à l'état sauvage</SelectItem>
                      <SelectItem value="presumed_extinct">Présumé éteint</SelectItem>
                      <SelectItem value="possibly_extinct">Possiblement éteint</SelectItem>
                      <SelectItem value="rediscovered">Redécouvert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Liste des variétés disparues */}
            {lostLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-64 bg-zinc-800" />
                ))}
              </div>
            ) : filteredLostVarieties.length === 0 ? (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Skull className="h-12 w-12 text-zinc-600 mb-4" />
                  <p className="text-zinc-500">Aucune variété disparue trouvée</p>
                  <p className="text-zinc-600 text-sm mt-1">
                    Les variétés disparues seront importées prochainement
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLostVarieties.map((variety: any) => {
                  const status = extinctionStatusColors[variety.extinction_status] || extinctionStatusColors.unknown;
                  const reconstruction = reconstructionColors[variety.reconstruction_possibility] || reconstructionColors.partial;
                  
                  return (
                    <Card key={variety.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg text-zinc-100">{variety.name}</CardTitle>
                            {variety.latin_name && (
                              <CardDescription className="italic">{variety.latin_name}</CardDescription>
                            )}
                          </div>
                          <Badge className={`${status.bg} ${status.text} border-0`}>
                            {status.label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Description olfactive */}
                        {variety.olfactive_description && (
                          <div className="p-3 bg-zinc-800/50 rounded-lg">
                            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                              <FlaskConical className="h-3 w-3" />
                              Profil olfactif
                            </div>
                            <p className="text-sm text-zinc-300 line-clamp-3">
                              {variety.olfactive_description}
                            </p>
                          </div>
                        )}

                        {/* Informations */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {variety.last_known_date && (
                            <div className="flex items-center gap-2 text-zinc-400">
                              <Clock className="h-4 w-4" />
                              <span>Dernière obs.: {variety.last_known_date > 0 ? variety.last_known_date : `${Math.abs(variety.last_known_date)} av. J.-C.`}</span>
                            </div>
                          )}
                          {variety.extinction_cause && (
                            <div className="flex items-center gap-2 text-zinc-400">
                              <AlertTriangle className="h-4 w-4" />
                              <span>{extinctionCauseLabels[variety.extinction_cause] || variety.extinction_cause}</span>
                            </div>
                          )}
                        </div>

                        {/* Reconstruction */}
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                          <div className="flex items-center gap-2">
                            <RefreshCw className="h-4 w-4 text-zinc-500" />
                            <span className="text-xs text-zinc-500">Reconstruction:</span>
                            <Badge className={`${reconstruction.bg} ${reconstruction.text} border-0 text-xs`}>
                              {reconstruction.label}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-emerald-400 hover:text-emerald-300"
                            onClick={() => navigate(`/varietes-disparues/${variety.id}`)}
                          >
                            <BookOpen className="h-4 w-4 mr-1" />
                            Détails
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Onglet Arbre Généalogique */}
          <TabsContent value="genealogy-tree" className="space-y-6">
            {/* Sélecteur de variété */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="text-sm text-zinc-400 mb-2 block">
                      Sélectionnez une variété pour afficher son arbre généalogique
                    </label>
                    <Select 
                      value={selectedVarietyId?.toString() || ''} 
                      onValueChange={(v) => setSelectedVarietyId(parseInt(v))}
                    >
                      <SelectTrigger className="bg-zinc-800 border-zinc-700">
                        <Leaf className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Choisir une variété..." />
                      </SelectTrigger>
                      <SelectContent>
                        {varieties?.map((v: any) => (
                          <SelectItem key={v.id} value={v.id.toString()}>
                            {v.name} {v.latinName && <span className="text-zinc-500 italic ml-2">({v.latinName})</span>}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Arbre généalogique */}
            {genealogyLoading ? (
              <Skeleton className="h-[600px] bg-zinc-800" />
            ) : (
              <GenealogyTree
                data={genealogyData as any}
                varietyId={selectedVarietyId || 0}
                onNodeClick={(node) => {
                  if (node.id > 0) {
                    navigate(`/varietes/${node.id}`);
                  }
                }}
                width={900}
                height={600}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
