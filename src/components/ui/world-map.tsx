"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import DottedMap from "dotted-map"

import { useTheme } from "next-themes"

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string }
    end: { lat: number; lng: number; label?: string }
  }>
  lineColor?: string
}

export default function WorldMap({ dots = [], lineColor = "#0ea5e9" }: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const map = new DottedMap({ height: 100, grid: "diagonal" })

  const { theme } = useTheme()

  // Increase dot opacity for better visibility
  const svgMap = map.getSVG({
    radius: 0.25, // Slightly larger dots
    color: theme === "dark" ? "#FFFFFF70" : "#00000070", // Increased opacity from 40 to 70
    shape: "circle",
    backgroundColor: "transparent", // Keep transparent background as requested
  })

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360)
    const y = (90 - lat) * (400 / 180)
    return { x, y }
  }

  const createCurvedPath = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const midX = (start.x + end.x) / 2
    const midY = Math.min(start.y, end.y) - 50
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`
  }

  return (
    <div className="w-full aspect-[2/1] bg-transparent rounded-lg relative font-sans">
      {/* Add a subtle overlay to make the map more visible */}
      <div className="absolute inset-0 bg-slate-900/20 rounded-lg backdrop-blur-[1px]"></div>

      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none relative z-10"
        alt="world map"
        height="495"
        width="1056"
        draggable={false}
      />
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="w-full h-full absolute inset-0 pointer-events-none select-none z-20"
      >
        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng)
          const endPoint = projectPoint(dot.end.lat, dot.end.lng)
          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1.5" // Increased from 1 to 1.5
                initial={{
                  pathLength: 0,
                }}
                animate={{
                  pathLength: 1,
                }}
                transition={{
                  duration: 1,
                  delay: 0.5 * i,
                  ease: "easeOut",
                }}
                key={`start-upper-${i}`}
                className="drop-shadow-[0_0_3px_rgba(14,165,233,0.3)]" // Add subtle glow
              ></motion.path>
            </g>
          )
        })}

        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {dots.map((dot, i) => (
          <g key={`points-group-${i}`}>
            <g key={`start-${i}`}>
              <circle
                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                r="3" // Increased from 2 to 3
                fill={lineColor}
                className="drop-shadow-[0_0_3px_rgba(14,165,233,0.5)]" // Add glow
              />
              <circle
                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                r="3" // Increased from 2 to 3
                fill={lineColor}
                opacity="0.6" // Increased from 0.5 to 0.6
                className="drop-shadow-[0_0_3px_rgba(14,165,233,0.5)]" // Add glow
              >
                <animate attributeName="r" from="3" to="10" dur="1.5s" begin="0s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" begin="0s" repeatCount="indefinite" />
              </circle>
            </g>
            <g key={`end-${i}`}>
              <circle
                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                r="3" // Increased from 2 to 3
                fill={lineColor}
                className="drop-shadow-[0_0_3px_rgba(14,165,233,0.5)]" // Add glow
              />
              <circle
                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                r="3" // Increased from 2 to 3
                fill={lineColor}
                opacity="0.6" // Increased from 0.5 to 0.6
                className="drop-shadow-[0_0_3px_rgba(14,165,233,0.5)]" // Add glow
              >
                <animate attributeName="r" from="3" to="10" dur="1.5s" begin="0s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" begin="0s" repeatCount="indefinite" />
              </circle>
            </g>
          </g>
        ))}
      </svg>
    </div>
  )
}
