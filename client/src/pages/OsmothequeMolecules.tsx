import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FlaskConical, 
  AlertTriangle, 
  Ban, 
  ShieldAlert, 
  History,
  ExternalLink,
  BookOpen
} from "lucide-react";

type StatusFilter = "all" | "restricted" | "banned" | "regulated";

export default function OsmothequeMolecules() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  
  const { data, isLoading } = trpc.molecules.getOsmotheque.useQuery({
    status: statusFilter,
    limit: 50,
    offset: 0,
  });

  const getStatusIcon = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("interdit") || s.includes("banned")) {
      return <Ban className="h-4 w-4 text-red-500" />;
    }
    if (s.includes("restreint") || s.includes("restricted")) {
      return <ShieldAlert className="h-4 w-4 text-orange-500" />;
    }
    if (s.includes("réglementé") || s.includes("regulated")) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
    return <History className="h-4 w-4 text-muted-foreground" />;
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("interdit") || s.includes("banned")) {
      return "bg-red-500/10 border-red-500/30 text-red-400";
    }
    if (s.includes("restreint") || s.includes("restricted")) {
      return "bg-orange-500/10 border-orange-500/30 text-orange-400";
    }
    if (s.includes("réglementé") || s.includes("regulated")) {
      return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
    }
    return "bg-muted border-border text-muted-foreground";
  };

  const extractHistoricalNotes = (notes: string | null) => {
    if (!notes) return null;
    // Extraire le texte après le statut réglementaire
    const match = notes.match(/\[OSMOTHÈQUE[^\]]*\]\s*(.+)/s);
    return match ? match[1].trim() : null;
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="grid gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FlaskConical className="h-8 w-8 text-amber-500" />
          <h1 className="text-3xl font-bold text-foreground">Osmothèque</h1>
        </div>
        <p className="text-muted-foreground max-w-3xl">
          Collection de molécules historiques de la parfumerie, préservées pour leur importance 
          patrimoniale. Certaines sont aujourd'hui restreintes ou interdites pour des raisons 
          réglementaires (IFRA, REACH), mais leur étude reste essentielle pour comprendre 
          l'évolution de l'art parfumeur.
        </p>
      </div>

      {/* Filtres et statistiques */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="restricted">Restreint</SelectItem>
              <SelectItem value="banned">Interdit</SelectItem>
              <SelectItem value="regulated">Réglementé</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Badge variant="outline" className="text-sm">
          {data?.total || 0} molécules historiques
        </Badge>
      </div>

      {/* Légende des statuts */}
      <Card className="bg-card/30 border-border/50 mb-6">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Ban className="h-4 w-4 text-red-500" />
              <span className="text-muted-foreground">Interdit (usage prohibé)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-orange-500" />
              <span className="text-muted-foreground">Restreint (concentration limitée)</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-muted-foreground">Réglementé (conditions spécifiques)</span>
            </div>
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Historique (statut non défini)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des molécules */}
      {!data?.molecules || data.molecules.length === 0 ? (
        <Card className="bg-card/50 border-border/50">
          <CardContent className="py-12 text-center">
            <FlaskConical className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Aucune molécule osmothèque trouvée avec ce filtre.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {data.molecules.map((molecule: any) => {
            const historicalNotes = extractHistoricalNotes(molecule.notes);
            
            return (
              <Card 
                key={molecule.id} 
                className={`border ${getStatusColor(molecule.regulatoryStatus)} transition-all hover:scale-[1.005]`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(molecule.regulatoryStatus)}
                      <div>
                        <CardTitle className="text-lg text-foreground">
                          {molecule.name}
                        </CardTitle>
                        {molecule.casNumber && (
                          <span className="text-xs text-muted-foreground">
                            CAS: {molecule.casNumber}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className={getStatusColor(molecule.regulatoryStatus)}>
                      {molecule.regulatoryStatus}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Informations chimiques */}
                    <div className="flex flex-wrap gap-2 text-sm">
                      {molecule.family && (
                        <Badge variant="secondary">{molecule.family}</Badge>
                      )}
                      {molecule.chemicalFormula && (
                        <Badge variant="outline" className="font-mono">
                          {molecule.chemicalFormula}
                        </Badge>
                      )}
                      {molecule.molecularWeight && (
                        <Badge variant="outline">
                          {molecule.molecularWeight} g/mol
                        </Badge>
                      )}
                    </div>

                    {/* Profil olfactif */}
                    {molecule.olfactiveProfile && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Profil olfactif:</span>{" "}
                        {molecule.olfactiveProfile}
                      </p>
                    )}

                    {/* Notes historiques */}
                    {historicalNotes && (
                      <div className="bg-muted/30 rounded-lg p-3 mt-2">
                        <div className="flex items-start gap-2">
                          <BookOpen className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                          <p className="text-sm text-muted-foreground">
                            {historicalNotes}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Lien vers la fiche complète */}
                    <div className="pt-2">
                      <Link href={`/molecules/${molecule.id}`}>
                        <Button variant="outline" size="sm" className="gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Voir la fiche complète
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
