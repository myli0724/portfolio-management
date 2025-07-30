"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Percent, PieChart, LineChart, Banknote } from "lucide-react"
import Navigation from "@/components/navigation"
import StockChart from "@/components/stock-chart"
import { fetchPortfolio } from "@/services/portfolioService";
import { HistoryItem } from "@/types/history"
import { useEffect, useState } from "react"
import { setDefaultResultOrder } from "dns"
import { Balance, PortfolioApiResponse, PortfolioData, transformBalanceData } from "@/types/portfolio"
import { Button } from "./ui/button"
import Operation from "./operation"
import TradingModal from "./trading-modal"
import { useI18n } from "@/components/i18n-provider"

// Mock portfolio data
const mockPortfolioData = {
  totalValue: 125430.5,
  totalGain: 8234.2,
  totalGainPercent: 7.02,
  dayChange: -234.5,
  dayChangePercent: -0.19,
  holdings: [
    {
      id: "1",
      symbol: "AAPL",
      name: "Apple Inc.",
      shares: 50,
      avgPrice: 165.2,
      currentPrice: 175.43,
      totalValue: 8771.5,
      gain: 511.5,
      gainPercent: 6.19,
      allocation: 7.0,
      data: [170, 172, 168, 175, 173, 176, 175.43],
    },
    {
      id: "2",
      symbol: "TSLA",
      name: "Tesla Inc.",
      shares: 25,
      avgPrice: 260.0,
      currentPrice: 248.5,
      totalValue: 6212.5,
      gain: -287.5,
      gainPercent: -4.42,
      allocation: 4.9,
      data: [260, 255, 250, 245, 252, 248, 248.5],
    },
    {
      id: "3",
      symbol: "MSFT",
      name: "Microsoft Corp.",
      shares: 30,
      avgPrice: 370.0,
      currentPrice: 378.85,
      totalValue: 11365.5,
      gain: 265.5,
      gainPercent: 2.4,
      allocation: 9.1,
      data: [370, 375, 372, 380, 376, 382, 378.85],
    },
  ],
}

export default function Portfolio() {
  const { t } = useI18n();
  const [portfolioDataList, setPortfolioDataList] = useState<PortfolioData[]>();
  const [selectedStock, setSelectedStock] = useState<PortfolioData>();
  const [summary, setSummary] = useState<PortfolioApiResponse["summary"]>();
  const [error, setError] = useState<String>();
  const [tradeAction, setTradeAction] = useState<"buy" | "sell">("buy");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [balance, setBalance] = useState<Balance>();

  useEffect(() => {
    fetchPortfolio()
      .then(data => {
        setPortfolioDataList(data.holdings);
        setSummary(data.summary);
        setBalance(transformBalanceData(data.user))
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
        setError(t("portfolio.error"))
      })
  }, []);

  if (error) return <div className="p-4 text-red-600">{error}</div>
  // if (!portfolioDataList) return <div className="p-4">Loading...</div>

  const handleTrade = (stock: any, type: "buy" | "sell") => {
    setSelectedStock(stock);
    setTradeAction(type);
    setModalOpen(true);
  }

  const handleTradeComplete = (newUserData: any) => {
    // setPortfolioDataList(newUserData.holdings);
    // setSummary(newUserData.summary);
    setBalance(transformBalanceData(newUserData))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="lg:ml-64 p-4 lg:p-8 mobile-content lg:desktop-content">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t("portfolio.title")}</h1>
          <p className="text-muted-foreground">{t("portfolio.subtitle")}</p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className="border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Banknote className="h-5 w-5 text-purple-600" />
                {/* 总和 */}
                <span className="text-muted-foreground text-sm">{t("portfolio.totalAssets")}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">${balance?.totalBalance.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <LineChart className="h-5 w-5 text-green-700" />
                <span className="text-muted-foreground text-sm">{t("portfolio.assets")}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">${balance?.assets.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-muted-foreground text-sm">{t("portfolio.availableFunds")}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">${balance?.availableBalance.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">

                <TrendingUp className={` h-5 w-5 ${ summary?.totalProfit && summary?.totalProfit >= 0 ? "text-green-600" : "text-red-600" }`}/>
                <span className="text-muted-foreground text-sm">{t("portfolio.totalGainLoss")}</span>
              </div>
              {summary?.totalProfit !== undefined && (
                <>
                  <p className={`text-2xl font-bold ${ summary?.totalProfit >= 0 ? "text-green-600" : "text-red-600" }`}>
                    {summary.totalProfit >= 0 ? "+" : "-"}${Math.abs(summary.totalProfit).toLocaleString()}
                  </p>
                  <p className={`text-sm ${ summary?.totalProfit >= 0 ? "text-green-600" : "text-red-600" }`}>{summary?.totalChangeRate}%</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Percent className={` h-5 w-5 ${ summary?.todayChange && summary?.todayChange >= 0 ? "text-green-600" : "text-red-600" }`} />
                <span className="text-muted-foreground text-sm">{t("portfolio.dailyChange")}</span>

              </div>
              {summary?.todayChange !== undefined && (
                <>
                  <p className={`text-2xl font-bold ${ summary?.todayChange >= 0 ? "text-green-600" : "text-red-600" }`}>
                    {summary.todayChange >= 0 ? "+" : "-"}${Math.abs(summary.todayChange).toLocaleString()}
                  </p>
                  <p className={`text-sm ${ summary?.todayChange >= 0 ? "text-green-600" : "text-red-600" }`}>{summary?.todayChangeRate}%</p>
                </>
              )}
              
            </CardContent>
          </Card>

          <Card className="border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="h-5 w-5 text-blue-600" />
                <span className="text-muted-foreground text-sm">{t("portfolio.numberOfHoldings")}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{summary?.holdingCount}</p>
              <p className="text-sm text-muted-foreground">{t("portfolio.stocks")}</p>
            </CardContent>
          </Card>
        </div>
        
        {portfolioDataList ? (
          <>
            {/* Holdings */}
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-foreground">{t("portfolio.holdingsBreakdown")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioDataList.map((portfolioData) => (
                    <div key={portfolioData.tickerId} className="bg-muted/30 rounded-lg p-4">
                      <div className="grid grid-cols-1 lg:grid-cols-[3fr_3fr_3fr_1fr] gap-4">
                        {/* Stock Info */}
                        <div className="flex items-center justify-between lg:justify-start gap-4">
                          <div>
                            <h3 className="font-semibold text-foreground">{portfolioData.ticker}</h3>
                            {/* <p className="text-sm text-muted-foreground">{portfolioData.name}</p> */}
                            <p className="text-xs text-muted-foreground">{portfolioData.shares} {portfolioData.shares > 1 ? t("portfolio.shares") : t("portfolio.share")}</p>
                          </div>
                          <Badge
                            variant={portfolioData.profit > 0 ? "default" : "destructive"}
                            className={portfolioData.profit > 0 ? "bg-green-600" : "bg-red-600"}
                          >
                            {portfolioData.profitRate}%
                          </Badge>
                        </div>

                        {/* Chart */}
                        <div className="h-16">
                          <StockChart historyData={portfolioData.history} color={portfolioData.profit > 0 ? "#22c55e" : "#ef4444"} />
                        </div>

                        {/* Performance */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">{t("portfolio.currentPrice")}</p>
                            <p className="font-semibold text-foreground">${portfolioData.currentPrice.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{t("portfolio.avgPurchasePrice")}</p>
                            <p className="font-semibold text-foreground">NULL</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{t("portfolio.marketValue")}</p>
                            <p className="font-semibold text-foreground">${portfolioData.totalValue.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{t("portfolio.gainLoss")}</p>
                            <div className="flex items-center gap-1">
                              {portfolioData.profit > 0 ? (
                                <TrendingUp className="h-3 w-3 text-green-600" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-red-600" />
                              )}
                              <span className={`font-semibold ${portfolioData.profit > 0 ? "text-green-600" : "text-red-600"}`}>
                                ${Math.abs(portfolioData.profit).toLocaleString()} ({Math.abs(portfolioData.profitRate)}%)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Operations */}
                        {/* <Operation onTrade={handleTrade} direction="row"></Operation> */}
                        <div className="flex items-center justify-center flex-col gap-1">
                            <Button
                              onClick={() => handleTrade(portfolioData, "buy")}
                              className="h-7 min-w-[64px] px-2 text-xs bg-green-600 hover:bg-green-700 text-white"
                            >
                              {t("portfolio.buy")}
                            </Button>
                            <Button
                              onClick={() => handleTrade(portfolioData, "sell")}
                              variant="outline"
                              className="h-7 min-w-[64px] px-2 text-xs border-red-600 text-red-600 hover:bg-red-600/10"
                            >
                              {t("portfolio.sell")}
                            </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border p-6">
                <div className="h-16 bg-muted animate-pulse rounded-md" />
              </Card>
            ))}
          </>
        )}
        {selectedStock && balance && (
          <TradingModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            stockId={selectedStock.tickerId}
            stockName={selectedStock.ticker} 
            stockPrice={selectedStock.currentPrice} 
            stockChange={selectedStock.profit} 
            stockChangeRate={selectedStock.profitRate} 
            userBalance={balance?.availableBalance}
            shares={selectedStock.shares}
            type={tradeAction}
            onTradeComplete={handleTradeComplete}>
          </TradingModal> 
        )}
      </div>
    </div>
  )
}
