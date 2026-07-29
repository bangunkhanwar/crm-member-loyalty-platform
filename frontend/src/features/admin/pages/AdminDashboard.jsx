import { useState, useEffect } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import KpiCard from '../../../components/admin/KpiCard';
import SegmentDonutChart from '../../../components/admin/SegmentDonutChart';
import AgeBarChart from '../../../components/admin/AgeBarChart';
import TopStoresList from '../../../components/admin/TopStoresList';
import RecentTransactionsTable from '../../../components/admin/RecentTransactionsTable';
import { getDashboardKPIs } from '../../../services/adminMemberService';

export default function AdminDashboard() {
  const [kpiData, setKpiData] = useState(null);
  const [segmentasi, setSegmentasi] = useState({ total: 0, breakdown: [] });
  const [ageDistribution, setAgeDistribution] = useState([]);
  const [topStores, setTopStores] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    getDashboardKPIs()
      .then((res) => {
        if (res.success) {
          setKpiData(res.data);
          // TODO: set data chart dan tabel jika tersedia di response
          // setSegmentasi(res.data.segmentasi);
          // setAgeDistribution(res.data.ageDistribution);
          // setTopStores(res.data.topStores);
          // setRecentTransactions(res.data.recentTransactions);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const totalMemberVal = kpiData?.totalMembers ?? 0;
  const activeMemberVal = kpiData?.activeMembers ?? 0;
  const totalRedeemedVal = kpiData?.totalPointsRedeemed ?? 0;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center px-9 pl-5">
        <h2 className="font-bold text-[32px] text-text-black">Dashboard</h2>
        <div className="flex gap-2.5 items-center">
          {['01 Juli - 21 Juli', 'Monthly', 'Wilayah (Semua)', 'Toko (Semua)'].map((f) => (
            <button key={f} className="flex items-center px-3 py-1 rounded-xl gap-1 font-bold text-xs text-admin-text">
              {f} <i className="fas fa-chevron-down text-[10px]" />
            </button>
          ))}
          <button className="flex items-center px-3 py-1 rounded-xl gap-1 font-bold text-xs text-admin-text">
            <i className="fas fa-filter" /> Filter
          </button>
          <button className="flex items-center px-3 py-1 rounded-xl gap-1 font-bold text-xs text-admin-text">
            <i className="fas fa-download" /> Export
          </button>
        </div>
      </div>

      <div className="p-8 flex flex-col gap-6">
        <div className="flex gap-6">
          <KpiCard
            icon="fa-users"
            title="TOTAL MEMBER"
            accent="gold"
            value={totalMemberVal.toLocaleString('id-ID')}
            growthLabel="↑ +0%"
            footerLabel=""
            footerValue=""
          />
          <KpiCard
            icon="fa-user-check"
            title="ACTIVE MEMBER"
            accent="teal"
            value={activeMemberVal.toLocaleString('id-ID')}
            growthLabel={`${kpiData?.redemptionRate ?? 0}% Rate`}
            growthColor="#00C8B3"
            footerLabel=""
            footerValue=""
            footerValueColor="#34C759"
          />
          <KpiCard
            icon="fa-gift"
            title="TOTAL POINT REDEEMED"
            accent="red"
            value={totalRedeemedVal.toLocaleString('id-ID')}
            footerLabel=""
            footerValue=""
            footerValueColor="#00C8B3"
          />
        </div>

        <div className="flex gap-6">
          <SegmentDonutChart total={segmentasi.total} breakdown={segmentasi.breakdown} />
          <AgeBarChart data={ageDistribution} />
        </div>

        <TopStoresList stores={topStores} />
        <RecentTransactionsTable transactions={recentTransactions} />
      </div>
    </AdminLayout>
  );
}