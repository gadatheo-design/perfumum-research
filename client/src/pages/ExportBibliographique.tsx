import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  BookOpen, 
  Copy, 
  Download, 
  Search,
  FileText,
  Beaker,
  FlaskConical,
  CheckCircle,
  Leaf,
  ArrowLeft,
  Filter
} from "lucide-react";

type CitationFormat = "apa" | "chicago" | "bibtex";

export default function ExportBibliographique() {
  const { toast } = useToast();
  const [format, setFormat] = useState<CitationFormat>("bibtex");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBibIds, setSelectedBibIds] = useState<number[]>([]);
  const [selectedPlantCategory, setSelectedPlantCategory] = useState<string>("all");
  const [generatedCitations, setGeneratedCitations] = useState<string>("");

  // Récupérer toutes les références bibliographiques
  const { data: bibliographyData } = trpc.bibliography.list.useQuery({});
  const bibliography = bibliographyData?.entries || [];
  
  // Récupérer toutes les plantes pour le filtre par catégorie
  const { data: plants } = trpc.plants.list.useQuery();

  // Filtrer les références
  const filteredBibliography = bibliography.filter((entry: any) => {
    const matchesSearch = 
      entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.authors?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.entryKey?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.journal?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtre par catégorie de plante
    if (selectedPlantCategory !== "all") {
      const plantsInCategory = plants?.filter((p: any) => p.category === selectedPlantCategory).map((p: any) => p.id) || [];
      const linkedPlants = entry.linkedPlantIds as number[] | null;
      if (!linkedPlants || !linkedPlants.some(id => plantsInCategory.includes(id))) {
        return false;
      }
    }
    
    return matchesSearch;
  });

  const handleToggleBib = (id: number) => {
    setSelectedBibIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedBibIds.length === filteredBibliography.length) {
      setSelectedBibIds([]);
    } else {
      setSelectedBibIds(filteredBibliography.map((b: any) => b.id));
    }
  };

  // Générer les citations au format sélectionné
  const generateCitations = () => {
    if (selectedBibIds.length === 0) {
      toast({
        title: "Sélection vide",
        description: "Veuillez sélectionner au moins une référence.",
        variant: "destructive",
      });
      return;
    }

    const selectedEntries = bibliography.filter((b: any) => selectedBibIds.includes(b.id));
    let citations = "";

    switch (format) {
      case "bibtex":
        citations = selectedEntries.map((entry: any) => {
          const fields: string[] = [];
          if (entry.title) fields.push(`  title = {${entry.title}}`);
          if (entry.authors) fields.push(`  author = {${entry.authors}}`);
          if (entry.year) fields.push(`  year = {${entry.year}}`);
          if (entry.journal) fields.push(`  journal = {${entry.journal}}`);
          if (entry.booktitle) fields.push(`  booktitle = {${entry.booktitle}}`);
          if (entry.publisher) fields.push(`  publisher = {${entry.publisher}}`);
          if (entry.volume) fields.push(`  volume = {${entry.volume}}`);
          if (entry.number) fields.push(`  number = {${entry.number}}`);
          if (entry.pages) fields.push(`  pages = {${entry.pages}}`);
          if (entry.doi) fields.push(`  doi = {${entry.doi}}`);
          if (entry.isbn) fields.push(`  isbn = {${entry.isbn}}`);
          if (entry.url) fields.push(`  url = {${entry.url}}`);
          if (entry.abstract) fields.push(`  abstract = {${entry.abstract}}`);
          if (entry.keywords?.length > 0) {
            fields.push(`  keywords = {${entry.keywords.join(', ')}}`);
          }
          return `@${entry.entryType}{${entry.entryKey},\n${fields.join(',\n')}\n}`;
        }).join('\n\n');
        break;

      case "apa":
        citations = selectedEntries.map((entry: any) => {
          const authors = entry.authors || 'Unknown';
          const year = entry.year || 'n.d.';
          const title = entry.title || 'Untitled';
          let citation = `${authors} (${year}). ${title}`;
          
          if (entry.journal) {
            citation += `. *${entry.journal}*`;
            if (entry.volume) citation += `, ${entry.volume}`;
            if (entry.number) citation += `(${entry.number})`;
            if (entry.pages) citation += `, ${entry.pages}`;
          } else if (entry.publisher) {
            citation += `. ${entry.publisher}`;
          }
          
          citation += '.';
          
          if (entry.doi) {
            citation += ` https://doi.org/${entry.doi}`;
          } else if (entry.url) {
            citation += ` ${entry.url}`;
          }
          
          return citation;
        }).join('\n\n');
        break;

      case "chicago":
        citations = selectedEntries.map((entry: any) => {
          const authors = entry.authors || 'Unknown';
          const year = entry.year || 'n.d.';
          const title = entry.title || 'Untitled';
          let citation = `${authors}. "${title}."`;
          
          if (entry.journal) {
            citation += ` *${entry.journal}*`;
            if (entry.volume) citation += ` ${entry.volume}`;
            if (entry.number) citation += `, no. ${entry.number}`;
            citation += ` (${year})`;
            if (entry.pages) citation += `: ${entry.pages}`;
          } else {
            citation += ` ${year}`;
            if (entry.publisher) citation += `. ${entry.publisher}`;
          }
          
          citation += '.';
          
          if (entry.doi) {
            citation += ` https://doi.org/${entry.doi}`;
          }
          
          return citation;
        }).join('\n\n');
        break;
    }

    setGeneratedCitations(citations);
    toast({
      title: "Citations générées",
      description: `${selectedBibIds.length} référence(s) générée(s) au format ${format.toUpperCase()}.`,
    });
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedCitations);
    toast({
      title: "Copié !",
      description: "Les citations ont été copiées dans le presse-papiers.",
    });
  };

  const handleDownload = () => {
    const extension = format === "bibtex" ? "bib" : "txt";
    const blob = new Blob([generatedCitations], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `perfumum-citations-${format}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Téléchargement",
      description: `Fichier ${format === "bibtex" ? ".bib" : ".txt"} téléchargé.`,
    });
  };

  const formatDescriptions: Record<CitationFormat, string> = {
    apa: "American Psychological Association (7ème édition) - Standard pour les sciences sociales et naturelles",
    chicago: "Chicago Manual of Style (17ème édition) - Standard pour les sciences humaines",
    bibtex: "BibTeX - Format pour LaTeX et systèmes de gestion bibliographique (Zotero, Mendeley, EndNote)",
  };

  // Statistiques
  const totalRefs = bibliography.length;
  const refsWithDOI = bibliography.filter((b: any) => b.doi).length;
  const refsByType = bibliography.reduce((acc: Record<string, number>, b: any) => {
    acc[b.entryType] = (acc[b.entryType] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <Header />
      <div className="container py-8 max-w-7xl">
        {/* En-tête */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/bibliographie">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Bibliographie
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center gap-4 mb-8">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Export Bibliographique</h1>
            <p className="text-muted-foreground">
              Générer des citations formatées pour vos publications académiques
            </p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-primary">{totalRefs}</p>
              <p className="text-sm text-muted-foreground">Références totales</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-green-500">{refsWithDOI}</p>
              <p className="text-sm text-muted-foreground">Avec DOI</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-blue-500">{refsByType['article'] || 0}</p>
              <p className="text-sm text-muted-foreground">Articles</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-amber-500">{refsByType['book'] || 0}</p>
              <p className="text-sm text-muted-foreground">Livres</p>
            </CardContent>
          </Card>
        </div>

        {/* Sélection du format */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Format de Citation</CardTitle>
            <CardDescription>
              Choisissez le format adapté à votre publication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Select value={format} onValueChange={(v) => setFormat(v as CitationFormat)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bibtex">BibTeX (.bib)</SelectItem>
                    <SelectItem value="apa">APA (7ème édition)</SelectItem>
                    <SelectItem value="chicago">Chicago (17ème édition)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-[2] text-sm text-muted-foreground">
                {formatDescriptions[format]}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sélection des références */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <CardTitle>Références Bibliographiques</CardTitle>
              </div>
              <Badge variant="outline">
                {selectedBibIds.length} sélectionnée(s)
              </Badge>
            </div>
            <CardDescription>
              Sélectionnez les références à exporter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Filtres */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par titre, auteur, journal..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedPlantCategory} onValueChange={setSelectedPlantCategory}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Catégorie plante" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes catégories</SelectItem>
                    <SelectItem value="cannabis">Cannabis</SelectItem>
                    <SelectItem value="tabac">Tabac (Nicotiana)</SelectItem>
                    <SelectItem value="aromatique">Aromatique</SelectItem>
                    <SelectItem value="resine">Résine</SelectItem>
                    <SelectItem value="bois">Bois</SelectItem>
                    <SelectItem value="fleur">Fleur</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleSelectAll}>
                  {selectedBibIds.length === filteredBibliography.length 
                    ? "Désélectionner tout" 
                    : "Tout sélectionner"}
                </Button>
              </div>

              {/* Liste des références */}
              <ScrollArea className="h-[400px] border rounded-lg">
                <div className="p-2 space-y-2">
                  {filteredBibliography.length > 0 ? (
                    filteredBibliography.map((entry: any) => (
                      <div
                        key={entry.id}
                        className={`flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors ${
                          selectedBibIds.includes(entry.id) ? "bg-accent" : ""
                        }`}
                        onClick={() => handleToggleBib(entry.id)}
                      >
                        <Checkbox
                          checked={selectedBibIds.includes(entry.id)}
                          onCheckedChange={() => handleToggleBib(entry.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs capitalize">
                              {entry.entryType}
                            </Badge>
                            {entry.year && (
                              <Badge variant="secondary" className="text-xs">
                                {entry.year}
                              </Badge>
                            )}
                            {entry.doi && (
                              <Badge className="text-xs bg-green-500/10 text-green-600">
                                DOI
                              </Badge>
                            )}
                          </div>
                          <p className="font-medium text-sm line-clamp-2">{entry.title}</p>
                          {entry.authors && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {entry.authors}
                            </p>
                          )}
                          {entry.journal && (
                            <p className="text-xs text-muted-foreground italic">
                              {entry.journal}
                            </p>
                          )}
                        </div>
                        {selectedBibIds.includes(entry.id) && (
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Aucune référence trouvée</p>
                      <p className="text-sm mt-1">Modifiez vos critères de recherche</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        {/* Bouton de génération */}
        <div className="flex justify-center mb-8">
          <Button 
            size="lg" 
            onClick={generateCitations}
            disabled={selectedBibIds.length === 0}
          >
            <FileText className="h-5 w-5 mr-2" />
            Générer les citations ({selectedBibIds.length} références)
          </Button>
        </div>

        {/* Résultat des citations */}
        {generatedCitations && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Citations Générées</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copier
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger .{format === "bibtex" ? "bib" : "txt"}
                  </Button>
                </div>
              </div>
              <CardDescription>
                Format: {format.toUpperCase()} — {selectedBibIds.length} référence(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={generatedCitations}
                readOnly
                className="min-h-[300px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        )}

        {/* Guide des formats */}
        <Card>
          <CardHeader>
            <CardTitle>Guide des Formats de Citation</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="bibtex">
              <TabsList>
                <TabsTrigger value="bibtex">BibTeX</TabsTrigger>
                <TabsTrigger value="apa">APA</TabsTrigger>
                <TabsTrigger value="chicago">Chicago</TabsTrigger>
              </TabsList>
              
              <TabsContent value="bibtex" className="mt-4">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    BibTeX est le format standard pour les documents LaTeX et les systèmes de gestion 
                    bibliographique comme Zotero, Mendeley ou EndNote.
                  </p>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
{`@article{smith2024cannabis,
  title = {Terpene profiles in Cannabis sativa L.},
  author = {Smith, J. and Doe, A.},
  year = {2024},
  journal = {Journal of Natural Products},
  volume = {87},
  pages = {1234-1245},
  doi = {10.1021/acs.jnatprod.2024}
}`}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="apa" className="mt-4">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Le format APA (American Psychological Association) est le standard pour les sciences 
                    sociales, l'éducation et les sciences naturelles.
                  </p>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                    <p>Smith, J., & Doe, A. (2024). Terpene profiles in Cannabis sativa L. 
                    *Journal of Natural Products*, 87, 1234-1245. https://doi.org/10.1021/acs.jnatprod.2024</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="chicago" className="mt-4">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Le format Chicago est privilégié dans les sciences humaines, l'histoire et les arts.
                  </p>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                    <p>Smith, J., and A. Doe. "Terpene profiles in Cannabis sativa L." 
                    *Journal of Natural Products* 87 (2024): 1234-1245. https://doi.org/10.1021/acs.jnatprod.2024.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}
