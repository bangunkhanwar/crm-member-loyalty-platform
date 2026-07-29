import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '../../../components/common/TextField';
import { useBackNavigate } from '../../../hooks/useBackNavigate';

// TODO(backend): GET -> memberService.getProfile()
// TODO(backend): PUT -> memberService.updateProfile(payload) untuk field editable (Nama, Email, Kota, Gender)
// TODO(backend): POST -> memberService.uploadAvatar(file) untuk tombol "Ubah Foto"

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function Profile() {
  const goBack = useBackNavigate('/dashboard');
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    city: '',
    gender: 'L',
  });
// TODO: useEffect -> memberService.getProfile().then(res => setForm(res.data))
  const [dirty, setDirty] = useState(false);

  const update = (key) => (val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setDirty(true);
  };

  const emailError = form.email && !isValidEmail(form.email) ? 'Format email tidak valid' : null;

  const handleSave = async () => {
    if (emailError) return;
    // TODO(backend): await memberService.updateProfile(form)
    setDirty(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      {/* Header Gradient + Nav + Avatar */}
      <div className="bg-hero-gradient">
  {/* Nav bar - tinggi 64px konsisten dengan BackHeader di halaman lain */}
  <div className="h-16 flex items-center justify-between px-5">
    <div className="flex items-center gap-4">
      <button onClick={goBack} aria-label="Kembali">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
          <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <h1 className="text-white font-bold text-xl">Profil Saya</h1>
    </div>
    <button
      onClick={handleSave}
      disabled={!dirty || !!emailError}
      className="font-extrabold text-base text-white disabled:opacity-50"
    >
      Simpan
    </button>
  </div>

  {/* Avatar section - terpisah dari nav bar, padding sendiri */}
  <div className="flex flex-col items-center px-5 pb-10">
    <div className="relative w-[112px] h-[112px] rounded-full border-[3px] border-white/30 flex items-center justify-center">
      <div className="w-[98px] h-[98px] rounded-full bg-[#E6E8EA] border-2 border-white shadow-elevated flex items-center justify-center text-[#545F73] overflow-hidden">
        <span className="text-xs">IMG</span>
      </div>
      <button
        className="absolute right-1 bottom-2.5 w-[25.5px] h-[26px] rounded-full bg-white shadow-elevated flex items-center justify-center"
        aria-label="Ubah foto"
      >
        <svg width="13.5" height="13.5" viewBox="0 0 20 20" fill="#006A64">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      </button>
    </div>
    <span className="mt-2 text-white text-base">Ubah Foto</span>
  </div>
</div>

      {/* Form Card */}
      <main className="bg-[#F7F9FB] -mt-8 rounded-t-[32px] shadow-[0_-8px_24px_rgba(0,0,0,0.05)] px-[30px] pt-10 pb-6 flex flex-col gap-6">
        <TextField label="Nama Lengkap" value={form.name} onChange={update('name')} />
        <TextField label="Email" value={form.email} onChange={update('email')} error={emailError} />

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold tracking-wider uppercase text-[#545F73]/60">Kota Tempat Tinggal</label>
          <button
            type="button"
            onClick={() => {/* TODO: buka picker/dropdown kota */}}
            className="w-full flex items-center justify-between border-b border-[#BCC9C7] py-2 text-[15px] text-text-black"
          >
            <span>{form.city}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold tracking-wider uppercase text-[#545F73]/60">Gender</label>
          <div className="flex gap-4">
            {[{ code: 'L', label: 'Pria' }, { code: 'P', label: 'Wanita' }].map((g) => (
              <button
                key={g.code}
                onClick={() => update('gender')(g.code)}
                className={`flex-1 h-12 rounded-xl font-bold text-base
                  ${form.gender === g.code
                    ? 'bg-secondary/5 border border-primary shadow-card text-primary'
                    : 'bg-[#F2F4F6]/50 border border-border-soft text-[#545F73] font-medium'}`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-8 pb-2 border-t border-[#E0E3E5]/30 mt-2">
          <span className="text-xs font-bold tracking-[1.2px] text-[#BCC9C7]/80">DATA TERKUNCI</span>
        </div>

        {[
          { label: 'Nomor HP', value: '+62 812 3456 7890' },
          { label: 'Tanggal Lahir', value: '15 Agustus 1992' },
          { label: 'Store Register', value: 'Grand Indonesia, Jakarta' },
        ].map((field) => (
          <div key={field.label} className="flex flex-col gap-1">
            <label className="text-xs font-bold tracking-wider uppercase text-[#545F73]/40">{field.label}</label>
            <div className="flex items-center justify-between border-b border-dashed border-[#BCC9C7]/50 py-2 font-medium text-base text-[#545F73]/60">
              <span>{field.value}</span>
              <svg width="12" height="16" viewBox="0 0 20 20" fill="rgba(84,95,115,0.3)">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        ))}

        <p className="italic text-sm text-center text-[#6D7A78]/60 pt-5 pb-10 px-4">
          Hubungi Customer Service untuk mengubah data terkunci
        </p>
      </main>
    </div>
  );
}