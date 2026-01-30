import { useState } from "react";
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
import { 
  BookOpen, 
  Copy, 
  Download, 
  Search,
  FileText,
  Beaker,
  FlaskConical,
  CheckCircle
} from "lucide-react";

type CitationFormat = "apa" | "chicago" | "bibtex";

export default function ExportBibliographique() {
  const { toast } = useToast();
  const [format, setFormat] = useState<CitationFormat>("apa");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMoleculeIds, setSelectedMoleculeIds] = useState<number[]>([]);
  const [selectedRecetteIds, setSelectedRecetteIds] = useState<number[]>([]);
  const [generatedCitations, setGeneratedCitations] = useState<string>("");

  // Récupérer toutes les molécules
  const { data: molecules } = trpc.molecules.list.useQuery();
  
  // Récupérer toutes les recettes
  const { data: recettes } = trpc.recettes.list.useQuery();

  // Générer les citations groupées
  // @ts-ignore - Cette procédure sera ajoutée ultérieurement
  const { data: bulkCitations, refetch: generateBulkCitations } = trpc.bibliography.generateBulkCitations?.useQuery?.(
    {
      moleculeIds: selectedMoleculeIds.length > 0 ? selectedMoleculeIds : undefined,
      recetteIds: selectedRecetteIds.length > 0 ? selectedRecetteIds : undefined,
      format,
    },
    { enabled: false }
  );

  // Filtrer les molécules par recherche
  const filteredMolecules = molecules?.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.casNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.iupacName?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Filtrer les recettes par recherche
  const filteredRecettes = recettes?.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleToggleMolecule = (id: number) => {
    setSelectedMoleculeIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleToggleRecette = (id: number) => {
    setSelectedRecetteIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAllMolecules = () => {
    if (selectedMoleculeIds.length === filteredMolecules.length) {
      setSelectedMoleculeIds([]);
    } else {
      setSelectedMoleculeIds(filteredMolecules.map(m => m.id));
    }
  };

  const handleSelectAllRecettes = () => {
    if (selectedRecetteIds.length === filteredRecettes.length) {
      setSelectedRecetteIds([]);
    } else {
      setSelectedRecetteIds(filteredRecettes.map(r => r.id));
    }
  };

  const handleGenerateCitations = async () => {
    if (selectedMoleculeIds.length === 0 && selectedRecetteIds.length === 0) {
      toast({
        title: "Sélection vide",
        description: "Veuillez sélectionner au moins une molécule ou une recette.",
        variant: "destructive",
      });
      return;
    }

    const result = await generateBulkCitations();
    if (result.data) {
      const citations = result.data.citations.map((c: any) => c.citation).join("\n\n");
      setGeneratedCitations(citations);
      toast({
        title: "Citations générées",
        description: `${result.data.count} citation(s) générée(s) au format ${format.toUpperCase()}.`,
      });
    }
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
  };

  const formatDescriptions: Record<CitationFormat, string> = {
    apa: "American Psychological Association (7ème édition) - Standard pour les sciences sociales et naturelles",
    chicago: "Chicago Manual of Style (17ème édition) - Standard pour les sciences humaines",
    bibtex: "BibTeX - Format pour LaTeX et systèmes de gestion bibliographique",
  };

  return (
    <div className="container py-8 max-w-7xl">
      <div className="flex items-center gap-4 mb-8">
        <BookOpen className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Export Bibliographique</h1>
          <p className="text-muted-foreground">
            Générer des citations formatées pour vos publications académiques
          </p>
        </div>
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
                  <SelectItem value="apa">APA (7ème édition)</SelectItem>
                  <SelectItem value="chicago">Chicago (17ème édition)</SelectItem>
                  <SelectItem value="bibtex">BibTeX</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-[2] text-sm text-muted-foreground">
              {formatDescriptions[format]}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sélection des molécules */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Beaker className="h-5 w-5" />
                <CardTitle>Molécules</CardTitle>
              </div>
              <Badge variant="outline">
                {selectedMoleculeIds.length} sélectionnée(s)
              </Badge>
            </div>
            <CardDescription>
              Sélectionnez les molécules à citer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, CAS, IUPAC..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={handleSelectAllMolecules}>
                  {selectedMoleculeIds.length === filteredMolecules.length 
                    ? "Désélectionner" 
                    : "Tout sélectionner"}
                </Button>
              </div>

              <ScrollArea className="h-[300px] border rounded-lg">
                <div className="p-2 space-y-1">
                  {filteredMolecules.slice(0, 100).map((molecule) => (
                    <div
                      key={molecule.id}
                      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors ${
                        selectedMoleculeIds.includes(molecule.id) ? "bg-accent" : ""
                      }`}
                      onClick={() => handleToggleMolecule(molecule.id)}
                    >
                      <Checkbox
                        checked={selectedMoleculeIds.includes(molecule.id)}
                        onCheckedChange={() => handleToggleMolecule(molecule.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{molecule.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {molecule.casNumber && `CAS: ${molecule.casNumber}`}
                          {molecule.casNumber && molecule.iupacName && " • "}
                          {molecule.iupacName && molecule.iupacName.substring(0, 40)}
                        </p>
                      </div>
                      {selectedMoleculeIds.includes(molecule.id) && (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  ))}
                  {filteredMolecules.length > 100 && (
                    <p className="text-center text-sm text-muted-foreground py-2">
                      +{filteredMolecules.length - 100} autres molécules...
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        {/* Sélection des recettes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                <CardTitle>Recettes</CardTitle>
              </div>
              <Badge variant="outline">
                {selectedRecetteIds.length} sélectionnée(s)
              </Badge>
            </div>
            <CardDescription>
              Sélectionnez les recettes à citer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom ou code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={handleSelectAllRecettes}>
                  {selectedRecetteIds.length === filteredRecettes.length 
                    ? "Désélectionner" 
                    : "Tout sélectionner"}
                </Button>
              </div>

              <ScrollArea className="h-[300px] border rounded-lg">
                <div className="p-2 space-y-1">
                  {filteredRecettes.slice(0, 100).map((recette) => (
                    <div
                      key={recette.id}
                      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors ${
                        selectedRecetteIds.includes(recette.id) ? "bg-accent" : ""
                      }`}
                      onClick={() => handleToggleRecette(recette.id)}
                    >
                      <Checkbox
                        checked={selectedRecetteIds.includes(recette.id)}
                        onCheckedChange={() => handleToggleRecette(recette.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{recette.name}</p>
                        {recette.category && (
                          <p className="text-xs text-muted-foreground capitalize">
                            {recette.category}
                          </p>
                        )}
                      </div>
                      {selectedRecetteIds.includes(recette.id) && (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  ))}
                  {filteredRecettes.length > 100 && (
                    <p className="text-center text-sm text-muted-foreground py-2">
                      +{filteredRecettes.length - 100} autres recettes...
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bouton de génération */}
      <div className="flex justify-center mb-8">
        <Button 
          size="lg" 
          onClick={handleGenerateCitations}
          disabled={selectedMoleculeIds.length === 0 && selectedRecetteIds.length === 0}
        >
          <FileText className="h-5 w-5 mr-2" />
          Générer les citations ({selectedMoleculeIds.length + selectedRecetteIds.length} éléments)
        </Button>
      </div>

      {/* Résultat des citations */}
      {generatedCitations && (
        <Card>
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
                  Télécharger
                </Button>
              </div>
            </div>
            <CardDescription>
              Format: {format.toUpperCase()}
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
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Guide des Formats de Citation</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="apa">
            <TabsList>
              <TabsTrigger value="apa">APA</TabsTrigger>
              <TabsTrigger value="chicago">Chicago</TabsTrigger>
              <TabsTrigger value="bibtex">BibTeX</TabsTrigger>
            </TabsList>
            
            <TabsContent value="apa" className="mt-4">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Le format APA (American Psychological Association) est le standard pour les sciences 
                  sociales, l'éducation et les sciences naturelles.
                </p>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <p className="font-medium mb-2">Exemple pour une molécule PubChem:</p>
                  <p>National Center for Biotechnology Information (2026). PubChem Compound Summary 
                  for CID 6654, Limonene. Retrieved 4 janvier 2026, from 
                  https://pubchem.ncbi.nlm.nih.gov/compound/6654</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="chicago" className="mt-4">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Le format Chicago est privilégié dans les sciences humaines, l'histoire et les arts.
                </p>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <p className="font-medium mb-2">Exemple pour une molécule PubChem:</p>
                  <p>National Center for Biotechnology Information. "PubChem Compound Summary for 
                  CID 6654, Limonene." PubChem. Accessed 4 janvier 2026. 
                  https://pubchem.ncbi.nlm.nih.gov/compound/6654.</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="bibtex" className="mt-4">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  BibTeX est le format standard pour les documents LaTeX et les systèmes de gestion 
                  bibliographique comme Zotero, Mendeley ou EndNote.
                </p>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
{`@misc{pubchem_limonene,
  author = {{National Center for Biotechnology Information}},
  title = {PubChem Compound Summary for CID 6654, Limonene},
  year = {2026},
  url = {https://pubchem.ncbi.nlm.nih.gov/compound/6654},
  note = {Accessed: 4 janvier 2026, CAS: 138-86-3}
}`}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
