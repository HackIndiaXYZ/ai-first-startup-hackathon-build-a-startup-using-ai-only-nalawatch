import React from 'react';

// Lightweight SVG bar chart for the landing dashboard preview
export default function BarChart({ data = [5, 8, 12, 9, 16], width = 300, height = 140 }) {
  const max = Math.max(...data);
  const barWidth = Math.floor(width / data.length) - 8;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Threats over time chart">
      {data.map((v, i) => {
        const barHeight = (v / max) * (height - 20);
        const x = i * (barWidth + 8) + 8;
        const y = height - barHeight - 12;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx="8"
              fill="url(#grad)"
              style={{ transition: 'height 600ms ease, y 600ms ease' }}
            />
          </g>
        );
      })}

      <defs>
        <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#8fd8ff" />
          <stop offset="100%" stopColor="#8d6bff" />
        </linearGradient>
      </defs>
    </svg>
  );
}
