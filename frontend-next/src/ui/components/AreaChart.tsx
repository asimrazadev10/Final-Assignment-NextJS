'use client';

import { useMemo, useRef, useState, MouseEvent } from "react";

interface AreaChartProps {
  data?: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  grid?: boolean;
}

export default function AreaChart({
  data = [],
  width = 720,
  height = 220,
  stroke = "#a78bfa",
  fill = "#a78bfa",
  grid = true,
}: AreaChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { pathD, areaD, xPositions, yPositions, min, max } = useMemo(() => {
    if (!data || data.length === 0) return {};
    const minV = Math.min(...data);
    const maxV = Math.max(...data);
    const range = maxV - minV || 1;
    const stepX = width / (data.length - 1);

    const xs = data.map((_, i) => i * stepX);
    const ys = data.map((v) => height - ((v - minV) / range) * height);
    const d = data
      .map((v, i) => `${i === 0 ? "M" : "L"}${xs[i]},${ys[i]}`)
      .join(" ");
    const area = `M0,${height} ${d.replace(/^M/, "L")} L${width},${height} Z`;
    return {
      pathD: d,
      areaD: area,
      xPositions: xs,
      yPositions: ys,
      min: minV,
      max: maxV,
    };
  }, [data, height, width]);

  if (!data || data.length === 0) return null;

  // TypeScript check: ensure arrays exist before access
  const hoverX = (hoverIndex !== null && xPositions) ? xPositions[hoverIndex] : 0;
  const hoverY = (hoverIndex !== null && yPositions) ? yPositions[hoverIndex] : 0;

  function handleMouseMove(e: MouseEvent<SVGSVGElement>) {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const idx = Math.round((x / width) * (data.length - 1));
    setHoverIndex(Math.max(0, Math.min(data.length - 1, idx)));
  }

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIndex(null)}
        className="w-full h-auto"
        aria-label="Usage area chart"
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={fill} stopOpacity="0.35" />
            <stop offset="100%" stopColor={fill} stopOpacity="0" />
          </linearGradient>
        </defs>

        {grid && (
          <g stroke="#2a2a2a" strokeWidth="1">
            {Array.from({ length: 4 }).map((_, i) => (
              <line
                key={i}
                x1="0"
                x2={width}
                y1={(height / 4) * i}
                y2={(height / 4) * i}
              />
            ))}
          </g>
        )}

        <path d={areaD} fill="url(#areaGradient)" />
        <path
          d={pathD}
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {hoverIndex != null && (
          <g>
            <line
              x1={hoverX}
              x2={hoverX}
              y1={0}
              y2={height}
              stroke="#ffffff22"
            />
            <circle cx={hoverX} cy={hoverY} r="4" fill="#fff" />
          </g>
        )}
      </svg>

      {hoverIndex != null && (
        <div
          className="absolute -translate-x-1/2 -translate-y-full px-2 py-1 rounded bg-black/80 border border-white/10 text-xs text-white pointer-events-none"
          style={{ left: `${hoverX}px`, top: `${hoverY}px` }}
        >
          {data[hoverIndex]}
        </div>
      )}
      <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
        <span>Min: {min}</span>
        <span>Max: {max}</span>
      </div>
    </div>
  );
}