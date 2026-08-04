import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import KpiCard from '../../../components/admin/KpiCard';
import RewardInventoryCard from '../../../components/admin/RewardManagementCard';
import AddRewardModal from '../../../components/admin/AddRewardModal';
import EditRewardDrawer from '../../../components/admin/EditRewardDrawer';
import { getRewardInventory, getRewardStats, toggleRewardActive } from '../../../services/adminRewardService';

export default function RewardManagement() {
  const [search, setSearch] = useState('');
  const [rewards, setRewards] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([getRewardInventory(search), getRewardStats()])
      .then(([listRes, statsRes]) => {
        if (listRes.success) setRewards(listRes.data);
        if (statsRes.success) setStats(statsRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const handleQuickToggle = async (reward) => {
    try {
      await toggleRewardActive(reward.giftId);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const hotItemName = stats?.topRedeemed?.name;

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-5 sm:px-9 sm:pl-5 pt-4">
        <h2 className="font-bold text-2xl sm:text-[32px] text-text-black">Reward Management</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-xs text-admin-text" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari reward..."
              className="w-full sm:w-64 h-9 pl-9 pr-3 rounded-lg bg-bg-alt border border-border text-sm outline-none"
            />
          </div>
          <button onClick={() => setShowAdd(true)} className="flex items-center justify-center gap-2 px-4 h-9 rounded-lg bg-secondary text-white text-sm font-medium whitespace-nowrap">
            <i className="fas fa-plus text-xs" /> Tambah Reward
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-8 flex flex-col gap-6">
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            <KpiCard icon="fa-gift" title="TOTAL ACTIVE REWARDS" accent="teal" value={stats.totalActiveRewards.toString()} footerLabel="Reward Aktif" footerValue={stats.totalActiveRewards} />
            <KpiCard icon="fa-exclamation-triangle" title="OUT OF STOCK SOON" accent="red" value={stats.outOfStockSoon.toString()} footerLabel="Perlu Restock" footerValue={stats.outOfStockSoon} footerValueColor="#EF4444" />
            <KpiCard icon="fa-trophy" title="TOP REDEEMED REWARD" accent="gold" value={stats.topRedeemed?.name || '-'} footerLabel="Jumlah Redeem" footerValue={stats.topRedeemed ? `${stats.topRedeemed.count}x` : '0x'} />
            <KpiCard icon="fa-coins" title="POINTS OUTSTANDING" accent="teal" value={stats.pointsOutstanding.toLocaleString('id-ID')} footerLabel="Total Poin Member" footerValue={stats.pointsOutstanding.toLocaleString('id-ID')} />
          </div>
        )}

        {loading ? (
          <p className="text-center text-admin-text py-10">Memuat data reward...</p>
        ) : rewards.length === 0 ? (
          <p className="text-center text-admin-text py-10">Belum ada reward. Klik "Tambah Reward" untuk membuat yang pertama.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {rewards.map((r) => (
              <RewardInventoryCard
                key={r.giftId}
                reward={r}
                isHotItem={hotItemName === r.name}
                onEdit={setEditTarget}
                onToggle={handleQuickToggle}
              />
            ))}
          </div>
        )}
      </div>

      <AddRewardModal open={showAdd} onClose={() => setShowAdd(false)} onSuccess={load} />
      <EditRewardDrawer open={!!editTarget} reward={editTarget} onClose={() => setEditTarget(null)} onSuccess={load} />
    </AdminLayout>
  );
}