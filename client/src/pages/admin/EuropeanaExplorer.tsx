/**
 * PERFUMUM ↔ Europeana Explorer
 * ================================
 * Galerie des collections muséales européennes liées aux données PERFUMUM.
 * Trois requêtes thématiques : Rose de Damas, Encens, Tabac ottoman.
 * Mode dégradé si la clé API Europeana n'est pas configurée.
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  ExternalLink, Image as ImageIcon, Loader2, Search, Globe,
  FlaskConical, Leaf, AlertCircle, Info, Palette, BookOpen,
  Building2, MapPin, Calendar,
} from "lucide-react";

// ─── Carte d'œuvre Europeana ──────────────────────────────────────────────────

interface EuropeanaItem {
  id: string;
  title: string;
  creator?: string;
  date?: string;
  institution?: string;
  country?: string;
  thumbnailUrl?: string;
  europeanaUrl: string;
  rights?: string;
  type?: string;
  theme?: string;
  relatedPlantId?: number;
  relatedPlantName?: string;
  relatedMoleculeId?: number;
  relatedMoleculeName?: string;
}

function EuropeanaCard({ item }: { item: EuropeanaItem }) {
  const [imgError, setImgError] = useState(false);

  const themeColors: Record<string, string> = {
    rose_damas: "border-t-rose-500",
    encens: "border-t-amber-500",
    tabac_ottoman: "border-t-violet-500",
    houblon: "border-t-green-500",
    libre: "border-t-blue-500",
    qid: "border-t-cyan-500",
  };

  const borderColor = themeColors[item.theme || "libre"] || "border-t-primary";

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-200 border-t-2 ${borderColor} group`}>
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-muted relative">
        {item.thumbnailUrl && !imgError ? (
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Palette className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}
        {/* Overlay type */}
        {item.type && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="text-xs bg-black/60 text-white border-0">
              {item.type}
            </Badge>
          </div>
        )}
      </div>

      {/* Contenu */}
      <CardContent className="p-3 space-y-2">
        <p className="font-medium text-sm line-clamp-2 leading-tight">{item.title}</p>

        {/* Créateur + date */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {item.creator && (
            <span className="truncate">{item.creator}</span>
          )}
          {item.creator && item.date && <span>·</span>}
          {item.date && (
            <span className="shrink-0 flex items-center gap-0.5">
              <Calendar className="h-2.5 w-2.5" />
              {item.date}
            </span>
          )}
        </div>

        {/* Institution */}
        {item.institution && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Building2 className="h-2.5 w-2.5 shrink-0" />
            <span className="truncate">{item.institution}</span>
            {item.country && (
              <span className="shrink-0 flex items-center gap-0.5">
                <MapPin className="h-2.5 w-2.5" />
                {item.country}
              </span>
            )}
          </div>
        )}

        {/* Liens croisés PERFUMUM */}
        <div className="flex flex-wrap gap-1 pt-1">
          {item.relatedPlantName && item.relatedPlantId && (
            <Link href={`/plants/${item.relatedPlantId}`}>
              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-green-50 dark:hover:bg-green-950 hover:border-green-400">
                <Leaf className="h-2.5 w-2.5 mr-1 text-green-600" />
                {item.relatedPlantName}
              </Badge>
            </Link>
          )}
          {item.relatedPlantName && !item.relatedPlantId && (
            <Badge variant="outline" className="text-xs">
              <Leaf className="h-2.5 w-2.5 mr-1 text-green-600" />
              {item.relatedPlantName}
            </Badge>
          )}
          {item.relatedMoleculeName && item.relatedMoleculeId && (
            <Link href={`/molecules/${item.relatedMoleculeId}`}>
              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-400">
                <FlaskConical className="h-2.5 w-2.5 mr-1 text-blue-600" />
                {item.relatedMoleculeName}
              </Badge>
            </Link>
          )}
          {item.relatedMoleculeName && !item.relatedMoleculeId && (
            <Badge variant="outline" className="text-xs">
              <FlaskConical className="h-2.5 w-2.5 mr-1 text-blue-600" />
              {item.relatedMoleculeName}
            </Badge>
          )}
          <a href={item.europeanaUrl} target="_blank" rel="noopener noreferrer">
            <Badge variant="outline" className="text-xs cursor-pointer hover:bg-accent">
              <Globe className="h-2.5 w-2.5 mr-1 text-cyan-600" />
              Europeana
              <ExternalLink className="h-2 w-2 ml-1" />
            </Badge>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Bannière mode démonstration ──────────────────────────────────────────────

function DemoBanner({ error }: { error?: string }) {
  if (!error) return null;
  const isDemo = error.includes("démonstration") || error.includes("non configurée");
  if (!isDemo) return null;

  return (
    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
      <CardContent className="p-4 flex items-start gap-3">
        <Info className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
        <div className="text-sm text-amber-800 dark:text-amber-300">
          <p className="font-medium mb-1">Mode démonstration — données d'exemple</p>
          <p className="text-xs">
            La clé API Europeana n'est pas encore configurée. Les œuvres affichées sont des exemples représentatifs.
            Dès que la clé sera ajoutée dans les secrets du projet, les vraies collections muséales s'afficheront automatiquement.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Onglet thématique ────────────────────────────────────────────────────────

const THEME_META: Record<string, { color: string; bgLight: string; bgDark: string; icon: string }> = {
  rose_damas: { color: "text-rose-600", bgLight: "bg-rose-50", bgDark: "dark:bg-rose-950/30", icon: "🌹" },
  encens: { color: "text-amber-600", bgLight: "bg-amber-50", bgDark: "dark:bg-amber-950/30", icon: "🕯️" },
  tabac_ottoman: { color: "text-violet-600", bgLight: "bg-violet-50", bgDark: "dark:bg-violet-950/30", icon: "🪄" },
  houblon: { color: "text-green-600", bgLight: "bg-green-50", bgDark: "dark:bg-green-950/30", icon: "🌿" },
};

function ThematicTab({ theme }: { theme: string }) {
  const [enabled, setEnabled] = useState(false);
  const meta = THEME_META[theme] || { color: "text-primary", bgLight: "bg-muted", bgDark: "", icon: "🔍" };

  const { data: config } = trpc.europeana.thematicConfig.useQuery();
  const themeConfig = config?.find((t) => t.key === theme);

  const { data, isLoading, error } = trpc.europeana.thematicSearch.useQuery(
    { theme: theme as any, limit: 24 },
    { enabled }
  );

  return (
    <div className="space-y-4">
      {/* Description du thème */}
      {themeConfig && (
        <Card className={`${meta.bgLight} ${meta.bgDark} border-0`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{meta.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">{themeConfig.label}</p>
                <p className="text-xs text-muted-foreground mb-3">{themeConfig.description}</p>
                <div className="flex flex-wrap gap-2">
                  <div className="flex flex-wrap gap-1">
                    {themeConfig.relatedPlants.map((p) => (
                      <Badge key={p} variant="outline" className="text-xs">
                        <Leaf className="h-2.5 w-2.5 mr-1 text-green-600" />
                        {p}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {themeConfig.relatedMolecules.map((m) => (
                      <Badge key={m} variant="outline" className="text-xs">
                        <FlaskConical className="h-2.5 w-2.5 mr-1 text-blue-600" />
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bouton de lancement */}
      {!enabled && (
        <div className="flex justify-center py-4">
          <Button onClick={() => setEnabled(true)} size="lg" className="gap-2">
            <Globe className="h-4 w-4" />
            Interroger les collections Europeana
          </Button>
        </div>
      )}

      {/* Chargement */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">
            Interrogation des collections muséales européennes...
          </span>
        </div>
      )}

      {/* Erreur non-demo */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-4 flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p className="text-sm">{error.message}</p>
          </CardContent>
        </Card>
      )}

      {/* Résultats */}
      {data && !isLoading && (
        <>
          <DemoBanner error={data.error} />

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {data.apiAvailable
                ? `${data.total.toLocaleString()} œuvre(s) trouvée(s) dans les collections européennes`
                : `${data.items.length} exemple(s) de démonstration`}
            </p>
            {data.apiAvailable && (
              <Badge variant="outline" className="text-xs text-green-600 border-green-400">
                API Europeana active
              </Badge>
            )}
          </div>

          {data.items.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {data.items.map((item, i) => (
                <EuropeanaCard key={`${item.id}-${i}`} item={item} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center text-muted-foreground">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Aucune œuvre trouvée pour ce thème</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

// ─── Onglet recherche libre ───────────────────────────────────────────────────

function FreeSearchTab() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("IMAGE");
  const [submitted, setSubmitted] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");

  const { data, isLoading } = trpc.europeana.freeSearch.useQuery(
    { query: currentQuery, limit: 24, typeFilter: typeFilter as any },
    { enabled: submitted && currentQuery.length > 1 }
  );

  const handleSearch = () => {
    if (query.trim().length > 1) {
      setCurrentQuery(query.trim());
      setSubmitted(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1">
          <Label>Recherche libre dans Europeana</Label>
          <Input
            placeholder="ex: Rosa damascena, oud perfume, amber resin..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div>
          <Label>Type</Label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IMAGE">Images</SelectItem>
              <SelectItem value="TEXT">Textes</SelectItem>
              <SelectItem value="VIDEO">Vidéos</SelectItem>
              <SelectItem value="SOUND">Sons</SelectItem>
              <SelectItem value="3D">3D</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSearch} disabled={!query.trim() || isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          Rechercher
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Recherche dans les collections européennes...</span>
        </div>
      )}

      {data && !isLoading && (
        <>
          <DemoBanner error={data.error} />

          {data.error && !data.error.includes("démonstration") && (
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
              <CardContent className="p-4 flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p className="text-sm">{data.error}</p>
              </CardContent>
            </Card>
          )}

          {data.items.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground">
                {data.total.toLocaleString()} résultat(s) — affichage des {data.items.length} premiers
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {data.items.map((item, i) => (
                  <EuropeanaCard key={`${item.id}-${i}`} item={item} />
                ))}
              </div>
            </>
          ) : submitted && (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Aucun résultat pour "{currentQuery}"</p>
                <p className="text-xs mt-1">Essayez en anglais ou avec des termes plus généraux</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

// ─── Onglet statistiques ──────────────────────────────────────────────────────

function StatsTab() {
  const { data: stats, isLoading } = trpc.europeana.stats.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statut API */}
      <Card className={stats?.apiConfigured
        ? "border-green-200 bg-green-50 dark:bg-green-950/20"
        : "border-amber-200 bg-amber-50 dark:bg-amber-950/20"
      }>
        <CardContent className="p-4 flex items-start gap-3">
          <Info className={`h-4 w-4 mt-0.5 shrink-0 ${stats?.apiConfigured ? "text-green-600" : "text-amber-600"}`} />
          <div>
            <p className={`font-medium text-sm ${stats?.apiConfigured ? "text-green-800 dark:text-green-200" : "text-amber-800 dark:text-amber-200"}`}>
              {stats?.apiConfigured ? "API Europeana configurée et active" : "API Europeana — clé manquante"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.apiConfigured
                ? "Les requêtes interrogent les vraies collections muséales européennes en temps réel."
                : "Mode démonstration actif. Ajoutez EUROPEANA_API_KEY dans les secrets du projet pour activer l'API. Clé gratuite sur pro.europeana.eu."
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Métriques PERFUMUM */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{stats?.moleculesWithQid ?? 0}</p>
            <p className="text-sm text-muted-foreground">Molécules avec QID</p>
            <p className="text-xs text-muted-foreground">
              sur {stats?.totalMolecules ?? 0} total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">{stats?.plantsWithQid ?? 0}</p>
            <p className="text-sm text-muted-foreground">Plantes avec QID</p>
            <p className="text-xs text-muted-foreground">
              sur {stats?.totalPlants ?? 0} total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-600">4</p>
            <p className="text-sm text-muted-foreground">Thèmes actifs</p>
            <p className="text-xs text-muted-foreground">Rose · Encens · Tabac · Houblon</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-violet-600">50M+</p>
            <p className="text-sm text-muted-foreground">Objets Europeana</p>
            <p className="text-xs text-muted-foreground">collections accessibles</p>
          </CardContent>
        </Card>
      </div>

      {/* Thèmes disponibles */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Palette className="h-4 w-4 text-amber-600" />
          Thèmes PERFUMUM disponibles
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { key: "rose_damas", icon: "🌹", label: "Rose de Damas", desc: "Rosa damascena dans l'art européen", color: "border-l-rose-500" },
            { key: "encens", icon: "🕯️", label: "Encens & Oliban", desc: "Boswellia dans les collections religieuses", color: "border-l-amber-500" },
            { key: "tabac_ottoman", icon: "🪄", label: "Tabac ottoman", desc: "Narguilés, chibouks, cafés orientalistes", color: "border-l-violet-500" },
            { key: "houblon", icon: "🌿", label: "Houblon & Brasserie", desc: "Humulus lupulus dans l'art flamand", color: "border-l-green-500" },
          ].map((t) => (
            <Card key={t.key} className={`border-l-4 ${t.color}`}>
              <CardContent className="p-3 flex items-center gap-3">
                <span className="text-xl">{t.icon}</span>
                <div>
                  <p className="font-medium text-sm">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <Card className="border-dashed">
        <CardContent className="p-4 space-y-2">
          <p className="text-sm font-medium flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Comment utiliser PERFUMUM ↔ Europeana
          </p>
          <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Choisissez un thème dans les onglets (Rose de Damas, Encens, Tabac ottoman, Houblon)</li>
            <li>Cliquez sur "Interroger les collections Europeana" pour lancer la recherche</li>
            <li>Chaque carte affiche l'œuvre, son institution et ses liens croisés PERFUMUM</li>
            <li>Utilisez la recherche libre pour des requêtes personnalisées</li>
            <li>Les badges verts/bleus sur les cartes renvoient aux fiches plantes/molécules PERFUMUM</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function EuropeanaExplorer() {
  return (
    <div className="container py-6 space-y-6">
      {/* En-tête */}
      <div>
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <Globe className="h-6 w-6 text-cyan-600 shrink-0" />
          <h1 className="text-xl md:text-2xl font-bold">PERFUMUM ↔ Europeana</h1>
          <Badge variant="secondary" className="text-xs">Collections muséales européennes</Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Croisement des données PERFUMUM avec les 50 millions d'objets culturels des musées européens.
          Découvrez les représentations artistiques des plantes et molécules de votre recherche.
        </p>
      </div>

      {/* Onglets */}
      <Tabs defaultValue="stats">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="stats" className="text-xs">
            <Info className="h-3.5 w-3.5 mr-1" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="rose_damas" className="text-xs">
            🌹 Rose de Damas
          </TabsTrigger>
          <TabsTrigger value="encens" className="text-xs">
            🕯️ Encens
          </TabsTrigger>
          <TabsTrigger value="tabac_ottoman" className="text-xs">
            🪄 Tabac ottoman
          </TabsTrigger>
          <TabsTrigger value="houblon" className="text-xs">
            🌿 Houblon
          </TabsTrigger>
          <TabsTrigger value="libre" className="text-xs">
            <Search className="h-3.5 w-3.5 mr-1" />
            Recherche libre
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="mt-4">
          <StatsTab />
        </TabsContent>

        <TabsContent value="rose_damas" className="mt-4">
          <ThematicTab theme="rose_damas" />
        </TabsContent>

        <TabsContent value="encens" className="mt-4">
          <ThematicTab theme="encens" />
        </TabsContent>

        <TabsContent value="tabac_ottoman" className="mt-4">
          <ThematicTab theme="tabac_ottoman" />
        </TabsContent>

        <TabsContent value="houblon" className="mt-4">
          <ThematicTab theme="houblon" />
        </TabsContent>

        <TabsContent value="libre" className="mt-4">
          <FreeSearchTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
