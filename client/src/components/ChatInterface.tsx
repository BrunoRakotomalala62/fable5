import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2, Send, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Puter } from '@/lib/puter-types';
import type { Message, Conversation } from '@/hooks/usePuterAI';
import { AVAILABLE_MODELS } from '@/hooks/usePuterAI';
import { Streamdown } from 'streamdown';

declare global {
  var puter: Puter | undefined;
}

interface ChatInterfaceProps {
  conversation: Conversation | null;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  onAddMessage: (role: 'user' | 'ai', content: string) => void;
  onUpdateMessage: (messageId: string, content: string) => void;
  onNewChat: () => void;
}

export default function ChatInterface({
  conversation,
  selectedModel,
  onModelChange,
  onAddMessage,
  onUpdateMessage,
  onNewChat,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSendMessage = async () => {
    if (!input.trim() && attachments.length === 0) return;
    if (!conversation) return;

    const userMessage = input.trim() || '(Image attachée)';
    onAddMessage('user', userMessage);
    setInput('');
    setAttachments([]);

    setIsLoading(true);
    try {
      if (typeof globalThis.puter === 'undefined') {
        throw new Error('Puter SDK not loaded');
      }

      // Prepare message with attachments
      let messages: Array<{ role: string; content: string | Array<{ type: string; text?: string; image_url?: { url: string } }> }> = [];

      if (attachments.length > 0) {
        // Convert first image to base64
        const file = attachments[0];
        const imageDataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        messages = [
          {
            role: 'user',
            content: [
              { type: 'text', text: userMessage },
              { type: 'image_url', image_url: { url: imageDataUrl } },
            ],
          },
        ];
      } else {
        messages = [{ role: 'user', content: userMessage }];
      }

      const response = await globalThis.puter.ai.chat(messages, {
        model: selectedModel,
        stream: true,
      });

      let fullContent = '';
      const aiMessage = conversation.messages[conversation.messages.length - 1];

      for await (const part of response) {
        if (part?.text) {
          fullContent += part.text;
          onUpdateMessage(aiMessage.id, fullContent);
        }
      }

      if (!fullContent) {
        onUpdateMessage(aiMessage.id, '_(Aucune réponse reçue)_');
      }
    } catch (error) {
      console.error('Erreur:', error);
      const errorMsg = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(`Erreur: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setAttachments(files);
      toast.success(`${files.length} image(s) attachée(s)`);
    }
  };

  const modelInfo = AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[0];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{modelInfo.emoji}</span>
          <div>
            <h2 className="font-semibold text-foreground">{modelInfo.name}</h2>
            <p className="text-xs text-muted-foreground">{modelInfo.provider}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNewChat}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouveau
        </Button>
      </div>

      {/* Model Selector */}
      <div className="border-b border-border bg-card px-4 py-3 overflow-x-auto">
        <div className="flex gap-2">
          {AVAILABLE_MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => onModelChange(model.id)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all relative ${
                selectedModel === model.id
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
              title={model.supportsImageToImage ? 'Supporte image-to-image' : 'Vision uniquement'}
            >
              {model.emoji} {model.name}
              {model.supportsImageToImage && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!conversation || conversation.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4">
            <div className="text-5xl">{modelInfo.emoji}</div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Commencez une conversation
              </h3>
              <p className="text-sm text-muted-foreground">
                Posez une question ou décrivez ce que vous souhaitez faire
              </p>
            </div>
          </div>
        ) : (
          conversation.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0 text-sm">
                  {modelInfo.emoji}
                </div>
              )}
              <div
                className={`max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-secondary text-foreground'
                    : 'bg-card border border-accent/20 text-foreground'
                }`}
              >
                {msg.role === 'ai' ? (
                  <Streamdown>{msg.content}</Streamdown>
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
              {modelInfo.emoji}
            </div>
            <div className="bg-card border border-accent/20 rounded-lg p-3 flex gap-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card p-4 space-y-3">
        {attachments.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {attachments.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-lg text-sm"
              >
                <span>📎 {file.name}</span>
                <button
                  onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Textarea
            placeholder="Écrivez votre message... (Maj+Entrée pour nouvelle ligne)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
            className="min-h-12 resize-none"
          />
          <div className="flex flex-col gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="w-10 h-10 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors">
                📎
              </div>
            </label>
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || (!input.trim() && attachments.length === 0)}
              className="w-10 h-10 p-0 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
