import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TreePine, Leaf, Flower2, ArrowRight, BarChart3, Map, Clock } from 'lucide-react';

export default function PhylogeneticsHub() {
  const explorers = [
    {
      genus: 'Nicotiana',
      commonName: 'Tabacs',
      description: 'Arbre phylogénétique complet du genre Nicotiana avec 30+ variétés cultivées et sauvages',
      varieties: '30+',
      icon: Leaf,
      href: '/nicotiana-explorer',
      color: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-200',
    },
    {
      genus: 'Cannabis',
      commonName: 'Chanvres',
      description: 'Généalogie du Cannabis avec landraces, hybrides modernes et lignées de sélection',
      varieties: '25+',
      icon: Flower2,
      href: '/cannabis-landraces',
      color: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
    },
    {
      genus: 'Rosa',
      commonName: 'Roses',
      description: 'Classification phylogénétique des roses cultivées et espèces sauvages',
      varieties: '15+',
      icon: Flower2,
      href: '/phylogenetique',
      color: 'from-rose-50 to-pink-50',
      borderColor: 'border-rose-200',
    },
  ];

  const features = [
    {
      icon: TreePine,
      title: 'Arbre Interactif',
      description: 'Visualisez les relations généalogiques avec collapse/expand des branches',
    },
    {
      icon: Map,
      title: 'Distribution Géographique',
      description: 'Carte mondiale des origines et zones de culture de chaque variété',
    },
    {
      icon: BarChart3,
      title: 'Profils Moléculaires',
      description: 'Heatmap des alcaloïdes et terpènes par variété et génération',
    },
    {
      icon: Clock,
      title: 'Timeline Historique',
      description: 'Chronologie des découvertes, croisements et sélections',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-6">
            <TreePine className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-4">
            Phylogénétique
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Explorez les arbres généalogiques interactifs des genres cultivés : relations parentales, 
            distributions géographiques, profils moléculaires et évolutions historiques.
          </p>
          <p className="text-sm text-slate-500 italic">
            Chaque explorateur offre une vue complète des variétés, hybrides, landraces et clones 
            avec leurs caractéristiques botaniques et chimiques.
          </p>
        </div>
      </section>

      {/* Explorateurs */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Explorateurs de Genres</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {explorers.map((explorer) => {
              const Icon = explorer.icon;
              return (
                <Link key={explorer.genus} href={explorer.href}>
                  <Card className={`h-full cursor-pointer transition-all hover:shadow-lg hover:scale-105 bg-gradient-to-br ${explorer.color} ${explorer.borderColor} border-2`}>
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-lg bg-white/80 shadow-sm">
                          <Icon className="w-6 h-6 text-slate-700" />
                        </div>
                        <span className="text-sm font-bold text-slate-600 bg-white/80 px-3 py-1 rounded-full">
                          {explorer.varieties}
                        </span>
                      </div>
                      <CardTitle className="text-2xl">{explorer.genus}</CardTitle>
                      <CardDescription className="text-sm text-slate-600">
                        {explorer.commonName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700 mb-6">{explorer.description}</p>
                      <Button 
                        variant="outline" 
                        className="w-full group"
                        asChild
                      >
                        <span className="flex items-center justify-center gap-2">
                          Explorer
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Fonctionnalités Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="border-slate-200 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="p-2 rounded-lg bg-purple-100 w-fit mb-3">
                      <Icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Méthodologie */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Méthodologie</h2>
          <Card className="border-slate-200 bg-slate-50">
            <CardHeader>
              <CardTitle>Données Phylogénétiques Intégrées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Sources de Données</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li>Wikidata API pour taxonomie et relations parentales</li>
                  <li>Littérature scientifique (PubMed, MDPI, ResearchGate)</li>
                  <li>Bases de données botaniques (IPNI, Tropicos)</li>
                  <li>Profils GC-MS et analyses chimiques</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Interactions Disponibles</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li>Collapse/Expand des branches pour naviguer les grands arbres</li>
                  <li>Zoom & Pan interactif (mouse wheel, double-click reset)</li>
                  <li>Recherche et filtrage par nom scientifique/commun</li>
                  <li>Affichage des détails au survol et clic</li>
                  <li>Export SVG/PNG des arbres visualisés</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
