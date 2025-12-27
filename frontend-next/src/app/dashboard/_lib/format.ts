export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const currencySymbols: Record<string, string> = {
    USD: '$',
    PKR: 'Rs.',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    CNY: '¥',
    AUD: 'A$',
    CAD: 'C$',
    CHF: 'CHF',
    AED: 'د.إ',
    SAR: '﷼',
  };

  const code = (currency ?? 'USD').toUpperCase();
  const symbol = currencySymbols[code] ?? code;

  if (['PKR', 'INR'].includes(code)) return `${symbol} ${Number(amount || 0).toFixed(2)}`;
  return `${symbol}${Number(amount || 0).toFixed(2)}`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'urgent':
    case 'overdue':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'warning':
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'active':
    case 'paid':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

export function getRenewalStatus(renewalDate?: string | null): {
  status: 'active' | 'warning' | 'urgent' | 'overdue';
  text: string;
  days: number | null;
} {
  if (!renewalDate) return { status: 'active', text: 'Active', days: null };

  const date = new Date(renewalDate);
  const today = new Date();
  const daysUntil = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntil < 0) return { status: 'overdue', text: 'Overdue', days: 0 };
  if (daysUntil <= 3) return { status: 'urgent', text: `Due in ${daysUntil} days`, days: daysUntil };
  if (daysUntil <= 7) return { status: 'warning', text: `Due in ${daysUntil} days`, days: daysUntil };
  return { status: 'active', text: `Renews in ${daysUntil} days`, days: daysUntil };
}
