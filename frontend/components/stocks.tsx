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
import { useI18n } from "./i18n-provider"
import { fetchPortfolio } from "@/services/portfolioService"
import { Balance, PortfolioData, transformBalanceData } from "@/types/portfolio"

// Mock data
const mockStocks = [
  {
    id: 1,
    tickerName: "AAPL",
    recentOpenPrice: 213.88,
    recentClosePrice: 214.70,
    date: "2025-07-25",
    marketValue: Number('8.63B'),
    volume: Number('40.2M'),
    high: 215.24,
    low: 213.40,
    change: -1.84,
    changeRate: -0.86,
    history: [{"date":"2024-07-25","close":214.70},{"date":"2024-07-24","close":213.90},{"date":"2024-07-23","close":215.0},{"date":"2024-07-22","close":213.14},{"date":"2024-07-21","close":212.10},{"date":"2024-07-18","close":210.87},{"date":"2024-07-17","close":210.57},{"date":"2024-07-16","close":210.30},{"date":"2024-07-15","close":209.22},{"date":"2024-07-14","close":209.93},{"date":"2024-07-11","close":210.57},{"date":"2024-07-10","close":210.51},{"date":"2024-07-09","close":209.53},{"date":"2024-07-08","close":210.10}]
  },
  {
    id: 4,
    tickerName: "GOLD",
    recentOpenPrice: 3334.0,
    recentClosePrice: 3344.0,
    date: "2025-07-25",
    marketValue: Number('3.9M'),
    volume: 1175,
    high: 3345.0,
    low: 3326.5,
    change: 10.0,
    changeRate: -0.29,
    history: [{"date":"2024-07-25","close":3344.0},{"date":"2024-07-24","close":3367.0},{"date":"2024-07-23","close":3430.30},{"date":"2024-07-22","close":3411.0},{"date":"2024-07-21","close":3350.30},{"date":"2024-07-18","close":3338.20},{"date":"2024-07-17","close":3313.80},{"date":"2024-07-16","close":3341.20},{"date":"2024-07-15","close":3341.0},{"date":"2024-07-14","close":3367.0},{"date":"2024-07-11","close":3330.5},{"date":"2024-07-10","close":3323.60},{"date":"2024-07-09","close":3289.40},{"date":"2024-07-08","close":3330.40}]
  },
  {
    id: 3,
    tickerName: "DOW",
    recentOpenPrice: 25.51,
    recentClosePrice: 24.64,
    date: "2025-07-25",
    marketValue: Number('909.4M'),
    volume: Number('36.9M'),
    high: 25.65,
    low: 24.42,
    change: -0.88,
    changeRate: -3.41,
    history: [{"date":"2024-07-25","close":24.42},{"date":"2024-07-24","close":27.19},{"date":"2024-07-23","close":30.21},{"date":"2024-07-22","close":28.46},{"date":"2024-07-21","close":28.59},{"date":"2024-07-18","close":28.65},{"date":"2024-07-17","close":28.01},{"date":"2024-07-16","close":27.96},{"date":"2024-07-15","close":28.67},{"date":"2024-07-14","close":29.65},{"date":"2024-07-11","close":29.62},{"date":"2024-07-10","close":29.70},{"date":"2024-07-09","close":29.36},{"date":"2024-07-08","close":27.71}]
  }
]

const marketIndices = [
  { name: "S&P 500", value: "4,567.89", change: "+23.45", changePercent: "+0.52%" },
  { name: "NASDAQ", value: "14,234.56", change: "-45.67", changePercent: "-0.32%" },
  { name: "Dow Jones", value: "34,567.12", change: "+123.45", changePercent: "+0.36%" },
]

export default function Stocks() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStockId, setSelectedStockId] = useState(1);
  const [selectedStock, setSelectedStock] = useState<Stock>()
  const [tradingModalOpen, setTradingModalOpen] = useState(false)
  const [tradingType, setTradingType] = useState<"buy" | "sell">("buy")
  const [watchlist, setWatchlist] = useState<number[]>([1, 3])
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<String>("");
  const [portfolioDataList, setPortfolioDataList] = useState<PortfolioData[]>();
  const [balance, setBalance] = useState<Balance>();

  useEffect(() => {
    fetchPortfolio()
      .then(data => {
        setPortfolioDataList(data.holdings);
        setBalance(transformBalanceData(data.user))
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
        setError(t("balance.error"))
      })
  }, [])

  useEffect(() => {
    setLoading(true);
    fetchStockById(selectedStockId)
      .then(data => {
        setSelectedStock(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError(t("stocks.errorFetchData"));
        setLoading(false);
      })
  }, [selectedStockId]);

  const handleTrade = (stock: any, type: "buy" | "sell") => {
    setSelectedStock(stock);
    setTradingType(type);
    setTradingModalOpen(true);
  }

  const handleTradeComplete = (newUserData: any) => {
    // 重新从后台拉取数据以获取最新的持股数量
    fetchPortfolio()
      .then(data => {
        setPortfolioDataList(data.holdings);
        setBalance(transformBalanceData(data.user));
        console.log("交易完成后重新获取数据:", data);
      })
      .catch((err) => {
        console.log("重新获取数据失败:", err);
        setError(t("balance.error"));
      });
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
        setError("");
        console.log(selectedStock);
      })
      .catch((err) => {
        console.log(err);
        setError(t("stocks.errorFetchData"))
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
          <h1 className="text-3xl font-bold text-foreground mb-2">{t("stocks.title")}</h1>
          <p className="text-muted-foreground">{t("stocks.subtitle")}</p>
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
              placeholder={t("stocks.searchPlaceholder")} 
              value={searchQuery}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-28"
            />
            <Button onClick={submitSearch} className="absolute right-1 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white h-8 px-3 text-sm">
              {loading ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                t("stocks.search")
              )}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Stock Chart */}
          {error !== "" ? (
            <div className="xl:col-span-2 text-center text-red-600 mt-4">
              {t("stocks.noMatchingStock")}
            </div>
          ) : (
            <div className="xl:col-span-2">
            {loading ? (
              <Card className="border">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="h-6 w-24 bg-muted animate-pulse rounded"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-8 w-32 bg-muted animate-pulse rounded mb-2"></div>
                      <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                    </div>
                  </div>
                </CardHeader>
                <CardDescription>
                  <div className="space-y-2 text-sm text-muted-foreground px-6 pb-2">
                    <div className="grid grid-cols-3 gap-3">
                      <div><div className="h-4 w-20 bg-muted animate-pulse rounded"></div></div>
                      <div><div className="h-4 w-20 bg-muted animate-pulse rounded"></div></div>
                      <div><div className="h-4 w-20 bg-muted animate-pulse rounded"></div></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div><div className="h-4 w-20 bg-muted animate-pulse rounded"></div></div>
                      <div><div className="h-4 w-20 bg-muted animate-pulse rounded"></div></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div><div className="h-4 w-20 bg-muted animate-pulse rounded"></div></div>
                      <div><div className="h-4 w-20 bg-muted animate-pulse rounded"></div></div>
                      <div><div className="h-4 w-20 bg-muted animate-pulse rounded"></div></div>
                    </div>
                  </div>
                </CardDescription>
                <CardContent>
                  <div className="h-64 bg-muted animate-pulse rounded"></div>
                  <div className="flex gap-2 mt-4">
                    <div className="h-10 bg-muted animate-pulse rounded flex-1"></div>
                    <div className="h-10 bg-muted animate-pulse rounded flex-1"></div>
                  </div>
                </CardContent>
              </Card>
            ) : selectedStock ? (
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
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <span className="font-semibold">{t("stocks.openingPrice")}:</span> ${selectedStock?.recentOpenPrice}
                      </div>
                      <div>
                        <span className="font-semibold">{t("stocks.closingPrice")}:</span> ${selectedStock?.recentClosePrice}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <span className="font-semibold">{t("stocks.highest")}:</span> ${selectedStock?.high}
                      </div>
                      <div>
                        <span className="font-semibold">{t("stocks.lowest")}:</span> ${selectedStock?.low}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <span className="font-semibold">{t("stocks.volume")}:</span> {selectedStock?.volume}
                      </div>
                      <div>
                        <span className="font-semibold">{t("stocks.marketCap")}:</span> {selectedStock?.marketValue}
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">Date:</span> {selectedStock?.date}
                      </div>
                    </div>
                  </div>
                </CardDescription>
                <CardContent>
                  <div className="h-72">
                    <StockChart historyData={selectedStock?.history} />
                  </div>
                  {/* <Operation onTrade={handleTrade} direction="row"></Operation> */}
                  <div className={`flex gap-2 mt-4 "flex-row"`}>
                    <Button
                        onClick={() => handleTrade(selectedStock, "buy")}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 flex-1 text-white"
                    >
                        {t("portfolio.buy")}
                    </Button>
                    <Button
                        onClick={() => handleTrade(selectedStock, "sell")}
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-600/10 flex-1"
                    >
                        {t("portfolio.sell")}
                    </Button>
                </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
          )}
          
          {/* Stock List */}
          <div>
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-foreground">{t("stocks.popularStocks")}</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="h-4 w-16 bg-muted animate-pulse rounded mb-1"></div>
                            <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
                          </div>
                          <div className="text-right">
                            <div className="h-4 w-20 bg-muted animate-pulse rounded mb-1"></div>
                            <div className="h-3 w-16 bg-muted animate-pulse rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : selectedStock ? (
                  <StockList
                    stocks={mockStocks}
                    onSelectStock={setSelectedStock}
                    selectedStock={selectedStock}
                    watchlist={watchlist}
                    onToggleWatchlist={toggleWatchlist}
                    onTrade={handleTrade}
                  />
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {selectedStock && balance && (
        <TradingModal
          shares={portfolioDataList?.find(holding => holding.tickerId === selectedStock.id)?.shares || 0}
          onTradeComplete={handleTradeComplete}
          isOpen={tradingModalOpen}
          onClose={() => setTradingModalOpen(false)}
          stockId={selectedStock.id}
          stockName={selectedStock.tickerName}
          stockPrice={selectedStock.recentClosePrice}
          stockChange={selectedStock.change}
          stockChangeRate={selectedStock.changeRate}
          type={tradingType} userBalance={balance?.availableBalance} />
      )}
    </div>
  )
}
