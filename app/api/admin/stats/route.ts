import { NextRequest, NextResponse } from 'next/server';
import { AccessLayer } from '@/server/access';
import { AdminService } from '@/services/admin.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    const userId = searchParams.get('userId');

    if (!projectId || !userId) {
      return NextResponse.json(
        { error: 'projectId and userId are required' },
        { status: 400 }
      );
    }

    await AccessLayer.validateAdminAccess(userId);
    await AccessLayer.validateUserProjectAccess(userId, projectId);

    const stats = await AdminService.getDashboardStats(projectId);

    return NextResponse.json({ stats });
  } catch (error: any) {
    console.error('Fetch stats error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: error.name === 'AccessDeniedError' ? 403 : 500 }
    );
  }
}
