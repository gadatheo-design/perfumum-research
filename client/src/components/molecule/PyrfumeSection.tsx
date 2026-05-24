import React, { useState, useMemo } from 'react';
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Atom, Droplet, Thermometer, Zap, Sparkles, Leaf, Globe, AlertTriangle, Beaker, MapPin, Shield, ExternalLink, Box, Flame, ArrowRight, GitBranch, Dna, Download, RefreshCw, Star, Wine, Plus, Trash2, Search, BookOpen, Copy, Check, FlaskConical } from "lucide-react";
import { Molecule3DViewer } from "@/components/Molecule3DViewer";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";


interface PyrfumeDescriptor {
  id: number;
  descriptor: string;
  value?: number | null;
  source?: string | null;
}

interface PyrfumeMappingEntry {
  id: number;
  cid?: string | null;
  iupacName?: string | null;
  smiles?: string | null;
  datasets?: string[] | null;
}

interface PyrfumeIfraEntry {
  id: number;
  category?: string | null;
  maxConcentration?: number | null;
  notes?: string | null;
}

interface SimilarMoleculeEntry {
  id: number;
  name: string;
  similarity?: number | null;
  olfactiveFamily?: string | null;
  odorProfile?: string | null;
}

export function PyrfumeSection({ moleculeId }: { moleculeId: number }) {
  const mapping = trpc.pyrfume.getMappingForMolecule.useQuery({ moleculeId });
  const descriptors = trpc.pyrfume.getDescriptorsForMolecule.useQuery({ moleculeId });
  const ifra = trpc.pyrfume.getIfraForMolecule.useQuery({ moleculeId });

  if (mapping.isLoading) {
    return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Chargement des données Pyrfume...</div>;
  }

  // Préparer les données pour le radar chart
  const radarData = React.useMemo(() => {
    if (!descriptors.data || descriptors.data.length === 0) return [];
    // Agréger par descripteur (prendre la valeur max si plusieurs sources)
    const descMap = new Map<string, number>();
    for (const d of (descriptors.data as PyrfumeDescriptor[])) {
      const current = descMap.get(d.descriptor) || 0;
      descMap.set(d.descriptor, Math.max(current, d.value ?? 1));
    }
    // Trier par valeur et prendre les top 8 pour le radar
    return [...descMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([descriptor, value]) => ({
        descriptor: descriptor.charAt(0).toUpperCase() + descriptor.slice(1),
        value: Math.min(value, 1) * 100, // Normaliser à 100 pour le radar
        fullMark: 100,
      }));
  }, [descriptors.data]);

  return (
    <div className="space-y-6">
      {/* Radar Chart - Profil Olfactif */}
      {radarData.length > 0 && (
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <FlaskConical className="h-4 w-4 text-purple-500" />
            Profil Olfactif
          </h3>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full md:w-1/2" style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                  <PolarGrid stroke="#6b7280" strokeOpacity={0.3} />
                  <PolarAngleAxis
                    dataKey="descriptor"
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    name="Intensité"
                    dataKey="value"
                    stroke="#a855f7"
                    fill="#a855f7"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-2">
              <p className="text-sm font-medium text-muted-foreground mb-2">Descripteurs dominants</p>
              {radarData.slice(0, 5).map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-sm flex-1">{d.descriptor}</span>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${d.value}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">{d.value.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Sources : {[...new Set((descriptors.data || []).map(d => d.dataset))].join(", ")} — via Pyrfume
          </p>
        </div>
      )}

      {/* Molécules similaires par profil olfactif */}
      <SimilarMolecules moleculeId={moleculeId} />

      {/* Mapping Status */}
      <div className="bg-card p-4 rounded-lg border">
        <h3 className="font-semibold flex items-center gap-2 mb-3">
          <FlaskConical className="h-4 w-4 text-purple-500" />
          Intégration Pyrfume
        </h3>
        {mapping.data ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Méthode :</span>
              <span className="ml-1 font-medium">{mapping.data.matchMethod?.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">CID PubChem :</span>
              <a href={`https://pubchem.ncbi.nlm.nih.gov/compound/${mapping.data.pyrfumeCid}`} target="_blank" rel="noopener noreferrer" className="ml-1 text-purple-500 hover:underline">
                {mapping.data.pyrfumeCid}
              </a>
            </div>
            <div>
              <span className="text-muted-foreground">Confiance :</span>
              <span className="ml-1 font-medium">{((mapping.data.confidence || 0) * 100).toFixed(0)}%</span>
            </div>
            {mapping.data.pyrfumeMw && (
              <div>
                <span className="text-muted-foreground">MW :</span>
                <span className="ml-1">{mapping.data.pyrfumeMw.toFixed(2)} g/mol</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Cette molécule n'est pas encore mappée dans Pyrfume.
            <a href="/sources/pyrfume" className="text-purple-500 hover:underline ml-1">Lancer le matching →</a>
          </p>
        )}
      </div>

      {/* All Olfactory Descriptors */}
      {descriptors.data && descriptors.data.length > 0 && (
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-semibold mb-3">Tous les descripteurs ({descriptors.data.length})</h3>
          <div className="flex flex-wrap gap-2">
            {descriptors.data.map((d, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded text-xs">
                {d.descriptor}
                {d.value != null && d.value !== 1 && <span className="opacity-60">({d.value.toFixed(1)})</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* IFRA Restrictions */}
      {ifra.data && ifra.data.length > 0 && (
        <div className="bg-card p-4 rounded-lg border border-amber-200 dark:border-amber-800">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-500" />
            Restrictions IFRA ({ifra.data.length})
          </h3>
          <div className="space-y-2">
            {ifra.data.map((r, i) => (
              <div key={i} className="flex items-center justify-between text-sm border-b pb-1">
                <span>{r.restrictionType} — {r.applicationCategory}</span>
                {r.maxConcentration != null && (
                  <span className="font-medium text-amber-600">{r.maxConcentration}% max</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!mapping.data && (!descriptors.data || descriptors.data.length === 0) && (
        <div className="text-center py-6 text-muted-foreground">
          <FlaskConical className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Aucune donnée Pyrfume disponible pour cette molécule.</p>
          <a href="/sources/pyrfume" className="text-purple-500 hover:underline text-sm">
            Accéder au hub d'intégration Pyrfume →
          </a>
        </div>
      )}
    </div>
  );
}

// Composant Molécules Similaires par profil olfactif
export function SimilarMolecules({ moleculeId }: { moleculeId: number }) {
  const similar = trpc.pyrfume.getSimilarByOlfactiveProfile.useQuery(
    { moleculeId, limit: 5 },
    { enabled: !!moleculeId }
  );

  if (similar.isLoading) {
    return (
      <div className="bg-card p-4 rounded-lg border">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Recherche de molécules similaires...
        </div>
      </div>
    );
  }

  if (!similar.data || similar.data.length === 0) return null;

  return (
    <div className="bg-card p-4 rounded-lg border">
      <h3 className="font-semibold flex items-center gap-2 mb-3">
        <FlaskConical className="h-4 w-4 text-purple-500" />
        Molécules au profil olfactif similaire
      </h3>
      <div className="space-y-2">
        {similar.data.map((mol, i) => (
          <a
            key={mol.moleculeId}
            href={`/molecules/${mol.moleculeId}`}
            className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-muted-foreground w-5">{i + 1}.</span>
              <div>
                <span className="font-medium group-hover:text-purple-500 transition-colors">{mol.name}</span>
                {mol.molecularFormula && (
                  <span className="text-xs text-muted-foreground ml-2">{mol.molecularFormula}</span>
                )}
                {mol.topDescriptors.length > 0 && (
                  <div className="flex gap-1 mt-0.5">
                    {mol.topDescriptors.map((d, j) => (
                      <span key={j} className="text-xs px-1.5 py-0.5 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded">
                        {d}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${mol.similarityPercent}%` }}
                />
              </div>
              <span className="text-xs font-medium text-purple-500 w-10 text-right">
                {mol.similarityPercent}%
              </span>
            </div>
          </a>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Similarité calculée par distance cosinus sur les embeddings olfactifs 50D (Pyrfume)
      </p>
    </div>
  );
}
