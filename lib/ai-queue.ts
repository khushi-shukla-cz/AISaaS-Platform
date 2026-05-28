import Queue from 'bull';
import { connectDB } from '@/lib/db';
import { Message } from '@/models/Message';
import { AIService } from '@/services/ai.service';
import { AuditService } from '@/services/audit.service';

export interface AIJobData {
  conversationId: string;
  projectId: string;
  userId: string;
  messageId: string;
  systemPrompt: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  temperature: number;
}

export interface AIJobResult {
  content: string;
  thinkingSteps: string[];
  processingTime: number;
  tokenUsage?: {
    promptTokens?: number;
    responseTokens?: number;
    totalTokens?: number;
  };
}

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const aiQueue = new Queue<AIJobData, AIJobResult>('ai-processing', redisUrl, {
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
  },
});

aiQueue.process(async (job) => {
  const { conversationId, projectId, userId, messageId, systemPrompt, messages, temperature } =
    job.data;

  try {
    await connectDB();

    job.progress(10);

    const aiResponse = await AIService.generateResponse(messages, systemPrompt, temperature);

    job.progress(50);

    const assistantMessage = await Message.create({
      conversationId,
      projectId,
      role: 'assistant',
      content: aiResponse.content,
      metadata: {
        thinkingSteps: aiResponse.thinkingSteps,
        processingTime: aiResponse.processingTime,
        tokenUsage: aiResponse.tokenUsage,
      },
    });

    job.progress(80);

    await AuditService.logEvent({
      projectId,
      userId,
      actorRole: 'system',
      action: 'chat.ai_response_generated_async',
      resourceType: 'conversation',
      resourceId: conversationId,
      details: {
        messageId: assistantMessage._id.toString(),
        tokenUsage: aiResponse.tokenUsage,
        processingTime: aiResponse.processingTime,
      },
    });

    job.progress(100);

    return aiResponse;
  } catch (error) {
    console.error('AI job error:', error);

    await AuditService.logEvent({
      projectId,
      userId,
      actorRole: 'system',
      action: 'chat.ai_response_failed',
      resourceType: 'conversation',
      resourceId: conversationId,
      status: 'failure',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    throw error;
  }
});

aiQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});

aiQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});
