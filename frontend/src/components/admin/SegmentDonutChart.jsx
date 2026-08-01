export default function SegmentDonutChart({ total, breakdown }) {
  const colorMap = {
    'Gold': '#F59E0B',
    'Silver': '#94A3B8',
    'Platinum': '#2DA299',
  };

  const order = ['Silver', 'Gold', 'Platinum'];
  const sorted = [...breakdown].sort((a, b) => order.indexOf(a.label) - order.indexOf(b.label));

  let currentPercentage = 0;
  const gradientParts = sorted.map((item) => {
    const percent = total > 0 ? (item.value / total) * 100 : 0;
    const start = currentPercentage;
    const end = currentPercentage + percent;
    currentPercentage = end;
    return `${colorMap[item.label] || '#E2E8F0'} ${start}% ${end}%`;
  });

  const gradientString = `conic-gradient(${gradientParts.join(', ')})`;

  return (
    <div className="flex-1 bg-white rounded-2xl p-6 border border-[rgba(0,0,0,0.2)]">
      <h3 className="font-bold text-base text-[#111C2D] mb-6">Sebaran Segmentasi Member</h3>

      <div className="flex flex-col md:flex-row items-center md:justify-between gap-8">
        <div className="relative w-[192px] h-[192px] rounded-full shrink-0" style={{ background: gradientString }}>
          <div className="absolute inset-[16px] bg-white rounded-full flex flex-col items-center justify-center">
            <span className="font-bold text-2xl text-[#111C2D]">{total.toLocaleString('id-ID')}</span>
            <span className="text-[10px] uppercase text-[#3D4947]">Total Member</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-auto md:min-w-[150px] md:pl-12">
          {sorted.map((item) => (
            <div key={item.label} className="flex justify-between items-center text-base">
              <span className="flex items-center gap-2 text-[#3D4947]">
                <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: colorMap[item.label] || '#94A3B8' }} />
                {item.label}
              </span>
              <span className="font-bold text-[#111C2D]">{item.value.toLocaleString('id-ID')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}