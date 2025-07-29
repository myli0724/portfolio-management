"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, TrendingUp, TrendingDown, Star } from "lucide-react"
import Navigation from "@/components/navigation"
import StockChart from "@/components/stock-chart"
import StockList from "@/components/stock-list"
import TradingModal from "@/components/trading-modal"

// Mock data
const mockStocks = [
  {
    id: "1",
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 175.43,
    change: 2.34,
    changePercent: 1.35,
    volume: "45.2M",
    marketCap: "2.8T",
    data: [170, 172, 168, 175, 173, 176, 175.43],
  },
  {
    id: "2",
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 248.5,
    change: -5.2,
    changePercent: -2.05,
    volume: "89.1M",
    marketCap: "789B",
    data: [260, 255, 250, 245, 252, 248, 248.5],
  },
  {
    id: "3",
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 378.85,
    change: 4.12,
    changePercent: 1.1,
    volume: "23.4M",
    marketCap: "2.8T",
    data: [370, 375, 372, 380, 376, 382, 378.85],
  },
  {
    id: "4",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 138.21,
    change: -1.45,
    changePercent: -1.04,
    volume: "31.2M",
    marketCap: "1.7T",
    data: [142, 140, 138, 141, 139, 137, 138.21],
  },
]

const marketIndices = [
  { name: "S&P 500", value: "4,567.89", change: "+23.45", changePercent: "+0.52%" },
  { name: "NASDAQ", value: "14,234.56", change: "-45.67", changePercent: "-0.32%" },
  { name: "Dow Jones", value: "34,567.12", change: "+123.45", changePercent: "+0.36%" },
]

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStock, setSelectedStock] = useState(mockStocks[0])
  const [tradingModalOpen, setTradingModalOpen] = useState(false)
  const [tradingType, setTradingType] = useState<"buy" | "sell">("buy")
  const [watchlist, setWatchlist] = useState<string[]>(["1", "3"])

  const filteredStocks = mockStocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleTrade = (stock: any, type: "buy" | "sell") => {
    setSelectedStock(stock)
    setTradingType(type)
    setTradingModalOpen(true)
  }

  const toggleWatchlist = (stockId: string) => {
    setWatchlist((prev) => (prev.includes(stockId) ? prev.filter((id) => id !== stockId) : [...prev, stockId]))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="lg:ml-64 p-4 lg:p-8 mobile-content lg:desktop-content">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Investment Dashboard</h1>
          <p className="text-muted-foreground">实时市场数据与投资机会</p>
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {marketIndices.map((index, i) => (
            <Card key={i} className="border">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-muted-foreground text-sm">{index.name}</p>
                    <p className="text-foreground text-xl font-bold">{index.value}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-medium ${index.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                    >
                      {index.change}
                    </p>
                    <p className={`text-xs ${index.changePercent.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                      {index.changePercent}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for Index or Company Name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Stock Chart */}
          <div className="xl:col-span-2">
            <Card className="border">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-foreground">{selectedStock.symbol}</CardTitle>
                    <p className="text-muted-foreground">{selectedStock.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">${selectedStock.price}</p>
                    <div className="flex items-center gap-1">
                      {selectedStock.change > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={selectedStock.change > 0 ? "text-green-600" : "text-red-600"}>
                        ${Math.abs(selectedStock.change)} ({Math.abs(selectedStock.changePercent)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <StockChart data={selectedStock.data} />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => handleTrade(selectedStock, "buy")}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 flex-1"
                  >
                    买入
                  </Button>
                  <Button
                    onClick={() => handleTrade(selectedStock, "sell")}
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-600/10 flex-1"
                  >
                    卖出
                  </Button>
                  <Button
                    onClick={() => toggleWatchlist(selectedStock.id)}
                    variant="outline"
                    size="icon"
                    className={`${watchlist.includes(selectedStock.id) ? "text-yellow-500 bg-yellow-500/10" : ""}`}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stock List */}
          <div>
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-foreground">热门股票</CardTitle>
              </CardHeader>
              <CardContent>
                <StockList
                  stocks={filteredStocks}
                  onSelectStock={setSelectedStock}
                  selectedStock={selectedStock}
                  watchlist={watchlist}
                  onToggleWatchlist={toggleWatchlist}
                  onTrade={handleTrade}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <TradingModal
        isOpen={tradingModalOpen}
        onClose={() => setTradingModalOpen(false)}
        stock={selectedStock}
        type={tradingType}
      />
    </div>
  )
}
