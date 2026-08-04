import { useState } from 'react';
import { createReward } from '../../services/adminRewardService';

const CATEGORIES = ['Voucher', 'Merchandise', 'Digital Service', 'Elektronik'];

export default function AddRewardModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', category: 'Voucher', pointRequired: '', initialStock: '', amount: '', expiryDays: 30, description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    // TODO(backend): sertakan `imageFile` sebagai FormData saat createReward, atau upload terpisah lalu simpan URL-nya
  };

  const handleSubmit = async () => {
    if (!form.name || !form.pointRequired || form.initialStock === '') {
      setError('Nama, Point Required, dan Initial Stock wajib diisi.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await createReward({
        name: form.name,
        category: form.category,
        pointRequired: Number(form.pointRequired),
        initialStock: Number(form.initialStock),
        amount: Number(form.amount) || 0,
        expiryDays: Number(form.expiryDays) || 30,
        terms: form.description,
        image: imageFile || undefined,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Gagal menambahkan reward.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-[#111C2D]/40 backdrop-blur-[1px] flex justify-end">
      <div className="w-full sm:w-[540px] max-w-full bg-white h-full flex flex-col overflow-y-auto">
        <div className="flex justify-between items-start p-6 border-b border-border sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-hanken text-2xl font-semibold text-admin-navy">Tambah Reward Baru</h2>
            <p className="text-sm text-admin-text mt-1">Konfigurasi item reward untuk loyalty program.</p>
          </div>
          <button onClick={onClose} className="text-admin-text"><i className="fas fa-times" /></button>
        </div>

        <div className="flex-1 p-6 flex flex-col gap-8">
          <section className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wide text-admin-text">General Information</h4>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-admin-navy">Nama Reward *</label>
              <input value={form.name} onChange={set('name')} placeholder="Voucher Diskon Rp 100.000"
                className="h-12 px-4 rounded-lg bg-bg-alt border border-border outline-none focus:border-primary text-sm" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-admin-navy">Kategori</label>
              <select value={form.category} onChange={set('category')} className="h-12 px-4 rounded-lg bg-bg-alt border border-border outline-none text-sm">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wide text-admin-text">Points &amp; Stock</h4>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-admin-navy">Point Required *</label>
                <input type="number" value={form.pointRequired} onChange={set('pointRequired')} placeholder="1000"
                  className="h-12 px-4 rounded-lg bg-bg-alt border border-border outline-none text-sm" />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-admin-navy">Initial Stock *</label>
                <input type="number" value={form.initialStock} onChange={set('initialStock')} placeholder="50"
                  className="h-12 px-4 rounded-lg bg-bg-alt border border-border outline-none text-sm" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-admin-navy">Nilai Reward (Rp)</label>
                <input type="number" value={form.amount} onChange={set('amount')} placeholder="100000"
                  className="h-12 px-4 rounded-lg bg-bg-alt border border-border outline-none text-sm" />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-admin-navy">Masa Berlaku (Hari)</label>
                <input type="number" value={form.expiryDays} onChange={set('expiryDays')}
                  className="h-12 px-4 rounded-lg bg-bg-alt border border-border outline-none text-sm" />
              </div>
            </div>
          </section>
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <h4 className="text-xs font-bold uppercase tracking-wide text-admin-text">Reward Image</h4>
            </div>
            <label className="flex flex-col items-center justify-center gap-3 bg-bg-alt border-2 border-dashed border-border rounded-xl py-8 px-4 cursor-pointer hover:border-primary/50 transition-colors">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full max-h-[180px] object-contain rounded-lg" />
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <i className="fas fa-image text-primary text-xl" />
                  </div>
                  <p className="text-sm text-admin-navy font-medium text-center">Seret gambar ke sini atau klik untuk memilih</p>
                  <p className="text-xs text-admin-text text-center">PNG, JPG maks. 2MB</p>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <h4 className="text-xs font-bold uppercase tracking-wide text-admin-text">Deskripsi &amp; Syarat Ketentuan</h4>
            </div>
            <textarea
              value={form.description}
              onChange={set('description')}
              rows={5}
              placeholder="Tuliskan detail reward dan syarat klaim di sini..."
              className="w-full px-4 pt-3 pb-28 rounded-lg bg-bg-alt border border-border outline-none focus:border-primary text-sm text-[#6B7280] resize-none"
            />
          </section>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="p-6 border-t border-border bg-bg-alt flex justify-end gap-3 sticky bottom-0">
          <button onClick={onClose} className="px-6 h-11 rounded-lg border border-border text-sm font-medium text-admin-text">Batal</button>
          <button onClick={handleSubmit} disabled={submitting}
            className="px-8 h-11 rounded-lg bg-secondary text-white text-sm font-semibold shadow-card disabled:opacity-50">
            {submitting ? 'Menyimpan...' : 'Simpan Reward'}
          </button>
        </div>
      </div>
    </div>
  );
}