import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import MemberHeader from '../../../layouts/MemberHeader';
import MemberDrawer from '../../../layouts/MemberDrawer';
import LogoutConfirmModal from '../../../components/common/LogoutConfirmModal';
import HeroBalanceCard from '../../../components/common/HeroBalanceCard';
import RewardCard from '../../../components/common/RewardCard';
import TransactionItem from '../../../components/common/TransactionItem';
import Button from '../../../components/common/Button';
import { getMemberProfile } from '../../../services/memberService';
import { getRewards } from '../../../services/rewardService';
import { getHistory } from '../../../services/pointService';
import { mapReward } from '../../../utils/mapReward';

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [member, setMember] = useState({});
  const [rewards, setRewards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  useEffect(() => {
    getMemberProfile()
      .then((res) => {
        if (res.success) {
          setMember({
            name: res.data.name,
            memberId: res.data.memberCode,
            totalPoint: res.data.totalPoints,
          });
        }
      })
      .catch((err) => console.error(err));

    getRewards()
      .then((res) => { if (res.success) setRewards(res.data.slice(0, 6).map(mapReward)); })
      .catch((err) => console.error(err));

    getHistory({ limit: 3 })
      .then((res) => {
        if (res.success) {
          setTotalTransactions(res.total);

          const mapped = res.data.map((t) => ({
            id: t.id,
            date: new Date(t.date).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            }),
            description: t.description,
            pointChange: t.debit > 0 ? t.debit : -t.credit,
            balance: t.balance,
          }));

          setTransactions(mapped);
        }
      })
      .catch((err) => console.error(err));
    }, []);

  const handleLogout = () => {
    logout();
    setLogoutModalOpen(false);
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-page-gradient">
      <MemberHeader onMenuClick={() => setDrawerOpen(true)} />

      <main className="flex flex-col items-center gap-6 px-5 pt-8 pb-6">
        <HeroBalanceCard {...member} />

        <section className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between px-5">
            <h2 className="font-bold text-xl text-text-black">Reward & Promo</h2>
            <button onClick={() => navigate('/member/reward')} className="font-bold text-[15px] text-primary">
              Lihat Semua
            </button>
          </div>
          <div className="w-full flex gap-4 overflow-x-auto px-1 pb-1 -mx-1">
            {rewards.map((r) => <RewardCard key={r.id} reward={r} />)}
          </div>
        </section>

        <section className="w-full flex flex-col gap-4">
          <h2 className="font-bold text-xl text-text-black">Riwayat Transaksi</h2>
          <div className="flex flex-col gap-3">
            {transactions.map((t) => <TransactionItem key={t.id} transaction={t} />)}
          </div>
          {totalTransactions > 3 && (
            <p className="text-sm text-admin-text text-center">
              Menampilkan {transactions.length} dari {totalTransactions} transaksi.
            </p>
          )}
          <Button onClick={() => navigate('/member/riwayat')}>Lihat Semua Riwayat</Button>
        </section>
      </main>

      <MemberDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        member={member}
        onLogoutClick={() => { setDrawerOpen(false); setLogoutModalOpen(true); }}
      />
      <LogoutConfirmModal
        open={logoutModalOpen}
        onCancel={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}