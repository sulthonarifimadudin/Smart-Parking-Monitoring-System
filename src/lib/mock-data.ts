import {
  SesiParkir,
  LogPelanggaran,
  UserAccount,
  DashboardStats,
  HourlyTrafficData,
  DailyViolationData,
  ZoneDistributionData,
  ViolationTypeData,
  RecentActivity,
  AnalyticsSummary,
  GateEntry,
  GateExit,
} from './types';

// -------------------------------------------------------
// Parking Sessions
// -------------------------------------------------------
export const mockSessions: SesiParkir[] = [
  { session_id: 'SES-001', plat_nomor: 'B 1234 ABC', waktu_masuk: '2026-06-15T07:12:00', waktu_keluar: null, status_sesi: 'ACTIVE', status_keputusan: null, lokasi_gate_masuk: 'Gate Utara', lokasi_gate_keluar: null, zona_parkir: 'Zona A' },
  { session_id: 'SES-002', plat_nomor: 'D 5678 XYZ', waktu_masuk: '2026-06-15T07:25:00', waktu_keluar: '2026-06-15T12:10:00', status_sesi: 'COMPLETED', status_keputusan: 'CLEAR', lokasi_gate_masuk: 'Gate Selatan', lokasi_gate_keluar: 'Gate Selatan', zona_parkir: 'Zona B' },
  { session_id: 'SES-003', plat_nomor: 'F 9012 DEF', waktu_masuk: '2026-06-15T07:45:00', waktu_keluar: null, status_sesi: 'VIOLATION', status_keputusan: null, lokasi_gate_masuk: 'Gate Utara', lokasi_gate_keluar: null, zona_parkir: 'Zona C' },
  { session_id: 'SES-004', plat_nomor: 'G 3456 GHI', waktu_masuk: '2026-06-15T08:00:00', waktu_keluar: '2026-06-15T11:30:00', status_sesi: 'COMPLETED', status_keputusan: 'VERIFIED_WITH_VIOLATION', lokasi_gate_masuk: 'Gate Barat', lokasi_gate_keluar: 'Gate Barat', zona_parkir: 'Zona A' },
  { session_id: 'SES-005', plat_nomor: 'H 7890 JKL', waktu_masuk: '2026-06-15T08:15:00', waktu_keluar: '2026-06-15T10:00:00', status_sesi: 'COMPLETED', status_keputusan: 'FACE_MISMATCH', lokasi_gate_masuk: 'Gate Utara', lokasi_gate_keluar: 'Gate Utara', zona_parkir: 'Zona D' },
  { session_id: 'SES-006', plat_nomor: 'B 2345 MNO', waktu_masuk: '2026-06-15T08:30:00', waktu_keluar: null, status_sesi: 'ACTIVE', status_keputusan: null, lokasi_gate_masuk: 'Gate Selatan', lokasi_gate_keluar: null, zona_parkir: 'Zona B' },
  { session_id: 'SES-007', plat_nomor: 'D 6789 PQR', waktu_masuk: '2026-06-15T08:45:00', waktu_keluar: '2026-06-15T14:00:00', status_sesi: 'COMPLETED', status_keputusan: 'PLATE_MISMATCH', lokasi_gate_masuk: 'Gate Timur', lokasi_gate_keluar: 'Gate Timur', zona_parkir: 'Zona C' },
  { session_id: 'SES-008', plat_nomor: 'F 1234 STU', waktu_masuk: '2026-06-15T09:00:00', waktu_keluar: null, status_sesi: 'ACTIVE', status_keputusan: null, lokasi_gate_masuk: 'Gate Utara', lokasi_gate_keluar: null, zona_parkir: 'Zona A' },
  { session_id: 'SES-009', plat_nomor: 'G 5678 VWX', waktu_masuk: '2026-06-15T09:15:00', waktu_keluar: '2026-06-15T13:45:00', status_sesi: 'COMPLETED', status_keputusan: 'NEED_VERIFICATION', lokasi_gate_masuk: 'Gate Barat', lokasi_gate_keluar: 'Gate Barat', zona_parkir: 'Zona B' },
  { session_id: 'SES-010', plat_nomor: 'H 9012 YZA', waktu_masuk: '2026-06-15T09:30:00', waktu_keluar: null, status_sesi: 'VIOLATION', status_keputusan: null, lokasi_gate_masuk: 'Gate Selatan', lokasi_gate_keluar: null, zona_parkir: 'Zona D' },
  { session_id: 'SES-011', plat_nomor: 'B 3456 BCD', waktu_masuk: '2026-06-15T09:45:00', waktu_keluar: null, status_sesi: 'ACTIVE', status_keputusan: null, lokasi_gate_masuk: 'Gate Utara', lokasi_gate_keluar: null, zona_parkir: 'Zona C' },
  { session_id: 'SES-012', plat_nomor: 'D 7890 EFG', waktu_masuk: '2026-06-15T10:00:00', waktu_keluar: '2026-06-15T15:30:00', status_sesi: 'COMPLETED', status_keputusan: 'CLEAR', lokasi_gate_masuk: 'Gate Timur', lokasi_gate_keluar: 'Gate Timur', zona_parkir: 'Zona A' },
  { session_id: 'SES-013', plat_nomor: 'F 2345 HIJ', waktu_masuk: '2026-06-15T10:15:00', waktu_keluar: null, status_sesi: 'ACTIVE', status_keputusan: null, lokasi_gate_masuk: 'Gate Barat', lokasi_gate_keluar: null, zona_parkir: 'Zona B' },
  { session_id: 'SES-014', plat_nomor: 'G 6789 KLM', waktu_masuk: '2026-06-15T10:30:00', waktu_keluar: '2026-06-15T12:00:00', status_sesi: 'COMPLETED', status_keputusan: 'CLEAR', lokasi_gate_masuk: 'Gate Selatan', lokasi_gate_keluar: 'Gate Selatan', zona_parkir: 'Zona D' },
  { session_id: 'SES-015', plat_nomor: 'H 1234 NOP', waktu_masuk: '2026-06-15T10:45:00', waktu_keluar: null, status_sesi: 'ACTIVE', status_keputusan: null, lokasi_gate_masuk: 'Gate Utara', lokasi_gate_keluar: null, zona_parkir: 'Zona C' },
  { session_id: 'SES-016', plat_nomor: 'B 5678 QRS', waktu_masuk: '2026-06-15T11:00:00', waktu_keluar: null, status_sesi: 'VIOLATION', status_keputusan: null, lokasi_gate_masuk: 'Gate Timur', lokasi_gate_keluar: null, zona_parkir: 'Zona A' },
  { session_id: 'SES-017', plat_nomor: 'D 9012 TUV', waktu_masuk: '2026-06-15T11:15:00', waktu_keluar: '2026-06-15T16:00:00', status_sesi: 'COMPLETED', status_keputusan: 'VERIFIED_WITH_VIOLATION', lokasi_gate_masuk: 'Gate Barat', lokasi_gate_keluar: 'Gate Barat', zona_parkir: 'Zona B' },
  { session_id: 'SES-018', plat_nomor: 'F 3456 WXY', waktu_masuk: '2026-06-15T11:30:00', waktu_keluar: null, status_sesi: 'ACTIVE', status_keputusan: null, lokasi_gate_masuk: 'Gate Selatan', lokasi_gate_keluar: null, zona_parkir: 'Zona D' },
  { session_id: 'SES-019', plat_nomor: 'G 7890 ZAB', waktu_masuk: '2026-06-15T11:45:00', waktu_keluar: null, status_sesi: 'ACTIVE', status_keputusan: null, lokasi_gate_masuk: 'Gate Utara', lokasi_gate_keluar: null, zona_parkir: 'Zona C' },
  { session_id: 'SES-020', plat_nomor: 'H 2345 CDE', waktu_masuk: '2026-06-15T12:00:00', waktu_keluar: '2026-06-15T14:30:00', status_sesi: 'COMPLETED', status_keputusan: 'CLEAR', lokasi_gate_masuk: 'Gate Timur', lokasi_gate_keluar: 'Gate Timur', zona_parkir: 'Zona A' },
];

// -------------------------------------------------------
// Violation Logs
// -------------------------------------------------------
export const mockViolations: LogPelanggaran[] = [
  { log_id: 'VIO-001', session_id: 'SES-003', plat_nomor: 'F 9012 DEF', waktu_pelanggaran: '2026-06-15T09:15:00', lokasi_parkir: 'Zona C - Slot 12', jenis_pelanggaran: 'OUT_OF_AREA', foto_bukti_url: 'https://picsum.photos/seed/v1/800/500', status_notifikasi: 'SENT' },
  { log_id: 'VIO-002', session_id: 'SES-010', plat_nomor: 'H 9012 YZA', waktu_pelanggaran: '2026-06-15T10:30:00', lokasi_parkir: 'Zona D - Slot 7', jenis_pelanggaran: 'MISALIGNED_PARKING', foto_bukti_url: 'https://picsum.photos/seed/v2/800/500', status_notifikasi: 'SENT' },
  { log_id: 'VIO-003', session_id: 'SES-016', plat_nomor: 'B 5678 QRS', waktu_pelanggaran: '2026-06-15T11:45:00', lokasi_parkir: 'Zona A - Slot 3', jenis_pelanggaran: 'OUT_OF_AREA', foto_bukti_url: 'https://picsum.photos/seed/v3/800/500', status_notifikasi: 'PENDING' },
  { log_id: 'VIO-004', session_id: 'SES-004', plat_nomor: 'G 3456 GHI', waktu_pelanggaran: '2026-06-15T08:45:00', lokasi_parkir: 'Zona A - Slot 18', jenis_pelanggaran: 'MISALIGNED_PARKING', foto_bukti_url: 'https://picsum.photos/seed/v4/800/500', status_notifikasi: 'SENT' },
  { log_id: 'VIO-005', session_id: 'SES-017', plat_nomor: 'D 9012 TUV', waktu_pelanggaran: '2026-06-15T12:00:00', lokasi_parkir: 'Zona B - Slot 9', jenis_pelanggaran: 'OUT_OF_AREA', foto_bukti_url: 'https://picsum.photos/seed/v5/800/500', status_notifikasi: 'FAILED' },
  { log_id: 'VIO-006', session_id: 'SES-003', plat_nomor: 'F 9012 DEF', waktu_pelanggaran: '2026-06-15T10:00:00', lokasi_parkir: 'Zona C - Slot 5', jenis_pelanggaran: 'MISALIGNED_PARKING', foto_bukti_url: 'https://picsum.photos/seed/v6/800/500', status_notifikasi: 'SENT' },
  { log_id: 'VIO-007', session_id: 'SES-010', plat_nomor: 'H 9012 YZA', waktu_pelanggaran: '2026-06-15T11:15:00', lokasi_parkir: 'Zona D - Slot 2', jenis_pelanggaran: 'OUT_OF_AREA', foto_bukti_url: 'https://picsum.photos/seed/v7/800/500', status_notifikasi: 'SENT' },
  { log_id: 'VIO-008', session_id: 'SES-016', plat_nomor: 'B 5678 QRS', waktu_pelanggaran: '2026-06-15T12:30:00', lokasi_parkir: 'Zona A - Slot 15', jenis_pelanggaran: 'MISALIGNED_PARKING', foto_bukti_url: 'https://picsum.photos/seed/v8/800/500', status_notifikasi: 'PENDING' },
];

// -------------------------------------------------------
// Users / Security Officers
// -------------------------------------------------------
export const mockUsers: UserAccount[] = [
  { user_id: 'USR-001', username: 'admin', full_name: 'Administrator Sistem', role: 'ADMIN', status: 'ACTIVE', last_login: '2026-06-15T07:00:00', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', email: 'admin@universitas.ac.id' },
  { user_id: 'USR-002', username: 'budi.satpam', full_name: 'Budi Santoso', role: 'SECURITY_OFFICER', status: 'ACTIVE', last_login: '2026-06-15T06:55:00', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=budi', email: 'budi.santoso@universitas.ac.id' },
  { user_id: 'USR-003', username: 'siti.petugas', full_name: 'Siti Rahayu', role: 'SECURITY_OFFICER', status: 'ACTIVE', last_login: '2026-06-14T18:30:00', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=siti', email: 'siti.rahayu@universitas.ac.id' },
  { user_id: 'USR-004', username: 'wahyu.security', full_name: 'Wahyu Pratama', role: 'SECURITY_OFFICER', status: 'INACTIVE', last_login: '2026-06-10T09:00:00', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wahyu', email: 'wahyu.pratama@universitas.ac.id' },
  { user_id: 'USR-005', username: 'dewi.admin', full_name: 'Dewi Kusuma', role: 'ADMIN', status: 'ACTIVE', last_login: '2026-06-15T08:20:00', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dewi', email: 'dewi.kusuma@universitas.ac.id' },
];

// -------------------------------------------------------
// Dashboard KPI Stats
// -------------------------------------------------------
export const mockDashboardStats: DashboardStats = {
  active_vehicles: 10,
  todays_violations: 8,
  vehicles_entered_today: 20,
  vehicles_exited_today: 10,
  face_mismatch_alerts: 1,
  plate_mismatch_alerts: 1,
};

// -------------------------------------------------------
// Hourly Traffic Data
// -------------------------------------------------------
export const mockHourlyTraffic: HourlyTrafficData[] = [
  { hour: '06:00', masuk: 2, keluar: 0 },
  { hour: '07:00', masuk: 8, keluar: 1 },
  { hour: '08:00', masuk: 15, keluar: 3 },
  { hour: '09:00', masuk: 12, keluar: 5 },
  { hour: '10:00', masuk: 9, keluar: 8 },
  { hour: '11:00', masuk: 6, keluar: 11 },
  { hour: '12:00', masuk: 4, keluar: 14 },
  { hour: '13:00', masuk: 7, keluar: 9 },
  { hour: '14:00', masuk: 5, keluar: 7 },
  { hour: '15:00', masuk: 3, keluar: 12 },
  { hour: '16:00', masuk: 1, keluar: 18 },
  { hour: '17:00', masuk: 0, keluar: 10 },
];

// -------------------------------------------------------
// Daily Violation Data
// -------------------------------------------------------
export const mockDailyViolations: DailyViolationData[] = [
  { date: 'Sen', count: 5 },
  { date: 'Sel', count: 3 },
  { date: 'Rab', count: 7 },
  { date: 'Kam', count: 4 },
  { date: 'Jum', count: 9 },
  { date: 'Sab', count: 2 },
  { date: 'Min', count: 1 },
];

// -------------------------------------------------------
// Zone Distribution Data
// -------------------------------------------------------
export const mockZoneDistribution: ZoneDistributionData[] = [
  { zone: 'Zona A', count: 12, capacity: 30 },
  { zone: 'Zona B', count: 18, capacity: 40 },
  { zone: 'Zona C', count: 8, capacity: 25 },
  { zone: 'Zona D', count: 5, capacity: 20 },
];

// -------------------------------------------------------
// Violation Type Data
// -------------------------------------------------------
export const mockViolationTypes: ViolationTypeData[] = [
  { type: 'Out of Area', count: 5, fill: '#ef4444' },
  { type: 'Misaligned Parking', count: 3, fill: '#f59e0b' },
];

// -------------------------------------------------------
// Recent Activities
// -------------------------------------------------------
export const mockRecentActivities: RecentActivity[] = [
  { id: 'ACT-001', type: 'VIOLATION', plat_nomor: 'B 5678 QRS', description: 'Pelanggaran parkir di luar area terdeteksi', timestamp: '2026-06-15T11:45:00', status: 'VIOLATION' },
  { id: 'ACT-002', type: 'ENTRY', plat_nomor: 'G 7890 ZAB', description: 'Kendaraan masuk melalui Gate Utara', timestamp: '2026-06-15T11:45:00', status: 'ACTIVE' },
  { id: 'ACT-003', type: 'EXIT', plat_nomor: 'D 7890 EFG', description: 'Kendaraan keluar — Status: CLEAR', timestamp: '2026-06-15T11:30:00', status: 'CLEAR' },
  { id: 'ACT-004', type: 'ALERT', plat_nomor: 'H 7890 JKL', description: 'Face mismatch terdeteksi saat keluar', timestamp: '2026-06-15T10:00:00', status: 'FACE_MISMATCH' },
  { id: 'ACT-005', type: 'VIOLATION', plat_nomor: 'H 9012 YZA', description: 'Parkir tidak sesuai marka terdeteksi', timestamp: '2026-06-15T10:30:00', status: 'VIOLATION' },
  { id: 'ACT-006', type: 'ENTRY', plat_nomor: 'H 1234 NOP', description: 'Kendaraan masuk melalui Gate Utara', timestamp: '2026-06-15T10:45:00', status: 'ACTIVE' },
  { id: 'ACT-007', type: 'EXIT', plat_nomor: 'G 3456 GHI', description: 'Kendaraan keluar — Status: VERIFIED_WITH_VIOLATION', timestamp: '2026-06-15T11:30:00', status: 'VERIFIED_WITH_VIOLATION' },
];

// -------------------------------------------------------
// Analytics Summary
// -------------------------------------------------------
export const mockAnalyticsSummary: AnalyticsSummary = {
  total_sessions: 20,
  total_violations: 8,
  violation_rate: 40,
  avg_parking_duration_minutes: 187,
};

// -------------------------------------------------------
// Gate Entries / Exits (derived views)
// -------------------------------------------------------
export const mockGateEntries: GateEntry[] = mockSessions.map((s) => ({
  session_id: s.session_id,
  plat_nomor: s.plat_nomor,
  waktu_masuk: s.waktu_masuk,
  lokasi_gate_masuk: s.lokasi_gate_masuk,
}));

export const mockGateExits: GateExit[] = mockSessions
  .filter((s) => s.waktu_keluar !== null && s.status_keputusan !== null)
  .map((s) => ({
    session_id: s.session_id,
    plat_nomor: s.plat_nomor,
    waktu_keluar: s.waktu_keluar!,
    lokasi_gate_keluar: s.lokasi_gate_keluar!,
    status_keputusan: s.status_keputusan!,
  }));
