interface PieChartProps {
  data: { value: number; color: string }[];
  size?: number;
}

export default function PieChart({ data, size = 150 }: PieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;
  const slices = data.map((slice, idx) => {
    const [startX, startY] = getCoordinates(cumulative / total, size);
    cumulative += slice.value;
    const [endX, endY] = getCoordinates(cumulative / total, size);
    const largeArc = slice.value / total > 0.5 ? 1 : 0;
    const pathData = `M ${size} ${size} L ${startX} ${startY} A ${size} ${size} 0 ${largeArc} 1 ${endX} ${endY} Z`;
    return <path key={idx} d={pathData} fill={slice.color} />;
  });
  return (
    <svg width={size * 2} height={size * 2} viewBox={`0 0 ${size * 2} ${size * 2}`} className="w-full">
      {slices}
    </svg>
  );
}

function getCoordinates(fraction: number, radius: number) {
  const x = radius + radius * Math.cos(2 * Math.PI * fraction - Math.PI / 2);
  const y = radius + radius * Math.sin(2 * Math.PI * fraction - Math.PI / 2);
  return [x, y];
}
