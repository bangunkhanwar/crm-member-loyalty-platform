export default function TopStoresList({ stores }) {
  return (
    <div className="bg-white border border-border rounded-xl p-5 pb-10 shadow-card">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-lg text-admin-navy">Top Performing Stores</h4>
        <a href="#" className="text-primary text-base flex items-center gap-1">
          Lihat Semua <i className="fas fa-arrow-right text-[10px]" />
        </a>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {stores.map((s) => (
          <div key={s.rank} className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#E7EEFF] rounded font-bold text-xs text-secondary flex items-center justify-center">
              {s.rank}
            </div>
            <span className="flex-1 text-base text-admin-navy">{s.store}</span>
            <div className="flex-1 h-1.5 bg-[#E7EEFF] rounded-full relative">
              <div className="h-full bg-secondary rounded-full" style={{ width: `${s.score}%` }} />
            </div>
            <span className="font-bold text-base text-secondary">{s.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}