const SHADOW_COLOR = { gold: '#FFCC00', teal: '#00C8B3', red: '#FF2D55' };

export default function KpiCard({ icon, title, value, growthLabel, growthColor, footerLabel, footerValue, footerValueColor, accent }) {
  return (
    <div
      className="flex-1 bg-white rounded-2xl p-6 flex flex-col justify-between min-h-[200px] border border-[rgba(0,0,0,0.2)]"
      style={{ boxShadow: `0px -3px 4px ${SHADOW_COLOR[accent]}` }}
    >
      <div className="flex items-center gap-2.5">
        <i className={`fas ${icon} text-2xl text-[#6B7280]`} />
        <span className="flex-1 text-sm font-bold tracking-wide uppercase text-admin-text">{title}</span>
        <i className="fas fa-info-circle text-[19px] text-[#6B7280]" />
      </div>
      <div className="flex items-center gap-2 my-2">
        <span className="font-hanken text-[32px] leading-[48px] text-admin-navy">{value}</span>
        {growthLabel && (
          <span
            className="rounded-full px-2 py-0.5 flex items-center gap-1 font-bold text-base"
            style={{ background: 'rgba(16,185,129,0.1)', color: growthColor || '#29CC6A' }}
          >
            {growthLabel}
          </span>
        )}
      </div>
      <div className="border-t border-border pt-4 flex justify-between text-xs text-admin-text">
        <span>{footerLabel}</span>
        <span className="font-bold text-base" style={{ color: footerValueColor || '#111C2D' }}>{footerValue}</span>
      </div>
    </div>
  );
}