import React, { useMemo } from "react";

// Data for profile stats (you can adapt these as needed)
const statsData = [
  { label: "Jan", value: 65 },
  { label: "Feb", value: 59 },
  { label: "Mar", value: 80 },
  { label: "Apr", value: 81 },
  { label: "May", value: 56 },
  { label: "Jun", value: 55 },
  { label: "Jul", value: 40 },
  { label: "Aug", value: 72 },
  { label: "Sep", value: 85 },
  { label: "Oct", value: 90 },
  { label: "Nov", value: 75 },
  { label: "Dec", value: 95 },
];

const COLORS = {
  gradientFrom: "#8B5CF6", // vivid purple
  gradientTo: "#1EAEDB", // bright blue
  dot: "#F97316", // bright orange
  glow: "#f97316bb", // glowing shadow
  label: "#C4B5FD",
  grid: "#c4b5fd55",
  tooltipBg: "#241957e6",
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// Utility: get points for the SVG polyline
function getGraphPoints(data: { value: number }[], width: number, height: number, pad = 24) {
  const max = Math.max(...data.map(d => d.value), 100);
  const min = Math.min(...data.map(d => d.value), 0);

  return data.map((d, i) => {
    const x = lerp(pad, width - pad, i / (data.length - 1));
    const y =
      lerp(height - pad, pad, (d.value - min) / (max - min));
    return [x, y];
  });
}

export default function ProfileStatsGraph() {
  // SVG dimensions (responsive)
  const width = 480;
  const height = 220;
  const pad = 32;
  const points = useMemo(
    () => getGraphPoints(statsData, width, height, pad),
    []
  );
  const polyline = points.map(p => p.join(',')).join(' ');

  // Animate line draw with stroke-dasharray
  const lineLength = useMemo(() => {
    let length = 0;
    for (let i = 1; i < points.length; i++) {
      const [x1, y1] = points[i - 1];
      const [x2, y2] = points[i];
      length += Math.hypot(x2 - x1, y2 - y1);
    }
    return length;
  }, [points]);

  return (
    <div className="relative rounded-2xl card-gradient shadow-lg px-4 py-8 md:p-10 overflow-visible w-full">
      {/* Neon Aurora Glowing BG */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background: "radial-gradient(ellipse at 50% 60%, #9045eb55 0%, #1eaedb22 60%, transparent 100%)",
          filter: "blur(12px)",
        }}
      />
      {/* Graph Labels (title) */}
      <h2 className="text-xl font-bold text-gradient-primary">Account Stats</h2>
      <p className="mb-6 text-sm text-gray-400">Your monthly activity, visualized beautifully 🎨</p>

      {/* Responsive container, center the SVG */}
      <div className="w-full flex justify-center">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[500px]"
        >
          {/* Glow below line (filter & blurred path) */}
          <defs>
            <linearGradient id="stats-aurora" x1="0" y1="0" x2={width} y2={0} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={COLORS.gradientFrom} />
              <stop offset="100%" stopColor={COLORS.gradientTo} />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor={COLORS.glow} floodOpacity="1" />
            </filter>
          </defs>
          {/* Faded Grid Lines */}
          {[1, 2, 3, 4, 5].map(i => (
            <line
              key={i}
              x1={pad}
              x2={width - pad}
              y1={lerp(pad, height - pad, i / 5)}
              y2={lerp(pad, height - pad, i / 5)}
              stroke={COLORS.grid}
              strokeDasharray="4,8"
              strokeWidth={1}
            />
          ))}
          {/* Animated Line Path */}
          <polyline
            points={polyline}
            fill="none"
            stroke="url(#stats-aurora)"
            strokeWidth={5}
            style={{
              filter: "url(#glow)",
              strokeDasharray: lineLength,
              strokeDashoffset: 0,
              animation: "profile-graph-draw 1.7s cubic-bezier(.6,0,.48,1) forwards",
            }}
          />
          {/* Draw circles & simple tooltip on hover */}
          {points.map(([x, y], i) => (
            <g key={i}>
              {/* Dot shadow */}
              <circle
                cx={x}
                cy={y}
                r={11}
                fill="none"
                style={{
                  filter: "blur(7px)",
                  opacity: 0.5,
                }}
                stroke={COLORS.dot}
                strokeWidth="2"
              />
              {/* Animated Dot */}
              <circle
                className="transition-transform duration-200"
                cx={x}
                cy={y}
                r={7}
                fill={COLORS.dot}
                stroke="#fff"
                strokeWidth="2"
                style={{
                  transitionDelay: `${0.18 + i * 0.04}s`,
                  opacity: 1,
                  transform: "scale(1)",
                }}
              >
                <animate
                  attributeName="r"
                  from="0"
                  to="7"
                  dur="0.45s"
                  begin={`${0.13 + i * 0.06}s`}
                  fill="freeze"
                  keySplines=".59,0,.58,1"
                  calcMode="spline"
                />
              </circle>
              {/* Month label below dot */}
              <text
                x={x}
                y={height - 7}
                fill={COLORS.label}
                fontSize="13"
                fontWeight={500}
                textAnchor="middle"
                style={{
                  userSelect: "none",
                  filter: "drop-shadow(0 1px 1px #fff8)",
                  textShadow: "0 1px 2px #fff6",
                }}
              >
                {statsData[i].label}
              </text>
              {/* Value above dot */}
              <text
                x={x}
                y={y - 14}
                fill="#f8fafc"
                fontSize="14"
                fontWeight={600}
                textAnchor="middle"
                className="opacity-70"
                style={{
                  userSelect: "none",
                  letterSpacing: 1,
                  textShadow: "0 1px 5px #0006",
                }}
              >
                {statsData[i].value}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Custom keyframes for line animation */}
      <style>{`
        @keyframes profile-graph-draw {
          0% { stroke-dashoffset: ${lineLength}px; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}