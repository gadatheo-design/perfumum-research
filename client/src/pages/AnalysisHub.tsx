import { useState, useEffect, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Link } from 'wouter';
import * as d3 from 'd3';
import { 
  Activity, Atom, BarChart3, Beaker, ChevronRight, Database, 
  FlaskConical, Layers, Search, Target, TrendingUp, Zap,
  FileText
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, trend, color }: { icon: any; label: string; value: number | string; trend?: string; color: string }) {
  return (
    <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
          {trend && (
            <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              {trend}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickAccessCard({ href, icon: Icon, title, description, color, badge }: { href: string; icon: any; title: string; description: string; color: string; badge?: string }) {
  return (
    <Link href={href}>
      <Card className="h-full hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer group">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold group-hover:text-primary transition-colors">{title}</h3>
                {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function AnalysisHub() {
  const { data: chromatograms } = trpc.tobacco.getChromatograms.useQuery();
  const { data: msSpectra } = trpc.tobacco.getMsSpectra.useQuery();
  // `tobacco` n'expose pas de `getAll` : la procédure des landraces est
  // `getLandraces`, et elle renvoie une enveloppe { success, data }.
  const { data: landracesResponse } = trpc.tobacco.getLandraces.useQuery();
  const landraces = landracesResponse?.data;
  
  const stats = {
    chromatograms: chromatograms?.length || 0,
    spectra: msSpectra?.length || 0,
    landraces: landraces?.length || 0,
    compounds: msSpectra?.length || 0,
  };
  
  const recentCompounds = msSpectra?.slice(0, 5) || [];
  
  return (
    <div className="min-h-screen bg-background">
      <Breadcrumbs />
      
      <div className="container py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-violet-500/20 text-violet-400">
              <Activity className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold">Hub Analyse GC-MS</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Centre de contrôle pour l'analyse chromatographique et spectrométrique. 
            Accédez à tous les outils d'analyse, visualisez les statistiques et explorez les données.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={BarChart3} label="Chromatogrammes" value={stats.chromatograms} color="bg-emerald-500/20 text-emerald-400" />
          <StatCard icon={Atom} label="Spectres MS" value={stats.spectra} trend="+19 NIST" color="bg-violet-500/20 text-violet-400" />
          <StatCard icon={FlaskConical} label="Composés identifiés" value={stats.compounds} color="bg-pink-500/20 text-pink-400" />
          <StatCard icon={Database} label="Landraces analysées" value={stats.landraces} color="bg-amber-500/20 text-amber-400" />
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Accès Rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickAccessCard href="/gcms-chromatograms" icon={BarChart3} title="Chromatogrammes GC-MS" description="Visualiser et analyser les profils chromatographiques" color="bg-emerald-500/20 text-emerald-400" />
            <QuickAccessCard href="/ms-spectra" icon={Atom} title="Spectres de Masse" description="Explorer la bibliothèque de spectres MS" color="bg-violet-500/20 text-violet-400" badge="67 spectres" />
            <QuickAccessCard href="/compare-spectra" icon={Layers} title="Comparer des Spectres" description="Superposer jusqu'à 3 spectres pour analyse" color="bg-pink-500/20 text-pink-400" />
            <QuickAccessCard href="/identify-spectrum" icon={Target} title="Identifier un Spectre" description="Identifier un composé inconnu" color="bg-amber-500/20 text-amber-400" badge="Import fichiers" />
            <QuickAccessCard href="/search-compound" icon={Search} title="Recherche par Composé" description="Trouver les landraces par composé" color="bg-cyan-500/20 text-cyan-400" />
            <QuickAccessCard href="/tobacco-landraces" icon={Beaker} title="Fiches Landraces" description="Fiches détaillées avec chromatographie" color="bg-indigo-500/20 text-indigo-400" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-pink-500" />
                Spectres Récents
              </CardTitle>
              <CardDescription>Derniers composés ajoutés à la base</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentCompounds.map((compound: any) => (
                  <div key={compound.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Atom className="h-4 w-4 text-violet-500" />
                      <div>
                        <div className="font-medium">{compound.compound_name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{compound.molecular_formula}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">{compound.source}</Badge>
                  </div>
                ))}
                {recentCompounds.length === 0 && <div className="text-center py-8 text-muted-foreground">Chargement...</div>}
              </div>
              <Link href="/ms-spectra"><Button variant="outline" className="w-full mt-4">Voir tous les spectres<ChevronRight className="h-4 w-4 ml-2" /></Button></Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Ressources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <h4 className="font-medium mb-2">Formats supportés</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">.msp</Badge>
                    <Badge variant="secondary">.jdx</Badge>
                    <Badge variant="secondary">.csv</Badge>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <h4 className="font-medium mb-2">Base de référence</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-500 font-semibold">67</span>
                    <span className="text-muted-foreground">spectres NIST + expérimentaux</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <h4 className="font-medium mb-2">Algorithme</h4>
                  <div className="text-sm text-muted-foreground">Similarité cosinus pondérée + tolérance m/z</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
