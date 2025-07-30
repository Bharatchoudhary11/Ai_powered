"use client";
import { useMemo } from "react";
import { filterChartData } from "../utils/filterPastData";

interface BarChartProps {
  data: number[];
  labels?: string[];
  width?: number;
  height?: number;
}

export default function BarChart({
  data,
  labels,
  width = 400,
  height = 200,
}: BarChartProps) {
  const paddingLeft = 40;
  const paddingBottom = 25;

  // ✅ Filter out future data
  const { filteredData, filteredLabels } = filterChartData(data, labels);

  // ✅ Auto-aggregate data for readability
  const { reducedData, reducedLabels } = useMemo(() => {
    if (!filteredLabels || filteredData.length <= 50)
      return { reducedData: filteredData, reducedLabels: filteredLabels };

    const groupSize = Math.ceil(filteredData.length / 50);
    const newData: number[] = [];
    const newLabels: string[] = [];

    for (let i = 0; i < filteredData.length; i += groupSize) {
      const slice = filteredData.slice(i, i + groupSize);
      const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
      newData.push(Math.round(avg));
      newLabels.push(filteredLabels[i]);
    }

    return { reducedData: newData, reducedLabels: newLabels };
  }, [filteredData, filteredLabels]);

  const max = reducedData.length > 0 ? Math.max(...reducedData) : 0;
  const safeMax = max > 0 ? max : 1;

  const availableWidth = width - paddingLeft - 10;
  const barWidth = reducedData.length > 0 ? availableWidth / reducedData.length : availableWidth;
  const totalBarsWidth = barWidth * reducedData.length;
  const offsetX = paddingLeft + (availableWidth - totalBarsWidth) / 2;

  const yTicks = 5;
  const xTickInterval = Math.max(1, Math.floor(reducedData.length / 6));

  return (
    <svg
      width="100%"
      height={height + paddingBottom}
      viewBox={`0 0 ${width} ${height + paddingBottom}`}
      preserveAspectRatio="xMinYMin meet"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
        </linearGradient>
      </defs>

      {/* Axes */}
      <line x1={paddingLeft} y1={height} x2={width} y2={height} stroke="currentColor" strokeWidth={1}/>
      <line x1={paddingLeft} y1={0} x2={paddingLeft} y2={height} stroke="currentColor" strokeWidth={1}/>

      {/* Y-axis ticks */}
      {Array.from({ length: yTicks }).map((_, i) => {
        const value = (safeMax / (yTicks - 1)) * i;
        const y = height - (value / safeMax) * height;
        return (
          <text key={i} x={paddingLeft - 6} y={y + 4} fontSize={10} textAnchor="end" className="fill-gray-500 dark:fill-gray-300">
            {Math.round(value)}
          </text>
        );
      })}

      {/* X-axis ticks */}
      {reducedData.map((_, i) => {
        if (i % xTickInterval !== 0) return null;
        const x = offsetX + i * barWidth + barWidth / 2;
        return (
          <text key={i} x={x} y={height + 14} fontSize={10} textAnchor="middle" className="fill-gray-500 dark:fill-gray-300">
            {reducedLabels ? reducedLabels[i] : i + 1}
          </text>
        );
      })}

      {/* Bars */}
      {reducedData.map((d, i) => {
        const barHeight = (d / safeMax) * height;
        const x = offsetX + i * barWidth;
        return (
          <rect
            key={i}
            x={x}
            y={height - barHeight}
            width={barWidth - 4}
            height={barHeight}
            fill="url(#barGradient)"
            rx={3}
            className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
          >
            <title>{reducedLabels ? `${reducedLabels[i]}: ${d}` : d}</title>
          </rect>
        );
      })}
    </svg>
  );
}
