import { trpc } from '../lib/trpc';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';

export default function Synergies() {
  const { data: synergies, isLoading } = trpc.synergies.list.useQuery();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <p>Chargement des synergies...</p>
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
