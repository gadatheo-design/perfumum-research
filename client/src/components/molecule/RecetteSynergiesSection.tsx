// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Atom, Droplet, Thermometer, Zap, Sparkles, Leaf, Globe, AlertTriangle, Beaker, MapPin, Shield, ExternalLink, Box, Flame, ArrowRight, GitBranch, Dna, Download, RefreshCw, Star, Wine, Plus, Trash2, Search, BookOpen, Copy, Check, FlaskConical } from "lucide-react";
import { Molecule3DViewer } from "@/components/Molecule3DViewer";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

export function RecetteSynergiesSection({ moleculeId, moleculeName }: { moleculeId: number; moleculeName: string }) {
  const { data: synergies, isLoading } = trpc.molecules.getSynergies.useQuery(
    { moleculeId, limit: 10 },
    { enabled: !!moleculeId }
  );

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🧪</span>
          <h3 className="font-semibold text-sm">Co-occurrences dans les recettes PERFUMUM</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!synergies || synergies?.length === 0) return null;

  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <div className="px-5 py-3 border-b bg-muted/30 flex items-center gap-2">
        <span className="text-base">🧪</span>
        <h3 className="font-semibold text-sm">Co-occurrences dans les recettes PERFUMUM</h3>
        <Badge variant="secondary" className="ml-auto text-xs">
          {synergies?.length} molécule{synergies?.length > 1 ? 's' : ''} associée{synergies?.length > 1 ? 's' : ''}
        </Badge>
      </div>
      <p className="px-5 py-2 text-xs text-muted-foreground border-b">
        Molécules fréquemment utilisées dans les mêmes recettes que <strong>{moleculeName}</strong> — basé sur les {synergies[0]?.recettes ? synergies[0].recettes.split(',').length : ''} recettes PERFUMUM.
      </p>
      <div className="divide-y divide-border/50">
        {synergies?.map((syn, idx) => (
          <div key={syn.id} className="px-5 py-3 flex items-center gap-4 hover:bg-muted/20 transition-colors">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link href={`/molecules/${syn.id}`}>
                  <span className="font-medium text-sm hover:underline cursor-pointer text-primary">{syn.name}</span>
                </Link>
                {syn.family && (
                  <Badge variant="outline" className="text-xs">{syn.family}</Badge>
                )}
              </div>
              {syn.recettes && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate" title={syn.recettes}>
                  Recettes : {syn.recettes}
                </p>
              )}
            </div>
            <div className="shrink-0 text-right">
              <div className="text-lg font-bold text-primary">{syn.co_occurrences}</div>
              <div className="text-xs text-muted-foreground">recette{syn.co_occurrences > 1 ? 's' : ''}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ============================================================================
// PYRFUME SECTION — Descripteurs olfactifs open-source
// ============================================================================
