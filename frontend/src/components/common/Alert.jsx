export default function Alert({ children, variant = 'error' }) {
  const variants = {
    error: 'bg-danger-bright/10 border-danger-dark/20 text-danger-bright',
  };
  return (
    <div className={`flex items-start gap-2 p-2 rounded-lg border text-sm ${variants[variant]}`}>
      {/* Icon warning bisa pakai lucide-react: AlertCircle */}
      <span>{children}</span>
    </div>
  );
}