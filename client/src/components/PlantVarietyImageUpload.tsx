/**
 * PlantVarietyImageUpload.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Composant d'upload d'images morphologiques directement depuis la fiche plante.
 * - Drag-and-drop multi-fichiers
 * - Sélecteur de type par image (feuille, fleur, fruit, plante entière, autre)
 * - Pré-remplissage automatique du genre/espèce depuis latinName
 * - Auto-vérification pour les admins
 * ─────────────────────────────────────────────────────────────────────────────
 */
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc';
import { useToast } from '@/hooks/use-toast';
import {
  Upload, CheckCircle2, AlertCircle, X, Loader2, Camera, ImageIcon,
  Leaf, Flower2, Apple, TreePine, MoreHorizontal,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type ImageTypeValue = 'leaf' | 'flower' | 'fruit' | 'whole_plant' | 'other';

interface BatchFile {
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  progress: number;
  error?: string;
  imageType: ImageTypeValue;
}

const IMAGE_TYPE_CONFIG: Record<ImageTypeValue, { label: string; icon: React.ReactNode; color: string }> = {
  leaf:        { label: 'Feuille',        icon: <Leaf className="w-3 h-3" />,          color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  flower:      { label: 'Fleur',          icon: <Flower2 className="w-3 h-3" />,        color: 'bg-rose-50 text-rose-700 border-rose-200' },
  fruit:       { label: 'Fruit',          icon: <Apple className="w-3 h-3" />,          color: 'bg-amber-50 text-amber-700 border-amber-200' },
  whole_plant: { label: 'Plante entière', icon: <TreePine className="w-3 h-3" />,       color: 'bg-teal-50 text-teal-700 border-teal-200' },
  other:       { label: 'Autre',          icon: <MoreHorizontal className="w-3 h-3" />, color: 'bg-slate-50 text-slate-600 border-slate-200' },
};

// ─── Props ───────────────────────────────────────────────────────────────────

interface Props {
  latinName?: string | null;
  isAdmin?: boolean;
  onSuccess?: () => void;
}

// ─── Composant principal ─────────────────────────────────────────────────────

export function PlantVarietyImageUpload({ latinName, isAdmin, onSuccess }: Props) {
  const { toast } = useToast();
  const batchUploadMutation = trpc.varietyImages.batchUpload.useMutation();

  // Extraire genre/espèce depuis latinName
  const parts = (latinName || '').trim().split(/\s+/);
  const defaultGenus = parts[0] || '';
  const defaultSpecies = parts[1] || '';

  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<BatchFile[]>([]);
  const [genus, setGenus] = useState(defaultGenus);
  const [species, setSpecies] = useState(defaultSpecies);
  const [cultivar, setCultivar] = useState('');
  const [source, setSource] = useState('');
  const [attribution, setAttribution] = useState('');
  const [defaultType, setDefaultType] = useState<ImageTypeValue>('whole_plant');
  const [autoVerify, setAutoVerify] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles);
    const valid = arr.filter(f => f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024);
    const invalid = arr.length - valid.length;
    if (invalid > 0) toast({ title: `${invalid} fichier(s) ignoré(s)`, description: 'Format non supporté ou > 10 MB', variant: 'destructive' });
    if (files.length + valid.length > 30) {
      toast({ title: 'Maximum 30 images', variant: 'destructive' }); return;
    }
    setFiles(prev => [...prev, ...valid.map(f => ({
      file: f, preview: URL.createObjectURL(f), status: 'pending' as const, progress: 0,
      imageType: defaultType,
    }))]);
  }, [files.length, toast, defaultType]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const removeFile = (idx: number) => {
    setFiles(prev => { URL.revokeObjectURL(prev[idx].preview); return prev.filter((_, i) => i !== idx); });
  };

  const setFileType = (idx: number, type: ImageTypeValue) => {
    setFiles(prev => prev.map((f, i) => i === idx ? { ...f, imageType: type } : f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genus.trim()) { toast({ title: 'Genre requis', variant: 'destructive' }); return; }
    if (!species.trim()) { toast({ title: 'Espèce requise', variant: 'destructive' }); return; }
    if (files.length === 0) { toast({ title: 'Aucun fichier sélectionné', variant: 'destructive' }); return; }

    setIsUploading(true);
    setFiles(prev => prev.map(f => ({ ...f, status: 'uploading' as const, progress: 10 })));

    try {
      const filePayloads = await Promise.all(files.map(bf => new Promise<{
        fileData: string; fileName: string; mimeType: string; imageType: ImageTypeValue;
      }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({
          fileData: (reader.result as string).split(',')[1],
          fileName: bf.file.name,
          mimeType: bf.file.type,
          imageType: bf.imageType,
        });
        reader.onerror = reject;
        reader.readAsDataURL(bf.file);
      })));

      const interval = setInterval(() => {
        setFiles(prev => prev.map(f => f.status === 'uploading' ? { ...f, progress: Math.min(f.progress + 15, 85) } : f));
      }, 400);

      const result = await batchUploadMutation.mutateAsync({
        genus: genus.trim(),
        species: species.trim(),
        cultivar: cultivar.trim() || undefined,
        source: source.trim() || undefined,
        attribution: attribution.trim() || undefined,
        autoVerify: isAdmin && autoVerify,
        files: filePayloads,
      });

      clearInterval(interval);
      setFiles(prev => prev.map((f, i) => {
        const r = result.results.find(r => r.index === i);
        return r?.success
          ? { ...f, status: 'done' as const, progress: 100 }
          : { ...f, status: 'error' as const, progress: 0, error: r?.error };
      }));
      setUploadDone(true);
      toast({
        title: `✓ ${result.succeeded}/${result.total} images ajoutées`,
        description: result.failed > 0 ? `${result.failed} erreur(s)` : autoVerify ? 'Images vérifiées et visibles.' : 'En attente de validation admin.',
      });
      onSuccess?.();
    } catch {
      setFiles(prev => prev.map(f => ({ ...f, status: 'error' as const, progress: 0, error: 'Erreur serveur' })));
      toast({ title: 'Erreur serveur', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (isUploading) return;
    files.forEach(f => URL.revokeObjectURL(f.preview));
    setFiles([]); setUploadDone(false); setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={v => { if (!v) handleClose(); else setIsOpen(true); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Camera className="w-4 h-4" />
          Ajouter des images
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Ajouter des images morphologiques
            {latinName && <span className="text-sm font-normal text-muted-foreground italic ml-1">— {latinName}</span>}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Genre / Espèce / Cultivar */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Genre *</label>
              <Input value={genus} onChange={e => setGenus(e.target.value)} placeholder="ex: Rosa" required className="mt-1" disabled={isUploading} />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Espèce *</label>
              <Input value={species} onChange={e => setSpecies(e.target.value)} placeholder="ex: damascena" required className="mt-1" disabled={isUploading} />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Cultivar</label>
              <Input value={cultivar} onChange={e => setCultivar(e.target.value)} placeholder="ex: Kazanlak" className="mt-1" disabled={isUploading} />
            </div>
          </div>

          {/* Source / Attribution */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Source</label>
              <Input value={source} onChange={e => setSource(e.target.value)} placeholder="ex: Wikimedia Commons" className="mt-1" disabled={isUploading} />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Attribution</label>
              <Input value={attribution} onChange={e => setAttribution(e.target.value)} placeholder="© Auteur" className="mt-1" disabled={isUploading} />
            </div>
          </div>

          {/* Type par défaut */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Type par défaut</label>
            <Select value={defaultType} onValueChange={v => setDefaultType(v as ImageTypeValue)} disabled={isUploading}>
              <SelectTrigger className="w-44 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="leaf">🌿 Feuille</SelectItem>
                <SelectItem value="flower">🌸 Fleur</SelectItem>
                <SelectItem value="fruit">🍎 Fruit</SelectItem>
                <SelectItem value="whole_plant">🌳 Plante entière</SelectItem>
                <SelectItem value="other">— Autre</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">Modifiable par image</span>
          </div>

          {/* Zone de drop */}
          {!isUploading && !uploadDone && (
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50'
              }`}
            >
              <input
                type="file" accept="image/*" multiple
                onChange={e => { if (e.target.files) addFiles(e.target.files); e.target.value = ''; }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <Upload className="w-10 h-10 mx-auto text-zinc-300 mb-2" />
              <p className="text-sm font-medium text-zinc-600">Glissez vos images ici ou cliquez pour sélectionner</p>
              <p className="text-xs text-zinc-400 mt-1">JPG, PNG, WebP · max 10 MB · max 30 images</p>
            </div>
          )}

          {/* Liste des fichiers avec sélecteur de type par image */}
          {files.length > 0 && (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                  {files.length} image{files.length > 1 ? 's' : ''} sélectionnée{files.length > 1 ? 's' : ''}
                </span>
                {!isUploading && !uploadDone && (
                  <button type="button" onClick={() => { files.forEach(f => URL.revokeObjectURL(f.preview)); setFiles([]); }}
                    className="text-xs text-zinc-400 hover:text-red-500 transition-colors">Tout effacer</button>
                )}
              </div>
              {files.map((bf, idx) => {
                const typeConf = IMAGE_TYPE_CONFIG[bf.imageType];
                return (
                  <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
                    <img src={bf.preview} alt={bf.file.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-zinc-700 truncate">{bf.file.name}</p>
                      <p className="text-[10px] text-zinc-400 mb-1.5">{(bf.file.size / 1024).toFixed(0)} KB</p>
                      {/* Sélecteur de type par image */}
                      {bf.status === 'pending' && !isUploading && (
                        <Select value={bf.imageType} onValueChange={v => setFileType(idx, v as ImageTypeValue)}>
                          <SelectTrigger className={`h-6 text-[11px] px-2 border rounded-md w-36 ${typeConf.color}`}>
                            <span className="flex items-center gap-1">{typeConf.icon} {typeConf.label}</span>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="leaf">🌿 Feuille</SelectItem>
                            <SelectItem value="flower">🌸 Fleur</SelectItem>
                            <SelectItem value="fruit">🍎 Fruit</SelectItem>
                            <SelectItem value="whole_plant">🌳 Plante entière</SelectItem>
                            <SelectItem value="other">— Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      {bf.status !== 'pending' && (
                        <div className="mt-1">
                          <div className="h-1.5 rounded-full bg-zinc-200 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                bf.status === 'done' ? 'bg-emerald-500' :
                                bf.status === 'error' ? 'bg-red-400' : 'bg-primary'
                              }`}
                              style={{ width: `${bf.progress}%` }}
                            />
                          </div>
                          {bf.status === 'done' && (
                            <p className="text-[10px] text-emerald-600 mt-0.5 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> {typeConf.label} — ajoutée
                            </p>
                          )}
                          {bf.status === 'error' && <p className="text-[10px] text-red-500 mt-0.5">{bf.error || 'Erreur'}</p>}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0 pt-0.5">
                      {bf.status === 'pending' && !isUploading && (
                        <button type="button" onClick={() => removeFile(idx)} className="text-zinc-300 hover:text-red-400 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      {bf.status === 'uploading' && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
                      {bf.status === 'done' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      {bf.status === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Résumé des types sélectionnés */}
          {files.length > 1 && !isUploading && !uploadDone && (
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(IMAGE_TYPE_CONFIG) as ImageTypeValue[]).map(type => {
                const count = files.filter(f => f.imageType === type).length;
                if (!count) return null;
                const conf = IMAGE_TYPE_CONFIG[type];
                return (
                  <Badge key={type} variant="outline" className={`text-[11px] gap-1 ${conf.color}`}>
                    {conf.icon} {conf.label} × {count}
                  </Badge>
                );
              })}
            </div>
          )}

          {/* Auto-vérification (admin seulement) */}
          {isAdmin && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox" id="plantAutoVerify"
                checked={autoVerify}
                onChange={e => setAutoVerify(e.target.checked)}
                disabled={isUploading}
                className="w-4 h-4 rounded border-zinc-300 accent-primary"
              />
              <label htmlFor="plantAutoVerify" className="text-xs text-zinc-600 cursor-pointer">
                Marquer comme vérifiées automatiquement (admin)
              </label>
            </div>
          )}

          {!isAdmin && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Les images soumises seront visibles après validation par un administrateur.
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-2 border-t border-zinc-100">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isUploading}>Fermer</Button>
            {!uploadDone ? (
              <Button type="submit" disabled={isUploading || files.length === 0 || !genus.trim() || !species.trim()}>
                {isUploading
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Upload en cours…</>
                  : <><Upload className="w-4 h-4 mr-2" />Ajouter {files.length > 0 ? `${files.length} image${files.length > 1 ? 's' : ''}` : ''}</>
                }
              </Button>
            ) : (
              <Button type="button" onClick={handleClose} className="bg-emerald-600 hover:bg-emerald-700">
                <CheckCircle2 className="w-4 h-4 mr-2" /> Terminé
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
