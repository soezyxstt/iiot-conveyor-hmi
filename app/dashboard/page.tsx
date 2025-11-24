// File: src/app/dashboard/page.tsx
import { Navbar } from '@/components/common/navbar';
import { Dashboard } from '@/components/dashboard';

// make sure 'export default' is here!
export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      <Dashboard />
    </main>
  );
}