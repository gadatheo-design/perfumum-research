// @ts-nocheck
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Package, Search, Filter, Leaf, Droplets, FlaskConical, MapPin, Building2, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';
import { Breadcrumbs } from '@/components/Breadcrumbs';

// Icône par catégorie
const categoryIcons: Record<string, React.ReactNode> = {
  huile_essentielle: <Droplets className="h-4 w-4" />,
  absolue: <FlaskConical className="h-4 w-4" />,
  concrete: <FlaskConical className="h-4 w-4" />,
  resine: <Leaf className="h-4 w-4" />,
  attar: <Droplets className="h-4 w-4" />,
  teinture: <FlaskConical className="h-4 w-4" />,
  dilution: <Droplets className="h-4 w-4" />,
  matiere_brute: <Leaf className="h-4 w-4" />,
};

// Couleur par catégorie
const categoryColors: Record<string, string> = {
  huile_essentielle: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  absolue: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  concrete: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  resine: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  attar: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  teinture: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  dilution: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  matiere_brute: 'bg-stone-500/20 text-stone-400 border-stone-500/30',
};

// Formater le nom de la catégorie
function formatCategory(category: string): string {
  const names: Record<string, string> = {
    huile_essentielle: 'Huile essentielle',
    absolue: 'Absolue',
    concrete: 'Concrète',
    resine: 'Résine',
    attar: 'Attar',
    teinture: 'Teinture',
    dilution: 'Dilution',
    matiere_brute: 'Matière brute',
    resinoid: 'Résinoïde',
    co2_extract: 'Extrait CO2',
    infusion: 'Infusion',
    baume: 'Baume',
    cire: 'Cire',
    hydrolat: 'Hydrolat',
    autre: 'Autre',
  };
  return names[category] || category;
}

export default function RawMaterialsInventory() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Récupérer les matières premières
  const { data: materials, isLoading } = trpc.rawMaterials.getAll.useQuery({
    search: search || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    limit: 100,
  });
  
  // Récupérer les statistiques
  const { data: stats } = trpc.rawMaterials.getStats.useQuery();
  
  // Récupérer les catégories
  const { data: categories } = trpc.rawMaterials.getCategories.useQuery();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/20 via-teal-900/20 to-cyan-900/20 border-b">
        <div className="container py-8">
          <Breadcrumbs />
          <div className="flex items-center gap-3 mt-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
              <Package className="h-8 w-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Inventaire des matières premières</h1>
              <p className="text-muted-foreground">
                Collection de matières premières aromatiques pour la recherche PERFUMUM
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container py-8 space-y-8">
        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-emerald-500">{stats?.total}</div>
                <div className="text-sm text-muted-foreground">Matières premières</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-500">
                  {stats?.byCategory?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Catégories</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-amber-500">
                  {stats?.byOrigin?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Origines</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-cyan-500">
                  {stats?.byCategory?.find((c: any) => c.category === 'huile_essentielle')?.count || 0}
                </div>
                <div className="text-sm text-muted-foreground">Huiles essentielles</div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Filtres */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une matière première..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories?.map((cat) => (
                    <SelectItem key={cat} value={cat || ''}>
                      {formatCategory(cat || '')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        {/* Liste des matières premières */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : materials && materials?.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {materials?.map((material: any) => (
              <Card key={material.id} className="hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight">
                        {material.name}
                      </CardTitle>
                      {material.latinName && (
                        <p className="text-sm text-muted-foreground italic mt-1">
                          {material.latinName}
                        </p>
                      )}
                    </div>
                    <Badge 
                      variant="outline" 
                      className={categoryColors[material.category] || 'bg-muted'}
                    >
                      {categoryIcons[material.category]}
                      <span className="ml-1">{formatCategory(material.category)}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {material.origin && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{material.origin}</span>
                    </div>
                  )}
                  
                  {material.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {material.description}
                    </p>
                  )}
                  
                  {material.olfactiveProfile && (
                    <div className="flex flex-wrap gap-1">
                      {material.olfactiveProfile.topNotes?.slice(0, 3).map((note: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {note}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {material.suppliers && material.suppliers.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{material.suppliers[0].name}</span>
                    </div>
                  )}
                  
                  <div className="pt-2 flex justify-end">
                    <Link href={`/raw-materials/${material.id}`}>
                      <Button variant="ghost" size="sm">
                        Voir détails
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">Aucune matière première trouvée</h3>
              <p className="text-muted-foreground">
                {search || selectedCategory !== 'all' 
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Commencez par ajouter des matières premières à votre inventaire'}
              </p>
            </CardContent>
          </Card>
        )}
        
        {/* Liens connexes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Outils connexes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Link href="/fournisseurs">
                <Button variant="outline" size="sm">
                  <Building2 className="h-4 w-4 mr-2" />
                  Fournisseurs
                </Button>
              </Link>
              <Link href="/molecules">
                <Button variant="outline" size="sm">
                  <FlaskConical className="h-4 w-4 mr-2" />
                  Molécules
                </Button>
              </Link>
              <Link href="/ms-spectra">
                <Button variant="outline" size="sm">
                  <Droplets className="h-4 w-4 mr-2" />
                  Spectres MS
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
