export default function Alert({ children }) {
  return (
    <div className="flex items-start gap-2 p-2 rounded-lg border border-danger-dark/20 bg-danger-bright/10 text-sm text-danger-bright">
      {/* Icon AlertCircle dari lucide-react */}
      <span>{children}</span>
    </div>
  );
}