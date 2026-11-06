import { format, isToday, isYesterday, parseISO } from 'date-fns';

/**
 * Format currency in Indian numbering system (e.g. ₹1,45,200 or ₹450)
 */
export function formatINR(amount: number, showDecimals: boolean = false): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 2,
  });

  const formatted = formatter.format(absAmount);
  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Format human-readable date grouped like Navi UPI (Today, Yesterday, or 04 Nov 2026)
 */
export function formatGroupDate(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'dd MMM yyyy');
  } catch {
    return dateStr;
  }
}

/**
 * Format time to 12-hour format (e.g. 04:30 PM)
 */
export function formatTime12h(timeStr: string): string {
  try {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return format(date, 'h:mm a');
  } catch {
    return timeStr;
  }
}

/**
 * Generate realistic Navi UPI transaction reference number
 */
export function generateReferenceId(): string {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000);
  return `UPI/${year}/${randomDigits}`;
}

/**
 * Generate short initials for merchant or contact
 */
export function getInitials(name: string): string {
  if (!name) return 'TX';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

