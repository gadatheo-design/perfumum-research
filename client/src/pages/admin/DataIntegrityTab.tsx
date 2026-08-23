import { trpc } from "@/lib/trpc";
import { AlertTriangle, Database, FlaskConical, Leaf, Link2Off, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OrphanReassociationDialog } from "./OrphanReassociationDialog";
import { useState } from "react";

type ReassociationTarget = {
  kind: "plant" | "molecule";
  linkId: number;
  descriptorId: string;
  descriptorName: string | null;
  archivedName: string;
};

function EmptyState() {
  return (
    <div className="py-12 text-center text-muted-foreground">
      <Database className="mx-auto mb-3 h-8 w-8 opacity-40" />
      <p className="font-medium text-foreground">Aucun lien orphelin détecté</p>
      <p className="mt-1 text-sm">Les associations de descripteurs pointent toutes vers des entités existantes.</p>
    </div>
  );
}

export function DataIntegrityTab() {
  const integrityQuery = trpc.descriptorLinks.getIntegrityReport.useQuery();
  const [reassociationTarget, setReassociationTarget] = useState<ReassociationTarget | null>(null);
  const report = integrityQuery.data;
  const plantLinks = report?.orphanPlantLinks ?? [];
  const moleculeLinks = report?.orphanMoleculeLinks ?? [];
  const total = plantLinks.length + moleculeLinks.length;

  if (integrityQuery.isLoading) {
    return (
      <div className="flex justify-center py-16">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (integrityQuery.error) {
    return (
      <Card className="border-destructive/40">
        <CardContent className="flex gap-3 pt-6 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium">Le rapport d’intégrité n’a pas pu être chargé.</p>
            <p className="mt-1 text-muted-foreground">Vérifiez que vous êtes connecté avec un compte administrateur, puis réessayez.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Link2Off className="h-5 w-5 text-amber-600" />
              Intégrité des associations
            </CardTitle>
            <CardDescription className="mt-1 max-w-2xl">
              Associations historiques dont la plante ou molécule cible n’existe plus. Ce panneau est en lecture seule : aucune donnée n’est supprimée automatiquement.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => integrityQuery.refetch()}>
            <RefreshCw className="h-3.5 w-3.5" />
            Actualiser
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Badge variant={total ? "destructive" : "secondary"} className="gap-1.5 px-3 py-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              {total} lien{total > 1 ? "s" : ""} à examiner
            </Badge>
            <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
              <Leaf className="h-3.5 w-3.5 text-emerald-600" />
              {plantLinks.length} plante{plantLinks.length > 1 ? "s" : ""}
            </Badge>
            <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
              <FlaskConical className="h-3.5 w-3.5 text-violet-600" />
              {moleculeLinks.length} molécule{moleculeLinks.length > 1 ? "s" : ""}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {total === 0 ? <EmptyState /> : (
        <div className="grid gap-5 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Leaf className="h-4 w-4 text-emerald-600" /> Liens plante-descripteur</CardTitle>
              <CardDescription>La fiche plante référencée n’est plus disponible.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {plantLinks.length === 0 ? <p className="px-6 pb-6 text-sm text-muted-foreground">Aucun lien plante orphelin.</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-y bg-muted/30 text-left text-xs text-muted-foreground">
                      <tr><th className="px-4 py-2.5 font-medium">Descripteur</th><th className="px-4 py-2.5 font-medium">Plante archivée</th><th className="px-4 py-2.5 font-medium">Source</th><th className="px-4 py-2.5 font-medium">Action</th></tr>
                    </thead>
                    <tbody>
                      {plantLinks.map((link) => (
                        <tr key={link.id} className="border-b last:border-0">
                          <td className="px-4 py-3"><p className="font-medium">{link.descriptorName || link.descriptorId}</p><p className="font-mono text-xs text-muted-foreground">{link.descriptorId}</p></td>
                          <td className="px-4 py-3"><p>{link.commonName || "Nom non archivé"}</p><p className="italic text-xs text-muted-foreground">{link.latinName || `ID ${link.plantId}`}</p></td>
                          <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{link.source || "inconnue"}</Badge></td>
                          <td className="px-4 py-3"><Button size="sm" variant="outline" onClick={() => setReassociationTarget({ kind: "plant", linkId: link.id, descriptorId: link.descriptorId, descriptorName: link.descriptorName, archivedName: link.commonName || link.latinName || `ID ${link.plantId}` })}>Réassocier</Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><FlaskConical className="h-4 w-4 text-violet-600" /> Liens molécule-descripteur</CardTitle>
              <CardDescription>La fiche molécule référencée n’est plus disponible.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {moleculeLinks.length === 0 ? <p className="px-6 pb-6 text-sm text-muted-foreground">Aucun lien molécule orphelin.</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-y bg-muted/30 text-left text-xs text-muted-foreground">
                      <tr><th className="px-4 py-2.5 font-medium">Descripteur</th><th className="px-4 py-2.5 font-medium">Molécule archivée</th><th className="px-4 py-2.5 font-medium">Source</th><th className="px-4 py-2.5 font-medium">Action</th></tr>
                    </thead>
                    <tbody>
                      {moleculeLinks.map((link) => (
                        <tr key={link.id} className="border-b last:border-0">
                          <td className="px-4 py-3"><p className="font-medium">{link.descriptorName || link.descriptorId}</p><p className="font-mono text-xs text-muted-foreground">{link.descriptorId}</p></td>
                          <td className="px-4 py-3"><p>{link.moleculeName || "Nom non archivé"}</p><p className="font-mono text-xs text-muted-foreground">{link.casNumber || `ID ${link.moleculeId}`}</p></td>
                          <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{link.source || "inconnue"}</Badge></td>
                          <td className="px-4 py-3"><Button size="sm" variant="outline" onClick={() => setReassociationTarget({ kind: "molecule", linkId: link.id, descriptorId: link.descriptorId, descriptorName: link.descriptorName, archivedName: link.moleculeName || link.casNumber || `ID ${link.moleculeId}` })}>Réassocier</Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      <OrphanReassociationDialog
        target={reassociationTarget}
        onClose={() => setReassociationTarget(null)}
        onSuccess={() => integrityQuery.refetch()}
      />
    </div>
  );
}
