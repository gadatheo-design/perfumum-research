import { trpc } from "@/lib/trpc";

export default function TestTRPC() {
  // Test avec un seul hook tRPC simple
  const { data, isLoading, error } = trpc.molecules.list.useQuery();

  if (isLoading) {
    return <div className="p-8">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-red-500">
        <h1 className="text-2xl font-bold mb-4">Erreur</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test tRPC</h1>
      <p className="mb-4">
        ✅ Le hook tRPC fonctionne correctement !
      </p>
      <p className="text-sm text-muted-foreground">
        Nombre de molécules : {data?.length || 0}
      </p>
    </div>
  );
}
