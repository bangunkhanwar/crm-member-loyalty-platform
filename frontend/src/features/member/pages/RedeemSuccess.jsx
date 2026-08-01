import { useLocation, useNavigate } from 'react-router-dom';

export default function RedeemSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const reward = state?.reward;

  if (!reward) {
    navigate('/member/reward', { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-page flex flex-col">
      <header className="h-16 flex items-center gap-4 px-5">
        <h1 className="font-bold text-xl text-primary">Reward & Promo</h1>
      </header>

      <main className="flex-1 flex flex-col items-center px-5 pt-3 gap-6">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-secondary/10" />
          <div className="absolute inset-4 rounded-full bg-secondary/20" />
          <div className="relative w-24 h-24 rounded-full bg-secondary shadow-elevated flex items-center justify-center">
            <svg width="45" height="34" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="font-bold text-2xl text-text-black tracking-tight">Penukaran Berhasil!</h2>
          <p className="text-base font-medium text-[#3D4947]">
            Reward Anda sudah siap digunakan
          </p>
          <p className="text-base font-medium text-[#3D4947]">
            Tunjukkan kode voucher ini ke kasir saat transaksi berikutnya
          </p>
        </div>

        <div className="w-full bg-white shadow-card rounded-xl p-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-[#ECEEF0] shrink-0">
            {reward.image && <img src={reward.image} alt={reward.name} className="w-full h-full object-cover rounded-lg" />}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold uppercase tracking-wide text-primary">{reward.category}</span>
            <h3 className="font-bold text-base text-text-black">{reward.name}</h3>
            <span className="text-sm text-[#3D4947]">Berlaku hingga {reward.daysLeft} hari ke depan</span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-4">
          <button
            onClick={() => navigate('/member/riwayat')}
            className="h-14 rounded-xl bg-secondary text-white font-bold text-base shadow-elevated"
          >
            Lihat Voucher Saya
          </button>
          <button
            onClick={() => navigate('/member/dashboard')}
            className="h-12 rounded-xl text-primary font-bold text-base"
          >
            Kembali ke Beranda
          </button>
        </div>
      </main>

      <footer className="flex items-center justify-center gap-2 px-5 pt-5 pb-8 opacity-60">
        <span className="text-xs font-bold uppercase tracking-wide text-[#3D4947]">Transaksi Aman & Terverifikasi</span>
      </footer>
    </div>
  );
}