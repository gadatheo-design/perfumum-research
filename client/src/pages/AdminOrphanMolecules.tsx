import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertCircle, 
  CheckCircle2, 
  Filter, 
  FlaskConical, 
  Loader2, 
  RefreshCw, 
  Search,
  Sparkles,
  TrendingUp,
  Beaker,
  FileQuestion,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

type OrphanFilter = 'all' | 'no_family' | 'no_chemical_class' | 'no_cas' | 'no_iupac' | 'no_formula' | 'no_olfactive_profile' | 'no_radar';

const FILTER_OPTIONS: { value: OrphanFilter; label: string; description: string }[] = [
  { value: 'all', label: 'Toutes orphelines', description: 'Sans famille, classe chimique et profil olfactif' },
  { value: 'no_family', label: 'Sans famille', description: 'Molécules sans famille olfactive assignée' },
  { value: 'no_chemical_class', label: 'Sans classe chimique', description: 'Molécules sans classification chimique' },
  { value: 'no_cas', label: 'Sans numéro CAS', description: 'Molécules sans identifiant CAS' },
  { value: 'no_iupac', label: 'Sans nom IUPAC', description: 'Molécules sans nomenclature IUPAC' },
  { value: 'no_formula', label: 'Sans formule', description: 'Molécules sans formule chimique' },
  { value: 'no_olfactive_profile', label: 'Sans profil olfactif', description: 'Molécules sans description olfactive' },
  { value: 'no_radar', label: 'Sans radar', description: 'Molécules avec radar par défaut (50/50/50...)' },
];

const CHEMICAL_CLASSES = [
  'terpene', 'sesquiterpene', 'diterpene', 'monoterpene', 'aldehyde', 'ketone',
  'alcohol', 'ester', 'ether', 'phenol', 'lactone', 'coumarin', 'musk',
  'nitrile', 'sulfur_compound', 'heterocyclic', 'aromatic', 'aliphatic', 'other'
];

const FAMILY_SUGGESTIONS = [
  'Agrumes', 'Floral', 'Boisé', 'Oriental', 'Fougère', 'Chypre', 'Aromatique',
  'Musqué', 'Ambré', 'Cuir', 'Gourmand', 'Aquatique', 'Vert', 'Fruité',
  'Épicé', 'Balsamique', 'Résineux', 'Terreux', 'Fumé', 'Animal'
];

export default function AdminOrphanMolecules() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<OrphanFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [selectedMolecules, setSelectedMolecules] = useState<Set<number>>(new Set());
  const [classificationDialogOpen, setClassificationDialogOpen] = useState(false);
  const [batchFamily, setBatchFamily] = useState('');
  const [batchChemicalClass, setBatchChemicalClass] = useState('');
  const [batchOlfactiveProfile, setBatchOlfactiveProfile] = useState('');
  
  const pageSize = 50;

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = trpc.orphanMolecules.getStats.useQuery();
  const { data: moleculesData, isLoading: moleculesLoading, refetch: refetchMolecules } = trpc.orphanMolecules.list.useQuery({
    filter,
    limit: pageSize,
    offset: page * pageSize,
  });

  const batchClassifyMutation = trpc.orphanMolecules.batchClassify.useMutation({
    onSuccess: (result) => {
      toast({
        title: "Classification réussie",
        description: `${result.updated} molécule(s) mise(s) à jour`,
      });
      setSelectedMolecules(new Set());
      setClassificationDialogOpen(false);
      setBatchFamily('');
      setBatchChemicalClass('');
      setBatchOlfactiveProfile('');
      refetchStats();
      refetchMolecules();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredMolecules = moleculesData?.molecules.filter(m => 
    searchQuery === '' || 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.casNumber && m.casNumber.includes(searchQuery))
  ) || [];

  const handleSelectAll = () => {
    if (selectedMolecules.size === filteredMolecules.length) {
      setSelectedMolecules(new Set());
    } else {
      setSelectedMolecules(new Set(filteredMolecules.map(m => m.id)));
    }
  };

  const handleToggleMolecule = (id: number) => {
    const newSet = new Set(selectedMolecules);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedMolecules(newSet);
  };

  const handleBatchClassify = () => {
    if (selectedMolecules.size === 0) return;

    const updates = Array.from(selectedMolecules).map(moleculeId => ({
      moleculeId,
      family: batchFamily || undefined,
      chemicalClass: batchChemicalClass || undefined,
      olfactiveProfile: batchOlfactiveProfile || undefined,
    }));

    batchClassifyMutation.mutate(updates);
  };

  const totalPages = Math.ceil((moleculesData?.total || 0) / pageSize);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <FileQuestion className="h-8 w-8 text-amber-500" />
              Molécules Orphelines
            </h1>
            <p className="text-muted-foreground mt-1">
              Classifiez les molécules sans classification pour améliorer la couverture de la base de données
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => { refetchStats(); refetchMolecules(); }}
            disabled={statsLoading || moleculesLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${(statsLoading || moleculesLoading) ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux de Classification</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.classificationRate}%</div>
                <Progress value={stats?.classificationRate} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Moyenne des champs remplis
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Molécules Orphelines</CardTitle>
                <AlertCircle className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">{stats?.orphanCount}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Sur {stats?.totalMolecules} molécules totales
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avec Famille</CardTitle>
                <FlaskConical className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.withFamily}</div>
                <Progress value={(stats?.withFamily / stats?.totalMolecules) * 100} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {Math.round((stats?.withFamily / stats?.totalMolecules) * 100)}% de couverture
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avec Classe Chimique</CardTitle>
                <Beaker className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.withChemicalClass}</div>
                <Progress value={(stats?.withChemicalClass / stats?.totalMolecules) * 100} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {Math.round((stats?.withChemicalClass / stats?.totalMolecules) * 100)}% de couverture
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detailed Stats */}
        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>Détail de la Couverture</CardTitle>
              <CardDescription>État de chaque champ de classification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                {[
                  { label: 'Numéro CAS', value: stats?.withCasNumber, color: 'bg-blue-500' },
                  { label: 'Nom IUPAC', value: stats?.withIupacName, color: 'bg-purple-500' },
                  { label: 'Formule', value: stats?.withFormula, color: 'bg-green-500' },
                  { label: 'Profil Olfactif', value: stats?.withOlfactiveProfile, color: 'bg-amber-500' },
                  { label: 'Radar Complet', value: stats?.withRadarComplete, color: 'bg-pink-500' },
                  { label: 'Famille', value: stats?.withFamily, color: 'bg-cyan-500' },
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium">{Math.round((item.value / stats?.totalMolecules) * 100)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className={`h-full ${item.color} transition-all duration-500`}
                        style={{ width: `${(item.value / stats?.totalMolecules) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{item.value} / {stats?.totalMolecules}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Liste des Molécules</CardTitle>
                <CardDescription>
                  {moleculesData?.total || 0} molécule(s) correspondant aux critères
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={filter} onValueChange={(v) => { setFilter(v as OrphanFilter); setPage(0); }}>
                  <SelectTrigger className="w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrer par..." />
                  </SelectTrigger>
                  <SelectContent>
                    {FILTER_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex flex-col">
                          <span>{opt.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 w-[200px]"
                  />
                </div>

                {selectedMolecules.size > 0 && (
                  <Dialog open={classificationDialogOpen} onOpenChange={setClassificationDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Classifier ({selectedMolecules.size})
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Classification en Masse</DialogTitle>
                        <DialogDescription>
                          Appliquer une classification à {selectedMolecules.size} molécule(s) sélectionnée(s)
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label>Famille Olfactive</Label>
                          <Select value={batchFamily} onValueChange={setBatchFamily}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une famille..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Aucune modification</SelectItem>
                              {FAMILY_SUGGESTIONS.map((f) => (
                                <SelectItem key={f} value={f}>{f}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Classe Chimique</Label>
                          <Select value={batchChemicalClass} onValueChange={setBatchChemicalClass}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une classe..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Aucune modification</SelectItem>
                              {CHEMICAL_CLASSES.map((c) => (
                                <SelectItem key={c} value={c}>
                                  {c.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Profil Olfactif</Label>
                          <Textarea
                            placeholder="Description du profil olfactif..."
                            value={batchOlfactiveProfile}
                            onChange={(e) => setBatchOlfactiveProfile(e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setClassificationDialogOpen(false)}>
                          Annuler
                        </Button>
                        <Button 
                          onClick={handleBatchClassify}
                          disabled={batchClassifyMutation.isPending || (!batchFamily && !batchChemicalClass && !batchOlfactiveProfile)}
                        >
                          {batchClassifyMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                          Appliquer
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {moleculesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredMolecules.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium">Aucune molécule orpheline</h3>
                <p className="text-muted-foreground">
                  Toutes les molécules sont classifiées selon ce critère
                </p>
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/50 px-4 py-3 border-b flex items-center gap-4">
                    <Checkbox
                      checked={selectedMolecules.size === filteredMolecules.length && filteredMolecules.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm font-medium flex-1">Nom</span>
                    <span className="text-sm font-medium w-32 hidden md:block">Famille</span>
                    <span className="text-sm font-medium w-32 hidden lg:block">Classe</span>
                    <span className="text-sm font-medium w-24 hidden lg:block">CAS</span>
                    <span className="text-sm font-medium w-20">Statut</span>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y">
                    {filteredMolecules.map((molecule) => (
                      <div 
                        key={molecule.id} 
                        className={`px-4 py-3 flex items-center gap-4 hover:bg-muted/30 transition-colors ${
                          selectedMolecules.has(molecule.id) ? 'bg-primary/5' : ''
                        }`}
                      >
                        <Checkbox
                          checked={selectedMolecules.has(molecule.id)}
                          onCheckedChange={() => handleToggleMolecule(molecule.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{molecule.name}</p>
                          {molecule.iupacName && (
                            <p className="text-xs text-muted-foreground truncate">{molecule.iupacName}</p>
                          )}
                        </div>
                        <div className="w-32 hidden md:block">
                          {molecule.family ? (
                            <Badge variant="secondary" className="truncate max-w-full">
                              {molecule.family}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </div>
                        <div className="w-32 hidden lg:block">
                          {molecule.chemicalClass ? (
                            <Badge variant="outline" className="truncate max-w-full">
                              {molecule.chemicalClass.replace(/_/g, ' ')}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </div>
                        <div className="w-24 hidden lg:block">
                          {molecule.casNumber ? (
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{molecule.casNumber}</code>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </div>
                        <div className="w-20">
                          {molecule.olfactiveProfile ? (
                            <Badge variant="default" className="bg-green-500">OK</Badge>
                          ) : (
                            <Badge variant="destructive">Incomplet</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Page {page + 1} sur {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Précédent
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                      >
                        Suivant
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
