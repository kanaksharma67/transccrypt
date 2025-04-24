import { useEffect } from "react";
import { DashboardHeader } from "./dashboard/DasboardHeader";
import { MarketCharts } from "./dashboard/MarketCharts";
import { FeaturesSection } from "./dashboard/FeaturesSection";
import WorldMapDemo from "./ui/world-map-demo";
import { DebugPanel } from "./ui/debug-panel";

export default function Dashboard() {
  useEffect(() => {
    console.log("Dashboard component mounted");
    
    return () => {
      console.log("Dashboard component unmounted");
    };
  }, []);

  return (
    <div className="w-full">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500 opacity-20 blur-3xl" />
        <div className="absolute top-1/3 -left-40 h-80 w-80 rounded-full bg-purple-500 opacity-20 blur-3xl" />
      </div>

      <div className="relative z-10">
        <DashboardHeader />
        <MarketCharts />
        <FeaturesSection />
        <section className="container">
          <WorldMapDemo />
        </section>
      </div>
      
      {/* Debug panel */}
      <DebugPanel />
    </div>
  );
}
