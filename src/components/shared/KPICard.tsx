import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: { value: number; label: string };
  alert?: boolean;
  className?: string;
}

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-400',
  iconBg = 'bg-blue-500/10',
  trend,
  alert = false,
  className,
}: KPICardProps) {
  return (
    <div
      className={cn(
        'glass-card glass-card-hover p-5 relative overflow-hidden',
        alert && 'border-red-500/20 bg-red-950/10',
        className
      )}
    >
      {/* Background glow */}
      <div
        className={cn(
          'absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10 blur-2xl',
          alert ? 'bg-red-500' : 'bg-blue-500'
        )}
      />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-400 font-medium leading-snug mb-1.5 min-h-[32px] line-clamp-2 pr-2">{title}</p>
          <p
            className={cn(
              'text-3xl font-bold tracking-tight',
              alert ? 'text-red-400' : 'text-white'
            )}
          >
            {value}
          </p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.value >= 0 ? (
                <TrendingUp className="w-3 h-3 text-green-400" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-400" />
              )}
              <span
                className={cn(
                  'text-[11px] font-medium',
                  trend.value >= 0 ? 'text-green-400' : 'text-red-400'
                )}
              >
                {trend.value > 0 ? '+' : ''}
                {trend.value}% {trend.label}
              </span>
            </div>
          )}
        </div>

        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
            iconBg
          )}
        >
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
      </div>
    </div>
  );
}
