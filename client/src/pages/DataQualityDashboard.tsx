import { useState } from "react";
import { Link } from "wouter";
import {
  ChevronRight, RefreshCw, CheckCircle2, AlertCircle, Clock, 
  FlaskConical, Leaf, Cigarette, Droplets, BookOpen, Network, 
  BarChart3, TrendingUp, AlertTriangle, Info, ExternalLink
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { trpc } from "@/lib/trpc";

// Calcul du score de qualité global
function calcGlobalScore(m: any): number {
  if (!m) return 0;
  const scores = [
    // Molécules
    pct(m.molecules?.with_cas, m.molecules?.total),
    pct(m.molecules?.with_smiles, m.molecules?.total),
    pct(m.molecules?.validated, m.molecules?.total),
    // Tabacs
    pct(m.tabacs?.with_terroir, m.tabacs?.total),
    // Cigarillos
    pct(m.cigarillos?.with_terpene, m.cigarillos?.total),
    // Accords
    pct(m.accords?.with_desc, m.accords?.total),
    // Plants
    pct(m.plants?.with_latin, m.plants?.total),
    pct(m.plants?.with_family, m.plants?.total),
  ];
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function pct(val: any, total: any): number {
  const v = Number(val ?? 0);
  const t = Number(total ?? 0);
  if (t === 0) return 0;
  return Math.round((v / t) * 100);
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
}

function progressColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  if (score >= 40) return "bg-orange-500";
  return "bg-red-500";
}

function ScoreCircle({ score, size = "lg" }: { score: number; size?: "sm" | "lg" }) {
  const color = scoreColor(score);
  const radius = size === "lg" ? 40 : 24;
  const stroke = size === "lg" ? 6 : 4;
  const cx = radius + stroke;
  const cy = radius + stroke;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={cx * 2} height={cy * 2} className="-rotate-90">
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-muted/30" />
        <circle
          cx={cx} cy={cy} r={radius} fill="none"
          stroke="currentColor" strokeWidth={stroke}
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          className={color}
        />
      </svg>
      <span className={`absolute text-${size === "lg" ? "2xl" : "sm"} font-bold ${color}`}>
        {score}%
      </span>
    </div>
  );
}

interface MetricRowProps {
  label: string;
  value: number;
  total: number;
  tooltip?: string;
  link?: string;
}

function MetricRow({ label, value, total, tooltip, link }: MetricRowProps) {
  const score = pct(value, total);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">{label}</span>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3 h-3 text-muted-foreground/50" />
                </TooltipTrigger>
                <TooltipContent><p className="text-xs max-w-48">{tooltip}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-mono font-bold ${scoreColor(score)}`}>{score}%</span>
          <span className="text-xs text-muted-foreground">({value}/{total})</span>
          {link && (
            <Link href={link}>
              <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-primary cursor-pointer" />
            </Link>
          )}
        </div>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${progressColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function DataQualityDashboard() {
  const { data: metrics, isLoading, refetch, dataUpdatedAt } = trpc.dataQuality.getMetrics.useQuery(undefined, {
    refetchInterval: 60_000, // auto-refresh toutes les 60s
  });

  const globalScore = calcGlobalScore(metrics);
  const lastUpdate = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString("fr-FR") : "—";

  // Alertes critiques
  const alerts: { level: "error" | "warning" | "info"; message: string; link?: string }[] = [];
  if (metrics) {
    const molCasScore = pct(metrics.molecules?.with_cas, metrics.molecules?.total);
    const molSmilesScore = pct(metrics.molecules?.with_smiles, metrics.molecules?.total);
    const molValidScore = pct(metrics.molecules?.validated, metrics.molecules?.total);
    if (molCasScore < 60) alerts.push({ level: "error", message: `${100 - molCasScore}% des molécules sans numéro CAS`, link: "/molecules" });
    if (molSmilesScore < 30) alerts.push({ level: "warning", message: `${100 - molSmilesScore}% des molécules sans SMILES`, link: "/molecules" });
    if (molValidScore < 50) alerts.push({ level: "warning", message: `${Number(metrics.molecules?.draft ?? 0)} molécules en statut "brouillon"`, link: "/molecules" });
    if (Number(metrics.plants?.total ?? 0) > 0 && pct(metrics.plants?.with_latin, metrics.plants?.total) < 80) {
      alerts.push({ level: "info", message: "Certaines plantes manquent de nom latin" });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumbs */}
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Accueil</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/admin" className="hover:text-foreground transition-colors">Admin</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Qualité des données</span>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord — Qualité des Données</h1>
            </div>
            <p className="text-muted-foreground">
              Métriques en temps réel de la base de données PERFUMUM · Mise à jour automatique toutes les 60s
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Dernière actualisation : {lastUpdate}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
        </div>

        {/* Score global */}
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center gap-8 flex-wrap">
              <div className="flex flex-col items-center gap-2">
                <ScoreCircle score={globalScore} size="lg" />
                <span className="text-sm font-medium text-muted-foreground">Score global</span>
              </div>
              <div className="flex-1 space-y-2">
                <h2 className="text-xl font-bold">
                  {globalScore >= 80 ? "Qualité excellente" :
                   globalScore >= 60 ? "Qualité satisfaisante" :
                   globalScore >= 40 ? "Qualité à améliorer" :
                   "Qualité insuffisante"}
                </h2>
                <p className="text-muted-foreground text-sm">
                  Score calculé sur 8 métriques clés : CAS, SMILES, validation molécules, terroirs tabacs, 
                  profils terpéniques, descriptions accords, noms latins et familles botaniques.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="text-green-600 border-green-500/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {Number(metrics?.molecules?.validated ?? 0)} molécules validées
                  </Badge>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-500/30">
                    <Clock className="w-3 h-3 mr-1" />
                    {Number(metrics?.molecules?.in_review ?? 0)} en révision
                  </Badge>
                  <Badge variant="outline" className="text-red-600 border-red-500/30">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {Number(metrics?.molecules?.draft ?? 0)} brouillons
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alertes */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Alertes qualité ({alerts.length})
            </h3>
            {alerts.map((alert, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm ${
                  alert.level === "error" ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400" :
                  alert.level === "warning" ? "bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-950/20 dark:border-yellow-900 dark:text-yellow-400" :
                  "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900 dark:text-blue-400"
                }`}
              >
                {alert.level === "error" ? <AlertCircle className="w-4 h-4 shrink-0" /> :
                 alert.level === "warning" ? <AlertTriangle className="w-4 h-4 shrink-0" /> :
                 <Info className="w-4 h-4 shrink-0" />}
                <span className="flex-1">{alert.message}</span>
                {alert.link && (
                  <Link href={alert.link}>
                    <span className="text-xs underline cursor-pointer">Corriger →</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Grille des métriques par domaine */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {/* Molécules */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FlaskConical className="w-5 h-5 text-blue-500" />
                Molécules
                <Badge variant="secondary" className="ml-auto">{Number(metrics?.molecules?.total ?? 0)}</Badge>
              </CardTitle>
              <CardDescription>Base moléculaire principale</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <MetricRow
                label="Numéro CAS"
                value={Number(metrics?.molecules?.with_cas ?? 0)}
                total={Number(metrics?.molecules?.total ?? 1)}
                tooltip="Identifiant chimique universel (Chemical Abstracts Service)"
                link="/molecules"
              />
              <MetricRow
                label="SMILES"
                value={Number(metrics?.molecules?.with_smiles ?? 0)}
                total={Number(metrics?.molecules?.total ?? 1)}
                tooltip="Notation SMILES pour la structure moléculaire 2D/3D"
                link="/molecules"
              />
              <MetricRow
                label="Classe chimique"
                value={Number(metrics?.molecules?.with_class ?? 0)}
                total={Number(metrics?.molecules?.total ?? 1)}
                tooltip="Famille chimique (terpène, ester, aldéhyde...)"
              />
              <MetricRow
                label="Enrichissement PubChem"
                value={Number(metrics?.molecules?.with_pubchem ?? 0)}
                total={Number(metrics?.molecules?.total ?? 1)}
                tooltip="Données enrichies via l'API PubChem"
              />
              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground">
                  {Number(metrics?.molecules?.distinct_families ?? 0)} familles distinctes normalisées
                </div>
              </div>
              {/* Validation breakdown */}
              <div className="pt-2 border-t space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Statut de validation</div>
                <div className="flex gap-2 text-xs">
                  <div className="flex-1 text-center p-2 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-900">
                    <div className="font-bold text-green-600">{Number(metrics?.molecules?.validated ?? 0)}</div>
                    <div className="text-green-600/70">Validées</div>
                  </div>
                  <div className="flex-1 text-center p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded border border-yellow-200 dark:border-yellow-900">
                    <div className="font-bold text-yellow-600">{Number(metrics?.molecules?.in_review ?? 0)}</div>
                    <div className="text-yellow-600/70">En révision</div>
                  </div>
                  <div className="flex-1 text-center p-2 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-900">
                    <div className="font-bold text-red-600">{Number(metrics?.molecules?.draft ?? 0)}</div>
                    <div className="text-red-600/70">Brouillon</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plantes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Leaf className="w-5 h-5 text-green-500" />
                Plantes
                <Badge variant="secondary" className="ml-auto">{Number(metrics?.plants?.total ?? 0)}</Badge>
              </CardTitle>
              <CardDescription>Catalogue botanique</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <MetricRow
                label="Nom latin"
                value={Number(metrics?.plants?.with_latin ?? 0)}
                total={Number(metrics?.plants?.total ?? 1)}
                tooltip="Nomenclature binomiale (Genre espèce)"
                link="/plantes"
              />
              <MetricRow
                label="Famille botanique"
                value={Number(metrics?.plants?.with_family ?? 0)}
                total={Number(metrics?.plants?.total ?? 1)}
                tooltip="Famille taxonomique (Lamiaceae, Apiaceae...)"
                link="/plantes"
              />
              <MetricRow
                label="Plantes validées"
                value={Number(metrics?.plants?.validated ?? 0)}
                total={Number(metrics?.plants?.total ?? 1)}
                tooltip="Plantes avec statut 'valide'"
              />
              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground">
                  {Number(metrics?.plantMolecules?.plants_with_molecules ?? 0)} plantes avec profil moléculaire
                  ({Number(metrics?.plantMolecules?.total ?? 0)} liaisons plante-molécule)
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabacs */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Cigarette className="w-5 h-5 text-amber-500" />
                Tabacs
                <Badge variant="secondary" className="ml-auto">{Number(metrics?.tabacs?.total ?? 0)}</Badge>
              </CardTitle>
              <CardDescription>Variétés & terroirs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <MetricRow
                label="Lien terroir"
                value={Number(metrics?.tabacs?.with_terroir ?? 0)}
                total={Number(metrics?.tabacs?.total ?? 1)}
                tooltip="Tabac lié à un terroir géographique documenté"
                link="/tabacs-resines"
              />
              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground">
                  Couverture terroir : {pct(metrics?.tabacs?.with_terroir, metrics?.tabacs?.total)}%
                </div>
                <div className="mt-2">
                  <Link href="/tabacs-resines">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Voir le catalogue tabacs
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recettes Cigarillos */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="w-5 h-5 text-orange-500" />
                Recettes Cigarillos
                <Badge variant="secondary" className="ml-auto">{Number(metrics?.cigarillos?.total ?? 0)}</Badge>
              </CardTitle>
              <CardDescription>Formulations combustibles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <MetricRow
                label="Profil terpénique"
                value={Number(metrics?.cigarillos?.with_terpene ?? 0)}
                total={Number(metrics?.cigarillos?.total ?? 1)}
                tooltip="Recette avec profil terpénique documenté"
                link="/recettes-cigarillos"
              />
              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground">
                  Couverture : {pct(metrics?.cigarillos?.with_terpene, metrics?.cigarillos?.total)}%
                </div>
                <div className="mt-2">
                  <Link href="/recettes-cigarillos">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Voir les recettes
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accords */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Droplets className="w-5 h-5 text-purple-500" />
                Accords Olfactifs
                <Badge variant="secondary" className="ml-auto">{Number(metrics?.accords?.total ?? 0)}</Badge>
              </CardTitle>
              <CardDescription>Accords atmosphériques</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <MetricRow
                label="Description renseignée"
                value={Number(metrics?.accords?.with_desc ?? 0)}
                total={Number(metrics?.accords?.total ?? 1)}
                tooltip="Accord avec description olfactive documentée"
                link="/accords"
              />
              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground">
                  Couverture : {pct(metrics?.accords?.with_desc, metrics?.accords?.total)}%
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Synergies & Recettes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Network className="w-5 h-5 text-cyan-500" />
                Synergies & Recettes
              </CardTitle>
              <CardDescription>Interactions moléculaires documentées</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-cyan-500">{Number(metrics?.synergies?.total ?? 0)}</div>
                  <div className="text-xs text-muted-foreground mt-1">Synergies moléculaires</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-500">{Number(metrics?.recipes?.total ?? 0)}</div>
                  <div className="text-xs text-muted-foreground mt-1">Recettes générales</div>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground">
                  {Number(metrics?.plantMolecules?.total ?? 0)} liaisons plante-molécule documentées
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommandations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Prochaines étapes recommandées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  priority: "Haute",
                  color: "border-l-red-500",
                  title: "Enrichissement PubChem",
                  desc: `${Number(metrics?.molecules?.draft ?? 0)} molécules sans CAS/SMILES à enrichir via l'API PubChem`,
                  link: "/admin/import",
                  score: pct(metrics?.molecules?.with_cas, metrics?.molecules?.total),
                },
                {
                  priority: "Haute",
                  color: "border-l-orange-500",
                  title: "Validation des molécules",
                  desc: `${Number(metrics?.molecules?.in_review ?? 0)} molécules en révision à valider ou rejeter`,
                  link: "/molecules",
                  score: pct(metrics?.molecules?.validated, metrics?.molecules?.total),
                },
                {
                  priority: "Moyenne",
                  color: "border-l-yellow-500",
                  title: "Profils moléculaires plantes",
                  desc: `Compléter les liaisons plante-molécule pour les plantes sans profil`,
                  link: "/plantes",
                  score: pct(metrics?.plantMolecules?.plants_with_molecules, metrics?.plants?.total),
                },
                {
                  priority: "Basse",
                  color: "border-l-green-500",
                  title: "SMILES manquants",
                  desc: `${Number(metrics?.molecules?.total ?? 0) - Number(metrics?.molecules?.with_smiles ?? 0)} molécules sans structure SMILES`,
                  link: "/molecules",
                  score: pct(metrics?.molecules?.with_smiles, metrics?.molecules?.total),
                },
              ].map((rec, i) => (
                <div key={i} className={`border-l-4 ${rec.color} pl-4 py-2`}>
                  <div className="flex items-center justify-between mb-1">
                    <Badge
                      variant="outline"
                      className={
                        rec.priority === "Haute" ? "text-red-600 border-red-300" :
                        rec.priority === "Moyenne" ? "text-yellow-600 border-yellow-300" :
                        "text-green-600 border-green-300"
                      }
                    >
                      {rec.priority}
                    </Badge>
                    <span className={`text-sm font-bold ${scoreColor(rec.score)}`}>{rec.score}%</span>
                  </div>
                  <div className="font-medium text-sm">{rec.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{rec.desc}</div>
                  {rec.link && (
                    <Link href={rec.link}>
                      <span className="text-xs text-primary hover:underline cursor-pointer mt-1 inline-block">
                        Accéder →
                      </span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground py-4 border-t">
          Tableau de bord PERFUMUM · Données calculées en temps réel · 
          Généré le {metrics?.generatedAt ? new Date(metrics.generatedAt).toLocaleString("fr-FR") : "—"}
        </div>
      </div>
    </div>
  );
}
