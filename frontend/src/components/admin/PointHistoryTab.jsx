export default function PointHistoryTab({ history, currentBalance, onAdjustClick }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-6">
        <div className="flex-1 bg-white rounded-3xl p-10 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-admin-text/40">Current Balance</span>
            <div className="flex items-baseline gap-4 mt-2">
              <span className="font-hanken text-6xl font-extrabold text-admin-navy tracking-tight">{currentBalance.toLocaleString('id-ID')}</span>
              <span className="text-2xl font-semibold text-secondary">Pts</span>
            </div>
          </div>
          <div className="border-t border-[#F1F5F9] pt-8 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <i className="fas fa-arrow-up text-emerald-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-admin-text">Earned this month</p>
                <p className="font-bold text-sm text-emerald-500">+250</p>
              </div>
            </div>
            <button onClick={onAdjustClick} className="px-6 h-11 rounded-xl bg-secondary text-white text-sm font-bold shadow-card">
              Adjustment Poin Manual
            </button>
          </div>
        </div>
        <div className="w-[400px] grid grid-cols-2 gap-4">
          {[{ label: 'EXPIRING SOON', value: '250 Poin', color: '#EF4444' }, { label: 'MEMBERSHIP TIER', value: 'Gold', color: '#F59E0B' }, { label: 'RECENT SPEND', value: 'Rp 1.250.000', color: '#0F172A' }, { label: 'TOTAL REWARDS', value: '12 Vouchers', color: '#2DA299' }].map((c) => (
            <div key={c.label} className="bg-white rounded-2xl p-6 flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-wide text-admin-text/40">{c.label}</span>
              <span className="font-bold text-2xl" style={{ color: c.color }}>{c.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border">
          <h3 className="font-bold text-lg text-admin-navy">Point Adjustment History</h3>
          <span className="bg-bg-alt px-3 py-1 rounded-full text-[11px] font-black uppercase text-admin-text">Manual Only</span>
        </div>
        <div className="flex flex-col gap-4 p-4">
          {history.map((h) => (
            <div key={h.id} className="flex items-center gap-8 p-6 bg-white shadow-card rounded-2xl">
              <div className="flex flex-col w-28">
                <span className="font-bold text-sm text-admin-navy">{h.date}</span>
                <span className="text-xs text-admin-text">Manual Entry</span>
              </div>
              <span
                className="px-3 py-1.5 rounded-2xl text-[11px] font-bold uppercase"
                style={{ background: h.type === 'add' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: h.type === 'add' ? '#10B981' : '#EF4444' }}
              >
                {h.type === 'add' ? '+ Penambahan' : '- Pengurangan'}
              </span>
              <div className="flex flex-col gap-0.5">
                <span className={`font-black text-lg ${h.type === 'add' ? 'text-emerald-500' : 'text-red-500'}`}>{h.amount}</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-base text-admin-navy">{h.desc}</p>
                <p className="text-sm text-admin-text">{h.by}</p>
              </div>
              <button className="w-8 h-1 flex items-center justify-center"><i className="fas fa-ellipsis-v text-admin-text" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}