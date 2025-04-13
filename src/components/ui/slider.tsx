import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    variant?: 'default' | 'purple' | 'gradient' | 'teal';
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const variantStyles = {
    default: {
      track: "bg-secondary",
      range: "bg-primary",
      thumb: "border-primary"
    },
    purple: {
      track: "bg-purple-200/30",
      range: "bg-purple-500",
      thumb: "border-purple-500 hover:border-purple-600"
    },
    gradient: {
      track: "bg-gradient-to-r from-purple-300/30 to-indigo-300/30",
      range: "bg-gradient-to-r from-purple-500 to-indigo-500",
      thumb: "border-transparent bg-gradient-to-r from-purple-500 to-indigo-500"
    },
    teal: {
      track: "bg-teal-100/30 dark:bg-teal-900/30",
      range: "bg-gradient-to-r from-teal-400 to-teal-500",
      thumb: "border-teal-500 hover:border-teal-600 bg-white dark:bg-zinc-950 shadow-teal-500/20"
    }
  };

  const currentVariant = variantStyles[variant];

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center group",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track 
        className={cn(
          "relative h-2 w-full grow overflow-hidden rounded-full transition-all duration-300",
          currentVariant.track,
          "group-hover:scale-x-[1.02]"
        )}
      >
        <SliderPrimitive.Range 
          className={cn(
            "absolute h-full transition-all duration-300 ease-out",
            currentVariant.range
          )} 
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb 
        className={cn(
          "block h-5 w-5 rounded-full border-2 bg-background",
          "ring-offset-background transition-all duration-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "hover:scale-110 group-hover:shadow-lg",
          currentVariant.thumb
        )} 
      />
    </SliderPrimitive.Root>
  )
})

Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }