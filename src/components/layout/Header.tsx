'use client';

import { Bell, Search, Wifi, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { id, enUS } from 'date-fns/locale';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifCount] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#050915]/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: Page title */}
        <div>
          <h1 className="text-lg font-bold text-white leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        {/* Right: Search + indicators */}
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/20 bg-green-500/[0.08]">
            <span className="pulse-dot w-2 h-2" />
            <span className="text-xs text-green-400 font-medium">LIVE</span>
          </div>

          {/* Clock */}
          <div className="hidden md:block text-right">
            <p className="text-xs font-mono text-slate-300 leading-tight">
              {format(currentTime, 'HH:mm:ss')}
            </p>
            <p className="text-[10px] text-slate-500">
              {format(currentTime, 'dd MMM yyyy', { locale: language === 'id' ? id : enUS })}
            </p>
          </div>

          {/* Search */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder={t.header.search}
              className="w-56 pl-8 pr-4 py-2 text-xs bg-white/[0.04] border border-white/[0.08] rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-all">
            <Bell className="w-4 h-4" />
            {notifCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">
                {notifCount}
              </span>
            )}
          </button>

          {/* System status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
            <Wifi className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] text-slate-400 font-medium">{t.header.online}</span>
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.1] transition-all"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-300 w-4 text-center">{language.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
