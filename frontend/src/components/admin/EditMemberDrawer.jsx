import { useState, useEffect } from 'react';
import { updateMember } from '../../services/adminMemberService';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';

export default function EditMemberDrawer({ open, member, onClose }) {
  const [form, setForm] = useState({
    name: member?.name || '',
    email: member?.email || '',
    phone: member?.phone || '',
    city: member?.city || '',
  });
  const [submitting, setSubmitting] = useState(false);

  // sync ulang saat member berubah (drawer dibuka untuk member berbeda)
  useEffect(() => {
    setForm({
      name: member?.name || '',
      email: member?.email || '',
      phone: member?.phone || '',
      city: member?.city || '',
    });
  }, [member]);
  useLockBodyScroll(open);
  if (!open) return null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name) {
      alert('Nama wajib diisi!');
      return;
    }
    setSubmitting(true);
    try {
      await updateMember(member.memberCode, form);
      alert('Data member berhasil diperbarui.');
      onClose();
      window.location.reload();
    } catch (err) {
      alert(err.message || 'Gagal memperbarui data member.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/40 flex justify-end">
      <div className="w-[520px] bg-white h-full flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="font-hanken text-xl font-semibold text-admin-navy">Ubah Data Member</h2>
          <button onClick={onClose} className="text-admin-text"><i className="fas fa-times" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-admin-text">Nama Lengkap</label>
            <input value={form.name} onChange={set('name')} className="h-[46px] px-4 border border-border rounded-xl outline-none text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-admin-text">Nomor HP</label>
            <input value={form.phone} onChange={set('phone')} className="h-[46px] px-4 border border-border rounded-xl outline-none text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-admin-text">Email</label>
            <input value={form.email} onChange={set('email')} className="h-[46px] px-4 border border-border rounded-xl outline-none text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-admin-text">Kota</label>
            <input value={form.city} onChange={set('city')} className="h-[46px] px-4 border border-border rounded-xl outline-none text-sm" />
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-border bg-bg-alt">
          <button onClick={onClose} className="px-5 h-9 rounded-lg border border-border text-sm text-admin-text">Batal</button>
          <button onClick={handleSubmit} disabled={submitting} className="px-8 h-9 rounded-lg text-sm font-semibold text-white bg-primary disabled:opacity-50">
            {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}