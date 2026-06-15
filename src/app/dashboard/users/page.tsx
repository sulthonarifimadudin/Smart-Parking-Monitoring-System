'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockUsers } from '@/lib/mock-data';
import { formatRelative } from '@/lib/utils';
import { useState } from 'react';
import { Search, Plus, Shield, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserAccount } from '@/lib/types';

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = mockUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const adminCount = mockUsers.filter((u) => u.role === 'ADMIN').length;
  const officerCount = mockUsers.filter((u) => u.role === 'SECURITY_OFFICER').length;
  const activeCount = mockUsers.filter((u) => u.status === 'ACTIVE').length;

  return (
    <DashboardLayout title="User Management" subtitle="Kelola akun petugas keamanan sistem">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Total Pengguna', value: mockUsers.length, icon: UserCheck, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Admin', value: adminCount, icon: Shield, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          { label: 'Aktif', value: activeCount, icon: UserCheck, color: 'text-green-400', bg: 'bg-green-500/10' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-card p-4 flex items-center gap-3">
              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', s.bg)}>
                <Icon className={cn('w-4 h-4', s.color)} />
              </div>
              <div>
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari username, nama, email..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500/40 transition-all"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          Tambah Pengguna
        </button>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Pengguna', 'Email', 'Role', 'Login Terakhir', 'Status', 'Aksi'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <tr key={user.user_id} className={cn('border-b border-white/[0.04] table-row-hover', i % 2 === 0 ? 'bg-white/[0.01]' : '')}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-white">
                          {user.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{user.full_name}</p>
                        <p className="text-[10px] text-slate-500">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{user.email}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={user.role} />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {user.last_login ? formatRelative(user.last_login) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-[11px] text-blue-400 hover:text-blue-300 font-medium transition-colors px-2 py-1 rounded hover:bg-blue-500/10">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative z-10 w-full max-w-md mx-4 glass-card p-6">
            <h3 className="text-base font-semibold text-white mb-4">Tambah Pengguna Baru</h3>
            <div className="space-y-3">
              {['Nama Lengkap', 'Username', 'Email', 'Password'].map((field) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">{field}</label>
                  <input
                    type={field === 'Password' ? 'password' : 'text'}
                    placeholder={`Masukkan ${field.toLowerCase()}...`}
                    className="w-full px-3 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/40 transition-all"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Role</label>
                <select className="w-full px-3 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-lg text-slate-200 focus:outline-none focus:border-blue-500/40 transition-all">
                  <option value="SECURITY_OFFICER" className="bg-[#0d1526]">Security Officer</option>
                  <option value="ADMIN" className="bg-[#0d1526]">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg text-sm text-slate-400 hover:text-slate-200 border border-white/[0.08] hover:bg-white/[0.04] transition-all">
                Batal
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
