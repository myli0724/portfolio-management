"use client"

import { Button } from "@/components/ui/button"
import { Stock } from "@/types/stock"
import { Star, TrendingUp, TrendingDown } from "lucide-react"

interface StockListProps {
  stocks: Stock[]
  onSelectStock: (stock: Stock) => void
  selectedStock: Stock
  watchlist: number[]
  onToggleWatchlist: (stockId: number) => void
  onTrade: (stock: Stock, type: "buy" | "sell") => void
}

export default function StockList({
  stocks,
  onSelectStock,
  selectedStock,
  watchlist,
  onToggleWatchlist,
  onTrade,
}: StockListProps) {
  return (
    <div className="space-y-3">
      {stocks.map((stock) => (
        <div
          key={stock.id}
          className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-muted/50 ${
            selectedStock.id === stock.id ? "border-red-600 bg-red-600/10" : "border-border bg-muted/20"
          }`}
          onClick={() => onSelectStock(stock)}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div>
                <h3 className="font-semibold text-foreground">{stock.tickerName}</h3>
                {/* <p className="text-xs text-muted-foreground truncate max-w-24">{stock.name}</p> */}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 ${
                  watchlist.includes(stock.id)
                    ? "text-yellow-500 hover:text-yellow-400"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleWatchlist(stock.id)
                }}
              >
                <Star className="h-3 w-3" />
              </Button>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">${stock.recentClosePrice}</p>
              <div className="flex items-center gap-1">
                {stock.change > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={`text-xs ${stock.change > 0 ? "text-green-600" : "text-red-600"}`}>
                  {stock.change > 0 ? "+" : ""}
                  {stock.changeRate.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Mini Chart */}
          <div className="h-8 mb-2">
            <svg className="w-full h-full" viewBox="0 0 100 20">
              <polyline
                fill="none"
                stroke={stock.recentClosePrice - stock.recentOpenPrice >= 0 ? "#16a34a" : "#dc2626"}
                strokeWidth="1"
                points={(() => {
                  const closes = stock.history.map((h) => h.close)
                  const min = Math.min(...closes)
                  const max = Math.max(...closes)
                  const range = max - min || 1

                  return stock.history
                    .map((point, i) => {
                      const x = (i / (stock.history.length - 1)) * 100
                      const y = 20 - ((point.close - min) / range) * 20
                      return `${x},${y}`
                    })
                    .join(" ")
                })()}
              />
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Volume: {stock.volume}</span>
            <span>Market Cap: {stock.marketValue}</span>
          </div>

          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white flex-1 h-7 text-xs"
              onClick={(e) => {
                e.stopPropagation()
                onTrade(stock, "buy")
              }}
            >
              Buy
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-600/10 flex-1 h-7 text-xs bg-transparent"
              onClick={(e) => {
                e.stopPropagation()
                onTrade(stock, "sell")
              }}
            >
              Sell
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
