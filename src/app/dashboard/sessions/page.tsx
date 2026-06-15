'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockSessions, mockViolations } from '@/lib/mock-data';
import { formatDateTime, formatDuration } from '@/lib/utils';
import { useState } from 'react';
import { Search, X, Car, LogIn, LogOut, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SesiParkir, DecisionStatus } from '@/lib/types';

export default function SessionsPage() {
  const [search, setSearch] = useState('');
  const [decisionFilter, setDecisionFilter] = useState<DecisionStatus | 'ALL'>('ALL');
  const [selected, setSelected] = useState<SesiParkir | null>(null);

  const filtered = mockSessions.filter((s) => {
    const matchSearch =
      s.plat_nomor.toLowerCase().includes(search.toLowerCase()) ||
      s.session_id.toLowerCase().includes(search.toLowerCase());
    const matchDecision =
      decisionFilter === 'ALL' ||
      (decisionFilter === 'CLEAR' && s.status_keputusan === 'CLEAR') ||
      s.status_keputusan === decisionFilter;
    return matchSearch && matchDecision;
  });

  const sessionViolations = selected
    ? mockViolations.filter((v) => v.session_id === selected.session_id)
    : [];

  const decisions: (DecisionStatus | 'ALL')[] = ['ALL', 'CLEAR', 'VERIFIED_WITH_VIOLATION', 'FACE_MISMATCH', 'PLATE_MISMATCH', 'NEED_VERIFICATION'];

  return (
    <DashboardLayout title="Vehicle Sessions" subtitle="Riwayat semua sesi parkir kendaraan">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari plat nomor atau session ID..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500/40 transition-all"
          />
        </div>
      </div>

      {/* Decision filter pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {decisions.map((d) => (
          <button
            key={d}
            onClick={() => setDecisionFilter(d)}
            className={cn(
              'px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border whitespace-nowrap',
              decisionFilter === d
                ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 border-white/[0.08] bg-white/[0.03]'
            )}
          >
            {d === 'ALL' ? 'Semua' : d.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        {/* Table */}
        <div className={cn('flex-1 glass-card overflow-hidden', selected ? 'hidden xl:block' : '')}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Session ID', 'Plat Nomor', 'Waktu Masuk', 'Waktu Keluar', 'Status', 'Keputusan'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr
                    key={s.session_id}
                    onClick={() => setSelected(s)}
                    className={cn(
                      'border-b border-white/[0.04] table-row-hover transition-colors',
                      i % 2 === 0 ? 'bg-white/[0.01]' : '',
                      selected?.session_id === s.session_id ? 'bg-blue-500/5 border-l-2 border-l-blue-500' : ''
                    )}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-blue-400">{s.session_id}</td>
                    <td className="px-4 py-3 font-semibold text-white">{s.plat_nomor}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{formatDateTime(s.waktu_masuk)}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                      {s.waktu_keluar ? formatDateTime(s.waktu_keluar) : <span className="text-green-400 text-[10px]">Sedang parkir</span>}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={s.status_sesi} /></td>
                    <td className="px-4 py-3">
                      {s.status_keputusan ? <StatusBadge status={s.status_keputusan} /> : <span className="text-xs text-slate-500">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal (inline) */}
        {selected && (
          <div className="w-full xl:w-[400px] flex-shrink-0 glass-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <h3 className="text-sm font-semibold text-white">Detail Sesi</h3>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.06] transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto max-h-[70vh]">
              {/* Vehicle Info */}
              <Section icon={Car} title="Informasi Kendaraan" iconColor="text-blue-400">
                <Grid2>
                  <InfoItem label="Session ID" value={selected.session_id} mono />
                  <InfoItem label="Plat Nomor" value={selected.plat_nomor} bold />
                  <InfoItem label="Zona Parkir" value={selected.zona_parkir} />
                  <InfoItem label="Status Sesi" value={<StatusBadge status={selected.status_sesi} />} />
                </Grid2>
              </Section>

              {/* Entry Info */}
              <Section icon={LogIn} title="Informasi Masuk" iconColor="text-green-400">
                <Grid2>
                  <InfoItem label="Waktu Masuk" value={formatDateTime(selected.waktu_masuk)} />
                  <InfoItem label="Gate Masuk" value={selected.lokasi_gate_masuk} />
                </Grid2>
              </Section>

              {/* Exit Info */}
              <Section icon={LogOut} title="Informasi Keluar" iconColor="text-slate-400">
                {selected.waktu_keluar ? (
                  <Grid2>
                    <InfoItem label="Waktu Keluar" value={formatDateTime(selected.waktu_keluar)} />
                    <InfoItem label="Gate Keluar" value={selected.lokasi_gate_keluar || '—'} />
                    <InfoItem label="Durasi" value={formatDuration(selected.waktu_masuk, selected.waktu_keluar)} />
                    <InfoItem label="Keputusan" value={selected.status_keputusan ? <StatusBadge status={selected.status_keputusan} /> : '—'} />
                  </Grid2>
                ) : (
                  <p className="text-xs text-green-400">Kendaraan masih berada di dalam kampus</p>
                )}
              </Section>

              {/* Violations */}
              <Section icon={AlertTriangle} title={`Riwayat Pelanggaran (${sessionViolations.length})`} iconColor="text-red-400">
                {sessionViolations.length === 0 ? (
                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Tidak ada pelanggaran
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sessionViolations.map((v) => (
                      <div key={v.log_id} className="flex items-start gap-3 p-2.5 rounded-lg bg-red-500/5 border border-red-500/10">
                        <img src={v.foto_bukti_url} alt="bukti" className="w-12 h-8 object-cover rounded flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <StatusBadge status={v.jenis_pelanggaran} />
                          <p className="text-[10px] text-slate-500 mt-1">{v.lokasi_parkir}</p>
                          <p className="text-[10px] text-slate-600">{formatDateTime(v.waktu_pelanggaran)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function Section({ icon: Icon, title, iconColor, children }: { icon: React.ElementType; title: string; iconColor: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <Icon className={cn('w-3.5 h-3.5', iconColor)} />
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wide">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

function InfoItem({ label, value, mono = false, bold = false }: { label: string; value: React.ReactNode; mono?: boolean; bold?: boolean }) {
  return (
    <div>
      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide mb-0.5">{label}</p>
      {typeof value === 'string' ? (
        <p className={cn('text-xs text-slate-200', mono && 'font-mono text-blue-400', bold && 'font-semibold')}>{value}</p>
      ) : value}
    </div>
  );
}
