import { cn } from '@/lib/utils';
import { SessionStatus, DecisionStatus, ViolationType, NotificationStatus, UserStatus, UserRole } from '@/lib/types';

type BadgeVariant =
  | SessionStatus
  | DecisionStatus
  | ViolationType
  | NotificationStatus
  | UserStatus
  | UserRole;

interface StatusBadgeProps {
  status: BadgeVariant;
  size?: 'sm' | 'md';
}

const CONFIG: Record<string, { label: string; classes: string; dot?: string }> = {
  // Session Status
  ACTIVE: { label: 'ACTIVE', classes: 'bg-green-500/10 text-green-400 border-green-500/20', dot: 'bg-green-400' },
  VIOLATION: { label: 'VIOLATION', classes: 'bg-red-500/10 text-red-400 border-red-500/20', dot: 'bg-red-400' },
  COMPLETED: { label: 'COMPLETED', classes: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },

  // Decision Status
  CLEAR: { label: 'CLEAR', classes: 'bg-green-500/10 text-green-400 border-green-500/20' },
  VERIFIED_WITH_VIOLATION: { label: 'VERIFIED W/ VIOLATION', classes: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  FACE_MISMATCH: { label: 'FACE MISMATCH', classes: 'bg-red-500/10 text-red-400 border-red-500/20' },
  PLATE_MISMATCH: { label: 'PLATE MISMATCH', classes: 'bg-rose-900/20 text-rose-400 border-rose-700/30' },
  NEED_VERIFICATION: { label: 'NEED VERIFICATION', classes: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },

  // Violation Type
  OUT_OF_AREA: { label: 'Out of Area', classes: 'bg-red-500/10 text-red-400 border-red-500/20' },
  MISALIGNED_PARKING: { label: 'Misaligned Parking', classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },

  // Notification Status
  SENT: { label: 'SENT', classes: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  PENDING: { label: 'PENDING', classes: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  FAILED: { label: 'FAILED', classes: 'bg-red-500/10 text-red-400 border-red-500/20' },

  // User Status
  // ACTIVE already defined above
  INACTIVE: { label: 'INACTIVE', classes: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },

  // User Role
  ADMIN: { label: 'ADMIN', classes: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  SECURITY_OFFICER: { label: 'SECURITY', classes: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = CONFIG[status] || { label: status, classes: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium border rounded-full whitespace-nowrap',
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
        config.classes
      )}
    >
      {config.dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', config.dot)} />
      )}
      {config.label}
    </span>
  );
}
