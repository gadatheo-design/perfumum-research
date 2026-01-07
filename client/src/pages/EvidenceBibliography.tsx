import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  BookOpen,
  Link2,
  Search,
  FileText,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Calendar,
  User,
  Sparkles,
  Shield,
  Clock,
} from "lucide-react";
import { Link } from "wouter";

// Types de liens
const linkTypeLabels: Record<string, string> = {
  primary: "Source primaire",
  secondary: "Source secondaire",
  methodology: "Méthodologie",
  context: "Contexte",
};

const linkTypeColors: Record<string, string> = {
  primary: "bg-green-500",
  secondary: "bg-blue-500",
  methodology: "bg-purple-500",
  context: "bg-orange-500",
};

// Composant pour une correspondance bibliographique
function BibliographyMatchCard({
  match,
  onLink,
  isLinking,
}: {
  match: {
    entry: {
      id: number;
      entryKey: string;
      title: string;
      authors: string | null;
      year: number | null;
      journal: string | null;
      doi: string | null;
    };
    matchType: string;
    matchScore: number;
  };
  onLink: (linkType: string) => void;
  isLinking: boolean;
}) {
  const [selectedLinkType, setSelectedLinkType] = useState("primary");

  const getMatchTypeLabel = (type: string) => {
    switch (type) {
      case "doi":
        return "DOI";
      case "title":
        return "Titre";
      case "author_year":
        return "Auteur + Année";
      default:
        return type;
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-orange-500";
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="font-medium line-clamp-2">{match.entry.title}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {match.entry.authors && (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {match.entry.authors.split(",")[0]}
                  {match.entry.authors.includes(",") && " et al."}
                </span>
              )}
              {match.entry.year && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {match.entry.year}
                </span>
              )}
            </div>
            {match.entry.journal && (
              <p className="text-xs text-muted-foreground italic">{match.entry.journal}</p>
            )}
          </div>
          <div className="text-right ml-4">
            <Badge variant="outline" className="text-xs mb-1">
              {getMatchTypeLabel(match.matchType)}
            </Badge>
            <p className={`text-lg font-bold ${getMatchColor(match.matchScore)}`}>
              {match.matchScore}%
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <Select value={selectedLinkType} onValueChange={setSelectedLinkType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(linkTypeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={() => onLink(selectedLinkType)} disabled={isLinking}>
            <Link2 className="h-4 w-4 mr-1" />
            Lier
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Composant pour une évidence
function EvidenceCard({
  evidence,
  onSelect,
  isSelected,
  linkedCount,
}: {
  evidence: {
    id: number;
    evidenceId: string;
    moleculeName: string | null;
    referenceTitle: string | null;
    referenceId: string | null;
    confidence: string | null;
    doi: string | null;
  };
  onSelect: () => void;
  isSelected: boolean;
  linkedCount: number;
}) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="font-medium">{evidence.evidenceId}</span>
              {linkedCount > 0 ? (
                <Badge variant="default" className="text-xs bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {linkedCount} lien{linkedCount > 1 ? "s" : ""}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Non liée
                </Badge>
              )}
            </div>
            {evidence.moleculeName && (
              <p className="text-sm text-muted-foreground">
                Molécule: {evidence.moleculeName}
              </p>
            )}
            {evidence.referenceTitle && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                Réf: {evidence.referenceTitle}
              </p>
            )}
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

// Composant principal
export default function EvidenceBibliography() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvidence, setSelectedEvidence] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("evidence");

  const utils = trpc.useUtils();

  // Requêtes
  const { data: allEvidence, isLoading: isLoadingEvidence } =
    trpc.lostMolecules.evidence.list.useQuery();
  const { data: allLinks } = trpc.lostMolecules.evidenceBibLinks.list.useQuery();
  const { data: potentialMatches, isLoading: isLoadingMatches } =
    trpc.lostMolecules.bibliography.findMatchesForEvidence.useQuery(selectedEvidence!, {
      enabled: selectedEvidence !== null,
    });
  const { data: bibStats } = trpc.lostMolecules.bibliography.getStats.useQuery();

  // Mutations
  const createLinkMutation = trpc.lostMolecules.evidenceBibLinks.create.useMutation({
    onSuccess: () => {
      toast.success("Lien créé avec succès");
      utils.lostMolecules.evidenceBibLinks.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const autoLinkMutation = trpc.lostMolecules.evidenceBibLinks.autoLink.useMutation({
    onSuccess: (links) => {
      if (links.length > 0) {
        toast.success(`${links.length} lien(s) créé(s) automatiquement`);
        utils.lostMolecules.evidenceBibLinks.list.invalidate();
      } else {
        toast.info("Aucun lien automatique trouvé (score < 80%)");
      }
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Comptage des liens par évidence
  const linkCountByEvidence = useMemo(() => {
    if (!allLinks) return new Map<number, number>();
    const counts = new Map<number, number>();
    allLinks.forEach((link) => {
      counts.set(link.evidenceId, (counts.get(link.evidenceId) || 0) + 1);
    });
    return counts;
  }, [allLinks]);

  // Filtrage
  const filteredEvidence = useMemo(() => {
    if (!allEvidence) return [];
    return allEvidence.filter(
      (e) =>
        e.evidenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.moleculeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.referenceTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allEvidence, searchTerm]);

  // Évidence sélectionnée
  const selectedEvidenceData = useMemo(() => {
    if (selectedEvidence === null || !allEvidence) return null;
    return allEvidence.find((e) => e.id === selectedEvidence);
  }, [selectedEvidence, allEvidence]);

  // Statistiques
  const linkedEvidenceCount = useMemo(() => {
    return linkCountByEvidence.size;
  }, [linkCountByEvidence]);

  return (
    <div className="container py-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Liaison Évidences-Bibliographie
          </h1>
          <p className="text-muted-foreground mt-1">
            Connectez les évidences moléculaires aux références bibliographiques
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/bibliographie">
            <Button variant="outline" size="sm">
              <BookOpen className="h-4 w-4 mr-2" />
              Bibliographie
            </Button>
          </Link>
          <Link href="/heritage-timeline">
            <Button variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-2" />
              Timeline
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Évidences totales</CardDescription>
            <CardTitle className="text-2xl">{allEvidence?.length || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Évidences liées</CardDescription>
            <CardTitle className="text-2xl text-green-500">{linkedEvidenceCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Références bibliographiques</CardDescription>
            <CardTitle className="text-2xl">{bibStats?.totalReferences || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Liens totaux</CardDescription>
            <CardTitle className="text-2xl">{allLinks?.length || 0}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Recherche */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une évidence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des évidences */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Évidences moléculaires</CardTitle>
              <CardDescription>
                {filteredEvidence.length} évidence{filteredEvidence.length > 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-2 pr-4">
                  {isLoadingEvidence ? (
                    [1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))
                  ) : filteredEvidence.length > 0 ? (
                    filteredEvidence.map((evidence) => (
                      <EvidenceCard
                        key={evidence.id}
                        evidence={evidence}
                        onSelect={() => setSelectedEvidence(evidence.id)}
                        isSelected={selectedEvidence === evidence.id}
                        linkedCount={linkCountByEvidence.get(evidence.id) || 0}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucune évidence trouvée.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Panel de correspondances */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Correspondances bibliographiques
                  </CardTitle>
                  <CardDescription>
                    {selectedEvidenceData
                      ? `Pour: ${selectedEvidenceData.evidenceId}`
                      : "Sélectionnez une évidence"}
                  </CardDescription>
                </div>
                {selectedEvidence && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => autoLinkMutation.mutate(selectedEvidence)}
                    disabled={autoLinkMutation.isPending}
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    Auto-lier
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedEvidence === null ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Sélectionnez une évidence dans la liste de gauche</p>
                </div>
              ) : isLoadingMatches ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : potentialMatches && potentialMatches.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3 pr-4">
                    {potentialMatches.map((match) => (
                      <BibliographyMatchCard
                        key={match.entry.id}
                        match={match}
                        onLink={(linkType) =>
                          createLinkMutation.mutate({
                            evidenceId: selectedEvidence,
                            bibliographyId: match.entry.id,
                            linkType: linkType as any,
                            matchMethod: match.matchType as any,
                            matchScore: match.matchScore,
                          })
                        }
                        isLinking={createLinkMutation.isPending}
                      />
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune correspondance trouvée automatiquement.</p>
                  <p className="text-sm mt-2">
                    Vérifiez que les références sont dans la bibliographie.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Détails de l'évidence sélectionnée */}
          {selectedEvidenceData && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Détails de l'évidence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">ID</p>
                    <p className="font-mono">{selectedEvidenceData.evidenceId}</p>
                  </div>
                  {selectedEvidenceData.moleculeName && (
                    <div>
                      <p className="text-muted-foreground">Molécule</p>
                      <p>{selectedEvidenceData.moleculeName}</p>
                    </div>
                  )}
                  {selectedEvidenceData.referenceId && (
                    <div>
                      <p className="text-muted-foreground">Référence ID</p>
                      <p className="font-mono">{selectedEvidenceData.referenceId}</p>
                    </div>
                  )}
                  {selectedEvidenceData.doi && (
                    <div>
                      <p className="text-muted-foreground">DOI</p>
                      <a
                        href={`https://doi.org/${selectedEvidenceData.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        {selectedEvidenceData.doi}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                  {selectedEvidenceData.confidence && (
                    <div>
                      <p className="text-muted-foreground">Confiance</p>
                      <Badge
                        variant={
                          selectedEvidenceData.confidence === "high"
                            ? "default"
                            : selectedEvidenceData.confidence === "medium"
                            ? "secondary"
                            : "outline"
                        }
                        className="capitalize"
                      >
                        {selectedEvidenceData.confidence}
                      </Badge>
                    </div>
                  )}
                </div>
                {selectedEvidenceData.referenceTitle && (
                  <div>
                    <p className="text-muted-foreground text-sm">Titre de référence</p>
                    <p className="text-sm">{selectedEvidenceData.referenceTitle}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
