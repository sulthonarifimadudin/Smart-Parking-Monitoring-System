'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Shield, Bell, Database, Palette, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

function SettingSection({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-blue-400" />
        </div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Toggle({ label, desc, defaultOn = false }: { label: string; desc?: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/[0.04] last:border-0">
      <div>
        <p className="text-sm text-slate-200 font-medium">{label}</p>
        {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => setOn(!on)}
        className="flex-shrink-0"
      >
        {on ? (
          <ToggleRight className="w-7 h-7 text-blue-400 transition-colors" />
        ) : (
          <ToggleLeft className="w-7 h-7 text-slate-600 transition-colors" />
        )}
      </button>
    </div>
  );
}

function InputField({ label, defaultValue, type = 'text' }: { label: string; defaultValue: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-300 mb-1.5">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full px-3 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-lg text-slate-200 focus:outline-none focus:border-blue-500/40 transition-all"
      />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <DashboardLayout title="Settings" subtitle="Konfigurasi sistem Smart Parking Monitoring">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* General */}
        <SettingSection icon={Shield} title="Pengaturan Umum">
          <div className="space-y-4">
            <InputField label="Nama Sistem" defaultValue="Smart Parking Monitoring System" />
            <InputField label="Nama Institusi" defaultValue="Universitas ABC" />
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Timezone</label>
              <select className="w-full px-3 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-lg text-slate-200 focus:outline-none focus:border-blue-500/40">
                <option className="bg-[#0d1526]">Asia/Jakarta (WIB, UTC+7)</option>
                <option className="bg-[#0d1526]">Asia/Makassar (WITA, UTC+8)</option>
                <option className="bg-[#0d1526]">Asia/Jayapura (WIT, UTC+9)</option>
              </select>
            </div>
            <InputField label="Interval Refresh (detik)" defaultValue="5" type="number" />
          </div>
        </SettingSection>

        {/* Notifications */}
        <SettingSection icon={Bell} title="Pengaturan Notifikasi">
          <Toggle label="Notifikasi Pelanggaran" desc="Kirim notif saat pelanggaran terdeteksi" defaultOn />
          <Toggle label="Notifikasi Face Mismatch" desc="Alert saat wajah tidak cocok saat keluar" defaultOn />
          <Toggle label="Notifikasi Plate Mismatch" desc="Alert saat plat nomor tidak cocok" defaultOn />
          <Toggle label="Email Notifikasi" desc="Kirim ringkasan harian ke email admin" />
          <Toggle label="Notifikasi Bunyi" desc="Suara peringatan di dashboard" />
        </SettingSection>

        {/* Database */}
        <SettingSection icon={Database} title="Koneksi Database (Supabase)">
          <div className="space-y-4">
            <InputField label="Supabase URL" defaultValue="https://xxxxx.supabase.co" />
            <InputField label="Supabase Anon Key" defaultValue="eyJh...placeholder" type="password" />
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/10">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-green-400">Mode Demo — menggunakan mock data</span>
            </div>
            <button className="w-full py-2.5 rounded-lg text-sm font-medium text-slate-400 border border-white/[0.08] hover:bg-white/[0.04] hover:text-slate-200 transition-all">
              Test Koneksi
            </button>
          </div>
        </SettingSection>

        {/* Appearance */}
        <SettingSection icon={Palette} title="Tampilan">
          <Toggle label="Dark Mode" desc="Tema gelap (aktif secara default)" defaultOn />
          <Toggle label="Animasi" desc="Aktifkan micro-animations" defaultOn />
          <Toggle label="Compact Mode" desc="Tampilkan lebih banyak data per halaman" />
          <div className="pt-3">
            <p className="text-xs font-medium text-slate-300 mb-3">Warna Aksen</p>
            <div className="flex gap-2">
              {['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444'].map((color) => (
                <button
                  key={color}
                  className={cn(
                    'w-7 h-7 rounded-full border-2 transition-all hover:scale-110',
                    color === '#3b82f6' ? 'border-white' : 'border-transparent'
                  )}
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>
        </SettingSection>
      </div>

      {/* Save button */}
      <div className="flex justify-end mt-5">
        <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-600/20">
          <Save className="w-4 h-4" />
          Simpan Pengaturan
        </button>
      </div>
    </DashboardLayout>
  );
}
