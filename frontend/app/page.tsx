import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              x402 Payment Facilitator
            </h1>
            <p className="text-muted-foreground text-lg">
              Verify and process payments using the x402 protocol
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Facilitator: 0xf970...fba7b
            </div>
          </div>

          {/* Main Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Verify Payment</CardTitle>
                <CardDescription>
                  Verify that a payment meets the specified requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Endpoint: <code className="bg-secondary px-2 py-1 rounded">POST /verify</code>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Validates payment payloads against payment requirements
                  </p>
                </div>
                <Button className="w-full">
                  View Documentation
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Settle Payment</CardTitle>
                <CardDescription>
                  Process and finalize a verified payment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Endpoint: <code className="bg-secondary px-2 py-1 rounded">POST /settle</code>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Executes payment settlement on the blockchain
                  </p>
                </div>
                <Button className="w-full" variant="secondary">
                  View Documentation
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Supported Networks</CardTitle>
              <CardDescription>
                Compatible with Avalanche networks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {['Avalanche', 'Avalanche Fuji'].map((network) => (
                  <div
                    key={network}
                    className="flex items-center justify-center p-4 rounded-lg bg-secondary text-secondary-foreground"
                  >
                    {network}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Backend API</span>
                  <span className="text-sm text-green-600 dark:text-green-400">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">RPC Connection</span>
                  <span className="text-sm text-green-600 dark:text-green-400">Connected</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
