export default function PhoneInput({ value, onChange, placeholder = '8xxxxxxxx' }) {
  return (
    <div className="flex items-center h-14 w-full rounded-2xl border border-border bg-bg-alt px-5">
      <div className="flex items-center pr-4 mr-4 border-r border-border">
        <span className="font-bold text-text-black">+62</span>
      </div>
      <input
        type="tel"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-base font-medium text-text-black placeholder:text-slate-300"
      />
    </div>
  );
}