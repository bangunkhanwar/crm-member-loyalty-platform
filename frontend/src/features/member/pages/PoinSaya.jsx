import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackHeader from '../../../layouts/BackHeader';
import TransactionItem from '../../../components/common/TransactionItem';
// TODO(backend): totalPoint dari memberService.getProfile(), history dari pointService.getRecentHistory({limit:3})

export default function PoinSaya() {
  const navigate = useNavigate();
  const [totalPoint] = useState(0);         // TODO: ambil dari API/context
  const [recentTransactions] = useState([]); // TODO: ambil dari API

  return (
    <div className="min-h-screen bg-white">
      <BackHeader title="Poin Saya" />

      <main className="px-5 pt-2 pb-10 flex flex-col gap-6">
        {/* Hero: Saldo Poin Aktif */}
        <div className="bg-hero-gradient rounded-card-lg shadow-card p-10 flex flex-col items-center gap-2">
          <span className="text-white/80 text-base">Poin Aktif Saat Ini</span>
          <span className="text-white font-extrabold text-[42px] leading-[52px] tracking-[-1.05px]">
            {totalPoint.toLocaleString('id-ID')} Poin
          </span>
          <div className="w-16 h-1.5 rounded-full bg-white/40 mt-2" />
          <div className="flex items-center gap-2 mt-4">
            {/* Icon info kecil */}
            <span className="text-primary-muted text-[13px]">Terupdate secara real-time</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/member/reward')}
            className="flex-1 h-[58px] rounded-xl bg-primary text-white font-bold text-base shadow-elevated"
          >
            Tukar Poin
          </button>
          <button
            onClick={() => navigate('/member/riwayat')}
            className="flex-1 h-[58px] rounded-xl border border-primary text-primary font-bold text-base"
          >
            Detail Poin
          </button>
        </div>

        {/* Riwayat Poin (cuplikan 3 item terbaru) */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl text-text-black">Riwayat Poin</h2>
            <button onClick={() => navigate('/member/riwayat')} className="text-primary font-normal text-base">
              Lihat Semua
            </button>
          </div>
          <div className="bg-white shadow-card rounded-card flex flex-col">
            {recentTransactions.map((t) => <TransactionItem key={t.id} transaction={t} />)}
          </div>
        </section>

        {/* Promo Banner placeholder */}
        <div className="w-full h-32 rounded-card bg-slate/10 shadow-card flex items-end p-4">
          {/* TODO(backend): ambil banner aktif dari rewardService/promoService, tampilkan gambar + judul promo */}
          <div className="text-white">
            <p className="text-sm">PROMO TERBATAS</p>
            <p className="text-sm font-medium">Double Poin di Akhir Pekan!</p>
          </div>
        </div>
      </main>
    </div>
  );
}