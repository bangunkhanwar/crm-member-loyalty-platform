// EditMemberDrawer.jsx — sama struktur dengan AddMemberDrawer, tapi pre-filled + field terkunci
import { useState } from 'react';

export default function EditMemberDrawer({ open, member, onClose }) {
  const [form, setForm] = useState({ name: member?.name || '', email: member?.email || '', phone: member?.phone || '' });
  if (!open) return null;

  const handleSubmit = async () => {
    // TODO(backend): PUT /admin/members/:id { ...form }
    onClose();
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
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="h-[46px] px-4 border border-border rounded-xl outline-none text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-admin-text">Nomor HP</label>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="h-12 px-4 border-2 border-red-500 rounded-xl outline-none text-sm text-red-500"
            />
            <p className="text-xs font-semibold text-red-500">Nomor HP sudah terdaftar pada member lain</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-admin-text">Email</label>
            <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="h-[46px] px-4 border border-border rounded-xl outline-none text-sm" />
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-border bg-bg-alt">
          <button onClick={onClose} className="px-5 h-9 rounded-lg border border-border text-sm text-admin-text">Batal</button>
          <button onClick={handleSubmit} className="px-8 h-9 rounded-lg text-sm font-semibold text-white opacity-60 cursor-not-allowed" style={{ background: '#BCC9C7' }}>
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}