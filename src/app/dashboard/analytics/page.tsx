'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockViolationTypes } from '@/lib/mock-data';
import { getDashboardData, TimeFilter } from '@/app/actions/dashboard';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Car, AlertTriangle, TrendingDown, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const peakHoursData = [
  { hour: '06', mon: 2, tue: 1, wed: 3, thu: 2, fri: 4 },
  { hour: '07', mon: 8, tue: 9, wed: 10, thu: 7, fri: 12 },
  { hour: '08', mon: 15, tue: 14, wed: 16, thu: 13, fri: 18 },
  { hour: '09', mon: 12, tue: 11, wed: 13, thu: 10, fri: 14 },
  { hour: '10', mon: 9, tue: 8, wed: 10, thu: 7, fri: 11 },
  { hour: '11', mon: 6, tue: 5, wed: 7, thu: 5, fri: 8 },
  { hour: '12', mon: 4, tue: 3, wed: 5, thu: 3, fri: 5 },
  { hour: '13', mon: 7, tue: 6, wed: 8, thu: 6, fri: 9 },
  { hour: '14', mon: 5, tue: 4, wed: 6, thu: 4, fri: 7 },
  { hour: '15', mon: 3, tue: 2, wed: 4, thu: 2, fri: 5 },
  { hour: '16', mon: 1, tue: 1, wed: 2, thu: 1, fri: 2 },
  { hour: '17', mon: 0, tue: 0, wed: 1, thu: 0, fri: 1 },
];

const PIE_COLORS = ['#ef4444', '#f59e0b'];
const STACKED_COLORS = { terisi: '#3b82f6', kosong: 'rgba(59,130,246,0.15)' };

export default function AnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');

  const { data, isLoading } = useQuery({
    queryKey: ['dashboardData', timeFilter],
    queryFn: () => getDashboardData(timeFilter),
    refetchInterval: 5000,
  });

  if (isLoading || !data) {
    return (
      <DashboardLayout title="Analytics" subtitle="Visualisasi dan statistik mendalam sistem parkir">
        <div className="flex items-center justify-center h-64 text-slate-400">Loading data from Postgres...</div>
      </DashboardLayout>
    );
  }

  const { stats, hourlyTraffic, dailyViolations, zoneDistribution } = data;

  const utilizationData = zoneDistribution.map((z) => ({
    zone: z.zone,
    terisi: z.count,
    kosong: z.capacity - z.count,
    utilisasi: Math.round((z.count / z.capacity) * 100),
  }));

  const statCards = [
    {
      label: 'Total Sesi',
      value: stats.vehicles_entered_today,
      icon: Car,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      suffix: 'sesi',
    },
    {
      label: 'Total Pelanggaran',
      value: stats.todays_violations,
      icon: AlertTriangle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      suffix: 'kasus',
    },
    {
      label: 'Violation Rate',
      value: stats.vehicles_entered_today ? Math.round((stats.todays_violations / stats.vehicles_entered_today) * 100) : 0,
      icon: TrendingDown,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      suffix: '%',
    },
    {
      label: 'Rata-rata Durasi',
      value: `1j 45m`, // Mock for now
      icon: Clock,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      suffix: '',
    },
  ];

  return (
    <DashboardLayout 
      title="Analytics" 
      subtitle="Visualisasi dan statistik mendalam sistem parkir"
      action={
        <div className="flex items-center bg-white/[0.04] border border-white/[0.08] rounded-lg p-1">
          <button 
            onClick={() => setTimeFilter('today')}
            className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-all", timeFilter === 'today' ? "bg-blue-500 text-white" : "text-slate-400 hover:text-slate-200")}
          >Hari Ini</button>
          <button 
            onClick={() => setTimeFilter('week')}
            className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-all", timeFilter === 'week' ? "bg-blue-500 text-white" : "text-slate-400 hover:text-slate-200")}
          >Pekan Ini</button>
          <button 
            onClick={() => setTimeFilter('month')}
            className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-all", timeFilter === 'month' ? "bg-blue-500 text-white" : "text-slate-400 hover:text-slate-200")}
          >Bulan Ini</button>
        </div>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass-card p-5 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 blur-2xl bg-blue-500" />
              <div className="flex items-center gap-3 mb-3">
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', card.bg)}>
                  <Icon className={cn('w-4 h-4', card.color)} />
                </div>
                <p className="text-xs text-slate-400 font-medium">{card.label}</p>
              </div>
              <p className="text-2xl font-bold text-white">
                {card.value}
                {card.suffix && <span className="text-sm font-normal text-slate-400 ml-1">{card.suffix}</span>}
              </p>
            </div>
          );
        })}
      </div>

      {/* Row 1: Traffic + Violations */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Vehicle Traffic by Hour</h3>
          <p className="text-xs text-slate-400 mb-4">Pola lalu lintas kendaraan per jam</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={hourlyTraffic} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="aBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="aViolet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(8,15,30,0.95)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 10, color: '#94a3b8' }} />
              <Area type="monotone" dataKey="masuk" name="Masuk" stroke="#3b82f6" strokeWidth={2} fill="url(#aBlue)" dot={false} />
              <Area type="monotone" dataKey="keluar" name="Keluar" stroke="#8b5cf6" strokeWidth={2} fill="url(#aViolet)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Violation Trends</h3>
          <p className="text-xs text-slate-400 mb-4">Tren pelanggaran 7 hari terakhir</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dailyViolations} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(8,15,30,0.95)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="count" name="Pelanggaran" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: '#ef4444', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Pie + Utilization + Peak hours bar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Violation types pie */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Most Frequent Violation Types</h3>
          <p className="text-xs text-slate-400 mb-4">Distribusi jenis pelanggaran</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={mockViolationTypes} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={70} paddingAngle={3}>
                {mockViolationTypes.map((entry, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} fillOpacity={0.85} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'rgba(8,15,30,0.95)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Zone utilization */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Parking Area Utilization</h3>
          <p className="text-xs text-slate-400 mb-4">Kapasitas terpakai per zona parkir</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={utilizationData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="zone" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(8,15,30,0.95)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="terisi" name="Terisi" stackId="a" fill={STACKED_COLORS.terisi} radius={[0, 0, 0, 0]} fillOpacity={0.85} />
              <Bar dataKey="kosong" name="Kosong" stackId="a" fill={STACKED_COLORS.kosong} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Peak hours */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Peak Parking Hours</h3>
          <p className="text-xs text-slate-400 mb-4">Jam sibuk parkir per hari (mingguan)</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={peakHoursData} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}:00`} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(8,15,30,0.95)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="fri" name="Jumat" fill="#3b82f6" radius={[2, 2, 0, 0]} fillOpacity={0.9} />
              <Bar dataKey="mon" name="Senin" fill="#8b5cf6" radius={[2, 2, 0, 0]} fillOpacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}
