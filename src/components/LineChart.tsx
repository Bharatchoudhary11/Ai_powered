"use client";
import { useEffect, useRef } from "react";

interface LineChartProps {
  data: number[];
  labels?: string[];
  width?: number;
  height?: number;
}

export default function LineChart({ data, labels, width = 300, height = 150 }: LineChartProps) {
  const pathRef = useRef<SVGPolylineElement | null>(null);
  const axisPadding = 20;

  const max = data.length > 0 ? Math.max(...data) : 1;
  const denom = Math.max(1, data.length - 1);

  const points = data
    .map((d, i) => {
      const x = (i / denom) * width;
      const y = height - (d / max) * height;
      return `${x},${y}`;
    })
    .join(" ");

  // ✅ Animate line redraw on update
  useEffect(() => {
    if (pathRef.current) {
      pathRef.current.style.transition = "all 0.5s ease-out";
    }
  }, [data]);

  return (
    <svg width="100%" height={height + axisPadding} viewBox={`0 0 ${width} ${height + axisPadding}`}>
      {/* Axes */}
      <line x1={0} y1={height} x2={width} y2={height} stroke="currentColor" strokeWidth={1} />
      <line x1={0} y1={0} x2={0} y2={height} stroke="currentColor" strokeWidth={1} />

      {/* Labels */}
      {labels?.map((label, i) => {
        if (i % Math.max(1, Math.floor(data.length / 5)) !== 0) return null;
        const x = (i / denom) * width;
        return (
          <text key={i} x={x} y={height + 12} fontSize={10} textAnchor="middle">
            {label}
          </text>
        );
      })}

      {/* Line */}
      <polyline
        ref={pathRef}
        fill="none"
        stroke="#2563eb"
        strokeWidth={2}
        points={points}
      />
    </svg>
  );
}
