import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function MoleculeDetail() {
  const params = useParams();
  const id = params.id ? parseInt(params.id) : 0;

  const { data: molecule, isLoading } = trpc.molecules.getById.useQuery(id);
  const trackEvent = trpc.analytics.trackEvent.useMutation();

  // Track page view
  useEffect(() => {
    if (molecule) {
      trackEvent.mutate({
        eventType: "molecule_view",
        entityId: molecule.id,
        entityType: "molecule",
        metadata: JSON.stringify({
          moleculeName: molecule.name,
          family: molecule.family,
          source: "molecule_detail",
        }),
      });
    }
  }, [molecule?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!molecule) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container max-w-4xl">
          <Link href="/molecules">
            <a className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
              <ArrowLeft className="h-4 w-4" />
              Retour aux molécules
            </a>
          </Link>
          <h1 className="text-2xl font-bold mb-4">Molécule introuvable</h1>
          <p className="text-muted-foreground">
            La molécule demandée n'existe pas ou a été supprimée.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container max-w-4xl">
        <Link href="/molecules">
          <a className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
            <ArrowLeft className="h-4 w-4" />
            Retour aux molécules
          </a>
        </Link>

        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold mb-2">{molecule.name}</h1>
            {molecule.chemicalFormula && (
              <p className="text-xl text-muted-foreground font-mono">
                {molecule.chemicalFormula}
              </p>
            )}
          </div>

          {/* Main Info Grid */}
          <div className="grid gap-6">
            {molecule.family && (
              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-lg font-semibold mb-2">Famille Chimique</h2>
                <p>{molecule.family}</p>
              </div>
            )}

            {molecule.olfactiveProfile && (
              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-lg font-semibold mb-2">Profil Olfactif</h2>
                <p className="whitespace-pre-wrap">{molecule.olfactiveProfile}</p>
              </div>
            )}

            {molecule.emotionalResonance && (
              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-lg font-semibold mb-2">Résonance Émotionnelle</h2>
                <p className="whitespace-pre-wrap">{molecule.emotionalResonance}</p>
              </div>
            )}

            {molecule.functionalEffect && (
              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-lg font-semibold mb-2">Effet Fonctionnel</h2>
                <p className="whitespace-pre-wrap">{molecule.functionalEffect}</p>
              </div>
            )}

            {molecule.sourceOrigin && (
              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-lg font-semibold mb-2">Origine</h2>
                <p>{molecule.sourceOrigin}</p>
              </div>
            )}

            {molecule.concentration && (
              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-lg font-semibold mb-2">Concentration Recommandée</h2>
                <p>{molecule.concentration}</p>
              </div>
            )}

            {molecule.botanicalSources && (
              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-lg font-semibold mb-2">Sources Botaniques</h2>
                <p className="whitespace-pre-wrap">{molecule.botanicalSources}</p>
              </div>
            )}

            {molecule.extractionMethod && (
              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-lg font-semibold mb-2">Méthode d'Extraction</h2>
                <p className="whitespace-pre-wrap">{molecule.extractionMethod}</p>
              </div>
            )}

            {molecule.therapeuticProperties && (
              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-lg font-semibold mb-2">Propriétés Thérapeutiques</h2>
                <p className="whitespace-pre-wrap">{molecule.therapeuticProperties}</p>
              </div>
            )}

            {molecule.notes && (
              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-lg font-semibold mb-2">Notes de Recherche</h2>
                <p className="whitespace-pre-wrap">{molecule.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
