import React, { useState, useMemo } from 'react';
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Atom, Droplet, Thermometer, Zap, Sparkles, Leaf, Globe, AlertTriangle, Beaker, MapPin, Shield, ExternalLink, Box, Flame, ArrowRight, GitBranch, Dna, Download, RefreshCw, Star, Wine, Plus, Trash2, Search, BookOpen, Copy, Check, FlaskConical } from "lucide-react";
import { Molecule3DViewer } from "@/components/Molecule3DViewer";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";


interface Structure3DTabProps {
  moleculeId: number;
  moleculeName: string;
  formula?: string | null;
  smiles?: string | null;
  pubchemCid?: number | null;
}

export function Structure3DTab({ moleculeId, moleculeName, formula, smiles, pubchemCid }: Structure3DTabProps) {
  const [viewMode, setViewMode] = useState<"canvas" | "pubchem">("canvas");

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-950/30 to-indigo-950/30 rounded-xl p-5 border border-blue-800/40">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-900/40">
            <Box className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-100">Structure Moléculaire 3D — {moleculeName}</h3>
            <p className="text-sm text-blue-300/80">
              {pubchemCid
                ? "Données structurales validées via PubChem"
                : formula
                ? "Visualisation générée à partir de la formule chimique"
                : "Aucune donnée structurale disponible"}
            </p>
          </div>
        </div>

        {/* Informations structurales */}
        <div className="flex flex-wrap gap-3 mt-3">
          {formula && (
            <div className="flex items-center gap-1.5 bg-blue-900/30 rounded-lg px-3 py-1.5">
              <Atom className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-sm font-mono text-blue-200">{formula}</span>
            </div>
          )}
          {smiles && (
            <div className="flex items-center gap-1.5 bg-indigo-900/30 rounded-lg px-3 py-1.5 max-w-xs overflow-hidden">
              <span className="text-xs text-indigo-300 font-medium shrink-0">SMILES</span>
              <span className="text-xs font-mono text-indigo-200 truncate">{smiles}</span>
            </div>
          )}
          {pubchemCid && (
            <a
              href={`https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemCid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-green-900/30 rounded-lg px-3 py-1.5 hover:bg-green-900/50 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5 text-green-400" />
              <span className="text-xs text-green-300">PubChem CID {pubchemCid}</span>
            </a>
          )}
        </div>
      </div>

      {/* Sélecteur de mode */}
      {pubchemCid && (
        <div className="flex gap-2">
          <Button
            variant={viewMode === "canvas" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("canvas")}
            className="gap-2"
          >
            <Box className="h-4 w-4" />
            Viewer interactif
          </Button>
          <Button
            variant={viewMode === "pubchem" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("pubchem")}
            className="gap-2"
          >
            <Globe className="h-4 w-4" />
            Conformère PubChem 3D
          </Button>
        </div>
      )}

      {/* Viewer Canvas (mode par défaut) */}
      {viewMode === "canvas" && (
        <div className="space-y-4">
          {formula ? (
            <>
              <Molecule3DViewer
                moleculeId={moleculeId}
                moleculeName={moleculeName}
                formula={formula}
                smiles={smiles || undefined}
                showControls={true}
                showInfo={true}
                autoRotate={false}
                height={500}
              />
              <p className="text-xs text-muted-foreground text-center">
                {smiles
                  ? "Structure générée à partir du SMILES. Utilisez la souris pour faire pivoter, la molette pour zoomer."
                  : "Structure approximative générée à partir de la formule brute. Pour une structure précise, consultez PubChem."}
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border rounded-lg bg-muted/20">
              <Box className="h-12 w-12 mb-3 opacity-30" />
              <p className="font-medium">Formule chimique non disponible</p>
              <p className="text-sm mt-1">Ajoutez la formule chimique pour activer la visualisation 3D</p>
            </div>
          )}
        </div>
      )}

      {/* Iframe PubChem 3D Conformer */}
      {viewMode === "pubchem" && pubchemCid && (
        <div className="space-y-3">
          <div className="rounded-xl overflow-hidden border border-border shadow-lg">
            <iframe
              src={`https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemCid}#section=3D-Conformer&embed=true`}
              width="100%"
              height="500"
              className="block"
              title={`Structure 3D PubChem — ${moleculeName}`}
              loading="lazy"
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Conformère 3D officiel PubChem (CID {pubchemCid}) — données validées par le NCBI
          </p>
        </div>
      )}

      {/* Liens externes */}
      <div className="grid sm:grid-cols-3 gap-3">
        {pubchemCid && (
          <a
            href={`https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemCid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors group"
          >
            <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
              <Globe className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium">PubChem</p>
              <p className="text-xs text-muted-foreground">Fiche complète NCBI</p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
          </a>
        )}
        {smiles && (
          <a
            href={`https://www.chemspider.com/Search.aspx?q=${encodeURIComponent(smiles)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors group"
          >
            <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
              <Atom className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium">ChemSpider</p>
              <p className="text-xs text-muted-foreground">Recherche par SMILES</p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
          </a>
        )}
        {formula && (
          <a
            href={`https://www.chemicalbook.com/Search.aspx?kw=${encodeURIComponent(moleculeName)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors group"
          >
            <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
              <Beaker className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium">ChemicalBook</p>
              <p className="text-xs text-muted-foreground">Données physico-chimiques</p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
          </a>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// COMPOSANT ONGLET SYNERGIES MOLÉCULAIRES
// ============================================================================

const SYNERGY_TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string; description: string }> = {
  potentialisation: {
    label: "Potentialisation",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30",
    icon: "⚡",
    description: "Les deux molécules se renforcent mutuellement, amplifiant leur effet olfactif."
  },
  stabilisation: {
    label: "Stabilisation",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/30",
    icon: "🔒",
    description: "L'une des molécules stabilise ou fixe l'autre, prolongeant sa tenue."
  },
  transformation: {
    label: "Transformation",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/30",
    icon: "🔄",
    description: "La combinaison crée un accord olfactif nouveau, différent des deux molécules seules."
  },
  masquage: {
    label: "Masquage",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/30",
    icon: "🎭",
    description: "Une molécule atténue ou masque l'odeur de l'autre."
  },
  neutralisation: {
    label: "Neutralisation",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/30",
    icon: "⊘",
    description: "Les deux molécules s'annulent mutuellement."
  },
};

