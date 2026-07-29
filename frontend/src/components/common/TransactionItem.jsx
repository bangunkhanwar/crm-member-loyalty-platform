export default function TransactionItem({ transaction }) {
  const isPositive = transaction.pointChange > 0;
  return (
    <div className="w-full flex items-center justify-between bg-white border border-border-soft shadow-card rounded-card p-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-text-muted text-[13px]">{transaction.date}</span>
        <span className="font-bold text-[15px] text-text-body">{transaction.description}</span>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span className={`font-bold text-[13px] ${isPositive ? 'text-success' : 'text-danger-bright'}`}>
          {isPositive ? '+' : ''}{transaction.pointChange} Poin
        </span>
        <span className="text-text-muted text-[13px]">Saldo: {transaction.balance.toLocaleString('id-ID')} Poin</span>
      </div>
    </div>
  );
}