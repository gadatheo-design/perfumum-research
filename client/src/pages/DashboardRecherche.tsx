import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Beaker, FlaskConical, TrendingUp, Star, Plus, X, Edit2, Save } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { GammeBadge } from "@/components/GammeBadge";
import { getGammeFromCategory } from "@/lib/gammeMapping";

export default function DashboardRecherche() {
  const { data: recettes } = trpc.recettes.list.useQuery();
  const { data: molecules } = trpc.molecules.list.useQuery();
  const { data: synergies } = trpc.synergies.list.useQuery();
  const { data: prototypes } = trpc.prototypes.list.useQuery();

  // Notes system (local state for now - could be moved to database)
  const [notes, setNotes] = useState<Array<{ id: number; title: string; content: string; date: string }>>([
    {
      id: 1,
      title: "Exploration Gamme Glaciaire",
      content: "Tester combinaison menthe poivrée + eucalyptus + juniper pour accord Ozone Pur. Dosage à affiner.",
      date: "2025-12-04"
    },
    {
      id: 2,
      title: "Synergie Burley × Ambroxan",
      content: "Potentialisation confirmée. Amplification notes fumées + fixation. À documenter dans matrice.",
      date: "2025-12-03"
    }
  ]);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Favorites system (real data)
  const { data: userFavorites } = trpc.favorites.list.useQuery();

  const addNote = () => {
    if (newNoteTitle.trim() && newNoteContent.trim()) {
      setNotes([
        {
          id: Date.now(),
          title: newNoteTitle,
          content: newNoteContent,
          date: new Date().toISOString().split('T')[0]
        },
        ...notes
      ]);
      setNewNoteTitle("");
      setNewNoteContent("");
    }
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const startEdit = (note: typeof notes[0]) => {
    setEditingNote(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const saveEdit = () => {
    if (editingNote) {
      setNotes(notes.map(n => 
        n.id === editingNote 
          ? { ...n, title: editTitle, content: editContent }
          : n
      ));
      setEditingNote(null);
    }
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setEditTitle("");
    setEditContent("");
  };

  // Recent data
  const recentRecettes = recettes?.slice(0, 5) || [];
  const recentSynergies = synergies?.slice(0, 5) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 section-spacing">
        <div className="container">
          <Breadcrumbs />
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Tableau de Bord Recherche</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Vue d'ensemble personnalisée de votre recherche PERFUMUM : dernières recettes, molécules favorites, 
              synergies récentes et notes de laboratoire. Suivi longitudinal 2025-2035.
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="brutal-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold">{recettes?.length || 0}</CardTitle>
                <CardDescription>Recettes totales</CardDescription>
              </CardHeader>
            </Card>
            <Card className="brutal-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold">{molecules?.length || 0}</CardTitle>
                <CardDescription>Molécules documentées</CardDescription>
              </CardHeader>
            </Card>
            <Card className="brutal-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold">{synergies?.length || 0}</CardTitle>
                <CardDescription>Synergies identifiées</CardDescription>
              </CardHeader>
            </Card>
            <Card className="brutal-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold">{prototypes?.length || 0}</CardTitle>
                <CardDescription>Prototypes développés</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Recipes */}
            <Card className="brutal-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-5 w-5" />
                    <CardTitle>Dernières Recettes</CardTitle>
                  </div>
                  <Link href="/recettes">
                    <Button variant="ghost" size="sm">Voir tout →</Button>
                  </Link>
                </div>
                <CardDescription>5 recettes les plus récentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentRecettes.map((recette) => (
                    <Link key={recette.id} href={`/recette/${recette.id}`}>
                      <div className="p-3 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-medium">{recette.name}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {recette.category}
                            </p>
                          </div>
                          {recette.category && getGammeFromCategory(recette.category) && (
                            <GammeBadge 
                              gamme={getGammeFromCategory(recette.category)!} 
                              size="sm" 
                              showIcon={false}
                            />
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Favorite Molecules */}
            <Card className="brutal-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    <CardTitle>Molécules Favorites</CardTitle>
                  </div>
                  <Link href="/molecules">
                    <Button variant="ghost" size="sm">Gérer →</Button>
                  </Link>
                </div>
                <CardDescription>Molécules clés de votre recherche</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {!userFavorites || userFavorites.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Star className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">Aucune molécule favorite</p>
                      <p className="text-xs mt-1">Ajoutez des favoris depuis les pages molécules</p>
                    </div>
                  ) : (
                    userFavorites.slice(0, 5).map((favorite) => {
                      const molecule = favorite.molecule;
                      if (!molecule) return null;
                      return (
                        <Link key={favorite.id} href={`/molecule/${molecule.id}`}>
                          <div className="p-3 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="font-medium">{molecule.name}</p>
                                <p className="text-sm text-muted-foreground">{molecule.family}</p>
                              </div>
                              <Badge variant="outline" className="shrink-0">
                                {synergies?.filter(s => s.moleculeId === molecule.id).length || 0} synergies
                              </Badge>
                            </div>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Synergies */}
            <Card className="brutal-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    <CardTitle>Synergies Récentes</CardTitle>
                  </div>
                  <Link href="/laboratoire/matrice-interactive">
                    <Button variant="ghost" size="sm">Matrice →</Button>
                  </Link>
                </div>
                <CardDescription>Dernières synergies documentées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSynergies.map((synergie) => {
                    const molecule = molecules?.find(m => m.id === synergie.moleculeId);
                    return (
                      <div key={synergie.id} className="p-3 rounded-lg border border-border">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="font-medium text-sm">
                            {synergie.tabacName} × {molecule?.name || 'Unknown'}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {synergie.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {synergie.effet}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Research Notes */}
            <Card className="brutal-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Beaker className="h-5 w-5" />
                  <CardTitle>Notes de Laboratoire</CardTitle>
                </div>
                <CardDescription>Annotations et observations</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Add Note Form */}
                <div className="mb-4 p-3 rounded-lg border border-dashed border-border">
                  <Input
                    placeholder="Titre de la note..."
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    className="mb-2"
                  />
                  <Textarea
                    placeholder="Contenu de la note..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    className="mb-2 min-h-[80px]"
                  />
                  <Button onClick={addNote} size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter Note
                  </Button>
                </div>

                {/* Notes List */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {notes.map((note) => (
                    <div key={note.id} className="p-3 rounded-lg border border-border">
                      {editingNote === note.id ? (
                        <div className="space-y-2">
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="font-medium"
                          />
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="text-sm min-h-[60px]"
                          />
                          <div className="flex gap-2">
                            <Button onClick={saveEdit} size="sm" variant="default">
                              <Save className="h-3 w-3 mr-1" />
                              Sauvegarder
                            </Button>
                            <Button onClick={cancelEdit} size="sm" variant="ghost">
                              Annuler
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="font-medium text-sm">{note.title}</p>
                            <div className="flex gap-1">
                              <Button
                                onClick={() => startEdit(note)}
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button
                                onClick={() => deleteNote(note.id)}
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{note.content}</p>
                          <p className="text-xs text-muted-foreground">{note.date}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Progress */}
          <Card className="brutal-border">
            <CardHeader>
              <CardTitle>Progression Projet PERFUMUM (2025-2035)</CardTitle>
              <CardDescription>
                Recherche longitudinale sur 10 ans : design terpénique, résines CBD et tabacs rares
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Année 1 / 10</span>
                    <span className="text-sm text-muted-foreground">10% complété</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold">5</p>
                    <p className="text-sm text-muted-foreground">Gammes explorées</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{prototypes?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Prototypes développés</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{synergies?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Synergies identifiées</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    <Footer />

    </div>
  );
}
