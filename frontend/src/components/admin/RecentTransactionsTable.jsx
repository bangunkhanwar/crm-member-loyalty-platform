const STATUS_STYLE = {
  success: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', color: '#10B981', label: 'Completed' },
  warning: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', color: '#F59E0B', label: 'Pending' },
  danger: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', color: '#EF4444', label: 'Failed' },
};

export default function RecentTransactionsTable({ transactions }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-border">
      <div className="flex justify-between items-center px-6 py-4 bg-[#F0F3FF]/30 border-b border-border">
        <h4 className="font-bold text-base text-admin-navy">Recent Transactions</h4>
        <a href="#" className="text-primary text-base flex items-center gap-1">
          Lihat Semua <i className="fas fa-arrow-right text-[10px]" />
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-[13px]">
          <thead>
            <tr className="bg-[#F0F3FF]/50">
              {['Transaction', 'Member', 'Store', 'Date', 'Amount', 'Status', ''].map((h) => (
                <th key={h} className="px-6 py-4 text-left text-[11px] font-bold tracking-[1.1px] uppercase text-admin-text">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => {
              const s = STATUS_STYLE[t.status];
              const isPositive = typeof t.amount === 'string' ? t.amount.trim().startsWith('+') : t.amount > 0;
              return (
                <tr key={t.id} className="border-t border-border">
                  <td className="px-6 py-4 font-medium text-text-body">#{t.id}</td>
                  <td className="px-6 py-4 font-semibold text-admin-navy">{t.member}</td>
                  <td className="px-6 py-4 text-text-body">{t.store}</td>
                  <td className="px-6 py-4 text-text-body">{t.date}</td>
                  <td className={`px-6 py-4 font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>{t.amount}</td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-block px-2 py-0.5 rounded-full font-bold text-[11px] border"
                      style={{ background: s.bg, borderColor: s.border, color: s.color }}
                    >
                      {s.label}
                    </span>
                  </td>
                  <td className="px-6 py-4"><i className="fas fa-ellipsis-v" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}