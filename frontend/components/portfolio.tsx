"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Percent, PieChart } from "lucide-react"
import Navigation from "@/components/navigation"
import StockChart from "@/components/stock-chart"
import {fetchPortfolio, PortfolioData} from "@/services/portfolio";
import { useEffect, useState } from "react"
import { setDefaultResultOrder } from "dns"

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
  const [portfolioData, setPortfolioData] = useState<PortfolioData[]>();
  const [error, setError] = useState<String>();

  useEffect(() => {
    fetchPortfolio()
      .then(setPortfolioData)
      .catch((err) => {
        console.log(err);
        setError("Can't get portfolio data from the server...")
      })
  }, []);

  if (error) return <div className="p-4 text-red-600">{error}</div>
  if (!portfolioData) return <div className="p-4">Loading...</div>

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="lg:ml-64 p-4 lg:p-8 mobile-content lg:desktop-content">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">投资组合</h1>
          <p className="text-muted-foreground">您的投资表现概览</p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-muted-foreground text-sm">总资产</span>
              </div>
              {/* 总资产数据 */}
              <p className="text-2xl font-bold text-foreground">${mockPortfolioData.totalValue.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-muted-foreground text-sm">总收益</span>
              </div>
              <p className="text-2xl font-bold text-green-600">+${mockPortfolioData.totalGain.toLocaleString()}</p>
              <p className="text-sm text-green-600">+{mockPortfolioData.totalGainPercent}%</p>
            </CardContent>
          </Card>

          <Card className="border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Percent className="h-5 w-5 text-red-600" />
                <span className="text-muted-foreground text-sm">今日变化</span>
              </div>
              <p className="text-2xl font-bold text-red-600">${mockPortfolioData.dayChange.toLocaleString()}</p>
              <p className="text-sm text-red-600">{mockPortfolioData.dayChangePercent}%</p>
            </CardContent>
          </Card>

          <Card className="border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="h-5 w-5 text-blue-600" />
                <span className="text-muted-foreground text-sm">持仓数量</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{portfolioData.length}</p>
              <p className="text-sm text-muted-foreground">支股票</p>
            </CardContent>
          </Card>
        </div>

        {/* Holdings */}
        <Card className="border">
          <CardHeader>
            <CardTitle className="text-foreground">持仓明细</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {portfolioData.map((holding) => (
                <div key={holding.tickerId} className="bg-muted/30 rounded-lg p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Stock Info */}
                    <div className="flex items-center justify-between lg:justify-start gap-4">
                      <div>
                        <h3 className="font-semibold text-foreground">{holding.ticker}</h3>
                        {/* <p className="text-sm text-muted-foreground">{holding.name}</p> */}
                        <p className="text-xs text-muted-foreground">{holding.shares} 股</p>
                      </div>
                      <Badge
                        variant={holding.profit > 0 ? "default" : "destructive"}
                        className={holding.profit > 0 ? "bg-green-600" : "bg-red-600"}
                      >
                        {holding.profitRate}%
                      </Badge>
                    </div>

                    {/* Chart */}
                    <div className="h-16">
                      <StockChart data={holding.history} color={holding.profit > 0 ? "#22c55e" : "#ef4444"} />
                    </div>

                    {/* Performance */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">当前价格</p>
                        <p className="font-semibold text-foreground">${holding.currentPrice}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">平均成本</p>
                        <p className="font-semibold text-foreground">null</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">市值</p>
                        <p className="font-semibold text-foreground">${holding.totalValue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">盈亏</p>
                        <div className="flex items-center gap-1">
                          {holding.profit > 0 ? (
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-600" />
                          )}
                          <span className={`font-semibold ${holding.profit > 0 ? "text-green-600" : "text-red-600"}`}>
                            ${Math.abs(holding.profit).toLocaleString()} ({Math.abs(holding.profitRate)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
