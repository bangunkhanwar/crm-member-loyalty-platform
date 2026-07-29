// AddMemberDrawer.jsx
import { useState } from 'react';
import { registerNewMember } from '../../services/adminMemberService';

export default function AddMemberDrawer({ open, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', idNumber: '', gender: 'L', city: '', tier: 'Silver', initialBalance: 0, store: '', categoryCode: 'MEMBER' });
  const [submitting, setSubmitting] = useState(false);
  if (!open) return null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.phone) {
      alert('Nama dan Nomor HP wajib diisi!');
      return;
    }
    
    setSubmitting(true);
    try {
      const fullPhone = form.phone.startsWith('0') ? form.phone : `0${form.phone}`;
      const res = await registerNewMember(form.name, fullPhone, form.email, 'STR01', form.categoryCode);
      alert(res.message || `Berhasil mendaftarkan ${form.categoryCode}!`);
      onClose();
      window.location.reload();
    } catch (err) {
      alert(err.message || 'Gagal mendaftarkan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/40 flex justify-end">
      <div className="w-[600px] bg-white h-full flex flex-col">
        <div className="flex justify-between items-start p-6 border-b border-border">
          <div>
            <h2 className="font-hanken text-2xl font-bold text-admin-navy">Tambah Member Baru</h2>
            <p className="text-sm text-admin-text mt-1">Lengkapi data anggota untuk registrasi manual program loyalitas.</p>
          </div>
          <button onClick={onClose} className="text-admin-text"><i className="fas fa-times" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-10">
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2">
              <i className="fas fa-user text-primary" /> <h4 className="font-semibold text-lg text-admin-navy">Informasi Dasar</h4>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-admin-text uppercase">Tipe Anggota (Role Registrasi)</label>
              <select 
                value={form.categoryCode} 
                onChange={set('categoryCode')}
                className="h-[46px] px-4 border border-border rounded-xl outline-none focus:border-primary text-sm bg-bg-alt/50 font-bold text-admin-navy"
              >
                <option value="MEMBER">Member (Pelanggan Regular - Poin & Reward)</option>
                <option value="RESELLER">Reseller (Mitra Diskon Max 20%)</option>
                <option value="AGENT">Agent (Mitra Diskon Max 30%)</option>
              </select>
            </div>
            <FieldInput label="Nama Lengkap" value={form.name} onChange={set('name')} placeholder="Contoh: Ahmad Subagja" />
            <div className="flex gap-6">
              <FieldInput label="Email" value={form.email} onChange={set('email')} placeholder="ahmad@email.com" />
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs font-medium text-admin-text">Phone Number</label>
                <div className="flex h-[46px]">
                  <span className="flex items-center px-4 bg-bg-alt border border-r-0 border-border rounded-l-xl text-sm text-admin-text">+62</span>
                  <input value={form.phone} onChange={set('phone')} placeholder="8123456789" className="flex-1 px-4 border border-border rounded-r-xl outline-none text-sm" />
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2">
              <i className="fas fa-id-card text-primary" /> <h4 className="font-semibold text-lg text-admin-navy">Identitas & Lokasi</h4>
            </div>
            <FieldInput label="Member ID / NIK" value={form.idNumber} onChange={set('idNumber')} placeholder="Masukkan nomor identitas" />
            <div className="flex gap-6">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs font-medium text-admin-text">Gender</label>
                <div className="flex gap-4 h-[50px] items-center">
                  <label className="flex items-center gap-2 text-sm"><input type="radio" checked={form.gender === 'L'} onChange={() => setForm((f) => ({ ...f, gender: 'L' }))} /> Pria</label>
                  <label className="flex items-center gap-2 text-sm"><input type="radio" checked={form.gender === 'P'} onChange={() => setForm((f) => ({ ...f, gender: 'P' }))} /> Wanita</label>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs font-medium text-admin-text">City / Region</label>
                <select value={form.city} onChange={set('city')} className="h-[46px] px-4 border border-border rounded-xl outline-none text-sm">
                  <option value="">Pilih Kota</option>
                  <option>Bandung</option><option>Jakarta</option><option>Ngamprah</option>
                </select>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2">
              <i className="fas fa-star text-primary" /> <h4 className="font-semibold text-lg text-admin-navy">Pengaturan Akun & Tier</h4>
            </div>
            <div className="flex gap-6">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs font-medium text-admin-text">Membership Tier</label>
                <select value={form.tier} onChange={set('tier')} className="h-[46px] px-4 border border-border rounded-xl outline-none text-sm">
                  <option>Silver (Default)</option><option>Gold</option><option>Blue</option>
                </select>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs font-medium text-admin-text">Initial Balance</label>
                <div className="flex h-[46px]">
                  <input type="number" value={form.initialBalance} onChange={set('initialBalance')} className="flex-1 px-4 border border-border rounded-l-xl outline-none text-sm" />
                  <span className="flex items-center px-4 bg-bg-alt border border-l-0 border-border rounded-r-xl text-xs font-semibold text-admin-text">Poin</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-admin-text">Toko Terdaftar</label>
              <select value={form.store} onChange={set('store')} className="h-[46px] px-4 border border-border rounded-xl outline-none text-sm">
                <option value="">Pilih Toko</option><option>Store Bandung (TSM Bandung)</option><option>Store Ngamprah</option>
              </select>
            </div>
            <div className="flex justify-between items-center bg-bg-alt border border-border rounded-xl p-4">
              <div>
                <p className="font-semibold text-sm text-admin-navy">Kirim Notifikasi Selamat Datang</p>
                <p className="text-xs text-admin-text">SMS/WhatsApp akan dikirim ke member setelah registrasi</p>
              </div>
              <div className="w-11 h-6 bg-primary rounded-full relative"><div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5" /></div>
            </div>
          </section>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-border bg-bg-alt">
          <button onClick={onClose} className="px-6 h-[46px] rounded-xl border border-border text-sm font-semibold text-admin-text">Batal</button>
          <button 
            onClick={handleSubmit} 
            disabled={submitting}
            className="flex items-center gap-2 px-8 h-[44px] rounded-xl bg-primary text-white text-sm font-semibold shadow-card disabled:opacity-50"
          >
            <i className="fas fa-check" /> {submitting ? 'Menyimpan...' : `Simpan ${form.categoryCode}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldInput({ label, ...props }) {
  return (
    <div className="flex-1 flex flex-col gap-2">
      <label className="text-xs font-medium text-admin-text">{label}</label>
      <input {...props} className="h-[46px] px-4 border border-border rounded-xl outline-none focus:border-primary text-sm bg-bg-alt/50" />
    </div>
  );
}