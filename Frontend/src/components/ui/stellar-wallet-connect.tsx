/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet } from "lucide-react";
import { toast } from "sonner";
import stellarTrader from "@/lib/stellar-client";

export function StellarWalletConnect() {
  const [publicKey, setPublicKey] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletBalance, setWalletBalance] = useState<{xlm: string, usd: string} | null>(null);

  const handleConnect = async () => {
    if (!publicKey) {
      toast.error("Please enter a wallet address");
      return;
    }

    setIsConnecting(true);
    try {
      const account = await stellarTrader.server.loadAccount(publicKey);
      const xlmBalance = account.balances.find((b: any) => b.asset_type === 'native')?.balance || '0';
      const usdBalance = account.balances.find((b: any) => b.asset_code === 'USD')?.balance || '0';
      
      setWalletBalance({
        xlm: xlmBalance,
        usd: usdBalance
      });
      
      toast.success("Successfully connected to Stellar wallet");
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error("Failed to connect to wallet. Please check the address and try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="h-5 w-5 text-sky-400" />
        <h3 className="text-lg font-medium text-white">Stellar Wallet</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-slate-400 mb-1 block">
            Enter Stellar Wallet Address
          </label>
          <Input
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            placeholder="G..."
            className="bg-slate-700/50 border-slate-600 text-white"
          />
        </div>

        <Button
          onClick={handleConnect}
          disabled={isConnecting || !publicKey}
          className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600"
        >
          {isConnecting ? (
            "Connecting..."
          ) : (
            <>Connect Wallet</>
          )}
        </Button>

        {walletBalance && (
          <div className="mt-4 p-3 rounded-lg bg-slate-700/50 border border-slate-600">
            <div className="flex items-center gap-2 mb-2">
              
              <span className="text-sm text-emerald-400">Wallet Connected</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">XLM Balance:</span>
                <span className="text-white">{walletBalance.xlm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">USD Balance:</span>
                <span className="text-white">{walletBalance.usd}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
