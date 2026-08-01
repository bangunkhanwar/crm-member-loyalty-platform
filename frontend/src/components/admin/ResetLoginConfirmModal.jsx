import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';


export default function ResetLoginConfirmModal({ open, member, onClose, onConfirm }) {
  useLockBodyScroll(open);
  if (!open) return null;

  const handleConfirm = async () => {
    // TODO(backend): POST /admin/members/:id/reset-login
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#111C2D]/65 backdrop-blur-sm">
      <div className="w-[448px] bg-white rounded-xl">
        <div className="flex items-center gap-3 p-6">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"><i className="fas fa-sync-alt text-red-500" /></div>
          <h2 className="font-hanken text-2xl font-semibold text-admin-navy flex-1">Reset Login?</h2>
          <button onClick={onClose} className="text-admin-text"><i className="fas fa-times" /></button>
        </div>
        <div className="px-6 pb-4 flex flex-col gap-4">
          <p className="text-sm text-admin-text leading-relaxed">
            Apakah Anda yakin ingin mereset session login untuk {member.name} ({member.memberId})? Member akan di-logout dari semua perangkat dan harus login ulang via OTP.
          </p>
          <div className="flex items-center gap-3 bg-[#E7EEFF] border border-border rounded-lg p-3">
            <i className="fas fa-info-circle text-admin-text" />
            <span className="text-xs font-semibold text-admin-text">Tindakan ini akan tercatat di Audit Trail</span>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-border">
          <button onClick={onClose} className="px-6 h-9 rounded-lg border border-border text-sm font-medium text-admin-text">Batal</button>
          <button onClick={handleConfirm} className="px-5 h-9 rounded-lg bg-red-500 text-white text-sm font-semibold">Ya, Reset Login</button>
        </div>
      </div>
    </div>
  );
}