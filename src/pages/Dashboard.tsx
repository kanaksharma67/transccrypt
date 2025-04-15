"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import { ArrowRight, Shield, Wifi, Bell, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ContainerScroll } from "@/components/ui/container-scroll-animation"

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger)

export default function Dashboard() {
  const facilitiesRef = useRef(null)
  const facilityCardsRef = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    gsap.from(facilityCardsRef.current, {
      scrollTrigger: {
        trigger: facilitiesRef.current,
        start: "top 80%",
        toggleActions: "play none none reset",
      },
      opacity: 0,
      y: 50,
      stagger: 0.2,
      duration: 1,
      ease: "power2.out",
    })
  }, [])

  const facilities = [
    {
      icon: <Shield className="h-8 w-8 text-emerald-400" />,
      title: "Blockchain Security",
      description: "Enterprise-grade encryption and blockchain verification for every transaction",
    },
    {
      icon: <Wifi className="h-8 w-8 text-sky-400" />,
      title: "Offline Transactions",
      description: "Complete payments anywhere, even without internet connectivity",
    },
    {
      icon: <Bell className="h-8 w-8 text-amber-400" />,
      title: "Real-time Sync",
      description: "Instant notifications and balance updates when back online",
    },
    {
      icon: <RefreshCw className="h-8 w-8 text-purple-400" />,
      title: "Currency Conversion",
      description: "Seamless exchange between multiple currencies and crypto assets",
    },
  ]

  return (
    <div className="w-full">
      {/* Background effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500 opacity-20 blur-3xl" />
        <div className="absolute top-1/3 -left-40 h-80 w-80 rounded-full bg-purple-500 opacity-20 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <ContainerScroll
            titleComponent={
              <>
                <h1 className="mb-6 bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
                  Your Offline Payment Solution
                  <span className="mt-2 block text-white">
                    <span className="text-sky-400">Trans</span>
                    <span className="text-emerald-400">Crypt</span>
                  </span>
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-300">
                  TransCrypt is a next-generation blockchain-powered payment solution designed to empower users with secure,
                  fast, and reliable transactions—even without an internet connection.
                </p>
                <div className="mb-16 flex flex-wrap justify-center gap-4">
                  <Button
                    onClick={() => {}}
                    className="rounded-lg bg-gradient-to-r from-sky-400 to-blue-500 px-8 py-6 text-lg font-medium text-white hover:from-sky-500 hover:to-blue-600"
                  >
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-lg border border-slate-700 px-8 py-6 text-lg font-medium text-white hover:bg-slate-800"
                  >
                    Learn More
                  </Button>
                </div>
              </>
            }
          >
            {/* Dashboard Preview */}
            <div className="mx-auto max-w-5xl overflow-hidden rounded-xl bg-slate-900/50 backdrop-blur-sm">
              <div className="relative p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm font-medium text-slate-400">TransCrypt Dashboard</div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="md:col-span-2 rounded-lg bg-slate-800/50 p-4 backdrop-blur-sm">
                    <div className="mb-2 text-sm text-slate-400">Total Balance</div>
                    <div className="text-3xl font-bold text-white">$12,458.32</div>
                    <div className="mt-2 flex items-center text-sm text-emerald-400">
                      <ArrowRight className="mr-1 h-3 w-3 rotate-45" />
                      +2.4% from last week
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-800/50 p-4 backdrop-blur-sm">
                    <div className="mb-2 text-sm text-slate-400">Status</div>
                    <div className="flex items-center text-lg font-medium text-emerald-400">
                      <div className="mr-2 h-2 w-2 rounded-full bg-emerald-400"></div>
                      Online
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-slate-800/50 p-4 backdrop-blur-sm">
                  <div className="mb-4 text-sm font-medium text-slate-400">Recent Transactions</div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center justify-between rounded-md bg-slate-700/50 p-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-slate-600"></div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {["Coffee Shop", "Grocery Store", "Salary Deposit", "Subscription"][i - 1]}
                            </div>
                            <div className="text-xs text-slate-400">
                              {["Today", "Yesterday", "May 15", "May 12"][i - 1]}
                            </div>
                          </div>
                        </div>
                        <div className={`text-sm font-medium ${i === 3 ? "text-emerald-400" : "text-red-400"}`}>
                          {i === 3 ? "+$2,750.00" : `-$${(i * 12.5).toFixed(2)}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ContainerScroll>
        </section>

        {/* Facilities Section */}
        <section className="bg-slate-950/50 py-20">
          <div className="container mx-auto px-4">
            <div ref={facilitiesRef} className="mx-auto max-w-6xl">
              <div className="mb-16 text-center">
                <h2 className="mb-2 text-3xl font-bold text-white">Facilities We Provide</h2>
                <p className="text-slate-400">Powerful features to revolutionize your payment experience</p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {facilities.map((facility, i) => (
                  <Card
                    key={i}
                    ref={(el) => (facilityCardsRef.current[i] = el)}
                    className="overflow-hidden border-slate-800 bg-gradient-to-br from-slate-800 to-slate-900 p-0 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-sky-900/20"
                  >
                    <div className="p-6">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-950/50 backdrop-blur-sm">
                        {facility.icon}
                      </div>
                      <h3 className="mb-2 text-xl font-semibold text-white">{facility.title}</h3>
                      <p className="text-slate-400">{facility.description}</p>
                    </div>
                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-50"></div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}