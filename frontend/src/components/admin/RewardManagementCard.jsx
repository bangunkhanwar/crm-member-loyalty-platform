const STATUS_STYLE = {
  HEALTHY: { border: '#2DA299', badgeBg: 'rgba(255,255,255,0.9)', badgeColor: '#2DA299', badgeLabel: 'Healthy Stock', boxBg: '#F0F3FF', boxColor: '#111C2D' },
  LOW_STOCK: { border: '#F59E0B', badgeBg: '#F59E0B', badgeColor: 'white', badgeLabel: 'Low Stock', boxBg: 'rgba(245,158,11,0.10)', boxColor: '#F59E0B' },
  OUT_OF_STOCK: { border: '#EF4444', badgeBg: '#EF4444', badgeColor: 'white', badgeLabel: 'Out of Stock', boxBg: 'rgba(255,218,214,0.20)', boxColor: '#EF4444' },
};

export default function RewardInventoryCard({ reward, isHotItem, onEdit, onToggle }) {
  const status = STATUS_STYLE[reward.stockStatus] || STATUS_STYLE.HEALTHY;
  const recommendation =
    reward.stockStatus === 'OUT_OF_STOCK' ? 'Reorder ASAP'
    : reward.stockStatus === 'LOW_STOCK' ? 'Restock Today'
    : 'Stok Aman';

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden flex flex-col"
      style={{ borderLeft: `1px solid ${status.border}`, borderTop: `4px solid ${status.border}`, borderRight: `1px solid ${status.border}`, borderBottom: `1px solid ${status.border}` }}
    >
      <div className="h-44 relative bg-[#F0F3FF]">
        {reward.image ? (
          <img src={reward.image} alt={reward.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#94A3B8] text-sm">Tanpa Gambar</div>
        )}
        <span
          className="absolute left-3 top-3 px-3 py-1 rounded-full text-xs font-semibold shadow-card"
          style={{ background: isHotItem ? 'rgba(255,255,255,0.9)' : status.badgeBg, color: isHotItem ? '#2DA299' : status.badgeColor }}
        >
          {isHotItem ? 'Hot Item' : status.badgeLabel}
        </span>
        {!reward.isActive && (
          <span className="absolute right-3 top-3 px-3 py-1 rounded-full text-xs font-semibold bg-admin-navy/80 text-white">
            Nonaktif
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex justify-between items-start gap-3">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-xs font-semibold tracking-wide text-admin-text">{reward.code}</span>
            <h3 className="font-semibold text-lg text-admin-navy leading-tight truncate">{reward.name}</h3>
          </div>
          <span className="font-bold text-base shrink-0" style={{ color: '#FF8D28' }}>
            {reward.pointRequired.toLocaleString('id-ID')} <span className="text-xs">PTS</span>
          </span>
        </div>

        <div className="rounded-lg p-3 flex gap-4" style={{ background: status.boxBg }}>
          <div className="flex-1 flex flex-col gap-0.5">
            <span className="text-[10px] font-bold uppercase text-admin-text/60">Stok Sisa</span>
            <span className="font-bold text-base" style={{ color: status.boxColor }}>{reward.stock} Pcs</span>
          </div>
          <div className="flex-1 flex flex-col gap-0.5 items-end">
            <span className="text-[10px] font-bold uppercase text-admin-text/60">Redeemed</span>
            <span className="font-bold text-base text-secondary">{reward.redeemedTotal.toLocaleString('id-ID')}x</span>
          </div>
        </div>

        <div className="flex justify-between text-xs text-admin-text">
          <span>Bulan Ini: <strong className="text-admin-navy">{reward.redeemedThisMonth}x</strong></span>
          <span>Runway: <strong className="text-admin-navy">{reward.runwayDays !== null ? `${reward.runwayDays} Hari` : '∞'}</strong></span>
        </div>

        <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase text-admin-text/60">Rekomendasi</span>
            <span className="font-semibold text-sm" style={{ color: status.boxColor }}>{recommendation}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onToggle(reward)} className="flex-1 sm:flex-none px-3 h-8 rounded-lg border border-border text-xs font-medium text-admin-text">
              {reward.isActive ? 'Nonaktifkan' : 'Aktifkan'}
            </button>
            <button onClick={() => onEdit(reward)} className="flex-1 sm:flex-none px-3 h-8 rounded-lg bg-secondary text-white text-xs font-semibold">
              Edit &amp; Restock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}