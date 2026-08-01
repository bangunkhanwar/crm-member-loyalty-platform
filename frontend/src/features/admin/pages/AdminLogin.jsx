import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginAdmin } from '../../../services/AdminAuthService';
import { useAuth } from '../../../context/AuthContext';
import logo from "../../../assets/elcorps.png";

export default function AdminLogin() {
  const { login, auth } = useAuth();
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('username'); // 'username' atau 'phone'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

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
        login({
          token: res.token,
          role: res.user.role.toLowerCase(),
          user: res.user,
        });
        setShouldRedirect(true);
      } else {
        setError(res.message || 'Login gagal');
      }
    } catch (err) {
      setError(err.message || 'Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  // di dalam komponen, setelah semua state
  useEffect(() => {
    if (shouldRedirect && auth && auth.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [shouldRedirect, auth, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-white font-['Plus_Jakarta_Sans']">
      {/* TopNavBar */}
      <header className="sticky top-0 z-40 border-b border-[#BEC9C7]/30 bg-white/70 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-6 lg:px-20">
          <div className="flex items-center gap-2 h-[42px]">
            <img src={logo} alt="Elcorps" className="h-full w-auto" />
            <span className="flex items-center text-base font-bold text-[#3E4947] leading-none relative top-[7px]">
              Member
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 py-10 lg:py-10">
       <div className="mx-auto flex w-full max-w-[1280px] flex-col lg:flex-row items-center gap-10 px-6 lg:px-20">
          {/* Hero Text - Kiri */}
          <div className="hidden lg:flex flex-1 flex-col gap-8">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight tracking-tight text-[#00504B] max-w-[560px]">
              Jadi Member Elzatta & Dauky, Belanja Lebih Untung Setiap Hari
            </h1>
            <p className="text-lg leading-7 text-[#3E4947] max-w-[515px]">
              Nikmati pengalaman belanja eksklusif dengan diskon hingga 30%, poin reward melimpah, dan akses awal ke koleksi fashion muslim terbaru.
            </p>
          </div>

          {/* Login Card - Kanan */}
          <div className="flex-1 flex justify-center items-center w-full lg:w-auto">
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
                <div className="flex flex-col items-center gap-[6px] pb-10">
                  <h2 className="font-bold text-xl leading-7 text-[#191C1E]">Masuk</h2>
                  <p className="text-[15px] leading-[18px] text-[#64748B] max-w-[320px] text-center">
                    Gunakan username yang terdaftar
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full">
                  <div className="flex flex-col gap-3 w-full">
                    {/* Tabs */}
                    <div className="flex justify-center gap-1.5 w-full mt-[-18px]">
                     <button
                        type="button"
                        onClick={() => setLoginMethod('username')}
                        className={`text-[10px] leading-[15px] font-bold ${
                          loginMethod === 'username' ? 'underline text-[#2DA299]' : 'text-[#94A3B8]'
                        }`}
                      >
                        USERNAME
                      </button>
                      <span className="text-[10px] leading-[15px] font-bold text-[#94A3B8]">atau</span>
                      <button
                        type="button"
                        onClick={() => setLoginMethod('phone')}
                        className={`text-[10px] leading-[15px] font-bold ${
                          loginMethod === 'phone' ? 'underline text-[#2DA299]' : 'text-[#94A3B8]'
                        }`}
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
                        {/* Ikon kiri */}
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </span>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder={loginMethod === 'phone' ? 'Masukan Nomor Telepon Anda' : 'Masukan Username anda'}
                          className="w-full pl-11 pr-4 py-[16.5px] border border-[#BCC9C7] rounded-xl text-base font-medium text-[#3D4947] placeholder:text-[#3D4947]/40 outline-none focus:border-[#2563EB]"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="px-1 text-xs font-bold tracking-[0.6px] text-[#3D4947]">
                        KATA SANDI
                      </label>
                      <div className="relative">
                        {/* Ikon kiri */}
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0110 0v4" />
                          </svg>
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Masukan Kata Sandi Anda"
                          className="w-full pl-11 pr-12 py-[16.5px] border border-[#BCC9C7] rounded-xl text-base font-medium text-[#3D4947] placeholder:text-[#3D4947]/40 outline-none focus:border-[#2563EB]"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#3D4947] transition-colors"
                        >
                          {showPassword ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          )}
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
                  <Link
                    to="/"
                    replace
                    className="relative w-full max-w-[280px] h-12 bg-white rounded-full text-[#006A64] font-bold text-base flex items-center justify-center border-2 border-[#006A64] hover:bg-[#006A64]/10 transition-colors"
                  >
                    <span className="relative z-10">Kembali ke Halaman Awal</span>
                  </Link>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}