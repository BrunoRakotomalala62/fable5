import { useEffect, useState } from 'react';
import { usePuterAI } from '@/hooks/usePuterAI';
import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/ChatInterface';
import ImageEditor from '@/components/ImageEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Wand2 } from 'lucide-react';

/**
 * Fable5 Pro - Modern AI Studio
 * 
 * Design Philosophy: Premium AI workspace with sophisticated dark mode,
 * golden accents, and fluid interactions inspired by professional creative tools.
 * 
 * Features:
 * - Multi-model chat with vision capabilities
 * - Image-to-image editing (single & multi-image)
 * - Conversation history management
 * - Real-time streaming responses
 */
export default function Home() {
  const {
    conversations,
    activeConvId,
    selectedModel,
    convOrder,
    createConversation,
    getActiveConversation,
    addMessage,
    updateMessage,
    deleteConversation,
    setActiveConvId,
    setSelectedModel,
    saveState,
  } = usePuterAI();

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('chat');

  // Initialize with first conversation
  useEffect(() => {
    if (!activeConvId && convOrder.length === 0) {
      createConversation();
    }
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    saveState();
  }, [conversations, activeConvId, selectedModel]);

  const activeConversation = getActiveConversation();

  const handleAddMessage = (role: 'user' | 'ai', content: string) => {
    addMessage(role, content);
  };

  const handleUpdateMessage = (messageId: string, content: string) => {
    updateMessage(messageId, content);
  };

  const handleNewChat = () => {
    createConversation();
    setActiveTab('chat');
  };

  const handleImageGenerated = (imageUrl: string) => {
    setGeneratedImage(imageUrl);
    setActiveTab('chat');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        convOrder={convOrder}
        activeConvId={activeConvId}
        onSelectConversation={setActiveConvId}
        onDeleteConversation={deleteConversation}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          {/* Tab Navigation */}
          <div className="border-b border-border bg-card px-4">
            <TabsList className="bg-transparent border-b-0 h-auto p-0 gap-8">
              <TabsTrigger
                value="chat"
                className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger
                value="image-editor"
                className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Éditeur d'Images
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <TabsContent value="chat" className="flex-1 m-0">
            <ChatInterface
              conversation={activeConversation}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              onAddMessage={handleAddMessage}
              onUpdateMessage={handleUpdateMessage}
              onNewChat={handleNewChat}
            />
          </TabsContent>

          <TabsContent value="image-editor" className="flex-1 m-0 p-4 overflow-y-auto">
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Éditeur d'Images IA
                </h2>
                <p className="text-muted-foreground">
                  Modifiez vos images avec la puissance de l'IA. Changez les couleurs,
                  ajoutez des éléments, ou fusionnez plusieurs images.
                </p>
              </div>

              <ImageEditor onImageGenerated={handleImageGenerated} />

              {generatedImage && (
                <div className="border border-accent/20 rounded-lg p-4 bg-card">
                  <h3 className="font-semibold text-foreground mb-3">Résultat</h3>
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="w-full rounded-lg max-h-96 object-cover"
                  />
                  <a
                    href={generatedImage}
                    download="fable5-generated.png"
                    className="mt-3 inline-block px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium"
                  >
                    Télécharger
                  </a>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
