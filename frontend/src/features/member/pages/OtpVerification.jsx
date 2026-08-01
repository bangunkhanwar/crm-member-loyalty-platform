import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button';
import OTPInput from '../../../components/common/OTPInput';
import { verifyOTP, resendOTP } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';
// TODO(backend): ganti dengan authService.verifyOTP(phone, code) & authService.resendOTP(phone)

const OTP_DURATION = 5 * 60; // 5 menit sesuai PRD F01

export default function OtpVerification() {
  const { state } = useLocation();
  const phone = state?.phone ?? '';
  const navigate = useNavigate();
  const { login } = useAuth();
  const [otp, setOtp] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(OTP_DURATION);
  const [attempts, setAttempts] = useState(0); // maksimal 3 kali percobaan (PRD F01)

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const isExpired = secondsLeft <= 0;
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  const handleVerify = async () => {
    if (otp.length < 4 || isExpired) return;
    try {
      const data = await verifyOTP(phone, otp);
      login({
        token: data.token,
        role: 'member',
        user: data.member,
      });
      navigate('/member/dashboard', { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  const handleResend = async () => {
    if (!isExpired) return;
    try {
      await resendOTP(phone);
      setSecondsLeft(OTP_DURATION);
      setOtp('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="h-16 flex items-center justify-between px-5 bg-white">
        <span className="font-bold text-primary text-base">Elcorps Member</span>
        <span className="text-primary text-xs font-semibold">Butuh Bantuan</span>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 pb-20">
        <div className="w-full max-w-[342px] flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-8">
            {/* Icon shield-check */}
          </div>

          <h1 className="text-xl font-bold text-text-black text-center mb-3">Verifikasi Kode OTP</h1>
          <p className="text-text-soft text-center text-[15px] leading-[22px] mb-10">
            Masukan 4 digit kode yang dikirim ke nomor +62{phone}.
          </p>

          <OTPInput value={otp} onChange={setOtp} length={4} />

          <div className="w-full flex flex-col items-center gap-4 mt-6 mb-8">
            {!isExpired ? (
              <span className="text-slate font-bold text-[15px]">{minutes}:{seconds}</span>
            ) : (
              <span className="text-danger-bright font-bold text-[15px]">00:00</span>
            )}
            <div className="flex justify-center gap-1 text-[15px]">
              <span className="text-slate">Tidak menerima kode?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={!isExpired}
                className="font-bold text-primary disabled:opacity-40"
              >
                Kirim Ulang
              </button>
            </div>
          </div>

          <Button onClick={handleVerify} disabled={otp.length < 4 || isExpired}>
            Verifikasi Sekarang
          </Button>
        </div>
      </main>
    </div>
  );
}