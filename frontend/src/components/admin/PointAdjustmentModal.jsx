import { useState } from 'react';
import { adjustPoints } from '../../services/adminMemberService';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';

export default function PointAdjustmentModal({ open, member, onClose }) {
  const [mode, setMode] = useState('add'); // 'add' | 'subtract'
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  useLockBodyScroll(open);
  if (!open) return null;

  const amountNum = Number(amount) || 0;
  const newBalance = mode === 'add' ? member.currentBalance + amountNum : member.currentBalance - amountNum;
  const insufficientError = mode === 'subtract' && amountNum > member.currentBalance;

  const handleSubmit = async () => {
    if (insufficientError || !amount || !reason) return;
    try {
      const type = mode === 'add' ? 'ADD' : 'DEDUCT';
      const mCode = member.memberCode || member.memberId;
      
      await adjustPoints(mCode, type, Number(amount), `${reason} - ${note}`);
      
      alert(`Penyesuaian poin ${type} sebesar ${amount} berhasil disimpan!`);
      onClose();
      window.location.reload(); // Refresh data saldo & histori
    } catch (err) {
      alert(err.message || 'Gagal menyimpan penyesuaian poin.');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#111C2D]/65 backdrop-blur-sm">
      <div className="w-[560px] max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
        <div className="flex justify-between items-start p-6 border-b border-border">
          <div className="flex flex-col gap-1">
            <h2 className="font-hanken text-2xl font-bold text-admin-navy">Adjustment Poin Manual</h2>
            <p className="text-sm text-admin-text">Lakukan penambahan atau pengurangan poin untuk member ini.</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center"><i className="fas fa-times text-red-500 text-xs" /></button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-admin-text uppercase">Tipe Penyesuaian</label>
            <div className="flex bg-[#E7EEFF] border border-border rounded-2xl p-1 gap-1">
              <button
                onClick={() => setMode('add')}
                className={`flex-1 flex items-center justify-center gap-2 h-[46px] rounded-xl text-sm font-bold ${mode === 'add' ? 'bg-white border border-secondary text-primary shadow-card' : 'text-admin-text font-medium'}`}
              >
                <i className="fas fa-plus-circle" /> Tambah Poin (+)
              </button>
              <button
                onClick={() => setMode('subtract')}
                className={`flex-1 flex items-center justify-center gap-2 h-[46px] rounded-xl text-sm font-bold ${mode === 'subtract' ? 'bg-white border border-red-500 text-red-500 shadow-card' : 'text-admin-text font-medium'}`}
              >
                <i className="fas fa-minus-circle" /> Kurangi Poin (-)
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-admin-navy">Nominal Poin</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-[50px] px-4 rounded-xl border border-border outline-none focus:border-primary text-sm"
              placeholder="Masukkan jumlah poin"
            />
            {insufficientError && (
              <div className="mt-1 border-y border-red-500 bg-red-50 px-8 py-4 flex gap-3">
                <i className="fas fa-exclamation-circle text-red-500 mt-0.5" />
                <div>
                  <p className="font-bold text-[13px] text-red-500">Saldo poin tidak mencukupi!</p>
                  <p className="text-sm text-red-500">Nominal pengurangan melebihi saldo aktif member ({member.currentBalance.toLocaleString('id-ID')} Poin).</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-admin-navy">Kategori Alasan</label>
            <select value={reason} onChange={(e) => setReason(e.target.value)} className="h-[50px] px-4 rounded-xl border border-border outline-none text-sm text-admin-navy">
              <option value="">Pilih alasan</option>
              <option>Kompensasi Keluhan</option>
              <option>Kesalahan Sistem</option>
              <option>Promo Khusus</option>
              <option>Lainnya</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-admin-navy">Detail Catatan</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="p-4 rounded-xl border border-border outline-none text-sm resize-none"
              placeholder="Tuliskan alasan detail penyesuaian poin..."
            />
          </div>

          <div className="bg-bg-alt border border-border rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex justify-between text-sm text-admin-text">
              <span>Saldo Saat Ini</span><span className="font-semibold text-admin-navy">{member.currentBalance.toLocaleString('id-ID')} Poin</span>
            </div>
            <div className="flex justify-between text-sm text-admin-text">
              <span>Penyesuaian</span>
              <span className="font-bold" style={{ color: mode === 'add' ? '#10B981' : '#EF4444' }}>{mode === 'add' ? '+' : '-'}{amountNum.toLocaleString('id-ID')}</span>
            </div>
            <hr className="border-border" />
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-admin-navy">Saldo Setelah Adjustment</span>
              <span className="font-bold text-secondary">{newBalance.toLocaleString('id-ID')} Poin</span>
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-4 border-t border-border">
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 h-[49px] rounded-xl text-sm font-medium text-admin-text">Batal</button>
            <button
              onClick={handleSubmit}
              disabled={insufficientError || !amount || !reason}
              className="flex-[2] h-[50px] rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: mode === 'add' ? '#2DA299' : '#EF4444' }}
            >
              <i className="fas fa-paper-plane text-xs" /> Kirim Approval
            </button>
          </div>
          <p className="text-[11px] text-admin-text/60 flex items-center gap-2">
            <i className="fas fa-info-circle" /> Perubahan ini akan tercatat di Audit Trail dan tidak dapat dihapus.
          </p>
        </div>
      </div>
    </div>
  );
}