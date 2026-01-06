import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Dna, BookOpen, FlaskConical, Leaf, Eye, Globe, ExternalLink } from "lucide-react";

// Icônes par axe
const axisIcons: Record<string, React.ReactNode> = {
  AX1_GENOMIC_CONSERVATION: <Dna className="h-6 w-6" />,
  AX2_ETHNOBOTANY_COMP: <BookOpen className="h-6 w-6" />,
  AX3_ANALYTICAL_TRANS_EPOCH: <FlaskConical className="h-6 w-6" />,
  AX4_CONSERVATION_BIOTECH: <Leaf className="h-6 w-6" />,
  AX5_IMMERSIVE_DEMOCRAT: <Eye className="h-6 w-6" />,
  AX6_OLFACTIVE_DIPLOMACY: <Globe className="h-6 w-6" />,
};

// Composant pour afficher les échantillons génomiques
function GenomeSamplesTable({ samples }: { samples: any[] }) {
  if (!samples || samples.length === 0) {
    return <p className="text-muted-foreground text-center py-8">Aucun échantillon génomique</p>;
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Plante</TableHead>
          <TableHead>Région</TableHead>
          <TableHead>Méthode</TableHead>
          <TableHead>Stockage</TableHead>
          <TableHead>Non-destructif</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {samples.map((sample) => (
          <TableRow key={sample.sample_id}>
            <TableCell className="font-mono text-xs">{sample.sample_id}</TableCell>
            <TableCell className="italic">{sample.plant_latin_name}</TableCell>
            <TableCell>{sample.region}</TableCell>
            <TableCell>
              <Badge variant="outline">{sample.collection_method}</Badge>
            </TableCell>
            <TableCell>{sample.storage}</TableCell>
            <TableCell>
              {sample.non_destructive ? (
                <Badge className="bg-green-500/20 text-green-700">Oui</Badge>
              ) : (
                <Badge variant="destructive">Non</Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// Composant pour afficher les manuscrits
function ManuscriptsTable({ manuscripts }: { manuscripts: any[] }) {
  if (!manuscripts || manuscripts.length === 0) {
    return <p className="text-muted-foreground text-center py-8">Aucun manuscrit</p>;
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Titre</TableHead>
          <TableHead>Langue</TableHead>
          <TableHead>Période</TableHead>
          <TableHead>Dépôt</TableHead>
          <TableHead>OCR</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {manuscripts.map((ms) => (
          <TableRow key={ms.manuscript_id}>
            <TableCell className="font-mono text-xs">{ms.manuscript_id}</TableCell>
            <TableCell className="max-w-[200px] truncate">{ms.title}</TableCell>
            <TableCell>{ms.language}</TableCell>
            <TableCell>{ms.date_range}</TableCell>
            <TableCell className="max-w-[150px] truncate">{ms.repository}</TableCell>
            <TableCell>
              <Badge 
                variant={ms.ocr_status === 'completed' ? 'default' : 'secondary'}
                className={ms.ocr_status === 'completed' ? 'bg-green-500/20 text-green-700' : ''}
              >
                {ms.ocr_status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// Composant pour afficher les analyses GC-MS
function GcmsRunsTable({ runs }: { runs: any[] }) {
  if (!runs || runs.length === 0) {
    return <p className="text-muted-foreground text-center py-8">Aucune analyse GC-MS</p>;
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Échantillon</TableHead>
          <TableHead>Méthode</TableHead>
          <TableHead>Instrument</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Composés principaux</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {runs.map((run) => (
          <TableRow key={run.run_id}>
            <TableCell className="font-mono text-xs">{run.run_id}</TableCell>
            <TableCell>{run.sample_ref}</TableCell>
            <TableCell>
              <Badge variant="outline">{run.method}</Badge>
            </TableCell>
            <TableCell className="max-w-[150px] truncate">{run.instrument}</TableCell>
            <TableCell>{run.run_date}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {(run.topCompounds || []).slice(0, 2).map((c: any, i: number) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {c.name} ({c.percent}%)
                  </Badge>
                ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// Composant générique pour les tables vides
function EmptyEntityTable({ entityName }: { entityName: string }) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <p>Aucune donnée disponible pour {entityName}</p>
      <p className="text-sm mt-2">Les données seront ajoutées au fur et à mesure de la recherche.</p>
    </div>
  );
}

export default function AxisDetail() {
  const params = useParams<{ axisId: string }>();
  const axisId = params.axisId || '';
  
  const { data: axisDetail, isLoading, error } = trpc.axesStats.getAxisDetail.useQuery(
    { axisId },
    { enabled: !!axisId }
  );
  
  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }
  
  if (error || !axisDetail) {
    return (
      <div className="container py-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Erreur</CardTitle>
            <CardDescription>
              Impossible de charger les détails de l'axe de recherche.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/axes-recherche">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux axes
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const entities = axisDetail.entities || {};
  
  // Déterminer les onglets disponibles selon l'axe
  const getTabs = () => {
    switch (axisId) {
      case 'AX1_GENOMIC_CONSERVATION':
        return [
          { id: 'samples', label: 'Échantillons génomiques', count: entities.genomeSamples?.length || 0 },
          { id: 'sequences', label: 'Séquences', count: entities.genomeSequences?.length || 0 },
        ];
      case 'AX2_ETHNOBOTANY_COMP':
        return [
          { id: 'manuscripts', label: 'Manuscrits', count: entities.manuscripts?.length || 0 },
          { id: 'fragments', label: 'Fragments', count: entities.textFragments?.length || 0 },
          { id: 'routes', label: 'Routes commerciales', count: entities.tradeRoutes?.length || 0 },
        ];
      case 'AX3_ANALYTICAL_TRANS_EPOCH':
        return [
          { id: 'herbarium', label: 'Herbier', count: entities.herbariumSamples?.length || 0 },
          { id: 'gcms', label: 'Analyses GC-MS', count: entities.gcmsRuns?.length || 0 },
          { id: 'markers', label: 'Marqueurs', count: entities.molecularMarkers?.length || 0 },
        ];
      case 'AX4_CONSERVATION_BIOTECH':
        return [
          { id: 'tissue', label: 'Culture tissulaire', count: entities.tissueCultureLines?.length || 0 },
          { id: 'fermentation', label: 'Fermentation', count: entities.fermentationRuns?.length || 0 },
          { id: 'biotech', label: 'Molécules biotech', count: entities.biotechMolecules?.length || 0 },
        ];
      case 'AX5_IMMERSIVE_DEMOCRAT':
        return [
          { id: 'vr', label: 'Scènes VR', count: entities.vrScenes?.length || 0 },
          { id: 'citizen', label: 'Observations citoyennes', count: entities.citizenObservations?.length || 0 },
        ];
      case 'AX6_OLFACTIVE_DIPLOMACY':
        return [
          { id: 'partners', label: 'Partenaires', count: entities.partnerInstitutions?.length || 0 },
          { id: 'fellowships', label: 'Bourses', count: entities.fellowships?.length || 0 },
        ];
      default:
        return [];
    }
  };
  
  const tabs = getTabs();
  
  // Rendu du contenu des onglets
  const renderTabContent = (tabId: string) => {
    switch (tabId) {
      case 'samples':
        return <GenomeSamplesTable samples={entities.genomeSamples || []} />;
      case 'sequences':
        return <EmptyEntityTable entityName="les séquences génomiques" />;
      case 'manuscripts':
        return <ManuscriptsTable manuscripts={entities.manuscripts || []} />;
      case 'fragments':
        return <EmptyEntityTable entityName="les fragments de texte" />;
      case 'routes':
        return <EmptyEntityTable entityName="les routes commerciales" />;
      case 'herbarium':
        return <EmptyEntityTable entityName="les échantillons d'herbier" />;
      case 'gcms':
        return <GcmsRunsTable runs={entities.gcmsRuns || []} />;
      case 'markers':
        return <EmptyEntityTable entityName="les marqueurs moléculaires" />;
      case 'tissue':
        return <EmptyEntityTable entityName="les lignées de culture tissulaire" />;
      case 'fermentation':
        return <EmptyEntityTable entityName="les runs de fermentation" />;
      case 'biotech':
        return <EmptyEntityTable entityName="les molécules biotechnologiques" />;
      case 'vr':
        return <EmptyEntityTable entityName="les scènes VR" />;
      case 'citizen':
        return <EmptyEntityTable entityName="les observations citoyennes" />;
      case 'partners':
        return <EmptyEntityTable entityName="les institutions partenaires" />;
      case 'fellowships':
        return <EmptyEntityTable entityName="les bourses de recherche" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="container py-8 space-y-6">
      {/* Navigation */}
      <div className="flex items-center gap-4">
        <Link href="/axes-recherche">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </Link>
      </div>
      
      {/* En-tête de l'axe */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${axisDetail.color}20`, color: axisDetail.color }}
            >
              {axisIcons[axisId] || <FlaskConical className="h-6 w-6" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl">{axisDetail.title_fr}</CardTitle>
                <Badge 
                  variant={axisDetail.status === 'active' ? 'default' : 'secondary'}
                  style={axisDetail.status === 'active' ? { backgroundColor: axisDetail.color } : {}}
                >
                  {axisDetail.status}
                </Badge>
              </div>
              {axisDetail.title_en && (
                <p className="text-muted-foreground text-sm mt-1">{axisDetail.title_en}</p>
              )}
              {axisDetail.tagline_fr && (
                <p className="text-muted-foreground mt-2">{axisDetail.tagline_fr}</p>
              )}
            </div>
          </div>
        </CardHeader>
        {axisDetail.description_fr && (
          <CardContent>
            <p className="text-sm">{axisDetail.description_fr}</p>
          </CardContent>
        )}
      </Card>
      
      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tabs.map((tab) => (
          <Card key={tab.id}>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold" style={{ color: axisDetail.color }}>
                {tab.count}
              </div>
              <p className="text-sm text-muted-foreground">{tab.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Onglets des entités */}
      {tabs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Entités liées</CardTitle>
            <CardDescription>
              Explorez les données associées à cet axe de recherche
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={tabs[0]?.id} className="w-full">
              <TabsList className="mb-4">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id}>
                    {tab.label} ({tab.count})
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id}>
                  {renderTabContent(tab.id)}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
