import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../../services/AdminAuthService';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('username'); // 'username' atau 'phone'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = loginMethod === 'phone' 
        ? { phone: username, password } 
        : { username, password };
      const res = await loginAdmin(payload);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setError(res.message || 'Login gagal');
      }
    } catch (err) {
      setError(err.message || 'Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-['Plus_Jakarta_Sans']">
      {/* TopNavBar */}
      <header className="sticky top-0 z-40 border-b border-[#BEC9C7]/30 bg-white/70 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-20">
          <div className="flex items-center gap-1.5">
            <div className="w-[120px] h-[42px] bg-[url('/assets/hero.png')] bg-contain bg-no-repeat bg-center" />
            <span className="text-base font-bold text-[#3E4947]">Member</span>
          </div>
          <a href="/" className="text-sm font-bold text-[#006A64] tracking-[0.14px]">
            Butuh Bantuan
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center bg-white/10 py-[100px]">
        <div className="flex flex-row items-center gap-[25px] max-w-[1280px] w-full px-20">
          {/* Hero Text - Kiri */}
          <div className="flex-1 flex flex-col gap-8 px-4">
            <h1 className="font-bold text-[64px] leading-[72px] tracking-[-1.28px] text-[#00504B] max-w-[515px]">
              Jadi Member Elzatta, Belanja Lebih Untung Setiap Hari
            </h1>
            <p className="text-lg leading-7 text-[#3E4947] max-w-[515px]">
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
                    {/* Ikon login */}
                    <svg className="w-[54px] h-[54px] -scale-x-100" viewBox="0 0 54 54" fill="none">
                      <rect x="18" y="14" width="24" height="22" rx="3" stroke="#006A64" strokeWidth="2.5" />
                      <path d="M22 26l4 3 7-6" stroke="#006A64" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="36" cy="18" r="8" fill="#006A64" stroke="white" strokeWidth="2" />
                      <path d="M34.5 17l1.5 1.5 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                {/* Title & Body */}
                <div className="flex flex-col items-center gap-[11px] pb-10">
                  <h2 className="font-bold text-xl leading-7 text-[#191C1E]">Masuk</h2>
                  <p className="text-[15px] leading-[22px] text-[#64748B] max-w-[320px] text-center">
                    Gunakan username yang terdaftar
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-8 w-full">
                  <div className="flex flex-col gap-3 w-full">
                    {/* Tabs */}
                    <div className="flex justify-center gap-1.5 w-full">
                      <button
                        type="button"
                        onClick={() => setLoginMethod('username')}
                        className="text-[10px] leading-[15px] font-bold text-[#94A3B8]"
                      >
                        USERNAME
                      </button>
                      <span className="text-[10px] leading-[15px] font-bold text-[#94A3B8]">atau</span>
                      <button
                        type="button"
                        onClick={() => setLoginMethod('phone')}
                        className="text-[10px] leading-[15px] font-bold underline text-[#2DA299]"
                      >
                        Nomor Telepon
                      </button>
                    </div>

                    {/* Username Field */}
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="px-1 text-xs font-bold tracking-[0.6px] text-[#3D4947]">
                        {loginMethod === 'phone' ? 'NOMOR TELEPON' : 'USERNAME'}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder={loginMethod === 'phone' ? 'Masukan Nomor Telepon Anda' : 'Masukan Username anda'}
                          className="w-full px-4 py-[16.5px] border border-[#BCC9C7] rounded-xl text-base font-medium text-[#3D4947] placeholder:text-[#3D4947]/40 outline-none focus:border-[#2563EB]"
                          required
                        />
                        {loginMethod === 'username' && (
                          <span className="absolute right-4 top-1/2 -translate-y-1/2">
                            <svg width="22" height="15" viewBox="0 0 22 15" fill="none">
                              <rect width="22" height="15" rx="2" fill="#3D4947" opacity="0.3" />
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="px-1 text-xs font-bold tracking-[0.6px] text-[#3D4947]">
                        KATA SANDI
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Masukan Kata Sandi Anda"
                          className="w-full px-4 py-[16.5px] border border-[#BCC9C7] rounded-xl text-base font-medium text-[#3D4947] placeholder:text-[#3D4947]/40 outline-none focus:border-[#2563EB]"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          <svg width="22" height="15" viewBox="0 0 22 15" fill="none">
                            <rect width="22" height="15" rx="2" fill="#3D4947" opacity="0.3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <p className="text-sm text-red-600 text-center w-full">{error}</p>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full max-w-[280px] h-12 bg-[#006A64] rounded-full text-white font-bold text-base flex items-center justify-center disabled:opacity-60 hover:opacity-90 transition-opacity"
                  >
                    <div className="absolute inset-0 rounded-full" />
                    <span className="relative z-10">
                      {loading ? 'Memproses...' : 'Login'}
                    </span>
                  </button>
                </form>

                {/* Secondary Links */}
                <div className="flex flex-col items-center pt-5 w-full">
                  <p className="text-[15px] leading-[22px] text-[#94A3B8] text-center">
                    Atau belum punya akun?{' '}
                    <button
                      onClick={() => navigate('/')}
                      className="font-semibold text-[#00504B] underline"
                    >
                      Daftar Sekarang
                    </button>
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
    </div>
  );
}