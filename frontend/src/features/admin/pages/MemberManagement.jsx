import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout';
import KpiCard from '../../../components/admin/KpiCard';
import AddMemberDrawer from '../../../components/admin/AddMemberDrawer';
import ImportDataModal from '../../../components/admin/ImportDataModal';
import { getMemberList } from '../../../services/adminMemberService';

const TIER_COLOR = { Gold: { bg: '#DEE8FF', text: '#3D4947' }, Silver: { bg: 'rgba(0,88,190,0.1)', text: '#0058BE' }, Blue: { bg: 'rgba(0,88,190,0.1)', text: '#0058BE' }, Grey: { bg: 'rgba(188,201,199,0.2)', text: '#6D7A78' } };

export default function MemberManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [dbMembers, setDbMembers] = useState([]);

  useEffect(() => {
    getMemberList(search)
      .then((res) => {
        if (res.success) setDbMembers(res.data);
      })
      .catch((err) => console.error(err));
  }, [search]);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center px-9 pl-5">
        <h2 className="font-bold text-[32px] text-text-black">Member Management</h2>
      </div>

      <div className="p-8 flex flex-col gap-6">
        <div className="flex gap-6">
          <KpiCard icon="fa-users" title="TOTAL MEMBER" accent="gold" value={dbMembers.length.toString()} growthLabel="Realtime DB" footerLabel="Total Terdaftar" footerValue={dbMembers.length} />
          <KpiCard icon="fa-user-check" title="ACTIVE MEMBER" accent="teal" value={dbMembers.length.toString()} growthLabel="100% Rate" footerLabel="Member Retention Rate" footerValue="100%" footerValueColor="#34C759" />
          <KpiCard icon="fa-bullseye" title="MONTHLY GOAL" accent="red" value="100%" growthLabel="+10%" footerLabel="REALTIME DB MEMBERS" footerValue="" />
        </div>

        <div className="bg-white border border-border rounded-xl shadow-card">
          <div className="flex justify-between items-center p-4 gap-4 border-b border-border">
            <div className="flex-1 relative max-w-[320px]">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-xs text-admin-text" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari Member..."
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-bg-alt border border-border text-sm outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowImport(true)} className="flex items-center gap-2 px-4 h-9 rounded-lg border border-border text-sm font-medium text-admin-navy">
                <i className="fas fa-upload text-xs" /> Import
              </button>
              <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 h-9 rounded-lg bg-secondary text-white text-sm font-medium">
                <i className="fas fa-plus text-xs" /> Tambah Member
              </button>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F0F3FF] text-left">
                {['Member', 'Store', 'Tanggal Daftar', 'Tier', ''].map((h) => (
                  <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-admin-text">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dbMembers.map((m) => {
                const tc = TIER_COLOR[m.tier] || TIER_COLOR.Gold;
                return (
                  <tr key={m.memberCode} className="border-t border-border hover:bg-bg-alt cursor-pointer" onClick={() => navigate(`/admin/members/${m.memberCode}`)}>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center font-bold text-xs text-secondary">
                        {m.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-admin-navy">{m.name}</span>
                        <span className="text-xs text-admin-text">{m.memberCode} • {m.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-admin-text">{m.storeCode || 'STR01'}</td>
                    <td className="px-6 py-4 text-admin-text">{new Date(m.registrationDate).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: tc.bg, color: tc.text }}>{m.tier}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-secondary">{m.totalPoints.toLocaleString('id-ID')} Poin</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex justify-between items-center p-4 bg-bg-alt/30 border-t border-border text-sm text-admin-text">
            <span>Menampilkan {dbMembers.length} member</span>
          </div>
        </div>
      </div>

      <AddMemberDrawer open={showAdd} onClose={() => setShowAdd(false)} />
      <ImportDataModal open={showImport} onClose={() => setShowImport(false)} />
    </AdminLayout>
  );
}