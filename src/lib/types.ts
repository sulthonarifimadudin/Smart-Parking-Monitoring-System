// ============================================================
// SMART PARKING MONITORING SYSTEM — TYPE DEFINITIONS
// ============================================================

export type SessionStatus = 'ACTIVE' | 'COMPLETED' | 'VIOLATION';

export type DecisionStatus =
  | 'CLEAR'
  | 'VERIFIED_WITH_VIOLATION'
  | 'FACE_MISMATCH'
  | 'PLATE_MISMATCH'
  | 'NEED_VERIFICATION';

export type ViolationType = 'OUT_OF_AREA' | 'MISALIGNED_PARKING';

export type NotificationStatus = 'SENT' | 'PENDING' | 'FAILED';

export type UserRole = 'ADMIN' | 'SECURITY_OFFICER';

export type UserStatus = 'ACTIVE' | 'INACTIVE';

// -------------------------------------------------------
// sesi_parkir — Parking Sessions
// -------------------------------------------------------
export interface SesiParkir {
  session_id: string;
  plat_nomor: string;
  waktu_masuk: string; // ISO datetime string
  waktu_keluar: string | null;
  status_sesi: SessionStatus;
  status_keputusan: DecisionStatus | null;
  lokasi_gate_masuk: string;
  lokasi_gate_keluar: string | null;
  zona_parkir: string;
}

// -------------------------------------------------------
// log_pelanggaran — Violation Logs
// -------------------------------------------------------
export interface LogPelanggaran {
  log_id: string;
  session_id: string;
  plat_nomor: string;
  waktu_pelanggaran: string; // ISO datetime string
  lokasi_parkir: string;
  jenis_pelanggaran: ViolationType;
  foto_bukti_url: string;
  status_notifikasi: NotificationStatus;
}

// -------------------------------------------------------
// Gate Entry / Exit records (derived from sesi_parkir)
// -------------------------------------------------------
export interface GateEntry {
  session_id: string;
  plat_nomor: string;
  waktu_masuk: string;
  lokasi_gate_masuk: string;
}

export interface GateExit {
  session_id: string;
  plat_nomor: string;
  waktu_keluar: string;
  lokasi_gate_keluar: string;
  status_keputusan: DecisionStatus;
}

// -------------------------------------------------------
// User / Security Officer
// -------------------------------------------------------
export interface UserAccount {
  user_id: string;
  username: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  last_login: string | null;
  avatar_url: string | null;
  email: string;
}

// -------------------------------------------------------
// Dashboard KPI stats
// -------------------------------------------------------
export interface DashboardStats {
  active_vehicles: number;
  todays_violations: number;
  vehicles_entered_today: number;
  vehicles_exited_today: number;
  face_mismatch_alerts: number;
  plate_mismatch_alerts: number;
}

// -------------------------------------------------------
// Chart Data
// -------------------------------------------------------
export interface HourlyTrafficData {
  hour: string; // "08:00"
  masuk: number;
  keluar: number;
}

export interface DailyViolationData {
  date: string; // "Mon", "Tue" ...
  count: number;
}

export interface ZoneDistributionData {
  zone: string;
  count: number;
  capacity: number;
}

export interface ViolationTypeData {
  type: string;
  count: number;
  fill: string;
}

// -------------------------------------------------------
// Recent Activity feed
// -------------------------------------------------------
export type ActivityType = 'ENTRY' | 'EXIT' | 'VIOLATION' | 'ALERT';

export interface RecentActivity {
  id: string;
  type: ActivityType;
  plat_nomor: string;
  description: string;
  timestamp: string;
  status?: string;
}

// -------------------------------------------------------
// Analytics Summary
// -------------------------------------------------------
export interface AnalyticsSummary {
  total_sessions: number;
  total_violations: number;
  violation_rate: number; // percentage
  avg_parking_duration_minutes: number;
}
