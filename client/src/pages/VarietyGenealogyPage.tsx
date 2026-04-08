/**
 * VarietyGenealogyPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Page pour afficher et explorer les généalogies de variétés
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import { useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VarietyGenealogyViewer } from '@/components/VarietyGenealogyGraph';
import { trpc } from '@/lib/trpc';
import { Loader2, Search, ArrowLeft } from 'lucide-react';
import {
  nicotianaVarietyGenealogy,
  cannabisVarietyGenealogy,
  citrusVarietyGenealogy,
} from '@/lib/nicotianaPhylogeny';

// Données de généalogie temporaires (à remplacer par tRPC)
const nicotianaVarietyGenealogy = { varieties: [], relationships: [] };
const cannabisVarietyGenealogy = { varieties: [], relationships: [] };
const citrusVarietyGenealogy = { varieties: [], relationships: [] };

// ── Mapping des généalogies ──────────────────────────────────────────────────

const genealogies = {
  nicotiana: nicotianaVarietyGenealogy,
  cannabis: cannabisVarietyGenealogy,
  citrus: citrusVarietyGenealogy,
};

// ── Page principale ──────────────────────────────────────────────────────────

export function VarietyGenealogyPage() {
  const [, params] = useRoute('/variety-genealogy/:genus');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('graph');

  const genus = params?.genus?.toLowerCase() || 'nicotiana';
  const genealogy = genealogies[genus as keyof typeof genealogies];

  if (!genealogy) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Genre non trouvé</h1>
          <p className="text-gray-600 mb-6">
            Le genre "{genus}" n'a pas de données généalogiques disponibles.
          </p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  // Filtrer les variétés selon la recherche
  const filteredVarieties = genealogy.nodes.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.species.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">
            Généalogie du genre {genealogy.rootVariety.species.split(' ')[0]}
          </h1>
        </div>
        <p className="text-gray-600">
          Explorez les relations généalogiques, les croisements et les hybrides
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Total variétés</div>
          <div className="text-2xl font-bold">{genealogy.totalVarieties}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Profondeur</div>
          <div className="text-2xl font-bold">{genealogy.depth}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Statut critique</div>
          <div className="text-2xl font-bold text-red-600">
            {genealogy.nodes.filter((n) => n.conservationStatus === 'endangered').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Relations</div>
          <div className="text-2xl font-bold">{genealogy.relations.length}</div>
        </Card>
      </div>

      {/* Onglets */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="graph">Arbre généalogique</TabsTrigger>
          <TabsTrigger value="list">Liste des variétés</TabsTrigger>
          <TabsTrigger value="info">Informations</TabsTrigger>
        </TabsList>

        {/* Onglet : Arbre généalogique */}
        <TabsContent value="graph" className="mt-6">
          <Card className="p-6">
            <VarietyGenealogyViewer genealogy={genealogy} height={700} />
          </Card>
        </TabsContent>

        {/* Onglet : Liste des variétés */}
        <TabsContent value="list" className="mt-6">
          <Card className="p-6">
            {/* Barre de recherche */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une variété..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Grille de variétés */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVarieties.map((variety) => (
                <Card key={variety.id} className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold text-lg mb-2">{variety.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{variety.species}</p>

                  {variety.year && (
                    <p className="text-xs text-gray-500 mb-2">Année: {variety.year}</p>
                  )}

                  {variety.origin && (
                    <p className="text-xs text-gray-600 mb-2">Origine: {variety.origin}</p>
                  )}

                  {variety.conservationStatus && (
                    <Badge
                      className={`mb-2 ${
                        variety.conservationStatus === 'endangered'
                          ? 'bg-red-600'
                          : variety.conservationStatus === 'vulnerable'
                            ? 'bg-orange-600'
                            : 'bg-green-600'
                      }`}
                    >
                      {variety.conservationStatus}
                    </Badge>
                  )}

                  {variety.description && (
                    <p className="text-sm text-gray-700 mt-2">{variety.description}</p>
                  )}

                  {variety.molecularProfile && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs font-semibold mb-2">Profil moléculaire:</p>
                      <div className="space-y-1">
                        {Object.entries(variety.molecularProfile)
                          .slice(0, 3)
                          .map(([compound, value]) => (
                            <div key={compound} className="flex justify-between text-xs">
                              <span>{compound}</span>
                              <span className="font-mono">{value.toFixed(2)}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {filteredVarieties.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">Aucune variété ne correspond à votre recherche</p>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Onglet : Informations */}
        <TabsContent value="info" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Statuts de conservation */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Statut de conservation</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Éteint</span>
                  <span className="font-bold">
                    {genealogy.nodes.filter((n) => n.conservationStatus === 'extinct').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>En danger critique</span>
                  <span className="font-bold text-red-600">
                    {genealogy.nodes.filter((n) => n.conservationStatus === 'endangered').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Vulnérable</span>
                  <span className="font-bold text-orange-600">
                    {genealogy.nodes.filter((n) => n.conservationStatus === 'vulnerable').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Stable</span>
                  <span className="font-bold">
                    {genealogy.nodes.filter((n) => n.conservationStatus === 'stable').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cultivé</span>
                  <span className="font-bold">
                    {genealogy.nodes.filter((n) => n.conservationStatus === 'cultivated').length}
                  </span>
                </div>
              </div>
            </Card>

            {/* Types de relations */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Types de relations</h3>
              <div className="space-y-2">
                {Object.entries({
                  parent: 'Parent',
                  sibling: 'Frère/Sœur',
                  hybrid: 'Hybride',
                  cultivar: 'Cultivar',
                  cross: 'Croisement',
                  mutation: 'Mutation',
                }).map(([type, label]) => (
                  <div key={type} className="flex justify-between">
                    <span>{label}</span>
                    <span className="font-bold">
                      {genealogy.relations.filter((r) => r.type === type).length}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Légende des couleurs */}
            <Card className="p-6 md:col-span-2">
              <h3 className="font-bold text-lg mb-4">Légende des relations</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-blue-500" />
                  <span className="text-sm">Parent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-purple-500" />
                  <span className="text-sm">Frère/Sœur</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-pink-500" />
                  <span className="text-sm">Hybride</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-green-500" />
                  <span className="text-sm">Cultivar</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-amber-500" />
                  <span className="text-sm">Croisement</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-red-500" />
                  <span className="text-sm">Mutation</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
