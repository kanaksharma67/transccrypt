import { Shield, Wifi, Bell, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";

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
];

export function FeaturesSection() {
  return (
    <section className="container py-20">
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .feature-card {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>

      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Key Features</h2>
        <p className="mx-auto max-w-2xl text-slate-400">
          Our platform combines cutting-edge blockchain technology with Fluvio's real-time data streaming for comprehensive financial solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {facilities.map((facility, index) => (
          <Card
            key={facility.title}
            className="feature-card bg-slate-800/50 border-slate-700 backdrop-blur-sm"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-slate-700/50 p-3">{facility.icon}</div>
              <h3 className="mb-2 text-xl font-medium text-white">{facility.title}</h3>
              <p className="text-slate-400">{facility.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}