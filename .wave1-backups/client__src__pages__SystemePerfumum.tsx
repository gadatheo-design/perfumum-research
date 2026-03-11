// @ts-nocheck
import { Link } from "wouter";
import { Home, Network, Beaker, Database, Map, BookOpen, Users, Settings } from "lucide-react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";
import { useMemo } from "react";

export default function SystemePerfumum() {
  // Définition des nœuds du système
  const nodes: Node[] = useMemo(() => [
    // Nœud central ABSORBE
    {
      id: "absorbe",
      type: "default",
      data: { label: "ABSORBE\nLaboratoire Atmosphérique" },
      position: { x: 400, y: 50 },
      style: {
        background: "oklch(0.65 0.15 280)",
        color: "white",
        border: "2px solid oklch(0.75 0.15 280)",
        borderRadius: "8px",
        padding: "16px",
        fontSize: "14px",
        fontWeight: "bold",
        width: 200,
        textAlign: "center",
      },
    },
    // PERFUMUM (sous-système)
    {
      id: "perfumum",
      type: "default",
      data: { label: "PERFUMUM\nRecherche Olfactive" },
      position: { x: 400, y: 180 },
      style: {
        background: "oklch(0.55 0.15 280)",
        color: "white",
        border: "2px solid oklch(0.65 0.15 280)",
        borderRadius: "8px",
        padding: "16px",
        fontSize: "13px",
        fontWeight: "600",
        width: 180,
        textAlign: "center",
      },
    },
    // Études atmosphériques
    {
      id: "etudes",
      type: "default",
      data: { label: "Études\nAtmosphériques" },
      position: { x: 100, y: 320 },
      style: {
        background: "oklch(0.70 0.12 150)",
        color: "white",
        border: "2px solid oklch(0.80 0.12 150)",
        borderRadius: "6px",
        padding: "12px",
        fontSize: "12px",
        width: 140,
        textAlign: "center",
      },
    },
    {
      id: "petrichor",
      type: "default",
      data: { label: "Pétrichor" },
      position: { x: 50, y: 450 },
      style: {
        background: "oklch(0.75 0.10 150)",
        color: "white",
        borderRadius: "4px",
        padding: "8px",
        fontSize: "11px",
        width: 100,
      },
    },
    {
      id: "volcanique",
      type: "default",
      data: { label: "Volcanique" },
      position: { x: 170, y: 450 },
      style: {
        background: "oklch(0.75 0.10 20)",
        color: "white",
        borderRadius: "4px",
        padding: "8px",
        fontSize: "11px",
        width: 100,
      },
    },
    // Base de données
    {
      id: "donnees",
      type: "default",
      data: { label: "Base de\nDonnées" },
      position: { x: 300, y: 320 },
      style: {
        background: "oklch(0.70 0.12 200)",
        color: "white",
        border: "2px solid oklch(0.80 0.12 200)",
        borderRadius: "6px",
        padding: "12px",
        fontSize: "12px",
        width: 140,
        textAlign: "center",
      },
    },
    {
      id: "molecules",
      type: "default",
      data: { label: "Molécules (209)" },
      position: { x: 250, y: 450 },
      style: {
        background: "oklch(0.75 0.10 200)",
        color: "white",
        borderRadius: "4px",
        padding: "8px",
        fontSize: "11px",
        width: 120,
      },
    },
    {
      id: "recettes",
      type: "default",
      data: { label: "Recettes (210)" },
      position: { x: 390, y: 450 },
      style: {
        background: "oklch(0.75 0.10 200)",
        color: "white",
        borderRadius: "4px",
        padding: "8px",
        fontSize: "11px",
        width: 120,
      },
    },
    // Outils analytiques
    {
      id: "outils",
      type: "default",
      data: { label: "Outils\nAnalytiques" },
      position: { x: 500, y: 320 },
      style: {
        background: "oklch(0.70 0.12 280)",
        color: "white",
        border: "2px solid oklch(0.80 0.12 280)",
        borderRadius: "6px",
        padding: "12px",
        fontSize: "12px",
        width: 140,
        textAlign: "center",
      },
    },
    {
      id: "compare-radar",
      type: "default",
      data: { label: "Compare Radar" },
      position: { x: 450, y: 450 },
      style: {
        background: "oklch(0.75 0.10 280)",
        color: "white",
        borderRadius: "4px",
        padding: "8px",
        fontSize: "11px",
        width: 120,
      },
    },
    {
      id: "suggestions",
      type: "default",
      data: { label: "Suggestions IA" },
      position: { x: 590, y: 450 },
      style: {
        background: "oklch(0.75 0.10 280)",
        color: "white",
        borderRadius: "4px",
        padding: "8px",
        fontSize: "11px",
        width: 120,
      },
    },
    // Sourcing & Terrains
    {
      id: "sourcing",
      type: "default",
      data: { label: "Sourcing\nGlobal" },
      position: { x: 700, y: 320 },
      style: {
        background: "oklch(0.70 0.12 40)",
        color: "white",
        border: "2px solid oklch(0.80 0.12 40)",
        borderRadius: "6px",
        padding: "12px",
        fontSize: "12px",
        width: 140,
        textAlign: "center",
      },
    },
    {
      id: "terrains",
      type: "default",
      data: { label: "Terrains\n(Forêt, Ville, Musée)" },
      position: { x: 650, y: 450 },
      style: {
        background: "oklch(0.75 0.10 40)",
        color: "white",
        borderRadius: "4px",
        padding: "8px",
        fontSize: "11px",
        width: 140,
        textAlign: "center",
      },
    },
  ], []);

  // Définition des arêtes (relations)
  const edges: Edge[] = useMemo(() => [
    // ABSORBE → PERFUMUM
    { id: "e1", source: "absorbe", target: "perfumum", animated: true, style: { stroke: "oklch(0.65 0.15 280)", strokeWidth: 2 } },
    // PERFUMUM → Études
    { id: "e2", source: "perfumum", target: "etudes", style: { stroke: "oklch(0.70 0.12 150)", strokeWidth: 1.5 } },
    { id: "e3", source: "etudes", target: "petrichor", style: { stroke: "oklch(0.75 0.10 150)" } },
    { id: "e4", source: "etudes", target: "volcanique", style: { stroke: "oklch(0.75 0.10 20)" } },
    // PERFUMUM → Données
    { id: "e5", source: "perfumum", target: "donnees", style: { stroke: "oklch(0.70 0.12 200)", strokeWidth: 1.5 } },
    { id: "e6", source: "donnees", target: "molecules", style: { stroke: "oklch(0.75 0.10 200)" } },
    { id: "e7", source: "donnees", target: "recettes", style: { stroke: "oklch(0.75 0.10 200)" } },
    // PERFUMUM → Outils
    { id: "e8", source: "perfumum", target: "outils", style: { stroke: "oklch(0.70 0.12 280)", strokeWidth: 1.5 } },
    { id: "e9", source: "outils", target: "compare-radar", style: { stroke: "oklch(0.75 0.10 280)" } },
    { id: "e10", source: "outils", target: "suggestions", style: { stroke: "oklch(0.75 0.10 280)" } },
    // PERFUMUM → Sourcing
    { id: "e11", source: "perfumum", target: "sourcing", style: { stroke: "oklch(0.70 0.12 40)", strokeWidth: 1.5 } },
    { id: "e12", source: "sourcing", target: "terrains", style: { stroke: "oklch(0.75 0.10 40)" } },
    // Relations transversales
    { id: "e13", source: "molecules", target: "compare-radar", style: { stroke: "oklch(0.60 0.08 240)", strokeDasharray: "5,5" } },
    { id: "e14", source: "molecules", target: "suggestions", style: { stroke: "oklch(0.60 0.08 240)", strokeDasharray: "5,5" } },
    { id: "e15", source: "recettes", target: "petrichor", style: { stroke: "oklch(0.60 0.08 180)", strokeDasharray: "5,5" } },
  ], []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Home className="h-5 w-5" />
              <span className="font-medium">PERFUMUM</span>
            </Link>
            <h1 className="text-xl font-bold uppercase tracking-tight">Système PERFUMUM</h1>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <section className="mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 uppercase tracking-tight">Vue d'ensemble du système</h2>
          
          <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground">
            <p>
              PERFUMUM est un laboratoire de recherche olfactive intégré au cadre plus large d'<strong>ABSORBE</strong>, 
              laboratoire atmosphérique artistique basé à Berne. Le système repose sur une logique de recherche 
              articulant plusieurs dimensions :
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="text-primary font-semibold mb-1">Air</div>
                <div className="text-sm text-muted-foreground">Atmosphères</div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="text-primary font-semibold mb-1">Lieu</div>
                <div className="text-sm text-muted-foreground">Site-specificité</div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="text-primary font-semibold mb-1">Odeur</div>
                <div className="text-sm text-muted-foreground">Molécules</div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="text-primary font-semibold mb-1">Fumé</div>
                <div className="text-sm text-muted-foreground">Pyrolyse</div>
              </div>
            </div>

            <p>
              Le site web n'est ni un portfolio classique, ni un site commercial, mais un <strong>espace de recherche</strong>, 
              un <strong>atlas d'études atmosphériques</strong>, et un <strong>outil analytique en devenir</strong> 
              destiné à la collaboration artistique et académique.
            </p>
          </div>
        </section>

        {/* Graphe interactif */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Cartographie du système</h3>
          <p className="text-muted-foreground mb-6">
            Le graphe ci-dessous montre les relations entre les différentes composantes du système. 
            Vous pouvez zoomer, déplacer les nœuds, et explorer les connexions.
          </p>
          
          <div className="bg-card border border-border rounded-lg overflow-hidden" style={{ height: "600px" }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              attributionPosition="bottom-left"
            >
              <Background color="oklch(0.30 0.05 280)" gap={16} />
              <Controls />
              <MiniMap
                nodeColor={(node) => {
                  if (node.id === "absorbe") return "oklch(0.65 0.15 280)";
                  if (node.id === "perfumum") return "oklch(0.55 0.15 280)";
                  return "oklch(0.70 0.12 200)";
                }}
                maskColor="oklch(0.20 0.05 280 / 0.8)"
              />
            </ReactFlow>
          </div>
        </section>

        {/* Légende */}
        <section className="mb-12 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Légende du système</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-3">
                <Network className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Études Atmosphériques</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Protocoles ouverts de recherche sur des atmosphères spécifiques (Pétrichor, Volcanique, Glaciaire, etc.)
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-3">
                <Database className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Base de Données</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                199 molécules et 213 recettes documentées avec profils olfactifs, propriétés chimiques et synergies
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-3">
                <Beaker className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Outils Analytiques</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Comparateur radar, suggestions IA, calculateurs de proportions pour l'analyse et la formulation
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-3">
                <Map className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Sourcing & Terrains</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Fournisseurs globaux et études de terrain (forêt, ville, musée) pour la captation atmosphérique
              </p>
            </div>
          </div>
        </section>

        {/* Navigation rapide */}
        <section className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Navigation rapide</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/methodologie/absorbe" className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors">
              <BookOpen className="h-5 w-5 text-primary mb-2" />
              <div className="font-semibold mb-1">Méthode ABSORBE</div>
              <div className="text-sm text-muted-foreground">Processus de recherche</div>
            </Link>

            <Link href="/etudes" className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors">
              <Network className="h-5 w-5 text-primary mb-2" />
              <div className="font-semibold mb-1">Études</div>
              <div className="text-sm text-muted-foreground">Atmosphères documentées</div>
            </Link>

            <Link href="/projets" className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors">
              <Users className="h-5 w-5 text-primary mb-2" />
              <div className="font-semibold mb-1">Projets & Terrains</div>
              <div className="text-sm text-muted-foreground">Cas concrets</div>
            </Link>

            <Link href="/molecules" className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors">
              <Database className="h-5 w-5 text-primary mb-2" />
              <div className="font-semibold mb-1">Molécules</div>
              <div className="text-sm text-muted-foreground">199 entrées</div>
            </Link>

            <Link href="/compare-radar" className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors">
              <Beaker className="h-5 w-5 text-primary mb-2" />
              <div className="font-semibold mb-1">Compare Radar</div>
              <div className="text-sm text-muted-foreground">Outil analytique</div>
            </Link>

            <Link href="/sourcing" className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors">
              <Map className="h-5 w-5 text-primary mb-2" />
              <div className="font-semibold mb-1">Sourcing Global</div>
              <div className="text-sm text-muted-foreground">10 régions</div>
            </Link>

            <Link href="/leaf-economies" className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors">
              <Beaker className="h-5 w-5 text-emerald-500 mb-2" />
              <div className="font-semibold mb-1">San Andrés</div>
              <div className="text-sm text-muted-foreground">Leaf Economies</div>
            </Link>

            <Link href="/terp-profiles" className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors">
              <Network className="h-5 w-5 text-blue-500 mb-2" />
              <div className="font-semibold mb-1">TerpProfiles</div>
              <div className="text-sm text-muted-foreground">Fiches analytiques</div>
            </Link>

            <Link href="/nouveautes" className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors">
              <Settings className="h-5 w-5 text-amber-500 mb-2" />
              <div className="font-semibold mb-1">Nouveautés</div>
              <div className="text-sm text-muted-foreground">Version 3.5</div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
