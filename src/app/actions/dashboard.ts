'use server';

import { prisma } from '@/lib/prisma';
import { 
  DashboardStats, 
  RecentActivity, 
  HourlyTrafficData,
  DailyViolationData,
  ZoneDistributionData
} from '@/lib/types';
import { startOfDay, endOfDay, subDays, format, startOfWeek, startOfMonth } from 'date-fns';
import { id } from 'date-fns/locale';

export type TimeFilter = 'today' | 'week' | 'month';

export async function getDashboardData(timeFilter: TimeFilter = 'today') {
  const today = new Date();
  let start = startOfDay(today);
  const end = endOfDay(today);

  if (timeFilter === 'week') {
    start = startOfWeek(today, { weekStartsOn: 1 });
  } else if (timeFilter === 'month') {
    start = startOfMonth(today);
  }

  // 1. Fetch Stats
  const active_vehicles = await prisma.sesiParkir.count({ where: { status_sesi: 'ACTIVE' } });
  const todays_violations = await prisma.logPelanggaran.count({ where: { waktu_pelanggaran: { gte: start, lte: end } } });
  const vehicles_entered_today = await prisma.sesiParkir.count({ where: { waktu_masuk: { gte: start, lte: end } } });
  const vehicles_exited_today = await prisma.sesiParkir.count({ where: { waktu_keluar: { gte: start, lte: end } } });
  const face_mismatch_alerts = await prisma.sesiParkir.count({ where: { status_keputusan: 'FACE_MISMATCH', waktu_keluar: { gte: start, lte: end } } });
  const plate_mismatch_alerts = await prisma.sesiParkir.count({ where: { status_keputusan: 'PLATE_MISMATCH', waktu_keluar: { gte: start, lte: end } } });

  const stats: DashboardStats = {
    active_vehicles,
    todays_violations,
    vehicles_entered_today,
    vehicles_exited_today,
    face_mismatch_alerts,
    plate_mismatch_alerts,
  };

  // 2. Fetch Recent Activities
  const latestSessions = await prisma.sesiParkir.findMany({ orderBy: { waktu_masuk: 'desc' }, take: 10 });
  const latestViolations = await prisma.logPelanggaran.findMany({ orderBy: { waktu_pelanggaran: 'desc' }, take: 10 });

  const activities: RecentActivity[] = [];
  for (const s of latestSessions) {
    if (s.waktu_keluar && s.status_keputusan) {
      activities.push({
        id: `ACT-EXIT-${s.session_id}`,
        type: 'EXIT',
        plat_nomor: s.plat_nomor,
        description: `Kendaraan keluar \u2014 Status: ${s.status_keputusan}`,
        timestamp: s.waktu_keluar.toISOString(),
        status: s.status_keputusan,
      });
    }
    if (s.status_keputusan === 'FACE_MISMATCH' || s.status_keputusan === 'PLATE_MISMATCH') {
      activities.push({
        id: `ACT-ALERT-${s.session_id}`,
        type: 'ALERT',
        plat_nomor: s.plat_nomor,
        description: `${s.status_keputusan.replace('_', ' ')} terdeteksi saat keluar`,
        timestamp: s.waktu_keluar?.toISOString() || s.waktu_masuk.toISOString(),
        status: s.status_keputusan,
      });
    }
    activities.push({
      id: `ACT-ENTRY-${s.session_id}`,
      type: 'ENTRY',
      plat_nomor: s.plat_nomor,
      description: `Kendaraan masuk melalui ${s.lokasi_gate_masuk}`,
      timestamp: s.waktu_masuk.toISOString(),
      status: s.status_sesi,
    });
  }
  for (const v of latestViolations) {
    activities.push({
      id: `ACT-VIO-${v.log_id}`,
      type: 'VIOLATION',
      plat_nomor: v.plat_nomor,
      description: v.jenis_pelanggaran === 'OUT_OF_AREA' ? 'Pelanggaran parkir di luar area terdeteksi' : 'Parkir tidak sesuai marka terdeteksi',
      timestamp: v.waktu_pelanggaran.toISOString(),
      status: 'VIOLATION',
    });
  }

  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const recentActivities = Array.from(new Map(activities.map(item => [item.id, item])).values()).slice(0, 7);

  // 3. Fallback mock data for charts (since aggregating by hour/day in Prisma SQL is complex and we are seeding mock data anyway)
  // We will pull all sessions for today to build hourly traffic
  const todaysSessions = await prisma.sesiParkir.findMany({
    where: { waktu_masuk: { gte: start, lte: end } },
    select: { waktu_masuk: true, waktu_keluar: true }
  });

  const trafficMap = new Map<string, { masuk: number, keluar: number }>();
  // Initialize hours 06:00 to 18:00
  for (let i = 6; i <= 18; i++) {
    trafficMap.set(`${i.toString().padStart(2, '0')}:00`, { masuk: 0, keluar: 0 });
  }

  todaysSessions.forEach(s => {
    const inHour = `${s.waktu_masuk.getHours().toString().padStart(2, '0')}:00`;
    if (trafficMap.has(inHour)) {
      trafficMap.get(inHour)!.masuk++;
    }
    if (s.waktu_keluar) {
      const outHour = `${s.waktu_keluar.getHours().toString().padStart(2, '0')}:00`;
      if (trafficMap.has(outHour)) {
        trafficMap.get(outHour)!.keluar++;
      }
    }
  });

  const hourlyTraffic: HourlyTrafficData[] = Array.from(trafficMap.entries()).map(([hour, data]) => ({
    hour,
    masuk: data.masuk,
    keluar: data.keluar
  }));

  // 4. Daily Violations (Last 7 days)
  const last7DaysStart = startOfDay(subDays(today, 6));
  const recentViolations = await prisma.logPelanggaran.findMany({
    where: { waktu_pelanggaran: { gte: last7DaysStart, lte: endOfDay(today) } },
    select: { waktu_pelanggaran: true }
  });

  const violationsMap = new Map<string, number>();
  for (let i = 6; i >= 0; i--) {
    const d = subDays(today, i);
    violationsMap.set(format(d, 'eee', { locale: id }), 0); // e.g. "Sen", "Sel"
  }

  recentViolations.forEach(v => {
    const dayStr = format(v.waktu_pelanggaran, 'eee', { locale: id });
    if (violationsMap.has(dayStr)) {
      violationsMap.set(dayStr, violationsMap.get(dayStr)! + 1);
    }
  });

  const dailyViolations: DailyViolationData[] = Array.from(violationsMap.entries()).map(([date, count]) => ({
    date,
    count
  }));

  // 5. Zone Distribution
  const activeSessions = await prisma.sesiParkir.findMany({
    where: { status_sesi: 'ACTIVE' },
    select: { zona_parkir: true }
  });

  const zoneMap = new Map<string, number>();
  activeSessions.forEach(s => {
    zoneMap.set(s.zona_parkir, (zoneMap.get(s.zona_parkir) || 0) + 1);
  });

  // Capacities are mocked, but counts are real from active sessions
  const mockCapacities: Record<string, number> = {
    'Zona A': 30, 'Zona B': 40, 'Zona C': 25, 'Zona D': 20
  };

  const zoneDistribution: ZoneDistributionData[] = ['Zona A', 'Zona B', 'Zona C', 'Zona D'].map(zone => ({
    zone,
    count: zoneMap.get(zone) || 0,
    capacity: mockCapacities[zone] || 50
  }));

  return {
    stats,
    recentActivities,
    hourlyTraffic,
    dailyViolations,
    zoneDistribution
  };
}
