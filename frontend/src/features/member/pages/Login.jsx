import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestOTP, verifyOTP } from '../../../services/authService';
import { useAuth, ROLE_HOME } from '../../../context/AuthContext';

function OTPInput({ value, onChange, disabled }) {
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
  }, []);

  const handleChange = (index, e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 1) return;
    const newOtp = value.split('');
    newOtp[index] = val;
    const newOtpStr = newOtp.join('').slice(0, 4);
    onChange(newOtpStr);
    if (val && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 4);
    if (paste.length === 4) {
      onChange(paste);
      inputRefs.current[3]?.focus();
    }
  };

  const otpArray = value.split('').concat(Array(4 - value.length).fill(''));

  return (
    <div className="flex justify-center gap-3">
      {otpArray.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(idx, e)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={idx === 0 ? handlePaste : undefined}
          className="w-16 h-16 bg-[#F2F4F6] border-2 border-[#E0E3E5] rounded-lg text-center text-2xl font-bold text-[#191C1E] outline-none focus:border-[#2563EB] focus:shadow-[0_0_0_1px_#2563EB] transition-colors disabled:opacity-50"
        />
      ))}
    </div>
  );
}

export default function MemberLogin() {
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 menit
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (step === 2 && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [step, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await requestOTP(phone);
      setStep(2);
      setTimer(300);
      setCanResend(false);
      setOtp('');
    } catch (err) {
      setError(err.message || 'Gagal mengirim OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 4) {
      setError('Masukkan 4 digit kode OTP');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await verifyOTP(phone, otp);
      const authData = {
        token: data.token,
        role: data.member?.role || 'member',
        user: data.member,
      };
      setAuth(authData);
      navigate(ROLE_HOME[authData.role] || '/member/dashboard');
    } catch (err) {
      setError(err.message || 'OTP tidak valid');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setLoading(true);
    try {
      await requestOTP(phone);
      setTimer(300);
      setCanResend(false);
      setOtp('');
    } catch (err) {
      setError(err.message || 'Gagal mengirim ulang OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-['Plus_Jakarta_Sans']">
      {/* TopNavBar */}
      <header className="sticky top-0 z-40 border-b border-[#BEC9C7]/30 bg-white/70 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-6 lg:px-20">
          <Link to="/" className="flex items-center gap-1.5">
            <div className="w-[120px] h-[42px] bg-[url('/assets/logo.png')] bg-contain bg-no-repeat bg-center" />
            <span className="text-base font-bold text-[#3E4947]">Member</span>
          </Link>
          <Link to="/" className="text-sm font-bold text-[#006A64] tracking-[0.14px]">
            Butuh Bantuan
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center py-12 px-6 lg:px-20">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-[25px] max-w-[1280px] w-full">
          {/* Hero Text - Kiri */}
          <div className="flex-1 flex flex-col gap-8 px-4">
            <h1 className="font-bold text-4xl lg:text-[64px] lg:leading-[72px] tracking-[-1.28px] text-[#00504B] max-w-[515px]">
              Jadi Member Elzatta, Belanja Lebih Untung Setiap Hari
            </h1>
            <p className="text-base lg:text-lg leading-7 text-[#3E4947] max-w-[515px]">
              Nikmati pengalaman belanja eksklusif dengan diskon hingga 30%, poin reward melimpah, dan akses perdana ke koleksi hijab terbaru kami.
            </p>
          </div>

          {/* Login Card - Kanan */}
          <div className="flex-1 flex justify-center items-center">
            <div className="bg-white shadow-[-10px_10px_20px_rgba(0,0,0,0.25)] rounded-3xl p-6 w-full max-w-[400px]">
              <div className="flex flex-col items-center gap-0">
                {/* Icon */}
                <div className="flex flex-col items-center pb-8">
                  <div className="w-16 h-16 flex items-center justify-center bg-[#006A64]/[0.03] rounded-2xl -scale-x-100">
                    {step === 1 ? (
                      <svg className="w-[54px] h-[54px] -scale-x-100" viewBox="0 0 54 54" fill="none">
                        <rect x="18" y="14" width="24" height="22" rx="3" stroke="#006A64" strokeWidth="2.5" />
                        <path d="M22 26l4 3 7-6" stroke="#006A64" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="36" cy="18" r="8" fill="#006A64" stroke="white" strokeWidth="2" />
                        <path d="M34.5 17l1.5 1.5 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg className="w-[54px] h-[54px] -scale-x-100" viewBox="0 0 54 54" fill="none">
                        <rect x="12" y="10" width="30" height="34" rx="4" stroke="#006A64" strokeWidth="2.5" />
                        <path d="M18 27h18" stroke="#006A64" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="36" cy="18" r="8" fill="#006A64" stroke="white" strokeWidth="2" />
                        <path d="M34.5 17l1.5 1.5 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Title & Body */}
                <div className="flex flex-col items-center gap-[11px] pb-10">
                  <h2 className="font-bold text-xl leading-7 text-[#191C1E]">
                    {step === 1 ? 'Masuk' : 'Verifikasi Kode OTP'}
                  </h2>
                  <p className="text-[15px] leading-[22px] text-[#64748B] max-w-[320px] text-center">
                    {step === 1
                      ? 'Gunakan nomor telepon aktif Anda untuk mendapatkan poin reward dan penawaran eksklusif.'
                      : 'Masukan 4 digit kode yang dikirim ke nomor Anda.'}
                  </p>
                </div>

                {/* Form */}
                {step === 1 ? (
                  <form onSubmit={handleRequestOTP} className="flex flex-col items-center gap-8 w-full">
                    <div className="flex flex-col gap-3 w-full">
                      <div className="flex justify-center gap-1.5 w-full">
                        <span className="text-[10px] leading-[15px] font-bold text-[#94A3B8]">NOMOR TELEPON</span>
                        <span className="text-[10px] leading-[15px] font-bold text-[#94A3B8]">atau</span>
                        <button
                          type="button"
                          className="text-[10px] leading-[15px] font-bold underline text-[#2DA299]"
                        >
                          USERNAME
                        </button>
                      </div>
                      <div className="flex items-center w-full h-14 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl overflow-hidden">
                        <div className="flex items-center h-full px-4 border-r border-[#E2E8F0] bg-transparent">
                          <span className="font-bold text-base text-[#191C1E]">+62</span>
                        </div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="8xxxxxxxx"
                          className="w-full h-full px-4 bg-transparent outline-none text-base font-medium text-[#191C1E] placeholder:text-[#CBD5E1]"
                          required
                        />
                      </div>
                    </div>

                    {error && <p className="text-sm text-red-600 text-center w-full">{error}</p>}

                    <button
                      type="submit"
                      disabled={loading || phone.length < 8}
                      className="w-full max-w-[280px] h-14 bg-[#006A64] rounded-full text-white font-bold text-base flex items-center justify-center gap-3 disabled:opacity-60 hover:opacity-90 transition-opacity shadow-[0px_10px_15px_-3px_rgba(0,106,100,0.2)]"
                    >
                      {loading ? 'Mengirim...' : 'Kirim OTP'}
                      {!loading && (
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                          <path d="M1 6.5h10M7 2.5l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP} className="flex flex-col items-center gap-8 w-full">
                    <OTPInput value={otp} onChange={setOtp} disabled={loading} />

                    <div className="flex flex-col items-center gap-4 w-full">
                      <div className="text-[15px] font-bold text-[#545F73]">
                        {formatTime(timer)}
                      </div>
                      <div className="flex items-center justify-center gap-1 text-[15px]">
                        <span className="text-[#545F73]">Tidak menerima kode?</span>
                        {canResend ? (
                          <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={loading}
                            className="font-bold text-[#006A64] hover:underline disabled:opacity-50"
                          >
                            Kirim Ulang
                          </button>
                        ) : (
                          <span className="text-[#94A3B8]">Kirim Ulang</span>
                        )}
                      </div>
                    </div>

                    {error && <p className="text-sm text-red-600 text-center w-full">{error}</p>}

                    <button
                      type="submit"
                      disabled={loading || otp.length !== 4}
                      className="w-full max-w-[280px] h-14 bg-[#006A64] rounded-full text-white font-bold text-base flex items-center justify-center gap-3 disabled:opacity-60 hover:opacity-90 transition-opacity shadow-[0px_10px_15px_-3px_rgba(0,106,100,0.2)]"
                    >
                      {loading ? 'Memverifikasi...' : 'Verifikasi Sekarang'}
                      {!loading && (
                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none">
                          <path d="M1 5.5l3.5 3.5L11 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </form>
                )}

                {/* Footer Links */}
                <div className="flex flex-col items-center pt-5 w-full">
                  <p className="text-[15px] leading-[22px] text-[#94A3B8] text-center">
                    Atau belum punya akun?{' '}
                    <Link to="/" className="font-semibold text-[#00504B] underline">
                      Daftar Sekarang
                    </Link>
                  </p>
                  <p className="pt-5 text-[15px] leading-[22px] text-[#94A3B8] text-center">
                    Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan kami.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#BFC9C6]/30 px-6 lg:px-20 py-8">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col lg:flex-row justify-between gap-8">
          <div className="flex flex-col gap-4 max-w-[380px]">
            <p className="font-bold text-base text-[#003734]">EliteMember</p>
            <p className="text-sm text-[#3E4947]">
              Program loyalitas resmi Elcorps untuk pengalaman belanja lebih untung.
            </p>
            <div className="flex gap-4 pt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border border-[#BFC9C6] flex items-center justify-center">
                  <div className="w-4 h-4 bg-[#003734]" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-16">
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold tracking-[0.14px] text-[#003734]">Links</h4>
              <a href="#" className="text-base text-[#3E4947]">Privacy Policy</a>
              <a href="#" className="text-base text-[#3E4947]">Terms of Service</a>
              <a href="#" className="text-base text-[#3E4947]">Contact Support</a>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold tracking-[0.14px] text-[#003734]">Portal</h4>
              <Link to="/" className="text-base text-[#3E4947]">Member Portal</Link>
              <Link to="/admin/login" className="text-base font-bold text-[#3E4947]">Login Portal</Link>
              <a href="#" className="text-base text-[#3E4947]">Store Locator</a>
              <a href="#" className="text-base text-[#3E4947]">Career</a>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 w-full max-w-[1280px] border-t border-[#BFC9C6]/20 pt-6 text-sm text-[#3E4947]">
          © 2024 EliteMember Membership Program. All rights reserved.
        </div>
      </footer>
    </div>
  );
}