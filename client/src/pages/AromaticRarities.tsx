import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Globe, 
  Sparkles, 
  Leaf, 
  Beaker, 
  AlertCircle,
  ChevronRight,
  Filter
} from 'lucide-react';
import aromaticRaritiesData from '@/data/aromatic_rarities.json';
import { AromaticRaritiesGraph } from '@/components/AromaticRaritiesGraph';
import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';

interface AromaticRarity {
  id: string;
  name: string;
  category: string;
  geography: string;
  rarity_regime: string;
  cultural_status: string;
  source_type: string;
  extractability: string;
  key_molecules: string;
  absorbe_potential: string;
  notes: string;
  references: string;
  temporal_behavior: string;
  industrial_products: string;
}

export default function AromaticRarities() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');

  // Récupérer les données
  const materials: AromaticRarity[] = aromaticRaritiesData.materials || [];

  // Extraire les catégories et rareté uniques
  const categories = useMemo(() => {
    const cats = new Set(materials.map(m => m.category));
    return Array.from(cats).sort();
  }, [materials]);

  const rarities = useMemo(() => {
    const rars = new Set(materials.map(m => m.rarity_regime));
    return Array.from(rars).sort();
  }, [materials]);

  // Filtrer les matières premières
  const filteredMaterials = useMemo(() => {
    return materials.filter(material => {
      const matchesSearch = 
        material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.key_molecules.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
      const matchesRarity = selectedRarity === 'all' || material.rarity_regime === selectedRarity;
      
      return matchesSearch && matchesCategory && matchesRarity;
    });
  }, [materials, searchQuery, selectedCategory, selectedRarity]);

  // Statistiques
  const stats = useMemo(() => {
    return {
      total: materials.length,
      byCategory: categories.map(cat => ({
        name: cat,
        count: materials.filter(m => m.category === cat).length
      })),
      byRarity: rarities.map(rar => ({
        name: rar,
        count: materials.filter(m => m.rarity_regime === rar).length
      })),
      byGeography: Array.from(
        new Set(materials.flatMap(m => m.geography.split(';').map(g => g.trim())))
      ).slice(0, 10),
    };
  }, [materials, categories, rarities]);

  // Couleurs pour les catégories
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Transformation': 'bg-purple-100 text-purple-800',
      'Proportion': 'bg-blue-100 text-blue-800',
      'Localization': 'bg-green-100 text-green-800',
      'Volatility': 'bg-orange-100 text-orange-800',
      'Censure': 'bg-red-100 text-red-800',
      'Liminal': 'bg-pink-100 text-pink-800',
      'Event': 'bg-yellow-100 text-yellow-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  // Couleurs pour la rareté
  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      'Event': 'text-red-600',
      'Liminal': 'text-purple-600',
      'Censure': 'text-orange-600',
      'Volatility': 'text-blue-600',
      'Localization': 'text-green-600',
      'Proportion': 'text-indigo-600',
      'Transformation': 'text-pink-600',
    };
    return colors[rarity] || 'text-gray-600';
  };

  const getRarityIcon = (rarity: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Event': <AlertCircle className="w-4 h-4" />,
      'Liminal': <Sparkles className="w-4 h-4" />,
      'Censure': <AlertCircle className="w-4 h-4" />,
      'Volatility': <Beaker className="w-4 h-4" />,
      'Localization': <Globe className="w-4 h-4" />,
      'Proportion': <Beaker className="w-4 h-4" />,
      'Transformation': <Leaf className="w-4 h-4" />,
    };
    return icons[rarity] || <Sparkles className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'Recherche', href: '/recherche' },
            { label: 'Matières Premières Rares', href: '/aromatic-rarities' },
          ]}
        />

        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Matières Premières Aromatiques Rares</h1>
          <p className="text-lg text-muted-foreground">
            Catalogue des 39 matières premières les plus rares et remarquables du monde olfactif
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats.total}</div>
                <p className="text-sm text-muted-foreground mt-2">Matières premières</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{categories.length}</div>
                <p className="text-sm text-muted-foreground mt-2">Catégories</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{stats.byGeography.length}</div>
                <p className="text-sm text-muted-foreground mt-2">Régions</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{rarities.length}</div>
                <p className="text-sm text-muted-foreground mt-2">Types de rareté</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphe D3.js des relations */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Graphe des relations</h2>
          <AromaticRaritiesGraph 
            materials={filteredMaterials.map(m => ({
              id: m.id,
              name: m.name,
              rarity: m.rarity_regime,
              category: m.category,
              relatedAccords: []
            }))}
            heritages={[
              { id: 'hibiscadelphus', name: 'Hibiscadelphus', type: 'accord', rarity: 'Critique' },
              { id: 'kyphi', name: 'Kyphi Royal', type: 'accord', rarity: 'Menace' },
              { id: 'silphium', name: 'Silphium', type: 'accord', rarity: 'Critique' },
              { id: 'cedrus', name: 'Cedrus Libani', type: 'accord', rarity: 'Vulnerable' }
            ]}
          />
        </div>

        {/* Recherche et filtres */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, molécules ou notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              size="sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              Toutes les catégories
            </Button>
            
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat)}
                size="sm"
                className={selectedCategory === cat ? '' : 'bg-white'}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedRarity === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedRarity('all')}
              size="sm"
            >
              Tous les types de rareté
            </Button>
            
            {rarities.map(rar => (
              <Button
                key={rar}
                variant={selectedRarity === rar ? 'default' : 'outline'}
                onClick={() => setSelectedRarity(rar)}
                size="sm"
                className={selectedRarity === rar ? '' : 'bg-white'}
              >
                {rar}
              </Button>
            ))}
          </div>
        </div>

        {/* Résultats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {filteredMaterials.length} résultat{filteredMaterials.length !== 1 ? 's' : ''}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaterials.map((material) => (
              <a key={material.id} href={`/aromatic-rarities/${material.id}`} className="block">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{material.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">{material.id}</p>
                    </div>
                    <div className={`flex items-center gap-1 ${getRarityColor(material.rarity_regime)}`}>
                      {getRarityIcon(material.rarity_regime)}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Catégorie */}
                  <div>
                    <Badge className={getCategoryColor(material.category)}>
                      {material.category}
                    </Badge>
                  </div>

                  {/* Géographie */}
                  {material.geography && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {material.geography}
                      </span>
                    </div>
                  )}

                  {/* Statut culturel */}
                  {material.cultural_status && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Statut culturel</p>
                      <p className="text-sm">{material.cultural_status}</p>
                    </div>
                  )}

                  {/* Molécules clés */}
                  {material.key_molecules && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Molécules clés</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {material.key_molecules.split(';').map((mol, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {mol.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {material.notes && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Notes</p>
                      <p className="text-sm text-muted-foreground">{material.notes}</p>
                    </div>
                  )}

                  {/* Type de source */}
                  {material.source_type && (
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Leaf className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {material.source_type}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
              </a>
            ))}
          </div>

          {filteredMaterials.length === 0 && (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-semibold mb-2">Aucun résultat</p>
                <p className="text-muted-foreground">
                  Essayez de modifier vos critères de recherche
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Onglets d'informations */}
        <Tabs defaultValue="categories" className="mt-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="categories">Catégories</TabsTrigger>
            <TabsTrigger value="rarity">Types de rareté</TabsTrigger>
            <TabsTrigger value="geography">Géographies</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribution par catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.byCategory.map(cat => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <span className="font-medium">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(cat.count / stats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-8 text-right">
                          {cat.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rarity" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribution par type de rareté</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.byRarity.map(rar => (
                    <div key={rar.name} className="flex items-center justify-between">
                      <span className="font-medium">{rar.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(rar.count / stats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-8 text-right">
                          {rar.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geography" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Top 10 géographies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {stats.byGeography.map(geo => (
                    <Badge key={geo} variant="secondary" className="justify-center">
                      {geo}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
