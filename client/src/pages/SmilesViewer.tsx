// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Atom, Download, ExternalLink, Loader2, Info, FlaskConical } from "lucide-react";
import { Link } from "wouter";
import SmilesDrawer from "smiles-drawer";

interface MoleculeWithSmiles {
  id: number;
  name: string;
  smiles: string | null;
  pubchem_cid: number | null;
  chemicalFormula: string | null;
  molecularWeight: number | null;
  cas_number: string | null;
  chemical_class: string | null;
}

function MoleculeStructure({ smiles, name, size = 300 }: { smiles: string; name: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !smiles) return;

    const drawer = new SmilesDrawer.SmiDrawer({
      width: size,
      height: size,
      bondThickness: 1.5,
      bondLength: 25,
      shortBondLength: 0.85,
      bondSpacing: 0.18 * 25,
      atomVisualization: "default",
      isomeric: true,
      debug: false,
      terminalCarbons: false,
      explicitHydrogens: false,
      overlapSensitivity: 0.42,
      overlapResolutionIterations: 1,
      compactDrawing: true,
      fontSizeLarge: 11,
      fontSizeSmall: 4,
      padding: 20,
      themes: {
        dark: {
          C: "#c8c8c8",
          O: "#ff6b6b",
          N: "#4dabf7",
          F: "#69db7c",
          CL: "#69db7c",
          BR: "#f59f00",
          I: "#be4bdb",
          P: "#ff922b",
          S: "#ffd43b",
          B: "#f783ac",
          SI: "#be4bdb",
          H: "#c8c8c8",
          BACKGROUND: "#1a1a2e"
        }
      }
    });

    try {
      SmilesDrawer.parse(smiles, (tree: any) => {
        drawer.draw(tree, canvasRef.current, "dark", false);
      }, (err: any) => {
        setError(`Erreur de parsing: ${err}`);
      });
    } catch (e: any) {
      setError(`Erreur: ${e.message}`);
    }
  }, [smiles, size]);

  if (error) {
    return (
      <div className="flex items-center justify-center bg-muted/20 rounded-lg p-4" style={{ width: size, height: size }}>
        <p className="text-sm text-muted-foreground text-center">{error}</p>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="bg-[#1a1a2e] rounded-lg"
      title={name}
    />
  );
}

export default function SmilesViewer() {
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Récupérer les molécules avec SMILES
  const { data: moleculesData, isLoading } = trpc.molecules.listWithSmiles.useQuery({
    search,
    chemicalClass: selectedClass === "all" ? undefined : selectedClass,
    limit: pageSize,
    offset: (page - 1) * pageSize
  });

  // Récupérer les classes chimiques disponibles
  const { data: classesData } = trpc.molecules.listChemicalClasses.useQuery();

  const molecules = moleculesData?.molecules || [];
  const total = moleculesData?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  // Statistiques
  const { data: stats } = trpc.molecules.getSmilesStats.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Atom className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Visualisation SMILES</h1>
              <p className="text-muted-foreground">Structures moléculaires 2D</p>
            </div>
          </div>

          {/* Statistiques */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">{stats.withSmiles}</div>
                  <div className="text-sm text-muted-foreground">Avec SMILES</div>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total molécules</div>
                </CardContent>
              </Card>
              <Card className="bg-green-500/10 border-green-500/20">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-500">{stats.withPubChem}</div>
                  <div className="text-sm text-muted-foreground">Avec PubChem CID</div>
                </CardContent>
              </Card>
              <Card className="bg-amber-500/10 border-amber-500/20">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-amber-500">
                    {Math.round((stats.withSmiles / stats.total) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Couverture SMILES</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filtres */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une molécule..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Tabs value={selectedClass} onValueChange={(v) => { setSelectedClass(v); setPage(1); }}>
              <TabsList className="flex-wrap h-auto">
                <TabsTrigger value="all">Toutes</TabsTrigger>
                {classesData?.slice(0, 8).map((cls) => (
                  <TabsTrigger key={cls.name} value={cls.name}>
                    {cls.name} ({cls.count})
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="container py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : molecules.length === 0 ? (
          <Card className="bg-muted/20">
            <CardContent className="p-12 text-center">
              <FlaskConical className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Aucune molécule trouvée</h3>
              <p className="text-muted-foreground">
                {search ? "Essayez une autre recherche" : "Aucune molécule avec structure SMILES disponible"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Grille de molécules */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {molecules.map((mol) => (
                <Card key={mol.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base line-clamp-1">{mol.name}</CardTitle>
                      {mol.pubchem_cid && (
                        <a
                          href={`https://pubchem.ncbi.nlm.nih.gov/compound/${mol.pubchem_cid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {mol.chemical_class && (
                        <Badge variant="secondary" className="text-xs">
                          {mol.chemical_class}
                        </Badge>
                      )}
                      {mol.chemicalFormula && (
                        <Badge variant="outline" className="text-xs font-mono">
                          {mol.chemicalFormula}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {mol.smiles ? (
                      <div className="flex justify-center">
                        <MoleculeStructure smiles={mol.smiles} name={mol.name} size={250} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center bg-muted/20 rounded-lg h-[250px]">
                        <div className="text-center text-muted-foreground">
                          <Atom className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Structure non disponible</p>
                        </div>
                      </div>
                    )}
                    <div className="mt-3 space-y-1 text-sm">
                      {mol.cas_number && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">CAS:</span>
                          <span className="font-mono">{mol.cas_number}</span>
                        </div>
                      )}
                      {mol.molecularWeight && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">MW:</span>
                          <span>{mol.molecularWeight} g/mol</span>
                        </div>
                      )}
                      {mol.pubchem_cid && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">PubChem:</span>
                          <span className="font-mono">{mol.pubchem_cid}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <Link href={`/molecule/${mol.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          <Info className="h-4 w-4 mr-2" />
                          Voir détails
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Précédent
                </Button>
                <span className="text-sm text-muted-foreground px-4">
                  Page {page} sur {totalPages} ({total} molécules)
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Suivant
                </Button>
              </div>
            )}
          </>
        )}

        {/* Info SMILES */}
        <Card className="mt-8 bg-blue-500/5 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-2">À propos de SMILES</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>SMILES</strong> (Simplified Molecular Input Line Entry System) est une notation linéaire 
                  permettant de représenter des structures moléculaires sous forme de chaînes de caractères ASCII.
                  Cette notation est utilisée universellement en chimie computationnelle et permet de stocker, 
                  rechercher et comparer des molécules de manière efficace.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Les structures 2D sont générées à partir des chaînes SMILES enrichies via l'API PubChem.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
