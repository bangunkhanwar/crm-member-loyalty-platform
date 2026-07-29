export default function HeroBalanceCard({ name, memberId, totalPoint, pointExpiring }) {
  const safeTotalPoint = totalPoint ?? 0;
  const safeName = name || 'Member';
  const safeMemberId = memberId || '-';

  return (
    <div className="w-full bg-hero-gradient rounded-card-lg shadow-elevated p-4 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-white font-bold text-base">{safeName}</h3>
          <span className="text-white text-base">{safeMemberId}</span>
        </div>
        <div className="w-[46px] h-[46px] border border-dashed border-white/100 flex items-center justify-center">
          {/* Icon QR */}
        </div>
      </div>

      <div className="flex items-end gap-2 border-b-2 border-primary-muted pb-2 w-fit">
        <span className="text-white font-extrabold text-[42px] leading-[52px] tracking-[-1.05px]">
          {safeTotalPoint.toLocaleString('id-ID')}
        </span>
        <span className="text-primary-muted font-medium text-xl tracking-[-1.05px] pb-1">Poin</span>
      </div>

      {pointExpiring && (
        <div className="flex items-center gap-2.5 bg-black/10 border border-white/10 backdrop-blur-sm rounded-xl px-3 py-3">
          <span className="w-[15px] h-[15px] bg-primary-muted rounded-full shrink-0" />
          <p className="text-white text-xs font-semibold">
            {pointExpiring.amount} Poin akan hangus pada {pointExpiring.expiredDate}
          </p>
        </div>
      )}
    </div>
  );
}