// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Atom, Droplet, Thermometer, Zap, Sparkles, Leaf, Globe, AlertTriangle, Beaker, MapPin, Shield, ExternalLink, Box, Flame, ArrowRight, GitBranch, Dna, Download, RefreshCw, Star, Wine, Plus, Trash2, Search, BookOpen, Copy, Check, FlaskConical } from "lucide-react";
import { Molecule3DViewer } from "@/components/Molecule3DViewer";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

export function SynergiesTab({ moleculeName, moleculeId }: { moleculeName: string; moleculeId: number }) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Récupérer les synergies par nom de molécule
  const { data: namedSynergies, isLoading: loadingNamed } = trpc.molecularSynergies.getForMolecule.useQuery(
    { moleculeName },
    { enabled: !!moleculeName }
  );

  // Récupérer les synergies depuis la table molecule_synergies (par ID)
  const { data: dbSynergies, isLoading: loadingDb } = trpc.synergies?.getAllMoleculeSynergies.useQuery();

  const isLoading = loadingNamed || loadingDb;

  // Filtrer les synergies DB par ID de molécule
  const filteredDbSynergies = (dbSynergies || []).filter((s: unknown) =>
    s.molecule1Id === moleculeId || s.molecule2Id === moleculeId
  );

  // Combiner et dédupliquer
  const allSynergies = [
    ...(namedSynergies || []).map((s: unknown) => ({
      id: `named-${s.id}`,
      type: s.synergyType || s.type || "potentialisation",
      molecule1: s.molecule1 || moleculeName,
      molecule2: s.molecule2 || s.partnerMolecule,
      description: s.description || s.effect,
      intensity: s.intensity,
      source: s.source || "Données de recherche",
      mechanism: s.mechanism || s.chemicalMechanism,
      application: s.application || s.olfactiveApplication,
      ratio: s.ratio,
    })),
    ...filteredDbSynergies.map((s: unknown) => ({
      id: `db-${s.id}`,
      type: s.type || s.synergyType || "potentialisation",
      molecule1: s.molecule1Name || `Molécule #${s.molecule1Id}`,
      molecule2: s.molecule2Name || `Molécule #${s.molecule2Id}`,
      description: s.description,
      intensity: s.intensity,
      source: s.source,
      mechanism: s.chemicalMechanism,
      application: s.applications || s.olfactiveApplication,
      ratio: s.optimalRatio,
    })),
  ];

  // Dédupliquer par description
  const seen = new Set<string>();
  const uniqueSynergies = allSynergies.filter(s => {
    const key = `${s.molecule1}-${s.molecule2}-${s.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const filtered = activeFilter === "all"
    ? uniqueSynergies
    : uniqueSynergies.filter(s => s.type === activeFilter);

  const typeCount = uniqueSynergies.reduce((acc: Record<string, number>, s) => {
    acc[s.type] = (acc[s.type] || 0) + 1;
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <span className="text-2xl">⚗️</span>
          Synergies Moléculaires
        </h2>
        <p className="text-sm text-muted-foreground">
          Interactions documentées entre <strong>{moleculeName}</strong> et d'autres molécules.
          Ces synergies guident la formulation d'accords olfactifs complexes.
        </p>

        {/* Stats rapides */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
          {Object.entries(SYNERGY_TYPE_CONFIG).map(([type, config]) => (
            <div
              key={type}
              className={`rounded-lg border p-3 text-center cursor-pointer transition-all ${
                activeFilter === type ? config.bg : "bg-muted/30 border-border hover:bg-muted/50"
              }`}
              onClick={() => setActiveFilter(activeFilter === type ? "all" : type)}
            >
              <div className="text-xl mb-1">{config.icon}</div>
              <div className={`text-lg font-bold ${config.color}`}>{typeCount[type] || 0}</div>
              <div className="text-xs text-muted-foreground">{config.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tableau récapitulatif masquage / neutralisation */}
      {(typeCount['masquage'] || 0) + (typeCount['neutralisation'] || 0) > 0 && (
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b bg-muted/30 flex items-center gap-2">
            <span className="text-base">🎭</span>
            <h3 className="font-semibold text-sm">Interactions de masquage &amp; neutralisation</h3>
            <Badge variant="secondary" className="ml-auto text-xs">
              {(typeCount['masquage'] || 0) + (typeCount['neutralisation'] || 0)} interaction{(typeCount['masquage'] || 0) + (typeCount['neutralisation'] || 0) > 1 ? 's' : ''}
            </Badge>
          </div>
          <div className="divide-y divide-border/50">
            {uniqueSynergies
              .filter(s => s.type === 'masquage' || s.type === 'neutralisation')
              .map(s => {
                const config = SYNERGY_TYPE_CONFIG[s.type];
                const partner = s.molecule1 === moleculeName ? s.molecule2 : s.molecule1;
                const isMasker = s.type === 'masquage' && s.molecule1 === moleculeName;
                return (
                  <div key={s.id} className="px-5 py-3 flex items-start gap-4 hover:bg-muted/20 transition-colors">
                    <span className="text-lg shrink-0 mt-0.5">{config.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Link href={`/molecules?search=${encodeURIComponent(partner || '')}`}>
                          <span className={`font-semibold text-sm cursor-pointer hover:underline ${config.color}`}>
                            {partner}
                          </span>
                        </Link>
                        <Badge variant="outline" className={`text-xs ${config.bg} ${config.color}`}>
                          {s.type === 'masquage'
                            ? (isMasker ? `${moleculeName} masque ${partner}` : `${partner} masque ${moleculeName}`)
                            : 'Neutralisation mutuelle'}
                        </Badge>
                      </div>
                      {s.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{s.description}</p>
                      )}
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("all")}
        >
          Toutes ({uniqueSynergies.length})
        </Button>
        {Object.entries(SYNERGY_TYPE_CONFIG).map(([type, config]) =>
          (typeCount[type] || 0) > 0 ? (
            <Button
              key={type}
              variant={activeFilter === type ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(activeFilter === type ? "all" : type)}
              className={activeFilter === type ? "" : "border-border"}
            >
              {config.icon} {config.label} ({typeCount[type]})
            </Button>
          ) : null
        )}
      </div>

      {/* Liste des synergies */}
      {filtered.length === 0 ? (
        <div className="bg-card rounded-lg border p-12 text-center">
          <div className="text-4xl mb-3">⚗️</div>
          <h3 className="text-lg font-medium mb-2">Aucune synergie documentée</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Les synergies moléculaires pour <strong>{moleculeName}</strong> n'ont pas encore été documentées.
            Elles seront ajoutées au fur et à mesure des recherches.
          </p>
          <div className="mt-4">
            <Link href="/recherche-scientifique/synergies-moleculaires">
              <Button variant="outline" size="sm">
                Voir toutes les synergies →
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((synergie) => {
            const config = SYNERGY_TYPE_CONFIG[synergie.type] || SYNERGY_TYPE_CONFIG.potentialisation;
            const partnerMolecule = synergie.molecule1 === moleculeName ? synergie.molecule2 : synergie.molecule1;

            return (
              <div
                key={synergie.id}
                className={`rounded-lg border p-5 ${config.bg}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-100">{moleculeName}</span>
                        <ArrowRight className="h-4 w-4 text-zinc-500" />
                        <Link href={`/molecules?search=${encodeURIComponent(partnerMolecule || "")}`}>
                          <span className={`font-semibold cursor-pointer hover:underline ${config.color}`}>
                            {partnerMolecule || "Molécule partenaire"}
                          </span>
                        </Link>
                      </div>
                      <Badge variant="outline" className={`text-xs mt-1 ${config.bg} ${config.color}`}>
                        {config.label}
                      </Badge>
                    </div>
                  </div>
                  {synergie.intensity && (
                    <div className="flex-shrink-0 text-right">
                      <div className="text-xs text-muted-foreground mb-1">Intensité</div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div
                            key={i}
                            className={`w-2 h-4 rounded-sm ${
                              i <= (synergie.intensity || 0)
                                ? config.color.replace("text-", "bg-")
                                : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {synergie.description && (
                  <p className="text-sm text-zinc-300 mb-3 leading-relaxed">{synergie.description}</p>
                )}

                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  {synergie.mechanism && (
                    <div className="bg-black/20 rounded p-3">
                      <div className="text-xs text-muted-foreground mb-1 font-medium">Mécanisme chimique</div>
                      <div className="text-zinc-300">{synergie.mechanism}</div>
                    </div>
                  )}
                  {synergie.application && (
                    <div className="bg-black/20 rounded p-3">
                      <div className="text-xs text-muted-foreground mb-1 font-medium">Application olfactive</div>
                      <div className="text-zinc-300">{synergie.application}</div>
                    </div>
                  )}
                  {synergie.ratio && (
                    <div className="bg-black/20 rounded p-3">
                      <div className="text-xs text-muted-foreground mb-1 font-medium">Ratio optimal</div>
                      <div className="text-zinc-300">{synergie.ratio}</div>
                    </div>
                  )}
                  {synergie.source && (
                    <div className="bg-black/20 rounded p-3">
                      <div className="text-xs text-muted-foreground mb-1 font-medium">Source</div>
                      <div className="text-zinc-400 text-xs">{synergie.source}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Co-occurrences dans les recettes PERFUMUM */}
      <RecetteSynergiesSection moleculeId={moleculeId} moleculeName={moleculeName} />

      {/* Lien vers la page des synergies */}
      <div className="bg-card rounded-lg border p-4 flex items-center justify-between">
        <div>
          <div className="font-medium text-sm">Explorer toutes les synergies</div>
          <div className="text-xs text-muted-foreground">Heatmap interactive et graphe de corrélations</div>
        </div>
        <Link href="/recherche-scientifique/synergies-moleculaires">
          <Button variant="outline" size="sm">
            Voir la carte des synergies →
          </Button>
        </Link>
      </div>
    </div>
  );
}

