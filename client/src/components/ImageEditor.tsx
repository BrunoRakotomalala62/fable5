import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2, Upload, Wand2, X } from 'lucide-react';
import { toast } from 'sonner';
import type { Puter } from '@/lib/puter-types';

declare global {
  var puter: Puter | undefined;
}

interface ImageEditorProps {
  onImageGenerated?: (imageUrl: string) => void;
}

export default function ImageEditor({ onImageGenerated }: ImageEditorProps) {
  const [mode, setMode] = useState<'single' | 'multi'>('single');
  const [images, setImages] = useState<File[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (mode === 'single' && files.length > 1) {
      toast.error('Mode simple: une seule image à la fois');
      return;
    }

    if (mode === 'multi' && files.length > 3) {
      toast.error('Mode multi: maximum 3 images');
      return;
    }

    setImages(files);

    // Create preview URLs
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleGenerateEdit = async () => {
    if (images.length === 0) {
      toast.error('Veuillez télécharger au moins une image');
      return;
    }

    if (!prompt.trim()) {
      toast.error('Veuillez décrire les modifications souhaitées');
      return;
    }

    setIsLoading(true);
    try {
      // Convert images to base64
      const imageDataUrls: string[] = [];
      for (const file of images) {
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        imageDataUrls.push(dataUrl);
      }

      // Call Puter AI image-to-image API
      if (typeof globalThis.puter === 'undefined') {
        throw new Error('Puter SDK not loaded');
      }

      const response = await globalThis.puter.ai.txt2img(prompt, {
        provider: 'openai-image-generation',
        model: 'gpt-image-1',
        input_images: imageDataUrls,
      });

      if (response && response.image_url) {
        onImageGenerated?.(response.image_url);
        toast.success('Image modifiée avec succès!');
        setPrompt('');
        setImages([]);
        setPreviewUrls([]);
      } else {
        throw new Error('Pas de réponse valide du serveur');
      }
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      toast.error(
        error instanceof Error ? error.message : 'Erreur lors de la modification'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <Card className="p-6 border-accent/20 bg-card">
        <div className="space-y-4">
          {/* Mode Selector */}
          <div className="flex gap-2">
            <Button
              variant={mode === 'single' ? 'default' : 'outline'}
              onClick={() => {
                setMode('single');
                setImages([]);
                setPreviewUrls([]);
              }}
              className="flex-1"
            >
              Mode Simple
            </Button>
            <Button
              variant={mode === 'multi' ? 'default' : 'outline'}
              onClick={() => {
                setMode('multi');
                setImages([]);
                setPreviewUrls([]);
              }}
              className="flex-1"
            >
              Mode Multi-Images
            </Button>
          </div>

          {/* Mode Description */}
          <p className="text-sm text-muted-foreground">
            {mode === 'single'
              ? 'Téléchargez une image et décrivez les modifications (couleurs, éléments, style, etc.)'
              : 'Téléchargez 2-3 images et décrivez comment les combiner ou les modifier'}
          </p>

          {/* Image Upload */}
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent/50 transition-colors cursor-pointer relative">
            <input
              type="file"
              multiple={mode === 'multi'}
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm font-medium">
                Cliquez ou glissez vos images ici
              </p>
              <p className="text-xs text-muted-foreground">
                {mode === 'single' ? '1 image' : '2-3 images'} • PNG, JPG, WebP
              </p>
            </div>
          </div>

          {/* Image Previews */}
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {previewUrls.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-border"
                  />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Prompt Input */}
          <Textarea
            placeholder={
              mode === 'single'
                ? 'Ex: Changer la chemise en bleu, ajouter un sourire...'
                : 'Ex: Mettre la personne à côté du paysage, fusionner les deux images...'
            }
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-24 resize-none"
            disabled={isLoading}
          />

          {/* Generate Button */}
          <Button
            onClick={handleGenerateEdit}
            disabled={isLoading || images.length === 0 || !prompt.trim()}
            className="w-full gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Modification en cours...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Modifier l'image
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
