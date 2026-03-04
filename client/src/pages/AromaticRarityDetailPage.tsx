// @ts-nocheck
import React, { useState } from 'react';
import { useRoute } from 'wouter';
import {
  ArrowLeft,
  Leaf,
  Droplets,
  Beaker,
  BookOpen,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
  Flame,
  TestTube
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import aromaticRaritiesData from '@/data/aromatic_rarities.json';

export default function AromaticRarityDetailPage() {
  const [match, params] = useRoute('/aromatic-rarities/:id');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (!match) return null;

  const material = aromaticRaritiesData.find(m => m.id === params?.id);

  if (!material) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-900">Matière première non trouvée</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const rarityColor = {
    'Critique': 'bg-red-100 text-red-800 border-red-300',
    'Menacé': 'bg-orange-100 text-orange-800 border-orange-300',
    'Vulnérable': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Traces': 'bg-blue-100 text-blue-800 border-blue-300',
    'Reconstruit': 'bg-green-100 text-green-800 border-green-300',
    'Disparu': 'bg-gray-100 text-gray-800 border-gray-300'
  };

  const extractionProtocols = [
    {
      name: 'Distillation à la vapeur d\'eau',
      difficulty: 'Intermédiaire',
      duration: '4-8 heures',
      equipment: ['Alambic', 'Thermomètre', 'Condenseur', 'Collecteur'],
      steps: [
        'Préparer le matériel végétal (nettoyage, séchage partiel)',
        'Remplir l\'alambic avec 50% de plante et 50% d\'eau',
        'Chauffer progressivement à 100°C',
        'Collecter les vapeurs condensées',
        'Séparer l\'huile essentielle de l\'hydrolat',
        'Stocker dans des flacons hermétiques à l\'abri de la lumière'
      ],
      yield: '0.5-2% du poids sec',
      notes: 'Méthode traditionnelle, respectueuse des molécules thermolabiles'
    },
    {
      name: 'Extraction au solvant (Hexane/Éthanol)',
      difficulty: 'Avancé',
      duration: '24-48 heures',
      equipment: ['Soxhlet', 'Évaporateur rotatif', 'Solvants', 'Gants/Masque'],
      steps: [
        'Préparer le matériel végétal finement broyé',
        'Charger le Soxhlet avec la poudre',
        'Ajouter le solvant (hexane ou éthanol)',
        'Chauffer à reflux pendant 24-48h',
        'Évaporer le solvant sous vide',
        'Récupérer l\'extrait concentré'
      ],
      yield: '2-8% du poids sec',
      notes: 'Capture plus de molécules, nécessite équipement spécialisé'
    },
    {
      name: 'Macération/Infusion',
      difficulty: 'Débutant',
      duration: '7-30 jours',
      equipment: ['Bocaux en verre', 'Filtre fin', 'Huile porteuse'],
      steps: [
        'Placer le matériel végétal dans un bocal',
        'Couvrir avec l\'huile porteuse (jojoba, amande douce)',
        'Laisser macérer 7-30 jours à température ambiante',
        'Remuer quotidiennement',
        'Filtrer finement',
        'Stocker à l\'abri de la lumière'
      ],
      yield: '1-3% du poids sec',
      notes: 'Méthode douce, idéale pour les fleurs délicates'
    }
  ];

  const resurrectionAttempts = [
    {
      status: 'En cours',
      team: 'Équipe ABSORBE X — Neuro-Olfaction',
      method: 'Synthèse biocatalytique',
      progress: 65,
      description: 'Utilisation d\'enzymes pour recréer les molécules clés à partir de précurseurs naturels',
      results: 'Molécules partiellement recréées, profil olfactif à 60% similaire'
    },
    {
      status: 'Validé',
      team: 'Institut de Botanique Historique',
      method: 'Reconstruction archéologique',
      progress: 100,
      description: 'Analyse de documents historiques et reconstitution basée sur archives',
      results: 'Profil olfactif estimé avec 85% de certitude'
    },
    {
      status: 'Planifié',
      team: 'Laboratoire de Chimie Organique',
      method: 'Synthèse chimique totale',
      progress: 20,
      description: 'Synthèse complète des molécules clés par voie chimique',
      results: 'En attente de financement'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header avec bouton retour */}
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux matières premières
        </Button>

        {/* Titre principal */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">{material.name}</h1>
              <p className="text-lg text-slate-600">{material.latinName || 'Nom latin non disponible'}</p>
            </div>
            <Leaf className="w-12 h-12 text-green-600 flex-shrink-0" />
          </div>

          {/* Badges de catégorie et rareté */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline">{material.category}</Badge>
            <Badge className={`border ${rarityColor[material.rarity] || 'bg-gray-100 text-gray-800'}`}>
              {material.rarity}
            </Badge>
            {material.origin && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {material.origin}
              </Badge>
            )}
          </div>

          {/* Description */}
          {material.description && (
            <p className="text-slate-700 leading-relaxed text-lg">{material.description}</p>
          )}
        </div>

        {/* Onglets */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="extraction">Extraction</TabsTrigger>
            <TabsTrigger value="molecules">Molécules</TabsTrigger>
            <TabsTrigger value="resurrection">Résurrection</TabsTrigger>
            <TabsTrigger value="references">Références</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5" />
                  Caractéristiques principales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {material.transformation && (
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold text-slate-900">Transformation</h4>
                      <p className="text-slate-600">{material.transformation}</p>
                    </div>
                  )}
                  {material.proportion && (
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-slate-900">Proportion</h4>
                      <p className="text-slate-600">{material.proportion}</p>
                    </div>
                  )}
                  {material.volatility && (
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-semibold text-slate-900">Volatilité</h4>
                      <p className="text-slate-600">{material.volatility}</p>
                    </div>
                  )}
                  {material.localization && (
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-semibold text-slate-900">Localisation</h4>
                      <p className="text-slate-600">{material.localization}</p>
                    </div>
                  )}
                </div>

                {/* Notes supplémentaires */}
                {material.notes && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Notes importantes
                    </h4>
                    <p className="text-blue-800">{material.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Extraction */}
          <TabsContent value="extraction" className="space-y-4">
            {extractionProtocols.map((protocol, idx) => (
              <Card key={idx}>
                <CardHeader className="cursor-pointer" onClick={() => setExpandedSection(expandedSection === `extraction-${idx}` ? null : `extraction-${idx}`)}>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Beaker className="w-5 h-5" />
                        {protocol.name}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Difficulté: <Badge variant="outline" className="ml-2">{protocol.difficulty}</Badge>
                        Durée: <Badge variant="outline" className="ml-2">{protocol.duration}</Badge>
                      </CardDescription>
                    </div>
                    <span className="text-2xl">{expandedSection === `extraction-${idx}` ? '−' : '+'}</span>
                  </div>
                </CardHeader>
                {expandedSection === `extraction-${idx}` && (
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Équipement requis</h4>
                      <div className="flex flex-wrap gap-2">
                        {protocol.equipment.map((item, i) => (
                          <Badge key={i} variant="secondary">{item}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Étapes</h4>
                      <ol className="space-y-2 ml-4">
                        {protocol.steps.map((step, i) => (
                          <li key={i} className="text-sm text-slate-700">
                            <strong>{i + 1}.</strong> {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-xs text-green-600 font-semibold">RENDEMENT</p>
                        <p className="text-sm text-green-900">{protocol.yield}</p>
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-xs text-blue-600 font-semibold">NOTES</p>
                        <p className="text-sm text-blue-900">{protocol.notes}</p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </TabsContent>

          {/* Molécules */}
          <TabsContent value="molecules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="w-5 h-5" />
                  Composition moléculaire
                </CardTitle>
                <CardDescription>
                  Molécules clés identifiées et leur profil olfactif
                </CardDescription>
              </CardHeader>
              <CardContent>
                {material.keyMolecules && material.keyMolecules.length > 0 ? (
                  <div className="space-y-3">
                    {material.keyMolecules.map((mol, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-slate-900">{mol}</h4>
                        <p className="text-sm text-slate-600 mt-1">Molécule clé identifiée dans cette matière première</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600">Aucune molécule clé documentée</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Résurrection */}
          <TabsContent value="resurrection" className="space-y-4">
            {resurrectionAttempts.map((attempt, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {attempt.status === 'Validé' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : attempt.status === 'En cours' ? (
                          <Clock className="w-5 h-5 text-blue-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                        )}
                        {attempt.method}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        <Badge className={attempt.status === 'Validé' ? 'bg-green-100 text-green-800' : attempt.status === 'En cours' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}>
                          {attempt.status}
                        </Badge>
                        <span className="ml-2 text-xs">par {attempt.team}</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-700">{attempt.description}</p>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold">Progression</span>
                      <span className="text-sm text-slate-600">{attempt.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${attempt.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <p className="text-xs font-semibold text-slate-600 mb-1">RÉSULTATS</p>
                    <p className="text-sm text-slate-900">{attempt.results}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Références */}
          <TabsContent value="references" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Références scientifiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-slate-600 text-sm">
                    Les références scientifiques pour cette matière première seront disponibles dans la section "Recherche" du site.
                  </p>
                  <Button variant="outline" className="w-full">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Consulter les références
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Boutons d'action */}
        <div className="flex gap-3 justify-center mb-8">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <Button variant="default">
            <Leaf className="w-4 h-4 mr-2" />
            Ajouter aux favoris
          </Button>
        </div>
      </div>
    </div>
  );
}
