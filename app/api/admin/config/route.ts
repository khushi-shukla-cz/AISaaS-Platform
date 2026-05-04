import { NextRequest, NextResponse } from 'next/server';
import { AccessLayer } from '@/server/access';
import { AdminService } from '@/services/admin.service';
import { DEMO_USER_ID } from '@/lib/demo-identity';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }

    await AccessLayer.validateAdminAccess(DEMO_USER_ID);
    await AccessLayer.validateUserProjectAccess(DEMO_USER_ID, projectId);

    const config = await AdminService.getDashboardConfig(projectId);

    return NextResponse.json({ config });
  } catch (error: any) {
    console.error('Fetch dashboard config error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch dashboard config' },
      { status: error.name === 'AccessDeniedError' ? 403 : 500 }
    );
  }
}
