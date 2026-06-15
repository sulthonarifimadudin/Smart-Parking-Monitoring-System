'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useState, useEffect } from 'react';
import { Camera, Maximize2, Volume2, VolumeX, RefreshCw, Circle, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  zone: string;
  status: 'ONLINE' | 'OFFLINE' | 'RECORDING';
  hasAlert: boolean;
  imageUrl: string;
  fps: number;
  resolution: string;
}

const cameras: CameraFeed[] = [
  { id: 'CAM-01', name: 'Gate Utara - Masuk', location: 'Gerbang Utara', zone: 'Entry', status: 'ONLINE', hasAlert: false, imageUrl: 'https://picsum.photos/seed/cam1/640/360', fps: 30, resolution: '1080p' },
  { id: 'CAM-02', name: 'Gate Utara - Keluar', location: 'Gerbang Utara', zone: 'Exit', status: 'RECORDING', hasAlert: true, imageUrl: 'https://picsum.photos/seed/cam2/640/360', fps: 30, resolution: '1080p' },
  { id: 'CAM-03', name: 'Gate Selatan - Masuk', location: 'Gerbang Selatan', zone: 'Entry', status: 'ONLINE', hasAlert: false, imageUrl: 'https://picsum.photos/seed/cam3/640/360', fps: 25, resolution: '720p' },
  { id: 'CAM-04', name: 'Gate Selatan - Keluar', location: 'Gerbang Selatan', zone: 'Exit', status: 'ONLINE', hasAlert: false, imageUrl: 'https://picsum.photos/seed/cam4/640/360', fps: 25, resolution: '720p' },
  { id: 'CAM-05', name: 'Zona A - Overview', location: 'Parkir Zona A', zone: 'Zona A', status: 'RECORDING', hasAlert: false, imageUrl: 'https://picsum.photos/seed/cam5/640/360', fps: 15, resolution: '1080p' },
  { id: 'CAM-06', name: 'Zona B - Overview', location: 'Parkir Zona B', zone: 'Zona B', status: 'ONLINE', hasAlert: false, imageUrl: 'https://picsum.photos/seed/cam6/640/360', fps: 15, resolution: '1080p' },
  { id: 'CAM-07', name: 'Zona C - Pelanggaran', location: 'Parkir Zona C', zone: 'Zona C', status: 'RECORDING', hasAlert: true, imageUrl: 'https://picsum.photos/seed/cam7/640/360', fps: 30, resolution: '1080p' },
  { id: 'CAM-08', name: 'Zona D - Overview', location: 'Parkir Zona D', zone: 'Zona D', status: 'OFFLINE', hasAlert: false, imageUrl: 'https://picsum.photos/seed/cam8/640/360', fps: 0, resolution: '720p' },
];

type GridLayout = '2x2' | '3x3' | '4x2' | 'single';

const STATUS_CONFIG = {
  ONLINE: { label: 'ONLINE', dot: 'bg-green-500', text: 'text-green-400', border: '' },
  RECORDING: { label: 'REC', dot: 'bg-red-500 animate-pulse', text: 'text-red-400', border: 'border-red-500/30' },
  OFFLINE: { label: 'OFFLINE', dot: 'bg-slate-600', text: 'text-slate-500', border: 'border-slate-700/50' },
};

export default function CamerasPage() {
  const [layout, setLayout] = useState<GridLayout>('2x2');
  const [selectedCam, setSelectedCam] = useState<CameraFeed | null>(null);
  const [muted, setMuted] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const gridClass: Record<GridLayout, string> = {
    '2x2': 'grid-cols-2',
    '3x3': 'grid-cols-3',
    '4x2': 'grid-cols-4',
    'single': 'grid-cols-1 max-w-4xl mx-auto',
  };

  const onlineCount = cameras.filter(c => c.status !== 'OFFLINE').length;
  const alertCount = cameras.filter(c => c.hasAlert).length;
  const recCount = cameras.filter(c => c.status === 'RECORDING').length;

  const displayCams = layout === 'single' && selectedCam ? [selectedCam] : cameras;

  return (
    <DashboardLayout title="Camera Monitoring" subtitle="Pantau CCTV seluruh area parkir secara real-time">
      {/* Stats bar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs font-medium text-green-400">{onlineCount} Online</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-medium text-red-400">{recCount} Recording</span>
        </div>
        {alertCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-medium text-amber-400">{alertCount} Alert Aktif</span>
          </div>
        )}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-500/10 border border-slate-700/30">
          <WifiOff className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs font-medium text-slate-500">{cameras.filter(c => c.status === 'OFFLINE').length} Offline</span>
        </div>

        {/* Controls */}
        <div className="ml-auto flex items-center gap-2">
          {/* Mute toggle */}
          <button
            onClick={() => setMuted(!muted)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] border border-white/[0.08] transition-all"
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Refresh */}
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] border border-white/[0.08] transition-all"
            title="Refresh feeds"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Layout selector */}
          <div className="flex gap-1 p-1 bg-white/[0.04] border border-white/[0.08] rounded-lg">
            {([['2x2', '2×2'], ['3x3', '3×3'], ['4x2', '4×2'], ['single', '1×1']] as [GridLayout, string][]).map(([val, label]) => (
              <button
                key={val}
                onClick={() => { setLayout(val); if (val === 'single' && !selectedCam) setSelectedCam(cameras[0]); }}
                className={cn(
                  'px-2.5 py-1 rounded text-xs font-medium transition-all',
                  layout === val ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Single view: camera list on the side */}
      <div className={cn('flex gap-4', layout === 'single' ? 'flex-row' : 'flex-col')}>
        {/* Camera Grid */}
        <div className={cn('grid gap-3 flex-1', gridClass[layout])}>
          {displayCams.map((cam) => (
            <CameraCard
              key={`${cam.id}-${refreshKey}`}
              cam={cam}
              isSelected={selectedCam?.id === cam.id}
              onClick={() => {
                setSelectedCam(cam);
                if (layout !== 'single') setLayout('single');
              }}
            />
          ))}
        </div>

        {/* Single mode: sidebar camera list */}
        {layout === 'single' && (
          <div className="w-56 flex-shrink-0 flex flex-col gap-2 max-h-[70vh] overflow-y-auto pr-1">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-1 mb-1">Semua Kamera</p>
            {cameras.map((cam) => (
              <button
                key={cam.id}
                onClick={() => setSelectedCam(cam)}
                className={cn(
                  'flex items-start gap-2 p-2.5 rounded-lg border text-left transition-all',
                  selectedCam?.id === cam.id
                    ? 'bg-blue-500/10 border-blue-500/30'
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
                )}
              >
                <div className={cn('w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0', STATUS_CONFIG[cam.status].dot)} />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-200 truncate">{cam.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{cam.location}</p>
                </div>
                {cam.hasAlert && <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function CameraCard({ cam, isSelected, onClick }: { cam: CameraFeed; isSelected: boolean; onClick: () => void }) {
  const cfg = STATUS_CONFIG[cam.status];

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative rounded-xl overflow-hidden border cursor-pointer group transition-all duration-200',
        cam.status === 'OFFLINE' ? 'border-slate-800' : 'border-white/[0.08]',
        isSelected && 'border-blue-500/60 ring-1 ring-blue-500/30',
        cam.hasAlert && !isSelected && 'border-amber-500/40',
        'hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10'
      )}
    >
      {/* Feed image */}
      {cam.status === 'OFFLINE' ? (
        <div className="aspect-video bg-[#0a0e1a] flex flex-col items-center justify-center gap-2">
          <WifiOff className="w-8 h-8 text-slate-700" />
          <p className="text-xs text-slate-600 font-medium">Kamera Offline</p>
        </div>
      ) : (
        <div className="aspect-video relative overflow-hidden bg-[#050915]">
          {/* Simulated live feed — rotates seed each minute for "live" feel */}
          <img
            src={`${cam.imageUrl}?t=${Math.floor(Date.now() / 30000)}`}
            alt={cam.name}
            className="w-full h-full object-cover"
            style={{ filter: cam.status === 'OFFLINE' ? 'grayscale(1) brightness(0.3)' : 'none' }}
          />

          {/* Scanline overlay for CCTV effect */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.06]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 4px)',
            }}
          />

          {/* Top gradient */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/70 to-transparent" />
          {/* Bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/90 to-transparent" />

          {/* Alert flash border */}
          {cam.hasAlert && (
            <div className="absolute inset-0 border-2 border-amber-500/60 rounded-xl animate-pulse pointer-events-none" />
          )}

          {/* Top-left: camera ID + status */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-white/80 bg-black/50 px-1.5 py-0.5 rounded">
              {cam.id}
            </span>
            <div className="flex items-center gap-1 bg-black/50 px-1.5 py-0.5 rounded">
              <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
              <span className={cn('text-[9px] font-bold tracking-wider', cfg.text)}>{cfg.label}</span>
            </div>
          </div>

          {/* Top-right: timestamp */}
          <div className="absolute top-2 right-2">
            <LiveTimestamp />
          </div>

          {/* Alert badge */}
          {cam.hasAlert && (
            <div className="absolute top-8 right-2 flex items-center gap-1 bg-amber-500/90 px-1.5 py-0.5 rounded text-[9px] font-bold text-black">
              <AlertTriangle className="w-2.5 h-2.5" />
              ALERT
            </div>
          )}

          {/* Bottom info bar */}
          <div className="absolute bottom-0 inset-x-0 px-2.5 py-2">
            <p className="text-xs font-semibold text-white truncate">{cam.name}</p>
            <div className="flex items-center justify-between mt-0.5">
              <p className="text-[10px] text-white/50">{cam.location}</p>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-white/40 font-mono">{cam.resolution}</span>
                {cam.fps > 0 && (
                  <span className="text-[9px] text-white/40 font-mono">{cam.fps}fps</span>
                )}
              </div>
            </div>
          </div>

          {/* Hover expand icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center border border-white/20">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LiveTimestamp() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="font-mono text-[9px] text-white/70 bg-black/50 px-1.5 py-0.5 rounded">
      {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  );
}
