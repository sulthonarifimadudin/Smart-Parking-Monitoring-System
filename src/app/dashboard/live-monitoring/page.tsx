'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockSessions } from '@/lib/mock-data';
import { formatDateTime } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Search, RefreshCw, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SesiParkir, SessionStatus } from '@/lib/types';

export default function LiveMonitoringPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<SessionStatus | 'ALL'>('ALL');
  const [data, setData] = useState<SesiParkir[]>(mockSessions);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  // Simulate real-time refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setData([...mockSessions]);
      setLastUpdate(new Date());
      setRefreshing(false);
    }, 800);
  };

  const filtered = data.filter((s) => {
    const matchSearch =
      s.plat_nomor.toLowerCase().includes(search.toLowerCase()) ||
      s.session_id.toLowerCase().includes(search.toLowerCase()) ||
      s.zona_parkir.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'ALL' || s.status_sesi === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    ALL: data.length,
    ACTIVE: data.filter((s) => s.status_sesi === 'ACTIVE').length,
    VIOLATION: data.filter((s) => s.status_sesi === 'VIOLATION').length,
    COMPLETED: data.filter((s) => s.status_sesi === 'COMPLETED').length,
  };

  return (
    <DashboardLayout title="Live Monitoring" subtitle="Pantau kendaraan aktif secara real-time">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari plat nomor, session ID, zona..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500/40 transition-all"
          />
        </div>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-slate-400 hover:text-slate-200 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] transition-all"
        >
          <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-4">
        {(['ALL', 'ACTIVE', 'VIOLATION', 'COMPLETED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              filter === tab
                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 border border-transparent hover:border-white/[0.08]'
            )}
          >
            {tab === 'ALL' ? 'Semua' : tab}
            <span
              className={cn(
                'px-1.5 py-0.5 rounded-full text-[10px]',
                filter === tab ? 'bg-blue-500/20 text-blue-400' : 'bg-white/[0.06] text-slate-500'
              )}
            >
              {counts[tab]}
            </span>
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
          <span className="pulse-dot" />
          Update: {lastUpdate.toLocaleTimeString('id-ID')}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Session ID', 'Plat Nomor', 'Waktu Masuk', 'Status', 'Zona Parkir', 'Violation Status'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-500 text-sm">
                    Tidak ada data yang cocok
                  </td>
                </tr>
              ) : (
                filtered.map((session, i) => (
                  <tr
                    key={session.session_id}
                    className={cn(
                      'border-b border-white/[0.04] table-row-hover transition-colors',
                      i % 2 === 0 ? 'bg-white/[0.01]' : ''
                    )}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-blue-400">{session.session_id}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-white">{session.plat_nomor}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                      {formatDateTime(session.waktu_masuk)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={session.status_sesi} />
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">{session.zona_parkir}</td>
                    <td className="px-4 py-3">
                      {session.status_sesi === 'VIOLATION' ? (
                        <StatusBadge status="VIOLATION" />
                      ) : session.status_sesi === 'ACTIVE' ? (
                        <span className="text-xs text-slate-500">—</span>
                      ) : session.status_keputusan ? (
                        <StatusBadge status={session.status_keputusan} />
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
