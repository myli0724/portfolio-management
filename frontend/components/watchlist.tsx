"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Star, TrendingUp, TrendingDown, Plus, X } from "lucide-react"
import Navigation from "@/components/navigation"
import StockChart from "@/components/stock-chart"

// Mock watchlist data (保持不变)
const mockWatchlist = [
  {
    id: "1",
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 175.43,
    change: 2.34,
    changePercent: 1.35,
    volume: "45.2M",
    data: [170, 172, 168, 175, 173, 176, 175.43],
  },
  {
    id: "3",
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 378.85,
    change: 4.12,
    changePercent: 1.1,
    volume: "23.4M",
    data: [370, 375, 372, 380, 376, 382, 378.85],
  },
  {
    id: "5",
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 892.5,
    change: -12.3,
    changePercent: -1.36,
    volume: "67.8M",
    data: [920, 910, 895, 900, 885, 890, 892.5],
  },
]

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState(mockWatchlist)
  const [searchQuery, setSearchQuery] = useState("")

  const removeFromWatchlist = (stockId: string) => {
    setWatchlist((prev) => prev.filter((stock) => stock.id !== stockId))
  }

  const filteredWatchlist = watchlist.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="lg:ml-64 p-4 lg:p-8 mobile-content lg:desktop-content">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Watchlist</h1>
              <p className="text-muted-foreground">Follow the stocks you are interested in</p>
            </div>
            <Badge variant="secondary">{watchlist.length} Shares</Badge>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search Stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Add Stock Button */}
        <div className="mb-6">
          <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
            <Plus className="h-4 w-4 mr-2" />
            Add Stocks
          </Button>
        </div>

        {/* Watchlist */}
        {filteredWatchlist.length === 0 ? (
          <Card className="border">
            <CardContent className="p-12 text-center">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No stocks in your watchlist.</h3>
              <p className="text-muted-foreground mb-4">Add stocks you are interested in to your watchlist.</p>
              <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                <Plus className="h-4 w-4 mr-2" />
                Add to Watchlist
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredWatchlist.map((stock) => (
              <Card key={stock.id} className="border hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        {stock.symbol}
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      </CardTitle>
                      <p className="text-muted-foreground text-sm">{stock.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-xl font-bold text-foreground">${stock.price}</p>
                        <div className="flex items-center gap-1">
                          {stock.change > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span className={`text-sm ${stock.change > 0 ? "text-green-600" : "text-red-600"}`}>
                            {stock.change > 0 ? "+" : ""}
                            {stock.change} ({stock.changePercent > 0 ? "+" : ""}
                            {stock.changePercent}%)
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromWatchlist(stock.id)}
                        className="text-muted-foreground hover:text-red-600 h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 h-16">
                    <StockChart data={stock.data} color={stock.change > 0 ? "#22c55e" : "#ef4444"} />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>Volume: {stock.volume}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-green-600 hover:bg-green-700 flex-1">Buy</Button>
                    <Button
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-600/10 flex-1 bg-transparent"
                    >
                      Sell
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
