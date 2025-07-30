"use client";
import { useMemo, useState } from "react";
import { AnalyticsRecord } from "../data/mockData";

interface TableProps {
  data: AnalyticsRecord[];
}

function DataTable({ data }: TableProps) {
  const [sortKey, setSortKey] = useState<keyof AnalyticsRecord>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const pageSize = 5;

  const today = new Date().toISOString().slice(0, 10);

  const adjustedData = useMemo(() => {
    const MAX_REVENUE = 200000;
    const MAX_USERS = 10000;
    const MAX_CONVERSIONS = 1000;

    return data.map((row) => {
      if (row.date === today) {
        return {
          ...row,
          revenue: Math.min(row.revenue, MAX_REVENUE),
          users: Math.min(row.users, MAX_USERS),
          conversions: Math.min(row.conversions, MAX_CONVERSIONS),
        };
      }
      return row;
    });
  }, [data, today]);

  const sorted = useMemo(() => {
    return [...adjustedData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [adjustedData, sortKey, sortDir]);

  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);
  const pageCount = Math.ceil(sorted.length / pageSize);

  const toggleSort = (key: keyof AnalyticsRecord) => {
    if (key === sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="mt-4">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            {["date", "revenue", "users", "conversions"].map((key) => (
              <th
                key={key}
                className="p-2 cursor-pointer"
                onClick={() => toggleSort(key as keyof AnalyticsRecord)}
              >
                {key}
                {sortKey === key && (sortDir === "asc" ? " ▲" : " ▼")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paged.map((row) => (
            <tr
              key={row.date}
              className="odd:bg-gray-50 dark:odd:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <td className="p-2">{row.date}</td>
              <td className="p-2">${row.revenue}</td>
              <td className="p-2">{row.users}</td>
              <td className="p-2">{row.conversions}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-2">
        <button
          className="px-2 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          Prev
        </button>
        <span>
          Page {page + 1} of {pageCount}
        </span>
        <button
          className="px-2 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          disabled={page === pageCount - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default DataTable;
