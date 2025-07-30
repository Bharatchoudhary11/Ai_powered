interface LineChartProps {
  data: number[];
  width?: number;
  height?: number;
}

export default function LineChart({ data, width = 300, height = 150 }: LineChartProps) {
  const axisPadding = 20;
  const max = data.length > 0 ? Math.max(...data) : 0;
  const safeMax = max > 0 ? max : 1;
  const denom = Math.max(1, data.length - 1);
  const points = data
    .map((d, i) => {
      const x = (i / denom) * width;
      const y = height - (d / safeMax) * height;
      return `${x},${y}`;
    })
    .join(' ');

  const yTicks = 5;
  const xTickInterval = Math.max(1, Math.floor((data.length - 1) / 4));

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
        const x = (i / denom) * width;
        return (
          <text key={i} x={x} y={height + 12} fontSize={10} textAnchor="middle">
            {i + 1}
          </text>
        );
      })}

      {/* line */}
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        points={points}
      />
    </svg>
  );
}
