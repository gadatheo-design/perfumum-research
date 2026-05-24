/**
 * PerfumesTab — Onglet "Parfums emblématiques" de MoleculeDetail
 * Extrait de MoleculeDetail.tsx pour améliorer la maintenabilité
 */
import React from 'react';
import { Loader2, Star, Sparkles, Droplet } from "lucide-react";
import { Wine } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { ROLE_LABELS } from './molecule-constants';




// Types de données retournées par getPerfumes
interface PerfumePerfumer {
  id: number;
  name: string;
  house?: string | null;
}
interface PerfumeEntry {
  id: number;
  name?: string | null;
  perfumeName?: string | null;
  house?: string | null;
  perfumeHouse?: string | null;
  year?: number | null;
  role?: string | null;
  roleInPerfume?: string | null;
  concentration?: string | null;
  notes?: string | null;
  description?: string | null;
  perfumer?: PerfumePerfumer | null;
}

interface PerfumesTabProps {
  moleculeId: number;
  moleculeName: string;
}

export function PerfumesTab({ moleculeId, moleculeName }: { moleculeId: number; moleculeName: string }) {
  const { data: perfumes, isLoading } = trpc.molecules.getPerfumes.useQuery({ moleculeId });
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!perfumes || perfumes?.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Wine className="h-12 w-12 mx-auto mb-3 opacity-40" />
        <p className="font-medium">Aucun parfum emblématique répertorié</p>
        <p className="text-sm mt-2 max-w-sm mx-auto">
          Les parfums contenant {moleculeName} seront ajoutés progressivement.
        </p>
      </div>
    );
  }
  const byHouse = (perfumes as unknown as PerfumeEntry[])?.reduce<Record<string, PerfumeEntry[]>>((acc, p) => {
    const house = p.perfumeHouse ?? p.house ?? 'Maison inconnue';
    if (!acc[house]) acc[house] = [];
    acc[house].push(p);
    return acc;
  }, {}) ?? {};
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-50 to-rose-50 dark:from-amber-950/20 dark:to-rose-950/20 rounded-xl p-5 border border-amber-200/60 dark:border-amber-800/40">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40">
            <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-900 dark:text-amber-100">
              {perfumes?.length} parfum{perfumes?.length > 1 ? 's' : ''} emblématique{perfumes?.length > 1 ? 's' : ''}
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              {moleculeName} est présent dans ces créations de référence
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {Object.entries(ROLE_LABELS).map(([key, { label, color }]) => {
            const count = (perfumes as unknown as PerfumeEntry[])?.filter(p => p.roleInPerfume === key).length ?? 0;
            if (count === 0) return null;
            return (
              <span key={key} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
                {label} ×{count}
              </span>
            );
          })}
        </div>
      </div>
      {Object.entries(byHouse).map(([house, items]) => (
        <div key={house} className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-1">{house}</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map(p => {
              const roleInfo = ROLE_LABELS[p.roleInPerfume ?? ''] ?? ROLE_LABELS['ingredient_cle'];
              return (
                <div key={p.id} className="rounded-xl border bg-card p-4 space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="font-semibold text-base leading-tight">{p.perfumeName}</h5>
                      <p className="text-sm text-muted-foreground">{p.perfumeHouse}{p.year ? ` — ${p.year}` : ''}</p>
                    </div>
                    <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleInfo.color}`}>
                      {roleInfo.label}
                    </span>
                  </div>
                  {p.perfumer && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Parfumeur : <span className="font-medium text-foreground">{typeof p.perfumer === 'object' ? (p.perfumer as PerfumePerfumer).name : String(p.perfumer)}</span></span>
                    </div>
                  )}
                  {p.concentration && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Droplet className="h-3.5 w-3.5" />
                      <span>Concentration : <span className="font-medium text-foreground">{p.concentration}</span></span>
                    </div>
                  )}
                  {p.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed border-t pt-2">{p.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div className="text-xs text-muted-foreground text-center pt-2">
        Sources : Luca Turin &amp; Tania Sanchez « Perfumes: The Guide » (2008), Fragrantica, Osmathèque, Arctander (1969)
      </div>
    </div>
  );
}
