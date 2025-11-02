"use client"

import * as React from "react"

import { useState, useMemo } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

import { Activity, Server, TrendingUp, Copy, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"

import { useTheme } from "next-themes"

import { createPublicClient, http, formatEther } from "viem"

import { FACILITATOR_ADDRESS, SUPPORTED_CHAINS } from "@/lib/constants"



// Mock server data

const serverInfo = {

  url: "https://facilitator.blockchain.io",

  status: "online",

  uptime: "99.9%",

  lastCheck: new Date().toISOString(),

}



// Mock transaction data generator

const generateMockTransactions = () => {

  const transactions = []

  const chains = SUPPORTED_CHAINS.filter(c => c.enabled).map(c => c.id)



  for (let i = 0; i < 50; i++) {

    const date = new Date()

    date.setDate(date.getDate() - Math.floor(Math.random() * 30))



    transactions.push({

      id: `0x${Math.random().toString(16).substr(2, 64)}`,

      chain: chains[Math.floor(Math.random() * chains.length)],

      amount: (Math.random() * 10).toFixed(4),

      fee: (Math.random() * 0.1).toFixed(6),

      timestamp: date.toISOString(),

      status: Math.random() > 0.1 ? "success" : "pending",

      from: `0x${Math.random().toString(16).substr(2, 40)}`,

      to: `0x${Math.random().toString(16).substr(2, 40)}`,

    })

  }



  return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

}



const mockTransactions = generateMockTransactions()



export default function BlockchainDashboard() {

  const { theme, resolvedTheme } = useTheme()

  const [selectedChain, setSelectedChain] = useState<string>("all")

  const [currentPage, setCurrentPage] = useState<number>(1)

  const [timeFilter, setTimeFilter] = useState<string>("all")

  const [balances, setBalances] = useState<Record<string, string>>({})

  const [loadingBalances, setLoadingBalances] = useState(true)

  const itemsPerPage = 10

  // Fetch balances on mount

  React.useEffect(() => {

    const fetchBalances = async () => {

      const enabledChains = SUPPORTED_CHAINS.filter(c => c.enabled);

      const balancePromises = enabledChains.map(async (chain) => {

        try {

          const client = createPublicClient({

            transport: http(chain.rpcUrl),

          })



          const balance = await client.getBalance({

            address: FACILITATOR_ADDRESS,

          })



          return {

            chainId: chain.id,

            balance: formatEther(balance),

          }

        } catch (error) {

          console.error(`Error fetching balance for ${chain.name}:`, error)

          return {

            chainId: chain.id,

            balance: "0.0000",

          }

        }

      })



      const results = await Promise.all(balancePromises)

      const balanceMap: Record<string, string> = {}

      results.forEach(({ chainId, balance }) => {

        balanceMap[chainId] = balance

      })

      setBalances(balanceMap)

      setLoadingBalances(false)

    }



    fetchBalances()

  }, [])

  // Get tick color based on theme (use resolvedTheme to handle system theme)

  const tickColor = React.useMemo(() => {

    const currentTheme = resolvedTheme || theme

    return currentTheme === "dark" ? "#fafafa" : "#0a0a0a"

  }, [theme, resolvedTheme])

  // Copy to clipboard function

  const copyToClipboard = async (text: string) => {

    try {

      await navigator.clipboard.writeText(text)

    } catch (err) {

      console.error("Failed to copy:", err)

    }

  }

  // Get snowtrace URL based on chain

  const getSnowtraceUrl = (hash: string, chainId: string) => {

    if (chainId === "avalanche-fuji") {

      return `https://testnet.snowtrace.io/tx/${hash}`

    }

    return `https://snowtrace.io/tx/${hash}`

  }



  // Filter transactions by chain

  const filteredTransactions = useMemo(() => {

    if (selectedChain === "all") return mockTransactions

    return mockTransactions.filter((tx) => tx.chain === selectedChain)

  }, [selectedChain])

  // Reset to page 1 when filter changes

  React.useEffect(() => {

    setCurrentPage(1)

  }, [selectedChain])

  // Calculate pagination

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage

  const endIndex = startIndex + itemsPerPage

  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)



  // Generate data for daily transaction chart with time filter

  const chartData = useMemo(() => {

    const now = new Date()

    let filteredByTime = filteredTransactions



    // Apply time filter

    if (timeFilter !== "all") {

      const filterDate = new Date()

      switch (timeFilter) {

        case "24h":

          filterDate.setHours(now.getHours() - 24)

          break

        case "7d":

          filterDate.setDate(now.getDate() - 7)

          break

        case "30d":

          filterDate.setDate(now.getDate() - 30)

          break

      }

      filteredByTime = filteredTransactions.filter((tx) => {

        const txDate = new Date(tx.timestamp)

        return txDate >= filterDate

      })

    }



    const txByDate: Record<string, number> = {}



    filteredByTime.forEach((tx) => {

      const date = new Date(tx.timestamp).toLocaleDateString("en-US", {

        month: "short",

        day: "numeric",

      })

      txByDate[date] = (txByDate[date] || 0) + 1

    })



    const sortedData = Object.entries(txByDate)

      .map(([date, count]) => ({ date, count }))

      .reverse()



    // For 24h, show by hour instead of day

    if (timeFilter === "24h") {

      const txByHour: Record<string, number> = {}

      filteredByTime.forEach((tx) => {

        const date = new Date(tx.timestamp)

        const hourKey = `${date.getHours()}:00`

        txByHour[hourKey] = (txByHour[hourKey] || 0) + 1

      })

      return Object.entries(txByHour)

        .map(([hour, count]) => ({ date: hour, count }))

        .sort((a, b) => a.date.localeCompare(b.date))

    }



    return sortedData

  }, [filteredTransactions, timeFilter])



  // Calculate statistics

  const stats = useMemo(() => {

    const totalAmount = filteredTransactions.reduce((sum, tx) => sum + Number.parseFloat(tx.amount), 0)

    const totalFees = filteredTransactions.reduce((sum, tx) => sum + Number.parseFloat(tx.fee), 0)



    return {

      totalTransactions: filteredTransactions.length,

      totalAmount: totalAmount.toFixed(4),

      totalFees: totalFees.toFixed(6),

    }

  }, [filteredTransactions])



  return (

    <div className="min-h-screen bg-background p-4 md:p-8">

      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}

        <div className="space-y-2">

          <h1 className="text-4xl font-bold tracking-tight">
            x<span className="text-green-600 dark:text-green-400">4</span>
            <span className="text-green-600 dark:text-green-400 inline-block transform scale-x-[-1]">2</span>
            <span className="text-green-600 dark:text-green-400 inline-block transform scale-x-[-1]">0</span>
            {" "}Facilitator
          </h1>

          <p className="text-muted-foreground">Transaction monitor and server status</p>

        </div>



        {/* Server Status Card */}

        <Card>

          <CardHeader>

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2">

                <Server className="h-5 w-5" />

                <CardTitle>Server Status</CardTitle>

              </div>

              <Badge variant={serverInfo.status === "online" ? "default" : "destructive"}>

                {serverInfo.status === "online" ? "Online" : "Offline"}

              </Badge>

            </div>

            <CardDescription>{serverInfo.url}</CardDescription>

          </CardHeader>

          <CardContent>

            <div className="grid gap-4 md:grid-cols-2">

              <div>

                <p className="text-sm text-muted-foreground">Uptime</p>

                <p className="text-2xl font-bold">{serverInfo.uptime}</p>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">Last check</p>

                <p className="text-sm font-medium">{new Date(serverInfo.lastCheck).toLocaleString("en-US")}</p>

              </div>

            </div>

          </CardContent>

        </Card>



        {/* Supported Chains */}

        <Card>

          <CardHeader>

            <CardTitle>Supported Blockchain Networks</CardTitle>

            <CardDescription>Blockchains available on the facilitator</CardDescription>

          </CardHeader>

          <CardContent>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

              {SUPPORTED_CHAINS.map((chain) => {

                const balance = balances[chain.id] || "0.0000"

                const displayBalance = loadingBalances ? "..." : Number.parseFloat(balance).toFixed(4)

                const isEnabled = chain.enabled ?? true

                return (

                  <div key={chain.id} className={`flex items-center gap-3 rounded-lg border p-4 ${!isEnabled ? "opacity-60" : ""}`}>

                    <div className="h-10 w-10 rounded-full" style={{ backgroundColor: chain.color }} />

                    <div className="flex-1">

                      <div className="flex items-center gap-2">

                        <p className="font-semibold">{chain.name}</p>

                        {!isEnabled && (

                          <Badge variant="secondary" className="text-xs">

                            SOON

                          </Badge>

                        )}

                      </div>

                      {isEnabled ? (

                        <p className="text-sm text-muted-foreground">

                          Balance: <span className="font-mono">{displayBalance} {chain.symbol}</span>

                        </p>

                      ) : (

                        <p className="text-sm text-muted-foreground">

                          Coming soon

                        </p>

                      )}

                    </div>

                  </div>

                )

              })}

            </div>

          </CardContent>

        </Card>



        {/* Stats Cards */}

        <div className="grid gap-4 md:grid-cols-3">

          <Card className="relative">

            <div className="absolute top-2 right-2 z-10">

              <Badge variant="secondary" className="text-xs">

                SOON

              </Badge>

            </div>

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>

              <Activity className="h-4 w-4 text-muted-foreground" />

            </CardHeader>

            <CardContent>

              <div className="text-2xl font-bold opacity-60">{stats.totalTransactions}</div>

            </CardContent>

          </Card>

          <Card className="relative">

            <div className="absolute top-2 right-2 z-10">

              <Badge variant="secondary" className="text-xs">

                SOON

              </Badge>

            </div>

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>

              <TrendingUp className="h-4 w-4 text-muted-foreground" />

            </CardHeader>

            <CardContent>

              <div className="text-2xl font-bold opacity-60">{stats.totalAmount}</div>

              <p className="text-xs text-muted-foreground">AVAX equivalent</p>

            </CardContent>

          </Card>

          <Card className="relative">

            <div className="absolute top-2 right-2 z-10">

              <Badge variant="secondary" className="text-xs">

                SOON

              </Badge>

            </div>

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

              <CardTitle className="text-sm font-medium">Total Fees</CardTitle>

              <TrendingUp className="h-4 w-4 text-muted-foreground" />

            </CardHeader>

            <CardContent>

              <div className="text-2xl font-bold opacity-60">{stats.totalFees}</div>

              <p className="text-xs text-muted-foreground">AVAX equivalent</p>

            </CardContent>

          </Card>

        </div>



        {/* Transactions Chart */}

        <Card className="relative">

          <div className="absolute top-4 right-4 z-10">

            <Badge variant="secondary" className="text-xs">

              SOON

            </Badge>

          </div>

          <CardHeader>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>

                <CardTitle>Transactions per Day</CardTitle>

                <CardDescription>

                  {timeFilter === "all" && "All transactions"}

                  {timeFilter === "24h" && "Last 24 hours"}

                  {timeFilter === "7d" && "Last 7 days"}

                  {timeFilter === "30d" && "Last 30 days"}

                </CardDescription>

              </div>

              <Select value={timeFilter} onValueChange={setTimeFilter}>

                <SelectTrigger className="w-[140px]">

                  <SelectValue placeholder="Select period" />

                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="all">All</SelectItem>

                  <SelectItem value="24h">24 hours</SelectItem>

                  <SelectItem value="7d">7 days</SelectItem>

                  <SelectItem value="30d">30 days</SelectItem>

                </SelectContent>

              </Select>

            </div>

          </CardHeader>

          <CardContent className="opacity-60">

            <ResponsiveContainer width="100%" height={300}>

              <BarChart data={chartData}>

                <defs>

                  <linearGradient id="barGradient" x1="0" y1="1" x2="0" y2="0">

                    <stop offset="0%" stopColor="#737373" stopOpacity={0} />

                    <stop offset="100%" stopColor="#737373" stopOpacity={1} />

                  </linearGradient>

                </defs>

                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />

                <XAxis dataKey="date" className="text-xs" tick={{ fill: tickColor }} />

                <YAxis className="text-xs" tick={{ fill: tickColor }} />

                <Tooltip

                  contentStyle={{

                    backgroundColor: "hsl(var(--card))",

                    border: "1px solid hsl(var(--border))",

                    borderRadius: "6px",

                  }}

                />

                <Bar dataKey="count" fill="url(#barGradient)" stroke="#737373" strokeWidth={1} radius={[4, 4, 0, 0]} />

              </BarChart>

            </ResponsiveContainer>

          </CardContent>

        </Card>



        {/* Transactions Table */}

        <Card>

          <CardHeader>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>

                <CardTitle>Transaction History</CardTitle>

                <CardDescription>All processed transactions</CardDescription>

              </div>

              <Select value={selectedChain} onValueChange={setSelectedChain}>

                <SelectTrigger className="w-[180px]">

                  <SelectValue placeholder="Filter by chain" />

                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="all">All chains</SelectItem>

                  {SUPPORTED_CHAINS.filter(chain => chain.enabled).map((chain) => (

                    <SelectItem key={chain.id} value={chain.id}>

                      {chain.name}

                    </SelectItem>

                  ))}

                </SelectContent>

              </Select>

            </div>

          </CardHeader>

          <CardContent>

            <div className="overflow-x-auto">

              <Table>

                <TableHeader>

                  <TableRow>

                    <TableHead>Hash</TableHead>

                    <TableHead>Chain</TableHead>

                    <TableHead>Amount</TableHead>

                    <TableHead>Fee</TableHead>

                    <TableHead>Status</TableHead>

                    <TableHead>Date</TableHead>

                  </TableRow>

                </TableHeader>

                <TableBody>

                  {paginatedTransactions.map((tx) => {

                    const chain = SUPPORTED_CHAINS.find((c) => c.id === tx.chain)

                    return (

                      <TableRow key={tx.id}>

                        <TableCell className="font-mono text-xs">

                          <div className="flex items-center gap-2">

                            <span>{tx.id.substring(0, 10)}...{tx.id.substring(tx.id.length - 8)}</span>

                            <div className="flex items-center gap-1">

                              <button

                                onClick={() => copyToClipboard(tx.id)}

                                className="p-1 hover:bg-accent rounded transition-colors cursor-pointer"

                                title="Copy transaction hash"

                              >

                                <Copy className="h-3 w-3 text-muted-foreground hover:text-foreground" />

                              </button>

                              <a

                                href={getSnowtraceUrl(tx.id, tx.chain)}

                                target="_blank"

                                rel="noopener noreferrer"

                                className="p-1 hover:bg-accent rounded transition-colors"

                                title="View on Snowtrace"

                              >

                                <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-foreground" />

                              </a>

                            </div>

                          </div>

                        </TableCell>

                        <TableCell>

                          <Badge variant="outline" style={{ borderColor: chain?.color }}>

                            {chain?.symbol}

                          </Badge>

                        </TableCell>

                        <TableCell className="font-mono">

                          {tx.amount} USDC

                        </TableCell>

                        <TableCell className="font-mono text-xs text-muted-foreground">

                          {tx.fee} {chain?.symbol}

                        </TableCell>

                        <TableCell>

                          <Badge variant={tx.status === "success" ? "default" : "secondary"}>

                            {tx.status === "success" ? "Success" : "Pending"}

                          </Badge>

                        </TableCell>

                        <TableCell className="text-sm">{new Date(tx.timestamp).toLocaleString("en-US")}</TableCell>

                      </TableRow>

                    )

                  })}

                </TableBody>

              </Table>

            </div>

            {/* Pagination Controls */}

            <div className="flex items-center justify-between px-2 py-4">

              <div className="text-sm text-muted-foreground">

                Showing {startIndex + 1} to {Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions

              </div>

              <div className="flex items-center gap-2">

                <Button

                  variant="outline"

                  size="sm"

                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}

                  disabled={currentPage === 1}

                >

                  <ChevronLeft className="h-4 w-4" />

                  Previous

                </Button>

                <div className="flex items-center gap-1">

                  {Array.from({ length: totalPages }, (_, i) => i + 1)

                    .filter((page) => {

                      // Show first page, last page, current page, and pages around current

                      return (

                        page === 1 ||

                        page === totalPages ||

                        (page >= currentPage - 1 && page <= currentPage + 1)

                      )

                    })

                    .map((page, index, array) => {

                      // Add ellipsis

                      const showEllipsisBefore = index > 0 && page - array[index - 1] > 1

                      return (

                        <React.Fragment key={page}>

                          {showEllipsisBefore && (

                            <span className="px-2 text-muted-foreground">...</span>

                          )}

                          <Button

                            variant={currentPage === page ? "default" : "outline"}

                            size="sm"

                            onClick={() => setCurrentPage(page)}

                            className="min-w-[40px]"

                          >

                            {page}

                          </Button>

                        </React.Fragment>

                      )

                    })}

                </div>

                <Button

                  variant="outline"

                  size="sm"

                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}

                  disabled={currentPage === totalPages}

                >

                  Next

                  <ChevronRight className="h-4 w-4" />

                </Button>

              </div>

            </div>

          </CardContent>

        </Card>

      </div>

    </div>

  )

}

