import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(dateString: string): string {
  return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: id });
}

export function formatTimeOnly(dateString: string): string {
  return format(new Date(dateString), 'HH:mm', { locale: id });
}

export function formatRelative(dateString: string): string {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: id });
}

export function formatDuration(startStr: string, endStr: string | null): string {
  if (!endStr) return 'Sedang berlangsung';
  const start = new Date(startStr).getTime();
  const end = new Date(endStr).getTime();
  const diffMinutes = Math.floor((end - start) / 60000);
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  if (hours > 0) return `${hours}j ${minutes}m`;
  return `${minutes}m`;
}
