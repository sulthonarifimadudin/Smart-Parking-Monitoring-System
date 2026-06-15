'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockGateEntries, mockGateExits } from '@/lib/mock-data';
import { formatDateTime } from '@/lib/utils';
import { useState } from 'react';
import { Search, LogIn, LogOut, DoorOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'entry' | 'exit';

const DECISION_COLORS: Record<string, string> = {
  CLEAR: 'text-green-400',
  VERIFIED_WITH_VIOLATION: 'text-yellow-400',
  NEED_VERIFICATION: 'text-orange-400',
  FACE_MISMATCH: 'text-red-400',
  PLATE_MISMATCH: 'text-rose-600',
};

export default function GateMonitoringPage() {
  const [tab, setTab] = useState<Tab>('entry');
  const [search, setSearch] = useState('');

  const filteredEntries = mockGateEntries.filter(
    (e) =>
      e.plat_nomor.toLowerCase().includes(search.toLowerCase()) ||
      e.session_id.toLowerCase().includes(search.toLowerCase()) ||
      e.lokasi_gate_masuk.toLowerCase().includes(search.toLowerCase())
  );

  const filteredExits = mockGateExits.filter(
    (e) =>
      e.plat_nomor.toLowerCase().includes(search.toLowerCase()) ||
      e.session_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Gate Monitoring" subtitle="Pemantauan kendaraan di setiap gerbang masuk & keluar">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Masuk', value: mockGateEntries.length, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Total Keluar', value: mockGateExits.length, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Gate Aktif', value: 4, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          { label: 'Perlu Verifikasi', value: mockGateExits.filter((e) => e.status_keputusan !== 'CLEAR').length, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4 flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', stat.bg)}>
              <span className={cn('text-xl font-bold', stat.color)}>{stat.value}</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex gap-1 p-1 bg-white/[0.04] border border-white/[0.08] rounded-lg">
          <button
            onClick={() => setTab('entry')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
              tab === 'entry' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <LogIn className="w-4 h-4" />
            Gate Entry
          </button>
          <button
            onClick={() => setTab('exit')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
              tab === 'exit' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <LogOut className="w-4 h-4" />
            Gate Exit
          </button>
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari plat nomor, gate..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500/40 transition-all"
          />
        </div>
      </div>

      {/* Gate Entry Table */}
      {tab === 'entry' && (
        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <LogIn className="w-4 h-4 text-green-400" />
              <h3 className="text-sm font-semibold text-white">Gate Entry Monitoring</h3>
            </div>
            <span className="text-xs text-slate-500">{filteredEntries.length} record</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['#', 'Session ID', 'Plat Nomor', 'Timestamp Masuk', 'Lokasi Gate'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry, i) => (
                  <tr key={entry.session_id} className={cn('border-b border-white/[0.04] table-row-hover', i % 2 === 0 ? 'bg-white/[0.01]' : '')}>
                    <td className="px-4 py-3 text-xs text-slate-600">{i + 1}</td>
                    <td className="px-4 py-3 font-mono text-xs text-blue-400">{entry.session_id}</td>
                    <td className="px-4 py-3 font-semibold text-white">{entry.plat_nomor}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{formatDateTime(entry.waktu_masuk)}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-300 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08]">
                        {entry.lokasi_gate_masuk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Gate Exit Table */}
      {tab === 'exit' && (
        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-white">Gate Exit Monitoring</h3>
            </div>
            <span className="text-xs text-slate-500">{filteredExits.length} record</span>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 px-4 py-3 border-b border-white/[0.04] bg-white/[0.01]">
            {Object.entries(DECISION_COLORS).map(([key, color]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={cn('w-2 h-2 rounded-full', color.replace('text-', 'bg-'))} />
                <span className="text-[10px] text-slate-500">{key.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['#', 'Session ID', 'Plat Nomor', 'Timestamp Keluar', 'Status Keputusan'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredExits.map((exit, i) => (
                  <tr key={exit.session_id} className={cn('border-b border-white/[0.04] table-row-hover', i % 2 === 0 ? 'bg-white/[0.01]' : '')}>
                    <td className="px-4 py-3 text-xs text-slate-600">{i + 1}</td>
                    <td className="px-4 py-3 font-mono text-xs text-blue-400">{exit.session_id}</td>
                    <td className="px-4 py-3 font-semibold text-white">{exit.plat_nomor}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{formatDateTime(exit.waktu_keluar)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={exit.status_keputusan} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
