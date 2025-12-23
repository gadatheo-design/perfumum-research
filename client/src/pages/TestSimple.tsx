export default function TestSimple() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Page de Test Simple</h1>
      <p className="text-lg">
        ✅ Cette page s'affiche correctement sans aucun hook tRPC.
      </p>
      <div className="mt-8 p-4 bg-green-100 dark:bg-green-900 rounded">
        <p className="font-semibold">Test réussi !</p>
        <p className="text-sm">Si vous voyez ce message, le routage fonctionne.</p>
      </div>
    </div>
  );
}
