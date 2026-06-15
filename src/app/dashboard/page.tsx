'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/shared/KPICard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { getDashboardData, TimeFilter } from '@/app/actions/dashboard';
import { useQuery } from '@tanstack/react-query';
import {
  Car, AlertTriangle, LogIn, LogOut, ScanFace, ScanLine,
  ArrowUpRight, ArrowDownRight, Clock, Cctv, ExternalLink, WifiOff,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { formatRelative } from '@/lib/utils';
import { cn } from '@/lib/utils';

const ZONE_COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b'];

const activityIconMap = {
  ENTRY: { icon: ArrowUpRight, color: 'text-green-400', bg: 'bg-green-500/10' },
  EXIT: { icon: ArrowDownRight, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  VIOLATION: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
  ALERT: { icon: ScanFace, color: 'text-orange-400', bg: 'bg-orange-500/10' },
};

export default function DashboardPage() {
  const { t } = useLanguage();
  const [selectedCamId, setSelectedCamId] = useState(dashboardCameras[0].id);
  const selectedCam = dashboardCameras.find(c => c.id === selectedCamId) || dashboardCameras[0];
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');
  const [cameraMode, setCameraMode] = useState<'simulation' | 'live'>('simulation');

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardData', timeFilter],
    queryFn: () => getDashboardData(timeFilter),
    refetchInterval: 5000, // auto refresh every 5 seconds for live feel
  });

  if (isLoading) {
    return (
      <DashboardLayout title={t.dashboard.title} subtitle={t.dashboard.subtitle}>
        <div className="flex items-center justify-center h-64 text-slate-400">Loading data from Postgres...</div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout title={t.dashboard.title} subtitle={t.dashboard.subtitle}>
        <div className="flex items-center justify-center h-64 text-red-400">Failed to load data.</div>
      </DashboardLayout>
    );
  }

  const { stats, hourlyTraffic, dailyViolations, zoneDistribution, recentActivities } = data;

  return (
    <DashboardLayout
      title={t.dashboard.title}
      subtitle={t.dashboard.subtitle}
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
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KPICard
          title={t.dashboard.kpi.activeVehicles}
          value={stats.active_vehicles}
          subtitle={t.dashboard.kpi.inCampus}
          icon={Car}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
          trend={{ value: 12, label: t.dashboard.kpi.vsYesterday }}
        />
        <KPICard
          title={t.dashboard.kpi.todaysViolations}
          value={stats.todays_violations}
          subtitle={t.dashboard.kpi.violationsToday}
          icon={AlertTriangle}
          iconColor="text-red-400"
          iconBg="bg-red-500/10"
          alert
          trend={{ value: -5, label: t.dashboard.kpi.vsYesterday }}
        />
        <KPICard
          title={t.dashboard.kpi.vehiclesEntered}
          value={stats.vehicles_entered_today}
          subtitle={t.dashboard.kpi.enteredToday}
          icon={LogIn}
          iconColor="text-green-400"
          iconBg="bg-green-500/10"
          trend={{ value: 8, label: t.dashboard.kpi.vsYesterday }}
        />
        <KPICard
          title={t.dashboard.kpi.vehiclesExited}
          value={stats.vehicles_exited_today}
          subtitle={t.dashboard.kpi.exitedToday}
          icon={LogOut}
          iconColor="text-slate-400"
          iconBg="bg-slate-500/10"
        />
        <KPICard
          title={t.dashboard.kpi.faceMismatch}
          value={stats.face_mismatch_alerts}
          subtitle={t.dashboard.kpi.alertsToday}
          icon={ScanFace}
          iconColor="text-orange-400"
          iconBg="bg-orange-500/10"
          alert={stats.face_mismatch_alerts > 0}
        />
        <KPICard
          title={t.dashboard.kpi.plateMismatch}
          value={stats.plate_mismatch_alerts}
          subtitle={t.dashboard.kpi.alertsToday}
          icon={ScanLine}
          iconColor="text-rose-400"
          iconBg="bg-rose-500/10"
          alert={stats.plate_mismatch_alerts > 0}
        />
      </div>

      {/* Live Camera Feed Section */}
      <div className="mb-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Main Feed (Large) */}
        <div className="xl:col-span-2 glass-card overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <Cctv className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-white">{t.dashboard.liveCamera.title}</h3>
              <div className="flex items-center gap-1.5 ml-1">
                <span className="pulse-dot" />
                <span className="text-xs text-green-400 font-medium">{t.dashboard.liveCamera.live}</span>
              </div>
            </div>
            
            {/* Camera Mode Toggle */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white/[0.04] border border-white/[0.08] rounded-full p-0.5">
                <button
                  onClick={() => setCameraMode('simulation')}
                  className={cn("px-3 py-1 text-xs font-medium rounded-full transition-all", cameraMode === 'simulation' ? "bg-blue-500 text-white" : "text-slate-400 hover:text-slate-200")}
                >
                  Simulation
                </button>
                <button
                  onClick={() => setCameraMode('live')}
                  className={cn("px-3 py-1 text-xs font-medium rounded-full transition-all flex items-center gap-1.5", cameraMode === 'live' ? "bg-red-500 text-white" : "text-slate-400 hover:text-slate-200")}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full", cameraMode === 'live' ? "bg-white animate-pulse" : "bg-slate-500")} />
                  Live Demo
                </button>
              </div>
              <a
                href="/dashboard/cameras"
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                {t.dashboard.liveCamera.viewAll}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Large Video Player */}
          <div className="relative aspect-video bg-[#050915] w-full">
            <MiniCameraCard cam={selectedCam} isLarge={true} mode={cameraMode} />
          </div>
        </div>

        {/* Other Feeds List */}
        <div className="glass-card flex flex-col">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
             <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{t.dashboard.liveCamera.otherFeeds}</h3>
             <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{dashboardCameras.length} {t.dashboard.liveCamera.live}</span>
          </div>
          <div className="flex-1 p-3 overflow-y-auto max-h-[300px] xl:max-h-none flex flex-col gap-2">
            {dashboardCameras.map((cam) => (
              <button
                key={cam.id}
                onClick={() => setSelectedCamId(cam.id)}
                className={cn(
                  'flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all',
                  selectedCamId === cam.id
                    ? 'bg-blue-500/10 border-blue-500/30'
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
                )}
              >
                <div className="w-16 h-10 rounded bg-[#050915] overflow-hidden flex-shrink-0 relative border border-white/5">
                    <img src={`https://picsum.photos/seed/${cam.seed}/160/90`} alt={cam.name} className={cn("w-full h-full object-cover", cam.status === 'OFFLINE' && 'grayscale brightness-50')} />
                    {cam.status === 'RECORDING' && <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                    {cam.status === 'OFFLINE' && <WifiOff className="absolute inset-0 m-auto w-3 h-3 text-slate-400" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-200 truncate">{cam.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={cn('w-1.5 h-1.5 rounded-full', cam.status === 'ONLINE' ? 'bg-green-500' : cam.status === 'RECORDING' ? 'bg-red-500 animate-pulse' : 'bg-slate-600')} />
                    <p className="text-[10px] text-slate-500 truncate">{cam.status}</p>
                  </div>
                </div>
                {cam.hasAlert && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        {/* Traffic Trend - 2/3 width */}
        <div className="xl:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">{t.dashboard.charts.trafficTrend}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{t.dashboard.charts.trafficDesc}</p>
            </div>
            <span className="text-xs text-slate-500 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.06]">
              {t.dashboard.charts.today}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={hourlyTraffic} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorKeluar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'rgba(8,15,30,0.95)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12, color: '#94a3b8' }} />
              <Area type="monotone" dataKey="masuk" name={t.dashboard.charts.masuk} stroke="#3b82f6" strokeWidth={2} fill="url(#colorMasuk)" dot={false} />
              <Area type="monotone" dataKey="keluar" name={t.dashboard.charts.keluar} stroke="#8b5cf6" strokeWidth={2} fill="url(#colorKeluar)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Violation Stats */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">{t.dashboard.charts.violationStats}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{t.dashboard.charts.last7Days}</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dailyViolations} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'rgba(8,15,30,0.95)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Bar dataKey="count" name={t.dashboard.charts.pelanggaran} fill="#ef4444" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Zone Distribution */}
        <div className="glass-card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white">{t.dashboard.charts.zoneDistribution}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{t.dashboard.charts.zoneDesc}</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={zoneDistribution}
                dataKey="count"
                nameKey="zone"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
              >
                {zoneDistribution.map((entry, index) => (
                  <Cell key={entry.zone} fill={ZONE_COLORS[index % ZONE_COLORS.length]} fillOpacity={0.85} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'rgba(8,15,30,0.95)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {zoneDistribution.map((zone, i) => (
              <div key={zone.zone} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: ZONE_COLORS[i] }} />
                  <span className="text-xs text-slate-400">{zone.zone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(zone.count / zone.capacity) * 100}%`,
                        background: ZONE_COLORS[i],
                        opacity: 0.8,
                      }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 w-12 text-right">{zone.count}/{zone.capacity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities - 2/3 width */}
        <div className="xl:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">{t.dashboard.recentActivities.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{t.dashboard.recentActivities.desc}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="pulse-dot" />
              <span className="text-xs text-green-400">{t.dashboard.recentActivities.live}</span>
            </div>
          </div>

          <div className="space-y-2">
            {recentActivities.map((activity) => {
              const iconConfig = activityIconMap[activity.type];
              const Icon = iconConfig.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-white/[0.08] transition-all group"
                >
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', iconConfig.bg)}>
                    <Icon className={cn('w-4 h-4', iconConfig.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-semibold text-slate-200">{activity.plat_nomor}</span>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{activity.description}</p>
                      </div>
                      {activity.status && (
                        <StatusBadge status={activity.status as any} />
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Clock className="w-3 h-3 text-slate-600" />
                      <span className="text-[10px] text-slate-500">{formatRelative(activity.timestamp)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </DashboardLayout>
  );
}

// ─── Mini Camera Data ──────────────────────────────────────────────
const dashboardCameras = [
  { id: 'CAM-01', name: 'Gate Utara - Masuk', status: 'ONLINE' as const, hasAlert: false, seed: 'cam1' },
];

function MiniCameraCard({
  cam,
  index,
  isLarge = false,
  mode = 'simulation',
}: {
  cam: { id: string; name: string; status: 'ONLINE' | 'RECORDING' | 'OFFLINE'; hasAlert: boolean; seed: string };
  index?: number;
  isLarge?: boolean;
  mode?: 'simulation' | 'live';
}) {
  const { t } = useLanguage();
  const [time, setTime] = useState(() => new Date());
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (mode === 'live' && isLarge) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Error accessing webcam:", err);
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [mode, isLarge]);

  const isOffline = cam.status === 'OFFLINE';
  const isRec = cam.status === 'RECORDING';

  return (
    <div
      className={cn(
        'relative overflow-hidden group cursor-pointer w-full h-full',
        !isLarge && index !== undefined && index % 2 === 0 ? 'border-r border-white/[0.06]' : '',
        !isLarge && index !== undefined && index < 2 ? 'border-b border-white/[0.06]' : '',
        cam.hasAlert ? (isLarge ? 'border-2 border-amber-500/50' : 'ring-inset ring-1 ring-amber-500/30') : '',
      )}
    >
      {isOffline ? (
        <div className="aspect-video bg-[#06090f] flex flex-col items-center justify-center gap-1.5">
          <WifiOff className="w-6 h-6 text-slate-700" />
          <p className="text-[10px] text-slate-600">{t.dashboard.liveCamera.offline}</p>
        </div>
      ) : (
        <div className="aspect-video relative bg-[#050915] overflow-hidden">
          {/* Feed */}
          {isLarge ? (
            mode === 'simulation' ? (
              <video
                src="/VideotesParkiran4.MOV"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover brightness-90"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover brightness-90"
              />
            )
          ) : (
            <img
              src={`https://picsum.photos/seed/${cam.seed}/480/270`}
              alt={cam.name}
              className="w-full h-full object-cover brightness-75 group-hover:brightness-90 transition-all duration-300"
            />
          )}

          {/* CRT scanlines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.07]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 4px)',
            }}
          />

          {/* Gradients */}
          <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/90 to-transparent" />

          {/* Alert border pulse */}
          {cam.hasAlert && (
            <div className="absolute inset-0 border border-amber-500/50 animate-pulse pointer-events-none" />
          )}

          {/* Top-left: cam ID */}
          <div className="absolute top-1.5 left-2 flex items-center gap-1">
            <span className="font-mono text-[9px] text-white/70 bg-black/50 px-1.5 py-0.5 rounded">
              {cam.id}
            </span>
            <div className="flex items-center gap-1 bg-black/50 px-1.5 py-0.5 rounded">
              <span
                className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  isRec ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                )}
              />
              <span className={cn('text-[8px] font-bold tracking-wider', isRec ? 'text-red-400' : 'text-green-400')}>
                {isRec ? 'REC' : 'LIVE'}
              </span>
            </div>
          </div>

          {/* Top-right: timestamp */}
          <div className="absolute top-1.5 right-2">
            <span className="font-mono text-[9px] text-white/60 bg-black/50 px-1.5 py-0.5 rounded">
              {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          {/* Alert badge */}
          {cam.hasAlert && (
            <div className="absolute top-6 right-2 flex items-center gap-1 bg-amber-500/90 px-1.5 py-0.5 rounded">
              <AlertTriangle className="w-2 h-2 text-black" />
              <span className="text-[8px] font-bold text-black">ALERT</span>
            </div>
          )}

          {/* Bottom label */}
          <div className="absolute bottom-0 inset-x-0 px-2 py-1.5">
            <p className="text-[10px] font-semibold text-white truncate">{cam.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}
