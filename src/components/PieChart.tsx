"use client";
import { useEffect, useState } from "react";
import { filterPastData } from "../utils/filterPastData";

interface PieChartProps {
  data: { value: number; color?: string }[];
  size?: number;
  innerRadius?: number;
}

export default function PieChart({
  data,
  size = 150,
  innerRadius = 60,
}: PieChartProps) {
  const [animatedData, setAnimatedData] = useState(data);
  const [active, setActive] = useState<number | null>(null);

  // ✅ Animate value changes for live updates
  useEffect(() => {
    let animationFrame: number;
    const duration = 500;
    const start = performance.now();
    const initial = animatedData.map((d) => d.value);

    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const newValues = data.map((d, i) => {
        const startVal = initial[i] || 0;
        return startVal + (d.value - startVal) * progress;
      });
      setAnimatedData(newValues.map((val, i) => ({ ...data[i], value: val })));
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [data]);

  // ✅ Consistent colors
  const colors = [
    "#3b82f6", "#10b981", "#f59e0b",
    "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899",
  ];

  const total = animatedData.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;

  const chartRadius = size - 10; // ✅ Add padding to avoid overflow

  const slices = animatedData.map((slice, idx) => {
    const color = slice.color || colors[idx % colors.length];
    const [startX, startY] = getCoordinates(cumulative / total, chartRadius);
    cumulative += slice.value;
    const [endX, endY] = getCoordinates(cumulative / total, chartRadius);
    const largeArc = slice.value / total > 0.5 ? 1 : 0;
    const pathData = `
      M ${size} ${size}
      L ${startX} ${startY}
      A ${chartRadius} ${chartRadius} 0 ${largeArc} 1 ${endX} ${endY}
      Z
    `;
    const isActive = active === idx;

    return (
      <path
        key={idx}
        d={pathData}
        fill={color}
        style={{
          transformOrigin: "center",
          transition: "transform 0.3s ease, opacity 0.3s ease",
        }}
        className={isActive ? "scale-103 opacity-80" : "opacity-90"}
        onMouseEnter={() => setActive(idx)}
        onMouseLeave={() => setActive(null)}
      />
    );
  });

  const activeSlice = active !== null ? animatedData[active] : null;

  return (
    <svg
      width={size * 2}
      height={size * 2}
      viewBox={`0 0 ${size * 2} ${size * 2}`}
      className="w-full overflow-hidden"
    >
      {/* ✅ Donut center */}
      <circle
        cx={size}
        cy={size}
        r={innerRadius}
        fill="white"
        className="dark:fill-gray-900"
      />
      {slices}

      {/* ✅ Tooltip */}
      {activeSlice && (
        <text
          x={size}
          y={size}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-sm font-semibold fill-gray-700 dark:fill-gray-200 pointer-events-none"
        >
          {((activeSlice.value / total) * 100).toFixed(1)}%
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
