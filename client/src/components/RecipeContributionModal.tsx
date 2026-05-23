import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FlaskConical, Shuffle, Image, FileText, AlertCircle, LogIn } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

type ContribType = 'ingredient' | 'variant' | 'note' | 'image' | 'correction';

const TYPES: { value: ContribType; label: string; icon: React.ReactNode; description: string }[] = [
  { value: 'ingredient', label: 'Ingrédient manquant', icon: <FlaskConical className="w-4 h-4" />, description: 'Proposer un ingrédient non documenté dans la recette' },
  { value: 'variant', label: 'Variante de recette', icon: <Shuffle className="w-4 h-4" />, description: 'Proposer une variation ou adaptation de la formule' },
  { value: 'correction', label: 'Correction', icon: <AlertCircle className="w-4 h-4" />, description: 'Signaler une erreur ou imprécision dans la recette' },
  { value: 'image', label: 'Image / Visuel', icon: <Image className="w-4 h-4" />, description: 'Proposer une image ou illustration pour la recette' },
  { value: 'note', label: 'Note de recherche', icon: <FileText className="w-4 h-4" />, description: 'Ajouter une observation ou commentaire' },
];

type Props = {
  open: boolean;
  onClose: () => void;
  recipeId: number;
  recipeName: string;
  defaultType?: ContribType;
};

export function RecipeContributionModal({ open, onClose, recipeId, recipeName, defaultType }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [type, setType] = useState<ContribType>(defaultType || 'note');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [ingredientName, setIngredientName] = useState("");
  const [ingredientQuantity, setIngredientQuantity] = useState("");
  const [ingredientUnit, setIngredientUnit] = useState("");
  const [ingredientNotes, setIngredientNotes] = useState("");
  const [variantName, setVariantName] = useState("");
  const [variantDescription, setVariantDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteCategory, setNoteCategory] = useState("");
  const [description, setDescription] = useState("");
  const [bibliographyRefs, setBibliographyRefs] = useState("");

  const submitMutation = trpc.recipeContributions.submit.useMutation();

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await submitMutation.mutateAsync({
        recipeId,
        contributionType: type,
        ingredientName: ingredientName || undefined,
        ingredientQuantity: ingredientQuantity || undefined,
        ingredientUnit: ingredientUnit || undefined,
        ingredientNotes: ingredientNotes || undefined,
        variantName: variantName || undefined,
        variantDescription: variantDescription || undefined,
        imageUrl: imageUrl || undefined,
        imageCaption: imageCaption || undefined,
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
            <FlaskConical className="w-5 h-5 text-amber-500" />
            Contribuer à la recette
          </DialogTitle>
          <DialogDescription>
            <span className="font-medium text-foreground">{recipeName}</span>
            {" — "}Votre contribution sera examinée avant publication.
          </DialogDescription>
        </DialogHeader>

        {!user ? (
          <div className="py-6 text-center space-y-3">
            <p className="text-muted-foreground text-sm">Vous devez être connecté pour contribuer.</p>
            <a href={getLoginUrl()}><Button size="sm"><LogIn className="w-4 h-4 mr-2" />Se connecter</Button></a>
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
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300'
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

            {type === 'ingredient' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Nom de l'ingrédient *</Label>
                  <Input placeholder="ex: Absolu de rose, Vétiver CO2..." value={ingredientName} onChange={e => setIngredientName(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Quantité</Label>
                    <Input placeholder="ex: 5, 0.5, 10..." value={ingredientQuantity} onChange={e => setIngredientQuantity(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Unité</Label>
                    <Input placeholder="ex: %, gouttes, g, ml..." value={ingredientUnit} onChange={e => setIngredientUnit(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Notes sur l'ingrédient</Label>
                  <Textarea placeholder="Rôle dans la formule, alternatives possibles..." value={ingredientNotes} onChange={e => setIngredientNotes(e.target.value)} rows={2} />
                </div>
              </div>
            )}

            {type === 'variant' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Nom de la variante *</Label>
                  <Input placeholder="ex: Version estivale, Adaptation orientale..." value={variantName} onChange={e => setVariantName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Description de la variante</Label>
                  <Textarea placeholder="Modifications apportées, résultat olfactif attendu..." value={variantDescription} onChange={e => setVariantDescription(e.target.value)} rows={4} />
                </div>
              </div>
            )}

            {type === 'correction' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Description de la correction *</Label>
                  <Textarea placeholder="Décrivez l'erreur ou l'imprécision constatée et la correction proposée..." value={description} onChange={e => setDescription(e.target.value)} rows={4} />
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
                    <img src={imageUrl} alt="Aperçu" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
                <div className="space-y-1">
                  <Label className="text-xs">Légende</Label>
                  <Input placeholder="ex: Flacon original, Matières premières..." value={imageCaption} onChange={e => setImageCaption(e.target.value)} />
                </div>
              </div>
            )}

            {type === 'note' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Catégorie</Label>
                  <Input placeholder="ex: Histoire, Technique, Olfaction..." value={noteCategory} onChange={e => setNoteCategory(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Note *</Label>
                  <Textarea placeholder="Votre observation ou commentaire..." value={noteContent} onChange={e => setNoteContent(e.target.value)} rows={4} />
                </div>
              </div>
            )}

            {type !== 'correction' && (
              <div className="space-y-3 pt-1 border-t">
                <div className="space-y-1">
                  <Label className="text-xs">Description complémentaire</Label>
                  <Textarea placeholder="Contexte supplémentaire..." value={description} onChange={e => setDescription(e.target.value)} rows={2} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Sources bibliographiques</Label>
                  <Input placeholder="ex: Ellena 2011, Turin & Sanchez 2008..." value={bibliographyRefs} onChange={e => setBibliographyRefs(e.target.value)} />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Annuler</Button>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-amber-600 hover:bg-amber-700 text-white">
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
