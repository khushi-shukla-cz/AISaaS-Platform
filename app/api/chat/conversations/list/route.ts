import { NextRequest, NextResponse } from 'next/server';
import { ChatService } from '@/services/chat.service';
import { AccessLayer } from '@/server/access';

export async function GET(request: NextRequest) {
  try {
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

    const conversations = await ChatService.getUserConversations(userId, projectId);

    return NextResponse.json({ conversations });
  } catch (error: any) {
    console.error('Fetch conversations error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch conversations' },
      { status: error.name === 'AccessDeniedError' ? 403 : 500 }
    );
  }
}
