interface MetricCardProps {
  title: string;
  value: number | string;
  delta?: number;
}

export default function MetricCard({ title, value, delta }: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col gap-1 transition-colors">
      <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
      <span className="text-2xl font-semibold">{value}</span>
      {delta !== undefined && (
        <span className={`text-sm ${delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>{delta >= 0 ? '+' : ''}{delta}%</span>
      )}
    </div>
  );
}
