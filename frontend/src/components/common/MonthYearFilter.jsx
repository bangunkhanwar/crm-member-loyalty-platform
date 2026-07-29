export default function MonthYearFilter({ month, year, onMonthClick, onYearClick }) {
  return (
    <div className="flex items-center gap-2 px-5 py-4 bg-bg-alt border-b border-[#F1F5F9] sticky top-16 z-[5]">
      <button onClick={onMonthClick} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border text-[#334155] font-normal">
        {month || 'Pilih Bulan'} <span className="text-text-muted text-xs">▾</span>
      </button>
      <button onClick={onYearClick} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border text-[#334155] font-normal">
        {year || 'Pilih Tahun'} <span className="text-text-muted text-xs">▾</span>
      </button>
    </div>
  );
}