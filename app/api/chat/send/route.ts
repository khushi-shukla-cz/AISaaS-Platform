import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AccessLayer } from '@/server/access';
import { ChatService } from '@/services/chat.service';
import { getRequestContext } from '@/lib/request-context';
import { checkRateLimitRedis } from '@/lib/redis-rate-limit';
import { aiQueue } from '@/lib/ai-queue';

const sendMessageSchema = z.object({
  conversationId: z.string(),
  projectId: z.string().optional(),
  userId: z.string().optional(),
  content: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = sendMessageSchema.parse(body);
    const requestContext = getRequestContext(request);
    const userId = validated.userId || requestContext.userId;
    const projectId = validated.projectId || requestContext.projectId;

    if (validated.userId && validated.userId !== requestContext.userId) {
      return NextResponse.json({ error: 'userId does not match request context' }, { status: 400 });
    }

    if (validated.projectId && validated.projectId !== requestContext.projectId) {
      return NextResponse.json({ error: 'projectId does not match request context' }, { status: 400 });
    }

    const rateLimit = await checkRateLimitRedis(`chat:${projectId}:${userId}`, 20, 10 * 60 * 1000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please slow down and try again.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(rateLimit.resetAt),
          },
        }
      );
    }

    await AccessLayer.validateUserProjectAccess(userId, projectId);

    const result = await ChatService.sendMessage({
      conversationId: validated.conversationId,
      userId,
      projectId,
      content: validated.content,
      useQueue: true,
    });

    return NextResponse.json(result, {
      headers: {
        'X-RateLimit-Remaining': String(rateLimit.remaining),
        'X-RateLimit-Reset': String(rateLimit.resetAt),
      },
    });
  } catch (error: any) {
    console.error('Send message error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: error.name === 'AccessDeniedError' ? 403 : 500 }
    );
  }
}
