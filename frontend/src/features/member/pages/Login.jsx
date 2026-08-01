import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { requestOTP } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';
import logo from '../../../assets/elcorps.png';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await requestOTP(phone);
      navigate('/member/otp-verification', { state: { phone } });
    } catch (err) {
      // Ambil pesan dari response server jika ada, jika tidak fallback ke err.message
      const message =
        err.response?.data?.message ||
        err.message ||
        'Gagal mengirim OTP';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-['Plus_Jakarta_Sans']">
      
      {/* 2. Top Navbar (Admin/Landing Style) */}
      <header className="sticky top-0 z-40 border-b border-[#BEC9C7]/30 bg-white/70 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-4 lg:px-20">
          <div className="flex items-center gap-2 h-[42px]">
            <img src={logo} alt="Elcorps" className="h-full w-auto" />
            <span className="flex items-center text-base font-bold text-[#3E4947] relative top-[7px]">
              Member
            </span>
          </div>
        </div>
      </header>

      {/* 3. Main Layout (Hero Style) */}
      <main className="flex-1 pt-0 md:pt-4 lg:pt-6 pb-6">
        <div className="mx-auto w-full max-w-[1280px] px-4 lg:px-20">
          <div className="flex flex-col lg:flex-row items-center gap-10 min-h-[calc(100vh-80px)]">
          
          {/* 4. Hero Text (Kiri) - Hanya muncul di Desktop */}
          <div className="hidden lg:flex flex-1 flex-col gap-8">
            <h1 className="font-bold text-[64px] leading-[72px] tracking-[-1.28px] text-[#00504B] max-w-[515px]">
              Jadi Member Elzatta & Dauky, Belanja Lebih Untung Setiap Hari
            </h1>
            <p className="text-lg leading-7 text-[#3E4947] max-w-[515px]">
              Nikmati pengalaman belanja eksklusif dengan diskon hingga 30%, poin reward melimpah, dan akses awal ke koleksi fashion muslim terbaru.
            </p>
          </div>

          {/* 5. Card Container (Kanan) */}
          <div className="flex-1 flex justify-center lg:justify-end items-center w-full lg:w-auto">
            <div className="bg-white shadow-[-10px_10px_20px_rgba(0,0,0,0.25)] rounded-3xl p-6 w-full max-w-[400px]">
              
              {/* 6. Icon Section */}
              <div className="flex flex-col items-center pb-8">
                <div className="w-16 h-16 flex items-center justify-center bg-[#006A64]/[0.05] rounded-2xl relative">
                  <svg width="28" height="28" fill="none" stroke="#006A64" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 16.92V19a2 2 0 01-2.18 2A19.8 19.8 0 013 5.18 2 2 0 015 3h2.09a2 2 0 012 1.72c.12.89.32 1.76.6 2.59a2 2 0 01-.45 2.11L8.09 10.91a16 16 0 006 6l1.49-1.49a2 2 0 012.11-.45c.83.28 1.7.48 2.59.6A2 2 0 0122 16.92z" />
                  </svg>
                  {/* Badge Kecil */}
                  <div className="absolute w-5 h-5 right-0 top-0 bg-[#006A64] border-2 border-white rounded-full flex justify-center items-center z-10 transform -translate-x-1/4 -translate-y-1/4">
                    <div className="w-2.5 h-2 bg-white rounded-full" />
                  </div>
                </div>
              </div>

              {/* 7. Title & Subtitle */}
              <div className="flex flex-col items-center gap-[11px] pb-10 w-full">
                <h2 className="font-bold text-xl leading-7 text-[#191C1E] text-center">
                  Masuk
                </h2>
                <p className="text-[15px] leading-[22px] text-[#64748B] text-center max-w-[320px]">
                  Gunakan nomor telepon aktif untuk dapatkan reward dan penawaran.
                </p>
              </div>

              {/* Form Container */}
              {error && <p className="text-sm text-red-600 text-center pb-2">{error}</p>}

                <form onSubmit={handleRequestOTP} className="flex flex-col items-center w-full gap-4">
                  {/* 8. Input Nomor HP (Figma Style) */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="px-1 text-[10px] font-bold tracking-[1px] text-[#94A3B8] uppercase">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Masukan Nomor Telepon Anda"
                      className="w-full px-4 py-[16.5px] border border-[#BCC9C7] rounded-xl text-base font-medium text-[#3D4947] placeholder:text-[#3D4947]/40 outline-none focus:border-[#2563EB] transition-colors"
                      required
                    />
                  </div>

                  {/* 10. Button (Figma Style) */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full max-w-[280px] h-12 bg-[#006A64] rounded-full text-white font-bold text-base flex items-center justify-center disabled:opacity-60 hover:opacity-90 transition-opacity mb-3"
                  >
                    {loading ? 'Mengirim OTP...' : 'Kirim OTP'}
                  </button>
                  <Link
                    to="/"
                    replace
                    className="w-full max-w-[280px] h-12 bg-white rounded-full text-[#006A64] font-bold text-base flex items-center justify-center border-2 border-[#006A64] hover:bg-[#006A64]/10 transition-colors"
                  >
                    Kembali ke Halaman Awal
                  </Link>
                </form>
              

              {/* 11. Secondary Text (Bawah) */}
              <div className="flex flex-col items-center pt-5 w-full mt-6">
                <p className="text-[15px] leading-[22px] text-[#94A3B8] text-center">
                  Belum punya akun?{' '}
                  <Link to="/" className="font-semibold text-[#00504B] underline">
                    Daftar Sekarang
                  </Link>
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