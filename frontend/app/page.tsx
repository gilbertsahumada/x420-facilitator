import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, Network, Server } from "lucide-react";

export default function Home() {
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
            <div className="flex items-center gap-2 pt-2">
              <Badge variant="outline" className="gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Facilitator: 0xf970...fba7b
              </Badge>
            </div>
          </div>

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
                <Button className="w-full">
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
                <Button className="w-full" variant="secondary">
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
                {[
                  { name: 'Avalanche', color: '#E84142' },
                  { name: 'Avalanche Fuji', color: '#E84142' }
                ].map((network) => (
                  <div
                    key={network.name}
                    className="flex items-center gap-3 rounded-lg border p-4"
                  >
                    <div className="h-10 w-10 rounded-full" style={{ backgroundColor: network.color }} />
                    <div>
                      <p className="font-semibold">{network.name}</p>
                      <p className="text-sm text-muted-foreground">AVAX</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                <CardTitle>System Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Backend API</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="default" className="bg-green-600 hover:bg-green-600">Active</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">RPC Connection</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="default" className="bg-green-600 hover:bg-green-600">Connected</Badge>
                  </div>
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
