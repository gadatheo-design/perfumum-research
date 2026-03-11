// @ts-nocheck
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ChemicalFamilyHierarchyGraph } from "@/components/ChemicalFamilyHierarchyGraph";
import { 
  Network, 
  FlaskConical, 
  Beaker,
  BarChart3, 
  Info,
  RefreshCw,
  Download,
  FileJson,
  FileSpreadsheet,
  GitBranch
} from "lucide-react";

// Type pour les liaisons molécule-famille chimique
interface MoleculeChemicalFamilyLink {
  moleculeId: number;
  moleculeName: string;
  moleculeFamily?: string | null;
  chemicalFamilyId: number;
  chemicalFamilyName: string;
  chemicalFamilyType: string;
  chemicalFamilyDescription?: string | null;
  chemicalFamilyOlfactiveRole?: string | null;
}

export default function GrapheMoleculesFamillesChimiques() {
  const [activeTab, setActiveTab] = useState("graph");
  
  // Récupérer toutes les liaisons molécule-famille chimique
  const { data: links, isLoading, refetch } = trpc.chemicalFamilies.getAllLinks.useQuery();
  
  // Récupérer toutes les familles chimiques
  const { data: chemicalFamilies } = trpc.chemicalFamilies.listAll.useQuery();
  
  // Export CSV
  const { refetch: fetchCSV, isFetching: isExportingCSV } = trpc.chemicalFamilies.exportCSV.useQuery(undefined, {
    enabled: false,
  });
  
  // Export JSON
  const { refetch: fetchJSON, isFetching: isExportingJSON } = trpc.chemicalFamilies.exportJSON.useQuery(undefined, {
    enabled: false,
  });
  
  // Calculer les statistiques à partir des données
  const graphStats = useMemo(() => {
    if (!links) return null;
    return {
      totalLinks: links.length,
      uniqueMolecules: new Set(links.map((l: MoleculeChemicalFamilyLink) => l.moleculeId)).size,
      uniqueFamilies: new Set(links.map((l: MoleculeChemicalFamilyLink) => l.chemicalFamilyId)).size,
      familyTypes: new Set(links.map((l: MoleculeChemicalFamilyLink) => l.chemicalFamilyType)).size,
    };
  }, [links]);
  
  // Distribution par type de famille
  const familyTypeDistribution = useMemo(() => {
    if (!links) return {};
    return links.reduce((acc: Record<string, number>, link: MoleculeChemicalFamilyLink) => {
      const type = link.chemicalFamilyType || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [links]);
  
  // Télécharger CSV
  const handleExportCSV = async () => {
    const result = await fetchCSV();
    if (result.data) {
      const blob = new Blob([result.data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `perfumum-molecules-familles-chimiques-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };
  
  // Télécharger JSON
  const handleExportJSON = async () => {
    const result = await fetchJSON();
    if (result.data) {
      const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `perfumum-molecules-familles-chimiques-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <FlaskConical className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Graphe Molécules-Familles Chimiques</h1>
              <p className="text-muted-foreground">
                Visualisation des relations entre molécules et familles chimiques (réseau ou arbre hiérarchique)
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportCSV}
              disabled={isExportingCSV || !links?.length}
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              {isExportingCSV ? "Export..." : "Export CSV"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportJSON}
              disabled={isExportingJSON || !links?.length}
            >
              <FileJson className="h-4 w-4 mr-2" />
              {isExportingJSON ? "Export..." : "Export JSON"}
            </Button>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Liaisons</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {isLoading ? <Skeleton className="h-8 w-16" /> : graphStats?.totalLinks || 0}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Beaker className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">Molécules</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {isLoading ? <Skeleton className="h-8 w-16" /> : graphStats?.uniqueMolecules || 0}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Familles</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {isLoading ? <Skeleton className="h-8 w-16" /> : graphStats?.uniqueFamilies || 0}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-muted-foreground">Types</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {isLoading ? <Skeleton className="h-8 w-16" /> : graphStats?.familyTypes || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="graph">
              <Network className="h-4 w-4 mr-2" />
              Graphe interactif
            </TabsTrigger>
            <TabsTrigger value="stats">
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="info">
              <Info className="h-4 w-4 mr-2" />
              Guide
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="graph" className="mt-4">
            {isLoading ? (
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-72 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="h-[700px] flex items-center justify-center">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">Chargement du graphe...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : links && links.length > 0 && chemicalFamilies ? (
              <ChemicalFamilyHierarchyGraph 
                links={links} 
                chemicalFamilies={chemicalFamilies}
                height={700} 
              />
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <FlaskConical className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">Aucune liaison trouvée</p>
                    <p className="text-sm text-muted-foreground">
                      Ajoutez des liaisons molécule-famille chimique via la page Admin Molécules
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="stats" className="mt-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Distribution par type de famille */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FlaskConical className="h-5 w-5" />
                    Distribution par type de famille
                  </CardTitle>
                  <CardDescription>
                    Nombre de liaisons par type de famille chimique
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {Object.entries(familyTypeDistribution)
                      .sort(([, a], [, b]) => b - a)
                      .map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <span className="text-sm font-medium capitalize">
                            {type.replace(/_/g, ' ')}
                          </span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Top familles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Top 10 familles chimiques
                  </CardTitle>
                  <CardDescription>
                    Familles avec le plus de molécules liées
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {links && (() => {
                      const familyCounts = links.reduce((acc: Record<string, number>, link: MoleculeChemicalFamilyLink) => {
                        const name = link.chemicalFamilyName;
                        acc[name] = (acc[name] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>);
                      
                      return Object.entries(familyCounts)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 10)
                        .map(([name, count], index) => (
                          <div key={name} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                            <span className="text-sm font-bold text-muted-foreground w-6">
                              #{index + 1}
                            </span>
                            <span className="text-sm font-medium flex-1">{name}</span>
                            <Badge>{count} molécule{count > 1 ? 's' : ''}</Badge>
                          </div>
                        ));
                    })()}
                  </div>
                </CardContent>
              </Card>
              
              {/* Résumé export */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Export des données
                  </CardTitle>
                  <CardDescription>
                    Téléchargez les liaisons molécules-familles chimiques pour analyse externe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <FileSpreadsheet className="h-8 w-8 text-green-600" />
                        <div>
                          <h4 className="font-semibold">Export CSV</h4>
                          <p className="text-sm text-muted-foreground">
                            Format tableur (Excel, Google Sheets)
                          </p>
                        </div>
                      </div>
                      <Button 
                        onClick={handleExportCSV} 
                        disabled={isExportingCSV || !links?.length}
                        className="w-full"
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        {isExportingCSV ? "Génération..." : "Télécharger CSV"}
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <FileJson className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-semibold">Export JSON</h4>
                          <p className="text-sm text-muted-foreground">
                            Format structuré (API, scripts)
                          </p>
                        </div>
                      </div>
                      <Button 
                        onClick={handleExportJSON}
                        disabled={isExportingJSON || !links?.length}
                        className="w-full"
                      >
                        <FileJson className="h-4 w-4 mr-2" />
                        {isExportingJSON ? "Génération..." : "Télécharger JSON"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="info" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Guide d'utilisation</CardTitle>
                <CardDescription>
                  Comment utiliser le graphe molécules-familles chimiques
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Network className="h-4 w-4" />
                    Mode Réseau
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Visualisation en graphe de force où les familles chimiques (grands cercles colorés) 
                    sont connectées aux molécules (petits cercles gris). Utilisez la souris pour :
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                    <li>Faire glisser les nœuds pour réorganiser le graphe</li>
                    <li>Utiliser la molette pour zoomer</li>
                    <li>Survoler un nœud pour voir ses connexions</li>
                    <li>Cliquer sur un nœud pour afficher ses détails</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    Mode Arbre Hiérarchique
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Visualisation en arbre organisé par catégories de familles chimiques :
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                    <li><strong>Racine</strong> : Point de départ de l'arbre</li>
                    <li><strong>Catégories</strong> : Groupes de familles (Terpènes, Alcools, Aldéhydes...)</li>
                    <li><strong>Familles</strong> : Familles chimiques spécifiques</li>
                    <li><strong>Molécules</strong> : Molécules appartenant à chaque famille</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export des données
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Deux formats d'export sont disponibles :
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                    <li><strong>CSV</strong> : Idéal pour Excel, Google Sheets, ou analyse tabulaire</li>
                    <li><strong>JSON</strong> : Idéal pour scripts Python, R, ou intégration API</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Légende des couleurs (Mode Réseau)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span>Terpènes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span>Alcools</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span>Aldéhydes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span>Cétones</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-cyan-500" />
                      <span>Esters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      <span>Éthers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-pink-500" />
                      <span>Phénols</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-slate-500" />
                      <span>Autres</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
