"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, Network, Server, Copy, ExternalLink } from "lucide-react";
import { createPublicClient, http, formatEther } from "viem";
import { toast } from "sonner";

const FACILITATOR_ADDRESS = "0xf970be6543cd20ff1f7570959949e31fa16fba7b" as const;

const networks = [
  {
    name: 'Avalanche',
    color: '#E84142',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    chainId: 43114,
  },
  {
    name: 'Avalanche Fuji',
    color: '#E84142',
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    chainId: 43113,
  }
];

const FACILITATOR_URL = "https://facilitator.x420.cloud";

export default function Home() {
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState<{
    status: string;
    timestamp?: string;
    environment?: string;
  } | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(true);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Address copied to clipboard");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy address");
    }
  };

  useEffect(() => {
    const fetchBalances = async () => {
      const balancePromises = networks.map(async (network) => {
        try {
          const client = createPublicClient({
            transport: http(network.rpcUrl),
          });

          const balance = await client.getBalance({
            address: FACILITATOR_ADDRESS,
          });

          return {
            network: network.name,
            balance: formatEther(balance),
          };
        } catch (error) {
          console.error(`Error fetching balance for ${network.name}:`, error);
          return {
            network: network.name,
            balance: "0.0000",
          };
        }
      });

      const results = await Promise.all(balancePromises);
      const balanceMap: Record<string, string> = {};
      results.forEach(({ network, balance }) => {
        balanceMap[network] = balance;
      });
      setBalances(balanceMap);
      setLoading(false);
    };

    fetchBalances();
  }, []);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch(`${FACILITATOR_URL}/health`);
        if (response.ok) {
          const data = await response.json();
          setHealthStatus(data);
        } else {
          setHealthStatus({ status: "unhealthy" });
        }
      } catch (error) {
        console.error("Error fetching health:", error);
        setHealthStatus({ status: "unhealthy" });
      } finally {
        setLoadingHealth(false);
      }
    };

    fetchHealth();
    // Refresh health status every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              x<span className="text-green-600 dark:text-green-400">4</span>
              <span className="text-green-600 dark:text-green-400 inline-block transform scale-x-[-1]">2</span>
              <span className="text-green-600 dark:text-green-400 inline-block transform scale-x-[-1]">0</span>
              {" "}Payment Facilitator
            </h1>
            <p className="text-muted-foreground">
              Implementing the x402 protocol for payment verification and settlement
            </p>
          </div>

          {/* Facilitator Info - Prominent */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Address Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <p className="text-sm font-medium text-muted-foreground">Facilitator Address</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="flex-1 min-w-0 px-4 py-3 h-12 bg-background border rounded-lg font-mono text-base font-semibold break-all flex items-center">
                      {FACILITATOR_ADDRESS}
                    </code>
                    <Button
                      variant="default"
                      size="lg"
                      onClick={() => copyToClipboard(FACILITATOR_ADDRESS)}
                      className="gap-2 w-36 h-12 cursor-pointer"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Address
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  {/* API URL Section */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Facilitator URL</p>
                    <div className="flex items-center gap-3">
                      <code className="flex-1 min-w-0 px-4 py-3 h-12 bg-background border rounded-lg font-mono text-base font-semibold break-all flex items-center">
                        {FACILITATOR_URL}
                      </code>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => window.open(FACILITATOR_URL, '_blank')}
                        className="gap-2 w-36 h-12 cursor-pointer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <CardTitle>Verify Payment</CardTitle>
                </div>
                <CardDescription>
                  Verify that a payment meets the specified requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Endpoint: <code className="bg-secondary px-2 py-1 rounded text-xs font-mono">POST /verify</code>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Validates payment payloads against payment requirements
                  </p>
                </div>
                <Button className="w-full cursor-pointer">
                  View Documentation
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  <CardTitle>Settle Payment</CardTitle>
                </div>
                <CardDescription>
                  Process and finalize a verified payment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Endpoint: <code className="bg-secondary px-2 py-1 rounded text-xs font-mono">POST /settle</code>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Executes payment settlement on the blockchain
                  </p>
                </div>
                <Button className="w-full cursor-pointer" variant="secondary">
                  View Documentation
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Supported Networks */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                <CardTitle>Supported Networks</CardTitle>
              </div>
              <CardDescription>
                Compatible with Avalanche networks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {networks.map((network) => {
                  const balance = balances[network.name] || "0.0000";
                  const displayBalance = loading ? "..." : Number.parseFloat(balance).toFixed(4);
                  
                  return (
                    <div
                      key={network.name}
                      className="flex items-center gap-3 rounded-lg border p-4"
                    >
                      <div className="h-10 w-10 rounded-full" style={{ backgroundColor: network.color }} />
                      <div className="flex-1">
                        <p className="font-semibold">{network.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Balance: <span className="font-mono">{displayBalance} AVAX</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  <CardTitle>System Status</CardTitle>
                </div>
                <Badge 
                  variant={healthStatus?.status === "healthy" ? "default" : "destructive"}
                  className={
                    healthStatus?.status === "healthy" 
                      ? "bg-green-600 hover:bg-green-600" 
                      : ""
                  }
                >
                  {loadingHealth ? "Checking..." : healthStatus?.status === "healthy" ? "Online" : "Offline"}
                </Badge>
              </div>
              <CardDescription>{FACILITATOR_URL}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">API Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant={healthStatus?.status === "healthy" ? "default" : "destructive"}
                      className={
                        healthStatus?.status === "healthy" 
                          ? "bg-green-600 hover:bg-green-600" 
                          : ""
                      }
                    >
                      {loadingHealth ? "..." : healthStatus?.status === "healthy" ? "Healthy" : "Unhealthy"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {healthStatus?.environment ? "Environment" : "Last check"}
                  </p>
                  <p className="text-sm font-medium mt-1">
                    {healthStatus?.environment || 
                     (healthStatus?.timestamp 
                       ? new Date(healthStatus.timestamp).toLocaleString("en-US")
                       : "N/A")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Footer Note */}
        <div className="text-center pt-8">
          <p className="text-xs text-muted-foreground">
            Built on the x402 protocol
          </p>
        </div>
      </div>
    </div>
  );
}
