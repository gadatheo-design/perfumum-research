import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MapPin, Image, Leaf, BarChart2, History, FileText, LogIn } from "lucide-react";
import { Link } from "wouter";

type ContribType = 'image' | 'plant_link' | 'note' | 'production_data' | 'history';

const TYPES: { value: ContribType; label: string; icon: React.ReactNode; description: string }[] = [
  { value: 'image', label: 'Image / Photo', icon: <Image className="w-4 h-4" />, description: 'Proposer une photo du terroir, paysage ou culture' },
  { value: 'plant_link', label: 'Plante associée', icon: <Leaf className="w-4 h-4" />, description: 'Signaler une plante cultivée ou présente dans ce terroir' },
  { value: 'production_data', label: 'Données de production', icon: <BarChart2 className="w-4 h-4" />, description: 'Ajouter des données de production (quantité, qualité, année)' },
  { value: 'history', label: 'Histoire / Tradition', icon: <History className="w-4 h-4" />, description: 'Documenter l\'histoire ou les traditions olfactives du terroir' },
  { value: 'note', label: 'Note de recherche', icon: <FileText className="w-4 h-4" />, description: 'Ajouter une observation ou un commentaire' },
];

type Props = {
  open: boolean;
  onClose: () => void;
  terroirId: number;
  terroirName: string;
  defaultType?: ContribType;
};

export function TerroirContributionModal({ open, onClose, terroirId, terroirName, defaultType }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [type, setType] = useState<ContribType>(defaultType || 'note');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imageUrl, setImageUrl] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [plantName, setPlantName] = useState("");
  const [plantNotes, setPlantNotes] = useState("");
  const [productionYear, setProductionYear] = useState<number | undefined>();
  const [productionQuantity, setProductionQuantity] = useState("");
  const [productionQuality, setProductionQuality] = useState("");
  const [historyPeriod, setHistoryPeriod] = useState("");
  const [historyContent, setHistoryContent] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteCategory, setNoteCategory] = useState("");
  const [description, setDescription] = useState("");
  const [bibliographyRefs, setBibliographyRefs] = useState("");

  const submitMutation = trpc.terroirContributions.submit.useMutation();

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await submitMutation.mutateAsync({
        terroirId,
        contributionType: type,
        imageUrl: imageUrl || undefined,
        imageCaption: imageCaption || undefined,
        plantName: plantName || undefined,
        plantNotes: plantNotes || undefined,
        productionYear: productionYear || undefined,
        productionQuantity: productionQuantity || undefined,
        productionQuality: productionQuality || undefined,
        historyPeriod: historyPeriod || undefined,
        historyContent: historyContent || undefined,
        noteContent: noteContent || undefined,
        noteCategory: noteCategory || undefined,
        description: description || undefined,
        bibliographyRefs: bibliographyRefs || undefined,
      });
      toast({ title: "Contribution soumise", description: "Elle sera examinée avant publication." });
      onClose();
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedType = TYPES.find(t => t.value === type);

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-500" />
            Contribuer au terroir
          </DialogTitle>
          <DialogDescription>
            <span className="font-medium text-foreground">{terroirName}</span>
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
            <div className="space-y-2">
              <Label className="text-sm font-medium">Type de contribution</Label>
              <div className="grid grid-cols-2 gap-2">
                {TYPES.map(t => (
                  <button
                    key={t.value}
                    onClick={() => setType(t.value)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-sm transition-colors ${
                      type === t.value
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
                        : 'border-border hover:border-muted-foreground/50'
                    }`}
                  >
                    {t.icon}
                    <span className="font-medium text-xs">{t.label}</span>
                  </button>
                ))}
              </div>
              {selectedType && <p className="text-xs text-muted-foreground">{selectedType.description}</p>}
            </div>

            {type === 'image' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">URL de l'image *</Label>
                  <Input placeholder="https://..." value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
                </div>
                {imageUrl && (
                  <div className="rounded-md overflow-hidden border max-h-32">
                    <img src={imageUrl} alt="Aperçu" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
                <div className="space-y-1">
                  <Label className="text-xs">Légende</Label>
                  <Input placeholder="ex: Vue aérienne du champ de lavande, Provence 2023" value={imageCaption} onChange={e => setImageCaption(e.target.value)} />
                </div>
              </div>
            )}

            {type === 'plant_link' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Nom de la plante *</Label>
                  <Input placeholder="ex: Lavandula angustifolia, Rosa damascena..." value={plantName} onChange={e => setPlantName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Notes sur cette plante dans ce terroir</Label>
                  <Textarea placeholder="Conditions de culture, qualité, spécificités locales..." value={plantNotes} onChange={e => setPlantNotes(e.target.value)} rows={3} />
                </div>
              </div>
            )}

            {type === 'production_data' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Année de production</Label>
                  <Input type="number" min={1800} max={2030} placeholder="2024" value={productionYear ?? ""} onChange={e => setProductionYear(e.target.value ? parseInt(e.target.value) : undefined)} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Quantité</Label>
                    <Input placeholder="ex: 500 kg/ha, 2 tonnes..." value={productionQuantity} onChange={e => setProductionQuantity(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Qualité / Grade</Label>
                    <Input placeholder="ex: AOC, Bio, Grade A..." value={productionQuality} onChange={e => setProductionQuality(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {type === 'history' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Période historique</Label>
                  <Input placeholder="ex: XIXe siècle, Antiquité, 1920-1950..." value={historyPeriod} onChange={e => setHistoryPeriod(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Contenu historique *</Label>
                  <Textarea placeholder="Histoire du terroir, traditions olfactives, usages anciens..." value={historyContent} onChange={e => setHistoryContent(e.target.value)} rows={4} />
                </div>
              </div>
            )}

            {type === 'note' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Catégorie</Label>
                  <Input placeholder="ex: Géologie, Climat, Biodiversité..." value={noteCategory} onChange={e => setNoteCategory(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Note *</Label>
                  <Textarea placeholder="Votre observation ou commentaire..." value={noteContent} onChange={e => setNoteContent(e.target.value)} rows={4} />
                </div>
              </div>
            )}

            <div className="space-y-3 pt-1 border-t">
              <div className="space-y-1">
                <Label className="text-xs">Description complémentaire</Label>
                <Textarea placeholder="Contexte supplémentaire..." value={description} onChange={e => setDescription(e.target.value)} rows={2} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Sources bibliographiques</Label>
                <Input placeholder="ex: Guenther 1948, Poucher 1959..." value={bibliographyRefs} onChange={e => setBibliographyRefs(e.target.value)} />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Annuler</Button>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
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
