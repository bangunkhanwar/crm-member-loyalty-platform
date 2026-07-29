// src/pages/LandingPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { Gift, Star, Crown, Camera, Music } from "lucide-react";
import RegisterModal from '../components/RegisterModal';
import bannerImg from '../assets/banner.png';
import logoImg from '../assets/elcorps.png';
import howImg from '../assets/L2.png';

const NAV_LINKS = ['Member', 'FAQ'];

const WHY_JOIN = [
  {
    title: 'Promo Eksklusif',
    desc: 'Penawaran yang tidak tersedia untuk publik.',
    icon: Gift,
  },
  {
    title: 'Poin Reward',
    desc: 'Kumpulkan poin di setiap transaksi belanja Anda.',
    icon: Star,
  },
  {
    title: 'Akses Prioritas',
    desc: 'Jadi yang pertama mencoba koleksi terbaru.',
    icon: Crown,
  },
];

const HOW_IT_WORKS = [
  { no: '01', title: 'Daftar Akun', desc: 'Lengkapi data diri Anda di aplikasi atau website Elcorps Member.' },
  { no: '02', title: 'Verifikasi', desc: 'Lakukan verifikasi OTP menggunakan No HP yang terdaftar.' },
  { no: '03', title: 'Selesai!', desc: 'Nikmati semua benefit eksklusif Elzatta & Dauky secara langsung.' },
];

const FAQS = [
  'Bagaimana cara menjadi member Elzatta & Dauky?',
  'Apa keuntungan menjadi Agent / Reseller?',
  'Bagaimana cara menukarkan poin reward?',
];

export default function LandingPage() {
  const [showRegister, setShowRegister] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="relative w-full font-['Plus_Jakarta_Sans']">
      {/* TopNavBar */}
      <header className="sticky top-0 z-40 border-b border-[#BEC9C7]/30 bg-white/70 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-6 lg:px-20">
          <div className="flex items-center gap-2 h-[42px]">
          <img src={logoImg} alt="Elcorps" className="h-full w-auto" />
          <span className="flex items-center text-base font-bold text-[#3E4947] leading-none relative top-[7px]">
            Member
          </span>
        </div>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-sm font-semibold text-[#3E4947] hover:text-[#00504B]">
                {l}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-6">
            <Link to="/member/login" className="text-sm font-semibold text-[#3E4947] hover:text-[#00504B]">
              Masuk
            </Link>
            <button
              onClick={() => setShowRegister(true)}
              className="rounded-full bg-[#2DA299] px-6 py-3 text-sm font-semibold text-white shadow-md"
            >
              Daftar Sekarang
            </button>
          </div>

          <button className="lg:hidden text-[#00504B]" onClick={() => setMobileNavOpen((v) => !v)}>
            ☰
          </button>
        </div>

        {mobileNavOpen && (
          <div className="lg:hidden flex flex-col gap-4 border-t border-[#BEC9C7]/30 bg-white px-6 py-4">
            {NAV_LINKS.map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-sm font-semibold text-[#3E4947]">{l}</a>
            ))}
            <Link to="/member/login" onClick={() => setMobileNavOpen(false)} className="text-left text-sm font-semibold text-[#00504B]">
              Masuk
            </Link>
            <button
              onClick={() => { setShowRegister(true); setMobileNavOpen(false); }}
              className="rounded-full bg-[#2DA299] px-6 py-3 text-sm font-semibold text-white"
            >
              Daftar Sekarang
            </button>
          </div>
        )}
      </header>

      <main className="flex flex-col gap-16 lg:gap-24 py-10">
        {/* Hero */}
        <section className="mx-auto flex w-full max-w-[1280px] flex-col-reverse lg:flex-row items-center gap-10 px-6 lg:px-20">
          <div className="flex flex-1 flex-col gap-8">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight tracking-tight text-[#00504B]">
              Jadi Member Elzatta & Dauky Belanja Lebih Untung Setiap Hari
            </h1>
            <p className="max-w-[560px] text-base lg:text-lg leading-7 text-[#3E4947]">
              Nikmati pengalaman belanja eksklusif dengan diskon hingga 30%, poin reward melimpah, dan akses perdana ke koleksi hijab terbaru kami.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => setShowRegister(true)} className="rounded-full bg-[#2DA299] px-8 py-4 font-bold text-white shadow-lg">
                Gabung Sekarang
              </button>
              <button className="rounded-full border-2 border-[#00504B] px-8 py-4 font-semibold text-[#00504B]">
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>

          <div className="relative w-full max-w-[547px] overflow-hidden rounded-[40px]">
            <img
              src={bannerImg}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Why Join */}
        <section id="member" className="mx-auto w-full max-w-[1280px] px-6 lg:px-20">
          <div className="mb-8 flex flex-col items-center gap-2 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-[#00504B]">Kenapa Harus Gabung?</h2>
            <p className="text-[#3E4947]">Berbagai keuntungan menanti Anda sebagai member Elzatta & Dauky</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_JOIN.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex flex-col items-center gap-4 rounded-[20px] bg-white p-10 text-center shadow-sm border border-[#BEC9C7]/30"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#8AF4EA]">
                    <Icon className="h-8 w-8 text-[#00504B]" />
                  </div>

                  <h3 className="text-2xl font-semibold text-[#00504B]">
                    {item.title}
                  </h3>

                  <p className="text-[#3E4947]">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-[#00504B] px-6 lg:px-20 py-16">
          <div className="mx-auto flex w-full max-w-[1120px] flex-col lg:flex-row items-center gap-12">
            <div className="flex flex-1 flex-col gap-6">
              <h2 className="text-3xl lg:text-5xl font-bold leading-tight tracking-tight text-white">
                Sangat Mudah Untuk Bergabung
              </h2>
              <p className="text-white/80 text-lg">Hanya butuh 5 menit untuk memulai perjalanan belanja lebih untung Anda bersama Elcorps Member.</p>
              <div className="flex flex-col gap-8 mt-4">
                {HOW_IT_WORKS.map((step) => (
                  <div key={step.no} className="flex flex-col gap-2">
                    <span className="text-3xl font-bold text-[#8AF4EA]/40">{step.no}</span>
                    <h4 className="text-xl font-bold text-white">{step.title}</h4>
                    <p className="text-white/70 text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full max-w-[420px] overflow-hidden rounded-[40px]">
              <img
                src={howImg}
                alt="Cara bergabung Elzatta"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto w-full max-w-[1280px] px-6 lg:px-20">
          <div className="mb-8 flex flex-col items-center gap-2 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-[#00504B]">Pertanyaan Umum</h2>
            <p className="text-[#3E4947]">Hal-hal yang sering ditanyakan calon member</p>
          </div>
          <div className="mx-auto flex max-w-[778px] flex-col gap-4">
            {FAQS.map((q, i) => (
              <div key={q} className="rounded-[20px] border border-[#BEC9C7]/30 bg-white px-6 py-4">
                <button
                  className="flex w-full items-center justify-between text-left font-bold text-sm text-[#00504B]"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {q}
                  <span>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <p className="mt-3 text-sm text-[#3E4947]">
                    {/* TODO(backend): isi jawaban dari CMS/API FAQ */}
                    Jawaban untuk pertanyaan ini akan ditampilkan di sini.
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative isolate flex flex-col items-center gap-6 overflow-hidden bg-[#2DA299] px-6 lg:px-20 py-16 text-center">
          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#006A64]/20 blur-3xl" />
          <div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-[#006A64]/20 blur-3xl" />
          <h2 className="relative z-10 max-w-[700px] text-3xl lg:text-5xl font-bold leading-tight tracking-tight text-white">
            Siap Belanja Lebih Untung?
          </h2>
          <p className="relative z-10 max-w-[600px] text-white/80 text-lg">
            Bergabunglah dengan jutaan wanita inspiratif lainnya dan mulai nikmati keuntungan belanja yang belum pernah Anda rasakan sebelumnya.
          </p>
          <div className="relative z-10 flex flex-wrap justify-center gap-4">
            <button onClick={() => setShowRegister(true)} className="rounded-full bg-white px-10 py-5 font-bold text-[#00504B] shadow-2xl">
              Daftar Gratis
            </button>
            <Link to="/member/login" className="rounded-full border-2 border-white/30 px-10 py-5 font-bold text-white">
              Masuk Akun
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#BFC9C6]/30 px-6 lg:px-20 py-10">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col lg:flex-row justify-between gap-10">
          <div className="flex flex-col gap-4 max-w-[380px]">
            <p className="font-bold text-[#003734]">Elcorps Member</p>
            <p className="text-[#3E4947] text-sm">Program loyalitas resmi Elcorps untuk pengalaman belanja lebih untung.</p>
            <div className="flex gap-3">
              {[
                { icon: Camera, link: "#" },
                { icon: Music, link: "#" },
              ].map((item, i) => {
                const Icon = item.icon;

                return (
                  <div
                    key={i}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#BFC9C6] text-[#003734] opacity-50 cursor-not-allowed"
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-16">
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-[#003734]">Links</h4>
              {['Privacy Policy', 'Terms of Service', 'Contact Support'].map((l) => (
                <a key={l} href="#" className="text-sm text-[#3E4947]">{l}</a>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-[#003734]">Portal</h4>
              <span className="text-sm font-bold text-[#003734]">Member Portal</span>
              <a href="/admin/login" className="text-sm text-[#3E4947]">Admin Portal</a>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 w-full max-w-[1280px] border-t border-[#BFC9C6]/20 pt-6 text-sm text-[#3E4947]">
          © 2026 Elcorps Membership Program. All rights reserved.
        </div>
      </footer>

      <RegisterModal
        open={showRegister}
        onClose={() => setShowRegister(false)}
      />
    </div>
  );
}