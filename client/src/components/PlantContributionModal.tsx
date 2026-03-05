import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Image as ImageIcon,
  FlaskConical,
  MapPin,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlantContributionModalProps {
  plantId: number;
  plantName: string;
  defaultTab?: "image" | "molecule" | "terroir" | "note";
}

export function PlantContributionModal({
  plantId,
  plantName,
  defaultTab = "image",
}: PlantContributionModalProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"image" | "molecule" | "terroir" | "note">(defaultTab);

  // Form states
  const [imageUrl, setImageUrl] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [imageSource, setImageSource] = useState("");
  const [moleculeName, setMoleculeName] = useState("");
  const [moleculeConcentration, setMoleculeConcentration] = useState("");
  const [moleculeSource, setMoleculeSource] = useState("");
  const [terroir, setTerroir] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("");
  const [terroirNotes, setTerroirNotes] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteCategory, setNoteCategory] = useState("observation");
  const [description, setDescription] = useState("");
  const [references, setReferences] = useState("");

  // Molecule search
  const [moleculeSearch, setMoleculeSearch] = useState("");
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<number | undefined>();
  const { data: moleculeSearchData } = trpc.molecules.search.useQuery(
    { query: moleculeSearch, limit: 10 },
    { enabled: moleculeSearch.length >= 2 }
  );
  const moleculeResults = moleculeSearchData?.molecules;

  const utils = trpc.useUtils();
  const submitMutation = trpc.plantContributions.submit.useMutation({
    onSuccess: () => {
      toast({
        title: "Contribution soumise",
        description: "Votre contribution est en attente de validation par un administrateur.",
      });
      setOpen(false);
      resetForm();
      utils.plantContributions.getByPlant.invalidate({ plantId });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setImageUrl(""); setImageCaption(""); setImageSource("");
    setMoleculeName(""); setMoleculeConcentration(""); setMoleculeSource("");
    setSelectedMoleculeId(undefined); setMoleculeSearch("");
    setTerroir(""); setRegion(""); setCountry(""); setTerroirNotes("");
    setNoteContent(""); setNoteCategory("observation");
    setDescription(""); setReferences("");
  };

  const handleSubmit = () => {
    const baseData = {
      plantId,
      contributionType: activeTab as "image" | "molecule" | "terroir" | "note",
      description: description || undefined,
      references: references || undefined,
    };

    if (activeTab === "image") {
      if (!imageUrl) {
        toast({ title: "URL requise", description: "Veuillez fournir une URL d'image.", variant: "destructive" });
        return;
      }
      submitMutation.mutate({ ...baseData, imageUrl, imageCaption: imageCaption || undefined, imageSource: imageSource || undefined });
    } else if (activeTab === "molecule") {
      if (!moleculeName && !selectedMoleculeId) {
        toast({ title: "Molécule requise", description: "Veuillez sélectionner ou nommer une molécule.", variant: "destructive" });
        return;
      }
      submitMutation.mutate({
        ...baseData,
        moleculeId: selectedMoleculeId,
        moleculeName: moleculeName || undefined,
        moleculeConcentration: moleculeConcentration || undefined,
        moleculeSource: moleculeSource || undefined,
      });
    } else if (activeTab === "terroir") {
      if (!terroir && !region) {
        toast({ title: "Terroir requis", description: "Veuillez indiquer le terroir ou la région.", variant: "destructive" });
        return;
      }
      submitMutation.mutate({
        ...baseData,
        terroir: terroir || undefined,
        region: region || undefined,
        country: country || undefined,
        terroirNotes: terroirNotes || undefined,
      });
    } else if (activeTab === "note") {
      if (!noteContent) {
        toast({ title: "Contenu requis", description: "Veuillez rédiger votre note.", variant: "destructive" });
        return;
      }
      submitMutation.mutate({
        ...baseData,
        noteContent,
        noteCategory: noteCategory || undefined,
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <Button variant="outline" size="sm" disabled className="gap-2">
        <Plus className="h-4 w-4" />
        Contribuer (connexion requise)
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Contribuer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Contribuer à la fiche de {plantName}
          </DialogTitle>
          <DialogDescription>
            Votre contribution sera examinée par un administrateur avant d'être publiée.
            Merci de fournir des informations précises et sourcées.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="image" className="gap-1.5">
              <ImageIcon className="h-3.5 w-3.5" />
              Image
            </TabsTrigger>
            <TabsTrigger value="molecule" className="gap-1.5">
              <FlaskConical className="h-3.5 w-3.5" />
              Molécule
            </TabsTrigger>
            <TabsTrigger value="terroir" className="gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              Terroir
            </TabsTrigger>
            <TabsTrigger value="note" className="gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Note
            </TabsTrigger>
          </TabsList>

          {/* Onglet Image */}
          <TabsContent value="image" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL de l'image *</Label>
              <Input
                id="imageUrl"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Lien vers une image publique (Wikimedia Commons, herbier numérique, etc.)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageCaption">Légende</Label>
              <Input
                id="imageCaption"
                placeholder="Description de l'image..."
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageSource">Source / Auteur</Label>
              <Input
                id="imageSource"
                placeholder="Nom de l'auteur, institution, licence..."
                value={imageSource}
                onChange={(e) => setImageSource(e.target.value)}
              />
            </div>
            {imageUrl && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1">Aperçu :</p>
                <img
                  src={imageUrl}
                  alt="Aperçu"
                  className="max-h-40 rounded border object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            )}
          </TabsContent>

          {/* Onglet Molécule */}
          <TabsContent value="molecule" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Rechercher une molécule existante</Label>
              <Input
                placeholder="Nom de la molécule (ex: Linalool, Limonène...)"
                value={moleculeSearch}
                onChange={(e) => {
                  setMoleculeSearch(e.target.value);
                  if (!e.target.value) { setSelectedMoleculeId(undefined); setMoleculeName(""); }
                }}
              />
              {moleculeResults && moleculeResults.length > 0 && moleculeSearch.length >= 2 && (
                <div className="border rounded-md divide-y max-h-48 overflow-y-auto">
                  {moleculeResults.map((mol: any) => (
                    <button
                      key={mol.id}
                      type="button"
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${selectedMoleculeId === mol.id ? 'bg-primary/10' : ''}`}
                      onClick={() => {
                        setSelectedMoleculeId(mol.id);
                        setMoleculeName(mol.name);
                        setMoleculeSearch(mol.name);
                      }}
                    >
                      <span className="font-medium">{mol.name}</span>
                      {mol.family && <span className="text-muted-foreground ml-2 text-xs">({mol.family})</span>}
                    </button>
                  ))}
                </div>
              )}
              {selectedMoleculeId && (
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Molécule sélectionnée : {moleculeName}
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="molName">Ou nom libre (si non trouvée)</Label>
              <Input
                id="molName"
                placeholder="Nom de la molécule..."
                value={selectedMoleculeId ? moleculeName : moleculeName}
                onChange={(e) => { if (!selectedMoleculeId) setMoleculeName(e.target.value); }}
                disabled={!!selectedMoleculeId}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="molConc">Concentration typique</Label>
                <Input
                  id="molConc"
                  placeholder="ex: 0.5-2%, traces..."
                  value={moleculeConcentration}
                  onChange={(e) => setMoleculeConcentration(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="molSource">Source scientifique</Label>
                <Input
                  id="molSource"
                  placeholder="DOI, publication, GC-MS..."
                  value={moleculeSource}
                  onChange={(e) => setMoleculeSource(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Onglet Terroir */}
          <TabsContent value="terroir" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="terroir">Terroir / Lieu-dit</Label>
                <Input
                  id="terroir"
                  placeholder="ex: Grasse, Vallée du Draa..."
                  value={terroir}
                  onChange={(e) => setTerroir(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Région</Label>
                <Input
                  id="region"
                  placeholder="ex: Provence, Haut-Atlas..."
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Pays</Label>
              <Input
                id="country"
                placeholder="ex: France, Maroc..."
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="terroirNotes">Notes sur le terroir</Label>
              <Textarea
                id="terroirNotes"
                placeholder="Caractéristiques du sol, altitude, microclima, particularités aromatiques..."
                value={terroirNotes}
                onChange={(e) => setTerroirNotes(e.target.value)}
                rows={3}
              />
            </div>
          </TabsContent>

          {/* Onglet Note */}
          <TabsContent value="note" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="noteCategory">Catégorie</Label>
              <Select value={noteCategory} onValueChange={setNoteCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="observation">Observation de terrain</SelectItem>
                  <SelectItem value="olfactive">Note olfactive</SelectItem>
                  <SelectItem value="historique">Note historique</SelectItem>
                  <SelectItem value="ethnobotanique">Ethnobotanique</SelectItem>
                  <SelectItem value="chimique">Chimie / Composition</SelectItem>
                  <SelectItem value="correction">Correction / Erreur</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="noteContent">Contenu de la note *</Label>
              <Textarea
                id="noteContent"
                placeholder="Décrivez votre observation, correction ou information..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={5}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Champs communs */}
        <div className="space-y-4 mt-4 pt-4 border-t">
          <div className="space-y-2">
            <Label htmlFor="description">Description / Contexte</Label>
            <Textarea
              id="description"
              placeholder="Contexte de votre contribution, méthode d'observation..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="references">Références bibliographiques</Label>
            <Input
              id="references"
              placeholder="DOI, ISBN, URL, auteur + année..."
              value={references}
              onChange={(e) => setReferences(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
            className="gap-2"
          >
            {submitMutation.isPending ? (
              <>Envoi en cours...</>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Soumettre la contribution
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Composant pour afficher les contributions en attente sur la fiche plante
interface PlantContributionsBannerProps {
  plantId: number;
  isAdmin?: boolean;
}

export function PlantContributionsBanner({ plantId, isAdmin }: PlantContributionsBannerProps) {
  const [expanded, setExpanded] = useState(false);
  const { data: contributions } = trpc.plantContributions.getByPlant.useQuery(
    { plantId, status: "pending" },
    { enabled: !!isAdmin }
  );

  if (!isAdmin || !contributions || contributions.length === 0) return null;

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-4">
      <button
        type="button"
        className="w-full flex items-center justify-between text-sm font-medium text-amber-700"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {contributions.length} contribution{contributions.length > 1 ? 's' : ''} en attente de validation
        </span>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {expanded && (
        <div className="mt-3 space-y-2">
          {contributions.map((c: any) => (
            <div key={c.id} className="bg-background rounded p-2 text-xs border">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="capitalize text-xs">{c.contribution_type}</Badge>
                <span className="text-muted-foreground">{c.user_name || 'Anonyme'}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">
                  {new Date(c.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
              {c.description && <p className="text-muted-foreground">{c.description}</p>}
            </div>
          ))}
          <a href="/admin/contributions" className="text-xs text-primary hover:underline">
            → Gérer dans l'interface admin
          </a>
        </div>
      )}
    </div>
  );
}

// Badge de statut de contribution
export function ContributionStatusBadge({ status }: { status: string }) {
  if (status === 'pending') return (
    <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/30 gap-1">
      <Clock className="h-3 w-3" />
      En attente
    </Badge>
  );
  if (status === 'approved') return (
    <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/30 gap-1">
      <CheckCircle className="h-3 w-3" />
      Approuvée
    </Badge>
  );
  return (
    <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-500/30 gap-1">
      <XCircle className="h-3 w-3" />
      Rejetée
    </Badge>
  );
}
