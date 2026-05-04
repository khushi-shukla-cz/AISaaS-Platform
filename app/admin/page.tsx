'use client';

import AdminDashboard from '@/components/AdminDashboard';

const DEMO_USER_ID = '000000000000000000000001';
const DEMO_PROJECT_ID = '000000000000000000000002';

export default function AdminPage() {
  return <AdminDashboard projectId={DEMO_PROJECT_ID} userId={DEMO_USER_ID} />;
}
