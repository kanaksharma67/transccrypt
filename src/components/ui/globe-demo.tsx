"use client"

import { motion } from "framer-motion"
import { lazy, Suspense } from "react"

// Lazy load the World component from the globe file
const World = lazy(() =>
  import("@/components/ui/globe").then((mod) => ({ default: mod.World }))
)

const data = [
  {
    id: 1,
    title: "You",
    color: "red",
  },
  {
    id: 2,
    title: "Recipient",
    color: "blue",
  },
]

const globeConfig = {
  pointSize: 4,
  globeColor: "#062056",
  showAtmosphere: true,
  atmosphereColor: "#FFFFFF",
  atmosphereAltitude: 0.1,
  emissive: "#062056",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: "rgba(255,255,255,0.7)",
  ambientLight: "#38bdf8",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 1000,
  arcLength: 0.9,
  arcColor: ["#38bdf8", "#ffffff"],
  arcDashLength: 0.4,
  arcDashGap: 4,
  arcDashInitialGap: 2,
  arcDashAnimateTime: 1000,
  labelsData: [],
  labelColor: "#fff",
  labelDotRadius: 0.4,
  labelSize: 1.5,
  labelText: "name",
  labelResolution: 2,
}

export default function GlobeDemo() {
  return (
    <div className="h-[40rem] w-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="h-full w-full"
      >
        <Suspense fallback={<div className="text-white">Loading globe...</div>}>
          <World data={data} globeConfig={globeConfig} />
        </Suspense>
      </motion.div>
    </div>
  )
}
