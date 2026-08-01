export default function DateRangeFilter({ startDate, endDate, onStartDateChange, onEndDateChange }) {
  const hasFilter = Boolean(startDate || endDate);

  const handleStartChange = (val) => {
    onStartDateChange(val || null);
    if (val && endDate && val > endDate) onEndDateChange(val);
  };

  const handleEndChange = (val) => {
    onEndDateChange(val || null);
    if (val && startDate && val < startDate) onStartDateChange(val);
  };

  return (
    <div className="sticky top-16 z-[15] bg-bg-alt border-b border-[#F1F5F9] shadow-sm">
      <div className="flex items-center gap-2 px-5 py-3 max-w-2xl mx-auto">
        <div className="flex flex-col flex-1 min-w-0">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-wide leading-tight">Dari</label>
          <input
            type="date"
            value={startDate ?? ''}
            max={endDate ?? undefined}
            onChange={(e) => handleStartChange(e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg bg-white border border-border text-[#334155] text-xs sm:text-sm outline-none focus:border-primary"
          />
        </div>

        <span className="text-text-muted text-xs pt-4 shrink-0">–</span>

        <div className="flex flex-col flex-1 min-w-0">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-wide leading-tight">Sampai</label>
          <input
            type="date"
            value={endDate ?? ''}
            min={startDate ?? undefined}
            onChange={(e) => handleEndChange(e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg bg-white border border-border text-[#334155] text-xs sm:text-sm outline-none focus:border-primary"
          />
        </div>

        <button
          type="button"
          onClick={() => { onStartDateChange(null); onEndDateChange(null); }}
          disabled={!hasFilter}
          aria-label="Reset Filter"
          className="shrink-0 self-end mb-1.5 flex items-center justify-center w-8 h-8 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-danger-bright/10"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF383C" strokeWidth="2">
            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}