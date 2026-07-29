import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Leaf, TreeDeciduous, Dna, Globe, BookOpen, Zap } from "lucide-react";

const API_CONFIG = [
  { key: "gbif", label: "GBIF", icon: <Leaf className="h-3.5 w-3.5" /> },
  { key: "powo", label: "POWO", icon: <TreeDeciduous className="h-3.5 w-3.5" /> },
  { key: "ncbi", label: "NCBI", icon: <Dna className="h-3.5 w-3.5" /> },
  { key: "wikidata", label: "Wikidata", icon: <Globe className="h-3.5 w-3.5" /> },
  { key: "itis", label: "ITIS", icon: <BookOpen className="h-3.5 w-3.5" /> },
];

export function EnrichTab() {
  const [selectedApi, setSelectedApi] = useState<"gbif" | "powo" | "ncbi" | "wikidata" | "itis">("gbif");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);
  const [identifier, setIdentifier] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [notes, setNotes] = useState("");

  const { data: plants } = trpc.apiEnrichments.searchPlants.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length >= 2 }
  );

  const [autoEnrichMessage, setAutoEnrichMessage] = useState("");

  const saveMutation = trpc.apiEnrichments.saveEnrichment.useMutation();
  const removeMutation = trpc.apiEnrichments.removeEnrichment.useMutation();
  const autoEnrichMutation = trpc.apiEnrichments.autoEnrich.useMutation();
  const { data: enrichments, refetch: refetchEnrichments } = trpc.apiEnrichments.getEnrichments.useQuery(
    { plant_id: selectedPlantId || 0 },
    { enabled: !!selectedPlantId }
  );

  const handleSave = async () => {
    if (!selectedPlantId || !identifier) return;
    try {
      await saveMutation.mutateAsync({
        plant_id: selectedPlantId,
        api_type: selectedApi,
        identifier,
        source_url: sourceUrl || undefined,
        notes: notes || undefined,
      });
      setIdentifier("");
      setSourceUrl("");
      setNotes("");
      refetchEnrichments();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde", error);
    }
  };

  const handleRemove = async (apiType: string) => {
    if (!selectedPlantId) return;
    try {
      await removeMutation.mutateAsync({
        plant_id: selectedPlantId,
        api_type: apiType as any,
      });
      refetchEnrichments();
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
    }
  };

  const handleAutoEnrich = async () => {
    if (!selectedPlantId) return;
    setAutoEnrichMessage("");
    try {
      const result = await autoEnrichMutation.mutateAsync({ plant_id: selectedPlantId });
      if (result.results.length > 0) {
        const enrichedApis = result.results.map((r: { api_type: string; identifier: string }) => `${r.api_type} (${r.identifier})`).join(", ");
        setAutoEnrichMessage(`✅ Enrichissement réussi : ${enrichedApis}`);
      } else {
        setAutoEnrichMessage("ℹ️ Aucun nouvel identifiant trouvé");
      }
      refetchEnrichments();
    } catch (error) {
      console.error("Erreur lors de l'enrichissement automatique", error);
      setAutoEnrichMessage("❌ Erreur lors de l'enrichissement automatique");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Enrichir les identifiants API</CardTitle>
          <CardDescription>Ajouter ou mettre à jour manuellement les identifiants GBIF, POWO, NCBI, Wikidata et ITIS</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sélection de la plante */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rechercher une plante</label>
            <Input
              placeholder="Taper le nom de la plante (ex: Rosa damascena)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
            {plants && plants.length > 0 && (
              <div className="border border-border rounded-lg max-h-48 overflow-y-auto">
                {(plants as any[]).map((plant) => (
                  <button
                    key={plant.id}
                    onClick={() => {
                      setSelectedPlantId(plant.id);
                      setSearchQuery("");
                      setAutoEnrichMessage("");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-muted/50 border-b border-border last:border-b-0 text-sm"
                  >
                    <div className="font-medium">{plant.name}</div>
                    <div className="text-xs text-muted-foreground">{plant.latin_name} • {plant.family}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedPlantId && (
            <>
              {/* Bouton d'enrichissement automatique */}
              <div className="space-y-2">
                <Button
                  onClick={handleAutoEnrich}
                  disabled={autoEnrichMutation.isPending}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Zap className="h-4 w-4" />
                  {autoEnrichMutation.isPending ? "Enrichissement en cours..." : "Enrichir automatiquement depuis Wikidata & GBIF"}
                </Button>
                {autoEnrichMessage && (
                  <div className="text-sm p-3 rounded-lg bg-muted/50 border border-border">
                    {autoEnrichMessage}
                  </div>
                )}
              </div>

              {/* Sélection de l'API */}
              <div className="space-y-2">
                <label className="text-sm font-medium">API à enrichir manuellement</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {API_CONFIG.map((api) => (
                    <button
                      key={api.key}
                      onClick={() => setSelectedApi(api.key as any)}
                      className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                        selectedApi === api.key
                          ? `border-primary bg-primary/10 text-primary`
                          : `border-border hover:border-primary/50`
                      }`}
                    >
                      {api.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Formulaire d'enrichissement */}
              <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Identifiant {API_CONFIG.find(a => a.key === selectedApi)?.label}</label>
                  <Input
                    placeholder={`Ex: ${selectedApi === "gbif" ? "2978421" : selectedApi === "powo" ? "urn:lsid:ipni.org:names:2613145-4" : selectedApi === "ncbi" ? "182999" : selectedApi === "wikidata" ? "Q18469235" : "36446"}`}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL source (optionnel)</label>
                  <Input
                    placeholder="https://..."
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes (optionnel)</label>
                  <Input
                    placeholder="Remarques sur cet identifiant..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="h-9"
                  />
                </div>
                <Button
                  onClick={handleSave}
                  disabled={!identifier || saveMutation.isPending}
                  className="w-full"
                >
                  {saveMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
              </div>

              {/* Enrichissements existants */}
              {enrichments && enrichments.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Identifiants enregistrés</label>
                  <div className="space-y-2">
                    {(enrichments as any[]).map((e) => (
                      <div key={e.id} className="flex items-start justify-between p-3 border border-border rounded-lg">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{e.api_type.toUpperCase()}</Badge>
                            <code className="text-xs bg-muted px-2 py-1 rounded">{e.identifier}</code>
                          </div>
                          {e.notes && <p className="text-xs text-muted-foreground">{e.notes}</p>}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemove(e.api_type)}
                          disabled={removeMutation.isPending}
                          className="text-destructive hover:text-destructive"
                        >
                          Supprimer
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
