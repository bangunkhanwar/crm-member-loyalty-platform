export default function LogoutConfirmModal({ open, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-[342px] bg-white rounded-[24px] px-8 py-6 flex flex-col items-center gap-4">
        <h1 className="font-bold text-xl text-danger-dark text-center">Keluar Akun?</h1>
        <p className="text-center text-[15px] leading-[22px] text-text-soft">
          Apakah Anda yakin ingin keluar dari Website Elcorps Member? Anda perlu masuk kembali untuk mengakses poin dan voucher Anda.
        </p>
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="h-12 rounded-xl bg-danger font-bold text-white shadow-elevated"
          >
            Keluar
          </button>
          <button
            onClick={onCancel}
            className="h-12 rounded-xl border border-border-soft font-bold text-text-body"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}