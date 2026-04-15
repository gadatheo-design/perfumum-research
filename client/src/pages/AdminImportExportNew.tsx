/**
 * AdminImportExportNew.tsx
 * Page d'import/export bidirectionnelle PERFUMUM
 * - Header + Breadcrumbs restaurés
 * - Guide collaborateur complet
 * - Documentation des formats CSV/JSON par entité
 * - Téléchargement des modèles
 * - Import avec validation et aperçu
 * - Export réel des données existantes
 */
import React, { useState } from "react";
import {
  Upload, Download, Database, FileSpreadsheet, FileJson,
  Leaf, Zap, Palette, Beaker, Package, MapPin, Globe,
  ChevronRight, Info, CheckCircle2, AlertTriangle,
  BookOpen, Users, ArrowRight, Layers, FlaskConical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/layout/Header";
import { ImportFileUpload } from "@/components/ImportFileUpload";
import { useAuth } from "@/hooks/useAuth";

const ENTITIES = [
  {
    entity: "molecules", label: "Molécules",
    icon: <Beaker className="h-5 w-5" />,
    colorClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/20",
    borderClass: "border-emerald-200 dark:border-emerald-800",
    description: "Catalogue des molécules olfactives avec profils chimiques et sensoriels",
    requiredFields: ["name"],
    optionalFields: ["cas_number", "molecular_formula", "smiles", "odor_description", "olfactive_family"],
    keyNotes: "Le champ `name` est obligatoire. Les tableaux (therapeutic_properties, flavornet_percepts) doivent être encodés en JSON entre guillemets.",
    exportType: "molecules",
  },
  {
    entity: "recettes", label: "Recettes",
    icon: <FlaskConical className="h-5 w-5" />,
    colorClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-50 dark:bg-blue-950/20",
    borderClass: "border-blue-200 dark:border-blue-800",
    description: "Formulations et compositions olfactives",
    requiredFields: ["name"],
    optionalFields: ["description", "category", "base_notes", "heart_notes", "top_notes", "concentration"],
    keyNotes: "Les IDs de molécules (base_notes, heart_notes, top_notes) sont des tableaux JSON d'entiers.",
    exportType: null,
  },
  {
    entity: "accords", label: "Accords",
    icon: <Palette className="h-5 w-5" />,
    colorClass: "text-purple-600 dark:text-purple-400",
    bgClass: "bg-purple-50 dark:bg-purple-950/20",
    borderClass: "border-purple-200 dark:border-purple-800",
    description: "Accords olfactifs et leurs compositions moléculaires",
    requiredFields: ["name"],
    optionalFields: ["description", "molecules", "olfactive_profile", "harmony_score"],
    keyNotes: "Le champ `molecules` est un tableau JSON d'IDs de molécules.",
    exportType: null,
  },
  {
    entity: "familles", label: "Familles Olfactives",
    icon: <Layers className="h-5 w-5" />,
    colorClass: "text-indigo-600 dark:text-indigo-400",
    bgClass: "bg-indigo-50 dark:bg-indigo-950/20",
    borderClass: "border-indigo-200 dark:border-indigo-800",
    description: "Classification olfactive hiérarchique",
    requiredFields: ["name"],
    optionalFields: ["name_fr", "description", "characteristics", "color_code"],
    keyNotes: "Le champ `id` est une clé textuelle (ex: `terpenes`). Les `characteristics` sont un tableau JSON.",
    exportType: null,
  },
  {
    entity: "matieres_premieres", label: "Matières Premières",
    icon: <Package className="h-5 w-5" />,
    colorClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-50 dark:bg-amber-950/20",
    borderClass: "border-amber-200 dark:border-amber-800",
    description: "Inventaire du laboratoire ABSORBE",
    requiredFields: ["name"],
    optionalFields: ["material_id", "latin_name", "category", "plant_part", "origin_country", "olfactive_family"],
    keyNotes: "Le `material_id` est un identifiant interne (ex: `RM-001`). La `category` doit être : `huile_essentielle`, `absolu`, `resine`, `teinture`, ou `synthetique`.",
    exportType: null,
  },
  {
    entity: "plants", label: "Plantes",
    icon: <Leaf className="h-5 w-5" />,
    colorClass: "text-green-600 dark:text-green-400",
    bgClass: "bg-green-50 dark:bg-green-950/20",
    borderClass: "border-green-200 dark:border-green-800",
    description: "Base botanique (Leaf Economies — Nicotiana, Cannabis, Citrus…)",
    requiredFields: ["name"],
    optionalFields: ["latin_name", "family", "origin", "description", "molecules", "terroirs"],
    keyNotes: "Les champs `molecules` et `terroirs` sont des tableaux JSON d'IDs. Le `latin_name` doit être en nomenclature binomiale.",
    exportType: "plants",
  },
  {
    entity: "terroirs", label: "Terroirs",
    icon: <MapPin className="h-5 w-5" />,
    colorClass: "text-orange-600 dark:text-orange-400",
    bgClass: "bg-orange-50 dark:bg-orange-950/20",
    borderClass: "border-orange-200 dark:border-orange-800",
    description: "Régions de production et leurs caractéristiques",
    requiredFields: ["name", "country"],
    optionalFields: ["region", "climate", "altitude", "soil_type", "description", "plants"],
    keyNotes: "Le champ `plants` est un tableau JSON d'IDs. Le `climate` doit correspondre à une classification Köppen.",
    exportType: null,
  },
  {
    entity: "regions", label: "Régions Géographiques",
    icon: <Globe className="h-5 w-5" />,
    colorClass: "text-cyan-600 dark:text-cyan-400",
    bgClass: "bg-cyan-50 dark:bg-cyan-950/20",
    borderClass: "border-cyan-200 dark:border-cyan-800",
    description: "Zones géographiques et hotspots de biodiversité",
    requiredFields: ["name"],
    optionalFields: ["region", "zone_type", "coordinates", "threat_level", "conservation_priority"],
    keyNotes: "Les `coordinates` sont un tableau JSON de points `{lat, lng}`. Le `zone_type` peut être : `biodiversity_hotspot`, `production_zone`, `research_area`.",
    exportType: null,
  },
];

export default function AdminImportExportNew() {
  const { user } = useAuth();
  const [activeImportEntity, setActiveImportEntity] = useState<string | null>(null);
  const [activeDocEntity, setActiveDocEntity] = useState<string>("molecules");
  const [downloadingEntity, setDownloadingEntity] = useState<string | null>(null);

  const statsQuery = trpc.importExport.getStats.useQuery();
  const isAdmin = user?.role === "admin";
  const activeEntity = ENTITIES.find((e) => e.entity === activeDocEntity);

  const downloadTemplate = async (entity: string, format: "csv" | "json") => {
    setDownloadingEntity(`${entity}-${format}`);
    try {
      const proc = format === "csv" ? "downloadTemplateCSV" : "downloadTemplateJSON";
      const batchInput = encodeURIComponent(JSON.stringify({ "0": { json: { entity } } }));
      const url = `/api/trpc/importExport.${proc}?batch=1&input=${batchInput}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const result = Array.isArray(json) ? json[0]?.result?.data : json.result?.data;
      if (!result) throw new Error("Réponse invalide du serveur");
      const blob = new Blob([result.content], { type: result.mimeType });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      toast.success(`Modèle ${format.toUpperCase()} téléchargé : ${result.filename}`);
    } catch (error) {
      toast.error(`Erreur : ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setDownloadingEntity(null);
    }
  };

  const exportRealData = async (type: string, format: "csv" | "json") => {
    setDownloadingEntity(`export-${type}-${format}`);
    try {
      const procMap: Record<string, string> = {
        "molecules-csv": "exportMoleculesCSV",
        "molecules-json": "exportMoleculesJSON",
        "plants-csv": "exportPlantesCSV",
        "plants-json": "exportPlantesJSON",
      };
      const proc = procMap[`${type}-${format}`];
      if (!proc) throw new Error("Export non disponible pour cette entité");
      const url = `/api/trpc/importExport.${proc}?batch=1`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const rawResult = Array.isArray(json) ? json[0]?.result?.data : json.result?.data;
      if (!rawResult) throw new Error("Réponse invalide du serveur");
      const content = rawResult.content;
      const filename = rawResult.filename ?? `export_${type}_${new Date().toISOString().slice(0,10)}.${format}`;
      const mimeType = format === "csv" ? "text/csv;charset=utf-8;" : "application/json";
      const blob = new Blob([content], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      toast.success(`Export ${format.toUpperCase()} téléchargé : ${result.filename}`);
    } catch (error) {
      toast.error(`Erreur : ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setDownloadingEntity(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-10 bg-gradient-to-b from-background to-muted/30 border-b">
          <div className="container max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="p-4 rounded-2xl bg-primary/10 shrink-0 self-start">
                <Database className="h-10 w-10 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Import / Export des Données</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                  Importez et exportez les données de recherche en CSV ou JSON. Téléchargez les modèles
                  standardisés pour garantir la compatibilité avec la base de données PERFUMUM.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <Badge variant="outline" className="gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    {statsQuery.data?.totalTemplates ?? 8} entités supportées
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <FileSpreadsheet className="h-3 w-3 text-blue-500" />
                    CSV (Excel / Sheets)
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <FileJson className="h-3 w-3 text-purple-500" />
                    JSON structuré
                  </Badge>
                  {!isAdmin && (
                    <Badge variant="outline" className="gap-1 text-amber-600 border-amber-300">
                      <AlertTriangle className="h-3 w-3" />
                      Connexion requise pour importer
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contenu principal */}
        <section className="py-8">
          <div className="container max-w-6xl">
            <Tabs defaultValue="guide" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
                <TabsTrigger value="guide" className="flex items-center gap-2 py-2.5">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Guide collaborateur</span>
                  <span className="sm:hidden">Guide</span>
                </TabsTrigger>
                <TabsTrigger value="formats" className="flex items-center gap-2 py-2.5">
                  <FileJson className="h-4 w-4" />
                  <span className="hidden sm:inline">Formats & Modèles</span>
                  <span className="sm:hidden">Formats</span>
                </TabsTrigger>
                <TabsTrigger value="import" className="flex items-center gap-2 py-2.5">
                  <Upload className="h-4 w-4" />
                  Importer
                </TabsTrigger>
                <TabsTrigger value="export" className="flex items-center gap-2 py-2.5">
                  <Download className="h-4 w-4" />
                  Exporter
                </TabsTrigger>
              </TabsList>

              {/* TAB 1 — GUIDE COLLABORATEUR */}
              <TabsContent value="guide" className="space-y-6">
                <Alert>
                  <Users className="h-4 w-4" />
                  <AlertTitle>Guide à destination des collaborateurs PERFUMUM</AlertTitle>
                  <AlertDescription>
                    Ce guide explique comment contribuer des données à la base de recherche. Lisez-le
                    attentivement avant votre premier import.
                  </AlertDescription>
                </Alert>

                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      step: "01", title: "Télécharger le modèle",
                      desc: "Rendez-vous dans l'onglet « Formats & Modèles », choisissez l'entité correspondant à vos données, et téléchargez le modèle CSV ou JSON.",
                      icon: <Download className="h-5 w-5 text-blue-500" />,
                    },
                    {
                      step: "02", title: "Remplir le fichier",
                      desc: "Complétez le modèle avec vos données en respectant les formats décrits. Ne modifiez pas les en-têtes de colonnes. Les champs obligatoires sont marqués.",
                      icon: <FileSpreadsheet className="h-5 w-5 text-emerald-500" />,
                    },
                    {
                      step: "03", title: "Importer et valider",
                      desc: "Dans l'onglet « Importer », sélectionnez l'entité, déposez votre fichier, vérifiez l'aperçu de validation, puis confirmez l'import.",
                      icon: <Upload className="h-5 w-5 text-purple-500" />,
                    },
                  ].map((item) => (
                    <Card key={item.step} className="relative overflow-hidden">
                      <div className="absolute top-3 right-3 text-4xl font-black text-muted/20 select-none">{item.step}</div>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          {item.icon}
                          <CardTitle className="text-base">{item.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-primary" />
                      Règles générales de formatage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                          <FileSpreadsheet className="h-4 w-4 text-blue-500" />
                          Format CSV
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1.5">
                          {[
                            ["Séparateur", "virgule (,)"],
                            ["Encodage", "UTF-8 (obligatoire pour les accents)"],
                            ["Première ligne", "en-têtes de colonnes (ne pas modifier)"],
                            ["Valeurs avec virgules", 'encadrer de "guillemets"'],
                            ["Tableaux JSON dans une cellule", '"[1,2,3]"'],
                            ["Compatible", "Excel, Google Sheets, LibreOffice Calc"],
                          ].map(([label, val]) => (
                            <li key={label} className="flex items-start gap-2">
                              <ArrowRight className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground/60" />
                              <span><strong>{label} :</strong> {val}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                          <FileJson className="h-4 w-4 text-purple-500" />
                          Format JSON
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1.5">
                          {[
                            ["Structure", "tableau d'objets [{...}, ...]"],
                            ["Encodage", "UTF-8"],
                            ["Types préservés", "nombres, booléens, tableaux"],
                            ["Dates", "format YYYY-MM-DD"],
                            ["Idéal pour", "données complexes avec tableaux imbriqués"],
                            ["Compatible", "Python, R, APIs"],
                          ].map(([label, val]) => (
                            <li key={label} className="flex items-start gap-2">
                              <ArrowRight className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground/60" />
                              <span><strong>{label} :</strong> {val}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        Modes d'import
                      </h4>
                      <div className="grid md:grid-cols-3 gap-3">
                        {[
                          { mode: "Créer", desc: "Ajoute uniquement les nouvelles entrées. Ignore les doublons.", color: "text-green-600" },
                          { mode: "Fusionner", desc: "Met à jour les entrées existantes, ajoute les nouvelles.", color: "text-blue-600" },
                          { mode: "Remplacer", desc: "Remplace complètement les données existantes. Attention : irréversible.", color: "text-red-600" },
                        ].map((m) => (
                          <div key={m.mode} className="p-3 rounded-lg border bg-muted/30">
                            <div className={`font-semibold text-sm ${m.color} mb-1`}>{m.mode}</div>
                            <p className="text-xs text-muted-foreground">{m.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {!isAdmin && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Droits d'administrateur requis</AlertTitle>
                    <AlertDescription>
                      L'import de données est réservé aux comptes administrateurs. L'export et la consultation
                      des modèles sont accessibles sans connexion.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              {/* TAB 2 — FORMATS & MODÈLES */}
              <TabsContent value="formats" className="space-y-6">
                <div className="grid lg:grid-cols-[260px_1fr] gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-3">
                      Entités disponibles
                    </p>
                    {ENTITIES.map((entity) => (
                      <button
                        key={entity.entity}
                        onClick={() => setActiveDocEntity(entity.entity)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all text-sm ${
                          activeDocEntity === entity.entity
                            ? `${entity.bgClass} ${entity.colorClass} font-medium`
                            : "hover:bg-muted/60 text-muted-foreground"
                        }`}
                      >
                        <span className={activeDocEntity === entity.entity ? entity.colorClass : "opacity-60"}>
                          {entity.icon}
                        </span>
                        {entity.label}
                        {activeDocEntity === entity.entity && <ChevronRight className="h-4 w-4 ml-auto" />}
                      </button>
                    ))}
                  </div>

                  {activeEntity && (
                    <div className="space-y-4">
                      <Card className={`border-2 ${activeEntity.borderClass}`}>
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${activeEntity.bgClass}`}>
                              <span className={activeEntity.colorClass}>{activeEntity.icon}</span>
                            </div>
                            <div>
                              <CardTitle>{activeEntity.label}</CardTitle>
                              <CardDescription>{activeEntity.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-5">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-red-500" />
                                Champs obligatoires
                              </h4>
                              <div className="flex flex-wrap gap-1.5">
                                {activeEntity.requiredFields.map((f) => (
                                  <Badge key={f} variant="destructive" className="font-mono text-xs">{f}</Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                                <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                Champs optionnels (principaux)
                              </h4>
                              <div className="flex flex-wrap gap-1.5">
                                {activeEntity.optionalFields.map((f) => (
                                  <Badge key={f} variant="outline" className="font-mono text-xs">{f}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>Note de formatage</AlertTitle>
                            <AlertDescription className="text-sm">{activeEntity.keyNotes}</AlertDescription>
                          </Alert>
                          <div>
                            <h4 className="text-sm font-semibold mb-3">Télécharger le modèle</h4>
                            <div className="flex flex-wrap gap-3">
                              <Button
                                variant="outline" size="sm"
                                onClick={() => downloadTemplate(activeEntity.entity, "csv")}
                                disabled={downloadingEntity === `${activeEntity.entity}-csv`}
                                className="gap-2"
                              >
                                <FileSpreadsheet className="h-4 w-4 text-blue-500" />
                                {downloadingEntity === `${activeEntity.entity}-csv` ? "Téléchargement…" : `Modèle CSV — ${activeEntity.label}`}
                              </Button>
                              <Button
                                variant="outline" size="sm"
                                onClick={() => downloadTemplate(activeEntity.entity, "json")}
                                disabled={downloadingEntity === `${activeEntity.entity}-json`}
                                className="gap-2"
                              >
                                <FileJson className="h-4 w-4 text-purple-500" />
                                {downloadingEntity === `${activeEntity.entity}-json` ? "Téléchargement…" : `Modèle JSON — ${activeEntity.label}`}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>

                <Card className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Télécharger tous les modèles
                    </CardTitle>
                    <CardDescription>Téléchargez les modèles CSV et JSON pour chaque entité en un clic</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {ENTITIES.map((entity) => (
                        <div key={entity.entity} className={`p-3 rounded-lg border ${entity.borderClass} ${entity.bgClass}`}>
                          <div className={`flex items-center gap-2 mb-3 ${entity.colorClass}`}>
                            {entity.icon}
                            <span className="text-xs font-medium text-foreground">{entity.label}</span>
                          </div>
                          <div className="flex gap-1.5">
                            <Button
                              variant="ghost" size="sm" className="flex-1 h-7 text-xs px-2"
                              onClick={() => downloadTemplate(entity.entity, "csv")}
                              disabled={downloadingEntity === `${entity.entity}-csv`}
                            >CSV</Button>
                            <Button
                              variant="ghost" size="sm" className="flex-1 h-7 text-xs px-2"
                              onClick={() => downloadTemplate(entity.entity, "json")}
                              disabled={downloadingEntity === `${entity.entity}-json`}
                            >JSON</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB 3 — IMPORT */}
              <TabsContent value="import" className="space-y-6">
                {!isAdmin && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Connexion administrateur requise</AlertTitle>
                    <AlertDescription>
                      Vous devez être connecté avec un compte administrateur pour importer des données.
                    </AlertDescription>
                  </Alert>
                )}
                <Card>
                  <CardHeader>
                    <CardTitle>Sélectionner le type de données à importer</CardTitle>
                    <CardDescription>
                      Choisissez l'entité correspondant à votre fichier, puis déposez-le dans la zone d'import.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {ENTITIES.map((entity) => (
                        <button
                          key={entity.entity}
                          onClick={() => setActiveImportEntity(entity.entity)}
                          className={`p-3 rounded-lg border-2 transition-all text-left ${
                            activeImportEntity === entity.entity
                              ? `border-primary ${entity.bgClass}`
                              : `border-dashed ${entity.borderClass} hover:${entity.bgClass}`
                          }`}
                        >
                          <div className={`flex items-center gap-2 mb-1.5 ${activeImportEntity === entity.entity ? entity.colorClass : ""}`}>
                            {entity.icon}
                            <span className="font-medium text-sm">{entity.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{entity.description}</p>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {activeImportEntity ? (
                  <ImportFileUpload
                    entity={activeImportEntity}
                    entityLabel={ENTITIES.find((e) => e.entity === activeImportEntity)?.label ?? activeImportEntity}
                    onImportSuccess={() => { toast.success("Import réussi !"); setActiveImportEntity(null); }}
                  />
                ) : (
                  <div className="flex items-center justify-center py-12 border-2 border-dashed rounded-xl text-muted-foreground">
                    <div className="text-center space-y-2">
                      <Upload className="h-10 w-10 mx-auto opacity-30" />
                      <p className="text-sm">Sélectionnez une entité ci-dessus pour commencer l'import</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* TAB 4 — EXPORT */}
              <TabsContent value="export" className="space-y-6">
                <Alert>
                  <Download className="h-4 w-4" />
                  <AlertTitle>Export des données réelles</AlertTitle>
                  <AlertDescription>
                    Exportez les données actuellement en base de données. Les exports Molécules et Plantes
                    sont disponibles en temps réel.
                  </AlertDescription>
                </Alert>
                <div className="grid md:grid-cols-2 gap-4">
                  {ENTITIES.filter((e) => e.exportType !== null).map((entity) => (
                    <Card key={entity.entity} className={`border ${entity.borderClass}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${entity.bgClass}`}>
                            <span className={entity.colorClass}>{entity.icon}</span>
                          </div>
                          <div>
                            <CardTitle className="text-base">{entity.label}</CardTitle>
                            <CardDescription className="text-xs">{entity.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button
                            variant="outline" size="sm" className="flex-1 gap-2"
                            onClick={() => exportRealData(entity.exportType!, "csv")}
                            disabled={downloadingEntity === `export-${entity.exportType}-csv`}
                          >
                            <FileSpreadsheet className="h-4 w-4 text-blue-500" />
                            {downloadingEntity === `export-${entity.exportType}-csv` ? "Export…" : "Export CSV"}
                          </Button>
                          <Button
                            variant="outline" size="sm" className="flex-1 gap-2"
                            onClick={() => exportRealData(entity.exportType!, "json")}
                            disabled={downloadingEntity === `export-${entity.exportType}-json`}
                          >
                            <FileJson className="h-4 w-4 text-purple-500" />
                            {downloadingEntity === `export-${entity.exportType}-json` ? "Export…" : "Export JSON"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Card className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="text-base text-muted-foreground">Exports à venir</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {ENTITIES.filter((e) => e.exportType === null).map((entity) => (
                        <div key={entity.entity} className="flex items-center gap-2 p-2 rounded-lg border border-dashed text-muted-foreground text-sm">
                          <span className="opacity-40">{entity.icon}</span>
                          {entity.label}
                          <Badge variant="secondary" className="ml-auto text-xs">Bientôt</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
    </div>
  );
}
