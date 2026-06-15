'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockViolations, mockSessions } from '@/lib/mock-data';
import { formatDateTime, formatRelative } from '@/lib/utils';
import { useState } from 'react';
import { Search, X, MapPin, Clock, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogPelanggaran, ViolationType } from '@/lib/types';

export default function ViolationsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<ViolationType | 'ALL'>('ALL');
  const [selected, setSelected] = useState<LogPelanggaran | null>(null);

  const filtered = mockViolations.filter((v) => {
    const matchSearch =
      v.plat_nomor.toLowerCase().includes(search.toLowerCase()) ||
      v.lokasi_parkir.toLowerCase().includes(search.toLowerCase()) ||
      v.log_id.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'ALL' || v.jenis_pelanggaran === typeFilter;
    return matchSearch && matchType;
  });

  const session = selected ? mockSessions.find((s) => s.session_id === selected.session_id) : null;

  return (
    <DashboardLayout title="Parking Violations" subtitle="Daftar pelanggaran parkir terdeteksi oleh YOLOv8">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari plat nomor, lokasi, log ID..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500/40 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {(['ALL', 'OUT_OF_AREA', 'MISALIGNED_PARKING'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn(
                'px-3 py-2.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap',
                typeFilter === t
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 border border-white/[0.08] bg-white/[0.04]'
              )}
            >
              {t === 'ALL' ? 'Semua' : t === 'OUT_OF_AREA' ? 'Out of Area' : 'Misaligned'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        {/* Main Table */}
        <div className={cn('flex-1 glass-card overflow-hidden', selected ? 'hidden xl:block' : '')}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Bukti', 'Plat Nomor', 'Jenis Pelanggaran', 'Lokasi', 'Waktu Deteksi', 'Notifikasi'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((v, i) => (
                  <tr
                    key={v.log_id}
                    onClick={() => setSelected(v)}
                    className={cn(
                      'border-b border-white/[0.04] table-row-hover transition-colors',
                      i % 2 === 0 ? 'bg-white/[0.01]' : '',
                      selected?.log_id === v.log_id ? 'bg-blue-500/5 border-l-2 border-blue-500' : ''
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="w-16 h-10 rounded-lg overflow-hidden bg-white/[0.04] border border-white/[0.06]">
                        <img
                          src={v.foto_bukti_url}
                          alt="bukti"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">{v.plat_nomor}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={v.jenis_pelanggaran} />
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 max-w-[120px] truncate">{v.lokasi_parkir}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                      {formatDateTime(v.waktu_pelanggaran)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={v.status_notifikasi} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Drawer */}
        {selected && (
          <div className="w-full xl:w-[380px] flex-shrink-0 glass-card p-0 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <h3 className="text-sm font-semibold text-white">Detail Pelanggaran</h3>
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.06] transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Evidence Image */}
            <div className="relative">
              <img
                src={selected.foto_bukti_url}
                alt="Bukti pelanggaran"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1526] to-transparent" />
              <div className="absolute bottom-3 left-3">
                <StatusBadge status={selected.jenis_pelanggaran} size="md" />
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/60 text-xs text-white">
                <ImageIcon className="w-3 h-3" />
                YOLOv8
              </div>
            </div>

            {/* Details */}
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <InfoItem label="Log ID" value={selected.log_id} mono />
                <InfoItem label="Session ID" value={selected.session_id} mono />
                <InfoItem label="Plat Nomor" value={selected.plat_nomor} bold />
                <InfoItem label="Notifikasi" value={<StatusBadge status={selected.status_notifikasi} />} />
              </div>

              <div className="border-t border-white/[0.06] pt-3 space-y-2.5">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Lokasi Parkir</p>
                    <p className="text-xs text-slate-200 mt-0.5">{selected.lokasi_parkir}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Waktu Deteksi</p>
                    <p className="text-xs text-slate-200 mt-0.5">{formatDateTime(selected.waktu_pelanggaran)}</p>
                    <p className="text-[10px] text-slate-500">{formatRelative(selected.waktu_pelanggaran)}</p>
                  </div>
                </div>
                {session && (
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Status Sesi</p>
                      <div className="mt-0.5">
                        <StatusBadge status={session.status_sesi} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Violation badge */}
              <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                <p className="text-[10px] text-red-400 font-semibold uppercase tracking-wide mb-1">Klasifikasi Pelanggaran</p>
                <p className="text-xs text-slate-300">
                  {selected.jenis_pelanggaran === 'OUT_OF_AREA'
                    ? 'Kendaraan parkir di luar area yang ditentukan'
                    : 'Kendaraan tidak parkir sesuai marka/garis'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function InfoItem({ label, value, mono = false, bold = false }: { label: string; value: React.ReactNode; mono?: boolean; bold?: boolean }) {
  return (
    <div>
      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide mb-0.5">{label}</p>
      {typeof value === 'string' ? (
        <p className={cn('text-xs text-slate-200', mono && 'font-mono text-blue-400', bold && 'font-semibold')}>{value}</p>
      ) : (
        value
      )}
    </div>
  );
}
