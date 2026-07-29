import { useState } from 'react';

export default function ImportDataModal({ open, onClose }) {
  const [error, setError] = useState(null); // TODO(backend): set dari response validasi upload

  if (!open) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // TODO(backend): POST /admin/members/import (FormData) — validasi format sebelum kirim
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center">
      <div className="w-[512px] bg-white rounded-xl shadow-elevated">
        <div className="flex justify-between items-center px-6 pt-6">
          <h3 className="font-hanken text-xl text-admin-navy">Import Data</h3>
          <button onClick={onClose} className="text-admin-text"><i className="fas fa-times" /></button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <label className="flex flex-col items-center justify-center gap-4 bg-bg-alt border-2 border-dashed border-secondary rounded-xl py-8 cursor-pointer">
            <div className="w-[60px] h-[60px] rounded-full bg-secondary/10 flex items-center justify-center">
              <i className="fas fa-file-excel text-primary text-2xl" />
            </div>
            <p className="text-sm text-admin-navy font-medium">Seret file .xlsx ke sini</p>
            <p className="text-sm text-admin-text">atau klik untuk memilih file</p>
            <span className="px-6 h-10 flex items-center rounded-lg bg-primary text-white text-sm">Pilih File</span>
            <input type="file" accept=".xlsx" className="hidden" onChange={handleFileChange} />
          </label>

          {error && (
            <div className="flex gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0"><i className="fas fa-exclamation text-red-500 text-xs" /></div>
              <div>
                <p className="font-bold text-sm text-red-500">Gagal Mengimpor File!</p>
                <p className="text-sm text-admin-navy">{error}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <span className="font-bold text-primary text-sm">Atau</span>
            <p className="text-sm text-admin-navy">Input Member secara manual (per-orangan)</p>
          </div>

          <div className="flex flex-col gap-3">
            <button className="flex items-center justify-center gap-2 h-12 rounded-lg bg-secondary text-white text-sm font-bold">
              <i className="fas fa-download" /> Unduh Template Import (.xlsx)
            </button>
            <button onClick={onClose} className="h-12 rounded-lg text-sm text-admin-text">Batal</button>
          </div>
        </div>
      </div>
    </div>
  );
}