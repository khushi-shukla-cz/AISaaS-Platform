'use client';

import AdminDashboard from '@/components/AdminDashboard';
import { DEMO_PROJECT_ID, DEMO_USER_ID } from '@/lib/demo-identity';

export default function AdminPage() {
  return <AdminDashboard projectId={DEMO_PROJECT_ID} userId={DEMO_USER_ID} />;
}
