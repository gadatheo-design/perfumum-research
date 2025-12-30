import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Edit, BookOpen, Database, GraduationCap, Link as LinkIcon } from "lucide-react";

type ReferenceType = 'pubchem' | 'academic' | 'book' | 'database';

interface Reference {
  type: ReferenceType;
  title: string;
  url?: string;
  authors?: string;
  journal?: string;
  year?: number;
  doi?: string;
  publisher?: string;
  pages?: string;
}

export default function AdminReferences() {
  const { toast } = useToast();
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<ReferenceType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRef, setEditingRef] = useState<{ moleculeId: number; refIndex: number; ref: Reference } | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form state
  const [newRef, setNewRef] = useState<Reference>({
    type: 'academic',
    title: '',
    url: '',
    authors: '',
    journal: '',
    year: new Date().getFullYear(),
    doi: '',
    publisher: '',
    pages: ''
  });

  const { data: molecules, isLoading } = trpc.molecules.list.useQuery();
  const updateMolecule = trpc.molecules.updateReferences.useMutation({
    onSuccess: () => {
      toast({ title: "✅ Références mises à jour", variant: "default" });
      utils.molecules.list.invalidate();
      setEditingRef(null);
      setShowAddForm(false);
      resetForm();
    },
    onError: (error) => {
      toast({ title: "❌ Erreur", description: error.message, variant: "destructive" });
    }
  });

  const utils = trpc.useUtils();

  const resetForm = () => {
    setNewRef({
      type: 'academic',
      title: '',
      url: '',
      authors: '',
      journal: '',
      year: new Date().getFullYear(),
      doi: '',
      publisher: '',
      pages: ''
    });
  };

  const handleAddReference = async () => {
    if (!selectedMoleculeId) {
      toast({ title: "⚠️ Sélectionnez une molécule", variant: "destructive" });
      return;
    }

    const molecule = molecules?.find(m => m.id === selectedMoleculeId);
    if (!molecule) return;

    const existingRefs = molecule.references ? 
      (typeof molecule.references === 'string' ? JSON.parse(molecule.references) : molecule.references) : [];
    
    const updatedRefs = [...existingRefs, newRef];

    await updateMolecule.mutateAsync({
      id: selectedMoleculeId,
      references: JSON.stringify(updatedRefs)
    });
  };

  const handleDeleteReference = async (moleculeId: number, refIndex: number) => {
    const molecule = molecules?.find(m => m.id === moleculeId);
    if (!molecule) return;

    const existingRefs = molecule.references ? 
      (typeof molecule.references === 'string' ? JSON.parse(molecule.references) : molecule.references) : [];
    
    const updatedRefs = existingRefs.filter((_: any, i: number) => i !== refIndex);

    await updateMolecule.mutateAsync({
      id: moleculeId,
      references: JSON.stringify(updatedRefs)
    });
  };

  const handleUpdateReference = async () => {
    if (!editingRef) return;

    const molecule = molecules?.find(m => m.id === editingRef.moleculeId);
    if (!molecule) return;

    const existingRefs = molecule.references ? 
      (typeof molecule.references === 'string' ? JSON.parse(molecule.references) : molecule.references) : [];
    
    existingRefs[editingRef.refIndex] = editingRef.ref;

    await updateMolecule.mutateAsync({
      id: editingRef.moleculeId,
      references: JSON.stringify(existingRefs)
    });
  };

  const filteredMolecules = molecules?.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterType === 'all') return true;

    const refs = m.references ? 
      (typeof m.references === 'string' ? JSON.parse(m.references) : m.references) : [];
    
    return refs.some((r: Reference) => r.type === filterType);
  });

  const getTypeIcon = (type: ReferenceType) => {
    switch (type) {
      case 'pubchem': return <Database className="h-4 w-4" />;
      case 'academic': return <GraduationCap className="h-4 w-4" />;
      case 'book': return <BookOpen className="h-4 w-4" />;
      case 'database': return <LinkIcon className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: ReferenceType) => {
    switch (type) {
      case 'pubchem': return 'PubChem';
      case 'academic': return 'Académique';
      case 'book': return 'Livre';
      case 'database': return 'Base de données';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Gestion des Références</h1>
        <p className="text-muted-foreground">
          Gérez les références bibliographiques pour chaque molécule (PubChem, articles académiques, livres, bases de données)
        </p>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Rechercher une molécule</Label>
              <Input
                placeholder="Nom de la molécule..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Label>Type de référence</Label>
              <Select value={filterType} onValueChange={(v) => setFilterType(v as ReferenceType | 'all')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="pubchem">PubChem</SelectItem>
                  <SelectItem value="academic">Académique</SelectItem>
                  <SelectItem value="book">Livre</SelectItem>
                  <SelectItem value="database">Base de données</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Ajouter une référence</CardTitle>
            <CardDescription>
              Sélectionnez une molécule et remplissez les champs selon le type de référence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Molécule *</Label>
              <Select 
                value={selectedMoleculeId?.toString() || ''} 
                onValueChange={(v) => setSelectedMoleculeId(parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une molécule" />
                </SelectTrigger>
                <SelectContent>
                  {molecules?.map(m => (
                    <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Type de référence *</Label>
              <Select value={newRef.type} onValueChange={(v) => setNewRef({ ...newRef, type: v as ReferenceType })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pubchem">PubChem</SelectItem>
                  <SelectItem value="academic">Académique</SelectItem>
                  <SelectItem value="book">Livre</SelectItem>
                  <SelectItem value="database">Base de données</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Titre *</Label>
              <Input
                value={newRef.title}
                onChange={(e) => setNewRef({ ...newRef, title: e.target.value })}
                placeholder="Titre de la référence"
              />
            </div>

            {(newRef.type === 'pubchem' || newRef.type === 'database') && (
              <div>
                <Label>URL *</Label>
                <Input
                  value={newRef.url}
                  onChange={(e) => setNewRef({ ...newRef, url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            )}

            {newRef.type === 'academic' && (
              <>
                <div>
                  <Label>Auteurs</Label>
                  <Input
                    value={newRef.authors}
                    onChange={(e) => setNewRef({ ...newRef, authors: e.target.value })}
                    placeholder="Nom A., Nom B."
                  />
                </div>
                <div>
                  <Label>Journal</Label>
                  <Input
                    value={newRef.journal}
                    onChange={(e) => setNewRef({ ...newRef, journal: e.target.value })}
                    placeholder="Nom du journal"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Année</Label>
                    <Input
                      type="number"
                      value={newRef.year}
                      onChange={(e) => setNewRef({ ...newRef, year: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>DOI</Label>
                    <Input
                      value={newRef.doi}
                      onChange={(e) => setNewRef({ ...newRef, doi: e.target.value })}
                      placeholder="10.xxxx/xxxxx"
                    />
                  </div>
                </div>
              </>
            )}

            {newRef.type === 'book' && (
              <>
                <div>
                  <Label>Auteurs</Label>
                  <Input
                    value={newRef.authors}
                    onChange={(e) => setNewRef({ ...newRef, authors: e.target.value })}
                    placeholder="Nom de l'auteur"
                  />
                </div>
                <div>
                  <Label>Éditeur</Label>
                  <Input
                    value={newRef.publisher}
                    onChange={(e) => setNewRef({ ...newRef, publisher: e.target.value })}
                    placeholder="Nom de l'éditeur"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Année</Label>
                    <Input
                      type="number"
                      value={newRef.year}
                      onChange={(e) => setNewRef({ ...newRef, year: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Pages</Label>
                    <Input
                      value={newRef.pages}
                      onChange={(e) => setNewRef({ ...newRef, pages: e.target.value })}
                      placeholder="123-145"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-2">
              <Button onClick={handleAddReference} disabled={updateMolecule.isPending}>
                {updateMolecule.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                Ajouter
              </Button>
              <Button variant="outline" onClick={() => { setShowAddForm(false); resetForm(); }}>
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!showAddForm && (
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une référence
        </Button>
      )}

      {/* Liste des molécules avec références */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">
          {filteredMolecules?.length || 0} molécule(s) trouvée(s)
        </h2>

        {filteredMolecules?.map(molecule => {
          const refs = molecule.references ? 
            (typeof molecule.references === 'string' ? JSON.parse(molecule.references) : molecule.references) : [];
          
          if (refs.length === 0) return null;

          return (
            <Card key={molecule.id}>
              <CardHeader>
                <CardTitle>{molecule.name}</CardTitle>
                <CardDescription>{refs.length} référence(s)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {refs.map((ref: Reference, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="mt-1">{getTypeIcon(ref.type)}</div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded">
                            {getTypeLabel(ref.type)}
                          </span>
                          {ref.year && <span className="text-xs text-muted-foreground">({ref.year})</span>}
                        </div>
                        <p className="font-medium">{ref.title}</p>
                        {ref.authors && <p className="text-sm text-muted-foreground">{ref.authors}</p>}
                        {ref.journal && <p className="text-sm text-muted-foreground italic">{ref.journal}</p>}
                        {ref.publisher && <p className="text-sm text-muted-foreground">{ref.publisher}</p>}
                        {ref.pages && <p className="text-sm text-muted-foreground">Pages: {ref.pages}</p>}
                        {ref.doi && (
                          <a 
                            href={`https://doi.org/${ref.doi}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            DOI: {ref.doi}
                          </a>
                        )}
                        {ref.url && (
                          <a 
                            href={ref.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            <LinkIcon className="h-3 w-3" />
                            Lien
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingRef({ moleculeId: molecule.id, refIndex: idx, ref })}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteReference(molecule.id, idx)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
