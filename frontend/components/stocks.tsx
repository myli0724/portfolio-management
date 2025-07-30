"use client"

import { SetStateAction, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, TrendingUp, TrendingDown, Star, Loader2 } from "lucide-react"
import Navigation from "@/components/navigation"
import StockChart from "@/components/stock-chart"
import StockList from "@/components/stock-list"
import TradingModal from "@/components/trading-modal"
import { fetchStockById, fetchStockByKeyWord, tradeStock } from "@/services/stocksService"
import { Stock } from "@/types/stock"
import Operation from "./operation"

// Mock data
const mockStocks = [
  {
    id: 1,
    tickerName: "AAPL",
    recentOpenPrice: 175.43,
    recentClosePrice: 182.98,
    date: "2025-07-25",
    marketValue: 2.8,
    volume: 45.2,
    high: 215.4,
    low: 213.24,
    change: -1.26,
    changeRate: -0.41,
    history: [{"date":"2024-07-29","close":215.95},{"date":"2024-07-30","close":218.17},{"date":"2024-07-31","close":220.41},{"date":"2024-08-01","close":223.33},{"date":"2024-08-02","close":218.13},{"date":"2024-08-05","close":198.16},{"date":"2024-08-06","close":204.34},{"date":"2024-08-07","close":205.94},{"date":"2024-08-08","close":212.12},{"date":"2024-08-09","close":211.11},{"date":"2024-08-12","close":215.31},{"date":"2024-08-13","close":218.24},{"date":"2024-08-14","close":219.8},{"date":"2024-08-15","close":223.81}]
  },
  {
    id: 2,
    tickerName: "TSLA",
    recentOpenPrice: 175.43,
    recentClosePrice: 182.98,
    date: "2025-07-25",
    marketValue: 2.8,
    volume: 45.2,
    high: 215.4,
    low: 213.24,
    change: -1.26,
    changeRate: -0.41,
    history: [{"date":"2024-07-29","close":215.95},{"date":"2024-07-30","close":218.17},{"date":"2024-07-31","close":220.41},{"date":"2024-08-01","close":223.33},{"date":"2024-08-02","close":218.13},{"date":"2024-08-05","close":198.16},{"date":"2024-08-06","close":204.34},{"date":"2024-08-07","close":205.94},{"date":"2024-08-08","close":212.12},{"date":"2024-08-09","close":211.11},{"date":"2024-08-12","close":215.31},{"date":"2024-08-13","close":218.24},{"date":"2024-08-14","close":219.8},{"date":"2024-08-15","close":223.81}]
  },
  {
    id: 3,
    tickerName: "MSFT",
    recentOpenPrice: 175.43,
    recentClosePrice: 182.98,
    date: "2025-07-25",
    marketValue: 2.8,
    volume: 45.2,
    high: 215.4,
    low: 213.24,
    change: -1.26,
    changeRate: -0.41,
    history: [{"date":"2024-07-29","close":215.95},{"date":"2024-07-30","close":218.17},{"date":"2024-07-31","close":220.41},{"date":"2024-08-01","close":223.33},{"date":"2024-08-02","close":218.13},{"date":"2024-08-05","close":198.16},{"date":"2024-08-06","close":204.34},{"date":"2024-08-07","close":205.94},{"date":"2024-08-08","close":212.12},{"date":"2024-08-09","close":211.11},{"date":"2024-08-12","close":215.31},{"date":"2024-08-13","close":218.24},{"date":"2024-08-14","close":219.8},{"date":"2024-08-15","close":223.81}]
  }
]

const marketIndices = [
  { name: "S&P 500", value: "4,567.89", change: "+23.45", changePercent: "+0.52%" },
  { name: "NASDAQ", value: "14,234.56", change: "-45.67", changePercent: "-0.32%" },
  { name: "Dow Jones", value: "34,567.12", change: "+123.45", changePercent: "+0.36%" },
]

export default function Stocks() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStockId, setSelectedStockId] = useState(1);
  const [selectedStock, setSelectedStock] = useState<Stock>()
  const [tradingModalOpen, setTradingModalOpen] = useState(false)
  const [tradingType, setTradingType] = useState<"buy" | "sell">("buy")
  const [watchlist, setWatchlist] = useState<number[]>([1, 3])
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<String>();

  useEffect(() => {
    fetchStockById(selectedStockId)
      .then(data => {
        setSelectedStock(data);
      })
      .catch((err) => {
        console.log(err);
        setError("Can't get portfolio data from the server...")
      })
  }, [selectedStockId]);

  const handleTrade = (stock: any, type: "buy" | "sell") => {
    setSelectedStock(stock);
    setTradingType(type);
    setTradingModalOpen(true);
  }

  const toggleWatchlist = (stockId: number) => {
    setWatchlist((prev) => (prev.includes(stockId) ? prev.filter((id) => id !== stockId) : [...prev, stockId]))
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitSearch();
    }
  }

  const submitSearch = () => {
    if (!searchQuery.trim()) return;
    setLoading(true);

    fetchStockByKeyWord(searchQuery)
      .then(data => {
        setSelectedStock(data);
        console.log(selectedStock);
      })
      .catch((err) => {
        console.log(err);
        setError("Can't get portfolio data from the server...")
      })
      .finally(() => {
        setLoading(false);
      })
  }



  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="lg:ml-64 p-4 lg:p-8 mobile-content lg:desktop-content">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Stocks Dashboard</h1>
          <p className="text-muted-foreground">Real-time Market Data & Investment Opportunities</p>
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
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-28"
            />
            <Button onClick={submitSearch} className="absolute right-1 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white h-8 px-3 text-sm">
              {loading ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Search"
              )}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Stock Chart */}
          <div className="xl:col-span-2">
            {selectedStock && (
              <Card className="border">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-foreground">{selectedStock?.tickerName}</CardTitle>
                      {/* <p className="text-muted-foreground">{selectedStock.name}</p> */}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">${selectedStock?.recentClosePrice}</p>
                      <div className="flex items-center gap-1">
                        {selectedStock?.change > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span className={selectedStock?.change > 0 ? "text-green-600" : "text-red-600"}>
                          ${Math.abs(selectedStock?.change).toFixed(2)} ({selectedStock.changeRate}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardDescription>
                  <div className="space-y-2 text-sm text-muted-foreground px-6 pb-2">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <span className="font-semibold">Opening Price:</span> ${selectedStock?.recentOpenPrice}
                      </div>
                      <div>
                        <span className="font-semibold">Closing Price:</span> ${selectedStock?.recentClosePrice}
                      </div>
                      <div>
                        <span className="font-semibold">Date:</span> {selectedStock?.date}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="font-semibold">Highest:</span> ${selectedStock?.high}
                      </div>
                      <div>
                        <span className="font-semibold">Lowest:</span> ${selectedStock?.low}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="font-semibold">Volume:</span> {selectedStock?.volume}
                      </div>
                      <div>
                        <span className="font-semibold">Market Cap:</span> {selectedStock?.marketValue}
                      </div>
                    </div>
                  </div>
                </CardDescription>
                <CardContent>
                  <div className="h-64">
                    <StockChart historyData={selectedStock?.history} />
                  </div>
                  {/* <Operation onTrade={handleTrade} direction="row"></Operation> */}
                  <div className={`flex gap-2 mt-4 "flex-row"`}>
                    <Button
                        onClick={() => handleTrade(selectedStock, "buy")}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 flex-1 text-white"
                    >
                        Buy
                    </Button>
                    <Button
                        onClick={() => handleTrade(selectedStock, "sell")}
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-600/10 flex-1"
                    >
                        Sell
                    </Button>
                </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Stock List */}
          <div>
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-foreground">Popular Stocks</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedStock && (
                  <StockList
                    stocks={mockStocks}
                    onSelectStock={setSelectedStock}
                    selectedStock={selectedStock}
                    watchlist={watchlist}
                    onToggleWatchlist={toggleWatchlist}
                    onTrade={handleTrade}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {selectedStock && (
        <TradingModal
          isOpen={tradingModalOpen}
          onClose={() => setTradingModalOpen(false)}
          stockId={selectedStock.id}
          stockName={selectedStock.tickerName} 
          stockPrice={selectedStock.recentClosePrice} 
          stockChange={selectedStock.change} 
          stockChangeRate={selectedStock.changeRate} 
          type={tradingType} />
      )}
    </div>
  )
}
