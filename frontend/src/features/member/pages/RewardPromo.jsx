import { useState, useEffect } from 'react';
import BackHeader from '../../../layouts/BackHeader';
import CategoryChip from '../../../components/common/CategoryChip';
import RewardCard from '../../../components/common/RewardCard';
import { getRewards } from '../../../services/rewardService';
import { mapReward } from '../../../utils/mapReward';

const CATEGORIES = ['Semua', 'Voucher', 'Merchandise', 'Elektronik'];

export default function RewardPromo() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    getRewards()
      .then((res) => { if (res.success) setRewards(res.data.map(mapReward)); })
      .catch((err) => console.error(err));
  }, []);

  const filtered = activeCategory === 'Semua' ? rewards : rewards.filter((r) => r.category === activeCategory);

  return (
    <div className="min-h-screen bg-page-gradient pb-10">
      <BackHeader title="Reward & Promo" />

      <main className="px-5 pt-6 flex flex-col gap-4">

        <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1">
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filtered.map((r) => (
            <RewardCard key={r.id} reward={r} variant="grid" />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-text-muted py-10">Belum ada reward di kategori ini.</p>
        )}
      </main>
    </div>
  );
}