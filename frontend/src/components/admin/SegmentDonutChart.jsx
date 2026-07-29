// src/components/admin/SegmentDonutChart.jsx
export default function SegmentDonutChart({ total, breakdown }) {
  // Urutan warna dari Figma: Silver (#F59E0B) -> Bronze (#2DA299) -> Gold (#94A3B8)
  const colorMap = {
    'Gold': '#F59E0B',
    'Silver': '#94A3B8',
    'Platinum': '#2DA299',
  };

  // Hitung persentase untuk conic-gradient (urutan harus Silver -> Bronze -> Gold)
  // Asumsikan data breakdown diurutkan sesuai urutan di Figma
  const sorted = breakdown.sort((a, b) => {
    const order = ['Silver', 'Gold', 'Platinum'];
    return order.indexOf(a.label) - order.indexOf(b.label);
  });

  let currentPercentage = 0;
  const gradientParts = sorted.map((item) => {
    const percent = (item.value / total) * 100;
    const start = currentPercentage;
    const end = currentPercentage + percent;
    currentPercentage = end;
    return `${colorMap[item.label] || '#E2E8F0'} ${start}% ${end}%`;
  });

  const gradientString = `conic-gradient(${gradientParts.join(', ')})`;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-bold text-base mb-4">Sebaran Segmentasi Member</h3>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Donut Chart */}
        <div className="relative w-[192px] h-[192px] rounded-full" style={{ background: gradientString }}>
          <div className="absolute inset-[16px] bg-white rounded-full flex flex-col items-center justify-center">
            <span className="font-bold text-2xl text-[#111C2D]">{total.toLocaleString('id-ID')}</span>
            <span className="text-[10px] uppercase text-[#3D4947]">Total Member</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3 min-w-[150px]">
          {breakdown.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 text-[#3D4947]">
                <span
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: colorMap[item.label] || '#94A3B8' }}
                ></span>
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