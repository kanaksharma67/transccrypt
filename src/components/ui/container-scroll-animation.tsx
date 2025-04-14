import React, { useRef, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ContainerScrollProps {
  titleComponent: React.ReactNode
  children: React.ReactNode
}

export const ContainerScroll: React.FC<ContainerScrollProps> = ({
  titleComponent,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const scaleDimensions = useTransform(scrollYProgress, [0, 1], [1, 0.8])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  return (
    <div
      ref={containerRef}
      className="relative min-h-[120vh] w-full overflow-hidden"
    >
      <motion.div
        style={{
          scale: scaleDimensions,
          opacity: opacity,
        }}
        className="fixed left-0 top-0 flex min-h-screen w-full items-center justify-center"
      >
        <div className="mx-auto max-w-6xl px-4 text-center">
          {titleComponent}
        </div>
      </motion.div>

      <div className="relative mt-[100vh] bg-transparent">
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  )
}