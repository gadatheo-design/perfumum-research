// @ts-nocheck
/**
 * PerfumesTab — Onglet "Parfums emblématiques" de MoleculeDetail
 * Extrait de MoleculeDetail.tsx pour améliorer la maintenabilité
 */
import React from 'react';
import { Loader2, Star, Sparkles, Droplet } from "lucide-react";
import { Wine } from "lucide-react";
import { trpc } from "@/lib/trpc";

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  accord_principal: { label: 'Accord principal', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
  note_coeur: { label: 'Note de cœur', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' },
  note_tete: { label: 'Note de tête', color: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300' },
  note_fond: { label: 'Note de fond', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' },
  signature: { label: 'Molécule signature', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
  ingredient_cle: { label: 'Ingrédient clé', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
};

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
  const byHouse = perfumes?.reduce<Record<string, typeof perfumes>>((acc, p) => {
    if (!acc[p.perfumeHouse]) acc[p.perfumeHouse] = [];
    acc[p.perfumeHouse].push(p);
    return acc;
  }, {});
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
            const count = perfumes?.filter(p => p.roleInPerfume === key).length;
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
              const roleInfo = ROLE_LABELS[p.roleInPerfume] || ROLE_LABELS.ingredient_cle;
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
                      <span>Parfumeur : <span className="font-medium text-foreground">{p.perfumer}</span></span>
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
