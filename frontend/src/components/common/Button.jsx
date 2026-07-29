export default function Button({
  children,
  variant = 'primary', // primary | outline | danger
  fullWidth = true,
  disabled = false,
  onClick,
  type = 'button',
}) {
  const base = 'relative flex items-center justify-center gap-2 rounded-full font-bold text-base h-14 transition-opacity';
  const variants = {
    primary: 'bg-primary text-white shadow-btn3d disabled:opacity-60',
    outline: 'bg-white text-primary border border-primary',
    danger: 'bg-danger text-white',
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      {children}
    </button>
  );
}