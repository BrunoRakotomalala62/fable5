import { useCallback, useRef, useState } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  attachments?: Array<{
    type: 'image' | 'pdf';
    dataUrl?: string;
    name: string;
  }>;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  selectedModel: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  emoji: string;
  supportsVision: boolean;
  supportsImageToImage?: boolean;
}

export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    emoji: '🤖',
    supportsVision: true,
    supportsImageToImage: true,
  },
  {
    id: 'claude-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    emoji: '🧠',
    supportsVision: true,
    supportsImageToImage: false,
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    emoji: '✨',
    supportsVision: true,
    supportsImageToImage: true,
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    emoji: '⚡',
    supportsVision: true,
    supportsImageToImage: true,
  },
];

export function usePuterAI() {
  const [conversations, setConversations] = useState<Record<string, Conversation>>(() => {
    const stored = localStorage.getItem('fable5_conversations');
    return stored ? JSON.parse(stored) : {};
  });

  const [activeConvId, setActiveConvId] = useState<string | null>(() => {
    return localStorage.getItem('fable5_activeConvId');
  });

  const [selectedModel, setSelectedModel] = useState<string>(() => {
    return localStorage.getItem('fable5_selectedModel') || 'gpt-4o';
  });

  const convOrderRef = useRef<string[]>(
    (() => {
      const stored = localStorage.getItem('fable5_convOrder');
      return stored ? JSON.parse(stored) : [];
    })()
  );

  const saveState = useCallback(() => {
    localStorage.setItem('fable5_conversations', JSON.stringify(conversations));
    localStorage.setItem('fable5_activeConvId', activeConvId || '');
    localStorage.setItem('fable5_selectedModel', selectedModel);
    localStorage.setItem('fable5_convOrder', JSON.stringify(convOrderRef.current));
  }, [conversations, activeConvId, selectedModel]);

  const createConversation = useCallback((): Conversation => {
    const id = `conv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const conv: Conversation = {
      id,
      title: 'New Conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      selectedModel,
    };
    setConversations((prev) => ({ ...prev, [id]: conv }));
    setActiveConvId(id);
    convOrderRef.current.unshift(id);
    saveState();
    return conv;
  }, [selectedModel, saveState]);

  const getActiveConversation = useCallback((): Conversation | null => {
    if (!activeConvId) return null;
    return conversations[activeConvId] || null;
  }, [activeConvId, conversations]);

  const addMessage = useCallback(
    (role: 'user' | 'ai', content: string, attachments?: Message['attachments']) => {
      let conv = getActiveConversation();
      if (!conv) {
        conv = createConversation();
      }

      const message: Message = {
        id: `msg_${Date.now()}`,
        role,
        content,
        attachments,
        timestamp: Date.now(),
      };

      setConversations((prev) => ({
        ...prev,
        [conv!.id]: {
          ...conv!,
          messages: [...conv!.messages, message],
          updatedAt: Date.now(),
        },
      }));

      return message;
    },
    [getActiveConversation, createConversation]
  );

  const updateMessage = useCallback(
    (messageId: string, content: string) => {
      const conv = getActiveConversation();
      if (!conv) return;

      setConversations((prev) => ({
        ...prev,
        [conv.id]: {
          ...conv,
          messages: conv.messages.map((msg) =>
            msg.id === messageId ? { ...msg, content } : msg
          ),
          updatedAt: Date.now(),
        },
      }));
    },
    [getActiveConversation]
  );

  const deleteConversation = useCallback((convId: string) => {
    setConversations((prev) => {
      const updated = { ...prev };
      delete updated[convId];
      return updated;
    });
    convOrderRef.current = convOrderRef.current.filter((id: string) => id !== convId);
    if (activeConvId === convId) {
      const nextId = convOrderRef.current[0] || null;
      setActiveConvId(nextId);
    }
  }, [activeConvId]);

  const getModelInfo = useCallback((modelId: string): AIModel => {
    return AVAILABLE_MODELS.find((m: AIModel) => m.id === modelId) || AVAILABLE_MODELS[0];
  }, []);

  return {
    conversations,
    activeConvId,
    selectedModel,
    convOrder: convOrderRef.current,
    createConversation,
    getActiveConversation,
    addMessage,
    updateMessage,
    deleteConversation,
    setActiveConvId,
    setSelectedModel,
    setConversations,
    saveState,
    getModelInfo,
    AVAILABLE_MODELS,
  };
}
