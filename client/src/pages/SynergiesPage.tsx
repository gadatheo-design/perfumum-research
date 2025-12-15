import { trpc } from '../lib/trpc';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';

export default function Synergies() {
  const { data: synergies, isLoading, error } = trpc.synergies.list.useQuery();

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-red-500">Erreur: {error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-lg">Chargement des synergies...</p>
        <div className="animate-pulse mt-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Synergies Moléculaires</CardTitle>
          <CardDescription>
            {synergies?.length || 0} synergies documentées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {synergies?.map((synergy: any) => (
              <div key={synergy.id} className="border p-4 rounded-lg">
                <h3 className="font-semibold">{synergy.name}</h3>
                <p className="text-sm text-muted-foreground">{synergy.type}</p>
                {synergy.effet && (
                  <p className="text-sm mt-2">{synergy.effet}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
