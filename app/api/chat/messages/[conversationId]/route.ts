import { NextRequest, NextResponse } from 'next/server';
import { AccessLayer } from '@/server/access';
import { ChatService } from '@/services/chat.service';

export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const { conversationId } = params;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const projectId = searchParams.get('projectId');

    if (!userId || !projectId) {
      return NextResponse.json(
        { error: 'userId and projectId are required' },
        { status: 400 }
      );
    }

    await AccessLayer.validateUserProjectAccess(userId, projectId);

    const messages = await ChatService.getConversationMessages(conversationId, userId, projectId);

    return NextResponse.json({ messages });
  } catch (error: any) {
    console.error('Fetch messages error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
