import { useRef } from 'react';

export default function OTPInput({ value, onChange, length = 4 }) {
  const inputsRef = useRef([]);

  const handleChange = (i, digit) => {
    if (!/^\d?$/.test(digit)) return;
    const next = value.split('');
    next[i] = digit;
    onChange(next.join(''));
    if (digit && i < length - 1) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-4">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="tel"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          // focus state pakai biru #2563EB sesuai desain (bukan teal brand)
          className="w-16 h-16 text-center text-2xl font-bold rounded-lg bg-bg-field border-2 border-border
                     focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none"
        />
      ))}
    </div>
  );
}