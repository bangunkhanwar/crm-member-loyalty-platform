import { useState, useEffect } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import KpiCard from '../../../components/admin/KpiCard';
import SegmentDonutChart from '../../../components/admin/SegmentDonutChart';
import AgeBarChart from '../../../components/admin/AgeBarChart';
import TopStoresList from '../../../components/admin/TopStoresList';
import { getDashboardKPIs } from '../../../services/adminMemberService';

export default function AdminDashboard() {
  const [kpiData, setKpiData] = useState(null);
  const [segmentasi, setSegmentasi] = useState({ total: 0, breakdown: [] });
  const [ageDistribution, setAgeDistribution] = useState([]);
  const [topStores, setTopStores] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    city: '',
    storeCode: '',
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);

  useEffect(() => {
    getDashboardKPIs(appliedFilters)
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
  }, [appliedFilters]);

  const totalMemberVal = kpiData?.totalMembers ?? 0;
  const activeMemberVal = kpiData?.activeMembers ?? 0;
  const totalRedeemedVal = kpiData?.totalPointsRedeemed ?? 0;
  const newMembersVal = kpiData?.newMembers ?? 0;

  return (
    <AdminLayout>
      <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center px-4 md:px-9 md:pl-5 pt-4 lg:pt-6">
        <h2 className="font-bold text-2xl md:text-[32px] text-text-black">Dashboard</h2>
        <div className="flex gap-2 items-center overflow-x-auto pb-1 lg:pb-0">
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters((current) => ({
                ...current,
                startDate: e.target.value,
              }))
            }
          />

          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters((current) => ({
                ...current,
                endDate: e.target.value,
              }))
            }
          />

          <input
            type="text"
            placeholder="Wilayah"
            value={filters.city}
            onChange={(e) =>
              setFilters((current) => ({
                ...current,
                city: e.target.value,
              }))
            }
          />

          <input
            type="text"
            placeholder="Kode toko"
            value={filters.storeCode}
            onChange={(e) =>
              setFilters((current) => ({
                ...current,
                storeCode: e.target.value,
              }))
            }
          />
          <button 
            onClick={() => setAppliedFilters(filters)}
            className="flex shrink-0 items-center px-3 py-1.5 rounded-xl gap-1 font-bold text-xs text-admin-text bg-white border border-black/20">
            <i className="fas fa-filter" /> Filter
          </button>
          <button className="flex shrink-0 items-center px-3 py-1.5 rounded-xl gap-1 font-bold text-xs text-white bg-secondary">
            <i className="fas fa-download" /> Export
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
          <KpiCard
            icon="fa-user-plus"
            title="NEW MEMBER"
            accent="blue"
            value={newMembersVal.toLocaleString('id-ID')}
            footerLabel="Member terdaftar pada periode"
            footerValue=""
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <SegmentDonutChart total={segmentasi.total} breakdown={segmentasi.breakdown} />
          <AgeBarChart data={ageDistribution} />
        </div>

        <TopStoresList stores={topStores} />
      </div>
    </AdminLayout>
  );
}