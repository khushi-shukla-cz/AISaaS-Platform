import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface Message {
  _id: string;
  conversationId: string;
  projectId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: {
    thinkingSteps?: string[];
    integrationsUsed?: string[];
    processingTime?: number;
    tokenUsage?: {
      promptTokens?: number;
      responseTokens?: number;
      totalTokens?: number;
    };
  };
  createdAt: string;
}

export interface Conversation {
  _id: string;
  projectId: string;
  productInstanceId: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export function useConversations(userId: string, projectId: string) {
  return useQuery({
    queryKey: ['conversations', userId, projectId],
    queryFn: async () => {
      const res = await fetch(`/api/chat/conversations/list?userId=${userId}&projectId=${projectId}`, {
        headers: {
          'x-user-id': userId,
          'x-project-id': projectId,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch conversations');
      const data = await res.json();
      return data.conversations as Conversation[];
    },
  });
}

export function useMessages(conversationId: string, userId: string, projectId: string) {
  return useQuery({
    queryKey: ['messages', conversationId, userId, projectId],
    queryFn: async () => {
      const res = await fetch(
        `/api/chat/messages/${conversationId}?userId=${userId}&projectId=${projectId}`
        ,
        {
          headers: {
            'x-user-id': userId,
            'x-project-id': projectId,
          },
        }
      );
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      return data.messages as Message[];
    },
    enabled: !!conversationId && !!userId && !!projectId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      conversationId: string;
      projectId: string;
      userId: string;
      content: string;
    }) => {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': params.userId,
          'x-project-id': params.projectId,
        },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to send message');
      }

      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations', variables.userId, variables.projectId] });
    },
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      userId: string;
      projectId: string;
      productInstanceId: string;
    }) => {
      const res = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': params.userId,
          'x-project-id': params.projectId,
        },
        body: JSON.stringify(params),
      });

      if (!res.ok) throw new Error('Failed to create conversation');
      const data = await res.json();
      return data.conversation as Conversation;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['conversations', variables.userId, variables.projectId] });
    },
  });
}
