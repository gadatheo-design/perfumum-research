import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function AnalyticsDashboard() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <Breadcrumbs />
        <h1 className="text-4xl font-bold mb-2">TABLEAU DE BORD ANALYTIQUE</h1>
        <p className="text-muted-foreground">Test minimal - Si vous voyez ce texte, le composant fonctionne.</p>
      </div>
    </div>
  );
}
