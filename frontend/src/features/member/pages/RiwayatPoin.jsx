import { useState, useMemo } from 'react';
import BackHeader from '../../../layouts/BackHeader';
import MonthYearFilter from '../../../components/common/MonthYearFilter';
import TransactionItem from '../../../components/common/TransactionItem';
// TODO(backend): ganti mockTransactions -> pointService.getHistory({ month, year })
// PRD F05: filter berdasarkan Bulan & Tahun

function groupByMonth(transactions) {
  // TODO(backend): idealnya grouping ini dilakukan di response API, bukan di frontend,
  // supaya konsisten saat data sudah besar / dipaginasi
  return transactions.reduce((groups, t) => {
    const [, month, year] = t.date.split(' ');
    const key = `${month} ${year}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
    return groups;
  }, {});
}

export default function RiwayatPoin() {
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [transactions] = useState([]);
  const grouped = useMemo(() => groupByMonth(transactions), [transactions]);

  return (
    <div className="min-h-screen bg-bg-alt">
      <BackHeader title="Riwayat Poin" />
      <div className="px-5 py-4 bg-white">
        <h1 className="font-bold text-xl text-primary">Riwayat Poin</h1>
      </div>

      <MonthYearFilter
        month={month}
        year={year}
        onMonthClick={() => {/* buka dropdown pilih bulan */}}
        onYearClick={() => {/* buka dropdown pilih tahun */}}
      />

      <main className="px-5 py-5 flex flex-col gap-4">
        {Object.entries(grouped).map(([groupLabel, items]) => (
          <section key={groupLabel} className="flex flex-col gap-2">
            <h2 className="px-1 text-xs font-bold text-text-muted tracking-wider uppercase">
              {groupLabel}
            </h2>
            <div className="flex flex-col gap-3">
              {items.map((t) => <TransactionItem key={t.id} transaction={t} />)}
            </div>
          </section>
        ))}

        {Object.keys(grouped).length === 0 && (
          <p className="text-center text-text-muted py-10">Belum ada riwayat transaksi.</p>
        )}

        {/* TODO(backend): ganti jadi pagination/infinite-scroll ke pointService.getHistory */}
        <div className="flex flex-col items-center gap-4 py-8">
          <p className="text-text-muted text-sm">Menampilkan {transactions.length} transaksi</p>
        </div>
      </main>
    </div>
  );
}