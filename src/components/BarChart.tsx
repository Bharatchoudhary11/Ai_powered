interface BarChartProps {
  data: number[];
  width?: number;
  height?: number;
}

export default function BarChart({ data, width = 300, height = 150 }: BarChartProps) {
  const axisPadding = 20;
  const max = data.length > 0 ? Math.max(...data) : 0;
  const safeMax = max > 0 ? max : 1;
  const barWidth = data.length > 0 ? width / data.length : width;
  const yTicks = 5;
  const xTickInterval = Math.max(1, Math.floor(data.length / 5));

  return (
    <svg width={width} height={height + axisPadding} className="w-full">
      {/* axes */}
      <line x1={0} y1={height} x2={width} y2={height} stroke="currentColor" strokeWidth={1} />
      <line x1={0} y1={0} x2={0} y2={height} stroke="currentColor" strokeWidth={1} />

      {/* Y axis ticks */}
      {Array.from({ length: yTicks }).map((_, i) => {
        const value = (safeMax / (yTicks - 1)) * i;
        const y = height - (value / safeMax) * height;
        return (
          <text
            key={i}
            x={-4}
            y={y + 4}
            fontSize={10}
            textAnchor="end"
          >
            {Math.round(value)}
          </text>
        );
      })}

      {/* X axis ticks */}
      {data.map((_, i) => {
        if (i % xTickInterval !== 0) return null;
        const x = i * barWidth + barWidth / 2;
        return (
          <text key={i} x={x} y={height + 12} fontSize={10} textAnchor="middle">
            {i + 1}
          </text>
        );
      })}

      {data.map((d, i) => {
        const barHeight = (d / safeMax) * height;
        return (
          <rect
            key={i}
            x={i * barWidth}
            y={height - barHeight}
            width={barWidth - 2}
            height={barHeight}
            fill="currentColor"
          />
        );
      })}
    </svg>
  );
}
