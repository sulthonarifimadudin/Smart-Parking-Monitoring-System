import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function DashboardLayout({ children, title, subtitle, action }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#050915]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 ml-[240px] transition-all duration-300">
        <Header title={title} subtitle={subtitle} action={action} />
        <main className="flex-1 p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
