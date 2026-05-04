import { connectDB } from '@/lib/db';
import { Message, IMessage } from '@/models/Message';
import { Conversation } from '@/models/Conversation';
import { ProductInstance } from '@/models/ProductInstance';
import { Project } from '@/models/Project';
import { AIService, AIMessage } from './ai.service';
import { IntegrationService } from './integration.service';
import { AccessDeniedError } from '@/server/access';

export interface SendMessageParams {
  conversationId: string;
  projectId: string;
  userId: string;
  content: string;
}

export interface MessageResponse {
  message: IMessage;
  aiResponse: IMessage;
}

export class ChatService {
  private static async getScopedConversation(
    conversationId: string,
    userId: string,
    projectId: string
  ) {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId,
      projectId,
    });

    if (!conversation) {
      throw new AccessDeniedError('Conversation not found or access denied');
    }

    return conversation;
  }

  static async sendMessage(params: SendMessageParams): Promise<MessageResponse> {
    await connectDB();

    const { conversationId, projectId, userId, content } = params;

    const conversation = await this.getScopedConversation(conversationId, userId, projectId);

    const project = await Project.findById(conversation.projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const productInstance = await ProductInstance.findById(conversation.productInstanceId);
    if (!productInstance) {
      throw new Error('Product instance not found');
    }

    const userMessage = await Message.create({
      conversationId: conversation._id,
      projectId: conversation.projectId,
      role: 'user',
      content,
    });

    const thinkingSteps: string[] = [];
    const integrationsUsed: string[] = [];

    thinkingSteps.push('Processing your request...');

    const previousMessages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .limit(10);

    const aiMessages: AIMessage[] = previousMessages.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    aiMessages.push({
      role: 'user',
      content,
    });

    let enhancedSystemPrompt = productInstance.aiConfig.systemPrompt;

    if (project.enabledIntegrations.shopify || project.enabledIntegrations.crm) {
      thinkingSteps.push('Checking available integrations...');
    }

    if (project.enabledIntegrations.shopify && this.needsShopifyData(content)) {
      thinkingSteps.push('Fetching Shopify data...');
      const products = await IntegrationService.getShopifyProducts();
      const orders = await IntegrationService.getShopifyOrders();
      
      enhancedSystemPrompt += `\n\nYou have access to Shopify data:\nProducts: ${JSON.stringify(products)}\nRecent Orders: ${JSON.stringify(orders)}`;
      integrationsUsed.push('shopify');
    }

    if (project.enabledIntegrations.crm && this.needsCRMData(content)) {
      thinkingSteps.push('Fetching CRM data...');
      const leads = await IntegrationService.getCRMLeads();
      const customers = await IntegrationService.getCRMCustomers();
      
      enhancedSystemPrompt += `\n\nYou have access to CRM data:\nLeads: ${JSON.stringify(leads)}\nCustomers: ${JSON.stringify(customers)}`;
      integrationsUsed.push('crm');
    }

    const aiResponse = await AIService.generateResponse(
      aiMessages,
      enhancedSystemPrompt,
      productInstance.aiConfig.temperature
    );

    const assistantMessage = await Message.create({
      conversationId: conversation._id,
      projectId: conversation.projectId,
      role: 'assistant',
      content: aiResponse.content,
      metadata: {
        thinkingSteps: [...thinkingSteps, ...aiResponse.thinkingSteps],
        integrationsUsed,
        processingTime: aiResponse.processingTime,
      },
    });

    return {
      message: userMessage,
      aiResponse: assistantMessage,
    };
  }

  static async getConversationMessages(
    conversationId: string,
    userId: string,
    projectId: string
  ): Promise<IMessage[]> {
    await connectDB();

    const conversation = await this.getScopedConversation(conversationId, userId, projectId);
    const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });
    return messages;
  }

  static async getUserConversations(userId: string, projectId: string) {
    await connectDB();
    
    const conversations = await Conversation.find({ userId, projectId })
      .sort({ updatedAt: -1 })
      .limit(20);
    
    return conversations;
  }

  static async createConversation(
    userId: string,
    projectId: string,
    productInstanceId: string
  ) {
    await connectDB();
    
    const conversation = await Conversation.create({
      userId,
      projectId,
      productInstanceId,
      title: 'New Conversation',
    });

    return conversation;
  }

  private static needsShopifyData(content: string): boolean {
    const keywords = ['product', 'order', 'inventory', 'shopify', 'shop', 'purchase', 'price'];
    return keywords.some((keyword) => content.toLowerCase().includes(keyword));
  }

  private static needsCRMData(content: string): boolean {
    const keywords = ['lead', 'customer', 'crm', 'client', 'contact', 'sales'];
    return keywords.some((keyword) => content.toLowerCase().includes(keyword));
  }
}
