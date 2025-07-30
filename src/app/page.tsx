'use client';
import { useEffect, useMemo, useState } from 'react';
import MetricCard from '../components/MetricCard';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import DataTable from '../components/DataTable';
import DarkModeToggle from '../components/DarkModeToggle';
import { records as rawRecords } from '../data/mockData';

export default function Home() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [records, setRecords] = useState(rawRecords);
  const years = useMemo(
    () => Array.from(new Set(records.map((r) => r.date.slice(0, 4)))),
    [records]
  );

  // simulate real-time updates
  useEffect(() => {
    const id = setInterval(() => {
      setRecords((prev) => {
        const last = prev[prev.length - 1];
        const date = new Date(last.date);
        date.setDate(date.getDate() + 1);
        const users = Math.floor(200 + Math.random() * 300);
        const conversions = Math.floor(users * (0.05 + Math.random() * 0.1));
        const revenue = conversions * (20 + Math.random() * 80);
        const newRecord = {
          date: date.toISOString().slice(0, 10),
          revenue: Math.round(revenue),
          users,
          conversions,
        };
        return [...prev.slice(1), newRecord];
      });
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (year && !r.date.startsWith(year)) return false;
      if (month && !r.date.startsWith(`${year}-${month}`)) return false;
      if (start && r.date < start) return false;
      if (end && r.date > end) return false;
      return true;
    });
  }, [records, start, end, year, month]);

  const totals = useMemo(() => {
    const revenue = filtered.reduce((sum, r) => sum + r.revenue, 0);
    const users = filtered.reduce((sum, r) => sum + r.users, 0);
    const conversions = filtered.reduce((sum, r) => sum + r.conversions, 0);
    const growth = ((filtered[filtered.length - 1]?.revenue ?? 0) - (filtered[0]?.revenue ?? 0)) / (filtered[0]?.revenue ?? 1) * 100;
    return { revenue, users, conversions, growth: Math.round(growth) };
  }, [filtered]);

  const labels = useMemo(
    () =>
      filtered.map((r) => {
        const d = new Date(r.date);
        return month ? String(d.getDate()) : `${d.getMonth() + 1}/${d.getDate()}`;
      }),
    [filtered, month]
  );

  const exportCsv = () => {
    const header = 'date,revenue,users,conversions\n';
    const rows = filtered.map((r) => `${r.date},${r.revenue},${r.users},${r.conversions}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">ADmyBRAND Insights</h1>
        <DarkModeToggle />
      </header>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard title="Revenue" value={`$${totals.revenue}`} />
        <MetricCard title="Users" value={totals.users} />
        <MetricCard title="Conversions" value={totals.conversions} />
        <MetricCard title="Growth" value={`${totals.growth}%`} delta={totals.growth} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="mb-2 font-semibold">Revenue</h2>
          <LineChart data={filtered.map((r) => r.revenue)} labels={labels} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="mb-2 font-semibold">Users</h2>
          <BarChart data={filtered.map((r) => r.users)} labels={labels} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="mb-2 font-semibold">Conversions Split</h2>
          <PieChart
            data={[{ value: totals.conversions, color: '#3b82f6' }, { value: totals.users - totals.conversions, color: '#d1d5db' }]}
          />
        </div>
      </div>

      <section className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <div className="flex flex-wrap gap-2 mb-2 items-end">
          <div>
            <label className="text-sm mr-1">Year</label>
            <select value={year} onChange={(e) => setYear(e.target.value)} className="border rounded p-1">
              <option value="">All</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm mr-1">Month</label>
            <select value={month} onChange={(e) => setMonth(e.target.value)} className="border rounded p-1">
              <option value="">All</option>
              {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm mr-1">Start</label>
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="border rounded p-1" />
          </div>
          <div>
            <label className="text-sm mr-1">End</label>
            <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="border rounded p-1" />
          </div>
          <button className="px-2 py-1 border rounded" onClick={exportCsv}>Export CSV</button>
        </div>
        <DataTable data={filtered} />
      </section>
    </div>
  );
}
