import { useState } from 'react';
import { updateReward, restockReward, toggleRewardActive, deleteReward } from '../../services/adminRewardService';

export default function EditRewardDrawer({ open, reward, onClose, onSuccess }) {
  const [form, setForm] = useState(null);
  const [addStock, setAddStock] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!open || !reward) return null;

  const f = form || { name: reward.name, category: reward.category, pointRequired: reward.pointRequired, amount: reward.amount, expiryDays: reward.expiryDays, description: reward.terms || '' };
  const set = (k) => (e) => setForm({ ...f, [k]: e.target.value });

  const handleSave = async () => {
    setSubmitting(true);
    setError('');
    try {
      await updateReward(reward.giftId, {
        name: f.name,
        category: f.category,
        pointRequired: Number(f.pointRequired),
        amount: Number(f.amount),
        expiryDays: Number(f.expiryDays),
        terms: f.description,
        image: imageFile || undefined,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Gagal menyimpan perubahan.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplyStock = async () => {
    const qty = Number(addStock);
    if (!qty || qty <= 0) return;
    try {
      await restockReward(reward.giftId, qty);
      setAddStock('');
      onSuccess();
    } catch (err) {
      setError(err.message || 'Gagal menambah stok.');
    }
  };

  const handleToggle = async () => {
    try {
      await toggleRewardActive(reward.giftId);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Gagal mengubah status.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Hapus reward "${reward.name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    try {
      await deleteReward(reward.giftId);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Gagal menghapus reward.');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-[#111C2D]/40 backdrop-blur-[1px] flex justify-end">
      <div className="w-full sm:w-[540px] max-w-full bg-white h-full flex flex-col overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <h2 className="font-hanken text-2xl font-semibold text-admin-navy">Edit Reward</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${reward.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-admin-text/10 text-admin-text'}`}>
              {reward.isActive ? 'Published' : 'Nonaktif'}
            </span>
          </div>
          <button onClick={onClose} className="text-admin-text"><i className="fas fa-times" /></button>
        </div>

        <div className="flex-1 p-6 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-[#3D4947] text-base font-bold font-['Inter'] leading-6">Preview Reward</span>
            <label className="relative rounded-2xl overflow-hidden border-2 border-border h-44 bg-bg-alt group cursor-pointer block">
              {imagePreview || reward.image ? (
                <img src={imagePreview || reward.image} alt={reward.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-admin-text text-sm">Tanpa Gambar</div>
              )}
              <div className="absolute inset-0 bg-[#111C2D]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="px-4 py-2 bg-white rounded-xl flex items-center gap-2">
                  <i className="fas fa-camera text-[#111C2D] text-sm" />
                  <span className="text-[#111C2D] text-base font-['Inter'] leading-6">Ganti Gambar</span>
                </div>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[#3D4947] text-base font-bold font-['Inter'] leading-6">Nama Reward</label>
              <input
                value={f.name}
                onChange={set('name')}
                className="h-[46px] px-4 rounded-xl bg-[#F0F3FF] border border-border outline-none text-[#111C2D] text-lg font-semibold font-['Inter'] leading-[22.5px]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#3D4947] text-base font-bold font-['Inter'] leading-6">Reward Group</label>
              <input
                value={f.category}
                onChange={set('category')}
                className="h-[46px] px-4 rounded-xl bg-[#F0F3FF] border border-border outline-none text-[#111C2D] text-base font-normal font-['Inter'] leading-6"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#3D4947] text-base font-bold font-['Inter'] leading-6">Point Required</label>
              <input
                type="number"
                value={f.pointRequired}
                onChange={set('pointRequired')}
                className="h-[46px] px-4 rounded-xl bg-[#F0F3FF] border border-border outline-none text-[#111C2D] text-base font-normal font-['Inter'] leading-6"
              />
            </div>
          </section>

          <section className="p-4 bg-[#F0F3FF] rounded-2xl border border-border flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[#3D4947] text-base font-normal font-['Inter'] leading-6">Sisa Stok Saat Ini</p>
                <p className="flex items-baseline gap-1">
                  <span className="text-[#006A64] text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">{reward.stock}</span>
                  <span className="text-[#6D7A78] text-sm font-normal font-['Hanken_Grotesk'] leading-5">Items</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[#3D4947] text-base font-normal font-['Inter'] leading-6">Total Terpakai</p>
                <p className="text-[#111C2D] text-base font-semibold font-['Inter'] leading-6">{reward.redeemedTotal}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-border flex flex-col gap-2">
              <label className="text-[#3D4947] text-base font-normal font-['Inter'] leading-6">Tambah Stok Baru</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={addStock}
                  onChange={(e) => setAddStock(e.target.value)}
                  placeholder="Contoh: 50"
                  className="flex-1 h-11 px-4 rounded-xl bg-white border border-border outline-none text-[#111C2D] text-base font-normal font-['Inter'] placeholder:text-[#6B7280]"
                />
                <button
                  onClick={handleApplyStock}
                  className="px-5 h-11 rounded-xl bg-[#DEE8FF] border border-border-soft text-[#111C2D] text-base font-normal font-['Inter'] leading-6"
                >
                  Apply
                </button>
              </div>
            </div>
          </section>
          <section className="flex flex-col gap-2">
            <label className="text-[#3D4947] text-base font-bold font-['Inter'] leading-6">Deskripsi &amp; Syarat Ketentuan</label>
            <textarea
              value={f.description ?? ''}
              onChange={set('description')}
              rows={6}
              placeholder="Tuliskan detail reward dan syarat klaim di sini..."
              className="w-full px-4 py-3 rounded-2xl bg-[#F0F3FF] border border-border outline-none resize-none text-[#3D4947] text-base font-normal font-['Inter'] leading-[26px] placeholder:text-[#6B7280]"
            />
          </section>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="p-6 border-t border-border bg-white flex flex-wrap gap-3 sticky bottom-0">
          <button onClick={handleDelete} className="px-5 h-11 rounded-lg border border-red-500 text-red-500 text-sm font-medium">Hapus Reward</button>
          <button onClick={handleToggle} className="px-5 h-11 rounded-lg border border-red-500 text-red-500 text-sm font-medium">
            {reward.isActive ? 'Nonaktifkan' : 'Aktifkan'}
          </button>
          <button onClick={handleSave} disabled={submitting}
            className="flex-1 min-w-[160px] h-11 rounded-lg bg-secondary text-white text-sm font-semibold shadow-card disabled:opacity-50">
            {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}