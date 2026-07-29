import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBackNavigate } from '../../../hooks/useBackNavigate';
import RedeemConfirmModal from '../../../components/common/RedeemConfirmModal';
// TODO(backend): ganti mockRewards.find -> rewardService.getById(id)

export default function DetailPromo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = useBackNavigate('/member/reward');
  const [showConfirm, setShowConfirm] = useState(false);

  const [reward, setReward] = useState(null);
  const [loading, setLoading] = useState(true);
  // TODO: useEffect -> rewardService.getById(id).then(setReward).finally(() => setLoading(false))

  if (loading) return <p className="p-5">Memuat...</p>;
  if (!reward) return <p className="p-5">Reward tidak ditemukan.</p>;

const canRedeem = false; // TODO: cek dari user point vs reward.pointRequired

  return (
    <div className="min-h-screen bg-white pb-28">
      <header className="h-16 flex items-center gap-4 px-5 bg-white sticky top-0 z-10">
        <button onClick={goBack} aria-label="Kembali">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#006A64" strokeWidth="2">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="font-bold text-xl text-primary">Detail Reward</h1>
      </header>

      {/* Hero image */}
      <div className="w-full h-[390px] bg-[#E0E3E5]">
        {reward.image && <img src={reward.image} alt={reward.name} className="w-full h-full object-cover" />}
      </div>

      {/* Info card - overlap ke atas gambar */}
      <div className="bg-white rounded-t-[24px] -mt-6 relative z-10 px-5 pt-4 pb-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="bg-[#D5E0F8] text-[#586377] text-xs font-bold uppercase tracking-wide px-2 py-1 rounded">
            {reward.category}
          </span>
          <span className="text-[#3D4947] text-base">Sisa {reward.daysLeft} Hari</span>
        </div>

        <h2 className="font-bold text-base text-text-black">{reward.name}</h2>

        <p className="text-[#3D4947] text-base leading-[26px]">{reward.description}</p>

        <div className="flex gap-3">
          {reward.benefits?.map((b) => (
            <div key={b.title} className="flex-1 bg-[#F7F9FB] border border-[#E0E3E5]/50 rounded-xl p-4 flex flex-col gap-1">
              <div className="w-[18px] h-[18px] bg-primary rounded-sm" /> {/* placeholder icon */}
              <h4 className="font-medium text-base text-text-black pt-1">{b.title}</h4>
              <p className="text-xs text-[#3D4947]">{b.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Syarat & Ketentuan */}
      <div className="border-t border-[#E0E3E5]/30 px-5 py-6 flex flex-col gap-4">
        <h3 className="font-bold text-xl text-text-black">Syarat & Ketentuan</h3>
        <div className="flex flex-col gap-4">
          {reward.terms?.map((term, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 shrink-0 rounded-full bg-[#ECEEF0] flex items-center justify-center text-xs font-bold text-primary">
                {i + 1}
              </span>
              <p className="text-base text-[#3D4947]">{term}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-[#E0E3E5] px-5 py-5 flex items-center gap-5 max-w-[448px] mx-auto">
        <div className="flex flex-col">
          <span className="text-xs font-bold tracking-wide text-[#3D4947]">POIN</span>
          <span className="font-bold text-xl text-primary">{reward.pointRequired.toLocaleString('id-ID')}</span>
        </div>
        <button
          onClick={() => setShowConfirm(true)}
          disabled={!canRedeem}
          className="flex-1 h-[52px] rounded-2xl bg-secondary text-white font-normal text-base shadow-elevated disabled:opacity-50"
        >
          {canRedeem ? 'Tukar Sekarang' : 'Poin Tidak Cukup'}
        </button>
      </div>

      <RedeemConfirmModal
        open={showConfirm}
        reward={reward}
        currentBalance={0}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          // TODO(backend): await pointService.redeem(reward.id)
          setShowConfirm(false);
          navigate('/member/reward/success', { state: { reward } });
        }}
      />
    </div>
  );
}