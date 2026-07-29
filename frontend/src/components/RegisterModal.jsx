import { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../services/authService';

const ROLES = [
  { value: 'member', label: 'Member' },
  { value: 'toko', label: 'Agent / Reseller' },
];

export default function RegisterModal({ open, onClose }) {
  const [form, setForm] = useState({ role: 'member', name: '', phone: '', email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  if (!open) return null;

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });
    try {
      const res = await register(form);
      setStatus({ loading: false, error: '', success: res.message });
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: '' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[420px] rounded-[24px] bg-white p-8 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-xl text-[#00504B]">Daftar Akun</h3>
          <button onClick={onClose} className="text-[#3E4947] text-xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-[#3E4947]">Daftar Sebagai</label>
            <div className="mt-1 flex gap-2">
              {ROLES.map((r) => (
                <button
                  type="button"
                  key={r.value}
                  onClick={() => setForm((f) => ({ ...f, role: r.value }))}
                  className={`flex-1 rounded-full border py-2 text-sm font-semibold ${
                    form.role === r.value
                      ? 'border-[#00504B] bg-[#8AF4EA] text-[#00504B]'
                      : 'border-[#BFC9C6] text-[#3E4947]'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <input required placeholder="Nama Lengkap" value={form.name} onChange={update('name')}
            className="rounded-xl border border-[#BFC9C6] px-4 py-3 outline-none focus:border-[#2563EB]" />
          <input required placeholder="No HP" value={form.phone} onChange={update('phone')}
            className="rounded-xl border border-[#BFC9C6] px-4 py-3 outline-none focus:border-[#2563EB]" />
          <input required type="email" placeholder="Email" value={form.email} onChange={update('email')}
            className="rounded-xl border border-[#BFC9C6] px-4 py-3 outline-none focus:border-[#2563EB]" />
          <input required type="password" placeholder="Password" value={form.password} onChange={update('password')}
            className="rounded-xl border border-[#BFC9C6] px-4 py-3 outline-none focus:border-[#2563EB]" />

          {status.error && <p className="text-sm text-red-600">{status.error}</p>}
          {status.success && <p className="text-sm text-green-600">{status.success}</p>}

          <button type="submit" disabled={status.loading}
            className="mt-2 rounded-full bg-[#2DA299] py-3.5 font-bold text-white disabled:opacity-60">
            {status.loading ? 'Memproses...' : 'Daftar Sekarang'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[#3E4947]">
          Sudah punya akun?{' '}
          <Link to="/member/login" className="font-semibold text-[#00504B]">Masuk</Link>
        </p>
      </div>
    </div>
  );
}