import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerMember, verifyOTP } from '../services/authService';
import { useAuth, ROLE_HOME } from '../context/AuthContext';

const CATEGORIES = [
  { value: 'MEMBER', label: 'Member' },
  { value: 'RESELLER', label: 'Reseller' },
  { value: 'AGENT', label: 'Agent' },
];

export default function RegisterModal({ open, onClose }) {
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();
  const [step, setStep] = useState(1); // 1: form data, 2: verifikasi OTP
  const [form, setForm] = useState({ categoryCode: 'MEMBER', name: '', phone: '', email: '' });
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState({ loading: false, error: '' });

  if (!open) return null;

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '' });
    try {
      await registerMember(form);
      setStep(2);
      setStatus({ loading: false, error: '' });
    } catch (err) {
      setStatus({ loading: false, error: err.message });
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '' });
    try {
      const res = await verifyOTP(form.phone, otp);
      setAuth({ token: res.token, role: 'member', user: res.member });
      onClose();
      navigate(ROLE_HOME.member);
    } catch (err) {
      setStatus({ loading: false, error: err.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[420px] rounded-[24px] bg-white p-8 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-xl text-[#00504B]">
            {step === 1 ? 'Daftar Akun' : 'Verifikasi OTP'}
          </h3>
          <button onClick={onClose} className="text-[#3E4947] text-xl leading-none">&times;</button>
        </div>

        {step === 1 && (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-[#3E4947]">Daftar Sebagai</label>
              <div className="mt-1 flex gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    type="button"
                    key={c.value}
                    onClick={() => setForm((f) => ({ ...f, categoryCode: c.value }))}
                    className={`flex-1 rounded-full border py-2 text-sm font-semibold ${
                      form.categoryCode === c.value
                        ? 'border-[#00504B] bg-[#8AF4EA] text-[#00504B]'
                        : 'border-[#BFC9C6] text-[#3E4947]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <input required placeholder="Nama Lengkap" value={form.name} onChange={update('name')}
              className="rounded-xl border border-[#BFC9C6] px-4 py-3 outline-none focus:border-[#2563EB]" />
            <input required placeholder="No HP (08xxxxxxxxxx)" value={form.phone} onChange={update('phone')}
              className="rounded-xl border border-[#BFC9C6] px-4 py-3 outline-none focus:border-[#2563EB]" />
            <input placeholder="Email (opsional)" type="email" value={form.email} onChange={update('email')}
              className="rounded-xl border border-[#BFC9C6] px-4 py-3 outline-none focus:border-[#2563EB]" />

            {status.error && <p className="text-sm text-red-600">{status.error}</p>}

            <button type="submit" disabled={status.loading}
              className="mt-2 rounded-full bg-[#2DA299] py-3.5 font-bold text-white disabled:opacity-60">
              {status.loading ? 'Memproses...' : 'Daftar & Kirim OTP'}
            </button>

            <p className="mt-2 text-center text-sm text-[#3E4947]">
              Sudah punya akun?{' '}
              <a href="/member/login" className="font-semibold text-[#00504B]">Masuk</a>
            </p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerify} className="flex flex-col gap-4">
            <p className="text-sm text-[#3E4947]">
              Kode OTP telah dikirim ke <span className="font-semibold">{form.phone}</span>
            </p>
            <input
              required
              maxLength={4}
              placeholder="Kode OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="rounded-xl border border-[#BFC9C6] px-4 py-3 outline-none text-center tracking-[10px] text-xl focus:border-[#2563EB]"
            />
            {status.error && <p className="text-sm text-red-600">{status.error}</p>}
            <button type="submit" disabled={status.loading || otp.length < 4}
              className="mt-2 rounded-full bg-[#2DA299] py-3.5 font-bold text-white disabled:opacity-60">
              {status.loading ? 'Memverifikasi...' : 'Verifikasi & Masuk'}
            </button>
            <button type="button" onClick={() => setStep(1)} className="text-sm text-[#00504B] font-medium text-center">
              Ganti Data
            </button>
          </form>
        )}
      </div>
    </div>
  );
}