import { Trash2, MessageSquare, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Conversation } from '@/hooks/usePuterAI';

interface SidebarProps {
  conversations: Record<string, Conversation>;
  convOrder: string[];
  activeConvId: string | null;
  onSelectConversation: (convId: string) => void;
  onDeleteConversation: (convId: string) => void;
}

export default function Sidebar({
  conversations,
  convOrder,
  activeConvId,
  onSelectConversation,
  onDeleteConversation,
}: SidebarProps) {
  return (
    <div className="w-64 border-r border-border bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-sm">🧠</span>
          </div>
          <h1 className="font-bold text-lg text-foreground">Fable5 Pro</h1>
        </div>
        <p className="text-xs text-muted-foreground">Chat & Image AI</p>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {convOrder.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <MessageSquare className="w-6 h-6 mx-auto mb-2 opacity-50" />
              <p>Aucune conversation</p>
            </div>
          ) : (
            convOrder.map((convId) => {
              const conv = conversations[convId];
              if (!conv) return null;

              return (
                <button
                  key={convId}
                  onClick={() => onSelectConversation(convId)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all group relative ${
                    activeConvId === convId
                      ? 'bg-accent/20 text-accent'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <div className="flex items-start gap-2 pr-8">
                    <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{conv.title}</p>
                      <p className="text-xs opacity-60 truncate">
                        {new Date(conv.updatedAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Supprimer cette conversation?')) {
                        onDeleteConversation(convId);
                      }
                    }}
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/20 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </button>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border p-3 space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center gap-2 text-xs"
        >
          <Settings className="w-4 h-4" />
          Paramètres
        </Button>
      </div>
    </div>
  );
}
