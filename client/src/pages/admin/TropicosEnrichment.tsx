import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Leaf,
  Globe,
  Image as ImageIcon,
  BookOpen,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Layers,
} from "lucide-react";

export default function TropicosEnrichment() {
  const { toast } = useToast();

  // Search tab state
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedNameId, setSelectedNameId] = useState<number | null>(null);

  // Batch tab state
  const [batchText, setBatchText] = useState("");
  const [activeBatchNames, setActiveBatchNames] = useState<string[]>([]);

  // Enrich tab state
  const [enrichInput, setEnrichInput] = useState("");

  // ── Queries ──────────────────────────────────────────────────────────────

  const statsQuery = trpc.tropicosEnrichment.getStats.useQuery();

  const searchQuery = trpc.tropicosEnrichment.searchName.useQuery(
    { name: activeSearch, limit: 20 },
    { enabled: activeSearch.length >= 2 }
  );

  const synonymsQuery = trpc.tropicosEnrichment.getSynonyms.useQuery(
    { nameId: selectedNameId ?? 0 },
    { enabled: selectedNameId !== null }
  );

  const distributionQuery = trpc.tropicosEnrichment.getDistribution.useQuery(
    { nameId: selectedNameId ?? 0 },
    { enabled: selectedNameId !== null }
  );

  const imagesQuery = trpc.tropicosEnrichment.getImages.useQuery(
    { nameId: selectedNameId ?? 0, limit: 6 },
    { enabled: selectedNameId !== null }
  );

  const batchQuery = trpc.tropicosEnrichment.batchSearchNames.useQuery(
    { names: activeBatchNames, limit: 5 },
    { enabled: activeBatchNames.length > 0 }
  );

  // ── Mutations ─────────────────────────────────────────────────────────────

  const enrichMutation = trpc.tropicosEnrichment.enrichPlant.useMutation({
    onSuccess: (data) => {
      if (data.found) {
        toast({ title: "✅ Enrichissement réussi", description: data.message });
      } else {
        toast({ title: "⚠️ Non trouvé", description: data.message ?? "Aucun résultat", variant: "destructive" });
      }
    },
    onError: (err) => {
      toast({ title: "Erreur Tropicos", description: err.message, variant: "destructive" });
    },
  });

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSearch = () => {
    const q = searchInput.trim();
    if (q.length >= 2) {
      setActiveSearch(q);
      setSelectedNameId(null);
    }
  };

  const handleBatchSearch = () => {
    const names = batchText
      .split("\n")
      .map((n) => n.trim())
      .filter((n) => n.length >= 2)
      .slice(0, 20);
    setActiveBatchNames(names);
  };

  const handleEnrich = () => {
    const name = enrichInput.trim();
    if (name.length >= 2) {
      enrichMutation.mutate({ scientificName: name });
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-50">
              <Leaf className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Tropicos — Missouri Botanical Garden</h1>
              <p className="text-muted-foreground">
                Nomenclature botanique, synonymes, distribution et images (1.33M+ noms, 685K+ images)
              </p>
            </div>
            <div className="ml-auto">
              {statsQuery.data && (
                <Badge
                  variant={statsQuery.data.status === "online" ? "default" : "destructive"}
                  className="text-sm px-3 py-1"
                >
                  {statsQuery.data.status === "online" ? "🟢 En ligne" : "🔴 Hors ligne"}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-6">

        {/* Stats Cards */}
        {statsQuery.data?.coverage && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Noms scientifiques", value: statsQuery.data.coverage.scientificNames, icon: Leaf, color: "text-emerald-600" },
              { label: "Images botaniques", value: statsQuery.data.coverage.images, icon: ImageIcon, color: "text-blue-600" },
              { label: "Spécimens", value: statsQuery.data.coverage.specimens, icon: BookOpen, color: "text-purple-600" },
              { label: "Références", value: statsQuery.data.coverage.references, icon: Layers, color: "text-amber-600" },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <div>
                      <div className="text-xl font-bold">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="search">
          <TabsList className="grid grid-cols-3 w-full max-w-lg">
            <TabsTrigger value="search">
              <Search className="w-4 h-4 mr-2" />
              Recherche
            </TabsTrigger>
            <TabsTrigger value="enrich">
              <RefreshCw className="w-4 h-4 mr-2" />
              Enrichissement
            </TabsTrigger>
            <TabsTrigger value="batch">
              <Layers className="w-4 h-4 mr-2" />
              Batch
            </TabsTrigger>
          </TabsList>

          {/* ── TAB: Recherche ─────────────────────────────────────────── */}
          <TabsContent value="search" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Rechercher un nom botanique</CardTitle>
                <CardDescription>
                  Recherchez un nom scientifique dans la base Tropicos (Missouri Botanical Garden)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: Nicotiana tabacum, Rosa gallica..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button onClick={handleSearch} disabled={searchInput.length < 2}>
                    <Search className="w-4 h-4 mr-2" />
                    Rechercher
                  </Button>
                </div>

                {searchQuery.isLoading && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Recherche en cours...
                  </div>
                )}

                {searchQuery.data && searchQuery.data.results.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {searchQuery.data.total} résultat(s) trouvé(s)
                    </p>
                    <div className="divide-y rounded-lg border">
                      {searchQuery.data.results.map((r, i) => (
                        <div
                          key={i}
                          className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                            selectedNameId === (r.nameId as number) ? "bg-emerald-50 border-l-4 border-l-emerald-500" : ""
                          }`}
                          onClick={() => setSelectedNameId(r.nameId as number)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-medium italic">{String((r as any).scientificName ?? '')}</span>
                              {(r as any).author && (
                                <span className="text-sm text-muted-foreground ml-2">{String((r as any).author)}</span>
                              )}
                              <div className="flex gap-2 mt-1 flex-wrap">
                                {(r as any).family && <Badge variant="outline" className="text-xs">{String((r as any).family)}</Badge>}
                                {(r as any).rank && <Badge variant="outline" className="text-xs">{String((r as any).rank)}</Badge>}
                                {(r as any).nomenclatureStatus && (
                                  <Badge
                                    variant={String((r as any).nomenclatureStatus) === "Legitimate" ? "default" : "secondary"}
                                    className="text-xs"
                                  >
                                    {String((r as any).nomenclatureStatus)}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {(r as any).url && (
                              <a
                                href={String((r as any).url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-muted-foreground hover:text-primary shrink-0"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchQuery.data && searchQuery.data.results.length === 0 && activeSearch.length > 0 && (
                  <Alert>
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>Aucun résultat pour "{activeSearch}"</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Detail panel for selected name */}
            {selectedNameId !== null && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Synonyms */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-600" />
                      Synonymes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {synonymsQuery.isLoading && <p className="text-sm text-muted-foreground">Chargement...</p>}
                    {synonymsQuery.data && synonymsQuery.data.results.length === 0 && (
                      <p className="text-sm text-muted-foreground">Aucun synonyme</p>
                    )}
                    {synonymsQuery.data && synonymsQuery.data.results.length > 0 && (
                      <ul className="space-y-1">
                        {synonymsQuery.data.results.slice(0, 8).map((s, i) => (
                          <li key={i} className="text-sm italic">{s.scientificNameWithAuthors as string}</li>
                        ))}
                        {synonymsQuery.data.total > 8 && (
                          <li className="text-xs text-muted-foreground">+{synonymsQuery.data.total - 8} autres</li>
                        )}
                      </ul>
                    )}
                  </CardContent>
                </Card>

                {/* Distribution */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {distributionQuery.isLoading && <p className="text-sm text-muted-foreground">Chargement...</p>}
                    {distributionQuery.data && distributionQuery.data.results.length === 0 && (
                      <p className="text-sm text-muted-foreground">Aucune donnée de distribution</p>
                    )}
                    {distributionQuery.data && distributionQuery.data.results.length > 0 && (
                      <ul className="space-y-1">
                        {distributionQuery.data.results.slice(0, 8).map((d, i) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <Globe className="w-3 h-3 text-muted-foreground shrink-0" />
                            {String(d.country)}
                            {(d as any).nativeStatus && (
                              <Badge variant="outline" className="text-xs">{String((d as any).nativeStatus)}</Badge>
                            )}
                          </li>
                        ))}
                        {distributionQuery.data.total > 8 && (
                          <li className="text-xs text-muted-foreground">+{distributionQuery.data.total - 8} pays</li>
                        )}
                      </ul>
                    )}
                  </CardContent>
                </Card>

                {/* Images */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-emerald-600" />
                      Images botaniques
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {imagesQuery.isLoading && <p className="text-sm text-muted-foreground">Chargement...</p>}
                    {imagesQuery.data && imagesQuery.data.results.length === 0 && (
                      <p className="text-sm text-muted-foreground">Aucune image disponible</p>
                    )}
                    {imagesQuery.data && imagesQuery.data.results.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {imagesQuery.data.results.map((img, i) => (
                          <a
                            key={i}
                            href={img.largeUrl as string}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={img.thumbnailUrl as string}
                              alt={(img.caption as string) || "Image botanique"}
                              className="w-full h-20 object-cover rounded border hover:opacity-80 transition-opacity"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                          </a>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* ── TAB: Enrichissement ────────────────────────────────────── */}
          <TabsContent value="enrich" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Enrichissement complet d'une plante</CardTitle>
                <CardDescription>
                  Récupère automatiquement nomenclature, synonymes, distribution et images depuis Tropicos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: Nicotiana tabacum"
                    value={enrichInput}
                    onChange={(e) => setEnrichInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleEnrich()}
                  />
                  <Button
                    onClick={handleEnrich}
                    disabled={enrichInput.length < 2 || enrichMutation.isPending}
                  >
                    {enrichMutation.isPending ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Enrichir
                  </Button>
                </div>

                {enrichMutation.data?.found && enrichMutation.data.data && (
                  <div className="rounded-lg border p-4 space-y-3 bg-emerald-50">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="font-medium text-emerald-800">{enrichMutation.data.message}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-muted-foreground">Famille :</span> <strong>{enrichMutation.data.data.family}</strong></div>
                      <div><span className="text-muted-foreground">Rang :</span> <strong>{enrichMutation.data.data.rank}</strong></div>
                      <div><span className="text-muted-foreground">Auteur :</span> <strong>{enrichMutation.data.data.author}</strong></div>
                      <div><span className="text-muted-foreground">Année :</span> <strong>{enrichMutation.data.data.year}</strong></div>
                      <div><span className="text-muted-foreground">Statut :</span> <strong>{enrichMutation.data.data.nomenclatureStatus}</strong></div>
                      <div><span className="text-muted-foreground">NameId :</span> <strong>{enrichMutation.data.data.nameId}</strong></div>
                    </div>
                    {enrichMutation.data.data.synonyms.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1">Synonymes ({enrichMutation.data.data.synonyms.length}) :</p>
                        <p className="text-sm text-muted-foreground italic">
                          {enrichMutation.data.data.synonyms.slice(0, 3).join(", ")}
                          {enrichMutation.data.data.synonyms.length > 3 && ` +${enrichMutation.data.data.synonyms.length - 3} autres`}
                        </p>
                      </div>
                    )}
                    {enrichMutation.data.data.distribution.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1">Distribution ({enrichMutation.data.data.distribution.length} pays) :</p>
                        <p className="text-sm text-muted-foreground">
                          {enrichMutation.data.data.distribution.slice(0, 4).join(", ")}
                          {enrichMutation.data.data.distribution.length > 4 && ` +${enrichMutation.data.data.distribution.length - 4} autres`}
                        </p>
                      </div>
                    )}
                    {enrichMutation.data.data.images.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Images ({enrichMutation.data.data.images.length}) :</p>
                        <div className="flex gap-2">
                          {enrichMutation.data.data.images.map((img, i) => (
                            <a key={i} href={img.largeUrl} target="_blank" rel="noopener noreferrer">
                              <img
                                src={img.thumbnailUrl}
                                alt="Image botanique"
                                className="h-16 w-16 object-cover rounded border hover:opacity-80"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    <a
                      href={enrichMutation.data.data.tropicosUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Voir sur Tropicos
                    </a>
                  </div>
                )}

                {enrichMutation.data && !enrichMutation.data.found && (
                  <Alert variant="destructive">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>{enrichMutation.data.message}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── TAB: Batch ─────────────────────────────────────────────── */}
          <TabsContent value="batch" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recherche en masse</CardTitle>
                <CardDescription>
                  Recherchez jusqu'à 20 noms scientifiques en une seule opération (un nom par ligne)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder={"Nicotiana tabacum\nCannabis sativa\nRosa gallica\nLavandula angustifolia"}
                  value={batchText}
                  onChange={(e) => setBatchText(e.target.value)}
                  rows={6}
                />
                <Button onClick={handleBatchSearch} disabled={batchText.trim().length < 2}>
                  <Search className="w-4 h-4 mr-2" />
                  Lancer la recherche batch
                </Button>

                {batchQuery.isLoading && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Recherche en cours... (300ms entre chaque requête)
                  </div>
                )}

                {batchQuery.data && (
                  <div className="space-y-3">
                    <div className="flex gap-4 text-sm">
                      <span className="text-emerald-600 font-medium">✅ {batchQuery.data.matched} trouvé(s)</span>
                      <span className="text-red-600 font-medium">❌ {batchQuery.data.failed} non trouvé(s)</span>
                      <span className="text-muted-foreground">sur {batchQuery.data.total} noms</span>
                    </div>
                    <div className="divide-y rounded-lg border">
                      {batchQuery.data.results.map((r, i) => (
                        <div key={i} className="p-3 flex items-start gap-3">
                          {r.found ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm text-muted-foreground">{r.input}</span>
                              {r.found && r.scientificName && (
                                <span className="text-sm font-medium italic">→ {r.scientificName as string}</span>
                              )}
                            </div>
                            {r.found && (
                              <div className="flex gap-2 mt-1 flex-wrap">
                                {r.family && <Badge variant="outline" className="text-xs">{String(r.family)}</Badge>}
                                {r.nomenclatureStatus && (
                                  <Badge variant="secondary" className="text-xs">{String(r.nomenclatureStatus)}</Badge>
                                )}
                                {r.url && (
                                  <a
                                    href={r.url as string}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    Tropicos
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* About Tropicos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">À propos de Tropicos</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Tropicos</strong> est la base de données botanique du Missouri Botanical Garden,
              l'une des plus importantes au monde avec plus de 1,33 million de noms scientifiques,
              685 000 images botaniques, 4,9 millions de spécimens et 500 000 références bibliographiques.
            </p>
            <p>
              Cette intégration permet de récupérer automatiquement la nomenclature standardisée,
              les synonymes, la distribution géographique et les images botaniques pour chaque plante du projet PERFUMUM.
            </p>
            <a
              href="https://www.tropicos.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              Visiter Tropicos.org →
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
