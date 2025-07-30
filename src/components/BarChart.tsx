interface BarChartProps {
  data: number[];
  width?: number;
  height?: number;
}

export default function BarChart({ data, width = 300, height = 150 }: BarChartProps) {
  const max = Math.max(...data);
  const barWidth = width / data.length;
  return (
    <svg width={width} height={height} className="w-full">
      {data.map((d, i) => {
        const barHeight = (d / max) * height;
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
