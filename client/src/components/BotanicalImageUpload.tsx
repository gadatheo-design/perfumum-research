// @ts-nocheck
/**
 * Composant d'upload d'images botaniques pour les plantes
 * Utilise le stockage S3 via les helpers serveur
 */

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, Loader2, Check, AlertCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

interface BotanicalImageUploadProps {
  plantId: number;
  currentImageUrl?: string | null;
  onImageUploaded?: (url: string) => void;
  className?: string;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export function BotanicalImageUpload({
  plantId,
  currentImageUrl,
  onImageUploaded,
  className,
}: BotanicalImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.plants.uploadImage.useMutation({
    onSuccess: (data) => {
      setPreviewUrl(data.url);
      setStatus('success');
      onImageUploaded?.(data.url);
      setTimeout(() => setStatus('idle'), 2000);
    },
    onError: (error) => {
      setStatus('error');
      setErrorMessage(error.message || 'Erreur lors de l\'upload');
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage(null);
      }, 3000);
    },
  });

  const handleFile = useCallback(async (file: File) => {
    // Validation du type de fichier
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setStatus('error');
      setErrorMessage('Format non supporté. Utilisez JPG, PNG, WebP ou GIF.');
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage(null);
      }, 3000);
      return;
    }

    // Validation de la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setStatus('error');
      setErrorMessage('Fichier trop volumineux. Maximum 5 Mo.');
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage(null);
      }, 3000);
      return;
    }

    // Créer une preview locale
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setStatus('uploading');

    // Convertir en base64 pour l'envoi
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      uploadMutation.mutate({
        plantId,
        imageData: base64,
        fileName: file.name,
        contentType: file.type,
      });
    };
    reader.onerror = () => {
      setStatus('error');
      setErrorMessage('Erreur de lecture du fichier');
    };
    reader.readAsDataURL(file);
  }, [plantId, uploadMutation]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    setPreviewUrl(null);
    setStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Zone de preview/upload */}
          <div
            className={cn(
              'relative rounded-lg border-2 border-dashed transition-colors',
              dragActive ? 'border-primary bg-primary/5' : 'border-border',
              status === 'error' && 'border-destructive',
              'min-h-[200px] flex items-center justify-center'
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {previewUrl ? (
              <div className="relative w-full h-full min-h-[200px]">
                <img
                  src={previewUrl}
                  alt="Image botanique"
                  className="w-full h-full object-contain max-h-[300px]"
                />
                {/* Overlay de statut */}
                {status === 'uploading' && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Upload en cours...</span>
                    </div>
                  </div>
                )}
                {status === 'success' && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <Check className="h-8 w-8 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">Image enregistrée</span>
                    </div>
                  </div>
                )}
                {/* Bouton de suppression */}
                {status === 'idle' && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={handleRemove}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 p-8 text-center">
                <div className={cn(
                  'p-4 rounded-full',
                  dragActive ? 'bg-primary/10' : 'bg-muted'
                )}>
                  <ImageIcon className={cn(
                    'h-10 w-10',
                    dragActive ? 'text-primary' : 'text-muted-foreground'
                  )} />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Glissez-déposez une image ici
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ou cliquez pour sélectionner
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, WebP ou GIF • Max 5 Mo
                </p>
              </div>
            )}

            {/* Input file invisible */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={status === 'uploading'}
            />
          </div>

          {/* Message d'erreur */}
          {status === 'error' && errorMessage && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Bouton d'upload alternatif */}
          {!previewUrl && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={status === 'uploading'}
            >
              <Upload className="h-4 w-4 mr-2" />
              Sélectionner une image
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default BotanicalImageUpload;
