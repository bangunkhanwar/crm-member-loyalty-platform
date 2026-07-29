export default function AgeBarChart({ data }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card flex-1">
      <h3 className="font-bold text-base text-admin-navy mb-4">Sebaran Usia Member</h3>
      <div className="flex flex-col gap-1.5">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-4">
            <span className="w-[60px] text-right text-xs font-medium text-admin-text">{d.label}</span>
            <div className="flex-1 h-3 bg-[#F0F3FF] rounded-full relative">
              <div
                className={`h-full rounded-full ${d.highlight ? 'bg-secondary' : 'bg-border-soft'}`}
                style={{ width: `${d.percent}%` }}
              />
            </div>
            <span className="w-10 font-bold text-xs text-secondary">{d.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}