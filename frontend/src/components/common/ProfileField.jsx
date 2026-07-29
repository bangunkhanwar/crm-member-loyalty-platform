export default function ProfileField({ label, value, editable = false, onChange, readOnlyStyle = 'dashed' }) {
  if (!editable) {
    return (
      <div className={`flex items-center justify-between py-2.5 border-b ${readOnlyStyle === 'dashed' ? 'border-dashed' : ''} border-border-soft`}>
        <span className="text-base font-medium text-text-soft/60">{value}</span>
        {/* Icon lock kecil untuk field read-only */}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold tracking-wider uppercase text-text-soft/60">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 border-b border-border-soft py-2 text-[15px] text-text-black outline-none focus:border-primary"
      />
    </div>
  );
}