/**
 * FDRFlow - AICTE Security Deposit & FDR Management Portal
 * Utility Formatters & Calculation Helpers
 */

/**
 * Format a number to Indian Rupee standard format (e.g., ₹15,00,000)
 */
export function formatCurrency(amount, compact = false) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const num = Number(amount);

  if (compact) {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} Lakh`;
    }
    return `₹${num.toLocaleString('en-IN')}`;
  }

  return `₹${num.toLocaleString('en-IN')}`;
}

/**
 * Format an ISO date string (YYYY-MM-DD) into readable Indian standard format (e.g., 15 Oct 2028)
 */
export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Calculate remaining days until maturity relative to a reference date.
 * Default reference date is current time or a simulated system date.
 */
export function calculateMaturityStatus(maturityDateString, referenceDate = new Date()) {
  if (!maturityDateString) {
    return {
      daysRemaining: 0,
      isMatured: false,
      isApproaching: false,
      label: 'Unknown',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    };
  }

  const target = new Date(maturityDateString);
  const ref = new Date(referenceDate);

  // Normalize to midnight UTC for fair day calculation
  const targetUtc = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
  const refUtc = Date.UTC(ref.getFullYear(), ref.getMonth(), ref.getDate());

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysRemaining = Math.round((targetUtc - refUtc) / msPerDay);

  if (daysRemaining < 0) {
    const overdueDays = Math.abs(daysRemaining);
    return {
      daysRemaining,
      isMatured: true,
      isApproaching: false,
      status: 'Matured / Overdue',
      label: `Matured (${overdueDays}d overdue)`,
      shortLabel: 'Overdue',
      badgeClass: 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-300',
      textClass: 'text-red-700 font-semibold',
    };
  }

  if (daysRemaining === 0) {
    return {
      daysRemaining: 0,
      isMatured: true,
      isApproaching: true,
      status: 'Matures Today',
      label: 'Matures Today',
      shortLabel: 'Today',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-400 animate-pulse',
      textClass: 'text-amber-800 font-bold',
    };
  }

  if (daysRemaining <= 30) {
    return {
      daysRemaining,
      isMatured: false,
      isApproaching: true,
      status: 'Approaching Maturity',
      label: `${daysRemaining} days left (Expiring Soon)`,
      shortLabel: `${daysRemaining}d left`,
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-300 ring-1 ring-amber-300',
      textClass: 'text-amber-700 font-medium',
    };
  }

  if (daysRemaining <= 90) {
    return {
      daysRemaining,
      isMatured: false,
      isApproaching: false,
      status: 'Upcoming (90 Days)',
      label: `${daysRemaining} days left (~${Math.ceil(daysRemaining / 30)} mos)`,
      shortLabel: `${daysRemaining}d left`,
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      textClass: 'text-blue-700',
    };
  }

  const years = (daysRemaining / 365).toFixed(1);
  return {
    daysRemaining,
    isMatured: false,
    isApproaching: false,
    status: 'Active / Long Term',
    label: `${daysRemaining} days (${years} yrs)`,
    shortLabel: `${years} yrs`,
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    textClass: 'text-emerald-700',
  };
}

/**
 * Download an array of objects as a CSV file with Excel-compatible UTF-8 BOM
 */
export function downloadCSV(filename, columns, data) {
  const headerRow = columns.map(col => `"${col.label.replace(/"/g, '""')}"`).join(',');
  
  const dataRows = data.map(item => {
    return columns.map(col => {
      let val = item[col.key];
      if (typeof col.format === 'function') {
        val = col.format(val, item);
      }
      if (val === null || val === undefined) val = '';
      const stringVal = String(val).replace(/"/g, '""');
      return `"${stringVal}"`;
    }).join(',');
  });

  const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
