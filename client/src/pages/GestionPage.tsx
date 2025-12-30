import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function GestionPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1 py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">Gestion du Projet</h1>
            <p className="text-xl text-muted-foreground">
              Dashboard de gestion : agenda, budget et mentorat
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
