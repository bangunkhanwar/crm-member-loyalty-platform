export default function RedeemConfirmModal({ open, reward, currentBalance, onCancel, onConfirm }) {
  if (!open || !reward) return null;

  const isLimited = reward.isLimited;
  const accentColor = isLimited ? '#FF8D28' : '#006A64';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-5 bg-[#111C2D]/65 backdrop-blur-sm">
      <div className="w-full max-w-[354px] bg-white rounded-3xl px-6 pt-6 pb-8 flex flex-col items-center">
        <div className="w-12 h-1.5 rounded-full bg-[#E0E3E5] mb-6" />

        <div className="w-20 h-20 rounded-full bg-[#D5E0F8] flex items-center justify-center mb-6">
          {/* Icon gift/voucher - lucide-react Gift, warna primary */}
        </div>

        <h2 className="font-bold text-2xl text-text-black text-center tracking-tight mb-3">
          Konfirmasi Penukaran
        </h2>

        <p className="text-base text-[#3D4947] text-center mb-2">
          Tukar <span className="font-bold" style={{ color: accentColor }}>{reward.pointRequired.toLocaleString('id-ID')} Poin</span> untuk
        </p>
        <p className="font-bold text-base text-text-black text-center mb-6">{reward.name}?</p>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onConfirm}
            className="h-14 rounded-xl text-white font-bold text-base shadow-elevated"
            style={{ backgroundColor: accentColor }}
          >
            Ya, Tukar Sekarang
          </button>
          <button
            onClick={onCancel}
            className="h-[60px] rounded-xl border-2 border-secondary text-primary font-bold text-base"
          >
            Batal
          </button>
        </div>

        <div className="mt-6 flex items-center gap-2 bg-[#ECEEF0] rounded-full px-4 py-2">
          {/* Icon koin kecil */}
          <span className="text-sm text-[#3D4947]">Saldo saat ini: {currentBalance.toLocaleString('id-ID')} Poin</span>
        </div>
      </div>
    </div>
  );
}