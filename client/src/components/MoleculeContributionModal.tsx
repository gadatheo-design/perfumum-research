import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, FlaskConical, BookOpen, Stethoscope, Tag, Image, FileText, LogIn } from "lucide-react";
import { Link } from "wouter";

type ContribType = 'source' | 'therapeutic' | 'usage' | 'synonym' | 'image' | 'note';

const TYPES: { value: ContribType; label: string; icon: React.ReactNode; description: string }[] = [
  { value: 'source', label: 'Source scientifique', icon: <BookOpen className="w-4 h-4" />, description: 'Ajouter une référence bibliographique ou une source documentée' },
  { value: 'therapeutic', label: 'Propriété thérapeutique', icon: <Stethoscope className="w-4 h-4" />, description: 'Documenter une propriété thérapeutique ou pharmacologique' },
  { value: 'usage', label: 'Usage / Application', icon: <FlaskConical className="w-4 h-4" />, description: 'Décrire un usage en parfumerie, cosmétique, médecine...' },
  { value: 'synonym', label: 'Synonyme / Nom alternatif', icon: <Tag className="w-4 h-4" />, description: 'Ajouter un synonyme, nom IUPAC, nom commun ou traduction' },
  { value: 'image', label: 'Image / Structure', icon: <Image className="w-4 h-4" />, description: 'Proposer une image de la structure moléculaire ou de la molécule' },
  { value: 'note', label: 'Note de recherche', icon: <FileText className="w-4 h-4" />, description: 'Ajouter une note, observation ou commentaire scientifique' },
];

const EVIDENCE_LEVELS = [
  { value: 'in_vitro', label: 'In vitro' },
  { value: 'in_vivo', label: 'In vivo (animal)' },
  { value: 'clinical', label: 'Essai clinique' },
  { value: 'review', label: 'Revue systématique / méta-analyse' },
  { value: 'traditional', label: 'Usage traditionnel documenté' },
  { value: 'anecdotal', label: 'Anecdotique / non validé' },
];

type Props = {
  open: boolean;
  onClose: () => void;
  moleculeId: number;
  moleculeName: string;
  defaultType?: ContribType;
};

export function MoleculeContributionModal({ open, onClose, moleculeId, moleculeName, defaultType }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [type, setType] = useState<ContribType>(defaultType || 'note');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Champs source
  const [sourceTitle, setSourceTitle] = useState("");
  const [sourceAuthors, setSourceAuthors] = useState("");
  const [sourceYear, setSourceYear] = useState<number | undefined>();
  const [sourceDoi, setSourceDoi] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");

  // Champs thérapeutique
  const [therapeuticProperty, setTherapeuticProperty] = useState("");
  const [therapeuticEvidence, setTherapeuticEvidence] = useState("");
  const [therapeuticNotes, setTherapeuticNotes] = useState("");

  // Champs usage
  const [usageContext, setUsageContext] = useState("");
  const [usageDescription, setUsageDescription] = useState("");

  // Champs synonyme
  const [synonymName, setSynonymName] = useState("");
  const [synonymLanguage, setSynonymLanguage] = useState("");

  // Champs image
  const [imageUrl, setImageUrl] = useState("");
  const [imageCaption, setImageCaption] = useState("");

  // Champs note
  const [noteContent, setNoteContent] = useState("");
  const [noteCategory, setNoteCategory] = useState("");

  // Description commune
  const [description, setDescription] = useState("");
  const [bibliographyRefs, setBibliographyRefs] = useState("");

  const submitMutation = trpc.moleculeContributions.submit.useMutation();

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await submitMutation.mutateAsync({
        moleculeId,
        contributionType: type,
        sourceTitle: sourceTitle || undefined,
        sourceAuthors: sourceAuthors || undefined,
        sourceYear: sourceYear || undefined,
        sourceDoi: sourceDoi || undefined,
        sourceUrl: sourceUrl || undefined,
        therapeuticProperty: therapeuticProperty || undefined,
        therapeuticEvidence: therapeuticEvidence || undefined,
        therapeuticNotes: therapeuticNotes || undefined,
        usageContext: usageContext || undefined,
        usageDescription: usageDescription || undefined,
        synonymName: synonymName || undefined,
        synonymLanguage: synonymLanguage || undefined,
        imageUrl: imageUrl || undefined,
        imageCaption: imageCaption || undefined,
        noteContent: noteContent || undefined,
        noteCategory: noteCategory || undefined,
        description: description || undefined,
        bibliographyRefs: bibliographyRefs || undefined,
      });
      toast({ title: "Contribution soumise", description: "Elle sera examinée par l'équipe PERFUMUM avant publication." });
      onClose();
      resetForm();
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSourceTitle(""); setSourceAuthors(""); setSourceYear(undefined); setSourceDoi(""); setSourceUrl("");
    setTherapeuticProperty(""); setTherapeuticEvidence(""); setTherapeuticNotes("");
    setUsageContext(""); setUsageDescription("");
    setSynonymName(""); setSynonymLanguage("");
    setImageUrl(""); setImageCaption("");
    setNoteContent(""); setNoteCategory("");
    setDescription(""); setBibliographyRefs("");
  };

  const selectedType = TYPES.find(t => t.value === type);

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-purple-500" />
            Contribuer à la fiche molécule
          </DialogTitle>
          <DialogDescription>
            <span className="font-medium text-foreground">{moleculeName}</span>
            {" — "}Votre contribution sera examinée avant publication.
          </DialogDescription>
        </DialogHeader>

        {!user ? (
          <div className="py-6 text-center space-y-3">
            <p className="text-muted-foreground text-sm">Vous devez être connecté pour contribuer.</p>
            <Link href="/login"><Button size="sm"><LogIn className="w-4 h-4 mr-2" />Se connecter</Button></Link>
          </div>
        ) : (
          <div className="space-y-5 pt-2">
            {/* Sélection du type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Type de contribution</Label>
              <div className="grid grid-cols-2 gap-2">
                {TYPES.map(t => (
                  <button
                    key={t.value}
                    onClick={() => setType(t.value)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-sm transition-colors ${
                      type === t.value
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300'
                        : 'border-border hover:border-muted-foreground/50'
                    }`}
                  >
                    {t.icon}
                    <span className="font-medium text-xs">{t.label}</span>
                  </button>
                ))}
              </div>
              {selectedType && (
                <p className="text-xs text-muted-foreground">{selectedType.description}</p>
              )}
            </div>

            {/* Champs spécifiques au type */}
            {type === 'source' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Titre de la publication *</Label>
                  <Input placeholder="ex: Olfactory properties of linalool..." value={sourceTitle} onChange={e => setSourceTitle(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Auteurs</Label>
                    <Input placeholder="ex: Smith J., Doe A." value={sourceAuthors} onChange={e => setSourceAuthors(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Année</Label>
                    <Input type="number" min={1800} max={2030} placeholder="2024" value={sourceYear ?? ""} onChange={e => setSourceYear(e.target.value ? parseInt(e.target.value) : undefined)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">DOI</Label>
                    <Input placeholder="10.1234/..." value={sourceDoi} onChange={e => setSourceDoi(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">URL</Label>
                    <Input placeholder="https://..." value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {type === 'therapeutic' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Propriété thérapeutique *</Label>
                  <Input placeholder="ex: Anti-inflammatoire, Anxiolytique, Antifongique..." value={therapeuticProperty} onChange={e => setTherapeuticProperty(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Niveau de preuve</Label>
                  <Select value={therapeuticEvidence} onValueChange={setTherapeuticEvidence}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                    <SelectContent>
                      {EVIDENCE_LEVELS.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Notes / détails</Label>
                  <Textarea placeholder="Mécanisme d'action, dosage, contexte d'utilisation..." value={therapeuticNotes} onChange={e => setTherapeuticNotes(e.target.value)} rows={3} />
                </div>
              </div>
            )}

            {type === 'usage' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Contexte d'usage *</Label>
                  <Input placeholder="ex: Parfumerie fine, Aromathérapie, Tabac, Cosmétique..." value={usageContext} onChange={e => setUsageContext(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Description de l'usage</Label>
                  <Textarea placeholder="Comment cette molécule est utilisée dans ce contexte..." value={usageDescription} onChange={e => setUsageDescription(e.target.value)} rows={3} />
                </div>
              </div>
            )}

            {type === 'synonym' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Nom synonyme *</Label>
                  <Input placeholder="ex: (R)-Linalool, 3,7-dimethylocta-1,6-dien-3-ol..." value={synonymName} onChange={e => setSynonymName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Langue / Système de nomenclature</Label>
                  <Input placeholder="ex: IUPAC, Français, Anglais, CAS, INCI..." value={synonymLanguage} onChange={e => setSynonymLanguage(e.target.value)} />
                </div>
              </div>
            )}

            {type === 'image' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">URL de l'image *</Label>
                  <Input placeholder="https://..." value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
                </div>
                {imageUrl && (
                  <div className="rounded-md overflow-hidden border max-h-32">
                    <img src={imageUrl} alt="Aperçu" className="w-full h-full object-contain" onError={e => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
                <div className="space-y-1">
                  <Label className="text-xs">Légende</Label>
                  <Input placeholder="ex: Structure 2D de la molécule (source: PubChem)" value={imageCaption} onChange={e => setImageCaption(e.target.value)} />
                </div>
              </div>
            )}

            {type === 'note' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Catégorie</Label>
                  <Input placeholder="ex: Olfaction, Chimie, Histoire, Toxicologie..." value={noteCategory} onChange={e => setNoteCategory(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Note *</Label>
                  <Textarea placeholder="Votre observation, correction ou commentaire scientifique..." value={noteContent} onChange={e => setNoteContent(e.target.value)} rows={4} />
                </div>
              </div>
            )}

            {/* Description commune + sources */}
            <div className="space-y-3 pt-1 border-t">
              <div className="space-y-1">
                <Label className="text-xs">Description complémentaire</Label>
                <Textarea placeholder="Contexte supplémentaire, précisions..." value={description} onChange={e => setDescription(e.target.value)} rows={2} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Sources bibliographiques</Label>
                <Input placeholder="ex: Arctander 1960, Leffingwell 2002..." value={bibliographyRefs} onChange={e => setBibliographyRefs(e.target.value)} />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Annuler</Button>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700 text-white">
                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Soumettre la contribution
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
