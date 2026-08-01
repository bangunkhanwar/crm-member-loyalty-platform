const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

function getYearOptions(rangeBack = 5) {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: rangeBack + 1 }, (_, i) => currentYear - i);
}

export default function MonthYearFilter({ month, year, onMonthChange, onYearChange }) {
  const years = getYearOptions();
  const hasFilter = Boolean(month || year);

  return (
    <div className="flex flex-wrap items-center gap-2 px-5 py-4 bg-bg-alt border-b border-[#F1F5F9] sticky top-16 z-[5]">
      <div className="relative">
        <select
          value={month ?? ''}
          onChange={(e) => onMonthChange(e.target.value ? Number(e.target.value) : null)}
          className="appearance-none pl-4 pr-8 py-2 rounded-full bg-white border border-border text-[#334155] text-sm font-normal outline-none focus:border-primary cursor-pointer"
        >
          <option value="">Semua Bulan</option>
          {MONTHS.map((m, i) => (
            <option key={m} value={i + 1}>{m}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-xs">▾</span>
      </div>

      <div className="relative">
        <select
          value={year ?? ''}
          onChange={(e) => onYearChange(e.target.value ? Number(e.target.value) : null)}
          className="appearance-none pl-4 pr-8 py-2 rounded-full bg-white border border-border text-[#334155] text-sm font-normal outline-none focus:border-primary cursor-pointer"
        >
          <option value="">Semua Tahun</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-xs">▾</span>
      </div>

      {hasFilter && (
        <button
          type="button"
          onClick={() => { onMonthChange(null); onYearChange(null); }}
          className="ml-auto text-xs font-bold text-danger-bright"
        >
          Reset Filter
        </button>
      )}
    </div>
  );
}