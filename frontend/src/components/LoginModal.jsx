import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestOTP, verifyOTP } from '../services/authService';
import { useAuth, ROLE_HOME } from '../context/AuthContext';

export default function LoginModal({ open, onClose, onSwitchToRegister }) {
  const [step, setStep] = useState(1); // 1 = input HP, 2 = input OTP
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();

  if (!open) return null;

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await requestOTP(phone);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Gagal mengirim OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await verifyOTP(phone, otp);
            // data dari authService sudah berisi token dan member
            const authData = {
            token: data.token,
            role: data.member.role || 'member',
            user: data.member,
            };
            setAuth(authData); // menyimpan ke context dan localStorage
            onClose();
            navigate(ROLE_HOME[authData.role] || '/member/dashboard');
        } catch (err) {
            setError(err.message || 'OTP tidak valid');
        } finally {
            setLoading(false);
        }
    };

  const handleClose = () => {
    setStep(1);
    setPhone('');
    setOtp('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[420px] rounded-[24px] bg-white p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-xl text-[#00504B]">
            {step === 1 ? 'Masuk ke Akun' : 'Verifikasi OTP'}
          </h3>
          <button onClick={handleClose} className="text-[#3E4947] text-xl leading-none">&times;</button>
        </div>

        {step === 1 && (
          <form onSubmit={handleRequestOTP} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-[#3E4947]">Nomor HP</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#BFC9C6] px-4 py-3 outline-none focus:border-[#2563EB]"
                placeholder="0812xxxxxx"
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-[#2DA299] py-3.5 font-bold text-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] disabled:opacity-60"
            >
              {loading ? 'Mengirim OTP...' : 'Lanjut'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
            <p className="text-sm text-[#3E4947]">
              Kode OTP telah dikirim ke <span className="font-semibold">{phone}</span>
            </p>
            <div>
              <label className="text-sm font-medium text-[#3E4947]">Kode OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#BFC9C6] px-4 py-3 outline-none focus:border-[#2563EB]"
                placeholder="123456"
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-[#2DA299] py-3.5 font-bold text-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] disabled:opacity-60"
            >
              {loading ? 'Memverifikasi...' : 'Masuk'}
            </button>
            <button
              type="button"
              onClick={() => { setStep(1); setError(''); }}
              className="text-sm text-[#00504B] font-medium text-center"
            >
              Ganti Nomor HP
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-sm text-[#3E4947]">
          Belum punya akun?{' '}
          <button onClick={onSwitchToRegister} className="font-semibold text-[#00504B]">
            Daftar Sekarang
          </button>
        </p>
      </div>
    </div>
  );
}