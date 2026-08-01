import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout';
import PointAdjustmentModal from '../../../components/admin/PointAdjustmentModal';
import ResetLoginConfirmModal from '../../../components/admin/ResetLoginConfirmModal';
import EditMemberDrawer from '../../../components/admin/EditMemberDrawer';
import PointHistoryTab from '../../../components/admin/PointHistoryTab';
import { getMemberDetail } from '../../../services/adminMemberService';

const TABS = ['Overview', 'Point History', 'Vouchers', 'Transactions'];

// Mapping backend pointHistory -> shape yang dipakai PointHistoryTab
function mapPointHistory(rows = []) {
  return rows.map((r) => {
    const debit = parseFloat(r.Debit) || 0;
    const credit = parseFloat(r.Credit) || 0;
    const isAdd = debit > 0;
    return {
      id: r.IdRec,
      date: new Date(r.CreateTime).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      desc: r.Description || '-',
      type: isAdd ? 'add' : 'subtract',
      amount: `${isAdd ? '+' : '-'}${isAdd ? debit : credit} Pts`,
      by: r.CreateBy || 'SYSTEM',
    };
  });
}

export default function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [showAdjust, setShowAdjust] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMemberDetail(id)
      .then((res) => {
        if (res.success) setMemberData(res.data);
      })
      .catch((err) => console.error('Gagal fetch member detail:', err))
      .finally(() => setLoading(false));
  }, [id]);

  // Bangun objek member untuk tampilan, semua properti dari API atau default
  const m = {
    memberCode: memberData?.memberCode || '',
    name: memberData?.name || '',
    memberId: memberData?.memberCode || '',
    email: memberData?.email || '',
    phone: memberData?.phone || '',
    status: memberData?.isActive ? 'active' : 'inactive',
    currentBalance: memberData?.totalPoints || 0,
    // Data tambahan yang belum disediakan backend: beri default
    tier: {
      progressPercent: 0,
      remaining: [],
    },
    tierPerks: [],
    recentActivity: [],
    membership: {
      joinedDate: '-',
      joinedDuration: '-',
      homeStore: '-',
      branchId: '-',
      referralCode: '-',
      referralUsedBy: '-',
    },
  };

  const pointHistoryData = memberData ? mapPointHistory(memberData.pointHistory) : [];

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-9 text-admin-text">Memuat data member...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center gap-3 px-9 pl-5 mb-2">
        <button onClick={() => navigate('/admin/members')} className="w-7 h-7 flex items-center justify-center">
          <i className="fas fa-chevron-left" />
        </button>
        <h2 className="font-bold text-2xl text-text-black">Member Management / Member Detail</h2>
      </div>

      <div className="px-9 pl-5 flex flex-col gap-8 pb-10">
        {/* Header profile */}
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-8">
            <div className="relative w-32 h-32 bg-white rounded-3xl shadow-card p-1.5">
              <div className="w-full h-full rounded-[20px] bg-bg-field flex items-center justify-center text-2xl font-bold text-secondary">
                {m.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <span className="absolute -right-2 -bottom-2 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-elevated uppercase">
                {m.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="font-hanken text-4xl font-bold text-admin-navy tracking-tight">{m.name}</h1>
              <div className="flex items-center gap-6 text-sm">
                <span className="font-semibold text-admin-navy">{m.memberId}</span>
                <span className="text-admin-text">{m.email}</span>
                <span className="text-admin-text">{m.phone}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4 pb-2">
            <button onClick={() => setShowEdit(true)} className="flex items-center gap-2 px-6 h-[46px] rounded-full border border-border text-sm font-semibold text-admin-navy">
              <i className="fas fa-pen text-xs" /> Edit Profile
            </button>
            <button onClick={() => setShowAdjust(true)} className="flex items-center gap-2 px-8 h-[46px] rounded-full bg-secondary text-white text-sm font-bold">
              <i className="fas fa-plus text-xs" /> Adjust Points
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-12 border-b border-border/50">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`pb-5 text-sm font-bold ${activeTab === t ? 'border-b-2 border-primary text-primary' : 'text-admin-text font-medium'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === 'Overview' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-[1fr_1fr] gap-6">
              {/* Tier progression */}
              <div className="bg-white rounded-xl p-8 flex flex-col gap-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="font-semibold text-lg text-admin-navy">Tier Progression</h3>
                    <p className="text-sm text-admin-text">Menuju tier berikutnya</p>
                  </div>
                  <span className="text-xs font-bold text-primary">{m.tier.progressPercent}% Selesai</span>
                </div>
                <div className="w-full h-4 bg-[#DEE8FF] rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${m.tier.progressPercent}%` }} />
                </div>
                <div className="flex gap-6">
                  <div className="flex-1 flex flex-col gap-3">
                    <span className="text-xs font-bold uppercase text-admin-text">Remaining Requirements</span>
                    {m.tier.remaining.map((r, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-admin-navy">
                        <i className="fas fa-check-circle text-emerald-500 mt-0.5" /> {r}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 bg-[#E7EEFF]/50 border border-border/50 rounded-lg p-5 relative overflow-hidden">
                    <span className="text-xs font-bold text-primary">Diamond Perks Waiting For You:</span>
                    <ul className="mt-2 flex flex-col gap-2 text-sm text-admin-text">
                      {m.tierPerks.map((p, i) => <li key={i}>• {p}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg text-admin-navy">Recent Activity</h3>
                  <button onClick={() => setActiveTab('Point History')} className="text-xs font-semibold text-primary">Lihat Semua</button>
                </div>
                {m.recentActivity.map((a) => (
                  <div key={a.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${a.color}1A` }}>
                      <i className="fas fa-coins text-sm" style={{ color: a.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-admin-navy">{a.label}</p>
                      <p className="text-xs font-bold" style={{ color: a.color }}>{a.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Membership details */}
            <div className="bg-white rounded-xl p-8 flex flex-col gap-6">
              <h3 className="font-semibold text-lg text-admin-navy">Membership Details</h3>
              <div className="flex gap-8">
                {[
                  { label: 'JOINED DATE', value: m.membership.joinedDate, sub: m.membership.joinedDuration },
                  { label: 'HOME STORE', value: m.membership.homeStore, sub: `Regional Branch ID: ${m.membership.branchId}` },
                  { label: 'REFERRAL CODE', value: m.membership.referralCode, sub: `Used by ${m.membership.referralUsedBy} members` },
                ].map((f) => (
                  <div key={f.label} className="flex-1 border-l-4 border-primary/20 pl-4 flex flex-col gap-1">
                    <span className="text-xs font-bold uppercase text-admin-text">{f.label}</span>
                    <span className="font-bold text-base text-admin-navy">{f.value}</span>
                    <span className="text-xs text-admin-text">{f.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Point History' && (
          <PointHistoryTab
            history={pointHistoryData}
            currentBalance={m.currentBalance}
            onAdjustClick={() => setShowAdjust(true)}
          />
        )}

        {activeTab === 'Vouchers' && (
          <div className="bg-white rounded-xl p-8 text-center text-admin-text">
            {/* TODO(backend): daftar voucher yang dimiliki member — sama pola dengan RewardCard di Member Portal */}
            Belum ada voucher aktif untuk member ini.
          </div>
        )}

        {activeTab === 'Transactions' && (
          <div className="bg-white rounded-xl p-8 text-center text-admin-text">
            {/* TODO(backend): riwayat transaksi belanja member (bukan poin) */}
            Riwayat transaksi belanja akan tampil di sini.
          </div>
        )}
      </div>

      <PointAdjustmentModal open={showAdjust} member={m} onClose={() => setShowAdjust(false)} />
      <ResetLoginConfirmModal open={showReset} member={m} onClose={() => setShowReset(false)} onConfirm={() => setShowReset(false)} />
      <EditMemberDrawer open={showEdit} member={m} onClose={() => setShowEdit(false)} />
    </AdminLayout>
  );
}