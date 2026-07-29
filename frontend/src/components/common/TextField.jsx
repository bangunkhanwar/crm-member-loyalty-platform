export default function TextField({ label, value, onChange, error }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-bold tracking-wider uppercase text-[#545F73]/60">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-transparent outline-none text-[15px] leading-[22px] text-text-black py-2
          border-b ${error ? 'border-danger-dark border-2 px-2.5' : 'border-[#BCC9C7] focus:border-primary'}`}
      />
      {error && (
        <div className="flex items-center gap-1 pt-1">
          <svg width="13" height="13" viewBox="0 0 20 20" fill="#BA1A1A">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-danger-dark">{error}</span>
        </div>
      )}
    </div>
  );
}