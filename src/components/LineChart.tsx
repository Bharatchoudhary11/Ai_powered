interface LineChartProps {
  data: number[];
  labels?: string[];
  width?: number;
  height?: number;
}

export default function LineChart({ data, labels, width = 300, height = 150 }: LineChartProps) {
  const axisPadding = 20;
  const max = Math.max(...data);
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (d / max) * height;
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
        const value = (max / (yTicks - 1)) * i;
        const y = height - (value / max) * height;
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
        const x = (i / (data.length - 1)) * width;
        return (
          <text key={i} x={x} y={height + 12} fontSize={10} textAnchor="middle">
            {labels ? labels[i] : i + 1}
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
