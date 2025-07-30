import { useState } from 'react';

interface PieChartProps {
  data: { value: number; color: string }[];
  size?: number;
}

export default function PieChart({ data, size = 150 }: PieChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;
  const slices = data.map((slice, idx) => {
    const [startX, startY] = getCoordinates(cumulative / total, size);
    cumulative += slice.value;
    const [endX, endY] = getCoordinates(cumulative / total, size);
    const largeArc = slice.value / total > 0.5 ? 1 : 0;
    const pathData = `M ${size} ${size} L ${startX} ${startY} A ${size} ${size} 0 ${largeArc} 1 ${endX} ${endY} Z`;
    const isActive = active === idx;
    return (
      <path
        key={idx}
        d={pathData}
        fill={slice.color}
        style={{ transformOrigin: 'center', transition: 'transform 0.2s' }}
        className={isActive ? 'scale-105 opacity-80' : ''}
        onMouseEnter={() => setActive(idx)}
        onMouseLeave={() => setActive(null)}
      />
    );
  });

  const activeSlice = active !== null ? data[active] : null;

  return (
    <svg
      width={size * 2}
      height={size * 2}
      viewBox={`0 0 ${size * 2} ${size * 2}`}
      className="w-full"
    >
      {slices}
      {activeSlice && (
        <text
          x={size}
          y={size}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-semibold fill-current pointer-events-none"
        >
          {((activeSlice.value / total) * 100).toFixed(0)}%
        </text>
      )}
    </svg>
  );
}

function getCoordinates(fraction: number, radius: number) {
  const x = radius + radius * Math.cos(2 * Math.PI * fraction - Math.PI / 2);
  const y = radius + radius * Math.sin(2 * Math.PI * fraction - Math.PI / 2);
  return [x, y];
}
