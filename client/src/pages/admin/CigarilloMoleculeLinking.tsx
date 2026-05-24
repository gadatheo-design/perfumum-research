// @ts-nocheck
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2, Link2, Cigarette, Atom } from "lucide-react";
import { Link } from "wouter";

export default function CigarilloMoleculeLinking() {
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [moleculeSearch, setMoleculeSearch] = useState("");
  const [recipeSearch, setRecipeSearch] = useState("");

  const { data: links, isLoading: linksLoading } = trpc.cigarilloMoleculeLinks.list.useQuery(
    selectedRecipeId ? { cigarilloRecipeId: selectedRecipeId } : undefined
  );
  const { data: stats } = trpc.cigarilloMoleculeLinks.stats?.useQuery();
  const { data: allMolecules } = trpc.molecules.list.useQuery();
  const { data: recipesData } = trpc.recipes.getAll.useQuery({ limit: 100, offset: 0 });

  const [formRecipeId, setFormRecipeId] = useState<string>("");
  const [formMoleculeId, setFormMoleculeId] = useState<string>("");
  const [formRole, setFormRole] = useState("");
  const [formPercentage, setFormPercentage] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const createLink = trpc.cigarilloMoleculeLinks.create.useMutation({
    onSuccess: () => {
      toast({ title: "Liaison créée", description: "La liaison cigarillo-molécule a été ajoutée." });
      utils.cigarilloMoleculeLinks.list.invalidate();
      utils.cigarilloMoleculeLinks.stats?.invalidate();
      setFormMoleculeId("");
      setFormRole("");
      setFormPercentage("");
      setFormNotes("");
    },
    onError: (err) => {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    },
  });

  const deleteLink = trpc.cigarilloMoleculeLinks.delete.useMutation({
    onSuccess: () => {
      toast({ title: "Liaison supprimée" });
      utils.cigarilloMoleculeLinks.list.invalidate();
      utils.cigarilloMoleculeLinks.stats?.invalidate();
    },
    onError: (err) => {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    },
  });

  const filteredMolecules = useMemo(() => {
    if (!allMolecules) return [];
    if (!moleculeSearch) return allMolecules?.slice(0, 50);
    return allMolecules
      .filter(m => m.name.toLowerCase().includes(moleculeSearch.toLowerCase()))
      .slice(0, 50);
  }, [allMolecules, moleculeSearch]);

  const filteredRecipes = useMemo(() => {
    if (!recipesData?.recipes) return [];
    if (!recipeSearch) return recipesData?.recipes;
    return recipesData?.recipes.filter((r: any) =>
      r.name?.toLowerCase().includes(recipeSearch.toLowerCase()) ||
      r.collection?.toLowerCase().includes(recipeSearch.toLowerCase())
    );
  }, [recipesData, recipeSearch]);

  const handleCreate = () => {
    if (!formRecipeId || !formMoleculeId) {
      toast({ title: "Champs requis", description: "Sélectionnez une recette et une molécule.", variant: "destructive" });
      return;
    }
    createLink.mutate({
      cigarilloRecipeId: parseInt(formRecipeId),
      moleculeId: parseInt(formMoleculeId),
      role: formRole || undefined,
      percentage: formPercentage ? parseFloat(formPercentage) : undefined,
      notes: formNotes || undefined,
    });
  };

  const selectedRecipe = recipesData?.recipes?.find((r: any) => r.id === selectedRecipeId);

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link2 className="h-7 w-7 text-amber-500" />
          <h1 className="text-3xl font-bold">Liaisons Cigarillos ↔ Molécules</h1>
        </div>
        <p className="text-muted-foreground">
          Associez les molécules aromatiques clés aux 32 recettes cigarillos pour documenter leur composition moléculaire.
        </p>
        <div className="flex items-center gap-2 mt-3 text-sm">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground">Admin</Link>
          <span className="text-muted-foreground">/</span>
          <span>Liaisons Cigarillos-Molécules</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-amber-500">{stats?.totalLinks ?? 0}</div>
          <div className="text-sm text-muted-foreground mt-1">Liaisons totales</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-500">{stats?.recipesWithLinks ?? 0}</div>
          <div className="text-sm text-muted-foreground mt-1">Recettes documentées</div>
          <div className="text-xs text-muted-foreground">/ {recipesData?.total ?? 32} recettes</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-500">{stats?.moleculesLinked ?? 0}</div>
          <div className="text-sm text-muted-foreground mt-1">Molécules liées</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recipe selector + Form */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Cigarette className="h-4 w-4 text-amber-500" />
              Sélectionner une recette
            </h2>
            <Input
              placeholder="Rechercher une recette..."
              value={recipeSearch}
              onChange={e => setRecipeSearch(e.target.value)}
              className="mb-3"
            />
            <div className="space-y-1 max-h-64 overflow-y-auto">
              <button
                onClick={() => setSelectedRecipeId(null)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  selectedRecipeId === null ? "bg-amber-500/20 text-amber-600 font-medium" : "hover:bg-muted"
                }`}
              >
                Toutes les recettes
              </button>
              {filteredRecipes.map((recipe: any) => (
                <button
                  key={recipe.id}
                  onClick={() => setSelectedRecipeId(recipe.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    selectedRecipeId === recipe.id ? "bg-amber-500/20 text-amber-600 font-medium" : "hover:bg-muted"
                  }`}
                >
                  <div className="font-medium truncate">{recipe.name}</div>
                  {recipe.collection && (
                    <div className="text-xs text-muted-foreground">{recipe.collection}</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Plus className="h-4 w-4 text-green-500" />
              Ajouter une liaison
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Recette cigarillo *</label>
                <Select value={formRecipeId} onValueChange={setFormRecipeId}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Choisir une recette..." />
                  </SelectTrigger>
                  <SelectContent>
                    {recipesData?.recipes?.map((r: any) => (
                      <SelectItem key={r.id} value={String(r.id)}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Molécule *</label>
                <Input
                  placeholder="Rechercher une molécule..."
                  value={moleculeSearch}
                  onChange={e => setMoleculeSearch(e.target.value)}
                  className="mb-1 text-sm"
                />
                <Select value={formMoleculeId} onValueChange={setFormMoleculeId}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Choisir une molécule..." />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredMolecules.map((m: any) => (
                      <SelectItem key={m.id} value={String(m.id)}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Rôle</label>
                <Select value={formRole} onValueChange={setFormRole}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Rôle olfactif..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="note_tete">Note de tête</SelectItem>
                    <SelectItem value="note_coeur">Note de cœur</SelectItem>
                    <SelectItem value="note_fond">Note de fond</SelectItem>
                    <SelectItem value="fixateur">Fixateur</SelectItem>
                    <SelectItem value="modificateur">Modificateur</SelectItem>
                    <SelectItem value="signature">Molécule signature</SelectItem>
                    <SelectItem value="tabac">Composant tabac</SelectItem>
                    <SelectItem value="aromatique">Aromatique</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Pourcentage (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="ex: 0.5"
                  value={formPercentage}
                  onChange={e => setFormPercentage(e.target.value)}
                  className="text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Notes</label>
                <Input
                  placeholder="Notes optionnelles..."
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  className="text-sm"
                />
              </div>

              <Button
                onClick={handleCreate}
                disabled={createLink.isPending || !formRecipeId || !formMoleculeId}
                className="w-full"
                size="sm"
              >
                {createLink.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Ajouter la liaison
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Links table */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-lg">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold flex items-center gap-2">
                <Atom className="h-4 w-4 text-purple-500" />
                {selectedRecipe ? (
                  <>Molécules de : <span className="text-amber-500">{selectedRecipe.name}</span></>
                ) : (
                  <>Toutes les liaisons ({(links as any[])?.length ?? 0})</>
                )}
              </h2>
            </div>

            {linksLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : !links || (links as any[]).length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Link2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Aucune liaison documentée</p>
                <p className="text-sm mt-1">
                  {selectedRecipe
                    ? "Ajoutez des molécules à cette recette via le formulaire."
                    : "Sélectionnez une recette et ajoutez des molécules."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {!selectedRecipeId && (
                        <th className="text-left p-3 font-medium text-muted-foreground">Recette</th>
                      )}
                      <th className="text-left p-3 font-medium text-muted-foreground">Molécule</th>
                      <th className="text-left p-3 font-medium text-muted-foreground hidden sm:table-cell">Famille</th>
                      <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Rôle</th>
                      <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">%</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(links as any[]).map((link) => (
                      <tr key={link.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        {!selectedRecipeId && (
                          <td className="p-3">
                            <div className="font-medium text-amber-600 truncate max-w-[150px]">
                              {link.recipe_name}
                            </div>
                            {link.recipe_collection && (
                              <div className="text-xs text-muted-foreground">{link.recipe_collection}</div>
                            )}
                          </td>
                        )}
                        <td className="p-3">
                          <Link href={`/molecules/${link.molecule_id}`} className="font-medium hover:text-purple-500 transition-colors">
                            {link.molecule_name}
                          </Link>
                        </td>
                        <td className="p-3 hidden sm:table-cell">
                          {link.molecule_family && (
                            <Badge variant="outline" className="text-xs">
                              {link.molecule_family}
                            </Badge>
                          )}
                        </td>
                        <td className="p-3 hidden md:table-cell">
                          {link.role && (
                            <span className="text-xs text-muted-foreground capitalize">
                              {link.role.replace(/_/g, " ")}
                            </span>
                          )}
                        </td>
                        <td className="p-3 hidden md:table-cell">
                          {link.percentage != null && (
                            <span className="text-xs font-mono">{link.percentage}%</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteLink.mutate({ id: link.id })}
                            disabled={deleteLink.isPending}
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
