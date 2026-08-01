export default function AgeBarChart({ data }) {
  return (
    <div className="flex-1 bg-white rounded-2xl p-6 border border-[rgba(0,0,0,0.2)]">
      <h3 className="font-bold text-base text-[#111C2D] mb-6">Sebaran Usia Member</h3>
      <div className="flex flex-col gap-4">
        {data.map((d) => (
          <div key={d.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className={`text-xs ${d.highlight ? 'font-bold text-secondary' : 'font-medium text-admin-text'}`}>{d.label}</span>
              <span className={`text-xs ${d.highlight ? 'font-bold text-secondary' : 'font-medium text-admin-text'}`}>{d.percent}%</span>
            </div>
            <div className="h-3 bg-[#F0F3FF] rounded-full border border-[rgba(0,0,0,0.2)] relative overflow-hidden">
              <div
                className={`h-full rounded-full ${d.highlight ? 'bg-secondary' : 'bg-[#BCC9C7]'}`}
                style={{ width: `${d.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}