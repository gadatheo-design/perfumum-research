// @ts-nocheck
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Loader2, FlaskConical, MapPin, Thermometer, Leaf, Atom, ExternalLink, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  blond: { label: "Blond / Virginia", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  brun: { label: "Brun / Burley", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  oriental: { label: "Oriental", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  experimental: { label: "Expérimental", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
};

export default function TabacDetail() {
  const { id } = useParams<{ id: string }>();
  const tabacId = parseInt(id || "0", 10);

  const { data: tabac, isLoading: loadingTabac } = trpc.tabacs.getById.useQuery(tabacId, {
    enabled: !!tabacId,
  });
  const { data: tabacWithMolecules, isLoading: loadingMolecules } = trpc.tabacs.getWithMolecules.useQuery(tabacId, {
    enabled: !!tabacId,
  });
  const { data: synergies } = trpc.synergies.list.useQuery();

  const tabacSynergies = synergies?.filter((s: any) => s.tabacId === tabacId) || [];

  if (loadingTabac) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!tabac) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <FlaskConical className="h-16 w-16 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">Tabac introuvable (ID: {tabacId})</p>
        <Link href="/tabacotheque">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la Tabacothèque
          </Button>
        </Link>
      </div>
    );
  }

  const typeInfo = TYPE_LABELS[tabac.type] || { label: tabac.type || "Inconnu", color: "bg-muted text-muted-foreground" };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-3 flex items-center gap-3">
          <Link href="/tabacotheque">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Tabacothèque
            </Button>
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">{tabac.name}</span>
        </div>
      </div>

      <div className="container py-8 max-w-5xl">
        {/* Hero */}
        <div className="flex items-start gap-6 mb-8">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <FlaskConical className="h-10 w-10 text-amber-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl font-bold">{tabac.name}</h1>
              <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
            </div>
            {tabac.origin && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{tabac.origin}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="md:col-span-2 space-y-6">
            {/* Profil aromatique */}
            {tabac.aromaticProfile && (() => {
              // Convertir le profil aromatique en tableau de notes
              const raw = tabac.aromaticProfile;
              let notes: string[] = [];
              if (typeof raw === 'string') {
                try {
                  const parsed = JSON.parse(raw);
                  if (Array.isArray(parsed)) notes = parsed.map(String);
                  else if (typeof parsed === 'object') notes = Object.values(parsed).map(String);
                  else notes = [String(parsed)];
                } catch {
                  // Pas du JSON — c'est une string normale
                  notes = [raw];
                }
              } else if (Array.isArray(raw)) {
                notes = raw.map(String);
              } else if (typeof raw === 'object' && raw !== null) {
                notes = Object.values(raw as Record<string, unknown>).map(String);
              } else {
                notes = [String(raw)];
              }
              return (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-emerald-500" />
                      Profil aromatique
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {notes.length === 1 && !notes[0].startsWith('[') ? (
                      <p className="text-muted-foreground leading-relaxed">{notes[0]}</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {notes.map((note, i) => (
                          <Badge key={i} variant="secondary" className="capitalize">{note}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })()}

            {/* Notes internes */}
            {tabac.internalNotes && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    Notes de recherche
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{tabac.internalNotes}</p>
                </CardContent>
              </Card>
            )}

            {/* Molécules */}
            {tabacWithMolecules?.molecules && tabacWithMolecules.molecules.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Atom className="h-4 w-4 text-blue-500" />
                    Molécules caractéristiques
                    <Badge variant="secondary" className="ml-auto">{tabacWithMolecules.molecules.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tabacWithMolecules.molecules.map((mol: any) => (
                      <Link key={mol.id} href={`/molecules/${mol.id}`}>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                          <div>
                            <span className="font-medium text-primary">{mol.name}</span>
                            {mol.family && (
                              <span className="ml-2 text-xs text-muted-foreground">{mol.family}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {mol.percentage_typical && (
                              <span className="font-mono">{mol.percentage_typical}%</span>
                            )}
                            {mol.role && (
                              <Badge variant="outline" className="text-xs">
                                {mol.role === 'majeur' ? 'Majeur' : mol.role === 'secondaire' ? 'Secondaire' : mol.role}
                              </Badge>
                            )}
                            <ExternalLink className="h-3 w-3 opacity-50" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Synergies */}
            {tabacSynergies.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-amber-500" />
                    Synergies documentées
                    <Badge variant="secondary" className="ml-auto">{tabacSynergies.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tabacSynergies.map((syn: any) => (
                      <Link key={syn.id} href="/synergies">
                        <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-medium text-sm">{syn.name}</span>
                            <Badge variant="outline" className="text-xs shrink-0">{syn.type}</Badge>
                          </div>
                          {syn.effet && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{syn.effet}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Colonne latérale */}
          <div className="space-y-4">
            {/* Données techniques */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Données techniques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tabac.type && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Type</p>
                    <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
                  </div>
                )}
                {tabac.origin && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Origine</p>
                    <p className="text-sm font-medium">{tabac.origin}</p>
                  </div>
                )}
                {tabac.intensity && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Intensité</p>
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-red-400" />
                      <span className="text-sm font-medium capitalize">{tabac.intensity}</span>
                    </div>
                  </div>
                )}
                {tabac.idealTemperature && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Température idéale</p>
                    <p className="text-sm font-mono">{tabac.idealTemperature}°C</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation rapide */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Explorer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/tabacotheque">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FlaskConical className="h-4 w-4 mr-2 text-amber-500" />
                    Tabacothèque
                  </Button>
                </Link>
                <Link href="/synergies">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Atom className="h-4 w-4 mr-2 text-blue-500" />
                    Toutes les synergies
                  </Button>
                </Link>
                <Link href="/tabacs-naturels">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Leaf className="h-4 w-4 mr-2 text-emerald-500" />
                    Tabacs naturels
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
