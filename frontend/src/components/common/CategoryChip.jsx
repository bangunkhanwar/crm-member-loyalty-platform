export default function CategoryChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-4 py-2.5 rounded-full text-base font-bold whitespace-nowrap transition-colors
        ${active ? 'bg-secondary text-white' : 'bg-white border border-border text-text-body font-normal'}`}
    >
      {label}
    </button>
  );
}