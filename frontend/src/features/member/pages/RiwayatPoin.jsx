import { useState, useEffect, useMemo } from 'react';
import BackHeader from '../../../layouts/BackHeader';
import DateRangeFilter from '../../../components/common/DateRangeFilter';
import TransactionItem from '../../../components/common/TransactionItem';
import { getHistory } from '../../../services/pointService';

function groupByMonth(transactions) {
  return transactions.reduce((groups, t) => {
    const [, month, year] = t.date.split(' ');
    const key = `${month} ${year}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
    return groups;
  }, {});
}

export default function RiwayatPoin() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getHistory({ startDate, endDate })
      .then((res) => {
        if (res.success) {
          const mapped = res.data.map((t) => ({
            id: t.id,
            date: new Date(t.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
            description: t.description,
            pointChange: t.debit > 0 ? t.debit : -t.credit,
            balance: t.balance,
          }));
          setTransactions(mapped);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [startDate, endDate]);

  const grouped = useMemo(() => groupByMonth(transactions), [transactions]);

  return (
    <div className="min-h-screen bg-bg-alt">
      <BackHeader title="Riwayat Poin" />

      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      <main className="max-w-2xl mx-auto px-5 sm:px-8 py-5 flex flex-col gap-4">
        {!loading && (
          <p className="text-text-muted text-sm text-center sm:text-left">
            Menampilkan {transactions.length} transaksi
          </p>
        )}

        {loading && (
          <p className="text-center text-text-muted py-10">Memuat riwayat...</p>
        )}

        {!loading && Object.entries(grouped).map(([groupLabel, items]) => (
          <section key={groupLabel} className="flex flex-col gap-2">
            <h2 className="px-1 text-xs font-bold text-text-muted tracking-wider uppercase">
              {groupLabel}
            </h2>
            <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4">
              {items.map((t) => <TransactionItem key={t.id} transaction={t} />)}
            </div>
          </section>
        ))}

        {!loading && Object.keys(grouped).length === 0 && (
          <p className="text-center text-text-muted py-10">Belum ada riwayat transaksi.</p>
        )}
      </main>
    </div>
  );
}