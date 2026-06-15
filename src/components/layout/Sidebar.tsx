'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Monitor,
  AlertTriangle,
  Car,
  DoorOpen,
  BarChart3,
  Users,
  Settings,
  Shield,
  ChevronLeft,
  Cctv,
} from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useSession, signOut } from 'next-auth/react';

type NavKey = 'dashboard' | 'liveMonitoring' | 'cameraMonitoring' | 'parkingViolations' | 'vehicleSessions' | 'gateMonitoring' | 'analytics' | 'users' | 'settings';

const navItems: { key: NavKey; href: string; icon: any }[] = [
  { key: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
  { key: 'liveMonitoring', href: '/dashboard/live-monitoring', icon: Monitor },
  { key: 'cameraMonitoring', href: '/dashboard/cameras', icon: Cctv },
  { key: 'parkingViolations', href: '/dashboard/violations', icon: AlertTriangle },
  { key: 'vehicleSessions', href: '/dashboard/sessions', icon: Car },
  { key: 'gateMonitoring', href: '/dashboard/gate-monitoring', icon: DoorOpen },
  { key: 'analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { key: 'users', href: '/dashboard/users', icon: Users },
  { key: 'settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const { data: session } = useSession();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full flex flex-col transition-all duration-300 z-40',
        'border-r border-white/[0.06]',
        'bg-[#080f1e]',
        collapsed ? 'w-[70px]' : 'w-[240px]'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg">
          <Shield className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white leading-tight">Smart Parking</p>
            <p className="text-[10px] text-slate-400 leading-tight">Monitoring System</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-3">
            {t.nav.menu}
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group',
                isActive
                  ? 'bg-blue-500/10 text-blue-400 border-l-2 border-blue-500 pl-[10px]'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
              )}
              title={collapsed ? t.nav[item.key] : undefined}
            >
              <Icon
                className={cn(
                  'w-4 h-4 flex-shrink-0',
                  isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                )}
              />
              {!collapsed && (
                <span className="font-medium truncate">{t.nav[item.key]}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom — collapse toggle + user */}
      <div className="border-t border-white/[0.06] px-2 py-3 space-y-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-all text-xs"
        >
          <ChevronLeft
            className={cn('w-4 h-4 transition-transform duration-300', collapsed && 'rotate-180')}
          />
          {!collapsed && <span>{t.nav.collapse}</span>}
        </button>

        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
            {session?.user?.image ? (
              <img src={session.user.image} alt={session.user.name || 'User'} className="w-7 h-7 rounded-full flex-shrink-0" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-white">{session?.user?.name?.substring(0, 2).toUpperCase() || 'AD'}</span>
              </div>
            )}
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate">{session?.user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-500 truncate">{session?.user?.email || 'admin@universitas.ac.id'}</p>
            </div>
          </div>
        )}
        
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-xs",
            collapsed && "justify-center"
          )}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
