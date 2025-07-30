'use client';
import { useEffect, useMemo, useState } from 'react';
import MetricCard from '../components/MetricCard';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import DataTable from '../components/DataTable';
import DarkModeToggle from '../components/DarkModeToggle';
import { records as rawRecords } from '../data/mockData';
import { DollarSign, Users, TrendingUp, Repeat } from "lucide-react";
export default function Home() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [records, setRecords] = useState(rawRecords);

  // ✅ Stable today's date string
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const years = useMemo(
    () => Array.from(new Set(records.map((r) => r.date.slice(0, 4)))),
    [records]
  );

  // ✅ Live updates only for today's record
  useEffect(() => {
    const id = setInterval(() => {
      setRecords((prev) =>
        prev.map((r) => {
          if (r.date === todayStr) {
            const users = Math.floor(200 + Math.random() * 300);
            const conversions = Math.floor(users * (0.05 + Math.random() * 0.1));
            const revenue = conversions * (20 + Math.random() * 80);
            return {
              ...r,
              revenue: Math.round(revenue),
              users,
              conversions,
            };
          }
          return r;
        })
      );
    }, 5000);
    return () => clearInterval(id);
  }, [todayStr]);

  // ✅ Filter data by date range/year/month but never remove historical data
  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (new Date(r.date) > new Date()) return false; // exclude future dates
      if (year && !r.date.startsWith(year)) return false;
      if (month && !r.date.startsWith(`${year}-${month}`)) return false;
      if (start && r.date < start) return false;
      if (end && r.date > end) return false;
      return true;
    });
  }, [records, start, end, year, month]);

  // ✅ Totals calculation
  const totals = useMemo(() => {
    const revenue = filtered.reduce((sum, r) => sum + r.revenue, 0);
    const users = filtered.reduce((sum, r) => sum + r.users, 0);
    const conversions = filtered.reduce((sum, r) => sum + r.conversions, 0);
    const growth =
      ((filtered[filtered.length - 1]?.revenue ?? 0) -
        (filtered[0]?.revenue ?? 0)) /
        (filtered[0]?.revenue ?? 1) *
      100;
    return { revenue, users, conversions, growth: Math.round(growth) };
  }, [filtered]);

  // ✅ Chart labels
  const labels = useMemo(
    () =>
      filtered.map((r) => {
        const d = new Date(r.date);
        return month
          ? String(d.getDate())
          : `${d.getMonth() + 1}/${d.getDate()}`;
      }),
    [filtered, month]
  );

  // ✅ Export to CSV
  const exportCsv = () => {
    const header = 'date,revenue,users,conversions\n';
    const rows = filtered
      .map((r) => `${r.date},${r.revenue},${r.users},${r.conversions}`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Header */}
      <header className="flex justify-between items-center bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 text-white p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold tracking-wide">ADmyBRAND Insights</h1>
        <DarkModeToggle />
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Revenue : " 
          value={`$${totals.revenue}`}
          icon={DollarSign}
          className="hover:scale-105 transition-transform duration-300"
        />
        <MetricCard
          title="Users : "
          value={totals.users}
          icon={Users}
          className="hover:scale-105 transition-transform duration-300"
        />
        <MetricCard
          title="Conversions : "
          value={totals.conversions}
          icon={Repeat}
          className="hover:scale-105 transition-transform duration-300"
        />
        <MetricCard
          title="Growth :  "
          value={`${totals.growth}%`}

          delta={totals.growth}
          icon={TrendingUp}
          className="hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-xl transition-shadow">
          <h2 className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
            Revenue
          </h2> 
          <LineChart data={filtered.map((r) => r.revenue)} labels={labels} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-xl transition-shadow">
          <h2 className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
            Users
          </h2>
          <BarChart data={filtered.map((r) => r.users)} labels={labels} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-xl transition-shadow">
          <h2 className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
            Conversions Split
          </h2>
          <PieChart
            data={[
              { value: totals.conversions, color: '#3b82f6' },
              { value: totals.users - totals.conversions, color: '#d1d5db' },
            ]}
          />
        </div>
      </div>

      {/* Filters and Table */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-xl transition-shadow">
        <div className="flex flex-wrap gap-3 mb-3 items-end">
          <div>
            <label className="text-sm mr-1 font-medium text-gray-600 dark:text-gray-300">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border rounded p-1 focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm mr-1 font-medium text-gray-600 dark:text-gray-300">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border rounded p-1 focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All</option>
              {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm mr-1 font-medium text-gray-600 dark:text-gray-300">Start</label>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="border rounded p-1 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-sm mr-1 font-medium text-gray-600 dark:text-gray-300">End</label>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="border rounded p-1 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={exportCsv}
          >
            Export CSV
          </button>
        </div>
        <DataTable data={filtered} />
      </section>
    </div>
  );
}
